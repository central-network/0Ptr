var BUFFER, EOL, IMPORT, OBJECT, UINT32, addUint32, bindAtomics, getUint32, handleScope, malloc, packDefinitions, packFunction, packScope, palloc, setUint32, window;

OBJECT = [, ];

IMPORT = [import.meta.url];

BUFFER = null;

UINT32 = null;

malloc = null;

palloc = null;

window = self;

export var PALLOC_INDEX = 0;

export var MALLOC_INDEX = 1;

EOL = '\n';

export var OFFSET_BYTELENGTH = 4 * 0;

export var OFFSET_BYTEOFFSET = 4 * 1;

export var OFFSET_PROTOCLASS = 4 * 2;

export var HEADER_BYTELENGTH = 4 * 9;

export var MEMORY_BYTEOFFSET = 4 * 1e5;

addUint32 = null;

setUint32 = null;

getUint32 = null;

export var Pointer = class Pointer extends Number {
  //! only root could have constructor
  //! do NOT define constructor in child  
  //! classes which you will extend 0PTR  
  constructor() {
    var byte;
    //?  reconstruction
    if (arguments.length) {
      super(arguments[0]).loadPrototype();
    } else {
      //?  allocation - init
      super(palloc(HEADER_BYTELENGTH)).setProtoClass(this.constructor.protoClass);
      if (byte = this.constructor.byteLength) {
        this.setByteOffset(malloc(byte));
        this.setByteLength(byte);
      }
    }
  }

};

export var Scope = class Scope extends Pointer {};

bindAtomics = function() {
  var buffer;
  if (BUFFER || !(buffer = arguments[0])) {
    return;
  }
  queueMicrotask(function() {
    return Pointer.register(Scope, {
      byteLength: {
        value: buffer.byteLength
      },
      typedArray: {
        value: Uint8Array
      },
      protoClass: {
        value: 0
      }
    });
  });
  BUFFER = Pointer.prototype.buffer = buffer;
  UINT32 = new Uint32Array(BUFFER);
  palloc = Atomics.add.bind(Atomics, UINT32, PALLOC_INDEX);
  malloc = Atomics.add.bind(Atomics, UINT32, MALLOC_INDEX);
  addUint32 = function() {
    return Atomics.add(UINT32, arguments[0] / 4, arguments[1]);
  };
  getUint32 = function() {
    return Atomics.load(UINT32, arguments[0] / 4);
  };
  setUint32 = function() {
    return Atomics.store(UINT32, arguments[0] / 4, arguments[1]);
  };
  return (function() {
    console.groupCollapsed("Scope is ready", [self.constructor.name]);
    console.log(typeof DedicatedWorkerGlobalScope !== "undefined" && DedicatedWorkerGlobalScope !== null ? DedicatedWorkerGlobalScope : window);
    return console.groupEnd();
  })();
};

packFunction = function() {
  return {
    native: /native/.test(arguments[0] + ''),
    typeof: typeof arguments[0],
    name: arguments[0].name,
    global: self[arguments[0].name] != null,
    constructor: arguments[0].constructor.name,
    toString: arguments[0].toString()
  };
};

packDefinitions = function() {
  var definition, definitions, desc, pack, prop;
  [definitions, pack = {}] = arguments;
  for (prop in definitions) {
    desc = definitions[prop];
    if (prop === "name" || prop === "prototype") {
      continue;
    }
    definition = {};
    pack[prop] = {
      configurable: desc.configurable,
      enumerable: desc.enumerable,
      writable: desc.writable
    };
    if ("function" === typeof desc.value) {
      definition.type = "value";
      definition.value = "function";
      definition.function = packFunction(desc.value);
    } else if (void 0 !== desc.value) {
      definition.type = "value";
      definition.value = desc.value;
    } else {
      if ("function" === typeof desc.get) {
        definition.getter = packFunction(desc.get);
      }
      if ("function" === typeof desc.set) {
        definition.setter = packFunction(desc.set);
      }
      if (!definition.setter) {
        definition.type = "getter";
      } else if (!definition.getter) {
        definition.type = "setter";
      } else {
        definition.type = "getset";
      }
    }
    pack[prop].definition = definition;
  }
  return pack;
};

packScope = function() {
  var i, imports, k, len, obj, ref1;
  imports = [];
  ref1 = [Pointer, ...OBJECT];
  for (i = k = 0, len = ref1.length; k < len; i = ++k) {
    obj = ref1[i];
    if (!((obj != null ? obj.prototype : void 0) instanceof Pointer)) {
      if (obj !== Pointer) {
        continue;
      }
    }
    imports.push({
      index: i,
      class: {
        constructor: `(${obj});`,
        descsriptors: packDefinitions(Object.getOwnPropertyDescriptors(obj)),
        symbols: packDefinitions(Object.getOwnPropertySymbols(obj))
      },
      prototype: {
        descsriptors: packDefinitions(Object.getOwnPropertyDescriptors(obj.prototype)),
        symbols: packDefinitions(Object.getOwnPropertySymbols(obj.prototype))
      }
    });
  }
  return imports;
};

(handleScope = function() {
  OBJECT[0] = Scope;
  if (typeof WorkerGlobalScope === "undefined" || WorkerGlobalScope === null) {
    bindAtomics(new SharedArrayBuffer(1e4));
    palloc(HEADER_BYTELENGTH);
    return malloc(MEMORY_BYTEOFFSET);
  } else {
    //?  WorkerGlobalScope   
    return self.addEventListener("message", function(e) {
      var found, i, j, k, l, len, len1, name, o, ref1, ref2;
      bindAtomics(e.data.buffer);
      ref1 = e.data.object;
      for (i = k = 0, len = ref1.length; k < len; i = ++k) {
        name = ref1[i];
        if (!name) {
          continue;
        }
        found = false;
        ref2 = OBJECT.slice();
        for (j = l = 0, len1 = ref2.length; l < len1; j = ++l) {
          o = ref2[j];
          if ((o != null ? o.name : void 0) !== name) {
            continue;
          }
          OBJECT[i] = o;
          found = true;
          break;
        }
        if (found) {
          continue;
        }
        OBJECT[i] = new Proxy({name}, {
          get: function(ref, key, proxy) {
            return console.log("getter", {ref, key, proxy});
          }
        });
      }
      return dispatchEvent(new CustomEvent("ready", {
        detail: self.window = new Scope(0)
      }));
    }, {
      once: true
    });
  }
})();

Object.defineProperty(Pointer, "store", {
  value: function(object) {
    var i;
    if (-1 === (i = OBJECT.indexOf(object))) {
      i += OBJECT.push(object);
    }
    return i;
  }
});

Object.defineProperty(Pointer, "dumpScope", {
  value: function() {
    return console.warn(OBJECT);
  }
});

Object.defineProperty(Pointer, "importMetaUrl", {
  value: function() {
    var i;
    if (-1 === (i = IMPORT.indexOf(arguments[0]))) {
      i += IMPORT.push(arguments[0]);
    }
    return i;
  }
});

Object.defineProperty(Pointer, "register", {
  value: function(prototype, definitions = {}) {
    if (definitions.byteLength) {
      if (!definitions.typedArray) {
        definitions.typedArray = {
          value: Uint8Array
        };
      }
      definitions.length = {
        value: definitions.byteLength.value / definitions.typedArray.value.BYTES_PER_ELEMENT
      };
    }
    if (Object.keys(definitions).length) {
      Object.defineProperties(prototype, {
        protoClass: {
          value: Pointer.store(prototype)
        },
        ...definitions
      });
    }
    return prototype;
  }
});

Object.defineProperty(Pointer, "fork", {
  value: async function() {
    var i, k, len, o, scope, script, url, uuid;
    scope = {
      buffer: BUFFER
    };
    scope.object = [];
    for (i = k = 0, len = OBJECT.length; k < len; i = ++k) {
      o = OBJECT[i];
      scope.object[i] = o != null ? o.name : void 0;
    }
    script = [
      ...IMPORT.slice().map(function(url,
      i) {
        return `${EOL} import * as m${i} from '${url}' ${EOL} Object.assign( self , m${i} ) ${EOL}`;
      }),
      (await ((await fetch("worker.js"))).text())
    ].join(EOL);
    uuid = crypto.randomUUID();
    return new Worker(url = URL.createObjectURL(new Blob([script], {
      type: 'application/javascript'
    })), {
      type: "module"
    }).postMessage(scope);
  }
});

Object.defineProperty(Pointer.prototype, "getProtoClass", {
  value: function() {
    return getUint32(this + OFFSET_PROTOCLASS);
  }
});

Object.defineProperty(Pointer.prototype, "setProtoClass", {
  value: function() {
    return setUint32(this + OFFSET_PROTOCLASS, arguments[0]);
  }
});

Object.defineProperty(Pointer.prototype, "getByteOffset", {
  value: function() {
    return getUint32(this + OFFSET_BYTEOFFSET);
  }
});

Object.defineProperty(Pointer.prototype, "setByteOffset", {
  value: function() {
    return setUint32(this + OFFSET_BYTEOFFSET, arguments[0]);
  }
});

Object.defineProperty(Pointer.prototype, "getByteLength", {
  value: function() {
    return getUint32(this + OFFSET_BYTELENGTH);
  }
});

Object.defineProperty(Pointer.prototype, "setByteLength", {
  value: function() {
    return setUint32(this + OFFSET_BYTELENGTH, arguments[0]);
  }
});

Object.defineProperty(Pointer.prototype, "loadPrototype", {
  value: function() {
    return Object.setPrototypeOf(this, OBJECT[getUint32(this + OFFSET_PROTOCLASS)].prototype);
  }
});

Object.defineProperty(Pointer.prototype, "getInstanceOf", {
  value: function() {
    return OBJECT[getUint32(this + OFFSET_PROTOCLASS)];
  }
});

Object.defineProperty(Pointer.prototype, "setInstanceOf", {
  value: function() {
    var i;
    i = Pointer.store(this.constructor);
    return setUint32(this + OFFSET_PROTOCLASS, i);
  }
});

Object.defineProperty(Pointer.prototype, "{{Pointer}}", {
  get: function() {
    var Dump;
    return Object.assign(new (Dump = class Dump extends Object {}), {
      protoClass: this.getProtoClass(),
      byteOffset: this.getByteOffset(),
      byteLength: this.getByteLength(),
      instanceOf: this.getInstanceOf()
    });
  }
});

export default Pointer;
