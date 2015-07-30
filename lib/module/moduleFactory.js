var path = require('path');
var logger = require('../../logger');

var Factory = (function(){

    var instancePool = {};

    return function(settings) {

        function createModule(name, moduleSettings) {
            if(instancePool[name]) {
                logger.info("use pool");
                return instancePool[name];
            }
            var module = require('../module/' + name);
            var m = new module(moduleSettings);
            if(!m) {
                var mPath = path.join(__dirname, "../module/"+name);
                throw new Error('undefined module in path:' + mPath);
            }
            instancePool[name] = m;
            logger.info("factory instancePool = %j", instancePool, {});
            return m;
        }

        var self = this;

        function applySettings(factory, factorySettings) {

        }

        return {
            get: function(name, settings) {
                return createModule(name, settings);
            },
            applySettings: function(settings) {
               applySettings(self, settings); 
            }
        };
    }

})();

module.exports = Factory;
