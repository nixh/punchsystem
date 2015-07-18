var schedule =require('node-schedule');
var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var email= require('./email');
var express = require('express');
var moment = require('moment');
var router = express.Router();
var db;

function sendemail(userobj){
		var conf = this.conf;
		var db = this.db;
		var info =this.mailinfo;
		var collection = db.get('users');
		console.log(userobj)
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,function(err,doc){
			if(err){
				console.log('error');
			}
			else if(!doc || doc.length === 0){
				var to = " ";
				console.log('wrong')
			}
			else{
				console.log(doc)
				var to = doc.email;
				email(conf).sendEmail(to, info.cc, info.subject, info.html, info.csvStringForAttachments);
				
			}
		})
}

function sendreport(userobj,date,freqz){
	var day = moment(date).format('DD');
	console.log(day)
	var hour = moment(date).format("HH");
	console.log(hour)
	var min = moment(date).format('mm');
	console.log(min)
	var sec = moment(date).format("ss");
	console.log(sec)
	var d = new Date(date);
	var now = moment().valueOf();
	console.log(now)
	var date=moment(date).valueOf();
	console.log(date)
	if(freqz =="weekly"){
		//var rule ={second:sec, minute:min,hour:hour,dayOfWeek:7};
		schedule.scheduleJob(('0 0 0 0 0 7'),function(){
			sendemail(userobj);
			console.log('send weekly')
		})
	}
	else{
		//var rule = {second:sec,hour:hour,minute:min,dayOfMonth:day};
		schedule.scheduleJob('0 0 0 0 [1,2,3,4,5,6,7,8,9,10,11,12] 0',function(){
			sendemail(userobj);
		})			
	}
}

function Module(settings) {
	_.extend(this, settings);
	if(!this.db) {
		this.db = monk(utils.getConfig('mongodbPath'));
	}
	if(!this.conf){
		this.conf = utils.getConfig('email.server');
	}
	if(!this.mailinfo){
		this.mailinfo ={
			cc: " ",
			csvStringForAttachments: ["name, punchintime, punchouttime\nQ,2015-10-10 08:00:00, 2015-10-10 19:00:00"],
			subject: "changepwd",
			html: "<p> Your password has been changed",
		}
	}
}

Module.prototype = {
		sendreport: sendreport
	}


module.exports = Module