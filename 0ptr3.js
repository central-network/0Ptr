//* hello world
var BPE, CLEAN_PROTO, GL2KEY, GL2NUM, GL2VAL, HAS_BYTELENGTH, HAS_BYTEOFFSET, PTR_BYTELENGTH, PTR_CLASSINDEX, PTR_LENGTH, REDEFINEPTR, Storage, assign, debug, decode, define, dvw, encode, error, f32, getByteLength, getByteOffset, getClassIndex, getUint32, global, hasOwn, iLE, info, log, malloc, palloc, sab, setByteLength, setByteOffset, setClassIndex, setUint32, storage, table, u32, ui8, warn;

GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

({log, warn, error, table, debug, info} = console);

sab = new SharedArrayBuffer(1e7 * 8);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

BPE = 4;

PTR_LENGTH = 16;

PTR_BYTELENGTH = BPE * PTR_LENGTH;

PTR_CLASSINDEX = 0 * BPE;

HAS_BYTEOFFSET = 1 * BPE;

HAS_BYTELENGTH = 2 * BPE;

Atomics.store(u32, 0, PTR_BYTELENGTH);

Atomics.store(u32, 1, 2000 * PTR_BYTELENGTH);

Atomics.store(u32, 2, 0);

warn(storage = new (Storage = class Storage extends Array {
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
      this.splice(i, 1);
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

})(Number));

hasOwn = function(o, v) {
  var c;
  return Object.hasOwn((c = o.constructor).prototype, v) && c || Object.hasOwn(o, v) && o;
};

assign = Object.assign;

define = function(object, props, desc) {
  var Class, Super, el, prop;
  if (!desc && !props) {
    for (Class in object) {
      Super = object[Class];
      break;
    }
    document.head.append(assign(el = document.createElement("script"), {
      innerText: `self['${Class}'] = class ${Class} extends ${Super.name} {}`
    }));
    Object.defineProperty(self[Class], "classIndex", {
      value: storage.storeForUint8(self[Class])
    });
    el.remove();
  } else if (!desc) {
    for (prop in props) {
      desc = props[prop];
      if (!desc.get && !desc.set && !desc.value) {
        desc = {
          value: desc
        };
      }
      Object.defineProperty(object, prop, desc);
    }
  } else {
    Object.defineProperty(object, props, desc);
  }
  return object;
};

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

palloc = function() {
  var o;
  o = Atomics.add(u32, 0, PTR_BYTELENGTH);
  if (!o) {
    throw [/PALLOC/, u32.slice(0, 2)];
  }
  return o;
};

malloc = function(byteLength = 0) {
  var mod, o;
  if (mod = byteLength % 8) {
    byteLength += 8 - mod;
  }
  o = Atomics.add(u32, 1, byteLength);
  if (!o || o % 8) {
    throw [/NOD_8/, u32.slice(0, 2)];
  }
  return o;
};

global = {
  f00: getUint32 = function(byteOffset) {
    return dvw.getUint32(byteOffset, iLE);
  },
  f01: setUint32 = function(byteOffset, value) {
    dvw.setUint32(byteOffset, value, iLE);
    return value;
  },
  f02: setClassIndex = function(ptri, classIndex) {
    return setUint32(ptri + PTR_CLASSINDEX, classIndex);
  },
  f03: setByteOffset = function(ptri, byteOffset) {
    return setUint32(ptri + HAS_BYTEOFFSET, byteOffset);
  },
  f04: setByteLength = function(ptri, byteLength) {
    return setUint32(ptri + HAS_BYTELENGTH, byteLength);
  },
  f05: getClassIndex = function(ptri) {
    return getUint32(ptri + PTR_CLASSINDEX);
  },
  f06: getByteOffset = function(ptri) {
    return getUint32(ptri + HAS_BYTEOFFSET);
  },
  f07: getByteLength = function(ptri) {
    return getUint32(ptri + HAS_BYTELENGTH);
  }
};

define({
  Pointer: Number
});

define(Pointer, {
  alloc: {
    get: function() {
      var $byteLength, clsi, ptri;
      ptri = new this(palloc());
      clsi = this.classIndex;
      setClassIndex(ptri, clsi);
      $byteLength = this.byteLength;
      return function(byteLength = $byteLength) {
        var byteOffset;
        if (byteLength) {
          byteOffset = malloc(byteLength);
          setByteOffset(ptri, byteOffset);
          setByteLength(ptri, byteLength);
        }
        return ptri;
      };
    }
  }
});

define(Pointer.prototype, {
  isPointer: true
});

define({
  Position: Pointer
});

define(Position, {
  byteLength: 12
});

define(Position, {
  TypedArray: Float32Array
});

setTimeout(() => {
  var pos;
  return log(pos = new Position.alloc());
}, 100);

(REDEFINEPTR = function() {
  var BYTES_PER_ELEMENT, Class, TypedArray, byteLength, j, len, length, results, subarrayGetter;
  results = [];
  for (j = 0, len = storage.length; j < len; j++) {
    Class = storage[j];
    if (!hasOwn(Class, "byteLength")) {
      continue;
    }
    if (!hasOwn(Class, "TypedArray")) {
      continue;
    }
    TypedArray = Class.TypedArray;
    BYTES_PER_ELEMENT = TypedArray.BYTES_PER_ELEMENT;
    byteLength = Class.byteLength;
    length = byteLength / BYTES_PER_ELEMENT;
    subarrayGetter = (function() {
      switch (TypedArray) {
        case Float32Array:
          return function() {
            return new Float32Array(sab, this.byteOffset, this.constructor.length);
          };
        case Uint32Array:
          return function() {
            return new Uint32Array(sab, this.byteOffset, this.constructor.length);
          };
        case Uint8Array:
          return function() {
            return new Uint8Array(sab, this.byteOffset, this.constructor.length);
          };
      }
    })();
    define(Class, {length, BYTES_PER_ELEMENT});
    results.push(define(Class.prototype, {
      subarray: {
        get: subarrayGetter
      },
      byteOffset: {
        get: function() {
          return getByteOffset(this);
        }
      },
      byteLength: {
        get: function() {
          return getByteLength(this);
        }
      }
    }));
  }
  return results;
})();

(CLEAN_PROTO = function() {
  var j, k, l, len, len1, len2, len3, m, p, ref, ref1, ref2, ref3, results;
  ref = "isFinite isInteger isNaN isSafeInteger parseFloat parseInt".split(/\n|\s+/g);
  for (j = 0, len = ref.length; j < len; j++) {
    p = ref[j];
    Reflect.deleteProperty(Number, p);
  }
  ref1 = "toExponential toLocaleString toPrecision toFixed".split(/\n|\s+/g);
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    p = ref1[k];
    Reflect.deleteProperty(Number.prototype, p);
  }
  ref2 = "assign create entries freeze fromEntries getOwnPropertyDescriptor getOwnPropertyNames getOwnPropertySymbols getPrototypeOf groupBy hasOwn is isExtensible isFrozen isSealed keys preventExtensions seal setPrototypeOf values".split(/\n|\s+/g);
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    p = ref2[l];
    Reflect.deleteProperty(Object, p);
  }
  ref3 = "__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ propertyIsEnumerable toLocaleString hasOwnProperty isPrototypeOf".split(/\n|\s+/g);
  results = [];
  for (m = 0, len3 = ref3.length; m < len3; m++) {
    p = ref3[m];
    results.push(Reflect.deleteProperty(Object.prototype, p));
  }
  return results;
})();
