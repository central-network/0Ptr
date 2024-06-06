(function() {
  var Array, ArrayBuffer, Atomics, BigInt, BigInt64Array, BigUint64Array, Boolean, CustomEvent, DataView, Event, FileSystemDirectoryHandle, FileSystemFileHandle, FileSystemHandle, Float32Array, Float64Array, Function, Int16Array, Int32Array, Int8Array, JSON, Math, Number, Object, Proxy, Reflect, RegExp, STATE_INIT, STATE_PERSISTED_HANDLE, STATE_ROOT_HANDLE, STATE_UNPERSISTED_HANDLE, STATUS_IDLE, STATUS_READING, STATUS_WRITING, String, Symbol, Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, __proto__, addEventListener, apply, askp, assign, battery, bind, call, cat, cd, clearInterval, clearTimeout, console, counters, create, currentDir, currentFile, dataArray, dataView, debug, defineProperties, defineProperty, delay, device, dir, dispatchEvent, emit, error, events, fs, group, groupEnd, handles, hasOwn, info, init, issame, keyboard, keys, lendian, log, ls, mkdir, mouse, mv, mv_d2d, mv_f2d, mv_f2f, navigator, netlink, onclick, parent, parseFloat, parseInt, pick, queryp, queueMicrotask, quota, read, readed, remove, requestAnimationFrame, requestIdleCallback, resolv, rm, rmdir, root, setInterval, setTimeout, setcwd, showDirectoryPicker, showOpenFilePicker, showSaveFilePicker, state, status, table, touch, usage, values, warn, write, written;
  ({Reflect, Object, Float32Array, Int32Array, DataView, Uint32Array, ArrayBuffer, Uint16Array, Uint32Array, dispatchEvent, addEventListener, Event, CustomEvent, JSON, clearTimeout, setInterval, clearInterval, setTimeout, queueMicrotask, requestIdleCallback, requestAnimationFrame, navigator, Proxy, Function, __proto__, FileSystemDirectoryHandle, Symbol, console, showDirectoryPicker, showOpenFilePicker, showSaveFilePicker, RegExp, Array, Number, String, Boolean, Math, Uint8ClampedArray, Int8Array, Uint8Array, Int16Array, Float64Array, BigInt64Array, BigUint64Array, Atomics, BigInt, FileSystemFileHandle, FileSystemHandle, parseInt, parseFloat} = window);
  ({log, warn, error, table, debug, info, delay, group, groupEnd} = console);
  ({values, keys, assign, defineProperty, defineProperties, hasOwn} = Object);
  ({call, apply, bind} = Object.getPrototypeOf(() => {
    return {};
  }));
  Object.defineProperties(__proto__, {
    navigator: {
      value: navigator
    }
  });
  window.on2error = window.on2unhandledrejection = function() {
    //document.body.innerHTML += JSON.stringify arguments
    //error arguments...
    return true;
  };
  Object.defineProperties(console, {
    fsIndex: {
      value: new Array
    },
    tempkeys: {
      value: new Array
    },
    emit: {
      value: emit = function(type, detail) {
        window.dispatchEvent(new CustomEvent(type, {detail}));
        return detail;
      }
    }
  });
  Object.defineProperties(console, {
    clearTempKeys: {
      value: function() {
        var key, results;
        results = [];
        while (key = this.tempkeys.splice(-1).at(-1)) {
          results.push(Reflect.deleteProperty(window, key));
        }
        return results;
      }
    },
    addTempKey: {
      value: function(key) {
        return this.tempkeys[this.tempkeys.length] = key;
      }
    },
    keyProxy: {
      value: function(word, _chain = [], level = 0) {
        return new Proxy(Function.prototype, {
          apply: function(f, key, args) {
            _chain.push({
              as: "function",
              args: args
            });
            return console.keyProxy(word, _chain, level + 2);
          },
          get: function(f, key) {
            if (key === Symbol.toPrimitive) {
              return function() {
                return 1;
              };
            }
            _chain.push({
              as: "keyword",
              key,
              level
            });
            return console.keyProxy(word, _chain, level + 1);
          }
        });
      }
    },
    deployTempProxy: {
      value: function(args = [], chain = []) {
        var a, i, j, l, len, len1, len2, m, ref, w;
        this.clearTempKeys();
        for (i = j = 0, len = args.length; j < len; i = ++j) {
          a = args[i];
          while (i--) {
            if (a.length - 1) {
              continue;
            }
            args.push(a + args[i]);
            args.push(args[i] + a);
          }
        }
        for (l = 0, len1 = args.length; l < len1; l++) {
          w = args[l];
          if (!Object.hasOwn(window, w)) {
            Object.defineProperty(window, this.addTempKey(w), {
              configurable: true,
              get: (function(key) {
                return function() {
                  chain.push({
                    as: "argument",
                    key
                  });
                  return console.keyProxy(key, chain);
                };
              })(w)
            });
          }
        }
        ref = console.fsIndex;
        for (m = 0, len2 = ref.length; m < len2; m++) {
          i = ref[m];
          if (!Object.hasOwn(window, (w = i.global))) {
            Object.defineProperty(window, this.addTempKey(w), {
              configurable: true,
              get: (function(key) {
                return function() {
                  var subchain;
                  chain.push({
                    as: "fshandle",
                    key,
                    level: 1,
                    subchain: (subchain = [])
                  });
                  return console.keyProxy(key, subchain);
                };
              })(w)
            });
          }
        }
        return chain;
      }
    },
    updatePathIndex: {
      value: async function(dHandle, level = 0) {
        var iHandle, j, len, path, ref;
        path = (await resolv(dHandle));
        if (!this.fsIndex.find(function(i) {
          return i.path === path;
        })) {
          this.fsIndex.push(dHandle);
          dHandle.path = path;
          dHandle.level = level;
          dHandle.global = dHandle.name.split(/\.|(\w+)/gui).filter(Boolean).at(0);
        }
        ref = (await ls(dHandle));
        for (j = 0, len = ref.length; j < len; j++) {
          iHandle = ref[j];
          path = (await resolv(iHandle));
          if (!this.fsIndex.find(function(i) {
            return i.path === path;
          })) {
            this.fsIndex.push(iHandle);
            iHandle.path = path;
            iHandle.global = iHandle.name.split(/\.|(\w+)/gui).filter(Boolean).at(0);
          }
          if (iHandle.kind === "directory") {
            await this.updatePathIndex(iHandle, level + 1);
          }
        }
        return dHandle;
      }
    },
    dispatchCommand: {
      value: function(handler, args = []) {
        setTimeout(() => {
          var arg, dirchain, fshandle, i, j, l, len, len1, len2, m, parent, part, path, ref, ref1, s, sequence, subchain;
          console.clearTempKeys();
          sequence = [];
          dirchain = [];
          subchain = [];
          ref = args.slice();
          for (j = 0, len = ref.length; j < len; j++) {
            arg = ref[j];
            if (arg.as.match(/command/)) {
              continue;
            }
            if (!arg.as.match(/fshandle/)) {
              i = 0;
              if (dirchain.length) {
                i = sequence.push("/" + dirchain.join("/")) - 1;
              }
              dirchain = [];
              if (subchain.length) {
                sequence[i] += "." + subchain.join(".");
              }
              subchain = [];
              if (i) {
                sequence[i] = {
                  path: sequence[i]
                };
              }
            }
            if (arg.as.match(/argument/)) {
              sequence.push("-" + arg.key);
              continue;
            }
            if (arg.as.match(/function/)) {
              i = 0;
              if (dirchain.length) {
                i = sequence.push("/" + dirchain.join("/")) - 1;
              }
              dirchain = [];
              if (subchain.length) {
                sequence[i] += "." + subchain.join(".");
              }
              subchain = [];
              if (i) {
                sequence[i] = {
                  path: sequence[i]
                };
              }
              sequence.push(arg.args.at());
              continue;
            }
            if (arg.as.match(/fshandle/)) {
              if (subchain.length) {
                i = 0;
                if (dirchain.length) {
                  i = sequence.push("/" + dirchain.join("/")) - 1;
                }
                dirchain = [];
                if (subchain.length) {
                  sequence[i] += "." + subchain.join(".");
                }
                subchain = [];
                if (i) {
                  sequence[i] = {
                    path: sequence[i]
                  };
                }
              }
              dirchain.push(arg.key);
              ref1 = arg.subchain;
              for (l = 0, len1 = ref1.length; l < len1; l++) {
                s = ref1[l];
                if (s.as.match(/keyword/)) {
                  subchain.push(s.key);
                }
                if (s.as.match(/function/)) {
                  i = 0;
                  if (dirchain.length) {
                    i = sequence.push("/" + dirchain.join("/")) - 1;
                  }
                  dirchain = [];
                  if (subchain.length) {
                    sequence[i] += "." + subchain.join(".");
                  }
                  subchain = [];
                  if (i) {
                    sequence[i] = {
                      path: sequence[i]
                    };
                  }
                  sequence.push(s.args.at());
                }
              }
            }
          }
          i = 0;
          if (dirchain.length) {
            i = sequence.push("/" + dirchain.join("/")) - 1;
          }
          dirchain = [];
          if (subchain.length) {
            sequence[i] += "." + subchain.join(".");
          }
          subchain = [];
          if (i) {
            sequence[i] = {
              path: sequence[i]
            };
          }
          for (i = m = 0, len2 = sequence.length; m < len2; i = ++m) {
            part = sequence[i];
            if (!(path = part.path)) {
              continue;
            }
            if (fshandle = console.fsIndex.find(function(h) {
              return h.path === path;
            })) {
              sequence[i] = fshandle;
            }
            parent = path;
            while (parent = parent.split("/").slice(0, -1).join("/")) {
              if (fshandle = console.fsIndex.find(function(h) {
                return h.path === parent;
              })) {
                sequence[i].parent = fshandle;
                break;
              }
            }
            sequence[i] = sequence[i].path;
          }
          return handler(values(sequence));
        }, 40);
        return args;
      }
    },
    registerCommand: {
      value: function(cmd, handler, args = []) {
        if (typeof window[cmd] !== "undefined") {
          throw [
            {
              COMMAND_NAME_ALREADY_GLOBAL: cmd
            }
          ];
        }
        Object.defineProperty(__proto__, cmd, {
          get: function() {
            var chain;
            return console.dispatchCommand(handler, console.deployTempProxy(args, chain = [
              {
                as: "command",
                key: cmd
              }
            ]));
          }
        });
        return console.emit("consolecommandregister", cmd);
      }
    }
  });
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
    var activeKey, altKey, counters, ctrlKey, dataView, device, eventType, iEventCount, iKeyDownCount, iKeyUpCount, keyArray, lastChar, lastCode, lastEvent, lendian, metaKey, offset, offsetAltKey, offsetCharCode, offsetCtrlKey, offsetLastEvent, offsetLocation, offsetMetaKey, offsetRepeat, offsetShiftKey, shiftKey;
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
  mkdir = async function(dirName, target = currentDir) {
    var dir;
    if (dir = (await target.getDirectoryHandle(dirName, {
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
  onclick = async function() {
    var handle;
    log(handle = (await pick("dir")));
    log((await ls(handle)));
    if (handle instanceof FileSystemHandle) {
      return (await mv(handle, currentDir));
    }
  };
  init();
  
  // update console's fsindex
  window.addEventListener("storagcwdupdate", function({
      detail: handle
    }) {
    var args, cmd, handler;
    console.updatePathIndex(handle);
    cmd = "ls";
    args = ["l", "a", "h"];
    handler = function(sequence) {
      return log("command executed ls:", sequence);
    };
    console.registerCommand(cmd, handler, args);
    cmd = "mount";
    args = ["fs", "root"];
    handler = function(sequence) {
      return log("command executed fs:", sequence);
    };
    console.registerCommand(cmd, handler, args);
    cmd = "device";
    args = ["add"];
    handler = function(sequence) {
      return log(["device"], " <-- ", sequence);
    };
    return console.registerCommand(cmd, handler, args);
  });
  // cleaning window object
  window.addEventListener("storageroothandle", function({
      detail: fsroot
    }) {
    var clean, d, k, o, p, r;
    console.fsroot = fsroot;
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
      if (/location|window|self|console|navigator/.test(a.constructor.name || a.name)) {
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
