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
            base : OPTR.Uint8ArrayPointer.from pages * 654,
            uuid : OPTR.StringPointer.from crypto.randomUUID()
        }

    createOperation : -> Operation.from arguments...

    getTables       : -> @filter (i) -> i instanceof Table
    
    getSource       : ( path ) ->
        split = path.split( "." ).reverse()
        switch split.length
            when 3 then [ colName, tblName, dbName ] = split
            when 2 then [ colName, tblName ] = split
            when 1 then [ colName ] = split
        return @children[0]

    getTable        : ( path ) -> 
        tblName = path.replace(/\`/g, '').split(".").reverse().at(0)
        @getTables().find ( ptri ) -> ptri.name.eq tblName

    query           : ( sql ) ->

        query = DBQuery.from { sql, database: this }

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

    parseQuery          : ( query ) ->
        dbQuery = DBQuery.new()
        dbQuery.database = this

        warn query

        qparts = $part0 : part0 = { start: 0 }

        query = @maskQuotes query, qparts
        query = @repartQuery query, qparts

        part0.text = query
        part0.label = "$part0"

        for key, part of qparts
            delete part.end

        for key, part of qparts when part.label.startsWith "$part"
            if  match = part.text.match /limit/i
                label = "$limit#{Object.keys(qparts).length}"

                qparts[ label ] =
                    start : part.start + match.index + match[0].length + 1
                    text : part.text.substring match.index + match[0].length + 1
                    label : label

                part.text = (
                    part.text.substring( 0, match.index ) +
                    label 
                ) 

        for key, part of qparts when part.label.startsWith "$part"
            if  match = part.text.match /order\sby/i
                label = "$orderby#{Object.keys(qparts).length}"

                end = part.text.length
                for endMatch from part.text.matchAll /\$limit/gi
                    if  match.index < endMatch.index
                        end = Math.min( end, endMatch.index - 1 )

                qparts[ label ] =
                    start : part.start + match.index + match[0].length + 1
                    text : part.text.substring( match.index + match[0].length + 1, end )
                    label : label

                part.text = (
                    part.text.substring( 0, match.index ) +
                    label +
                    part.text.substring( end )
                ) 

        for key, part of qparts when part.label.startsWith "$part"
            if  match = part.text.match /group\sby/i
                label = "$groupby#{Object.keys(qparts).length}"

                end = part.text.length
                for endMatch from part.text.matchAll /\$order|\$limit/gi
                    if  match.index < endMatch.index
                        end = Math.min( end, endMatch.index - 1 )

                qparts[ label ] =
                    start : part.start + match.index + match[0].length + 1
                    text : part.text.substring( match.index + match[0].length + 1, end )
                    label : label

                part.text = (
                    part.text.substring( 0, match.index ) +
                    label +
                    part.text.substring( end )
                ) 


        for key, part of qparts when part.label.startsWith "$part"
            if  match = part.text.match /where/i
                label = "$where#{Object.keys(qparts).length}"

                end = part.text.length
                for endMatch from part.text.matchAll /\$group|\$order|\$limit/gi
                    if  match.index < endMatch.index
                        end = Math.min( end, endMatch.index - 1 )

                qparts[ label ] =
                    start : part.start + match.index + match[0].length + 1
                    text : part.text.substring( match.index + match[0].length + 1, end )
                    label : label

                part.text = (
                    part.text.substring( 0, match.index ) +
                    label +
                    part.text.substring( end )
                ) 



        for key, part of qparts when part.label.startsWith "$part"
            if  match = part.text.match /from/i
                label = "$from#{Object.keys(qparts).length}"

                end = part.text.length
                for endMatch from part.text.matchAll /\$where|\$group|\$order|\$limit/gi
                    if  match.index < endMatch.index
                        end = Math.min( end, endMatch.index - 1 )

                qparts[ label ] =
                    start : part.start + match.index + match[0].length + 1
                    text : part.text.substring( match.index + match[0].length + 1, end )
                    label : label

                part.text = (
                    part.text.substring( 0, match.index ) +
                    label +
                    part.text.substring( end )
                ) 


        for key, part of qparts when part.label.startsWith "$part"
            if  match = part.text.match /select|delete|insert\sinto/i
                label = "$#{match[0].split(' ').at(0)}#{Object.keys(qparts).length}".toLowerCase()

                end = part.text.length
                for endMatch from part.text.matchAll /\$from|\$where|\$group|\$order|\$limit/gi
                    if  match.index < endMatch.index
                        end = Math.min( end, endMatch.index - 1 )

                qparts[ label ] =
                    start : part.start + match.index + match[0].length + 1
                    text : part.text.substring( match.index + match[0].length + 1, end )
                    label : label

                part.text = (
                    part.text.substring( 0, match.index ) +
                    label +
                    part.text.substring( end )
                ) 

        for key, part of qparts when part.label.startsWith "$select"

            start = -1
            outs = []
            end = 0

            part.text = part.text + ","

            for out from part.text.matchAll /\,/g
                outstart = start + 1
                outend = out.index

                [ src, alias ] = part
                    .text
                    .substring( outstart, outend )
                    .trim()
                    .split( /\sas\s/i )
                
                outs.push out = {
                    start:outstart, end: outend, src, alias, 
                    label : "$out#{Object.keys(qparts).length}"
                }

                qparts[ out.label ] = out

                start = outend

            for out in outs.reverse()

                part.text = (
                    part.text.substring( 0, out.start ) +
                    out.label +
                    part.text.substring( out.end )
                ) 

                out.start += part.start

            part.text = part.text.substring 0, part.text.length - 1


        for key, part of qparts
            delete part.end

        log qparts
        
        log ""
        log ""

    parseSelect         : ( query, dbQuery ) ->
        return unless { index } = query.match(/select\ /i) || {}

        parts = []
        for part from query.matchAll /\(|\)/g
            [ char ] = { index: start } = part

            if  char is "("
                parts.push { char, start }
                continue

            parts
                .filter((p) ->  p.char is "(")
                .findLast((p) -> !p.end )
                .end = start

        start = index + "select\s".length
        end = query.length

        for part in parts when part.start < start
            end = part.end
            break

        section = "columns"
        sections = columns : { start, end }

        for match from query.matchAll /\sfrom\s|\swhere\s|\sgroup\sby\s|\sorder\sby\s|\slimit\s/gi
            continue if match.index < start
            continue if match.index > end
            continue if parts.find (p) ->
                (match.index < p.end) and
                (start < p.start) and
                (match.index > p.start)

            sections[ section ].end = match.index
            sections[ section = match[0].trim() ] =
                start : match.index + match[0].length
                end : end


        sQuery = DBSelectQuery.from query
        sQuery . target = dbQuery

        for section of sections
            sections[section].text = query.substring(
                sections[section].start, sections[section].end
            )

        f = 0
        for s, { text } of sections then switch s.toUpperCase()
            when "COLUMNS" then sQuery.appendChild DBQueryColumnsPart.from text
            when "FROM" then sQuery.appendChild f = DBQueryFromPart.from text
            when "WHERE" then sQuery.appendChild DBQueryWherePart.from text
            when "GROUP BY" then sQuery.appendChild DBQueryGroupByPart.from text
            when "ORDER BY" then sQuery.appendChild DBQueryOrderByPart.from text
            when "LIMIT" then sQuery.appendChild DBQueryLimitPart.from text


        if  f
            log f
        
        parts =
        sections = null

        return 1


    repartQuery         : ( query, qparts ) ->
        parts = []
        for part from query.matchAll /\(|\)/g
            [ char ] = { index: start } = part

            if  char is "("
                parts.push { char, start, i: Object.keys(qparts).length }
                continue

            parts
                .filter((p) ->  p.char is "(")
                .findLast((p) -> !p.end )
                .end = start

        return query unless parts.length

        part = parts.at(-1)

        part.text = query.substring( part.start+1, part.end ).trim()
        part.label = "$part#{part.i}"

        delete part.char
        
        prevWord = ""
        prevStart = part.start

        while 32 - ( code = query.charCodeAt( --prevStart ) )
            prevWord = String.fromCharCode( code ) + prevWord
        prevWord = prevWord.trim()
        
        if  fnMatch = prevWord.match /SUM|AVG|MAX|MIN|LEFT|USING/i
            part.start -= fnMatch[0].length
            part.func = fnMatch[0]
            part.label = "$func" + part.i


        qparts[part.label] = part

        query = (
            query.substring( 0, part.start ) + 
            part.label + 
            query.substring( part.end + 1 )
        ) 
        
        delete part.i
        
        @repartQuery query, qparts

    maskQuotes          : ( query, qparts ) ->

        openerQuote = 0
        closerQuote = query.length

        { index: doubleQuote } = query.match( /\"/ ) or {}
        { index: singleQuote } = query.match( /\'/ ) or {}
        { index: domainQuote } = query.match( /\`/ ) or {}

        label = "$string" + Object.keys(qparts).length

        if  domainQuote
            openerQuote = domainQuote
            closerQuote = 1 + query.indexOf "`", openerQuote + 1

            label = "$domain" + Object.keys(qparts).length

        else if singleQuote and doubleQuote

             if singleQuote < doubleQuote
                openerQuote = singleQuote
                closerQuote = 1 + query.indexOf "'", openerQuote + 1

             else
                openerQuote = doubleQuote
                closerQuote = 1 + query.indexOf '"', openerQuote + 1

        else if singleQuote
                openerQuote = singleQuote
                closerQuote = 1 + query.indexOf "'", openerQuote + 1

        else if doubleQuote
                openerQuote = doubleQuote
                closerQuote = 1 + query.indexOf '"', openerQuote + 1

        else
            return query.replace /\s+/g, " "



        qparts[label] = 
            start : openerQuote + 1,
            end : closerQuote - 1,
            label : label,
            text : text = query.substring(
                openerQuote + 1, closerQuote - 1
            ) 

        return @maskQuotes(
            query.substring( 0, openerQuote ) + 
            label.padEnd( closerQuote - openerQuote, " " ) + 
            query.substring( closerQuote ) , qparts
        )

export class DBQuery2                   extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @from           : ( options = { sql, database } ) ->
        Object.assign( @new(), options ).parse()

    Object.defineProperty this::, "parts", enumerable:on, get : ->
        Object.fromEntries @children.map ( ptri ) ->
            [ ptri.type.toPrimitive(), ptri ]

    Object.defineProperty this::, "arguments", enumerable:on, get : ->
        @filter ( ptri ) -> ptri instanceof DBQueryArgument

    replaceQuotes   : ->
        rawquery = @sql.toPrimitive()
        quotes = []

        for match from rawquery.matchAll /\'|\"/g
            { index: start } = [ char ] = match
            { length: index } = quotes

            quotes[ index ] = { char, start }
            quotes[ index - 1 ].end = start + 1 if index % 2

        for { start, end } in quotes.reverse().filter (q) -> q.end
            { length: index } = @children

            @appendChild OPTR.StringPointer.from(
                 rawquery.substring start+1, end-1
            )

            rawquery = (
                rawquery.substring( 0, start ) + 
                "$str#{index}" + rawquery.substring( end )
            )

        quotes.length = 0
        @parsedql = OPTR.StringPointer.from rawquery

        this

    getLinkedSource : ( link ) ->
        uuid = link.uuid.toString()

        for ptri in @children.filter (i) -> i instanceof DBSourceRef
            continue unless link = ptri.link.target
            continue unless uuid is link.uuid.toString()
            return ptri

        return null


    getSourceTables : -> @filter ( ptri ) -> ptri instanceof DBSourceTable 
    
    getSourceColumns : -> @getSourceTables().flatMap ( ptri ) -> ptri.target.children
        
    getQueryArguments : -> @filter ( ptri ) -> ptri instanceof DBQueryArgument

    findQueryArguments : ( rawquery ) ->
        rawquery ||= @parsedql.toString()
        queryDBName = @database.name
        inputrawquery = "#{rawquery}"
        
        for match from rawquery.matchAll /\ as\ /gi
            prevQueryText = rawquery.substring 0, match.index
            restQueryText = rawquery.substring match.index + match[0].length

            continue unless (
                restQueryText.match( /from/i ) and
                prevQueryText.match( /select/i )
            )

            prevWord = ""
            partopened = 0
            quoteopened = 0
            domainopened = 0
            textopened = 0

            pos = match.index
            while pos-- > 0
                posChar = rawquery.charAt pos
                prevWord = posChar + prevWord

                if  posChar is "`"
                    domainopened = !domainopened
                    continue

                if  posChar is "'"
                    quoteopened = !quoteopened
                    continue

                if  posChar is '"'
                    textopened = !textopened
                    continue

                if  posChar is "("
                    partopened++
                    continue

                if  posChar is ")"
                    partopened--
                    continue

                if ( " " is posChar || posChar is "," )
                    continue if textopened
                    continue if domainopened
                    continue if quoteopened
                    continue if partopened

                    prevWord = prevWord.substring 1
                    break

            prevStart = pos + 1
            prevEnd = prevStart + prevWord.length

            nextWord = ""
            partopened = 0
            quoteopened = 0
            domainopened = 0
            textopened = 0

            pos = match.index + match[0].length - 1
            len = match.input.length
            while ++pos < len
                posChar = rawquery.charAt pos
                nextWord = nextWord + posChar

                if  posChar is "`"
                    domainopened = !domainopened
                    continue

                if  posChar is "'"
                    quoteopened = !quoteopened
                    continue

                if  posChar is '"'
                    textopened = !textopened
                    continue

                if  posChar is "("
                    partopened++
                    continue

                if  posChar is ")"
                    partopened--
                    continue

                if ( " " is posChar || posChar is "," )
                    continue if textopened
                    continue if domainopened
                    continue if quoteopened
                    continue if partopened
                    nextWord = nextWord.substring 0, nextWord.length - 1
                    break

                nextEnd = pos + 1
                nextStart = nextEnd - nextWord.length

            value = null
            label = nextWord

            if  "'" is prevWord[0] or prevWord[0] is '"'
                value = OPTR.StringPointer.from rawquery.substring prevStart+1, prevEnd-1

            else if "`" is prevWord[0]
                [ colName, tblName, dbName = queryDBName ] = rawquery
                    .substring( prevStart+1, prevEnd-1 )
                    .split( "." ).reverse()

                value = @findSourceTable( tblName, dbName ).findColumn colName

            else unless isNaN prevWord
                value = OPTR.NumberPointer.from prevWord

            else if func = DBQuery.isPredefinedFunction prevWord
                value = DBPredefinedOperation.from prevWord

            else
                [ colName, tblName, dbName = queryDBName ] = rawquery
                    .substring( prevStart, prevEnd ).split(".").reverse()

                table = if tblName then @findSourceTable tblName, dbName
                else @getSourceTables().find (t) -> t.find ( c ) -> c.name.eq alias
                    
                value = table.findColumn colName

            if !value
                throw /ARGREF_NOTFOUND/

            @appendChild ptri = DBQueryArgument.from label
                .target = value

            ptri.appendChild DBQueryPart.from {
                text : inputrawquery.substring(prevStart, nextEnd)
                start : prevStart
            }

            inputrawquery = (
                inputrawquery.substring(0, prevStart) + 
                ( "" ).padStart( nextEnd - prevStart, " " ) + 
                inputrawquery.substring( nextEnd )
            )

        for select from inputrawquery.matchAll /select\s/gi
            continue unless nextFrom = inputrawquery.match /from/i

            queryPart = inputrawquery
                .substring select.index, nextFrom.index
                .substring select.at(0).length

            partStart = select.index + select.at(0).length
            maxLength = nextFrom.index
            prevEnd = 0
            
            for colMatch from queryPart.matchAll /\,/g
                colStart = (
                    partStart + prevEnd +
                    colMatch.index + colMatch[0].length
                )

                while " " is inputrawquery.charAt colStart
                    ++colStart 

                colEnd = colStart
                colPart = ""

                while colEnd < maxLength  
                    char = inputrawquery.charAt colEnd++
                    break if " " is char or char is ","
                    colPart = colPart + char
                colEnd--

                continue unless colPart

                [ colName, tblName, dbName = queryDBName ] = colPart
                    .split( "." ).reverse()

                table = if tblName then @findSourceTable tblName, dbName
                else @getSourceTables().find (t) -> t.find ( c ) -> c.name.eq alias
                    
                if !value = table.findColumn colName                
                    throw /ARGREF_NOTFOUND/

                if !ptri = @getQueryArguments().find ( ptri ) -> ptri.toPrimitive() is colName
                    @appendChild ptri = DBQueryArgument.from colName
                        .target = value

                ptri.appendChild DBQueryPart.from {
                    text : inputrawquery.substring(colStart, colEnd)
                    start : colStart
                }

                inputrawquery = (
                    inputrawquery.substring(0, colStart) + 
                    ( "" ).padStart( colEnd - colStart, " " ) + 
                    inputrawquery.substring( colEnd )
                )

        srcTables = @getSourceTables()
        for arg in @getQueryArguments() then for argPart in arg.children 
        
            continue unless text = argPart.text.toPrimitive()
            continue unless "#{text}".includes "("
            continue if text is arg.toPrimitive()

            parts = []
            prevEnd = 0
            textLength = text.length

            for argTextPart from text.matchAll /[^a-z|A-Z|0-9|\.|\_]/gi
                part = text.substring prevEnd, argTextPart.index
                prevEnd = argTextPart.index + argTextPart.length

                continue unless part.trim()
                continue if part.trim().toUpperCase() is "AS"

                nextChar = ""
                i = prevEnd - 1
                while i < textLength
                    break if nextChar = text.charAt(i++).trim()
                continue if nextChar is "("

                [ colName, tblName, dbName = queryDBName ] = part
                    .split( "." ).reverse()

                value = null

                if !tblName
                    for s in srcTables then for c in s.target.children
                        if  c.name.eq colName 
                            value = c
                            break
                else
                    value = @findSourceTable( tblName, dbName ).findColumn colName
                    
                if !value then throw /ARGREF_NOTFOUND/

                if !ptri = @getQueryArguments().find ( ptri ) -> ptri.toPrimitive() is colName
                    @appendChild ptri = DBQueryArgument.from colName
                        .target = value

                ptri.appendChild DBQueryPart.from {
                    text : part
                    start : argTextPart.index + argPart.start.toPrimitive()
                }


        @parsedql.set inputrawquery

    @isPredefinedFunction : ( word ) ->
        if  startWord = "#{word}".split("(").at(0).toUpperCase().trim()
            operators = "SUM|AVG|MIN|MAX|LEFT".split "|"
            funcCount = operators.length

            while func = operators[ --funcCount ]
                return func if startWord is func
        
        return no

    findSourceTable  : ( alias, dbName = this.database.name ) ->
        this
            .filter ( ptri ) -> ptri instanceof DBSourceTable 
            .filter ( ptri ) -> ptri.database.name.eq dbName.toString()
            .find   ( ptri ) -> ptri.toString() is alias.toString()

    findSourceTables : ( rawquery ) ->

        dbName = @database.name.toString()
        dbTables = @database.getTables()
        rawquery ||= @parsedql.toString()
        inputrawquery = "#{rawquery}"


        for dbTable in dbTables
            tblName = dbTable.name.toString()
            refered = no 

            for dbTableMatch from rawquery.matchAll tblName
                nextPos = dbTableMatch.index + dbTableMatch[0].length
                alias = rawquery.substring(nextPos).trim().split(/\s+/g, 2).at 0
                char = alias.charAt 0

                if !refered and refered = on
                    @appendChild( DBSourceTable.from tblName )
                        .target = dbTable

                continue if alias.toUpperCase() is "WHERE"
                continue if "." is char or char is ","

                if  alias . endsWith ","
                    alias = alias.substring 0, alias.length-1

                continue unless alias = alias.trim()

                @appendChild( DBSourceTable.from alias )
                    .target = dbTable

                break

            continue

        this

    replaceSources  : ( links, rawquery ) ->
        rawquery ||= @parsedql.toString()

        @findSourceTables()
        @findQueryArguments()

        this




    resolveQueryParts   : ( query ) ->
        length = "#{query}".length
        pos = 0
        parts = []

        while pos < length 
            
            switch char = query.charAt pos
                when "(" then parts.push start: pos + 1
                when ")" then parts.findLast((p) -> !p.end).end = pos

            pos++


        parts = parts.map ( part, i ) -> {
            start: part.start
            end: end = part.end || length-1, 
            text: query.substring part.start, end
            parts : []
        }

        for p0 in parts then for p1 in parts
            continue unless p0.start > p1.start
            continue unless p0.end < p1.end
            p1.parts.push p0

        repart = ( arr ) ->
            pslice = structuredClone arr
            rslice = structuredClone arr

            for p0, i in pslice then for p1, j in rslice
                continue if i is j
                continue if !p1
                continue if !p1.parts.find((p) -> p.text is p0.text)
                arr[i] = null

            arr = arr.filter Boolean
            a.parts = repart a.parts for a in arr

            arr

        pointerify = ( arr, up ) ->
            for part in arr
                ptri = DBQueryPart.from {
                    text : part.text, 
                    start : part.start,
                    length : part.text.length
                }

                pointerify part.parts, up.appendChild ptri
                
            0

        ptri = DBQueryPart.from {
            text: query, start: 0, length
        }

        pointerify repart( parts ), ptri
        
        this.appendChild( ptri )

    resolvePartPointers : ( ptri ) ->
        text = ptri.text.toString()
        start = ptri.start.toNumber()
        length = ptri.length.toNumber()

        bText = []
        lastEnd = start + length

        childs = ptri.children.map ( ptrj ) ->
            ptrj.pstart = ptrj.start.toNumber() - start
            ptrj.plength = ptrj.length.toNumber()
            ptrj.pend = ptrj.pstart + ptrj.plength
            ptrj

        for ptrj, i in childs
            @resolvePartPointers ptrj

        for ptrj, i in childs
            bText.push text.substring( ptrj.pend, lastEnd )            
            bText.push ptrj.label = "$#{Number(ptrj)}"

            lastEnd = ptrj.pstart

        bText.push text.substring( 0, lastEnd ) 
        ptri.text = bText.reverse().join("")

    resolveStrings      : ( ptri ) ->
        for ptrj, i in ptri.children.filter (p) -> p instanceof DBQueryPart
            @resolveStrings ptrj

        text = ptri.text.toString()
        quotes = []
        for match from text.matchAll /\"|\'/g
            quotes.push { start: match.index, char: match[0] }

        return unless quotes.length

        for quote, i in quotes when !quote.opener
            closer = quotes
                .filter (q1) -> q1.char is quote.char
                .filter (q1) -> q1.start > quote.start
                .filter (q1) -> q1.opener is undefined
                .at 0

            closer.opener = quote
            quote.end = closer.start + 1

        quotes = quotes
            .filter (q) -> q.end
            .map (q) -> 
                q.text = text.substring q.start + 1, q.end - 1
                q
            .reverse()
                
        lastEnd = text.length
        bText = []

        for quote in quotes
            ptrj = DBQueryArgument.from quote.text
            ptrj.target = OPTR.StringPointer.from quote.text
            this.appendChild ptrj

            bText.push text.substring quote.end, lastEnd
            bText.push "$#{Number(ptrj)}"

            lastEnd = quote.start

        bText.push text.substring( 0, lastEnd ) 
        ptri.text = bText.reverse().join("")
        
    resolveNumbers      : ( ptri ) ->
        for ptrj, i in ptri.children.filter (p) -> p instanceof DBQueryPart
            @resolveNumbers ptrj

        text = ptri.text.toString()
        numt = ""
        tlen = text.length
        nums = []

        while char = text.charAt( --tlen )
            if  char is " "  
                nums.push [ numt, tlen + 1 ]
                numt = ""
                continue

            if  char is "$"  
                numt = ""
                continue

            if !isNaN char.trim()
                numt = char + numt
                continue

            isNumber = numt.trim().length and !isNaN numt * 1
            
            if  char is "."
                if  isNumber
                    numt = char + numt
                    continue
                else
                    numt = ""
                    continue

            if  char is "-"  
                if  isNumber
                    numt = char + numt
                    nums.push [ numt, tlen ]
                    numt = ""
                    continue

                else
                    numt = ""
                    continue

            if  char.match /[a-z]|[^\d]/ui
                numt = ""
                continue

            nums.push [ numt, tlen ]
            numt = ""

            continue



        lastEnd = text.length
        bText = []

        for [ tnum, start ] in nums.filter (n) -> n[0].trim()
            ptrj = DBQueryArgument.from tnum
            ptrj.target = OPTR.NumberPointer.from tnum
            this.appendChild ptrj

            bText.push text.substring start + tnum.length, lastEnd
            bText.push "$#{Number(ptrj)}"

            lastEnd = start

        bText.push text.substring( 0, lastEnd ) 
        ptri.text = bText.reverse().join("")

    resolveSources      : ->

        query  = @parsedql.toString()
        tables = @database.getTables()
        dbName = @database.name.toString()

        pos = 0
        text = query.toString()
        length = text.length


        words = []
        for match from text.matchAll /\ from\ /gi
            start = match.index + match[0].length
            qpart = text.substring( start )

            while !qpart.charAt(0).trim()
                qpart = qpart.substring 1
                start = start+1
            
            if  where = qpart.match /\ where /i
                qpart = qpart.substring 0, where.index


            #? first word must be a path
            tblPath = qpart.split( /\s+/, 1 ).at(0)
            tblName = tblPath.replace( /\`/g, '' ).split('.').pop()

            unless tbli = @database.getTable tblPath
                throw /TABLENOTFOUND/

            words.push {
                text : tblPath,
                start : start
            }
            start += tblPath.length

            @appendChild( ptrj = DBSourceTable.from tblName )
                .target = tbli

            argi = DBQueryArgument.from tblName
            argi.target = ptrj

            this.appendChild argi  

            #* is next as an table combining function
            qpart = qpart.substring tblPath.length

            trimQpart = =>
                while !qpart.charAt(0).trim()
                    qpart = qpart.substring 1
                    start = start+1

            testJoint = =>

                jnti = no

                trimQpart()

                if  jointTest = SourceJoint.test qpart
                    [ joint ] =
                    { index } = jointTest

                if  joint and !index
                    jnti = SourceJoint.from joint
                    jnti . source = ptrj
                    argi . target = jnti
                    jnti . appendChild ptrj
                    this . appendChild jnti
                    
                return unless jnti

                qpart = qpart.substring joint.length
                start = start+joint.length

                trimQpart()

                jnti

            nextWord = =>
                trimQpart()
                return if qpart.charAt(0) is ","

                word = qpart.split(/\s+/g, 1).at(0)

                return if word.match /where|group|order|limit/i
                return if word.match /using|on/i

                word

            if !jnti = testJoint()
                warn "no joint"

                if  alias = nextWord()
                    argi = DBQueryArgument.from alias
                    argi . target = ptrj
                    this . appendChild argi

                    qpart = qpart.substring alias.length
                    start = start + alias.length

                    jnti = testJoint()

            if  tblPath = nextWord()
                tblName = tblPath.replace( /\`/g, '' ).split('.').pop()

                unless tbli = @database.getTable tblPath
                    throw /TABLENOTFOUND/        

                @appendChild( ptrj = DBSourceTable.from tblName )
                    .target = tbli

                argi = DBQueryArgument.from tblName
                this . appendChild argi

                if  jnti
                    jnti.appendChild ptrj  
                    jnti.contact = ptrj  
                    argi.target = jnti

                #* is next as an table combining function

                qpart = qpart.substring tblPath.length
                start = start + tblPath.length

            if  alias = nextWord()
                argi = DBQueryArgument.from alias
                argi . target = ptrj
                this . appendChild argi

                qpart = qpart.substring alias.length
                start = start + alias.length

            if  jnti #todo has and source and contact
                  1  #todo we expecting USING or ON 
            else  1  #todo which defines joint rules

            warn qpart.startsWith "USING OR ON" #!!!!
            warn jnti 
            
            #while [,TABLE[ALIAS][JOINT[  TABLE[ALIAS][JOINT[...recursiving]]]  ]]]]  


            warn this

            return "1"

            qpstart = start
            lastEnd = 0
            for comma from ",#{qpart}".matchAll /\,/g
                start = comma.index
                fpart = qpart.substring start

                if  nextc = fpart.match /\,/ 
                    fpart = fpart.substring 0, nextc.index

                while !fpart.charAt(0).trim()
                    fpart = fpart.substring 1
                    start = start + 1
                fpart = fpart.trim()

                start = qpstart + start
                words.push { text: fpart, start: start }

        replaces = []
        for { text, start } in words.reverse()
            couple = text.split /\s+/

            continue if couple.length > 2

            [ path, alias ] = couple
            [ tblName, db = dbName ] = path.split(".").reverse()

            unless table = @database.getTable path
                throw /TABLENOTFOUND/

            @appendChild( ptrj = DBSourceTable.from tblName )
                .target = table

            replaces.push [ text, start, ptrj, tblName, alias ]

            
        lastEnd = query.length
        bText = []

        for [ tref, start, target, arg0, arg1 ] in replaces
            ptrj = DBQueryArgument.from arg0
            ptrj.target = target
            this.appendChild ptrj

            if  arg1
                ptrj = DBQueryArgument.from arg1
                ptrj.target = target
                this.appendChild ptrj

            bText.push query.substring start + tref.length, lastEnd
            bText.push "$#{Number(ptrj)}"

            lastEnd = start

        bText.push query.substring( 0, lastEnd ) 

        bText.reverse().join("")


    resolveCommands     : ( ptri ) ->
        for ptrj , i in ptri.children.filter (p) -> p instanceof DBQueryPart
            ptrj . text = @resolveCommands ptrj

        return "" unless query = ptri.text.toString()

        crExp = new RegExp [
            "inner join", "cross join", "left join", "right join",
            "using", "on", "select", "union", "create", "show",
            "insert", "update", "replace", "sum", "avg", "min", "max", "left",
            "right", "from", "where", "group by", "order by", "limit"
        ].join("|"), "gi"

        matches = []
        for match from query.matchAll crExp
            nextChar = query.charAt( match.index + match[0].length ).trim()
            continue if nextChar and nextChar.match /[a-z|0-9]/i
            matches.push { text: match[0], start: match.index }

        childs = []
        for match in matches.reverse()
            childs.push ptri = DBQueryCommand.from match.text.toUpperCase()
            query =
                query.substring( 0, match.start ) + "$#{Number ptri}" +
                query.substring( match.start + match.text.length )

        for child in childs.reverse()
            @appendChild child

        childs = off
        matches = null
        
        query

    parse               : ->
        rawquery = @sql.toPrimitive()
        rawparts = new Array
        @parsedql = "#{rawquery}"
        
        #@replaceQuotes()
        #log [ @parsedql.toString() ]

        part = @resolveQueryParts "#{rawquery}"
        
        @resolvePartPointers part
        @resolveStrings part
        
        @resolveNumbers part
        @parsedql = @resolveCommands part



        
        #@replaceSources()
        warn this
        warn @parsedql.toString()

        this

export class DBSourceRef                extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @from           : ( options = { text, type, start, end } ) ->
        ptri = @new()
        ptrc = @classPointer

        for key , val of options
            ptri[ key ] = ptrc.getProperty(key).from(val)

        ptri

export class DBQuerySource              extends OPTR.PointerLink

export class DBQuery                    extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

export class DBSelectQuery              extends OPTR.LinkedStringPointer

    getRef : ( $ref ) ->
        @target.children.reverse()[ $ref.substring 1 ]

    getTable : ( path ) ->
        @target.database.getTable path

export class DBQueryColumnsPart         extends OPTR.StringPointer

export class DBQueryFromPart            extends OPTR.LinkedStringPointer

    Object.defineProperty this::, "parent", enumerable: on, get : ->
        @getParent()

    Object.defineProperty this::, "dataView", enumerable: on, get : ->
        query = @toPrimitive()
        tableName = query.trim().split(" ", 1).at(0)
        
        if  tableName . startsWith "$"
            tableName = @parent.getRef( tableName ).toString()

        table = @parent.getTable tableName

        byteLength = 0
        byteLength += table.byteLength

        byteBuffer = new ArrayBuffer byteLength
        uInt8Array = new Uint8Array byteBuffer 

        byteOffset = 0
        uInt8Array.set table.subarray(), byteOffset

        new DataView byteBuffer

export class DBQueryWherePart           extends OPTR.StringPointer

export class DBQueryGroupByPart         extends OPTR.StringPointer

export class DBQueryOrderByPart         extends OPTR.StringPointer

export class DBQueryLimitPart           extends OPTR.StringPointer

export class DBSourceTable              extends OPTR.LinkedStringPointer

    Object.defineProperty this::, "database", enumerable: on, get : ->
        @target.parent

    Object.defineProperty this::, "label", enumerable: on, get : ->
        @toPrimitive()

    Object.defineProperty this::, "parent",
        enumerable: on, configurable: on, get : -> @getParent()

    findColumn       : ( colName ) ->
        @target.find ( ptri ) -> ptri.name.eq colName 

export class DBQueryArgument            extends OPTR.LinkedStringPointer

    Object.defineProperty this::, "parent",
        enumerable: on, configurable: on
        get : -> @getParent()

export class DBPredefinedOperation      extends OPTR.LinkedStringPointer

export class DBSourceColumn             extends OPTR.LinkedStringPointer

    Object.defineProperty this::, "table", get : ->
        @target.parent

    Object.defineProperty this::, "database", get : ->
        @table.parent

export class DBQueryCommand             extends OPTR.LinkedStringPointer

export class DBSourceTableJoin          extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

export class DBQueryPart                extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @from           : ( options = { text, type, start, end } ) ->
        ptri = @new()
        ptrc = @classPointer

        for key , val of options
            ptri[ key ] = ptrc.getProperty(key).from(val)

        ptri

    toPrimitive     : -> @text.toString()

export class DBOperation                extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @operators      : [
        "!", "+", "-", "*", "/"
    ]

    @from           : ( options = [] ) ->
        [ arg0, operator, arg1 ] = options

        ptri = @new()

        if  Array.isArray op = arg0.operate
            arg0 = DBOperation.from op
            ptri . appendChild arg0

        if  Array.isArray op = arg1.operate
            arg1 = DBOperation.from op
            ptri . appendChild arg1

        ptri.arg0 = arg0
        ptri.arg1 = arg1

        ptri 

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

    Object.defineProperty this::, "dataView", get : ->
        @subdataview()

    createColumn    : ( name, instanceOf, byteLength ) ->
        
        @appendChild Column.from {
            name, instanceOf, byteLength,
            offset : @addStride(4),
            uuid: OPTR.StringPointer.from crypto.randomUUID()
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

    @test           : ( toStringable ) ->
        toStringable.toString().match @matchRegExp

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

export class SourceJoint                extends TypedAny

    @classPointer   : OPTR.ClassPointer.from this

    @matchRegExp    :  /left join|right join|inner join|cross join/i 

    @definitions    : [ NaN, "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "CROSS JOIN" ]

    Object.defineProperty this::, "children",
        enumerable: on, get : OPTR.Pointer::filter 

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


TypedAny.definePointer "type",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Int32Number

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

DBQuery.definePointer "database",
    enumerable : on,
    isRequired : on,
    instanceOf : Database




SourceJoint.definePointer "source",
    enumerable : on,
    isRequired : on,
    instanceOf : DBSourceTable

SourceJoint.definePointer "contact",
    enumerable : on,
    isRequired : on,
    instanceOf : DBSourceTable

DBQueryPart.definePointer "text",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

DBQueryPart.definePointer "start",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

DBQueryPart.definePointer "length",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number


DBSourceRef.definePointer "link",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

DBSourceRef.definePointer "name",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

DBSourceRef.definePointer "replacedWith",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

DBOperation.definePointer "arg0",
    byteLength : 4
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

DBOperation.definePointer "arg1",
    byteLength : 4
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

DBOperation.definePointer "operator",
    byteLength : 1
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

Table.definePointer "base",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint8ArrayPointer

Table.definePointer "uuid",
    byteLength : 36
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

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

Column.definePointer "uuid",
    byteLength : 36
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer

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


