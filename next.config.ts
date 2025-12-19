import type { NextConfig } from "next";
import { getAllPosts, getAllCategories } from './src/lib/posts';

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

    // 添加分類頁面的重定向（從舊的 URL 格式重定向到新的格式）
    const categories = await getAllCategories();
    categories.forEach(category => {
      // 如果分類名稱和 slug 不同，添加重定向
      // 例如：/blog/category/台大資管生活 -> /blog/category/ntu-life
      const categoryNameSlug = category.name.toLowerCase().replace(/\s+/g, '-');
      if (category.slug !== categoryNameSlug && category.slug !== 'uncategorized') {
        redirects.push({
          source: `/blog/category/${encodeURIComponent(category.name)}`,
          destination: `/blog/category/${category.slug}`,
          permanent: true,
        });
      }
      
      // 添加 /posts/category/:slug 到 /blog/category/:slug 的重定向
      redirects.push({
        source: `/posts/category/${category.slug}`,
        destination: `/blog/category/${category.slug}`,
        permanent: true,
      });
    });

    return redirects;
  },
};

export default nextConfig;
