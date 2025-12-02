const pino = require("pino");
const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime, // ISO timestamps (K8s friendly)
  formatters: {
    level(label, number) {
      return { level: label }; // readable field
    },
  },
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: true,
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

module.exports = logger;
