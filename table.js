var error, log, table, warn;

import * as OPTR from "./window.js";

export * from "./window.js";

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
      var alias, c, colName, columnName, columnNames, k, len, len1, m, matchs, ref1, t, tAlias, tableAlias, tablesColumns;
      if (columns.match(/\*/)) {
        tablesColumns = [];
        for (tAlias in tables) {
          t = tables[tAlias];
          ref1 = t.children;
          for (k = 0, len = ref1.length; k < len; k++) {
            c = ref1[k];
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
      for (m = 0, len1 = columnNames.length; m < len1; m++) {
        columnName = columnNames[m];
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
            throw /COLMNMATCHS_MULTITABLE/;
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
      var alias, dbName, k, len, tableName, tableNames;
      tableNames = tables.split(/\,/);
      tableNames = tableNames.map(function(t) {
        return t.trim();
      });
      tableNames = tableNames.filter(Boolean);
      if (!tableNames.length) {
        throw /FROMARG_REQUIRED/;
      }
      tables = new Object;
      for (k = 0, len = tableNames.length; k < len; k++) {
        tableName = tableNames[k];
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
      var alias, any, closed, contents, end, ends, getAny, getColumn, getNumber, i, index, k, len, len1, len2, len3, len4, len5, m, next, o, opened, p0, p1, part, part0, part1, parts, partsAll, partsSliced, prev, q, r, ref1, ref2, ref3, rule, ruleindex, ruleset, start, starts, u;
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
        return Comparision.fromMatch(any) || Operator.fromMatch(any) || Mathematics.fromMatch(any) || getNumber(any) || getColumn(any);
      };
      for (ruleindex = k = 0, len = rules.length; k < len; ruleindex = ++k) {
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
        ref1 = starts.reverse();
        for (i = m = 0, len1 = ref1.length; m < len1; i = ++m) {
          start = ref1[i];
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
        for (p0 = o = 0, len2 = partsSliced.length; o < len2; p0 = ++o) {
          part0 = partsSliced[p0];
          ref2 = partsSliced.slice(p0);
          for (p1 = q = 0, len3 = ref2.length; q < len3; p1 = ++q) {
            part1 = ref2[p1];
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
        for (i = r = 0, len4 = partsAll.length; r < len4; i = ++r) {
          part = partsAll[i];
          part.contents = [];
          ref3 = part.text.split(/\s+|\(|\)/g).filter(Boolean);
          for (u = 0, len5 = ref3.length; u < len5; u++) {
            any = ref3[u];
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

    query(sql) {
      var query;
      query = DBQuery.new();
      query.sql = sql;
      query.db = this;
      query.parse();
      return log(query);
    }

    getSourceRefs() {
      var col, colName, dbName, k, len, len1, m, ref1, ref2, sources, tbl, tblName;
      sources = {};
      dbName = this.name.toPrimitive();
      ref1 = this.children;
      for (k = 0, len = ref1.length; k < len; k++) {
        tbl = ref1[k];
        tblName = tbl.name.toPrimitive();
        ref2 = tbl.children;
        for (m = 0, len1 = ref2.length; m < len1; m++) {
          col = ref2[m];
          colName = col.name.toPrimitive();
          sources[`${dbName}.${tblName}.${colName}`] = sources[`${tblName}.${colName}`] = col;
          if (sources[colName]) {
            delete sources[colName];
          } else {
            sources[colName] = col;
          }
        }
        sources[`${dbName}.${tblName}`] = tbl;
        if (sources[tblName]) {
          delete sources[tblName];
        } else {
          sources[tblName] = tbl;
        }
      }
      return sources;
    }

  };

  Database.classPointer = OPTR.ClassPointer.from(Database);

  Database.prototype.regExp = /select | from | where | as | and | or |\.|\,|\'|\"|\(|\)|SUM\(|AVG\(|MAX\(|MIN\(|\+|\-|\/|\*|\%|\=|\>|\<|\!/gi;

  Database.regExp = {
    querybinder: /union /gi,
    queryType: /select | from | where | group by | order by | limit/gi,
    tablebinder: /left join|right join|join/gi,
    pathbinder: /\./gi,
    textpart: /\'|\"/g,
    pathpart: /\`/g,
    aliasparser: / as /gi,
    rulebinder: / or | and /gi,
    nameparser: /\,/,
    comparision: /\=|\!\=|\<|\>|\>\=|\<\=/g,
    mathbinder: /\+|\-|\/|\*|\%/g,
    comparser: /\+|\-|\/|\*|\%|\=|\!\=|\<\=|\>\=|\>|\<| and | or | is not | is | not /gi,
    perdefineds: /SUM\(|AVG\(|MAX\(|MIN\(/gi,
    partparser: /\(|\)|\[|\]|\{|\}/g,
    partopener: /\(|\[|\{/g,
    numbersplit: /\s+|\(|\)|\[|\]|\{|\}|\,/g
  };

  return Database;

}).call(this);

export var DBQuery = (function() {
  class DBQuery extends OPTR.ObjectPointer {
    parse() {
      var item, items, k, len, parseColumns, parseMatches, parseSources, partRawQuery, query, ref, repart, resolveParts, rquery, sources;
      items = new Array;
      query = this.sql.toPrimitive();
      sources = this.db.getSourceRefs();
      repart = function(parted) {
        var adopted, childs, closed, closer, closers, ctext, end, i, index, isAfter, isEarly, item, k, len, len1, len2, len3, len4, len5, length, m, match, o, opened, opener, openers, p0, p0text, p1, parent, part, parts, q, r, ref1, ref2, ref3, result, start, text, u;
        ctext = `(${parted.trim()})`;
        parts = [];
        ref1 = ctext.matchAll(/\(|\)|\[|\]|\{|\}|\`|\'|\"/g);
        for (part of ref1) {
          [match] = ({
            index: start
          } = part);
          ({
            length: index
          } = parts.filter(function(p) {
            return p.match === match;
          }));
          parts[parts.length] = {
            match,
            start,
            index,
            parents: new Array,
            children: new Array
          };
        }
        closers = [")", "]", "}"];
        openers = ["(", "[", "{", "'", "`", '"'];
        for (k = 0, len = parts.length; k < len; k++) {
          closed = parts[k];
          ({
            index,
            match: closer,
            start
          } = closed);
          (opener = openers[closers.indexOf(closer)]);
          if (!opener && !closers[openers.indexOf(closer)]) {
            opener = index % 2 ? closer : null;
          }
          opened = parts.filter(function(p) {
            return p.match === opener;
          }).filter(function(p) {
            return p.start < start;
          }).filter(function(p) {
            return p.end === void 0;
          }).at(-1);
          if (!opened) {
            continue;
          }
          opened.end = closed.start;
          opened.text = ctext.substring(opened.start, start + 1);
          opened.length = start - opened.start;
          opened.isString = opener === closer;
          delete opened.index;
        }
        ref2 = parts.filter(function(p) {
          return p.end;
        });
        for (m = 0, len1 = ref2.length; m < len1; m++) {
          p0 = ref2[m];
          for (o = 0, len2 = parts.length; o < len2; o++) {
            p1 = parts[o];
            if (!(p1 !== p0)) {
              continue;
            }
            isAfter = p1.start > p0.start;
            isEarly = p1.end < p0.end;
            if (isAfter * isEarly) {
              p0.children.push(p1);
              p1.parents.push(p0);
            }
          }
        }
        childs = parts.filter(function(p) {
          return p.parents.length;
        });
        childs.sort(function(a, b) {
          return a.text.length - b.text.length;
        });
        for (q = 0, len3 = childs.length; q < len3; q++) {
          adopted = childs[q];
          adopted.parents.sort(function(a, b) {
            return a.text.length - b.text.length;
          });
        }
        for (r = 0, len4 = childs.length; r < len4; r++) {
          p0 = childs[r];
          ref3 = p0.parents;
          for (u = 0, len5 = ref3.length; u < len5; u++) {
            parent = ref3[u];
            if (-1 === (i = items.findIndex(function(p1) {
              return p1.text === p0.text;
            }))) {
              ({start, end, length} = p0);
              item = {};
              if (p0.isString) {
                text = p0.text.substring(1, p0.text.length - 1);
                item.ref = OPTR.StringPointer.from(text);
                item.type = "text";
              }
              item.text = p0.text;
              item.type = item.type || "part";
              item.part = {start, end, length};
              i += items.push(item);
            }
            parent.text = parent.text.split(p0.text).join("$part" + i);
          }
        }
        p0text = parts[0].text;
        length = p0text.length - 2;
        result = p0text.substring(1, 1 + length);
        if (parts[0].children.length) {
          return repart(result);
        }
        return result;
      };
      partRawQuery = function() {
        var end, iname, index, input, item, item0, item1, itext, k, label, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, m, o, pquery, prev, q, qbinds, qpart, qparts, qregex, qtype, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, requery, rname, rtext, start, sub, subs, text, text0, text1, toref, type, u, v, value, w, x, y;
        rtext = repart(query);
        items.map(function(item, i) {
          return Object.assign(item, {
            text: item.text.substring(1, item.text.length - 1),
            name: `$part${i}`,
            item: new Object
          });
        });
        ref1 = items.filter(function(i) {
          return i.text.includes("$part");
        });
        for (k = 0, len = ref1.length; k < len; k++) {
          subs = ref1[k];
          ref2 = subs.text.split(/\s/g).filter(function(s) {
            return s.startsWith("$part");
          });
          for (m = 0, len1 = ref2.length; m < len1; m++) {
            sub = ref2[m];
            subs.item[sub] = items[sub.replace("$part", "")];
          }
        }
        requery = `${query}`;
        for (label in sources) {
          ref = sources[label];
          if (!requery.includes(label)) {
            continue;
          }
          if (items.find(function(i) {
            return i.ref === ref;
          })) {
            continue;
          }
          items.push({
            ref: ref,
            type: "ref",
            text: label,
            name: `$ref${items.length}`
          });
        }
        ref3 = items.filter(function(i) {
          return !i.ref;
        });
        for (o = 0, len2 = ref3.length; o < len2; o++) {
          item0 = ref3[o];
          ref4 = items.filter(function(i) {
            return i.ref;
          });
          for (q = 0, len3 = ref4.length; q < len3; q++) {
            item1 = ref4[q];
            text0 = item0.text;
            text1 = item1.text;
            if (!text0.includes(text1)) {
              continue;
            }
            if (text0 === text1) {
              item0.to = item1;
              continue;
            }
            item0.text = text0.split(text1).join(item1.name);
            item0.item[item1.name] = item1;
          }
        }
        ref5 = items.filter(function(i) {
          return i.to;
        });
        for (r = 0, len4 = ref5.length; r < len4; r++) {
          item0 = ref5[r];
          iname = item0.name;
          toref = item0.to;
          rname = toref.name;
          ref6 = items.filter(function(i) {
            return i.text.includes(iname);
          });
          for (u = 0, len5 = ref6.length; u < len5; u++) {
            item1 = ref6[u];
            item1.text = item1.text.split(iname).join(rname);
            item1.item[rname] = toref;
            delete item1.item[iname];
          }
          rtext = rtext.split(iname).join(rname);
        }
        items = items.filter(function(i) {
          return !i.to;
        });
        for (v = 0, len6 = items.length; v < len6; v++) {
          item = items[v];
          if (rtext.includes(itext = item.text)) {
            rtext = rtext.split(itext).join(item.name);
          }
        }
        pquery = ` ${rtext} `;
        qbinds = "select|from|where|order by|limit".split("|");
        qregex = new RegExp(` ${qbinds.join(" | ")} `, "gi");
        qparts = [];
        ref7 = pquery.matchAll(qregex);
        for (qpart of ref7) {
          [qtype] = qpart;
          ({
            index: start,
            input
          } = qpart);
          ({
            length: index
          } = qparts);
          text = input.substring(start);
          type = qtype.trim();
          end = start + text.length;
          qparts[index] = {type, text, start, end};
          if (prev = qparts[index - 1]) {
            prev.end = start;
            prev.text = qpart.input.substring(prev.start, start);
          }
        }
        for (w = 0, len7 = qparts.length; w < len7; w++) {
          qpart = qparts[w];
          ({type, text} = qpart);
          [start, end] = [0, 0];
          while (text.startsWith(" ")) {
            text = text.substring(1);
            ++start;
          }
          while (text.endsWith(" ")) {
            text = text.substring(0, text.length - 1);
            end--;
          }
          if (text.startsWith(type)) {
            text = text.substring(start += type.length);
          }
          qpart.text = text;
          qpart.start += start;
          qpart.end += end;
        }
        qparts.at(-0).start--;
        qparts.at(-1).end--;
        for (x = 0, len8 = qparts.length; x < len8; x++) {
          qpart = qparts[x];
          ({start, end, text, type} = qpart);
          index = items.length;
          iname = [
            "$",
            {
              from: "tables",
              where: "matches",
              select: "columns"
            }[type]
          ].join("");
          items[index] = {
            name: iname,
            text,
            type: "qpart",
            part: {start, end},
            item: {}
          };
          rtext = rtext.split(text).join(iname);
        }
        for (y = 0, len9 = items.length; y < len9; y++) {
          value = items[y];
          if (!Object.hasOwn(items, value.name)) {
            Object.defineProperty(items, value.name, {value});
          }
        }
        return rtext;
      };
      parseColumns = function() {
        var calias, cdef, coldefs, colref, coltext, cparse, i, iColumnsStart, index, j, k, l, len, len1, len2, len3, m, o, prev, q, ref, ref1, results, start, text, value;
        coldefs = [];
        coltext = `,${items.$columns.text},`;
        ref1 = coltext.matchAll(/\,/g);
        for (cdef of ref1) {
          start = cdef.index + 1;
          index = coldefs.length;
          coldefs[index] = {start};
          if (prev = coldefs[index - 1]) {
            prev.end = start - 1;
          }
        }
        coldefs.splice(-1);
        for (k = 0, len = coldefs.length; k < len; k++) {
          cdef = coldefs[k];
          text = coltext.substring(cdef.start, cdef.end);
          l = text.length;
          i = 0;
          j = l - 1;
          while (!text[i].replace(",", "").trim()) {
            i++;
          }
          while (!text[j].replace(",", "").trim()) {
            j--;
          }
          cdef.text = text.substring(i, j + 1);
        }
        iColumnsStart = items.$columns.part.start;
        for (m = 0, len1 = coldefs.length; m < len1; m++) {
          cdef = coldefs[m];
          cdef.start += iColumnsStart;
          cdef.end = cdef.start + cdef.text.length - 1;
        }
        for (o = 0, len2 = coldefs.length; o < len2; o++) {
          cdef = coldefs[o];
          cparse = cdef.text.split(new RegExp(" as ", "i"));
          colref = cparse.at(0);
          calias = cparse.at(-1);
          if (!(ref = items[colref])) {
            throw /REFNOTFOUND/;
          }
          if (colref !== calias) {
            items.push(ref = {
              ref: ref.ref,
              text: calias,
              type: "alias",
              name: `$ref${items.length}`
            });
            items.$columns.text = items.$columns.text.split(cdef.text).join(ref.name);
          }
          cdef.ref = items.$columns.item[ref.name] = ref;
        }
        items.$columns.subs = coldefs;
        results = [];
        for (q = 0, len3 = items.length; q < len3; q++) {
          value = items[q];
          if (!Object.hasOwn(items, value.name)) {
            results.push(Object.defineProperty(items, value.name, {value}));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      parseSources = function() {
        var i, index, j, k, l, len, len1, len2, len3, m, o, prev, q, ref, ref1, results, start, talias, tbldefs, tblref, tbltext, tdef, text, tparse, value;
        tbldefs = [];
        tbltext = `,${items.$tables.text},`;
        ref1 = tbltext.matchAll(/\,/g);
        for (tdef of ref1) {
          start = tdef.index + 1;
          index = tbldefs.length;
          tbldefs[index] = {start};
          if (prev = tbldefs[index - 1]) {
            prev.end = start - 1;
          }
        }
        tbldefs.splice(-1);
        for (k = 0, len = tbldefs.length; k < len; k++) {
          tdef = tbldefs[k];
          text = tbltext.substring(tdef.start, tdef.end);
          l = text.length;
          i = 0;
          j = l - 1;
          while (!text[i].replace(",", "").trim()) {
            i++;
          }
          while (!text[j].replace(",", "").trim()) {
            j--;
          }
          tdef.text = text.substring(i, j + 1);
        }
        for (m = 0, len1 = tbldefs.length; m < len1; m++) {
          tdef = tbldefs[m];
          tdef.start += items.$tables.part.start;
          tdef.end = tdef.start + tdef.text.length - 1;
        }
        for (o = 0, len2 = tbldefs.length; o < len2; o++) {
          tdef = tbldefs[o];
          tparse = tdef.text.split(new RegExp(" ", "i"));
          tblref = tparse.at(0);
          talias = tparse.at(-1);
          if (!(ref = items[tblref])) {
            throw /REFNOTFOUND/;
          }
          if (tblref !== talias) {
            items.push(ref = {
              ref: ref.ref,
              text: talias,
              type: "alias",
              name: `$ref${items.length}`
            });
            items.$tables.text = items.$tables.text.split(tdef.text).join(ref.name);
          }
          tdef.ref = items.$tables.item[ref.name] = ref;
        }
        items.$tables.subs = tbldefs;
        results = [];
        for (q = 0, len3 = items.length; q < len3; q++) {
          value = items[q];
          if (!Object.hasOwn(items, value.name)) {
            results.push(Object.defineProperty(items, value.name, {value}));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      parseMatches = function() {
        var bound, i, index, j, k, l, len, len1, len2, len3, len4, m, mamdefs, matref, mattext, mdef, o, prev, q, r, ref, ref1, ref2, results, start, t, text, value;
        mamdefs = [];
        mattext = ` and ${items.$matches.text} and `;
        ref1 = mattext.matchAll(new RegExp(" and | or ", "gi"));
        for (mdef of ref1) {
          start = mdef.index + mdef[0].length;
          index = mamdefs.length;
          bound = mdef[0].trim();
          mamdefs[index] = {start, bound};
          if (prev = mamdefs[index - 1]) {
            prev.end = mdef.index;
          }
        }
        mamdefs.splice(-1);
        delete mamdefs[0].bound;
        for (k = 0, len = mamdefs.length; k < len; k++) {
          mdef = mamdefs[k];
          text = mattext.substring(mdef.start, mdef.end);
          l = text.length;
          i = 0;
          j = l - 1;
          while (!text[i].trim()) {
            i++;
          }
          while (!text[j].trim()) {
            j--;
          }
          mdef.text = text.substring(i, j + 1);
        }
        for (m = 0, len1 = mamdefs.length; m < len1; m++) {
          mdef = mamdefs[m];
          mdef.start += items.$matches.part.start;
          mdef.end = mdef.start + mdef.text.length - 1;
        }
        for (i = o = 0, len2 = mamdefs.length; o < len2; i = ++o) {
          mdef = mamdefs[i];
          if (!(i > 0)) {
            continue;
          }
          mamdefs[i].required = true;
          mamdefs[i - 1].required = mdef.bound !== "or";
        }
        for (q = 0, len3 = mamdefs.length; q < len3; q++) {
          mdef = mamdefs[q];
          matref = mdef.text;
          if (!(ref = items[matref])) {
            throw /REFNOTFOUND/;
          }
          items.$matches.item[ref.name] = mdef.ref = ref;
          ref2 = ref.item;
          for (t in ref2) {
            i = ref2[t];
            if (i.type !== "part") {
              continue;
            }
            i.required = mdef.required;
          }
          ref.required = mdef.required;
          delete mdef.required;
        }
        items.$matches.subs = mamdefs;
        results = [];
        for (r = 0, len4 = items.length; r < len4; r++) {
          value = items[r];
          if (!Object.hasOwn(items, value.name)) {
            results.push(Object.defineProperty(items, value.name, {value}));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      resolveParts = function() {
        var arg, arg0, arg1, i, k, len, len1, m, nname, numi, op, part, ref, ref1, subs, text, val;
        for (k = 0, len = items.length; k < len; k++) {
          part = items[k];
          if (!(part.type === "part")) {
            continue;
          }
          text = part.text;
          subs = text.split(/\s+/g);
          arg0 = subs.at(+0);
          arg1 = subs.at(-1);
          op = part.text.substring(arg0.length, text.length - arg1.length).trim().replace(/is not|not|\<\>/gi, "!=").replace(/is/gi, "=").replace(/and/gi, "&&").replace(/or/gi, "||");
          ref1 = [arg0, arg1];
          for (i = m = 0, len1 = ref1.length; m < len1; i = ++m) {
            arg = ref1[i];
            if (arg.startsWith("$")) {
              if (!(ref = part.item[arg] = items[arg])) {
                throw /ARGNTFOUND/;
              }
            } else if (!isNaN(val = Number(arg))) {
              numi = items.length;
              nname = `$num${numi}`;
              ref = {
                ref: OPTR.NumberPointer.from(val),
                type: "number",
                name: nname
              };
              part.item[nname] = items[numi] = ref;
            }
            if (i === 0) {
              arg0 = ref;
            }
            if (i === 1) {
              arg1 = ref;
            }
          }
          part.text = [arg0.name, op, arg1.name].join(" ");
          part.operate = [arg0.ref || arg0, op, arg1.ref || arg1];
        }
        return 0;
      };
      rquery = partRawQuery();
      parseColumns();
      parseSources();
      parseMatches();
      resolveParts();
      this.set(items);
      this.parsedql.set(rquery);
      for (k = 0, len = items.length; k < len; k++) {
        item = items[k];
        if (ref = item.ref) {
          if (!ref.parent) {
            this.appendChild(ref);
          } else {
            this.appendChild(OPTR.PointerLink.from(ref));
          }
        }
      }
      table(items.slice(0));
      warn(query);
      return warn(rquery);
    }

  };

  DBQuery.classPointer = OPTR.ClassPointer.from(DBQuery);

  return DBQuery;

}).call(this);

export var DBQuerySource = (function() {
  class DBQuerySource extends OPTR.ObjectPointer {};

  DBQuerySource.classPointer = OPTR.ClassPointer.from(DBQuerySource);

  return DBQuerySource;

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
      var alias, basedv, byteLength, byteOffset, col, k, len, offset, ref1, result;
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
      ref1 = this.children;
      for (k = 0, len = ref1.length; k < len; k++) {
        col = ref1[k];
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
      var alias, basedv, col, k, key, len, offset, ref1, stride, value;
      stride = this.stride.toPrimitive();
      offset = this.offset.add(stride);
      basedv = this.base.dataView(offset, stride);
      ref1 = Object.keys(values);
      for (k = 0, len = ref1.length; k < len; k++) {
        key = ref1[k];
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
    static from(any, replaceWith = this.replaceWith) {
      var replace, rexp, rl, search, test, type, typeArray, typeCount;
      if (rl = replaceWith.length) {
        while (rl) {
          replace = replaceWith[--rl];
          search = replaceWith[--rl];
          any = any.replace(search, replace);
        }
      }
      if (!any.match(this.matchRegExp)) {
        throw /NONMATCHED_REXP/;
      }
      typeArray = this.definitions;
      typeCount = typeArray.length;
      while (type = --typeCount) {
        test = `\\${typeArray[type]}`;
        rexp = new RegExp(test, "gi");
        if (rexp.test(any)) {
          break;
        }
      }
      if (!type) {
        throw /TESTFAIL_ANY/;
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

  TypedAny.replaceWith = [];

  TypedAny.matchRegExp = /$/gui;

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

  Mathematics.matchRegExp = /\+\+|\-\-|\*\*|\/\/|\+|\-|\*|\//g;

  Mathematics.definitions = [0/0, "+", "-", "*", "/", "%", "++", "--", "**", "//"];

  return Mathematics;

}).call(this);

export var Comparision = (function() {
  class Comparision extends TypedAny {};

  Comparision.classPointer = OPTR.ClassPointer.from(Comparision);

  Comparision.matchRegExp = /\ is not |\ not |\ is |\>\=|\<\=|\=\=|\!\=|\>|\<|\=/gi;

  Comparision.replaceWith = [/is not/gi, "!=", /not/gi, "!=", /is/gi, "==", /\s/g, ""];

  Comparision.definitions = [0/0, ">=", "<=", "!=", "==", "<>", "<", ">", "=", "is not", "is", "not"];

  return Comparision;

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

DBQuery.definePointer("sql", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

DBQuery.definePointer("parsedql", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

DBQuery.definePointer("db", {
  enumerable: true,
  isRequired: true,
  instanceOf: Database
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
