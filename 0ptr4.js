var DEBUG, GL2KEY, GL2NUM, GL2VAL, TYPE_JSON, TYPE_TEXT, bufferize, debug, decodeJSON, decodeText, dvw, encodeJSON, encodeText, error, externref, f32, iLE, info, iterate, log, objectify, offset, ref, restore, sab, store, table, u32, ui8, warn;

DEBUG = 0;

//* hello world
GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

({log, warn, error, table, debug, info} = console);

sab = new SharedArrayBuffer(256);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

ref = new Array(null);

encodeText = TextEncoder.prototype.encode.bind(new TextEncoder);

decodeText = TextDecoder.prototype.decode.bind(new TextDecoder);

encodeJSON = function() {
  return encodeText(JSON.stringify(...arguments));
};

decodeJSON = function() {
  return JSON.parse(decodeText(...arguments));
};

iterate = function(begin = 0, count = 0) {
  var byteLength, byteOffset, encoding, object, stored;
  stored = [];
  byteOffset = begin;
  while (byteLength = dvw.getUint32(byteOffset, iLE)) {
    object = restore(byteOffset);
    encoding = dvw.getUint32(byteOffset + 4, iLE);
    stored.push({object, encoding, byteOffset, byteLength});
    if (!--count) {
      break;
    } else {
      byteOffset += byteLength + 8;
    }
  }
  return stored;
};

bufferize = function(object, encoding = 0) {
  return ref[encoding].encode(object);
};

objectify = function(buffer, encoding = 0) {
  return ref[encoding].decode(buffer);
};

externref = function(coders = {encode, decode}) {
  var i;
  if (-1 === (i = ref.indexOf(coders))) {
    i += ref.push(coders);
  }
  return i;
};

offset = function() {
  var byteOffset, len;
  byteOffset = 0;
  while (len = dvw.getUint32(byteOffset, iLE)) {
    byteOffset += len + 8;
  }
  return byteOffset;
};

store = function(object, encoding) {
  var buffer, byteLength, byteOffset;
  buffer = bufferize(object, encoding);
  byteLength = buffer.byteLength;
  byteOffset = offset();
  dvw.setUint32(byteOffset, byteLength, iLE);
  dvw.setUint32(byteOffset + 4, encoding, iLE);
  ui8.set(buffer, byteOffset + 8);
  return byteOffset;
};

restore = function(byteOffset) {
  var buffer, byteLength, encoding;
  byteLength = dvw.getUint32(byteOffset, iLE);
  encoding = dvw.getUint32(byteOffset + 4, iLE);
  buffer = new Uint8Array(sab, byteOffset + 8, byteLength);
  return objectify(buffer, encoding);
};

self.dump = function() {
  return console.table(iterate());
};

TYPE_TEXT = externref({
  encode: function(object) {
    return encodeText(object);
  },
  decode: function(buffer) {
    return decodeText(buffer.slice());
  }
});

TYPE_JSON = externref({
  encode: function(object) {
    return encodeJSON(object);
  },
  decode: function(buffer) {
    return decodeJSON(buffer.slice());
  }
});

warn({TYPE_TEXT, TYPE_JSON}, ref);

store({
  type: 0,
  name: "some"
}, TYPE_JSON);

store("kamon", TYPE_TEXT);

log(dump());

log(ui8);
