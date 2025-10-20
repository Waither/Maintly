# Maintly — Real-time CMMS z architekturą CQRS

[![Status](https://img.shields.io/badge/status-w_budowie-orange)](#)
[![Backend](https://img.shields.io/badge/backend-Symfony_7-000?logo=symfony)](#)
[![Frontend](https://img.shields.io/badge/frontend-React_18-61dafb?logo=react&logoColor=000)](#)
[![Architecture](https://img.shields.io/badge/architecture-CQRS-blue)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#)

> **Maintly** to nowoczesny system zarządzania utrzymaniem ruchu (CMMS) z synchronizacją w czasie rzeczywistym, zbudowany w oparciu o architekturę CQRS i wzorce Event-Driven Design.

---

## 📋 Spis treści

- [Wizja projektu](#-wizja-projektu)
- [Architektura systemu](#-architektura-systemu)
- [Struktura projektu](#-struktura-projektu)
- [Stack technologiczny](#-stack-technologiczny)
- [Plan rozwoju](#-plan-rozwoju-krok-po-kroku)
- [Roadmapa funkcjonalności](#-roadmapa-funkcjonalności)
- [📱 Push Notifications - Mobile](./PUSH-NOTIFICATIONS.md) ← **MUST READ!** 🔥
- [🖥️ Desktop Notifications - Windows/macOS](./DESKTOP-NOTIFICATIONS.md) ← **NEW!** 💎
- [Rozpoczęcie pracy](#-rozpoczęcie-pracy)

---

## 🎯 Wizja projektu

Maintly to odpowiedź na problemy tradycyjnych systemów CMMS:
- ❌ Brak synchronizacji w czasie rzeczywistym
- ❌ Konieczność ręcznego odświeżania danych
- ❌ Słaba obsługa pracy offline
- ❌ Trudności w skalowaniu i rozbudowie

### Nasze rozwiązanie:

✅ **Real-time sync** – WebSocket zapewnia natychmiastową synchronizację  
✅ **CQRS Architecture** – separacja odczytu i zapisu dla maksymalnej wydajności  
✅ **Event-Driven Design** – zdarzenia domenowe jako podstawa komunikacji  
✅ **Offline-First PWA** – pełna funkcjonalność bez połączenia z internetem  
✅ **Modułowa struktura** – łatwa rozbudowa o nowe funkcjonalności  

---

## 🏗 Architektura systemu

### Koncepcja CQRS (Command Query Responsibility Segregation)

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  React App → Commands & Queries → WebSocket + HTTP API      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       API GATEWAY (Symfony)                  │
├──────────────────────────┬──────────────────────────────────┤
│   COMMAND SIDE (WRITE)   │    QUERY SIDE (READ)            │
│                          │                                  │
│  • Command Handlers      │  • Query Handlers               │
│  • Domain Events         │  • Read Models                  │
│  • Event Store           │  • Projections                  │
│  • Write DB (MySQL)      │  • Read DB (optimized views)    │
└──────────────────────────┴──────────────────────────────────┘
                              ↓
                    Event Bus (Symfony Messenger)
                              ↓
                    WebSocket Server (Ratchet)
```

### Kluczowe założenia:

1. **Commands** (zapisy) – modyfikują stan domeny, generują eventy
2. **Queries** (odczyty) – czytają z zoptymalizowanych modeli odczytu
3. **Events** – synchronizują stan między modelami i klientami
4. **WebSocket** – propaguje eventy do wszystkich połączonych klientów

---

## 📁 Struktura projektu

### Główny układ katalogów

```
Maintly/
│
├── backend/                      # Aplikacja Symfony (API + WebSocket)
│   ├── config/                   # Konfiguracja aplikacji
│   │   ├── packages/             # Konfiguracja bundli
│   │   ├── routes/               # Routing HTTP i WebSocket
│   │   └── services.yaml         # Definicje serwisów
│   │
│   ├── src/
│   │   ├── Application/          # Warstwa aplikacji (CQRS)
│   │   │   ├── Command/          # Command handlers (WRITE)
│   │   │   │   ├── WorkOrder/    # Komendy zleceń
│   │   │   │   ├── Equipment/    # Komendy maszyn
│   │   │   │   ├── Inventory/    # Komendy części
│   │   │   │   └── User/         # Komendy użytkowników
│   │   │   │
│   │   │   ├── Query/            # Query handlers (READ)
│   │   │   │   ├── WorkOrder/    # Zapytania o zlecenia
│   │   │   │   ├── Equipment/    # Zapytania o maszyny
│   │   │   │   ├── Inventory/    # Zapytania o części
│   │   │   │   └── Dashboard/    # Zapytania dashboardowe
│   │   │   │
│   │   │   └── EventHandler/     # Handlery eventów domenowych
│   │   │       ├── Projection/   # Aktualizacja read models
│   │   │       └── Notification/ # Powiadomienia
│   │   │
│   │   ├── Domain/               # Warstwa domenowa (logika biznesowa)
│   │   │   ├── Model/            # Agregaty i encje
│   │   │   │   ├── WorkOrder/    # Agregat zlecenia
│   │   │   │   ├── Equipment/    # Agregat maszyny
│   │   │   │   ├── Inventory/    # Agregat części
│   │   │   │   └── User/         # Agregat użytkownika
│   │   │   │
│   │   │   ├── Event/            # Zdarzenia domenowe
│   │   │   │   ├── WorkOrderCreated.php
│   │   │   │   ├── WorkOrderAssigned.php
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── Repository/       # Interfejsy repozytoriów
│   │   │   └── Service/          # Serwisy domenowe
│   │   │
│   │   ├── Infrastructure/       # Warstwa infrastruktury
│   │   │   ├── Persistence/      # Implementacje repozytoriów
│   │   │   │   ├── Doctrine/     # Write model (Doctrine ORM)
│   │   │   │   └── ReadModel/    # Read model (DTO + query optymalizacje)
│   │   │   │
│   │   │   ├── WebSocket/        # Server WebSocket
│   │   │   │   ├── Server.php    # Główny serwer Ratchet
│   │   │   │   ├── Connection/   # Zarządzanie połączeniami
│   │   │   │   └── Handler/      # Handlery wiadomości WS
│   │   │   │
│   │   │   ├── EventBus/         # Messenger + middleware
│   │   │   └── Security/         # JWT, autoryzacja
│   │   │
│   │   ├── UI/                   # Warstwa prezentacji
│   │   │   ├── Controller/       # Kontrolery HTTP (API REST)
│   │   │   │   ├── Api/          # Endpointy API
│   │   │   │   └── Auth/         # Logowanie, rejestracja
│   │   │   │
│   │   │   └── Validator/        # Walidacja requestów
│   │   │
│   │   └── Shared/               # Współdzielone komponenty
│   │       ├── ValueObject/      # Value objects (Email, Status, etc.)
│   │       └── Exception/        # Custom exceptions
│   │
│   ├── migrations/               # Migracje bazy danych (Doctrine)
│   ├── tests/                    # Testy (Unit, Integration, E2E)
│   │   ├── Unit/                 # Testy jednostkowe (domena)
│   │   ├── Integration/          # Testy integracyjne
│   │   └── E2E/                  # Testy end-to-end
│   │
│   ├── var/                      # Cache, logi (gitignore)
│   ├── vendor/                   # Zależności Composer (gitignore)
│   ├── .env                      # Zmienne środowiskowe (local, gitignore)
│   ├── .env.example              # Przykładowa konfiguracja
│   ├── composer.json             # Zależności PHP
│   └── symfony.lock              # Lockfile Symfony Flex
│
├── frontend/                     # Aplikacja React (PWA)
│   ├── public/                   # Zasoby statyczne
│   │   ├── manifest.json         # PWA manifest
│   │   ├── service-worker.js     # Service Worker (offline)
│   │   └── icons/                # Ikony aplikacji PWA
│   │
│   ├── src/
│   │   ├── app/                  # Konfiguracja aplikacji
│   │   │   ├── App.tsx           # Główny komponent
│   │   │   ├── router.tsx        # React Router setup
│   │   │   └── theme.ts          # Konfiguracja UI (Material/Tailwind)
│   │   │
│   │   ├── features/             # Moduły funkcjonalne (feature-based)
│   │   │   ├── work-orders/      # Moduł zleceń
│   │   │   │   ├── components/   # Komponenty UI
│   │   │   │   ├── hooks/        # Custom hooks
│   │   │   │   ├── api/          # API calls (commands & queries)
│   │   │   │   ├── store/        # Local state (Zustand/Context)
│   │   │   │   └── types/        # TypeScript types
│   │   │   │
│   │   │   ├── equipment/        # Moduł maszyn
│   │   │   ├── inventory/        # Moduł części
│   │   │   ├── dashboard/        # Moduł dashboardu
│   │   │   └── auth/             # Moduł autoryzacji
│   │   │
│   │   ├── shared/               # Współdzielone komponenty
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── hooks/            # Reusable hooks
│   │   │   ├── utils/            # Funkcje pomocnicze
│   │   │   └── types/            # Shared TypeScript types
│   │   │
│   │   ├── services/             # Serwisy aplikacyjne
│   │   │   ├── api/              # Axios client, interceptory
│   │   │   ├── websocket/        # WebSocket client
│   │   │   ├── offline/          # IndexedDB, sync queue
│   │   │   └── auth/             # JWT handling
│   │   │
│   │   ├── store/                # Global state management
│   │   │   ├── slices/           # Zustand slices lub Redux slices
│   │   │   └── index.ts          # Store configuration
│   │   │
│   │   └── main.tsx              # Entry point
│   │
│   ├── node_modules/             # Zależności npm (gitignore)
│   ├── .env                      # Zmienne środowiskowe (gitignore)
│   ├── .env.example              # Przykładowa konfiguracja
│   ├── package.json              # Zależności npm
│   ├── tsconfig.json             # Konfiguracja TypeScript
│   └── vite.config.ts            # Konfiguracja Vite
│
├── docker/                       # Konfiguracja Docker
│   ├── nginx/                    # Nginx (reverse proxy)
│   ├── php/                      # PHP-FPM (Symfony)
│   ├── mysql/                    # MySQL
│   ├── websocket/                # WebSocket server
│   └── docker-compose.yml        # Orchestracja kontenerów
│
├── docs/                         # Dokumentacja projektu
│   ├── architecture/             # Diagramy architektury
│   ├── api/                      # Dokumentacja API (OpenAPI)
│   ├── deployment/               # Instrukcje wdrożenia
│   └── development/              # Przewodniki deweloperskie
│
├── .github/                      # GitHub Actions (CI/CD)
│   └── workflows/
│       ├── backend-tests.yml     # Testy backendu (PHPUnit + Behat)
│       └── deploy.yml            # Deployment pipeline
│
├── .gitignore                    # Ignorowane pliki
├── LICENSE                       # Licencja MIT
└── README.md                     # Ten plik
```

---

## 🛠 Stack technologiczny

### Backend (Symfony 7)

| Technologia | Przeznaczenie | Uwagi |
|-------------|---------------|-------|
| **Symfony 7** | Framework PHP | Bazowy framework aplikacji |
| **Doctrine ORM** | Persistence (Write Model) | Agregaty, encje domenowe |
| **Doctrine DBAL** | Persistence (Read Model) | Zoptymalizowane zapytania SQL |
| **Symfony Messenger** | Event Bus | Asynchroniczne przetwarzanie eventów |
| **Ratchet** | WebSocket Server | Real-time communication |
| **JWT (LexikJWTAuthenticationBundle)** | Autoryzacja | Tokeny JWT dla API i WS |
| **PHPUnit** | Testy jednostkowe | Testing framework |
| **Behat** | Testy BDD | Testy akceptacyjne |

### Frontend (React 18)

| Technologia | Przeznaczenie | Uwagi |
|-------------|---------------|-------|
| **React 18** | UI Framework | Concurrent features, Suspense |
| **TypeScript** | Type safety | Typowanie statyczne - łapie błędy przed uruchomieniem |
| **Vite** | Build tool | Szybki bundler i dev server |
| **TanStack Query** | Data fetching | Cache, sync, optimistic updates |
| **Zustand** | State management | Lekki state manager |
| **React Router v6** | Routing | Nawigacja SPA |
| **Material-UI / Tailwind** | UI Components | Do wyboru przy implementacji |
| **Workbox** | Service Worker | PWA, offline support |
| **IndexedDB (Dexie.js)** | Local storage | Offline data persistence |
| **Socket.io-client** | WebSocket client | Real-time communication |

> **🎯 Frontend testing:** TypeScript + ręczne testowanie w przeglądarce wystarczy dla projektu!

### Infrastructure

- **Docker & Docker Compose** – konteneryzacja
- **Nginx** – reverse proxy, static files
- **MySQL 8** – główna baza danych
- **Redis** (opcjonalnie) – cache, session storage

---

## 📝 Plan rozwoju (krok po kroku)

> **Status:** 📅 Start: 18 października 2025  
> **Deadline 1:** 🎓 Grudzień 2025 - Wersja na przedmiot (MINIMUM)  
> **Deadline 2:** 🎓 Maj 2026 - Wersja na inżynierkę (PEŁNA)  
> 
> **Realia:** Praca 8h/dzień + studia zaoczne + życie = **~10-15h/tydzień na projekt**  
> **Strategia:** Minimal Viable Product najpierw, rozbudowa później

---

## 🎯 WERSJA NA PRZEDMIOT (Grudzień 2025) - ABSOLUTE MINIMUM

To **naprawdę** minimalna wersja, żeby zaliczyć przedmiot:

### Zakres funkcjonalny:
- ✅ Logowanie (bez rejestracji - możesz mieć hardcoded usera w bazie)
- ✅ Lista zleceń (TYLKO odczyt z bazy)
- ✅ Dodawanie zlecenia (prosty formularz)
- ✅ Zmiana statusu zlecenia (3 statusy: New, In Progress, Done)
- ✅ **PWA (Progressive Web App)** - działa jak aplikacja mobilna, można zainstalować na ekranie głównym
- ✅ Działa lokalnie (nie musisz deployować!)

**To wystarczy na zaliczenie przedmiotu!**

> **💡 PWA w wersji na przedmiot:** Podstawowa konfiguracja (manifest.json + ikony), bez zaawansowanego offline mode. Pełny offline support zostaw na inżynierkę.

---

## 🏆 WERSJA NA INŻYNIERKĘ (Maj 2026) - PEŁNA

To już będzie "prawdziwy" system:
- ✅ Wszystko z wersji na przedmiot
- ✅ Rejestracja użytkowników
- ✅ WebSocket (real-time)
- ✅ Dashboard z metrykami
- ✅ **PWA z pełnym offline mode** (Service Worker + IndexedDB)
- ✅ **Push Notifications** (powiadomienia systemowe o nowych awariach)
- ✅ Deploy na serwer (IIS)
- ✅ Dokumentacja techniczna
- ✅ **Testy automatyczne backendu** (PHPUnit + Behat na SQLite in-memory)

---

## 📅 Realistyczny Timeline (Praca + Studia + Życie)

### 🔥 FAZA 1: WERSJA NA PRZEDMIOT (Październik - Grudzień 2025)

#### **Tydzień 1-2: Setup Środowiska (18.10 - 31.10)** ⏱️ ~16-18h total

**Weekend 1 (19-20.10): Symfony + Docker** (~6h)
- Instalacja Symfony 7
- Docker Compose (PHP, MySQL, Nginx)
- Hello world endpoint

**Weekend 2 (26-27.10): MySQL + Doctrine ORM** (~6h) 🔴 **WAŻNE!**
```bash
# Instalacja Doctrine
composer require symfony/orm-pack
composer require --dev symfony/maker-bundle

# Konfiguracja połączenia
DATABASE_URL="mysql://root:password@127.0.0.1:3306/maintly?serverVersion=8.0"

# Tworzenie bazy
php bin/console doctrine:database:create

# Tworzenie pierwszej Entity (User)
php bin/console make:entity User
# Pola: id (UUID), email (string), password (string), roles (json)

# Pierwsza migracja
php bin/console make:migration
php bin/console doctrine:migrations:migrate

# Test
php bin/console dbal:run-sql "SELECT 1"
```

**Wieczory (23-25.10): React + MDBootstrap** (~4h)
- Vite + React + TypeScript
- MDBootstrap setup
- Podstawowy routing

**Deliverable:** 
- ✅ Symfony + Docker działają
- ✅ MySQL + Doctrine skonfigurowane
- ✅ User Entity + migracja
- ✅ React podstawowy setup

---

#### **Tydzień 3-4: Logowanie JWT (1.11 - 14.11)** ⏱️ ~10-12h total

**Weekend 1 (2-3.11): Backend JWT Auth** (~5h)
```bash
# JWT Bundle
composer require lexik/jwt-authentication-bundle

# Generuj klucze
php bin/console lexik:jwt:generate-keypair

# Endpoint login
POST /api/login → zwraca JWT token
```
- SecurityController (login endpoint)
- JWT configuration
- Hardcoded user w bazie (SQL INSERT)

**Wieczory (4-7.11): Frontend Login Page** (~3h)
- Strona logowania (MDBInput, MDBBtn)
- Auth store (Zustand)
- Axios interceptor (auto JWT)

**Weekend 2 (9-10.11): Dopinanie + Protected Routes** (~4h)
- PrivateRoute component
- Token w localStorage
- Redirect po loginie
- Test flow: login → dashboard

**Deliverable:** Można się zalogować (1 user hardcoded w bazie)

**💡 TRICK:** Możesz pominąć rejestrację! Wrzuć usera SQL-em:
```sql
INSERT INTO user (email, password) VALUES ('admin@test.pl', '$2y$13$hashedpassword');
```

---

#### **Tydzień 5-9: CRUD Zleceń (15.11 - 15.12)** ⏱️ ~28-32h total
**NAJWAŻNIEJSZA CZĘŚĆ!**

**Weekend 1 (16-17.11): WorkOrder Entity + Migracja** (~6h) 🔴 **WAŻNE!**
```bash
# Tworzenie Entity
php bin/console make:entity WorkOrder
# Pola: id (UUID), title (string), description (text), 
#       status (string), priority (string), 
#       assignedTo (ManyToOne User), 
#       createdAt (datetime_immutable)

# Migracja
php bin/console make:migration
php bin/console doctrine:migrations:migrate

# Repository
- DoctrineWorkOrderRepository
- Metody: save(), findById(), findAll(), findByStatus()
```

**Weekend 2 (23-24.11): Backend CRUD Endpoints** (~6h)
- POST `/api/work-orders` (create)
- GET `/api/work-orders` (list)
- GET `/api/work-orders/{id}` (show)
- PATCH `/api/work-orders/{id}/status` (update status)
- DELETE `/api/work-orders/{id}` (delete)

**Wieczory (25-29.11): Frontend - Lista** (~5h)
- WorkOrderList component
- MDBTable lub Cards
- TanStack Query setup
- Loading/Error states

**Weekend 3 (30.11-1.12): Frontend - Formularz Create** (~5h)
- WorkOrderForm component (modal)
- MDBInput, MDBSelect
- Walidacja
- Mutacja TanStack Query

**Wieczory (2-6.12): Frontend - Actions** (~4h)
- Zmiana statusu (dropdown)
- Edycja (modal)
- Usuwanie (confirm dialog)

**Weekend 4 (7-8.12): Filtry + UI Polish** (~4h)
- Filtr po statusie
- Filtr po priorytecie
- Ładne karty zamiast tabeli
- Animacje (fade-in nowych)

**Weekend 5 (14-15.12): PWA Setup** (~3h)
- `manifest.json` + ikony
- Vite PWA plugin
- Test instalacji na telefonie

**Deliverable:** Działający CRUD zleceń + instalowalna PWA

---

#### **Tydzień 9: Prezentacja (11.12 - 20.12)** ⏱️ ~5h
- Screeny do dokumentacji
- Prezentacja PowerPoint
- Nagranie wideo (opcjonalnie)

**🎓 ODDAJESZ PRZEDMIOT! ✅**

---

### 🚀 FAZA 2: ROZBUDOWA NA INŻYNIERKĘ (Styczeń - Maj 2026)

**Masz 5 miesięcy na spokojnie!**

#### **Styczeń 2026: Rejestracja + Role** ⏱️ ~15h
- Endpoint /api/register
- Strona rejestracji
- Role (admin/user)

#### **Luty 2026: WebSocket Real-time + PWA Offline** ⏱️ ~25h
- Ratchet WebSocket server
- Synchronizacja zleceń w czasie rzeczywistym
- **Service Worker (Workbox)** - cache strategii
- **IndexedDB (Dexie.js)** - lokalne przechowywanie danych
- **Offline sync queue** - zapisywanie akcji offline i sync po powrocie sieci

#### **Marzec 2026: Push Notifications + Dashboard** ⏱️ ~20h
- **Push Notifications (Web Push API)** - powiadomienia systemowe (~8h)
  - Backend: Symfony + `minishlink/web-push` + VAPID keys
  - Frontend: Service Worker + Notification API
  - Typy: Nowa awaria (PILNE), Przypisano zlecenie, Przypomnienia
  - Akcje w powiadomieniu: "Przyjmij" / "Zobacz szczegóły"
  - Badge na ikonie (licznik nieprzeczytanych)
- **Dashboard z metrykami** (~12h)
  - Statystyki zleceń (otwarte/zamknięte/w trakcie)
  - Wykresy Chart.js
  - Filtry czasowe (dziś/tydzień/miesiąc)

#### **Kwiecień 2026: Deploy + Dokumentacja + Testy Backend** ⏱️ ~20h
- Deploy na Windows Server + IIS
- SSL/HTTPS
- **Testy automatyczne (TYLKO BACKEND):**
  - PHPUnit - unit tests (klasy, metody)
  - **SQLite in-memory database** - testy repozytoriów (izolacja od MySQL)
  - Behat - testy E2E API (scenariusze biznesowe)
  - Doctrine fixtures - dane testowe
- Dokumentacja techniczna (architektura, API)
- Instrukcja instalacji

#### **Maj 2026: Szlif + Obrona** ⏱️ ~10h
- Poprawki z testów
- Code review i refactoring
- Prezentacja na obronę
- Druk pracy

**🎓 ODDAJESZ INŻYNIERKĘ! ✅**

---

## ⏰ Podsumowanie godzin

### Wersja na przedmiot (Grudzień):
```
Setup:           12h
Logowanie:       10h
CRUD Zleceń:     25h
Prezentacja:      5h
─────────────────────
TOTAL:           52h  (rozłożone na 8 tygodni = ~6-7h/tydzień)
```

### Rozbudowa na inżynierkę (Styczeń-Maj):
```
Rejestracja:     15h
WebSocket:       25h (+ PWA offline mode)
Dashboard:       15h
Deploy:          15h
Testy backend:    5h (PHPUnit + Behat)
Dokumentacja:    10h
─────────────────────
TOTAL:           85h  (rozłożone na 20 tygodni = ~4h/tydzień)
```

---

## 🎯 Co MUSISZ mieć w grudniu (przedmiot)

| Funkcja | Czy musi być? | Poziom |
|---------|---------------|--------|
| Logowanie (1 user) | 🔴 TAK | Hardcoded w bazie |
| Lista zleceń | 🔴 TAK | Prosta tabela |
| Dodaj zlecenie | 🔴 TAK | Formularz |
| Zmień status | 🔴 TAK | 3 statusy (New/In Progress/Done) |
| **PWA manifest + ikony** | 🔴 TAK | Instalowalna aplikacja |
| Edycja zlecenia | 🟡 OPCJA | Jeśli starczy czasu |
| Usuwanie | 🟡 OPCJA | Jeśli starczy czasu |
| Filtry | 🟡 OPCJA | Nice to have |
| Ładny UI | 🟢 BONUS | MDBootstrap robi to za Ciebie |
| Deploy na serwer | ❌ NIE | Wystarczy localhost! |
| Rejestracja | ❌ NIE | Zostaw na inżynierkę |
| WebSocket | ❌ NIE | Zostaw na inżynierkę |
| Dashboard | ❌ NIE | Zostaw na inżynierkę |
| **PWA offline mode** | ❌ NIE | Zostaw na inżynierkę |
| **Testy automatyczne** | ❌ NIE | Zostaw na inżynierkę |

---

## 💡 Pro Tips dla Ciebie

### **1. Skup się na JEDNEJ rzeczy na raz**
```
Tydzień 1-2: TYLKO setup
Tydzień 3-4: TYLKO logowanie
Tydzień 5-8: TYLKO CRUD zleceń
```

### **2. Weekendy = główna praca**
- Sobota: 4-5h (rano/popołudnie)
- Niedziela: 3-4h (rano, potem odpocznij!)
- Wieczory w tygodniu: max 1-2h (opcjonalne)

### **3. Nie rób wszystkiego idealnie**
- ❌ Nie optymalizuj kodu
- ❌ Nie rób 100% test coverage
- ❌ Nie zastanawiaj się nad "czy to dobrze"
- ✅ Zrób żeby działało
- ✅ Uporządkujesz w styczniu-maju

### **4. Używaj gotowców**
- MDBootstrap = gotowe komponenty
- TanStack Query = gotowy cache
- Symfony Maker = generuje kod
- ChatGPT/Copilot = pomoc w kodzie

### **5. Jeśli coś nie działa po 2h - pomiń**
- Masz problem z Dockerem? → użyj lokalnie (XAMPP/PHP built-in)
- TanStack Query nie działa? → zwykły axios + useState
- MDBootstrap płatny? → użyj Material-UI lub Tailwind

---

## 🆘 Plan awaryjny (jeśli jest bardzo ciasno)

### **ULTRA MINIMUM (jeśli masz TYLKO 30h do grudnia):**

**Tylko backend (bez frontendu!):**
- Symfony + REST API
- Postman do testowania
- Prezentacja: pokazujesz requesty w Postmanie

**Lub tylko frontend (mock data):**
- React + MDBootstrap
- Hardcoded dane (bez backendu)
- Prezentacja: pokazujesz UI

**Na inżynierkę połączysz obie części.**

---

## 📊 Tracking - Prosty sposób

**W README dodaj:**
```markdown
## 🔥 Progress (aktualizuj co weekend)

### Październik
- [x] Weekend 19-20.10: Setup Symfony ✅
- [ ] Weekend 26-27.10: Setup React
- [ ] Wieczory: MDBootstrap

### Listopad
- [ ] Weekend 2-3.11: Logowanie backend
- [ ] Weekend 9-10.11: Logowanie frontend
...
```

**Commituj co sesję:**
```bash
git commit -m "feat: login page (2h session)"
```

**Co weekend rób screena postępu** → potem wrzucisz do dokumentacji

---

## 🎯 Co MUSISZ mieć na 25 grudnia (MVP na przedmiot)

**Backend:**
1. 🔲 WorkOrder Entity (id, title, description, status, assignedTo, createdAt)
2. 🔲 Migracja WorkOrder
3. 🔲 POST `/api/work-orders` (tworzenie)
4. 🔲 GET `/api/work-orders` (lista)
5. 🔲 GET `/api/work-orders/{id}` (szczegóły)
6. 🔲 PATCH `/api/work-orders/{id}` (edycja)
7. 🔲 DELETE `/api/work-orders/{id}` (usuwanie)
8. 🔲 PATCH `/api/work-orders/{id}/status` (zmiana statusu)

**Frontend:**
1. 🔲 Lista zleceń (MDBTable lub Cards)
2. 🔲 Formularz tworzenia zlecenia (modal)
3. 🔲 Widok szczegółów zlecenia
4. 🔲 Edycja zlecenia
5. 🔲 Zmiana statusu (dropdown: New/In Progress/Completed)
6. 🔲 Filtry (po statusie)
7. 🔲 TanStack Query (cache, refetch, optimistic updates)

**Deliverable:**
- ✅ Pełny CRUD zleceń
- ✅ Dane cachowane (TanStack Query)
- ✅ Ładny UI (MDBootstrap)

**Czas:** ~10-14 dni (najważniejsza faza!)

---

### � **MINIMUM VIABLE PRODUCT - KONIEC LISTOPADA**

**Do tego momentu masz działający system:**
- ✅ Logowanie/rejestracja
- ✅ Tworzenie zleceń
- ✅ Lista i szczegóły zleceń
- ✅ Zmiana statusów
- ✅ Podstawowe filtry

**To wystarczy na zaliczenie/obronę. Reszta to bonus.**

---

### ⚡ Faza 3: WebSocket Real-time (Tydzień 5-6: 15-28 listopada)

**Backend:**
1. 🔲 Instalacja Ratchet (WebSocket server)
2. 🔲 Autoryzacja WS (JWT w query param)
3. 🔲 Event: WorkOrderCreated → broadcast do WS
4. 🔲 Event: WorkOrderStatusChanged → broadcast do WS

**Frontend:**
1. 🔲 WebSocket client (Socket.io-client lub native WebSocket)
2. 🔲 Auto-reconnect logic
3. 🔲 Listener: WorkOrderCreated → dodaj do listy + animacja
4. 🔲 Listener: WorkOrderStatusChanged → update listy

**Deliverable:**
- ✅ Dodanie zlecenia na jednym urządzeniu → pojawia się na drugim
- ✅ Zmiana statusu → widoczna wszędzie natychmiast

**Czas:** ~7-10 dni (opcjonalne, jeśli starczy czasu)

---

### 📊 Faza 4: Dashboard (Grudzień: 1-10)

**Backend:**
1. 🔲 GET `/api/dashboard/stats` (liczba zleceń po statusach)

**Frontend:**
1. 🔲 Strona dashboard
2. 🔲 Karty z liczbami (Total, New, In Progress, Completed)
3. 🔲 Prosty wykres (Chart.js - pie chart statusów)

**Deliverable:**
- ✅ Strona główna z podsumowaniem

**Czas:** ~3-5 dni

---

### 🚀 Faza 5: Deployment (Grudzień: 10-20)

**Backend:**
1. 🔲 Dockerfile + docker-compose.yml dla produkcji
2. 🔲 Konfiguracja IIS (reverse proxy do backendu)
3. 🔲 SSL certificate (Let's Encrypt lub self-signed)
4. 🔲 Zmienne środowiskowe (.env.prod)

**Frontend:**
1. 🔲 Build produkcyjny (`npm run build`)
2. 🔲 Deploy na IIS (port 443 HTTPS)
3. 🔲 Konfiguracja proxy do backendu (port 8000)

**Deliverable:**
- ✅ Aplikacja działa na serwerze Windows + IIS
- ✅ HTTPS działa
- ✅ Frontend (443) → Backend (8000)

**Czas:** ~5-7 dni

---

### 🎁 Faza 6: Szlif przed oddaniem (Grudzień: 20-24)

1. 🔲 Poprawki UI/UX
2. 🔲 Testy manualne
3. 🔲 Dokumentacja (README, screenshots)
4. 🔲 Prezentacja/demo

**Czas:** ~3-4 dni

---

## 🎯 Co MUSISZ mieć na 25 grudnia (MVP)

| Funkcja | Priorytet | Status |
|---------|-----------|--------|
| Logowanie/Rejestracja | � MUST | 🔲 |
| CRUD Zleceń (lista, dodaj, edytuj, usuń) | � MUST | 🔲 |
| Zmiana statusu zlecenia | 🔴 MUST | 🔲 |
| Podstawowy dashboard (liczniki) | � SHOULD | 🔲 |
| WebSocket real-time | � NICE | 🔲 |
| Deploy na IIS | 🔴 MUST | 🔲 |

---

## 🚀 Features na przyszłość (po grudniu)

Jeśli starczy czasu lub po oddaniu projektu:

### Wersja 0.2 (Q1 2026)
- 🔲 Agregaty Equipment & Inventory
- 🔲 Komentarze i załączniki do zleceń
- 🔲 PWA + offline support

### Wersja 0.3 (Q2 2026)
- 🔲 Check-listy
- 🔲 Powiadomienia push
- 🔲 Zaawansowane filtry

### Wersja 1.0 (Q3-Q4 2026)
- 🔲 Pełna analityka (MTTR, MTBF)
- 🔲 Role i uprawnienia (RBAC)
- 🔲 API dla integracji
- 🔲 Mobile app (React Native)

---

## 🚀 Roadmapa funkcjonalności

### ✅ MVP (v0.1) – Do 25 grudnia 2025 (DEADLINE!)
- 🔲 Autoryzacja użytkowników (login/register)
- 🔲 CRUD zleceń (WorkOrder)
- 🔲 Podstawowy dashboard (liczniki)
- 🔲 Deploy na Windows Server + IIS (HTTPS)

### 🔄 v0.2 – Styczeń-Marzec 2026 (opcjonalnie)
- 🔲 Real-time synchronizacja (WebSocket)
- 🔲 Maszyny i części (Equipment, Inventory)
- 🔲 Komentarze i załączniki

### 🎯 v0.3 – Kwiecień-Czerwiec 2026
- 🔲 PWA + offline support
- 🔲 Check-listy i procedury
- 🔲 Powiadomienia push

### 🏆 v1.0 – Q3-Q4 2026
- 🔲 Pełna analityka (MTTR, MTBF, OEE)
- 🔲 Role i uprawnienia (RBAC)
- 🔲 Integracje (API dla systemów zewnętrznych)
- 🔲 Mobile apps (React Native)

---

## 🚦 Rozpoczęcie pracy

### Wymagania

- **PHP 8.2+**
- **Composer 2.5+**
- **Node.js 18+**
- **Docker & Docker Compose**
- **MySQL 8+**

### Setup (Development)

#### 1. Backend (Symfony)

```bash
# Instalacja Symfony
composer create-project symfony/skeleton:"7.0.*" backend
cd backend

# Zainstaluj potrzebne paczki
composer require webapp
composer require orm
composer require maker --dev
composer require lexik/jwt-authentication-bundle
composer require nelmio/cors-bundle

# Konfiguracja
cp .env .env.local
# Edytuj .env.local (DATABASE_URL, JWT secrets)

# Generuj klucze JWT
php bin/console lexik:jwt:generate-keypair

# Migracje
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate

# Uruchom serwer
symfony server:start
# Lub: php -S localhost:8000 -t public
```

#### 2. Frontend (React + Vite + MDBootstrap)

```bash
# Tworzenie projektu Vite
npm create vite@latest frontend -- --template react-ts
cd frontend

# Instalacja zależności
npm install

# Instalacja MDBootstrap Premium
npm install mdb-react-ui-kit
# Dla wersji premium (jeśli masz token):
# npm install git+https://oauth2:TOKEN@git.mdbootstrap.com/mdb/react/mdb5-react-ui-kit-pro

# Instalacja innych bibliotek
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install axios

# Uruchom dev server
npm run dev
# Domyślnie: http://localhost:5173
```

#### 3. Konfiguracja portów (Development)

**Lokalne (bez Dockera):**
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:8000` (Symfony)
- WebSocket: `ws://localhost:8080` (opcjonalnie)

**Z Dockerem:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  nginx:
    ports:
      - "80:80"      # HTTP
      - "443:443"    # HTTPS (dla produkcji)
  
  php:
    ports:
      - "8000:8000"  # Backend API
  
  mysql:
    ports:
      - "3306:3306"
```

#### 4. Deploy na Windows Server + IIS (Produkcja)

**Backend (port 8000):**
1. Zainstaluj PHP 8.2 + PHP Manager dla IIS
2. Skopiuj projekt Symfony do `C:\inetpub\wwwroot\maintly-backend`
3. Skonfiguruj IIS Application Pool (No Managed Code)
4. Backend będzie działał na `http://localhost:8000`

**Frontend (port 443 HTTPS):**
1. Zbuduj produkcyjną wersję:
   ```bash
   npm run build
   # Powstanie folder dist/
   ```
2. Skopiuj `dist/` do `C:\inetpub\wwwroot\maintly-frontend`
3. W IIS utwórz nową stronę:
   - Nazwa: `Maintly Frontend`
   - Port: `443`
   - Włącz SSL (certyfikat)
4. Skonfiguruj URL Rewrite (przekieruj API do backendu):

**Web.config dla frontendu (React SPA):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <!-- React Router: przekieruj wszystko do index.html -->
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
        
        <!-- Proxy API do backendu (port 8000) -->
        <rule name="Proxy API" stopProcessing="true">
          <match url="^api/(.*)" />
          <action type="Rewrite" url="http://localhost:8000/api/{R:1}" />
        </rule>
      </rules>
    </rewrite>
    
    <!-- CORS Headers -->
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="*" />
        <add name="Access-Control-Allow-Methods" value="GET,POST,PUT,DELETE,OPTIONS,PATCH" />
        <add name="Access-Control-Allow-Headers" value="Content-Type,Authorization" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

**Efekt końcowy:**
- 🌐 Frontend: `https://twoja-domena.pl` (port 443, HTTPS)
- 🔌 Backend API: `https://twoja-domena.pl/api/*` → proxy do `http://localhost:8000/api/*`
- 🔒 SSL certyfikat automatycznie szyfruje całą komunikację

**Alternatywnie (bez proxy):**
- Frontend: `https://twoja-domena.pl:443`
- Backend: `https://twoja-domena.pl:8000/api`
- W frontend `.env.production`:
  ```
  VITE_API_URL=https://twoja-domena.pl:8000/api
  ```

---

### Porty - podsumowanie

| Środowisko | Frontend | Backend | HTTPS |
|------------|----------|---------|-------|
| **Development (lokalnie)** | 5173 | 8000 | ❌ |
| **Docker (dev)** | 80 | 8000 | ❌ |
| **IIS (produkcja z proxy)** | 443 | 8000 (internal) | ✅ |
| **IIS (produkcja bez proxy)** | 443 | 8000 (external) | ✅ |

**Rekomendacja:** Użyj proxy w IIS - wtedy wszystko idzie przez port 443 (HTTPS), a backend jest ukryty wewnątrz.

---

## 📚 Dokumentacja szczegółowa

- **[Architecture Guide](docs/architecture/)** – diagramy, decyzje architektoniczne
- **[API Documentation](docs/api/)** – OpenAPI spec, endpointy
- **[Development Guide](docs/development/)** – jak pracować z kodem
- **[Deployment Guide](docs/deployment/)** – jak wdrożyć na produkcję

---

## 📱 Progressive Web App (PWA)

### Wersja na przedmiot (Grudzień 2025) - Podstawowa PWA

**Minimalna konfiguracja:**
```json
// public/manifest.json
{
  "name": "Maintly CMMS",
  "short_name": "Maintly",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Vite config (vite.config.ts):**
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Maintly CMMS',
        short_name: 'Maintly',
        theme_color: '#000000',
      }
    })
  ]
})
```

**Efekt:** Aplikacja może być zainstalowana na ekranie głównym telefonu/komputera.

---

### Wersja na inżynierkę (Maj 2026) - Pełny Offline Mode

**Service Worker z Workbox:**
```typescript
// src/service-worker.ts
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'

// Cache static assets
precacheAndRoute(self.__WB_MANIFEST)

// API calls - Network First (próbuj sieć, potem cache)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5
  })
)

// Images - Cache First
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache'
  })
)
```

**IndexedDB dla offline data (Dexie.js):**
```typescript
// src/services/offline/db.ts
import Dexie from 'dexie'

export class MainlyDB extends Dexie {
  workOrders!: Dexie.Table<WorkOrder, number>
  syncQueue!: Dexie.Table<SyncAction, number>

  constructor() {
    super('MainlyDB')
    this.version(1).stores({
      workOrders: '++id, title, status, createdAt',
      syncQueue: '++id, action, data, timestamp'
    })
  }
}

export const db = new MainlyDB()
```

**Offline sync queue:**
```typescript
// Dodawanie akcji do kolejki offline
async function addWorkOrderOffline(data: CreateWorkOrderDTO) {
  await db.syncQueue.add({
    action: 'CREATE_WORK_ORDER',
    data,
    timestamp: Date.now()
  })
}

// Synchronizacja po powrocie online
window.addEventListener('online', async () => {
  const pendingActions = await db.syncQueue.toArray()
  for (const action of pendingActions) {
    try {
      await api.post('/api/work-orders', action.data)
      await db.syncQueue.delete(action.id)
    } catch (err) {
      console.error('Sync failed:', err)
    }
  }
})
```

---

## 🧪 Testowanie

### Wersja na przedmiot (Grudzień 2025)
**Testy manualne wystarczą!** - testuj ręcznie w przeglądarce.

---

### Wersja na inżynierkę (Maj 2026) - Testy automatyczne

#### **Backend (Symfony + PHPUnit)**

**Setup bazy testowej (SQLite in-memory):**
```yaml
# config/packages/test/doctrine.yaml
doctrine:
    dbal:
        driver: 'pdo_sqlite'
        url: 'sqlite:///:memory:'
        # Używa SQLite w pamięci - nie dotyka MySQL!
```

**Test jednostkowy (Unit Test):**
```php
// tests/Unit/Domain/WorkOrderTest.php
namespace App\Tests\Unit\Domain;

use PHPUnit\Framework\TestCase;
use App\Domain\Model\WorkOrder\WorkOrder;

class WorkOrderTest extends TestCase
{
    public function testCanCreateWorkOrder(): void
    {
        $workOrder = new WorkOrder(
            title: 'Fix machine',
            description: 'Broken motor'
        );
        
        $this->assertEquals('Fix machine', $workOrder->getTitle());
        $this->assertEquals('new', $workOrder->getStatus());
    }
}
```

**Test integracyjny (Database Test):**
```php
// tests/Integration/Repository/WorkOrderRepositoryTest.php
namespace App\Tests\Integration\Repository;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use App\Domain\Model\WorkOrder\WorkOrder;

class WorkOrderRepositoryTest extends KernelTestCase
{
    private $entityManager;
    private $repository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
        
        // Tworzy tabelę w SQLite in-memory
        $this->entityManager->getConnection()
            ->executeStatement('CREATE TABLE work_order ...');
        
        $this->repository = $this->entityManager
            ->getRepository(WorkOrder::class);
    }

    public function testCanSaveWorkOrder(): void
    {
        $workOrder = new WorkOrder('Test', 'Description');
        $this->entityManager->persist($workOrder);
        $this->entityManager->flush();
        
        $found = $this->repository->find($workOrder->getId());
        $this->assertNotNull($found);
    }
}
```

**Uruchomienie testów:**
```bash
# Wszystkie testy (używa SQLite, nie MySQL!)
php bin/phpunit

# Tylko unit tests
php bin/phpunit tests/Unit

# Tylko integration tests
php bin/phpunit tests/Integration

# Z coverage
php bin/phpunit --coverage-html coverage/
```

**Fixtures (dane testowe):**
```php
// tests/Fixtures/WorkOrderFixtures.php
use Doctrine\Bundle\FixturesBundle\Fixture;

class WorkOrderFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < 10; $i++) {
            $workOrder = new WorkOrder(
                title: "Test Order $i",
                description: "Test description"
            );
            $manager->persist($workOrder);
        }
        $manager->flush();
    }
}
```

---

## 📚 Dokumentacja szczegółowa

- **[Architecture Guide](docs/architecture/)** – diagramy, decyzje architektoniczne
- **[API Documentation](docs/api/)** – OpenAPI spec, endpointy
- **[Development Guide](docs/development/)** – jak pracować z kodem
- **[Deployment Guide](docs/deployment/)** – jak wdrożyć na produkcję

---

## 🧪 Testowanie - TYLKO Backend

> **Frontend:** TypeScript + ręczne testowanie w przeglądarce (wystarczy!)

### Backend (PHPUnit + Behat)
```bash
# Unit tests (klasy, metody)
php bin/phpunit

# Testy integracyjne (SQLite in-memory - bezpieczne, nie dotyka MySQL!)
php bin/phpunit --group integration

# Testy E2E API (scenariusze biznesowe)
vendor/bin/behat
```

**SQLite in-memory** = tymczasowa baza w RAM, nie wpływa na MySQL produkcyjną

---

## 📱 PWA Push Notifications - Jak działa dla użytkownika

### **Scenariusz z perspektywy mechanika:**

**1. Instalacja aplikacji (jednorazowo):**
```
📱 Telefon mechanika
   ↓
   Otwiera przeglądarkę → https://maintly.firma.pl
   ↓
   Aplikacja pyta: "Czy chcesz zainstalować Maintly na ekranie głównym?"
   ↓
   Mechanik klika "Zainstaluj"
   ↓
   ✅ Ikona Maintly pojawia się na ekranie głównym (jak normalna aplikacja!)
```

**2. Włączenie powiadomień (jednorazowo):**
```
📲 Pierwsze logowanie w aplikacji
   ↓
   Popup: "Maintly chce wysyłać Ci powiadomienia"
   ↓
   Mechanik klika "Zezwól"
   ↓
   ✅ Teraz będzie dostawał powiadomienia nawet gdy aplikacja jest zamknięta!
```

**3. Praca na co dzień - Nowa awaria:**
```
🏭 Operator tworzy zlecenie "PILNE - Awaria CNC-001"
   ↓ (backend wysyła push przez WebSocket)
   
📱 Telefon mechanika (nawet ZABLOKOWANY!):
   ┌─────────────────────────────────────┐
   │ 🔔 Maintly                          │
   │ 🚨 PILNA AWARIA!                    │
   │ CNC-001 - Przegrzanie silnika       │
   │                                     │
   │ [Przyjmij zlecenie] [Zobacz]        │
   └─────────────────────────────────────┘
   (telefon wibruje: bzz-bzz-bzz!)
   
   ↓
   
**OPCJA A - Mechanik kliknie "Przyjmij zlecenie":**
   → Zlecenie automatycznie przypisane do niego
   → Aplikacja się otwiera → widzi szczegóły awarii
   → Status zmienia się na "W trakcie realizacji"
   → Operator widzi na swoim ekranie: "Jan Kowalski przyjął zlecenie"
   
**OPCJA B - Mechanik kliknie "Zobacz":**
   → Aplikacja się otwiera
   → Widzi szczegóły zlecenia
   → Może ręcznie kliknąć "Przyjmij" lub zostawić komuś innemu
   
**OPCJA C - Mechanik ignoruje powiadomienie:**
   → Powiadomienie zostaje w pasku (może wrócić później)
   → Badge na ikonie Maintly: (1) ← licznik jak na Messengerze
   → Po 5 minutach dostaje przypomnienie (opcjonalne)
```

**4. Praca offline (bez internetu):**
```
📡 Mechanik w hali produkcyjnej (słaby/brak Wi-Fi)
   ↓
   Otwiera aplikację Maintly
   ↓
   ✅ Aplikacja działa! (Service Worker załadował cache)
   ↓
   Widzi listę zleceń (z IndexedDB)
   ↓
   Zmienia status na "Ukończone" → zapisane lokalnie
   ↓
   Wraca do biura (Wi-Fi działa)
   ↓
   🔄 Automatyczny sync → backend dostaje aktualizację
   ↓
   Operator widzi zmianę statusu w czasie rzeczywistym
```

**5. Różne typy powiadomień:**

**PILNA AWARIA (czerwone):**
```
🚨 Maintly - PILNA AWARIA!
   "CNC-001 - Silnik dymi!"
   (wibracja: 300ms-200ms-300ms-200ms)
   [Przyjmij] [Odrzuć] [Zobacz]
```

**PRZYPISANO ZLECENIE (niebieskie):**
```
📋 Maintly - Nowe zlecenie dla Ciebie
   "Wymiana filtra w pompie #5"
   (wibracja: 200ms-100ms-200ms)
   [Przyjmij] [Zobacz]
```

**PRZYPOMNIENIE (żółte):**
```
⏰ Maintly - Przypomnienie
   "Zlecenie WO-123 oczekuje od 2h"
   (wibracja: 100ms)
   [Zobacz]
```

**ZLECENIE UKOŃCZONE (zielone):**
```
✅ Maintly - Zlecenie zamknięte
   "Jan Kowalski ukończył WO-123"
   (bez wibracji)
   [OK]
```

### **Techniczne szczegóły:**
- ✅ Działa nawet gdy telefon zablokowany
- ✅ Działa nawet gdy aplikacja zamknięta
- ✅ Badge na ikonie (licznik nieprzeczytanych)
- ✅ Akcje bezpośrednio w powiadomieniu (bez otwierania app)
- ✅ Grupowanie (5 awarii → 1 powiadomienie "5 nowych awarii")
- ✅ Customizowane dźwięki + wibracje
- ✅ Obrazki w powiadomieniach (np. foto maszyny)

---

## 🤝 Współpraca

Projekt rozwijany jest w oparciu o:
- **Feature branches** – każda funkcjonalność w osobnym branchu
- **Pull Requests** – code review przed merge
- **Conventional Commits** – standaryzowane commity
- **GitHub Issues** – tracking zadań i bugów

Chcesz pomóc? Zobacz [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📜 Licencja

Projekt udostępniony na licencji **MIT**. Zobacz [LICENSE](LICENSE).

---

## 📞 Kontakt

**Autor:** Waither  
**GitHub:** [@Waither](https://github.com/Waither)  
**Issues:** [github.com/Waither/Maintly/issues](https://github.com/Waither/Maintly/issues)

---

> **Maintly** – Modern CMMS, CQRS Architecture, Real-time Everything.