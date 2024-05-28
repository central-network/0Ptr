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
          headers: new Uint32Array(buffer, byteOffset - 12, 3)
        });
        return log("\n\n");
      }
    },
    env: {
      exit: error.bind(error, "main exit")
    }
  }).then(function({
      exports: {memory, init}
    }) {
    buffer = memory.buffer;
    return setTimeout(() => {
      init();
      return log(new Uint32Array(buffer));
    }, 1000);
  });
};
