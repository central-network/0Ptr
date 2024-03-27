var INITIAL, LENDIAN, OBJECTS, dvw, f32, i32, u16, u32, ui8;

OBJECTS = [];

LENDIAN = !new Uint8Array(Float32Array.of(1).buffer)[0];

INITIAL = 4 * 4;

ui8 = i32 = u32 = u16 = dvw = f32 = null;

Object.defineProperties(Object.getPrototypeOf(Uint8Array), {
  isTypedArray: {
    value: true
  }
});

export var ByteOffset = (function() {
  class ByteOffset extends Number {
    static malloc(byteLength, alignBytes = 1) {
      var byteOffset, mod, perElement;
      if (byteLength.isPointer) {
        alignBytes = byteLength.alignBytes;
        byteLength = byteLength.byteOffset;
      }
      if (byteLength.isTypedArray) {
        perElement = byteLength.BYTES_PER_ELEMENT;
        byteLength = alignBytes * byteLength.BYTES_PER_ELEMENT;
        alignBytes = perElement;
      }
      if (mod = this.byteOffset % alignBytes) {
        mod = alignBytes - mod;
      }
      byteOffset = this.byteOffset + mod;
      this.byteOffset += mod + byteLength;
      return byteOffset;
    }

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

    storeObject(object) {
      var i;
      if (-1 === (i = OBJECTS.indexOf(object))) {
        i += OBJECTS.push(object);
      }
      return i;
    }

    loadObject(i) {
      return OBJECTS[i];
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

  ByteOffset.isPointer = true;

  ByteOffset.headLength = 0;

  ByteOffset.byteLength = 0;

  ByteOffset.byteOffset = 0;

  ByteOffset.alignBytes = 4;

  return ByteOffset;

}).call(this);

export var Pointer = (function() {
  class Pointer extends ByteOffset {
    static createBuffer() {
      var initial, maximum, memory, options;
      if (this.prototype.buffer) {
        return this;
      }
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
      document.onclick = function() {
        return console.log(OBJECTS);
      };
      Atomics.or(u32, 0, INITIAL);
      return this;
    }

    init() {
      return this;
    }

    constructor() {
      //? new allocation
      if (!arguments.length) {
        return super(Atomics.add(u32, 0, Pointer.headLength)).init(this.setAllocation(Atomics.add(u32, 0, this.byteLength = this.constructor.byteLength)));
      }
      
      //? re-allocation
      if (arguments[1] == null) {
        return super(arguments[0]).usePrototype(this.prototype);
      }
      //? inner offset pointer
      return super(arguments[0] + arguments[1]);
    }

    setAllocation() {
      this.prototype = this.getProtoIndex();
      return this;
    }

    usePrototype() {
      return Object.setPrototypeOf(this, arguments[0]);
    }

    getProtoIndex() {
      if (!Object.hasOwn(this.constructor, "protoIndex")) {
        Object.defineProperty(this.constructor, "protoIndex", {
          value: -1 + OBJECTS.push(Object.getPrototypeOf(this))
        });
      }
      return this.constructor["protoIndex"];
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

export default Pointer.createBuffer();
