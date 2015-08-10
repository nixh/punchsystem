use punchsystem

var defaultSettings = db.comp_settings.findOne();
var compid = db.companies.count();
var current = new Date().getTime();

for(var i=compid+1; i<compid+11; i++) {
    var counter = i-compid;
    db.companies.insert({
        compid: i,
        name: 'APP_TC_'+counter,
        registerDate : current
    });
    db.users.insert({
        name: 'apptest_'+counter,
        userid: 'apptest'+counter,
        password: '0000',
        avatar: '',
        createDate: current,
        compid: i,
        owner: true,
        curRate: 8.75
    });
    delete defaultSettings._id;
    defaultSettings.compid = i;
    db.comp_settings.insert(defaultSettings);
}
