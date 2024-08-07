var ALLOCALIGN_BYTELENGTH, BYTEOFFSET_BYTELENGTH, BYTEOFFSET_BYTEOFFSET, BYTEOFFSET_CLASSINDEX, BYTEOFFSET_PARENTPTRI, BYTEOFFSET_RESVOFFSET, BYTEOFFSET_SCOPEINDEX, PTRHEADERS_BYTELENGTH, addByteLength, addRsvAsUint8, andRsvAsUint8, byteToInteger, bytesToString, debug, error, getByteLength, getByteOffset, getClassIndex, getParentPtri, getRsvAsInt16, getRsvAsInt32, getRsvAsUint8, getScopeIndex, hitRsvAsUint8, integerToByte, log, malloc, offset, palloc, scopei, setByteLength, setByteOffset, setClassIndex, setParentPtri, setRsvAsInt16, setRsvAsInt32, setRsvAsUint8, setScopeIndex, stringToBytes, subRsvAsUint8, warn;

({log, warn, error, debug} = console);

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

atomic[0] || (atomic[0] = PTRHEADERS_BYTELENGTH);

atomic[1] || (atomic[1] = PTRHEADERS_BYTELENGTH);

palloc = Atomics.add.bind(Atomics, atomic, 0, PTRHEADERS_BYTELENGTH);

malloc = Atomics.add.bind(Atomics, atomic, 1);

offset = Atomics.load.bind(Atomics, atomic, 0);

scopei = function(any) {
  var i;
  if (-1 === (i = scp.indexOf(any))) {
    i += scp.push(any);
  }
  return i;
};

export var Pointer = (function() {
  class Pointer extends Number {
    static defineProperty() {
      return this.classPointer.defineProperty(...arguments);
    }

    static definePointer() {
      return this.classPointer.definePointer(...arguments);
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

    getInt8(byteOffset = 0) {
      return bvw.getInt8(getByteOffset(this) + byteOffset);
    }

    setInt8(byteOffset = 0, value = 0) {
      bvw.setInt8(getByteOffset(this) + byteOffset, value);
      return value;
    }

    loadUint8(byteOffset = 0) {
      return Atomics.load(bu8, getByteOffset(this) + byteOffset);
    }

    storeUint8(byteOffset = 0, value = 0) {
      return Atomics.store(bu8, getByteOffset(this) + byteOffset, value);
    }

    loadUint32(byteOffset = 0) {
      return Atomics.load(bu32, (getByteOffset(this) + byteOffset) / 4);
    }

    storeUint32(byteOffset = 0, value = 0) {
      var index;
      index = (getByteOffset(this) + byteOffset) / 4;
      if (!Number.isInteger) {
        throw /MODULUS_ERR/;
      }
      return Atomics.store(bu32, index, value);
    }

    addUint32(byteOffset = 0, value = 0) {
      var index;
      index = (getByteOffset(this) + byteOffset) / 4;
      return Atomics.add(bu32, index, value);
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
      var childs, index, ptri, ptrj;
      childs = [];
      index = 0;
      ptri = +this;
      ptrj = offset();
      while (ptrj -= PTRHEADERS_BYTELENGTH) {
        if (!(ptri - getParentPtri(ptrj))) {
          ptrj = Pointer.of(ptrj);
          if (!testFn || testFn(ptrj, index)) {
            childs[index++] = ptrj;
          }
        }
      }
      return childs;
    }

    includes(ptri) {
      return Boolean(this.find(function(ptrj) {
        return !(ptrj - ptri);
      }));
    }

    find(testFn) {
      var index, ptri, ptrj;
      ptri = +this;
      ptrj = offset();
      index = 0;
      while (ptrj -= PTRHEADERS_BYTELENGTH) {
        if (!(ptri - getParentPtri(ptrj))) {
          ptrj = Pointer.of(ptrj);
          if (testFn(ptrj, index++)) {
            return ptrj;
          }
        }
      }
      return null;
    }

    resize(byteLength = 0, dataBackup = true) {
      var TypedArray, byteOffset, length, mod, subarray;
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

    dataView(byteOffset = 0, byteLength, TypedArray) {
      byteOffset += getByteOffset(this);
      byteLength || (byteLength = getByteLength(this));
      return new DataView(sab, byteOffset, byteLength);
    }

    toPrimitive() {
      return this.subarray();
    }

    toString() {
      return this.toPrimitive().toString();
    }

    eq(any) {
      if (any instanceof Pointer) {
        any = any.toPrimitive();
      }
      return this.toPrimitive() === any;
    }

  };

  Pointer.byteLength = 4;

  Pointer.TypedArray = Uint8Array;

  Pointer.prototype.buffer = bvw.buffer;

  return Pointer;

}).call(this);

export var TypedArrayPointer = class TypedArrayPointer extends Pointer {
  static from(arrayLike) {
    var BYTES_PER_ELEMENT, byteLength, length, ptri;
    BYTES_PER_ELEMENT = this.TypedArray.BYTES_PER_ELEMENT;
    if (Array.isArray(arrayLike)) {
      length = arrayLike.length;
      byteLength = length * BYTES_PER_ELEMENT;
    }
    if (ArrayBuffer.isView(arrayLike)) {
      length = arrayLike.length;
      byteLength = arrayLike.byteLength;
      if (!(arrayLike instanceof this.TypedArray)) {
        arrayLike = new this.TypedArray(arrayLike.slice().buffer);
      }
    }
    if (!isNaN(arrayLike)) {
      length = arrayLike;
      byteLength = length * BYTES_PER_ELEMENT;
      arrayLike = new Array();
    }
    ptri = this.new(byteLength);
    ptri.subarray().set(arrayLike);
    return ptri;
  }

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
  static from(value = 0, ProtoPtr = this) {
    var absv2;
    if (ProtoPtr === NumberPointer) {
      if (!value) {
        return Uint8Number.new();
      }
      ProtoPtr = !Number.isSafeInteger(value) ? Number.isInteger(value) ? "BigInt64" : Float32Number : value < 0 && (absv2 = value * -2) ? absv2 <= 0xff ? Int8Number : absv2 <= 0xffff ? Int16Number : absv2 <= 0xffffffff ? Int32Number : (value = BigInt(value)) ? "BigInt64" : void 0 : value <= 0xff ? Uint8Number : value <= 0xffff ? Uint16Number : value <= 0xffffffff ? Uint32Number : (value = BigInt(value)) ? "BigUint64" : void 0;
      return ProtoPtr.from(value);
    }
    return this.new(this.byteLength).set(value * 1);
  }

};

export var Float32Number = (function() {
  class Float32Number extends NumberPointer {
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

  Float32Number.alias = "Float32";

  return Float32Number;

}).call(this);

export var Int32Number = (function() {
  class Int32Number extends NumberPointer {
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

export var Uint32AtomicNumber = (function() {
  class Uint32AtomicNumber extends NumberPointer {
    set(value = 0) {
      this.store(value);
      return this;
    }

    store(value = 0) {
      return this.storeUint32(0, value);
    }

    add(value = 0) {
      return this.addUint32(0, value);
    }

    toPrimitive() {
      return this.loadUint32(0);
    }

  };

  Uint32AtomicNumber.byteLength = 4;

  Uint32AtomicNumber.TypedArray = Uint32Array;

  return Uint32AtomicNumber;

}).call(this);

export var PointerLink = (function() {
  class PointerLink extends Pointer {
    static from(ptri) {
      if (!(ptri instanceof Pointer)) {
        throw [/LINKER/, ...arguments];
      }
      return this.new().set(ptri);
    }

    toPrimitive() {
      return Pointer.of(this.getInt32(0));
    }

    getProperty() {
      return this.target.getProperty(...arguments);
    }

    set() {
      this.setInt32(0, arguments[0]);
      return this;
    }

    from() {
      return this.toPrimitive().from;
    }

  };

  PointerLink.TypedArray = Int32Array;

  PointerLink.byteLength = 4;

  Object.defineProperty(PointerLink.prototype, "target", {
    enumerable: true,
    get: PointerLink.prototype.toPrimitive
  });

  return PointerLink;

}).call(this);

export var Int16Number = (function() {
  class Int16Number extends NumberPointer {
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

export var Int8Number = (function() {
  class Int8Number extends NumberPointer {
    set(value = 0) {
      this.setInt8(0, value);
      return this;
    }

    toPrimitive() {
      return this.getInt8(0);
    }

  };

  Int8Number.byteLength = 1;

  Int8Number.TypedArray = Int8Array;

  return Int8Number;

}).call(this);

export var Uint16Number = (function() {
  class Uint16Number extends NumberPointer {
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

export var BooleanPointer = class BooleanPointer extends Uint8Number {
  toPrimitive() {
    return Boolean(super.toPrimitive());
  }

};

export var BooleanAtomic = class BooleanAtomic extends Uint8AtomicNumber {
  toPrimitive() {
    return Boolean(super.toPrimitive());
  }

};

export var StringPointer = (function() {
  class StringPointer extends Pointer {
    static from(string = "") {
      var data, ptri;
      if (typeof string === "string") {
        data = stringToBytes(`${string}`);
      } else if (string instanceof Uint8Array) {
        data = string.slice();
      } else if (string instanceof this) {
        return string;
      }
      ptri = this.new(data.byteLength).set(data);
      return ptri;
    }

    toPrimitive() {
      return bytesToString(this.subarray().slice());
    }

    set(value = "") {
      var nextLength, thisLength, valueArray;
      if (!`${value}`.trim()) {
        return this;
      }
      if (typeof value === "string") {
        return this.set(stringToBytes(`${value}`));
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

  return StringPointer;

}).call(this);

export var ObjectPointer = (function() {
  class ObjectPointer extends Pointer {
    static from(any) {
      return this.new().set(any);
    }

    toPrimitive() {
      return scp[getScopeIndex(this)];
    }

    getProperty(propertyName = "") {
      return this.toPrimitive()[propertyName];
    }

    set(object) {
      if (!isNaN(object)) {
        throw /NAN_TOSCP/;
      }
      setScopeIndex(scopei(object), this);
      return this;
    }

  };

  ObjectPointer.byteLength = 4;

  return ObjectPointer;

}).call(this);

export var Property = (function() {
  class Property extends Pointer {
    static from(propertyName, desc = {}) {
      var byteLength, byteOffset, instanceOf, isRequired, ptri;
      ({byteLength, byteOffset, isRequired} = desc);
      ptri = this.new(this.byteLength);
      ptri.byteLength = Int32Number.from(byteLength);
      ptri.byteOffset = Int32Number.from(byteOffset);
      ptri.description = ObjectPointer.from(desc);
      ptri.isRequired = BooleanPointer.from(isRequired);
      ptri.name = StringPointer.from(propertyName);
      if (instanceOf = desc.instanceOf) {
        ptri.instanceOf = ObjectPointer.from(instanceOf);
      }
      return ptri;
    }

    from() {
      if (!this.instanceOf.toPrimitive().from) {
        throw [/UNCONST/, this.instanceOf];
      }
      return this.instanceOf.toPrimitive().from(...arguments);
    }

  };

  Property.byteLength = 24;

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

    getProperty(propertyName = "") {
      return this.find(function(i) {
        return i.name.toPrimitive() === propertyName;
      });
    }

    getAllocLength() {
      var byteLength, j, len, o, parent, ref;
      byteLength = 0;
      ref = this.filter(function(i) {
        return i instanceof Property;
      });
      for (j = 0, len = ref.length; j < len; j++) {
        o = ref[j];
        byteLength += 4;
      }
      if (parent = this.parent) {
        byteLength += parent.getAllocLength();
      }
      return byteLength;
    }

    defineProperty(propertyName, desc = {}) {
      desc.byteLength = Number(desc.byteLength);
      desc.byteOffset = this.getAllocLength();
      this.appendChild(Property.from(propertyName, desc));
      Object.defineProperty(this.class.prototype, propertyName, desc);
      return this;
    }

    definePointer(propertyName, desc = {}) {
      var byteLength, byteOffset, get, instanceOf, isRequired, set;
      byteOffset = this.getAllocLength();
      instanceOf = desc.instanceOf;
      byteLength = desc.byteLength;
      isRequired = desc.isRequired;
      get = function() {
        var ptri;
        if (ptri = this.getInt32(byteOffset)) {
          return Pointer.of(ptri);
        }
        if (isRequired && (ptri = instanceOf.new())) {
          this.setInt32(byteOffset, ptri);
        }
        return ptri;
      };
      set = function(value) {
        if (!(value instanceof instanceOf)) {
          value = instanceOf.from(value);
        }
        return this.setInt32(byteOffset, value);
      };
      this.appendChild(Property.from(propertyName, {get, set, byteOffset, byteLength, isRequired, instanceOf}));
      Object.defineProperty(this.class.prototype, propertyName, {...desc, get, set});
      return this;
    }

  };

  ClassPointer.byteLength = 4;

  return ClassPointer;

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

Object.defineProperty(ClassPointer.prototype, "class", {
  enumerable: true,
  get: function() {
    return this.toPrimitive();
  }
});

Object.defineProperty(ClassPointer.prototype, "name", {
  enumerable: true,
  get: function() {
    return new StringPointer(this.getInt32(0));
  },
  set: function() {
    return this.setInt32(0, arguments[0]);
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
    return new Int32Number(this.getInt32(0));
  },
  set: function() {
    return this.setInt32(0, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "byteOffset", {
  enumerable: true,
  get: function() {
    return new Int32Number(this.getInt32(4));
  },
  set: function() {
    return this.setInt32(4, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "isRequired", {
  enumerable: true,
  get: function() {
    return new BooleanPointer(this.getInt32(8));
  },
  set: function() {
    return this.setInt32(8, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "description", {
  enumerable: true,
  get: function() {
    return new ObjectPointer(this.getInt32(12));
  },
  set: function() {
    return this.setInt32(12, arguments[0]);
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
    return new StringPointer(this.getInt32(16));
  },
  set: function() {
    return this.setInt32(16, arguments[0]);
  }
});

Object.defineProperty(Property.prototype, "instanceOf", {
  enumerable: true,
  get: function() {
    return Pointer.of(this.getInt32(24));
  },
  set: function() {
    return this.setInt32(24, arguments[0]);
  }
});
