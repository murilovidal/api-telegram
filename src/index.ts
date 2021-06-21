import { getConnection } from "typeorm";
import { BotService } from "./service/bot.service";
import { EnvService } from "./service/env-service";
import { TelegramPresentation } from "./web/telegram-presentation";
import { DbConnectionHelper } from "./helper/db-connection-helper";
import { GetApodCronjob } from "./cronjob/get-apod-cronjob";

const envService = new EnvService();
const telegramPresentation = new TelegramPresentation(
  new BotService(envService)
);
const dbConnectionHelper = new DbConnectionHelper();

(async () => {
  await dbConnectionHelper.makeConnection();
  const connection = getConnection();
  await connection.synchronize();
  telegramPresentation.startBot();
  console.log("Bot started");
  const getApodCronjob = new GetApodCronjob();
})();
