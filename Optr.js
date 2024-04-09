var cpus, document, i32, isCPU, isProcessor, isWindow, lock, memory, name, now, uuid;

name = self.name != null ? self.name : self.name = "window";

isCPU = /cpu/i.test(name);

isWindow = typeof window !== "undefined";

isProcessor = !isCPU && !isWindow;

document = document != null ? document : new Proxy({}, {});

uuid = crypto.randomUUID();

memory = null;

i32 = null;

lock = new Int32Array(new SharedArrayBuffer(4));

now = Date.now();

self.cpus = cpus = [];

console.log({name, isWindow, isCPU, isProcessor, self});

if (isWindow) {
  (async function() {
    var i, processor, script, source, worker;
    script = window.document.scripts.namedItem("0ptr").text;
    source = (await ((await fetch(import.meta.url))).text());
    worker = function() {
      var thread;
      thread = new Worker(URL.createObjectURL(new Blob([source, `const onready = function () {${script}};`], {
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
    i = 0;
    processor.setup = function(processorInfo) {
      Object.assign(this, processorInfo);
      i32 = new Int32Array(processorInfo.memory);
      console.warn("window setting up processor", this);
      this.unlock = function() {
        return Atomics.notify(processorInfo.lock);
      };
      cpus.push(this.fork(i++));
      cpus.push(this.fork(i++));
      cpus.push(this.fork(i++));
      cpus.push(this.fork(i++));
      cpus.push(this.fork(i++));
      cpus.push(this.fork(i++));
      return i--;
    };
    processor.cpuReady = function(cpuinfo) {
      var cpu, j, len;
      console.log("cpu ready", cpuinfo);
      if (cpuinfo.name === "cpu" + i) {
        for (j = 0, len = cpus.length; j < len; j++) {
          cpu = cpus[j];
          cpu.postMessage({
            ready: {
              on: true
            }
          });
        }
        this.postMessage({
          ready: {
            on: true
          }
        });
        return console.log("run code");
      }
    };
    return processor.fork = function(i) {
      var cpu;
      cpu = worker("cpu" + i);
      processor = this;
      cpu.ready = function(cpuinfo) {
        console.log("cpu is ready", cpuinfo);
        return processor.cpuReady(cpuinfo);
      };
      cpu.setup = function(cpuinfo) {
        Object.assign(this, cpuinfo);
        console.warn("window setting up cpu", this);
        this.unlock = function() {
          return Atomics.notify(cpuinfo.lock);
        };
        processor.postMessage({
          cpu: cpuinfo
        });
        this.postMessage({
          processorInfo: {
            name: processor.name,
            memory: processor.memory,
            uuid: processor.uuid,
            lock: processor.lock,
            now: processor.now
          }
        });
        return processor.unlock();
      };
      return cpu;
    };
  })();
}

if (isProcessor) {
  (function() {
    console.error("self is now processor", {self});
    memory = new SharedArrayBuffer(1e7);
    i32 = new Int32Array(memory);
    postMessage({
      setup: {name, memory, uuid, lock, now}
    });
    addEventListener("message", function({data, ports}) {
      var req, results;
      console.log("processor got message", data);
      results = [];
      for (req in data) {
        data = data[req];
        switch (req) {
          case "cpu":
            cpus.push(data);
            Atomics.notify(data.lock);
            results.push(console.log(cpus));
            break;
          case "ready":
            onready.call(this);
            results.push(Atomics.notify(i32));
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    });
    return Atomics.wait(lock);
  })();
}

if (isCPU) {
  (function() {
    console.error("self is now cpu", {self});
    cpus.push(self);
    postMessage({
      setup: {name, lock, uuid, now}
    });
    addEventListener("message", function({data, ports}) {
      var req, results;
      results = [];
      for (req in data) {
        data = data[req];
        switch (req) {
          case "processorInfo":
            this.processor = data;
            memory = data.memory;
            postMessage({
              ready: {name}
            });
            results.push(i32 = new Int32Array(memory));
            break;
          case "ready":
            Atomics.wait(i32);
            results.push(onready.call(this));
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    });
    return Atomics.wait(lock);
  })();
}
