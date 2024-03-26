[
    [
        sab = null , f32 = null
        ui8 = null , u16 = null
        u32 = null
    ]

    BUFFER_BYTELENGTH =  1e7

    LENGTH_OF_POINTER =  12
        
    BYTES_PER_POINTER =   4 * LENGTH_OF_POINTER

    BUFFER_BYTEOFFSET = 1e5 * BYTES_PER_POINTER
]

#? await getURLBlobExports fileURL
getURLBlobExports = ->
    new Promise ( done ) =>
        pid = new Worker( URL.createObjectURL( url = new Blob([
            "import * as f from '#{arguments[0]}';"+
            "postMessage(Object.keys(f));"
        ], { type: "application/javascript" }),
        ), { type: "module" })
        
        pid.onmessage = ({ data }) ->
            URL.revokeObjectURL url
            pid.terminate done data

#? await getURLTextContent fileURL
getURLTextContent = ->
    new Promise ( done ) =>
        fetch( arguments[0] )
            .then( (v) -> v.text() )
            .then( done )

#? getCallerFilePath()
getCallerFilePath = ->
    trimResolved = arguments[0]?= on
    originalFunc = Error.prepareStackTrace

    try
        err = new Error()
        Error.prepareStackTrace = -> arguments[1]
        currentFile = err.stack.shift().getFileName()
        while err.stack.length
            stackedFile = err.stack.shift().getFileName()
            break unless stackedFile is currentFile
    finally
        Error.prepareStackTrace = originalFunc

    [ ...stackedPath, name ] = stackedFile.split "/"
    [ ...currentPath, file ] = currentFile.split "/"

    if  stackedPath.join("/") is currentPath.join("/")
        return "./#{name}" if trimResolved
    stackedFile

#? setPointerAtomics( sab )
setPointerAtomics = ->
    
    [ sab = new SharedArrayBuffer BUFFER_BYTELENGTH ] = arguments

    Object.defineProperty Pointer::,
        "buffer" , value : sab
        
    ui8 = new Uint8Array   sab
    u32 = new Uint32Array  sab
    u16 = new Uint16Array  sab
    f32 = new Float32Array sab

    unless arguments.length
        Atomics.add u32, 0, BYTES_PER_POINTER
        Atomics.add u32, 1, BUFFER_BYTEOFFSET

    Pointer

addEventListener "message", fn = ( e ) ->

    return if Pointer::buffer

    #removeEventListener "message", fn
    setPointerAtomics e.data

    ai32 = new Int32Array new SharedArrayBuffer 1e4

    Object.defineProperties Pointer::,

        loadScope : value : (i) ->

            #write request opcode
            Thread.operation ai32, Thread.OP_LOADSCOPE

            #write request arg length
            Thread.argLength ai32, 1

            #write args
            Thread.arguments ai32, i

            #lock until notify
            Thread.waitReply ai32

            #read response and store
            # todo not necessary now 
            #! scope[ i ] = self.GL[ Thread.readAsText ai32 ]

    console.warn new Pointer 12 if name is "0"
    console.warn new Pointer 24 if name is "1"
    console.warn scope

class Pointer           extends Number

    constructor  : ->

        unless arguments.length is 0
            return super arguments[0]
                .usePrototype @class.prototype

        super Pointer.palloc() / 4
            . setPrototype  scope.index @constructor

        if  byteLength      = @constructor.byteLength
            @setByteOffset  Pointer.malloc byteLength
            @setByteLength  byteLength
            @setLength      byteLength / @BYTES_PER_ELEMENT

        this
            .init()

class Thread            extends Worker

    @OP_LOADSCOPE : 23

    @INDEX_PREPARATE = 0
    @INDEX_OPERATION = 1
    @INDEX_ARGLENGTH = 2
    @INDEX_ARGUMENTS = 3
    
    @waitReply    : ->
        ai32 = arguments[0]
        Atomics.store ai32, @INDEX_PREPARATE, 0

        #send switch buffer
        postMessage   ai32

        #lock until notify
        Atomics.wait  ai32, @INDEX_PREPARATE

    @sendReply  : ->
        ai32 = arguments[0]
        Atomics.notify ai32, @INDEX_PREPARATE, 1
    
    @readAsText  : ->        
        ai32 = arguments[0]
        offset = Thread.INDEX_ARGUMENTS * 4
        strlen = Thread.argLength ai32
        string = new Uint8Array ai32.buffer, offset, strlen

        new TextDecoder().decode string.slice()
    
    @operation  : ->
        ai32 = arguments[0]
        unless value = arguments[1]
            return Atomics.load ai32, @INDEX_OPERATION
        Atomics.store ai32, @INDEX_OPERATION, value 

    @argLength  : ->
        ai32 = arguments[0]
        unless value = arguments[1]
            return Atomics.load ai32, @INDEX_ARGLENGTH
        Atomics.store ai32, @INDEX_ARGLENGTH, value 

    @arguments  : ->
        ai32 = arguments[0] ; i = arguments[2] or 0
        unless value = arguments[1]
            return Atomics.load ai32, @INDEX_ARGUMENTS + i
        Atomics.store ai32, @INDEX_ARGUMENTS + i, value 

    pool        : []

    @options    : ->
        { type: "module", name: arguments[0] }

    constructor : ->
        try super Thread.scriptURL , Thread.options id = arguments[0]
        catch e then console.error e

        @onmessageerror = console.error
        @onmessage      = ({ data: ai32 }) =>

            #read opcode
            console.log "atomic request (#{id}) op:", Thread.operation ai32
            console.log "atomic request (#{id}) arglen:", Thread.argLength ai32
            console.log "atomic request (#{id}) arguments:", Thread.arguments ai32

            switch Thread.operation ai32
                when Thread.OP_LOADSCOPE
                    i = Thread.arguments ai32

                    r = new TextEncoder().encode scope[i].name
                    m = r.byteLength % ai32.BYTES_PER_ELEMENT
                    l = r.byteLength + ai32.BYTES_PER_ELEMENT - m   
                    
                    Thread.argLength ai32, r.byteLength
                    for v, j in new ai32.constructor r.buffer.transfer l
                        Thread.arguments ai32, v, j
                    Thread.sendReply ai32
                    
        @postMessage Pointer::buffer


class Scope             extends Array

    imports     : []

    indexes     : []

    index       : ->
        
        if -1 is i = @indexOf arguments[0]
            i += @push arguments[0]

            #?  preparing threads' header
            if  Pointer.isPrototypeOf arguments[0]

                file = getCallerFilePath off
                name = arguments[0].name
                mode = null

                for cmd , j in @imports
                    [ ...mods, path ] = cmd
                        .replace /import|from/g, ""
                        .split(/\s+|\{|\,|\}|\'/g)
                        .filter( Boolean )

                    continue unless path is file
                    mode = [ j , mods ] ; break
                        
                if !mode
                    mode = @imports[ @imports.length ] =
                        [ @imports.length, [] ]

                [ j, mods ] = mode

                unless mods.includes name
                    mods.push name
                mods = mods.join ", "

                @imports[j] = "import {#{mods}} from '#{file}'"
                @indexes[j] = new Array unless @indexes[ j ]
                @indexes[j].push "#{name}.scopei(#{i});"

        i

    store       : ->
        @index arguments[0] ; this

    constructor : ->
        super().push null

do     extendTypedArray = ->
    ( TypedArray ) ->

        this[ TypedArray.name ] = class extends this

            name                : TypedArray.name

            TypedArray          : TypedArray

            BYTES_PER_ELEMENT   : TypedArray.BYTES_PER_ELEMENT

        Object.defineProperties this[ TypedArray.name ]::,

            array       : get   : -> new TypedArray @buffer, @getByteOffset(), @getLength()

            subarray    : value : -> @array.subarray arguments...       

    .call( Pointer, TypedArray ) for TypedArray in [
        Float32Array, Uint8Array,
        Float64Array, Uint16Array, Uint32Array
    ]

Object.defineProperties Pointer,

    scopei          : value : ->
        scope[ arguments[0] ] = this

    headOffset      : { value : 0, writable: on }

    palloc          : value : -> Atomics.add u32, 0, BYTES_PER_POINTER

    malloc          : value : -> Atomics.add u32, 1, arguments[ 0 ]
    
    ialloc          : value : ->
        
        PERELEMENT = arguments[0].BYTES_PER_ELEMENT
        headOffset = @headOffset

        if  mod = headOffset % PERELEMENT
            headOffset += PERELEMENT - mod
        
        @headOffset = headOffset + PERELEMENT
        return headOffset / PERELEMENT

INDEX_PROTOTYPE         = Pointer.ialloc Uint16Array

INDEX_PARENT            = Pointer.ialloc Uint32Array

INDEX_BYTEOFFSET        = Pointer.ialloc Uint32Array

INDEX_BYTELENGTH        = Pointer.ialloc Uint32Array

INDEX_LENGTH            = Pointer.ialloc Uint32Array

Object.defineProperties Pointer::,

    class           : get   : ->
        @proxy @getPrototype()

    parent          :

        get         : -> new Pointer @getParent()
        
        set         : -> @setParent arguments[0]

    add             : value : -> arguments[0].setParent this

    init            : value : -> this

    store           : value : ->
        scope.index arguments[0]

    proxy           :
        value       : ->
            return unless i = arguments[0]
            unless object = scope[ i ]
                return @loadScope i
            return object

Object.defineProperties Pointer::,

    usePrototype    : value : -> Object.setPrototypeOf this , arguments[0]
    
    getPrototype    : value : -> Atomics.load  u16, this / 2 + INDEX_PROTOTYPE

    setPrototype    : value : -> Atomics.store u16, this / 2 + INDEX_PROTOTYPE, arguments[0]        
    
    getParent       : value : -> Atomics.load  u32, 1 * this + INDEX_PARENT

    setParent       : value : -> Atomics.store u32, 1 * this + INDEX_PARENT, arguments[0] ; this     
    
    setByteLength   : value : -> Atomics.store u32, 1 * this + INDEX_BYTELENGTH, arguments[0] ; this
    
    setByteOffset   : value : -> Atomics.store u32, 1 * this + INDEX_BYTEOFFSET, arguments[0] ; this

    setByteLength   : value : -> Atomics.store u32, 1 * this + INDEX_BYTELENGTH, arguments[0] ; this
    
    setLength       : value : -> Atomics.store u32, 1 * this + INDEX_LENGTH, arguments[0] ; this

    getByteOffset   : value : -> Atomics.load  u32, 1 * this + INDEX_BYTEOFFSET

    getByteLength   : value : -> Atomics.load  u32, 1 * this + INDEX_BYTELENGTH
    
    getLength       : value : -> Atomics.load  u32, 1 * this + INDEX_LENGTH

    loadUint32      : value : -> Atomics.load  u32, 1 * this + arguments[0]
    
    storeUint32     : value : -> Atomics.store u32, 1 * this + arguments[0], arguments[1] ; this

    loadUint16      : value : -> Atomics.load  u16, 2 * this + arguments[0]
    
    storeUint16     : value : -> Atomics.store u16, 2 * this + arguments[0], arguments[1] ; this

    loadUint8       : value : -> Atomics.load   ui8, 4 * this + arguments[0]
    
    storeUint8      : value : -> Atomics.store  ui8, 4 * this + arguments[0], arguments[1] ; this

Object.defineProperties Pointer::, ["{{Pointer}}"] :
    get : ->
        headOffset  = this * 4

        byteOffset  : @getByteOffset()
        byteLength  : @getByteLength()
        length      : @getLength()
        headers     :
            ui8   : new Uint8Array @buffer, headOffset, BYTES_PER_POINTER / 1
            u16  : new Uint16Array @buffer, headOffset, BYTES_PER_POINTER / 2
            u32  : new Uint32Array @buffer, headOffset, BYTES_PER_POINTER / 4

scope = new Scope()

if !WorkerGlobalScope?
    
    setPointerAtomics()
    requestIdleCallback ->

        code = [
            ...scope.imports, ""
            ...scope.indexes.flatMap (i) -> i.join "\n"
        ].join "\n"

        type = "application/javascript"

        try Thread.blob = new Blob [ code ], { type }
        catch e then console.error e

        try Thread.scriptURL = URL.createObjectURL Thread.blob
        catch e then console.error e

        for i in [ 0 .. 1 ]
            try t = new Thread i
            catch e then console.error e

    document.onclick = -> console.log scope

export { Pointer as default, Pointer, Thread }