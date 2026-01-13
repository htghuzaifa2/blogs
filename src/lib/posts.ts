
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// Cache the posts in memory after the first load to speed up the build process
let postsCache: Post[] | null = null;

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  htmlContent: string;
  author: string;
  category: string;
  date: string;
  keywords?: string[];
  imageUrl?: string;
  imageHint?: string;
}

// A helper function to check if a post has all required frontmatter fields
function isValidPostData(data: any): data is { title: string; date: string; excerpt: string; author: string; category: string; keywords?: string[] } {
  return data && data.title && data.date && data.excerpt && data.author && data.category;
}

function processTables(htmlContent: string) {
  if (!htmlContent.includes('<table')) {
    return htmlContent;
  }
  // Wrap every table in a container for responsive scrolling
  return htmlContent.replace(/<table/g, '<div class="table-container"><table').replace(/<\/table>/g, '</table></div>');
}


export function getPosts(): Post[] {
  // If we already have the posts in memory, return them immediately
  if (postsCache) {
    return postsCache;
  }

  let fileNames: string[] = [];
  try {
    if (fs.existsSync(postsDirectory)) {
      fileNames = fs.readdirSync(postsDirectory);
    } else {
      return [];
    }
  } catch (err) {
    console.error('Could not read posts directory:', err);
    return [];
  }

  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      try {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        if (!isValidPostData(data)) {
          return null;
        }

        // We only generate the HTML content once and cache it.
        // During the build, this is done for every post.
        const processedContent = remark()
          .use(remarkGfm)
          .use(html, { sanitize: false })
          .processSync(content);

        let htmlContent = processTables(processedContent.toString());

        return {
          id: slug,
          slug,
          htmlContent: htmlContent,
          content: content,
          ...(data as {
            title: string;
            excerpt: string;
            author: string;
            category: string;
            date: string;
            keywords?: string[];
            imageUrl?: string;
            imageHint?: string;
          }),
        };
      } catch (e) {
        console.error(`Error processing post "${fileName}":`, e);
        return null;
      }
    })
    .filter((p): p is Post => p !== null);

  // Sort posts by date in descending order (newest first)
  const sortedPosts = allPostsData.sort((a, b) => {
    try {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } catch (e) {
      console.error('Invalid date format in one of the posts.');
      return 0;
    }
  });

  // Save to cache for subsequent calls in the same process
  postsCache = sortedPosts;
  return sortedPosts;
}


export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  // If cache exists, try to find the post there first to avoid file I/O and parsing
  if (postsCache) {
    return postsCache.find(p => p.slug === slug);
  }

  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  try {
    if (!fs.existsSync(fullPath)) {
      return undefined;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!isValidPostData(data)) {
      console.warn(`Post with slug "${slug}" is invalid due to missing frontmatter.`);
      return undefined;
    }

    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);
    let htmlContent = processedContent.toString();

    // Process tables to add the necessary container
    htmlContent = processTables(htmlContent);

    return {
      id: slug,
      slug,
      htmlContent,
      content: content,
      ...(data as {
        title: string;
        excerpt: string;
        author: string;
        category: string;
        date: string;
        keywords?: string[];
        imageUrl?: string;
        imageHint?: string;
      }),
    };
  } catch (err) {
    console.error(`Error reading or processing post with slug "${slug}":`, err);
    return undefined;
  }
}
