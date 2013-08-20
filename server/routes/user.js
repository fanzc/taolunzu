var passport = require('passport');

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
exports.login = function(req, res) {
    res.json({
        id: 1,
        email: req.param('email')
    });
};

exports.logout = function(req, res, next){
    res.json({
        msg: "Logged out!"
    });
};
