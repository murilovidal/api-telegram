import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { ApodDatasource } from "../data/datasource/apod.datasource";
import { Apod } from "../data/entity/apod.entity";
import { BotService } from "../service/bot.service";
import { EnvService } from "../service/env-service";
import { SendApodToSubscribersService } from "../service/send-apod-to-subscribers-service";

@EventSubscriber()
export class ApodSubscriber implements EntitySubscriberInterface<Apod> {
  private botService: BotService;
  private sendApodToSubscribersService: SendApodToSubscribersService;

  constructor() {
    this.botService = new BotService(new EnvService());
    this.sendApodToSubscribersService = new SendApodToSubscribersService(
      this.botService
    );
  }
  listenTo() {
    return Apod;
  }

  async afterInsert(event: InsertEvent<Apod>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
    this.sendApodToSubscribersService.sendApodToSubscribers(event.entity);
    console.info("Picture of the day retrieved and stored successfuly.");
  }
}
