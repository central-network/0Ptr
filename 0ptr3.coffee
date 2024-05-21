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

PTR_STATUSi         = 0 * BPE
PTR_CLASSi          = PTR_STATUSi + 1

PTR_PARENTi         = 1 * BPE
PTR_LINKEDi         = 2 * BPE

HAS_BYTEOFFSET      = 3 * BPE
HAS_BYTELENGTH      = 4 * BPE
HAS_LENGTH          = 5 * BPE

PROCEDURE_TEST_FUNCTION                 = 6 * BPE 

Atomics.store       u32, 0, PTR_BYTELENGTH
Atomics.store       u32, 1, 2000 * PTR_BYTELENGTH
Atomics.store       u32, 2, 0

storage        = new ( class Storage extends Array
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

class PtriArray extends Array

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
        if !desc.get and !desc.set and !desc.value
            desc = value : desc

        Object.defineProperty object, props, desc

    return object
symbol = ( object, props ) ->
    break for alias, desc of props 
    define object, Symbol[alias], value : desc
getter = ( object, props ) ->
    break for alias, desc of props 
    define object, alias, get : desc
setter = ( object, props ) ->
    break for alias, desc of props 
    define object, alias, set : desc
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

    f00 : getUint8                  = ( byteOffset ) ->
        dvw.getUint8 byteOffset

    f01 : setUint8                  = ( byteOffset, value ) ->
        dvw.setUint8 byteOffset, value ; value

    f00 : getUint32                 = ( byteOffset ) ->
        dvw.getUint32 byteOffset, iLE

    f01 : setUint32                 = ( byteOffset, value ) ->
        dvw.setUint32 byteOffset, value, iLE ; value

    f00 : getFloat32                = ( byteOffset ) ->
        dvw.getFloat32 byteOffset, iLE

    f01 : setFloat32                = ( byteOffset, value ) ->
        dvw.setFloat32 byteOffset, value, iLE ; value

    f07 : getFloat32Array           = ( byteOffset, length ) ->
        throw /OFFSET_LEN/ if !byteOffset or !length
        new Float32Array sab, byteOffset, length

    #? ptri, ... ------>

    f00 : getPtriFloat32            = ( ptri, byteOffset ) ->
        getFloat32 byteOffset + getByteOffset(ptri), iLE

    f01 : setPtriFloat32            = ( ptri, byteOffset, value ) ->
        setFloat32 byteOffset + getByteOffset(ptri), value, iLE ; value

    f02 : setPtriStatus             = ( ptri, status ) ->
        setUint8 ptri + PTR_STATUSi, status ; status

    f05 : getPtriStatus             = ( ptri ) ->
        getUint8 ptri + PTR_STATUSi

    f02 : setPtriClassi             = ( ptri, classIndex ) ->
        setUint8 ptri + PTR_CLASSi, classIndex ; classIndex

    f05 : getPtriClassi             = ( ptri ) ->
        getUint8 ptri + PTR_CLASSi

    f02 : setPtriParent             = ( ptri, parent ) ->
        setUint32 ptri + PTR_PARENTi, parent, iLE ; parent

    f05 : getPtriParent             = ( ptri ) ->
        getUint32 ptri + PTR_PARENTi

    f02 : setPtriLinked             = ( ptri, linked ) ->
        setUint32 ptri + PTR_LINKEDi, linked, iLE ; linked

    f05 : getPtriLinked             = ( ptri ) ->
        getUint32 ptri + PTR_LINKEDi
        
    f03 : setByteOffset             = ( ptri, byteOffset ) ->
        setUint32 ptri + HAS_BYTEOFFSET, byteOffset
        
    f06 : getByteOffset             = ( ptri ) ->
        getUint32 ptri + HAS_BYTEOFFSET

    f04 : setByteLength             = ( ptri, byteLength ) ->
        setUint32 ptri + HAS_BYTELENGTH, byteLength

    f07 : getByteLength             = ( ptri ) ->
        getUint32 ptri + HAS_BYTELENGTH

    f04 : setLength                 = ( ptri, length ) ->
        setUint32 ptri + HAS_LENGTH, length

    f07 : getLength                 = ( ptri ) ->
        getUint32 ptri + HAS_LENGTH
    
    f07 : ptrUint8Array             = ( ptri ) ->
        new Uint8Array sab, ptri, PTR_BYTELENGTH 

    f07 : ptrUint32Array            = ( ptri ) ->
        new Uint32Array sab, ptri, PTR_LENGTH 

    f07 : ptrFloat32Array           = ( ptri ) ->
        new Float32Array sab, ptri, PTR_LENGTH 

    f07 : ptriFloat32Array          = ( ptri, byteOffset = 0, length ) ->
        length or= getLength( ptri )
        byteOffset += getByteOffset( ptri )
        new Float32Array sab, byteOffset, length 

    fff : ptriAllocAndSet           = ( ptri, data, view ) ->
        if !byteOffset = getByteOffset ptri
            byteLength = data.byteLength
            byteOffset = malloc byteLength

            setByteLength ptri, byteLength
            setByteOffset ptri, byteOffset

        else if data.byteLength > blen = getByteLength ptri
            throw /GROW_NOT_IMPLEMENTED/

        else ui8.fill 0, byteOffset, blen

        if !getByteLength ptri
            throw /UNKNOWN_ON_ALLOCSET/

        view.set data, byteOffset; ptri

    fff : updateTextRawString       = ( data, ptri = this ) ->

        if  "string" is typeof data
            return ptriAllocAndSet ptri, encode( data ), ui8

        isArray = Array.isArray data
        isView  = data instanceof Uint8Array

        if  isArray or isView 
            ptriAllocAndSet ptri, data, ui8

        else 
            throw /TODOLIST_SETTER_FLOAT32/

        this

    fff : updateFloat32DataArray    = ( data ) ->
        isArray = Array.isArray data
        isView  = ArrayBuffer.isView data

        if  isArray or isView 
            i = 0
            for v from data
                setPtriFloat32 this,  4 * i++, v
        else 
            throw /TODOLIST_SETTER_FLOAT32/

        this

    fff : getterPtriFloat32Array    = ( ptri = this ) ->
        new Float32Array sab, getByteOffset( ptri ), getLength( ptri ) 
    
    fff : getterAllocNewPointer     = ( OPtr = this ) ->
        ptri = new OPtr palloc()
        clsi = OPtr.classIndex

        setPtriClassi ptri , clsi

        blen = OPtr.byteLength
        len = OPtr.length

        ( byteLength = blen, length = len ) ->
            if  byteLength
                byteOffset = malloc byteLength

                setByteOffset ptri, byteOffset
                setByteLength ptri, byteLength

                if  length
                    setLength ptri, length
            ptri

    fff : getterPtriVectorLength    = ( ptri = this ) ->
        sum = 0
        for v from this
            sum += Math.pow v, 2
        Math.sqrt sum

    fff : getPtriVectorValue        = ( ptri, byteOffset ) ->
        getPtriFloat32 ptri, byteOffset

    fff : getterPtriVectorX         = ( ptri = this, byteOffset = 0 ) ->
        getPtriVectorValue ptri, byteOffset

    fff : getterPtriVectorY         = ( ptri = this, byteOffset = 4 ) ->
        getPtriVectorValue ptri, byteOffset

    fff : getterPtriVectorZ         = ( ptri = this, byteOffset = 8 ) ->
        getPtriVectorValue ptri, byteOffset

    fff : setPtriVectorValue        = ( ptri , value, byteOffset ) ->
        setPtriFloat32 ptri, byteOffset, value

    fff : setterPtriVectorX         = ( value, byteOffset = 0, ptri = this ) ->
        setPtriVectorValue ptri, value, byteOffset

    fff : setterPtriVectorY         = ( value, byteOffset = 4, ptri = this ) ->
        setPtriVectorValue ptri, value, byteOffset

    fff : setterPtriVectorZ         = ( value, byteOffset = 8, ptri = this ) ->
        setPtriVectorValue ptri, value, byteOffset

    fff : getPtriColorValue         = ( ptri , byteOffset ) ->
        getPtriFloat32 ptri, byteOffset

    fff : getterPtriColorRed        = ( ptri = this, byteOffset = 0 ) ->
        getPtriColorValue ptri, byteOffset
    
    fff : getterPtriColorGreen      = ( ptri = this, byteOffset = 4 ) ->
        getPtriColorValue ptri, byteOffset
    
    fff : getterPtriColorAlpha      = ( ptri = this, byteOffset = 12 ) ->
        getPtriColorValue ptri, byteOffset

    fff : getterPtriColorBlue       = ( ptri = this, byteOffset = 8 ) ->
        getPtriColorValue ptri, byteOffset

    fff : setPtriColorValue         = ( ptri , value, byteOffset ) ->
        throw /MAX_COLOR_VALUE_EXCEED/ if value > 1
        throw /MIN_COLOR_VALUE_EXCEED/ if value < 0
        setPtriFloat32 ptri, byteOffset, value

    fff : setterPtriColorRed        = ( value, byteOffset = 0, ptri = this ) ->
        setPtriColorValue ptri, value, byteOffset
    
    fff : setterPtriColorGreen      = ( value, byteOffset = 4, ptri = this ) ->
        setPtriColorValue ptri, value, byteOffset

    fff : setterPtriColorAlpha      = ( value, byteOffset =12, ptri = this ) ->
        setPtriColorValue ptri, value, byteOffset
    
    fff : setterPtriColorBlue       = ( value, byteOffset = 8, ptri = this ) ->
        setPtriColorValue ptri, value, byteOffset

    fff : getterPtriColorAsHEX      = ( ptri = this ) ->
        array = getterPtriColorAsArray ptri
        [ red, green, blue, alpha ] = array

        r = red     .toString(16).padStart(2,0)
        g = green   .toString(16).padStart(2,0)
        b = blue    .toString(16).padStart(2,0)
        a = alpha   .toString(16).padStart(2,0)

        "0x#{r}#{g}#{b}#{a}"

    fff : getterPtriColorAsCSS      = ( ptri = this ) ->
        [ red, green, blue, alpha ] = getterPtriColorAsArray ptri
        "rgba( #{red}, #{green}, #{blue} }, #{alpha / 0xff} )"

    fff : getterPtriColorAsArray    = ( ptri = this ) ->
        subarray = getterPtriFloat32Array ptri
        [ ...subarray ].map (v) -> Math.trunc v * 0xff

    fff : getterPtriColorAsNumber   = ( ptri = this ) ->
        parseInt getterPtriColorAsHEX( ptri ), 16

    fff : getterPtriColorAsRGBA     = ( ptri = this ) ->
        [ red, green, blue, alpha ] = getterPtriColorAsArray ptri
        { red, green, blue, alpha }

    fff : getterPtriColorAsHSLA     = ( ptri = this ) ->
        [ r, g, b, a ] = getterPtriFloat32Array ptri

        # ref   : https://stackoverflow.com/a/58426404/21225939
        # author: @Crashalot
        # edit  : @Mike Pomax Kamermans, me
        max = Math.max r, g, b
        min = Math.min r, g, b
        
        delta = max - min
        h = s = l = 0

        unless  delta
            h = 0

        else if max is r
            h = ((g - b) / delta) % 6
        
        else if max is g
            h = ((b - r) / delta  + 2)
        
        else if max is b
            h = ((r - g) / delta  + 4)

        h = Math.round h * 60
        h = 360 + h if h < 0
        l = ( max + min ) / 2
        s = delta / (1 - Math.abs( 2 * l - 1 ))
            
        # Multiply l, a and s by 100
        s = Math.trunc s * 100
        l = Math.trunc l * 100
        a = Math.trunc a * 100

        { hue: h, saturation: s, lightness: l, alpha: a }

    fff : iteratPtriFloat32x4       = ( ptri = this, byteOffset = 0 ) ->
        yield getPtriFloat32 ptri,  byteOffset
        yield getPtriFloat32 ptri,  byteOffset +  4
        yield getPtriFloat32 ptri,  byteOffset +  8
        yield getPtriFloat32 ptri,  byteOffset + 12
        0

    fff : iteratPtriFloat32x3       = ( ptri = this, byteOffset = 0 ) ->
        yield getPtriFloat32 ptri,  byteOffset
        yield getPtriFloat32 ptri,  byteOffset +  4
        yield getPtriFloat32 ptri,  byteOffset +  8
        0

    fff : getterPtriDataAsText      = ( ptri = this ) ->
        decode new Uint8Array( sab,
            getByteOffset( ptri ), getByteLength( ptri )
        ).slice 0

    fff : getterPtriAlias           = ( ptri = this ) ->
        getterPtriDataAsText ptri

    fff : setterPtriAlias           = ( data, ptri = this ) ->
        updateTextRawString data, ptri
        
    fff : getterPtriLinked          = ( ptri = this ) ->
        storage[ getPtriLinked ptri ] 
    
    fff : setterPtriLinked          = ( data, ptri = this ) ->
        if  -1 is stri = storage.indexOf data 
            throw /PROCEDURE_LINKEDCLASS_SETERROR/
        setPtriLinked ptri, stri 
        
    fff : getterPtriParent          = ( ptri = this ) ->
        parent = getPtriParent ptri
        classi = getPtriClassi parent
        new storage[ classi ] parent
    
    fff : setterPtriParent          = ( parent, ptri = this ) ->
        setPtriParent ptri, parent ; parent

    fff : getterProtocolTest        = ( ptri = this ) ->
        if !stri = getUint32 this + PROCEDURE_TEST_FUNCTION
            return -> 1    
        return storage[ stri ]

    fff : setterProtocolTest        = ( func, ptri = this ) ->
        if -1 is stri = storage.storeForUint32 func
            throw /ERROR_ON_PROCEDURE_TEST_FUNCTION/    
        return setUint32 this + PROCEDURE_TEST_FUNCTION, stri

    fff : addPtriChildren           = ( child, ptri = this ) ->
        setPtriParent child, ptri ; ptri

    fff : filterPtri                = ( clssi, ptri = this, previ = 0, count = 0, atomic = NaN ) ->

        childi =
            unless atomic then previ
            else if isNaN atomic then throw /ATOMIC_MUSTBEui32/
            else Atomics.add( u32, atomic, POINTER_BYTELENGTH )

        length = 0
        childs = new PtriArray
        counti = Atomics.load u32

        EVERYTHING                      = (!ptri and !clssi ) or false
        EVERYCLASS_PTRIs                = (!ptri and  clssi and !isNaN clssi ) or false
        EVERYCLASS_CONSTRUCTED          = (!ptri and  clssi and  clssi instanceof Function ) or false
        CHILDREN_NOFILTER               = ( ptri and !clssi ) or false
        FILTERED_CHILDREN_PTRIs         = ( ptri and  clssi and !isNaN clssi ) or false
        FILTERED_CHILDREN_CONSTRUCTED   = ( ptri and  clssi and  clssi instanceof Function ) or false

        unless !clssi then clsi =
            if  clssi instanceof Function
                storage.indexOf clssi
            else if no is isNaN clssi then clssi
            else throw /UNDEFINED_ERROR_FILTER/

        switch !null

            when EVERYTHING                     then while childi < counti

                childi = childi + PTR_BYTELENGTH
                PClass = storage[ getPtriClassi childi ]
                childs[ length++ ] = new PClass childi
                break unless --count 

            when EVERYCLASS_PTRIs               then while childi < counti

                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                childs[ length++ ] = childi
                break unless --count

            when EVERYCLASS_CONSTRUCTED         then while childi < counti
                
                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                PClass = storage[  getPtriClassi childi ]
                childs[ length++ ] = new PClass childi
                break unless --count

            when CHILDREN_NOFILTER              then while childi < counti
                
                childi = childi + PTR_BYTELENGTH
                continue if ptri - getPtriParent childi
                PClass = storage[  getPtriClassi childi ]
                childs[ length++ ] = new PClass childi
                break unless --count

            when FILTERED_CHILDREN_PTRIs        then while childi < counti

                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                continue if ptri - getPtriParent childi
                childs[ length++ ] = childi
                break unless --count

            when FILTERED_CHILDREN_CONSTRUCTED  then while childi < counti
                
                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                continue if ptri - getPtriParent childi
                PClass = storage[  getPtriClassi childi ]
                childs[ length++ ] = new PClass childi
                break unless --count

            else throw /UNDEFINED_FILDER/

        return childs


    #? helpers ----->

        


define Pointer          : Number
define Position         : Pointer
define Color            : Pointer
define Text             : Pointer
define Procedure        : Text
define Protocol         : Pointer
define Queue            : Pointer
define Pointer          , isClass               : on
getter Pointer          , alloc                 : getterAllocNewPointer
define Color            , byteLength            : 4 * 4
define Position         , byteLength            : 3 * 4
define Text             , TypedArray            : Uint8Array
define Color            , TypedArray            : Float32Array
define Position         , TypedArray            : Float32Array
define Pointer::        , isPointer             : on
define Position::       , getX                  : getterPtriVectorX
define Position::       , getY                  : getterPtriVectorY
define Position::       , getZ                  : getterPtriVectorZ
define Position::       , setX                  : setterPtriVectorX
define Position::       , setY                  : setterPtriVectorY
define Position::       , setZ                  : setterPtriVectorZ
getter Position::       , subarray              : getterPtriFloat32Array
getter Position::       , vectorLength          : getterPtriVectorLength
define Position::       , set                   : updateFloat32DataArray
symbol Position::       , iterator              : iteratPtriFloat32x3
define Color::          , getRed                : getterPtriColorRed
define Color::          , setRed                : setterPtriColorRed
define Color::          , getGreen              : getterPtriColorGreen
define Color::          , setGreen              : setterPtriColorGreen
define Color::          , getBlue               : getterPtriColorBlue
define Color::          , setBlue               : setterPtriColorBlue
define Color::          , getAlpha              : getterPtriColorAlpha
define Color::          , setAlpha              : setterPtriColorAlpha
define Color::          , set                   : updateFloat32DataArray
getter Color::          , hex                   : getterPtriColorAsHEX
getter Color::          , hsla                  : getterPtriColorAsHSLA  
getter Color::          , rgba                  : getterPtriColorAsRGBA
getter Color::          , css                   : getterPtriColorAsCSS
getter Color::          , number                : getterPtriColorAsNumber
getter Color::          , array                 : getterPtriColorAsArray
getter Color::          , subarray              : getterPtriFloat32Array
symbol Color::          , iterator              : iteratPtriFloat32x4
define Text::           , set                   : updateTextRawString
define Procedure::      , getAlias              : getterPtriAlias
define Procedure::      , setAlias              : setterPtriAlias 
define Procedure::      , addProtocol           : addPtriChildren 
define Procedure::      , getProtocols          : -> filterPtri Protocol, this
define Protocol::       , getLinked             : getterPtriLinked
define Protocol::       , setLinked             : setterPtriLinked
define Protocol::       , getProcedure          : getterPtriParent
define Protocol::       , setProcedure          : setterPtriParent
define Protocol::       , getTest               : getterProtocolTest
define Protocol::       , setTest               : setterProtocolTest



#? finish ---->

do REDEFINEPTR = ->
    for Class in storage

        descs = Object.getOwnPropertyDescriptors Class::
        cache = []

        #* getProperty -> get property
        #* setProperty -> set property
        for prop , desc of descs then unless desc.enumerable

            continue if !/get|set/.test prop.substring 0, 3
            continue unless Alias = prop.substring 3
            
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
                u32ptri         : { get : => ptrUint32Array this }
                ui8ptri         : { get : => ptrUint8Array this }
        define Class            , { length, BYTES_PER_ELEMENT }

    0

do CLEARPROTOS = ->
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


    0


#? test ---->

do  tick = ->

    requestAnimationFrame tick
    
setTimeout =>
    pos = new Position.alloc()
    clr = new Color.alloc()
    procedure = new Procedure.alloc().set "on?"
    protocol = new Protocol.alloc()  
    protocol2 = new Protocol.alloc()  
    
    procedure.addProtocol protocol

    log { procedure }

    protocol.linked = Position
    protocol.match = ( ptri ) ->
        2 is getPtriClassi ptri

    #error "protocol.match(pos):", protocol.match( pos )
    #error "protocol.match(clr):", protocol.match( clr )


, 100

