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
  class Column extends OPTR.ObjectPointer {
    static from(options = {}) {
      var key, ptrc, ptri, val;
      ptri = this.new();
      ptrc = this.classPointer;
      for (key in options) {
        val = options[key];
        ptri[key] = ptrc.getProperty(key).from(val);
      }
      return ptri;
    }

  };

  Column.classPointer = OPTR.ClassPointer.from(Column);

  return Column;

}).call(this);

export var Table = (function() {
  class Table extends OPTR.ObjectPointer {
    createColumn(name, instanceOf, byteLength) {
      return this.appendChild(Column.from({
        name,
        instanceOf,
        byteLength,
        offset: this.updateStride()
      }));
    }

    updateStride() {
      var column, i, len, ref, stride;
      stride = 0;
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        column = ref[i];
        stride += column.byteLength.toPrimitive();
      }
      return this.stride.set(stride).toPrimitive();
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

    toWorkerCode() {
      var $offsetIn0, $offsetIn1, $offsetOut, $strideIn0, $strideIn1, $strideOut, operator;
      operator = "/";
      $strideIn0 = 12;
      $strideIn1 = 0;
      $strideOut = 4;
      $offsetIn0 = 22;
      $offsetIn1 = 10;
      $offsetOut = 0;
      return [";;operation", "", "let $isLittleEndian = 1;", "let $index = 0;", "let $count = 10000;", "", "let $arg0;", `let $offsetIn0 = ${$offsetIn0};`, `let $strideIn0 = ${$strideIn0};`, "let $tableOffsetIn0 = 24125;", "let $indexOffsetIn0 = $tableOffsetIn0 + $offsetIn0;", "", "let $arg1;", `let $offsetIn1 = ${$offsetIn1};`, `let $strideIn1 = ${$strideIn1};`, "let $tableOffsetIn0 = 2412;", "let $indexOffsetIn1 = $tableOffsetIn1 + $offsetIn1;", "", "let $result;", `let $offsetOut = ${$offsetOut};`, `let $strideOut = ${$strideOut};`, "let $tableOffsetOut = 2422154;", "let $indexOffsetOut = $tableOffsetOut + $offsetOut;", "", "$arg0 = view.getUint32( $indexOffsetIn0, $isLittleEndian ); ", "$arg1 = view.getUint32( $indexOffsetIn1, $isLittleEndian ); ", "", "while ( --$count )", "{", "   view.setUint32( ", "       $indexOffsetOut, ", `       ($arg0 ${operator} $arg1), `, "       $isLittleEndian", "   );", "", $strideIn0 && "   $arg0 = view.getUint32( $indexOffsetIn0, $isLittleEndian ); " || "", $strideIn1 && "   $arg1 = view.getUint32( $indexOffsetIn1, $isLittleEndian ); " || "", "", `   $indexOffsetOut += ${$strideOut};`, $strideIn0 && `   $indexOffsetIn0 += ${$strideIn0};` || "", $strideIn1 && `   $indexOffsetIn1 += ${$strideIn1};` || "", "}", "", ";;done", ""].join("\n\t");
    }

  };

  Operation.classPointer = OPTR.ClassPointer.from(Operation);

  return Operation;

}).call(this);

Database.defineProperty("buffer", {
  enumerable: true,
  getter: function() {
    return function() {
      return this.subarray();
    };
  }
});

Database.definePointer("bufferOffset", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint32Number
});

Database.definePointer("bufferLength", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint32Number
});

Table.definePointer("stride", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Table.definePointer("name", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

Column.definePointer("byteLength", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Column.definePointer("offset", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Column.definePointer("instanceOf", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.ObjectPointer
});

Column.definePointer("name", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

Operation.definePointer("begin", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Operation.definePointer("count", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Operation.definePointer("index", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Operation.definePointer("arg0", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("arg1", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("result", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("operator", {
  enumerable: true,
  isRequired: true,
  instanceOf: Operator
});

Operator.definePointer("type", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint8Number
});
