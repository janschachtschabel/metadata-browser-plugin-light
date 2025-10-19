# 🚀 Setup - WLO Metadata Agent Light

## 1️⃣ Icons kopieren

Das Plugin benötigt Icons. Kopiere sie vom alten Plugin:

### **Option A: PowerShell (Empfohlen)**

```powershell
# Im Ordner metadata-browser-plugin-light/
New-Item -ItemType Directory -Path "icons" -Force
Copy-Item -Path "..\metadata-browser-plugin\icons\*" -Destination ".\icons\" -Recurse
```

### **Option B: Windows Explorer**

1. Öffne `metadata-browser-plugin/icons/`
2. Kopiere alle Icon-Dateien
3. Füge sie ein in `metadata-browser-plugin-light/icons/`

### **Option C: Eigene Icons**

Erstelle eigene Icons in diesen Größen:
- `16.png` - 16x16 px
- `32.png` - 32x32 px
- `48.png` - 48x48 px
- `128.png` - 128x128 px

---

## 2️⃣ Plugin installieren

### **Chrome/Edge:**

1. **Öffne Extensions:**
   ```
   chrome://extensions/
   ```

2. **Developer Mode aktivieren:**
   - Schalter oben rechts

3. **Plugin laden:**
   - Klick "Load unpacked" / "Entpackte Erweiterung laden"
   - Wähle Ordner: `metadata-browser-plugin-light/`

4. **✅ Plugin ist installiert!**

---

## 3️⃣ Testen

### **Test 1: Plugin öffnen**

1. Klick auf das Plugin-Icon in der Toolbar
2. Du solltest sehen:
   - WLO-Eule Logo
   - "Wir lernen online" Titel
   - "Inhalt teilen" Button

### **Test 2: Datenextraktion**

1. Öffne eine Webseite (z.B. Wikipedia)
2. Klick Plugin-Icon → "Inhalt teilen"
3. Canvas sollte sich in Sidebar öffnen
4. Im Canvas sollten Daten erscheinen:
   - Titel der Webseite
   - URL
   - Beschreibung (falls vorhanden)

### **Test 3: Submission**

1. Fülle Felder im Canvas aus
2. Klick "Einreichen"
3. Du solltest sehen:
   - Notification: "✅ Inhalt erfolgreich geteilt!"
   - Canvas schließt sich
   - (Optional) Vorschau-Link im Repository

---

## 4️⃣ Debugging

### **Background Console öffnen:**

```
chrome://extensions/
→ WLO Metadata Agent Light
→ Klick "Service Worker"
```

**Erwartete Logs:**
```
🚀 WLO Metadata Agent Light - Background Script loaded
🔧 Config: {...}
```

### **Content Script Console:**

1. Öffne Webseite
2. Drücke F12 (DevTools)
3. Wechsel zu "Console"

**Erwartete Logs:**
```
🔧 WLO Metadata Agent Light - Content Script loaded
```

### **Popup Console:**

1. Rechtsklick auf Plugin-Icon
2. "Inspect" / "Untersuchen"

**Erwartete Logs:**
```
🎨 WLO Metadata Agent Light - Popup loaded
✅ Popup initialized
```

---

## 5️⃣ Konfiguration anpassen

### **Canvas URL ändern:**

**Datei:** `content.js` (Zeile 121)

```javascript
const canvasUrl = new URL('https://deine-canvas-url.vercel.app/');
```

### **Repository URL ändern:**

**Datei:** `background.js` (Zeile 5-7)

```javascript
repository: {
    baseUrl: 'https://repository.production.openeduhub.net/edu-sharing/',
    // ...
}
```

### **Guest User ändern:**

**Datei:** `background.js` (Zeile 8-11)

```javascript
guestUser: {
    username: 'IHR-USERNAME',
    password: 'IHR-PASSWORT'
}
```

---

## 6️⃣ Häufige Probleme

### **Problem: Icons werden nicht angezeigt**

**Lösung:** Icons-Ordner fehlt oder ist leer
```powershell
# Icons vom alten Plugin kopieren
Copy-Item -Path "..\metadata-browser-plugin\icons\*" -Destination ".\icons\" -Recurse
```

### **Problem: Canvas öffnet sich nicht**

**Lösung 1:** Content Script nicht geladen
- Seite neu laden (F5)
- Plugin erneut klicken

**Lösung 2:** Canvas-URL falsch
- Prüfe Console (F12)
- Schaue in `content.js` Zeile 121

### **Problem: "Create node failed: 400"**

**Lösung:** Pflichtfelder fehlen
- Prüfe dass Titel & URL ausgefüllt sind
- Schaue Background Console für Details

### **Problem: Submission hängt**

**Lösung:** Background Script crashed
```
chrome://extensions/
→ WLO Metadata Agent Light
→ Klick "Service Worker" (startet neu)
```

---

## 7️⃣ Vergleich Alt vs. Light

| Feature | Altes Plugin | Light Plugin |
|---------|-------------|--------------|
| Größe | ~500 KB | ~20 KB |
| Dateien | 15+ | 7 |
| Crawler | ✅ Ja | ❌ Nein (eingebaut) |
| Login | ✅ Ja | 🔜 Geplant |
| Gast-Modus | ✅ Ja | ✅ Ja |
| UI | Komplex | Minimalistisch |
| Setup | Komplex | Einfach |

---

## ✅ Checkliste

- [ ] Icons kopiert
- [ ] Plugin installiert in Chrome
- [ ] Plugin-Icon erscheint in Toolbar
- [ ] Popup öffnet sich beim Klick
- [ ] Test-Webseite geöffnet
- [ ] "Inhalt teilen" funktioniert
- [ ] Canvas öffnet sich in Sidebar
- [ ] Daten werden angezeigt im Canvas
- [ ] Submission funktioniert
- [ ] Success-Notification erscheint

---

**Bei Problemen → Siehe Debugging-Sektion oben! 🐛**
