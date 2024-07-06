var ALLOCALIGN_BYTELENGTH, BYTEOFFSET_BYTELENGTH, BYTEOFFSET_BYTEOFFSET, BYTEOFFSET_CLASSINDEX, BYTEOFFSET_PARENTPTRI, BYTEOFFSET_RESVOFFSET, BYTEOFFSET_SCOPEINDEX, PTRHEADERS_BYTELENGTH, addByteLength, addRsvAsUint8, andRsvAsUint8, atomic, bu8, buf, bvw, byteToInteger, bytesToString, dvw, error, getByteLength, getByteOffset, getClassIndex, getParentPtri, getRsvAsInt16, getRsvAsInt32, getRsvAsUint8, getScopeIndex, hitRsvAsUint8, i32, iLE, integerToByte, log, malloc, offset, palloc, sab, scopei, scp, setByteLength, setByteOffset, setClassIndex, setParentPtri, setRsvAsInt16, setRsvAsInt32, setRsvAsUint8, setScopeIndex, stringToBytes, subRsvAsUint8, ui8, warn;

({log, warn, error} = console);

iLE = new Uint8Array(Uint32Array.of(1).buffer).at(0);

buf = new ArrayBuffer(4e4);

dvw = new DataView(buf);

i32 = new Int32Array(buf);

ui8 = new Uint8Array(buf);

scp = new Array(void 0);

sab = new ArrayBuffer(4e5);

bvw = new DataView(sab);

bu8 = new Uint8Array(sab);

ALLOCALIGN_BYTELENGTH = +4;

PTRHEADERS_BYTELENGTH = -4;

//? 0 <-- BYTEOFFSET_RESVOFFSET
BYTEOFFSET_RESVOFFSET = PTRHEADERS_BYTELENGTH += 4;

getRsvAsUint8 = function(ptri = this) {
  return Atomics.load(ui8, ptri);
};

hitRsvAsUint8 = function(ival = 1, ptri = this) {
  return !Atomics.or(ui8, ptri, ival);
};

addRsvAsUint8 = function(ival = 1, ptri = this) {
  return Atomics.add(ui8, ptri, ival);
};

subRsvAsUint8 = function(ival = 1, ptri = this) {
  return Atomics.sub(ui8, ptri, ival);
};

andRsvAsUint8 = function(ival = 1, ptri = this) {
  return Atomics.and(ui8, ptri, ival);
};

setRsvAsUint8 = function(ival = 0, ptri = this) {
  return Atomics.store(ui8, ptri, ival);
};

getRsvAsInt32 = function(ptri = this) {
  return dvw.getInt32(ptri + BYTEOFFSET_RESVOFFSET, iLE);
};

setRsvAsInt32 = function(ival = 0, ptri = this) {
  dvw.setInt32(ptri + BYTEOFFSET_RESVOFFSET, ival, iLE);
  return ival;
};

getRsvAsInt16 = function(ptri = this) {
  return dvw.getInt16(ptri + BYTEOFFSET_RESVOFFSET, iLE);
};

setRsvAsInt16 = function(ival = 0, ptri = this) {
  dvw.setInt16(ptri + BYTEOFFSET_RESVOFFSET, ival, iLE);
  return ival;
};

BYTEOFFSET_CLASSINDEX = PTRHEADERS_BYTELENGTH += 4;

getClassIndex = function(ptri = this) {
  return dvw.getInt32(ptri + BYTEOFFSET_CLASSINDEX, iLE);
};

setClassIndex = function(ival, ptri = this) {
  return dvw.setInt32(ptri + BYTEOFFSET_CLASSINDEX, ival, iLE);
};

BYTEOFFSET_SCOPEINDEX = PTRHEADERS_BYTELENGTH += 4;

getScopeIndex = function(ptri = this) {
  return dvw.getInt32(ptri + BYTEOFFSET_SCOPEINDEX, iLE);
};

setScopeIndex = function(ival, ptri = this) {
  return dvw.setInt32(ptri + BYTEOFFSET_SCOPEINDEX, ival, iLE);
};

BYTEOFFSET_PARENTPTRI = PTRHEADERS_BYTELENGTH += 4;

getParentPtri = function(ptri = this) {
  return dvw.getInt32(ptri + BYTEOFFSET_PARENTPTRI, iLE);
};

setParentPtri = function(ival, ptri = this) {
  return dvw.setInt32(ptri + BYTEOFFSET_PARENTPTRI, ival, iLE);
};

BYTEOFFSET_BYTEOFFSET = PTRHEADERS_BYTELENGTH += 4;

getByteOffset = function(ptri = this) {
  return dvw.getInt32(ptri + BYTEOFFSET_BYTEOFFSET, iLE);
};

setByteOffset = function(ival, ptri = this) {
  return dvw.setInt32(ptri + BYTEOFFSET_BYTEOFFSET, ival, iLE);
};

BYTEOFFSET_BYTELENGTH = PTRHEADERS_BYTELENGTH += 4;

getByteLength = function(ptri = this) {
  return dvw.getInt32(ptri + BYTEOFFSET_BYTELENGTH, iLE);
};

setByteLength = function(ival, ptri = this) {
  return dvw.setInt32(ptri + BYTEOFFSET_BYTELENGTH, ival, iLE);
};

addByteLength = function(ival, ptri = this) {
  var pval;
  pval = getByteLength(ptri);
  setByteLength(ival + pval, ptri);
  return pval;
};

PTRHEADERS_BYTELENGTH += 4;

stringToBytes = TextEncoder.prototype.encode.bind(new TextEncoder);

bytesToString = TextDecoder.prototype.decode.bind(new TextDecoder);

integerToByte = function(ival) {
  return new Uint8Array(Int32Array.of(Number(ival)).buffer);
};

byteToInteger = function(data) {
  return new Int32Array(data.slice().buffer)[0];
};

atomic = Int32Array.of(PTRHEADERS_BYTELENGTH, PTRHEADERS_BYTELENGTH);

palloc = Atomics.add.bind(Atomics, atomic, 0, PTRHEADERS_BYTELENGTH);

malloc = Atomics.add.bind(Atomics, atomic, 1);

offset = Atomics.load.bind(Atomics, atomic, 0);

scopei = function(any) {
  var i;
  if (-1 === (i = scp.indexOf(any))) {
    return i += scp.push(any);
  } else {
    i;
    return i;
  }
};

export var Pointer = (function() {
  class Pointer extends Number {
    static defineProperty() {
      return this.classPointer.defineProperty(...arguments);
    }

    static definePointer() {
      return this.classPointer.definePointer(...arguments);
    }

    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return Pointer.of(this.getInt32(byteOffset));
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function(value) {
        if (!(value instanceof Pointer)) {
          throw /PTRSET_ERR/;
        }
        return this.setInt32(byteOffset, value);
      };
    }

    constructor(ptri) {
      super(ptri).onconstruct();
    }

    onconstruct() {
      return this;
    }

    onallocate() {
      return this;
    }

    getUint8(byteOffset = 0) {
      return bvw.getUint8(getByteOffset(this) + byteOffset);
    }

    setUint8(byteOffset = 0, value = 0) {
      bvw.setUint8(getByteOffset(this) + byteOffset, value);
      return value;
    }

    loadUint8(byteOffset = 0) {
      return Atomics.load(bu8, getByteOffset(this) + byteOffset);
    }

    storeUint8(byteOffset = 0, value = 0) {
      return Atomics.store(bu8, getByteOffset(this) + byteOffset, value);
    }

    getInt16(byteOffset = 0) {
      return bvw.getInt16(getByteOffset(this) + byteOffset, iLE);
    }

    setInt16(byteOffset = 0, value = 0) {
      bvw.setInt16(getByteOffset(this) + byteOffset, value, iLE);
      return value;
    }

    getUint16(byteOffset = 0) {
      return bvw.getUint16(getByteOffset(this) + byteOffset, iLE);
    }

    setUint16(byteOffset = 0, value = 0) {
      bvw.setUint16(getByteOffset(this) + byteOffset, value, iLE);
      return value;
    }

    getUint32(byteOffset = 0) {
      return bvw.getUint32(getByteOffset(this) + byteOffset, iLE);
    }

    setUint32(byteOffset = 0, value = 0) {
      bvw.setUint32(getByteOffset(this) + byteOffset, value, iLE);
      return value;
    }

    getInt32(byteOffset = 0) {
      return bvw.getInt32(getByteOffset(this) + byteOffset, iLE);
    }

    setInt32(byteOffset = 0, value = 0) {
      bvw.setInt32(getByteOffset(this) + byteOffset, value, iLE);
      return value;
    }

    getFloat32(byteOffset = 0) {
      return bvw.getFloat32(getByteOffset(this) + byteOffset, iLE);
    }

    setFloat32(byteOffset = 0, value = 0) {
      bvw.setFloat32(getByteOffset(this) + byteOffset, value, iLE);
      return value;
    }

    appendChild(ptri) {
      setParentPtri(this, ptri);
      return ptri;
    }

    append(ptri) {
      setParentPtri(this, ptri);
      return this;
    }

    static of(ptri) {
      var classIndex;
      if (ptri) {
        if (classIndex = getClassIndex(ptri)) {
          return new scp[classIndex](ptri);
        }
        return 0;
      }
      return 0;
    }

    static new(byteLength) {
      var clsp, mod, ptri;
      if (!byteLength) {
        byteLength = (clsp = this.classPointer) ? clsp.byteLength : this.byteLength;
      }
      ptri = palloc();
      if (byteLength) {
        setByteLength(byteLength, ptri);
        if (mod = byteLength % ALLOCALIGN_BYTELENGTH) {
          byteLength += ALLOCALIGN_BYTELENGTH - mod;
        }
        setByteOffset(malloc(byteLength), ptri);
      }
      setClassIndex(scopei(this), ptri);
      return Object.setPrototypeOf(new Pointer(ptri), this.prototype);
    }

    filter(testFn) {
      var childs, count, ptri, ptrj;
      childs = [];
      count = 0;
      ptri = +this;
      ptrj = offset();
      while (ptrj -= PTRHEADERS_BYTELENGTH) {
        if (!(ptri - getParentPtri(ptrj))) {
          ptrj = Pointer.of(ptrj);
          if (!testFn || testFn(ptrj, count)) {
            childs[count++] = ptrj;
          }
        }
      }
      return childs;
    }

    find(testFn) {
      var ptri, ptrj;
      ptri = +this;
      ptrj = offset();
      while (ptrj -= PTRHEADERS_BYTELENGTH) {
        if (!(ptri - getParentPtri(ptrj))) {
          ptrj = Pointer.of(ptrj);
          if (testFn(ptrj)) {
            return ptrj;
          }
        }
      }
      return null;
    }

    resize(byteLength = 0, dataBackup = true) {
      var TypedArray, byteOffset, length, mod, subarray;
      throw "resize";
      TypedArray = this.constructor.TypedArray;
      length = byteLength / TypedArray.BYTES_PER_ELEMENT;
      if (dataBackup) {
        dataBackup = this.subarray().slice(0, length);
      }
      byteOffset = malloc(byteLength);
      if (mod = byteOffset % ALLOCALIGN_BYTELENGTH) {
        malloc(ALLOCALIGN_BYTELENGTH - mod);
        byteOffset += mod;
      }
      setByteLength(byteLength, this);
      setByteOffset(byteOffset, this);
      if (dataBackup) {
        subarray = new TypedArray(sab, byteOffset, length);
        subarray.set(dataBackup);
      }
      return this;
    }

    set(arrayLike, index = 0) {
      this.subarray().set(arrayLike, index);
      return this;
    }

    subarray(byteOffset = 0, byteLength, TypedArray) {
      var length;
      TypedArray || (TypedArray = this.constructor.TypedArray);
      byteOffset += getByteOffset(this);
      byteLength || (byteLength = getByteLength(this));
      length = byteLength / TypedArray.BYTES_PER_ELEMENT;
      return new TypedArray(sab, byteOffset, length);
    }

    toPrimitive() {
      return this.subarray();
    }

    toString() {
      return this.toPrimitive().toString();
    }

  };

  Pointer.byteLength = 4;

  Pointer.TypedArray = Uint8Array;

  Pointer.prototype.buffer = bvw.buffer;

  return Pointer;

}).call(this);

Object.defineProperties(Pointer.prototype, {
  hitRsvAsUint8: {
    value: hitRsvAsUint8
  },
  getRsvAsUint8: {
    value: getRsvAsUint8
  },
  setRsvAsUint8: {
    value: setRsvAsUint8
  },
  andRsvAsUint8: {
    value: andRsvAsUint8
  },
  subRsvAsUint8: {
    value: subRsvAsUint8
  },
  addRsvAsUint8: {
    value: addRsvAsUint8
  },
  getRsvAsInt32: {
    value: getRsvAsInt32
  },
  setRsvAsInt32: {
    value: setRsvAsInt32
  },
  getRsvAsInt16: {
    value: getRsvAsInt16
  },
  setRsvAsInt16: {
    value: setRsvAsInt16
  }
});

Object.defineProperty(Pointer.prototype, "#primitive", {
  get: function() {
    return this.toPrimitive();
  }
});

Object.defineProperty(Pointer.prototype, "{{Dump}}", {
  get: function() {
    return {
      bufferData: this.subarray(),
      byteLength: getByteLength(this),
      byteOffset: getByteOffset(this),
      classIndex: getClassIndex(this),
      classProto: scp[getClassIndex(this)],
      scopeIndex: getScopeIndex(this),
      scopedItem: scp[getScopeIndex(this)],
      ptriOffset: this * 1,
      headerData: new Int32Array(buf, this, 6),
      TypedArray: this.constructor.TypedArray.name
    };
  }
});

export var TypedArrayPointer = class TypedArrayPointer extends Pointer {
  static getter(propertyName, desc = {}) {
    var TypedArray, byteLength, byteOffset;
    byteOffset = desc.byteOffset;
    byteLength = desc.byteLength;
    TypedArray = this.TypedArray;
    return function() {
      return this.subarray(byteOffset, byteLength, TypedArray);
    };
  }

  static setter(propertyName, desc = {}) {
    return function() {
      return this[propertyName].set(...arguments);
    };
  }

};

export var Uint8ArrayPointer = (function() {
  class Uint8ArrayPointer extends TypedArrayPointer {};

  Uint8ArrayPointer.TypedArray = Uint8Array;

  return Uint8ArrayPointer;

}).call(this);

export var Int16ArrayPointer = (function() {
  class Int16ArrayPointer extends TypedArrayPointer {};

  Int16ArrayPointer.TypedArray = Int16Array;

  return Int16ArrayPointer;

}).call(this);

export var Uint16ArrayPointer = (function() {
  class Uint16ArrayPointer extends TypedArrayPointer {};

  Uint16ArrayPointer.TypedArray = Uint16Array;

  return Uint16ArrayPointer;

}).call(this);

export var Int32ArrayPointer = (function() {
  class Int32ArrayPointer extends TypedArrayPointer {};

  Int32ArrayPointer.TypedArray = Int32Array;

  return Int32ArrayPointer;

}).call(this);

export var Uint32ArrayPointer = (function() {
  class Uint32ArrayPointer extends TypedArrayPointer {};

  Uint32ArrayPointer.TypedArray = Uint32Array;

  return Uint32ArrayPointer;

}).call(this);

export var Float32ArrayPointer = (function() {
  class Float32ArrayPointer extends TypedArrayPointer {};

  Float32ArrayPointer.TypedArray = Float32Array;

  return Float32ArrayPointer;

}).call(this);

export var Vector2Pointer = (function() {
  class Vector2Pointer extends Float32ArrayPointer {};

  Vector2Pointer.byteLength = 4 * 2;

  return Vector2Pointer;

}).call(this);

export var Vector3Pointer = (function() {
  class Vector3Pointer extends Float32ArrayPointer {};

  Vector3Pointer.byteLength = 4 * 3;

  return Vector3Pointer;

}).call(this);

export var Vector4Pointer = (function() {
  class Vector4Pointer extends Float32ArrayPointer {};

  Vector4Pointer.byteLength = 4 * 4;

  return Vector4Pointer;

}).call(this);

export var Matrix2Pointer = (function() {
  class Matrix2Pointer extends Float32ArrayPointer {};

  Matrix2Pointer.byteLength = 4 * 2 * 2;

  return Matrix2Pointer;

}).call(this);

export var Matrix3Pointer = (function() {
  class Matrix3Pointer extends Float32ArrayPointer {};

  Matrix3Pointer.byteLength = 4 * 3 * 3;

  return Matrix3Pointer;

}).call(this);

export var Matrix4Pointer = (function() {
  class Matrix4Pointer extends Float32ArrayPointer {};

  Matrix4Pointer.byteLength = 4 * 4 * 4;

  return Matrix4Pointer;

}).call(this);

export var NumberPointer = class NumberPointer extends Pointer {
  static from(value = 0) {
    return this.new().set(value);
  }

};

export var Float32Number = (function() {
  class Float32Number extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.getFloat32(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.setFloat32(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.setFloat32(0, value);
      return this;
    }

    toPrimitive() {
      return this.getFloat32(0);
    }

  };

  Float32Number.byteLength = 4 * 1;

  Float32Number.TypedArray = Float32Array;

  return Float32Number;

}).call(this);

export var Int32Number = (function() {
  class Int32Number extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.getInt32(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.setInt32(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.setInt32(0, value);
      return this;
    }

    toPrimitive() {
      return this.getInt32(0);
    }

  };

  Int32Number.byteLength = 4;

  Int32Number.TypedArray = Int32Array;

  return Int32Number;

}).call(this);

export var Uint32Number = (function() {
  class Uint32Number extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.getUint32(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.setUint32(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.setUint32(0, value);
      return this;
    }

    toPrimitive() {
      return this.getUint32(0);
    }

  };

  Uint32Number.byteLength = 4;

  Uint32Number.TypedArray = Uint32Array;

  return Uint32Number;

}).call(this);

export var Int16Number = (function() {
  class Int16Number extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.getInt16(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.setInt16(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.setInt16(0, value);
      return this;
    }

    toPrimitive() {
      return this.getInt16(0);
    }

  };

  Int16Number.byteLength = 2;

  Int16Number.TypedArray = Int16Array;

  return Int16Number;

}).call(this);

export var Uint16Number = (function() {
  class Uint16Number extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.getUint16(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.setUint16(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.setUint16(0, value);
      return this;
    }

    toPrimitive() {
      return this.getUint16(0);
    }

  };

  Uint16Number.byteLength = 2;

  Uint16Number.TypedArray = Uint16Array;

  return Uint16Number;

}).call(this);

export var Uint8Number = (function() {
  class Uint8Number extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.getUint8(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.setUint8(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.setUint8(0, value);
      return this;
    }

    toPrimitive() {
      return this.getUint8(0);
    }

  };

  Uint8Number.byteLength = 1;

  Uint8Number.TypedArray = Uint8Array;

  return Uint8Number;

}).call(this);

export var Uint8AtomicNumber = (function() {
  class Uint8AtomicNumber extends NumberPointer {
    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.loadUint8(byteOffset);
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return this.storeUint8(byteOffset, arguments[0]);
      };
    }

    set(value = 0) {
      this.storeUint8(0, value);
      return this;
    }

    toPrimitive() {
      return this.loadUint8(0);
    }

  };

  Uint8AtomicNumber.byteLength = 1;

  Uint8AtomicNumber.TypedArray = Uint8Array;

  return Uint8AtomicNumber;

}).call(this);

export var BooleanAtomic = class BooleanAtomic extends Uint8AtomicNumber {
  static getter(propertyName, desc = {}) {
    var byteOffset;
    byteOffset = desc.byteOffset;
    return function() {
      return Boolean(this.loadUint8(byteOffset));
    };
  }

  static setter(propertyName, desc = {}) {
    var byteOffset;
    byteOffset = desc.byteOffset;
    return function() {
      return Boolean(this.storeUint8(byteOffset, arguments[0]));
    };
  }

  toPrimitive() {
    return Boolean(super.toPrimitive());
  }

};

export var StringPointer = (function() {
  class StringPointer extends Pointer {
    static from(string = "") {
      var byteArray;
      byteArray = stringToBytes(string);
      return this.new(byteArray.byteLength).set(byteArray);
    }

    toPrimitive() {
      return bytesToString(this.subarray().slice());
    }

    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return StringPointer.of(this.getInt32(byteOffset));
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function(value = "") {
        if (typeof value === "string") {
          value = StringPointer.from(value);
        }
        if (!(value instanceof StringPointer)) {
          throw /STRSET_ERR/;
        }
        return this.setInt32(byteOffset, value);
      };
    }

    set(value = "") {
      var nextLength, thisLength, valueArray;
      if (typeof value === "string") {
        value = stringToBytes(value);
      }
      if (!(value instanceof Uint8Array)) {
        throw /ERRSTRSET/;
      }
      valueArray = this.subarray();
      thisLength = getByteLength(this);
      nextLength = value.byteLength;
      if (nextLength - thisLength) {
        if (nextLength < thisLength) {
          setByteLength(nextLength, this);
          valueArray.fill(0);
        } else {
          this.resize(nextLength, null);
          valueArray = this.subarray();
        }
      }
      valueArray.set(value);
      return this;
    }

  };

  StringPointer.TypedArray = Uint8Array;

  StringPointer.byteLength = 4;

  return StringPointer;

}).call(this);

export var ObjectPointer = class ObjectPointer extends Pointer {
  static from(object) {
    var ptri;
    ptri = this.new().set(object);
    ptri.onallocate();
    return ptri;
  }

  toPrimitive() {
    return scp[getScopeIndex(this)];
  }

  set(object) {
    if (!isNaN(object)) {
      object = scp[object];
    }
    setScopeIndex(scopei(object), this);
    return this;
  }

};

Object.defineProperty(ObjectPointer.prototype, "children", {
  enumerable: true,
  configurable: true,
  get: Pointer.prototype.filter
});

Object.defineProperty(ObjectPointer.prototype, "parent", {
  enumerable: true,
  configurable: true,
  get: function() {
    return Pointer.of(getParentPtri(this));
  }
});

export var Property = (function() {
  class Property extends Pointer {
    static from(propertyName, desc = {}) {
      var byteLength, byteOffset, length, ptri;
      ({byteLength, byteOffset, length} = desc);
      ptri = this.new();
      ptri.description = desc;
      ptri.length = Int32Number.from(length);
      ptri.byteLength = Int32Number.from(byteLength);
      ptri.byteOffset = Int32Number.from(byteOffset);
      ptri.name = StringPointer.from(propertyName);
      return ptri;
    }

  };

  Property.byteLength = 20;

  return Property;

}).call(this);

export var ClassPointer = (function() {
  class ClassPointer extends ObjectPointer {
    static from(Class) {
      var proto, ptri;
      ptri = super.from(Class);
      ptri.name = StringPointer.from(Class.name);
      proto = Object.getPrototypeOf(Class);
      if (proto !== ObjectPointer) {
        proto.classPointer.appendChild(ptri);
      }
      return ptri;
    }

    static getter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function() {
        return scp[this.getInt32(byteOffset)];
      };
    }

    static setter(propertyName, desc = {}) {
      var byteOffset;
      byteOffset = desc.byteOffset;
      return function(value) {
        return this.setInt32(byteOffset, scopei(value));
      };
    }

    getAllocLength() {
      var byteLength, j, len, o, parent, ref;
      byteLength = 0;
      ref = this.filter(function(i) {
        return i instanceof Property;
      });
      for (j = 0, len = ref.length; j < len; j++) {
        o = ref[j];
        byteLength += o.byteLength.toPrimitive();
      }
      if (parent = this.parent) {
        byteLength += parent.getAllocLength();
      }
      return byteLength;
    }

    defineProperty(propertyName, desc = {}) {
      desc.byteLength = Number(desc.byteLength);
      desc.byteOffset = this.getAllocLength();
      desc.length || (desc.length = desc.byteLength);
      this.appendChild(Property.from(propertyName, desc));
      desc.get && (desc.get = desc.get(propertyName, desc));
      desc.set && (desc.set = desc.set(propertyName, desc));
      desc.value && (desc.value = desc.value(propertyName, desc));
      Object.defineProperty(this.class.prototype, propertyName, desc);
      return this;
    }

    definePointer(propertyName, desc = {}) {
      var byteLength;
      desc.get || (desc.get = desc.instanceOf.getter);
      desc.set || (desc.set = desc.instanceOf.setter);
      if (byteLength = desc.instanceOf.byteLength) {
        desc.byteLength || (desc.byteLength = byteLength);
      }
      desc.length || (desc.length = desc.byteLength / desc.instanceOf.TypedArray.BYTES_PER_ELEMENT);
      desc.byteLength || (desc.byteLength = desc.length * desc.instanceOf.TypedArray.BYTES_PER_ELEMENT);
      return this.defineProperty(propertyName, desc);
    }

  };

  ClassPointer.byteLength = 4;

  return ClassPointer;

}).call(this);

Object.defineProperty(ClassPointer.prototype, "class", {
  enumerable: true,
  get: function() {
    return this.toPrimitive();
  }
});

Object.defineProperty(ClassPointer.prototype, "name", {
  enumerable: true,
  get: function() {
    return new StringPointer(this.getUint32(0));
  },
  set: function() {
    return this.setUint32(0, arguments[0]);
  }
});

Object.defineProperty(ClassPointer.prototype, "byteLength", {
  enumerable: true,
  get: function() {
    return this.getAllocLength();
  }
});

Object.defineProperty(Property.prototype, "byteLength", {
  enumerable: true,
  get: function() {
    return new Int32Number(this.getUint32(0));
  },
  set: function() {
    return this.setUint32(0, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "byteOffset", {
  enumerable: true,
  get: function() {
    return new Int32Number(this.getUint32(4));
  },
  set: function() {
    return this.setUint32(4, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "length", {
  enumerable: true,
  get: function() {
    return new Int32Number(this.getUint32(8));
  },
  set: function() {
    return this.setUint32(8, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "description", {
  enumerable: true,
  get: function() {
    return scp[this.getUint32(12)];
  },
  set: function() {
    return this.setUint32(12, scopei(arguments[0]));
  }
});

Object.defineProperty(Property.prototype, "parent", {
  enumerable: true,
  get: function() {
    return Pointer.of(getParentPtri(this));
  }
});

Object.defineProperty(Property.prototype, "name", {
  enumerable: true,
  get: function() {
    return new StringPointer(this.getUint32(16));
  },
  set: function() {
    return this.setUint32(16, arguments[0]);
  }
});
