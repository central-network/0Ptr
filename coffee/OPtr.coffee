self.name = "window"

do  self.init   = ->

    log = -> console.log name, ...arguments
    warn = -> console.warn name, ...arguments
    error = -> console.error name, ...arguments
    number = -> arguments[0].split("").reduce (a,b) ->
        ( b.charCodeAt() + ( a.charCodeAt?() or a ) )

    HEADERS_LENGTH_OFFSET       = 1
    HINDEX_BEGIN                = HEADERS_LENGTH_OFFSET++
    HINDEX_END                  = HEADERS_LENGTH_OFFSET++
    HINDEX_BYTEOFFSET           = HEADERS_LENGTH_OFFSET++
    HINDEX_LENGTH               = HEADERS_LENGTH_OFFSET++
    HINDEX_BYTELENGTH           = HEADERS_LENGTH_OFFSET++
    HINDEX_RESOLV_ID            = HEADERS_LENGTH_OFFSET++
    HINDEX_THREAD_LOCK          = HEADERS_LENGTH_OFFSET++
    HINDEX_BRIDGE_LOCK          = HEADERS_LENGTH_OFFSET++

    BUFFER_TEST_START_LENGTH    = Math.pow (navigator?.deviceMemory or 1)+1, 11
    BUFFER_TEST_STEP_DIVIDER    = 1e1
    INITIAL_BYTELENGTH          = 6e4
    BYTES_PER_ELEMENT           = 4
    RESERVED_BYTELENGTH         = 64
    ALLOCATION_BYTEOFFSET       = 100000 * 16 * 4
    HEADERS_LENGTH              = 16
    HEADERS_BYTE_LENGTH         = 4 * 16
    MAX_PTR_COUNT               = 1e5
    MAX_THREAD_COUNT            = -2 + navigator?.hardwareConcurrency or 3

    EVENT_READY                 = new (class EVENT_READY extends Number)(
        number( /EVENT_READY/.source )
    )

    if  HEADERS_LENGTH_OFFSET >= HEADERS_LENGTH
        throw /MAX_HEADERS_LENGTH_EXCEED/
        
    [
        blobURL,
        buffer, objbuf, ptrbuf,
        palloc, malloc, littleEnd,
        lock, unlock, unlockThreads, unlockBridge,
        p32, dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16,

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

    resolvFind  = ( id ) ->
        i = HINDEX_RESOLV_ID + Atomics.load p32, 1

        while i > 0
            if id is Atomics.load p32, i
                return i - HINDEX_RESOLV_ID
            i -= HEADERS_LENGTH

        if  isBridge
            ptri = Atomics.add p32, 1, HEADERS_LENGTH
            Atomics.store p32, ptri + HINDEX_RESOLV_ID, id
            return ptri

        Atomics.wait p32, 3
        resolvFind id

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
        call = 0
        vals = []

        while length--
            switch stack.charCodeAt length

                when cBreak then discard = !cCount = 2
                when cBrace then lasti = length
                when cColon
                    unless discard
                        call += vals[ vals.length ] =
                            parseInt( stack.substring length + 1, lasti )

                    unless --cCount
                        discard = on

                    lasti = length

        return resolvFind call

    randomUUID  = ->
        crypto?.randomUUID() or btoa(
            new Date().toISOString()
        )
        .toLowerCase().split("")
        .toSpliced(8,0,"-").toSpliced(13,0,"-")
        .toSpliced(18,0,"-").toSpliced(24,0,"-")
        .join("").substring(0, 36).trim()
        .padEnd(36, String.fromCharCode(50 + Math.random() * 40 ))

    initMemory  = ( buffers ) ->
        objbuf = buffers.objbuf
        ptrbuf = buffers.ptrbuf

        u64 = new self.BigUint64Array objbuf
        i64 = new self.BigInt64Array objbuf
        f32 = new self.Float32Array objbuf
        f64 = new self.Float64Array objbuf
        i32 = new self.Int32Array objbuf
        u32 = new self.Uint32Array objbuf
        i16 = new self.Int16Array objbuf
        u16 = new self.Uint16Array objbuf
        ui8 = new self.Uint8Array objbuf
        cu8 = new self.Uint8ClampedArray objbuf
        si8 = new self.Int8Array objbuf
        dvw = new self.DataView objbuf

        lockIndex           = if isBridge then 2 else 3
        unlockIndex         = if isThread then 2 else 3

        p32 = new Int32Array ptrbuf

        malloc              = ( byteLength = 0, alignBytes = 1 ) ->
            if  byteLength > 0
                if  alignBytes > 1
                    if  mod = @byteLength % alignBytes
                        Atomics.add p32, 0, alignBytes - mod

                byteOffset = Atomics.add p32, 0, byteLength
                objbuf.grow byteOffset + byteLength

                return byteOffset
            return @byteLength

        do ->
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

        0

    defineTypedArrays = ->

        Object.defineProperties Object.getPrototypeOf( self.Uint8Array )::,

            ptri        :
                get     : -> resolvs.get this
                set     : -> resolvs.set this, arguments[0]

        class Uint8Array  extends self.Uint8Array
            constructor : ( argv, byteOffset, length ) ->
                ptri = resolvCall()
                argc = arguments.length

                # new TypedArray( buffer, 1221, 4 );
                if      argc is 3
                    1 # slicing

                # new TypedArray( buffer, 36 );
                else if argc is 2
                    2 # slicing

                # new TypedArray( 24 );
                # new TypedArray( buffer );
                # new TypedArray( [ 2, 4, 1 ] );
                else if argc is 1

                    # new TypedArray( 24 );
                    if  Number.isInteger argv

                        if  isBridge
                            length      = argv
                            byteLength  = argv
                            byteOffset  = malloc argv, 1
                            
                            begin       = byteOffset / 1
                            end         = begin + length
                            
                            Atomics.store p32, ptri + HINDEX_LENGTH, length
                            Atomics.store p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                            Atomics.store p32, ptri + HINDEX_BYTELENGTH, byteLength
                            Atomics.store p32, ptri + HINDEX_BEGIN, begin
                            Atomics.store p32, ptri + HINDEX_END, end

                            super objbuf, byteOffset, length

                            queueMicrotask ->
                                Atomics.notify p32, 3, MAX_THREAD_COUNT
                                Atomics.store p32, 3, 1

                        else
                            lopi = 0
                            loop
                                log "loop", lopi if lopi
                                Atomics.wait p32, 3, 0, 1000

                                length      = Atomics.load p32, ptri + HINDEX_LENGTH
                                byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                                break if length
                                break if lopi++ > 100

                            unless length
                                throw [ /WHERE_IS_MY_MIND/, { ptri, length, byteOffset, name } ]

                            super objbuf, byteOffset, length

                    # new TypedArray( new TypedArray(?) );
                    else if ArrayBuffer.isView argv
                        # alloc byte length
                        1

                this.ptri = ptri

    if  isWindow

        sharedHandler   =
            register    : ( data ) ->
                warn "registering worker:", data
                Object.assign @info, data ; this
                unless workers.some (w) -> !w.info.uuid
                    log "says it's onready time...", EVENT_READY
                    bc.postMessage EVENT_READY
                
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

        createBuffers   = ->

            Buffer  = SharedArrayBuffer ? ArrayBuffer
            buffer  = !maxByteLength =
                BUFFER_TEST_START_LENGTH

            while  !buffer
                try buffer = new Buffer 0, { maxByteLength }
                catch then maxByteLength /= BUFFER_TEST_STEP_DIVIDER

            initMemory {
                objbuf : buffer,
                ptrbuf : new Buffer( Math.min(
                    MAX_PTR_COUNT * BYTES_PER_ELEMENT,
                    maxByteLength
                ), { maxByteLength })
            }

            Atomics.store p32, 1, HEADERS_LENGTH

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
            bridge . postMessage setup : { blobURL, objbuf, ptrbuf }
            
            for i in [ 0 ... MAX_THREAD_COUNT ]
                thread = createWorker "thread" + i, threadmessage
                thread . postMessage setup : { blobURL, objbuf, ptrbuf }

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
                console.warn ""
                console.log objbuf
                console.log ptrbuf
                console.log p32

        queueMicrotask  ->
            listenEvents()
            createBuffers()
            createBlobURL()
            createThreads()




































































    if  isBridge

        addEventListener "message", (e) ->

            for req, data of e.data then switch req
                when "setup"
                    uuid = randomUUID()
                    blobURL = data.blobURL

                    initMemory data
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
                    blobURL = data.blobURL

                    initMemory data
                    defineTypedArrays()

                    postMessage register : {
                        selfName, isBridge, isThread, threadId,
                        now, pnow, uuid, state
                    }

    bc.onmessage = ( e ) -> {
        [ EVENT_READY ] : -> onready()
    }[ e.data ]()

            
























































    return 0xdead;
