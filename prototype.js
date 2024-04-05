var SharedArrayBuffer, Worker;

Object.defineProperties(Object.prototype, {
  toPointer: {
    configurable: true,
    value: function() {
      return new RefLink().setRef(this);
    }
  }
});

Object.defineProperties(Symbol, {
  pointer: {
    value: "{[Pointer]}"
  }
});

Object.defineProperties(Number.prototype, {
  toPointer: {
    value: function() {
      var Ptr, protoclass, prototype, ref;
      if (!this) {
        return null;
      }
      if (!(prototype = (ref = arguments[0]) != null ? ref.prototype : void 0)) {
        protoclass = Pointer.prototype.loadHeader.call(this, Pointer.prototype.HINDEX_PROTOCLASS);
        prototype = Pointer.prototype.scope.get(protoclass);
      }
      if (Ptr = prototype.constructor) {
        return new Ptr(this);
      }
      return null;
    }
  }
});

Object.defineProperties(DataView.prototype, {
  littleEndian: {
    value: new Uint8Array(Uint32Array.of(0x01).buffer)[0]
  }
});

Object.defineProperties(URL, {
  createWorkerURL: {
    value: function() {
      return this.createObjectURL(new Blob([...arguments].flat(), {
        type: "application/javascript",
        endings: "native"
      }));
    }
  }
});

Object.defineProperties(self.SharedArrayBuffer.prototype, {
  lock: {
    value: function(byteOffset = 8) {
      var i32;
      i32 = new Int32Array(this, byteOffset, 1);
      return Atomics.wait(i32);
    }
  },
  unlock: {
    value: function(byteOffset = 8) {
      var i32;
      i32 = new Int32Array(this, byteOffset, 1);
      return setTimeout(() => {
        return Atomics.notify(i32);
      }, 400);
    }
  }
});

Object.defineProperties(self, {
  Worker: {
    value: Worker = class Worker extends self.Worker {
      constructor() {
        super(arguments[0], {...{
            type: "module",
            name: crypto.randomUUID()
          }, ...(arguments[1] || {})});
        this.onerror = function() {
          return !console.error(...arguments);
        };
      }

    }
  },
  SharedArrayBuffer: {
    value: SharedArrayBuffer = (function() {
      class SharedArrayBuffer extends self.SharedArrayBuffer {
        constructor() {
          var byteLength, options, source;
          byteLength = SharedArrayBuffer.byteLength;
          options = {
            maxByteLength: SharedArrayBuffer.maxByteLength
          };
          //? new SharedArrayBuffer()
          if (!arguments.length) {
            return super(byteLength, options).initialAlloc();
          }
          //? new SharedArrayBuffer( 256 )
          if (Number.isInteger(source = arguments[0])) {
            byteLength = Math.max(source, byteLength);
            return super(byteLength, arguments[1] || options).initialAlloc();
          }
          //? new SharedArrayBuffer( [2, 41, ...N ] )
          if (Array.isArray(source)) {
            source = Uint8Array.from(source);
          }
          if (source instanceof SharedArrayBuffer) {
            return source;
          }
          //? new SharedArrayBuffer( new ArrayBuffer(256) )
          if (source.byteLength) {
            byteLength = Math.max(source.byteLength, byteLength);
            return super(byteLength, options).initialAlloc().set(source);
          }
          throw /MEMORY_COULD_NOT_INITIALIZED/;
        }

        set(source, byteOffset = 0) {
          var ref;
          new Uint8Array(this).set(new Uint8Array((ref = source.buffer) != null ? ref : source), 0);
          return this;
        }

        initialAlloc() {
          Atomics.or(new Uint32Array(this), 0, 8);
          Atomics.or(new Uint32Array(this), 1, 2);
          return this;
        }

      };

      SharedArrayBuffer.byteLength = 12;

      SharedArrayBuffer.maxByteLength = Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11);

      SharedArrayBuffer.littleEndian = DataView.prototype.littleEndian;

      return SharedArrayBuffer;

    }).call(this)
  }
});
