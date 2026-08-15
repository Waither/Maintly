# 🚀 Quickstart: Jak wygenerować PPTX na Windowsie

## ✅ PLAN: 10 Slajdów

```
1️⃣  Tytuł
2️⃣  Problem
3️⃣  Rozwiązanie i Cel
4️⃣  Wymagania Funkcjonalne
5️⃣  Architektura Systemu
6️⃣  Wykorzystane Technologie ⭐
7️⃣  Implementacja - Kluczowe Funkcje
8️⃣  Testowanie i Jakość Kodu
9️⃣  Wnioski i Perspektywy Przyszłości
🔟 Podziękowania i Pytania
```

---

## Krok 1: Sprawdź Node.js

Otwórz PowerShell i wpisz:

```powershell
node --version
npm --version
```

Jeśli widzisz numery wersji → idziesz do kroku 2.

**Jeśli nie masz Node.js, pobierz stąd:**
👉 https://nodejs.org/ (LTS version)

---

## Krok 2: Zainstaluj Decktape

W PowerShell:

```powershell
npm install -g decktape
```

Czekaj ~30 sekund. Powinno się zainstalować.

---

## Krok 3: Przejdź do folderu prezentacji

```powershell
cd C:\Users\Macie\Desktop\Maintly-Presentation
```

---

## Krok 4: 🎬 Wygeneruj PPTX

### Opcja A: Standardowy PPTX (rekomendowane)

```powershell
decktape reveal index.html presentation.pptx
```

Czekaj 1-2 minuty. Pojawią się printscreeny (normalnie).

### Opcja B: Wyższa jakość

```powershell
decktape reveal index.html presentation.pptx --size 1920x1440
```

### Opcja C: PDF (do druku)

```powershell
decktape reveal index.html presentation.pdf
```

---

## Krok 5: Otwórz Prezentację

```powershell
# Automatycznie otwiera w PowerPoint
.\presentation.pptx
```

Lub:
- Kliknij 2x na plik
- Upload do Google Slides / Canvy / OneDrive

---

## ✅ Gotowe!

Teraz możesz edytować prezentację w PowerPoint lub Canvie.

---

## 💡 Co Robić Jeśli Coś Pójdzie Nie Tak?

### Problem: `decktape is not recognized`

**Rozwiązanie:**
```powershell
# Zamknij PowerShell i otwórz nowe okno
# Spróbuj jeszcze raz

# Jeśli dalej nie działa, sprawdź gdzie jest zainstalowany:
npm list -g decktape

# Alternatywa - zamiast globalnie, zainstaluj lokalnie:
npm install decktape
npx decktape reveal index.html presentation.pptx
```

### Problem: PPTX ma złą jakość obrazów

```powershell
# Spróbuj z wyższą rozdzielczością
decktape reveal index.html presentation.pptx --size 1920x1440
# lub
decktape reveal index.html presentation.pptx --size 2560x1920
```

### Problem: Czeka bardzo długo

Normalnie decktape czeka 1-2 minuty. Jeśli czeka dłużej:
- Sprawdź czy Chrome jest zainstalowany (decktape go potrzebuje)
- Zamknij inne przeglądarki
- Zamknij background'owe procesy
- Spróbuj jeszcze raz

### Problem: Czcionki źle się renderują

```powershell
# Dodaj pause między slajdami
decktape reveal index.html presentation.pptx --pause 2000
```

---

## 📝 Po Edycji HTML'a

Jeśli zmieniłeś zawartość `index.html`, wystarczy wygenerować PPTX ponownie:

```powershell
decktape reveal index.html presentation.pptx
```

Każdy run nadpisze stary PPTX nową wersją.

---

## 🎯 Scenariusz na Obronę

- ⏱️ **~5-7 minut** dla 10 slajdów
- 📊 **Slajd 6** (Technologie) - pokazać zwięźle, ale dokładnie
- 🎬 **Demo żywe** - zamiast slajdu 9, pokaż aplikację działającą
- 📱 **Responsywność** - pokaż na telefonie lub tablecie

---

**Powodzenia!** 🎉

