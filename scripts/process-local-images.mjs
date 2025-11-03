#!/usr/bin/env node
/**
 * Build-time 圖片處理腳本
 *
 * 功能：
 * 1. 掃描所有 MDX 檔案中的本地圖片路徑（file:/// 或絕對路徑）
 * 2. 自動轉換為 WebP 格式並壓縮
 * 3. 上傳到 Cloudflare R2
 * 4. 替換 MDX 中的路徑為 CDN URL
 *
 * 使用方式：
 * - 文章中使用：![描述](file:///Users/waynliu/Pictures/photo.jpg)
 * - 或使用絕對路徑：![描述](/Users/waynliu/Pictures/photo.jpg)
 * - 執行 npm run build 時自動處理
 */

import sharp from 'sharp'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { globby } from 'globby'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import pLimit from 'p-limit'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONTENT_DIR = path.resolve(__dirname, '../content')
const CACHE_DIR = path.resolve(__dirname, '../.image-cache')
const R2_BASE_URL = process.env.R2_BASE_URL || 'https://img.waynspace.com'
const R2_BUCKET = process.env.R2_BUCKET || 'blog-post'
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY

// 驗證環境變數
if (!CF_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ 缺少必要的環境變數！')
  console.error('請確保 .env 檔案中包含：')
  console.error('  - CF_ACCOUNT_ID')
  console.error('  - R2_ACCESS_KEY_ID')
  console.error('  - R2_SECRET_ACCESS_KEY')
  process.exit(1)
}

// S3 Client 配置
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// 統計資訊
const stats = {
  totalFiles: 0,
  processedImages: 0,
  skippedImages: 0,
  errors: 0,
  totalSize: 0,
  compressedSize: 0,
}

/**
 * 檢查檔案是否存在
 */
async function exists(filepath) {
  try {
    await fs.access(filepath)
    return true
  } catch {
    return false
  }
}

/**
 * 確保目錄存在
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    // 目錄已存在，忽略錯誤
  }
}

/**
 * 計算檔案的 MD5 hash
 */
function calculateHash(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex')
}

/**
 * 檢查 R2 上是否已存在該檔案
 */
async function checkR2FileExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    }))
    return true
  } catch (error) {
    if (error.name === 'NotFound') {
      return false
    }
    throw error
  }
}

/**
 * 從快取中獲取圖片處理記錄
 */
async function getCachedImage(hash) {
  const cacheFile = path.join(CACHE_DIR, `${hash}.json`)
  if (await exists(cacheFile)) {
    const content = await fs.readFile(cacheFile, 'utf-8')
    return JSON.parse(content)
  }
  return null
}

/**
 * 儲存圖片處理記錄到快取
 */
async function saveCachedImage(hash, data) {
  await ensureDir(CACHE_DIR)
  const cacheFile = path.join(CACHE_DIR, `${hash}.json`)
  await fs.writeFile(cacheFile, JSON.stringify(data, null, 2))
}

/**
 * 處理單張圖片
 */
async function processImage(localPath, year, month, slug) {
  try {
    // 讀取圖片
    const imageBuffer = await fs.readFile(localPath)
    const originalSize = imageBuffer.length
    const hash = calculateHash(imageBuffer)

    // 檢查快取
    const cached = await getCachedImage(hash)
    if (cached) {
      console.log(`  ⚡ 使用快取: ${path.basename(localPath)} → ${cached.cdnUrl}`)
      stats.skippedImages++
      return cached.cdnUrl
    }

    // 生成檔案名稱
    const originalName = path.parse(localPath).name
    const webpName = `${originalName}.webp`
    const r2Key = `${year}/${month}/${slug}/${webpName}`
    const cdnUrl = `${R2_BASE_URL}/${r2Key}`

    // 檢查 R2 是否已存在
    if (await checkR2FileExists(r2Key)) {
      console.log(`  ✓ 已存在於 R2: ${webpName}`)
      await saveCachedImage(hash, { cdnUrl, r2Key, originalSize, compressedSize: 0 })
      stats.skippedImages++
      return cdnUrl
    }

    // 轉換為 WebP
    console.log(`  📸 處理中: ${path.basename(localPath)} → ${webpName}`)

    // 智能壓縮：大圖用較低品質
    const quality = originalSize > 2 * 1024 * 1024 ? 75 : 85

    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality })
      .resize({ width: 2000, withoutEnlargement: true }) // 限制最大寬度
      .toBuffer()

    const compressedSize = webpBuffer.length
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1)

    // 上傳到 R2
    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: webpBuffer,
      ContentType: 'image/webp',
    }))

    console.log(`  ✅ 已上傳: ${r2Key}`)
    console.log(`     原始大小: ${(originalSize / 1024).toFixed(1)} KB`)
    console.log(`     壓縮後: ${(compressedSize / 1024).toFixed(1)} KB (節省 ${compressionRatio}%)`)

    // 儲存到快取
    await saveCachedImage(hash, { cdnUrl, r2Key, originalSize, compressedSize })

    stats.processedImages++
    stats.totalSize += originalSize
    stats.compressedSize += compressedSize

    return cdnUrl
  } catch (error) {
    console.error(`  ❌ 處理失敗: ${path.basename(localPath)}`)
    console.error(`     錯誤: ${error.message}`)
    stats.errors++
    return null
  }
}

/**
 * 解析本地圖片路徑（支援 file:// 和絕對路徑）
 */
function parseLocalPath(imagePath) {
  // 移除 file:// 前綴
  if (imagePath.startsWith('file://')) {
    return imagePath.replace('file://', '')
  }

  // 絕對路徑直接返回
  if (path.isAbsolute(imagePath)) {
    return imagePath
  }

  return null
}

/**
 * 處理單個 MDX 檔案
 */
async function processMdxFile(mdxPath) {
  try {
    // 讀取 MDX 檔案
    const content = await fs.readFile(mdxPath, 'utf-8')
    const { data: frontmatter, content: markdownContent } = matter(content)

    // 提取年月份和 slug
    const relativePath = path.relative(CONTENT_DIR, mdxPath)
    const pathParts = relativePath.split(path.sep)

    const year = pathParts[0]
    const month = pathParts[1]
    const slug = path.parse(pathParts[pathParts.length - 1]).name

    if (!year || !month || year.length !== 4 || month.length !== 2) {
      return // 跳過不符合格式的檔案
    }

    console.log(`\n📝 處理文章: ${year}/${month}/${slug}`)

    // 找到所有本地圖片引用
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const matches = [...markdownContent.matchAll(imageRegex)]

    const localImages = matches
      .map(match => ({ alt: match[1], path: match[2], fullMatch: match[0] }))
      .filter(img => {
        const localPath = parseLocalPath(img.path)
        return localPath !== null
      })

    if (localImages.length === 0) {
      console.log(`  ⏭️  沒有本地圖片，跳過`)
      return
    }

    console.log(`  找到 ${localImages.length} 張本地圖片`)

    // 處理每張圖片
    let updatedContent = markdownContent
    let updatedFrontmatter = { ...frontmatter }

    // 並行處理（限制 3 個並發）
    const limit = pLimit(3)

    const tasks = localImages.map(img =>
      limit(async () => {
        const localPath = parseLocalPath(img.path)

        // 檢查檔案是否存在
        if (!await exists(localPath)) {
          console.log(`  ⚠️  檔案不存在，跳過: ${localPath}`)
          return null
        }

        // 處理圖片
        const cdnUrl = await processImage(localPath, year, month, slug)

        if (cdnUrl) {
          return { original: img.fullMatch, cdnUrl, alt: img.alt }
        }
        return null
      })
    )

    const results = await Promise.all(tasks)

    // 替換 Markdown 中的路徑
    for (const result of results) {
      if (result) {
        const newMarkdown = `![${result.alt}](${result.cdnUrl})`
        updatedContent = updatedContent.replace(result.original, newMarkdown)
      }
    }

    // 檢查並更新 frontmatter 中的 coverImage
    if (frontmatter.coverImage) {
      const coverLocalPath = parseLocalPath(frontmatter.coverImage)
      if (coverLocalPath && await exists(coverLocalPath)) {
        console.log(`  🖼️  處理封面圖...`)
        const coverCdnUrl = await processImage(coverLocalPath, year, month, slug)
        if (coverCdnUrl) {
          updatedFrontmatter.coverImage = coverCdnUrl
        }
      }
    }

    // 寫回 MDX 檔案
    const updatedMdx = matter.stringify(updatedContent, updatedFrontmatter)
    await fs.writeFile(mdxPath, updatedMdx)

    console.log(`  💾 已更新 MDX 檔案`)

  } catch (error) {
    console.error(`❌ 處理檔案失敗: ${mdxPath}`)
    console.error(`   錯誤: ${error.message}`)
    stats.errors++
  }
}

/**
 * 主要處理流程
 */
async function main() {
  console.log('🚀 開始處理本地圖片...\n')
  console.log('📋 配置：')
  console.log(`   內容目錄: ${CONTENT_DIR}`)
  console.log(`   R2 Bucket: ${R2_BUCKET}`)
  console.log(`   CDN URL: ${R2_BASE_URL}`)
  console.log(`   快取目錄: ${CACHE_DIR}\n`)

  // 確保快取目錄存在
  await ensureDir(CACHE_DIR)

  // 找到所有 MDX 檔案
  const mdxFiles = await globby(['**/*.mdx'], {
    cwd: CONTENT_DIR,
    absolute: true,
  })

  stats.totalFiles = mdxFiles.length
  console.log(`找到 ${mdxFiles.length} 個 MDX 檔案\n`)

  if (mdxFiles.length === 0) {
    console.log('⚠️  沒有找到任何 MDX 檔案')
    return
  }

  // 依序處理每個檔案
  for (const mdxFile of mdxFiles) {
    await processMdxFile(mdxFile)
  }

  // 顯示統計資訊
  console.log('\n' + '='.repeat(60))
  console.log('✨ 處理完成！\n')
  console.log('📊 統計資訊：')
  console.log(`   處理檔案: ${stats.totalFiles} 個`)
  console.log(`   處理圖片: ${stats.processedImages} 張`)
  console.log(`   跳過圖片: ${stats.skippedImages} 張`)
  console.log(`   錯誤數量: ${stats.errors} 個`)

  if (stats.processedImages > 0) {
    const totalSizeMB = (stats.totalSize / 1024 / 1024).toFixed(2)
    const compressedSizeMB = (stats.compressedSize / 1024 / 1024).toFixed(2)
    const savedRatio = ((1 - stats.compressedSize / stats.totalSize) * 100).toFixed(1)

    console.log(`\n💾 檔案大小：`)
    console.log(`   原始總大小: ${totalSizeMB} MB`)
    console.log(`   壓縮後大小: ${compressedSizeMB} MB`)
    console.log(`   節省空間: ${savedRatio}%`)
  }

  console.log('\n' + '='.repeat(60))

  if (stats.errors > 0) {
    console.log(`\n⚠️  有 ${stats.errors} 個錯誤，請檢查上面的錯誤訊息`)
    process.exit(1)
  }
}

// 執行
main().catch(error => {
  console.error('\n❌ 發生嚴重錯誤：', error)
  process.exit(1)
})
