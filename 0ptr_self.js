export var defaults = {
  //? primitive constructors
  Array: [].constructor,
  Object: {}.constructor,
  String: ''.constructor,
  Number: .1.constructor,
  Boolean: true.constructor,
  RegExp: /()/.constructor,
  Function: (function() {}).constructor,
  //? array views
  Uint8Array: self.Uint8Array,
  Int8Array: self.Int8Array,
  Int16Array: self.Int16Array,
  Uint16Array: self.Uint16Array,
  Uint32Array: self.Uint32Array,
  Int32Array: self.Int32Array,
  Float32Array: self.Float32Array,
  Float64Array: self.Float64Array,
  BigUint64Array: self.BigUint64Array,
  BigInt64Array: self.BigInt64Array,
  DataView: self.DataView,
  //? special definitions
  TypedArray: Object.getPrototypeOf(self.Uint8Array),
  //? buffers
  ArrayBuffer: self.ArrayBuffer,
  SharedArrayBuffer: self.SharedArrayBuffer,
  //? functions
  defineProperty: Object.defineProperty,
  defineProperties: Object.defineProperties,
  prototypeOf: Object.getPrototypeOf,
  
  //? global calls
  eval: self.eval,
  scope: self.self,
  randomUUID: self.crypto.randomUUID.bind(self.crypto),
  //? global primitives
  name: self.name
};

export {
  defaults as default
};
