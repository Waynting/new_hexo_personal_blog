export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modifiedDate?: string;
  category: string;
  tags: string[];
  author: Author;
  readTime: string;
  seo: SEOMeta;
  featuredImage?: string;
  coverImage?: string;
}

export interface Author {
  name: string;
  email?: string;
  avatar?: string;
}

export interface SEOMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

