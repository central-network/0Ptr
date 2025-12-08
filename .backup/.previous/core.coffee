{ log, warn, error, debug } = self.console

self.Object.defineProperty DataView::, "isLittleEndian", {
    value : self.Boolean iLE = new self.Uint8Array( self.Uint32Array.of(1).buffer ).at 0    
}

self.Object.defineProperty DataView::, "set", {
    value : ( alias = "Float32", offset = 0, value = 0 ) ->
        this[ "set" + alias ]( offset, value, iLE ) ; value    
}

self.Object.defineProperty DataView::, "get", {
    value : ( alias = "Float32", offset = 0, value = 0 ) ->
        this[ "get" + alias ]( offset, iLE )
}


MAX_INT8   = self.Math.floor -0xff/2
MAX_INT16  = self.Math.floor -0xffff/2
MAX_INT32  = self.Math.floor -0xffffffff/2
MAX_UINT8  = 0xff + 1
MAX_UINT16 = 0xffff + 1
MAX_UINT32 = 0xffffffff + 1

dvw = new self.DataView new self.ArrayBuffer 4 * 1e5
self.dump = ->
    ptrj = Optr.byteLength
    ptrs = []

    while ptrj = Optr.of dvw.get "Int32", ptrj
        ptrs.push ptrj

    ptrs

export default class Optr   extends self.Number

    @buffer     : dvw.buffer      

    @byteLength : 12

    @protoClass : 0

    @storage    : [,]

    @TypedArray : self.Uint8Array

    @define "{[Pointer]}"   , get : ->

        subarray = @subarray()

        base        : subarray.buffer
        buffer      : subarray.slice().buffer
        subarray    : subarray
        parent      : @getParent()
        children    : @getChildren()
        toPrimitive : @toPrimitive()
        toBoolean   : @toBoolean()
        toString    : @toString()
        toNumber    : @toNumber()

    @define "#primitive"    , get : ->
        @toPrimitive()        

    @define     : ( prop, desc, target = @prototype ) ->
        self.Object.defineProperty target, prop, desc

    @extend     : ( name ) ->
    
        self.Super = this
        self.Child = null

        $ = document.createElement( "script" )
        $.text = "self.Child =
        (class #{name} extends Super {})"
        $ = document.body.appendChild($).remove()

        ptri = Class.from Child

        delete self.Super
        delete self.Child

        ptri

    @hasOwn     : ( prop, target = @prototype ) ->
        self.Object.hasOwn target, prop

    @from       : ( any ) ->
        if  Optr.isPrototypeOf this
            ptri = @alloc()
            self
                .Object.keys( any || {} )
                .filter ( prop ) => @hasOwn prop
                .forEach ( prop ) ->
                    ptri[ prop ] = any[ prop ]

            return ptri

        unless any
            return Boolean.from any

        if  any instanceof Optr
            return any

        Prototype = switch any.constructor
            when self.Boolean   then Boolean
            when self.Number    then Number
            when self.String    then String
            when self.Array     then Array
            when self.Object    then Object
            else ExtRef

        return Prototype.from any

    @of         : ( ptri ) ->
        if  ptri and clsi = dvw.get "Int32", ptri + 4
            return new @storage[ clsi ] ptri
        null

    @default    : ->
        @alloc()

    @alloc      : ( moreByteLength = 0 ) ->
        byteLength = @byteLength + moreByteLength
        ptri = Optr.byteLength

        while next = dvw.get "Int32", ptri
            ptri = next

        nextOffset = ptri + byteLength

        if  mod = nextOffset % 4
            nextOffset += 4 - mod
            
        dvw.set "Int32", ptri, nextOffset
        dvw.set "Int32", ptri + 4, @classIndex

        new this ptri

    @store      : ( any ) ->
        if -1 is i = @storage.indexOf any
            i += @storage.push any
        i

    subarray    : ( byteOffset = 0, byteLength, TypedArray ) ->
        if  byteOffset instanceof Function
            TypedArray = byteOffset
            byteOffset = 0

        byteLength ||= dvw.get("Uint32",@) - @
        TypedArray ||= @constructor.TypedArray

        new TypedArray(
            Optr.buffer , this + byteOffset,
            byteLength / TypedArray.BYTES_PER_ELEMENT
        )

    detach      : ->
        @subarray( self.Uint8Array ).slice().buffer

    toString    : ->
        "#{@toPrimitive()}"

    toNumber    : ->
        +this    

    toBoolean   : ->
        yes

    appendChild : ( ptrj ) ->
        dvw.set "Int32", ptrj + 8, this ; ptrj

    setParent   : ( ptri ) ->
        dvw.set "Int32", this + 8, ptri ; this
    
    isParentOf  : ( ptrj ) ->
        0 is this - dvw.get( "Int32", ptrj + 8 )

    getChildren : ->
        ptrj = Optr.byteLength
        kids = []

        while next = dvw.get "Int32", ptrj
            if  this.isParentOf ptrj
                kids.push Optr.of ptrj
            ptrj = next

        kids

    getParent   : ->
        Optr.of dvw.get "Int32", this + 8
    
    is          : ( any ) ->
        @toPrimitive() is any

export class Number         extends Optr

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 8

    nullOffset  : @byteOffset + 0
    
    signOffset  : @byteOffset + 1

    boolOffset  : @byteOffset + 2

    typeOffset  : @byteOffset + 3

    dataOffset  : @byteOffset + 4

    @TypedArray : self.Uint8Array

    @classIndex : @store this

    @TypeObject : {
        [    0 ] : "Uint8",      Uint8    : 0,
        [ 0x01 ] : Infinity,     Infinity : 0x01,
        [ 0x02 ] : NaN,          NaN      : 0x02,
        [ 0x03 ] : "Float32",    Float32  : 0x03,
        [ 0x04 ] : "Int8",       Int8     : 0x04,
        [ 0x05 ] : "Int16",      Int16    : 0x05,
        [ 0x06 ] : "Int32",      Int32    : 0x06,
        [ 0x08 ] : "Uint16",     Uint16   : 0x08,
        [ 0x09 ] : "Uint32",     Uint32   : 0x09
    }

    @define "type", enumerable: on, get : ->
        type = dvw.getUint8 this + @typeOffset
        this . constructor.TypeObject[ type ]
        
    @define "isFinite", enumerable: on, get : ->
        dvw.getUint8( this + @boolOffset ) > 1
    
    @define "isFloat", enumerable: on, get : ->
        dvw.getUint8( this + @boolOffset ) is 2

    @define "isSigned", enumerable: on, get : ->
        dvw.getUint8( this + @signOffset ) is 1

    @from       : ( number ) ->

        if "number" isnt typeof number
            throw /NOTANUMBER/

        if (number) is 0
            return @alloc()

        ptri = this.alloc()
        sign = number < 0
        type = null
        
        dvw.setUint8 ptri + @::nullOffset, 1
        dvw.setUint8 ptri + @::signOffset, sign

        if  self.Number.isNaN number
            type = NaN

        else if !self.Number.isFinite number
            type = Infinity
            dvw.setUint8 ptri + @::boolOffset, 1

        else
            if !self.Number.isInteger number 
                type = "Float32"
                dvw.setUint8 ptri + @::boolOffset, 2

            else if sign

                if      number > MAX_INT8   then type = "Int8"
                else if number > MAX_INT16  then type = "Int16"
                else if number > MAX_INT32  then type = "Int32"            

                dvw.setUint8 ptri + @::boolOffset, 3

            else
                if      number < MAX_UINT8  then type = "Uint8"
                else if number < MAX_UINT16 then type = "Uint16"
                else if number < MAX_UINT32 then type = "Uint32"    

                dvw.setUint8 ptri + @::boolOffset, 4
            
            dvw.set type, ptri + @::dataOffset, number

        dvw.setUint8 ptri + @::typeOffset, @TypeObject[ type ]

        ptri

    toPrimitive : -> @toNumber()

    toBoolean   : -> dvw.getUint8( this + @nullOffset ) is 1

    toNumber    : ->
        if  dvw.getUint8 this + @nullOffset
            if !@isFinite
                return if @isSigned then -@type else @type
            return dvw.get @type, this + @dataOffset
        return 0

export class Boolean        extends Optr

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 2

    @TypedArray : self.Uint8Array

    @classIndex : @store this

    @TypeObject : {
        [    0 ] : 0,
        [ 0x01 ] : no,              [ no ]        : 0x01,
        [ 0x02 ] : NaN,             [ NaN ]       : 0x02,
        [ 0x03 ] : null,            [ null ]      : 0x03,
        [ 0x04 ] : undefined,       [ undefined ] : 0x04,
        [ 0x05 ] : "",              [ ""        ] : 0x05
    }

    @define "offval", enumerable: on, get : ( $ = @constructor ) ->
        $.TypeObject[ dvw.getUint8 this + $.byteOffset ]

    @from       : ( any ) ->
        ptri = @alloc()

        if !any
            dvw.setUint8(
                ptri + @byteOffset,
                @TypeObject[ any ]
            )

        return ptri

    toPrimitive : -> this.toBoolean()

    toBoolean   : -> !dvw.getUint8 this + @constructor.byteOffset

    toNumber    : -> @toBoolean() and 1 or 0

export class String         extends Optr

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 8

    @TypedArray : self.Uint8Array

    @classIndex : @store this

    @encode     : self.TextEncoder::encode.bind new self.TextEncoder

    @decode     : self.TextDecoder::decode.bind new self.TextDecoder

    textLengthOffset : @byteOffset + 4

    byteLengthOffset : @byteOffset

    @charOfCode : self.String.fromCharCode   
    
    @define "length", enumerable: on, get : ->
        dvw.get "Uint32", this + @textLengthOffset

    @from       : ( string, toString = off ) ->

        if "string" isnt typeof string
            unless toString
                throw /NOTASTRING/
            string = string.toString()
            
        if !string.length
            return @alloc()

        charArray = @encode string
        ptri = @alloc charArray.byteLength 

        dvw.set "Uint32", ptri + @::byteLengthOffset, charArray.byteLength
        dvw.set "Uint32", ptri + @::textLengthOffset, string.length

        return ptri.set( charArray )

    set         : ( charArray = [] ) ->
        @subarray().set( charArray ); this

    toPrimitive : -> @toString()

    toBoolean   : -> @length > 0

    subarray    : ->
        byteLength = dvw.get "Uint32", this + @byteLengthOffset
        super @constructor.byteLength, byteLength, self.Uint8Array

    toNumber    : ->
        num = 0
        for v, i in @subarray() 
            num += v * i
        num

    toString    : ->
        unless @toBoolean()
            return ""

        @constructor.decode(
             @subarray()
        )

export class Array          extends Optr

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 4

    @TypedArray : self.Uint32Array

    @classIndex : @store this

    @define "length", enumerable: on, get : ->
        dvw.get "Uint32", this + @constructor.byteOffset

    @from : ( array ) ->
        if !self.Array.isArray array
            throw /ARRAY_NOTARRAY/

        ptri = @alloc()

        if  i = array.length
            dvw.set "Uint32", ptri + this.byteOffset, i
            Optr.from(array[i]).setParent(ptri) while i--

        ptri

    toPrimitive : -> @toArray()

    toBoolean   : -> @length > 0

    toArray     : ->
        @getChildren().map ( ptri ) ->
            ptri.toPrimitive()

    forEach     : ( fn, thisArg = this ) ->
        return this unless i = this.length
        items = this.getChildren()
        
        while i--
            fn.call thisArg, items[i], i, items

        return this

    at          : ( index = 0 ) ->
        ptrj = Optr.byteLength
        while next = dvw.get "Int32", ptrj
            if  this.isParentOf ptrj
                if !index--
                    return Optr.of ptrj
            ptrj = next

        kids

export class Object         extends Optr

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 12

    @TypedArray : self.Uint32Array

    @classIndex : @store this

    @define "length", enumerable: on, get : ->
        dvw.get "Uint32", this + @constructor.byteOffset

    @from : ( object ) ->
        if !object or object.constructor.name isnt "Object"
            throw [ /OBJECT_NOTOBJECT/, object ]

        ptri = @alloc()
        keys = self.Object.keys object
        vals = self.Object.values object

        if  i = keys.length
            byteOffset = ptri + @byteOffset
            
            dvw.set "Uint32", byteOffset , i
            dvw.set "Uint32", byteOffset + 4, Array.from keys
            dvw.set "Uint32", byteOffset + 8, Array.from vals

        ptri

    keys        : ->
        Optr.of dvw.get "Uint32", this + @constructor.byteOffset + 4

    values      : ->
        Optr.of dvw.get "Uint32", this + @constructor.byteOffset + 8

    toPrimitive : -> @toObject()

    toBoolean   : Array::toBoolean

    toString    : -> JSON.stringify @toPrimitive()

    toObject    : ->
        object = {}
        values = @values()

        @keys().forEach ( keyi, i ) ->
            object[ keyi.toString() ] =
                values.at(i).toPrimitive()
                
        object

export class ExtRef         extends Optr

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 8

    @classIndex : @store this

    @TypedArray : self.Int32Array

    storeOffset : @byteOffset

    nameOffset  : @byteOffset + 4

    @define "object", enumerable: on, get : -> @toObject()

    @define "name", enumerable: on, get : -> @toString()

    @from       : ( any, name ) ->
        ptri = @alloc().set [ @store any ]
        name ||= any.name || any.constructor.name

        if !name then return ptri
        return ptri.setName( name )

    setName     : ( name = "" ) ->
        dvw.set "Int32", this + @nameOffset, String.from name
        this

    setObject   : ( any ) ->
        dvw.set "Int32", this + @storeOffset, @constructor.store any
        this

    set         : ( [ storeIndex ] ) ->
        dvw.set "Int32", this + @storeOffset, storeIndex
        this

    toPrimitive : -> @toObject()

    toBoolean   : -> true

    toString    : -> String.of( dvw.get "Int32", this + @nameOffset ).toPrimitive()

    toNumber    : -> dvw.get "Int32", this + @storeOffset

    toObject    : -> @constructor.storage[ dvw.get "Int32", this + @storeOffset ]

export class Property       extends ExtRef

    @classIndex : @store this

    @byteOffset : @byteLength

    @byteLength : @byteOffset + 2

    byteOffsetByteOffset : @byteOffset

    @define "byteOffset",
        enumerable:on,
        get : -> @toNumber()
        set : -> dvw.set "Int16", this + @byteOffsetByteOffset, arguments[0]

    @define "class", 
        enumerable:on,
        get : -> @toPrimitive()

    toNumber    : ->
        dvw.get "Int16", this + @byteOffsetByteOffset

export class Class          extends ExtRef

    @classIndex : @store this

    @define "class", enumerable:on, get : -> @toPrimitive()
    @define "properties", enumerable:on, get : -> @getChildren()
    @define "byteLength", enumerable:on, get : -> @properties.length * 4

    @from       : ( proto, name ) ->
        
        ptri = super proto, name || proto.name

        byteLength = Optr.byteLength
        classProps = self.Object.getOwnPropertyDescriptors proto
        protoProps = self.Object.getOwnPropertyDescriptors proto::

        delete classProps.length
        delete classProps.name
        delete classProps.prototype

        for prop, desc of classProps when value = desc.value
            continue if Optr.isPrototypeOf value
            (( prop, value ) ->
                self.Object.defineProperty this, prop, get: ( bind = value.bind ) ->
                    unless bind then return proto[ prop ] 
                    else return proto[ prop ].bind proto 
            ).call( ptri, prop, value )

        for prop, desc of protoProps when value = desc.value
            continue if prop.startsWith "constructor"
            continue unless Optr.isPrototypeOf value

            property = Property.from value, prop
            property . byteOffset = ptri.byteLength 
            property . setParent ptri

            byteLength += 4

            ((  property  ) ->

                offset = property.toNumber() + Optr.byteLength
                PClass = property.toPrimitive()

                self.Object.defineProperty @class::, property.toString(),
                    enumerable: on
                    get: ->
                        if ptri = dvw.get "Int32", this + offset
                            return PClass.of ptri
                        ptri = PClass.default()
                        dvw.set "Int32", this + offset, ptri
                        return ptri

                    set: ->
                        dvw.set "Int32", this + offset, PClass.from arguments[0]

            ).call( ptri, property )

        proto.byteLength = byteLength
        
        ptri

    from        : -> @object.from arguments...

    of          : -> @object.of arguments...

    define      : ( prop, desc ) ->
        PClass = desc.class
        target = this.class.prototype

        if  prop . startsWith "@"
            prop = prop.substring 1
            target = this

        byteOffset = this.class.byteLength
        @class.byteLength = 4 + byteOffset

        ptri = Property.from PClass, prop
        ptri . byteOffset = byteOffset 
        ptri . setParent this

        set = ( val ) ->
            dvw.set "Int32", this + byteOffset, PClass.from val

        get = ->
            PClass.from dvw.get "Int32", this + byteOffset

        if  defaultValue = desc.value
            get = ->
                if !ptri = dvw.get "Int32", this + byteOffset
                    set.call this, ptri = defaultValue
                PClass.from ptri
            delete desc.value

        options =
            writeable :on 
            enumerable :on 
            configurable:on

        self.Object.defineProperty target, prop, {
            get, set, 
            options..., desc...
        }

        this


export class Math           extends Optr

    @random     : self.Math.random

    @trunc      : self.Math.trunc

    @randomChar : ( upperCase = off ) ->
        if  upperCase
            return String.charOfCode @rangedRand 65, 90
        return String.charOfCode @rangedRand 97, 122

    @randomBool : ->
        @random() > .5

    @rangedRand : ( min = 0, max = 10 ) ->
        @trunc min + @random() * (max - min)

    @randomUUID : ( uuid ) ->
        uuid ||= 4
        if  "number" is typeof uuid
            if  uuid is 4
                uuid = "???!????-???!-!!?!-????-??!???????!?"
            else
                uuid = "".padStart uuid, "?"

        i = 0      
        r = ""
        l = uuid.length

        while i < l
            r+= switch c = uuid[ i++ ]
                when "!" then @rangedRand(0, 9)
                when "?" then switch @randomBool()
                    when no then @randomChar()
                    when on then @rangedRand(0, 9)
                else c
            
        r

export class UUID           extends String

    @classIndex : @store this

    @from       : -> super Math.randomUUID arguments...

    @default    : -> @from 4

export from = Optr.from
