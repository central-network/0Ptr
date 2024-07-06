{ log, warn, error } = console

iLE = new Uint8Array( Uint32Array.of(1).buffer ).at 0
buf = new ArrayBuffer 4e4
dvw = new DataView buf
i32 = new Int32Array buf
ui8 = new Uint8Array buf
scp = new Array undefined
sab = new ArrayBuffer 4e5
bvw = new DataView sab
bu8 = new Uint8Array sab

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

atomic = Int32Array.of PTRHEADERS_BYTELENGTH, PTRHEADERS_BYTELENGTH
palloc = Atomics.add.bind Atomics, atomic, 0, PTRHEADERS_BYTELENGTH
malloc = Atomics.add.bind Atomics, atomic, 1
offset = Atomics.load.bind Atomics, atomic, 0

scopei = ( any ) -> if -1 is (i = scp.indexOf(any)) then i += scp.push(any) else i ; i

export class Pointer extends Number

    @byteLength : 4

    @TypedArray : Uint8Array

    @defineProperty : ->
        @classPointer.defineProperty( arguments... )

    @definePointer : ->
        @classPointer.definePointer( arguments... )

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> Pointer.of @getInt32 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return ( value ) ->
        
            unless value instanceof Pointer
                throw /PTRSET_ERR/
            
            @setInt32 byteOffset, value        

    buffer      : bvw.buffer
    
    constructor : ( ptri ) -> super( ptri ).onconstruct()

    onconstruct : -> this

    onallocate  : -> this

    getUint8    : ( byteOffset = 0 ) ->
        bvw.getUint8   getByteOffset(this) + byteOffset
    
    setUint8    : ( byteOffset = 0, value = 0 ) ->
        bvw.setUint8   getByteOffset(this) + byteOffset, value; value

    loadUint8   : ( byteOffset = 0 ) ->
        Atomics.load bu8, getByteOffset(this) + byteOffset 
    
    storeUint8  : ( byteOffset = 0, value = 0 ) ->
        Atomics.store bu8, getByteOffset(this) + byteOffset, value 

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
        count = 0
        ptri = +this 
        ptrj = offset()

        while ptrj -= PTRHEADERS_BYTELENGTH
            unless ptri - getParentPtri ptrj
                ptrj = Pointer.of ptrj
                if !testFn or testFn( ptrj, count )
                    childs[ count++ ] = ptrj

        childs

    find        : ( testFn ) ->
        ptri = +this 
        ptrj = offset()

        while ptrj -= PTRHEADERS_BYTELENGTH
            unless ptri - getParentPtri ptrj
                ptrj = Pointer.of ptrj
                return ptrj if testFn( ptrj )

        null

    resize      : ( byteLength = 0, dataBackup = on ) ->

        throw "resize"

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

    toPrimitive : -> @subarray()

    toString    : -> @toPrimitive().toString()  

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

export class TypedArrayPointer      extends Pointer

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

    @from       : ( value = 0 ) ->
        return @new().set value

export class Float32Number          extends NumberPointer

    @byteLength : 4 * 1

    @TypedArray : Float32Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @getFloat32 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @setFloat32 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @setFloat32 0, value
        return this

    toPrimitive : ->
        return @getFloat32 0
        
export class Int32Number            extends NumberPointer

    @byteLength : 4

    @TypedArray : Int32Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @getInt32 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @setInt32 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @setInt32 0, value
        return this

    toPrimitive : ->
        return @getInt32 0

export class Uint32Number           extends NumberPointer

    @byteLength : 4

    @TypedArray : Uint32Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @getUint32 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @setUint32 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @setUint32 0, value
        return this
        
    toPrimitive : ->
        return @getUint32 0

export class Int16Number            extends NumberPointer

    @byteLength : 2

    @TypedArray : Int16Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @getInt16 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @setInt16 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @setInt16 0, value
        return this
        
    toPrimitive : ->
        return @getInt16 0

export class Uint16Number           extends NumberPointer

    @byteLength : 2

    @TypedArray : Uint16Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @getUint16 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @setUint16 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @setUint16 0, value
        return this
        
    toPrimitive : ->
        return @getUint16 0

export class Uint8Number            extends NumberPointer
    
    @byteLength : 1

    @TypedArray : Uint8Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @getUint8 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @setUint8 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @setUint8 0, value
        return this
        
    toPrimitive : ->
        return @getUint8 0

export class Uint8AtomicNumber      extends NumberPointer
    
    @byteLength : 1

    @TypedArray : Uint8Array

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @loadUint8 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> @storeUint8 byteOffset, arguments[0]

    set         : ( value = 0 ) ->
        @storeUint8 0, value
        return this
        
    toPrimitive : ->
        return @loadUint8 0

export class BooleanAtomic          extends Uint8AtomicNumber
    
    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> Boolean @loadUint8 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> Boolean @storeUint8 byteOffset, arguments[0]
        
    toPrimitive : -> Boolean super()

export class StringPointer         extends Pointer

    @TypedArray : Uint8Array

    @byteLength : 4

    @from : ( string = "" ) ->
        byteArray = stringToBytes string

        this
            .new( byteArray.byteLength )
            .set( byteArray )

    toPrimitive : ->
        bytesToString @subarray().slice()
        

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> StringPointer.of @getInt32 byteOffset

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return ( value = "" ) ->
            if  typeof value is "string"
                value = StringPointer.from value

            unless value instanceof StringPointer
                throw /STRSET_ERR/
            
            @setInt32 byteOffset, value      


    set         : ( value = "" ) ->

        if  typeof value is "string"
            value = stringToBytes value

        unless value instanceof Uint8Array
            throw /ERRSTRSET/    

        valueArray = this.subarray()
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
        
        return this

export class ObjectPointer         extends Pointer  

    @from       : ( object ) ->
        ptri = @new().set( object )
        ptri . onallocate()
        ptri

    toPrimitive : ->
        scp[ getScopeIndex this ]

    set         : ( object ) ->
        if !isNaN object
            object = scp[ object ]

        setScopeIndex scopei(object), this

        this

Object.defineProperty ObjectPointer::, "children",
    enumerable: on
    configurable: on
    get : Pointer::filter

Object.defineProperty ObjectPointer::, "parent",
    enumerable: on
    configurable: on
    get : -> Pointer.of getParentPtri this


export class Property        extends Pointer
    @byteLength : 20

    @from : ( propertyName, desc = {} ) ->
        { byteLength, byteOffset, length } = desc

        ptri = @new()
        ptri . description  = desc
        ptri . length       = Int32Number.from length
        ptri . byteLength   = Int32Number.from byteLength
        ptri . byteOffset   = Int32Number.from byteOffset
        ptri . name         =  StringPointer.from propertyName
        ptri

export class ClassPointer    extends ObjectPointer

    @byteLength : 4

    @from : ( Class ) ->
        ptri = super Class
        ptri . name = StringPointer.from Class.name
        proto = Object.getPrototypeOf Class

        if  proto isnt ObjectPointer
            proto.classPointer.appendChild ptri

        return ptri

    @getter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return -> scp[ @getInt32 byteOffset ]

    @setter     : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return ( value ) ->
            @setInt32 byteOffset, scopei(value)      


    getAllocLength : ->
        byteLength = 0

        for o in @filter (i) -> i instanceof Property
            byteLength += o.byteLength.toPrimitive()

        if  parent = @parent
            byteLength += parent.getAllocLength()

        byteLength

    defineProperty  : ( propertyName, desc = {} ) ->

        desc.byteLength = Number desc.byteLength
        desc.byteOffset = @getAllocLength()
        desc.length   ||= desc.byteLength

        @appendChild Property.from propertyName, desc  

        desc.get   and= desc.get(  propertyName, desc )
        desc.set   and= desc.set(  propertyName, desc )
        desc.value and= desc.value(propertyName, desc )

        Object.defineProperty @class::, propertyName, desc; this

    definePointer : ( propertyName, desc = {} ) ->

        desc.get ||= desc.instanceOf.getter
        desc.set ||= desc.instanceOf.setter

        if  byteLength = desc.instanceOf.byteLength
            desc.byteLength ||= byteLength

        desc.length ||= ( desc.byteLength /
            desc.instanceOf.TypedArray.BYTES_PER_ELEMENT ) 
        
        desc.byteLength ||= ( desc.length *
            desc.instanceOf.TypedArray.BYTES_PER_ELEMENT )
        
        @defineProperty propertyName, desc

Object.defineProperty ClassPointer::, "class",
    enumerable: on,
    get : -> @toPrimitive()

Object.defineProperty ClassPointer::, "name",
    enumerable: on,
    get : -> new StringPointer @getUint32 0
    set : -> @setUint32 0, arguments[0]

Object.defineProperty ClassPointer::, "byteLength",
    enumerable: on,
    get : -> @getAllocLength()

Object.defineProperty Property::, "byteLength",
    enumerable: on,
    get : -> new Int32Number @getUint32 0
    set : -> @setUint32 0, arguments[0]

Object.defineProperty Property::, "byteOffset",
    enumerable: on,
    get : -> new Int32Number @getUint32 4
    set : -> @setUint32 4, arguments[0]

Object.defineProperty Property::, "length",
    enumerable: on,
    get : -> new Int32Number @getUint32 8
    set : -> @setUint32 8, arguments[0]

Object.defineProperty Property::, "description",
    enumerable: on,
    get : -> scp[ @getUint32 12 ]
    set : -> @setUint32 12, scopei arguments[0]

Object.defineProperty Property::, "parent",
    enumerable: on,
    get : -> Pointer.of getParentPtri this

Object.defineProperty Property::, "name",
    enumerable: on,
    get : -> new StringPointer @getUint32 16
    set : -> @setUint32 16, arguments[0]
