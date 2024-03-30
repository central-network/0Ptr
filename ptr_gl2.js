import Optr from "./Optr.js";

export var Color4 = (function() {
  class Color4 extends Optr {};

  Color4.prototype.OFFSET_RED = Color4.reserv(Float32Array);

  Color4.prototype.OFFSET_GREEN = Color4.reserv(Float32Array);

  Color4.prototype.OFFSET_BLUE = Color4.reserv(Float32Array);

  Color4.prototype.OFFSET_ALPHA = Color4.reserv(Float32Array);

  return Color4;

}).call(this);

export var Program = (function() {
  class Program extends Optr {};

  Program.prototype.OFFSET_CONTEXT = Program.reserv(Uint32Array);

  Program.prototype.OFFSET_ISLINKED = Program.reserv(Uint8Array);

  return Program;

}).call(this);

export var Context = (function() {
  class Context extends Optr {
    init() {
      return this.canvas = this.createCanvas();
    }

    createCanvas() {
      return this.display.document.createElement("canvas");
    }

  };

  Context.prototype.OFFSET_RENDERING = Context.reserv(Uint8Array);

  Context.prototype.OFFSET_CANVAS = Context.reserv(Uint32Array);

  Context.prototype.OFFSET_DISPLAY = Context.reserv(Uint32Array);

  Context.prototype.OFFSET_CLEARCOLOR = Context.reserv(Color4);

  Context.prototype.OFFSET_CLEARMASK = Context.reserv(Uint16Array);

  Object.defineProperties(Context.prototype, {
    display: {
      get: function() {
        return this.ptrParent(Display);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_DOCUMENT, arguments[0]);
      }
    },
    canvas: {
      get: function() {
        return this.objUint32(this.OFFSET_CANVAS);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_CANVAS, this.scopei(arguments[0]));
      }
    }
  });

  return Context;

}).call(this);

export var Display = (function() {
  class Display extends Optr {
    init(document) {
      var context;
      this.document = document;
      context = new Context();
      context.attach(this);
      context.init();
      return context.createCanvas();
    }

  };

  Display.prototype.OFFSET_UUID = Display.reserv(Uint8Array, 36);

  Display.prototype.OFFSET_DOCUMENT = Display.reserv(Uint32Array);

  Display.prototype.OFFSET_CONTEXT = Display.reserv(Uint32Array);

  Display.prototype.OFFSET_CONTEXT = Display.reserv(Uint32Array);

  Display.prototype.OFFSET_PROGRAM = Display.reserv(Uint32Array);

  Object.defineProperties(Display.prototype, {
    document: {
      get: function() {
        return this.objUint32(this.OFFSET_DOCUMENT);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_DOCUMENT, this.scopei(arguments[0]));
      }
    }
  });

  Display.definePreparedDesc("children");

  return Display;

}).call(this);
