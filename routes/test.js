var monk=require('monk');
var assert = require ("assert");
var usersettings = require ('./usersetting');

describe ("usersetting",function(){
	describe('#changepass()',function(){

		it('should update password as newpass',function(done){
				var userobj = {userid:'LoginName_3',newpass:"12345",oldpass:"123123123"};
				var db = monk('mongo://127.0.0.1:27017/punchsystem');
				usersetting.changepass(userobj,db,function(err,doc){
					assert.equal(doc.password,userobj.newpass);
				})

				})
				
		})
	})