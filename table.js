var error, log, warn;

import * as OPTR from "./0ptr.js";

({log, warn, error} = console);

export var Database = (function() {
  class Database extends OPTR.ObjectPointer {
    static create(pages = 0) {
      return this.new(pages * 654);
    }

    createTable(name) {
      var tbli;
      tbli = Table.new();
      tbli.name = name;
      return this.appendChild(tbli);
    }

    createOperation() {
      return Operation.from(...arguments);
    }

  };

  Database.classPointer = OPTR.ClassPointer.from(Database);

  return Database;

}).call(this);

export var Column = (function() {
  class Column extends OPTR.ObjectPointer {};

  Column.classPointer = OPTR.ClassPointer.from(Column);

  return Column;

}).call(this);

export var Table = (function() {
  class Table extends OPTR.ObjectPointer {
    createColumn(name, instanceOf, byteLength) {
      var column;
      column = new Object({
        name,
        instanceOf,
        byteLength,
        offset: this.stride
      });
      return this.appendChild(Object.assign(Column.new(), column));
    }

  };

  Table.classPointer = OPTR.ClassPointer.from(Table);

  return Table;

}).call(this);

export var Operator = (function() {
  class Operator extends OPTR.ObjectPointer {
    static from(operator = "+") {
      return Object.assign(this.new(), {
        type: this.operators.indexOf(operator)
      });
    }

    toPrimitive() {
      return Operator.operators[this.type];
    }

  };

  Operator.classPointer = OPTR.ClassPointer.from(Operator);

  Operator.operators = [0, "+", "-", "*", "/", "%"];

  Object.defineProperty(Operator.prototype, "operator", {
    enumerable: true,
    get: Operator.prototype.toPrimitive
  });

  Object.defineProperty(Operator.prototype, "children", {
    enumerable: false,
    value: []
  });

  return Operator;

}).call(this);

export var Operation = (function() {
  class Operation extends OPTR.ObjectPointer {
    static from(arg0, arg1, result, operator, begin = 0, count = 0, index = 0) {
      var operation;
      operator = Operator.from(operator);
      operation = new Object({begin, count, index, arg0, arg1, result, operator});
      return Object.assign(Operation.new(), operation);
    }

  };

  Operation.classPointer = OPTR.ClassPointer.from(Operation);

  return Operation;

}).call(this);

Database.defineProperty("buffer", {
  enumerable: true,
  get: function() {
    return function() {
      return this.subarray();
    };
  }
});

Database.definePointer("bufferOffset", {
  enumerable: true,
  instanceOf: OPTR.Uint32Number
});

Database.definePointer("bufferLength", {
  enumerable: true,
  instanceOf: OPTR.Uint32Number
});

Table.defineProperty("stride", {
  enumerable: true,
  get: function() {
    return function(blen = 0) {
      var c, i, len, ref;
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        blen += c.byteLength;
      }
      return blen;
    };
  }
});

Table.definePointer("name", {
  enumerable: true,
  instanceOf: OPTR.StringPointer
});

Column.definePointer("byteLength", {
  enumerable: true,
  instanceOf: OPTR.Uint16Number
});

Column.definePointer("offset", {
  enumerable: true,
  instanceOf: OPTR.Uint16Number
});

Column.definePointer("instanceOf", {
  enumerable: true,
  instanceOf: OPTR.ClassPointer
});

Column.definePointer("name", {
  enumerable: true,
  instanceOf: OPTR.StringPointer
});

Operation.definePointer("begin", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Operation.definePointer("count", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Operation.definePointer("index", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Operation.definePointer("arg0", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("arg1", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("result", {
  byteLength: 4,
  enumerable: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("operator", {
  enumerable: true,
  instanceOf: Operator
});

Operator.definePointer("type", {
  enumerable: true,
  instanceOf: OPTR.Uint8Number
});
