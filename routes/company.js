var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {title: 'Hello World!'});
});
router.get('/post', function(req, res) {
	res.render('secret');
});
router.get('/delete', function(req, res) {
	res.render('delete');
});
router.get('/userlist', function(req, res) {
  	var db=req.db;
	var collection=db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist',{
			"userlist":docs
		});
    });
});

router.get('/find', function(req, res) {
	res.render('find');
});
router.get('/update', function(req, res) {
	res.render('update');
});
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
			res.send("add new record!");
			res.location("post");
			res.redirect("post");
		}
	});
	}	
};

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
			
		},function (err,doc){
			if (err){
				res.send("There was a problem deleting the information to database");
			}

			else{
				res.send("delete data successful!");
				res.location("delete");
				res.redirect("delete");
			}
		});
	}
};

//查询信息
var finddata= function(){
	return function(req,res){
		var db=req.db;
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
					},function (err,docs){
							if(err){
								res.send(error);
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
		collection.update({"compid":id,"name":name,"compLogo":logo,"remark":remark},{$set{"registerDate":regdate,
						"expireDate":expdate,"iplist":iplist}},function (err,docs){
							if(err){
								res.send(error);
							}
							else{
								res.send("data update successful!");
							}
	});
	}
};
//
router.post('/post',postdata());
router.post('/delete',deletedata());
router.post('/find',finddata());
router.post('/update',updatedata());

router.updatedata=updatedata;
router.finddata= finddata;
router.putdata= postdata;
router.deletedata= deletedata;
module.exports = router;
