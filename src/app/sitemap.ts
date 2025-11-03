import { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories, getAllYears } from '@/lib/posts'
import { siteConfig } from '@/config/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const categories = await getAllCategories()
  const years = await getAllYears()

  // 文章頁面
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: new Date(post.modifiedDate || post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 分類頁面
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/posts/category/${encodeURIComponent(category.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // 年份歸檔頁面
  const yearEntries: MetadataRoute.Sitemap = years.map((year) => ({
    url: `${siteConfig.url}/posts/${year}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  // 靜態頁面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  return [...staticPages, ...postEntries, ...categoryEntries, ...yearEntries]
}
