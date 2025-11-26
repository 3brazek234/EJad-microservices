import { Client } from "@elastic/elasticsearch";
import { config } from "./config";
import { Logger } from "winston";
import { winstonLogger } from "@3brazek234/ejad-shared";
import { ClusterHealthHealthResponseBody } from "@elastic/elasticsearch/lib/api/types";
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
