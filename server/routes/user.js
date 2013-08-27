var passport = require('passport');
var crypto = require('crypto');
var util = require('util');
var db = require('../db');
var uuid = require('node-uuid');
var config = require('../config');

var DEFAULT_AVATAR = 'http://tp1.sinaimg.cn/2972287924/180/40002983278/1';
var SALT_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function makeSalt (length) {
    var salt = [];
    var randomNum = 0;
    for (var i = 0; i < length; i++) {
        randomNum = parseInt(Math.random() * SALT_CHARS.length, 10);
        salt.push(SALT_CHARS[randomNum]);
    }
    return salt.join('');
}

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
exports.login = function(req, res) {
    var access_token = uuid.v4();
    if (req.query.cid === config.client_id) {
        // delete previous access_token:%:username record, update username:%:access_token
        // record
        db.get('username:' + req.user.username + ':access_token', function(err, ret){
            if (err) {
                console.log(err);
            } else {
                db.del('access_token:' + ret + ':username');
            }
        });
        db.set('username:' + req.user.username + ':access_token', access_token);

        // update access_token:%:username record
        db.set('access_token:' + access_token + ':username', req.user.username, function(err, ret){
            if (err) {
                return res.json(401, {msg: "Authorization error"});
            }
            return res.json({
                username: req.user.username,
                avatar: req.user.avatar,
                access_token: access_token
            });
        });
    } else {
        return res.json({
            username: req.user.username,
            avatar: req.user.avatar
        });
    }
};

exports.logout = function(req, res) {
    req.logout();
    if (req.query.access_token || req.query.cid === config.client_id) {
        db.del('access_token:' + req.query.access_token + 'username');
    }
    return res.json({msg: "Logged out"});
};

exports.register = function(req, res) {
    req.checkBody('username', 'Invalid username').notEmpty().len(6, 16);
    req.checkBody('password', 'Invalid password').notEmpty().len(8, 20);
    req.checkBody('confirm', 'Password confirm error').notEmpty()
        .equals(req.param('confirm'))
        .len(8, 20);

    var errors = req.validationErrors();
    if (errors) {
        return res.json(400, util.inspect(errors));
    }

    db.exists('user:' + req.param('username'), function(err, exists){
        if (err) {
            return res.json(400, {msg: err});
        }
        if (exists) {
            return res.json(400, {msg: "Username already taken. choose another one."});
        }
        var salt = makeSalt(32);
        var passwordHash = crypto.createHmac('sha1', salt)
            .update(req.param('password'))
            .digest('hex');
        var user = {
            username: req.param('username'),
            password: passwordHash,
            _salt: salt,
            avatar: DEFAULT_AVATAR
        };

        db.hmset('user:' + user.username, user, function(err, response){
            if (err) {
                return res.json(400, {msg: err});
            }
            return res.json({msg: response});
        });
    });
};

exports.me = function(req, res){
    return res.json({
        username: req.user.username,
        avatar: req.user.avatar
    });
}
