export var KeyBase = (function() {
  class KeyBase extends Object {
    constructor(source = {}, options = {}) {
      super().configure(options).add(source);
    }

    //.scopeIndex = -1 + @scope.push( this )
    configure(options) {
      var option, ref, symbol, value;
      ref = this.defaults;
      for (option in ref) {
        value = ref[option];
        symbol = this.constructor[option];
        if (value == null) {
          value = this.constructor.defaults[option];
        }
        Object.defineProperty(this, symbol, {value});
      }
      return this;
    }

    static generate(source = {}) {
      var base, key, label;
      base = new this();
      for (label in source) {
        key = source[label];
        Object.defineProperty(base.set(label, base.__encode__(key)), key, {
          value: base[label]
        });
      }
      return base;
    }

    set(label, value, proto = this.__extend__) {
      var key;
      if (!this.__filter__(value)) {
        return;
      }
      if (this.hasOwnProperty(value)) {
        return;
      }
      key = new (eval(`(class ${label} extends ${proto.name} {})`))(value);
      Object.defineProperty(this, label, {
        value: key
      });
      Object.defineProperty(this, value, {
        value: key
      });
      return this;
    }

    add(source, proto = this.__extend__) {
      var label, value;
      for (label in source) {
        value = source[label];
        this.set(label, value, proto);
      }
      return this;
    }

  };

  KeyBase.metaUrl = import.meta.url;

  KeyBase.filter = "__filter__";

  KeyBase.extend = "__extend__";

  KeyBase.encode = "__encode__";

  KeyBase.prototype.defaults = {
    filter: function() {
      return arguments[0];
    },
    extend: Number,
    encode: function() {
      return [0, ...arguments[0]].reduce(function(a, b) {
        return a + b.charCodeAt();
      });
    }
  };

  return KeyBase;

}).call(this);
