var SharedArrayBuffer;

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

Object.defineProperties(self, {
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
          //? new SharedArrayBuffer( new SharedArrayBuffer(256) || new ArrayBuffer(256) )
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

      SharedArrayBuffer.byteLength = 8;

      SharedArrayBuffer.maxByteLength = Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11);

      SharedArrayBuffer.littleEndian = DataView.prototype.littleEndian;

      return SharedArrayBuffer;

    }).call(this)
  }
});
