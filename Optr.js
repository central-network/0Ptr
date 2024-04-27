self.name = "window";

(self.init = function() {
  var Color, GLBuffer, GLDraw, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_CLASSID, HINDEX_ISGL, HINDEX_ITER_COUNT, HINDEX_LENGTH, HINDEX_LOCATED, HINDEX_NEXT_COLORI, HINDEX_NEXT_VERTEXI, HINDEX_PAINTED, HINDEX_PARENT, HINDEX_PTRI, HINDEX_UPDATED, LE, LENGTH_GPU, OFFSET_CPU, OFFSET_GPU, OFFSET_LINES, OFFSET_POINTS, OFFSET_PTR, OFFSET_TRIANGLES, Pointer, Position, RADIANS_PER_DEGREE, Rotation, STATE_LOCKED, STATE_READY, STATE_UNLOCKED, STATE_WORKING, STRIDE_GPU, Scale, Shape, THREADS_BEGIN, THREADS_COUNT, THREADS_NULL, THREADS_READY, THREADS_STATE, Vertices, buffer, classes, dvw, error, f32, gl, glBuffer, isThread, isWindow, lock, log, malloc, nextTick, number, pipe, ptri32, state, threadId, ticks, u32, ui8, unlock, uuid, warn, workers;
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
  glBuffer = null;
  classes = [];
  ticks = 0;
  THREADS_STATE = 5;
  THREADS_BEGIN = 6;
  THREADS_COUNT = 2 || (typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0);
  STATE_READY = 1;
  STATE_LOCKED = 0;
  STATE_WORKING = 3;
  STATE_UNLOCKED = 4;
  THREADS_NULL = 1;
  THREADS_READY = 2;
  OFFSET_GPU = 1000 * 16;
  OFFSET_CPU = 4096 * 4096;
  OFFSET_PTR = 24;
  HINDEX_LENGTH = 0;
  HINDEX_PTRI = HINDEX_LENGTH++;
  HINDEX_BYTEOFFSET = HINDEX_LENGTH++;
  HINDEX_BYTELENGTH = HINDEX_LENGTH++;
  HINDEX_CLASSID = HINDEX_LENGTH++;
  HINDEX_PARENT = HINDEX_LENGTH++;
  HINDEX_BEGIN = HINDEX_LENGTH++;
  HINDEX_ISGL = HINDEX_LENGTH++;
  HINDEX_UPDATED = HINDEX_ISGL + 1;
  HINDEX_PAINTED = HINDEX_ISGL + 2;
  HINDEX_LOCATED = HINDEX_ISGL + 3;
  HINDEX_ITER_COUNT = HINDEX_LENGTH++;
  HINDEX_NEXT_COLORI = HINDEX_LENGTH++;
  HINDEX_NEXT_VERTEXI = HINDEX_LENGTH++;
  state = function(state) {
    if (!arguments.length) {
      return Atomics.load(ptri32, threadId);
    }
    return Atomics.store(ptri32, threadId, state);
  };
  nextTick = function() {
    var begin, count, draw, end, index, j, len, locate, paint, ptri, ref, shape, vertex;
    lock();
    log("nextTick:", ++ticks);
    ptri = Atomics.load(ptri32, 1);
    while (OFFSET_PTR <= (ptri -= 16)) {
      if (!Atomics.load(ui8, ptri + HINDEX_ISGL)) {
        continue;
      }
      locate = Atomics.load(ui8, ptri + HINDEX_LOCATED);
      paint = Atomics.load(ui8, ptri + HINDEX_PAINTED);
      if (paint && locate) {
        continue;
      }
      index = Atomics.add(u32, ptri + HINDEX_NEXT_VERTEXI, 1);
      count = Atomics.load(u32, ptri + HINDEX_ITER_COUNT);
      shape = new Shape(ptri);
      begin = index * 3;
      end = begin + 3;
      vertex = shape.vertices.subarray(begin, end);
      log("ptri:", {
        ptri: ptri,
        index,
        vertex
      });
      ref = shape.children;
      for (j = 0, len = ref.length; j < len; j++) {
        draw = ref[j];
        draw.vertex(index).set(vertex);
        draw.color(index).set(shape.color);
      }
      if (index - count) {
        continue;
      }
      if (!locate) {
        Atomics.store(ui8, ptri + HINDEX_LOCATED, 1);
      }
      if (!paint) {
        Atomics.store(ui8, ptri + HINDEX_PAINTED, 1);
      }
      Atomics.store(ui8, ptri + HINDEX_UPDATED, 1);
    }
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
  LENGTH_GPU = OFFSET_CPU - OFFSET_GPU;
  STRIDE_GPU = Math.trunc(LENGTH_GPU / 3);
  if (isWindow) {
    buffer = new SharedArrayBuffer(1e8);
    ptri32 = new Int32Array(buffer);
    u32 = new Uint32Array(buffer);
    f32 = new Float32Array(buffer);
    dvw = new DataView(buffer);
    ui8 = new Uint8Array(buffer);
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
  OFFSET_TRIANGLES = OFFSET_GPU + STRIDE_GPU * 0;
  OFFSET_LINES = OFFSET_GPU + STRIDE_GPU * 1;
  OFFSET_POINTS = OFFSET_GPU + STRIDE_GPU * 2;
  RADIANS_PER_DEGREE = Math.PI / 180.0;
  LE = new Uint8Array(Uint16Array.of(1).buffer).at();
  malloc = function(constructor, byteLength) {
    var begin, byteOffset, classId, length, ptri;
    classId = constructor.classId;
    if (byteLength == null) {
      byteLength = constructor.byteLength;
    }
    length = byteLength / constructor.TypedArray.BYTES_PER_ELEMENT;
    ptri = Atomics.add(ptri32, 1, 16);
    byteOffset = Atomics.add(ptri32, 0, byteLength);
    begin = byteOffset / constructor.TypedArray.BYTES_PER_ELEMENT;
    Atomics.store(ptri32, ptri + HINDEX_PTRI, ptri);
    Atomics.store(ptri32, ptri + HINDEX_BYTEOFFSET, byteOffset);
    Atomics.store(ptri32, ptri + HINDEX_BYTELENGTH, byteLength);
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
      static malloc(constructor, byteLength) {
        var offset;
        this.classId;
        offset = this.byteLength;
        if (byteLength == null) {
          byteLength = constructor.byteLength;
        }
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
        return Atomics.load(ui8, this.ptri + HINDEX_ISGL);
      },
      set: function(v) {
        return Atomics.store(ui8, this.ptri + HINDEX_ISGL, v);
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
          return new Vertices(dvw.getUint32(this.byteOffset + offset, LE));
        };
      }

      set(offset) {
        return function(value) {
          var vertices;
          vertices = new Vertices(malloc(Vertices, value.length * 4));
          vertices.typedArray.set(value);
          return dvw.setUint32(this.byteOffset + offset, vertices.ptri, LE);
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
          if (this.prototype.hasOwnProperty(prop)) {
            ptr[prop] = value;
          }
        }
        ptr.isGL = 1;
        ptr.iterCount = ptr.vertices.pointCount;
        return ptr;
      }

      drawPoints() {
        return warn(glBuffer.malloc(gl.POINTS, this));
      }

    };

    self.Shape = Shape;

    Shape.prototype.OFFSET_POSITION = Shape.malloc(Position);

    Shape.prototype.OFFSET_ROTATION = Shape.malloc(Rotation);

    Shape.prototype.OFFSET_SCALE = Shape.malloc(Scale);

    Shape.prototype.OFFSET_COLOR = Shape.malloc(Color);

    Shape.prototype.OFFSET_VERTICES = Shape.malloc(Vertices);

    return Shape;

  }).call(this);
  GLDraw = (function() {
    class GLDraw extends Pointer {};

    GLDraw.byteLength = 8 * 4;

    GLDraw.prototype.INDEX_START = 0;

    GLDraw.prototype.INDEX_COUNT = 1;

    GLDraw.prototype.INDEX_OFFSET = 2;

    GLDraw.prototype.INDEX_GLTYPE = 3;

    GLDraw.prototype.INDEX_GLOFFSET = 4;

    GLDraw.prototype.classId = GLDraw.classId;

    Object.defineProperties(GLDraw.prototype, {
      start: {
        get: function() {
          return Atomics.load(ptri32, this.begin + this.INDEX_START);
        },
        set: function(v) {
          return Atomics.store(ptri32, this.begin + this.INDEX_START, v);
        }
      },
      count: {
        get: function() {
          return Atomics.load(ptri32, this.begin + this.INDEX_COUNT);
        },
        set: function(v) {
          return Atomics.store(ptri32, this.begin + this.INDEX_COUNT, v);
        }
      },
      offset: {
        get: function() {
          return Atomics.load(u32, this.begin + this.INDEX_OFFSET);
        },
        set: function(v) {
          return Atomics.store(u32, this.begin + this.INDEX_OFFSET, v);
        }
      },
      vertex: {
        value: function(i) {
          var byteOffset;
          byteOffset = this.glOffset + i * 8;
          return new Float32Array(buffer, byteOffset, 3);
        }
      },
      color: {
        value: function(i) {
          var byteOffset;
          byteOffset = this.glOffset + i * 8 + 4;
          return new Float32Array(buffer, byteOffset, 4);
        }
      },
      glOffset: {
        get: function() {
          return Atomics.load(ptri32, this.begin + this.INDEX_GLOFFSET);
        },
        set: function(v) {
          return Atomics.store(ptri32, this.begin + this.INDEX_GLOFFSET, v);
        }
      },
      glType: {
        get: function() {
          return Atomics.load(ptri32, this.begin + this.INDEX_GLTYPE);
        },
        set: function(v) {
          return Atomics.store(ptri32, this.begin + this.INDEX_GLTYPE, v);
        }
      },
      glBuffer: {
        get: function() {
          return new Float32Array(buffer, this.glOffset, this.count * 8);
        }
      }
    });

    return GLDraw;

  }).call(this);
  GLBuffer = (function() {
    class GLBuffer extends Float32Array {
      constructor() {
        super(buffer, OFFSET_GPU, LENGTH_GPU / 4);
      }

      malloc(type, shape) {
        var begin, byteLength, byteOffset, draw, end, pointCount;
        pointCount = shape.vertices.pointCount;
        byteOffset = this[type];
        byteLength = pointCount * 8 * 4;
        this[type] += byteLength;
        begin = byteOffset / 4;
        end = begin + byteLength / 4;
        draw = new GLDraw();
        draw.start = byteOffset / 4;
        draw.count = pointCount;
        draw.glType = type;
        draw.glOffset = byteOffset;
        draw.offset = this.byteOffset + byteOffset;
        draw.parent = shape;
        return draw;
      }

      dump() {
        return new Float32Array(buffer, this.drawOffset, this.drawLength);
      }

    };

    GLBuffer.prototype.OFFSET_TRIANGLES = OFFSET_TRIANGLES + 24;

    GLBuffer.prototype.OFFSET_LINES = OFFSET_LINES;

    GLBuffer.prototype.OFFSET_POINTS = OFFSET_POINTS;

    GLBuffer.prototype.drawOffset = GLBuffer.prototype.OFFSET_TRIANGLES;

    GLBuffer.prototype.drawLength = .25 * (LENGTH_GPU - 24);

    return GLBuffer;

  }).call(this);
  self.addEventListener("DOMContentLoaded", function() {
    var INNER_HEIGHT, INNER_WIDTH, RATIO_ASPECT, RATIO_PIXEL, createBlobURL, createCanvas, createThreads, createWorker, listenEvents;
    INNER_WIDTH = typeof innerWidth !== "undefined" && innerWidth !== null ? innerWidth : 640;
    INNER_HEIGHT = typeof innerHeight !== "undefined" && innerHeight !== null ? innerHeight : 480;
    RATIO_PIXEL = typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1;
    RATIO_ASPECT = INNER_WIDTH / INNER_HEIGHT;
    this.createDisplay = function() {
      var canvas;
      canvas = createCanvas();
      gl = canvas.getContext("webgl");
      glBuffer = new GLBuffer();
      self.emit("contextrestored", gl);
      return pipe.emit("contextrestored");
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
    glBuffer = new GLBuffer();
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
  self.addEventListener("contextmenu", function() {
    arguments[0].preventDefault();
    return unlock();
  });
  self.addEventListener("click", function() {
    warn("glbuffer:", glBuffer.dump());
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
