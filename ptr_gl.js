import {
  length
} from "./window.js";

import {
  Pointer,
  ByteOffset
} from "./ptr.js";

export var Color4 = (function() {
  class Color4 extends ByteOffset {
    set(vec4 = []) {
      var i, j, len, ref, val;
      ref = [...vec4, 1, 1, 1, 1];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        val = ref[i];
        if (!(i < 4)) {
          break;
        } else {
          this.setFloat32(i * 4, val);
        }
      }
      return this;
    }

    static parseCSSColor(rgba = "") {
      var a, b, g, r;
      [r, g, b, a = 1] = rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',').map(Number);
      return Float32Array.of(r / 0xff, g / 0xff, b / 0xff, a);
    }

  };

  Color4.prototype.OFFSET_RED = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_GREEN = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_BLUE = Color4.malloc(Float32Array);

  Color4.prototype.OFFSET_ALPHA = Color4.malloc(Float32Array);

  Object.defineProperties(Color4.prototype, {
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
      return this;
    }

  };

  Viewport.prototype.OFFSET_LEFT = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_TOP = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_WIDTH = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_HEIGHT = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_MAXWIDTH = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_MAXHEIGHT = Viewport.malloc(Float32Array);

  Viewport.prototype.OFFSET_FULLSCREEN = Viewport.malloc(Uint8Array);

  Object.defineProperties(Viewport.prototype, {
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

export var WebGL2 = (function() {
  class WebGL2 extends Pointer {
    create() {
      this.canvas = this.document.createElement("canvas");
      this.viewport = this.document.body.getBoundingClientRect();
      this.clearColor = [1, 0, 1, .5];
      return this.gl = this.canvas.getContext("webgl2");
    }

    getDocumentIndex() {
      return this.loadUint32(this.OFFSET_DOCUMENT);
    }

    setDocumentIndex() {
      return this.storeUint32(this.OFFSET_DOCUMENT, arguments[0]);
    }

    getCanvasIndex() {
      return this.loadUint32(this.OFFSET_CANVAS);
    }

    setCanvasIndex() {
      return this.storeUint32(this.OFFSET_CANVAS, arguments[0]);
    }

    getContextIndex() {
      return this.loadUint32(this.OFFSET_CONTEXT);
    }

    setContextIndex() {
      return this.storeUint32(this.OFFSET_CONTEXT, arguments[0]);
    }

  };

  WebGL2.byteLength = 4 * 24;

  WebGL2.prototype.OFFSET_DOCUMENT = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_CANVAS = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_CONTEXT = WebGL2.malloc(Uint32Array);

  WebGL2.prototype.OFFSET_VIEWPORT = WebGL2.malloc(Viewport);

  WebGL2.prototype.OFFSET_CLEARCOLOR = WebGL2.malloc(Color4);

  Object.defineProperties(WebGL2.prototype, {
    document: {
      get: function() {
        return this.loadObject(this.getDocumentIndex());
      },
      set: function() {
        return this.create(this.setDocumentIndex(this.storeObject(arguments[0])));
      }
    },
    canvas: {
      get: function() {
        return this.loadObject(this.getCanvasIndex());
      },
      set: function() {
        return this.setCanvasIndex(this.storeObject(arguments[0]));
      }
    },
    viewport: {
      get: function() {
        return new Viewport(this + this.OFFSET_VIEWPORT);
      },
      set: function() {
        return this.viewport.set(...arguments);
      }
    },
    clearColor: {
      get: function() {
        return new Color4(this + this.OFFSET_CLEARCOLOR);
      },
      set: function() {
        return this.clearColor.set(...arguments);
      }
    },
    gl: {
      get: function() {
        return this.loadObject(this.getContextIndex());
      },
      set: function() {
        return this.setContextIndex(this.storeObject(arguments[0]));
      }
    }
  });

  return WebGL2;

}).call(this);

export {
  Pointer as default
};
