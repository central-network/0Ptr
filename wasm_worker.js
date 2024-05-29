var Calculation, Color, DrawBuffer, DrawBufferAllocation, DrawCall, FragmentShaderSource, Matrix, Mesh, Pointer, Position, Program, Property, RenderingContext, Rotation, Scale, ShaderAttribute, ShaderCompilation, ShaderUniform, ShaderVertexArray, Vector, VertexShaderSource, Vertices, buffer, classes, dataView, debug, error, getHeader, getLink, getParent, getType, i, iLE, info, init, isPointer, isUpdated, isUploaded, log, malloc, memory, nextChild, onmessage, setHeader, setIsUpdated, setIsUploaded, setLink, setParent, setType, table, warn;

({log, warn, error, table, debug, info} = console);

[buffer = null, dataView = null, ({memory, init, malloc, isPointer, nextChild, setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded, getHeader, getType, getParent, getLink, isUpdated, isUploaded} = {}), iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1];

classes = [Object.getPrototypeOf(Number), Pointer = class Pointer extends Number {}, Property = class Property extends Pointer {}, RenderingContext = class RenderingContext extends Pointer {}, Program = class Program extends Pointer {}, VertexShaderSource = class VertexShaderSource extends Pointer {}, FragmentShaderSource = class FragmentShaderSource extends Pointer {}, ShaderCompilation = class ShaderCompilation extends Pointer {}, ShaderAttribute = class ShaderAttribute extends Pointer {}, ShaderUniform = class ShaderUniform extends Pointer {}, ShaderVertexArray = class ShaderVertexArray extends Pointer {}, DrawBuffer = class DrawBuffer extends Pointer {}, DrawBufferAllocation = class DrawBufferAllocation extends Pointer {}, DrawCall = class DrawCall extends Pointer {}, Mesh = class Mesh extends Pointer {}, Position = class Position extends Pointer {}, Rotation = class Rotation extends Pointer {}, Scale = class Scale extends Pointer {}, Color = class Color extends Pointer {}, Matrix = class Matrix extends Pointer {}, Vector = class Vector extends Pointer {}, Vertices = class Vertices extends Pointer {}, Calculation = class Calculation extends Pointer {}];

Object.defineProperty(Pointer, "type", {
  value: i = 1
});

Object.defineProperty(Property, "type", {
  value: ++i
});

Object.defineProperty(RenderingContext, "type", {
  value: ++i
});

Object.defineProperty(Program, "type", {
  value: ++i
});

Object.defineProperty(VertexShaderSource, "type", {
  value: ++i
});

Object.defineProperty(FragmentShaderSource, "type", {
  value: ++i
});

Object.defineProperty(ShaderCompilation, "type", {
  value: ++i
});

Object.defineProperty(ShaderAttribute, "type", {
  value: ++i
});

Object.defineProperty(ShaderUniform, "type", {
  value: ++i
});

Object.defineProperty(ShaderVertexArray, "type", {
  value: ++i
});

Object.defineProperty(DrawBuffer, "type", {
  value: ++i
});

Object.defineProperty(DrawBufferAllocation, "type", {
  value: ++i
});

Object.defineProperty(DrawCall, "type", {
  value: ++i
});

Object.defineProperty(Mesh, "type", {
  value: ++i
});

Object.defineProperty(Position, "type", {
  value: ++i
});

Object.defineProperty(Rotation, "type", {
  value: ++i
});

Object.defineProperty(Scale, "type", {
  value: ++i
});

Object.defineProperty(Color, "type", {
  value: ++i
});

Object.defineProperty(Matrix, "type", {
  value: ++i
});

Object.defineProperty(Vector, "type", {
  value: ++i
});

Object.defineProperty(Vertices, "type", {
  value: ++i
});

Object.defineProperty(Calculation, "type", {
  value: ++i
});

Object.defineProperty(Mesh, "length", {
  value: 48
});

Object.defineProperty(Position, "length", {
  value: 3
});

Object.defineProperty(Pointer, "byteLength", {
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
});

Object.defineProperty(Pointer, "of", {
  value: function(ptri) {
    return ptri && new classes[getType(ptri)](ptri);
  }
});

Object.defineProperty(Pointer, "malloc", {
  get: function() {
    var ptri;
    ptri = new this(malloc(this.byteLength, this.type));
    return function(extras) {
      return ptri;
    };
  }
});

Object.defineProperty(Pointer.prototype, "{{Pointer}}", {
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
});

Object.defineProperties(Pointer.prototype, {
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
  setLink: {
    value: function(any) {
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

onmessage = function(e) {
  return WebAssembly.instantiate(e.data, {
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
  }).then(function({
      exports: wasm
    }) {
    var mesh, mesh2, mesh3, mesh4, mesh5, position, position2, position3, position4, position5;
    ({memory, init, malloc, isPointer, nextChild, setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded, getHeader, getType, getParent, getLink, isUpdated, isUploaded} = wasm);
    buffer = memory.buffer;
    dataView = new DataView(buffer);
    mesh = new Mesh.malloc();
    position = new Position.malloc();
    mesh2 = new Mesh.malloc();
    position2 = new Position.malloc();
    mesh3 = new Mesh.malloc();
    position3 = new Position.malloc();
    mesh4 = new Mesh.malloc();
    position4 = new Position.malloc();
    mesh5 = new Mesh.malloc();
    position5 = new Position.malloc();
    position.setLink(new OffscreenCanvas(1, 1));
    mesh.setLink(new OffscreenCanvas(1, 1));
    position.setLink(mesh.getLinked());
    setParent(position, mesh);
    setParent(position2, mesh);
    setParent(position3, mesh);
    log(mesh, position, position2, position3);
    return init();
  });
};
