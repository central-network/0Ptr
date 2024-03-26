var Context, INDEX_CONTEXT_CANVAS, INDEX_CONTEXT_GL, INDEX_PROGRAM_GL, INDEX_PROGRAM_LINK, OFFSET_HEIGHT, OFFSET_LEFT, OFFSET_TOP, OFFSET_VIEWPORT, OFFSET_WIDTH, Program, Viewport;

import {
  Pointer,
  OffsetPointer
} from "./pointer.js";

//? --------------------------------------------- ?#
//?                 Context Context                    ?#
//? --------------------------------------------- ?#
Context = class Context extends Pointer.Float32Array {};

INDEX_CONTEXT_GL = Context.ialloc(Uint32Array);

INDEX_CONTEXT_CANVAS = Context.ialloc(Uint32Array);

OFFSET_VIEWPORT = 0;

Object.defineProperties(Context, {
  byteLength: {
    value: 4 * 24
  }
});

Object.defineProperties(Context.prototype, {
  init: {
    value: function() {
      this.createCanvas();
      this.createContext();
      this.appendChild();
      return this.setViewport();
    }
  },
  add: {
    value: function(ptr) {
      ptr.setParent(this).gl = this.getContext();
      return this;
    }
  },
  setViewport: {
    value: function(fullscreen = true) {
      var aRatio, height, left, pRatio, top, width;
      if (fullscreen === true) {
        left = 0;
        top = 0;
        width = innerWidth;
        height = innerHeight;
      }
      aRatio = width / height;
      pRatio = typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1;
      this.canvas.style.width = CSS.px(width);
      this.canvas.style.height = CSS.px(height);
      this.canvas.width = width * pRatio;
      this.canvas.height = height * pRatio;
      return this.gl.viewport(this.viewport.left = left, this.viewport.top = top, this.viewport.width = width, this.viewport.height = height);
    }
  },
  appendChild: {
    value: function() {
      return document.body.appendChild(this.canvas);
    }
  },
  createCanvas: {
    value: function() {
      return this.canvas = document.createElement("canvas");
    }
  },
  createContext: {
    value: function() {
      return this.gl = this.canvas.getContext("webgl2");
    }
  }
});

Object.defineProperties(Context.prototype, {
  getCanvas: {
    value: function() {
      return this.loadUint32(INDEX_CONTEXT_CANVAS);
    }
  },
  setCanvas: {
    value: function() {
      return this.storeUint32(INDEX_CONTEXT_CANVAS, arguments[0]);
    }
  },
  getContext: {
    value: function() {
      return this.loadUint32(INDEX_CONTEXT_GL);
    }
  },
  setContext: {
    value: function() {
      return this.storeUint32(INDEX_CONTEXT_GL, arguments[0]);
    }
  }
});

Object.defineProperties(Context.prototype, {
  gl: {
    get: function() {
      return this.proxy(this.getContext());
    },
    set: function() {
      return this.setContext(this.store(arguments[0]));
    }
  },
  canvas: {
    get: function() {
      return this.proxy(this.getCanvas());
    },
    set: function() {
      return this.setCanvas(this.store(arguments[0]));
    }
  },
  viewport: {
    get: function() {
      return new Viewport(this.offset(OFFSET_VIEWPORT));
    }
  }
});

Viewport = class Viewport extends OffsetPointer {};

OFFSET_WIDTH = 4 * 0;

OFFSET_HEIGHT = 4 * 1;

OFFSET_TOP = 4 * 2;

OFFSET_LEFT = 4 * 3;

Object.defineProperties(Viewport.scopei().prototype, {
  width: {
    get: function() {
      return this.getFloat32(OFFSET_WIDTH);
    },
    set: function() {
      return this.setFloat32(OFFSET_WIDTH, arguments[0]);
    }
  },
  height: {
    get: function() {
      return this.getFloat32(OFFSET_HEIGHT);
    },
    set: function() {
      return this.setFloat32(OFFSET_HEIGHT, arguments[0]);
    }
  },
  top: {
    get: function() {
      return this.getFloat32(OFFSET_TOP);
    },
    set: function() {
      return this.setFloat32(OFFSET_TOP, arguments[0]);
    }
  },
  left: {
    get: function() {
      return this.getFloat32(OFFSET_LEFT);
    },
    set: function() {
      return this.setFloat32(OFFSET_LEFT, arguments[0]);
    }
  }
});

Program = class Program extends Pointer {};

INDEX_PROGRAM_GL = Program.ialloc(Uint32Array);

INDEX_PROGRAM_LINK = Program.ialloc(Uint32Array);

Object.defineProperties(Program.prototype, {
  createProgram: {
    value: function() {
      return this.program = this.gl.createProgram();
    }
  }
});

Object.defineProperties(Program.prototype, {
  getProgram: {
    value: function() {
      return this.loadUint32(INDEX_PROGRAM_LINK);
    }
  },
  setProgram: {
    value: function() {
      return this.storeUint32(INDEX_PROGRAM_LINK, arguments[0]);
    }
  },
  getContext: {
    value: function() {
      return this.loadUint32(INDEX_PROGRAM_GL);
    }
  },
  setContext: {
    value: function() {
      return this.storeUint32(INDEX_PROGRAM_GL, arguments[0]);
    }
  }
});

Object.defineProperties(Program.prototype, {
  program: {
    get: function() {
      return this.proxy(this.getProgram());
    },
    set: function() {
      return this.setProgram(this.store(arguments[0]));
    }
  },
  gl: {
    get: function() {
      return this.proxy(this.getContext());
    },
    set: function() {
      return this.createProgram(this.setContext(arguments[0]));
    }
  }
});

export {
  Context as default,
  Context,
  Program,
  Viewport
};
