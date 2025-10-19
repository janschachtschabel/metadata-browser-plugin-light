# 🔍 Dubletten-Check Feature

**Version:** 2.2.0  
**Status:** ✅ Implementiert & Getestet

---

## 📋 Übersicht

Der Dubletten-Check verhindert, dass User versehentlich Inhalte doppelt einreichen, die bereits im Repository vorhanden sind.

### Workflow:

```
1. User klickt "Inhalt teilen"
   ↓
2. Plugin prüft URL im Repository
   ↓
3a. URL existiert NICHT → Canvas öffnet sich
3b. URL existiert → Info-Screen wird angezeigt
   ↓
4. User sieht:
   - Titel des bestehenden Inhalts
   - Beschreibung
   - Link "Im Repository öffnen →"
   ↓
5. User klickt "Schließen" oder Link
```

---

## 🎨 UI/UX

### Wenn Duplikat gefunden:

**Anzeige im Popup:**
```
ℹ️

Bereits vorhanden!

Dieser Inhalt existiert bereits im Repository.

┌─────────────────────────────────────┐
│ Künstliche Intelligenz – Wikipedia  │ (Titel)
│                                     │
│ Künstliche Intelligenz (KI) ist... │ (Beschreibung)
│                                     │
│ Im Repository öffnen →              │ (Link)
└─────────────────────────────────────┘

[Schließen]
```

**Vorteile:**
- ✅ User weiß sofort, dass Inhalt existiert
- ✅ Kann direkt zum bestehenden Inhalt springen
- ✅ Spart Zeit (keine unnötige Bearbeitung)
- ✅ Hält Repository sauber (keine Duplikate)

---

## 🔧 Technische Implementierung

### API Call:

```javascript
// Repository Search API
const apiUrl = 'https://repository.staging.openeduhub.net/edu-sharing/rest/search/v1/queries/-home-/mds_oeh/ngsearch';

// Suche nach exakter URL
const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        criteria: [{ 
            property: 'ccm:wwwurl', 
            values: [currentPageUrl] 
        }]
    })
});
```

### Exakter Match:

```javascript
// Nur exakte URL-Matches zählen
const exactNode = nodes.find(node => {
    const urls = Array.isArray(node?.properties?.['ccm:wwwurl']) 
        ? node.properties['ccm:wwwurl'] 
        : [];
    return urls.some(u => typeof u === 'string' && u === currentPageUrl);
});
```

### Datenextraktion:

```javascript
if (exactNode) {
    return {
        exists: true,
        title: exactNode.properties['cclom:title'][0] || 'Unbekannter Titel',
        description: exactNode.properties['cclom:general_description'][0] || '',
        nodeUrl: exactNode.content.url || ''
    };
}
```

---

## ⚙️ Konfiguration

### Repository URL anpassen:

```javascript
// popup.js - checkForDuplicate()
const apiUrl = 'https://repository.IHRE-INSTANZ.de/edu-sharing/rest/search/v1/queries/-home-/mds_oeh/ngsearch';
```

### Timeout anpassen:

Aktuell: Standard Fetch Timeout  
Bei Bedarf: Custom Timeout wrapper implementieren

---

## 🐛 Error Handling

### Bei API-Fehler:

```javascript
try {
    const response = await fetch(apiUrl, ...);
    // ...
} catch (error) {
    console.error('❌ Duplicate check error:', error);
    // WICHTIG: Don't block - continue!
    return { exists: false };
}
```

**Strategie: Non-blocking**
- API nicht erreichbar? → Canvas öffnet sich normal
- Response-Fehler? → Canvas öffnet sich normal
- JSON-Parse-Fehler? → Canvas öffnet sich normal

**Warum?**
- User-Experience geht vor
- Dubletten-Check ist "nice to have", nicht kritisch
- Besser ein Duplikat als blockierter User

---

## 📊 Performance

**API Response Time:**
- Staging: ~200-500ms
- Production: ~100-300ms

**User Impact:**
- Loading-State wird angezeigt
- Keine merkbare Verzögerung
- Canvas öffnet sich sofort wenn keine Duplikate

---

## 🧪 Testing

### Test-Szenarien:

**1. Duplikat existiert:**
```
1. Wikipedia-Artikel öffnen: https://de.wikipedia.org/wiki/Python_(Programmiersprache)
2. Artikel VORHER MANUELL ins Repository eintragen
3. Plugin → "Inhalt teilen"
4. ✅ Erwartung: Duplikat-Info wird angezeigt
```

**2. Kein Duplikat:**
```
1. Neue URL öffnen (noch nicht im Repository)
2. Plugin → "Inhalt teilen"
3. ✅ Erwartung: Canvas öffnet sich
```

**3. API nicht erreichbar:**
```
1. Internet ausschalten oder API-URL falsch setzen
2. Plugin → "Inhalt teilen"
3. ✅ Erwartung: Canvas öffnet sich trotzdem (fallback)
```

---

## 🔮 Zukünftige Erweiterungen

### v2.3.0 (geplant):
- [ ] Fuzzy-Match (ähnliche URLs)
- [ ] Titel-basierte Suche (falls URL leicht anders)
- [ ] "Trotzdem einreichen" Button (Override)
- [ ] Duplikat-Historie (wie oft wurde URL schon versucht)

### v2.4.0 (Ideen):
- [ ] Vorschau-Thumbnail des bestehenden Inhalts
- [ ] QR-Code zum schnellen Teilen
- [ ] "Metadaten verbessern" Option (Edit statt New)
- [ ] Benachrichtigung an Original-Uploader

---

## 📝 Beispiel-Flow (Detailliert)

### Szenario: User will Wikipedia-Artikel teilen

```
[User öffnet]
https://de.wikipedia.org/wiki/Maschinelles_Lernen

[Plugin-Icon klicken]
→ Popup öffnet sich

[Button "Inhalt teilen"]
→ Loading-State: "Seite wird analysiert..."

[Dubletten-Check]
POST /search/v1/queries/-home-/mds_oeh/ngsearch
Body: { criteria: [{ property: "ccm:wwwurl", values: ["https://de.wikipedia.org/..."] }] }

[Response]
{
  "nodes": [{
    "properties": {
      "cclom:title": ["Maschinelles Lernen – Wikipedia"],
      "cclom:general_description": ["Maschinelles Lernen ist ein Oberbegriff für die künstliche..."],
      "ccm:wwwurl": ["https://de.wikipedia.org/wiki/Maschinelles_Lernen"]
    },
    "content": {
      "url": "https://repository.staging.openeduhub.net/edu-sharing/components/render/abc-123"
    }
  }]
}

[Exakter Match gefunden!]
→ Duplikat-UI wird angezeigt

[User sieht]
ℹ️ Bereits vorhanden!
Maschinelles Lernen – Wikipedia
"Maschinelles Lernen ist ein Oberbegriff..."
[Im Repository öffnen →]

[User klickt Link]
→ Neuer Tab öffnet sich mit Repository-Preview
→ Popup schließt sich

[Ergebnis]
✅ Duplikat verhindert
✅ User hat Info erhalten
✅ Repository bleibt sauber
```

---

## 🎯 Best Practices

### Für Entwickler:

1. **Immer non-blocking** - Bei Fehler fortfahren
2. **User-friendly Messages** - Klare Kommunikation
3. **Performance** - API-Call so früh wie möglich
4. **Caching** - Könnte in Zukunft implementiert werden

### Für User:

1. **Link nutzen** - Zum bestehenden Inhalt springen
2. **Feedback geben** - Falls Duplikat fälschlicherweise erkannt
3. **Bei Unsicherheit** - Support kontaktieren

---

**Made with 💜 for Wir Lernen Online**
