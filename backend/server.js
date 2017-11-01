const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const User = require('./Models/User');
const Document = require('./Models/Document');

mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({ secret: 'secret sauce' }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
      return done(err);
    }
    if (!user) {
      console.log(user);
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}
));

app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static(path.join(__dirname, 'build')));

app.post('/MyLogin', passport.authenticate('local'), function(req, res) {
  res.json({success: true, user: req.user});
});


app.post('/MyRegister', (req, res) => {
  // console.log(req.body, 'body');
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
  });
  newUser.save((err, result) => {
    if(err) {
      res.json({success: false, err: err});
    } else {
      res.json({success: true});
    }
  });
});

app.post('/MyPortal', (req, res) => {
  console.log(req.body, 'body');
  const newDocument = new Document({
    title: req.body.title,
    docId: req.body.docId,
    password: req.body.password,
  });
  newDocument.save((err, result) => {
    if(err) {
      res.json({success: false, err: err});
    } else {
      res.json({success: true});
    }
  });
});


app.listen(3000);
