import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/markdown';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    author: {
      name: string;
      avatar?: string;
    };
    featuredImage?: string;
  };
  aspect?: 'landscape' | 'square' | 'custom';
  minimal?: boolean;
  preloadImage?: boolean;
  fontSize?: 'large' | 'normal';
  fontWeight?: 'normal' | 'semibold';
}

export default function PostCard({
  post,
  aspect = 'landscape',
  minimal = false,
  preloadImage = false,
  fontSize = 'normal',
  fontWeight = 'semibold'
}: PostCardProps) {
  const getCategoryColor = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
      '台大資管生活': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      '科學班生活': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      '攝影筆記': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      '城市漫步': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      '生活日誌': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      '讀書筆記與心得': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      '技術筆記': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };
    return colorMap[categoryName] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  // 構建圖片 URL
  const slugParts = post.slug.split('/')
  const yearMonth = slugParts.length >= 2 ? `${slugParts[0]}/${slugParts[1]}` : ''
  const articleSlug = slugParts.length > 2 ? slugParts[2] : slugParts[slugParts.length - 1]

  const imageUrl = post.featuredImage?.startsWith('http')
    ? post.featuredImage
    : post.featuredImage && yearMonth
    ? `https://img.waynspace.com/${yearMonth}/${articleSlug}/${post.featuredImage}`
    : post.featuredImage
    ? `https://img.waynspace.com/${post.slug}/${post.featuredImage}`
    : null

  return (
    <Card className={cn(
      "group cursor-pointer transition-all hover:shadow-lg",
      minimal && "grid gap-6 md:grid-cols-2"
    )}>
      {/* Featured Image */}
      <div className={cn(
        "overflow-hidden rounded-t-lg",
        minimal && "rounded-lg"
      )}>
        <Link
          className={cn(
            "relative block",
            aspect === "landscape"
              ? "aspect-video"
              : aspect === "custom"
              ? "aspect-[5/4]"
              : "aspect-square"
          )}
          href={`/blog/${post.slug}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              priority={preloadImage}
              className="object-cover transition-all group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={imageUrl.startsWith('http')}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="text-center">
                <svg
                  className="h-12 w-12 text-muted-foreground mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs text-muted-foreground">無圖片</p>
              </div>
            </div>
          )}
        </Link>
      </div>

      <div className={cn(
        "flex flex-col",
        minimal ? "justify-center" : "flex-1"
      )}>
        <CardHeader className={cn(
          "pb-0 space-y-0",
          minimal && "pt-0"
        )}>
          <Badge 
            variant="category"
            className={cn(
              "mb-2 w-fit",
              getCategoryColor(post.category)
            )}
          >
            {post.category}
          </Badge>
          
          <Link href={`/blog/${post.slug}`}>
            <h2
              className={cn(
                fontSize === "large"
                  ? "text-2xl"
                  : minimal
                  ? "text-2xl"
                  : "text-xl",
                fontWeight === "normal"
                  ? "line-clamp-2 font-medium tracking-normal"
                  : "font-semibold leading-tight tracking-tight",
                "hover:text-primary transition-colors mb-0"
              )}
            >
              {post.title}
            </h2>
          </Link>
        </CardHeader>

        <CardContent className="pb-3 pt-0 mt-0">
          {/* Excerpt */}
          {post.excerpt && !minimal && (
            <Link href={`/blog/${post.slug}`}>
              <p className="line-clamp-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {post.excerpt}
              </p>
            </Link>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          {/* Meta information */}
          <div className="flex items-center space-x-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              {post.author.avatar && (
                <div className="relative h-5 w-5 flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="rounded-full object-cover"
                    fill
                    sizes="20px"
                  />
                </div>
              )}
              <span className="truncate">{post.author.name}</span>
            </div>
            <span className="text-xs">•</span>
            <time 
              className="truncate" 
              dateTime={post.date || ''}
            >
              {formatDate(post.date)}
            </time>
            <span className="text-xs">•</span>
            <span className="truncate">{post.readTime}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

