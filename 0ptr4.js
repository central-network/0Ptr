var BPE, Collection, DEBUG, GL2KEY, GL2NUM, GL2VAL, PALLOC_TYPE, PALLOC_UINT32, PALLOC_UINT8, PTR, SCRIPT, Storage, assign, c, clearself, debug, decode, define, dvw, encode, error, f32, getOwn, hasOwn, iLE, info, j, key, len, log, palloc, protof, ref, register, sab, table, u32, ui8, val, warn;

DEBUG = 0;

//* hello world
GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

SCRIPT = function() {
  var src;
  src = (function() {
    var Alias;
    return Object.defineProperty(self, "Alias", {
      value: (Alias = class Alias extends storage[i] {})
    });
  }).toString();
  src = src.substring(src.indexOf("Object"), src.lastIndexOf("}")).replace(/Alias/g, Alias).replace("[i]", `[${parentStorageIndex}]`);
  return document.head.appendChild(assign(document.createElement("script"), {
    text: src
  })).remove();
};

({log, warn, error, table, debug, info} = console);

sab = new SharedArrayBuffer(1e7 * 8);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

BPE = 4;

PTR = 16 * BPE;

PALLOC_TYPE = {
  PALLOC_UINT8: PALLOC_UINT8 = 1,
  PALLOC_UINT32: PALLOC_UINT32 = 4
};

ref = [PALLOC_TYPE];
for (j = 0, len = ref.length; j < len; j++) {
  c = ref[j];
  for (key in c) {
    val = c[key];
    c[val] = val;
  }
}

Collection = class Collection extends Array {};

Storage = class Storage extends Array {
  constructor() {
    var base;
    if ((base = super(...arguments))[0] == null) {
      base[0] = null;
    }
  }

  store(any, bytes = 2) {
    var i;
    if (-1 === (i = this.indexOf(any))) {
      i = Math.pow(0xff, bytes - 1);
      while (this[i]) {
        i = 1 + i;
      }
      if (i > Math.pow(0xff, bytes)) {
        throw /EXCEED_STORAGE/;
      } else {
        this[i] = any;
      }
    }
    if (Math.pow(0xff, bytes) <= i) {
      throw /EXCEED_STORAGE/;
    }
    return i;
  }

  storeForUint8(any) {
    return this.store(any, 1);
  }

  storeForUint16(any) {
    return this.store(any, 2);
  }

  storeForUint32(any) {
    return this.store(any, 4);
  }

  storeForUint64(any) {
    return this.store(any, 8);
  }

};

assign = Object.assign;

hasOwn = Object.hasOwn;

getOwn = Object.getOwnPropertyDescriptors;

protof = Object.getPrototypeOf;

define = function() {
  var desc, object, prop, ref1;
  [object, prop, desc] = arguments;
  if (arguments[2] == null) {
    ref1 = {...prop};
    for (prop in ref1) {
      desc = ref1[prop];
      define(object, prop, desc);
    }
    return object;
  }
  if (!desc.get && !desc.set && !desc.value) {
    desc = {
      value: desc
    };
  }
  return Object.defineProperty(object, prop, desc);
};

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

palloc = function() {
  var o;
  o = Atomics.add(u32, 0, PTR);
  if (!o) {
    throw [/PALLOC/, u32.slice(0, 2)];
  }
  return o;
};

Atomics.or(u32, 0, PTR);

(clearself = function() {
  var k, l, len1, len2, len3, len4, m, n, p, ref1, ref2, ref3, ref4;
  ref1 = "isFinite isInteger isNaN isSafeInteger parseFloat parseInt".split(/\n|\s+/g);
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    p = ref1[k];
    Reflect.deleteProperty(Number, p);
  }
  ref2 = "toExponential toLocaleString toPrecision toFixed".split(/\n|\s+/g);
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    p = ref2[l];
    Reflect.deleteProperty(Number.prototype, p);
  }
  ref3 = "assign create entries freeze fromEntries getOwnPropertyDescriptor getOwnPropertyNames getOwnPropertySymbols getPrototypeOf groupBy hasOwn is isExtensible isFrozen isSealed keys preventExtensions seal setPrototypeOf values".split(/\n|\s+/g);
  for (m = 0, len3 = ref3.length; m < len3; m++) {
    p = ref3[m];
    Reflect.deleteProperty(Object, p);
  }
  ref4 = "__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ propertyIsEnumerable toLocaleString hasOwnProperty".split(/\n|\s+/g);
  for (n = 0, len4 = ref4.length; n < len4; n++) {
    p = ref4[n];
    Reflect.deleteProperty(Object.prototype, p);
  }
  return 0;
})();

define(window, {
  storage: new Storage(Number)
});

define(Number.prototype, {
  toString: function() {
    throw /toString/;
  }
});

register = function() {
  var Alias, Parent, i, ref1, results;
  ref1 = arguments[0];
  results = [];
  for (Alias in ref1) {
    Parent = ref1[Alias];
    if (-1 === (i = storage.indexOf(Parent))) {
      throw /PARENT_NOT_REGISTERED/;
    }
    if (storage.find(function(c) {
      return (c != null ? c.name : void 0) === Alias;
    })) {
      throw /ALREADY_REGISTERED/;
    }
    results.push(document.head.appendChild(assign(document.createElement("script"), {
      text: `class ${Alias} extends storage[${i}] {}; storage.storeForUint8( ${Alias} );`
    })).remove());
  }
  return results;
};

register({
  Pointer: Number
});

register({
  Class: Pointer
});

register({
  Allocation: Pointer
});

register({
  Vector3: Pointer
});

define(Pointer, "{{Class}}", {
  get: function() {
    var ptri, stri;
    stri = storage.indexOf(this);
    ptri = Atomics.load(u32);
    while (ptri -= PTR) {
      if (stri === dvw.getUint8(ptri + 2)) {
        break;
      }
    }
    if (!ptri) {
      if (ptri = palloc()) {
        dvw.setUint8(ptri + 0, 1); //status
        dvw.setUint8(ptri + 1, 4); //inner alloc offset
        dvw.setUint8(ptri + 2, stri);
      }
    }
    return new Class(ptri);
  }
});

define(Class.prototype, {
  statusi: {
    get: function() {
      return dvw.getUint8(this + 0);
    },
    set: function() {
      return dvw.setUint8(this + 0, arguments[0]);
    }
  },
  byteLength: {
    get: function() {
      return dvw.getUint8(this + 1);
    },
    set: function() {
      return dvw.setUint8(this + 1, arguments[0]);
    }
  },
  storagei: {
    get: function() {
      return dvw.getUint8(this + 2);
    },
    set: function() {
      return dvw.setUint8(this + 2, arguments[0]);
    }
  },
  resvUi8: {
    get: function() {
      return dvw.getUint8(this + 3);
    },
    set: function() {
      return dvw.setUint8(this + 3, arguments[0]);
    }
  },
  prototype: {
    enumerable: true,
    get: function() {
      return storage[this.storagei];
    }
  },
  name: {
    enumerable: true,
    get: function() {
      warn(1);
      return this.prototype.name;
    }
  },
  parent: {
    enumerable: true,
    get: function() {
      return protof(this.prototype)["{{Class}}"] || new Number(0);
    }
  },
  keyName: {
    get: function() {
      var name;
      name = this.name;
      if (name.split("").some(function(c) {
        return c === c.toUpperCase();
      })) {
        return name.toLocaleLowerCase();
      }
      return name[0].toLowerCase() + name.substring(1);
    }
  }
});

define(Pointer, {
  alloc: {
    get: function() {
      var ptri;
      ptri = new this(palloc());
      dvw.setUint8(ptri + 0, 1); //status
      dvw.setUint8(ptri + 1, 4); //inner alloc offset
      return function() {
        return ptri;
      };
    }
  }
});

define(Pointer, {
  palloc: function() {
    var aptri, byteLength, byteOffset, clsptri, desc, prop, ref1, results;
    //? class pointer search
    clsptri = this["{{Class}}"];
    log(this.name, clsptri, arguments[0]);
    ref1 = arguments[0];
    results = [];
    for (prop in ref1) {
      desc = ref1[prop];
      if (byteLength = PALLOC_TYPE[desc]) {
        desc = {byteLength};
      }
      byteOffset = clsptri.byteLength;
      clsptri.byteLength += byteLength;
      define(clsptri.prototype, prop, {
        get: function() {},
        set: function() {}
      });
      results.push(aptri = new Allocation.alloc());
    }
    return results;
  }
});

Class.palloc({
  parent: PALLOC_UINT32
});

Vector3.palloc({
  x: PALLOC_UINT8
});

log(new Vector3(palloc()));
