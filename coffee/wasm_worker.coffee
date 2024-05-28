{ log, warn, error, table, debug, info } = console

[ { buffer: sab } = memory = new WebAssembly.Memory(
    { initial : 10, maximum : 100, shared: yes })]

onmessage = (e) -> WebAssembly.instantiate( e.data,

    console     : {
        log, warn, error,
        memdump : ( byteOffset, byteLength ) ->
            warn { byteOffset, byteLength }
            warn new Uint8Array sab, byteOffset, byteLength
            log "\n\n"

    }

    env         :
        memory  : new WebAssembly.Memory(
            initial : 10, maximum : 100, shared: yes
        )

    main        :
        init    : error.bind error, "main init"
        exit    : error.bind error, "main exit"

).then (e) -> log memory.buffer