import KEYOF from "./0ptr_keyof.js"
import * as Modules from "./0ptr_TypedArray.js"
import { TypedArray, defaults } from "./0ptr_TypedArray.js"

COUNT_OF_HEADERS            = 16

BYTES_OF_HEADERS            = 4 * COUNT_OF_HEADERS

ALGIN_BYTELENGTH            = 8

GLOBAL_LOCKINDEX            = 2


HEADERS_HINDEX              = 0

HINDEX_BEGIN                = HEADERS_HINDEX++
    
HINDEX_END                  = HEADERS_HINDEX++

HINDEX_LENGTH               = HEADERS_HINDEX++

HINDEX_PROTOCLASS           = HEADERS_HINDEX++

HINDEX_RESOLV_CID           = HEADERS_HINDEX++

HINDEX_RESOLV_PTR           = HEADERS_HINDEX++

HINDEX_BYTELENGTH           = HEADERS_HINDEX++

HINDEX_BYTEOFFSET           = HEADERS_HINDEX++

HINDEX_ITERATOR_I           = HEADERS_HINDEX++


Object.defineProperties DataView::,

    littleEndian        : value :
        new defaults.Uint8Array(defaults.Uint32Array.of(0x01).buffer)[0]

Object.defineProperties URL, 

    createWorkerURL     : value : ->

        parts = [ arguments... ].flat().map ( part ) ->
            if  /string/.test typeof part
                return part.trim().split(/\; /g).join(";\n")
            part

        this.createObjectURL new Blob parts,
        { type: "application/javascript" }

Object.defineProperties self, delay :
    value : -> new Promise ( done ) =>
        setTimeout done, arguments[0] or 1000

Object.defineProperties self. SharedArrayBuffer::,

    COUNT_OF_HEADERS        : value : COUNT_OF_HEADERS

    scope           : value : new class ScopeChannel extends BroadcastChannel

        objects             : [ new WeakRef self ]

        uuid                : self.name or= "processor"

        map                 : new WeakMap()

        load                : ( index ) ->
            return null unless index

            unless ref = @objects[ index ]
                console.log "need proxy", index
                @request { index }
                memory.lock()
                ref = new WeakRef {done: 2}

            return ref.deref()

        store               : ( object ) ->
            unless @map.has object
                @map.set object , index = @objects.length
                @objects[ index ] = new WeakRef object
                return index
           
            for ref, index in @objects
                return index if ref.deref() is object

            throw [ "UNEXPECTED_STORE", ...arguments ]
    
        constructor         : -> super( "0ptr_sc" ).listen()

        listen              : -> @onmessage = @message.bind this

        message             : ({ data, ports }) ->
            if  data.to
                @onreply data if data.to is @uuid
            
            else
                @onrequest data

        onreply             : ( res ) ->
            console.log "got res:", res, @uuid, @objects
            
        onrequest           : ( req ) ->
            console.log "got req:", req, @uuid, @objects
            
            { port1, port2  } = new MessageChannel()
            
            @reply req, { done: 222 }, [ port1 ]

            memory.unlock()

        reply               : ( req, res ) ->
            @postMessage {
                ...res, from: @uuid, to: req.from
            }, arguments[1]

        request             : ( req ) ->
            @postMessage {
                ...req, from: @uuid
            }, arguments[1]

    loadObject              : value : ( ptri, index ) ->
        @scope.load @loadUint32 @getBegin( ptri ) + index

    storeObject             : value : ( ptri, index, object ) ->
        @storeUint32 @getBegin( ptri ) + index, @scope.store object ; object

    set                     : value : ->
        buffer = arguments[0].buffer ? arguments[0]
        offset = arguments[1] or 0

        new defaults.Uint8Array( this ).set(
            new defaults.Uint8Array( buffer ), offset
        ) ; this

    lock                    : value : ( ptri = GLOBAL_LOCKINDEX ) ->
        @waitInt32 ptri, arguments[1]

    unlock                  : value : ( ptri = GLOBAL_LOCKINDEX ) ->
        return @notifyInt32 ptri, arguments[1]

        #console.warn name, "unlocking:", {ptri}
        #setTimeout =>
        #    @notifyInt32 ptri + GLOBAL_LOCKINDEX, arguments[1]
        #, 2220

    # mark          if arguments[0] 
    # then alloc in     #? data block
    # else alloc in #* headers
    malloc                  : value : ->

        unless arguments.length
            return @addUint32 1, COUNT_OF_HEADERS

        if  ptri = parseInt ptr = arguments[0]            
            Ptri = ptr.constructor

            if  byteLength = Ptri.byteLength

                if  mod = byteLength % ALGIN_BYTELENGTH # align 8 bytes
                    byteLength += ALGIN_BYTELENGTH - mod

                byteOffset = @addUint32 0, byteLength
                perElement = Ptri.TypedArray.BYTES_PER_ELEMENT

                begin = byteOffset / perElement
                length = byteLength / perElement

                @storeUint32 ptri + HINDEX_BEGIN      , begin
                @storeUint32 ptri + HINDEX_LENGTH     , length
                @storeUint32 ptri + HINDEX_END        , begin + length
                @storeUint32 ptri + HINDEX_BYTEOFFSET , byteOffset
                @storeUint32 ptri + HINDEX_BYTELENGTH , byteLength
                @storeUint32 ptri + HINDEX_PROTOCLASS , @scope.store Ptri::

                console.warn {
                    HINDEX_BEGIN: @loadUint32 ptri + HINDEX_BEGIN
                    HINDEX_LENGTH: @loadUint32 ptri + HINDEX_LENGTH
                    HINDEX_END: @loadUint32 ptri + HINDEX_END
                    HINDEX_BYTEOFFSET: @loadUint32 ptri + HINDEX_BYTEOFFSET
                    HINDEX_BYTELENGTH: @loadUint32 ptri + HINDEX_BYTELENGTH
                    HINDEX_PROTOCLASS: @loadUint32 ptri + HINDEX_PROTOCLASS 
                }
                
        this

    storeResolv             : value : ( call , ptri ) ->
        @storeUint32 parseInt(ptri) + HINDEX_RESOLV_CID , call 

    loadResolv              : value : ( call ) ->
        @find HINDEX_RESOLV_CID, call

    resolvCall              : value : ->
        try throw new Error()
        catch e then stack = e.stack
        
        call = null
        "#{stack}".split(/\n| at /).slice(3).filter(isNaN).reverse().map( ( text, i, lines ) ->
            [ line, col ]   = text.replace(/\)/g, '').split(':').slice(-2).map(Number);
            urlEnd          = text.lastIndexOf( [ line, col ].join(':') ) - 1;
            urlBegin        = text.lastIndexOf( ' ' ) + 1;
            url             = text.substring( Math.max(urlBegin, text.indexOf("(")+1), urlEnd );
            scheme          = url.split(/\:/, 1).at(0);
            
            # todo make it faster
            urlid           = scheme.startsWith('http') and url.split("").map( (c) -> c.charCodeAt() ).reduce( (a, b) -> a + b || 0 ) || 0;
            call            = lines.call = (lines.call or 0) + (urlid + line) + i;
        )

        return call        

    find                    : value : ->
        [ index = 0, value ] = arguments    
        ( offset = COUNT_OF_HEADERS + index )
        
        max = @loadUint32 1
        value = parseInt value

        while offset < max
            if  value is @loadUint32 offset
                return offset - index                
            offset += COUNT_OF_HEADERS

        null

    defineProperties        : value : ->

        ui8 = new defaults.Uint8Array        this
        ii8 = new defaults.Int8Array         this
        i16 = new defaults.Int16Array        this
        u16 = new defaults.Uint16Array       this
        u32 = new defaults.Uint32Array       this
        i32 = new defaults.Int32Array        this
        f32 = new defaults.Float32Array      this
        f64 = new defaults.Float64Array      this
        u64 = new defaults.BigUint64Array    this
        i64 = new defaults.BigInt64Array     this
        dvw = new defaults.DataView          this

        for view in [ ui8, ii8, u16, i16, u32, i32, u64, i64 ]
            @defineIntegerAtomics view

        for view in [ ui8, ii8, u16, i16, u32, i32, u64, i64 ]
            @defineExchangeAtomics view

        for view in [ i32, i64 ]
            @defineWaitLockAtomics view

        for view in [ ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64 ]
            @defineDataViewModifiers view, dvw

        for view in [ ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64 ]
            @defineTArrayModifiers view

        for pair in [ [ f32, i32 ], [ f64, i64 ] ]
            @defineFloatAtomics pair

        return this

    defineIntegerAtomics    : value : ->

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""

            
        namePrefix = [
            "sub", "load", "store",
            "and", "or", "xor", "add"
        ]

        for caller in namePrefix
            Object.defineProperty this, caller + nameSuffix,
                value : Atomics[ caller ].bind Atomics, arguments[0]

        this

    defineWaitLockAtomics   : value : ->

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""

        namePrefix = [
            "wait", "notify", "waitAsync"
        ]

        for caller in namePrefix
            Object.defineProperty this, caller + nameSuffix,
                value : Atomics[ caller ].bind Atomics, arguments[0]

        this

    defineFloatAtomics      : value : ->

        [ floatArray , uIntArray ] = arguments[0]
        [ FloatArray , UintArray ] =
            [   floatArray.constructor,
                uIntArray .constructor   ]

        nameSuffix = floatArray
            .constructor.name
            .replace /View|Array/, ""
            
        namePrefix = [
            "add", "sub", "store", "and", "or", "xor"
        ]

        for caller in namePrefix
            handle = Atomics[ caller ].bind Atomics, uIntArray

            Object.defineProperty this, caller + nameSuffix,
                value : -> handle arguments[0],
                    new UintArray( FloatArray.of( arguments[1] ).buffer )[0]
        
        namePrefix = [
            "load"
        ]

        for caller in namePrefix
            handle = Atomics[ caller ].bind Atomics, uIntArray

            Object.defineProperty this, caller + nameSuffix,
                value : ->
                    new FloatArray( UintArray.of( handle arguments[0] ).buffer )[0]
        
        this

    defineExchangeAtomics   : value : ->

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""
            
        namePrefix = [
            "exchange", "compareExchange"
        ]

        for caller in namePrefix
            Object.defineProperty this, caller + nameSuffix,
                value : Atomics[ caller ].bind Atomics, arguments[0]

        this

    defineDataViewModifiers : value : ->

        dataView = arguments[1]

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""

        littleEndian = Boolean(
            new defaults.Uint8Array(
                defaults.Uint32Array.of(1).buffer
            ).at(0)
        )
            
        for caller in [ "get", "set" ]
            caller = caller + nameSuffix
            handle = dataView[ caller ].bind dataView
            Object.defineProperty this, caller, value : ->
                handle arguments[0], littleEndian

        this

    defineTArrayModifiers   : value : ->

        view = arguments[0]
        constructor = view.constructor

        nameSuffix = constructor
            .name.replace /View|Array/, ""

        caller = "at#{nameSuffix}"
        Object.defineProperty this, caller, value : ->
            view[ arguments[0] ]

        caller = "setarray#{nameSuffix}"
        Object.defineProperty this, caller, value : ->
            view.set arguments[0], arguments[1]

        modifiers = [
            "subarray", "fill", "slice", "copyWithin",
            "entries", "every", "filter", "find",
            "findIndex", "findLast", "findLastIndex",
            "forEach", "includes", "indexOf",
            "join", "keys", "lastIndexOf", "map",
            "reduce", "reduceRight", "reverse",
            "some", "sort", "values", "with"
        ]

        for caller in modifiers

            handle = caller + nameSuffix

            Object.defineProperty this, handle,
                value : arguments[0][ caller ].bind arguments[0]

            continue if Object.hasOwn constructor, caller

            Object.defineProperty constructor, caller,
                value : handle

        view

Object.defineProperty   self, "Worker", value :

    class Worker extends self.Worker 
        constructor     : ->
            super arguments[0], {
                type : "module"
                name : arguments[1] ? "\x1b[93mprocessor\x1b[0m"
            }

            @onerror = -> !console.error ...arguments

Object.defineProperty   self, "SharedArrayBuffer", value :

    class SharedArrayBuffer extends defaults.SharedArrayBuffer

        BEGIN               : 8e5 #! ITEMS: 8e5 = POINTERS: 1e5 = BYTES: 32e5

        MAX_BYTELENGTH      : Math.pow navigator?.deviceMemory or 2 , 11

        INDEX4_CLASS        : 0

        INDEX4_BYTELENGTH   : 1

        INDEX4_BEGIN        : 2

        INDEX4_END          : 3

        INDEX4_RESVU32      : 4

        constructor         : ->
            if  arguments[0] instanceof SharedArrayBuffer
                return arguments[0].defineProperties()

            byteLength = SharedArrayBuffer::BEGIN * COUNT_OF_HEADERS
            options = maxByteLength : SharedArrayBuffer::MAX_BYTELENGTH

            #? new SharedArrayBuffer()
            unless arguments.length
                return super byteLength, options
                    .initialAlloc()

            #? new SharedArrayBuffer( 256 )
            if  Number.isInteger source = arguments[0]
                byteLength = Math.max source, byteLength
                return super byteLength, arguments[1] or options
                    .initialAlloc()

            #? new SharedArrayBuffer( [2, 41, ...N ] )
            if  self.Array.isArray source
                source = defaults.Uint8Array.from source

            #? new SharedArrayBuffer( new ArrayBuffer(256) )
            if  source.byteLength
                byteLength = Math.max source.byteLength , byteLength
                
                return super byteLength, options
                    .initialAlloc().set source

            throw /MEMORY_COULD_NOT_INITIALIZED/

        initialAlloc        : ->
            @defineProperties()

            @orUint32 0, @BEGIN * 4
            # byte offset for objects

            @orUint32 1, COUNT_OF_HEADERS
            # index offset for headers
            
            this

        getHeaders          : ( ptri ) ->
            @subarrayUint32 this , this + COUNT_OF_HEADERS

        getProtoClass       : ( ptri ) ->
            @loadUint32  ptri + @INDEX4_CLASS

        loadResvUint32      : ( ptri, index = 0 ) ->
            @loadUint32  ptri + @INDEX4_RESVU32 + index

        storeResvUint32     : ( ptri, index = 0, value ) ->
            @storeUint32  ptri + @INDEX4_RESVU32 + index, value

        getByteLength       : ( ptri ) ->
            @loadUint32  ptri + @INDEX4_BYTELENGTH
    
        getBegin            : ( ptri ) ->
            @loadUint32  ptri + @INDEX4_BEGIN
    
        getEnd              : ( ptri ) ->
            @loadUint32  ptri + @INDEX4_END
    
        setProtoClass       : ( ptri, uInt32 ) ->
            @storeUint32 ptri + @INDEX4_CLASS, uInt32 ; ptri

        setByteLength       : ( ptri, uInt32 ) ->
            @storeUint32 ptri + @INDEX4_BYTELENGTH, uInt32 ; ptri
        
        setBegin            : ( ptri, uInt32 ) ->
            @storeUint32 ptri + @INDEX4_BEGIN, uInt32 ; ptri

        setEnd              : ( ptri, uInt32 ) ->
            @storeUint32 ptri + @INDEX4_END, uInt32 ; ptri