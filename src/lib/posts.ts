
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
  imageUrl: string;
  imageHint: string;
  author: string;
  category: string;
  date: string;
  keywords?: string[];
}

function getImageUrl(hint: string): string {
  if (!hint) {
    return 'https://picsum.photos/seed/1/1200/630';
  }
  // Use a more robust image CDN like Unsplash for better quality and relevance.
  // The query parameter helps get a more relevant image.
  return `https://source.unsplash.com/1200x630/?${encodeURIComponent(hint.replace(/ /g, ','))}`;
}


// A helper function to check if a post has all required frontmatter fields
function isValidPostData(data: any): data is { title: string; date: string; excerpt: string; author: string; category: string; imageHint: string; keywords?: string[] } {
    return data.title && data.date && data.excerpt && data.author && data.category && data.imageHint;
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
        
        const imageUrl = getImageUrl(data.imageHint);

        return {
          id: slug,
          slug,
          htmlContent: '',
          content: content,
          imageUrl: imageUrl, // Use the dynamically generated URL
          ...(data as { 
            title: string; 
            excerpt: string; 
            imageHint: string;
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

    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);
    let htmlContent = processedContent.toString();

    // Process tables to add the necessary container
    htmlContent = processTables(htmlContent);
    
    const imageUrl = getImageUrl(data.imageHint);

    return {
      id: slug,
      slug,
      htmlContent,
      content,
      imageUrl,
      ...(data as { 
        title: string; 
        excerpt: string; 
        imageHint: string;
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
