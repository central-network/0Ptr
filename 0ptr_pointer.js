var protoclasses, weakmap;

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
        Object.defineProperty(this.prototype, "protoclass", {
          value: i
        });
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
      var callResolv, offset, ptri;
      if (!arguments.length) {
        if (self.isBridge) {
          super(ptri = memory.malloc());
          callResolv = new CallResolv();
          callResolv.ptri = ptri;
          this.callResolv = callResolv;
        } else if (self.isCPU) {
          callResolv = new CallResolv();
          offset = 8 + 4;
          while (true) {
            if (!(callResolv.id - memory.loadUint32(offset))) {
              return super(memory.loadUint32(offset + 1));
            }
            if (1000 < (offset += 8)) {
              break;
            }
          }
        }
      } else if (arguments[0]) {
        super(arguments[0]);
        this.usePrototype(arguments[1]);
      } else {
        console.error(["ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO"]);
        return void 0;
      }
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

  Pointer.byteLength = 0;

  Pointer.prototype.INDEX4_RESVU32_RESOLV = 0;

  return Pointer;

}).call(this);

export var CallResolv = (function() {
  class CallResolv extends Pointer {
    constructor() {
      var e, ptri, stack;
      if (arguments.length) {
        if (!(ptri = arguments[0])) {
          return void 0;
        }
        return super(ptri);
      } else {
        try {
          throw new Error();
        } catch (error) {
          e = error;
          stack = e.stack;
        }
      }
      super(memory.malloc());
      this.id = CallResolv.parse(stack).at(-1).id;
    }

    //Object.defineProperties this,
    //    id : value : calls.at(-1).id
    //    class : value : calls.find( (c) -> c.isConstructor ).prototype
    //    chain : value : Object.assign calls, { stack }

    //console.log "\x1b[1m\x1b[95mnew\x1b[0m \x1b[1m\x1b[93m#{@class.name}()\x1b[0m","<--", this
    static parse() {
      return `${arguments[0]}`.split(/\n| at /).slice(3).filter(isNaN).reverse().map(function(text, i, lines) {
        var basename, call, col, extension, file, fullpath, hostname, id, isAnonymous, isConstructor, line, name, path, prototype, scheme, url, urlBegin, urlEnd, urlid;
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
        id = lines.id = (lines.id || 0) + (urlid + line) + i;
        return Object.defineProperties({id, line, urlid, col, call, name, path, fullpath, hostname, prototype, isConstructor, isAnonymous, text, url, scheme, file, basename, extension}, {
          stackLine: {
            value: text
          }
        });
      });
    }

  };

  CallResolv.prototype.INDEX4_RESVU32_ID = 0;

  CallResolv.prototype.INDEX4_RESVU32_PTRI = 1;

  return CallResolv;

}).call(this);

Object.defineProperties(CallResolv.prototype, {
  id: {
    get: function() {
      return memory.loadUint32(this + this.INDEX4_RESVU32_ID + 4);
    },
    set: function() {
      return memory.storeUint32(this + this.INDEX4_RESVU32_ID + 4, arguments[0]);
    }
  },
  ptri: {
    get: function() {
      return memory.loadUint32(this + this.INDEX4_RESVU32_PTRI + 4);
    },
    set: function() {
      return memory.storeUint32(this + this.INDEX4_RESVU32_PTRI + 4, arguments[0]);
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  callResolv: {
    get: function() {
      return new CallResolv(memory.loadUint32(this + this.INDEX4_RESVU32_RESOLV + 4));
    },
    set: function() {
      return memory.storeUint32(this + this.INDEX4_RESVU32_RESOLV + 4, arguments[0]);
    }
  },
  headers: {
    get: function() {
      return memory.subarrayUint32(this, this + 8);
    }
  },
  scope: {
    get: function() {
      return memory.scope;
    }
  },
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
        if (parent === memory.loadUint32(offset)) {
          if (protoclass && protoclass - memory.loadUint32(offset + pclass)) {
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
      var TypedArray, begin, byteFinish, byteLength, byteOffset, constructor, end, headersBegin, headersEnd, headersLength, length, parent, protoclass, prototype, ref;
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
      return {
        //array           = memory[ TypedArray.subarray ]( begin, end )
        //byteArray       = memory.subarrayUint8( byteOffset, byteFinish )
        //headers         = memory.subarrayUint32( headersBegin, headersEnd )
        scope: prototype.scope,
        parent,
        children: this.findAllChilds(),
        byteOffset,
        byteLength,
        byteFinish,
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
