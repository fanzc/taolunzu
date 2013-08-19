
/**
 * Module dependencies.
 */

var express = require('express');
var expressValidator = require('express-validator');
var user = require('./routes/user');
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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator([]));
app.use(express.cookieParser('replace this with your secret key'));
app.use(express.cookieSession());
app.use(express.csrf({value: csrfValue}));
app.use(function(req, res, next){
    res.cookie('XSRF-TOKEN', req.session._csrf);
    next();
});
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/login', user.login);
app.get('/logout', user.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
