

var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');

/* GET home page. */


router.get('/', function(req, res) {
	res.render('index', {title: 'Hello World!'});
});
router.get('/company/post', function(req, res) {
	res.render('secret');
});
router.get('/company/delete', function(req, res) {
	res.render('delete');
});
router.get('/company/userlist', function(req, res) {
  	var db=req.db;
	var collection=db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist',{
			"userlist":docs
		});
    });
});

router.get('/', function(req, res, next) {
    var test = db.get('test');
    var results = test.find({}, {});
    res.render('index', { title: 'Express', ret: results });
});

router.get('/cookies', function(req, res, next){

    var cookies = req.cookies;
    var cookie_str = "";
    for(var key in cookies) {
        cookie_str += key + "=" + cookies[key] + ";<br/>";
    }
    res.cookie('name', 'Test Name_'+Math.random(), {maxAge: 90000, httpOnly: true});
    res.end(cookie_str);

});

router.get('/test/:name', function(req, res, next) {
    var col = db.get(req.params.name);
    col.find({}, {limit:20}, function(e, docs){
        res.json(docs);
    });

});

/*
router.get('/test', function(req, res, next){
	
	res.render('test/prac', { name:"Yong D Liu"});
});


router.get('/login', function(req, res, next){
	
	res.render('login');
});

router.get('/staff_main', function(req, res, next){
	
	res.render('staff/staff_main', {
		users: {
			company_userid : "company_userid",
			name : "name",
			createDate: "Date",
			password: "password", // Encrypted Text
			sex : true,
			email : 1231425
		}
	});
});

router.get('/staff_setting', function(req, res, next){
	
	res.render('staff/staff_setting', {emailReportData:['one', 'two', 'three']});
});

router.get('/staff_delegate', function(req, res, next){
	
	res.render('staff/staff_delegate', {
		
		dataURL : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAACcCAYAAACKuMJNAAAABmJLR0QA/wD/AP+gvaeTAAADnUlEQVR4nO3d0Y7DJhRF0abq//9y+lq5Ui0EbBN3rdeJmZnoCF1hLny+3+/3D4j8+fQfwP+LwJESOFICR0rgSAkcKYEjJXCkBI6UwJESOFICR0rgSAkcKYEjJXCkBI6UwJESOFJ/rR7w8/msHvI/rW7JuP79o+Pf/f/X8VZ/frXV368ZjpTAkRI4UstruKvdNVb9/Oh4o///7s/f2V0jmuFICRwpgSO1vYa7Gq0RZtfBrs/frWvd/b7d63Szdn+/s8xwpASOlMCRymu42mzNdTVa440+/3ZmOFICR0rgSL2uhlu932x2P9rudb1fY4YjJXCkBI5UXsOdVqPsrslGx5ut6U77fq/McKQEjpTAkdpew9V9lKPraKPrbKv3w83WXPX3O8sMR0rgSAkcqeU13NPrQKv3u43WXLvPAnn6+51lhiMlcKQEjtTj++Hq89RWv5uc7WHYvR/utB4LMxwpgSMlcKTyd6mz61h3P599l3q1ex1u9vevPi9vd01nhiMlcKQEjlR+xu/ofrO7nz9d06yuEWfHdz4c/IPAkRI4Uo/ftbV6T399N1U9fn2+nbu2+GkCR0rgSH2+mxdiTrvXoD6jd/W71Duz63bepfIqAkdK4Ehtr+H+9Qsna7Ld63Z3nx+1u0fh1961muFICRwpgSO1/V3q7rM+7j5/5/Seg1G79+fNMsOREjhSAkdq+/lwu9+FzvZIrLb7DN/TxhtlhiMlcKQEjtTx63Cz469edzrtvLVRs9/XLDMcKYEjJXCkjjsfbvb51T0As5+/qs/LO40ZjpTAkRI4Ust7Gk7brzaqvndhd41b32txxwxHSuBICRyp/K6t3X2e9R7+1e9i6/2D9bqdGY6UwJESOFKP35c626Ow+8zb2ed/vadiNTMcKYEjJXCk8vPhdjt9P9zoePWZyHoaeBWBIyVwpB6/a2vW6rM27sZf3VNwWk/EbmY4UgJHSuBI5Xfez9rdM/H083d29zxYh+NVBI6UwJE6vqehronuapp6/1v9blRfKq8icKQEjtTjPQ27zfZlnr5OtnqdzTocryJwpASO1OtquN3no+3evzZqd0+EdTh+msCREjhSeQ1X76EfXYer7+6q71l4+p4HMxwpgSMlcKTyexpWe/o+1qfvWbhz2tExZjhSAkdK4Ei97nw4zmaGIyVwpASOlMCREjhSAkdK4EgJHCmBIyVwpASOlMCREjhSAkdK4EgJHCmBIyVwpASO1N9n/h5hPIuV/QAAAABJRU5ErkJggg=="
	});
});

router.get('/supervisor_main', function(req, res, next){
	
	res.render('supervisor/supervisor_main', {
		users: {
			company_userid : "company_userid",
			name : "name",
			createDate: "Date",
			password: "password", // Encrypted Text
			sex : true,
			email : 1231425
		}
	});
});

router.get('/supervisor_delegate', function(req, res, next){
	
	res.render('supervisor/supervisor_delegate', {
		delegates:[
			{
				name: "abc1",
				id: 1,
				isDelegate: true
			},
			{
				name: "abc2",
				id: 2,
				isDelegate: false
			},
			{
				name: "abc3",
				id: 3,
				isDelegate: false
			},
			{
				name: "abc4",
				id: 4,
				isDelegate: true
			}
		]
	});

});
*/

router.get('/company/find', function(req, res) {
	res.render('secret');
})
router.get('/company/update', function(req, res) {
	res.render('secret');
})	
/*router.post('/company/post', function(req, res) {
		var db = req.db;
		var username= req.body.username;
		var userEmail =req.body.userEmail;
		var collection =db.get('usercollection');
		collection.insert({
			"username": username,
			"usermail": userEmail
		},function (err, doc){
			if (err){
				res.send("There was a problem adding the information to database")
			}
			else{
				res.location("post");
				res.redirect("post");
			}
		});
	});
*/

	/*router.post('/company/delete', function(req, res) {
		
		var db = req.db;
		var username= req.body.username;
		var userEmail =req.body.userEmail;
		var collection =db.get('usercollection');
		
		collection.remove({
			"username": username,"usermail":userEmail
			
		},function (err, doc){
			if (err){
				res.send("There was a problem deleting the information to database")
			}

			else{
				res.location("delete");
				res.redirect("delete");
			}
		});
	});*/

//获取信息
var postdata =function(){
	return function(req,res){
	var db=req.db;
	var collection=db.get("companies");
	var mydate= new Date();
	var id=parseInt(req.body.compid);
	var logo=req.body.compLogo;
	var name=req.body.username;
	var regdate=mydate.getTime();
	var expdate=mydate.setDate(mydate.getDate()+2);
	var iplist=req.ip;
	var remark=req.body.remark;

	collection.insert({"compid":id,"compLogo":logo,"name":name,"registerDate":regdate,
						"expireDate":expdate,"remark":remark});
	collection.update({"compid":id},{$push:{"iplist":iplist}},function(err,docs){
		if(err){
			res.send("error!");
		}else{
			res.location("post");
			res.redirect("post");
		}
	});
	}	
}

//删除信息
var deletedata = function(){
	return function(req,res){
		var db = req.db;
		var collection=db.get("companies");
		var id=req.body.compid;
		var logo=req.body.compLogo;
		var name=req.body.username;
		var regdate=req.body.regdate;
		var expdate=req.body.expdate;
		var iplist=req.body.ip;
		var remark=req.body.remark;
		collection.remove({"compid":id,"compLogo":logo,"name":name,"registerDate":regdate,
						"expireDate":expdate,"remark":remark,"iplist":iplist
			
		},function (err, doc){
			if (err){
				res.send("There was a problem deleting the information to database");
			}

			else{
				res.location("delete");
				res.redirect("delete");
			}
		});
	}
}

//查询信息
var finddata= function(){
	return function(req,res){
		var db=req.db;
		var collection=db.get("companies");
		var mydate= new Date();
		var id=parseInt(req.body.compid);
		var logo=req.body.compLogo;
		var name=req.body.username;
		var regdate=mydate.getTime();
		var expdate=mydate.setDate(mydate.getDate()+2);
		var iplist=req.ip;
		var remark=req.body.remark;
		collection.find({"compid":id,"compLogo":logo,"name":name,"registerDate":regdate,
						"expireDate":expdate,"remark":remark,"iplist":iplist},function(err,docs){
							if(err){
								res,send(error);
							}
							else{
								res.json(docs);
								res.end();
							}
						})
	
	}
};

var updatedata= function(){
	return function(req,res){
		var db=req.db;
		var collection=db.get("companies");
		var mydate= new Date();
		var id=parseInt(req.body.compid);
		var logo=req.body.compLogo;
		var name=req.body.username;
		var regdate=mydate.getTime();
		var expdate=mydate.setDate(mydate.getDate()+2);
		var iplist=req.ip;
		var remark=req.body.remark;
		collection.update(
			{"compid":id,"name":name,"compLogo":logo,"remark":remark},
			{"registerDate":regdate,"expireDate":expdate,"iplist":iplist},
			function(err,docs){
				if(err){
					res,send(error);
				}
				else{
					res.end();
				}
			}
		);
	}
}

router.post('/company/post',postdata());
router.post('/company/delete',deletedata());
router.post('/company/find',finddata());
router.post('/company/update',updatedata());

router.updatedata=updatedata;
router.finddata= finddata;
router.putdata= postdata;
router.deletedata= deletedata;
module.exports = router;
