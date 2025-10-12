
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const outputDirectory = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDirectory, 'search-data.json');

// A helper function to check if a post has all required frontmatter fields
function isValidPostData(data) {
    return data.title && data.date && data.excerpt && data.author && data.category && data.imageUrl && data.imageHint;
}

function getSearchablePosts() {
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

        if (!isValidPostData(data)) {
            console.warn(`Skipping post "${fileName}" for search index due to missing frontmatter.`);
            return null;
        }

        // Return a leaner object for the search index
        return {
          id: slug,
          slug,
          title: data.title,
          excerpt: data.excerpt,
          imageUrl: data.imageUrl,
          imageHint: data.imageHint,
          author: data.author,
          category: data.category,
          date: data.date,
          content: content, // Keep raw content for searching
          htmlContent: '', // Not needed for search data
        };
      } catch (e) {
          console.error(`Error processing post "${fileName}" for search index:`, e);
          return null;
      }
    })
    .filter(p => p !== null);

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateSearchData() {
  try {
    const posts = getSearchablePosts();
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }
    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    console.log(`✅ Search data successfully generated at ${outputFile}`);
    console.log(`Indexed ${posts.length} posts.`);
  } catch (error) {
    console.error('❌ Error generating search data:', error);
    process.exit(1); // Exit with error code to fail the build if search indexing fails
  }
}

generateSearchData();
