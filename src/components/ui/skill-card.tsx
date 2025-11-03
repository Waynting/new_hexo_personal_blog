'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

// 方案1: 分層展示 + 熟練度指示
export interface SkillWithLevel {
  name: string;
  level?: 'expert' | 'advanced' | 'intermediate' | 'beginner';
}

interface BaseSkillCardProps {
  category: string;
  className?: string;
}

interface LevelSkillCardProps extends BaseSkillCardProps {
  skills: SkillWithLevel[];
}

interface CollapsibleSkillCardProps extends BaseSkillCardProps {
  skills: string[];
}

// 技能等級顏色映射 - 支援亮色/暗色模式
const levelColors = {
  expert: 'bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600',
  advanced: 'bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600', 
  intermediate: 'bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-600',
  beginner: 'bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-600'
};

// 方案1: 熟練度指示卡片
export function LevelSkillCard({ category, skills, className }: LevelSkillCardProps) {
  
  // 定義排序順序
  const levelOrder = ['expert', 'advanced', 'intermediate', 'beginner'];
  
  const groupedSkills = skills.reduce((acc, skill) => {
    const level = skill.level || 'intermediate';
    if (!acc[level]) acc[level] = [];
    acc[level].push(skill);
    return acc;
  }, {} as Record<string, SkillWithLevel[]>);

  // 按照等級順序排序
  const sortedLevels = levelOrder.filter(level => groupedSkills[level]);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedLevels.map((level) => (
          <div key={level} className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground capitalize">
              {level} ({groupedSkills[level].length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {groupedSkills[level].map((skill) => (
                <Badge 
                  key={skill.name} 
                  className={cn("text-xs px-2 py-1", levelColors[level as keyof typeof levelColors])}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 方案2: 展開卡片（總是顯示所有技能）
export function CollapsibleSkillCard({ category, skills, className }: CollapsibleSkillCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs border border-white">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

