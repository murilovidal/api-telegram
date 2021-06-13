import { getConnection } from "typeorm";
import { BotService } from "./service/bot.service";
import { EnvService } from "./service/env-service";
import { TelegramPresentation } from "./web/telegram-presentation";
import { DbConnectionHelper } from "./helper/db-connection-helper";

const envService = new EnvService();
const botService = new BotService(envService);
const telegramPresentation = new TelegramPresentation(botService);
const dbConnectionHelper = new DbConnectionHelper();

(async () => {
  await dbConnectionHelper.makeConnection();
  const connection = getConnection();
  await connection.synchronize();
  telegramPresentation.startBot();
  console.log("Bot started");
})();
