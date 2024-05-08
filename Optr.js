var root;

self.name = "window";

root = null;

self.init = function() {
  var ATTRIBS_BYTELENGTH, ATTRIBS_LENGTH, Attribute, BPE, BYTELENGTH_128MB, BYTELENGTH_GLBUFFER, ClearColor, ClearMask, Color, CompiledShader, Context, Document, DocumentScript, Draw, DrawBuffer, EventEmitter, EventHandler, FragmentShader, Frustrum, GLParamerer, GLPointer, HEADER_BEGIN, HEADER_BYTELENGTH, HEADER_BYTEOFFSET, HEADER_CLASSINDEX, HEADER_FRAGMENTED, HEADER_INDEXCOUNT, HEADER_ITERATORI, HEADER_ITERCLASSI, HEADER_ITEROFFSET, HEADER_LENGTH, HEADER_LINKEDPTRI, HEADER_NEEDRECALC, HEADER_NEEDUPLOAD, HEADER_PARENTPTRI, HEADER_RESVINDEX, HEADER_RESVINDEX1, HEADER_RESVINDEX2, HEADER_RESVINDEX4, HEADER_TRANSLATED, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_CLASSID, HINDEX_ISGL, HINDEX_ITER_COUNT, HINDEX_LENGTH, HINDEX_LOCATED, HINDEX_NEXT_COLORI, HINDEX_NEXT_VERTEXI, HINDEX_PAINTED, HINDEX_PARENT, HINDEX_RESV0, HINDEX_RESV1, HINDEX_UPDATED, INNER_HEIGHT, INNER_WIDTH, ITERATION_PER_THREAD, LE, Mesh, OFFSET_CPU, OFFSET_GPU, OFFSET_PTR, PointSize, Pointer, Position, Program, RADIANS_PER_DEGREE, RATIO_ASPECT, RATIO_PIXEL, Rotation, STATE_LOCKED, STATE_READY, STATE_UNLOCKED, STATE_WORKING, Scale, Scene, Shader, ShaderSource, THREADS_BEGIN, THREADS_COUNT, THREADS_NULL, THREADS_READY, THREADS_STATE, TextPointer, Texture, UV, UserScript, Vector4, VertexShader, addResvFloat32, addResvUint16, addResvUint32, addResvUint8, addUint32, buffer, buffers, classes, defines, detachUint8, draws, dvw, error, f32, fShader, fillFloat32, fillUint32, fillUint8, finalizeIterator, findChild, findChildRecursive, findChilds, findChildsPtri, findChildsRecursive, findLinkeds, frustrum, gBuffer, getAllocs, getBegin, getByteLength, getByteOffset, getChilds, getChildsCount, getChildsPtri, getClass, getClassIndex, getFloat32, getFragmented, getIndex, getIterOffset, getLength, getLinked, getLinkedPtri, getNeedRecalc, getNeedUpload, getObject, getParent, getParentPtri, getPointer, getResvFloat32, getResvUint16, getResvUint32, getResvUint8, getTranslated, getUint16, getUint32, getUint64, getUint8, gl, hitFragmented, hitIterOffset, hitNeedRecalc, hitNeedUpload, hitResvUint8, hitTranslated, i32, inherit, isThread, isWindow, iterateGlobalAllocs, iteratePrepared, lock, log, mallocs, newFloat32Array, newUint32Array, newUint8Array, nextTick, number, orFloat32, orUint32, orUint8, pipe, prepareIterator, program, ptrFloat32Array, ptrUint32Array, ptrUint8Array, scripts, setBegin, setByteLength, setByteOffset, setClassIndex, setFloat32, setFragmented, setIterOffset, setLength, setLinked, setLinkedPtri, setNeedRecalc, setNeedUpload, setObject, setParent, setResvFloat32, setResvUint16, setResvUint32, setResvUint8, setTranslated, setUint16, setUint32, setUint64, setUint8, setarrayFloat32, setarrayUint16, setarrayUint32, setarrayUint8, shaders, space, state, subarrayFloat32, subarrayUint16, subarrayUint32, subarrayUint8, textDecoder, textEncoder, threadId, ticks, u16, u32, u64, ui8, unlock, uuid, vShader, warn, workers;
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
  Object.defineProperties(Object, {
    deleteProperty: {
      value: function(target, prop) {
        Reflect.defineProperty(target, prop, {
          value: 0
        });
        Reflect.deleteProperty(target, prop);
        return target;
      }
    },
    deleteProperties: {
      value: function(target, props = []) {
        var j, len, p;
        for (j = 0, len = props.length; j < len; j++) {
          p = props[j];
          this.deleteProperty(target, p);
        }
        return target;
      }
    }
  });
  Symbol.pointer = "|[Pointer]|";
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
  textEncoder = new TextEncoder();
  textDecoder = new TextDecoder();
  classes.register = function(Class) {
    var i;
    if (-1 === (i = this.indexOf(Class))) {
      i += this.push(Class);
    }
    return Class.classIndex = i;
  };
  classes.global = function(Class) {
    var handler;
    handler = function() {
      if (!isNaN(arguments[0])) {
        return new Class(...arguments);
      }
      return Class.create(...arguments);
    };
    Object.defineProperties(handler, {
      allocs: {
        value: Pointer.allocs
      },
      classIndex: {
        value: this.register(Class)
      },
      BPE: {
        value: Class.BPE
      }
    });
    return self[Class.name] = handler;
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
  ITERATION_PER_THREAD = 2;
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
  BYTELENGTH_128MB = 512 * 512 * 512;
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
  HEADER_LINKEDPTRI = 6;
  HEADER_INDEXCOUNT++; //? 7
  HEADER_ITEROFFSET = 7;
  HEADER_INDEXCOUNT++; //? 6
  HEADER_ITERATORI = 8;
  HEADER_INDEXCOUNT++; //? 32
  HEADER_ITERCLASSI = 9;
  HEADER_INDEXCOUNT++; //? 32
  HEADER_NEEDRECALC = 10 * 4;
  HEADER_INDEXCOUNT++; //? 32
  HEADER_NEEDUPLOAD = 10 * 4 + 1;
  HEADER_TRANSLATED = 10 * 4 + 2;
  HEADER_FRAGMENTED = 10 * 4 + 3;
  HEADER_RESVINDEX = 12;
  HEADER_INDEXCOUNT++; //? 9 
  HEADER_RESVINDEX4 = HEADER_RESVINDEX;
  HEADER_RESVINDEX2 = HEADER_RESVINDEX * 2;
  HEADER_RESVINDEX1 = HEADER_RESVINDEX * 4;
  if (HEADER_INDEXCOUNT > 32) {
    throw /HEADER_INDEXCOUNT/;
  }
  HEADER_INDEXCOUNT = 32;
  self.mallocs = mallocs = function(ptri = HEADER_INDEXCOUNT) {
    var ptr, results;
    results = [];
    while (ptr = getPointer(ptri)) {
      ptri += HEADER_INDEXCOUNT;
      results.push(ptr);
    }
    return results;
  };
  getByteOffset = function(ptri) {
    return u32.at(ptri);
  };
  setByteOffset = function(ptri, byteOffset) {
    dvw.setUint32(ptri * 4, byteOffset, LE);
    return byteOffset;
  };
  getByteLength = function(ptri) {
    return u32[HEADER_BYTELENGTH + ptri];
  };
  setByteLength = function(ptri, byteLength) {
    return u32[HEADER_BYTELENGTH + ptri] = byteLength;
  };
  getLength = function(ptri) {
    return u32[HEADER_LENGTH + ptri];
  };
  setLength = function(ptri, length) {
    return u32[HEADER_LENGTH + ptri] = length;
  };
  getBegin = function(ptri) {
    return u32[HEADER_BEGIN + ptri];
  };
  getIndex = function(ptri, index = 0) {
    return u32[HEADER_BEGIN + ptri] + index;
  };
  setBegin = function(ptri, begin) {
    return u32[HEADER_BEGIN + ptri] = begin;
  };
  getClassIndex = function(ptri) {
    return u32[HEADER_CLASSINDEX + ptri];
  };
  setClassIndex = function(ptri, clsi) {
    return u32[HEADER_CLASSINDEX + ptri] = clsi;
  };
  getPointer = function(ptri) {
    var clsi;
    if (clsi = u32[HEADER_CLASSINDEX + ptri]) {
      return new classes[clsi](ptri);
    }
    return void 0;
  };
  getClass = function(ptri) {
    return classes[u32[HEADER_CLASSINDEX + ptri]];
  };
  getParentPtri = function(ptri) {
    return u32[HEADER_PARENTPTRI + ptri];
  };
  getLinkedPtri = function(ptri) {
    return u32[HEADER_LINKEDPTRI + ptri];
  };
  setLinkedPtri = function(ptri, ptrj) {
    return u32[HEADER_LINKEDPTRI + ptri] = ptrj;
  };
  setParent = function(ptri, ptrj) {
    return u32[HEADER_PARENTPTRI + ptri] = ptrj;
  };
  setLinked = function(ptri, ptrj) {
    return u32[HEADER_LINKEDPTRI + ptri] = ptrj;
  };
  getObject = function(ptri) {
    return ptri.storage[u32[HEADER_LINKEDPTRI + ptri]];
  };
  setObject = function(ptri, object) {
    return u32[HEADER_LINKEDPTRI + ptri] = ptri.store(object);
  };
  getParent = function(ptri) {
    var Class, ptrj;
    if (!(ptrj = u32[HEADER_PARENTPTRI + ptri])) {
      return;
    }
    Class = classes[u32[HEADER_CLASSINDEX + ptrj]];
    return new Class(ptrj);
  };
  getLinked = function(ptri) {
    var Class, ptrj;
    if (!(ptrj = u32[HEADER_LINKEDPTRI + ptri])) {
      return;
    }
    Class = classes[u32[HEADER_CLASSINDEX + ptrj]];
    return new Class(ptrj);
  };
  findLinkeds = function(ptri, Class) {
    var clsi, i, list, ptrj;
    ptrj = u32[1];
    clsi = Class.classIndex;
    list = new Array();
    i = 0;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_LINKEDPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      list[i++] = new classes[clsi](ptrj);
    }
    return list;
  };
  getChilds = function(ptri, Class) {
    var clsi, i, list, ptrj;
    ptrj = u32[1];
    list = new Array();
    i = 0;
    if (Class) {
      clsi = Class.classIndex;
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
          continue;
        }
        Class = classes[u32[HEADER_CLASSINDEX + ptrj]];
        list[i++] = new Class(ptrj);
      }
    } else {
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        Class = classes[u32[HEADER_CLASSINDEX + ptrj]];
        list[i++] = new Class(ptrj);
      }
    }
    return list;
  };
  getChildsPtri = function(ptri, Class) {
    var clsi, i, list, ptrj;
    ptrj = u32[1];
    list = new Array();
    i = 0;
    if (Class) {
      clsi = Class.classIndex;
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
          continue;
        }
        list[i++] = ptrj;
      }
    } else {
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        list[i++] = ptrj;
      }
    }
    return list;
  };
  getChildsCount = function(ptri, clsi) {
    var i, ptrj;
    ptrj = u32[1];
    i = 0;
    if (clsi) {
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
          continue;
        }
        i++;
      }
    } else {
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        i++;
      }
    }
    return i;
  };
  prepareIterator = function(Class, ptri = 0) {
    if (Class) {
      Atomics.store(u32, ptri + HEADER_ITERCLASSI, Class.classIndex);
    }
    Atomics.compareExchange(u32, ptri + HEADER_ITERATORI, 0, u32.at(1));
    return +ptri;
  };
  finalizeIterator = function(iter) {
    Atomics.store(u32, iter + HEADER_ITERCLASSI, 0);
    Atomics.store(u32, iter + HEADER_ITERATORI, 0);
    return 0;
  };
  iterateGlobalAllocs = function(ptri) {
    var Class, clsi, next, ptrj;
    clsi = Atomics.load(u32, ptri + HEADER_ITERCLASSI);
    ptrj = Atomics.sub(u32, ptri + HEADER_ITERATORI, HEADER_INDEXCOUNT);
    if (ptrj === ptri) {
      return iteratePrepared(ptri);
    }
    if (!ptrj || u32[1] < ptrj) {
      return finalizeIterator(ptri);
    }
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      next = ptrj - HEADER_INDEXCOUNT;
      if (next !== Atomics.compareExchange(u32, ptri + HEADER_ITERATORI, ptrj, next)) {
        Atomics.store(u32, ptri + HEADER_ITERATORI, ptrj);
        Class = classes[clsi];
        return new Class(ptrj);
      }
    }
    return 0;
  };
  iteratePrepared = function(ptri) {
    var Class, clsi, next, ptrj;
    clsi = Atomics.load(u32, ptri + HEADER_ITERCLASSI);
    ptrj = Atomics.sub(u32, ptri + HEADER_ITERATORI, HEADER_INDEXCOUNT);
    if (ptrj === ptri) {
      return iteratePrepared(ptri);
    }
    if (!ptrj || u32[1] < ptrj) {
      return finalizeIterator(ptri);
    }
    if (clsi) {
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
          continue;
        }
        next = ptrj - HEADER_INDEXCOUNT;
        if (next !== Atomics.compareExchange(u32, ptri + HEADER_ITERATORI, ptrj, next)) {
          Atomics.store(u32, ptri + HEADER_ITERATORI, ptrj);
          Class = classes[clsi];
          return new Class(ptrj);
        }
      }
    } else {
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
          continue;
        }
        next = ptrj - HEADER_INDEXCOUNT;
        if (next !== Atomics.compareExchange(u32, ptri + HEADER_ITERATORI, ptrj, next)) {
          Atomics.store(u32, ptri + HEADER_ITERATORI, ptrj);
          Class = classes[u32[HEADER_CLASSINDEX + ptrj]];
          return new Class(ptrj);
        }
      }
    }
    return 0;
  };
  findChilds = function(ptri, Class) {
    var clsi, i, list, ptrj;
    ptrj = u32[1];
    clsi = Class.classIndex;
    list = new Array();
    i = 0;
    while (ptrj -= HEADER_INDEXCOUNT) {
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
  findChild = function(ptri, Class, create = false) {
    var clsi, obj, ptrj;
    ptrj = u32[1];
    clsi = Class.classIndex;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      return new classes[clsi](ptrj);
    }
    if (!create) {
      return;
    }
    setParent(obj = new Class, ptri);
    return obj;
  };
  inherit = function(ptri, Class) {
    var clsi, ptrj;
    ptrj = u32[1];
    clsi = Class.classIndex;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      return new Class(ptrj);
    }
    if (!(ptri = u32[HEADER_PARENTPTRI + ptri])) {
      return void 0;
    }
    return inherit(ptri, Class);
  };
  findChildRecursive = function(ptri, Class, clsi) {
    var ptr, ptrN, ptrj;
    ptrN = u32[1];
    clsi = clsi || Class.classIndex;
    ptrj = ptrN;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      return new Class(ptrj);
    }
    ptrj = ptrN;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (!(ptr = findChildRecursive(ptrj, Class, clsi))) {
        continue;
      }
      return ptr;
    }
    return void 0;
  };
  findChildsRecursive = function(ptri, Class, clsi, childs = []) {
    var ptr, ptrN, ptrj;
    ptrN = u32[1];
    clsi = clsi || Class.classIndex;
    ptrj = ptrN;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      childs.push(new Class(ptrj));
    }
    ptrj = ptrN;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (!(ptr = findChildsRecursive(ptrj, Class, clsi, childs))) {
        continue;
      }
      childs.push(ptr);
    }
    return childs;
  };
  findChildsPtri = function(ptri, Class) {
    var clsi, i, list, ptrj;
    ptrj = u32[1];
    clsi = Class.classIndex;
    list = new Array();
    i = 0;
    while (ptrj -= HEADER_INDEXCOUNT) {
      if (u32[HEADER_PARENTPTRI + ptrj] - ptri) {
        continue;
      }
      if (u32[HEADER_CLASSINDEX + ptrj] - clsi) {
        continue;
      }
      list[i] = ptrj;
      i++;
    }
    return list;
  };
  getAllocs = function(ptri) {
    var clsi, i, list, ptrj;
    clsi = ptri.classIndex;
    ptrj = u32[1];
    list = new Array();
    i = 0;
    while (ptrj -= HEADER_INDEXCOUNT) {
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
  hitIterOffset = function(ptri, count = ITERATION_PER_THREAD) {
    return Atomics.add(u32, ptri + HEADER_ITEROFFSET, count);
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
    var index;
    index = i + (HEADER_RESVINDEX + ptri);
    return u32[index];
  };
  setResvUint32 = function(ptri, i, v) {
    var index;
    index = i + (HEADER_RESVINDEX + ptri);
    return u32[index] = v;
  };
  addResvUint32 = function(ptri, i, v) {
    var index, value;
    index = i + (HEADER_RESVINDEX + ptri);
    value = u32[index];
    u32[index] = value + v;
    return value;
  };
  getResvUint16 = function(ptri, i) {
    var index;
    index = i + (HEADER_RESVINDEX + ptri) * 2;
    return u16[index];
  };
  setResvUint16 = function(ptri, i, v) {
    var index;
    index = i + (HEADER_RESVINDEX + ptri) * 2;
    return u16[index] = v;
  };
  addResvUint16 = function(ptri, i, v) {
    var value;
    i += (HEADER_RESVINDEX + ptri) * 2;
    value = u16[index];
    u16[index] = value + v;
    return value;
  };
  getResvUint8 = function(ptri, i) {
    i += (HEADER_RESVINDEX + ptri) * 4;
    return dvw.getUint8(i);
  };
  setResvUint8 = function(ptri, i, v) {
    i += (HEADER_RESVINDEX + ptri) * 4;
    dvw.setUint8(i, v);
    return v;
  };
  hitResvUint8 = function(ptri, i = 0) {
    i += (HEADER_RESVINDEX + ptri) * 4;
    if (dvw.getUint8(i)) {
      return 0;
    }
    return ui8[i] = 1;
  };
  addResvUint8 = function(ptri, i, v) {
    var o;
    i += (HEADER_RESVINDEX + ptri) * 4;
    o = dvw.getUint8(i);
    dvw.setUint8(i, o + v);
    return o;
  };
  getResvFloat32 = function(ptri, i) {
    i += HEADER_RESVINDEX + ptri;
    return f32[i];
  };
  setResvFloat32 = function(ptri, i, v) {
    i += HEADER_RESVINDEX + ptri;
    return f32[i] = v;
  };
  addResvFloat32 = function(ptri, i, v) {
    var o;
    i += HEADER_RESVINDEX + ptri;
    o = f32[i];
    f32[i] = o + v;
    return o;
  };
  newFloat32Array = function(ptri, byteOffset = 0, length) {
    byteOffset += getByteOffset(ptri);
    length || (length = getLength(ptri));
    return new Float32Array(buffer, byteOffset, length);
  };
  ptrFloat32Array = function(ptri, byteOffset = 0, length) {
    return new Float32Array(buffer, ptri * 4, length || HEADER_INDEXCOUNT);
  };
  newUint32Array = function(ptri, byteOffset = 0, length) {
    return new Uint32Array(buffer, u32.at(ptri) + byteOffset, length || u32[HEADER_LENGTH + ptri]);
  };
  ptrUint32Array = function(ptri, byteOffset = 0, length) {
    byteOffset += ptri * 4;
    return new Uint32Array(buffer, byteOffset, length);
  };
  newUint8Array = function(ptri, byteOffset = 0, length) {
    return new Uint8Array(buffer, u32.at(ptri) + byteOffset, length || u32[HEADER_LENGTH + ptri]);
  };
  ptrUint8Array = function(ptri, byteOffset = 0, length) {
    return new Uint8Array(buffer, ptri * 4, length || HEADER_INDEXCOUNT * BPE);
  };
  subarrayFloat32 = function(ptri, begin = 0, count) {
    begin += u32[HEADER_BEGIN + ptri];
    return f32.subarray(begin, begin + count);
  };
  subarrayUint32 = function(ptri, begin = 0, count) {
    begin += u32[HEADER_BEGIN + ptri];
    return u32.subarray(begin, begin + count);
  };
  subarrayUint16 = function(ptri, begin = 0, count) {
    begin += u32[HEADER_BEGIN + ptri] * 2;
    return u16.subarray(begin, begin + count);
  };
  subarrayUint8 = function(ptri, begin = 0, count) {
    begin += u32.at(ptri);
    return ui8.subarray(begin, begin + count);
  };
  detachUint8 = function(ptri, begin = 0, count) {
    var array;
    begin += u32.at(ptri);
    count || (count = u32[ptri + HEADER_BYTELENGTH]);
    array = new Uint8Array(count);
    array.set(ui8.subarray(begin, begin + array.length));
    return array;
  };
  setFloat32 = function(ptri, index, value) {
    return f32[u32[HEADER_BEGIN + ptri] + index] = value;
  };
  getFloat32 = function(ptri, index = 0) {
    return f32[u32[HEADER_BEGIN + ptri] + index];
  };
  orFloat32 = function(ptri, index = 0, fn) {
    var name1;
    return f32[name1 = u32[HEADER_BEGIN + ptri] + index] || (f32[name1] = fn.call(ptri));
  };
  fillFloat32 = function(ptri, value, start = 0, count) {
    start += u32[HEADER_BEGIN + ptri];
    f32.fill(value, start, start + count);
    return ptri;
  };
  setarrayFloat32 = function(ptri, array, begin = 0) {
    f32.set(array, begin + u32[HEADER_BEGIN + ptri]);
    return ptri;
  };
  addUint32 = function(ptri, index, value) {
    var v;
    u32[u32[HEADER_BEGIN + ptri] + index] = value + (v = u32[u32[HEADER_BEGIN + ptri] + index]);
    return v;
  };
  setUint32 = function(ptri, index, value) {
    return u32[u32[HEADER_BEGIN + ptri] + index] = value;
  };
  getUint32 = function(ptri, index = 0) {
    return u32[u32[HEADER_BEGIN + ptri] + index];
  };
  getUint16 = function(ptri, index = 0) {
    return u16[u32[HEADER_BEGIN + ptri] * 2 + index];
  };
  setUint16 = function(ptri, index, value) {
    return u16[u32[HEADER_BEGIN + ptri] * 2 + index] = value;
  };
  setarrayUint16 = function(ptri, array, begin = 0) {
    u16.set(array, begin + u32[HEADER_BEGIN + ptri] * 2);
    return this;
  };
  getUint64 = function(ptri, index = 0) {
    return Number(u64[u32[HEADER_BEGIN + ptri] / 2 + index]);
  };
  setUint64 = function(ptri, index = 0, value) {
    return Number(u64[u32[HEADER_BEGIN + ptri] / 2 + index] = BigInt(value));
  };
  orUint32 = function(ptri, index = 0, fn) {
    var name1;
    return u32[name1 = u32[HEADER_BEGIN + ptri] + index] || (u32[name1] = fn.call(ptri));
  };
  fillUint32 = function(ptri, value, start = 0, count) {
    start += u32[HEADER_BEGIN + ptri];
    u32.fill(value, start, start + count);
    return ptri;
  };
  setarrayUint32 = function(ptri, array, begin = 0) {
    u32.set(array, begin + u32[HEADER_BEGIN + ptri]);
    return ptri;
  };
  setUint8 = function(ptri, index, value) {
    return ui8[u32.at(ptri) + index] = value;
  };
  getUint8 = function(ptri, index = 0) {
    return ui8[u32.at(ptri) + index];
  };
  orUint8 = function(ptri, index = 0, fn) {
    var name1;
    return ui8[name1 = u32.at(ptri) + index] || (ui8[name1] = fn.call(ptri));
  };
  fillUint8 = function(ptri, value, start = 0, count) {
    start += u32.at(ptri);
    ui8.fill(value, start, start + count);
    return ptri;
  };
  setarrayUint8 = function(ptri, array, begin = 0) {
    ui8.set(array, begin + u32.at(ptri));
    return ptri;
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
    while (OFFSET_PTR <= (ptri -= HEADER_INDEXCOUNT)) {
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
    u16 = new Uint16Array(buffer);
    u32 = new Uint32Array(buffer);
    u64 = new BigUint64Array(buffer);
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
    Atomics.add(u32, 0, HEADER_INDEXCOUNT * 1e5);
    Atomics.add(u32, 1, HEADER_INDEXCOUNT);
    state(THREADS_NULL);
  }
  self.emit = function(event, detail) {
    return self.dispatchEvent(new CustomEvent(event, {detail}));
  };
  pipe.emit = function(event, detail) {
    return this.postMessage(event);
  };
  classes.register(Pointer = (function() {
    class Pointer extends Number {
      constructor() {
        super(arguments[0] || Atomics.add(u32, 1, HEADER_INDEXCOUNT));
        if (isWindow) {
          this.init(arguments[1]);
        }
      }

      malloc(byteLength) {
        var byteOffset;
        byteOffset = Atomics.add(u32, 0, byteLength);
        Atomics.add(u32, 0, 8 - byteLength % 8);
        setBegin(this, byteOffset / this.BPE);
        setLength(this, byteLength / this.BPE);
        setByteOffset(this, byteOffset);
        setByteLength(this, byteLength);
        return this;
      }

      at(i) {
        switch (this.TypedArray) {
          case Uint8Array:
            return getUint8(this, i);
          case Uint16Array:
            return getUint16(this, i);
          case Uint32Array:
            return getUint32(this, i);
          default:
            return getFloat32(this, i);
        }
      }

      init(props) {
        var Class, byteLength, j, len, prop, value;
        if (!getClassIndex(this)) {
          setClassIndex(this, this.constructor.classIndex);
          if (byteLength = this.constructor.byteLength) {
            this.malloc(byteLength);
          }
        }
        if (props) {
          for (prop in props) {
            value = props[prop];
            if (this.hasOwnProperty(prop)) {
              this[prop] = value;
              continue;
            }
            for (j = 0, len = classes.length; j < len; j++) {
              Class = classes[j];
              if (prop !== Class.prototype.name) {
                continue;
              }
              this.add(new Class().set(value));
              break;
            }
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
        }
        this.malloc(byteLength);
        switch (this.TypedArray) {
          case Uint8Array:
            setarrayUint8(this, array);
            break;
          case Uint16Array:
            setarrayUint16(this, array);
            break;
          case Uint32Array:
            setarrayUint32(this, array);
            break;
          default:
            setarrayFloat32(this, array);
        }
        return this;
      }

      toString() {
        var err;
        err = {};
        Error.captureStackTrace(err);
        console.error("toStringCalled", err.stack);
        queueMicrotask(function() {
          throw new Error(err);
        });
        return super.toString(...arguments);
      }

      store(object) {
        var i;
        if (-1 === (i = this.storage.indexOf(object))) {
          i += this.storage.push(object);
        }
        return i;
      }

      add(ptr) {
        return setParent(ptr, this);
      }

      append(ptr) {
        setParent(ptr, this);
        return ptr;
      }

      static allocs() {
        return getAllocs(this);
      }

      static create() {
        return new this(null, ...arguments);
      }

      [Symbol.iterator]() {
        var Class, iterator;
        Class = this.constructor.iterate;
        iterator = prepareIterator(Class, this);
        return {
          next: function() {
            var next;
            if (next = iteratePrepared(iterator)) {
              return {
                value: next
              };
            }
            return {
              done: 1
            };
          }
        };
      }

    };

    Pointer.byteLength = 0;

    Pointer.prototype.TypedArray = Float32Array;

    Pointer.isPtr = true;

    Pointer.prototype.isPtri = true;

    Pointer.BPE = BPE;

    Pointer.prototype.BPE = Pointer.BPE;

    Pointer.prototype.storage = [, ];

    Object.defineProperties(Pointer.prototype, {
      childs: {
        get: function() {
          var Class, childs;
          childs = getChilds(this);
          if (!(Class = this.constructor.iterate)) {
            return childs;
          } else {
            return childs.filter(function(ptr) {
              return ptr instanceof Class;
            });
          }
        }
      },
      parent: {
        get: function() {
          return getParent(this);
        },
        set: function(ptri) {
          return setParent(this, ptri);
        }
      },
      buffer: {
        get: function() {
          return new this.TypedArray(buffer, getByteOffset(this), getLength(this));
        }
      }
    });

    Object.defineProperties(Pointer.prototype, {
      ["{[Pointer]}"]: {
        get: function() {
          return ptrUint32Array(this, 0, HEADER_INDEXCOUNT);
        }
      }
    });

    return Pointer;

  }).call(this));
  classes.register(Vector4 = (function() {
    class Vector4 extends Pointer {
      getX() {
        return getFloat32(this, 0);
      }

      getY() {
        return getFloat32(this, 1);
      }

      getZ() {
        return getFloat32(this, 2);
      }

      getW() {
        return getFloat32(this, 3);
      }

      setX(v) {
        return setFloat32(this, 0, v);
      }

      setY(v) {
        return setFloat32(this, 1, v);
      }

      setZ(v) {
        return setFloat32(this, 2, v);
      }

      setW(v) {
        return setFloat32(this, 3, v);
      }

      * [Symbol.iterator]() {
        var w, x, y, z;
        [x, y, z, w] = subarrayFloat32(this, 0, 4);
        yield x;
        yield y;
        yield z;
        return (yield w);
      }

    };

    Vector4.byteLength = 4 * Vector4.BPE;

    Object.defineProperties(Vector4.prototype, {
      x: {
        get: Vector4.prototype.getX,
        set: Vector4.prototype.setX
      },
      y: {
        get: Vector4.prototype.getY,
        set: Vector4.prototype.setY
      },
      z: {
        get: Vector4.prototype.getZ,
        set: Vector4.prototype.setZ
      },
      w: {
        get: Vector4.prototype.getW,
        set: Vector4.prototype.setW
      }
    });

    Object.deleteProperties(Vector4.prototype, ["childs"]);

    return Vector4;

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

      apply(draw, attribute, index, count) {
        var end, offset, start, stride;
        if (attribute.size - 4) {
          throw /SIZE_MUST_EQUALTO_4/;
        }
        //todo make inherited
        //todo findChild draw, Color || etc..
        stride = attribute.stride;
        offset = draw.byteOffset + attribute.offset;
        start = getByteOffset(this);
        end = start + getByteLength(this);
        while (count--) {
          ui8.copyWithin(offset, start, end);
          offset += stride;
        }
        return 1;
      }

      * [Symbol.iterator]() {
        var a, b, g, r;
        [r, g, b, a = 1] = subarrayFloat32(this, 0, 4);
        yield r;
        yield g;
        yield b;
        return (yield a);
      }

    };

    Color.prototype.name = "color";

    Color.byteLength = 4 * Color.BPE;

    Object.defineProperties(Color.prototype, {
      f32: {
        get: function() {
          return newFloat32Array(this, 0, 4);
        }
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

    Object.deleteProperties(Color.prototype, ["childs"]);

    return Color;

  }).call(this));
  classes.register(UV = (function() {
    class UV extends Vector4 {};

    UV.prototype.name = "uv";

    return UV;

  }).call(this));
  classes.register(Texture = (function() {
    class Texture extends Vector4 {};

    Texture.prototype.name = "texture";

    return Texture;

  }).call(this));
  classes.register(Position = (function() {
    class Position extends Vector4 {
      apply(draw, attribute, index, count) {
        var offset, stride, tx, ty, tz, vertices, x0, y0, z0;
        if (attribute.size - 4) {
          throw /SIZE_MUST_EQUALTO_4/;
        }
        stride = attribute.stride;
        offset = draw.byteOffset + attribute.offset;
        vertices = draw.mesh.vertices(index, count);
        [tx, ty, tz] = subarrayFloat32(this, 0, 3);
        //todo apply rotation and scale too
        //todo make inherited
        //todo findChild draw, Position || etc..
        while (count--) {
          [x0, y0, z0] = vertices.subarray(index, index + 3);
          dvw.setFloat32(offset, x0 + tx, LE);
          dvw.setFloat32(offset + 4, y0 + ty, LE);
          dvw.setFloat32(offset + 8, z0 + tz, LE);
          offset += stride;
          index += 3;
        }
        return 1;
      }

    };

    Position.prototype.name = "position";

    return Position;

  }).call(this));
  classes.register(Scale = (function() {
    class Scale extends Vector4 {
      apply(begin, count, stride, offset) {
        var i, sx, sy, sz;
        [sx, sy, sz] = this.buffer;
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
        return getFloat32(this, 0);
      }

      sinX() {
        return getFloat32(this, 1);
      }

      cosX() {
        return getFloat32(this, 2);
      }

      getY() {
        return getFloat32(this, 3);
      }

      sinY() {
        return getFloat32(this, 4);
      }

      cosY() {
        return getFloat32(this, 5);
      }

      getZ() {
        return getFloat32(this, 6);
      }

      sinZ() {
        return getFloat32(this, 7);
      }

      cosZ() {
        return getFloat32(this, 8);
      }

      setX(v) {
        fillUint32(this, 0, 3);
        setFloat32(this, 0, v);
        setFloat32(this, 1, Math.sin(v));
        return setFloat32(this, 2, Math.cos(v));
      }

      setY(v) {
        fillUint32(this, 3, 3);
        setFloat32(this, 3, v);
        setFloat32(this, 4, Math.sin(v));
        return setFloat32(this, 5, Math.cos(v));
      }

      setZ(v) {
        fillUint32(this, 6, 3);
        setFloat32(this, 6, v);
        setFloat32(this, 7, Math.sin(v));
        return setFloat32(this, 8, Math.cos(v));
      }

      set(v) {
        super.set() && ([this.x, this.y, this.z] = v);
        return this;
      }

      apply(begin, count, stride, offset) {
        var cosX, cosY, cosZ, i, sinX, sinY, sinZ, x, y, z;
        [x, sinX, cosX, y, sinY, cosY, z, sinZ, cosZ] = this.buffer;
        while (count--) {
          i = (count * stride + offset) / 4;
          f32[i] *= sinX * cosX;
          f32[i + 1] *= cosY * sinY;
          f32[2 + i] *= sinZ * cosZ;
        }
        return 0;
      }

      * [Symbol.iterator]() {
        yield getFloat32(this, 0);
        yield getFloat32(this, 3);
        return (yield getFloat32(this, 6));
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

    Object.deleteProperties(Rotation.prototype, ["childs"]);

    return Rotation;

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
  classes.register(GLParamerer = (function() {
    class GLParamerer extends Pointer {
      * [Symbol.iterator]() {
        return (yield getUint16(this, 0));
      }

      value() {
        return getUint16(this, 0);
      }

    };

    GLParamerer.byteLength = 2;

    GLParamerer.prototype.TypedArray = Uint16Array;

    return GLParamerer;

  }).call(this));
  classes.register(ClearMask = (function() {
    class ClearMask extends GLParamerer {
      set() {
        return super.set([...arguments].flat());
      }

    };

    ClearMask.prototype.name = "clearMask";

    ClearMask.prototype.DEPTH_BUFFER_BIT = WebGLRenderingContext.DEPTH_BUFFER_BIT;

    ClearMask.prototype.COLOR_BUFFER_BIT = WebGLRenderingContext.COLOR_BUFFER_BIT;

    ClearMask.prototype.STENCIL_BUFFER_BIT = WebGLRenderingContext.STENCIL_BUFFER_BIT;

    ClearMask.default = 16640; //? depth | color

    return ClearMask;

  }).call(this));
  classes.register(ClearColor = (function() {
    class ClearColor extends Color {};

    ClearColor.prototype.name = "clearColor";

    return ClearColor;

  }).call(this));
  classes.register(GLPointer = (function() {
    class GLPointer extends Pointer {
      setGLObject() {
        return setResvUint8(this, 1, this.store(arguments[0]));
      }

      getGLObject() {
        var object, storei;
        if (storei = getResvUint8(this, 1)) {
          return this.storage[storei];
        }
        object = this.create();
        storei = setResvUint8(this, 1, this.store(object));
        return object;
      }

      getIsActive() {
        return getResvUint8(this, 0);
      }

      setIsActive() {
        var current, request;
        current = getResvUint8(this, 0);
        request = arguments[0];
        if (request - current) {
          if (setResvUint8(this, 0, request)) {
            this.enable();
          } else {
            this.disable();
          }
        }
        return request;
      }

      disable() {
        return this;
      }

      enable() {
        throw {
          [this.constructor.name]: /DEFINE_ENABLE_REQUIRED/
        };
      }

    };

    Object.defineProperties(GLPointer.prototype, {
      glObject: {
        get: GLPointer.prototype.getGLObject,
        set: GLPointer.prototype.setGLObject
      },
      isActive: {
        get: GLPointer.prototype.getIsActive,
        set: GLPointer.prototype.setIsActive
      }
    });

    return GLPointer;

  }).call(this));
  classes.register(Context = (function() {
    class Context extends GLPointer {
      getProgram() {
        var programs;
        programs = findChilds(this, Program);
        if (!(program = programs.find(function(p) {
          return p.isActive;
        }))) {
          if (!(program = programs[0])) {
            setParent(program = new Program, this);
          }
        }
        return program;
      }

      getVertexShader() {
        var j, len, ref, shader, source;
        shaders = findChilds(this, VertexShader);
        if (!(shader = shaders.find(function(p) {
          return p.isActive;
        }))) {
          if (!(shader = shaders[0])) {
            ref = VertexShader.DocumentScripts;
            for (j = 0, len = ref.length; j < len; j++) {
              source = ref[j];
              setParent(shader = new VertexShader(), this);
              setParent(new ShaderSource().set(source), shader);
            }
            shader = findChild(this, VertexShader);
          }
        }
        return shader;
      }

      getFragmentShader() {
        var j, len, ref, shader, source;
        shaders = findChilds(this, FragmentShader);
        if (!(shader = shaders.find(function(p) {
          return p.isActive;
        }))) {
          if (!(shader = shaders[0])) {
            ref = FragmentShader.DocumentScripts;
            for (j = 0, len = ref.length; j < len; j++) {
              source = ref[j];
              setParent(shader = new FragmentShader(), this);
              setParent(new ShaderSource().set(source), shader);
            }
            shader = findChild(this, FragmentShader);
          }
        }
        return shader;
      }

      getDrawBuffer() {
        var buffer_;
        buffers = findChilds(this, DrawBuffer);
        if (!(buffer_ = buffers.find(function(p) {
          return p.isActive;
        }))) {
          if (!(buffer_ = buffers[0])) {
            setParent(buffer_ = new DrawBuffer, this);
          }
        }
        return buffer_;
      }

      getClearMask() {
        var clearMask;
        if (!(clearMask = inherit(this, ClearMask))) {
          setParent(clearMask = new ClearMask, this);
          clearMask.set(ClearMask.default);
        }
        return clearMask;
      }

      getClearColor() {
        var clearColor;
        if (!(clearColor = inherit(this, ClearColor))) {
          setParent(clearColor = new ClearColor, this);
        }
        return clearColor;
      }

      create(top, left, width, height) {
        var element;
        top || (top = 0);
        left || (left = 0);
        width || (width = INNER_WIDTH);
        height || (height = INNER_HEIGHT);
        element = !this.isOffscreen ? this.resize(top, left, width, height, document.body.appendChild(document.createElement('canvas'))) : new OffscreenCanvas(width, height);
        return element.getContext(this.contextType);
      }

      enable() {
        if (!getUint8(this, 3)) {
          setUint8(this, 3, 1);
          this.prepareRender();
        }
        return this;
      }

      resize(top, left, width, height, canvas) {
        var aspectRatio, pixelRatio;
        canvas || (canvas = this.glObject.canvas);
        pixelRatio = devicePixelRatio || 1;
        aspectRatio = width / height;
        this.canvasInfo = {top, left, width, height, aspectRatio, pixelRatio};
        return Object.assign(canvas, {
          width: pixelRatio * width,
          height: pixelRatio * height,
          style: {
            width: CSS.px(width),
            height: CSS.px(height),
            inset: CSS.px(0),
            position: "fixed"
          }
        });
      }

      prepareRender() {
        var aspectRatio, height, left, pixelRatio, top, width;
        ({top, left, width, height, aspectRatio, pixelRatio} = this.canvasInfo);
        this.viewport(left, top, width, height);
        this.clearColor();
        this.clear();
        return 1;
      }

      viewport() {
        this.glObject.viewport(...arguments);
        return 0;
      }

      clear() {
        this.glObject.clear(this.getClearMask().value());
        return 0;
      }

      clearColor() {
        var clearColor;
        if (clearColor = this.getClearColor()) {
          this.glObject.clearColor(...clearColor);
        }
        return 0;
      }

      getCanvasInfo() {
        var aspectRatio, height, left, pixelRatio, top, width;
        [top, left, width, height, aspectRatio, pixelRatio] = subarrayFloat32(this, 0, 6);
        top || (top = 0);
        left || (left = 0);
        width || (width = INNER_WIDTH);
        height || (height = INNER_HEIGHT);
        pixelRatio || (pixelRatio = devicePixelRatio || 1);
        aspectRatio || (aspectRatio = width / height);
        return {top, left, width, height, aspectRatio, pixelRatio};
      }

      setCanvasInfo() {
        var parameters;
        parameters = arguments[0] || {};
        return setarrayFloat32(this, Object.values({...this.parameters, ...parameters}));
      }

      getProgramParameter(program, parameter) {
        return this.glObject.getProgramParameter(program.glObject, parameter);
      }

      getActiveAttrib(program, index) {
        return this.glObject.getActiveAttrib(program.glObject, index);
      }

      getAttribLocation(program, name) {
        return this.glObject.getAttribLocation(program.glObject, name);
      }

      createProgram() {
        return this.glObject.createProgram();
      }

      createVertexShader() {
        return this.glObject.createShader(this.glObject.VERTEX_SHADER);
      }

      createFragmentShader() {
        return this.glObject.createShader(this.glObject.FRAGMENT_SHADER);
      }

      createBuffer() {
        return this.glObject.createBuffer();
      }

      attachShader(program, shader) {
        return this.glObject.attachShader(program.glObject, shader.glObject);
      }

      compileShader(shader) {
        return this.glObject.compileShader(shader.glObject);
      }

      shaderSource(shader, source) {
        return this.glObject.shaderSource(shader.glObject, source.text);
      }

      linkProgram(program) {
        return this.glObject.linkProgram(program.glObject);
      }

      useProgram(program) {
        return this.glObject.useProgram(program.glObject);
      }

      bindBuffer(drawBuffer) {
        return this.glObject.bindBuffer(drawBuffer.TARGET, drawBuffer.glObject);
      }

      getShaderParameter(shader, parameter) {
        return this.glObject.getShaderParameter(shader.glObject, parameter);
      }

      getShaderInfoLog(shader) {
        return this.glObject.getShaderInfoLog(shader.glObject);
      }

      getPrecisionFormat(shader) {
        return this.glObject.getShaderPrecisionFormat(shader.glObject);
      }

      getShaderSource(shader) {
        return this.glObject.getShaderSource(shader.glObject);
      }

      alloc(pointCount) {
        return this.drawBuffer.allocTriangles(pointCount);
      }

    };

    Context.byteLength = 16 * Context.BPE;

    Context.prototype.TypedArray = Float32Array;

    Context.prototype.isContext = true;

    Context.prototype.isOffscreen = false;

    Context.prototype.contextType = "webgl2";

    Object.defineProperties(Context.prototype, {
      canvasInfo: {
        get: Context.prototype.getCanvasInfo,
        set: Context.prototype.setCanvasInfo
      },
      program: {
        get: Context.prototype.getProgram
      },
      vertexShader: {
        get: Context.prototype.getVertexShader
      },
      fragmentShader: {
        get: Context.prototype.getFragmentShader
      },
      drawBuffer: {
        get: Context.prototype.getDrawBuffer
      }
    });

    Object.deleteProperties(Context.prototype, ["buffer"]);

    return Context;

  }).call(this));
  classes.register(Draw = (function() {
    class Draw extends Pointer {
      refresh() {
        var applier, attr, count, drawBuffer, glProgram, index, j, len, readBuffer, ref, vertShader;
        count = this.count; //todo --> ITERATION_PER_THREAD
        index = hitIterOffset(this, count);
        readBuffer = this.mesh.vertices(index, count);
        drawBuffer = this.buffer;
        vertShader = this.vertexShader;
        ref = this.attributes;
        for (j = 0, len = ref.length; j < len; j++) {
          attr = ref[j];
          if (applier = findChild(this.mesh, attr.Class)) {
            applier.apply(this, attr, index, count);
          }
          attr.refresh();
        }
        gl = this.parent.parent.glObject;
        glProgram = this.parent.parent.program.glObject;
        return this.parent.upload(this);
      }

    };

    Draw.prototype.isDraw = true;

    Object.defineProperties(Draw.prototype, {
      begin: {
        get: function() {
          return getBegin(this);
        },
        set: function() {
          return setBegin(this, arguments[0]);
        }
      },
      length: {
        get: function() {
          return getLength(this);
        },
        set: function() {
          return setLength(this, arguments[0]);
        }
      },
      byteLength: {
        get: function() {
          return getByteLength(this);
        },
        set: function() {
          return setByteLength(this, arguments[0]);
        }
      },
      byteOffset: {
        get: function() {
          return getByteOffset(this);
        },
        set: function() {
          return setByteOffset(this, arguments[0]);
        }
      },
      mesh: {
        get: function() {
          return getLinked(this);
        },
        set: function() {
          return setLinked(this, arguments[0]);
        }
      },
      vertexShader: {
        get: function() {
          return new VertexShader(getResvUint32(this, 5));
        },
        set: function() {
          return setResvUint32(this, 5, arguments[0]);
        }
      },
      type: {
        get: function() {
          return getResvUint16(this, 1);
        },
        set: function() {
          return setResvUint16(this, 1, arguments[0]);
        }
      },
      bufferOffset: {
        get: function() {
          return getResvUint32(this, 1);
        },
        set: function() {
          return setResvUint32(this, 1, arguments[0]);
        }
      },
      count: {
        get: function() {
          return getResvUint32(this, 3);
        },
        set: function() {
          return setResvUint32(this, 3, arguments[0]);
        }
      },
      start: {
        get: function() {
          return getResvUint32(this, 4);
        },
        set: function() {
          return setResvUint32(this, 4, arguments[0]);
        }
      },
      buffer: {
        get: function() {
          return new Float32Array(buffer, getByteOffset(this), getLength(this));
        }
      },
      attributes: {
        get: function() {
          var c, i, j, len, meshChilds, results, s, shaderAttrs, shaderClasses;
          meshChilds = getChildsPtri(getLinkedPtri(this));
          shaderAttrs = getChildsPtri(getResvUint32(this, 5), Attribute);
          shaderClasses = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = shaderAttrs.length; j < len; j++) {
              s = shaderAttrs[j];
              results.push(getLinkedPtri(s));
            }
            return results;
          })();
          results = [];
          for (j = 0, len = meshChilds.length; j < len; j++) {
            c = meshChilds[j];
            if (-1 !== (i = shaderClasses.indexOf(getClassIndex(c)))) {
              results.push(new Attribute(shaderAttrs[i]));
            }
          }
          return results;
        }
      }
    });

    return Draw;

  }).call(this));
  classes.global(Mesh = (function() {
    class Mesh extends Pointer {
      static create(props = {}) {
        var matter;
        matter = new this;
        if (props.vertices) {
          matter.set(props.vertices);
          delete props.vertices;
        }
        return matter.init(props);
      }

      draw(root1, type) {
        var child, j, len, ref;
        this.root = root1;
        this.root.drawBuffer.draw(this, type);
        ref = findChilds(this, Mesh);
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.draw(this.root, type);
        }
        return this;
      }

      vertices(index = 0, count = 1) {
        return subarrayFloat32(this, 3 * index, 3 * count);
      }

      vertex(index = 0) {
        return subarrayFloat32(this, 3 * index, 3);
      }

      line(index = 0) {
        return subarrayFloat32(this, 3 * index, 6);
      }

      triangle(index = 0) {
        return subarrayFloat32(this, 9 * index, 9);
      }

      offsets(index = 0, count = this.pointCount) {
        var b, l;
        return {
          begin: b = index * 3 + getBegin(this),
          length: l = count * 3,
          end: l + b,
          byteOffset: this.BPE * b,
          byteLength: this.BPE * l
        };
      }

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
        if (rotation = findInheritable(this, "rotation")) {
          rotation.apply(begin, count);
        }
        //todo must read rotated, not original begin 
        if (position = findInheritable(this, "position")) {
          position.apply(begin, count);
        }
        if (scale = findInheritable(this, "scale")) {
          scale.apply(begin, count);
        }
        return 0;
      }

    };

    Mesh.prototype.isDrawable = true;

    Object.defineProperties(Mesh.prototype, {
      info: {
        get: function() {
          var counts, i;
          return {
            counts: counts = {
              points: getLength(this) / 3,
              lines: -1 + getLength(this) / 3,
              triangles: Math.trunc(getLength(this) / 9)
            },
            offset: this.offsets(),
            shapes: {
              points: (function() {
                var results;
                if (!(i = 0)) {
                  results = [];
                  while (i < counts.points) {
                    results.push(this.vertex(i++));
                  }
                  return results;
                }
              }).call(this),
              lines: (function() {
                var results;
                if (!(i = 0)) {
                  results = [];
                  while (i < counts.lines) {
                    results.push(this.line(i++));
                  }
                  return results;
                }
              }).call(this),
              triangles: (function() {
                var results;
                if (!(i = 0)) {
                  results = [];
                  while (i < counts.triangles) {
                    results.push(this.triangle(i++));
                  }
                  return results;
                }
              }).call(this)
            }
          };
        }
      },
      pointCount: {
        get: function() {
          return getLength(this) / 3;
        }
      },
      draws: {
        get: function() {
          return findLinkeds(this, Draw);
        }
      },
      byteLength: {
        get: function() {
          return getByteLength(this);
        }
      },
      byteOffset: {
        get: function() {
          return getByteOffset(this);
        }
      },
      root: {
        get: function() {
          return getLinked(this);
        },
        set: function() {
          return setLinked(this, arguments[0]);
        }
      }
    });

    return Mesh;

  }).call(this));
  classes.register(DrawBuffer = (function() {
    class DrawBuffer extends GLPointer {
      create() {
        var buffer_;
        this.malloc(this.MAX_POINT_COUNT * this.BYTES_PER_POINT);
        buffer_ = this.parent.createBuffer();
        this.parent.glObject.bindBuffer(this.TARGET, buffer_);
        this.parent.glObject.bufferData(this.TARGET, this.byteLength, this.USAGE);
        return buffer_;
      }

      bind() {
        if (!getResvUint8(this, 0)) {
          setResvUint8(this, 0, 1);
          this.parent.bindBuffer(this);
        }
        return 0;
      }

      enable() {
        return this.bind();
      }

      draw(ptr, type = this.TRIANGLES) {
        if (type === this.TRIANGLES) {
          return this.drawTriangles(ptr);
        }
      }

      upload(draw) {
        this.parent.program.enable();
        gl = this.parent.glObject;
        if (draw) {
          gl.bufferSubData(this.TARGET, draw.bufferOffset, draw.buffer);
          gl.drawArrays(gl.POINTS, draw.start, draw.count);
        } else {
          gl.bufferData(this.TARGET, this.buffer, this.USAGE);
          gl.drawArrays(gl.TRIANGLES, 0, this.pointCount);
        }
        //todo put in end of render
        return 0;
      }

      drawTriangles(ptr) {
        var byteOffset, bytes, count, length, offset, vertexShader;
        if (!(byteOffset = getByteOffset(this))) {
          if (this.create()) {
            byteOffset = getByteOffset(this);
          }
        }
        vertexShader = this.parent.vertexShader;
        return Object.assign(this.append(new Draw), {
          count: count = ptr.pointCount,
          byteLength: bytes = count * vertexShader.BYTES_PER_POINT,
          bufferOffset: offset = addResvUint32(this, 1, bytes),
          byteOffset: offset + byteOffset + this.OFFSET_TRIANGLES,
          length: length = bytes / Float32Array.BYTES_PER_ELEMENT,
          start: addResvUint32(this, 2, count),
          begin: addResvUint32(this, 3, length),
          mesh: ptr,
          type: this.TRIANGLES,
          vertexShader: vertexShader
        });
      }

    };

    DrawBuffer.prototype.MAX_POINT_COUNT = 1e5;

    DrawBuffer.prototype.isBuffer = true;

    DrawBuffer.prototype.TARGET = WebGL2RenderingContext.ARRAY_BUFFER;

    DrawBuffer.prototype.USAGE = WebGL2RenderingContext.STATIC_DRAW;

    DrawBuffer.prototype.OFFSET_TRIANGLES = 0;

    DrawBuffer.prototype.TRIANGLES = WebGL2RenderingContext.TRIANGLES;

    DrawBuffer.prototype.LINES = WebGL2RenderingContext.LINES;

    DrawBuffer.prototype.POINTS = WebGL2RenderingContext.POINTS;

    Object.defineProperties(DrawBuffer.prototype, {
      pointCount: {
        get: function() {
          return getResvUint32(this, 2);
        }
      },
      byteLength: {
        get: function() {
          return getByteLength(this);
        }
      },
      BYTES_PER_POINT: {
        get: function() {
          return getResvUint32(this, 4) || setResvUint32(this, 4, this.parent.vertexShader.BYTES_PER_POINT);
        }
      }
    });

    return DrawBuffer;

  }).call(this));
  classes.register(Program = (function() {
    class Program extends GLPointer {
      create() {
        return this.parent.createProgram();
      }

      enable() {
        if (!this.isLinked) {
          this.link();
        }
        if (!this.isActive) {
          return this.use();
        }
      }

      link() {
        this.parent.vertexShader.enable();
        this.parent.fragmentShader.enable();
        if (!getResvUint8(this, 2)) {
          setResvUint8(this, 2, 1);
          this.parent.linkProgram(this);
        }
        return 1;
      }

      use() {
        this.parent.drawBuffer.enable();
        if (!getResvUint8(this, 0)) {
          setResvUint8(this, 0, 1);
          this.parent.useProgram(this);
        }
        return 1;
      }

      getParameter(pname) {
        return this.parent.getProgramParameter(this, pname);
      }

      getActiveAttrib(index) {
        return this.parent.getActiveAttrib(this, index);
      }

      getAttribLocation(name) {
        return this.parent.getAttribLocation(this, name);
      }

    };

    Program.prototype.isProgram = true;

    Object.defineProperties(Program.prototype, {
      isLinked: {
        get: function() {
          return this.getParameter(this.LINK_STATUS);
        }
      },
      isDeleted: {
        get: function() {
          return this.getParameter(this.DELETE_STATUS);
        }
      },
      isValidated: {
        get: function() {
          return this.getParameter(this.VALIDATE_STATUS);
        }
      },
      activeShaders: {
        get: function() {
          return this.getParameter(this.ACTIVE_SHADERS);
        }
      },
      attributeCount: {
        get: function() {
          return this.getParameter(this.ATTRIBUTE_COUNT);
        }
      },
      uniformCount: {
        get: function() {
          return this.getParameter(this.UNIFORM_COUNT);
        }
      },
      feedbackMode: {
        get: function() {
          return this.getParameter(this.FEEDBACK_MODE);
        }
      },
      feedbackVarys: {
        get: function() {
          return this.getParameter(this.FEEDBACK_VARYS);
        }
      },
      uniformBlocks: {
        get: function() {
          return this.getParameter(this.UNIFORM_BLOCKS);
        }
      }
    });

    Object.deleteProperties(Program.prototype, ["buffer", "childs"]);

    Object.defineProperties(Program.prototype, {
      LINK_STATUS: {
        value: WebGL2RenderingContext.LINK_STATUS
      },
      VALIDATE_STATUS: {
        value: WebGL2RenderingContext.VALIDATE_STATUS
      },
      DELETE_STATUS: {
        value: WebGL2RenderingContext.DELETE_STATUS
      },
      UNIFORM_BLOCKS: {
        value: WebGL2RenderingContext.ACTIVE_UNIFORM_BLOCKS
      },
      FEEDBACK_VARYS: {
        value: WebGL2RenderingContext.TRANSFORM_FEEDBACK_VARYINGS
      },
      FEEDBACK_MODE: {
        value: WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER_MODE
      },
      UNIFORM_COUNT: {
        value: WebGL2RenderingContext.ACTIVE_UNIFORMS
      },
      ATTRIBUTE_COUNT: {
        value: WebGL2RenderingContext.ACTIVE_ATTRIBUTES
      },
      ACTIVE_SHADERS: {
        value: WebGL2RenderingContext.ATTACHED_SHADERS
      }
    });

    return Program;

  }).call(this));
  classes.register(Attribute = (function() {
    class Attribute extends Pointer {
      refresh() {
        this.parent.parent.drawBuffer.enable();
        this.glContext.vertexAttribPointer(...this.pointerArgs);
        this.glContext.enableVertexAttribArray(this.index);
        return 0;
      }

    };

    Object.defineProperties(Attribute.prototype, {
      index: {
        get: function() {
          return getResvUint16(this, 0);
        },
        set: function() {
          return setResvUint16(this, 0, arguments[0]);
        }
      },
      size: {
        get: function() {
          return getResvUint16(this, 1);
        },
        set: function() {
          return setResvUint16(this, 1, arguments[0]);
        }
      },
      type: {
        get: function() {
          return getResvUint16(this, 2);
        },
        set: function() {
          return setResvUint16(this, 2, arguments[0]);
        }
      },
      normalized: {
        get: function() {
          return getResvUint16(this, 3);
        },
        set: function() {
          return setResvUint16(this, 3, arguments[0]);
        }
      },
      stride: {
        get: function() {
          return getResvUint16(this, 4);
        },
        set: function() {
          return setResvUint16(this, 4, arguments[0]);
        }
      },
      offset: {
        get: function() {
          return getResvUint16(this, 5);
        },
        set: function() {
          return setResvUint16(this, 5, arguments[0]);
        }
      },
      byteLength: {
        get: function() {
          return getByteLength(this);
        },
        set: function() {
          return setByteLength(this, arguments[0]);
        }
      },
      Class: {
        get: function() {
          return classes[getLinkedPtri(this)];
        },
        set: function() {
          return setLinkedPtri(this, arguments[0].classIndex);
        }
      },
      name: {
        get: function() {
          return classes[getLinkedPtri(this)].prototype.name;
        }
      },
      glContext: {
        get: function() {
          return this.parent.parent.glObject;
        }
      },
      pointerArgs: {
        get: function() {
          var begin;
          begin = HEADER_RESVINDEX + this;
          return new Uint16Array(buffer, begin * 4, 6);
        }
      },
      performers: {
        get: function() {
          var vertexShader;
          vertexShader = 1 * this.parent;
          return this.Class.allocs().filter(function(a) {
            return a.parent.draws.find(function(d) {
              return d.vertexShader - vertexShader === 0;
            });
          });
        }
      }
    });

    Object.deleteProperties(Attribute.prototype, ["childs", "buffer"]);

    return Attribute;

  }).call(this));
  classes.register(Shader = (function() {
    class Shader extends GLPointer {
      attach() {
        var err;
        if (!getResvUint8(this, 2)) {
          getResvUint8(this, 2, 1);
          if (err = this.compile().infoLog) {
            throw [err, this];
          }
        }
        if (!getResvUint8(this, 0)) {
          setResvUint8(this, 0, 1);
          this.parent.attachShader(this.program, this);
        }
        return 1;
      }

      enable() {
        return this.attach();
      }

      compile() {
        if (!this.source.isUploaded) {
          this.source.isUploaded = 1;
          this.parent.shaderSource(this, this.source);
        }
        if (!this.source.isCompiled) {
          this.source.isCompiled = 1;
          this.parent.compileShader(this);
        }
        if (!this.source.isResolved) {
          this.source.resolve();
        }
        return this;
      }

      getParameter(parameter) {
        return this.parent.getShaderParameter(this, parameter);
      }

      delete() {
        return this.parent.deleteShader(this);
      }

    };

    Shader.prototype.isShader = true;

    Object.defineProperties(Shader.prototype, {
      source: {
        get: function() {
          return findChild(this, ShaderSource, true);
        },
        set: function() {
          return this.source.set(arguments[0]);
        }
      },
      program: {
        get: function() {
          return getLinked(this) || setLinked(this, this.parent.program);
        },
        set: function() {
          return setLinked(this, arguments[0]);
        }
      },
      infoLog: {
        get: function() {
          return this.parent.getShaderInfoLog(this);
        }
      },
      precisionFormat: {
        get: function() {
          return this.parent.getPrecisionFormat(this);
        }
      }
    });

    Object.defineProperties(Shader, {
      DocumentScripts: {
        get: function() {
          var sources;
          sources = [...document.querySelectorAll("script")].map(function(s) {
            return s.text;
          }).filter(function(s) {
            return /gl_/.test(s);
          });
          if (this === VertexShader) {
            return sources.filter(function(s) {
              return s.match(/gl_Pos/);
            });
          }
          if (this === FragmentShader) {
            return sources.filter(function(s) {
              return s.match(/gl_Fra/);
            });
          }
          return [];
        }
      }
    });

    Object.deleteProperties(Shader.prototype, ["buffer"]);

    return Shader;

  }).call(this));
  classes.register(VertexShader = (function() {
    class VertexShader extends Shader {
      create() {
        return this.parent.createVertexShader();
      }

    };

    VertexShader.prototype.isVertexShader = true;

    VertexShader.prototype.shaderType = WebGL2RenderingContext.VERTEX_SHADER;

    Object.defineProperties(VertexShader.prototype, {
      BYTES_PER_POINT: {
        get: function() {
          var attr, byteLength, j, len, ref;
          if (!this.source.isResolved) {
            this.source.resolve();
          }
          if (!(byteLength = getByteLength(this))) {
            ref = findChilds(this, Attribute);
            for (j = 0, len = ref.length; j < len; j++) {
              attr = ref[j];
              byteLength += attr.byteLength;
            }
            setByteLength(this, byteLength);
          }
          return byteLength;
        }
      }
    });

    return VertexShader;

  }).call(this));
  classes.register(FragmentShader = (function() {
    class FragmentShader extends Shader {
      create() {
        return this.parent.createFragmentShader();
      }

    };

    FragmentShader.prototype.isFragmentShader = true;

    FragmentShader.prototype.shaderType = WebGL2RenderingContext.FRAGMENT_SHADER;

    return FragmentShader;

  }).call(this));
  classes.register(CompiledShader = (function() {
    class CompiledShader extends Pointer {
      attach() {
        return this.glContext.attachShader(this.glProgram, this.glShader);
      }

    };

    Object.defineProperties(CompiledShader.prototype, {
      isAttached: {
        get: function() {
          return getResvUint8(this, 0);
        },
        set: function() {
          return setResvUint8(this, 0, arguments[0]);
        }
      },
      glShader: {
        get: function() {
          return this.storage[getResvUint8(this, 5)];
        },
        set: function() {
          return setResvUint8(this, 5, this.store(arguments[0]));
        }
      },
      glProgram: {
        get: function() {
          return this.storage[getResvUint8(this, 4)];
        },
        set: function() {
          return setResvUint8(this, 4, this.store(arguments[0]));
        }
      },
      glContext: {
        get: function() {
          return this.storage[getResvUint8(this, 3)];
        },
        set: function() {
          return setResvUint8(this, 3, this.store(arguments[0]));
        }
      },
      source: {
        get: function() {
          return new ShaderSource(getByteLength(this));
        },
        set: function() {
          return setByteLength(this, arguments[0]);
        }
      },
      context: {
        get: function() {
          return getLinked(this);
        },
        set: function() {
          return setLinked(this, arguments[0]);
        }
      }
    });

    Object.deleteProperties(CompiledShader.prototype, ["childs", "buffer"]);

    return CompiledShader;

  }).call(this));
  classes.register(TextPointer = (function() {
    class TextPointer extends Pointer {
      set(text) {
        return super.set(this.encoder.encode(`${text}`));
      }

      get() {
        return this.decoder.decode(detachUint8(this));
      }

      toString() {
        return this.get();
      }

    };

    TextPointer.prototype.TypedArray = Uint8Array;

    TextPointer.BPE = 1;

    TextPointer.prototype.BPE = TextPointer.BPE;

    TextPointer.prototype.encoder = new TextEncoder;

    TextPointer.prototype.decoder = new TextDecoder;

    return TextPointer;

  }).call(this));
  classes.register(DocumentScript = (function() {
    class DocumentScript extends TextPointer {
      set(text) {
        return super.set(text);
      }

      resolve() {
        var text;
        if (getResvUint8(this, 4)) {
          return;
        }
        setResvUint8(this, 4, 1);
        if (text = this.element.text) {
          this.set(text);
        }
        if (this.isShaderSource) {
          setClassIndex(this, ShaderSource.classIndex);
        } else if (this.isUserScript) {
          setClassIndex(this, UserScript.classIndex);
        }
        return this;
      }

    };

    Object.deleteProperties(DocumentScript.prototype, ["buffer", "childs"]);

    Object.defineProperties(DocumentScript.prototype, {
      element: {
        get: function() {
          return getObject(this);
        }
      },
      src: {
        get: function() {
          return this.element.src;
        }
      },
      type: {
        get: function() {
          return this.element.type || "application/javascript";
        }
      },
      text: {
        get: function() {
          return this.get();
        }
      },
      isShaderSource: {
        get: function() {
          return /shader/i.test(this.type);
        }
      },
      isVertexShader: {
        get: function() {
          return /gl_Position/i.test(this.text);
        }
      },
      isFragmentShader: {
        get: function() {
          return /gl_Frag/i.test(this.text);
        }
      },
      isComputeShader: {
        get: function() {
          return /\@compute/i.test(this.text);
        }
      },
      isUserScript: {
        get: function() {
          return this.text && !!this.src;
        }
      }
    });

    return DocumentScript;

  }).call(this));
  classes.register(UserScript = (function() {
    class UserScript extends DocumentScript {
      append() {
        var element, script;
        element = document.createElement("script");
        setParent(script = new this.constructor, this.parent);
        setObject(script, element);
        script.set(this.text);
        element.text = this.text;
        element.type = this.type;
        document.body.appendChild(element);
        return script;
      }

    };

    Object.defineProperties(UserScript.prototype, {
      blob: {
        get: function() {
          return new Blob([this.text], {type: this.type});
        }
      },
      objectURL: {
        get: function() {
          return URL.createObjectURL(this.blob);
        }
      }
    });

    return UserScript;

  }).call(this));
  classes.register(ShaderSource = (function() {
    class ShaderSource extends DocumentScript {
      keyof(type) {
        var k, v;
        k = Object.keys(WebGL2RenderingContext);
        v = Object.values(WebGL2RenderingContext);
        return k.at(v.indexOf(type));
      }

      resolve() {
        var Class, attr, attributes, byteLength, info, j, kind, len, length, location, name, numAttribs, offset, stride, type, typeKey, vtype;
        if (this.isResolved) {
          return super.resolve();
        }
        this.isResolved = 1;
        stride = 0;
        program = this.parent.program;
        attributes = [];
        if (!program.isLinked) {
          program.link();
        }
        numAttribs = program.attributeCount;
        while (numAttribs--) {
          attr = program.getActiveAttrib(numAttribs);
          location = program.getAttribLocation(attr.name);
          typeKey = this.keyof(attr.type);
          info = typeKey.split(/_/);
          name = attr.name;
          type = WebGL2RenderingContext.FLOAT;
          [vtype, kind] = info;
          Class = classes.find(function(c) {
            return c.prototype.name === attr.name;
          });
          length = Math.imul(kind[3] || 1, kind[5] || 1);
          offset = stride;
          stride += byteLength = Class.BPE * length;
          attributes.push({
            index: location,
            size: length,
            type,
            stride,
            offset,
            byteLength,
            Class,
            normalized: Class.normalize
          });
        }
        attributes.map(function(a) {
          return a.stride = stride;
        });
        for (j = 0, len = attributes.length; j < len; j++) {
          attr = attributes[j];
          this.parent.append(Object.assign(new Attribute, attr));
        }
        return this;
      }

    };

    Object.defineProperties(ShaderSource.prototype, {
      isResolved: {
        get: function() {
          return getResvUint8(this, 2);
        },
        set: function() {
          return setResvUint8(this, 2, arguments[0]);
        }
      },
      isUploaded: {
        get: function() {
          return getResvUint8(this, 1);
        },
        set: function() {
          return setResvUint8(this, 1, arguments[0]);
        }
      },
      isCompiled: {
        get: function() {
          return getResvUint8(this, 0);
        },
        set: function() {
          return setResvUint8(this, 0, arguments[0]);
        }
      }
    });

    Object.deleteProperties(ShaderSource.prototype, ["src"]);

    return ShaderSource;

  }).call(this));
  classes.register(EventHandler = (function() {
    class EventHandler extends TextPointer {
      getHandler() {
        return this.storage[getResvUint8(this, 0)];
      }

      setHandler() {
        return setResvUint8(this, 0, this.store(arguments[0]));
      }

      getIsOnce() {
        return getResvUint8(this, 1);
      }

      hitIsOnce() {
        return hitResvUint8(this, 1);
      }

      setIsOnce() {
        return setResvUint8(this, 1, arguments[0]);
      }

      getCallCount() {
        return getResvUint32(this, 1);
      }

      hitCallCount() {
        return addResvUint32(this, 1, 1);
      }

      setCallCount() {
        return setResvUint32(this, 1, arguments[0]);
      }

      call() {
        if (!this.hitCallCount() || !this.getIsOnce()) {
          this.handler.call(this.parent, ...arguments);
        }
        return 0;
      }

      set(event, handler, options) {
        super.set(event);
        if (options && options.once) {
          this.isOnce = 1;
        }
        this.handler = handler;
        return this;
      }

    };

    Object.deleteProperties(EventHandler.prototype, ["childs"]);

    Object.defineProperties(EventHandler.prototype, {
      handler: {
        get: EventHandler.prototype.getHandler,
        set: EventHandler.prototype.setHandler
      },
      isOnce: {
        get: EventHandler.prototype.getIsOnce,
        set: EventHandler.prototype.setIsOnce
      },
      callCount: {
        get: EventHandler.prototype.getCallCount,
        set: EventHandler.prototype.setCallCount
      },
      name: {
        get: EventHandler.prototype.toString
      }
    });

    return EventHandler;

  }).call(this));
  classes.register(EventEmitter = (function() {
    class EventEmitter extends Pointer {
      init() {
        if (hitResvUint8(super.init(...arguments), 0)) {
          this.create();
        }
        return this;
      }

      getHandlers() {
        return findChilds(this, EventHandler);
      }

      on(event, handler, options) {
        return this.add(new EventHandler().set(...arguments));
      }

      emit(event, data = {}) {
        var e, results;
        this.hitCallCount();
        results = [];
        for (e in this.childs) {
          if (e.name === event) {
            results.push(e.call(data));
          }
        }
        return results;
      }

      create() {
        return this;
      }

      getCallCount() {
        return getResvUint32(this, 1);
      }

      hitCallCount() {
        return addResvUint32(this, 1, 1);
      }

      setCallCount() {
        return setResvUint32(this, 1, arguments[0]);
      }

    };

    EventEmitter.prototype.iterate = EventHandler;

    Object.defineProperties(EventEmitter.prototype, {
      events: {
        get: EventEmitter.prototype.getHandlers
      },
      callCount: {
        get: EventEmitter.prototype.getCallCount,
        set: EventEmitter.prototype.setCallCount
      }
    });

    return EventEmitter;

  }).call(this));
  classes.global(Document = (function() {
    class Document extends EventEmitter {};

    Object.deleteProperties(Document.prototype, ["parent", "callCount"]);

    Object.defineProperties(Document.prototype, {
      buffer: {
        get: function() {
          return buffer;
        }
      }
    });

    return Document;

  }).call(this));
  classes.global(Scene = (function() {
    class Scene extends EventEmitter {
      //?@iterate  : Mesh
      async gpu() {
        var BUFFER_SIZE, VERTEX_SIZE, WGROUP_SIZE, WORKGROUPS, adapter, bindGroup, bindLayout, copyArrayBuffer, cscript, cshader, execEncoder, gpu, i, inputA, inputB, length, output, passEncoder, pipeline, staging, verticesA, verticesB, vertlen;
        WORKGROUPS = 65534;
        WGROUP_SIZE = 256;
        VERTEX_SIZE = WGROUP_SIZE * WORKGROUPS;
        BUFFER_SIZE = VERTEX_SIZE * 4;
        vertlen = 65534 * 256;
        verticesA = new Float32Array(buffer);
        verticesB = new Float32Array(new SharedArrayBuffer(BUFFER_SIZE));
        i = 0;
        length = 0;
        while (i < VERTEX_SIZE) {
          verticesB.set([length, i, -Math.random(), 0], i);
          length++;
          i += 4;
        }
        cscript = document.getElementById("cshader").text;
        cscript = cscript.replace(/VERTEX_SIZE/, VERTEX_SIZE);
        cscript = cscript.replace(/WGROUP_SIZE/, WGROUP_SIZE);
        adapter = (await navigator.gpu.requestAdapter());
        gpu = (await adapter.requestDevice());
        cshader = gpu.createShaderModule({
          code: cscript
        });
        output = gpu.createBuffer({
          size: BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
        staging = gpu.createBuffer({
          size: BUFFER_SIZE,
          usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        });
        inputA = gpu.createBuffer({
          size: BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        inputB = gpu.createBuffer({
          size: BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        gpu.queue.writeBuffer(inputA, 0, verticesA, 0, VERTEX_SIZE);
        gpu.queue.writeBuffer(inputB, 0, verticesB, 0, VERTEX_SIZE);
        bindLayout = gpu.createBindGroupLayout({
          entries: [
            {
              binding: 0,
              visibility: GPUShaderStage.COMPUTE,
              buffer: {
                type: "read-only-storage"
              }
            },
            {
              binding: 1,
              visibility: GPUShaderStage.COMPUTE,
              buffer: {
                type: "read-only-storage"
              }
            },
            {
              binding: 2,
              visibility: GPUShaderStage.COMPUTE,
              buffer: {
                type: "storage"
              }
            }
          ]
        });
        bindGroup = gpu.createBindGroup({
          layout: bindLayout,
          entries: [
            {
              binding: 0,
              resource: {
                buffer: inputA
              }
            },
            {
              binding: 1,
              resource: {
                buffer: inputB
              }
            },
            {
              binding: 2,
              resource: {
                buffer: output
              }
            }
          ]
        });
        pipeline = gpu.createComputePipeline({
          layout: gpu.createPipelineLayout({
            bindGroupLayouts: [bindLayout]
          }),
          compute: {
            module: cshader,
            entryPoint: 'main'
          }
        });
        
        // Create GPUCommandEncoder to issue commands to the GPU 
        execEncoder = gpu.createCommandEncoder();
        // Initiate render pass
        passEncoder = execEncoder.beginComputePass();
        // Issue commands
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(WORKGROUPS);
        // End the render pass
        passEncoder.end();
        // Copy output buffer to staging buffer
        execEncoder.copyBufferToBuffer(output, 0, /* SRC offset */staging, 0, /* DST offset */BUFFER_SIZE);
        // End frame by passing array of command buffers to command queue for execution
        gpu.queue.submit([execEncoder.finish()]);
        // map staging buffer to read results back to JS
        await staging.mapAsync(GPUMapMode.READ, 0, BUFFER_SIZE);
        copyArrayBuffer = staging.getMappedRange(0, BUFFER_SIZE);
        // get results
        verticesB.set(new Float32Array(copyArrayBuffer));
        log("results:", verticesB);
        return staging.unmap();
      }

      create() {
        var i, onframe;
        super.create(...arguments);
        setParent(this, root);
        this.startTime = Date.now();
        this.isRendering = 1;
        i = 0;
        onframe = function(epoch1) {
          this.epoch = epoch1;
          this.context.clear();
          this.render();
          if (i++ > 10) {
            throw /RENDER_OF_10/;
          }
          return requestAnimationFrame(onframe);
        };
        (onframe = onframe.bind(this))();
        return this.context.parent;
      }

      add(ptr) {
        super.add(ptr);
        if (!ptr.isDrawable) {
          return this;
        }
        ptr.draw(this);
        return this;
      }

      append(ptr) {
        this.add(ptr);
        return ptr;
      }

      render() {
        var draw, iterator;
        iterator = prepareIterator(Draw);
        while (draw = iterateGlobalAllocs(iterator)) {
          draw.refresh();
        }
        this.context.drawBuffer.upload();
        return this.emit("render");
      }

      getTimeStamp() {
        return getUint64(this, 0) + getUint32(this, 3);
      }

      //?              BYTEOFFSET = 0
      getStartTime() {
        return getUint64(this, 0);
      }

      setStartTime() {
        return setUint64(this, 0, arguments[0]);
      }

      //?              BYTEOFFSET = 8
      getFramePerSec() {
        return getUint8(this, 8);
      }

      setFramePerSec() {
        return setUint8(this, 8, arguments[0]);
      }

      getIsRendering() {
        return getUint8(this, 9);
      }

      setIsRendering() {
        return setUint8(this, 9, arguments[0]);
      }

      //?              BYTEOFFSET = 10
      getDeltaTime() {
        return getUint16(this, 5);
      }

      setDeltaTime(delta) {
        return this.fps = 1000 / setUint16(this, 5, delta);
      }

      //?              BYTEOFFSET = 12
      getEpochTime() {
        return getUint32(this, 3);
      }

      setEpochTime(epoch) {
        return this.delta = -this.epoch + setUint32(this, 3, epoch);
      }

    };

    Scene.byteLength = 28 * Scene.BPE;

    //?              BYTEOFFSET = 16
    Object.defineProperties(Scene.prototype, {
      now: {
        get: Scene.prototype.getTimeStamp
      },
      fps: {
        get: Scene.prototype.getFramePerSec,
        set: Scene.prototype.setFramePerSec
      },
      delta: {
        get: Scene.prototype.getDeltaTime,
        set: Scene.prototype.setDeltaTime
      },
      epoch: {
        get: Scene.prototype.getEpochTime,
        set: Scene.prototype.setEpochTime
      },
      startTime: {
        get: Scene.prototype.getStartTime,
        set: Scene.prototype.setStartTime
      },
      isRendering: {
        get: Scene.prototype.getIsRendering,
        set: Scene.prototype.setIsRendering
      },
      context: {
        get: function() {
          var context, contexts;
          contexts = findChilds(this, Context);
          if (!(context = contexts.find(function(p) {
            return p.isActive;
          }))) {
            if (!(context = contexts[0])) {
              setParent(context = new Context, this);
            }
            context.enable();
          }
          return context;
        }
      },
      drawBuffer: {
        get: function() {
          return this.context.drawBuffer;
        }
      }
    });

    return Scene;

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

          @createScope : ( storage ) ->

  defaultVShader = no
  defaultFShader = no

  for s in scripts.find (s) -> s.type.match /x-shader/i

  shader = if s.text.match /gl_Program/
      new vShader null, storage
  else new fShader null, storage

  shader . compile s.text 

  if !defaultVShader and shader.vShader
      defaultVShader = shader 

  if !defaultFShader and shader.fShader
      defaultFShader = shader 

  storage

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

          INDEX_DRAW_BEGIN      : HEADER_INDEXCOUNT

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

      classes.register class Shader extends Pointer

          GPU_ATTRIBUTE_COUNT : 1e5 

          isShader            : yes

          Object.defineProperties Shader::,
  gl          : get : Shader::parentGLContext  , set : Shader::setGLContext
  glProgram   : get : Shader::parentGLProgram  , set : Shader::setGLProgram

          Object.defineProperties Shader::,
  active      : get : Shader::getActive          , set : Shader::setActive
  source      : get : Shader::getSource          , set : Shader::setSource

          Object.deleteProperties Shader::, [ "linked" ]

          getGLContext        : ->
  @storage[ getResvUint8 this, 2 ]

          parentGLContext     : ->
  @storage[ getResvUint8 this, 2 ] or
  @gl = @parent.gl

          createGLContext     : ->
  if  storei = getResvUint8 this, 2
  return @storage[ storei ]

  throw /DONOT_CREATE_GL/ unless isWindow
  canvas = document.createElement 'canvas'

  Object.assign canvas, {
  width   : RATIO_PIXEL * INNER_WIDTH
  height  : RATIO_PIXEL * INNER_HEIGHT
  style   :
      width      : CSS.px INNER_WIDTH
      height     : CSS.px INNER_HEIGHT
      inset      : CSS.px 0
      position   : "fixed"
  } 

  @gl = document.body
  . appendChild canvas
  . getContext "webgl2" 

          setGLContext        : ( webGL2RenderingContext ) ->
  setResvUint8 this, 2, @store webGL2RenderingContext

          getGLProgram        : ->
  @storage[ getResvUint8 this, 3 ]

          setGLProgram        : ( webGLProgram ) ->
  setResvUint8 this, 3, @store webGLProgram 

          parentGLProgram    : ->
  @storage[ getResvUint8 this, 3 ] or
  @glProgram = @parent.glProgram

          createGLProgram     : ->
  @storage[ getResvUint8 this, 3 ] or
  @glProgram = @gl.createProgram()

          activeGLProgram     : ->
  #? space searching an glProgram
  if  storei = getResvUint8 this, 3
  return @storage[ storei ]

  programs = findChildsRecursive this, Program

  return unless programs.length
  unless program = programs.find (s) -> s.active 
  program = programs.at 0
  @glProgram = program.glProgram

          getGLBuffer         : ->
  @storage[ getResvUint8 this, 4 ]

          setGLBuffer         : ( webGLBuffer ) ->
  setResvUint8 this, 4, @store webGLBuffer

          activeGLBuffer      : ->
  #? space searching an glBuffer
  if  storei = getResvUint8 this, 4
  return @storage[ storei ]

  vShaders = findChildsRecursive this, VertexShader

  return unless vShaders.length
  unless vShader = vShaders.find (s) -> s.active 
  vShader = vShaders.at 0
  @glBuffer = vShader.glBuffer

          createGLBuffer      : ->
  #? vertex shader creates new buffer
  @storage[ getResvUint8 this, 4 ] or
  @glBuffer = @gl.createBuffer()

          parentGLBuffer      : ->
  #? draw looks vertex shaders buffer
  @storage[ getResvUint8 this, 4 ] or
  @glBuffer = @parent.glBuffer

          getGLShader         : ->
  @storage[ getResvUint8 this, 5 ]

          setGLShader         : ( webGLShader ) ->
  if @isVShader 
  @setGLVShader webGLShader 
  else @setGLFShader webGLShader

  setResvUint8 this, 5, @store webGLShader

          getGLVShader        : ->
  @storage[ getResvUint8 this, 6 ]

          setGLVShader        : ( webGLShader ) ->
  setResvUint8 this, 6, @store webGLShader

          createGLVShader     : ->
  #? vertexShader creating new one
  @storage[ getResvUint8 this, 6 ] or
  @glShader = @gl.createShader @gl.VERTEX_SHADER

          parentGLVShader     : ->
  #? matter or draw searching glVShader
  @storage[ getResvUint8 this, 6 ] or
  @glVShader = @parent.glVShader or @parent.parent.glVShader

          activeGLVShader     : ->
  #? space searching an glVShader
  if  storei = getResvUint8 this, 6
  return @storage[ storei ]

  shaders = findChildsRecursive this, VertexShader

  unless shaders.length
  return undefined

  unless shader = shaders.find (s) -> s.active 
  shader = shaders.at 0
  @glVShader = shader.glShader

          getGLFShader        : ->
  @storage[ getResvUint8 this, 7 ]

          setGLFShader        : ( webGLShader ) ->
  setResvUint8 this, 7, @store webGLShader

          createGLFShader     : ->
  @storage[ getResvUint8 this, 7 ] or
  @glShader = @gl.createShader @gl.FRAGMENT_SHADER

          parentGLFShader     : ->
  @storage[ getResvUint8 this, 7 ] or
  @glFShader = @parent.glFShader or @parent.parent.glFShader

          activeGLFShader     : ->
  #? space searching an glFShader
  if  storei = getResvUint8 this, 7
  return @storage[ storei ]

  shaders = findChildsRecursive this, FragmentShader

  return unless shaders.length
  unless shader = shaders.find (s) -> s.active 
  shader = shaders.at 0
  @glFShader = shader.glShader

          getActive       : ->
  getResvUint8 this, 0

          setActive       : ( v ) ->
  setResvUint8 this, 0, v

          getBinded       : ->
  getResvUint8 this, 1

          setBinded       : ( v ) ->
  setResvUint8 this, 1, v

          getSource       : ->
  @gl.getShaderSource @glShader 

          setSource       : ( source ) ->
  @compile @gl.shaderSource @glShader, source

          compile         : ->
  @attach @gl.compileShader @glShader

          attach          : ->
  @active = 1
  @gl.attachShader @glProgram, @glShader ; this

          detach          : ->
  @active = 0
  @gl.detachShader @glProgram, @glShader ; this

          destroy         : ->
  @detach()
  @gl.deleteShader @glShader ; this

      classes.register class FragmentShader extends Shader

          shaderType      : WebGL2RenderingContext.FRAGMENT_SHADER

          isFShader       : yes

          getGLObject     : -> @glFragmentShader

          attach          : ->
  return this if @active

  if  fShader = @parent.fShader
  fShader . detach()

  @parent . glFShader = @glShader

  return super()

          Object.defineProperties FragmentShader,
  DocumentScripts : get : ->
  [ ...document.scripts ].filter (s) -> s.text.match /gl_FragColor/

          Object.defineProperties FragmentShader::,

  glShader    : get : Shader::createGLFShader   , set : Shader::setGLShader

      classes.register class VertexShader extends Shader

          shaderType              : WebGL2RenderingContext.VERTEX_SHADER

          isVShader               : yes

          POINTS                  : WebGL2RenderingContext.POINTS

          LINES                   : WebGL2RenderingContext.LINES

          TRIANGLES               : WebGL2RenderingContext.TRIANGLES

          INDEX_TRIANGLES_COUNT   : 0

          INDEX_TRIANGLES_ALLOC   : 1

          INDEX_TRIANGLES_START   : 2

          INDEX_LINES_COUNT       : 3

          INDEX_LINES_ALLOC       : 4

          INDEX_LINES_START       : 5

          INDEX_POINTS_COUNT      : 6

          INDEX_POINTS_ALLOC      : 7

          INDEX_POINTS_START      : 8

          INDEX_ALLOC_BYTELENGTH_PER_TYPE   : 9 

          INDEX_ALLOC_LENGTH_PER_POINT      : 10

          INDEX_ALLOC_BYTELENGTH_PER_POINT  : 11

          INDEX_DEFINITIONS_OBJECT          : 12

          INDEX_DRAWBUFFER_STARTS           : 16

          Object.defineProperties VertexShader,
  DocumentScripts : get : ->
  [ ...document.scripts ].filter (s) -> s.text.match /gl_Position/

          Object.defineProperties VertexShader::,
  stats       : get : VertexShader::dump
  definitons  : get : VertexShader::getDefinitons , set : VertexShader::setDefinitons    

          Object.defineProperties VertexShader::,
  glShader    : get : Shader::createGLVShader   , set : Shader::setGLShader
  glBuffer    : get : Shader::createGLBuffer    , set : Shader::setGLBuffer

          getGLObject     : -> @glVertexShader

          attach          : ->
  return this if @active

  if  vShader = @parent.vShader
  vShader . detach()

  @parent . glVShader = @glShader

  return super()

          getDefinitons   : ->
  @storage[ getUint32 this, @INDEX_DEFINITIONS_OBJECT ]

          setDefinitons   : ( object = {} ) ->
  setUint32 this, @INDEX_DEFINITIONS_OBJECT, @store object

          dump            : ->
  BYTELENGTH_PER_TYPE  : getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_TYPE
  BYTELENGTH_PER_POINT : getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT
  LENGTH_PER_POINT     : getUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT

  triangles :
  alloc : getUint32 this, @INDEX_TRIANGLES_ALLOC
  start : getUint32 this, @INDEX_TRIANGLES_START
  count : getUint32 this, @INDEX_TRIANGLES_COUNT

  lines     :
  alloc : getUint32 this, @INDEX_LINES_ALLOC
  start : getUint32 this, @INDEX_LINES_START
  count : getUint32 this, @INDEX_LINES_COUNT

  points    :
  alloc : getUint32 this, @INDEX_POINTS_ALLOC
  start : getUint32 this, @INDEX_POINTS_START
  count : getUint32 this, @INDEX_POINTS_COUNT                

          draw            : ( shape, type = @LINES ) ->
  byteLength = shape.pointCount * getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT
  length     = shape.pointCount * getUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT

  index = switch type
  when @LINES      then @INDEX_LINES_COUNT
  when @POINTS     then @INDEX_POINTS_COUNT
  when @TRIANGLES  then @INDEX_TRIANGLES_COUNT
  else throw /UNKNOWN_DRAW_TYPE/ + type

  Object.assign new Draw(),
  drawType   : type
  drawCount  : shape.pointCount
  drawStart  : getUint32( this, index+2 ) + addUint32 this, index, shape.pointCount
  drawOffset : offset = addUint32( this, index+1, byteLength ) - getByteOffset(this)
  readBegin  : begin = offset / 4 
  readLength : length
  byteOffset : getByteOffset(this) + begin * 4
  byteLength : length * 4
  parent     : this
  linked     : shape

          create          : ( definitions ) ->            

  attibuteByteLength = 0
  for key, def of definitions when def.is.match /attr/
  attibuteByteLength += def.length * @BPE
  attibuteByteLength += 4 - attibuteByteLength % 4

  drawByteAlloc  = attibuteByteLength * @GPU_ATTRIBUTE_COUNT
  drawByteAlloc -= drawByteAlloc % 3

  @malloc drawByteAlloc

  typeByteAlloc  = drawByteAlloc / 3
  typeByteAlloc -= typeByteAlloc % attibuteByteLength
  typeDrawCount  = typeByteAlloc / attibuteByteLength

  paddingCount   = Math.max 1, Math.ceil( 
  @INDEX_DRAWBUFFER_STARTS * @BPE / attibuteByteLength
  )
  paddingAlloc   = paddingCount * attibuteByteLength

  setUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_TYPE   , typeByteAlloc
  setUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT  , attibuteByteLength
  setUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT      , attibuteByteLength / 4

  setUint32 this, @INDEX_TRIANGLES_START , paddingCount 
  setUint32 this, @INDEX_TRIANGLES_ALLOC , paddingAlloc 

  setUint32 this, @INDEX_LINES_START     , typeDrawCount 
  setUint32 this, @INDEX_LINES_ALLOC     , typeByteAlloc 

  setUint32 this, @INDEX_POINTS_START    , typeDrawCount * 2 
  setUint32 this, @INDEX_POINTS_ALLOC    , typeByteAlloc * 2 

  @gl.bindBuffer @gl.ARRAY_BUFFER, @glBuffer
  @gl.bufferData @gl.ARRAY_BUFFER, drawByteAlloc, @gl.STATIC_DRAW

  @setDefinitons definitions

  this

          parseSource     : ( source = @source ) ->
  canvas = new OffscreenCanvas 0, 0
  gl = canvas.getContext "webgl2"

  program = gl.createProgram()
  shader  = gl.createShader gl.VERTEX_SHADER

  gl.shaderSource shader, source
  gl.compileShader shader

  unless gl.getShaderParameter shader, gl.COMPILE_STATUS
  info = gl.getShaderInfoLog shader
  throw "Could not compile WebGL shader. \n\n#{info}"

  shader2  = gl.createShader 35632
  source2  = "void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }"; 

  gl.shaderSource shader2, source2
  gl.compileShader shader2

  gl.attachShader program, shader
  gl.attachShader program, shader2

  gl.linkProgram program

  gl.bindBuffer gl.ARRAY_BUFFER, buf = gl.createBuffer()
  gl.bufferData gl.ARRAY_BUFFER, 256, gl.STATIC_DRAW

  gl.useProgram program

  unless gl.getProgramParameter program, gl.LINK_STATUS
  info = gl.getProgramInfoLog program
  throw "Could not compile WebGL program. \n\n#{info}"

  i = gl.getProgramParameter program, gl.ACTIVE_ATTRIBUTES
  v = Object.values WebGL2RenderingContext
  k = Object.keys WebGL2RenderingContext

  lengthOf =
  vec4 : 4
  vec3 : 3
  vec2 : 2
  mat4 : 4 * 4
  mat3 : 3 * 3

  ATTRIBS_LENGTH = 0
  ATTRIBS_BYTELENGTH = 0

  attribs = while i--
  attrib              = gl.getActiveAttrib program, i
  attrib.is           = "attribute"
  attrib.kind         = k.at v.indexOf attrib.type
  attrib.class        = classes.find (c) -> c::name is attrib.name
  attrib.location     = gl.getAttribLocation program, attrib.name
  attrib.typeof       = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_TYPE
  attrib.kindof       = k.at v.indexOf attrib.typeof 
  attrib.offset       = ATTRIBS_BYTELENGTH
  attrib.length       = lengthOf[ attrib.kind.split(/_/).at(-1).toLowerCase() ]

  ATTRIBS_LENGTH     += attrib.length
  ATTRIBS_BYTELENGTH  = ATTRIBS_LENGTH * 4

  attrib

  for attrib in attribs
  attrib.stride       = ATTRIBS_BYTELENGTH
  gl.enableVertexAttribArray i = attrib.location

  gl.vertexAttribPointer(
      attrib.location, attrib.length, attrib.typeof, 
      attrib.isNormalized, attrib.stride, attrib.offset
  )

  attrib.isEnabled    = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_ENABLED
  attrib.isNormalized = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
  attrib.integer      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_INTEGER
  attrib.divisor      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_DIVISOR                

  gl.disableVertexAttribArray i

  i = gl.getProgramParameter program, gl.ACTIVE_UNIFORMS
  uniforms = while i--
  uniform             = gl.getActiveUniform program, i
  uniform.is          = "uniform"
  uniform.kind        = k.at v.indexOf uniform.type
  uniform.class       = classes.find (c) -> c::name is uniform.name
  uniform.location    = gl.getUniformLocation program, uniform.name
  uniform.uploader    = switch uniform.kind
      when "FLOAT_MAT4"           then "uniformMatrix4fv"
      when "FLOAT_MAT3"           then "uniformMatrix3fv"
      when "FLOAT_MAT2"           then "uniformMatrix2fv"
      when "FLOAT_MAT2x3"         then "uniformMatrix2x3fv"
      when "FLOAT_MAT2x4"         then "uniformMatrix2x4fv"
      when "FLOAT_MAT3x2"         then "uniformMatrix3x2fv"
      when "FLOAT_MAT3x4"         then "uniformMatrix3x4fv"
      when "FLOAT_MAT4x2"         then "uniformMatrix4x2fv"
      when "FLOAT_MAT3x3"         then "uniformMatrix4x3fv"
      when "FLOAT"                then "uniform1f"
      when "INT"                  then "uniform1iv"
      when "UNSIGNED_INT"         then "uniform1uiv"
      when "UNSIGNED_INT_VEC2"    then "uniform2uiv"
      when "UNSIGNED_INT_VEC3"    then "uniform3uiv"
      when "UNSIGNED_INT_VEC4"    then "uniform4uiv"
  uniform

  gl.detachShader program, shader
  gl.detachShader program, shader2

  gl.deleteShader shader
  gl.deleteShader shader2
  gl.deleteProgram program
  gl.deleteBuffer buf

  Space.limits = (await navigator.gpu.requestAdapter()).limits

  shader = shader2 = gl =
  program = canvas = null
  definitions = new Object

  for v in [ uniforms... , ...attribs ]
  definitions[ v.name ] = v

  definitions

      classes.register class Draw         extends Pointer

          name            : "draw"

          TypedArray      : Uint32Array

          @byteLength     : 8 * @BPE

          getDrawType     : -> getUint32 this, 0

          setDrawType     : ( v ) -> setUint32 this, 0, v

          getDrawOffset   : -> getUint32 this, 1

          setDrawOffset   : ( v ) -> setUint32 this, 1, v

          getDrawStart    : -> getUint32 this, 2

          setDrawStart    : ( v ) -> setUint32 this, 2, v

          getDrawCount    : -> getUint32 this, 3

          setDrawCount    : ( v ) -> setUint32 this, 3, v

          getReadBegin    : -> getUint32 this, 4

          setReadBegin    : ( v ) -> setUint32 this, 4, v

          getReadLength   : -> getUint32 this, 5

          setReadLength   : ( v ) -> setUint32 this, 5, v

          getByteOffset   : -> getUint32 this, 6

          setByteOffset   : ( v ) -> setUint32 this, 6, v

          getByteLength   : -> getUint32 this, 7

          setByteLength   : ( v ) -> setUint32 this, 7, v

          Object.defineProperties Draw::,

  drawType    : get : Draw::getDrawType   , set : Draw::setDrawType

  drawOffset  : get : Draw::getDrawOffset , set : Draw::setDrawOffset

  drawStart   : get : Draw::getDrawStart  , set : Draw::setDrawStart

  drawCount   : get : Draw::getDrawCount  , set : Draw::setDrawCount

  readBegin   : get : Draw::getReadBegin  , set : Draw::setReadBegin

  readLength  : get : Draw::getReadLength , set : Draw::setReadLength

  byteOffset  : get : Draw::getByteOffset , set : Draw::setByteOffset

  byteLength  : get : Draw::getByteLength , set : Draw::setByteLength

  pointCount  : get : -> @linked.pointCount

          Object.defineProperties Draw::,
  gl          : get : Shader::parentGLContext  , set : Shader::setGLContext
  glProgram   : get : Shader::parentGLProgram  , set : Shader::setGLProgram
  glVShader   : get : Shader::parentGLVShader  , set : Shader::setGLVShader
  glFShader   : get : Shader::parentGLFShader  , set : Shader::setGLFShader
  glBuffer    : get : Shader::parentGLBuffer   , set : Shader::setGLBuffer

      classes.register class Space    extends Pointer

          self.Space      = this

          Object.defineProperties Space::,
  gl          : get : Shader::createGLContext  , set : Shader::setGLContext
  glProgram   : get : Shader::activeGLProgram  , set : Shader::setGLProgram
  glVShader   : get : Shader::activeGLVShader  , set : Shader::setGLVShader
  glFShader   : get : Shader::activeGLFShader  , set : Shader::setGLFShader
  glBuffer    : get : Shader::activeGLBuffer   , set : Shader::setGLBuffer

          Object.defineProperties Space::,
  active      : get : Shader::getActive        , set : Shader::setActive            

          Object.defineProperties Space::,
  vShader     : get : -> findChildsRecursive( this, VertexShader ).find (s) -> s.active
  fShader     : get : -> findChildsRecursive( this, FragmentShader ).find (s) -> s.active 
  program     : get : ->
  programs = findChildsRecursive this, Program 
  return unless programs.length

  unless program = programs.find (s) -> s.inUse
      program = programs.find (s) -> s.isLinked 
  program or programs.at(0)

  created     :
  get     :     -> getResvUint8( this, 1 )          
  set     : (v) -> setResvUint8( this, 1, v )          

          Object.deleteProperties Space::, [ "buffer", "linked", "parent" ]

          add             : ( ptr ) ->
  super ptr

  if  ptr.drawable
  @vShader.draw ptr

  this    

          init            : ->
  unless super( arguments... ).created

  @created = 1
  throw /THREAD/ unless isWindow

  setParent new Program(), this

  for script in VertexShader.DocumentScripts
      @program.add shader = new VertexShader
      shader.source = script.text
      shader.create shader.parseSource()

  for script in FragmentShader.DocumentScripts
      @program.add shader = new FragmentShader
      shader.source = script.text

  @program.use()

  this
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

      return

      checkUploads    = ->
          for shape in Shape.allocs()
  continue unless shape.willUploadIfNeeded

  gl.bufferSubData(
  gl.ARRAY_BUFFER, draw.uploadOffset,
  space.drawBuffer, draw.uploadBegin,
  draw.uploadLength
  ) for draw in GLDraw.allocs shape.ptri

      @render         = ->
          rendering = 1

          for l, define of defines when define.is.match /attr/i
  try define.enable() ; define.rebind()

          onanimationframe = ( pnow ) ->

  delta = pnow - epoch
  epoch = pnow
  fps   = Math.trunc 1 / delta * 1e3

  space.upload()
  emit "animationframe", { gl, delta, epoch, fps }

  space.drawArrays()
  requestAnimationFrame onanimationframe

          onanimationframe performance.now()

      initialProgram  = ->

          vSource = scripts.find((s) -> s.type.match /x-vert/i).text
          vShader = gl.createShader gl.VERTEX_SHADER

          gl.shaderSource vShader, vSource
          gl.compileShader vShader

          unless gl.getShaderParameter vShader, gl.COMPILE_STATUS
  info = gl.getShaderInfoLog vShader
  throw "Could not compile WebGL program. \n\n#{info}"

          fSource = scripts.find((s) -> s.type.match /x-frag/i).text
          fShader = gl.createShader gl.FRAGMENT_SHADER

          gl.shaderSource fShader, fSource
          gl.compileShader fShader

          unless gl.getShaderParameter fShader, gl.COMPILE_STATUS
  info = gl.getShaderInfoLog fShader
  throw "Could not compile WebGL program. \n\n#{info}"

          program = gl.createProgram()

          gl.attachShader program, vShader
          gl.attachShader program, fShader

          gl.linkProgram program

          unless gl.getProgramParameter program, gl.LINK_STATUS
  info = gl.getProgramInfoLog program
  throw "Could not compile WebGL program. \n\n#{info}"

          gl.bindBuffer gl.ARRAY_BUFFER, gBuffer = gl.createBuffer()
          gl.bufferData gl.ARRAY_BUFFER, BYTELENGTH_GLBUFFER, gl.STATIC_DRAW

          gl.useProgram program

          0

      createFrustrum  = ( options ) ->
          frustrum = Frustrum.fromOptions options 
          frustrum . setViewport gl
          frustrum . listenWindow()

      @createDisplay  = ->
          return;
          space = new Space()

          initialProgram()
          createFrustrum()

          requestIdleCallback =>
  self.emit "contextrestored", gl
  pipe.emit "contextrestored"

      createCanvas    = ->
          canvas                  = document.createElement "canvas"
          canvas.width            = RATIO_PIXEL * INNER_WIDTH
          canvas.height           = RATIO_PIXEL * INNER_HEIGHT
          canvas.style.width      = CSS.px INNER_WIDTH
          canvas.style.height     = CSS.px INNER_HEIGHT
          canvas.style.inset      = CSS.px 0
          canvas.style.position   = "fixed"

          document.body.appendChild canvas

      createWorker    = ( name, blob ) ->

          worker = new Worker( blob, { name } )
          worker . onerror = 
          worker . onmessageerror = console.error
          worker . onmessage = ({ data }) ->
  workers.push Object.assign this, data
  emit "threadstatechange", { thread: this }

          Object.defineProperties worker, state :
  get : Atomics.load.bind Atomics, i32, name 
  set : (v) -> error "worker state change request"

          classIndexes = []
          classIndexes . push {
  name : c.name, index: i
          } for c, i in classes

          worker . postMessage { buffer, classIndexes }

      createThreads   = ->
          blob = createBlobURL()
          for i in [ 0 ... THREADS_COUNT ]
  thread = createWorker i + THREADS_BEGIN, blob
          on

      createBlobURL   = ->
          code = "#{self.init}".split("return " + "0xdead;")[0]

          blobURL = URL.createObjectURL new Blob [
  "(", code, "}).call(self);"
          ], { type: "application/javascript" }

          delete self.init ; return blobURL

      listenEvents    = ->
          document.body.style.overscrollBehavior = "none"
          document.body.style.height = CSS.vh 100
          document.body.style.margin = 0

          prevent = (e) ->
  buffer = null
  try e.preventDefault()
  w.terminate() for w in workers
  ; 1

          window.onerror              = prevent
          window.onunload             = prevent
          window.onpagehide           = prevent
          window.onbeforeunload       = prevent
          window.onunhandledrejection = prevent

      createThreads()

      listenEvents()
   */
  self.addEventListener("DOMContentLoaded", function() {
    var element, j, len, ref, script, userScript;
    root = new Document;
    ref = [...document.scripts];
    for (j = 0, len = ref.length; j < len; j++) {
      element = ref[j];
      setParent(script = new DocumentScript, root);
      setObject(script, element);
      script.resolve();
    }
    userScript = findChild(root, UserScript, true);
    return userScript.append();
  });
  self.addEventListener("bufferready", function() {
    //log "bufferready:", buffer
    ui8 = new Uint8Array(buffer);
    u16 = new Uint16Array(buffer);
    u32 = new Uint32Array(buffer);
    u64 = new BigUint64Array(buffer);
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
};

(self.main = function() {
  var ALIGN_BYTELENGTH, BUFFER_SIZE, BYTES_PER_ELEMENT, HEADER_INDEXCOUNT, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_CLASSINDEX, HINDEX_LENGTH, HINDEX_PARENT, HINDEX_RESVBEGIN, INDEX_DATA_MALLOC, INDEX_POINTER_ALLOC, MALLOC_BYTEOFFSET, POINTER_MAXINDEX, Pointer, Scene, Scope, Storage, TextPointer, cscope, dvw, f32, findChild, findChilds, getBegin, getByteLength, getByteOffset, getClassIndex, getLength, getParent, getResvUint16, getResvUint32, getResvUint64, getResvUint8, i32, iLE, isWindow, isWorker, malloc, palloc, sab, sc, setBegin, setByteLength, setByteOffset, setClassIndex, setLength, setParent, setResvUint16, setResvUint32, setResvUint64, setResvUint8, tp, u16, u32, u64, ui8;
  isWorker = typeof DedicatedWorkerGlobalScope !== "undefined" && DedicatedWorkerGlobalScope !== null;
  isWindow = !isWorker;
  BUFFER_SIZE = 1e6 * 8;
  HEADER_INDEXCOUNT = 16;
  POINTER_MAXINDEX = 1e5;
  ALIGN_BYTELENGTH = 8;
  BYTES_PER_ELEMENT = 4;
  MALLOC_BYTEOFFSET = HEADER_INDEXCOUNT * BYTES_PER_ELEMENT * POINTER_MAXINDEX;
  INDEX_DATA_MALLOC = 1;
  INDEX_POINTER_ALLOC = 0;
  HINDEX_BYTEOFFSET = 0;
  HINDEX_BYTELENGTH = 1;
  HINDEX_LENGTH = 2;
  HINDEX_BEGIN = 3;
  HINDEX_PARENT = 4;
  HINDEX_CLASSINDEX = 5;
  HINDEX_RESVBEGIN = 8;
  if (isWindow) {
    sab = new SharedArrayBuffer(BUFFER_SIZE);
  }
  u64 = new BigUint64Array(sab);
  u32 = new Uint32Array(sab);
  i32 = new Int32Array(sab);
  f32 = new Float32Array(sab);
  ui8 = new Uint8Array(sab);
  u16 = new Uint16Array(sab);
  dvw = new DataView(sab);
  iLE = new Uint8Array(Uint16Array.of(1).buffer)[0];
  if (isWindow) {
    Atomics.or(u32, INDEX_DATA_MALLOC, MALLOC_BYTEOFFSET);
    Atomics.or(u32, INDEX_POINTER_ALLOC, HEADER_INDEXCOUNT);
  }
  malloc = Atomics.add.bind(Atomics, u32, INDEX_DATA_MALLOC);
  palloc = Atomics.add.bind(Atomics, u32, INDEX_POINTER_ALLOC, HEADER_INDEXCOUNT);
  console.log(u32);
  Storage = class Storage extends Array {
    constructor() {
      super().push();
    }

    store(Class) {
      var i;
      if (-1 === (i = this.indexOf(Class))) {
        i += this.push(Class);
      }
      return i;
    }

  };
  cscope = new (Scope = class Scope extends Storage {
    global(Class) {
      var i;
      i = this.store(Class);
      return self[Class] = function(argv) {
        var ptr;
        ptr = findChild(null, Class, true);
        if (argv === self) {
          return new Class();
        }
        return new Class();
      };
    }

  });
  findChild = function(ptri, Class, create = false) {
    var clsi, ptrj;
    ptrj = u32[0];
    if (!ptri) {
      //? returns last created Class in Global
      if (!(clsi = cscope.indexOf(Class))) {
        throw /POINTER_OR_CLASS_REQUIRED/;
      }
      while (ptrj -= HEADER_INDEXCOUNT) {
        if (u32[HINDEX_CLASSINDEX + ptrj] - clsi) {
          continue;
        }
        return new Class(ptrj);
      }
    } else {
      if (!(clsi = cscope.indexOf(Class))) {
        //? returns last child of this
        while (ptrj -= HEADER_INDEXCOUNT) {
          if (u32[HINDEX_PARENT + ptrj] - ptri) {
            continue;
          }
          return new Class(ptrj);
        }
      } else {
        //? returns last Class child of this
        while (ptrj -= HEADER_INDEXCOUNT) {
          if (u32[HINDEX_PARENT + ptrj] - ptri) {
            continue;
          }
          if (u32[HINDEX_CLASSINDEX + ptrj] - clsi) {
            continue;
          }
          return new Class(ptrj);
        }
      }
    }
    if (create) {
      //? not found and create requested
      return setChildren(ptri, new Class);
    }
    return null;
  };
  findChilds = function(ptri, Class, recursive = false, construct = true, childs = []) {
    var clsi, i, index, list, ptrj;
    if (recursive && !Class) {
      throw /CLASS_REQUIRED/;
    }
    ptrj = u32[index = 0];
    list = new Array;
    if (!ptri) {
      //? returns all created Class? in Global
      if (-1 === (clsi = cscope.indexOf(Class))) {
        //? returns all allocated pointers
        while (ptrj -= HEADER_INDEXCOUNT) {
          list[index++] = ptrj;
        }
      } else {
        //? all allocated Classes in Global
        while (ptrj -= HEADER_INDEXCOUNT) {
          if (u32[HINDEX_CLASSINDEX + ptrj] - clsi) {
            continue;
          }
          list[index++] = ptrj;
        }
      }
    } else {
      //? return childs of given pointer
      if (-1 === (clsi = cscope.indexOf(Class))) {
        //? returns all allocated pointers
        while (ptrj -= HEADER_INDEXCOUNT) {
          if (u32[HINDEX_PARENT + ptrj] - ptri) {
            continue;
          }
          list[index++] = ptrj;
        }
      } else {
        //? all allocated Classes in Global
        while (ptrj -= HEADER_INDEXCOUNT) {
          if (u32[HINDEX_PARENT + ptrj] - ptri) {
            continue;
          }
          if (u32[HINDEX_CLASSINDEX + ptrj] - clsi) {
            continue;
          }
          list[index++] = ptrj;
        }
      }
    }
    if (recursive && (i = index)) {
      while (i--) {
        findChilds(list[i], Class, true, construct, childs);
      }
    }
    if (construct) {
      if (!Class) {
        while (index--) {
          Class = cscope[getClassIndex(list[index])];
          childs.push(new Class(list[index]));
        }
      } else {
        while (index--) {
          childs.push(new Class(list[index]));
        }
      }
    } else {
      while (index--) {
        childs.push(list[index]);
      }
    }
    return childs;
  };
  setResvUint32 = function(ptri, index, value) {
    index += ptri + HINDEX_RESVBEGIN;
    return u32[index] = value;
  };
  getResvUint32 = function(ptri, index) {
    index += ptri + HINDEX_RESVBEGIN;
    return u32[index];
  };
  setResvUint16 = function(ptri, index, value) {
    index += (ptri + HINDEX_RESVBEGIN) * 2;
    return u16[index] = value;
  };
  getResvUint16 = function(ptri, index) {
    index += (ptri + HINDEX_RESVBEGIN) * 2;
    return u16[index];
  };
  setResvUint8 = function(ptri, index, value) {
    index += (ptri + HINDEX_RESVBEGIN) * 4;
    return ui8[index] = value;
  };
  getResvUint8 = function(ptri, index) {
    index += (ptri + HINDEX_RESVBEGIN) * 4;
    return ui8[index];
  };
  setResvUint64 = function(ptri, index, value) {
    index += (ptri + HINDEX_RESVBEGIN) / 2;
    return Number(u64[index] = BigInt(value));
  };
  getResvUint64 = function(ptri, index) {
    index += (ptri + HINDEX_RESVBEGIN) / 2;
    return Number(u64[index]);
  };
  setByteLength = function(ptri, value) {
    return u32[ptri + HINDEX_BYTELENGTH] = value;
  };
  getByteLength = function(ptri) {
    return u32[ptri + HINDEX_BYTELENGTH];
  };
  setByteOffset = function(ptri, value) {
    return u32[ptri] = value;
  };
  getByteOffset = function(ptri) {
    return u32[ptri];
  };
  setLength = function(ptri, value) {
    return u32[ptri + HINDEX_LENGTH] = value;
  };
  getLength = function(ptri) {
    return u32[ptri + HINDEX_LENGTH];
  };
  setBegin = function(ptri, value) {
    return u32[ptri + HINDEX_BEGIN] = value;
  };
  getBegin = function(ptri) {
    return u32[ptri + HINDEX_BEGIN];
  };
  setParent = function(ptri, ptrj) {
    return u32[ptri + HINDEX_PARENT] = ptrj;
  };
  getParent = function(ptri) {
    var clsi, ptrj;
    ptrj = u32[ptri + HINDEX_PARENT];
    if (!ptrj) {
      return null;
    }
    clsi = u32[ptrj + HINDEX_CLASSINDEX];
    return new cscope[clsi](ptrj);
  };
  setClassIndex = function(ptri, clsi) {
    return u32[ptri + HINDEX_CLASSINDEX] = clsi || cscope.indexOf(ptri.constructor);
  };
  getClassIndex = function(ptri) {
    return u32[ptri + HINDEX_CLASSINDEX];
  };
  cscope.store(Pointer = (function() {
    class Pointer extends Number {
      constructor(ptri) {
        var clsi;
        super(ptri || (clsi = palloc()));
        if (clsi) {
          setClassIndex(this);
        }
      }

      store(object, resvU32i = 0) {
        return setResvUint32(this, resvU32i, this.storage.store(object));
      }

      object(resvU32i = 0) {
        return this.storage[getResvUint32(this, resvU32i)];
      }

      add(ptri) {
        return setParent(ptri, this);
      }

      append(ptri) {
        setParent(ptri, this);
        return ptri;
      }

      set(value) {
        var alignBytes, begin, byteLength, byteOffset;
        if (!(begin = getBegin(this))) {
          if (!(byteLength = this.constructor.byteLength)) {
            byteLength = value.length * BYTES_PER_ELEMENT;
          }
          setByteLength(this, byteLength);
          setLength(this, value.length);
          if (alignBytes = byteLength % ALIGN_BYTELENGTH) {
            malloc(alignBytes);
          }
          byteOffset = setByteOffset(this, malloc(byteLength));
          begin = setBegin(this, byteOffset / 4);
        }
        if (!this.TypedArray) {
          f32.set(value, begin);
        } else {
          switch (this.TypedArray) {
            case Uint8Array:
              ui8.set(value, begin * 4);
              break;
            case Uint32Array:
              u32.set(value, begin);
              break;
            case Uint16Array:
              u16.set(value, begin * 2);
              break;
            case Float32Array:
              f32.set(value, begin);
              break;
            case BigUint64Array:
              u64.set(value, begin / 2);
          }
        }
        return this;
      }

    };

    Pointer.byteLength = 0;

    Pointer.prototype.storage = new Storage;

    Object.defineProperties(Pointer.prototype, {
      children: {
        get: function() {
          return findChilds(this);
        }
      },
      parent: {
        get: function() {
          return getParent(this);
        }
      }
    });

    Object.defineProperties(Pointer.prototype, {
      ["{{Pointer}}"]: {
        get: function() {
          return u32.subarray(this, this + HEADER_INDEXCOUNT);
        }
      }
    });

    return Pointer;

  }).call(this));
  cscope.global(Scene = (function() {
    class Scene extends Pointer {};

    Scene.prototype.name = "scene";

    return Scene;

  }).call(this));
  cscope.store(TextPointer = (function() {
    class TextPointer extends Pointer {};

    TextPointer.prototype.name = "text";

    return TextPointer;

  }).call(this));
  console.log(sc = new Scene());
  console.log(tp = new TextPointer());
  return console.log(sc.append(tp));
})();
