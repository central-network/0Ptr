var BYTELENGTH_HEADER, BYTEOFFSET_PARENT, BYTES_PER_ELEMENT, INDEX_ATOMIC_NEXT, INDEX_BYTE_LENGTH, INDEX_PARENT_PTRI, INDEX_PROTO_CLASS, INITIAL, ITEMLENGTH_HEADER, LENDIAN, dvw, f32, i32, obj, sab, u16, u32, ui8;

[obj, sab, i32, u32, f32, u16, ui8, dvw, LENDIAN = 0x3f === new Uint8Array(Float32Array.of(1).buffer)[0x3], INDEX_BYTE_LENGTH = -1, INDEX_PROTO_CLASS = -2, INDEX_PARENT_PTRI = -3, INDEX_ATOMIC_NEXT = -4, BYTES_PER_ELEMENT = 4, ITEMLENGTH_HEADER = 4, BYTELENGTH_HEADER = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT, BYTEOFFSET_PARENT = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI, INITIAL = 8] = [[]];

export var AtomicScope = (function() {
  class AtomicScope extends Array {
    constructor() {
      obj = super();
      sab = arguments[0];
      i32 = new Int32Array(sab);
      u32 = new Uint32Array(sab);
      f32 = new Float32Array(sab);
      u16 = new Uint16Array(sab);
      ui8 = new Uint8Array(sab);
      dvw = new DataView(sab);
      if (!Atomics.load(u32)) {
        Atomics.store(u32, 0, BYTES_PER_ELEMENT * INITIAL);
        Atomics.store(u32, 1, INITIAL);
      }
      Object.defineProperty(proto, "buffer", {
        value: this.buffer
      });
    }

  };

  AtomicScope.metaUrl = import.meta.url;

  return AtomicScope;

}).call(this);

export {
  AtomicScope as default
};
