
do  init = ->
    CORE_INFOJSON_START     = 64
    CORE_INFOJSON_LENGTH    = 8192 - CORE_INFOJSON_START
    HEAD_ELEMENTS_COUNT     = 16
    HEAD_ELEMENTS_LENGTH    = HEAD_ELEMENTS_COUNT * 4

    POINTERS_BEGIN          = null
    ALLOCS_BEGIN            = null

    INDEX_BYTELENGTH        = 0
    INDEX_BYTEOFFSET        = 1

    isWindow = "undefined" is typeof DedicatedWorkerGlobalScope
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

    class Processor extends Pointer

        @byteLength : 4 * 12

        init : ->



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

            worker

    class Core

        isSourceArrayBuffer : off
        isSourceSharedBuffer : off
        isSourceView : off
        isSoruceEmpty : off

        info : {}

        @isSoruceEmpty : ( source ) ->
            !new self.Uint8Array( source, 0, 1 ).at(0)

        @tryMaxByteLength : ->
            buffer = null
            maxByteLength = Math.pow (navigator?.deviceMemory or 1)+1, 11

            while  !buffer
                try buffer = new self.SharedArrayBuffer 0, { maxByteLength }
                catch then maxByteLength /= 10

            buffer = null
            maxByteLength - ( maxByteLength % 8 )

        @tryHardwareConcurrency : ( workerDiff = 0, maxByteLength, loopCount = 1 ) -> new Promise (done) =>
            now = performance.now()
            sab = null

            workerCount = workerDiff + (navigator?.hardwareConcurrency or 3)
            maxByteLength = maxByteLength or Math.pow (navigator?.deviceMemory or 1)+1, 11

            while  !sab
                try sab = new self.SharedArrayBuffer 0, { maxByteLength }
                catch then maxByteLength /= 10

            sab.grow maxByteLength - ( maxByteLength % 8 )
            i32 = new Int32Array sab 
            byteLength = sab.byteLength

            workers = []
            testCode = ({ data: { sab, workerCount, loopCount } }) ->

                i32 = new Int32Array sab
                ui8 = new Uint8Array sab
                index = self.name * 1
                length = Math.trunc sab.byteLength/workerCount
                offset = Math.max 8, length * index

                Atomics.wait i32, 0
                console.warn index, "running for:", { loopCount, length, offset }

                while loopCount--
                    #console.warn index, "loop at:", loopCount, "offset:", offset
                    i = -1
                    while length > ++i
                        #Atomics.store( ui8, offset + i, 1 ) 
                        ui8[ offset + i ] = 1

                console.warn index, "finished"
                Atomics.add i32, 1, 1
                postMessage 1


            testURL = URL.createObjectURL new Blob(
                [ "onmessage = " + testCode.toString() ],
                { type: "application/javascript" }
            )

            raiseTime = null
            closeTime = null
            

            numberWithCommas = (x) ->
                parts    = Math.trunc(x).toString().split(".")
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                parts.join(".")

            finishBenchmark = ->
                finished = performance.now()
                elapsed = finished - now
                sab = null
                done {
                    elapsed : (elapsed/1e3).toFixed(2) * 1
                    workerCount,
                    opsCount : numberWithCommas optCount = byteLength * loopCount
                    opsPerThread : numberWithCommas optCount / workerCount 
                    opsPerSecond : numberWithCommas((optCount * 1e3)/elapsed)
                    workerTimes:
                        raise: raiseTime
                        close: closeTime
                    operations :
                        started: now,
                        elapsed:elapsed
                        finished:finished
                    loopCount,
                    byteLength
                }

            onmessage = ({ data: finished }) ->
                if  workerCount is Atomics.load i32, 1
                    closeTime = -performance.now() + closeWorkers()
                    finishBenchmark sab = i32 = null

            raiseWorkers = ( index = 0 ) ->
                return performance.now() if index >= workerCount
                w = workers[index] = new Worker testURL, { name: index }
                w.onmessage = onmessage
                w.postMessage { sab, workerCount, loopCount }
                return raiseWorkers ++index

            self.kill = closeWorkers = ( index = 0 ) ->
                return performance.now() if index >= workerCount
                workers[ index ].terminate()
                return closeWorkers ++index

                
            requestIdleCallback =>
                raiseTime = -performance.now() + raiseWorkers()
                Atomics.store i32, 0, 1
                Atomics.notify i32, 0, workerCount

            

        constructor : ( source ) ->
            unless self.SharedArrayBuffer?
                return throw /SHARED_BUFFER_REQUIRED/

            @setMemory source
            @loadCoreinfo()

        setMemory : ( source ) ->
            if  source instanceof self.ArrayBuffer
                @isSourceArrayBuffer = yes
                return @setMemoryFromArrayBuffer source

            if  source instanceof self.SharedArrayBuffer
                @isSourceSharedBuffer = yes
                return @setMemoryFromSharedBuffer source

            if  self.ArrayBuffer.isView source
                @isSourceView = yes
                return @setMemory source.buffer

            throw /UNRESOLVED_SOURCE_TYPE/

        setBuffer : ( value ) ->
            self.Object.defineProperty this, "buffer", { value }
                
        setMemoryFromArrayBuffer : ( arrayBuffer ) ->
            @setBuffer new self.SharedArrayBuffer arrayBuffer.byteLength
            unless @isSoruceEmpty = Core.isSoruceEmpty arrayBuffer
                new self.Uint8Array( @buffer ).set new self.Uint8Array arrayBuffer
            this
                
        setMemoryFromSharedBuffer : ( sharedArrayBuffer ) ->
            @setBuffer sharedArrayBuffer
                
        loadCoreinfo : ->
            if  @isSoruceEmpty
                info = @generateCoreinfo()

            console.log info

        generateCoreinfo : ->
            maxByteLength : Core.tryMaxByteLength()
            hardwareConcurrency : Core.tryHardwareConcurrency()



    Object.defineProperties SharedArrayBuffer,

        from  : value : ( buffer ) ->
            o = new this buffer.byteLength
            s = new Uint8Array buffer.buffer ? buffer
            v = new Uint8Array o ; v.set s
            o

    addEventListener "ready", ( document ) ->
        ___EVALUATE___ ; 0

    addEventListener "message", ({ data, ports }) ->
        for req , detail of data
            detail . ports = ports if ports.length
            dispatchEvent new CustomEvent req , { detail }

    addEventListener "init", ({ detail: { buffer } }) ->

        console.table [
            await Core.tryHardwareConcurrency(-2, 4e7, 4),
            await Core.tryHardwareConcurrency(0, 4e7, 4),
            await Core.tryHardwareConcurrency(2, 4e7, 4),
        ]
        return 1 

        return core = new Core buffer

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

        new Processor().init()
    
    
    ; 0

postMessage {
    init: { buffer : new ArrayBuffer 10 }
}
