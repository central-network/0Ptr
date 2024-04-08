var BigInt64Array, BigUint64Array, Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, TypedArray, Uint16Array, Uint32Array, Uint8Array;

import KEYOF from "./0ptr_keyof.js";

import {
  defaults
} from "./0ptr_self.js";

import {
  Pointer
} from "./0ptr_pointer.js";

TypedArray = (function() {
  class TypedArray extends Pointer {
    solve() {
      var buffer, byteOffset, length;
      [buffer, byteOffset, length] = arguments;
      if (!isNaN(buffer)) {
        return this.alloc(buffer);
      // todo clone needed
      } else if (ArrayBuffer.isView(buffer)) {
        return this.alloc(buffer.length);
      } else if (Array.isArray(buffer)) {
        return this.alloc(buffer.length);
      } else if (buffer.byteLength) {
        return this.alloc(buffer.byteLength / this.BYTES_PER_ELEMENT);
      } else {
        throw ["What is this", ...arguments];
      }
    }

    alloc(length) {
      var begin, byteLength, byteOffset, end;
      byteLength = length * this.BYTES_PER_ELEMENT;
      byteOffset = memory.malloc(byteLength);
      begin = byteOffset / 4;
      end = begin + length;
      memory.setByteLength(this, byteLength);
      memory.setBegin(this, begin);
      memory.setEnd(this, end);
      return this;
    }

    static fromLength(length) {
      return new this().alloc(length * this.prototype.BYTES_PER_ELEMENT);
    }

    subarray() {
      var begin, end;
      [begin = 0, end = 0] = arguments;
      begin += memory.getBegin(this);
      end || (end = memory.getEnd(this));
      return memory[`subarray${this.constructor.name.replace(/Array/, "")}`](begin, end);
    }

  };

  TypedArray.byteLength = 2048;

  Object.defineProperties(TypedArray.prototype, {
    buffer: {
      get: function() {
        return new this.realizeWith(memory, this.byteOffset, this.length);
      }
    },
    byteOffset: {
      get: function() {
        return memory.loadUint32(this + this.constructor.HINDEX_BYTEOFFSET);
      }
    },
    byteLength: {
      get: function() {
        return memory.loadUint32(this + this.constructor.HINDEX_BYTELENGTH);
      }
    },
    length: {
      get: function() {
        return memory.loadUint32(this + this.constructor.HINDEX_LENGTH);
      }
    }
  });

  return TypedArray;

}).call(this);

Object.defineProperties(self, {
  Uint8Array: {
    value: Uint8Array = (function() {
      class Uint8Array extends TypedArray {};

      Uint8Array.prototype.realizeWith = defaults.Uint8Array;

      return Uint8Array;

    }).call(this)
  },
  Int8Array: {
    value: Int8Array = (function() {
      class Int8Array extends TypedArray {};

      Int8Array.prototype.realizeWith = defaults.Int8Array;

      return Int8Array;

    }).call(this)
  },
  Int16Array: {
    value: Int16Array = (function() {
      class Int16Array extends TypedArray {};

      Int16Array.prototype.realizeWith = defaults.Int16Array;

      return Int16Array;

    }).call(this)
  },
  Uint16Array: {
    value: Uint16Array = (function() {
      class Uint16Array extends TypedArray {};

      Uint16Array.prototype.realizeWith = defaults.Uint16Array;

      return Uint16Array;

    }).call(this)
  },
  Uint32Array: {
    value: Uint32Array = (function() {
      class Uint32Array extends TypedArray {};

      Uint32Array.prototype.realizeWith = defaults.Uint32Array;

      return Uint32Array;

    }).call(this)
  },
  Int32Array: {
    value: Int32Array = (function() {
      class Int32Array extends TypedArray {};

      Int32Array.prototype.realizeWith = defaults.Int32Array;

      return Int32Array;

    }).call(this)
  },
  Float32Array: {
    value: Float32Array = (function() {
      class Float32Array extends TypedArray {};

      Float32Array.prototype.realizeWith = defaults.Float32Array;

      return Float32Array;

    }).call(this)
  },
  Float64Array: {
    value: Float64Array = (function() {
      class Float64Array extends TypedArray {};

      Float64Array.prototype.realizeWith = defaults.Float64Array;

      return Float64Array;

    }).call(this)
  },
  BigUint64Array: {
    value: BigUint64Array = (function() {
      class BigUint64Array extends TypedArray {};

      BigUint64Array.prototype.realizeWith = defaults.BigUint64Array;

      return BigUint64Array;

    }).call(this)
  },
  BigInt64Array: {
    value: BigInt64Array = (function() {
      class BigInt64Array extends TypedArray {};

      BigInt64Array.prototype.realizeWith = defaults.BigInt64Array;

      return BigInt64Array;

    }).call(this)
  }
});

export {
  TypedArray as default,
  TypedArray,
  defaults,
  Pointer
};
