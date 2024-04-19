
do  init = ->
    CORE_INFOJSON_START     = 64
    CORE_INFOJSON_LENGTH    = 8192 - CORE_INFOJSON_START
    HEAD_ELEMENTS_COUNT     = 16
    HEAD_ELEMENTS_LENGTH    = HEAD_ELEMENTS_COUNT * 4

    POINTERS_BEGIN          = null
    ALLOCS_BEGIN            = null

    INDEX_BYTELENGTH        = 0
    INDEX_BYTEOFFSET        = 1

    isWindow = typeof DedicatedWorkerGlobalScope is undefined
    isWorker = isWindow is false
    isThread = isWorker and self.name.startsWith "thread"
    isBridge = isWorker and isThread is false

    type = isWindow && "window" or isThread && "thread" or "bridge"
    core = null
    info = {}
    
    headers     = null
    pointers    = null

    i32 = null
    malloc = ( ptr ) ->
        return Atomics.add i32, 1, HEAD_ELEMENTS_COUNT if !ptr

        ptr.byteLength = ptr.constructor.byteLength
        ptr.byteOffset = Atomics.add i32, 0, ptr.byteLength

        return ptr

    textDecoder = new TextDecoder()
    textEncoder = new TextEncoder()

    define      = Object.defineProperties


    class Pointer extends Number

        constructor : ->
            malloc super malloc()

        define Pointer::,
            
            pointer     :
                get : -> pointers.subarray this, this + HEAD_ELEMENTS_COUNT

            byteLength  :
                get : -> pointers[ this + INDEX_BYTELENGTH ]
                set : -> pointers[ this + INDEX_BYTELENGTH ] = arguments[0]

            byteOffset  :
                get : -> pointers[ this + INDEX_BYTEOFFSET ]
                set : -> pointers[ this + INDEX_BYTEOFFSET ] = arguments[0]



    class Thread extends Pointer

        @byteLength : 4 * 28
        
        raise : ->
            ptrs = [ ...document.scripts ].find( (a) -> a.text and a.src.match /ptr/i )
            code = init.toString().replace "___EVAL"+"UATE___", ptrs.text.trim() 
            blob = new Blob [ "(#{code}).call(self)" ], { type: "application/javascript" }
            bUrl = URL.createObjectURL blob
            type = ptrs.type or ""

            worker = new Worker bUrl, { type }
            worker.onerror = console.error
            worker.onmessageerror = console.error
            worker.postMessage initram : { buffer: core }

    Object.defineProperties SharedArrayBuffer,

        from  : value : ( buffer ) ->
            o = new this buffer.byteLength
            s = new Uint8Array buffer.buffer ? buffer
            v = new Uint8Array o ; v.set s
            o

    addEventListener "ready", ( document ) ->
        ___EVALUATE___ ; 0

    addEventListener "message", ({ data, ports }) ->
        console.warn data
        for req , detail of data
            detail . ports = ports if ports.length
            dispatchEvent new CustomEvent req , { detail }

    addEventListener "initram", ({ detail: { buffer } }) ->
        core = if !isWindow then buffer
        else SharedArrayBuffer.from buffer

        generateCoreInfo = ->
            byteLength: core.byteLength
            infoOffset: CORE_INFOJSON_START
            dataOffset: Math.trunc(core.byteLength / 10)
            headOffset: CORE_INFOJSON_START + CORE_INFOJSON_LENGTH

        info = textDecoder.decode new Uint8Array( buffer, CORE_INFOJSON_START, CORE_INFOJSON_LENGTH ).slice()

        unless info.startsWith "\""
            info = generateCoreInfo()
            new Uint8Array core, CORE_INFOJSON_START, CORE_INFOJSON_LENGTH
                .set textEncoder.encode JSON.stringify info, null, "\t"
                
        POINTERS_BEGIN = info.headOffset
        ALLOCS_BEGIN   = info.dataOffset

        i32      = new Int32Array  core
        pointers = new Uint32Array core, POINTERS_BEGIN, ALLOCS_BEGIN/4
        allocs   = new Uint8Array  core, ALLOCS_BEGIN

        return unless isWindow
        
        Atomics.or i32, 0, POINTERS_BEGIN
        Atomics.or i32, 1, HEAD_ELEMENTS_COUNT

        bridge = new Thread()

        console.log bridge.raise()
    
    
    ; 0

postMessage {
    initram : { buffer : new ArrayBuffer 1e7 }
}