# ⚡ Quick Start - WLO Metadata Agent Light

**Von 0 auf 100 in 5 Minuten!** 🚀

**Status:** ✅ **FUNKTIONIERT** - Version 2.1.4 ist produktionsreif!

---

## 1️⃣ Icons kopieren (30 Sekunden)

**PowerShell:**
```powershell
cd c:\Users\jan\staging\Windsurf\metadata-agent\metadata-browser-plugin-light
mkdir icons
copy ..\metadata-browser-plugin\icons\*.png icons\
```

**Oder Windows Explorer:**
- Kopiere Icons von `metadata-browser-plugin/icons/` nach `metadata-browser-plugin-light/icons/`

---

## 2️⃣ Plugin installieren (1 Minute)

1. **Chrome öffnen:** `chrome://extensions/`
2. **Developer Mode:** Toggle oben rechts AN
3. **Load unpacked:** Wähle Ordner `metadata-browser-plugin-light/`
4. **✅ Fertig!**

---

## 3️⃣ Ersten Test (2 Minuten)

### **Test-Szenario:**

1. **Wikipedia öffnen:**
   ```
   https://de.wikipedia.org/wiki/Künstliche_Intelligenz
   ```

2. **Plugin klicken:**
   - Plugin-Icon in Toolbar
   - Popup sollte sich öffnen

3. **"Inhalt teilen" klicken:**
   - Canvas öffnet sich rechts (Sidebar)
   - Daten werden extrahiert & angezeigt

4. **Im Canvas:**
   - Prüfe Titel ✅
   - Prüfe URL ✅
   - Prüfe Beschreibung ✅

5. **"Einreichen" klicken:**
   - Canvas schließt sich
   - Notification: "✅ Inhalt erfolgreich geteilt!"

---

## 4️⃣ Debugging (1 Minute)

**Background Console öffnen:**
```
chrome://extensions/ 
→ WLO Metadata Agent Light
→ "Service Worker"
```

**Erwartete Logs:**
```
🚀 WLO Metadata Agent Light - Background Script loaded
🔧 Config: {...}
```

**Bei Fehlern:**
- Schaue in Console (Fehlermeldungen)
- Siehe `SETUP.md` für Debugging-Guide

---

## 5️⃣ Anpassungen (1 Minute)

### **Canvas-URL ändern:**

**Datei:** `content.js` (Zeile 121)
```javascript
const canvasUrl = new URL('https://DEINE-URL.vercel.app/');
```

### **Repository ändern:**

**Datei:** `background.js` (Zeile 6)
```javascript
baseUrl: 'https://repository.DEINE-INSTANZ.de/edu-sharing/',
```

---

## ✅ Checkliste

- [ ] Icons kopiert ✅
- [ ] Plugin installiert ✅
- [ ] Test-Webseite geöffnet ✅
- [ ] Canvas öffnet sich ✅
- [ ] Submission funktioniert ✅
- [ ] Success-Notification erscheint ✅

---

## 🐛 Probleme?

| Problem | Lösung |
|---------|--------|
| Icons fehlen | Kopiere von altem Plugin |
| Canvas öffnet nicht | Seite neu laden (F5) |
| Submit fehlschlägt | Schaue Background Console |
| Keine Notifications | Erlaube Browser-Notifications |

---

## 📚 Weitere Dokumentation

- **Ausführliche Anleitung:** `SETUP.md`
- **Features-Übersicht:** `FEATURES.md`
- **Architektur:** `README.md`

---

## 🎯 Next Steps

Nach dem ersten erfolgreichen Test:

1. **Produktiv nutzen:**
   - Öffne echte Bildungs-Webseiten
   - Teile wertvolle Inhalte
   - Sammle Feedback

2. **Konfiguration anpassen:**
   - Canvas-URL setzen (falls anders)
   - Repository-URL setzen (Produktion?)
   - Guest-User anpassen (falls anders)

3. **Features erweitern:**
   - Siehe `FEATURES.md` → Roadmap
   - Pull Requests willkommen! 🙌

---

**Viel Erfolg! 🎉**

Bei Fragen → https://wirlernenonline.de/faq/
