import defaults from "./0Ptr_self.js"
import { TypedArray } from "./0ptr_TypedArray.js"

BYTES_PER_HEADER            = 4

ITEMS_OF_HEADERS            = 4

BYTES_OF_HEADERS            = ITEMS_OF_HEADERS * BYTES_PER_HEADER

LOCKS_BYTEOFFSET            = 8

Object.defineProperties Object::,

    toPointer               :
        configurable        : on,
        value               : -> new RefLink().setRef( this )

Object.defineProperties Number::,

    toPointer               : value : ->

        return null unless this

        unless prototype = arguments[0]?.prototype

            protoclass = Pointer::loadHeader.call this, Pointer::HINDEX_PROTOCLASS
            prototype = Pointer::scope.get protoclass

        return new Ptr this if Ptr = prototype.constructor

        return null

Object.defineProperties DataView::,

    littleEndian        : value : new defaults.Uint8Array(defaults.Uint32Array.of(0x01).buffer)[0]

Object.defineProperties URL,

    createWorkerURL     : value : ->
        this.createObjectURL new Blob [ arguments... ].flat(),
        { type: "application/javascript", endings: "native" }

Object.defineProperties self.SharedArrayBuffer::,

    set                 : value : ->
        buffer = arguments[0].buffer ? arguments[0]
        offset = arguments[1] or 0

        new defaults.Uint8Array( this ).set(
            new defaults.Uint8Array( buffer ), offset
        ) ; this

    lock                : value : ( byteOffset = LOCKS_BYTEOFFSET ) ->
        i32 = new defaults.Int32Array this, byteOffset, 1
        Atomics.wait i32

    unlock              : value : ( byteOffset = LOCKS_BYTEOFFSET ) ->
        i32 = new defaults.Int32Array this, byteOffset, 1
        setTimeout =>
            Atomics.notify i32
        , 10

    #*   headers has 4 items:
    #* - nexti4     : memory's next index  index4(ptr) + 8 (head + data(ptr))
    #* - byteLength : data byte [not aligned] length {it's 0 when deleted} 
    #* - parent     : linked target index4
    #* - prototype  : protoclass of TypedArray.......!!!Pointer!!!!

    malloc              : value : ->
        unless arguments.length
            return @addUint32 1, ITEMS_OF_HEADERS

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


Object.defineProperties self,

    Worker              : value : class Worker extends self.Worker 

        constructor     : ->
            super arguments[0], { ...{
                type : "module"
                name : crypto.randomUUID()
            }, ...(arguments[1] or {}) }

            @onerror = -> !console.error ...arguments

    Uint8Array          : value : class Uint8Array extends TypedArray

        @protoclass     : @scopei()

    Uint32Array         : value : class Uint32Array extends TypedArray

        @protoclass     : @scopei()

    SharedArrayBuffer   : value : class SharedArrayBuffer extends self.SharedArrayBuffer

        BEGIN               : 1e5

        LENGTH              : 4

        BYTELENGTH          : 4 * 4

        MAX_BYTELENGTH      : Math.pow navigator?.deviceMemory or 2 , 11

        LITTLE_ENDIAN       : DataView::littleEndian



        
        INDEX4_CLASS        : 0

        INDEX4_BYTELENGTH   : 1

        INDEX4_BEGIN        : 2

        INDEX4_END          : 3


        constructor     : ->
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

            if  source instanceof SharedArrayBuffer
                return source.defineProperties()

            #? new SharedArrayBuffer( new ArrayBuffer(256) )
            if  source.byteLength
                byteLength = Math.max source.byteLength , byteLength
                
                return super byteLength, options
                    .initialAlloc().set source

            throw /MEMORY_COULD_NOT_INITIALIZED/

        initialAlloc    : ->
            @defineProperties()

            @orUint32 0, @BEGIN * 4
            @orUint32 1, 4
            
            this