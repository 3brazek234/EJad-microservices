import { winstonLogger } from "@3brazek234/ejad-shared";
import { config } from "@notifications/config";
import client, { Channel, ChannelModel } from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger(
 `${config.ELASTIC_SEARCH_URL}`,
 "notificationElasticSearch-server",
 "debug"
);

export const connectToRabbit = async (): Promise<Channel | undefined> => {
 try {

  const connection: ChannelModel = await client.connect(
   `${config.RABBITMQ_ENDPOINT}`
  );
    // createChannel returns a 'Channel' type
  const channel = await connection.createChannel();
  log.info("Notification service connected to rabbitMQ successfully");
  closeConnection(channel, connection);
  return channel;
 } catch (error) {
  log.error("error in connection of Notification service with rabbitMQ");
  console.log(error);
 }
};

export function closeConnection(
 channel: Channel,
 connection: ChannelModel 
): void {
 process.once("SIGINT", async () => {
  try {
   await channel.close(); 
   await connection.close(); 
   log.info("RabbitMQ connection closed gracefully.");
  } catch (err) {
   log.error("Error while closing RabbitMQ connection", err);
  }
 });
}
