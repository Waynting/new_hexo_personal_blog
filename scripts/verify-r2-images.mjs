#!/usr/bin/env node
/**
 * 验证 content/ 中的图片路径是否与 R2 上的实际文件匹配
 */

import { execa } from 'execa'
import { globby } from 'globby'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASEURL = process.env.R2_BASE_URL || 'https://img.waynspace.com'
const PREFIX = process.env.R2_PREFIX || 'blog'
const BUCKET = process.env.R2_BUCKET || 'blog-post'
const RCLONE_REMOTE = process.env.RCLONE_REMOTE || 'r2'
const CONTENT_DIR = path.resolve(__dirname, '../content')

console.log('🔍 验证 content/ 中的图片路径与 R2 上的实际文件...\n')

// 从 content 文件中提取所有图片 URL
const files = await globby(['**/*.mdx'], { cwd: CONTENT_DIR })
let totalImages = 0
let foundImages = 0
let missingImages = 0

const missingFiles = []

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file)
  const content = await fs.readFile(filePath, 'utf8')
  
  // 提取所有 R2 图片 URL
  const imagePattern = new RegExp(`${BASEURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/${PREFIX}/([^)]+)\\.webp`, 'gi')
  const matches = content.matchAll(imagePattern)
  
  for (const match of matches) {
    totalImages++
    const fullPath = match[1] // 例如: 2025/05/2025-im-week/IMG_2133
    const r2Path = `${RCLONE_REMOTE}:${BUCKET}/${PREFIX}/${fullPath}.webp`
    
    try {
      // 检查文件是否存在
      await execa('rclone', ['stat', r2Path], { stdio: 'pipe', timeout: 5000 })
      foundImages++
    } catch (error) {
      missingImages++
      missingFiles.push({
        file,
        image: `${fullPath}.webp`,
        r2Path: `${PREFIX}/${fullPath}.webp`
      })
    }
  }
}

console.log(`📊 验证结果:`)
console.log(`   总图片数: ${totalImages}`)
console.log(`   ✅ 找到: ${foundImages}`)
console.log(`   ❌ 缺失: ${missingImages}\n`)

if (missingFiles.length > 0) {
  console.log('⚠️  以下图片在 R2 上找不到:\n')
  // 按文章分组
  const byArticle = {}
  for (const item of missingFiles) {
    if (!byArticle[item.file]) {
      byArticle[item.file] = []
    }
    byArticle[item.file].push(item.image)
  }
  
  for (const [article, images] of Object.entries(byArticle)) {
    console.log(`   ${article}:`)
    for (const img of images) {
      console.log(`     - ${img}`)
    }
    console.log('')
  }
  
  console.log('💡 提示:')
  console.log(`   检查 R2 上的实际文件: rclone ls ${RCLONE_REMOTE}:${BUCKET}/${PREFIX}/YYYY/MM/文章标题/`)
} else {
  console.log('🎉 所有图片路径都正确！')
}

