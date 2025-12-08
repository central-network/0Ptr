var MAX_INT16, MAX_INT32, MAX_INT8, MAX_UINT16, MAX_UINT32, MAX_UINT8, Optr, debug, dvw, error, iLE, log, warn;

({log, warn, error, debug} = self.console);

self.Object.defineProperty(DataView.prototype, "isLittleEndian", {
  value: self.Boolean(iLE = new self.Uint8Array(self.Uint32Array.of(1).buffer).at(0))
});

self.Object.defineProperty(DataView.prototype, "set", {
  value: function(alias = "Float32", offset = 0, value = 0) {
    this["set" + alias](offset, value, iLE);
    return value;
  }
});

self.Object.defineProperty(DataView.prototype, "get", {
  value: function(alias = "Float32", offset = 0, value = 0) {
    return this["get" + alias](offset, iLE);
  }
});

MAX_INT8 = self.Math.floor(-0xff / 2);

MAX_INT16 = self.Math.floor(-0xffff / 2);

MAX_INT32 = self.Math.floor(-0xffffffff / 2);

MAX_UINT8 = 0xff + 1;

MAX_UINT16 = 0xffff + 1;

MAX_UINT32 = 0xffffffff + 1;

dvw = new self.DataView(new self.ArrayBuffer(4 * 1e5));

self.dump = function() {
  var ptrj, ptrs;
  ptrj = Optr.byteLength;
  ptrs = [];
  while (ptrj = Optr.of(dvw.get("Int32", ptrj))) {
    ptrs.push(ptrj);
  }
  return ptrs;
};

export default Optr = (function() {
  class Optr extends self.Number {
    static define(prop, desc, target = this.prototype) {
      return self.Object.defineProperty(target, prop, desc);
    }

    static extend(name) {
      var $, ptri;
      self.Super = this;
      self.Child = null;
      $ = document.createElement("script");
      $.text = `self.Child = (class ${name} extends Super {})`;
      $ = document.body.appendChild($).remove();
      ptri = Class.from(Child);
      delete self.Super;
      delete self.Child;
      return ptri;
    }

    static hasOwn(prop, target = this.prototype) {
      return self.Object.hasOwn(target, prop);
    }

    static from(any) {
      var Prototype, ptri;
      if (Optr.isPrototypeOf(this)) {
        ptri = this.alloc();
        self.Object.keys(any || {}).filter((prop) => {
          return this.hasOwn(prop);
        }).forEach(function(prop) {
          return ptri[prop] = any[prop];
        });
        return ptri;
      }
      if (!any) {
        return Boolean.from(any);
      }
      if (any instanceof Optr) {
        return any;
      }
      Prototype = (function() {
        switch (any.constructor) {
          case self.Boolean:
            return Boolean;
          case self.Number:
            return Number;
          case self.String:
            return String;
          case self.Array:
            return Array;
          case self.Object:
            return Object;
          default:
            return ExtRef;
        }
      })();
      return Prototype.from(any);
    }

    static of(ptri) {
      var clsi;
      if (ptri && (clsi = dvw.get("Int32", ptri + 4))) {
        return new this.storage[clsi](ptri);
      }
      return null;
    }

    static default() {
      return this.alloc();
    }

    static alloc(moreByteLength = 0) {
      var byteLength, mod, next, nextOffset, ptri;
      byteLength = this.byteLength + moreByteLength;
      ptri = Optr.byteLength;
      while (next = dvw.get("Int32", ptri)) {
        ptri = next;
      }
      nextOffset = ptri + byteLength;
      if (mod = nextOffset % 4) {
        nextOffset += 4 - mod;
      }
      dvw.set("Int32", ptri, nextOffset);
      dvw.set("Int32", ptri + 4, this.classIndex);
      return new this(ptri);
    }

    static store(any) {
      var i;
      if (-1 === (i = this.storage.indexOf(any))) {
        i += this.storage.push(any);
      }
      return i;
    }

    subarray(offset = 0, byteLength, TypedArray) {
      if (offset instanceof Function) {
        TypedArray = byteOffset;
        byteOffset = 0;
      }
      byteLength || (size = dvw.get("Uint32", this) - this);
      TypedArray || (TypedArray = this.constructor.TypedArray);
      return new TypedArray(Optr.buffer, this + byteOffset, byteLength / TypedArray.BYTES_PER_ELEMENT);
    }

    detach() {
      return this.subarray(self.Uint8Array).slice().buffer;
    }

    toString() {
      return `${this.toPrimitive()}`;
    }

    toNumber() {
      return +this;
    }

    toBoolean() {
      return true;
    }

    appendChild(ptrj) {
      dvw.set("Int32", ptrj + 8, this);
      return ptrj;
    }

    setParent(ptri) {
      dvw.set("Int32", this + 8, ptri);
      return this;
    }

    isParentOf(ptrj) {
      return 0 === this - dvw.get("Int32", ptrj + 8);
    }

    getChildren() {
      var kids, next, ptrj;
      ptrj = Optr.byteLength;
      kids = [];
      while (next = dvw.get("Int32", ptrj)) {
        if (this.isParentOf(ptrj)) {
          kids.push(Optr.of(ptrj));
        }
        ptrj = next;
      }
      return kids;
    }

    getParent() {
      return Optr.of(dvw.get("Int32", this + 8));
    }

    is(any) {
      return this.toPrimitive() === any;
    }

  };

  Optr.buffer = dvw.buffer;

  Optr.byteLength = 12;

  Optr.protoClass = 0;

  Optr.storage = [, ];

  Optr.TypedArray = self.Uint8Array;

  Optr.define("{[Pointer]}", {
    get: function() {
      var subarray;
      subarray = this.subarray();
      return {
        base: subarray.buffer,
        buffer: subarray.slice().buffer,
        subarray: subarray,
        parent: this.getParent(),
        children: this.getChildren(),
        toPrimitive: this.toPrimitive(),
        toBoolean: this.toBoolean(),
        toString: this.toString(),
        toNumber: this.toNumber()
      };
    }
  });

  Optr.define("#primitive", {
    get: function() {
      return this.toPrimitive();
    }
  });

  return Optr;

}).call(this);

export var Number = (function() {
  class Number extends Optr {
    static from(number) {
      var ptri, sign, type;
      if ("number" !== typeof number) {
        throw /NOTANUMBER/;
      }
      if (number === 0) {
        return this.alloc();
      }
      ptri = this.alloc();
      sign = number < 0;
      type = null;
      dvw.setUint8(ptri + this.prototype.nullOffset, 1);
      dvw.setUint8(ptri + this.prototype.signOffset, sign);
      if (self.Number.isNaN(number)) {
        type = 0/0;
      } else if (!self.Number.isFinite(number)) {
        type = 2e308;
        dvw.setUint8(ptri + this.prototype.boolOffset, 1);
      } else {
        if (!self.Number.isInteger(number)) {
          type = "Float32";
          dvw.setUint8(ptri + this.prototype.boolOffset, 2);
        } else if (sign) {
          if (number > MAX_INT8) {
            type = "Int8";
          } else if (number > MAX_INT16) {
            type = "Int16";
          } else if (number > MAX_INT32) {
            type = "Int32";
          }
          dvw.setUint8(ptri + this.prototype.boolOffset, 3);
        } else {
          if (number < MAX_UINT8) {
            type = "Uint8";
          } else if (number < MAX_UINT16) {
            type = "Uint16";
          } else if (number < MAX_UINT32) {
            type = "Uint32";
          }
          dvw.setUint8(ptri + this.prototype.boolOffset, 4);
        }
        dvw.set(type, ptri + this.prototype.dataOffset, number);
      }
      dvw.setUint8(ptri + this.prototype.typeOffset, this.TypeObject[type]);
      return ptri;
    }

    toPrimitive() {
      return this.toNumber();
    }

    toBoolean() {
      return dvw.getUint8(this + this.nullOffset) === 1;
    }

    toNumber() {
      if (dvw.getUint8(this + this.nullOffset)) {
        if (!this.isFinite) {
          if (this.isSigned) {
            return -this.type;
          } else {
            return this.type;
          }
        }
        return dvw.get(this.type, this + this.dataOffset);
      }
      return 0;
    }

  };

  Number.byteOffset = Number.byteLength;

  Number.byteLength = Number.byteOffset + 8;

  Number.prototype.nullOffset = Number.byteOffset + 0;

  Number.prototype.signOffset = Number.byteOffset + 1;

  Number.prototype.boolOffset = Number.byteOffset + 2;

  Number.prototype.typeOffset = Number.byteOffset + 3;

  Number.prototype.dataOffset = Number.byteOffset + 4;

  Number.TypedArray = self.Uint8Array;

  Number.classIndex = Number.store(Number);

  Number.TypeObject = {
    [0]: "Uint8",
    Uint8: 0,
    [0x01]: 2e308,
    Infinity: 0x01,
    [0x02]: 0/0,
    NaN: 0x02,
    [0x03]: "Float32",
    Float32: 0x03,
    [0x04]: "Int8",
    Int8: 0x04,
    [0x05]: "Int16",
    Int16: 0x05,
    [0x06]: "Int32",
    Int32: 0x06,
    [0x08]: "Uint16",
    Uint16: 0x08,
    [0x09]: "Uint32",
    Uint32: 0x09
  };

  Number.define("type", {
    enumerable: true,
    get: function() {
      var type;
      type = dvw.getUint8(this + this.typeOffset);
      return this.constructor.TypeObject[type];
    }
  });

  Number.define("isFinite", {
    enumerable: true,
    get: function() {
      return dvw.getUint8(this + this.boolOffset) > 1;
    }
  });

  Number.define("isFloat", {
    enumerable: true,
    get: function() {
      return dvw.getUint8(this + this.boolOffset) === 2;
    }
  });

  Number.define("isSigned", {
    enumerable: true,
    get: function() {
      return dvw.getUint8(this + this.signOffset) === 1;
    }
  });

  return Number;

}).call(this);

export var Boolean = (function() {
  class Boolean extends Optr {
    static from(any) {
      var ptri;
      ptri = this.alloc();
      if (!any) {
        dvw.setUint8(ptri + this.byteOffset, this.TypeObject[any]);
      }
      return ptri;
    }

    toPrimitive() {
      return this.toBoolean();
    }

    toBoolean() {
      return !dvw.getUint8(this + this.constructor.byteOffset);
    }

    toNumber() {
      return this.toBoolean() && 1 || 0;
    }

  };

  Boolean.byteOffset = Boolean.byteLength;

  Boolean.byteLength = Boolean.byteOffset + 2;

  Boolean.TypedArray = self.Uint8Array;

  Boolean.classIndex = Boolean.store(Boolean);

  Boolean.TypeObject = {
    [0]: 0,
    [0x01]: false,
    [false]: 0x01,
    [0x02]: 0/0,
    [0/0]: 0x02,
    [0x03]: null,
    [null]: 0x03,
    [0x04]: void 0,
    [void 0]: 0x04,
    [0x05]: "",
    [""]: 0x05
  };

  Boolean.define("offval", {
    enumerable: true,
    get: function($ = this.constructor) {
      return $.TypeObject[dvw.getUint8(this + $.byteOffset)];
    }
  });

  return Boolean;

}).call(this);

export var String = (function() {
  class String extends Optr {
    static from(string, toString = false) {
      var charArray, ptri;
      if ("string" !== typeof string) {
        if (!toString) {
          throw /NOTASTRING/;
        }
        string = string.toString();
      }
      if (!string.length) {
        return this.alloc();
      }
      charArray = this.encode(string);
      ptri = this.alloc(charArray.byteLength);
      dvw.set("Uint32", ptri + this.prototype.byteLengthOffset, charArray.byteLength);
      dvw.set("Uint32", ptri + this.prototype.textLengthOffset, string.length);
      return ptri.set(charArray);
    }

    set(charArray = []) {
      this.subarray().set(charArray);
      return this;
    }

    toPrimitive() {
      return this.toString();
    }

    toBoolean() {
      return this.length > 0;
    }

    subarray() {
      var byteLength;
      byteLength = dvw.get("Uint32", this + this.byteLengthOffset);
      return super.subarray(this.constructor.byteLength, byteLength, self.Uint8Array);
    }

    toNumber() {
      var i, j, len, num, ref, v;
      num = 0;
      ref = this.subarray();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        v = ref[i];
        num += v * i;
      }
      return num;
    }

    toString() {
      if (!this.toBoolean()) {
        return "";
      }
      return this.constructor.decode(this.subarray());
    }

  };

  String.byteOffset = String.byteLength;

  String.byteLength = String.byteOffset + 8;

  String.TypedArray = self.Uint8Array;

  String.classIndex = String.store(String);

  String.encode = self.TextEncoder.prototype.encode.bind(new self.TextEncoder);

  String.decode = self.TextDecoder.prototype.decode.bind(new self.TextDecoder);

  String.prototype.textLengthOffset = String.byteOffset + 4;

  String.prototype.byteLengthOffset = String.byteOffset;

  String.charOfCode = self.String.fromCharCode;

  String.define("length", {
    enumerable: true,
    get: function() {
      return dvw.get("Uint32", this + this.textLengthOffset);
    }
  });

  return String;

}).call(this);

export var Array = (function() {
  class Array extends Optr {
    static from(array) {
      var i, ptri;
      if (!self.Array.isArray(array)) {
        throw /ARRAY_NOTARRAY/;
      }
      ptri = this.alloc();
      if (i = array.length) {
        dvw.set("Uint32", ptri + this.byteOffset, i);
        while (i--) {
          Optr.from(array[i]).setParent(ptri);
        }
      }
      return ptri;
    }

    toPrimitive() {
      return this.toArray();
    }

    toBoolean() {
      return this.length > 0;
    }

    toArray() {
      return this.getChildren().map(function(ptri) {
        return ptri.toPrimitive();
      });
    }

    forEach(fn, thisArg = this) {
      var i, items;
      if (!(i = this.length)) {
        return this;
      }
      items = this.getChildren();
      while (i--) {
        fn.call(thisArg, items[i], i, items);
      }
      return this;
    }

    at(index = 0) {
      var next, ptrj;
      ptrj = Optr.byteLength;
      while (next = dvw.get("Int32", ptrj)) {
        if (this.isParentOf(ptrj)) {
          if (!index--) {
            return Optr.of(ptrj);
          }
        }
        ptrj = next;
      }
      return kids;
    }

  };

  Array.byteOffset = Array.byteLength;

  Array.byteLength = Array.byteOffset + 4;

  Array.TypedArray = self.Uint32Array;

  Array.classIndex = Array.store(Array);

  Array.define("length", {
    enumerable: true,
    get: function() {
      return dvw.get("Uint32", this + this.constructor.byteOffset);
    }
  });

  return Array;

}).call(this);

export var Object = (function() {
  class Object extends Optr {
    static from(object) {
      var byteOffset, i, keys, ptri, vals;
      if (!object || object.constructor.name !== "Object") {
        throw [/OBJECT_NOTOBJECT/, object];
      }
      ptri = this.alloc();
      keys = self.Object.keys(object);
      vals = self.Object.values(object);
      if (i = keys.length) {
        byteOffset = ptri + this.byteOffset;
        dvw.set("Uint32", byteOffset, i);
        dvw.set("Uint32", byteOffset + 4, Array.from(keys));
        dvw.set("Uint32", byteOffset + 8, Array.from(vals));
      }
      return ptri;
    }

    keys() {
      return Optr.of(dvw.get("Uint32", this + this.constructor.byteOffset + 4));
    }

    values() {
      return Optr.of(dvw.get("Uint32", this + this.constructor.byteOffset + 8));
    }

    toPrimitive() {
      return this.toObject();
    }

    toString() {
      return JSON.stringify(this.toPrimitive());
    }

    toObject() {
      var object, values;
      object = {};
      values = this.values();
      this.keys().forEach(function(keyi, i) {
        return object[keyi.toString()] = values.at(i).toPrimitive();
      });
      return object;
    }

  };

  Object.byteOffset = Object.byteLength;

  Object.byteLength = Object.byteOffset + 12;

  Object.TypedArray = self.Uint32Array;

  Object.classIndex = Object.store(Object);

  Object.define("length", {
    enumerable: true,
    get: function() {
      return dvw.get("Uint32", this + this.constructor.byteOffset);
    }
  });

  Object.prototype.toBoolean = Array.prototype.toBoolean;

  return Object;

}).call(this);

export var ExtRef = (function() {
  class ExtRef extends Optr {
    static from(any, name) {
      var ptri;
      ptri = this.alloc().set([this.store(any)]);
      name || (name = any.name || any.constructor.name);
      if (!name) {
        return ptri;
      }
      return ptri.setName(name);
    }

    setName(name = "") {
      dvw.set("Int32", this + this.nameOffset, String.from(name));
      return this;
    }

    setObject(any) {
      dvw.set("Int32", this + this.storeOffset, this.constructor.store(any));
      return this;
    }

    set([storeIndex]) {
      dvw.set("Int32", this + this.storeOffset, storeIndex);
      return this;
    }

    toPrimitive() {
      return this.toObject();
    }

    toBoolean() {
      return true;
    }

    toString() {
      return String.of(dvw.get("Int32", this + this.nameOffset)).toPrimitive();
    }

    toNumber() {
      return dvw.get("Int32", this + this.storeOffset);
    }

    toObject() {
      return this.constructor.storage[dvw.get("Int32", this + this.storeOffset)];
    }

  };

  ExtRef.byteOffset = ExtRef.byteLength;

  ExtRef.byteLength = ExtRef.byteOffset + 8;

  ExtRef.classIndex = ExtRef.store(ExtRef);

  ExtRef.TypedArray = self.Int32Array;

  ExtRef.prototype.storeOffset = ExtRef.byteOffset;

  ExtRef.prototype.nameOffset = ExtRef.byteOffset + 4;

  ExtRef.define("object", {
    enumerable: true,
    get: function() {
      return this.toObject();
    }
  });

  ExtRef.define("name", {
    enumerable: true,
    get: function() {
      return this.toString();
    }
  });

  return ExtRef;

}).call(this);

export var Property = (function() {
  class Property extends ExtRef {
    toNumber() {
      return dvw.get("Int16", this + this.byteOffsetByteOffset);
    }

  };

  Property.classIndex = Property.store(Property);

  Property.byteOffset = Property.byteLength;

  Property.byteLength = Property.byteOffset + 2;

  Property.prototype.byteOffsetByteOffset = Property.byteOffset;

  Property.define("byteOffset", {
    enumerable: true,
    get: function() {
      return this.toNumber();
    },
    set: function() {
      return dvw.set("Int16", this + this.byteOffsetByteOffset, arguments[0]);
    }
  });

  Property.define("class", {
    enumerable: true,
    get: function() {
      return this.toPrimitive();
    }
  });

  return Property;

}).call(this);

export var Class = (function() {
  class Class extends ExtRef {
    static from(proto, name) {
      var byteLength, classProps, desc, prop, property, protoProps, ptri, value;
      ptri = super.from(proto, name || proto.name);
      byteLength = Optr.byteLength;
      classProps = self.Object.getOwnPropertyDescriptors(proto);
      protoProps = self.Object.getOwnPropertyDescriptors(proto.prototype);
      delete classProps.length;
      delete classProps.name;
      delete classProps.prototype;
      for (prop in classProps) {
        desc = classProps[prop];
        if (!(value = desc.value)) {
          continue;
        }
        if (Optr.isPrototypeOf(value)) {
          continue;
        }
        (function(prop, value) {
          return self.Object.defineProperty(this, prop, {
            get: function(bind = value.bind) {
              if (!bind) {
                return proto[prop];
              } else {
                return proto[prop].bind(proto);
              }
            }
          });
        }).call(ptri, prop, value);
      }
      for (prop in protoProps) {
        desc = protoProps[prop];
        if (!(value = desc.value)) {
          continue;
        }
        if (prop.startsWith("constructor")) {
          continue;
        }
        if (!Optr.isPrototypeOf(value)) {
          continue;
        }
        property = Property.from(value, prop);
        property.byteOffset = ptri.byteLength;
        property.setParent(ptri);
        byteLength += 4;
        (function(property) {
          var PClass, offset;
          offset = property.toNumber() + Optr.byteLength;
          PClass = property.toPrimitive();
          return self.Object.defineProperty(this.class.prototype, property.toString(), {
            enumerable: true,
            get: function() {
              if (ptri = dvw.get("Int32", this + offset)) {
                return PClass.of(ptri);
              }
              ptri = PClass.default();
              dvw.set("Int32", this + offset, ptri);
              return ptri;
            },
            set: function() {
              return dvw.set("Int32", this + offset, PClass.from(arguments[0]));
            }
          });
        }).call(ptri, property);
      }
      proto.byteLength = byteLength;
      return ptri;
    }

    from() {
      return this.object.from(...arguments);
    }

    of() {
      return this.object.of(...arguments);
    }

    define(prop, desc) {
      var PClass, byteOffset, defaultValue, get, options, ptri, set, target;
      PClass = desc.class;
      target = this.class.prototype;
      if (prop.startsWith("@")) {
        prop = prop.substring(1);
        target = this;
      }
      byteOffset = this.class.byteLength;
      this.class.byteLength = 4 + byteOffset;
      ptri = Property.from(PClass, prop);
      ptri.byteOffset = byteOffset;
      ptri.setParent(this);
      set = function(val) {
        return dvw.set("Int32", this + byteOffset, PClass.from(val));
      };
      get = function() {
        return PClass.from(dvw.get("Int32", this + byteOffset));
      };
      if (defaultValue = desc.value) {
        get = function() {
          if (!(ptri = dvw.get("Int32", this + byteOffset))) {
            set.call(this, ptri = defaultValue);
          }
          return PClass.from(ptri);
        };
        delete desc.value;
      }
      options = {
        writeable: true,
        enumerable: true,
        configurable: true
      };
      self.Object.defineProperty(target, prop, {get, set, ...options, ...desc});
      return this;
    }

  };

  Class.classIndex = Class.store(Class);

  Class.define("class", {
    enumerable: true,
    get: function() {
      return this.toPrimitive();
    }
  });

  Class.define("properties", {
    enumerable: true,
    get: function() {
      return this.getChildren();
    }
  });

  Class.define("byteLength", {
    enumerable: true,
    get: function() {
      return this.properties.length * 4;
    }
  });

  return Class;

}).call(this);

export var Math = (function() {
  class Math extends Optr {
    static randomChar(upperCase = false) {
      if (upperCase) {
        return String.charOfCode(this.rangedRand(65, 90));
      }
      return String.charOfCode(this.rangedRand(97, 122));
    }

    static randomBool() {
      return this.random() > .5;
    }

    static rangedRand(min = 0, max = 10) {
      return this.trunc(min + this.random() * (max - min));
    }

    static randomUUID(uuid) {
      var c, i, l, r;
      uuid || (uuid = 4);
      if ("number" === typeof uuid) {
        if (uuid === 4) {
          uuid = "???!????-???!-!!?!-????-??!???????!?";
        } else {
          uuid = "".padStart(uuid, "?");
        }
      }
      i = 0;
      r = "";
      l = uuid.length;
      while (i < l) {
        r += (function() {
          switch (c = uuid[i++]) {
            case "!":
              return this.rangedRand(0, 9);
            case "?":
              switch (this.randomBool()) {
                case false:
                  return this.randomChar();
                case true:
                  return this.rangedRand(0, 9);
              }
              break;
            default:
              return c;
          }
        }).call(this);
      }
      return r;
    }

  };

  Math.random = self.Math.random;

  Math.trunc = self.Math.trunc;

  return Math;

}).call(this);

export var UUID = (function() {
  class UUID extends String {
    static from() {
      return super.from(Math.randomUUID(...arguments));
    }

    static default() {
      return this.from(4);
    }

  };

  UUID.classIndex = UUID.store(UUID);

  return UUID;

}).call(this);

export var from = Optr.from;
