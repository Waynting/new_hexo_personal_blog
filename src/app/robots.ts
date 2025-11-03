import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/seo'

export default function robots(): MetadataRoute.Robots {
  // 檢查是否為預覽環境（Vercel preview deployments）
  const isPreview = process.env.VERCEL_ENV === 'preview'

  // 預覽環境：不允許索引
  if (isPreview) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  // 生產環境：允許索引
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
