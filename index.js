const modules = ["modules/hello_world.wasm"];


Promise.all(
    modules.map(path => fetch(path).then(f => f.arrayBuffer()))
).then(modules => {
    WebAssembly.instantiateStreaming(fetch("core.wasm"), self).then(wasm => {
        self.IPU = wasm.instance.exports;
        console.warn(IPU)
        console.log(modules)

        modules.forEach(chain => {
            const chain_ptr = IPU.load_chain(chain)
            console.warn({ chain, chain_ptr })
        });

    });
});
