const TelegramBot = require('node-telegram-bot-api');
const moment = require("moment-timezone");
const os = require("os");
const fs = require("fs");
const { loading } = require('./lib/loading.js');
const { handleOpenAI, handleSetOpenAI, handleGetApiKey, handleBotRuntime, handlePing } = require('./lib/fitur.js');
const { sendMenu } = require('./lib/menu.js');
const setting = require("./apikey.json");
const settings = require("./settings.json");

const bot = new TelegramBot(settings.telegram_bot_token, { polling: true });

console.log('\x1b[32mBot Berhasil Terhubung Ke Server!\x1b[0m');

bot.on('message', async (msg) => {
    let chatId;
    
    try {
        chatId = msg.chat.id;
        const from = msg.from.id;
        const body = msg.text || "";
        const budy = body.trim();
        const prefix = budy.startsWith('/') ? budy.match(/^[\/!#.]/gi) : "/";
        const isCmd2 = budy.startsWith(prefix);
        const command = budy.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const args = budy.trim().split(/ +/).slice(1);
        const text = args.join(" ");
        const pushname = msg.from.username || "No Name";

        if (isCmd2) {
            
            switch (command) {
                case "menu":
                case "start":
                    bot.sendChatAction(chatId, 'typing');
                    sendMenu(bot, chatId, pushname);
                    break;

                case 'owner':
                    bot.sendMessage(chatId, '@RidwanzSaputra');
                    break;

                case "chatgpt":
                case "openai":
                    bot.sendChatAction(chatId, 'typing');
                    if (!text) return bot.sendMessage(chatId, `Contoh :\n/${command} Siapa Mark Zuckerberg.`);
                    try {
                        await handleOpenAI(bot, chatId, text, setting);
                    } catch (error) {
                        console.error(error);
                        bot.sendMessage(chatId, "Error: " + error.message);
                    }
                    break;

                case 'setopenai':
                    handleSetOpenAI(bot, chatId, from, args, setting);
                    break;

                case 'getapikey':
                    handleGetApiKey(bot, chatId, from, setting);
                    break;
                    
                case "runtime":
                    handleBotRuntime(bot, chatId);
                    break;

                case 'ping':
                    await loading(bot, chatId);      
                    handlePing(bot, chatId);
                    break;

                default:
                    if (isCmd2 && budy.toLowerCase() != undefined) {
                        if (!budy.toLowerCase()) return;
                        bot.sendMessage(chatId, `Perintah ${prefix}${command} Tidak Tersedia.`);
                    }
            }
        }
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, 'Internal server error');
    }
});
