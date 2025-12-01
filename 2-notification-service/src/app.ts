import { winstonLogger } from "@3brazek234/ejad-shared";
import express, { Application } from "express"; // تصحيح الاستيراد
import { Logger } from "winston";
import { start } from "./server";
import { config } from "./config";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notification-server",
  "debug"
);

async function initialize(): Promise<void> {
  const app: Application = express(); // تحديد نوع المتغير app
 await start(app);
  log.info('Notification service initialized')
}

initialize();