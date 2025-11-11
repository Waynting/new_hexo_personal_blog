import type { NextConfig } from "next";
import { getAllPosts } from './src/lib/posts';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.waynspace.com',
      },
      {
        protocol: 'https',
        hostname: 'waynspace.com',
      },
    ],
    // 添加 quality 90 到配置中
    qualities: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 75, 90],
  },

  // 動態生成重定向規則
  async redirects() {
    const posts = await getAllPosts();
    const redirects: Array<{ source: string; destination: string; permanent: boolean }> = [];

    posts.forEach(post => {
      const slugParts = post.slug.split('/');

      if (slugParts.length === 3) {
        const articleSlug = slugParts[2];

        // 1. 根路徑: /文章名 -> /blog/YYYY/MM/文章名
        redirects.push({
          source: `/${encodeURIComponent(articleSlug)}`,
          destination: `/blog/${post.slug}`,
          permanent: true, // 301 永久重定向
        });

        // 2. /posts/ 路徑重定向到 /blog/
        // /posts/文章名 -> /blog/YYYY/MM/文章名
        redirects.push({
          source: `/posts/${encodeURIComponent(articleSlug)}`,
          destination: `/blog/${post.slug}`,
          permanent: true,
        });

        // 3. /posts/YYYY/MM/文章名 -> /blog/YYYY/MM/文章名
        redirects.push({
          source: `/posts/${post.slug}`,
          destination: `/blog/${post.slug}`,
          permanent: true,
        });
      }
    });

    // 添加通用的 /posts 到 /blog 重定向
    redirects.push({
      source: '/posts',
      destination: '/blog',
      permanent: true,
    });

    return redirects;
  },
};

export default nextConfig;
