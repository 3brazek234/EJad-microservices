import { IEmailLocals, winstonLogger } from "@3brazek234/ejad-shared";
import { Logger } from "winston";
import { config } from "./config";
import nodemailer, { Transporter } from "nodemailer";
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationElasticSearch-server",
  "debug"
);
async function emailTemplates(
  templete: string,
  to: string,
  locals: IEmailLocals
): Promise<void> {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "fernando.nicolas50@ethereal.email",
        pass: "g5RGrUYVmykTS2t4Kx",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
