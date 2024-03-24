var get;

import {
  Proxy,
  console,
  Object
} from "./window.js";

export {
  console
};

if (typeof WorkerGlobalScope !== "undefined" && WorkerGlobalScope !== null) {
  get = function() {
    var from, name, prop, proxy, target;
    [target, prop, proxy] = arguments;
    name = target.constructor.name;
    from = self[name];
    console.log("worker", name, prop);
    if (!from) {
      return void 0;
    }
    switch (typeof from[prop]) {
      case "function":
        return function() {
          return console.log("called on worker:", prop);
        };
      case "undefined":
        return console.log("worker undefined", prop);
    }
  };
} else {
  get = function(target, prop, proxy) {
    var from, name;
    name = target.constructor.name;
    from = self[name];
    console.log("window", name, prop);
    switch (typeof from[prop]) {
      case "function":
        return function() {
          return console.log("called on window:", prop);
        };
      case "undefined":
        return console.log("window undefined cll", prop);
    }
  };
}

export var document = new Proxy(new (document = class document {}), {get});
