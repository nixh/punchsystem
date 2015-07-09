var monk=require('monk');
var assert = require ("assert");
var usersettings = require ('../usersetting');

describe ("usersetting",function(){
	describe('#changepass()',function(){

		it('should update password as newpass',function(){
				var userobj = {userid:'LoginName_4',newpass:"12345",oldpass:"12345678"};
				
				usersettings.changepass(userobj,function(err,doc){
					assert.equal(doc.password,userobj.newpass);
					
				})

				})
				
		})
	})