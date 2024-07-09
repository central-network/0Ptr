import * as OPTR from "./0ptr.min.js"

{ log, warn, error, table } = console

export class Database                   extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    regExp          : /select | from | where | as | and | or |\.|\,|\'|\"|\(|\)|SUM\(|AVG\(|MAX\(|MIN\(|\+|\-|\/|\*|\%|\=|\>|\<|\!/gi

    @regExp         :
        querybinder : /union /gi
        querypart   : /select | from | where | group by | order by | limit/gi
        tablebinder : /left join|right join|join/gi
        pathbinder  : /\./gi
        textpart    : /\'|\"/g
        aliasparser : / as /gi
        rulebinder  : / or | and /gi
        nameparser  : /\,/
        comparator  : /\=|\!\=|\<|\>|\>\=|\<\=/g
        mathbinder  : /\+|\-|\/|\*|\%/g
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
                else retunr throw /COLMNMATCHS_MULTITABLE/

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
            Comparator.fromMatch( any ) or
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

    query           : ( options = {} ) ->
        tables = @parseTables options
        columns = @parseColumns options, tables
        rules = @parseRules options, columns, tables

        if  Object.keys(tables).length is 1
            for columnAlias, column of columns
                columns[ columnAlias.split(".")[1] ] = column
                delete columns[ columnAlias ]

        results = []
        index = 0
        for tableAlias, table of tables
            rows = table.count
            i = 0

            while i < rows
                get = table.get i++
                row = {}

                for columnAlias, column of columns
                    columnName = column.name.toPrimitive()
                    row[ columnAlias ] = get[ columnName ]

                for rule in rules
                    for columnAlias, value of row
                        #todo replace value with alias and filter
                        1

                results[index++] = row

        results

    parse           : ( query = "" ) ->
        nums = []
        item = [] 
        prev = 0

        for part from query.matchAll Database.regExp.numbersplit
            index = part.index

            if !prev
                prev = index
                continue

            text = query.substring prev, index

            if !isNaN(text) and text.match /\d/
                value = text * 1
                isInteger = Number.isInteger value
                isNegative = value < 0
                typedNumber =
                    if !value then "NaN"

                    else if !isInteger then switch 10 < text.indexOf "."
                        when on then "Float64"
                        when no then "Float32"

                    else if !isNegative then switch true 
                        when value <= 0xff then "Uint8"
                        when value <= 0xffff then "Uint16"
                        when value <= 0xffffffff then "Uint32"
                        else "BigUint64"

                    else switch true
                        when Math.abs(value) <= 0xff/2 - 1 then "Int8"
                        when Math.abs(value) <= 0xffff/2 - 1 then "Int16"
                        when Math.abs(value) <= 0xffffffff/2 - 1 then "Int32"
                        else "BigInt64"
                
                nums.push { start:prev, end:index, type:typedNumber, value }

            prev = index+1

        for num in nums.reverse()
            query = [
                query.substring(0, num.start),
                "$", item.push(num)-1,
                query.substring(num.end)
            ].join("")


        prev = 0
        strs = []
        stri = 0
        for part from query.matchAll Database.regExp.textpart

            index = part.index
            stri = stri + 1

            if !prev
                prev = index+1
                continue
            
            unless stri % 2
                text = query.substring prev, index
                strs.push { start:prev-1, end:index+1, value:text, type:"string" }

            prev = index+1

        for str in strs.reverse()
            query = [
                query.substring(0, str.start),
                "$", item.push(str)-1,
                query.substring(str.end)
            ].join("")



        prev = 0
        alss = []
        alsi = 0

        for part from query.matchAll Database.regExp.aliasparser

            index = part.index
            alsi = alsi + 1

            if !prev
                prev = index+4
                continue
            
            unless alsi % 2
                text = query.substring( prev, index ).split(/\s+|\,/).at(0)
                alss.push { start:prev, end:prev + text.length, value:text, type: "alias" }

            prev = index+4

        if  part.index
            text = query.substring( prev ).split(/\s+|\,/).at(0)
            alss.push { start:prev, end:prev + text.length, value:text, type: "alias" }


        for str in alss.reverse()

            if -1 is i = item.findIndex (a) -> (a.value is str.value) and a.type is "alias"
                i += item.push( str )

            query = [
                query.substring(0, str.start),
                "$#{i}",
                query.substring(str.end)
            ].join("")


        #todo bunu en son yap özgür, naber :) <3
        for str in item.filter (i) -> i.type is "alias"
            query = query.split("#{str.value}").join("$#{i}" )

        parts = []

        for match from query.matchAll Database.regExp.partparser    
            if  match[0].match Database.regExp.partopener
                parts.push start: match.index
            else 
                part = parts.findLast( (p) -> p.start and !p.end )
                part.end = match.index
                part.length = match.index - part.start

        for part in parts
            Object.defineProperties part,
                children : value : []
                parents : value : []
        
        parts
            .map (p0, i) ->
                c = []
                while (p1 = parts[i++]) then if (p1.start > p0.start)
                    continue unless p1.end < p0.end
                    (c[c.length] = p1).parents.push p0
                if c.length then p0.children.push c...
                p0

            .map (p) ->
                text = query.substring p.start+1, p.end
                Object.assign p, { text }

        item.push.apply item, parts.sort( (a, b) ->
            if a.length < b.length then -2
            else if a.children.length < b.children.length then -1
            else 1 
        ).filter( (p) -> !p.children.length
        ).map( ({ text, start, end }) ->
            { type: "part", value:text, start, end }  
        )

        table item
        log "\n\n",query
        log "\n\n",parts

        1

         

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

    @from           : ( any ) ->
        if  1 > type = @definitions.indexOf any
            throw /UNDEFINED_ANY/
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

    @definitions    : [ NaN, "SUM", "AVG", "MED", "MAX", "MIN", "POW" ]

export class Comparator                 extends TypedAny

    @classPointer   : OPTR.ClassPointer.from this

    @definitions    : [ NaN, "<", ">", "=", ">=", "<=", "!=", "<>" ]

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

