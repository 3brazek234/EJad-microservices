import { IEmailLocals, winstonLogger } from "@3brazek234/ejad-shared";
import { config } from "@notifications/config";
import { Logger } from "winston";
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationElasticSearch-server",
  "debug"
);
export const transporter = async (
  templete: string,
  receiveEmail: string,
  locals: IEmailLocals
): Promise<void> => {
  try {
    log.info("Email send successfully");
  } catch (err) {
    log.error("error in sending email in mail transport", err);
  }
};
