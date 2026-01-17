import os
import re
import json

posts_dir = r"d:\Web Dev\blog huzi.pk   (Main) with versions\v2 (Ads)\blogs-main\blogs-main\src\content\posts"
output_report = r"d:\Web Dev\blog huzi.pk   (Main) with versions\v2 (Ads)\blogs-main\blogs-main\global_audit_report.json"

def standardize_metadata(content):
    # Regex to capture frontmatter
    fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not fm_match:
        return content, False
    
    fm_block = fm_match.group(1)
    body = content[fm_match.end():]
    
    lines = fm_block.split('\n')
    new_lines = []
    
    # Standard settings
    fields = {
        'author': '"Huzi"',
        'date': '"2025-01-17"'
    }
    handled_fields = set()
    
    # Fields to remove
    to_remove = ['keywords', 'imageHint', 'imageUrl']
    
    for line in lines:
        if ':' not in line:
            continue
        key, val = line.split(':', 1)
        key = key.strip()
        
        if key in to_remove:
            continue
        
        if key in fields:
            new_lines.append(f"{key}: {fields[key]}")
            handled_fields.add(key)
        else:
            new_lines.append(line)
            
    # Add missing fields
    for key, val in fields.items():
        if key not in handled_fields:
            new_lines.append(f"{key}: {val}")
            
    new_fm = "---\n" + "\n".join(new_lines) + "\n---"
    return new_fm + "\n" + body, True

def get_word_count(content):
    # Remove frontmatter for word count
    body = re.sub(r'^---\s*\n.*?\n---\s*\n', '', content, flags=re.DOTALL)
    words = re.findall(r'\w+', body)
    return len(words)

report_data = []

for filename in os.listdir(posts_dir):
    if filename.endswith(".mdx"):
        file_path = os.path.join(posts_dir, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        word_count = get_word_count(content)
        new_content, updated = standardize_metadata(content)
        
        if updated:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
        report_data.append({
            "file": filename,
            "wordCount": word_count,
            "status": "Metadata Standardized"
        })

# Sort by word count to identify "too short" blogs (ascending)
report_data.sort(key=lambda x: x['wordCount'])

with open(output_report, 'w', encoding='utf-8') as f:
    json.dump(report_data, f, indent=2)

print(f"Audit complete. Processed {len(report_data)} files.")
