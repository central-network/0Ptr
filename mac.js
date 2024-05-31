var debug, delay, error, info, log, onbatteryevents, onkeyboardevents, onnetworkevents, onpointerevents, table, warn;

({log, warn, error, table, debug, info, delay} = console);

(onpointerevents = function() {
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

(onkeyboardevents = function() {
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

(onbatteryevents = function() {
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

(onnetworkevents = function() {
  return self.onclick = async function() {
    var dev;
    //await navigator.bluetooth.requestDevice({acceptAllDevices: 1})
    log(1, dev = (await navigator.bluetooth.requestDevice({
      filters: [
        {
          name: "Data-9 iMac"
        }
      ]
    })));
    try {
      log((await dev.gatt.getPrimaryService()));
    } catch (error1) {}
    try {
      log((await dev.gatt.getPrimaryServices()));
    } catch (error1) {}
    try {
      return log((await dev.gatt.connect()));
    } catch (error1) {}
  };
})();
