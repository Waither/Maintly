# Quick cache clear for Maintly backend
# Usage: .\cc.ps1

Write-Host "🗑️  Clearing Symfony cache..." -ForegroundColor Yellow

# Hard delete cache in container
docker exec maintly-backend rm -rf var/cache/* var/log/* 2>$null

# Clear cache via Symfony
docker exec maintly-backend php bin/console cache:clear --no-warmup

Write-Host "✅ Cache cleared!" -ForegroundColor Green
