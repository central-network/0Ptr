var BYTELENGTH_HEADER, BYTEOFFSET_PARENT, BYTES_PER_ELEMENT, INDEX_ATOMIC_NEXT, INDEX_BYTE_LENGTH, INDEX_PARENT_PTRI, INDEX_PROTO_CLASS, INITIAL, ITEMLENGTH_HEADER, LENDIAN, dvw, f32, i32, obj, sab, u16, u32, ui8;

[obj, sab, i32, u32, f32, u16, ui8, dvw, LENDIAN = 0x3f === new Uint8Array(Float32Array.of(1).buffer)[0x3], INDEX_BYTE_LENGTH = -1, INDEX_PROTO_CLASS = -2, INDEX_PARENT_PTRI = -3, INDEX_ATOMIC_NEXT = -4, BYTES_PER_ELEMENT = 4, ITEMLENGTH_HEADER = 4, BYTELENGTH_HEADER = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT, BYTEOFFSET_PARENT = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI, INITIAL = 8] = [[]];

export var Scope = (function() {
  class Scope extends Array {
    constructor(OPtr) {
      super().push(null);
      console.log(OPtr.prototype.buffer);
    }

    add(item, i) {
      if (i > 0) {
        this[i] = item;
      }
      if (-1 === (i = this.indexOf(item))) {
        i += this.push(new WeakRef(item));
      }
      return i;
    }

    get(i) {
      var item;
      if (isNaN(i)) {
        return this.get(this.indexOf(i));
      }
      if (!(item = this.at(i))) {
        if (typeof window !== "undefined" && window !== null) {
          return;
        }
      }
      return item.deref();
    }

  };

  Scope.metaUrl = import.meta.url;

  return Scope;

}).call(this);

export {
  Scope as default
};
