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
export const notificationConsumer = async (channel: Channel) => {
  try {
    if (!channel) {
      channel = (await connectToRabbit()) as Channel;
    }
    const exchangeName = "notification-direct-exchange";
    const queueName = "all-notifications-queue";
    const routingKey = "auth-email";
    // assert التاكد من ان ال Exchange موجوده ولا لا
    await channel.assertExchange(exchangeName, "direct");
    // assert التاكد من ان ال Queue موجوده ولا لا

    const QueueName = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(QueueName.queue, exchangeName, "notify.order");
    await channel.bindQueue(QueueName.queue, exchangeName, "notify.auth");
    await channel.bindQueue(QueueName.queue, exchangeName, "notify.chat");
    channel.consume(QueueName.queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const routingKey = msg.fields.routingKey;
        const content = JSON.parse(msg.content.toString());
        switch (routingKey) {
          case "notify.order":
            break;
          case "notify.auth":
            break;
          case "notify.chat":
            break;
          default:
            console.log("Unknown notification type");
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    log.error(
      "NotificationeService Email-consumer custom-auth-messages",
      error
    );
    console.log(error);
  }
};
