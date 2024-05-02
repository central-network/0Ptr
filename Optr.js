self.name = "window";

(self.init = function() {
  var ATTRIBS_BYTELENGTH, ATTRIBS_LENGTH, BPE, BYTELENGTH_GLBUFFER, Color, Draw, FragmentShader, Frustrum, HEADER_BEGIN, HEADER_BYTELENGTH, HEADER_BYTEOFFSET, HEADER_CLASSINDEX, HEADER_FRAGMENTED, HEADER_INDEXCOUNT, HEADER_ITERLENGTH, HEADER_ITEROFFSET, HEADER_LENGTH, HEADER_NEEDRECALC, HEADER_NEEDUPLOAD, HEADER_PARENTPTRI, HEADER_RESVINDEX1, HEADER_RESVINDEX2, HEADER_RESVINDEX4, HEADER_TRANSLATED, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_CLASSID, HINDEX_ISGL, HINDEX_ITER_COUNT, HINDEX_LENGTH, HINDEX_LOCATED, HINDEX_NEXT_COLORI, HINDEX_NEXT_VERTEXI, HINDEX_PAINTED, HINDEX_PARENT, HINDEX_RESV0, HINDEX_RESV1, HINDEX_UPDATED, INNER_HEIGHT, INNER_WIDTH, LE, Matter, OFFSET_CPU, OFFSET_GPU, OFFSET_PTR, PointSize, Pointer, Position, RADIANS_PER_DEGREE, RATIO_ASPECT, RATIO_PIXEL, Rotation, STATE_LOCKED, STATE_READY, STATE_UNLOCKED, STATE_WORKING, Scale, Shader, Space, THREADS_BEGIN, THREADS_COUNT, THREADS_NULL, THREADS_READY, THREADS_STATE, Texture, UV, Vector3, VertexShader, Vertices, addResvFloat32, addResvUint16, addResvUint32, addResvUint8, bindgetFloat32, bindgetUint32, bindgetUint8, bindsetFloat32, bindsetUint32, bindsetUint8, buffer, buffers, classes, defines, draws, dvw, error, f32, fShader, fillFloat32, fillUint32, fillUint8, findChild, findChilds, findChildsPtri, frustrum, gBuffer, getAllocs, getBegin, getByteLength, getByteOffset, getChilds, getChildsPtri, getClass, getClassIndex, getFloat32, getFragmented, getIndex, getIterLength, getIterOffset, getLength, getNeedRecalc, getNeedUpload, getParent, getParentPtri, getResvFloat32, getResvUint16, getResvUint32, getResvUint8, getTranslated, getUint32, getUint8, gl, hitFragmented, hitIterOffset, hitNeedRecalc, hitNeedUpload, hitTranslated, i32, isThread, isWindow, lock, log, malloc2, newFloat32Array, newUint32Array, newUint8Array, nextTick, number, orFloat32, orUint32, orUint8, pipe, program, ptrFloat32Array, ptrUint32Array, ptrUint8Array, scripts, setBegin, setByteLength, setByteOffset, setClassIndex, setFloat32, setFragmented, setIterLength, setIterOffset, setLength, setNeedRecalc, setNeedUpload, setParent, setResvFloat32, setResvUint16, setResvUint32, setResvUint8, setTranslated, setUint32, setUint8, setarrayFloat32, setarrayUint32, setarrayUint8, shaders, space, state, subarrayFloat32, subarrayUint32, subarrayUint8, threadId, ticks, u32, ui8, unlock, uuid, vShader, warn, workers;
  isWindow = typeof DedicatedWorkerGlobalScope === "undefined" || DedicatedWorkerGlobalScope === null;
  isThread = isWindow === false;
  pipe = new BroadcastChannel("3dtr");
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
  threadId = null;
  gl = null;
  uuid = null;
  workers = [];
  i32 = null;
  ui8 = null;
  f32 = null;
  u32 = null;
  dvw = null;
  buffer = null;
  space = null;
  draws = [];
  scripts = null;
  program = null;
  vShader = null;
  fShader = null;
  gBuffer = null;
  shaders = [];
  defines = {};
  classes = [];
  buffers = [];
  classes.register = function(Class) {
    var i;
    if (-1 === (i = this.indexOf(Class))) {
      i += this.push(Class);
    }
    return Class.classIndex = i;
  };
  shaders.register = function(WebGLObject) {
    if (!this.includes(WebGLObject)) {
      this.push(WebGLObject);
    }
    return this.indexOf(WebGLObject);
  };
  buffers.register = function(WebGLObject) {
    if (!this.includes(WebGLObject)) {
      this.push(WebGLObject);
    }
    return this.indexOf(WebGLObject);
  };
  ticks = 0;
  frustrum = null;
  RADIANS_PER_DEGREE = Math.PI / 180.0;
  BPE = 4;
  LE = !!(new Uint8Array(Uint16Array.of(1).buffer).at(0));
  THREADS_STATE = 5;
  THREADS_BEGIN = 6;
  THREADS_COUNT = 2 || (typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0);
  INNER_WIDTH = typeof innerWidth !== "undefined" && innerWidth !== null ? innerWidth : 640;
  INNER_HEIGHT = typeof innerHeight !== "undefined" && innerHeight !== null ? innerHeight : 480;
  RATIO_PIXEL = typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1;
  RATIO_ASPECT = INNER_WIDTH / INNER_HEIGHT;
  STATE_READY = 1;
  STATE_LOCKED = 0;
  STATE_WORKING = 3;
  STATE_UNLOCKED = 4;
  THREADS_NULL = 1;
  THREADS_READY = 2;
  OFFSET_GPU = 1000 * 16;
  OFFSET_CPU = 4096 * 4096;
  OFFSET_PTR = 24;
  BYTELENGTH_GLBUFFER = 32 * 1e5;
  HINDEX_LENGTH = 0;
  HINDEX_BYTEOFFSET = HINDEX_LENGTH++; //! must be 0
  HINDEX_BYTELENGTH = HINDEX_LENGTH++;
  HINDEX_CLASSID = HINDEX_LENGTH++;
  HINDEX_PARENT = HINDEX_LENGTH++;
  HINDEX_BEGIN = HINDEX_LENGTH++;
  HINDEX_ISGL = HINDEX_LENGTH++;
  HINDEX_UPDATED = HINDEX_LENGTH++;
  HINDEX_PAINTED = HINDEX_LENGTH++;
  HINDEX_LOCATED = HINDEX_LENGTH++;
  HINDEX_ITER_COUNT = HINDEX_LENGTH++;
  HINDEX_NEXT_COLORI = HINDEX_LENGTH++;
  HINDEX_NEXT_VERTEXI = HINDEX_LENGTH++;
  HINDEX_RESV0 = HINDEX_LENGTH++;
  HINDEX_RESV1 = HINDEX_LENGTH++;
  ATTRIBS_LENGTH = 0;
  ATTRIBS_BYTELENGTH = 0;
  HEADER_INDEXCOUNT = 0;
  HEADER_BYTEOFFSET = 0;
  HEADER_INDEXCOUNT++; //? 0
  HEADER_BYTELENGTH = 1;
  HEADER_INDEXCOUNT++; //? 1
  HEADER_LENGTH = 2;
  HEADER_INDEXCOUNT++; //? 2
  HEADER_BEGIN = 3;
  HEADER_INDEXCOUNT++; //? 3
  HEADER_CLASSINDEX = 4;
  HEADER_INDEXCOUNT++; //? 4
  HEADER_PARENTPTRI = 5;
  HEADER_INDEXCOUNT++; //? 5
  HEADER_ITEROFFSET = 6;
  HEADER_INDEXCOUNT++; //? 6
  HEADER_ITERLENGTH = 7;
  HEADER_INDEXCOUNT++; //? 7
  HEADER_NEEDRECALC = 32;
  HEADER_INDEXCOUNT++; //? 32
  HEADER_NEEDUPLOAD = 33;
  HEADER_TRANSLATED = 34;
  HEADER_FRAGMENTED = 35;
  HEADER_RESVINDEX4 = 9;
  HEADER_INDEXCOUNT++; //? 9 
  HEADER_RESVINDEX2 = 18;
  HEADER_RESVINDEX1 = 27;
  getByteOffset = function(ptri) {
    return u32[ptri];
  };
  setByteOffset = function(ptri, v) {
    return u32[ptri] = v;
  };
  getByteLength = function(ptri) {
    return u32[HEADER_BYTELENGTH + ptri];
  };
  setByteLength = function(ptri, v) {
    return u32[HEADER_BYTELENGTH + ptri] = v;
  };
  getLength = function(ptri) {
    return u32[HEADER_LENGTH + ptri];
  };
  setLength = function(ptri, v) {
    return u32[HEADER_LENGTH + ptri] = v;
  };
  getBegin = function() {
    return u32[HEADER_BEGIN + this];
  };
  getIndex = function(index = 0) {
    return u32[HEADER_BEGIN + this] + index;
  };
  setBegin = function(ptri, v) {
    return u32[HEADER_BEGIN + ptri] = v;
  };
  getClassIndex = function(ptri) {
    return u32[HEADER_CLASSINDEX + ptri];
  };
  setClassIndex = function(ptri, v) {
    return u32[HEADER_CLASSINDEX + ptri] = v;
  };
  getClass = function(ptri) {
    return classes[u32[HEADER_CLASSINDEX + ptri]];
  };
  getParentPtri = function(ptri) {
    return u32[HEADER_PARENTPTRI + ptri];
  };
  setParent = function(ptri) {
    return u32[HEADER_PARENTPTRI + ptri] = this;
  };
  getParent = function() {
    var ptrp;
    return new classes[u32[HEADER_CLASSINDEX + (ptrp = u32[HEADER_PARENTPTRI + this])]](ptrp);
  };
  getChilds = function(ptri = this) {
    var i, list, ptrj;
    ptrj = Atomics.load(u32, 1);
    list = new Array();
    i = 0;
    while (ptrj -= 16) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      list[i] = new classes[u32[HEADER_CLASSINDEX + ptrj]](ptrj);
      i++;
    }
    return list;
  };
  getChildsPtri = function(ptri) {
    var i, list, ptrj;
    ptrj = Atomics.load(u32, 1);
    list = new Array();
    i = 0;
    while (ptrj -= 16) {
      if (ptri - u32[HEADER_PARENTPTRI + ptrj]) {
        continue;
      }
      list[i] = ptrj;
      i++;
    }
    return list;
  };
  findChilds = function(Class) {
    var clsi, i, list, ptri, ptrj;
    ptri = parseInt(this);
    ptrj = Atomics.load(u32, 1);
    clsi = Class.classIndex;
    list = new Array();
    i = 0;
    while (ptrj -= 16) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      list[i] = new classes[clsi](ptrj);
      ++i;
    }
    return list;
  };
  findChild = function(Class) {
    var clsi, ptri, ptrj;
    ptri = parseInt(this);
    ptrj = Atomics.load(u32, 1);
    clsi = Class.classIndex;
    while (ptrj -= 16) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      return new classes[clsi](ptrj);
    }
    return void 0;
  };
  findChildsPtri = function(ptri, test) {
    var ci, i, list, ptrj;
    ptrj = Atomics.load(u32, 1);
    list = new Array();
    i = 0;
    ci = (function() {
      if (test.isPtr) {
        return classes.indexOf(test);
      } else if (test.isPtri) {
        return u32[HEADER_CLASSINDEX + test];
      } else if (!isNaN(test)) {
        return test;
      } else {
        throw /FILTER_TEST_FAILED/;
      }
    })();
    while (ptrj -= 16) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - ci) {
        continue;
      }
      list[i] = ptrj;
      i++;
    }
    return list;
  };
  getAllocs = function() {
    var clsi, i, list, ptrj;
    clsi = this.classIndex;
    ptrj = Atomics.load(u32, 1);
    list = new Array();
    i = 0;
    while (ptrj -= 16) {
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      list[i] = new classes[clsi](ptrj);
      i += 1;
    }
    return list;
  };
  getIterOffset = function(ptri) {
    return u32[HEADER_ITEROFFSET + ptri];
  };
  setIterOffset = function(ptri, v) {
    return u32[HEADER_ITEROFFSET + ptri] = v;
  };
  hitIterOffset = function(ptri) {
    return Atomics.add(u32, HEADER_ITEROFFSET + ptri, u32[HEADER_ITERLENGTH + ptri]);
  };
  getIterLength = function(ptri) {
    return u32[HEADER_ITERLENGTH + ptri];
  };
  setIterLength = function(ptri, v) {
    return u32[HEADER_ITERLENGTH + ptri] = v;
  };
  getNeedRecalc = function(ptri) {
    return ui8[HEADER_NEEDRECALC + ptri * 4];
  };
  setNeedRecalc = function(ptri, v) {
    return ui8[HEADER_NEEDRECALC + ptri * 4] = v;
  };
  hitNeedRecalc = function(ptri) {
    return Atomics.and(ui8, HEADER_NEEDRECALC + ptri * 4, 0);
  };
  getNeedUpload = function(ptri) {
    return ui8[HEADER_NEEDUPLOAD + ptri * 4];
  };
  setNeedUpload = function(ptri, v) {
    return ui8[HEADER_NEEDUPLOAD + ptri * 4] = v;
  };
  hitNeedUpload = function(ptri) {
    return Atomics.and(ui8, HEADER_NEEDUPLOAD + ptri * 4, 0);
  };
  getTranslated = function(ptri) {
    return ui8[HEADER_TRANSLATED + ptri * 4];
  };
  setTranslated = function(ptri, v) {
    return ui8[HEADER_TRANSLATED + ptri * 4] = v;
  };
  hitTranslated = function(ptri) {
    return Atomics.and(ui8, HEADER_TRANSLATED + ptri * 4, 0);
  };
  getFragmented = function(ptri) {
    return ui8[HEADER_FRAGMENTED + ptri * 4];
  };
  setFragmented = function(ptri, v) {
    return ui8[HEADER_FRAGMENTED + ptri * 4] = v;
  };
  hitFragmented = function(ptri) {
    return Atomics.and(ui8, HEADER_FRAGMENTED + ptri * 4, 0);
  };
  getResvUint32 = function(ptri, i) {
    return u32[HEADER_RESVINDEX4 + ptri + i];
  };
  setResvUint32 = function(ptri, i, v) {
    return u32[HEADER_RESVINDEX4 + ptri + i] = v;
  };
  addResvUint32 = function(ptri, i, v) {
    var u;
    u32[HEADER_RESVINDEX4 + ptri + i] = v + (u = u32[HEADER_RESVINDEX4 + ptri + i]);
    return u;
  };
  getResvUint16 = function(ptri, i) {
    return u16[HEADER_RESVINDEX2 + ptri * 2 + i];
  };
  setResvUint16 = function(ptri, i, v) {
    return u16[HEADER_RESVINDEX2 + ptri * 2 + i] = v;
  };
  addResvUint16 = function(ptri, i, v) {
    var u;
    u16[HEADER_RESVINDEX2 + ptri * 2 + i] = v + (u = u16[HEADER_RESVINDEX2 + ptri * 2 + i]);
    return u;
  };
  getResvUint8 = function(i) {
    return ui8[HEADER_RESVINDEX1 + this * 4 + i];
  };
  setResvUint8 = function(i, v) {
    return ui8[HEADER_RESVINDEX1 + this * 4 + i] = v;
  };
  addResvUint8 = function(ptri, i, v) {
    var u;
    ui8[HEADER_RESVINDEX1 + ptri * 4 + i] = v + (u = ui8[HEADER_RESVINDEX1 + ptri * 4 + i]);
    return u;
  };
  getResvFloat32 = function(ptri, i) {
    return f32[HEADER_RESVINDEX4 + ptri + i];
  };
  setResvFloat32 = function(ptri, i, v) {
    return f32[HEADER_RESVINDEX4 + ptri + i] = v;
  };
  addResvFloat32 = function(ptri, i, v) {
    var u;
    f32[HEADER_RESVINDEX4 + ptri + i] = v + (u = f32[HEADER_RESVINDEX4 + ptri + i]);
    return u;
  };
  newFloat32Array = function(byteOffset = 0, length) {
    return new Float32Array(buffer, u32[this] + byteOffset, length || u32[HEADER_LENGTH + this]);
  };
  ptrFloat32Array = function(byteOffset = 0, length) {
    return new Float32Array(buffer, this * 4, length || 16);
  };
  newUint32Array = function(byteOffset = 0, length) {
    return new Uint32Array(buffer, u32[this] + byteOffset, length || u32[HEADER_LENGTH + this]);
  };
  ptrUint32Array = function(byteOffset = 0, length) {
    return new Uint32Array(buffer, this * 4, length || 16);
  };
  newUint8Array = function(byteOffset = 0, length) {
    return new Uint8Array(buffer, u32[this] + byteOffset, length || u32[HEADER_LENGTH + this]);
  };
  ptrUint8Array = function(byteOffset = 0, length) {
    return new Uint8Array(buffer, this * 4, length || 64);
  };
  subarrayFloat32 = function(begin = 0, count) {
    begin += u32[HEADER_BEGIN + this];
    return f32.subarray(begin, begin + count);
  };
  subarrayUint32 = function(begin = 0, count) {
    begin += u32[HEADER_BEGIN + this];
    return u32.subarray(begin, begin + count);
  };
  subarrayUint8 = function(begin = 0, count) {
    begin += u32[this];
    return ui8.subarray(begin, begin + count);
  };
  setFloat32 = function(value, index = 0) {
    return f32[u32[HEADER_BEGIN + this] + index] = value;
  };
  getFloat32 = function(index = 0) {
    return f32[u32[HEADER_BEGIN + this] + index];
  };
  orFloat32 = function(index = 0, fn) {
    var name1;
    return f32[name1 = u32[HEADER_BEGIN + this] + index] || (f32[name1] = fn.call(this));
  };
  fillFloat32 = function(value, start = 0, count) {
    start += u32[HEADER_BEGIN + this];
    f32.fill(value, start, start + count);
    return this;
  };
  bindgetFloat32 = function(index = 0) {
    return function() {
      return f32[u32[HEADER_BEGIN + this] + index];
    };
  };
  bindsetFloat32 = function(index = 0) {
    return function(value) {
      return f32[u32[HEADER_BEGIN + this] + index] = value;
    };
  };
  setarrayFloat32 = function(array, begin = 0) {
    f32.set(array, begin + u32[HEADER_BEGIN + this]);
    return this;
  };
  setUint32 = function(value, index = 0) {
    return u32[u32[HEADER_BEGIN + this] + index] = value;
  };
  getUint32 = function(index = 0) {
    return u32[u32[HEADER_BEGIN + this] + index];
  };
  orUint32 = function(index = 0, fn) {
    var name1;
    return u32[name1 = u32[HEADER_BEGIN + this] + index] || (u32[name1] = fn.call(this));
  };
  fillUint32 = function(value, start = 0, count) {
    start += u32[HEADER_BEGIN + this];
    u32.fill(value, start, start + count);
    return this;
  };
  bindgetUint32 = function(index = 0) {
    return function() {
      return u32[u32[HEADER_BEGIN + this] + index];
    };
  };
  bindsetUint32 = function(index = 0) {
    return function(value) {
      return u32[u32[HEADER_BEGIN + this] + index] = value;
    };
  };
  setarrayUint32 = function(array, begin = 0) {
    u32.set(array, begin + u32[HEADER_BEGIN + this]);
    return this;
  };
  setUint8 = function(value, index = 0) {
    return ui8[u32[this] + index] = value;
  };
  getUint8 = function(index = 0) {
    return ui8[u32[this] + index];
  };
  orUint8 = function(index = 0, fn) {
    var name1;
    return ui8[name1 = u32[this] + index] || (ui8[name1] = fn.call(this));
  };
  fillUint8 = function(value, start = 0, count) {
    start += u32[this];
    ui8.fill(value, start, start + count);
    return this;
  };
  bindgetUint8 = function(index = 0) {
    return function() {
      return ui8[u32[this] + index];
    };
  };
  bindsetUint8 = function(index = 0) {
    return function(value) {
      return ui8[u32[this] + index] = value;
    };
  };
  setarrayUint8 = function(array, begin = 0) {
    ui8.set(array, begin + u32[this]);
    return this;
  };
  state = function(state) {
    if (!arguments.length) {
      return Atomics.load(i32, threadId);
    }
    return Atomics.store(i32, threadId, state);
  };
  nextTick = function() {
    var begin, color, count, draw, end, index, j, len, locate, paint, ptri, ref, shape, test, vertex;
    //log "nextTick:", ++ticks
    ptri = Atomics.load(i32, 1);
    test = 0;
    while (OFFSET_PTR <= (ptri -= 16)) {
      if (!Atomics.load(i32, ptri + HINDEX_ISGL)) {
        continue;
      }
      if (Atomics.load(i32, ptri + HINDEX_UPDATED)) {
        continue;
      }
      locate = Atomics.load(i32, ptri + HINDEX_LOCATED);
      paint = Atomics.load(i32, ptri + HINDEX_PAINTED);
      if (paint && locate) {
        continue;
      }
      test = 1;
      index = Atomics.add(i32, ptri + HINDEX_NEXT_VERTEXI, 1);
      count = Atomics.load(i32, ptri + HINDEX_ITER_COUNT);
      if (index <= count) {
        shape = new Shape(ptri);
        begin = index * 3;
        end = begin + 3;
        vertex = shape.vertex(index);
        color = shape.color;
        ref = shape.children;
        for (j = 0, len = ref.length; j < len; j++) {
          draw = ref[j];
          draw.vertex(index).set(vertex);
          draw.color(index).set(color);
          Atomics.store(i32, draw.ptri + HINDEX_UPDATED, 0);
        }
      }
      if (index - count) {
        
        //log ptri, index 
        continue;
      }
      if (!locate) {
        Atomics.store(i32, ptri + HINDEX_LOCATED, 1);
      }
      if (!paint) {
        Atomics.store(i32, ptri + HINDEX_PAINTED, 1);
      }
      Atomics.store(i32, ptri + HINDEX_UPDATED, 1);
    }
    if (test === 1) {
      return nextTick();
    }
    lock();
    return nextTick();
  };
  lock = function() {
    state(STATE_LOCKED);
    return Atomics.wait(i32, threadId);
  };
  unlock = function() {
    var j, len, results, w;
    results = [];
    for (j = 0, len = workers.length; j < len; j++) {
      w = workers[j];
      if (!(w.state === STATE_LOCKED)) {
        continue;
      }
      Atomics.store(i32, w.threadId, STATE_READY);
      results.push(Atomics.notify(i32, w.threadId, 1));
    }
    return results;
  };
  if (isWindow) {
    buffer = new SharedArrayBuffer(1e8);
    i32 = new Int32Array(buffer);
    u32 = new Uint32Array(buffer);
    f32 = new Float32Array(buffer);
    dvw = new DataView(buffer);
    ui8 = new Uint8Array(buffer);
    scripts = Array.from(document.querySelectorAll("script"));
    state = function(state) {
      if (!state) {
        return Atomics.load(i32, THREADS_STATE);
      }
      return Atomics.store(i32, THREADS_STATE, state);
    };
    Atomics.add(u32, 0, 16 * 1e5);
    Atomics.add(u32, 1, 16);
    state(THREADS_NULL);
  }
  malloc2 = function(constructor, byteLength) {
    var BYTES_PER_ELEMENT, allocLength, begin, byteOffset, classId, length, ptri;
    ptri = Atomics.add(i32, 1, 16);
    classId = constructor.classId;
    if (byteLength != null ? byteLength : byteLength = constructor.byteLength) {
      BYTES_PER_ELEMENT = constructor.TypedArray.BYTES_PER_ELEMENT || constructor.BYTES_PER_ELEMENT;
      length = (allocLength = byteLength) / BYTES_PER_ELEMENT;
      byteLength += 8 - (byteLength % 8);
      byteOffset = Atomics.add(i32, 0, byteLength);
      begin = byteOffset / BYTES_PER_ELEMENT;
      Atomics.add(i32, 0, 8 - byteLength % 8);
      Atomics.store(i32, ptri + HINDEX_BYTEOFFSET, byteOffset);
      Atomics.store(i32, ptri + HINDEX_BYTELENGTH, allocLength);
      Atomics.store(i32, ptri + HINDEX_LENGTH, length);
      Atomics.store(i32, ptri + HINDEX_BEGIN, begin);
    }
    Atomics.store(i32, ptri + HINDEX_PTRI, ptri);
    Atomics.store(i32, ptri + HINDEX_CLASSID, classId);
    return ptri;
  };
  self.emit = function(event, detail) {
    return self.dispatchEvent(new CustomEvent(event, {detail}));
  };
  pipe.emit = function(event, detail) {
    return this.postMessage(event);
  };
  /*
  class Pointer       extends Number

  @byteLength : 0

  @subclasses : []

  @TypedArray : Float32Array

  Object.defineProperty this  , "classId",
  configurable: on
  get : -> Object.defineProperty( this, "classId",
      value : classes.register( this )
  ).classId

  Object.defineProperty this::, "byteOffset",
  get : -> Atomics.load i32, @ptri + HINDEX_BYTEOFFSET

  Object.defineProperty this::, "classId",
  get : -> Atomics.load i32, @ptri + HINDEX_CLASSID

  Object.defineProperty this::, "byteLength",
  get : -> Atomics.load i32, @ptri + HINDEX_BYTELENGTH

  Object.defineProperty this::, "length",
  get : -> Atomics.load i32, @ptri + HINDEX_LENGTH

  Object.defineProperty this::, "ptri",
  get : -> Atomics.load i32, this

  Object.defineProperty this::, "begin",
  get : -> Atomics.load i32, @ptri + HINDEX_BEGIN

  Object.defineProperty this::, "isGL",
  get : -> Atomics.load i32, @ptri + HINDEX_ISGL
  set : (v) -> Atomics.store i32, @ptri + HINDEX_ISGL, v

  Object.defineProperty this::, "parent",
  get : -> Atomics.load i32, @ptri + HINDEX_PARENT
  set : (v) -> Atomics.store i32, @ptri + HINDEX_PARENT, parseInt v

  Object.defineProperty this::, "children",
  get : -> 
      ptri = Atomics.load i32, 1
      test = this.ptri

      children = []
      while OFFSET_PTR <= ptri -= 16
          unless test - Atomics.load i32, ptri + HINDEX_PARENT
              classId = Atomics.load i32, ptri + HINDEX_CLASSID
              children.push new (classes[ classId ])( ptri )
      children

  Object.defineProperty this::, "iterCount",
  get : -> Atomics.load u32, @ptri + HINDEX_ITER_COUNT
  set : (v) -> Atomics.store u32, @ptri + HINDEX_ITER_COUNT, v

  Object.defineProperty this::, "typedArray",
  get : -> new this.constructor.TypedArray buffer, @byteOffset, @length

  @allocs     : ( parent ) ->
  ptri = Atomics.load i32, 1
  classId = @classId

  while OFFSET_PTR <= ptri -= 16        
      continue unless classId is Atomics.load i32, ptri + HINDEX_CLASSID
      continue if parent and parent isnt Atomics.load i32, ptri + HINDEX_PARENT
      object = new this ptri

  @malloc     : ( constructor, byteLength ) ->
  @classId
  offset = @byteLength
  mod = offset % 4
  offset += 4 - mod
  byteLength ?= constructor.byteLength
  byteLength += 4 - byteLength % 4

  @subclasses.push {
      constructor : constructor
      offset : offset
      byteLength : byteLength
      index : @subclasses.length
      classId : constructor.classId
  }

  Object.defineProperty this::, constructor.label, {
      get : constructor::get offset 
      set : constructor::set offset 
  }

  @byteLength += byteLength
  offset

  constructor : ( ptri, parent ) ->
  unless ptri = parseInt super ptri
      ptri = malloc @constructor
      return new @constructor ptri, parent 

  @parent = parent if parent

  @init ptri

  set         : ( value, index = 0 ) ->
  @typedArray.set value, index ; this

  init        : -> this

  subarray    : ( begin, end ) ->
  new @constructor.TypedArray buffer, @byteOffset + begin * 4, end - begin

  class Position      extends Pointer

  @byteLength : 4 * 4

  @label      : "position"

  get : ( offset ) -> ->
  new Float32Array buffer, @byteOffset + offset, 3

  set : ( offset ) -> ( value ) ->
  f32.set value, ( @byteOffset + offset ) / 4

  class Color         extends Pointer

  @byteLength : 4 * 4

  @label : "color"

  get : ( offset ) -> ->
  new Float32Array buffer, @byteOffset + offset, 4

  set : ( offset ) -> ( value ) ->
  f32.set value, ( @byteOffset + offset ) / 4

  class Rotation      extends Pointer

  @byteLength : 4 * 4

  @label : "rotation"

  get : ( offset ) -> ->
  new Float32Array buffer, @byteOffset + offset, 3

  set : ( offset ) -> ( value ) ->
  f32.set value, ( @byteOffset + offset ) / 4

  class Scale         extends Pointer

  @byteLength : 3 * 4

  @label      : "scale"

  get : ( offset ) -> ->
  new Float32Array buffer, @byteOffset + offset, 3

  set : ( offset ) -> ( value ) ->
  f32.set value, ( @byteOffset + offset ) / 4

  class Vertices      extends Pointer

  @label          : "vertices"

  Object.defineProperties this::,
  pointCount  : get : ->
      @length / 3

  get : ( offset ) -> ->
  ptri = dvw.getInt32 @byteOffset + @OFFSET_VERTICES, LE
  return new Vertices ptri if ptri ; null

  set : ( offset ) -> ( value ) ->
  ptri = malloc Vertices, value.length * 4
  dvw.setInt32 @byteOffset + @OFFSET_VERTICES, ptri, LE
  f32.set value, i32[ ptri + HINDEX_BEGIN ]

  */
  classes.register(Pointer = (function() {
    class Pointer extends Number {
      constructor() {
        super(arguments[0] || Atomics.add(u32, 1, 16));
        if (isWindow) {
          this.init(arguments[1]);
        }
      }

      malloc(byteLength) {
        var byteOffset;
        byteLength = byteLength || this.constructor.byteLength;
        byteOffset = Atomics.add(u32, 0, byteLength);
        setBegin(this, byteOffset / this.BPE);
        setLength(this, byteLength / this.BPE);
        setByteOffset(this, byteOffset);
        return this;
      }

      init(props = {}) {
        var Class, j, len, prop, value;
        if (!getClassIndex(this)) {
          setClassIndex(this, this.constructor.classIndex);
        }
        for (prop in props) {
          value = props[prop];
          for (j = 0, len = classes.length; j < len; j++) {
            Class = classes[j];
            if (prop !== Class.prototype.name) {
              continue;
            }
            this.adopt(new Class().set(value));
            break;
          }
        }
        return this;
      }

      set(array = []) {
        var byteLength;
        if (!(byteLength = getByteLength(this))) {
          if (!(byteLength = this.constructor.byteLength)) {
            byteLength = array.length * this.BPE;
          }
        }
        if (!byteLength) {
          return this;
        } else {
          this.malloc(byteLength);
        }
        if (array) {
          setarrayFloat32.call(this, array);
        }
        return this;
      }

      storeObject(object) {
        var i;
        if (-1 === (i = this.scope.indexOf(object))) {
          i += this.scope.push(object);
        }
        return i;
      }

      static create() {
        return new this(null, ...arguments);
      }

    };

    Pointer.byteLength = 0;

    Pointer.isPtr = true;

    Pointer.prototype.isPtri = true;

    Pointer.BPE = BPE;

    Pointer.prototype.BPE = Pointer.BPE;

    Pointer.prototype.scope = [, ];

    Pointer.prototype.adopt = setParent;

    Pointer.allocs = getAllocs;

    Object.defineProperties(Pointer.prototype, {
      childs: {
        get: getChilds
      },
      parent: {
        get: getParent
      },
      tarray: {
        get: newFloat32Array
      },
      ["|[Pointer]|"]: {
        get: ptrUint32Array,
        set: function(ptr) {
          return ptrUint32Array.call(this).set(ptr);
        }
      }
    });

    return Pointer;

  }).call(this));
  classes.register(Vector3 = (function() {
    class Vector3 extends Pointer {
      getX() {
        return getFloat32.call(this, 0);
      }

      getY() {
        return getFloat32.call(this, 1);
      }

      getZ() {
        return getFloat32.call(this, 2);
      }

      setX(v) {
        return setFloat32.call(this, 0, v);
      }

      setY(v) {
        return setFloat32.call(this, 1, v);
      }

      setZ(v) {
        return setFloat32.call(this, 2, v);
      }

    };

    Vector3.byteLength = 3 * Vector3.BPE;

    Object.defineProperties(Vector3.prototype, {
      x: {
        get: Vector3.prototype.getX,
        set: Vector3.prototype.setX
      },
      y: {
        get: Vector3.prototype.getY,
        set: Vector3.prototype.setY
      },
      z: {
        get: Vector3.prototype.getZ,
        set: Vector3.prototype.setZ
      }
    });

    return Vector3;

  }).call(this));
  classes.register(Color = (function() {
    class Color extends Pointer {
      toObject() {
        var alpha, blue, green, red;
        [red, green, blue, alpha] = this.f32;
        return {red, green, blue, alpha};
      }

      set([r, g, b, a = 1]) {
        return super.set([r, g, b, a]);
      }

    };

    Color.prototype.name = "color";

    Color.byteLength = 4 * Color.BPE;

    Object.defineProperties(Color.prototype, {
      f32: {
        get: newFloat32Array
      },
      ui8: {
        get: function() {
          return Uint8Array.from(this.f32, function(v) {
            return v * 0xff;
          });
        }
      },
      hex: {
        get: function() {
          return "0x" + [...this.ui8].map(function(v) {
            return v.toString(16).padStart(2, 0);
          }).join("");
        }
      },
      u32: {
        get: function() {
          return parseInt(this.hex, 16);
        }
      },
      rgb: {
        get: function() {
          return Array.from(this.ui8.subarray(0, 3));
        }
      },
      css: {
        get: function() {
          return `rgba( ${this.rgb.join(', ')}, ${this.obj.alpha} )`;
        }
      },
      obj: {
        get: function() {
          return this.toObject();
        }
      }
    });

    return Color;

  }).call(this));
  classes.register(UV = (function() {
    class UV extends Vector3 {};

    UV.prototype.name = "uv";

    return UV;

  }).call(this));
  classes.register(Texture = (function() {
    class Texture extends Vector3 {};

    Texture.prototype.name = "texture";

    return Texture;

  }).call(this));
  classes.register(Position = (function() {
    class Position extends Vector3 {
      apply(begin, count, stride, offset) {
        var i, tx, ty, tz;
        [tx, ty, tz] = this.tarray;
        while (count--) {
          i = (count * stride + offset) / 4;
          f32[i] += tx;
          f32[i + 1] += ty;
          f32[2 + i] += tz;
        }
        return 0;
      }

    };

    Position.prototype.name = "position";

    Position.prototype.vertexAttribPointer = "position";

    return Position;

  }).call(this));
  classes.register(Scale = (function() {
    class Scale extends Vector3 {
      apply(begin, count, stride, offset) {
        var i, sx, sy, sz;
        [sx, sy, sz] = this.tarray;
        while (count--) {
          i = (count * stride + offset) / 4;
          f32[i] *= sx;
          f32[i + 1] *= sy;
          f32[2 + i] *= sz;
        }
        return 0;
      }

    };

    Scale.prototype.name = "scale";

    return Scale;

  }).call(this));
  classes.register(Rotation = (function() {
    class Rotation extends Pointer {
      getX() {
        return getFloat32.call(this, 0);
      }

      sinX() {
        return getFloat32.call(this, 1);
      }

      cosX() {
        return getFloat32.call(this, 2);
      }

      getY() {
        return getFloat32.call(this, 3);
      }

      sinY() {
        return getFloat32.call(this, 4);
      }

      cosY() {
        return getFloat32.call(this, 5);
      }

      getZ() {
        return getFloat32.call(this, 6);
      }

      sinZ() {
        return getFloat32.call(this, 7);
      }

      cosZ() {
        return getFloat32.call(this, 8);
      }

      setX(v) {
        fillUint32.call(this, 0, 3);
        setFloat32.call(this, v, 0);
        setFloat32.call(this, Math.sin(v), 1);
        return setFloat32.call(this, Math.cos(v), 2);
      }

      setY(v) {
        fillUint32.call(this, 3, 3);
        setFloat32.call(this, v, 3);
        setFloat32.call(this, Math.sin(v), 4);
        return setFloat32.call(this, Math.cos(v), 5);
      }

      setZ(v) {
        fillUint32.call(this, 6, 3);
        setFloat32.call(this, v, 6);
        setFloat32.call(this, Math.sin(v), 7);
        return setFloat32.call(this, Math.cos(v), 8);
      }

      set(v) {
        super.set() && ([this.x, this.y, this.z] = v);
        return this;
      }

      apply(begin, count, stride, offset) {
        var cosX, cosY, cosZ, i, sinX, sinY, sinZ, x, y, z;
        [x, sinX, cosX, y, sinY, cosY, z, sinZ, cosZ] = this.tarray;
        while (count--) {
          i = (count * stride + offset) / 4;
          f32[i] *= sinX * cosX;
          f32[i + 1] *= cosY * sinY;
          f32[2 + i] *= sinZ * cosZ;
        }
        return 0;
      }

    };

    Rotation.prototype.name = "rotation";

    Rotation.byteLength = 9 * Rotation.BPE;

    Object.defineProperties(Rotation.prototype, {
      x: {
        get: Rotation.prototype.getX,
        set: Rotation.prototype.setX
      },
      y: {
        get: Rotation.prototype.getY,
        set: Rotation.prototype.setY
      },
      z: {
        get: Rotation.prototype.getZ,
        set: Rotation.prototype.setZ
      }
    });

    return Rotation;

  }).call(this));
  classes.register(Vertices = (function() {
    class Vertices extends Pointer {
      copy(start, begin, count, stride, offset) {
        var byteLength, byteOffset, dstByteOffset;
        byteOffset = begin * this.BPE;
        byteLength = count * this.BPE * 3;
        dstByteOffset = start * this.BPE + offset;
        while (count--) {
          ui8.copyWithin(dstByteOffset, byteOffset, byteOffset + 12);
          byteOffset -= 12;
          dstByteOffset -= stride;
        }
        return 0;
      }

      transform(begin, count) {
        var position, rotation, scale;
        //todo buffer alloc required 'cause of stride and offset
        this.copy(1);
        if (rotation = findInheritable.call(this, "rotation")) {
          rotation.apply(begin, count);
        }
        //todo must read rotated, not original begin 
        if (position = findInheritable.call(this, "position")) {
          position.apply(begin, count);
        }
        if (scale = findInheritable.call(this, "scale")) {
          scale.apply(begin, count);
        }
        return 0;
      }

      vertex(index = 0) {
        return subarrayFloat32(index * 3, 3);
      }

      vertices(index = 0, count = 1) {
        return subarrayFloat32(index * 3, count * 3);
      }

    };

    Vertices.prototype.name = "vertices";

    return Vertices;

  }).call(this));
  classes.register(Draw = (function() {
    class Draw extends Pointer {};

    Draw.prototype.name = "draw";

    Draw.byteLength = 4 * 4;

    return Draw;

  }).call(this));
  Object.defineProperties(Draw.prototype, {
    type: {
      get: (function() {
        return u32[this.begin];
      }),
      set: (function(v) {
        return u32[this.begin] = v;
      })
    },
    offset: {
      get: (function() {
        return u32[this.begin + 1];
      }),
      set: (function(v) {
        return u32[this.begin + 1] = v;
      })
    },
    begin: {
      get: (function() {
        return u32[this.begin + 2];
      }),
      set: (function(v) {
        return u32[this.begin + 2] = v;
      })
    },
    count: {
      get: (function() {
        return u32[this.begin + 3];
      }),
      set: (function(v) {
        return u32[this.begin + 3] = v;
      })
    }
  });
  classes.register(Matter = (function() {
    class Matter extends Pointer {};

    self.Matter = Matter;

    return Matter;

  }).call(this));
  classes.register(Frustrum = (function() {
    class Frustrum extends Pointer {};

    Frustrum.prototype.name = "frustrum";

    return Frustrum;

  }).call(this));
  classes.register(PointSize = (function() {
    class PointSize extends Pointer {};

    PointSize.prototype.name = "pointSize";

    return PointSize;

  }).call(this));
  /*
  class Shape         extends Pointer

  self.Shape      = this

  OFFSET_POSITION : @malloc Position

  OFFSET_ROTATION : @malloc Rotation

  OFFSET_SCALE    : @malloc Scale

  OFFSET_COLOR    : @malloc Color

  OFFSET_VERTICES : @malloc Vertices

  draws           : []

  @fromOptions    : ( options ) ->
  ptri = malloc this
  ptr = new this ptri

  for prop, value of options
      ptr[ prop ] = value

  ptr.isGL = 1
  ptr.iterCount = ptr.vertices.pointCount

  unless Number.isInteger ptr.vertices.pointCount
      throw [ /VERTEX_COUNT_MUST_BE_MULTIPLE_OF_3/, options.vertices ]

  ptr

  Object.defineProperties Shape::,
  pointCount  :
      get     : -> @vertices.pointCount

  markNeedsUpdate : 
      set     : -> unlock Atomics.store i32, @ptri + HINDEX_UPDATED, 1

  willUploadIfNeeded : 
      get     : -> Atomics.and i32, @ptri + HINDEX_UPDATED, 0

  drawPoints      : ->
  @draws.push space.malloc gl.POINTS, this

  drawLines       : ->
  @draws.push space.malloc gl.LINES, this

  drawTriangles   : ->
  @draws.push space.malloc gl.TRIANGLES, this

  vertex          : ( index ) ->
  ptri = dvw.getUint32 @byteOffset + @OFFSET_VERTICES, LE
  byteOffset = i32[ ptri + HINDEX_BYTEOFFSET ] + index * 4 * 3
  new Float32Array buffer, byteOffset, 3

  class Matrix4       extends Pointer

  @byteLength         : 16

  @multiply           : ( mat4a, mat4b ) ->
  Matrix4::multiply.call mat4a, mat4b

  translate           : ( x = 0, y = 0, z = 0 ) ->
  @multiply Float32Array.of(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      x,  y,  z,  1,
  )

  translateX          : ( x = 0 ) ->
  @multiply Float32Array.of(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      x,  0,  0,  1,
  )

  translateY          : ( y = 0 ) ->
  @multiply Float32Array.of(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      0,  y,  0,  1,
  )

  translateZ          : ( z = 0 ) ->
  @multiply Float32Array.of(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      0,  0,  z,  1,
  )

  rotate              : ( x = 0, y = 0, z = 0 ) ->
  @rotateX( x ).rotateY( y ).rotateZ( z )

  rotateX             : ( r = 0 ) ->
  c = Math.cos r
  s = Math.sin r

  @multiply Float32Array.of(
       1,  0,  0,  0,
       0,  c,  s,  0,
       0, -s,  c,  0,
       0,  0,  0,  1,
  )

  rotateY             : ( r = 0 ) ->
  c = Math.cos r
  s = Math.sin r

  @multiply Float32Array.of(
       c,  s,  0,  0,
      -s,  c,  0,  0,
       0,  0,  1,  0,
       0,  0,  0,  1,
  )

  rotateZ             : ( r = 0 ) ->
  c = Math.cos r
  s = Math.sin r

  @multiply Float32Array.of(
       c,  0, -s,  0,
       0,  1,  0,  0,
       s,  0,  c,  0,
       0,  0,  0,  1,
  )

  scale               : ( x = 1, y = 1, z = 1 ) ->
  @multiply Float32Array.of(
       x,  0,  0,  0,
       0,  y,  0,  0,
       0,  0,  z,  0,
       0,  0,  0,  1,
  )

  multiply            : ( mat4 ) ->

  [   a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,   ] = this

  [   b00, b01, b02, b03,
      b10, b11, b12, b13,
      b20, b21, b22, b23,
      b30, b31, b32, b33,   ] = mat4

  @set Float32Array.of(
      b00 * a00  +  b01 * a10  +  b02 * a20  +  b03 * a30,
      b00 * a01  +  b01 * a11  +  b02 * a21  +  b03 * a31,
      b00 * a02  +  b01 * a12  +  b02 * a22  +  b03 * a32,
      b00 * a03  +  b01 * a13  +  b02 * a23  +  b03 * a33,

      b10 * a00  +  b11 * a10  +  b12 * a20  +  b13 * a30,
      b10 * a01  +  b11 * a11  +  b12 * a21  +  b13 * a31,
      b10 * a02  +  b11 * a12  +  b12 * a22  +  b13 * a32,
      b10 * a03  +  b11 * a13  +  b12 * a23  +  b13 * a33,

      b20 * a00  +  b21 * a10  +  b22 * a20  +  b23 * a30,
      b20 * a01  +  b21 * a11  +  b22 * a21  +  b23 * a31,
      b20 * a02  +  b21 * a12  +  b22 * a22  +  b23 * a32,
      b20 * a03  +  b21 * a13  +  b22 * a23  +  b23 * a33,

      b30 * a00  +  b31 * a10  +  b32 * a20  +  b33 * a30,
      b30 * a01  +  b31 * a11  +  b32 * a21  +  b33 * a31,
      b30 * a02  +  b31 * a12  +  b32 * a22  +  b33 * a32,
      b30 * a03  +  b31 * a13  +  b32 * a23  +  b33 * a33,
  )

  [ Symbol.iterator ] : ->
  begin = @begin
  index = 0
  count = 16

  next  : ->
      return done  : true if index is count
      return value : f32[ begin + index++ ]

  Object.defineProperties Matrix4::,
  matrix  : 
      get : -> f32.subarray @begin, @begin + 16
      set : (v) -> f32.set v, @begin

  class Frustrum      extends Matrix4

  @byteLength         : 4 * 28

  INDEX_BOTTOM        : 17

  INDEX_LEFT          : 18

  INDEX_RIGHT         : 19

  INDEX_TOP           : 20

  INDEX_WIDTH         : 21

  INDEX_HEIGHT        : 22

  INDEX_ASPECT        : 23

  INDEX_PRATIO        : 24

  INDEX_YFOV          : 25

  INDEX_ZNEAR         : 26

  INDEX_ZFAR          : 27

  @fromOptions        : ( options = {} ) ->
  { yFov = 90, zNear = 1e-3, zFar = 1e+4,
  width = INNER_WIDTH, height = INNER_HEIGHT, pratio = RATIO_PIXEL } = options

  base = new this()
  aspect = width / height
  half_fovy = ( .5 * yFov * RADIANS_PER_DEGREE )
  bottom = - ( top = zNear * Math.tan half_fovy )
  left = - ( right = top * aspect )

  f = Math.tan Math.PI/2 - yFov/2
  rangeInv = 1.0 / ( zNear - zFar )            

  base.typedArray.set Float32Array.of(
      f / aspect,    0,                             0,    0,
      0,             f,                             0,    0,
      0,             0,     (zNear + zFar) * rangeInv,   -1,
      0,             0, (zNear * zFar) * rangeInv * 2,    0,

      0,
      bottom, left, right, top,
      width, height, aspect, pratio,
      yFov, zNear, zFar
  )

  base.translateZ -5
  base.rotateX Math.PI
  base.scale 1, 1, 1

  base

  Object.defineProperties Frustrum::,

  bottom  :
      get : -> f32[ @begin + @INDEX_BOTTOM ]
      set : (v) -> f32[ @begin + @INDEX_BOTTOM ] = v

  left    :
      get : -> f32[ @begin + @INDEX_LEFT ]
      set : (v) -> f32[ @begin + @INDEX_LEFT ] = v

  right   :
      get : -> f32[ @begin + @INDEX_RIGHT ]
      set : (v) -> f32[ @begin + @INDEX_RIGHT ] = v

  top     :
      get : -> f32[ @begin + @INDEX_TOP ]
      set : (v) -> f32[ @begin + @INDEX_TOP ] = v

  width   :
      get : -> f32[ @begin + @INDEX_WIDTH ]
      set : (v) -> f32[ @begin + @INDEX_WIDTH ] = v

  height  :
      get : -> f32[ @begin + @INDEX_HEIGHT ]
      set : (v) -> f32[ @begin + @INDEX_HEIGHT ] = v

  aspect  :
      get : -> f32[ @begin + @INDEX_ASPECT ]
      set : (v) -> f32[ @begin + @INDEX_ASPECT ] = v

  pratio  :
      get : -> f32[ @begin + @INDEX_PRATIO ]
      set : (v) -> f32[ @begin + @INDEX_PRATIO ] = v

  yFov    :
      get : -> f32[ @begin + @INDEX_YFOV ]
      set : (v) -> f32[ @begin + @INDEX_YFOV ] = v

  zNear   :
      get : -> f32[ @begin + @INDEX_ZNEAR ]
      set : (v) -> f32[ @begin + @INDEX_ZNEAR ] = v

  zFar    :
      get : -> f32[ @begin + @INDEX_ZFAR ]
      set : (v) -> f32[ @begin + @INDEX_ZFAR ] = v

  rebind  :
      get : -> @upload()

  setViewport         : ( context ) ->
  context.viewport 0, 0, @width * @pratio, @height * @pratio

  if  defines.pointSize
      defines.pointSize.value = 10

  if  defines.frustrum
      defines.frustrum.upload =
          defines.frustrum.bindUpload @matrix

      Object.defineProperties this,
          uniform : get   : -> defines.frustrum
          upload  : value : defines.frustrum.bindUpload @matrix

      @upload()
  this

  listenWindow        : ->

  self.addEventListener "wheel", (e) =>
      @translateZ e.deltaY/100
          .upload()
      e.preventDefault()
  , passive: off

  plock = 0 
  rotate = 0
  draging = 0

  self.oncontextmenu  = (e) -> e.preventDefault()
  self.ondblclick     = ->
      gl.canvas.requestPointerLock unadjustedMovement : on
      gl.canvas.requestFullscreen  navigationUI : "hide"

  document.onfullscreenchange  = 
  document.onpointerlockchange = ->
      plock = @pointerLockElement or @fullscreenElement

  self.onpointerdown  = (e) ->
      if e.button is 2 then draging = 1
      else rotate  = 1

  self.onpointerout   =
  self.onpointerup    = -> draging = rotate = 0
  self.onpointermove  = (e) => 
      if  plock or rotate or draging

          { movementX: x, movementY: y } = e

          if  rotate
              @rotateX y / -100 if y
              @rotateY x / -100 if x

          if  draging
              @translate(
                  x / (INNER_WIDTH /10),
                  y / (INNER_HEIGHT/15)
              )
          @upload()

      0

  class GLDraw        extends Pointer

  @byteLength         : 8 * 4

  INDEX_NEEDSUP       : 0

  INDEX_COUNT         : 1

  INDEX_TYPE          : 2

  INDEX_OFFSET        : 3

  INDEX_BEGIN         : 4

  INDEX_LENGTH        : 5

  INDEX_ATTRLEN       : 6

  INDEX_BOFFSET       : 7

  classId             : @classId

  @fromOptions        : ( options = {} ) ->
  Object.assign new this(), options

  Object.defineProperties GLDraw::,

  pointsCount : 
      get : -> u32[ @begin + @INDEX_COUNT ]
      set : (v) -> u32[ @begin + @INDEX_COUNT ] = v

  drawType :
      get : -> u32[ @begin + @INDEX_TYPE ]
      set : (v) -> u32[ @begin + @INDEX_TYPE ] = v                

  globalOffset : 
      get : -> u32[ @begin + @INDEX_BOFFSET ]
      set : (v) -> u32[ @begin + @INDEX_BOFFSET ] = v

  uploadOffset : 
      get : -> u32[ @begin + @INDEX_OFFSET ]
      set : (v) -> u32[ @begin + @INDEX_OFFSET ] = v

  uploadBegin :
      get : -> u32[ @begin + @INDEX_BEGIN ]
      set : (v) -> u32[ @begin + @INDEX_BEGIN ] = v

  uploadLength :
      get : -> u32[ @begin + @INDEX_LENGTH ]
      set : (v) -> u32[ @begin + @INDEX_LENGTH ] = v

  drawBuffer :
      get : -> new Float32Array buffer, @globalOffset, @uploadLength

  vertex  : (i) ->
  byteOffset = @globalOffset + ( i * 32 )
  new Float32Array buffer, byteOffset, 3

  color   : (i) ->
  byteOffset = @globalOffset + ( i * 32 ) + 16
  new Float32Array buffer, byteOffset, 4

  classes.register class Shader extends Pointer

  INDEX_IS_ATTACHED     : 0 #ui8
  INDEX_GLSHADER_INDEX  : 1

  @typeof : ( source ) ->
  if !source.match /gl_Program/
      return WebGL2RenderingContext.FRAGMENT_SHADER
  return WebGL2RenderingContext.VERTEX_SHADER

  @getDefault : -> @allocs()[0]

  @fromSource : ( source ) ->
  if  WebGL2RenderingContext.VERTEX_SHADER is @typeof source
      return new vShader
  return new fShader

  @createScope : ( scope ) ->

  defaultVShader = no
  defaultFShader = no

  for s in scripts.find (s) -> s.type.match /x-shader/i

      shader = if s.text.match /gl_Program/
          new vShader null, scope
      else new fShader null, scope

      shader . compile s.text 

      if !defaultVShader and shader.vShader
          defaultVShader = shader 

      if !defaultFShader and shader.fShader
          defaultFShader = shader 

  scope

  compile : ( source ) ->
  shader = gl.createShader @type

  gl.shaderSource shader, source
  gl.compileShader shader

  unless gl.getShaderParameter shader, gl.COMPILE_STATUS
      info = gl.getShaderInfoLog shader
      throw "Could not compile WebGL program. \n\n#{info}"

  @glShader = shader

  @resolve()

  resolve : -> this

  Object.defineProperties Shader::,

  isAttached      :
      get : -> u32[ this + @HINDEX_RESV0 ]
      set : (v) -> u32[ this + @HINDEX_RESV0 ] = v

  glShader        :
      get : -> shaders[ u32[ this + @HINDEX_RESV1 ] ]
      set : (v) -> u32[ this + @HINDEX_RESV1 ] = shaders.register v

  classes.register class vShader extends Shader
  name : "vShader"
  type : WebGL2RenderingContext.VERTEX_SHADER

  vShader : yes

  INDEX_GLBUFFER_BOUND  : 0 #ui8
  INDEX_GLBUFFER_INDEX  : 1
  INDEX_BYTES_PER_ATTR  : 2

  INDEX_POINTS_START    : 1 #u32 
  INDEX_POINTS_COUNT    : 2 
  INDEX_POINTS_OFFSET   : 3 

  INDEX_LINES_START     : 4 
  INDEX_LINES_COUNT     : 5 
  INDEX_LINES_OFFSET    : 6 

  INDEX_TRIANGLES_START : 7 
  INDEX_TRIANGLES_COUNT : 8 
  INDEX_TRIANGLES_OFFSET: 9 

  INDEX_DRAW_BEGIN      : 16

  init : ->
  @BYTES_PER_ATTRIBUTE = 32

  length           = @byteLength / 4
  typeLength       = Math.trunc length / 3 
  typeByteLength   = typeLength * 4
  typeAttribLength = typeByteLength / @BYTES_PER_ATTRIBUTE

  @pointsStart     = 2 #for initial alloc
  @linesStart      = typeAttribLength
  @trianglesStart  = typeAttribLength * 2

  @pointsOffset    = 2 * @BYTES_PER_ATTRIBUTE
  @linesOffset     = typeByteLength * 2
  @trianglesOffset = typeByteLength * 3 

  compile : ( source ) ->
  super source

  buffer = gl.createBuffer()

  gl.bindBuffer gl.ARRAY_BUFFER, buffer
  gl.bufferData gl.ARRAY_BUFFER, BYTELENGTH_GLBUFFER, gl.STATIC_DRAW

  @glBuffer = buffer
  @isBinded = 1

  this

  attach : ( program ) ->
  gl.attachShader program, @glShader
  @isAttached = 1

  this

  resolve : ->

  resolveUniform  = ( uniform ) ->
      ( data, transpose = off ) ->    switch uniform.kind
          when "FLOAT_MAT4"           then gl.uniformMatrix4fv  .bind gl, uniform.location, transpose, data
          when "FLOAT_MAT3"           then gl.uniformMatrix3fv  .bind gl, uniform.location, transpose, data
          when "FLOAT_MAT2"           then gl.uniformMatrix2fv  .bind gl, uniform.location, transpose, data
          when "FLOAT_MAT2x3"         then gl.uniformMatrix2x3fv.bind gl, uniform.location, transpose, data
          when "FLOAT_MAT2x4"         then gl.uniformMatrix2x4fv.bind gl, uniform.location, transpose, data
          when "FLOAT_MAT3x2"         then gl.uniformMatrix3x2fv.bind gl, uniform.location, transpose, data
          when "FLOAT_MAT3x4"         then gl.uniformMatrix3x4fv.bind gl, uniform.location, transpose, data
          when "FLOAT_MAT4x2"         then gl.uniformMatrix4x2fv.bind gl, uniform.location, transpose, data
          when "FLOAT_MAT3x3"         then gl.uniformMatrix4x3fv.bind gl, uniform.location, transpose, data
          when "FLOAT"                then gl.uniform1f         .bind gl, uniform.location, data
          when "INT"                  then gl.uniform1iv        .bind gl, uniform.location, data
          when "UNSIGNED_INT"         then gl.uniform1uiv       .bind gl, uniform.location, data
          when "UNSIGNED_INT_VEC2"    then gl.uniform2uiv       .bind gl, uniform.location, data
          when "UNSIGNED_INT_VEC3"    then gl.uniform3uiv       .bind gl, uniform.location, data
          when "UNSIGNED_INT_VEC4"    then gl.uniform4uiv       .bind gl, uniform.location, data

  resolveDefines  = ->
      i = gl.getProgramParameter program, gl.ACTIVE_ATTRIBUTES
      v = Object.values WebGL2RenderingContext
      k = Object.keys WebGL2RenderingContext

      lengthOf =
          vec4 : 4
          vec3 : 3
          vec2 : 2
          mat4 : 4 * 4
          mat3 : 3 * 3

      attribs = while i--
          attrib              = gl.getActiveAttrib program, i
          attrib.is           = "attribute"
          attrib.location     = gl.getAttribLocation program, attrib.name
          attrib.isEnabled    = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_ENABLED
          attrib.binding      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
          attrib.typeof       = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_TYPE
          attrib.kindof       = k.at v.indexOf attrib.typeof 
          attrib.isNormalized = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
          attrib.stride       = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_STRIDE
          attrib.integer      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_INTEGER
          attrib.divisor      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_DIVISOR
          attrib.kind         = k.at v.indexOf attrib.type
          attrib.offset       = ATTRIBS_BYTELENGTH
          attrib.length       = lengthOf[ attrib.kind.split(/_/).at(-1).toLowerCase() ]

          ATTRIBS_LENGTH     += attrib.length
          ATTRIBS_BYTELENGTH  = ATTRIBS_LENGTH * 4
          attrib

      for attrib in attribs
          attrib.stride       = ATTRIBS_BYTELENGTH
          attrib.enable       = gl.enableVertexAttribArray.bind gl, attrib.location
          attrib.rebind       = gl.vertexAttribPointer.bind(
              gl, attrib.location, attrib.length, attrib.typeof, 
              attrib.isNormalized, attrib.stride, attrib.offset
          )

          Object.defineProperties defines[ attrib.name ] = attrib, value :
              get : -> gl.getVertexAttrib @location, gl.CURRENT_VERTEX_ATTRIB

      i = gl.getProgramParameter program, gl.ACTIVE_UNIFORMS
      uniforms = while i--
          uniform             = gl.getActiveUniform program, i
          uniform.is          = "uniform"
          uniform.kind        = k.at v.indexOf uniform.type
          uniform.location    = gl.getUniformLocation program, uniform.name
          uniform.bindUpload  = resolveUniform uniform 

          Object.defineProperties defines[ uniform.name ] = uniform, value :
              get : -> gl.getUniform program, @location
              set : ( data ) -> @bindUpload( data )()

  resolveDefines()

  allocPoints     : ( matter ) ->
  byteOffset = @pointsOffset
  pointCount = matter.vertices.count
  byteLength = pointCount * @BYTES_PER_ATTRIBUTE

  begin = byteOffset / 4
  count = byteLength / 4 

  @pointsCount += pointCount
  @pointsOffset += byteLength

  Object.assign new Draw( null, matter.shader = this ), {
      begin, count, offset: byteOffset,
      type : WebGL2RenderingContext.POINTS
  }

  allocLines      : ( matter ) ->
  byteOffset = @linesOffset
  pointCount = matter.vertices.count
  byteLength = pointCount * @BYTES_PER_ATTRIBUTE

  begin = byteOffset / 4
  count = byteLength / 4 

  @linesCount += pointCount
  @linesOffset += byteLength

  Object.assign new Draw( null, matter.shader = this ), {
      begin, count, offset: byteOffset,
      type : WebGL2RenderingContext.LINES
  }

  allocTriangles  : ( matter ) ->
  byteOffset = @trianglesOffset
  pointCount = matter.vertices.count
  byteLength = pointCount * @BYTES_PER_ATTRIBUTE

  begin = byteOffset / 4
  count = byteLength / 4 

  @trianglesCount += pointCount
  @trianglesOffset += byteLength

  Object.assign new Draw( null, matter.shader = this ), {
      begin, count, offset: byteOffset,
      type : WebGL2RenderingContext.TRIANGLES
  }

  Object.defineProperties vShader::,

  drawBuffer      :
  get : -> new Float32Array buffer, @byteOffset, BYTELENGTH_GLBUFFER/4

  BYTES_PER_ATTRIBUTE :
  get : -> ui8[ @byteOffset + @INDEX_BYTES_PER_ATTR ]
  set : (v) -> ui8[ @byteOffset + @INDEX_BYTES_PER_ATTR ] = v

  isBinded        :
  get : -> ui8[ @byteOffset + @INDEX_GLBUFFER_BOUND ]
  set : (v) -> ui8[ @byteOffset + @INDEX_GLBUFFER_BOUND ] = v

  glBuffer        :
  get : -> buffers[ ui8[ @byteOffset + @INDEX_GLBUFFER_INDEX ] ]
  set : (v) -> ui8[ @byteOffset + @INDEX_GLBUFFER_INDEX ] = buffers.register v

  pointsStart     :
  get : -> u32[ @begin + @INDEX_POINTS_START ]
  set : ( v ) -> u32[ @begin + @INDEX_POINTS_START ] = v

  linesStart      :
  get : -> u32[ @begin + @INDEX_LINES_START ]
  set : ( v ) -> u32[ @begin + @INDEX_LINES_START ] = v

  trianglesStart  :
  get : -> u32[ @begin + @INDEX_TRIANGLES_START ]
  set : ( v ) -> u32[ @begin + @INDEX_TRIANGLES_START ] = v

  pointsCount     :
  get : -> u32[ @begin + @INDEX_POINTS_COUNT ]
  set : ( v ) -> u32[ @begin + @INDEX_POINTS_COUNT ] = v

  linesCount      :
  get : -> u32[ @begin + @INDEX_LINES_COUNT ]
  set : ( v ) -> u32[ @begin + @INDEX_LINES_COUNT ] = v

  trianglesCount  :
  get : -> u32[ @begin + @INDEX_TRIANGLES_COUNT ]
  set : ( v ) -> u32[ @begin + @INDEX_TRIANGLES_COUNT ] = v

  pointsOffset    :
  get : -> u32[ @begin + @INDEX_POINTS_OFFSET ]
  set : ( v ) -> u32[ @begin + @INDEX_POINTS_OFFSET ] = v

  linesOffset     :
  get : -> u32[ @begin + @INDEX_LINES_OFFSET ]
  set : ( v ) -> u32[ @begin + @INDEX_LINES_OFFSET ] = v

  trianglesOffset :
  get : -> u32[ @begin + @INDEX_TRIANGLES_OFFSET ]
  set : ( v ) -> u32[ @begin + @INDEX_TRIANGLES_OFFSET ] = v

  classes.register class fShader  extends Shader
  name : "fShader"
  type : WebGL2RenderingContext.FRAGMENT_SHADER

  fShader : yes

  */
  classes.register(Shader = (function() {
    class Shader extends Pointer {
      getGLContext() {
        return this.scope[getResvUint8.call(this, 0)] || (this.gl = this.parent.gl);
      }

      setGLContext(webGL2RenderingContext) {
        return setResvUint8.call(this, 0, this.storeObject(webGL2RenderingContext));
      }

      getGLProgram() {
        return this.scope[getResvUint8.call(this, 1)] || (this.glProgram = this.parent.glProgram);
      }

      setGLProgram(webGLProgram) {
        return setResvUint8.call(this, 1, this.storeObject(webGLProgram));
      }

      getGLBuffer() {
        return this.scope[getResvUint8.call(this, 2)];
      }

      setGLBuffer(webGLBuffer) {
        return setResvUint8.call(this, 2, this.storeObject(webGLBuffer));
      }

      getGLShader() {
        return this.scope[getResvUint8.call(this, 3)];
      }

      setGLShader(webGLShader) {
        return setResvUint8.call(this, 3, this.storeObject(webGLShader));
      }

      getActive() {
        return getResvUint8.call(this, 4);
      }

      setActive(bool) {
        return setResvUint8.call(this, 4, bool);
      }

      getSource() {
        return this.glShader && this.gl.getShaderSource(this.glShader);
      }

      setSource(source) {
        return this.destroy().compile(source).attach();
      }

      compile(source) {
        var glShader, info;
        glShader = this.gl.createShader(this.constructor.shaderType);
        this.gl.shaderSource(glShader, source);
        this.gl.compileShader(glShader);
        if (!this.gl.getShaderParameter(glShader, this.gl.COMPILE_STATUS)) {
          info = this.gl.getShaderInfoLog(glShader);
          throw `Could not compile WebGL shader. \n\n${info}`;
        } else {
          this.glShader = glShader;
        }
        return this;
      }

      attach() {
        this.active = 1;
        return this;
      }

      detach() {
        this.gl.detachShader(this.glProgram, this.glShader);
        this.active = 0;
        return this;
      }

      destroy() {
        if (!this.glShader) {
          return this;
        }
        if (this.active) {
          this.gl.detachShader(this.glProgram, this.glShader);
        }
        this.gl.deleteShader(this.glShader);
        return this;
      }

    };

    Shader.prototype.GPU_ATTRIBUTE_COUNT = 1e5;

    Object.defineProperties(Shader.prototype, {
      gl: {
        get: Shader.prototype.getGLContext,
        set: Shader.prototype.setGLContext
      },
      glProgram: {
        get: Shader.prototype.getGLProgram,
        set: Shader.prototype.setGLProgram
      },
      glShader: {
        get: Shader.prototype.getGLShader,
        set: Shader.prototype.setGLShader
      }
    });

    Object.defineProperties(Shader.prototype, {
      source: {
        get: Shader.prototype.getSource,
        set: Shader.prototype.setSource
      },
      active: {
        get: Shader.prototype.getActive,
        set: Shader.prototype.setActive
      }
    });

    return Shader;

  }).call(this));
  classes.register(FragmentShader = (function() {
    class FragmentShader extends Shader {
      attach() {
        return super.attach(this.parent.glFShader = this.glShader);
      }

    };

    FragmentShader.shaderType = WebGL2RenderingContext.FRAGMENT_SHADER;

    return FragmentShader;

  }).call(this));
  classes.register(VertexShader = (function() {
    class VertexShader extends Shader {
      attach() {
        return super.attach(this.parent.glVShader = this.glShader);
      }

      create() {
        gl.bindBuffer(gl.ARRAY_BUFFER, gBuffer = gl.createBuffer());
        return gl.bufferData(gl.ARRAY_BUFFER, BYTELENGTH_GLBUFFER, gl.STATIC_DRAW);
      }

      setSource(source) {
        super.setSource(source);
        if (this.glBuffer) {
          return this;
        }
        return this.setBuffer(this.gl.createBuffer());
      }

      setBuffer(glBuffer) {
        var attibuteByteLength, def, definitions, key;
        this.glBuffer = glBuffer;
        definitions = this.parseSource();
        attibuteByteLength = 0;
        for (key in definitions) {
          def = definitions[key];
          if (def.is.match(/attr/)) {
            attibuteByteLength += def.length * this.BPE;
          }
        }
        return this.malloc(this.GPU_ATTRIBUTE_COUNT * attibuteByteLength);
      }

      //todo attib length done make mallocs
      parseSource(source = this.source) {
        var attrib, attribs, buf, canvas, definitions, i, info, j, k, len, len1, lengthOf, m, ref, shader, shader2, source2, uniform, uniforms, v;
        canvas = new OffscreenCanvas(0, 0);
        gl = canvas.getContext("webgl2");
        program = gl.createProgram();
        shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          info = gl.getShaderInfoLog(shader);
          throw `Could not compile WebGL shader. \n\n${info}`;
        }
        shader2 = gl.createShader(35632);
        source2 = "void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }";
        gl.shaderSource(shader2, source2);
        gl.compileShader(shader2);
        gl.attachShader(program, shader);
        gl.attachShader(program, shader2);
        gl.linkProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf = gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, 256, gl.STATIC_DRAW);
        gl.useProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          info = gl.getProgramInfoLog(program);
          throw `Could not compile WebGL program. \n\n${info}`;
        }
        i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        v = Object.values(WebGL2RenderingContext);
        k = Object.keys(WebGL2RenderingContext);
        lengthOf = {
          vec4: 4,
          vec3: 3,
          vec2: 2,
          mat4: 4 * 4,
          mat3: 3 * 3
        };
        ATTRIBS_LENGTH = 0;
        ATTRIBS_BYTELENGTH = 0;
        attribs = (function() {
          var results;
          results = [];
          while (i--) {
            attrib = gl.getActiveAttrib(program, i);
            attrib.is = "attribute";
            attrib.kind = k.at(v.indexOf(attrib.type));
            attrib.class = classes.find(function(c) {
              return c.prototype.name === attrib.name;
            });
            attrib.location = gl.getAttribLocation(program, attrib.name);
            attrib.typeof = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_TYPE);
            attrib.kindof = k.at(v.indexOf(attrib.typeof));
            attrib.offset = ATTRIBS_BYTELENGTH;
            attrib.length = lengthOf[attrib.kind.split(/_/).at(-1).toLowerCase()];
            ATTRIBS_LENGTH += attrib.length;
            ATTRIBS_BYTELENGTH = ATTRIBS_LENGTH * 4;
            results.push(attrib);
          }
          return results;
        })();
        for (j = 0, len = attribs.length; j < len; j++) {
          attrib = attribs[j];
          attrib.stride = ATTRIBS_BYTELENGTH;
          gl.enableVertexAttribArray(i = attrib.location);
          gl.vertexAttribPointer(attrib.location, attrib.length, attrib.typeof, attrib.isNormalized, attrib.stride, attrib.offset);
          attrib.isEnabled = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
          attrib.isNormalized = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
          attrib.integer = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_INTEGER);
          attrib.divisor = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_DIVISOR);
          gl.disableVertexAttribArray(i);
        }
        i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        uniforms = (function() {
          var results;
          results = [];
          while (i--) {
            uniform = gl.getActiveUniform(program, i);
            uniform.is = "uniform";
            uniform.kind = k.at(v.indexOf(uniform.type));
            uniform.class = classes.find(function(c) {
              return c.prototype.name === uniform.name;
            });
            uniform.location = gl.getUniformLocation(program, uniform.name);
            uniform.uploader = (function() {
              switch (uniform.kind) {
                case "FLOAT_MAT4":
                  return "uniformMatrix4fv";
                case "FLOAT_MAT3":
                  return "uniformMatrix3fv";
                case "FLOAT_MAT2":
                  return "uniformMatrix2fv";
                case "FLOAT_MAT2x3":
                  return "uniformMatrix2x3fv";
                case "FLOAT_MAT2x4":
                  return "uniformMatrix2x4fv";
                case "FLOAT_MAT3x2":
                  return "uniformMatrix3x2fv";
                case "FLOAT_MAT3x4":
                  return "uniformMatrix3x4fv";
                case "FLOAT_MAT4x2":
                  return "uniformMatrix4x2fv";
                case "FLOAT_MAT3x3":
                  return "uniformMatrix4x3fv";
                case "FLOAT":
                  return "uniform1f";
                case "INT":
                  return "uniform1iv";
                case "UNSIGNED_INT":
                  return "uniform1uiv";
                case "UNSIGNED_INT_VEC2":
                  return "uniform2uiv";
                case "UNSIGNED_INT_VEC3":
                  return "uniform3uiv";
                case "UNSIGNED_INT_VEC4":
                  return "uniform4uiv";
              }
            })();
            results.push(uniform);
          }
          return results;
        })();
        gl.detachShader(program, shader);
        gl.detachShader(program, shader2);
        gl.deleteShader(shader);
        gl.deleteShader(shader2);
        gl.deleteProgram(program);
        gl.deleteBuffer(buf);
        shader = shader2 = gl = program = canvas = null;
        definitions = new Object;
        ref = [...uniforms, ...attribs];
        for (m = 0, len1 = ref.length; m < len1; m++) {
          v = ref[m];
          definitions[v.name] = v;
        }
        return definitions;
      }

    };

    VertexShader.shaderType = WebGL2RenderingContext.VERTEX_SHADER;

    Object.defineProperties(VertexShader.prototype, {
      glBuffer: {
        get: VertexShader.prototype.getGLBuffer,
        set: VertexShader.prototype.setGLBuffer
      },
      source: {
        get: Shader.prototype.getSource,
        set: VertexShader.prototype.setSource
      },
      drawBuffer: {
        get: newFloat32Array
      }
    });

    return VertexShader;

  }).call(this));
  classes.register(Space = (function() {
    class Space extends Pointer {
      init() {
        super.init(...arguments);
        if (!isWindow || this.gl) {
          return this;
        }
        this.createContext();
        return this.createShaders();
      }

      getGLContext() {
        return this.scope[getResvUint8.call(this, 0)];
      }

      setGLContext(webGL2RenderingContext) {
        return setResvUint8.call(this, 0, this.storeObject(webGL2RenderingContext));
      }

      getGLProgram() {
        return this.scope[getResvUint8.call(this, 1)] || (this.glProgram = this.gl.createProgram());
      }

      setGLProgram(webGLProgram) {
        return setResvUint8.call(this, 1, this.storeObject(webGLProgram));
      }

      getGLVShader() {
        return this.scope[getResvUint8.call(this, 2)];
      }

      setGLVShader(webGLShader) {
        if (this.glVShader) {
          this.vShader.detach();
        }
        this.gl.attachShader(this.glProgram, webGLShader);
        return setResvUint8.call(this, 2, this.storeObject(webGLShader));
      }

      getGLFShader() {
        return this.scope[getResvUint8.call(this, 3)];
      }

      setGLFShader(webGLShader) {
        if (this.glFShader) {
          this.fShader.detach();
        }
        this.gl.attachShader(this.glProgram, webGLShader);
        return setResvUint8.call(this, 3, this.storeObject(webGLShader));
      }

      createContext() {
        var canvas;
        canvas = document.createElement("canvas");
        canvas.width = RATIO_PIXEL * INNER_WIDTH;
        canvas.height = RATIO_PIXEL * INNER_HEIGHT;
        canvas.style.width = CSS.px(INNER_WIDTH);
        canvas.style.height = CSS.px(INNER_HEIGHT);
        canvas.style.inset = CSS.px(0);
        canvas.style.position = "fixed";
        this.gl = document.body.appendChild(canvas).getContext("webgl2");
        return this;
      }

      createShaders() {
        var j, len, ref, script, shader;
        ref = [...document.scripts].filter(function(s) {
          return s.type.match(/shader/i);
        });
        for (j = 0, len = ref.length; j < len; j++) {
          script = ref[j];
          if (script.text.match(/gl_Position/)) {
            this.adopt(shader = new VertexShader);
            shader.source = script.text;
          }
        }
        return this;
      }

    };

    self.Space = Space;

    Object.defineProperties(Space.prototype, {
      gl: {
        get: Space.prototype.getGLContext,
        set: Space.prototype.setGLContext
      },
      glProgram: {
        get: Space.prototype.getGLProgram,
        set: Space.prototype.setGLProgram
      },
      glVShader: {
        get: Space.prototype.getGLVShader,
        set: Space.prototype.setGLVShader
      },
      glFShader: {
        get: Space.prototype.getGLFShader,
        set: Space.prototype.setGLFShader
      },
      vShader: {
        get: function() {
          return findChilds.call(this, VertexShader).find(function(s) {
            return s.active;
          });
        }
      },
      fShader: {
        get: function() {
          return findChilds.call(this, FragmentShader).find(function(s) {
            return s.active;
          });
        }
      }
    });

    return Space;

  }).call(this));
  self.addEventListener("DOMContentLoaded", function() {
    var checkUploads, createBlobURL, createCanvas, createFrustrum, createThreads, createWorker, epoch, frame, initialProgram, listenEvents, rendering;
    frame = 0;
    epoch = 0;
    rendering = 0;
    return;
    checkUploads = function() {
      var draw, j, len, ref, results, shape;
      ref = Shape.allocs();
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        shape = ref[j];
        if (!shape.willUploadIfNeeded) {
          continue;
        }
        results.push((function() {
          var len1, m, ref1, results1;
          ref1 = GLDraw.allocs(shape.ptri);
          results1 = [];
          for (m = 0, len1 = ref1.length; m < len1; m++) {
            draw = ref1[m];
            results1.push(gl.bufferSubData(gl.ARRAY_BUFFER, draw.uploadOffset, space.drawBuffer, draw.uploadBegin, draw.uploadLength));
          }
          return results1;
        })());
      }
      return results;
    };
    this.render = function() {
      var define, l, onanimationframe;
      rendering = 1;
      for (l in defines) {
        define = defines[l];
        if (define.is.match(/attr/i)) {
          try {
            define.enable();
            define.rebind();
          } catch (error1) {}
        }
      }
      onanimationframe = function(pnow) {
        var delta, fps;
        delta = pnow - epoch;
        epoch = pnow;
        fps = Math.trunc(1 / delta * 1e3);
        space.upload();
        emit("animationframe", {gl, delta, epoch, fps});
        space.drawArrays();
        return requestAnimationFrame(onanimationframe);
      };
      return onanimationframe(performance.now());
    };
    initialProgram = function() {
      var fSource, info, vSource;
      vSource = scripts.find(function(s) {
        return s.type.match(/x-vert/i);
      }).text;
      vShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vShader, vSource);
      gl.compileShader(vShader);
      if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        info = gl.getShaderInfoLog(vShader);
        throw `Could not compile WebGL program. \n\n${info}`;
      }
      fSource = scripts.find(function(s) {
        return s.type.match(/x-frag/i);
      }).text;
      fShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fShader, fSource);
      gl.compileShader(fShader);
      if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        info = gl.getShaderInfoLog(fShader);
        throw `Could not compile WebGL program. \n\n${info}`;
      }
      program = gl.createProgram();
      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        info = gl.getProgramInfoLog(program);
        throw `Could not compile WebGL program. \n\n${info}`;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, gBuffer = gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, BYTELENGTH_GLBUFFER, gl.STATIC_DRAW);
      gl.useProgram(program);
      return 0;
    };
    createFrustrum = function(options) {
      frustrum = Frustrum.fromOptions(options);
      frustrum.setViewport(gl);
      return frustrum.listenWindow();
    };
    this.createDisplay = function() {
      return;
      space = new Space();
      initialProgram();
      createFrustrum();
      return requestIdleCallback(() => {
        self.emit("contextrestored", gl);
        return pipe.emit("contextrestored");
      });
    };
    createCanvas = function() {
      var canvas;
      canvas = document.createElement("canvas");
      canvas.width = RATIO_PIXEL * INNER_WIDTH;
      canvas.height = RATIO_PIXEL * INNER_HEIGHT;
      canvas.style.width = CSS.px(INNER_WIDTH);
      canvas.style.height = CSS.px(INNER_HEIGHT);
      canvas.style.inset = CSS.px(0);
      canvas.style.position = "fixed";
      return document.body.appendChild(canvas);
    };
    createWorker = function(name, blob) {
      var c, classIndexes, i, j, len, worker;
      worker = new Worker(blob, {name});
      worker.onerror = worker.onmessageerror = console.error;
      worker.onmessage = function({data}) {
        workers.push(Object.assign(this, data));
        return emit("threadstatechange", {
          thread: this
        });
      };
      Object.defineProperties(worker, {
        state: {
          get: Atomics.load.bind(Atomics, i32, name),
          set: function(v) {
            return error("worker state change request");
          }
        }
      });
      classIndexes = [];
      for (i = j = 0, len = classes.length; j < len; i = ++j) {
        c = classes[i];
        classIndexes.push({
          name: c.name,
          index: i
        });
      }
      return worker.postMessage({buffer, classIndexes});
    };
    createThreads = function() {
      var blob, i, j, ref, thread;
      blob = createBlobURL();
      for (i = j = 0, ref = THREADS_COUNT; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        thread = createWorker(i + THREADS_BEGIN, blob);
      }
      return true;
    };
    createBlobURL = function() {
      var blobURL, code;
      code = `${self.init}`.split("return " + "0xdead;")[0];
      blobURL = URL.createObjectURL(new Blob(["(", code, "}).call(self);"], {
        type: "application/javascript"
      }));
      delete self.init;
      return blobURL;
    };
    listenEvents = function() {
      var prevent;
      document.body.style.overscrollBehavior = "none";
      document.body.style.height = CSS.vh(100);
      document.body.style.margin = 0;
      prevent = function(e) {
        var j, len, w;
        buffer = null;
        try {
          e.preventDefault();
        } catch (error1) {}
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
      return window.onunhandledrejection = prevent;
    };
    createThreads();
    return listenEvents();
  });
  self.addEventListener("bufferready", function() {
    //log "bufferready:", buffer
    ui8 = new Uint8Array(buffer);
    u32 = new Uint32Array(buffer);
    f32 = new Float32Array(buffer);
    dvw = new DataView(buffer);
    i32 = new Int32Array(buffer);
    space = new Space();
    return emit("threadready");
  });
  self.addEventListener("threadready", function() {
    state(STATE_READY);
    return postMessage({threadId, uuid});
  });
  self.addEventListener("threadsready", function() {
    //warn "all threads are ready"
    state(THREADS_READY);
    return this.createDisplay();
  });
  self.addEventListener("threadstatechange", function() {
    if (!workers.find(function(w) {
      return w.state !== STATE_READY;
    })) {
      if (state() !== THREADS_READY) {
        return emit("threadsready");
      }
    }
  });
  self.addEventListener("dblclick", function() {
    return console.table(workers.map(function(w) {
      return {
        state: w.state,
        uuid: w.uuid,
        threadId: w.threadId
      };
    }));
  });
  self.addEventListener("message", function({data}) {
    var c, constructor, j, len, orderedClasses, ref;
    uuid = crypto.randomUUID();
    buffer = data.buffer;
    threadId = parseInt(self.name);
    orderedClasses = [];
    ref = data.classIndexes;
    for (j = 0, len = ref.length; j < len; j++) {
      c = ref[j];
      if (!(constructor = classes.find(function(_class) {
        return _class.name === c.name;
      }))) {
        throw ["CLASS_NOT_FOUND", c];
      }
      orderedClasses[c.index] = constructor;
    }
    classes.splice(0, classes.length);
    classes.push(...orderedClasses);
    orderedClasses.length = 0;
    return emit("bufferready");
  });
  pipe.addEventListener("message", function({data}) {
    switch (data) {
      case "contextrestored":
        return nextTick();
      default:
        return error("pipe.onmessage:", data);
    }
  });
  return 0xdead;
})();
