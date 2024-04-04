var Element, HTMLCanvasElement, HTMLDocument, HTMLElement, Node, Window;

Window = class Window {
  constructor() {
    var document;
    Object.defineProperties(self, {
      window: {
        value: this
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
      }
    });
  }

};

Node = class Node {};

Element = class Element extends Node {};

HTMLElement = class HTMLElement extends Element {};

HTMLDocument = class HTMLDocument extends HTMLElement {
  getElementById(id) {}

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
