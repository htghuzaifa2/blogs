
import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/posts';

export const runtime = 'edge';

export async function GET() {
  try {
    const posts = getPosts();
    // Only return the fields necessary for the search page
    const searchData = posts.map(({ id, slug, title, excerpt, category, author, imageUrl, imageHint }) => ({
      id,
      slug,
      title,
      excerpt,
      category,
      author,
      imageUrl,
      imageHint,
    }));
    return NextResponse.json(searchData);
  } catch (error) {
    console.error('Failed to fetch posts for search:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
