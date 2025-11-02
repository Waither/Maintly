# Run all checks: Fix + Stan + Test
# Usage: .\scripts\all.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Running all checks" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Fix
Write-Host "[1/3] Formatting code..." -ForegroundColor Yellow
& "$PSScriptRoot\fix.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "FAILED at formatting step!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Stan
Write-Host "[2/3] Running static analysis..." -ForegroundColor Yellow
& "$PSScriptRoot\stan.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "FAILED at static analysis step!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Test
Write-Host "[3/3] Running tests..." -ForegroundColor Yellow
& "$PSScriptRoot\test.ps1" -Verbose
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "FAILED at testing step!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "  ALL CHECKS PASSED!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ready to commit!" -ForegroundColor Cyan
