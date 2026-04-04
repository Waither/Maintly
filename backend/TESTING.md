# Testing Guide

## Quick Start

```powershell
cd backend

# All tests
.\scripts\test.ps1

# Specific suite
.\scripts\test.ps1 Integration

# Specific test class
.\scripts\test.ps1 SecurityController

# Realtime pulse integration test (E2E flow: login -> data mutation -> pulse events)
.\scripts\test.ps1 RealtimeController

# With code coverage report
.\scripts\test.ps1 -Coverage
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
docker exec -u www-data maintly-backend php bin/phpunit tests/Integration/Controller/RealtimeControllerTest.php
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
