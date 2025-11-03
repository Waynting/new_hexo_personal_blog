import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { globby } from 'globby'
import { markdownToHtml, extractExcerpt, calculateReadTime } from './markdown'
import { Post, Category } from '@/types/blog'

// 保持向後兼容的 Post 接口
export interface PostMetadata {
  slug: string
  title: string
  date: string
  tags: string[]
  categories: string[]
  coverImage?: string
  content: string
  year?: string
  month?: string
}

const postsDirectory = path.join(process.cwd(), 'content')

// 从 Markdown 内容中提取第一张图片 URL
function extractFirstImage(content: string): string | null {
  // 匹配 Markdown 图片语法：![](url) 或 [![](url)](link)
  const imageRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/
  const match = content.match(imageRegex)
  return match ? match[1] : null
}

// 獲取所有分類
export async function getAllCategories(): Promise<Category[]> {
  const posts = await getAllPosts()
  const categoryMap = new Map<string, number>()
  
  posts.forEach(post => {
    const category = post.category || 'Uncategorized'
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })
  
  return Array.from(categoryMap.entries()).map(([name, count], index) => ({
    id: index + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    count,
  }))
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await globby(['**/*.mdx'], { cwd: postsDirectory })
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDirectory, file)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      // 从路径提取年份和月份 YYYY/MM/slug.mdx
      const pathParts = file.split(path.sep)
      const year = pathParts[0]
      const month = pathParts[1]
      
      // 獲取第一個分類作為主要分類
      const mainCategory = Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories[0]
        : 'Uncategorized'

      const slug = file.replace(/\.mdx$/, '').replace(/\\/g, '/')
      const excerpt = extractExcerpt(content)
      const readTime = calculateReadTime(content)

      // 如果没有设置封面图，尝试从内容中提取第一张图片
      const coverImage = data.coverImage || data.cover || data.featuredImage || extractFirstImage(content)

      return {
        slug,
        title: data.title || '',
        excerpt,
        content,
        date: data.date || new Date().toISOString(),
        modifiedDate: data.modifiedDate || data.date,
        category: mainCategory,
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: {
          name: data.author?.name || 'Wayn Liu',
          email: data.author?.email || 'wayntingliu@gmail.com',
          avatar: data.author?.avatar,
        },
        readTime,
        seo: {
          metaTitle: data.seo?.metaTitle || data.title || '',
          metaDescription: data.seo?.metaDescription || excerpt,
          keywords: data.seo?.keywords || data.tags || [],
          ogImage: data.seo?.ogImage || coverImage || '',
        },
        featuredImage: coverImage,
        coverImage,
      }
    })
  )

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // slug 格式可能是 "YYYY/MM/文章标题" 或 "文章标题"
  // 先尝试完整路径
  let filePath = path.join(postsDirectory, `${slug}.mdx`)
  
  try {
    await fs.access(filePath)
  } catch {
    // 如果完整路径不存在，尝试在所有子目录中搜索
    const files = await globby(['**/*.mdx'], { cwd: postsDirectory })
    const matchingFile = files.find(f => {
      const fileSlug = f.replace(/\.mdx$/, '').replace(/\\/g, '/')
      const fileName = path.basename(f, '.mdx')
      return fileSlug === slug || fileName === slug
    })
    
    if (!matchingFile) {
      return null
    }
    
    filePath = path.join(postsDirectory, matchingFile)
  }

  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // 从路径提取年份和月份
    const relativePath = path.relative(postsDirectory, filePath).replace(/\.mdx$/, '')
    const pathParts = relativePath.split(path.sep)
    const year = pathParts[0]
    const month = pathParts[1]
    
    const mainCategory = Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories[0]
      : 'Uncategorized'

    const excerpt = extractExcerpt(content)
    const readTime = calculateReadTime(content)

    // 轉換 markdown 為 HTML
    const htmlContent = await markdownToHtml(content)

    // 如果没有设置封面图，尝试从内容中提取第一张图片
    const coverImage = data.coverImage || data.cover || data.featuredImage || extractFirstImage(content)

    return {
      slug: relativePath.replace(/\\/g, '/'),
      title: data.title || '',
      excerpt,
      content: htmlContent,
      date: data.date || new Date().toISOString(),
      modifiedDate: data.modifiedDate || data.date,
      category: mainCategory,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: {
        name: data.author?.name || 'Wayn Liu',
        email: data.author?.email || 'wayntingliu@gmail.com',
        avatar: data.author?.avatar,
      },
      readTime,
      seo: {
        metaTitle: data.seo?.metaTitle || data.title || '',
        metaDescription: data.seo?.metaDescription || excerpt,
        keywords: data.seo?.keywords || data.tags || [],
        ogImage: data.seo?.ogImage || coverImage || '',
      },
      featuredImage: coverImage,
      coverImage,
    }
  } catch {
    return null
  }
}

// 获取所有年份
export async function getAllYears(): Promise<string[]> {
  const files = await globby(['**/*.mdx'], { cwd: postsDirectory })
  const years = new Set<string>()
  
  files.forEach(file => {
    const pathParts = file.split(path.sep)
    if (pathParts[0]) {
      years.add(pathParts[0])
    }
  })
  
  return Array.from(years).sort((a, b) => b.localeCompare(a))
}

// 获取指定年份的所有月份
export async function getMonthsByYear(year: string): Promise<string[]> {
  const files = await globby([`${year}/**/*.mdx`], { cwd: postsDirectory })
  const months = new Set<string>()
  
  files.forEach(file => {
    const pathParts = file.split(path.sep)
    if (pathParts[1]) {
      months.add(pathParts[1])
    }
  })
  
  return Array.from(months).sort((a, b) => b.localeCompare(a))
}

// 获取指定年份和月份的文章
export async function getPostsByYearMonth(year: string, month: string): Promise<Post[]> {
  const files = await globby([`${year}/${month}/*.mdx`], { cwd: postsDirectory })
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDirectory, file)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const mainCategory = Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories[0]
        : 'Uncategorized'

      const slug = file.replace(/\.mdx$/, '').replace(/\\/g, '/')
      const excerpt = extractExcerpt(content)
      const readTime = calculateReadTime(content)

      // 如果没有设置封面图，尝试从内容中提取第一张图片
      const coverImage = data.coverImage || data.cover || data.featuredImage || extractFirstImage(content)

      return {
        slug,
        title: data.title || '',
        excerpt,
        content,
        date: data.date || new Date().toISOString(),
        modifiedDate: data.modifiedDate || data.date,
        category: mainCategory,
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: {
          name: data.author?.name || 'Wayn Liu',
          email: data.author?.email || 'wayntingliu@gmail.com',
          avatar: data.author?.avatar,
        },
        readTime,
        seo: {
          metaTitle: data.seo?.metaTitle || data.title || '',
          metaDescription: data.seo?.metaDescription || excerpt,
          keywords: data.seo?.keywords || data.tags || [],
          ogImage: data.seo?.ogImage || coverImage || '',
        },
        featuredImage: coverImage,
        coverImage,
      }
    })
  )

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}
