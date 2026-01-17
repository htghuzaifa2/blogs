# Simple encoding fix script - using direct string replacement
$postsPath = "src\content\posts"
$files = Get-ChildItem -Path $postsPath -Filter "*.mdx" -File

Write-Host "Found $($files.Count) blog files to process..." -ForegroundColor Cyan
$fixCount = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $originalLength = $content.Length
    
    # Search for the specific corrupted pattern from the grep results
    if ($content -match 'â€') {
        Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
        
        # Replace corrupted patterns with correct ones
        $content = $content.Replace('â€œ', '"')
        $content = $content.Replace('â€', '"')
        $content = $content.Replace('â€™', "'")
        $content = $content.Replace('â€˜', "'")
        $content = $content.Replace('â€"', '–')
        $content = $content.Replace('â€"', '—')
        $content = $content.Replace('â€¦', '…')
        $content = $content.Replace('â€¢', '•')
        $content = $content.Replace('â‚‚', '₂')
        $content = $content.Replace('â‰¥', '≥')
        $content = $content.Replace('â‰¤', '≤')
        $content = $content.Replace('â‰ ', '≠')
        $content = $content.Replace('â†'', '→')
        $content = $content.Replace('â†�', '←')
        $content = $content.Replace('âœ"ï¸', '✔️')
        $content = $content.Replace('âœ"', '✔')
        $content = $content.Replace('Ã—', '×')
        $content = $content.Replace('Ã©', 'é')
        $content = $content.Replace('Ã¨', 'è')
        $content = $content.Replace('Ã´', 'ô')
        $content = $content.Replace('Ã¶', 'ö')
        $content = $content.Replace('Ã¼', 'ü')
        
        # Write the fixed content back
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        
        Write-Host "  [OK] Fixed!" -ForegroundColor Green
        $fixCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FILES FIXED: $fixCount" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
