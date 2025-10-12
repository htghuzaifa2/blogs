import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const outputFilePath = path.join(process.cwd(), 'public/search-data.json');

function getPosts() {
  let fileNames = [];
  try {
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
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      try {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        if (!data.title || !data.date || !data.excerpt || !data.author || !data.category || !data.imageUrl || !data.imageHint) {
          console.warn(`Skipping post "${fileName}" due to missing frontmatter.`);
          return null;
        }

        return {
          id: slug,
          slug,
          title: data.title,
          excerpt: data.excerpt,
          content: content, // include content for better search
          imageUrl: data.imageUrl,
          imageHint: data.imageHint,
          author: data.author,
          category: data.category,
          date: data.date,
          keywords: data.keywords || [],
        };
      } catch (e) {
        console.error(`Error processing post "${fileName}":`, e);
        return null;
      }
    })
    .filter(p => p !== null);

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateSearchData() {
  const posts = getPosts();
  const searchData = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    content: post.content, // Adding content to the search index
  }));

  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(searchData, null, 2));
    console.log(`Successfully generated search data for ${posts.length} posts at ${outputFilePath}`);
  } catch (err) {
    console.error('Failed to write search data file:', err);
  }
}

generateSearchData();
