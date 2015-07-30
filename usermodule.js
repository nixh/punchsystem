var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var dbm = require('./lib/common/db');
var Q = require('q');

var util = require('./lib/common/utils');

var DBModule = require('./db_module');

// Helper function to show mid results in db.use function.
function show(obj) {
    console.log(obj);
    return Q(obj);
}


// Trim leading and trailing spaces
function trim(s) {
    return (s || '').replace(/^\s+|\s+$/g, '');
};

// Validate user input
function validate(userObj) {
    if (userObj === null) {
        userObj = {};
    }

    var userProp = ['_id', 'userid', 'password', 'createDate', 'name', 'sex', 'email', 'address', 'address_street', 'address_city', 'address_state', 'address_zip', 'tel', 'compid', 'curRate', 'remark', 'avatar', 'rate_change_date'];

    for (var a in userObj) {
        if (userProp.indexOf(a) < 0) {
            delete userObj[a];
        }
    }

    if (typeof userObj['sex'] !== "boolean") {
        userObj['sex'] = !!parseInt(userObj['sex']);
    }

    if (typeof userObj['curRate'] !== 'number') {
        userObj['curRate'] = Number(userObj['curRate']);
    }

    return Q(userObj);
}

function parseUserObj(userObj) {
        var address = trim(userObj.address_street)
            + "|" + trim(userObj.address_city)
            + "|" + trim(userObj.address_state)
            + "|" + trim(userObj.address_zip);

        userObj.address = address;
        userObj.owner = false;

        return Q(userObj);
}

function addUserObj(userObj) {
    return dbm.insert('users', userObj).call(this);
}

function addUser(userObj) {
    return dbm.use(util.wrap(userObj), parseUserObj, addUserObj);
}

function searchUser(searchTerm, compid) {
    var query = {
        $or: [
            {name: {$regex: searchTerm, $options: 'i'}},
            {userid: {$regex: searchTerm, $options: 'i'}} ],
        'owner': false,
        'compid': compid
    };

    return dbm.query('users', query).call(this);
}

function getAllUsers(query) {
    return dbm.query('users', query).call(this);
}

function getUserInfo(userid) {
    return dbm.load('users', userid, 'userid').call(this);
}

function changeUserObj(obj) {
    return dbm.updateOne('users', obj.query, obj.doc).call(this);
}

function parseChangeUserInfo(userObj) {
    var res = {};
    res.query = {_id: userObj._id};
    delete userObj._id;

    if(!userObj.avatar){
        delete userObj.avatar;
    }

    if(!userObj.avatar_url){
        delete userObj.avatar_url;
    }

    userObj.address = trim(userObj.address_street)
        + "|" + trim(userObj.address_city)
        + "|" + trim(userObj.address_state)
        + "|" + trim(userObj.address_zip);

    delete userObj._id;

    res.doc = userObj;


    return Q(res);
}

function changeUser(userObj) {
    return dbm.use(util.wrap(userObj), validate, parseChangeUserInfo, changeUserObj);
}

function deleteUser(_id) {
    return dbm.deleteOne('users', {_id: _id}).call(this);
}

function Module(settings) {
    _.extend(this, settings);
    if (!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
}

Module.prototype = {
    addUser: addUser,
    getAllUsers: getAllUsers,
    searchUser: searchUser,
    getUserInfo: getUserInfo,
    changeUser: changeUser,
    deleteUser: deleteUser
}

module.exports = Module
