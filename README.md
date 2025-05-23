# 💬 wa-base-bot

Ein moderner und modularer WhatsApp-Bot auf Basis von [Baileys](https://github.com/Barons-Team/baron-baileys-v2), optimiert für einfache Erweiterbarkeit und Automatisierung.

![Bot-Logo](./media/thumb.jpg)

---

## 🚀 Funktionen

- ⚙️ Unterstützt Multi-Device via Baileys
- 🧩 Dynamisches Command-System (`baron.js`)
- 💾 Eigene Einstellungen in `dev/`
- 🎛️ Einfache Konfiguration & Struktur
- 📜 Automatische Nachrichten speicherung `messages.json`
- 🖥️ Bash-Skripte zum einfachen Starten & Installieren

---
## Infos
- German: Dies ist kein Vollständiger Bot sondern dient als Base
- English: This is not a complete bot but serves as a base
---

## 🛠️ Installation

### Voraussetzungen

- [Node.js](https://nodejs.org/) v18 oder höher
- Git / Terminal (Linux, macOS oder Windows mit Bash)

### Schritte

```bash
# Repository klonen
git clone https://github.com/Barons-Team/wa-base-bot.git
cd wa-base-bot

# Abhängigkeiten installieren
npm install
```

Alternativ kann auch das Skript `install.sh` verwendet werden:

```bash
bash install.sh
```

---

## ▶️ Start

### Manuell

```bash
node index.js
```

### Automatisiert (Linux/Mac)

```bash
bash start.sh
```

---

## 📁 Projektstruktur

```text
wa-base-bot/
├── index.js              # AutoRestarter
├── baron.js              # Bot-Funktionen
├── server.js             # Server (main)
├── dev/                  # Einstellungen, IDs, Befehle
│   ├── cmd.js            # Console Cmd
│   ├── id.js             # IDs Maker
│   ├── setting.js        # Globale Einstellungen
├── messages.json         # Nachrichten
├── media/thumb.jpg       # Vorschau/Thumbnail für den Bot
├── start.sh              # Start-Skript
├── install.sh            # Setup-Skript
```

---

## 📦 Beispielbefehl (aus `baron.js`)

```js
 case 'ping':
                          case 'p':
                            {
                              if (!isBot && !isCreator) return
                
                                   async function loading (jid) {
                             
                                    let start = new Date;
                                    let { key } = await conn.sendMessage(jid, {text: 'warte..'})
                                    let done = new Date - start;
                                    var lod = `*Pong*:\n> ⏱️ ${done}ms (${Math.round(done / 100) / 10}s)`
                                    
                                    await sleep(1000)
                                    await conn.sendMessage(jid, {text: lod, edit: key });
                                    }
                                    loading(from)
                                   
                            }       
                            break;

```

---

## 📋 Lizenz

MIT License – siehe [`LICENSE`](./LICENSE)

---

## 🙋 Fragen oder Hilfe?

- Projekt von [Barons-Team](https://github.com/Barons-Team)
- Instagram: @6u.cg
- Telegram: @xyqr0
- Telegram Channel: [Link](https://t.me/wegschleifen)

---
