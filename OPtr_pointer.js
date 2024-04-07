var protoclasses, weakmap;

import defaults from "./0Ptr_self.js";

export {
  Scope
} from "./0Ptr_scope.js";

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
      var chain;
      if (!arguments.length) {
        chain = new CallResolv();
        super(memory.malloc());
      } else {
        
        //memory.setProtoClass this, @protoclass
        super(arguments[0]);
        this.usePrototype(arguments[1]);
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

  return Pointer;

}).call(this);

export var CallResolv = class CallResolv extends Number {
  constructor() {
    var calls, error, stack;
    try {
      throw new Error();
    } catch (error1) {
      error = error1;
      stack = error.stack.toString();
      calls = CallResolv.parse(stack);
    }
    Object.defineProperties(super(calls.at(-1).id), {
      class: {
        value: calls.find(function(c) {
          return c.isConstructor;
        }).prototype
      },
      chain: {
        value: Object.assign(calls, {stack})
      }
    });
    console.log(`\x1b[1m\x1b[95mnew\x1b[0m \x1b[1m\x1b[93m${this.class.name}()\x1b[0m`, "<--", this);
  }

  static parse() {
    return arguments[0].split(/\n| at /).slice(3).filter(isNaN).reverse().map(function(text, i, lines) {
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

Object.defineProperties(Pointer.prototype, {
  memory: {
    get: function() {
      return memory;
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
