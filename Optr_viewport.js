import {
  Optr,
  KeyBase
} from "./Optr.js";

export var VIEWPORT_KEYBASE = KeyBase.generate({
  LANDSCAPE_PRIMARY: "landscape-primary",
  BODY_VIEWPORT: "body-sized",
  CLIENT_VIEWPORT: "client-sized",
  AVAILABLE_VIEWPORT: "available-sized",
  SCREEN_VIEWPORT: "screen-sized",
  SCROLL_VIEWPORT: "scroll-sized",
  INNER_VIEWPORT: "inner-sized",
  OUTER_VIEWPORT: "outer-sized"
});

export var Viewport = (function() {
  class Viewport extends Optr {
    init(window, setFromBody = true) {
      var $bodyRect;
      this.angle = window.screen.orientation.angle;
      this.orientation = window.screen.orientation.type;
      this.isExtended = window.screen.isExtended;
      this.isFullscreen = window.document.fullscreenElement;
      this.pixelDepth = window.screen.pixelDepth;
      this.pixelRatio = window.devicePixelRatio || 1;
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      this.outerWidth = window.outerWidth;
      this.outerHeight = window.outerHeight;
      this.screenWidth = window.screen.width;
      this.screenHeight = window.screen.height;
      this.availWidth = window.screen.availWidth;
      this.availHeight = window.screen.availHeight;
      this.clientLeft = window.document.body.clientLeft;
      this.clientTop = window.document.body.clientTop;
      this.clientWidth = window.document.body.clientWidth;
      this.clientHeight = window.document.body.clientHeight;
      this.scrollLeft = window.document.body.scrollLeft;
      this.scrollTop = window.document.body.scrollTop;
      this.scrollWidth = window.document.body.scrollWidth;
      this.scrollHeight = window.document.body.scrollHeight;
      $bodyRect = window.document.body.getBoundingClientRect();
      this.bodyLeft = $bodyRect.left;
      this.bodyTop = $bodyRect.top;
      this.bodyRight = $bodyRect.right;
      this.bodyBottom = $bodyRect.bottom;
      this.bodyWidth = $bodyRect.width;
      this.bodyHeight = $bodyRect.height;
      if (window.resizedHandle == null) {
        window.resizedHandle = window.addEventListener("resize", window.resizedHandle = () => {
          clearTimeout(window.resizedDelay);
          return window.resizedDelay = setTimeout(() => {
            return this.init(window);
          }, 100);
        });
      }
      if (!!setFromBody) {
        this.setFromBody();
      }
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

    setFromBody() {
      this.left = this.bodyLeft;
      this.top = this.bodyTop;
      this.right = this.bodyRight;
      this.bottom = this.bodyBottom;
      this.width = this.bodyWidth;
      this.height = this.bodyHeight;
      this.viewportFrom = VIEWPORT_KEYBASE.BODY_VIEWPORT;
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

  Viewport.prototype.OFFSET_BODYLEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_BODYTOP = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_BODYRIGHT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_BODYBOTTOM = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_BODYWIDTH = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_BODYHEIGHT = Viewport.reserv(Uint16Array);

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
        if (!document.fullscreenElement && Boolean(arguments[0])) {
          return document.documentElement.requestFullscreen().then(() => {
            return this.setUint8(this.OFFSET_IS_FULLSCREEN, !!document.fullscreenElement);
          });
        }
        if (document.fullscreenElement && !Boolean(arguments[0])) {
          return document.exitFullscreen().then(() => {
            return this.setUint8(this.OFFSET_IS_FULLSCREEN, !!document.fullscreenElement);
          });
        }
        return this.setUint8(this.OFFSET_IS_FULLSCREEN, !!document.fullscreenElement);
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
    bodyLeft: {
      get: function() {
        return this.getUint16(this.OFFSET_BODYLEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BODYLEFT, arguments[0]);
      }
    },
    bodyTop: {
      get: function() {
        return this.getUint16(this.OFFSET_BODYTOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BODYTOP, arguments[0]);
      }
    },
    bodyRight: {
      get: function() {
        return this.getUint16(this.OFFSET_BODYRIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BODYRIGHT, arguments[0]);
      }
    },
    bodyBottom: {
      get: function() {
        return this.getUint16(this.OFFSET_BODYBOTTOM);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BODYBOTTOM, arguments[0]);
      }
    },
    bodyWidth: {
      get: function() {
        return this.getUint16(this.OFFSET_BODYWIDTH);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BODYWIDTH, arguments[0]);
      }
    },
    bodyHeight: {
      get: function() {
        return this.getUint16(this.OFFSET_BODYHEIGHT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_BODYHEIGHT, arguments[0]);
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

export {
  Viewport as default
};
