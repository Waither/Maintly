# PHPUnit Test Runner
# Usage: 
#   .\scripts\test.ps1                      # All tests
#   .\scripts\test.ps1 -Filter UserTest     # Specific test
#   .\scripts\test.ps1 -Coverage            # With coverage
#   .\scripts\test.ps1 -StopOnFailure       # Stop on first error
#   .\scripts\test.ps1 -ClearCache          # Clear cache first

param(
    [string]$Filter = "",
    [switch]$Coverage,
    [switch]$Verbose,
    [switch]$StopOnFailure,
    [switch]$ClearCache
)

if ($ClearCache) {
    Write-Host "Clearing cache..." -ForegroundColor Yellow
    docker exec -u www-data maintly-backend php bin/console cache:clear --env=test --no-warmup
    Write-Host ""
}

$cmd = "php bin/phpunit"

if ($Filter) {
    $cmd += " --filter=$Filter"
    Write-Host "Running tests matching: $Filter" -ForegroundColor Cyan
}

if ($Coverage) {
    $cmd += " --coverage-html var/coverage --coverage-text"
    Write-Host "Coverage report will be generated in var/coverage/index.html" -ForegroundColor Cyan
}

if ($Verbose) {
    $cmd += " --testdox"
}

if ($StopOnFailure) {
    $cmd += " --stop-on-failure"
}

$cmd += " --colors=always"

Write-Host "Running tests..." -ForegroundColor Green
Write-Host ""

docker exec -u www-data maintly-backend bash -c "$cmd"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] All tests passed!" -ForegroundColor Green
    
    if ($Coverage) {
        Write-Host "Open coverage report: backend/var/coverage/index.html" -ForegroundColor Cyan
    }
}
else {
    Write-Host ""
    Write-Host "[FAIL] Tests failed!" -ForegroundColor Red
    Write-Host "TIP: Use -StopOnFailure to stop on first error" -ForegroundColor Yellow
    Write-Host "TIP: Use -Filter TestName to run specific test" -ForegroundColor Yellow
    exit 1
}
