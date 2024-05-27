imports    =
    log     : console.log
    warn    : console.warn
    error   : console.error

onmessage = ({ data: module }) =>

    { exports } = await WebAssembly
        .instantiate module, { imports }

    {
        memory,
        accumulate
    } = exports
    
    console.log memory

    i32 = new Uint32Array memory.buffer

    for i in [ 0 ... 10 ]
        i32[i] = i
    
    sum = accumulate(0, 10);
    console.log(sum);

