function trim(s){
	return (s || '').replace(/^\s+|\s+$/g, '');
};

function validate(userObj){
	if(userObj === null){
		 userObj = {};
	}
	
	var userProp = ['userid', 'password', 'createDate', 'name', 'sex', 'email', 'address', 'tel', 'compid', 'curRate', 'remark', 'avatar', 'owner'];
	
	for(var a in userObj){
		if(userProp.indexOf(a) < 0){
			delete userObj[a];
		}	
	}
	
	if(typeof userObj['sex'] !== "boolean"){
		userObj['sex'] = !!parseInt(userObj['sex']);
	}
	
	if(typeof userObj['owner'] !== "boolean"){
		userObj['owner'] = !!parseInt(userObj['owner']);
	}
};

module.exports = {
	addUser: function(userObj, col, callback){
		validate(userObj);
		col.insert(userObj, callback);
	},

	
	searchUser: function(searchTerm, col, callback){
		col.find(
			{
				'userid': {$regex: searchTerm}
			},
			{},
			callback
		);
	},
	
	getAllUsers: function(col, callback){
		col.find({}, {}, callback);
	},
	
	getUserInfo: function(userid, col, callback){
		col.findOne(
			{
				'userid': userid
			},
			callback
		)
	},
	
	changeUser: function(userObj, col, callback){
		validate(userObject);
		
		var _id = body._id;
		
		var addr = trim(userObj.address_street) +"|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);
		
		col.update(
			{
				'_id': _id
			},
			{
				'$set':
				{
					'userid': userObj.userid,
					'name': userObj.username,
					'createDate': userObj.createDate,
					'password': userObj.password,
					'sex': !!parseInt(userObj.sex),
					'email': userObj.email,
					'address': userObj.addr,
					'compid': userObj.compid
				}
			},
			callback
		);
	},
	
	deleteUser: function(userObj, col, callback){
		col.remove(
			{
				"-id": _id
			},
			callback
		)
	}
}