# Maintly CMMS - Szablon Prezentacji do Obrony

Gotowy template prezentacji do obrony pracy inżynierskiej, utworzony z **Reveal.js v4.5** z profesjonalnym, ciemnym designem.

## 📊 Struktura: 10 Slajdów

```
1️⃣  Tytuł
2️⃣  Problem
3️⃣  Rozwiązanie i Cel
4️⃣  Wymagania Funkcjonalne (tabela)
5️⃣  Architektura Systemu (diagram)
6️⃣  ⭐ WYKORZYSTANE TECHNOLOGIE (Backend + Frontend + DevOps)
7️⃣  Implementacja - Kluczowe Funkcje
8️⃣  Testowanie i Jakość Kodu
9️⃣  Wnioski i Perspektywy Przyszłości
🔟 Podziękowania i Pytania
```

---

## 📁 Struktura plików

```
Maintly-Presentation/
├── index.html                  ← Główny plik (otwórz w przeglądarce)
├── css/
│   └── custom-theme.css        ← Stylizacja (kolory, fonty, layout)
├── images/                     ← Umieść screenshoty z aplikacji
├── videos/                     ← Umieść Demo video (opcjonalnie)
├── QUICKSTART-WINDOWS.md       ← 👈 INSTRUKCJA DO EXPORTU PPTX
├── README.md                   ← Ten plik
└── .gitignore
```

---

## 🎨 Cechy Designu

✅ **Minimalistyczny design** - ciemne tło (#0f172a), niebieski/cyan accent  
✅ **Responsywny** - działa na projekcie i na telefonie  
✅ **Reveal.js** - profesjonalne przejścia między slajdami  
✅ **Skrupulatny** - każdy slajd ma szczegółowe treści  
✅ **Technologiczny** - dedykowany slajd nr 6 z wszystkimi tech stack'ami
✅ **Production-ready** - gotowy do wyeksportowania do PPTX

---

## 🚀 JAK WYEKSPORTOWAĆ DO PPTX? ❓

### 📋 SPOSOBEM NAJSZYBSZYM: (dla Windowsa)

**Otwórz PowerShell i wpisz:**

```powershell
cd C:\Users\Macie\Desktop\Maintly-Presentation

npm install -g decktape

decktape reveal index.html presentation.pptx
```

**Czekaj 1-2 minuty. Gotowy `presentation.pptx` pojawi się w folderze!**

### 📖 SZCZEGÓŁOWA INSTRUKCJA:

Patrz plik: **[QUICKSTART-WINDOWS.md](QUICKSTART-WINDOWS.md)** ← Tam wszystko krok po kroku

---

## 🌐 Alternatywy Exportu

```powershell
# PDF (do druku)
decktape reveal index.html presentation.pdf

# Wyższa jakość (1920x1440)
decktape reveal index.html presentation.pptx --size 1920x1440

# HTML slides (bez konwersji)
decktape reveal index.html presentation.html
```

---

## ✏️ Jak edytować slajdy?

### 1. Edytuj HTML (`index.html`)

Wszystkie slajdy w prostych `<section>` tagach:

```html
<section>
    <h2>Tytuł Slajdu</h2>
    <p>Zawartość...</p>
    <ul>
        <li>Punkt 1</li>
        <li>Punkt 2</li>
    </ul>
</section>
```

### 2. Dodaj obrazy/screenshoty

```html
<section>
    <h3>Screenshot z aplikacji</h3>
    <img src="images/dashboard.png" alt="Dashboard" />
</section>
```

Umieść obrazy w folderze `images/`.

### 3. Zmień kolory (CSS)

Edytuj `css/custom-theme.css`:

```css
:root {
    --primary-color: #1e40af;      /* Niebieski */
    --accent-color: #06b6d4;       /* Cyan */
    --bg-dark: #0f172a;            /* Ciemne tło */
}
```

---

## 💡 Ważne: Slajd #6 - Wykorzystane Technologie

Ten slajd pokazuje wszystkie narzędzia używane w projekcie:

**Backend:**
- Symfony 7.3, PHP 8.4, MySQL 8.4, Doctrine ORM, JWT, Messenger, OpenAPI

**Frontend:**
- React 18, TypeScript 5.x, Vite 5.x, MDB React, React Router 7.x, i18next, Axios

**DevOps:**
- Docker, Nginx, Mailhog

To jest kluczowy punkt do pokazania wiedzy technicznej!

---

## 🎬 Wkład Demo Video (opcjonalnie)

Jeśli chcesz pokazać video (nagranie demo):

```html
<section>
    <h3>Demo Aplikacji</h3>
    <video width="800" height="500" controls>
        <source src="videos/demo.mp4" type="video/mp4" />
        Twoja przeglądarka nie wspiera video.
    </video>
</section>
```

---

## 📋 Checklist przed Obedą

- [ ] **Sprawdź treść** - przeczytaj wszystkie 10 slajdów
- [ ] **Dodaj zdjęcia** - umieść screenshoty w `images/`
- [ ] **Otwórz w przeglądarce** - `start index.html` i sprawdzaj F5
- [ ] **Wygeneruj PPTX** - `decktape reveal index.html presentation.pptx`
- [ ] **Edytuj w PowerPoint** - jeśli czego brakuje
- [ ] **Wydrukuj/Export PDF** - do przenoszenia
- [ ] **Przećwicz demo** - 2-3 razy, powtórz tekst
- [ ] **Sprawdź czasy:**
  - Slajd 1 (Tytuł) - 30 sec
  - Slajd 2-5 (Problem, Cel, Wymagania, Architektura) - 2 min
  - Slajd 6 (Technologie) - 1 min (zwięźle!)
  - Slajd 7-8 (Implementacja, Testowanie) - 1.5 min
  - Slajd 9-10 (Wnioski, Podziękowania) - 1 min
  - **RAZEM: ~6 minut** + ~1-2 min na pytania = 7-8 minut ✅

---

## 🎯 Tips na Obronę

1. **Nie czytaj ze slajdów** - mów swoimi słowami
2. **Slajdy = outline** - każdy to 30-60 sekund
3. **Demo żywe > Screenshots** - pokaż aplikację działającą
4. **Technologie (slajd 6)** - mów twierdzą, dlaczego wybrałeś każdy tech
5. **Przygotuj backup:**
   - PDF na pendrive
   - Link do GitHub repo
   - Nagranie screen flow
6. **Testuj projektor** - sprawdzaj czytelność

---

## 🔧 Troubleshooting

### Decktape się nie instaluje

```powershell
# Sprawdź czy masz Node.js
node --version

# Zainstaluj ponownie
npm install -g decktape@latest
```

### PPTX 'ma złe formatowanie

```powershell
# Wbij wyższą rozdzielczość
decktape reveal index.html presentation.pptx --size 1920x1440

# Lub zwiększ pausę
decktape reveal index.html presentation.pptx --pause 1500
```

### Obrazy się nie wczytują

- Umieść je w folderze `images/` (mała litera!)
- W HTML'u: `<img src="images/nazwa.png" />`
- Odśwież (Ctrl+F5)

---

## 📚 Przydatne Linki

- [Reveal.js Dokumentacja](https://revealjs.com/)
- [Decktape GitHub](https://github.com/astefanutti/decktape)
- [Reveal.js Themes](https://github.com/hakimel/reveal.js/wiki/Themes)
- [Markdown w Reveal.js](https://revealjs.com/markdown/)

---

## 📝 Ostatnia rada

> **NAJWAŻNIEJSZE:**
> 
> - Prezentacja ma **10 slajdów** - każdy ma konkretny cel
> - **Slajd #6 (Technologie)** - to jest Twoja szansa, żeby pokazać wiedzę
> - Generator PPTX (`decktape`) - zajmuje **1 komendę** 
> - Po exportzie możesz dalej edytować w PowerPoint/Canvie

---

**Powodzenia na obronie!** 🎓🚀
