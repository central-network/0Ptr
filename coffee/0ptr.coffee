OBJECT = [,]
IMPORT = [`import.meta.url`]
BUFFER = null
UINT32 = null

malloc = null
palloc = null
window = self

export PALLOC_INDEX = 0
export MALLOC_INDEX = 1

EOL = '\n'

export OFFSET_BYTELENGTH = 4 * 0
export OFFSET_BYTEOFFSET = 4 * 1
export OFFSET_PROTOCLASS = 4 * 2

export HEADER_BYTELENGTH = 4 * 9
export MEMORY_BYTEOFFSET = 4 * 1e5

addUint32 = null
setUint32 = null
getUint32 = null

export class Pointer    extends Number

    #! only root could have constructor
    #! do NOT define constructor in child  
    #! classes which you will extend 0PTR  
    constructor : ->

        #?  reconstruction
        if  arguments . length
            super arguments[ 0 ]
                . loadPrototype()

        #?  allocation - init
        else
            super palloc HEADER_BYTELENGTH
                . setProtoClass @constructor.protoClass

            if  byte = @constructor.byteLength
                this . setByteOffset malloc byte
                this . setByteLength byte

export class Scope      extends Pointer

bindAtomics             = ->

    return if BUFFER or !buffer = arguments[0]

    queueMicrotask -> Pointer.register Scope,

        byteLength  : value : buffer.byteLength

        typedArray  : value : Uint8Array

        protoClass  : value : 0

    BUFFER = Pointer::buffer = buffer
    UINT32 = new Uint32Array BUFFER 

    palloc = Atomics.add.bind Atomics, UINT32, PALLOC_INDEX
    malloc = Atomics.add.bind Atomics, UINT32, MALLOC_INDEX

    addUint32 = -> Atomics.add UINT32, arguments[0]/4, arguments[1]
    getUint32 = -> Atomics.load UINT32, arguments[0]/4
    setUint32 = -> Atomics.store UINT32, arguments[0]/4, arguments[1]

    do ->
        console.group "Scope is ready"
        console.log "          💖", [ self.constructor.name ]
        console.log "          🧬", { ...self }
        console.groupEnd()

packFunction            = ->
    native      : /native/.test arguments[0] + ''
    typeof      : typeof arguments[0]
    name        : arguments[0].name
    global      : self[ arguments[0].name ]?
    constructor : arguments[0].constructor.name 
    toString    : arguments[0].toString()

packDefinitions         = ->
    [ definitions, pack = {} ] = arguments
    
    for prop, desc of definitions

        continue if prop in [ "name", "prototype" ]

        definition = {}
        pack[ prop ] = {
            configurable : desc.configurable
            enumerable : desc.enumerable
            writable : desc.writable
        }

        if  "function" is typeof desc.value
            definition.type = "value"
            definition.value  = "function"
            definition.function = packFunction desc.value

        else if undefined isnt desc.value
            definition.type = "value"
            definition.value = desc.value

        else
            if  "function" is typeof desc.get
                definition.getter = packFunction desc.get

            if  "function" is typeof desc.set
                definition.setter = packFunction desc.set

            unless definition.setter
                definition.type = "getter"

            else unless definition.getter
                definition.type = "setter"

            else
                definition.type = "getset"

        pack[ prop ].definition = definition
    pack

packScope               = ->
    imports = []

    for obj, i in [ Pointer, ...OBJECT ]

        unless obj?.prototype instanceof Pointer
            continue if obj isnt Pointer

        imports.push
            index            : i,
            class            :
                constructor  : "(#{obj});"
                descsriptors : packDefinitions Object.getOwnPropertyDescriptors obj
                symbols      : packDefinitions Object.getOwnPropertySymbols obj
            prototype        :
                descsriptors : packDefinitions Object.getOwnPropertyDescriptors obj::
                symbols      : packDefinitions Object.getOwnPropertySymbols obj::

    imports

do  handleScope         = ->

    OBJECT[0] = Scope

#?  WindowScope         
    if !WorkerGlobalScope?
        bindAtomics new SharedArrayBuffer 1e4
        palloc HEADER_BYTELENGTH
        malloc MEMORY_BYTEOFFSET

#?  WorkerGlobalScope   
    else self .addEventListener "message", ( e ) ->

        bindAtomics e.data.buffer

        for name, i in e.data.object
            continue unless name
            found = no
            for o, j in OBJECT.slice()
                continue if o?.name isnt name
                OBJECT[i] = o
                found = yes
                break
            continue if found

            OBJECT[i] = new Proxy { name }, get : (ref, key, proxy) ->
                console.log "getter", { ref, key, proxy }

        dispatchEvent new CustomEvent "ready",
            detail : self.window = new Scope 0

    , once : yes

Object.defineProperty Pointer, "store"          ,
    value : ( object ) ->
        if -1 is i = OBJECT.indexOf object
            i += OBJECT.push object            
        i

Object.defineProperty Pointer, "dumpScope"      ,
    value : -> console.warn OBJECT

Object.defineProperty Pointer, "importMetaUrl"  ,
    value : ->
        if -1 is i = IMPORT.indexOf arguments[0]
            i += IMPORT.push arguments[0]
        i

Object.defineProperty Pointer, "register"       ,

    value : ( prototype, definitions = {} ) ->
        
        if  definitions.byteLength

            unless definitions.typedArray
                definitions.typedArray = value : Uint8Array

            definitions.length = value :
                definitions.byteLength.value /
                definitions.typedArray.value . BYTES_PER_ELEMENT
                
        if  Object.keys( definitions ).length
            Object.defineProperties prototype, {
                protoClass : {
                    value  : Pointer.store prototype  
                }, definitions...
            }
            
        prototype

Object.defineProperty Pointer, "fork"           ,
    value : ->
        scope = buffer : BUFFER
        scope . object = []
        scope . object[i] = o?.name for o , i in OBJECT

        script = [

            ...IMPORT.slice().map ( url, i ) -> "#{EOL}
            import * as m#{i} from '#{url}' #{EOL}
            Object.assign( self , m#{i} ) #{EOL}"
            
            await ( await fetch "worker.js" ).text()

        ].join EOL

        uuid = crypto.randomUUID()

        new Worker( url = URL.createObjectURL( new Blob(
            [ script ], { type : 'application/javascript' }
        )), { type: "module" } ).postMessage scope


Object.defineProperty Pointer::, "getProtoClass",
    value   : -> getUint32 this + OFFSET_PROTOCLASS

Object.defineProperty Pointer::, "setProtoClass",
    value   : -> setUint32 this + OFFSET_PROTOCLASS, arguments[0]

Object.defineProperty Pointer::, "getByteOffset",
    value   : -> getUint32 this + OFFSET_BYTEOFFSET

Object.defineProperty Pointer::, "setByteOffset",
    value   : -> setUint32 this + OFFSET_BYTEOFFSET, arguments[0]

Object.defineProperty Pointer::, "getByteLength",
    value   : -> getUint32 this + OFFSET_BYTELENGTH

Object.defineProperty Pointer::, "setByteLength",
    value   : -> setUint32 this + OFFSET_BYTELENGTH, arguments[0]

Object.defineProperty Pointer::, "loadPrototype",
    value   : ->
        Object.setPrototypeOf this ,
            OBJECT[ getUint32 this + OFFSET_PROTOCLASS ]::

Object.defineProperty Pointer::, "getInstanceOf",
    value   : -> OBJECT[ getUint32 this + OFFSET_PROTOCLASS ]

Object.defineProperty Pointer::, "setInstanceOf",
    value   : ->
        i = Pointer.store @constructor 
        setUint32 this + OFFSET_PROTOCLASS, i

Object.defineProperty Pointer::, "{{Pointer}}",
    get     : ->
        Object.assign new class Dump extends Object,
            protoClass  : @getProtoClass()
            byteOffset  : @getByteOffset()
            byteLength  : @getByteLength()
            instanceOf  : @getInstanceOf()

export default Pointer

