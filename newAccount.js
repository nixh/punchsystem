use punchsystem

var defaultSettings = db.comp_settings.findOne();
var compid = db.companies.count();
var current = new Date().getTime();

for(var i=compid+1; i<compid+4; i++) {
    var counter = i-compid;
    db.companies.insert({
        compid: i,
        name: 'TC_'+counter,
        registerDate : current
    });
    db.users.insert({
        name: 'android_'+counter,
        userid: 'android_'+counter,
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
