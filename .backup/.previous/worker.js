(function() {
  var Array, Boolean, ClassPointer, ExtRef, Float, Float32Array, Int32Array, Integer, Object, Pointer, PointerFilter, PointerProperty, String, TypedArray, UUIDv4, Uint8Array, UniqueId, debug, define, error, global, log, mem, pxy, scope, warn;

  define = self.Object.defineProperties;

  [({log, warn, error, debug} = console)];

  pxy = new Proxy({}, {
    apply: console.error,
    construct: console.error,
    defineProperty: console.error,
    deleteProperty: console.error,
    get: console.error,
    getOwnPropertyDescriptor: console.error,
    getPrototypeOf: console.error,
    has: console.error,
    isExtensible: console.error,
    ownKeys: console.error,
    preventExtensions: console.error,
    set: console.error,
    setPrototypeOf: console.error
  });

  self.Lolo = function() {
    log(1, [...arguments]);
    return 21;
  };

  scope = [, self];

  global = {
    i: function(o, i) {
      return o[i];
    },
    fn: function(f, ...a) {
      return warn(f, a, {arguments}) || f(...a);
    },
    fn: function(f, ...a) {
      return f(...a);
    },
    call: function(o, i, ...a) {
      return o[i](...a);
    },
    scope: new WebAssembly.Global({
      value: "externref"
    }, scope),
    apply: function(func, thisArg, ...args) {
      return func.apply(thisArg, args);
    },
    log,
    warn,
    error,
    textEncode: new WebAssembly.Global({
      value: "funcref"
    }, new WebAssembly.Function({
      parameters: ["externref"],
      results: ["externref"]
    }, TextEncoder.prototype.encode.bind(new TextEncoder))),
    buffer: mem = new WebAssembly.Memory({
      initial: 2
    }),
    Prototype: new WebAssembly.Global({
      value: "externref"
    }, (Pointer = class Pointer extends Number {})),
    ArrayBuffer: new WebAssembly.Global({
      value: "externref"
    }, mem.buffer),
    Float32Array: new WebAssembly.Global({
      value: "externref"
    }, self.Float32Array),
    Int32Array: new WebAssembly.Global({
      value: "externref"
    }, self.Int32Array),
    Uint8Array: new WebAssembly.Global({
      value: "externref"
    }, self.Uint8Array),
    Number: new WebAssembly.Global({
      value: "externref"
    }, self.Number),
    String: new WebAssembly.Global({
      value: "externref"
    }, self.String),
    funcref: new WebAssembly.Global({
      value: "funcref",
      mutable: true
    }, null),
    time: new WebAssembly.Global({
      value: "f64",
      mutable: true
    }, Date.now()),
    cache: new WebAssembly.Memory({
      initial: 1
    }),
    to: function() {
      return arguments[0];
    },
    extend: function() {
      return class extends arguments[0] {};
    },
    construct: function() {
      return new arguments[0](...[...arguments].slice(1));
    },
    typeof: function(any) {
      return typeof any;
    },
    keyof: function() {
      return arguments[0][arguments[1]];
    },
    eq: function(num0, num1) {
      return any0 - any1;
    },
    is: function(any0, any1) {
      return any0 === any1;
    },
    getArrayIndex: function(ref, array) {
      var i;
      if (-1 === (i = array.indexOf(ref))) {
        i += array.push(ref);
      }
      return i;
    },
    getArrayValue: function() {
      return arguments[1][arguments[0]];
    },
    defineHeaderProperty: function(constructor, name, get, set, enumerable = false) {
      return define(constructor.prototype, {
        [name]: {
          enumerable: !!enumerable,
          get: get ? function() {
            return get(this);
          } : void 0,
          set: set ? function() {
            return set(this, arguments[0]);
          } : void 0
        }
      });
    },
    defineKeyValueProperty: function(name, value, object) {
      return define(object.prototype, {
        [name]: {value}
      });
    },
    defineTypedArrayProperty: function(constructor, TypedArray, buffer, name) {
      return define(constructor.prototype, {
        [name]: {
          enumerable: true,
          get: function() {
            return new TypedArray(buffer, this, this.length);
          }
        }
      });
    },
    storeText: function(text, mallocFn, encodeFn) {
      var byteArray, byteLength, length, ptri;
      length = `${text}`.length;
      byteArray = encodeFn(text);
      byteLength = byteArray.length;
      ptri = mallocFn(length, byteLength);
      warn(ptri.byteArray);
      return log([text, ptri]);
    },
    readText: function() {
      var charCode, i, text, view;
      view = new self.DataView(global.cache.buffer);
      text = "";
      i = 0;
      while (charCode = view.getUint8(i++)) {
        text += self.String.fromCharCode(charCode);
      }
      return text;
    },
    onanimationframe: function(epoch, frame, now) {
      if ((frame % 250) === 0) {
        return log({
          epoch,
          frame,
          now: Date(Number(now))
        });
      }
    },
    ondispatchevent: function(ptri) {
      var e;
      e = Pointer.of(ptri);
      return log("emit:", e, "calls:", e.callCount.value, "once:", e.isOnce.value);
    }
  };

  Pointer = (function() {
    class Pointer extends Number {
      static storeClass() {
        var i;
        if (-1 === (i = this.scope.indexOf(this))) {
          i += this.scope.push(this);
        }
        return this.classIndex = i;
      }

      static of(ptri, Prototype = this) {
        var ProtoClass;
        if (ptri) {
          if (Prototype === Pointer) {
            if (ProtoClass = this.getProtoClass(ptri)) {
              return new ProtoClass(ptri);
            }
          }
          return new Prototype(ptri);
        }
        return 0;
      }

      static from(any = void 0) {
        if (any instanceof Pointer) {
          return any;
        }
        switch (typeof any) {
          case "boolean":
          case "undefined":
            return Boolean.from(any);
          case "number":
            if (!any || self.Number.isInteger(any)) {
              return Integer.from(any);
            }
            return Float.from(any);
          case "string":
            return String.from(any);
        }
        if (self.Array.isArray(any)) {
          return Array.from(any);
        }
        if (self.ArrayBuffer.isView(any)) {
          return TypedArray.from(any);
        }
        if (any.constructor.name === "Object") {
          return Object.from(any);
        }
        return ExtRef.from(any);
      }

      get() {
        throw "warning get";
      }

      toString() {
        throw "warning str";
      }

      filter(FuncOrClass, instanceCheck = false) {
        var childs, cl, clsi, cons, fn, next, ptri;
        childs = [];
        next = 0;
        if (!Pointer.isPrototypeOf(FuncOrClass)) {
          if (!(FuncOrClass instanceof Pointer)) {
            fn = FuncOrClass;
            while (next = Pointer.getNextChild(this, next)) {
              if (fn.call(this, ptri = Pointer.of(next))) {
                childs.push(ptri);
              }
            }
            return childs;
          }
        }
        cl = FuncOrClass;
        if (!instanceCheck) {
          clsi = cl.classIndex;
          while (next = Pointer.filterNextChild(this, clsi, next)) {
            childs.push(cl.of(next));
          }
          return childs;
        }
        while (next = Pointer.getNextChild(this, next)) {
          ptri = Pointer.of(next);
          cons = ptri.constructor;
          if (cl.isPrototypeOf(cons)) {
            childs.push(ptri);
          }
        }
        return childs;
      }

      setParent(ptri) {
        Pointer.setParentPtri(this, ptri);
        return this;
      }

      getParent() {
        return Pointer.of(Pointer.getParentPtri(this));
      }

      append(ptri) {
        Pointer.setParentPtri(ptri, this);
        return this;
      }

      appendChild(ptri) {
        Pointer.setParentPtri(ptri, this);
        return ptri;
      }

    };

    Pointer.scope = [];

    Pointer.byteLength = 0;

    return Pointer;

  }).call(this);

  Integer = (function() {
    class Integer extends Pointer {
      static from(value = 0) {
        var i;
        if (value instanceof this) {
          return value;
        }
        i = this.malloc();
        if (value) {
          i.set(value);
        }
        return i;
      }

      set(value = 0) {
        return Pointer.setInt32(this, value);
      }

      get() {
        return Pointer.getInt32(this);
      }

    };

    Integer.storeClass();

    Integer.byteLength = 4;

    return Integer;

  }).call(this);

  Float = (function() {
    class Float extends Pointer {
      static from(value = 0) {
        var i;
        if (value instanceof this) {
          return value;
        }
        i = this.malloc();
        i.set(value);
        return i;
      }

      set(value = 0) {
        return Pointer.setFloat32(this, value);
      }

      get() {
        return Pointer.getFloat32(this);
      }

    };

    Float.storeClass();

    Float.byteLength = 4;

    return Float;

  }).call(this);

  Boolean = (function() {
    class Boolean extends Pointer {
      static from(value = 0) {
        if (value instanceof this) {
          return value;
        }
        return this.malloc().set(value);
      }

      set(value = false) {
        Pointer.setUint8(this, !!value);
        return this;
      }

      get() {
        return !!Pointer.getUint8(this);
      }

    };

    Boolean.storeClass();

    Boolean.byteLength = 4;

    return Boolean;

  }).call(this);

  String = (function() {
    class String extends Pointer {
      static toCamelCase(text = "") {
        var string;
        string = text.toString();
        return string[0].toLowerCase() + string.substring(1);
      }

      static from(value = "") {
        var length, ptri;
        if (value instanceof this) {
          return value;
        }
        ptri = this.malloc();
        if (!(length = value.length)) {
          return ptri;
        }
        ptri.setLength(length);
        ptri.setByteArray(Uint8Array.from(this.encode(value)));
        return ptri;
      }

      decode() {
        return String.decode(this.getByteArray().value);
      }

      toString() {
        return this.get();
      }

      get() {
        return this.length && this.decode() || "";
      }

      getByteLength() {
        return Pointer.getByteLength(Pointer.getInt32(this, 4));
      }

      getByteArray() {
        return Uint8Array.of(Pointer.getInt32(this, 4));
      }

      setByteArray(ptri) {
        return Pointer.setInt32(this, ptri, 4);
      }

      getLength() {
        return Pointer.getInt32(this);
      }

      setLength(length = 0) {
        return Pointer.setInt32(this, length);
      }

    };

    String.storeClass();

    String.byteLength = 8;

    String.encode = TextEncoder.prototype.encode.bind(new TextEncoder);

    String.decode = TextDecoder.prototype.decode.bind(new TextDecoder);

    String.fromCharCode = self.String.fromCharCode;

    return String;

  }).call(this);

  Array = (function() {
    class Array extends Pointer {
      static from(value = []) {
        var i, length, ptri;
        if (value instanceof this) {
          return value;
        }
        ptri = this.malloc();
        if (!(length = value.length)) {
          return ptri;
        }
        i = 0;
        while (i < length) {
          ptri.appendChild(Pointer.from(value[i++]));
        }
        ptri.setLength(length);
        return ptri;
      }

      get(index) {
        var childs, i, prev;
        prev = 0;
        if (!arguments.length) {
          childs = [];
          while (prev = Pointer.getNextChild(this, prev)) {
            childs.push(Pointer.of(prev));
          }
          return childs;
        }
        i = arguments[0];
        while (prev = Pointer.getNextChild(this, prev)) {
          if (!i--) {
            return Pointer.of(prev);
          } else {
            continue;
          }
        }
        return 0;
      }

      filter(fn = function() {
          return 1;
        }) {
        var childs, prev, ptri;
        prev = 0;
        childs = [];
        while (prev = Pointer.getNextChild(this, prev)) {
          if (fn(ptri = Pointer.of(prev))) {
            childs.push(ptri);
          }
        }
        return childs;
      }

      getLength() {
        return Pointer.getInt32(this);
      }

      setLength(length = 0) {
        return Pointer.setInt32(this, length);
      }

    };

    Array.storeClass();

    Array.byteLength = 4;

    Array.isArray = self.Array.isArray;

    return Array;

  }).call(this);

  Object = (function() {
    class Object extends Pointer {
      static from(value = {}) {
        var j, key, keys, len, length, ptri;
        if (value instanceof this) {
          return value;
        }
        ptri = this.malloc();
        keys = this.keys(value);
        if (!(length = keys.length)) {
          return ptri;
        }
        for (j = 0, len = keys.length; j < len; j++) {
          key = keys[j];
          ptri.appendChild(String.from(key).append(Pointer.from(value[key])));
        }
        ptri.setLength(length);
        return ptri;
      }

      get() {
        var j, key, len, object, ref1;
        object = {};
        ref1 = this.getKeys();
        for (j = 0, len = ref1.length; j < len; j++) {
          key = ref1[j];
          object[key.value] = this.getValue(key);
        }
        return object;
      }

      getValue(key) {
        return Pointer.of(Pointer.getNextChild(key));
      }

      getLength() {
        return Pointer.getInt32(this);
      }

      setLength(length = 0) {
        return Pointer.setInt32(this, length);
      }

    };

    Object.storeClass();

    Object.byteLength = 4;

    Object.keys = self.Object.keys;

    Object.values = self.Object.values;

    Object.prototype.getKeys = Array.prototype.get;

    return Object;

  }).call(this);

  ExtRef = (function() {
    class ExtRef extends Pointer {
      static from(value = null) {
        if (value instanceof this) {
          return value;
        }
        return this.malloc().set(value);
      }

      get() {
        return Pointer.getScopeValue(this.getIndex());
      }

      set(value = null) {
        var i;
        scope = Pointer.getScopeArray();
        if (-1 === (i = scope.indexOf(value))) {
          i += scope.push(value);
        }
        this.setIndex(i);
        return this;
      }

      getIndex() {
        return Pointer.getInt32(this);
      }

      setIndex(index = 0) {
        return Pointer.setInt32(this, index);
      }

    };

    ExtRef.storeClass();

    ExtRef.byteLength = 4;

    return ExtRef;

  }).call(this);

  TypedArray = class TypedArray extends Pointer {
    static from(value = []) {
      var length, ptri, store, stride, v;
      if (value instanceof TypedArray) {
        return value;
      }
      if (this === TypedArray) {
        switch (value.constructor.name) {
          case "Uint8Array":
            return Uint8Array.from(value);
          case "Int32Array":
            return Int32Array.from(value);
        }
        return Float32Array.from(value);
      }
      stride = this.prototype.TypedArray.BYTES_PER_ELEMENT;
      length = value.length;
      ptri = this.malloc(length * stride);
      store = Pointer[this.setter];
      if (!length) {
        return ptri;
      }
      while (length--) {
        if (v = value[length]) {
          store(ptri, v, length * stride);
        }
      }
      return ptri;
    }

    get() {
      var array, length, load, stride;
      length = this.getLength();
      array = new this.TypedArray(length);
      load = Pointer[this.constructor.getter];
      stride = this.TypedArray.BYTES_PER_ELEMENT;
      while (length--) {
        array[length] = load(this, length * stride);
      }
      return array;
    }

    getLength() {
      return Pointer.getByteLength(this) / this.TypedArray.BYTES_PER_ELEMENT;
    }

  };

  Uint8Array = (function() {
    class Uint8Array extends TypedArray {};

    Uint8Array.classIndex = Uint8Array.storeClass(Uint8Array);

    Uint8Array.prototype.TypedArray = self.Uint8Array;

    Uint8Array.setter = "setUint8";

    Uint8Array.getter = "getUint8";

    return Uint8Array;

  }).call(this);

  Int32Array = (function() {
    class Int32Array extends TypedArray {};

    Int32Array.classIndex = Int32Array.storeClass(Int32Array);

    Int32Array.prototype.TypedArray = self.Int32Array;

    Int32Array.setter = "setInt32";

    Int32Array.getter = "getInt32";

    return Int32Array;

  }).call(this);

  Float32Array = (function() {
    class Float32Array extends TypedArray {};

    Float32Array.classIndex = Float32Array.storeClass(Float32Array);

    Float32Array.prototype.TypedArray = self.Float32Array;

    Float32Array.setter = "setFloat32";

    Float32Array.getter = "getFloat32";

    return Float32Array;

  }).call(this);

  UniqueId = class UniqueId extends String {
    static generate() {
      var char, i, id, randBool, randChar, randNum, uid;
      i = this.pattern.length;
      id = `${this.pattern}`;
      uid = "";
      while (i--) {
        randNum = Math.floor(10 * Math.random());
        randBool = 0.5 <= Math.random();
        randChar = String.fromCharCode(Math.floor(97 + Math.random() * 25));
        switch (char = id.charAt(i)) {
          case "?":
            uid += randBool && randNum || randChar;
            break;
          case "X":
            uid += randChar.toUpperCase();
            break;
          case "x":
            uid += randChar;
            break;
          default:
            uid += char;
        }
      }
      return this.from(uid);
    }

    static default() {
      return this.generate();
    }

  };

  UUIDv4 = (function() {
    class UUIDv4 extends UniqueId {};

    UUIDv4.storeClass();

    UUIDv4.pattern = "????????-????-????-????-????????????";

    return UUIDv4;

  }).call(this);

  define(Integer.prototype, {
    ["value"]: {
      enumerable: true,
      get: Integer.prototype.get,
      set: Integer.prototype.set
    }
  });

  define(Float.prototype, {
    ["value"]: {
      enumerable: true,
      get: Float.prototype.get,
      set: Float.prototype.set
    }
  });

  define(Boolean.prototype, {
    ["value"]: {
      enumerable: true,
      get: Boolean.prototype.get,
      set: Boolean.prototype.set
    }
  });

  define(String.prototype, {
    ["value"]: {
      enumerable: true,
      get: String.prototype.get,
      set: String.prototype.set
    },
    ["length"]: {
      enumerable: true,
      get: String.prototype.getLength,
      set: String.prototype.setLength
    }
  });

  define(Array.prototype, {
    ["length"]: {
      enumerable: true,
      get: Array.prototype.getLength,
      set: Array.prototype.setLength
    },
    ["value"]: {
      enumerable: true,
      get: Array.prototype.get
    }
  });

  define(Object.prototype, {
    ["length"]: {
      enumerable: true,
      get: Object.prototype.getLength,
      set: Object.prototype.setLength
    },
    ["value"]: {
      enumerable: true,
      get: Object.prototype.get
    }
  });

  define(ExtRef.prototype, {
    ["value"]: {
      enumerable: true,
      get: ExtRef.prototype.get,
      set: ExtRef.prototype.set
    }
  });

  define(TypedArray.prototype, {
    ["length"]: {
      enumerable: true,
      get: TypedArray.prototype.getLength,
      set: TypedArray.prototype.setLength
    },
    ["value"]: {
      enumerable: true,
      get: TypedArray.prototype.get
    }
  });

  PointerProperty = (function() {
    class PointerProperty extends Pointer {
      static from(Prototype, desc) {
        var name, ptri;
        ptri = this.malloc();
        if (Prototype instanceof ClassPointer) {
          Prototype = Prototype.class.value;
        }
        if (name = desc.name) {
          ptri.name = name;
        } else if (name = Prototype.name) {
          ptri.name = String.toCamelCase(name);
        }
        Prototype.storeClass();
        ptri.required = !!desc.required;
        ptri.class = Prototype;
        return ptri;
      }

    };

    PointerProperty.storeClass();

    PointerProperty.byteLength = 16;

    define(PointerProperty.prototype, {
      byteOffset: {
        enumerable: true,
        get: function() {
          return Pointer.getInt32(this);
        },
        set: function(value = 0) {
          return Pointer.setInt32(this, value);
        }
      },
      name: {
        enumerable: true,
        get: function() {
          return String.of(Pointer.getInt32(this, 4));
        },
        set: function(value = 0) {
          return Pointer.setInt32(this, String.from(value), 4);
        }
      },
      class: {
        enumerable: true,
        get: function() {
          return ExtRef.of(Pointer.getInt32(this, 8));
        },
        set: function(Proto) {
          return Pointer.setInt32(this, ExtRef.from(Proto), 8);
        }
      },
      required: {
        enumerable: true,
        get: function() {
          return Boolean.of(Pointer.getInt32(this, 12));
        },
        set: function(bool) {
          return Pointer.setInt32(this, Boolean.from(bool), 12);
        }
      }
    });

    return PointerProperty;

  }).call(this);

  PointerFilter = (function() {
    class PointerFilter extends Pointer {
      static from(Prototype, desc) {
        var name, ptri;
        ptri = this.malloc();
        if (Prototype instanceof ClassPointer) {
          Prototype = Prototype.class.value;
        }
        if (name = desc.name) {
          ptri.name = name;
        } else if (name = Prototype.name) {
          ptri.name = String.toCamelCase(name);
        }
        if (false !== desc.enumerable) {
          desc.enumerable = true;
        }
        Prototype.storeClass();
        ptri.class = Prototype;
        ptri.enumerable = desc.enumerable;
        return ptri;
      }

    };

    PointerFilter.storeClass();

    PointerFilter.byteLength = 12;

    define(PointerFilter.prototype, {
      name: {
        enumerable: true,
        get: function() {
          return String.of(Pointer.getInt32(this, 0));
        },
        set: function(value = 0) {
          return Pointer.setInt32(this, String.from(value), 0);
        }
      },
      class: {
        enumerable: true,
        get: function() {
          return ExtRef.of(Pointer.getInt32(this, 4));
        },
        set: function(Proto) {
          return Pointer.setInt32(this, ExtRef.from(Proto), 4);
        }
      },
      enumerable: {
        enumerable: true,
        get: function() {
          return Boolean.of(Pointer.getInt32(this, 8));
        },
        set: function(bool) {
          return Pointer.setInt32(this, Boolean.from(bool), 8);
        }
      }
    });

    return PointerFilter;

  }).call(this);

  ClassPointer = (function() {
    class ClassPointer extends Pointer {
      static from(Prototype) {
        var name, ptri;
        ptri = this.malloc();
        ptri.class = Prototype;
        Prototype.storeClass();
        define(Prototype, {
          classPointer: {
            value: this
          }
        });
        if (name = Prototype.name) {
          ptri.name = name;
        }
        return ptri;
      }

      new(props = {}) {
        var clsi, j, len, pkey, prop, ptri, pval, ref1;
        clsi = this.classIndex;
        ptri = this.class.value.malloc(this.byteLength, clsi);
        ref1 = this.filter(PointerProperty);
        for (j = 0, len = ref1.length; j < len; j++) {
          prop = ref1[j];
          pkey = prop.name.value;
          if (pval = props[pkey]) {
            ptri[pkey] = pval;
          } else if (prop.required.value) {
            ptri[pkey];
          }
        }
        return ptri;
      }

      defineProperty(name, desc, target = this.class.value.prototype) {
        if (name.startsWith("@")) {
          name = name.substring(1);
          target = this.class.value;
        }
        define(target, {
          [name]: desc
        });
        return this;
      }

      definePointer(Prototype, desc = {}) {
        var byteOffset, get, isF, isU, name, ptri, set, v, value;
        byteOffset = this.byteLength;
        ptri = PointerProperty.from(Prototype, desc);
        name = ptri.name.toString();
        ptri.byteOffset = byteOffset;
        this.byteLength = byteOffset + 4;
        get = null;
        set = function(value) {
          ptri = Prototype.from(value);
          Pointer.setInt32(this, ptri, byteOffset);
          return ptri;
        };
        isF = false;
        if (!desc.default && (v = Prototype.default)) {
          isF = !Pointer.isPrototypeOf(v);
          isF = isF && !(v instanceof Pointer);
          isF = isF && ("function" === typeof v);
          if (isF) {
            desc.default = v.bind(Prototype);
          } else {
            desc.default = v;
          }
        }
        value = desc.default;
        isU = "undefined" === typeof value;
        switch (true) {
          case isF:
            get = function() {
              if (ptri = Pointer.getInt32(this, byteOffset)) {
                return Prototype.of(ptri);
              }
              return set.call(this, value(this));
            };
            break;
          case isU:
            get = function() {
              if (ptri = Pointer.getInt32(this, byteOffset)) {
                return Prototype.of(ptri);
              }
              return set.call(this, Prototype.malloc());
            };
            break;
          case true:
            get = function() {
              if (ptri = Pointer.getInt32(this, byteOffset)) {
                return Prototype.of(ptri);
              }
              return set.call(this, value);
            };
        }
        return this.append(ptri).defineProperty(name, {
          ...desc,
          get,
          set,
          enumerable: true
        });
      }

      defineFilter(Prototype, desc = {}) {
        var get, name, ptri;
        ptri = PointerFilter.from(Prototype, desc);
        name = ptri.name.toString();
        get = function() {
          return this.filter(Prototype);
        };
        return this.append(ptri).defineProperty(name, {...desc, get});
      }

      apply(property, args = []) {
        return this.class.value[property].apply(this, args);
      }

      call(property, ...argN) {
        return this.class.value[property].call(this, ...argN);
      }

      of(ptri) {
        return this.class.value.of(ptri);
      }

      isPrototypeOf(ProtoClass) {
        return this.class.value.isPrototypeOf(ProtoClass);
      }

      storeClass() {
        return this.class.value.storeClass();
      }

    };

    ClassPointer.storeClass();

    ClassPointer.byteLength = 16;

    define(ClassPointer.prototype, {
      class: {
        enumerable: true,
        get: function() {
          return ExtRef.of(Pointer.getInt32(this));
        },
        set: function(value) {
          if (value instanceof ClassPointer) {
            value = value.class.value;
          }
          return Pointer.setInt32(this, ExtRef.from(value));
        }
      },
      name: {
        enumerable: true,
        get: function() {
          return String.of(Pointer.getInt32(this, 4));
        },
        set: function(value = "") {
          return Pointer.setInt32(this, String.from(value), 4);
        }
      },
      byteLength: {
        enumerable: true,
        get: function() {
          return Pointer.getInt32(this, 8);
        },
        set: function(value = 0) {
          return Pointer.setInt32(this, value, 8);
        }
      },
      pointerProperties: {
        enumerable: true,
        get: function() {
          return this.filter(PointerProperty);
        }
      },
      pointerFilters: {
        enumerable: true,
        get: function() {
          return this.filter(PointerFilter);
        }
      },
      classIndex: {
        enumerable: true,
        set: function(value = 0) {
          return Pointer.setInt32(this, value, 12);
        },
        get: function() {
          var clsi;
          if (clsi = Pointer.getInt32(this, 12)) {
            return clsi;
          }
          return this.classIndex = this.class.value.storeClass();
        }
      }
    });

    return ClassPointer;

  }).call(this);

  addEventListener("message", function({
      data: [memory, module]
    }) {
    //console.log("#{name} received from main thread:", memory)
    global.memory = memory;
    return WebAssembly.instantiate(module, {global}).then(function({
        exports: e
      }) {
      return warn(e, global);
    });
  });

}).call(this);
