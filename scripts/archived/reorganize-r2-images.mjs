#!/usr/bin/env node
/**
 * 重新组织 R2 上的图片
 * 从 wp-content/uploads/YYYY/MM/ 移动到 blog/YYYY/MM/文章标题/
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

const BUCKET = process.env.R2_BUCKET || 'blog-post'
const RCLONE_REMOTE = process.env.RCLONE_REMOTE || 'r2'
const PREFIX = process.env.R2_PREFIX || 'blog'
const CONTENT_DIR = path.resolve(__dirname, '../content')
const BASEURL = process.env.R2_BASE_URL || 'https://img.waynspace.com'

console.log('🔄 开始重新组织 R2 上的图片...\n')
console.log('📋 配置：')
console.log(`   Bucket: ${BUCKET}`)
console.log(`   Remote: ${RCLONE_REMOTE}`)
console.log(`   Prefix: ${PREFIX}`)
console.log(`   源路径: wp-content/uploads/`)
console.log(`   目标路径: ${PREFIX}/YYYY/MM/文章标题/\n`)

// 步骤 1: 读取所有 content 文章，提取图片引用
console.log('📝 步骤 1: 读取文章并提取图片引用...\n')

const files = await globby(['**/*.mdx'], { cwd: CONTENT_DIR })
const articleImageMap = new Map() // 文章 slug -> [图片文件名]

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file)
  const content = await fs.readFile(filePath, 'utf8')
  
  // 提取年月和文章 slug
  const pathParts = file.replace(/\.mdx$/, '').split(path.sep)
  const year = pathParts[0]
  const month = pathParts[1]
  const articleSlug = path.basename(file, '.mdx')
  
  if (!year || !month) continue
  
  // 从文章中提取所有图片文件名（R2 URL）
  const imagePattern = new RegExp(`${BASEURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/${PREFIX}/${year}/${month}/${articleSlug}/([^)]+)\\.webp`, 'gi')
  const matches = content.matchAll(imagePattern)
  
  const images = []
  for (const match of matches) {
    const imageName = match[1] // 例如: IMG_2133
    if (!images.includes(imageName)) {
      images.push(imageName)
    }
  }
  
  if (images.length > 0) {
    const key = `${year}/${month}/${articleSlug}`
    articleImageMap.set(key, { year, month, articleSlug, images })
    console.log(`   ${key}: ${images.length} 个图片`)
  }
}

console.log(`\n✅ 找到 ${articleImageMap.size} 篇文章有图片引用\n`)

// 步骤 2: 列出 wp-content/uploads 下的所有图片
console.log('📋 步骤 2: 列出 wp-content/uploads 下的图片...\n')

// 使用 rclone lsf 递归列出文件（更高效）
const { stdout: uploadsList } = await execa('rclone', [
  'lsf',
  `${RCLONE_REMOTE}:${BUCKET}/wp-content/uploads/`,
  '-R' // 递归
], { stdio: 'pipe', timeout: 60000 })

const uploadsImages = new Map() // YYYY/MM -> [文件名]

for (const line of uploadsList.split('\n')) {
  if (!line.trim()) continue
  
  // rclone lsf 格式: path/to/file.webp
  const filePath = line.trim()
  if (!filePath.endsWith('.webp')) continue
  
  const fileName = path.basename(filePath, path.extname(filePath)) // 去掉扩展名，得到原图名
  
  // 从路径提取年月: 2024/06/IMG_xxx.webp -> 2024/06
  const pathMatch = filePath.match(/^(\d{4})\/(\d{2})\//)
  if (pathMatch) {
    const year = pathMatch[1]
    const month = pathMatch[2]
    const key = `${year}/${month}`
    
    if (!uploadsImages.has(key)) {
      uploadsImages.set(key, [])
    }
    uploadsImages.get(key).push({ fileName, fullPath: filePath, ext: path.extname(filePath) })
  }
}

console.log(`✅ 找到 ${uploadsImages.size} 个月份的图片\n`)

// 步骤 3: 匹配图片到文章并移动
console.log('🔄 步骤 3: 匹配图片到文章并移动...\n')

let totalMoved = 0
let totalSkipped = 0

for (const [articleKey, articleInfo] of articleImageMap.entries()) {
  const { year, month, articleSlug, images } = articleInfo
  const yearMonthKey = `${year}/${month}`
  
  if (!uploadsImages.has(yearMonthKey)) {
    console.log(`⚠️  跳过 ${articleKey}（wp-content/uploads 中没有 ${yearMonthKey} 的图片）`)
    continue
  }
  
  const availableImages = uploadsImages.get(yearMonthKey)
  const targetDir = `${PREFIX}/${year}/${month}/${articleSlug}/`
  
  console.log(`📦 处理文章: ${articleKey}`)
  console.log(`   目标目录: ${targetDir}`)
  
  // 匹配文章中的图片到可用的图片
  for (const imageName of images) {
    // 在可用图片中查找匹配的文件（可能需要匹配多种扩展名或格式）
    const matchedImage = availableImages.find(img => {
      // 精确匹配
      if (img.fileName === imageName) return true
      // 文件名包含匹配（处理带后缀的情况）
      if (img.fileName.startsWith(imageName)) return true
      // 原图名包含（处理 IMG_xxx-1 的情况）
      if (img.fileName.split('-')[0] === imageName) return true
      return false
    })
    
    if (matchedImage) {
      const sourcePath = `wp-content/uploads/${matchedImage.fullPath}`
      const targetPath = `${targetDir}${imageName}.webp`
      
      try {
        console.log(`   📤 移动: ${path.basename(matchedImage.fullPath)} → ${targetPath}`)
        
        // 使用 rclone copy 复制文件（保留原文件，安全）
        await execa('rclone', [
          'copy',
          `${RCLONE_REMOTE}:${BUCKET}/${sourcePath}`,
          `${RCLONE_REMOTE}:${BUCKET}/${targetPath}`,
          '--no-check-dest' // 不检查目标是否存在，直接覆盖
        ], { stdio: 'pipe', timeout: 30000 })
        
        totalMoved++
      } catch (error) {
        console.error(`   ❌ 移动失败: ${error.message}`)
        totalSkipped++
      }
    } else {
      console.log(`   ⚠️  未找到匹配的图片: ${imageName}.webp`)
      totalSkipped++
    }
  }
  
  console.log('')
}

console.log('✨ 处理完成！\n')
console.log(`   - 成功移动: ${totalMoved} 个文件`)
console.log(`   - 跳过/失败: ${totalSkipped} 个文件\n`)
console.log('💡 提示：')
console.log('   文件已从 wp-content/uploads/ 复制到新的目录结构')
console.log('   原文件仍然保留在 wp-content/uploads/ 中')
console.log('   确认无误后，可以手动删除 wp-content/uploads/ 目录')

