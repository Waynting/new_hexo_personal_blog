import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/posts'
import { siteConfig } from '@/config/seo'

export async function generatePostMetadata(slug: string): Promise<Metadata> {
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const url = `${siteConfig.url}/posts/${post.slug}`
  const coverImage = post.featuredImage?.startsWith('http')
    ? post.featuredImage
    : post.featuredImage
    ? `${siteConfig.url}/${post.featuredImage}`
    : `${siteConfig.url}/blog-image.jpg`

  return {
    title: post.title,
    description: post.excerpt || post.seo.metaDescription,
    keywords: [...post.tags, ...(post.seo.keywords || [])],
    authors: [
      {
        name: post.author.name,
        url: siteConfig.url,
      },
    ],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.seo.metaDescription,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedDate,
      authors: [post.author.name],
      tags: post.tags,
      url,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.seo.metaDescription,
      images: [coverImage],
      creator: siteConfig.author.instagram,
    },
    alternates: {
      canonical: url,
    },
  }
}
