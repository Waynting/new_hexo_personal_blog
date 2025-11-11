'use client';

import { useState, useMemo, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import { Post } from '@/types/blog';

interface TimelineViewProps {
  posts: Post[];
}

interface GroupedPosts {
  year: string;
  months: {
    month: string;
    monthName: string;
    posts: Post[];
  }[];
}

// 月份名称映射
const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export default function TimelineView({ posts }: TimelineViewProps) {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // 按年份和月份分组文章
  const groupedPosts = useMemo(() => {
    const groups: Record<string, Record<string, Post[]>> = {};

    posts.forEach(post => {
      const date = new Date(post.date);
      if (isNaN(date.getTime())) return;

      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      if (!groups[year]) {
        groups[year] = {};
      }
      if (!groups[year][month]) {
        groups[year][month] = [];
      }
      groups[year][month].push(post);
    });

    // 转换为数组格式并排序
    const result: GroupedPosts[] = Object.keys(groups)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => {
        const months = Object.keys(groups[year])
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map(month => ({
            month,
            monthName: monthNames[parseInt(month) - 1],
            posts: groups[year][month].sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          }));

        return { year, months };
      });

    return result;
  }, [posts]);

  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const toggleMonth = (year: string, month: string) => {
    const key = `${year}-${month}`;
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedMonths(newExpanded);
  };

  const isYearExpanded = (year: string) => expandedYears.has(year);
  const isMonthExpanded = (year: string, month: string) => expandedMonths.has(`${year}-${month}`);

  // 默认展开最新的一年
  useEffect(() => {
    if (groupedPosts.length > 0 && expandedYears.size === 0) {
      setExpandedYears(new Set([groupedPosts[0].year]));
    }
  }, [groupedPosts, expandedYears.size]);

  return (
    <div className="relative">
      {/* 时间轴线条 */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

      <div className="space-y-8 md:space-y-12">
        {groupedPosts.map(({ year, months }) => {
          const yearExpanded = isYearExpanded(year);
          const yearPostCount = months.reduce((sum, m) => sum + m.posts.length, 0);

          return (
            <div key={year} className="relative">
              {/* 年份标题 */}
              <button
                onClick={() => toggleYear(year)}
                className="flex items-center gap-4 mb-6 group cursor-pointer"
              >
                {/* 时间轴节点 */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg border-4 border-background hidden md:flex">
                  {year.slice(-2)}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {year} 年
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {yearPostCount} 篇文章
                  </p>
                </div>
                <div className="text-2xl transition-transform duration-200">
                  {yearExpanded ? '▼' : '▶'}
                </div>
              </button>

              {/* 月份分组 */}
              {yearExpanded && (
                <div className="md:ml-20 space-y-8">
                  {months.map(({ month, monthName, posts: monthPosts }) => {
                    const monthExpanded = isMonthExpanded(year, month);
                    const monthKey = `${year}-${month}`;

                    return (
                      <div key={monthKey} className="relative">
                        {/* 月份标题 */}
                        <button
                          onClick={() => toggleMonth(year, month)}
                          className="flex items-center gap-4 mb-4 group cursor-pointer"
                        >
                          {/* 小时间轴节点 */}
                          <div className="relative z-10 w-12 h-12 rounded-full bg-muted border-2 border-primary text-foreground flex items-center justify-center text-sm font-semibold hidden md:flex">
                            {month}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {monthName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {monthPosts.length} 篇文章
                            </p>
                          </div>
                          <div className="text-lg transition-transform duration-200">
                            {monthExpanded ? '▼' : '▶'}
                          </div>
                        </button>

                        {/* 文章列表 */}
                        {monthExpanded && (
                          <div className="md:ml-16 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                            {monthPosts.map((post) => (
                              <PostCard
                                key={post.slug}
                                post={post}
                                aspect="landscape"
                                fontSize="normal"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {groupedPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl sm:text-6xl mb-4">📅</div>
          <p className="text-lg text-muted-foreground">暫無文章</p>
        </div>
      )}
    </div>
  );
}

