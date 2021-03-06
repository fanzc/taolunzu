/**
 * Module dependencies.
 */
var crypto = require('crypto');
var express = require('express');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('./routes/user');
var topic = require('./routes/topic');
var db = require('./db');
var config = require('./config');
var http = require('http');
var path = require('path');
var csrf = express.csrf();

var app = express();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    db.hgetall('user:' + username, function(err, user){
        done(err, user);
    });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
        db.hgetall('user:' + username, function(err, user){
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'incorrect username'});
            }
            // check password
            if (crypto.createHmac('sha1', user._salt).update(password).digest('hex') != user.password) {
                return done(null, false, {message: "Invalid password"});
            }
            return done(null, user);
        });
    }
));

function conditionCSRF(req, res, next) {
    if (req.get('X-Client-Id') === config.client_id) {
        next();
    } else {
        csrf(req, res, next);
    }
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.get('X-Access-Token')) {
        db.get('access_token:' + req.get('X-Access-Token') + ':username', function(err, username){
            if (err || !username ) {
                return res.json(401, {msg: "Login required 1"});
            }
            db.hgetall('user:' + username, function(err, user){
                if (err) {
                    return res.json(401, {msg: "Login required 2"});
                }
                req.user = user;
                next();
            });
        });
    } else {
        return res.json(401, {msg: "Login required 3"});
    }
}

// all environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressValidator([]));
app.use(express.cookieParser('replace this with your secret key'));
app.use(express.cookieSession());
app.use(conditionCSRF);
app.use(function(req, res, next){
    res.cookie('XSRF-TOKEN', req.session._csrf);
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/login', passport.authenticate('local'), user.login);
app.post('/logout', user.logout);
app.post('/register', user.register);
app.get('/user', ensureAuthenticated, user.me);

app.get('/topics', ensureAuthenticated, topic.getTopics);
app.get('/topic/:tid', ensureAuthenticated, topic.getTopic);
app.post('/topics', ensureAuthenticated, topic.postTopic);

app.get('/topic/:tid/replies', ensureAuthenticated, topic.getReplies);
app.get('/topic/:tid/reply/:rid', ensureAuthenticated, topic.getReply);
app.post('/topic/:tid/replies', ensureAuthenticated, topic.postReply);

app.get('/messages', ensureAuthenticated, topic.getMessages);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
