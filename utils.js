function Utils() {

    return {
        render : function(tmplPath, data) {
            return function(req, res, next) {
                if(!data) data = {};
                data['tr'] = res.__;
                return res.render(tmplPath, data);
            }
        }
    }
}

module.exports = new Utils();

