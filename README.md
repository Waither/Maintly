# Maintly CMMS

**Computerized Maintenance Management System** — system zarządzania utrzymaniem ruchu dla zakładów przemysłowych.

## Spis treści

- [Maintly CMMS](#maintly-cmms)
  - [Spis treści](#spis-treści)
  - [O projekcie](#o-projekcie)
  - [Funkcjonalności](#funkcjonalności)
  - [Stack technologiczny](#stack-technologiczny)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Realtime WebSocket](#realtime-websocket)
    - [Infrastruktura](#infrastruktura)
  - [Architektura usług](#architektura-usług)
  - [Szybki start](#szybki-start)
    - [Wymagania](#wymagania)
    - [Instalacja](#instalacja)
  - [Dostęp i konta](#dostęp-i-konta)
    - [Adresy URL](#adresy-url)
    - [Domyślne konta](#domyślne-konta)
  - [Struktura projektu](#struktura-projektu)
  - [Dokumentacja](#dokumentacja)
  - [Testowanie](#testowanie)
    - [Backend — PHPUnit](#backend--phpunit)
    - [Frontend — Playwright E2E](#frontend--playwright-e2e)
    - [Jakość kodu — Backend](#jakość-kodu--backend)
  - [Wdrożenie (GCP)](#wdrożenie-gcp)
  - [Komendy Docker](#komendy-docker)
  - [Licencja](#licencja)

---

## O projekcie

Maintly CMMS to w pełni funkcjonalny system do zarządzania utrzymaniem ruchu oparty na architekturze mikroserwisowej z:

- **Ewidencją urządzeń** — hierarchia parent-child, tagi, niestandardowe pola (EAV), kody QR
- **Zleceniami pracy** — priorytety, typy, przypisania, aktywności, historia statusów
- **Prewencyjnym utrzymaniem ruchu** — plany PM z harmonogramem cyklicznym
- **Raportami** — generowanie PDF/Excel asynchronicznie przez Symfony Messenger
- **KPI i dashboardem** — wykresy statystyczne, metryki operacyjne
- **Powiadomieniami real-time** — WebSocket + fallback HTTP polling
- **Logami audytu** — automatyczne logowanie wszystkich operacji CUD
- **Internacjonalizacją** — obsługa języków PL / EN / DE z tłumaczeniami w bazie danych

---

## Funkcjonalności

| Moduł | Opis |
|-------|------|
| Uwierzytelnianie | JWT z refresh tokenami, rate limiting logowania |
| Użytkownicy | CRUD, 5 ról (admin, manager, technician, provider, reporter), profile |
| Urządzenia | Hierarchia parent-child, tagi, grupy tagów, pola EAV, pliki, kody QR |
| Zlecenia pracy | Statusy, priorytety, przypisania, aktywności, pliki, tagi |
| Plan PM | Prewencyjne plany konserwacji z harmonogramem |
| Raporty | Generowanie PDF (DomPDF) i Excel (PhpSpreadsheet), filtry dat |
| KPI | Wskaźniki wydajności: MTBF, MTTR, availability, backlog |
| Powiadomienia | Real-time WebSocket + polling fallback, oznaczanie jako przeczytane |
| Web Push | Powiadomienia push (minishlink/web-push) |
| Audit Log | Automatyczny log wszystkich zmian (Doctrine Subscriber) |
| i18n | PL / EN / DE, tłumaczenia przechowywane w bazie danych |
| QR Codes | Generowanie i skanowanie kodów QR do urządzeń/zleceń |

---

## Stack technologiczny

### Backend

| Technologia | Wersja | Rola |
|-------------|--------|------|
| PHP | ≥ 8.4 | Środowisko uruchomieniowe |
| Symfony | 7.3 | Framework aplikacji |
| Doctrine ORM | ^3.0 | Mapowanie obiektowo-relacyjne |
| MySQL | 8.4 | Baza danych |
| LexikJWTBundle | ^2.20 | Uwierzytelnianie JWT |
| Symfony Messenger | — | Kolejkowanie asynchroniczne (transport: Doctrine) |
| NelmioApiDocBundle | ^4.19 | OpenAPI 3.0 / Swagger UI |
| NelmioCorsBundle | ^2.4 | Obsługa CORS |
| DomPDF | * | Generowanie PDF |
| PhpSpreadsheet | * | Generowanie Excel |
| minishlink/web-push | ^9.0 | Web Push notifications |
| PHPStan | ^2.1 | Analiza statyczna (poziom 8) |
| PHP CS Fixer | ^3.89 | Formatowanie kodu |
| PHPUnit | ^12.4 | Testy jednostkowe i integracyjne |

### Frontend

| Technologia | Wersja | Rola |
|-------------|--------|------|
| React | ^18.3 | Framework UI |
| TypeScript | ^5.6 | Typowanie statyczne |
| Vite | ^5.4 | Bundler / dev server |
| React Router | ^7.9 | Routing SPA |
| MDB React UI Kit | lokalnie | Biblioteka komponentów (Material Design Bootstrap) |
| Recharts | ^3.8 | Wykresy i KPI |
| i18next | ^25.6 | Internacjonalizacja |
| Axios | ^1.13 | Klient HTTP |
| html5-qrcode / react-qr-code | ^2.x | Obsługa QR |
| Font Awesome | ^6.7 | Ikony |
| Playwright | ^1.53 | Testy E2E |

### Realtime WebSocket

| Technologia | Wersja | Rola |
|-------------|--------|------|
| Node.js | — | Środowisko uruchomieniowe |
| ws | ^8.18 | Serwer WebSocket (RFC 6455) |

### Infrastruktura

| Komponent | Technologia |
|-----------|-------------|
| Reverse proxy / SSL | Nginx Alpine (TLS 1.2+1.3, HSTS) |
| PHP-FPM | php:8.4-fpm-alpine, pool: 20 workerów |
| Konteneryzacja | Docker + Docker Compose |
| Email (dev) | Mailhog |
| OPcache | JIT enabled, 256 MB |
| Code coverage | PCOV |

---

## Architektura usług

```
┌──────────────────────────────────────────────────────────┐
│                       Nginx (80/443)                     │
│         /api → PHP-FPM  │  /ws → realtime-ws  │  / → React │
└───────────────────┬──────────────┬──────────────┬─────────┘
                    │              │              │
             ┌──────▼──────┐ ┌────▼──────┐ ┌────▼──────┐
             │   Backend   │ │realtime-ws│ │ Frontend  │
             │ Symfony 7.3 │ │  Node.js  │ │  React 18 │
             │  PHP 8.4    │ │  :8001    │ │   :3000   │
             └──────┬──────┘ └───────────┘ └───────────┘
                    │
          ┌─────────┼─────────┐
          │         │         │
    ┌─────▼───┐ ┌───▼────┐ ┌──▼──────┐
    │  MySQL  │ │Mailhog │ │Messenger│
    │  8.4    │ │ :8025  │ │ Worker  │
    │  :3306  │ └────────┘ └─────────┘
    └─────────┘
```

**Wzorzec CQRS:** Cała logika biznesowa backendu zorganizowana jest w `Application/Command/` (zapisy) i `Application/Query/` (odczyty), obsługiwane przez dedykowane handlery.

**Asynchroniczne zadania** (Symfony Messenger, transport Doctrine):
- Generowanie raportów PDF/Excel
- Wysyłka powiadomień e-mail

**Real-time:** Backend publikuje zdarzenia do serwera `realtime-ws` przez HTTP `POST /broadcast` (token-authenticated). Klienci frontendowi łączą się przez WebSocket (`wss://localhost/ws`) z automatycznym fallbackiem na polling `GET /api/realtime/pulse` co 10 s.

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

# Uruchomienie wszystkich kontenerów
docker-compose up -d

# Instalacja zależności PHP (jeśli vendor/ nie jest zamontowany z cache)
docker exec maintly-backend composer install

# Generowanie kluczy JWT
docker exec maintly-backend php bin/console lexik:jwt:generate-keypair --skip-if-exists

# Migracje bazy danych (19 migracji, w tym seed tłumaczeń)
docker exec maintly-backend php bin/console doctrine:migrations:migrate --no-interaction

# Dane testowe – tylko środowisko dev
docker exec maintly-backend php bin/console doctrine:fixtures:load --no-interaction --env=dev
```

> **Uwaga:** `doctrine:fixtures:load` wymaga środowiska `dev`. W środowisku produkcyjnym tłumaczenia są wbudowane w migracje danych.

---

## Dostęp i konta

### Adresy URL

| Serwis | URL |
|--------|-----|
| Frontend (przez Nginx) | https://localhost |
| Frontend (dev server bezpośrednio) | http://localhost:3000 |
| API REST | https://localhost/api |
| Swagger UI | https://localhost/api/doc |
| Mailhog (UI emaili) | http://localhost:8025 |
| MySQL | localhost:3306 |
| WebSocket | wss://localhost/ws |

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
├── backend/                        # Symfony 7.3 API (PHP 8.4)
│   ├── src/
│   │   ├── Application/
│   │   │   ├── Command/            # CQRS – handlery zapisu (Equipment, WorkOrder,
│   │   │   │                       #   User, UserRole, Tag, TagGroup, EAV…)
│   │   │   └── Query/              # CQRS – handlery odczytu (Dashboard, KPI…)
│   │   ├── Controller/             # 18 kontrolerów REST API + ApiResponseTrait
│   │   ├── Entity/                 # 21 encji Doctrine (User, Equipment, WorkOrder,
│   │   │                           #   PM Plan, Report, Notification, AuditLog…)
│   │   ├── Repository/             # 15 repozytoriów Doctrine
│   │   ├── Service/                # AuditLogger, RealtimePublisher,
│   │   │                           #   WorkOrderStatusTransitionService,
│   │   │                           #   PreventiveMaintenanceSchedulerService,
│   │   │                           #   Report/ReportGenerator + Formatter/
│   │   ├── Message/                # EmailNotificationMessage, GenerateReportMessage
│   │   ├── MessageHandler/         # Handlery Messenger (email, raport)
│   │   ├── EventListener/          # ApiException, JWTCreated, LoginRateLimiter,
│   │   │                           #   LoginSuccess
│   │   ├── EventSubscriber/        # ApiRequestLogging, DoctrineAudit,
│   │   │                           #   RealtimeEvent
│   │   ├── Security/Voter/         # Votery autoryzacyjne
│   │   ├── Command/                # CLI: GenerateReport, TestAuditLog,
│   │   │                           #   TestNotifications, TestReport
│   │   └── DataFixtures/           # 8 fixtures (dev only)
│   ├── config/
│   │   └── packages/               # JWT, Messenger, Security, CORS, Swagger…
│   ├── migrations/                 # 19 migracji (2025-11 → 2026-05)
│   └── tests/
│       ├── Integration/            # Testy integracyjne (wymagają bazy)
│       └── Unit/                   # Testy jednostkowe (Application, Service,
│                                   #   Entity, Security, EventListener…)
│
├── frontend/                       # React 18 SPA (TypeScript + Vite)
│   ├── src/
│   │   ├── app/                    # App.tsx, App-components.tsx
│   │   ├── pages/                  # 11 modułów: Dashboard, Equipment, WorkOrders,
│   │   │                           #   Users, Reports, KPI, PreventiveMaintenance,
│   │   │                           #   AuditLogs, Profile, Auth, QrRedirect
│   │   ├── components/             # auth/, layouts/, ui/, debug/,
│   │   │                           #   LanguageSwitcher
│   │   ├── services/               # 12 serwisów API (axios)
│   │   ├── contexts/               # AuthContext
│   │   ├── types/                  # Interfejsy TypeScript (9 plików)
│   │   └── lib/                    # axios.ts, i18n.ts, offlineQueue.ts, mdb/
│   └── e2e/                        # Playwright smoke tests
│
├── realtime-ws/                    # Node.js WebSocket server
│   └── server.js                   # WS + POST /broadcast (token auth),
│                                   #   heartbeat co 30 s, limit payload 1 MB
│
├── docker/
│   ├── nginx/                      # Reverse proxy, SSL (TLS 1.2/1.3), gzip,
│   │                               #   FastCGI cache, security headers
│   └── php/                        # php:8.4-fpm-alpine, OPcache JIT,
│                                   #   pdo_mysql, pcov, 20 FPM workers
│
├── docs/
│   ├── api/README.md               # Dokumentacja REST API
│   ├── architecture/README.md      # Architektura, CQRS, wzorce
│   └── database/                   # Schemat BD: README, ERD.svg, schema.puml,
│                                   #   schema.dbml (20 tabel, 5 modułów)
│
├── gcp-deploy.sh                   # Skrypt wdrożeniowy (git pull + docker compose)
└── docker-compose.yml              # 7 usług: backend, nginx, mysql, mailhog,
                                    #   frontend, realtime-ws, messenger-worker
```

---

## Dokumentacja

| Dokument | Opis |
|----------|------|
| [docs/api/README.md](docs/api/README.md) | Endpointy REST, uwierzytelnianie JWT, przykłady |
| [docs/architecture/README.md](docs/architecture/README.md) | Architektura systemu, CQRS, wzorce projektowe |
| [docs/database/README.md](docs/database/README.md) | Schemat 20 tabel, moduły, wzorce (soft delete, EAV, audit trail) |
| [docs/database/ERD.svg](docs/database/ERD.svg) | Diagram ERD (SVG) |
| [docs/database/schema.dbml](docs/database/schema.dbml) | Schemat DBML (dbdiagram.io) |

Interaktywna dokumentacja API (Swagger UI): **https://localhost/api/doc**

---

## Testowanie

### Backend — PHPUnit

Testy wymagają dostępu do bazy MySQL (kontener `mysql` lub środowisko z PDO).

```bash
# Wszystkie testy (w kontenerze)
docker exec -u www-data maintly-backend php bin/phpunit

# Z raportem pokrycia HTML
docker exec -u www-data maintly-backend php bin/phpunit --coverage-html var/coverage

# Skrypt PowerShell (dev lokalny)
.\backend\scripts\test.ps1
```

Struktura testów:
- `tests/Unit/` — testy jednostkowe: handlery CQRS, serwisy, encje, votery, listenery
- `tests/Integration/` — testy integracyjne z bazą danych

### Frontend — Playwright E2E

```bash
cd frontend

# Uruchomienie testów (dev server startuje automatycznie)
npx playwright test

# Z raportem HTML
npx playwright test --reporter=html
```

Pokrycie smoke testów (`e2e/smoke.spec.ts`):
- Przekierowanie niezalogowanego użytkownika na `/login`
- Poprawne logowanie i załadowanie dashboardu
- Dostęp do profilu z navbara
- Blokada endpointu `/users` dla roli `reporter` (403)

### Jakość kodu — Backend

```bash
# PHPStan (poziom 8)
docker exec maintly-backend vendor/bin/phpstan analyse src -l 8
.\backend\scripts\stan.ps1

# PHP CS Fixer
docker exec maintly-backend vendor/bin/php-cs-fixer fix src
.\backend\scripts\fix.ps1
```

---

## Wdrożenie (GCP)

Skrypt `gcp-deploy.sh` automatyzuje wdrożenie na serwerze z Docker Compose:

```bash
# Domyślnie wdraża gałąź main
./gcp-deploy.sh

# Niestandardowa gałąź
BRANCH=develop ./gcp-deploy.sh

# Bez uruchamiania migracji
RUN_MIGRATIONS=false ./gcp-deploy.sh
```

Skrypt wykonuje kolejno:
1. `git fetch` + `git pull --ff-only` (bezpieczna aktualizacja)
2. `docker compose up -d --build --remove-orphans`
3. `doctrine:migrations:migrate --no-interaction`
4. `cache:clear` + `cache:warmup` (środowisko prod)
5. Wypisuje status kontenerów i hash wdrożonego commita

Obsługuje zarówno `docker compose` (v2) jak i `docker-compose` (v1).

---

## Komendy Docker

```bash
# Uruchomienie wszystkich usług
docker-compose up -d

# Zatrzymanie
docker-compose down

# Rebuild i restart
docker-compose up -d --build

# Logi poszczególnych usług
docker-compose logs -f backend
docker-compose logs -f realtime-ws
docker-compose logs -f messenger-worker

# Shell w kontenerze backendu
docker exec -it maintly-backend bash

# Uruchomienie konsoli Symfony
docker exec maintly-backend php bin/console <komenda>
```

---

## Licencja

MIT License
