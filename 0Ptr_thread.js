var bc;

import {
  Scope
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
      var imports, item, j, l, len, len1, module, names, ref1, ref2, url;
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
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        item = ref2[l];
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

    init(ptr, handler) {
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

    getScopeiProp(ref, prop) {
      var name, result, scopei, type;
      type = ref[prop];
      name = ref.__name__;
      scopei = ref.__scopei__;
      console.log("getting scopei.prop:", {prop, type});
      result = this.postMessage("getScopeiProp", {scopei, prop});
      console.log("result scopei.prop:", result);
      return result.prop;
    }

    createProxy(scopei, name, props = {}) {
      var _thssi, getter, getters, key, proto, type;
      name = `${name}`.substring(0, 64);
      proto = new (eval(`(class ${name} {})`))();
      console.warn("creatingproxy", {scopei, name, props});
      _thssi = this;
      getter = function(key) {
        return _thssi.postMessage("getScopeiProp", {scopei, key});
      };
      getters = function(prop, key) {
        return _thssi.postMessage("getScopeiProps", {scopei, prop, key});
      };
      Object.defineProperties(proto, {
        __scopei__: {
          value: scopei
        },
        __name__: {
          value: name
        }
      });
      for (key in props) {
        type = props[key];
        if (type === "function") {
          Object.defineProperty(proto, key, {
            value: function() {}
          });
        } else if (type === "object") {
          Object.defineProperty(proto, key, {
            get: function() {
              return new Proxy(new (eval(`(class ${key} {})`))(), {});
            }
          });
        } else {
          Object.defineProperty(proto, key, {
            get: function() {
              var prop;
              ({type, prop} = getter(key));
              return prop;
            },
            set: function() {}
          });
        }
      }
      return new Proxy(proto, {
        get: function(ref, key) {
          var j, k, len, prop, t, target;
          ({type, prop} = getter(key));
          if (type !== "object") {
            return prop;
          }
          props = getters(prop, key);
          target = new (eval(`(class ${key} {})`))();
          for (t = j = 0, len = props.length; j < len; t = ++j) {
            k = props[t];
            if (t === "function") {
              Object.defineProperty(target, k, {
                value: function() {}
              });
            } else if (t === "object") {
              Object.defineProperty(target, k, {
                get: function() {}
              });
            } else {
              Object.defineProperty(target, k, {
                get: function() {},
                set: function() {}
              });
            }
          }
          return new Proxy(target, {});
        },
        set: function() {}
      });
    }

    loadScopei(scopei) {
      var name, object, props, type;
      ({type, name, props} = this.postMessage("loadScopei", scopei));
      object = (function() {
        switch (type) {
          case "prototype":
            return self.imports[name];
          case "object":
            return this.createProxy(scopei, name, props);
        }
      }).call(this);
      return self.obj[scopei] = object;
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
      modules: ["Scope"],
      metaUrl: Scope.metaUrl
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
  self.obj = [null];
  OPtr.setup(new SharedArrayBuffer(1024 * 1024));
  self.onclick = function() {
    return console.warn(obj);
  };
  self.name = "window";
} else {
  addEventListener("message", function(e) {
    var thread;
    OPtr.setup(e.data.buffer);
    thread = new Thread(+self.name);
    self.obj = new Proxy([null], {
      get: function(_obj, i) {
        var ref1;
        return (ref1 = _obj[i]) != null ? ref1 : thread.loadScopei(i);
      }
    });
    thread.initDedicated();
    return dispatchEvent(new CustomEvent("ready", {
      detail: e.data.ptri
    }));
  }, {
    once: true
  });
}

bc.onmessage = function() {
  var data, desc, j, key, len, name, obji, prop, props, proto, ptr, ptri, ref1, scopei, type;
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
        throw ["NONONONNOONO", data, obj];
      }
      if (OPtr.isPrototypeOf(obj[scopei])) {
        ptr.data = {
          type: "prototype",
          name: obj[scopei].name
        };
        return ptr.unlock();
      }
      switch (typeof obj[scopei]) {
        case "object":
          obji = obj[scopei];
          name = obji.constructor.name || obji.name;
          data = {
            type: "object",
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
    case "getScopeiProps":
      if (!obj[data.scopei]) {
        return;
      }
      prop = obj[data.scopei][data.prop];
      type = typeof prop;
      name = (prop != null ? prop.constructor.name : void 0) || (prop != null ? prop.name : void 0);
      props = {};
      for (key in prop[data.key]) {
        props[key] = {
          name: key,
          type: typeof prop[key]
        };
      }
      ptr.data = {type, name, prop};
      return ptr.unlock();
    case "getScopeiProp":
      if (!obj[data.scopei]) {
        return;
      }
      prop = obj[data.scopei][data.prop];
      type = typeof prop;
      name = (prop != null ? prop.constructor.name : void 0) || (prop != null ? prop.name : void 0);
      ptr.data = {type, name, prop};
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
