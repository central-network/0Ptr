import {
  Pointer,
  ByteOffset,
  KeyBase
} from "./ptr.js";

import {
  Controller
} from "./ptr_ctrl.js";

export var GLKEYS = new KeyBase(WebGL2RenderingContext);

GLKEYS.add({
  COLOR_DEPTH_BUFFER_BIT: GLKEYS.COLOR_BUFFER_BIT | GLKEYS.DEPTH_BUFFER_BIT
});

export var Color4 = (function() {
  class Color4 extends ByteOffset {
    set(vec4 = []) {
      var a, b, g, r;
      [r = 0, g = 0, b = 0, a = 1] = vec4;
      this.setFloat32(this.OFFSET_RED, r);
      this.setFloat32(this.OFFSET_GREEN, g);
      this.setFloat32(this.OFFSET_BLUE, b);
      this.setFloat32(this.OFFSET_ALPHA, a);
      this.storeUint8(this.OFFSET_UPDATED, 0);
      return this;
    }

    update(fn) {
      if (this.updated) {
        return this;
      }
      fn(this.updated = true);
      return this;
    }

    static parseCSSColor(rgba = "") {
      var a, b, g, r;
      [r, g, b, a = 1] = rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',').map(Number);
      return Float32Array.of(r / 0xff, g / 0xff, b / 0xff, a);
    }

  };

  //? matters 
  //? order        : gl.clearColor r, g, b, a
  //? because of   : gl.clearColor.apply.bind gl.clearColor, gl, new Float32Array buffer, this + clearColor, 4
  Color4.prototype.OFFSET_RED = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_GREEN = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_BLUE = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_ALPHA = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_UPDATED = Color4.malloc(Uint8Array);

  Object.defineProperties(Color4.prototype, {
    updated: {
      get: function() {
        return this.loadUint8(this.OFFSET_UPDATED);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_UPDATED, arguments[0]);
      }
    },
    rgb: {
      get: function() {
        return [...this.ui8];
      },
      set: function() {
        return this.ui8 = arguments[0];
      }
    },
    hex: {
      get: function() {
        return "0x" + this.rgb.map(function(d) {
          return d.toString(16).padStart(2, 0);
        }).join("");
      },
      set: function() {
        return this.u32 = parseInt(`${arguments[0]}`.split(/x|\#/, 2).pop().padEnd(8, "ff"), 16);
      }
    },
    u32: {
      get: function() {
        return parseInt(this.hex, 16);
      },
      set: function() {
        return this.ui8 = new Uint8Array(Uint32Array.of(arguments[0]).buffer);
      }
    },
    css: {
      get: function() {
        var a, b, g, r;
        [r, g, b, a] = this.ui8;
        return `rgba( ${r}, ${g}, ${b}, ${a / 0xff} )`;
      },
      set: function() {
        return this.set(Color4.parseCSSColor(arguments[0]));
      }
    },
    ui8: {
      get: function() {
        return Uint8Array.of(0xff * this.getFloat32(this.OFFSET_RED), 0xff * this.getFloat32(this.OFFSET_GREEN), 0xff * this.getFloat32(this.OFFSET_BLUE), 0xff * this.getFloat32(this.OFFSET_ALPHA));
      },
      set: function() {
        var a, b, g, r;
        if (!isNaN(r = arguments[0] / 0xff)) {
          this.setFloat32(this.OFFSET_RED, r);
        }
        if (!isNaN(g = arguments[1] / 0xff)) {
          this.setFloat32(this.OFFSET_GREEN, g);
        }
        if (!isNaN(b = arguments[2] / 0xff)) {
          this.setFloat32(this.OFFSET_BLUE, b);
        }
        if (!isNaN(a = arguments[3] / 0xff)) {
          return this.setFloat32(this.OFFSET_ALPHA, a);
        }
      }
    },
    f32: {
      get: function() {
        return new Float32Array(this.buffer, this, 4);
      },
      set: Color4.prototype.set
    }
  });

  return Color4;

}).call(this);

export var Viewport = (function() {
  class Viewport extends ByteOffset {
    set(rect = {}) {
      if (rect.left != null) {
        this.left = rect.left;
      }
      if (rect.top != null) {
        this.top = rect.top;
      }
      if (rect.width != null) {
        this.width = rect.width;
      }
      if (rect.height != null) {
        this.height = rect.height;
      }
      if ((rect.maxWidth == null) && (typeof innerWidth !== "undefined" && innerWidth !== null)) {
        this.maxWidth = innerWidth;
      }
      if ((rect.maxHeight == null) && (typeof innerHeight !== "undefined" && innerHeight !== null)) {
        this.maxHeight = innerHeight;
      }
      this.fullscreen = !Boolean(this.width - this.maxWidth + this.height - this.maxHeight);
      this.updated = false;
      return this;
    }

    update(fn) {
      if (this.updated) {
        return this;
      }
      fn(this.updated = true);
      return this;
    }

  };

  //? matters 
  //? order        : gl.viewport left, top, width, height
  //? because of   : gl.viewport.apply.bind gl.viewport, gl, new Float32Array buffer, this + viewport.byteOffset, 4
  Viewport.prototype.OFFSET_LEFT = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_TOP = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_WIDTH = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_HEIGHT = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_MAXWIDTH = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_MAXHEIGHT = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_FULLSCREEN = Viewport.malloc(Uint8Array);

  Viewport.prototype.OFFSET_UPDATED = Viewport.malloc(Uint8Array);

  Object.defineProperties(Viewport.prototype, {
    updated: {
      get: function() {
        return this.loadUint8(this.OFFSET_UPDATED);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_UPDATED, arguments[0]);
      }
    },
    left: {
      get: function() {
        return this.getFloat32(this.OFFSET_LEFT);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_LEFT, arguments[0]);
      }
    },
    top: {
      get: function() {
        return this.getFloat32(this.OFFSET_TOP);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_TOP, arguments[0]);
      }
    },
    width: {
      get: function() {
        return this.getFloat32(this.OFFSET_WIDTH);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_WIDTH, arguments[0]);
      }
    },
    height: {
      get: function() {
        return this.getFloat32(this.OFFSET_HEIGHT);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_HEIGHT, arguments[0]);
      }
    },
    maxWidth: {
      get: function() {
        return this.getFloat32(this.OFFSET_MAXWIDTH);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_MAXWIDTH, arguments[0]);
      }
    },
    maxHeight: {
      get: function() {
        return this.getFloat32(this.OFFSET_MAXHEIGHT);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_MAXHEIGHT, arguments[0]);
      }
    },
    fullscreen: {
      get: function() {
        return this.getUint8(this.OFFSET_FULLSCREEN);
      },
      set: function() {
        return this.setUint8(this.OFFSET_FULLSCREEN, arguments[0]);
      }
    }
  });

  return Viewport;

}).call(this);

export var Program = class Program extends Pointer {};

export var Shader = class Shader extends Pointer {};

export var Buffer = class Buffer extends Pointer {};

export var WebGL2 = (function() {
  class WebGL2 extends Pointer {
    render(epoch) {
      var f, i, j, len, len1, ref, ref1;
      this.epoch = epoch;
      this.frame++;
      if (!this.rendering) {
        return requestAnimationFrame((e) => {
          return this.render(e);
        });
      }
      ref = this.preProcesses;
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        f.call(this);
      }
      this.viewport.update(this.operators.viewport);
      this.clearColor.update(this.operators.clearColor);
      this.operators.clear();
      ref1 = this.postProcesses;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        f = ref1[j];
        //console.log { @frame, @epoch, @rendering }, @clearColor
        f.call(this);
      }
      return requestAnimationFrame((e) => {
        return this.render(e);
      });
    }

    create() {
      this.viewport = this.document.body.getBoundingClientRect();
      this.canvas = this.document.createElement(this.defaults.tagName);
      this.gl = this.canvas.getContext(this.defaults.contextType);
      this.clearColor = this.defaults.clearColor;
      this.clearMask = this.defaults.clearMask;
      this.listenEvents();
      this.resizeCanvas();
      this.setOperators();
      this.createProgram();
      this.rendering = true;
      return this.canvas.onclick = () => {
        return this.rendering = !this.rendering;
      };
    }

    createProgram() {
      return console.log(this.program = this.gl.createProgram());
    }

    resizeCanvas() {
      this.canvas.width = this.viewport.width * devicePixelRatio;
      this.canvas.height = this.viewport.height * devicePixelRatio;
      this.canvas.style.position = "fixed";
      this.canvas.style.left = CSS.px(this.viewport.left);
      this.canvas.style.top = CSS.px(this.viewport.top);
      this.canvas.style.width = CSS.px(this.viewport.width);
      this.canvas.style.height = CSS.px(this.viewport.height);
      if (!this.canvas.isConnected) {
        this.document.body.appendChild(this.canvas);
      }
      return this;
    }

    setOperators() {
      var clear, clearColor, viewport;
      clear = this.gl.clear.bind(this.gl, this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      viewport = this.gl.viewport.apply.bind(this.gl.viewport, this.gl, new Float32Array(this.buffer, this + this.OFFSET_VIEWPORT, 4));
      clearColor = this.gl.clearColor.apply.bind(this.gl.clearColor, this.gl, new Float32Array(this.buffer, this + this.OFFSET_CLEARCOLOR, 4));
      this.storeObject(this.OFFSET_FN_CLEAR, clear);
      this.storeObject(this.OFFSET_FN_VIEWPORT, viewport);
      this.storeObject(this.OFFSET_FN_CLEARCOLOR, clearColor);
      return this;
    }

    listenEvents() {
      return this.addListener("gamepadconnected", (event) => {
        return this.controller.gamepad.handle(event);
      });
    }

    addListener(event, handler, options = {}) {
      addEventListener(event, handler, options);
      return this;
    }

  };

  WebGL2.byteLength = 4 * 24;

  WebGL2.prototype.OFFSET_RENDERING = WebGL2.malloc(Uint8Array);

  WebGL2.prototype.OFFSET_FRAME = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_EPOCH = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_DOCUMENT = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_CANVAS = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_CONTEXT = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_VIEWPORT = WebGL2.malloc(Viewport);

  WebGL2.prototype.OFFSET_CLEARCOLOR = WebGL2.malloc(Color4);

  WebGL2.prototype.OFFSET_CLEARMASK = WebGL2.malloc(Uint16Array);

  WebGL2.prototype.OFFSET_FN_VIEWPORT = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_FN_CLEARCOLOR = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_FN_CLEAR = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_PROGRAM = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_CONTROLLER = WebGL2.malloc(Controller);

  WebGL2.prototype.defaults = {
    clearColor: [1, 1, 1, 1],
    clearMask: GLKEYS.COLOR_DEPTH_BUFFER_BIT,
    contextType: "webgl2",
    tagName: "canvas"
  };

  WebGL2.prototype.preProcesses = [];

  WebGL2.prototype.postProcesses = [];

  Object.defineProperties(WebGL2.prototype, {
    document: {
      get: function() {
        return this.loadObject(this.OFFSET_DOCUMENT);
      },
      set: function() {
        return this.create(this.storeObject(this.OFFSET_DOCUMENT, arguments[0]));
      }
    },
    rendering: {
      get: function() {
        return this.loadUint8(this.OFFSET_RENDERING);
      },
      set: function() {
        return this.render(this.storeUint8(this.OFFSET_RENDERING, arguments[0]));
      }
    },
    epoch: {
      get: function() {
        return this.loadUint32(this.OFFSET_EPOCH);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_EPOCH, arguments[0]);
      }
    },
    frame: {
      get: function() {
        return this.loadUint32(this.OFFSET_FRAME);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_FRAME, arguments[0]);
      }
    },
    canvas: {
      get: function() {
        return this.loadObject(this.OFFSET_CANVAS);
      },
      set: function() {
        return this.storeObject(this.OFFSET_CANVAS, arguments[0]);
      }
    },
    program: {
      get: function() {
        return this.loadObject(this.OFFSET_PROGRAM);
      },
      set: function() {
        return this.storeObject(this.OFFSET_PROGRAM, arguments[0]);
      }
    },
    controller: {
      get: function() {
        return new Controller(this, this.OFFSET_CONTROLLER);
      }
    },
    viewport: {
      get: function() {
        return new Viewport(this + this.OFFSET_VIEWPORT);
      },
      set: function() {
        return this.viewport.set(arguments[0]);
      }
    },
    clearColor: {
      get: function() {
        return new Color4(this + this.OFFSET_CLEARCOLOR);
      },
      set: function() {
        return this.clearColor.set(arguments[0]);
      }
    },
    clearMask: {
      get: function() {
        return this.keyUint16(this.OFFSET_CLEARMASK, GLKEYS);
      },
      set: function() {
        return this.storeUint16(this.OFFSET_CLEARMASK, arguments[0]);
      }
    },
    gl: {
      get: function() {
        return this.loadObject(this.OFFSET_CONTEXT);
      },
      set: function() {
        return this.storeObject(this.OFFSET_CONTEXT, arguments[0]);
      }
    },
    operators: {
      get: function() {
        return {
          clear: this.loadObject(this.OFFSET_FN_CLEAR),
          viewport: this.loadObject(this.OFFSET_FN_VIEWPORT),
          clearColor: this.loadObject(this.OFFSET_FN_CLEARCOLOR)
        };
      }
    }
  });

  return WebGL2;

}).call(this);

Pointer.register(WebGL2, Program, Viewport, Color4, Shader, Buffer).store(GLKEYS);

export {
  Pointer as default
};
