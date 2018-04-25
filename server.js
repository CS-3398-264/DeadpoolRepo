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

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

app.use('/api', apiRouter);

app.listen(portNum);