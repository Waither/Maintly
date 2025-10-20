# 🖥️ Desktop Notifications - Powiadomienia na komputerze (Windows/macOS/Linux)

> **TL;DR:** TAK! Push notifications działają IDENTYCZNIE na komputerze jak na telefonie! Dyrektor techniczny dostaje natywne powiadomienia Windows/macOS nawet gdy przeglądarka jest zminimalizowana!

---

## 📋 Spis treści

- [Czym są Desktop Notifications](#-czym-są-desktop-notifications)
- [Jak to wygląda na różnych systemach](#-jak-to-wygląda-na-różnych-systemach)
- [Scenariusz: Krytyczna awaria dla dyrektora](#-scenariusz-krytyczna-awaria-dla-dyrektora)
- [Różnice: Telefon vs Desktop](#-różnice-telefon-vs-desktop)
- [Architektura techniczna](#-architektura-techniczna)
- [Implementacja](#-implementacja)
- [⏰ TTL - Nie wysyłaj starych powiadomień](#-ttl---nie-wysyłaj-starych-powiadomień)
- [Zaawansowane funkcje](#-zaawansowane-funkcje)
- [Konfiguracja per rola](#-konfiguracja-per-rola)
- [Demo na obronę](#-demo-na-obronę)

---

## 🎯 Czym są Desktop Notifications?

### **To te same Push Notifications, ale na komputerze!**

**Identyczna technologia:**
- Web Push API (standard W3C)
- Service Workers (działają w tle)
- Native OS notifications (Windows/macOS/Linux)

**Działają:**
- ✅ Gdy przeglądarka jest **ZMINIMALIZOWANA**
- ✅ Gdy przeglądarka jest **W TLE**
- ✅ Gdy pracujesz w **INNYM PROGRAMIE** (Excel, Word, CAD)
- ✅ Nawet gdy komputer jest **ZABLOKOWANY** (Windows lock screen)

**NIE działają:**
- ❌ Gdy przeglądarka jest **CAŁKOWICIE ZAMKNIĘTA** (ale to rzadkość - ludzie mają otwarte 20 zakładek)
- ❌ Gdy system jest **WYŁĄCZONY** (oczywiste)

---

## 🖥️ Jak to wygląda na różnych systemach?

### **1. Windows 10/11 - Notification Center**

```
┌─────────────────────────────────────────────────────┐
│ Windows Notification (prawy dolny róg)             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🚨 Maintly                             [×]        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  KRYTYCZNA AWARIA - ZATRZYMANA LINIA!              │
│  CNC-001 - Awaria głównego silnika                 │
│  Szacowane straty: 5000 zł/h                       │
│                                                     │
│  [Zobacz szczegóły]  [Powiadom zespół]             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Cechy Windows:**
- Pojawia się w **prawym dolnym rogu**
- Po kilku sekundach przechodzi do **Action Center** (ikona dzwonka w pasku zadań)
- Może mieć **dźwięk systemowy** (customizowany)
- Może wyświetlać **obrazki** (np. foto awarii)
- Działa nawet na **lock screen** (zablokowanym ekranie)

---

### **2. macOS - Notification Center**

```
╔═════════════════════════════════════════════════════╗
║ macOS Notification (prawy górny róg)               ║
╠═════════════════════════════════════════════════════╣
║                                                     ║
║  🚨 Maintly                          10:00         ║
║  ───────────────────────────────────────────────   ║
║                                                     ║
║  KRYTYCZNA AWARIA - ZATRZYMANA LINIA!              ║
║  CNC-001 - Awaria głównego silnika                 ║
║  Szacowane straty: 5000 zł/h                       ║
║                                                     ║
║  Opcje:                                            ║
║  • Zobacz szczegóły                                ║
║  • Powiadom zespół                                 ║
║                                                     ║
╚═════════════════════════════════════════════════════╝
```

**Cechy macOS:**
- Pojawia się w **prawym górnym rogu**
- Przechodzi do **Notification Center** (ikona w menu bar)
- Może mieć **dźwięk systemowy**
- Integracja z **Apple Watch** (jeśli dyrektor ma)
- Może wyświetlać **rich media** (obrazki, inline actions)

---

### **3. Linux (Ubuntu/Fedora) - GNOME Notifications**

```
┌─────────────────────────────────────────────────────┐
│ GNOME Notification (górna krawędź)                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🚨 Maintly                                        │
│  KRYTYCZNA AWARIA - ZATRZYMANA LINIA!              │
│  CNC-001 - Awaria głównego silnika                 │
│                                                     │
│  [Zobacz]  [Powiadom zespół]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Cechy Linux:**
- Pojawia się na **górnej krawędzi** (GNOME) lub w rogu (KDE)
- Integracja z **libnotify** (natywne powiadomienia)
- Dźwięk systemowy
- Akcje inline

---

## 🎯 Scenariusz: Krytyczna awaria dla Dyrektora Technicznego

### **Krok po kroku - jak to działa w praktyce:**

---

### **1️⃣ Setup (jednorazowo):**

**Dyrektor techniczny loguje się do Maintly (przeglądarka Chrome/Edge):**
```
https://maintly.firma.pl/login
   ↓
Po zalogowaniu:
┌─────────────────────────────────────────────────────┐
│ Maintly chce wysyłać powiadomienia                 │
│                                                     │
│ Czy chcesz otrzymywać powiadomienia o ważnych      │
│ zdarzeniach nawet gdy aplikacja nie jest aktywna?  │
│                                                     │
│  [Zablokuj]  [Zezwól]                              │
└─────────────────────────────────────────────────────┘
   ↓
Klik "Zezwól"
   ↓
✅ Gotowe! Teraz będzie dostawał powiadomienia Windows!
```

---

### **2️⃣ Praca na co dzień:**

**Dyrektor pracuje w Excel, robi budżet (Maintly w tle, zminimalizowane):**

```
🖥️ Ekran dyrektora:
┌─────────────────────────────────────────────────────┐
│ Microsoft Excel - Budżet Q4 2025                   │
│ ═══════════════════════════════════════════════════ │
│                                                     │
│ | Dział     | Plan    | Wykonanie | ...            │
│ |-----------|---------|-----------|                │
│ | Produkcja | 500k    | 480k      | ...            │
│ | ...                                               │
│                                                     │
│ [Taskbar: Chrome (zminimalizowane), Excel, ...]    │
└─────────────────────────────────────────────────────┘
```

---

### **3️⃣ AWARIA! Linia produkcyjna się zatrzymała:**

**10:00:00** - CNC-001 awaria głównego silnika → cała linia stoi  
**10:00:05** - Operator tworzy zlecenie "KRYTYCZNE - Linia zatrzymana"  
**10:00:06** - Backend wykrywa: `priority: CRITICAL` + `assignedRole: ROLE_DIRECTOR`  
**10:00:07** - WebPushService wysyła push do dyrektora  

---

### **4️⃣ POWIADOMIENIE WINDOWS (prawy dolny róg):**

```
🖥️ Ekran dyrektora (pracuje w Excel):
┌─────────────────────────────────────────────────────┐
│ Microsoft Excel - Budżet Q4...                     │
│                                    ┌────────────────┴──────────────┐
│                                    │ 🚨 Maintly          [×]       │
│                                    │ ═════════════════════════════ │
│                                    │                               │
│                                    │ ⚠️ KRYTYCZNA AWARIA!          │
│                                    │ LINIA PRODUKCYJNA ZATRZYMANA │
│                                    │                               │
│                                    │ CNC-001 - Awaria silnika      │
│                                    │ Szacowane straty: 5000 zł/h   │
│                                    │                               │
│                                    │ [Zobacz]  [Powiadom zespół]   │
└────────────────────────────────────┴───────────────────────────────┘

💥 DŹWIĘK: "DING!" (krytyczny dźwięk systemowy)
🔴 Taskbar: [Chrome] ← czerwony badge (1)
```

**Co się dzieje:**
- ✅ Powiadomienie **nakłada się** na Excel
- ✅ Dźwięk **"DING!"** (głośny, krytyczny)
- ✅ Chrome w taskbarze ma **czerwony badge (1)**
- ✅ Dyrektor **natychmiast widzi** problem!

---

### **5️⃣A - Dyrektor klika "Zobacz szczegóły":**

```
Klik na powiadomienie
   ↓
Chrome automatycznie się OTWIERA (przełącza zakładkę)
   ↓
Maintly Dashboard:
┌─────────────────────────────────────────────────────┐
│ Maintly - Dashboard Dyrektora                      │
│ ═══════════════════════════════════════════════════ │
│                                                     │
│ 🚨 ALERT KRYTYCZNY                                 │
│                                                     │
│ Zlecenie: WO-001                                   │
│ Status: KRYTYCZNE - Linia zatrzymana               │
│ Maszyna: CNC-001                                   │
│ Problem: Awaria głównego silnika                   │
│ Czas trwania: 2 minuty                             │
│ Szacowane straty: 5000 zł/h × 0.03h = 150 zł      │
│                                                     │
│ Przypisani mechanicy: Jan Kowalski, Piotr Nowak   │
│                                                     │
│ [Powiadom wszystkich]  [Eskaluj]  [Raport]        │
└─────────────────────────────────────────────────────┘
```

---

### **5️⃣B - Dyrektor klika "Powiadom zespół":**

```
Klik "Powiadom zespół" (BEZPOŚREDNIO Z POWIADOMIENIA!)
   ↓
Backend wysyła push do:
- Wszyscy mechanicy (5 osób)
- Kierownik produkcji
- Manager utrzymania ruchu
   ↓
Wszyscy dostają:
┌─────────────────────────────────────────────────────┐
│ 🚨 Maintly - Dyrektor eskalował awarię!            │
│ PRIORYTET MAKSYMALNY                               │
│ CNC-001 - Linia produkcyjna zatrzymana             │
│ [Przyjmij natychmiast]                             │
└─────────────────────────────────────────────────────┘
```

---

### **6️⃣ Monitorowanie w czasie rzeczywistym:**

**Dyrektor ma otwarty dashboard (WebSocket real-time):**

```
┌─────────────────────────────────────────────────────┐
│ Maintly - Live Dashboard                           │
│ ═══════════════════════════════════════════════════ │
│                                                     │
│ ⏱️ AWARIA W TRAKCIE: 5 minut                       │
│                                                     │
│ 10:00:30 - Jan Kowalski przyjął zlecenie          │
│ 10:01:15 - Jan dotarł do maszyny                  │
│ 10:02:00 - Diagnoza: spalony bezpiecznik 50A      │
│ 10:02:30 - Wymiana bezpiecznika w trakcie...     │
│ 10:04:45 - ✅ Naprawa ukończona!                  │
│ 10:05:00 - Linia produkcyjna wznowiona           │
│                                                     │
│ Całkowity czas przestoju: 5 minut                  │
│ Straty finansowe: 417 zł (zamiast 5000 zł/h!)     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**+ Powiadomienie końcowe:**
```
┌─────────────────────────────────────────────────────┐
│ ✅ Maintly - Awaria rozwiązana                     │
│ CNC-001 działa ponownie                            │
│ Czas przestoju: 5 minut                            │
│ Straty: 417 zł (oszczędność 95%!)                  │
│ [Zobacz raport]                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Różnice: Telefon vs Desktop

| Cecha | 📱 Telefon | 🖥️ Desktop |
|-------|-----------|-----------|
| **Działa gdy app zamknięta** | ✅ TAK | ⚠️ Tylko gdy przeglądarka otwarta (ale zminimalizowana OK) |
| **Działa na lock screen** | ✅ TAK | ✅ TAK (Windows/macOS) |
| **Akcje w powiadomieniu** | ✅ TAK | ✅ TAK |
| **Rich media (obrazki)** | ✅ TAK | ✅ TAK |
| **Badge licznik** | ✅ TAK (na ikonie) | ✅ TAK (na zakładce + taskbar) |
| **Dźwięk systemowy** | ✅ TAK | ✅ TAK (customizowany) |
| **Grupowanie** | ✅ TAK | ✅ TAK |
| **Gdzie się pojawia** | Lock screen + notification drawer | Róg ekranu + Action Center/Notification Center |
| **Priorytet** | Wysoki = banner, Niski = ciche | Wysoki = DING!, Niski = ciche |
| **Persistence** | ✅ Zostaje w powiadomieniach | ✅ Zostaje w Action Center |

---

## 🏗️ Architektura techniczna

### **Identyczna jak w telefonie!**

```
┌─────────────────────────────────────────────────────┐
│           BACKEND (Symfony)                         │
│                                                     │
│  WorkOrderCreatedEvent (priority: CRITICAL)        │
│         ↓                                           │
│  EventListener sprawdza priority                    │
│         ↓                                           │
│  if (priority === CRITICAL) {                       │
│    $pushService->sendToRole('ROLE_DIRECTOR')       │
│  }                                                  │
│         ↓                                           │
│  WebPushService (minishlink/web-push)              │
│         ↓                                           │
│  Web Push Protocol (HTTPS)                         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│     BROWSER SERVICE WORKER (background)             │
│                                                     │
│  self.addEventListener('push', (event) => {        │
│    const data = event.data.json()                  │
│                                                     │
│    // Różne typy notyfikacji                       │
│    if (data.priority === 'CRITICAL') {             │
│      showNotification('⚠️ KRYTYCZNA AWARIA!', {    │
│        requireInteraction: true, // nie znika!     │
│        silent: false, // DŹWIĘK!                   │
│        vibrate: [300, 200, 300], // wibracja PC    │
│        badge: '/icons/critical-badge.png'          │
│      })                                             │
│    }                                                │
│  })                                                 │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│        WINDOWS/MACOS/LINUX NOTIFICATION API         │
│                                                     │
│  Windows: Notification Center (Action Center)      │
│  macOS: Notification Center (menu bar)             │
│  Linux: libnotify (GNOME/KDE)                      │
│                                                     │
│  Natywne powiadomienia OS!                         │
└─────────────────────────────────────────────────────┘
```

---

## 💻 Implementacja

### **1. Backend - różne typy dla różnych ról:**

```php
namespace App\Application\WorkOrder\EventListener;

class SendPushNotificationOnWorkOrderCreated
{
    public function __invoke(WorkOrderCreatedEvent $event): void
    {
        $workOrder = $event->getWorkOrder();
        
        // KRYTYCZNA AWARIA → Dyrektor + Wszyscy mechanicy
        if ($workOrder->getPriority() === Priority::CRITICAL) {
            $payload = [
                'title' => '⚠️ KRYTYCZNA AWARIA!',
                'message' => 'LINIA PRODUKCYJNA ZATRZYMANA - ' . $workOrder->getTitle(),
                'body' => sprintf(
                    "%s\nSzacowane straty: 5000 zł/h",
                    $workOrder->getDescription()
                ),
                'icon' => '/icons/critical-512.png',
                'badge' => '/icons/critical-badge-72.png',
                'priority' => 'high',
                'requireInteraction' => true, // NIE ZNIKA automatycznie!
                'silent' => false, // DŹWIĘK!
                'vibrate' => [300, 200, 300, 200, 300], // Mocna wibracja
                'tag' => 'critical-' . $workOrder->getId(),
                'actions' => [
                    [
                        'action' => 'view',
                        'title' => 'Zobacz szczegóły',
                        'icon' => '/icons/eye.png'
                    ],
                    [
                        'action' => 'escalate',
                        'title' => 'Powiadom zespół',
                        'icon' => '/icons/alert.png'
                    ]
                ],
                'data' => [
                    'url' => '/dashboard/critical/' . $workOrder->getId(),
                    'workOrderId' => $workOrder->getId(),
                    'timestamp' => time()
                ]
            ];
            
            // Wyślij do dyrektora (desktop)
            $this->pushService->sendToRole('ROLE_DIRECTOR', $payload);
            
            // Wyślij do wszystkich mechaników (mobile + desktop)
            $this->pushService->sendToRole('ROLE_TECHNICIAN', $payload);
        }
        
        // WYSOKI PRIORYTET → Tylko mechanicy
        elseif ($workOrder->getPriority() === Priority::HIGH) {
            $payload = [
                'title' => '🚨 Pilna awaria',
                'message' => $workOrder->getTitle(),
                'priority' => 'high',
                'requireInteraction' => false,
                'silent' => false,
                // ...
            ];
            
            $this->pushService->sendToRole('ROLE_TECHNICIAN', $payload);
        }
        
        // NORMALNY → Ciche powiadomienie
        else {
            $payload = [
                'title' => '📋 Nowe zlecenie',
                'message' => $workOrder->getTitle(),
                'priority' => 'normal',
                'requireInteraction' => false,
                'silent' => true, // Bez dźwięku
                // ...
            ];
            
            $this->pushService->sendToRole('ROLE_TECHNICIAN', $payload);
        }
    }
}
```

---

### **2. Frontend - Service Worker (identyczny dla desktop i mobile!):**

```typescript
// src/service-worker.ts

self.addEventListener('push', (event) => {
  const data = event.data.json()
  
  // Wyświetl powiadomienie
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: data.vibrate,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      silent: data.silent,
      actions: data.actions,
      data: data.data
    })
  )
})

// Obsługa kliknięcia
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const urlToOpen = event.notification.data.url
  
  // Akcja: "Powiadom zespół"
  if (event.action === 'escalate') {
    fetch('/api/work-orders/escalate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + getStoredToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workOrderId: event.notification.data.workOrderId
      })
    })
  }
  
  // Otwórz aplikację (lub przełącz zakładkę jeśli już otwarta)
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Jeśli aplikacja już otwarta → przełącz zakładkę
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }
        
        // Jeśli zamknięta → otwórz nową zakładkę
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})
```

---

### **3. Różne dźwięki dla różnych priorytetów (opcjonalne):**

```typescript
// src/utils/notification-sound.ts

export function playNotificationSound(priority: 'critical' | 'high' | 'normal') {
  const audio = new Audio()
  
  switch (priority) {
    case 'critical':
      audio.src = '/sounds/critical-alert.mp3' // Głośny, agresywny
      audio.volume = 1.0
      break
    case 'high':
      audio.src = '/sounds/high-priority.mp3' // Normalny
      audio.volume = 0.8
      break
    case 'normal':
      audio.src = '/sounds/normal-notification.mp3' // Delikatny
      audio.volume = 0.5
      break
  }
  
  audio.play()
}
```

---

## ⏰ TTL - Nie wysyłaj starych powiadomień

### **Problem:**

**Scenariusz który chcesz uniknąć:**
```
18:00 - Dyrektor wyłącza komputer (koniec dnia)
19:00 - Awaria LOW priority "Wymiana filtra"
20:00 - Awaria MEDIUM "Przegląd maszyny"
21:00 - Awaria HIGH "Przeciek oleju"

09:00 (następny dzień) - Dyrektor włącza komputer
09:01 - 💥💥💥 COMBO 3 powiadomień z wczoraj!

❌ Wszystkie nieaktualne (już się tym ktoś zajął)
❌ SPAM dla dyrektora
❌ Irytujące (musi klikać "Zamknij" 3 razy)
```

---

### **Rozwiązanie: TTL (Time To Live)**

**TTL = "ważność" powiadomienia w sekundach**

```php
$this->pushService->sendToUser($userId, $payload, $ttl = 300);
//                                                    ↑
//                                         5 minut = 300 sekund
```

**Co to robi:**
- Powiadomienie "żyje" tylko przez **określony czas**
- Jeśli użytkownik nie odbierze w tym czasie → **zostaje usunięte**
- Komputer włączony po TTL → **BRAK powiadomienia** ✅

---

### **Jak to działa:**

#### **Przykład 1: TTL = 300s (5 minut) - Awaria LOW**

```
10:00:00 - Backend wysyła push (TTL = 300s)
10:02:00 - Dyrektor wyłącza komputer
10:10:00 - Dyrektor włącza komputer (uplynęło 10 minut)

Rezultat: ❌ BRAK powiadomienia (TTL expired po 5 minutach)
✅ Tego właśnie chciałeś!
```

---

#### **Przykład 2: TTL = 3600s (1 godzina) - Awaria CRITICAL**

```
10:00:00 - Backend wysyła push (TTL = 3600s)
10:15:00 - Dyrektor wyłącza komputer
10:30:00 - Dyrektor włącza komputer (uplynęło 30 minut)

Rezultat: ✅ Dostaje powiadomienie (jeszcze w TTL!)
```

```
10:00:00 - Backend wysyła push (TTL = 3600s)
10:15:00 - Dyrektor wyłącza komputer
12:00:00 - Dyrektor włącza komputer (uplynęło 1h 45min)

Rezultat: ❌ BRAK powiadomienia (TTL expired!)
```

---

### **Implementacja - 3 warstwy obrony:**

```
┌──────────────────────────────────────────────────┐
│ WARSTWA 1: Backend (przed wysłaniem)            │
│ ✅ Sprawdź wiek powiadomienia                    │
│ ✅ Jeśli za stare → NIE wysyłaj w ogóle          │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ WARSTWA 2: Web Push TTL (w protokole HTTP)      │
│ ✅ TTL w headerze push request                   │
│ ✅ Push service automatycznie usuwa stare        │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ WARSTWA 3: Service Worker (frontend backup)     │
│ ✅ Sprawdź wiek powiadomienia przed pokazaniem   │
│ ✅ Jeśli za stare → ignore                       │
└──────────────────────────────────────────────────┘
```

**Wszystkie 3 razem = 100% pewności! 🔒**

---

### **Warstwa 1: Backend - różne TTL per priorytet**

```php
namespace App\Infrastructure\Notification;

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class WebPushNotificationService
{
    private WebPush $webPush;
    
    public function sendToRole(string $role, array $payload, int $ttl = 900): void
    {
        // Sprawdź czy powiadomienie nie jest już za stare (edge case: delayed event)
        if (isset($payload['createdAt'])) {
            $createdAt = new \DateTimeImmutable($payload['createdAt']);
            $now = new \DateTimeImmutable();
            $ageInSeconds = $now->getTimestamp() - $createdAt->getTimestamp();
            
            if ($ageInSeconds > $ttl) {
                // Powiadomienie za stare → NIE WYSYŁAJ
                $this->logger->info('Notification too old, skipping', [
                    'role' => $role,
                    'age' => $ageInSeconds,
                    'ttl' => $ttl
                ]);
                return;
            }
        }
        
        $subscriptions = $this->subscriptionRepository->findByRole($role);
        
        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint' => $sub->getEndpoint(),
                'keys' => [
                    'p256dh' => $sub->getPublicKey(),
                    'auth' => $sub->getAuthToken(),
                ]
            ]);
            
            $this->webPush->queueNotification(
                $subscription,
                json_encode($payload),
                [
                    'TTL' => $ttl, // ← WARSTWA 2: TTL w Web Push Protocol
                    'urgency' => $this->getUrgency($ttl),
                    'topic' => $payload['topic'] ?? null
                ]
            );
        }
        
        $this->webPush->flush();
    }
    
    private function getUrgency(int $ttl): string
    {
        // Mapuj TTL na urgency (https://datatracker.ietf.org/doc/html/rfc8030#section-5.3)
        return match (true) {
            $ttl >= 3600 => 'high',      // >= 1h = ważne długo
            $ttl >= 900  => 'normal',    // >= 15min = normalne
            $ttl >= 300  => 'low',       // >= 5min = niski priorytet
            default      => 'very-low',  // < 5min = bardzo niski
        };
    }
}
```

---

### **Event Listener - różne TTL per priorytet awarii:**

```php
#[AsEventListener(event: WorkOrderCreatedEvent::class)]
class SendPushNotificationOnWorkOrderCreated
{
    // Stałe TTL per priorytet
    private const TTL = [
        Priority::CRITICAL => 3600,  // 1 godzina (ważne długo!)
        Priority::HIGH     => 1800,  // 30 minut
        Priority::MEDIUM   => 900,   // 15 minut
        Priority::LOW      => 300,   // 5 minut (stare nieważne)
    ];
    
    public function __invoke(WorkOrderCreatedEvent $event): void
    {
        $workOrder = $event->getWorkOrder();
        
        $payload = [
            'title' => $this->getTitle($workOrder),
            'message' => $workOrder->getTitle(),
            'workOrderId' => $workOrder->getId(),
            'priority' => $workOrder->getPriority()->value,
            'createdAt' => $workOrder->getCreatedAt()->format('c'), // ISO 8601
            'topic' => 'work-order-' . $workOrder->getPriority()->value
        ];
        
        $ttl = self::TTL[$workOrder->getPriority()];
        
        // Wyślij z odpowiednim TTL
        if ($workOrder->getPriority() === Priority::CRITICAL) {
            // Dyrektor + wszyscy mechanicy
            $this->pushService->sendToRole('ROLE_DIRECTOR', $payload, $ttl);
            $this->pushService->sendToRole('ROLE_TECHNICIAN', $payload, $ttl);
        } else {
            // Tylko mechanicy
            $this->pushService->sendToRole('ROLE_TECHNICIAN', $payload, $ttl);
        }
    }
    
    private function getTitle(WorkOrder $workOrder): string
    {
        return match ($workOrder->getPriority()) {
            Priority::CRITICAL => '🚨 KRYTYCZNA AWARIA!',
            Priority::HIGH     => '⚠️ Pilne zlecenie',
            Priority::MEDIUM   => '📋 Nowe zlecenie',
            Priority::LOW      => '📝 Zlecenie planowane',
        };
    }
}
```

---

### **Warstwa 3: Service Worker - backup filtering**

```typescript
// src/service-worker.ts

self.addEventListener('push', (event) => {
  const data = event.data.json()
  
  // WARSTWA 3: Sprawdź wiek powiadomienia (backup gdyby TTL nie zadziałał)
  if (data.createdAt) {
    const createdAt = new Date(data.createdAt)
    const now = new Date()
    const ageInMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60
    
    // TTL per priorytet (duplikacja logiki backendu)
    const maxAge = {
      'critical': 60,  // 1 godzina
      'high': 30,      // 30 minut
      'medium': 15,    // 15 minut
      'low': 5         // 5 minut
    }
    
    const ttl = maxAge[data.priority?.toLowerCase()] || 15
    
    // Jeśli powiadomienie za stare → IGNORUJ
    if (ageInMinutes > ttl) {
      console.log(`⏰ Powiadomienie za stare (${ageInMinutes.toFixed(1)} min > ${ttl} min), ignoruję.`)
      return // ← NIE pokazuje powiadomienia!
    }
  }
  
  // Powiadomienie świeże → pokaż
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      requireInteraction: data.priority === 'critical',
      silent: data.priority === 'low',
      tag: data.topic || `work-order-${data.workOrderId}`,
      data: {
        url: `/work-orders/${data.workOrderId}`,
        workOrderId: data.workOrderId,
        priority: data.priority
      }
    })
  )
})
```

---

### **📊 Zalecane wartości TTL:**

| Priorytet | TTL | Uzasadnienie |
|-----------|-----|--------------|
| **CRITICAL** | 3600s (1h) | Krytyczna awaria ważna nawet po godzinie (linia produkcyjna stoi!) |
| **HIGH** | 1800s (30min) | Pilne, ale po pół godziny pewnie ktoś się tym zajął |
| **MEDIUM** | 900s (15min) | Zwykłe zlecenie, po 15 min nieaktualne |
| **LOW** | 300s (5min) | Planowane, po 5 min nieistotne |

---

### **🎯 TTL per rola użytkownika:**

```php
// Dyrektor - krótki TTL (szybka reakcja!)
if ($role === 'ROLE_DIRECTOR' && $priority === Priority::CRITICAL) {
    $ttl = 1800; // 30 minut (ważne by reagować TERAZ, nie po 2h)
}

// Mechanik - dłuższy TTL (może być w terenie)
if ($role === 'ROLE_TECHNICIAN') {
    $ttl = 3600; // 1 godzina
}

// Operator - bardzo krótki (tylko potwierdzenia)
if ($role === 'ROLE_OPERATOR') {
    $ttl = 300; // 5 minut (tylko info, nie wymaga akcji)
}
```

---

### **💎 Bonus: Grupowanie powiadomień (topic)**

**Problem:**
```
Wysyłasz 5 powiadomień CRITICAL w ciągu minuty
→ Użytkownik dostaje 5 osobnych combo po włączeniu komputera
→ SPAM! ❌
```

**Rozwiązanie:**
```php
[
    'topic' => 'work-order-critical' // ← Ten sam topic dla wszystkich CRITICAL
]
```

**Efekt:**
```
Push service automatycznie ZASTĘPUJE stare powiadomienia nowym:

10:00 - Wysyłasz: "Awaria #1"  (topic: work-order-critical)
10:02 - Wysyłasz: "Awaria #2"  (topic: work-order-critical)
10:05 - Wysyłasz: "Awaria #3"  (topic: work-order-critical)

→ Użytkownik dostaje TYLKO NAJNOWSZE: "Awaria #3"
→ Poprzednie zostały zastąpione! ✅
```

**Implementacja:**
```php
$payload = [
    'title' => '🚨 KRYTYCZNA AWARIA!',
    'message' => $workOrder->getTitle(),
    'topic' => 'work-order-' . $workOrder->getPriority()->value, // Grupowanie per priorytet
    // ...
];

$this->webPush->queueNotification(
    $subscription,
    json_encode($payload),
    [
        'TTL' => $ttl,
        'topic' => $payload['topic'] // ← Grupowanie!
    ]
);
```

---

### **🧪 Testowanie TTL:**

#### **Test 1: TTL krótki (5 minut) - LOW priority**

```bash
# Terminal 1: Backend - wyślij powiadomienie
curl -X POST http://localhost:8000/api/work-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test TTL - Low Priority",
    "priority": "low",
    "description": "To powiadomienie powinno zniknąć po 5 minutach"
  }'

# Odpowiedź: 201 Created

# Wyłącz komputer / zamknij przeglądarkę
# Czekaj 10 minut
# Włącz ponownie

# Rezultat: ❌ BRAK powiadomienia (TTL expired) ✅
```

---

#### **Test 2: TTL długi (1 godzina) - CRITICAL priority**

```bash
curl -X POST http://localhost:8000/api/work-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test TTL - CRITICAL",
    "priority": "critical",
    "description": "To powinno przyjść nawet po 30 minutach"
  }'

# Wyłącz komputer / zamknij przeglądarkę
# Czekaj 30 minut (ale NIE więcej niż 1h!)
# Włącz ponownie

# Rezultat: ✅ Dostaniesz powiadomienie (jeszcze w TTL)
```

---

#### **Test 3: Service Worker filtering (Chrome DevTools)**

```typescript
// Chrome DevTools → Application → Service Workers → Console:

self.addEventListener('push', (event) => {
  const data = event.data.json()
  
  console.log('📥 Push received:', data)
  console.log('📅 Created at:', data.createdAt)
  console.log('⏰ Age (minutes):', (new Date() - new Date(data.createdAt)) / 60000)
  
  // Twój kod filtrowania...
})

// Testuj symulując stare powiadomienie:
const fakeOldNotification = {
  title: 'Test',
  createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 min temu
  priority: 'medium' // TTL = 15 min
}

// Powinno zostać odrzucone (20 min > 15 min TTL)
```

---

### **📈 Przykład z życia - Timeline:**

**Piątek 18:00 - Dyrektor kończy pracę:**
```
18:00 - Wyłącza komputer
19:15 - Awaria LOW "Wymiana żarówki" (TTL = 5 min)
20:30 - Awaria MEDIUM "Przegląd roczny" (TTL = 15 min)
22:00 - Awaria HIGH "Przeciek oleju" (TTL = 30 min)
23:00 - Awaria CRITICAL "Awaria linii!" (TTL = 1h)
```

**Poniedziałek 09:00 - Dyrektor włącza komputer:**
```
09:00 - Komputer włączony, Chrome background process startuje

❌ 19:15 Awaria LOW - expired (5 min TTL, 61h temu)
❌ 20:30 Awaria MEDIUM - expired (15 min TTL, 60h temu)
❌ 22:00 Awaria HIGH - expired (30 min TTL, 59h temu)
❌ 23:00 Awaria CRITICAL - expired (1h TTL, 58h temu)

Rezultat: 0 powiadomień! ✅
Dyrektor ma czysty ekran, zero SPAMu!
```

---

**Scenariusz 2: Krótka przerwa (lunch):**
```
12:00 - Dyrektor zamyka Chrome na lunch
12:15 - Awaria CRITICAL "Linia zatrzymana!" (TTL = 1h)
12:45 - Dyrektor wraca, otwiera Chrome (30 minut później)

✅ 12:15 Awaria CRITICAL - ACTIVE (jeszcze w TTL!)

Rezultat: Dostaje powiadomienie! ✅
```

---

### **⚙️ Konfiguracja dla różnych środowisk:**

```php
// config/services.yaml

parameters:
    push_notification_ttl:
        critical: '%env(int:PUSH_TTL_CRITICAL)%'  # Domyślnie: 3600
        high: '%env(int:PUSH_TTL_HIGH)%'          # Domyślnie: 1800
        medium: '%env(int:PUSH_TTL_MEDIUM)%'      # Domyślnie: 900
        low: '%env(int:PUSH_TTL_LOW)%'            # Domyślnie: 300
```

```bash
# .env

# Produkcja (długie TTL)
PUSH_TTL_CRITICAL=3600  # 1h
PUSH_TTL_HIGH=1800      # 30min
PUSH_TTL_MEDIUM=900     # 15min
PUSH_TTL_LOW=300        # 5min

# Development (krótkie TTL do testów)
# PUSH_TTL_CRITICAL=60   # 1 min
# PUSH_TTL_HIGH=30       # 30 sek
# PUSH_TTL_MEDIUM=15     # 15 sek
# PUSH_TTL_LOW=5         # 5 sek
```

---

### **✅ Checklist - Implementacja TTL:**

**Backend (1h):**
- [ ] Dodaj parametr `$ttl` do `WebPushNotificationService::sendToRole()`
- [ ] Dodaj TTL do `$this->webPush->queueNotification()` options
- [ ] Dodaj stałe TTL per priorytet w EventListener
- [ ] Dodaj walidację wieku powiadomienia przed wysłaniem
- [ ] Dodaj topic dla grupowania (opcjonalne)

**Frontend (30 min):**
- [ ] Dodaj `createdAt` do payload (ISO 8601 timestamp)
- [ ] Service Worker: sprawdź wiek przed pokazaniem (backup)
- [ ] Dodaj logi do console: "Powiadomienie za stare, ignoruję"

**Testowanie (30 min):**
- [ ] Test: LOW (5 min) → wyłącz na 10 min → brak powiadomienia ✅
- [ ] Test: CRITICAL (1h) → wyłącz na 30 min → dostaje powiadomienie ✅
- [ ] Test: Grupowanie (topic) → 3 awarie → 1 powiadomienie ✅

**TOTAL: ~2h** (worth it! 💯)

---

### **🎯 TL;DR - TTL:**

**Problem:**
- Dyrektor wyłącza komputer wieczorem
- Dostaje 20 starych powiadomień rano
- SPAM! ❌

**Rozwiązanie:**
- TTL (Time To Live) = "ważność" powiadomienia
- CRITICAL = 1h, HIGH = 30min, MEDIUM = 15min, LOW = 5min
- Stare powiadomienia automatycznie usuwane
- 3 warstwy obrony (backend + Web Push + Service Worker)

**Efekt:**
- ✅ Zero starych powiadomień
- ✅ Tylko świeże, aktualne awarie
- ✅ Dyrektor nie dostaje SPAMu
- ✅ Lepsze UX!

**Implementacja:** ~2h (worth it!)

---

## 💎 Zaawansowane funkcje (Desktop-specific)

### **1. Focus Window - automatyczne przełączenie zakładki:**

```typescript
self.addEventListener('notificationclick', async (event) => {
  event.notification.close()
  
  // Znajdź otwartą zakładkę Maintly
  const clients = await self.clients.matchAll({ type: 'window' })
  
  for (const client of clients) {
    if (client.url.includes('/dashboard') && 'focus' in client) {
      // Przełącz na istniejącą zakładkę
      await client.focus()
      await client.navigate('/dashboard/critical/123')
      return
    }
  }
  
  // Jeśli nie ma otwartej → otwórz nową
  await self.clients.openWindow('/dashboard/critical/123')
})
```

**Efekt:**
- Dyrektor ma 20 zakładek otwartych
- Dostaje powiadomienie → klika
- Chrome **automatycznie przełącza** na zakładkę Maintly (nie otwiera nowej!)

---

### **2. Badge na zakładce (licznik):**

```typescript
// Ustaw badge na zakładce
navigator.setAppBadge(5) // (5) na zakładce Chrome

// Wyczyść badge
navigator.clearAppBadge()
```

**Efekt:**
```
Taskbar Windows:
[Chrome (5)] [Excel] [Outlook] ...
         ↑
    licznik!
```

---

### **3. Persistent notification (nie znika dopóki nie klikniesz):**

```typescript
self.registration.showNotification('KRYTYCZNA AWARIA!', {
  requireInteraction: true, // ← NIE ZNIKA automatycznie!
  // ...
})
```

**Dla krytycznych awarii → dyrektor MUSI kliknąć!**

---

### **4. Rich media (obrazki, zdjęcia awarii):**

```typescript
self.registration.showNotification('Awaria CNC-001', {
  body: 'Przegrzanie silnika',
  icon: '/icons/warning-512.png',
  image: '/uploads/work-orders/wo-123-photo.jpg', // ← DUŻE ZDJĘCIE!
  badge: '/icons/critical-badge.png'
})
```

**Windows notification:**
```
┌─────────────────────────────────────────────────────┐
│ 🚨 Maintly - Awaria CNC-001                        │
│ Przegrzanie silnika                                │
│                                                     │
│ [───────────────────────────────────────────────]  │
│ [   ZDJĘCIE DYMIĄCEJ MASZYNY (inline!)          ]  │
│ [───────────────────────────────────────────────]  │
│                                                     │
│ [Zobacz]  [Powiadom zespół]                        │
└─────────────────────────────────────────────────────┘
```

---

## 👔 Konfiguracja per rola

### **Dyrektor vs Mechanik vs Operator:**

| Rola | Powiadomienia Desktop | Priorytet | Dźwięk |
|------|----------------------|-----------|--------|
| **Dyrektor techniczny** | ✅ Tylko CRITICAL | Wysokie | Głośny DING! |
| **Kierownik produkcji** | ✅ CRITICAL + HIGH | Wysokie | Normalny |
| **Mechanik** | ✅ Wszystkie | Średnie | Normalny |
| **Operator** | ⚠️ Tylko potwierdzenia | Niskie | Ciche |

### **Implementacja:**

```php
// Backend
public function sendNotification(WorkOrder $workOrder): void
{
    $priority = $workOrder->getPriority();
    
    // CRITICAL → Dyrektor + Wszyscy
    if ($priority === Priority::CRITICAL) {
        $this->pushService->sendToRole('ROLE_DIRECTOR', [
            'title' => '⚠️ KRYTYCZNA AWARIA!',
            'requireInteraction' => true,
            'silent' => false,
            'priority' => 'high'
        ]);
        
        $this->pushService->sendToRole('ROLE_MANAGER', [/* ... */]);
        $this->pushService->sendToRole('ROLE_TECHNICIAN', [/* ... */]);
    }
    
    // HIGH → Kierownik + Mechanicy
    elseif ($priority === Priority::HIGH) {
        $this->pushService->sendToRole('ROLE_MANAGER', [/* ... */]);
        $this->pushService->sendToRole('ROLE_TECHNICIAN', [/* ... */]);
    }
    
    // NORMAL → Tylko mechanicy
    else {
        $this->pushService->sendToRole('ROLE_TECHNICIAN', [
            'title' => '📋 Nowe zlecenie',
            'silent' => true, // Bez dźwięku
            'requireInteraction' => false
        ]);
    }
}
```

---

## 🎓 Demo na obronę inżynierki

### **Scenariusz 4-minutowy:**

**1. Setup (30 sek):**
```
Laptop 1: Zalogowany jako Operator
Laptop 2: Zalogowany jako Dyrektor (desktop Chrome)
Telefon: Zalogowany jako Mechanik (PWA zainstalowana)
```

**2. Demo (3 min):**

**[00:00]** - "Pokażę teraz powiadomienia w czasie rzeczywistym..."

**[00:15]** - Laptop 1 (Operator):
- Tworzy zlecenie "KRYTYCZNA AWARIA - CNC-001"
- Priority: CRITICAL
- Klik "Utwórz"

**[00:20]** - **💥 JEDNOCZEŚNIE:**
- **Laptop 2 (Dyrektor):** Pojawia się DUŻE powiadomienie Windows (prawy dolny róg)
  ```
  🚨 KRYTYCZNA AWARIA!
  LINIA PRODUKCYJNA ZATRZYMANA
  [Zobacz]  [Powiadom zespół]
  ```
  **DŹWIĘK: "DING!"** ← komisja słyszy!
  
- **Telefon (Mechanik):** Telefon wibruje (bzz-bzz!), powiadomienie na lock screen
  ```
  🚨 Maintly - KRYTYCZNA AWARIA!
  CNC-001 - Linia zatrzymana
  [Przyjmij]  [Zobacz]
  ```

**[00:30]** - Telefon (Mechanik):
- Klik "Przyjmij" **bezpośrednio z powiadomienia**
- Aplikacja się otwiera → zlecenie przypisane

**[00:35]** - **Laptop 1 i 2 - REALTIME UPDATE:**
- Ekran operatora: "Jan Kowalski przyjął zlecenie" (WebSocket!)
- Ekran dyrektora: Dashboard odświeża się automatycznie

**[00:45]** - Laptop 2 (Dyrektor):
- Klika powiadomienie Windows → Chrome przełącza zakładkę
- Dashboard: "Live status: Mechanik w drodze do maszyny"

**[01:00]** - Telefon (Mechanik):
- Zmienia status: "W trakcie realizacji" → "Ukończone"

**[01:05]** - **Laptop 2 (Dyrektor) - NOWE POWIADOMIENIE:**
  ```
  ✅ Maintly - Awaria rozwiązana
  CNC-001 działa ponownie
  Czas przestoju: 45 sekund
  [Zobacz raport]
  ```

**[01:15]** - Pokazujesz raport:
- "Czas reakcji: 15 sekund"
- "Czas naprawy: 30 sekund"
- "Total downtime: 45 sekund (oszczędność 95%!)"

**Komisja:** 🤯 **"WOW!"**

---

**3. Tłumaczysz (1 min):**
```
"To działa przez Web Push API - standardową technologię,
używaną przez Gmail, Facebook, Twitter...

Powiadomienia działają nawet gdy:
- Przeglądarka jest zminimalizowana ✅
- Pracujesz w innym programie (Excel) ✅
- Komputer jest zablokowany ✅

Dyrektor natychmiast wie o krytycznych awariach,
nawet jeśli nie ma otwartej aplikacji!"
```

---

## 🔍 Porównanie: Tradycyjny CMMS vs Maintly

| Aspekt | ❌ Tradycyjny CMMS | ✅ Maintly (Desktop Push) |
|--------|-------------------|---------------------------|
| **Powiadamianie dyrektora** | Email (opóźnienie 5-30 min) | Natywne powiadomienie OS (2 sekundy!) |
| **Czas reakcji** | 30-60 minut (sprawdza email) | 30 sekund (widzi od razu) |
| **Praca w innych programach** | Musi przełączyć się na przeglądarkę | Powiadomienie nakłada się na Excel/Word |
| **Krytyczne awarie** | Trzeba dzwonić telefonem | Automatyczne push z eskalacją |
| **Akcje bezpośrednie** | Nie (musi otworzyć aplikację) | TAK ("Powiadom zespół" z powiadomienia) |
| **Rich media** | Nie | TAK (zdjęcia awarii inline) |
| **Dźwięk różny per priorytet** | Nie | TAK (CRITICAL = głośny, NORMAL = cichy) |

---

## ✅ Checklist implementacji

### **Backend (2h):**
- [ ] Rozszerz `PushSubscription` o pole `role` (ROLE_DIRECTOR, ROLE_TECHNICIAN)
- [ ] Dodaj metodę `sendToRole(string $role, array $payload)`
- [ ] Event Listener z różnymi payloadami per priorytet (CRITICAL, HIGH, NORMAL)
- [ ] VAPID keys (już masz z mobile push)

### **Frontend (2h):**
- [ ] Service Worker listener (już masz z mobile)
- [ ] `requireInteraction: true` dla CRITICAL
- [ ] Różne dźwięki per priorytet (opcjonalne)
- [ ] Badge licznik (`navigator.setAppBadge()`)

### **Testowanie Desktop (1h):**
- [ ] Windows 10/11 - Chrome/Edge
- [ ] macOS - Safari/Chrome
- [ ] Linux - Firefox/Chrome
- [ ] Lock screen test (Windows)
- [ ] Zminimalizowana przeglądarka test

### **Dokumentacja (1h):**
- [ ] Instrukcja dla dyrektora: "Jak włączyć powiadomienia"
- [ ] Screenshot przykładowych powiadomień Windows
- [ ] Troubleshooting (jeśli nie działają powiadomienia)

**TOTAL: ~6h** (to samo co mobile, bo używa tej samej technologii!)

---

## 🎯 TL;DR - Desktop Notifications

### **Tak, to działa IDENTYCZNIE jak na telefonie!**

✅ **Natywne powiadomienia Windows/macOS/Linux**  
✅ **Działa gdy przeglądarka zminimalizowana** (ale musi być otwarta)  
✅ **Akcje bezpośrednio z powiadomienia** ("Zobacz", "Powiadom zespół")  
✅ **Rich media** (obrazki, zdjęcia awarii)  
✅ **Różne priorytety** (CRITICAL = głośny dźwięk + nie znika)  
✅ **Badge licznik** na zakładce Chrome  
✅ **Automatyczne przełączanie zakładki** (focus existing tab)  

### **Use case dla Maintly:**
- 👔 **Dyrektor techniczny:** Dostaje tylko CRITICAL na desktop (Windows notification)
- 👨‍🔧 **Mechanicy:** Dostają wszystkie na telefon + desktop
- 👨‍💼 **Kierownik:** Dostaje CRITICAL + HIGH na desktop

### **Implementacja:**
- Identyczna jak mobile push (ten sam kod!)
- Różne payloady per rola (backend)
- Różne priorytety per typ awarii
- Total: ~6h (razem z mobile)

---

## 🚀 Następne kroki

1. **Najpierw:** Mobile Push Notifications (Marzec 2026, ~8h)
2. **Potem:** Desktop jest GRATIS (ten sam kod!)
3. **Testy:** Windows (dyrektor) + Android (mechanicy)
4. **Demo:** Laptop + telefon na obronę = 🔥🔥🔥

---

**Desktop notifications to TAK, DZIAŁA i jest mega dla Twojego scenariusza z dyrektorem technicznym! 💪**
