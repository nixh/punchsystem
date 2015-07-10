var loginRoute = require('./routes/index');

function redirectToLogin(req, res) {
    loginRoute.getLoginPage(req, res);
}

function matchSupervisor(path) {
    return /^\/supervisor/.test(path);
}

function Authentication() {

    return function(req, res, next) {

        if (req.path === "/login" ||
                req.path === '/logout')
            return next();

        var sessionid = req.cookies.sessionid;
        if (!sessionid) {
            console.log('authentication: session missing -> ' + sessionid);
            return redirectToLogin(req, res);
        }

        var db = req.db;
        var sessionCol = db.get('session');
        sessionCol.findOne({ sessionid: sessionid }, {}, function(err, doc) {
            if (err || !doc) {
                res.clearCookie('sessionid');
                return redirectToLogin(req, res);
            }

            if(matchSupervisor(req.path) && !doc.compowner) {
                res.status(404).end();
            }

            next();
        });

    };
}

module.exports = Authentication;
