'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navigationConfig } from '@/config/navigation';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-[1000] backdrop-blur-md border-b bg-background border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href={navigationConfig.pages.home}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/blog-image.jpg"
                alt="Waynspace Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-foreground">
                Waynspace
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}

