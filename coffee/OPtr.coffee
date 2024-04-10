self.name = "window"

do  self.init   = ->

    CONST       =
        BUFFER_TEST_START_LENGTH    : 1e20
        BUFFER_TEST_STEP_DIVIDER    : 1e1
        INITIAL_BYTELENGTH          : 6e4
        BYTES_PER_ELEMENT           : 4
        RESERVED_BYTELENGTH         : 64
        ALLOCATION_BYTEOFFSET       : 100000 * 16 * 4
        HEADERS_LENGTH              : 16
        HEADERS_BYTE_LENGTH         : 4 * 16
        
        HINDEX_BYTEOFFSET           : 0
        HINDEX_LENGTH               : 1
        HINDEX_RESOLV_ID            : 2

    [
        blobURL, palloc, malloc, header, littleEnd, lock, unlock, unlockThreads, unlockBridge, findPtri,
        dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16,
        andUint32, orUint32, xorUint32, subUint32, addUint32, loadUint32, storeUint32, getUint32, setUint32, exchangeUint32, compareUint32
        andUint16, orUint16, xorUint16, subUint16, addUint16, loadUint16, storeUint16, getUint16, setUint16, exchangeUint16, compareUint16
        andUint8 , orUint8 , xorUint8 , subUint8, addUint8, loadUint8, storeUint8, getUint8, setUint8, exchangeUint8, compareUint8
        andInt32 , orInt32 , xorInt32 , subInt32, addInt32, loadInt32, storeInt32, getInt32, setInt32, exchangeInt32, compareInt32
        andInt16 , orInt16 , xorInt16 , subInt16, addInt16, loadInt16, storeInt16, getInt16, setInt16, exchangeInt16, compareInt16
        andInt8  , orInt8  , xorInt8  , subInt8, addInt8, loadInt8, storeInt8, getInt8, setInt8, exchangeInt8, compareInt8,

        Uint8Array
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
    workers     = new self.Array()
    littleEnd   = new self.Uint8Array(self.Uint32Array.of(0x01).buffer)[0]

    resolvCall  = ->
        Error.captureStackTrace e = {}
        
        stack   = e.stack.toString()
        length  = stack.length

        cBreak  = "\n".charCodeAt()
        cBrace  = "\)".charCodeAt()
        cColon  = "\:".charCodeAt()
        
        cCount  = 2
        discard = on
        lasti = length
        sum = 0
        vals = []

        while length--
            switch stack.charCodeAt length

                when cBreak then discard = !cCount = 2
                when cBrace then lasti = length
                when cColon
                    unless discard
                        val = stack.substring length + 1, lasti
                        vals.push val
                        sum = sum + parseInt val

                    lasti   = length
                    discard = on unless --cCount

        #console.warn vals
        return sum

    randomUUID  = ->
        crypto?.randomUUID() or btoa(
            new Date().toISOString()
        )
        .toLowerCase().split("")
        .toSpliced(8,0,"-").toSpliced(13,0,"-")
        .toSpliced(18,0,"-").toSpliced(24,0,"-")
        .join("").substring(0, 36).trim()
        .padEnd(36, String.fromCharCode(50 + Math.random() * 40 ))

    resolvFind = ( value, stride = 0 ) ->
        hlen = CONST.HEADERS_LENGTH 
        offset = CONST.HEADERS_LENGTH 
        i = 0

        loop
            i = header.indexOf value, offset

            break if i is -1
            diff = i - stride

            unless diff % hlen
                return diff

            offset = i + 1
        -1

    initMemory  = ->
        u64 = new self.BigUint64Array buffer
        i64 = new self.BigInt64Array buffer
        f32 = new self.Float32Array buffer
        f64 = new self.Float64Array buffer
        i32 = new self.Int32Array buffer
        u32 = new self.Uint32Array buffer
        i16 = new self.Int16Array buffer
        u16 = new self.Uint16Array buffer
        ui8 = new self.Uint8Array buffer
        cu8 = new self.Uint8ClampedArray buffer
        si8 = new self.Int8Array buffer
        dvw = new self.DataView buffer

        lockIndex           = if isBridge then 2 else 3
        unlockIndex         = if isThread then 2 else 3

        malloc              = Atomics.add.bind Atomics, u32, 0
        palloc              = Atomics.add.bind Atomics, u32, 1, CONST.HEADERS_LENGTH
        header              = u32.subarray 0, CONST.ALLOCATION_BYTEOFFSET/4

        lock                = ( i = lockIndex, value, timeout = 1000 ) ->
            #console.log "locking", name, i
            Atomics.wait i32, i, value, timeout

        unlockBridge        = -> Atomics.notify i32, 2
        unlockThreads       = -> Atomics.notify i32, 3
        unlock              = ( i = unlockIndex, count = 100 ) ->
            Atomics.notify i32, i, count 

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

    defineTypedArrays = ->

        Object.defineProperties Object.getPrototypeOf( self.Uint8Array )::,

            id          :
                get     : -> resolvs.get this
                set     : -> resolvs.set this, arguments[0]

        class Uint8Array  extends self.Uint8Array
            constructor : ( argv, byteOffset, length ) ->
                id = resolvCall()
                argc = arguments.length

                if  argc is 3
                    1 # slicing

                else if argc is 2
                    2 # slicing

                else if argc is 1

                    if  Number.isInteger argv
                        # alloc byte length
                        if  isBridge

                            byteOffset = malloc argv                             
                            ptri = palloc()

                            storeUint32 ptri + CONST.HINDEX_LENGTH     , argv
                            storeUint32 ptri + CONST.HINDEX_BYTEOFFSET , byteOffset
                            storeUint32 ptri + CONST.HINDEX_RESOLV_ID  , id

                            super buffer, byteOffset, argv

                            unlockThreads()

                        else
                            if  0 > ptri = resolvFind id, CONST.HINDEX_RESOLV_ID
                                lock()
                                ptri = resolvFind id, CONST.HINDEX_RESOLV_ID

                            byteOffset  = loadUint32 ptri + CONST.HINDEX_BYTEOFFSET
                            length      = loadUint32 ptri + CONST.HINDEX_LENGTH

                            super buffer, byteOffset, length

                    else if ArrayBuffer.isView argv
                        # alloc byte length
                        1

                this.id = id

    if  isWindow

        sharedHandler   =
            register    : ( data ) ->
                #console.warn "registering worker:", data
                Object.assign @info, data ; this
                unless workers.some (w) -> !w.info.uuid
                    #console.log "unlock time..."
                    #unlock()
                    unlockBridge()
                    queueMicrotask unlockThreads
                
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
                try buffer = new Buffer 0, { maxByteLength }
                catch then maxByteLength /= CONST.BUFFER_TEST_STEP_DIVIDER
            
            buffer.grow maxByteLength
            initMemory buffer

            orUint32 1, CONST.HEADERS_LENGTH
            orUint32 0, CONST.ALLOCATION_BYTEOFFSET

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
                    defineTypedArrays()

                    postMessage register : {
                        selfName, isBridge, isThread, threadId,
                        now, pnow, uuid, state
                    }

                    lock()
                    onready()







































































    return 0xdead;
