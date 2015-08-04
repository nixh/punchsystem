use punchsystem

var defaultSettings = db.comp_settings.findOne();
var compid = db.companies.count();
var current = new Date().getTime();
for(var i=compid+1; i<compid+10; i++) {
    var counter = i-compid;
    db.companies.insert({
        compid: i,
        name: 'APP_TEST_COMPANY_' + counter,
        registerDate : current
    });
    db.users.insert({
        name: 'APP_TEST_NAME_' + counter, 
        userid: 'apptest' + counter,
        password: '0000',
        avatar: '',
        createDate: current,
        compid: i,
        owner: true,
        curRate: 8.75,
        rates: [{changetime:current, rate:8.75}]
    });
    delete defaultSettings._id;
    defaultSettings.compid = i;
    db.comp_settings.insert(defaultSettings);
}
