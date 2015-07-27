var winston = require('winston');
winston.emitErrs = false;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            handleExceptions: false,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
logger.stream = {
    write: function(message, encoding) {
        console.log(encoding);
    }
};
