var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.get('/', (req, res) => {
  
});

app.listen(3000, function() {
  console.log('SERVER STARTED, LISTENING ON PORT: 3000');
});