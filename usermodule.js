var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var cryptoutils = require('./lib/common/utils').crypto;
var moment = require('moment');

var DBModule = require('./db_module');

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

    // if (typeof userObj['owner'] !== "boolean") {
    //     userObj['owner'] = !!parseInt(userObj['owner']);
    // }

    //if (typeof userObj['curRate'] !== 'number') {
    //    userObj['curRate'] = Number(userObj['curRate']);
    //}

    // if (typeof userObj['compid'] !== 'number') {
    //     userObj['compid'] = Number(userObj['compid']);
    // }
};


function addUser(userObj, callback) {
    validate(userObj);

    var addr = trim(userObj.address_street)
                 + "|" + trim(userObj.address_city)
                 + "|" + trim(userObj.address_state)
                 + "|" + trim(userObj.address_zip);

    userObj.address = addr;
    userObj.owner = false;
    var curRate = parseFloat(userObj.curRate);
    if(!isNaN(curRate)) {
        var changetime = userObj.rate_change_date;
        changetime = moment(changetime, 'YYYY-MM-DD').valueOf();
        userObj.hourlyRate = [{ rate: curRate, changetime: changetime }];
    }

    delete userObj.rate_change_date;

    var password = userObj.password;
    password = cryptoutils.sha(password);
    userObj.password = password;

    var col = this.db.get('users');
    col.find({
        "userid": userObj.userid
    }, function(err, doc) {

        if (err) {
            callback(new Error('user error!'));
        }
        else{
            if(!doc || doc.length === 0){
                col.insert(userObj, callback);
            }else{
                callback(new Error("User already exists!"));
            }
        }
    });

    // var db = new DBModule({
    //     schemaName: 'users',
    //     idName: 'userid'
    // });

    // db.loadById(userObj.userid, function(err, doc){
    //     if(err)
    //         callback(new Error('search error!'));
    //     if(!doc || doc.length === 0)
    //         return db.insert(userObj, callback)
    //     callback(new Error("User already exists!"));
    //
    // });
}

function searchUser(searchTerm, compid, callback) {

    var col = this.db.get('users');
    if (typeof compid === 'function')
        callback = compid;

    col.find({
            'name': {
                $regex: searchTerm,
                $options: "i"
            },
            owner: false
            ,
            'compid': typeof compid !== 'function'
                         ? parseInt(compid) : undefined
        }, {},
        callback
    );
}

function getAllUsers(query, callback) {
    var col = this.db.get('users');
    col.find(query, {sort: {createDate: 1}}, callback);
}

function getUserInfo(userid, callback) {
    var col = this.db.get('users');
    col.findOne({
            'userid': userid
        },
        callback
    )
}

function changeUser(userObj, callback) {

    validate(userObj);

    var _id = userObj._id;

    userObj.address = trim(userObj.address_street) + "|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);

    var col = this.db.get('users');

    var append = {};

    if(!userObj.password) {
        delete userObj.password;
    } else {
        userObj.password = cryptoutils.sha(userObj.password);
    }

    if(userObj.curRate){
        if(!userObj.rate_change_date) {
            append = false;
        } else {
            var changetime = moment(userObj.rate_change_date, 'YYYY-MM-DD').valueOf();
            append.rate = parseFloat(userObj.curRate);
            append.changetime = changetime;
            delete userObj.rate_change_date;
        }
    }

    if(!userObj.avatar){
        delete userObj.avatar;
    }

    if(!userObj.avatar_url){
        delete userObj.avatar_url;
    }

    delete userObj._id;

    var update = { $set: userObj };
    if(append) update['$push'] = { hourlyRate: append };

    col.findAndModify(
        {
            query: {'_id': _id},
            update: update
        },
        callback
    );
}

function deleteUser(_id, callback) {
    var col = this.db.get('users');
    col.remove({
            "_id": _id
        },
        callback
    )
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
