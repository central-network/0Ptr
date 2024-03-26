var LENDIAN, OBJECTS, dvw, f32, i32, u16, u32, ui8;

OBJECTS = [];

LENDIAN = !new Uint8Array(Float32Array.of(1).buffer)[0];

ui8 = i32 = u32 = u16 = dvw = f32 = null;

export var ByteOffset = (function() {
  class ByteOffset extends Number {
    index1(offset = 0) {
      return this + offset;
    }

    index2(offset = 0) {
      return (this + offset) / 2;
    }

    index4(offset = 0) {
      return (this + offset) / 4;
    }

    offset(offset = 0) {
      return this + offset;
    }

    loadInt32(offset) {
      return Atomics.load(i32, this.index4(offset));
    }

    storeInt32(offset, value) {
      Atomics.store(i32, this.index4(offset), value);
      return value;
    }

    addInt32(offset, value) {
      return Atomics.add(i32, this.index4(offset), value);
    }

    atInt32(offset) {
      return i32[this.index4(offset)];
    }

    getInt32(offset) {
      return dvw.getInt32(this.offset(offset), LENDIAN);
    }

    setInt32(offset, value) {
      dvw.setInt32(this.offset(offset), value, LENDIAN);
      return value;
    }

    loadUint32(offset) {
      return Atomics.load(u32, this.index4(offset));
    }

    storeUint32(offset, value) {
      Atomics.store(u32, this.index4(offset), value);
      return value;
    }

    addUint32(offset, value) {
      return Atomics.add(u32, this.index4(offset), value);
    }

    atUint32(offset) {
      return u32[this.index4(offset)];
    }

    getUint32(offset) {
      return dvw.getUint32(this.offset(offset), LENDIAN);
    }

    setUint32(offset, value) {
      dvw.setUint32(this.offset(offset), value, LENDIAN);
      return value;
    }

    loadUint16(offset) {
      return Atomics.load(u16, this.index2(offset));
    }

    storeUint16(offset, value) {
      Atomics.store(u16, this.index2(offset), value);
      return value;
    }

    addUint16(offset, value) {
      return Atomics.add(u16, this.index2(offset), value);
    }

    atUint16(offset) {
      return u16[this.index2(offset)];
    }

    getUint16(offset) {
      return dvw.getUint16(this.offset(offset), LENDIAN);
    }

    setUint16(offset, value) {
      dvw.setUint16(this.offset(offset), value, LENDIAN);
      return value;
    }

    loadUint8(offset) {
      return Atomics.load(ui8, this.index1(offset));
    }

    storeUint8(offset, value) {
      Atomics.store(ui8, this.index1(offset), value);
      return value;
    }

    addUint8(offset, value) {
      return Atomics.add(ui8, this.index1(offset), value);
    }

    getUint8(offset) {
      return dvw.getUint8(this.offset(offset));
    }

    setUint8(offset, value) {
      dvw.setUint8(this.offset(offset), value);
      return value;
    }

    atFloat32(offset) {
      return f32[this.index4(offset)];
    }

    getFloat32(offset) {
      return dvw.getFloat32(this.offset(offset), LENDIAN);
    }

    setFloat32(offset, value) {
      dvw.setFloat32(this.offset(offset), value, LENDIAN);
      return value;
    }

  };

  ByteOffset.headLength = 0;

  ByteOffset.byteLength = 0;

  return ByteOffset;

}).call(this);

export var Pointer = (function() {
  class Pointer extends ByteOffset {
    static createBuffer() {
      var initial, maximum, memory, options;
      initial = arguments[0] || 100000;
      maximum = initial * 10;
      options = {
        initial,
        maximum,
        shared: true
      };
      try {
        memory = new WebAssembly.Memory(options);
      } catch (error) {
        return this.createBuffer(Math.floor(initial / 10));
      }
      return this.setBuffer((OBJECTS[0] = memory).buffer);
    }

    static setBuffer() {
      var sab;
      sab = arguments[0];
      dvw = new DataView(sab);
      ui8 = new Uint8Array(sab);
      i32 = new Int32Array(sab);
      u32 = new Uint32Array(sab);
      u16 = new Uint16Array(sab);
      f32 = new Float32Array(sab);
      Object.defineProperty(ByteOffset.prototype, "buffer", {
        value: sab
      });
      Object.defineProperty(ByteOffset.prototype, "scope", {
        get: function() {
          return OBJECTS;
        }
      });
      return Atomics.or(u32, 0, Pointer.headLength);
    }

    constructor() {
      if (!arguments.length) {
        return super(Atomics.add(u32, 0, Pointer.headLength)).writeAllocation();
      }
      Object.setPrototypeOf(super(arguments[0]), this.prototype);
    }

    writeAllocation() {
      Atomics.add(u32, 0, this.byteLength = this.constructor.byteLength);
      this.prototype = this.getPrototypeId();
      return this;
    }

    getPrototypeId() {
      var base;
      return (base = this.constructor).prototypeId != null ? base.prototypeId : base.prototypeId = -1 + OBJECTS.push(Object.getPrototypeOf(this));
    }

  };

  Pointer.headLength = 4 * 10;

  Pointer.byteLength = 4 * 120;

  return Pointer;

}).call(this);

Object.defineProperties(Pointer.prototype, {
  byteLength: {
    get: function() {
      return this.loadUint32(-4);
    },
    set: function() {
      return this.storeUint32(-4, arguments[0]);
    }
  },
  prototype: {
    get: function() {
      return OBJECTS[this.loadUint32(-8)];
    },
    set: function() {
      return this.storeUint32(-8, arguments[0]);
    }
  }
});

export var ExtendedPointer = (function() {
  class ExtendedPointer extends Pointer {};

  ExtendedPointer.byteLength = 4 * 12;

  return ExtendedPointer;

}).call(this);

export var ExtendedPointer2 = (function() {
  class ExtendedPointer2 extends Pointer {};

  ExtendedPointer2.byteLength = 4 * 22;

  return ExtendedPointer2;

}).call(this);

export default Pointer;
