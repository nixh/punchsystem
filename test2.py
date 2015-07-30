class C:
    def foo(cls, y):
        print "classmethod", cls, y

    foo = classmethod(foo);


// var Q = require('q');
// var um = require('./usermodule');
// var user = new um();
//
// var p = user.addUser({'name':'comebackisreal', 'userid': "Fuck you bitch"});
//
// p.then(function(value){
//     console.log(value);
// });
//
//
// function changeUser(userObj, callback) {
//     validate(userObj);
//
//     var _id = userObj._id;
//
//     userObj.address = trim(userObj.address_street) + "|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);
//
//     var col = this.db.get('users');
//
//     var append = {};
//
//     if(userObj.curRate > 0 ){
//         append.rate = parseInt(userObj.curRate);
//         append.changetime = (userObj.rate_change_date ? new Date().getTime() : userObj.rate_change_date);
//
//         delete userObj.rate_change_date;
//     }
//
//     if(!userObj.avatar){
//         delete userObj.avatar;
//     }
//
//     if(!userObj.avatar_url){
//         delete userObj.avatar_url;
//     }
//
//     delete userObj._id;
//
//     col.findAndModify(
//         {
//             query: {'_id': _id},
//
//             update: {
//                     '$set': userObj,
//
//                     '$push': {
//                         'rates': append
//                     }
//             }
//         },
//         callback
//     );
// }
