var Array, ArrayPointer, Float32Array, Float32ArrayPointer, Thread, TypedArrayPointer, document, f32, i, j, k, key, l, len, obj, ref;

import * as window from "./window.js";

export var OBJECTS = [];

f32 = null;

export var Pointer = class Pointer extends Number {
  static bind() {
    Object.defineProperties(Pointer.prototype, {
      buffer: {
        value: arguments[0]
      }
    });
    return f32 = new window.Float32Array(arguments[0]);
  }

};

ArrayPointer = class ArrayPointer extends Pointer {
  map() {
    return console.log("map loop", this);
  }

};

TypedArrayPointer = class TypedArrayPointer extends Pointer {
  map() {
    return console.log("map loop", self.name, this);
  }

};

Float32ArrayPointer = (function() {
  class Float32ArrayPointer extends TypedArrayPointer {
    constructor() {
      var byteLength;
      if (!window.isNaN(arguments[0])) {
        byteLength = arguments[0] * 4;
      }
      super(byteLength);
    }

  };

  Float32ArrayPointer.prototype.BYTES_PER_ELEMENT = 4;

  Float32ArrayPointer.BYTES_PER_ELEMENT = 4;

  Object.defineProperties(Float32ArrayPointer.prototype, {
    byteOffset: {
      get: function() {
        return 2;
      }
    },
    byteLength: {
      get: function() {
        return this * 1;
      }
    },
    length: {
      get: function() {
        return this / this.BYTES_PER_ELEMENT;
      }
    },
    array: {
      get: function() {
        return f32.subarray(0, 10);
      }
    }
  });

  return Float32ArrayPointer;

}).call(this);

Thread = (function() {
  class Thread extends window.EventTarget {
    constructor(name, type = "module") {
      super();
      this.worker = new window.Worker(this.url, {name, type});
      this.worker.postMessage(Pointer.prototype.buffer);
    }

  };

  Thread.blob = new window.Blob([[`import '${import.meta.url}'`, "self.addEventListener( 'message', function ( e ) { Pointer.bind( e.data ); }, { once: true } );"].join('\n')], {
    type: "application/javascript"
  });

  Thread.prototype.url = window.URL.createObjectURL(Thread.blob);

  return Thread;

}).call(this);

ref = window.Object.getOwnPropertyNames(self);
for (j = k = 0, len = ref.length; k < len; j = ++k) {
  key = ref[j];
  if (key === "Math" || key === "Object" || key === "window" || key === "Reflect" || key === "location" || key === "self" || key === "name" || key === "console" || key === "Proxy") {
    continue;
  }
  if (!OBJECTS.includes(obj = self[key])) {
    OBJECTS.push(obj);
  }
  try {
    window.Reflect.deleteProperty(self, key);
  } catch (error) {}
  try {
    delete self[key];
  } catch (error) {}
  try {
    if (self[key]) {
      self[key] = self;
    }
  } catch (error) {}
}

if (self.document != null) {
  self.name = -1;
  Pointer.bind(new window.SharedArrayBuffer(10000));
  for (i = l = 0; l <= 4; i = ++l) {
    new Thread(i);
  }
} else {
  Object.defineProperties(self, {
    document: {
      value: new Proxy(new (document = class document {}), {
        get: function() {
          return console.log("worker needs document");
        }
      })
    }
  });
}

Object.assign(self, {
  Pointer: Pointer,
  Array: (Array = class Array extends ArrayPointer {}),
  Float32Array: (Float32Array = class Float32Array extends Float32ArrayPointer {})
});
