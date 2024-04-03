if  document?
    Object.defineProperties Node,
        byteLength              : value : 4 * 64

Object.defineProperties SharedArrayBuffer::,

    SYMBOL_0PTR             : value : Symbol "0Ptr"

    LITTLE_ENDIAN           : value : new Uint8Array(Uint32Array.of(1).buffer)[0] is 1

    BYTES_PER_ELEMENT       : value : 4

    ITEMS_PER_POINTER       : value : 12

    BEGIN                   : value : 12

    BYTES_PER_POINTER       : value : 4 * 12

    
    INDEX_OFFSET        : value : 0

    INDEX_LENGTH            : value : 1

    INDEX_COUNT             : value : 2   
    
    INDEX_NEXT                 : value : 3


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
            "sub", "load", "store",
            "and", "or", "xor", "add"
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


    scope                   : value : new Object

    init                    : value : ->

        Object.defineProperties this,
            [ "#thread" ] : value : arguments[0]

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


        @grow @BEGIN * @BYTES_PER_ELEMENT unless ui8.length
        unless @orUint32 @INDEX_OFFSET, @BEGIN * @BYTES_PER_ELEMENT
            @length = @BEGIN

        self.base = this
    
    get                     : value : ( ptri ) ->
        @scope[ "#{ptri}" ]?.deref()

    set                     : value : ( object, ptri ) ->
        Object.defineProperty @scope, ptri,
            value : new WeakRef object
        ptri

    add                     : value : ( object ) ->
        unless Object.hasOwn object, @SYMBOL_0PTR
            Object.defineProperty object, @SYMBOL_0PTR,
                value : ptri = @malloc object
            @set object, ptri
        @get object[ @SYMBOL_0PTR ]

    find                    : value : ->
        for ptri in Object.getOwnPropertyNames @scope
            object = @scope[ ptri ].deref()
            return object if object is arguments[0]
        null

    malloc                  : value : ->
        
        protoClass = arguments[0].constructor
        byteLength = @BYTES_PER_POINTER

        if  protoClass?.  byteLength 
            byteLength += protoClass.byteLength

        if  @byteLength < byteOffset = byteLength + @byteOffset 
            byteOffset += @BYTES_PER_ELEMENT * 4096

            if  @maxByteLength < byteOffset
                throw [ "MAX_GROWABLE_MEMORY_LENGTH_EXCEED", @ ]

            @grow byteOffset

        @addUint32 @INDEX_COUNT, 1

        length = byteLength / 4
        index4 = @addUint32 @INDEX_LENGTH, length
        offset = @addUint32 @INDEX_OFFSET, byteLength

        @storeUint32 index4 + 0, length 
        @storeUint32 index4 + 2, byteLength
        @storeUint32 index4 + 3, length - @ITEMS_PER_POINTER
        @storeUint32 index4 + 4, byteLength - @BYTES_PER_POINTER

        index4

    byteOffset              :
                    get     : -> @loadUint32  @INDEX_OFFSET
                    set     : -> @storeUint32 @INDEX_OFFSET, arguments[0]

    #? sab length
    length                  :
                    get     : -> @loadUint32  @INDEX_LENGTH
                    set     : -> @storeUint32 @INDEX_LENGTH, arguments[0]

    #? scope length
    count                   :
                    get     : -> @loadUint32  @INDEX_COUNT
                    set     : -> @storeUint32 @INDEX_COUNT, arguments[0]

    #? iteration index
    index                   :
                    get     : ->
                        index = @loadUint32 @INDEX_NEXT
                        length = @loadUint32 index 
                        @addUint32 @INDEX_NEXT, length
                        index

                    set     : ->
                        @storeUint32 @INDEX_NEXT, @BEGIN + arguments[0]

    reset                   :
                    value   : ->
                        @storeUint32 @INDEX_NEXT, @BEGIN ; this

    
Object.defineProperties SharedArrayBuffer::,

    [ Symbol.iterator ]     : value : ->
        next : ->
            unless value = @get @index
                return done : on
            return { value }
        .bind @reset()
        
Object.defineProperties Object::,

    sab :
        configurable : on
        value : new SharedArrayBuffer(
            0 , maxByteLength : Math.pow(
                    navigator?.deviceMemory or 1, 11 )
        ).init window? && "window" or "worker"

    ptr : value : ->
        res =
            get : @sab.add( this )
            set : @sab.add( window )
            tet : @sab.add( new Set() )
            a   : @sab.find( "this" )
            det : @sab.add( ( -> 1 ) )
            def : @sab.add( window )

        console.log res

        for di from @sab
            console.log "iteri", di

            
        res