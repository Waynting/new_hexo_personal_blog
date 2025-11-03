import { getAllPosts, getAllCategories } from '@/lib/posts';
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from '@/components/ui/section';
import BlogClient from '@/components/BlogClient';

export const metadata = {
  title: 'All Articles',
  description: 'Articles, thoughts and learning notes',
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  
  // 計算每個分類的文章數量（排除未分類）
  const categoriesWithCount = categories
    .filter(cat => cat.slug !== 'uncategorized')
    .map(category => {
      const count = posts.filter(post => post.category === category.name).length;
      return { ...category, count };
    })
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count);
  
  return (
    <>
      {/* Hero Section */}
      <Section className="py-12 sm:py-16 md:py-20 bg-background">
        <SectionHeader className="text-center px-4">
          <SectionTitle className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            All Articles
          </SectionTitle>
          <SectionDescription className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Thoughts, learning notes, and insights from my journey
          </SectionDescription>

          {/* 快速統計 */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground">
            <span>共 {posts.length} 篇文章</span>
            <span className="hidden sm:inline">•</span>
            <span>{categoriesWithCount.length} 個分類</span>
          </div>
        </SectionHeader>
      </Section>

      {/* Blog Client with Category Filter and Posts */}
      <BlogClient posts={posts} categories={categoriesWithCount} />
    </>
  );
}

