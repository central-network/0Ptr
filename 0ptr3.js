//* hello world
var BPE, CLEARPROTOS, GL2KEY, GL2NUM, GL2VAL, HAS_BYTELENGTH, HAS_BYTEOFFSET, HAS_LENGTH, PTR_BYTELENGTH, PTR_CLASSINDEX, PTR_LENGTH, REDEFINEPTR, Storage, assign, debug, decode, define, dvw, encode, error, f32, getByteLength, getByteOffset, getClassIndex, getFloat32, getFloat32Array, getLength, getPtriFloat32, getUint32, getUint8, global, hasOwn, iLE, info, log, malloc, palloc, ptrFloat32Array, ptrUint32Array, ptrUint8Array, ptriColor4ArrayGetter, ptriColor4CssGetter, ptriColor4HexGetter, ptriColor4HslaGetter, ptriColor4NumberGetter, ptriColor4RgbaGetter, ptriFloat32Array, ptriFloat32ArrayGetter, ptriFloat32ArraySetter, ptriVector3LengthGetter, sab, setByteLength, setByteOffset, setClassIndex, setFloat32, setLength, setPtriFloat32, setUint32, setUint8, storage, table, u32, ui8, warn;

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

HAS_LENGTH = 3 * BPE;

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
    if (!desc.get && !desc.set && !desc.value) {
      desc = {
        value: desc
      };
    }
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
  f00: getUint8 = function(byteOffset) {
    return dvw.getUint8(byteOffset);
  },
  f01: setUint8 = function(byteOffset, value) {
    dvw.setUint8(byteOffset, value);
    return value;
  },
  f00: getUint32 = function(byteOffset) {
    return dvw.getUint32(byteOffset, iLE);
  },
  f01: setUint32 = function(byteOffset, value) {
    dvw.setUint32(byteOffset, value, iLE);
    return value;
  },
  f00: getFloat32 = function(byteOffset) {
    return dvw.getFloat32(byteOffset, iLE);
  },
  f01: setFloat32 = function(byteOffset, value) {
    dvw.setFloat32(byteOffset, value, iLE);
    return value;
  },
  f07: getFloat32Array = function(byteOffset, length) {
    if (!byteOffset || !length) {
      throw /OFFSET_LEN/;
    }
    return new Float32Array(sab, byteOffset, length);
  },
  //? ptri, ... ------>
  f00: getPtriFloat32 = function(ptri, byteOffset) {
    return getFloat32(byteOffset + getByteOffset(ptri), iLE);
  },
  f01: setPtriFloat32 = function(ptri, byteOffset, value) {
    setFloat32(byteOffset + getByteOffset(ptri), value, iLE);
    return value;
  },
  f02: setClassIndex = function(ptri, classIndex) {
    return setUint8(ptri + PTR_CLASSINDEX, classIndex);
  },
  f05: getClassIndex = function(ptri) {
    return getUint8(ptri + PTR_CLASSINDEX);
  },
  f03: setByteOffset = function(ptri, byteOffset) {
    return setUint32(ptri + HAS_BYTEOFFSET, byteOffset);
  },
  f06: getByteOffset = function(ptri) {
    return getUint32(ptri + HAS_BYTEOFFSET);
  },
  f04: setByteLength = function(ptri, byteLength) {
    return setUint32(ptri + HAS_BYTELENGTH, byteLength);
  },
  f07: getByteLength = function(ptri) {
    return getUint32(ptri + HAS_BYTELENGTH);
  },
  f04: setLength = function(ptri, length) {
    return setUint32(ptri + HAS_LENGTH, length);
  },
  f07: getLength = function(ptri) {
    return getUint32(ptri + HAS_LENGTH);
  },
  f07: ptrUint8Array = function(ptri) {
    return new Uint8Array(sab, ptri, PTR_BYTELENGTH);
  },
  f07: ptrUint32Array = function(ptri) {
    return new Uint32Array(sab, ptri, PTR_LENGTH);
  },
  f07: ptrFloat32Array = function(ptri) {
    return new Float32Array(sab, ptri, PTR_LENGTH);
  },
  f07: ptriFloat32Array = function(ptri, byteOffset = 0, length) {
    length || (length = getLength(ptri));
    byteOffset += getByteOffset(ptri);
    return new Float32Array(sab, byteOffset, length);
  },
  fff: ptriFloat32ArrayGetter = function() {
    return new Float32Array(sab, getByteOffset(this), getLength(this));
  },
  fff: ptriFloat32ArraySetter = function(any) {
    var i, isArray, isView, v;
    isArray = Array.isArray(any);
    isView = ArrayBuffer.isView(any);
    if (isArray || isView) {
      i = 0;
      for (v of any) {
        setPtriFloat32(this, 4 * i++, v);
      }
    } else {
      throw /TODOLIST_SETTER_FLOAT32/;
    }
    return this;
  },
  fff: ptriVector3LengthGetter = function() {
    var x, y, z;
    [x, y, z] = this.subarray;
    return Math.sqrt(x * x + y * y + z * z);
  },
  fff: ptriColor4HexGetter = function() {
    var a, alpha, b, blue, g, green, r, red;
    [red, green, blue, alpha] = this.array;
    r = red.toString(16).padStart(2, 0);
    g = green.toString(16).padStart(2, 0);
    b = blue.toString(16).padStart(2, 0);
    a = alpha.toString(16).padStart(2, 0);
    return `0x${r}${g}${b}${a}`;
  },
  fff: ptriColor4CssGetter = function() {
    var blue, green, red;
    [red, green, blue] = ptriColor4ArrayGetter.call(this);
    return `rgba( ${red}, ${green}, ${blue} }, ${this.getAlpha()} )`;
  },
  fff: ptriColor4ArrayGetter = function() {
    return [...this.subarray].map(function(v) {
      return Math.trunc(v * 0xff);
    });
  },
  fff: ptriColor4NumberGetter = function() {
    return parseInt(ptriColor4HexGetter.call(this), 16);
  },
  fff: ptriColor4RgbaGetter = function() {
    var alpha, blue, green, red;
    [red, green, blue, alpha] = this.array;
    return {red, green, blue, alpha};
  },
  fff: ptriColor4HslaGetter = function() {
    var a, b, delta, g, h, l, max, min, r, s;
    [r, g, b, a] = this.subarray;
    // ref   : https://stackoverflow.com/a/58426404/21225939
    // author: @Crashalot
    // edit  : @Mike Pomax Kamermans, me
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    delta = max - min;
    h = s = l = 0;
    if (!delta) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else if (max === b) {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
      h = 360 + h;
    }
    l = (max + min) / 2;
    s = delta / (1 - Math.abs(2 * l - 1));
    
    // Multiply l, a and s by 100
    s = Math.trunc(s * 100);
    l = Math.trunc(l * 100);
    a = Math.trunc(a * 100);
    return {
      hue: h,
      saturation: s,
      lightness: l,
      alpha: a
    };
  }
};

//? helpers ----->
define({
  Pointer: Number
});

define(Pointer, {
  alloc: {
    get: function() {
      var blen, clsi, len, ptri;
      ptri = new this(palloc());
      clsi = this.classIndex;
      setClassIndex(ptri, clsi);
      blen = this.byteLength;
      len = this.length;
      return function(byteLength = blen, length = len) {
        var byteOffset;
        if (byteLength) {
          byteOffset = malloc(byteLength);
          setByteOffset(ptri, byteOffset);
          setByteLength(ptri, byteLength);
          if (length) {
            setLength(ptri, length);
          }
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
  byteLength: 12,
  TypedArray: Float32Array
});

define(Position.prototype, {
  getX: function() {
    return getPtriFloat32(this, 0);
  },
  setX: function() {
    return setPtriFloat32(this, 0, arguments[0]);
  },
  getY: function() {
    return getPtriFloat32(this, 4);
  },
  setY: function() {
    return setPtriFloat32(this, 4, arguments[0]);
  },
  getZ: function() {
    return getPtriFloat32(this, 8);
  },
  setZ: function() {
    return setPtriFloat32(this, 8, arguments[0]);
  }
});

define(Position.prototype, {
  set: {
    value: ptriFloat32ArraySetter
  },
  length: {
    get: ptriVector3LengthGetter
  },
  subarray: {
    get: ptriFloat32ArrayGetter
  }
});

define(Position.prototype, Symbol.iterator, function*() {
  yield getPtriFloat32(this, 0);
  yield getPtriFloat32(this, 4);
  yield getPtriFloat32(this, 8);
  return 0;
});

define({
  Color: Pointer
});

define(Color, {
  byteLength: 16,
  TypedArray: Float32Array
});

define(Color.prototype, {
  getRed: {
    value: function() {
      return getPtriFloat32(this, 0);
    }
  },
  setRed: {
    value: function() {
      return setPtriFloat32(this, 0, Math.min(1, arguments[0]));
    }
  },
  getGreen: {
    value: function() {
      return getPtriFloat32(this, 4);
    }
  },
  setGreen: {
    value: function() {
      return setPtriFloat32(this, 4, Math.min(1, arguments[0]));
    }
  },
  getBlue: {
    value: function() {
      return getPtriFloat32(this, 8);
    }
  },
  setBlue: {
    value: function() {
      return setPtriFloat32(this, 8, Math.min(1, arguments[0]));
    }
  },
  getAlpha: {
    value: function() {
      return getPtriFloat32(this, 12);
    }
  },
  setAlpha: {
    value: function() {
      return setPtriFloat32(this, 12, Math.min(1, arguments[0]));
    }
  }
});

define(Color.prototype, {
  set: {
    value: ptriFloat32ArraySetter
  },
  hex: {
    get: ptriColor4HexGetter
  },
  hsla: {
    get: ptriColor4HslaGetter
  },
  rgba: {
    get: ptriColor4RgbaGetter
  },
  css: {
    get: ptriColor4CssGetter
  },
  subarray: {
    get: ptriFloat32ArrayGetter
  },
  number: {
    get: ptriColor4NumberGetter
  },
  array: {
    get: ptriColor4ArrayGetter
  }
});

define(Color.prototype, Symbol.iterator, function*() {
  yield getPtriFloat32(this, 0);
  yield getPtriFloat32(this, 4);
  yield getPtriFloat32(this, 8);
  yield getPtriFloat32(this, 12);
  return 0;
});

//? finish ---->
(REDEFINEPTR = function() {
  var Alias, BYTES_PER_ELEMENT, Class, TypedArray, alias, byteLength, cache, d, desc, descs, get, j, len1, length, prop, set, subarray;
  for (j = 0, len1 = storage.length; j < len1; j++) {
    Class = storage[j];
    descs = Object.getOwnPropertyDescriptors(Class.prototype);
    cache = [];
//* getProperty -> get property
//* setProperty -> set property
    for (prop in descs) {
      desc = descs[prop];
      if (!desc.enumerable) {
        if (!/get|set/.test(prop.substring(0, 3))) {
          continue;
        }
        if (!(Alias = prop.substring(3))) {
          continue;
        }
        alias = Alias[0].toLowerCase() + Alias.substring(1);
        if (descs[alias] || cache.includes(alias)) {
          continue;
        }
        cache.push(alias);
        if (d = descs[`get${Alias}`]) {
          get = d.value;
        }
        if (d = descs[`set${Alias}`]) {
          set = d.value;
        }
        define(Class.prototype, {
          [alias]: {
            get,
            set,
            enumerable: true
          }
        });
      }
    }
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
    subarray = (function() {
      switch (TypedArray) {
        case Float32Array:
          return function() {
            return new Float32Array(sab, getByteOffset(this), getLength(this));
          };
        case Uint32Array:
          return function() {
            return new Uint32Array(sab, getByteOffset(this), getLength(this));
          };
        case Uint8Array:
          return function() {
            return new Uint8Array(sab, getByteOffset(this), getLength(this));
          };
      }
    })();
    define(Class.prototype, {
      debug: {
        get: function() {
          var enumerable;
          return Object.defineProperties(enumerable = {}, {
            subarray: {
              enumerable,
              value: subarray.call(this)
            },
            byteOffset: {
              enumerable,
              value: getByteOffset(this)
            },
            byteLength: {
              enumerable,
              value: getByteLength(this)
            },
            length: {
              enumerable,
              value: getLength(this)
            },
            u32ptri: {
              get: () => {
                return ptrUint32Array(this);
              }
            },
            ui8ptri: {
              get: () => {
                return ptrUint8Array(this);
              }
            }
          });
        }
      }
    });
    define(Class, {length, BYTES_PER_ELEMENT});
  }
  return 0;
})();

(CLEARPROTOS = function() {
  var j, len1, len2, len3, len4, m, n, p, q, ref, ref1, ref2, ref3;
  ref = "isFinite isInteger isNaN isSafeInteger parseFloat parseInt".split(/\n|\s+/g);
  for (j = 0, len1 = ref.length; j < len1; j++) {
    p = ref[j];
    Reflect.deleteProperty(Number, p);
  }
  ref1 = "toExponential toLocaleString toPrecision toFixed".split(/\n|\s+/g);
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    p = ref1[m];
    Reflect.deleteProperty(Number.prototype, p);
  }
  ref2 = "assign create entries freeze fromEntries getOwnPropertyDescriptor getOwnPropertyNames getOwnPropertySymbols getPrototypeOf groupBy hasOwn is isExtensible isFrozen isSealed keys preventExtensions seal setPrototypeOf values".split(/\n|\s+/g);
  for (n = 0, len3 = ref2.length; n < len3; n++) {
    p = ref2[n];
    Reflect.deleteProperty(Object, p);
  }
  ref3 = "__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ propertyIsEnumerable toLocaleString hasOwnProperty isPrototypeOf".split(/\n|\s+/g);
  for (q = 0, len4 = ref3.length; q < len4; q++) {
    p = ref3[q];
    Reflect.deleteProperty(Object.prototype, p);
  }
  return 0;
})();

//? test ---->
setTimeout(() => {
  var clr, j, k, len1, pos, results, v;
  log(pos = new Position.alloc());
  log(clr = new Color.alloc());
  pos.y = 2;
  for (k of pos) {
    warn({k});
  }
  clr.setRed(.7);
  clr.setGreen(.1);
  clr.setAlpha(1);
  clr.set([.2]);
  for (k in clr) {
    v = clr[k];
    warn({k, v});
  }
  results = [];
  for (j = 0, len1 = clr.length; j < len1; j++) {
    k = clr[j];
    results.push(warn(1, {k}));
  }
  return results;
}, 100);
