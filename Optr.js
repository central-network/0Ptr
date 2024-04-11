self.name = "window";

(self.init = function() {
  var ALLOCATION_BYTEOFFSET, BUFFER_TEST_START_LENGTH, BUFFER_TEST_STEP_DIVIDER, BYTES_PER_ELEMENT, EVENT_READY, HEADERS_BYTE_LENGTH, HEADERS_LENGTH, HEADERS_LENGTH_OFFSET, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_END, HINDEX_LENGTH, HINDEX_LOCKFREE, HINDEX_RESOLV_ID, INITIAL_BYTELENGTH, MAX_PTR_COUNT, MAX_THREAD_COUNT, RESERVED_BYTELENGTH, Uint8Array, addInt16, addInt32, addInt8, addUint16, addUint32, addUint8, andInt16, andInt32, andInt8, andUint16, andUint32, andUint8, bc, blobURL, bridgeHandler, bridgemessage, buffer, compareInt16, compareInt32, compareInt8, compareUint16, compareUint32, compareUint8, createBlobURL, createBuffers, createThreads, createWorker, cu8, defineTypedArrays, dvw, error, exchangeInt16, exchangeInt32, exchangeInt8, exchangeUint16, exchangeUint32, exchangeUint8, f32, f64, getInt16, getInt32, getInt8, getUint16, getUint32, getUint8, i16, i32, i64, initMemory, isBridge, isThread, isWindow, listenEvents, littleEnd, loadInt16, loadInt32, loadInt8, loadUint16, loadUint32, loadUint8, lock, log, malloc, now, number, objbuf, orInt16, orInt32, orInt8, orUint16, orUint32, orUint8, p32, palloc, pnow, ptrbuf, randomUUID, resolvCall, resolvFind, resolvs, selfName, setInt16, setInt32, setInt8, setUint16, setUint32, setUint8, sharedHandler, si8, state, storeInt16, storeInt32, storeInt8, storeUint16, storeUint32, storeUint8, subInt16, subInt32, subInt8, subUint16, subUint32, subUint8, threadHandler, threadId, threadmessage, u16, u32, u64, ui8, unlock, unlockBridge, unlockThreads, warn, workers, xorInt16, xorInt32, xorInt8, xorUint16, xorUint32, xorUint8;
  log = function() {
    return console.log(name, ...arguments);
  };
  warn = function() {
    return console.warn(name, ...arguments);
  };
  error = function() {
    return console.error(name, ...arguments);
  };
  number = function() {
    return arguments[0].split("").reduce(function(a, b) {
      return b.charCodeAt() + ((typeof a.charCodeAt === "function" ? a.charCodeAt() : void 0) || a);
    });
  };
  HEADERS_LENGTH_OFFSET = 1;
  HINDEX_BEGIN = HEADERS_LENGTH_OFFSET++;
  HINDEX_END = HEADERS_LENGTH_OFFSET++;
  HINDEX_BYTEOFFSET = HEADERS_LENGTH_OFFSET++;
  HINDEX_LENGTH = HEADERS_LENGTH_OFFSET++;
  HINDEX_BYTELENGTH = HEADERS_LENGTH_OFFSET++;
  HINDEX_RESOLV_ID = HEADERS_LENGTH_OFFSET++;
  HINDEX_LOCKFREE = HEADERS_LENGTH_OFFSET++;
  BUFFER_TEST_START_LENGTH = Math.pow(((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 1) + 1, 11);
  BUFFER_TEST_STEP_DIVIDER = 1e1;
  INITIAL_BYTELENGTH = 6e4;
  BYTES_PER_ELEMENT = 4;
  RESERVED_BYTELENGTH = 64;
  ALLOCATION_BYTEOFFSET = 100000 * 16 * 4;
  HEADERS_LENGTH = 16;
  HEADERS_BYTE_LENGTH = 4 * 16;
  MAX_PTR_COUNT = 1e5;
  MAX_THREAD_COUNT = -2 + (typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0) || 3;
  EVENT_READY = new (EVENT_READY = class EVENT_READY extends Number {})(number(/EVENT_READY/.source));
  if (HEADERS_LENGTH_OFFSET >= HEADERS_LENGTH) {
    throw /MAX_HEADERS_LENGTH_EXCEED/;
  }
  [blobURL, buffer, objbuf, ptrbuf, palloc, malloc, littleEnd, lock, unlock, unlockThreads, unlockBridge, p32, dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16, andUint32, orUint32, xorUint32, subUint32, addUint32, loadUint32, storeUint32, getUint32, setUint32, exchangeUint32, compareUint32, andUint16, orUint16, xorUint16, subUint16, addUint16, loadUint16, storeUint16, getUint16, setUint16, exchangeUint16, compareUint16, andUint8, orUint8, xorUint8, subUint8, addUint8, loadUint8, storeUint8, getUint8, setUint8, exchangeUint8, compareUint8, andInt32, orInt32, xorInt32, subInt32, addInt32, loadInt32, storeInt32, getInt32, setInt32, exchangeInt32, compareInt32, andInt16, orInt16, xorInt16, subInt16, addInt16, loadInt16, storeInt16, getInt16, setInt16, exchangeInt16, compareInt16, andInt8, orInt8, xorInt8, subInt8, addInt8, loadInt8, storeInt8, getInt8, setInt8, exchangeInt8, compareInt8, Uint8Array] = [];
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
  resolvFind = function(id, retry = 0) {
    var i, ptri;
    i = HINDEX_RESOLV_ID + Atomics.load(p32, 1);
    ptri = 0; //log { id, retry }
    while (i > 0) {
      if (id === Atomics.load(p32, i)) {
        ptri = i - HINDEX_RESOLV_ID;
        break;
      }
      i -= HEADERS_LENGTH;
    }
    if (isBridge) {
      if (!ptri) {
        ptri = Atomics.add(p32, 1, HEADERS_LENGTH);
        Atomics.store(p32, ptri + HINDEX_RESOLV_ID, id);
      }
      return ptri;
    }
    if (!ptri || !Atomics.load(p32, ptri + HINDEX_LOCKFREE)) {
      Atomics.wait(p32, 3, 0, 40);
      if (retry > 100) {
        throw /TOO_MANY_TRIED_TO_FIND/;
      }
      return resolvFind(id, ++retry);
    }
    return ptri;
  };
  resolvCall = function() {
    var cBrace, cBreak, cColon, cCount, call, discard, e, lasti, length, stack, vals;
    Error.captureStackTrace(e = {});
    stack = e.stack.toString();
    length = stack.length;
    cBreak = "\n".charCodeAt();
    cBrace = "\)".charCodeAt();
    cColon = "\:".charCodeAt();
    cCount = 2;
    discard = true;
    lasti = length;
    call = 0;
    vals = [];
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
            call += vals[vals.length] = parseInt(stack.substring(length + 1, lasti));
          }
          if (!--cCount) {
            discard = true;
          }
          lasti = length;
      }
    }
    return resolvFind(call);
  };
  randomUUID = function() {
    return (typeof crypto !== "undefined" && crypto !== null ? crypto.randomUUID() : void 0) || btoa(new Date().toISOString()).toLowerCase().split("").toSpliced(8, 0, "-").toSpliced(13, 0, "-").toSpliced(18, 0, "-").toSpliced(24, 0, "-").join("").substring(0, 36).trim().padEnd(36, String.fromCharCode(50 + Math.random() * 40));
  };
  initMemory = function(buffers) {
    objbuf = buffers.objbuf;
    ptrbuf = buffers.ptrbuf;
    u64 = new self.BigUint64Array(objbuf);
    i64 = new self.BigInt64Array(objbuf);
    f32 = new self.Float32Array(objbuf);
    f64 = new self.Float64Array(objbuf);
    i32 = new self.Int32Array(objbuf);
    u32 = new self.Uint32Array(objbuf);
    i16 = new self.Int16Array(objbuf);
    u16 = new self.Uint16Array(objbuf);
    ui8 = new self.Uint8Array(objbuf);
    cu8 = new self.Uint8ClampedArray(objbuf);
    si8 = new self.Int8Array(objbuf);
    dvw = new self.DataView(objbuf);
    p32 = new Int32Array(ptrbuf);
    malloc = function(byteLength = 0, alignBytes = 1) {
      var byteOffset, mod;
      if (byteLength > 0) {
        if (alignBytes > 1) {
          if (mod = this.byteLength % alignBytes) {
            Atomics.add(p32, 0, alignBytes - mod);
          }
        }
        byteOffset = Atomics.add(p32, 0, byteLength);
        objbuf.grow(byteOffset + byteLength);
        return byteOffset;
      }
      return this.byteLength;
    };
    (function() {
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
      return setInt8 = function(o, v) {
        return dvw.setInt8(o, v, littleEnd);
      };
    })();
    return 0;
  };
  defineTypedArrays = function() {
    Object.defineProperties(Object.getPrototypeOf(self.Uint8Array).prototype, {
      ptri: {
        get: function() {
          return resolvs.get(this);
        },
        set: function() {
          return resolvs.set(this, arguments[0]);
        }
      }
    });
    return Uint8Array = class Uint8Array extends self.Uint8Array {
      constructor(argv, byteOffset, length) {
        var argc, begin, byteLength, end, ptri;
        ptri = resolvCall();
        argc = arguments.length;
        // new TypedArray( buffer, 1221, 4 );
        if (argc === 3) {
          1; // slicing
        
        // new TypedArray( buffer, 36 );
        } else if (argc === 2) {
          2; // slicing
        
        // new TypedArray( 24 );
        // new TypedArray( buffer );
        // new TypedArray( [ 2, 4, 1 ] );
        } else if (argc === 1) {
          // new TypedArray( 24 );
          if (Number.isInteger(argv)) {
            if (isBridge) {
              length = argv;
              byteLength = argv;
              byteOffset = malloc(argv, 1);
              begin = byteOffset / 1;
              end = begin + length;
              Atomics.store(p32, ptri + HINDEX_LENGTH, length);
              Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
              Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
              Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
              Atomics.store(p32, ptri + HINDEX_END, end);
              Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
              super(objbuf, byteOffset, length);
              Atomics.notify(p32, 3, MAX_THREAD_COUNT);
            } else {
              length = Atomics.load(p32, ptri + HINDEX_LENGTH);
              byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
              if (!length) {
                throw [/WHERE_IS_MY_MIND/, {ptri, length, byteOffset, name}];
              }
              super(objbuf, byteOffset, length);
            }
          // new TypedArray( new TypedArray(?) );
          } else if (ArrayBuffer.isView(argv)) {
            // alloc byte length
            1;
          }
        }
        this.ptri = ptri;
      }

    };
  };
  if (isWindow) {
    sharedHandler = {
      register: function(data) {
        warn("registering worker:", data);
        Object.assign(this.info, data);
        this;
        if (!workers.some(function(w) {
          return !w.info.uuid;
        })) {
          log("says it's onready time...", EVENT_READY);
          return bc.postMessage(EVENT_READY);
        }
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
    createBuffers = function() {
      var Buffer, maxByteLength;
      Buffer = typeof SharedArrayBuffer !== "undefined" && SharedArrayBuffer !== null ? SharedArrayBuffer : ArrayBuffer;
      buffer = !(maxByteLength = BUFFER_TEST_START_LENGTH);
      while (!buffer) {
        try {
          buffer = new Buffer(0, {maxByteLength});
        } catch (error1) {
          maxByteLength /= BUFFER_TEST_STEP_DIVIDER;
        }
      }
      initMemory({
        objbuf: buffer,
        ptrbuf: new Buffer(Math.min(MAX_PTR_COUNT * BYTES_PER_ELEMENT, maxByteLength), {maxByteLength})
      });
      return Atomics.store(p32, 1, HEADERS_LENGTH);
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
        setup: {blobURL, objbuf, ptrbuf}
      });
      results = [];
      for (i = j = 0, ref = MAX_THREAD_COUNT; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        thread = createWorker("thread" + i, threadmessage);
        results.push(thread.postMessage({
          setup: {blobURL, objbuf, ptrbuf}
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
        console.table(workers.map(function(w) {
          return w.info;
        }));
        console.warn("");
        console.log(objbuf);
        console.log(ptrbuf);
        return console.log(p32);
      };
    };
    queueMicrotask(function() {
      listenEvents();
      createBuffers();
      createBlobURL();
      return createThreads();
    });
  }
  if (isBridge) {
    addEventListener("message", function(e) {
      var data, ref, req, results, uuid;
      ref = e.data;
      results = [];
      for (req in ref) {
        data = ref[req];
        switch (req) {
          case "setup":
            uuid = randomUUID();
            blobURL = data.blobURL;
            initMemory(data);
            defineTypedArrays();
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
            blobURL = data.blobURL;
            initMemory(data);
            defineTypedArrays();
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
  bc.onmessage = function(e) {
    return {
      [EVENT_READY]: function() {
        return onready();
      }
    }[e.data]();
  };
  return 0xdead;
})();
