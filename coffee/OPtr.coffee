Object.defineProperties SharedArrayBuffer::,

    LITTLE_ENDIAN           : value : new Uint8Array(Uint32Array.of(1).buffer)[0] is 1

    BYTES_PER_ELEMENT       : value : 4

    ITEMS_PER_POINTER       : value : 12

    BYTES_PER_POINTER       : value : 4 * 12

    DEFINE_INTEGER_ATOMICS  : value : on
    
    DEFINE_WAITLOCK_ATOMICS : value : on

    DEFINE_FLOAT_ATOMICS    : value : on

    DEFINE_EXCHANGE_ATOMICS : value : on
    
    DEFINE_DVIEW_MODIFIERS  : value : on

    DEFINE_TARRAY_MODIFIERS : value : on


    defineIntegerAtomics    : value : ->
        return this unless @DEFINE_INTEGER_ATOMICS

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""
            
        namePrefix = [
            "add", "sub",
            "load", "store",
            "and", "or", "xor"
        ]

        for caller in namePrefix
            Object.defineProperty this, caller + nameSuffix,
                value : Atomics[ caller ].bind Atomics, arguments[0]

        this

    defineWaitLockAtomics   : value : ->
        return this unless @DEFINE_WAITLOCK_ATOMICS

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
        return this unless @DEFINE_FLOAT_ATOMICS

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
        return this unless @DEFINE_EXCHANGE_ATOMICS

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
        return this unless @DEFINE_DVIEW_MODIFIERS

        dataView = arguments[1]

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""
            
        for caller in [ "get", "set" ]
            caller = caller + nameSuffix
            handle = dataView[ caller ].bind dataView
            Object.defineProperty this, caller, value : ->
                handle arguments[0], @LITTLE_ENDIAN

        this

    defineTArrayModifiers   : value : ->
        return this unless @DEFINE_TARRAY_MODIFIERS

        nameSuffix = arguments[0]
            .constructor.name
            .replace /View|Array/, ""

        caller = "at#{nameSuffix}"
        Object.defineProperty this, caller, value : ->
            typedArray[ arguments[0] ]

        caller = "setarray#{nameSuffix}"
        Object.defineProperty this, caller, value : ->
            typedArray.set arguments[0], arguments[1]

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
            Object.defineProperty this, caller + nameSuffix,
                value : arguments[0][ caller ].bind arguments[0]


    init                    : value : ->

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

        for typedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64 ]
            this.defineIntegerAtomics.call this, typedArray

        for typedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64 ]
            this.defineExchangeAtomics.call this, typedArray

        for typedArray in [ i32, i64 ]
            this.defineWaitLockAtomics.call this, typedArray

        for typedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64 ]
            this.defineDataViewModifiers.call this, typedArray, dvw

        for typedArray in [ ui8, ii8, u16, i16, u32, i32, u64, i64, f32, f64 ]
            this.defineTArrayModifiers.call this, typedArray

        for arrayPairs in [ [ f32, i32 ], [ f64, i64 ] ]
            this.defineFloatAtomics.call this, arrayPairs

        @grow @BYTES_PER_POINTER unless ui8.length

        unless @orUint32 0, @BYTES_PER_POINTER
            @storeUint32 1, @BYTES_PER_POINTER / 4

        console.log this

        this
    
    get     : value : ( object ) ->
        object.__ptr__ ?= @malloc()

    malloc  : value : ->
        @addUint32 1, @ITEMS_PER_POINTER
        @addUint32 0, @BYTES_PER_POINTER

Object.defineProperties Object::,

    sab :
        configurable : on
        value : new SharedArrayBuffer(0 , {
                maxByteLength : Math.pow( 
                    navigator?.deviceMemory or 1, 11
                )
            }
        ).init( self )

    ptr : value : ->
        get : @sab.get( this )
        set : @sab.get( "this" )
        tet : @sab.get( [this] )


Object.defineProperties Number::,



    buffer :
        get : -> @sab
        set : ->

    ptr    :
        value :  ->

