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

export interface Photo {
  url: string;
  key: string;
  name: string;
  size: number;
  lastModified: string;
}

/**
 * 从 R2 获取所有照片
 */
async function fetchPhotosFromR2(): Promise<Photo[]> {
  // 检查环境变量
  if (!process.env.CF_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not configured');
  }

  const photos: Photo[] = [];
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

// 使用 Next.js 缓存（1小时缓存）
export const getPhotos = unstable_cache(
  async () => fetchPhotosFromR2(),
  ['photos-list'],
  {
    revalidate: 3600, // 1小时后重新验证
    tags: ['photos'], // 可以用于手动重新验证
  }
);

