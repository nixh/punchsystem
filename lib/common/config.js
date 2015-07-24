function Config(configPath) {
    if(!configPath) {
        configPath = "../../config.json";
    }
    var config = require(configPath);
    return {
        get: function(key, delim){
            if(!key)
                return;
            if(!delim)
                delim = '->';
            var start = 0;
            var end = 0;
            var part = key;
            var result = config;
            while(end != -1) {
                end = key.indexOf(delim, start);
                if(end == -1) {
                    part = key.substring(start);
                } else {
                    part = key.substring(start, end);
                    start = end+delim.length;
                }
                if(result)
                    result = result[part];
            }
            return result;

        }
    }
}
module.exports = Config;
