'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Photo {
  url: string;
  key: string;
  name: string;
  size: number;
  lastModified: string;
}

interface PhotoGalleryProps {
  initialPhotos: Photo[];
}

interface PhotoPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PHOTOS_PER_PAGE = 24;

export default function PhotoGallery({ initialPhotos }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos.slice(0, PHOTOS_PER_PAGE));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPhotos.length > PHOTOS_PER_PAGE);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});
  
  // 布局相关状态
  const [columnCount, setColumnCount] = useState(4);
  const [gapSize, setGapSize] = useState(4);
  const [photoPositions, setPhotoPositions] = useState<Record<string, PhotoPosition>>({});
  const [containerHeight, setContainerHeight] = useState(0);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(1);

  // 响应式计算列数和间距（使用节流优化性能）
  useEffect(() => {
    let rafId: number | null = null;
    
    const calculateLayout = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      let cols = 1;
      let gap = 8;
      
      if (width >= 1600) {
        cols = 5;
        gap = 16;
      } else if (width >= 1400) {
        cols = 4;
        gap = 14;
      } else if (width >= 1200) {
        cols = 4;
        gap = 12;
      } else if (width >= 1024) {
        cols = 3;
        gap = 10;
      } else if (width >= 768) {
        cols = 3;
        gap = 8;
      } else if (width >= 640) {
        cols = 2;
        gap = 8;
      } else {
        cols = 1;
        gap = 6;
      }
      
      setColumnCount(cols);
      setGapSize(gap);
    };

    const throttledCalculate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculateLayout();
        rafId = null;
      });
    };

    calculateLayout();
    const resizeObserver = new ResizeObserver(throttledCalculate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', throttledCalculate, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', throttledCalculate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // 计算瀑布流布局 - 使用 requestAnimationFrame 优化性能
  useEffect(() => {
    if (columnCount === 0 || photos.length === 0) {
      setPhotoPositions({});
      setContainerHeight(0);
      return;
    }

    let rafId: number | null = null;

    const calculateLayout = () => {
      const containerWidth = containerRef.current?.offsetWidth;
      if (!containerWidth) return;

      const totalGapWidth = gapSize * (columnCount - 1);
      const columnWidth = Math.floor((containerWidth - totalGapWidth) / columnCount);
      
      const columnHeights = new Array(columnCount).fill(0);
      const positions: Record<string, PhotoPosition> = {};

      photos.forEach((photo) => {
        const dimensions = imageDimensions[photo.key];
        if (!dimensions) return;

        const aspectRatio = dimensions.width / dimensions.height;
        const height = columnWidth / aspectRatio;

        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        const left = shortestColumnIndex * (columnWidth + gapSize);
        const top = columnHeights[shortestColumnIndex];

        positions[photo.key] = {
          top,
          left,
          width: columnWidth,
          height,
        };

        columnHeights[shortestColumnIndex] += height + gapSize;
      });

      const maxHeight = Math.max(...columnHeights, 0);
      
      setPhotoPositions(positions);
      setContainerHeight(maxHeight);
    };

    // 使用 requestAnimationFrame 延迟计算，避免阻塞渲染
    rafId = requestAnimationFrame(calculateLayout);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [photos, imageDimensions, columnCount, gapSize]);

  // 懒加载更多照片
  const loadMorePhotos = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = currentPageRef.current + 1;
    const startIndex = currentPageRef.current * PHOTOS_PER_PAGE;
    const endIndex = startIndex + PHOTOS_PER_PAGE;
    const newPhotos = initialPhotos.slice(startIndex, endIndex);

    if (newPhotos.length > 0) {
      setTimeout(() => {
        setPhotos(prev => [...prev, ...newPhotos]);
        currentPageRef.current = nextPage;
        setHasMore(endIndex < initialPhotos.length);
        setLoading(false);
      }, 100);
    } else {
      setHasMore(false);
      setLoading(false);
    }
  }, [initialPhotos, loading, hasMore]);

  // Intersection Observer 用于自动加载更多
  useEffect(() => {
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePhotos();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMorePhotos]);

  const openPhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  }, []);

  const closePhoto = useCallback(() => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'unset';
  }, []);

  const navigatePhoto = useCallback((direction: 'prev' | 'next') => {
    setSelectedPhoto((currentPhoto) => {
      if (!currentPhoto) return null;
      
      const currentIndex = initialPhotos.findIndex(p => p.key === currentPhoto.key);
      if (currentIndex === -1) return currentPhoto;

      const newIndex = direction === 'prev' 
        ? (currentIndex - 1 + initialPhotos.length) % initialPhotos.length
        : (currentIndex + 1) % initialPhotos.length;
      
      const newPhoto = initialPhotos[newIndex];
      
      // 如果新照片还没有加载，需要加载它
      setPhotos((currentPhotos) => {
        if (currentPhotos.find(p => p.key === newPhoto.key)) {
          return currentPhotos;
        }
        
        const targetPage = Math.floor(newIndex / PHOTOS_PER_PAGE) + 1;
        if (targetPage > currentPageRef.current) {
          const endIndex = targetPage * PHOTOS_PER_PAGE;
          const photosToLoad = initialPhotos.slice(0, endIndex);
          currentPageRef.current = targetPage;
          setHasMore(endIndex < initialPhotos.length);
          return photosToLoad;
        }
        return currentPhotos;
      });
      
      return newPhoto;
    });
  }, [initialPhotos]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePhoto();
      } else if (e.key === 'ArrowLeft') {
        navigatePhoto('prev');
      } else if (e.key === 'ArrowRight') {
        navigatePhoto('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, navigatePhoto, closePhoto]);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">No photos found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Photo Grid - Masonry Layout */}
      <div 
        ref={containerRef}
        className="w-full relative"
        style={{
          minHeight: containerHeight > 0 ? `${containerHeight}px` : '400px',
        }}
      >
        {photos.map((photo, index) => {
          const position = photoPositions[photo.key];
          const dimensions = imageDimensions[photo.key];
          const isLoaded = imageLoadStates[photo.key];
          
          // 如果位置还没计算出来，显示占位符
          if (!position) {
            return (
              <div
                key={photo.key}
                className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer hover:shadow-lg transition-all duration-300"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  maxWidth: '300px',
                  aspectRatio: dimensions ? `${dimensions.width / dimensions.height}` : '1',
                  opacity: isLoaded ? 1 : 0.5,
                }}
                onClick={() => openPhoto(photo)}
              >
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <Image
                  src={photo.url}
                  alt={photo.name}
                  fill
                  loading={index < 8 ? "eager" : "lazy"}
                  priority={index < 4}
                  className={cn(
                    "object-contain transition-transform duration-300 group-hover:scale-105",
                    !isLoaded && "opacity-0"
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized={photo.url.startsWith('http')}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setImageLoadStates(prev => ({ ...prev, [photo.key]: true }));
                    setImageDimensions(prev => ({
                      ...prev,
                      [photo.key]: { 
                        width: img.naturalWidth, 
                        height: img.naturalHeight 
                      }
                    }));
                  }}
                />
              </div>
            );
          }

          return (
            <div
              key={photo.key}
              className="group absolute overflow-hidden rounded-lg bg-muted cursor-pointer hover:shadow-lg"
              style={{
                transform: `translate(${position.left}px, ${position.top}px)`,
                width: `${position.width}px`,
                height: `${position.height}px`,
                willChange: 'transform',
              }}
              onClick={() => openPhoto(photo)}
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <Image
                src={photo.url}
                alt={photo.name}
                fill
                loading={index < 8 ? "eager" : "lazy"}
                priority={index < 4}
                className={cn(
                  "object-contain transition-opacity duration-200",
                  "group-hover:scale-105 group-hover:transition-transform group-hover:duration-300",
                  !isLoaded && "opacity-0"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={photo.url.startsWith('http')}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setImageLoadStates(prev => ({ ...prev, [photo.key]: true }));
                  setImageDimensions(prev => ({
                    ...prev,
                    [photo.key]: { 
                      width: img.naturalWidth, 
                      height: img.naturalHeight 
                    }
                  }));
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more photos...</span>
            </div>
          )}
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closePhoto}
        >
          <button
            onClick={closePhoto}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {initialPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
                className="absolute left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
                className="absolute right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
              unoptimized={selectedPhoto.url.startsWith('http')}
              priority
              quality={90}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
            <p className="text-center">{selectedPhoto.name}</p>
            <p className="text-center text-xs text-white/70 mt-1">
              {initialPhotos.findIndex(p => p.key === selectedPhoto.key) + 1} / {initialPhotos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
