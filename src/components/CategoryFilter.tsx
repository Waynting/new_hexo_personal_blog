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

  const getCategoryColor = (categoryName: string, isActive: boolean): string => {
    const colorMap: Record<string, { normal: string; active: string }> = {
      '台大資管生活': {
        normal: 'bg-background text-foreground border-border hover:bg-blue-50 hover:border-blue-300',
        active: 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
      },
      '科學班生活': {
        normal: 'bg-background text-foreground border-border hover:bg-purple-50 hover:border-purple-300',
        active: 'bg-purple-500 text-white border-purple-600 shadow-lg scale-105'
      },
      '攝影筆記': {
        normal: 'bg-background text-foreground border-border hover:bg-green-50 hover:border-green-300',
        active: 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
      },
      '城市漫步': {
        normal: 'bg-background text-foreground border-border hover:bg-orange-50 hover:border-orange-300',
        active: 'bg-orange-500 text-white border-orange-600 shadow-lg scale-105'
      },
      '生活日誌': {
        normal: 'bg-background text-foreground border-border hover:bg-pink-50 hover:border-pink-300',
        active: 'bg-pink-500 text-white border-pink-600 shadow-lg scale-105'
      },
      '讀書筆記與心得': {
        normal: 'bg-background text-foreground border-border hover:bg-indigo-50 hover:border-indigo-300',
        active: 'bg-indigo-500 text-white border-indigo-600 shadow-lg scale-105'
      },
      '技術筆記': {
        normal: 'bg-background text-foreground border-border hover:bg-gray-50 hover:border-gray-300',
        active: 'bg-gray-600 text-white border-gray-700 shadow-lg scale-105'
      },
    };
    const colors = colorMap[categoryName] || {
      normal: 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50',
      active: 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
    };
    return isActive ? colors.active : colors.normal;
  };

  return (
    <div className="space-y-6">
      {/* 分類標題 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">文章分類</h3>
      </div>

      {/* 分類篩選按鈕 */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {/* 全部文章按鈕 */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 border-2 ${
            activeCategory === null
              ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
              : 'bg-background text-foreground border-border hover:bg-muted hover:border-primary/50 hover:scale-105'
          }`}
        >
          📚 全部文章
        </button>

        {/* 分類按鈕 */}
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 border-2 ${
              getCategoryColor(category.name, activeCategory === category.slug)
            }`}
          >
            {category.name}
            {category.count !== undefined && (
              <span className={`ml-1.5 sm:ml-2 text-xs sm:text-sm ${
                activeCategory === category.slug ? 'opacity-90' : 'text-muted-foreground'
              }`}>
                ({category.count})
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  );
}

