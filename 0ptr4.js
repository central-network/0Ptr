//* hello world
var GL2KEY, GL2NUM, GL2VAL, Link, Parent, TYPE_BYTE, TYPE_JSON, TYPE_LINK, TYPE_PARENT, TYPE_TEXT, TYPE_TYPE, bufferize, debug, decode, dvw, encode, error, externref, f32, filter, iLE, info, iter, iterate, log, of1, of2, of3, of4, ofb, ofj, ref, ref3, ref4, ref5, restore, sab, store, subarray, table, typedef, u32, ui8, warn;

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
      var byteOffset, item, items, ref3, size, type;
      items = [];
      ref3 = iterate();
      for (byteOffset of ref3) {
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

filter = function(type, test, options = {}) {
  var byteOffset;
  byteOffset = 0;
  return Iterator.from({
    next: function() {
      var byteLength, value;
      while (byteLength = dvw.getUint32(byteOffset, iLE)) {
        error(type);
        if (type - dvw.getUint32(byteOffset + 4, iLE)) {
          byteOffset += 8 + byteLength;
          continue;
        }
        if (!test(byteOffset + 8)) {
          byteOffset += 8 + byteLength;
          continue;
        }
        value = ref[type];
        byteOffset = value + byteLength;
        return {value};
      }
      return {
        done: true
      };
    }
  });
};

iterate = function(options = {}) {
  var APPLY_TEST, MATCH_TYPE, byteOffset, done, f, ref3, test, testOffset, type;
  byteOffset = options.begin || 0;
  MATCH_TYPE = Boolean(type = options.type);
  APPLY_TEST = Boolean(test = (ref3 = ref[type]) != null ? ref3.test : void 0);
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

store = function(type = 0, ...data) {
  var buffer, byteLength, byteOffset, mod, size;
  buffer = ref[type].encode(...data);
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

TYPE_LINK = externref({
  object: Link = class Link extends Uint32Array {},
  encode: function([ref1, ref2]) {
    return new Uint8Array(this.object.of(ref1, ref2).buffer);
  },
  decode: function(subarray) {
    var ref1, ref2;
    ref1 = dvw.getUint32(subarray.byteOffset, iLE);
    ref2 = dvw.getUint32(subarray.byteOffset + 4, iLE);
    return this.object.of(ref1, ref2);
  },
  test: function(byteOffset, testOffset) {
    if (dvw.getUint32(byteOffset, iLE) - dvw.getUint32(testOffset, iLE)) {
      return false;
    }
    if (dvw.getUint32(byteOffset + 4, iLE) - dvw.getUint32(testOffset + 4, iLE)) {
      return false;
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

TYPE_TYPE = externref({
  encode: function(alias, byteOffset) {
    var buffer, byteArray, byteLength, dataView, nameArray, nameLength;
    nameArray = encode(alias);
    nameLength = nameArray.byteLength;
    byteLength = nameLength + 12;
    buffer = new ArrayBuffer(byteLength);
    byteArray = new Uint8Array(buffer);
    dataView = new DataView(buffer);
    dataView.setUint32(4, byteOffset, iLE);
    dataView.setUint32(8, nameLength, iLE);
    byteArray.set(nameArray, 12);
    return byteArray;
  },
  decode: function(subarray) {
    var nameLength;
    nameLength = dvw.getUint32(subarray.byteOffset + 8, iLE);
    return {
      byteOffset: dvw.getUint32(subarray.byteOffset, iLE),
      index: dvw.getUint32(subarray.byteOffset + 4, iLE),
      alias: decode(subarray.slice(12, 12 + nameLength))
    };
  },
  test: function(byteOffset, testOffset) {
    return dvw.getUint32(byteOffset) === dvw.getUint32(testOffset);
  }
});

TYPE_JSON = externref({
  encode: function() {
    return ref[TYPE_TEXT].encode(JSON.stringify(arguments[0]));
  },
  decode: function() {
    return JSON.parse(ref[TYPE_TEXT].decode(arguments[0]));
  },
  test: ref[TYPE_TEXT].test
});

typedef = function(object) {
  var def, i;
  if (-1 === (i = ref.indexOf(object))) {
    i += ref.push(object);
  }
  i;
  def = store(TYPE_TYPE, object.name, i);
  dvw.setUint32(def, def, iLE);
  warn({object, i, def});
  return def;
};

ofb = store(TYPE_BYTE, new Float32Array(new SharedArrayBuffer(8)));

of1 = store(TYPE_TEXT, "getByteLength");

of2 = store(TYPE_TEXT, "getByteLength");

ofj = store(TYPE_JSON, {
  type: 0,
  name: "some"
});

of3 = store(TYPE_TEXT, "getByteOffset");

of4 = store(TYPE_LINK, [of1, of2]);

TYPE_PARENT = typedef(Parent = (function() {
  class Parent {
    encode(a, b) {
      return new Uint8Array(Uint32Array.of(a, b).buffer);
    }

    decode(byteOffset) {
      return new this.Object(sab, byteOffset, 2);
    }

    isIndex(index, byteOffset = this) {
      return index === dvw.getUint32(byteOffset, iLE);
    }

  };

  Parent.byteLength = 8;

  Parent.prototype.Object = Uint32Array;

  return Parent;

}).call(this));

ref3 = iterate({
  type: 1,
  testOffset: of2
});
for (iter of ref3) {
  log("str iter:", {
    match: iter,
    item: String(restore(iter))
  });
}

ref4 = iterate({
  type: TYPE_LINK,
  testOffset: of4
});
for (iter of ref4) {
  log("lnk iter:", {
    match: iter,
    item: restore(iter)
  });
}

error({TYPE_PARENT});

ref5 = filter(TYPE_PARENT, function(byteOffset) {
  return 0 === TYPE_PARENT - dvw.getUint32(byteOffset, iLE);
});
for (iter of ref5) {
  error(iter);
}

dump;

//? primitives done, now we can walk -->
