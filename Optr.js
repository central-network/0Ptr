var j, len, onrequest, ref, scope, script;

if (typeof SharedArrayBuffer === "undefined" || SharedArrayBuffer === null) {
  throw /SHARED_ARRAY_BUFFER_NOT_AVAILABLE/;
}

import "./prototype.js";

import {
  Pointer,
  Scope
} from "./OPtr_pointer.js";

scope = new Scope(self);

ref = document.scripts;
for (j = 0, len = ref.length; j < len; j++) {
  script = ref[j];
  if (import.meta.url === script.src) {
    if (script = script.text) {
      break;
    }
  }
}

if (!script) {
  throw "?CODE?";
}

onrequest = function(i, e) {
  var args, call, func, k, len1, lock, prop, root;
  ({func, args, lock} = e.data);
  (root = self);
  for (k = 0, len1 = func.length; k < len1; k++) {
    prop = func[k];
    root = root[prop];
  }
  func = root.bind(self[func[0]]);
  call = func(...args);
  Atomics.add(this, 0, 1);
  Atomics.store(this, i, 10000 * Math.random());
  return Atomics.notify(this, i, 1);
};

addEventListener("message", function({data}) {
  var buffer;
  //? window gets message that means some remote
  //? controller connected to this device
  //? so, we need to do what we do 
  buffer = new SharedArrayBuffer(data);
  //* at this point, memory is initialized
  return console.warn(`[${self.constructor.name}]`, performance.now(2), "memory is initialized", buffer);
});
