var DEBUG, GL2KEY, GL2NUM, GL2VAL, JSONDecoder, JSONEncoder, TYPE_BYTE, TYPE_JSON, TYPE_NULL, TYPE_TEXT, bufferize, debug, dvw, error, externref, f32, iLE, info, iterate, log, ref, restore, sab, store, subarray, table, u32, ui8, warn;

DEBUG = 0;

//* hello world
GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

({log, warn, error, table, debug, info} = console);

JSONEncoder = class JSONEncoder extends TextEncoder {
  encode() {
    return super.encode(JSON.stringify(...arguments));
  }

};

JSONDecoder = class JSONDecoder extends TextDecoder {
  decode() {
    return JSON.parse(super.decode(...arguments));
  }

};

sab = new SharedArrayBuffer(8 * 1e7);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

ref = new Array;

self.dump = function() {
  console.table(iterate());
  return console.warn("externref:", ref);
};

iterate = function(begin = 0, count = 0) {
  var byteLength, byteOffset, item, items;
  items = [];
  byteOffset = begin;
  while (byteLength = dvw.getUint32(byteOffset, iLE)) {
    item = {
      data: restore(byteOffset)
    };
    Object.defineProperties(item, {
      type: {
        value: dvw.getUint32(byteOffset + 4, iLE)
      },
      ["{{Buffer}}"]: {
        value: {
          buffer: bufferize(byteOffset),
          byteOffset: byteOffset,
          byteLength: byteLength
        }
      },
      ["{{Headers}}"]: {
        value: new Uint32Array(sab, byteOffset, 2)
      }
    });
    items.push(item);
    if (!--count) {
      break;
    } else {
      byteOffset += byteLength + 8;
    }
  }
  return items;
};

externref = function(any) {
  var i;
  if (-1 === (i = ref.indexOf(any))) {
    i += ref.push(any);
  }
  return i;
};

subarray = function(byteOffset, TypedArray = Uint8Array) {
  var byteLength, length;
  byteLength = dvw.getUint32(byteOffset, iLE);
  length = byteLength / TypedArray.BYTES_PER_ELEMENT;
  return new TypedArray(sab, byteOffset + 8, length);
};

store = function(data, type = 0) {
  var buffer, byteLength, byteOffset, size;
  buffer = ref[type].encode(data);
  byteOffset = 0;
  byteLength = buffer.byteLength;
  while (size = dvw.getUint32(byteOffset, iLE)) {
    //? to the end of sab
    byteOffset += size + 8;
  }
  dvw.setUint32(byteOffset, byteLength, iLE);
  dvw.setUint32(byteOffset + 4, type, iLE);
  subarray(byteOffset).set(buffer);
  return byteOffset;
};

restore = function(byteOffset, type) {
  type || (type = dvw.getUint32(byteOffset + 4, iLE));
  return ref[type].decode(subarray(byteOffset).slice());
};

bufferize = function(byteOffset) {
  return subarray(byteOffset).slice().buffer;
};

TYPE_NULL = externref({
  alias: "NULL",
  encode: function(any) {
    switch (true) {
      case false === Boolean(any):
        switch (true) {
          case any === void 0:
            return Boolean;
          case any === false:
            return Boolean;
          case any === null:
            return Boolean;
          case any === (0/0):
            return Number;
          case any === 0:
            return Number;
          case any === "":
            return String;
        }
        break;
      case ArrayBuffer.isView(any):
        switch (any.constructor) {
          case Uint8Array:
            return ref[TYPE_BYTE].encode(any);
        }
    }
  },
  decode: function() {
    return arguments[0];
  }
});

TYPE_BYTE = externref({
  alias: "BYTE",
  encode: function() {
    return arguments[0];
  },
  decode: function() {
    return arguments[0];
  }
});

TYPE_JSON = externref({
  alias: "JSON",
  encode: JSONEncoder.prototype.encode.bind(new JSONEncoder),
  decode: JSONDecoder.prototype.decode.bind(new JSONDecoder),
  filter: function() {},
  matchs: function(any) {}
});

TYPE_TEXT = externref({
  alias: "TEXT",
  encode: TextEncoder.prototype.encode.bind(new TextEncoder),
  decode: TextDecoder.prototype.decode.bind(new TextDecoder),
  filter: function() {}
});

store(new Uint8Array([1, 4, 4, 1]));

store({
  type: 0,
  name: "some"
}, TYPE_JSON);

store("kamon", TYPE_TEXT);

dump();
