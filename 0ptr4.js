//* hello world
var GL2KEY, GL2NUM, GL2VAL, TYPE_BYTE, TYPE_JSON, TYPE_TEXT, bufferize, debug, decode, dvw, encode, error, externref, f32, iLE, info, iter, iterate, log, of1, of2, of3, ref, ref1, restore, sab, store, subarray, table, u32, ui8, warn;

GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

({log, warn, error, table, debug, info} = console);

sab = new SharedArrayBuffer(8 * 1e7);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

ref = new Array;

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

Object.defineProperty(self, "dump", {
  get: function() {
    console.table((function() {
      var byteOffset, item, items, ref1, size, type;
      items = [];
      ref1 = iterate();
      for (byteOffset of ref1) {
        type = dvw.getUint32(byteOffset - 4, iLE);
        size = dvw.getUint32(byteOffset - 8, iLE);
        item = {
          data: restore(byteOffset, type)
        };
        items.push(Object.defineProperties(item, {
          type: {
            value: type
          },
          ["{{Buffer}}"]: {
            value: {
              buffer: bufferize(byteOffset, type),
              byteOffset: byteOffset,
              byteLength: size
            }
          },
          ["{{Headers}}"]: {
            value: new Uint32Array(sab, byteOffset - 8, 2)
          }
        }));
      }
      return items;
    })());
    console.warn("externref:", ref);
    return console.warn(ui8);
  }
});

iterate = function(options = {}) {
  var APPLY_TEST, MATCH_TYPE, byteOffset, done, f, ref1, test, testOffset, type;
  byteOffset = options.begin || 0;
  MATCH_TYPE = Boolean(type = options.type);
  APPLY_TEST = Boolean(test = (ref1 = ref[type]) != null ? ref1.test : void 0);
  if (!(testOffset = options.testOffset)) {
    //todo this is unnecessary
    APPLY_TEST = !1;
  }
  f = (function() {
    switch (done = true) {
      // { type: 1, testOffset : 4 }
      case MATCH_TYPE && APPLY_TEST:
        return function() {
          var byteLength, value;
          while (byteLength = dvw.getUint32(byteOffset, iLE)) {
            if (type - dvw.getUint32(byteOffset + 4, iLE)) {
              byteOffset += 8 + byteLength;
              continue;
            }
            if (!test(testOffset, byteOffset + 8)) {
              byteOffset += 8 + byteLength;
              continue;
            }
            value = byteOffset + 8;
            byteOffset = value + byteLength;
            return {value};
          }
          return {done};
        };
      // { type: 1 }
      case MATCH_TYPE && !APPLY_TEST:
        return function() {
          var byteLength, value;
          while (byteLength = dvw.getUint32(byteOffset, iLE)) {
            if (type - dvw.getUint32(byteOffset + 4, iLE)) {
              byteOffset += 8 + byteLength;
              continue;
            }
            value = byteOffset + 8;
            byteOffset = value + byteLength;
            return {value};
          }
          return {done};
        };
      case !MATCH_TYPE && !APPLY_TEST:
        return function() {
          var byteLength, value;
          while (byteLength = dvw.getUint32(byteOffset, iLE)) {
            value = byteOffset + 8;
            byteOffset = value + byteLength;
            return {value};
          }
          return {done};
        };
      default:
        throw [/ITERATOR_FAILED/, options];
    }
  })();
  return Iterator.from({
    next: f
  });
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
  byteLength = dvw.getUint32(byteOffset - 8, iLE);
  length = byteLength / TypedArray.BYTES_PER_ELEMENT;
  return new TypedArray(sab, byteOffset, length);
};

store = function(data, type = 0) {
  var buffer, byteLength, byteOffset, mod, size;
  buffer = ref[type].encode(data);
  byteOffset = 0;
  byteLength = buffer.byteLength;
  if (mod = byteLength % 8) {
    byteLength += 8 - mod;
  }
  while (size = dvw.getUint32(byteOffset, iLE)) {
    //? to the end of sab
    byteOffset += size + 8;
  }
  dvw.setUint32(byteOffset, byteLength, iLE);
  dvw.setUint32(byteOffset + 4, type, iLE);
  byteOffset += 8;
  subarray(byteOffset).set(buffer);
  return byteOffset;
};

restore = function(byteOffset, type) {
  type || (type = dvw.getUint32(byteOffset - 4, iLE));
  return ref[type].decode(subarray(byteOffset));
};

bufferize = function(byteOffset) {
  return subarray(byteOffset).slice().buffer;
};

TYPE_BYTE = externref({
  object: ArrayBuffer,
  encode: function() {
    var data;
    data = arguments[0];
    if (ArrayBuffer.isView(data)) {
      if (data.buffer.grow != null) {
        data = data.slice();
      }
      if (data instanceof Uint8Array) {
        return data;
      }
      return new Uint8Array(data.buffer);
    }
    if (Array.isArray(data)) {
      return Uint8Array.from(data);
    }
    throw /UNENCODEABLE/;
  },
  decode: function() {
    return arguments[0];
  },
  test: function(byteOffset, testOffset) {
    var byteLength, length, offset;
    byteLength = dvw.getUint32(testOffset - 8, iLE);
    if (byteLength - dvw.getUint32(byteOffset - 8, iLE)) {
      return false;
    }
    offset = 0;
    length = byteLength - 1;
    // length could be even or odd
    while (false === (offset > length)) {
      if (dvw.getUint8(byteOffset + length) - dvw.getUint8(testOffset + length)) {
        //? right equality check
        return false;
      }
      if (dvw.getUint8(byteOffset + offset) - dvw.getUint8(testOffset + offset)) {
        
        //* left equality check
        return false;
      }
      
      //! walk one step
      offset++;
      --length;
    }
    return true;
  }
});

TYPE_TEXT = externref({
  object: String,
  encode: function(string) {
    var byteLength, data, textArray;
    textArray = encode(string);
    byteLength = textArray.byteLength;
    data = new Uint8Array(byteLength + 4);
    new DataView(data.buffer).setUint32(0, byteLength, iLE);
    data.set(textArray, 4);
    return data;
  },
  decode: function(subarray) {
    var begin, buffer, byteLength, byteOffset, end;
    ({buffer, byteOffset, byteLength} = subarray);
    begin = 4;
    end = begin + new DataView(buffer, byteOffset, byteLength).getUint32(0, iLE);
    return decode(subarray.slice(begin, end));
  },
  test: function(byteOffset, testOffset) {
    var textLength;
    textLength = dvw.getUint32(byteOffset, iLE);
    if (textLength - dvw.getUint32(testOffset, iLE)) {
      return false;
    }
    return ref[TYPE_BYTE].test(byteOffset, testOffset);
  }
});

TYPE_JSON = externref({
  encode: function() {
    return ref[TYPE_TEXT].encode(JSON.stringify(arguments[0]));
  },
  decode: function() {
    return JSON.parse(ref[TYPE_TEXT].decode(arguments[0]));
  }
});

store(new Float32Array(new SharedArrayBuffer(8)));

of1 = store("getByteLength", TYPE_TEXT);

of2 = store("getByteLength", TYPE_TEXT);

store({
  type: 0,
  name: "some"
}, TYPE_JSON);

of3 = store("getByteOffset", TYPE_TEXT);

ref1 = iterate({
  type: 1,
  testOffset: of2
});
for (iter of ref1) {
  log({
    match: iter,
    item: String(restore(iter))
  });
}

dump;

//? primitives done, now we can walk -->
