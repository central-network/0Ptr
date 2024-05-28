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
                headers: new Uint32Array buffer, byteOffset-8, 2
            }
            log "\n\n"

    }

    env         :
        memory  : new WebAssembly.Memory(
            initial : 10, maximum : 100, shared: yes
        )

        init    : error.bind error, "main init"
        exit    : error.bind error, "main exit"

).then ({exports: {memory, main}}) ->
    buffer = memory.buffer
    main()

    setTimeout =>
        log new Uint32Array buffer
    , 1000

