// app.js
const express = require("express");
const logger = require("./src/logger/logger.js");
const httpLogger = require("./src/logger/httpLogger.js");

const app = express();
const port = 3000;

// HTTP logs with correlation ID
app.use(httpLogger);

app.get("/", (req, res) => {
  logger.info("Root API called");
  res.send("Hello welcome to my node application");
});

app.get("/health", (req, res) => {
  logger.info("This is the health route updated");
  res.send("This is the health route updated");
});

app.post("/users", (req, res) => {
  logger.info(`POST users API called ${JSON.stringify(req?.body)}`);
  res.send(req?.body);
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
