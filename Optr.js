var Display, HTMLDocument, Pointer, RefLink, Scope, Thread, Viewport, Window;

if (typeof document !== "undefined" && document !== null) {
  queueMicrotask(function() {
    var code, data, head, i, init, j, ref, results, size, type;
    size = Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11) / 4;
    data = new SharedArrayBuffer(4, {
      maxByteLength: size
    });
    Atomics.store(new Uint32Array(data), 0, 2);
    Atomics.store(new Uint32Array(data), 0, 8);
    code = document.currentScript.text || (function() {
      throw ["NEED_SOME_CODE"];
    })();
    type = document.currentScript.type || "application/javascript";
    head = (() => {
      var imports, libs, names, url;
      imports = [Window, HTMLDocument, Thread, Scope, Pointer];
      libs = imports.flatMap(function(m) {
        return ["export ", m, "\n\n"];
      });
      names = imports.map(function(m) {
        return m.name;
      }).join(", ");
      url = URL.createObjectURL(new Blob(libs, {type}));
      return `import {${names}} from '${url}';\n`;
    })();
    init = function(onready) {
      return addEventListener("message", function(e) {
        var window;
        self.window = new (window = class window extends Window {});
        return onready.call(new Thread(e.data));
      });
    };
    results = [];
    for (i = j = 0, ref = (typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0) || 2; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      results.push(new Worker(URL.createObjectURL(new Blob([`${head}(${init})(${code})`.replace(/\s+/g, " ")], {type})), {
        type: "module",
        name: i
      }).postMessage(data));
    }
    return results;
  });
}

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

Window = class Window {
  constructor() {
    var document;
    Object.defineProperties(this, {
      document: {
        value: new (document = class document extends HTMLDocument {})
      }
    });
    Object.defineProperties(Thread, {
      uuid: {
        value: crypto.randomUUID()
      },
      maxLength: {
        value: Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11) / 4
      },
      maxByteLength: {
        value: Thread.maxLength * 4
      }
    });
    self.document = this.document;
  }

};

HTMLDocument = class HTMLDocument {
  getElementById() {}

};

Thread = class Thread {
  constructor(buffer) {
    this.name = self.name;
    Object.defineProperties(Pointer.prototype, {
      buffer: {
        value: buffer
      }
    });
  }

  //console.log "pointer buffer settled up", buffer

  //@defineProperties()
  defineIntegerAtomics() {
    var caller, j, len, namePrefix, nameSuffix;
    nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
    namePrefix = ["sub", "load", "store", "and", "or", "xor", "add"];
    for (j = 0, len = namePrefix.length; j < len; j++) {
      caller = namePrefix[j];
      Object.defineProperty(this, caller + nameSuffix, {
        value: Atomics[caller].bind(Atomics, arguments[0])
      });
    }
    return this;
  }

  defineWaitLockAtomics() {
    var caller, j, len, namePrefix, nameSuffix;
    nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
    namePrefix = ["wait", "notify", "waitAsync"];
    for (j = 0, len = namePrefix.length; j < len; j++) {
      caller = namePrefix[j];
      Object.defineProperty(this, caller + nameSuffix, {
        value: Atomics[caller].bind(Atomics, arguments[0])
      });
    }
    return this;
  }

  defineFloatAtomics() {
    var FloatArray, UintArray, caller, floatArray, handle, j, k, len, len1, namePrefix, nameSuffix, uIntArray;
    [floatArray, uIntArray] = arguments[0];
    [FloatArray, UintArray] = [floatArray.constructor, uIntArray.constructor];
    nameSuffix = floatArray.constructor.name.replace(/View|Array/, "");
    namePrefix = ["add", "sub", "store", "and", "or", "xor"];
    for (j = 0, len = namePrefix.length; j < len; j++) {
      caller = namePrefix[j];
      handle = Atomics[caller].bind(Atomics, uIntArray);
      Object.defineProperty(this, caller + nameSuffix, {
        value: function() {
          return handle(arguments[0], new UintArray(FloatArray.of(arguments[1]).buffer)[0]);
        }
      });
    }
    namePrefix = ["load"];
    for (k = 0, len1 = namePrefix.length; k < len1; k++) {
      caller = namePrefix[k];
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
    var caller, j, len, namePrefix, nameSuffix;
    nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
    namePrefix = ["exchange", "compareExchange"];
    for (j = 0, len = namePrefix.length; j < len; j++) {
      caller = namePrefix[j];
      Object.defineProperty(this, caller + nameSuffix, {
        value: Atomics[caller].bind(Atomics, arguments[0])
      });
    }
    return this;
  }

  defineDataViewModifiers() {
    var caller, dataView, handle, j, len, littleEndian, nameSuffix, ref;
    dataView = arguments[1];
    nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
    littleEndian = Boolean(new Uint8Array(Uint32Array.of(1).buffer).at(0));
    ref = ["get", "set"];
    for (j = 0, len = ref.length; j < len; j++) {
      caller = ref[j];
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
    var TypedArray, caller, constructor, handle, j, len, modifiers, nameSuffix, results;
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
    for (j = 0, len = modifiers.length; j < len; j++) {
      caller = modifiers[j];
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
    var TypedArray, arrayPairs, dvw, f32, f64, i16, i32, i64, ii8, j, k, l, len, len1, len2, len3, len4, len5, n, o, p, ref, ref1, ref2, ref3, ref4, ref5, u16, u32, u64, ui8;
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
    for (j = 0, len = ref.length; j < len; j++) {
      TypedArray = ref[j];
      this.defineIntegerAtomics(TypedArray);
    }
    ref1 = [ui8, ii8, u16, i16, u32, i32, u64, i64];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      TypedArray = ref1[k];
      this.defineExchangeAtomics(TypedArray);
    }
    ref2 = [i32, i64];
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      TypedArray = ref2[l];
      this.defineWaitLockAtomics(TypedArray);
    }
    ref3 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
    for (n = 0, len3 = ref3.length; n < len3; n++) {
      TypedArray = ref3[n];
      this.defineDataViewModifiers(TypedArray, dvw);
    }
    ref4 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
    for (o = 0, len4 = ref4.length; o < len4; o++) {
      TypedArray = ref4[o];
      this.defineTArrayModifiers(TypedArray);
    }
    ref5 = [[f32, i32], [f64, i64]];
    for (p = 0, len5 = ref5.length; p < len5; p++) {
      arrayPairs = ref5[p];
      this.defineFloatAtomics(arrayPairs);
    }
    return this;
  }

};

Scope = (function() {
  class Scope extends Array {
    constructor() {
      super().push(null);
    }

    get() {
      return this[arguments[0]].deref();
    }

    has() {
      var i, j, object, ref;
      object = arguments[0];
      if (!this.map.has(object)) {
        return;
      }
      for (i = j = 1, ref = this.length; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
        if (object === this.get(i)) {
          return i;
        }
      }
      return false;
    }

    add() {
      if (!this.map.has(arguments[0])) {
        this.map.set(arguments[0], this.set(arguments[0]));
      }
      return this.map.get(arguments[0]);
    }

    set() {
      var i, object;
      [object, i] = [...arguments, this.length];
      (this[i] = new WeakRef(object));
      return i;
    }

  };

  Scope.prototype.map = new WeakMap();

  return Scope;

}).call(this);

Pointer = (function() {
  class Pointer extends Number {
    toPointer() {
      return this;
    }

    constructor() {
      if (!arguments.length) {
        return super(Pointer.GetNewIndex).setHeadersFrom(this.constructor);
      }
      super(arguments[0]).usePrototype(arguments[1]);
    }

    setHeadersFrom() {
      var TypedArray, begin, byteLength, byteOffset, constructr, end, length, protoclass;
      constructr = arguments[0];
      TypedArray = constructr.TypedArray;
      protoclass = this.scope.add(constructr.prototype);
      byteLength = constructr.byteLength || 0;
      byteOffset = Pointer.malloc(byteLength);
      begin = byteOffset / 4;
      end = begin + byteLength / 4;
      length = byteLength / TypedArray.BYTES_PER_ELEMENT;
      this.storeHeader(this.HINDEX_PROTOCLASS, protoclass);
      this.storeHeader(this.HINDEX_BEGIN, begin);
      this.storeHeader(this.HINDEX_END, end);
      this.storeHeader(this.HINDEX_LENGTH, length);
      this.storeHeader(this.HINDEX_BYTEOFFSET, byteOffset);
      this.storeHeader(this.HINDEX_BYTELENGTH, byteLength);
      this.storeHeader(this.HINDEX_BYTEFINISH, byteOffset + byteLength);
      return this;
    }

    loadHeader() {
      return Pointer.header.loadUint32(this + (arguments[0] || 0));
    }

    storeHeader() {
      Pointer.header.storeUint32(this + arguments[0], arguments[1]);
      return this;
    }

    usePrototype() {
      var protoclass, ref;
      if (this.constructor !== Pointer) {
        return this;
      }
      protoclass = (ref = arguments[0]) != null ? ref : this.scope.get(this.loadHeader(this.HINDEX_PROTOCLASS));
      return Object.setPrototypeOf(this, protoclass);
    }

    add() {
      var ptr;
      if (!(ptr = arguments[0])) {
        return;
      }
      if (!(ptr instanceof Pointer)) {
        ptr = ptr.toPointer();
      }
      return ptr.storeHeader(this.HINDEX_PARENT, this);
    }

  };

  Pointer.TypedArray = Uint32Array;

  Pointer.byteLength = 0;

  Pointer.prototype.scope = new Scope();

  Pointer.prototype.HINDEX_PROTOCLASS = 7;

  Pointer.prototype.HINDEX_BEGIN = 0;

  Pointer.prototype.HINDEX_END = 1;

  Pointer.prototype.HINDEX_LENGTH = 2;

  Pointer.prototype.HINDEX_PARENT = 3;

  Pointer.prototype.HINDEX_BYTEOFFSET = 4;

  Pointer.prototype.HINDEX_BYTELENGTH = 5;

  Pointer.prototype.HINDEX_BYTEFINISH = 6;

  Pointer.prototype.HINDEX_RESERVED = 7;

  return Pointer;

}).call(this);

Object.defineProperties(Pointer, {
  ITEMS_PER_POINTER: {
    value: 12
  },
  BYTES_PER_POINTER: {
    value: 4 * 12
  },
  buffer: {
    configurable: true,
    value: 2 //new Thread( 4 * 1e7 )
  },
  array: {
    value: function() {}
  },
  
  //! <--- HEADER's SHARED ARRAY BUFFER ONLY
  header: {
    configurable: true,
    value: 1 //new Thread( 12 * 1e5 )
  },
  GetNewIndex: {
    get: function() {
      return 1;
      this.header.addUint32(0, this.BYTES_PER_POINTER);
      return this.header.addUint32(1, this.ITEMS_PER_POINTER);
    }
  },
  length: {
    get: function() {
      return this.header.loadUint32(1);
    }
  },
  malloc: {
    value: function(byteLength = 0) {
      return this.header.addUint32(3, byteLength);
    }
  }
});

//! HEADER's SHARED ARRAY BUFFER ONLY --->
[Pointer.GetNewIndex, self.base = Pointer.prototype.scope];

RefLink = class RefLink extends Pointer {};

Object.defineProperties(RefLink.prototype, {
  HINDEX_SCOPEI: {
    value: 1 + Pointer.prototype.HINDEX_RESERVED
  },
  setRef: {
    value: function() {
      var scopei;
      scopei = this.scope.add(arguments[0]);
      this.storeHeader(this.HINDEX_SCOPEI, scopei);
      return this;
    }
  },
  link: {
    get: function() {
      return this.scope.get(this.loadHeader(this.HINDEX_SCOPEI));
    }
  }
});

Object.defineProperties(Boolean.prototype, {
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
      if (!Object.hasOwn(object, Symbol.pointer)) {
        Object.defineProperty(object, Symbol.pointer, {
          value: ptri = this.malloc(object)
        });
        this.set(object, ptri);
      }
      return this.get(object[Symbol.pointer]);
    }
  },
  find: {
    value: function() {
      var j, len, object, ptri, ref;
      ref = Object.getOwnPropertyNames(this.scope);
      for (j = 0, len = ref.length; j < len; j++) {
        ptri = ref[j];
        object = this.scope[ptri].deref();
        if (object === arguments[0]) {
          return object;
        }
      }
      return null;
    }
  },
  malloc2: {
    value: function() {
      var byteLength, byteOffset, index4, length, offset, protoclass;
      protoclass = arguments[0].constructor;
      byteLength = this.BYTES_PER_POINTER;
      if (protoclass != null ? protoclass.byteLength : void 0) {
        byteLength += protoclass.byteLength;
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
      this.storeUint32(index4 + 1, byteLength);
      this.storeUint32(index4 + 2, length - this.ITEMS_PER_POINTER);
      this.storeUint32(index4 + 3, byteLength - this.BYTES_PER_POINTER);
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
  iterator: {
    value: function() {
      this.storeUint32(this.INDEX_NEXT, this.BEGIN);
      return () => {
        var value;
        if (!(value = this.get(this.index))) {
          return {
            done: true
          };
        }
        return {value};
      };
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  findAllChilds: {
    value: function(protoclass) {
      var childs, hindex, length, offset, parent, pclass, stride;
      offset = hindex = Pointer.prototype.HINDEX_PARENT;
      pclass = Pointer.prototype.HINDEX_PROTOCLASS - hindex;
      stride = Pointer.ITEMS_PER_POINTER;
      length = Pointer.length;
      parent = this * 1;
      childs = [];
      if (protoclass) {
        protoclass = this.scope.has(protoclass.prototype);
      }
      while (length > (offset += stride)) {
        if (parent === Pointer.header.loadUint32(offset)) {
          if (protoclass && protoclass - Pointer.header.loadUint32(offset + pclass)) {
            continue;
          }
          childs.push(new Pointer(offset - hindex));
        }
      }
      return childs;
    }
  },
  [Symbol.iterator]: {
    value: function() {
      return {
        next: this.iterator()
      };
    }
  },
  [Symbol.pointer]: {
    get: function() {
      var TypedArray, array, begin, byteArray, byteFinish, byteLength, byteOffset, constructor, end, headers, headersBegin, headersEnd, headersLength, length, parent, protoclass, prototype, ref;
      protoclass = this.loadHeader(this.HINDEX_PROTOCLASS);
      prototype = this.scope.get(protoclass);
      constructor = prototype.constructor;
      TypedArray = (ref = constructor.TypedArray) != null ? ref : Uint8Array;
      parent = Number.prototype.toPointer.call(this.loadHeader(this.HINDEX_PARENT));
      begin = this.loadHeader(this.HINDEX_BEGIN);
      end = this.loadHeader(this.HINDEX_END);
      length = this.loadHeader(this.HINDEX_LENGTH);
      byteOffset = this.loadHeader(this.HINDEX_BYTEOFFSET);
      byteLength = this.loadHeader(this.HINDEX_BYTELENGTH);
      byteFinish = this.loadHeader(this.HINDEX_BYTEFINISH);
      headersBegin = this * 1;
      headersLength = Pointer.ITEMS_PER_POINTER;
      headersEnd = headersBegin + headersLength;
      array = Pointer.buffer[TypedArray.subarray](begin, end);
      byteArray = Pointer.buffer.subarrayUint8(byteOffset, byteFinish);
      headers = Pointer.header.subarrayUint32(headersBegin, headersEnd);
      return {
        array,
        scope: prototype.scope,
        parent,
        children: this.findAllChilds(),
        byteArray,
        byteOffset,
        byteLength,
        byteFinish,
        headers,
        headersBegin,
        headersLength,
        headersEnd,
        begin,
        end,
        length,
        protoclass,
        prototype,
        constructor
      };
    }
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

Display = (function() {
  class Display extends Pointer {};

  Display.byteLength = 2 * 4;

  return Display;

}).call(this);

Viewport = (function() {
  class Viewport extends Pointer {};

  Viewport.byteLength = 26 * 4;

  return Viewport;

}).call(this);

Object.defineProperties(Viewport.prototype, {
  background: {
    get: function() {}
  }
});

//export { Pointer as default, Pointer, Display, Viewport, RefLink }
