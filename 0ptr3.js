//* hello world
var BPE, CLEARPROTOS, GL2KEY, GL2NUM, GL2VAL, HAS_BYTELENGTH, HAS_BYTEOFFSET, HAS_LENGTH, PTR_BYTELENGTH, PTR_CLASSi, PTR_LENGTH, PTR_LINKEDi, PTR_PARENTi, PTR_STATUSi, REDEFINEPTR, Storage, assign, debug, decode, define, dvw, encode, error, f32, getByteLength, getByteOffset, getFloat32, getFloat32Array, getLength, getPtriClass, getPtriColorValue, getPtriFloat32, getPtriLinked, getPtriParent, getPtriStatus, getPtriVectorValue, getUint32, getUint8, getter, getterAllocNewPointer, getterPtriColorAlpha, getterPtriColorAsArray, getterPtriColorAsCSS, getterPtriColorAsHEX, getterPtriColorAsHSLA, getterPtriColorAsNumber, getterPtriColorAsRGBA, getterPtriColorBlue, getterPtriColorGreen, getterPtriColorRed, getterPtriDataAsText, getterPtriFloat32Array, getterPtriVectorLength, getterPtriVectorX, getterPtriVectorY, getterPtriVectorZ, global, hasOwn, iLE, info, iteratPtriFloat32x3, iteratPtriFloat32x4, log, malloc, palloc, ptrFloat32Array, ptrUint32Array, ptrUint8Array, ptriAllocAndSet, ptriFloat32Array, sab, setByteLength, setByteOffset, setFloat32, setLength, setPtriClass, setPtriColorValue, setPtriFloat32, setPtriLinked, setPtriParent, setPtriStatus, setPtriVectorValue, setUint32, setUint8, setter, setterPtriColorAlpha, setterPtriColorBlue, setterPtriColorGreen, setterPtriColorRed, setterPtriVectorX, setterPtriVectorY, setterPtriVectorZ, storage, symbol, table, u32, ui8, updateFloat32DataArray, updateTextRawString, warn;

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

PTR_STATUSi = 0 * BPE;

PTR_CLASSi = PTR_STATUSi + 1;

PTR_PARENTi = 1 * BPE;

PTR_LINKEDi = 2 * BPE;

HAS_BYTEOFFSET = 3 * BPE;

HAS_BYTELENGTH = 4 * BPE;

HAS_LENGTH = 5 * BPE;

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

symbol = function(object, props) {
  var alias, desc;
  for (alias in props) {
    desc = props[alias];
    break;
  }
  return define(object, Symbol[alias], {
    value: desc
  });
};

getter = function(object, props) {
  var alias, desc;
  for (alias in props) {
    desc = props[alias];
    break;
  }
  return define(object, alias, {
    get: desc
  });
};

setter = function(object, props) {
  var alias, desc;
  for (alias in props) {
    desc = props[alias];
    break;
  }
  return define(object, alias, {
    set: desc
  });
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
  f02: setPtriStatus = function(ptri, status) {
    setUint8(ptri + PTR_STATUSi, status);
    return status;
  },
  f05: getPtriStatus = function(ptri) {
    return getUint8(ptri + PTR_STATUSi);
  },
  f02: setPtriClass = function(ptri, classIndex) {
    setUint8(ptri + PTR_CLASSi, classIndex);
    return classIndex;
  },
  f05: getPtriClass = function(ptri) {
    return getUint8(ptri + PTR_CLASSi);
  },
  f02: setPtriParent = function(ptri, parent) {
    setUint32(ptri + PTR_PARENTi, parent, iLE);
    return parent;
  },
  f05: getPtriParent = function(ptri) {
    return getUint32(ptri + PTR_PARENTi);
  },
  f02: setPtriLinked = function(ptri, linked) {
    setUint32(ptri + PTR_LINKEDi, linked, iLE);
    return linked;
  },
  f05: getPtriLinked = function(ptri) {
    return getUint32(ptri + PTR_LINKEDi);
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
  fff: ptriAllocAndSet = function(ptri, data, view) {
    var blen, byteLength, byteOffset;
    if (!(byteOffset = getByteOffset(ptri))) {
      byteLength = data.byteLength;
      byteOffset = malloc(byteLength);
      setByteLength(ptri, byteLength);
      setByteOffset(ptri, byteOffset);
    } else if (data.byteLength > (blen = getByteLength(ptri))) {
      throw /GROW_NOT_IMPLEMENTED/;
    } else {
      ui8.fill(0, byteOffset, blen);
    }
    if (!getByteLength(ptri)) {
      throw /UNKNOWN_ON_ALLOCSET/;
    }
    view.set(data, byteOffset);
    return ptri;
  },
  fff: updateTextRawString = function(data, ptri = this) {
    var isArray, isView;
    if ("string" === typeof data) {
      return ptriAllocAndSet(ptri, encode(data), ui8);
    }
    isArray = Array.isArray(data);
    isView = data instanceof Uint8Array;
    if (isArray || isView) {
      ptriAllocAndSet(ptri, data, ui8);
    } else {
      throw /TODOLIST_SETTER_FLOAT32/;
    }
    return this;
  },
  fff: updateFloat32DataArray = function(data) {
    var i, isArray, isView, v;
    isArray = Array.isArray(data);
    isView = ArrayBuffer.isView(data);
    if (isArray || isView) {
      i = 0;
      for (v of data) {
        setPtriFloat32(this, 4 * i++, v);
      }
    } else {
      throw /TODOLIST_SETTER_FLOAT32/;
    }
    return this;
  },
  fff: getterPtriFloat32Array = function(ptri = this) {
    return new Float32Array(sab, getByteOffset(ptri), getLength(ptri));
  },
  fff: getterAllocNewPointer = function(OPtr = this) {
    var blen, clsi, len, ptri;
    ptri = new OPtr(palloc());
    clsi = OPtr.classIndex;
    setPtriClass(ptri, clsi);
    blen = OPtr.byteLength;
    len = OPtr.length;
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
  },
  fff: getterPtriVectorLength = function(ptri = this) {
    var ref, sum, v;
    sum = 0;
    ref = this;
    for (v of ref) {
      sum += Math.pow(v, 2);
    }
    return Math.sqrt(sum);
  },
  fff: getPtriVectorValue = function(ptri, byteOffset) {
    return getPtriFloat32(ptri, byteOffset);
  },
  fff: getterPtriVectorX = function(ptri = this, byteOffset = 0) {
    return getPtriVectorValue(ptri, byteOffset);
  },
  fff: getterPtriVectorY = function(ptri = this, byteOffset = 4) {
    return getPtriVectorValue(ptri, byteOffset);
  },
  fff: getterPtriVectorZ = function(ptri = this, byteOffset = 8) {
    return getPtriVectorValue(ptri, byteOffset);
  },
  fff: setPtriVectorValue = function(ptri, value, byteOffset) {
    return setPtriFloat32(ptri, byteOffset, value);
  },
  fff: setterPtriVectorX = function(value, byteOffset = 0, ptri = this) {
    return setPtriVectorValue(ptri, value, byteOffset);
  },
  fff: setterPtriVectorY = function(value, byteOffset = 4, ptri = this) {
    return setPtriVectorValue(ptri, value, byteOffset);
  },
  fff: setterPtriVectorZ = function(value, byteOffset = 8, ptri = this) {
    return setPtriVectorValue(ptri, value, byteOffset);
  },
  fff: getPtriColorValue = function(ptri, byteOffset) {
    return getPtriFloat32(ptri, byteOffset);
  },
  fff: getterPtriColorRed = function(ptri = this, byteOffset = 0) {
    return getPtriColorValue(ptri, byteOffset);
  },
  fff: getterPtriColorGreen = function(ptri = this, byteOffset = 4) {
    return getPtriColorValue(ptri, byteOffset);
  },
  fff: getterPtriColorBlue = function(ptri = this, byteOffset = 8) {
    return getPtriColorValue(ptri, byteOffset);
  },
  fff: getterPtriColorAlpha = function(ptri = this, byteOffset = 12) {
    return getPtriColorValue(ptri, byteOffset);
  },
  fff: setPtriColorValue = function(ptri, value, byteOffset) {
    if (value > 1) {
      throw /MAX_COLOR_VALUE_EXCEED/;
    }
    if (value < 0) {
      throw /MIN_COLOR_VALUE_EXCEED/;
    }
    return setPtriFloat32(ptri, byteOffset, value);
  },
  fff: setterPtriColorRed = function(value, byteOffset = 0, ptri = this) {
    return setPtriColorValue(ptri, value, byteOffset);
  },
  fff: setterPtriColorGreen = function(value, byteOffset = 4, ptri = this) {
    return setPtriColorValue(ptri, value, byteOffset);
  },
  fff: setterPtriColorBlue = function(value, byteOffset = 8, ptri = this) {
    return setPtriColorValue(ptri, value, byteOffset);
  },
  fff: setterPtriColorAlpha = function(value, byteOffset = 12, ptri = this) {
    return setPtriColorValue(ptri, value, byteOffset);
  },
  fff: getterPtriColorAsHEX = function(ptri = this) {
    var a, alpha, array, b, blue, g, green, r, red;
    array = getterPtriColorAsArray(ptri);
    [red, green, blue, alpha] = array;
    r = red.toString(16).padStart(2, 0);
    g = green.toString(16).padStart(2, 0);
    b = blue.toString(16).padStart(2, 0);
    a = alpha.toString(16).padStart(2, 0);
    return `0x${r}${g}${b}${a}`;
  },
  fff: getterPtriColorAsCSS = function(ptri = this) {
    var alpha, blue, green, red;
    [red, green, blue, alpha] = getterPtriColorAsArray(ptri);
    return `rgba( ${red}, ${green}, ${blue} }, ${alpha / 0xff} )`;
  },
  fff: getterPtriColorAsArray = function(ptri = this) {
    var subarray;
    subarray = getterPtriFloat32Array(ptri);
    return [...subarray].map(function(v) {
      return Math.trunc(v * 0xff);
    });
  },
  fff: getterPtriColorAsNumber = function(ptri = this) {
    return parseInt(getterPtriColorAsHEX(ptri), 16);
  },
  fff: getterPtriColorAsRGBA = function(ptri = this) {
    var alpha, blue, green, red;
    [red, green, blue, alpha] = getterPtriColorAsArray(ptri);
    return {red, green, blue, alpha};
  },
  fff: getterPtriColorAsHSLA = function(ptri = this) {
    var a, b, delta, g, h, l, max, min, r, s;
    [r, g, b, a] = getterPtriFloat32Array(ptri);
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
  },
  fff: iteratPtriFloat32x4 = function*(ptri = this, byteOffset = 0) {
    yield getPtriFloat32(ptri, byteOffset);
    yield getPtriFloat32(ptri, byteOffset + 4);
    yield getPtriFloat32(ptri, byteOffset + 8);
    yield getPtriFloat32(ptri, byteOffset + 12);
    return 0;
  },
  fff: iteratPtriFloat32x3 = function*(ptri = this, byteOffset = 0) {
    yield getPtriFloat32(ptri, byteOffset);
    yield getPtriFloat32(ptri, byteOffset + 4);
    yield getPtriFloat32(ptri, byteOffset + 8);
    return 0;
  },
  fff: getterPtriDataAsText = function(ptri = this) {
    return decode(new Uint8Array(sab, getByteOffset(ptri), getByteLength(ptri)).slice(0));
  }
};

//? helpers ----->
define({
  Pointer: Number
});

define({
  Position: Pointer
});

define({
  Color: Pointer
});

define({
  Text: Pointer
});

define({
  Procedure: Text
});

define({
  Protocol: Pointer
});

define({
  Queue: Pointer
});

getter(Pointer, {
  alloc: getterAllocNewPointer
});

define(Color, {
  byteLength: 4 * 4
});

define(Position, {
  byteLength: 3 * 4
});

define(Text, {
  TypedArray: Uint8Array
});

define(Color, {
  TypedArray: Float32Array
});

define(Position, {
  TypedArray: Float32Array
});

define(Pointer.prototype, {
  isPointer: true
});

define(Position.prototype, {
  getX: getterPtriVectorX
});

define(Position.prototype, {
  getY: getterPtriVectorY
});

define(Position.prototype, {
  getZ: getterPtriVectorZ
});

define(Position.prototype, {
  setX: setterPtriVectorX
});

define(Position.prototype, {
  setY: setterPtriVectorY
});

define(Position.prototype, {
  setZ: setterPtriVectorZ
});

getter(Position.prototype, {
  subarray: getterPtriFloat32Array
});

getter(Position.prototype, {
  vectorLength: getterPtriVectorLength
});

define(Position.prototype, {
  set: updateFloat32DataArray
});

symbol(Position.prototype, {
  iterator: iteratPtriFloat32x3
});

define(Color.prototype, {
  getRed: getterPtriColorRed
});

define(Color.prototype, {
  setRed: setterPtriColorRed
});

define(Color.prototype, {
  getGreen: getterPtriColorGreen
});

define(Color.prototype, {
  setGreen: setterPtriColorGreen
});

define(Color.prototype, {
  getBlue: getterPtriColorBlue
});

define(Color.prototype, {
  setBlue: setterPtriColorBlue
});

define(Color.prototype, {
  getAlpha: getterPtriColorAlpha
});

define(Color.prototype, {
  setAlpha: setterPtriColorAlpha
});

define(Color.prototype, {
  set: updateFloat32DataArray
});

getter(Color.prototype, {
  hex: getterPtriColorAsHEX
});

getter(Color.prototype, {
  hsla: getterPtriColorAsHSLA
});

getter(Color.prototype, {
  rgba: getterPtriColorAsRGBA
});

getter(Color.prototype, {
  css: getterPtriColorAsCSS
});

getter(Color.prototype, {
  number: getterPtriColorAsNumber
});

getter(Color.prototype, {
  array: getterPtriColorAsArray
});

getter(Color.prototype, {
  subarray: getterPtriFloat32Array
});

symbol(Color.prototype, {
  iterator: iteratPtriFloat32x4
});

define(Text.prototype, {
  set: updateTextRawString
});

getter(Procedure.prototype, {
  alias: getterPtriDataAsText
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
  var clr, j, k, len1, pos, proc, results, v;
  log(pos = new Position.alloc());
  log(clr = new Color.alloc());
  log(proc = new Procedure.alloc().set("özgür"));
  log(getterPtriDataAsText(proc, 0, 1));
  pos.y = 2;
  for (k of pos) {
    warn({k});
  }
  clr.setRed(.7);
  clr.setGreen(.1);
  clr.setAlpha(1);
  clr.set([.2, 2.1, 1]);
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
