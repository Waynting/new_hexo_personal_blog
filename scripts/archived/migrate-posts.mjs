import { globby } from 'globby'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.resolve(__dirname, '../out_md/posts')
const DEST_DIR = path.resolve(__dirname, '../source/_posts')

async function migratePosts() {
  console.log('🚀 开始迁移文章...')
  console.log(`源目录: ${SOURCE_DIR}`)
  console.log(`目标目录: ${DEST_DIR}`)

  await fs.mkdir(DEST_DIR, { recursive: true })

  // 查找所有 index.md 文件
  const files = await globby(['**/index.md'], { cwd: SOURCE_DIR })

  let migrated = 0
  let skipped = 0

  for (const file of files) {
    const srcPath = path.join(SOURCE_DIR, file)
    const srcDir = path.dirname(srcPath)
    
    // 从路径中提取 YYYY/MM 和文章标题
    // 例如: 2025/06/113-2-coursesreview/index.md
    const relativePath = path.relative(SOURCE_DIR, srcDir)
    const pathParts = relativePath.split(path.sep)
    const year = pathParts[0]  // 2025
    const month = pathParts[1] // 06
    const dirName = pathParts[2] // 113-2-coursesreview

    if (!year || !month || !dirName) {
      console.log(`⚠️  跳过无效路径: ${file}`)
      continue
    }

    // 读取 markdown 文件
    const content = await fs.readFile(srcPath, 'utf8')

    // 目标路径：保持年份月份结构 YYYY/MM/文章标题.md
    const destDirPath = path.join(DEST_DIR, year, month)
    await fs.mkdir(destDirPath, { recursive: true })
    const destPath = path.join(destDirPath, `${dirName}.md`)

    // 检查目标文件是否已存在
    try {
      await fs.access(destPath)
      console.log(`⏭️  跳过（已存在）: ${year}/${month}/${dirName}.md`)
      skipped++
      continue
    } catch {
      // 文件不存在，继续处理
    }

    // 复制图片文件夹（如果存在）
    const imagesDir = path.join(srcDir, 'images')
    const destImagesDir = path.join(destDirPath, dirName)
    
    try {
      await fs.access(imagesDir)
      // 复制整个目录（包括 images 文件夹）
      await fs.mkdir(destImagesDir, { recursive: true })
      const imageFiles = await globby(['**/*'], { cwd: imagesDir })
      
      for (const imgFile of imageFiles) {
        const srcImgPath = path.join(imagesDir, imgFile)
        const destImgPath = path.join(destImagesDir, imgFile)
        await fs.mkdir(path.dirname(destImgPath), { recursive: true })
        await fs.copyFile(srcImgPath, destImgPath)
      }
      console.log(`📸 复制图片: ${year}/${month}/${dirName}/images/`)
    } catch {
      // 没有图片文件夹，跳过
    }

    // 写入 markdown 文件
    await fs.writeFile(destPath, content, 'utf8')
    console.log(`✅ 迁移: ${year}/${month}/${dirName}.md`)
    migrated++
  }

  console.log(`\n✨ 迁移完成！`)
  console.log(`   - 已迁移: ${migrated} 篇文章`)
  console.log(`   - 已跳过: ${skipped} 篇文章`)
}

migratePosts().catch(console.error)
