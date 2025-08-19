
import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/posts';

export async function GET() {
  try {
    const posts = getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
