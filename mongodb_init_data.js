use punchsystem
db.dropDatabase();

use punchsystem

function getRandomNumber(max) {
    return Math.floor(Math.random()*max);
}
//initialize Company data
var companyNumber = 50;
for(var i=0; i<companyNumber; i++) {

    db.companies.insert({
        compid: i+1,
        compLogo: 'http://loacalhost/testlogo',
        name: 'CompName_' + (i+1),
        registerDate: new Date().getTime(),
        expireDate: new Date().getTime() + 3 * 30 * 24 * 3600 * 1000,
        remark: 'Company Remark',
        iplist: ['192.168.1.100', '192.168.1.111', '192.168.1.112']
    })
}


//initialize User data

var userNumber = 200;
for(var i=0; i<userNumber; i++) {
    var compid = getRandomNumber(companyNumber);
    db.users.insert({
        userid: 'LoginName_'+(i+1),
        name: 'UserName_' + (i+1),
        createDate: new Date().getTime(),
        password : '123123123',
        sex: !!getRandomNumber(2),
        email: 'useremail'+(i+1)+'@email.com',
        address : '',
        tel : '',
        compid : compid + 1,
        curRate: 8.75,
        owner : i == 0 ? true : false,
        remark : 'User Remark',
        avatar: 'avatar url'
    });

}

//initialize reports

function hourToMillis(hour) {
    return hour * 3600 * 1000;
}
var users_cursor = db.users.find();
var report_id_counter = 0;
var startDate = new Date(2015, 6, 9).getTime();
users_cursor.forEach(function(doc){
    var userid = doc.userid;
    var compid = doc.compid;
    var possibleStartHours = [8, 9, 10];
    var possibleEndHours = [17, 18, 19];
    var date = startDate;

    for(var i=0; i<20; i++) {
        report_id_counter += 1;
        var index = getRandomNumber(3)
        var inTime = date + hourToMillis(possibleStartHours[index]);
        index = getRandomNumber(3);
        var outTime = date + hourToMillis(possibleEndHours[index]);
        db.records.insert({
            reportid : report_id_counter,
            compid : compid,
            userid : userid,
            inDate : inTime,
            outDate : outTime,
            hourlyRate : 8.75,
            remark : 'test'
        });
    }
});

// initialize session

// Do nothing about session
//

// initialize companies setting

for(var i=0; i<companyNumber; i++) {
    db.comp_settings.insert({
        compid: i+1,
        wifi_verify: !!getRandomNumber(2),
        report_send: !!getRandomNumber(2),
        use_default_email: !!getRandomNumber(2),
        report_emails: ['company_' + (i+1) + '@xxx.com', 'user_'+(i+1)+'@g.com'],
        report_send_frequency: getRandomNumber(2),
        qrcode_update_frequency: getRandomNumber(10) * 1000
    });
}

// initialize delegation

for(var i=0; i<companyNumber; i++) {
    var hasDelegation = !!getRandomNumber(2);
    if(hasDelegation) {
        var user_array = db.users.find({compid: i+1}).toArray();
        var user;
        while(!user) {
            var index = getRandomNumber(user_array.length);
            user = user_array[index];
        }

        db.delegation.insert({
            compid: i+1,
            userid: user.userid,
            name : user.name
        })
    }
}

// Initail Sequence data
var report_seq = db.records.find().sort({reportid:-1}).limit(1).next().reportid;
db.sequence.insert({'id':'records', seq:report_seq});
