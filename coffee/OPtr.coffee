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
        blobURL, malloc, littleEnd,
        dw, i8, ui8, i8,  i32, u32, f32,
        addUint32, loadUint32, storeUint32, getUint32, setUint32
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
        u32 = new Uint32Array buffer
        i32 = new Int32Array buffer
        dw = new DataView buffer

        malloc              = Atomics.add.bind Atomics, u32, 0
        lock                = Atomics.wait.bind Atomics, i32
        unlock              = Atomics.notify.bind Atomics, i32

        addUint32           = Atomics.add.bind Atomics, u32
        subUint32           = Atomics.sub.bind Atomics, u32
        loadUint32          = Atomics.load.bind Atomics, u32
        storeUint32         = Atomics.store.bind Atomics, u32
        getUint32           = ( o ) -> dw.getUint32 o, littleEnd
        setUint32           = ( o, v ) -> dw.setUint32 o, v, littleEnd
        subarrayUint32      = u32.subarray.bind u32
        sliceUint32         = u32.slice.bind u32

        buffer

    if  isWindow

        sharedHandler   =
            register    : ( data ) ->
                console.warn "registering worker:", data
                Object.assign @info, data ; this
                
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
    
            for i in [ 0 ... 2 ]
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







































































    return 0xdead;
