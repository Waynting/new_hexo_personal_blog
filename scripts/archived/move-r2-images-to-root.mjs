#!/usr/bin/env node
/**
 * 将 R2 上的图片从 wp-content/uploads/ 移动到根目录
 * 从 blog-post/wp-content/uploads/YYYY/MM/xxx.webp 
 * 移动到 blog-post/YYYY/MM/文章标题/xxx.webp
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
const PREFIX = process.env.R2_PREFIX || 'blog-post'
const CONTENT_DIR = path.resolve(__dirname, '../content')

console.log('🔄 开始将 R2 图片从 wp-content/uploads/ 移动到根目录...\n')
console.log('📋 配置：')
console.log(`   Bucket: ${BUCKET}`)
console.log(`   Remote: ${RCLONE_REMOTE}`)
console.log(`   源路径: wp-content/uploads/YYYY/MM/图片.webp`)
console.log(`   目标路径: YYYY/MM/文章标题/图片.webp (直接在 bucket 根目录下)\n`)

// 步骤 1: 读取所有 content 文章，构建图片到文章的映射
console.log('📝 步骤 1: 读取文章并提取图片映射...\n')

const files = await globby(['**/*.mdx'], { cwd: CONTENT_DIR })
const imageToArticleMap = new Map() // 图片文件名 -> { year, month, articleSlug }

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file)
  const content = await fs.readFile(filePath, 'utf8')
  
  // 提取年月和文章 slug
  const pathParts = file.replace(/\.mdx$/, '').split(path.sep)
  const year = pathParts[0]
  const month = pathParts[1]
  const articleSlug = path.basename(file, '.mdx')
  
  if (!year || !month) continue
  
  // 从文章中提取所有图片文件名
  // 匹配格式: https://img.waynspace.com/blog-post/2025/07/文章标题/图片.webp
  const imagePattern = new RegExp(`blog-post/(\\d{4})/(\\d{2})/${articleSlug}/([^/)]+)\\.webp`, 'gi')
  const matches = content.matchAll(imagePattern)
  
  for (const match of matches) {
    const imageFileName = match[3] // 例如: IMG_20250713_104927
    // URL 解码文件名（处理可能的编码）
    let decodedFileName = imageFileName
    try {
      decodedFileName = decodeURIComponent(imageFileName)
    } catch (e) {
      // 解码失败，使用原文件名
    }
    
    // 存储映射：图片文件名 -> 文章信息
    imageToArticleMap.set(decodedFileName, { year, month, articleSlug })
    imageToArticleMap.set(imageFileName, { year, month, articleSlug }) // 同时存储原文件名
    
    // 也存储去掉尺寸后缀的版本
    const nameWithoutSize = decodedFileName.replace(/-\d+x\d+$/, '').replace(/-\d+$/, '').replace(/-scaled$/, '')
    if (nameWithoutSize !== decodedFileName) {
      imageToArticleMap.set(nameWithoutSize, { year, month, articleSlug })
    }
  }
}

console.log(`✅ 找到 ${imageToArticleMap.size} 个图片映射\n`)

// 步骤 2: 列出 wp-content/uploads 下的所有图片
console.log('📋 步骤 2: 列出 wp-content/uploads 下的图片...\n')

const { stdout: uploadsList } = await execa('rclone', [
  'lsf',
  `${RCLONE_REMOTE}:${BUCKET}/wp-content/uploads/`,
  '-R'
], { stdio: 'pipe', timeout: 60000 })

const filesToMove = []

for (const line of uploadsList.split('\n')) {
  if (!line.trim() || !line.trim().endsWith('.webp')) continue
  
  const filePath = line.trim()
  
  // 从路径提取年月: wp-content/uploads/2024/06/IMG_xxx.webp -> 2024, 06
  const pathMatch = filePath.match(/^(\d{4})\/(\d{2})\/(.+)$/)
  if (pathMatch) {
    const fileYear = pathMatch[1]
    const fileMonth = pathMatch[2]
    const fileName = path.basename(filePath, '.webp')
    
    // 尝试匹配到文章
    let articleInfo = imageToArticleMap.get(fileName)
    
    // 如果没找到，尝试去掉尺寸后缀再匹配
    if (!articleInfo) {
      const nameWithoutSize = fileName.replace(/-\d+x\d+$/, '').replace(/-\d+$/, '').replace(/-scaled$/, '')
      articleInfo = imageToArticleMap.get(nameWithoutSize)
    }
    
    // 如果还是没找到，使用文件中的年月
    if (!articleInfo) {
      // 尝试从同一年月的文章中找到匹配的
      for (const [imgName, info] of imageToArticleMap.entries()) {
        if (info.year === fileYear && info.month === fileMonth && 
            (fileName.includes(imgName) || imgName.includes(fileName.split('-')[0]))) {
          articleInfo = info
          break
        }
      }
    }
    
    // 如果仍然没找到，就使用文件中的年月，文章标题使用年份月份（作为备用）
    if (!articleInfo) {
      // 查找该年月下的第一篇文章作为默认
      for (const [imgName, info] of imageToArticleMap.entries()) {
        if (info.year === fileYear && info.month === fileMonth) {
          articleInfo = info
          break
        }
      }
    }
    
    if (articleInfo) {
      filesToMove.push({
        source: `wp-content/uploads/${filePath}`,
        target: `${articleInfo.year}/${articleInfo.month}/${articleInfo.articleSlug}/${fileName}.webp`,
        fileName
      })
    } else {
      console.log(`⚠️  未找到匹配的文章: ${filePath} (${fileYear}/${fileMonth})`)
    }
  }
}

console.log(`✅ 找到 ${filesToMove.length} 个文件需要移动\n`)

// 步骤 3: 移动文件
console.log('🔄 步骤 3: 移动文件到新位置...\n')

let moved = 0
let skipped = 0

for (const { source, target, fileName } of filesToMove) {
  const sourcePath = `${RCLONE_REMOTE}:${BUCKET}/${source}`
  // 目标路径：直接在 bucket 根目录下，格式为 YYYY/MM/文章标题/图片.webp
  // 不需要 PREFIX，因为 bucket 名本身就是 blog-post
  const targetPath = `${RCLONE_REMOTE}:${BUCKET}/${target}`
  
  try {
    console.log(`📤 移动: ${fileName}.webp`)
    console.log(`   从: ${source}`)
    console.log(`   到: ${target}`)
    
    // 先复制文件到新位置
    await execa('rclone', [
      'copyto',
      sourcePath,
      targetPath,
      '--no-check-dest'
    ], { stdio: 'pipe', timeout: 30000 })
    
    console.log(`   ✅ 成功\n`)
    moved++
  } catch (error) {
    console.error(`   ❌ 失败: ${error.message}\n`)
    skipped++
  }
}

console.log('✨ 处理完成！\n')
console.log(`   - 成功移动: ${moved} 个文件`)
console.log(`   - 跳过/失败: ${skipped} 个文件\n`)
console.log('💡 提示：')
console.log('   文件已复制到新位置，原文件仍在 wp-content/uploads/ 中')
console.log('   确认无误后，可以手动删除 wp-content/uploads/ 目录')
console.log(`   使用命令: rclone purge ${RCLONE_REMOTE}:${BUCKET}/wp-content/uploads/`)

