import { getConnection, getRepository } from "typeorm";
import { Apod } from "../entity/apod.entity";
import { EnvService } from "../../service/env-service";
import { resolve } from "url";
const axios = require("axios");

export class ApodDatasource {
  private APOD_URL: string;
  private URL_RANDOM: string;
  protected envService: EnvService;

  constructor() {
    this.envService = new EnvService();
    this.APOD_URL = this.envService.APOD_URL;
    this.URL_RANDOM = this.envService.URL_RANDOM;
  }

  public async setApod(apod: Apod): Promise<Apod> {
    const repository = getRepository(Apod);
    try {
      repository.save(apod);
      return apod;
    } catch (error) {
      return apod;
    }
  }

  public async getApod(): Promise<Apod> {
    const connection = getConnection();
    const repository = connection.getRepository(Apod);
    try {
      const apod = await repository.findOne();
      if (apod) {
        return apod;
      } else {
        const apod = await this.getApodFromAPI();
        await this.setApod(apod);
        return apod;
      }
    } catch (error) {
      throw new Error("Failed to get apod.");
    }
  }

  public async getRandomApod(): Promise<Apod> {
    try {
      let response;
      const dataRecovered = await axios.get(this.URL_RANDOM);
      if (dataRecovered?.data?.length) {
        response = dataRecovered.data[0];
      } else if (dataRecovered?.data) {
        response = dataRecovered.data;
      } else {
        throw new Error("Unable to recover data.");
      }
      const apod = new Apod();

      apod.url = response.url;
      apod.title = response.title;
      apod.explanation = response.explanation;
      apod.mediaType = response.media_type;

      return apod;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to retrieve data from " + this.URL_RANDOM);
    }
  }

  public async getApodFromAPI(): Promise<Apod> {
    try {
      let response;
      const dataRecovered = await axios.get(this.APOD_URL);

      if (dataRecovered?.data) {
        response = dataRecovered.data;
      } else {
        throw new Error("Unable to recover data.");
      }
      const apod = new Apod();
      apod.url = response.url;
      apod.title = response.title;
      apod.explanation = response.explanation;
      apod.mediaType = response.media_type;

      return apod;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to retrieve data from " + this.APOD_URL);
    }
  }

  public async updateApod(): Promise<void> {
    const apod = await this.getApodFromAPI();
    await this.setApod(apod);
  }
}
