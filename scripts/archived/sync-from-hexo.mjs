import { globby } from 'globby'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const HEXO = path.resolve(__dirname, '../source/_posts')
const DEST = path.resolve(__dirname, '../content')

await fs.mkdir(DEST, { recursive: true })
const files = await globby(['**/*.md'], { cwd: HEXO })

console.log(`📝 找到 ${files.length} 篇文章，开始同步...`)

let synced = 0

for (const f of files) {
  const src = path.join(HEXO, f)
  const raw = await fs.readFile(src, 'utf8')
  const { content, data } = matter(raw)

  // 解析日期以确定年份和月份
  let year = null
  let month = null
  
  if (data.date) {
    const date = new Date(data.date)
    if (!isNaN(date.getTime())) {
      year = date.getFullYear().toString()
      month = String(date.getMonth() + 1).padStart(2, '0')
    }
  }

  // 如果无法从日期获取，尝试从文件路径获取 YYYY/MM/文章标题.md
  if (!year || !month) {
    const pathParts = f.split(path.sep)
    if (pathParts.length >= 3) {
      year = pathParts[0]
      month = pathParts[1]
    }
  }

  // 如果仍然无法获取，使用当前日期
  if (!year || !month) {
    const now = new Date()
    year = now.getFullYear().toString()
    month = String(now.getMonth() + 1).padStart(2, '0')
    console.log(`⚠️  无法确定 ${f} 的日期，使用当前日期: ${year}/${month}`)
  }

  // 提取 slug（从文件名，移除 .md）
  const base = path.basename(f, '.md')
  const slug = base

  // 处理 front matter
  const fm = {
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    categories: data.categories || [],
    coverImage: data.coverImage || data.cover || '',
    slug,
  }

  // 重新组合 front matter 和内容
  const frontMatterString = Object.entries(fm)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - "${v}"`).join('\n')}`
      }
      return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`
    })
    .join('\n')

  const out = `---\n${frontMatterString}\n---\n\n${content}`
  
  // 目标路径：YYYY/MM/slug.mdx
  const destDir = path.join(DEST, year, month)
  await fs.mkdir(destDir, { recursive: true })
  const destPath = path.join(destDir, `${slug}.mdx`)
  
  await fs.writeFile(destPath, out)
  console.log(`✅ ${year}/${month}/${slug}.mdx`)
  synced++
}

console.log(`\n✨ 同步完成！共 ${synced} 篇文章`)
console.log(`   目标目录: ${DEST}`)
