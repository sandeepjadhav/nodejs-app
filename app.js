// app.js
const express = require('express');
const logger = require('./logger'); // Import your logger

const app = express();
const port = 3000;


app.get('/', (req, res) => {  
  logger.info('Root API called');
  res.send('Hello welcome to my node application');
});

app.get('/health', (req, res) => {
  logger.info('This is the health route')
  res.send('This is the health route');
});

app.post('/users', (req, res) => {
  logger.info(`POST users API called ${JSON.stringify(req?.body)}`);
  res.send('This is the health route');
});

app.listen(port, () => {  
  logger.info(`Example app listening at http://localhost:${port}`);
});
