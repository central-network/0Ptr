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

).then ({exports: {memory, init, SIMDf32x4mul}}) ->
    buffer = memory.buffer

    vec = 4

    inA = 240 + ( vec * 4 )
    inB = inA + ( vec * 4 )
    out = inB + ( vec * 4 )

    new Float32Array( buffer, inA, vec )
        .set([ 2, -2.4, 0, 0 ])

    new Float32Array( buffer, inB, vec )
        .set([ 4, 1.24, 0, 0 ])

    SIMDf32x4mul inA, inB, out
    
    log "SIMDf32x4mul:", new Float32Array buffer, out, vec
    
    setTimeout =>
        init()

        log new Uint32Array buffer
    , 1000

