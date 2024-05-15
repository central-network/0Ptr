//? hello world <3
var BPE, Class, POINTER_BYTELENGTH, POINTER_LENGTH, PTR_BYTELENGTH, PTR_BYTEOFFSET, PTR_CLASSINDEX, PTR_LINKED, PTR_PARENT, RENDERING_CONTEXT_GLOBJECT, RENDERING_CONTEXT_VIEWPORT, Storage, VIEWPORT_ASPECT_RATIO, VIEWPORT_HEIGHT, VIEWPORT_LEFT, VIEWPORT_PIXEL_RATIO, VIEWPORT_TOP, VIEWPORT_WITDH, VIEWPORT_X, VIEWPORT_Y, addChildren, assign, className, classes, d, debug, decode, define, delay, dvw, encode, error, findChild, get, getByteLength, getByteOffset, getClassIndex, getFloat32, getParent, getPtriFloat32, getPtriUint32, getPtriUint8, getUint32, getUint8, getown, iLE, key, log, malloc, name, new_Pointer, new_Uint32Array, new_Uint8Array, p0, p1, palloc, prop, ptr_Pointer, rc, sab, set, setByteLength, setByteOffset, setClassIndex, setFloat32, setParent, setPtriFloat32, setPtriUint32, setPtriUint8, setTimeDelay, setUint32, setUint8, sliceUint8, storeForUint32, storeForUint8, subarrayUint32, subarrayUint8, table, u32, ui8, vp, warn;

export var Pointer = class Pointer extends Number {};

export var Scene = class Scene extends Pointer {};

export var DrawCall = class DrawCall extends Pointer {};

export var Viewport = class Viewport extends Pointer {};

export var ClearColor = class ClearColor extends Pointer {};

export var ClearMask = class ClearMask extends Pointer {};

export var Color = class Color extends Pointer {};

export var Scale = class Scale extends Pointer {};

export var Rotation = class Rotation extends Pointer {};

export var Position = class Position extends Pointer {};

export var Vertices = class Vertices extends Pointer {};

export var Mesh = class Mesh extends Pointer {};

export var Text = class Text extends Pointer {};

export var Id = class Id extends Text {};

export var VertexShader = class VertexShader extends Text {};

export var ComputeShader = class ComputeShader extends Text {};

export var FragmentShader = class FragmentShader extends Text {};

export var Program = class Program extends Pointer {};

export var EventHandler = class EventHandler extends Pointer {};

export var RenderingContext = class RenderingContext extends Pointer {};

export var DrawBuffer = class DrawBuffer extends Pointer {};

export var VertexArray = class VertexArray extends Pointer {};

export var Attribute = class Attribute extends Text {};

export var Uniform = class Uniform extends Text {};

export var CPU = class CPU extends Text {};

export var GPU = class GPU extends Pointer {};

export var AllocArray = class AllocArray extends Pointer {};

export default classes = new Object({Scene, DrawCall, Viewport, ClearColor, ClearMask, Color, Scale, Rotation, Position, Vertices, Mesh, Id, VertexShader, FragmentShader, EventHandler, Program, RenderingContext, VertexArray, Attribute, Uniform, CPU, GPU, AllocArray});

//* export|class|extends|Pointer|Number|Text|\s+
({log, warn, error, table, debug, delay} = console);

sab = new SharedArrayBuffer(1e7);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

BPE = 4;

POINTER_LENGTH = 16;

POINTER_BYTELENGTH = BPE * POINTER_LENGTH;

PTR_CLASSINDEX = 0 * BPE;

PTR_PARENT = 1 * BPE;

PTR_LINKED = 2 * BPE;

PTR_BYTEOFFSET = 3 * BPE;

PTR_BYTELENGTH = 4 * BPE;

RENDERING_CONTEXT_GLOBJECT = 3 * BPE; // PTR_BYTEOFFSET #? HAS NO BYTEOFFSET

RENDERING_CONTEXT_VIEWPORT = 4 * BPE; // PTR_BYTELENGTH #? HAS NO BYTELENGTH

VIEWPORT_X = 3 * BPE; // PTR_BYTEOFFSET #? HAS NO BYTEOFFSET

VIEWPORT_Y = 4 * BPE; // PTR_BYTEOFFSET #? HAS NO BYTEOFFSET

VIEWPORT_TOP = 5 * BPE;

VIEWPORT_LEFT = 6 * BPE;

VIEWPORT_WITDH = 7 * BPE;

VIEWPORT_HEIGHT = 8 * BPE;

VIEWPORT_ASPECT_RATIO = 9 * BPE;

VIEWPORT_PIXEL_RATIO = 10 * BPE;

//* laskdşlkalsşkdşalkdşlaskdşlaskd
palloc = Atomics.add.bind(Atomics, u32, 0, POINTER_BYTELENGTH);

malloc = Atomics.add.bind(Atomics, u32, 1);

palloc(malloc(POINTER_BYTELENGTH * 1e5));

assign = Object.assign;

define = Object.defineProperties;

getown = Object.getOwnPropertyDescriptor;

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

export var PtriArray = class PtriArray extends Array {};

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
    this[i = this.findIndex(function(v) {
      return !v;
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

//* lşasdklkasşdkaşsldkşasldkşalsdkasşlkdlşsakd
setTimeDelay = function() {
  var fn;
  fn = arguments[0];
  return function() {
    return clearTimeout(delay) || (delay = setTimeout(fn.bind(this), 40));
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

getPtriUint32 = function(byteOffset) {
  return dvw.getUint32(byteOffset, iLE);
};

setPtriUint32 = function(byteOffset, value) {
  dvw.setUint32(byteOffset, value, iLE);
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
  return storage.fillFirstEmpty(any);
};

storeForUint32 = function(any) {
  return storage.pushOrFindIndex(any);
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

define(Pointer.prototype, {
  ['{{Pointer}}']: {
    get: function() {
      return new Uint32Array(sab, this, POINTER_LENGTH);
    }
  }
});

define(Pointer, {
  from: {
    value: function() {
      var arg0, i, j, len, prop, ptri, ref, value;
      setClassIndex(ptri = new this(palloc()));
      switch ((ref = (arg0 = arguments[0])) != null ? ref.constructor : void 0) {
        case Object:
          for (prop in arg0) {
            value = arg0[prop];
            addChildren(ptri, storage[prop].from(value));
          }
          break;
        case Array:
          for (j = 0, len = arg0.length; j < len; j++) {
            i = arg0[j];
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
  text: {
    enumerable: true,
    get: function() {
      return decode(sliceUint8(this));
    }
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

define(RenderingContext.prototype, {
  glObject: {
    get: function() {
      var node, stri;
      if (!(stri = getPtriUint8(this + RENDERING_CONTEXT_GLOBJECT))) {
        node = document.createElement("canvas");
        stri = storeForUint8(node.getContext("webgl2"));
        setPtriUint8(this + RENDERING_CONTEXT_GLOBJECT, stri);
        window.document.body.appendChild(node);
        window.addEventListener("resize", this.onresize.bind(this));
        window.dispatchEvent(new Event("resize"));
      }
      return storage[stri];
    }
  }
});

define(RenderingContext.prototype, {
  onresize: {
    value: setTimeDelay(function() {
      var height, left, pixelRatio, top, width;
      ({top, left, width, height, pixelRatio} = this.viewport);
      assign(this.glObject.canvas, {
        width: pixelRatio * width,
        height: pixelRatio * height
      });
      assign(this.glObject.canvas.style, {
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
  getViewport: {
    value: function() {
      var inherit, ptrj;
      if (!(ptrj = getPtriUint8(this + RENDERING_CONTEXT_VIEWPORT))) {
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
      return setPtriUint8(this + RENDERING_CONTEXT_VIEWPORT, ptrj);
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
      var width;
      if (!(width = getPtriFloat32(this + VIEWPORT_WITDH))) {
        return self.innerWidth || 320;
      }
      return width;
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
      if (!getPtriFloat32(this + VIEWPORT_HEIGHT)) {
        return self.innerHeight || 240;
      }
      return height;
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

//? <------->
for (name in classes) {
  Class = classes[name];
  prop = name[0].toLowerCase() + name.substring(1);
  define(storage.add(Class), {
    [prop]: {
      value: Class
    }
  });
  for (name in Object.getOwnPropertyDescriptors(Class.prototype)) {
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

//? <------->
warn(rc = new_Pointer(RenderingContext));

warn(vp = new_Pointer(Viewport));

warn(p0 = Program.from({
  vertexShader: "hello world vs"
}));

warn(p1 = Program.from([
  {
    fragmentShader: "hello world fs"
  },
  {
    vertexShader: "hello world vs"
  }
]));

warn("p0.add p1:", p0.add(p1));

warn("rc.add vp:", p1.add(vp));

warn("p0.append p1:", p0.append(p1));

warn("rc.append p0:", rc.append(p0));

warn("rc:", rc);

warn("rc.viewport:", rc.viewport);

warn("p0.findChild:", findChild(p0, Viewport, true));

warn("rc.glObject:", rc.glObject);
