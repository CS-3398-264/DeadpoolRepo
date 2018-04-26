const path = require('path');
const express = require('express');
const apiRouter = require('./routes/api');
const db = require('./utils/db');
const portNum = process.env.PORT || 3000;
const app = express();

// display landing page on base route
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname + '/index.html'));
});

// allow CORS support
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api', apiRouter);

app.listen(portNum);