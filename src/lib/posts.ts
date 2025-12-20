import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { globby } from 'globby'
import { markdownToHtml, extractExcerpt, calculateReadTime } from './markdown'
import { Post, Category } from '@/types/blog'

// 标准化日期格式为 ISO 8601
function normalizeDate(date: any): string {
  if (!date) return new Date().toISOString()
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return new Date().toISOString()
    }
    return dateObj.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

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

// 分类名称到slug的映射表（用于保持SEO友好的URL）
const categorySlugMap: Record<string, string> = {
  'ntu-life': 'ntu-life',
  '台大資管生活': 'ntu-life',
  'science-class-journal': 'science-class-journal',
  '科學班生活': 'science-class-journal',
  'personal-journal': 'personal-journal',
  '生活日誌': 'personal-journal',
  'photography-notes': 'photography-notes',
  '攝影筆記': 'photography-notes',
  'city-walk': 'city-walk',
  '城市漫步': 'city-walk',
  'reading-notes': 'reading-notes',
  '讀書筆記與心得': 'reading-notes',
  'tech-notes': 'tech-notes',
  '技術筆記': 'tech-notes',
}

// 分类名称标准化映射（将英文分类名映射到中文显示名）
const categoryNameMap: Record<string, string> = {
  'ntu-life': '台大資管生活',
  'science-class-journal': '科學班生活',
  'personal-journal': '生活日誌',
  'photography-notes': '攝影筆記',
  'city-walk': '城市漫步',
  'reading-notes': '讀書筆記與心得',
  'tech-notes': '技術筆記',
}

// 从 Markdown 内容中提取第一张图片 URL
function extractFirstImage(content: string): string | null {
  // 匹配 Markdown 图片语法：![](url) 或 [![](url)](link)
  const imageRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/
  const match = content.match(imageRegex)
  return match ? match[1] : null
}

// 获取文章摘要，优先级：summary > seo.metaDescription > extractExcerpt(content)
function getExcerpt(data: any, content: string): string {
  // 优先使用 frontmatter 中的 summary
  if (data.summary) {
    return data.summary
  }
  // 其次使用 seo.metaDescription
  if (data.seo?.metaDescription) {
    return data.seo.metaDescription
  }
  // 最后从内容中提取
  return extractExcerpt(content)
}

// 獲取所有分類
export async function getAllCategories(): Promise<Category[]> {
  const posts = await getAllPosts()
  const categoryMap = new Map<string, number>()
  
  posts.forEach(post => {
    // 标准化分类名称：如果分类名是英文，映射到中文显示名
    const rawCategory = post.category || 'Uncategorized'
    const normalizedCategory = categoryNameMap[rawCategory] || rawCategory
    categoryMap.set(normalizedCategory, (categoryMap.get(normalizedCategory) || 0) + 1)
  })
  
  return Array.from(categoryMap.entries()).map(([name, count], index) => {
    // 优先使用映射表中的slug，如果没有则使用默认生成规则
    const slug = categorySlugMap[name] || name.toLowerCase().replace(/\s+/g, '-')
    
    return {
      id: index + 1,
      name,
      slug,
      count,
    }
  })
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await globby(['**/*.{md,mdx}'], { cwd: postsDirectory })
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDirectory, file)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      // 从路径提取年份和月份 YYYY/MM/slug.mdx
      const pathParts = file.split(path.sep)
      const year = pathParts[0]
      const month = pathParts[1]
      
      // 獲取第一個分類作為主要分類，并标准化分类名称
      const rawCategory = Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories[0]
        : 'Uncategorized'
      const mainCategory = categoryNameMap[rawCategory] || rawCategory

      // 优先使用 frontmatter 中的 slug，如果没有则使用文件名（不含扩展名）
      const articleSlug = data.slug || path.basename(file, path.extname(file))
      // slug 使用完整路径格式 YYYY/MM/articleSlug，包含日期路径以便重定向和路由匹配
      const slug = year && month ? `${year}/${month}/${articleSlug}` : articleSlug
      const excerpt = getExcerpt(data, content)
      const readTime = calculateReadTime(content)

      // 如果没有设置封面图，尝试从内容中提取第一张图片
      const coverImage = data.coverImage || data.cover || data.featuredImage || extractFirstImage(content)

      return {
        slug,
        title: data.title || '',
        excerpt,
        content,
        date: normalizeDate(data.date),
        modifiedDate: normalizeDate(data.modifiedDate || data.date),
        category: mainCategory,
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: {
          name: data.author?.name || 'Wei-Ting Liu',
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
        // 保存文件路径信息用于构建图片路径
        filePath: file.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/'),
      }
    })
  )

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // slug 格式可能是 "YYYY/MM/articleSlug" 或 "articleSlug"
  // 先尝试完整路径（向后兼容）
  // 先尝试 .md，再尝试 .mdx
  let filePath = path.join(postsDirectory, `${slug}.md`)
  
  try {
    await fs.access(filePath)
  } catch {
    // 尝试 .mdx
    filePath = path.join(postsDirectory, `${slug}.mdx`)
    try {
      await fs.access(filePath)
    } catch {
      // 如果完整路径不存在，尝试在所有子目录中搜索
      const files = await globby(['**/*.{md,mdx}'], { cwd: postsDirectory })
      
      // 首先尝试通过文件路径匹配
      let matchingFile = files.find(f => {
        const fileSlug = f.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/')
        const fileName = path.basename(f, path.extname(f))
        return fileSlug === slug || fileName === slug
      })
      
      // 如果还没找到，尝试通过 frontmatter 中的 slug 匹配
      if (!matchingFile) {
        for (const file of files) {
          const filePathToCheck = path.join(postsDirectory, file)
          try {
            const fileContents = await fs.readFile(filePathToCheck, 'utf8')
            const { data } = matter(fileContents)
            
            // 从路径提取年份和月份
            const pathParts = file.split(path.sep)
            const year = pathParts[0]
            const month = pathParts[1]
            
            // 构建完整路径格式的 slug
            const articleSlug = data.slug || path.basename(file, path.extname(file))
            const fullSlug = year && month ? `${year}/${month}/${articleSlug}` : articleSlug
            
            // 检查是否匹配（支持完整路径或只匹配 articleSlug，向后兼容）
            if (fullSlug === slug || articleSlug === slug) {
              matchingFile = file
              break
            }
          } catch {
            // 忽略读取错误，继续搜索
            continue
          }
        }
      }
      
      if (!matchingFile) {
        return null
      }
      
      filePath = path.join(postsDirectory, matchingFile)
    }
  }

  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // 从路径提取年份和月份
    const relativePath = path.relative(postsDirectory, filePath).replace(/\.(md|mdx)$/, '')
    const pathParts = relativePath.split(path.sep)
    const year = pathParts[0]
    const month = pathParts[1]
    
    const rawCategory = Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories[0]
      : 'Uncategorized'
    const mainCategory = categoryNameMap[rawCategory] || rawCategory

    // 优先使用 frontmatter 中的 slug，如果没有则使用文件名（不含扩展名）
    const articleSlug = data.slug || path.basename(relativePath, path.extname(relativePath))
    // slug 使用完整路径格式 YYYY/MM/articleSlug，包含日期路径以便重定向和路由匹配
    const slug = year && month ? `${year}/${month}/${articleSlug}` : articleSlug

    const excerpt = getExcerpt(data, content)
    const readTime = calculateReadTime(content)

    // 轉換 markdown 為 HTML
    const htmlContent = await markdownToHtml(content)

    // 如果没有设置封面图，尝试从内容中提取第一张图片
    const coverImage = data.coverImage || data.cover || data.featuredImage || extractFirstImage(content)

    return {
      slug,
      // 保存文件路径信息用于构建图片路径
      filePath: relativePath,
      title: data.title || '',
      excerpt,
      content: htmlContent,
      date: data.date || new Date().toISOString(),
      modifiedDate: data.modifiedDate || data.date,
      category: mainCategory,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: {
        name: data.author?.name || 'Wei-Ting Liu',
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

// 按时间分组文章（客户端使用）
export function groupPostsByTime(posts: Post[]): Record<string, Record<string, Post[]>> {
  const groups: Record<string, Record<string, Post[]>> = {};

  posts.forEach(post => {
    const date = new Date(post.date);
    if (isNaN(date.getTime())) return;

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    groups[year][month].push(post);
  });

  // 对每个月份的文章按日期排序（最新的在前）
  Object.keys(groups).forEach(year => {
    Object.keys(groups[year]).forEach(month => {
      groups[year][month].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  });

  return groups;
}

// 获取所有年份
export async function getAllYears(): Promise<string[]> {
  const files = await globby(['**/*.{md,mdx}'], { cwd: postsDirectory })
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
  const files = await globby([`${year}/**/*.{md,mdx}`], { cwd: postsDirectory })
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
  const files = await globby([`${year}/${month}/*.{md,mdx}`], { cwd: postsDirectory })
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDirectory, file)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const rawCategory = Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories[0]
        : 'Uncategorized'
      const mainCategory = categoryNameMap[rawCategory] || rawCategory

      // 优先使用 frontmatter 中的 slug，如果没有则使用文件名（不含扩展名）
      const articleSlug = data.slug || path.basename(file, path.extname(file))
      // slug 使用完整路径格式 YYYY/MM/articleSlug，包含日期路径以便重定向和路由匹配
      const slug = year && month ? `${year}/${month}/${articleSlug}` : articleSlug
      const excerpt = getExcerpt(data, content)
      const readTime = calculateReadTime(content)

      // 如果没有设置封面图，尝试从内容中提取第一张图片
      const coverImage = data.coverImage || data.cover || data.featuredImage || extractFirstImage(content)

      return {
        slug,
        title: data.title || '',
        excerpt,
        content,
        date: normalizeDate(data.date),
        modifiedDate: normalizeDate(data.modifiedDate || data.date),
        category: mainCategory,
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: {
          name: data.author?.name || 'Wei-Ting Liu',
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
        // 保存文件路径信息用于构建图片路径
        filePath: file.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/'),
      }
    })
  )

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}
