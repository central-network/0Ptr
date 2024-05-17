//? hello world <3
var ATTRIBUTE_BYTES_PERP, ATTRIBUTE_KIND, ATTRIBUTE_LOCATION, ATTRIBUTE_NORMALIZED, ATTRIBUTE_OFFSET, ATTRIBUTE_SIZE, ATTRIBUTE_STRIDE, ATTRIBUTE_TYPE, BPE, Class, DRAWBUFFER_BINDBINDING, DRAWBUFFER_BYTELENGTH, DRAWBUFFER_GLOBJECT, DRAWBUFFER_ISBINDED, DRAWBUFFER_RESIZEBINDING, DRAWBUFFER_TARGET, DRAWBUFFER_USAGE, DRAWCALL_DBUFFER, DRAWCALL_DRAWBINDING, DRAWCALL_DSTBYTEOFFSET, DRAWCALL_PROGRAM, DRAWCALL_RCONTEXT, DRAWCALL_STATE, DRAWCALL_TARGET, DRAWCALL_TYPE, DRAWCALL_UPLOADBINDING, DRAWCALL_UPLOADED, DRAWCALL_USAGE, GL2KEY, GL2NUM, GL2VAL, MESH_MMATRIX, MESH_UPLOADED, POINTER_BYTELENGTH, POINTER_LENGTH, PROGRAM_GLPROGRAM, PROGRAM_ISINUSE, PROGRAM_SHADER_SOURCE, PROGRAM_USEBINDING, PROGRAM_VAOBINDING, PTR_BYTELENGTH, PTR_BYTEOFFSET, PTR_CLASSINDEX, PTR_LINKED, PTR_PARENT, RENDERING_CONTEXT_DBUFFER, RENDERING_CONTEXT_DPROGRAM, RENDERING_CONTEXT_DRAWCALL, RENDERING_CONTEXT_GLOBJECT, RENDERING_CONTEXT_VIEWPORT, SCENE_DEFAULT_CONTEXT, SHADER_SOURCE_BYTES_PERP, Storage, UNIFORM_BYTELENGTH, UNIFORM_KIND, UNIFORM_SIZE, UNIFORM_TYPE, VIEWPORT_ASPECT_RATIO, VIEWPORT_HEIGHT, VIEWPORT_LEFT, VIEWPORT_PIXEL_RATIO, VIEWPORT_TOP, VIEWPORT_WITDH, VIEWPORT_X, VIEWPORT_Y, addChildren, addListener, addPtriUint32, addUint32, appendElement, assign, className, classes, createElement, d, debug, decode, define, delay, desc, dvw, encode, error, f32, findChild, findChilds, findPointer, get, getByteLength, getByteOffset, getClassIndex, getFloat32, getParent, getPtriFloat32, getPtriUint16, getPtriUint32, getPtriUint8, getUint32, getUint8, getown, hitListener, hitOnTimeout, iLE, key, keyOfWebGL2, l, len, log, malloc, msh, msh2, name, new_Float32Array, new_Pointer, new_Uint32Array, new_Uint8Array, p0, p1, palloc, prop, ptrByteCompare, ptr_Pointer, queryDocument, rc1, rc2, reDefine, ref, ref1, ref2, sab, sc, set, setByteLength, setByteOffset, setClassIndex, setFloat32, setParent, setPtriFloat32, setPtriUint16, setPtriUint32, setPtriUint8, setUint32, setUint8, sliceUint8, ss1, ss2, storeForUint32, storeForUint8, subarrayFloat32, subarrayUint32, subarrayUint8, table, u32, ui8, vp1, vp2, warn;

export var Pointer = class Pointer extends Number {};

export var PtriArray = class PtriArray extends Array {};

export var Vertices = class Vertices extends Float32Array {};

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

export default classes = new Object({Scene, DrawCall, Viewport, ClearColor, ClearMask, Color, Scale, Rotation, Position, ModifierMatrix, Mesh, Id, ProgramSource, VertexShader, FragmentShader, EventHandler, Program, RenderingContext, VertexArray, VertexAttribute, Uniform, CPU, GPU, PtriArray, DrawBuffer});

GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

({log, warn, error, table, debug, delay} = console);

sab = new SharedArrayBuffer(1e7);

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

PTR_CLASSINDEX = 0 * BPE;

PTR_PARENT = 1 * BPE;

PTR_LINKED = 2 * BPE;

PTR_BYTEOFFSET = 3 * BPE;

PTR_BYTELENGTH = 4 * BPE;

SCENE_DEFAULT_CONTEXT = 5 * BPE;

MESH_UPLOADED = 5 * BPE;

MESH_MMATRIX = 6 * BPE;

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

PROGRAM_GLPROGRAM = 5 * BPE;

PROGRAM_USEBINDING = PROGRAM_GLPROGRAM + 1;

PROGRAM_ISINUSE = PROGRAM_GLPROGRAM + 2;

PROGRAM_VAOBINDING = PROGRAM_GLPROGRAM + 3;

PROGRAM_SHADER_SOURCE = 7 * BPE;

SHADER_SOURCE_BYTES_PERP = 5 * BPE;

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

//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
assign = Object.assign;

define = Object.defineProperties;

getown = Object.getOwnPropertyDescriptor;

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

palloc = Atomics.add.bind(Atomics, u32, 0, POINTER_BYTELENGTH);

malloc = function(byteLength = 0) {
  var mod;
  if (mod = Atomics.load(u32, 1) % 8) {
    Atomics.add(u32, 1, 8 - mod);
  }
  return Atomics.add(u32, 1, byteLength);
};

export var storage = new (Storage = class Storage extends Array {
  constructor() {
    super(...arguments).add(null);
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

  add(o) {
    this[this.length] = o;
    return this;
  }

})(0xff);

//* <----------------------------------------> *#
//* <----------------------------------------> *#
//* <----------------------------------------> *#
keyOfWebGL2 = function(type, min = 0xff, max = 0xffff) {
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
};

addListener = function(element, event, handler) {
  element.addEventListener(event, handler);
  return element;
};

hitListener = function(element, event, detail) {
  return element.dispatchEvent(new CustomEvent(event, {detail}));
};

appendElement = function(element) {
  document.body.appendChild(element);
  return element;
};

createElement = function(tagName) {
  return document.createElement(tagName);
};

queryDocument = function(query, all = false) {
  if (!all) {
    return document.querySelector(query);
  } else {
    return document.querySelectorAll(query);
  }
};

hitOnTimeout = function() {
  var fn;
  fn = arguments[0];
  return function() {
    return clearTimeout(delay) || (delay = setTimeout(fn.bind(this, ...arguments), 40));
  };
};

getByteOffset = function(ptri) {
  return dvw.getUint32(ptri + PTR_BYTEOFFSET, iLE);
};

setByteOffset = function(ptri, byteOffset) {
  dvw.setUint32(ptri + PTR_BYTEOFFSET, byteOffset, iLE);
  return ptri;
};

getByteLength = function(ptri) {
  return dvw.getUint32(ptri + PTR_BYTELENGTH, iLE);
};

setByteLength = function(ptri, byteLength) {
  dvw.setUint32(ptri + PTR_BYTELENGTH, byteLength, iLE);
  return ptri;
};

ptr_Pointer = function(ptri) {
  return ptri && new storage[getClassIndex(ptri)](ptri);
};

new_Pointer = function(Class) {
  var byteLength, ptri;
  setClassIndex(ptri = new Class(palloc()));
  if (!(byteLength = Class.byteLength)) {
    return ptri;
  }
  setByteOffset(ptri, malloc(byteLength));
  setByteLength(ptri, byteLength);
  return ptri;
};

getClassIndex = function(ptri) {
  return dvw.getUint32(ptri + PTR_CLASSINDEX, iLE) || storage.indexOf(ptri.constructor);
};

setClassIndex = function(ptri, clsi) {
  if (-1 === (clsi || (clsi = getClassIndex(ptri)))) {
    throw /CLASS_INDEX_ERR/;
  }
  dvw.setUint32(ptri + PTR_CLASSINDEX, clsi || getClassIndex(ptri), iLE);
  return ptri;
};

addChildren = function(parent, child) {
  dvw.setUint32(child + PTR_PARENT, parent, iLE);
  return child;
};

setParent = function(child, parent) {
  dvw.setUint32(child + PTR_PARENT, parent, iLE);
  return parent;
};

getParent = function(ptri) {
  return dvw.getUint32(ptri + PTR_PARENT, iLE);
};

getUint8 = function(ptri, byteOffset) {
  return dvw.getUint8(byteOffset + getByteOffset(ptri));
};

setUint8 = function(ptri, byteOffset, value) {
  dvw.setUint8(byteOffset + getByteOffset(ptri), value);
  return value;
};

addUint32 = function(ptri, byteOffset, value, atomics = true) {
  var val;
  byteOffset += getByteOffset(ptri);
  if (atomics) {
    return Atomics.add(u32, byteOffset / 4, value);
  } else {
    val = dvw.getUint32(byteOffset, iLE);
    dvw.setUint32(byteOffset, value + val, iLE);
  }
  return val;
};

getUint32 = function(ptri, byteOffset) {
  return dvw.getUint32(byteOffset + getByteOffset(ptri), iLE);
};

setUint32 = function(ptri, byteOffset, value) {
  dvw.setUint32(byteOffset + getByteOffset(ptri), value, iLE);
  return value;
};

getFloat32 = function(ptri, byteOffset) {
  return dvw.getFloat32(byteOffset + getByteOffset(ptri), iLE);
};

setFloat32 = function(ptri, byteOffset, value) {
  dvw.setFloat32(byteOffset + getByteOffset(ptri), value, iLE);
  return value;
};

getPtriUint8 = function(byteOffset) {
  return dvw.getUint8(byteOffset);
};

setPtriUint8 = function(byteOffset, value) {
  dvw.setUint8(byteOffset, value);
  return value;
};

addPtriUint32 = function(byteOffset, value) {
  return Atomics.add(u32, byteOffset / 4, value);
};

getPtriUint32 = function(byteOffset) {
  return dvw.getUint32(byteOffset, iLE);
};

setPtriUint32 = function(byteOffset, value) {
  dvw.setUint32(byteOffset, value, iLE);
  return value;
};

getPtriUint16 = function(byteOffset) {
  return dvw.getUint16(byteOffset, iLE);
};

setPtriUint16 = function(byteOffset, value) {
  dvw.setUint16(byteOffset, value, iLE);
  return value;
};

getPtriFloat32 = function(byteOffset) {
  return dvw.getFloat32(byteOffset, iLE);
};

setPtriFloat32 = function(byteOffset, value) {
  dvw.setFloat32(byteOffset, value, iLE);
  return value;
};

storeForUint8 = function(any) {
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
};

storeForUint32 = function(any) {
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
};

new_Uint32Array = function(ptri, byteOffset, length) {
  length || (length = getByteLength(ptri) / 4);
  byteOffset = getByteOffset(ptri) + byteOffset || 0;
  return new Uint32Array(sab, byteOffset, length);
};

new_Uint8Array = function(ptri, byteOffset, length) {
  length || (length = getByteLength(ptri));
  byteOffset = getByteOffset(ptri) + byteOffset || 0;
  return new Uint8Array(sab, byteOffset, length);
};

new_Float32Array = function(ptri, byteOffset, length) {
  length || (length = getByteLength(ptri) / 4);
  byteOffset = getByteOffset(ptri) + byteOffset || 0;
  return new Float32Array(sab, byteOffset, length);
};

subarrayUint8 = function(ptri, begin, end) {
  var length, offset;
  offset = getByteOffset(ptri);
  length = getByteLength(ptri);
  end || (end = length + (begin || (begin = begin || 0)));
  return ui8.subarray(begin + offset, end + offset);
};

sliceUint8 = function(ptri, begin, end) {
  var length, offset;
  offset = getByteOffset(ptri);
  length = getByteLength(ptri);
  end || (end = length + (begin || (begin = begin || 0)));
  return ui8.slice(begin + offset, end + offset);
};

subarrayUint32 = function(ptri, begin, end) {
  var length, offset;
  offset = getByteOffset(ptri) / 4;
  length = getByteLength(ptri) / 4;
  end || (end = length + (begin || (begin = begin || 0)));
  return u32.subarray(begin + offset, end + offset);
};

subarrayFloat32 = function(ptri, begin, end) {
  var length, offset;
  offset = getByteOffset(ptri) / 4;
  length = getByteLength(ptri) / 4;
  end || (end = length + (begin || (begin = begin || 0)));
  return f32.subarray(begin + offset, end + offset);
};

ptrByteCompare = function(ptri, ptrj) {
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
};

findChild = function(ptri, Class, inherit = false) {
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
};

findChilds = function(ptri, Class, construct = true) {
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
};

findPointer = function(test, Class, construct = true) {
  var clsi, ptr, ptrj;
  ptrj = Atomics.load(u32);
  if (!Class) {
    if (!construct) {
      while (ptrj -= POINTER_BYTELENGTH) {
        if (test(ptr = ptrj)) {
          return ptr;
        }
      }
      return void 0;
    }
    while (ptrj -= POINTER_BYTELENGTH) {
      if (test(ptr = ptr_Pointer(ptrj))) {
        return ptr;
      }
    }
    return void 0;
  } else {
    clsi = storage.indexOf(Class);
    if (!construct) {
      while (ptrj -= POINTER_BYTELENGTH) {
        if (clsi - getClassIndex(ptrj)) {
          continue;
        }
        if (test(ptr = ptrj)) {
          return ptr;
        }
      }
    }
    while (ptrj -= POINTER_BYTELENGTH) {
      if (clsi - getClassIndex(ptrj)) {
        continue;
      }
      if (test(ptr = ptr_Pointer(ptrj))) {
        return ptr;
      }
    }
  }
  return void 0;
};

//* <----------------------------------------> *#
//* <----------------------------------------> *#
//* <----------------------------------------> *#
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
      var arg0, i, l, len, prop, ptri, ref, value;
      setClassIndex(ptri = new this(palloc()));
      switch ((ref = (arg0 = arguments[0])) != null ? ref.constructor : void 0) {
        case Object:
          for (prop in arg0) {
            value = arg0[prop];
            addChildren(ptri, storage[prop].from(value));
          }
          break;
        case Array:
          for (l = 0, len = arg0.length; l < len; l++) {
            i = arg0[l];
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
  add: {
    value: function(ptri) {
      return setParent(ptri, this);
    }
  }
});

define(Pointer.prototype, {
  append: {
    value: function(ptri) {
      return addChildren(this, ptri);
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

define(Pointer.prototype, {
  on: {
    value: function(event, handler) {
      return this;
    }
  }
});

define(Pointer.prototype, {
  once: {
    value: function(event, handler) {
      return this;
    }
  }
});

define(Pointer.prototype, {
  emit: {
    value: function(event, handler) {
      return this;
    }
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
  last: {
    value: function() {
      return this[this.length - 1];
    }
  }
});

define(Scene.prototype, {
  setDefaultContext: {
    value: function(ptri) {
      return setPtriUint32(this + SCENE_DEFAULT_CONTEXT, ptri);
    }
  }
});

define(Scene.prototype, {
  getDefaultContext: {
    value: function() {
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
      var binding, construct, gl, l, len, ptri, ptrj, ref, stri, target;
      if (!getPtriUint8(this + DRAWBUFFER_ISBINDED)) {
        setPtriUint8(this + DRAWBUFFER_ISBINDED, 1);
        [ptri, gl, target] = [+this, this.parent.glObject, this.target];
        ref = findChilds(this.parent, DrawBuffer, construct = false);
        for (l = 0, len = ref.length; l < len; l++) {
          ptrj = ref[l];
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
      var dc, l, len, list, ref;
      list = new PtriArray;
      ref = findChilds(null, DrawCall);
      for (l = 0, len = ref.length; l < len; l++) {
        dc = ref[l];
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
          fn = gl.bufferSubData.bind(gl, this.target, this.dstByteOffset, this.vertexAttribArray);
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
  byteLength: {
    enumerable: true,
    get: function() {
      return this.program.BYTES_PER_POINT * this.parent.pointCount;
    }
  }
});

define(DrawCall.prototype, {
  vertexAttribArray: {
    enumerable: true,
    get: function() {
      return new_Float32Array(this.drawBuffer, this.dstByteOffset, this.byteLength / 4);
    }
  }
});

define(DrawCall.prototype, {
  dstByteOffset: {
    enumerable: true,
    get: function() {
      var byteOffset;
      if (!(byteOffset = getPtriUint32(this + DRAWCALL_DSTBYTEOFFSET))) {
        byteOffset = this.drawBuffer.malloc(this.byteLength);
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
        start = this.dstByteOffset / this.program.BYTES_PER_POINT;
        count = this.parent.pointCount;
        gl = this.renderingContext.glObject;
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
  renderingContext: {
    enumerable: true,
    get: function() {
      var clsi, ctxi, ptri, ptrj;
      if (!(ptri = getPtriUint32(this + DRAWCALL_RCONTEXT))) {
        ptrj = +this;
        ctxi = 0;
        clsi = storage.indexOf(Scene);
        while (ptrj = getParent(ptrj)) {
          if (!(clsi - getClassIndex(ptrj))) {
            if (ctxi = ptr_Pointer(ptrj).defaultContext) {
              break;
            }
          }
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
      var bufi, drawBuffer, l, len, ptri, rctx, ref, target, usage;
      if (!(ptri = getPtriUint32(this + DRAWCALL_DBUFFER))) {
        rctx = this.renderingContext;
        if (!getPtriUint16(this + DRAWCALL_TARGET)) {
          ({target, usage, drawBuffer} = rctx.defaultDrawCall);
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
          ref = findChilds(rctx, DrawBuffer);
          for (l = 0, len = ref.length; l < len; l++) {
            bufi = ref[l];
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
          ptri.name = "default";
        }
        setPtriUint32(this + RENDERING_CONTEXT_DPROGRAM, ptri);
      }
      return new Program(ptri);
    }
  }
});

define(RenderingContext.prototype, {
  defaultDrawCall: {
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
      return new DrawCall(ptri);
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
      var DRAW_BUFFERi, gl, i, l, len, m, parameters, pname, ref, ref1, value;
      gl = this.glObject;
      parameters = {};
      ref = "RENDERER VENDOR VERSION VIEWPORT FRONT_FACE CURRENT_PROGRAM CULL_FACE CULL_FACE_MODE BLEND BLEND_COLOR READ_BUFFER COPY_READ_BUFFER_BINDING COPY_WRITE_BUFFER_BINDING DRAW_FRAMEBUFFER_BINDING PACK_SKIP_ROWS FRAGMENT_SHADER_DERIVATIVE_HINT SAMPLE_COVERAGE SAMPLER_BINDING TEXTURE_BINDING_2D_ARRAY RED_BITS MAX_3D_TEXTURE_SIZE MAX_ARRAY_TEXTURE_LAYERS MAX_CLIENT_WAIT_TIMEOUT_WEBGL MAX_COLOR_ATTACHMENTS MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS MAX_COMBINED_UNIFORM_BLOCKS MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS MAX_DRAW_BUFFERS MAX_ELEMENT_INDEX MAX_ELEMENTS_INDICES MAX_ELEMENTS_VERTICES MAX_FRAGMENT_INPUT_COMPONENTS MAX_FRAGMENT_UNIFORM_BLOCKS MAX_FRAGMENT_UNIFORM_COMPONENTS MAX_PROGRAM_TEXEL_OFFSET MAX_SAMPLES MAX_SERVER_WAIT_TIMEOUT MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS SAMPLE_ALPHA_TO_COVERAGE MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS MAX_UNIFORM_BLOCK_SIZE MAX_UNIFORM_BUFFER_BINDINGS MAX_TEXTURE_LOD_BIAS MAX_VARYING_COMPONENTS MAX_VERTEX_OUTPUT_COMPONENTS MAX_VERTEX_UNIFORM_BLOCKS MAX_VERTEX_UNIFORM_COMPONENTS MIN_PROGRAM_TEXEL_OFFSET PACK_ROW_LENGTH PIXEL_PACK_BUFFER_BINDING PIXEL_UNPACK_BUFFER_BINDING RASTERIZER_DISCARD READ_FRAMEBUFFER_BINDING TEXTURE_BINDING_3D TRANSFORM_FEEDBACK_ACTIVE TRANSFORM_FEEDBACK_BINDING TRANSFORM_FEEDBACK_BUFFER_BINDING TRANSFORM_FEEDBACK_PAUSED UNIFORM_BUFFER_BINDING UNIFORM_BUFFER_OFFSET_ALIGNMENT UNPACK_IMAGE_HEIGHT UNPACK_ROW_LENGTH UNPACK_SKIP_IMAGES UNPACK_SKIP_PIXELS UNPACK_SKIP_ROWS VERTEX_ARRAY_BINDING ACTIVE_TEXTURE ALIASED_LINE_WIDTH_RANGE ALIASED_POINT_SIZE_RANGE ALPHA_BITS ARRAY_BUFFER_BINDING BLEND_DST_ALPHA BLEND_DST_RGB BLEND_EQUATION BLEND_EQUATION_ALPHA BLEND_EQUATION_RGB BLEND_SRC_ALPHA BLEND_SRC_RGB BLUE_BITS COLOR_CLEAR_VALUE COLOR_WRITEMASK COMPRESSED_TEXTURE_FORMATS DEPTH_BITS DEPTH_CLEAR_VALUE DEPTH_FUNC DEPTH_RANGE DEPTH_TEST DITHER ELEMENT_ARRAY_BUFFER_BINDING FRAMEBUFFER_BINDING GENERATE_MIPMAP_HINT GREEN_BITS IMPLEMENTATION_COLOR_READ_FORMAT IMPLEMENTATION_COLOR_READ_TYPE LINE_WIDTH MAX_COMBINED_TEXTURE_IMAGE_UNITS MAX_CUBE_MAP_TEXTURE_SIZE MAX_FRAGMENT_UNIFORM_VECTORS MAX_RENDERBUFFER_SIZE MAX_TEXTURE_IMAGE_UNITS DEPTH_WRITEMASK PACK_SKIP_PIXELS MAX_TEXTURE_SIZE MAX_VARYING_VECTORS MAX_VERTEX_ATTRIBS MAX_VERTEX_TEXTURE_IMAGE_UNITS SAMPLES SCISSOR_BOX MAX_VIEWPORT_DIMS PACK_ALIGNMENT POLYGON_OFFSET_FACTOR POLYGON_OFFSET_FILL POLYGON_OFFSET_UNITS RENDERBUFFER_BINDING SAMPLE_BUFFERS SAMPLE_COVERAGE_INVERT SAMPLE_COVERAGE_VALUE MAX_VERTEX_UNIFORM_VECTORS SCISSOR_TEST SHADING_LANGUAGE_VERSION STENCIL_BACK_FAIL STENCIL_BACK_FUNC STENCIL_BACK_PASS_DEPTH_FAIL STENCIL_BACK_PASS_DEPTH_PASS STENCIL_BACK_REF STENCIL_BACK_VALUE_MASK STENCIL_BACK_WRITEMASK STENCIL_BITS STENCIL_CLEAR_VALUE STENCIL_FAIL STENCIL_FUNC STENCIL_PASS_DEPTH_FAIL STENCIL_PASS_DEPTH_PASS STENCIL_REF STENCIL_TEST STENCIL_VALUE_MASK STENCIL_WRITEMASK SUBPIXEL_BITS TEXTURE_BINDING_2D TEXTURE_BINDING_CUBE_MAP UNPACK_ALIGNMENT UNPACK_COLORSPACE_CONVERSION_WEBGL UNPACK_FLIP_Y_WEBGL UNPACK_PREMULTIPLY_ALPHA_WEBGL".split(/\n|\r\n|\s+|\t/g).filter(Boolean);
      for (l = 0, len = ref.length; l < len; l++) {
        pname = ref[l];
        parameters[pname] = gl.getParameter(gl[pname]);
      }
      for (i = m = 0, ref1 = parameters.MAX_DRAW_BUFFERS; (0 <= ref1 ? m < ref1 : m > ref1); i = 0 <= ref1 ? ++m : --m) {
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
      var value;
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
      var value;
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
      var construct, l, len, ptri, ptrj, ref, stri;
      if (!getPtriUint8(this + PROGRAM_ISINUSE)) {
        setPtriUint8(this + PROGRAM_ISINUSE, 1);
        ptri = +this;
        ref = findChilds(this.parent, Program, construct = false);
        for (l = 0, len = ref.length; l < len; l++) {
          ptrj = ref[l];
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
  name: {
    enumerable: true,
    get: function() {
      return decode(sliceUint8(this));
    },
    set: Text.prototype.set
  }
});

define(Program.prototype, {
  glObject: {
    get: function() {
      var fShader, fSource, gl, info, program, stri, vShader, vSource;
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

define(Vertices.prototype, {
  set: {
    value: function(value = []) {
      var byte, construct, mesh, test;
      byte = this.byteOffset;
      test = function(ptri) {
        return 0 === byte - getByteOffset(ptri);
      };
      mesh = findPointer(test, Mesh, construct = false);
      return new Mesh(mesh).setVertices(value);
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

define(ModifierMatrix.prototype, {
  identity: {
    value: function() {
      return this.set(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
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
          byteOffset = malloc(byteLength);
          byteLength = value.length * 4;
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
  getDrawCalls: {
    value: function() {
      return findChilds(this, DrawCall);
    }
  }
});

define(Mesh.prototype, {
  getIsVisible: {
    value: function() {}
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
      var call, l, len, len1, m, mesh, ref, ref1;
      setPtriUint8(this + MESH_UPLOADED, !need);
      if (!need) {
        return 0;
      }
      ref = findChilds(this, Mesh);
      for (l = 0, len = ref.length; l < len; l++) {
        mesh = ref[l];
        mesh.setNeedsUpdate(1);
      }
      ref1 = findChilds(this, DrawCall);
      for (m = 0, len1 = ref1.length; m < len1; m++) {
        call = ref1[m];
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
        ptri.identity();
        addChildren(this, ptri);
        setPtriUint32(this + MESH_MMATRIX, ptri);
      }
      return new ModifierMatrix(ptri);
    }
  }
});

define(Uniform, {
  getLocation: {
    value: function(program, name) {
      return program.parent.glObject.getUniformLocation(program.glObject, name);
    }
  }
});

define(Uniform.prototype, {
  name: {
    enumerable: true,
    get: function() {
      return decode(sliceUint8(this));
    },
    set: Text.prototype.set
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
  name: {
    enumerable: true,
    get: function() {
      return decode(sliceUint8(this));
    },
    set: Text.prototype.set
  }
});

define(VertexAttribute, {
  getLocation: {
    value: function(program, name) {
      var gl;
      gl = program.parent.glObject;
      return gl.getAttribLocation(program.glObject, name);
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
      var attr, l, len, ref, sum;
      sum = 0;
      ref = this.attributes;
      for (l = 0, len = ref.length; l < len; l++) {
        attr = ref[l];
        sum = sum + attr.BYTES_PER_POINT;
      }
      return sum;
    }
  }
});

define(VertexArray.prototype, {
  name: {
    enumerable: true,
    get: function() {
      return decode(sliceUint8(this));
    },
    set: Text.prototype.set
  }
});

define(VertexArray.prototype, {
  bound: {
    value: function(gl, extraCalls = []) {
      var attr, call, construct, l, len, len1, m, ref, vao;
      if (!gl) {
        throw /NO_CONTEXT_SUPPLIED/;
      } else {
        this.parent.BYTES_PER_POINT;
      }
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      ref = findChilds(this.parent, VertexAttribute, construct = true);
      for (l = 0, len = ref.length; l < len; l++) {
        attr = ref[l];
        gl.enableVertexAttribArray(attr.location);
        gl.vertexAttribPointer(...attr.pointerArgs);
      }
      for (m = 0, len1 = extraCalls.length; m < len1; m++) {
        call = extraCalls[m];
        call(gl);
      }
      return gl.bindVertexArray.bind(gl, vao);
    }
  }
});

define(ProgramSource.prototype, {
  name: {
    enumerable: true,
    get: function() {
      return decode(sliceUint8(this));
    },
    set: function(name) {
      setPtriUint32(this + SHADER_SOURCE_BYTES_PERP, 0);
      Text.prototype.set.call(this, name);
      return this;
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
      var ref;
      return (ref = this.documentScripts.vertexShader) != null ? ref.text : void 0;
    }
  }
});

define(ProgramSource.prototype, {
  computeShader: {
    get: function() {
      var ref;
      return (ref = this.documentScripts.computeShader) != null ? ref.text : void 0;
    }
  }
});

define(ProgramSource.prototype, {
  fragmentShader: {
    get: function() {
      var ref;
      return (ref = this.documentScripts.fragmentShader) != null ? ref.text : void 0;
    }
  }
});

define(ProgramSource.prototype, {
  documentScripts: {
    get: function() {
      var $name, c, f, v;
      v = queryDocument(`[name=${this.name}][type*='vertex']`);
      c = queryDocument(`[name=${this.name}][type*='compute']`);
      f = queryDocument(`[name=${this.name}][type*='fragment']`);
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
  findUniform: {
    value: function(name) {
      var attr, l, len, ref;
      ref = findChilds(this, Uniform);
      for (l = 0, len = ref.length; l < len; l++) {
        attr = ref[l];
        if (attr.name === name) {
          return attr;
        }
      }
    }
  }
});

define(ProgramSource.prototype, {
  findVertexAttrib: {
    value: function(name) {
      var attr, l, len, ref;
      ref = findChilds(this, VertexAttribute);
      for (l = 0, len = ref.length; l < len; l++) {
        attr = ref[l];
        if (attr.name === name) {
          return attr;
        }
      }
    }
  }
});

define(ProgramSource.prototype, {
  findVertexArray: {
    value: function(name) {
      var l, len, ref, varr;
      ref = findChilds(this, VertexArray);
      for (l = 0, len = ref.length; l < len; l++) {
        varr = ref[l];
        if (varr.name === name) {
          return varr;
        }
      }
    }
  }
});

define(ProgramSource.prototype, {
  getParameters: {
    value: function() {
      var attrib, attribute, fShader, fSource, gl, gls, info, k, l, len, len1, len2, len3, m, n, numAttribs, numUniforms, p, parameters, pname, program, q, ref, ref1, ref2, ref3, ref4, ref5, s, shaders, split, tn, u, uniform, v, vShader, vSource, value, varr;
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
      ref = split("DELETE_STATUS LINK_STATUS VALIDATE_STATUS ATTACHED_SHADERS ACTIVE_ATTRIBUTES ACTIVE_UNIFORMS TRANSFORM_FEEDBACK_BUFFER_MODE TRANSFORM_FEEDBACK_VARYINGS ACTIVE_UNIFORM_BLOCKS");
      for (l = 0, len = ref.length; l < len; l++) {
        p = ref[l];
        parameters.PROGRAM[p] = gl.getProgramParameter(program, gl[p]);
      }
      ref1 = parameters.PROGRAM;
      for (pname in ref1) {
        value = ref1[pname];
        parameters.PROGRAM[pname] = keyOfWebGL2(value);
      }
      for (s in shaders) {
        gls = shaders[s];
        ref2 = split("DELETE_STATUS COMPILE_STATUS SHADER_TYPE");
        for (m = 0, len1 = ref2.length; m < len1; m++) {
          p = ref2[m];
          parameters[s][p] = gl.getShaderParameter(gls, gl[p]);
        }
      }
      for (s in shaders) {
        gls = shaders[s];
        ref3 = parameters[s];
        for (pname in ref3) {
          value = ref3[pname];
          parameters[s][pname] = keyOfWebGL2(value);
          parameters[s].SHADER_SOURCE = gl.getShaderSource(gls);
          parameters[s].INFO_LOG = gl.getShaderInfoLog(gls);
        }
      }
      numAttribs = parameters.PROGRAM.ACTIVE_ATTRIBUTES;
      parameters.VERTEX_ARRAY_NAME = "";
      parameters.ATTRIBUTES_STRIDE = 0;
      parameters.ATTRIBUTES = (function() {
        var ref4, results;
        results = [];
        while (numAttribs--) {
          attrib = {};
          ref4 = gl.getActiveAttrib(program, numAttribs);
          for (k in ref4) {
            v = ref4[k];
            attrib[k] = v;
          }
          attrib.location = gl.getAttribLocation(program, attrib.name);
          attrib.normalized = gl.getVertexAttrib(attrib.location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
          attrib.typename = tn = keyOfWebGL2(attrib.kind = attrib.type);
          attrib.offset = parameters.ATTRIBUTES_STRIDE;
          attrib.isVector = /VEC/.test(tn.constructor.name);
          attrib.isMatrix = /MAT/.test(tn.constructor.name);
          attrib.isNumber = !/VEC|MAT/.test(tn.constructor.name);
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
          parameters.VERTEX_ARRAY_NAME += ` ${attrib.name} `;
          parameters.VERTEX_ARRAY_NAME = parameters.VERTEX_ARRAY_NAME.trim();
          parameters.ATTRIBUTES_STRIDE += attrib.BYTES_PER_ATTRIBUTE;
          results.push(attrib);
        }
        return results;
      })();
      ref4 = parameters.ATTRIBUTES;
      for (n = 0, len2 = ref4.length; n < len2; n++) {
        attrib = ref4[n];
        if (this.findVertexAttrib(attrib.name)) {
          continue;
        }
        attribute = new_Pointer(VertexAttribute);
        attribute.set(attrib.name);
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
        var ref5, results;
        results = [];
        while (numUniforms--) {
          uniform = {};
          ref5 = gl.getActiveUniform(program, numUniforms);
          for (k in ref5) {
            v = ref5[k];
            uniform[k] = v;
          }
          uniform.kind = tn = keyOfWebGL2(uniform.type);
          uniform.location = gl.getUniformLocation(program, uniform.name);
          uniform.name = uniform.name.split(/\[/)[0];
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
      ref5 = parameters.UNIFORMS;
      for (q = 0, len3 = ref5.length; q < len3; q++) {
        u = ref5[q];
        if (this.findUniform(u.name)) {
          continue;
        }
        uniform = new_Pointer(Uniform);
        assign(uniform, {
          size: u.size,
          type: u.type,
          kind: u.kind,
          byteLength: u.byteLength
        });
        addChildren(this, uniform.set(u.name));
      }
      if (!this.findVertexArray(parameters.VERTEX_ARRAY_NAME)) {
        addChildren(this, varr = new_Pointer(VertexArray));
        varr.set(parameters.VERTEX_ARRAY_NAME);
      }
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteProgram(program);
      gl = null;
      return parameters;
    }
  }
});

palloc(malloc(POINTER_BYTELENGTH * 1e5));

ref = reDefine = classes;
//* <----------------------------------------> *#
//* <----------------------------------------> *#
//* <----------------------------------------> *#
for (name in ref) {
  Class = ref[name];
  prop = name[0].toLowerCase() + name.substring(1);
  define(storage.add(Class), {
    [prop]: {
      value: Class
    }
  });
  ref1 = Object.getOwnPropertyDescriptors(Class.prototype);
  for (name in ref1) {
    desc = ref1[name];
    if (desc.enumerable !== false) {
      continue;
    }
    if (!/get|set/.test(key = name.substring(0, 3))) {
      continue;
    }
    if (!(className = name.substring(3))) {
      continue;
    }
    if (false !== Object.hasOwn(Class.prototype, prop = className[0].toLowerCase() + className.substring(1))) {
      continue;
    }
    if (d = getown(Class.prototype, `get${className}`)) {
      get = d.value;
    }
    if (d = getown(Class.prototype, `set${className}`)) {
      set = d.value;
    }
    define(Class.prototype, {
      [prop]: {
        get,
        set,
        enumerable: true
      }
    });
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

ref2 = [VertexArray, VertexAttribute, Uniform, Program, DrawBuffer];
for (l = 0, len = ref2.length; l < len; l++) {
  Class = ref2[l];
  define(Class.prototype, {
    children: new PtriArray
  });
}

//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
//? <----------------------------------------> ?#
warn("sc:", sc = new_Pointer(Scene));

warn("mesh:", msh = new_Pointer(Mesh));

warn("mesh2:", msh2 = new_Pointer(Mesh));

warn("ss1:", ss1 = new_Pointer(ProgramSource).set("default"));

warn("ss1:", ss2 = new_Pointer(ProgramSource).set("my-avesome-vertex-shader"));

warn("rc1:", rc1 = new_Pointer(RenderingContext));

warn("vp1:", vp1 = new_Pointer(Viewport));

warn("p0:", p0 = new_Pointer(Program).set("my-avesome-vertex-shader"));

warn("p1:", p1 = new_Pointer(Program).set("default"));

warn("rc2:", rc2 = new_Pointer(RenderingContext));

warn("vp2:", vp2 = Viewport.of({
  width: 320,
  height: 240,
  left: 20,
  top: 20
}));

warn("rc1.add p0:", rc1.add(p0));

warn("rc2.add bp2:", rc2.add(vp2));

warn("sc.add msh:", sc.add(msh));

warn("sc.add vp1:", sc.add(vp1));

warn("sc.add ss1:", sc.add(ss1));

warn("sc.add ss2:", sc.add(ss2));

warn("sc.add rc1:", sc.add(rc1));

warn("sc.add rc2:", sc.add(rc2));

warn("rc1.add p1:", rc1.add(p1));

warn("rc1.findChild Inheritable Viewport:", findChild(rc1, Viewport, true));

warn("rc2.findChild Inheritable Viewport:", findChild(rc2, Viewport, true));

warn("sc.findChild Inheritable ProgramSource:", findChild(rc2, Viewport, true));

warn("ss2.parameters:", ss2.parameters);

warn("sc.defctx:", sc.defaultContext.defaultBuffer.bind());

warn("msh.set:", msh.set([0, 0, 0, 0, 0.5, 0, 0.7, 0, 0]));

warn("msh.append new_Pointer( DrawCall ):", msh.append(new_Pointer(DrawCall)));

warn("msh.append new_Pointer( DrawCall ):", msh.append(new_Pointer(DrawCall)));

warn("msh2", msh.add(msh2));

warn("msh2", self.mesh = msh);
