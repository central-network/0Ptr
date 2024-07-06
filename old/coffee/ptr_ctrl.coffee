import { Pointer, ByteOffset, KeyBase } from "./ptr.js"

GAMEPAD_KEYS = new KeyBase()
GAMEPAD_KEYS . generate {
    STANDART_MAPPING            : "standard"
    ACTUATOR_DUAL_RUMBLE        : "dual-rumble"
}

export class GamePadButton      extends ByteOffset

    OFFSET_INDEX        : @malloc Uint8Array
    
    OFFSET_PRESSED      : @malloc Uint8Array

    OFFSET_TOUCHED      : @malloc Uint8Array

    OFFSET_VALUE        : @malloc Float32Array

    set                 : ->

export class GamePad            extends ByteOffset

    OFFSET_CONNECTED    : @malloc Uint8Array
    
    OFFSET_INDEX        : @malloc Uint8Array

    OFFSET_BYTEOFSET    : @malloc Uint32Array

    OFFSET_CONTROLLER   : @malloc Uint32Array

    OFFSET_OWNER        : @malloc Uint32Array
    
    OFFSET_MAPPING      : @malloc Uint32Array
    
    OFFSET_ACTUATOR     : @malloc Uint16Array

    OFFSET_AXES         : @malloc Float32Array, 4

    OFFSET_EFFECT       : @malloc Uint32Array
    
    OFFSET_RESET        : @malloc Uint32Array

    OFFSET_ID           : @malloc Uint8Array, 64

    OFFSET_BUTTONS      : @malloc Float32Array, 20

    handle              : ({ gamepad: data }) ->

        @connected      = data.connected
        @actuactor      = data.vibrationActuator.type

        @axes.set data.axes

        console.log this

    init                : ->
        @owner      = arguments[0]
        @controller = arguments[1]
        @byteOffset = arguments[2]

    Object.defineProperties this::,

        owner           :
            get         : -> new Pointer @loadUint32 @OFFSET_OWNER 
            set         : -> @storeUint32 @OFFSET_OWNER, arguments[0]

        controller      :
                get     : -> @owner.controller
                set     : -> @storeUint32 @OFFSET_CONTROLLER, arguments[0]

        connected       :
                get     : -> @loadUint8 @OFFSET_CONNECTED
                set     : -> @storeUint8 @OFFSET_CONNECTED, arguments[0]

        axes            :
                get     : -> new Float32Array @buffer, @offset( @OFFSET_AXES ), 4
                set     : -> @axes.set arguments[0]

        actuactor       :
                get     : -> @keyUint16 @OFFSET_ACTUATOR, GAMEPAD_KEYS
                set     : -> @storeUint16 @OFFSET_ACTUATOR, GAMEPAD_KEYS[ arguments[0] ]
        
        byteOffset      :
            get         : -> @loadUint32 @OFFSET_BYTEOFSET 
            set         : -> @storeUint32 @OFFSET_BYTEOFSET, arguments[0]

export class Controller extends ByteOffset

    @byteLength         : 4 * 256

    OFFSET_OWNER        : @malloc Uint32Array

    OFFSET_BYTEOFSET    : @malloc Uint32Array
    
    OFFSET_GAMEPAD      : @malloc Uint32Array, 64

    init                : ->
        @owner = arguments[0]
    
    Object.defineProperties this::,
        
        gamepad     :
            get     : -> new GamePad @owner, @byteOffset, @OFFSET_GAMEPAD
    
        owner       :
            get     : -> new Pointer @loadUint32 @OFFSET_OWNER
            set     : -> @storeUint32 @OFFSET_OWNER, arguments[0]
    
        byteOffset  :
            get     : -> @loadUint32 @OFFSET_BYTEOFSET 
            set     : -> @storeUint32 @OFFSET_BYTEOFSET, arguments[0]

Pointer.register(
    Controller, GamePad
)
.store GAMEPAD_KEYS

export { Controller as default }