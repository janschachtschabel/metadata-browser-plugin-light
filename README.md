# 🦉 WLO Metadata Agent Light

**Version 2.1.4** ✅ **PRODUKTIONSREIF** - Schlankes Browser-Plugin für schnelles Teilen von Bildungsinhalten

---

## ✨ Features

- ✅ **Funktioniert!** - Erfolgreich getestet und einsatzbereit
- ✅ **Minimalistisch** - Nur 7 Dateien, ~25 KB, keine Dependencies
- ✅ **Gast-Modus** - Kein Login erforderlich (User-Mode kommt später)
- ✅ **KI-gestützt** - Automatische Metadaten-Extraktion via Canvas-Webkomponente
- ✅ **Schnell** - Direkte Integration mit WLO Repository API
- ✅ **Modern** - Schöne UI mit WLO-Eule und Purple/Blue-Branding

---

## 🎯 Unterschiede zum alten Plugin

### **Entfernt:**
- ❌ Generischer Crawler (nicht mehr benötigt)
- ❌ Login/User-Modus (kommt später)
- ❌ Dubletten-Prüfung (vereinfacht)
- ❌ Komplexe Konfiguration

### **Neu:**
- ✅ Eingebaute Datenextraktion (kein externer Crawler)
- ✅ Direkte Canvas-Integration
- ✅ Vorschau-Link nach Submission
- ✅ Modernere UI
- ✅ Besseres Error-Handling
- ✅ Notification-System

---

## 🚀 Installation

### **Chrome/Edge:**

1. Öffne `chrome://extensions/`
2. Aktiviere "Entwicklermodus" (oben rechts)
3. Klicke "Entpackte Erweiterung laden"
4. Wähle den Ordner `metadata-browser-plugin-light/`
5. ✅ Plugin ist installiert!

### **Icons kopieren:**

Das Plugin benötigt Icons im `icons/` Ordner. Kopiere die Icons vom alten Plugin:

```bash
# PowerShell
Copy-Item -Path "..\metadata-browser-plugin\icons\*" -Destination ".\icons\" -Recurse
```

Oder erstelle eigene Icons (16x16, 32x32, 48x48, 128x128 px).

---

## 📖 Nutzung

### **1. Inhalt teilen:**

1. Öffne eine Webseite mit Bildungsinhalten
2. Klicke auf das WLO-Plugin-Icon
3. Klicke "Inhalt teilen"
4. **Canvas öffnet sich** in der Sidebar
5. Prüfe/Bearbeite die Metadaten
6. Klicke "Einreichen" im Canvas
7. ✅ Fertig!

### **2. Workflow:**

```
Browser-Plugin
    ↓ (extrahiert Daten)
Canvas-Komponente
    ↓ (KI-Analyse & Bearbeitung)
Browser-Plugin
    ↓ (sendet ans Repository)
WLO Repository
    ✅ Inhalt gespeichert
```

---

## 🔧 Architektur

### **Dateien:**

```
metadata-browser-plugin-light/
├── manifest.json          # Chrome Extension Manifest V3
├── popup.html            # Plugin-Popup UI
├── popup.css             # Styles für Popup
├── popup.js              # Popup Logic
├── content.js            # Content Script (Datenextraktion)
├── background.js         # Background Script (Repository API)
├── icons/                # Plugin Icons
└── README.md             # Diese Datei
```

### **Flow:**

**1. Datenextraktion (content.js):**
- Extrahiert Titel, Beschreibung, Keywords, etc.
- Liest Meta-Tags & Structured Data
- Extrahiert Hauptinhalt

**2. Canvas-Integration (content.js):**
- Öffnet Canvas in Sidebar (600px)
- Sendet Page-Data via postMessage
- Empfängt Metadaten zurück

**3. Repository-Submission (background.js):**
- Erstellt Node mit 5 essentiellen Feldern
- Setzt restliche Metadaten
- Startet Workflow (optional)
- Zeigt Success/Error Notifications

---

## 🎨 Canvas-Integration

Das Plugin ist **kompatibel** mit der bestehenden Canvas-Webkomponente:

**Canvas URL:**
```
https://metadata-agent-canvas.vercel.app/
  ?mode=browser-extension
  &theme=edu-sharing
```

**postMessage Format:**
```javascript
{
  type: 'PLUGIN_PAGE_DATA',
  data: {
    url: 'https://...',
    title: '...',
    description: '...',
    mainContent: { text: '...', html: '...' },
    // ...
  },
  mode: 'browser-extension'
}
```

**Response Format:**
```javascript
{
  type: 'CANVAS_METADATA_READY',
  metadata: {
    'cclom:title': '...',
    'cclom:general_description': '...',
    'ccm:wwwurl': '...',
    // ...
  }
}
```

---

## 🔐 Konfiguration

### **Repository:**

In `background.js` (Zeile 5-19):

```javascript
const CONFIG = {
    repository: {
        baseUrl: 'https://repository.staging.openeduhub.net/edu-sharing/',
        guestUser: {
            username: 'WLO-Upload',
            password: 'wlo#upload!20'
        }
    },
    // ...
};
```

### **Canvas URL:**

Ändern in `background.js` und `content.js`:

```javascript
const canvasUrl = 'https://metadata-agent-canvas.vercel.app/';
```

---

## 🐛 Debugging

### **Console Logs:**

**Popup Console:**
- Öffne Plugin → Rechtsklick → "Untersuchen"

**Background Console:**
- `chrome://extensions/` → "Service Worker"

**Content Script Console:**
- F12 auf der Webseite → Console

### **Logs aktiviert:**

Alle Scripts loggen ausführlich:
```
🚀 Background Script loaded
📥 Message received: ...
✅ Node created: abc123
```

---

## 🎯 Roadmap

### **v2.1.0 (geplant):**
- [ ] Benutzer-Login (User-Mode)
- [ ] Dubletten-Prüfung
- [ ] Collections-Auswahl
- [ ] Dark Mode

### **v2.2.0 (geplant):**
- [ ] Offline-Modus
- [ ] Batch-Upload
- [ ] Favoriten
- [ ] Statistiken

---

## 📝 Changelog

### **v2.0.0 (2025-01-19)**
- ✅ Initial Release
- ✅ Gast-Modus implementiert
- ✅ Canvas-Integration
- ✅ Moderne UI
- ✅ Direkter Repository-Upload

---

## 🤝 Kompatibilität

- ✅ **Chrome** 88+
- ✅ **Edge** 88+
- ✅ **Brave** (Chrome-basiert)
- ✅ **Opera** (Chrome-basiert)
- ❌ Firefox (anderes Extension-Format)

---

## 📜 Lizenz

GPL-3.0 - Siehe LICENSE

---

## 🙋 Support

- **FAQ:** https://wirlernenonline.de/faq/
- **Über WLO:** https://wirlernenonline.de/about/
- **Issues:** GitHub Issues

---

**Made with 💜 for Wir Lernen Online**
