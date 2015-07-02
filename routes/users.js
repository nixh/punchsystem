var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/view', function(req, res, next){

    res.render('users/user', {username: 'Q'});
})

router.get('/view/:id', function(req, res, next){
    
    var id = req.params.id;
    id = "#" + id;

    res.render('users/user', {username: 'Q', ID:id});
})
module.exports = router;
