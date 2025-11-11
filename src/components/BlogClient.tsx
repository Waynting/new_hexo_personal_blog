'use client';

import { useState, useMemo } from 'react';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import TimeFilter from '@/components/TimeFilter';
import TimelineView from '@/components/TimelineView';
import FileBrowserView from '@/components/FileBrowserView';
import { Section, SectionContent } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Post, Category } from '@/types/blog';

interface BlogClientProps {
  posts: Post[];
  categories: (Category & { count: number })[];
}

type SortOrder = 'newest' | 'oldest';
type ViewMode = 'grid' | 'timeline' | 'browser';

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('browser');
  const [showAll, setShowAll] = useState(false);

  // 根據選擇的分類和時間篩選文章
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // 分類篩選
    if (selectedCategory) {
      const category = categories.find(cat => cat.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter(post => post.category === category.name);
      }
    }

    // 時間篩選
    if (selectedYear) {
      filtered = filtered.filter(post => {
        const date = new Date(post.date);
        if (isNaN(date.getTime())) return false;
        const postYear = date.getFullYear().toString();
        
        if (selectedMonth) {
          const postMonth = (date.getMonth() + 1).toString().padStart(2, '0');
          return postYear === selectedYear && postMonth === selectedMonth;
        }
        return postYear === selectedYear;
      });
    }

    // 按日期排序
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [posts, selectedCategory, selectedYear, selectedMonth, sortOrder, categories]);

  // 顯示的文章數量（僅在網格視圖中使用）
  const displayPosts = showAll ? filteredPosts : filteredPosts.slice(0, 6);

  // 重置時間篩選當分類改變時
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // 可選：重置時間篩選
    // setSelectedYear(null);
    // setSelectedMonth(null);
  };

  return (
    <>
      {/* File Browser View - 默认视图 */}
      {viewMode === 'browser' ? (
        <FileBrowserView posts={posts} categories={categories} />
      ) : (
        <>
          {/* Category Filter Section */}
          <Section className="py-6 sm:py-8 md:py-10 bg-muted/30">
            <SectionContent className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </SectionContent>
          </Section>

          {/* Time Filter Section */}
          <Section className="py-6 sm:py-8 md:py-10 bg-background border-b border-border">
            <SectionContent className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <TimeFilter
                posts={posts}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
              />
            </SectionContent>
          </Section>

          {/* Posts Section */}
          <Section className="py-6 sm:py-8 md:py-10">
            <SectionContent className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header with Title and View Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  {selectedCategory
                    ? categories.find(cat => cat.slug === selectedCategory)?.name || '篩選結果'
                    : '所有文章'
                  }
                  {(selectedCategory || selectedYear) && (
                    <span className="text-base sm:text-lg font-normal text-muted-foreground ml-2 sm:ml-3">
                      ({filteredPosts.length} 篇)
                    </span>
                  )}
                </h2>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('browser')}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 bg-background text-foreground border-border hover:bg-muted hover:border-primary/50"
                  >
                    <span className="mr-2">💻</span>
                    檔案瀏覽器
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-2">📋</span>
                    網格視圖
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      viewMode === 'timeline'
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-2">📅</span>
                    時間線視圖
                  </button>
                </div>
              </div>

              {/* Sort Controls (僅在網格視圖顯示) */}
              {viewMode === 'grid' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                    <label htmlFor="sort-order" className="text-lg sm:text-xl font-semibold text-foreground whitespace-nowrap">
                      排序方式
                    </label>
                    <select
                      id="sort-order"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                      className="w-full sm:w-auto px-5 py-3 text-base sm:text-lg font-semibold bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer hover:border-primary/50 shadow-sm"
                    >
                      <option value="newest">📅 最新發布</option>
                      <option value="oldest">📆 最舊發布</option>
                    </select>
                  </div>
                  <span className="text-base sm:text-lg text-muted-foreground">
                    共 {filteredPosts.length} 篇文章
                  </span>
                </div>
              )}
              
              {/* Grid View */}
              {viewMode === 'grid' && (
                <>
                  {displayPosts.length > 0 ? (
                    <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {displayPosts.map((post) => (
                        <PostCard
                          key={post.slug}
                          post={post}
                          aspect="landscape"
                          fontSize="normal"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <div className="text-5xl sm:text-6xl mb-4">📝</div>
                      <p className="text-base sm:text-lg text-muted-foreground">
                        {selectedCategory || selectedYear ? '此篩選條件暫無文章' : 'No articles yet'}
                      </p>
                    </div>
                  )}

                  {filteredPosts.length > 6 && !showAll && (
                    <div className="text-center mt-6 sm:mt-8">
                      <Button onClick={() => setShowAll(true)} size="lg" className="w-full sm:w-auto">
                        查看更多文章 ({filteredPosts.length - 6} 篇)
                      </Button>
                    </div>
                  )}

                  {showAll && filteredPosts.length > 6 && (
                    <div className="text-center mt-6 sm:mt-8">
                      <Button onClick={() => setShowAll(false)} variant="outline" size="lg" className="w-full sm:w-auto">
                        收起文章
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <>
                  {filteredPosts.length > 0 ? (
                    <TimelineView posts={filteredPosts} />
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <div className="text-5xl sm:text-6xl mb-4">📅</div>
                      <p className="text-base sm:text-lg text-muted-foreground">
                        {selectedCategory || selectedYear ? '此篩選條件暫無文章' : 'No articles yet'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </SectionContent>
          </Section>
        </>
      )}
    </>
  );
}

