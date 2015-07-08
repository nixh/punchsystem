function redirectToLogin(res) {
    res.redirect(303, '/login');
}

function Authentication() {

    return function(req, res, next) {
        if (req.path === "/login")
            return next();

        var sessionid = req.cookies.sessionid;
        if (!sessionid) {
            return redirectToLogin(res);
        }
        var db = req.db;
        var sessionCol = db.get('session');
        sessionCol.findOne({ sessionid: sessionid }, {}, function(err, doc) {
            if (err || !doc)
                return redirectToLogin(res);
            
            
            
            next();
        });

    };
}

module.exports = Authentication;
