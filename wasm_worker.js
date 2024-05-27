var $call, onmessage;

$call = {
  // imports triggerable in wasm
  log: console.log,
  warn: console.warn,
  error: console.error
};

onmessage = async({data}) => {
  var accumulate, i32, memory, sum;
  ({
    // exports can triggerable from js
    exports: {memory, accumulate}
  } = (await WebAssembly.instantiate(data, {$call})));
  console.log({memory});
  i32 = new Int32Array(memory.buffer);
  i32.set(crypto.getRandomValues(new Int32Array(10)));
  sum = accumulate(0, 10);
  return console.log({sum});
};
