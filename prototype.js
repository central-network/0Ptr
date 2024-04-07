var BYTES_OF_HEADERS, COUNT_OF_HEADERS, CallResolv, GLOBAL_LOCKINDEX, ScopeChannel, SharedArrayBuffer, Worker;

import {
  TypedArray,
  defaults
} from "./0ptr_TypedArray.js";

COUNT_OF_HEADERS = 8;

BYTES_OF_HEADERS = 4 * COUNT_OF_HEADERS;

GLOBAL_LOCKINDEX = 8 / 4;

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

Object.defineProperties(self.SharedArrayBuffer.prototype, {
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

      ScopeChannel.prototype.uuid = self.name || (self.name = crypto.randomUUID());

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
    value: function(ptri = 0) {
      return this.waitInt32(ptri + GLOBAL_LOCKINDEX, arguments[1]);
    }
  },
  unlock: {
    value: function(ptri = 0) {
      return this.notifyInt32(ptri + GLOBAL_LOCKINDEX, arguments[1]);
      console.warn(name, "unlocking:", {ptri});
      return setTimeout(() => {
        return this.notifyInt32(ptri + GLOBAL_LOCKINDEX, arguments[1]);
      }, 2220);
    }
  },
  malloc: {
    value: function() {
      //*   headers has 4 items:
      //* - nexti4     : memory's next index  index4(ptr) + 8 (head + data(ptr))
      //* - byteLength : data byte [not aligned] length {it's 0 when deleted} 
      //* - parent     : linked target index4
      //* - prototype  : protoclass of TypedArray.......!!!Pointer!!!!
      if (!arguments.length) {
        return this.addUint32(1, COUNT_OF_HEADERS);
      } else if (arguments[0] > 0) {
        return this.addUint32(0, arguments[0]);
      }
      throw ["NON_SIZED_ALLOCATION"];
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
        name: (ref1 = arguments[1]) != null ? ref1 : crypto.randomUUID()
      });
      this.onerror = function() {
        return !console.error(...arguments);
      };
    }

  }
});

CallResolv = (function() {
  class CallResolv extends Number {};

  CallResolv.prototype.call = [];

  CallResolv.prototype.stack = [];

  return CallResolv;

}).call(this);

Object.defineProperty(self, "ResolveCall", {
  value: function() {
    var call, stack;
    try {
      throw stack = new Error().stack;
    } catch (error) {}
    call = stack.toString().split(/\n| at /).slice(3).filter(isNaN).reverse().map(function(text, i, lines) {
      var basename, col, extension, file, fullpath, hostname, id, isAnonymous, isConstructor, line, name, path, prototype, scheme, url, urlBegin, urlEnd, urlid;
      [line, col] = text.replace(/\)/g, '').split(':').slice(-2).map(Number);
      urlEnd = text.lastIndexOf([line, col].join(':')) - 1;
      urlBegin = text.lastIndexOf(' ') + 1;
      call = text.substring(0, urlBegin).trim() || null;
      isAnonymous = call === null;
      name = (call != null ? call.toString().split(" ", 2).at(-1) : void 0) || "";
      isConstructor = call != null ? call.toString().startsWith("new") : void 0;
      prototype = call && self[name];
      url = text.substring(Math.max(urlBegin, text.indexOf("(") + 1), urlEnd);
      file = url.split(/\//g).at(-1);
      basename = file.split(".").slice(0, 1).join(".");
      extension = file.substr(basename.length + 1);
      scheme = url.split(/\:/, 1).at(0);
      hostname = url.split(/\/\//, 2).at(-1).split(/\//, 1).at(0);
      fullpath = url.split(hostname, 2).at(-1);
      path = fullpath.split(/\//).slice(0, -1).join("/");
      urlid = scheme.startsWith('http') && url.split("").map(function(c) {
        return c.charCodeAt();
      }).reduce(function(a, b) {
        return a + b || 0;
      }) || 0;
      id = lines.id = (lines.id || 0) + (urlid + line) + i;
      return {i, id, line, urlid, col, call, name, path, fullpath, hostname, prototype, isConstructor, isAnonymous, text, url, scheme, file, basename, extension};
    }).reverse();
    return Object.defineProperties(new CallResolv(call[0].id), {
      call: {
        value: Object.defineProperties(call, {
          stack: {
            value: stack
          }
        })
      }
    });
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
        byteLength = SharedArrayBuffer.prototype.BEGIN * 8;
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

    return SharedArrayBuffer;

  }).call(this)
});
