self.name = "window";

(self.init = function() {
  var ATTRIBS_BYTELENGTH, ATTRIBS_LENGTH, BYTELENGTH_GLBUFFER, Color, Frustrum, GLDraw, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_CLASSID, HINDEX_ISGL, HINDEX_ITER_COUNT, HINDEX_LENGTH, HINDEX_LOCATED, HINDEX_NEXT_COLORI, HINDEX_NEXT_VERTEXI, HINDEX_PAINTED, HINDEX_PARENT, HINDEX_PTRI, HINDEX_UPDATED, INNER_HEIGHT, INNER_WIDTH, LE, Matrix4, OFFSET_CPU, OFFSET_GPU, OFFSET_PTR, Pointer, Position, RADIANS_PER_DEGREE, RATIO_ASPECT, RATIO_PIXEL, Rotation, STATE_LOCKED, STATE_READY, STATE_UNLOCKED, STATE_WORKING, Scale, Shape, Space, THREADS_BEGIN, THREADS_COUNT, THREADS_NULL, THREADS_READY, THREADS_STATE, Vertices, buffer, classes, defines, draws, dvw, error, f32, fShader, frustrum, gBuffer, gl, isThread, isWindow, lock, log, malloc, nextTick, number, pipe, program, ptri32, scripts, shaders, space, state, threadId, ticks, u32, ui8, unlock, uuid, vShader, warn, workers;
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
  ptri32 = null;
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
  ticks = 0;
  frustrum = null;
  RADIANS_PER_DEGREE = Math.PI / 180.0;
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
  HINDEX_PTRI = HINDEX_LENGTH++;
  HINDEX_BYTEOFFSET = HINDEX_LENGTH++;
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
  ATTRIBS_LENGTH = 0;
  ATTRIBS_BYTELENGTH = 0;
  state = function(state) {
    if (!arguments.length) {
      return Atomics.load(ptri32, threadId);
    }
    return Atomics.store(ptri32, threadId, state);
  };
  nextTick = function() {
    var begin, color, count, draw, end, index, j, len, locate, paint, ptri, ref, shape, test, vertex;
    //log "nextTick:", ++ticks
    ptri = Atomics.load(ptri32, 1);
    test = 0;
    while (OFFSET_PTR <= (ptri -= 16)) {
      if (!Atomics.load(ptri32, ptri + HINDEX_ISGL)) {
        continue;
      }
      if (Atomics.load(ptri32, ptri + HINDEX_UPDATED)) {
        continue;
      }
      locate = Atomics.load(ptri32, ptri + HINDEX_LOCATED);
      paint = Atomics.load(ptri32, ptri + HINDEX_PAINTED);
      if (paint && locate) {
        continue;
      }
      test = 1;
      index = Atomics.add(ptri32, ptri + HINDEX_NEXT_VERTEXI, 1);
      count = Atomics.load(ptri32, ptri + HINDEX_ITER_COUNT);
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
          Atomics.store(ptri32, draw.ptri + HINDEX_UPDATED, 0);
          draw.needsUpload = 1;
        }
      }
      if (index - count) {
        
        //log ptri, index 
        continue;
      }
      if (!locate) {
        Atomics.store(ptri32, ptri + HINDEX_LOCATED, 1);
      }
      if (!paint) {
        Atomics.store(ptri32, ptri + HINDEX_PAINTED, 1);
      }
      Atomics.store(ptri32, ptri + HINDEX_UPDATED, 1);
    }
    if (test === 1) {
      return nextTick();
    }
    lock();
    return nextTick();
  };
  lock = function() {
    state(STATE_LOCKED);
    return Atomics.wait(ptri32, threadId);
  };
  unlock = function() {
    var j, len, results, w;
    results = [];
    for (j = 0, len = workers.length; j < len; j++) {
      w = workers[j];
      if (!(w.state === STATE_LOCKED)) {
        continue;
      }
      Atomics.store(ptri32, w.threadId, STATE_READY);
      results.push(Atomics.notify(ptri32, w.threadId, 1));
    }
    return results;
  };
  if (isWindow) {
    buffer = new SharedArrayBuffer(1e8);
    ptri32 = new Int32Array(buffer);
    u32 = new Uint32Array(buffer);
    f32 = new Float32Array(buffer);
    dvw = new DataView(buffer);
    ui8 = new Uint8Array(buffer);
    scripts = Array.from(document.querySelectorAll("script"));
    state = function(state) {
      if (!state) {
        return Atomics.load(ptri32, THREADS_STATE);
      }
      return Atomics.store(ptri32, THREADS_STATE, state);
    };
    Atomics.add(ptri32, 0, OFFSET_CPU);
    Atomics.add(ptri32, 1, OFFSET_PTR);
    Atomics.add(ptri32, 2, OFFSET_GPU);
    state(THREADS_NULL);
  }
  malloc = function(constructor, byteLength) {
    var BYTES_PER_ELEMENT, allocLength, begin, byteOffset, classId, length, ptri;
    BYTES_PER_ELEMENT = constructor.TypedArray.BYTES_PER_ELEMENT || constructor.BYTES_PER_ELEMENT;
    classId = constructor.classId;
    if (!byteLength) {
      byteLength = constructor.byteLength;
    }
    length = (allocLength = byteLength) / BYTES_PER_ELEMENT;
    byteLength += 8 - (byteLength % 8);
    ptri = Atomics.add(ptri32, 1, 16);
    byteOffset = Atomics.add(ptri32, 0, byteLength);
    Atomics.add(ptri32, 0, 8 - (byteLength % 8));
    begin = byteOffset / BYTES_PER_ELEMENT;
    Atomics.store(ptri32, ptri + HINDEX_PTRI, ptri);
    Atomics.store(ptri32, ptri + HINDEX_BYTEOFFSET, byteOffset);
    Atomics.store(ptri32, ptri + HINDEX_BYTELENGTH, allocLength);
    Atomics.store(ptri32, ptri + HINDEX_CLASSID, classId);
    Atomics.store(ptri32, ptri + HINDEX_LENGTH, length);
    Atomics.store(ptri32, ptri + HINDEX_BEGIN, begin);
    return ptri;
  };
  self.emit = function(event, detail) {
    return self.dispatchEvent(new CustomEvent(event, {detail}));
  };
  pipe.emit = function(event, detail) {
    return this.postMessage(event);
  };
  Pointer = (function() {
    class Pointer extends Number {
      static allocs(parent) {
        var classId, object, ptri, results;
        ptri = Atomics.load(ptri32, 1);
        classId = this.classId;
        results = [];
        while (OFFSET_PTR <= (ptri -= 16)) {
          if (classId !== Atomics.load(ptri32, ptri + HINDEX_CLASSID)) {
            continue;
          }
          if (parent && parent !== Atomics.load(ptri32, ptri + HINDEX_PARENT)) {
            continue;
          }
          results.push(object = new this(ptri));
        }
        return results;
      }

      static malloc(constructor, byteLength) {
        var mod, offset;
        this.classId;
        offset = this.byteLength;
        mod = offset % 4;
        offset += 4 - mod;
        if (byteLength == null) {
          byteLength = constructor.byteLength;
        }
        byteLength += 4 - byteLength % 4;
        this.subclasses.push({
          constructor: constructor,
          offset: offset,
          byteLength: byteLength,
          index: this.subclasses.length,
          classId: constructor.classId
        });
        Object.defineProperty(this.prototype, constructor.label, {
          get: constructor.prototype.get(offset),
          set: constructor.prototype.set(offset)
        });
        this.byteLength += byteLength;
        return offset;
      }

      constructor(ptri) {
        if (!parseInt(super(ptri))) {
          return new this.constructor(malloc(this.constructor));
        }
        this.init(ptri);
      }

      set(value, index = 0) {
        this.typedArray.set(value, index);
        return this;
      }

      init() {
        return this;
      }

      subarray(begin, end) {
        return new this.constructor.TypedArray(buffer, this.byteOffset + begin * 4, end - begin);
      }

    };

    Pointer.byteLength = 0;

    Pointer.subclasses = [];

    Pointer.TypedArray = Float32Array;

    Object.defineProperty(Pointer, "classId", {
      configurable: true,
      get: function() {
        return Object.defineProperty(this, "classId", {
          value: classes.push(this) - 1
        }).classId;
      }
    });

    Object.defineProperty(Pointer.prototype, "byteOffset", {
      get: function() {
        return Atomics.load(ptri32, this.ptri + HINDEX_BYTEOFFSET);
      }
    });

    Object.defineProperty(Pointer.prototype, "byteLength", {
      get: function() {
        return Atomics.load(ptri32, this.ptri + HINDEX_BYTELENGTH);
      }
    });

    Object.defineProperty(Pointer.prototype, "length", {
      get: function() {
        return Atomics.load(ptri32, this.ptri + HINDEX_LENGTH);
      }
    });

    Object.defineProperty(Pointer.prototype, "ptri", {
      get: function() {
        return Atomics.load(ptri32, parseInt(this));
      }
    });

    Object.defineProperty(Pointer.prototype, "begin", {
      get: function() {
        return Atomics.load(ptri32, this.ptri + HINDEX_BEGIN);
      }
    });

    Object.defineProperty(Pointer.prototype, "isGL", {
      get: function() {
        return Atomics.load(ptri32, this.ptri + HINDEX_ISGL);
      },
      set: function(v) {
        return Atomics.store(ptri32, this.ptri + HINDEX_ISGL, v);
      }
    });

    Object.defineProperty(Pointer.prototype, "parent", {
      get: function() {
        return Atomics.load(ptri32, this.ptri + HINDEX_PARENT);
      },
      set: function(v) {
        return Atomics.store(ptri32, this.ptri + HINDEX_PARENT, v);
      }
    });

    Object.defineProperty(Pointer.prototype, "children", {
      get: function() {
        var children, classId, ptri, test;
        ptri = Atomics.load(ptri32, 1);
        test = this.ptri;
        children = [];
        while (OFFSET_PTR <= (ptri -= 16)) {
          if (!(test - Atomics.load(ptri32, ptri + HINDEX_PARENT))) {
            classId = Atomics.load(ptri32, ptri + HINDEX_CLASSID);
            children.push(new classes[classId](ptri));
          }
        }
        return children;
      }
    });

    Object.defineProperty(Pointer.prototype, "iterCount", {
      get: function() {
        return Atomics.load(u32, this.ptri + HINDEX_ITER_COUNT);
      },
      set: function(v) {
        return Atomics.store(u32, this.ptri + HINDEX_ITER_COUNT, v);
      }
    });

    Object.defineProperty(Pointer.prototype, "typedArray", {
      get: function() {
        return new this.constructor.TypedArray(buffer, this.byteOffset, this.length);
      }
    });

    return Pointer;

  }).call(this);
  Position = (function() {
    class Position extends Pointer {
      get(offset) {
        return function() {
          return new Float32Array(buffer, this.byteOffset + offset, 3);
        };
      }

      set(offset) {
        return function(value) {
          return f32.set(value, (this.byteOffset + offset) / 4);
        };
      }

    };

    Position.byteLength = 4 * 4;

    Position.label = "position";

    return Position;

  }).call(this);
  Color = (function() {
    class Color extends Pointer {
      get(offset) {
        return function() {
          return new Float32Array(buffer, this.byteOffset + offset, 4);
        };
      }

      set(offset) {
        return function(value) {
          return f32.set(value, (this.byteOffset + offset) / 4);
        };
      }

    };

    Color.byteLength = 4 * 4;

    Color.label = "color";

    return Color;

  }).call(this);
  Rotation = (function() {
    class Rotation extends Pointer {
      get(offset) {
        return function() {
          return new Float32Array(buffer, this.byteOffset + offset, 3);
        };
      }

      set(offset) {
        return function(value) {
          return f32.set(value, (this.byteOffset + offset) / 4);
        };
      }

    };

    Rotation.byteLength = 4 * 4;

    Rotation.label = "rotation";

    return Rotation;

  }).call(this);
  Scale = (function() {
    class Scale extends Pointer {
      get(offset) {
        return function() {
          return new Float32Array(buffer, this.byteOffset + offset, 3);
        };
      }

      set(offset) {
        return function(value) {
          return f32.set(value, (this.byteOffset + offset) / 4);
        };
      }

    };

    Scale.byteLength = 3 * 4;

    Scale.label = "scale";

    return Scale;

  }).call(this);
  Vertices = (function() {
    class Vertices extends Pointer {
      get(offset) {
        return function() {
          var ptri;
          ptri = dvw.getInt32(this.byteOffset + this.OFFSET_VERTICES, LE);
          if (ptri) {
            return new Vertices(ptri);
          }
          return null;
        };
      }

      set(offset) {
        return function(value) {
          var ptri;
          ptri = malloc(Vertices, value.length * 4);
          dvw.setInt32(this.byteOffset + this.OFFSET_VERTICES, ptri, LE);
          return f32.set(value, ptri32[ptri + HINDEX_BEGIN]);
        };
      }

    };

    Vertices.label = "vertices";

    Object.defineProperties(Vertices.prototype, {
      pointCount: {
        get: function() {
          return this.length / 3;
        }
      }
    });

    return Vertices;

  }).call(this);
  Shape = (function() {
    class Shape extends Pointer {
      static fromOptions(options) {
        var prop, ptr, ptri, value;
        ptri = malloc(this);
        ptr = new this(ptri);
        for (prop in options) {
          value = options[prop];
          ptr[prop] = value;
        }
        ptr.isGL = 1;
        ptr.iterCount = ptr.vertices.pointCount;
        if (!Number.isInteger(ptr.vertices.pointCount)) {
          throw [/VERTEX_COUNT_MUST_BE_MULTIPLE_OF_3/, options.vertices];
        }
        return ptr;
      }

      drawPoints() {
        return this.draws.push(space.malloc(gl.POINTS, this));
      }

      drawLines() {
        return this.draws.push(space.malloc(gl.LINES, this));
      }

      drawTriangles() {
        return this.draws.push(space.malloc(gl.TRIANGLES, this));
      }

      vertex(index) {
        var byteOffset, ptri;
        ptri = dvw.getUint32(this.byteOffset + this.OFFSET_VERTICES, LE);
        byteOffset = ptri32[ptri + HINDEX_BYTEOFFSET] + index * 4 * 3;
        return new Float32Array(buffer, byteOffset, 3);
      }

    };

    self.Shape = Shape;

    Shape.prototype.OFFSET_POSITION = Shape.malloc(Position);

    Shape.prototype.OFFSET_ROTATION = Shape.malloc(Rotation);

    Shape.prototype.OFFSET_SCALE = Shape.malloc(Scale);

    Shape.prototype.OFFSET_COLOR = Shape.malloc(Color);

    Shape.prototype.OFFSET_VERTICES = Shape.malloc(Vertices);

    Shape.prototype.draws = [];

    Object.defineProperties(Shape.prototype, {
      pointCount: {
        get: function() {
          return this.vertices.pointCount;
        }
      },
      markNeedsUpdate: {
        set: function() {
          return Atomics.store(ptri32, this.ptri + HINDEX_UPDATED, 1);
        }
      },
      willUploadIfNeeded: {
        get: function() {
          return Atomics.and(ptri32, this.ptri + HINDEX_UPDATED, 0);
        }
      }
    });

    return Shape;

  }).call(this);
  Matrix4 = (function() {
    class Matrix4 extends Pointer {
      static multiply(mat4a, mat4b) {
        return Matrix4.prototype.multiply.call(mat4a, mat4b);
      }

      translate(x = 0, y = 0, z = 0) {
        return this.multiply(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1));
      }

      translateX(x = 0) {
        return this.multiply(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1));
      }

      translateY(y = 0) {
        return this.multiply(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, y, 0, 1));
      }

      translateZ(z = 0) {
        return this.multiply(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1));
      }

      rotate(x = 0, y = 0, z = 0) {
        return this.rotateX(x).rotateY(y).rotateZ(z);
      }

      rotateX(r = 0) {
        var c, s;
        c = Math.cos(r);
        s = Math.sin(r);
        return this.multiply(Float32Array.of(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1));
      }

      rotateY(r = 0) {
        var c, s;
        c = Math.cos(r);
        s = Math.sin(r);
        return this.multiply(Float32Array.of(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
      }

      rotateZ(r = 0) {
        var c, s;
        c = Math.cos(r);
        s = Math.sin(r);
        return this.multiply(Float32Array.of(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1));
      }

      scale(x = 1, y = 1, z = 1) {
        return this.multiply(Float32Array.of(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1));
      }

      multiply(mat4) {
        var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33;
        [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this;
        [b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33] = mat4;
        return this.set(Float32Array.of(b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30, b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31, b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32, b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33, b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30, b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31, b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32, b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33, b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30, b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31, b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32, b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33, b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30, b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31, b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32, b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33));
      }

      [Symbol.iterator]() {
        var begin, count, index;
        begin = this.begin;
        index = 0;
        count = 16;
        return {
          next: function() {
            if (index === count) {
              return {
                done: true
              };
            }
            return {
              value: f32[begin + index++]
            };
          }
        };
      }

    };

    Matrix4.byteLength = 16;

    Object.defineProperties(Matrix4.prototype, {
      matrix: {
        get: function() {
          return f32.subarray(this.begin, this.begin + 16);
        },
        set: function(v) {
          return f32.set(v, this.begin);
        }
      }
    });

    return Matrix4;

  }).call(this);
  Frustrum = (function() {
    class Frustrum extends Matrix4 {
      static fromOptions(options = {}) {
        var aspect, base, bottom, f, half_fovy, height, left, pratio, rangeInv, right, top, width, yFov, zFar, zNear;
        ({yFov = 90, zNear = 1e-3, zFar = 1e+4, width = INNER_WIDTH, height = INNER_HEIGHT, pratio = RATIO_PIXEL} = options);
        base = new this();
        aspect = width / height;
        half_fovy = .5 * yFov * RADIANS_PER_DEGREE;
        bottom = -(top = zNear * Math.tan(half_fovy));
        left = -(right = top * aspect);
        f = Math.tan(Math.PI / 2 - yFov / 2);
        rangeInv = 1.0 / (zNear - zFar);
        base.typedArray.set(Float32Array.of(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (zNear + zFar) * rangeInv, -1, 0, 0, (zNear * zFar) * rangeInv * 2, 0, 0, bottom, left, right, top, width, height, aspect, pratio, yFov, zNear, zFar));
        base.translateZ(-5);
        base.rotateX(Math.PI);
        base.scale(1, 1, 1);
        return base;
      }

      setViewport(context) {
        context.viewport(0, 0, this.width * this.pratio, this.height * this.pratio);
        if (defines.pointSize) {
          defines.pointSize.value = 10;
        }
        if (defines.frustrum) {
          defines.frustrum.upload = defines.frustrum.bindUpload(this.matrix);
          Object.defineProperties(this, {
            uniform: {
              get: function() {
                return defines.frustrum;
              }
            },
            upload: {
              value: defines.frustrum.bindUpload(this.matrix)
            }
          });
          this.upload();
        }
        return this;
      }

      listenWindow() {
        var draging, plock, rotate;
        self.addEventListener("wheel", (e) => {
          this.translateZ(e.deltaY / 100).upload();
          return e.preventDefault();
        }, {
          passive: false
        });
        plock = 0;
        rotate = 0;
        draging = 0;
        self.oncontextmenu = function(e) {
          return e.preventDefault();
        };
        self.ondblclick = function() {
          gl.canvas.requestPointerLock({
            unadjustedMovement: true
          });
          return gl.canvas.requestFullscreen({
            navigationUI: "hide"
          });
        };
        document.onfullscreenchange = document.onpointerlockchange = function() {
          return plock = this.pointerLockElement || this.fullscreenElement;
        };
        self.onpointerdown = function(e) {
          if (e.button === 2) {
            return draging = 1;
          } else {
            return rotate = 1;
          }
        };
        self.onpointerout = self.onpointerup = function() {
          return draging = rotate = 0;
        };
        return self.onpointermove = (e) => {
          var x, y;
          if (plock || rotate || draging) {
            ({
              movementX: x,
              movementY: y
            } = e);
            if (rotate) {
              if (y) {
                this.rotateX(y / -100);
              }
              if (x) {
                this.rotateY(x / -100);
              }
            }
            if (draging) {
              this.translate(x / (INNER_WIDTH / 10), y / (INNER_HEIGHT / 15));
            }
            this.upload();
          }
          return 0;
        };
      }

    };

    Frustrum.byteLength = 4 * 28;

    Frustrum.prototype.INDEX_BOTTOM = 17;

    Frustrum.prototype.INDEX_LEFT = 18;

    Frustrum.prototype.INDEX_RIGHT = 19;

    Frustrum.prototype.INDEX_TOP = 20;

    Frustrum.prototype.INDEX_WIDTH = 21;

    Frustrum.prototype.INDEX_HEIGHT = 22;

    Frustrum.prototype.INDEX_ASPECT = 23;

    Frustrum.prototype.INDEX_PRATIO = 24;

    Frustrum.prototype.INDEX_YFOV = 25;

    Frustrum.prototype.INDEX_ZNEAR = 26;

    Frustrum.prototype.INDEX_ZFAR = 27;

    Object.defineProperties(Frustrum.prototype, {
      bottom: {
        get: function() {
          return f32[this.begin + this.INDEX_BOTTOM];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_BOTTOM] = v;
        }
      },
      left: {
        get: function() {
          return f32[this.begin + this.INDEX_LEFT];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_LEFT] = v;
        }
      },
      right: {
        get: function() {
          return f32[this.begin + this.INDEX_RIGHT];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_RIGHT] = v;
        }
      },
      top: {
        get: function() {
          return f32[this.begin + this.INDEX_TOP];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_TOP] = v;
        }
      },
      width: {
        get: function() {
          return f32[this.begin + this.INDEX_WIDTH];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_WIDTH] = v;
        }
      },
      height: {
        get: function() {
          return f32[this.begin + this.INDEX_HEIGHT];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_HEIGHT] = v;
        }
      },
      aspect: {
        get: function() {
          return f32[this.begin + this.INDEX_ASPECT];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_ASPECT] = v;
        }
      },
      pratio: {
        get: function() {
          return f32[this.begin + this.INDEX_PRATIO];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_PRATIO] = v;
        }
      },
      yFov: {
        get: function() {
          return f32[this.begin + this.INDEX_YFOV];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_YFOV] = v;
        }
      },
      zNear: {
        get: function() {
          return f32[this.begin + this.INDEX_ZNEAR];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_ZNEAR] = v;
        }
      },
      zFar: {
        get: function() {
          return f32[this.begin + this.INDEX_ZFAR];
        },
        set: function(v) {
          return f32[this.begin + this.INDEX_ZFAR] = v;
        }
      },
      rebind: {
        get: function() {
          return this.upload();
        }
      }
    });

    return Frustrum;

  }).call(this);
  GLDraw = (function() {
    class GLDraw extends Pointer {
      static fromOptions(options = {}) {
        return Object.assign(new this(), options);
      }

      vertex(i) {
        var byteOffset;
        byteOffset = this.globalOffset + (i * 32);
        return new Float32Array(buffer, byteOffset, 3);
      }

      color(i) {
        var byteOffset;
        byteOffset = this.globalOffset + (i * 32) + 16;
        return new Float32Array(buffer, byteOffset, 4);
      }

    };

    GLDraw.byteLength = 8 * 4;

    GLDraw.prototype.INDEX_NEEDSUP = 0;

    GLDraw.prototype.INDEX_COUNT = 1;

    GLDraw.prototype.INDEX_TYPE = 2;

    GLDraw.prototype.INDEX_OFFSET = 3;

    GLDraw.prototype.INDEX_BEGIN = 4;

    GLDraw.prototype.INDEX_LENGTH = 5;

    GLDraw.prototype.INDEX_ATTRLEN = 6;

    GLDraw.prototype.INDEX_BOFFSET = 7;

    GLDraw.prototype.classId = GLDraw.classId;

    Object.defineProperties(GLDraw.prototype, {
      pointsCount: {
        get: function() {
          return u32[this.begin + this.INDEX_COUNT];
        },
        set: function(v) {
          return u32[this.begin + this.INDEX_COUNT] = v;
        }
      },
      drawType: {
        get: function() {
          return u32[this.begin + this.INDEX_TYPE];
        },
        set: function(v) {
          return u32[this.begin + this.INDEX_TYPE] = v;
        }
      },
      globalOffset: {
        get: function() {
          return u32[this.begin + this.INDEX_BOFFSET];
        },
        set: function(v) {
          return u32[this.begin + this.INDEX_BOFFSET] = v;
        }
      },
      uploadOffset: {
        get: function() {
          return u32[this.begin + this.INDEX_OFFSET];
        },
        set: function(v) {
          return u32[this.begin + this.INDEX_OFFSET] = v;
        }
      },
      uploadBegin: {
        get: function() {
          return u32[this.begin + this.INDEX_BEGIN];
        },
        set: function(v) {
          return u32[this.begin + this.INDEX_BEGIN] = v;
        }
      },
      uploadLength: {
        get: function() {
          return u32[this.begin + this.INDEX_LENGTH];
        },
        set: function(v) {
          return u32[this.begin + this.INDEX_LENGTH] = v;
        }
      },
      drawBuffer: {
        get: function() {
          return new Float32Array(buffer, this.globalOffset, this.uploadLength);
        }
      }
    });

    return GLDraw;

  }).call(this);
  Space = (function() {
    class Space extends Pointer {
      init() {
        this.pointsPerType = Math.trunc(this.maxPointsCount / 3);
        this.pointsStart = this.pointsPerType * 0 + 2;
        this.linesStart = this.pointsPerType * 1;
        this.trianglesStart = this.pointsPerType * 2;
        this.pointsOffset = this.bytesPerPoint * 2;
        this.linesOffset = this.bytesPerPoint * this.pointsPerType;
        this.trianglesOffset = this.bytesPerPoint * this.pointsPerType * 2;
        return this;
      }

      draw() {
        var count;
        if (count = this.trianglesCount) {
          gl.drawArrays(gl.TRIANGLES, this.trianglesStart, count);
        }
        if (count = this.linesCount) {
          gl.drawArrays(gl.TRIANGLES, this.linesStart, count);
        }
        if (count = this.pointsCount) {
          return gl.drawArrays(gl.TRIANGLES, this.pointsStart, count);
        }
      }

      add(drawType, pointsCount) {
        var finish, length, offset, starts;
        starts = (function() {
          switch (drawType) {
            case WebGL2RenderingContext.POINTS:
              return this.pointsCount += pointsCount;
            case WebGL2RenderingContext.LINES:
              return this.linesCount += pointsCount;
            case WebGL2RenderingContext.TRIANGLES:
              return this.trianglesCount += pointsCount;
          }
        }).call(this);
        offset = (function() {
          switch (drawType) {
            case WebGL2RenderingContext.POINTS:
              return this.pointsOffset;
            case WebGL2RenderingContext.LINES:
              return this.linesOffset;
            case WebGL2RenderingContext.TRIANGLES:
              return this.trianglesOffset;
          }
        }).call(this);
        length = pointsCount * this.bytesPerPoint;
        finish = (function() {
          switch (drawType) {
            case WebGL2RenderingContext.POINTS:
              return this.pointsOffset += length;
            case WebGL2RenderingContext.LINES:
              return this.linesOffset += length;
            case WebGL2RenderingContext.TRIANGLES:
              return this.trianglesOffset += length;
          }
        }).call(this);
        return offset;
      }

      malloc(drawType, shape) {
        var draw, dstByteOffset, length, pointsCount, srcOffset;
        pointsCount = shape.pointCount;
        dstByteOffset = this.add(drawType, pointsCount);
        srcOffset = dstByteOffset / 4;
        length = pointsCount * this.itemsPerPoint;
        draw = GLDraw.fromOptions({
          drawType,
          pointsCount,
          globalOffset: dstByteOffset + this.drawBuffer.byteOffset,
          uploadOffset: dstByteOffset,
          uploadBegin: srcOffset,
          uploadLength: length,
          parent: shape.ptri
        });
        shape.markNeedsUpdate = 1;
        return draws[draws.length] = Object.defineProperties(draw, {
          upload: {
            value: gl.bufferSubData.bind(gl, gl.ARRAY_BUFFER, draw.uploadOffset, this.drawBuffer, draw.uploadBegin, draw.uploadLength)
          }
        });
      }

    };

    Space.byteLength = BYTELENGTH_GLBUFFER + 16 * 4;

    Space.prototype.INDEX_POINTS_BEGIN = 0;

    Space.prototype.INDEX_LINES_BEGIN = 1;

    Space.prototype.INDEX_TRIANGES_BEGIN = 4;

    Space.prototype.INDEX_POINTS_COUNT = 2;

    Space.prototype.INDEX_LINES_COUNT = 3;

    Space.prototype.INDEX_TRIANGES_COUNT = 6;

    Space.prototype.INDEX_POINTS_OFFSET = 5;

    Space.prototype.INDEX_LINES_OFFSET = 6;

    Space.prototype.INDEX_TRIANGES_OFFSET = 9;

    Space.prototype.INDEX_TYPELENGTH = 2;

    Space.prototype.INDEX_DRAW_BEGIN = 16;

    Space.prototype.itemsPerPoint = 8;

    Space.prototype.bytesPerPoint = 4 * Space.prototype.itemsPerPoint;

    Space.prototype.drawByteOffset = 4 * Space.prototype.INDEX_DRAW_BEGIN;

    Space.prototype.drawByteLength = BYTELENGTH_GLBUFFER - BYTELENGTH_GLBUFFER % Space.prototype.bytesPerPoint;

    Space.prototype.drawableLength = Space.prototype.drawByteLength / 4;

    Space.prototype.maxPointsCount = Space.prototype.drawByteLength / Space.prototype.bytesPerPoint;

    Object.defineProperties(Space.prototype, {
      drawBuffer: {
        get: function() {
          return new Float32Array(buffer, this.byteOffset + this.drawByteOffset, this.drawableLength);
        },
        set: function(v) {
          return this.drawBuffer.set(v);
        }
      },
      pointsStart: {
        get: function() {
          return u32[this.begin];
        },
        set: function(v) {
          return u32[this.begin] = v;
        }
      },
      linesStart: {
        get: function() {
          return u32[this.begin + 1];
        },
        set: function(v) {
          return u32[this.begin + 1] = v;
        }
      },
      trianglesStart: {
        get: function() {
          return u32[this.begin + 4];
        },
        set: function(v) {
          return u32[this.begin + 4] = v;
        }
      },
      pointsPerType: {
        get: function() {
          return u32[this.begin + 2];
        },
        set: function(v) {
          return u32[this.begin + 2] = v;
        }
      },
      pointsCount: {
        get: function() {
          return u32[this.begin + 5];
        },
        set: function(v) {
          return u32[this.begin + 5] = v;
        }
      },
      linesCount: {
        get: function() {
          return u32[this.begin + 6];
        },
        set: function(v) {
          return u32[this.begin + 6] = v;
        }
      },
      trianglesCount: {
        get: function() {
          return u32[this.begin + 7];
        },
        set: function(v) {
          return u32[this.begin + 7] = v;
        }
      },
      pointsOffset: {
        get: function() {
          return u32[this.begin + 8];
        },
        set: function(v) {
          return u32[this.begin + 8] = v;
        }
      },
      linesOffset: {
        get: function() {
          return u32[this.begin + 9];
        },
        set: function(v) {
          return u32[this.begin + 9] = v;
        }
      },
      trianglesOffset: {
        get: function() {
          return u32[this.begin + 10];
        },
        set: function(v) {
          return u32[this.begin + 10] = v;
        }
      }
    });

    return Space;

  }).call(this);
  self.addEventListener("DOMContentLoaded", function() {
    var checkUploads, createBlobURL, createCanvas, createFrustrum, createThreads, createWorker, epoch, frame, initialProgram, listenEvents, rendering, resolveDefines, resolveUniform;
    frame = 0;
    epoch = 0;
    rendering = 0;
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
          var l, len1, ref1, results1;
          ref1 = GLDraw.allocs(shape.ptri);
          results1 = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            draw = ref1[l];
            results1.push(gl.bufferSubData(gl.ARRAY_BUFFER, draw.uploadOffset, space.drawBuffer, draw.uploadBegin, draw.uploadLength));
          }
          return results1;
        })());
      }
      return results;
    };
    this.render = function() {
      var color, onanimationframe, position;
      rendering = 1;
      position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 32, 0);
      color = gl.getAttribLocation(program, "color");
      gl.enableVertexAttribArray(color);
      gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 32, 16);
      onanimationframe = function(pnow) {
        var delta, fps;
        delta = pnow - epoch;
        epoch = pnow;
        fps = Math.trunc(1 / delta * 1e3);
        checkUploads();
        emit("animationframe", {gl, delta, epoch, fps});
        space.draw();
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
    resolveUniform = function(uniform) {
      return function(data, transpose = false) {
        switch (uniform.kind) {
          case "FLOAT_MAT4":
            return gl.uniformMatrix4fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT3":
            return gl.uniformMatrix3fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT2":
            return gl.uniformMatrix2fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT2x3":
            return gl.uniformMatrix2x3fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT2x4":
            return gl.uniformMatrix2x4fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT3x2":
            return gl.uniformMatrix3x2fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT3x4":
            return gl.uniformMatrix3x4fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT4x2":
            return gl.uniformMatrix4x2fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT_MAT3x3":
            return gl.uniformMatrix4x3fv.bind(gl, uniform.location, transpose, data);
          case "FLOAT":
            return gl.uniform1f.bind(gl, uniform.location, data);
          case "INT":
            return gl.uniform1iv.bind(gl, uniform.location, data);
          case "UNSIGNED_INT":
            return gl.uniform1uiv.bind(gl, uniform.location, data);
          case "UNSIGNED_INT_VEC2":
            return gl.uniform2uiv.bind(gl, uniform.location, data);
          case "UNSIGNED_INT_VEC3":
            return gl.uniform3uiv.bind(gl, uniform.location, data);
          case "UNSIGNED_INT_VEC4":
            return gl.uniform4uiv.bind(gl, uniform.location, data);
        }
      };
    };
    resolveDefines = function() {
      var attrib, attribs, i, j, k, len, lengthOf, uniform, uniforms, v;
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
      attribs = (function() {
        var results;
        results = [];
        while (i--) {
          attrib = gl.getActiveAttrib(program, i);
          attrib.is = "attribute";
          attrib.location = gl.getAttribLocation(program, attrib.name);
          attrib.isEnabled = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
          attrib.binding = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
          attrib.typeof = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_TYPE);
          attrib.kindof = k.at(v.indexOf(attrib.typeof));
          attrib.isNormalized = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
          attrib.stride = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_STRIDE);
          attrib.integer = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_INTEGER);
          attrib.divisor = gl.getVertexAttrib(i, gl.VERTEX_ATTRIB_ARRAY_DIVISOR);
          attrib.kind = k.at(v.indexOf(attrib.type));
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
        attrib.enable = gl.enableVertexAttribArray.bind(gl, attrib.location);
        attrib.rebind = gl.vertexAttribPointer.bind(gl, attrib.location, attrib.length, attrib.typeof, attrib.isNormalized, attrib.stride, attrib.offset);
        Object.defineProperties(defines[attrib.name] = attrib, {
          value: {
            get: function() {
              return gl.getVertexAttrib(this.location, gl.CURRENT_VERTEX_ATTRIB);
            }
          }
        });
      }
      i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      return uniforms = (function() {
        var results;
        results = [];
        while (i--) {
          uniform = gl.getActiveUniform(program, i);
          uniform.is = "uniform";
          uniform.kind = k.at(v.indexOf(uniform.type));
          uniform.location = gl.getUniformLocation(program, uniform.name);
          uniform.bindUpload = resolveUniform(uniform);
          results.push(Object.defineProperties(defines[uniform.name] = uniform, {
            value: {
              get: function() {
                return gl.getUniform(program, this.location);
              },
              set: function(data) {
                return this.bindUpload(data)();
              }
            }
          }));
        }
        return results;
      })();
    };
    createFrustrum = function(options) {
      frustrum = Frustrum.fromOptions(options);
      frustrum.setViewport(gl);
      return frustrum.listenWindow();
    };
    this.createDisplay = function() {
      gl = createCanvas().getContext("webgl2");
      initialProgram();
      resolveDefines();
      createFrustrum();
      space = new Space();
      warn(defines);
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
          get: Atomics.load.bind(Atomics, ptri32, name),
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
    ptri32 = new Int32Array(buffer);
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
