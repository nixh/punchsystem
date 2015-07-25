var dbm = require('./lib/common/db');
var logger = require('./logger');
var Q = require('q');
var moment = require('moment');
var _ = require('underscore');
var crypto = require('crypto');

dbm.setUrl('localhost/aps');

dbm.on('error', function(err){
    logger.error(err);
});

dbm.on('after:updateOne', function(ret){
});

Number.prototype.times = function(callback) {
    var num = this;
    var arr = [];
    for(var i=0; i<num; i++) {
        arr.push(callback(i));
    }
    return arr;
};

function wrap(value) {
    return function() { return value; };
}

function sha(str) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(str);
    return sha256.digest('hex');
}

function debugArray(arr) {
    arr.forEach(function(v){
        logger.debug(JSON.stringify(v));
    });
}

function radomInt(start, end) {
    if(!end) {
        end = start;
        start = 0;
    }
    if(!_.isNumber(start) || !_.isNumber(end)) {
        throw new Error('arguments should be a number');
    }
    return start + Math.floor(Math.random() * end);
}

function getNextSequence(colName) {
    return dbm.updateOne(sequenceColName, { col_id:colName }, { $inc : { seq : 1 } }).call(this);
}

function logDropInfo(colName) {
    return function(dropped) {
        if(!dropped)
            logger.warn('%s is not exists no need to drop!', colName);
        else
            logger.info('dropped %s collection successfully!', colName);
        return Q(true);
    };
}

function dropIfExists(colName) {
    return dbm.use(dbm.dropIfExists(colName))
              .then(logDropInfo(colName));

}

var sequenceColName = 'sequence';
function initializeSequence(colNames) {
    function newSequence() {
        var promises = colNames.map(function(name){
            return dbm.insert(sequenceColName, {'col_id':name, seq:0});
        });
        return dbm.parallel(promises).then(function(values){
            logger.info('initialized sequence collection successfully!');
            logger.debug('data below:');
            debugArray(values);
        });
    }
    return dbm.use(wrap(sequenceColName), dropIfExists, newSequence);
}


var compColName = 'comps';
var initCompNum = 50;

function initializeCompanies(number) {

    function newComps() {
        var now = moment().valueOf();
        var defaultCompTemplate = {
            registerDate: now,
            desc: 'company data for test!'
        };
        var promises = number.times(function(i){
            return dbm.use(wrap(compColName), getNextSequence, function(seq) {
                var insertObj = _.extend({}, defaultCompTemplate);
                insertObj.compid = seq.seq;
                insertObj.name = "compname" + i;
                var overFifteenDays = radomInt(15, 30);
                var randomTime = moment().add(overFifteenDays, 'w').valueOf();
                insertObj.expires = randomTime;
                return dbm.insert(compColName, insertObj).call(this);
            });
        });
        return Q.all(promises).then(function(values){
            logger.info('successfully inserted %d companies.', number);
            logger.debug('data below:');
            debugArray(values);
        });
    }
    return dbm.use(wrap(compColName), dropIfExists, newComps);
}

//Db User Collection
var userColName = 'users';
var initUserNum = 550;

function initializeUserBasicInfo(number) {
    function newUsers() {
        var now = moment().valueOf();
        var defaultUserTemplate = {
            registerDate: now,
            desc: 'user data for test!',
            password: sha('U123#.'),
            enable: true,
            rates: [{change_time: now, rate:8.75}]
        };
        var threshold = Math.ceil(number / initCompNum);
        var compid = 1;
        var users = number.times(function(i){
            if(i !== 0 && i % threshold === 0) {
                compid++;
            }
            var userObj = _.extend({}, defaultUserTemplate);
            userObj.name = "name" + i;
            userObj.compid = compid;
            userObj.userid = "user" + i;
            return userObj;
        });
        return dbm.use(dbm.insert(userColName, users)).then(function(values){
            logger.info('successfully inserted %d users.', number);
            logger.debug('data below:');
            debugArray(values);
        });
    }
    return dbm.use(wrap(userColName), dropIfExists, newUsers);
}

function initializeRoles(roles) {

}

Q.when(['users','comps','records','reports','role'], initializeSequence)
 .then(wrap(initCompNum)).then(initializeCompanies)
 .then(wrap(initUserNum)).then(initializeUserBasicInfo);
