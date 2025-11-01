# 🐳 Maintly - Docker Setup

## Szybki start

```bash
# 1. Build images
docker-compose build

# 2. Start containers
docker-compose up -d

# 3. Install Symfony
docker exec -it maintly-backend composer create-project symfony/skeleton temp
docker exec -it maintly-backend sh -c "cp -r temp/. . && rm -rf temp"

# 4. Install dependencies
docker exec -it maintly-backend composer require symfony/orm-pack symfony/maker-bundle --dev

# 5. Create database
docker exec -it maintly-backend php bin/console doctrine:database:create
```

## Dostępne serwisy

| Serwis | Port | URL |
|--------|------|-----|
| Backend API | 8000 | http://localhost:8000 |
| MySQL | 3306 | localhost:3306 (user: maintly, pass: secret) |

## Przydatne komendy

```bash
# Logi
docker-compose logs -f backend

# Shell w kontenerze
docker exec -it maintly-backend sh

# MySQL client
docker exec -it maintly-mysql mysql -u maintly -psecret maintly

# Stop
docker-compose down

# Reset (usuń volumes!)
docker-compose down -v
```
