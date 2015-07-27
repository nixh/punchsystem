function ActionUtils() {
}

ActionUtils.prototype.defaultGET = function(templatename, type) {
    if(!type)
        type = 'jade';
    return {
        template: templatename,
        type: type,
        execute: function(req, res, next) {
            return {};
        }
    }
}

function Utils() {
    return {
        actions : new ActionUtils(),
        wrap : function(obj) { return obj; }
    }
}


module.exports = Utils();
