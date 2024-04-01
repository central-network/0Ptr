//? this is zero pointer - fastest
var BYTELENGTH_HEADER, BYTEOFFSET_PARENT, BYTES_PER_ELEMENT, INDEX_ATOMIC_NEXT, INDEX_BYTE_LENGTH, INDEX_PARENT_PTRI, INDEX_PROTO_CLASS, INITIAL, ITEMLENGTH_HEADER, LENDIAN, malloc, palloc, scopei;

export var u32 = new Uint32Array(new SharedArrayBuffer(256));

export var dvw = new DataView(u32.buffer);

export var obj = [u32];

export var KeyBase = (function() {
  class KeyBase extends Object {
    constructor(source = {}, options = {}) {
      super().configure(options).add(source).scopeIndex = -1 + obj.push(this);
    }

    configure(options) {
      var option, ref, symbol, value;
      ref = this.defaults;
      for (option in ref) {
        value = ref[option];
        symbol = this.constructor[option];
        if (value == null) {
          value = this.constructor.defaults[option];
        }
        Object.defineProperty(this, symbol, {value});
      }
      return this;
    }

    static generate(source = {}) {
      var base, key, label;
      base = new this();
      for (label in source) {
        key = source[label];
        Object.defineProperty(base.set(label, base[KeyBase.encode](key)), key, {
          value: base[label]
        });
      }
      return base;
    }

    set(label, value, proto = this[KeyBase.extend]) {
      var key;
      if (!this[KeyBase.filter](value)) {
        return;
      }
      if (this.hasOwnProperty(value)) {
        return;
      }
      key = new (eval(`(class ${label} extends ${proto.name} {})`))(value);
      Object.defineProperty(this, label, {
        value: key
      });
      Object.defineProperty(this, value, {
        value: key
      });
      return this;
    }

    add(source, proto = this[KeyBase.Extend]) {
      var label, value;
      for (label in source) {
        value = source[label];
        this.set(label, value);
      }
      return this;
    }

  };

  KeyBase.filter = Symbol.for("filter");

  KeyBase.extend = Symbol.for("extend");

  KeyBase.encode = Symbol.for("encode");

  KeyBase.prototype.defaults = {
    filter: function() {
      return arguments[0];
    },
    extend: Number,
    encode: function() {
      return [0, ...arguments[0]].reduce(function(a, b) {
        return a + b.charCodeAt();
      });
    }
  };

  return KeyBase;

}).call(this);

export var Error = class Error {
  constructor() {
    console.error([...arguments].flat());
  }

};

LENDIAN = 0x3f === new Uint8Array(Float32Array.of(1).buffer)[0x3];

INDEX_BYTE_LENGTH = -1;

INDEX_PROTO_CLASS = -2;

INDEX_PARENT_PTRI = -3;

INDEX_ATOMIC_NEXT = -4;

BYTES_PER_ELEMENT = 4;

ITEMLENGTH_HEADER = 4;

BYTELENGTH_HEADER = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT;

BYTEOFFSET_PARENT = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI;

Atomics.add(u32, 0, BYTES_PER_ELEMENT * (INITIAL = 6));

Atomics.add(u32, 1, INITIAL = 6);

palloc = Atomics.add.bind(Atomics, u32, 0, BYTELENGTH_HEADER);

malloc = function() {
  var byteLength, next, ptr, ptri;
  ptri = (ptr = arguments[0]) / 4;
  if (byteLength = ptr.constructor.byteLength) {
    Atomics.add(u32, 0, byteLength);
    Atomics.add(u32, 1, byteLength / 4);
    next = ptri + ITEMLENGTH_HEADER + byteLength / 4;
    Atomics.store(u32, ptri + INDEX_ATOMIC_NEXT, next); //write byteLength
    Atomics.store(u32, ptri + INDEX_BYTE_LENGTH, byteLength); //write byteLength
    return Atomics.store(u32, ptri + INDEX_PROTO_CLASS, scopei(ptr.constructor)); //write byteLength
  }
};

try {
  (scopei = function() {
    var i;
    if (-1 === (i = obj.indexOf(arguments[0]))) {
      i += obj.push(arguments[0]);
    }
    return i;
  })();
} catch (error) {}

export var Optr = (function() {
  class Optr/* Õ𝓟ṭṙ */ extends Number {
    static filter() {
      var Prop, Proto, ref;
      ref = arguments[0];
      for (Prop in ref) {
        Proto = ref[Prop];
        (function(prop, pclass) {
          return Object.defineProperty(this, prop, {
            get: function() {
              var Ptri, children, i, max, ptri;
              i = INITIAL;
              max = 2 + Atomics.load(u32, 1);
              ptri = this * 1;
              children = [];
              while (true) {
                if (!(ptri - Atomics.load(u32, i + INDEX_PARENT_PTRI))) {
                  Ptri = Atomics.load(u32, i + INDEX_PROTO_CLASS);
                  if (!pclass || pclass === Ptri) {
                    children.push(new obj[Ptri](i * 4));
                  }
                }
                if (max < (i = Atomics.load(u32, i + INDEX_ATOMIC_NEXT))) {
                  break;
                }
              }
              return children;
            }
          });
        }).call(this.prototype, Prop, Proto === Optr ? 0 : scopei(Proto));
      }
      return this;
    }

    static reserv(proto, length = 1) {
      var ALGINBYTES, BYTELENGTH, byteOffset, mod;
      BYTELENGTH = length * (proto.byteLength || proto.BYTES_PER_ELEMENT);
      ALGINBYTES = proto.BYTES_PER_ELEMENT || Math.max(proto.byteLength % 4, 4);
      if (mod = this.byteLength % ALGINBYTES) {
        mod = ALGINBYTES - mod;
      } else {
        mod = 0;
      }
      byteOffset = this.byteLength + mod;
      Object.defineProperties(this, {
        length: {
          value: this.length + length,
          writable: true
        },
        byteLength: {
          writable: true,
          value: byteOffset + BYTELENGTH
        }
      });
      return byteOffset;
    }

    constructor() {
      var O, argc, ptri;
      if (!arguments[0]) {
        malloc(super(ptri = palloc()));
      // new Optr( offset1, offset2, ... )
      } else if (argc = arguments.length) {
        ptri = 0;
        while (O = arguments[--argc]) {
          ptri += O;
        }
        super(ptri);
      }
      try {
        if (!ptri) {
          // slient error notify
          new Error(["OFFSET_POINTER_IS_ZERO", `new ${this.constructor.name}(${[...arguments]})`, ptri]);
        }
      } catch (error) {}
    }

    index4() {
      return (this + arguments[0] || 0) / 4;
    }

    index2() {
      return (this + arguments[0] || 0) / 2;
    }

    offset() {
      return this + arguments[0] || 0;
    }

    attach(ptr) {
      return this.storeUint32(BYTEOFFSET_PARENT, ptr);
    }

    ptrParent(Ptr) {
      return this.ptrUint32(BYTEOFFSET_PARENT, Ptr);
    }

    ptrUint32() {
      return new (arguments[1] || Pointer)(this.loadUint32(arguments[0]));
    }

    objUint32() {
      return obj[this.loadUint32(arguments[0])];
    }

    loadUint32() {
      return Atomics.load(u32, this.index4(arguments[0]));
    }

    storeUint32() {
      return Atomics.store(u32, this.index4(arguments[0]), arguments[1]);
    }

    addUint32() {
      return Atomics.add(u32, this.index4(arguments[0]), arguments[1]);
    }

    andUint32() {
      return Atomics.and(u32, this.index4(arguments[0]), arguments[1]);
    }

    waitUint32() {
      return Atomics.wait(u32, this.index4(arguments[0]), arguments[1]);
    }

    orUint32() {
      return Atomics.or(u32, this.index4(arguments[0]), arguments[1]);
    }

    xorUint32() {
      return Atomics.xor(u32, this.index4(arguments[0]), arguments[1]);
    }

    keyUint32() {
      return arguments[1][this.getUint32(arguments[0])];
    }

    getUint32() {
      return dvw.getUint32(this + arguments[0], LENDIAN);
    }

    setUint32() {
      dvw.setUint32(this + arguments[0], arguments[1], LENDIAN);
      return arguments[1];
    }

    keyUint8() {
      return arguments[1][this.getUint8(arguments[0])];
    }

    getUint8() {
      return dvw.getUint8(this + arguments[0]);
    }

    setUint8() {
      dvw.setUint8(this + arguments[0], arguments[1]);
      return arguments[1];
    }

    keyUint16() {
      return arguments[1][this.getUint16(arguments[0])];
    }

    getUint16() {
      return dvw.getUint16(this + arguments[0], LENDIAN);
    }

    setUint16() {
      dvw.setUint16(this + arguments[0], arguments[1], LENDIAN);
      return arguments[1];
    }

    getFloat32() {
      return dvw.getFloat32(this + arguments[0], LENDIAN);
    }

    setFloat32() {
      dvw.setFloat32(this + arguments[0], arguments[1], LENDIAN);
      return arguments[1];
    }

  };

  Optr.prototype.buffer = u32.buffer;

  Optr.prototype.scopei = scopei;

  Optr.byteLength = 0;

  return Optr;

}).call(this);

export {
  Optr as default
};

self.onclick = function() {
  return console.warn(obj);
};
