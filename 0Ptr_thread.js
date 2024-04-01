var kWindow, kWorker;

import {
  requestIdleCallback
} from "./window.js";

import {
  obj
} from "./Optr.js";

import {
  AtomicScope
} from "./0Ptr_scope.js";

import {
  KeyBase
} from "./0Ptr_keybase.js";

import {
  OPtr
} from "./0Ptr.js";

kWorker = "#worker";

kWindow = "#window";

export var THREAD_KEYBASE = KeyBase.generate({
  LOCAL_WEBWORKER: "local-webworker"
});

export var Thread = (function() {
  class Thread extends OPtr {
    scriptURL() {
      var blobUrl, modules;
      blobUrl = URL.createObjectURL(new Blob([this.addImports(...arguments)], {
        type: "application/javascript"
      }));
      modules = this.imports.map(function(i) {
        return i.modules.join(",\n\t");
      }).join(",\n\t");
      return URL.createObjectURL(new Blob([`import * as imports\nfrom '${blobUrl}'\n\n`, `import {\n\t${modules}\n}\nfrom '${blobUrl}'\n\n`, `addEventListener('ready',${this.function});`], {
        type: "application/javascript"
      }));
    }

    addImports() {
      var imports, item, j, k, len, len1, module, names, ref, url;
      for (j = 0, len = arguments.length; j < len; j++) {
        module = arguments[j];
        if (module.__proto__.metaUrl) {
          this.addImports(module.__proto__);
        }
        if (!(item = this.imports.find(function(i) {
          return i.metaUrl === module.metaUrl;
        }))) {
          item = this.imports[this.imports.length] = {
            metaUrl: module.metaUrl,
            modules: []
          };
        }
        if (!item.modules.includes(module.name)) {
          item.modules.push(module.name);
        }
      }
      imports = "";
      ref = this.imports.slice();
      for (k = 0, len1 = ref.length; k < len1; k++) {
        item = ref[k];
        names = item.modules.join(', ');
        url = item.metaUrl;
        imports += `export {${names}} from '${url}';\n`;
      }
      return imports;
    }

    send(message) {
      var data;
      data = this.encodeJSON(message);
      this.copyUint8(this.OFFSET_DATA_ARRAY, data);
      return this.storeUint32(this.OFFSET_DATA_LENGTH, data.byteLength);
    }

    init() {
      this.addImports(AtomicScope, KeyBase, OPtr, Thread);
      return this.createWorker(...arguments);
    }

    createWorker() {
      var script, worker;
      script = this.scriptURL(...arguments);
      worker = new Worker(script, {
        type: "module",
        name: this * 1
      });
      worker.postMessage(this.buffer);
      this.uuid = crypto.randomUUID();
      return this[kWorker] = worker;
    }

    //? runs on worker after setup
    //  mark this works at ONREADY
    //  todo now OPtr buffer settled   
    function() {
      var getObjectProp, module, scopei, setObjectProp;
      this.ptr = new Thread(+self.name);
      for (module in imports) {
        scopei = this.ptr.bcast("findScopei", module);
        if (scopei <= 0) {
          continue;
        } else {
          this.ptr.scopei(imports[module], scopei);
        }
      }
      setTimeout(() => {
        return console.warn(this.ptr.obj);
      });
      return console.warn(this.ptr);
      //! test test test
      getObjectProp = function(key) {
        return bc.postMessage({
          request: "getObjectProp",
          sender: self.name,
          receiver: "window",
          thread: 224,
          data: {
            scopei: 4,
            prop: key
          }
        });
      };
      setObjectProp = function(key, val) {
        return bc.postMessage({
          request: "setObjectProp",
          sender: self.name,
          receiver: "window",
          thread: 224,
          data: {
            scopei: 4,
            prop: key,
            val
          }
        });
      };
      return OPtr.prototype.obj[4] = new Proxy(eval(`new class ${name} {}`), {
        get: function() {
          var key, type;
          if (!(type = prop[key = arguments[1]])) {
            return void 0;
          }
          switch (type) {
            case "object":
              return console.warn("new proxy required");
            case "number":
              getObjectProp(key);
              return Number(ptr.lock().data);
            case "string":
              getObjectProp(key);
              return ptr.lock().data;
          }
        },
        set: function() {
          var key, type, val;
          val = arguments[2];
          if (!(type = prop[key = arguments[1]])) {
            return void 0;
          }
          switch (type) {
            case "number":
            case "string":
              setObjectProp(key, val);
              return ptr.lock().data;
          }
        }
      });
    }

  };

  Thread.metaUrl = import.meta.url;

  Thread.prototype.LENGTH_UUID = 36;

  Thread.prototype.OFFSET_LOCK = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_UUID = Thread.reserv(Uint8Array, Thread.prototype.LENGTH_UUID);

  Thread.prototype.OFFSET_WORKER = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_IS_LOCKED = Thread.reserv(Uint8Array);

  Thread.prototype.OFFSET_IS_ONLINE = Thread.reserv(Uint8Array);

  Thread.prototype.OFFSET_IS_IDLE = Thread.reserv(Uint8Array);

  Thread.prototype.OFFSET_DATA_LENGTH = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_DATA_ARRAY = Thread.reserv(Uint8Array, 64 * 1024);

  Thread.prototype.OFFSET_IMPORTS = Thread.reserv(Uint8Array, 4 + 256 * 20);

  Thread.prototype.imports = [];

  Object.defineProperties(Thread.prototype, {
    [kWindow]: {
      get: function() {
        return this.objUint32(this.OFFSET_WINDOW);
      },
      set: function() {
        return this.setUint32(this.OFFSET_WINDOW, this.scopei(arguments[0]));
      }
    },
    [kWorker]: {
      get: function() {
        return this.objUint32(this.OFFSET_WINDOW);
      },
      set: function() {
        return this.setUint32(this.OFFSET_WINDOW, this.scopei(arguments[0]));
      }
    },
    isOnline: {
      get: function() {
        return this.loadUint8(this.OFFSET_IS_ONLINE);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_IS_ONLINE, arguments[0]);
      }
    },
    isIdle: {
      get: function() {
        return this.loadUint8(this.OFFSET_IS_IDLE);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_IS_IDLE, arguments[0]);
      }
    },
    isLocked: {
      get: function() {
        return this.loadUint8(this.OFFSET_IS_LOCKED);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_IS_LOCKED, arguments[0]);
      }
    },
    dataLength: {
      get: function() {
        return this.loadUint32(this.OFFSET_DATA_LENGTH);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_DATA_LENGTH, arguments[0]);
      }
    },
    dataArray: {
      get: function() {
        return this.arrayUint8(this.OFFSET_DATA_ARRAY, this.dataLength);
      },
      set: function() {
        return this.dataLength = this.copyUint8(this.OFFSET_DATA_ARRAY, arguments[0]);
      }
    },
    data: {
      get: function() {
        if (this.dataLength) {
          return this.decodeJSON(this.dataArray);
        }
      },
      set: function() {
        return this.dataArray = this.encodeJSON(arguments[0]);
      }
    },
    uuid: {
      get: function() {
        return this.decodeText(this.arrayUint8(this.OFFSET_UUID, this.LENGTH_UUID));
      },
      set: function() {
        return this.copyUint8(this.OFFSET_UUID, this.encodeText(arguments[0]));
      }
    }
  });

  return Thread;

}).call(this);

export {
  Thread as default
};
