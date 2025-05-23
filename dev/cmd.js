const fs = require('fs')
const path = require('path');
const settingsPath = path.join(__dirname, 'setting.js'); 
const settings = require(settingsPath);
global.logColor = settings.logColor || "\x1b[31m"
global.shapeColor = settings.shapeColor || "\x1b[31m"
global.rootColor = settings.rootColor || "\x1b[31m"
global.hideNumber = settings.hideNumber || false
module.exports = async (command, conn, rl, callback) => {
    try {
        updateSettings('totallog', false);
        function updateSettings(settingKey, value) {
            settings[settingKey] = value;
            fs.writeFileSync(settingsPath, `module.exports = ${JSON.stringify(settings, null, 2)};`, 'utf8');
            global[settingKey] = value;
        }

        function logMenu(options) {
            console.log(`\n${title}\n`);
            options.forEach((opt, i) => console.log(`(${i + 1}) ${opt}`));
            console.log("\n(back) Main Menu |  (exit) Exit Menus");
        }
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
    const standart = `${shapeColor}│` + " " + `${logColor}` +
    " (back)      (exit)".padEnd(48) + " " + `${shapeColor}│`
    console.log(emptyLine);
    console.log(standart)
    console.log(bottom + "\n\n");
}

function setRedPrompt(COLOR, PROMPT) {
            process.stdout.write(COLOR);
            rl.setPrompt(`\n${COLOR}${PROMPT}`);
            rl.prompt();
        }
/*async function showSubMenu(title, options, switcher, returnToMain = false) {
    return new Promise((resolve) => {
function ask() {
log(options, title);
setRedPrompt(rootColor, root);

rl.once("line", (input) => {
    input = input.toLowerCase().trim();

if (input === "back") {
    resolve("back");
} else if (input === "exit") {
    resolve("exit");
} else {
    if (switcher[input]) {
        switcher[input]()
    } else if (switcher.default) {
        switcher.default
    }
    setRedPrompt(rootColor, root);
    ask();
}
});
}
        ask();
    }).then((result) => {
        if (result === "exit") {
        updateSettings('totallog', true);
        callback();
        }
        else if (returnToMain) {
        mainMenu();
        setRedPrompt(rootColor, root);
        }
    });
}*/
async function showSubMenu(titleOrFn, optionsOrFn, switcher, returnToMain = false) {
    return new Promise((resolve) => {
        function ask() {
            const title = (typeof titleOrFn === 'function') ? titleOrFn() : titleOrFn;
            const options = (typeof optionsOrFn === 'function') ? optionsOrFn() : optionsOrFn;
            log(options, title);
            setRedPrompt(rootColor, root);

            rl.once("line", (input) => {
                input = input.toLowerCase().trim();

                if (input === "back") {
                    resolve("back");
                } else if (input === "exit") {
                    resolve("exit");
                } else {
                    if (switcher[input]) {
                        switcher[input]();
                    } else if (switcher.default) {
                        switcher.default();
                    }
                    setRedPrompt(rootColor, root);
                    ask();
                }
            });
        }

        ask();
    }).then((result) => {
        if (result === "exit") {
            updateSettings('totallog', true);
            callback();
        } else if (returnToMain) {
            mainMenu();
            setRedPrompt(rootColor, root);
        }
    });
}
function mainMenu() {
    const INFOS = [
        "Set cmd color",
        "Set log color",
        "Set log shape color",
        "Hide number"
    ];
    log(INFOS);
rl.once("line", async (input) => {
    input = input.toLowerCase().trim();
switch (input) {
case "1":
await showSubMenu("Set cmd color", [
  "\x1b[37mBlack",
  "\x1b[31mRed",
  "\x1b[32mGreen",
  "\x1b[33mYellow",
  "\x1b[34mBlue",
  "\x1b[35mMagenta",
  "\x1b[36mCyan",
  "\x1b[37mWhite",
], {
1: () => updateSettings('rootColor', "\x1b[30m"),
2: () => updateSettings('rootColor', "\x1b[31m"),
3: () => updateSettings('rootColor', "\x1b[32m"),
4: () => updateSettings('rootColor', "\x1b[33m"),
5: () => updateSettings('rootColor', "\x1b[34m"),
6: () => updateSettings('rootColor', "\x1b[35m"),
7: () => updateSettings('rootColor', "\x1b[36m"),
8: () => updateSettings('rootColor', "\x1b[37m"),
default: () => console.log("invalid")
}, true);
break;
case "2":
await showSubMenu("Set log color", [
  "\x1b[37mBlack",
  "\x1b[31mRed",
  "\x1b[32mGreen",
  "\x1b[33mYellow",
  "\x1b[34mBlue",
  "\x1b[35mMagenta",
  "\x1b[36mCyan",
  "\x1b[37mWhite",
], {
1: () => updateSettings('logColor', "\x1b[30m"),
2: () => updateSettings('logColor', "\x1b[31m"),
3: () => updateSettings('logColor', "\x1b[32m"),
4: () => updateSettings('logColor', "\x1b[33m"),
5: () => updateSettings('logColor', "\x1b[34m"),
6: () => updateSettings('logColor', "\x1b[35m"),
7: () => updateSettings('logColor', "\x1b[36m"),
8: () => updateSettings('logColor', "\x1b[37m"),
default: () => console.log("invalid")
}, true);
break;
case "3":
await showSubMenu("Set log shape color", [
  "\x1b[37mBlack",
  "\x1b[31mRed",
  "\x1b[32mGreen",
  "\x1b[33mYellow",
  "\x1b[34mBlue",
  "\x1b[35mMagenta",
  "\x1b[36mCyan",
  "\x1b[37mWhite",
], {
1: () => updateSettings('shapeColor', "\x1b[30m"),
2: () => updateSettings('shapeColor', "\x1b[31m"),
3: () => updateSettings('shapeColor', "\x1b[32m"),
4: () => updateSettings('shapeColor', "\x1b[33m"),
5: () => updateSettings('shapeColor', "\x1b[34m"),
6: () => updateSettings('shapeColor', "\x1b[35m"),
7: () => updateSettings('shapeColor', "\x1b[36m"),
8: () => updateSettings('shapeColor', "\x1b[37m"),
default: () => console.log("invalid")
}, true);
break;
case "4":
    await showSubMenu(
        () => {
            return "Hide number";
        },
        () => {
            const hideNumbex = settings.hideNumber;
            let xon = hideNumbex ? "Turn off" : "Turn on";
            return [ xon ];
        },
        {
            1: () => {
                const newValue = !settings.hideNumber; 
                updateSettings("hideNumber", newValue);
            },
            default: () => console.log("invalid")
        },
        true
    );
break;

case "exit":
updateSettings('totallog', true);
callback();
break;
default:
mainMenu();
break;
}
});
}
mainMenu();
} catch (err) {
        console.log(err);
        callback();
    }
};
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
