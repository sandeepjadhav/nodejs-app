// logger.js
const pino = require('pino');

// Set up the logger
const logger = pino({
  level: 'info', // Default log level
  transport: {
    target: 'pino-pretty', // Pretty logs in dev
    options: {
      colorize: true, // Add colors to the logs
    },
  },
});

module.exports = logger;