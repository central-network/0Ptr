{log,warn,error,table,debug,info,delay} = console

do  onpointerevents = ->
    device      = new ArrayBuffer 64
    counters    = new Int32Array device, 0, 10
    positions   = new Float32Array device, 40, 6
    dataView    = new DataView device
    lendian     = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1

    onevent = '
    onpointerdown 
    onpointermove 
    onpointerup 
    onpointercancel 
    onpointerover 
    onpointerout 
    onpointerenter 
    onpointerleave'.split( /\s+|\n/g )

    for e, iLast in onevent then ( (evnt, i) ->

        window.addEventListener evnt, ( t ) ->

            ++counters[counters[iLast] = i]

            positions.set( Float32Array.of(
                t.screenX - positions[2], 
                t.screenY - positions[3],
                t.screenX , t.screenY, 
                t.clientX , t.clientY, 
            ), 0 )

            t.preventDefault()
            
    )( e.substring(2), onevent.indexOf e )

    offsets = positions.byteOffset - 4
    changeX = dataView.getFloat32.bind dataView, offsets += 4, lendian
    changeY = dataView.getFloat32.bind dataView, offsets += 4, lendian
    screenX = dataView.getFloat32.bind dataView, offsets += 4, lendian
    screenY = dataView.getFloat32.bind dataView, offsets += 4, lendian
    clientX = dataView.getFloat32.bind dataView, offsets += 4, lendian
    clientY = dataView.getFloat32.bind dataView, offsets += 4, lendian

do  onkeyboardevents = ->

    device      = new ArrayBuffer 144
    counters    = new Int32Array device, 0, 3
    dataView    = new DataView device
    keyArray    = new Uint8Array device, 144 - 120
    lendian     = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1

    keys = '
    IntlBackslash KeyA KeyS KeyD KeyF KeyH KeyG KeyZ KeyX KeyC KeyV KeyB KeyQ 
    KeyW KeyE KeyR KeyY KeyT Digit1 Digit2 Digit3 Digit4 Digit6 Digit5 
    Equal Digit9 Digit7 Minus Digit8 Digit0 BracketRight KeyO KeyU BracketLeft 
    KeyI KeyP Enter KeyL KeyJ Quote KeyK Semicolon Backslash Comma Slash KeyN 
    KeyM Period Tab Space Backquote Backspace NumpadEnter Escape 
    MetaRight MetaLeft ShiftLeft CapsLock AltLeft ControlLeft ShiftRight AltRight ControlRight 
    Fn F17 NumpadDecimal NumpadMultiply NumpadAdd NumLock VolumeUp VolumeDown VolumeMute 
    NumpadDivide NumpadSubtract F18 F19 NumpadEqual Numpad0 Numpad1 Numpad2 Numpad3 
    Numpad4 Numpad5 Numpad6 Numpad7 Numpad8 Numpad9 NumpadComma IntlYen IntlRo 
    F20 F5 F6 F7 F3 F8 F9 F11 F13 F16 F14 F10 F12 F15 F4 F2 F1 Lang2 Lang1 ContextMenu 
    Help Home PageUp Delete End PageDown ArrowLeft ArrowRight ArrowDown ArrowUp    
    '.split(/\s+|\n/) #120

    iKeyDownCount   = 0
    iKeyUpCount     = 1
    iEventCount     = 2

    offsetCharCode  = 12
    offsetShiftKey  = 14
    offsetCtrlKey   = 15
    offsetAltKey    = 16
    offsetMetaKey   = 17
    offsetRepeat    = 18
    offsetLocation  = 19
    offsetLastEvent = 20

    window.addEventListener "keydown", (e) ->
        counters[iEventCount]++
        counters[iKeyDownCount]++

        charCode = !e.key[1] and e.key.charCodeAt 0
        dataView.setUint16 offsetCharCode, charCode, lendian

        dataView.setUint8 offsetShiftKey , e.shiftKey
        dataView.setUint8 offsetCtrlKey  , e.ctrlKey
        dataView.setUint8 offsetAltKey   , e.altKey
        dataView.setUint8 offsetMetaKey  , e.metaKey
        dataView.setUint8 offsetRepeat   , e.repeat
        dataView.setUint8 offsetLocation , e.location
        dataView.setUint8 offsetLastEvent, 0

        keyArray[ keys.indexOf e.code ] = 1
        e.preventDefault()

    window.addEventListener "keyup", (e) ->
        counters[iEventCount]++
        counters[iKeyUpCount]++

        dataView.setUint8 offsetCharCode, 0, lendian

        dataView.setUint8 offsetShiftKey , e.shiftKey
        dataView.setUint8 offsetCtrlKey  , e.ctrlKey
        dataView.setUint8 offsetAltKey   , e.altKey
        dataView.setUint8 offsetMetaKey  , e.metaKey
        dataView.setUint8 offsetRepeat   , e.repeat
        dataView.setUint8 offsetLocation , e.location
        dataView.setUint8 offsetLastEvent, 1

        keyArray[ keys.indexOf e.code ] = 0
        e.preventDefault()

    lastEvent = dataView.getUint8.bind dataView, offsetLastEvent
    shiftKey  = dataView.getUint8.bind dataView, offsetShiftKey
    ctrlKey   = dataView.getUint8.bind dataView, offsetCtrlKey
    altKey    = dataView.getUint8.bind dataView, offsetAltKey
    metaKey   = dataView.getUint8.bind dataView, offsetMetaKey
    lastCode  = dataView.getUint16.bind dataView, offsetCharCode, lendian
    lastChar  = -> ( c = lastCode() ) and String.fromCharCode( c ) or ""
    eventType = -> [ "keydown", "keyup" ][ lastEvent() ]
    activeKey = -> keys[ keyArray.findIndex (v) -> v ] or 0
