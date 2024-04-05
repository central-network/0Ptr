export var Window = class Window {
  constructor(thread) {
    var document;
    Object.defineProperties(self, {
      window: {
        value: this
      },
      thread: {
        value: thread
      },
      document: {
        value: new (document = class document extends HTMLDocument {})
      }
    });
    Object.defineProperties(Window.prototype, {
      self: {
        value: self
      },
      document: {
        value: self.document
      },
      lock: {
        value: function() {
          var i32;
          i32 = new Int32Array(thread.buffer);
          Atomics.wait(i32, self.name);
          return Atomics.load(i32, self.name);
        }
      },
      post: {
        value: function() {
          postMessage(arguments[0]);
          return this.lock();
        }
      },
      loadInt32: {
        value: function() {
          var i32;
          i32 = new Int32Array(thread.buffer);
          return Atomics.load(i32, arguments[0]);
        }
      }
    });
  }

};

export var Node = class Node {};

export var Element = class Element extends Node {};

export var HTMLElement = class HTMLElement extends Element {};

export var HTMLDocument = class HTMLDocument extends HTMLElement {
  getElementById(id) {
    return window.post({
      func: ["document", "getElementById"],
      args: [id]
    });
  }

  querySelector(filter) {
    var tagName;
    return this.createElement(tagName = "canvas");
  }

  createElement(tagName) {
    return HTMLCanvasElement.create();
  }

};

export var HTMLCanvasElement = class HTMLCanvasElement extends HTMLElement {
  static create() {
    var canvas;
    return new (canvas = class canvas extends OffscreenCanvas {})(256, 256);
  }

  getContext(type) {}

};
