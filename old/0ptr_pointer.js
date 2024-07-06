var HEADERS_HINDEX, HINDEX_BEGIN, HINDEX_BYTELENGTH, HINDEX_BYTEOFFSET, HINDEX_END, HINDEX_ITERATOR_I, HINDEX_LENGTH, HINDEX_PROTOCLASS, HINDEX_RESOLV_CID, HINDEX_RESOLV_PTR, isBridge, isCPU;

isCPU = /cpu/.test(name);

isBridge = (typeof WorkerGlobalScope !== "undefined" && WorkerGlobalScope !== null) && !isCPU;

HEADERS_HINDEX = 0;

HINDEX_BEGIN = HEADERS_HINDEX++;

HINDEX_END = HEADERS_HINDEX++;

HINDEX_LENGTH = HEADERS_HINDEX++;

HINDEX_PROTOCLASS = HEADERS_HINDEX++;

HINDEX_RESOLV_CID = HEADERS_HINDEX++;

HINDEX_RESOLV_PTR = HEADERS_HINDEX++;

HINDEX_BYTELENGTH = HEADERS_HINDEX++;

HINDEX_BYTEOFFSET = HEADERS_HINDEX++;

HINDEX_ITERATOR_I = HEADERS_HINDEX++;

export var Pointer = (function() {
  class Pointer extends Number {
    constructor(ptri) {
      var call;
      if (!arguments.length) {
        if (isCPU && !memory.loadUint32(3)) {
          memory.lock(3);
        }
        call = memory.resolvCall();
        if (isCPU) {
          super(ptri = memory.loadResolv(call));
        }
        if (isBridge) {
          memory.malloc(super(ptri = memory.malloc()));
          memory.storeResolv(call, this);
          memory.storeUint32(3, 1);
          memory.unlock(3);
        }
      } else {
        super(ptri);
      }
      if (isCPU && this.proxyOnCPU) {
        return new Proxy(this, this.proxyHandle(ptri));
      }
    }

    proxyHandle(ptri) {
      var array, begin, byteOffset, length, max, valueOf;
      length = memory.loadUint32(ptri + HINDEX_LENGTH);
      begin = memory.loadUint32(ptri + HINDEX_BEGIN);
      max = length - 1;
      byteOffset = memory.loadUint32(ptri + HINDEX_BYTEOFFSET);
      array = new this.constructor.TypedArray(memory, byteOffset, length);
      valueOf = function() {
        return ptri;
      };
      return {
        get: function(ref, key, pxy) {
          //console.log name, "proxy get:", { key }
          if (key === Symbol.toPrimitive) {
            return function() {
              return ptri;
            };
          }
          try {
            if (!isNaN(key)) {
              return array[key];
            }
          } catch (error) {}
          switch (key) {
            case "length":
              return length;
            case "valueOf":
              return valueOf;
          }
          //todo "next" then return ...
          return Reflect.get(ref, key, pxy);
        },
        set: function(ref, key, val) {
          //console.log name, "proxy set:", { key, val }
          if (!isNaN(key)) {
            array[key] = val;
            if (!(key - max)) {
              memory.unlock(7);
            }
            return key;
          }
          return Reflect.set(...arguments);
        },
        has: function(ref, key) {
          console.log(name, "proxy has:", {ref, key});
          return Reflect.has(...arguments);
        },
        ownKeys: function(ref, pxy) {
          var cpuBegin, cpuCount, cpuEnd, cpuIndex, keyCount, perCount, res;
          res = Reflect.ownKeys(array, pxy);
          //console.log name, "proxy ownKeys:", { ref }, res
          cpuCount = self.cpuCount;
          cpuIndex = self.name[3] * 1;
          keyCount = res.length;
          perCount = Math.ceil(keyCount / cpuCount);
          cpuBegin = cpuIndex * perCount;
          cpuEnd = Math.min(keyCount, cpuBegin + perCount);
          return res.slice(cpuBegin, cpuEnd);
        },
        getPrototypeOf: function(ref, pxy) {
          //console.log name, "proxy getPrototypeOf:", { ref }
          return Reflect.getPrototypeOf(array, pxy);
        },
        getOwnPropertyDescriptor: function(ref, key, pxy) {
          //console.log name, "proxy getOwnPropertyDescriptor:", { key }
          return Reflect.getOwnPropertyDescriptor(array, key, pxy);
        }
      };
    }

  };

  Pointer.TypedArray = Uint8Array;

  Pointer.byteLength = 0;

  return Pointer;

}).call(this);

Object.defineProperties(Pointer.prototype, {
  array: {
    get: function() {
      return new this.realizeWith(memory, this.byteOffset, this.length);
    }
  },
  byteOffset: {
    get: function() {
      return memory.loadUint32(this + HINDEX_BYTEOFFSET);
    }
  },
  byteLength: {
    get: function() {
      return memory.loadUint32(this + HINDEX_BYTELENGTH);
    }
  },
  length: {
    get: function() {
      return memory.loadUint32(this + HINDEX_LENGTH);
    }
  },
  iterate: {
    value: function() {
      if (!arguments.length) {
        return memory.addUint32(this + Pointer.HINDEX_ITERATOR_I, 1);
      }
      if (isCPU) { // mark remove if not debugging
        /SET_ITERATOR_INDEX_FORBIDDEN_ON_CPU/.throw([this, name]);
      }
      return memory.storeUint32(this + Pointer.HINDEX_ITERATOR_I, arguments[0]);
    }
  },
  [/{[Pointer]}/.source]: {
    get: function() {
      return {
        protoclass: memory.scope.store(this.constructor.prototype),
        memory: memory,
        TypedArray: this.buffer.slice().buffer,
        byteLength: this.constructor.byteLength,
        headers: memory.subarrayUint32(+this, this + memory.COUNT_OF_HEADERS)
      };
    }
  }
});
