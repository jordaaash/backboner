'use strict';

var Backboner = require('./backboner'),
    METHODS, Sync;

METHODS = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
};

Sync = function (method, model, options) {
    var url  = options.url,
        data = options.data,
        promise;
    if (options.method != null) {
        method = options.method;
    }
    if (url == null) {
        if (typeof model.url === 'function') {
            url = model.url();
        }
        else {
            url = model.url;
        }
    }
    if (data == null) {
        if (method === 'create' || method === 'update') {
            data = model.toJSON();
        }
        else {
            data = {};
        }
    }
    method         = METHODS[method];
    options.method = method;
    options.data   = data;
    promise        = Backboner.Ajax(url, options);
    model.trigger('request', model, promise.request, options);
    return promise;
};

module.exports = Sync;
