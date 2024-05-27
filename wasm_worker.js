var imports, onmessage;

imports = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

onmessage = async({
    data: module
  }) => {
  var accumulate, exports, i, i32, j, memory, sum;
  ({exports} = (await WebAssembly.instantiate(module, {imports})));
  ({memory, accumulate} = exports);
  console.log(memory);
  i32 = new Uint32Array(memory.buffer);
  for (i = j = 0; j < 10; i = ++j) {
    i32[i] = i;
  }
  sum = accumulate(0, 10);
  return console.log(sum);
};
