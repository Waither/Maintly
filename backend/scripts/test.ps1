# Quick PHPUnit test runner - executes tests inside Docker container
# Usage:
#   .\scripts\test.ps1                          # All tests
#   .\scripts\test.ps1 Integration              # Integration suite
#   .\scripts\test.ps1 SecurityController       # Specific test class
#   .\scripts\test.ps1 -Coverage                # All tests with HTML coverage report

param(
    [string]$Filter = "",
    [switch]$Coverage
)

$cmd = "# PHPUnit Test Runner (Enhanced)
# Usage: 
#   .\test.ps1                              # All tests
#   .\test.ps1 -Filter UserTest             # Specific test
#   .\test.ps1 -Coverage                    # With coverage
#   .\test.ps1 -StopOnFailure               # Stop on first error
#   .\test.ps1 -Verbose                     # Detailed output
#   .\test.ps1 -ClearCache                  # Clear cache first

param(
    [string]$Filter = "",
    [switch]$Coverage,
    [switch]$Verbose,
    [switch]$StopOnFailure,
    [switch]$ClearCache
)

if ($ClearCache) {
    Write-Host "[*] Clearing cache..." -ForegroundColor Yellow
    docker exec -u www-data maintly-backend php bin/console cache:clear --env=test --no-warmup
    Write-Host ""
}

$cmd = "php bin/phpunit"

if ($Filter) {
    $cmd += " --filter=$Filter"
    Write-Host "[*] Running tests matching: $Filter" -ForegroundColor Cyan
}

if ($Coverage) {
    $cmd += " --coverage-html var/coverage --coverage-text"
    Write-Host "[*] Coverage report will be generated in var/coverage/index.html" -ForegroundColor Cyan
}

if ($Verbose) {
    $cmd += " --verbose"
}

if ($StopOnFailure) {
    $cmd += " --stop-on-failure"
}

$cmd += " --colors=always"

Write-Host "[*] Running tests..." -ForegroundColor Green
Write-Host ""

docker exec -u www-data maintly-backend $cmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] All tests passed!" -ForegroundColor Green
    
    if ($Coverage) {
        Write-Host "[*] Open coverage report: backend/var/coverage/index.html" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "[FAIL] Tests failed!" -ForegroundColor Red
    Write-Host "[TIP] Use -StopOnFailure to stop on first error" -ForegroundColor Yellow
    Write-Host "[TIP] Use -Filter TestName to run specific test" -ForegroundColor Yellow
    exit 1
}"

if ($Coverage) {
    $cmd += " --coverage-html var/coverage"
    Write-Host "Running tests with code coverage (HTML report in var/coverage)..." -ForegroundColor Cyan
}
elseif ($Filter) {
    $cmd += " --filter $Filter"
    Write-Host "Running filtered tests in Docker..." -ForegroundColor Cyan
}
else {
    Write-Host "Running tests in Docker..." -ForegroundColor Cyan
}

Invoke-Expression $cmd

if ($Coverage) {
    Write-Host "`nCoverage report generated in backend/var/coverage/index.html" -ForegroundColor Green
}
