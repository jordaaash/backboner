'use strict';

var Promise = require('bluebird'),
    Request = require('superagent').Request,
    Ajax;

Ajax = function (url, options) {
    var pending = Promise.pending(),
        promise = pending.promise,
        method  = options.method,
        request = new Request(method, url),
        headers = options.headers,
        data    = options.data,
        header;
    if (headers != null) {
        for (header in headers) {
            if (headers.hasOwnProperty(header)) {
                request.set(header, headers[header]);
            }
        }
    }
    if (data != null) {
        if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
            request.send(data);
        }
        else {
            request.query(data);
        }
    }
    promise.request = request;
    _.defer(function () {
        request.end(function (response) {
            if (response.ok) {
                pending.resolve(response);
            }
            else {
                pending.reject(response);
            }
        });
    });
    return pending.promise;
};

module.exports = Ajax;
