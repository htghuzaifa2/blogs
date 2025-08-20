
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// This script runs at build time to generate a single JSON file
// containing all the data needed for the client-side search page.

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const publicDirectory = path.join(process.cwd(), 'public');

function getPostsForSearch() {
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

        const { data } = matter(fileContents);

        // We only need a subset of data for the search page
        if (!data.title || !data.excerpt || !data.category || !data.author) {
            return null;
        }

        return {
          id: slug,
          slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          author: data.author,
          imageUrl: data.imageUrl || '',
          imageHint: data.imageHint || '',
        };
      } catch (e) {
          console.error(`Error processing post "${fileName}" for search data:`, e);
          return null;
      }
    })
    .filter(p => p !== null);

  return allPostsData;
}

function generateSearchData() {
    console.log('Generating search data...');
    const searchData = getPostsForSearch();
    const filePath = path.join(publicDirectory, 'search-data.json');

    if (!fs.existsSync(publicDirectory)) {
        fs.mkdirSync(publicDirectory);
    }

    fs.writeFileSync(filePath, JSON.stringify(searchData, null, 2));
    console.log(`Search data successfully generated at ${filePath}`);
}

generateSearchData();
