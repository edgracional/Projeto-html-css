var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);






const MongoDbStore = require('connect-mongo');





mongoose.connect('mongodb+srv://edweb:ederse@@edweb.wqrbc.mongodb.net/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){});


app.use(
    session({
        secret: 'story book',
        resave: false,
        saveUninitialized: false,
        store: MongoDbStore.create({
            mongoUrl: 'mongodb+srv://edweb:ederse@@edweb.wqrbc.mongodb.net/test'
        })
    })
);


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


app.listen(3210, function () {
  console.log('Listening on port 3210...');
});

