use punchsystem

var defaultSettings = db.comp_settings.findOne();
var compid = db.companies.count();
var current = new Date().getTime();
for(var i=compid+1; i<compid+21; i++) {
    var counter = i-compid;
    db.companies.insert({
        compid: i,
        name: 'Demo_' + counter,
        registerDate : current
    });
    db.users.insert({
        name: 'Demo_' + counter, 
        userid: 'demo' + counter,
        password: '0000',
        avatar: '',
        createDate: current,
        compid: i,
        owner: true
    });
    delete defaultSettings._id;
    defaultSettings.compid = i;
    db.comp_settings.insert(defaultSettings);
}
