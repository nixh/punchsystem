var schedule =require('node-schedule');
var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var email= require('./email');
var express = require('express');
var moment = require('moment');
var router = express.Router();
var email = require('./email');
var e = new email();



function sendreport(min,hour,day,weekday,timePeriod,to,cc, subject, html, csvStringForAttachments){
	var day = parseInt(day);
	var hour = parseInt(hour);
	var min = parseInt(min);
	var date=parseInt(weekday);
	if(timePeriod =="weekly"){
		schedule.scheduleJob({hour: hour, minute: min, dayOfWeek: date},function(){
			e.sendEmail(to,cc, subject, html, csvStringForAttachments);
		})
	}
	else{
		//var rule = {second:sec,hour:hour,minute:min,dayOfMonth:day};
		schedule.scheduleJob({hour: hour, minute: min, dayOfMonth: day},function(){
			e.sendEmail(to,cc, subject, html, csvStringForAttachments);
		})			
	}
}

function Module() {
	
}

Module.prototype = {
		sendreport: sendreport
	}


module.exports = Module

var s = new Module();
s.sendreport('05','17','31','5','weekly',
	'dsj77222@gmail.com',
	'','123','aaaa',
	["name, punchintime, punchouttime\nQ,2015-10-10 08:00:00, 2015-10-10 19:00:00"]);