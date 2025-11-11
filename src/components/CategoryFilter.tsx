'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/blog';

interface CategoryFilterProps {
  categories: (Category & { count?: number })[];
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  showViewAll?: boolean;
}

// 分类图标映射
const categoryIcons: Record<string, string> = {
  '台大資管生活': '🎓',
  '科學班生活': '🔬',
  '攝影筆記': '📷',
  '城市漫步': '🚶',
  '生活日誌': '📔',
  '讀書筆記與心得': '📚',
  '技術筆記': '💻',
};

// 分类颜色配置 - 更明显的区分
const categoryColors: Record<string, { 
  bg: string; 
  text: string; 
  border: string; 
  hoverBg: string;
  hoverBorder: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
}> = {
  '台大資管生活': {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
    hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
    hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
    activeBg: 'bg-blue-600 dark:bg-blue-500',
    activeText: 'text-white',
    activeBorder: 'border-blue-700 dark:border-blue-400',
  },
  '科學班生活': {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
    hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
    hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
    activeBg: 'bg-purple-600 dark:bg-purple-500',
    activeText: 'text-white',
    activeBorder: 'border-purple-700 dark:border-purple-400',
  },
  '攝影筆記': {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/50',
    hoverBorder: 'hover:border-green-400 dark:hover:border-green-600',
    activeBg: 'bg-green-600 dark:bg-green-500',
    activeText: 'text-white',
    activeBorder: 'border-green-700 dark:border-green-400',
  },
  '城市漫步': {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
    hoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
    hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-600',
    activeBg: 'bg-orange-600 dark:bg-orange-500',
    activeText: 'text-white',
    activeBorder: 'border-orange-700 dark:border-orange-400',
  },
  '生活日誌': {
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-300 dark:border-pink-700',
    hoverBg: 'hover:bg-pink-100 dark:hover:bg-pink-900/50',
    hoverBorder: 'hover:border-pink-400 dark:hover:border-pink-600',
    activeBg: 'bg-pink-600 dark:bg-pink-500',
    activeText: 'text-white',
    activeBorder: 'border-pink-700 dark:border-pink-400',
  },
  '讀書筆記與心得': {
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-700',
    hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
    hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-600',
    activeBg: 'bg-indigo-600 dark:bg-indigo-500',
    activeText: 'text-white',
    activeBorder: 'border-indigo-700 dark:border-indigo-400',
  },
  '技術筆記': {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    hoverBg: 'hover:bg-red-100 dark:hover:bg-red-900/50',
    hoverBorder: 'hover:border-red-400 dark:hover:border-red-600',
    activeBg: 'bg-red-600 dark:bg-red-500',
    activeText: 'text-white',
    activeBorder: 'border-red-700 dark:border-red-400',
  },
};

export default function CategoryFilter({ 
  categories,
  selectedCategory, 
  onCategoryChange,
  showViewAll = true 
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || null);
  
  // 過濾掉未分類
  const filteredCategories = categories.filter(cat => cat.slug !== 'uncategorized');

  const handleCategoryClick = (categorySlug: string | null) => {
    setActiveCategory(categorySlug);
    onCategoryChange?.(categorySlug);
  };

  const getCategoryStyles = (categoryName: string, isActive: boolean) => {
    const colors = categoryColors[categoryName] || {
      bg: 'bg-muted',
      text: 'text-foreground',
      border: 'border-border',
      hoverBg: 'hover:bg-muted/80',
      hoverBorder: 'hover:border-primary/50',
      activeBg: 'bg-primary',
      activeText: 'text-primary-foreground',
      activeBorder: 'border-primary',
    };
    
    if (isActive) {
      return `${colors.activeBg} ${colors.activeText} ${colors.activeBorder} shadow-lg scale-105`;
    }
    
    return `${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg} ${colors.hoverBorder} hover:scale-105`;
  };

  return (
    <div className="space-y-6">
      {/* 分類標題 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">文章分類</h3>
      </div>

      {/* 分類篩選按鈕 */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {/* 全部文章按鈕 */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 border-2 flex items-center gap-2 ${
            activeCategory === null
              ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
              : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50 hover:scale-105'
          }`}
        >
          <span className="text-xl">📚</span>
          <span>全部文章</span>
        </button>

        {/* 分類按鈕 */}
        {filteredCategories.map((category) => {
          const isActive = activeCategory === category.slug;
          const icon = categoryIcons[category.name] || '📝';
          const styles = getCategoryStyles(category.name, isActive);
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`px-6 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 border-2 flex items-center gap-2 ${styles}`}
            >
              <span className="text-xl">{icon}</span>
              <span>{category.name}</span>
              {category.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-black/5 dark:bg-white/10 text-muted-foreground'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

