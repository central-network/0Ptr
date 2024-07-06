var log, logg, max, proxyHandlers, reflect;

Object.defineProperties(Function.prototype, {
  apply2: {
    value: Function.prototype.apply.bind(Function.prototype)
  },
  call2: {
    value: Function.prototype.call.bind(Function.prototype)
  }
});

Object.defineProperties(Function.prototype, {
  apply: {
    value: function() {
      console.debug({arguments});
      return this.apply2(...arguments);
    }
  },
  call: {
    value: function() {
      console.debug({arguments});
      return this.call2(...arguments);
    }
  }
});

max = 0;

logg = console.debug;

log = function() {
  if (max++ > 10) {
    throw max;
  }
  return logg(...arguments);
};

reflect = Reflect;

proxyHandlers = function() {
  return {
    apply: function() {
      log("app2ly:", ...arguments);
      return reflect.apply(...arguments);
    },
    construct: function() {
      log("construct:", ...arguments);
      return reflect.construct(...arguments);
    },
    defineProperty: function() {
      log("defineProperty:", ...arguments);
      return reflect.defineProperty(...arguments);
    },
    deleteProperty: function() {
      log("deleteProperty:", ...arguments);
      return reflect.deleteProperty(...arguments);
    },
    get: function() {
      log("get:", ...arguments);
      return reflect.get(...arguments);
    },
    getOwnPropertyDescriptor: function() {
      log("getOwnPropertyDescriptor:", ...arguments);
      return reflect.getOwnPropertyDescriptor(...arguments);
    },
    getPrototypeOf: function() {
      log("getPrototypeOf:", ...arguments);
      return reflect.getPrototypeOf(...arguments);
    },
    has: function() {
      log("has:", ...arguments);
      return reflect.has(...arguments);
    },
    isExtensible: function() {
      log("isExtensible:", ...arguments);
      return reflect.isExtensible(...arguments);
    },
    ownKeys: function() {
      log("ownKeys:", ...arguments);
      return reflect.ownKeys(...arguments);
    },
    preventExtensions: function() {
      log("preventExtensions:", ...arguments);
      return reflect.preventExtensions(...arguments);
    },
    set: function() {
      log("set:", ...arguments);
      return reflect.set(...arguments);
    },
    setPrototypeOf: function() {
      log("setPrototypeOf:", ...arguments);
      return reflect.setPrototypeOf(...arguments);
    }
  };
};

console.log(window.Array);

window.Function.constructor = new Proxy(Function.constructor, proxyHandlers());

window.Function.__proto__ = new Proxy(Function.__proto__, proxyHandlers());

window.Function = new Proxy(Function, proxyHandlers());

window.Object = new Proxy(Object, proxyHandlers());

window.Array = new Proxy(Array, proxyHandlers());

window.Array.__proto__ = new Proxy(Array, proxyHandlers());

window.String = new Proxy(String, proxyHandlers());

window.Number = new Proxy(Number, proxyHandlers());

window.Boolean = new Proxy(Boolean, proxyHandlers());
