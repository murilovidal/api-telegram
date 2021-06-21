import { CronJob } from "cron";
import { ApodDatasource } from "../data/datasource/apod.datasource";
import { Apod } from "../data/entity/apod.entity";

export class GetApodCronjob {
  private cronJob: CronJob;
  private apodDatasource: ApodDatasource;

  constructor() {
    this.apodDatasource = new ApodDatasource();
    this.cronJob = new CronJob("0 6-10 * * *", async () => {
      try {
        await this.getNewApod();
      } catch (e) {
        console.error(e);
      }
    });
    // Start job
    if (!this.cronJob.running) {
      this.cronJob.start();
      console.log("Cronjob Started");
    }
  }
  private async getNewApod() {
    try {
      const apod = await this.apodDatasource.getApodFromAPI();
      this.apodDatasource.setApod(apod);
    } catch (error) {
      console.log(error);
      return this.apodDatasource.getApod();
    }
  }
}
