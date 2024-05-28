var buffer, debug, error, info, log, onmessage, table, warn;

({log, warn, error, table, debug, info} = console);

buffer = null;

onmessage = function(e) {
  return WebAssembly.instantiate(e.data, {
    console: {
      log,
      warn,
      error,
      memdump: function(byteOffset, byteLength) {
        warn({
          byteOffset,
          byteLength,
          byteArray: new Uint8Array(buffer, byteOffset, byteLength),
          headers: new Uint32Array(buffer, byteOffset - 8, 2)
        });
        return log("\n\n");
      }
    },
    env: {
      memory: new WebAssembly.Memory({
        initial: 10,
        maximum: 100,
        shared: true
      }),
      init: error.bind(error, "main init"),
      exit: error.bind(error, "main exit")
    }
  }).then(function({
      exports: {memory, main}
    }) {
    buffer = memory.buffer;
    main();
    return setTimeout(() => {
      return log(new Uint32Array(buffer));
    }, 1000);
  });
};
