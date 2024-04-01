//? this is zero pointer - fastest
/*
unless WorkerGlobalScope? then obj = []
else obj = new Proxy [], get : ( ref, key) ->

        unless result = Reflect.get arguments...
            if !isNaN( key ) and 4 < key *= 1
                notifyi = 4 * 256 * 2

                postMessage [ notifyi, key ]
                bc.postMessage [ notifyi, key ]

                Atomics.wait i32, notifyi

                begin = 4 + notifyi * 4
                byteLength = Atomics.load u32, notifyi
                response = ui8.subarray begin, begin + byteLength 
                reply = new TextDecoder().decode response.slice() 

                { name, type, prop } = JSON.parse reply

                Target = new (eval("(class #{name} extends Object {})"))()
                Object.assign Target, prop

                return ref[ key ] = new Proxy Target, get : ( ref, key ) ->

                    switch ref[key]
                        when "string"
                            postMessage [ notifyi, key, ref[key] ]

        return result

obj.push null, u32, i32, ui8
self.obj = obj #! remove
*/
var BYTELENGTH_HEADER, BYTEOFFSET_PARENT, BYTES_PER_ELEMENT, INDEX_ATOMIC_NEXT, INDEX_BYTE_LENGTH, INDEX_PARENT_PTRI, INDEX_PROTO_CLASS, INITIAL, ITEMLENGTH_HEADER, LENDIAN, bc, dvw, f32, i32, malloc, obj, sab, scopei, textDecoder, textEncoder, u16, u32, ui8;

import {
  AtomicScope
} from "./0Ptr_scope.js";

import {
  KeyBase
} from "./0Ptr_keybase.js";

textEncoder = new TextEncoder();

textDecoder = new TextDecoder();

[bc, obj, sab, i32, u32, f32, u16, ui8, dvw, LENDIAN = 0x3f === new Uint8Array(Float32Array.of(1).buffer)[0x3], INDEX_BYTE_LENGTH = -1, INDEX_PROTO_CLASS = -2, INDEX_PARENT_PTRI = -3, INDEX_ATOMIC_NEXT = -4, BYTES_PER_ELEMENT = 4, ITEMLENGTH_HEADER = 4, BYTELENGTH_HEADER = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT, BYTEOFFSET_PARENT = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI, INITIAL = 8] = [new BroadcastChannel("0ptr"), [null]];

malloc = function() {
  var byteLength, mod, next, ptr, ptri;
  ptri = (ptr = arguments[0]) / 4;
  if (byteLength = ptr.constructor.byteLength) {
    if (mod = byteLength % 4) {
      byteLength += 4 - mod;
    }
    Atomics.add(u32, 0, byteLength);
    Atomics.add(u32, 1, byteLength / 4);
    next = ptri + ITEMLENGTH_HEADER + byteLength / 4;
    Atomics.store(u32, ptri + INDEX_ATOMIC_NEXT, next); //write byteLength
    Atomics.store(u32, ptri + INDEX_BYTE_LENGTH, byteLength); //write byteLength
    return Atomics.store(u32, ptri + INDEX_PROTO_CLASS, scopei(ptr.constructor)); //write byteLength
  }
};

scopei = function() {
  var i, object;
  try {
    [object, i = 0] = arguments;
  } catch (error) {}
  if (i) {
    if (obj[i * 1] = object) {
      return i;
    }
  }
  if (-1 === (i = obj.indexOf(arguments[0]))) {
    i += obj.push(arguments[0]);
  }
  return i;
};

export var OPtr = (function() {
  class OPtr extends Number {
    static setup() {
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
      Object.defineProperty(this.prototype, "buffer", {
        value: sab,
        configurable: false
      });
      return console.warn("OPtr has been settled", this.prototype.buffer);
    }

    static filter() {
      var Prop, Proto, ref;
      ref = arguments[0];
      for (Prop in ref) {
        Proto = ref[Prop];
        (function(prop, pclass) {
          return Object.defineProperty(this, prop, {
            get: function() {
              var Ptri, children, i, max, ptri;
              i = INITIAL;
              max = 2 + Atomics.load(u32, 1);
              ptri = this * 1;
              children = [];
              while (true) {
                if (!(ptri - Atomics.load(u32, i + INDEX_PARENT_PTRI))) {
                  Ptri = Atomics.load(u32, i + INDEX_PROTO_CLASS);
                  if (!pclass || pclass === Ptri) {
                    if (typeof document === "undefined" || document === null) {
                      console.error(Ptri);
                    }
                    children.push(new obj[Ptri](i * 4));
                  }
                }
                if (max < (i = Atomics.load(u32, i + INDEX_ATOMIC_NEXT))) {
                  break;
                }
              }
              return children;
            }
          });
        }).call(this.prototype, Prop, Proto === OPtr ? 0 : scopei(Proto));
      }
      return this;
    }

    static reserv(proto, length = 1) {
      var ALGINBYTES, BYTELENGTH, byteOffset, mod;
      BYTELENGTH = length * (proto.byteLength || proto.BYTES_PER_ELEMENT);
      ALGINBYTES = proto.BYTES_PER_ELEMENT || Math.max(proto.byteLength % 4, 4);
      if (mod = this.byteLength % ALGINBYTES) {
        mod = ALGINBYTES - mod;
      } else {
        mod = 0;
      }
      byteOffset = this.byteLength + mod;
      Object.defineProperties(this, {
        length: {
          value: this.length + length,
          writable: true
        },
        byteLength: {
          writable: true,
          value: byteOffset + BYTELENGTH
        }
      });
      return byteOffset;
    }

    constructor() {
      var O, argc, ptri;
      if (!arguments[0]) {
        malloc(super(ptri = Atomics.add(u32, 0, BYTELENGTH_HEADER)));
      // new OPtr( offset1, offset2, ... )
      } else if (argc = arguments.length) {
        ptri = 0;
        while (O = arguments[--argc]) {
          ptri += O;
        }
        super(ptri);
      }
      try {
        if (!ptri) {
          // slient error notify
          console.error(["OFFSET_POINTER_IS_ZERO", `new ${this.constructor.name}(${[...arguments]})`, ptri]);
        }
      } catch (error) {}
    }

    index4() {
      return (this + (arguments[0] || 0)) / 4;
    }

    index2() {
      return (this + arguments[0] || 0) / 2;
    }

    offset() {
      return this + arguments[0] || 0;
    }

    attach(ptr) {
      return this.storeUint32(BYTEOFFSET_PARENT, ptr);
    }

    ptrParent(Ptr) {
      return this.ptrUint32(BYTEOFFSET_PARENT, Ptr);
    }

    bcast(type, data) {
      bc.postMessage({
        data,
        type,
        ptri: +this
      });
      return this.lock().data;
    }

    lock() {
      Atomics.wait(i32, this.index4(arguments[0]));
      return this;
    }

    unlock() {
      Atomics.notify(i32, this.index4(arguments[0]), arguments[1] || 1);
      return this;
    }

    encodeText() {
      return textEncoder.encode(arguments[0]);
    }

    encodeJSON() {
      return this.encodeText(JSON.stringify(arguments[0]));
    }

    decodeText() {
      return textDecoder.decode(arguments[0].slice());
    }

    decodeJSON() {
      return JSON.parse(this.decodeText(arguments[0]));
    }

    ptrUint32() {
      return new (arguments[1] || Pointer)(this.loadUint32(arguments[0]));
    }

    objUint32() {
      return obj[this.loadUint32(arguments[0])];
    }

    loadUint32() {
      return Atomics.load(u32, this.index4(arguments[0]));
    }

    storeUint32() {
      return Atomics.store(u32, this.index4(arguments[0]), arguments[1]);
    }

    addUint32() {
      return Atomics.add(u32, this.index4(arguments[0]), arguments[1]);
    }

    andUint32() {
      return Atomics.and(u32, this.index4(arguments[0]), arguments[1]);
    }

    waitUint32() {
      return Atomics.wait(u32, this.index4(arguments[0]), arguments[1]);
    }

    orUint32() {
      return Atomics.or(u32, this.index4(arguments[0]), arguments[1]);
    }

    xorUint32() {
      return Atomics.xor(u32, this.index4(arguments[0]), arguments[1]);
    }

    keyUint32() {
      return arguments[1][this.getUint32(arguments[0])];
    }

    getUint32() {
      return dvw.getUint32(this + arguments[0], LENDIAN);
    }

    setUint32() {
      dvw.setUint32(this + arguments[0], arguments[1], LENDIAN);
      return arguments[1];
    }

    arrayUint8() {
      return new Uint8Array(sab, this.offset(arguments[0]), arguments[1]);
    }

    copyUint8() {
      ui8.set(arguments[1], this.offset(arguments[0]));
      return arguments[1].byteLength;
    }

    keyUint8() {
      return arguments[1][this.getUint8(arguments[0])];
    }

    getUint8() {
      return dvw.getUint8(this + arguments[0]);
    }

    setUint8() {
      dvw.setUint8(this + arguments[0], arguments[1]);
      return arguments[1];
    }

    loadUint8() {
      return Atomics.load(ui8, this + arguments[0]);
    }

    storeUint8() {
      return Atomics.store(ui8, this + arguments[0], arguments[1]);
    }

    keyUint16() {
      return arguments[1][this.getUint16(arguments[0])];
    }

    getUint16() {
      return dvw.getUint16(this + arguments[0], LENDIAN);
    }

    setUint16() {
      dvw.setUint16(this + arguments[0], arguments[1], LENDIAN);
      return arguments[1];
    }

    loadUint16() {
      return Atomics.load(u16, this.index2(arguments[0]));
    }

    storeUint16() {
      return Atomics.store(u16, this.index2(arguments[0]), arguments[1]);
    }

    getFloat32() {
      return dvw.getFloat32(this + arguments[0], LENDIAN);
    }

    setFloat32() {
      dvw.setFloat32(this + arguments[0], arguments[1], LENDIAN);
      return arguments[1];
    }

  };

  OPtr.metaUrl = import.meta.url;

  OPtr.prototype.scopei = scopei;

  OPtr.prototype.obj = obj;

  OPtr.byteLength = 0;

  return OPtr;

}).call(this);

export {
  OPtr as default
};

if ((typeof window !== "undefined" && window !== null) && (typeof document !== "undefined" && document !== null)) {
  OPtr.setup(new SharedArrayBuffer(1024 * 1024));
  self.onclick = function() {
    return console.warn(obj);
  };
  self.name = "window";
} else {
  addEventListener("message", function(e) {
    OPtr.setup(e.data);
    return dispatchEvent(new CustomEvent("ready", {
      detail: self
    }));
  }, {
    once: true
  });
  null;
}

bc.onmessage = function() {
  var data, desc, j, len, name, obji, prop, proto, ptri, ref, thread, type;
  (bc.Thread != null ? bc.Thread : bc.Thread = obj.find(function(o) {
    return (o != null ? o.name : void 0) === "Thread";
  }));
  ({type, data, ptri} = arguments[0].data);
  (thread = new bc.Thread(ptri));
  switch (type) {
    case "findScopei":
      ref = obj.slice(1);
      for (j = 0, len = ref.length; j < len; j++) {
        proto = ref[j];
        if (data === (proto != null ? proto.name : void 0)) {
          thread.data = obj.indexOf(proto);
          return thread.unlock();
        }
      }
      thread.data = -1;
      return thread.unlock();
    case "loadObject":
      if (!obj[data.scopei]) {
        ptr.unlock();
        throw ["nonononono"];
      }
      switch (typeof obj[data.scopei]) {
        case "object":
          obji = obj[data.scopei];
          name = obji.name || obji.constructor.name;
          data = {
            name,
            prop: {}
          };
          for (prop in obji) {
            desc = obji[prop];
            data.prop[prop] = typeof desc;
          }
          ptr.data = data;
          return ptr.unlock();
      }
      break;
    case "getObjectProp":
      if (!obj[data.scopei]) {
        return;
      }
      ptr.data = obj[data.scopei][data.prop];
      return ptr.unlock();
    case "setObjectProp":
      if (!obj[data.scopei]) {
        return;
      }
      console.warn(data.prop, data.val);
      obj[data.scopei][data.prop] = data.val;
      ptr.data = obj[data.scopei][data.prop];
      return ptr.unlock();
  }
};
