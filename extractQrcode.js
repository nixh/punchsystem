var dbm = require('./lib/common/db');
function show(ret) {
    console.log(ret);
}
function filterCompid(users) {
    var comps = [];
    users.forEach(function(u){
        if(comps.indexOf(u.compid) == -1)
            comps.push(u.compid);
    });
    return comps;
}

function qrcode(comps) {
    return dbm.query('qrcodes', { compid: {$in : comps}, type:'static' }).call(this);
}

function toPrintHtml(data) {
    var htmlTpl = '<html><body>For user: ${users}<hr><img width=200 height=200 src="${src}"/></body></html>'
    var htmls = [];
    data.qrcodes.forEach(function(qr, i){
        var html = htmlTpl.replace(/\$\{(.+?)\}/gm, function(match, name){
            console.log(name);
            if(name === 'compid') return qr.compid;
            if(name === 'src') return qr.qrdata;
            if(name === 'users') return data.userlist[i].map(function(u){ return u.userid}).join(',');
        });
        htmls.push(html);
    });
    return htmls;
}

var fs = require('fs');

function toFiles(htmls) {
    
    htmls.forEach(function(html, i){
        fs.writeFileSync('./qrcodehtmls/html_'+i+".html", html);
    });
   
    return htmls;
}

function qruserList(qrcodes) {
    var userList = qrcodes.map(function(qrcode){
        return function() {
            return dbm.query('users', {compid: qrcode.compid}).call(this);
        };
    });
    return dbm.parallel(userList).then(function(lists){
        return { qrcodes: qrcodes, userlist: lists }
    });
}

dbm.use(dbm.query('users', {userid: {$regex: /test_/} }),
        filterCompid, qrcode, qruserList, toPrintHtml, toFiles).then(show);
