# ✨ Features - WLO Metadata Agent Light

## 🎯 Kern-Features

### 1. **Schnelle Datenextraktion** 
✅ **Automatisch extrahiert:**
- Titel (document.title)
- Meta-Tags (description, keywords, author, og:*)
- Structured Data (JSON-LD, Microdata)
- Hauptinhalt (intelligent selektiert)
- Sprache
- Bilder

✅ **Kein externer Crawler** - Alles im Browser!

---

### 2. **Moderne UI**

✅ **States:**
- **Ready:** "Inhalt teilen" Button mit Features
- **Loading:** Spinner mit "Seite wird analysiert..."
- **Success:** Checkmark + Vorschau-Link
- **Error:** Error-Icon + Retry-Button

✅ **Design:**
- Gradient-Background (Purple/Blue)
- WLO-Eule Logo prominent
- Clean & Minimalistisch
- Smooth Animations

---

### 3. **Canvas-Integration**

✅ **Sidebar-Canvas:**
- 600px Breite
- Rechts einblendend
- Smooth Transition
- PostMessage-Kommunikation

✅ **Flow:**
```
Plugin extrahiert Daten
    ↓ postMessage
Canvas verarbeitet/ergänzt (KI)
    ↓ postMessage zurück
Plugin submitted ans Repository
```

---

### 4. **Repository-Integration**

✅ **Guest-Mode:**
- Keine Anmeldung erforderlich
- Nutzt WLO-Upload User
- Automatische Workflow-Einreichung

✅ **API-Calls:**
1. **createNode:** 5 essentielle Felder
2. **setMetadata:** Restliche Metadaten
3. **startWorkflow:** Zur Prüfung einreichen (optional)

✅ **Smart Error-Handling:**
- JSON-Parse-Fehler abgefangen
- HTML-Responses erkannt
- User-friendly Error-Messages

---

### 5. **Notifications**

✅ **In-Page Notifications:**
- Success: Grüner Overlay mit ✅
- Error: Roter Overlay mit ❌
- Auto-verschwindet nach 4 Sekunden
- Slide-In Animation

✅ **Chrome Notifications:**
- "✅ Inhalt erfolgreich geteilt!"
- "❌ Fehler: ..."

---

### 6. **Vorschau-Link** (Innovation!)

✅ **Nach erfolgreicher Submission:**
- Link zum neuen Inhalt im Repository
- "Inhalt ansehen →" Button
- Öffnet in neuem Tab

**URL-Format:**
```
https://repository.staging.openeduhub.net/edu-sharing/components/render/{nodeId}
```

---

## 🔧 Technische Features

### **Manifest V3**
✅ Service Worker statt Background Page
✅ Permissions minimiert (nur activeTab + scripting)
✅ Content Security Policy konform

### **Cross-Origin-Safe**
✅ postMessage für iframe-Kommunikation
✅ Keine direkten DOM-Zugriffe auf Canvas
✅ Korrekte CORS-Headers

### **Robustes Error-Handling**
✅ Try-Catch um alle async Funktionen
✅ JSON-Parse mit Fallback
✅ Response-Validation
✅ Detaillierte Console-Logs

### **Performance**
✅ Lazy Loading (Content Script nur on-demand)
✅ Minimale Bundle-Size (~20 KB)
✅ Keine externe Dependencies
✅ Schnelle Page-Data-Extraktion

---

## 📊 Vergleich: Alt vs. Light

| Feature | Altes Plugin | Light Plugin |
|---------|-------------|--------------|
| **Bundle Size** | ~500 KB | ~20 KB |
| **Setup-Zeit** | 10+ min | 2 min |
| **Dateien** | 15+ | 7 |
| **Dependencies** | Viele | Keine |
| **UI-Framework** | Custom | Vanilla CSS |
| **Crawler** | Extern | Eingebaut |
| **Login** | ✅ Ja | 🔜 v2.1 |
| **Gast-Modus** | ✅ Ja | ✅ Ja |
| **Dubletten-Check** | ✅ Ja | 🔜 v2.1 |
| **Collections** | ✅ Ja | 🔜 v2.2 |
| **Vorschau-Link** | ❌ Nein | ✅ Ja! |
| **Notifications** | Basic | Advanced |
| **Error-Handling** | Basic | Robust |

---

## 🎨 UI/UX Verbesserungen

### **Vom alten Plugin übernommen:**
✅ WLO-Eule Logo
✅ Purple/Blue Branding
✅ "Wir lernen online" Titel
✅ Hilfe-Links im Footer

### **Neu hinzugefügt:**
✅ State-basiertes UI (Ready/Loading/Success/Error)
✅ Feature-Icons (🤖 KI, ⚡ Schnell)
✅ Gradient-Backgrounds
✅ Smooth Animations (fadeIn, slideIn)
✅ Moderne Buttons mit Icons
✅ Vorschau-Box für Repository-Link
✅ Better Visual Feedback

---

## 🚀 Innovations-Features

### **1. Vorschau-Link**
Nach Submission: Direkter Link zum Inhalt im Repository
```javascript
if (nodeId) {
    const previewUrl = `${repositoryUrl}/components/render/${nodeId}`;
    // Zeige Link in Success-State
}
```

### **2. In-Page Notifications**
Schöne Overlay-Notifications statt Browser-Alerts
```javascript
showNotification('success', 'Erfolgreich!', 'Dein Beitrag wurde geteilt.');
```

### **3. Smart Content-Extraction**
Intelligente Selektion des Hauptinhalts
```javascript
const selectors = ['main', 'article', '[role="main"]', ...];
// Findet relevanten Content automatisch
```

### **4. Structured Data Parsing**
Automatisches Parsen von JSON-LD & Microdata
```javascript
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
// Nutzt bereits vorhandene Strukturdaten
```

---

## 🔮 Geplante Features (Roadmap)

### **v2.1.0:**
- [ ] **Benutzer-Login** (User-Mode wie altes Plugin)
- [ ] **Dubletten-Prüfung** (check if URL exists)
- [ ] **Collections-Auswahl** (beim Submit)
- [ ] **Dark Mode** (für UI)

### **v2.2.0:**
- [ ] **Offline-Modus** (lokales Speichern bei offline)
- [ ] **Batch-Upload** (mehrere Seiten auf einmal)
- [ ] **Favoriten** (häufig genutzte Collections)
- [ ] **Statistiken** (eigene Submissions anzeigen)

### **v2.3.0:**
- [ ] **Firefox-Support** (WebExtension API)
- [ ] **Safari-Support** (iOS Extension)
- [ ] **Edge-Store** (Microsoft Store Release)
- [ ] **i18n** (Mehrsprachigkeit: EN, FR, ES)

---

## 💡 Verwendung der Features

### **Vorschau-Link nutzen:**

Nach erfolgreicher Submission:
1. Success-State wird angezeigt
2. Klick auf "Inhalt ansehen →"
3. Öffnet Repository-Preview in neuem Tab
4. Du siehst deinen Inhalt live!

### **Notifications anpassen:**

In `content.js` (Zeile 235):
```javascript
function showNotification(type, title, message) {
    // Passe Farben, Dauer, Position an
    const bgColor = type === 'success' ? '#48bb78' : '#f56565';
    // ...
}
```

### **Extraktion erweitern:**

In `content.js` (Zeile 36):
```javascript
const pageData = {
    url: window.location.href,
    title: document.title,
    // Füge weitere Felder hinzu:
    yourCustomField: extractYourData(),
    // ...
};
```

---

**Erstellt für Wir Lernen Online 💜**
