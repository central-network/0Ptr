self.name = "window";

(self.init = function() {
  var ALLOCATION_BYTEOFFSET, BUFFER_TEST_START_LENGTH, BUFFER_TEST_STEP_DIVIDER, BYTES_PER_ELEMENT, BigInt64Array, BigUint64Array, DUMP_WEAKMAP, EVENT_READY, Float32Array, Float64Array, FragmentShader, GLContext, HEADERS_BYTE_LENGTH, HEADERS_LENGTH, HEADERS_LENGTH_OFFSET, HINDEX_ATTRIBSLENGTH, HINDEX_ATTRIBSOFFSET, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_ITERINDEX, HINDEX_LENGTH, HINDEX_LOCKFREE, HINDEX_NEEDSUPDATE, HINDEX_PARENT, HINDEX_PTRI, HINDEX_RESOLV_ID, INITIAL_BYTELENGTH, INNER_HEIGHT, INNER_WIDTH, ITERATION_PER_THREAD, Int16Array, Int32Array, Int8Array, LE, MAX_PTR_COUNT, MAX_THREAD_COUNT, Object3, OffscreenCanvas, OnscreenCanvas, RADIANS_PER_DEGREE, RATIO_ASPECT, RATIO_PIXEL, RESERVED_BYTELENGTH, TypedArray, UI, UI_LENGTH, UI_OFFSET, Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, VertexShader, WebGLShader, addInt16, addInt32, addInt8, addUint16, addUint32, addUint8, andInt16, andInt32, andInt8, andUint16, andUint32, andUint8, bc, blobURL, bridgeHandler, bridgemessage, compareInt16, compareInt32, compareInt8, compareUint16, compareUint32, compareUint8, createBlobURL, createBuffers, createCanvas, createThreads, createWorker, cu8, dvw, error, exchangeInt16, exchangeInt32, exchangeInt8, exchangeUint16, exchangeUint32, exchangeUint8, f32, f64, getInt16, getInt32, getInt8, getUint16, getUint32, getUint8, i16, i32, i64, initMemory, isBridge, isThread, isWindow, keybuf, listenEvents, littleEnd, loadInt16, loadInt32, loadInt8, loadUint16, loadUint32, loadUint8, lock, log, malloc, now, number, objbuf, objects, orInt16, orInt32, orInt8, orUint16, orUint32, orUint8, p32, pnow, ptrbuf, randomUUID, regenerate, replies, resolvCall, resolvFind, resolvs, selfName, setInt16, setInt32, setInt8, setUint16, setUint32, setUint8, sharedHandler, si8, storeInt16, storeInt32, storeInt8, storeUint16, storeUint32, storeUint8, subInt16, subInt32, subInt8, subUint16, subUint32, subUint8, textDecoder, textEncoder, threadHandler, threadId, threadmessage, u16, u32, u64, ui, ui8, unlock, warn, workers, xorInt16, xorInt32, xorInt8, xorUint16, xorUint32, xorUint8;
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
    HINDEX_PTRI = HEADERS_LENGTH_OFFSET++,
    HINDEX_LENGTH = HEADERS_LENGTH_OFFSET++,
    HINDEX_BYTEOFFSET = HEADERS_LENGTH_OFFSET++,
    HINDEX_BYTELENGTH = HEADERS_LENGTH_OFFSET++,
    HINDEX_RESOLV_ID = HEADERS_LENGTH_OFFSET++,
    HINDEX_LOCKFREE = HEADERS_LENGTH_OFFSET++,
    HINDEX_PARENT = HEADERS_LENGTH_OFFSET++,
    HINDEX_ITERINDEX = HEADERS_LENGTH_OFFSET++,
    HINDEX_NEEDSUPDATE = HEADERS_LENGTH_OFFSET++,
    HINDEX_ATTRIBSOFFSET = HEADERS_LENGTH_OFFSET++,
    HINDEX_ATTRIBSLENGTH = HEADERS_LENGTH_OFFSET++,
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
    ITERATION_PER_THREAD = 100,
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
  [blobURL, objbuf, ptrbuf, keybuf, lock, unlock, malloc, littleEnd, ui, p32, dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16, andUint32, orUint32, xorUint32, subUint32, addUint32, loadUint32, storeUint32, getUint32, setUint32, exchangeUint32, compareUint32, andUint16, orUint16, xorUint16, subUint16, addUint16, loadUint16, storeUint16, getUint16, setUint16, exchangeUint16, compareUint16, andUint8, orUint8, xorUint8, subUint8, addUint8, loadUint8, storeUint8, getUint8, setUint8, exchangeUint8, compareUint8, andInt32, orInt32, xorInt32, subInt32, addInt32, loadInt32, storeInt32, getInt32, setInt32, exchangeInt32, compareInt32, andInt16, orInt16, xorInt16, subInt16, addInt16, loadInt16, storeInt16, getInt16, setInt16, exchangeInt16, compareInt16, andInt8, orInt8, xorInt8, subInt8, addInt8, loadInt8, storeInt8, getInt8, setInt8, exchangeInt8, compareInt8, UI, OnscreenCanvas, OffscreenCanvas, WebGLShader, VertexShader, FragmentShader, Object3, Uint8Array, Int8Array, Uint8ClampedArray, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array] = [];
  [bc = new BroadcastChannel("0ptr"), textEncoder = new TextEncoder(), textDecoder = new TextDecoder(), selfName = self.name, isWindow = typeof document !== "undefined" && document !== null, isBridge = /bridge/i.test(selfName), isThread = /thread/i.test(selfName), threadId = isThread && parseInt(selfName.match(/\d+/)), now = Date.now(), pnow = performance.now(), resolvs = new WeakMap(), replies = new Object(), objects = new Object(), workers = new self.Array(), littleEnd = new self.Uint8Array(self.Uint32Array.of(0x01).buffer)[0], TypedArray = Object.getPrototypeOf(self.Uint8Array), GLContext = typeof WebGL2RenderingContext !== "undefined" && WebGL2RenderingContext !== null ? WebGL2RenderingContext : WebGLRenderingContext];
  resolvFind = function(id, retry = 0) {
    var i, ptri;
    i = HINDEX_RESOLV_ID + Atomics.load(p32, 1);
    ptri = 0;
    //error id, retry
    while (i > 0) {
      if (id === Atomics.load(p32, i)) {
        ptri = Atomics.load(p32, ptri + HINDEX_PTRI);
        break;
      }
      i -= HEADERS_LENGTH;
    }
    if (!ptri) {
      if (isBridge) {
        ptri = Atomics.add(p32, 1, HEADERS_LENGTH);
        Atomics.store(p32, ptri + HINDEX_RESOLV_ID, id);
        Atomics.store(p32, ptri + HINDEX_PTRI, ptri);
        return ptri;
      }
      Atomics.wait(p32, 3, 0, 20);
      if (retry > 10) {
        throw /TOO_MANY_TRIED_TO_FIND/;
      }
      return resolvFind(id, ++retry);
    }
    return ptri;
  };
  //else if isBridge then return ptri

  //unless Atomics.load p32, ptri + HINDEX_LOCKFREE
  //Atomics.wait p32, ptri + HINDEX_LOCKFREE, 1, 100

  //return ptri
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
        return Atomics.wait(p32, ptri + HINDEX_LOCKFREE, 1);
      } else {
        return Atomics.wait(p32, isThread ? 4 : 3);
      }
    };
    unlock = function(ptri) {
      if (ptri) {
        Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
        Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
      }
      return Atomics.notify(p32, isThread ? 3 : 4);
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
    var Matrix4f, UniformMatrix4fv;
    Object.defineProperties(Object.prototype, {
      toArray: {
        value: function() {
          return Object.values(this);
        }
      }
    });
    Object.defineProperties(TypedArray, {
      from: {
        value: function() {
          var array, i;
          array = new this(arguments[0].length);
          if (isBridge) {
            for (i in array) {
              array[i] = arguments[0][i];
            }
            unlock();
          } else {
            lock();
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
            unlock();
          } else {
            lock();
          }
          return array;
        }
      },
      at: {
        value: function(ptri) {
          var byteOffset, length;
          if (!(length = Atomics.load(p32, ptri + HINDEX_LENGTH))) {
            return;
          }
          byteOffset = Atomics.load(p32, ptri + HINDEX_BYTEOFFSET);
          return new this(this.buffer, byteOffset, length, ptri);
        }
      }
    });
    Object.defineProperties(TypedArray.prototype, {
      subarray: {
        //part of this
        value: function(begin = 0, end = this.length) {
          return new this.constructor(this.buffer, this.byteOffset + (this.BYTES_PER_ELEMENT * begin), end - begin);
        }
      },
      sub: {
        value: function(byteOffset = 0, length) {
          return new this.TypedArray(this.buffer, this.byteOffset + byteOffset, length);
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
        value: function(byteOffset = 0, length, ArrayInstance = this.TypedArray) {
          var array, buffer, detached;
          array = this.sub(byteOffset, length);
          buffer = new ArrayBuffer(length * this.BYTES_PER_ELEMENT);
          detached = new ArrayInstance(buffer);
          detached.set(array);
          return detached;
        }
      },
      needsUpdate: {
        get: function() {
          return Atomics.load(p32, this.ptri + HINDEX_NEEDSUPDATE);
        },
        set: function(v) {
          return Atomics.store(p32, this.ptri + HINDEX_NEEDSUPDATE, v);
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
          var index, iterate, length, ptri, total;
          ptri = resolvs.get(this);
          length = -1 + Atomics.load(p32, ptri + HINDEX_LENGTH);
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
                Atomics.wait(p32, 3, 0, 20);
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
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Int8Array = class Int8Array extends self.Int8Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                si8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              si8.set(arg0, byteOffset);
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
                si8.set(arg0, byteOffset);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Uint8ClampedArray = class Uint8ClampedArray extends self.Uint8ClampedArray {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                cu8.set(arg0, byteOffset);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              cu8.set(arg0, byteOffset);
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
                cu8.set(arg0, byteOffset);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Uint16Array = class Uint16Array extends self.Uint16Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                u16.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              u16.set(arg0, byteOffset / bpel);
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
                u16.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Int16Array = class Int16Array extends self.Int16Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                i16.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              i16.set(arg0, byteOffset / bpel);
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
                i16.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Uint32Array = class Uint32Array extends self.Uint32Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                u32.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              u32.set(arg0, byteOffset / bpel);
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
                u32.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Int32Array = class Int32Array extends self.Int32Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
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
                i32.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              i32.set(arg0, byteOffset / bpel);
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
                i32.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Float32Array = class Float32Array extends self.Float32Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
              byteOffset = malloc(arg0.byteLength, bpel);
              if (arg0.buffer === objbuf) {
                ui8.copyWithin(byteOffset, arg0.byteOffset, arg0.byteOffset + arg0.byteLength);
              } else {
                f32.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              f32.set(arg0, byteOffset / bpel);
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
                f32.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    Float64Array = class Float64Array extends self.Float64Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                f64.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              f64.set(arg0, byteOffset / bpel);
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
                f64.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    BigInt64Array = class BigInt64Array extends self.BigInt64Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                i64.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              i64.set(arg0, byteOffset / bpel);
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
                i64.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
      }

    };
    BigUint64Array = class BigUint64Array extends self.BigUint64Array {
      set(value, index = 0) {
        var end, start, target;
        if (value.buffer === this.buffer) {
          target = this.byteOffset + index * this.BYTES_PER_ELEMENT;
          start = value.byteOffset;
          end = start + value.byteLength;
          ui8.copyWithin(target, start, end);
        } else {
          super.set(value, index);
        }
        return this;
      }

      constructor(arg0, byteOffset, length, ptri) {
        var arg0ByteLength, arg0Length, arg0Offset, argc, bpel, byteLength, copyEnd, copyStart, nextByteLength;
        ptri = ptri || resolvCall();
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
                u64.set(arg0, byteOffset / bpel);
              }
            } else if (Array.isArray) {
              // new TypedArray( [ 2, 4, 1 ] )

              //Atomics.wait p32, 4, 0, 2240; #testing locks
              length = arg0.length;
              byteLength = length * bpel;
              byteOffset = malloc(byteLength, bpel);
              u64.set(arg0, byteOffset / bpel);
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
                u64.set(arg0, byteOffset / bpel);
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
          Atomics.store(p32, ptri + HINDEX_LENGTH, length);
          Atomics.store(p32, ptri + HINDEX_BYTEOFFSET, byteOffset);
          Atomics.store(p32, ptri + HINDEX_BYTELENGTH, byteLength);
          Atomics.store(p32, ptri + HINDEX_LOCKFREE, 1);
          Atomics.notify(p32, ptri + HINDEX_LOCKFREE);
        }
        // WeakMap -> {TypedArray} => ptri
        resolvs.set(Object.defineProperty(this, "ptri", {
          value: ptri
        }), ptri);
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
    Matrix4f = class Matrix4f extends Float32Array {};
    UniformMatrix4fv = (function() {
      class UniformMatrix4fv extends Matrix4f {
        static fromUniform(gl, program, uniform) {
          var mat4;
          mat4 = new this(this.byteLength / 4);
          Object.defineProperties(mat4, {
            gl: {
              value: gl
            },
            program: {
              value: program
            },
            uniform: {
              value: uniform
            },
            name: {
              value: uniform.name
            }
          });
          mat4.set(gl.getUniform(program, uniform.location));
          return mat4;
        }

        translateSelf(tx = 0, ty = 0, tz = 0) {
          return this.multiplySelf(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
        }

        rotateSelf(rx = 0, ry = 0, rz = 0) {
          var c, s;
          if (rx) {
            c = Math.cos(rx);
            s = Math.sin(rx);
            this.multiplySelf(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
          }
          if (ry) {
            c = Math.cos(ry);
            s = Math.sin(ry);
            this.multiplySelf(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
          }
          if (rz) {
            c = Math.cos(rz);
            s = Math.sin(rz);
            this.multiplySelf(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          }
          return this;
        }

        scaleSelf(sx, sy, sz) {
          if (sz == null) {
            sz = (sy != null ? sy : sy = (sx != null ? sx : sx = 1));
          }
          return this.multiplySelf(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
        }

        multiplySelf(n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44) {
          var m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44;
          [m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44] = Object.values(this);
          
          //? Cij = mi1 * n1j  +  mi2 * n2j  +  mi3 * n3j  +  mi4 * n4j 
          return this.set(self.Float32Array.of(m11 * n11 + m12 * n21 + m13 * n31 + m14 * n41, m21 * n11 + m22 * n21 + m23 * n31 + m24 * n41, m31 * n11 + m32 * n21 + m33 * n31 + m34 * n41, m41 * n11 + m42 * n21 + m43 * n31 + m44 * n41, m11 * n12 + m12 * n22 + m13 * n32 + m14 * n42, m21 * n12 + m22 * n22 + m23 * n32 + m24 * n42, m31 * n12 + m32 * n22 + m33 * n32 + m34 * n42, m41 * n12 + m42 * n22 + m43 * n32 + m44 * n42, m11 * n13 + m12 * n23 + m13 * n33 + m14 * n43, m21 * n13 + m22 * n23 + m23 * n33 + m24 * n43, m31 * n13 + m32 * n23 + m33 * n33 + m34 * n43, m41 * n13 + m42 * n23 + m43 * n33 + m44 * n43, m11 * n14 + m12 * n24 + m13 * n34 + m14 * n44, m21 * n14 + m22 * n24 + m23 * n34 + m24 * n44, m31 * n14 + m32 * n24 + m33 * n34 + m34 * n44, m41 * n14 + m42 * n24 + m43 * n34 + m44 * n44));
        }

        set(set) {
          this.gl.uniformMatrix4fv(this.uniform.location, false, set);
          super.set(set);
          return this;
        }

        perspective(zNear, zFar, right, bottom, left = 0, top = 0, yFov = 60) {
          var f, rangeInv;
          [this.near, this.far, this.right, this.bottom, this.left, this.top, this.fovy] = [zNear, zFar, right, bottom, left, top, yFov];
          f = Math.tan(Math.PI / 2 - yFov / 2);
          rangeInv = 1.0 / (zNear - zFar);
          this.set(self.Float32Array.of(f / this.aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (zNear + zFar) * rangeInv, -1, 0, 0, (zNear * zFar) * rangeInv * 2, 0));
          this.gl.viewport(this.left, this.top, this.width, this.height);
          this.translateSelf(0, 0, -500);
          this.rotateSelf(Math.PI, 0, 0);
          this.scaleSelf(1, 1, 1);
          return this;
        }

        orthographic(zNear, zFar, right, bottom, left = 0, top = 0) {
          var depthRatio, heightRatio, sx, sy, sz, tx, ty, tz, widthRatio;
          [this.near, this.far, this.right, this.bottom, this.left, this.top] = [zNear, zFar, right, bottom, left, top];
          widthRatio = 1 / (this.right - this.left);
          heightRatio = 1 / (this.top - this.bottom);
          depthRatio = 1 / (this.far - this.near);
          sx = 2 * widthRatio;
          sy = 2 * heightRatio;
          sz = -2 * depthRatio;
          tz = -(this.near + this.far) * depthRatio;
          tx = -(this.right + this.left) * widthRatio;
          ty = -(this.bottom + this.top) * heightRatio;
          this.set([sx, 0, 0, tx, 0, sy, 0, ty, 0, 0, sz, tz, 0, 0, 0, 1]);
          return this;
        }

      };

      UniformMatrix4fv.byteLength = 24 * 4;

      UniformMatrix4fv.prototype.INDEX_LEFT = 16;

      UniformMatrix4fv.prototype.INDEX_TOP = 17;

      UniformMatrix4fv.prototype.INDEX_RIGHT = 18;

      UniformMatrix4fv.prototype.INDEX_BOTTOM = 19;

      UniformMatrix4fv.prototype.INDEX_FOVY = 21;

      UniformMatrix4fv.prototype.INDEX_NEAR = 22;

      UniformMatrix4fv.prototype.INDEX_FAR = 23;

      UniformMatrix4fv.prototype.INDEX_M11 = 0;

      UniformMatrix4fv.prototype.INDEX_M12 = 1;

      UniformMatrix4fv.prototype.INDEX_M13 = 2;

      UniformMatrix4fv.prototype.INDEX_M14 = 3;

      UniformMatrix4fv.prototype.INDEX_M21 = 4;

      UniformMatrix4fv.prototype.INDEX_M22 = 5;

      UniformMatrix4fv.prototype.INDEX_M23 = 6;

      UniformMatrix4fv.prototype.INDEX_M24 = 7;

      UniformMatrix4fv.prototype.INDEX_M31 = 8;

      UniformMatrix4fv.prototype.INDEX_M32 = 9;

      UniformMatrix4fv.prototype.INDEX_M33 = 10;

      UniformMatrix4fv.prototype.INDEX_M34 = 11;

      UniformMatrix4fv.prototype.INDEX_M41 = 12;

      UniformMatrix4fv.prototype.INDEX_M42 = 13;

      UniformMatrix4fv.prototype.INDEX_M43 = 14;

      UniformMatrix4fv.prototype.INDEX_M44 = 15;

      Object.defineProperties(UniformMatrix4fv.prototype, {
        fovy: {
          get: function() {
            return this[this.INDEX_FOVY];
          },
          set: function(v) {
            return this[this.INDEX_FOVY] = v;
          }
        },
        near: {
          get: function() {
            return this[this.INDEX_NEAR];
          },
          set: function(v) {
            return this[this.INDEX_NEAR] = v;
          }
        },
        far: {
          get: function() {
            return this[this.INDEX_FAR];
          },
          set: function(v) {
            return this[this.INDEX_FAR] = v;
          }
        },
        left: {
          get: function() {
            return this[this.INDEX_LEFT];
          },
          set: function(v) {
            return this[this.INDEX_LEFT] = v;
          }
        },
        top: {
          get: function() {
            return this[this.INDEX_TOP];
          },
          set: function(v) {
            return this[this.INDEX_TOP] = v;
          }
        },
        right: {
          get: function() {
            return this[this.INDEX_RIGHT];
          },
          set: function(v) {
            return this[this.INDEX_RIGHT] = v;
          }
        },
        bottom: {
          get: function() {
            return this[this.INDEX_BOTTOM];
          },
          set: function(v) {
            return this[this.INDEX_BOTTOM] = v;
          }
        },
        xTranslation: {
          get: function() {
            return this[this.INDEX_M41];
          },
          set: function(v) {
            return this[this.INDEX_M41] = v;
          }
        },
        yTranslation: {
          get: function() {
            return this[this.INDEX_M42];
          },
          set: function(v) {
            return this[this.INDEX_M42] = v;
          }
        },
        zTranslation: {
          get: function() {
            return this[this.INDEX_M43];
          },
          set: function(v) {
            return this[this.INDEX_M43] = v;
          }
        },
        matrix: {
          get: function() {
            return new self.Float32Array(this.subarray(0, 16));
          }
        },
        width: {
          get: function() {
            return this.right - this.left;
          }
        },
        height: {
          get: function() {
            return this.bottom - this.top;
          }
        },
        aspect: {
          get: function() {
            return this.width / this.height;
          }
        },
        location: {
          get: function() {
            return this.uniform.location;
          }
        },
        currentValue: {
          get: function() {
            return this.gl.getUniform(this.program, this.location);
          }
        },
        m11: {
          get: function() {
            return this[this.INDEX_M11];
          }
        },
        m21: {
          get: function() {
            return this[this.INDEX_M21];
          }
        },
        m31: {
          get: function() {
            return this[this.INDEX_M31];
          }
        },
        m41: {
          get: function() {
            return this[this.INDEX_M41];
          }
        },
        m12: {
          get: function() {
            return this[this.INDEX_M12];
          }
        },
        m22: {
          get: function() {
            return this[this.INDEX_M22];
          }
        },
        m32: {
          get: function() {
            return this[this.INDEX_M32];
          }
        },
        m42: {
          get: function() {
            return this[this.INDEX_M42];
          }
        },
        m13: {
          get: function() {
            return this[this.INDEX_M13];
          }
        },
        m23: {
          get: function() {
            return this[this.INDEX_M23];
          }
        },
        m33: {
          get: function() {
            return this[this.INDEX_M33];
          }
        },
        m43: {
          get: function() {
            return this[this.INDEX_M43];
          }
        },
        m14: {
          get: function() {
            return this[this.INDEX_M14];
          }
        },
        m24: {
          get: function() {
            return this[this.INDEX_M24];
          }
        },
        m34: {
          get: function() {
            return this[this.INDEX_M34];
          }
        },
        m44: {
          get: function() {
            return this[this.INDEX_M44];
          }
        }
      });

      return UniformMatrix4fv;

    }).call(this);
    WebGLShader = (function() {
      class WebGLShader extends Uint8Array {
        constructor(source) {
          var srclen;
          if (arguments.length > 1) {
            super(...arguments);
          } else {
            srclen = source.length;
            srclen = srclen + srclen % 4;
            super(WebGLShader.byteLength + srclen).source = source;
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

      WebGLShader.byteLength = 4 * 4;

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
            if (!this.length) {
              return "";
            }
            return textDecoder.decode(this.detach(this.OFFSET_SOURCE_BEGIN, this.length));
          },
          set: function(source) {
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

      VertexShader.DEFAULT_SOURCE =  `
                attribute vec3     a_Position;
                attribute vec4     a_Color;
                uniform   float    u_PointSize;
                uniform   mat4     u_ViewMatrix;
                varying   vec4     v_Color;

                void main() {
                    gl_Position  =  u_ViewMatrix * vec4(a_Position, 1.0);
                    gl_PointSize =  u_PointSize;
                    v_Color      =  a_Color;
                }
            ` ;

      return VertexShader;

    }).call(this);
    FragmentShader = (function() {
      class FragmentShader extends WebGLShader {};

      FragmentShader.DEFAULT_SOURCE =  `
                precision highp    float;
                varying   vec4     v_Color;

                void main() {
                    gl_FragColor = v_Color;
                }
            ` ;

      return FragmentShader;

    }).call(this);
    OnscreenCanvas = (function() {
      class OnscreenCanvas extends Float32Array {
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

        malloc(shape) {
          var start;
          start = this.addUint32(this.INDEX_POINTCOUNT, shape.pointCount);
          Atomics.store(p32, shape.ptri + HINDEX_PARENT, this.ptri);
          Atomics.store(p32, shape.ptri + HINDEX_ATTRIBSOFFSET, start * 3 * 4);
          Atomics.store(p32, shape.ptri + HINDEX_ATTRIBSLENGTH, shape.pointCount * this.attribLength);
          return this.drawBuffer.sub(start * 3 * 4, shape.pointCount * this.attribLength);
        }

        defineAttributes() {
          var a, a_Color, a_Position, j, len, ref, results;
          a_Position = this.activeAttributes.find((a) => {
            return a.name === "a_Position";
          });
          a_Color = this.activeAttributes.find((a) => {
            return a.name === "a_Color";
          });
          ref = this.activeAttributes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            a = ref[j];
            switch (a.type) {
              case 35664:
              case "FLOAT_VEC2":
                results.push(this.attribLength += 2);
                break;
              case 35665:
              case "FLOAT_VEC3":
                results.push(this.attribLength += 3);
                break;
              case 35666:
              case "FLOAT_VEC4":
                results.push(this.attribLength += 4);
                break;
              default:
                results.push(void 0);
            }
          }
          return results;
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
                    get: UniformMatrix4fv.fromUniform.bind(UniformMatrix4fv, this, program, uniform),
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

        upload() {
          var a_Color, a_Position, base, j, len, ref, results, u;
          a_Position = this.activeAttributes.find((a) => {
            return a.name === "a_Position";
          });
          a_Color = this.activeAttributes.find((a) => {
            return a.name === "a_Color";
          });
          this.gl.bufferData(this.gl.ARRAY_BUFFER, this.drawBuffer, this.gl.STATIC_DRAW);
          this.gl.enableVertexAttribArray(a_Position.location);
          this.gl.enableVertexAttribArray(a_Color.location);
          this.gl.vertexAttribPointer(a_Position.location, 3, this.gl.FLOAT, false, 28, 0);
          this.gl.vertexAttribPointer(a_Color.location, 4, this.gl.FLOAT, false, 28, 12);
          ref = this.activeUniforms;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            u = ref[j];
            results.push(typeof (base = this.gl[u.name]).upload === "function" ? base.upload() : void 0);
          }
          return results;
        }

        reload() {
          var info, program;
          program = this.gl.createProgram();
          this.vertexShader = new VertexShader(VertexShader.DEFAULT_SOURCE);
          this.fragmentShader = new FragmentShader(FragmentShader.DEFAULT_SOURCE);
          this.vertexShader.attach(this.gl, program);
          this.fragmentShader.attach(this.gl, program);
          this.gl.linkProgram(program);
          this.gl.useProgram(program);
          this.gl.enable(this.gl.BLEND);
          this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.DST_COLOR);
          this.gl.blendEquation(this.gl.FUNC_ADD);
          this.gl.enable(this.gl.DEPTH_TEST);
          this.gl.depthFunc(this.gl.LEQUAL);
          this.gl.depthMask(false);
          this.gl.clearDepth(1);
          this.gl.enable(this.gl.CULL_FACE);
          this.gl.cullFace(this.gl.BACK);
          this.gl.frontFace(this.gl.CCW);
          if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            info = this.gl.getProgramInfoLog(program);
            throw `Could not compile WebGL program. \n${info}`;
          }
          this.program = program;
          if (!this.hasBinding) {
            this.glBuffer || (this.glBuffer = this.gl.createBuffer());
            this.hasBinding = this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer) || 1;
          }
          this.defineUniforms();
          this.defineAttributes();
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
            return this.render();
          });
          this.canvas.dispatchEvent(new CustomEvent("webglcontextrestored"));
          return this;
        }

        oncontextlost() {}

        oncontextrestored() {}

        onwebglcontextlost() {}

        onwebglcontextrestored() {}

        onanimationframe() {}

        onupdate() {}

        onrender() {
          var ptri;
          ptri = Atomics.load(p32, 1);
          while (ptri > HEADERS_LENGTH) {
            //if  Atomics.and p32, ptri + HINDEX_NEEDSUPDATE, 0
            if (Atomics.load(p32, ptri + HINDEX_NEEDSUPDATE, 0)) {
              if (isBridge) {
                log("update", ptri);
                unlock();
              } else {
                //log "updating"
                this.onupdate();
              }
            }
            ptri -= HEADERS_LENGTH;
          }
          if (isThread) {
            lock();
            return this.onrender();
          }
        }

        render() {
          var commit;
          if (!this.hasContext) {
            return;
          }
          if (!isBridge) {
            return;
          }
          return (commit = (now) => {
            if (this.hasContext && this.hasBinding) {
              this.onrender();
              this.onanimationframe(this.gl, this.addFrame(now));
              this.gl.drawArrays(this.gl.POINTS, 0, this.pointCount);
              this.gl.drawArrays(this.gl.LINES, 0, this.pointCount);
              this.gl.drawArrays(this.gl.TRIANGLES, 0, this.pointCount);
            }
            return requestAnimationFrame(commit);
          })(0);
        }

        constructor() {
          super(OnscreenCanvas.byteLength).getContext("webgl2");
        }

        getContext(type) {
          if (isThread) {
            log(this.onupdate + "");
            //lock()
            //@onrender()
            return 1;
          } else {
            replies[this.ptri] = new WeakRef((data) => {
              return this.setContext(data.canvas.getContext(type, {
                powerPreference: "high-performance"
              }));
            });
            return postMessage({
              onscreen: {ptri: this.ptri}
            });
          }
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

      OnscreenCanvas.prototype.INDEX_ATTRIB_LENGTH = 12;

      OnscreenCanvas.prototype.OFFSET_READBUFFER = 16 * 4;

      OnscreenCanvas.prototype.OFFSET_DRAWBUFFER = 1024 * 4;

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
            var v;
            v = VertexShader.at(this.loadUint32(this.INDEX_VSHADER));
            log(v, this.loadUint32(this.INDEX_VSHADER));
            return v;
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_VSHADER, v.ptri);
          }
        },
        fragmentShader: {
          get: function() {
            return FragmentShader.at(this.loadUint32(this.INDEX_FSHADER));
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_FSHADER, v.ptri);
          }
        },
        drawBuffer: {
          get: function() {
            return new self.Float32Array(this.buffer, this.byteOffset + this.OFFSET_DRAWBUFFER, this.pointCount * this.attribLength);
          }
        },
        readBuffer: {
          get: function() {
            return new self.Float32Array(this.buffer, this.byteOffset + this.OFFSET_READBUFFER, this.pointCount * 3);
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
        attribLength: {
          get: function() {
            return this.loadUint32(this.INDEX_ATTRIB_LENGTH);
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_ATTRIB_LENGTH, v);
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
              attrib.location = this.gl.getAttribLocation(this.program, attrib.name);
              attrib.vertexSize = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_SIZE);
              attrib.vertexType = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_TYPE);
              attrib.vertexKind = k.at(v.indexOf(attrib.vertexType));
              attrib.isNormalized = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
              attrib.stride = this.gl.getVertexAttrib(i, this.gl.VERTEX_ATTRIB_ARRAY_STRIDE);
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
    return Object3 = (function() {
      class Object3 extends Float32Array {
        constructor(options = {
            points: []
          }) {
          var byteLength;
          byteLength = Object3.byteLength + options.points.length * 4;
          super(byteLength);
          if (isBridge) {
            this.uuid = randomUUID();
          }
        }

        updateIfNeeded(gl) {
          return log(1, "update if needed");
        }

      };

      Object3.byteLength = 104;

      Object3.prototype.OFFSET_UUID = 0;

      Object3.prototype.OFFSET_POSITION = 36;

      Object3.prototype.OFFSET_ROTATION = 52;

      Object3.prototype.OFFSET_SCALE = 68;

      Object3.prototype.OFFSET_COLOR = 84;

      Object3.prototype.OFFSET_DRAWBUFFER = 100;

      Object3.prototype.INDEX_DRAWBUFFER = 100 / 4;

      Object3.prototype.OFFSET_POINTS = Object3.byteLength;

      Object.defineProperties(Object3.prototype, {
        uuid: {
          get: function() {
            return textDecoder.decode(this.detach(this.OFFSET_UUID, 36, Uint8Array));
          },
          set: function(v) {
            return this.set(textEncoder.encode(v), this.OFFSET_UUID);
          }
        },
        points: {
          get: function() {
            return new Float32Array(this.buffer, this.byteOffset + this.OFFSET_POINTS, this.pointsLength);
          },
          set: function(v) {
            return this.points.set(v.subarray(0, this.pointsLength));
          }
        },
        color: {
          get: function() {
            return new Float32Array(this.buffer, this.byteOffset + this.OFFSET_COLOR, 4);
          },
          set: function(v) {
            return this.color.set(v);
          }
        },
        position: {
          get: function() {
            return new Float32Array(this.buffer, this.byteOffset + this.OFFSET_POSITION, 3);
          },
          set: function(v) {
            return this.position.set(v);
          }
        },
        rotation: {
          get: function() {
            return new Float32Array(this.buffer, this.byteOffset + this.OFFSET_ROTATION, 3);
          },
          set: function(v) {
            return this.rotation.set(v);
          }
        },
        scale: {
          get: function() {
            return new Float32Array(this.buffer, this.byteOffset + this.OFFSET_SCALE, 3);
          },
          set: function(v) {
            return this.scale.set(v);
          }
        },
        pointCount: {
          get: function() {
            return this.pointsLength / 3;
          }
        },
        pointsLength: {
          get: function() {
            return (this.byteLength - this.OFFSET_POINTS) / 4;
          }
        },
        drawBuffer: {
          get: function() {
            return this.getUint32(this.INDEX_DRAWBUFFER);
          },
          set: function(v) {
            return this.storeUint32(this.INDEX_DRAWBUFFER, v);
          }
        }
      });

      return Object3;

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
      var data, ref, req, uuid;
      ref = e.data;
      for (req in ref) {
        data = ref[req];
        switch (req) {
          case "setup":
            uuid = randomUUID();
            blobURL = data.blobURL;
            initMemory(data);
            regenerate();
            postMessage({
              register: {selfName, isBridge, isThread, threadId, now, pnow, uuid}
            });
            break;
          case "onscreen":
            return replies[data.ptri].deref()(data);
            setTimeout(() => {
              var ptri, results;
              ptri = Atomics.load(p32, 1);
              results = [];
              while (ptri > HEADERS_LENGTH) {
                log({
                  ptri,
                  parent: p32[ptri + HINDEX_PARENT],
                  length: p32[ptri + HINDEX_LENGTH],
                  resolvId: p32[ptri + HINDEX_RESOLV_ID],
                  byteOffset: p32[ptri + HINDEX_BYTEOFFSET],
                  byteLength: p32[ptri + HINDEX_BYTELENGTH]
                });
                results.push(ptri -= HEADERS_LENGTH);
              }
              return results;
            }, 1000);
        }
      }
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
