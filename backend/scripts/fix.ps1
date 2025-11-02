# PHP CS Fixer - Quick Format Script
# Usage: .\scripts\fix.ps1

Write-Host "[*] Running PHP CS Fixer..." -ForegroundColor Cyan

docker exec -u www-data maintly-backend vendor/bin/php-cs-fixer fix src/ --config=scripts/.php-cs-fixer.php

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Code formatted successfully!" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] PHP CS Fixer failed!" -ForegroundColor Red
    exit 1
}
