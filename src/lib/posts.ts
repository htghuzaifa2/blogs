
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

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
  let fileNames: string[] = [];
  try {
    // Ensure the directory exists before attempting to read it.
    if (fs.existsSync(postsDirectory)) {
      fileNames = fs.readdirSync(postsDirectory);
    } else {
      // Don't log if the directory simply doesn't exist.
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

        // Use the validation function to ensure all required fields are present
        if (!isValidPostData(data)) {
          // This is a common case, so we won't log a loud warning.
          // console.warn(`Skipping post "${fileName}" due to missing frontmatter.`);
          return null;
        }

        // Generate HTML content for search-data.json
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
      // Don't log here, as notFound() will be handled by the page.
      return undefined;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate frontmatter for single post fetch as well
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
      }),
    };
  } catch (err) {
    console.error(`Error reading or processing post with slug "${slug}":`, err);
    return undefined;
  }
}
