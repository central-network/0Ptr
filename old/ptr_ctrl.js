var GAMEPAD_KEYS;

import {
  Pointer,
  ByteOffset,
  KeyBase
} from "./ptr.js";

GAMEPAD_KEYS = new KeyBase();

GAMEPAD_KEYS.generate({
  STANDART_MAPPING: "standard",
  ACTUATOR_DUAL_RUMBLE: "dual-rumble"
});

export var GamePadButton = (function() {
  class GamePadButton extends ByteOffset {
    set() {}

  };

  GamePadButton.prototype.OFFSET_INDEX = GamePadButton.malloc(Uint8Array);

  GamePadButton.prototype.OFFSET_PRESSED = GamePadButton.malloc(Uint8Array);

  GamePadButton.prototype.OFFSET_TOUCHED = GamePadButton.malloc(Uint8Array);

  GamePadButton.prototype.OFFSET_VALUE = GamePadButton.malloc(Float32Array);

  return GamePadButton;

}).call(this);

export var GamePad = (function() {
  class GamePad extends ByteOffset {
    handle({
        gamepad: data
      }) {
      this.connected = data.connected;
      this.actuactor = data.vibrationActuator.type;
      this.axes.set(data.axes);
      return console.log(this);
    }

    init() {
      this.owner = arguments[0];
      this.controller = arguments[1];
      return this.byteOffset = arguments[2];
    }

  };

  GamePad.prototype.OFFSET_CONNECTED = GamePad.malloc(Uint8Array);

  GamePad.prototype.OFFSET_INDEX = GamePad.malloc(Uint8Array);

  GamePad.prototype.OFFSET_BYTEOFSET = GamePad.malloc(Uint32Array);

  GamePad.prototype.OFFSET_CONTROLLER = GamePad.malloc(Uint32Array);

  GamePad.prototype.OFFSET_OWNER = GamePad.malloc(Uint32Array);

  GamePad.prototype.OFFSET_MAPPING = GamePad.malloc(Uint32Array);

  GamePad.prototype.OFFSET_ACTUATOR = GamePad.malloc(Uint16Array);

  GamePad.prototype.OFFSET_AXES = GamePad.malloc(Float32Array, 4);

  GamePad.prototype.OFFSET_EFFECT = GamePad.malloc(Uint32Array);

  GamePad.prototype.OFFSET_RESET = GamePad.malloc(Uint32Array);

  GamePad.prototype.OFFSET_ID = GamePad.malloc(Uint8Array, 64);

  GamePad.prototype.OFFSET_BUTTONS = GamePad.malloc(Float32Array, 20);

  Object.defineProperties(GamePad.prototype, {
    owner: {
      get: function() {
        return new Pointer(this.loadUint32(this.OFFSET_OWNER));
      },
      set: function() {
        return this.storeUint32(this.OFFSET_OWNER, arguments[0]);
      }
    },
    controller: {
      get: function() {
        return this.owner.controller;
      },
      set: function() {
        return this.storeUint32(this.OFFSET_CONTROLLER, arguments[0]);
      }
    },
    connected: {
      get: function() {
        return this.loadUint8(this.OFFSET_CONNECTED);
      },
      set: function() {
        return this.storeUint8(this.OFFSET_CONNECTED, arguments[0]);
      }
    },
    axes: {
      get: function() {
        return new Float32Array(this.buffer, this.offset(this.OFFSET_AXES), 4);
      },
      set: function() {
        return this.axes.set(arguments[0]);
      }
    },
    actuactor: {
      get: function() {
        return this.keyUint16(this.OFFSET_ACTUATOR, GAMEPAD_KEYS);
      },
      set: function() {
        return this.storeUint16(this.OFFSET_ACTUATOR, GAMEPAD_KEYS[arguments[0]]);
      }
    },
    byteOffset: {
      get: function() {
        return this.loadUint32(this.OFFSET_BYTEOFSET);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_BYTEOFSET, arguments[0]);
      }
    }
  });

  return GamePad;

}).call(this);

export var Controller = (function() {
  class Controller extends ByteOffset {
    init() {
      return this.owner = arguments[0];
    }

  };

  Controller.byteLength = 4 * 256;

  Controller.prototype.OFFSET_OWNER = Controller.malloc(Uint32Array);

  Controller.prototype.OFFSET_BYTEOFSET = Controller.malloc(Uint32Array);

  Controller.prototype.OFFSET_GAMEPAD = Controller.malloc(Uint32Array, 64);

  Object.defineProperties(Controller.prototype, {
    gamepad: {
      get: function() {
        return new GamePad(this.owner, this.byteOffset, this.OFFSET_GAMEPAD);
      }
    },
    owner: {
      get: function() {
        return new Pointer(this.loadUint32(this.OFFSET_OWNER));
      },
      set: function() {
        return this.storeUint32(this.OFFSET_OWNER, arguments[0]);
      }
    },
    byteOffset: {
      get: function() {
        return this.loadUint32(this.OFFSET_BYTEOFSET);
      },
      set: function() {
        return this.storeUint32(this.OFFSET_BYTEOFSET, arguments[0]);
      }
    }
  });

  return Controller;

}).call(this);

Pointer.register(Controller, GamePad).store(GAMEPAD_KEYS);

export {
  Controller as default
};
