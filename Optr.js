var j, len, onrequest, ref, scope, script;

if (typeof SharedArrayBuffer === "undefined" || SharedArrayBuffer === null) {
  throw /SHARED_ARRAY_BUFFER_NOT_AVAILABLE/;
}

import "./prototype.js";

import {
  Pointer,
  Scope
} from "./0ptr_pointer.js";

scope = new Scope(self);

ref = document.scripts;
for (j = 0, len = ref.length; j < len; j++) {
  script = ref[j];
  if (import.meta.url === script.src) {
    if (script = `${script.text}`) {
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
  console.log(2, data);
  //? window gets message that means some remote
  //? controller connected to this device
  //? so, we need to do what we do 
  buffer = new SharedArrayBuffer(data);
  //* at this point, memory is initialized
  return console.warn(`[${self.constructor.name}]`, performance.now(2), "memory is initialized", buffer);
});

addEventListener("load", function() {
  var cpuURL;
  cpuURL = URL.createWorkerURL(`import 'https://${location.href}/prototype.js'; import 'https://${location.href}/0ptr_window.js'; addEventListener( 'message', function ({ data }){ self.memory = data.memory.defineProperties(); self.postMessage(0); memory.lock(1); console.error('cpu unlocked', name ); /* user code evaulating: */${script} });`);
  self.bridge = new Worker(URL.createWorkerURL(`import 'https://${location.href}/prototype.js'; import 'https://${location.href}/0ptr_window.js'; self.memory = new SharedArrayBuffer(); self.postMessage({ memory: self.memory, name }); memory.lock(); console.warn( 'bridge unlocked:', name ); /* user code evaulating: */${script}`));
  return bridge.addEventListener("message", function({data}) {
    var cpu, cpuCount, threads, waiting;
    self.memory = data.memory.defineProperties();
    console.warn('bridge ready:', data.name);
    cpuCount = Math.max(2, ((typeof navigator !== "undefined" && navigator !== null ? navigator.hardwareConcurrency : void 0) || 2) - 2);
    cpuCount = 2;
    waiting = cpuCount;
    threads = [];
    while (cpuCount--) {
      cpu = new Worker(cpuURL, cpuCount);
      cpu.onmessage = function({
          data: i
        }) {
        threads.push(this);
        if (--waiting) {
          return;
        }
        requestIdleCallback(function() {
          return memory.unlock(1);
        });
        return memory.unlock();
      };
      cpu.postMessage({
        memory: self.memory
      });
    }
    return self.onclick = function() {
      return console.log(threads);
    };
  });
});
