
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../src/content/posts');
const OUTPUT_FILE = path.join(__dirname, '../blog_analysis_report.json');

function countWords(text) {
    // Remove code blocks
    const noCode = text.replace(/```[\s\S]*?```/g, '');
    // Remove frontmatter
    const noFrontmatter = noCode.replace(/---[\s\S]*?---/, '');
    // Remove HTML tags
    const noHtml = noFrontmatter.replace(/<[^>]*>/g, '');
    // Simple word count
    return noHtml.trim().split(/\s+/).length;
}

function analyze() {
    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`Directory not found: ${POSTS_DIR}`);
        return;
    }

    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
    const report = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const wordCount = countWords(content);
        if (wordCount < 1000) {
            report.push({ file, wordCount });
        }
    });

    // Sort by word count asc
    report.sort((a, b) => a.wordCount - b.wordCount);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
    console.log(`Analyzed ${files.length} files. Found ${report.length} under 1000 words.`);
    console.log(`Report saved to ${OUTPUT_FILE}`);
}

analyze();
