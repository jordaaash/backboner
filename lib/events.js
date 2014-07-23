'use strict';

var EventEmitter2 = require('eventemitter2').EventEmitter2,
    Events        = EventEmitter2.prototype;

module.exports = Events;

Events.trigger = Events.emit;

Events.on = function (type, listener, thisArg) {
    if (thisArg !== void 0) {
        listener = listener.bind(thisArg);
    }
    return EventEmitter2.prototype.on.call(this, type, listener);
};
