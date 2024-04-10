self.name = "window";

(self.init = function() {
  var CONST, addUint32, bc, blobURL, bridgeHandler, bridgemessage, buffer, createBlobURL, createBuffer, createThreads, createWorker, defineTypedArrays, dw, f32, getUint32, i32, i8, initMemory, isBridge, isThread, isWindow, listenEvents, littleEnd, loadUint32, malloc, now, pnow, randomUUID, resolvCall, resolvs, selfName, setUint32, sharedHandler, state, storeUint32, threadHandler, threadId, threadmessage, u32, ui8, workers;
  CONST = {
    BUFFER_TEST_START_LENGTH: 1e6,
    BUFFER_TEST_STEP_DIVIDER: 1e1,
    INITIAL_BYTELENGTH: 64,
    BYTES_PER_ELEMENT: 4,
    HEADERS_LENGTH: 16,
    HEADERS_BYTE_LENGTH: 4 * 16
  };
  [blobURL, malloc, littleEnd, dw, i8, ui8, i8, i32, u32, f32, addUint32, loadUint32, storeUint32, getUint32, setUint32] = [];
  bc = new BroadcastChannel("0ptr");
  selfName = self.name;
  isWindow = typeof document !== "undefined" && document !== null;
  isBridge = /bridge/i.test(selfName);
  isThread = /thread/i.test(selfName);
  threadId = isThread && parseInt(selfName.match(/\d+/));
  now = Date.now();
  pnow = performance.now();
  state = 0;
  buffer = null;
  resolvs = new WeakMap();
  workers = new Array();
  littleEnd = new Uint8Array(Uint32Array.of(0x01).buffer)[0];
  resolvCall = function() {
    var begin, column, last, line, stack;
    
    //console.warn "Error:\n\t  at #{stack.substring(begin + 9, last)}"
    //parseInt( stack.substring column + 1, last ) +
    Error.captureStackTrace(this);
    stack = this.stack.toString();
    begin = stack.indexOf("onready");
    last = stack.indexOf(")", begin);
    column = stack.lastIndexOf(":", last);
    line = stack.lastIndexOf(":", column - 1);
    return parseInt(stack.substring(line + 1, column));
  };
  randomUUID = function() {
    return (typeof crypto !== "undefined" && crypto !== null ? crypto.randomUUID() : void 0) || btoa(new Date().toISOString()).toLowerCase().split("").toSpliced(8, 0, "-").toSpliced(13, 0, "-").toSpliced(18, 0, "-").toSpliced(24, 0, "-").join("").substring(0, 36).trim().padEnd(36, String.fromCharCode(50 + Math.random() * 40));
  };
  initMemory = function() {
    var lock, sliceUint32, subUint32, subarrayUint32, unlock;
    console.log(name, "initilaizing malloc", buffer);
    u32 = new Uint32Array(buffer);
    i32 = new Int32Array(buffer);
    dw = new DataView(buffer);
    malloc = Atomics.add.bind(Atomics, u32, 0);
    lock = Atomics.wait.bind(Atomics, i32);
    unlock = Atomics.notify.bind(Atomics, i32);
    addUint32 = Atomics.add.bind(Atomics, u32);
    subUint32 = Atomics.sub.bind(Atomics, u32);
    loadUint32 = Atomics.load.bind(Atomics, u32);
    storeUint32 = Atomics.store.bind(Atomics, u32);
    getUint32 = function(o) {
      return dw.getUint32(o, littleEnd);
    };
    setUint32 = function(o, v) {
      return dw.setUint32(o, v, littleEnd);
    };
    subarrayUint32 = u32.subarray.bind(u32);
    sliceUint32 = u32.slice.bind(u32);
    return buffer;
  };
  if (isWindow) {
    console.log("hello from window");
    sharedHandler = {
      register: function(data) {
        console.warn("registering worker:", data);
        Object.assign(this.info, data);
        return this;
      }
    };
    bridgeHandler = {
      hello: function() {}
    };
    threadHandler = {
      hello: function() {}
    };
    bridgemessage = function({data}) {
      var handler, request, results;
      results = [];
      for (request in data) {
        data = data[request];
        console.log("bridge message:", request, data);
        handler = bridgeHandler[request] || sharedHandler[request] || (function() {
          throw [/NO_HANDLER_FOR_BRIDGE/, request, data];
        })();
        results.push(handler.call(this, data));
      }
      return results;
    };
    threadmessage = function({data}) {
      var handler, request, results;
      results = [];
      for (request in data) {
        data = data[request];
        console.log("thread message:", request, data);
        handler = threadHandler[request] || sharedHandler[request] || (function() {
          throw [/NO_HANDLER_FOR_THREAD/, request, data];
        })();
        results.push(handler.call(this, data));
      }
      return results;
    };
    createBuffer = function() {
      var Buffer, maxByteLength;
      Buffer = typeof SharedArrayBuffer !== "undefined" && SharedArrayBuffer !== null ? SharedArrayBuffer : ArrayBuffer;
      buffer = !(maxByteLength = CONST.BUFFER_TEST_START_LENGTH);
      while (!buffer) {
        try {
          buffer = new Buffer(CONST.INITIAL_BYTELENGTH, {maxByteLength});
        } catch (error) {
          maxByteLength /= CONST.BUFFER_TEST_STEP_DIVIDER;
        }
      }
      initMemory(buffer);
      return malloc(CONST.INITIAL_BYTELENGTH);
    };
    createWorker = function(name, onmessage) {
      var worker;
      worker = new Worker(blobURL, {name});
      worker.info = {};
      worker.onerror = worker.onmessageerror = console.error;
      worker.onmessage = onmessage.bind(worker);
      return workers[workers.length] = worker;
    };
    createThreads = function() {
      var bridge, i, j, results, thread;
      bridge = createWorker("bridge", bridgemessage);
      bridge.postMessage({
        setup: {blobURL, buffer}
      });
      results = [];
      for (i = j = 0; j < 2; i = ++j) {
        thread = createWorker("thread" + i, threadmessage);
        results.push(thread.postMessage({
          setup: {blobURL, buffer}
        }));
      }
      return results;
    };
    createBlobURL = function() {
      var __0ptr, __user;
      __user = "\nconst onready = function ( document ) {\n\t" + `${[...document.scripts].find((d) => {
        return d.text && d.src;
      }).text.trim()}\n` + "};\n";
      __0ptr = "(" + `${self.init}`.split("return " + "0xdead;")[0];
      blobURL = URL.createObjectURL(new Blob([__0ptr, __user, "}).call(self);"], {
        type: "application/javascript"
      }));
      return delete self.init;
    };
    listenEvents = function() {
      return window.onclick = function() {
        return console.table(workers.map(function(w) {
          return w.info;
        }));
      };
    };
    queueMicrotask(function() {
      listenEvents();
      createBuffer();
      createBlobURL();
      return createThreads();
    });
  }
  if (isBridge) {
    console.log("hello from bridge");
    defineTypedArrays = function() {
      var Uint32Array, Uint8Array;
      Object.defineProperties(Object.getPrototypeOf(self.Uint8Array).prototype, {
        resolvedAt: {
          get: function() {
            return resolvs.get(this);
          },
          set: function() {
            return resolvs.set(this, arguments[0]);
          }
        },
        resolvLine: {
          get: function() {
            console.warn(`Error:\n\tat ${blobURL}:${this.resolvedAt}`);
            return "look at console ->";
          }
        }
      });
      Object.defineProperties(self, {
        Uint32Array: Uint32Array = class Uint32Array extends self.Uint32Array {
          constructor() {
            super(...arguments).resolvedAt = resolvCall();
          }

        },
        Uint8Array: Uint8Array = class Uint8Array extends self.Uint8Array {
          constructor() {
            super(...arguments).resolvedAt = resolvCall();
          }

        }
      });
      return console.log("defining properties");
    };
    addEventListener("message", function(e) {
      var data, ref, req, results, uuid;
      ref = e.data;
      results = [];
      for (req in ref) {
        data = ref[req];
        switch (req) {
          case "setup":
            uuid = randomUUID();
            buffer = data.buffer;
            blobURL = data.blobURL;
            initMemory(buffer);
            defineTypedArrays();
            console.log({buffer, self});
            postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid, state}
            });
            malloc(22);
            results.push(onready());
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    });
  }
  if (isThread) {
    console.log("hello from thread", {threadId});
    addEventListener("message", function(e) {
      var data, ref, req, results, uuid;
      ref = e.data;
      results = [];
      for (req in ref) {
        data = ref[req];
        switch (req) {
          case "setup":
            uuid = randomUUID();
            buffer = data.buffer;
            blobURL = data.blobURL;
            initMemory(buffer);
            console.log({buffer, self});
            results.push(postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid, state}
            }));
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    });
  }
  return 0xdead;
})();
