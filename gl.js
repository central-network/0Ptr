var GL, INDEX_CANVAS, INDEX_CONTEXT;

GL = class GL extends Pointer.Float32Array {};

INDEX_CANVAS = GL.palloc(Uint16Array);

INDEX_CONTEXT = GL.palloc(Uint16Array);

Object.defineProperties(GL.class, {
  byteLength: {
    value: 4 * 48
  }
});

Object.defineProperties(GL.prototype, {
  init: {
    value: function() {
      return this.createCanvas().createContext();
    }
  }
});

Object.defineProperties(GL.prototype, {
  getCanvas: {
    value: function() {
      return this.proxy(this.loadUint16(INDEX_CANVAS));
    }
  },
  setCanvas: {
    value: function() {
      return this.storeUint16(INDEX_CANVAS, this.store(arguments[0]));
    }
  },
  getContext: {
    value: function() {
      return this.proxy(this.loadUint16(INDEX_CONTEXT));
    }
  },
  setContext: {
    value: function() {
      return this.storeUint16(INDEX_CONTEXT, this.store(arguments[0]));
    }
  },
  createCanvas: {
    value: function() {
      return this.setCanvas(document.createElement("canvas"));
    }
  },
  createContext: {
    value: function() {
      return this.setContext(this.canvas.getContext("webgl2"));
    }
  }
});

Object.defineProperties(GL.prototype, {
  canvas: {
    get: GL.prototype.getCanvas,
    set: GL.prototype.setCanvas
  },
  context: {
    get: GL.prototype.getContext,
    set: GL.prototype.setContext
  }
});

export {
  GL as default,
  GL
};
