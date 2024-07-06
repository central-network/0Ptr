export class Thread

    @uuid                   : crypto.randomUUID()

    @maxLength              : Math.pow( navigator?.deviceMemory or 2 , 11 ) / 4

    @maxByteLength          : Thread.maxLength * 4

    constructor             : ( buffer ) ->

        @offset = self.name * 1000
        @buffer = buffer

        Object.defineProperties Pointer::,
            buffer : value : buffer

        #console.log "pointer buffer settled up", buffer
        
        addEventListener "message", ( e ) =>
            arguments[0].call new Window new Thread e.data 

        #@defineProperties()

    defineIntegerAtomics    : ->

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

    defineWaitLockAtomics   : ->

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

    defineFloatAtomics      : ->

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

    defineExchangeAtomics   : ->

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

    defineDataViewModifiers : ->

        dataView = arguments[1]

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""

        littleEndian = Boolean(
            new Uint8Array(
                Uint32Array.of(1).buffer
            ).at(0)
        )
             
        for caller in [ "get", "set" ]
            caller = caller + nameSuffix
            handle = dataView[ caller ].bind dataView
            Object.defineProperty this, caller, value : ->
                handle arguments[0], littleEndian

        this

    defineTArrayModifiers   : ->

        TypedArray = arguments[0]
        constructor = TypedArray.constructor


        nameSuffix = constructor
            .name.replace /View|Array/, ""


        caller = "at#{nameSuffix}"
        Object.defineProperty this, caller, value : ->
            TypedArray[ arguments[0] ]

        caller = "setarray#{nameSuffix}"
        Object.defineProperty this, caller, value : ->
            TypedArray.set arguments[0], arguments[1]

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

    defineProperties        : ->

        ui8 = new Uint8Array        this
        ii8 = new Int8Array         this
        i16 = new Int16Array        this
        u16 = new Uint16Array       this
        u32 = new Uint32Array       this
        i32 = new Int32Array        this
        f32 = new Float32Array      this
        f64 = new Float64Array      this
        u64 = new BigUint64Array    this
        i64 = new BigInt64Array     this
        dvw = new DataView          this

        for TypedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64 ]
            @defineIntegerAtomics TypedArray

        for TypedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64 ]
            @defineExchangeAtomics TypedArray

        for TypedArray in [ i32, i64 ]
            @defineWaitLockAtomics TypedArray

        for TypedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64 ]
            @defineDataViewModifiers TypedArray, dvw

        for TypedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64 ]
            @defineTArrayModifiers TypedArray

        for arrayPairs in [ [ f32, i32 ], [ f64, i64 ] ]
            @defineFloatAtomics arrayPairs

        this
                