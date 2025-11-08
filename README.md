# 🐳 Maintly - CMMS System (Docker Setup)

> **Nowoczesny system zarządzania utrzymaniem ruchu** zbudowany w architekturze CQRS  
> Backend: Symfony 7 + MySQL | Frontend: React 18 + Vite + TypeScript

---

## 🚀 Jak uruchomić projekt?

### Wymagania
- **Docker Desktop** (Windows/Mac) lub **Docker + Docker Compose** (Linux)
- **Node.js 18+** (do instalacji zależności frontendu)
- **Git**

### Krok po kroku:

**1. Sklonuj repozytorium**
```powershell
git clone https://github.com/Waither/Maintly.git
cd Maintly
```

**2. Zainstaluj zależności frontendu** (OBOWIĄZKOWE!)
```powershell
cd frontend
npm install
cd ..
```

**3. Zainstaluj zależności backendu** (OBOWIĄZKOWE!)
```powershell
cd backend
composer install
cd ..
```

**4. Uruchom kontenery Docker**
```powershell
docker-compose up -d
```

**5. Zainicjalizuj bazę danych** (tylko przy pierwszym uruchomieniu)
```powershell
docker exec -it maintly-backend php bin/console doctrine:migrations:migrate --no-interaction
```

**6. Gotowe! Otwórz w przeglądarce:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api

---

## ✅ Sprawdzenie czy działa

```powershell
# Sprawdź status kontenerów
docker-compose ps

# Powinny być 3 kontenery w stanie "Up":
# - maintly-frontend
# - maintly-backend  
# - maintly-mysql

# Sprawdź logi frontendu
docker-compose logs frontend

# Sprawdź logi backendu
docker-compose logs backend
```


## Dostępne serwisy

| Serwis | Port | URL |
|--------|------|-----|
| **Frontend (HTTP)** | 3000 | http://localhost:3000 |
| **Frontend (HTTPS)** | 3000 | https://localhost:3000 (self-signed cert) |
| **Backend API** | 8000 | http://localhost:8000/api |
| **Backend HTTPS** | 8443 | https://localhost:8443/api |
| **MySQL** | 3306 | localhost:3306 (user: maintly, pass: secret) |
