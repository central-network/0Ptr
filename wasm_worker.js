var debug, error, info, log, onmessage, table, warn;

({log, warn, error, table, debug, info} = console);

onmessage = function(e) {
  return WebAssembly.instantiate(e.data, {
    console: {log, warn, error},
    main: {
      init: function() {
        return warn("main init:", ...arguments);
      },
      exit: function() {
        return warn("main exit:", ...arguments);
      }
    }
  }).then(function(e) {
    return log(e.exports.memory.buffer);
  });
};
