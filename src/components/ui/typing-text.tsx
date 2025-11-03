'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function TypingText({ 
  text, 
  delay = 1000, 
  speed = 100, 
  showCursor = true, 
  className,
  onComplete 
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursorState, setShowCursorState] = useState(showCursor);

  // 打字效果
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delay : speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, delay, speed, isComplete, onComplete]);

  // 光標閃爍效果
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursorState(prev => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, [showCursor]);

  return (
    <span className={cn("relative", className)}>
      {displayedText}
      {showCursor && (
        <span 
          className={cn(
            "inline-block ml-1 w-0.5 h-[1em] bg-current transition-opacity duration-100",
            showCursorState ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </span>
  );
}

