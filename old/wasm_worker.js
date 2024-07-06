var Calculation, Color, DrawBuffer, DrawBufferAllocation, DrawCall, FragmentShaderSource, HTMLCanvasElement, HTMLDocument, HTMLElement, Matrix, Mesh, Modifier, Pointer, Position, Program, Property, RADIAN_TO_DEGREE, RenderingContext, Rotation, Scale, ShaderAttribute, ShaderCompilation, ShaderUniform, ShaderVertexArray, Vector, VertexShaderSource, Vertices, assign, buffer, classes, debug, decode, document, dvw, error, getByteLength, getHeader, getLink, getParent, getType, getter, i, iLE, info, init, isPointer, isUpdated, isUploaded, log, malloc, memory, nextChild, oninit, oninstantiate, onmessage, setHeader, setIsUpdated, setIsUploaded, setLink, setParent, setType, setter, table, vecprops, warn;

({log, warn, error, table, debug, info} = console);

[
  document = null,
  assign = Object.assign,
  buffer = null,
  decode = TextDecoder.prototype.decode.bind(new TextDecoder),
  dvw = null,
  ({memory,
  init,
  malloc,
  isPointer,
  nextChild,
  getByteLength,
  setHeader,
  setType,
  setParent,
  setLink,
  setIsUpdated,
  setIsUploaded,
  getHeader,
  getType,
  getParent,
  getLink,
  isUpdated,
  isUploaded} = {}),
  iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1,
  RADIAN_TO_DEGREE = Math.PI / 180,
  classes = [
    Object.getPrototypeOf(Number),
    Pointer = class Pointer extends Number {},
    Property = class Property extends Pointer {},
    RenderingContext = class RenderingContext extends Pointer {},
    Program = class Program extends Pointer {},
    VertexShaderSource = class VertexShaderSource extends Pointer {},
    FragmentShaderSource = class FragmentShaderSource extends Pointer {},
    ShaderCompilation = class ShaderCompilation extends Pointer {},
    ShaderAttribute = class ShaderAttribute extends Pointer {},
    ShaderUniform = class ShaderUniform extends Pointer {},
    ShaderVertexArray = class ShaderVertexArray extends Pointer {},
    DrawBuffer = class DrawBuffer extends Pointer {},
    DrawBufferAllocation = class DrawBufferAllocation extends Pointer {},
    DrawCall = class DrawCall extends Pointer {},
    Mesh = class Mesh extends Pointer {},
    Position = class Position extends Pointer {},
    Rotation = class Rotation extends Pointer {},
    Scale = class Scale extends Pointer {},
    Color = class Color extends Pointer {},
    Matrix = class Matrix extends Pointer {},
    Modifier = class Modifier extends Pointer {},
    Vector = class Vector extends Pointer {},
    Vertices = class Vertices extends Pointer {},
    Calculation = class Calculation extends Pointer {},
    HTMLElement = class HTMLElement extends Pointer {},
    HTMLDocument = class HTMLDocument extends HTMLElement {},
    HTMLCanvasElement = class HTMLCanvasElement extends HTMLElement {},
    Object.defineProperty(Pointer,
    "type",
    {
      value: i = 1
    }),
    Object.defineProperty(Property,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(RenderingContext,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Program,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(VertexShaderSource,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(FragmentShaderSource,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(ShaderCompilation,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(ShaderAttribute,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(ShaderUniform,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(ShaderVertexArray,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(DrawBuffer,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(DrawBufferAllocation,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(DrawCall,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Mesh,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Position,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Rotation,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Scale,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Color,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Matrix,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Vector,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Vertices,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Modifier,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Calculation,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(HTMLElement,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(HTMLDocument,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(HTMLCanvasElement,
    "type",
    {
      value: ++i
    }),
    Object.defineProperty(Mesh,
    "length",
    {
      value: 48
    }),
    Object.defineProperty(Matrix,
    "length",
    {
      value: 16
    }),
    Object.defineProperty(Modifier,
    "length",
    {
      value: 8
    }),
    Object.defineProperty(Vector,
    "length",
    {
      value: 4
    }),
    Object.defineProperty(Position,
    "length",
    {
      value: 4
    }),
    Object.defineProperty(Rotation,
    "length",
    {
      value: 4
    }),
    Object.defineProperty(Scale,
    "length",
    {
      value: 4
    }),
    Object.defineProperty(Color,
    "length",
    {
      value: 4
    }),
    Object.defineProperty(HTMLDocument,
    "length",
    {
      value: 4 * 0xfff
    }),
    Object.defineProperty(HTMLCanvasElement,
    "length",
    {
      value: 4 * 0xff
    })
  ],
  getter = {
    f32: function() {
      return new Float32Array(buffer,
  this,
  getByteLength(this) / 4);
    }
  },
  setter = {
    f32: function() {
      return getter.f32.call(this).set(...arguments);
    }
  }
];

Object.defineProperties(Pointer, {
  byteLength: {
    get: function() {
      var length, parent;
      length = 0;
      parent = this;
      while (Number !== parent) {
        length += parent.length;
        parent = Object.getPrototypeOf(parent);
      }
      return length * 4;
    }
  }
});

Object.defineProperties(Pointer, {
  of: {
    value: function(ptri) {
      return ptri && new classes[getType(ptri)](ptri);
    }
  }
});

Object.defineProperties(Scale, {
  default: {
    value: Float32Array.of(1, 1, 1).buffer
  }
});

Object.defineProperties(Color, {
  default: {
    value: Float32Array.of(0, 0, 0, 1).buffer
  }
});

Object.defineProperties(Pointer, {
  malloc: {
    get: function() {
      var This, def, ptri;
      ptri = 0;
      This = this;
      if (this.byteLength) {
        ptri = new this(malloc(this.byteLength, this.type));
        if (def = this.default) {
          new Uint8Array(buffer).set(new Uint8Array(def), ptri);
        }
      }
      return function(byteLength) {
        if (ptri && byteLength) {
          throw /MALLOC_ERROR/;
        }
        if (!ptri) {
          ptri = new This(malloc(byteLength, This.type));
          if (def = This.default) {
            new Uint8Array(buffer).set(new Uint8Array(def), ptri);
          }
        }
        return ptri;
      };
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  ["{{Pointer}}"]: {
    get: function() {
      var byteLength, i32, iterLength, iterOffset, linkedi, nextOffset, parent, rest, state, type;
      [nextOffset, byteLength, type, state, parent, linkedi, isUpdated, isUploaded, iterOffset, iterLength, ...rest] = i32 = new Int32Array(buffer, this - 64, 16);
      return {
        nextOffset,
        byteLength,
        type,
        state,
        parent,
        linkedi,
        iterOffset,
        iterLength,
        rest,
        i32,
        parent: this.getParent(this),
        islinked: !!getLink(this),
        link: this.getLinked(this),
        storage: this.storage,
        needsUpdate: !isUpdated,
        needsUpload: !isUploaded
      };
    }
  },
  [Symbol.iterator]: {
    value: function(prev = 0) {
      var next, ptri;
      next = +prev;
      ptri = +this;
      return Iterator.from({
        next: function() {
          if (!(next = nextChild(ptri, next))) {
            return {
              done: true
            };
          }
          return {
            value: Pointer.of(next)
          };
        }
      });
    }
  },
  storage: {
    value: [0]
  },
  buffer: {
    get: function() {
      return buffer.slice(this, this + getByteLength(this));
    }
  },
  getParent: {
    value: function() {
      return Pointer.of(getParent(this));
    }
  },
  setParent: {
    value: function() {
      setParent(this, arguments[0]);
      return this;
    }
  },
  getLinked: {
    value: function() {
      if (0 < (i = getLink(this))) {
        return Pointer.of(i);
      }
      return this.storage[-i];
    }
  },
  setLinked: {
    value: function(any) {
      log(any);
      if (!(any instanceof Pointer) && !isPointer(any)) {
        if (-1 === (i = this.storage.indexOf(any))) {
          i += this.storage.push(any);
        }
        any = -i;
      }
      setLink(this, any);
      return any;
    }
  },
  getState: {
    value: function() {
      return getState(this);
    }
  },
  setState: {
    value: function() {
      setState(this, arguments[0]);
      return this;
    }
  },
  parent: {
    get: function() {
      return Pointer.of(getParent(this));
    }
  },
  children: {
    get: function() {
      var children, ref;
      children = [];
      ref = this;
      for (i of ref) {
        children.push(i);
      }
      return children;
    }
  }
});

Object.defineProperties(Color.prototype, {
  normalized: {
    enumerable: true,
    get: function() {
      return new Float32Array(buffer, this, 4);
    }
  },
  asObject: {
    get: function() {
      return {
        red: dvw.getFloat32(this, iLE),
        green: dvw.getFloat32(this + 4, iLE),
        blue: dvw.getFloat32(this + 8, iLE),
        alpha: dvw.getFloat32(this + 12, iLE)
      };
    }
  },
  asArray: {
    get: function() {
      return Array.of(Math.floor(0xff * dvw.getFloat32(this, iLE)), Math.floor(0xff * dvw.getFloat32(this + 4, iLE)), Math.floor(0xff * dvw.getFloat32(this + 8, iLE)), Math.floor(0xff * dvw.getFloat32(this + 12, iLE)));
    }
  },
  asString: {
    get: function() {
      return "0x" + [...this.asArray].map(function(v) {
        return v.toString(16).padStart(2, 0);
      }).join("");
    }
  },
  asNumber: {
    get: function() {
      return parseInt(this.asString);
    }
  },
  children: {
    value: []
  }
});

Object.defineProperties(Vector.prototype, vecprops = {
  x: {
    enumerable: true,
    get: function() {
      return dvw.getFloat32(this, iLE);
    },
    set: function() {
      return dvw.setFloat32(this, arguments[0], iLE);
    }
  },
  y: {
    enumerable: true,
    get: function() {
      return dvw.getFloat32(this + 4, iLE);
    },
    set: function() {
      return dvw.setFloat32(this + 4, arguments[0], iLE);
    }
  },
  z: {
    enumerable: true,
    get: function() {
      return dvw.getFloat32(this + 8, iLE);
    },
    set: function() {
      return dvw.setFloat32(this + 8, arguments[0], iLE);
    }
  },
  resvf32: {
    get: function() {
      return dvw.getFloat32(this + 12, iLE);
    },
    set: function() {
      return dvw.setFloat32(this + 12, arguments[0], iLE);
    }
  },
  children: {
    value: []
  },
  length: {
    value: 3
  },
  vecLength: {
    get: function() {
      var byteLength, byteOffset, length, sum, val;
      sum = 0;
      byteLength = getByteLength(this);
      byteOffset = this + byteLength;
      length = byteLength / 4;
      while (length--) {
        if (val = dvw.getFloat32(byteOffset -= 4, iLE)) {
          sum = sum + Math.pow(val, 2);
        }
      }
      return Math.sqrt(sum);
    }
  },
  set: {
    value: setter.f32
  }
});

Object.defineProperties(Position.prototype, vecprops);

Object.defineProperties(Rotation.prototype, vecprops);

Object.defineProperties(Scale.prototype, vecprops);

Object.defineProperties(Mesh.prototype, {
  // inner allocations 
  offset: {
    value: {
      matrix: 4,
      position: 8,
      rotation: 12,
      scale: 16,
      color: 20,
      vertices: 24
    }
  },
  // check but not create
  getPosition: {
    value: function() {
      return dvw.getInt32(this + this.offset.position, iLE);
    }
  },
  getRotation: {
    value: function() {
      return dvw.getInt32(this + this.offset.rotation, iLE);
    }
  },
  getScale: {
    value: function() {
      return dvw.getInt32(this + this.offset.scale, iLE);
    }
  },
  getColor: {
    value: function() {
      return dvw.getInt32(this + this.offset.color, iLE);
    }
  },
  getVertices: {
    value: function() {
      return dvw.getInt32(this + this.offset.vertices, iLE);
    }
  },
  // check and create if has not
  position: {
    enumerable: true,
    get: function() {
      var ptri;
      if (!(ptri = this.getPosition())) {
        return this.position = new Position.malloc();
      }
      return new Position(ptri);
    },
    set: function(ptri) {
      dvw.setInt32(this + this.offset.position, ptri, iLE);
      return ptri;
    }
  },
  rotation: {
    enumerable: true,
    get: function() {
      var ptri;
      if (!(ptri = this.getRotation())) {
        return this.rotation = new Rotation.malloc();
      }
      return new Rotation(ptri);
    },
    set: function(ptri) {
      dvw.setInt32(this + this.offset.rotation, ptri, iLE);
      return ptri;
    }
  },
  scale: {
    enumerable: true,
    get: function() {
      var ptri;
      if (!(ptri = this.getScale())) {
        return this.scale = new Scale.malloc();
      }
      return new Scale(ptri);
    },
    set: function(ptri) {
      dvw.setInt32(this + this.offset.scale, ptri, iLE);
      return ptri;
    }
  },
  color: {
    enumerable: true,
    get: function() {
      var ptri;
      if (!(ptri = this.getColor())) {
        return this.color = new Color.malloc();
      }
      return new Color(ptri);
    },
    set: function(ptri) {
      dvw.setInt32(this + this.offset.color, ptri, iLE);
      return ptri;
    }
  },
  vertices: {
    enumerable: true,
    get: function() {
      var ptri;
      if (!(ptri = this.getVertices())) {
        return null;
      }
      return new Vertices(ptri);
    },
    set: function(ptri) {
      dvw.setInt32(this + this.offset.vertices, ptri, iLE);
      return ptri;
    }
  }
});

Object.defineProperties(Vertices.prototype, {
  vertexArray: {
    enumerable: true,
    get: getter.f32
  },
  length: {
    enumerable: true,
    get: function() {
      return getByteLength(this) / 4;
    }
  },
  pointsCount: {
    enumerable: true,
    get: function() {
      return getByteLength(this) / 12;
    }
  },
  set: {
    value: setter.f32
  }
});

Object.defineProperties(Modifier.prototype, {
  children: {
    value: []
  },
  multer: {
    get: function() {
      return new Float32Array(buffer, this, 4);
    },
    set: function() {
      this.multer.set(...arguments);
      return this;
    }
  },
  summer: {
    get: function() {
      return new Float32Array(buffer, this + 16, 4);
    },
    set: function() {
      this.summer.set(...arguments);
      return this;
    }
  },
  include: {
    value: function(ptri) {
      var _f32, rw, rx, ry, rz, sw, sx, sy, sz, tw, tx, ty, tz, wM, wS, xM, xS, yM, yS, zM, zS;
      [xM, yM, zM, wM, xS, yS, zS, wS] = _f32 = new Float32Array(buffer, this, 8);
      while (ptri) {
        [tx, ty, tz, tw] = getter.f32.call(ptri.position);
        [rx, ry, rz, rw] = getter.f32.call(ptri.rotation);
        [sx, sy, sz, sw] = getter.f32.call(ptri.scale);
        _f32.set([rx * sx * xM, ry * sy * yM, rz * sz * zM, rw * sw * wM, tx * sx + xS, ty * sy + yS, tz * sz + zS, tw * sw + wS]);
        ptri = ptri.parent;
      }
      return this;
    }
  },
  apply: {
    value: function(ptri, ptrout, dim = 3) {
      var MUL, byteLength, byteOffset, mulOffset, offset, summ, summOffset, value, valueOffset;
      byteOffset = ptrout || ptri;
      byteLength = getByteLength(ptri);
      //  [ .., y, x ]          
      //       [ ..., 2, 1, 0 ]
      while (dim-- && (offset = byteLength)) {
        mulOffset = this + (dim * 4);
        summOffset = mulOffset + 16; // 4*4
        MUL = dvw.getFloat32(mulOffset, iLE);
        summ = dvw.getFloat32(summOffset, iLE);
        warn("mulOffset:", mulOffset, ":", MUL, "&&", "summOffset:", summOffset, ":", summ);
        while (offset -= 4) {
          valueOffset = ptri + offset;
          value = dvw.getFloat32(valueOffset, iLE);
          warn("\tvalueOffset:", valueOffset, ":", value, "->", "byteOffset:", byteOffset + offset, ":", (value * MUL) + summ);
          dvw.setFloat32(byteOffset + offset, (value * MUL) + summ, iLE);
        }
      }
      return ptrout || ptri;
    }
  }
});

Object.defineProperties(Rotation.prototype, {
  asRatians: {
    get: function() {
      return new Float32Array(buffer, this, 3);
    }
  },
  asDegrees: {
    get: function() {
      return this.asRatians.map(function(v) {
        return v / RADIAN_TO_DEGREE;
      });
    }
  }
});

Object.defineProperties(HTMLElement.prototype, {
  slotref: {
    enumerable: true,
    get: function() {
      return getLink(this);
    },
    set: function() {
      return setLink(this, arguments[0]);
    }
  },
  read: {
    enumerable: true,
    value: function() {
      return JSON.parse(decode(this.byteArray.slice(4, 4 + dvw.getInt32(this, iLE))));
    }
  },
  lock: {
    value: function() {
      return Atomics.wait(new Int32Array(buffer, this, 1));
    }
  },
  byteArray: {
    get: function() {
      return new Uint8Array(buffer, this, getByteLength(this));
    }
  },
  call: {
    value: function(chain, ...args) {
      this.lock(postMessage({byteArray: this.byteArray, args, chain}));
      return this.read();
    }
  }
});

Object.defineProperties(HTMLDocument.prototype, {
  name: {
    value: "document"
  },
  TagElement: {
    value: {
      canvas: HTMLCanvasElement
    }
  },
  createElement: {
    value: function(tagName) {
      var Element, element, slotref;
      slotref = this.call("document.createElement", tagName);
      Element = this.TagElement[tagName] || HTMLElement;
      element = new Element.malloc();
      setParent(element, this);
      return assign(element, {slotref});
    }
  }
});

Object.defineProperties(HTMLCanvasElement.prototype, {
  tagName: {
    value: "canvas"
  },
  baseURI: {
    get: function() {
      return this.call(`$${this.slotref}.baseURI`);
    }
  }
});

oninit = function() {
  var a, canvas;
  document = new HTMLDocument.malloc();
  canvas = document.createElement("canvas");
  log(canvas);
  return a = async function() {
    var adapter, commandEncoder, device, passEncoder, renderPassDescriptor, vertexBuffer, vertices;
    adapter = (await navigator.gpu.requestAdapter());
    device = (await adapter.requestDevice());
    commandEncoder = device.createCommandEncoder();
    renderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: Float32Array.of(1,
        1,
        1,
        1),
          loadOp: "clear",
          storeOp: "store",
          view: context.getCurrentTexture().createView()
        }
      ]
    };
    passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(renderPipeline);
    vertices = new Float32Array([0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1, 0, 0, 1, 1]);
    vertexBuffer = device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(3);
    passEncoder.end();
    device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);
    return device.queue.submit([commandEncoder.finish()]);
  };
};

oninstantiate = function({
    exports: wasm
  }) {
  var mesh, mesh2, mesh3, mod, out;
  ({memory, malloc, isPointer, nextChild, getByteLength, setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded, getHeader, getType, getParent, getLink, isUpdated, isUploaded} = wasm);
  dvw = new DataView(buffer = memory.buffer);
  mesh = new Mesh.malloc();
  mesh2 = new Mesh.malloc();
  mesh3 = new Mesh.malloc();
  mesh.position.set([1, 0, -5]);
  mesh.rotation.set([1.1, 0.4, 1.57]);
  mesh2.position.set([1, 0, -5]);
  mesh2.scale.set([1.1, 1, 1]);
  mesh3.position.set([1, 0, -5]);
  mesh3.rotation.set([.1, 0, -.5]);
  mesh3.scale.set([2, 2, 2]);
  mesh.vertices = new Vertices.malloc(3 * 3 * 4);
  mesh.vertices.set([1, 0, 0, -1, 0, 0, 0, 1.7, 0]);
  setParent(mesh, mesh2);
  setParent(mesh2, mesh3);
  log(mesh3);
  log(mod = new Modifier.malloc());
  mod.include(mesh);
  log(...getter.f32.call(mod));
  out = new Vertices.malloc(3 * 3 * 4);
  //log mod.apply(
  //    mesh.vertices, out, 3
  //)
  return oninit();
};

onmessage = function({data}) {
  switch (true) {
    case data instanceof WebAssembly.Module:
      return WebAssembly.instantiate(data, {
        console: {
          log,
          warn,
          error,
          memdump: function(byteOffset, byteLength, typeId) {
            return warn("-->", {
              byteOffset,
              byteLength,
              typeId,
              i32: new Int32Array(buffer, byteOffset, byteLength / 4),
              headers: new Int32Array(buffer, byteOffset - 64, 16)
            });
          }
        }
      }).then(oninstantiate);
    default:
      /*
      postQueue = [,]
      postMessage = ( ( send ) -> ( packet ) -> send assign(
      packet, { done : -1 + postQueue.push packet.done }
      )).call( this, postMessage )
      when ( data.type is "response" )
      postQueue.splice( data.done, 1 )[0]( data.data )
      */
      throw data;
  }
};
