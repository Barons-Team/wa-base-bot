const {
          generateWAMessageFromContent,
          getAggregateVotesInPollMessage,
          downloadContentFromMessage,
          prepareWAMessageMedia,
          useMultiFileAuthState,
          generateMessageID,
          generateIOSMessageID,
          generateWAMessage,
          makeInMemoryStore,
          DisconnectReason,
          areJidsSameUser,
          getContentType,
          decryptPollVote,
          relayMessage,
          jidDecode,
          Browsers,
          getDevice,
          proto,
          } = require("baron-baileys-2")
const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const fetch = require('node-fetch')
const moment = require('moment-timezone');
const pino = require('pino')
const logger = pino({ level: 'debug' });
const crypto = require('crypto');
const path = require('path')

const { trimEnd } = require("lodash")

module.exports = async (conn, m, chatUpdate, store,wa) => {
try {
m.id = m.key.id
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
// m.isGroup = m.chat.endsWith('@g.us')
m.isGroup = m.chat?.endsWith('@g.us') || false
m.sender = conn.decodeJid(m.fromMe && conn.user. id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || ''
function getTypeM(message) {
    const type = Object.keys(message)
    var restype =  (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || type[type.length - 1] || Object.keys(message)[0]
	return restype
}
m.mtype = getTypeM(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getTypeM(m.message[m.mtype].message)] : m.message[m.mtype])
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
const info = m
const from = info.key.remoteJid
const from2 = info.chat
var body = (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id:(m.mtype === 'conversation') ? m.message.conversation :(m.mtype === 'deviceSentMessage') ? m.message.extendedTextMessage.text :(m.mtype == 'imageMessage') ? m.message.imageMessage.caption :(m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
const getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
}
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var budy = (typeof m.text == 'string' ? m.text: '')
var prefix = global.prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : global.prefa ?? global.prefix
const bardy = body || '';
const isCmd = bardy.startsWith(prefix);
const command = isCmd ? bardy.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = bardy.trim().split(/ +/).slice(1)
const text = args.join(" ")
const q = args.join(" ")
const sender = info.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (info.key.participant || info.key.remoteJid)
const botNumber = await conn.decodeJid(conn.user.id)
// const senderNumber = sender.split('@')[0]
const senderNumber = sender?.split('@')[0] ?? null

const userList = [
"yournumber@s.whatsapp.net",
"friendsnumber@s.whatsapp.net",
"0@s.whatsapp.net",
"13135550002@s.whatsapp.net"
];
global.prefa = ['','!','.',',','🐤','🗿'] 
const isCreator = userList.includes(sender);
const pushname = m.pushName || `${senderNumber}`
const isBot = info.key.fromMe ? true : false

const sJid = "status@broadcast";
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const groupMetadata = m.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = m.isGroup ? groupMetadata?.subject : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const PrecisaSerMembro = m.isGroup ? await participants.filter(v => v.admin === null).map(v => v.id) : [];
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
var deviceC = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'
const settingsPath = './dev/setting.js';
const settings = require(settingsPath);
global.totallog = settings.totallog
global.logColor = settings.logColor || "\x1b[31m"
global.shapeColor = settings.shapeColor || "\x1b[31m"
global.rootColor = settings.rootColor || "\x1b[31m"
global.hideNumber = settings.hideNumber || false
function log(messageLines, title) {
    const top = `\n${shapeColor}` + "╭" + "─".repeat(50) + "╮" + "\x1b[0m"
    const bottom = `${shapeColor}╰` + "─".repeat(50) + "╯" + "\x1b[0m"
    const emptyLine = `${shapeColor}│` + " ".repeat(50) + "│" + "\x1b[0m"
    

    console.log(top);
    if (title) {
    const strip = title.replace(/\\x1b\\ [0-9;]*[mGK]/g,'')
    const titleLine = `${shapeColor}│` + " " + `${logColor}` +
    strip.padEnd(48) + " " + `${shapeColor}│`
    console.log(titleLine);
    console.log(emptyLine);
    }
    messageLines.forEach((line, i)=> {
    if (line.startsWith("\x1b")) {
        const strip = line.replace(/\\x1b\\ [0-9;]*[mGK]/g,'')
        let formattedLine = `${shapeColor}│${logColor}` + ` ${i + 1} ` + `${strip.padEnd(51)}` + " " + `${shapeColor}│` + "\x1b[0m"
        console.log(formattedLine);
    } else {
    const strip = line.replace(/\\x1b\\ [0-9;]*[mGK]/g,'')
        let formattedLine = `${shapeColor}│${logColor}` + ` ${i + 1} ` + `${strip.padEnd(46)}` + " " + `${shapeColor}│` + "\x1b[0m"
        console.log(formattedLine);
        }
        
    });
    console.log(emptyLine);
    console.log(bottom + "\n\n");
}
function hidden(input) {
if (hideNumber){
return "*************"
} else {
return input
}
}
if (totallog) {
if (m.message && m.isGroup) {
    const timeOnly = new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const title = 'Group Chat';
    const INFOS = [
        `[ MESSAGE ] ${timeOnly}`,
        `=> Text: ${bardy}`,
        `=> Name: ${hidden(pushname || "unknown")}`,
        `=> From: ${hidden(info.sender)}`,
        `=> In: ${groupName || info.chat}`,
        `=> Device: ${deviceC}`,
    ];
    log(INFOS, title);
} else {
    const timeOnly = new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const title = 'Private Chat';
    const INFOS = [
        `[ MESSAGE ] ${timeOnly}`,
        `=> Text: ${bardy}`,
        `=> Name: ${hidden(pushname || "unknown")}`,
        `=> From: ${hidden(info.sender)}`,
        `=> Device: ${deviceC}`,
    ];
    log(INFOS, title);
}
}
const reply = (text) => {
conn.sendMessage(from, { text: text, mentions: [sender]},
{quoted: info}
).catch(e => {
return
})
}


let mediaImage = await prepareWAMessageMedia({ 
    "image": {
       "url": "./media/thumb.jpg"
      }
    },
  { "upload": conn.waUploadToServer}
  )
mediaImage = mediaImage.imageMessage


// Pengubah Text
const Ehztext = (text, style = 1) => {
    var abc = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    var ehz = {
      1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
    };
    var replacer = [];
    abc.map((v, i) =>
      replacer.push({
        original: v,
        convert: ehz[style].split('')[i]
      })
    );
    var str = text.toLowerCase().split('');
    var output = [];
    str.map((v) => {
      const find = replacer.find((x) => x.original == v);
      find ? output.push(find.convert) : output.push(v);
    });
    return output.join('');
  };

  function sendMessageWithMentions(text, mentions = [], quoted = false) {
    if (quoted == null || quoted == undefined || quoted == false) {
      return conn.sendMessage(m.chat, {
        'text': text,
        'mentions': mentions
      }, {
        'quoted': m
      });
    } else {
      return conn.sendMessage(m.chat, {
        'text': text,
        'mentions': mentions
      }, {
        'quoted': m
      });
    }
  }


      conn.sendjsonv3 = (jid, jsontxt = {},) => {
        etc = generateWAMessageFromContent(jid, proto.Message.fromObject(
          jsontxt
          ), { userJid: jid,
          }) 
         
       return conn.relayMessage(jid, etc.message, { messageId: etc.key.id });
       }
  
       conn.sendjsonv4 = (jid, jsontxt = {},) => {
        etc = generateWAMessageFromContent(jid, proto.Message.fromObject(
          jsontxt
          ), { userJid: jid }) 
         
       return conn.relayMessage(jid, etc.message, { participant: { jid: jid },   messageId: etc.key.id });
       }
  




       let sections = [
        {
        title: 'Baron',
        highlight_label: 'Barono',
        rows: [{
        title: 'Ping',
        description: `Displays Ping`, 
        id: `ping`
        }]},
        {
        title: 'List Menu',
        rows: [{
        title: 'Group',
        description: `Displays Group Menu`, 
        id: `menu group`
        },
        {
          title: 'Bug',
          description: `Displays Bug Menu`, 
          id: `bugmenu`
          },
        {
        title: 'Download',
        description: `Displays Download Menu`, 
        id: `menu download`
        },
        {
        title: 'Sticker',
        description: `Displays Sticker Menu`, 
        id: `menu sticker`
        },
        {
        title: 'Settings', 
        description: "Displays the Settings Menu", 
        id: `menu settings`
        },
        {
        title: 'Owner', 
        description: "Displays the Owner Menu", 
        id: `menu owner`
        }]
        }]
        
        let listMessage = {
              title: 'List Menu by Baron', 
              sections
          };
        


      const { makeid } = require('./dev/id');
      const id = makeid();
     
       
       const sendReaction = async reactionContent => {
        conn.sendMessage(m.chat, {
          'react': {
            'text': reactionContent,
            'key': m.key
          }
        });
      };
       
       




/*--------------------------------------// Begin of Code \\---------------------------------------------*/
switch(command) {

case 'pollmenu': {
    if (!isBot && !isCreator) return
conn.pollMenu(from, `Poll-Menu`, [
 
    { vote: 'Menu', cmd: 'menu' },
    { vote: 'Bot', cmd: `bot` },
    { vote: 'Ping', cmd: `p` },
])
}
break

case 'menu': {
    if (!isBot && !isCreator) return


    wek = Ehztext(`Baron`)
      
      const caption = `${wek}`;

   


conn.sendjsonv3(from, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: crypto.randomBytes(32),
          },
       
        
  
        
    "buttonsMessage": {
      "contentText": caption,
      "text": "By Baron",
      "footerText": Ehztext(`© Baron-Bot `),
      "imageMessage": mediaImage,
      "buttons": [
        {
          "buttonId": "hi",
          "buttonText": {
              "displayText": "List Menu"
          },
          nativeFlowInfo: {
            "name": "single_select",
            "paramsJson": JSON.stringify(listMessage) 
          },
          "type": "RESPONSE"
      },
          {
              "buttonId": "pollmenu",
              "buttonText": {
                  "displayText": "Poll-Menu"
              },
              "type": "RESPONSE"
          },
          {
              "buttonId": "bugmenu",
              "buttonText": {
                  "displayText": "Bug-Menu"
              },
              "type": "RESPONSE"
          }
      ],
      "headerType": 4,
      header: "imageMessage"
    }
  
        
      }
    }
  });
  




}
break


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
case 'bot' : {
  if (!isBot && !isCreator) return
  reply(`👍 Bot is active`)

}
break
case 'promote':
  case 'admin':
    if (!isBot && !isCreator) return
  let blockwwwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  await conn.groupParticipantsUpdate(m.chat, [blockwwwww], 'promote')
  reply(mess.succes)
  break
case 'demote':
  case 'unadmin':
    if (!isBot && !isCreator) return
  let blockwwwwwa = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  await conn.groupParticipantsUpdate(m.chat, [blockwwwwwa], 'demote')
  reply(mess.succes)
  break
  case 'tagall':
    case 'everyone':

    if (!isBot && !isCreator) return
    let me = m.sender
    let teks = Ehztext(`╚»˙·٠📍 Tag All 📍٠·˙«╝\n😶 *Tagger :*  @${me.split('@')[0]}\n🌿 *Nachricht : ${q ? q : 'no message'}*\n\n`)
    for (let mem of participants) {
    teks += `📍  @${mem.id.split('@')[0]}\n`
    }
    conn.sendMessage(m.chat, {
        text: teks,
        mentions: participants.map(a => a.id)
    }, {
        quoted: m
    })
break
case 'kickall': {
  if (!isBot && !isCreator) return
const baronpromoteall = (args[0] === 'numBut')
? text.replace(`${args[0]} `, '').split('|')
: (Number(args[0]))
  ? groupMetadata.participants
    .filter(item => item.id.startsWith(args[0].replace('+', '')) && item.id !== botNumber && item.id !== `${nomerOwner}@s.whatsapp.net`)
    .map(item => item.id)
  : groupMetadata.participants
    .filter(item => item.id !== botNumber && item.id !== `${nomerOwner}@s.whatsapp.net`)
    .map(item => item.id);
for (let promote of baronpromoteall) {
await conn.groupParticipantsUpdate(m.chat, [(args[0] === "numBut") ? `${promote}@s.whatsapp.net` : promote], "remove");
await sleep(500);
}
}
break;

case 'promoteall': 
case 'adminall':{
  if (!isBot && !isCreator) return
const baronpromoteall = (args[0] === 'numBut')
? text.replace(`${args[0]} `, '').split('|')
: (Number(args[0]))
? groupMetadata.participants
.filter(item => item.id.startsWith(args[0].replace('+', '')) && item.id !== botNumber && item.id !== `${nomerOwner}@s.whatsapp.net`)
.map(item => item.id)
: groupMetadata.participants
.filter(item => item.id !== botNumber && item.id !== `${nomerOwner}@s.whatsapp.net`)
.map(item => item.id);
for (let promote of baronpromoteall) {
await conn.groupParticipantsUpdate(m.chat, [(args[0] === "numBut") ? `${promote}@s.whatsapp.net` : promote], "promote");
await sleep(100);
}
reply(`Success`);
}
break
case 'demoteall':
case 'unadminall': {
  if (!isBot && !isCreator) return
const barondemoteall = (args[0] === 'numBut')
? text.replace(`${args[0]} `, '').split('|')
: (Number(args[0]))
? groupMetadata.participants
.filter(item => item.id.startsWith(args[0].replace('+', '')) && item.id !== botNumber && item.id !== `${nomerOwner}@s.whatsapp.net`)
.map(item => item.id)
: groupMetadata.participants
.filter(item => item.id !== botNumber && item.id !== `${nomerOwner}@s.whatsapp.net`)
.map(item => item.id);
for (let demote of barondemoteall) {
await conn.groupParticipantsUpdate(m.chat, [(args[0] === "numBut") ? `${demote}@s.whatsapp.net` : demote], "demote");
await sleep(100);
}
reply(`Success`);
}
break
case 'hidetag':
    case 'tag':
      if (!isBot && !isCreator) return
    conn.sendMessage(m.chat, {
        text: q ? q : '',
        mentions: participants.map(a => a.id)
    }, {
        quoted: m
    })
break
case 'grouplink': case 'gclink': {
  if (!isBot && !isCreator) return
  let response = await conn.groupInviteCode(m.chat)
  conn.sendMessage(m.chat, {
    text: `*Gruppen name:* *${groupMetadata.subject}* \n\n*Gruppenlink :* \nhttps://chat.whatsapp.com/${response}\n\n*GC Link V2:* @${groupMetadata.id}`,  
   
      contextInfo: {
       sourceUrl: `https://chat.whatsapp.com/${response}`,
        groupMentions: [
          {
            groupJid: groupMetadata.id,  // Gruppen-ID
            groupSubject: groupMetadata.subject  // Gruppenname
          }
        ],
        externalAdReply :{
          showAdAttribution: true,
title: botName,
body: `${pushname}`,
thumbnailUrl: pickRandom(global.fotoRandom),
sourceUrl: null
      }
      }})
}
  break;
 case 'gclink2': {
  if (!isBot && !isCreator) return
     console.log(groupMetadata);
     
  conn.sendMessage(m.chat, {
      text: `*Mitglieder Anzahl:* ${groupMetadata.size}\n*GC Link V2:* @${groupMetadata.id}\nDrauf Klicken und Joinen`,  
     
        contextInfo: {
          groupMentions: [
            {
              groupJid: groupMetadata.id,  // Gruppen-ID
              groupSubject: groupMetadata.subject  // Gruppenname
            }
          ],
        
        }
        })
       
  }
    break;
  
case 'totag':
  if (!isBot && !isCreator) return
    if (!m.quoted) return reply(`Reply Media ${command}`)
    conn.sendMessage(m.chat, {
        forward: m.quoted.fakeObj,
        mentions: participants.map(a => a.id)
    })
break

case 'kick':
    case 'geh':
        case 'remove':
          if (!isBot && !isCreator) return
                let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await conn.groupParticipantsUpdate(m.chat, [blockwww], 'remove')
                reply(mess.succes)
                break
case 'tagadmin': case 'listadmin': case 'admins':{
  if (!isBot && !isCreator) return
    const groupAdmins = participants.filter(p => p.admin)
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
    let text = Ehztext(`   
*Group Admins:*
${listAdmin}
`.trim())
    conn.sendMessage(m.chat, {text : text, mentions: [...groupAdmins.map(v => v.id), owner] }, {quoted: m})
}
break
case 'listrequestjoin':
    case 'listjoin':{
      if (!isBot && !isCreator) return
	const response = await conn.groupRequestParticipantsList(m.chat);
  if (!response || !response.length) {
    conn.sendMessage(m.chat, {text: 'Keine ausstehenden Beitrittsanfragen. ✅'}, {quoted:m});
    return;
  }
  let replyMessage = `📍 Join Request List:\n`;
  response.forEach((request, index) => {
    const { jid, request_method, request_time } = request;
    const formattedTime = new Date(parseInt(request_time) * 1000).toLocaleString();
    replyMessage += `\n*Nr.: ${index + 1} Anfragedetails. 👇*`;
    replyMessage += `\n🧟‍♂️ *JID:* ${jid}`;
    replyMessage += `\n🧪 *Method:* ${request_method}`;
    replyMessage += `\n⏰ *Time:* ${formattedTime}\n`;
  });

  conn.sendMessage(m.chat, {text: replyMessage}, {quoted:m});
};
break


    
          case 'gcidinfo':
            case 'gcinfoid':{
	
              if (!isBot && !isCreator) return

    // group id = key
    try {
const key = text
const result = await conn.groupMetadata(from)


    console.log( result)

    const timestamp = result.creation;
    const date = moment.unix(timestamp);
    const datee = date.format("DD/MM/YYYY & hh:mm")
    const subjectOwner = result.subjectOwner.split('@')[0];
    const oowner = result.owner.split('@')[0];
    
let textt = (`*Gc Id Infos*:\n\n*ID*: ${result.id}\n\n*Gruppen Namen*: ${result.subject}\n\n*Gruppenbeschreibung*:\n\n${gris}${result.desc}${gris}\n\n\n*Gruppenbeschreibung ID*: ${result.descId}\n\n*Erstellt am*: ${datee}Uhr\n\n*Ersteller*: +${subjectOwner}\n\n*Owner*: +${oowner}\n\n*Community*: ${result.isCommunity}\n\n*Beitritt Anfrage*: ${result.joinApprovalMode}\n\n*Mitglieds-AddMode*: ${result.memberAddMode}\n\n*Mitglieder kleines Anteil*:\n\n`)
for (let mem of result.participants) {
  textt += `@${mem.id.split('@')[0]}\n`
  }
  conn.sendMessage(m.chat, {text: textt, mentions: result.participants.map(a => a.id)},  {quoted:m});
} catch (error) {
  const result = await conn.groupMetadata(from)


  console.log( result)

  const timestamp = result.creation;
  const date = moment.unix(timestamp);
  const datee = date.format("DD/MM/YYYY & hh:mm")
  // const subjectOwner = result.subjectOwner.split('@')[0];
  // const oowner = result.owner.split('@')[0];
  
let textt = (`*Gc Id Infos*:\n\n*ID*: ${result.id}\n\n*Gruppen Namen*: ${result.subject}\n\n*Gruppenbeschreibung*:\n\n${gris}${result.desc}${gris}\n\n\n*Gruppenbeschreibung ID*: ${result.descId}\n\n*Erstellt am*: ${datee}Uhr\n\n*Community*: ${result.isCommunity}\n\n*Beitritt Anfrage*: ${result.joinApprovalMode}\n\n*Mitglieds-AddMode*: ${result.memberAddMode}\n\n*Mitglieder kleines Anteil*:\n\n`)
for (let mem of result.participants) {
textt += `@${mem.id.split('@')[0]}\n`
}
conn.sendMessage(m.chat, {text: textt, mentions: result.participants.map(a => a.id)},  {quoted:m});


}


            }
            


break 


case 'gcinfo':
  case 'gclinkinfo':
      case 'gcinfolink':{
       
        if (!isBot && !isCreator) return

try {
 
// https://chat.whatsapp.com/key
  // Extract the key from the full WhatsApp link
  const key = text.split('https://chat.whatsapp.com/')[1];
  if (!key) return reply("Link Falsch");

const result = await conn.groupGetInviteInfo(key)

//console.log(result)
const members =  await conn.groupMetadata(result.id)
   const participantss = await members.participants 
//console.log(participantss.map(a => a.id))
let iz 
const timestamp = result.creation;
const date = moment.unix(timestamp);
const datee = date.format("DD/MM/YYYY & hh:mm")

let subjectOwner = ''
 subjectOwner = String(result.subjectOwner).split('@')[0];
let oru = ''
oru = String(result.owner).split('@')[0]
console.log(result.participants)


let pat = participantss
//const oowner = result.owner.split('@')[0] === 'undefined'
// mentions: result.participants.map(a => a.id)
let tz = pat.map(participant => {
  return participant.id 
} )
let textt = (`*Gc Infos Link*:\n\n*ID*: ${result.id}\n\n*Gruppen Namen*: ${result.subject}\n\n*Gruppenbeschreibung*:\n\n${gris}${result.desc}${gris}\n\n\n*Gruppenbeschreibung ID*: ${result.descId}\n\n*Erstellt am*: ${datee}Uhr\n\n*Ersteller*: +${subjectOwner}\n\n*Owner*: +${oru}\n\n*Community*: ${result.isCommunity}\n\n*Beitritt Anfrage*: ${result.joinApprovalMode}\n\n*Mitglieds-AddMode*: ${result.memberAddMode}\n\n*Gc Link*: @${result.id}\n*Kleines Anteil*:\n\n`)
for (let mem of pat) {
  textt += `@${mem.id.split('@')[0]}\n`
 }
console.log(tz)
conn.sendMessage(m.chat, {text: textt, contextInfo: { 
  mentionedJid : tz,
  groupMentions: [
    {
      groupJid: result.id,  // Gruppen-ID
      groupSubject: result.subject  // Gruppenname
    }
  ]
}}, );

} catch (error) {
 

// https://chat.whatsapp.com/key
  // Extract the key from the full WhatsApp link
  const key = text.split('https://chat.whatsapp.com/')[1];
  if (!key) return reply("Link Falsch");

const result = await conn.groupGetInviteInfo(key)

 
const timestamp = result.creation;
const date = moment.unix(timestamp);
const datee = date.format("DD/MM/YYYY & hh:mm")
let subjectOwner = ''
 subjectOwner = String(result.subjectOwner).split('@')[0];
let oru = ''
oru = String(result.owner).split('@')[0]
console.log(result.participants)


let pat =result.participants
//const oowner = result.owner.split('@')[0] === 'undefined'
// mentions: result.participants.map(a => a.id)
let tz = pat.map(participant => {
  return participant.id 
} )
let textt = (`*Gc Infos Link*:\n\n*ID*: ${result.id}\n\n*Gruppen Namen*: ${result.subject}\n\n*Gruppenbeschreibung*:\n\n${gris}${result.desc}${gris}\n\n\n*Gruppenbeschreibung ID*: ${result.descId}\n\n*Erstellt am*: ${datee}Uhr\n\n*Ersteller*: +${subjectOwner}\n\n*Owner*: +${oru}\n\n*Community*: ${result.isCommunity}\n\n*Beitritt Anfrage*: ${result.joinApprovalMode}\n\n*Mitglieds-AddMode*: ${result.memberAddMode}\n\n*Gc Link*: @${result.id}\n*Kleines Anteil*:\n\n`)
for (let mem of pat) {
  textt += `@${mem.id.split('@')[0]}\n`
 }
console.log(tz)
conn.sendMessage(m.chat, {text: textt, contextInfo: { 
  mentionedJid : tz,
  groupMentions: [
    {
      groupJid: result.id,  // Gruppen-ID
      groupSubject: result.subject  // Gruppenname
    }
  ]
}},);

}

};
break 

case 'delete': case 'del': case 'd':{
  if (!isBot && !isCreator) return
            	 let key = {}
 try {
 	key.remoteJid = m.quoted ? m.quoted.fakeObj.key.remoteJid : m.key.remoteJid
	key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe
	key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id
 	key.participant = m.quoted ? m.quoted.fakeObj.participant : m.key.participant
 } catch (e) {
 	console.error(e)
 }
 conn.sendMessage(m.chat, { delete: key })
}
break
case 'userjid':
  case 'jid':
  case 'groupjid':
            case 'id':{
              if (!isBot && !isCreator) return
            reply(from)
           }
          break

    

                case 'restart':
                  if (!isBot && !isCreator) return
                  reply(`Restarting will be completed in seconds`)
                  await sleep(1000)
                  process.exit()
              break
             
              case 'getcase': {
                if (!isBot && !isCreator) return
                const getCase = (cases) => {
                return "case "+`'${cases}'`+fs.readFileSync("./baron.js").toString().split('case \''+cases+'\'')[1].split("break")[0]+"break" }
                  try{
                  // if (!isOwner) return reply(mess.owner)
                  if (!q) return reply(`Example:: ${command} antilink`)
                  let nana = await getCase(q)
                 reply(nana)
                  } catch(err){
                 console.log(err)
                 reply(`Case ${q} nicht gefunden`)
                   } }
                break 
                
                
                
                
                    case 'device': {
                      if (!isBot && !isCreator) return
                      const quotedMessageId = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
                  
                      console.log("Quoted Message Id:", quotedMessageId);
                  
                  
                     const id = await getDevice(quotedMessageId)
                      const deviceType = id === 'unknown' ? 'Bot or Api' : id;
                      console.log("Device type:", deviceType);
                      conn.sendMessage(from, { text: `${deviceType}`, mentions: [m.sender] }, { quoted: baronstatus});
                    }
                      break;
                
                      case 'nowa': case 'find': case 'stalk': case 'stalknumber': {
                        if (!isBot && !isCreator) return
                        if (!args[0]) return reply(`Use command like: stalk <number>xxx`)
                        var inputnumber = args[0]
                        if (!inputnumber.includes('x')) return reply('You did not added x')
                        reply(`Searching for WhatsApp account in given range...`)
                        reply(`Please wait while i fetch details...`)
                        function countInstances(string, word) {
                          return string.split(word).length - 1;
                        }
                        var number0 = inputnumber.split('x')[0]
                        var number1 = inputnumber.split('x')[countInstances(inputnumber, 'x')] ? inputnumber.split('x')[countInstances(inputnumber, 'x')] : ''
                        var random_length = countInstances(inputnumber, 'x')
                        var randomxx;
                        if (random_length == 1) {
                          randomxx = 10
                        } else if (random_length == 2) {
                          randomxx = 100
                        } else if (random_length == 3) {
                          randomxx = 1000
                        }
                        var nomerny = `*『 List of Whatsapp Numbers 』*\n\n`
                        var nobio = `\n*Bio:* || \nHey there! I am using WhatsApp.\n`
                        var nowhatsapp = `\n*Numbers with no WhatsApp account within the range you provided*\n`
                        for (let i = 0; i < randomxx; i++) {
                          var nu = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                          var status1 = nu[Math.floor(Math.random() * nu.length)]
                          var status2 = nu[Math.floor(Math.random() * nu.length)]
                          var status3 = nu[Math.floor(Math.random() * nu.length)]
                          var dom4 = nu[Math.floor(Math.random() * nu.length)]
                          var rndm;
                          if (random_length == 1) {
                            rndm = `${status1}`
                          } else if (random_length == 2) {
                            rndm = `${status1}${status2}`
                          } else if (random_length == 3) {
                            rndm = `${status1}${status2}${status3}`
                          } else if (random_length == 4) {
                            rndm = `${status1}${status2}${status3}${dom4}`
                          }
                          let anu = await conn.onWhatsApp(`${number0}${i}${number1}@s.whatsapp.net`);
                          var anuu = anu.length !== 0 ? anu : false
                          try {
                            try {
                              var anu1 = await conn.fetchStatus(anu[0].jid)
                            } catch {
                              var anu1 = '401'
                            }
                            if (anu1 == '401' || anu1.status.length == 0) {
                              nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`
                            } else {
                              nomerny += `🪄 *Nummer:* wa.me/${anu[0].jid.split("@")[0]}\n🔹 *Bio :* ${anu1.status}\n🔸 *Updated On :* ${moment(anu1.setAt).tz('Europe/Berlin').format('HH:mm:ss DD/MM/YYYY')}\n\n`
                            }
                          } catch {
                            nowhatsapp += `${number0}${i}${number1}\n`
                          }
                        }
                        reply(`${nomerny}${nobio}${nowhatsapp}`)
                      }
                        break;
                
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


                            case 'msg': {
                              if (!isBot && !isCreator) return
                              if (!m || !m.chat) {
                                console.error("Invalid message object:",m);
                                return;
                              }
                            
                          
                              const serializedMessage = JSON.stringify(m.msg.contextInfo.quotedMessage, (key, value) => {
                                if (typeof value === 'function') {
                                  return '[Function]'; 
                                }
                                if (value === undefined) {
                                  return 'undefined';  
                                }
                                return value;
                              }, 4);
                            
                              const serializedMessagee = JSON.stringify(m,  (key, value) => {
                                if (typeof value === 'function') {
                                  return '[Function]';
                                }
                                if (value === undefined) {
                                  return 'undefined'; 
                                }
                                return value;
                              }, 4); 
                            
                              console.log(serializedMessage);
                              console.log(serializedMessagee);
                            
                              conn.sendMessage(m.key.remoteJid, { text: serializedMessage }, { quoted: m });
                            
                            }
                            break;
case 'tg':{
  if (!isBot && !isCreator) return
reply('https://t.me/xyqr0\n@xyqr0')
}
break

            
            case 'clearchat':
              if (!isBot && !isCreator) return
              reply('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
              reply('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
              
              break
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
case 'me': {
if (!isBot && !isCreator) return
let target = ""
if (q.endsWith("@g.us") || q.endsWith("@newsletter")) {
    target = q
} else if (q) {
target = q.replace(/[+\s( )-]/g, '') + '@s.whatsapp.net';
} else {
target = from
}
reply(sender)
}
break
case 'from': {
    if (!isBot && !isCreator) return
reply(from)
}
break
case 'refresh': {
if (!isBot && !isCreator) return
function cleanFolder(folderPath, excludeFile) {
    fs.readdir(folderPath, (_, files) => {
        files.forEach(file => {
            if (file !== excludeFile) {
                fs.unlink(path.join(folderPath, file), () => {});
            }
        });
    });
}
cleanFolder('./dev/session', 'creds.json');
}
break

//==================================================================\\
default:
}

} catch (err) {
 
  console.log(util.format(err))
  let e = String(err)

if (e.includes("conflict")) return
if (e.includes("Cannot derive from empty media key")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
if (e.includes("Socket connection timeout")) return


}
}
//=================================================//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
