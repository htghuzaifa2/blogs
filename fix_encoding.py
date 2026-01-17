#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix character encoding issues in blog MDX files"""

import os
import glob
from pathlib import Path

# Define replacements - corrupted to correct
REPLACEMENTS = {
    '\u00e2\u20ac\u0153': '"',  # Left double quote
    '\u00e2\u20ac\u009d': '"',  # Right double quote
    '\u00e2\u20ac\u2122': "'",  # Apostrophe
    '\u00e2\u20ac\u02dc': "'",  # Left single quote
    '\u00e2\u20ac\u201c': '\u2013',  # En dash
    '\u00e2\u20ac\u201d': '\u2014',  # Em dash
    '\u00e2\u20ac\u00a6': '\u2026',  # Ellipsis
    '\u00e2\u0080\u00a2': '\u2022',  # Bullet
    '\u00e2\u0082\u201a': '\u2082',  # Subscript 2
    '\u00e2\u0089\u00a5': '\u2265',  # Greater or equal
    '\u00e2\u0089\u00a4': '\u2264',  # Less or equal
    '\u00e2\u0089\u00a0': '\u2260',  # Not equal
    '\u00e2\u0086\u2019': '\u2192',  # Right arrow
    '\u00e2\u009c\u201c': '\u2714',  # Checkmark
    '\u00c3\u0097': '\u00d7',  # Multiplication
    '\u00c3\u00a9': '\u00e9',  # e acute
    '\u00c3\u00b6': '\u00f6',  # o umlaut
}

posts_dir = Path('src/content/posts')
mdx_files = list(posts_dir.glob('*.mdx'))

print(f"Found {len(mdx_files)} blog files to process...")
fixed_count = 0

for file_path in mdx_files:
    try:
        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has issues
        has_issues = any(bad in content for bad in REPLACEMENTS.keys())
        
        if has_issues:
            print(f"Processing: {file_path.name}")
            original_content = content
            
            # Apply all replacements
            for bad, good in REPLACEMENTS.items():
                content = content.replace(bad, good)
            
            # Write back if changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(content)
                print(f"  [OK] Fixed!")
                fixed_count += 1
    
    except Exception as e:
        print(f"  [ERROR] {file_path.name}: {e}")

print()
print("=" * 40)
print(f"FILES FIXED: {fixed_count}")
print("=" * 40)
