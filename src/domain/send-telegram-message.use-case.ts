import { Message } from "telegraf/typings/telegram-types";
import { Apod } from "../data/entity/apod.entity";
import { User } from "../data/entity/user.entity";
import { BotService } from "../service/bot.service";
import { BotMessage } from "../web/bot.message";

export class SendTelegramMessage {
  private bot: BotService;

  constructor(botService: BotService) {
    this.bot = botService;
  }

  public async sendTextToUser(
    user: User,
    messageToUser: string
  ): Promise<Message.TextMessage> {
    try {
      return this.bot.sendText(user.telegramId, messageToUser);
    } catch (e) {
      console.log(e);
      throw new Error("SendMessage Failed.");
    }
  }

  public async sendMediaToUser(user: User, apod: Apod): Promise<void> {
    try {
      if (apod.mediaType == "image") {
        await this.bot.sendMedia(user.telegramId, apod.url, apod.title);
        console.log("PhotoURL sent." + new Date().toLocaleString());
      } else if (apod.mediaType == "video") {
        await this.sendTextToUser(user, apod.url);
        console.log("VideoURL sent." + new Date().toLocaleString());
        this.sendTextToUser(user, BotMessage.FailedToSendApod);
      }
      await this.sendTextToUser(user, apod.explanation);
    } catch (e) {
      console.error(e);
    }
  }
}
