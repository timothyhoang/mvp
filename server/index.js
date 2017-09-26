const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('../database');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

app.post('/data', (req, res) => {
  db.save(req.body)
    .then(result => {
      res.end();
    })
    .catch(err => {
      res.status(500).end();
    });
});

app.get('/data', (req, res) => {

  res.end();
});

app.listen(3000, function() {
  console.log('SERVER STARTED, LISTENING ON PORT: 3000');
});