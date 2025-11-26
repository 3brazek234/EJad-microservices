import { winstonLogger } from "@3brazek234/ejad-shared";
import { Logger } from "winston";
import { config } from "./config";
import { Application } from "express";
import http from "http";
import { healthRoutes } from "./routes";
import { checkConnection } from "./elasticsearch";
const SERVER_PORT = 4000;
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notification-server",
  "debug"
);

export function start(app: Application): void {
  startServer(app);
  app.use("", healthRoutes);
  checkConnection();
}
export const startServer = (app: Application) => {
  const server = new http.Server(app);
  server.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
  });

  server.on("error", (error) => {
    log.log("error", "Error starting notification server", error);
  });
};
