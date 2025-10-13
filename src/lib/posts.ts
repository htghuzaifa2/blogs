
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
}

// A helper function to check if a post has all required frontmatter fields
function isValidPostData(data: any): data is { title: string; date: string; excerpt: string; author: string; category: string; keywords?: string[] } {
    return data.title && data.date && data.excerpt && data.author && data.category;
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

        // Use the validation function to ensure all required fields are present
        if (!isValidPostData(data)) {
            console.warn(`Skipping post "${fileName}" due to missing frontmatter.`);
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
    .filter((p): p is Omit<Post, 'htmlContent'> => p !== null)
    .map(post => {
        // Remove image markdown from content
        const contentWithoutImages = post.content.replace(/!\[.*?\]\(.*?\)\s*/g, '');
        return { ...post, content: contentWithoutImages };
    });

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

function processTables(htmlContent: string) {
  if (!htmlContent.includes('<table')) {
    return htmlContent;
  }
  // Wrap every table in a container for responsive scrolling
  return htmlContent.replace(/<table/g, '<div class="table-container"><table class="phone-chart"').replace(/<\/table>/g, '</table></div>');
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

    // Validate frontmatter for single post fetch as well
    if (!isValidPostData(data)) {
      console.warn(`Post with slug "${slug}" is invalid due to missing frontmatter.`);
      return undefined;
    }
    
    // Remove image markdown from content before processing
    const contentWithoutImages = content.replace(/!\[.*?\]\(.*?\)\s*/g, '');

    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(contentWithoutImages);
    let htmlContent = processedContent.toString();

    // Process tables to add the necessary container
    htmlContent = processTables(htmlContent);

    return {
      id: slug,
      slug,
      htmlContent,
      content: contentWithoutImages,
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
