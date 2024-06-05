(function() {
  var Array, ArrayBuffer, Atomics, BigInt, BigInt64Array, BigUint64Array, Boolean, CustomEvent, DataView, Event, FileSystemDirectoryHandle, FileSystemFileHandle, FileSystemHandle, Float32Array, Float64Array, Function, Int16Array, Int32Array, Int8Array, JSON, Math, Number, Object, Proxy, Reflect, RegExp, STATE_INIT, STATE_PERSISTED_HANDLE, STATE_ROOT_HANDLE, STATE_UNPERSISTED_HANDLE, STATUS_IDLE, STATUS_READING, STATUS_WRITING, String, Symbol, Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, __proto__, addEventListener, askp, battery, cat, cd, clearTimeout, console, counters, create, currentDir, currentFile, dataArray, dataView, debug, delay, device, dir, dispatchEvent, emit, error, events, fs, group, groupEnd, handles, info, init, issame, keyboard, lendian, log, ls, mkdir, mouse, mv, mv_d2d, mv_f2d, mv_f2f, navigator, netlink, parent, parseFloat, parseInt, pick, queryp, quota, read, readed, remove, requestAnimationFrame, requestIdleCallback, resolv, rm, rmdir, root, setTimeout, setcwd, shell, showDirectoryPicker, showOpenFilePicker, showSaveFilePicker, state, status, table, terminalify, touch, usage, warn, write, written;
  ({Reflect, Object, Float32Array, Int32Array, DataView, Uint32Array, ArrayBuffer, Uint16Array, Uint32Array, dispatchEvent, addEventListener, Event, CustomEvent, JSON, setTimeout, clearTimeout, requestIdleCallback, requestAnimationFrame, navigator, Proxy, Function, __proto__, FileSystemDirectoryHandle, Symbol, console, showDirectoryPicker, showOpenFilePicker, showSaveFilePicker, RegExp, Array, Number, String, Boolean, Math, Uint8ClampedArray, Int8Array, Uint8Array, Int16Array, Float64Array, BigInt64Array, BigUint64Array, Atomics, BigInt, FileSystemFileHandle, FileSystemHandle, parseInt, parseFloat} = window);
  ({log, warn, error, table, debug, info, delay, group, groupEnd} = console);
  window.on2error = window.on2unhandledrejection = function() {
    //document.body.innerHTML += JSON.stringify arguments
    //error arguments...
    return true;
  };
  shell = {
    emit: emit = function(type, detail) {
      window.dispatchEvent(new CustomEvent(type, {detail}));
      return detail;
    },
    fsIndex: [],
    deployTempProxy: function(args = [], chain = []) {
      var a, combargs, crossProxy, i, j, len, len1, len2, m, n, ref, tempkeys, w;
      crossProxy = function(word, _chain = [], level = 0) {
        return new Proxy(Function.prototype, {
          apply: function(f, key, args) {
            _chain.push({
              as: "function",
              args: args
            });
            return crossProxy(word, _chain, level + 2);
          },
          get: function(f, key) {
            if (key === Symbol.toPrimitive) {
              return function() {
                return 1;
              };
            }
            _chain.push({
              as: "keyword"
            }, key, level);
            return crossProxy(word, _chain, level + 1);
          }
        });
      };
      tempkeys = [];
      combargs = [...args];
      for (i = j = 0, len = args.length; j < len; i = ++j) {
        a = args[i];
        while (i--) {
          combargs.push(a + args[i]);
          combargs.push(args[i] + a);
        }
      }
      for (m = 0, len1 = combargs.length; m < len1; m++) {
        w = combargs[m];
        if (!Object.hasOwn(window, w)) {
          Object.defineProperty(window, (tempkeys[tempkeys.length] = w), {
            configurable: true,
            get: (function(word) {
              return function() {
                chain[chain.length] = {
                  as: "argument",
                  key: word
                };
                return crossProxy(word, chain);
              };
            })(w)
          });
        }
      }
      ref = shell.fsIndex;
      for (n = 0, len2 = ref.length; n < len2; n++) {
        i = ref[n];
        if (!Object.hasOwn(window, (w = i.global))) {
          Object.defineProperty(window, (tempkeys[tempkeys.length] = w), {
            configurable: true,
            get: (function(word) {
              return function() {
                var subchain;
                chain[chain.length] = {
                  as: "fshandle",
                  key: word,
                  level: 1,
                  subchain: subchain = []
                };
                return crossProxy(word, subchain);
              };
            })(w)
          });
        }
      }
      requestIdleCallback(function() {
        return queueMicrotask(function() {
          return requestAnimationFrame(function() {
            return tempkeys.map(function(key) {
              return Reflect.deleteProperty(window, key);
            });
          });
        });
      });
      return chain;
    },
    updatePathIndex: async function(dHandle, level = 0) {
      var iHandle, j, len, ref;
      dHandle.path = (await resolv(dHandle));
      dHandle.level = level;
      dHandle.global = dHandle.name.split(/\.|(\w+)/gui).filter(Boolean).at(0);
      if (!this.fsIndex.find(function(i) {
        return i.global === dHandle.global;
      })) {
        if (dHandle.global && !Object.hasOwn(window, dHandle.global)) {
          if (dHandle.name.length > 1) {
            this.fsIndex.push(dHandle);
          }
        }
      }
      ref = (await ls(dHandle));
      for (j = 0, len = ref.length; j < len; j++) {
        iHandle = ref[j];
        iHandle.path = (await resolv(iHandle));
        iHandle.global = iHandle.name.split(/\.|(\w+)/gui).filter(Boolean).at(0);
        if (!this.fsIndex.find(function(i) {
          return i.global === iHandle.global;
        })) {
          if (iHandle.global && !Object.hasOwn(window, iHandle.global)) {
            if (iHandle.name.length > 1) {
              this.fsIndex.push(iHandle);
            }
          }
        }
        if (iHandle.kind === "directory") {
          await this.updatePathIndex(iHandle, level + 1);
        }
      }
      return this.fsIndex;
    },
    handleArguments: function(handler, args = []) {
      setTimeout(() => {
        var arg, j, len, results;
        results = [];
        for (j = 0, len = args.length; j < len; j++) {
          arg = args[j];
          results.push(warn(arg));
        }
        return results;
      }, 100);
      return args;
    },
    registerCommand: function(cmd, handler, args = []) {
      if (Object.hasOwn(window, cmd)) {
        throw [
          {
            COMMAND_NAME_ALREADY_GLOBAL: cmd
          }
        ];
      }
      Object.defineProperty(__proto__, cmd, {
        get: function() {
          var chain;
          return shell.handleArguments(handler, shell.deployTempProxy(args, chain = [
            {
              as: "command",
              key: cmd
            }
          ]));
        }
      });
      return emit("shellcommandregister", cmd);
    }
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
  (fs = function() {})();
  device = new ArrayBuffer(4096 * 256 * 128); //128mb önbellek
  counters = new Int32Array(device, 0, 10);
  dataArray = new Uint8Array(device, counters.byteLength);
  dataView = new DataView(device);
  lendian = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  handles = [, ];
  root = null;
  currentDir = null;
  currentFile = null;
  quota = function() {
    return Number(dataView.getBigUint64(12, lendian));
  };
  usage = dataView.getUint32.bind(dataView, 20, lendian);
  written = dataView.getUint32.bind(dataView, 24, lendian);
  readed = dataView.getUint32.bind(dataView, 28, lendian);
  create = dataView.getInt32.bind(dataView, 32, lendian);
  remove = dataView.getInt32.bind(dataView, 36, lendian);
  state = dataView.getUint8.bind(dataView, 40);
  status = dataView.getUint8.bind(dataView, 41);
  STATE_INIT = 0;
  STATE_ROOT_HANDLE = 1;
  STATE_UNPERSISTED_HANDLE = 2;
  STATE_PERSISTED_HANDLE = 3;
  STATUS_IDLE = 0;
  STATUS_READING = 1;
  STATUS_WRITING = 2;
  events = 'onstorageroothandle onstoragepersisted onstoragecreatedirectory onstoragecreatefile onstorageremovefile onstoragcwdupdate'.split(/\s+|\n/g);
  init = function() {
    dataView.setUint8(40, STATE_INIT);
    try {
      return navigator.storage.getDirectory().then(function(handle) {
        if (handle instanceof FileSystemDirectoryHandle) {
          handles.push(root = handle);
          return emit("storageroothandle", root);
        }
      });
    } catch (error1) {}
  };
  cd = async function(dirName, handle = currentDir) {
    return (await setcwd(currentDir = (await handle.getDirectoryHandle(dirName))));
  };
  setcwd = async function(handle = currentDir) {
    Object.defineProperty(__proto__, "cwd", {
      writable: true,
      configurable: true,
      value: (await resolv(handle))
    });
    emit("storagcwdupdate", handle);
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
    if (!(item = ((await ls(handle))).find(function(i) {
      return i.name === anyForD;
    }))) {
      return error(`File or folder (${anyForD}) is not in: ${cwd}`);
    }
    if (item instanceof FileSystemDirectoryHandle) {
      if (!force) {
        if (((await ls(item))).length) {
          return error("Folder is not empty");
        }
      }
    }
    await handle.removeEntry(anyForD, {recursive});
    return emit("storageremovefile", {anyForD});
  };
  ls = async function(handle) {
    var e, it, item, items, iterator;
    handle || (handle = currentDir);
    if (typeof handle === "string") {
      it = (await currentDir.values());
      while (e = ((await it.next())).value) {
        if (e.name !== handle) {
          continue;
        }
        handle = e;
        break;
      }
    }
    if (!handle instanceof FileSystemDirectoryHandle) {
      return error("This is not a directory: ", handle);
    }
    iterator = (await handle.values());
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
  dir = async function(handle) {
    var e, it, item, items, iterator;
    handle || (handle = currentDir);
    if (typeof handle === "string") {
      it = (await currentDir.values());
      while (e = ((await it.next())).value) {
        if (e.name !== handle) {
          continue;
        }
        handle = e;
        break;
      }
    }
    if (!handle instanceof FileSystemDirectoryHandle) {
      return error("This is not a directory: ", handle);
    }
    iterator = (await handle.keys());
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
  resolv = async function(handle) {
    var e, it;
    handle || (handle = currentDir);
    if (typeof handle === "string") {
      it = (await currentDir.values());
      while (e = ((await it.next())).value) {
        if (e.name !== handle) {
          continue;
        }
        handle = e;
        break;
      }
    }
    return "/" + ((await root.resolve(handle))).join("/");
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
    var fhandle, item, j, len, ref;
    if (file instanceof FileSystemFileHandle) {
      ({
        name: file
      } = (fhandle = file));
    } else if (Array.isArray(file)) {
      [file, fhandle] = file;
    } else if ("string" === typeof file) {
      ref = (await ls(handle));
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        if (item.name === file) {
          fhandle = item;
          break;
        }
      }
    }
    if (!fhandle || !fhandle instanceof FileSystemFileHandle) {
      return {
        text: function() {
          return error("No such a file:", [file]);
        }
      };
    }
    return (await fhandle.getFile());
  };
  cat = async function(file, handle = currentDir) {
    var data;
    data = (await read(file, handle));
    dataView.setUint32(28, readed() + data.size, lendian);
    return (await data.text());
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
      await writableStream.close();
      return dataView.setUint32(24, written() + data.size, lendian);
    } catch (error1) {
      e = error1;
      return error(e, ...arguments);
    } finally {
      return writeableFHandle;
    }
  };
  pick = async function(type = "directory") {
    if (/dir/.test(type)) {
      try {
        return (await showDirectoryPicker());
      } catch (error1) {}
    } else if (/file/.test(type)) {
      try {
        return (await showOpenFilePicker());
      } catch (error1) {}
    } else if (/savefile/.test(type)) {
      try {
        return (await showSaveFilePicker());
      } catch (error1) {}
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
      fdHandle = ref[j];
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
  window.addEventListener("storagecreatedirectory", function({detail}) {
    dataView.setInt32(32, create() + 1, lendian);
    return log("onstoragecreatedirectory:", detail);
  });
  window.addEventListener("storageremovedirectory", function({detail}) {
    dataView.setInt32(36, remove() + 1, lendian);
    return log("onstorageremovedirectory:", detail);
  });
  window.addEventListener("storagecreatefile", function({detail}) {
    dataView.setInt32(32, create() + 1, lendian);
    return log("onstoragecreatefile:", detail);
  });
  window.addEventListener("storageremovefile", function({detail}) {
    dataView.setInt32(36, remove() + 1, lendian);
    return log("onstorageremovefile:", detail);
  });
  window.addEventListener("storagepersist", function() {
    return dataView.setUint8(40, STATE_PERSISTED_HANDLE);
  });
  window.addEventListener("storageroothandle", async function() {
    dataView.setUint8(40, STATE_ROOT_HANDLE);
    await setcwd(currentDir = root);
    try {
      navigator.storage.persisted().then(function(persisted) {
        if (!persisted) {
          dataView.setUint8(40, STATE_UNPERSISTED_HANDLE);
          return navigator.storage.persist().then(function(persisted) {
            if (persisted) {
              return window.dispatchEvent(new Event("storagepersist"));
            }
          });
        } else {
          return emit("storagepersist", root);
        }
      });
    } catch (error1) {}
    try {
      return navigator.storage.estimate().then(function(estimate) {
        dataView.setBigUint64(12, BigInt(estimate.quota), lendian);
        return dataView.setUint32(20, estimate.usage, lendian);
      });
    } catch (error1) {}
  });
  self.onclick = async function() {
    var handle;
    log(handle = (await pick("dir")));
    log((await ls(handle)));
    if (handle instanceof FileSystemHandle) {
      return (await mv(handle, currentDir));
    }
  };
  terminalify = function() {
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
      return new Proxy({
        dhcp: 1
      }, {get});
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
          var _date, byteLength, dirCount, fileCount, item, j, kB, lastModifiedDate, len, lines, ref, size, type;
          warn(3);
          dir = args.filter(function(a) {
            return !["l"].includes(a);
          }).join("");
          lines = [];
          dirCount = 0;
          fileCount = 0;
          byteLength = 0;
          ref = (await ls(dir));
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            if ("file" === item.kind) {
              ({size, type, lastModifiedDate} = (await read(item)));
              _date = lastModifiedDate.toDateString().split(" ").slice(1).slice(0, 2).join(" ") + " " + lastModifiedDate.toTimeString().substring(0, 5);
              byteLength += size;
              fileCount++;
            } else {
              [size, type] = [0, 0];
              _date = "".padEnd(16, " ");
              dirCount++;
            }
            if ("directory" === item.kind) {
              lines.push(["dir", "\t", "\t", _date, " ", item.name]);
              continue;
            }
            if (!size) {
              lines.push(["file", "\t", 0, "\t\t", _date, " ", item.name]);
            } else {
              lines.push(["file", "\t", size, "\t", _date, " ", item.name]);
            }
          }
          kB = (byteLength / 1e3).toFixed(1) * 1;
          console.group("path:", [(await resolv(dir))]);
          console.warn("total:", kB, "kBytes");
          lines.reverse().forEach(function(l) {
            return console.log(...l);
          });
          return console.groupEnd(cwd);
        }
      },
      mv: {
        get: function() {
          var indeks, isim, istenenler, j, len, len1, level0, m, ref, tanim;
          istenenler = [];
          level0 = [];
          ref = self.indexler;
          for (j = 0, len = ref.length; j < len; j++) {
            indeks = ref[j];
            isim = indeks.split(/\/|\./, 2)[1];
            if (!level0.includes(isim)) {
              level0.push(isim);
            }
          }
          for (m = 0, len1 = level0.length; m < len1; m++) {
            tanim = level0[m];
            Object.defineProperty(window, tanim, (function(isim) {
              return {
                configurable: true,
                get: function() {
                  var len2, level1, n, tanim1;
                  istenenler.push(isim);
                  log("istendi:", isim, 0);
                  level1 = [];
                  self.indexler.filter(function(i) {
                    return i.startsWith(`/${isim}`) && (i !== `/${isim}`);
                  }).map(function(i) {
                    return i.substring(`/${isim}`.length);
                  }).forEach(function(i) {
                    var isim1;
                    isim1 = i.split(/\/|\./, 2)[1];
                    if (!level1.includes(isim1)) {
                      return level1.push(isim1);
                    }
                  });
                  for (n = 0, len2 = level1.length; n < len2; n++) {
                    tanim1 = level1[n];
                    Object.defineProperty(window, tanim1, (function(isim1) {
                      return {
                        configurable: true,
                        get: function() {
                          var len3, level2, q, tanim2;
                          istenenler.push(isim1);
                          log("istendi:".padStart(10 + istenenler.length * 2, " "), isim1, 1);
                          //? -----> level 2
                          level2 = [];
                          self.indexler.filter(function(i) {
                            return i.startsWith(`/${isim}`) && i.includes(isim1);
                          }).map(function(i) {
                            return i.substring(`/${isim + '/' + isim1}`.length);
                          }).forEach(function(i) {
                            var isim2;
                            isim2 = i.split(/\/|\./, 2)[1];
                            if (!level2.includes(isim2)) {
                              if (isim2) {
                                return level2.push(isim2);
                              }
                            }
                          });
                          level2;
                          for (q = 0, len3 = level2.length; q < len3; q++) {
                            tanim2 = level2[q];
                            Object.defineProperty(window, tanim2, (function(isim2) {
                              return {
                                configurable: true,
                                get: function() {
                                  istenenler.push(isim2);
                                  log("istendi:".padStart(10 + istenenler.length * 2, " "), isim2, 2);
                                  return new Proxy({}, {
                                    get: function() {
                                      if (typeof arguments[1] !== "symbol") {
                                        istenenler.push(arguments[1]);
                                        warn("  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]);
                                      }
                                      return function() {};
                                    }
                                  });
                                }
                              };
                            })(tanim2));
                          }
                          
                          //? <----- level 2
                          return new Proxy({}, {
                            get: function() {
                              if (typeof arguments[1] !== "symbol") {
                                istenenler.push(arguments[1]);
                                warn("  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]);
                              }
                              return function() {};
                            }
                          });
                        }
                      };
                    })(tanim1));
                  }
                  return new Proxy({}, {
                    get: function() {
                      if (typeof arguments[1] !== "symbol") {
                        istenenler.push(arguments[1]);
                        warn("  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]);
                      }
                      return function() {};
                    }
                  });
                }
              };
            })(tanim));
          }
          return new Proxy({}, {
            get: function() {
              if (typeof arguments[1] !== "symbol") {
                istenenler.push(arguments[1]);
                warn("  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]);
              }
              return function() {};
            }
          });
        }
      }
    });
  };
  init();
  
  // update shell's fsindex
  window.addEventListener("storagcwdupdate", function({
      detail: handle
    }) {
    var args, cmd, handler;
    shell.updatePathIndex(handle);
    cmd = "ls";
    args = ["l", "a", "h"];
    handler = function(sequence) {
      return log("command executed:", sequence);
    };
    return shell.registerCommand(cmd, handler, args);
  });
  
  // cleaning window object
  window.addEventListener("storageroothandle", function({
      detail: fsroot
    }) {
    var clean, d, k, o, p, r;
    shell.fsroot = fsroot;
    return 1;
    setTimeout(async() => {
      return (await cd("lib"));
    }, 2000);
    d = Object.getOwnPropertyDescriptors;
    p = Object.getPrototypeOf;
    k = Object.keys;
    o = Object;
    r = Reflect;
    clean = function(a) {
      var _, _k, ref, ref1, ref2, ref3, ref4, results, v;
      if (!a) {
        return;
      }
      if (/location|window|self|console/.test(a.constructor.name || a.name)) {
        return;
      }
      try {
        ref = d(_ = a.__proto__);
        for (_k in ref) {
          v = ref[_k];
          r.deleteProperty(_, _k);
        }
      } catch (error1) {}
      try {
        ref1 = d(_ = p(a.constructor));
        for (_k in ref1) {
          v = ref1[_k];
          r.deleteProperty(_, _k);
        }
      } catch (error1) {}
      try {
        ref2 = d(_ = a.constructor);
        for (_k in ref2) {
          v = ref2[_k];
          r.deleteProperty(_, _k);
        }
      } catch (error1) {}
      try {
        ref3 = d(_ = p(a));
        for (_k in ref3) {
          v = ref3[_k];
          r.deleteProperty(_, _k);
        }
      } catch (error1) {}
      try {
        ref4 = d(_ = a);
        results = [];
        for (_k in ref4) {
          v = ref4[_k];
          results.push(r.deleteProperty(_, _k));
        }
        return results;
      } catch (error1) {}
    };
    if (window.chrome != null) {
      Object.defineProperty(window, "chrome", {
        value: "tru 💚 th"
      });
      Object.defineProperty(__proto__, "values", {
        value: function() {
          return [];
        }
      });
      Object.defineProperty(__proto__, "debug", {
        value: function() {
          return [];
        }
      });
      Object.defineProperty(__proto__, "undebug", {
        value: function() {
          return [];
        }
      });
      Object.defineProperty(__proto__, "queryObjects", {
        value: function() {
          return [];
        }
      });
      if (typeof unmonitorEvents !== "undefined" && unmonitorEvents !== null) {
        unmonitorEvents(window);
      }
    }
    try {
      return clean(window);
    } catch (error1) {}
  });
  return (self.dbg = function() {
    return function() {
      return requestIdleCallback(function() {
        return requestAnimationFrame(function() {
          return groupEnd(group("fs:", "state:", state(), "persisted:", state() >= STATE_PERSISTED_HANDLE, "status:", status(), "quota:", quota(), "usage:", usage(), "written:", written(), "readed:", readed()));
        });
      });
    };
  })();
})();
