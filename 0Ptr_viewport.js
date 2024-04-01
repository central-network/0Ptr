var kBody, kDocument, kScreen, kWindow;

import {
  AtomicScope
} from "./0Ptr_scope.js";

import {
  KeyBase
} from "./0Ptr_keybase.js";

import {
  OPtr
} from "./0Ptr.js";

kScreen = "#screen";

kWindow = "#window";

kDocument = "$document";

kBody = "$body";

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
  class Viewport extends OPtr {
    bind(window) {
      this[kWindow] = window;
      this.init().bindWindowEvents();
      return this;
    }

    init() {
      var $bodyRect;
      this.angle = this[kScreen].orientation.angle;
      this.orientation = this[kScreen].orientation.type;
      this.isExtended = this[kScreen].isExtended;
      this.pixelDepth = this[kScreen].pixelDepth;
      this.pixelRatio = this[kWindow].devicePixelRatio || 1;
      this.innerWidth = this[kWindow].innerWidth;
      this.innerHeight = this[kWindow].innerHeight;
      this.outerWidth = this[kWindow].outerWidth;
      this.outerHeight = this[kWindow].outerHeight;
      this.screenLeft = this[kWindow].screenLeft;
      this.screenTop = this[kWindow].screenTop;
      this.screenWidth = this[kScreen].width;
      this.screenHeight = this[kScreen].height;
      this.availWidth = this[kScreen].availWidth;
      this.availHeight = this[kScreen].availHeight;
      this.clientLeft = this[kBody].clientLeft;
      this.clientTop = this[kBody].clientTop;
      this.clientWidth = this[kBody].clientWidth;
      this.clientHeight = this[kBody].clientHeight;
      this.scrollLeft = this[kBody].scrollLeft;
      this.scrollTop = this[kBody].scrollTop;
      this.scrollWidth = this[kBody].scrollWidth;
      this.scrollHeight = this[kBody].scrollHeight;
      $bodyRect = this[kBody].getBoundingClientRect();
      this.bodyLeft = $bodyRect.left;
      this.bodyTop = $bodyRect.top;
      this.bodyRight = $bodyRect.right;
      this.bodyBottom = $bodyRect.bottom;
      this.bodyWidth = $bodyRect.width;
      this.bodyHeight = $bodyRect.height;
      this.isFullscreen = this.checkFullscreen();
      this.setFromBody();
      return this;
    }

    bindWindowEvents() {
      var callback, timeouts;
      if (!this.isListening && (this.isListening = 1)) {
        timeouts = [];
        callback = function() {
          var i, j, len, ref;
          ref = timeouts.slice();
          for (i = 0, len = ref.length; i < len; i++) {
            j = ref[i];
            clearTimeout(j, timeouts.splice(j, 1));
          }
          return timeouts[timeouts.length] = setTimeout(this.init.bind(this), 1000);
        };
        this[kWindow].addEventListener("resize", callback.bind(this));
        this[kDocument].addEventListener("fullscreenerror", callback.bind(this));
        this[kDocument].addEventListener("fullscreenchange", callback.bind(this));
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
      this.type = VIEWPORT_KEYBASE.CLIENT_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromInner() {
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.width = this.innerWidth;
      this.height = this.innerHeight;
      this.type = VIEWPORT_KEYBASE.INNER_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromOuter() {
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.width = this.outerWidth;
      this.height = this.outerHeight;
      this.type = VIEWPORT_KEYBASE.INNER_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromAvailable() {
      this.left = this.availLeft;
      this.top = this.availTop;
      this.right = 0;
      this.bottom = 0;
      this.width = this.availWidth;
      this.height = this.availHeight;
      this.type = VIEWPORT_KEYBASE.AVAILABLE_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromScreen() {
      this.left = this.screenLeft;
      this.top = this.screenTop;
      this.right = 0;
      this.bottom = 0;
      this.width = this.screenWidth;
      this.height = this.screenHeight;
      this.type = VIEWPORT_KEYBASE.SCREEN_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromBody() {
      this.left = this.bodyLeft;
      this.top = this.bodyTop;
      this.right = this.bodyRight;
      this.bottom = this.bodyBottom;
      this.width = this.bodyWidth;
      this.height = this.bodyHeight;
      this.type = VIEWPORT_KEYBASE.BODY_VIEWPORT;
      return this.updateRatioValues();
    }

    setFromScroll() {
      this.left = this.scrollLeft;
      this.top = this.scrollTop;
      this.right = 0;
      this.bottom = 0;
      this.width = this.scrollWidth;
      this.height = this.scrollHeight;
      this.type = VIEWPORT_KEYBASE.SCROLL_VIEWPORT;
      return this.updateRatioValues();
    }

    updateRatioValues() {
      this.widthDpr = this.width * this.pixelRatio;
      this.heightDpr = this.height * this.pixelRatio;
      this.aspectRatio = this.width / this.height;
      this.isActive = true;
      return this;
    }

    async requestFullscreen() {
      try {
        return (await this[kDocument].documentElement.requestFullscreen());
      } catch (error) {}
    }

    async exitFullscreen() {
      try {
        return (await this[kDocument].exitFullscreen());
      } catch (error) {}
    }

    checkFullscreen() {
      if (this.fullscreenElement) {
        return 1;
      }
      if (0 < this.innerHeight && this.outerHeight > 0) {
        if (this.innerHeight === this.outerHeight) {
          return 1;
        }
      }
      return 0;
    }

    async toggleFullscreen() {
      var $targetMode, ref;
      this.isUpdating = 1;
      $targetMode = (ref = arguments[0]) != null ? ref : !this.checkFullscreen();
      if (!$targetMode) {
        await this.exitFullscreen();
      } else {
        await this.requestFullscreen();
      }
      this.fullscreenEnabled = this[kDocument].fullscreenEnabled;
      this.fullscreenElement = this[kDocument].fullscreenElement;
      this.isUpdating = 0;
      return this.isFullscreen = this.checkFullscreen();
    }

  };

  Viewport.metaUrl = import.meta.url;

  Viewport.prototype.OFFSET_WINDOW = Viewport.reserv(Uint32Array);

  Viewport.prototype.OFFSET_IS_ACTIVE = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_IS_LISTENING = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_IS_UPDATING = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_TIMEOUT_ID = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_FULLSCREEN_ENABLE = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_FULLSCREEN_NODE = Viewport.reserv(Uint32Array);

  Viewport.prototype.OFFSET_IS_FULLSCREEN = Viewport.reserv(Uint8Array);

  Viewport.prototype.OFFSET_TYPE = Viewport.reserv(Uint16Array);

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

  Viewport.prototype.OFFSET_SCREENLEFT = Viewport.reserv(Uint16Array);

  Viewport.prototype.OFFSET_SCREENTOP = Viewport.reserv(Uint16Array);

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
    [kBody]: {
      get: function() {
        return this[kDocument].body;
      }
    },
    [kScreen]: {
      get: function() {
        return this[kWindow].screen;
      }
    },
    [kDocument]: {
      get: function() {
        return this[kWindow].document;
      }
    },
    [kWindow]: {
      get: function() {
        return this.objUint32(this.OFFSET_WINDOW);
      },
      set: function() {
        return this.setUint32(this.OFFSET_WINDOW, this.scopei(arguments[0]));
      }
    },
    fullscreenEnabled: {
      get: function() {
        return this.loadUint8(this.OFFSET_FULLSCREEN_ENABLE);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_FULLSCREEN_ENABLE, arguments[0]);
      }
    },
    fullscreenElement: {
      get: function() {
        return this.objUint32(this.OFFSET_FULLSCREEN_NODE);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_FULLSCREEN_NODE, this.scopei(arguments[0]));
      }
    },
    isActive: {
      get: function() {
        return this.getUint8(this.OFFSET_IS_ACTIVE);
      },
      set: function() {
        return this.setUint8(this.OFFSET_IS_ACTIVE, arguments[0]);
      }
    },
    isUpdating: {
      get: function() {
        return this.loadUint8(this.OFFSET_IS_UPDATING);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_IS_UPDATING, arguments[0]);
      }
    },
    isListening: {
      get: function() {
        return this.getUint8(this.OFFSET_IS_LISTENING);
      },
      set: function() {
        return this.setUint8(this.OFFSET_IS_LISTENING, arguments[0]);
      }
    },
    isFullscreen: {
      get: function() {
        return this.getUint8(this.OFFSET_IS_FULLSCREEN);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_IS_FULLSCREEN, arguments[0]);
      }
    },
    type: {
      get: function() {
        return this.keyUint16(this.OFFSET_TYPE, VIEWPORT_KEYBASE);
      },
      set: function() {
        return this.setUint16(this.OFFSET_TYPE, VIEWPORT_KEYBASE[arguments[0]]);
      }
    },
    timeoutId: {
      get: function() {
        return this.loadUint16(this.OFFSET_TIMEOUT_ID);
      },
      set: function() {
        return this.storeUint16(this.OFFSET_TIMEOUT_ID, arguments[0]);
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
    screenLeft: {
      get: function() {
        return this.getUint16(this.OFFSET_SCREENLEFT);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCREENLEFT, arguments[0]);
      }
    },
    screenTop: {
      get: function() {
        return this.getUint16(this.OFFSET_SCREENTOP);
      },
      set: function() {
        return this.setUint16(this.OFFSET_SCREENTOP, arguments[0]);
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
