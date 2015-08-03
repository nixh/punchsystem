var logger = require('./logger');
logger.info('hello %s', "Q");

var teststr = "My name is ${name}, i am ${age} year's old. I like ${hobies.join(', ')}.";
var testdata = {
    name: 'Q',
    age : 29,
    hobies : ['games', 'programming', 'sports']
}

function template(tmpl, data) {
    var regex = /\$\{(.*?)\}/gm;
    return tmpl.replace(regex, function(match, name){
        var index = name.indexOf('.');
        var ret;
        if(index == -1) {
            ret = data[name];
        } else {
            ret = eval("data."+name);
        }
        return ret ? ret : "";
    });
}
var compiled = template(teststr, testdata);
console.log(compiled);
