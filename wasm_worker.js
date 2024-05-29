var Calculation, Color, DrawBuffer, DrawBufferAllocation, DrawCall, FragmentShaderSource, Matrix, Mesh, Pointer, Position, Program, Property, RenderingContext, Rotation, Scale, ShaderAttribute, ShaderCompilation, ShaderUniform, ShaderVertexArray, Vector, VertexShaderSource, Vertices, buffer, classes, dataView, debug, error, i, iLE, info, log, malloc, onmessage, storage, table, warn;

({log, warn, error, table, debug, info} = console);

buffer = null;

storage = [null];

dataView = null;

malloc = null;

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

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

Object.defineProperty(Pointer, "malloc", {
  get: function() {
    var ptri;
    ptri = new this(malloc(this.byteLength, this.type));
    return function(extras) {
      return ptri;
    };
  }
});

Object.defineProperty(Pointer.prototype, "{{Buffer}}", {
  get: function() {
    return new Uint8Array(buffer, this, this.constructor.byteLength);
  }
});

onmessage = function(e) {
  return WebAssembly.instantiate(e.data, {
    console: {
      log,
      warn,
      error,
      memdump: function(byteOffset, byteLength, typeId) {
        warn({
          byteOffset,
          byteLength,
          typeId,
          i32: new Int32Array(buffer, byteOffset, byteLength / 4),
          headers: new Int32Array(buffer, byteOffset - 12, 3)
        });
        return log("\n\n");
      }
    }
  }).then(function({exports}) {
    var init, memory, mesh, position, relate;
    ({memory, init, malloc, relate} = exports);
    buffer = memory.buffer;
    dataView = new DataView(buffer);
    mesh = new Mesh.malloc();
    position = new Position.malloc();
    relate(position, mesh, -1);
    log(mesh);
    log(position);
    return init();
  });
};
