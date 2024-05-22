//* hello world
var BPE, CLEARPROTOS, Collection, GL2KEY, GL2NUM, GL2VAL, HAS_BYTELENGTH, HAS_BYTEOFFSET, HAS_LENGTH, OPtr, PROCEDURE_FILTERER, PTRTYPE_CLASS, PTRTYPE_DATAPTR, PTRTYPE_HEADER, PTRTYPE_OFFSET, PTR_BYTELENGTH, PTR_CLASSi, PTR_LENGTH, PTR_LINKEDi, PTR_PARENTi, PTR_RESVu8, PTR_STATUSi, PTR_TYPEi, REDEFINEPTR, STATE_DELETE, STATE_IGNORE, STATE_MALLOC, STATE_PALLOC, STATE_QUEUED, STATE_UPDATED, STATE_UPDATING, STATE_UPLOAD, STATE_UPLOADED, STATE_UPLOADING, Storage, addPtriChildren, allocNewPointer, assign, debug, decode, define, dvw, encode, error, f32, findPtriClassPointer, getByteLength, getByteOffset, getFloat32, getFloat32Array, getLength, getOwn, getPtriClassi, getPtriColorValue, getPtriFloat32, getPtriLinked, getPtriParent, getPtriResvUint8, getPtriStatus, getPtriType, getPtriVectorValue, getUint32, getUint8, getter, getterMeshPosition, getterProtocolTest, getterPtrCAlias, getterPtrCClass, getterPtrCKeyName, getterPtrCParent, getterPtriAlias, getterPtriColorAlpha, getterPtriColorAsArray, getterPtriColorAsCSS, getterPtriColorAsHEX, getterPtriColorAsHSLA, getterPtriColorAsNumber, getterPtriColorAsRGBA, getterPtriColorBlue, getterPtriColorGreen, getterPtriColorRed, getterPtriDataAsText, getterPtriFloat32Array, getterPtriLinked, getterPtriParent, getterPtriVectorLength, getterPtriVectorX, getterPtriVectorY, getterPtriVectorZ, global, hasOwn, iLE, info, iteratPtriFloat32x3, iteratPtriFloat32x4, log, looPtri, malloc, palloc, protof, ptr, ptrFloat32Array, ptrUint32Array, ptrUint8Array, ptriAllocAndSet, ptriFloat32Array, ptriStateNeedsIgnore, resv, sab, setByteLength, setByteOffset, setFloat32, setLength, setPtriClassi, setPtriColorValue, setPtriFloat32, setPtriLinked, setPtriParent, setPtriResvUint8, setPtriStatus, setPtriType, setPtriVectorValue, setUint32, setUint8, setter, setterMeshPosition, setterProtocolTest, setterPtriAlias, setterPtriColorAlpha, setterPtriColorBlue, setterPtriColorGreen, setterPtriColorRed, setterPtriLinked, setterPtriParent, setterPtriVectorX, setterPtriVectorY, setterPtriVectorZ, storage, symbol, table, u32, ui8, updateFloat32DataArray, updateTextRawString, warn;

Object.defineProperty(self, "OPtr", {
  value: (OPtr = class OPtr extends Number {})
});

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

ptr = [STATE_DELETE = 0, STATE_IGNORE = 1, STATE_PALLOC = 2, STATE_MALLOC = 3, STATE_QUEUED = 5, STATE_UPDATING = 6, STATE_UPDATED = 7, STATE_UPLOAD = 8, STATE_UPLOADING = 9, STATE_UPLOADED = 10, PTRTYPE_CLASS = 1, PTRTYPE_HEADER = 2, PTRTYPE_DATAPTR = 3, PTRTYPE_OFFSET = 4, PTR_LENGTH = 16, PTR_BYTELENGTH = BPE * PTR_LENGTH, PTR_STATUSi = 0 * BPE, PTR_CLASSi = PTR_STATUSi + 1, PTR_TYPEi = PTR_STATUSi + 2, PTR_RESVu8 = PTR_STATUSi + 3, PTR_PARENTi = 1 * BPE, PTR_LINKEDi = 2 * BPE, HAS_BYTEOFFSET = 3 * BPE, HAS_BYTELENGTH = 4 * BPE, HAS_LENGTH = 5 * BPE, PROCEDURE_FILTERER = 6 * BPE];

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
    if (hasOwn(any, "storagei")) {
      return any.storagei;
    }
    if (-1 === (i = this.indexOf(any))) {
      i = Math.pow(0xff, bytes - 1);
      while (this[i]) {
        i = 1 + i;
      }
      if (i > Math.pow(0xff, bytes)) {
        throw /EXCEED_STORAGE/;
      } else {
        this[i] = define(any, "storagei", i);
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

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

Atomics.store(u32, 0, PTR_BYTELENGTH);

Atomics.store(u32, 1, 2000 * PTR_BYTELENGTH);

Atomics.store(u32, 2, 0);

storage = new Storage(Number);

define = function(object, props, desc) {
  var $, Alias, Class, Extend, Parent, Super, clsptri, prop, text;
  if (!desc && !props) {
    for (Alias in object) {
      Super = object[Alias];
      break;
    }
    [Class, Parent] = (function() {
      switch (Extend = Super.name) {
        case "OPtr":
          return ["ClassPointer", "Pointer"];
        case "Pointer":
          return [`${Alias}Class`, "ClassPointer"];
        default:
          return [`${Alias}Class`, `${Extend}Class`];
      }
    })();
    text = (function() {
      Object.defineProperties(self, {
        Alias: {
          value: (Alias = class Alias extends Extend {})
        }
      });
      Object.defineProperties(self, {
        Class: {
          value: (Class = class Class extends Parent {})
        }
      });
      return 0;
    }).toString();
    text = text.substring(text.indexOf("Object"), text.lastIndexOf("return")).replace(/Alias/ug, Alias).replace(/Extend/ug, Extend).replace(/Class/ug, Class).replace(/Parent/ug, Parent);
    document.head.append(assign($ = document.createElement("script"), {text}));
    storage.storeForUint8(self[Class]);
    clsptri = allocNewPointer(self[Class], PTRTYPE_CLASS)();
    define(self[Alias], {clsptri});
    setPtriParent(clsptri, looPtri(self[Parent], false, 1));
    setPtriResvUint8(clsptri, storage.storeForUint8(self[Alias]));
    updateTextRawString(Class, clsptri);
    $.remove();
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

getter = function(object, props, enumerable = false) {
  var alias, get;
  for (alias in props) {
    get = props[alias];
    break;
  }
  return define(object, alias, {enumerable, get});
};

setter = function(object, props) {
  var alias, set;
  for (alias in props) {
    set = props[alias];
    break;
  }
  return define(object, alias, {set});
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

resv = function(object, alias, size) {
  var quota, start;
  quota = PTR_BYTELENGTH;
  start = PTR_LINKEDi + 4;
  if (object.constructor.byteLength) {
    start = HAS_LENGTH + 4;
  }
  return warn({object, start, quota});
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
  f05: ptriStateNeedsIgnore = function(ptri) {
    return getUint8(ptri + PTR_STATUSi) <= STATE_IGNORE;
  },
  f05: getPtriStatus = function(ptri) {
    return getUint8(ptri + PTR_STATUSi);
  },
  f02: setPtriClassi = function(ptri, stri) {
    setUint8(ptri + PTR_CLASSi, stri);
    return stri;
  },
  f05: getPtriClassi = function(ptri) {
    return getUint8(ptri + PTR_CLASSi);
  },
  f02: setPtriType = function(ptri, type) {
    setUint8(ptri + PTR_TYPEi, type);
    return type;
  },
  f05: getPtriType = function(ptri) {
    return getUint8(ptri + PTR_TYPEi);
  },
  f02: setPtriResvUint8 = function(ptri, byte) {
    setUint8(ptri + PTR_RESVu8, byte);
    return byte;
  },
  f05: getPtriResvUint8 = function(ptri) {
    return getUint8(ptri + PTR_RESVu8);
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
  ___: ptriAllocAndSet = function(ptri, data, view) {
    var blen, byteLength, byteOffset;
    if (!(byteOffset = getByteOffset(ptri))) {
      byteLength = data.byteLength;
      byteOffset = malloc(byteLength);
      setByteLength(ptri, byteLength);
      setByteOffset(ptri, byteOffset);
      setPtriType(ptri, PTRTYPE_DATAPTR);
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
  ___: allocNewPointer = function(OPtr = this, type, state) {
    var blen, clsi, len, ptri;
    ptri = new OPtr(palloc());
    clsi = storage.store(OPtr);
    setPtriClassi(ptri, clsi);
    setPtriStatus(ptri, state || STATE_PALLOC);
    setPtriType(ptri, type || PTRTYPE_HEADER);
    blen = OPtr.byteLength;
    len = OPtr.length;
    return function(byteLength = blen, length = len) {
      var byteOffset;
      if (byteLength) {
        byteOffset = malloc(byteLength);
        setByteOffset(ptri, byteOffset);
        setByteLength(ptri, byteLength);
        setPtriStatus(ptri, STATE_MALLOC);
        setPtriType(ptri, PTRTYPE_DATAPTR);
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
  fff: getterPtriColorAlpha = function(ptri = this, byteOffset = 12) {
    return getPtriColorValue(ptri, byteOffset);
  },
  fff: getterPtriColorBlue = function(ptri = this, byteOffset = 8) {
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
  fff: setterPtriColorAlpha = function(value, byteOffset = 12, ptri = this) {
    return setPtriColorValue(ptri, value, byteOffset);
  },
  fff: setterPtriColorBlue = function(value, byteOffset = 8, ptri = this) {
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
  },
  fff: getterPtriAlias = function(ptri = this) {
    return getterPtriDataAsText(ptri);
  },
  fff: setterPtriAlias = function(data, ptri = this) {
    return updateTextRawString(data, ptri);
  },
  fff: getterPtriLinked = function(ptri = this) {
    return storage[getPtriLinked(ptri)];
  },
  fff: setterPtriLinked = function(data, ptri = this) {
    var stri;
    if (-1 === (stri = storage.indexOf(data))) {
      throw /PROCEDURE_LINKEDCLASS_SETERROR/;
    }
    return setPtriLinked(ptri, stri);
  },
  fff: getterPtriParent = function(ptri = this) {
    var classi, parent;
    parent = getPtriParent(ptri);
    classi = getPtriClassi(parent);
    return new storage[classi](parent);
  },
  fff: setterPtriParent = function(parent, ptri = this) {
    setPtriParent(ptri, parent);
    return parent;
  },
  fff: getterProtocolTest = function(ptri = this) {
    var stri;
    if (!(stri = getUint32(this + PROCEDURE_FILTERER))) {
      return function() {
        return 1;
      };
    }
    return storage[stri];
  },
  fff: setterProtocolTest = function(func, ptri = this) {
    var stri;
    if (-1 === (stri = storage.store(func))) {
      throw /ERROR_ON_PROCEDURE_FILTERER/;
    }
    return setUint32(this + PROCEDURE_FILTERER, stri);
  },
  fff: addPtriChildren = function(child, ptri = this) {
    setPtriParent(child, ptri);
    return ptri;
  },
  fff: looPtri = function(clssi, ptri = this, count = 0, previ = 0, atomic = 0/0) {
    var CHILDREN_NOFILTER, EVERYCLASS_CONSTRUCTED, EVERYCLASS_PTRIs, EVERYTHING, FILTERED_CHILDREN_CONSTRUCTED, FILTERED_CHILDREN_PTRIs, PClass, childi, childs, clsi, counti, length, single;
    single = count === 1;
    childi = (function() {
      if (!atomic) {
        return previ;
      } else if (isNaN(atomic)) {
        throw /ATOMIC_MUSTBEui32/;
      } else {
        return Atomics.add(u32, atomic, POINTER_BYTELENGTH);
      }
    })();
    EVERYTHING = Boolean(!ptri && !clssi);
    EVERYCLASS_PTRIs = Boolean(!ptri && clssi && !isNaN(clssi));
    EVERYCLASS_CONSTRUCTED = Boolean(!ptri && clssi && clssi instanceof Function);
    CHILDREN_NOFILTER = Boolean(ptri && !clssi);
    FILTERED_CHILDREN_PTRIs = Boolean(ptri && clssi && !isNaN(clssi));
    FILTERED_CHILDREN_CONSTRUCTED = Boolean(ptri && clssi && clssi instanceof Function);
    if (!!clssi) {
      clsi = (function() {
        if (clssi instanceof Function) {
          return storage.indexOf(PClass = clssi);
        } else if (false === isNaN(clssi)) {
          return clssi;
        } else {
          throw /UNDEFINED_ERROR_FILTER/;
        }
      })();
    }
    length = 0;
    childs = new Collection;
    counti = Atomics.load(u32);
    switch (true) {
      case EVERYTHING:
        while (childi < counti) {
          childi = childi + PTR_BYTELENGTH;
          if (ptriStateNeedsIgnore(childi)) {
            continue;
          }
          PClass = storage[getPtriClassi(childi)];
          childs[length++] = new PClass(childi);
          if (!--count) {
            break;
          }
        }
        break;
      case EVERYCLASS_PTRIs:
        while (childi < counti) {
          childi = childi + PTR_BYTELENGTH;
          if (clsi - getPtriClassi(childi)) {
            continue;
          }
          if (ptriStateNeedsIgnore(childi)) {
            continue;
          }
          childs[length++] = childi;
          if (!--count) {
            break;
          }
        }
        break;
      case EVERYCLASS_CONSTRUCTED:
        while (childi < counti) {
          childi = childi + PTR_BYTELENGTH;
          if (clsi - getPtriClassi(childi)) {
            continue;
          }
          if (ptriStateNeedsIgnore(childi)) {
            continue;
          }
          childs[length++] = new PClass(childi);
          if (!--count) {
            break;
          }
        }
        break;
      case CHILDREN_NOFILTER:
        while (childi < counti) {
          childi = childi + PTR_BYTELENGTH;
          if (ptriStateNeedsIgnore(childi)) {
            continue;
          }
          if (ptri - getPtriParent(childi)) {
            continue;
          }
          PClass = storage[getPtriClassi(childi)];
          childs[length++] = new PClass(childi);
          if (!--count) {
            break;
          }
        }
        break;
      case FILTERED_CHILDREN_PTRIs:
        while (childi < counti) {
          childi = childi + PTR_BYTELENGTH;
          if (clsi - getPtriClassi(childi)) {
            continue;
          }
          if (ptriStateNeedsIgnore(childi)) {
            continue;
          }
          if (ptri - getPtriParent(childi)) {
            continue;
          }
          childs[length++] = childi;
          if (!--count) {
            break;
          }
        }
        break;
      case FILTERED_CHILDREN_CONSTRUCTED:
        while (childi < counti) {
          childi = childi + PTR_BYTELENGTH;
          if (clsi - getPtriClassi(childi)) {
            continue;
          }
          if (ptriStateNeedsIgnore(childi)) {
            continue;
          }
          if (ptri - getPtriParent(childi)) {
            continue;
          }
          childs[length++] = new PClass(childi);
          if (!--count) {
            break;
          }
        }
        break;
      default:
        throw /UNDEFINED_FILDER/;
    }
    if (single) {
      return childs[0];
    } else {
      return childs;
    }
  },
  fff: getterMeshPosition = function(ptri = this) {
    return looPtri(Position, this, 1);
  },
  fff: setterMeshPosition = function(position, ptri = this) {
    return 1;
  },
  fff: getterPtrCAlias = function(ptri = this) {
    return getterPtriDataAsText(ptri);
  },
  fff: getterPtrCKeyName = function(ptri = this) {
    var alias;
    alias = getterPtrCAlias(ptri);
    return alias[0].toLowerCase() + alias.substring(1);
  },
  fff: getterPtrCClass = function(ptri = this) {
    return storage[getPtriClassi(ptri)];
  },
  fff: getterPtrCParent = function(ptri = this) {
    var ptrj;
    if (!(ptrj = getPtriParent(ptri))) {
      return new OPtr(0);
    }
    return new storage[getPtriClassi(ptrj)](ptrj);
  },
  fff: findPtriClassPointer = function(ptri = this) {
    var clsi;
    clsi = getPtriClassi(ptri);
    return looPtri().find(function(clsptri) {
      return 0 === clsi - getPtriResvUint8(clsptri);
    });
  }
};

//? helpers ----->
storage.storeForUint8(OPtr);

info(storage);

define({
  Pointer: OPtr
});

define({
  OffsetPointer: Pointer
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
  Mesh: Pointer
});

define({
  Vertices: Pointer
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

getter(OPtr, {
  alloc: allocNewPointer
});

define(Pointer, {
  isClass: true
});

define(Mesh, {
  byteLength: 8 * 4
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

define(Mesh, {
  TypedArray: Float32Array
});

define(Pointer.prototype, {
  isPointer: true
});

define(ClassPointer.prototype, {
  getAlias: getterPtrCAlias
});

define(ClassPointer.prototype, {
  getKeyName: getterPtrCKeyName
});

define(ClassPointer.prototype, {
  getPrototype: getterPtrCClass
});

define(ClassPointer.prototype, {
  getParent: getterPtrCParent
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

define(Procedure.prototype, {
  getAlias: getterPtriAlias
});

define(Procedure.prototype, {
  setAlias: setterPtriAlias
});

define(Procedure.prototype, {
  addProtocol: addPtriChildren
});

define(Procedure.prototype, {
  getProtocols: function() {
    return looPtri(Protocol, this);
  }
});

define(Protocol.prototype, {
  getFilterer: getterProtocolTest
});

define(Protocol.prototype, {
  setFilterer: setterProtocolTest
});

define(Protocol.prototype, {
  getLinkedClass: getterPtriLinked
});

define(Protocol.prototype, {
  setLinkedClass: setterPtriLinked
});

define(Protocol.prototype, {
  setProcedure: setterPtriParent
});

getter(Protocol.prototype, {
  procedure: getterPtriParent
});

define(Protocol.prototype, {
  getMatchs: function() {
    return looPtri(this.linkedClass).filter(this.filterer);
  }
});

resv(Mesh.prototype, {
  position: 4
});

resv(Mesh.prototype, {
  rotation: 4
});

resv(Mesh.prototype, {
  scale: 4
});

define(Mesh.prototype, {
  getPosition: getterMeshPosition
});

define(Mesh.prototype, {
  setPosition: setterMeshPosition
});

storage.store(Color);

//? finish ---->
(REDEFINEPTR = function() {
  var Alias, BYTES_PER_ELEMENT, Class, TypedArray, alias, byteLength, cache, d, desc, descs, get, j, kProto, len1, length, prop, set, subarray;
  for (j = 0, len1 = storage.length; j < len1; j++) {
    Class = storage[j];
    if (Pointer.isPrototypeOf(Class) && ClassPointer !== Class) {
      if (!ClassPointer.isPrototypeOf(Class)) {
        if (!hasOwn(Class.prototype, kProto = "{{Prototype}}")) {
          define(Class.prototype, [kProto], {
            get: findPtriClassPointer
          });
        }
      }
    }
    descs = getOwn(Class.prototype);
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
    define(Class, {length, BYTES_PER_ELEMENT});
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
            },
            state: {
              get: () => {
                return getPtriStatus(this);
              }
            },
            hitStatePalloc: {
              get: () => {
                return setPtriStatus(this, STATE_PALLOC);
              }
            },
            hitStateMalloc: {
              get: () => {
                return setPtriStatus(this, STATE_MALLOC);
              }
            },
            hitStateIgnore: {
              get: () => {
                return setPtriStatus(this, STATE_IGNORE);
              }
            }
          });
        }
      }
    });
  }
  return 0;
})();

(CLEARPROTOS = function() {
  var j, k, len1, len2, len3, len4, m, n, p, ref, ref1, ref2, ref3;
  ref = "isFinite isInteger isNaN isSafeInteger parseFloat parseInt".split(/\n|\s+/g);
  for (j = 0, len1 = ref.length; j < len1; j++) {
    p = ref[j];
    Reflect.deleteProperty(Number, p);
  }
  ref1 = "toExponential toLocaleString toPrecision toFixed".split(/\n|\s+/g);
  for (k = 0, len2 = ref1.length; k < len2; k++) {
    p = ref1[k];
    Reflect.deleteProperty(Number.prototype, p);
  }
  ref2 = "assign create entries freeze fromEntries getOwnPropertyDescriptor getOwnPropertyNames getOwnPropertySymbols getPrototypeOf groupBy hasOwn is isExtensible isFrozen isSealed keys preventExtensions seal setPrototypeOf values".split(/\n|\s+/g);
  for (m = 0, len3 = ref2.length; m < len3; m++) {
    p = ref2[m];
    Reflect.deleteProperty(Object, p);
  }
  ref3 = "__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ propertyIsEnumerable toLocaleString hasOwnProperty isPrototypeOf".split(/\n|\s+/g);
  for (n = 0, len4 = ref3.length; n < len4; n++) {
    p = ref3[n];
    Reflect.deleteProperty(Object.prototype, p);
  }
  return 0;
})();

//? test ---->

//do  tick = ->
//    requestAnimationFrame tick
queueMicrotask(() => {
  var clr, mesh, pos, procedure, protocol, protocol2;
  pos = new Position.alloc();
  clr = new Color.alloc();
  procedure = new Procedure.alloc().set("on?");
  protocol = new Protocol.alloc();
  protocol2 = new Protocol.alloc();
  mesh = new Mesh.alloc();
  procedure.addProtocol(protocol);
  procedure.addProtocol(protocol2);
  log({procedure, pos, clr, protocol, protocol2});
  warn(mesh);
  protocol.linkedClass = Position;
  protocol.filterer = function(ptri) {
    return 2 === getPtriClassi(ptri);
  };
  protocol2.linkedClass = Color;
  return protocol2.filterer = function(ptri) {
    return 3 === getPtriClassi(ptri);
  };
});

//error "protocol.match(pos):", protocol.match( pos )
//error "protocol.match(clr):", protocol.match( clr )
