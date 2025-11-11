import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Section, SectionContent } from '@/components/ui/section'
import { formatDate } from '@/lib/markdown'
import { Newsletter } from '@/components/Newsletter'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.split('/'), // Next.js catch-all 路由需要陣列格式
  }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }> // Next.js 16+，params 是 Promise
}) {
  // 解包 params Promise
  const { slug: slugArray } = await params
  // 將陣列組合回完整路徑，并对每个部分进行 URL 解码
  const slug = Array.isArray(slugArray)
    ? slugArray.map(part => decodeURIComponent(part)).join('/')
    : decodeURIComponent(slugArray)
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // 提取文章标题部分（用于构建图片路径）
  const slugParts = post.slug.split('/')
  const articleSlug = slugParts.length > 2 ? slugParts[2] : slugParts[slugParts.length - 1]
  const yearMonth = slugParts.length >= 2 ? `${slugParts[0]}/${slugParts[1]}` : ''

  // 處理圖片路徑（因為 content 已經是 HTML）
  let processedContent = post.content || ''

  // 替換相對路徑的圖片連結
  processedContent = processedContent.replace(
    /src=["']images\/([^"']+)["']/g,
    (_match, imgPath) => {
      const imageUrl = yearMonth
        ? `https://img.waynspace.com/${yearMonth}/${articleSlug}/${imgPath}`
        : `https://img.waynspace.com/${post.slug}/${imgPath}`
      return `src="${imageUrl}"`
    }
  )

  // 替換舊 WordPress 連結
  processedContent = processedContent.replace(
    /https:\/\/waynspace\.com\/wp-content\/uploads\/[^"'\s)]+/g,
    (match) => {
      const filename = match.split('/').pop()?.split('?')[0] || ''
      return yearMonth
        ? `https://img.waynspace.com/${yearMonth}/${articleSlug}/${filename}`
        : `https://img.waynspace.com/${post.slug}/${filename}`
    }
  )

  // 構建封面圖片 URL
  const coverImageUrl = post.featuredImage?.startsWith('http')
    ? post.featuredImage
    : post.featuredImage && yearMonth
    ? `https://img.waynspace.com/${yearMonth}/${articleSlug}/${post.featuredImage}`
    : post.featuredImage
    ? `https://img.waynspace.com/${post.slug}/${post.featuredImage}`
    : null

  // 如果封面圖片存在，檢查並移除文章內容中第一張相同的圖片
  if (coverImageUrl) {
    // 提取第一張圖片的正則表達式（匹配 <img> 標籤，可能包含前後的空白和換行）
    const firstImageRegex = /(<p[^>]*>)?\s*<img[^>]+src=["']([^"']+)["'][^>]*>\s*(<\/p>)?/i
    const firstImageMatch = processedContent.match(firstImageRegex)
    
    if (firstImageMatch) {
      const firstImageUrl = firstImageMatch[2]
      // 比較 URL（移除可能的查詢參數和尾隨斜線）
      const normalizeUrl = (url: string) => url.split('?')[0].replace(/\/$/, '')
      const normalizedCoverUrl = normalizeUrl(coverImageUrl)
      const normalizedFirstImageUrl = normalizeUrl(firstImageUrl)
      
      // 如果第一張圖片和封面圖片相同，則移除它（包括可能的包裝 <p> 標籤）
      if (normalizedCoverUrl === normalizedFirstImageUrl) {
        processedContent = processedContent.replace(firstImageRegex, '')
        // 清理可能留下的多餘空白行
        processedContent = processedContent.replace(/^\s*\n\s*\n/, '\n')
      }
    }
  }

  return (
    <>
      {/* Article Section */}
      <Section className="bg-background py-8 md:py-12">
        <SectionContent>
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-8">
              <Button asChild variant="ghost" className="pl-0">
                <Link href="/blog" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回文章列表
                </Link>
              </Button>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              {/* Categories and Tags */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                  {post.category}
                </span>
                {post.tags.length > 0 && (
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Article Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <time dateTime={(() => {
                    if (!post.date) return '';
                    try {
                      const date = new Date(post.date);
                      return isNaN(date.getTime()) ? post.date : date.toISOString();
                    } catch {
                      return post.date;
                    }
                  })()}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </header>
          </div>
        </SectionContent>
      </Section>

      {/* Article Content Section */}
      <Section className="bg-card/30 py-0 pb-12">
        <SectionContent>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-12">
                {coverImageUrl && (
                  <div className="mb-8">
                    <Image
                      src={coverImageUrl}
                      alt={post.title}
                      width={1200}
                      height={600}
                      className="w-full h-auto rounded-lg"
                      priority
                    />
                  </div>
                )}
                <div
                  className="article-content prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-foreground prose-p:leading-relaxed prose-p:opacity-90
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-code:text-accent-foreground prose-code:bg-accent prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:border prose-pre:border-border
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-muted-foreground
                    prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-border
                    prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground
                    prose-table:border-collapse prose-table:border prose-table:border-border
                    prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2
                    prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Newsletter subscription */}
                <Newsletter variant="compact" />
              </CardContent>
            </Card>
          </div>
        </SectionContent>
      </Section>

      {/* Back to Blog Section */}
      <Section className="py-8 md:py-10">
        <SectionContent>
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild size="lg">
              <Link href="/blog" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                返回文章列表
              </Link>
            </Button>
          </div>
        </SectionContent>
      </Section>
    </>
  )
}
