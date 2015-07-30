var assert = require ("assert");
var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var wrap = utils.wrap;
var db = require('../common/db');
var config = require('../common/config');
var Q = require('q');
var factory = require('./moduleFactory')();
var s = factory.get('compModule');
db.setUrl('localhost/aps');


describe('Module',function() {
	describe('#addNewComp',function() {
		it('should add a new comp with different compid',function(done) {
			var compobj = {
				'reg_Date':'2017_123_12',
				'compid':'101',
				'comp_Name':'abc',
				'exp_Date':'2019_123_12'
			};
			s.addNewComp(compobj).then(function(doc){
				assert.equal(doc,compobj);
				done();
			})
		})

		it ('should not add a new doc in db',function(done) {
			var compobj =  {
				'reg_Date':'2017_123_12',
				'compid':'101',
				'comp_Name':'abc',
				'exp_Date':'2019_123_12'
			}
			s.addNewComp(compobj).then(function (doc) {
				s.searchAllComp(doc.compid).then(finction(doc){
					assert.equal(doc,compobj)
				})
			})
		})
	})
})

















