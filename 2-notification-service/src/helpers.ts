import { IEmailLocals, winstonLogger } from "@3brazek234/ejad-shared";
import { Logger } from "winston";
import { config } from "./config";
import nodemailer, { Transporter } from "nodemailer";
import Email from "email-templates";
import path from "path";
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationElasticSearch-server",
  "debug"
);
async function emailTemplates(
  templete: string,
  receiver: string,
  locals: IEmailLocals
): Promise<void> {
  try {
    const smtpTransporter: Transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });
    const email: Email = new Email({
      message: {
        from: `تطبيق ايجاد <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransporter,
      views: {
        options: {
          extension: "ejs",
        },
      },

      juice: true, // عشان ال email-templete تقدر تشوف css files
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "../build"),
        },
      },
    });
    await email.send({
      template: path.join(__dirname, "..", "src/emails", templete),
      message: { to: receiver },
      locals,
    });
  } catch (error) {
    console.log(error);
  }
}
export { emailTemplates };
