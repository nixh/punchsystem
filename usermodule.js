var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');

var db = require('./db/db');

// Trim leading and trailing spances
function trim(s) {
    return (s || '').replace(/^\s+|\s+$/g, '');
};

// Validate user input
function validate(userObj) {
    if (userObj === null) {
        userObj = {};
    }

    var userProp = ['_id', 'userid', 'password', 'createDate', 'name', 'sex', 'email', 'address', 'address_street', 'address_city', 'address_state', 'address_zip', 'tel', 'compid', 'curRate', 'remark', 'avatar', 'owner'];

    for (var a in userObj) {
        if (userProp.indexOf(a) < 0) {
            delete userObj[a];
        }
    }

    if (typeof userObj['sex'] !== "boolean") {
        userObj['sex'] = !!parseInt(userObj['sex']);
    }

    if (typeof userObj['owner'] !== "boolean") {
        userObj['owner'] = !!parseInt(userObj['owner']);
    }

    if (typeof userObj['curRate'] !== 'number') {
        userObj['curRate'] = Number(userObj['curRate']);
    }

    if (typeof userObj['compid'] !== 'number') {
        userObj['compid'] = Number(userObj['compid']);
    }
};


function addUser(userObj, callback) {
    validate(userObj);

    var addr = trim(userObj.address_street)
                 + "|" + trim(userObj.address_city)
                 + "|" + trim(userObj.address_state)
                 + "|" + trim(userObj.address_zip);

    userObj.address = addr;

    // console.log(userObj.userid);

    var col = this.db.get('users');

    col.find({
        "userid": userObj.userid
    }, function(err, doc) {
        if (err) {
            res.send('Search user error!');
        } else {
            // console.log('The doc is ...');
            // console.log(doc);
            if (!doc || doc.length === 0) {
                col.insert(userObj, callback);
            } else {
                throw "User already exists!";
            }
        }
    });
}

function searchUser(searchTerm, compid, callback) {
    var col = this.db.get('users');
    if (typeof compid === 'function')
        callback = compid;

    col.find({
            'name': {
                $regex: searchTerm
            },
            'compid': typeof compid !== 'function'
                         ? parseInt(compid) : undefined
        }, {},
        callback
    );
}

function getAllUsers(query, callback) {
    var col = this.db.get('users');
    col.find(query, {}, callback);
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

    console.log(userObj);

    var _id = userObj._id;

    userObj.addr = trim(userObj.address_street) + "|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);

    var col = this.db.get('users');
    col.update({
            '_id': _id
        }, {
            '$set': {
                'userid': userObj.userid,
                'name': userObj.name,
                'createDate': userObj.createDate,
                'password': userObj.password,
                'sex': !!parseInt(userObj.sex),
                'email': userObj.email,
                'address': userObj.addr,
                'compid': userObj.compid,
                'tel': userObj.tel,
                'curRate': userObj.curRate,
                'owner': userObj.owner,
                'remark': userObj.remark,
                'avatar': userObj.avatar
            }
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
