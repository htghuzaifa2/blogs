import os
import re

POSTS_DIR = r"d:\Web Dev\blog huzi.pk   (Main) with versions\v2 (Ads)\blogs-main\blogs-main\src\content\posts"

# Comprehensive mapping of mangled UTF-8 characters
REPLACEMENTS = {
    "â€œ": '"',
    "â€\x9d": '"',  # Often appears as â€ plus a non-printable
    "â€": '"',      # Catch-all for the closing quote mangling
    "â€™": "'",
    "â€˜": "'",
    "â€“": "-",
    "â€”": "--",
    "â€¦": "...",
    "â€¢": "*",
    "â„¢": "(TM)",
    "â€¡": "++",
    "â€ ": "+",
    "âœ“": "[Check]",
    "Â": "",        # Non-breaking space artifact
}

def fix_content(content):
    # 1. Fix Mojibake
    for mangled, fixed in REPLACEMENTS.items():
        content = content.replace(mangled, fixed)
    
    # 2. Additional cleanup for leftover "â" characters followed by spaces or punctuation
    content = re.sub(r'â\s+', ' ', content)
    
    # 3. Standardize to "British English" spelling for some common terms if present
    # (Optional, but user asked for plain British English)
    # common_uk = {
    #     r'\boptimize': 'optimise',
    #     r'\bstandardize': 'standardise',
    #     r'\bcolor\b': 'colour',
    #     r'\bcenter\b': 'centre',
    # }
    # for us, uk in common_uk.items():
    #     content = re.sub(us, uk, content, flags=re.IGNORECASE)

    return content

def main():
    count = 0
    for filename in os.listdir(POSTS_DIR):
        if filename.endswith('.mdx'):
            file_path = os.path.join(POSTS_DIR, filename)
            try:
                # Read as binary to handle any weirdness, but here we'll try UTF-8 first
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                new_content = fix_content(content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count += 1
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    print(f"Fixed encoding in {count} files.")

if __name__ == "__main__":
    main()
