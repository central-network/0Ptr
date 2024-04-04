var Display, Pointer, RefLink, Scope, Viewport;

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
