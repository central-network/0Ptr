var BigInt64Array, BigUint64Array, Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, TypedArray, Uint16Array, Uint32Array, Uint8Array, isBridge, isCPU, n, object;

import KEYOF from "./0ptr_keyof.js";

import {
  defaults
} from "./0ptr_self.js";

import {
  Pointer
} from "./0ptr_pointer.js";

isCPU = /cpu/.test(name);

isBridge = (typeof WorkerGlobalScope !== "undefined" && WorkerGlobalScope !== null) && !isCPU;

TypedArray = (function() {
  class TypedArray extends Pointer {};

  TypedArray.byteLength = 9392314;

  Object.defineProperties(TypedArray.prototype, {
    proxyOnCPU: {
      value: true
    },
    //? in loop look enumerable and we locking then
    lock: {
      enumerable: true,
      get: function() {
        if (isBridge) {
          return memory.lock(7);
        }
      },
      set: function() {
        if (isBridge) {
          return memory.lock(7);
        }
      }
    }
  });

  return TypedArray;

}).call(this);

Object.defineProperties(self, {
  Uint8Array: {
    value: (Uint8Array = class Uint8Array extends TypedArray {})
  },
  Int8Array: {
    value: (Int8Array = class Int8Array extends TypedArray {})
  },
  Int16Array: {
    value: (Int16Array = class Int16Array extends TypedArray {})
  },
  Uint16Array: {
    value: (Uint16Array = class Uint16Array extends TypedArray {})
  },
  Uint32Array: {
    value: (Uint32Array = class Uint32Array extends TypedArray {})
  },
  Int32Array: {
    value: (Int32Array = class Int32Array extends TypedArray {})
  },
  Float32Array: {
    value: (Float32Array = class Float32Array extends TypedArray {})
  },
  Float64Array: {
    value: (Float64Array = class Float64Array extends TypedArray {})
  },
  BigUint64Array: {
    value: (BigUint64Array = class BigUint64Array extends TypedArray {})
  },
  BigInt64Array: {
    value: (BigInt64Array = class BigInt64Array extends TypedArray {})
  }
});

for (n in defaults) {
  object = defaults[n];
  if (!object.BYTES_PER_ELEMENT) {
    continue;
  }
  (function() {
    return Object.defineProperties(self[this.name].prototype, {
      realizeWith: {
        value: this
      },
      BYTES_PER_ELEMENT: {
        value: this.BYTES_PER_ELEMENT
      },
      [Symbol.iterator]: {
        value: function() {
          var done, length;
          if (isCPU && !memory.loadUint32(7)) {
            //? if cpu reaches before bridge?
            memory.lock(7);
          }
          //? this settlement cpu's + bridge
          length = this.length;
          done = true;
          if (isBridge) {
            //? this settlement only bridge
            this.iterate(0);
            //? all cpu's start calculate
            memory.storeUint32(7, 1);
            memory.unlock(7);
            //? bridge stay still
            memory.lock(6);
          }
          return {
            next: (function() {
              var value;
              if (isBridge) {
                return {done};
              }
              if (length > (value = this.iterate())) {
                return {value};
              } else {
                memory.unlock(6);
                return {done};
              }
            }).bind(this)
          };
        }
      }
    });
  }).call(object);
}

export {
  TypedArray as default,
  TypedArray,
  defaults,
  Pointer
};
