import * as OPTR from "./window.js"
export * from "./window.js";

{ log, warn, error, table } = console

export class Database                   extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    regExp          : /select | from | where | as | and | or |\.|\,|\'|\"|\(|\)|SUM\(|AVG\(|MAX\(|MIN\(|\+|\-|\/|\*|\%|\=|\>|\<|\!/gi

    @regExp         :
        querybinder : /union /gi
        queryType   : /select | from | where | group by | order by | limit/gi
        tablebinder : /left join|right join|join/gi
        pathbinder  : /\./gi
        textpart    : /\'|\"/g
        pathpart    : /\`/g
        aliasparser : / as /gi
        rulebinder  : / or | and /gi
        nameparser  : /\,/
        comparision : /\=|\!\=|\<|\>|\>\=|\<\=/g
        mathbinder  : /\+|\-|\/|\*|\%/g
        comparser   : /\+|\-|\/|\*|\%|\=|\!\=|\<\=|\>\=|\>|\<| and | or | is not | is | not /gi
        perdefineds : /SUM\(|AVG\(|MAX\(|MIN\(/gi
        partparser  : /\(|\)|\[|\]|\{|\}/g
        partopener  : /\(|\[|\{/g
        numbersplit : /\s+|\(|\)|\[|\]|\{|\}|\,/g

    @create         : ( name ) ->
        Object.assign @new(), { name }

    createTable     : ( name, pages ) ->
        @appendChild Object.assign Table.new(), {
            pages, name,
            base : OPTR.Uint8ArrayPointer.from pages * 654
        }

    createOperation : -> Operation.from arguments...

    parseColumns    : ({ columns = "*" }, tables = {}) ->

        if  columns.match /\*/
            tablesColumns = []
            for tAlias, t of tables then for c in t.children
                tablesColumns.push "#{tAlias}.#{c.name.toPrimitive()}"
            columns = columns.replace /\*/g, tablesColumns.join ","
            
        columnNames = columns.split /\,/
        columnNames = columnNames.map (t) -> t.trim()
        columnNames = columnNames.filter (c, i) -> columnNames.indexOf(c) is i
        columnNames = columnNames.filter Boolean

        columns = new Object

        for columnName in columnNames

            tableAlias = ""

            if  columnName.match /\./

                [ tableAlias, colName ] =
                    columnName
                        .split /\./g
                        .map (n) -> n.trim()
                        .filter Boolean

                unless colName
                    throw /TBL.COLNAME_COLMNFAILED/

                unless tables[ tableAlias ]
                    throw /TBL.COLNAME_TABLEFAILED/

                columnName = colName
            
            [ colName, alias ] =
                columnName
                    .replace /\s+|as/g, " "
                    .split /\s+/g  

            alias ||= colName      

            if  tableAlias
                columns[ "#{tableAlias}.#{alias}" ] =
                    tables[ tableAlias ].children.find (c) -> c.name.eq colName
                continue
                
            matchs = @filter (t) -> t.find (c) -> c.name.eq colName

            switch matchs.length

                when 1 then tableAlias = matchs[0].name.toPrimitive()
                when 0 then throw /TBLNOTFOUND_USEDCOLMNS/
                else return throw /COLMNMATCHS_MULTITABLE/

            table = tables[ tableAlias ] || matchs.at(0)

            unless columns[ "#{tableAlias}.#{alias}" ] = table.children.find (c) -> c.name.eq colName
                throw /TBLFORCOL_NOTFOUND/

        columns

    parseTables     : ({ tables = "" }) ->
        tableNames = tables.split /\,/
        tableNames = tableNames.map (t) -> t.trim()
        tableNames = tableNames.filter Boolean
        
        unless tableNames.length 
            throw /FROMARG_REQUIRED/

        tables = new Object

        for tableName in tableNames

            [ dbName, alias ] =
                tableName
                    .replace /\s+|as/g, " "
                    .split /\s+/g  

            unless alias
                alias = dbName
            
            unless table = @find (t) -> t.name.eq dbName
                throw /TBL_NOTFOUND/

            tables[ alias ] = table

        tables

    parseRules      : ({ rules = [] }, columns, tables ) ->
        ruleset = new Array
        contents = new Array

        getColumn = ( any ) ->
            if  columns[ any ]
                return columns[ any ]

            for c, column of columns
                if column.name.eq any
                    return column

            for c, column of columns
                if c.split(".").at(-1) is any
                    return column

            return undefined

        getNumber   = ( any ) ->
            return if isNaN any
            number = Number any

            if !Number.isInteger number
                return OPTR.Float32Number.from number
            return OPTR.Int32Number.from number

        getAny      = ( any ) ->
            Comparision.fromMatch( any ) or
            Operator.fromMatch( any ) or 
            Mathematics.fromMatch( any ) or 
            getNumber( any ) or getColumn any

        for rule, ruleindex in rules
            rule = "(#{rule})"
            parts = []

            starts = []
            ends = []

            start = -1
            end = rule.length + 1

            opened = yes
            closed = yes

            while ( opened or closed )
                start = rule.indexOf("(", start + 1)
                end = rule.lastIndexOf(")", end - 1)

                opened = start isnt -1
                closed = end isnt -1

                if opened then starts.push start
                if closed then ends.unshift end

            if  starts.length - ends.length
                throw [ /RULEERR_PARANTHESIS/, rule, starts, ends ]

            for start, i in starts.reverse()
                alias = "$part" + i
                index = ends.findIndex (i) -> i > start
                end = ends.splice( index, 1 ).at( 0 )

                prev = rule.substring 0, start+1
                next = rule.substring end

                parts.push {
                    start, end, alias,
                    text: rule.substring start+1, end
                    prev, next
                }

            partsSliced = parts.slice(0)
            partsAll = partsSliced.slice()

            for part0, p0 in partsSliced
                for part1, p1 in partsSliced.slice p0
                    part1.subs ||= []
                    if part0.start > part1.start
                        if  part0.end < part1.end
                            part1.subs.push part0
                            part0.parent = part1
                            break

            parts = parts.at(-1).subs



            for part, i in partsAll
                part.contents = []
                for any in part.text.split(/\s+|\(|\)/g).filter(Boolean)
                    part.contents.push contents[contents.length] = {
                        any : any
                        part : part
                        match : getAny any
                    }



            ruleset.push {
                rule : rule.substring(1, rule.length-1),
                parts, partsAll
            }


        log ruleset
        log columns
        log contents
        ruleset

    query           : ( sql ) ->

        query = DBQuery.new()
        query.sql = sql
        query.db = this
        query.parse()

        log query


    getSourceRefs   : ->
        sources = {}
        dbName = @name.toPrimitive()

        for tbl in @children
            tblName = tbl.name.toPrimitive()
            
            for col in tbl.children
                colName = col.name.toPrimitive()

                sources[ "#{dbName}.#{tblName}.#{colName}" ] =
                sources[ "#{tblName}.#{colName}" ] = col

                if sources[ colName ]
                    delete sources[ colName ]
                else sources[ colName ] = col


            sources[ "#{dbName}.#{tblName}" ] = tbl

            if sources[ tblName ]
                delete sources[ tblName ]
            else sources[ tblName ] = tbl

        sources


export class DBQuery                    extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    parse           : ->
        items = new Array
        query = @sql.toPrimitive()
        sources = @db.getSourceRefs()

        repart = ( parted ) ->
            
            ctext = "(#{parted.trim()})"
            parts = []

            for part from ctext.matchAll /\(|\)|\[|\]|\{|\}|\`|\'|\"/g

                [ match ] =
                { index : start } = part
                { length : index } = parts.filter (p) -> p.match is match 

                parts[ parts.length ] = {
                    match, start, index,
                    parents: new Array
                    children: new Array
                }

            closers = [ ")", "]", "}" ]
            openers = [ "(", "[", "{", "'", "`", '"' ]

            for closed in parts

                { index , match: closer , start } = closed
                ( opener = openers[ closers.indexOf closer ])

                if !opener and !closers[ openers.indexOf closer ]
                    opener = if index % 2 then closer
                    else null

                opened = parts
                    .filter (p) -> p.match is opener
                    .filter (p) -> p.start < start
                    .filter (p) -> p.end is undefined
                    .at -1

                unless opened then continue

                opened.end = closed.start
                opened.text = ctext.substring opened.start, start+1
                opened.length = start - opened.start
                opened.isString = opener is closer

                delete opened.index

            for p0 in parts.filter (p) -> p.end
                for p1 in parts when p1 isnt p0
                    isAfter = p1.start > p0.start
                    isEarly = p1.end < p0.end

                    if  isAfter * isEarly
                        p0.children.push p1
                        p1.parents.push p0

            childs = parts.filter (p) -> p.parents.length
            childs . sort (a,b) -> a.text.length - b.text.length

            for adopted in childs
                adopted.parents.sort (a,b) -> a.text.length - b.text.length
            
            for p0 in childs then for parent in p0.parents
                
                if -1 is i = items.findIndex (p1) -> p1.text is p0.text
                    { start, end, length } = p0
                    item = {}

                    if  p0.isString 
                        text = p0.text.substring 1, p0.text.length-1
                        item.ref = OPTR.StringPointer.from text 
                        item.type = "text"
                    
                    item.text = p0.text
                    item.type = item.type || "part"
                    item.part = { start, end, length }

                    i += items.push item
                
                parent.text =
                    parent.text.split( p0.text ).join( "$part"+i )

            p0text = parts[0].text
            length = p0text.length - 2
            result = p0text.substring 1, 1 + length

            if  parts[0].children.length
                return repart result
            
            result

        partRawQuery = ->
            rtext = repart query
            items . map (item, i) -> Object.assign item,
                text : item.text.substring 1, item.text.length-1
                name : "$part#{i}"
                item : new Object

            for subs in items.filter (i) -> i.text.includes "$part"
                for sub in subs.text.split( /\s/g ).filter (s) -> s.startsWith "$part"
                    subs . item[ sub ] = items[ sub.replace "$part", "" ]

            requery = "#{query}"

            for label , ref of sources
                continue if !requery.includes label
                continue if  items.find (i) -> i.ref is ref

                items.push {
                    ref : ref, 
                    type : "ref",
                    text : label
                    name : "$ref#{items.length}"
                } 

            for item0 in items.filter (i) -> !i.ref
                for item1 in items.filter (i) -> i.ref

                    text0 = item0.text
                    text1 = item1.text

                    if !text0.includes text1
                        continue

                    if  text0 is text1
                        item0.to = item1
                        continue

                    item0.text = text0.split( text1 ).join item1.name
                    item0.item[ item1.name ] = item1  

            for item0 in items.filter (i) -> i.to
                iname = item0.name
                toref = item0.to
                rname = toref.name

                for item1 in items.filter (i) -> i.text.includes iname
                    item1.text = item1.text
                        .split iname
                        .join rname
                        
                    item1.item[ rname ] = toref
                    delete  item1.item[ iname ]

                rtext = rtext
                    .split iname
                    .join rname

            items = items.filter (i) -> !i.to

            for item in items when rtext.includes itext = item.text
                rtext = rtext.split( itext ).join( item.name ) 


            pquery = " #{rtext} "
            qbinds = "select|from|where|order by|limit".split "|"
            qregex = new RegExp " #{qbinds.join( " | " )} ", "gi"
            qparts = []

            for qpart from pquery.matchAll qregex
                [ qtype ] = qpart
                { index: start, input } = qpart
                { length: index } = qparts

                text = input.substring start
                type = qtype.trim()
                end  = start + text.length

                qparts[ index ] = {
                    type, text, start, end
                }

                if  prev = qparts[ index-1 ]
                    prev.end = start
                    prev.text = qpart.input.substring prev.start, start

            for qpart in qparts

                { type, text } = qpart
                [ start, end ] = [0,0]

                while text . startsWith " "
                    text = text.substring 1
                    ++start

                while text . endsWith " "
                    text = text.substring 0, text.length-1
                    end--

                if  text . startsWith type
                    text = text.substring(
                        start += type.length
                    )

                qpart.text = text
                qpart.start += start
                qpart.end += end

            qparts.at( -0 ).start--
            qparts.at( -1 ).end--

            for qpart in qparts
                { start, end, text, type } = qpart

                index = items.length
                iname = [
                    "$", {
                        from    : "tables",
                        where   : "matches",
                        select  : "columns",
                    }[ type ]
                ].join ""

                items[ index ] = {
                    name: iname, text,
                    type: "qpart"
                    part: { start, end },
                    item: {}
                }

                rtext = rtext.split( text ).join( iname )

            for value in items then Object.defineProperty(
                items , value.name , { value }
            ) unless Object.hasOwn items, value.name

            rtext

        parseColumns = ->
            coldefs = []
            coltext = ",#{items.$columns.text},"
            for cdef from coltext.matchAll /\,/g

                start = cdef.index + 1
                index = coldefs.length
                
                coldefs[ index ] = { start }

                if  prev = coldefs[ index - 1 ]
                    prev . end = start - 1

            coldefs.splice -1

            for cdef in coldefs

                text = coltext.substring cdef.start, cdef.end

                l = text.length
                i = 0
                j = l-1

                i++ while !text[i].replace(",","").trim()
                j-- while !text[j].replace(",","").trim()

                cdef.text = text.substring i, j+1

            iColumnsStart = items.$columns.part.start

            for cdef in coldefs
                cdef.start += iColumnsStart
                cdef.end = cdef.start + cdef.text.length - 1
            
            for cdef in coldefs

                cparse = cdef.text.split new RegExp " as ", "i"
                colref = cparse.at(  0 )
                calias = cparse.at( -1 ) 

                unless ref = items[ colref ]
                    throw /REFNOTFOUND/

                if  colref isnt calias
                    items.push ref = {
                        ref: ref.ref,
                        text: calias, 
                        type: "alias"
                        name: "$ref#{items.length}"
                    }

                    items.$columns.text = items.$columns.text
                        .split( cdef.text ).join( ref.name )

                cdef.ref = items.$columns.item[ ref.name ] = ref
            items.$columns.subs = coldefs

            for value in items then Object.defineProperty(
                items , value.name , { value }
            ) unless Object.hasOwn items, value.name

        parseSources = ->

            tbldefs = []
            tbltext = ",#{items.$tables.text},"
            for tdef from tbltext.matchAll /\,/g

                start = tdef.index + 1
                index = tbldefs.length
                
                tbldefs[ index ] = { start }

                if  prev = tbldefs[ index - 1 ]
                    prev . end = start - 1

            tbldefs.splice -1

            for tdef in tbldefs

                text = tbltext.substring tdef.start, tdef.end

                l = text.length
                i = 0
                j = l-1

                i++ while !text[i].replace(",","").trim()
                j-- while !text[j].replace(",","").trim()

                tdef.text = text.substring i, j+1

            for tdef in tbldefs
                tdef.start += items.$tables.part.start
                tdef.end = tdef.start + tdef.text.length - 1
            
            for tdef in tbldefs

                tparse = tdef.text.split new RegExp " ", "i"
                tblref = tparse.at(  0 )
                talias = tparse.at( -1 ) 

                unless ref = items[ tblref ]
                    throw /REFNOTFOUND/

                if  tblref isnt talias
                    items.push ref = {
                        ref: ref.ref,
                        text: talias, 
                        type: "alias"
                        name: "$ref#{items.length}"
                    }

                    items.$tables.text = items.$tables.text
                        .split( tdef.text ).join( ref.name )

                tdef.ref = items.$tables.item[ ref.name ] = ref

            items.$tables.subs = tbldefs

            for value in items then Object.defineProperty(
                items , value.name , { value }
            ) unless Object.hasOwn items, value.name

        parseMatches = ->

            mamdefs = []
            mattext = " and #{items.$matches.text} and "
            for mdef from mattext.matchAll new RegExp( " and | or ", "gi" )

                start = mdef.index + mdef[0].length
                index = mamdefs.length
                bound = mdef[0].trim()
                
                mamdefs[ index ] = { start, bound }

                if  prev = mamdefs[ index - 1 ]
                    prev . end = mdef.index

            mamdefs.splice -1
            delete mamdefs[0].bound

            for mdef in mamdefs
                text = mattext.substring mdef.start, mdef.end

                l = text.length
                i = 0
                j = l-1

                i++ while !text[i].trim()
                j-- while !text[j].trim()

                mdef.text = text.substring i, j+1

            for mdef in mamdefs
                mdef.start += items.$matches.part.start
                mdef.end = mdef.start + mdef.text.length - 1
            
            for mdef, i in mamdefs when i > 0
                mamdefs[i].required = yes
                mamdefs[i-1].required = mdef.bound isnt "or"
            
            for mdef in mamdefs
                matref = mdef.text

                unless ref = items[ matref ]
                    throw /REFNOTFOUND/
                
                items.$matches.item[ ref.name ] =
                    mdef.ref = ref

                for t, i of ref.item
                    continue if i.type isnt "part"
                    i.required = mdef.required
                ref.required = mdef.required

                delete mdef.required

            items.$matches.subs = mamdefs

            for value in items then Object.defineProperty(
                items , value.name , { value }
            ) unless Object.hasOwn items, value.name

        resolveParts = ->
            for part in items when part.type is "part"
                
                text    = part.text
                subs    = text.split /\s+/g
                arg0    = subs.at +0
                arg1    = subs.at -1
                op      = part.text
                    .substring( arg0.length, text.length - arg1.length )
                    .trim()
                    .replace(/is not|not|\<\>/gi, "!=")
                    .replace(/is/gi, "=")
                    .replace(/and/gi, "&&")
                    .replace(/or/gi, "||")

                for arg, i in [ arg0, arg1 ]

                    if  arg.startsWith "$"
                        unless ref = part.item[ arg ] = items[ arg ]
                            throw /ARGNTFOUND/

                    else if !isNaN val = Number arg 
                        numi = items.length
                        nname = "$num#{numi}"

                        ref =
                            ref  : OPTR.NumberPointer.from val
                            type : "number", name : nname

                        part.item[ nname ] =
                            items[ numi ] = ref

                    if i is 0 then arg0 = ref
                    if i is 1 then arg1 = ref


                part.text = [ arg0.name, op, arg1.name ].join " "
                part.operate = [ arg0.ref || arg0, op, arg1.ref || arg1 ]

            0

        rquery = partRawQuery()
        
        parseColumns()
        parseSources()
        parseMatches()
        resolveParts()

        @set items
        @parsedql.set rquery

        for item in items when ref = item.ref
            unless ref.parent then this.appendChild ref
            else @appendChild OPTR.PointerLink.from ref 

        table items.slice 0
        warn query 
        warn rquery
    
export class DBQuerySource              extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    


export class Column                     extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @from           : ( options = {} ) ->
        ptri = @new()
        ptrc = @classPointer

        for key , val of options
            ptri[ key ] = ptrc.getProperty(key).from(val)

        ptri

    getProperty     : -> @instanceOf.getProperty arguments...

export class Row                        extends Object

export class Rule                       extends OPTR.ObjectPointer

export class RuleSet                    extends OPTR.ObjectPointer

export class Table                      extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    createColumn    : ( name, instanceOf, byteLength ) ->
        
        @appendChild Column.from {
            name, instanceOf, byteLength,
            offset : @addStride(4)
        }
        
    addStride       : ( byteLength = 0 ) ->
        @stride = byteLength + ( offset = @stride.toPrimitive() )
        return offset

    getColumn       : ( any ) ->
        unless isNaN any
            return @children[ i ]
        return @find (c) -> c.name.eq any

    get             : ( index = 0 ) ->
        byteLength = @stride.toPrimitive()
        byteOffset = byteLength * index
        basedv = @base.dataView( byteOffset, byteLength )

        Object.defineProperties result = new Row, {
            index: value: index
            byteOffset: value: byteOffset
            byteLength: value: byteLength
        }

        for col in @children
            alias = col.instanceOf.getProperty "alias"
            offset = col.offset.toPrimitive()

            result[ col.name.toPrimitive() ] =
                basedv.get alias, offset

        result
    
    subdataview     : ( byteOffset = 0, byteLength ) ->
        byteLength ||= @byteLength - byteOffset
        @base.dataView( byteOffset, byteLength )
    
    subbuffer       : ( byteOffset = 0, byteLength ) ->
        byteLength ||= @byteLength - byteOffset
        @base.subarray(
            byteOffset, byteLength
        ).slice().buffer
    
    subarray        : ( byteOffset = 0, byteLength ) ->
        byteLength ||= @byteLength - byteOffset
        @base.subarray(
            byteOffset, byteLength
        )
    
    insert          : ( values = {} ) ->
        stride = @stride.toPrimitive()
        offset = @offset.add stride
        basedv = @base.dataView( offset, stride )

        for key in Object.keys values
            col = @getColumn key
            value = values[key]
            alias = col.instanceOf.getProperty "alias"
            basedv.set alias, col.offset.toPrimitive(), value
            
        return offset / stride

    Object.defineProperty this::, "byteLength", get : ->
        @pages.toPrimitive() * 654

    Object.defineProperty this::, "count", get : ->
        @offset.toPrimitive() / @stride.toPrimitive()     

export class TypedAny                   extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @definitions    : [ NaN ]

    @replaceWith    : []

    @matchRegExp    : /$/gui

    @from           : ( any, replaceWith = @replaceWith ) ->

        if rl = replaceWith.length then while rl
                replace = replaceWith[ --rl ]
                search = replaceWith[ --rl ]
                any = any.replace search, replace

        if !any.match @matchRegExp
            throw /NONMATCHED_REXP/

        typeArray = this.definitions
        typeCount = typeArray.length

        while type = --typeCount
            test = "\\#{typeArray[ type ]}"
            rexp = new RegExp( test, "gi" )
            break if rexp.test any

        throw /TESTFAIL_ANY/ unless type
        
        Object.assign @new(), { type }

    @fromMatch      : ( any ) ->
        if  0 < @definitions.indexOf any.toUpperCase()
            return @from any
        undefined

    toPrimitive     : ->
        @constructor.definitions[ @type ]

    Object.defineProperty this::, "children",
        enumerable: off, value : []

    Object.defineProperty this::, "valueKey",
        enumerable: on, get : -> @toPrimitive()

export class Mathematics                extends TypedAny

    @classPointer   : OPTR.ClassPointer.from this

    @matchRegExp    :  /\+\+|\-\-|\*\*|\/\/|\+|\-|\*|\//g 

    @definitions    : [ NaN, "+", "-", "*", "/", "%", "++", "--", "**", "//" ]

export class Comparision                extends TypedAny

    @classPointer   : OPTR.ClassPointer.from this

    @matchRegExp    :  /\ is not |\ not |\ is |\>\=|\<\=|\=\=|\!\=|\>|\<|\=/gi 

    @replaceWith    : [ /is not/gi, "!=", /not/gi, "!=", /is/gi, "==", /\s/g, "" ]

    @definitions    : [ NaN, ">=", "<=", "!=", "==", "<>", "<", ">", "=", "is not", "is", "not" ]

export class Operator                   extends TypedAny

    @classPointer   : OPTR.ClassPointer.from this

    @definitions    : [ NaN, "+", "-", "*", "/", "%" ]

export class Operation                  extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @from           : ( args = {} ) ->
        {in0, in1, out, operator, begin = 0, count = 0, index = 0} = args

        setByteOffsetIn0 = args.setByteOffsetIn0 || in0.offset.toPrimitive()
        firstIndexIn0 = args.firstIndexIn0 || 0
        strideByteLengthIn0 = args.strideByteLengthIn0 || in0.parent.stride.toPrimitive()

        setByteOffsetIn1 = args.setByteOffsetIn1 || in1.offset.toPrimitive()
        firstIndexIn1 = args.firstIndexIn1 || 0
        strideByteLengthIn1 = args.strideByteLengthIn1 || in1.parent.stride.toPrimitive()

        setByteOffsetOut = args.setByteOffsetOut || out.offset.toPrimitive()
        firstIndexOut = args.firstIndexOut || 0
        strideByteLengthOut = args.strideByteLengthOut || out.parent.stride.toPrimitive()

        operation = new Object {
            begin, count, index,
            in0, setByteOffsetIn0, firstIndexIn0, strideByteLengthIn0,
            in1, setByteOffsetIn1, firstIndexIn1, strideByteLengthIn1,
            out, setByteOffsetOut, firstIndexOut, strideByteLengthOut,
            operator : Operator.from operator
        }
        
        Object.assign Operation.new(), operation

    getBuffer             : ( col, first, stride ) ->
        byteOffset = first.toPrimitive() * stride.toPrimitive()
        byteLength = stride.toPrimitive() * @count.toPrimitive()
        return col.target.parent.subbuffer byteOffset, byteLength

    toWorker              : ->

        bufIn0 = @getBuffer @in0, @firstIndexIn0, @strideByteLengthIn0
        bufIn1 = @getBuffer @in1, @firstIndexIn1, @strideByteLengthIn1

        worker = new Worker( URL.createObjectURL(
            new Blob([@toWorkerCode()],
            {type : "application/javascript"})
        ))

        worker.onmessage = ({data}) =>
            unless data then throw /FAILED/

            iLE = DataView::isLittleEndian

            count = @count.toPrimitive()
            alias = @out.getProperty "alias"

            $strideOut = @strideByteLengthOut.toPrimitive();
            $offsetOut = @setByteOffsetOut.toPrimitive();
            $lengthOut = $strideOut - $offsetOut;

            reader = new DataView data
            writer = @out.target.parent.subdataview(
                @firstIndexOut.toPrimitive(),
                $strideOut * count
            )

            getOffset = 0
            setOffset = $offsetOut

            getter = "get" + alias
            setter = "set" + alias

            while count--
                value = reader[ getter ]( getOffset, iLE )
                writer[  setter ]( setOffset, value, iLE )

                getOffset += $lengthOut
                setOffset += $strideOut


            log "done count:", @count.toPrimitive()

            #todo release after dev: 
            worker.terminate()
        
        worker.postMessage(
            {bufIn0, bufIn1}, 
            [bufIn0, bufIn1]
        )

        this

    toWorkerCode          : ->

        iLE = DataView::isLittleEndian
        alias = @out.getProperty "alias"
        count = @count.toPrimitive()
        operator = @operator.toString();

        #todo if stride is 0 then it is constant
        $strideIn0 = @strideByteLengthIn0.toPrimitive();
        $strideIn1 = @strideByteLengthIn1.toPrimitive(); #? multi -> single operation
        $strideOut = @strideByteLengthOut.toPrimitive();
        
        $offsetIn0 = @setByteOffsetIn0.toPrimitive();
        $offsetIn1 = @setByteOffsetIn1.toPrimitive();
        $offsetOut = @setByteOffsetOut.toPrimitive();

        $lengthOut = $strideOut - $offsetOut;
        byteLength = $lengthOut * count;

        [   "",
            "self.addEventListener('message', function({data}){",
            "",
            "   let viewIn0 = new DataView( data.bufIn0 );",
            "   let viewIn1 = new DataView( data.bufIn1 );",
            "",
            "   let buffer = new ArrayBuffer( #{byteLength} );",
            "   let writer = new DataView( buffer );",
            "",
            "   let count = #{count};",
            "   let res = [];",
            "",
            "   let $in0;",
            "   let $offsetIn0 = #{$offsetIn0};",
            "   let $strideIn0 = #{$strideIn0};",
            "",
            "   let $in1;",
            "   let $offsetIn1 = #{$offsetIn1};",
            "   let $strideIn1 = #{$strideIn1};",
            "",
            "   let $offsetOut = 0;",
            "",
            "   $in0 = viewIn0.get#{alias}( $offsetIn0, #{iLE} ); ",
            "   $in1 = viewIn1.get#{alias}( $offsetIn1, #{iLE} ); ", 
            "",
            "   while ( count-- )",
            "   {", 
            "       writer.set#{alias}( ",
            "           $offsetOut, ($in0 #{operator} $in1), #{iLE}"
            "       );",
            "",
            "       res.push({ i: count, op: '#{operator}', $in0, $in1, out:writer.get#{alias}($offsetOut, #{iLE}) })",
            "",
            ( $strideIn0 and "      $in0 = viewIn0.get#{alias}( $offsetIn0, #{iLE} ); " or ""),
            ( $strideIn1 and "      $in1 = viewIn1.get#{alias}( $offsetIn1, #{iLE} ); " or ""),
            "",
            "       $offsetOut += #{$lengthOut};",
            ( $strideIn0 and "       $offsetIn0 += #{$strideIn0};" or ""),
            ( $strideIn1 and "       $offsetIn1 += #{$strideIn1};" or ""),
            "   }",
            "",
            "   //console.log(res.slice());",
            "   postMessage(buffer, [buffer]);",
            "});",
            "",
        "" ].join "\n\t"


Database.definePointer "name",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

DBQuery.definePointer "sql",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

DBQuery.definePointer "parsedql",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

DBQuery.definePointer "db",
    enumerable : on,
    isRequired : on,
    instanceOf : Database

Table.definePointer "base",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint8ArrayPointer

Table.definePointer "offset",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber

Table.definePointer "pages",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32Number

Table.definePointer "stride",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Table.definePointer "name",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

Column.definePointer "byteLength",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "offset",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "instanceOf",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.ObjectPointer

Column.definePointer "name",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

Operation.definePointer "begin",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "count",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "index",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "in0",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "firstIndexIn0",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Operation.definePointer "setByteOffsetIn0",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Operation.definePointer "strideByteLengthIn0",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number


Operation.definePointer "in1",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "firstIndexIn1",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Operation.definePointer "setByteOffsetIn1",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Operation.definePointer "strideByteLengthIn1",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number


Operation.definePointer "out",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "firstIndexOut",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Operation.definePointer "setByteOffsetOut",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Operation.definePointer "strideByteLengthOut",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number






Operation.definePointer "operator",
    enumerable : on,
    isRequired : on,
    instanceOf : Operator



TypedAny.definePointer "type",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint8Number

