import { winstonLogger } from "@3brazek234/ejad-shared";
import { Logger } from "winston";
import { config } from "./config";
import { Application } from "express";
import http from "http";
import { healthRoutes } from "./routes";
import { checkConnection as checkElasticConnection } from "./elasticsearch";
import { connectToRabbit } from "./queues/connection";
import { authEmailConsumer, orderEmailConsumer } from "./queues/email.consumer";

const SERVER_PORT = 4000;
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notification-server",
  "debug"
);

const startQueue = async (): Promise<boolean> => {
  const channelEmail = await connectToRabbit();
  if (!channelEmail) {
    log.error("Failed to connect to RabbitMQ. Email consumer not started.");
    return false;
  }
  orderEmailConsumer(channelEmail);
  authEmailConsumer(channelEmail);
  await channelEmail.assertExchange("EJad-Notification-Email", "direct");
  const message = JSON.stringify({
    neme: "jobber",
    service: "auth notification service",
  });
  await channelEmail.publish(
    "EJad-Notification-Email",
    "auth-email",
    Buffer.from(message)
  );
  log.info("Email consumer started successfully.");
  return true;
};

export async function start(app: Application): Promise<void> {
  app.use("", healthRoutes);

  log.info("Connecting to Elasticsearch...");
  await checkElasticConnection();

  log.info("Connecting to RabbitMQ and starting consumers...");
  const isQueueStarted = await startQueue();

  if (!isQueueStarted) {
    log.error(
      "Application starting with critical failures in Queue connection."
    );
  }

  startServer(app);
}

export const startServer = (app: Application) => {
  const server = new http.Server(app);
  server.listen(SERVER_PORT, () => {
    log.info(`Notification server running on port ${SERVER_PORT}`);
  });

  server.on("error", (error) => {
    log.error("Error starting notification server", error);
  });
};
