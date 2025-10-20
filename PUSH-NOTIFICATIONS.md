# 📱 Push Notifications w Maintly CMMS

> **Real-time powiadomienia systemowe o awariach i zleceniach — działa nawet gdy aplikacja jest zamknięta!**

---

## 🎯 Czym są Push Notifications w PWA?

Push Notifications to **natywne powiadomienia systemowe** wysyłane bezpośrednio na urządzenie użytkownika (telefon, laptop, tablet), nawet gdy:
- ❌ Aplikacja jest zamknięta
- ❌ Przeglądarka jest zamknięta
- ❌ Telefon jest zablokowany
- ❌ Użytkownik nie ma otwartej strony

**To działa DOKŁADNIE tak samo jak powiadomienia z:**
- 📱 Messenger / WhatsApp (nowe wiadomości)
- 📱 Gmail (nowe maile)
- 📱 Twitter (nowe tweety)
- 📱 Slack (wiadomości zespołowe)

---

## 🔥 Dlaczego to jest GAME CHANGER dla CMMS?

### **Problem tradycyjnych systemów:**

```
❌ Operator tworzy awarię o 10:00
❌ Mechanik musi sam sprawdzić:
   1. Otworzyć aplikację
   2. Odświeżyć stronę
   3. Zobaczyć czy są nowe zlecenia
❌ Sprawdza o 10:30 (30 minut stracone!)
❌ Maszyna stoi = przestój = STRATY PIENIĘDZY
```

### **Z Push Notifications w Maintly:**

```
✅ Operator tworzy awarię o 10:00:00
✅ Mechanik dostaje powiadomienie o 10:00:01
✅ Klika "Przyjmij" bezpośrednio w powiadomieniu o 10:00:10
✅ Jest przy maszynie o 10:01:00
✅ OSZCZĘDNOŚĆ: 29 minut przestoju!
```

**Matematyka:**
- Koszt przestoju linii produkcyjnej: **2000 zł/h**
- Oszczędność czasu: **30 minut = 0.5h**
- **OSZCZĘDNOŚĆ: 1000 zł per awaria!**
- Przy 10 awariach/miesiąc = **10 000 zł miesięcznie!**
- **= 120 000 zł rocznie! 💰**

---

## 📱 Jak to działa od strony użytkownika? (Krok po kroku)

### **Scenariusz: Awaria CNC-001**

#### **1. Instalacja aplikacji (jednorazowo przy pierwszym użyciu):**

```
📱 Mechanik Jan Kowalski otwiera:
   https://maintly.firma.pl
   ↓
   Przeglądarka pokazuje banner:
   ┌─────────────────────────────────────┐
   │ Czy chcesz zainstalować Maintly?   │
   │ [Anuluj]  [Zainstaluj]             │
   └─────────────────────────────────────┘
   ↓
   Jan klika "Zainstaluj"
   ↓
   ✅ Ikona Maintly pojawia się na ekranie głównym
   (wygląda jak normalna aplikacja!)
```

#### **2. Włączenie powiadomień (jednorazowo przy pierwszym logowaniu):**

```
📲 Pierwsze logowanie:
   ↓
   Popup przeglądarki:
   ┌─────────────────────────────────────┐
   │ Maintly chce wysyłać powiadomienia │
   │ [Blokuj]  [Zezwól]                 │
   └─────────────────────────────────────┘
   ↓
   Jan klika "Zezwól"
   ↓
   ✅ Subskrypcja zapisana w bazie
   ✅ Jan będzie dostawał powiadomienia!
```

#### **3. Operator tworzy zlecenie o godzinie 10:00:00:**

```
🏭 Operator w systemie:
   Formularz: "Nowe zlecenie"
   ├─ Tytuł: "Awaria CNC-001"
   ├─ Opis: "Przegrzanie silnika - 85°C"
   ├─ Priorytet: PILNE
   └─ [Zapisz]
   
Backend (Symfony):
   ↓
   CreateWorkOrderCommand → CreateWorkOrderHandler
   ↓
   WorkOrderCreatedEvent zostaje wywołany
   ↓
   SendPushNotificationListener łapie event
   ↓
   WebPushNotificationService wysyła push:
   - Do wszystkich mechaników (ROLE_TECHNICIAN)
   - LUB tylko do przypisanego mechanika
```

#### **4. Telefon mechanika o 10:00:01 (NAWET ZABLOKOWANY!):**

```
📱 Telefon Jana Kowalskiego:
   (telefon leży na stole, ekran zgaszony)
   ↓
   ┌─────────────────────────────────────┐
   │ 🔔 Maintly              10:00       │
   │ 🚨 PILNA AWARIA!                    │
   │ CNC-001 - Przegrzanie silnika       │
   │                                     │
   │ ┌──────────────┐  ┌──────────────┐ │
   │ │  Przyjmij    │  │    Zobacz    │ │
   │ └──────────────┘  └──────────────┘ │
   └─────────────────────────────────────┘
   
   (telefon wibruje: bzz-bzz-bzz!)
   (dźwięk powiadomienia: ding!)
```

**Efekt na ekranie głównym:**
```
📱 Ikona Maintly z badge:
┌──────┐
│  🔧  │ (1) ← licznik jak na Messengerze!
│Maintly│
└──────┘
```

#### **5A. Jan klika "Przyjmij zlecenie" o 10:00:10:**

```
Service Worker (działa w tle):
   ↓
   self.addEventListener('notificationclick')
   ↓
   Wywołuje API: POST /api/work-orders/123/accept
   ↓
Backend:
   ↓
   AcceptWorkOrderCommand → Handler
   ↓
   Zlecenie przypisane do Jana Kowalskiego
   ↓
   WorkOrderAcceptedEvent
   ↓
   WebSocket wysyła update do WSZYSTKICH (real-time!)
   ↓
Aplikacja automatycznie się otwiera:
   ┌─────────────────────────────────────┐
   │ ← Zlecenie #WO-123                  │
   │                                     │
   │ Status: ✅ W TRAKCIE REALIZACJI     │
   │ Przypisany: Jan Kowalski (TY)       │
   │                                     │
   │ 📋 Szczegóły:                       │
   │ CNC-001 - Przegrzanie silnika       │
   │ Temperatura: 85°C (norma: 60°C)     │
   │ Priorytet: PILNE                    │
   │                                     │
   │ 📍 Lokalizacja: Hala A, stanowisko 5│
   │                                     │
   │ [Zmień status ▼] [Dodaj notatkę]    │
   └─────────────────────────────────────┘
```

**Równocześnie na ekranie operatora (WebSocket real-time):**
```
💻 Ekran operatora:
   Lista zleceń automatycznie się odświeża:
   ┌─────────────────────────────────────┐
   │ Zlecenia serwisowe                  │
   │                                     │
   │ WO-123 [W TRAKCIE] Jan Kowalski    │
   │        ↑ przed chwilą!              │
   │        (zielona animacja flash)     │
   └─────────────────────────────────────┘
```

**Pozostali mechanicy dostają update:**
```
📱 Telefony pozostałych 4 mechaników:
   ┌─────────────────────────────────────┐
   │ ✅ Maintly                          │
   │ Zlecenie przyjęte                   │
   │ Jan Kowalski przyjął WO-123         │
   │ [OK]                                │
   └─────────────────────────────────────┘
```

#### **5B. Jan klika "Zobacz" o 10:00:10:**

```
Aplikacja się otwiera
   ↓
   Jan widzi szczegóły zlecenia
   Status: NOWE (jeszcze nieprzypisane)
   ↓
   Jan może:
   - Kliknąć przycisk "Przyjmij zlecenie"
   - Zostawić dla kogoś innego
   - Odrzucić (jeśli nie może przyjąć)
```

#### **5C. Jan ignoruje powiadomienie:**

```
Powiadomienie zostaje w pasku notyfikacji
   ↓
Badge na ikonie: (1) ← przypomnienie
   ↓
Jan może wrócić później i sprawdzić
   ↓
(Opcjonalnie) System wysyła przypomnienie po 5 min:
   ┌─────────────────────────────────────┐
   │ ⏰ Maintly - Przypomnienie          │
   │ Zlecenie WO-123 wciąż nieprzypisane │
   │ [Zobacz]                            │
   └─────────────────────────────────────┘
```

#### **6. Jan jedzie do maszyny (10:01 - 10:10):**

```
🚗 Jan jedzie do hali produkcyjnej
📡 Słabe/brak Wi-Fi w hali
   ↓
   PWA działa OFFLINE:
   - Service Worker załadował cache
   - IndexedDB ma dane zlecenia
   - Może przeglądać szczegóły
   - Może dodawać notatki (zapisane lokalnie)
```

#### **7. Jan naprawia maszynę (10:10 - 10:25):**

```
🔧 Jan wymienia przegrzany element
📝 Dodaje notatkę w aplikacji (offline):
   "Wymieniono uszkodzony wentylator silnika"
   ↓
   Zapisane lokalnie w IndexedDB
   ↓
   Ikona sync: 🔄 (oczekuje na sieć)
```

#### **8. Jan kończy naprawę o 10:25:00:**

```
Jan wraca do biura (Wi-Fi działa)
   ↓
   Otwiera aplikację
   ↓
   Klika "Zmień status" → "Ukończone"
   ↓
   Automatyczny sync:
   - Notatka wysłana do backendu
   - Status zmieniony na "Ukończone"
   - Czas zakończenia: 10:25:00
   ↓
Backend:
   ↓
   WorkOrderCompletedEvent
   ↓
   WebSocket → wszyscy dostają update
   ↓
   Push notification do operatora + managera:
   ┌─────────────────────────────────────┐
   │ ✅ Maintly - Awaria rozwiązana      │
   │ CNC-001 działa ponownie             │
   │ Mechanik: Jan Kowalski              │
   │ Czas naprawy: 24 minuty             │
   │ [Pokaż raport]                      │
   └─────────────────────────────────────┘
```

**Dashboard operatora (real-time update):**
```
📊 Dashboard:
   ┌─────────────────────────────────────┐
   │ Statystyki dnia                     │
   │                                     │
   │ ✅ Ukończone: 12 (+1) ← właśnie!    │
   │ 🔄 W trakcie: 3                     │
   │ 🆕 Nowe: 2                          │
   │                                     │
   │ ⚡ Średni czas reakcji: 0.5 min     │
   │ ⏱️ Średni czas naprawy: 24 min      │
   └─────────────────────────────────────┘
```

---

## 🎨 Typy powiadomień w Maintly

### **1. 🚨 PILNA AWARIA (czerwone, priorytet wysoki):**

```
┌─────────────────────────────────────┐
│ 🚨 Maintly - PILNA AWARIA!          │
│ CNC-001 - Silnik dymi!              │
│ Temperatura: 95°C (krytyczne!)      │
│                                     │
│ [Przyjmij natychmiast] [Zobacz]     │
└─────────────────────────────────────┘

Wibracja: 300ms-200ms-300ms-200ms-300ms (intensywna!)
Dźwięk: Alarm (głośny)
requireInteraction: true (nie zniknie samo!)
Badge: Czerwona kropka
```

**Kiedy wysyłane:**
- Priorytet = KRYTYCZNY / PILNY
- Awaria maszyny produkcyjnej
- Zagrożenie bezpieczeństwa

---

### **2. 📋 PRZYPISANO ZLECENIE (niebieskie, priorytet średni):**

```
┌─────────────────────────────────────┐
│ 📋 Maintly - Nowe zlecenie dla Ciebie│
│ Wymiana filtra - Pompa #5           │
│ Priorytet: Normalny                 │
│                                     │
│ [Przyjmij] [Odrzuć] [Zobacz]        │
└─────────────────────────────────────┘

Wibracja: 200ms-100ms-200ms (średnia)
Dźwięk: Standardowy
requireInteraction: false
Badge: Niebieska kropka
```

**Kiedy wysyłane:**
- Zlecenie przypisane do konkretnego mechanika
- Priorytet = NORMALNY / ŚREDNI
- Konserwacja planowana

---

### **3. ⏰ PRZYPOMNIENIE (żółte, priorytet niski):**

```
┌─────────────────────────────────────┐
│ ⏰ Maintly - Przypomnienie          │
│ Zlecenie WO-123 oczekuje od 2h      │
│                                     │
│ [Zobacz szczegóły]                  │
└─────────────────────────────────────┘

Wibracja: 100ms (delikatna)
Dźwięk: Ciche "ding"
requireInteraction: false
Badge: Żółta kropka
```

**Kiedy wysyłane:**
- Zlecenie nieprzypisane > 1h
- Zlecenie "W trakcie" > 4h bez aktualizacji
- Przypomnienie o planowanej konserwacji

---

### **4. ✅ ZLECENIE UKOŃCZONE (zielone, informacyjne):**

```
┌─────────────────────────────────────┐
│ ✅ Maintly - Zlecenie zamknięte     │
│ Jan Kowalski ukończył WO-123        │
│ CNC-001 działa ponownie             │
│                                     │
│ [Pokaż raport] [OK]                 │
└─────────────────────────────────────┘

Wibracja: brak
Dźwięk: Ciche "success"
requireInteraction: false
Badge: brak (usuwa badge)
```

**Kiedy wysyłane:**
- Zlecenie zmienione na "Ukończone"
- Odbiorca: Operator + Manager
- Informacyjne (nie wymaga akcji)

---

### **5. 👥 NOWY KOMENTARZ (szare, informacyjne):**

```
┌─────────────────────────────────────┐
│ 💬 Maintly - Nowy komentarz         │
│ Jan Kowalski: "Potrzebuję filtra A5"│
│ Zlecenie: WO-123                    │
│                                     │
│ [Odpowiedz] [Zobacz]                │
└─────────────────────────────────────┘

Wibracja: 100ms
Dźwięk: Ciche "ding"
requireInteraction: false
```

**Kiedy wysyłane:**
- Nowy komentarz w zleceniu
- Odbiorca: Przypisany mechanik + Operator
- Komunikacja w zespole

---

### **6. 📊 RAPORT DZIENNY (białe, informacyjne):**

```
┌─────────────────────────────────────┐
│ 📊 Maintly - Raport dzienny         │
│ Dzisiaj ukończyłeś 8 zleceń         │
│ Średni czas: 32 minuty              │
│                                     │
│ [Pokaż statystyki]                  │
└─────────────────────────────────────┘

Wibracja: brak
Dźwięk: brak
requireInteraction: false
```

**Kiedy wysyłane:**
- Codziennie o 16:00 (koniec zmiany)
- Odbiorca: Każdy mechanik
- Podsumowanie dnia

---

## 💎 Zaawansowane funkcje

### **1. Badge na ikonie aplikacji (licznik):**

```
📱 Ekran główny telefonu:

┌──────┐  ┌──────┐  ┌──────┐
│ 📧   │  │ 💬   │  │ 🔧   │
│Gmail │  │Slack │  │Maintly│ (3) ← licznik!
└──────┘  └──────┘  └──────┘

navigator.setAppBadge(3) // 3 nieprzeczytane zlecenia
```

**Automatyka:**
- Nowe zlecenie → badge++
- Otworzysz zlecenie → badge--
- Ukończysz wszystkie → badge znika

---

### **2. Grupowanie powiadomień (batch):**

```
Zamiast 10 osobnych powiadomień:
   ❌ [Maintly] Nowe zlecenie WO-1
   ❌ [Maintly] Nowe zlecenie WO-2
   ❌ [Maintly] Nowe zlecenie WO-3
   ... (spam!)

Jedno zgrupowane:
   ✅ ┌─────────────────────────────────────┐
      │ 🔔 Maintly                          │
      │ 10 nowych zleceń                    │
      │ • WO-1: CNC-001 - Awaria            │
      │ • WO-2: CNC-002 - Konserwacja       │
      │ • WO-3: Pompa #5 - Wycieki          │
      │ • ... i 7 więcej                    │
      │                                     │
      │ [Zobacz wszystkie]                  │
      └─────────────────────────────────────┘
```

**Implementacja:**
```typescript
const options = {
  tag: 'work-orders', // ← Ten sam tag
  renotify: true,     // Wibracja ponownie
  badge: '/icons/badge.png'
}
```

---

### **3. Rich media (obrazki, zdjęcia, mapa):**

```
┌─────────────────────────────────────┐
│ 🚨 Maintly - PILNA AWARIA!          │
│ CNC-001 - Silnik dymi               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Zdjęcie dymiącej maszyny]      │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📍 Hala A, stanowisko 5             │
│                                     │
│ [Przyjmij] [🗺️ Nawiguj] [Zobacz]   │
└─────────────────────────────────────┘
```

**Możliwości:**
- Zdjęcia maszyn (operator dodaje przy tworzeniu zlecenia)
- Mapa hali (kliknięcie otwiera Google Maps / plan hali)
- QR kody (szybkie skanowanie części)

---

### **4. Akcje w powiadomieniu (bez otwierania app!):**

```
┌─────────────────────────────────────┐
│ 📋 Maintly - Nowe zlecenie          │
│ Wymiana filtra - Pompa #5           │
│                                     │
│ [✅ Przyjmij]                        │ ← Wywołuje API
│ [❌ Odrzuć]                          │ ← Wywołuje API
│ [👁️ Zobacz]                         │ ← Otwiera app
│ [📞 Zadzwoń do operatora]           │ ← Otwiera telefon
│ [🗺️ Nawiguj GPS do maszyny]        │ ← Otwiera Google Maps
│ [📸 Zobacz zdjęcie awarii]          │ ← Otwiera galerię
└─────────────────────────────────────┘
```

**Przykład custom akcji:**
```typescript
actions: [
  {
    action: 'accept',
    title: '✅ Przyjmij',
    icon: '/icons/check.png'
  },
  {
    action: 'call',
    title: '📞 Zadzwoń',
    icon: '/icons/phone.png'
  },
  {
    action: 'navigate',
    title: '🗺️ Nawiguj',
    icon: '/icons/map.png'
  }
]
```

---

### **5. Priorytetyzacja (urgent vs normal):**

```typescript
// PILNA AWARIA
const urgentOptions = {
  priority: 'high',
  requireInteraction: true,  // Nie zniknie!
  vibrate: [300, 200, 300, 200, 300],
  silent: false,
  tag: 'urgent-' + workOrderId
}

// NORMALNE ZLECENIE
const normalOptions = {
  priority: 'default',
  requireInteraction: false, // Zniknie po 5 sek
  vibrate: [200, 100, 200],
  silent: false,
  tag: 'normal-' + workOrderId
}
```

---

### **6. Persistent notification (nie znika automatycznie):**

```typescript
// KRYTYCZNA AWARIA - musi być obsłużona!
const criticalOptions = {
  requireInteraction: true, // ← nie zniknie dopóki nie klikniesz!
  priority: 'urgent',
  vibrate: [500, 300, 500, 300, 500],
  renotify: true,           // Co 5 min ponowna wibracja
  silent: false
}
```

**Use case:**
- Awaria krytyczna (zagrożenie bezpieczeństwa)
- Wymagana natychmiastowa akcja
- Nie może być ignorowana

---

## 🛠️ Architektura techniczna

### **Stack technologiczny:**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TS)                 │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ NotificationService.ts                           │  │
│  │ - requestPermission()                            │  │
│  │ - subscribeToPush()                              │  │
│  │ - sendSubscriptionToBackend()                    │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Service Worker (service-worker.ts)               │  │
│  │ - addEventListener('push')                       │  │
│  │ - addEventListener('notificationclick')          │  │
│  │ - showNotification()                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP POST /api/push-subscriptions
                          ↕ WebSocket (real-time updates)
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Symfony 7)                     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ WebPushNotificationService                       │  │
│  │ - sendToUser(userId, payload)                    │  │
│  │ - sendToRole(role, payload)                      │  │
│  │ - queueNotification()                            │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ minishlink/web-push (PHP library)                │  │
│  │ - WebPush::sendOneNotification()                 │  │
│  │ - VAPID authentication                           │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ PushSubscription Entity (Doctrine)               │  │
│  │ - id, userId, endpoint, publicKey, authToken     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌─────────────────────────────────────────────────────────┐
│              PUSH SERVICE PROVIDER                       │
│                                                          │
│  • Google Firebase Cloud Messaging (FCM)                │
│  • Mozilla Push Service                                 │
│  • Apple Push Notification Service (APNs)               │
│  • Windows Push Notification Services (WNS)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  URZĄDZENIE UŻYTKOWNIKA                  │
│                                                          │
│  📱 Telefon / 💻 Laptop / 📟 Tablet                     │
│  Natywne powiadomienie systemowe                        │
└─────────────────────────────────────────────────────────┘
```

---

### **Flow wysyłania powiadomienia:**

```
1. Operator tworzy zlecenie
   ↓
2. CreateWorkOrderHandler zapisuje do MySQL
   ↓
3. Event: WorkOrderCreatedEvent
   ↓
4. EventListener: SendPushNotificationListener
   ↓
5. WebPushNotificationService:
   - Pobiera subskrypcje mechaników z bazy
   - Tworzy payload JSON
   - Wywołuje minishlink/web-push
   ↓
6. VAPID authentication (klucze publiczny/prywatny)
   ↓
7. HTTPS request do Push Service Provider (FCM/Mozilla/Apple)
   ↓
8. Push Service wysyła do urządzenia
   ↓
9. Service Worker na urządzeniu łapie event 'push'
   ↓
10. showNotification() wyświetla powiadomienie
   ↓
11. Użytkownik klika → notificationclick event
   ↓
12. Service Worker wywołuje API lub otwiera aplikację
```

---

### **Baza danych - Tabela push_subscriptions:**

```sql
CREATE TABLE push_subscriptions (
    id CHAR(36) PRIMARY KEY,           -- UUID
    user_id CHAR(36) NOT NULL,         -- FK do users
    endpoint VARCHAR(500) NOT NULL,    -- URL subskrypcji
    public_key TEXT NOT NULL,          -- p256dh (encryption key)
    auth_token TEXT NOT NULL,          -- auth secret
    created_at DATETIME NOT NULL,
    UNIQUE KEY unique_endpoint (endpoint),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Przykładowe dane:**
```
id: 550e8400-e29b-41d4-a716-446655440000
user_id: 123e4567-e89b-12d3-a456-426614174000
endpoint: https://fcm.googleapis.com/fcm/send/abc123...
public_key: BNlxkk9...
auth_token: xYz789...
created_at: 2025-03-15 10:00:00
```

---

### **VAPID Keys (Voluntary Application Server Identification):**

```bash
# Generowanie kluczy (robisz RAZ!)
php bin/console app:generate-vapid-keys

# Output:
Public Key:  BNxxx... (64 znaki base64)
Private Key: abc123... (43 znaki base64)
```

**Dodaj do .env:**
```bash
VAPID_PUBLIC_KEY="BNxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VAPID_PRIVATE_KEY="abcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VAPID_SUBJECT="mailto:admin@maintly.com"
```

**Bezpieczeństwo:**
- ✅ Public key → frontend (jawny, można zobaczyć)
- 🔒 Private key → backend TYLKO! (tajny, nigdy nie wysyłaj!)
- 🔒 Private key → .env + .gitignore

---

## 📊 Statystyki i metryki

### **Dashboard admin - Monitoring push notifications:**

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Push Notifications - Statystyki (ostatnie 24h)      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Wysłane:           245 powiadomień                      │
│ Dostarczone:       242 (98.8%)                          │
│ Kliknięte:         189 (77.1%)                          │
│ Zignorowane:        53 (21.6%)                          │
│ Błędy:               3 (1.2%)                           │
│                                                         │
│ Średni czas reakcji:  42 sekundy                        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Wykres: Powiadomienia vs czas reakcji               ││
│ │     [Chart.js line chart]                           ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Top mechanicy (najszybsza reakcja):                     │
│ 1. Jan Kowalski     - 18 sek śr.  (23 zlecenia)        │
│ 2. Anna Nowak       - 35 sek śr.  (18 zleceń)          │
│ 3. Piotr Wiśniewski - 52 sek śr.  (15 zleceń)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Metryki które możesz śledzić:**
- Delivery rate (% dostarczonych)
- Click-through rate (% klikniętych)
- Average response time (średni czas reakcji)
- Bounce rate (% nieaktywnych subskrypcji)
- Per-user engagement (zaangażowanie per użytkownik)

---

## 🚀 Implementacja krok po kroku

### **Timeline: ~8 godzin total**

#### **Weekend 8-9.03.2026 (Sobota - Backend):**

**1. Instalacja pakietu (~10 min):**
```bash
composer require minishlink/web-push
```

**2. Generowanie VAPID keys (~5 min):**
```bash
php bin/console app:generate-vapid-keys
# Dodaj do .env
```

**3. Entity + Migration (~30 min):**
```bash
php bin/console make:entity PushSubscription
# Pola: id, userId, endpoint, publicKey, authToken, createdAt
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

**4. Repository (~20 min):**
```php
// DoctrinePushSubscriptionRepository
- save(PushSubscription)
- findByUserId(string)
- findByRole(string)
- delete(PushSubscription)
```

**5. Service - WebPushNotificationService (~90 min):**
```php
- sendToUser(userId, payload)
- sendToRole(role, payload)
- queueNotification()
- handleFailures()
```

**6. Controller - API endpoint (~30 min):**
```php
POST /api/push-subscriptions
- Zapisuje subskrypcję użytkownika
- Walidacja
- Response
```

**7. Event Listener (~45 min):**
```php
SendPushNotificationOnWorkOrderCreated
- Łapie WorkOrderCreatedEvent
- Wywołuje WebPushNotificationService
- Wysyła push do mechaników
```

**Podsumowanie soboty: ~4h backend ✅**

---

#### **Weekend 8-9.03.2026 (Niedziela - Frontend):**

**1. NotificationService.ts (~60 min):**
```typescript
- requestPermission()
- subscribeToPush()
- sendSubscriptionToBackend()
- urlBase64ToUint8Array()
```

**2. Service Worker - Push listener (~90 min):**
```typescript
self.addEventListener('push', (event) => {
  const data = event.data.json()
  showNotification(data.title, options)
})
```

**3. Service Worker - Click listener (~60 min):**
```typescript
self.addEventListener('notificationclick', (event) => {
  // Obsługa akcji (Przyjmij/Zobacz)
  // Wywołanie API
  // Otwarcie aplikacji
})
```

**4. React component - Request permission (~30 min):**
```typescript
useEffect(() => {
  if (isAuthenticated) {
    notificationService.requestPermission()
    notificationService.subscribeToPush()
  }
}, [isAuthenticated])
```

**5. Testowanie (~30 min):**
```bash
# Wyślij testowe powiadomienie z Postman/curl
curl -X POST https://localhost/api/test-push \
  -H "Authorization: Bearer $TOKEN"
```

**Podsumowanie niedzieli: ~4h frontend ✅**

---

### **TOTAL: ~8h (4h backend + 4h frontend)**

---

## 🎯 Korzyści biznesowe

### **Dla firmy produkcyjnej:**

**1. Redukcja przestojów:**
```
Bez push: Średni czas reakcji 30 min
Z push:   Średni czas reakcji 30 sek
Redukcja: 95% (29.5 minuty oszczędzone!)
```

**2. ROI (Return on Investment):**
```
Koszt implementacji: 8h × 100 zł/h = 800 zł

Oszczędności miesięczne:
- 10 awarii/miesiąc
- Każda awaria: 30 min oszczędności
- Koszt przestoju: 2000 zł/h
- Oszczędność per awaria: 1000 zł
= 10 000 zł/miesiąc

ROI: (10 000 - 800) / 800 × 100% = 1150%
Zwrot w: 0.08 miesiąca = 2.4 dnia! 🚀
```

**3. Zwiększona produktywność:**
```
Mechanicy nie muszą:
❌ Sprawdzać aplikacji co 10 min
❌ Odświeżać strony
❌ Pytać operatora "Są nowe zlecenia?"

✅ Dostają powiadomienia automatycznie
✅ Reagują natychmiast
✅ Mają więcej czasu na naprawy
```

**4. Lepsza komunikacja:**
```
✅ Real-time updates dla wszystkich
✅ Przejrzystość (kto przyjął zlecenie)
✅ Logi i audyt (kto, kiedy, co)
✅ Statystyki wydajności
```

**5. Konkurencyjna przewaga:**
```
Większość CMMS NIE MA push notifications!

Twoja firma:
✅ Innowacyjna
✅ Nowoczesna
✅ Efektywna
→ Lepsza pozycja na rynku
```

---

### **Dla mechaników:**

**1. Wygoda:**
```
✅ Nie musisz sprawdzać aplikacji
✅ Powiadomienia przychodzą same
✅ Możesz reagować bez otwierania app
✅ Priorytetyzacja (pilne vs normalne)
```

**2. Mniej stresu:**
```
✅ Nie przegapisz pilnej awarii
✅ Wiesz co jest priorytetem
✅ Widzisz kto już przyjął zlecenie
✅ Badge licznik = kontrola nad zadaniami
```

**3. Lepsza organizacja:**
```
✅ Historia powiadomień (wracasz później)
✅ Przypomnienia (nie zapomnisz)
✅ Grupowanie (przejrzystość)
```

---

### **Dla operatorów:**

**1. Kontrola:**
```
✅ Widzisz kto dostał powiadomienie
✅ Widzisz kto zareagował
✅ Śledzisz czas reakcji
✅ Statystyki wydajności mechaników
```

**2. Eskalacja:**
```
✅ Jeśli nikt nie reaguje → przypomnienie
✅ Jeśli pilne → wysyłka do managera
✅ Jeśli krytyczne → SMS backup (opcja)
```

**3. Raportowanie:**
```
✅ Średni czas reakcji
✅ Delivery rate powiadomień
✅ Engagement mechaników
✅ Trendy (godziny szczytu awarii)
```

---

## 🔒 Bezpieczeństwo i prywatność

### **1. VAPID Authentication:**
```
✅ Klucze publiczny/prywatny
✅ Weryfikacja nadawcy
✅ Nie można podszyć się pod backend
```

### **2. Szyfrowanie end-to-end:**
```
✅ Payload szyfrowany (public_key/auth_token)
✅ HTTPS required
✅ Push Service nie widzi treści
```

### **3. Kontrola użytkownika:**
```
✅ Użytkownik musi dać zgodę (browser prompt)
✅ Może odwołać zgodę w każdej chwili
✅ Może wypisać się z subskrypcji
```

### **4. RODO compliance:**
```
✅ Dane subskrypcji to PII (Personal Identifiable Information)
✅ Usuń po usunięciu konta użytkownika
✅ Export danych (GDPR right to data portability)
✅ Opt-out w każdej chwili
```

---

## 📱 Kompatybilność przeglądarek

### **Wspierane:**

| Przeglądarka | Desktop | Android | iOS |
|--------------|---------|---------|-----|
| **Chrome** | ✅ v50+ | ✅ v50+ | ❌ (używa Safari) |
| **Edge** | ✅ v79+ | ✅ v79+ | ❌ |
| **Firefox** | ✅ v44+ | ✅ v48+ | ❌ |
| **Safari** | ✅ v16+ | ❌ | ✅ v16.4+ |
| **Opera** | ✅ v37+ | ✅ v37+ | ❌ |
| **Samsung Internet** | — | ✅ v4+ | — |

**Uwagi:**
- ✅ **iOS 16.4+** - Apple w końcu dodało support! (2023)
- ✅ **Desktop** - pełne wsparcie we wszystkich głównych przeglądarkach
- ✅ **Android** - doskonałe wsparcie (Chrome/Firefox/Samsung)

**Fallback dla starszych przeglądarek:**
```typescript
if ('Notification' in window && 'serviceWorker' in navigator) {
  // ✅ Push Notifications supported
  enablePushNotifications()
} else {
  // ❌ Fallback: WebSocket live updates
  enableWebSocketPolling()
}
```

---

## 🧪 Testowanie

### **1. Testowanie manualne:**

**Scenario 1: Pierwszy raz (request permission):**
```
1. Otwórz aplikację w przeglądarce
2. Zaloguj się
3. Sprawdź popup: "Maintly chce wysyłać powiadomienia"
4. Kliknij "Zezwól"
5. Sprawdź DevTools:
   - Application → Service Workers (powinien być registered)
   - Application → Storage → IndexedDB (subscription zapisana)
```

**Scenario 2: Wysyłka testowa:**
```
1. Backend: Wywołaj endpoint
   POST /api/test-push
   Authorization: Bearer {token}

2. Frontend: Sprawdź powiadomienie
   - Telefon: Powinno się wyświetlić
   - Desktop: Prawy dolny róg

3. Kliknij powiadomienie:
   - Aplikacja się otwiera
   - Przechodzi do właściwego ekranu
```

**Scenario 3: Offline:**
```
1. Włącz Airplane Mode
2. Wyślij powiadomienie z backendu
3. Push Service przetrzyma (do 4 tygodni)
4. Wyłącz Airplane Mode
5. Powiadomienie dotrze z opóźnieniem
```

**Scenario 4: Akcje w powiadomieniu:**
```
1. Wyślij powiadomienie z akcjami ("Przyjmij", "Zobacz")
2. Kliknij "Przyjmij" BEZ otwierania aplikacji
3. Sprawdź:
   - API wywołane (sprawdź logi backendu)
   - Status zlecenia zmieniony
   - WebSocket update wysłany
```

---

### **2. Testowanie automatyczne (opcjonalne):**

**Backend (PHPUnit):**
```php
class WebPushNotificationServiceTest extends TestCase
{
    public function testSendToUser(): void
    {
        $service = new WebPushNotificationService(...);
        $result = $service->sendToUser('user-123', [
            'title' => 'Test',
            'message' => 'Hello'
        ]);
        
        $this->assertTrue($result->isSuccess());
    }
}
```

**Frontend (Vitest - opcjonalnie):**
```typescript
describe('NotificationService', () => {
  it('should request permission', async () => {
    const service = new NotificationService()
    const permission = await service.requestPermission()
    expect(permission).toBe(true)
  })
})
```

---

## 🐛 Troubleshooting

### **Problem: Nie dostają powiadomienia**

**Checklist:**
```
1. ✅ HTTPS włączone? (lub localhost)
2. ✅ Service Worker zarejestrowany?
   - DevTools → Application → Service Workers
3. ✅ Permission granted?
   - DevTools → Application → Storage → Permissions
4. ✅ Subscription zapisana w bazie?
   - SELECT * FROM push_subscriptions WHERE user_id='...'
5. ✅ VAPID keys poprawne?
   - .env VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
6. ✅ Endpoint aktywny?
   - Testuj: curl -X POST $endpoint
7. ✅ Firewall nie blokuje?
   - Sprawdź port 443 (HTTPS)
```

---

### **Problem: "Failed to subscribe"**

**Możliwe przyczyny:**
```
❌ Brak HTTPS (tylko localhost wyjątek)
   → Deploy z SSL/HTTPS

❌ Service Worker nie działa
   → Sprawdź console errors
   → DevTools → Application → Service Workers → Status

❌ Public key nieprawidłowy
   → Sprawdź .env VAPID_PUBLIC_KEY
   → Musi być base64 (64 znaki)

❌ Browser nie wspiera
   → Sprawdź: 'Notification' in window
   → Zaktualizuj przeglądarkę
```

---

### **Problem: Powiadomienia nie klikalne**

**Rozwiązanie:**
```typescript
// Upewnij się że:
self.addEventListener('notificationclick', (event) => {
  event.notification.close() // ← Zamknij powiadomienie!
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url) // ← Otwórz app
  )
})
```

---

### **Problem: Duplikaty powiadomień**

**Rozwiązanie - użyj tag:**
```typescript
const options = {
  tag: 'work-order-' + workOrderId, // ← Unique tag
  renotify: false                   // ← Nie wibruj ponownie
}
```

---

## 📚 Resources & Linki

### **Dokumentacja:**
- [Web Push API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notification API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
- [Service Workers - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [minishlink/web-push - GitHub](https://github.com/web-push-libs/web-push-php)
- [VAPID Spec - RFC8292](https://datatracker.ietf.org/doc/html/rfc8292)

### **Narzędzia:**
- [Web Push Testing - Chrome DevTools](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [VAPID Key Generator Online](https://vapidkeys.com/)
- [Push Companion - Testing Tool](https://web-push-codelab.glitch.me/)

### **Tutorials:**
- [Google Codelabs - Push Notifications](https://codelabs.developers.google.com/codelabs/push-notifications)
- [Matt Gaunt - Web Push Book](https://web-push-book.gauntface.com/)

---

## ✅ Checklist implementacji

### **Backend (Symfony):**
- [ ] Zainstaluj `minishlink/web-push`
- [ ] Wygeneruj VAPID keys
- [ ] Dodaj keys do `.env` (i `.env.local`)
- [ ] Stwórz Entity `PushSubscription`
- [ ] Migracja `doctrine:migrations:migrate`
- [ ] Stwórz Repository `PushSubscriptionRepositoryInterface`
- [ ] Stwórz Service `WebPushNotificationService`
- [ ] Stwórz Controller `POST /api/push-subscriptions`
- [ ] Stwórz EventListener `SendPushNotificationOnWorkOrderCreated`
- [ ] Przetestuj endpoint `/api/test-push`

### **Frontend (React + TypeScript):**
- [ ] Stwórz `NotificationService.ts`
- [ ] Dodaj VAPID public key do `.env.local` (VITE_VAPID_PUBLIC_KEY)
- [ ] Zmodyfikuj `service-worker.ts` → add `push` listener
- [ ] Zmodyfikuj `service-worker.ts` → add `notificationclick` listener
- [ ] Dodaj request permission w `App.tsx` (useEffect)
- [ ] Przetestuj na telefonie (HTTPS required!)
- [ ] Przetestuj akcje w powiadomieniu
- [ ] Przetestuj badge licznik

### **Testing:**
- [ ] Test 1: Request permission (popup)
- [ ] Test 2: Subscribe (zapisane w bazie)
- [ ] Test 3: Wyślij testowe powiadomienie
- [ ] Test 4: Kliknij powiadomienie (otwiera app)
- [ ] Test 5: Akcje ("Przyjmij", "Zobacz")
- [ ] Test 6: Badge licznik
- [ ] Test 7: Offline (Airplane Mode)
- [ ] Test 8: Grupowanie (10 powiadomień naraz)

### **Deploy:**
- [ ] HTTPS włączone (SSL certificate)
- [ ] VAPID keys w produkcji (.env production)
- [ ] Firewall (port 443 otwarty)
- [ ] Monitoring (logs push failures)
- [ ] Dokumentacja dla użytkowników (jak włączyć powiadomienia)

---

## 🎓 Na obronę inżynierki

### **Demo scenariusz (5 minut WOW effect!):**

**Setup:**
- Laptop (projektor) - aplikacja operatora
- Telefon (pokaż publiczności) - aplikacja mechanika

**Live demo:**

**1. (30 sek)** - Pokazujesz telefon: "To mój telefon, aplikacja Maintly zainstalowana"

**2. (30 sek)** - Na laptopie: "Jestem operatorem, tworzę pilną awarię..."
   - Formularz: "CNC-001 - Przegrzanie silnika"
   - Klik "Zapisz"

**3. (10 sek)** - **DING!** Telefon wibruje!
   - Pokazujesz publiczności: "Powiadomienie przyszło NATYCHMIAST!"
   - Widoczne na ekranie: "🚨 PILNA AWARIA!"

**4. (20 sek)** - Klikasz "Przyjmij zlecenie" na telefonie

**5. (20 sek)** - Laptop (AUTOMATYCZNIE!):
   - Lista odświeża się (WebSocket real-time)
   - Widać: "Jan Kowalski przyjął zlecenie"
   - **Komisja: "Wow! 😲"**

**6. (30 sek)** - Telefon: Wyłączasz Wi-Fi (Airplane Mode)
   - "Aplikacja działa offline!"
   - Zmieniasz status na "Ukończone"

**7. (30 sek)** - Włączasz Wi-Fi
   - "Automatyczny sync..."
   - Laptop: Update w czasie rzeczywistym!

**8. (1 min)** - Pokazujesz dashboard:
   - Statystyki (czas reakcji: 30 sek)
   - Wykres powiadomień
   - ROI: "Oszczędność 120 000 zł rocznie!"

**TOTAL: 4 minuty**

**Komisja:**
- ✅ Widzieli live real-time synchronizację
- ✅ Widzieli push notification na żywo
- ✅ Widzieli offline mode
- ✅ Widzieli business value (ROI)

**= Ocena 5.0! 🎓🔥**

---

## 🚀 Podsumowanie

### **Push Notifications w Maintly = Absolutny MUST-HAVE!**

**Dlaczego?**
1. ✅ **Game changer** dla CMMS (większość nie ma!)
2. ✅ **WOW effect** na obronie
3. ✅ **Realny ROI** (oszczędności dla firmy)
4. ✅ **Łatwa implementacja** (~8h)
5. ✅ **Standard Web API** (działa wszędzie!)
6. ✅ **Innowacyjne** (pokazujesz nowoczesne technologie)

**Timeline:**
- ❌ Grudzień 2025: Pomiń (przedmiot - za dużo roboty)
- ✅ **Marzec 2026: MUST HAVE!** (inżynierka - 8h well spent!)

**Efekt końcowy:**
Mechanik dostaje awarię na telefon (nawet zablokowany!), klika "Przyjmij" bez otwierania aplikacji, wszyscy widzą update w czasie rzeczywistym. **Czas reakcji: 30 sekund zamiast 30 minut!** 🚀

---

> **Maintly Push Notifications** — Real-time, Real results! 💪🔔
