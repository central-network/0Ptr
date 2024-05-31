var DeviceDriver, LocalWindowDevice, LocalWindowPointerDevice, Pointer, debug, dvw, error, f32, getter, iLE, info, localPointerDev, log, malloc, ref, sab, table, u32, ui8, warn;

({log, warn, error, table, debug, info} = console);

sab = new SharedArrayBuffer(1e7 * 8);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

ref = new Array;

malloc = function(byteLength = 0) {
  var allocLength, byteOffset, i, mod, nextOffset, ptrLength;
  ptrLength = 16 * 4;
  allocLength = byteLength + ptrLength;
  if (mod = byteLength % 8) {
    allocLength += 8 - mod;
  }
  nextOffset = 0;
  byteOffset = 0;
  while (true) {
    if (!(nextOffset = Atomics.load(u32, i = nextOffset / 4))) {
      Atomics.store(u32, i, byteOffset + allocLength);
      Atomics.store(u32, i + 1, byteLength);
      return byteOffset + ptrLength;
    }
    byteOffset = nextOffset;
  }
};

getter = function(object, properties) {
  var key, results;
  results = [];
  for (key in properties) {
    getter = properties[key];
    results.push(Object.defineProperty(object, key, {
      get: getter
    }));
  }
  return results;
};

Pointer = class Pointer extends Number {
  static malloc(byteLength = 0) {
    var blen, ptri;
    blen = byteLength + (this.byteLength || 0);
    return ptri = new this(malloc(byteLength));
  }

};

DeviceDriver = class DeviceDriver extends Pointer {};

LocalWindowDevice = (function() {
  class LocalWindowDevice extends DeviceDriver {};

  LocalWindowDevice.prototype.device = typeof window !== "undefined" && window !== null ? window : null;

  return LocalWindowDevice;

}).call(this);

LocalWindowPointerDevice = class LocalWindowPointerDevice extends LocalWindowDevice {};

localPointerDev = LocalWindowPointerDevice.malloc();

log(localPointerDev);
