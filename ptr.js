var BYTES_PER_HEADER, LENDIAN, OBJECTS, OFFSET_OF_MEMORY, dvw, f32, i32, u16, u32, ui8;

try {
  [
    //? These are global for Window and proxy container for Threads
    OBJECTS = new Array(),
    //? endianness is important because of DataView operations are 
    //? using Big-Endian always if we don't supply as last argument
    //? but TypedArray and Atomics operations are using navigator's
    //? endianness and there is no possibility to change   
    //? On the other hand we are using all of these three operators 
    //? and we need to supply client's "endianness" for DataView to   
    //? be sure all of write/read operations will same results even   
    //? client's endianness is not Big-Endian So keep far away.. GO    
    LENDIAN = 0x3f === new Uint8Array(Float32Array.of(1).buffer)[0x3],
    ui8 = i32 = u32 = u16 = dvw = f32 = 0x0, //? make visible  //? this arrays //? over scope
    
    //? first 16 bytes reserved for malloc
    OFFSET_OF_MEMORY = 0x04 * 4,
    
    //? every malloc has at least 40 bytes
    BYTES_PER_HEADER = 0x04 * 10
  ];
} catch (error) {}

Object.getPrototypeOf(Uint8Array).prototype.isTypedArray = Object.getPrototypeOf(Uint8Array).isTypedArray = true;

Object.defineProperties(Object.getPrototypeOf(Uint8Array), {
  ofInt8: {
    value: function() {
      return new this(Int8Array.of(...arguments).buffer);
    }
  },
  ofUint8: {
    value: function() {
      return new this(Uint8Array.of(...arguments).buffer);
    }
  },
  ofInt16: {
    value: function() {
      return new this(Int16Array.of(...arguments).buffer);
    }
  },
  ofUint16: {
    value: function() {
      return new this(Uint16Array.of(...arguments).buffer);
    }
  },
  ofUint32: {
    value: function() {
      return new this(Uint32Array.of(...arguments).buffer);
    }
  },
  ofInt32: {
    value: function() {
      return new this(Int32Array.of(...arguments).buffer);
    }
  },
  ofFloat32: {
    value: function() {
      return new this(Float32Array.of(...arguments).buffer);
    }
  },
  ofFloat64: {
    value: function() {
      return new this(Float64Array.of(...arguments).buffer);
    }
  }
});

export var KeyBase = (function() {
  class KeyBase extends Object {
    constructor(source = {}, options = {}) {
      super();
      options = {...this.defaults, options};
      Object.defineProperties(this, {
        filter: {
          value: options.filter
        },
        extend: {
          value: options.extend
        },
        source: {
          value: source
        }
      });
      this.add(source);
    }

    set(label, value, proto = this.extend) {
      var key;
      if (!this.filter(value)) {
        return;
      }
      if (this.hasOwnProperty(value)) {
        return;
      }
      key = new (eval(`(class ${label} extends ${proto.name} {})`))(value);
      Object.defineProperty(this, label, {
        value: key
      });
      return Object.defineProperty(this, value, {
        value: key
      });
    }

    add(source = {}, proto = this.extend) {
      var label, value;
      for (label in source) {
        value = source[label];
        this.set(label, value);
      }
      return this;
    }

  };

  KeyBase.prototype.defaults = {
    filter: function() {
      return arguments[0];
    },
    extend: Number
  };

  return KeyBase;

}).call(this);

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

    static register() {
      var Ptr, j, len, ref;
      ref = [...arguments];
      for (j = 0, len = ref.length; j < len; j++) {
        Ptr = ref[j];
        if (Object.hasOwn(Ptr, "protoIndex")) {
          continue;
        }
        Object.defineProperty(Ptr, "protoIndex", {
          value: this.store(Ptr.prototype)
        });
        Object.defineProperty(Ptr.prototype, "instanced", {
          value: true
        });
      }
      return this;
    }

    static store(object) {
      var i;
      if (-1 === (i = OBJECTS.indexOf(object))) {
        i += OBJECTS.push(object);
      }
      return i;
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

    addInt32(offset, value) {
      return Atomics.add(i32, this.index4(offset), value);
    }

    storeInt32(offset, value) {
      Atomics.store(i32, this.index4(offset), value);
      return value;
    }

    getInt32(offset) {
      return dvw.getInt32(this.offset(offset), LENDIAN);
    }

    setInt32(offset, value) {
      dvw.setInt32(this.offset(offset), value, LENDIAN);
      return value;
    }

    atInt32(offset) {
      return i32[this.index4(offset)];
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

    getUint32(offset) {
      return dvw.getUint32(this.offset(offset), LENDIAN);
    }

    setUint32(offset, value) {
      dvw.setUint32(this.offset(offset), value, LENDIAN);
      return value;
    }

    keyUint32(offset, keyof) {
      var ref, v;
      return (ref = keyof[v = this.getUint32(offset)]) != null ? ref : v;
    }

    atUint32(offset) {
      return u32[this.index4(offset)];
    }

    loadUint16(offset) {
      return Atomics.load(u16, this.index2(offset));
    }

    addUint16(offset, value) {
      return Atomics.add(u16, this.index2(offset), value);
    }

    storeUint16(offset, value) {
      Atomics.store(u16, this.index2(offset), value);
      return value;
    }

    getUint16(offset) {
      return dvw.getUint16(this.offset(offset), LENDIAN);
    }

    setUint16(offset, value) {
      dvw.setUint16(this.offset(offset), value, LENDIAN);
      return value;
    }

    keyUint16(offset, keyof) {
      var ref, v;
      return (ref = keyof[v = this.getUint16(offset)]) != null ? ref : v;
    }

    atUint16(offset) {
      return u16[this.index2(offset)];
    }

    loadUint8(offset) {
      return Atomics.load(ui8, this.offset(offset));
    }

    addUint8(offset, value) {
      return Atomics.add(ui8, this.offset(offset), value);
    }

    storeUint8(offset, value) {
      Atomics.store(ui8, this.offset(offset), value);
      return value;
    }

    getUint8(offset) {
      return dvw.getUint8(this.offset(offset));
    }

    setUint8(offset, value) {
      dvw.setUint8(this.offset(offset), value);
      return value;
    }

    atUint8(offset) {
      return ui8[this.offset(offset)];
    }

    loadFloat32(offset) {
      return Float32Array.ofUint32(this.loadUint32(offset))[0];
    }

    addUFloat32(offset, value) {
      return this.addUint32(offset, Uint32Array.ofFloat32(value)[0]);
    }

    storeFloat32(offset, value) {
      return this.storeUint32(offset, Uint32Array.ofFloat32(value)[0]);
    }

    setFloat32(offset, value) {
      dvw.setFloat32(this.offset(offset), value, LENDIAN);
      return value;
    }

    getFloat32(offset) {
      return dvw.getFloat32(this.offset(offset), LENDIAN);
    }

    atFloat32(offset) {
      return f32[this.index4(offset)];
    }

    loadObject(offset) {
      var i;
      if (i = this.loadUint32(offset)) {
        return OBJECTS[i];
      }
    }

    storeObject(offset, object) {
      this.storeUint32(offset, ByteOffset.store(object));
      return this;
    }

    loadPointer(offset) {
      var ptr;
      if (ptr = this.loadUint32(offset)) {
        return new Pointer(ptr);
      }
    }

    storePointer(offset, ptr) {
      return this.storeUint32(offset, ptr);
    }

  };

  ByteOffset.isPointer = true;

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
      Atomics.or(u32, 0, OFFSET_OF_MEMORY);
      return this;
    }

    init() {
      return this;
    }

    constructor() {
      var byteLength;
      //? new allocation
      if (!arguments.length) {
        super(Atomics.add(u32, 0, BYTES_PER_HEADER));
        Atomics.add(u32, 0, byteLength = this.constructor.byteLength);
        Atomics.store(u32, this.index4(this.OFFSET_BYTELENGTH), byteLength);
        Atomics.store(u32, this.index4(this.OFFSET_PROTOINDEX), this.constructor.protoIndex);
        return this.init();
      }
      
      //? re-allocation
      if (!super(arguments[0]).instanced) {
        Object.setPrototypeOf(this, this.loadObject(this.OFFSET_PROTOINDEX));
      }
    }

    add() {
      return arguments[0].parent = this;
    }

    attach() {
      this.parent = arguments[0];
      return this;
    }

    forEach(handle) {
      var iterator, ptri;
      iterator = this[Symbol.iterator]();
      while (ptri = iterator.next().value) {
        handle.call(this, new Pointer(ptri));
      }
      return this;
    }

    filter(proto, test) {
      var children, iterator, ptr, ptri;
      children = [];
      iterator = this[Symbol.iterator](proto);
      while (ptri = iterator.next().value) {
        ptr = new Pointer(ptri);
        if (!test || test(ptr)) {
          children.push(ptr);
        }
      }
      return children;
    }

    find(proto, test) {
      var iterator, ptr, ptri;
      iterator = this[Symbol.iterator](proto);
      while (ptri = iterator.next().value) {
        ptr = new Pointer(ptri);
        if (!test || test(ptr)) {
          return ptr;
        }
      }
      return null;
    }

  };

  Pointer.prototype.OFFSET_BYTELENGTH = -4 * 1;

  Pointer.prototype.OFFSET_PROTOINDEX = -4 * 2;

  Pointer.prototype.OFFSET_PARENT = -4 * 3;

  return Pointer;

}).call(this);

Object.defineProperties(Pointer.prototype, {
  byteLength: {
    get: function() {
      return this.loadUint32(this.OFFSET_BYTELENGTH);
    },
    set: function() {
      return this.storeUint32(this.OFFSET_BYTELENGTH, arguments[0]);
    }
  },
  parent: {
    get: function() {
      return this.loadPointer(this.OFFSET_PARENT);
    },
    set: function() {
      return this.storePointer(this.OFFSET_PARENT, arguments[0]);
    }
  },
  children: {
    get: Pointer.prototype.filter
  },
  [Symbol.iterator]: {
    value: function(proto = null, stride = this.OFFSET_PARENT) {
      var done, hLength, iLength, iOffset, iProtoI, iStride, mOffset, pointer, ptri;
      ptri = parseInt(pointer = this);
      done = {
        done: true,
        value: false
      };
      iOffset = OFFSET_OF_MEMORY / 4;
      mOffset = Atomics.load(u32, 0) / 4;
      iStride = stride / 4;
      iLength = this.OFFSET_BYTELENGTH / 4;
      iProtoI = this.OFFSET_PROTOINDEX / 4;
      hLength = BYTES_PER_HEADER / 4;
      return {
        next: function() {
          var byteLength, ptr;
          while (iOffset < mOffset) {
            byteLength = Atomics.load(u32, iOffset + iLength);
            if (!(ptri - Atomics.load(u32, iOffset + iStride))) {
              if (!proto || proto.protoIndex === Atomics.load(u32, iOffset + iProtoI)) {
                ptr = iOffset * 4;
              }
            }
            iOffset = iOffset + hLength + byteLength / 4;
            if (ptr) {
              return {
                done: false,
                value: ptr
              };
            }
          }
          return done;
        }
      };
    }
  }
});

export default Pointer.createBuffer();
