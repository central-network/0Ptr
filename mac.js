var battery, debug, delay, error, fs, info, keyboard, log, mouse, netlink, table, warn;

({log, warn, error, table, debug, info, delay} = console);

(mouse = function() {
  var changeX, changeY, clientX, clientY, counters, dataView, device, e, iLast, j, lastEvent, len, lendian, offsets, onevent, positions, screenX, screenY;
  device = new ArrayBuffer(64);
  counters = new Int32Array(device, 0, 10);
  positions = new Float32Array(device, 40, 6);
  dataView = new DataView(device);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  onevent = 'onpointerdown onpointermove onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave'.split(/\s+|\n/g);
  for (iLast = j = 0, len = onevent.length; j < len; iLast = ++j) {
    e = onevent[iLast];
    (function(evnt, i) {
      return window.addEventListener(evnt, function(t) {
        ++counters[counters[iLast] = i];
        positions.set(Float32Array.of(t.screenX - positions[2], t.screenY - positions[3], t.screenX, t.screenY, t.clientX, t.clientY), 0);
        return t.preventDefault();
      });
    })(e.substring(2), onevent.indexOf(e));
  }
  offsets = positions.byteOffset - 4;
  lastEvent = dataView.getInt32.bind(dataView, offsets, lendian);
  changeX = dataView.getFloat32.bind(dataView, offsets += 4, lendian);
  changeY = dataView.getFloat32.bind(dataView, offsets += 4, lendian);
  screenX = dataView.getFloat32.bind(dataView, offsets += 4, lendian);
  screenY = dataView.getFloat32.bind(dataView, offsets += 4, lendian);
  clientX = dataView.getFloat32.bind(dataView, offsets += 4, lendian);
  return clientY = dataView.getFloat32.bind(dataView, offsets += 4, lendian);
})();

(keyboard = function() {
  var activeKey, altKey, counters, ctrlKey, dataView, device, eventType, iEventCount, iKeyDownCount, iKeyUpCount, keyArray, keys, lastChar, lastCode, lastEvent, lendian, metaKey, offset, offsetAltKey, offsetCharCode, offsetCtrlKey, offsetLastEvent, offsetLocation, offsetMetaKey, offsetRepeat, offsetShiftKey, shiftKey;
  device = new ArrayBuffer(144);
  counters = new Int32Array(device, 0, 3);
  dataView = new DataView(device);
  keyArray = new Uint8Array(device, 144 - 120);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  keys = 'IntlBackslash KeyA KeyS KeyD KeyF KeyH KeyG KeyZ KeyX KeyC KeyV KeyB KeyQ KeyW KeyE KeyR KeyY KeyT Digit1 Digit2 Digit3 Digit4 Digit6 Digit5 Equal Digit9 Digit7 Minus Digit8 Digit0 BracketRight KeyO KeyU BracketLeft KeyI KeyP Enter KeyL KeyJ Quote KeyK Semicolon Backslash Comma Slash KeyN KeyM Period Tab Space Backquote Backspace NumpadEnter Escape MetaRight MetaLeft ShiftLeft CapsLock AltLeft ControlLeft ShiftRight AltRight ControlRight Fn F17 NumpadDecimal NumpadMultiply NumpadAdd NumLock VolumeUp VolumeDown VolumeMute NumpadDivide NumpadSubtract F18 F19 NumpadEqual Numpad0 Numpad1 Numpad2 Numpad3 Numpad4 Numpad5 Numpad6 Numpad7 Numpad8 Numpad9 NumpadComma IntlYen IntlRo F20 F5 F6 F7 F3 F8 F9 F11 F13 F16 F14 F10 F12 F15 F4 F2 F1 Lang2 Lang1 ContextMenu Help Home PageUp Delete End PageDown ArrowLeft ArrowRight ArrowDown ArrowUp'.split(/\s+|\n/); //120
  iKeyDownCount = 0;
  iKeyUpCount = 1;
  iEventCount = 2;
  offset = counters.byteOffset + counters.byteLength;
  offsetCharCode = offset++;
  offsetShiftKey = offset++;
  offsetCtrlKey = offset++;
  offsetAltKey = offset++;
  offsetMetaKey = offset++;
  offsetRepeat = offset++;
  offsetLocation = offset++;
  offsetLastEvent = offset++;
  window.addEventListener("keydown", function(e) {
    var charCode;
    counters[iEventCount]++;
    counters[iKeyDownCount]++;
    charCode = !e.key[1] && e.key.charCodeAt(0);
    dataView.setUint16(offsetCharCode, charCode, lendian);
    dataView.setUint8(offsetShiftKey, e.shiftKey);
    dataView.setUint8(offsetCtrlKey, e.ctrlKey);
    dataView.setUint8(offsetAltKey, e.altKey);
    dataView.setUint8(offsetMetaKey, e.metaKey);
    dataView.setUint8(offsetRepeat, e.repeat);
    dataView.setUint8(offsetLocation, e.location);
    dataView.setUint8(offsetLastEvent, 0);
    keyArray[keys.indexOf(e.code)] = 1;
    return e.preventDefault();
  });
  window.addEventListener("keyup", function(e) {
    counters[iEventCount]++;
    counters[iKeyUpCount]++;
    dataView.setUint8(offsetCharCode, 0, lendian);
    dataView.setUint8(offsetShiftKey, e.shiftKey);
    dataView.setUint8(offsetCtrlKey, e.ctrlKey);
    dataView.setUint8(offsetAltKey, e.altKey);
    dataView.setUint8(offsetMetaKey, e.metaKey);
    dataView.setUint8(offsetRepeat, e.repeat);
    dataView.setUint8(offsetLocation, e.location);
    dataView.setUint8(offsetLastEvent, 1);
    keyArray[keys.indexOf(e.code)] = 0;
    return e.preventDefault();
  });
  lastEvent = dataView.getUint8.bind(dataView, offsetLastEvent);
  shiftKey = dataView.getUint8.bind(dataView, offsetShiftKey);
  ctrlKey = dataView.getUint8.bind(dataView, offsetCtrlKey);
  altKey = dataView.getUint8.bind(dataView, offsetAltKey);
  metaKey = dataView.getUint8.bind(dataView, offsetMetaKey);
  lastCode = dataView.getUint16.bind(dataView, offsetCharCode, lendian);
  lastChar = function() {
    var c;
    return (c = lastCode()) && String.fromCharCode(c) || "";
  };
  eventType = function() {
    return ["keydown", "keyup"][lastEvent()];
  };
  return activeKey = function() {
    return keys[keyArray.findIndex(function(v) {
      return v;
    })] || 0;
  };
})();

(battery = function() {
  var charging, chargingTime, counters, dataView, device, dischargingTime, lastEvent, lendian, level, offsetCTime, offsetDTime, offsetEvent, offsetLevel, offsetState, onevents;
  device = new ArrayBuffer(24);
  counters = new Uint16Array(device, 0, 6);
  dataView = new DataView(device);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  offsetEvent = 8;
  offsetState = 10;
  offsetLevel = 12;
  offsetCTime = 16;
  offsetDTime = 20;
  onevents = 'onchargingchange onchargingtimechange ondischargingtimechange onlevelchange'.split(/\s+|\n/);
  navigator.getBattery().then(function(dev) {
    var e, iLast, j, len, results;
    results = [];
    for (iLast = j = 0, len = onevents.length; j < len; iLast = ++j) {
      e = onevents[iLast];
      results.push((function(evnt, i) {
        return this[evnt] = function(t) {
          ++counters[counters[iLast] = i];
          dataView.setUint8(offsetState, this.charging);
          dataView.setInt16(offsetLevel, this.level * 1e2, lendian);
          dataView.setInt16(offsetCTime, this.chargingTime, lendian);
          dataView.setInt16(offsetDTime, this.dischargingTime, lendian);
          return t.preventDefault();
        };
      }).call(dev, e, onevents.indexOf(e)));
    }
    return results;
  });
  lastEvent = dataView.getInt16.bind(dataView, offsetEvent, lendian);
  level = dataView.getInt16.bind(dataView, offsetLevel, lendian);
  chargingTime = dataView.getInt16.bind(dataView, offsetCTime, lendian);
  dischargingTime = dataView.getInt16.bind(dataView, offsetDTime, lendian);
  return charging = dataView.getUint8.bind(dataView, offsetState);
})();

(netlink = function() {
  var changeType, changeTypes, counters, currentState, dataView, device, downlink, effectiveType, ioffline, ionchange, ionline, itype, lendian, rtt, saveData;
  device = new ArrayBuffer(16);
  counters = new Int16Array(device, 0, 4);
  dataView = new DataView(device);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  ionchange = 0; //triggers on three events all
  ioffline = 1;
  ionline = 2;
  itype = 3;
  navigator.connection.onchange = function(e) {
    ++counters[counters[itype] = ionchange];
    dataView.setUint8(14, navigator.onLine);
    dataView.setUint8(13, parseInt(this.effectiveType));
    dataView.setUint8(12, Number(this.saveData));
    dataView.setUint16(10, this.rtt, lendian);
    dataView.setFloat32(8, this.downlink, lendian);
    return e.preventDefault();
  };
  window.addEventListener("offline", function() {
    return setTimeout(function() {
      return ++counters[counters[itype] = ioffline];
    });
  });
  window.addEventListener("online", function() {
    return setTimeout(function() {
      return ++counters[counters[itype] = ionline];
    });
  });
  changeType = dataView.getUint16.bind(dataView, 6, lendian);
  downlink = dataView.getFloat32.bind(dataView, 8, lendian);
  rtt = dataView.getUint16.bind(dataView, 10, lendian);
  saveData = dataView.getUint8.bind(dataView, 12);
  effectiveType = dataView.getUint8.bind(dataView, 13);
  currentState = dataView.getUint8.bind(dataView, 14);
  return changeTypes = ["linkspeed", "linkdown", "linkup"];
})();

(fs = function() {
  var STATE_INIT, STATE_PERSISTED_HANDLE, STATE_ROOT_HANDLE, STATE_UNPERSISTED_HANDLE, STATUS_IDLE, STATUS_READING, STATUS_WRITING, cd, counters, create, currentDir, cwd, dataArray, dataView, device, emit, events, handles, init, lendian, ls, mkdir, quota, read, root, state, status, touch, trapArguments, usage, write;
  device = new ArrayBuffer(4096 * 256 * 128); //128mb önbellek
  counters = new Int32Array(device, 0, 4);
  info = new DataView(device, counters.byteOffset, 4);
  dataArray = new Uint8Array(device, info.byteOffset);
  dataView = new DataView(device);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  handles = [, ];
  root = null;
  currentDir = null;
  quota = dataView.getInt32.bind(dataView, 12, lendian);
  usage = dataView.getInt32.bind(dataView, 16, lendian);
  write = dataView.getInt32.bind(dataView, 20, lendian);
  read = dataView.getInt32.bind(dataView, 24, lendian);
  create = dataView.getInt32.bind(dataView, 28, lendian);
  state = dataView.getUint8.bind(dataView, 32);
  status = dataView.getUint8.bind(dataView, 34);
  STATE_INIT = 0;
  STATE_ROOT_HANDLE = 1;
  STATE_UNPERSISTED_HANDLE = 2;
  STATE_PERSISTED_HANDLE = 3;
  STATUS_IDLE = 0;
  STATUS_READING = 1;
  STATUS_WRITING = 2;
  events = 'onstorageroothandle onstoragepersisted onstoragecreatedirectory storagecreatefile'.split(/\s+|\n/g);
  emit = function(type, detail = {}) {
    return window.dispatchEvent(new CustomEvent(type, {detail}));
  };
  window.addEventListener("storagecreatedirectory", function({detail}) {
    dataView.setInt32(28, create() + 1, lendian);
    return log("onstoragecreatedirectory:", detail);
  });
  window.addEventListener("storagecreatefile", function({detail}) {
    dataView.setInt32(28, create() + 1, lendian);
    return log("onstoragecreatefile:", detail);
  });
  window.addEventListener("storagepersist", function() {
    return dataView.setUint8(32, STATE_PERSISTED_HANDLE);
  });
  window.addEventListener("storageroothandle", function() {
    dataView.setUint8(32, STATE_ROOT_HANDLE);
    currentDir = root;
    try {
      navigator.storage.persisted().then(function(persisted) {
        if (!persisted) {
          dataView.setUint8(32, STATE_UNPERSISTED_HANDLE);
          return navigator.storage.persist().then(function(persisted) {
            if (persisted) {
              return window.dispatchEvent(new Event("storagepersist"));
            }
          });
        } else {
          return window.dispatchEvent(new Event("storagepersist"));
        }
      });
    } catch (error1) {}
    try {
      return navigator.storage.estimate().then(function(estimate) {
        dataView.setInt32(16, estimate.quota, lendian);
        return dataView.setInt32(20, estimate.usage, lendian);
      });
    } catch (error1) {}
  });
  init = function() {
    dataView.setUint8(32, STATE_INIT);
    try {
      return navigator.storage.getDirectory().then(function(handle) {
        if (handle instanceof FileSystemDirectoryHandle) {
          handles.push(root = handle);
          return window.dispatchEvent(new Event("storageroothandle"));
        }
      });
    } catch (error1) {}
  };
  cd = async function(dirName, handle = currentDir) {
    return currentDir = (await handle.getDirectoryHandle(dirName));
  };
  mkdir = async function(dirName, handle = currentDir) {
    var dir;
    if (dir = (await handle.getDirectoryHandle(dirName, {
      create: true
    }))) {
      emit("storagecreatedirectory", {dir});
    }
    return dir;
  };
  touch = async function(fileName, handle = currentDir) {
    var file;
    if (file = (await handle.getFileHandle(fileName, {
      create: true
    }))) {
      emit("storagecreatefile", {file});
    }
    return file;
  };
  ls = async function(handle = currentDir) {
    var item, items, iterator;
    iterator = (await handle.entries());
    items = [];
    while (true) {
      item = (await iterator.next());
      if (item.done === true) {
        break;
      }
      items.push(item.value);
    }
    return items;
  };
  cwd = async function(handle = currentDir) {
    return (await root.resolve(handle));
  };
  self.mkdir = mkdir;
  self.cwd = cwd;
  self.touch = touch;
  self.handles = handles;
  trapArguments = function(args, include = "") {
    var arg, char, j, k, l, len, len1, len2, list, m, n, num, parameter, parameters, ref;
    list = 'abcdefghijklmnoptrstuvyzqxw';
    list = list + list.toUpperCase();
    list = list.split("");
    ref = list.slice();
    for (j = 0, len = ref.length; j < len; j++) {
      char = ref[j];
      for (num = l = 0; l < 10; num = ++l) {
        list.push(char + num);
      }
    }
    if ("string" === typeof include) {
      include = include.split(" ");
    }
    for (m = 0, len1 = include.length; m < len1; m++) {
      arg = include[m];
      if (!list.includes(arg)) {
        list.push(arg);
      }
    }
    parameters = {};
    for (n = 0, len2 = list.length; n < len2; n++) {
      parameter = list[n];
      parameters[parameter] = {
        configurable: true,
        get: args.push.bind(args, parameter)
      };
    }
    for (k in parameters) {
      Object.defineProperty(window, k, parameters[k]);
    }
    queueMicrotask(function() {
      var results;
      results = [];
      for (k in parameters) {
        results.push(Reflect.deleteProperty(window, k));
      }
      return results;
    });
    return args;
  };
  Object.defineProperties(window, {
    cd: {
      get: function() {
        var args, pxy;
        trapArguments(args = [], "up");
        pxy = new Proxy({}, {
          get: function(o, key) {
            switch (true) {
              case key === Symbol.toPrimitive:
                return function() {
                  args.push("..");
                  return 0;
                };
              case "string" === typeof key:
                args.push(key);
                return 0;
            }
          }
        });
        queueMicrotask(async function() {
          var up;
          if (-1 !== (up = args.indexOf("up"))) {
            args.splice(up, 1);
          }
          if (args[0] === "..") {
            throw /UP/;
          }
          return (await cd(args[0]));
        });
        return pxy;
      }
    },
    ls: {
      get: function() {
        var args;
        trapArguments(args = [], "la lh");
        queueMicrotask(async function() {
          var dirName;
          [dirName = ""] = (await cwd());
          (dirName = "/" + dirName);
          return ls().then(function(items) {
            var gid, item, j, len;
            gid = ["total:", items.length, "path:", dirName];
            console.group(...gid);
            console.log("..");
            for (j = 0, len = items.length; j < len; j++) {
              [item] = items[j];
              console.log(item);
            }
            return console.groupEnd(...gid);
          });
        });
        return 1;
      }
    }
  });
  init();
  return requestIdleCallback(function() {
    return log("state:", state(), "persisted:", state() >= STATE_PERSISTED_HANDLE, "status:", status());
  });
})();
