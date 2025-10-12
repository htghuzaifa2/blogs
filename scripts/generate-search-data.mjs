
// Using dynamic import() for a .ts file from a .mjs script in a CommonJS-like environment
// is the correct way to handle module differences in this project setup.
import('ts-node/register/transpile-only');
import('tsconfig-paths/register');
import('dotenv/config');

async function generateSearchData() {
  try {
    // Dynamically import the getPosts function
    const { getPosts } = await import('../src/lib/posts.ts');
    const posts = getPosts();
    const fs = await import('fs');
    const path = await import('path');

    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    // Map posts to a lighter format for search
    const searchablePosts = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      imageUrl: post.imageUrl,
      imageHint: post.imageHint,
      author: post.author,
      date: post.date,
    }));

    // Write the data to search-data.json in the public folder
    const outputPath = path.join(publicDir, 'search-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchablePosts, null, 2));

    console.log(`✅ Successfully generated search data at ${outputPath}`);

  } catch (error) {
    console.error('❌ Error generating search data:', error);
    // Exit with a non-zero code to fail the build if search data can't be generated
    process.exit(1); 
  }
}

generateSearchData();
