
import { getPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const posts = getPosts();
  return NextResponse.json(posts);
}
