if (typeof document !== "undefined" && document !== null) {
  Object.defineProperties(Node, {
    byteLength: {
      value: 4 * 64
    }
  });
}

Object.defineProperties(SharedArrayBuffer.prototype, {
  SYMBOL_0PTR: {
    value: Symbol("0Ptr")
  },
  LITTLE_ENDIAN: {
    value: new Uint8Array(Uint32Array.of(1).buffer)[0] === 1
  },
  BYTES_PER_ELEMENT: {
    value: 4
  },
  ITEMS_PER_POINTER: {
    value: 12
  },
  BEGIN: {
    value: 12
  },
  BYTES_PER_POINTER: {
    value: 4 * 12
  },
  INDEX_OFFSET: {
    value: 0
  },
  INDEX_LENGTH: {
    value: 1
  },
  INDEX_COUNT: {
    value: 2
  },
  INDEX_NEXT: {
    value: 3
  },
  DEFINE_INTEGER_ATOMICS: {
    value: true
  },
  DEFINE_WAITLOCK_ATOMICS: {
    value: true
  },
  DEFINE_FLOAT_ATOMICS: {
    value: true
  },
  DEFINE_EXCHANGE_ATOMICS: {
    value: true
  },
  DEFINE_DVIEW_MODIFIERS: {
    value: true
  },
  DEFINE_TARRAY_MODIFIERS: {
    value: true
  },
  defineIntegerAtomics: {
    value: function() {
      var caller, i, len, namePrefix, nameSuffix;
      if (!this.DEFINE_INTEGER_ATOMICS) {
        return this;
      }
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      namePrefix = ["sub", "load", "store", "and", "or", "xor", "add"];
      for (i = 0, len = namePrefix.length; i < len; i++) {
        caller = namePrefix[i];
        Object.defineProperty(this, caller + nameSuffix, {
          value: Atomics[caller].bind(Atomics, arguments[0])
        });
      }
      return this;
    }
  },
  defineWaitLockAtomics: {
    value: function() {
      var caller, i, len, namePrefix, nameSuffix;
      if (!this.DEFINE_WAITLOCK_ATOMICS) {
        return this;
      }
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      namePrefix = ["wait", "notify", "waitAsync"];
      for (i = 0, len = namePrefix.length; i < len; i++) {
        caller = namePrefix[i];
        Object.defineProperty(this, caller + nameSuffix, {
          value: Atomics[caller].bind(Atomics, arguments[0])
        });
      }
      return this;
    }
  },
  defineFloatAtomics: {
    value: function() {
      var FloatArray, UintArray, caller, floatArray, handle, i, j, len, len1, namePrefix, nameSuffix, uIntArray;
      if (!this.DEFINE_FLOAT_ATOMICS) {
        return this;
      }
      [floatArray, uIntArray] = arguments[0];
      [FloatArray, UintArray] = [floatArray.constructor, uIntArray.constructor];
      nameSuffix = floatArray.constructor.name.replace(/View|Array/, "");
      namePrefix = ["add", "sub", "store", "and", "or", "xor"];
      for (i = 0, len = namePrefix.length; i < len; i++) {
        caller = namePrefix[i];
        handle = Atomics[caller].bind(Atomics, uIntArray);
        Object.defineProperty(this, caller + nameSuffix, {
          value: function() {
            return handle(arguments[0], new UintArray(FloatArray.of(arguments[1]).buffer)[0]);
          }
        });
      }
      namePrefix = ["load"];
      for (j = 0, len1 = namePrefix.length; j < len1; j++) {
        caller = namePrefix[j];
        handle = Atomics[caller].bind(Atomics, uIntArray);
        Object.defineProperty(this, caller + nameSuffix, {
          value: function() {
            return new FloatArray(UintArray.of(handle(arguments[0])).buffer)[0];
          }
        });
      }
      return this;
    }
  },
  defineExchangeAtomics: {
    value: function() {
      var caller, i, len, namePrefix, nameSuffix;
      if (!this.DEFINE_EXCHANGE_ATOMICS) {
        return this;
      }
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      namePrefix = ["exchange", "compareExchange"];
      for (i = 0, len = namePrefix.length; i < len; i++) {
        caller = namePrefix[i];
        Object.defineProperty(this, caller + nameSuffix, {
          value: Atomics[caller].bind(Atomics, arguments[0])
        });
      }
      return this;
    }
  },
  defineDataViewModifiers: {
    value: function() {
      var caller, dataView, handle, i, len, nameSuffix, ref;
      if (!this.DEFINE_DVIEW_MODIFIERS) {
        return this;
      }
      dataView = arguments[1];
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      ref = ["get", "set"];
      for (i = 0, len = ref.length; i < len; i++) {
        caller = ref[i];
        caller = caller + nameSuffix;
        handle = dataView[caller].bind(dataView);
        Object.defineProperty(this, caller, {
          value: function() {
            return handle(arguments[0], this.LITTLE_ENDIAN);
          }
        });
      }
      return this;
    }
  },
  defineTArrayModifiers: {
    value: function() {
      var caller, i, len, modifiers, nameSuffix, results;
      if (!this.DEFINE_TARRAY_MODIFIERS) {
        return this;
      }
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      caller = `at${nameSuffix}`;
      Object.defineProperty(this, caller, {
        value: function() {
          return typedArray[arguments[0]];
        }
      });
      caller = `setarray${nameSuffix}`;
      Object.defineProperty(this, caller, {
        value: function() {
          return typedArray.set(arguments[0], arguments[1]);
        }
      });
      modifiers = ["subarray", "fill", "slice", "copyWithin", "entries", "every", "filter", "find", "findIndex", "findLast", "findLastIndex", "forEach", "includes", "indexOf", "join", "keys", "lastIndexOf", "map", "reduce", "reduceRight", "reverse", "some", "sort", "values", "with"];
      results = [];
      for (i = 0, len = modifiers.length; i < len; i++) {
        caller = modifiers[i];
        results.push(Object.defineProperty(this, caller + nameSuffix, {
          value: arguments[0][caller].bind(arguments[0])
        }));
      }
      return results;
    }
  },
  scope: {
    value: new Object
  },
  init: {
    value: function() {
      var arrayPairs, dvw, f32, f64, i, i16, i32, i64, ii8, j, k, l, len, len1, len2, len3, len4, len5, m, n, ref, ref1, ref2, ref3, ref4, ref5, typedArray, u16, u32, u64, ui8;
      Object.defineProperties(this, {
        ["#thread"]: {
          value: arguments[0]
        }
      });
      ui8 = new Uint8Array(this);
      ii8 = new Int8Array(this);
      i16 = new Int16Array(this);
      u16 = new Uint16Array(this);
      u32 = new Uint32Array(this);
      i32 = new Int32Array(this);
      f32 = new Float32Array(this);
      f64 = new Float64Array(this);
      u64 = new BigUint64Array(this);
      i64 = new BigInt64Array(this);
      dvw = new DataView(this);
      ref = [ui8, ii8, u16, i16, u32, i32, u64, i64];
      for (i = 0, len = ref.length; i < len; i++) {
        typedArray = ref[i];
        this.defineIntegerAtomics.call(this, typedArray);
      }
      ref1 = [ui8, ii8, u16, i16, u32, i32, u64, i64];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        typedArray = ref1[j];
        this.defineExchangeAtomics.call(this, typedArray);
      }
      ref2 = [i32, i64];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        typedArray = ref2[k];
        this.defineWaitLockAtomics.call(this, typedArray);
      }
      ref3 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        typedArray = ref3[l];
        this.defineDataViewModifiers.call(this, typedArray, dvw);
      }
      ref4 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
      for (m = 0, len4 = ref4.length; m < len4; m++) {
        typedArray = ref4[m];
        this.defineTArrayModifiers.call(this, typedArray);
      }
      ref5 = [[f32, i32], [f64, i64]];
      for (n = 0, len5 = ref5.length; n < len5; n++) {
        arrayPairs = ref5[n];
        this.defineFloatAtomics.call(this, arrayPairs);
      }
      if (!ui8.length) {
        this.grow(this.BEGIN * this.BYTES_PER_ELEMENT);
      }
      if (!this.orUint32(this.INDEX_OFFSET, this.BEGIN * this.BYTES_PER_ELEMENT)) {
        this.length = this.BEGIN;
      }
      return self.base = this;
    }
  },
  get: {
    value: function(ptri) {
      var ref;
      return (ref = this.scope[`${ptri}`]) != null ? ref.deref() : void 0;
    }
  },
  set: {
    value: function(object, ptri) {
      Object.defineProperty(this.scope, ptri, {
        value: new WeakRef(object)
      });
      return ptri;
    }
  },
  add: {
    value: function(object) {
      var ptri;
      if (!Object.hasOwn(object, this.SYMBOL_0PTR)) {
        Object.defineProperty(object, this.SYMBOL_0PTR, {
          value: ptri = this.malloc(object)
        });
        this.set(object, ptri);
      }
      return this.get(object[this.SYMBOL_0PTR]);
    }
  },
  find: {
    value: function() {
      var i, len, object, ptri, ref;
      ref = Object.getOwnPropertyNames(this.scope);
      for (i = 0, len = ref.length; i < len; i++) {
        ptri = ref[i];
        object = this.scope[ptri].deref();
        if (object === arguments[0]) {
          return object;
        }
      }
      return null;
    }
  },
  malloc: {
    value: function() {
      var byteLength, byteOffset, index4, length, offset, protoClass;
      protoClass = arguments[0].constructor;
      byteLength = this.BYTES_PER_POINTER;
      if (protoClass != null ? protoClass.byteLength : void 0) {
        byteLength += protoClass.byteLength;
      }
      if (this.byteLength < (byteOffset = byteLength + this.byteOffset)) {
        byteOffset += this.BYTES_PER_ELEMENT * 4096;
        if (this.maxByteLength < byteOffset) {
          throw ["MAX_GROWABLE_MEMORY_LENGTH_EXCEED", this];
        }
        this.grow(byteOffset);
      }
      this.addUint32(this.INDEX_COUNT, 1);
      length = byteLength / 4;
      index4 = this.addUint32(this.INDEX_LENGTH, length);
      offset = this.addUint32(this.INDEX_OFFSET, byteLength);
      this.storeUint32(index4 + 0, length);
      this.storeUint32(index4 + 2, byteLength);
      this.storeUint32(index4 + 3, length - this.ITEMS_PER_POINTER);
      this.storeUint32(index4 + 4, byteLength - this.BYTES_PER_POINTER);
      return index4;
    }
  },
  byteOffset: {
    get: function() {
      return this.loadUint32(this.INDEX_OFFSET);
    },
    set: function() {
      return this.storeUint32(this.INDEX_OFFSET, arguments[0]);
    }
  },
  //? sab length
  length: {
    get: function() {
      return this.loadUint32(this.INDEX_LENGTH);
    },
    set: function() {
      return this.storeUint32(this.INDEX_LENGTH, arguments[0]);
    }
  },
  //? scope length
  count: {
    get: function() {
      return this.loadUint32(this.INDEX_COUNT);
    },
    set: function() {
      return this.storeUint32(this.INDEX_COUNT, arguments[0]);
    }
  },
  //? iteration index
  index: {
    get: function() {
      var index, length;
      index = this.loadUint32(this.INDEX_NEXT);
      length = this.loadUint32(index);
      this.addUint32(this.INDEX_NEXT, length);
      return index;
    },
    set: function() {
      return this.storeUint32(this.INDEX_NEXT, this.BEGIN + arguments[0]);
    }
  },
  reset: {
    value: function() {
      this.storeUint32(this.INDEX_NEXT, this.BEGIN);
      return this;
    }
  }
});

Object.defineProperties(SharedArrayBuffer.prototype, {
  [Symbol.iterator]: {
    value: function() {
      return {
        next: (function() {
          var value;
          if (!(value = this.get(this.index))) {
            return {
              done: true
            };
          }
          return {value};
        }).bind(this.reset())
      };
    }
  }
});

Object.defineProperties(Object.prototype, {
  sab: {
    configurable: true,
    value: new SharedArrayBuffer(0, {
      maxByteLength: Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 1, 11)
    }).init((typeof window !== "undefined" && window !== null) && "window" || "worker")
  },
  ptr: {
    value: function() {
      var di, ref, res;
      res = {
        get: this.sab.add(this),
        set: this.sab.add(window),
        tet: this.sab.add(new Set()),
        a: this.sab.find("this"),
        det: this.sab.add((function() {
          return 1;
        })),
        def: this.sab.add(window)
      };
      console.log(res);
      ref = this.sab;
      for (di of ref) {
        console.log("iteri", di);
      }
      return res;
    }
  }
});
