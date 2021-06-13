import { UserDatasource } from "../data/datasource/user.datasource";
import { Apod } from "../data/entity/apod.entity";
import { SendTelegramMessage } from "../domain/send-telegram-message.use-case";
import { BotService } from "./bot.service";

export class SendApodToSubscribersService {
  private userDatasource: UserDatasource;
  private sendTelegramMessageUseCase: SendTelegramMessage;

  constructor(botService: BotService) {
    this.userDatasource = new UserDatasource();
    this.sendTelegramMessageUseCase = new SendTelegramMessage(botService);
  }
  public async sendApodToSubscribers(apod: Apod) {
    const subscribers = await this.userDatasource.getAll();
    subscribers.forEach((subscriber) => {
      this.sendTelegramMessageUseCase.sendMediaToUser(subscriber, apod);
    });
  }
}
