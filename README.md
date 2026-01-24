# Maintly CMMS

**Computerized Maintenance Management System** - system zarządzania utrzymaniem ruchu dla zakładów przemysłowych.

## Spis treści

- [Maintly CMMS](#maintly-cmms)
  - [Spis treści](#spis-treści)
  - [O projekcie](#o-projekcie)
  - [Funkcjonalności](#funkcjonalności)
  - [Stack technologiczny](#stack-technologiczny)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [DevOps](#devops)
  - [Szybki start](#szybki-start)
    - [Wymagania](#wymagania)
    - [Instalacja](#instalacja)
    - [Dostęp](#dostęp)
    - [Domyślne konta](#domyślne-konta)
  - [Struktura projektu](#struktura-projektu)
  - [Dokumentacja](#dokumentacja)
  - [Testowanie](#testowanie)
    - [Backend (PHPUnit)](#backend-phpunit)
    - [Jakość kodu](#jakość-kodu)
  - [Komendy Docker](#komendy-docker)
  - [Licencja](#licencja)

---

## O projekcie

Maintly CMMS to system do zarządzania:

- **Ewidencją urządzeń** - hierarchiczna struktura, statusy, kategorie, lokalizacje
- **Zleceniami pracy** - priorytety, typy, przypisania, śledzenie postępu
- **Użytkownikami** - 5 poziomów ról (admin, manager, technician, provider, reporter)
- **Raportami** - generowanie PDF/Excel, statystyki
- **Powiadomieniami** - alerty o nowych zleceniach, zmianach statusu
- **Logami audytu** - pełna historia zmian w systemie

---

## Funkcjonalności

| Moduł | Opis |
|-------|------|
| Uwierzytelnianie | JWT z refresh tokenami, rate limiting |
| Użytkownicy | CRUD, role, profile |
| Urządzenia | Hierarchia parent-child, tagi, custom fields (EAV) |
| Zlecenia | Statusy, priorytety, typy, przypisania, aktywności |
| Raporty | PDF/Excel, filtry dat, asynchroniczne generowanie |
| Powiadomienia | Real-time, oznaczanie jako przeczytane |
| Audit Log | Automatyczne logowanie operacji |
| i18n | Polski, Angielski, Niemiecki |

---

## Stack technologiczny

### Backend

- Symfony 7.3 + PHP 8.4
- Doctrine ORM 3.x + MySQL 8.4
- CQRS Pattern (Command/Query Separation)
- JWT Authentication (LexikJWTBundle)
- Symfony Messenger (asynchroniczne zadania)
- OpenAPI 3.0 / Swagger (NelmioApiDocBundle)

### Frontend

- React 18 + TypeScript 5.x
- Vite 5.x
- MDB React UI Kit
- React Router 7.x
- i18next 25.x
- Axios

### DevOps

- Docker + Docker Compose
- Nginx (reverse proxy, SSL)
- Mailhog (testowanie emaili)

---

## Szybki start

### Wymagania

- Docker Desktop 4.x
- Git

### Instalacja

```bash
# Klonowanie
git clone https://github.com/Waither/Maintly.git
cd Maintly

# Uruchomienie kontenerów
docker-compose up -d

# Instalacja zależności
docker exec maintly-backend composer install

# Klucze JWT
docker exec maintly-backend php bin/console lexik:jwt:generate-keypair --skip-if-exists

# Migracje
docker exec maintly-backend php bin/console doctrine:migrations:migrate --no-interaction

# Dane testowe (opcjonalnie)
docker exec maintly-backend php bin/console doctrine:fixtures:load --no-interaction
```

### Dostęp

| Serwis | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| Swagger UI | http://localhost:8000/api/doc |
| Mailhog | http://localhost:8025 |
| MySQL | localhost:3306 |

### Domyślne konta

| Rola | Email | Hasło |
|------|-------|-------|
| Admin | admin@maintly.com | MaintlyAdmin!@# |
| Manager | manager@maintly.com | MaintlyManager!@# |
| Technician | tech@maintly.com | MaintlyTech!@# |
| Provider | provider@external.com | MaintlyProvider!@# |
| Reporter | reporter@maintly.com | MaintlyReporter!@# |

---

## Struktura projektu

```
maintly/
├── backend/                    # Symfony 7 API
│   ├── src/
│   │   ├── Application/        # CQRS (Command/Query)
│   │   ├── Controller/         # API Endpoints
│   │   ├── Entity/             # Doctrine Entities
│   │   ├── Repository/         # Database Queries
│   │   ├── Security/           # Voters, Authentication
│   │   └── Service/            # Business Logic
│   ├── config/
│   ├── migrations/
│   └── tests/
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── public/locales/
│
├── docker/
├── docs/
└── docker-compose.yml
```

---

## Dokumentacja

| Dokument | Opis |
|----------|------|
| [docs/api/README.md](docs/api/README.md) | Dokumentacja REST API |
| [docs/architecture/README.md](docs/architecture/README.md) | Architektura, wzorce, CQRS |
| [docs/database/README.md](docs/database/README.md) | Schemat bazy danych, ERD |

Swagger UI: http://localhost:8000/api/doc

---

## Testowanie

### Backend (PHPUnit)

```bash
# Wszystkie testy
docker exec -u www-data maintly-backend php bin/phpunit

# Z coverage
docker exec -u www-data maintly-backend php bin/phpunit --coverage-html var/coverage
```

### Jakość kodu

```bash
# PHPStan
docker exec maintly-backend vendor/bin/phpstan analyse src -l 8

# PHP CS Fixer
docker exec maintly-backend vendor/bin/php-cs-fixer fix src

# Skrypty
.\backend\scripts\stan.ps1
.\backend\scripts\fix.ps1
.\backend\scripts\test.ps1
```

---

## Komendy Docker

```bash
docker-compose up -d              # Start
docker-compose down               # Stop
docker-compose up -d --build      # Rebuild
docker-compose logs -f backend    # Logi
docker exec -it maintly-backend bash   # Shell
```

---

## Licencja

MIT License
