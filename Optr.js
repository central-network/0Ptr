self.name = "window";

(self.init = function() {
  var ALLOCATION_BYTEOFFSET, BUFFER_TEST_START_LENGTH, BUFFER_TEST_STEP_DIVIDER, BYTES_PER_ELEMENT, BigInt64Array, BigUint64Array, DUMP_WEAKMAP, EVENT_READY, Float32Array, Float64Array, GLContext, HEADERS_BYTE_LENGTH, HEADERS_LENGTH, HEADERS_LENGTH_OFFSET, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_END, HINDEX_ITERINDEX, HINDEX_ITERLENGTH, HINDEX_LENGTH, HINDEX_LOCKFREE, HINDEX_RESOLV_ID, HINDEX_WAITCOUNT, INITIAL_BYTELENGTH, INNER_HEIGHT, INNER_WIDTH, ITERATION_PER_THREAD, Int16Array, Int32Array, Int8Array, LE, MAX_PTR_COUNT, MAX_THREAD_COUNT, OffscreenCanvas, OnscreenCanvas, RADIANS_PER_DEGREE, RATIO_ASPECT, RATIO_PIXEL, RESERVED_BYTELENGTH, TypedArray, UI, UI_LENGTH, UI_OFFSET, Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, addInt16, addInt32, addInt8, addUint16, addUint32, addUint8, andInt16, andInt32, andInt8, andUint16, andUint32, andUint8, bc, blobURL, bridgeHandler, bridgemessage, compareInt16, compareInt32, compareInt8, compareUint16, compareUint32, compareUint8, createBlobURL, createBuffers, createCanvas, createThreads, createWorker, cu8, dvw, error, exchangeInt16, exchangeInt32, exchangeInt8, exchangeUint16, exchangeUint32, exchangeUint8, f32, f64, getInt16, getInt32, getInt8, getUint16, getUint32, getUint8, i16, i32, i64, initMemory, isBridge, isThread, isWindow, keybuf, listenEvents, littleEnd, loadInt16, loadInt32, loadInt8, loadUint16, loadUint32, loadUint8, lock, log, malloc, now, number, objbuf, objects, orInt16, orInt32, orInt8, orUint16, orUint32, orUint8, p32, pnow, ptrbuf, randomUUID, regenerate, replies, resolvCall, resolvFind, resolvs, selfName, setInt16, setInt32, setInt8, setUint16, setUint32, setUint8, sharedHandler, si8, storeInt16, storeInt32, storeInt8, storeUint16, storeUint32, storeUint8, subInt16, subInt32, subInt8, subUint16, subUint32, subUint8, textDecoder, textEncoder, threadHandler, threadId, threadmessage, u16, u32, u64, ui, ui8, unlock, warn, workers, xorInt16, xorInt32, xorInt8, xorUint16, xorUint32, xorUint8, xrSession;
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
  [
    HEADERS_LENGTH_OFFSET = 1,
    HINDEX_BEGIN = HEADERS_LENGTH_OFFSET++,
    HINDEX_END = HEADERS_LENGTH_OFFSET++,
    HINDEX_BYTEOFFSET = HEADERS_LENGTH_OFFSET++,
    HINDEX_LENGTH = HEADERS_LENGTH_OFFSET++,
    HINDEX_BYTELENGTH = HEADERS_LENGTH_OFFSET++,
    HINDEX_RESOLV_ID = HEADERS_LENGTH_OFFSET++,
    HINDEX_LOCKFREE = HEADERS_LENGTH_OFFSET++,
    HINDEX_WAITCOUNT = HEADERS_LENGTH_OFFSET++,
    HINDEX_ITERINDEX = HEADERS_LENGTH_OFFSET++,
    HINDEX_ITERLENGTH = HEADERS_LENGTH_OFFSET++,
    BUFFER_TEST_START_LENGTH = Math.pow(((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 1) + 1,
    11),
    BUFFER_TEST_STEP_DIVIDER = 1e2,
    INITIAL_BYTELENGTH = 6e4,
    BYTES_PER_ELEMENT = 4,
    RESERVED_BYTELENGTH = 64,
    ALLOCATION_BYTEOFFSET = 100000 * 16 * 4,
    HEADERS_LENGTH = 16,
    HEADERS_BYTE_LENGTH = 4 * 16,
    MAX_PTR_COUNT = 1e5,
    MAX_THREAD_COUNT = -4 + (typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0) || 3,
    ITERATION_PER_THREAD = 1000000,
    UI_LENGTH = 4 * 48,
    UI_OFFSET = null,
    LE = new self.Uint8Array(self.Uint16Array.of(1).buffer).at(),
    RADIANS_PER_DEGREE = Math.PI / 180.0,
    INNER_WIDTH = typeof innerWidth !== "undefined" && innerWidth !== null ? innerWidth : 640,
    INNER_HEIGHT = typeof innerHeight !== "undefined" && innerHeight !== null ? innerHeight : 480,
    RATIO_PIXEL = typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1,
    RATIO_ASPECT = INNER_WIDTH / INNER_HEIGHT,
    EVENT_READY = new (EVENT_READY = class EVENT_READY extends Number {})(number(/EVENT_READY/.source)),
    DUMP_WEAKMAP = new (DUMP_WEAKMAP = class DUMP_WEAKMAP extends Number {})(number(/DUMP_WEAKMAP/.source)),
    (function() {
      if (HEADERS_LENGTH_OFFSET >= HEADERS_LENGTH) {
        throw /MAX_HEADERS_LENGTH_EXCEED/;
      }
    })()
  ];
  [blobURL, objbuf, ptrbuf, keybuf, lock, unlock, malloc, littleEnd, ui, p32, dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16, andUint32, orUint32, xorUint32, subUint32, addUint32, loadUint32, storeUint32, getUint32, setUint32, exchangeUint32, compareUint32, andUint16, orUint16, xorUint16, subUint16, addUint16, loadUint16, storeUint16, getUint16, setUint16, exchangeUint16, compareUint16, andUint8, orUint8, xorUint8, subUint8, addUint8, loadUint8, storeUint8, getUint8, setUint8, exchangeUint8, compareUint8, andInt32, orInt32, xorInt32, subInt32, addInt32, loadInt32, storeInt32, getInt32, setInt32, exchangeInt32, compareInt32, andInt16, orInt16, xorInt16, subInt16, addInt16, loadInt16, storeInt16, getInt16, setInt16, exchangeInt16, compareInt16, andInt8, orInt8, xorInt8, subInt8, addInt8, loadInt8, storeInt8, getInt8, setInt8, exchangeInt8, compareInt8, UI, OnscreenCanvas, OffscreenCanvas, xrSession, Uint8Array, Int8Array, Uint8ClampedArray, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array] = [];
  [bc = new BroadcastChannel("0ptr"), textEncoder = new TextEncoder(), textDecoder = new TextDecoder(), selfName = self.name, isWindow = typeof document !== "undefined" && document !== null, isBridge = /bridge/i.test(selfName), isThread = /thread/i.test(selfName), threadId = isThread && parseInt(selfName.match(/\d+/)), now = Date.now(), pnow = performance.now(), resolvs = new WeakMap(), replies = new Object(), objects = new Object(), workers = new self.Array(), littleEnd = new self.Uint8Array(self.Uint32Array.of(0x01).buffer)[0], TypedArray = Object.getPrototypeOf(self.Uint8Array), GLContext = typeof WebGL2RenderingContext !== "undefined" && WebGL2RenderingContext !== null ? WebGL2RenderingContext : WebGLRenderingContext];
  resolvFind = function(id, retry = 0) {
    var i, ptri;
    i = HINDEX_RESOLV_ID + Atomics.load(p32, 1);
    ptri = 0;
    //error { id, retry }
    while (i > 0) {
      if (id === Atomics.load(p32, i)) {
        ptri = i - HINDEX_RESOLV_ID;
        break;
      }
      i -= HEADERS_LENGTH;
    }
    if (!ptri) {
      if (isBridge) {
        ptri = Atomics.add(p32, 1, HEADERS_LENGTH);
        Atomics.store(p32, ptri + HINDEX_RESOLV_ID, id);
        return ptri;
      }
      Atomics.wait(p32, 3, 0, 20);
      if (retry > 400) {
        throw /TOO_MANY_TRIED_TO_FIND/;
      }
      return resolvFind(id, ++retry);
    } else if (isBridge) {
      return ptri;
    }
    Atomics.wait(p32, ptri + HINDEX_LOCKFREE);
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
    keybuf = buffers.keybuf;
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
    p32 = new self.Int32Array(ptrbuf);
    ui = new UI(keybuf);
    lock = function(ptri) {
      if (ptri) {
        return Atomics.wait(p32, ptri + HINDEX_LOCKFREE);
      } else {
        return Atomics.wait(p32, isThread ? 4 : 3);
      }
    };
    unlock = function(ptri) {
      if (ptri) {
        Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
        Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
      }
      return Atomics.notify(p32, isThread ? 4 : 3);
    };
    malloc = function(byteLength = 0, alignBytes = 1) {
      var byteOffset, mod;
      if (byteLength > 0) {
        if (alignBytes > 1) {
          if (mod = objbuf.byteLength % alignBytes) {
            Atomics.add(p32, 0, alignBytes - mod);
          }
        }
        byteOffset = Atomics.add(p32, 0, byteLength);
        if (byteOffset > objbuf.byteLength) {
          objbuf.grow(byteOffset + 1e5);
        }
        return byteOffset;
      }
      return objbuf.byteLength;
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
  Object.defineProperties(DOMMatrix.prototype, {
    new: {
      value: function(byteOffset) {
        return Object.defineProperties(this.constructor.fromFloat32Array(f32.detach(byteOffset, 16)), {
          index: {
            value: byteOffset / 4
          }
        });
      }
    },
    set: {
      value: function(valueset) {
        f32.set([...valueset], this.index);
        [this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44] = [...valueset];
        return this;
      }
    },
    valueOf: {
      value: function() {
        return self.Float32Array.of(this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44);
      }
    },
    [Symbol.iterator]: {
      value: function*() {
        yield this.m11;
        yield this.m21;
        yield this.m31;
        yield this.m41;
        yield this.m12;
        yield this.m22;
        yield this.m32;
        yield this.m42;
        yield this.m13;
        yield this.m23;
        yield this.m33;
        yield this.m43;
        yield this.m14;
        yield this.m24;
        yield this.m34;
        return (yield this.m44);
      }
    }
  });
  UI = (function() {
    class UI extends self.DataView {
      handle(e) {
        this.setUint32(this.OFFSET_EVENT_COUNT, ++this.lastEventCount, LE);
        this.setFloat32(this.OFFSET_EVENT_DELTA, e.timeStamp - this.timeStamp, LE);
        this.setFloat32(this.OFFSET_EVENT_TIME, e.timeStamp, LE);
        if (e.cancelable) {
          e.preventDefault();
        }
        return true;
      }

      listen(window) {
        var alt, back, caps, ctrl, enter, forth, left, meta, right, shift, space, tab;
        window.addEventListener("pointermove", (e) => {
          this.setFloat32(this.OFFSET_CLIENT_X, e.clientX, LE);
          this.setFloat32(this.OFFSET_CLIENT_Y, e.clientY, LE);
          return this.handle(e);
        });
        [left, forth, right, back, space, tab, enter, caps, shift, ctrl, alt, meta] = new Array(64).fill(0);
        window.addEventListener("keydown", (e) => {
          switch (e.keyCode) {
            case 65:
            case 37:
              this.setUint8(this.OFFSET_MOVE_LEFT, ++left);
              break;
            case 87:
            case 38:
              this.setUint8(this.OFFSET_MOVE_FORTH, ++forth);
              break;
            case 68:
            case 39:
              this.setUint8(this.OFFSET_MOVE_RIGHT, ++right);
              break;
            case 83:
            case 40:
              this.setUint8(this.OFFSET_MOVE_BACK, ++back);
              break;
            case 32:
              this.setUint8(this.OFFSET_MOVE_SPACE, ++space);
              break;
            case 9:
              this.setUint8(this.OFFSET_MOVE_TAB, ++tab);
              break;
            case 13:
              this.setUint8(this.OFFSET_MOVE_ENTER, ++enter);
              break;
            case 20:
              this.setUint8(this.OFFSET_MOVE_CAPS, ++caps);
              break;
            case 16:
              this.setUint8(this.OFFSET_MOVE_SHIFT, ++shift);
              break;
            case 17:
              this.setUint8(this.OFFSET_MOVE_CTRL, ++ctrl);
              break;
            case 18:
              this.setUint8(this.OFFSET_MOVE_ALT, ++alt);
              break;
            case 91:
              this.setUint8(this.OFFSET_MOVE_META, ++meta);
          }
          return this.handle(e);
        });
        return window.addEventListener("keyup", (e) => {
          switch (e.keyCode) {
            case 65:
            case 37:
              this.setUint8(this.OFFSET_MOVE_LEFT, left = 0);
              break;
            case 87:
            case 38:
              this.setUint8(this.OFFSET_MOVE_FORTH, forth = 0);
              break;
            case 68:
            case 39:
              this.setUint8(this.OFFSET_MOVE_RIGHT, right = 0);
              break;
            case 83:
            case 40:
              this.setUint8(this.OFFSET_MOVE_BACK, back = 0);
              break;
            case 32:
              this.setUint8(this.OFFSET_MOVE_SPACE, space = 0);
              break;
            case 9:
              this.setUint8(this.OFFSET_MOVE_TAB, tab = 0);
              break;
            case 13:
              this.setUint8(this.OFFSET_MOVE_ENTER, enter = 0);
              break;
            case 20:
              this.setUint8(this.OFFSET_MOVE_CAPS, caps = 0);
              break;
            case 16:
              this.setUint8(this.OFFSET_MOVE_SHIFT, shift = 0);
              break;
            case 17:
              this.setUint8(this.OFFSET_MOVE_CTRL, ctrl = 0);
              break;
            case 18:
              this.setUint8(this.OFFSET_MOVE_ALT, alt = 0);
              break;
            case 91:
              this.setUint8(this.OFFSET_MOVE_META, meta = 0);
          }
          return this.handle(e);
        });
      }

      viewport(x, y, width, height) {
        this.setFloat32(this.OFFSET_VIEWPORT_X, x, LE);
        this.setFloat32(this.OFFSET_VIEWPORT_Y, y, LE);
        this.setFloat32(this.OFFSET_WIDTH, width, LE);
        this.setFloat32(this.OFFSET_HEIGHT, height, LE);
        this.setFloat32(this.OFFSET_ASPECT, width / height, LE);
        return this;
      }

      frustrum(near = this.near, far = this.far, right = this.width, bottom = this.height, top = this.viewportY, left = this.viewportX) {
        var c1, c2, h, sx, sy, tx, ty, w;
        /*
        * @param left   Number Farthest left on the x-axis
        * @param right  Number Farthest right on the x-axis
        * @param bottom Number Farthest down on the y-axis
        * @param top    Number Farthest up on the y-axis
        * @param near   Number Distance to the near clipping plane along the -Z axis
        * @param far    Number Distance to the far clipping plane along the -Z axis
        * @return Float32Array A perspective transformation matrix
         */
        if (!left) {
          left = -(right /= 2);
        }
        if (!top) {
          top = -(bottom /= 2);
        }
        
        //. Make sure there is no division by zero
        if (left === right || bottom === top || near === far) {
          throw ["Invalid frustrum parameters:", ...arguments];
        }
        if (near <= 0 || far <= 0 || near >= far) {
          throw ["Distance near >= far and must be positive:", {near, far}];
        }
        w = right - left;
        h = top - bottom;
        sx = 2 * near / w;
        sy = 2 * near / h;
        c2 = -(far + near) / (far - near);
        c1 = 2 * near * far / (near - far);
        tx = -near * (left + right) / w;
        ty = -near * (bottom + top) / h;
        this.matrix.set([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, c2, -1, tx, ty, c1, 0]);
        return this;
      }

      setMovementsPerSecond(x, y, z) {
        this.setFloat32(this.MOVEMENT_PER_SECOND_X, x, LE);
        this.setFloat32(this.MOVEMENT_PER_SECOND_Y, y, LE);
        this.setFloat32(this.MOVEMENT_PER_SECOND_Z, z, LE);
        return this;
      }

      setRotationsPerSecond(x, y, z) {
        this.setFloat32(this.ROTATION_PER_SECOND_X, x, LE);
        this.setFloat32(this.ROTATION_PER_SECOND_Y, y, LE);
        this.setFloat32(this.ROTATION_PER_SECOND_Z, z, LE);
        return this;
      }

      perspective(fovy = 60, near = 0.01, far = 1000, aspect = this.aspect) {
        var bottom, half_fovy, left, right, top;
        if (fovy <= 0 || fovy >= 180 || aspect <= 0) {
          throw ["Invalid parameters to perspective", {fovy, aspect}];
        }
        half_fovy = .5 * fovy * (Math.PI / 180);
        bottom = -(top = near * Math.tan(half_fovy));
        left = -(right = top * aspect);
        this.setFloat32(this.OFFSET_FOVY, fovy, LE);
        this.setFloat32(this.OFFSET_NEAR, near, LE);
        this.setFloat32(this.OFFSET_FAR, far, LE);
        return this.frustrum(near, far, right, bottom, top, left);
      }

      orthographic(near, far, right, bottom, top, left) {
        var depthRatio, heightRatio, sx, sy, sz, tx, ty, tz, widthRatio;
        if (left === right || bottom === top || near === far) {
          throw ["Invalid parameters to orthographic", ...arguments];
        }
        widthRatio = 1 / (right - left);
        heightRatio = 1 / (top - bottom);
        depthRatio = 1 / (far - near);
        this.setFloat32(this.OFFSET_NEAR, near, LE);
        this.setFloat32(this.OFFSET_FAR, far, LE);
        sx = 2 * widthRatio;
        sy = 2 * heightRatio;
        sz = -2 * depthRatio;
        tz = -(near + far) * depthRatio;
        tx = -(right + left) * widthRatio;
        ty = -(bottom + top) * heightRatio;
        this.matrix.set([sx, 0, 0, tx, 0, sy, 0, ty, 0, 0, sz, tz, 0, 0, 0, 1]);
        return this;
      }

    };

    UI.prototype.lastEventCount = 0;

    UI.prototype.OFFSET_EVENT_TIME = 1 * 4;

    UI.prototype.OFFSET_EVENT_DELTA = 2 * 4;

    UI.prototype.OFFSET_EVENT_COUNT = 3 * 4;

    UI.prototype.OFFSET_VIEWPORT_X = 4 * 4;

    UI.prototype.OFFSET_VIEWPORT_Y = 5 * 4;

    UI.prototype.OFFSET_WIDTH = 6 * 4;

    UI.prototype.OFFSET_HEIGHT = 7 * 4;

    UI.prototype.OFFSET_ASPECT = 8 * 4;

    UI.prototype.OFFSET_FOVY = 9 * 4;

    UI.prototype.OFFSET_NEAR = 10 * 4;

    UI.prototype.OFFSET_FAR = 11 * 4;

    UI.prototype.OFFSET_CLIENT_X = 12 * 4;

    UI.prototype.OFFSET_CLIENT_Y = 13 * 4;

    UI.prototype.OFFSET_MOVE_FORTH = 14 * 4 + 0;

    UI.prototype.OFFSET_MOVE_BACK = 14 * 4 + 1;

    UI.prototype.OFFSET_MOVE_LEFT = 14 * 4 + 2;

    UI.prototype.OFFSET_MOVE_RIGHT = 14 * 4 + 3;

    UI.prototype.OFFSET_MOVE_SPACE = 15 * 4 + 0;

    UI.prototype.OFFSET_MOVE_TAB = 15 * 4 + 1;

    UI.prototype.OFFSET_MOVE_ENTER = 15 * 4 + 2;

    UI.prototype.OFFSET_MOVE_CAPS = 15 * 4 + 3;

    UI.prototype.OFFSET_MOVE_SHIFT = 16 * 4 + 0;

    UI.prototype.OFFSET_MOVE_CTRL = 16 * 4 + 1;

    UI.prototype.OFFSET_MOVE_ALT = 16 * 4 + 2;

    UI.prototype.OFFSET_MOVE_META = 16 * 4 + 3;

    UI.prototype.MOVEMENT_PER_SECOND_X = 17;

    UI.prototype.MOVEMENT_PER_SECOND_Y = 18;

    UI.prototype.MOVEMENT_PER_SECOND_Z = 19;

    UI.prototype.ROTATION_PER_SECOND_X = 20;

    UI.prototype.ROTATION_PER_SECOND_Y = 21;

    UI.prototype.ROTATION_PER_SECOND_Z = 22;

    UI.prototype.OFFSET_MATRIX = 32 * 4;

    UI.prototype.LENGTH_MATRIX = 16;

    Object.defineProperties(UI.prototype, {
      x: {
        get: function() {
          return this.getFloat32(this.OFFSET_CLIENT_X, LE);
        }
      },
      y: {
        get: function() {
          return this.getFloat32(this.OFFSET_CLIENT_Y, LE);
        }
      },
      delta: {
        get: function() {
          return this.getFloat32(this.OFFSET_EVENT_DELTA, LE);
        }
      },
      timeStamp: {
        get: function() {
          return this.getFloat32(this.OFFSET_EVENT_TIME, LE);
        }
      },
      moveForth: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_FORTH);
        }
      },
      moveBack: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_BACK);
        }
      },
      moveLeft: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_LEFT);
        }
      },
      moveRight: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_RIGHT);
        }
      },
      keySpace: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_SPACE);
        }
      },
      keyTab: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_TAB);
        }
      },
      keyCaps: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_CAPS);
        }
      },
      keyEnter: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_ENTER);
        }
      },
      keyShift: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_SHIFT);
        }
      },
      keyCtrl: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_CTRL);
        }
      },
      keyAlt: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_ALT);
        }
      },
      keyMeta: {
        get: function() {
          return this.getUint8(this.OFFSET_MOVE_META);
        }
      },
      xMovementPerSecond: {
        get: function() {
          return this.getFloat32(this.MOVEMENT_PER_SECOND_X, LE);
        }
      },
      yMovementPerSecond: {
        get: function() {
          return this.getFloat32(this.MOVEMENT_PER_SECOND_Y, LE);
        }
      },
      zMovementPerSecond: {
        get: function() {
          return this.getFloat32(this.MOVEMENT_PER_SECOND_Z, LE);
        }
      },
      xRotationPerSecond: {
        get: function() {
          return this.getFloat32(this.ROTATION_PER_SECOND_X, LE);
        }
      },
      yRotationPerSecond: {
        get: function() {
          return this.getFloat32(this.ROTATION_PER_SECOND_Y, LE);
        }
      },
      zRotationPerSecond: {
        get: function() {
          return this.getFloat32(this.ROTATION_PER_SECOND_Z, LE);
        }
      },
      viewportX: {
        get: function() {
          return this.getFloat32(this.OFFSET_VIEWPORT_X, LE);
        }
      },
      viewportY: {
        get: function() {
          return this.getFloat32(this.OFFSET_VIEWPORT_Y, LE);
        }
      },
      width: {
        get: function() {
          return this.getFloat32(this.OFFSET_WIDTH, LE);
        }
      },
      height: {
        get: function() {
          return this.getFloat32(this.OFFSET_HEIGHT, LE);
        }
      },
      aspect: {
        get: function() {
          return this.getFloat32(this.OFFSET_ASPECT, LE);
        }
      },
      fovy: {
        get: function() {
          return this.getFloat32(this.OFFSET_FOVY, LE);
        }
      },
      near: {
        get: function() {
          return this.getFloat32(this.OFFSET_NEAR, LE);
        }
      },
      far: {
        get: function() {
          return this.getFloat32(this.OFFSET_FAR, LE);
        }
      },
      matrix: {
        get: function() {
          return DOMMatrix.prototype.new(this.byteOffset + this.OFFSET_MATRIX);
        },
        set: function() {
          return this.matrix.set(arguments[0]);
        }
      },
      eventCount: {
        get: function() {
          return this.getUint32(this.OFFSET_EVENT_COUNT, LE);
        }
      },
      hasEvent: {
        get: function() {
          if (this.eventCount !== this.lastEventCount) {
            return this.lastEventCount = this.eventCount;
          }
          return false;
        }
      }
    });

    return UI;

  }).call(this);
  regenerate = function() {
    var FragmentShader, VertexShader, WebGLBuffer, WebGLShader;
    Object.defineProperties(TypedArray, {
      from: {
        value: function() {
          var array, i;
          array = new this(arguments[0].length);
          if (isBridge) {
            for (i in array) {
              array[i] = arguments[0][i];
            }
            Atomics.notify(p32, 3, 1, MAX_THREAD_COUNT);
          } else {
            Atomics.wait(p32, 3);
          }
          return array;
        }
      },
      of: {
        value: function() {
          var array, i;
          array = new this(arguments.length);
          if (isBridge) {
            for (i in array) {
              array[i] = arguments[i];
            }
            Atomics.notify(p32, 3, 1, MAX_THREAD_COUNT);
          } else {
            Atomics.wait(p32, 3);
          }
          return array;
        }
      },
      at: {
        value: function(ptri) {
          if (!ptri) {
            return null;
          }
          return new this(-parseInt(ptri));
        }
      }
    });
    Object.defineProperties(TypedArray.prototype, {
      indexUint8: {
        value: function() {
          return arguments[0] + (p32[resolvs.get(this)] + HINDEX_BYTEOFFSET) / 1;
        }
      },
      indexUint16: {
        value: function() {
          return arguments[0] + (p32[resolvs.get(this)] + HINDEX_BYTEOFFSET) / 2;
        }
      },
      indexUint32: {
        value: function() {
          return arguments[0] + (p32[resolvs.get(this)] + HINDEX_BYTEOFFSET) / 4;
        }
      },
      subarray: {
        //part of this
        value: function(begin = 0, end = this.length) {
          return new this.constructor(this.buffer, this.byteOffset + this.BYTES_PER_ELEMENT * begin, end - begin);
        }
      },
      
      //part of this
      sub: {
        value: function(byteOffset = 0, length = this.length) {
          return new this.constructor(this.buffer, this.byteOffset + byteOffset, length);
        }
      },
      TypedArray: {
        get: function() {
          var tarray;
          tarray = this;
          while (!Object.hasOwn(tarray, "BYTES_PER_ELEMENT")) {
            tarray = Object.getPrototypeOf(tarray);
          }
          return self[tarray.constructor.name];
        }
      },
      detach: {
        value: function(byteOffset = 0, length = this.length) {
          return new this.TypedArray(this.sub(byteOffset, length));
        }
      },
      slice: {
        //copy to new
        value: function(begin = 0, end = this.length) {
          return new this.constructor(this, this.BYTES_PER_ELEMENT * begin, end - begin);
        }
      },
      [Symbol.iterator]: {
        value: function() {
          var begin, index, iterate, length, ptri, total;
          ptri = resolvs.get(this);
          length = -1 + Atomics.load(p32, ptri + HINDEX_LENGTH);
          begin = Atomics.load(p32, ptri + HINDEX_BEGIN);
          if (isBridge) {
            Atomics.wait(p32, 4);
            return {
              next: function() {
                return {
                  done: true
                };
              }
            };
          }
          index = 0;
          iterate = 0;
          total = 0;
          return {
            next: function() {
              if (!iterate) {
                iterate = ITERATION_PER_THREAD;
                index = Atomics.add(p32, ptri + HINDEX_ITERINDEX, iterate);
                total += iterate;
              }
              if (index > length) {
                Atomics.wait(p32, 3, 0, 100);
                Atomics.notify(p32, 4, 1);
                return {
                  done: true
                };
              }
              iterate--;
              return {
                value: index++ // + begin    
              };
            }
          };
        }
      },
      loadUint8: {
        value: function(index) {
          return Atomics.load(ui8, index + this.byteOffset);
        }
      },
      getUint8: {
        value: function(index) {
          return ui8[index + this.byteOffset];
        }
      },
      loadInt8: {
        value: function(index) {
          return Atomics.load(si8, index + this.byteOffset);
        }
      },
      getInt8: {
        value: function(index) {
          return si8[index + this.byteOffset];
        }
      },
      loadUint8Clamped: {
        value: function(index) {
          return Atomics.load(cu8, index + this.byteOffset);
        }
      },
      getUint8Clamped: {
        value: function(index) {
          return cu8[index + this.byteOffset];
        }
      },
      loadUint16: {
        value: function(index) {
          return Atomics.load(u16, index + this.byteOffset / 2);
        }
      },
      getUint16: {
        value: function(index) {
          return u16[index + this.byteOffset / 2];
        }
      },
      loadInt16: {
        value: function(index) {
          return Atomics.load(i16, index + this.byteOffset / 2);
        }
      },
      getInt16: {
        value: function(index) {
          return i16[index + this.byteOffset / 2];
        }
      },
      loadUint32: {
        value: function(index) {
          return Atomics.load(u32, index + this.byteOffset / 4);
        }
      },
      getUint32: {
        value: function(index) {
          return u32[index + this.byteOffset / 4];
        }
      },
      loadInt32: {
        value: function(index) {
          return Atomics.load(i32, index + this.byteOffset / 4);
        }
      },
      loadFloat32: {
        value: function(index) {
          return new self.Float32Array(self.Uint32Array.of(Atomics.load(u32, index + this.byteOffset / 4)).buffer).at(0);
        }
      },
      getInt32: {
        value: function(index) {
          return i32[index + this.byteOffset / 4];
        }
      },
      getFloat32: {
        value: function(index) {
          return f32[index + this.byteOffset / 4];
        }
      },
      getFloat64: {
        value: function(index) {
          return f64[index + this.byteOffset / 8];
        }
      },
      storeUint8: {
        value: function(index, value) {
          return Atomics.store(ui8, index + this.byteOffset, value);
        }
      },
      setUint8: {
        value: function(index, value) {
          return ui8[index + this.byteOffset] = value;
        }
      },
      storeInt8: {
        value: function(index, value) {
          return Atomics.store(si8, index + this.byteOffset, value);
        }
      },
      setInt8: {
        value: function(index, value) {
          return si8[index + this.byteOffset] = value;
        }
      },
      storeUint8Clamped: {
        value: function(index, value) {
          return Atomics.store(cu8, index + this.byteOffset, value);
        }
      },
      setUint8Clamped: {
        value: function(index, value) {
          return cu8[index + this.byteOffset] = value;
        }
      },
      storeUint16: {
        value: function(index, value) {
          return Atomics.store(u16, index + this.byteOffset / 2, value);
        }
      },
      setUint16: {
        value: function(index, value) {
          return u16[index + this.byteOffset / 2] = value;
        }
      },
      storeInt16: {
        value: function(index, value) {
          return Atomics.store(i16, index + this.byteOffset / 2, value);
        }
      },
      setInt16: {
        value: function(index, value) {
          return i16[index + this.byteOffset / 2] = value;
        }
      },
      storeUint32: {
        value: function(index, value) {
          return Atomics.store(u32, index + this.byteOffset / 4, value);
        }
      },
      setUint32: {
        value: function(index, value) {
          return u32[index + this.byteOffset / 4] = value;
        }
      },
      storeInt32: {
        value: function(index, value) {
          return Atomics.store(i32, index + this.byteOffset / 4, value);
        }
      },
      storeFloat32: {
        value: function(index, value) {
          value = new self.Uint32Array(self.Float32Array.of(value).buffer)[0];
          return Atomics.store(u32, index + this.byteOffset / 4, value);
        }
      },
      setInt32: {
        value: function(index, value) {
          return i32[index + this.byteOffset / 4] = value;
        }
      },
      setFloat32: {
        value: function(index, value) {
          return f32[index + this.byteOffset / 4] = value;
        }
      },
      addUint8: {
        value: function(index, value) {
          return Atomics.add(ui8, index + this.byteOffset, value);
        }
      },
      addInt8: {
        value: function(index, value) {
          return Atomics.add(si8, index + this.byteOffset, value);
        }
      },
      addUint8Clamped: {
        value: function(index, value) {
          return Atomics.add(cu8, index + this.byteOffset, value);
        }
      },
      addUint16: {
        value: function(index, value) {
          return Atomics.add(u16, index + this.byteOffset / 2, value);
        }
      },
      addInt16: {
        value: function(index, value) {
          return Atomics.add(i16, index + this.byteOffset / 2, value);
        }
      },
      addUint32: {
        value: function(index, value) {
          return Atomics.add(u32, index + this.byteOffset / 4, value);
        }
      },
      addInt32: {
        value: function(index, value) {
          return Atomics.add(i32, index + this.byteOffset / 4, value);
        }
      }
    });
    Uint8Array = class Uint8Array extends self.Uint8Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 1;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Int8Array = class Int8Array extends self.Int8Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 1;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Uint8ClampedArray = class Uint8ClampedArray extends self.Uint8ClampedArray {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 1;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Uint16Array = class Uint16Array extends self.Uint16Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 2;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Int16Array = class Int16Array extends self.Int16Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 2;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Uint32Array = class Uint32Array extends self.Uint32Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 4;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Int32Array = class Int32Array extends self.Int32Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 4;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Float32Array = class Float32Array extends self.Float32Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 4;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    Float64Array = class Float64Array extends self.Float64Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 8;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    BigInt64Array = class BigInt64Array extends self.BigInt64Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 8;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    BigUint64Array = class BigUint64Array extends self.BigUint64Array {
      constructor(arg0, byteOffset, length) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, begin, bpel, byteLength, copyEnd, copyStart, end, nextByteLength, ptri;
        if (arg0 < 0) {
          ptri = -arg0;
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return super(objbuf, byteOffset, length);
        }
        ptri = resolvCall();
        argc = arguments.length;
        bpel = 8;
        if (isThread) {
          length = Atomics.load(p32, ptri + HINDEX_LENGTH);
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          super(objbuf, byteOffset, length);
        } else if (isBridge) {
          if (argc === 1) {
            // new TypedArray( 24 );
            // new TypedArray( buffer );
            // new TypedArray( [ 2, 4, 1 ] );
            if (Number.isInteger(arg0)) {
              // new TypedArray( 24 );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
            } else if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArray(?) );

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              byteLength = arg0.byteLength;
              length = arg0.byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + byteLength);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              ui8.set(arg0, byteOffset);
            }
          } else if (argc === 3) {
            // new TypedArray( buffer, 1221, 4 );
            // new TypedArray( new TypedArra( 2 ), 36, 2 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36, 2 );
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + length * bpel;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(new self.Uint8Array(arg0.buffer, copyStart, length), byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36, 2 );
              arg0Offset = byteOffset;
              byteLength = length * bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
                ui8.set(new self.Uint8Array(arg0, arg0Offset, byteLength), byteOffset);
              }
            }
          } else if (argc === 2) {
            // new TypedArray( buffer, 36 );
            // new TypedArray( new TypedArra( 2 ), 36 );
            if (ArrayBuffer.isView(arg0)) {
              // new TypedArray( new TypedArra( 2 ), 36 );
              arg0Length = arg0.length;
              arg0ByteLength = arg0.BYTES_PER_ELEMENT * arg0Length;
              copyStart = arg0.byteOffset + byteOffset;
              copyEnd = copyStart + arg0ByteLength;
              nextByteLength = arg0ByteLength - byteOffset;
              byteLength = nextByteLength;
              length = byteLength / bpel;
              byteOffset = malloc(byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, copyStart, copyEnd);
              } else {
                ui8.set(arg0, byteOffset);
              }
            } else if (arg0.byteLength) {
              // new TypedArray( buffer, 36 );
              arg0Offset = byteOffset;
              byteLength = arg0.byteLength - byteOffset;
              length = byteLength / bpel;
              if (arg0 !== objbuf) {
                byteOffset = malloc(byteLength, bpel);
              }
              if (arg0 !== objbuf) {
                ui8.set(new self.Uint8Array(arg0, arg0Offset), byteOffset);
              }
            }
          }
          super(objbuf, byteOffset, length);
          begin = byteOffset / bpel;
          end = begin + length;
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_BEGIN, begin);
          Atomics.store(p32, ptri + HINDEX_END, end);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(this, ptri);
      }

    };
    OffscreenCanvas = class OffscreenCanvas extends self.OffscreenCanvas {
      static Proxy(ptri) {
        return {
          get: function(ctx, key, pxy) {
            switch (key) {
              case "clearColor":
              case "clear":
                return function() {
                  return lock(ptri);
                };
              default:
                return Reflect.get(...arguments);
            }
          }
        };
      }

      getContext() {
        var context, ptri;
        ptri = resolvCall();
        if (isThread) {
          context = new Proxy(GLContext.prototype, OffscreenCanvas.Proxy(ptri));
        } else {
          context = super.getContext(...arguments);
          unlock(ptri);
        }
        resolvs.set(context, ptri);
        return context;
      }

      render(handler) {
        var commit;
        if (isBridge) {
          (commit = () => {
            handler.call(this);
            postMessage({
              render: this.transferToImageBitmap()
            });
            return requestAnimationFrame(commit);
          })();
        }
        return this;
      }

      constructor() {
        var canvas, ptri;
        ptri = resolvCall();
        if (isThread) {
          canvas = new Proxy(OffscreenCanvas.prototype, OffscreenCanvas.Proxy(ptri));
        } else {
          canvas = super(...arguments);
          unlock(ptri);
        }
        resolvs.set(canvas, ptri);
        return canvas;
      }

    };
    WebGLBuffer = class WebGLBuffer extends Float32Array {
      set(valueset, index = 0) {
        super.set(valueset, index);
        return this.upload();
      }

    };
    WebGLShader = (function() {
      class WebGLShader extends Uint8Array {
        constructor() {
          if (arguments.length) {
            super(...arguments);
          } else {
            super(WebGLShader.byteLength).source = this.DEFAULT_SOURCE;
          }
        }

        compile(gl) {
          var info, shader;
          shader = gl.createShader(this.type);
          gl.shaderSource(shader, this.source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, this.COMPILE_STATUS)) {
            info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw `Could not compile shader: ${info}`;
          }
          return shader;
        }

        attach(gl, program) {
          gl.attachShader(program, this.compile(gl));
          return this;
        }

      };

      WebGLShader.byteLength = 4 * 4 + 1024 * 16;

      WebGLShader.prototype.INDEX_ISACTIVE = 0; //  8 bit        byteOffset : 0

      WebGLShader.prototype.INDEX_TYPE = 1; // 16 bit 1nd    byteOffset : 2

      WebGLShader.prototype.INDEX_LENGTH = 1; // 32 bit 1st    byteOffset : 4

      WebGLShader.prototype.OFFSET_SOURCE_BEGIN = 4 * 4;

      WebGLShader.prototype.COMPILE_STATUS = (typeof WebGL2RenderingContext !== "undefined" && WebGL2RenderingContext !== null ? WebGL2RenderingContext.COMPILE_STATUS : void 0) || 35713;

      WebGLShader.prototype.FRAGMENT_SHADER = (typeof WebGL2RenderingContext !== "undefined" && WebGL2RenderingContext !== null ? WebGL2RenderingContext.FRAGMENT_SHADER : void 0) || 35632;

      WebGLShader.prototype.VERTEX_SHADER = (typeof WebGL2RenderingContext !== "undefined" && WebGL2RenderingContext !== null ? WebGL2RenderingContext.VERTEX_SHADER : void 0) || 35633;

      WebGLShader.prototype.DEFAULT_SOURCE = '';

      Object.defineProperties(WebGLShader.prototype, {
        isActive: {
          get: function() {
            return this.loadUint8(this.INDEX_ISACTIVE);
          },
          set: function() {
            return this.storeUint8(this.INDEX_ISACTIVE, arguments[0]);
          }
        },
        type: {
          get: function() {
            return this.loadUint16(this.INDEX_TYPE);
          },
          set: function() {
            return this.storeUint16(this.INDEX_TYPE, arguments[0]);
          }
        },
        length: {
          get: function() {
            return this.loadUint32(this.INDEX_LENGTH);
          },
          set: function() {
            return this.storeUint32(this.INDEX_LENGTH, arguments[0]);
          }
        },
        source: {
          get: function() {
            return textDecoder.decode(this.detach(this.OFFSET_SOURCE_BEGIN));
          },
          set: function(source = this.DEFAULT_SOURCE) {
            var text;
            if (text = `${source}`.trim()) {
              this.length = text.length;
            }
            this.type = !text.match(/gl_FragColor/) ? this.VERTEX_SHADER : this.FRAGMENT_SHADER;
            return this.set(textEncoder.encode(text), this.OFFSET_SOURCE_BEGIN);
          }
        }
      });

      return WebGLShader;

    }).call(this);
    VertexShader = (function() {
      class VertexShader extends WebGLShader {};

      VertexShader.prototype.DEFAULT_SOURCE =  `
                attribute vec3 a_Position;
                uniform mat4 u_ViewMatrix;
                uniform float u_PointSize;

                void main() {
                    gl_Position = u_ViewMatrix * vec4(a_Position, 1.0);
                    gl_PointSize = u_PointSize;
                }
            ` ;

      return VertexShader;

    }).call(this);
    FragmentShader = (function() {
      class FragmentShader extends WebGLShader {};

      FragmentShader.prototype.DEFAULT_SOURCE =  `
                void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }
            ` ;

      return FragmentShader;

    }).call(this);
    return OnscreenCanvas = (function() {
      class OnscreenCanvas extends Uint32Array {
        addFrame(timeStamp) {
          this.delta = (timeStamp - this.timeStamp) * 1e-3;
          this.timeStamp = timeStamp;
          this.frame += 1;
          this.fps = 1 / this.delta;
          return this.delta;
        }

        lostContext() {
          return this.gl.getExtension("WEBGL_lose_context").loseContext();
        }

        malloc(pointCount = 0) {
          var array, byteLength, byteOffset, length, offset;
          this.pointCount = pointCount + this.pointCount;
          length = pointCount * this.ELEMENTS_PER_POINT;
          this.drawLength += length;
          byteLength = length * this.BYTES_PER_ELEMENT;
          offset = this.addUint32(this.INDEX_DRAWBYTELENGTH, byteLength);
          byteOffset = this.byteOffset + this.BYTEOFFSET_GLBUFFER + offset;
          array = new WebGLBuffer(this.buffer, byteOffset, length);
          return Object.defineProperties(array, {
            upload: {
              value: () => {
                var a_Position;
                this.gl.bufferData(this.gl.ARRAY_BUFFER, this.drawBuffer, this.gl.STATIC_DRAW);
                a_Position = this.gl.getAttribLocation(this.program, "a_Position");
                this.gl.vertexAttribPointer(a_Position, 3, this.gl.FLOAT, false, 0, 0);
                return this.gl.enableVertexAttribArray(a_Position);
              }
            }
          });
        }

        defineUniforms() {
          var j, len, ref, results, u;
          ref = this.activeUniforms;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            u = ref[j];
            switch (u.type) {
              case 35676:
              case "FLOAT_MAT4":
                results.push((function(program, uniform) {
                  return Object.defineProperty(this, uniform.name, {
                    get: this.getUniform.bind(this, program, uniform.location),
                    set: this.uniformMatrix4fv.bind(this, uniform.location, false)
                  });
                }).call(this.gl, this.program, u));
                break;
              case 5126:
              case "FLOAT":
                results.push((function(program, uniform) {
                  return Object.defineProperty(this, uniform.name, {
                    get: this.getUniform.bind(this, program, uniform.location),
                    set: this.uniform1f.bind(this, uniform.location)
                  });
                }).call(this.gl, this.program, u));
                break;
              default:
                results.push(void 0);
            }
          }
          return results;
        }

        reload() {
          var info, program;
          program = this.gl.createProgram();
          if (!this.vertexShader) {
            this.vertexShader = new VertexShader();
          }
          if (!this.fragmentShader) {
            this.fragmentShader = new FragmentShader();
          }
          this.vertexShader.attach(this.gl, program);
          this.fragmentShader.attach(this.gl, program);
          this.gl.linkProgram(program);
          this.gl.useProgram(program);
          if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            info = this.gl.getProgramInfoLog(program);
            throw `Could not compile WebGL program. \n${info}`;
          }
          this.program = program;
          this.defineUniforms();
          return this;
        }

        setContext(context) {
          Object.defineProperties(this, {
            gl: {
              value: context
            },
            canvas: {
              value: context.canvas
            }
          });
          this.canvas.addEventListener("webglcontextlost", () => {
            this.hasContext = 0;
            this.oncontextlost();
            return this.onwebglcontextlost();
          });
          this.canvas.addEventListener("webglcontextrestored", () => {
            this.hasContext = 1;
            this.reload();
            this.oncontextrestored(this.gl);
            this.onwebglcontextrestored(this.gl);
            if (this.isRendering) {
              return this.render();
            }
          });
          this.canvas.dispatchEvent(new CustomEvent("webglcontextrestored"));
          return this;
        }

        oncontextlost() {}

        oncontextrestored() {}

        onwebglcontextlost() {}

        onwebglcontextrestored() {}

        render(handler) {
          var commit, gl, ptri;
          if (isThread) {
            return (function() {});
          }
          if (!this.isRendering) {
            this.isRendering = 1;
          }
          if (handler) {
            this.handler = handler;
          }
          if (!this.hasContext) {
            return;
          }
          [gl, handler, ptri] = [this.gl, this.handler, resolvs.get(this)];
          if (isBridge) {
            return (commit = (now) => {
              if (this.hasContext && this.hasBinding) {
                handler.call(this, gl, this.addFrame(now));
                this.gl.drawArrays(this.gl.POINTS, 0, this.pointCount);
              }
              return requestAnimationFrame(commit);
            })(0);
          }
        }

        constructor() {
          super(OnscreenCanvas.byteLength).getContext("webgl2");
        }

        getContext(type) {
          var onscreen, ptri;
          ptri = resolvCall();
          onscreen = this;
          if (isThread) {
            return Object.defineProperty(onscreen, "gl", {
              value: new Proxy({}, {})
            });
          }
          replies[ptri] = new WeakRef((data) => {
            return this.setContext(data.canvas.getContext(type, {
              powerPreference: "high-performance"
            }));
          });
          postMessage({
            onscreen: {ptri}
          });
          return resolvs.set(onscreen, ptri);
        }

      };

      OnscreenCanvas.byteLength = 16 * 4 + 4096 * 4096;

      OnscreenCanvas.prototype.INDEX_HASCONTEXT = 0; // Uint8

      OnscreenCanvas.prototype.INDEX_HASBINDING = 1; // Uint8

      OnscreenCanvas.prototype.INDEX_ISRENDERING = 2; // Uint8

      OnscreenCanvas.prototype.INDEX_FRAME = 3; // Uint32

      OnscreenCanvas.prototype.INDEX_TIMESTAMP = 4; // Uint32

      OnscreenCanvas.prototype.INDEX_DELTA = 5; // Uint32

      OnscreenCanvas.prototype.INDEX_FPS = 6; // Uint32

      OnscreenCanvas.prototype.INDEX_VSHADER = 7; // Uint32

      OnscreenCanvas.prototype.INDEX_FSHADER = 8; // Uint32

      OnscreenCanvas.prototype.INDEX_DRAWLENGTH = 9;

      OnscreenCanvas.prototype.INDEX_DRAWBYTELENGTH = 10;

      OnscreenCanvas.prototype.INDEX_POINTCOUNT = 11;

      OnscreenCanvas.prototype.INDEX_GLBUFFER_PTRI = 12;

      OnscreenCanvas.prototype.BYTEOFFSET_GLBUFFER = 16 * 4;

      OnscreenCanvas.prototype.ELEMENTS_PER_POINT = 3;

      Object.defineProperties(OnscreenCanvas.prototype, {
        isRendering: {
          get: function() {
            return this.loadUint8(this.INDEX_ISRENDERING);
          },
          set: function(v) {
            return this.storeUint8(this.INDEX_ISRENDERING, v);
          }
        },
        hasContext: {
          get: function() {
            return this.loadUint8(this.INDEX_HASCONTEXT);
          },
          set: function(v) {
            return this.storeUint8(this.INDEX_HASCONTEXT, v);
          }
        },
        hasBinding: {
          get: function() {
            return this.loadUint8(this.INDEX_HASBINDING);
          },
          set: function(v) {
            return this.storeUint8(this.INDEX_HASBINDING, v);
          }
        },
        frame: {
          get: function() {
            return this.loadUint32(this.INDEX_FRAME);
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_FRAME, v);
          }
        },
        timeStamp: {
          get: function() {
            return this.getFloat32(this.INDEX_TIMESTAMP);
          },
          set: function(v) {
            return this.setFloat32(this.INDEX_TIMESTAMP, v);
          }
        },
        delta: {
          get: function() {
            return this.getFloat32(this.INDEX_DELTA);
          },
          set: function(v) {
            return this.setFloat32(this.INDEX_DELTA, v);
          }
        },
        fps: {
          get: function() {
            return this.getUint8(this.INDEX_FPS);
          },
          set: function(v) {
            return this.setUint8(this.INDEX_FPS, v);
          }
        },
        vertexShader: {
          get: function() {
            return VertexShader.at(this.loadUint32(this.INDEX_VSHADER));
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_VSHADER, resolvs.get(v));
          }
        },
        fragmentShader: {
          get: function() {
            return FragmentShader.at(this.loadUint32(this.INDEX_FSHADER));
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_FSHADER, resolvs.get(v));
          }
        },
        drawBuffer: {
          get: function() {
            this.glBuffer;
            return new WebGLBuffer(this.buffer, this.byteOffset + this.BYTEOFFSET_GLBUFFER, this.drawLength);
          }
        },
        drawLength: {
          get: function() {
            return this.loadUint32(this.INDEX_DRAWLENGTH);
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_DRAWLENGTH, v);
          }
        },
        pointCount: {
          get: function() {
            return this.loadUint32(this.INDEX_POINTCOUNT);
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_POINTCOUNT, v);
          }
        },
        width: {
          get: function() {
            return this.gl.drawingBufferWidth;
          }
        },
        height: {
          get: function() {
            return this.gl.drawingBufferHeight;
          }
        },
        glBuffer: {
          configurable: true,
          get: function() {
            var buffer;
            if (!(buffer = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING))) {
              buffer = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.hasBinding = 1;
            return Object.defineProperty(this, "glBuffer", {
              value: buffer,
              configurable: true,
              writable: true
            }).glBuffer;
          }
        },
        activeAttributes: {
          get: function() {
            var attrib, i, k, results, v;
            i = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
            v = Object.values(WebGL2RenderingContext);
            k = Object.keys(WebGL2RenderingContext);
            results = [];
            while (i--) {
              attrib = this.gl.getActiveAttrib(this.program, i);
              attrib.isEnabled = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
              attrib.glBuffer = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
              attrib.vertexLocation = this.gl.getAttribLocation(this.program, attrib.name);
              attrib.vertexSize = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_SIZE);
              attrib.vertexType = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_TYPE);
              attrib.vertexKind = k.at(v.indexOf(attrib.vertexType));
              attrib.vertexIsNormalized = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
              attrib.vertexStride = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_STRIDE);
              attrib.currentValue = this.gl.getVertexAttrib(i, this.gl.CURRENT_VERTEX_ATTRIB);
              attrib.integer = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_INTEGER);
              attrib.divisor = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_DIVISOR);
              //ext: ANGLE_instanced_arrays
              //   + attrib.divisorAngle = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE
              attrib.kind = k.at(v.indexOf(attrib.type));
              results.push(attrib);
            }
            return results;
          }
        },
        activeUniforms: {
          get: function() {
            var i, k, results, uniform, v;
            i = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
            v = Object.values(WebGL2RenderingContext);
            k = Object.keys(WebGL2RenderingContext);
            results = [];
            while (i--) {
              uniform = this.gl.getActiveUniform(this.program, i);
              uniform.kind = k.at(v.indexOf(uniform.type));
              uniform.location = this.gl.getUniformLocation(this.program, uniform.name);
              uniform.uniform = this.gl.getUniform(this.program, uniform.location);
              results.push(uniform);
            }
            return results;
          }
        }
      });

      return OnscreenCanvas;

    }).call(this);
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
      render: function(data) {
        return this[data.ptri].transferFromImageBitmap(data.imageBitmap);
      },
      onscreen: function(data) {
        var canvas;
        canvas = createCanvas(data).transferControlToOffscreen();
        return this.postMessage({
          onscreen: {canvas, ...data}
        }, [canvas]);
      },
      offscreen: function(data) {}
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
    createCanvas = function(data) {
      var canvas, height, width;
      ({width = INNER_WIDTH, height = INNER_HEIGHT} = data);
      canvas = document.createElement("canvas");
      canvas.ptri = data.ptri;
      canvas.width = RATIO_PIXEL * width;
      canvas.height = RATIO_PIXEL * height;
      canvas.style.width = CSS.px(width);
      canvas.style.height = CSS.px(height);
      canvas.style.inset = CSS.px(0);
      canvas.style.position = "fixed";
      return document.body.appendChild(canvas);
    };
    createBuffers = function() {
      var Buffer, buffer, maxByteLength;
      Buffer = typeof SharedArrayBuffer !== "undefined" && SharedArrayBuffer !== null ? SharedArrayBuffer : ArrayBuffer;
      buffer = !(maxByteLength = BUFFER_TEST_START_LENGTH);
      while (!buffer) {
        try {
          buffer = new Buffer(0, {maxByteLength});
        } catch (error1) {
          maxByteLength /= BUFFER_TEST_STEP_DIVIDER;
        }
      }
      keybuf = new Buffer(4 * 48);
      objbuf = new Buffer(4 * 2e7);
      ptrbuf = new Buffer(MAX_PTR_COUNT * BYTES_PER_ELEMENT);
      Atomics.store(new self.Int32Array(ptrbuf), 1, HEADERS_LENGTH);
      return initMemory({objbuf, ptrbuf, keybuf});
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
        setup: {blobURL, objbuf, ptrbuf, keybuf}
      });
      results = [];
      for (i = j = 0, ref = MAX_THREAD_COUNT; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        thread = createWorker("thread" + i, threadmessage);
        results.push(thread.postMessage({
          setup: {blobURL, objbuf, ptrbuf, keybuf}
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
      var prevent;
      window.onclick = function() {
        console.table(workers.map(function(w) {
          return w.info;
        }));
        console.warn("");
        console.log(objbuf);
        console.log(ptrbuf);
        console.log(p32);
        return bc.postMessage(DUMP_WEAKMAP);
      };
      document.body.style.overscrollBehavior = "none";
      document.body.style.height = CSS.vh(100);
      document.body.style.margin = 0;
      prevent = function(e) {
        var j, len, w;
        try {
          e.preventDefault();
        } catch (error1) {}
        objbuf = ptrbuf = null;
        for (j = 0, len = workers.length; j < len; j++) {
          w = workers[j];
          w.terminate();
        }
        return 1;
      };
      window.onerror = prevent;
      window.onunload = prevent;
      window.onpagehide = prevent;
      window.onbeforeunload = prevent;
      window.onunhandledrejection = prevent;
      window.r = new Proxy({}, {
        get: function() {
          var j, len, w;
          window.onerror = window.onunload = window.onpagehide = window.onbeforeunload = window.onunhandledrejection = function() {};
          objbuf = ptrbuf = null;
          for (j = 0, len = workers.length; j < len; j++) {
            w = workers[j];
            w.terminate();
          }
          return location.reload(true);
        }
      });
      return ui.listen(window);
    };
    queueMicrotask(function() {
      createBuffers();
      createBlobURL();
      createThreads();
      return listenEvents();
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
            regenerate();
            results.push(postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid}
            }));
            break;
          case "onscreen":
            results.push(replies[data.ptri].deref()(data));
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
            regenerate();
            results.push(postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid}
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
      },
      [DUMP_WEAKMAP]: function() {
        return log(resolvs);
      }
    }[e.data]();
  };
  return 0xdead;
})();
