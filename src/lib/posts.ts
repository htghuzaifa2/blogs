export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  author: string;
  date: string;
}

const posts: Post[] = [];

export const getPosts = (): Post[] => posts;

export const getPostBySlug = (slug: string): Post | undefined => posts.find(p => p.slug === slug);
