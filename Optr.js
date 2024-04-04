var fetchAll, onready, onrequest;

onready = function() {
  return addEventListener("message", (e) => {
    return arguments[0].call(new Window(new Thread(e.data)));
  });
};

onrequest = function(i, e) {
  var args, call, func, j, len, lock, prop, root;
  ({func, args, lock} = e.data);
  (root = self);
  for (j = 0, len = func.length; j < len; j++) {
    prop = func[j];
    root = root[prop];
  }
  func = root.bind(self[func[0]]);
  call = func(...args);
  Atomics.add(this, 0, 1);
  Atomics.store(this, i, 10000 * Math.random());
  return Atomics.notify(this, i, 1);
};

fetchAll = async function() {
  var r, results, url, urls;
  urls = [...arguments];
  results = [];
  while (url = urls.splice(0, 1).at(0)) {
    if (r = (await fetch(url))) {
      results.push((await r.text()));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

queueMicrotask(async function() {
  var base, body, code, data, head, i, j, libs, mods, ref, results, size, thread, type;
  size = .25 * Math.pow((typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0) || 2, 10 + 1);
  data = new SharedArrayBuffer(1e8, {
    maxByteLength: size
  });
  body = document.currentScript.text || (function() {
    throw ["?CODE?"];
  })();
  Atomics.store(new Uint32Array(data), 0, 2);
  Atomics.store(new Uint32Array(data), 0, 8);
  base = (await fetchAll("./OPtr_pointer.js", "./OPtr_thread.js", "./OPtr_window.js"));
  mods = base.join("\n").split(/ class /g).slice(1).filter(function(c) {
    return c[0] === c[0].toUpperCase();
  }).map(function(n) {
    return n.split(" ")[0];
  });
  base.push(`export { ${mods} }`);
  type = "application/javascript";
  libs = URL.createObjectURL(new Blob(base, {type}));
  head = `import { ${mods} } from '${libs}';` + `(${onready})`;
  code = URL.createObjectURL(new Blob([head, body], {type}));
  results = [];
  for (i = j = 1, ref = (typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0) || 2; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
    thread = new Worker(code, {
      type: "module",
      name: i
    });
    thread.addEventListener("message", onrequest.bind(new Int32Array(data), i));
    results.push(thread.postMessage(data));
  }
  return results;
});
