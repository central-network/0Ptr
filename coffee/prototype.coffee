import { TypedArray, defaults } from "./0ptr_TypedArray.js"

COUNT_OF_HEADERS            = 8

BYTES_OF_HEADERS            = 4 * COUNT_OF_HEADERS

GLOBAL_LOCKINDEX            = 8 / 4

Object.defineProperties DataView::,

    littleEndian        : value : new defaults.Uint8Array(defaults.Uint32Array.of(0x01).buffer)[0]

Object.defineProperties URL,

    createWorkerURL     : value : ->
        this.createObjectURL new Blob [ arguments... ].flat(),
        { type: "application/javascript", endings: "native" }

Object.defineProperties self.SharedArrayBuffer::,

    scope           : value : new class ScopeChannel extends BroadcastChannel

        objects             : [ new WeakRef self ]

        uuid                : self.name or= crypto.randomUUID()

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

    lock                    : value : ( index = GLOBAL_LOCKINDEX ) ->
        @waitInt32 index

    unlock                  : value : ( index = GLOBAL_LOCKINDEX ) ->
        setTimeout (=> @notifyInt32 index ), 210

    malloc                  : value : ->

        #*   headers has 4 items:
        #* - nexti4     : memory's next index  index4(ptr) + 8 (head + data(ptr))
        #* - byteLength : data byte [not aligned] length {it's 0 when deleted} 
        #* - parent     : linked target index4
        #* - prototype  : protoclass of TypedArray.......!!!Pointer!!!!

        unless arguments.length
            return @addUint32 1, COUNT_OF_HEADERS

        else if arguments[0] > 0
            return @addUint32 0, arguments[0]

        throw [ "NON_SIZED_ALLOCATION" ]

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
            super arguments[0], { ...{
                type : "module"
                name : crypto.randomUUID()
            }, ...(arguments[1] or {}) }

            @onerror = -> !console.error ...arguments

Object.defineProperty   self, "SharedArrayBuffer", value :

    class SharedArrayBuffer extends defaults.SharedArrayBuffer

        BEGIN               : 8e5 #! ITEMS: 8e5 = POINTERS: 1e5 = BYTES: 32e5

        MAX_BYTELENGTH      : Math.pow navigator?.deviceMemory or 2 , 11

        INDEX4_CLASS        : 0

        INDEX4_BYTELENGTH   : 1

        INDEX4_BEGIN        : 2

        INDEX4_END          : 3

        constructor         : ->
            if  arguments[0] instanceof SharedArrayBuffer
                return arguments[0].defineProperties()

            byteLength = SharedArrayBuffer::BEGIN * 8
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