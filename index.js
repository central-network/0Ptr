WebAssembly.instantiateStreaming(fetch("core.wasm"), self).then(wasm => {
    self.IPU = wasm.instance.exports;
    console.warn(IPU)
});