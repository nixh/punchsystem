var logger = require('./logger');
logger.info('hello %s', "Q");

var monk = require('monk');
var db = monk('localhost/aps');

db.driver.collectionNames(function(err, names){
    console.log(names);
    db.close();
});

