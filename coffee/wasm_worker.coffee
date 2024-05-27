{ log, warn, error, table, debug, info } = console

onmessage = (e) -> WebAssembly.instantiate( e.data,

    console     : { log, warn, error }
    
    main        :
        init    : -> warn "main init:", arguments...
        exit    : -> warn "main exit:", arguments...

).then (e) -> log e.exports.memory.buffer