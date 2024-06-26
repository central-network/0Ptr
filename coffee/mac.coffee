do ->
    DEBUG = 1

    {navigator, console, Object, Reflect, performance, localStorage} = window
    {deleteProperty, apply} = Reflect
    {values,keys,assign,defineProperty, defineProperties, hasOwn,
    getOwnPropertyDescriptor:getDesc,
    getOwnPropertyDescriptors:getOwn, getPrototypeOf: prototypeOf,
    create: createObject, setPrototypeOf, isPrototypeOf, seal, isSealed,
    getOwnPropertySymbols, preventExtensions, freeze, isFrozen, entries} = Object
    {log,warn,error,table,debug,info,delay,group,groupEnd} = console

    now = -> Date.now()
    pnow = -> parseFloat performance.now().toFixed(1)
    logger = ->
        document.body.appendChild(Object.assign(
            document.createElement("div"), {
                className : "log",
                innerHTML : [ arguments... ].map((i) ->
                    if  i instanceof Object
                        args = off
                        if i.arguments
                            args = on
                            i = i.arguments
                        el = ""
                        for k,v of i
                            if "#{v}".match /\[/
                                v = "[[#{v.constructor.name}]]"

                            if isNaN k
                                el += k + " -> " +  v + "<br>"
                            else
                                if args is off
                                    el += v + "<br>"
                                else
                                    el += v + ", "

                        if args is on
                            el = el.substring(0, el.length-2)
                        return el
                    i.toString()
                ).map( (innerHTML) -> Object.assign(
                    document.createElement("span"), {innerHTML}
                ).outerHTML).join("")
            }
        ))


    window.addEventListener "DOMContentLoaded", ->
        proto = prototypeOf window

        for key, desc of getOwn window
            if !key.startsWith "on"
                if  desc.configurable and desc.value
                    desc.enumerable = no
                    defineProperty proto, key, desc 
            deleteProperty window, key

        if  typeof window.chrome isnt "undefined"
            Object.defineProperty window, "chrome", value: "tru 💚 th"

        "$ $0 $1 $2 $3 $4 $$ $_ $x clear copy debug dir dirxml 
        getAccessibleName getAccessibleRole getEventListeners 
        inspect keys monitor monitorEvents profile profileEnd 
        queryObjects table undebug unmonitor unmonitorEvents 
        values".split(/\s+|\n/g).forEach (key) ->
            defineProperty proto, key, value: ->

    Object.defineProperties console, 

        memory          : value : new ArrayBuffer 0, { maxByteLength : 1e7 }

        commands        : value : new Object

        fsIndex         : value : new Array

        tempkeys        : value : new Array

        emit            : value : emit = ( type, detail ) ->
            window.dispatchEvent new CustomEvent type, { detail }; detail

    Object.defineProperties console, 

        resetColor      : value : ( key ) ->
            if !key then for key of localStorage
                if key.startsWith "color"
                    console.resetColor key
            else localStorage.removeItem "color(#{key})"

        clearTempKeys   : value : ->
            while key = @tempkeys.splice(-1).at(-1)
                Reflect.deleteProperty window, key

        addTempKey      : value : ( key ) ->
            @tempkeys[ @tempkeys.length ] = key

        keyProxy        : value : ( word, _chain = [], level = 0 ) ->
            new Proxy Function::, {
                apply  : ( f, key, args ) ->
                    for arg, i in args
                        log arg
                        if  arg instanceof Proxy
                            args[i] = arg[Symbol.toStringTag]

                    _chain.push({as : "function", args: args})
                    console.keyProxy word, _chain, level + 2

                get    : ( f, key ) ->
                    if  key is Symbol.toPrimitive
                        return -> 1

                    if  key is Symbol.toStringTag
                        return -> word

                    if  key is "then"
                        return  console.commands[ word ].resolve = ->

                            if !console.commands[ word ].request
                                console.commands[ word ].request = arguments[0]
                                return

                            console.commands[ word ].request()
                    
                    _chain.push({as : "keyword", key, level})
                    console.keyProxy word, _chain, level + 1
            }

        deployTempProxy : value : ( key ) ->

            { args=[], chain=[] } = @commands[ key ]

            @clearTempKeys()
    
            for a, i in args then while i--
                continue if a.length-1
                args.push a + args[i]
                args.push args[i] + a
    
            for w in args when !Object.hasOwn window, w
                Object.defineProperty window, @addTempKey(w), {
                    configurable : yes
                    get : ((key)->->
                        chain.push { as : "argument", key }
                        console.keyProxy key, chain
                    )(w)
                }
    
            for i in console.fsIndex when !Object.hasOwn window, (w = i.global)
                Object.defineProperty window, @addTempKey(w), {
                    configurable : yes
                    get : ((key)->->
                        chain.push {
                            as : "fshandle", key,
                            level : 1,
                            subchain : (subchain = [])
                        }
                        console.keyProxy key, subchain
                    )(w)
                }
    
            chain

        updatePathIndex : value : ( dHandle, level = 0 ) ->
                    
            path = await resolv dHandle
            if !@fsIndex.find (i) -> i.path is path
                @fsIndex.push dHandle

                dHandle.path = path
                dHandle.level = level 
                dHandle.global = dHandle.name.split(
                    /\.|(\w+)/gui
                ).filter(Boolean).at 0
                
            for iHandle in await ls dHandle

                path = await resolv iHandle
                if !@fsIndex.find (i) -> i.path is path
                    @fsIndex.push iHandle

                    iHandle.path = path
                    iHandle.global = iHandle.name.split(
                        /\.|(\w+)/gui
                    ).filter(Boolean).at 0
    
                if  iHandle.kind is "directory"
                    await @updatePathIndex iHandle, level + 1
    
            return dHandle
        
        dispatchCommand : value : ( key ) -> 

            console.waitingCall = ->
                console.waitingCall = 0

                done = console.lastDone
                This = console.lastThis

                { handler, chain=[], resolve } = This                    

                console.clearTempKeys()

                sequence = []
                dirchain = []
                subchain = []
                argindex = {}
                
                for arg in chain.slice()

                    continue if arg.as.match /command/

                    if !arg.as.match /fshandle/
                        i = 0

                        if dirchain.length then i = sequence.push(
                            "/" + dirchain.join "/"
                        ) - 1
                        dirchain = []

                        if subchain.length then sequence[i] +=
                            "." + subchain.join "."
                        subchain = []

                        if i then sequence[i] = path : sequence[i]
                    
                    if  arg.as.match /argument/
                        argindex[arg.key] =
                            sequence.push "-" + arg.key
                        continue

                    if  arg.as.match /function/
                        i = 0

                        if dirchain.length then i = sequence.push(
                            "/" + dirchain.join "/"
                        ) - 1
                        dirchain = []

                        if subchain.length then sequence[i] +=
                            "." + subchain.join "."
                        subchain = []

                        if i then sequence[i] = path : sequence[i]

                        sequence.push arg.args...
                        continue
                        
                    if  arg.as.match /fshandle/

                        if  subchain.length
                            i = 0

                            if dirchain.length then i = sequence.push(
                                "/" + dirchain.join "/"
                            ) - 1
                            dirchain = []
    
                            if subchain.length then sequence[i] +=
                                "." + subchain.join "."
                            subchain = []

                            if i then sequence[i] = path : sequence[i]

                        dirchain.push arg.key

                        for s in arg.subchain

                            if  s.as.match /keyword/
                                subchain.push s.key

                            if  s.as.match /function/
                                i = 0

                                if dirchain.length then i = sequence.push(
                                    "/" + dirchain.join "/"
                                ) - 1
                                dirchain = []
        
                                if subchain.length then sequence[i] +=
                                    "." + subchain.join "."
                                subchain = []

                                if i then sequence[i] = path : sequence[i]
                                sequence.push s.args...

                i = 0
                if dirchain.length then i = sequence.push(
                    "/" + dirchain.join "/"
                ) - 1
                dirchain = []

                if subchain.length then sequence[i] +=
                    "." + subchain.join "."
                subchain = []

                if i then sequence[i] = path : sequence[i]

                for part, i in sequence when path = part.path

                    if  fshandle = console.fsIndex.find (h) -> h.path is path
                        sequence[i] = fshandle

                    parent = path
                    while parent = parent.split("/").slice(0, -1).join("/")
                        if  fshandle = console.fsIndex.find (h) -> h.path is parent
                            sequence[i].parent = fshandle
                            break

                    sequence[i] = sequence[i].path

                response = values sequence
                response = response.filter (i) -> i isnt -1

                argc = Object.keys(argindex).length
                
                for argument, argi of argindex
                    rargs = response.slice argi   
                    
                    if  (rargs.length is 1) or (argi isnt argc)
                        if  response[argi] and response[argi][0] is "-"
                            defineProperty response, argument, value : on
                        else
                            defineProperty(
                                response, argument, value : response[argi]
                            )
                    else
                        defineProperty(
                            response, argument, value : rargs
                        )

                
                for argument , binding of This.bound
                    hasBound = binding

                    for arg in argument.split " "
                        continue if argindex[arg]
                        hasBound = no
                        break
                    continue unless hasBound

                    return await hasBound.call This, response, resolve || done

                await handler.call This, response, resolve || done

            @lastThis = console.commands[ key ]

            new Promise ( done ) =>
                @lastDone = done
                @lastCall = setTimeout @waitingCall, 40
        
        registerCommand : value : ( cmd, args = [], handler ) ->

            if  typeof (g = @commands[cmd]) isnt "undefined"
                throw [ COMMAND_NAME_ALREADY_INGLOBALS : g ]

            if  typeof args is "string"
                args = args.split " "

            @commands[ cmd ] =
                { cmd, args, handler, bound : [], _ : {} }

            getter = ( key ) -> [ key ] : get : ->
                if  console.waitingCall
                    clearTimeout console.lastCall
                    console.waitingCall()

                console.commands[ key ].request =
                console.commands[ key ].resolve = null
                
                console.commands[ key ].chain =
                    [{ as : "command", key }]

                console.deployTempProxy key
                console.dispatchCommand key
                return console.keyProxy key
        
            Object.defineProperties __proto__, getter cmd

            emit "consolecommandregister", cmd

        bindCommandArgs : value : ( cmd, key, handler ) ->

            if !console.commands[cmd]
                console.registerCommand cmd, [], ->
                    log "command executed", cmd

            for arg in key.split " "
                if !console.commands[cmd].args.includes arg
                    console.commands[cmd].args.push arg
                
            if  handler
                console.commands[cmd].bound[key] = handler

            console.commands[cmd]

    classes = []

    classes.push class Core           extends EventTarget
        events : []

    classes.push class DeviceManager  extends Core

        bound : []

        constructor : ( scope ) ->
            super scope.constructor.name
                .scope = scope

            @registerCommands scope.console

            @debug "Device manager constructed", this

            emit "devicemanagerready", this

        registerCommands : ( scope ) ->
            This = this

            scope.registerCommand "device", "list scope", ( args, done ) =>
                if !args.length
                    return done @information()

            scope.bindCommandArgs "device", "add sensor driver events", ( args, done ) =>
                @addSensorDevice args.driver, args.events, args.scope

            scope.bindCommandArgs "device", "add driver type", ( args, done ) =>
                @addDeviceDriver args.type, args.driver

        addDeviceDriver   : ( type, driver ) ->
            @debug "type", type
            @debug "driver", driver

        addSensorDevice   : ( driver, events, scope = @scope ) ->
            @debug "driver:", driver.name
            @debug "events:", events
            @debug "scope:", scope

        information : ->
            @log "Device manager running since:", new Date()


    classes.push class MemoryDevice   extends DataView
        
    classes.push class PointerDevice  extends DataView            
        constructor : ->
            super( new ArrayBuffer 64 )

        bind        : ->
            device      = @buffer
            counters    = new Int32Array device, 0, 10
            positions   = new Float32Array device, 40, 6
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

                window.addEventListener evnt, ( t ) =>

                    ++counters[counters[iLast] = i]

                    positions.set( Float32Array.of(
                        t.screenX - positions[2], 
                        t.screenY - positions[3],
                        t.screenX , t.screenY, 
                        t.clientX , t.clientY, 
                    ), 0 )

                    t.preventDefault()
                    
            ).call( this, e.substring(2), onevent.indexOf e )

            offsets = positions.byteOffset - 4

            lastEvent = @getInt32.bind this, offsets, lendian
            changeX = @getFloat32.bind this, offsets += 4, lendian
            changeY = @getFloat32.bind this, offsets += 4, lendian
            screenX = @getFloat32.bind this, offsets += 4, lendian
            screenY = @getFloat32.bind this, offsets += 4, lendian
            clientX = @getFloat32.bind this, offsets += 4, lendian
            clientY = @getFloat32.bind this, offsets += 4, lendian

    classes.push class KeyboardDevice extends DataView            
        constructor : ->
            super( new ArrayBuffer 144 )

        bind : ->
            device      = @buffer
            counters    = new Int32Array device, 0, 3
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

            window.addEventListener "keydown", (e) =>
                counters[iEventCount]++
                counters[iKeyDownCount]++

                charCode = !e.key[1] and e.key.charCodeAt 0
                @setUint16 offsetCharCode, charCode, lendian

                @setUint8 offsetShiftKey , e.shiftKey
                @setUint8 offsetCtrlKey  , e.ctrlKey
                @setUint8 offsetAltKey   , e.altKey
                @setUint8 offsetMetaKey  , e.metaKey
                @setUint8 offsetRepeat   , e.repeat
                @setUint8 offsetLocation , e.location
                @setUint8 offsetLastEvent, 0

                keyArray[ keys.indexOf e.code ] = 1
                #e.preventDefault()

            window.addEventListener "keyup", (e) =>
                counters[iEventCount]++
                counters[iKeyUpCount]++

                @setUint8 offsetCharCode, 0, lendian

                @setUint8 offsetShiftKey , e.shiftKey
                @setUint8 offsetCtrlKey  , e.ctrlKey
                @setUint8 offsetAltKey   , e.altKey
                @setUint8 offsetMetaKey  , e.metaKey
                @setUint8 offsetRepeat   , e.repeat
                @setUint8 offsetLocation , e.location
                @setUint8 offsetLastEvent, 1

                keyArray[ keys.indexOf e.code ] = 0
                #e.preventDefault()

            lastEvent = @getUint8.bind this, offsetLastEvent
            shiftKey  = @getUint8.bind this, offsetShiftKey
            ctrlKey   = @getUint8.bind this, offsetCtrlKey
            altKey    = @getUint8.bind this, offsetAltKey
            metaKey   = @getUint8.bind this, offsetMetaKey
            lastCode  = @getUint16.bind this, offsetCharCode, lendian
            lastChar  = -> ( c = lastCode() ) and String.fromCharCode( c ) or ""
            eventType = -> [ "keydown", "keyup" ][ lastEvent() ]
            activeKey = -> keys[ keyArray.findIndex (v) -> v ] or 0

    if  DEBUG then do -> for proto, i in classes

        alias = proto.name

        if !fc = localStorage.getItem cn = "color(#{alias})"
            rand = -> Math.trunc Math.random() * 255
            fc = [ 38, 2, rand(), rand(), rand() ].join ";"
            localStorage.setItem cn, fc
        
        protoName = "\x1B[#{fc}m#{alias}::\x1B[39m"
        className = "\x1B[53m#{protoName}\x1B[55m"

        for prop, {value} of getOwn proto::

            continue if typeof value isnt "function"
            continue if prop.match( /constructor/ )

            (( method, handler, alias ) ->
                Object.defineProperty this, method, value : ->
                    logger alias, pnow(), "#{method}()", { arguments }
                    Reflect.apply handler, this, arguments
            ).call proto::, prop, value, "#{alias}::"
            
        for prop, {value} of getOwn proto

            continue if typeof value isnt "function"

            (( method, handler, alias ) ->
                Object.defineProperty this, method, value : ->
                    logger alias, pnow(), "#{method}()", { arguments }
                    Reflect.apply handler, this, arguments
            ).call proto, prop, value, "#{alias}" 

        (( className, protoName, alias ) ->
            return if typeof @log isnt "undefined"

            defineProperty this::, "log", value : ->
                debug protoName, pnow(), arguments[0].padEnd(40, " "), [...arguments].slice(1)

            defineProperty this, "log", value : ->
                debug className, pnow(), arguments[0].padEnd(40, " "), [...arguments].slice(1)

            defineProperty this::, "debug", value : ->
                logger @constructor.name + "::", pnow(), arguments[0].padEnd(40, " "), [...arguments].slice(1)
                
            defineProperty this, "debug", value : ->
                logger @constructor.name, pnow(), arguments[0].padEnd(40, " "), [...arguments].slice(1)
                
        ).call proto, className, protoName, alias

    window.addEventListener "DOMContentLoaded", ->
        @this = new DeviceManager( window )
    
    window.addEventListener "devicemanagerready", ({ detail: devman }) ->
        log devman
    

    ###
    console.registerCommand "device", [ "bind", "list", "type" ], ( args, done ) ->
        log "device call begin:", { arguments }

    console.bindCommandArgs "device", "list all", ( args, done ) ->
        log "list all devices"

    console.bindCommandArgs "device", "driver", ( args, done ) ->

        drivers = args.driver.slice i=0
        count = drivers.length / 2

        while i < count
            
            [ type, Driver ] = drivers.slice( i, i += 2 )

            console.bindCommandArgs "device", "add #{type} bind", (->
                ({ bind: global }) =>
                    new this().bind( global )
            ).call( Driver )

        done this

    window.addEventListener "consolebootready", ->
        #* booooooting now :)

        device -driver "memory", MemoryDevice
        device -driver "pointer", PointerDevice
        device -driver "keyboard", KeyboardDevice

        device -add -pointer -bind window
        device -add -keyboard -bind window

    ###

###

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
            #e.preventDefault()

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
            #e.preventDefault()

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

        counters    = new Int32Array device, 0, 10
        dataArray   = new Uint8Array device, counters.byteLength 
        dataView    = new DataView device 
        lendian     = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
        handles     = [,]
        root        = null
        currentDir  = null
        currentFile = null

        quota       = ->
            Number dataView.getBigUint64 12, lendian
        usage       = dataView.getUint32.bind dataView, 20, lendian
        written     = dataView.getUint32.bind dataView, 24, lendian
        readed      = dataView.getUint32.bind dataView, 28, lendian
        create      = dataView.getInt32.bind  dataView, 32, lendian
        remove      = dataView.getInt32.bind  dataView, 36, lendian

        state       = dataView.getUint8.bind dataView, 40
        status      = dataView.getUint8.bind dataView, 41

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
        onstoragecreatefile
        onstorageremovefile
        onstoragcwdupdate
        '.split( /\s+|\n/g )

        init = ->
            dataView.setUint8 40, STATE_INIT
            try navigator.storage.getDirectory().then ( handle ) ->
                if  handle instanceof FileSystemDirectoryHandle
                    handles.push( root = handle )
                    emit "storageroothandle", root

        cd      = ( dirName, handle = currentDir ) ->
            await setcwd currentDir =
                await handle.getDirectoryHandle dirName

        setcwd  = ( handle = currentDir ) ->
            Object.defineProperty __proto__, "cwd",
                writable: on
                configurable: on
                value : await resolv handle

            emit "storagcwdupdate", handle

            handle

        mkdir   = ( dirName, target = currentDir ) ->
            if  dir = await target.getDirectoryHandle( dirName, { create: true } )
                emit "storagecreatedirectory", { dir }
            dir

        touch   = ( anyForD, target = currentDir ) ->

            if  anyForD instanceof FileSystemFileHandle
                return await touch anyForD.name, target

            if  anyForD instanceof FileSystemDirectoryHandle
                return await mkdir anyForD.name, target

            if  typeof anyForD is "string"
                handle = await target.getFileHandle(
                    anyForD, { create: true }
                )
                emit "storagecreatefile", handle

            handle

        parent  = ( handle = currentDir ) ->
            #todo
            
        rmdir   = ( dirName, recursive = no, handle = currentDir ) ->
            if  recursive instanceof FileSystemHandle
                recursive = !( handle = recursive )

            await handle.removeEntry( dirName, { recursive } )
            emit "storageremovedirectory", { dirName }

        rm      = ( anyForD, force = no, recursive = no, handle = currentDir ) ->
            if  force instanceof FileSystemHandle
                force = recursive = !( handle = force )

            if  recursive instanceof FileSystemHandle
                recursive = !( handle = recursive )

            if !item = ( await ls handle ).find (i) -> i.name is anyForD
                return error "File or folder (#{anyForD}) is not in: #{cwd}"

            if  item instanceof FileSystemDirectoryHandle
                if !force then if ( await ls item ).length
                    return error "Folder is not empty"

            await handle.removeEntry( anyForD, { recursive } )

            emit "storageremovefile", { anyForD }

        ls      = ( handle ) ->
            handle ||= currentDir

            if  typeof handle is "string"
                it = await currentDir.values()
                while e = (await it.next()).value
                    continue if e.name isnt handle
                    handle = e ; break

            if !handle instanceof FileSystemDirectoryHandle
                return error "This is not a directory: ", handle

            iterator = await handle.values()
            items = []
            
            loop
                item = await iterator.next()
                break if item.done is true
                items.push item.value
            items
        
        dir     = ( handle ) ->
            handle ||= currentDir

            if  typeof handle is "string"
                it = await currentDir.values()
                while e = (await it.next()).value
                    continue if e.name isnt handle
                    handle = e ; break

            if !handle instanceof FileSystemDirectoryHandle
                return error "This is not a directory: ", handle

            iterator = await handle.keys()
            items = []
            
            loop
                item = await iterator.next()
                break if item.done is true
                items.push item.value
            items

        resolv  = ( handle ) ->
            handle ||= currentDir 

            if  typeof handle is "string"
                it = await currentDir.values()
                while e = (await it.next()).value
                    continue if e.name isnt handle
                    handle = e ; break

            return "/" + (
                await root.resolve handle
            ).join "/"

        queryp  = ( handle, mode = "readwrite" ) ->
            "granted" is await handle.queryPermission { mode }

        askp    = ( handle, mode = "readwrite" ) ->
            "granted" is await handle.requestPermission { mode }

        issame  = ( handle, target ) ->
            await target.isSameEntry handle

        read    = ( file, handle = currentDir ) ->
            if  file instanceof FileSystemFileHandle
                { name : file } = ( fhandle = file )

            else if  Array.isArray file
                [ file , fhandle ] = ( file )

            else if "string" is typeof file
                for item in await ls handle
                    if  item.name is file
                        fhandle = item
                        break

            if !fhandle or !fhandle instanceof FileSystemFileHandle
                return text : -> error "No such a file:", [ file ]
                
            await fhandle.getFile()

        cat     = ( file, handle = currentDir ) ->
            data = await read file, handle

            dataView.setUint32( 28,
                readed() + data.size, lendian
            )

            await data.text()

        write   = ( data, writeableFHandle = currentFile ) ->
            if  data instanceof FileSystemFileHandle
                data = await read data

            try
                writableStream =
                    # FileSystemWritableFileStream
                    await writeableFHandle.createWritable()

                await writableStream.write data
                await writableStream.close()

                dataView.setUint32(
                    24, written() + data.size, lendian
                )

            catch e then error e, arguments...
            finally return writeableFHandle

        pick    = ( type = "directory" ) ->
            return  if /dir/.test type
                try await showDirectoryPicker()
            else    if /file/.test type
                try await showOpenFilePicker()
            else    if /savefile/.test type
                try await showSaveFilePicker()
            else    throw /UNDEFINED_TYPE_PICK/

        mv_f2f  = ( srcFHandle, dstFHandle, force = no ) ->
            if !srcFHandle instanceof FileSystemFileHandle
                throw /SRC_MUST_BE_FILE/

            if !dstFHandle instanceof FileSystemFileHandle
                throw /DST_MUST_BE_FILE/

            if (await issame srcFHandle, dstFHandle)
                throw /SRC_AND_DST_ISSAME/

            if (await queryp dstFHandle) is no
                throw /NO_PERMISSON_WRITE_TO_TARGET/

            if (await queryp srcFHandle, "read") is no
                throw /NO_PERMISSON_READ_TO_SOURCE/

            await write srcFHandle, dstFHandle

        mv_f2d  = ( srcFHandle, dstDHandle ) ->
            if !srcFHandle instanceof FileSystemFileHandle
                throw /SRC_MUST_BE_FILE/

            if !dstDHandle instanceof FileSystemDirectoryHandle
                throw /DST_MUST_BE_DIRECTORY/

            if (await queryp dstDHandle) is no
                throw /NO_PERMISSON_WRITE_TO_TARGET/

            if (await queryp srcFHandle, "read") is no
                throw /NO_PERMISSON_READ_TO_SOURCE/
                
            dstFHandle = await touch srcFHandle, dstDHandle 
            await mv_f2f srcFHandle, dstFHandle

        mv_d2d  = ( srcDHandle, dstDHandle ) ->
            if !srcDHandle instanceof FileSystemDirectoryHandle
                throw /SRC_MUST_BE_DIRECTORY/

            if !dstDHandle instanceof FileSystemDirectoryHandle
                throw /DST_MUST_BE_DIRECTORY/

            if (await issame srcDHandle, dstDHandle)
                throw /SRC_AND_DST_ISSAME/

            d = await mkdir srcDHandle.name, dstDHandle

            for fdHandle in await ls srcDHandle

                if  fdHandle instanceof FileSystemFileHandle
                    await mv_f2d fdHandle, d
                    continue
                
                if  fdHandle instanceof FileSystemDirectoryHandle
                    await mv_d2d fdHandle, d
                    continue
            1

        mv      = ( handle, target = currentDir ) ->

            if  target instanceof Array
                target = target.find (i) ->
                    i instanceof FileSystemHandle

            if  typeof target is "string"
                target = if target is "." then currentDir
                else
                    _ls = await ls currentDir
                    _ls . find (fd) -> fd.name is target
            
            if !target instanceof FileSystemHandle
                throw [ /TARGET_UNRESOLVED/, arguments... ]

            if  handle instanceof FileSystemFileHandle

                if  target instanceof FileSystemFileHandle
                    return await mv_f2f handle, target

                if  target instanceof FileSystemDirectoryHandle
                    return await mv_f2d handle, target

            if  handle instanceof FileSystemDirectoryHandle

                if  target instanceof FileSystemFileHandle
                    throw /NOT_POSSIBLE_WRITE_DIR_TO_FILE/

                if  target instanceof FileSystemDirectoryHandle
                    return await mv_d2d handle, target

            if  handle instanceof Array

                await mv ihandle, target for ihandle in handle

            if  typeof handle is "string"
                
                handle = ( await ls currentDir
                ).find (i) -> i.name is handle
                return await mv handle, target

            throw [ /SOURCE_ARRAY_UNRESOLVED/, handle ]
            await rmdir handle.name, target


    window.addEventListener "storagecreatedirectory", ({ detail }) ->
        dataView.setInt32 32, create()+1, lendian
        log "onstoragecreatedirectory:", detail

    window.addEventListener "storageremovedirectory", ({ detail }) ->
        dataView.setInt32 36, remove()+1, lendian
        log "onstorageremovedirectory:", detail

    window.addEventListener "storagecreatefile", ({ detail }) ->
        dataView.setInt32 32, create()+1, lendian
        log "onstoragecreatefile:", detail

    window.addEventListener "storageremovefile", ({ detail }) ->
        dataView.setInt32 36, remove()+1, lendian
        log "onstorageremovefile:", detail

    window.addEventListener "storagepersist", ->
        dataView.setUint8 40, STATE_PERSISTED_HANDLE
        
    window.addEventListener "storageroothandle", ->
        dataView.setUint8 40, STATE_ROOT_HANDLE
        await setcwd currentDir = root

        try navigator.storage.persisted().then ( persisted ) ->

            if !persisted
                dataView.setUint8 40, STATE_UNPERSISTED_HANDLE
                navigator.storage.persist().then ( persisted ) ->
                    if  persisted then window.dispatchEvent(
                        new Event "storagepersist"
                    )
            else
                emit "storagepersist", root

        try navigator.storage.estimate().then ( estimate ) ->
            dataView.setBigUint64 12, BigInt(estimate.quota), lendian
            dataView.setUint32 20, estimate.usage, lendian
                        

    onclick = ->

        log handle = await pick( "dir" )
        log await ls handle

        if  handle instanceof FileSystemHandle
            await mv handle, currentDir
    
    

    # update console's fsindex
    window.addEventListener "storagcwdupdate", ({ detail: handle }) ->

        console.updatePathIndex handle

        cmd     = "ls"
        args    = ["l", "a", "h"]
        handler = ( sequence ) ->
            log "command executed ls:", sequence

        console.registerCommand cmd, handler, args

        cmd     = "mount"
        args    = ["fs", "root"]
        handler = ( sequence ) ->
            log "command executed fs:", sequence

        console.registerCommand cmd, handler, args


        cmd     = "device"
        args    = ["add"]
        handler = ( sequence ) ->
            log ["device"], " <-- ", sequence

        console.registerCommand cmd, handler, args

###