var init;

(init = function() {
  var ALLOCS_BEGIN, CORE_INFOJSON_LENGTH, CORE_INFOJSON_START, HEAD_ELEMENTS_COUNT, HEAD_ELEMENTS_LENGTH, POINTERS_BEGIN, Pointer, Thread, core, define, headers, i32, info, isBridge, isThread, isWindow, isWorker, malloc, pointers, textDecoder, textEncoder, type;
  CORE_INFOJSON_START = 64;
  CORE_INFOJSON_LENGTH = 8192 - CORE_INFOJSON_START;
  HEAD_ELEMENTS_COUNT = 16;
  HEAD_ELEMENTS_LENGTH = HEAD_ELEMENTS_COUNT * 4;
  POINTERS_BEGIN = null;
  ALLOCS_BEGIN = null;
  isWindow = typeof self.document !== void 0;
  isWorker = typeof DedicatedWorkerGlobalScope !== void 0;
  isThread = isWorker && self.name.startsWith("thread");
  isBridge = isWorker && isThread === false;
  type = isWindow && "window" || isThread && "thread" || "bridge";
  core = null;
  info = {};
  headers = null;
  pointers = null;
  i32 = null;
  malloc = function(ptr) {
    var byteLength, byteOffset;
    if (!ptr) {
      return Atomics.add(i32, 1, HEAD_ELEMENTS_COUNT);
    }
    byteLength = ptr.constructor.byteLength;
    byteOffset = Atomics.add(i32, 0, byteLength);
    Atomics.store(pointers, ptr, byteLength);
    Atomics.store(pointers, ptr, byteOffset);
    return byteOffset;
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
      }
    });

    return Pointer;

  }).call(this);
  Thread = (function() {
    class Thread extends Pointer {};

    Thread.byteLength = 4 * 28;

    return Thread;

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
  addEventListener("message", ({data, ports}) => {
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
  return addEventListener("initram", function({
      detail: {buffer}
    }) {
    var allocs, bridge, generateCoreInfo;
    core = !isWindow ? buffer : SharedArrayBuffer.from(buffer);
    generateCoreInfo = function() {
      return {
        byteLength: core.byteLength,
        infoOffset: CORE_INFOJSON_START,
        dataOffset: Math.trunc(core.byteLength / 10),
        headOffset: CORE_INFOJSON_START + CORE_INFOJSON_LENGTH
      };
    };
    info = textDecoder.decode(new Uint8Array(buffer, CORE_INFOJSON_START, CORE_INFOJSON_LENGTH));
    if (!info.startsWith("\"")) {
      info = generateCoreInfo();
      new Uint8Array(core, CORE_INFOJSON_START, CORE_INFOJSON_LENGTH).set(textEncoder.encode(JSON.stringify(info, null, "\t")));
    }
    POINTERS_BEGIN = info.headOffset;
    ALLOCS_BEGIN = info.dataOffset;
    i32 = new Int32Array(core);
    pointers = new Uint32Array(core, POINTERS_BEGIN, ALLOCS_BEGIN / 4);
    allocs = new Uint8Array(core, ALLOCS_BEGIN);
    Atomics.or(i32, 0, POINTERS_BEGIN);
    Atomics.or(i32, 1, HEAD_ELEMENTS_COUNT);
    bridge = new Thread();
    return console.log(bridge);
  });
})();

postMessage({
  initram: {
    buffer: new ArrayBuffer(1e7)
  }
});
