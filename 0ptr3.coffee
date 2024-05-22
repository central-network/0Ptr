#* hello world
Object.defineProperty self, "OPtr",
    value : ( class OPtr extends Number )


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
ptr = [
    STATE_DELETE        = 0
    STATE_IGNORE        = 1
    STATE_PALLOC        = 2
    STATE_MALLOC        = 3
    STATE_QUEUED        = 5
    STATE_UPDATING      = 6
    STATE_UPDATED       = 7
    STATE_UPLOAD        = 8
    STATE_UPLOADING     = 9
    STATE_UPLOADED      = 10

    PTRTYPE_CLASS       = 1
    PTRTYPE_HEADER      = 2
    PTRTYPE_DATAPTR     = 3
    PTRTYPE_OFFSET      = 4
    
    PTR_LENGTH          = 16
    PTR_BYTELENGTH      = BPE * PTR_LENGTH
    
    PTR_STATUSi         = 0 * BPE
    PTR_CLASSi          = PTR_STATUSi + 1
    PTR_TYPEi           = PTR_STATUSi + 2
    PTR_RESVu8          = PTR_STATUSi + 3

    PTR_PARENTi         = 1 * BPE
    PTR_LINKEDi         = 2 * BPE
    HAS_BYTEOFFSET      = 3 * BPE
    HAS_BYTELENGTH      = 4 * BPE
    HAS_LENGTH          = 5 * BPE
    
    CLSPTR_ALLOCOFFSET  = 6 * BPE
    CLSPTR_ALLOCLENGTH  = PTR_BYTELENGTH - CLSPTR_ALLOCOFFSET
    
    ALLOCPTR_BYTEOFFSET = 6 * BPE
    ALLOCPTR_BYTELENGTH = ALLOCPTR_BYTEOFFSET + 1
    ALLOCPTR_ISREQUIRED = ALLOCPTR_BYTEOFFSET + 2
    ALLOCPTR_INHERITTYP = ALLOCPTR_BYTEOFFSET + 3
    ALLOCPTR_STATHANDLE = 7 * BPE


    PROCEDURE_FILTERER  = 6 * BPE 
]

class Collection extends Array

class Storage extends Array
        constructor         : -> super( arguments... )[0] ?= null
        store               : ( any, bytes = 2 ) ->
            if  hasOwn any, "storagei"
                return any.  storagei

            if  -1 is i = @indexOf any
                
                i = Math.pow 0xff, bytes-1
                i = 1 + i while this[ i ]

                if  i > Math.pow( 0xff, bytes )
                    throw /EXCEED_STORAGE/

                else this[ i ] =
                    define any, "storagei", i

            if  Math.pow( 0xff, bytes ) <= i
                throw /EXCEED_STORAGE/

            return i

        storeForUint8       : ( any ) -> @store any, 1
        storeForUint16      : ( any ) -> @store any, 2
        storeForUint32      : ( any ) -> @store any, 4
        storeForUint64      : ( any ) -> @store any, 8

assign = Object.assign
hasOwn = Object.hasOwn
getOwn = Object.getOwnPropertyDescriptors
protof = Object.getPrototypeOf
encode = TextEncoder::encode.bind new TextEncoder
decode = TextDecoder::decode.bind new TextDecoder

Atomics.store u32, 0, PTR_BYTELENGTH
Atomics.store u32, 1, 2000 * PTR_BYTELENGTH
Atomics.store u32, 2, 0

storage = new Storage Number

define = ( object, props, desc ) ->

    if !desc and !props

        break for Alias, { name: Super } of object

        text = ( -> Object.defineProperty( self,
            "Alias", value : ( class Alias extends Super ))).toString()

        text = text
            .substring( text.indexOf("Object"), text.lastIndexOf("}"))   
            .replace( /Alias/ug, Alias ). replace( /Super/ug, Super )

        document.head.append(
            assign( $ = document.createElement( "script" ), { text }))
        
        Clss = self[ Alias ]

        storage . storeForUint8 Clss
        clsptri = allocNewPointer( OPtr, PTRTYPE_CLASS )()

        define Clss, clsptri: +clsptri
        setPtriLinked clsptri, Clss.storagei      
        setPtriResvUint8 clsptri, CLSPTR_ALLOCOFFSET      
        updateTextRawString Alias, clsptri
        
        if  hasOwn self[ Super ], "clsptri"
            setPtriParent clsptri, self[ Super ].clsptri

        if  ClassPointer?
            storagei = ClassPointer.storagei

            looPtri( OPtr ).forEach ( ptri ) ->                
                return if PTRTYPE_CLASS is getPtriType ptri
                return if storagei is getPtriClassi ptri
                return setPtriClassi ptri, storagei

        $.remove()

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
getter = ( object, props, enumerable = off ) ->
    break for alias, get of props 
    define object, alias, { enumerable, get }
setter = ( object, props ) ->
    break for alias, set of props 
    define object, alias, { set }
symbol = ( object, props ) ->
    break for alias, desc of props 
    define object, Symbol[alias], value : desc
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
resv   = ( object, alias, size ) ->
    quota = PTR_BYTELENGTH 
    start = PTR_LINKEDi + 4

    if  object.constructor.byteLength
        start = HAS_LENGTH + 4

    

    warn { object, start, quota }

 


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

    f05 : ptriStateNeedsIgnore      = ( ptri = this ) ->
        getUint8( ptri + PTR_STATUSi ) <= STATE_IGNORE

    f05 : getPtriStatus             = ( ptri = this ) ->
        getUint8 ptri + PTR_STATUSi

    f02 : setPtriClassi             = ( ptri, stri ) ->
        setUint8 ptri + PTR_CLASSi, stri ; stri

    f05 : getPtriClassi             = ( ptri = this ) ->
        getUint8 ptri + PTR_CLASSi

    f02 : setPtriType               = ( ptri, type ) ->
        setUint8 ptri + PTR_TYPEi, type ; type

    f05 : getPtriType               = ( ptri = this ) ->
        getUint8 ptri + PTR_TYPEi

    f02 : setPtriResvUint8          = ( ptri, byte ) ->
        setUint8 ptri + PTR_RESVu8, byte ; byte

    f05 : getPtriResvUint8          = ( ptri = this ) ->
        getUint8 ptri + PTR_RESVu8

    f02 : setPtriParent             = ( ptri, parent ) ->
        setUint32 ptri + PTR_PARENTi, parent, iLE ; parent

    f05 : getPtriParent             = ( ptri = this ) ->
        getUint32 ptri + PTR_PARENTi

    f02 : getLinked                 = ( ptri = this ) ->
        ptri = getPtriLinked ptri
        clsi = getPtriClassi ptri

        new storage[ clsi ] ptri

    f02 : setLinked                 = ( linked, ptri = this ) ->
        setUint32 ptri + PTR_LINKEDi, linked, iLE ; linked

    f02 : setPtriLinked             = ( ptri, linked ) ->
        setUint32 ptri + PTR_LINKEDi, linked, iLE ; linked

    f05 : getPtriLinked             = ( ptri = this ) ->
        getUint32 ptri + PTR_LINKEDi
        
    f03 : setByteOffset             = ( ptri, byteOffset ) ->
        setUint32 ptri + HAS_BYTEOFFSET, byteOffset
        
    f06 : getByteOffset             = ( ptri = this ) ->
        getUint32 ptri + HAS_BYTEOFFSET

    f04 : setByteLength             = ( ptri, byteLength ) ->
        setUint32 ptri + HAS_BYTELENGTH, byteLength

    f07 : getByteLength             = ( ptri = this ) ->
        getUint32 ptri + HAS_BYTELENGTH

    f04 : setLength                 = ( ptri, length ) ->
        setUint32 ptri + HAS_LENGTH, length

    f07 : getLength                 = ( ptri = this ) ->
        getUint32 ptri + HAS_LENGTH
    
    f07 : ptrUint8Array             = ( ptri = this ) ->
        new Uint8Array sab, ptri, PTR_BYTELENGTH 

    f07 : ptrUint32Array            = ( ptri = this ) ->
        new Uint32Array sab, ptri, PTR_LENGTH 

    f07 : ptrFloat32Array           = ( ptri = this ) ->
        new Float32Array sab, ptri, PTR_LENGTH 

    f07 : ptriFloat32Array          = ( ptri, byteOffset = 0, length ) ->
        length or= getLength( ptri )
        byteOffset += getByteOffset( ptri )
        new Float32Array sab, byteOffset, length 

    ___ : ptriAllocAndSet           = ( ptri, data, view ) ->

        if !byteOffset = getByteOffset ptri
            byteLength = data.byteLength
            byteOffset = malloc byteLength

            setByteLength ptri, byteLength
            setByteOffset ptri, byteOffset
            setPtriType   ptri, PTRTYPE_DATAPTR

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
    
    ___ : allocNewPointer           = ( Clss = this, type, state ) ->
        ptri = new Clss palloc()

        clsi = storage.store Clss

        setPtriClassi ptri , clsi
        setPtriStatus ptri , state or STATE_PALLOC
        setPtriType   ptri , type or PTRTYPE_HEADER

        blen = Clss.byteLength
        len = Clss.length

        ( byteLength = blen, length = len ) ->
            if  byteLength
                byteOffset = malloc byteLength

                setByteOffset ptri, byteOffset
                setByteLength ptri, byteLength
                setPtriStatus ptri, STATE_MALLOC

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

    fff : getterPtriAliasCamelCase  = ( ptri = this ) ->
        alias = getterPtriAlias ptri
        alias[0].toLowerCase() + alias.substring 1

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
        if !stri = getUint32 this + PROCEDURE_FILTERER
            return -> 1    
        return storage[ stri ]

    fff : setterProtocolTest        = ( func, ptri = this ) ->
        if -1 is stri = storage.store func
            throw /ERROR_ON_PROCEDURE_FILTERER/    
        return setUint32 this + PROCEDURE_FILTERER, stri

    fff : addPtriChildren           = ( child, ptri = this ) ->
        setPtriParent child, ptri ; ptri

    fff : looPtri = self.loop       = ( clssi, ptri = this, count = 0, previ = 0, atomic = NaN ) ->

        single = count is 1
        childi =
            unless atomic then previ
            else if isNaN atomic then throw /ATOMIC_MUSTBEui32/
            else Atomics.add( u32, atomic, POINTER_BYTELENGTH )

        EVERYTHING                      = Boolean( !ptri and !clssi )
        EVERYCLASS_PTRIs                = Boolean( !ptri and  clssi and !isNaN clssi )
        EVERYCLASS_CONSTRUCTED          = Boolean( !ptri and  clssi and  clssi instanceof Function )
        CHILDREN_NOFILTER               = Boolean(  ptri and !clssi )
        FILTERED_CHILDREN_PTRIs         = Boolean(  ptri and  clssi and !isNaN clssi )
        FILTERED_CHILDREN_CONSTRUCTED   = Boolean(  ptri and  clssi and  clssi instanceof Function )

        unless !clssi then clsi =
            if  clssi instanceof Function
                storage.indexOf PClass = clssi
            else if no is isNaN clssi then clssi
            else throw /UNDEFINED_ERROR_FILTER/

        length = 0
        childs = new Collection
        counti = Atomics.load u32

        switch true

            when EVERYTHING                     then while childi < counti

                childi = childi + PTR_BYTELENGTH
                continue if ptriStateNeedsIgnore childi
                PClass = storage[  getPtriClassi childi ]
                childs[ length++ ] = new PClass( childi )
                break unless --count 

            when EVERYCLASS_PTRIs               then while childi < counti

                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                continue if ptriStateNeedsIgnore childi
                childs[       length++       ] = childi
                break unless --count

            when EVERYCLASS_CONSTRUCTED         then while childi < counti
                
                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                continue if ptriStateNeedsIgnore childi
                childs[ length++ ] = new PClass( childi )
                break unless --count

            when CHILDREN_NOFILTER              then while childi < counti
                
                childi = childi + PTR_BYTELENGTH
                continue if ptriStateNeedsIgnore childi
                continue if ptri - getPtriParent childi
                PClass = storage[  getPtriClassi childi ]
                childs[ length++ ] = new PClass( childi )
                break unless --count

            when FILTERED_CHILDREN_PTRIs        then while childi < counti

                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                continue if ptriStateNeedsIgnore childi
                continue if ptri - getPtriParent childi
                childs[       length++       ] = childi
                break unless --count

            when FILTERED_CHILDREN_CONSTRUCTED  then while childi < counti
                
                childi = childi + PTR_BYTELENGTH
                continue if clsi - getPtriClassi childi
                continue if ptriStateNeedsIgnore childi
                continue if ptri - getPtriParent childi
                childs[ length++ ] = new PClass( childi )
                break unless --count

            else throw /UNDEFINED_FILDER/

        return if single then childs[0] else childs

    fff : getterMeshPosition        = ( ptri = this ) ->

        looPtri Position, this, 1

    fff : setterMeshPosition        = ( position, ptri = this ) ->
        1

    fff : getterPtrCAlias           = ( ptri = this ) ->
        getterPtrCClass( ptri ).name

    fff : getterPtrCPrototype       = ( ptri = this ) ->
        storage[ getPtriLinked ptri ]

    fff : getterPtrCParent          = ( ptri = this ) ->
        if !ptrj = getPtriParent ptri
            return new OPtr 0
        new storage[ getPtriClassi ptrj ] ptrj

    fff : findPtriPrototype      = ( ptri = this ) ->
        getPtriLinked ptri

    #? helpers ----->

storage.storeForUint8 OPtr
info storage

define Pointer          : Number
define ClassPointer     : Pointer
define Position         : Pointer
define Rotation         : Pointer
define Scale            : Pointer
define Color            : Pointer
define Text             : Pointer
define Mesh             : Pointer
define Vertices         : Pointer
define Procedure        : Text
define Protocol         : Pointer
define Allocation       : Text
define Queue            : Pointer
getter Pointer          , alloc                 : allocNewPointer
define Pointer          , isClass               : on
define Mesh             , byteLength            : 8 * 4
define Color            , byteLength            : 4 * 4
define Position         , byteLength            : 3 * 4
define Rotation         , byteLength            : 3 * 4
define Scale            , byteLength            : 3 * 4
define Text             , TypedArray            : Uint8Array
define Color            , TypedArray            : Float32Array
define Position         , TypedArray            : Float32Array
define Rotation         , TypedArray            : Float32Array
define Scale            , TypedArray            : Float32Array
define Mesh             , TypedArray            : Float32Array
define Pointer::        , isPointer             : on
define ClassPointer     , of                    : ( any ) ->
    clsi = any.storagei or getPtriClassi( any )
    new ClassPointer looPtri( ClassPointer ).find ( clsptri ) ->
        clsi is getPtriLinked clsptri
    
define ClassPointer::   , getAlias              : getterPtriAlias
getter ClassPointer::   , keyName               : getterPtriAliasCamelCase
define ClassPointer::   , getClass              : getterPtrCPrototype
getter ClassPointer::   , extender              : getterPtrCParent
define ClassPointer::   , getAllocLength        : -> getPtriResvUint8 this
define ClassPointer::   , setAllocLength        : -> setPtriResvUint8 this, arguments[0]
define ClassPointer::   , getAllocations        : -> looPtri( Allocation, this )

define ClassPointer::   , alloc                 : ( Class, options = {} ) ->

    clsPointer = ClassPointer.of Class
    byteLength = options.byteLength or Class.byteLength
    byteOffset = @getAllocLength()

    setPtriResvUint8 this, byteLength + byteOffset
    setPtriParent alci = new Allocation.alloc(), this

    alci.setLinked this.storagei
    alci.setByteLength byteLength
    alci.setByteOffset byteOffset
    alci.setKeyName(
        options.keyName or
        clsPointer.keyName
    )

    options.isRequired ?= 1
    options.inheritType ?= 1

    alci.setIsRequired options.isRequired
    alci.setInheritType options.inheritType

    define @class::, keyName = alci.keyName,
        enumerable: on

        get : (( Property, byteOffset, keyName, isRequired ) -> ->

            if !ptri = getUint32 this + byteOffset
                return unless isRequired

                this[ keyName ] =
                    ptri = new Property.alloc()

                setPtriParent ptri, this
                return ptri
            return new Property ptri

        ) Class, byteOffset, keyName, alci.isRequired

        set : (( byteOffset ) -> ->
            setUint32 this + byteOffset, arguments[0]
        ) byteOffset

    alci

define Allocation::     , getLinked             : getLinked
define Allocation::     , setLinked             : setLinked
define Allocation::     , getKeyName            : getterPtriAlias
define Allocation::     , setKeyName            : setterPtriAlias
define Allocation::     , getByteLength         : -> getUint8 this + ALLOCPTR_BYTELENGTH
define Allocation::     , setByteLength         : -> setUint8 this + ALLOCPTR_BYTELENGTH, arguments[0]
define Allocation::     , getByteOffset         : -> getUint8 this + ALLOCPTR_BYTEOFFSET
define Allocation::     , setByteOffset         : -> setUint8 this + ALLOCPTR_BYTEOFFSET, arguments[0]
define Allocation::     , getIsRequired         : -> getUint8 this + ALLOCPTR_ISREQUIRED
define Allocation::     , setIsRequired         : -> setUint8 this + ALLOCPTR_ISREQUIRED, arguments[0]
define Allocation::     , getInheritType        : -> getUint8 this + ALLOCPTR_INHERITTYP
define Allocation::     , setInheritType        : -> setUint8 this + ALLOCPTR_INHERITTYP, arguments[0]
define Allocation::     , getStateHandler       : -> storage[ getUint32 this + ALLOCPTR_STATHANDLE ]
define Allocation::     , setStateHandler       : -> setUint32 this + ALLOCPTR_STATHANDLE, storage.store arguments[0]


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
define Procedure::      , getProtocols          : -> looPtri( Protocol, this )
define Protocol::       , getFilterer           : getterProtocolTest
define Protocol::       , setFilterer           : setterProtocolTest
define Protocol::       , getLinkedClass        : getterPtriLinked
define Protocol::       , setLinkedClass        : setterPtriLinked
define Protocol::       , setProcedure          : setterPtriParent
getter Protocol::       , procedure             : getterPtriParent
define Protocol::       , getMatchs             : -> looPtri( @linkedClass ).filter @filterer



storage.store Color

#? finish ---->

do REDEFINEPTR = ->

    kProto = "{{ClassPointer}}"

    class Class extends ClassPointer

    for Clss in storage

        if ![ ClassPointer, Pointer, OPtr, Number, Allocation ].includes Clss
            getter Clss::, [ "{{Class}}" ] : -> new ClassPointer @constructor.clsptri

        descs = getOwn Clss::
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

            define Clss:: , [ alias ] : { get, set, enumerable : on }

        continue if !hasOwn Clss , "byteLength"
        continue if !hasOwn Clss , "TypedArray"
        
        TypedArray          = Clss.TypedArray
        BYTES_PER_ELEMENT   = TypedArray.BYTES_PER_ELEMENT 
        byteLength          = Clss.byteLength
        length              = byteLength / BYTES_PER_ELEMENT
        subarray            = switch TypedArray
            when Float32Array   then -> new Float32Array sab, getByteOffset(this), getLength(this)
            when Uint32Array    then -> new Uint32Array sab, getByteOffset(this), getLength(this)
            when Uint8Array     then -> new Uint8Array sab, getByteOffset(this), getLength(this)
        
        define Clss,
            { length, BYTES_PER_ELEMENT }

        define Clss::, [ "{{Pointer}}" ] : get : -> Object.defineProperties enumerable = {},
            subarray        : { enumerable , value : subarray.call this }
            byteOffset      : { enumerable , value : getByteOffset this }
            byteLength      : { enumerable , value : getByteLength this } 
            length          : { enumerable , value : getLength this     }
            u32ptri         : { get : => ptrUint32Array this }
            ui8ptri         : { get : => ptrUint8Array this }
            state           : { get : => getPtriStatus this }
            hitStatePalloc  : { get : => setPtriStatus this, STATE_PALLOC }
            hitStateMalloc  : { get : => setPtriStatus this, STATE_MALLOC }
            hitStateIgnore  : { get : => setPtriStatus this, STATE_IGNORE }

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

#do  tick = ->
#    requestAnimationFrame tick
    
queueMicrotask =>
    pos = new Position.alloc()
    clr = new Color.alloc()
    procedure = new Procedure.alloc().set "on?"
    protocol = new Protocol.alloc()  
    protocol2 = new Protocol.alloc()  

    mesh = new Mesh.alloc()

    procedure.addProtocol protocol
    procedure.addProtocol protocol2

    log { procedure, pos, clr, protocol, protocol2 }
    warn mesh

    warn meshClassPtri = ClassPointer.of mesh
    warn meshClassPtri.alloc Position
    warn meshClassPtri.alloc Rotation
    warn meshClassPtri.alloc Scale
    warn meshClassPtri.alloc Color

    protocol.linkedClass = Position
    protocol.filterer = ( ptri ) ->
        2 is getPtriClassi ptri

    protocol2.linkedClass = Color
    protocol2.filterer = ( ptri ) ->
        3 is getPtriClassi ptri

    #error "protocol.match(pos):", protocol.match( pos )
    #error "protocol.match(clr):", protocol.match( clr )



