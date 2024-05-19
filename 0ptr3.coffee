#* hello world

GL2KEY = Object.keys     WebGL2RenderingContext
GL2VAL = Object.values   WebGL2RenderingContext
GL2NUM = new Object

{ log, warn, error, table, debug, info } = console

sab = new SharedArrayBuffer 1e7 * 8
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
f32 = new Float32Array sab
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
BPE = 4

PTR_LENGTH          = 16
PTR_BYTELENGTH      = BPE * PTR_LENGTH
PTR_CLASSINDEX      = 0 * BPE

HAS_BYTEOFFSET      = 1 * BPE
HAS_BYTELENGTH      = 2 * BPE
HAS_LENGTH          = 3 * BPE

Atomics.store       u32, 0, PTR_BYTELENGTH
Atomics.store       u32, 1, 2000 * PTR_BYTELENGTH
Atomics.store       u32, 2, 0

warn storage        = new ( class Storage extends Array

    constructor         : -> super( arguments... )[0] ?= null
    store               : ( any, bytes = 2 ) ->
        if  -1 is i = @indexOf any
            
            i = Math.pow 0xff, bytes-1
            i = 1 + i while @[ i ]

            if  i > Math.pow( 0xff, bytes )
                throw /EXCEED_STORAGE/
            else this[ i ] = any

        if  Math.pow( 0xff, bytes ) <= i
            @splice i, 1
            throw /EXCEED_STORAGE/

        i
    storeForUint8       : ( any ) -> @store any, 1
    storeForUint16      : ( any ) -> @store any, 2
    storeForUint32      : ( any ) -> @store any, 4
    storeForUint64      : ( any ) -> @store any, 8

) Number

hasOwn = (o, v) ->
    Object.hasOwn( (c = o.constructor)::, v) and c or
    Object.hasOwn( (o), v) and o
assign = Object.assign
define = ( object, props, desc ) ->

    if !desc and !props

        break for Class, Super of object

        document.head.append( assign(
            el = document.createElement( "script" ), { innerText :
                "self['#{Class}'] = class #{Class} extends #{Super.name} {}"
            })
        )

        Object.defineProperty self[ Class ], "classIndex", value :
            storage.storeForUint8 self[ Class ]

        el.remove()

    else if !desc
        for prop, desc of props

            if !desc.get and !desc.set and !desc.value
                desc = value : desc

            Object.defineProperty object, prop, desc

    else
        Object.defineProperty object, props, desc

    return object
encode = TextEncoder::encode.bind new TextEncoder
decode = TextDecoder::decode.bind new TextDecoder
palloc = ->
    o = Atomics.add u32, 0, PTR_BYTELENGTH
    unless o then throw [ /PALLOC/, u32.slice(0,2) ]
    o
malloc = ( byteLength = 0 ) ->
    if  mod = byteLength % 8
        byteLength += 8 - mod

    o = Atomics.add u32, 1, byteLength
    if !o or o % 8 then throw [ /NOD_8/, u32.slice(0, 2) ]

    o

global =

    f00 : getUint8              = ( byteOffset ) ->
        dvw.getUint8 byteOffset

    f01 : setUint8              = ( byteOffset, value ) ->
        dvw.setUint8 byteOffset, value ; value

    f00 : getUint32             = ( byteOffset ) ->
        dvw.getUint32 byteOffset, iLE

    f01 : setUint32             = ( byteOffset, value ) ->
        dvw.setUint32 byteOffset, value, iLE ; value

    f00 : getFloat32            = ( byteOffset ) ->
        dvw.getFloat32 byteOffset, iLE

    f01 : setFloat32            = ( byteOffset, value ) ->
        dvw.setFloat32 byteOffset, value, iLE ; value

    #? ptri, ... ------>

    f00 : getPtriFloat32        = ( ptri, byteOffset ) ->
        getFloat32 byteOffset + getByteOffset(ptri), iLE

    f01 : setPtriFloat32        = ( ptri, byteOffset, value ) ->
        setFloat32 byteOffset + getByteOffset(ptri), value, iLE ; value

    f02 : setClassIndex         = ( ptri, classIndex ) ->
        setUint8 ptri + PTR_CLASSINDEX, classIndex

    f05 : getClassIndex         = ( ptri ) ->
        getUint8 ptri + PTR_CLASSINDEX
        
    f03 : setByteOffset         = ( ptri, byteOffset ) ->
        setUint32 ptri + HAS_BYTEOFFSET, byteOffset
        
    f06 : getByteOffset         = ( ptri ) ->
        getUint32 ptri + HAS_BYTEOFFSET

    f04 : setByteLength         = ( ptri, byteLength ) ->
        setUint32 ptri + HAS_BYTELENGTH, byteLength

    f07 : getByteLength         = ( ptri ) ->
        getUint32 ptri + HAS_BYTELENGTH

    f04 : setLength             = ( ptri, length ) ->
        setUint32 ptri + HAS_LENGTH, length

    f07 : getLength             = ( ptri ) ->
        getUint32 ptri + HAS_LENGTH

    f07 : getPtriUint8Array    = ( ptri ) ->
        new Uint8Array sab, ptri, PTR_BYTELENGTH 

    f07 : getPtriUint32Array    = ( ptri ) ->
        new Uint32Array sab, ptri, PTR_LENGTH 

define Pointer          : Number

define Pointer          , alloc     : get : ->
    ptri = new this palloc()
    clsi = this.classIndex

    setClassIndex ptri , clsi
    blen = @byteLength
    len = @length

    ( byteLength = blen, length = len ) ->
        if  byteLength
            byteOffset = malloc byteLength

            setByteOffset ptri, byteOffset
            setByteLength ptri, byteLength

            if  length
                setLength ptri, length
        ptri

define Pointer::        , isPointer : yes

define Position         : Pointer

define Position         , byteLength : 12

define Position         , TypedArray : Float32Array

define Position::       , 
    getX : -> getPtriFloat32 this, 0
    setX : -> setPtriFloat32 this, 0, arguments[0]

    getY : -> getPtriFloat32 this, 4
    setY : -> setPtriFloat32 this, 4, arguments[0]
    
    getZ : -> getPtriFloat32 this, 8
    setZ : -> setPtriFloat32 this, 8, arguments[0]

define Color            : Pointer

define Color            , byteLength : 16

define Color            , TypedArray : Float32Array



setTimeout =>
    log pos = new Position.alloc()
    log clr = new Color.alloc()
, 100

do REDEFINEPTR = -> for Class in storage

    descs = Object.getOwnPropertyDescriptors Class::
    cache = []

    #* getProperty -> get property
    #* setProperty -> set property
    for prop , desc of descs then unless desc.enumerable

        continue if !/get|set/.test prop.substring 0, 3

        Alias = prop.substring 3
        alias = Alias[0].toLowerCase() + Alias.substring 1

        continue if descs[ alias ] or cache.includes alias
        cache.push alias

        get = d.value if d = descs[ "get#{Alias}" ]
        set = d.value if d = descs[ "set#{Alias}" ]

        define Class:: , [ alias ] : { get, set, enumerable : on }

    continue if !hasOwn Class , "byteLength"
    continue if !hasOwn Class , "TypedArray"
    
    TypedArray          = Class.TypedArray
    BYTES_PER_ELEMENT   = TypedArray.BYTES_PER_ELEMENT 
    byteLength          = Class.byteLength
    length              = byteLength / BYTES_PER_ELEMENT
    subarray            = switch TypedArray
        when Float32Array   then -> new Float32Array sab, getByteOffset(this), getLength(this)
        when Uint32Array    then -> new Uint32Array sab, getByteOffset(this), getLength(this)
        when Uint8Array     then -> new Uint8Array sab, getByteOffset(this), getLength(this)
    
    define Class::          ,
        debug               : get : -> Object.defineProperties enumerable = {},
            subarray        : { enumerable , value : subarray.call this }
            byteOffset      : { enumerable , value : getByteOffset this }
            byteLength      : { enumerable , value : getByteLength this } 
            length          : { enumerable , value : getLength this     }
            u32ptri         : { get : => getPtriUint32Array this }
            ui8ptri         : { get : => getPtriUint8Array this }
    define Class            , { length, BYTES_PER_ELEMENT }

do CLEAN_PROTO = ->
    for p in "
    isFinite isInteger isNaN isSafeInteger parseFloat parseInt 
    ".split(/\n|\s+/g) then Reflect.deleteProperty( Number, p )

    for p in "
        toExponential toLocaleString toPrecision toFixed
    ".split(/\n|\s+/g) then Reflect.deleteProperty( Number::, p )

    for p in "
        assign create entries freeze fromEntries getOwnPropertyDescriptor
        getOwnPropertyNames getOwnPropertySymbols getPrototypeOf
        groupBy hasOwn is isExtensible isFrozen isSealed keys
        preventExtensions seal setPrototypeOf values
    ".split(/\n|\s+/g) then Reflect.deleteProperty( Object, p )

    for p in "
        __defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__
        propertyIsEnumerable toLocaleString hasOwnProperty isPrototypeOf
    ".split(/\n|\s+/g) then Reflect.deleteProperty( Object::, p )    


