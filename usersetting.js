
var monk = require('monk');
var mongoUrl = "mongodb://127.0.0.1:27017/punchsystem";
var schedule = require('node-schedule');
var nodemailer = require("nodemailer");

function sendmail(usermail)
{
	 var usermail="957318753@qq.com";
	 var smtpTransport = nodemailer.createTransport("SMTP",
	 {
	 	host: 'adminsys.us',
	 	port: 25,
	 	auth:{
	 		user: 'report@adminsys.us',
	 		pass:'Future123456#'
	 	}
	 });
	
	/*var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "sd2411@nyu.edu",
        pass: "DSj0910190118"
    	}
	});*/
	
	//var smtpTransport = nodemailer.createTransport(config_email);
	var attachment=[
	{
		filename:'text.txt',
		content : 'hello world',
		contentType : 'text/plain'
	}];
	var data = {
	    from:'report@adminsys.us',       // 发送地址
	    to: usermail, // 接收列表
	    subject: "Password change confirm",                             // 邮件主题
	    text: "Your password has been changed successfully",                          // 文本内容
	    attachments: [{
	    	filename: 'test',
	    	content: 'Hello World!'
	    }]
	};

	smtpTransport.sendMail(data, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        //console.log("Email sent " + response.message);
		        console.log("Email sent " + JSON.stringify(response));
		    }
		smtpTransport.close();
});
}

/*function updatepassword(userid,oldpass,newpass,fn) 
{		
	var db=monk(mongoUrl);
	var collection=db.get("users");
	collection.update({'password':oldpass,'userid':userid},{"$set":{'password':newpass}},fn);
	
}	*/

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
		
	},

	enablesendemail : function(userid,frequency,callback){
		var db=monk(mongoUrl);
		var collection = db.get("users");
		var rule = new schedule.RecurrenceRule();
		var usermail = collection.findOne({'userid':userid},{fields:{'email':1,"_id":0}});
		
		var j = sendmail(usermail);
		
	}


		

};
