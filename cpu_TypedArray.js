var BigInt64Array, BigUint64Array, Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, TypedArray, Uint16Array, Uint32Array, Uint8Array;

import {
  defaults
} from "./0Ptr_self.js";

import {
  Pointer
} from "./cpu_pointer.js";

TypedArray = (function() {
  class TypedArray extends Pointer {
    //*   headers has 4 items:
    //* - nexti4     : memory's next index  index4(ptr) + 8 (head + data(ptr))
    //* - byteLength : data byte [not aligned] length {it's 0 when deleted} 
    //* - parent     : if this record has parent record
    //* - type       : protoclass of TypedArrayPointer

    //?   typed array pointers needs 4 elements:
    //? - index4 : start index of targeted Typed Array's header
    //? - begin  : beginning of array's content   - index of 1/2/4/8 
    //? - end    : end of content
    //? - type   : protoclass of TypedArray (Uint8Array etc.)
    constructor() {
      //console.warn ResolveCall()
      if (!arguments.length) {
        throw ["POINTER_NEEDS_ARGS"];
      }
      super();
    }

    //[ buffer, byteOffset, length ] = arguments

    //unless isNaN buffer
    //    @alloc buffer

    // todo clone needed
    //else if ArrayBuffer.isView buffer
    //    @alloc buffer.length

    //else if Array.isArray buffer
    //    @alloc buffer.length

    //else if buffer.byteLength
    //    @alloc buffer.byteLength / @BYTES_PER_ELEMENT

    //else throw [ "What is this", arguments... ] 
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

  Object.defineProperties(TypedArray.prototype, {
    array: {
      get: function() {
        return this.subarray();
      }
    }
  });

  return TypedArray;

}).call(this);

Object.defineProperties(self, {
  Uint8Array: {
    value: Uint8Array = (function() {
      class Uint8Array extends TypedArray {};

      Uint8Array.protoclass = Uint8Array.scopei();

      Uint8Array.prototype.realizeWith = defaults.Uint8Array;

      return Uint8Array;

    }).call(this)
  },
  Int8Array: {
    value: Int8Array = (function() {
      class Int8Array extends TypedArray {};

      Int8Array.protoclass = Int8Array.scopei();

      Int8Array.prototype.realizeWith = defaults.Int8Array;

      return Int8Array;

    }).call(this)
  },
  Int16Array: {
    value: Int16Array = (function() {
      class Int16Array extends TypedArray {};

      Int16Array.protoclass = Int16Array.scopei();

      Int16Array.prototype.realizeWith = defaults.Int16Array;

      return Int16Array;

    }).call(this)
  },
  Uint16Array: {
    value: Uint16Array = (function() {
      class Uint16Array extends TypedArray {};

      Uint16Array.protoclass = Uint16Array.scopei();

      Uint16Array.prototype.realizeWith = defaults.Uint16Array;

      return Uint16Array;

    }).call(this)
  },
  Uint32Array: {
    value: Uint32Array = (function() {
      class Uint32Array extends TypedArray {};

      Uint32Array.protoclass = Uint32Array.scopei();

      Uint32Array.prototype.realizeWith = defaults.Uint32Array;

      return Uint32Array;

    }).call(this)
  },
  Int32Array: {
    value: Int32Array = (function() {
      class Int32Array extends TypedArray {};

      Int32Array.protoclass = Int32Array.scopei();

      Int32Array.prototype.realizeWith = defaults.Int32Array;

      return Int32Array;

    }).call(this)
  },
  Float32Array: {
    value: Float32Array = (function() {
      class Float32Array extends TypedArray {};

      Float32Array.protoclass = Float32Array.scopei();

      Float32Array.prototype.realizeWith = defaults.Float32Array;

      return Float32Array;

    }).call(this)
  },
  Float64Array: {
    value: Float64Array = (function() {
      class Float64Array extends TypedArray {};

      Float64Array.protoclass = Float64Array.scopei();

      Float64Array.prototype.realizeWith = defaults.Float64Array;

      return Float64Array;

    }).call(this)
  },
  BigUint64Array: {
    value: BigUint64Array = (function() {
      class BigUint64Array extends TypedArray {};

      BigUint64Array.protoclass = BigUint64Array.scopei();

      BigUint64Array.prototype.realizeWith = defaults.BigUint64Array;

      return BigUint64Array;

    }).call(this)
  },
  BigInt64Array: {
    value: BigInt64Array = (function() {
      class BigInt64Array extends TypedArray {};

      BigInt64Array.protoclass = BigInt64Array.scopei();

      BigInt64Array.prototype.realizeWith = defaults.BigInt64Array;

      return BigInt64Array;

    }).call(this)
  }
});

export {
  TypedArray as default,
  TypedArray,
  defaults
};
