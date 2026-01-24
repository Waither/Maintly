# Maintly CMMS - Architektura systemu

> Szczegółowa dokumentacja architektury, wzorców projektowych i decyzji technicznych.

---

## Spis treści

1. [Stack technologiczny](#stack-technologiczny)
2. [Architektura systemu](#architektura-systemu)
3. [Wzorce projektowe](#wzorce-projektowe)
4. [Struktura katalogów](#struktura-katalogów)
5. [Bezpieczeństwo](#bezpieczeństwo)
6. [Konfiguracja Docker](#konfiguracja-docker)
7. [Jakość kodu](#jakość-kodu)
8. [Wydajność](#wydajność)

---

## Stack technologiczny

### Backend

| Technologia | Wersja | Uzasadnienie |
|-------------|--------|--------------|
| **Symfony** | 7.3 | Modularna architektura, Dependency Injection, Event System, Messenger |
| **PHP** | 8.4 | Typed properties, Attributes, Enums, Fibers, JIT |
| **Doctrine ORM** | 3.x | Mapowanie obiektowo-relacyjne, migracje, QueryBuilder |
| **MySQL** | 8.4 | Relacyjna baza, ACID, JSON support, Window Functions |
| **Symfony Messenger** | 7.3 | Kolejki asynchroniczne, transport Doctrine |
| **LexikJWTBundle** | 2.x | JWT authentication z refresh tokenami |
| **NelmioApiDocBundle** | 4.x | Automatyczna dokumentacja OpenAPI 3.0 / Swagger |
| **DomPDF** | - | Generowanie dokumentów PDF z szablonów Twig |
| **PhpSpreadsheet** | - | Generowanie plików Excel/CSV |
| **Monolog** | 4.x | Centralne logowanie z różnymi handlerami |

### Frontend

| Technologia | Wersja | Uzasadnienie |
|-------------|--------|--------------|
| **React** | 18.x | Komponenty funkcyjne, Hooks, Suspense, Concurrent Mode |
| **TypeScript** | 5.x | Statyczne typowanie, lepsza jakość kodu, IntelliSense |
| **Vite** | 5.x | Szybki bundler, Hot Module Replacement, Tree Shaking |
| **React Router** | 7.x | Routing SPA, protected routes, nested layouts |
| **MDB React UI Kit** | - | Material Design Bootstrap, responsywne komponenty |
| **i18next** | 25.x | Internacjonalizacja, lazy loading tłumaczeń, pluralizacja |
| **Axios** | 1.x | HTTP client z interceptorami, automatyczne JWT refresh |
| **SASS** | 1.x | Preprocessor CSS, zmienne, mixiny, nesting |

### Infrastruktura

| Technologia | Uzasadnienie |
|-------------|--------------|
| **Docker** | Konteneryzacja, izolacja środowisk, powtarzalne buildy |
| **Docker Compose** | Orkiestracja 6 serwisów (backend, frontend, nginx, mysql, messenger, mailhog) |
| **Nginx** | Reverse proxy, SSL termination, load balancing, static files |
| **Mailhog** | Przechwytywanie emaili w development |

---

## Architektura systemu

### Diagram warstw

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                     React 18 + TypeScript + Vite                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Pages     │  │ Components  │  │  Services   │  │   i18n      │    │
│  │  (routes)   │  │  (shared)   │  │  (API)      │  │ (PL/EN/DE)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS / REST API
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                               NGINX                                      │
│                    Reverse Proxy + SSL Termination                      │
│                    Port 8000 (HTTP) / 8443 (HTTPS)                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ FastCGI
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
│                        Symfony 7.3 + PHP 8.4                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Controllers │→ │   CQRS      │→ │  Services   │→ │ Repositories│    │
│  │   (API)     │  │ Cmd/Query   │  │  (Logic)    │  │ (Doctrine)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Voters    │  │  Listeners  │  │  Messenger  │  │   Entity    │    │
│  │  (AuthZ)    │  │  (Events)   │  │   (Async)   │  │   (ORM)     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│     MySQL 8.4   │   │    Messenger    │   │     Mailhog     │
│   (Database)    │   │    (Worker)     │   │   (Email Dev)   │
│   Port 3306     │   │  async reports  │   │   Port 8025     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Przepływ żądania API

```
Request → Nginx → PHP-FPM → Kernel → Router → Controller
                                                   │
                                    ┌──────────────┴──────────────┐
                                    │                             │
                               CommandBus                    QueryBus
                                    │                             │
                               Handler                       Handler
                                    │                             │
                               Repository ←────────────→ Repository
                                    │                             │
                               Entity                        DTO
                                    │                             │
                               Database                     Response
                                    │                             │
                               Response ←────────────────────────┘
```

---

## Wzorce projektowe

### CQRS (Command Query Responsibility Segregation)

Rozdzielenie operacji zapisu (Commands) od odczytu (Queries):

```
src/Application/
├── Command/                    # Operacje zapisu (POST, PUT, PATCH, DELETE)
│   ├── Equipment/
│   │   ├── CreateEquipmentCommand.php
│   │   └── CreateEquipmentHandler.php
│   ├── User/
│   ├── Tag/
│   └── WorkOrder/
└── Query/                      # Operacje odczytu (GET)
    ├── Equipment/
    │   ├── GetAllEquipmentQuery.php
    │   └── GetAllEquipmentHandler.php
    ├── User/
    ├── Tag/
    └── WorkOrder/
```

**Korzyści:**
- Czytelniejszy kod - jasne rozdzielenie odpowiedzialności
- Łatwiejsze testowanie - izolowane handlery
- Skalowalność - możliwość optymalizacji odczytów niezależnie od zapisów
- Audytowalność - wszystkie Commands można logować

### Repository Pattern

Encapsulacja dostępu do bazy danych:

```php
// src/Repository/EquipmentRepository.php
class EquipmentRepository extends ServiceEntityRepository {
    public function findActiveWithTags(): array {
        return $this->createQueryBuilder('e')
            ->leftJoin('e.equipmentTags', 'et')
            ->leftJoin('et.tag', 't')
            ->where('e.deletedAt IS NULL')
            ->getQuery()
            ->getResult();
    }
}
```

### Voter Pattern (Authorization)

Decentralizowana autoryzacja oparta na voterach:

```php
// src/Security/Voter/WorkOrderVoter.php
class WorkOrderVoter extends Voter {
    protected function supports(string $attribute, mixed $subject): bool {
        return $subject instanceof WorkOrder
            && in_array($attribute, ['VIEW', 'EDIT', 'DELETE']);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool {
        $user = $token->getUser();
        
        return match($attribute) {
            'VIEW' => $this->canView($subject, $user),
            'EDIT' => $this->canEdit($subject, $user),
            'DELETE' => $this->canDelete($subject, $user),
            default => false,
        };
    }
}
```

### Event Listener / Subscriber

Automatyczne logowanie audytu:

```php
// src/EventSubscriber/AuditLogSubscriber.php
class AuditLogSubscriber implements EventSubscriberInterface {
    public static function getSubscribedEvents(): array {
        return [
            KernelEvents::CONTROLLER => 'onController',
            KernelEvents::RESPONSE => 'onResponse',
        ];
    }
}
```

### Async Messaging (Symfony Messenger)

Asynchroniczne przetwarzanie zadań:

```php
// src/Message/GenerateReportMessage.php
class GenerateReportMessage {
    public function __construct(
        public readonly int $reportId,
        public readonly int $userId,
    ) {}
}

// src/MessageHandler/GenerateReportHandler.php
#[AsMessageHandler]
class GenerateReportHandler {
    public function __invoke(GenerateReportMessage $message): void {
        // Generate PDF/Excel in background
    }
}
```

### EAV Pattern (Entity-Attribute-Value)

Dynamiczne pola dla urządzeń:

```
equipment_custom_fields (definicje pól)
    id: 1, field_name: "serial_number", field_type: "text"
    id: 2, field_name: "warranty_date", field_type: "date"
    id: 3, field_name: "manufacturer", field_type: "select"

equipment_custom_values (wartości)
    equipment_id: 5, custom_field_id: 1, value: "SN-12345"
    equipment_id: 5, custom_field_id: 2, value: "2027-01-15"
    equipment_id: 5, custom_field_id: 3, value: "Siemens"
```

---

## Struktura katalogów

### Backend (Symfony 7)

```
backend/
├── bin/
│   ├── console                 # Symfony CLI
│   └── phpunit                 # PHPUnit
├── config/
│   ├── packages/               # Konfiguracja bundli
│   │   ├── doctrine.yaml
│   │   ├── security.yaml       # Firewalle, providery, access control
│   │   ├── messenger.yaml      # Kolejki async
│   │   └── nelmio_api_doc.yaml # Swagger
│   ├── routes/                 # Routing API
│   ├── jwt/                    # Klucze prywatny/publiczny
│   ├── services.yaml           # Dependency Injection
│   └── routes.yaml             # Główne routy
├── migrations/                 # Migracje Doctrine
│   └── Version*.php
├── public/
│   └── index.php               # Front controller
├── src/
│   ├── Application/
│   │   ├── Command/            # CQRS Commands (Write)
│   │   └── Query/              # CQRS Queries (Read)
│   ├── Controller/             # API Endpoints
│   │   ├── SecurityController.php
│   │   ├── EquipmentController.php
│   │   ├── WorkOrderController.php
│   │   └── ...
│   ├── Entity/                 # Encje Doctrine (20 tabel)
│   ├── EventListener/          # Listenery (exceptions, audit)
│   ├── EventSubscriber/        # Subscribery
│   ├── Message/                # Wiadomości async
│   ├── MessageHandler/         # Handlery wiadomości
│   ├── Repository/             # Repozytoria Doctrine
│   ├── Security/
│   │   └── Voter/              # Votery autoryzacji
│   └── Service/                # Serwisy biznesowe
├── templates/
│   ├── emails/                 # Szablony Twig dla emaili
│   └── reports/                # Szablony raportów PDF
├── tests/
│   ├── Integration/            # Testy API
│   └── Unit/                   # Testy jednostkowe
├── scripts/                    # Skrypty PowerShell
│   ├── test.ps1
│   ├── stan.ps1
│   └── fix.ps1
└── composer.json
```

### Frontend (React)

```
frontend/
├── public/
│   ├── locales/                # Tłumaczenia JSON (i18n)
│   │   ├── pl/
│   │   ├── en/
│   │   └── de/
│   └── index.html
├── src/
│   ├── components/             # Współdzielone komponenty
│   │   ├── Layout/
│   │   ├── DataTable/
│   │   ├── Modal/
│   │   └── Form/
│   ├── pages/                  # Moduły funkcjonalne
│   │   ├── Auth/               # Login, Register
│   │   ├── Dashboard/          # Panel główny, statystyki
│   │   ├── Equipment/          # CRUD urządzeń
│   │   ├── WorkOrders/         # CRUD zleceń
│   │   ├── Users/              # Zarządzanie użytkownikami
│   │   ├── Reports/            # Generowanie raportów
│   │   ├── AuditLogs/          # Przegląd logów
│   │   └── Profile/            # Profil użytkownika
│   ├── services/               # Serwisy API (Axios)
│   │   ├── api.ts              # Konfiguracja Axios
│   │   ├── authService.ts
│   │   ├── equipmentService.ts
│   │   └── ...
│   ├── hooks/                  # Custom React Hooks
│   ├── context/                # React Context (auth, theme)
│   ├── i18n/                   # Konfiguracja i18next
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # Helpers
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Bezpieczeństwo

### Uwierzytelnianie (JWT)

```yaml
# config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
    secret_key: '%env(resolve:JWT_SECRET_KEY)%'
    public_key: '%env(resolve:JWT_PUBLIC_KEY)%'
    pass_phrase: '%env(JWT_PASSPHRASE)%'
    token_ttl: 3600        # 1 godzina
```

**Flow:**
1. User wysyła `POST /api/login` z email/password
2. Backend weryfikuje dane i generuje JWT token
3. Frontend przechowuje token w localStorage
4. Każde żądanie zawiera `Authorization: Bearer <token>`
5. Backend weryfikuje sygnaturę i ważność tokenu

### Autoryzacja (Role-Based Access Control)

```
Role Hierarchy:
├── ROLE_ADMIN (level 1)
│   └── Full access to everything
├── ROLE_MANAGER (level 2)
│   └── Equipment CRUD, User management (tech/prov/rep)
├── ROLE_TECHNICIAN (level 3)
│   └── Work orders (all), Activities
├── ROLE_PROVIDER (level 4)
│   └── Own work orders only
└── ROLE_REPORTER (level 5)
    └── Create work orders, read-only
```

### Zabezpieczenia

| Mechanizm | Implementacja |
|-----------|---------------|
| **Password Hashing** | bcrypt (Symfony PasswordHasher) |
| **Rate Limiting** | 5 prób logowania / 15 minut na IP |
| **CORS** | NelmioCorsBundle - konfigurowalny per environment |
| **Input Validation** | Symfony Validator + Attributes |
| **SQL Injection** | Doctrine ORM (prepared statements) |
| **XSS** | React automatycznie escape'uje |
| **CSRF** | SPA - brak formularzy, JWT |
| **Soft Delete** | Dane nie są fizycznie usuwane |

---

## Konfiguracja Docker

### Serwisy

| Kontener | Obraz | Port | Opis |
|----------|-------|------|------|
| `maintly-backend` | PHP 8.4 FPM | - | Backend API |
| `maintly-nginx` | Nginx Alpine | 8000, 8443 | Reverse proxy |
| `maintly-frontend` | Node 20 | 3000 | React dev server |
| `maintly-mysql` | MySQL 8.4 | 3306 | Baza danych |
| `maintly-messenger` | PHP 8.4 | - | Async worker |
| `maintly-mailhog` | Mailhog | 8025 | Email testing |

### Wolumeny

```yaml
volumes:
  mysql-data:           # Persystentne dane MySQL
  backend-vendor:       # Composer vendor (performance)
  frontend-node-modules: # npm node_modules (performance)
```

### Komendy

```bash
# Start
docker-compose up -d

# Logs
docker-compose logs -f backend

# Shell
docker exec -it maintly-backend bash

# Rebuild
docker-compose up -d --build

# Stop
docker-compose down
```

---

## Jakość kodu

### PHPStan (Static Analysis)

```bash
# Level 8 (max)
docker exec maintly-backend vendor/bin/phpstan analyse src -l 8

# Lub skrypt
.\backend\scripts\stan.ps1
```

### PHP CS Fixer (Code Style)

```bash
# Check
docker exec maintly-backend vendor/bin/php-cs-fixer fix src --dry-run --diff

# Fix
docker exec maintly-backend vendor/bin/php-cs-fixer fix src

# Lub skrypt
.\backend\scripts\fix.ps1
```

### Testy

```bash
# Wszystkie
docker exec -u www-data maintly-backend php bin/phpunit

# Z coverage
docker exec -u www-data maintly-backend php bin/phpunit --coverage-html var/coverage
```

---

## Wydajność

### Optymalizacje bazy danych

- Indeksy na wszystkich foreign keys
- Indeksy na kolumnach filtrowania (status_id, priority_id, created_at)
- Query result caching (Doctrine Second Level Cache - opcjonalnie)
- Connection pooling

### Optymalizacje API

- Paginacja na listach (limit/offset)
- Eager loading relacji (FETCH EAGER)
- Response compression (gzip)
- HTTP Cache headers

### Optymalizacje Frontend

- Code splitting (React.lazy)
- Tree shaking (Vite)
- Asset optimization (minifikacja, kompresja)
- Lazy loading tłumaczeń

### Docker Performance (Windows)

```yaml
# docker-compose.yml - Wolumeny w Linux FS (nie syncowane z Windows)
volumes:
  - backend-vendor:/var/www/html/vendor
  - frontend-node-modules:/app/node_modules

# tmpfs dla cache (RAM)
tmpfs:
  - /var/www/html/var/cache:mode=1777
  - /var/www/html/var/log:mode=1777
```

---

## Linki

- **API Documentation:** [docs/api/README.md](../api/README.md)
- **Database Schema:** [docs/database/README.md](../database/README.md)
- **Swagger UI:** http://localhost:8000/api/doc
