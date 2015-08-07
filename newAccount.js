use punchsystem

var defaultSettings = db.comp_settings.findOne();
var compid = db.companies.count();
var current = new Date().getTime();

for(var i=compid+1; i<compid+2; i++) {
    var counter = i-compid;
    db.companies.insert({
        compid: i,
        name: '2015080613',
        registerDate : current
    });
    db.users.insert({
        name: 'test_2015080613',
        userid: 'test_2015080613',
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
