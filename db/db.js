var monk = require('monk');
var mongoUrl = "mongodb://192.168.1.112:27017/punchsystem";
function getNextSenqence(colName, db, fn) {
    if(!db)
        db = monk(mongoUrl);
    var sequence = db.get('sequence');
    sequence.findAndModify({
        query: { id: colName },
        update : { $inc : { seq : 1 } },
        new: true
    }, fn);            
}
module.exports = {
    getDb : function() {
        return monk(mongoUrl);
    },
    newDocWithIncId : function(colName, insertDoc, db, callback) {
        if(!db)
            db = monk(mongoUrl);
        getNextSenqence(colName, db, function(err, doc){
            if(err)
                throw err;
            var seq = doc.seq+1;
            insertDoc['_id'] = seq;
            console.log(doc);
            db.get(colName).insert(insertDoc, callback);
        });
    }
}