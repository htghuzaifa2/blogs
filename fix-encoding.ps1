# PowerShell Script to Fix Character Encoding Issues in Blog Posts
# This script fixes mojibake (corrupted UTF-8 characters) in all .mdx files

$postsPath = "src\content\posts"
$files = Get-ChildItem -Path $postsPath -Filter "*.mdx" -File

Write-Host "Found $($files.Count) blog files to process..." -ForegroundColor Cyan

$fixCount = 0
$fileCount = 0

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    # Read file content with UTF-8 encoding
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Fix corrupted quotes and apostrophes - using byte patterns
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0x9C, '"'  # Left double quote
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0x9D, '"'  # Right double quote
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0x99, "'"  # Apostrophe
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0x98, "'"  # Left single quote
    
    # Fix dashes
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0x93, [char]0x2013  # En dash
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0x94, [char]0x2014  # Em dash
    
    # Fix subscript 2 (for CO2)
    $content = $content -replace [char]0xE2 + [char]0x82 + [char]0x82, [char]0x2082
    
    # Fix arrows
    $content = $content -replace [char]0xE2 + [char]0x86 + [char]0x92, [char]0x2192  # Right arrow
    
    # Fix greater/less than or equal
    $content = $content -replace [char]0xE2 + [char]0x89 + [char]0xA5, [char]0x2265  # >=
    $content = $content -replace [char]0xE2 + [char]0x89 + [char]0xA4, [char]0x2264  # <=
    
    # Fix not equal
    $content = $content -replace [char]0xE2 + [char]0x89 + [char]0xA0, [char]0x2260
    
    # Fix accented characters
    $content = $content -replace [char]0xC3 + [char]0xA9, [char]0xE9  # e acute
    $content = $content -replace [char]0xC3 + [char]0xB6, [char]0xF6  # o umlaut
    
    # Fix ellipsis
    $content = $content -replace [char]0xE2 + [char]0x80 + [char]0xA6, [char]0x2026
    
    # Fix checkmark
    $content = $content -replace [char]0xE2 + [char]0x9C + [char]0x94, [char]0x2714
    
    # Fix multiplication
    $content = $content -replace [char]0xC3 + [char]0x97, [char]0xD7
    
    # Check if any changes were made
    if ($content -ne $originalContent) {
        # Write back with UTF-8 encoding (no BOM)
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        
        Write-Host "  [OK] Fixed encoding issues" -ForegroundColor Green
        $fixCount++
    } else {
        Write-Host "  [--] No issues found" -ForegroundColor Gray
    }
    
    $fileCount++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Processing Complete!" -ForegroundColor Green
Write-Host "Files processed: $fileCount" -ForegroundColor White
Write-Host "Files fixed: $fixCount" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
