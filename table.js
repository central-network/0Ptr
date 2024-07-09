var error, log, table, warn;

import * as OPTR from "./0ptr.min.js";

({log, warn, error, table} = console);

export var Database = (function() {
  class Database extends OPTR.ObjectPointer {
    static create(name) {
      return Object.assign(this.new(), {name});
    }

    createTable(name, pages) {
      return this.appendChild(Object.assign(Table.new(), {
        pages,
        name,
        base: OPTR.Uint8ArrayPointer.from(pages * 654)
      }));
    }

    createOperation() {
      return Operation.from(...arguments);
    }

    parseColumns({columns = "*"}, tables = {}) {
      var alias, c, colName, columnName, columnNames, j, k, len, len1, matchs, ref, t, tAlias, tableAlias, tablesColumns;
      if (columns.match(/\*/)) {
        tablesColumns = [];
        for (tAlias in tables) {
          t = tables[tAlias];
          ref = t.children;
          for (j = 0, len = ref.length; j < len; j++) {
            c = ref[j];
            tablesColumns.push(`${tAlias}.${c.name.toPrimitive()}`);
          }
        }
        columns = columns.replace(/\*/g, tablesColumns.join(","));
      }
      columnNames = columns.split(/\,/);
      columnNames = columnNames.map(function(t) {
        return t.trim();
      });
      columnNames = columnNames.filter(function(c, i) {
        return columnNames.indexOf(c) === i;
      });
      columnNames = columnNames.filter(Boolean);
      columns = new Object;
      for (k = 0, len1 = columnNames.length; k < len1; k++) {
        columnName = columnNames[k];
        tableAlias = "";
        if (columnName.match(/\./)) {
          [tableAlias, colName] = columnName.split(/\./g).map(function(n) {
            return n.trim();
          }).filter(Boolean);
          if (!colName) {
            throw /TBL.COLNAME_COLMNFAILED/;
          }
          if (!tables[tableAlias]) {
            throw /TBL.COLNAME_TABLEFAILED/;
          }
          columnName = colName;
        }
        [colName, alias] = columnName.replace(/\s+|as/g, " ").split(/\s+/g);
        alias || (alias = colName);
        if (tableAlias) {
          columns[`${tableAlias}.${alias}`] = tables[tableAlias].children.find(function(c) {
            return c.name.eq(colName);
          });
          continue;
        }
        matchs = this.filter(function(t) {
          return t.find(function(c) {
            return c.name.eq(colName);
          });
        });
        switch (matchs.length) {
          case 1:
            tableAlias = matchs[0].name.toPrimitive();
            break;
          case 0:
            throw /TBLNOTFOUND_USEDCOLMNS/;
          default:
            retunr((function() {
              throw /COLMNMATCHS_MULTITABLE/;
            })());
        }
        table = tables[tableAlias] || matchs.at(0);
        if (!(columns[`${tableAlias}.${alias}`] = table.children.find(function(c) {
          return c.name.eq(colName);
        }))) {
          throw /TBLFORCOL_NOTFOUND/;
        }
      }
      return columns;
    }

    parseTables({tables = ""}) {
      var alias, dbName, j, len, tableName, tableNames;
      tableNames = tables.split(/\,/);
      tableNames = tableNames.map(function(t) {
        return t.trim();
      });
      tableNames = tableNames.filter(Boolean);
      if (!tableNames.length) {
        throw /FROMARG_REQUIRED/;
      }
      tables = new Object;
      for (j = 0, len = tableNames.length; j < len; j++) {
        tableName = tableNames[j];
        [dbName, alias] = tableName.replace(/\s+|as/g, " ").split(/\s+/g);
        if (!alias) {
          alias = dbName;
        }
        if (!(table = this.find(function(t) {
          return t.name.eq(dbName);
        }))) {
          throw /TBL_NOTFOUND/;
        }
        tables[alias] = table;
      }
      return tables;
    }

    parseRules({rules = []}, columns, tables) {
      var alias, any, closed, contents, end, ends, getAny, getColumn, getNumber, i, index, j, k, l, len, len1, len2, len3, len4, len5, m, next, o, opened, p0, p1, part, part0, part1, parts, partsAll, partsSliced, prev, q, ref, ref1, ref2, rule, ruleindex, ruleset, start, starts;
      ruleset = new Array;
      contents = new Array;
      getColumn = function(any) {
        var c, column;
        if (columns[any]) {
          return columns[any];
        }
        for (c in columns) {
          column = columns[c];
          if (column.name.eq(any)) {
            return column;
          }
        }
        for (c in columns) {
          column = columns[c];
          if (c.split(".").at(-1) === any) {
            return column;
          }
        }
        return void 0;
      };
      getNumber = function(any) {
        var number;
        if (isNaN(any)) {
          return;
        }
        number = Number(any);
        if (!Number.isInteger(number)) {
          return OPTR.Float32Number.from(number);
        }
        return OPTR.Int32Number.from(number);
      };
      getAny = function(any) {
        return Comparator.fromMatch(any) || Operator.fromMatch(any) || Mathematics.fromMatch(any) || getNumber(any) || getColumn(any);
      };
      for (ruleindex = j = 0, len = rules.length; j < len; ruleindex = ++j) {
        rule = rules[ruleindex];
        rule = `(${rule})`;
        parts = [];
        starts = [];
        ends = [];
        start = -1;
        end = rule.length + 1;
        opened = true;
        closed = true;
        while (opened || closed) {
          start = rule.indexOf("(", start + 1);
          end = rule.lastIndexOf(")", end - 1);
          opened = start !== -1;
          closed = end !== -1;
          if (opened) {
            starts.push(start);
          }
          if (closed) {
            ends.unshift(end);
          }
        }
        if (starts.length - ends.length) {
          throw [/RULEERR_PARANTHESIS/, rule, starts, ends];
        }
        ref = starts.reverse();
        for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
          start = ref[i];
          alias = "$part" + i;
          index = ends.findIndex(function(i) {
            return i > start;
          });
          end = ends.splice(index, 1).at(0);
          prev = rule.substring(0, start + 1);
          next = rule.substring(end);
          parts.push({
            start,
            end,
            alias,
            text: rule.substring(start + 1, end),
            prev,
            next
          });
        }
        partsSliced = parts.slice(0);
        partsAll = partsSliced.slice();
        for (p0 = l = 0, len2 = partsSliced.length; l < len2; p0 = ++l) {
          part0 = partsSliced[p0];
          ref1 = partsSliced.slice(p0);
          for (p1 = m = 0, len3 = ref1.length; m < len3; p1 = ++m) {
            part1 = ref1[p1];
            part1.subs || (part1.subs = []);
            if (part0.start > part1.start) {
              if (part0.end < part1.end) {
                part1.subs.push(part0);
                part0.parent = part1;
                break;
              }
            }
          }
        }
        parts = parts.at(-1).subs;
        for (i = o = 0, len4 = partsAll.length; o < len4; i = ++o) {
          part = partsAll[i];
          part.contents = [];
          ref2 = part.text.split(/\s+|\(|\)/g).filter(Boolean);
          for (q = 0, len5 = ref2.length; q < len5; q++) {
            any = ref2[q];
            part.contents.push(contents[contents.length] = {
              any: any,
              part: part,
              match: getAny(any)
            });
          }
        }
        ruleset.push({
          rule: rule.substring(1, rule.length - 1),
          parts,
          partsAll
        });
      }
      log(ruleset);
      log(columns);
      log(contents);
      return ruleset;
    }

    query(options = {}) {
      var column, columnAlias, columnName, columns, get, i, index, j, len, results, row, rows, rule, rules, tableAlias, tables, value;
      tables = this.parseTables(options);
      columns = this.parseColumns(options, tables);
      rules = this.parseRules(options, columns, tables);
      if (Object.keys(tables).length === 1) {
        for (columnAlias in columns) {
          column = columns[columnAlias];
          columns[columnAlias.split(".")[1]] = column;
          delete columns[columnAlias];
        }
      }
      results = [];
      index = 0;
      for (tableAlias in tables) {
        table = tables[tableAlias];
        rows = table.count;
        i = 0;
        while (i < rows) {
          get = table.get(i++);
          row = {};
          for (columnAlias in columns) {
            column = columns[columnAlias];
            columnName = column.name.toPrimitive();
            row[columnAlias] = get[columnName];
          }
          for (j = 0, len = rules.length; j < len; j++) {
            rule = rules[j];
            for (columnAlias in row) {
              value = row[columnAlias];
              //todo replace value with alias and filter
              1;
            }
          }
          results[index++] = row;
        }
      }
      return results;
    }

    parse(query = "") {
      var alsi, alss, cAlias, colPath, coln, colpart, compart, cpName, cparse, cpart, dbName, dbpart, domparts, i, iName, index, isInteger, isNegative, item, j, k, l, len, len1, len2, len3, len4, len5, m, match, num, nums, o, part, parts, prev, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, src, srcName, srcTable, srccol, srcpart, str, stri, strs, t, tAlias, tables, targets, tbl, tblName, tblpart, text, tn, typedNumber, value;
      nums = [];
      item = [];
      prev = 0;
      ref = query.matchAll(Database.regExp.numbersplit);
      for (part of ref) {
        index = part.index;
        if (!prev) {
          prev = index;
          continue;
        }
        text = query.substring(prev, index);
        if (!isNaN(text) && text.match(/\d/)) {
          value = text * 1;
          isInteger = Number.isInteger(value);
          isNegative = value < 0;
          typedNumber = (function() {
            if (!value) {
              return "NaN";
            } else if (!isInteger) {
              switch (10 < text.indexOf(".")) {
                case true:
                  return "Float64";
                case false:
                  return "Float32";
              }
            } else if (!isNegative) {
              switch (true) {
                case value <= 0xff:
                  return "Uint8";
                case value <= 0xffff:
                  return "Uint16";
                case value <= 0xffffffff:
                  return "Uint32";
                default:
                  return "BigUint64";
              }
            } else {
              switch (true) {
                case Math.abs(value) <= 0xff / 2 - 1:
                  return "Int8";
                case Math.abs(value) <= 0xffff / 2 - 1:
                  return "Int16";
                case Math.abs(value) <= 0xffffffff / 2 - 1:
                  return "Int32";
                default:
                  return "BigInt64";
              }
            }
          })();
          nums.push({
            start: prev,
            end: index,
            type: typedNumber,
            value
          });
        }
        prev = index + 1;
      }
      ref1 = nums.reverse();
      for (j = 0, len = ref1.length; j < len; j++) {
        num = ref1[j];
        query = [query.substring(0, num.start), "$", item.push(num) - 1, query.substring(num.end)].join("");
      }
      prev = 0;
      strs = [];
      stri = 0;
      ref2 = query.matchAll(Database.regExp.textpart);
      for (part of ref2) {
        index = part.index;
        stri = stri + 1;
        if (!prev) {
          prev = index + 1;
          continue;
        }
        if (!(stri % 2)) {
          text = query.substring(prev, index);
          strs.push({
            start: prev - 1,
            end: index + 1,
            value: text,
            type: "string"
          });
        }
        prev = index + 1;
      }
      ref3 = strs.reverse();
      for (k = 0, len1 = ref3.length; k < len1; k++) {
        str = ref3[k];
        query = [query.substring(0, str.start), "$", item.push(str) - 1, query.substring(str.end)].join("");
      }
      prev = 0;
      alss = [];
      alsi = 0;
      ref4 = query.matchAll(Database.regExp.aliasparser);
      for (part of ref4) {
        index = part.index;
        alsi = alsi + 1;
        if (!prev) {
          prev = index + 4;
          continue;
        }
        if (!(alsi % 2)) {
          text = query.substring(prev, index).split(/\s+|\,/).at(0);
          alss.push({
            start: prev,
            end: prev + text.length,
            value: text,
            type: "alias"
          });
        }
        prev = index + 4;
      }
      if (part.index) {
        text = query.substring(prev).split(/\s+|\,/).at(0);
        alss.push({
          start: prev,
          end: prev + text.length,
          value: text,
          type: "alias"
        });
      }
      ref5 = alss.reverse();
      for (l = 0, len2 = ref5.length; l < len2; l++) {
        str = ref5[l];
        if (-1 === (i = item.findIndex(function(a) {
          return (a.value === str.value) && a.type === "alias";
        }))) {
          i += item.push(str);
        }
      }
      parts = [];
      ref6 = query.matchAll(Database.regExp.partparser);
      for (match of ref6) {
        if (match[0].match(Database.regExp.partopener)) {
          parts.push({
            start: match.index
          });
        } else {
          part = parts.findLast(function(p) {
            return p.start && !p.end;
          });
          part.end = match.index;
          part.length = match.index - part.start;
        }
      }
      for (m = 0, len3 = parts.length; m < len3; m++) {
        part = parts[m];
        Object.defineProperties(part, {
          children: {
            value: []
          },
          parents: {
            value: []
          }
        });
      }
      parts.map(function(p0, i) {
        var c, p1;
        c = [];
        while ((p1 = parts[i++])) {
          if (p1.start > p0.start) {
            if (!(p1.end < p0.end)) {
              continue;
            }
            (c[c.length] = p1).parents.push(p0);
          }
        }
        if (c.length) {
          p0.children.push(...c);
        }
        return p0;
      }).map(function(p) {
        text = query.substring(p.start + 1, p.end);
        return Object.assign(p, {text});
      });
      item.push.apply(item, parts.sort(function(a, b) {
        if (a.length < b.length) {
          return -2;
        } else if (a.children.length < b.children.length) {
          return -1;
        } else {
          return 1;
        }
      }).filter(function(p) {
        return !p.children.length;
      }).map(function({text, start, end}) {
        return {
          type: "part",
          value: text,
          start,
          end
        };
      }));
      dbName = this.name.toPrimitive();
      targets = [];
      colpart = "";
      srcpart = "";
      compart = "";
      ref7 = query.matchAll(Database.regExp.querypart);
      for (part of ref7) {
        switch (part[0].trim()) {
          case "from":
            srcpart = query.substring(part.index + part[0].length);
            break;
          case "where":
            compart = query.substring(part.index + part[0].length);
            break;
          case "select":
            colpart = query.substring(part.index + part[0].length);
            break;
          default:
            throw /UNDEFINED_PARTERR/;
        }
      }
      tables = {};
      colpart = colpart.substring(0, colpart.lastIndexOf("from")).split(/\,/g).map(function(p) {
        return p.trim();
      });
      srcpart = srcpart.substring(0, srcpart.lastIndexOf("where")).split(/\,/g).map(function(p) {
        return p.trim();
      });
      for (o = 0, len4 = srcpart.length; o < len4; o++) {
        src = srcpart[o];
        [tblName, tAlias] = src.split(/\s+|as/gi).filter(Boolean);
        srcName = tAlias || tblName;
        srcTable = this.find(function(t) {
          return t.name.eq(tblName);
        });
        tables[srcName] = srcTable;
      }
      for (q = 0, len5 = colpart.length; q < len5; q++) {
        coln = colpart[q];
        if (!coln.startsWith("$")) {
          cparse = coln.trim().split(/\s+| as |\`/gi).filter(Boolean);
          cpName = cparse.at(0);
          colPath = cpName.split(this.constructor.regExp.perdefineds).filter(Boolean).at(0).split(this.constructor.regExp.partparser).filter(Boolean).at(0);
          domparts = colPath.split(".").reverse();
          [cpart, tblpart, dbpart] = [...domparts];
          if (cparse.length > 1) {
            cAlias = cparse.at(-1);
          } else {
            cAlias = cpart;
          }
          if (dbpart) {
            throw /DBPARTIN_COLDEF/;
            srccol = void 0;
          } else if (tblpart) {
            tbl = tables[tblpart] || this.find(function(t) {
              return t.name.eq(tblpart);
            });
            srccol = tbl.find(function(c) {
              return c.name.eq(cpart);
            });
          } else {
            for (tn in tables) {
              t = tables[tn];
              if (srccol = t.find(function(c) {
                return c.name.eq(cpart);
              })) {
                break;
              }
            }
          }
          targets.push({
            cAlias: cAlias,
            tAlias: tblpart || tbl.name.toPrimitive(),
            column: srccol
          });
        } else {
          cparse = coln.trim().split(/\s+| as |\`/gi).filter(Boolean);
          iName = cparse.at(0);
          if (cparse.length > 1) {
            cAlias = cparse.at(-1);
          } else {
            cAlias = iName;
          }
          targets.push({
            cAlias: cAlias,
            column: cparse[0],
            ref: item[cparse[0].substring(1)]
          });
        }
      }
      warn(targets);
      table(item);
      log("\n\n", query);
      log("\n\n", parts);
      return 1;
    }

  };

  Database.classPointer = OPTR.ClassPointer.from(Database);

  Database.prototype.regExp = /select | from | where | as | and | or |\.|\,|\'|\"|\(|\)|SUM\(|AVG\(|MAX\(|MIN\(|\+|\-|\/|\*|\%|\=|\>|\<|\!/gi;

  Database.regExp = {
    querybinder: /union /gi,
    querypart: /select | from | where | group by | order by | limit/gi,
    tablebinder: /left join|right join|join/gi,
    pathbinder: /\./gi,
    textpart: /\'|\"/g,
    pathpart: /\`/g,
    aliasparser: / as /gi,
    rulebinder: / or | and /gi,
    nameparser: /\,/,
    comparator: /\=|\!\=|\<|\>|\>\=|\<\=/g,
    mathbinder: /\+|\-|\/|\*|\%/g,
    perdefineds: /SUM\(|AVG\(|MAX\(|MIN\(/gi,
    partparser: /\(|\)|\[|\]|\{|\}/g,
    partopener: /\(|\[|\{/g,
    numbersplit: /\s+|\(|\)|\[|\]|\{|\}|\,/g
  };

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

    getProperty() {
      return this.instanceOf.getProperty(...arguments);
    }

  };

  Column.classPointer = OPTR.ClassPointer.from(Column);

  return Column;

}).call(this);

export var Row = class Row extends Object {};

export var Rule = class Rule extends OPTR.ObjectPointer {};

export var RuleSet = class RuleSet extends OPTR.ObjectPointer {};

export var Table = (function() {
  class Table extends OPTR.ObjectPointer {
    createColumn(name, instanceOf, byteLength) {
      return this.appendChild(Column.from({
        name,
        instanceOf,
        byteLength,
        offset: this.addStride(4)
      }));
    }

    addStride(byteLength = 0) {
      var offset;
      this.stride = byteLength + (offset = this.stride.toPrimitive());
      return offset;
    }

    getColumn(any) {
      if (!isNaN(any)) {
        return this.children[i];
      }
      return this.find(function(c) {
        return c.name.eq(any);
      });
    }

    get(index = 0) {
      var alias, basedv, byteLength, byteOffset, col, j, len, offset, ref, result;
      byteLength = this.stride.toPrimitive();
      byteOffset = byteLength * index;
      basedv = this.base.dataView(byteOffset, byteLength);
      Object.defineProperties(result = new Row, {
        index: {
          value: index
        },
        byteOffset: {
          value: byteOffset
        },
        byteLength: {
          value: byteLength
        }
      });
      ref = this.children;
      for (j = 0, len = ref.length; j < len; j++) {
        col = ref[j];
        alias = col.instanceOf.getProperty("alias");
        offset = col.offset.toPrimitive();
        result[col.name.toPrimitive()] = basedv.get(alias, offset);
      }
      return result;
    }

    subdataview(byteOffset = 0, byteLength) {
      byteLength || (byteLength = this.byteLength - byteOffset);
      return this.base.dataView(byteOffset, byteLength);
    }

    subbuffer(byteOffset = 0, byteLength) {
      byteLength || (byteLength = this.byteLength - byteOffset);
      return this.base.subarray(byteOffset, byteLength).slice().buffer;
    }

    subarray(byteOffset = 0, byteLength) {
      byteLength || (byteLength = this.byteLength - byteOffset);
      return this.base.subarray(byteOffset, byteLength);
    }

    insert(values = {}) {
      var alias, basedv, col, j, key, len, offset, ref, stride, value;
      stride = this.stride.toPrimitive();
      offset = this.offset.add(stride);
      basedv = this.base.dataView(offset, stride);
      ref = Object.keys(values);
      for (j = 0, len = ref.length; j < len; j++) {
        key = ref[j];
        col = this.getColumn(key);
        value = values[key];
        alias = col.instanceOf.getProperty("alias");
        basedv.set(alias, col.offset.toPrimitive(), value);
      }
      return offset / stride;
    }

  };

  Table.classPointer = OPTR.ClassPointer.from(Table);

  Object.defineProperty(Table.prototype, "byteLength", {
    get: function() {
      return this.pages.toPrimitive() * 654;
    }
  });

  Object.defineProperty(Table.prototype, "count", {
    get: function() {
      return this.offset.toPrimitive() / this.stride.toPrimitive();
    }
  });

  return Table;

}).call(this);

export var TypedAny = (function() {
  class TypedAny extends OPTR.ObjectPointer {
    static from(any) {
      var type;
      if (1 > (type = this.definitions.indexOf(any))) {
        throw /UNDEFINED_ANY/;
      }
      return Object.assign(this.new(), {type});
    }

    static fromMatch(any) {
      if (0 < this.definitions.indexOf(any.toUpperCase())) {
        return this.from(any);
      }
      return void 0;
    }

    toPrimitive() {
      return this.constructor.definitions[this.type];
    }

  };

  TypedAny.classPointer = OPTR.ClassPointer.from(TypedAny);

  TypedAny.definitions = [0/0];

  Object.defineProperty(TypedAny.prototype, "children", {
    enumerable: false,
    value: []
  });

  Object.defineProperty(TypedAny.prototype, "valueKey", {
    enumerable: true,
    get: function() {
      return this.toPrimitive();
    }
  });

  return TypedAny;

}).call(this);

export var Mathematics = (function() {
  class Mathematics extends TypedAny {};

  Mathematics.classPointer = OPTR.ClassPointer.from(Mathematics);

  Mathematics.definitions = [0/0, "SUM", "AVG", "MED", "MAX", "MIN", "POW"];

  return Mathematics;

}).call(this);

export var Comparator = (function() {
  class Comparator extends TypedAny {};

  Comparator.classPointer = OPTR.ClassPointer.from(Comparator);

  Comparator.definitions = [0/0, "<", ">", "=", ">=", "<=", "!=", "<>"];

  return Comparator;

}).call(this);

export var Operator = (function() {
  class Operator extends TypedAny {};

  Operator.classPointer = OPTR.ClassPointer.from(Operator);

  Operator.definitions = [0/0, "+", "-", "*", "/", "%"];

  return Operator;

}).call(this);

export var Operation = (function() {
  class Operation extends OPTR.ObjectPointer {
    static from(args = {}) {
      var begin, count, firstIndexIn0, firstIndexIn1, firstIndexOut, in0, in1, index, operation, operator, out, setByteOffsetIn0, setByteOffsetIn1, setByteOffsetOut, strideByteLengthIn0, strideByteLengthIn1, strideByteLengthOut;
      ({in0, in1, out, operator, begin = 0, count = 0, index = 0} = args);
      setByteOffsetIn0 = args.setByteOffsetIn0 || in0.offset.toPrimitive();
      firstIndexIn0 = args.firstIndexIn0 || 0;
      strideByteLengthIn0 = args.strideByteLengthIn0 || in0.parent.stride.toPrimitive();
      setByteOffsetIn1 = args.setByteOffsetIn1 || in1.offset.toPrimitive();
      firstIndexIn1 = args.firstIndexIn1 || 0;
      strideByteLengthIn1 = args.strideByteLengthIn1 || in1.parent.stride.toPrimitive();
      setByteOffsetOut = args.setByteOffsetOut || out.offset.toPrimitive();
      firstIndexOut = args.firstIndexOut || 0;
      strideByteLengthOut = args.strideByteLengthOut || out.parent.stride.toPrimitive();
      operation = new Object({
        begin,
        count,
        index,
        in0,
        setByteOffsetIn0,
        firstIndexIn0,
        strideByteLengthIn0,
        in1,
        setByteOffsetIn1,
        firstIndexIn1,
        strideByteLengthIn1,
        out,
        setByteOffsetOut,
        firstIndexOut,
        strideByteLengthOut,
        operator: Operator.from(operator)
      });
      return Object.assign(Operation.new(), operation);
    }

    getBuffer(col, first, stride) {
      var byteLength, byteOffset;
      byteOffset = first.toPrimitive() * stride.toPrimitive();
      byteLength = stride.toPrimitive() * this.count.toPrimitive();
      return col.target.parent.subbuffer(byteOffset, byteLength);
    }

    toWorker() {
      var bufIn0, bufIn1, worker;
      bufIn0 = this.getBuffer(this.in0, this.firstIndexIn0, this.strideByteLengthIn0);
      bufIn1 = this.getBuffer(this.in1, this.firstIndexIn1, this.strideByteLengthIn1);
      worker = new Worker(URL.createObjectURL(new Blob([this.toWorkerCode()], {
        type: "application/javascript"
      })));
      worker.onmessage = ({data}) => {
        var $lengthOut, $offsetOut, $strideOut, alias, count, getOffset, getter, iLE, reader, setOffset, setter, value, writer;
        if (!data) {
          throw /FAILED/;
        }
        iLE = DataView.prototype.isLittleEndian;
        count = this.count.toPrimitive();
        alias = this.out.getProperty("alias");
        $strideOut = this.strideByteLengthOut.toPrimitive();
        $offsetOut = this.setByteOffsetOut.toPrimitive();
        $lengthOut = $strideOut - $offsetOut;
        reader = new DataView(data);
        writer = this.out.target.parent.subdataview(this.firstIndexOut.toPrimitive(), $strideOut * count);
        getOffset = 0;
        setOffset = $offsetOut;
        getter = "get" + alias;
        setter = "set" + alias;
        while (count--) {
          value = reader[getter](getOffset, iLE);
          writer[setter](setOffset, value, iLE);
          getOffset += $lengthOut;
          setOffset += $strideOut;
        }
        log("done count:", this.count.toPrimitive());
        //todo release after dev: 
        return worker.terminate();
      };
      worker.postMessage({bufIn0, bufIn1}, [bufIn0, bufIn1]);
      return this;
    }

    toWorkerCode() {
      var $lengthOut, $offsetIn0, $offsetIn1, $offsetOut, $strideIn0, $strideIn1, $strideOut, alias, byteLength, count, iLE, operator;
      iLE = DataView.prototype.isLittleEndian;
      alias = this.out.getProperty("alias");
      count = this.count.toPrimitive();
      operator = this.operator.toString();
      $strideIn0 = this.strideByteLengthIn0.toPrimitive();
      $strideIn1 = this.strideByteLengthIn1.toPrimitive();
      $strideOut = this.strideByteLengthOut.toPrimitive();
      $offsetIn0 = this.setByteOffsetIn0.toPrimitive();
      $offsetIn1 = this.setByteOffsetIn1.toPrimitive();
      $offsetOut = this.setByteOffsetOut.toPrimitive();
      $lengthOut = $strideOut - $offsetOut;
      byteLength = $lengthOut * count;
      return ["", "self.addEventListener('message', function({data}){", "", "   let viewIn0 = new DataView( data.bufIn0 );", "   let viewIn1 = new DataView( data.bufIn1 );", "", `   let buffer = new ArrayBuffer( ${byteLength} );`, "   let writer = new DataView( buffer );", "", `   let count = ${count};`, "   let res = [];", "", "   let $in0;", `   let $offsetIn0 = ${$offsetIn0};`, `   let $strideIn0 = ${$strideIn0};`, "", "   let $in1;", `   let $offsetIn1 = ${$offsetIn1};`, `   let $strideIn1 = ${$strideIn1};`, "", "   let $offsetOut = 0;", "", `   $in0 = viewIn0.get${alias}( $offsetIn0, ${iLE} ); `, `   $in1 = viewIn1.get${alias}( $offsetIn1, ${iLE} ); `, "", "   while ( count-- )", "   {", `       writer.set${alias}( `, `           $offsetOut, ($in0 ${operator} $in1), ${iLE}`, "       );", "", `       res.push({ i: count, op: '${operator}', $in0, $in1, out:writer.get${alias}($offsetOut, ${iLE}) })`, "", $strideIn0 && `      $in0 = viewIn0.get${alias}( $offsetIn0, ${iLE} ); ` || "", $strideIn1 && `      $in1 = viewIn1.get${alias}( $offsetIn1, ${iLE} ); ` || "", "", `       $offsetOut += ${$lengthOut};`, $strideIn0 && `       $offsetIn0 += ${$strideIn0};` || "", $strideIn1 && `       $offsetIn1 += ${$strideIn1};` || "", "   }", "", "   //console.log(res.slice());", "   postMessage(buffer, [buffer]);", "});", "", ""].join("\n\t");
    }

  };

  Operation.classPointer = OPTR.ClassPointer.from(Operation);

  return Operation;

}).call(this);

Database.definePointer("name", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

Table.definePointer("base", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint8ArrayPointer
});

Table.definePointer("offset", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint32AtomicNumber
});

Table.definePointer("pages", {
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

Operation.definePointer("in0", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("firstIndexIn0", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("setByteOffsetIn0", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("strideByteLengthIn0", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("in1", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("firstIndexIn1", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("setByteOffsetIn1", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("strideByteLengthIn1", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("out", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Operation.definePointer("firstIndexOut", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("setByteOffsetOut", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("strideByteLengthOut", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

Operation.definePointer("operator", {
  enumerable: true,
  isRequired: true,
  instanceOf: Operator
});

TypedAny.definePointer("type", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint8Number
});
