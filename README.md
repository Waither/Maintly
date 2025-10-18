# Maintly — proste CMMS, które „żyje” na wszystkich urządzeniach naraz

[![Status](https://img.shields.io/badge/status-prace_trwają-orange)](#)
[![Made with Symfony](https://img.shields.io/badge/backend-Symfony-000?logo=symfony)](#)
[![Made with React](https://img.shields.io/badge/frontend-React-61dafb?logo=react\&logoColor=000)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#)

**Maintly** to aplikacja do zarządzania utrzymaniem ruchu (**CMMS**), zrobiona tak, żeby **zmiany były widoczne natychmiast** – niezależnie czy ktoś pracuje na **telefonie w hali**, czy na **laptopie w biurze**.
Dodasz zadanie na telefonie → **u wszystkich od razu** pojawia się ono **na górze listy**. Zmienisz stan części → **liczniki i stany** aktualizują się same, bez przeładowań.

> **Cel:** mniej klikania, mniej telefonów, zero “odśwież stronę”.

---

## Zobacz, o co chodzi (krótko)

* 📲 Dodawanie zlecenia na telefonie → **sekundę później** widzisz je na komputerze.
* 📌 Nowe pozycje **wpadają na wierzch** listy, są lekko podświetlone.
* 🧮 Liczniki „Do zrobienia”, stany magazynowe i statusy **same się przeliczają**.
* 📴 **Offline?** Spoko — aplikacja działa jako **PWA**: można pracować bez sieci, a zmiany zsynchronizują się później.

> *(Tu możesz dodać gif/screena, gdy już będziesz mieć: `assets/demo-live-sync.gif`)*

---

## Dla kogo

* Zespoły utrzymania ruchu, które chcą **mniej papieru i telefonów**.
* Kierownicy, którzy potrzebują **aktualnego obrazu sytuacji** bez odświeżania raportów.
* Firmy, które działają też w terenie i **nie zawsze mają internet**.

---

## Co będzie w pierwszej wersji

* 🧾 **Zlecenia** – zgłoszenie → realizacja → zamknięcie.
* 🧰 **Maszyny i części** – ewidencja, szybkie wyszukiwanie, stany.
* 💬 **Komentarze/zdjęcia** – kontekst do zleceń.
* 🏷️ **Tagi i filtry** – szybkie sortowanie list.
* 🛎️ **Live-sync** – stałe połączenie (WebSocket), **zero ręcznego odświeżania**.
* 📦 **PWA + offline** – działa jak aplikacja, zapisuje dane lokalnie i synchronizuje w tle.

---

## Jak to „magicznie” działa (bez żargonu)

* Urządzenia są połączone **na stałe** z serwerem (coś jak czat).
* Gdy ktoś coś doda/zmieni, serwer **popycha** tę zmianę do wszystkich.
* Front robi za Ciebie porządek: **nowe rzeczy lądują na górze**, liczniki się aktualizują.
* **Brak internetu?** Zmiany zapisują się **lokalnie** i wyślą się, gdy sieć wróci.

> Dla ciekawskich: to tzw. **CQRS lite** – w skrócie: **czytanie** jest oddzielone od **zapisywania**, dzięki czemu aplikacja jest **szybsza** i **łatwiej ją rozwijać** o kolejne moduły.

---

## Dlaczego to jest szybkie i przyjemne

* ⚡ **Live-sync**: zamiast odpytywać serwer co chwilę, serwer sam wysyła zmiany.
* 🧠 **Mądre listy**: nowe zadania na wierzchu, lekkie podświetlenie, brak duplikatów.
* 🧳 **Offline-first**: można pracować w hali, piwnicy czy w terenie — bez stresu.
* 🧩 **Modułowość** (CQRS lite): łatwo dołożyć np. przeglądy, check-listy czy raporty KPI.

---

## Jak to będzie wyglądać w praktyce (przykładowy dzień)

1. Technik zauważa problem → **dodaje zadanie** w telefonie (zdjęcie + opis).
2. Na komputerze dyspozytora **pojawia się nowa pozycja** u góry listy.
3. Dyspozytor **przypisuje** zadanie do osoby i terminu → technik widzi zmianę **od razu**.
4. Po wykonaniu technik **zmienia status** → liczniki zadań i raport dnia **same się aktualizują**.

---

## Plan (roadmapa)

**Milestone 1 – Core**

* [ ] Zlecenia (CRUD), maszyny, części
* [ ] Live-sync (zadania, komentarze, stany części)
* [ ] PWA i praca offline
* [ ] Role i uprawnienia

**Milestone 2 – Wygoda**

* [ ] Check-listy i załączniki
* [ ] Powiadomienia (web push)
* [ ] Szybkie raporty

**Milestone 3 – Analityka**

* [ ] KPI (MTTR/MTBF, proste dashboardy)
* [ ] Eksport CSV/Excel

---

## Status projektu

* 🛠️ **W trakcie budowy**. Repozytorium będzie stopniowo uzupełniane o kod i zrzuty ekranu.
* Chcesz śledzić postęp lub masz pomysł? **Otwórz Issue** z etykietą `proposal`.

---

## Słowniczek (krótkie i po ludzku)

* **CMMS** – system do zarządzania utrzymaniem ruchu (zlecenia, przeglądy, części).
* **PWA** – aplikacja „jak mobilna”, ale działa w przeglądarce; potrafi działać **offline**.
* **WebSocket** – stałe połączenie z serwerem; zmiany **wpadają natychmiast**.
* **CQRS lite** – dzielimy obsługę **czytania** i **pisania**, co ułatwia rozwój i przyspiesza działanie.

---

## Technologia (dla tych, co jednak chcą zajrzeć pod maskę)

* **Frontend:** React + TanStack Query, PWA (Service Worker), IndexedDB (cache/offline)
* **Backend:** Symfony + Doctrine, MySQL
* **Live-sync:** WebSocket (stałe połączenie)
* **Bezpieczeństwo:** logowanie i role; komunikacja po HTTPS

> Szczegóły techniczne i instrukcja uruchomienia dla devów trafią do `CONTRIBUTING.md` i `docs/`.

---

## Licencja

**MIT** — pełny tekst w pliku `LICENSE`.

---

## Kontakt

Masz pytanie lub chcesz dorzucić pomysł?
➡️ Otwórz **Issue** lub napisz w dyskusjach repozytorium.

---

> **Maintly** — mniej „zadzwoń do mnie”, więcej „już widzę i działam”.
