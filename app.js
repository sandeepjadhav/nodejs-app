// app.js
const express = require('express');
const pino = require('pino-http')()


const app = express();
const port = 3000;

app.use(pino);

app.get('/', (req, res) => {  
  req.log.info('Root API called');
  res.send('Hello welcome to my node application');
});

app.get('/health', (req, res) => {
  req.log.info('This is the health route')
  res.send('This is the health route');
});

app.post('/users', (req, res) => {
  req.log.info(`POST users API called ${JSON.stringify(req?.body)}`);
  res.send('This is the health route');
});

app.listen(port, () => {  
  console.log(`Example app listening at http://localhost:${port}`);
});
