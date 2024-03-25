var Context, INDEX_CONTEXT_CANVAS, INDEX_CONTEXT_GL, INDEX_PROGRAM_GL, INDEX_PROGRAM_LINK, Program;

import {
  Pointer
} from "./pointer.js";

//? --------------------------------------------- ?#
//?                 Context Context                    ?#
//? --------------------------------------------- ?#
Context = class Context extends Pointer.Float32Array {};

INDEX_CONTEXT_GL = Context.ialloc(Uint32Array);

INDEX_CONTEXT_CANVAS = Context.ialloc(Uint32Array);

Object.defineProperties(Context, {
  byteLength: {
    value: 4 * 2
  }
});

Object.defineProperties(Context.prototype, {
  init: {
    value: function() {
      this.createCanvas();
      return this.createContext();
    }
  },
  add: {
    value: function(ptr) {
      ptr.setParent(this).gl = this.getContext();
      return this;
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
  }
});

//? --------------------------------------------- ?#
//?                 Context Program                    ?#
//? --------------------------------------------- ?#
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
  Program
};
