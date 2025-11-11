import { Metadata } from 'next';
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from '@/components/ui/section';
import PhotoGallery from '@/components/PhotoGallery';
import { getPhotos } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'Photos - Wei-Ting Liu',
  description: 'Personal photography gallery by Wei-Ting Liu',
};

// 使用 ISR：每1小时重新生成页面
export const revalidate = 3600;

export default async function PhotosPage() {
  // 在服务端获取照片数据
  const photos = await getPhotos();

  return (
    <>
      {/* Hero Section */}
      <Section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <SectionHeader className="mb-16 text-center">
          <SectionTitle className="text-4xl sm:text-5xl md:text-6xl">
            Photo Gallery
          </SectionTitle>
          <SectionDescription className="text-xl mt-6 max-w-3xl mx-auto">
            A collection of my photography work, capturing moments and stories through the lens.
          </SectionDescription>
        </SectionHeader>
      </Section>

      {/* Photo Gallery */}
      <Section className="py-16">
        <SectionContent className="max-w-full px-4 sm:px-6 lg:px-8">
          <PhotoGallery initialPhotos={photos} />
        </SectionContent>
      </Section>
    </>
  );
}

