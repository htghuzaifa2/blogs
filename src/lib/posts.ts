import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  htmlContent: string;
  imageUrl: string;
  imageHint: string;
  author: string;
  category: string;
  date: string;
}

export function getPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id: slug,
      slug,
      ...(matterResult.data as { 
        title: string; 
        excerpt: string; 
        imageUrl: string; 
        imageHint: string;
        author: string;
        category: string;
        date: string;
      }),
      content: matterResult.content,
      htmlContent: ''
    };
  });

  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).map(p => ({...p, id: p.slug}));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(matterResult.content);
    const htmlContent = processedContent.toString();

    return {
      id: slug,
      slug,
      htmlContent,
      ...(matterResult.data as { 
        title: string; 
        excerpt: string; 
        imageUrl: string; 
        imageHint: string;
        author: string;
        category: string;
        date: string;
      }),
      content: matterResult.content,
    };
  } catch (err) {
    return