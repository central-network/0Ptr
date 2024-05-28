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
      exports: {memory, init, SIMDf32x4mul}
    }) {
    var inA, inB, out, vec;
    buffer = memory.buffer;
    vec = 4;
    inA = 240 + (vec * 4);
    inB = inA + (vec * 4);
    out = inB + (vec * 4);
    new Float32Array(buffer, inA, vec).set([2, -2.4, 0, 0]);
    new Float32Array(buffer, inB, vec).set([4, 1.24, 0, 0]);
    SIMDf32x4mul(inA, inB, out);
    log("SIMDf32x4mul:", new Float32Array(buffer, out, vec));
    return setTimeout(() => {
      init();
      return log(new Uint32Array(buffer));
    }, 1000);
  });
};
