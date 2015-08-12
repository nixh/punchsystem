var loginRoute = require('./routes/index');
var factory = require('./lib/module/moduleFactory')();

function redirectToLogin(req, res) {
    loginRoute.getLoginPage(req, res);
}

function matchSupervisor(path) {
    return /^\/supervisor/.test(path);
}

var am = factory.get('authModule');

function Authentication() {

    return function(req, res, next) {

        if(req.path === "/login" ||
                req.path === '/logout' ||
                req.path === '/api/auth_key' ||
                req.path === '/api/disable_key')
            return next();

        if(/^\/api\//.test(req.path)) {
            var authKey = req.get('auth_key');
            if(authKey) {
                return am.existsAuthKey(authKey).then(function(valid){
                    if(!valid) {
                        res.type('json');
                        return res.send({
                            msg: 'Forbiden',
                            statusCode: 403,
                            status: 'fail'
                        });
                    } else {
                        return next();
                    }
                });
            } else {
                var err = new Error('invalid_authkey');
                err.status = 403;
                res.type('json');
                return res.send({
                    msg: 'Forbiden',
                    err: err.message,
                    statusCode: 403,
                    status: 'fail'
                });
            }
        }

        var sessionid = req.cookies.sessionid;
        if (!sessionid) {
            console.log('authentication: session missing -> ' + sessionid);
            return redirectToLogin(req, res);
        }
        var db = req.db;
        var sessionCol = db.get('session');
        sessionCol.findOne({ sessionid: sessionid }, {}, function(err, doc) {
            if (err || !doc || !doc.compid) {
                res.clearCookie('sessionid');
                return redirectToLogin(req, res);
            }

            if(matchSupervisor(req.path) && !doc.compowner) {
                res.status(404);
                var err = new Error('Not Found!');
                return next(err);
            }

            res.cookie('sessionid', sessionid, {
                maxAge: 30 * 24 * 3600 * 1000,
                httpOnly: true
            });

            next();
        });

    };
}

module.exports = Authentication;
