
/**
 * Module dependencies.
 */

var express = require('express');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('./routes/user');
var topic = require('./routes/topic');
var http = require('http');
var path = require('path');

var app = express();

var csrfValue = function(req) {
    var token = (req.body && req.body._csrf)
        || (req.query && req.query._csrf)
        || (req.headers['x-csrf-token'])
        || (req.headers['x-xsrf-token']);
    return token;
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var user = {
        id: 1,
        email: 'fanzc.daily@gmail.com'
    };
    done(null, user);
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    function(username, password, done) {
        // asynchronous verification, for effect...
        console.log('username: ' + username);
        process.nextTick(function () {
            var user = {
                id: 1,
                email: username
            };
            console.log('password: ' + password);
            return done(null, user);
        });
    }
));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json(401, {msg: "Login required"});
}

// all environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator([]));
app.use(express.cookieParser('replace this with your secret key'));
app.use(express.cookieSession());
app.use(express.csrf({value: csrfValue}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.cookie('XSRF-TOKEN', req.session._csrf);
    next();
});
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/login', passport.authenticate('local'), user.login);
app.post('/logout', user.logout);
app.get('/topics', ensureAuthenticated, topic.getTopicList);
app.get('/topic/:tid', ensureAuthenticated, topic.getTopicDetail);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
