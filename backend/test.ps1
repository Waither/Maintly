# Quick PHPUnit test runner - executes tests inside Docker container
# Usage:
#   .\test.ps1                          # All tests
#   .\test.ps1 Integration              # Integration suite
#   .\test.ps1 SecurityController       # Specific test class
#   .\test.ps1 -Coverage                # All tests with HTML coverage report

param(
    [string]$Filter = "",
    [switch]$Coverage
)

$cmd = "docker exec -u www-data maintly-backend php bin/phpunit --testdox"

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
