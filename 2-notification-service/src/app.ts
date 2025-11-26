import { winstonLogger } from "@3brazek234/ejad-shared";
import { Logger } from "winston";
import { config } from "./config";
import express, { Express } from "express";
import { start } from "./server";
// start of application
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notification-server",
  "debug"
);
function initialize(): void {
  const app: Express = express();
  start(app);
  log.info("Notification service initialized");
}
