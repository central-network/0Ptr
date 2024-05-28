{ log, warn, error, table, debug, info } = console

buffer = null

onmessage = (e) -> WebAssembly.instantiate( e.data,

    console     : {
        log, warn, error,
        memdump : ( byteOffset, byteLength ) ->
            warn {
                byteOffset,
                byteLength,
                byteArray : new Uint8Array buffer, byteOffset, byteLength
                headers: new Uint32Array buffer, byteOffset-12, 3
            }
            log "\n\n"

    }

    env         :
        exit    : error.bind error, "main exit"

).then ({exports: {memory, init}}) ->
    buffer = memory.buffer

    
    setTimeout =>
        init()

        log new Uint32Array buffer
    , 1000

