(typeof window !== "undefined" && window !== null) && (function() {
  return postMessage(0);
})();

self.onmessage = function() {
  var CONST, Uint32Array, Uint8Array, amiPU, buffer, forkWorker, isBridge, isCPU, isGPU, isWindow, isWorker, now, pnow, puid, randomUUID, resolvedId, selfName, source, uuid;
  selfName = self.name;
  isWindow = typeof document !== "undefined" && document !== null;
  isWorker = !isWindow;
  isBridge = /bridge/i.test(selfName);
  isCPU = selfName.startsWith(/cpu/.source);
  isGPU = selfName.startsWith(/gpu/.source);
  amiPU = /pu/i.test(selfName.substring(1, 3));
  puid = amiPU && parseInt(selfName.match(/\d+/));
  now = Date.now();
  pnow = performance.now();
  source = (function() {
    var __0ptr, __user;
    if (!isWindow) {
      return;
    }
    __user = "self.onready = function ( document ) {" + [...document.scripts].find((d) => {
      return d.text && d.src;
    }).text + "}};";
    __0ptr = "self.onmessage = " + self.onmessage.toString().split(new RegExp('return 0x' + 57005..toString(16) + ';'))[0];
    return URL.createObjectURL(new Blob([__0ptr, __user], {
      type: "application/javascript"
    }));
  })();
  resolvedId = function() {
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
  forkWorker = function() {
    return new Worker(source, {name});
  };
  uuid = randomUUID();
  CONST = {
    BUFFER_TEST_START_LENGTH: 1e6,
    BUFFER_TEST_STEP_DIVIDER: 1e1,
    BUFFER_BYTEOFFSET: 64,
    BYTES_PER_ELEMENT: 4,
    HEADERS_LENGTH: 16,
    HEADERS_BYTE_LENGTH: 4 * 16
  };
  buffer = isWindow && (function() {
    var Buffer, maxByteLength;
    Buffer = typeof SharedArrayBuffer !== "undefined" && SharedArrayBuffer !== null ? SharedArrayBuffer : ArrayBuffer;
    buffer = !(maxByteLength = CONST.BUFFER_TEST_START_LENGTH);
    while (!buffer) {
      try {
        buffer = new Buffer(CONST.BUFFER_BYTEOFFSET, {maxByteLength});
      } catch (error) {
        maxByteLength /= CONST.BUFFER_TEST_STEP_DIVIDER;
      }
    }
    return buffer;
  })();
  this.this = {selfName, isWindow, isWorker, isBridge, isCPU, isGPU, puid, uuid, source, buffer};
  Object.defineProperties(self, {
    Uint32Array: Uint32Array = class Uint32Array extends self.Uint32Array {
      constructor() {
        console.log("resolvedId Uint32Array:", resolvedId());
        super(...arguments);
      }

    },
    Uint8Array: Uint8Array = class Uint8Array extends self.Uint8Array {
      constructor() {
        console.log("resolvedId Uint8Array:", resolvedId());
        super(...arguments);
      }

    }
  });
  if (isWindow) {
    forkWorker().postMessage(0);
    console.log("hello from window");
    console.log(Error.captureStackTrace(this) || this.stack);
  }
  if (isWorker) {
    console.log("hello from worker");
    setTimeout(function() {
      return self.onready();
    });
  }
  return 0xdead;
};
