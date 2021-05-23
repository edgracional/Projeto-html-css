var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');





// Set up mongoose connection

var dev_db_url = 'mongodb+srv://edweb:ederse@@edweb.wqrbc.mongodb.net/test';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));







app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/'));

var routes = require('./routes/router');
app.use('/', routes);


app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


app.listen(5000, function () {
  console.log('Listening on port 5000...');
});

