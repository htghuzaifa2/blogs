
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
  let fileNames: string[] = [];
  try {
    // Ensure the directory exists before attempting to read it.
    if (fs.existsSync(postsDirectory)) {
      fileNames = fs.readdirSync(postsDirectory);
    } else {
      console.warn(`Posts directory not found at: ${postsDirectory}`);
      return [];
    }
  } catch (err) {
    console.error('Could not read posts directory:', err);
    return [];
  }
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx')) // Process only .mdx files
    .map(fileName => {
      try {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        // Basic validation to ensure required fields are present
        if (!data.title || !data.date || !data.excerpt || !data.author || !data.category) {
            console.warn(`Skipping post "${fileName}" due to missing frontmatter (title, date, excerpt, author, or category).`);
            return null;
        }

        return {
          id: slug,
          slug,
          htmlContent: '',
          content: content,
          ...(data as { 
            title: string; 
            excerpt: string; 
            imageUrl: string; 
            imageHint: string;
            author: string;
            category: string;
            date: string;
          }),
        };
      } catch (e) {
          console.error(`Error processing post "${fileName}":`, e);
          return null;
      }
    })
    .filter((p): p is Post => p !== null);

  // Sort posts by date in descending order (newest first)
  return allPostsData.sort((a, b) => {
    try {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } catch (e) {
      console.error('Invalid date format in one of the posts.');
      return 0;
    }
  });
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`Post with slug "${slug}" not found at path: ${fullPath}`);
      return undefined;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(content);
    const htmlContent = processedContent.toString();

    return {
      id: slug,
      slug,
      htmlContent,
      content,
      ...(data as { 
        title: string; 
        excerpt: string; 
        imageUrl: string; 
        imageHint: string;
        author: string;
        category: string;
        date: string;
      }),
    };
  } catch (err) {
    console.error(`Error reading or processing post with slug "${slug}":`, err);
    return undefined;
  }
}
