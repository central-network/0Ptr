var BUFFER_BYTELENGTH, BUFFER_BYTEOFFSET, BYTES_PER_POINTER, INDEX_BYTELENGTH, INDEX_BYTEOFFSET, INDEX_LENGTH, INDEX_PARENT, INDEX_PROTOTYPE, LENGTH_OF_POINTER, Pointer, Scope, Thread, extendTypedArray, f32, fn, getCallerFilePath, getURLBlobExports, getURLTextContent, sab, scope, setPointerAtomics, u16, u32, ui8,
  splice = [].splice;

[[sab = null, f32 = null, ui8 = null, u16 = null, u32 = null], BUFFER_BYTELENGTH = 1e7, LENGTH_OF_POINTER = 12, BYTES_PER_POINTER = 4 * LENGTH_OF_POINTER, BUFFER_BYTEOFFSET = 1e5 * BYTES_PER_POINTER];

//? await getURLBlobExports fileURL
getURLBlobExports = function() {
  return new Promise((done) => {
    var pid, url;
    pid = new Worker(URL.createObjectURL(url = new Blob([`import * as f from '${arguments[0]}';` + "postMessage(Object.keys(f));"], {
      type: "application/javascript"
    })), {
      type: "module"
    });
    return pid.onmessage = function({data}) {
      URL.revokeObjectURL(url);
      return pid.terminate(done(data));
    };
  });
};

//? await getURLTextContent fileURL
getURLTextContent = function() {
  return new Promise((done) => {
    return fetch(arguments[0]).then(function(v) {
      return v.text();
    }).then(done);
  });
};

//? getCallerFilePath()
getCallerFilePath = function() {
  var currentFile, currentPath, err, file, name, originalFunc, ref, ref1, stackedFile, stackedPath, trimResolved;
  trimResolved = arguments[0] != null ? arguments[0] : arguments[0] = true;
  originalFunc = Error.prepareStackTrace;
  try {
    err = new Error();
    Error.prepareStackTrace = function() {
      return arguments[1];
    };
    currentFile = err.stack.shift().getFileName();
    while (err.stack.length) {
      stackedFile = err.stack.shift().getFileName();
      if (stackedFile !== currentFile) {
        break;
      }
    }
  } finally {
    Error.prepareStackTrace = originalFunc;
  }
  ref = stackedFile.split("/"), [...stackedPath] = ref, [name] = splice.call(stackedPath, -1);
  ref1 = currentFile.split("/"), [...currentPath] = ref1, [file] = splice.call(currentPath, -1);
  if (stackedPath.join("/") === currentPath.join("/")) {
    if (trimResolved) {
      return `./${name}`;
    }
  }
  return stackedFile;
};

//? setPointerAtomics( sab )
setPointerAtomics = function() {
  [sab = new SharedArrayBuffer(BUFFER_BYTELENGTH)] = arguments;
  Object.defineProperty(Pointer.prototype, "buffer", {
    value: sab
  });
  ui8 = new Uint8Array(sab);
  u32 = new Uint32Array(sab);
  u16 = new Uint16Array(sab);
  f32 = new Float32Array(sab);
  if (!arguments.length) {
    Atomics.add(u32, 0, BYTES_PER_POINTER);
    Atomics.add(u32, 1, BUFFER_BYTEOFFSET);
  }
  return Pointer;
};

addEventListener("message", fn = function(e) {
  var ai32;
  if (Pointer.prototype.buffer) {
    return;
  }
  //removeEventListener "message", fn
  setPointerAtomics(e.data);
  ai32 = new Int32Array(new SharedArrayBuffer(1e4));
  Object.defineProperties(Pointer.prototype, {
    loadScope: {
      value: function(i) {
        //write request opcode
        Thread.operation(ai32, Thread.OP_LOADSCOPE);
        //write request arg length
        Thread.argLength(ai32, 1);
        //write args
        Thread.arguments(ai32, i);
        //lock until notify
        return Thread.waitReply(ai32);
      }
    }
  });
  if (name === "0") {
    //read response and store
    // todo not necessary now 
    //! scope[ i ] = self.GL[ Thread.readAsText ai32 ]
    console.warn(new Pointer(12));
  }
  if (name === "1") {
    console.warn(new Pointer(24));
  }
  return console.warn(scope);
});

Pointer = class Pointer extends Number {
  constructor() {
    var byteLength;
    if (arguments.length !== 0) {
      return super(arguments[0]).usePrototype(this.class.prototype);
    }
    super(Pointer.palloc() / 4).setPrototype(scope.index(this.constructor));
    if (byteLength = this.constructor.byteLength) {
      this.setByteOffset(Pointer.malloc(byteLength));
      this.setByteLength(byteLength);
      this.setLength(byteLength / this.BYTES_PER_ELEMENT);
    }
    this.init();
  }

};

Thread = (function() {
  class Thread extends Worker {
    static waitReply() {
      var ai32;
      ai32 = arguments[0];
      Atomics.store(ai32, this.INDEX_PREPARATE, 0);
      //send switch buffer
      postMessage(ai32);
      //lock until notify
      return Atomics.wait(ai32, this.INDEX_PREPARATE);
    }

    static sendReply() {
      var ai32;
      ai32 = arguments[0];
      return Atomics.notify(ai32, this.INDEX_PREPARATE, 1);
    }

    static readAsText() {
      var ai32, offset, string, strlen;
      ai32 = arguments[0];
      offset = Thread.INDEX_ARGUMENTS * 4;
      strlen = Thread.argLength(ai32);
      string = new Uint8Array(ai32.buffer, offset, strlen);
      return new TextDecoder().decode(string.slice());
    }

    static operation() {
      var ai32, value;
      ai32 = arguments[0];
      if (!(value = arguments[1])) {
        return Atomics.load(ai32, this.INDEX_OPERATION);
      }
      return Atomics.store(ai32, this.INDEX_OPERATION, value);
    }

    static argLength() {
      var ai32, value;
      ai32 = arguments[0];
      if (!(value = arguments[1])) {
        return Atomics.load(ai32, this.INDEX_ARGLENGTH);
      }
      return Atomics.store(ai32, this.INDEX_ARGLENGTH, value);
    }

    static arguments() {
      var ai32, i, value;
      ai32 = arguments[0];
      i = arguments[2] || 0;
      if (!(value = arguments[1])) {
        return Atomics.load(ai32, this.INDEX_ARGUMENTS + i);
      }
      return Atomics.store(ai32, this.INDEX_ARGUMENTS + i, value);
    }

    static options() {
      return {
        type: "module",
        name: arguments[0]
      };
    }

    constructor() {
      var e, id;
      try {
        super(Thread.scriptURL, Thread.options(id = arguments[0]));
      } catch (error) {
        e = error;
        console.error(e);
      }
      this.onmessageerror = console.error;
      this.onmessage = ({
          data: ai32
        }) => {
        var i, j, k, l, len, m, r, ref, v;
        //read opcode
        console.log(`atomic request (${id}) op:`, Thread.operation(ai32));
        console.log(`atomic request (${id}) arglen:`, Thread.argLength(ai32));
        console.log(`atomic request (${id}) arguments:`, Thread.arguments(ai32));
        switch (Thread.operation(ai32)) {
          case Thread.OP_LOADSCOPE:
            i = Thread.arguments(ai32);
            r = new TextEncoder().encode(scope[i].name);
            m = r.byteLength % ai32.BYTES_PER_ELEMENT;
            l = r.byteLength + ai32.BYTES_PER_ELEMENT - m;
            Thread.argLength(ai32, r.byteLength);
            ref = new ai32.constructor(r.buffer.transfer(l));
            for (j = k = 0, len = ref.length; k < len; j = ++k) {
              v = ref[j];
              Thread.arguments(ai32, v, j);
            }
            return Thread.sendReply(ai32);
        }
      };
      this.postMessage(Pointer.prototype.buffer);
    }

  };

  Thread.OP_LOADSCOPE = 23;

  Thread.INDEX_PREPARATE = 0;

  Thread.INDEX_OPERATION = 1;

  Thread.INDEX_ARGLENGTH = 2;

  Thread.INDEX_ARGUMENTS = 3;

  Thread.prototype.pool = [];

  return Thread;

}).call(this);

Scope = (function() {
  class Scope extends Array {
    index() {
      var cmd, file, i, j, k, len, mode, mods, name, path, ref, ref1;
      if (-1 === (i = this.indexOf(arguments[0]))) {
        i += this.push(arguments[0]);
        //?  preparing threads' header
        if (Pointer.isPrototypeOf(arguments[0])) {
          file = getCallerFilePath(false);
          name = arguments[0].name;
          mode = null;
          ref = this.imports;
          for (j = k = 0, len = ref.length; k < len; j = ++k) {
            cmd = ref[j];
            ref1 = cmd.replace(/import|from/g, "").split(/\s+|\{|\,|\}|\'/g).filter(Boolean), [...mods] = ref1, [path] = splice.call(mods, -1);
            if (path !== file) {
              continue;
            }
            mode = [j, mods];
            break;
          }
          if (!mode) {
            mode = this.imports[this.imports.length] = [this.imports.length, []];
          }
          [j, mods] = mode;
          if (!mods.includes(name)) {
            mods.push(name);
          }
          mods = mods.join(", ");
          this.imports[j] = `import {${mods}} from '${file}'`;
          if (!this.indexes[j]) {
            this.indexes[j] = new Array;
          }
          this.indexes[j].push(`${name}.scopei(${i});`);
        }
      }
      return i;
    }

    store() {
      this.index(arguments[0]);
      return this;
    }

    constructor() {
      super().push(null);
    }

  };

  Scope.prototype.imports = [];

  Scope.prototype.indexes = [];

  return Scope;

}).call(this);

(extendTypedArray = function() {
  var TypedArray, k, len, ref, results;
  ref = [Float32Array, Uint8Array, Float64Array, Uint16Array, Uint32Array];
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    TypedArray = ref[k];
    results.push((function(TypedArray) {
      this[TypedArray.name] = (function() {
        var _Class;

        _Class = class extends this {};

        _Class.prototype.name = TypedArray.name;

        _Class.prototype.TypedArray = TypedArray;

        _Class.prototype.BYTES_PER_ELEMENT = TypedArray.BYTES_PER_ELEMENT;

        return _Class;

      }).call(this);
      return Object.defineProperties(this[TypedArray.name].prototype, {
        array: {
          get: function() {
            return new TypedArray(this.buffer, this.getByteOffset(), this.getLength());
          }
        },
        subarray: {
          value: function() {
            return this.array.subarray(...arguments);
          }
        }
      });
    }).call(Pointer, TypedArray));
  }
  return results;
})();

Object.defineProperties(Pointer, {
  scopei: {
    value: function() {
      return scope[arguments[0]] = this;
    }
  },
  headOffset: {
    value: 0,
    writable: true
  },
  palloc: {
    value: function() {
      return Atomics.add(u32, 0, BYTES_PER_POINTER);
    }
  },
  malloc: {
    value: function() {
      return Atomics.add(u32, 1, arguments[0]);
    }
  },
  ialloc: {
    value: function() {
      var PERELEMENT, headOffset, mod;
      PERELEMENT = arguments[0].BYTES_PER_ELEMENT;
      headOffset = this.headOffset;
      if (mod = headOffset % PERELEMENT) {
        headOffset += PERELEMENT - mod;
      }
      this.headOffset = headOffset + PERELEMENT;
      return headOffset / PERELEMENT;
    }
  }
});

INDEX_PROTOTYPE = Pointer.ialloc(Uint16Array);

INDEX_PARENT = Pointer.ialloc(Uint32Array);

INDEX_BYTEOFFSET = Pointer.ialloc(Uint32Array);

INDEX_BYTELENGTH = Pointer.ialloc(Uint32Array);

INDEX_LENGTH = Pointer.ialloc(Uint32Array);

Object.defineProperties(Pointer.prototype, {
  class: {
    get: function() {
      return this.proxy(this.getPrototype());
    }
  },
  parent: {
    get: function() {
      return new Pointer(this.getParent());
    },
    set: function() {
      return this.setParent(arguments[0]);
    }
  },
  add: {
    value: function() {
      return arguments[0].setParent(this);
    }
  },
  init: {
    value: function() {
      return this;
    }
  },
  store: {
    value: function() {
      return scope.index(arguments[0]);
    }
  },
  proxy: {
    value: function() {
      var i, object;
      if (!(i = arguments[0])) {
        return;
      }
      if (!(object = scope[i])) {
        return this.loadScope(i);
      }
      return object;
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  usePrototype: {
    value: function() {
      return Object.setPrototypeOf(this, arguments[0]);
    }
  },
  getPrototype: {
    value: function() {
      return Atomics.load(u16, this / 2 + INDEX_PROTOTYPE);
    }
  },
  setPrototype: {
    value: function() {
      return Atomics.store(u16, this / 2 + INDEX_PROTOTYPE, arguments[0]);
    }
  },
  getParent: {
    value: function() {
      return Atomics.load(u32, 1 * this + INDEX_PARENT);
    }
  },
  setParent: {
    value: function() {
      Atomics.store(u32, 1 * this + INDEX_PARENT, arguments[0]);
      return this;
    }
  },
  setByteLength: {
    value: function() {
      Atomics.store(u32, 1 * this + INDEX_BYTELENGTH, arguments[0]);
      return this;
    }
  },
  setByteOffset: {
    value: function() {
      Atomics.store(u32, 1 * this + INDEX_BYTEOFFSET, arguments[0]);
      return this;
    }
  },
  setByteLength: {
    value: function() {
      Atomics.store(u32, 1 * this + INDEX_BYTELENGTH, arguments[0]);
      return this;
    }
  },
  setLength: {
    value: function() {
      Atomics.store(u32, 1 * this + INDEX_LENGTH, arguments[0]);
      return this;
    }
  },
  getByteOffset: {
    value: function() {
      return Atomics.load(u32, 1 * this + INDEX_BYTEOFFSET);
    }
  },
  getByteLength: {
    value: function() {
      return Atomics.load(u32, 1 * this + INDEX_BYTELENGTH);
    }
  },
  getLength: {
    value: function() {
      return Atomics.load(u32, 1 * this + INDEX_LENGTH);
    }
  },
  loadUint32: {
    value: function() {
      return Atomics.load(u32, 1 * this + arguments[0]);
    }
  },
  storeUint32: {
    value: function() {
      Atomics.store(u32, 1 * this + arguments[0], arguments[1]);
      return this;
    }
  },
  loadUint16: {
    value: function() {
      return Atomics.load(u16, 2 * this + arguments[0]);
    }
  },
  storeUint16: {
    value: function() {
      Atomics.store(u16, 2 * this + arguments[0], arguments[1]);
      return this;
    }
  },
  loadUint8: {
    value: function() {
      return Atomics.load(ui8, 4 * this + arguments[0]);
    }
  },
  storeUint8: {
    value: function() {
      Atomics.store(ui8, 4 * this + arguments[0], arguments[1]);
      return this;
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  ["{{Pointer}}"]: {
    get: function() {
      var headOffset;
      headOffset = this * 4;
      return {
        byteOffset: this.getByteOffset(),
        byteLength: this.getByteLength(),
        length: this.getLength(),
        headers: {
          ui8: new Uint8Array(this.buffer, headOffset, BYTES_PER_POINTER / 1),
          u16: new Uint16Array(this.buffer, headOffset, BYTES_PER_POINTER / 2),
          u32: new Uint32Array(this.buffer, headOffset, BYTES_PER_POINTER / 4)
        }
      };
    }
  }
});

scope = new Scope();

if (typeof WorkerGlobalScope === "undefined" || WorkerGlobalScope === null) {
  setPointerAtomics();
  requestIdleCallback(function() {
    var code, e, i, k, results, t, type;
    code = [
      ...scope.imports,
      "",
      ...scope.indexes.flatMap(function(i) {
        return i.join("\n");
      })
    ].join("\n");
    type = "application/javascript";
    try {
      Thread.blob = new Blob([code], {type});
    } catch (error) {
      e = error;
      console.error(e);
    }
    try {
      Thread.scriptURL = URL.createObjectURL(Thread.blob);
    } catch (error) {
      e = error;
      console.error(e);
    }
    results = [];
    for (i = k = 0; k <= 1; i = ++k) {
      try {
        results.push(t = new Thread(i));
      } catch (error) {
        e = error;
        results.push(console.error(e));
      }
    }
    return results;
  });
  document.onclick = function() {
    return console.log(scope);
  };
}

export {
  Pointer as default,
  Pointer,
  Thread
};
