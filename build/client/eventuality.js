(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.eventuality = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var deepAssign, isObject;

  isObject = require('is-plain-obj');

  module.exports = deepAssign = function(target, source) {
    if (source == null) {
      return target;
    } else {
      Object.keys(source).forEach(function(key) {
        var value;
        value = source[key];
        if (isObject(value)) {
          target[key] = {};
          return deepAssign(target[key], value);
        } else {
          return target[key] = value;
        }
      });
      return target;
    }
  };

}).call(this);

},{"is-plain-obj":9}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(arg) {
    var idGenerator, methods, name, ref, state;
    ref = arg != null ? arg : {
      name: 'Aggregate'
    }, name = ref.name, idGenerator = ref.idGenerator, state = ref.state, methods = ref.methods;
    return function(attrs) {
      var aggregate, fn, instanceId, instanceState, ref1;
      instanceId = null;
      if ((idGenerator != null) === false) {
        if (!!attrs.id === false) {
          throw new Error("An id must be provided when creating an instance of " + name);
        } else {
          instanceId = attrs.id;
          delete attrs.id;
        }
      } else {
        instanceId = (ref1 = attrs.id) != null ? ref1 : idGenerator();
      }
      instanceState = Object.assign({}, state, attrs);
      aggregate = Object.defineProperty({}, 'state', {
        value: instanceState
      });
      for (name in methods) {
        fn = methods[name];
        Object.defineProperty(aggregate, name, {
          value: fn
        });
      }
      return Object.defineProperty(aggregate, 'id', {
        value: instanceId
      });
    };
  };

}).call(this);

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var deepAssign;

  deepAssign = require('./deepAssign');

  module.exports = function(arg) {
    var aggregateId, event, name, payload, state;
    aggregateId = arg.aggregateId, name = arg.name, payload = arg.payload, state = arg.state;
    event = {
      name: name,
      aggregateId: aggregateId,
      payload: Object.freeze(deepAssign({}, payload)),
      state: Object.freeze(deepAssign({}, state))
    };
    return Object.freeze(event);
  };

}).call(this);

},{"./deepAssign":1}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var doAtSomePoint;

  doAtSomePoint = function(cb) {
    return setTimeout(cb, 0);
  };

  module.exports = function() {
    var listeners, properties, registerListener, registerListeners;
    listeners = {};
    registerListener = function(eventName, listener) {
      var listenersForEvent;
      listenersForEvent = listeners[eventName];
      if (listenersForEvent === void 0) {
        return listeners[eventName] = [listener];
      } else {
        return listenersForEvent.push(listener);
      }
    };
    registerListeners = function(mapping) {
      var eventName, ls, results;
      results = [];
      for (eventName in mapping) {
        ls = mapping[eventName];
        results.push(ls.forEach(function(listener) {
          return registerListener(eventName, listener);
        }));
      }
      return results;
    };
    properties = {
      registerListeners: {
        value: registerListeners
      },
      registerListener: {
        value: registerListener
      },
      publish: {
        value: function(event) {
          var ref;
          return (ref = listeners[event.name]) != null ? ref.forEach(function(listener) {
            return doAtSomePoint(function() {
              return listener(event);
            });
          }) : void 0;
        }
      }
    };
    return Object.defineProperties({}, properties);
  };

}).call(this);

},{}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(overrides) {
    var add, events, getEvents, properties;
    if (overrides == null) {
      overrides = {};
    }
    events = [];
    add = function(event) {
      return events.push(event);
    };
    getEvents = function() {
      return events.slice();
    };
    properties = {
      add: {
        value: overrides.add || add
      },
      getEvents: {
        value: overrides.getEvents || getEvents
      }
    };
    return Object.defineProperties({}, properties);
  };

}).call(this);

},{}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(arg) {
    var commandHandlers, dispatch, eventBus, eventStore, properties, sendEvents;
    eventStore = arg.eventStore, eventBus = arg.eventBus, commandHandlers = arg.commandHandlers;
    sendEvents = function(events) {
      eventStore.add(events);
      return eventBus != null ? typeof eventBus.publish === "function" ? eventBus.publish(events) : void 0 : void 0;
    };
    dispatch = function(command) {
      var name;
      return Promise.resolve(typeof commandHandlers[name = command.name] === "function" ? commandHandlers[name](command.message) : void 0).then(sendEvents)["catch"](function(error) {
        return console.error(error);
      });
    };
    properties = {
      dispatch: {
        value: dispatch
      }
    };
    return Object.defineProperties({}, properties);
  };

}).call(this);

},{}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Event, EventBus, EventStore, Flow, Repository, defineAggregate;

  EventStore = require('./eventStore');

  EventBus = require('./eventBus');

  Repository = require('./repository');

  Flow = require('./flow');

  Event = require('./event');

  defineAggregate = require('./defineAggregate');

  module.exports = {
    Event: Event,
    EventBus: EventBus,
    EventStore: EventStore,
    Repository: Repository,
    Flow: Flow,
    defineAggregate: defineAggregate
  };

}).call(this);

},{"./defineAggregate":2,"./event":3,"./eventBus":4,"./eventStore":5,"./flow":6,"./repository":8}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Event;

  Event = require('./event');

  module.exports = function(aggregateName, Aggregate, eventStore) {
    var _load, add, cache, load, properties, remove;
    aggregateName = aggregateName.trim();
    cache = {};
    _load = function(aggregateId, events) {
      var loaded;
      loaded = null;
      events.reverse().some(function(event) {
        var agg;
        if (event.aggregateId === aggregateId) {
          if (event.name === (aggregateName + "DeletedEvent")) {
            loaded = null;
          } else {
            agg = Aggregate(Object.assign({
              id: aggregateId
            }, event.state));
            cache[aggregateId] = agg;
            loaded = agg;
          }
          return true;
        }
      });
      return loaded;
    };
    add = function(attrs) {
      var agg, state;
      agg = Aggregate(Object.assign({}, attrs));
      cache[agg.id] = agg;
      state = Object.assign({}, agg.state);
      return Event({
        name: aggregateName + "CreatedEvent",
        aggregateId: agg.id,
        state: state,
        payload: attrs
      });
    };
    load = function(aggregateId) {
      if (cache[aggregateId]) {
        return Promise.resolve(cache[aggregateId]);
      } else {
        return Promise.resolve(eventStore.getEvents()).then(function(events) {
          return _load(aggregateId, events);
        });
      }
    };
    remove = function(aggregateId) {
      return load(aggregateId).then(function(arg) {
        var event, state;
        state = arg.state;
        if ((state != null) === false) {
          Promise.reject("Could not load aggregate with id of " + aggregateId);
        }
        event = Event({
          name: aggregateName + "DeletedEvent",
          aggregateId: aggregateId,
          state: state
        });
        delete cache[aggregateId];
        return event;
      });
    };
    properties = {
      add: {
        value: add
      },
      load: {
        value: load
      },
      "delete": {
        value: remove
      }
    };
    return Object.defineProperties({}, properties);
  };

}).call(this);

},{"./event":3}],9:[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}]},{},[7])(7)
});