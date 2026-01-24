# Maintly CMMS - Dokumentacja API

> Kompletna dokumentacja REST API systemu Maintly CMMS.

---

## Spis treści

1. [Informacje ogólne](#informacje-ogólne)
2. [Uwierzytelnianie](#uwierzytelnianie)
3. [Endpointy API](#endpointy-api)
4. [Macierz uprawnień](#macierz-uprawnień)
5. [Format odpowiedzi](#format-odpowiedzi)
6. [Obsługa błędów](#obsługa-błędów)
7. [Przykłady użycia](#przykłady-użycia)

---

## Informacje ogólne

### Base URL

| Środowisko | URL |
|------------|-----|
| Development | `http://localhost:8000/api` |
| Production | `https://your-domain.com/api` |

### Content-Type

Wszystkie żądania i odpowiedzi używają JSON:

```
Content-Type: application/json
Accept: application/json
```

### Wersjonowanie

API nie używa wersjonowania w URL. Zmiany są retrokompatybilne.

### Swagger UI

Interaktywna dokumentacja API dostępna pod:
- **HTTP:** http://localhost:8000/api/doc
- **HTTPS:** https://localhost:8443/api/doc

### OpenAPI JSON

Specyfikacja OpenAPI 3.0 dostępna pod:
- http://localhost:8000/api/doc.json

---

## Uwierzytelnianie

### JWT (JSON Web Token)

System używa tokenów JWT do autoryzacji żądań.

#### Logowanie

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@maintly.local",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": 1,
    "email": "admin@maintly.local",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

#### Używanie tokenu

Każde żądanie do chronionego endpointu musi zawierać header:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

#### Refresh Token

Token wygasa po 1 godzinie. Użyj refresh tokenu aby uzyskać nowy:

```http
POST /api/token/refresh
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

---

## Endpointy API

### Bezpieczeństwo (Security)

| Metoda | Endpoint | Opis | Autoryzacja |
|--------|----------|------|-------------|
| `POST` | `/api/login` | Logowanie użytkownika | ❌ Public |
| `POST` | `/api/register` | Rejestracja nowego konta | ❌ Public |
| `POST` | `/api/token/refresh` | Odświeżenie tokenu JWT | 🔑 Token |
| `POST` | `/api/logout` | Wylogowanie (invalidate token) | 🔑 Token |

### Użytkownicy (Users)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/users` | Lista użytkowników (paginacja) | manager |
| `GET` | `/api/users/{id}` | Szczegóły użytkownika | manager |
| `POST` | `/api/users` | Tworzenie użytkownika | manager |
| `PUT` | `/api/users/{id}` | Aktualizacja użytkownika | manager |
| `PATCH` | `/api/users/{id}/toggle-active` | Włącz/wyłącz konto | manager |
| `DELETE` | `/api/users/{id}` | Usunięcie użytkownika (soft) | admin |
| `GET` | `/api/me` | Dane zalogowanego użytkownika | * |
| `PUT` | `/api/me` | Aktualizacja własnego profilu | * |
| `PATCH` | `/api/me/password` | Zmiana własnego hasła | * |

### Urządzenia (Equipment)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/equipment` | Lista urządzeń z filtrami | reporter |
| `GET` | `/api/equipment/{id}` | Szczegóły urządzenia | reporter |
| `POST` | `/api/equipment` | Tworzenie urządzenia | manager |
| `PUT` | `/api/equipment/{id}` | Aktualizacja urządzenia | manager |
| `DELETE` | `/api/equipment/{id}` | Usunięcie urządzenia (soft) | manager |
| `GET` | `/api/equipment/{id}/history` | Historia zmian urządzenia | reporter |
| `GET` | `/api/equipment/{id}/work-orders` | Zlecenia dla urządzenia | reporter |
| `GET` | `/api/equipment/statuses` | Lista dostępnych statusów | reporter |
| `GET` | `/api/equipment/categories` | Lista kategorii | reporter |

### Tagi (Tags)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/tags` | Lista wszystkich tagów | reporter |
| `GET` | `/api/tags/{id}` | Szczegóły tagu | reporter |
| `POST` | `/api/tags` | Tworzenie tagu | manager |
| `PUT` | `/api/tags/{id}` | Aktualizacja tagu | manager |
| `DELETE` | `/api/tags/{id}` | Usunięcie tagu | manager |

### Zlecenia (Work Orders)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/work-orders` | Lista zleceń (paginacja, filtry) | reporter |
| `GET` | `/api/work-orders/{id}` | Szczegóły zlecenia | reporter |
| `POST` | `/api/work-orders` | Tworzenie zlecenia | reporter |
| `PUT` | `/api/work-orders/{id}` | Aktualizacja zlecenia | technician |
| `PATCH` | `/api/work-orders/{id}/status` | Zmiana statusu | technician |
| `PATCH` | `/api/work-orders/{id}/assign` | Przypisanie technika | technician |
| `DELETE` | `/api/work-orders/{id}` | Usunięcie zlecenia (soft) | manager |
| `GET` | `/api/work-orders/statuses` | Lista statusów zleceń | reporter |
| `GET` | `/api/work-orders/priorities` | Lista priorytetów | reporter |
| `GET` | `/api/work-orders/types` | Lista typów zleceń | reporter |

### Aktywności (Activities)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/work-orders/{id}/activities` | Aktywności zlecenia | reporter |
| `POST` | `/api/work-orders/{id}/activities` | Dodanie aktywności | technician |
| `PUT` | `/api/activities/{id}` | Aktualizacja aktywności | technician |
| `DELETE` | `/api/activities/{id}` | Usunięcie aktywności | technician |

### Powiadomienia (Notifications)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/notifications` | Lista powiadomień użytkownika | * |
| `GET` | `/api/notifications/unread-count` | Liczba nieprzeczytanych | * |
| `PATCH` | `/api/notifications/{id}/read` | Oznacz jako przeczytane | * |
| `PATCH` | `/api/notifications/read-all` | Oznacz wszystkie jako przeczytane | * |
| `DELETE` | `/api/notifications/{id}` | Usuń powiadomienie | * |

### Raporty (Reports)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/reports` | Lista wygenerowanych raportów | manager |
| `POST` | `/api/reports/equipment` | Generuj raport urządzeń (PDF/Excel) | manager |
| `POST` | `/api/reports/work-orders` | Generuj raport zleceń (PDF/Excel) | manager |
| `GET` | `/api/reports/{id}/download` | Pobierz plik raportu | manager |
| `DELETE` | `/api/reports/{id}` | Usuń raport | manager |

### Logi audytu (Audit Logs)

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/audit-logs` | Lista logów (paginacja, filtry) | admin |
| `GET` | `/api/audit-logs/{id}` | Szczegóły logu | admin |

### Dashboard

| Metoda | Endpoint | Opis | Min. rola |
|--------|----------|------|-----------|
| `GET` | `/api/dashboard/stats` | Statystyki główne | reporter |
| `GET` | `/api/dashboard/work-orders-chart` | Dane do wykresów | reporter |
| `GET` | `/api/dashboard/recent-activities` | Ostatnie aktywności | reporter |

---

## Macierz uprawnień

### Role i poziomy dostępu

| Rola | Level | Opis |
|------|-------|------|
| `admin` | 1 | Pełny dostęp do wszystkich funkcji |
| `manager` | 2 | Zarządzanie urządzeniami, użytkownikami (level 3-5), raportami |
| `technician` | 3 | Praca ze zleceniami, aktualizacje, aktywności |
| `provider` | 4 | Tylko własne zlecenia |
| `reporter` | 5 | Tworzenie zleceń, podgląd danych |

### Matryca uprawnień szczegółowych

| Moduł | Operacja | admin | manager | technician | provider | reporter |
|-------|----------|:-----:|:-------:|:----------:|:--------:|:--------:|
| **Users** | List | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Create | ✅ | ✅* | ❌ | ❌ | ❌ |
| | Edit | ✅ | ✅* | ❌ | ❌ | ❌ |
| | Delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Equipment** | List | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Edit | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Work Orders** | List | ✅ | ✅ | ✅ | ✅** | ✅ |
| | Create | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Edit | ✅ | ✅ | ✅ | ❌ | ❌ |
| | Delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Change Status | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Reports** | Generate | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Download | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Audit Logs** | View | ✅ | ❌ | ❌ | ❌ | ❌ |

> *Manager może zarządzać tylko użytkownikami o niższym poziomie (technician, provider, reporter)
> 
> **Provider widzi tylko zlecenia gdzie jest przypisany

---

## Format odpowiedzi

### Sukces (200/201)

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": 1,
    "name": "Example Equipment",
    "equipmentId": "EQ-000001"
  }
}
```

### Lista z paginacją

```json
{
  "status": "success",
  "code": 200,
  "data": [
    { "id": 1, "name": "Equipment 1" },
    { "id": 2, "name": "Equipment 2" }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Błąd walidacji (400)

```json
{
  "status": "error",
  "code": 400,
  "message": "validation.failed",
  "errors": {
    "name": ["validation.required", "validation.min_length"],
    "email": ["validation.email.invalid"]
  }
}
```

### Brak autoryzacji (401)

```json
{
  "status": "error",
  "code": 401,
  "message": "auth.token_expired"
}
```

### Brak uprawnień (403)

```json
{
  "status": "error",
  "code": 403,
  "message": "auth.access_denied"
}
```

### Nie znaleziono (404)

```json
{
  "status": "error",
  "code": 404,
  "message": "entity.not_found"
}
```

### Błąd serwera (500)

```json
{
  "status": "error",
  "code": 500,
  "message": "server.internal_error"
}
```

---

## Obsługa błędów

### Kody błędów

| Kod | Znaczenie | Akcja |
|-----|-----------|-------|
| 400 | Bad Request | Sprawdź dane wejściowe |
| 401 | Unauthorized | Zaloguj się / odśwież token |
| 403 | Forbidden | Brak uprawnień do zasobu |
| 404 | Not Found | Zasób nie istnieje |
| 409 | Conflict | Konflikt (np. duplikat) |
| 422 | Unprocessable Entity | Błąd walidacji biznesowej |
| 429 | Too Many Requests | Rate limit - poczekaj |
| 500 | Internal Server Error | Błąd serwera |

### Rate Limiting

Endpoint logowania jest chroniony rate limitingiem:

- **Limit:** 5 prób na 15 minut (per IP)
- **Header:** `X-RateLimit-Remaining`
- **Response 429:** `Too Many Requests`

---

## Przykłady użycia

### cURL - Logowanie

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@maintly.local", "password": "admin123"}'
```

### cURL - Lista urządzeń

```bash
curl -X GET "http://localhost:8000/api/equipment?page=1&limit=10" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." \
  -H "Accept: application/json"
```

### cURL - Tworzenie urządzenia

```bash
curl -X POST http://localhost:8000/api/equipment \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prasa hydrauliczna HP-500",
    "statusId": 1,
    "categoryId": 2,
    "locationId": 1,
    "description": "Prasa do formowania elementów metalowych"
  }'
```

### cURL - Tworzenie zlecenia

```bash
curl -X POST http://localhost:8000/api/work-orders \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Przegląd okresowy prasy HP-500",
    "equipmentId": 1,
    "priorityId": 2,
    "typeId": 1,
    "description": "Wykonać pełny przegląd zgodnie z DTR",
    "scheduledDate": "2025-02-15"
  }'
```

### cURL - Zmiana statusu zlecenia

```bash
curl -X PATCH http://localhost:8000/api/work-orders/1/status \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{"statusId": 2}'
```

### cURL - Generowanie raportu PDF

```bash
curl -X POST http://localhost:8000/api/reports/work-orders \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "format": "pdf",
    "dateFrom": "2025-01-01",
    "dateTo": "2025-01-31",
    "statusIds": [1, 2, 3]
  }'
```

---

## Filtrowanie i sortowanie

### Query Parameters

Większość endpointów listowych obsługuje:

| Parametr | Opis | Przykład |
|----------|------|----------|
| `page` | Numer strony | `?page=2` |
| `limit` | Liczba wyników | `?limit=50` |
| `sort` | Pole sortowania | `?sort=createdAt` |
| `order` | Kierunek | `?order=desc` |
| `search` | Wyszukiwanie | `?search=prasa` |

### Filtry specyficzne

**Equipment:**
```
?statusId=1
?categoryId=2
?locationId=1
?hasActiveWorkOrders=true
```

**Work Orders:**
```
?statusId=1,2,3
?priorityId=1
?assignedToId=5
?equipmentId=1
?dateFrom=2025-01-01
?dateTo=2025-01-31
```

**Audit Logs:**
```
?userId=1
?action=create,update
?entityType=Equipment
?dateFrom=2025-01-01
```

---

## Linki

- **Swagger UI:** http://localhost:8000/api/doc
- **OpenAPI JSON:** http://localhost:8000/api/doc.json
- **Architecture:** [docs/architecture/README.md](../architecture/README.md)
- **Database:** [docs/database/README.md](../database/README.md)
