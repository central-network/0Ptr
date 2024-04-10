self.name = "window"

do  self.init   = ->

    CONST       =
        BUFFER_TEST_START_LENGTH    : 1e6
        BUFFER_TEST_STEP_DIVIDER    : 1e1
        INITIAL_BYTELENGTH          : 64
        BYTES_PER_ELEMENT           : 4
        HEADERS_LENGTH              : 16
        HEADERS_BYTE_LENGTH         : 4 * 16

    [
        blobURL, malloc, littleEnd, lock, unlock,
        dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16,
        andUint32, orUint32, xorUint32, subUint32, addUint32, loadUint32, storeUint32, getUint32, setUint32, exchangeUint32, compareUint32
        andUint16, orUint16, xorUint16, subUint16, addUint16, loadUint16, storeUint16, getUint16, setUint16, exchangeUint16, compareUint16
        andUint8 , orUint8 , xorUint8 , subUint8, addUint8, loadUint8, storeUint8, getUint8, setUint8, exchangeUint8, compareUint8
        andInt32 , orInt32 , xorInt32 , subInt32, addInt32, loadInt32, storeInt32, getInt32, setInt32, exchangeInt32, compareInt32
        andInt16 , orInt16 , xorInt16 , subInt16, addInt16, loadInt16, storeInt16, getInt16, setInt16, exchangeInt16, compareInt16
        andInt8  , orInt8  , xorInt8  , subInt8, addInt8, loadInt8, storeInt8, getInt8, setInt8, exchangeInt8, compareInt8
    ] = []

    bc          = new BroadcastChannel "0ptr"
    selfName    = self.name
    isWindow    = document?
    isBridge    = /bridge/i.test selfName  
    isThread    = /thread/i.test selfName
    threadId    = isThread and parseInt selfName.match /\d+/
    now         = Date.now()
    pnow        = performance.now()
    state       = 0
    buffer      = null
    resolvs     = new WeakMap()
    workers     = new Array()
    littleEnd   = new Uint8Array(Uint32Array.of(0x01).buffer)[0]

    resolvCall  = ->
        #
            #console.warn "Error:\n\t  at #{stack.substring(begin + 9, last)}"
            #parseInt( stack.substring column + 1, last ) +
        Error   . captureStackTrace @
        stack   = @stack.toString()
        begin   = stack.indexOf "onready"
        last    = stack.indexOf ")", begin
        column  = stack.lastIndexOf ":", last   
        line    = stack.lastIndexOf ":", column - 1
        parseInt  stack.substring line + 1 , column 

    randomUUID  = ->
        crypto?.randomUUID() or btoa(
            new Date().toISOString()
        )
        .toLowerCase().split("")
        .toSpliced(8,0,"-").toSpliced(13,0,"-")
        .toSpliced(18,0,"-").toSpliced(24,0,"-")
        .join("").substring(0, 36).trim()
        .padEnd(36, String.fromCharCode(50 + Math.random() * 40 ))

    initMemory  = ->
        u64 = new BigUint64Array buffer
        i64 = new BigInt64Array buffer
        f32 = new Float32Array buffer
        f64 = new Float64Array buffer
        i32 = new Int32Array buffer
        u32 = new Uint32Array buffer
        i16 = new Int16Array buffer
        u16 = new Uint16Array buffer
        ui8 = new Uint8Array buffer
        cu8 = new Uint8ClampedArray buffer
        si8 = new Int8Array buffer
        dvw = new DataView buffer

        malloc              = Atomics.add.bind Atomics, u32, 0
        lock                = -> Atomics.wait i32, 1
        unlock              = -> Atomics.notify i32, 1

        addUint32           = Atomics.add.bind Atomics, u32
        andUint32           = Atomics.and.bind Atomics, u32
        orUint32            = Atomics.or.bind Atomics, u32
        xorUint32           = Atomics.xor.bind Atomics, u32
        subUint32           = Atomics.sub.bind Atomics, u32
        loadUint32          = Atomics.load.bind Atomics, u32
        storeUint32         = Atomics.store.bind Atomics, u32
        exchangeUint32      = Atomics.exchange.bind Atomics, u32
        compareUint32       = Atomics.compareExchange.bind Atomics, u32
        getUint32           = ( o ) -> dvw.getUint32 o, littleEnd
        setUint32           = ( o, v ) -> dvw.setUint32 o, v, littleEnd

        addUint16           = Atomics.add.bind Atomics, u16
        andUint16           = Atomics.and.bind Atomics, u16
        orUint16            = Atomics.or.bind Atomics, u16
        xorUint16           = Atomics.xor.bind Atomics, u16
        subUint16           = Atomics.sub.bind Atomics, u16
        loadUint16          = Atomics.load.bind Atomics, u16
        storeUint16         = Atomics.store.bind Atomics, u16
        exchangeUint16      = Atomics.exchange.bind Atomics, u16
        compareUint16       = Atomics.compareExchange.bind Atomics, u16
        getUint16           = ( o ) -> dvw.getUint16 o, littleEnd
        setUint16           = ( o, v ) -> dvw.setUint16 o, v, littleEnd

        addUint8            = Atomics.add.bind Atomics, ui8 
        andUint8            = Atomics.and.bind Atomics, ui8 
        orUint8             = Atomics.or.bind Atomics, ui8 
        xorUint8            = Atomics.xor.bind Atomics, ui8 
        subUint8            = Atomics.sub.bind Atomics, ui8 
        loadUint8           = Atomics.load.bind Atomics, ui8 
        storeUint8          = Atomics.store.bind Atomics, ui8 
        exchangeUint8       = Atomics.exchange.bind Atomics, ui8 
        compareUint8        = Atomics.compareExchange.bind Atomics, ui8 
        getUint8            = ( o ) -> dvw.getUint8 o, littleEnd
        setUint8            = ( o, v ) -> dvw.setUint8 o, v, littleEnd

        addInt32            = Atomics.add.bind Atomics, u32
        andInt32            = Atomics.and.bind Atomics, u32
        orInt32             = Atomics.or.bind Atomics, u32
        xorInt32            = Atomics.xor.bind Atomics, u32
        subInt32            = Atomics.sub.bind Atomics, u32
        loadInt32           = Atomics.load.bind Atomics, u32
        storeInt32          = Atomics.store.bind Atomics, u32
        exchangeInt32       = Atomics.exchange.bind Atomics, u32
        compareInt32        = Atomics.compareExchange.bind Atomics, u32
        getInt32            = ( o ) -> dvw.getInt32 o, littleEnd
        setInt32            = ( o, v ) -> dvw.setInt32 o, v, littleEnd

        addInt16            = Atomics.add.bind Atomics, u16
        andInt16            = Atomics.and.bind Atomics, u16
        orInt16             = Atomics.or.bind Atomics, u16
        xorInt16            = Atomics.xor.bind Atomics, u16
        subInt16            = Atomics.sub.bind Atomics, u16
        loadInt16           = Atomics.load.bind Atomics, u16
        storeInt16          = Atomics.store.bind Atomics, u16
        exchangeInt16       = Atomics.exchange.bind Atomics, u16
        compareInt16        = Atomics.compareExchange.bind Atomics, u16
        getInt16            = ( o ) -> dvw.getInt16 o, littleEnd
        setInt16            = ( o, v ) -> dvw.setInt16 o, v, littleEnd

        addInt8             = Atomics.add.bind Atomics, si8 
        andInt8             = Atomics.and.bind Atomics, si8 
        orInt8              = Atomics.or.bind Atomics, si8 
        xorInt8             = Atomics.xor.bind Atomics, si8 
        subInt8             = Atomics.sub.bind Atomics, si8 
        loadInt8            = Atomics.load.bind Atomics, si8 
        storeInt8           = Atomics.store.bind Atomics, si8 
        exchangeInt8        = Atomics.exchange.bind Atomics, si8 
        compareInt8         = Atomics.compareExchange.bind Atomics, si8 
        getInt8             = ( o ) -> dvw.getInt8 o, littleEnd
        setInt8             = ( o, v ) -> dvw.setInt8 o, v, littleEnd

        buffer

    if  isWindow

        sharedHandler   =
            register    : ( data ) ->
                #console.warn "registering worker:", data
                Object.assign @info, data ; this
                unless workers.some (w) -> !w.info.uuid
                    #console.log "unlock time..."
                    unlock()
                
        bridgeHandler   =
            hello       : ->
        
        threadHandler   =
            hello       : ->
        
        bridgemessage   = ({ data }) ->
            for request, data of data
                handler =
                    bridgeHandler[ request ] or
                    sharedHandler[ request ] or throw [
                        /NO_HANDLER_FOR_BRIDGE/, request, data
                    ]

                handler.call this, data

        threadmessage   = ({ data }) ->
            for request, data of data
                handler =
                    threadHandler[ request ] or
                    sharedHandler[ request ] or throw [
                        /NO_HANDLER_FOR_THREAD/, request, data
                    ]

                handler.call this, data

        createBuffer    = ->
            Buffer  = SharedArrayBuffer ? ArrayBuffer
            buffer  = !maxByteLength =
                CONST.BUFFER_TEST_START_LENGTH

            while  !buffer
                try buffer = new Buffer CONST.INITIAL_BYTELENGTH, { maxByteLength }
                catch then maxByteLength /= CONST.BUFFER_TEST_STEP_DIVIDER
            
            initMemory buffer
            malloc CONST.INITIAL_BYTELENGTH

        createWorker    = ( name, onmessage ) ->
            worker = new Worker( blobURL, { name } )
            worker . info = {}
            worker . onerror = 
            worker . onmessageerror = console.error
            worker . onmessage = onmessage.bind worker
            workers[ workers . length ] =
                worker
        
        createThreads   = ->

            bridge = createWorker "bridge", bridgemessage
            bridge . postMessage setup : { blobURL, buffer }
    
            for i in [ 0 ... navigator.hardwareConcurrency-2 ]
                thread = createWorker "thread" + i, threadmessage
                thread . postMessage setup : { blobURL, buffer }

        createBlobURL   = ->
            __user = "\nconst onready = function ( document ) {\n\t" +
                "#{[ ...document.scripts ].find( (d) => d.text and d.src ).text.trim()}\n" + 
            "};\n"

            __0ptr = "(" + "#{self.init}".split("return " + "0xdead;")[0]

            blobURL = URL.createObjectURL new Blob [
                __0ptr, __user, "}).call(self);"
            ], { type: "application/javascript" }

            delete self.init

        listenEvents    = ->
            window.onclick = ->
                console.table workers.map (w) -> w.info

        queueMicrotask  ->
            listenEvents()
            createBuffer()
            createBlobURL()
            createThreads()




































































    if  isBridge

        defineTypedArrays = ->

            Object.defineProperties Object.getPrototypeOf( self.Uint8Array )::,

                resolvedAt  :
                    get     : -> resolvs.get this
                    set     : -> resolvs.set this, arguments[0]

                resolvLine  :
                    get     : ->
                        console.warn "Error:\n\tat #{blobURL}:#{@resolvedAt}"
                        return "look at console ->"

            Object.defineProperties self,

                Uint32Array : class Uint32Array extends self.Uint32Array
                    constructor : ->
                        super arguments...
                            .resolvedAt = resolvCall()

                Uint8Array  : class Uint8Array  extends self.Uint8Array
                    constructor : ->
                        super arguments...
                            .resolvedAt = resolvCall()

        addEventListener "message", (e) ->

            for req, data of e.data then switch req
                when "setup"
                    uuid = randomUUID()
                    buffer = data.buffer
                    blobURL = data.blobURL

                    initMemory buffer
                    defineTypedArrays()

                    postMessage register : {
                        selfName, isBridge, isThread, threadId,
                        now, pnow, uuid, state
                    }

                    lock()
                    onready()
                    































































    if  isThread

        addEventListener "message", (e) ->

            for req, data of e.data then switch req
                when "setup"
                    uuid = randomUUID()
                    buffer = data.buffer
                    blobURL = data.blobURL

                    initMemory buffer

                    postMessage register : {
                        selfName, isBridge, isThread, threadId,
                        now, pnow, uuid, state
                    }

                    lock()
                    onready()







































































    return 0xdead;
