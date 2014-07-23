'use strict';

var Backboner = { VERSION: '0.1.0' };

module.exports = Backboner;

var _          = require('lodash'),
    Events     = require('./events'),
    Model      = require('./model'),
    Collection = require('./collection'),
    Ajax       = require('./ajax'),
    Sync       = require('./sync');

_.extend(Backboner, Events);

Backboner.Events     = Events;
Backboner.Model      = Model;
Backboner.Collection = Collection;
Backboner.Ajax       = Ajax;
Backboner.Sync       = Sync;
