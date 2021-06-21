import * as dotenv from "dotenv";

export class EnvService {
  public APOD_URL: string;
  public URL_RANDOM: string;
  public BOT_TOKEN: string;

  constructor() {
    if (process.env.npm_lifecycle_event == "start:dev") {
      dotenv.config({ path: "./.env.dev" });
    } else {
      dotenv.config();
    }

    this.APOD_URL = <string>process.env.BASE_URL + <string>process.env.API_KEY;
    this.URL_RANDOM =
      <string>process.env.BASE_URL + <string>process.env.API_KEY + "&count=1";
    this.BOT_TOKEN = <string>process.env.BOT_TOKEN;
  }
}
