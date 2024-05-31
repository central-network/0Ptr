{log,warn,error,table,debug,info,delay} = console

do  mouse = ->
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

    lastEvent = dataView.getInt32.bind dataView, offsets, lendian
    changeX = dataView.getFloat32.bind dataView, offsets += 4, lendian
    changeY = dataView.getFloat32.bind dataView, offsets += 4, lendian
    screenX = dataView.getFloat32.bind dataView, offsets += 4, lendian
    screenY = dataView.getFloat32.bind dataView, offsets += 4, lendian
    clientX = dataView.getFloat32.bind dataView, offsets += 4, lendian
    clientY = dataView.getFloat32.bind dataView, offsets += 4, lendian

do  keyboard = ->

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

    offset = (
        counters.byteOffset +
        counters.byteLength
    )
        
    offsetCharCode  = offset++
    offsetShiftKey  = offset++
    offsetCtrlKey   = offset++
    offsetAltKey    = offset++
    offsetMetaKey   = offset++
    offsetRepeat    = offset++
    offsetLocation  = offset++
    offsetLastEvent = offset++

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

do  battery = ->

    device    = new ArrayBuffer 24
    counters  = new Uint16Array device, 0, 6
    dataView  = new DataView device
    lendian   = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1

    offsetEvent =  8
    offsetState = 10
    offsetLevel = 12
    offsetCTime = 16
    offsetDTime = 20

    onevents = '
    onchargingchange 
    onchargingtimechange 
    ondischargingtimechange 
    onlevelchange'.split(/\s+|\n/)

    navigator.getBattery().then ( dev ) ->

        for e, iLast in onevents then ( (evnt, i) ->

            this[evnt] = (t) ->

                ++counters[counters[iLast] = i]
                
                dataView.setUint8 offsetState, @charging
                dataView.setInt16 offsetLevel, @level*1e2, lendian
                dataView.setInt16 offsetCTime, @chargingTime, lendian
                dataView.setInt16 offsetDTime, @dischargingTime, lendian

                t.preventDefault()

        ).call( dev, e, onevents.indexOf e )

    lastEvent       = dataView.getInt16.bind dataView, offsetEvent, lendian
    level           = dataView.getInt16.bind dataView, offsetLevel, lendian
    chargingTime    = dataView.getInt16.bind dataView, offsetCTime, lendian
    dischargingTime = dataView.getInt16.bind dataView, offsetDTime, lendian
    charging        = dataView.getUint8.bind dataView, offsetState

do  netlink = ->
    
    device      = new ArrayBuffer 16
    counters    = new Int16Array device, 0, 4
    dataView    = new DataView device
    lendian     = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1

    ionchange = 0 #triggers on three events all
    ioffline  = 1
    ionline   = 2
    itype     = 3

    navigator.connection.onchange = (e) ->
        ++counters[ counters[itype] = ionchange ]

        dataView.setUint8   14, navigator.onLine
        dataView.setUint8   13, parseInt @effectiveType
        dataView.setUint8   12, Number @saveData
        dataView.setUint16  10, @rtt, lendian
        dataView.setFloat32  8, @downlink, lendian

        e.preventDefault()

    window.addEventListener "offline", -> setTimeout ->
        ++counters[ counters[ itype ] = ioffline ]

    window.addEventListener "online", -> setTimeout ->
        ++counters[ counters[ itype ] =  ionline ]

    changeType = dataView.getUint16.bind dataView, 6, lendian
    downlink = dataView.getFloat32.bind dataView, 8, lendian
    rtt = dataView.getUint16.bind dataView, 10, lendian
    saveData = dataView.getUint8.bind dataView, 12
    effectiveType = dataView.getUint8.bind dataView, 13
    currentState = dataView.getUint8.bind dataView, 14
    changeTypes = [ "linkspeed", "linkdown", "linkup" ]

do  fs = ->

    device = new ArrayBuffer 4096 * 256 * 128 #128mb önbellek

    counters    = new Int32Array device, 0, 4
    info        = new DataView device, counters.byteOffset, 4
    
    dataArray   = new Uint8Array device, info.byteOffset
    dataView    = new DataView device 
    lendian     = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
    handles     = [,]
    root        = null
    currentDir  = null

    quota       = dataView.getInt32.bind dataView, 12, lendian
    usage       = dataView.getInt32.bind dataView, 16, lendian
    write       = dataView.getInt32.bind dataView, 20, lendian
    read        = dataView.getInt32.bind dataView, 24, lendian
    create      = dataView.getInt32.bind dataView, 28, lendian

    state       = dataView.getUint8.bind dataView, 32
    status      = dataView.getUint8.bind dataView, 34

    STATE_INIT               = 0
    STATE_ROOT_HANDLE        = 1
    STATE_UNPERSISTED_HANDLE = 2
    STATE_PERSISTED_HANDLE   = 3

    STATUS_IDLE     = 0
    STATUS_READING  = 1
    STATUS_WRITING  = 2

    events      = '
    onstorageroothandle
    onstoragepersisted
    onstoragecreatedirectory
    storagecreatefile
    '.split( /\s+|\n/g )

    emit = ( type, detail = {} ) ->
        window.dispatchEvent new CustomEvent type, { detail }

    window.addEventListener "storagecreatedirectory", ({ detail }) ->
        dataView.setInt32 28, create()+1, lendian
        log "onstoragecreatedirectory:", detail

    window.addEventListener "storagecreatefile", ({ detail }) ->
        dataView.setInt32 28, create()+1, lendian
        log "onstoragecreatefile:", detail

    window.addEventListener "storagepersist", ->
        dataView.setUint8 32, STATE_PERSISTED_HANDLE
        
    window.addEventListener "storageroothandle", ->
        dataView.setUint8 32, STATE_ROOT_HANDLE
        currentDir = root

        try navigator.storage.persisted().then ( persisted ) ->

            if !persisted
                dataView.setUint8 32, STATE_UNPERSISTED_HANDLE
                navigator.storage.persist().then ( persisted ) ->
                    if  persisted then window.dispatchEvent(
                        new Event "storagepersist"
                    )
            else
                window.dispatchEvent new Event "storagepersist"

        try navigator.storage.estimate().then ( estimate ) ->
            dataView.setInt32 16, estimate.quota, lendian
            dataView.setInt32 20, estimate.usage, lendian            

    init = ->
        dataView.setUint8 32, STATE_INIT
        try navigator.storage.getDirectory().then ( handle ) ->
            if  handle instanceof FileSystemDirectoryHandle
                handles.push( root = handle )
                window.dispatchEvent new Event "storageroothandle"

    cd = ( dirName, handle = currentDir ) ->
        currentDir = await handle.getDirectoryHandle dirName

    mkdir = ( dirName, handle = currentDir ) ->
        if  dir = await handle.getDirectoryHandle( dirName, { create: true } )
            emit "storagecreatedirectory", { dir }
        dir

    touch = ( fileName, handle = currentDir ) ->
        if  file = await handle.getFileHandle( fileName, { create: true } )
            emit "storagecreatefile", { file }
        file

    ls = ( handle = currentDir ) ->
        iterator = await handle.entries()
        items = []
        loop
            item = await iterator.next()
            break if item.done is true
            items.push item.value

        items

    cwd = ( handle = currentDir ) ->
        await root.resolve handle

    self.mkdir = mkdir
    self.cwd = cwd
    self.touch = touch
    self.handles = handles

    trapArguments = ( args, include = "" ) ->

        list = 'abcdefghijklmnoptrstuvyzqxw'
        list = list + list.toUpperCase()
        list = list.split ""


        for char in list.slice()
            for num in [ 0 ... 10 ]
                list.push char + num

        if  "string" is typeof include
            include = include.split " "

        for arg in include when !list.includes arg
            list.push arg 

        parameters = {}
        for parameter in list
            parameters[ parameter ] =
                configurable: on, get : args.push.bind args, parameter

        for k of parameters
            Object.defineProperty window, k, parameters[k]

        queueMicrotask ->
            for k of parameters
                Reflect.deleteProperty window, k

        args


    Object.defineProperties window,

        cd : get : ->
            trapArguments args = [], "up"

            pxy = new Proxy {}, {
                get : ( o, key ) -> switch true
                    when (key is Symbol.toPrimitive)
                        return -> args.push ".." ; 0
                    when ("string" is typeof key)
                        args.push key ; 0
            }
            
            queueMicrotask ->

                if  -1 isnt up = args.indexOf "up"
                    args.splice up, 1

                if  args[0] is ".."
                    throw /UP/

                await cd args[0]

            pxy

        ls : get : ->
            trapArguments args = [], "la lh"
            
            queueMicrotask ->
                [ dirName = "" ] = await cwd()
                ( dirName = "/" + dirName )
                
                ls().then ( items ) ->

                    gid = [ "total:", items.length, "path:", dirName ]
                    console.group gid...
                    console.log ".."

                    for [ item ] in items
                        console.log item

                    console.groupEnd gid...
            
            1

    do init

    requestIdleCallback ->
        log(
            "state:", state()
            "persisted:", state() >= STATE_PERSISTED_HANDLE
            "status:", status()
        )
