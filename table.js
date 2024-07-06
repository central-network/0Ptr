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

Table.definePointer("name", {
  enumerable: true,
  instanceOf: OPTR.StringPointer
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

Column.definePointer("name", {
  enumerable: true,
  instanceOf: OPTR.StringPointer
});

Column.definePointer("instanceOf", {
  enumerable: true,
  instanceOf: OPTR.ClassPointer
});

Column.definePointer("byteLength", {
  enumerable: true,
  instanceOf: OPTR.Uint16Number
});

Column.definePointer("offset", {
  enumerable: true,
  instanceOf: OPTR.Uint16Number
});
