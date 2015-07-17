var express = require('express');
var router = express.Router();
var assert = require ("assert");
var usersettings = require ('../usersettingModule');
var settings = new usersettings();
//test changepass
describe ("Module",function(){
	describe('#changepass()',function(){

		it('should update password as newpass',function(done){

				var userobj = {userid:'LoginName_4',
							   newpass:"911",
							   oldpass:"111",
							   confirmpass:"911"};
				settings.changepass(userobj,function(err,doc){
					assert.equal(doc.password,userobj.newpass);
					done();
				})

		})

		it('should not change the oldpass word',function(done){
			var userobj = {	   userid: '1',
							   newpass:"12345",
							   oldpass:"12345678",
							   confirmpass:"12345"
						   };
			settings.changepass(userobj,function(err,doc){
					assert.notEqual(doc.password,userobj.newpass);
					done();
				})
		})


		it('should not change the oldpass word',function(done){
			var userobj = {    userid:'LoginName_4',
							   newpass:"12345",
							   oldpass:"111",
							   confirmpass:"12345678"};
			settings.changepass(userobj,function(err,doc){
					assert.notEqual(doc.password,userobj.newpass);
					done();
				})
		})


		it('should not change the oldpass word',function(done){
			var userobj = {		userid:'',
							   	newpass:"",
							   	oldpass:"",
							   	confirmpass:""
						  };
			settings.changepass(userobj,function(err,doc){
					assert.notEqual(doc.password,userobj.newpass);
					done();
				})
		})

	})
})
// test receiveemail;

describe ("Module",function(){
	describe('#receiveemail()',function(){
			it ('should return user email as expected',function(done){
				var userobj = {userid: "LoginName_4",email:'sd2411@nyu.edu'};
				settings.receiveemail(userobj,function(err,doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.equal(doc.email,userobj.email);
					done();
				})

			})
			it ('should not return user email as expected',function(done){
				var userobj = {userid: "LoginName_7",email:''};
				settings.receiveemail(userobj,function(err,doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.equal(doc.email,userobj.email);
					done();
				})

			})

			it ('should not return user email as expected',function(done){
				var userobj = {userid: "LoginName_5",email:'sd2411@nyu.edu'};
				settings.receiveemail(userobj,function(err,doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.eual(doc.email,userobj.email);
					done();
				})

			})
	})
})

// test 
describe ('Module',function(){
	describe('#switchinformation()',function(){
		it ('should insert into users collection',function(done){
			var userobj = {userid:"LoginName_4",frequency:"1",onoffswitch:"1"};
			settings.switchinformation(userobj,function(err,doc){
				
				assert.equal(doc,1);
				done();
			})
		})
		it ('should not insert into user collection',function(done){
		 	var userobj = {userid: " ",frequency:'1',onoffswitch:"0"};
		 	settings.switchinformation(userobj,function(err,doc){
		 		
		 		
		 		assert.notEqual(doc,1);
		 		done();
		 	});
		 })

		it ('should insert into users collection',function(done){
			var userobj = {userid:"LoginName_4",frequency:"0",onoffswitch:"0"};
			settings.switchinformation(userobj,function(err,doc){
				assert.equal(doc,1);
				done();
			})
		})


		it ('should insert into users collection',function(done){
			var userobj = {userid:"LoginName_4",frequency:" ",onoffswitch:" "};
			settings.switchinformation(userobj,function(err,doc){
				assert.equal(doc,1);
				done();
			})
		})
	})
})


















