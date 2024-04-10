self.name = "window";

(self.init = function() {
  var CONST, Uint8Array, addInt16, addInt32, addInt8, addUint16, addUint32, addUint8, andInt16, andInt32, andInt8, andUint16, andUint32, andUint8, bc, blobURL, bridgeHandler, bridgemessage, buffer, compareInt16, compareInt32, compareInt8, compareUint16, compareUint32, compareUint8, createBlobURL, createBuffer, createThreads, createWorker, cu8, defineTypedArrays, dvw, exchangeInt16, exchangeInt32, exchangeInt8, exchangeUint16, exchangeUint32, exchangeUint8, f32, f64, getInt16, getInt32, getInt8, getUint16, getUint32, getUint8, i16, i32, i64, initMemory, isBridge, isThread, isWindow, listenEvents, littleEnd, loadInt16, loadInt32, loadInt8, loadUint16, loadUint32, loadUint8, lock, malloc, now, orInt16, orInt32, orInt8, orUint16, orUint32, orUint8, pnow, randomUUID, resolvCall, resolvs, selfName, setInt16, setInt32, setInt8, setUint16, setUint32, setUint8, sharedHandler, si8, state, storeInt16, storeInt32, storeInt8, storeUint16, storeUint32, storeUint8, subInt16, subInt32, subInt8, subUint16, subUint32, subUint8, threadHandler, threadId, threadmessage, u16, u32, u64, ui8, unlock, unlockBridge, unlockThreads, workers, xorInt16, xorInt32, xorInt8, xorUint16, xorUint32, xorUint8;
  CONST = {
    BUFFER_TEST_START_LENGTH: 1e6,
    BUFFER_TEST_STEP_DIVIDER: 1e1,
    INITIAL_BYTELENGTH: 64,
    BYTES_PER_ELEMENT: 4,
    HEADERS_LENGTH: 16,
    HEADERS_BYTE_LENGTH: 4 * 16
  };
  [blobURL, malloc, littleEnd, lock, unlock, unlockThreads, unlockBridge, dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16, andUint32, orUint32, xorUint32, subUint32, addUint32, loadUint32, storeUint32, getUint32, setUint32, exchangeUint32, compareUint32, andUint16, orUint16, xorUint16, subUint16, addUint16, loadUint16, storeUint16, getUint16, setUint16, exchangeUint16, compareUint16, andUint8, orUint8, xorUint8, subUint8, addUint8, loadUint8, storeUint8, getUint8, setUint8, exchangeUint8, compareUint8, andInt32, orInt32, xorInt32, subInt32, addInt32, loadInt32, storeInt32, getInt32, setInt32, exchangeInt32, compareInt32, andInt16, orInt16, xorInt16, subInt16, addInt16, loadInt16, storeInt16, getInt16, setInt16, exchangeInt16, compareInt16, andInt8, orInt8, xorInt8, subInt8, addInt8, loadInt8, storeInt8, getInt8, setInt8, exchangeInt8, compareInt8, Uint8Array] = [];
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
  workers = new self.Array();
  littleEnd = new self.Uint8Array(self.Uint32Array.of(0x01).buffer)[0];
  resolvCall = function() {
    var cBrace, cBreak, cColon, cCount, discard, error, lasti, length, stack, sum, val;
    error = {};
    Error.captureStackTrace(error);
    stack = error.stack.toString();
    length = stack.length;
    cBreak = "\n".charCodeAt();
    cBrace = "\)".charCodeAt();
    cColon = "\:".charCodeAt();
    cCount = 2;
    discard = false;
    lasti = length;
    sum = 0;
    while (length--) {
      switch (stack.charCodeAt(length)) {
        case cBreak:
          discard = !(cCount = 2);
          break;
        case cBrace:
          lasti = length;
          break;
        case cColon:
          if (!discard) {
            val = stack.substring(length + 1, lasti);
            sum = sum + parseInt(val);
          }
          lasti = length;
          if (!--cCount) {
            discard = true;
          }
      }
    }
    return sum;
  };
  randomUUID = function() {
    return (typeof crypto !== "undefined" && crypto !== null ? crypto.randomUUID() : void 0) || btoa(new Date().toISOString()).toLowerCase().split("").toSpliced(8, 0, "-").toSpliced(13, 0, "-").toSpliced(18, 0, "-").toSpliced(24, 0, "-").join("").substring(0, 36).trim().padEnd(36, String.fromCharCode(50 + Math.random() * 40));
  };
  initMemory = function() {
    var lockIndex;
    u64 = new self.BigUint64Array(buffer);
    i64 = new self.BigInt64Array(buffer);
    f32 = new self.Float32Array(buffer);
    f64 = new self.Float64Array(buffer);
    i32 = new self.Int32Array(buffer);
    u32 = new self.Uint32Array(buffer);
    i16 = new self.Int16Array(buffer);
    u16 = new self.Uint16Array(buffer);
    ui8 = new self.Uint8Array(buffer);
    cu8 = new self.Uint8ClampedArray(buffer);
    si8 = new self.Int8Array(buffer);
    dvw = new self.DataView(buffer);
    lockIndex = isBridge ? 2 : 3;
    malloc = Atomics.add.bind(Atomics, u32, 0);
    lock = function() {
      return Atomics.wait(i32, lockIndex);
    };
    unlockBridge = function() {
      return Atomics.notify(i32, 2);
    };
    unlockThreads = function() {
      return Atomics.notify(i32, 3);
    };
    unlock = function() {
      Atomics.notify(i32, 2);
      return Atomics.notify(i32, 3);
    };
    addUint32 = Atomics.add.bind(Atomics, u32);
    andUint32 = Atomics.and.bind(Atomics, u32);
    orUint32 = Atomics.or.bind(Atomics, u32);
    xorUint32 = Atomics.xor.bind(Atomics, u32);
    subUint32 = Atomics.sub.bind(Atomics, u32);
    loadUint32 = Atomics.load.bind(Atomics, u32);
    storeUint32 = Atomics.store.bind(Atomics, u32);
    exchangeUint32 = Atomics.exchange.bind(Atomics, u32);
    compareUint32 = Atomics.compareExchange.bind(Atomics, u32);
    getUint32 = function(o) {
      return dvw.getUint32(o, littleEnd);
    };
    setUint32 = function(o, v) {
      return dvw.setUint32(o, v, littleEnd);
    };
    addUint16 = Atomics.add.bind(Atomics, u16);
    andUint16 = Atomics.and.bind(Atomics, u16);
    orUint16 = Atomics.or.bind(Atomics, u16);
    xorUint16 = Atomics.xor.bind(Atomics, u16);
    subUint16 = Atomics.sub.bind(Atomics, u16);
    loadUint16 = Atomics.load.bind(Atomics, u16);
    storeUint16 = Atomics.store.bind(Atomics, u16);
    exchangeUint16 = Atomics.exchange.bind(Atomics, u16);
    compareUint16 = Atomics.compareExchange.bind(Atomics, u16);
    getUint16 = function(o) {
      return dvw.getUint16(o, littleEnd);
    };
    setUint16 = function(o, v) {
      return dvw.setUint16(o, v, littleEnd);
    };
    addUint8 = Atomics.add.bind(Atomics, ui8);
    andUint8 = Atomics.and.bind(Atomics, ui8);
    orUint8 = Atomics.or.bind(Atomics, ui8);
    xorUint8 = Atomics.xor.bind(Atomics, ui8);
    subUint8 = Atomics.sub.bind(Atomics, ui8);
    loadUint8 = Atomics.load.bind(Atomics, ui8);
    storeUint8 = Atomics.store.bind(Atomics, ui8);
    exchangeUint8 = Atomics.exchange.bind(Atomics, ui8);
    compareUint8 = Atomics.compareExchange.bind(Atomics, ui8);
    getUint8 = function(o) {
      return dvw.getUint8(o, littleEnd);
    };
    setUint8 = function(o, v) {
      return dvw.setUint8(o, v, littleEnd);
    };
    addInt32 = Atomics.add.bind(Atomics, u32);
    andInt32 = Atomics.and.bind(Atomics, u32);
    orInt32 = Atomics.or.bind(Atomics, u32);
    xorInt32 = Atomics.xor.bind(Atomics, u32);
    subInt32 = Atomics.sub.bind(Atomics, u32);
    loadInt32 = Atomics.load.bind(Atomics, u32);
    storeInt32 = Atomics.store.bind(Atomics, u32);
    exchangeInt32 = Atomics.exchange.bind(Atomics, u32);
    compareInt32 = Atomics.compareExchange.bind(Atomics, u32);
    getInt32 = function(o) {
      return dvw.getInt32(o, littleEnd);
    };
    setInt32 = function(o, v) {
      return dvw.setInt32(o, v, littleEnd);
    };
    addInt16 = Atomics.add.bind(Atomics, u16);
    andInt16 = Atomics.and.bind(Atomics, u16);
    orInt16 = Atomics.or.bind(Atomics, u16);
    xorInt16 = Atomics.xor.bind(Atomics, u16);
    subInt16 = Atomics.sub.bind(Atomics, u16);
    loadInt16 = Atomics.load.bind(Atomics, u16);
    storeInt16 = Atomics.store.bind(Atomics, u16);
    exchangeInt16 = Atomics.exchange.bind(Atomics, u16);
    compareInt16 = Atomics.compareExchange.bind(Atomics, u16);
    getInt16 = function(o) {
      return dvw.getInt16(o, littleEnd);
    };
    setInt16 = function(o, v) {
      return dvw.setInt16(o, v, littleEnd);
    };
    addInt8 = Atomics.add.bind(Atomics, si8);
    andInt8 = Atomics.and.bind(Atomics, si8);
    orInt8 = Atomics.or.bind(Atomics, si8);
    xorInt8 = Atomics.xor.bind(Atomics, si8);
    subInt8 = Atomics.sub.bind(Atomics, si8);
    loadInt8 = Atomics.load.bind(Atomics, si8);
    storeInt8 = Atomics.store.bind(Atomics, si8);
    exchangeInt8 = Atomics.exchange.bind(Atomics, si8);
    compareInt8 = Atomics.compareExchange.bind(Atomics, si8);
    getInt8 = function(o) {
      return dvw.getInt8(o, littleEnd);
    };
    setInt8 = function(o, v) {
      return dvw.setInt8(o, v, littleEnd);
    };
    return buffer;
  };
  if (isWindow) {
    sharedHandler = {
      register: function(data) {
        //console.warn "registering worker:", data
        Object.assign(this.info, data);
        this;
        if (!workers.some(function(w) {
          return !w.info.uuid;
        })) {
          //console.log "unlock time..."
          return unlockBridge();
        }
      }
    };
    //unlockThreads()
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
        } catch (error1) {
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
      var bridge, i, j, ref, results, thread;
      bridge = createWorker("bridge", bridgemessage);
      bridge.postMessage({
        setup: {blobURL, buffer}
      });
      results = [];
      for (i = j = 0, ref = navigator.hardwareConcurrency - 2; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
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
    defineTypedArrays = function() {
      var Uint32Array;
      Object.defineProperties(Object.getPrototypeOf(self.Uint8Array).prototype, {
        id: {
          get: function() {
            return resolvs.get(this);
          },
          set: function() {
            return resolvs.set(this, arguments[0]);
          }
        }
      });
      Uint32Array = class Uint32Array extends self.Uint32Array {
        constructor() {
          super(...arguments).id = resolvCall();
        }

      };
      return Uint8Array = class Uint8Array extends self.Uint8Array {
        constructor() {
          super(...arguments).id = resolvCall();
        }

      };
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
            postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid, state}
            });
            lock();
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
            postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid, state}
            });
            lock();
            onready();
            results.push(unlockBridge());
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
