'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface FlipCardProps {
  frontContent: {
    icon: string;
    title: string;
    subtitle: string;
    gradient: string;
    textColor: string;
  };
  backContent: {
    description: string;
    skills: string[];
    projects?: Array<{
      name: string;
      url: string;
    }>;
    gradient: string;
  };
  className?: string;
}

export function FlipCard({ frontContent, backContent, className }: FlipCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 防止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC 鍵關閉
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <>
      {/* Front Card */}
      <Card 
        className={cn(
          "h-72 sm:h-80 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Gradient Background */}
          <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300", frontContent.gradient)} />
          
          <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
            {frontContent.icon}
          </div>
          <h3 className="font-bold text-2xl mb-2 group-hover:text-primary transition-colors duration-300">
            {frontContent.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {frontContent.subtitle}
          </p>
          <div className="mt-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            點擊查看詳細資訊 →
          </div>
        </CardContent>
      </Card>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <Card className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
            <CardHeader className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {frontContent.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-black dark:text-white">{frontContent.title}</CardTitle>
                    <p className="text-sm text-black dark:text-white">{frontContent.subtitle}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 bg-white dark:bg-gray-900">
              {/* Description */}
              <div>
                <p className="text-sm leading-relaxed text-black dark:text-white">
                  {backContent.description}
                </p>
              </div>
              
              {/* Skills */}
              <div>
                <h4 className="font-semibold text-sm mb-4 text-black dark:text-white">技能標籤</h4>
                <div className="flex flex-wrap gap-2">
                  {backContent.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-xs bg-gray-800 text-white dark:bg-gray-200 dark:text-black hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {backContent.projects && backContent.projects.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-4 text-black dark:text-white">相關專案</h4>
                  <div className="grid gap-2">
                    {backContent.projects.map((project, index) => (
                      <Button
                        key={index}
                        asChild
                        variant="outline"
                        className="justify-between text-black dark:text-white border-black dark:border-white hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      >
                        <Link 
                          href={project.url} 
                          target={project.url.startsWith('http') ? "_blank" : undefined}
                          rel={project.url.startsWith('http') ? "noopener noreferrer" : undefined}
                        >
                          <span className="text-black dark:text-white">{project.name}</span>
                          <span className="text-xs text-black dark:text-white">→</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

