WebAssembly.instantiateStreaming(fetch("core.wasm"), self).then(wasm => {
    const IPU = wasm.instance.exports;

    const src = IPU.new(Uint32Array, 24);
    const src2 = IPU.new(Float32Array, 224);

    console.warn(IPU)
    console.warn(src)
    console.warn(src2)
})