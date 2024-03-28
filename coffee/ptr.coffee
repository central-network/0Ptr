OBJECTS = []
LENDIAN = !new Uint8Array( Float32Array.of( 1 ).buffer )[ 0 ]
INITIAL = 4 * 4

ui8 = i32 = u32 = 
u16 = dvw = f32 = null

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

export class KeyBase extends Object

    defaults    :
        
        filter  : -> arguments[0]

        extend  : Number

    constructor : ( source = {}, options = {} ) ->
        super()

        options = { ...@defaults, options }

        Object.defineProperties this,
            filter : value : options.filter
            extend : value : options.extend
            source : value : source
        
        @add source

    set         : ( label, value, proto = @extend ) ->
        return unless @filter value
        return if @hasOwnProperty value

        key = new (eval("(class #{label} extends #{proto.name} {})"))( value )

        Object.defineProperty this, label, value : key
        Object.defineProperty this, value, value : key

    add         : ( source = {}, proto = @extend ) ->
        @set label, value for label , value of source ; this

export class ByteOffset extends Number

    @isPointer  : yes

    @headLength : 0
    
    @byteLength : 0

    @byteOffset : 0

    @alignBytes : 4

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

    keyUint32       : ( offset, keyof ) -> keyof[ v = @getUint32( offset ) ] ? v

    atUint32        : ( offset )        -> u32[ @index4( offset ) ]

    

    loadUint16      : ( offset )        -> Atomics.load  u16, @index2( offset )

    addUint16       : ( offset, value ) -> Atomics.add   u16, @index2( offset ), value 

    storeUint16     : ( offset, value ) -> Atomics.store u16, @index2( offset ), value ; value 

    getUint16       : ( offset )        -> dvw.getUint16 @offset( offset ), LENDIAN 

    setUint16       : ( offset, value ) -> dvw.setUint16 @offset( offset ), value, LENDIAN ; value

    keyUint16       : ( offset, keyof ) -> keyof[ v = @getUint16( offset ) ] ? v
    
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

    
    loadPointer     : ( offset )            -> new Pointer ptr if ptr = @loadUint32 offset
    
    storePointer    : ( offset, ptr )       -> @storeUint32 offset , ptr


export class Pointer extends ByteOffset

    @headLength         : 4 * 10

    @byteLength         : 4 * 120  

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

        Atomics.or u32, 0, INITIAL

        this

    init                : ->
        this

    constructor         : ->

        #? new allocation
        unless arguments.length
            super Atomics.add u32, 0, Pointer.headLength
            Atomics.add   u32, 0, byteLength = @constructor.byteLength
            Atomics.store u32, @index4( @OFFSET_BYTELENGTH ), byteLength
            Atomics.store u32, @index4( @OFFSET_PROTOINDEX ), @constructor.protoIndex

            return @init()
                
        #? re-allocation
        unless super( arguments[0] ).instanced
            Object.setPrototypeOf this, @loadObject @OFFSET_PROTOINDEX

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

    byteLength      :
        get         : -> @loadUint32 @OFFSET_BYTELENGTH
        set         : -> @storeUint32 @OFFSET_BYTELENGTH, arguments[0]

    parent          :
        get         : -> @loadPointer @OFFSET_PARENT
        set         : -> @storePointer @OFFSET_PARENT, arguments[0]

    children        :
        get         : Pointer::filter

    [ Symbol.iterator ] :
            value       : ( proto = null, stride = @OFFSET_PARENT ) ->
                
                ptri = parseInt pointer = this
                done = done: yes, value: false

                iOffset = INITIAL / 4 
                mOffset = Atomics.load( u32, 0 ) / 4
                iStride = stride / 4
                iLength = @OFFSET_BYTELENGTH / 4
                iProtoI = @OFFSET_PROTOINDEX / 4
                hLength = Pointer.headLength / 4

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
