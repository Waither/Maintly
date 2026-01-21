# 📚 ŚCIĄGA - Maintly CMMS

> **Ściągawka do obrony projektu**  
> Wszystkie punkty oceny z przykładami kodu i lokalizacją plików

---

## 📋 Spis treści

1. [README i uruchomienie](#1-readme-i-uruchomienie)
2. [Architektura / ERD](#2-architektura--erd)
3. [Baza danych](#3-baza-danych)
4. [Repozytorium Git](#4-repozytorium-git)
5. [Implementacja funkcji](#5-implementacja-funkcji)
6. [Dobór technologii](#6-dobór-technologii)
7. [Architektura kodu](#7-architektura-kodu)
8. [UX/UI](#8-uxui)
9. [Uwierzytelnianie i autoryzacja](#9-uwierzytelnianie-i-autoryzacja)
10. [API](#10-api)
11. [Frontend-API](#11-frontend-api)
12. [Jakość kodu](#12-jakość-kodu)
13. [Asynchroniczność / kolejki](#13-asynchroniczność--kolejki) ⭐ WAŻNE!
14. [Dokumentacja API](#14-dokumentacja-api)

---

## 1. README i uruchomienie

**📁 Plik:** `/README.md`

**Co zawiera:**
- Opis projektu ("Nowoczesny system zarządzania utrzymaniem ruchu")
- Instrukcja uruchomienia krok po kroku (Docker)
- Wymagania: Docker, Node.js, Git
- Tabela z portami i URL-ami
- Komendy do sprawdzenia czy działa

**Jak uruchomić:**
```bash
docker-compose up -d
docker exec maintly-backend php bin/console doctrine:migrations:migrate
# Frontend: http://localhost:3000
# API: http://localhost:8000/api
```

---

## 2. Architektura / ERD

**📁 Pliki:** `/docs/database/ERD.svg`, `ERD.png`, `ERD.pdf`

**Tabele w bazie (22):**
- `users`, `user_roles` - użytkownicy i role
- `equipment`, `equipment_tags`, `equipment_files` - urządzenia
- `work_orders`, `work_order_statuses`, `work_order_priorities` - zlecenia
- `reports` - raporty
- `audit_logs` - logi audytu
- `tags`, `tag_groups` - tagi
- `notifications` - powiadomienia
- `translations` - tłumaczenia i18n

---

## 3. Baza danych

**Statystyki:**
- **557+ rekordów** (wymagane: 30)
- **22 tabele** (wymagane: 5)
- Normalizacja 3NF

**Sprawdzenie:**
```bash
docker exec maintly-mysql mysql -u maintly -psecret maintly -e "
SELECT table_name, table_rows 
FROM information_schema.tables 
WHERE table_schema = 'maintly';"
```

**Migracje:** `/backend/migrations/` - 13 plików migracji

---

## 4. Repozytorium Git

**Statystyki:**
- **70+ commitów** (wymagane: 40)
- Czytelna historia z konwencją (feat, fix, refactor)

**Sprawdzenie:**
```bash
git log --oneline | wc -l
```

---

## 5. Implementacja funkcji

**Zaimplementowane moduły (>70%):**

| Moduł | Status | Lokalizacja |
|-------|--------|-------------|
| Dashboard | ✅ | `/frontend/src/pages/Dashboard/` |
| Work Orders | ✅ | `/frontend/src/pages/WorkOrders/` |
| Equipment | ✅ | `/frontend/src/pages/Equipment/` |
| Users | ✅ | `/frontend/src/pages/Users/` |
| Reports | ✅ | `/frontend/src/pages/Reports/` |
| Audit Logs | ✅ | `/frontend/src/pages/AuditLogs/` |
| Profile | ✅ | `/frontend/src/pages/Profile/` |
| Notifications | ✅ | System powiadomień |
| i18n | ✅ | Wielojęzyczność PL/EN |

---

## 6. Dobór technologii

### Backend
| Technologia | Wersja | Dlaczego? |
|-------------|--------|-----------|
| **Symfony** | 7.x | Najnowszy, enterprise-grade, CQRS |
| **PHP** | 8.2+ | Typy, atrybuty, readonly |
| **MySQL** | 8.x | Relacyjna, transakcje |
| **Doctrine ORM** | 3.x | Mapping, migracje |
| **JWT** | LexikBundle | Bezstanowe API |

### Frontend
| Technologia | Wersja | Dlaczego? |
|-------------|--------|-----------|
| **React** | 18.x | Hooks, Concurrent Mode |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Szybki dev server, HMR |
| **MDB React** | 8.x | Material Design |
| **React Router** | 6.x | SPA routing |
| **i18next** | 23.x | Internacjonalizacja |

**📁 Uzasadnienie:** `/frontend/TECH-STACK.md`

---

## 7. Architektura kodu

### Backend - CQRS (Command Query Responsibility Segregation)

```
backend/src/
├── Application/
│   ├── Command/          # Komendy (zapis) - CreateWorkOrder, UpdateUser, etc.
│   └── Query/            # Zapytania (odczyt) - GetAllWorkOrders, etc.
├── Controller/           # HTTP Controllers (thin)
├── Entity/               # Encje Doctrine
├── Repository/           # Repozytoria
├── Service/              # Logika biznesowa
├── MessageHandler/       # Async handlers
├── EventSubscriber/      # Event listeners
└── Security/Voter/       # Autoryzacja granularna
```

**Przykład Command:**
```php
// backend/src/Application/Command/WorkOrder/CreateWorkOrderCommand.php
readonly class CreateWorkOrderCommand {
    public function __construct(
        public string $title,
        public string $description,
        public int $statusId,
        public int $priorityId,
        // ...
    ) {}
}

// backend/src/Application/Command/WorkOrder/CreateWorkOrderHandler.php
#[AsMessageHandler]
class CreateWorkOrderHandler {
    public function __invoke(CreateWorkOrderCommand $command): WorkOrder {
        // logika tworzenia
    }
}
```

### Frontend - Feature-based

```
frontend/src/
├── app/                  # App.tsx, routing
├── components/           # Reusable components
│   ├── auth/            # ProtectedRoute
│   ├── layouts/         # MainLayout
│   └── ui/              # Buttons, Tables, etc.
├── pages/               # Feature modules
│   ├── Dashboard/
│   ├── WorkOrders/
│   ├── Equipment/
│   └── ...
├── services/            # API services
├── types/               # TypeScript types
└── lib/                 # Utilities (axios)
```

---

## 8. UX/UI

**Design System:** MDB React (Material Design Bootstrap)

**Komponenty:**
- ✅ Responsywny sidebar
- ✅ Tabele z paginacją, sortowaniem, filtrowaniem
- ✅ Formularze z walidacją
- ✅ Toast notifications
- ✅ Loading states (skeleton)
- ✅ Ciemny/jasny motyw
- ✅ Ikony (MDB Icons)

**📁 Style:** `/frontend/src/styles/`

---

## 9. Uwierzytelnianie i autoryzacja

### JWT Authentication

**📁 Plik:** `/backend/config/packages/security.yaml`

```yaml
security:
    firewalls:
        api:
            pattern: ^/api
            stateless: true
            jwt: ~
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maintly.com","password":"MaintlyAdmin!@#"}'
# Response: { "token": "eyJ..." }
```

### Role użytkowników

| Rola | Uprawnienia |
|------|------------|
| `ROLE_ADMIN` | Pełne - wszystko |
| `ROLE_MANAGER` | CRUD użytkowników, equipment, zleceń |
| `ROLE_TECHNICIAN` | Edycja przypisanych zleceń |
| `ROLE_PROVIDER` | Tylko własne zgłoszenia |

### Voters (granularna autoryzacja)

**📁 Pliki:** `/backend/src/Security/Voter/`

```php
// WorkOrderVoter.php
class WorkOrderVoter extends Voter {
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool {
        // Sprawdza czy user może edytować to zlecenie
    }
}
```

### Frontend - Protected Routes

**📁 Plik:** `/frontend/src/components/auth/ProtectedRoute.tsx`

```tsx
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = getAuthToken();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};
```

---

## 10. API

**Statystyki:**
- **68 endpointów** REST
- Poprawne HTTP statusy (200, 201, 400, 401, 403, 404, 422, 500)

**Przykłady:**
```
GET    /api/work-orders           # Lista zleceń
POST   /api/work-orders           # Nowe zlecenie
GET    /api/work-orders/{id}      # Szczegóły
PUT    /api/work-orders/{id}      # Aktualizacja
DELETE /api/work-orders/{id}      # Usunięcie

GET    /api/equipment
POST   /api/reports/generate      # Async raport
GET    /api/audit-logs
```

**📁 Dokumentacja:** `/docs/api/README.md`

---

## 11. Frontend-API

### Serwisy API

**📁 Pliki:** `/frontend/src/services/`

```typescript
// workOrderService.ts
export const getAll = async (params?: WorkOrderListParams) => {
    const response = await api.get<ApiResponse<WorkOrderListResponse>>('/work-orders', { params });
    return response.data;
};

export const create = async (data: WorkOrderFormData) => {
    const response = await api.post<ApiResponse<WorkOrder>>('/work-orders', data);
    return response.data;
};
```

### Loading/Error States

```tsx
// Każda strona ma loading state
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await workOrderService.getAll();
            setOrders(data);
        } catch (err) {
            setError('Błąd ładowania');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
```

### Axios Interceptor (auto JWT)

**📁 Plik:** `/frontend/src/lib/axios.ts`

```typescript
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## 12. Jakość kodu

### TypeScript Strict Mode

**📁 Plik:** `/frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

### PHP Strict Types

```php
<?php
declare(strict_types=1);
```

### DRY (Don't Repeat Yourself)

- Reusable components: `DataTable`, `FormField`, `PageHeader`
- Shared types: `/frontend/src/types/`
- API services zamiast inline fetch

---

## 13. Asynchroniczność / kolejki ⭐

### Symfony Messenger

**📁 Konfiguracja:** `/backend/config/packages/messenger.yaml`

```yaml
framework:
    messenger:
        transports:
            # Sync dla CQRS (Commands/Queries)
            sync: 'sync://'
            
            # Async dla background jobs
            async:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3
                    multiplier: 2
            
            failed: 'doctrine://default?queue_name=failed'

        routing:
            # CQRS - synchronicznie
            'App\Application\Command\*': sync
            'App\Application\Query\*': sync
            
            # Background jobs - asynchronicznie
            'App\Message\*': async
```

**Transport:** `MESSENGER_TRANSPORT_DSN=doctrine://default` (Doctrine jako broker)

### Przykład: Generowanie raportów

**1. Message (wiadomość do kolejki)**

**📁 Plik:** `/backend/src/Message/GenerateReportMessage.php`

```php
readonly class GenerateReportMessage {
    public function __construct(
        public int $reportId,
        public string $reportType,    // 'maintenance', 'equipment', 'users'
        public string $format,        // 'pdf', 'excel', 'csv'
        public array $filters = [],
    ) {}
}
```

**2. Controller (dispatch do kolejki)**

**📁 Plik:** `/backend/src/Controller/ReportController.php`

```php
#[Route('/generate', methods: ['POST'])]
public function generate(Request $request): JsonResponse {
    // Tworzy encję Report
    $report = new Report();
    $report->setStatus('pending');
    $this->entityManager->persist($report);
    $this->entityManager->flush();

    // Dispatch async message!
    $message = new GenerateReportMessage(
        reportId: $report->getId(),
        reportType: $data['reportType'],
        format: $data['format'],
        filters: $data['filters'] ?? [],
    );
    $this->commandBus->dispatch($message);

    // Odpowiedź 202 Accepted (task w tle)
    return $this->successResponse(
        data: ['id' => $report->getId(), 'status' => 'pending'],
        code: 202,
    );
}
```

**3. Handler (przetwarzanie w tle)**

**📁 Plik:** `/backend/src/MessageHandler/GenerateReportHandler.php`

```php
#[AsMessageHandler]
final readonly class GenerateReportHandler {
    public function __invoke(GenerateReportMessage $message): void {
        $report = $this->reportRepository->find($message->reportId);
        
        // Status: processing
        $report->setStatus('processing');
        $this->entityManager->flush();

        // Generuj plik (może trwać długo!)
        $filePath = $this->reportGenerator->generate(
            reportType: $message->reportType,
            format: $message->format,
            filters: $message->filters,
        );

        // Status: completed
        $report->setStatus('completed');
        $report->setFileName(basename($filePath));
        $this->entityManager->flush();

        // Wyślij email z powiadomieniem (też async!)
        $this->messageBus->dispatch(new EmailNotificationMessage(...));
    }
}
```

### Tabela kolejki

```sql
SELECT * FROM messenger_messages;
-- id | body (serialized message) | queue_name | created_at
```

### Uruchomienie workera

```bash
# Przetwarza wiadomości z kolejki async
docker exec maintly-backend php bin/console messenger:consume async
```

### Inne async jobs

**📁 Plik:** `/backend/src/Message/EmailNotificationMessage.php`

```php
readonly class EmailNotificationMessage {
    public function __construct(
        public string $to,
        public string $subject,
        public string $template,
        public array $context = [],
    ) {}
}
```

### Dlaczego async?

1. **UX** - użytkownik nie czeka na długie operacje
2. **Skalowalność** - można dodać więcej workerów
3. **Reliability** - retry przy błędach (max_retries: 3)
4. **Separation** - Request/Response oddzielone od przetwarzania

---

## 14. Dokumentacja API

### Swagger UI

**URL:** http://localhost:8000/api/doc

**📁 Konfiguracja:** `/backend/config/packages/nelmio_api_doc.yaml`

```yaml
nelmio_api_doc:
    documentation:
        info:
            title: Maintly CMMS API
            version: 1.0.0
        security:
            - Bearer: []
```

### OpenAPI Attributes

**📁 Przykład:** `/backend/src/Controller/EquipmentController.php`

```php
use OpenApi\Attributes as OA;

#[Route('/api/equipment')]
class EquipmentController {
    
    #[OA\Get(
        path: '/api/equipment',
        summary: 'Get list of equipment',
        tags: ['Equipment'],
        responses: [
            new OA\Response(response: 200, description: 'Equipment list'),
            new OA\Response(response: 401, description: 'Unauthorized')
        ]
    )]
    public function list(): JsonResponse { ... }
}
```

---

## 🔑 Dane logowania

| Email | Hasło | Rola |
|-------|-------|------|
| admin@maintly.com | MaintlyAdmin!@# | Admin |
| manager@maintly.com | MaintlyManager!@# | Manager |
| tech@maintly.com | MaintlyTech!@# | Technician |

---

## 🐳 Komendy Docker

```bash
# Uruchom
docker-compose up -d

# Logi
docker-compose logs -f backend

# Wejdź do kontenera
docker exec -it maintly-backend bash

# Wyczyść cache
docker exec maintly-backend php bin/console cache:clear

# Migracje
docker exec maintly-backend php bin/console doctrine:migrations:migrate

# Worker kolejki
docker exec maintly-backend php bin/console messenger:consume async

# Status kolejki
docker exec maintly-backend php bin/console messenger:stats
```

---

## 📁 Najważniejsze pliki

| Co | Gdzie |
|----|-------|
| CQRS Commands | `/backend/src/Application/Command/` |
| CQRS Queries | `/backend/src/Application/Query/` |
| Async Messages | `/backend/src/Message/` |
| Message Handlers | `/backend/src/MessageHandler/` |
| Voters (autoryzacja) | `/backend/src/Security/Voter/` |
| Audit Subscriber | `/backend/src/EventSubscriber/DoctrineAuditSubscriber.php` |
| Messenger Config | `/backend/config/packages/messenger.yaml` |
| Security Config | `/backend/config/packages/security.yaml` |
| Frontend Services | `/frontend/src/services/` |
| React Components | `/frontend/src/components/` |
| TypeScript Types | `/frontend/src/types/` |
| ERD Diagram | `/docs/database/ERD.*` |
| API Docs | `/docs/api/README.md` |

---

*Powodzenia na obronie! 🎓*
