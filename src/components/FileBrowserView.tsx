'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Post, Category } from '@/types/blog';
import { formatDate } from '@/lib/markdown';
import PostCard from '@/components/PostCard';

interface FileBrowserViewProps {
  posts: Post[];
  categories: (Category & { count: number })[];
}

type ViewType = 'date' | 'category';
type PathSegment = {
  type: 'root' | 'year' | 'month' | 'category';
  label: string;
  value: string;
};

export default function FileBrowserView({ posts, categories }: FileBrowserViewProps) {
  const [currentPath, setCurrentPath] = useState<PathSegment[]>([]);
  const [viewType, setViewType] = useState<ViewType>('date');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showAllPosts, setShowAllPosts] = useState(false);

  // 構建麵包屑導航
  const breadcrumbs = useMemo(() => {
    return [{ type: 'root' as const, label: 'blog', value: '' }, ...currentPath];
  }, [currentPath]);

  // 獲取當前路徑下的內容
  const currentContent = useMemo(() => {
    // 如果顯示所有文章，直接返回所有文章
    if (showAllPosts) {
      return posts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(post => ({
          type: 'post' as const,
          post,
        }));
    }

    if (currentPath.length === 0) {
      // 根目錄：顯示年份資料夾或類別資料夾
      if (viewType === 'date') {
        const years = new Set<string>();
        posts.forEach(post => {
          const date = new Date(post.date);
          if (!isNaN(date.getTime())) {
            years.add(date.getFullYear().toString());
          }
        });
        return Array.from(years)
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map(year => ({
            type: 'year' as const,
            name: year,
            count: posts.filter(post => {
              const date = new Date(post.date);
              return !isNaN(date.getTime()) && date.getFullYear().toString() === year;
            }).length,
          }));
      } else {
        return categories.map(cat => ({
          type: 'category' as const,
          name: cat.name,
          slug: cat.slug,
          count: cat.count,
        }));
      }
    }

    const lastSegment = currentPath[currentPath.length - 1];
    
    if (lastSegment.type === 'year') {
      // 顯示該年份下的月份
      const year = lastSegment.value;
      const months = new Set<number>();
      posts.forEach(post => {
        const date = new Date(post.date);
        if (!isNaN(date.getTime()) && date.getFullYear().toString() === year) {
          months.add(date.getMonth() + 1);
        }
      });
      return Array.from(months)
        .sort((a, b) => b - a)
        .map(month => ({
          type: 'month' as const,
          name: `${month}月`,
          value: month.toString().padStart(2, '0'),
          count: posts.filter(post => {
            const date = new Date(post.date);
            return !isNaN(date.getTime()) && 
                   date.getFullYear().toString() === year &&
                   date.getMonth() + 1 === month;
          }).length,
        }));
    }

    if (lastSegment.type === 'month') {
      // 顯示該月份下的文章
      const year = currentPath.find(p => p.type === 'year')?.value || '';
      const month = lastSegment.value;
      return posts
        .filter(post => {
          const date = new Date(post.date);
          if (isNaN(date.getTime())) return false;
          return date.getFullYear().toString() === year &&
                 (date.getMonth() + 1).toString().padStart(2, '0') === month;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(post => ({
          type: 'post' as const,
          post,
        }));
    }

    if (lastSegment.type === 'category') {
      // 顯示該類別下的文章
      const category = categories.find(cat => cat.slug === lastSegment.value);
      if (!category) return [];
      return posts
        .filter(post => post.category === category.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(post => ({
          type: 'post' as const,
          post,
        }));
    }

    return [];
  }, [currentPath, posts, categories, viewType, showAllPosts]);

  const navigateTo = (segment: PathSegment) => {
    setShowAllPosts(false);
    if (segment.type === 'root') {
      setCurrentPath([]);
    } else {
      const index = currentPath.findIndex(p => p.type === segment.type && p.value === segment.value);
      if (index >= 0) {
        setCurrentPath(currentPath.slice(0, index + 1));
      } else {
        setCurrentPath([...currentPath, segment]);
      }
    }
  };

  const toggleFolder = (key: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedFolders(newExpanded);
  };

  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: Record<string, string> = {
      '台大資管生活': '🎓',
      '科學班生活': '🔬',
      '攝影筆記': '📷',
      '城市漫步': '🚶',
      '生活日誌': '📔',
      '讀書筆記與心得': '📚',
      '技術筆記': '💻',
    };
    return iconMap[categoryName] || '📁';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 工具列和標題列 */}
      <div className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* 標題 */}
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground flex items-center gap-3">
              <span className="text-5xl">💻</span>
              <span>檔案瀏覽器</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">
              像操作本地資料夾一樣瀏覽文章
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* 視圖切換 */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setViewType('date');
                  setCurrentPath([]);
                  setShowAllPosts(false);
                }}
                className={`px-5 py-3 rounded-lg text-base sm:text-lg font-medium transition-all border-2 ${
                  viewType === 'date' && !showAllPosts
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                📅 按日期
              </button>
              <button
                onClick={() => {
                  setViewType('category');
                  setCurrentPath([]);
                  setShowAllPosts(false);
                }}
                className={`px-5 py-3 rounded-lg text-base sm:text-lg font-medium transition-all border-2 ${
                  viewType === 'category' && !showAllPosts
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                📁 按類別
              </button>
              <button
                onClick={() => {
                  setShowAllPosts(true);
                  setCurrentPath([]);
                }}
                className={`px-5 py-3 rounded-lg text-base sm:text-lg font-medium transition-all border-2 ${
                  showAllPosts
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                📄 顯示所有文章
              </button>
            </div>

            {/* 統計資訊 */}
            <div className="text-sm text-muted-foreground">
              {posts.length} 篇文章
            </div>
          </div>

          {/* 麵包屑導航 */}
          <div className="mt-4 flex items-center gap-2 text-base sm:text-lg">
            <Link
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPath([]);
                setShowAllPosts(false);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              blog
            </Link>
            {showAllPosts ? (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">所有文章</span>
              </>
            ) : (
              breadcrumbs.slice(1).map((segment, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <button
                    onClick={() => navigateTo(segment)}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {segment.label}
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 檔案瀏覽器內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 檢查是否全部是文章 */}
        {currentContent.length > 0 && currentContent.every(item => item.type === 'post') ? (
          // 卡片網格佈局 - 顯示文章
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContent.map((item) => {
              if (item.type === 'post') {
                return (
                  <PostCard
                    key={item.post.slug}
                    post={item.post}
                    aspect="landscape"
                    fontSize="normal"
                    fontWeight="semibold"
                  />
                );
              }
              return null;
            })}
          </div>
        ) : (
          // 列表佈局 - 顯示資料夾
          <div className="bg-background rounded-lg border-2 border-border shadow-lg overflow-hidden">
            {/* 表頭 - 類似檔案瀏覽器 */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-muted/80 to-muted/50 border-b-2 border-border text-sm font-bold text-foreground">
              <div className="col-span-6 flex items-center gap-2">
                <span>📋</span>
                <span>名稱</span>
              </div>
              <div className="col-span-2 text-center">類型</div>
              <div className="col-span-2 text-center">修改日期</div>
              <div className="col-span-2 text-right">大小</div>
            </div>

            {/* 檔案列表 */}
            <div className="divide-y divide-border">
              {currentContent.map((item, index) => {
                if (item.type === 'year' || item.type === 'month' || item.type === 'category') {
                  const isFolder = true;
                  const folderKey = `${item.type}-${item.name}`;
                  const isExpanded = expandedFolders.has(folderKey);
                  
                  return (
                    <div
                      key={`${item.type}-${item.name}-${index}`}
                      className="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-border/50 last:border-b-0"
                    >
                      <button
                        onClick={() => {
                          toggleFolder(folderKey);
                          if (item.type === 'year') {
                            navigateTo({ type: 'year', label: item.name, value: item.name });
                          } else if (item.type === 'month') {
                            const year = currentPath.find(p => p.type === 'year')?.value || '';
                            navigateTo({ type: 'month', label: item.name, value: item.value });
                          } else if (item.type === 'category') {
                            navigateTo({ type: 'category', label: item.name, value: item.slug });
                          }
                        }}
                        className="w-full grid grid-cols-12 gap-4 px-6 py-4 items-center text-left group-hover:translate-x-1 transition-transform"
                      >
                        <div className="col-span-6 flex items-center gap-3">
                          {item.type === 'category' ? (
                            <>
                              <span className="text-lg">{getCategoryIcon(item.name)}</span>
                              <span className="font-medium">{item.name}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">
                                {isExpanded ? '📂' : '📁'}
                              </span>
                              <span className="font-medium">{item.name}</span>
                            </>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-sm text-muted-foreground">
                          資料夾
                        </div>
                        <div className="col-span-2 text-center text-sm text-muted-foreground">
                          -
                        </div>
                        <div className="col-span-2 text-right text-sm text-muted-foreground">
                          {item.count} 項
                        </div>
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {currentContent.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-lg text-muted-foreground font-medium">此資料夾為空</p>
                <p className="text-sm text-muted-foreground mt-2">嘗試切換到其他視圖或選擇不同的資料夾</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

