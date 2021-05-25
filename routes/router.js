var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');




var VerifyToken = require('../Auth/VerifyToken.js');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../models/user');

/**
 * Configure JWT
 */
 var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
 var bcrypt = require('bcryptjs');
 var config = require('../config'); // get config file

 require("dotenv-safe").config();

 require('dotenv').config({path:'/.env'});

router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/'));
});

router.get('/index2.html', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/views/index2.html'));
});

router.get('/views/index1.html', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/views/index1.html'));
});

router.post('/login', function(req, res) {

  User.findOne({ email: req.body.logemail }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.logpassword, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    

    // return the information including token as JSON
    req.session.userId = user._id;
        return res.redirect('/profile');
  });

});



router.post('/register', function (req, res, next) {
  
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Password doesn\'t match!');
    err.status = 400;
    res.send('Password doesn\'t match!');
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password!');
        err.status = 401;
        return next(err);
      } else {
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields are required!');
    err.status = 400;
    return next(err);
  }
})

router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Login não autorizado');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h2>Seu Nome: </h2>' + user.username + '<h2>Seu Email: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});


// add the middleware function
router.use(function (user, req, res, next) {
  res.status(200).send(user);
});


router.get('/logout', function (req, res, next) {
  if (req.session) {
    
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/index.html');
      }
    });
  }
});

module.exports = router;