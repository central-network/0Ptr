var KeyOf, TypedArray, ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO, exports;

import defaults from "./0ptr_self.js";

exports = new defaults.Object;

TypedArray = Object.getPrototypeOf(defaults.Uint8Array);

Object.defineProperty(defaults.String, "charCodeOf", {
  value: function() {
    return arguments[0].charCodeAt(0);
  }
});

Object.defineProperty(defaults.String.prototype, "toNumber", {
  value: function() {
    return this.split("").map(String.charCodeOf).sumValues();
  }
});

Object.defineProperty(defaults.RegExp.prototype, "toNumber", {
  value: function() {
    return this.source.toNumber();
  }
});

Object.defineProperty(defaults.RegExp.prototype, "throw", {
  value: function() {
    if (!console.error("\t\t\t ", ...arguments)) {
      throw new Error(this.source);
    }
  }
});

Object.defineProperty(defaults.Array.prototype, "sumValues", {
  value: function() {
    return this.reduce(function(i, j) {
      return i + j || 0;
    });
  }
});

Object.defineProperty(TypedArray.prototype, "sumValues", {
  value: function() {
    return [...this].sumValues();
  }
});

KeyOf = class KeyOf extends Number {
  with() {
    return [this, ...arguments];
  }

};

exports.ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO = new (ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO = class ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO extends KeyOf {})(/ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO/.toNumber());

export default exports;
