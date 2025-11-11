import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { unstable_cache } from 'next/cache';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const R2_BUCKET = process.env.R2_BUCKET || 'blog-post';
const R2_BASE_URL = process.env.R2_BASE_URL || 'https://img.waynspace.com';
const PHOTOS_PREFIX = 'personal-photos/';

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// 缓存时间：1小时（3600秒）
const CACHE_DURATION = 3600;

/**
 * 从 R2 获取所有照片（带缓存）
 */
async function fetchPhotosFromR2() {
  // 检查环境变量
  if (!process.env.CF_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not configured');
  }

  const photos: Array<{
    url: string;
    key: string;
    name: string;
    size: number;
    lastModified: string;
  }> = [];
  let continuationToken: string | undefined = undefined;

  do {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: PHOTOS_PREFIX,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);
    
    if (response.Contents) {
      for (const object of response.Contents) {
        if (!object.Key) continue;
        
        const ext = object.Key.toLowerCase().substring(object.Key.lastIndexOf('.'));
        if (!IMAGE_EXTENSIONS.includes(ext)) continue;

        const key = object.Key;
        const relativePath = key.replace(PHOTOS_PREFIX, '');
        const url = `${R2_BASE_URL}/${key}`;
        
        photos.push({
          url,
          key,
          name: relativePath.split('/').pop() || relativePath,
          size: object.Size || 0,
          lastModified: object.LastModified?.toISOString() || '',
        });
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  // 按最后修改时间倒序排列（最新的在前）
  photos.sort((a, b) => {
    const dateA = new Date(a.lastModified).getTime();
    const dateB = new Date(b.lastModified).getTime();
    return dateB - dateA;
  });

  return photos;
}

// 使用 Next.js 缓存（在构建时和运行时缓存）
const getCachedPhotos = unstable_cache(
  async () => fetchPhotosFromR2(),
  ['photos-list'],
  {
    revalidate: CACHE_DURATION, // 1小时后重新验证
    tags: ['photos'], // 可以用于手动重新验证
  }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // 获取所有照片（带缓存）
    const allPhotos = await getCachedPhotos();
    
    // 分页处理
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPhotos = allPhotos.slice(startIndex, endIndex);
    
    const response = NextResponse.json({
      photos: paginatedPhotos,
      pagination: {
        page,
        limit,
        total: allPhotos.length,
        totalPages: Math.ceil(allPhotos.length / limit),
        hasMore: endIndex < allPhotos.length,
      },
    });

    // 添加缓存头
    response.headers.set(
      'Cache-Control',
      `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
    );

    return response;
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

