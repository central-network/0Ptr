var debug, error, info, log, memory, onmessage, sab, table, warn;

({log, warn, error, table, debug, info} = console);

[
  ({
    buffer: sab
  } = memory = new WebAssembly.Memory({
    initial: 10,
    maximum: 100,
    shared: true
  }))
];

onmessage = function(e) {
  return WebAssembly.instantiate(e.data, {
    console: {
      log,
      warn,
      error,
      memdump: function(byteOffset, byteLength) {
        warn({byteOffset, byteLength});
        warn(new Uint8Array(sab, byteOffset, byteLength));
        return log("\n\n");
      }
    },
    env: {
      memory: new WebAssembly.Memory({
        initial: 10,
        maximum: 100,
        shared: true
      })
    },
    main: {
      init: error.bind(error, "main init"),
      exit: error.bind(error, "main exit")
    }
  }).then(function(e) {
    return log(memory.buffer);
  });
};
