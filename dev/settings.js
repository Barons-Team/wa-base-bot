const fs = require('fs')
const file = require.resolve(__filename)

//Change this             ↓
global.pairingCode = "AAAAAAAA"

fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})