var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');
var utils = require('../utils');


router.get('/', function(req, res, next) {
    var test = db.get('test');
    var results = test.find({}, {});
    res.render('index', { title: 'Express', ret: results });
});


router.get('/test', function(req, res, next){

	res.render('test/prac', { name:"Yong D Liu"});
});


router.get('/login', function(req, res, next){

	res.render('login');
});

router.get('/staff_main', function(req, res, next){

        var sessionid = req.cookies.sessionid;
    	var userCol = db.get('users');
    	var dlgCol = db.get('delegation');
        var sessionCol = db.get('session');
        sessionCol.findOne({sessionid:sessionid}, {}, function(err, sObj){

            userCol.findOne({userid:sObj.userid}, {}, function(err, userDoc){
                var ret = { msg: null, ok: true };
                if(!userDoc) {
                    ret.ok = false;
                    ret.msg = "cant find this user";
                    return utils.render('staff/staff_main', ret)(req, res, next);
                }
                delete userDoc.password;
                ret.user = userDoc;
                dlgCol.findOne({userid: sObj.userid}, {}, function(err, dlgDoc){
                    if(dlgDoc)
                        ret.delegate = true;
                    else
                        ret.delegate = false;

                    utils.render('staff/staff_main', ret)(req, res, next);

                });

            });

        });
});

/*
router.post('/usersettings', function(req, res, next){

	var doc = req.body;
	var emails = doc.receiveEmails.split(', ');
	db.get('usersettings').insert({emails:emails}, function(err, doc){

	});
});
<<<<<<< HEAD
*/
/*router.get('/settings', function(req, res, next){
=======

router.get('/settings', function(req, res, next){
>>>>>>> yongred

	var emailReport = db.get("records");
	emailReport.findOne({reportid:1}, {}, function(err, doc){
		var ret= {msg: null, ok: true};
		if(!doc){
			ret.ok = false;
			ret.msg= "no data found!";
			return res.render('staff/staff_setting_su', ret);
		}
		ret.report= doc;
		res.render('staff/staff_setting_su', ret);
	});

	//res.render('staff/staff_setting', {emailReportData:['one', 'two', 'three']});
<<<<<<< HEAD
});*/


// var qrModule = require('../qrcodeModule');
// router.get('/staff_delegate', function(req, res, next){
//     var qrm = new qrModule();
//     qrm.getDynacode(req.cookies.sessionid, function(err, mixinData) {
//         qrm.db.close();
//         utils.render('qr', {
//             data: mixinData
//         })(req, res, next);
//     });
// });

router.get('/staff_punch_report', function(req, res, next){

	res.render('staff/staff_punch_report', {
		/*
		var records = db.get("records");
		records.findOne({reportid:1}, {}, function(err, doc){
				var ret= {msg: null, ok: true};
				if(!doc){
					ret.ok = false;
					ret.msg= "no data found!";
					return res.render('staff/staff_punch_report', ret);
				}
				ret.record= doc;
				res.render('staff/staff_punch_report', ret);
		});
		*/

		clockData: [
			{
				timeIn: 1436391432009,
				timeOut: 1436391513763
			},
			{
				timeIn: 1436391545759,
				timeOut: 1436391554475
			},
			{
				timeIn: 1436391561077,
				timeOut: 1436391567173
			},
			{
				timeIn: 1436391581457,
				timeOut: 1436391586079
			},
			{
				timeIn: 1436391589210,
				timeOut: 1436391593407
			}
		]

	});
});

router.get('/supervisor/supervisor_main', function(req, res, next){

    var sessionid = req.cookies.sessionid;
	var userCol = db.get('users');

    var sessionCol = db.get('session');
    sessionCol.findOne({sessionid:sessionid}, {}, function(err, sObj){

        userCol.findOne({userid:sObj.userid}, {}, function(err, userDoc){
            var ret = { msg: null, ok: true };
            if(err||!userDoc) {
            	return next(err || new Error('invalid user!'));
            }
            delete userDoc.password;
            ret.user = userDoc;
			utils.render('supervisor/supervisor_main', ret)(req, res, next);
        });

    });
});

// router.get('/supervisor_delegate', function(req, res, next){
// 	var users = db.get("users");
// 	users.find({compid:13}, function(e, docs){
// 		var ret= {msg: null, ok: true};
// 		if(!docs){
// 			ret.ok = false;
// 			ret.msg= "no data found!";
// 			return res.render('supervisor/supervisor_delegate', ret);
// 		}
// 		ret.userInfos= docs;
// 		res.render('supervisor/supervisor_delegate', ret);
// 	});
//
// });

module.exports = router;
