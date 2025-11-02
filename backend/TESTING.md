# Testing Guide

## Quick Start

```powershell
cd backend

# All tests
.\test.ps1

# Specific suite
.\test.ps1 Integration

# Specific test class
.\test.ps1 SecurityController

# With code coverage report
.\test.ps1 -Coverage
```

## Code Coverage

Generate HTML coverage report (requires PCOV extension):

```powershell
.\test.ps1 -Coverage
```

Report will be generated in `backend/var/coverage/index.html` - open in browser to see:
- Line coverage percentage
- Which lines are tested
- Uncovered code paths

## Manual Docker Command

```powershell
docker exec -u www-data maintly-backend php bin/phpunit --testdox
docker exec -u www-data maintly-backend php bin/phpunit tests/Integration/Controller/SecurityControllerTest.php
docker exec -u www-data maintly-backend php bin/phpunit --coverage-html var/coverage
```

## Test Environment

- Uses same database as dev (`maintly`) with DAMA transaction rollback
- Rate limiter disabled in tests
- Each test runs in isolated transaction - no data pollution

## Cache Clear

```powershell
.\cc.ps1  # Clears both dev and test cache
```
