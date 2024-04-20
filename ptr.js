var init;

(init = function() {
  var ALLOCS_BEGIN, CORE_INFOJSON_LENGTH, CORE_INFOJSON_START, Core, HEAD_ELEMENTS_COUNT, HEAD_ELEMENTS_LENGTH, INDEX_BYTELENGTH, INDEX_BYTEOFFSET, POINTERS_BEGIN, Pointer, Processor, Thread, core, define, headers, i32, info, isBridge, isThread, isWindow, isWorker, malloc, pointers, textDecoder, textEncoder, type;
  CORE_INFOJSON_START = 64;
  CORE_INFOJSON_LENGTH = 8192 - CORE_INFOJSON_START;
  HEAD_ELEMENTS_COUNT = 16;
  HEAD_ELEMENTS_LENGTH = HEAD_ELEMENTS_COUNT * 4;
  POINTERS_BEGIN = null;
  ALLOCS_BEGIN = null;
  INDEX_BYTELENGTH = 0;
  INDEX_BYTEOFFSET = 1;
  isWindow = "undefined" === typeof DedicatedWorkerGlobalScope;
  isWorker = isWindow === false;
  isThread = isWorker && self.name.startsWith("thread");
  isBridge = isWorker && isThread === false;
  type = isWindow && "window" || isThread && "thread" || "bridge";
  core = null;
  info = {};
  headers = null;
  pointers = null;
  i32 = null;
  malloc = function(ptr) {
    if (!ptr) {
      return Atomics.add(i32, 1, HEAD_ELEMENTS_COUNT);
    }
    ptr.byteLength = ptr.constructor.byteLength;
    ptr.byteOffset = Atomics.add(i32, 0, ptr.byteLength);
    return ptr;
  };
  textDecoder = new TextDecoder();
  textEncoder = new TextEncoder();
  define = Object.defineProperties;
  Pointer = (function() {
    class Pointer extends Number {
      constructor() {
        malloc(super(malloc()));
      }

    };

    define(Pointer.prototype, {
      pointer: {
        get: function() {
          return pointers.subarray(this, this + HEAD_ELEMENTS_COUNT);
        }
      },
      byteLength: {
        get: function() {
          return pointers[this + INDEX_BYTELENGTH];
        },
        set: function() {
          return pointers[this + INDEX_BYTELENGTH] = arguments[0];
        }
      },
      byteOffset: {
        get: function() {
          return pointers[this + INDEX_BYTEOFFSET];
        },
        set: function() {
          return pointers[this + INDEX_BYTEOFFSET] = arguments[0];
        }
      }
    });

    return Pointer;

  }).call(this);
  Processor = (function() {
    class Processor extends Pointer {
      init() {}

    };

    Processor.byteLength = 4 * 12;

    return Processor;

  }).call(this);
  Thread = (function() {
    class Thread extends Pointer {
      raise() {
        var bUrl, blob, code, ptrs, worker;
        ptrs = [...document.scripts].find(function(a) {
          return a.text && a.src.match(/ptr/i);
        });
        code = init.toString().replace("___EVAL" + "UATE___", ptrs.text.trim());
        blob = new Blob([`(${code}).call(self)`], {
          type: "application/javascript"
        });
        bUrl = URL.createObjectURL(blob);
        type = ptrs.type || "";
        worker = new Worker(bUrl, {type});
        worker.onerror = console.error;
        worker.onmessageerror = console.error;
        worker.postMessage({
          initram: {
            buffer: core
          }
        });
        return worker;
      }

    };

    Thread.byteLength = 4 * 28;

    return Thread;

  }).call(this);
  Core = (function() {
    class Core {
      static isSoruceEmpty(source) {
        return !new self.Uint8Array(source, 0, 1).at(0);
      }

      static tryMaxByteLength() {
        var buffer, maxByteLength;
        buffer = null;
        maxByteLength = Math.pow(((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 1) + 1, 11);
        while (!buffer) {
          try {
            buffer = new self.SharedArrayBuffer(0, {maxByteLength});
          } catch (error) {
            maxByteLength /= 10;
          }
        }
        buffer = null;
        return maxByteLength - (maxByteLength % 8);
      }

      static tryHardwareConcurrency(workerDiff = 0, maxByteLength, loopCount = 1) {
        return new Promise((done) => {
          var byteLength, closeTime, closeWorkers, finishBenchmark, now, numberWithCommas, onmessage, raiseTime, raiseWorkers, sab, testCode, testURL, workerCount, workers;
          now = performance.now();
          sab = null;
          workerCount = workerDiff + ((typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0) || 3);
          maxByteLength = maxByteLength || Math.pow(((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 1) + 1, 11);
          while (!sab) {
            try {
              sab = new self.SharedArrayBuffer(0, {maxByteLength});
            } catch (error) {
              maxByteLength /= 10;
            }
          }
          sab.grow(maxByteLength - (maxByteLength % 8));
          i32 = new Int32Array(sab);
          byteLength = sab.byteLength;
          workers = [];
          testCode = function({
              data: {sab, workerCount, loopCount}
            }) {
            var i, index, length, offset, ui8;
            i32 = new Int32Array(sab);
            ui8 = new Uint8Array(sab);
            index = self.name * 1;
            length = Math.trunc(sab.byteLength / workerCount);
            offset = Math.max(8, length * index);
            Atomics.wait(i32, 0);
            console.warn(index, "running for:", {loopCount, length, offset});
            while (loopCount--) {
              //console.warn index, "loop at:", loopCount, "offset:", offset
              i = -1;
              while (length > ++i) {
                //Atomics.store( ui8, offset + i, 1 ) 
                ui8[offset + i] = 1;
              }
            }
            console.warn(index, "finished");
            Atomics.add(i32, 1, 1);
            return postMessage(1);
          };
          testURL = URL.createObjectURL(new Blob(["onmessage = " + testCode.toString()], {
            type: "application/javascript"
          }));
          raiseTime = null;
          closeTime = null;
          numberWithCommas = function(x) {
            var parts;
            parts = Math.trunc(x).toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return parts.join(".");
          };
          finishBenchmark = function() {
            var elapsed, finished, optCount;
            finished = performance.now();
            elapsed = finished - now;
            sab = null;
            return done({
              elapsed: (elapsed / 1e3).toFixed(2) * 1,
              workerCount,
              opsCount: numberWithCommas(optCount = byteLength * loopCount),
              opsPerThread: numberWithCommas(optCount / workerCount),
              opsPerSecond: numberWithCommas((optCount * 1e3) / elapsed),
              workerTimes: {
                raise: raiseTime,
                close: closeTime
              },
              operations: {
                started: now,
                elapsed: elapsed,
                finished: finished
              },
              loopCount,
              byteLength
            });
          };
          onmessage = function({
              data: finished
            }) {
            if (workerCount === Atomics.load(i32, 1)) {
              closeTime = -performance.now() + closeWorkers();
              return finishBenchmark(sab = i32 = null);
            }
          };
          raiseWorkers = function(index = 0) {
            var w;
            if (index >= workerCount) {
              return performance.now();
            }
            w = workers[index] = new Worker(testURL, {
              name: index
            });
            w.onmessage = onmessage;
            w.postMessage({sab, workerCount, loopCount});
            return raiseWorkers(++index);
          };
          self.kill = closeWorkers = function(index = 0) {
            if (index >= workerCount) {
              return performance.now();
            }
            workers[index].terminate();
            return closeWorkers(++index);
          };
          return requestIdleCallback(() => {
            raiseTime = -performance.now() + raiseWorkers();
            Atomics.store(i32, 0, 1);
            return Atomics.notify(i32, 0, workerCount);
          });
        });
      }

      constructor(source) {
        if (self.SharedArrayBuffer == null) {
          throw /SHARED_BUFFER_REQUIRED/;
        }
        this.setMemory(source);
        this.loadCoreinfo();
      }

      setMemory(source) {
        if (source instanceof self.ArrayBuffer) {
          this.isSourceArrayBuffer = true;
          return this.setMemoryFromArrayBuffer(source);
        }
        if (source instanceof self.SharedArrayBuffer) {
          this.isSourceSharedBuffer = true;
          return this.setMemoryFromSharedBuffer(source);
        }
        if (self.ArrayBuffer.isView(source)) {
          this.isSourceView = true;
          return this.setMemory(source.buffer);
        }
        throw /UNRESOLVED_SOURCE_TYPE/;
      }

      setBuffer(value) {
        return self.Object.defineProperty(this, "buffer", {value});
      }

      setMemoryFromArrayBuffer(arrayBuffer) {
        this.setBuffer(new self.SharedArrayBuffer(arrayBuffer.byteLength));
        if (!(this.isSoruceEmpty = Core.isSoruceEmpty(arrayBuffer))) {
          new self.Uint8Array(this.buffer).set(new self.Uint8Array(arrayBuffer));
        }
        return this;
      }

      setMemoryFromSharedBuffer(sharedArrayBuffer) {
        return this.setBuffer(sharedArrayBuffer);
      }

      loadCoreinfo() {
        if (this.isSoruceEmpty) {
          info = this.generateCoreinfo();
        }
        return console.log(info);
      }

      generateCoreinfo() {
        return {
          maxByteLength: Core.tryMaxByteLength(),
          hardwareConcurrency: Core.tryHardwareConcurrency()
        };
      }

    };

    Core.prototype.isSourceArrayBuffer = false;

    Core.prototype.isSourceSharedBuffer = false;

    Core.prototype.isSourceView = false;

    Core.prototype.isSoruceEmpty = false;

    Core.prototype.info = {};

    return Core;

  }).call(this);
  Object.defineProperties(SharedArrayBuffer, {
    from: {
      value: function(buffer) {
        var o, ref, s, v;
        o = new this(buffer.byteLength);
        s = new Uint8Array((ref = buffer.buffer) != null ? ref : buffer);
        v = new Uint8Array(o);
        v.set(s);
        return o;
      }
    }
  });
  addEventListener("ready", function(document) {
    ___EVALUATE___;
    return 0;
  });
  addEventListener("message", function({data, ports}) {
    var detail, req, results;
    results = [];
    for (req in data) {
      detail = data[req];
      if (ports.length) {
        detail.ports = ports;
      }
      results.push(dispatchEvent(new CustomEvent(req, {detail})));
    }
    return results;
  });
  addEventListener("init", async function({
      detail: {buffer}
    }) {
    var allocs, generateCoreInfo;
    console.table([(await Core.tryHardwareConcurrency(-2, 4e7, 4)), (await Core.tryHardwareConcurrency(0, 4e7, 4)), (await Core.tryHardwareConcurrency(2, 4e7, 4))]);
    return 1;
    return core = new Core(buffer);
    core = !isWindow ? buffer : SharedArrayBuffer.from(buffer);
    generateCoreInfo = function() {
      return {
        byteLength: core.byteLength,
        infoOffset: CORE_INFOJSON_START,
        dataOffset: Math.trunc(core.byteLength / 10),
        headOffset: CORE_INFOJSON_START + CORE_INFOJSON_LENGTH
      };
    };
    info = textDecoder.decode(new Uint8Array(buffer, CORE_INFOJSON_START, CORE_INFOJSON_LENGTH).slice());
    if (!info.startsWith("\"")) {
      info = generateCoreInfo();
      new Uint8Array(core, CORE_INFOJSON_START, CORE_INFOJSON_LENGTH).set(textEncoder.encode(JSON.stringify(info, null, "\t")));
    }
    POINTERS_BEGIN = info.headOffset;
    ALLOCS_BEGIN = info.dataOffset;
    i32 = new Int32Array(core);
    pointers = new Uint32Array(core, POINTERS_BEGIN, ALLOCS_BEGIN / 4);
    allocs = new Uint8Array(core, ALLOCS_BEGIN);
    if (!isWindow) {
      return;
    }
    Atomics.or(i32, 0, POINTERS_BEGIN);
    Atomics.or(i32, 1, HEAD_ELEMENTS_COUNT);
    return new Processor().init();
  });
  return 0;
})();

postMessage({
  init: {
    buffer: new ArrayBuffer(10)
  }
});
