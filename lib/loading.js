async function loading(bot, chatId) {
    const progressBarLength = 10;
    let message = await bot.sendMessage(chatId, "Loading...");
    for (let i = 0; i <= progressBarLength; i++) {
        const percentage = i * 10;
        const progress = `[${"■".repeat(i)}${"□".repeat(progressBarLength - i)}] ${percentage}%`;
        await bot.editMessageText(`*${progress}*`, {
            chat_id: chatId,
            message_id: message.message_id,
            parse_mode: "Markdown"
        });
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    await bot.deleteMessage(chatId, message.message_id);
}

module.exports = {
    loading
};