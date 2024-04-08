var protoclasses, weakmap;

import KEYOF from "./0ptr_keyof.js";

import defaults from "./0ptr_self.js";

export {
  Scope
} from "./0ptr_scope.js";

protoclasses = [weakmap = new WeakMap()];

Object.defineProperties(Symbol, {
  pointer: {
    value: "{[Pointer]}"
  }
});

export var Pointer = (function() {
  class Pointer extends Number {
    static scopei() {
      var bpe, i, ref;
      if (!weakmap.has(this.prototype)) {
        weakmap.set(this.prototype, protoclasses[i = protoclasses.length] = this.prototype);
        
        //Object.defineProperty this::, "protoclass", { value : i }
        if (bpe = (ref = defaults[this.name]) != null ? ref.BYTES_PER_ELEMENT : void 0) {
          Object.defineProperty(this.prototype, "BYTES_PER_ELEMENT", {
            value: bpe
          });
          defaults[this.name].protoclass = i;
        }
      }
      return i;
    }

    toPointer() {
      return this;
    }

    constructor() {
      var call, ptri;
      if (!arguments.length) {
        call = new CallResolv();
        //?  only bridge allocates 
        if (self.isBridge) {
          super(memory.malloc()).storeHeaders(call);
        }
        //?  cpuN only re-locates
        if (self.isCPU) {
          super(memory.loadUint32(call + Pointer.HINDEX_RESOLV_PTR));
        }
      } else if (!(ptri = arguments[0])) {
        /ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO/.throw();
      } else {
        super(ptri);
      }
    }

    storeHeaders() {
      var begin, byteLength, byteOffset, call, length, perElement, protoclass;
      if (call = arguments[0]) {
        memory.storeUint32(call + this.constructor.HINDEX_RESOLV_PTR, this);
        memory.storeUint32(this + this.constructor.HINDEX_RESOLV_CID, call.cid);
      }
      protoclass = this.constructor.protoclass;
      perElement = this.constructor.TypedArray.BYTES_PER_ELEMENT;
      memory.storeUint32(this + this.constructor.HINDEX_PROTOCLASS, protoclass);
      memory.storeUint32(this + this.constructor.HINDEX_RESOLV_PTR, this * 1);
      if (byteLength = this.constructor.byteLength) {
        byteOffset = memory.malloc(byteLength);
        begin = byteOffset / perElement;
        length = byteLength / perElement;
        memory.storeUint32(this + this.constructor.HINDEX_BEGIN, begin);
        memory.storeUint32(this + this.constructor.HINDEX_LENGTH, length);
        memory.storeUint32(this + this.constructor.HINDEX_END, begin + length);
        memory.storeUint32(this + this.constructor.HINDEX_BYTEOFFSET, byteOffset);
        memory.storeUint32(this + this.constructor.HINDEX_BYTELENGTH, byteLength);
      }
      return this;
    }

    callResolv() {
      var cid, ptri;
      if (!(cid = memory.loadUint32(this + Pointer.HINDEX_RESOLV_CID))) {
        return;
      }
      if (!(ptri = memory.find(Pointer.HINDEX_RESOLV_CID, Number(cid)))) {
        return;
      }
      return new CallResolv(ptri);
    }

    usePrototype() {
      var protoclass, ref;
      if (this.constructor !== Pointer) {
        return this;
      }
      protoclass = (ref = arguments[0]) != null ? ref : this.scope.get(this.loadHeader(this.HINDEX_PROTOCLASS));
      return Object.setPrototypeOf(this, protoclass);
    }

    storeObject() {
      return memory.storeObject(this, arguments[0], arguments[1]);
    }

    loadObject() {
      return memory.loadObject(this, arguments[0]);
    }

  };

  Pointer.TypedArray = Uint8Array;

  Pointer.byteLength = 0;

  Pointer.headersLength = 0;

  Pointer.HINDEX_BEGIN = Pointer.headersLength++;

  Pointer.HINDEX_END = Pointer.headersLength++;

  Pointer.HINDEX_LENGTH = Pointer.headersLength++;

  Pointer.HINDEX_PROTOCLASS = Pointer.headersLength++;

  Pointer.HINDEX_RESOLV_CID = Pointer.headersLength++;

  Pointer.HINDEX_RESOLV_PTR = Pointer.headersLength++;

  Pointer.HINDEX_BYTELENGTH = Pointer.headersLength++;

  Pointer.HINDEX_BYTEOFFSET = Pointer.headersLength++;

  return Pointer;

}).call(this);

export var CallResolv = (function() {
  class CallResolv extends Pointer {
    constructor() {
      var call, cid, e, stack;
      if (arguments.length) {
        return super(arguments[0]);
      } else {
        try {
          throw new Error();
        } catch (error) {
          e = error;
          stack = e.stack;
        }
      }
      if (!(cid = CallResolv.parse(stack).at(-1).cid)) {
        /CID_MUST_BE_A_NUMBER/.throw(cid);
      }
      if (self.isBridge) {
        call = memory.malloc();
        memory.storeUint32(call + Pointer.HINDEX_RESOLV_CID, cid);
        memory.storeUint32(call + Pointer.HINDEX_PROTOCLASS, CallResolv.protoclass);
      } else if (!(call = memory.find(Pointer.HINDEX_RESOLV_CID, cid))) {
        /CPU_COULND_FIND_POINTER_FOR_CID/.throw(cid);
      }
      super(call);
    }

    static parse() {
      return `${arguments[0]}`.split(/\n| at /).slice(3).filter(isNaN).reverse().map(function(text, i, lines) {
        var basename, call, cid, col, extension, file, fullpath, hostname, isAnonymous, isConstructor, line, name, path, prototype, scheme, url, urlBegin, urlEnd, urlid;
        [line, col] = text.replace(/\)/g, '').split(':').slice(-2).map(Number);
        urlEnd = text.lastIndexOf([line, col].join(':')) - 1;
        urlBegin = text.lastIndexOf(' ') + 1;
        call = text.substring(0, urlBegin).trim() || null;
        isAnonymous = call === null;
        name = (call != null ? call.toString().split(" ", 2).at(-1) : void 0) || "";
        isConstructor = call != null ? call.toString().startsWith("new") : void 0;
        prototype = defaults[name] || null;
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
        cid = lines.cid = (lines.cid || 0) + (urlid + line) + i;
        return Object.defineProperties({cid, line, urlid, col, call, name, path, fullpath, hostname, prototype, isConstructor, isAnonymous, text, url, scheme, file, basename, extension}, {
          stackLine: {
            value: text
          }
        });
      });
    }

  };

  CallResolv.byteLength = 4096;

  return CallResolv;

}).call(this);

Object.defineProperties(CallResolv.prototype, {
  ptri: {
    get: function() {
      return memory.loadUint32(this + Pointer.HINDEX_RESOLV_PTR);
    }
  },
  cid: {
    get: function() {
      return memory.loadUint32(this + Pointer.HINDEX_RESOLV_CID);
    }
  }
});

Object.defineProperties(Pointer, {
  protoclass: {
    get: function() {
      return this.scopei();
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  [Symbol.pointer]: {
    get: function() {
      return {
        protoclass: memory.loadUint32(this + Pointer.HINDEX_PROTOCLASS),
        instanceof: this.realizeWith,
        memory: memory,
        TypedArray: this.buffer.slice().buffer,
        byteLength: this.constructor.byteLength,
        headers: memory.subarrayUint32(this, this + 8)
      };
    }
  }
});
