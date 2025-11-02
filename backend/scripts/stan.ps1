# PHPStan - Static Analysis Script
# Usage: .\scripts\stan.ps1 [level]

param(
    [int]$Level = 6,
    [switch]$Baseline,
    [switch]$Clear
)

if ($Clear) {
    Write-Host "[*] Clearing PHPStan cache..." -ForegroundColor Yellow
    docker exec -u www-data maintly-backend rm -rf var/cache/phpstan
}

Write-Host "[*] Running PHPStan (Level $Level)..." -ForegroundColor Cyan

if ($Baseline) {
    Write-Host "[*] Generating baseline file..." -ForegroundColor Yellow
    docker exec -u www-data maintly-backend vendor/bin/phpstan analyse --level=$Level --configuration=scripts/phpstan.neon --generate-baseline
}
else {
    docker exec -u www-data maintly-backend vendor/bin/phpstan analyse --level=$Level --configuration=scripts/phpstan.neon
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] No errors found!" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] PHPStan found errors. Fix them and run again." -ForegroundColor Red
    exit 1
}
