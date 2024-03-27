OBJECTS = []
LENDIAN = !new Uint8Array( Float32Array.of( 1 ).buffer )[ 0 ]
INITIAL = 4 * 4

ui8 = i32 = u32 = 
u16 = dvw = f32 = null

Object.defineProperties Object.getPrototypeOf(Uint8Array),
    isTypedArray : value : on

export class ByteOffset extends Number

    @isPointer  : yes

    @headLength : 0
    
    @byteLength : 0

    @byteOffset : 0

    @alignBytes : 4

    @malloc     : ( byteLength, alignBytes = 1 ) ->

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


    index1      : ( offset = 0 )    -> ( this + offset )

    index2      : ( offset = 0 )    -> ( this + offset ) / 2

    index4      : ( offset = 0 )    -> ( this + offset ) / 4

    offset      : ( offset = 0 )    -> ( this + offset )

    
    storeObject : ( object )        -> i += OBJECTS.push object if -1 is i = OBJECTS.indexOf object ; i

    loadObject  : ( i )             -> OBJECTS[i]



    loadInt32   : ( offset )        -> Atomics.load i32, @index4( offset )

    storeInt32  : ( offset, value ) -> Atomics.store i32, @index4( offset ), value ; value 

    addInt32    : ( offset, value ) -> Atomics.add i32, @index4( offset ), value 

    atInt32     : ( offset )        -> i32[ @index4( offset ) ]

    getInt32    : ( offset )        -> dvw.getInt32 @offset( offset ), LENDIAN 

    setInt32    : ( offset, value ) -> dvw.setInt32 @offset( offset ), value, LENDIAN ; value


    loadUint32  : ( offset )        -> Atomics.load u32, @index4( offset )

    storeUint32 : ( offset, value ) -> Atomics.store u32, @index4( offset ), value ; value

    addUint32   : ( offset, value ) -> Atomics.add u32, @index4( offset ), value 

    atUint32    : ( offset )        -> u32[ @index4( offset ) ]
    
    getUint32   : ( offset )        -> dvw.getUint32 @offset( offset ), LENDIAN  

    setUint32   : ( offset, value ) -> dvw.setUint32 @offset( offset ), value, LENDIAN ; value


    loadUint16  : ( offset )        -> Atomics.load u16, @index2( offset )

    storeUint16 : ( offset, value ) -> Atomics.store u16, @index2( offset ), value ; value 

    addUint16   : ( offset, value ) -> Atomics.add u16, @index2( offset ), value 

    atUint16    : ( offset )        -> u16[ @index2( offset ) ]

    getUint16   : ( offset )        -> dvw.getUint16 @offset( offset ), LENDIAN 

    setUint16   : ( offset, value ) -> dvw.setUint16 @offset( offset ), value, LENDIAN ; value


    loadUint8   : ( offset )        -> Atomics.load ui8, @index1( offset )

    storeUint8  : ( offset, value ) -> Atomics.store ui8, @index1( offset ), value ; value 

    addUint8    : ( offset, value ) -> Atomics.add ui8, @index1( offset ), value 

    getUint8    : ( offset )        -> dvw.getUint8 @offset( offset ) 

    setUint8    : ( offset, value ) -> dvw.setUint8 @offset( offset ), value ; value


    atFloat32   : ( offset )        -> f32[ @index4( offset ) ]

    getFloat32  : ( offset )        -> dvw.getFloat32 @offset( offset ), LENDIAN 

    setFloat32  : ( offset, value ) -> dvw.setFloat32 @offset( offset ), value, LENDIAN ; value  


export class Pointer extends ByteOffset

    @headLength   : 4 * 10

    @byteLength   : 4 * 120    

    @createBuffer : ->

        return this if this::buffer
        
        initial = arguments[0] or 100000
        maximum = initial * 10
        options = { initial, maximum, shared: on }

        try memory= new WebAssembly.Memory options
        catch then return @createBuffer Math.floor initial / 10
        return @setBuffer ( OBJECTS[0] = memory ).buffer

    @setBuffer    : ->
        
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

    init : -> this

    constructor : ->

        #? new allocation
        unless arguments.length
            return super Atomics.add u32, 0, Pointer.headLength
                .init this.setAllocation Atomics.add u32, 0, @byteLength =
                    this.constructor.byteLength
                    
        
        #? re-allocation
        unless arguments[1]?
            return super arguments[0]
                .usePrototype @prototype

        #? inner offset pointer
        return super arguments[0] + arguments[1]

    setAllocation : ->
        @prototype = @getProtoIndex() ; this

    usePrototype  : ->
        Object.setPrototypeOf this, arguments[0]

    getProtoIndex : ->
        unless Object.hasOwn @constructor, "protoIndex"
            Object.defineProperty @constructor, "protoIndex",
                value : -1 + OBJECTS.push Object.getPrototypeOf this
        return @constructor[ "protoIndex" ]
            
Object.defineProperties Pointer::,

    byteLength :
        get : -> @loadUint32 -4
        set : -> @storeUint32 -4, arguments[0]

    prototype  :
        get : -> OBJECTS[ @loadUint32 -8 ]
        set : -> @storeUint32 -8, arguments[0]


export default Pointer.createBuffer()
