import { Metadata } from 'next'

export const siteConfig = {
  name: 'Waynspace',
  title: 'Waynspace - Wayne Liu 的個人網站',
  description: '分享生活、攝影、技術與閱讀的個人部落格。記錄台大資管生活、科學班回憶、城市漫步與讀書心得。',
  url: 'https://waynspace.com',
  author: {
    name: 'Wayne Liu',
    email: 'wayntingliu@gmail.com',
    instagram: '@waiting_941208',
  },
  links: {
    github: 'https://github.com/Waynting',
    linkedin: 'https://www.linkedin.com/in/waiting5928/',
    instagram: 'https://www.instagram.com/waiting_941208/',
  },
  keywords: [
    '個人部落格',
    '台大資管',
    '攝影筆記',
    '技術筆記',
    '讀書心得',
    '生活日誌',
    'Wayne Liu',
    '劉維廷',
  ],
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/blog-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/blog-image.jpg`],
    creator: siteConfig.author.instagram,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}
