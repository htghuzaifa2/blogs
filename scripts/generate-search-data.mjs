const fs = require('fs');
const path = require('path');
const { getPosts } = require('../src/lib/posts.js');

// This script needs to run in a context where it can import from `posts.ts`.
// Next.js uses a mix of module systems. For a simple build script, CommonJS (`require`) is more robust.
// We are renaming `posts.ts` to `posts.js` temporarily in the require call to avoid module issues.

async function generateSearchData() {
  console.log('Starting to generate search data...');
  try {
    const posts = getPosts(); // This function reads from the file system
    
    // We only need a subset of data for searching and displaying results.
    const searchData = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      // Fields needed for the BlogCard component
      id: post.id,
      imageUrl: post.imageUrl,
      imageHint: post.imageHint,
      author: post.author,
      date: post.date,
    }));

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, 'search-data.json');
    fs.writeFileSync(filePath, JSON.stringify(searchData, null, 2));
    
    console.log(`Successfully generated search-data.json with ${searchData.length} posts.`);
  } catch (error) {
    console.error('Error generating search data:', error);
    process.exit(1); // Exit with an error code
  }
}

// Rename posts.ts to posts.js to allow `require` to work
const postsLibPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
const postsLibPathJs = path.join(process.cwd(), 'src', 'lib', 'posts.js');

try {
  fs.renameSync(postsLibPath, postsLibPathJs);
  generateSearchData().then(() => {
    // Rename it back after the script is done.
    fs.renameSync(postsLibPathJs, postsLibPath);
  });
} catch (err) {
  console.error('Error renaming posts.ts for build script:', err);
  // If it failed, try to rename it back if the js file exists
  if (fs.existsSync(postsLibPathJs) && !fs.existsSync(postsLibPath)) {
      fs.renameSync(postsLibPathJs, postsLibPath);
  }
  process.exit(1);
}
