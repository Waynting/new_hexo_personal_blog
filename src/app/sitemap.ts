import { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/posts'
import { siteConfig } from '@/config/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const categories = await getAllCategories()

  // 文章頁面
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedDate || post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 分類頁面
  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter(cat => cat.slug !== 'uncategorized')
    .map((category) => ({
      url: `${siteConfig.url}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
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
      url: `${siteConfig.url}/blog`,
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

  return [...staticPages, ...postEntries, ...categoryEntries]
}
