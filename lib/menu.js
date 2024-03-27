const os = require("os");
const moment = require("moment-timezone");

function sendMenu(bot, chatId, pushname) {
    let platform = os.platform();
    platform = platform.charAt(0).toUpperCase() + platform.slice(1);
    let language = "Node.js";
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const currentDate = moment().tz('Asia/Jakarta');
    const dayOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][currentDate.day()];
    const wibTime = currentDate.format('HH:mm');
    const dayOfMonth = currentDate.date();
    const monthIndex = currentDate.month();
    const year = currentDate.year();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthNames[monthIndex];
    const formattedDateString = `${dayOfMonth} ${monthName} ${year}`;
    const combinedDayName = `${dayOfWeek}`;
    const menuMessage = `
ʜᴀʟʟᴏ ᴋᴀᴋ *${pushname}👋*

╭────•「 *CHAT-GPT* 」•────•
│• *ᴘʟᴀᴛꜰᴏʀᴍ :* ${platform}
│• *ʙᴀʜᴀsᴀ :* ${language}
│• *ʀᴜɴᴛɪᴍᴇ :* ${hours} Jam, ${minutes} Menit, ${seconds} Detik
│• *ʜᴀʀɪ :* ${combinedDayName}
│• *ᴊᴀᴍ :* ${wibTime} WIB
│• *ᴛᴀɴɢɢᴀʟ :* ${formattedDateString}
╰─────────────•
╭─────────•
│» /owner
│» /chatgpt
│» /openai
│» /setopenai
│» /getapikey
│» /runtime
│» /ping
╰────────•`;

    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: 'WhatsApp', url: 'https://wa.me/6285225416745' },
                { text: 'Telegram', url: 'https://t.me/RidwanzSaputra' }
            ]
        ]
    };

    bot.sendMessage(chatId, menuMessage, { parse_mode: "Markdown", reply_markup: inlineKeyboard });
}

module.exports = {
    sendMenu
};