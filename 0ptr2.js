var BPE, POINTER_BYTELENGTH, POINTER_LENGTH, PTR_BYTELENGTH, PTR_BYTEOFFSET, PTR_CLASSINDEX, Pointer, Storage, debug, define, dvw, error, getByteOffset, getClassIndex, getPtriFloat32, getPtriUint32, iLE, log, malloc, palloc, ptri, sab, scope, setByteOffset, setClassIndex, setPtriFloat32, setPtriUint32, table, u32, warn;

({log, warn, error, table, debug} = console);

sab = new SharedArrayBuffer(1e7);

dvw = new DataView(sab);

u32 = new Uint32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

BPE = 4;

scope = new (Storage = class Storage extends Array {
  constructor() {
    super(...arguments).add(null);
  }

  classIndex() {
    return this.indexOf(arguments[0].constructor);
  }

  store(o) {
    var i;
    if (-1 === (i = this.indexOf(o))) {
      i += this.push(o);
    }
    return i;
  }

  fillEmpty(o) {
    var i;
    this[i = this.findIndex(function(v) {
      return !v;
    })] = o;
    return i;
  }

  add(o) {
    return this[this.length] = o;
  }

});

POINTER_LENGTH = 16;

POINTER_BYTELENGTH = BPE * POINTER_LENGTH;

define = Object.defineProperties;

palloc = Atomics.add.bind(Atomics, u32, 0, POINTER_BYTELENGTH);

malloc = Atomics.add.bind(Atomics, u32, 1);

palloc(malloc(POINTER_BYTELENGTH));

PTR_CLASSINDEX = 0 * BPE;

PTR_BYTEOFFSET = 1 * BPE;

PTR_BYTELENGTH = 2 * BPE;

getByteOffset = function(ptri) {
  return dvw.getUint32(ptri + PTR_BYTEOFFSET, iLE);
};

setByteOffset = function(ptri, byteOffset) {
  dvw.setUint32(ptri + PTR_BYTEOFFSET, byteOffset, iLE);
  return ptri;
};

getClassIndex = function(ptri) {
  return dvw.getUint32(ptri + PTR_CLASSINDEX, iLE);
};

setClassIndex = function(ptri, clsi) {
  dvw.setUint32(ptri + PTR_CLASSINDEX, clsi || scope.classIndex(ptri), iLE);
  return ptri;
};

getPtriUint32 = function(ptri, byteOffset) {
  return dvw.getUint32(byteOffset + getByteOffset(ptri), iLE);
};

setPtriUint32 = function(ptri, byteOffset, value) {
  dvw.setUint32(byteOffset + getByteOffset(ptri), value, iLE);
  return value;
};

getPtriFloat32 = function(ptri, byteOffset) {
  return dvw.getFloat32(byteOffset + getByteOffset(ptri), iLE);
};

setPtriFloat32 = function(ptri, byteOffset, value) {
  dvw.setFloat32(byteOffset + getByteOffset(ptri), value, iLE);
  return value;
};

setByteOffset(32, 64);

scope.store(Pointer = (function() {
  class Pointer extends Number {
    static from(any) {
      var ptri;
      return setClassIndex(ptri = new this(palloc()));
    }

    store(object) {
      var i;
      if (!/WebGL/i.test(object.constructor.name)) {
        return this.storage.store(object);
      }
      if (0xff < (i = this.storage.fillEmpty(object))) {
        throw {
          MAX_INDEX_EXCEED: object
        };
      }
      return i;
    }

  };

  define(Pointer.prototype, {
    isPointer: {
      value: true
    }
  });

  define(Pointer.prototype, {
    storage: {
      value: new Storage(0xff)
    }
  });

  return Pointer;

}).call(this));

warn(ptri = Pointer.from());

warn(ptri.store(document));

warn(ptri.store(new OffscreenCanvas(1, 1).getContext("webgl2")));

warn(ptri.store(new OffscreenCanvas(1, 1).getContext("webgl2").createProgram()));

log(setPtriUint32(4, 12, ptri));

log(getPtriUint32(4, ptri));
