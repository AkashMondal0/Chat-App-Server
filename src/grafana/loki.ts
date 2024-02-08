import LokiTransport from "winston-loki";
import { createLogger } from "winston";

const options = {
  transports: [

    new LokiTransport({
      labels: { app: "sky chat server logs"},
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);

export default logger;