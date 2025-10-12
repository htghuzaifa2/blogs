
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
  keywords?: string[];
}

// A helper function to check if a post has all required frontmatter fields
function isValidPostData(data: any): data is { title: string; date: string; excerpt: string; author: string; category: string; imageUrl: string; imageHint: string; keywords?: string[] } {
    return data.title && data.date && data.excerpt && data.author && data.category && data.imageUrl && data.imageHint;
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
            imageUrl: string; 
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
  // Add class="phone-chart" to every table
  return htmlContent.replace(/<table/g, '<table class="phone-chart"');
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
      .use(html, { sanitize: false })
      .process(content);
    let htmlContent = processedContent.toString();

    // Process tables to add the necessary class
    if (htmlContent.includes('<table')) {
      const chartStyles = `
<style>
  /* Container */
  .phone-chart {
    width: 100%;
    max-width: 1100px;
    margin: 18px auto;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #111827;
  }

  /* Card header */
  .phone-chart .chart-title {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:10px;
    gap:12px;
  }
  .phone-chart h2 {
    font-size: 1.15rem;
    margin: 0;
    letter-spacing: -0.2px;
  }
  .phone-chart p.lead {
    margin: 0;
    color: #6b7280;
    font-size: .92rem;
  }

  /* Table reset + style */
  .phone-chart table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 6px 18px rgba(15,23,42,0.06);
    border-radius: 12px;
    overflow: hidden;
  }
  .phone-chart thead {
    background: linear-gradient(90deg, rgba(99,102,241,0.06), rgba(34,197,94,0.03));
  }
  .phone-chart th, .phone-chart td {
    padding: 14px 16px;
    text-align: left;
    vertical-align: middle;
    font-size: .95rem;
  }
  .phone-chart thead th {
    font-weight: 600;
    color: #374151;
    font-size: .95rem;
  }

  /* Row styling */
  .phone-chart tbody tr {
    border-top: 1px solid rgba(15,23,42,0.04);
    transition: background .12s ease, transform .08s ease;
  }
  .phone-chart tbody tr:hover {
    background: rgba(99,102,241,0.03);
    transform: translateY(-2px);
  }

  /* Phone name column */
  .phone-name {
    font-weight: 600;
    color: #0f172a;
  }
  .sub-note {
    display:block;
    color:#6b7280;
    font-size: .83rem;
    margin-top: 6px;
  }

  /* Price visual column */
  .price-cell {
    width: 320px;
    min-width: 200px;
  }
  .price-bar {
    height: 14px;
    background: linear-gradient(90deg, rgba(99,102,241,0.14), rgba(16,185,129,0.08));
    border-radius: 999px;
    position: relative;
    overflow: hidden;
  }
  .price-bar .bar {
    height: 100%;
    width: var(--price, 10%);
    max-width: 100%;
    min-width: 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(99,102,241,0.95), rgba(16,185,129,0.95));
    box-shadow: 0 2px 8px rgba(16,24,40,0.06);
    transition: width .45s cubic-bezier(.2,.9,.2,1);
  }
  .price-meta {
    margin-top:8px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:8px;
    font-size: .83rem;
    color: #374151;
  }

  /* What makes it stand out / weaknesses */
  .notes {
    color:#374151;
    font-size:.92rem;
    line-height:1.35;
  }
  .weakness {
    display:block;
    margin-top:6px;
    color:#6b7280;
    font-size:.85rem;
  }

  /* Responsive */
  @media (max-width: 880px) {
    .price-cell { min-width: 140px; width: 220px; }
    .phone-chart table, .phone-chart thead, .phone-chart tbody, .phone-chart th, .phone-chart td, .phone-chart tr {
      display: block;
    }
    .phone-chart thead { display: none; }
    .phone-chart tbody tr {
      margin-bottom: 12px;
      border-radius: 10px;
      padding: 12px;
      background: white;
      box-shadow: 0 6px 20px rgba(2,6,23,0.04);
    }
    .phone-chart td {
      display:flex;
      justify-content:space-between;
      gap:12px;
      padding: 8px 12px;
    }
    .phone-chart td.block {
      display:block;
      width:100%;
    }
    .price-meta { font-size:.8rem; }
  }

  /* small helper for badge */
  .badge {
    display:inline-block;
    font-weight:600;
    font-size:.78rem;
    padding:6px 8px;
    border-radius:999px;
    background: rgba(15,23,42,0.04);
    color:#0f172a;
  }
</style>
      `;
      htmlContent = chartStyles + htmlContent;
    }

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
        keywords?: string[];
      }),
    };
  } catch (err) {
    console.error(`Error reading or processing post with slug "${slug}":`, err);
    return undefined;
  }
}

    