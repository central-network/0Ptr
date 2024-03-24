import Pointer from "./0ptr.js";

export var TestPtr = class TestPtr extends Pointer {};

export var NestPtr = class NestPtr extends Pointer {};

export var ChildTest = class ChildTest extends TestPtr {};

Pointer.importMetaUrl(import.meta.url);

Pointer.register(TestPtr, {
  byteLength: {
    value: 4 * 12
  },
  typedArray: {
    value: Float32Array
  }
});

Object.defineProperties(TestPtr.prototype, {
  getSome: {
    get: function() {
      return console.log("some getter");
    }
  },
  getValue: {
    value: function() {
      return console.warn("value fn");
    }
  }
});

Pointer.register(NestPtr, {
  byteLength: {
    value: 4 * 4
  },
  typedArray: {
    value: Uint16Array
  }
});

Object.defineProperties(NestPtr.prototype, {
  getSome: {
    get: function() {
      return console.log("some getter");
    }
  },
  getValue: {
    value: function() {
      return console.warn("value fn");
    }
  }
});

Pointer.register(ChildTest, {
  byteLength: {
    value: 2 * 2
  },
  typedArray: {
    value: Uint8Array
  }
});

Object.defineProperties(ChildTest.prototype, {
  getSome: {
    get: function() {
      return console.log("some getter");
    }
  },
  getValue: {
    value: function() {
      return console.warn("value fn");
    }
  }
});
