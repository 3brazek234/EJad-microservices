import { winstonLogger } from "@3brazek234/ejad-shared";
import { config } from "@notifications/config";
import { Channel, ConsumeMessage } from "amqplib";
import { Logger } from "winston";
import { connectToRabbit } from "./connection";

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notification-server",
  "debug"
);
export const emailConsumer = async (channel: Channel) => {
  try {
    if (!channel) {
      channel = (await connectToRabbit()) as Channel;
    }
    const exchangeName = "EJad-Notification-Email";
    const queueName = "auth-email-queue";
    const routingKey = "auth-email";
    await channel.assertExchange(exchangeName, "direct");
    const EJadQueue = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(EJadQueue.queue, exchangeName, routingKey);
    channel.consume(EJadQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));
    });
  } catch (error) {
    log.error(
      "NotificationeService Email-consumer custom-auth-messages",
      error
    );
    console.log(error);
  }
};
