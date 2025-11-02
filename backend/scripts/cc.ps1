# Quick cache clear for Maintly backend (dev + test environments)
# Usage: .\cc.ps1

Write-Host "Clearing Symfony cache (dev + test)..." -ForegroundColor Yellow

# Hard delete cache in container
docker exec maintly-backend rm -rf var/cache/* var/log/* 2>$null

# Clear dev cache
docker exec maintly-backend php bin/console cache:clear --no-warmup --env=dev

# Clear test cache
docker exec maintly-backend php bin/console cache:clear --no-warmup --env=test

Write-Host "Cache cleared (dev + test)!" -ForegroundColor Green
