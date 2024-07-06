var ALGIN_BYTELENGTH, BYTES_OF_HEADERS, COUNT_OF_HEADERS, GLOBAL_LOCKINDEX, HEADERS_HINDEX, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_END, HINDEX_ITERATOR_I, HINDEX_LENGTH, HINDEX_PROTOCLASS, HINDEX_RESOLV_CID, HINDEX_RESOLV_PTR, ScopeChannel, SharedArrayBuffer, Worker;

import KEYOF from "./0ptr_keyof.js";

import * as Modules from "./0ptr_TypedArray.js";

import {
  TypedArray,
  defaults
} from "./0ptr_TypedArray.js";

COUNT_OF_HEADERS = 16;

BYTES_OF_HEADERS = 4 * COUNT_OF_HEADERS;

ALGIN_BYTELENGTH = 8;

GLOBAL_LOCKINDEX = 2;

HEADERS_HINDEX = 0;

HINDEX_BEGIN = HEADERS_HINDEX++;

HINDEX_END = HEADERS_HINDEX++;

HINDEX_LENGTH = HEADERS_HINDEX++;

HINDEX_PROTOCLASS = HEADERS_HINDEX++;

HINDEX_RESOLV_CID = HEADERS_HINDEX++;

HINDEX_RESOLV_PTR = HEADERS_HINDEX++;

HINDEX_BYTELENGTH = HEADERS_HINDEX++;

HINDEX_BYTEOFFSET = HEADERS_HINDEX++;

HINDEX_ITERATOR_I = HEADERS_HINDEX++;

Object.defineProperties(DataView.prototype, {
  littleEndian: {
    value: new defaults.Uint8Array(defaults.Uint32Array.of(0x01).buffer)[0]
  }
});

Object.defineProperties(URL, {
  createWorkerURL: {
    value: function() {
      var parts;
      parts = [...arguments].flat().map(function(part) {
        if (/string/.test(typeof part)) {
          return part.trim().split(/\; /g).join(";\n");
        }
        return part;
      });
      return this.createObjectURL(new Blob(parts, {
        type: "application/javascript"
      }));
    }
  }
});

Object.defineProperties(self, {
  delay: {
    value: function() {
      return new Promise((done) => {
        return setTimeout(done, arguments[0] || 1000);
      });
    }
  }
});

Object.defineProperties(self.SharedArrayBuffer.prototype, {
  COUNT_OF_HEADERS: {
    value: COUNT_OF_HEADERS
  },
  scope: {
    value: new (ScopeChannel = (function() {
      class ScopeChannel extends BroadcastChannel {
        load(index) {
          var ref;
          if (!index) {
            return null;
          }
          if (!(ref = this.objects[index])) {
            console.log("need proxy", index);
            this.request({index});
            memory.lock();
            ref = new WeakRef({
              done: 2
            });
          }
          return ref.deref();
        }

        store(object) {
          var index, j, len, ref, ref1;
          if (!this.map.has(object)) {
            this.map.set(object, index = this.objects.length);
            this.objects[index] = new WeakRef(object);
            return index;
          }
          ref1 = this.objects;
          for (index = j = 0, len = ref1.length; j < len; index = ++j) {
            ref = ref1[index];
            if (ref.deref() === object) {
              return index;
            }
          }
          throw ["UNEXPECTED_STORE", ...arguments];
        }

        constructor() {
          super("0ptr_sc").listen();
        }

        listen() {
          return this.onmessage = this.message.bind(this);
        }

        message({data, ports}) {
          if (data.to) {
            if (data.to === this.uuid) {
              return this.onreply(data);
            }
          } else {
            return this.onrequest(data);
          }
        }

        onreply(res) {
          return console.log("got res:", res, this.uuid, this.objects);
        }

        onrequest(req) {
          var port1, port2;
          console.log("got req:", req, this.uuid, this.objects);
          ({port1, port2} = new MessageChannel());
          this.reply(req, {
            done: 222
          }, [port1]);
          return memory.unlock();
        }

        reply(req, res) {
          return this.postMessage({
            ...res,
            from: this.uuid,
            to: req.from
          }, arguments[1]);
        }

        request(req) {
          return this.postMessage({
            ...req,
            from: this.uuid
          }, arguments[1]);
        }

      };

      ScopeChannel.prototype.objects = [new WeakRef(self)];

      ScopeChannel.prototype.uuid = self.name || (self.name = "processor");

      ScopeChannel.prototype.map = new WeakMap();

      return ScopeChannel;

    }).call(this))
  },
  loadObject: {
    value: function(ptri, index) {
      return this.scope.load(this.loadUint32(this.getBegin(ptri) + index));
    }
  },
  storeObject: {
    value: function(ptri, index, object) {
      this.storeUint32(this.getBegin(ptri) + index, this.scope.store(object));
      return object;
    }
  },
  set: {
    value: function() {
      var buffer, offset, ref1;
      buffer = (ref1 = arguments[0].buffer) != null ? ref1 : arguments[0];
      offset = arguments[1] || 0;
      new defaults.Uint8Array(this).set(new defaults.Uint8Array(buffer), offset);
      return this;
    }
  },
  lock: {
    value: function(ptri = GLOBAL_LOCKINDEX) {
      return this.waitInt32(ptri, arguments[1]);
    }
  },
  unlock: {
    value: function(ptri = GLOBAL_LOCKINDEX) {
      return this.notifyInt32(ptri, arguments[1]);
    }
  },
  //console.warn name, "unlocking:", {ptri}
  //setTimeout =>
  //    @notifyInt32 ptri + GLOBAL_LOCKINDEX, arguments[1]
  //, 2220

  // mark          if arguments[0] 
  // then alloc in     #? data block
  // else alloc in #* headers
  malloc: {
    value: function() {
      var Ptri, begin, byteLength, byteOffset, length, mod, perElement, ptr, ptri;
      if (!arguments.length) {
        return this.addUint32(1, COUNT_OF_HEADERS);
      }
      if (ptri = parseInt(ptr = arguments[0])) {
        Ptri = ptr.constructor;
        if (byteLength = Ptri.byteLength) {
          if (mod = byteLength % ALGIN_BYTELENGTH) { // align 8 bytes
            mod = ALGIN_BYTELENGTH - mod;
          }
          byteOffset = this.addUint32(0, byteLength + mod);
          perElement = Ptri.TypedArray.BYTES_PER_ELEMENT;
          begin = byteOffset / perElement;
          length = byteLength / perElement;
          this.storeUint32(ptri + HINDEX_BEGIN, begin);
          this.storeUint32(ptri + HINDEX_LENGTH, length);
          this.storeUint32(ptri + HINDEX_END, begin + length);
          this.storeUint32(ptri + HINDEX_BYTEOFFSET, byteOffset);
          this.storeUint32(ptri + HINDEX_BYTELENGTH, byteLength);
          this.storeUint32(ptri + HINDEX_PROTOCLASS, this.scope.store(Ptri.prototype));
          console.warn({
            HINDEX_BEGIN: this.loadUint32(ptri + HINDEX_BEGIN),
            HINDEX_LENGTH: this.loadUint32(ptri + HINDEX_LENGTH),
            HINDEX_END: this.loadUint32(ptri + HINDEX_END),
            HINDEX_BYTEOFFSET: this.loadUint32(ptri + HINDEX_BYTEOFFSET),
            HINDEX_BYTELENGTH: this.loadUint32(ptri + HINDEX_BYTELENGTH),
            HINDEX_PROTOCLASS: this.loadUint32(ptri + HINDEX_PROTOCLASS)
          });
        }
      }
      return this;
    }
  },
  storeResolv: {
    value: function(call, ptri) {
      return this.storeUint32(parseInt(ptri) + HINDEX_RESOLV_CID, call);
    }
  },
  loadResolv: {
    value: function(call) {
      return this.find(HINDEX_RESOLV_CID, call);
    }
  },
  resolvCall: {
    value: function() {
      var call, e, stack;
      try {
        throw new Error();
      } catch (error) {
        e = error;
        stack = e.stack;
      }
      call = null;
      `${stack}`.split(/\n| at /).slice(3).filter(isNaN).reverse().map(function(text, i, lines) {
        var col, line, scheme, url, urlBegin, urlEnd, urlid;
        [line, col] = text.replace(/\)/g, '').split(':').slice(-2).map(Number);
        urlEnd = text.lastIndexOf([line, col].join(':')) - 1;
        urlBegin = text.lastIndexOf(' ') + 1;
        url = text.substring(Math.max(urlBegin, text.indexOf("(") + 1), urlEnd);
        scheme = url.split(/\:/, 1).at(0);
        urlid = scheme.startsWith('http') && url.split("").map(function(c) {
          return c.charCodeAt();
        }).reduce(function(a, b) {
          return a + b || 0;
        }) || 0;
        return call = lines.call = (lines.call || 0) + (urlid + line) + i;
      });
      return call;
    }
  },
  find: {
    value: function() {
      var index, max, offset, value;
      [index = 0, value] = arguments;
      (offset = COUNT_OF_HEADERS + index);
      max = this.loadUint32(1);
      value = parseInt(value);
      while (offset < max) {
        if (value === this.loadUint32(offset)) {
          return offset - index;
        }
        offset += COUNT_OF_HEADERS;
      }
      return null;
    }
  },
  defineProperties: {
    value: function() {
      var dvw, f32, f64, i16, i32, i64, ii8, j, k, l, len, len1, len2, len3, len4, len5, m, n, o, pair, ref1, ref2, ref3, ref4, ref5, ref6, u16, u32, u64, ui8, view;
      ui8 = new defaults.Uint8Array(this);
      ii8 = new defaults.Int8Array(this);
      i16 = new defaults.Int16Array(this);
      u16 = new defaults.Uint16Array(this);
      u32 = new defaults.Uint32Array(this);
      i32 = new defaults.Int32Array(this);
      f32 = new defaults.Float32Array(this);
      f64 = new defaults.Float64Array(this);
      u64 = new defaults.BigUint64Array(this);
      i64 = new defaults.BigInt64Array(this);
      dvw = new defaults.DataView(this);
      ref1 = [ui8, ii8, u16, i16, u32, i32, u64, i64];
      for (j = 0, len = ref1.length; j < len; j++) {
        view = ref1[j];
        this.defineIntegerAtomics(view);
      }
      ref2 = [ui8, ii8, u16, i16, u32, i32, u64, i64];
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        view = ref2[k];
        this.defineExchangeAtomics(view);
      }
      ref3 = [i32, i64];
      for (l = 0, len2 = ref3.length; l < len2; l++) {
        view = ref3[l];
        this.defineWaitLockAtomics(view);
      }
      ref4 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
      for (m = 0, len3 = ref4.length; m < len3; m++) {
        view = ref4[m];
        this.defineDataViewModifiers(view, dvw);
      }
      ref5 = [ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64];
      for (n = 0, len4 = ref5.length; n < len4; n++) {
        view = ref5[n];
        this.defineTArrayModifiers(view);
      }
      ref6 = [[f32, i32], [f64, i64]];
      for (o = 0, len5 = ref6.length; o < len5; o++) {
        pair = ref6[o];
        this.defineFloatAtomics(pair);
      }
      return this;
    }
  },
  defineIntegerAtomics: {
    value: function() {
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
  },
  defineWaitLockAtomics: {
    value: function() {
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
  },
  defineFloatAtomics: {
    value: function() {
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
  },
  defineExchangeAtomics: {
    value: function() {
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
  },
  defineDataViewModifiers: {
    value: function() {
      var caller, dataView, handle, j, len, littleEndian, nameSuffix, ref1;
      dataView = arguments[1];
      nameSuffix = arguments[0].constructor.name.replace(/View|Array/, "");
      littleEndian = Boolean(new defaults.Uint8Array(defaults.Uint32Array.of(1).buffer).at(0));
      ref1 = ["get", "set"];
      for (j = 0, len = ref1.length; j < len; j++) {
        caller = ref1[j];
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
  },
  defineTArrayModifiers: {
    value: function() {
      var caller, constructor, handle, j, len, modifiers, nameSuffix, view;
      view = arguments[0];
      constructor = view.constructor;
      nameSuffix = constructor.name.replace(/View|Array/, "");
      caller = `at${nameSuffix}`;
      Object.defineProperty(this, caller, {
        value: function() {
          return view[arguments[0]];
        }
      });
      caller = `setarray${nameSuffix}`;
      Object.defineProperty(this, caller, {
        value: function() {
          return view.set(arguments[0], arguments[1]);
        }
      });
      modifiers = ["subarray", "fill", "slice", "copyWithin", "entries", "every", "filter", "find", "findIndex", "findLast", "findLastIndex", "forEach", "includes", "indexOf", "join", "keys", "lastIndexOf", "map", "reduce", "reduceRight", "reverse", "some", "sort", "values", "with"];
      for (j = 0, len = modifiers.length; j < len; j++) {
        caller = modifiers[j];
        handle = caller + nameSuffix;
        Object.defineProperty(this, handle, {
          value: arguments[0][caller].bind(arguments[0])
        });
        if (Object.hasOwn(constructor, caller)) {
          continue;
        }
        Object.defineProperty(constructor, caller, {
          value: handle
        });
      }
      return view;
    }
  }
});

Object.defineProperty(self, "Worker", {
  value: Worker = class Worker extends self.Worker {
    constructor() {
      var ref1;
      super(arguments[0], {
        type: "module",
        name: (ref1 = arguments[1]) != null ? ref1 : "\x1b[93mprocessor\x1b[0m"
      });
      this.onerror = function() {
        return !console.error(...arguments);
      };
    }

  }
});

Object.defineProperty(self, "SharedArrayBuffer", {
  value: SharedArrayBuffer = (function() {
    class SharedArrayBuffer extends defaults.SharedArrayBuffer {
      constructor() {
        var byteLength, options, source;
        if (arguments[0] instanceof SharedArrayBuffer) {
          return arguments[0].defineProperties();
        }
        byteLength = SharedArrayBuffer.prototype.BEGIN * COUNT_OF_HEADERS;
        options = {
          maxByteLength: SharedArrayBuffer.prototype.MAX_BYTELENGTH
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
        if (self.Array.isArray(source)) {
          source = defaults.Uint8Array.from(source);
        }
        //? new SharedArrayBuffer( new ArrayBuffer(256) )
        if (source.byteLength) {
          byteLength = Math.max(source.byteLength, byteLength);
          return super(byteLength, options).initialAlloc().set(source);
        }
        throw /MEMORY_COULD_NOT_INITIALIZED/;
      }

      initialAlloc() {
        this.defineProperties();
        this.orUint32(0, this.BEGIN * 4);
        // byte offset for objects
        this.orUint32(1, COUNT_OF_HEADERS);
        return this;
      }

      getHeaders(ptri) {
        return this.subarrayUint32(this, this + COUNT_OF_HEADERS);
      }

      getProtoClass(ptri) {
        return this.loadUint32(ptri + this.INDEX4_CLASS);
      }

      loadResvUint32(ptri, index = 0) {
        return this.loadUint32(ptri + this.INDEX4_RESVU32 + index);
      }

      storeResvUint32(ptri, index = 0, value) {
        return this.storeUint32(ptri + this.INDEX4_RESVU32 + index, value);
      }

      getByteLength(ptri) {
        return this.loadUint32(ptri + this.INDEX4_BYTELENGTH);
      }

      getBegin(ptri) {
        return this.loadUint32(ptri + this.INDEX4_BEGIN);
      }

      getEnd(ptri) {
        return this.loadUint32(ptri + this.INDEX4_END);
      }

      setProtoClass(ptri, uInt32) {
        this.storeUint32(ptri + this.INDEX4_CLASS, uInt32);
        return ptri;
      }

      setByteLength(ptri, uInt32) {
        this.storeUint32(ptri + this.INDEX4_BYTELENGTH, uInt32);
        return ptri;
      }

      setBegin(ptri, uInt32) {
        this.storeUint32(ptri + this.INDEX4_BEGIN, uInt32);
        return ptri;
      }

      setEnd(ptri, uInt32) {
        this.storeUint32(ptri + this.INDEX4_END, uInt32);
        return ptri;
      }

    };

    SharedArrayBuffer.prototype.BEGIN = 8e5; //! ITEMS: 8e5 = POINTERS: 1e5 = BYTES: 32e5

    SharedArrayBuffer.prototype.MAX_BYTELENGTH = Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11);

    SharedArrayBuffer.prototype.INDEX4_CLASS = 0;

    SharedArrayBuffer.prototype.INDEX4_BYTELENGTH = 1;

    SharedArrayBuffer.prototype.INDEX4_BEGIN = 2;

    SharedArrayBuffer.prototype.INDEX4_END = 3;

    SharedArrayBuffer.prototype.INDEX4_RESVU32 = 4;

    return SharedArrayBuffer;

  }).call(this)
});
