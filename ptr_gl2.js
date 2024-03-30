var VIEWPORT_KEYBASE;

import {
  Float32Array
} from "./window.js";

import {
  Optr,
  KeyBase
} from "./Optr.js";

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

VIEWPORT_KEYBASE = KeyBase.generate({
  LANDSCAPE_PRIMARY: "landscape-primary",
  BOUNDING_RECT_VIEWPORT: "bounding-rect-sized",
  CLIENT_VIEWPORT: "client-sized",
  AVAILABLE_VIEWPORT: "available-sized",
  SCREEN_VIEWPORT: "screen-sized",
  SCROLL_VIEWPORT: "scroll-sized",
  INNER_VIEWPORT: "inner-sized",
  OUTER_VIEWPORT: "outer-sized"
});

export var Viewport = (function() {
  class Viewport extends Optr {
    readWindow(window) {
      var boundingRect;
      this.angle = window.screen.orientation.angle;
      this.orientation = window.screen.orientation.type;
      this.isExtended = window.screen.isExtended;
      this.pixelDepth = window.screen.pixelDepth;
      this.pixelRatio = window.devicePixelRatio || 1;
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      this.outerWidth = window.outerWidth;
      this.outerHeight = window.outerHeight;
      this.screenWidth = window.screen.width;
      this.screenHeight = window.screen.height;
      this.availWidth = window.screen.availWidth;
      this.availHeigth = window.screen.availHeigth;
      this.clientLeft = window.document.body.clientLeft;
      this.clientTop = window.document.body.clientTop;
      this.clientWidth = window.document.body.clientWidth;
      this.clientHeight = window.document.body.clientHeight;
      this.scrollLeft = window.document.body.scrollLeft;
      this.scrollTop = window.document.body.scrollTop;
      this.scrollWidth = window.document.body.scrollWidth;
      this.scrollHeight = window.document.body.scrollHeight;
      boundingRect = window.document.body.getBoundingClientRect();
      this.rectLeft = boundingRect.left;
      this.rectTop = boundingRect.top;
      this.rectRight = boundingRect.right;
      this.rectBottom = boundingRect.bottom;
      this.rectWidth = boundingRect.width;
      this.rectHeight = boundingRect.height;
      return this;
    }

    setFromClient() {
      this.left = this.clientLeft;
      this.top = this.clientTop;
      this.right = 0;
      this.bottom = 0;
      this.width = this.clientWidth;
      this.height = this.clientHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.CLIENT_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromInner() {
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.width = this.innerWidth;
      this.height = this.innerHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.INNER_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromOuter() {
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.width = this.outerWidth;
      this.height = this.outerHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.INNER_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromAvailable() {
      this.left = this.availLeft;
      this.top = this.availTop;
      this.right = 0;
      this.bottom = 0;
      this.width = this.availWidth;
      this.height = this.availHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.AVAILABLE_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromScreen() {
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.width = this.screenWidth;
      this.height = this.screenHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.SCREEN_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromBoundingRect() {
      this.left = this.rectLeft;
      this.top = this.rectTop;
      this.right = this.rectRight;
      this.bottom = this.rectBottom;
      this.width = this.rectWidth;
      this.height = this.rectHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.BOUNDING_RECT_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromScroll() {
      this.left = this.scrollLeft;
      this.top = this.scrollTop;
      this.right = 0;
      this.bottom = 0;
      this.width = this.screenWidth;
      this.height = this.scrollHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.SCROLL_VIEWPORT;
      return this.updateRatioValues();
    }

    updateRatioValues() {
      this.widthDpr = this.width * this.pixelRatio;
      this.heightDpr = this.height * this.pixelRatio;
      this.aspectRatio = this.width / this.height;
      this.isActive = true;
      return this;
    }

  };

  Viewport.prototype.OFFSET_IS_ACTIVE = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_IS_FULLSCREEN = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_VIEWPORT_FROM = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_LEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_TOP = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_WIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_BOTTOM = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_HEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_WIDTH_DPR = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_HEIGHT_DPR = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_CLIENTLEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_CLIENTTOP = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_CLIENTWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_CLIENTHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RECTLEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RECTTOP = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RECTRIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RECTBOTTOM = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RECTWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_RECTHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCROLLLEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCROLLTOP = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCROLLWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCROLLHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_INNERWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_INNERHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_OUTERWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_OUTERHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCREENWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCREENHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_AVAILLEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_AVAILTOP = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_AVAILWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_AVAILHEIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_PIXEL_RATIO = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_PIXEL_DEPTH = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_ASPECT_RATIO = Viewport.reserv(Float32Array);

  Viewport.prototype.OFFSET_ANGLE = Viewport.reserv(Float32Array);

  Viewport.prototype.OFFSET_IS_EXTENDED = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_ORIENTATION = Viewport.reserv(Uint8Array);

  Object.defineProperties(Viewport.prototype, {
    isActive: {
      get: function() {
        return this.getUint8(this.OFFSET_IS_ACTIVE);
      },
      set: function() {
        return this.setUint8(this.OFFSET_IS_ACTIVE, arguments[0]);
      }
    },
    isFullscreen: {
      get: function() {
        return this.getUint8(this.OFFSET_IS_FULLSCREEN);
      },
      set: function() {
        return this.setUint8(this.OFFSET_IS_FULLSCREEN, arguments[0]);
      }
    },
    viewportFrom: {
      get: function() {
        return this.keyUint16(this.OFFSET_VIEWPORT_FROM, VIEWPORT_KEYBASE);
      },
      set: function() {
        return this.setUint16(this.OFFSET_VIEWPORT_FROM, VIEWPORT_KEYBASE[arguments[0]]);
      }
    },
    left: {
      get: function() {
        return this.getUint16(this.OFFSET_LEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_LEFT, arguments[0]);
      }
    },
    top: {
      get: function() {
        return this.getUint16(this.OFFSET_TOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_TOP, arguments[0]);
      }
    },
    right: {
      get: function() {
        return this.getUint16(this.OFFSET_RIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RIGHT, arguments[0]);
      }
    },
    bottom: {
      get: function() {
        return this.getUint16(this.OFFSET_BOTTOM);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BOTTOM, arguments[0]);
      }
    },
    width: {
      get: function() {
        return this.getUint16(this.OFFSET_WIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_WIDTH, arguments[0]);
      }
    },
    height: {
      get: function() {
        return this.getUint16(this.OFFSET_HEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_HEIGHT, arguments[0]);
      }
    },
    widthDpr: {
      get: function() {
        return this.getUint16(this.OFFSET_WIDTH_DPR);
      },
      set: function() {
        return this.setUint16(this.OFFSET_WIDTH_DPR, arguments[0]);
      }
    },
    heightDpr: {
      get: function() {
        return this.getUint16(this.OFFSET_HEIGHT_DPR);
      },
      set: function() {
        return this.setUint16(this.OFFSET_HEIGHT_DPR, arguments[0]);
      }
    },
    clientLeft: {
      get: function() {
        return this.getUint16(this.OFFSET_CLIENTLEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_CLIENTLEFT, arguments[0]);
      }
    },
    clientTop: {
      get: function() {
        return this.getUint16(this.OFFSET_CLIENTTOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_CLIENTTOP, arguments[0]);
      }
    },
    clientWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_CLIENTWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_CLIENTWIDTH, arguments[0]);
      }
    },
    clientHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_CLIENTHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_CLIENTHEIGHT, arguments[0]);
      }
    },
    rectLeft: {
      get: function() {
        return this.getUint16(this.OFFSET_RECTLEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RECTLEFT, arguments[0]);
      }
    },
    rectTop: {
      get: function() {
        return this.getUint16(this.OFFSET_RECTTOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RECTTOP, arguments[0]);
      }
    },
    rectRight: {
      get: function() {
        return this.getUint16(this.OFFSET_RECTRIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RECTRIGHT, arguments[0]);
      }
    },
    rectBottom: {
      get: function() {
        return this.getUint16(this.OFFSET_RECTBOTTOM);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RECTBOTTOM, arguments[0]);
      }
    },
    rectWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_RECTWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RECTWIDTH, arguments[0]);
      }
    },
    rectHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_RECTHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_RECTHEIGHT, arguments[0]);
      }
    },
    scrollLeft: {
      get: function() {
        return this.getUint16(this.OFFSET_SCROLLLEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCROLLLEFT, arguments[0]);
      }
    },
    scrollTop: {
      get: function() {
        return this.getUint16(this.OFFSET_SCROLLTOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCROLLTOP, arguments[0]);
      }
    },
    scrollWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_SCROLLWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCROLLWIDTH, arguments[0]);
      }
    },
    scrollHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_SCROLLHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCROLLHEIGHT, arguments[0]);
      }
    },
    availLeft: {
      get: function() {
        return this.getUint16(this.OFFSET_AVAILLEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_AVAILLEFT, arguments[0]);
      }
    },
    availTop: {
      get: function() {
        return this.getUint16(this.OFFSET_AVAILTOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_AVAILTOP, arguments[0]);
      }
    },
    availWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_AVAILWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_AVAILWIDTH, arguments[0]);
      }
    },
    availHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_AVAILHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_AVAILHEIGHT, arguments[0]);
      }
    },
    innerWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_INNERWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_INNERHEIGHT, arguments[0]);
      }
    },
    innerHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_INNERHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_INNERHEIGHT, arguments[0]);
      }
    },
    outerWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_OUTERWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_OUTERWIDTH, arguments[0]);
      }
    },
    outerHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_OUTERHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_OUTERHEIGHT, arguments[0]);
      }
    },
    screenWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_SCREENWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCREENWIDTH, arguments[0]);
      }
    },
    screenHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_SCREENHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCREENHEIGHT, arguments[0]);
      }
    },
    pixelRatio: {
      get: function() {
        return this.getUint8(this.OFFSET_PIXEL_RATIO);
      },
      set: function() {
        return this.setUint8(this.OFFSET_PIXEL_RATIO, arguments[0]);
      }
    },
    pixelDepth: {
      get: function() {
        return this.getUint8(this.OFFSET_PIXEL_DEPTH);
      },
      set: function() {
        return this.setUint8(this.OFFSET_PIXEL_DEPTH, arguments[0]);
      }
    },
    aspectRatio: {
      get: function() {
        return this.getFloat32(this.OFFSET_ASPECT_RATIO);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_ASPECT_RATIO, arguments[0]);
      }
    },
    angle: {
      get: function() {
        return this.getFloat32(this.OFFSET_ANGLE);
      },
      set: function() {
        return this.setFloat32(this.OFFSET_ANGLE, arguments[0]);
      }
    },
    isExtended: {
      get: function() {
        return this.getUint8(this.OFFSET_IS_EXTENDED);
      },
      set: function() {
        return this.setUint8(this.OFFSET_IS_EXTENDED, arguments[0]);
      }
    },
    orientation: {
      get: function() {
        return this.keyUint16(this.OFFSET_ORIENTATION, VIEWPORT_KEYBASE);
      },
      set: function() {
        return this.setUint16(this.OFFSET_ORIENTATION, VIEWPORT_KEYBASE[arguments[0]]);
      }
    }
  });

  return Viewport;

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

  Display.prototype.OFFSET_VIEWPORT = Display.reserv(Uint32Array);

  Display.filter({
    children: Context
  });

  Object.defineProperties(Display.prototype, {
    viewport: {
      get: function() {
        return this.ptrUint32(this.OFFSET_VIEWPORT, Viewport);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_VIEWPORT, arguments[0]);
      }
    },
    document: {
      get: function() {
        return this.objUint32(this.OFFSET_DOCUMENT);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_DOCUMENT, this.scopei(arguments[0]));
      }
    }
  });

  return Display;

}).call(this);
