import { Metadata } from 'next'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    type?: string
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    images?: string[]
  }
}

const siteConfig = {
  name: 'Waynspace',
  description: 'Wayne的個人網站 - 記錄攝影作品、程式專案、生活日誌與學習心得',
  url: 'https://waynspace.com',
  ogImage: 'https://waynspace.com/images/og-image.jpg',
  creator: 'Wayne Liu',
  keywords: [
    'Wayne',
    'Waynspace',
    '攝影',
    '程式設計',
    'Next.js',
    'TypeScript',
    '部落格',
    '台大',
    '資訊管理',
    '生活日誌',
    '學習筆記'
  ]
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = siteConfig.keywords,
    openGraph,
    twitter
  } = config

  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.join(', '),
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      url: siteConfig.url,
      title: openGraph?.title || metaTitle,
      description: openGraph?.description || metaDescription,
      siteName: siteConfig.name,
      images: openGraph?.images || [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter?.title || metaTitle,
      description: twitter?.description || metaDescription,
      images: twitter?.images || [siteConfig.ogImage],
      creator: `@${siteConfig.creator}`,
    },
    icons: {
      icon: '/blog-image.jpg',
      shortcut: '/blog-image.jpg',
      apple: '/blog-image.jpg',
    },
  }
}

export function generateStructuredData(type: 'website' | 'article' | 'person', data: any) {
  const baseData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'website':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        author: {
          '@type': 'Person',
          name: siteConfig.creator,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author || siteConfig.creator,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/blog-image.jpg`,
          },
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
        image: data.images?.[0]?.url || siteConfig.ogImage,
      }

    case 'person':
      return {
        ...baseData,
        '@type': 'Person',
        name: siteConfig.creator,
        url: siteConfig.url,
        sameAs: data.sameAs || [],
        jobTitle: data.jobTitle,
        worksFor: data.worksFor,
        knowsAbout: [
          '攝影',
          '程式設計',
          'Web開發',
          'Next.js',
          'TypeScript',
          '資訊管理'
        ],
      }

    default:
      return baseData
  }
}

export { siteConfig }

