$call =

    # imports triggerable in wasm
    log     : console.log
    warn    : console.warn
    error   : console.error

onmessage = ({ data }) =>

    { exports : {

        # exports can triggerable from js
        memory,
        accumulate

    }} = await WebAssembly
        .instantiate data, { $call }

    console.log { memory }

    i32 = new Int32Array memory.buffer
    i32.set crypto.getRandomValues new Int32Array 10
    
    sum = accumulate 0, 10

    console.log { sum }

