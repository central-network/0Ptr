var error, log, warn;

import {
  Pointer,
  Int32Number,
  StringPointer,
  ObjectPointer,
  Uint8ArrayPointer,
  Int32ArrayPointer,
  ClassPointer
} from "./0ptr.js";

import * as OPTR from "./0ptr.js";

({log, warn, error} = console);

export var Window = (function() {
  class Window extends ObjectPointer {
    createCanvas(append = true) {
      return this.document.createElement("canvas", append, HTMLCanvasElement);
    }

  };

  Window.classPointer = ClassPointer.from(Window);

  return Window;

}).call(this);

export var HTMLElement = (function() {
  class HTMLElement extends ObjectPointer {
    appendChild(ptri, nodeAppend = true) {
      var primitive;
      primitive = ptri.toPrimitive();
      if (nodeAppend && (false === primitive.isConnected)) {
        this.toPrimitive().appendChild(primitive);
      }
      return super.appendChild(ptri);
    }

  };

  HTMLElement.classPointer = ClassPointer.from(HTMLElement);

  return HTMLElement;

}).call(this);

export var HTMLCanvasElement = (function() {
  class HTMLCanvasElement extends HTMLElement {
    getContext(type = this.contextType) {
      var context, object;
      type = ["webgl2", "webgpu", "webnn"][type];
      context = this.find(function(ptri) {
        var name, test;
        if (ptri instanceof CanvasContext) {
          name = ptri.constructor.name;
          test = new RegExp(type, "i");
          return name.match(test);
        }
        return false;
      });
      if (!context && (object = this.toPrimitive().getContext(type))) {
        context = (function() {
          switch (type) {
            case "webgl2":
              return WebGL2RenderingContext.from(object);
          }
        })();
      }
      if (this.hasContext = Boolean(context)) {
        return this.appendChild(context);
      }
      throw /CTXERR/;
    }

  };

  HTMLCanvasElement.classPointer = ClassPointer.from(HTMLCanvasElement);

  return HTMLCanvasElement;

}).call(this);

export var CanvasContext = (function() {
  class CanvasContext extends ObjectPointer {};

  CanvasContext.classPointer = ClassPointer.from(CanvasContext);

  return CanvasContext;

}).call(this);

export var WebGL2RenderingContext = (function() {
  class WebGL2RenderingContext extends CanvasContext {};

  WebGL2RenderingContext.classPointer = ClassPointer.from(WebGL2RenderingContext);

  return WebGL2RenderingContext;

}).call(this);

export var HTMLBodyElement = (function() {
  class HTMLBodyElement extends HTMLElement {};

  HTMLBodyElement.classPointer = ClassPointer.from(HTMLBodyElement);

  return HTMLBodyElement;

}).call(this);

export var HTMLDocument = (function() {
  class HTMLDocument extends HTMLElement {
    createElement(tagName, append = true, Proto = HTMLElement) {
      var ptri;
      ptri = Proto.from(this.toPrimitive().createElement(tagName));
      if (append) {
        this.body.appendChild(ptri);
      }
      return ptri;
    }

  };

  HTMLDocument.classPointer = ClassPointer.from(HTMLDocument);

  return HTMLDocument;

}).call(this);

Object.defineProperty(Window.prototype, "document", {
  enumerable: true,
  get: function() {
    var ptri;
    if (!(ptri = this.find(function(i) {
      return i instanceof HTMLDocument;
    }))) {
      ptri = HTMLDocument.from(this.toPrimitive().document);
      this.appendChild(ptri);
    }
    return ptri;
  }
});

Object.defineProperty(HTMLDocument.prototype, "body", {
  enumerable: true,
  get: function() {
    var ptri;
    if (!(ptri = this.find(function(i) {
      return i instanceof HTMLBodyElement;
    }))) {
      ptri = HTMLBodyElement.from(this.toPrimitive().body);
      this.appendChild(ptri);
    }
    return ptri;
  }
});

HTMLCanvasElement.definePointer("contextType", {
  enumerable: true,
  instanceOf: OPTR.Uint8Number
});

HTMLCanvasElement.definePointer("width", {
  enumerable: true,
  instanceOf: OPTR.Int16Number
});

HTMLCanvasElement.definePointer("height", {
  enumerable: true,
  instanceOf: OPTR.Int16Number
});

HTMLCanvasElement.definePointer("hasContext", {
  enumerable: true,
  instanceOf: OPTR.BooleanAtomic
});

HTMLCanvasElement.definePointer("backgroundColor", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.Uint8ArrayPointer
});

HTMLCanvasElement.defineProperty("context", {
  byteLength: 4,
  enumerable: true,
  get: function(propertyName, desc = {}) {
    var byteOffset;
    byteOffset = desc.byteOffset;
    return function() {
      var ptri;
      if (ptri = this.getUint32(byteOffset)) {
        return Pointer.of(ptri);
      }
      return this[propertyName] = this.getContext(this.contextType);
    };
  },
  set: function(propertyName, desc = {}) {
    var byteOffset;
    byteOffset = desc.byteOffset;
    return function(value) {
      return this.setUint32(byteOffset, value);
    };
  }
});

CanvasContext.definePointer("pointSize", {
  enumerable: true,
  instanceOf: OPTR.Float32Number
});
