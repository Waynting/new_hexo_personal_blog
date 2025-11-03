import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/back-to-top';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@/components/Analytics';
import { defaultMetadata } from '@/config/seo';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://img.waynspace.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="relative flex-grow">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
