'use strict';

var _     = require('lodash'),
    slice = Array.prototype.slice,
    Model;

Model = function (attributes, options) {
    if (attributes == null) {
        attributes = {};
    }
    if (options == null) {
        options = {};
    }
    else {
        if (options.collection != null) {
            this.collection = options.collection;
        }
        if (options.parse === true) {
            attributes = this.parse(attributes, options) || {};
        }
    }
    this.cid = _.uniqueId('c');
    this.attributes = {};
    attributes = _.defaults({}, attributes, _.result(this, 'defaults'));
    this.set(attributes, options);
    this.changed = {};
    this.initialize.apply(this, slice.call(arguments));
};

module.exports = Model;

var Backboner  = require('./backboner'),
    Collection = require('./collection'),
    Events     = require('./events');

_.extend(Model.prototype, Events);

_.each(
    ['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'chain'],
    function (method) {
        var _method = _[method];
        Model.prototype[method] = function () {
            var args = slice.call(arguments);
            args.unshift(this.attributes);
            return _method.apply(_, args);
        };
    }
);

Model.prototype.changed = null;

Model.prototype.validationError = null;

Model.prototype.idAttribute = null;

Model.prototype.initialize = function () {
};

Model.prototype.toJSON = function (options) {
    return _.clone(this.attributes);
};

Model.prototype.sync      =
Collection.prototype.sync = function (method, options) {
    return Backboner.Sync(method, this, options).bind(this)
        .then(function (response) {
            this.trigger('response', this, response, options);
            return response;
        })
        .catch(function (response) {
            this.trigger('error', this, response, options);
            throw response;
        });
};

Model.prototype.fetch      =
Collection.prototype.fetch = function (options) {
    options = _.defaults({}, options, { parse: true });
    return this.sync('read', options).then(function (response) {
        var attributes, setter;
        if (options.parse === false) {
            attributes = response.body;
        }
        else {
            attributes = this.parse(response.body, options);
        }
        if (options.reset === true) {
            setter = 'reset';
        }
        else {
            setter = 'set';
        }
        if (this[setter](attributes, options) != null) {
            this.trigger('sync', this, response, options);
            return response;
        }
        else {
            throw response;
        }
    });
};

Model.prototype.get = function (attribute) {
    return this.attributes[attribute];
};

Model.prototype.escape = function (attribute) {
    return _.escape(this.get(attribute));
};

Model.prototype.has = function (attribute) {
    return this.get(attribute) != null;
};

Model.prototype.unset = function (attribute, options) {
    options = _.extend({}, options, { unset: true });
    return this.set(attribute, void 0, options);
};

Model.prototype.clear = function (options) {
    var attributes = {},
        attribute;
    for (attribute in this.attributes) {
        attributes[attribute] = void 0;
    }
    options = _.extend({}, options, { unset: true });
    return this.set(attributes, options);
};

Model.prototype.hasChanged = function (attribute) {
    if (attribute == null) {
        return !_.isEmpty(this.changed);
    }
    return _.has(this.changed, attribute);
};

Model.prototype.changedAttributes = function (diff) {
    var changed = null,
        old, attribute, value;
    if (diff == null) {
        return this.hasChanged() ? _.clone(this.changed) : false;
    }
    old = this._changing ? this._previousAttributes : this.attributes;
    for (attribute in diff) {
        value = diff[attribute];
        if (_.isEqual(old[attribute], value)) {
            continue;
        }
        if (changed == null) {
            changed = {};
        }
        changed[attribute] = value;
    }
    return changed;
};

Model.prototype.previous = function (attribute) {
    if (attribute == null || this._previousAttributes == null) {
        return null;
    }
    return this._previousAttributes[attribute];
};

Model.prototype.previousAttributes = function () {
    return _.clone(this._previousAttributes);
};

Model.prototype.url = function () {
    var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
    if (base == null) {
        throw new Error('A "url" property or function must be specified');
    }
    if (this.isNew()) {
        return base;
    }
    return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
};

Model.prototype.format = function (attributes, options) {
    return attributes;
};

Model.prototype.parse = function (response, options) {
    return response;
};

Model.prototype.clone = function () {
    return new this.constructor(this.attributes);
};

Model.prototype.isNew = function () {
    return !this.has(this.idAttribute);
};

Model.prototype.isValid = function (options) {
    options = _.extend({}, options, { validate: true });
    return this._validate({}, options);
};

Model.prototype._validate = function (attributes, options) {
    if (!options.validate || !this.validate) {
        return true;
    }
    attributes = _.extend({}, this.attributes, attributes);
    var error = this.validationError = this.validate(attributes, options) || null;
    if (!error) {
        return true;
    }
    this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
    return false;
};

Model.prototype.save = Promise.method(function (key, value, options) {
    var attributes = this.attributes,
        attrs, method, promise;

    if (key == null || typeof key === 'object') {
        attrs   = key;
        options = value;
    }
    else {
        attrs      = {};
        attrs[key] = value;
    }

    options = _.extend({ validate: true }, options);
    if (attrs && (options.wait !== true)) {
        if (this.set(attrs, options) != null) {
            return false;
        }
    }
    else if (!this._validate(attrs, options)) {
        return false;
    }

    if (attrs && (options.wait === true)) {
        this.attributes = _.extend({}, attributes, attrs);
    }

    if (options.parse === void 0) {
        options.parse = true;
    }

    if (options.method != null) {
        method = options.method;
    }
    else if (this.isNew()) {
        method = 'create';
    }
    else if (options.patch === true) {
        method        = 'patch';
        options.attrs = attrs;
    }
    else {
        method = 'update';
    }

    promise = this.sync(method, this, options).then(function (response) {
        var serverAttrs;
        this.attributes = attributes;
        serverAttrs = this.parse(response, options);
        if (options.wait === true) {
            serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (_.isObject(serverAttrs) && this.set(serverAttrs, options) == null) {
            throw response;
        }
        this.trigger('sync', this, response, options);
    });
    if (attrs && options.wait === true) {
        this.attributes = attributes;
    }
    return promise;
});


Model.prototype.destroy = function (options) {

    var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
    };

    options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
    };

    if (this.isNew()) {
        options.success();
        return false;
    }
    wrapError(this, options);

    var xhr = this.sync('delete', this, options);
    if (!options.wait) destroy();
    return xhr;
};

Model.prototype.set   =
Model.prototype.reset = function (key, value, options) {
    var attr, attrs, unset, changes, silent, changing, prev, current;
    if (key == null) return this;

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (typeof key === 'object') {
        attrs = key;
        options = value;
    }
    else {
        (attrs = {})[key] = value;
    }

    options || (options = {});

    // Run validation.
    if (!this._validate(attrs, options)) return false;

    // Extract attributes and options.
    unset = options.unset;
    silent = options.silent;
    changes = [];
    changing = this._changing;
    this._changing = true;

    if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
    }
    current = this.attributes, prev = this._previousAttributes;

    // Check for changes of `id`.
    if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

    // For each `set` attribute, update or delete the current value.
    for (attr in attrs) {
        value = attrs[attr];
        if (!_.isEqual(current[attr], value)) changes.push(attr);
        if (!_.isEqual(prev[attr], value)) {
            this.changed[attr] = value;
        }
        else {
            delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = value;
    }

    // Trigger all relevant attribute changes.
    if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, length = changes.length; i < length; i++) {
            this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
    }

    // You might be wondering why there's a `while` loop here. Changes can
    // be recursively nested within `"change"` events.
    if (changing) return this;
    if (!silent) {
        while (this._pending) {
            options = this._pending;
            this._pending = false;
            this.trigger('change', this, options);
        }
    }
    this._pending = false;
    this._changing = false;
    return this;
};