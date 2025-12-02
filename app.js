// app.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {  
  console.log(`Root API called....`);
  res.send('Hello welcome to my node application');
});

app.get('/health', (req, res) => {
  console.log(`This is the health route`);
  res.send('This is the health route');
});


app.listen(port, () => {  
  console.log(`Example app listening at http://localhost:${port}`);
});
