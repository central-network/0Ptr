var document, isCPU, isProcessor, isWindow, lock, memory, name, now, uuid;

name = self.name != null ? self.name : self.name = "window";

isCPU = /cpu/i.test(name);

isWindow = typeof window !== "undefined";

isProcessor = !isCPU && !isWindow;

document = document != null ? document : new Proxy({}, {});

uuid = crypto.randomUUID();

memory = null;

lock = new Int32Array(new SharedArrayBuffer(4));

now = Date.now();

console.log({name, isWindow, isCPU, isProcessor});

if (isWindow) {
  (async function() {
    var processor, script, source, worker;
    script = window.document.scripts.namedItem("0ptr").text;
    source = (await ((await fetch(import.meta.url))).text());
    worker = function() {
      var thread;
      thread = new Worker(URL.createObjectURL(new Blob([source, script], {
        type: "application/javascript"
      })), {
        type: "module",
        name: arguments[0]
      });
      thread.onerror = thread.onmessageerror = console.error;
      thread.onmessage = function({data, ports}) {
        var request;
        for (request in data) {
          data = data[request];
          this[request](data);
        }
        return this;
      };
      return thread;
    };
    processor = worker("processor");
    processor.setup = function(info) {
      Object.assign(this, info);
      console.warn("window setting up processor", this);
      this.unlock = function() {
        return Atomics.notify(info.lock);
      };
      this.fork();
      this.fork();
      return this.fork();
    };
    return processor.fork = function(count) {
      var cpu;
      cpu = worker("cpu");
      processor = this;
      return cpu.setup = function(info) {
        Object.assign(this, info);
        console.warn("window setting up cpu", this);
        this.unlock = function() {
          return Atomics.notify(info.lock);
        };
        processor.postMessage({
          cpu: info
        });
        return processor.unlock();
      };
    };
  })();
}

if (isProcessor) {
  (function() {
    var buffer;
    console.error("self is now processor", {self});
    buffer = new SharedArrayBuffer(1e7);
    memory = new Uint8Array(buffer);
    postMessage({
      setup: {name, memory, uuid, lock, now}
    });
    addEventListener("message", function({data, ports}) {
      console.log("processor got message", data);
      return Atomics.notify(data.cpu.lock);
    });
    return Atomics.wait(lock);
  })();
}

if (isCPU) {
  (function() {
    console.error("self is now cpu", {self});
    postMessage({
      setup: {name, lock, uuid, now}
    });
    addEventListener("message", function({data, ports}) {
      return console.log("cpu got message", data);
    });
    return Atomics.wait(lock);
  })();
}
