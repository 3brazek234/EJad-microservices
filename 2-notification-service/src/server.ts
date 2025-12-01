import { winstonLogger } from "@3brazek234/ejad-shared";
import { Logger } from "winston";
import { config } from "./config";
import { Application } from "express";
import http from "http";
import { healthRoutes } from "./routes";
import { checkConnection as checkElasticConnection } from "./elasticsearch"; // تغيير الاسم للتوضيح
import { Channel } from "amqplib";
import { connectToRabbit } from "./queues/connection";
import { emailConsumer } from "./queues/email.consumer";

const SERVER_PORT = 4000;
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notification-server",
  "debug"
);

// 1. دالة بدء الـ Queue بقت ترجع Promise<boolean> لبيان النجاح أو الفشل
const startQueue = async (): Promise<boolean> => {
  const channelEmail = await connectToRabbit();
  
  // ✅ التحقق من أن القناة تم إنشاؤها بنجاح
  if (!channelEmail) {
    log.error("Failed to connect to RabbitMQ. Email consumer not started.");
    return false;
  }

  // ✅ تمرير القناة المضمونة
  emailConsumer(channelEmail);
  log.info("Email consumer started successfully.");
  return true;
};

// 2. دالة start الرئيسية بقت async عشان نقدر نستخدم await جواها
export async function start(app: Application): Promise<void> {
  
  // ✅ تشغيل الـ Health Routes الأول (مش محتاجة اتصالات خارجية)
  app.use("", healthRoutes);

  // ✅ انتظار الاتصال بـ Elasticsearch
  log.info("Connecting to Elasticsearch...");
  await checkElasticConnection(); 

  // ✅ انتظار الاتصال بـ RabbitMQ وبدء الـ Consumer
  log.info("Connecting to RabbitMQ and starting consumers...");
  const isQueueStarted = await startQueue();

  // لو الـ Queue فشل، ممكن نختار نقفل التطبيق أو نكمل، حسب أهميته
  if (!isQueueStarted) {
    log.error("Application starting with critical failures in Queue connection.");
    // process.exit(1); // ممكن نوقف التطبيق هنا لو الـ Queue أساسي
  }

  // ✅ بدء السيرفر في النهاية بعد التأكد من الجاهزية
  startServer(app);
}

export const startServer = (app: Application) => {
  const server = new http.Server(app);
  server.listen(SERVER_PORT, () => {
    // ✅ استخدام الـ logger بدل console.log
    log.info(`Notification server running on port ${SERVER_PORT}`);
  });

  server.on("error", (error) => {
    log.error("Error starting notification server", error);
  });
};