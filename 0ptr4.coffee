DEBUG = 0

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
PTR = 16 * BPE

iSTATE = 0
iTYPE = 1
iOFFSET = 2
iRESv = 3

getState  = Atomics.load.bind Atomics, ui8
setState  = Atomics.store.bind Atomics, ui8
getType   = ( ptri ) -> dvw.getUint8 ptri + iTYPE
setType   = ( ptri , value ) -> dvw.setUint8 ptri + iTYPE, value
getOffset = ( ptri ) -> dvw.getUint8 ptri + iOFFSET
setOffset = ( ptri , value ) -> dvw.setUint8 ptri + iOFFSET, value
getResvi8 = ( ptri ) -> dvw.getInt8 ptri + iRESv
setResvi8 = ( ptri , value ) -> dvw.setInt8 ptri + iRESv, value

PTRTYPE =
    PTRTYPE_CLASS : PTRTYPE_CLASS = 1
    PTRTYPE_OBJECT : PTRTYPE_OBJECT = 2

PTRSTAT =
    PTRSTAT_DELETE : PTRSTAT_DELETE = 0
    PTRSTAT_IGNORE : PTRSTAT_IGNORE = 2
    PTRSTAT_ACTIVE : PTRSTAT_ACTIVE = 10
    PTRSTAT_PALLOC : PTRSTAT_PALLOC = 11

PALLOC_TYPE =    
    PALLOC_UINT8 : PALLOC_UINT8 = 1
    PALLOC_UINT32 : PALLOC_UINT32 = 4

for c in [ PTRTYPE, PALLOC_TYPE ]
    for key, val of c 
        c[ val ] = val

class Collection    extends Array

class Storage       extends Array
        constructor         : -> super( arguments... )[0] ?= null
        store               : ( any, bytes = 2 ) ->
            if  -1 is i = @indexOf any
                
                i = Math.pow 0xff, bytes-1
                i = 1 + i while this[ i ]

                if  i > Math.pow( 0xff, bytes )
                    throw /EXCEED_STORAGE/

                else this[ i ] = any

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
define = ->
    [ object, prop, desc ] = arguments

    unless arguments[2]?
        for prop, desc of { ...prop }
            define object, prop, desc
        return object

    if !desc.get and !desc.set and !desc.value
        desc = value : desc

    Object.defineProperty object, prop, desc
    
encode = TextEncoder::encode.bind new TextEncoder
decode = TextDecoder::decode.bind new TextDecoder
palloc = ->
    o = Atomics.add u32, 0, PTR
    unless o then throw [ /PALLOC/, u32.slice(0,2) ]
    o
#Atomics.or u32, 0, PTR


do clearself = ->
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
        propertyIsEnumerable toLocaleString hasOwnProperty
    ".split(/\n|\s+/g) then Reflect.deleteProperty( Object::, p )    

    0


define window   , storage   : new Storage Number
define Number:: , toString  : -> throw /toString/

register = ->
    for Alias, Parent of arguments[0]

        if  -1 is i = storage.indexOf Parent
            throw /PARENT_NOT_REGISTERED/

        if  storage.find (c) -> c?.name is Alias
            throw /ALREADY_REGISTERED/

        storagei = storage.storeForUint8( Alias )

        document.head.appendChild(
            assign(document.createElement("script"), { text :
                "#{Alias} = class extends storage[#{i}] {};
                 storage[ #{storagei} ] = #{Alias};"
            })
        )#.remove()

    0

register Pointer    : Number

###        

register Class      : Pointer
register Allocation : Pointer
register Vector3    : Pointer




define Class::      ,

    prototype       :
        enumerable  : on
        get : -> storage.find ({ clsptri }) =>
            ( clsptri - this ) is 0

    name            :
        enumerable  : on
        get : -> @prototype.name

    parent          :
        enumerable  : on
        get : ->
            protof( @prototype )["{{Class}}"] or new Number 0           

    keyName         : get : ->
        name = @name
        if  name.split("").some (c) -> c is c.toUpperCase()
            return name.toLocaleLowerCase()
        name[0].toLowerCase() + name.substring 1

define Pointer , alloc : get : ->
    ptri = new this palloc()
    dvw.setUint8 ptri + 0, 1 #status
    dvw.setUint8 ptri + 1, 4 #inner alloc offset

    ->
        ptri
###

parse = {}

# type 2 is a property definition
parse[ TYPEOF_PROPERTY_DEFINITION = 2 ] = ( offset ) ->

    byteOffset  = offset * 4
    byteLength  = u32[ offset++ ] * 4
    type        = u32[ offset++ ]

    #? read propname bytelength
    propByteLength      = u32[ offset++ ] # next of type 

    #? read options bytelength
    optionsByteLength   = u32[ offset++ ] # next of namesize

    propBegin           = offset * 4
    propEnd             = propBegin + propByteLength

    optionsBegin        = propEnd
    optionsEnd          = optionsBegin + optionsByteLength

    #? decode name
    prop                = decode ui8.slice propBegin, propEnd
    options             = decode ui8.slice optionsBegin, optionsEnd
    
    return {
        byteOffset , byteLength ,
        type , name : prop,
        data : JSON.parse options
    }

findProperty = ( prop ) ->

    offset = 0
    while length = u32[ offset ]
        #* readed bytelength belongs to all packet

        if  TYPEOF_PROPERTY_DEFINITION is u32[ offset + 1 ]
            property = parse[ TYPEOF_PROPERTY_DEFINITION ]( offset )
            if  property.name is prop
                return property
                    
        offset += length

    null

allocate = ( byteLength ) ->
    offset = 0

    while length = u32[ offset ]
        warn { offset, length }
        offset += length

    byteLength = Math.max byteLength, 1

    if  mod = byteLength % 8
        byteLength += 8 - mod
    
    u32[ offset ] = byteLength / 8

    offset

define Pointer , defineProperty : ( prop, options ) ->

        if  findProperty prop
            throw "property is already registered: " + prop


        nameArray = encode prop
        optsArray = encode JSON.stringify options

        type = 1
        byteLength = 3 +
            nameArray.byteLength + 
            optsArray.byteLength

        offset = allocate byteLength

        log offset, nameArray.byteLength 

        u32[ ++offset ] = type 
        u32[ ++offset ] = nameArray.byteLength 
        u32[ ++offset ] = optsArray.byteLength 

        log { offset }, u32.slice( offset - 3, offset + 2 ) 


        nameArrayBegin = offset * 4
        optsArrayBegin = nameArrayBegin + nameArray.byteLength

        ui8.set nameArray, nameArrayBegin
        ui8.set optsArray, optsArrayBegin

        Object.defineProperty @prototype, prop, {
            get : ->
        }

        log u32
            
        return 





Pointer.defineProperty "parent", {
    size : 4, type : 2
}

warn "find:", findProperty "parent"

Pointer.defineProperty "linked", {
    size : 4, type : 3
}

log new Pointer 2
#Vector3.palloc x : PALLOC_UINT8

#log new Vector3 palloc()