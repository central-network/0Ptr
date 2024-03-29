try [
    #? These are global for Window and proxy container for Threads
    OBJECTS = new Array()

    #? endianness is important because of DataView operations are 
    #? using Big-Endian always if we don't supply as last argument
    #? but TypedArray and Atomics operations are using navigator's
    #? endianness and there is no possibility to change   
    #? On the other hand we are using all of these three operators 
    #? and we need to supply client's "endianness" for DataView to   
    #? be sure all of write/read operations will same results even   
    #? client's endianness is not Big-Endian So keep far away.. GO    
    LENDIAN = 0x3f is new Uint8Array(Float32Array.of(1).buffer)[ 0x3 ]

    ui8 = i32 =     #? make visible 
    u32 = u16 =     #? this arrays
    dvw = f32 = 0x0 #? over scope

    #? first 16 bytes reserved for malloc
    OFFSET_OF_MEMORY = 0x04 *  4
    
    #? every malloc has at least 40 bytes
    BYTES_PER_HEADER = 0x04 * 10
]

Object.getPrototypeOf( Uint8Array )::isTypedArray =
    Object.getPrototypeOf( Uint8Array ).isTypedArray = yes

Object.defineProperties Object.getPrototypeOf( Uint8Array ),
    ofInt8      : value : -> new this    Int8Array.of( arguments... ).buffer
    ofUint8     : value : -> new this   Uint8Array.of( arguments... ).buffer
    ofInt16     : value : -> new this   Int16Array.of( arguments... ).buffer
    ofUint16    : value : -> new this  Uint16Array.of( arguments... ).buffer
    ofUint32    : value : -> new this  Uint32Array.of( arguments... ).buffer
    ofInt32     : value : -> new this   Int32Array.of( arguments... ).buffer
    ofFloat32   : value : -> new this Float32Array.of( arguments... ).buffer
    ofFloat64   : value : -> new this Float64Array.of( arguments... ).buffer

export class KeyBase    extends Object

    @filter     : Symbol.for "filter"

    @extend     : Symbol.for "extend"

    @encode     : Symbol.for "encode"

    defaults    :
        
        filter  : -> arguments[0]

        extend  : Number
        
        encode  : -> [ 0, ...arguments[0] ].reduce (a, b) -> a + b.charCodeAt()

    constructor : ( source = {}, options = {} ) ->
        super().configure( options ).add( source )

    configure   : ( options ) ->
        for option , value of @defaults

            symbol = @constructor[ option ]
            value ?= @constructor.defaults[ option ]
            
            Object.defineProperty @, symbol, { value }
        this

    generate    : ( source = {} ) ->
        Object.defineProperty(
            @set( label , @[ KeyBase.encode ] key ),
            key , value : @[ label ]
        ) for label , key of source ; return this

    set         : ( label, value, proto = @[ KeyBase.extend ] ) ->
        return unless @[ KeyBase.filter ] value
        return if @hasOwnProperty value

        key = new (eval("(class #{label} extends #{proto.name} {})"))( value )

        Object.defineProperty this, label, value : key
        Object.defineProperty this, value, value : key

        this

    add         : ( source, proto = @[ KeyBase.Extend ] ) ->
        @set label, value for label , value of source ; this

export class ByteOffset extends Number

    @isPointer  : yes

    @byteLength : 0

    @byteOffset : 0

    @alignBytes : 4

    init            : -> this

    @malloc         : ( byteLength , alignBytes = 1 ) ->

        if  byteLength . isPointer
            alignBytes = byteLength.alignBytes
            byteLength = byteLength.byteOffset

        if  byteLength . isTypedArray
            perElement = byteLength.BYTES_PER_ELEMENT
            byteLength = alignBytes * byteLength.BYTES_PER_ELEMENT
            alignBytes = perElement

        if  mod = @byteOffset % alignBytes
            mod = alignBytes - mod

        byteOffset = @byteOffset + mod
        @byteOffset += mod + byteLength

        return byteOffset

    constructor         : ->

        #? new allocation
        unless arguments.length
            super Atomics.add u32, 0, BYTES_PER_HEADER
            
            Atomics.add   u32, 0, byteLength = @constructor.byteLength
            Atomics.store u32, @index4( @OFFSET_BYTELENGTH ), byteLength
            Atomics.store u32, @index4( @OFFSET_PROTOINDEX ), @constructor.protoIndex

        #? re-alocation
        else
            ptri = 0 ; for i in arguments then ptri += i

            if !super( ptri ).instanced
                Object.setPrototypeOf this, @loadObject @OFFSET_PROTOINDEX
        
        this.init arguments...

    @register       : ->
        for Ptr in [ arguments... ]
            continue if Object.hasOwn Ptr, "protoIndex"
            Object.defineProperty Ptr, "protoIndex", value : @store Ptr::
            Object.defineProperty Ptr::, "instanced", value : yes
        this
            
    @store          : ( object )        ->
        if -1 is i = OBJECTS.indexOf object
            i += OBJECTS.push object
        ; i


    index2          : ( offset = 0 )    -> ( this + offset ) / 2

    index4          : ( offset = 0 )    -> ( this + offset ) / 4

    offset          : ( offset = 0 )    -> ( this + offset )
    

    loadInt32       : ( offset )        -> Atomics.load  i32, @index4( offset )

    addInt32        : ( offset, value ) -> Atomics.add   i32, @index4( offset ), value 

    storeInt32      : ( offset, value ) -> Atomics.store i32, @index4( offset ), value ; value 

    getInt32        : ( offset )        -> dvw.getInt32 @offset( offset ), LENDIAN 

    setInt32        : ( offset, value ) -> dvw.setInt32 @offset( offset ), value, LENDIAN ; value

    atInt32         : ( offset )        -> i32[ @index4( offset ) ]



    loadUint32      : ( offset )        -> Atomics.load  u32, @index4( offset )

    storeUint32     : ( offset, value ) -> Atomics.store u32, @index4( offset ), value ; value

    addUint32       : ( offset, value ) -> Atomics.add   u32, @index4( offset ), value 
    
    getUint32       : ( offset )        -> dvw.getUint32 @offset( offset ), LENDIAN  

    setUint32       : ( offset, value ) -> dvw.setUint32 @offset( offset ), value, LENDIAN ; value

    keyUint32       : ( offset, keyof ) -> keyof[ @loadUint32 offset ] ? @loadUint32 offset

    atUint32        : ( offset )        -> u32[ @index4( offset ) ]

    

    loadUint16      : ( offset )        -> Atomics.load  u16, @index2( offset )

    addUint16       : ( offset, value ) -> Atomics.add   u16, @index2( offset ), value 

    storeUint16     : ( offset, value ) -> Atomics.store u16, @index2( offset ), value ; value 

    getUint16       : ( offset )        -> dvw.getUint16 @offset( offset ), LENDIAN 

    setUint16       : ( offset, value ) -> dvw.setUint16 @offset( offset ), value, LENDIAN ; value

    keyUint16       : ( offset, keyof ) -> keyof[ v = @loadUint16( offset ) ] ? v
    
    atUint16        : ( offset )        -> u16[ @index2 offset ]



    loadUint8       : ( offset )        -> Atomics.load  ui8, @offset( offset )

    addUint8        : ( offset, value ) -> Atomics.add   ui8, @offset( offset ), value 

    storeUint8      : ( offset, value ) -> Atomics.store ui8, @offset( offset ), value ; value 

    getUint8        : ( offset )        -> dvw.getUint8 @offset( offset ) 

    setUint8        : ( offset, value ) -> dvw.setUint8 @offset( offset ), value ; value

    atUint8         : ( offset )        -> ui8[ @offset offset ]


    
    loadFloat32     : ( offset )        -> Float32Array.ofUint32( @loadUint32 offset )[0]

    addUFloat32     : ( offset, value ) -> @addUint32   offset, Uint32Array.ofFloat32( value )[0]

    storeFloat32    : ( offset, value ) -> @storeUint32 offset, Uint32Array.ofFloat32( value )[0]

    setFloat32      : ( offset, value ) -> dvw.setFloat32 @offset( offset ), value, LENDIAN ; value  

    getFloat32      : ( offset )        -> dvw.getFloat32 @offset( offset ), LENDIAN 

    atFloat32       : ( offset )        -> f32[ @index4 offset ]


    loadObject      : ( offset )            -> OBJECTS[ i ] if i = @loadUint32 offset
    
    storeObject     : ( offset, object )    -> @storeUint32 offset , ByteOffset.store object ; this

    
    loadPointer     : ( offset )            ->
        return unless ptri = Atomics.load u32, @index4( offset )
        return unless obji = Atomics.load u32, ( ptri + @OFFSET_PROTOINDEX ) / 4
        new OBJECTS[  obji  ].constructor ptri
    
    storePointer    : ( offset, ptr )       ->
        @storeUint32 offset , ptr

export class Pointer    extends ByteOffset

    OFFSET_BYTELENGTH   : -4 * 1

    OFFSET_PROTOINDEX   : -4 * 2

    OFFSET_PARENT       : -4 * 3

    @createBuffer       : ->

        return this if this::buffer
        
        initial = arguments[0] or 100000
        maximum = initial * 10
        options = { initial, maximum, shared: on }

        try memory= new WebAssembly.Memory options
        catch then return @createBuffer Math.floor initial / 10
        return @setBuffer ( OBJECTS[0] = memory ).buffer

    @setBuffer          : ->
        
        sab = arguments[0]
        
        dvw = new DataView sab
        ui8 = new Uint8Array sab
        i32 = new Int32Array sab
        u32 = new Uint32Array sab
        u16 = new Uint16Array sab
        f32 = new Float32Array sab

        Object.defineProperty ByteOffset::, "buffer", { value : sab }

        document.onclick = -> console.log OBJECTS

        Atomics.or u32, 0, OFFSET_OF_MEMORY

        this

    add                 : ->
        arguments[0].parent = this

    attach              : ->
        @parent = arguments[0] ; @

    forEach             : ( handle ) ->
        iterator = @[ Symbol.iterator ]()
        while ptri = iterator . next() . value
            handle.call this, new Pointer ptri
        this

    filter              : ( proto, test ) ->
        children = []
        iterator = @[ Symbol.iterator ]( proto )

        while ptri = iterator.next().value
            ptr = new Pointer ptri
            children.push ptr if !test or test ptr
        children

    find                : ( proto, test ) ->
        iterator = @[ Symbol.iterator ]( proto )
        while ptri = iterator.next().value
            ptr = new Pointer ptri
            return ptr if !test or test ptr
        null

Object.defineProperties Pointer::,

    byteLength          :
        get         : -> @loadUint32 @OFFSET_BYTELENGTH
        set         : -> @storeUint32 @OFFSET_BYTELENGTH, arguments[0]

    parent              :
        get         : -> @loadPointer @OFFSET_PARENT
        set         : -> @storePointer @OFFSET_PARENT, arguments[0]

    children            :
        get         : Pointer::filter

    [ Symbol.iterator ] :
            value       : ( proto = null, stride = @OFFSET_PARENT ) ->
                
                ptri = parseInt pointer = this
                done = done: yes, value: false

                iOffset = OFFSET_OF_MEMORY / 4 
                mOffset = Atomics.load( u32, 0 ) / 4
                iStride = stride / 4
                iLength = @OFFSET_BYTELENGTH / 4
                iProtoI = @OFFSET_PROTOINDEX / 4
                hLength = BYTES_PER_HEADER / 4

                return next : ->
                    while  iOffset < mOffset
                        byteLength = Atomics.load u32, iOffset + iLength
                        unless ptri- Atomics.load u32, iOffset + iStride
                            if !proto or proto.protoIndex is Atomics.load u32, iOffset + iProtoI
                                ptr = iOffset * 4
                        iOffset = iOffset + hLength + byteLength / 4
                        return done : no, value : ptr if ptr
                    return done

export default Pointer.createBuffer()




