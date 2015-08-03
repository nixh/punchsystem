var dbm = require('./lib/common/db');
var logger = require('./logger');
var Q = require('q');
var moment = require('moment');
var _ = require('underscore');
var crypto = require('crypto');

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

var roles = [{
    name: 'root',
    type: 'allow',
    perm: "^\/."
},{
    name: 'employee',
    type: 'deny',
    perm: "^\/(sa|supervisor)\/"
},{
    name: 'supervisor',
    type: 'deny',
    perm: "^\/sa\/"
}];

var roleColName = 'roles';
function initializeRoles(roles) {
    function newRoles() {
        return dbm.insert('roles', roles).call(this);
    }
    return dbm.use(wrap(roleColName), dropIfExists, newRoles)
              .then(function(values){
                  logger.info('successfully inserted roles');
                  logger.debug('data below:');
                  debugArray(values);
              });
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
        var lastcompId = 0;
        var users = number.times(function(i){
            if(i !== 0 && i % threshold === 0) {
                compid++;
            }
            var userObj = _.extend({}, defaultUserTemplate);
            userObj.name = "name" + i;
            userObj.compid = compid;
            userObj.userid = "user" + i;
            userObj.role = compid !== lastcompId ? 'supervisor' : 'employee';
            lastcompId = compid;
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

function initializeRecords() {
    function getUserinfo() {
        return dbm.query('users', {});
    }
    function newRecords(users) {
        var inDates = [8,9,10];
        var outDates = [17,18,19];
        var promises = users.map(function(user){
            var startDate = moment('2015-07-01');
            var randomDays = radomInt(20, 40);
            var records = randomDays.times(function(){
                var startTime = inDates[radomInt(2)];
                var endTime = outDates[radomInt(2)];
                var inDate = startDate.hour(startTime);
                inDate = inDate.valueOf();
                var outDate = startDate.hour(endTime);
                outDate = outDate.valueOf();
                var recObj = {
                    compid: user.compid,
                    userid: user.userid,
                    inDate: inDate,
                    outDate: outDate,
                    hourlyRate: user.rates[user.rates.length-1].rate
                };
                startDate = startDate.add(1, 'd');
                return recObj;
            });
            return dbm.insert('records', records);
        });
        return dbm.parallel(promises);
    };
    return dbm.use(wrap('records'), dropIfExists, getUserinfo(), newRecords).then(function(values){
        logger.info("user punch records initializing completed");
    });
}

Q.when(['users','comps','records','reports', 'roles', 'log'], initializeSequence)
 .then(wrap(roles)).then(initializeRoles)
 .then(wrap(initCompNum)).then(initializeCompanies)
 .then(wrap(initUserNum)).then(initializeUserBasicInfo)
 .then(initializeRecords);
