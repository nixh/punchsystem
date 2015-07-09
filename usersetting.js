
var monk = require('monk');
var mongoUrl = "mongodb://127.0.0.1:27017/punchsystem";

var email = require("emailjs/email");


function sendmail(usermail)
{
	 
	 var server = email.server.connect({
		user: 'report@adminsys.us',
		password :'Future123456#',
		host: 'adminsys.us',
		ssl :false
	 });
	 
	
	var attachment=
	{
		name:'text.txt',
		data : 'hello world',
		type: 'text/plain'
	};

	var message = {
		text: "Your password has been changed successfully", 
		from:'report@adminsys.us',       // 发送地址
		to: usermail, // 接收列表
		subject: "Password change confirm",                             // 邮件主题
								 // 文本内容
		attachments: attachment
	};

	server.send(message, function(err, message) { console.log(err || message); });
}

/*function updatepassword(userid,oldpass,newpass,fn) 
{       
	var db=monk(mongoUrl);
	var collection=db.get("users");
	collection.update({'password':oldpass,'userid':userid},{"$set":{'password':newpass}},fn);
	
}   */

/*function usermail(userid,fn){
	var db=monk(mongoUrl);
	var collection=db.get("users");
	collection.find({'userid':userid},{"email":1},fn);
	
}*/
module.exports = { 
	changepass : function(userid, oldpass,newpass,callback){
		var db=monk(mongoUrl);
		var collection=db.get("users");
		collection.update({'password':oldpass,'userid':userid},{"$set":{'password':newpass}},
			callback);
	
		
		//updatepassword(userid, oldpass,newpass, callback);
		
	},

	receiveemail : function(userid,callback) {
		
		var db=monk(mongoUrl);
		
		var collection=db.get("users");
	
		collection.findOne({'userid':userid}, {fields: { "email":1,"_id":0}} ,

						callback);
		
		
	}

	/*enablesendemail : function(userid,frequency,callback){
		var db = monk(mongoUrl);
		var collection = db.get("users");
		
		var usermail = collection.findOne({'userid':userid},{fields:{'email':1,"_id":0}});
		
		sendmail(usermail);
		
	},*/

	/*avelocation : function(userid,location,callback){
		var db = monk(mongoUrl);
		collection = db.get('company');
		var longitude = location.longitude;
		var	altitude = location.altitude;
		var heading = location.heading;
		collection.update(
			{
				"userid":userid
			},
				{
					"$set":{"location":
							{
								"longitude":longitude,
								"altitude":altitude,
								"heading":heading
								
							}
						}
				},
		callback
		)

	}*/


		
};
