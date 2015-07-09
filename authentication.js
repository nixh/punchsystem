var loginRoute = require('./routes/index');

function redirectToLogin(req, res) {
    loginRoute.getLoginPage(req, res);
}

function Authentication() {

    return function(req, res, next) {
        if (req.path === "/login" ||
                req.path === '/logout')
            return next();

        var sessionid = req.cookies.sessionid;
        if (!sessionid) {
            return redirectToLogin(req, res);
        }
        var db = req.db;
        var sessionCol = db.get('session');
        sessionCol.findOne({ sessionid: sessionid }, {}, function(err, doc) {
            if (err || !doc)
                return redirectToLogin(req, res);
            next();
        });

    };
}

module.exports = Authentication;
