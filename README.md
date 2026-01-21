# 🐳 Maintly - CMMS System

> **Nowoczesny system zarządzania utrzymaniem ruchu** zbudowany w architekturze CQRS  
> Backend: Symfony 7 + MySQL | Frontend: React 18 + Vite + TypeScript

---

## 📖 O projekcie

**Maintly** to system CMMS (Computerized Maintenance Management System) służący do zarządzania:
- 🔧 **Zleceniami pracy** (Work Orders) - tworzenie, przypisywanie, śledzenie statusu
- 🏭 **Urządzeniami** (Equipment) - katalog maszyn, hierarchia, tagi
- 👥 **Użytkownikami** - role (Admin, Manager, Technician, Provider)
- 📊 **Raportami** - generowanie PDF/Excel/CSV w tle (async)
- 📝 **Logami audytu** - automatyczne śledzenie zmian

### Kluczowe funkcje
- ✅ Architektura **CQRS** (Command Query Responsibility Segregation)
- ✅ **Asynchroniczne** generowanie raportów (Symfony Messenger)
- ✅ **JWT** authentication z refresh tokenami
- ✅ **Role i uprawnienia** (Voters)
- ✅ **Audit logging** - automatyczne logowanie zmian w encjach
- ✅ **i18n** - wielojęzyczność (PL/EN)
- ✅ **Swagger UI** - interaktywna dokumentacja API

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

---

## 🔐 Dane logowania

| Email | Hasło | Rola |
|-------|-------|------|
| admin@maintly.com | MaintlyAdmin!@# | Administrator |
| manager@maintly.com | MaintlyManager!@# | Manager |
| tech@maintly.com | MaintlyTech!@# | Technician |

---

## 🛠️ Technologie

### Backend
- **Symfony 7** - PHP framework
- **Doctrine ORM** - mapowanie obiektowo-relacyjne
- **MySQL 8** - baza danych
- **Symfony Messenger** - kolejki i async jobs
- **LexikJWTBundle** - JWT authentication

### Frontend
- **React 18** - biblioteka UI
- **TypeScript** - type safety
- **Vite** - bundler i dev server
- **MDB React** - Material Design Bootstrap
- **React Router 6** - routing
- **i18next** - internacjonalizacja

### DevOps
- **Docker** + **Docker Compose** - konteneryzacja
- **Nginx** - reverse proxy

---

## 📁 Struktura projektu

```
Maintly/
├── backend/                 # Symfony 7 API
│   ├── src/
│   │   ├── Application/     # CQRS Commands & Queries
│   │   ├── Controller/      # HTTP Controllers
│   │   ├── Entity/          # Doctrine Entities
│   │   ├── Message/         # Async Messages
│   │   ├── MessageHandler/  # Async Handlers
│   │   └── Security/        # Auth & Voters
│   └── config/
├── frontend/                # React + TypeScript
│   └── src/
│       ├── pages/           # Feature modules
│       ├── components/      # Reusable components
│       └── services/        # API services
├── docs/                    # Dokumentacja
│   ├── api/                 # API docs
│   ├── architecture/        # Architektura
│   └── database/            # ERD diagram
└── docker-compose.yml
```

---

## 📚 Dokumentacja

- **Swagger UI:** http://localhost:8000/api/doc
- **ERD Diagram:** `/docs/database/ERD.pdf`
- **API Reference:** `/docs/api/README.md`

---

## 👨‍💻 Autor

Projekt wykonany w ramach przedmiotu **ZTPAI** (Zaawansowane Techniki Programowania Aplikacji Internetowych)
