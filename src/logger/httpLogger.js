const pinoHttp = require("pino-http");
const logger = require("./logger.js");
const { v4: uuid } = require("uuid");

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    return req.headers["x-request-id"] || uuid(); // ensures trace continuity
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
  autoLogging: true, // logs every request
});

module.exports = httpLogger;
