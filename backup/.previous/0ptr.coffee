{ log, warn, error, debug } = console

ALLOCALIGN_BYTELENGTH = +4
PTRHEADERS_BYTELENGTH = -4

#? 0 <-- BYTEOFFSET_RESVOFFSET
BYTEOFFSET_RESVOFFSET = PTRHEADERS_BYTELENGTH += 4
getRsvAsUint8 = ( ptri = this ) -> Atomics.load ui8, ptri
hitRsvAsUint8 = ( ival = 1, ptri = this ) -> !Atomics.or    ui8, ptri, ival
addRsvAsUint8 = ( ival = 1, ptri = this ) ->  Atomics.add   ui8, ptri, ival
subRsvAsUint8 = ( ival = 1, ptri = this ) ->  Atomics.sub   ui8, ptri, ival
andRsvAsUint8 = ( ival = 1, ptri = this ) ->  Atomics.and   ui8, ptri, ival
setRsvAsUint8 = ( ival = 0, ptri = this ) ->  Atomics.store ui8, ptri, ival

getRsvAsInt32 = ( ptri = this ) -> dvw.getInt32 ptri + BYTEOFFSET_RESVOFFSET, iLE
setRsvAsInt32 = ( ival = 0, ptri = this ) ->  dvw.setInt32 ptri + BYTEOFFSET_RESVOFFSET, ival, iLE ; ival

getRsvAsInt16 = ( ptri = this ) -> dvw.getInt16 ptri + BYTEOFFSET_RESVOFFSET, iLE
setRsvAsInt16 = ( ival = 0, ptri = this ) ->  dvw.setInt16 ptri + BYTEOFFSET_RESVOFFSET, ival, iLE ; ival

BYTEOFFSET_CLASSINDEX = PTRHEADERS_BYTELENGTH += 4
getClassIndex = ( ptri = this ) -> dvw.getInt32 ptri + BYTEOFFSET_CLASSINDEX, iLE
setClassIndex = ( ival , ptri = this ) -> dvw.setInt32 ptri + BYTEOFFSET_CLASSINDEX, ival, iLE 

BYTEOFFSET_SCOPEINDEX = PTRHEADERS_BYTELENGTH += 4
getScopeIndex = ( ptri = this ) -> dvw.getInt32 ptri + BYTEOFFSET_SCOPEINDEX, iLE
setScopeIndex = ( ival , ptri = this ) -> dvw.setInt32 ptri + BYTEOFFSET_SCOPEINDEX, ival, iLE 

BYTEOFFSET_PARENTPTRI = PTRHEADERS_BYTELENGTH += 4
getParentPtri = ( ptri = this ) -> dvw.getInt32 ptri + BYTEOFFSET_PARENTPTRI, iLE
setParentPtri = ( ival , ptri = this ) -> dvw.setInt32 ptri + BYTEOFFSET_PARENTPTRI, ival, iLE 

BYTEOFFSET_BYTEOFFSET = PTRHEADERS_BYTELENGTH += 4
getByteOffset = ( ptri = this ) -> dvw.getInt32 ptri + BYTEOFFSET_BYTEOFFSET, iLE
setByteOffset = ( ival , ptri = this ) -> dvw.setInt32 ptri + BYTEOFFSET_BYTEOFFSET, ival, iLE 

BYTEOFFSET_BYTELENGTH = PTRHEADERS_BYTELENGTH += 4
getByteLength = ( ptri = this ) -> dvw.getInt32 ptri + BYTEOFFSET_BYTELENGTH, iLE
setByteLength = ( ival , ptri = this ) -> dvw.setInt32 ptri + BYTEOFFSET_BYTELENGTH, ival, iLE 
addByteLength = ( ival , ptri = this ) -> pval = getByteLength ptri; setByteLength( ival + pval, ptri ); pval

PTRHEADERS_BYTELENGTH += 4

stringToBytes = TextEncoder::encode.bind new TextEncoder
bytesToString = TextDecoder::decode.bind new TextDecoder

integerToByte = ( ival ) -> new Uint8Array Int32Array.of( Number ival ).buffer
byteToInteger = ( data ) -> new Int32Array( data.slice().buffer )[ 0 ]

atomic[0] ||= PTRHEADERS_BYTELENGTH
atomic[1] ||= PTRHEADERS_BYTELENGTH

palloc = Atomics.add.bind Atomics, atomic, 0, PTRHEADERS_BYTELENGTH
malloc = Atomics.add.bind Atomics, atomic, 1
offset = Atomics.load.bind Atomics, atomic, 0

scopei = ( any ) ->
    if -1 is (i = scp.indexOf(any))
        i += scp.push(any)
    i

export class Pointer                extends Number

    @byteLength : 4

    @TypedArray : Uint8Array

    @defineProperty : ->
        @classPointer.defineProperty( arguments... )

    @definePointer : ->
        @classPointer.definePointer( arguments... )

    buffer      : bvw.buffer
    
    constructor : ( ptri ) -> super( ptri ).onconstruct()

    onconstruct : -> this

    onallocate  : -> this

    getUint8    : ( byteOffset = 0 ) ->
        bvw.getUint8   getByteOffset(this) + byteOffset
    
    setUint8    : ( byteOffset = 0, value = 0 ) ->
        bvw.setUint8   getByteOffset(this) + byteOffset, value; value

    getInt8     : ( byteOffset = 0 ) ->
        bvw.getInt8   getByteOffset(this) + byteOffset
    
    setInt8     : ( byteOffset = 0, value = 0 ) ->
        bvw.setInt8   getByteOffset(this) + byteOffset, value; value

    loadUint8   : ( byteOffset = 0 ) ->
        Atomics.load bu8, getByteOffset(this) + byteOffset 
    
    storeUint8  : ( byteOffset = 0, value = 0 ) ->
        Atomics.store bu8, getByteOffset(this) + byteOffset, value 

    loadUint32  : ( byteOffset = 0 ) ->
        Atomics.load bu32, (getByteOffset(this) + byteOffset)/4 
    
    storeUint32 : ( byteOffset = 0, value = 0 ) ->
        index = (getByteOffset(this) + byteOffset)/4
        if !Number.isInteger
            throw /MODULUS_ERR/
        Atomics.store bu32, index, value 

    addUint32   : ( byteOffset = 0, value = 0 ) ->
        index = (getByteOffset(this) + byteOffset)/4
        Atomics.add bu32, index, value 

    getInt16    : ( byteOffset = 0 ) ->
        bvw.getInt16   getByteOffset(this) + byteOffset, iLE
    
    setInt16    : ( byteOffset = 0, value = 0 ) ->
        bvw.setInt16   getByteOffset(this) + byteOffset, value, iLE; value

    getUint16   : ( byteOffset = 0 ) ->
        bvw.getUint16  getByteOffset(this) + byteOffset, iLE
    
    setUint16   : ( byteOffset = 0, value = 0 ) ->
        bvw.setUint16  getByteOffset(this) + byteOffset, value, iLE; value

    getUint32   : ( byteOffset = 0 ) ->
        bvw.getUint32  getByteOffset(this) + byteOffset, iLE
    
    setUint32   : ( byteOffset = 0, value = 0 ) ->
        bvw.setUint32  getByteOffset(this) + byteOffset, value, iLE; value

    getInt32    : ( byteOffset = 0 ) ->
        bvw.getInt32   getByteOffset(this) + byteOffset, iLE
    
    setInt32    : ( byteOffset = 0, value = 0 ) ->
        bvw.setInt32   getByteOffset(this) + byteOffset, value, iLE; value

    getFloat32  : ( byteOffset = 0 ) ->
        bvw.getFloat32 getByteOffset(this) + byteOffset, iLE
    
    setFloat32  : ( byteOffset = 0, value = 0 ) ->
        bvw.setFloat32 getByteOffset(this) + byteOffset, value, iLE; value

    appendChild : ( ptri ) ->
        setParentPtri this, ptri; ptri

    append      : ( ptri ) ->
        setParentPtri this, ptri; this

    @of         : ( ptri ) ->
        if  ptri 
            if  classIndex = getClassIndex ptri
                return new scp[ classIndex ] ptri
            return 0
        return 0

    @new        : ( byteLength ) ->

        if !byteLength
            byteLength = if clsp = @classPointer
                clsp.byteLength
            else this.byteLength

        ptri = palloc()

        if  byteLength

            setByteLength byteLength, ptri
            if  mod = byteLength % ALLOCALIGN_BYTELENGTH
                byteLength += ALLOCALIGN_BYTELENGTH - mod
            setByteOffset malloc(byteLength), ptri

        setClassIndex scopei(this), ptri

        Object.setPrototypeOf new Pointer( ptri ), @prototype

    filter      : ( testFn ) ->
        childs = []
        index = 0
        ptri = +this 
        ptrj = offset()

        while ptrj -= PTRHEADERS_BYTELENGTH
            unless ptri - getParentPtri ptrj
                ptrj = Pointer.of ptrj
                if !testFn or testFn( ptrj, index )
                    childs[ index++ ] = ptrj

        childs

    includes    : ( ptri ) ->
        Boolean @find ( ptrj ) -> !(ptrj - ptri)


    find        : ( testFn ) ->
        ptri = +this 
        ptrj = offset()
        index = 0

        while ptrj -= PTRHEADERS_BYTELENGTH
            unless ptri - getParentPtri ptrj
                ptrj = Pointer.of ptrj
                if  testFn( ptrj, index++ )
                    return ptrj 

        null

    resize      : ( byteLength = 0, dataBackup = on ) ->

        TypedArray = this.constructor.TypedArray
        length = byteLength / TypedArray.BYTES_PER_ELEMENT

        if  dataBackup
            dataBackup = @subarray().slice(0, length) 
            
        byteOffset = malloc byteLength

        if  mod = byteOffset % ALLOCALIGN_BYTELENGTH
            malloc ALLOCALIGN_BYTELENGTH - mod
            byteOffset += mod

        setByteLength byteLength, this
        setByteOffset byteOffset, this

        if  dataBackup
            subarray = new TypedArray sab, byteOffset, length
            subarray . set dataBackup

        this

    set         : ( arrayLike, index = 0 ) ->
        @subarray().set( arrayLike, index ); this

    subarray    : ( byteOffset = 0, byteLength, TypedArray ) ->

        TypedArray ||= @constructor.TypedArray
        byteOffset  += getByteOffset( this )
        byteLength ||= getByteLength( this )

        length = byteLength / TypedArray.BYTES_PER_ELEMENT
        new TypedArray( sab, byteOffset, length )

    dataView    : ( byteOffset = 0, byteLength, TypedArray ) ->
        byteOffset  += getByteOffset( this )
        byteLength ||= getByteLength( this )

        new DataView( sab, byteOffset, byteLength )

    toPrimitive : -> @subarray()

    toString    : -> @toPrimitive().toString()  

    eq          : ( any ) ->
        if  any instanceof Pointer
            any = any.toPrimitive()
        @toPrimitive() is any

export class TypedArrayPointer      extends Pointer

    @from   : ( arrayLike ) ->

        BYTES_PER_ELEMENT =
            this.TypedArray.BYTES_PER_ELEMENT

        if  Array.isArray arrayLike
            length = arrayLike.length
            byteLength = length * BYTES_PER_ELEMENT

        if  ArrayBuffer.isView arrayLike
            length = arrayLike.length
            byteLength = arrayLike.byteLength

            unless arrayLike instanceof @TypedArray
                arrayLike = new @TypedArray(
                    arrayLike.slice().buffer
                ) 

        if !isNaN arrayLike
            length = arrayLike
            byteLength = length * BYTES_PER_ELEMENT 
            arrayLike = new Array()

        ptri = @new byteLength
        ptri . subarray().set arrayLike
        ptri

    @getter : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        byteLength = desc.byteLength
        TypedArray = this.TypedArray

        return -> @subarray byteOffset, byteLength, TypedArray

    @setter : ( propertyName, desc = {} ) ->
        return -> this[ propertyName ].set arguments...

export class Uint8ArrayPointer      extends TypedArrayPointer
    @TypedArray : Uint8Array

export class Int16ArrayPointer      extends TypedArrayPointer
    @TypedArray : Int16Array

export class Uint16ArrayPointer     extends TypedArrayPointer
    @TypedArray : Uint16Array

export class Int32ArrayPointer      extends TypedArrayPointer
    @TypedArray : Int32Array

export class Uint32ArrayPointer     extends TypedArrayPointer
    @TypedArray : Uint32Array

export class Float32ArrayPointer    extends TypedArrayPointer
    @TypedArray : Float32Array       

export class Vector2Pointer         extends Float32ArrayPointer
    @byteLength : 4 * 2

export class Vector3Pointer         extends Float32ArrayPointer
    @byteLength : 4 * 3

export class Vector4Pointer         extends Float32ArrayPointer
    @byteLength : 4 * 4

export class Matrix2Pointer         extends Float32ArrayPointer
    @byteLength : 4 * 2 * 2

export class Matrix3Pointer         extends Float32ArrayPointer
    @byteLength : 4 * 3 * 3

export class Matrix4Pointer         extends Float32ArrayPointer
    @byteLength : 4 * 4 * 4

export class NumberPointer          extends Pointer

    @from       : ( value = 0, ProtoPtr = this ) ->

        if  ProtoPtr is NumberPointer
        
            unless value
                return Uint8Number.new()

            ProtoPtr =
            if !Number.isSafeInteger value
                 if Number.isInteger value then "BigInt64"
                 else Float32Number
            else if value < 0 and absv2 = value * -2
                 if absv2 <= 0xff then Int8Number
                 else if absv2 <= 0xffff then Int16Number
                 else if absv2 <= 0xffffffff then Int32Number
                 else if value = BigInt( value ) then "BigInt64"
            else if value <= 0xff then Uint8Number
            else if value <= 0xffff then Uint16Number
            else if value <= 0xffffffff then Uint32Number
            else if value = BigInt( value ) then "BigUint64"

            return ProtoPtr.from value

        @new( @byteLength ).set value * 1

export class Float32Number          extends NumberPointer

    @byteLength : 4 * 1

    @TypedArray : Float32Array
    
    @alias      : "Float32"       

    set         : ( value = 0 ) ->
        @setFloat32 0, value
        return this

    toPrimitive : ->
        return @getFloat32 0
        
export class Int32Number            extends NumberPointer

    @byteLength : 4

    @TypedArray : Int32Array

    set         : ( value = 0 ) ->
        @setInt32 0, value
        return this

    toPrimitive : ->
        return @getInt32 0

export class Uint32Number           extends NumberPointer

    @byteLength : 4

    @TypedArray : Uint32Array

    set         : ( value = 0 ) ->
        @setUint32 0, value
        return this
        
    toPrimitive : ->
        return @getUint32 0

export class Uint32AtomicNumber     extends NumberPointer

    @byteLength : 4

    @TypedArray : Uint32Array

    set         : ( value = 0 ) ->
        @store value
        return this

    store       : ( value = 0 ) ->
        @storeUint32 0, value

    add         : ( value = 0 ) ->
        @addUint32 0, value
        
    toPrimitive : ->
        @loadUint32 0

export class PointerLink            extends Pointer

    @TypedArray : Int32Array

    @byteLength : 4

    @from       : ( ptri ) ->
        unless ptri instanceof Pointer
            throw [/LINKER/, arguments... ]

        @new().set( ptri )

    toPrimitive : -> Pointer.of @getInt32 0

    getProperty : -> @target.getProperty arguments...

    set         : -> @setInt32 0, arguments[0] ; this

    from        : -> @toPrimitive().from

    Object.defineProperty this::, "target",
        enumerable  : on
        get         : PointerLink::toPrimitive

export class Int16Number            extends NumberPointer

    @byteLength : 2

    @TypedArray : Int16Array

    set         : ( value = 0 ) ->
        @setInt16 0, value
        return this
        
    toPrimitive : ->
        return @getInt16 0

export class Int8Number             extends NumberPointer

    @byteLength : 1

    @TypedArray : Int8Array

    set         : ( value = 0 ) ->
        @setInt8 0, value
        return this
        
    toPrimitive : ->
        return @getInt8 0

export class Uint16Number           extends NumberPointer

    @byteLength : 2

    @TypedArray : Uint16Array

    set         : ( value = 0 ) ->
        @setUint16 0, value
        return this
        
    toPrimitive : ->
        return @getUint16 0

export class Uint8Number            extends NumberPointer
    
    @byteLength : 1

    @TypedArray : Uint8Array

    set         : ( value = 0 ) ->
        @setUint8 0, value
        return this
        
    toPrimitive : ->
        return @getUint8 0

export class Uint8AtomicNumber      extends NumberPointer
    
    @byteLength : 1

    @TypedArray : Uint8Array

    set         : ( value = 0 ) ->
        @storeUint8 0, value
        return this
        
    toPrimitive : ->
        return @loadUint8 0

export class BooleanPointer         extends Uint8Number

    toPrimitive : -> Boolean super()

export class BooleanAtomic          extends Uint8AtomicNumber
        
    toPrimitive : -> Boolean super()

export class StringPointer          extends Pointer

    @TypedArray : Uint8Array

    @from : ( string = "" ) ->
        if  typeof string is "string"
            data = stringToBytes "#{string}"

        else if string instanceof Uint8Array
            data = string.slice()

        else if string instanceof this
            return string

        ptri = this
            .new( data.byteLength )
            .set( data )

        ptri

    toPrimitive : ->
        bytesToString @subarray().slice()

    set         : ( value = "" ) ->
        return this unless "#{value}".trim()

        if  typeof value is "string"
            return @set stringToBytes "#{value}"

        unless value instanceof Uint8Array
            throw /ERRSTRSET/    
        
        valueArray = @subarray()
        thisLength = getByteLength this
        nextLength = value.byteLength

        if  nextLength - thisLength

            if  nextLength < thisLength
                setByteLength nextLength, this
                valueArray.fill 0
            else
                @resize( nextLength, null )
                valueArray = @subarray()    

        valueArray.set value

        this

export class ObjectPointer          extends Pointer  

    @byteLength : 4

    @from       : ( any ) ->
        @new().set( any )

    toPrimitive : ->
        scp[ getScopeIndex this ]

    getProperty : ( propertyName = "" ) ->
        @toPrimitive()[ propertyName ]

    set         : ( object ) ->
        unless isNaN object
            throw /NAN_TOSCP/

        setScopeIndex scopei(object), this

        this

export class Property               extends Pointer
    @byteLength : 24

    @from : ( propertyName, desc = {} ) ->
        { byteLength, byteOffset, isRequired } = desc

        ptri = @new @byteLength

        ptri . byteLength   = Int32Number.from byteLength
        ptri . byteOffset   = Int32Number.from byteOffset
        ptri . description  = ObjectPointer.from desc
        ptri . isRequired   = BooleanPointer.from isRequired
        ptri . name         = StringPointer.from propertyName

        if  instanceOf = desc.instanceOf
            ptri.instanceOf = ObjectPointer.from instanceOf

        ptri

    from  : ->
        unless @instanceOf.toPrimitive().from
            throw [ /UNCONST/, @instanceOf ]

        @instanceOf.toPrimitive().from( arguments... )

export class ClassPointer           extends ObjectPointer

    @byteLength : 4

    @from : ( Class ) ->

        ptri = super Class
        ptri.name = StringPointer.from Class.name
        proto = Object.getPrototypeOf Class

        if  proto isnt ObjectPointer
            proto.classPointer.appendChild ptri

        return ptri

    getProperty     : ( propertyName = "" ) ->
        @find (i) -> i.name.toPrimitive() is propertyName

    getAllocLength  : ->
        byteLength = 0

        for o in @filter (i) -> i instanceof Property
            byteLength += 4

        if  parent = @parent
            byteLength += parent.getAllocLength()

        byteLength

    defineProperty  : ( propertyName, desc = {} ) ->

        desc.byteLength = Number desc.byteLength
        desc.byteOffset = @getAllocLength()

        @appendChild Property.from propertyName, desc  
        Object.defineProperty @class::, propertyName, desc
        
        this

    definePointer : ( propertyName, desc = {} ) ->

        byteOffset = @getAllocLength()
        instanceOf = desc.instanceOf
        byteLength = desc.byteLength
        isRequired = desc.isRequired

        get = ->
            if  ptri = @getInt32 byteOffset
                return Pointer.of ptri

            if  isRequired and ptri = instanceOf.new()
                @setInt32 byteOffset, ptri

            ptri

        set = ( value ) ->          
            unless value instanceof instanceOf
                value = instanceOf.from value
            @setInt32 byteOffset, value

        @appendChild Property.from propertyName, {
            get, set, byteOffset, byteLength, 
            isRequired, instanceOf
        }  

        Object.defineProperty @class::, propertyName, {
            ...desc, get, set, 
        }        
        
        this

Object.defineProperties Pointer::,
    hitRsvAsUint8 : value : hitRsvAsUint8
    getRsvAsUint8 : value : getRsvAsUint8
    setRsvAsUint8 : value : setRsvAsUint8
    andRsvAsUint8 : value : andRsvAsUint8
    subRsvAsUint8 : value : subRsvAsUint8
    addRsvAsUint8 : value : addRsvAsUint8

    getRsvAsInt32 : value : getRsvAsInt32
    setRsvAsInt32 : value : setRsvAsInt32

    getRsvAsInt16 : value : getRsvAsInt16
    setRsvAsInt16 : value : setRsvAsInt16

Object.defineProperty Pointer::, "#primitive", 
    get : -> @toPrimitive()

Object.defineProperty Pointer::, "{{Dump}}",
    get : -> {
        bufferData : @subarray()
        byteLength : getByteLength this
        byteOffset : getByteOffset this
        classIndex : getClassIndex this
        classProto : scp[ getClassIndex this ]
        scopeIndex : getScopeIndex this
        scopedItem : scp[ getScopeIndex this ]
        ptriOffset : this * 1
        headerData : new Int32Array buf, this, 6
        TypedArray : @constructor.TypedArray.name
    }

Object.defineProperty ObjectPointer::, "children",
    enumerable: on
    configurable: on
    get : Pointer::filter

Object.defineProperty ObjectPointer::, "parent",
    enumerable: on
    configurable: on
    get : -> Pointer.of getParentPtri this

Object.defineProperty ClassPointer::, "class",
    enumerable: on,
    get : -> @toPrimitive()

Object.defineProperty ClassPointer::, "name",
    enumerable: on,
    get : -> new StringPointer @getInt32 0
    set : -> @setInt32 0, arguments[0]

Object.defineProperty ClassPointer::, "byteLength",
    enumerable: on,
    get : -> @getAllocLength()

Object.defineProperty Property::, "byteLength",
    enumerable: on,
    get : -> new Int32Number @getInt32 0
    set : -> @setInt32 0, arguments[0]

Object.defineProperty Property::, "byteOffset",
    enumerable: on,
    get : -> new Int32Number @getInt32 4
    set : -> @setInt32 4, arguments[0]

Object.defineProperty Property::, "isRequired",
    enumerable: on,
    get : -> new BooleanPointer @getInt32 8
    set : -> @setInt32 8, arguments[0]

Object.defineProperty Property::, "description",
    enumerable: on,
    get : -> new ObjectPointer @getInt32 12
    set : -> @setInt32 12, arguments[0]

Object.defineProperty Property::, "parent",
    enumerable: on,
    get : -> Pointer.of getParentPtri this

Object.defineProperty Property::, "name",
    enumerable: on,
    get : -> new StringPointer @getInt32 16
    set : -> @setInt32 16, arguments[0]

Object.defineProperty Property::, "instanceOf",
    enumerable: on,
    get : -> Pointer.of @getInt32 24
    set : -> @setInt32 24, arguments[0]

