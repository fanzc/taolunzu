
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res, next){
    req.onValidationError(function(msg) {
        res.json(401, {
            success: 0, msg: msg
        });
    });

    req.checkBody('email', 'Email or password error.').len(6, 64).isEmail();
    req.checkBody('password', 'Email or password error.').len(8, 20);

    res.json({
        email: req.param('email')
    });
};

exports.logout = function(req, res, next){
    res.json({
        msg: "Logged out!"
    });
};
