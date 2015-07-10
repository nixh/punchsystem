<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var assert = require ("assert");
var usersettings = require ('../usersettingModule');
var settings = new usersettings();
//test changepass
describe ("Module",function(){
	describe('#changepass()',function(){

		it('should update password as newpass',function(done){

				var userobj = {userid:'LoginName_19',
							   newpass:"1",
							   oldpass:"123123123",
							   confirmpass:"1"};
				settings.changepass(userobj,function(err,doc){
					assert.notEqual(doc,1);
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
					assert.notEqual(doc,1);
					done();
				})
		})


		it('should not change the oldpass word',function(done){
			var userobj = {    userid:'LoginName_11 ',
							   newpass:"12345",
							   oldpass:"123123123",
							   confirmpass:"12345678"};
			settings.changepass(userobj,function(err,doc){
					assert.notEqual(doc,1);
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
					assert.notEqual(doc,1);
					done();
				})
		})

	})
})
// test receiveemail;

describe ("Module",function(){
	describe('#receiveemail()',function(){
			it ('should return user email as expected',function(done){
				var userobj = {userid: "LoginName_11",email:'useremail11@email.com'};
				settings.receiveemail(userobj,function(err,doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.equal(doc.email,userobj.email);
					done();
				})

			})
			it ('should not return user email as expected',function(done){
				var userobj = {userid: "1",email:'useremail11@email.com'};
				settings.receiveemail(userobj,function(err,doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.notEqual(doc.email,userobj.email);
					done();
				})

			})

			it ('should not return user email as expected',function(done){
				var userobj = {userid: " ",email:'useremail11@email.com'};
				settings.receiveemail(userobj,function(err,doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.notEqual(doc.email,userobj.email);
					done();
				})

			})
	})
})

describe ("Module",function(){
	describe('#sendemail()',function(){
		it('should be sent to correct user',function(done){
			var userobj = {userid: "LoginName_4",email:'useremail4@email.com'};
			settings.sendemail(userobj,function(doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.equal(doc.email,userobj.email);
					done();
			}); 
		})

		it('should not be sent',function(done){
			var userobj = {userid: "1",email:'useremail4@email.com'};
			settings.sendemail(userobj,function(doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.notEqual(doc.email,userobj.email);
					done();
			}); 
		})

		it('should not be sent',function(done){
			var userobj = {userid: " ",email:'useremail4@email.com'};
			settings.sendemail(userobj,function(doc){
					if(!doc|| doc.length === 0)
						doc= {email: " "};
					assert.notEqual(doc.email,userobj.email);
					done();
			}); 
		})
	})
})



















=======
var assert = require('assert');
var usermodule = require('../usermodule');

var um = new usermodule();

describe('usermodule', function(){
    describe('#addUser()', function(){
        it('shoud insert a user into the database', function(done){
            var userObj = {
                userid: 'romanchelsea',
                password: 'satosumire'
            };

            um.addUser(userObj, )
        })
    })
})
>>>>>>> dev
