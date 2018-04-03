const path = require('path');
const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const portNum = process.env.PORT || 3000;
const db = require('./utils/db');

// display landing page on base route
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/api', apiRouter);
app.listen(portNum);