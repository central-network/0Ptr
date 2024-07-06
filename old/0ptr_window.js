var document;

export var Window = class Window {};

export var Node = class Node {};

export var Element = class Element extends Node {};

export var HTMLElement = class HTMLElement extends Element {};

export var HTMLDocument = class HTMLDocument extends HTMLElement {
  getElementById(id) {
    return console.log(id);
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

Object.defineProperties(self, {
  window: {
    value: self
  },
  document: {
    value: document = new (document = class document extends HTMLDocument {})
  }
});

Object.defineProperties(self.window, {
  self: {
    value: self
  },
  document: {
    value: document
  },
  window: {
    value: window
  }
});
