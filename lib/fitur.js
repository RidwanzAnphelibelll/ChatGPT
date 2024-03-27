const fs = require("fs");
const os = require("os");
const { Configuration, OpenAIApi } = require("openai");

async function handleOpenAI(bot, chatId, text, setting) {
    try {
        const configuration = new Configuration({ apiKey: setting.apikey });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({ model: "gpt-3.5-turbo-0301", messages: [{ role: "user", content: text }] });
        bot.sendMessage(chatId, `${response.data.choices[0].message.content}`);
    } catch (error) {
        if (error.response && error.response.status === 429) {
            bot.sendMessage(chatId, "Maaf, jumlah permintaan Anda melebihi batas atau saldo trial Anda telah habis. Silakan perbarui kunci API Anda.");
        }
    }
}

function handleSetOpenAI(bot, chatId, from, args, setting) {
    if (from !== 5692196612) return bot.sendMessage(chatId, 'Hanya owner bot yang dapat menggunakan perintah ini.');
    if (!args[0]) return bot.sendMessage(chatId, "Contoh :\n/setopenai <apikey baru>");
    setting.apikey = args[0];
    fs.writeFileSync('./apikey.json', JSON.stringify(setting, null, 2));
    bot.sendMessage(chatId, `API key OpenAI Berhasil Diperbarui Menjadi : ${args[0]}`);
}

function handleGetApiKey(bot, chatId, from, setting) {
    if (from !== 5692196612) return bot.sendMessage(chatId, 'Hanya owner bot yang dapat menggunakan perintah ini.');
    const ApiKey = setting.apikey;
    bot.sendMessage(chatId, `OpenAI API key :\n${ApiKey}`);
}

function handleBotRuntime(bot, chatId) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const days = Math.floor(hours / 24);
    const hoursReminder = hours % 24;
    const uptimeString = `${days} Hari, ${hoursReminder} Jam, ${minutes} Menit, ${seconds} Detik`;
    bot.sendMessage(chatId, `Bot Aktif Selama :\n${uptimeString}`);
}

function formatp(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function handlePing(bot, chatId) {
    const used = process.memoryUsage();
    const timestamp = process.hrtime();
    const cpus = os.cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
        return cpu;
    });
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total;
        last.speed += cpu.speed / length;
        last.times.user += cpu.times.user;
        last.times.nice += cpu.times.nice;
        last.times.sys += cpu.times.sys;
        last.times.idle += cpu.times.idle;
        last.times.irq += cpu.times.irq;
        return last;
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    });

    const latensi = process.hrtime(timestamp);
    const latencyMs = latensi[0] * 1000 + Math.round(latensi[1] / 1000000);

    let respon = `
• RESPONSE TIME : ${latencyMs} ms
• RAM USAGE : ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

MEMORY USAGE (Node.js) :
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `TOTAL CPU USAGE : 
${cpus[0].model.trim()} (${cpu.speed} MHz)\n${Object.keys(cpu.times).map(type => ` - ${type.padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

CPU CORE USAGE (${cpus.length} Core CPU) :
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHz)\n${Object.keys(cpu.times).map(type => ` - ${type.padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim();
    bot.sendMessage(chatId, respon);
}

module.exports = {
    handleOpenAI,
    handleSetOpenAI,
    handleGetApiKey,
    handleBotRuntime,
    handlePing
};