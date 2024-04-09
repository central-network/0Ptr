var isBridge, isCPU;

isCPU = /cpu/.test(name);

isBridge = (typeof WorkerGlobalScope !== "undefined" && WorkerGlobalScope !== null) && !isCPU;

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
          super(memory.loadResolv(call));
        }
        if (isBridge) {
          memory.malloc(super(memory.malloc()));
          memory.storeResolv(call, this);
          memory.storeUint32(3, 1);
          memory.unlock(3);
        }
      } else {
        super(ptri);
      }
      if (isCPU && this.proxyOnCPU) {
        return new Proxy(this, this.proxyHandle());
      }
    }

    proxyHandle() {
      return {
        get: function(ref, key) {
          console.log(name, "proxy get:", {ref, key});
          return Reflect.get(...arguments);
        },
        set: function(ref, key, val) {
          console.log(name, "proxy set:", {ref, key, val});
          return Reflect.set(...arguments);
        }
      };
    }

  };

  Pointer.TypedArray = Uint8Array;

  Pointer.byteLength = 0;

  return Pointer;

}).call(this);

Object.defineProperties(Pointer.prototype, {
  next: {
    get: function() {
      if (self.isBridge) { // mark remove if not debugging
        /GET_ITERATOR_INDEX_FORBIDDEN_ON_BRIDGE/.throw(this, name);
      }
      return memory.addUint32(this + Pointer.HINDEX_ITERATOR_I, 1);
    },
    set: function() {
      if (self.isCPU) { // mark remove if not debugging
        /SET_ITERATOR_INDEX_FORBIDDEN_ON_CPU/.throw(this, name);
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
