window? and do -> postMessage(0)

self.onmessage  = ->
    selfName    = self.name
    isWindow    = document?
    isWorker    = !isWindow
    isBridge    = /bridge/i.test selfName  
    isCPU       = selfName.startsWith /cpu/.source
    isGPU       = selfName.startsWith /gpu/.source
    amiPU       = /pu/i.test selfName.substring 1, 3
    puid        = amiPU and parseInt selfName.match /\d+/
    now         = Date.now()
    pnow        = performance.now()
    source      = do ->
        return  unless document?
            
        __user = "self.onready = function () {" +
            [ ...document.scripts ].find( (d) => d.text and d.src ).text + 
        "}};"

        __0ptr = "self.onmessage = " + self.onmessage.toString().split(
            new RegExp( 'return 0x' + 57005.toString(16) + ';' )
        )[0]

        URL.createObjectURL new Blob [
            __0ptr, __user
        ], { type: "application/javascript" }

    randomUUID  = ->
        crypto?.randomUUID() or btoa(
            new Date().toISOString()
        )
        .toLowerCase().split("")
        .toSpliced(8,0,"-").toSpliced(13,0,"-")
        .toSpliced(18,0,"-").toSpliced(24,0,"-")
        .join("").substring(0, 36).trim()
        .padEnd(36, String.fromCharCode(50 + Math.random() * 40 ))
    forkWorker  = ->

    uuid        = randomUUID()
    CONST       =
        BUFFER_TEST_START_LENGTH    : 1e6
        BUFFER_TEST_STEP_DIVIDER    : 1e1
        BUFFER_BYTEOFFSET           : 64
        BYTES_PER_ELEMENT           : 4
        HEADERS_LENGTH              : 16
        HEADERS_BYTE_LENGTH         : 4 * 16
    buffer      = isWindow and do ->
        Buffer  = SharedArrayBuffer ? ArrayBuffer
        buffer  = !maxByteLength =
            CONST.BUFFER_TEST_START_LENGTH

        while  !buffer
            try buffer = new Buffer CONST.BUFFER_BYTEOFFSET, { maxByteLength }
            catch then maxByteLength /= CONST.BUFFER_TEST_STEP_DIVIDER
        
        buffer

    @this       = {
        selfName, isWindow, isWorker,
        isBridge, isCPU, isGPU, puid, uuid,
        source, buffer
    }























    if  isWindow
        console.warn w = new Worker( source, { name } )
        w.postMessage 0
        console.log "hello from window"










































































    if  isWorker
        console.log "hello from worker"










































































    return 0xdead;
