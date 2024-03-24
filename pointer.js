var Pointer, Scope, TypedArray, fn, j, len, ref, scope;

addEventListener("message", fn = function(e) {
  removeEventListener("message", fn);
  return Object.defineProperties(Pointer.prototype, {
    buffer: {
      value: e.data
    }
  });
});

Pointer = class Pointer extends Number {
  constructor() {
    var byteLength, i;
    if (!arguments.length) {
      super(Pointer.byteOffset / 4);
      if (byteLength = this.constructor.byteLength) {
        this.setByteOffset(i = Pointer.malloc(byteLength));
        this.setByteLength(byteLength);
        this.setLength(byteLength / this.BYTES_PER_ELEMENT);
      }
    }
  }

  init() {
    return this;
  }

};

Pointer.Number = class Number extends Pointer {};

Pointer.Worker = class Worker extends Pointer {};

Scope = class Scope extends Array {
  index() {
    var i;
    if (-1 === (i = this.indexOf(arguments[0]))) {
      i += this.push(arguments[0]);
    }
    return i;
  }

  store() {
    this.index(arguments[0]);
    return this;
  }

  constructor() {
    var buffer, ptrend, ptrlen, uint16, uint32, uint8;
    super().push(self);
    if (typeof document === "undefined" || document === null) {
      return this;
    }
    buffer = new SharedArrayBuffer(1e7);
    uint8 = new Uint8Array(buffer);
    uint32 = new Uint32Array(buffer);
    uint16 = new Uint16Array(buffer);
    ptrlen = 4 * 12;
    ptrend = ptrlen * 1e5;
    Atomics.add(uint32, 0, ptrlen);
    Atomics.add(uint32, 1, ptrend);
    Object.defineProperties(Pointer, {
      malloc: {
        value: function() {
          return Atomics.add(uint32, 1, arguments[0]);
        }
      },
      byteOffset: {
        get: function() {
          return Atomics.add(uint32, 0, ptrlen);
        }
      },
      byteLength: {
        get: function() {
          return Atomics.load(uint32, 0);
        }
      }
    });
    Object.defineProperties(Pointer.prototype, {
      setByteOffset: {
        value: function() {
          Atomics.store(uint32, this * 1, arguments[0]);
          return this;
        }
      },
      setByteLength: {
        value: function() {
          Atomics.store(uint32, this + 1, arguments[0]);
          return this;
        }
      },
      setLength: {
        value: function() {
          Atomics.store(uint32, this + 2, arguments[0]);
          return this;
        }
      },
      getByteOffset: {
        value: function() {
          return Atomics.load(uint32, this * 1);
        }
      },
      getByteLength: {
        value: function() {
          return Atomics.load(uint32, this + 1);
        }
      },
      getLength: {
        value: function() {
          return Atomics.load(uint32, this + 2);
        }
      },
      loadUint32: {
        value: function() {
          return Atomics.load(uint32, this + arguments[0]);
        }
      },
      storeUint32: {
        value: function() {
          Atomics.store(uint32, this + arguments[0], arguments[1]);
          return this;
        }
      },
      loadUint16: {
        value: function() {
          return Atomics.load(uint16, 2 * this + arguments[0]);
        }
      },
      storeUint16: {
        value: function() {
          Atomics.store(uint16, 2 * this + arguments[0], arguments[1]);
          return this;
        }
      }
    });
    Object.defineProperties(Pointer.prototype, {
      buffer: {
        value: buffer
      },
      store: {
        value: function() {
          return scope.index(arguments[0]);
        }
      },
      proxy: {
        value: function() {
          return scope[arguments[0]];
        }
      },
      ["{{Pointer}}"]: {
        get: function() {
          var headersByteOffset, pointerByteOffset;
          pointerByteOffset = this * 4;
          headersByteOffset = pointerByteOffset + Pointer.INDEX * 4;
          return {
            byteOffset: this.getByteOffset(),
            byteLength: this.getByteLength(),
            length: this.getLength(),
            headers: {
              uint8: new Uint8Array(buffer, headersByteOffset, 80),
              uint16: new Uint16Array(buffer, headersByteOffset, 40),
              uint32: new Uint32Array(buffer, headersByteOffset, 20)
            }
          };
        }
      }
    });
    (async function() {
      var i, j, results, scriptURL;
      scriptURL = URL.createObjectURL(new Blob([(await ((await fetch(import.meta.url))).text())], {
        type: "application/javascript"
      }));
      results = [];
      for (i = j = 0; j <= 4; i = ++j) {
        results.push(new Worker(scriptURL, {
          type: "module",
          name: i
        }).postMessage(buffer));
      }
      return results;
    })();
    null;
  }

};

scope = new Scope();

Object.defineProperties(Pointer, {
  class: {
    get: function() {
      return scope.store(this);
    }
  },
  INDEX: {
    writable: true,
    value: 4
  },
  LENGTH: {
    value: 12
  },
  palloc: {
    value: function() {
      var byteLength, byteOffset, typedArray, typedIndex;
      typedArray = arguments[0];
      byteLength = this.INDEX * 4;
      typedIndex = byteLength / typedArray.BYTES_PER_ELEMENT;
      byteOffset = byteLength + typedArray.BYTES_PER_ELEMENT;
      this.INDEX = byteOffset / 4;
      return typedIndex;
    }
  }
});

ref = [Float32Array, Uint8Array, Float64Array, Uint16Array, Uint32Array];
for (j = 0, len = ref.length; j < len; j++) {
  TypedArray = ref[j];
  (function(TypedArray) {
    this[TypedArray.name] = (function() {
      var _Class;

      _Class = class extends this {};

      _Class.prototype.name = TypedArray.name;

      _Class.prototype.TypedArray = TypedArray;

      _Class.prototype.BYTES_PER_ELEMENT = TypedArray.BYTES_PER_ELEMENT;

      return _Class;

    }).call(this);
    return Object.defineProperties(this[TypedArray.name].prototype, {
      array: {
        get: function() {
          return new TypedArray(this.buffer, this.getByteOffset(), this.getLength());
        }
      },
      subarray: {
        value: function() {
          return this.array.subarray(...arguments);
        }
      }
    });
  }).call(Pointer, TypedArray);
}

self.Pointer = Pointer;
