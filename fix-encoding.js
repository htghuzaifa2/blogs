const fs = require('fs');
const path = require('path');

// Directory containing blog posts
const postsDir = path.join(__dirname, 'src', 'content', 'posts');

// Replacements map
const replacements = [
    [/â€œ/g, '"'],   // Left double quote
    [/â€/g, '"'],   // Right double quote  
    [/â€™/g, "'"],   // Apostrophe
    [/â€˜/g, "'"],   // Left single quote
    [/â€"/g, '–'],  // En dash
    [/â€"/g, '—'],  // Em dash
    [/â€¦/g, '…'],   // Ellipsis
    [/â€¢/g, '•'],   // Bullet
    [/â‚‚/g, '₂'],   // Subscript 2
    [/â‰¥/g, '≥'],   // Greater or equal
    [/â‰¤/g, '≤'],   // Less or equal  
    [/â‰ /g, '≠'],   // Not equal
    [/â†'/g, '→'],   // Right arrow
    [/â†/g, '←'],   // Left arrow
    [/âœ"ï¸/g, '✔️'], // Checkmark with variation
    [/âœ"/g, '✔'],   // Checkmark
    [/Ã—/g, '×'],    // Multiplication
    [/Ã©/g, 'é'],    // e acute
    [/Ã¨/g, 'è'],    // e grave  
    [/Ã´/g, 'ô'],    // o circumflex
    [/Ã¶/g, 'ö'],    // o umlaut
    [/Ã¼/g, 'ü'],    // u umlaut
    // Additional fixes for escaped quotes
    [/\\"\"/g, '—'],  // Escaped double quotes should be em-dash
    [/""/g, '—'],     // Double quotes at start of attribution
];

// Get all MDX files
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));

console.log(`Found ${files.length} blog files to process...`);

let fixedCount = 0;

files.forEach(filename => {
    const filePath = path.join(postsDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Check if file has encoding issues
    if (content.includes('â€')) {
        console.log(`Processing: ${filename}`);

        // Apply all replacements
        replacements.forEach(([pattern, replacement]) => {
            content = content.replace(pattern, replacement);
        });

        // Write back if changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  [OK] Fixed!`);
            fixedCount++;
        }
    }
});

console.log('');
console.log('========================================');
console.log(`FILES FIXED: ${fixedCount}`);
console.log('========================================');
