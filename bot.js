const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = process.env.TELEGRAM_BOT_TOKEN;
const port = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Нажмите кнопку ниже, чтобы открыть магазин:', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Открыть Shop Mini App 🛍️', web_app: { url: process.env.WEB_APP_URL || 'https://example.com' } }
      ]]
    }
  });
});

bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = JSON.parse(msg.web_app_data.data);
    await bot.sendMessage(chatId, `Спасибо за заказ! Вы выбрали: ${data.product} на сумму ${data.price} ₽.`);
  } catch (e) {
    console.error(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});