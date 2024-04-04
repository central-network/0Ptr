var Element, HTMLCanvasElement, HTMLDocument, HTMLElement, Node, Window;

Window = class Window {
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

Node = class Node {};

Element = class Element extends Node {};

HTMLElement = class HTMLElement extends Element {};

HTMLDocument = class HTMLDocument extends HTMLElement {
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

HTMLCanvasElement = class HTMLCanvasElement extends HTMLElement {
  static create() {
    var canvas;
    return new (canvas = class canvas extends OffscreenCanvas {})(256, 256);
  }

  getContext(type) {}

};
