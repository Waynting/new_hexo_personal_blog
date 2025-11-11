'use client';

import { useState, useMemo } from 'react';
import { Post } from '@/types/blog';

interface TimeFilterProps {
  posts: Post[];
  selectedYear?: string | null;
  selectedMonth?: string | null;
  onYearChange?: (year: string | null) => void;
  onMonthChange?: (month: string | null) => void;
}

// 月份名称映射
const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export default function TimeFilter({
  posts,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: TimeFilterProps) {
  const [activeYear, setActiveYear] = useState<string | null>(selectedYear || null);
  const [activeMonth, setActiveMonth] = useState<string | null>(selectedMonth || null);

  // 提取所有年份并排序
  const years = useMemo(() => {
    const yearSet = new Set<string>();
    posts.forEach(post => {
      const date = new Date(post.date);
      if (!isNaN(date.getTime())) {
        yearSet.add(date.getFullYear().toString());
      }
    });
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [posts]);

  // 根据选中的年份获取该年份的月份
  const months = useMemo(() => {
    if (!activeYear) return [];
    
    const monthSet = new Set<number>();
    posts.forEach(post => {
      const date = new Date(post.date);
      if (!isNaN(date.getTime()) && date.getFullYear().toString() === activeYear) {
        monthSet.add(date.getMonth() + 1); // 0-11 -> 1-12
      }
    });
    return Array.from(monthSet).sort((a, b) => b - a);
  }, [posts, activeYear]);

  // 计算每个年份的文章数量
  const getYearCount = (year: string) => {
    return posts.filter(post => {
      const date = new Date(post.date);
      return !isNaN(date.getTime()) && date.getFullYear().toString() === year;
    }).length;
  };

  // 计算每个月份的文章数量
  const getMonthCount = (year: string, month: number) => {
    return posts.filter(post => {
      const date = new Date(post.date);
      return !isNaN(date.getTime()) && 
             date.getFullYear().toString() === year &&
             date.getMonth() + 1 === month;
    }).length;
  };

  const handleYearClick = (year: string | null) => {
    setActiveYear(year);
    setActiveMonth(null); // 切换年份时重置月份
    onYearChange?.(year);
    onMonthChange?.(null);
  };

  const handleMonthClick = (month: number | null) => {
    const monthStr = month ? month.toString().padStart(2, '0') : null;
    setActiveMonth(monthStr);
    onMonthChange?.(monthStr);
  };

  return (
    <div className="space-y-6">
      {/* 时间筛选标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">時間篩選</h3>
      </div>

      {/* 年份选择 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">年份：</span>
          <button
            onClick={() => handleYearClick(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
              activeYear === null
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50'
            }`}
          >
            全部
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {years.map((year) => {
            const count = getYearCount(year);
            const isActive = activeYear === year;
            return (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={`px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 border-2 flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                    : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50 hover:scale-105'
                }`}
              >
                <span>{year}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-black/5 dark:bg-white/10 text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 月份选择（仅在选中年份时显示） */}
      {activeYear && months.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">月份：</span>
            <button
              onClick={() => handleMonthClick(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                activeMonth === null
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50'
              }`}
            >
              全部
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {months.map((month) => {
              const count = getMonthCount(activeYear, month);
              const monthStr = month.toString().padStart(2, '0');
              const isActive = activeMonth === monthStr;
              return (
                <button
                  key={month}
                  onClick={() => handleMonthClick(month)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border-2 flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50 hover:scale-105'
                  }`}
                >
                  <span>{monthNames[month - 1]}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-black/5 dark:bg-white/10 text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

