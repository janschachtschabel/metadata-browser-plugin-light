# 📝 Changelog - WLO Metadata Agent Light

## [2.2.0] - 2025-01-19 🎉 **DUBLETTEN-CHECK HINZUGEFÜGT**

### ✨ New Feature - Dubletten-Prüfung
- **Automatische Prüfung** vor dem Öffnen der Canvas
- **Verhindert doppelte Einreichungen** - User sieht sofort wenn URL bereits existiert
- **Schöne Info-UI** mit Titel, Beschreibung und Link zum bestehenden Inhalt
- **Non-blocking** - Bei API-Fehler wird normal fortgefahren

### 🔧 Technical Details
- Repository Search API Integration (`/search/v1/queries/-home-/mds_oeh/ngsearch`)
- Exakter URL-Match auf `ccm:wwwurl` Property
- Dynamisches Duplicate-State UI im Popup
- Link zum Repository-Inhalt
- Graceful error handling

---

## [2.1.4] - 2025-01-19 ✅ **PRODUKTIONSREIF**

### 🎉 Major Fix - Funktioniert jetzt komplett!
- **Array-Normalisierung wie Webkomponente** - ALLE Metadaten-Werte werden zu Arrays normalisiert
- **Error 400 behoben** - CreateNode funktioniert jetzt korrekt
- **URL im Textfeld** - URL erscheint im Canvas-Eingabefeld
- **Erfolgreiche Submissions** - Nodes werden erfolgreich im Repository erstellt

### 🔧 Technical Changes
- Übernommen: Exakte Metadaten-Normalisierung vom `repository-proxy.js`
- Filter für null/empty Werte vor Normalisierung
- Detailliertes Error-Logging für Debugging
- versionComment auf MAIN_FILE_UPLOAD geändert

---

## [2.1.3] - 2025-01-19

### 🐛 Fixed
- versionComment Parameter korrigiert (Canvas_Upload → MAIN_FILE_UPLOAD)
- LogLevel-Fehler behoben

---

## [2.1.0-2.1.2] - 2025-01-19

### 🔧 Improvements
- Titel & URL Datenübergabe verbessert
- postMessage Format angepasst
- Background.js Submission-Logik vom alten Plugin übernommen
- Detailliertes Error-Logging hinzugefügt

---

## [2.0.1] - 2025-01-19

### ✨ Added
- **WLO-Eule Integration** 🦉
  - Eule im Popup-Header (Float-Animation)
  - Eule im Success-State (Bounce-Animation + Checkmark)
  - `images/` Ordner zu web_accessible_resources

---

## [2.0.0] - 2025-01-19

### 🚀 Initial Release

#### ✨ Features
- **Gast-Modus** - Kein Login erforderlich
- **Eingebaute Datenextraktion** - Kein externer Crawler
- **Canvas-Integration** - Kompatibel mit Vercel-App
- **Modernes UI** - Purple/Blue Branding, States, Animationen
- **Vorschau-Link** - Link zum Repository nach Submission
- **Smart Notifications** - In-Page + Chrome Notifications
- **Robustes Error-Handling** - Keine Crashes

#### 📦 Technisch
- Manifest V3
- Pure JavaScript (keine Dependencies)
- ~20 KB Bundle-Size
- 7 Dateien (minimal!)
- Content Script für Datenextraktion
- Background Script für Repository API

#### 🎯 Workflow
1. User klickt Plugin → "Inhalt teilen"
2. Page-Data wird extrahiert
3. Canvas öffnet in Sidebar
4. KI-Analyse + Bearbeitung
5. Submit ans Repository
6. Success-Notification + Preview-Link

---

## 🔮 Roadmap

### v2.1.0 (geplant)
- [ ] Benutzer-Login (User-Mode)
- [ ] Dubletten-Prüfung
- [ ] Collections-Auswahl
- [ ] Dark Mode

### v2.2.0 (geplant)
- [ ] Offline-Modus
- [ ] Batch-Upload
- [ ] Favoriten
- [ ] Statistiken

### v2.3.0 (geplant)
- [ ] Firefox-Support
- [ ] Safari-Support
- [ ] i18n (Mehrsprachigkeit)

---

**Made with 💜 for Wir Lernen Online**
