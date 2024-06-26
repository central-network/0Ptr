export var Thread = (function() {
  class Thread {
    constructor(buffer) {
      this.offset = self.name * 1000;
      this.buffer = buffer;
      Object.defineProperties(Pointer.prototype, {
        buffer: {
          value: buffer
        }
      });
      //console.log "pointer buffer settled up", buffer
      addEventListener("message", (e) => {
        return arguments[0].call(new Window(new Thread(e.data)));
      });
    }

    
    //@defineProperties()
    defineIntegerAtomics() {
      var caller, i, len, namePrefix, nameSuffix;
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

    defineWaitLockAtomics() {
      var caller, i, len, namePrefix, nameSuffix;
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

    defineFloatAtomics() {
      var FloatArray, UintArray, caller, floatArray, handle, i, j, len, len1, namePrefix, nameSuffix, uIntArray;
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

    defineExchangeAtomics() {
      var caller, i, len, namePrefix, nameSuffix;
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

    defineDataViewModifiers() {
      var caller, dataView, handle, i, len, littleEndian, nameSuffix, ref;
      dataView = arguments[1];
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      littleEndian = Boolean(new Uint8Array(Uint32Array.of(1).buffer).at(0));
      ref = ["get", "set"];
      for (i = 0, len = ref.length; i < len; i++) {
        caller = ref[i];
        caller = caller + nameSuffix;
        handle = dataView[caller].bind(dataView);
        Object.defineProperty(this, caller, {
          value: function() {
            return handle(arguments[0], littleEndian);
          }
        });
      }
      return this;
    }

    defineTArrayModifiers() {
      var TypedArray, caller, constructor, handle, i, len, modifiers, nameSuffix, results;
      TypedArray = arguments[0];
      constructor = TypedArray.constructor;
      nameSuffix = constructor.name.replace(/View|Array/, "");
      caller = `at${nameSuffix}`;
      Object.defineProperty(this, caller, {
        value: function() {
          return TypedArray[arguments[0]];
        }
      });
      caller = `setarray${nameSuffix}`;
      Object.defineProperty(this, caller, {
        value: function() {
          return TypedArray.set(arguments[0], arguments[1]);
        }
      });
      modifiers = ["subarray", "fill", "slice", "copyWithin", "entries", "every", "filter", "find", "findIndex", "findLast", "findLastIndex", "forEach", "includes", "indexOf", "join", "keys", "lastIndexOf", "map", "reduce", "reduceRight", "reverse", "some", "sort", "values", "with"];
      results = [];
      for (i = 0, len = modifiers.length; i < len; i++) {
        caller = modifiers[i];
        handle = caller + nameSuffix;
        Object.defineProperty(this, handle, {
          value: arguments[0][caller].bind(arguments[0])
        });
        if (Object.hasOwn(constructor, caller)) {
          continue;
        }
        results.push(Object.defineProperty(constructor, caller, {
          value: handle
        }));
      }
      return results;
    }

    defineProperties() {
      var TypedArray, arrayPairs, dvw, f32, f64, i, i16, i32, i64, ii8, j, k, l, len, len1, len2, len3, len4, len5, m, n, ref, ref1, ref2, ref3, ref4, ref5, u16, u32, u64, ui8;
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
        TypedArray = ref[i];
        this.defineIntegerAtomics(TypedArray);
      }
      ref1 = [ui8, ii8, u16, i16, u32, i32, u64, i64];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        TypedArray = ref1[j];
        this.defineExchangeAtomics(TypedArray);
      }
      ref2 = [i32, i64];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        TypedArray = ref2[k];
        this.defineWaitLockAtomics(TypedArray);
      }
      ref3 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        TypedArray = ref3[l];
        this.defineDataViewModifiers(TypedArray, dvw);
      }
      ref4 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
      for (m = 0, len4 = ref4.length; m < len4; m++) {
        TypedArray = ref4[m];
        this.defineTArrayModifiers(TypedArray);
      }
      ref5 = [[f32, i32], [f64, i64]];
      for (n = 0, len5 = ref5.length; n < len5; n++) {
        arrayPairs = ref5[n];
        this.defineFloatAtomics(arrayPairs);
      }
      return this;
    }

  };

  Thread.uuid = crypto.randomUUID();

  Thread.maxLength = Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11) / 4;

  Thread.maxByteLength = Thread.maxLength * 4;

  return Thread;

}).call(this);
