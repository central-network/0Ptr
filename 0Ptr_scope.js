var BYTELENGTH_HEADER, BYTEOFFSET_PARENT, BYTES_PER_ELEMENT, INDEX_ATOMIC_NEXT, INDEX_BYTE_LENGTH, INDEX_PARENT_PTRI, INDEX_PROTO_CLASS, INITIAL, ITEMLENGTH_HEADER, LENDIAN, dvw, f32, i32, obj, sab, u16, u32, ui8;

[obj, sab, i32, u32, f32, u16, ui8, dvw, LENDIAN = 0x3f === new Uint8Array(Float32Array.of(1).buffer)[0x3], INDEX_BYTE_LENGTH = -1, INDEX_PROTO_CLASS = -2, INDEX_PARENT_PTRI = -3, INDEX_ATOMIC_NEXT = -4, BYTES_PER_ELEMENT = 4, ITEMLENGTH_HEADER = 4, BYTELENGTH_HEADER = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT, BYTEOFFSET_PARENT = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI, INITIAL = 8] = [[]];

export var Scope = (function() {
  class Scope extends Array {
    constructor(root) {
      super().add(root);
    }

    get() {
      var i;
      if (!isNaN(i = arguments[0])) {
        return this[i].deref();
      } else if (!isNaN(i = this.has(i))) {
        return this.get(i);
      }
      return null;
    }

    has() {
      var i, j, o, ref;
      if (!this.map.has(o = arguments[0])) {
        return false;
      }
      for (i = j = 0, ref = this.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        if (o === this.get(i)) {
          return i;
        }
      }
      return false;
    }

    add() {
      if (!this.map.has(arguments[0])) {
        this.map.set(arguments[0], this.set(arguments[0]));
      }
      return this.map.get(arguments[0]);
    }

    set() {
      var i, object;
      [object, i] = [...arguments, this.length];
      (this[i] = new WeakRef(object));
      return i;
    }

  };

  Scope.metaUrl = import.meta.url;

  Scope.maxLength = Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 11) / 4;

  Scope.maxByteLength = Scope.maxLength * 4;

  Scope.prototype.map = new WeakMap();

  return Scope;

}).call(this);

export {
  Scope as default
};
