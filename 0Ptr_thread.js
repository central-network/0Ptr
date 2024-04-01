var bc;

import {
  AtomicScope
} from "./0Ptr_scope.js";

import {
  KeyBase
} from "./0Ptr_keybase.js";

import {
  OPtr
} from "./0Ptr.js";

bc = new BroadcastChannel("OPtr");

export var THREAD_KEYBASE = KeyBase.generate({
  LOCAL_WEBWORKER: "local-webworker"
});

export var Thread = (function() {
  class Thread extends OPtr {
    scriptURL(onReadyFn) {
      var blobUrl, exports, imports, modules;
      imports = this.import();
      modules = this.imports.map(function(i) {
        return i.modules.join(",\n\t");
      }).join(",\n\t");
      exports = `export { ${modules.replace(/\s+|\n|\t/g, ' ')} };\n`;
      blobUrl = URL.createObjectURL(new Blob([imports, exports, "\nself.bc = new BroadcastChannel('OPtr');\n", `\nself.imports = {\n\t${modules}\n};\n\n`], {
        type: "application/javascript"
      }));
      return URL.createObjectURL(new Blob([`import {\n\t${modules}\n}\nfrom '${blobUrl}';\n\n`, `addEventListener( 'ready', ${onReadyFn});\n\n`], {
        type: "application/javascript"
      }));
    }

    import() {
      var imports, item, j, k, len, len1, module, names, ref1, ref2, url;
      ref1 = [...arguments];
      for (j = 0, len = ref1.length; j < len; j++) {
        module = ref1[j];
        if (module.__proto__.metaUrl) {
          this.import(module.__proto__);
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
      ref2 = this.imports.slice();
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        item = ref2[k];
        names = item.modules.join(', ');
        url = item.metaUrl;
        imports += `import {${names}} from '${url}';\n`;
      }
      return imports + "\n";
    }

    send(message) {
      var data;
      data = this.encodeJSON(message);
      this.copyUint8(this.OFFSET_DATA_ARRAY, data);
      return this.storeUint32(this.OFFSET_DATA_LENGTH, data.byteLength);
    }

    init(handler, ptr) {
      var script, worker;
      this[this.kSelf] = self;
      this.uuid = crypto.randomUUID();
      script = this.scriptURL(handler);
      worker = this[this.kWorker] = new Worker(script, {
        type: "module",
        name: +this
      });
      worker.postMessage({
        buffer: this.buffer,
        ptri: ptr * 1
      });
      return this;
    }

    initDedicated() {
      this.isOnline = 1;
      this.loadScopei(this.getWorkerScopei());
      this.loadScopei(this.getSelfScopei());
      return this;
    }

    setWorker() {
      return this[this.kWorker] = arguments[0];
    }

    getWorkerScopei() {
      return this.loadUint32(this.OFFSET_WORKER);
    }

    setSelf() {
      return this[this.kSelf] = arguments[0];
    }

    getSelfScopei() {
      return this.loadUint32(this.OFFSET_SELF);
    }

    postMessage(type, data) {
      bc.postMessage({
        type,
        data,
        ptri: +this
      });
      return this.lock().data;
    }

    createProxy(name, props = {}) {
      var proto, ref;
      name = `${name}`.substring(0, 64);
      proto = new (eval(`(class ${name} {})`))();
      ref = Object.assign(proto, props);
      return new Proxy(ref, {});
    }

    loadScopei(scopei) {
      var name, obji, props;
      if (obji = self.obj[scopei]) {
        return obji;
      }
      ({name, props} = this.postMessage("loadScopei", scopei));
      return self.obj[scopei] = this.createProxy(name, props);
    }

    old() {
      var getObjectProp, ptrProtoClass, setObjectProp;
      ptrProtoClass = function(imports, PtrClassName) {
        var scopei;
        bc.postMessage({
          type: "findScopei",
          data: PtrClassName,
          ptri: +self.ptr
        });
        if (0 > (scopei = self.ptr.lock().data)) {
          return;
        }
        self.ptr.scopei(imports[module], scopei);
        return imports[module];
      };
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

  Thread.prototype.kWorker = "#worker";

  Thread.prototype.kSelf = "#self";

  Thread.metaUrl = import.meta.url;

  Thread.prototype.LENGTH_UUID = 36;

  Thread.prototype.OFFSET_LOCK = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_UUID = Thread.reserv(Uint8Array, Thread.prototype.LENGTH_UUID);

  Thread.prototype.OFFSET_WORKER = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_SELF = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_IS_LOCKED = Thread.reserv(Uint8Array);

  Thread.prototype.OFFSET_IS_ONLINE = Thread.reserv(Uint8Array);

  Thread.prototype.OFFSET_IS_BUSY = Thread.reserv(Uint8Array);

  Thread.prototype.OFFSET_DATA_LENGTH = Thread.reserv(Uint32Array);

  Thread.prototype.OFFSET_DATA_ARRAY = Thread.reserv(Uint8Array, 64 * 1024);

  Thread.prototype.OFFSET_IMPORTS = Thread.reserv(Uint8Array, 4 + 256 * 20);

  Thread.prototype.imports = [
    {
      modules: ["AtomicScope"],
      metaUrl: AtomicScope.metaUrl
    },
    {
      modules: ["KeyBase"],
      metaUrl: KeyBase.metaUrl
    },
    {
      modules: ["OPtr"],
      metaUrl: OPtr.metaUrl
    },
    {
      modules: ["Thread"],
      metaUrl: Thread.metaUrl
    }
  ];

  Object.defineProperties(Thread.prototype, {
    [Thread.prototype.kSelf]: {
      get: function() {
        return this.objUint32(this.OFFSET_SELF);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_SELF, this.scopei(arguments[0]));
      }
    },
    [Thread.prototype.kWorker]: {
      get: function() {
        return this.objUint32(this.OFFSET_WORKER);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_WORKER, this.scopei(arguments[0]));
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
    isBusy: {
      get: function() {
        return this.loadUint8(this.OFFSET_IS_BUSY);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_IS_BUSY, arguments[0]);
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

if ((typeof window !== "undefined" && window !== null) && (typeof document !== "undefined" && document !== null)) {
  OPtr.setup(new SharedArrayBuffer(1024 * 1024));
  self.onclick = function() {
    return console.warn(obj);
  };
  self.name = "window";
} else {
  addEventListener("message", function(e) {
    OPtr.setup(e.data.buffer);
    new Thread(+self.name).initDedicated();
    return dispatchEvent(new CustomEvent("ready", {
      detail: e.data.ptri
    }));
  }, {
    once: true
  });
}

bc.onmessage = function() {
  var data, desc, j, len, name, obji, prop, proto, ptr, ptri, ref1, scopei, type;
  ({type, data, ptri} = arguments[0].data);
  (ptr = new Thread(ptri));
  switch (type) {
    case "findScopei":
      ref1 = obj.slice(1);
      for (j = 0, len = ref1.length; j < len; j++) {
        proto = ref1[j];
        if (data === (proto != null ? proto.name : void 0)) {
          ptr.data = obj.indexOf(proto);
          return ptr.unlock();
        }
      }
      ptr.data = -1;
      return ptr.unlock();
    //? delayed unlocker for not found
    //  todo check inter proxied owners
    case "loadScopei":
      if (0 === ptri - self.name) {
        return;
      }
      if (obj[scopei = data] == null) {
        ptr.unlock();
        throw ["NONONONNOONO"];
      }
      switch (typeof obj[scopei]) {
        case "object":
          obji = obj[scopei];
          name = obji.constructor.name || obji.name;
          data = {
            name,
            props: {}
          };
          for (prop in obji) {
            desc = obji[prop];
            data.props[prop] = typeof desc;
          }
          ptr.data = data;
          return ptr.unlock();
      }
      break;
    case "getObjectProp":
      if (!obj[data.scopei]) {
        return;
      }
      ptr.data = obj[data.scopei][data.prop];
      return ptr.unlock();
    case "setObjectProp":
      if (!obj[data.scopei]) {
        return;
      }
      console.warn(data.prop, data.val);
      obj[data.scopei][data.prop] = data.val;
      ptr.data = obj[data.scopei][data.prop];
      return ptr.unlock();
  }
};
