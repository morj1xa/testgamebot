const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "7383525055:AAHh5jQFXemm17ieXi2ThS_eNmNqFiq4Z0M";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/info", description: "Получить информацию" },
  { command: "/game", description: "Игра" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю циру от 0 до 9, а ты должен ее угадать"
  );
  const randomNum = Math.floor(Math.random() * 10);
  chats[chatId] = randomNum;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const name = msg.from.first_name;
    const curDate = new Date(msg.date * 1000);
    if (text == "/start") {
      await bot.sendSticker(
        chatId,
        "https://sl.combot.org/naderemo2/webp/0xf09f988e.webp"
      );
      return bot.sendMessage(chatId, `Добро пожаловать, ${name}`);
    }
    if (text == "/info") {
      return bot.sendMessage(chatId, `Сегодня ${curDate.toUTCString()}`);
    }
    if (text == "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я не понимаю, попробуй еще раз!");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data == "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, вы угадали! я загадал число ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению вы не угадали(. я загадал число ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
