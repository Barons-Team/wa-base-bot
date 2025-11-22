require("./dev/settings.js")
const makeWASocket = require('baron-baileys-v2').default;
const {
default:
generateWAMessageFromContent,
getAggregateVotesInPollMessage,
downloadContentFromMessage,
useMultiFileAuthState,
generateWAMessage,
makeInMemoryStore,
DisconnectReason,
areJidsSameUser,
getContentType,
decryptPollVote,
relayMessage,
jidDecode,
Browsers,
proto,
} = require("baron-baileys-v2")
const FileType = require('file-type')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const readline = require("readline");
const _ = require('lodash')
const crypto = require('crypto');
const NodeCache = require("node-cache")
const path = require('path')
const yargs = require('yargs/yargs')
const chalk = require('chalk')
const PhoneNumber = require('awesome-phonenumber')
const settingsPath = './dev/setting.js';
const settings = require(settingsPath);
global.rootColor = settings.rootColor || '\x1b[31m'
global.root = ":[ C.M.D ]: "
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//==================================================================\\
const question = (text) => { return new Promise((resolve) => { rl.question(text, resolve) }) };
let menuActive = false;
async function startPrompt(conn) {
    const originalLog = console.log;
    let logTimeout = null;
    let promptTimeout = null;
    
    console.log = (...args) => {
        if (!logTimeout) {
            process.stdout.write('\n');
        }
        originalLog(...args);
        if (logTimeout) clearTimeout(logTimeout);
        logTimeout = setTimeout(() => {
            process.stdout.write('\n');
            logTimeout = null;
            if (!menuActive) {
                if (promptTimeout) clearTimeout(promptTimeout);
                promptTimeout = setTimeout(() => {
                    setRedPrompt(rootColor, root);
                }, 50);
            }
        }, 50);
    };
    
    function setRedPrompt(COLOR, PROMT) {
        if (!menuActive) {
            process.stdout.write(COLOR);
            rl.setPrompt(`\n${COLOR}${PROMT}`);
            rl.prompt();
            }
        }
        setRedPrompt(rootColor, root);
     const makeFakeCommand = async (m, conn, text, chatUpdate) => {
        let messages = await generateWAMessage(m.key.remoteJid, {
            text: text || '' 
        }, {
            quoted: m.quoted 
          }
        );
        messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = m.sender;
    
        let msg = {
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: "append",
        };
        return conn.ev.emit("messages.upsert", msg);
    }; 
        rl.on('line', (input) => {
            if (menuActive) return;
    
    const command = input.trim()
    if (command.startsWith(",")) {
    menuActive = true;
    require("./dev/cmd")(command, conn, rl, () => {
        menuActive = false;
        setRedPrompt(rootColor, root);
    });
    } else {
        const m = {
            key: {
            remoteJid: conn.user.id,

            id: "Baron"
        },
        sender: conn.user.id
    };
    makeFakeCommand(m, conn, command);
            }
        });
    }
//==================================================================\\
const saveMessagesToFile = (messages) => {
    const filePath = './messages.json';
    const messagesArray = Array.isArray(messages) ? messages : [messages];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const existingMessages = JSON.parse(fileData);
        const combinedMessages = [...existingMessages, ...messagesArray];
        fs.writeFileSync(filePath, JSON.stringify(combinedMessages, null, 2));
    } else {
        fs.writeFileSync(filePath, JSON.stringify(messagesArray, null, 2));
    }
};
//==================================================================\\
const msgRetryCounterCache = new NodeCache() 
const groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false})
async function baronStart() {
const { state, saveCreds } = await useMultiFileAuthState("./db/session")
const conn = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
cachedGroupMetadata: async (jid) => groupCache.get(jid),
});
//==================================================================\\
conn.ev.on('creds.update', saveCreds)
// store.bind(conn.ev);
if (!conn.authState.creds.registered) {
const phoneNumber = await question('Enter number: ');
await sleep(1000);
let code = await conn.requestPairingCode(phoneNumber.replace(/[^\d]/g, ''), global.pairingCode);
code = code?.match(/.{1,4}/g)?.join("-") || code;
await sleep(1000);
console.log(`code :`, code);
}
//==================================================================\\
conn.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (mek.key.id.startsWith('BAE5')) return
const m = mek
saveMessagesToFile(m);
require("./baron.js")(conn, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})
//==================================================================\\
conn.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}
//==================================================================\\
conn.getName = (jid, withoutContact= false) => {
id = conn.decodeJid(jid)
withoutContact = conn.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === conn.decodeJid(conn.user.id) ?
conn.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

conn.public = true
//==================================================================\\
conn.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update;

  if (connection === 'close') {
    let reason = new Boom(lastDisconnect?.error)?.output.statusCode
    if (reason === DisconnectReason.badSession) {
      console.log(`Bad Session File, Please Delete Session and Scan Again`);
      baronStart()
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log("Connection closed, reconnecting....");
      baronStart();
    } else if (reason === DisconnectReason.connectionLost) {
      console.log("Connection Lost from Server, reconnecting...");
      baronStart();
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
      baronStart()
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
      baronStart();
    } else if (reason === DisconnectReason.restartRequired) {
      console.log("Restart Required, Restarting...");
      baronStart();
    } else if (reason === DisconnectReason.timedOut) {
      console.log("Connection TimedOut, Reconnecting...");
      baronStart();
    } else conn.end(`Unknown DisconnectReason: ${reason}|${connection}`)
  }

  if (update.connection == "open" || update.receivedPendingNotifications == "true") {
console.clear
centerLog(fs.readFileSync('./dev/.log', 'utf-8'), chalk.green)
// console.log('\n\n')
await sleep(1000)
centerLog('Connected to WhatsApp successfully!', chalk.redBright)
centerLog(conn.user.id || '👁️', chalk.redBright)
console.log("\n")
conn.sendMessage(conn.user.id, {
  text: `Reconnected`,
  contextInfo: {
  externalAdReply: {
  title: "Notification online",
    body:` `,
    thumbnailUrl: "https://telegra.ph/file/78ed6ca040c8519d25376.jpg",
    mediaType: 1,
    renderLargerThumbnail: true
  }}});
  await sleep(4000);
  conn.sendMessage(conn.user.id, {text: `bot`});
  await sleep(4000);
}
  //==================================================================\\
const makeFakeCommand = async (m, conn, text, chatUpdate) => {
      let messages = await generateWAMessage(
        m.key.remoteJid,
        { text: text || '' },
        { quoted: m.quoted }
    );
    messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return conn.ev.emit("messages.upsert", msg);
  };
  //==================================================================\\
  let tempPollStore = [];
  //==================================================================\\
  conn.pollMenu = async (jid, name = '', pollOptions = [], context = {}, selectableCount = 1) => {
    let options = [];
    for (let pollOption of pollOptions) {
      options.push(pollOption.vote);
    }
    let pollMsg = await conn.sendMessage(jid, { 
      botInvokeMessage: {
      messageContextInfo: {
        messageSecret: (0, crypto.randomBytes)(32),
      },
      pollCreationMessage: {
        name: name,
        options: options.map(optionName => ({ optionName })),
        contextInfo: context,
        selectableOptionsCount: selectableCount,
      }
    }});
    tempPollStore.push({ id: pollMsg.key.id, cmds: pollOptions });
    return;

  };
  //==================================================================\\
  conn.ev.on('messages.update', async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key);
        // console.log(pollCreation)
        if (pollCreation) {
          let pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation?.message?.botInvokeMessage?.message || pollCreation?.message,
            pollUpdates: update.pollUpdates,
          });
          let selectedOptionName = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name;
          const selectedCmd = tempPollStore.find(item => item.id === key.id)?.cmds.find(c => c.vote === selectedOptionName)?.cmd;
          const selectedCmdx = selectedCmd || selectedOptionName
         let M = proto.WebMessageInfo
const m = M.fromObject(pollCreation)
          await makeFakeCommand(m, conn, selectedCmdx, chatUpdate);
        } else {
          return false;
        }
        return;
      }
    }
  });

startPrompt(conn);

});


conn.ev.on('messages.upsert', async chatUpdate => {
           
 
    mek = chatUpdate.messages[0]
    if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        await conn.readMessages([mek.key]) }
    
})

async function getMessage(key) {
    if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg;
    }
    return {
        conversation: "Baron",
    };
}

conn.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}
function centerLog(text, color = chalk.white) {
    const terminalWidth = process.stdout.columns || 80;
    if (text.length >= terminalWidth) return console.log(color(text));
    console.log(color(' '.repeat(Math.max(0, (terminalWidth - text.length) / 2)) + text));
}
return conn
}
baronStart()
//=================================================//
process.on('uncaughtException', function (err) {
    let e = String(err)
    if (e.includes("conflict")) return
    if (e.includes("Cannot derive from empty media key")) return
    if (e.includes("Socket connection timeout")) return
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    console.log('Caught exception: ', err)
    })
