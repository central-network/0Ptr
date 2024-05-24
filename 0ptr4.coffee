DEBUG = 0

#* hello world

GL2KEY = Object.keys     WebGL2RenderingContext
GL2VAL = Object.values   WebGL2RenderingContext
GL2NUM = new Object
SCRIPT = ->
    src = ( -> Object.defineProperty( self,
        "Alias", value : (class Alias extends storage[i]))
    ).toString()

    src = src
        .substring(
            src.indexOf(  "Object" ),
            src.lastIndexOf(  "}" ))   
        .replace( /Alias/g , Alias )
        .replace( "[i]", "[#{parentStorageIndex}]" )

    document.head.appendChild(
        assign(document.createElement("script"), {text: src})
    ).remove()

{ log, warn, error, table, debug, info } = console

sab = new SharedArrayBuffer 1e7 * 8
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
f32 = new Float32Array sab
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
BPE = 4
PTR = 16 * BPE

PALLOC_TYPE =    
    PALLOC_UINT8 : PALLOC_UINT8 = 1
    PALLOC_UINT32 : PALLOC_UINT32 = 4

for c in [ PALLOC_TYPE ]
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
Atomics.or u32, 0, PTR

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

        document.head.appendChild(
            assign(document.createElement("script"), { text :
                "class #{Alias} extends storage[#{i}] {};
                storage.storeForUint8( #{Alias} );"
            })
        ).remove()


register Pointer    : Number
register Class      : Pointer
register Allocation : Pointer
register Vector3    : Pointer


define Pointer      ,
    "{{Class}}"     , get : ->
        stri = storage.indexOf this
        ptri = Atomics.load u32

        while ptri -= PTR
            break if stri is dvw.getUint8 ptri + 2

        unless ptri then if ptri = palloc()
            dvw.setUint8 ptri + 0, 1 #status
            dvw.setUint8 ptri + 1, 4 #inner alloc offset
            dvw.setUint8 ptri + 2, stri

        new Class ptri

define Class::      ,

    statusi         :
        get : -> dvw.getUint8 this + 0
        set : -> dvw.setUint8 this + 0, arguments[0]

    byteLength      :
        get : -> dvw.getUint8 this + 1
        set : -> dvw.setUint8 this + 1, arguments[0]

    storagei        :
        get : -> dvw.getUint8 this + 2
        set : -> dvw.setUint8 this + 2, arguments[0]

    resvUi8         :
        get : -> dvw.getUint8 this + 3
        set : -> dvw.setUint8 this + 3, arguments[0]

    prototype       :
        enumerable  : on
        get : -> storage[ @storagei ]

    name            :
        enumerable  : on
        get : ->
            warn 1
            @prototype.name

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


define Pointer , palloc : ->

        #? class pointer search
        clsptri = this["{{Class}}"]
 
        log this.name, clsptri, arguments[0]

        for prop, desc of arguments[0]
            if  byteLength = PALLOC_TYPE[ desc ]
                desc = { byteLength }

            byteOffset = clsptri.byteLength
            clsptri.byteLength += byteLength
            
            define clsptri::, prop,
                get : ->
                set : ->

            aptri = new Allocation.alloc()


Class.palloc parent : PALLOC_UINT32
Vector3.palloc x : PALLOC_UINT8

log new Vector3 palloc()