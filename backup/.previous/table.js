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
        base: OPTR.Uint8ArrayPointer.from(pages * 654, {
          uuid: OPTR.StringPointer.from(crypto.randomUUID())
        })
      }));
    }

    createOperation() {
      return Operation.from(...arguments);
    }

    getTables() {
      return this.filter(function(i) {
        return i instanceof Table;
      });
    }

    getSource(path) {
      var colName, dbName, split, tblName;
      split = path.split(".").reverse();
      switch (split.length) {
        case 3:
          [colName, tblName, dbName] = split;
          break;
        case 2:
          [colName, tblName] = split;
          break;
        case 1:
          [colName] = split;
      }
      return this.children[0];
    }

    getTable(path) {
      var tblName;
      tblName = path.replace(/\`/g, '').split(".").reverse().at(0);
      return this.getTables().find(function(ptri) {
        return ptri.name.eq(tblName);
      });
    }

    query(sql) {
      var query;
      return query = DBQuery.from({
        sql,
        database: this
      });
    }

    getSourceRefs() {
      var col, colName, dbName, k, l, len1, len2, ref, ref1, sources, tbl, tblName;
      sources = {};
      dbName = this.name.toPrimitive();
      ref = this.children;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        tbl = ref[k];
        tblName = tbl.name.toPrimitive();
        ref1 = tbl.children;
        for (l = 0, len2 = ref1.length; l < len2; l++) {
          col = ref1[l];
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

    parseQuery(query) {
      var alias, dbQuery, end, endMatch, k, key, label, len1, match, out, outend, outs, outstart, part, part0, qparts, ref, ref1, ref2, ref3, ref4, ref5, ref6, src, start;
      dbQuery = DBQuery.new();
      dbQuery.database = this;
      warn(query);
      qparts = {
        $part0: part0 = {
          start: 0
        }
      };
      query = this.maskQuotes(query, qparts);
      query = this.repartQuery(query, qparts);
      part0.text = query;
      part0.label = "$part0";
      for (key in qparts) {
        part = qparts[key];
        delete part.end;
      }
      for (key in qparts) {
        part = qparts[key];
        if (part.label.startsWith("$part")) {
          if (match = part.text.match(/limit/i)) {
            label = `$limit${(Object.keys(qparts).length)}`;
            qparts[label] = {
              start: part.start + match.index + match[0].length + 1,
              text: part.text.substring(match.index + match[0].length + 1),
              label: label
            };
            part.text = part.text.substring(0, match.index) + label;
          }
        }
      }
      for (key in qparts) {
        part = qparts[key];
        if (part.label.startsWith("$part")) {
          if (match = part.text.match(/order\sby/i)) {
            label = `$orderby${(Object.keys(qparts).length)}`;
            end = part.text.length;
            ref = part.text.matchAll(/\$limit/gi);
            for (endMatch of ref) {
              if (match.index < endMatch.index) {
                end = Math.min(end, endMatch.index - 1);
              }
            }
            qparts[label] = {
              start: part.start + match.index + match[0].length + 1,
              text: part.text.substring(match.index + match[0].length + 1, end),
              label: label
            };
            part.text = part.text.substring(0, match.index) + label + part.text.substring(end);
          }
        }
      }
      for (key in qparts) {
        part = qparts[key];
        if (part.label.startsWith("$part")) {
          if (match = part.text.match(/group\sby/i)) {
            label = `$groupby${(Object.keys(qparts).length)}`;
            end = part.text.length;
            ref1 = part.text.matchAll(/\$order|\$limit/gi);
            for (endMatch of ref1) {
              if (match.index < endMatch.index) {
                end = Math.min(end, endMatch.index - 1);
              }
            }
            qparts[label] = {
              start: part.start + match.index + match[0].length + 1,
              text: part.text.substring(match.index + match[0].length + 1, end),
              label: label
            };
            part.text = part.text.substring(0, match.index) + label + part.text.substring(end);
          }
        }
      }
      for (key in qparts) {
        part = qparts[key];
        if (part.label.startsWith("$part")) {
          if (match = part.text.match(/where/i)) {
            label = `$where${(Object.keys(qparts).length)}`;
            end = part.text.length;
            ref2 = part.text.matchAll(/\$group|\$order|\$limit/gi);
            for (endMatch of ref2) {
              if (match.index < endMatch.index) {
                end = Math.min(end, endMatch.index - 1);
              }
            }
            qparts[label] = {
              start: part.start + match.index + match[0].length + 1,
              text: part.text.substring(match.index + match[0].length + 1, end),
              label: label
            };
            part.text = part.text.substring(0, match.index) + label + part.text.substring(end);
          }
        }
      }
      for (key in qparts) {
        part = qparts[key];
        if (part.label.startsWith("$part")) {
          if (match = part.text.match(/from/i)) {
            label = `$from${(Object.keys(qparts).length)}`;
            end = part.text.length;
            ref3 = part.text.matchAll(/\$where|\$group|\$order|\$limit/gi);
            for (endMatch of ref3) {
              if (match.index < endMatch.index) {
                end = Math.min(end, endMatch.index - 1);
              }
            }
            qparts[label] = {
              start: part.start + match.index + match[0].length + 1,
              text: part.text.substring(match.index + match[0].length + 1, end),
              label: label
            };
            part.text = part.text.substring(0, match.index) + label + part.text.substring(end);
          }
        }
      }
      for (key in qparts) {
        part = qparts[key];
        if (part.label.startsWith("$part")) {
          if (match = part.text.match(/select|delete|insert\sinto/i)) {
            label = `$${match[0].split(' ').at(0)}${(Object.keys(qparts).length)}`.toLowerCase();
            end = part.text.length;
            ref4 = part.text.matchAll(/\$from|\$where|\$group|\$order|\$limit/gi);
            for (endMatch of ref4) {
              if (match.index < endMatch.index) {
                end = Math.min(end, endMatch.index - 1);
              }
            }
            qparts[label] = {
              start: part.start + match.index + match[0].length + 1,
              text: part.text.substring(match.index + match[0].length + 1, end),
              label: label
            };
            part.text = part.text.substring(0, match.index) + label + part.text.substring(end);
          }
        }
      }
      for (key in qparts) {
        part = qparts[key];
        if (!(part.label.startsWith("$select"))) {
          continue;
        }
        start = -1;
        outs = [];
        end = 0;
        part.text = part.text + ",";
        ref5 = part.text.matchAll(/\,/g);
        for (out of ref5) {
          outstart = start + 1;
          outend = out.index;
          [src, alias] = part.text.substring(outstart, outend).trim().split(/\sas\s/i);
          outs.push(out = {
            start: outstart,
            end: outend,
            src,
            alias,
            label: `$out${(Object.keys(qparts).length)}`
          });
          qparts[out.label] = out;
          start = outend;
        }
        ref6 = outs.reverse();
        for (k = 0, len1 = ref6.length; k < len1; k++) {
          out = ref6[k];
          part.text = part.text.substring(0, out.start) + out.label + part.text.substring(out.end);
          out.start += part.start;
        }
        part.text = part.text.substring(0, part.text.length - 1);
      }
      for (key in qparts) {
        part = qparts[key];
        delete part.end;
      }
      log(qparts);
      log("");
      return log("");
    }

    parseSelect(query, dbQuery) {
      var char, end, f, index, k, len1, match, part, parts, ref, ref1, s, sQuery, section, sections, start, text;
      if (!({index} = query.match(/select\ /i) || {})) {
        return;
      }
      parts = [];
      ref = query.matchAll(/\(|\)/g);
      for (part of ref) {
        [char] = ({
          index: start
        } = part);
        if (char === "(") {
          parts.push({char, start});
          continue;
        }
        parts.filter(function(p) {
          return p.char === "(";
        }).findLast(function(p) {
          return !p.end;
        }).end = start;
      }
      start = index + "select\s".length;
      end = query.length;
      for (k = 0, len1 = parts.length; k < len1; k++) {
        part = parts[k];
        if (!(part.start < start)) {
          continue;
        }
        end = part.end;
        break;
      }
      section = "columns";
      sections = {
        columns: {start, end}
      };
      ref1 = query.matchAll(/\sfrom\s|\swhere\s|\sgroup\sby\s|\sorder\sby\s|\slimit\s/gi);
      for (match of ref1) {
        if (match.index < start) {
          continue;
        }
        if (match.index > end) {
          continue;
        }
        if (parts.find(function(p) {
          return (match.index < p.end) && (start < p.start) && (match.index > p.start);
        })) {
          continue;
        }
        sections[section].end = match.index;
        sections[section = match[0].trim()] = {
          start: match.index + match[0].length,
          end: end
        };
      }
      sQuery = DBSelectQuery.from(query);
      sQuery.target = dbQuery;
      for (section in sections) {
        sections[section].text = query.substring(sections[section].start, sections[section].end);
      }
      f = 0;
      for (s in sections) {
        ({text} = sections[s]);
        switch (s.toUpperCase()) {
          case "COLUMNS":
            sQuery.appendChild(DBQueryColumnsPart.from(text));
            break;
          case "FROM":
            sQuery.appendChild(f = DBQueryFromPart.from(text));
            break;
          case "WHERE":
            sQuery.appendChild(DBQueryWherePart.from(text));
            break;
          case "GROUP BY":
            sQuery.appendChild(DBQueryGroupByPart.from(text));
            break;
          case "ORDER BY":
            sQuery.appendChild(DBQueryOrderByPart.from(text));
            break;
          case "LIMIT":
            sQuery.appendChild(DBQueryLimitPart.from(text));
        }
      }
      if (f) {
        log(f);
      }
      parts = sections = null;
      return 1;
    }

    repartQuery(query, qparts) {
      var char, code, fnMatch, part, parts, prevStart, prevWord, ref, start;
      parts = [];
      ref = query.matchAll(/\(|\)/g);
      for (part of ref) {
        [char] = ({
          index: start
        } = part);
        if (char === "(") {
          parts.push({
            char,
            start,
            i: Object.keys(qparts).length
          });
          continue;
        }
        parts.filter(function(p) {
          return p.char === "(";
        }).findLast(function(p) {
          return !p.end;
        }).end = start;
      }
      if (!parts.length) {
        return query;
      }
      part = parts.at(-1);
      part.text = query.substring(part.start + 1, part.end).trim();
      part.label = `$part${part.i}`;
      delete part.char;
      prevWord = "";
      prevStart = part.start;
      while (32 - (code = query.charCodeAt(--prevStart))) {
        prevWord = String.fromCharCode(code) + prevWord;
      }
      prevWord = prevWord.trim();
      if (fnMatch = prevWord.match(/SUM|AVG|MAX|MIN|LEFT|USING/i)) {
        part.start -= fnMatch[0].length;
        part.func = fnMatch[0];
        part.label = "$func" + part.i;
      }
      qparts[part.label] = part;
      query = query.substring(0, part.start) + part.label + query.substring(part.end + 1);
      delete part.i;
      return this.repartQuery(query, qparts);
    }

    maskQuotes(query, qparts) {
      var closerQuote, domainQuote, doubleQuote, label, openerQuote, singleQuote, text;
      openerQuote = 0;
      closerQuote = query.length;
      ({
        index: doubleQuote
      } = query.match(/\"/) || {});
      ({
        index: singleQuote
      } = query.match(/\'/) || {});
      ({
        index: domainQuote
      } = query.match(/\`/) || {});
      label = "$string" + Object.keys(qparts).length;
      if (domainQuote) {
        openerQuote = domainQuote;
        closerQuote = 1 + query.indexOf("`", openerQuote + 1);
        label = "$domain" + Object.keys(qparts).length;
      } else if (singleQuote && doubleQuote) {
        if (singleQuote < doubleQuote) {
          openerQuote = singleQuote;
          closerQuote = 1 + query.indexOf("'", openerQuote + 1);
        } else {
          openerQuote = doubleQuote;
          closerQuote = 1 + query.indexOf('"', openerQuote + 1);
        }
      } else if (singleQuote) {
        openerQuote = singleQuote;
        closerQuote = 1 + query.indexOf("'", openerQuote + 1);
      } else if (doubleQuote) {
        openerQuote = doubleQuote;
        closerQuote = 1 + query.indexOf('"', openerQuote + 1);
      } else {
        return query.replace(/\s+/g, " ");
      }
      qparts[label] = {
        start: openerQuote + 1,
        end: closerQuote - 1,
        label: label,
        text: text = query.substring(openerQuote + 1, closerQuote - 1)
      };
      return this.maskQuotes(query.substring(0, openerQuote) + label.padEnd(closerQuote - openerQuote, " ") + query.substring(closerQuote), qparts);
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

export var DBQuery2 = (function() {
  class DBQuery2 extends OPTR.ObjectPointer {
    static from(options = {sql, database}) {
      return Object.assign(this.new(), options).parse();
    }

    replaceQuotes() {
      var char, end, index, k, len1, match, quotes, rawquery, ref, ref1, start;
      rawquery = this.sql.toPrimitive();
      quotes = [];
      ref = rawquery.matchAll(/\'|\"/g);
      for (match of ref) {
        ({
          index: start
        } = [char] = match);
        ({
          length: index
        } = quotes);
        quotes[index] = {char, start};
        if (index % 2) {
          quotes[index - 1].end = start + 1;
        }
      }
      ref1 = quotes.reverse().filter(function(q) {
        return q.end;
      });
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        ({start, end} = ref1[k]);
        ({
          length: index
        } = this.children);
        this.appendChild(OPTR.StringPointer.from(rawquery.substring(start + 1, end - 1)));
        rawquery = rawquery.substring(0, start) + `$str${index}` + rawquery.substring(end);
      }
      quotes.length = 0;
      this.parsedql = OPTR.StringPointer.from(rawquery);
      return this;
    }

    getLinkedSource(link) {
      var k, len1, ptri, ref, uuid;
      uuid = link.uuid.toString();
      ref = this.children.filter(function(i) {
        return i instanceof DBSourceRef;
      });
      for (k = 0, len1 = ref.length; k < len1; k++) {
        ptri = ref[k];
        if (!(link = ptri.link.target)) {
          continue;
        }
        if (uuid !== link.uuid.toString()) {
          continue;
        }
        return ptri;
      }
      return null;
    }

    getSourceTables() {
      return this.filter(function(ptri) {
        return ptri instanceof DBSourceTable;
      });
    }

    getSourceColumns() {
      return this.getSourceTables().flatMap(function(ptri) {
        return ptri.target.children;
      });
    }

    getQueryArguments() {
      return this.filter(function(ptri) {
        return ptri instanceof DBQueryArgument;
      });
    }

    findQueryArguments(rawquery) {
      var arg, argPart, argTextPart, c, char, colEnd, colMatch, colName, colPart, colStart, dbName, domainopened, func, i, inputrawquery, k, l, label, len, len1, len2, len3, len4, m, match, maxLength, nextChar, nextEnd, nextFrom, nextStart, nextWord, o, part, partStart, partopened, parts, pos, posChar, prevEnd, prevQueryText, prevStart, prevWord, ptri, queryDBName, queryPart, quoteopened, ref, ref1, ref2, ref3, ref4, ref5, ref6, restQueryText, s, select, srcTables, tblName, text, textLength, textopened, value;
      rawquery || (rawquery = this.parsedql.toString());
      queryDBName = this.database.name;
      inputrawquery = `${rawquery}`;
      ref = rawquery.matchAll(/\ as\ /gi);
      for (match of ref) {
        prevQueryText = rawquery.substring(0, match.index);
        restQueryText = rawquery.substring(match.index + match[0].length);
        if (!(restQueryText.match(/from/i) && prevQueryText.match(/select/i))) {
          continue;
        }
        prevWord = "";
        partopened = 0;
        quoteopened = 0;
        domainopened = 0;
        textopened = 0;
        pos = match.index;
        while (pos-- > 0) {
          posChar = rawquery.charAt(pos);
          prevWord = posChar + prevWord;
          if (posChar === "`") {
            domainopened = !domainopened;
            continue;
          }
          if (posChar === "'") {
            quoteopened = !quoteopened;
            continue;
          }
          if (posChar === '"') {
            textopened = !textopened;
            continue;
          }
          if (posChar === "(") {
            partopened++;
            continue;
          }
          if (posChar === ")") {
            partopened--;
            continue;
          }
          if (" " === posChar || posChar === ",") {
            if (textopened) {
              continue;
            }
            if (domainopened) {
              continue;
            }
            if (quoteopened) {
              continue;
            }
            if (partopened) {
              continue;
            }
            prevWord = prevWord.substring(1);
            break;
          }
        }
        prevStart = pos + 1;
        prevEnd = prevStart + prevWord.length;
        nextWord = "";
        partopened = 0;
        quoteopened = 0;
        domainopened = 0;
        textopened = 0;
        pos = match.index + match[0].length - 1;
        len = match.input.length;
        while (++pos < len) {
          posChar = rawquery.charAt(pos);
          nextWord = nextWord + posChar;
          if (posChar === "`") {
            domainopened = !domainopened;
            continue;
          }
          if (posChar === "'") {
            quoteopened = !quoteopened;
            continue;
          }
          if (posChar === '"') {
            textopened = !textopened;
            continue;
          }
          if (posChar === "(") {
            partopened++;
            continue;
          }
          if (posChar === ")") {
            partopened--;
            continue;
          }
          if (" " === posChar || posChar === ",") {
            if (textopened) {
              continue;
            }
            if (domainopened) {
              continue;
            }
            if (quoteopened) {
              continue;
            }
            if (partopened) {
              continue;
            }
            nextWord = nextWord.substring(0, nextWord.length - 1);
            break;
          }
          nextEnd = pos + 1;
          nextStart = nextEnd - nextWord.length;
        }
        value = null;
        label = nextWord;
        if ("'" === prevWord[0] || prevWord[0] === '"') {
          value = OPTR.StringPointer.from(rawquery.substring(prevStart + 1, prevEnd - 1));
        } else if ("`" === prevWord[0]) {
          [colName, tblName, dbName = queryDBName] = rawquery.substring(prevStart + 1, prevEnd - 1).split(".").reverse();
          value = this.findSourceTable(tblName, dbName).findColumn(colName);
        } else if (!isNaN(prevWord)) {
          value = OPTR.NumberPointer.from(prevWord);
        } else if (func = DBQuery.isPredefinedFunction(prevWord)) {
          value = DBPredefinedOperation.from(prevWord);
        } else {
          [colName, tblName, dbName = queryDBName] = rawquery.substring(prevStart, prevEnd).split(".").reverse();
          table = tblName ? this.findSourceTable(tblName, dbName) : this.getSourceTables().find(function(t) {
            return t.find(function(c) {
              return c.name.eq(alias);
            });
          });
          value = table.findColumn(colName);
        }
        if (!value) {
          throw /ARGREF_NOTFOUND/;
        }
        this.appendChild(ptri = DBQueryArgument.from(label)).target = value;
        ptri.appendChild(DBQueryPart.from({
          text: inputrawquery.substring(prevStart, nextEnd),
          start: prevStart
        }));
        inputrawquery = inputrawquery.substring(0, prevStart) + "".padStart(nextEnd - prevStart, " ") + inputrawquery.substring(nextEnd);
      }
      ref1 = inputrawquery.matchAll(/select\s/gi);
      for (select of ref1) {
        if (!(nextFrom = inputrawquery.match(/from/i))) {
          continue;
        }
        queryPart = inputrawquery.substring(select.index, nextFrom.index).substring(select.at(0).length);
        partStart = select.index + select.at(0).length;
        maxLength = nextFrom.index;
        prevEnd = 0;
        ref2 = queryPart.matchAll(/\,/g);
        for (colMatch of ref2) {
          colStart = partStart + prevEnd + colMatch.index + colMatch[0].length;
          while (" " === inputrawquery.charAt(colStart)) {
            ++colStart;
          }
          colEnd = colStart;
          colPart = "";
          while (colEnd < maxLength) {
            char = inputrawquery.charAt(colEnd++);
            if (" " === char || char === ",") {
              break;
            }
            colPart = colPart + char;
          }
          colEnd--;
          if (!colPart) {
            continue;
          }
          [colName, tblName, dbName = queryDBName] = colPart.split(".").reverse();
          table = tblName ? this.findSourceTable(tblName, dbName) : this.getSourceTables().find(function(t) {
            return t.find(function(c) {
              return c.name.eq(alias);
            });
          });
          if (!(value = table.findColumn(colName))) {
            throw /ARGREF_NOTFOUND/;
          }
          if (!(ptri = this.getQueryArguments().find(function(ptri) {
            return ptri.toPrimitive() === colName;
          }))) {
            this.appendChild(ptri = DBQueryArgument.from(colName)).target = value;
          }
          ptri.appendChild(DBQueryPart.from({
            text: inputrawquery.substring(colStart, colEnd),
            start: colStart
          }));
          inputrawquery = inputrawquery.substring(0, colStart) + "".padStart(colEnd - colStart, " ") + inputrawquery.substring(colEnd);
        }
      }
      srcTables = this.getSourceTables();
      ref3 = this.getQueryArguments();
      for (k = 0, len1 = ref3.length; k < len1; k++) {
        arg = ref3[k];
        ref4 = arg.children;
        for (l = 0, len2 = ref4.length; l < len2; l++) {
          argPart = ref4[l];
          if (!(text = argPart.text.toPrimitive())) {
            continue;
          }
          if (!`${text}`.includes("(")) {
            continue;
          }
          if (text === arg.toPrimitive()) {
            continue;
          }
          parts = [];
          prevEnd = 0;
          textLength = text.length;
          ref5 = text.matchAll(/[^a-z|A-Z|0-9|\.|\_]/gi);
          for (argTextPart of ref5) {
            part = text.substring(prevEnd, argTextPart.index);
            prevEnd = argTextPart.index + argTextPart.length;
            if (!part.trim()) {
              continue;
            }
            if (part.trim().toUpperCase() === "AS") {
              continue;
            }
            nextChar = "";
            i = prevEnd - 1;
            while (i < textLength) {
              if (nextChar = text.charAt(i++).trim()) {
                break;
              }
            }
            if (nextChar === "(") {
              continue;
            }
            [colName, tblName, dbName = queryDBName] = part.split(".").reverse();
            value = null;
            if (!tblName) {
              for (m = 0, len3 = srcTables.length; m < len3; m++) {
                s = srcTables[m];
                ref6 = s.target.children;
                for (o = 0, len4 = ref6.length; o < len4; o++) {
                  c = ref6[o];
                  if (c.name.eq(colName)) {
                    value = c;
                    break;
                  }
                }
              }
            } else {
              value = this.findSourceTable(tblName, dbName).findColumn(colName);
            }
            if (!value) {
              throw /ARGREF_NOTFOUND/;
            }
            if (!(ptri = this.getQueryArguments().find(function(ptri) {
              return ptri.toPrimitive() === colName;
            }))) {
              this.appendChild(ptri = DBQueryArgument.from(colName)).target = value;
            }
            ptri.appendChild(DBQueryPart.from({
              text: part,
              start: argTextPart.index + argPart.start.toPrimitive()
            }));
          }
        }
      }
      return this.parsedql.set(inputrawquery);
    }

    static isPredefinedFunction(word) {
      var func, funcCount, operators, startWord;
      if (startWord = `${word}`.split("(").at(0).toUpperCase().trim()) {
        operators = "SUM|AVG|MIN|MAX|LEFT".split("|");
        funcCount = operators.length;
        while (func = operators[--funcCount]) {
          if (startWord === func) {
            return func;
          }
        }
      }
      return false;
    }

    findSourceTable(alias, dbName = this.database.name) {
      return this.filter(function(ptri) {
        return ptri instanceof DBSourceTable;
      }).filter(function(ptri) {
        return ptri.database.name.eq(dbName.toString());
      }).find(function(ptri) {
        return ptri.toString() === alias.toString();
      });
    }

    findSourceTables(rawquery) {
      var alias, char, dbName, dbTable, dbTableMatch, dbTables, inputrawquery, k, len1, nextPos, ref, refered, tblName;
      dbName = this.database.name.toString();
      dbTables = this.database.getTables();
      rawquery || (rawquery = this.parsedql.toString());
      inputrawquery = `${rawquery}`;
      for (k = 0, len1 = dbTables.length; k < len1; k++) {
        dbTable = dbTables[k];
        tblName = dbTable.name.toString();
        refered = false;
        ref = rawquery.matchAll(tblName);
        for (dbTableMatch of ref) {
          nextPos = dbTableMatch.index + dbTableMatch[0].length;
          alias = rawquery.substring(nextPos).trim().split(/\s+/g, 2).at(0);
          char = alias.charAt(0);
          if (!refered && (refered = true)) {
            this.appendChild(DBSourceTable.from(tblName)).target = dbTable;
          }
          if (alias.toUpperCase() === "WHERE") {
            continue;
          }
          if ("." === char || char === ",") {
            continue;
          }
          if (alias.endsWith(",")) {
            alias = alias.substring(0, alias.length - 1);
          }
          if (!(alias = alias.trim())) {
            continue;
          }
          this.appendChild(DBSourceTable.from(alias)).target = dbTable;
          break;
        }
        continue;
      }
      return this;
    }

    replaceSources(links, rawquery) {
      rawquery || (rawquery = this.parsedql.toString());
      this.findSourceTables();
      this.findQueryArguments();
      return this;
    }

    resolveQueryParts(query) {
      var char, k, l, len1, len2, length, p0, p1, parts, pointerify, pos, ptri, repart;
      length = `${query}`.length;
      pos = 0;
      parts = [];
      while (pos < length) {
        switch (char = query.charAt(pos)) {
          case "(":
            parts.push({
              start: pos + 1
            });
            break;
          case ")":
            parts.findLast(function(p) {
              return !p.end;
            }).end = pos;
        }
        pos++;
      }
      parts = parts.map(function(part, i) {
        var end;
        return {
          start: part.start,
          end: end = part.end || length - 1,
          text: query.substring(part.start, end),
          parts: []
        };
      });
      for (k = 0, len1 = parts.length; k < len1; k++) {
        p0 = parts[k];
        for (l = 0, len2 = parts.length; l < len2; l++) {
          p1 = parts[l];
          if (!(p0.start > p1.start)) {
            continue;
          }
          if (!(p0.end < p1.end)) {
            continue;
          }
          p1.parts.push(p0);
        }
      }
      repart = function(arr) {
        var a, i, j, len3, len4, len5, m, o, pslice, r, rslice;
        pslice = structuredClone(arr);
        rslice = structuredClone(arr);
        for (i = m = 0, len3 = pslice.length; m < len3; i = ++m) {
          p0 = pslice[i];
          for (j = o = 0, len4 = rslice.length; o < len4; j = ++o) {
            p1 = rslice[j];
            if (i === j) {
              continue;
            }
            if (!p1) {
              continue;
            }
            if (!p1.parts.find(function(p) {
              return p.text === p0.text;
            })) {
              continue;
            }
            arr[i] = null;
          }
        }
        arr = arr.filter(Boolean);
        for (r = 0, len5 = arr.length; r < len5; r++) {
          a = arr[r];
          a.parts = repart(a.parts);
        }
        return arr;
      };
      pointerify = function(arr, up) {
        var len3, m, part, ptri;
        for (m = 0, len3 = arr.length; m < len3; m++) {
          part = arr[m];
          ptri = DBQueryPart.from({
            text: part.text,
            start: part.start,
            length: part.text.length
          });
          pointerify(part.parts, up.appendChild(ptri));
        }
        return 0;
      };
      ptri = DBQueryPart.from({
        text: query,
        start: 0,
        length
      });
      pointerify(repart(parts), ptri);
      return this.appendChild(ptri);
    }

    resolvePartPointers(ptri) {
      var bText, childs, i, k, l, lastEnd, len1, len2, length, ptrj, start, text;
      text = ptri.text.toString();
      start = ptri.start.toNumber();
      length = ptri.length.toNumber();
      bText = [];
      lastEnd = start + length;
      childs = ptri.children.map(function(ptrj) {
        ptrj.pstart = ptrj.start.toNumber() - start;
        ptrj.plength = ptrj.length.toNumber();
        ptrj.pend = ptrj.pstart + ptrj.plength;
        return ptrj;
      });
      for (i = k = 0, len1 = childs.length; k < len1; i = ++k) {
        ptrj = childs[i];
        this.resolvePartPointers(ptrj);
      }
      for (i = l = 0, len2 = childs.length; l < len2; i = ++l) {
        ptrj = childs[i];
        bText.push(text.substring(ptrj.pend, lastEnd));
        bText.push(ptrj.label = `$${Number(ptrj)}`);
        lastEnd = ptrj.pstart;
      }
      bText.push(text.substring(0, lastEnd));
      return ptri.text = bText.reverse().join("");
    }

    resolveStrings(ptri) {
      var bText, closer, i, k, l, lastEnd, len1, len2, len3, m, match, ptrj, quote, quotes, ref, ref1, text;
      ref = ptri.children.filter(function(p) {
        return p instanceof DBQueryPart;
      });
      for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
        ptrj = ref[i];
        this.resolveStrings(ptrj);
      }
      text = ptri.text.toString();
      quotes = [];
      ref1 = text.matchAll(/\"|\'/g);
      for (match of ref1) {
        quotes.push({
          start: match.index,
          char: match[0]
        });
      }
      if (!quotes.length) {
        return;
      }
      for (i = l = 0, len2 = quotes.length; l < len2; i = ++l) {
        quote = quotes[i];
        if (!(!quote.opener)) {
          continue;
        }
        closer = quotes.filter(function(q1) {
          return q1.char === quote.char;
        }).filter(function(q1) {
          return q1.start > quote.start;
        }).filter(function(q1) {
          return q1.opener === void 0;
        }).at(0);
        closer.opener = quote;
        quote.end = closer.start + 1;
      }
      quotes = quotes.filter(function(q) {
        return q.end;
      }).map(function(q) {
        q.text = text.substring(q.start + 1, q.end - 1);
        return q;
      }).reverse();
      lastEnd = text.length;
      bText = [];
      for (m = 0, len3 = quotes.length; m < len3; m++) {
        quote = quotes[m];
        ptrj = DBQueryArgument.from(quote.text);
        ptrj.target = OPTR.StringPointer.from(quote.text);
        this.appendChild(ptrj);
        bText.push(text.substring(quote.end, lastEnd));
        bText.push(`$${Number(ptrj)}`);
        lastEnd = quote.start;
      }
      bText.push(text.substring(0, lastEnd));
      return ptri.text = bText.reverse().join("");
    }

    resolveNumbers(ptri) {
      var bText, char, i, isNumber, k, l, lastEnd, len1, len2, nums, numt, ptrj, ref, ref1, start, text, tlen, tnum;
      ref = ptri.children.filter(function(p) {
        return p instanceof DBQueryPart;
      });
      for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
        ptrj = ref[i];
        this.resolveNumbers(ptrj);
      }
      text = ptri.text.toString();
      numt = "";
      tlen = text.length;
      nums = [];
      while (char = text.charAt(--tlen)) {
        if (char === " ") {
          nums.push([numt, tlen + 1]);
          numt = "";
          continue;
        }
        if (char === "$") {
          numt = "";
          continue;
        }
        if (!isNaN(char.trim())) {
          numt = char + numt;
          continue;
        }
        isNumber = numt.trim().length && !isNaN(numt * 1);
        if (char === ".") {
          if (isNumber) {
            numt = char + numt;
            continue;
          } else {
            numt = "";
            continue;
          }
        }
        if (char === "-") {
          if (isNumber) {
            numt = char + numt;
            nums.push([numt, tlen]);
            numt = "";
            continue;
          } else {
            numt = "";
            continue;
          }
        }
        if (char.match(/[a-z]|[^\d]/ui)) {
          numt = "";
          continue;
        }
        nums.push([numt, tlen]);
        numt = "";
        continue;
      }
      lastEnd = text.length;
      bText = [];
      ref1 = nums.filter(function(n) {
        return n[0].trim();
      });
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        [tnum, start] = ref1[l];
        ptrj = DBQueryArgument.from(tnum);
        ptrj.target = OPTR.NumberPointer.from(tnum);
        this.appendChild(ptrj);
        bText.push(text.substring(start + tnum.length, lastEnd));
        bText.push(`$${Number(ptrj)}`);
        lastEnd = start;
      }
      bText.push(text.substring(0, lastEnd));
      return ptri.text = bText.reverse().join("");
    }

    resolveSources() {
      var alias, arg0, arg1, argi, bText, comma, couple, db, dbName, fpart, jnti, k, l, lastEnd, len1, len2, length, match, nextWord, nextc, path, pos, ptrj, qpart, qpstart, query, ref, ref1, ref2, replaces, start, tables, target, tblName, tblPath, tbli, testJoint, text, tref, trimQpart, where, words;
      query = this.parsedql.toString();
      tables = this.database.getTables();
      dbName = this.database.name.toString();
      pos = 0;
      text = query.toString();
      length = text.length;
      words = [];
      ref = text.matchAll(/\ from\ /gi);
      for (match of ref) {
        start = match.index + match[0].length;
        qpart = text.substring(start);
        while (!qpart.charAt(0).trim()) {
          qpart = qpart.substring(1);
          start = start + 1;
        }
        if (where = qpart.match(/\ where /i)) {
          qpart = qpart.substring(0, where.index);
        }
        //? first word must be a path
        tblPath = qpart.split(/\s+/, 1).at(0);
        tblName = tblPath.replace(/\`/g, '').split('.').pop();
        if (!(tbli = this.database.getTable(tblPath))) {
          throw /TABLENOTFOUND/;
        }
        words.push({
          text: tblPath,
          start: start
        });
        start += tblPath.length;
        this.appendChild(ptrj = DBSourceTable.from(tblName)).target = tbli;
        argi = DBQueryArgument.from(tblName);
        argi.target = ptrj;
        this.appendChild(argi);
        
        //* is next as an table combining function
        qpart = qpart.substring(tblPath.length);
        trimQpart = () => {
          var results;
          results = [];
          while (!qpart.charAt(0).trim()) {
            qpart = qpart.substring(1);
            results.push(start = start + 1);
          }
          return results;
        };
        testJoint = () => {
          var index, jnti, joint, jointTest;
          jnti = false;
          trimQpart();
          if (jointTest = SourceJoint.test(qpart)) {
            [joint] = ({index} = jointTest);
          }
          if (joint && !index) {
            jnti = SourceJoint.from(joint);
            jnti.source = ptrj;
            argi.target = jnti;
            jnti.appendChild(ptrj);
            this.appendChild(jnti);
          }
          if (!jnti) {
            return;
          }
          qpart = qpart.substring(joint.length);
          start = start + joint.length;
          trimQpart();
          return jnti;
        };
        nextWord = () => {
          var word;
          trimQpart();
          if (qpart.charAt(0) === ",") {
            return;
          }
          word = qpart.split(/\s+/g, 1).at(0);
          if (word.match(/where|group|order|limit/i)) {
            return;
          }
          if (word.match(/using|on/i)) {
            return;
          }
          return word;
        };
        if (!(jnti = testJoint())) {
          warn("no joint");
          if (alias = nextWord()) {
            argi = DBQueryArgument.from(alias);
            argi.target = ptrj;
            this.appendChild(argi);
            qpart = qpart.substring(alias.length);
            start = start + alias.length;
            jnti = testJoint();
          }
        }
        if (tblPath = nextWord()) {
          tblName = tblPath.replace(/\`/g, '').split('.').pop();
          if (!(tbli = this.database.getTable(tblPath))) {
            throw /TABLENOTFOUND/;
          }
          this.appendChild(ptrj = DBSourceTable.from(tblName)).target = tbli;
          argi = DBQueryArgument.from(tblName);
          this.appendChild(argi);
          if (jnti) {
            jnti.appendChild(ptrj);
            jnti.contact = ptrj;
            argi.target = jnti;
          }
          //* is next as an table combining function
          qpart = qpart.substring(tblPath.length);
          start = start + tblPath.length;
        }
        if (alias = nextWord()) {
          argi = DBQueryArgument.from(alias);
          argi.target = ptrj;
          this.appendChild(argi);
          qpart = qpart.substring(alias.length);
          start = start + alias.length;
        }
        if (jnti) { //todo has and source and contact
          1; //todo we expecting USING or ON 
        } else {
          1; //todo which defines joint rules
        }
        warn(qpart.startsWith("USING OR ON")); //!!!!
        warn(jnti);
        
        //while [,TABLE[ALIAS][JOINT[  TABLE[ALIAS][JOINT[...recursiving]]]  ]]]]  
        warn(this);
        return "1";
        qpstart = start;
        lastEnd = 0;
        ref1 = `,${qpart}`.matchAll(/\,/g);
        for (comma of ref1) {
          start = comma.index;
          fpart = qpart.substring(start);
          if (nextc = fpart.match(/\,/)) {
            fpart = fpart.substring(0, nextc.index);
          }
          while (!fpart.charAt(0).trim()) {
            fpart = fpart.substring(1);
            start = start + 1;
          }
          fpart = fpart.trim();
          start = qpstart + start;
          words.push({
            text: fpart,
            start: start
          });
        }
      }
      replaces = [];
      ref2 = words.reverse();
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        ({text, start} = ref2[k]);
        couple = text.split(/\s+/);
        if (couple.length > 2) {
          continue;
        }
        [path, alias] = couple;
        [tblName, db = dbName] = path.split(".").reverse();
        if (!(table = this.database.getTable(path))) {
          throw /TABLENOTFOUND/;
        }
        this.appendChild(ptrj = DBSourceTable.from(tblName)).target = table;
        replaces.push([text, start, ptrj, tblName, alias]);
      }
      lastEnd = query.length;
      bText = [];
      for (l = 0, len2 = replaces.length; l < len2; l++) {
        [tref, start, target, arg0, arg1] = replaces[l];
        ptrj = DBQueryArgument.from(arg0);
        ptrj.target = target;
        this.appendChild(ptrj);
        if (arg1) {
          ptrj = DBQueryArgument.from(arg1);
          ptrj.target = target;
          this.appendChild(ptrj);
        }
        bText.push(query.substring(start + tref.length, lastEnd));
        bText.push(`$${Number(ptrj)}`);
        lastEnd = start;
      }
      bText.push(query.substring(0, lastEnd));
      return bText.reverse().join("");
    }

    resolveCommands(ptri) {
      var child, childs, crExp, i, k, l, len1, len2, len3, m, match, matches, nextChar, ptrj, query, ref, ref1, ref2, ref3;
      ref = ptri.children.filter(function(p) {
        return p instanceof DBQueryPart;
      });
      for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
        ptrj = ref[i];
        ptrj.text = this.resolveCommands(ptrj);
      }
      if (!(query = ptri.text.toString())) {
        return "";
      }
      crExp = new RegExp(["inner join", "cross join", "left join", "right join", "using", "on", "select", "union", "create", "show", "insert", "update", "replace", "sum", "avg", "min", "max", "left", "right", "from", "where", "group by", "order by", "limit"].join("|"), "gi");
      matches = [];
      ref1 = query.matchAll(crExp);
      for (match of ref1) {
        nextChar = query.charAt(match.index + match[0].length).trim();
        if (nextChar && nextChar.match(/[a-z|0-9]/i)) {
          continue;
        }
        matches.push({
          text: match[0],
          start: match.index
        });
      }
      childs = [];
      ref2 = matches.reverse();
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        match = ref2[l];
        childs.push(ptri = DBQueryCommand.from(match.text.toUpperCase()));
        query = query.substring(0, match.start) + `$${Number(ptri)}` + query.substring(match.start + match.text.length);
      }
      ref3 = childs.reverse();
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        child = ref3[m];
        this.appendChild(child);
      }
      childs = false;
      matches = null;
      return query;
    }

    parse() {
      var part, rawparts, rawquery;
      rawquery = this.sql.toPrimitive();
      rawparts = new Array;
      this.parsedql = `${rawquery}`;
      
      //@replaceQuotes()
      //log [ @parsedql.toString() ]
      part = this.resolveQueryParts(`${rawquery}`);
      this.resolvePartPointers(part);
      this.resolveStrings(part);
      this.resolveNumbers(part);
      this.parsedql = this.resolveCommands(part);
      
      //@replaceSources()
      warn(this);
      warn(this.parsedql.toString());
      return this;
    }

  };

  DBQuery2.classPointer = OPTR.ClassPointer.from(DBQuery2);

  Object.defineProperty(DBQuery2.prototype, "parts", {
    enumerable: true,
    get: function() {
      return Object.fromEntries(this.children.map(function(ptri) {
        return [ptri.type.toPrimitive(), ptri];
      }));
    }
  });

  Object.defineProperty(DBQuery2.prototype, "arguments", {
    enumerable: true,
    get: function() {
      return this.filter(function(ptri) {
        return ptri instanceof DBQueryArgument;
      });
    }
  });

  return DBQuery2;

}).call(this);

export var DBSourceRef = (function() {
  class DBSourceRef extends OPTR.ObjectPointer {
    static from(options = {text, type, start, end}) {
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

  DBSourceRef.classPointer = OPTR.ClassPointer.from(DBSourceRef);

  return DBSourceRef;

}).call(this);

export var DBQuerySource = class DBQuerySource extends OPTR.PointerLink {};

export var DBQuery = (function() {
  class DBQuery extends OPTR.ObjectPointer {};

  DBQuery.classPointer = OPTR.ClassPointer.from(DBQuery);

  return DBQuery;

}).call(this);

export var DBSelectQuery = class DBSelectQuery extends OPTR.LinkedStringPointer {
  getRef($ref) {
    return this.target.children.reverse()[$ref.substring(1)];
  }

  getTable(path) {
    return this.target.database.getTable(path);
  }

};

export var DBQueryColumnsPart = class DBQueryColumnsPart extends OPTR.StringPointer {};

export var DBQueryFromPart = (function() {
  class DBQueryFromPart extends OPTR.LinkedStringPointer {};

  Object.defineProperty(DBQueryFromPart.prototype, "parent", {
    enumerable: true,
    get: function() {
      return this.getParent();
    }
  });

  Object.defineProperty(DBQueryFromPart.prototype, "dataView", {
    enumerable: true,
    get: function() {
      var byteBuffer, byteLength, byteOffset, query, tableName, uInt8Array;
      query = this.toPrimitive();
      tableName = query.trim().split(" ", 1).at(0);
      if (tableName.startsWith("$")) {
        tableName = this.parent.getRef(tableName).toString();
      }
      table = this.parent.getTable(tableName);
      byteLength = 0;
      byteLength += table.byteLength;
      byteBuffer = new ArrayBuffer(byteLength);
      uInt8Array = new Uint8Array(byteBuffer);
      byteOffset = 0;
      uInt8Array.set(table.subarray(), byteOffset);
      return new DataView(byteBuffer);
    }
  });

  return DBQueryFromPart;

}).call(this);

export var DBQueryWherePart = class DBQueryWherePart extends OPTR.StringPointer {};

export var DBQueryGroupByPart = class DBQueryGroupByPart extends OPTR.StringPointer {};

export var DBQueryOrderByPart = class DBQueryOrderByPart extends OPTR.StringPointer {};

export var DBQueryLimitPart = class DBQueryLimitPart extends OPTR.StringPointer {};

export var DBSourceTable = (function() {
  class DBSourceTable extends OPTR.LinkedStringPointer {
    findColumn(colName) {
      return this.target.find(function(ptri) {
        return ptri.name.eq(colName);
      });
    }

  };

  Object.defineProperty(DBSourceTable.prototype, "database", {
    enumerable: true,
    get: function() {
      return this.target.parent;
    }
  });

  Object.defineProperty(DBSourceTable.prototype, "label", {
    enumerable: true,
    get: function() {
      return this.toPrimitive();
    }
  });

  Object.defineProperty(DBSourceTable.prototype, "parent", {
    enumerable: true,
    configurable: true,
    get: function() {
      return this.getParent();
    }
  });

  return DBSourceTable;

}).call(this);

export var DBQueryArgument = (function() {
  class DBQueryArgument extends OPTR.LinkedStringPointer {};

  Object.defineProperty(DBQueryArgument.prototype, "parent", {
    enumerable: true,
    configurable: true,
    get: function() {
      return this.getParent();
    }
  });

  return DBQueryArgument;

}).call(this);

export var DBPredefinedOperation = class DBPredefinedOperation extends OPTR.LinkedStringPointer {};

export var DBSourceColumn = (function() {
  class DBSourceColumn extends OPTR.LinkedStringPointer {};

  Object.defineProperty(DBSourceColumn.prototype, "table", {
    get: function() {
      return this.target.parent;
    }
  });

  Object.defineProperty(DBSourceColumn.prototype, "database", {
    get: function() {
      return this.table.parent;
    }
  });

  return DBSourceColumn;

}).call(this);

export var DBQueryCommand = class DBQueryCommand extends OPTR.LinkedStringPointer {};

export var DBSourceTableJoin = (function() {
  class DBSourceTableJoin extends OPTR.ObjectPointer {};

  DBSourceTableJoin.classPointer = OPTR.ClassPointer.from(DBSourceTableJoin);

  return DBSourceTableJoin;

}).call(this);

export var DBQueryPart = (function() {
  class DBQueryPart extends OPTR.ObjectPointer {
    static from(options = {text, type, start, end}) {
      var key, ptrc, ptri, val;
      ptri = this.new();
      ptrc = this.classPointer;
      for (key in options) {
        val = options[key];
        ptri[key] = ptrc.getProperty(key).from(val);
      }
      return ptri;
    }

    toPrimitive() {
      return this.text.toString();
    }

  };

  DBQueryPart.classPointer = OPTR.ClassPointer.from(DBQueryPart);

  return DBQueryPart;

}).call(this);

export var DBOperation = (function() {
  class DBOperation extends OPTR.ObjectPointer {
    static from(options = []) {
      var arg0, arg1, op, operator, ptri;
      [arg0, operator, arg1] = options;
      ptri = this.new();
      if (Array.isArray(op = arg0.operate)) {
        arg0 = DBOperation.from(op);
        ptri.appendChild(arg0);
      }
      if (Array.isArray(op = arg1.operate)) {
        arg1 = DBOperation.from(op);
        ptri.appendChild(arg1);
      }
      ptri.arg0 = arg0;
      ptri.arg1 = arg1;
      return ptri;
    }

  };

  DBOperation.classPointer = OPTR.ClassPointer.from(DBOperation);

  DBOperation.operators = ["!", "+", "-", "*", "/"];

  return DBOperation;

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
        offset: this.addStride(4),
        uuid: OPTR.StringPointer.from(crypto.randomUUID())
      }));
    }

    addStride(size = 0) {
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
      var alias, basedv, byteLength, byteOffset, col, k, len1, offset, ref, result;
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
      for (k = 0, len1 = ref.length; k < len1; k++) {
        col = ref[k];
        alias = col.instanceOf.getProperty("alias");
        offset = col.offset.toPrimitive();
        result[col.name.toPrimitive()] = basedv.get(alias, offset);
      }
      return result;
    }

    subdataview(offset = 0, byteLength) {
      byteLength || (size = this.byteLength - byteOffset);
      return this.base.dataView(byteOffset, byteLength);
    }

    subbuffer(offset = 0, byteLength) {
      byteLength || (size = this.byteLength - byteOffset);
      return this.base.subarray(byteOffset, byteLength).slice().buffer;
    }

    subarray(offset = 0, byteLength) {
      byteLength || (size = this.byteLength - byteOffset);
      return this.base.subarray(byteOffset, byteLength);
    }

    insert(values = {}) {
      var alias, basedv, col, k, key, len1, offset, ref, stride, value;
      stride = this.stride.toPrimitive();
      offset = this.offset.add(stride);
      basedv = this.base.dataView(offset, stride);
      ref = Object.keys(values);
      for (k = 0, len1 = ref.length; k < len1; k++) {
        key = ref[k];
        col = this.getColumn(key);
        value = values[key];
        alias = col.instanceOf.getProperty("alias");
        basedv.set(alias, col.offset.toPrimitive(), value);
      }
      return offset / stride;
    }

  };

  Table.classPointer = OPTR.ClassPointer.from(Table);

  Object.defineProperty(Table.prototype, "dataView", {
    get: function() {
      return this.subdataview();
    }
  });

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

    static test(toStringable) {
      return toStringable.toString().match(this.matchRegExp);
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

export var SourceJoint = (function() {
  class SourceJoint extends TypedAny {};

  SourceJoint.classPointer = OPTR.ClassPointer.from(SourceJoint);

  SourceJoint.matchRegExp = /left join|right join|inner join|cross join/i;

  SourceJoint.definitions = [0/0, "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "CROSS JOIN"];

  Object.defineProperty(SourceJoint.prototype, "children", {
    enumerable: true,
    get: OPTR.Pointer.prototype.filter
  });

  return SourceJoint;

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

TypedAny.definePointer("type", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Int32Number
});

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

DBQuery.definePointer("database", {
  enumerable: true,
  isRequired: true,
  instanceOf: Database
});

SourceJoint.definePointer("source", {
  enumerable: true,
  isRequired: true,
  instanceOf: DBSourceTable
});

SourceJoint.definePointer("contact", {
  enumerable: true,
  isRequired: true,
  instanceOf: DBSourceTable
});

DBQueryPart.definePointer("text", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

DBQueryPart.definePointer("start", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

DBQueryPart.definePointer("length", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint16Number
});

DBSourceRef.definePointer("link", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

DBSourceRef.definePointer("name", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

DBSourceRef.definePointer("replacedWith", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
});

DBOperation.definePointer("arg0", {
  byteLength: 4,
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

DBOperation.definePointer("arg1", {
  byteLength: 4,
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

DBOperation.definePointer("operator", {
  byteLength: 1,
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.PointerLink
});

Table.definePointer("base", {
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.Uint8ArrayPointer
});

Table.definePointer("uuid", {
  byteLength: 36,
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
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

Column.definePointer("uuid", {
  byteLength: 36,
  enumerable: true,
  isRequired: true,
  instanceOf: OPTR.StringPointer
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
