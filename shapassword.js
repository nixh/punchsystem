var monk = require('monk');
var db = monk('localhost/punchsystem');
var utils = require('./lib/common/utils');
var sha = utils.crypto.sha;
db.get('users').find({}, function(err, users){
    var idList = users.map(function(u){ return u._id; });
    db.get('users').update({ _id: { $in : idList } }, 
                           { $set: { password: sha('0000') } },
                           { multi: true },
        function(err, updates) {
            console.log(updates);
	    db.close();
        });
});
