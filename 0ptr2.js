//? hello world <3
var ATTRIBUTE_BYTES_PERP, ATTRIBUTE_KIND, ATTRIBUTE_LOCATION, ATTRIBUTE_NORMALIZED, ATTRIBUTE_OFFSET, ATTRIBUTE_SIZE, ATTRIBUTE_STRIDE, ATTRIBUTE_TYPE, BPE, BlackOnYellow, Class, DEBUG, DRAWBUFFER_BINDBINDING, DRAWBUFFER_BYTELENGTH, DRAWBUFFER_GLOBJECT, DRAWBUFFER_ISBINDED, DRAWBUFFER_RESIZEBINDING, DRAWBUFFER_TARGET, DRAWBUFFER_USAGE, DRAWCALL_DBUFFER, DRAWCALL_DRAWBINDING, DRAWCALL_DSTBYTEOFFSET, DRAWCALL_POS_ATTRIB, DRAWCALL_PROGRAM, DRAWCALL_RCONTEXT, DRAWCALL_STATE, DRAWCALL_TARGET, DRAWCALL_TYPE, DRAWCALL_UPLOADBINDING, DRAWCALL_UPLOADED, DRAWCALL_USAGE, EVENT_, GL2KEY, GL2NUM, GL2VAL, GreenOnWhite, MESH_ATTR_VERTEX, MESH_MMATRIX, MESH_SCENE_PTRI, MESH_UPLOADED, POINTER_BYTELENGTH, POINTER_LENGTH, PROGRAM_GLPROGRAM, PROGRAM_ISINUSE, PROGRAM_POSITION_ATTRIB, PROGRAM_SHADER_SOURCE, PROGRAM_USEBINDING, PROGRAM_VAOBINDING, PTR_BYTELENGTH, PTR_BYTEOFFSET, PTR_CLASSINDEX, PTR_LINKED, PTR_PARENT, RENDERING_CONTEXT_DBUFFER, RENDERING_CONTEXT_DPROGRAM, RENDERING_CONTEXT_DRAWCALL, RENDERING_CONTEXT_GLOBJECT, RENDERING_CONTEXT_VIEWPORT, SCENE_DEFAULT_CONTEXT, SCENE_FRAME, SHADER_SOURCE_BYTES_PERP, SHADER_SOURCE_PARAMETERS, Storage, UNIFORM_BYTELENGTH, UNIFORM_KIND, UNIFORM_SIZE, UNIFORM_TYPE, VIEWPORT_ASPECT_RATIO, VIEWPORT_HEIGHT, VIEWPORT_LEFT, VIEWPORT_PIXEL_RATIO, VIEWPORT_TOP, VIEWPORT_WITDH, VIEWPORT_X, VIEWPORT_Y, WhiteOnBlack, WhiteOnBlue, WhiteOnCyan, WhiteOnMagenta, WhiteOnRed, assign, blackOnBlue, blackOnCyan, blackOnGreen, blackOnMagenta, blackOnRed, blackOnWhite, blackOnYellow, blue, className, classes, cname, colors, cyan, d, debug, define, defineds, delay, desc, descs, dvw, error, f32, get, getOwn, green, hasOwn, iLE, info, k, key, len, len1, len2, len3, len4, log, m, magenta, n, p, pkey, pname, prop, protof, q, reDefine, red, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, sab, scope, selfExtends1, selfExtends2, set, table, u32, ui8, value, w, warn, x, yellow;

DEBUG = false;

export var Pointer = class Pointer extends Number {};

export var PtriArray = class PtriArray extends Array {};

export var Vertex = class Vertex extends Float32Array {};

export var Vertices = class Vertices extends Float32Array {};

export var Attribute = class Attribute extends Float32Array {};

export var Attributes = class Attributes extends Float32Array {};

export var Unallocated = class Unallocated extends Float32Array {};

export var Scene = class Scene extends Pointer {};

export var DrawCall = class DrawCall extends Pointer {};

export var Viewport = class Viewport extends Pointer {};

export var ClearColor = class ClearColor extends Pointer {};

export var ClearMask = class ClearMask extends Pointer {};

export var Color = class Color extends Pointer {};

export var Scale = class Scale extends Pointer {};

export var Rotation = class Rotation extends Pointer {};

export var Position = class Position extends Pointer {};

export var Mesh = class Mesh extends Pointer {};

export var ModifierMatrix = class ModifierMatrix extends Pointer {};

export var Text = class Text extends Pointer {};

export var Id = class Id extends Text {};

export var ProgramSource = class ProgramSource extends Text {};

export var VertexShader = class VertexShader extends Pointer {};

export var ComputeShader = class ComputeShader extends Pointer {};

export var FragmentShader = class FragmentShader extends Pointer {};

export var Program = class Program extends Text {};

export var EventHandler = class EventHandler extends Pointer {};

export var RenderingContext = class RenderingContext extends Pointer {};

export var DrawBuffer = class DrawBuffer extends Pointer {};

export var VertexArray = class VertexArray extends Text {};

export var VertexAttribute = class VertexAttribute extends Text {};

export var Uniform = class Uniform extends Text {};

export var CPU = class CPU extends Text {};

export var GPU = class GPU extends Pointer {};

export var EventLoop = class EventLoop extends Pointer {};

export var EventListener = class EventListener extends Text {};

export var Event = class Event extends Text {};

export default classes = new Object({Scene, DrawCall, Viewport, ClearColor, ClearMask, Color, Scale, Rotation, Position, ModifierMatrix, Mesh, Id, ProgramSource, VertexShader, FragmentShader, EventHandler, Program, RenderingContext, VertexArray, VertexAttribute, Uniform, CPU, GPU, PtriArray, DrawBuffer});

GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

scope = [];

({log, warn, error, table, debug, info, delay} = console);

sab = new SharedArrayBuffer(1e7 * 8);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

BPE = 4;

//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
POINTER_LENGTH = 16;

POINTER_BYTELENGTH = BPE * POINTER_LENGTH;

Atomics.store(u32, 0, POINTER_BYTELENGTH);

Atomics.store(u32, 1, 2000 * POINTER_BYTELENGTH);

Atomics.store(u32, 2, 0);

PTR_CLASSINDEX = 0 * BPE;

PTR_PARENT = 1 * BPE;

PTR_LINKED = 2 * BPE;

PTR_BYTEOFFSET = 3 * BPE;

PTR_BYTELENGTH = 4 * BPE;

SCENE_DEFAULT_CONTEXT = 5 * BPE;

SCENE_FRAME = 6 * BPE;

MESH_SCENE_PTRI = 5 * BPE;

MESH_UPLOADED = 6 * BPE;

MESH_MMATRIX = 7 * BPE;

MESH_ATTR_VERTEX = 8 * BPE;

DRAWBUFFER_GLOBJECT = 5 * BPE;

DRAWBUFFER_ISBINDED = 6 * BPE;

DRAWBUFFER_BINDBINDING = DRAWBUFFER_ISBINDED + 1;

DRAWBUFFER_RESIZEBINDING = DRAWBUFFER_ISBINDED + 2;

DRAWBUFFER_TARGET = 7 * BPE;

DRAWBUFFER_BYTELENGTH = 8 * BPE;

DRAWBUFFER_USAGE = 9 * BPE;

DRAWCALL_DBUFFER = 5 * BPE;

DRAWCALL_TARGET = 6 * BPE;

DRAWCALL_USAGE = DRAWCALL_TARGET + 2;

DRAWCALL_RCONTEXT = 7 * BPE;

DRAWCALL_PROGRAM = 8 * BPE;

DRAWCALL_TYPE = 9 * BPE;

DRAWCALL_STATE = DRAWCALL_TYPE + 1;

DRAWCALL_UPLOADED = DRAWCALL_TYPE + 2;

DRAWCALL_DSTBYTEOFFSET = 10 * BPE;

DRAWCALL_DRAWBINDING = 11 * BPE;

DRAWCALL_UPLOADBINDING = 12 * BPE;

DRAWCALL_POS_ATTRIB = 13 * BPE;

PROGRAM_GLPROGRAM = 5 * BPE;

PROGRAM_USEBINDING = PROGRAM_GLPROGRAM + 1;

PROGRAM_ISINUSE = PROGRAM_GLPROGRAM + 2;

PROGRAM_VAOBINDING = PROGRAM_GLPROGRAM + 3;

PROGRAM_SHADER_SOURCE = 7 * BPE;

PROGRAM_POSITION_ATTRIB = 8 * BPE;

SHADER_SOURCE_BYTES_PERP = 5 * BPE;

SHADER_SOURCE_PARAMETERS = 6 * BPE;

ATTRIBUTE_LOCATION = 5 * BPE;

ATTRIBUTE_SIZE = ATTRIBUTE_LOCATION + 1;

ATTRIBUTE_TYPE = ATTRIBUTE_LOCATION + 2;

ATTRIBUTE_NORMALIZED = 6 * BPE;

ATTRIBUTE_STRIDE = ATTRIBUTE_NORMALIZED + 1;

ATTRIBUTE_OFFSET = ATTRIBUTE_NORMALIZED + 2;

ATTRIBUTE_BYTES_PERP = ATTRIBUTE_NORMALIZED + 3;

ATTRIBUTE_KIND = 7 * BPE;

UNIFORM_SIZE = 5 * BPE;

UNIFORM_BYTELENGTH = UNIFORM_SIZE + 1;

UNIFORM_TYPE = 6 * BPE;

UNIFORM_KIND = UNIFORM_TYPE + 2;

RENDERING_CONTEXT_GLOBJECT = 5 * BPE;

RENDERING_CONTEXT_VIEWPORT = 6 * BPE;

RENDERING_CONTEXT_DPROGRAM = 7 * BPE;

RENDERING_CONTEXT_DBUFFER = 8 * BPE;

RENDERING_CONTEXT_DRAWCALL = 9 * BPE;

VIEWPORT_X = 3 * BPE; // PTR_BYTEOFFSET #? HAS NO BYTEOFFSET

VIEWPORT_Y = 4 * BPE; // PTR_BYTEOFFSET #? HAS NO BYTEOFFSET

VIEWPORT_TOP = 5 * BPE;

VIEWPORT_LEFT = 6 * BPE;

VIEWPORT_WITDH = 7 * BPE;

VIEWPORT_HEIGHT = 8 * BPE;

VIEWPORT_ASPECT_RATIO = 9 * BPE;

VIEWPORT_PIXEL_RATIO = 10 * BPE;

EVENT_ = {
  move: 1,
  adopt: 2
};

//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
colors = {
  _: '\x1b[0m\x1b[0m\x1b[0m\x1b[0m',
  pool: [yellow = '\x1b[1m\x1b[33m', red = '\x1b[1m\x1b[31m', green = '\x1b[1m\x1b[32m', blue = '\x1b[1m\x1b[34m', magenta = '\x1b[1m\x1b[35m', cyan = '\x1b[1m\x1b[36m', WhiteOnBlack = '\x1b[40m\x1b[37m', WhiteOnRed = '\x1b[1m\x1b[37m\x1b[21m\x1b[41m', GreenOnWhite = '\x1b[40m\x1b[42m', BlackOnYellow = '\x1b[37m\x1b[43m', WhiteOnBlue = '\x1b[40m\x1b[44m', WhiteOnMagenta = '\x1b[40m\x1b[45m', WhiteOnCyan = '\x1b[40m\x1b[46m', blackOnWhite = '\x1b[37m\x1b[40m', blackOnRed = '\x1b[37m\x1b[41m', blackOnGreen = '\x1b[37m\x1b[42m', blackOnYellow = '\x1b[37m\x1b[43m', blackOnBlue = '\x1b[37m\x1b[44m', blackOnMagenta = '\x1b[37m\x1b[45m', blackOnCyan = '\x1b[37m\x1b[46m', yellow = '\x1b[33m', red = '\x1b[31m', green = '\x1b[32m', blue = '\x1b[34m', magenta = '\x1b[35m', cyan = '\x1b[36m', WhiteOnBlack = '\x1b[40m\x1b[37m', WhiteOnRed = '\x1b[1m\x1b[37m\x1b[21m\x1b[41m', GreenOnWhite = '\x1b[40m\x1b[42m', BlackOnYellow = '\x1b[37m\x1b[43m', WhiteOnBlue = '\x1b[40m\x1b[44m', WhiteOnMagenta = '\x1b[40m\x1b[45m', WhiteOnCyan = '\x1b[40m\x1b[46m', blackOnWhite = '\x1b[37m\x1b[40m', blackOnRed = '\x1b[37m\x1b[41m', blackOnGreen = '\x1b[37m\x1b[42m', blackOnYellow = '\x1b[37m\x1b[43m', blackOnBlue = '\x1b[37m\x1b[44m', blackOnMagenta = '\x1b[37m\x1b[45m', blackOnCyan = '\x1b[37m\x1b[46m'],
  black: '\x1b[30m',
  white: '\x1b[37m',
  redBg: '\x1b[41m',
  greenBg: '\x1b[42m',
  yellowBg: '\x1b[43m',
  blueBg: '\x1b[44m',
  magentaBg: '\x1b[45m',
  cyanBg: '\x1b[46m',
  whiteBg: '\x1b[47m'
};

define = function() {
  var e, g, o, p, prop, props, s, t, v;
  [o, props] = arguments;
  if (!DEBUG) {
    return Object.defineProperties(o, props);
  }
  for (prop in props) {
    ({
      get: g,
      set: s,
      value: v
    } = props[prop]);
    t = `${o.name || o.constructor.name}`.padEnd(15, " ");
    if (!colors[t]) {
      if (!(colors[t] = colors.pool.splice(0, 1)[0])) {
        throw /COLOR_POOL_EXCEED/;
      }
    }
    t = colors[t] + t + colors._;
    t = t + `:: ${prop}`.padEnd(20, " ");
    e = {};
    p = function(b) {
      var i, len, line, m, trace;
      trace = b.stack.split("\n");
      trace = trace.slice(1);
      trace = trace.slice(0, trace.length - 1);
      for (i = m = 0, len = trace.length; m < len; i = ++m) {
        line = trace[i];
        if (line.trim().startsWith("at")) {
          trace[i] = trace[i].replace("at").trim();
        }
        trace[i] = trace[i].split(/\s+|\t/g).filter(function(l) {
          return false === /http|undefined/.test(l);
        }).join(" ").trim();
      }
      return {
        trace: trace.filter(Boolean)
      };
    };
    if (g) {
      props[prop].get = (function(tag, get) {
        return function() {
          var r;
          Error.captureStackTrace(e = {});
          info(`${tag}` + "( get ) < ", p(e));
          r = get.call(this, ...arguments);
          info(`${tag}` + "( get ) > ");
          return r;
        };
      }).call(o, t, g);
    }
    if (s) {
      props[prop].set = (function(tag, set) {
        return function() {
          var r;
          Error.captureStackTrace(e = {});
          info(`${tag}( set ) < `, [...arguments], p(e));
          r = set.call(this, ...arguments);
          info(`${tag}( set ) > `, r);
          return r;
        };
      }).call(o, t, s);
    }
    if (v) {
      props[prop].value = (function(tag, val) {
        return function() {
          var r;
          Error.captureStackTrace(e = {});
          info(`${tag}( val ) < `, [...arguments], p(e));
          r = val.call(this, ...arguments);
          info(`${tag}( val ) > `, [r]);
          return r;
        };
      }).call(o, t, v);
    }
  }
  return Object.defineProperties(o, props);
};

selfExtends1 = {
  assign: assign = Object.assign,
  protof: protof = Object.getPrototypeOf,
  getOwn: getOwn = Object.getOwnPropertyDescriptor,
  hasOwn: hasOwn = function(o, v) {
    var Class;
    if (Object.hasOwn((Class = o.constructor).prototype, v)) {
      return Class;
    }
  },
  encode: TextEncoder.prototype.encode.bind(new TextEncoder),
  decode: TextDecoder.prototype.decode.bind(new TextDecoder),
  palloc: function() {
    var o;
    o = Atomics.add(u32, 0, POINTER_BYTELENGTH);
    if (!o) {
      throw [/PALLOC/, u32.slice(0, 2)];
    }
    return o;
  },
  malloc: function(byteLength = 0) {
    var mod, o;
    if (mod = byteLength % 8) {
      byteLength += 8 - mod;
    }
    o = Atomics.add(u32, 1, byteLength);
    if (!o || o % 8) {
      throw [/NOD_8/, u32.slice(0, 2)];
    }
    return o;
  }
};

export var storage = new (Storage = class Storage extends Array {
  constructor() {
    super(...arguments).append(null);
  }

  findByName() {
    return this.find((i) => {
      return i && i.name === arguments[0];
    });
  }

  fillFirstEmpty(o) {
    var i;
    this[i = this.findIndex(function(v, j) {
      return j && !v;
    })] = o;
    return i;
  }

  pushOrFindIndex(o) {
    var i;
    if (-1 === (i = this.indexOf(o))) {
      i += this.push(o);
    }
    return i;
  }

  append(o) {
    this[this.length] = o;
    return this;
  }

})(0xff);

//* <----------------------------------------> *#
//* <----------------------------------------> *#
//* <----------------------------------------> *#
selfExtends2 = {
  keyOfWebGL2: function(type, min = 0xff, max = 0xffff) {
    var name, name1;
    if ((type < min) || (type > max)) {
      return type;
    }
    if (/\s+/.test(`${type}`)) {
      return type;
    }
    if (`${type}` !== `${type}`.toUpperCase()) {
      return type;
    }
    switch (typeof type) {
      case "number":
        name = GL2KEY.at(GL2VAL.indexOf(type));
        break;
      case "string":
        type = GL2VAL.at(GL2KEY.indexOf(name = type));
        break;
      default:
        return type;
    }
    return GL2NUM[name1 = name + type] || (GL2NUM[name1] = eval(`new (class ${name} extends Number {})(${type})`));
  },
  addListener: function(element, event, handler) {
    element.addEventListener(event, handler);
    return element;
  },
  hitListener: function(element, event, detail) {
    return element.dispatchEvent(new CustomEvent(event, {detail}));
  },
  appendElement: function(element) {
    document.body.appendChild(element);
    return element;
  },
  createElement: function(tagName) {
    return document.createElement(tagName);
  },
  queryDocument: function(query, all = false) {
    if (!all) {
      return document.querySelector(query);
    } else {
      return document.querySelectorAll(query);
    }
  },
  hitOnTimeout: function() {
    var fn;
    fn = arguments[0];
    return function() {
      return clearTimeout(delay) || (delay = setTimeout(fn.bind(this, ...arguments), 40));
    };
  },
  getByteOffset: function(ptri) {
    return dvw.getUint32(ptri + PTR_BYTEOFFSET, iLE);
  },
  setByteOffset: function(ptri, byteOffset) {
    dvw.setUint32(ptri + PTR_BYTEOFFSET, byteOffset, iLE);
    return byteOffset;
  },
  getByteLength: function(ptri) {
    return dvw.getUint32(ptri + PTR_BYTELENGTH, iLE);
  },
  setByteLength: function(ptri, byteLength) {
    dvw.setUint32(ptri + PTR_BYTELENGTH, byteLength, iLE);
    return byteLength;
  },
  ptr_Pointer: function(ptri) {
    return ptri && new storage[getClassIndex(ptri)](ptri);
  },
  new_Pointer: function(Class) {
    var byteLength, byteOffset, clsi, ptri;
    ptri = new Class(Atomics.add(u32, 0, POINTER_BYTELENGTH));
    clsi = storage.indexOf(Class);
    dvw.setUint32(ptri + PTR_CLASSINDEX, clsi, iLE);
    if (byteLength = Class.byteLength) {
      byteOffset = malloc(byteLength);
      dvw.setUint32(ptri + PTR_BYTELENGTH, byteOffset, iLE);
      ptri;
      dvw.setUint32(ptri + PTR_BYTEOFFSET, byteOffset, iLE);
      ptri;
    }
    return ptri;
  },
  getClassIndex: function(ptri) {
    return dvw.getUint32(ptri + PTR_CLASSINDEX, iLE) || storage.indexOf(ptri.constructor);
  },
  setClassIndex: function(ptri, clsi) {
    if (-1 === (clsi || (clsi = storage.indexOf(ptri.constructor)))) {
      throw /CLASS_INDEX_ERR/;
    }
    dvw.setUint32(ptri + PTR_CLASSINDEX, clsi || getClassIndex(ptri), iLE);
    return ptri;
  },
  addChildren: function(parent, child) {
    dvw.setUint32(child + PTR_PARENT, parent, iLE);
    return child;
  },
  setParent: function(child, parent) {
    dvw.setUint32(child + PTR_PARENT, parent, iLE);
    return parent;
  },
  getParent: function(ptri) {
    return dvw.getUint32(ptri + PTR_PARENT, iLE);
  },
  getUint8: function(ptri, byteOffset) {
    return dvw.getUint8(byteOffset + getByteOffset(ptri));
  },
  setUint8: function(ptri, byteOffset, value) {
    dvw.setUint8(byteOffset + getByteOffset(ptri), value);
    return value;
  },
  addUint32: function(ptri, byteOffset, value, atomics = true) {
    var val;
    byteOffset += getByteOffset(ptri);
    if (atomics) {
      return Atomics.add(u32, byteOffset / 4, value);
    } else {
      val = dvw.getUint32(byteOffset, iLE);
      dvw.setUint32(byteOffset, value + val, iLE);
    }
    return val;
  },
  getUint32: function(ptri, byteOffset) {
    return dvw.getUint32(byteOffset + getByteOffset(ptri), iLE);
  },
  setUint32: function(ptri, byteOffset, value) {
    dvw.setUint32(byteOffset + getByteOffset(ptri), value, iLE);
    return value;
  },
  getFloat32: function(ptri, byteOffset) {
    return dvw.getFloat32(byteOffset + getByteOffset(ptri), iLE);
  },
  setFloat32: function(ptri, byteOffset, value) {
    dvw.setFloat32(byteOffset + getByteOffset(ptri), value, iLE);
    return value;
  },
  getPtriUint8: function(byteOffset) {
    return dvw.getUint8(byteOffset);
  },
  setPtriUint8: function(byteOffset, value) {
    dvw.setUint8(byteOffset, value);
    return value;
  },
  addPtriUint32: function(byteOffset, value) {
    return Atomics.add(u32, byteOffset / 4, value);
  },
  getPtriUint32: function(byteOffset) {
    return dvw.getUint32(byteOffset, iLE);
  },
  setPtriUint32: function(byteOffset, value) {
    dvw.setUint32(byteOffset, value, iLE);
    return value;
  },
  getPtriUint16: function(byteOffset) {
    return dvw.getUint16(byteOffset, iLE);
  },
  setPtriUint16: function(byteOffset, value) {
    dvw.setUint16(byteOffset, value, iLE);
    return value;
  },
  getPtriFloat32: function(byteOffset) {
    return dvw.getFloat32(byteOffset, iLE);
  },
  setPtriFloat32: function(byteOffset, value) {
    dvw.setFloat32(byteOffset, value, iLE);
    return value;
  },
  storeForUint8: function(any) {
    var i, max;
    if (-1 !== (i = storage.indexOf(any))) {
      return i;
    }
    i = 0;
    max = 0xff;
    while (i++ < max) {
      if (storage[i] === any) {
        return i;
      }
      if (storage[i]) {
        continue;
      }
      if (storage[i] = any) {
        return i;
      }
    }
    throw /STORE_FOR_UINT8/;
  },
  storeForUint32: function(any) {
    var i, max;
    if (-1 !== (i = storage.indexOf(any))) {
      return i;
    }
    i = 0xff;
    max = 0xffffffff;
    while (i++ < max) {
      if (storage[i] === any) {
        return i;
      }
      if (storage[i]) {
        continue;
      }
      if (storage[i] = any) {
        return i;
      }
    }
    throw /STORE_FOR_UINT32/;
  },
  new_Uint32Array: function(ptri, byteOffset, length) {
    length || (length = getByteLength(ptri) / 4);
    byteOffset = getByteOffset(ptri) + (byteOffset || 0);
    return new Uint32Array(sab, byteOffset, length);
  },
  new_Uint8Array: function(ptri, byteOffset, length) {
    length || (length = getByteLength(ptri));
    byteOffset = getByteOffset(ptri) + (byteOffset || 0);
    return new Uint8Array(sab, byteOffset, length);
  },
  new_Float32Array: function(ptri, byteOffset, length) {
    length || (length = getByteLength(ptri) / 4);
    byteOffset = getByteOffset(ptri) + (byteOffset || 0);
    return new Float32Array(sab, byteOffset, length);
  },
  new_Attribute: function(ptri, byteOffset, length) {
    length || (length = getByteLength(ptri) / 4);
    byteOffset = getByteOffset(ptri) + (byteOffset || 0);
    return new Attribute(sab, byteOffset, length);
  },
  sliceUint8: function(ptri, begin, end) {
    var length;
    length = end ? end - (begin || 0) : getByteLength(ptri);
    begin = getByteOffset(ptri) + (begin || 0);
    return ui8.slice(begin, begin + length);
  },
  ptrByteCompare: function(ptri, ptrj) {
    var byteLengthA, byteLengthB, byteOffsetA, byteOffsetB, i;
    if (!(ptri - ptrj)) { //non-same
      return 0;
    }
    byteLengthA = getByteLength(ptri);
    byteLengthB = getByteLength(ptrj);
    if (byteLengthA - (i = byteLengthB)) {
      return 0;
    }
    byteOffsetA = getByteOffset(ptri);
    byteOffsetB = getByteOffset(ptrj);
    while (i--) {
      if (dvw.getUint8(byteOffsetA + i) - dvw.getUint8(byteOffsetB + i)) {
        return 0;
      }
    }
    return 1;
  },
  findMatchedLine: function(text, test) {
    test = RegExp.prototype.test.bind(test);
    return text.split(/\n/g).find(test);
  },
  parseGLSLSource: function(glsl, pool) {
    var exec, list, main, none, test;
    none = /\s+|\(|\)|\=|\*|\,|\.|\;|\n|\{|\}|\]|\[/g;
    test = function(l) {
      return !/gl_|vec|mat|int|float/.test(l);
    };
    main = glsl.split(/main/, 2).pop();
    list = main.split(none).filter(Boolean).filter(isNaN).filter(test);
    if (!pool) {
      return list;
    }
    exec = pool.filterDecoded || pool.filter;
    return exec.call(pool, function(p) {
      return list.includes(p);
    });
  },
  findChild: function(ptri, Class, inherit = false) {
    var clsi, ptrj;
    if (!ptri) {
      return;
    }
    ptrj = Atomics.load(u32);
    clsi = storage.indexOf(Class);
    while (ptrj -= POINTER_BYTELENGTH) {
      if (ptri - getParent(ptrj)) {
        continue;
      }
      if (clsi - getClassIndex(ptrj)) {
        continue;
      }
      return ptr_Pointer(ptrj);
    }
    if (!inherit) {
      return;
    }
    return findChild(getParent(ptri), Class, inherit);
  },
  findChilds: function(ptri, Class, construct = true) {
    var clsi, i, list, ptrj;
    ptrj = Atomics.load(u32);
    clsi = storage.indexOf(Class);
    list = new PtriArray;
    i = 0;
    if (!ptri) {
      if (!construct) {
        while (ptrj -= POINTER_BYTELENGTH) {
          if (clsi - getClassIndex(ptrj)) {
            continue;
          }
          list[i++] = ptrj;
        }
      } else {
        while (ptrj -= POINTER_BYTELENGTH) {
          if (clsi - getClassIndex(ptrj)) {
            continue;
          }
          list[i++] = ptr_Pointer(ptrj);
        }
      }
    } else {
      if (!construct) {
        while (ptrj -= POINTER_BYTELENGTH) {
          if (ptri - getParent(ptrj)) {
            continue;
          }
          if (clsi - getClassIndex(ptrj)) {
            continue;
          }
          list[i++] = ptrj;
        }
      } else {
        while (ptrj -= POINTER_BYTELENGTH) {
          if (ptri - getParent(ptrj)) {
            continue;
          }
          if (clsi - getClassIndex(ptrj)) {
            continue;
          }
          list[i++] = ptr_Pointer(ptrj);
        }
      }
    }
    return list;
  },
  findPointer: function(test, Class, construct = true) {
    var clsi, ptr, ptrj;
    ptrj = Atomics.load(u32);
    if (!Class) {
      if (!construct) {
        while (0 < (ptrj -= POINTER_BYTELENGTH)) {
          if (test(ptr = ptrj)) {
            return ptr;
          }
        }
        return void 0;
      }
      while (0 < (ptrj -= POINTER_BYTELENGTH)) {
        if (test(ptr = ptr_Pointer(ptrj))) {
          return ptr;
        }
      }
      return void 0;
    } else {
      clsi = storage.indexOf(Class);
      if (!construct) {
        while (0 < (ptrj -= POINTER_BYTELENGTH)) {
          if (clsi - getClassIndex(ptrj)) {
            continue;
          }
          if (test(ptr = ptrj)) {
            return ptr;
          }
        }
      }
      while (0 < (ptrj -= POINTER_BYTELENGTH)) {
        if (clsi - getClassIndex(ptrj)) {
          continue;
        }
        if (test(ptr = ptr_Pointer(ptrj))) {
          return ptr;
        }
      }
    }
    return void 0;
  },
  // ?
  // ?
  // ?
  // ?
  getclsi_propvalue: function(clsi, prop) {
    var d;
    return (d = getOwn(scope[clsi], prop)) && d.value || 0;
  },
  setclsi_propvalue: function(clsi, prop, value) {
    define(scope[clsi], {
      [prop]: {value}
    });
    return value;
  },
  newclsi_prop: function(clsi, prop, byteLength) {
    define(scope[clsi], {
      [prop]: {value}
    });
    return value;
  },
  getclsi_bytelength: function(clsi) {
    return getclsi_propvalue(clsi, "byteLength");
  },
  setclsi_bytelength: function(clsi, value) {
    return setclsi_propvalue(clsi, "byteLength", value);
  },
  getclsi_propoffset: function(clsi, prop) {
    return getclsi_propvalue(clsi, prop.toUpperCase());
  },
  setclsi_propoffset: function(clsi, prop, value) {
    return setclsi_propvalue(clsi, prop.toUpperCase(), value);
  },
  getptri_propvalue: function(ptri, prop, getter) {
    var clsi, offset;
    clsi = getptri_clsi(ptri);
    offset = getclsi_propoffset(clsi, prop);
    return dvw[getter](ptri + offset, iLE);
  },
  setptri_propvalue: function(ptri, prop, value, setter) {
    var clsi, offset;
    clsi = getptri_clsi(ptri);
    offset = getclsi_propoffset(clsi, prop);
    dvw[setter](ptri + offset, value, iLE);
    return value;
  },
  getptri_propvalue_u32: function(ptri, prop) {
    return getptri_propvalue(ptri, prop, "getUint32");
  },
  setptri_propvalue_u32: function(ptri, prop, value) {
    return setptri_propvalue(ptri, prop, value, "setUint32");
  },
  getptri_propvalue_u16: function(ptri, prop) {
    return getptri_propvalue(ptri, prop, "getUint16");
  },
  setptri_propvalue_u16: function(ptri, prop, value) {
    return setptri_propvalue(ptri, prop, value, "setUint16");
  },
  getptri_propvalue_ui8: function(ptri, prop) {
    return getptri_propvalue(ptri, prop, "getUint8");
  },
  setptri_propvalue_ui8: function(ptri, prop, value) {
    return setptri_propvalue(ptri, prop, value, "setUint8");
  },
  setptri_bytelength: function(ptri, value) {
    return setptri_propvalue_u32(ptri, "byteLength", value);
  },
  setptri_byteoffset: function(ptri, value) {
    return setptri_propvalue_u32(ptri, "byteoffset", value);
  },
  getptri_bytelength: function(ptri) {
    return getptri_propvalue_u32(ptri, "byteLength");
  },
  getptri_byteoffset: function(ptri) {
    return getptri_propvalue_u32(ptri, "byteoffset");
  },
  getptri_clsi: function(ptri) {
    return dvw.getUint32(ptri + PTR_CLASSINDEX, iLE);
  },
  setptri_clsi: function(ptri, clsi) {
    dvw.setUint32(ptri + PTR_CLASSINDEX, clsi, iLE);
    return clsi;
  },
  newptri: function(clsi) {
    var byteLength, byteOffset, ptri;
    ptri = palloc();
    setptri_clsi(ptri, clsi);
    if (byteLength = getclsi_bytelength(clsi)) {
      byteOffset = malloc(byteLength);
      setptri_bytelength(ptri, byteLength);
      setptri_byteoffset(ptri, byteOffset);
    }
    return ptri;
  },
  registerClass: function(alias, extend) {
    var el;
    return document.head.appendChild(assign(el = document.createElement("script"), {
      innerText: `class ${alias.substring(0, 30)} extends ${extend.name || extend} {}`
    })).remove();
  },
  getclsi: function(Class) {
    var clsi;
    if (-1.0 === (clsi = scope.indexOf(Class))) {
      clsi = 0xff - 1;
      while (scope[clsi]) {
        clsi = clsi - 1;
      }
      if (clsi < 1) {
        throw /EXCEED_STOREUI8/;
      }
      scope[clsi] = Class;
    }
    if (0xff <= clsi) {
      if (scope.splice(clsi, 1)) {
        throw Class;
      }
    }
    return clsi;
  },
  newptri_ofclsi: function(clsi) {
    return newptri(clsi);
  },
  newPointer: function(ptri, clsi) {
    var Class;
    Class = scope[clsi || getptri_clsi(ptri)];
    return new Class(ptri);
  },
  newClass: function(Class, ptri) {
    var clsi;
    clsi = scope.indexOf(Class);
    return new Class(ptri || newptri(clsi));
  },
  newClsi: function(clsi, ptri) {
    var Class;
    Class = scope[clsi];
    return new Class(ptri || newptri(clsi));
  },
  getptri_byteoffsetof_prop: function(ptri, prop) {
    var clsi;
    clsi = getptri_clsi(ptri);
    return getclsi_byteoffsetof_prop(clsi, prop);
  },
  setptri_prop: function(ptri, prop) {
    var value;
    for (prop in props) {
      value = props[prop];
      setptri_prop(ptri, prop, value);
    }
    return ptri;
  },
  setptri_props: function(ptri, props) {
    var prop, value;
    for (prop in props) {
      value = props[prop];
      setptri_prop(ptri, prop, value);
    }
    return ptri;
  },
  newPointer_ofclsi__setptri_props: function(clsi, props) {
    var prop, ptri, value;
    ptri = newPointer_ofclsi(clsi);
    for (prop in props) {
      value = props[prop];
      setptri_prop(ptri, prop, value);
    }
    return ptri;
  }
};

ref = {...selfExtends1, ...selfExtends2};
for (k in ref) {
  value = ref[k];
  define(self, {
    [k]: {value}
  });
}

//* <----------------------------------------> *#
//* <----------------------------------------> *#
//* <----------------------------------------> *#
registerClass("Pointer", Number);

registerClass("Display", Pointer);

registerClass("Event", Pointer);

log(new Event(1));

define(Ozgur.prototype, {
  getSome: {
    enumerable: true,
    get: function() {
      return 1;
    }
  }
});

log(22, new Ozgur(4));

log(22, new Alt(44));

define(Pointer.prototype, {
  ['{{Pointer}}']: {
    get: function() {
      return define({}, {
        headAsUint8: {
          enumerable: true,
          get: () => {
            return new Uint8Array(sab, this, POINTER_BYTELENGTH);
          }
        },
        headAsUint32: {
          enumerable: true,
          get: () => {
            return new Uint32Array(sab, this, POINTER_LENGTH);
          }
        },
        headAsFloat32: {
          enumerable: true,
          get: () => {
            return new Float32Array(sab, this, POINTER_LENGTH);
          }
        }
      });
    }
  }
});

define(Pointer, {
  of: {
    value: function(props = {}) {
      return assign(new_Pointer(this), props);
    }
  }
});

define(Pointer, {
  from: {
    value: function() {
      var arg0, i, len, m, prop, ptri, ref1;
      setClassIndex(ptri = new this(palloc()));
      switch ((ref1 = (arg0 = arguments[0])) != null ? ref1.constructor : void 0) {
        case Object:
          for (prop in arg0) {
            value = arg0[prop];
            addChildren(ptri, storage[prop].from(value));
          }
          break;
        case Array:
          for (m = 0, len = arg0.length; m < len; m++) {
            i = arg0[m];
            for (prop in i) {
              value = i[prop];
              addChildren(ptri, storage[prop].from(value));
            }
          }
          break;
        case String:
          ptri.set(arg0);
          break;
        default:
          error(arg0);
      }
      return ptri;
    }
  }
});

define(Pointer.prototype, {
  toString: {
    value: function() {
      return error("tostring", this);
    }
  }
});

define(Pointer.prototype, {
  beChildrenOf: {
    value: function(parent) {
      return addChildren(parent, this);
    }
  }
});

define(Pointer.prototype, {
  beParentOf: {
    value: function(ptri) {
      return setParent(ptri, this);
    }
  }
});

define(Pointer.prototype, {
  children: {
    enumerable: true,
    configurable: true,
    get: function() {
      var list, ptri, ptrj;
      ptrj = dvw.getUint32(0, iLE);
      ptri = +this;
      list = new PtriArray;
      while (ptrj -= POINTER_BYTELENGTH) {
        if (ptri - getParent(ptrj)) {
          continue;
        }
        list[list.length] = ptr_Pointer(ptrj);
      }
      return list;
    }
  }
});

define(Pointer.prototype, {
  parent: {
    enumerable: true,
    get: function() {
      return ptr_Pointer(getParent(this));
    }
  }
});

define(Pointer.prototype, {
  isPointer: {
    value: true
  }
});

define(Text.prototype, {
  isTextPointer: {
    value: true
  }
});

define(Text.prototype, {
  TypedArray: {
    value: Uint8Array
  }
});

define(Text.prototype, {
  set: {
    value: function(value) {
      var byteLength, byteOffset;
      if (/string/.test(typeof value)) {
        value = encode(value);
      }
      if (!value instanceof Uint8Array) {
        throw {
          TEXT_VALUE_ERROR: value
        };
      }
      if (!(byteOffset = getByteOffset(this))) {
        byteLength = value.byteLength;
        byteOffset = malloc(byteLength);
        setByteOffset(this, byteOffset);
        setByteLength(this, byteLength);
      }
      ui8.set(value, byteOffset);
      return this;
    }
  }
});

define(Position, {
  byteLength: {
    value: 4 * 3
  }
});

define(Position.prototype, {
  TypedArray: {
    value: Float32Array
  }
});

define(Position.prototype, {
  subarray: {
    get: function() {
      return new Float32Array(sab, getByteOffset(this), 3);
    }
  }
});

define(Position.prototype, {
  set: {
    value: function(value) {
      var byteLength, byteOffset, length;
      if (ArrayBuffer.isView(value) || Array.isArray(value)) {
        length = 3;
        byteLength = 12;
        if (!(byteOffset = getByteOffset(this))) {
          byteOffset = malloc(byteLength);
          setByteOffset(this, byteOffset);
          setByteLength(this, byteLength);
        }
        this.subarray.set(value);
        return this;
      }
      throw /POSITION_SET/;
    }
  }
});

define(Color, {
  byteLength: {
    value: 4 * 4
  }
});

define(Color.prototype, {
  TypedArray: {
    value: Float32Array
  }
});

define(PtriArray.prototype, {
  findDecoded: {
    value: function(fn) {
      var i, len, m, ptri, ref1, text;
      ref1 = this;
      for (i = m = 0, len = ref1.length; m < len; i = ++m) {
        ptri = ref1[i];
        text = decode(sliceUint8(ptri));
        if (fn.call(ptri, text, i, this)) {
          return ptri;
        }
      }
      return null;
    }
  }
});

define(PtriArray.prototype, {
  filterDecoded: {
    value: function(fn) {
      var filtered, i, len, m, ptri, ref1, text;
      filtered = new this.constructor;
      ref1 = this;
      for (i = m = 0, len = ref1.length; m < len; i = ++m) {
        ptri = ref1[i];
        text = decode(sliceUint8(ptri));
        if (fn.call(ptri, text, i, this)) {
          filtered.push(ptri);
        }
      }
      return filtered;
    }
  }
});

define(PtriArray.prototype, {
  includes: {
    value: function(any) {
      var len, len1, m, n, ptri, ref1, ref2, text;
      switch (true) {
        case "string" === typeof any:
          ref1 = this;
          for (m = 0, len = ref1.length; m < len; m++) {
            ptri = ref1[m];
            text = decode(sliceUint8(ptri));
            if (text === any) {
              return 1;
            }
          }
          return 0;
        case any instanceof RegExp:
          ref2 = this;
          for (n = 0, len1 = ref2.length; n < len1; n++) {
            ptri = ref2[n];
            text = decode(sliceUint8(ptri));
            if (any.test(text)) {
              return 1;
            }
          }
          return 0;
        default:
          throw /PTRI_ARRAY_INCLUDES/;
      }
    }
  }
});

define(PtriArray.prototype, {
  last: {
    value: function() {
      return this[this.length - 1];
    }
  }
});

define(Scene.prototype, {
  visibility: {
    get: function() {
      return this;
    }
  }
});

define(Scene.prototype, {
  isScene: {
    value: true
  }
});

define(Scene.prototype, {
  getDrawCalls: {
    value: function() {
      var drawCall, len, m, ref1;
      if (!findChild(this, DrawCall)) {
        ref1 = this.renderingContext.defaultDrawCalls;
        for (m = 0, len = ref1.length; m < len; m++) {
          drawCall = ref1[m];
          addChildren(this, drawCall.inheritableCopy);
        }
      }
      return findChilds(this, DrawCall);
    }
  }
});

define(Scene.prototype, {
  renderingContext: {
    enumerable: true,
    set: function(ptri) {
      return setPtriUint32(this + SCENE_DEFAULT_CONTEXT, ptri);
    },
    get: function() {
      var ptri;
      if (!(ptri = getPtriUint32(this + SCENE_DEFAULT_CONTEXT))) {
        if (!(ptri = findChilds(this, RenderingContext).last())) {
          addChildren(this, ptri = new_Pointer(RenderingContext));
        }
        setPtriUint32(this + SCENE_DEFAULT_CONTEXT, ptri);
      }
      return new RenderingContext(ptri);
    }
  }
});

define(DrawBuffer.prototype, {
  glObject: {
    get: function() {
      var buff, gl, stri;
      if (!(stri = getPtriUint8(this + DRAWBUFFER_GLOBJECT))) {
        if (gl = this.parent.glObject) {
          buff = gl.createBuffer();
        }
        stri = storeForUint8(buff);
        setPtriUint8(this + DRAWBUFFER_GLOBJECT, stri);
      }
      return storage[stri];
    }
  }
});

define(DrawBuffer.prototype, {
  bind: {
    value: function() {
      var binding, construct, gl, len, m, ptri, ptrj, ref1, stri, target;
      if (!getPtriUint8(this + DRAWBUFFER_ISBINDED)) {
        setPtriUint8(this + DRAWBUFFER_ISBINDED, 1);
        [ptri, gl, target] = [+this, this.parent.glObject, this.target];
        ref1 = findChilds(this.parent, DrawBuffer, construct = false);
        for (m = 0, len = ref1.length; m < len; m++) {
          ptrj = ref1[m];
          if (ptri - ptrj) {
            setPtriUint8(ptrj + DRAWBUFFER_ISBINDED, 0);
          }
        }
        if (!(stri = getPtriUint8(ptri + DRAWBUFFER_BINDBINDING))) {
          binding = gl.bindBuffer.bind(gl, target, this.glObject);
          stri = setPtriUint8(ptri + DRAWBUFFER_BINDBINDING, storeForUint8(binding));
        }
        storage[stri]();
      }
      return 1;
    }
  }
});

define(DrawBuffer.prototype, {
  debug: {
    get: function() {
      return Object.defineProperties(this, {
        bind: {
          get: this.bind
        },
        resize: {
          get: this.resize
        }
      });
    }
  }
});

define(DrawBuffer.prototype, {
  isBinded: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + DRAWBUFFER_ISBINDED);
    }
  }
});

define(DrawBuffer.prototype, {
  drawCalls: {
    enumerable: true,
    get: function() {
      var dc, len, list, m, ref1;
      list = new PtriArray;
      ref1 = findChilds(null, DrawCall);
      for (m = 0, len = ref1.length; m < len; m++) {
        dc = ref1[m];
        if (dc.drawBuffer - this) {
          continue;
        }
        list.push(dc);
      }
      return list;
    }
  }
});

define(DrawBuffer.prototype, {
  resize: {
    value: function() {
      var applyArgs, binding, gl, stri, target, usage;
      if (!getPtriUint8(this + DRAWBUFFER_ISBINDED)) {
        this.bind();
      }
      if (!(stri = getPtriUint8(this + DRAWBUFFER_RESIZEBINDING))) {
        gl = this.parent.glObject;
        usage = this.usage;
        target = this.target;
        applyArgs = new Uint32Array(sab, this + DRAWBUFFER_TARGET, 3);
        binding = gl.bufferData.apply.bind(gl.bufferData, gl, applyArgs);
        stri = storeForUint8(binding);
        setPtriUint8(this + DRAWBUFFER_RESIZEBINDING, stri);
      }
      storage[stri]();
      return 1;
    }
  }
});

define(DrawBuffer.prototype, {
  malloc: {
    value: function(byteLength) {
      var byteOffset;
      byteOffset = addPtriUint32(this + DRAWBUFFER_BYTELENGTH, byteLength);
      this.resize(byteOffset + byteLength);
      return byteOffset;
    }
  }
});

define(DrawBuffer.prototype, {
  byteLength: {
    enumerable: true,
    get: function() {
      return getPtriUint32(this + DRAWBUFFER_BYTELENGTH);
    }
  }
});

define(DrawBuffer.prototype, {
  target: {
    enumerable: true,
    set: function() {
      return setPtriUint32(this + DRAWBUFFER_TARGET, arguments[0]);
    },
    get: function() {
      var target;
      if (!(target = getPtriUint32(this + DRAWBUFFER_TARGET))) {
        target = keyOfWebGL2("ARRAY_BUFFER");
        setPtriUint32(this + DRAWBUFFER_TARGET, target);
      }
      return keyOfWebGL2(target);
    }
  }
});

define(DrawBuffer.prototype, {
  usage: {
    enumerable: true,
    set: function() {
      return setPtriUint32(this + DRAWBUFFER_USAGE, arguments[0]);
    },
    get: function() {
      var usage;
      if (!(usage = getPtriUint32(this + DRAWBUFFER_USAGE))) {
        usage = keyOfWebGL2("STATIC_DRAW");
        setPtriUint32(this + DRAWBUFFER_USAGE, usage);
      }
      return keyOfWebGL2(usage);
    }
  }
});

define(DrawCall.prototype, {
  isDrawCall: {
    value: true
  }
});

define(DrawCall.prototype, {
  pointCount: {
    enumerable: true,
    get: function() {
      return this.parent.pointCount;
    }
  }
});

define(DrawCall.prototype, {
  attribute: {
    value: function(index, attribute) {
      var byteOffset, length, ptri;
      ptri = this.findVertexAttrib(attribute);
      index = ptri.offsetIndex;
      length = ptri.size;
      byteOffset = index * ptri.BYTES_PER_POINT + ptri.offset;
      return new_Attribute(this, byteOffset, length);
    }
  }
});

define(DrawCall.prototype, {
  debug: {
    get: function() {
      return Object.defineProperties(this, {
        draw: {
          get: this.draw
        }
      });
    }
  }
});

define(DrawCall.prototype, {
  target: {
    enumerable: true,
    set: function() {
      return setPtriUint16(this + DRAWCALL_TARGET, arguments[0]);
    },
    get: function() {
      var target;
      if (!(target = getPtriUint16(this + DRAWCALL_TARGET))) {
        return this.target = keyOfWebGL2("ARRAY_BUFFER");
      }
      return keyOfWebGL2(target);
    }
  }
});

define(DrawCall.prototype, {
  usage: {
    enumerable: true,
    set: function() {
      return setPtriUint16(this + DRAWCALL_USAGE, arguments[0]);
    },
    get: function() {
      var usage;
      if (!(usage = getPtriUint16(this + DRAWCALL_USAGE))) {
        return this.usage = keyOfWebGL2("STATIC_DRAW");
      }
      return keyOfWebGL2(usage);
    }
  }
});

define(DrawCall.prototype, {
  type: {
    enumerable: true,
    set: function() {
      return setPtriUint8(this + DRAWCALL_TYPE, arguments[0]);
    },
    get: function() {
      var min, type;
      if (!(type = getPtriUint8(this + DRAWCALL_TYPE))) {
        return this.type = keyOfWebGL2("TRIANGLES");
      }
      return keyOfWebGL2(type, min = 0);
    }
  }
});

define(DrawCall.prototype, {
  setNeedsUpload: {
    value: function() {
      return setPtriUint8(this + DRAWCALL_UPLOADED, arguments[0]);
    }
  }
});

define(DrawCall.prototype, {
  getNeedsUpload: {
    value: function() {
      return getPtriUint8(this + DRAWCALL_UPLOADED);
    }
  }
});

define(DrawCall.prototype, {
  upload: {
    value: function() {
      var fn, gl, stri;
      if (!getPtriUint8(this + DRAWCALL_UPLOADED)) {
        setPtriUint8(this + DRAWCALL_UPLOADED, 1);
        if (!(stri = getPtriUint32(this + DRAWCALL_UPLOADBINDING))) {
          gl = this.renderingContext.glObject;
          fn = gl.bufferSubData.bind(gl, this.target, this.dstByteOffset, this.attributes);
          stri = storeForUint32(fn);
          setPtriUint32(this + DRAWCALL_UPLOADBINDING, stri);
        }
        this.drawBuffer.bind();
        storage[stri]();
        return 1;
      }
      return 0;
    }
  }
});

define(DrawCall.prototype, {
  byteOffset: {
    enumerable: true,
    get: function() {
      this.dstByteOffset; //allocate if did not before
      return getByteOffset(this);
    }
  }
});

define(DrawCall.prototype, {
  byteLength: {
    enumerable: true,
    get: function() {
      this.dstByteOffset; //allocate if did not before
      return getByteLength(this);
    }
  }
});

define(DrawCall.prototype, {
  findVertexAttrib: {
    value: function() {
      return this.program.findVertexAttrib(...arguments);
    }
  }
});

define(DrawCall.prototype, {
  attributes: {
    enumerable: true,
    get: function() {
      var length;
      length = this.byteLength / Attributes.BYTES_PER_ELEMENT;
      return new Attributes(sab, this.byteOffset, length);
    }
  }
});

define(DrawCall.prototype, {
  dstByteOffset: {
    enumerable: true,
    get: function() {
      var byteLength, byteOffset;
      if (!(byteOffset = getPtriUint32(this + DRAWCALL_DSTBYTEOFFSET))) {
        byteLength = this.program.BYTES_PER_POINT * this.pointCount;
        byteOffset = this.drawBuffer.malloc(byteLength);
        setByteLength(this, byteLength);
        setByteOffset(this, malloc(byteLength));
        setPtriUint32(this + DRAWCALL_DSTBYTEOFFSET, byteOffset);
      }
      return byteOffset;
    }
  }
});

define(DrawCall.prototype, {
  draw: {
    value: function() {
      var count, fn, gl, start, stri;
      if (!(stri = getPtriUint32(this + DRAWCALL_DRAWBINDING))) {
        gl = this.renderingContext.glObject;
        start = this.dstByteOffset / this.program.BYTES_PER_POINT;
        count = this.pointCount;
        stri = storeForUint32(fn = gl.drawArrays.bind(gl, this.type, start, count));
        setPtriUint32(this + DRAWCALL_DRAWBINDING, stri);
      }
      this.program.use();
      if (!this.upload()) {
        this.drawBuffer.bind();
      }
      storage[stri]();
      return 1;
    }
  }
});

define(DrawCall.prototype, {
  inheritableCopy: {
    get: function() {
      var ptrj;
      ptrj = new_Pointer(DrawCall);
      setPtriUint32(ptrj + DRAWCALL_RCONTEXT, this.renderingContext);
      setPtriUint32(ptrj + DRAWCALL_DBUFFER, this.drawBuffer);
      setPtriUint32(ptrj + DRAWCALL_PROGRAM, this.program);
      setPtriUint16(ptrj + DRAWCALL_USAGE, this.usage);
      setPtriUint16(ptrj + DRAWCALL_TARGET, this.target);
      setPtriUint8(ptrj + DRAWCALL_TYPE, this.type);
      return ptrj;
    }
  }
});

define(DrawCall.prototype, {
  renderingContext: {
    enumerable: true,
    get: function() {
      var clsi, ctxi, last, ptri, ptrj;
      if (!(ptri = getPtriUint32(this + DRAWCALL_RCONTEXT))) {
        ptrj = +this;
        ctxi = 0;
        clsi = storage.indexOf(RenderingContext);
        last = ptrj;
        while (ptrj = getParent(last = ptrj)) {
          if (!(clsi - getClassIndex(ptrj))) {
            ctxi = ptrj;
            break;
          }
        }
        if (!ctxi && (ptrj = ptr_Pointer(last))) {
          ctxi = ptrj.renderingContext;
        }
        if (!(ptri = setPtriUint32(this + DRAWCALL_RCONTEXT, ctxi))) {
          throw /DRAW_CALLS_CTX/;
        }
      }
      return new RenderingContext(ptri);
    }
  }
});

define(DrawCall.prototype, {
  drawBuffer: {
    enumerable: true,
    get: function() {
      var bufi, drawBuffer, len, m, ptri, rctx, ref1, target, usage;
      if (!(ptri = getPtriUint32(this + DRAWCALL_DBUFFER))) {
        rctx = this.renderingContext;
        if (!getPtriUint16(this + DRAWCALL_TARGET)) {
          ({target, usage, drawBuffer} = rctx.defaultDrawCalls[0]);
          setPtriUint32(this + DRAWCALL_DBUFFER, drawBuffer);
          setPtriUint16(this + DRAWCALL_TARGET, target);
          setPtriUint16(this + DRAWCALL_USAGE, usage);
        } else {
          if (bufi = rctx.defaultBuffer) {
            if (!(bufi.target - this.target)) {
              if (!(bufi.usage - this.usage)) {
                setPtriUint32(this + DRAWCALL_DBUFFER, bufi);
              }
            }
          }
          ref1 = findChilds(rctx, DrawBuffer);
          for (m = 0, len = ref1.length; m < len; m++) {
            bufi = ref1[m];
            if (!(bufi.target - this.target)) {
              if (!(bufi.usage - this.usage)) {
                setPtriUint32(this + DRAWCALL_DBUFFER, bufi);
                break;
              }
            }
          }
        }
        if (!(ptri = getPtriUint32(this + DRAWCALL_DBUFFER))) {
          throw /DRAW_CALLS_BUFFER/;
        }
      }
      return new DrawBuffer(ptri);
    }
  }
});

define(DrawCall.prototype, {
  program: {
    enumerable: true,
    get: function() {
      var ptri;
      if (!(ptri = getPtriUint32(this + DRAWCALL_PROGRAM))) {
        if (!(ptri = this.renderingContext.defaultProgram)) {
          throw /DRAW_CALLS_PROGRAM/;
        }
        setPtriUint32(this + DRAWCALL_PROGRAM, ptri);
      }
      return new Program(ptri);
    }
  }
});

define(RenderingContext.prototype, {
  defaultBuffer: {
    enumerable: true,
    set: function() {
      return setPtriUint32(this + RENDERING_CONTEXT_DBUFFER, arguments[0]);
    },
    get: function() {
      var ptri;
      if (!(ptri = getPtriUint32(this + RENDERING_CONTEXT_DBUFFER))) {
        if (!(ptri = findChilds(this, DrawBuffer).last())) {
          addChildren(this, ptri = new_Pointer(DrawBuffer));
        }
        setPtriUint32(this + RENDERING_CONTEXT_DBUFFER, ptri);
      }
      return new DrawBuffer(ptri);
    }
  }
});

define(RenderingContext.prototype, {
  defaultProgram: {
    enumerable: true,
    set: function() {
      return setPtriUint32(this + RENDERING_CONTEXT_DPROGRAM, arguments[0]);
    },
    get: function() {
      var ptri;
      if (!(ptri = getPtriUint32(this + RENDERING_CONTEXT_DPROGRAM))) {
        if (!(ptri = findChilds(this, Program).last())) {
          addChildren(this, ptri = new_Pointer(Program));
          ptri.alias = "default";
        }
        setPtriUint32(this + RENDERING_CONTEXT_DPROGRAM, ptri);
      }
      return new Program(ptri);
    }
  }
});

define(RenderingContext.prototype, {
  defaultDrawCalls: {
    enumerable: true,
    set: function() {
      return setPtriUint32(this + RENDERING_CONTEXT_DRAWCALL, arguments[0]);
    },
    get: function() {
      var ptri;
      if (!(ptri = getPtriUint32(this + RENDERING_CONTEXT_DRAWCALL))) {
        if (!(ptri = findChilds(this, DrawCall).last())) {
          addChildren(this, ptri = new_Pointer(DrawCall));
          setPtriUint32(ptri + DRAWCALL_PROGRAM, this.defaultProgram);
          setPtriUint32(ptri + DRAWCALL_DBUFFER, this.defaultBuffer);
          setPtriUint16(ptri + DRAWCALL_TARGET, this.defaultBuffer.target);
          setPtriUint16(ptri + DRAWCALL_USAGE, keyOfWebGL2("STATIC_DRAW"));
        }
        setPtriUint32(this + RENDERING_CONTEXT_DRAWCALL, ptri);
      }
      return new PtriArray(new DrawCall(ptri));
    }
  }
});

define(RenderingContext.prototype, {
  glObject: {
    get: function() {
      var node, stri;
      if (!(stri = getPtriUint8(this + RENDERING_CONTEXT_GLOBJECT))) {
        node = appendElement(createElement("canvas"));
        stri = storeForUint8(node.getContext("webgl2"));
        setPtriUint8(this + RENDERING_CONTEXT_GLOBJECT, stri);
        addListener(window, "resize", this.onresize.bind(this));
        hitListener(window, "resize", node);
      }
      return storage[stri];
    }
  }
});

define(RenderingContext.prototype, {
  canvas: {
    get: function() {
      return this.glObject.canvas;
    }
  }
});

define(RenderingContext.prototype, {
  onresize: {
    value: hitOnTimeout(function() {
      var canvas, height, left, pixelRatio, top, width;
      canvas = arguments[0].detail || this.canvas;
      ({top, left, width, height, pixelRatio} = this.viewport);
      assign(canvas, {
        width: pixelRatio * width,
        height: pixelRatio * height
      });
      assign(canvas.style, {
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      });
      return this;
    })
  }
});

define(RenderingContext.prototype, {
  getParameters: {
    value: function() {
      var DRAW_BUFFERi, gl, i, len, m, n, parameters, pname, ref1, ref2;
      gl = this.glObject;
      parameters = {};
      ref1 = "RENDERER VENDOR VERSION VIEWPORT FRONT_FACE CURRENT_PROGRAM CULL_FACE CULL_FACE_MODE BLEND BLEND_COLOR READ_BUFFER COPY_READ_BUFFER_BINDING COPY_WRITE_BUFFER_BINDING DRAW_FRAMEBUFFER_BINDING PACK_SKIP_ROWS FRAGMENT_SHADER_DERIVATIVE_HINT SAMPLE_COVERAGE SAMPLER_BINDING TEXTURE_BINDING_2D_ARRAY RED_BITS MAX_3D_TEXTURE_SIZE MAX_ARRAY_TEXTURE_LAYERS MAX_CLIENT_WAIT_TIMEOUT_WEBGL MAX_COLOR_ATTACHMENTS MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS MAX_COMBINED_UNIFORM_BLOCKS MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS MAX_DRAW_BUFFERS MAX_ELEMENT_INDEX MAX_ELEMENTS_INDICES MAX_ELEMENTS_VERTICES MAX_FRAGMENT_INPUT_COMPONENTS MAX_FRAGMENT_UNIFORM_BLOCKS MAX_FRAGMENT_UNIFORM_COMPONENTS MAX_PROGRAM_TEXEL_OFFSET MAX_SAMPLES MAX_SERVER_WAIT_TIMEOUT MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS SAMPLE_ALPHA_TO_COVERAGE MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS MAX_UNIFORM_BLOCK_SIZE MAX_UNIFORM_BUFFER_BINDINGS MAX_TEXTURE_LOD_BIAS MAX_VARYING_COMPONENTS MAX_VERTEX_OUTPUT_COMPONENTS MAX_VERTEX_UNIFORM_BLOCKS MAX_VERTEX_UNIFORM_COMPONENTS MIN_PROGRAM_TEXEL_OFFSET PACK_ROW_LENGTH PIXEL_PACK_BUFFER_BINDING PIXEL_UNPACK_BUFFER_BINDING RASTERIZER_DISCARD READ_FRAMEBUFFER_BINDING TEXTURE_BINDING_3D TRANSFORM_FEEDBACK_ACTIVE TRANSFORM_FEEDBACK_BINDING TRANSFORM_FEEDBACK_BUFFER_BINDING TRANSFORM_FEEDBACK_PAUSED UNIFORM_BUFFER_BINDING UNIFORM_BUFFER_OFFSET_ALIGNMENT UNPACK_IMAGE_HEIGHT UNPACK_ROW_LENGTH UNPACK_SKIP_IMAGES UNPACK_SKIP_PIXELS UNPACK_SKIP_ROWS VERTEX_ARRAY_BINDING ACTIVE_TEXTURE ALIASED_LINE_WIDTH_RANGE ALIASED_POINT_SIZE_RANGE ALPHA_BITS ARRAY_BUFFER_BINDING BLEND_DST_ALPHA BLEND_DST_RGB BLEND_EQUATION BLEND_EQUATION_ALPHA BLEND_EQUATION_RGB BLEND_SRC_ALPHA BLEND_SRC_RGB BLUE_BITS COLOR_CLEAR_VALUE COLOR_WRITEMASK COMPRESSED_TEXTURE_FORMATS DEPTH_BITS DEPTH_CLEAR_VALUE DEPTH_FUNC DEPTH_RANGE DEPTH_TEST DITHER ELEMENT_ARRAY_BUFFER_BINDING FRAMEBUFFER_BINDING GENERATE_MIPMAP_HINT GREEN_BITS IMPLEMENTATION_COLOR_READ_FORMAT IMPLEMENTATION_COLOR_READ_TYPE LINE_WIDTH MAX_COMBINED_TEXTURE_IMAGE_UNITS MAX_CUBE_MAP_TEXTURE_SIZE MAX_FRAGMENT_UNIFORM_VECTORS MAX_RENDERBUFFER_SIZE MAX_TEXTURE_IMAGE_UNITS DEPTH_WRITEMASK PACK_SKIP_PIXELS MAX_TEXTURE_SIZE MAX_VARYING_VECTORS MAX_VERTEX_ATTRIBS MAX_VERTEX_TEXTURE_IMAGE_UNITS SAMPLES SCISSOR_BOX MAX_VIEWPORT_DIMS PACK_ALIGNMENT POLYGON_OFFSET_FACTOR POLYGON_OFFSET_FILL POLYGON_OFFSET_UNITS RENDERBUFFER_BINDING SAMPLE_BUFFERS SAMPLE_COVERAGE_INVERT SAMPLE_COVERAGE_VALUE MAX_VERTEX_UNIFORM_VECTORS SCISSOR_TEST SHADING_LANGUAGE_VERSION STENCIL_BACK_FAIL STENCIL_BACK_FUNC STENCIL_BACK_PASS_DEPTH_FAIL STENCIL_BACK_PASS_DEPTH_PASS STENCIL_BACK_REF STENCIL_BACK_VALUE_MASK STENCIL_BACK_WRITEMASK STENCIL_BITS STENCIL_CLEAR_VALUE STENCIL_FAIL STENCIL_FUNC STENCIL_PASS_DEPTH_FAIL STENCIL_PASS_DEPTH_PASS STENCIL_REF STENCIL_TEST STENCIL_VALUE_MASK STENCIL_WRITEMASK SUBPIXEL_BITS TEXTURE_BINDING_2D TEXTURE_BINDING_CUBE_MAP UNPACK_ALIGNMENT UNPACK_COLORSPACE_CONVERSION_WEBGL UNPACK_FLIP_Y_WEBGL UNPACK_PREMULTIPLY_ALPHA_WEBGL".split(/\n|\r\n|\s+|\t/g).filter(Boolean);
      for (m = 0, len = ref1.length; m < len; m++) {
        pname = ref1[m];
        parameters[pname] = gl.getParameter(gl[pname]);
      }
      for (i = n = 0, ref2 = parameters.MAX_DRAW_BUFFERS; (0 <= ref2 ? n < ref2 : n > ref2); i = 0 <= ref2 ? ++n : --n) {
        DRAW_BUFFERi = `DRAW_BUFFER${i}`;
        parameters[DRAW_BUFFERi] = gl.getParameter(gl[DRAW_BUFFERi]);
      }
      for (pname in parameters) {
        value = parameters[pname];
        parameters[pname] = keyOfWebGL2(value);
      }
      return parameters;
    }
  }
});

define(RenderingContext.prototype, {
  getViewport: {
    value: function() {
      var inherit, ptrj;
      if (!(ptrj = getPtriUint32(this + RENDERING_CONTEXT_VIEWPORT))) {
        if (!(ptrj = findChild(this, Viewport, inherit = true))) {
          return addChildren(this, new_Pointer(Viewport));
        }
        return this.setViewport(ptrj);
      }
      return new Viewport(ptrj);
    }
  }
});

define(RenderingContext.prototype, {
  setViewport: {
    value: function(ptrj) {
      return setPtriUint32(this + RENDERING_CONTEXT_VIEWPORT, ptrj);
    }
  }
});

define(Viewport.prototype, {
  isFullScreen: {
    get: function() {
      return !!document.fullscreenElement;
    }
  }
});

define(Viewport.prototype, {
  isFullWindow: {
    get: function() {
      return !getPtriFloat32(this + VIEWPORT_WITDH);
    }
  }
});

define(Viewport.prototype, {
  getX: {
    value: function() {
      return getPtriFloat32(this + VIEWPORT_X);
    }
  }
});

define(Viewport.prototype, {
  setX: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_X, value);
    }
  }
});

define(Viewport.prototype, {
  getY: {
    value: function() {
      return getPtriFloat32(this + VIEWPORT_Y);
    }
  }
});

define(Viewport.prototype, {
  setY: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_Y, value);
    }
  }
});

define(Viewport.prototype, {
  getLeft: {
    value: function() {
      return getPtriFloat32(this + VIEWPORT_LEFT);
    }
  }
});

define(Viewport.prototype, {
  setLeft: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_LEFT, value);
    }
  }
});

define(Viewport.prototype, {
  getTop: {
    value: function() {
      return getPtriFloat32(this + VIEWPORT_TOP);
    }
  }
});

define(Viewport.prototype, {
  setTop: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_TOP, value);
    }
  }
});

define(Viewport.prototype, {
  getWidth: {
    value: function() {
      if (!(value = getPtriFloat32(this + VIEWPORT_WITDH))) {
        value = self.innerWidth || 320;
      }
      return value;
    }
  }
});

define(Viewport.prototype, {
  setWidth: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_WITDH, value);
    }
  }
});

define(Viewport.prototype, {
  getHeight: {
    value: function() {
      if (!(value = getPtriFloat32(this + VIEWPORT_HEIGHT))) {
        value = self.innerHeight || 240;
      }
      return value;
    }
  }
});

define(Viewport.prototype, {
  setHeight: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_HEIGHT, value);
    }
  }
});

define(Viewport.prototype, {
  getAspectRatio: {
    value: function() {
      var ratio;
      if (!(ratio = getPtriFloat32(this + VIEWPORT_ASPECT_RATIO))) {
        return this.width / this.height;
      }
      return ratio;
    }
  }
});

define(Viewport.prototype, {
  setAspectRatio: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_ASPECT_RATIO, value);
    }
  }
});

define(Viewport.prototype, {
  getPixelRatio: {
    value: function() {
      var ratio;
      if (!(ratio = getPtriFloat32(this + VIEWPORT_PIXEL_RATIO))) {
        return self.devicePixelRatio || 1;
      }
      return ratio;
    }
  }
});

define(Viewport.prototype, {
  setPixelRatio: {
    value: function(value) {
      return setPtriFloat32(this + VIEWPORT_PIXEL_RATIO, value);
    }
  }
});

define(Program.prototype, {
  debug: {
    get: function() {
      return Object.defineProperties(this, {
        useProgram: {
          get: this.use
        },
        bindVertexArray: {
          get: this.bindVertexArray
        }
      });
    }
  }
});

define(Program.prototype, {
  inUse: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + PROGRAM_ISINUSE);
    }
  }
});

define(Program.prototype, {
  use: {
    value: function() {
      var construct, len, m, ptri, ptrj, ref1, stri;
      if (!getPtriUint8(this + PROGRAM_ISINUSE)) {
        setPtriUint8(this + PROGRAM_ISINUSE, 1);
        ptri = +this;
        ref1 = findChilds(this.parent, Program, construct = false);
        for (m = 0, len = ref1.length; m < len; m++) {
          ptrj = ref1[m];
          if (ptri - ptrj) {
            setPtriUint8(ptrj + PROGRAM_ISINUSE, 0);
          }
        }
        if (!(stri = getPtriUint8(ptri + PROGRAM_USEBINDING))) {
          stri = setPtriUint8(ptri + PROGRAM_USEBINDING, storeForUint8(this.parent.glObject.useProgram.bind(this.parent.glObject, this.glObject)));
        }
        storage[stri]();
      }
      return 1;
    }
  }
});

define(Program.prototype, {
  getAlias: {
    value: function() {
      return decode(sliceUint8(this));
    }
  }
});

define(Program.prototype, {
  setAlias: {
    value: function() {
      return this.set(arguments[0]);
    }
  }
});

define(Program.prototype, {
  glObject: {
    get: function() {
      var fShader, fSource, gl, program, stri, vShader, vSource;
      if (!(stri = getPtriUint8(this + PROGRAM_GLPROGRAM))) {
        gl = this.parent.glObject;
        //? create vertex shader ------------> 
        vSource = this.source.vertexShader;
        vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, vSource);
        gl.compileShader(vShader);
        if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
          info = gl.getShaderInfoLog(vShader);
          gl.deleteShader(vShader);
          throw `Could not compile vertex shader. \n\n${info}, \nsource:${vSource}`;
        }
        //? create fragment shader ----------->
        fSource = this.source.fragmentShader;
        fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, fSource);
        gl.compileShader(fShader);
        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
          info = gl.getShaderInfoLog(fShader);
          gl.deleteShader(vShader);
          gl.deleteShader(fShader);
          throw `Could not compile vertex shader. \n\n${info}, \nsource:${vSource}`;
        }
        
        //? create program and link ----------->
        program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          info = gl.getProgramInfoLog(program);
          gl.deleteShader(vShader);
          gl.deleteShader(fShader);
          gl.deleteProgram(program);
          throw `Could not compile WebGL program. \n\n${info}`;
        }
        stri = storeForUint8(program);
        setPtriUint8(this + PROGRAM_GLPROGRAM, stri);
      }
      return storage[stri];
    }
  }
});

define(Program.prototype, {
  findUniform: {
    value: function(any) {
      return this.source.findGLSLVariable(any, Uniform);
    }
  }
});

define(Program.prototype, {
  findVertexAttrib: {
    value: function(any) {
      return this.source.findGLSLVariable(any, VertexAttribute);
    }
  }
});

define(Program.prototype, {
  findVertexArray: {
    value: function(any) {
      return this.source.findGLSLVariable(any, VertexArray);
    }
  }
});

define(Program.prototype, {
  findAttribute: {
    value: function(regex) {
      return parseGLSLSource(this.source.vertexShader, this.variables).findDecoded(function(a) {
        return a.match(regex);
      });
    }
  }
});

define(Program.prototype, {
  bindVertexArray: {
    value: function() {
      var gl2p, vaoi, varr;
      if (!(vaoi = getPtriUint8(this + PROGRAM_VAOBINDING))) {
        gl2p = this.parent.glObject;
        varr = this.source.vertexArray;
        vaoi = storeForUint8(varr.bound(gl2p));
        setPtriUint8(this + PROGRAM_VAOBINDING, vaoi);
      }
      return storage[vaoi]();
    }
  }
});

define(Program.prototype, {
  variables: {
    enumerable: true,
    get: function() {
      return this.source.children;
    }
  }
});

define(Program.prototype, {
  getSource: {
    value: function() {
      var ptrj, test;
      if (!(ptrj = getPtriUint32(this + PROGRAM_SHADER_SOURCE))) {
        test = ptrByteCompare.bind(null, this);
        if (!(ptrj = findPointer(test, ProgramSource))) {
          return void 0;
        }
        return this.setSource(ptrj);
      }
      return new ProgramSource(ptrj);
    }
  }
});

define(Program.prototype, {
  ATTRIBUTE_LENGTH: {
    enumerable: true,
    get: function() {
      return this.BYTES_PER_POINT / 4;
    }
  }
});

define(Program.prototype, {
  BYTES_PER_POINT: {
    enumerable: true,
    get: function() {
      return this.source.BYTES_PER_POINT;
    }
  }
});

define(Program.prototype, {
  setSource: {
    value: function() {
      return setPtriUint32(this + PROGRAM_SHADER_SOURCE, arguments[0]);
    }
  }
});

define(Attributes.prototype, {
  attribute: {
    value: function(index) {
      var byteOffset, stride;
      stride = this.drawCall.program.ATTRIBUTE_LENGTH;
      if (this.length > (index *= stride)) {
        byteOffset = index * 4 + this.byteOffset;
        return new Attribute(sab, byteOffset, stride);
      }
      throw /MAX_ATTRIB_EXCEED/;
    }
  }
});

define(Attributes.prototype, {
  drawCall: {
    get: function() {
      var byteOffset, classIndex, construct, ptri, test;
      byteOffset = this.byteOffset;
      classIndex = storage.indexOf(DrawCall);
      test = function(ptri) {
        return 0 === byteOffset - getByteOffset(ptri);
      };
      ptri = findPointer(test, DrawCall, construct = false);
      if (ptri) {
        return new DrawCall(ptri);
      }
      throw /NO_DRAWCALL_AT_BYTEOFFSET/;
    }
  }
});

define(Vertices.prototype, {
  vertex: {
    value: function(index) {
      var byteOffset;
      if (this.length > (index *= 3)) {
        byteOffset = index * 4 + this.byteOffset;
        return new Vertex(sab, byteOffset, 3);
      }
      throw /MAX_VERTEX_EXCEED/;
    }
  }
});

define(Vertices.prototype, {
  mesh: {
    get: function() {
      var byte, construct, test;
      byte = this.byteOffset;
      test = function(ptri) {
        return 0 === byte - getByteOffset(ptri);
      };
      return new Mesh(findPointer(test, Mesh, construct = false));
    }
  }
});

define(Vertices.prototype, {
  set: {
    value: function(value = []) {
      return this.mesh.setVertices(value);
    }
  }
});

define(ModifierMatrix, {
  byteLength: {
    value: 16 * 4
  }
});

define(ModifierMatrix.prototype, {
  TypedArray: {
    value: Float32Array
  }
});

define(ModifierMatrix.prototype, {
  subarray: {
    get: function() {
      return new Float32Array(sab, getByteOffset(this), 16);
    }
  }
});

define(ModifierMatrix.prototype, {
  set: {
    value: function(value = []) {
      var byteLength, byteOffset, length;
      if (ArrayBuffer.isView(value) || Array.isArray(value)) {
        length = 16;
        byteLength = 64;
        if (!(byteOffset = getByteOffset(this))) {
          byteOffset = malloc(byteLength);
          setByteOffset(this, byteOffset);
          setByteLength(this, byteLength);
        }
        this.subarray.set(value);
        return this;
      }
      throw /MMATRIX_SET/;
    }
  }
});

define(ModifierMatrix, {
  identity: {
    value: Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }
});

define(Mesh.prototype, {
  vertex: {
    value: function(index) {
      return this.vertices.vertex(index);
    }
  }
});

define(Mesh.prototype, {
  TypedArray: {
    value: Float32Array
  }
});

define(Mesh.prototype, {
  getPointCount: {
    value: function() {
      return this.vertices.length / 3;
    }
  }
});

define(Mesh.prototype, {
  getDrawingState: {
    value: function() {}
  }
});

define(Mesh.prototype, {
  getVertices: {
    value: function() {
      var byteOffset, length, ptri;
      if (!(byteOffset = getByteOffset(ptri = this))) {
        return Object.defineProperties(new Unallocated, {
          set: {
            value: function(value = []) {
              return Mesh.prototype.setVertices.call(ptri, value);
            }
          }
        });
      }
      length = getByteLength(this) / 4;
      return new Vertices(sab, byteOffset, length);
    }
  }
});

define(Mesh.prototype, {
  setVertices: {
    value: function(value = [], index = 0) {
      var byteLength, byteOffset, length;
      if (value instanceof Mesh) {
        value = value.vertices;
      }
      if (ArrayBuffer.isView(value) || Array.isArray(value)) {
        if (!(byteOffset = getByteOffset(this))) {
          byteLength = value.length * 4;
          byteOffset = malloc(byteLength);
          setByteOffset(this, byteOffset);
          setByteLength(this, byteLength);
        } else {
          byteLength = getByteLength(this);
        }
        length = byteLength / 4 - index;
        index += byteOffset / 4;
        f32.subarray(index, index + length).set(value);
        this.setNeedsUpdate(1);
        return this;
      }
      throw /VERTICES_SET/;
    }
  }
});

define(Mesh.prototype, {
  set: {
    value: Mesh.prototype.setVertices
  }
});

define(Mesh.prototype, {
  getPosition: {
    value: function() {
      return findChild(this, Position);
    }
  }
});

define(Mesh.prototype, {
  getRotation: {
    value: function() {
      return findChild(this, Rotation);
    }
  }
});

define(Mesh.prototype, {
  getScale: {
    value: function() {
      return findChild(this, Scale);
    }
  }
});

define(Mesh.prototype, {
  onadopt: {
    value: function(parent) {
      var len, m, ptri, ref1;
      if (!findChild(this, DrawCall)) {
        ref1 = parent.drawCalls;
        for (m = 0, len = ref1.length; m < len; m++) {
          ptri = ref1[m];
          addChildren(this, ptri.inheritableCopy);
        }
      }
      this.setVisibility(parent.visibility);
      return this;
    }
  }
});

define(Mesh.prototype, {
  getDrawCalls: {
    value: function() {
      var len, m, ptri, ref1;
      if (!findChild(this, DrawCall)) {
        if (!this.visibility) {
          return new PtriArray();
        }
        ref1 = this.parent.drawCalls;
        for (m = 0, len = ref1.length; m < len; m++) {
          ptri = ref1[m];
          addChildren(this, ptri.inheritableCopy);
        }
      }
      return findChilds(this, DrawCall);
    }
  }
});

define(Mesh.prototype, {
  getVisibility: {
    value: function() {
      var ptri;
      if (ptri = getPtriUint32(this + MESH_SCENE_PTRI)) {
        return new Scene(ptri);
      }
    }
  }
});

define(Mesh.prototype, {
  setVisibility: {
    value: function(ptri) {
      return setPtriUint32(this + MESH_SCENE_PTRI, ptri);
    }
  }
});

define(Mesh.prototype, {
  getDrawWeight: {
    value: function() {}
  }
});

define(Mesh.prototype, {
  getInstanceCount: {
    value: function() {}
  }
});

define(Mesh.prototype, {
  getColor: {
    value: function() {
      return findChild(this, Color);
    }
  }
});

define(Mesh.prototype, {
  getNeedsUpdate: {
    value: function() {
      return !getPtriUint8(this + MESH_UPLOADED);
    }
  }
});

define(Mesh.prototype, {
  setNeedsUpdate: {
    value: function(need) {
      var call, len, len1, m, mesh, n, ref1, ref2;
      setPtriUint8(this + MESH_UPLOADED, !need);
      if (!need) {
        return 0;
      }
      ref1 = findChilds(this, Mesh);
      for (m = 0, len = ref1.length; m < len; m++) {
        mesh = ref1[m];
        mesh.setNeedsUpdate(1);
      }
      ref2 = findChilds(this, DrawCall);
      for (n = 0, len1 = ref2.length; n < len1; n++) {
        call = ref2[n];
        call.setNeedsUpload(1);
      }
      return 1;
    }
  }
});

define(Mesh.prototype, {
  setModifierMatrix: {
    value: function(value, link = true) {
      if (link) {
        return setPtriUint32(this + MESH_MMATRIX, value);
      }
      if (this.modifierMatrix.set(value)) {
        return this;
      }
      throw /MODIFIER_MATRIX_SET/;
    }
  }
});

define(Mesh.prototype, {
  getModifierMatrix: {
    value: function() {
      var ptri;
      if (!(ptri = getPtriUint32(this + MESH_MMATRIX))) {
        ptri = new_Pointer(ModifierMatrix);
        ptri.set(ModifierMatrix.identity);
        addChildren(this, ptri);
        setPtriUint32(this + MESH_MMATRIX, ptri);
      }
      return new ModifierMatrix(ptri);
    }
  }
});

define(Uniform, {
  getLocation: {
    value: function(program, alias) {
      return program.parent.glObject.getUniformLocation(program.glObject, alias);
    }
  }
});

define(Uniform.prototype, {
  getAlias: {
    value: function() {
      return decode(sliceUint8(this));
    }
  }
});

define(Uniform.prototype, {
  setAlias: {
    value: function() {
      return this.set(arguments[0]);
    }
  }
});

define(Uniform.prototype, {
  size: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + UNIFORM_SIZE);
    },
    set: function() {
      return setPtriUint8(this + UNIFORM_SIZE, arguments[0]);
    }
  }
});

define(Uniform.prototype, {
  byteLength: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + UNIFORM_BYTELENGTH);
    },
    set: function() {
      return setPtriUint8(this + UNIFORM_BYTELENGTH, arguments[0]);
    }
  }
});

define(Uniform.prototype, {
  type: {
    enumerable: true,
    get: function() {
      return keyOfWebGL2(getPtriUint16(this + UNIFORM_TYPE));
    },
    set: function() {
      return setPtriUint16(this + UNIFORM_TYPE, arguments[0]);
    }
  }
});

define(Uniform.prototype, {
  getUploadFunc: {
    value: function() {
      var N, kindName, uploadFn;
      uploadFn = "uniform";
      kindName = this.kind.constructor.name;
      N = (kindName.match(/\d+/g) || [1]).join("x");
      if (/MAT/.test(kindName)) {
        return `uniformMatrix${N}fv`;
      }
      if (/(UNSIGNED_INT_*VEC)/.test(kindName)) {
        return `uniform${N}uiv`;
      }
      if (/(UNSIGNED_INT)/.test(kindName)) {
        return `uniform${N}ui`;
      }
      if (/(INT_*VEC)/.test(kindName)) {
        return `uniform${N}iv`;
      }
      if (/(FLOAT_*VEC)/.test(kindName)) {
        return `uniform${N}fv`;
      }
      if (/(FLOAT)/.test(kindName)) {
        return `uniform${N}f`;
      }
      if (/(INT)/.test(kindName)) {
        return `uniform${N}i`;
      }
      throw /UNIFORM_ERR/;
    }
  }
});

define(Uniform.prototype, {
  kind: {
    enumerable: true,
    get: function() {
      return keyOfWebGL2(getPtriUint16(this + UNIFORM_KIND));
    },
    set: function() {
      return setPtriUint16(this + UNIFORM_KIND, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  getAlias: {
    value: function() {
      return decode(sliceUint8(this));
    }
  }
});

define(VertexAttribute.prototype, {
  setAlias: {
    value: function() {
      return this.set(arguments[0]);
    }
  }
});

define(VertexAttribute, {
  getLocation: {
    value: function(program, alias) {
      var gl;
      gl = program.parent.glObject;
      return gl.getAttribLocation(program.glObject, alias);
    }
  }
});

define(VertexAttribute.prototype, {
  getLocation: {
    value: function(program) {
      return getPtriUint8(this + ATTRIBUTE_LOCATION);
    }
  }
});

define(VertexAttribute.prototype, {
  setLocation: {
    value: function() {
      return setPtriUint8(this + ATTRIBUTE_LOCATION, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  size: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + ATTRIBUTE_SIZE);
    },
    set: function() {
      return setPtriUint8(this + ATTRIBUTE_SIZE, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  type: {
    enumerable: true,
    get: function() {
      return keyOfWebGL2(getPtriUint16(this + ATTRIBUTE_TYPE));
    },
    set: function() {
      return setPtriUint16(this + ATTRIBUTE_TYPE, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  normalized: {
    enumerable: true,
    get: function() {
      return Boolean(getPtriUint8(this + ATTRIBUTE_NORMALIZED));
    },
    set: function() {
      return setPtriUint8(this + ATTRIBUTE_NORMALIZED, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  stride: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + ATTRIBUTE_STRIDE);
    },
    set: function() {
      return setPtriUint8(this + ATTRIBUTE_STRIDE, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  offset: {
    enumerable: true,
    get: function() {
      return getPtriUint8(this + ATTRIBUTE_OFFSET);
    },
    set: function() {
      return setPtriUint8(this + ATTRIBUTE_OFFSET, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  BYTES_PER_POINT: {
    get: function() {
      return getPtriUint8(this + ATTRIBUTE_BYTES_PERP);
    },
    set: function() {
      return setPtriUint8(this + ATTRIBUTE_BYTES_PERP, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  kind: {
    enumerable: true,
    get: function() {
      return keyOfWebGL2(getPtriUint16(this + ATTRIBUTE_KIND));
    },
    set: function() {
      return setPtriUint16(this + ATTRIBUTE_KIND, arguments[0]);
    }
  }
});

define(VertexAttribute.prototype, {
  pointerArgs: {
    get: function() {
      return Uint16Array.of(this.location, this.size, this.type, this.normalized, this.stride, this.offset);
    }
  }
});

define(VertexAttribute.prototype, {
  createBinding: {
    value: function(gl) {
      if (!(gl || (gl = findChild(this, RenderingContext, true).glObject))) {
        return "NO_CONTEXT_FOUND_NEITHER_SUPPLIED";
      }
      return {
        enableVertexAttribArray: gl.enableVertexAttribArray.bind(gl, this.location),
        vertexAttribPointer: gl.vertexAttribPointer.bind(gl, ...this.pointerArgs),
        vertexAttribNfv: (function() {
          switch (this.size) {
            case 1:
              return gl.vertexAttrib1fv.bind(gl, this.location);
            case 2:
              return gl.vertexAttrib2fv.bind(gl, this.location);
            case 3:
              return gl.vertexAttrib3fv.bind(gl, this.location);
            case 4:
              return gl.vertexAttrib4fv.bind(gl, this.location);
          }
        }).call(this)
      };
    }
  }
});

define(VertexArray.prototype, {
  getAttributes: {
    value: function() {
      return findChilds(this.parent, VertexAttribute);
    }
  }
});

define(VertexArray.prototype, {
  BYTES_PER_POINT: {
    get: function() {
      var attr, len, m, ref1, sum;
      sum = 0;
      ref1 = this.attributes;
      for (m = 0, len = ref1.length; m < len; m++) {
        attr = ref1[m];
        sum = sum + attr.BYTES_PER_POINT;
      }
      return sum;
    }
  }
});

define(VertexArray.prototype, {
  setAlias: {
    value: function() {
      return this.set(arguments[0]);
    }
  }
});

define(VertexArray.prototype, {
  getAlias: {
    value: function() {
      return decode(sliceUint8(this));
    }
  }
});

define(VertexArray.prototype, {
  bound: {
    value: function(gl, extraCalls = []) {
      var attr, call, construct, len, len1, m, n, ref1, vao;
      if (!gl) {
        throw /NO_CONTEXT_SUPPLIED/;
      } else {
        this.parent.BYTES_PER_POINT;
      }
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      ref1 = findChilds(this.parent, VertexAttribute, construct = true);
      for (m = 0, len = ref1.length; m < len; m++) {
        attr = ref1[m];
        gl.enableVertexAttribArray(attr.location);
        gl.vertexAttribPointer(...attr.pointerArgs);
      }
      for (n = 0, len1 = extraCalls.length; n < len1; n++) {
        call = extraCalls[n];
        call(gl);
      }
      return gl.bindVertexArray.bind(gl, vao);
    }
  }
});

define(ProgramSource.prototype, {
  setAlias: {
    value: function(alias) {
      setPtriUint32(this + SHADER_SOURCE_BYTES_PERP, 0);
      return this.set(alias);
    }
  }
});

define(ProgramSource.prototype, {
  getAlias: {
    value: function() {
      return decode(sliceUint8(this));
    }
  }
});

define(ProgramSource.prototype, {
  vertexArray: {
    enumerable: true,
    get: function() {
      return findChild(this, VertexArray);
    }
  }
});

define(ProgramSource.prototype, {
  vertexShader: {
    get: function() {
      var ref1;
      return (ref1 = this.documentScripts.vertexShader) != null ? ref1.text : void 0;
    }
  }
});

define(ProgramSource.prototype, {
  computeShader: {
    get: function() {
      var ref1;
      return (ref1 = this.documentScripts.computeShader) != null ? ref1.text : void 0;
    }
  }
});

define(ProgramSource.prototype, {
  fragmentShader: {
    get: function() {
      var ref1;
      return (ref1 = this.documentScripts.fragmentShader) != null ? ref1.text : void 0;
    }
  }
});

define(ProgramSource.prototype, {
  documentScripts: {
    get: function() {
      var $name, c, f, v;
      v = queryDocument(`[name=${this.alias}][type*='vertex']`);
      c = queryDocument(`[name=${this.alias}][type*='compute']`);
      f = queryDocument(`[name=${this.alias}][type*='fragment']`);
      if (!v && f && ($name = f.getAttribute("vertex-shader"))) {
        v = queryDocument(`[name=${$name}][type*='vertex']`);
      }
      if (!f && v && ($name = v.getAttribute("fragment-shader"))) {
        f = queryDocument(`[name=${$name}][type*='fragment']`);
      }
      return {
        vertexShader: v,
        computeShader: c,
        fragmentShader: f
      };
    }
  }
});

define(ProgramSource.prototype, {
  linkedPrograms: {
    enumerable: true,
    get: function() {
      var ptri;
      ptri = +this;
      return findChilds(null, Program).filter(function(p) {
        return 0 === ptri - p.source;
      });
    }
  }
});

define(ProgramSource.prototype, {
  BYTES_PER_POINT: {
    get: function() {
      var bpp;
      if (!(bpp = getPtriUint32(this + SHADER_SOURCE_BYTES_PERP))) {
        bpp = setPtriUint32(this + SHADER_SOURCE_BYTES_PERP, this.parameters.ATTRIBUTES_STRIDE);
      }
      return bpp;
    }
  }
});

define(ProgramSource.prototype, {
  findGLSLVariable: {
    value: function(any, Class) {
      var len, m, ptri, ref1, test;
      this.parameters; //parse source if did NOT before
      ref1 = findChilds(this, Class);
      for (m = 0, len = ref1.length; m < len; m++) {
        ptri = ref1[m];
        test = (function() {
          switch (true) {
            case any.isPointer:
              return (any.alias === ptri.alias) && any;
            case "string" === typeof any:
              return ptri.alias;
            case any instanceof RegExp:
              return any.match(ptri) && any;
            default:
              throw /UNMATCH_ATTRIB_FIND/;
          }
        })();
        if (any === test) {
          return ptri;
        }
      }
    }
  }
});

define(ProgramSource.prototype, {
  getParameters: {
    value: function() {
      var attrib, attribute, fShader, fSource, gl, gls, len, len1, len2, len3, m, n, numAttribs, numUniforms, p, parameters, pname, program, q, ref1, ref2, ref3, ref4, ref5, ref6, s, shaders, split, stri, tn, u, uniform, v, vShader, vSource, varr, w;
      if (stri = getPtriUint32(this + SHADER_SOURCE_PARAMETERS)) {
        return storage[stri];
      }
      gl = new OffscreenCanvas(1, 1).getContext("webgl2");
      //? create vertex shader ------------> 
      vSource = this.vertexShader;
      vShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vShader, vSource);
      gl.compileShader(vShader);
      if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        info = gl.getShaderInfoLog(vShader);
        gl.deleteShader(vShader);
        throw `Could not compile vertex shader. \n\n${info}, \nsource:${vSource}`;
      }
      //? create fragment shader ----------->
      fSource = this.fragmentShader;
      fShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fShader, fSource);
      gl.compileShader(fShader);
      if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        info = gl.getShaderInfoLog(fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        throw `Could not compile vertex shader. \n\n${info}, \nsource:${vSource}`;
      }
      //? create program and link ----------->
      program = gl.createProgram();
      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        info = gl.getProgramInfoLog(program);
        throw `Could not compile WebGL program. \n\n${info}`;
      }
      //* parse program parameters ---------->
      (parameters = {
        VERTEX_SHADER: {},
        FRAGMENT_SHADER: {},
        PROGRAM: {}
      });
      (shaders = {
        VERTEX_SHADER: vShader,
        FRAGMENT_SHADER: fShader
      });
      split = function() {
        return arguments[0].split(/\n|\r\n|\s+|\t/g).filter(Boolean);
      };
      ref1 = split("DELETE_STATUS LINK_STATUS VALIDATE_STATUS ATTACHED_SHADERS ACTIVE_ATTRIBUTES ACTIVE_UNIFORMS TRANSFORM_FEEDBACK_BUFFER_MODE TRANSFORM_FEEDBACK_VARYINGS ACTIVE_UNIFORM_BLOCKS");
      for (m = 0, len = ref1.length; m < len; m++) {
        p = ref1[m];
        parameters.PROGRAM[p] = gl.getProgramParameter(program, gl[p]);
      }
      ref2 = parameters.PROGRAM;
      for (pname in ref2) {
        value = ref2[pname];
        parameters.PROGRAM[pname] = keyOfWebGL2(value);
      }
      for (s in shaders) {
        gls = shaders[s];
        ref3 = split("DELETE_STATUS COMPILE_STATUS SHADER_TYPE");
        for (n = 0, len1 = ref3.length; n < len1; n++) {
          p = ref3[n];
          parameters[s][p] = gl.getShaderParameter(gls, gl[p]);
        }
      }
      for (s in shaders) {
        gls = shaders[s];
        ref4 = parameters[s];
        for (pname in ref4) {
          value = ref4[pname];
          parameters[s][pname] = keyOfWebGL2(value);
          parameters[s].SHADER_SOURCE = gl.getShaderSource(gls);
          parameters[s].INFO_LOG = gl.getShaderInfoLog(gls);
        }
      }
      numAttribs = parameters.PROGRAM.ACTIVE_ATTRIBUTES;
      parameters.VERTEX_ARRAY_NAME = "";
      parameters.ATTRIBUTES_STRIDE = 0;
      parameters.ATTRIBUTES = (function() {
        var ref5, results;
        results = [];
        while (numAttribs--) {
          attrib = {};
          ref5 = gl.getActiveAttrib(program, numAttribs);
          for (k in ref5) {
            v = ref5[k];
            attrib[k] = v;
          }
          attrib.location = gl.getAttribLocation(program, attrib.name);
          attrib.normalized = gl.getVertexAttrib(attrib.location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
          attrib.typename = tn = keyOfWebGL2(attrib.kind = attrib.type);
          attrib.offset = parameters.ATTRIBUTES_STRIDE;
          attrib.isVector = /VEC/.test(tn.constructor.name);
          attrib.isMatrix = /MAT/.test(tn.constructor.name);
          attrib.isNumber = !/VEC|MAT/.test(tn.constructor.name);
          attrib.alias = attrib.name;
          attrib.size = (function() {
            var name, valtyp;
            name = tn.constructor.name;
            switch ((valtyp = name.split("_").pop()).substring(0, 3)) {
              case "VEC":
                return valtyp[3] * 1;
              case "MAT":
                return valtyp[3] * (valtyp[5] || 1);
            }
          })();
          attrib.BYTES_PER_ATTRIBUTE = attrib.size * (function() {
            switch (attrib.type = gl[tn.constructor.name.split("_")[0]]) {
              case gl.FLOAT:
                return 4;
              case gl.UNSIGNED_BYTE:
                return 1;
              default:
                throw /DEFINED/;
            }
          })();
          parameters.VERTEX_ARRAY_NAME += ` ${attrib.alias} `;
          parameters.VERTEX_ARRAY_NAME = parameters.VERTEX_ARRAY_NAME.trim();
          parameters.ATTRIBUTES_STRIDE += attrib.BYTES_PER_ATTRIBUTE;
          results.push(attrib);
        }
        return results;
      })();
      ref5 = parameters.ATTRIBUTES;
      for (q = 0, len2 = ref5.length; q < len2; q++) {
        attrib = ref5[q];
        attribute = new_Pointer(VertexAttribute);
        attribute.set(attrib.alias);
        assign(attribute, {
          location: attrib.location,
          size: attrib.size,
          type: attrib.type,
          normalized: attrib.normalized,
          stride: parameters.ATTRIBUTES_STRIDE,
          offset: attrib.offset,
          kind: attrib.kind,
          BYTES_PER_POINT: attrib.BYTES_PER_ATTRIBUTE
        });
        addChildren(this, attribute);
      }
      //? uniforms -------------->
      numUniforms = parameters.PROGRAM.ACTIVE_UNIFORMS;
      parameters.UNIFORMS = (function() {
        var ref6, results;
        results = [];
        while (numUniforms--) {
          uniform = {};
          ref6 = gl.getActiveUniform(program, numUniforms);
          for (k in ref6) {
            v = ref6[k];
            uniform[k] = v;
          }
          uniform.kind = tn = keyOfWebGL2(uniform.type);
          uniform.location = gl.getUniformLocation(program, uniform.name);
          uniform.alias = uniform.name.split(/\[/)[0];
          uniform.uploader = (function() {
            switch (tn.constructor.name) {
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
          uniform.type = keyOfWebGL2(tn.constructor.name.replace(/(_VEC|_MAT)(\d(\\x\w+))|((_VEC|_MAT)+\d+)/mg, ""));
          uniform.size = (function() {
            var name, valtyp;
            name = tn.constructor.name;
            switch ((valtyp = name.split("_").pop()).substring(0, 3)) {
              case "VEC":
                return valtyp[3] * 1;
              case "MAT":
                return valtyp[3] * (valtyp[5] || valtyp[3]);
              default:
                return 1;
            }
          })();
          uniform.byteLength = uniform.size * (function() {
            switch (uniform.type.constructor.name) {
              case "FLOAT":
                return 4;
              case "INT":
                return 2;
              default:
                return 1;
            }
          })();
          results.push(uniform);
        }
        return results;
      })();
      ref6 = parameters.UNIFORMS;
      for (w = 0, len3 = ref6.length; w < len3; w++) {
        u = ref6[w];
        uniform = new_Pointer(Uniform);
        assign(uniform, {
          size: u.size,
          type: u.type,
          kind: u.kind,
          byteLength: u.byteLength
        });
        addChildren(this, uniform.set(u.alias));
      }
      addChildren(this, varr = new_Pointer(VertexArray));
      varr.set(parameters.VERTEX_ARRAY_NAME);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteProgram(program);
      gl = null;
      setPtriUint32(this + SHADER_SOURCE_PARAMETERS, storeForUint32(parameters));
      return parameters;
    }
  }
});

ref1 = reDefine = classes;
//* <----------------------------------------> *#
//* <----------------------------------------> *#
//* <----------------------------------------> *#
for (cname in ref1) {
  Class = ref1[cname];
  prop = cname[0].toLowerCase() + cname.substring(1);
  define(storage.append(Class), {
    [prop]: {
      value: Class
    }
  });
  defineds = {};
  ref2 = descs = Object.getOwnPropertyDescriptors(Class.prototype);
  for (pname in ref2) {
    desc = ref2[pname];
    if (desc.enumerable !== false) {
      continue;
    }
    if (!/get|set/.test(key = pname.substring(0, 3))) {
      continue;
    }
    if (!(className = pname.substring(3))) {
      continue;
    }
    if (!(pkey = className[0].toLowerCase() + className.substring(1))) {
      continue;
    }
    if (defineds[pkey]) {
      continue;
    }
    if (!pkey.match(/name/) && descs[pkey]) {
      continue;
    }
    if (d = getOwn(Class.prototype, `get${className}`)) {
      get = d.value;
    }
    if (d = getOwn(Class.prototype, `set${className}`)) {
      set = d.value;
    }
    define(Class.prototype, {
      [pkey]: {
        get,
        set,
        enumerable: true
      }
    });
    defineds[pkey] = 1;
  }
  if (!Class.prototype.TypedArray) {
    continue;
  }
  define(Class.prototype, {
    BYTES_PER_ELEMENT: {
      value: Class.prototype.TypedArray.BYTES_PER_ELEMENT
    }
  });
  if (Class.byteLength) {
    define(Class, {
      length: {
        value: Class.byteLength / Class.prototype.BYTES_PER_ELEMENT
      }
    });
  }
  continue;
}

ref3 = [VertexArray, VertexAttribute, Program, Uniform, DrawBuffer];
for (m = 0, len = ref3.length; m < len; m++) {
  Class = ref3[m];
  Object.defineProperty(Class.prototype, "children", {
    value: new PtriArray
  });
}

ref4 = "isFinite isInteger isNaN isSafeInteger parseFloat parseInt".split(/\n|\s+/g);
for (n = 0, len1 = ref4.length; n < len1; n++) {
  p = ref4[n];
  Reflect.deleteProperty(Number, p);
}

ref5 = "toExponential toLocaleString toPrecision toFixed".split(/\n|\s+/g);
for (q = 0, len2 = ref5.length; q < len2; q++) {
  p = ref5[q];
  Reflect.deleteProperty(Number.prototype, p);
}

ref6 = "assign create entries freeze fromEntries getOwnPropertyDescriptor getOwnPropertyNames getOwnPropertySymbols getPrototypeOf groupBy hasOwn is isExtensible isFrozen isSealed keys preventExtensions seal setPrototypeOf values".split(/\n|\s+/g);
for (w = 0, len3 = ref6.length; w < len3; w++) {
  p = ref6[w];
  Reflect.deleteProperty(Object, p);
}

ref7 = "__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ propertyIsEnumerable toLocaleString hasOwnProperty isPrototypeOf".split(/\n|\s+/g);
for (x = 0, len4 = ref7.length; x < len4; x++) {
  p = ref7[x];
  Reflect.deleteProperty(Object.prototype, p);
}


//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
false && (function() {
  var dc, drawCall, dst, dx, dy, dz, len5, msh, msh2, p0, p1, pointCount, post, program, rc1, rc2, ref8, sc, source, src, ss1, ss2, target, vp1, vp2, x0, y, y0, z0;
  sc = new_Pointer(Scene);
  msh = new_Pointer(Mesh);
  msh2 = new_Pointer(Mesh);
  ss1 = new_Pointer(ProgramSource).set("my-avesome-vertex-shader");
  ss2 = new_Pointer(ProgramSource).set("default");
  rc1 = new_Pointer(RenderingContext);
  rc2 = new_Pointer(RenderingContext);
  vp1 = new_Pointer(Viewport);
  p0 = new_Pointer(Program).set("my-avesome-vertex-shader");
  p1 = new_Pointer(Program).set("default");
  vp2 = Viewport.of({
    width: 320,
    height: 240,
    left: 20,
    top: 20
  });
  rc2.beParentOf(new_Pointer(Program).set("my-avesome-vertex-shader"));
  rc2.beParentOf(new_Pointer(Program).set("default"));
  rc2.beParentOf(vp2);
  rc1.beParentOf(p1);
  ref8 = rc2.defaultDrawCalls;
  for (y = 0, len5 = ref8.length; y < len5; y++) {
    dc = ref8[y];
    msh.beParentOf(dc.inheritableCopy);
  }
  sc.beParentOf(msh);
  sc.beParentOf(ss1);
  sc.beParentOf(ss2);
  sc.beParentOf(vp1);
  sc.beParentOf(rc1);
  sc.beParentOf(rc2);
  warn(msh2.set([0, 0, 0, 0, 0.5, 0, 0.7, 0, 0, 0, 0, 0, 0, 0.5, 0, 0.7, 0, 0, 0, 0, 0, 0, 0.5, 0, 0.7, 0, 0]));
  warn(msh.set([0, 0, 0, 0, 0.5, 0, 0.7, 0, 0]));
  msh.beParentOf(post = new_Pointer(Position));
  log("post:", post.set([1, 0, -1]));
  msh.beParentOf(msh2);
  self.mesh = msh;
  source = mesh.vertices;
  drawCall = mesh.drawCalls[0];
  program = drawCall.program;
  target = drawCall.attributes;
  pointCount = drawCall.pointCount;
  warn(drawCall);
  warn(target.attribute(1));
  warn(src = source.vertex(1));
  log("mesh.position:", mesh.position);
  log("mesh.rotation:", mesh.rotation);
  log("mesh.scale:", mesh.scale);
  [x0, y0, z0] = source.vertex(1);
  [dx, dy, dz] = mesh.position.subarray;
  warn(dst = drawCall.attribute(1, "a_Position"));
  dst.set([x0 + dx, y0 + dy, z0 + dz]);
  log({source});
  return log({target});
})();
