import { IEmailLocals, winstonLogger } from "@3brazek234/ejad-shared";
import { config } from "@notifications/config";
import { emailTemplates } from "@notifications/helpers";
import { Logger } from "winston";
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationElasticSearch-server",
  "debug"
);
export const sendEmail = async (
  templete: string,
  receiveEmail: string,
  locals: IEmailLocals
): Promise<void> => {
  try {
    emailTemplates(templete, receiveEmail, locals);
    log.info("Email send successfully");
  } catch (err) {
    log.error("error in sending email in mail transport", err);
  }
};
