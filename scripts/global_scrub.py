import os
import re

POSTS_DIR = r"d:\Web Dev\blog huzi.pk   (Main) with versions\v2 (Ads)\blogs-main\blogs-main\src\content\posts"

def transform_mdx(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split frontmatter and body
    parts = re.split(r'^---$', content, flags=re.MULTILINE)
    if len(parts) < 3:
        return

    frontmatter = parts[1]
    body = parts[2]

    # 1. Standardize Metadata
    # Update author to "Huzi"
    frontmatter = re.sub(r'^author:.*$', 'author: "Huzi"', frontmatter, flags=re.MULTILINE)
    # Update date to "2025"
    frontmatter = re.sub(r'^date:.*$', 'date: "2025"', frontmatter, flags=re.MULTILINE)
    # Remove image-related fields
    frontmatter = re.sub(r'^imageUrl:.*$\n?', '', frontmatter, flags=re.MULTILINE)
    frontmatter = re.sub(r'^imageHint:.*$\n?', '', frontmatter, flags=re.MULTILINE)
    
    # Ensure author and date exist if they were missing or failed to match
    if 'author:' not in frontmatter:
        frontmatter += 'author: "Huzi"\n'
    if 'date:' not in frontmatter:
        frontmatter += 'date: "2025"\n'

    # 2. Scrub Body for Images
    # Remove ![alt](url)
    body = re.sub(r'!\[.*?\]\(.*?\)', '', body)
    # Remove <img> tags (including self-closing and separate closing)
    body = re.sub(r'<img.*?>', '', body, flags=re.IGNORECASE | re.DOTALL)
    
    # 3. Clean up leading/trailing whitespace in body
    body = body.strip()

    # Reconstruct
    new_content = f"---\n{frontmatter.strip()}\n---\n\n{body}\n"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    for filename in os.listdir(POSTS_DIR):
        if filename.endswith('.mdx'):
            file_path = os.path.join(POSTS_DIR, filename)
            try:
                transform_mdx(file_path)
                print(f"Processed: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    main()
