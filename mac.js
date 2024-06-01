var battery, debug, delay, error, fs, info, keyboard, log, mouse, netlink, table, warn;

({log, warn, error, table, debug, info, delay} = console);

window.onerror = window.onunhandledrejection = function() {
  document.body.innerHTML += JSON.stringify(arguments);
  return true;
};

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
    return keyArray[keys.indexOf(e.code)] = 1;
  });
  //e.preventDefault()
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
    return keyArray[keys.indexOf(e.code)] = 0;
  });
  //e.preventDefault()
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
  /* 
  log handle = await pick( "dir" )
  log await ls handle

  if  handle instanceof FileSystemDirectoryHandle
      await mv handle, currentDir

  else if Array.isArray handle
      2
  else if handle instanceof FileSystemFileHandle
      3
  */
  var STATE_INIT, STATE_PERSISTED_HANDLE, STATE_ROOT_HANDLE, STATE_UNPERSISTED_HANDLE, STATUS_IDLE, STATUS_READING, STATUS_WRITING, askp, cat, cd, counters, create, currentDir, currentFile, dataArray, dataView, device, emit, events, handles, init, issame, lendian, ls, mkdir, mv, mv_d2d, mv_f2d, mv_f2f, parent, pick, queryp, quota, read, remove, resolv, rm, rmdir, root, setcwd, state, status, terminalify, touch, usage, write;
  device = new ArrayBuffer(4096 * 256 * 128); //128mb önbellek
  counters = new Int32Array(device, 0, 10);
  dataArray = new Uint8Array(device, counters.byteLength);
  dataView = new DataView(device);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  handles = [, ];
  root = null;
  currentDir = null;
  currentFile = null;
  quota = dataView.getInt32.bind(dataView, 12, lendian);
  usage = dataView.getInt32.bind(dataView, 16, lendian);
  write = dataView.getInt32.bind(dataView, 20, lendian);
  read = dataView.getInt32.bind(dataView, 24, lendian);
  create = dataView.getInt32.bind(dataView, 28, lendian);
  remove = dataView.getInt32.bind(dataView, 32, lendian);
  state = dataView.getUint8.bind(dataView, 36);
  status = dataView.getUint8.bind(dataView, 37);
  STATE_INIT = 0;
  STATE_ROOT_HANDLE = 1;
  STATE_UNPERSISTED_HANDLE = 2;
  STATE_PERSISTED_HANDLE = 3;
  STATUS_IDLE = 0;
  STATUS_READING = 1;
  STATUS_WRITING = 2;
  events = 'onstorageroothandle onstoragepersisted onstoragecreatedirectory onstoragecreatefile onstorageremovefile'.split(/\s+|\n/g);
  emit = function(type, detail) {
    window.dispatchEvent(new CustomEvent(type, {detail}));
    return detail;
  };
  window.addEventListener("storagecreatedirectory", function({detail}) {
    dataView.setInt32(28, create() + 1, lendian);
    return log("onstoragecreatedirectory:", detail);
  });
  window.addEventListener("storageremovedirectory", function({detail}) {
    dataView.setInt32(32, remove() + 1, lendian);
    return log("onstorageremovedirectory:", detail);
  });
  window.addEventListener("storagecreatefile", function({detail}) {
    dataView.setInt32(28, create() + 1, lendian);
    return log("onstoragecreatefile:", detail);
  });
  window.addEventListener("storageremovefile", function({detail}) {
    dataView.setInt32(32, remove() + 1, lendian);
    return log("onstorageremovefile:", detail);
  });
  window.addEventListener("storagepersist", function() {
    return dataView.setUint8(32, STATE_PERSISTED_HANDLE);
  });
  window.addEventListener("storageroothandle", async function() {
    dataView.setUint8(32, STATE_ROOT_HANDLE);
    await setcwd(currentDir = root);
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
    return (await setcwd(currentDir = (await handle.getDirectoryHandle(dirName))));
  };
  setcwd = async function(handle = currentDir) {
    Object.defineProperty(window, "cwd", {
      writable: true,
      configurable: true,
      value: "/" + [...(await resolv(handle))].join("/")
    });
    return handle;
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
  touch = async function(anyForD, target = currentDir) {
    var handle;
    if (anyForD instanceof FileSystemFileHandle) {
      return (await touch(anyForD.name, target));
    }
    if (anyForD instanceof FileSystemDirectoryHandle) {
      return (await mkdir(anyForD.name, target));
    }
    if (typeof anyForD === "string") {
      handle = (await target.getFileHandle(anyForD, {
        create: true
      }));
      emit("storagecreatefile", handle);
    }
    return handle;
  };
  parent = function(handle = currentDir) {};
  //todo
  rmdir = async function(dirName, recursive = false, handle = currentDir) {
    if (recursive instanceof FileSystemHandle) {
      recursive = !(handle = recursive);
    }
    await handle.removeEntry(dirName, {recursive});
    return emit("storageremovedirectory", {dirName});
  };
  rm = async function(anyForD, force = false, recursive = false, handle = currentDir) {
    var item;
    if (force instanceof FileSystemHandle) {
      force = recursive = !(handle = force);
    }
    if (recursive instanceof FileSystemHandle) {
      recursive = !(handle = recursive);
    }
    if (!(item = ((await ls(handle))).find(function([i]) {
      return i === anyForD;
    }))) {
      return error(`File or folder (${anyForD}) is not in: ${cwd}`);
    }
    if (item[1] instanceof FileSystemDirectoryHandle) {
      if (!force) {
        if (((await ls(item[1]))).length) {
          return error("Folder is not empty");
        }
      }
    }
    await handle.removeEntry(anyForD, {recursive});
    return emit("storageremovefile", {anyForD});
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
  resolv = async function(handle = currentDir) {
    return (await root.resolve(handle));
  };
  queryp = async function(handle, mode = "readwrite") {
    return "granted" === (await handle.queryPermission({mode}));
  };
  askp = async function(handle, mode = "readwrite") {
    return "granted" === (await handle.requestPermission({mode}));
  };
  issame = async function(handle, target) {
    return (await target.isSameEntry(handle));
  };
  read = async function(file, handle = currentDir) {
    var fhandle, j, len, ref;
    if (file instanceof FileSystemFileHandle) {
      ({
        name: file
      } = (fhandle = file));
    } else if (Array.isArray(file)) {
      [file, fhandle] = file;
    } else if ("string" === typeof file) {
      ref = (await ls(handle));
      for (j = 0, len = ref.length; j < len; j++) {
        [, fhandle] = ref[j];
        if (fhandle.name !== file) {
          continue;
        }
        return (await fhandle.getFile());
      }
    }
    if (!fhandle instanceof FileSystemFileHandle) {
      throw [/FILE_HANDLE_NOTAFILE/, ...arguments];
    }
    return (await fhandle.getFile());
  };
  cat = async function(file, handle = currentDir) {
    return (await ((await read(file, handle))).text());
  };
  write = async function(data, writeableFHandle = currentFile) {
    var e, writableStream;
    if (data instanceof FileSystemFileHandle) {
      data = (await read(data));
    }
    try {
      // FileSystemWritableFileStream
      writableStream = (await writeableFHandle.createWritable());
      await writableStream.write(data);
      return (await writableStream.close());
    } catch (error1) {
      e = error1;
      return error(e, ...arguments);
    } finally {
      return writeableFHandle;
    }
  };
  pick = async function(type = "directory") {
    if (/dir/.test(type)) {
      return (await window.showDirectoryPicker());
    } else if (/file/.test(type)) {
      return (await window.showOpenFilePicker());
    } else if (/savefile/.test(type)) {
      return (await window.showSaveFilePicker());
    } else {
      throw /UNDEFINED_TYPE_PICK/;
    }
  };
  mv_f2f = async function(srcFHandle, dstFHandle, force = false) {
    if (!srcFHandle instanceof FileSystemFileHandle) {
      throw /SRC_MUST_BE_FILE/;
    }
    if (!dstFHandle instanceof FileSystemFileHandle) {
      throw /DST_MUST_BE_FILE/;
    }
    if ((await issame(srcFHandle, dstFHandle))) {
      throw /SRC_AND_DST_ISSAME/;
    }
    if (((await queryp(dstFHandle))) === false) {
      throw /NO_PERMISSON_WRITE_TO_TARGET/;
    }
    if (((await queryp(srcFHandle, "read"))) === false) {
      throw /NO_PERMISSON_READ_TO_SOURCE/;
    }
    return (await write(srcFHandle, dstFHandle));
  };
  mv_f2d = async function(srcFHandle, dstDHandle) {
    var dstFHandle;
    if (!srcFHandle instanceof FileSystemFileHandle) {
      throw /SRC_MUST_BE_FILE/;
    }
    if (!dstDHandle instanceof FileSystemDirectoryHandle) {
      throw /DST_MUST_BE_DIRECTORY/;
    }
    if (((await queryp(dstDHandle))) === false) {
      throw /NO_PERMISSON_WRITE_TO_TARGET/;
    }
    if (((await queryp(srcFHandle, "read"))) === false) {
      throw /NO_PERMISSON_READ_TO_SOURCE/;
    }
    dstFHandle = (await touch(srcFHandle, dstDHandle));
    return (await mv_f2f(srcFHandle, dstFHandle));
  };
  mv_d2d = async function(srcDHandle, dstDHandle) {
    var d, fdHandle, j, len, ref;
    if (!srcDHandle instanceof FileSystemDirectoryHandle) {
      throw /SRC_MUST_BE_DIRECTORY/;
    }
    if (!dstDHandle instanceof FileSystemDirectoryHandle) {
      throw /DST_MUST_BE_DIRECTORY/;
    }
    if ((await issame(srcDHandle, dstDHandle))) {
      throw /SRC_AND_DST_ISSAME/;
    }
    d = (await mkdir(srcDHandle.name, dstDHandle));
    ref = (await ls(srcDHandle));
    for (j = 0, len = ref.length; j < len; j++) {
      [, fdHandle] = ref[j];
      if (fdHandle instanceof FileSystemFileHandle) {
        await mv_f2d(fdHandle, d);
        continue;
      }
      if (fdHandle instanceof FileSystemDirectoryHandle) {
        await mv_d2d(fdHandle, d);
        continue;
      }
    }
    return 1;
  };
  mv = async function(handle, target = currentDir) {
    var _ls, ihandle, j, len;
    if (target instanceof Array) {
      target = target.find(function(i) {
        return i instanceof FileSystemHandle;
      });
    }
    if (typeof target === "string") {
      target = target === "." ? currentDir : (_ls = (await ls(currentDir)), _ls.find(function(fd) {
        return fd.name === target;
      }));
    }
    if (!target instanceof FileSystemHandle) {
      throw [/TARGET_UNRESOLVED/, ...arguments];
    }
    if (handle instanceof FileSystemFileHandle) {
      if (target instanceof FileSystemFileHandle) {
        return (await mv_f2f(handle, target));
      }
      if (target instanceof FileSystemDirectoryHandle) {
        return (await mv_f2d(handle, target));
      }
    }
    if (handle instanceof FileSystemDirectoryHandle) {
      if (target instanceof FileSystemFileHandle) {
        throw /NOT_POSSIBLE_WRITE_DIR_TO_FILE/;
      }
      if (target instanceof FileSystemDirectoryHandle) {
        return (await mv_d2d(handle, target));
      }
    }
    if (handle instanceof Array) {
      for (j = 0, len = handle.length; j < len; j++) {
        ihandle = handle[j];
        await mv(ihandle, target);
      }
    }
    if (typeof handle === "string") {
      handle = ((await ls(currentDir))).find(function(i) {
        return i.name === handle;
      });
      return (await mv(handle, target));
    }
    throw [/SOURCE_ARRAY_UNRESOLVED/, handle];
    return (await rmdir(handle.name, target));
  };
  self.onclick = async function() {
    return log((await cat("worker.js")));
  };
  (terminalify = function() {
    var a, cmd, get, trap, trapArguments;
    trapArguments = function(args, list) {
      var getter, j, k, len, parameter, parameters;
      getter = function() {
        if (arguments[1] === Symbol.toPrimitive) {
          return function() {
            trap.primitived++;
            return 1;
          };
        }
        args.push(arguments[1]);
        trap.proxied++;
        return new Proxy({}, {
          get: getter
        });
      };
      parameters = {};
      for (j = 0, len = list.length; j < len; j++) {
        parameter = list[j];
        parameters[parameter] = {
          configurable: true,
          get: getter.bind(null, null, parameter)
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
    trap = [];
    trap.primitived = 0;
    trap.proxied = 0;
    a = 0;
    cmd = null;
    get = function() {
      var args, cmda;
      if (this instanceof String) {
        cmda = this + "";
        [cmd, ...args] = cmda.split(" ");
        trap = [];
        trap.primitived = 0;
        trap.proxied = 0;
        trapArguments(trap, args.map(function(a) {
          return a.replace(/\-/, "");
        }));
      } else {
        clearTimeout(a);
        a = setTimeout(function() {
          /*
              b = trap.slice()

              b.argc = trap.primitived-1
              b.extarg = trap.proxied - trap.primitived

              t = b.slice().sort( (a,b) => (a.length < b.length) && 1 || -1 )
              j = 0

              while b.extarg--
                  bi = b.findIndex( (v) => v is t[j] )
                  b[bi] = "/" + b[bi]
                  j++

              while b.argc--
                  bi = b.findIndex( (v) => v is t[j] )
                  b[bi] = "-" + b[bi]
                  j++

              o = []
              for k in b

                  if  k.startsWith "/"
                      if !o.length
                          o.push k
                          continue

                      if  o[o.length-1].startsWith "-"
                          o.push k
                          continue

                      o[ o.length-1 ] =
                          (o[ o.length-1 ] + k).replace /\/\//g, "/"

                      continue

                  o.push k                    

              log cmd, "get:", o
              log cmd, "get:", trap
          */
          return window[cmd] = trap;
        }, 30);
      }
      if (arguments[1] === Symbol.toPrimitive) {
        return function() {
          trap.primitived++;
          return 1;
        };
      }
      if (arguments[1]) {
        trap.push(arguments[1]);
      }
      trap.proxied++;
      return new Proxy({}, {get});
    };
    self.trap = trap;
    return Object.defineProperties(window, {
      rm: {
        get: get.bind("rm -r -f"),
        set: async function(args) {
          var fdname, force, recursive;
          recursive = args.includes("r");
          force = args.includes("f");
          fdname = args.filter(function(a) {
            return !["r", "f"].includes(a);
          }).join(".");
          return (await rm(fdname, force, recursive));
        }
      },
      cd: {
        set: function() {
          return log("cd..");
        },
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
              return warn(/NOT_IMPLEMENTED_YET/);
            }
            return (await cd(args[0]));
          });
          return pxy;
        }
      },
      cat: {
        get: get.bind("cat"),
        set: async function(args) {
          return log((await cat(args.join("."))));
        }
      },
      ls: {
        get: get.bind("ls -l"),
        set: async function(args) {
          var _date, byteLength, dirCount, fileCount, iname, item, j, kb, kind, lastModifiedDate, len, lines, ref, size, type;
          lines = [];
          dirCount = 0;
          fileCount = 0;
          byteLength = 0;
          ref = (await ls());
          for (j = 0, len = ref.length; j < len; j++) {
            [iname, item] = ref[j];
            if ("file" === (kind = item.kind)) {
              ({size, type, lastModifiedDate} = (await read(item)));
              _date = lastModifiedDate.toDateString().split(" ").slice(1).slice(0, 2).join(" ") + " " + lastModifiedDate.toTimeString().substring(0, 5);
              byteLength += size;
              fileCount++;
            } else {
              [size, type] = [0, 0];
              _date = "".padEnd(16, " ");
              dirCount++;
            }
            if (kind === "directory") {
              size = "";
              kind = "dir";
              lines.push([kind, "\t", "\t", _date, " ", iname]);
              continue;
            }
            if (!size) {
              lines.push([kind, "\t", 0, "\t\t", _date, " ", iname]);
              continue;
            }
            lines.push([kind, "\t", size, "\t", _date, " ", iname]);
          }
          kb = (byteLength / 1e3).toFixed(1) * 1;
          console.group("path:", cwd);
          console.warn("total:", kb, "Kbytes");
          lines.reverse().forEach(function(l) {
            return console.log(...l);
          });
          return console.groupEnd(cwd);
        }
      }
    });
  })();
  init();
  return requestIdleCallback(function() {
    return log("state:", state(), "persisted:", state() >= STATE_PERSISTED_HANDLE, "status:", status());
  });
})();
