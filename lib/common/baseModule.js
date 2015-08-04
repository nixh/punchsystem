var _ = require('underscore');
var events = require('events');
var util = require('util');

function BaseModule(settings) {
    if (settings)
        _.extend(this, settings);
    events.EventEmitter.call(this);
}
util.inherits(BaseModule, events.EventEmitter);
