//? this is zero pointer - fastest
var BYTELENGTH_HEADER, BYTEOFFSET_PARENT, BYTES_PER_ELEMENT, INDEX_ATOMIC_NEXT, INDEX_BYTE_LENGTH, INDEX_PARENT_PTRI, INDEX_PROTO_CLASS, INITIAL, ITEMLENGTH_HEADER, Optr/* Õ𝓟ṭṙ */, malloc, palloc, scopei;

export var u32 = new Uint32Array(new SharedArrayBuffer(256));

export var obj = [u32];

export var Error = class Error {
  constructor() {
    console.error([...arguments].flat());
  }

};

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

export default Optr = (function() {
  class Optr extends Number {
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

  };

  Optr.prototype.buffer = u32.buffer;

  Optr.prototype.scopei = scopei;

  Optr.byteLength = 0;

  return Optr;

}).call(this);

self.onclick = function() {
  return console.warn(obj);
};
