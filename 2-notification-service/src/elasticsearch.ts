import { winstonLogger } from "@3brazek234/ejad-shared/build/src/logger.js";
import { Client } from "@elastic/elasticsearch";
import { Logger } from "winston";
import { config } from "./config.js";
import { ClusterHealthHealthResponseBody } from "@elastic/elasticsearch/lib/api/types.js";
const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  "notificationElasticSearch-server",
  "debug"
);

export const elasticsearchClint = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});
export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthHealthResponseBody =
        await elasticsearchClint.cluster.health({});
      log.info(`Notification elasticsearch is connected ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.log("error", "connection to elasticsearch failed", error);
    }
  }
}
