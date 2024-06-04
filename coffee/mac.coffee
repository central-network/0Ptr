do ->
    {Reflect, Object, Float32Array, Int32Array, DataView, Uint32Array, ArrayBuffer,
    Uint16Array, Uint32Array, dispatchEvent, addEventListener, Event, CustomEvent,
    JSON, setTimeout, clearTimeout, requestIdleCallback, requestAnimationFrame,
    navigator, Proxy, Function, __proto__, FileSystemDirectoryHandle, Symbol, console,
    showDirectoryPicker, showOpenFilePicker, showSaveFilePicker, RegExp,
    Array, Number, String, Boolean, Math, Uint8ClampedArray, Int8Array, Uint8Array,
    Int16Array, Float64Array, BigInt64Array, BigUint64Array, Atomics,
    BigInt, FileSystemFileHandle, FileSystemHandle, parseInt, parseFloat} = window

    {log,warn,error,table,debug,info,delay,group,groupEnd} = console


    window.on2error =
    window.on2unhandledrejection = ->
        #document.body.innerHTML += JSON.stringify arguments
        #error arguments...
        true

    class TerminalParameter extends Function

        key : ""

        constructor : ( alias ) ->
            super().parseAlias @alias = alias


            log this.parts

        toString    : ->
            @alias

        valueOf     : ->
            return @proxy if @proxy 

            construct       = -> log( key, 'pxy construct', {arguments}); Reflect.construct arguments...
            defineProperty  = -> log( key, 'pxy defineProperty', {arguments}); Reflect.defineProperty arguments...
            deleteProperty  = -> log( key, 'pxy deleteProperty', {arguments}); Reflect.deleteProperty arguments...
            getPrototypeOf  = -> log( key, 'pxy getPrototypeOf', {arguments}); Reflect.getPrototypeOf arguments...
            has             = -> log( key, 'pxy has', {arguments}); Reflect.has arguments...
            isExtensible    = -> log( key, 'pxy isExtensible', {arguments}); Reflect.isExtensible arguments...
            ownKeys         = -> log( key, 'pxy ownKeys', {arguments}); Reflect.ownKeys arguments...
            set             = -> log( key, 'pxy set', {arguments}); Reflect.set arguments...
            setPrototypeOf  = -> log( key, 'pxy setPrototypeOf', {arguments}); Reflect.setPrototypeOf arguments...
            preventExtensions = -> log( key, 'pxy preventExtensions', {arguments}); Reflect.preventExtensions arguments...
            getOwnPropertyDescriptor = -> log( key, 'pxy getOwnPropertyDescriptor', {arguments}); Reflect.getOwnPropertyDescriptor arguments...

            apply           = ->
                @seqindex = -1 + sequence.push 0

                sequence[ @seqindex ] = {
                    kind: "arguments",
                    value: arguments[2],
                    origin: key
                }

                return 1

            get             = ->
                value = arguments[1]

                if  typeof value is "string"
                    if  value.match /seqindex|key/
                        return @[value]

                if  origin and origin.seqindex
                    origin = sequence[origin.seqindex]

                seqindex = @seqindex =
                    ( -1 + sequence.push 0 )

                if  arguments[1] is Symbol.toPrimitive
                    value = @key

                    sequence[ seqindex ] =
                        { kind, origin, value }

                    return -> 1

                sequence[ seqindex ] =
                    { kind, origin, value }

                1

            @proxy = new Proxy Function::, {
                key, apply, construct, defineProperty, deleteProperty, 
                get, getPrototypeOf, has, isExtensible, ownKeys, 
                set, setPrototypeOf, preventExtensions, getOwnPropertyDescriptor
            }
        

        parseAlias  : ->
            [ @key, ...@parts ] = @alias
            .split( /\//g ).at(-1).split( /\./g )
            .map (v) -> v.match(/\w+/g).join("_")

        [ Symbol.toPrimitive ] : ->
            1


    shell =
        emit            : emit = ( type, detail ) ->
            window.dispatchEvent new CustomEvent type, { detail }; detail

        commands        : {}

        fs              : null

        tmpdefs         : []

        fsindex         : []

        registerStorage : ( fsroot ) ->
            @fsroot = fsroot

        ls              : ( path = "/" ) ->
            if path is "/"
                return [ { name: "/lib", kind: "directory" }, { name: "/file.extension", kind: "file" } ]
            
            if path is "/lib"
                return [ { name: "/css", kind: "directory" }, { name: "/statik", kind: "directory" } ]

            if path is "/statik"
                return [ { name: "/file.l+i_ke.dir", kind: "directory" }, { name: "test.coff.ee", kind: "file" } ]

            []

        # evnt: shellcommandregister
        registerCommand : ( cmd, args, handler ) ->
            log event = "command register request:" + arguments[0]


            any = "file.l+i._ke.dir"

            [ globalKey, ...subparts , lastpart ] = parts = any
            .split( /\//g ).at(-1).split( /\./g )
            .map (v) -> v.match(/\w+/g).join("_")

            plen = parts.length
            p = -1
            o = null

            since = []
            sequence = []

            while ++p < plen
                part = parts[p]
                isLast = p is plen - 1
                isFirst = p < 1
                since.push part

                if !isFirst
                    o.prev = 
                    prev = o

                o = {
                    part, isLast, isFirst,
                    key : any, 
                    isCompleted : isLast
                    since : since.join "."
                }

                n = (m, w = [], seqindex = sequence.length ) ->
                    w.push m
                    log "non member getter", [ w.join "." ]
                    sequence[seqindex] = w.join "."

                    new Proxy Function::,
                        apply : ->
                            warn "break chain, call"
                            sequence[seqindex] = w.join "."
                            n(k, w, seqindex)

                        get : (r, k) ->

                            if  typeof k is "symbol"
                                warn "break chain symbol", [ w.join "." ]
                                sequence[seqindex] = w.join "."
                                return -> 1
                            n(k, w, seqindex)                    

                f = (j, seqreset, seqindex = sequence.length) -> ->
                    if  seqreset
                        clearTimeout self.t0
                        self.t0 = setTimeout ->
                            log sequence.slice()
                            sequence.length = 0
                        , 100

                    log {k:j.part}, {j}

                    if  j.isLast
                        warn "complete chain", [ j.since ]
                        sequence[seqindex] = j.since

                    proto = Function::

                    proxy = new Proxy proto,

                        apply : ->
                            warn "break chain, call"
                            sequence.push "(#{arguments[2]})"

                        get : (r, k) ->

                            if  typeof k is "symbol"
                                warn "break chain symbol", [j.since]
                                sequence[seqindex] = j.since
                                return -> 2

                            if  Object.hasOwn j,  k
                                return j[k]

                            if  Object.hasOwn r,  k
                                return r[k]

                            w = []
                            if !j.isCompleted
                                w.push j.since

                            n(k, w)

                    proxy

                if !isFirst
                    Object.defineProperty prev, part, get : f(o)

                if  isFirst
                    Object.defineProperty __proto__, part, get : f(o, on)

                #if  isLast
                    #Object.defineProperty __proto__, [ ...parts, "FASTGET" ].join("_"), get : -> f(o)()

                log o


            return

            warn {
                globalKey, lastpart
            }, "subparts:", subparts

            pxychaindone = new Proxy Function::, {
                apply : ->
                    log "chain done with fn"
                    1

                get   : ( fn, key ) ->
                    log "chain done with get"
                    
                    if  typeof key is "symbol"
                        log "                     -> symbol", key
                        return -> 1

                    log "                     -> other", key

            }

            pxyglobalKey =  new Proxy Function::, {
                apply : ->
                    debug "chain starts with fn", this, arguments
                    1

                get   : ( fn, key ) ->
                    log "chain starts with get"
                    
                    if  typeof key is "symbol"
                        log "                     -> symbol", key
                        return -> 1

                    log "                     -> other", key

            }

            warn "\npxychaindone:", pxychaindone, "\npxyglobalKey:", pxyglobalKey

            Object.defineProperty __proto__, globalKey, get : -> pxyglobalKey

            return 2

            callwait = 0
            sequence = []
            commands = @commands
            tempdefs = []

            commands[ cmd ] =
                { cmd, args, handler }

            proxy    = ( key, kind, origin ) ->

                construct       = -> log( key, 'pxy construct', {arguments}); Reflect.construct arguments...
                defineProperty  = -> log( key, 'pxy defineProperty', {arguments}); Reflect.defineProperty arguments...
                deleteProperty  = -> log( key, 'pxy deleteProperty', {arguments}); Reflect.deleteProperty arguments...
                getPrototypeOf  = -> log( key, 'pxy getPrototypeOf', {arguments}); Reflect.getPrototypeOf arguments...
                has             = -> log( key, 'pxy has', {arguments}); Reflect.has arguments...
                isExtensible    = -> log( key, 'pxy isExtensible', {arguments}); Reflect.isExtensible arguments...
                ownKeys         = -> log( key, 'pxy ownKeys', {arguments}); Reflect.ownKeys arguments...
                set             = -> log( key, 'pxy set', {arguments}); Reflect.set arguments...
                setPrototypeOf  = -> log( key, 'pxy setPrototypeOf', {arguments}); Reflect.setPrototypeOf arguments...
                preventExtensions = -> log( key, 'pxy preventExtensions', {arguments}); Reflect.preventExtensions arguments...
                getOwnPropertyDescriptor = -> log( key, 'pxy getOwnPropertyDescriptor', {arguments}); Reflect.getOwnPropertyDescriptor arguments...

                apply           = ->
                    @seqindex = -1 + sequence.push 0

                    sequence[ @seqindex ] = {
                        kind: "arguments",
                        value: arguments[2],
                        origin: key
                    }

                    return 1

                get             = ->
                    value = arguments[1]

                    if  typeof value is "string"
                        if  value.match /seqindex|key/
                            return @[value]

                    if  origin and origin.seqindex
                        origin = sequence[origin.seqindex]

                    seqindex = @seqindex =
                        ( -1 + sequence.push 0 )

                    if  arguments[1] is Symbol.toPrimitive
                        value = @key

                        sequence[ seqindex ] =
                            { kind, origin, value }

                        return -> 1
    
                    sequence[ seqindex ] =
                        { kind, origin, value }

                    1

                new Proxy Function::, {
                    key, apply, construct, defineProperty, deleteProperty, 
                    get, getPrototypeOf, has, isExtensible, ownKeys, 
                    set, setPrototypeOf, preventExtensions, getOwnPropertyDescriptor
                }
            
            dirdef   = ( fsitem, parent, origin ) =>


                dotparts = fsitem.name
                .split( /\//g ).at(-1).split( /\./g )
                .map (v) -> v.match(/\w+/g).join("_")

                [ defname ] = dotparts.splice 0, 1

                if  __proto__[defname]
                    warn __proto__[defname]

                if  tempdefs.includes defname
                    error "already defined:", defname

                    return

                tempdefs.push defname                    

                get  = =>
                    log "defining sub items of", fsitem.name, { arguments }
                    pxy = proxy defname, "fsitempart", origin

                    if  fsitem.kind is "directory"
                        for subitem in @ls fsitem.name
                            dirdef subitem, fsitem, pxy

                    pxy
                        

                Object.defineProperty __proto__, defname,
                { configurable : on, get }

            argdef   = ( arg ) =>
                if  tempdefs.includes arg
                    return

                tempdefs.push arg                    

                get  = =>
                    log "window getter called for ", arg, { arguments }
                    proxy arg, "argument"

                Object.defineProperty __proto__, arg,
                { configurable : on, get }

            handle   = ->
                if !sequence.length
                    log "command executed", arguments[ 0 ]

                    { cmd, args, handler } =
                        arguments[ 0 ]

                    args.forEach argdef.bind this

                    for fsitem in @ls()
                        dirdef fsitem, "/"

                    clearTimeout callwait

                    callwait = setTimeout ->
                        debug sequence
                        #todo sequence.length = 0
                    , 40  
                    
                sequence.push { value: cmd, kind: "command" }
                
            Object.defineProperty __proto__, cmd,
                get : handle.bind this, commands[cmd]

            emit "shellcommandregister", cmd


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

    mkdir   = ( dirName, handle = currentDir ) ->
        if  dir = await handle.getDirectoryHandle( dirName, { create: true } )
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
                        
        shell.registerCommand "ls", [ "l", "f" ], ( sequence ) ->
            error [ ...sequence ]


    self.onclick = ->

        log handle = await pick( "dir" )
        log await ls handle

        if  handle instanceof FileSystemHandle
            await mv handle, currentDir
    
    
    terminalify = ->

        trapArguments = ( args, list ) ->

            getter = ->
                if  arguments[1] is Symbol.toPrimitive
                    return -> trap.primitived++ ; 1

                args.push arguments[1]
                trap.proxied++

                new Proxy {}, { get: getter }

            parameters = {}
            for parameter in list
                parameters[ parameter ] =
                    configurable: on, get : getter.bind null, null, parameter

            for k of parameters
                Object.defineProperty window, k, parameters[k]

            queueMicrotask ->
                for k of parameters
                    Reflect.deleteProperty window, k

            args


        trap = []
        trap.primitived = 0
        trap.proxied = 0
        a = 0
        cmd = null
        get = ->
            if  this instanceof String
                cmda = this + ""
                [ cmd, ...args ] = cmda.split( " " )
                trap = []
                trap.primitived = 0
                trap.proxied = 0
                trapArguments trap, args.map (a) -> a.replace /\-/, ""

            else

                clearTimeout(a)

                a = setTimeout( ->
    
                    ###
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
                    ###
    
                    window[cmd] = trap
                , 30 )
            
            if  arguments[1] is Symbol.toPrimitive
                return -> trap.primitived++ ; 1

            if  arguments[1]
                trap.push arguments[1]

            trap.proxied++
            new Proxy {
                dhcp : 1
            }, { get }

        self.trap = trap

        Object.defineProperties window,

            rm :
                get  : get.bind "rm -r -f"
                set  : ( args ) ->
                    
                    recursive = args.includes "r"
                    force = args.includes "f"
                    fdname = args.filter(
                        (a) -> !["r", "f"].includes a
                    ).join "."

                    await rm fdname, force, recursive

            cd  :
                set : ->
                    log "cd.."

                get : ->
                    trapArguments args = [], "up"

                    pxy = new Proxy {}, {
                        get : ( o, key ) ->
                            switch true
                                when (key is Symbol.toPrimitive)
                                    return -> args.push ".." ; 0
                                when ("string" is typeof key)
                                    args.push key ; 0
                    }
                    
                    queueMicrotask ->

                        if  -1 isnt up = args.indexOf "up"
                            args.splice up, 1

                        if  args[0] is ".."
                            return warn /NOT_IMPLEMENTED_YET/

                        await cd args[0]

                    pxy

            cat :
                get  : get.bind "cat"
                set  : ( args ) ->
                    log await cat args.join "."

            ls  : 
                get  : get.bind "ls -l"
                set  : ( args ) ->

                    warn 3

                    dir = args.filter(
                        (a) -> !["l"].includes a
                    ).join ""
                    
                    lines = []
                    dirCount = 0
                    fileCount = 0
                    byteLength = 0

                    for item in await ls dir

                        if  "file" is item.kind
                            {size, type, lastModifiedDate} =
                                await read item

                            _date =
                                lastModifiedDate
                                    .toDateString().split(" ")
                                    .slice(1).slice(0,2)
                                    .join(" ") + " " +
                                lastModifiedDate
                                    .toTimeString().substring(0,5)

                            byteLength += size
                            fileCount++

                        else
                            [size, type] = [0, 0]
                            _date = "".padEnd 16, " "
                            dirCount++

                        if  "directory" is item.kind
                            lines.push [ "dir", "\t", "\t", _date, " ", item.name ]
                            continue

                        if !size
                            lines.push [ "file", "\t", 0, "\t\t", _date, " ", item.name ]
                        else
                            lines.push [ "file", "\t", size, "\t", _date, " ", item.name ]

                    kB = (byteLength/1e3).toFixed(1) * 1

                    console.group "path:", [ await resolv dir ]
                    console.warn "total:", kB, "kBytes"
                    lines.reverse().forEach (l) ->
                        console.log l...
                    console.groupEnd cwd

            mv : 
                get : ->
                    istenenler = []
                    level0 = []

                    for indeks in self.indexler
                        isim = indeks.split( /\/|\./, 2 )[1]
                        if !level0.includes isim
                            level0.push isim

                    for tanim in level0
                        Object.defineProperty( window, tanim, ( (isim)->
                            configurable : on
                            get : ->
                                istenenler.push isim
                                log "istendi:", isim, 0

                                level1 = []
                                self.indexler
                                    .filter( (i) -> i.startsWith("/#{isim}") and (i isnt "/#{isim}"))
                                    .map( (i) -> i.substring( "/#{isim}".length ))
                                    .forEach (i) ->
                                        isim1 = i.split( /\/|\./, 2 )[1]
                                        if !level1.includes isim1
                                            level1.push isim1
        

                                for tanim1 in level1
                                    Object.defineProperty( window, tanim1, ( (isim1)->
                                        configurable : on
                                        get : ->
                                            istenenler.push isim1
                                            log "istendi:".padStart(10 + istenenler.length * 2, " "), isim1, 1


                                            #? -----> level 2

                                            level2 = []
                                            self.indexler
                                                .filter( (i) -> i.startsWith("/#{isim}") and i.includes(isim1) )
                                                .map( (i) -> i.substring( "/#{isim + '/' + isim1}".length ) )
                                                .forEach (i) ->
                                                    isim2 = i.split( /\/|\./, 2 )[1]
                                                    if !level2.includes isim2
                                                        level2.push isim2 if isim2
                    
                                                level2
            
                                            for tanim2 in level2
                                                Object.defineProperty( window, tanim2, ( (isim2)->
                                                    configurable : on
                                                    get : ->
                                                        istenenler.push isim2
                                                        log "istendi:".padStart(10 + istenenler.length * 2, " "), isim2, 2
                                                        new Proxy {}, get : ->
                                                            if typeof arguments[1] isnt "symbol"
                                                                istenenler.push arguments[1]
                                                                warn "  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]; 
                                                            ->
                                                )( tanim2 ))
            

                                            #? <----- level 2


                                            new Proxy {}, get : ->
                                                if typeof arguments[1] isnt "symbol"
                                                    istenenler.push arguments[1]
                                                    warn "  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]; 
                                                ->

                                    )( tanim1 ))


                                new Proxy {}, get : ->
                                    if typeof arguments[1] isnt "symbol"
                                        istenenler.push arguments[1]
                                        warn "  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]; 
                                    ->

                        )( tanim ))

                    new Proxy {}, get : ->
                        if typeof arguments[1] isnt "symbol"
                            istenenler.push arguments[1]
                            warn "  istendi:".padStart(10 + istenenler.length * 2 - 2, " "), arguments[1]; 
                        -> 


    do init


    # update shell's fsindex
    window.addEventListener "storagcwdupdate", ({ detail: handle }) ->

        return

        dPath = await resolv handle

        if !shell.fsindex.includes dPath
            shell.fsindex.push dPath, handle

        for iHandle in await ls handle
            iPath = await resolv iHandle

            if !shell.fsindex.includes iPath
                shell.fsindex.push iPath, iHandle

        log "storagcwdupdate:", shell.fsindex.length

        for v, i in shell.fsindex
            continue if !i or i % 2

            log "defining:", v
            parts = v.split("/").filter(Boolean)
            #log "-> parts:", parts

            for p, j in parts
                #log "---> defining:", p
                words = p.split( /\.|\+/g ).filter(Boolean)
                #log "----> words:", words

                parent = null
                for w, k in words 

                    if !k
                        #log "\n+++++> global word:", new RegExp w
                        
                        has = Object.hasOwn window, w
                        #log "\t   hasown window:", has

                        if !has
                            ((o, w) -> Object.defineProperty( window, w, get : ->
                                #log "getted:", w, o
                                o
                            ))({ paths: [], word: w }, w)

                        if !window[w].paths.includes v
                            window[w].paths.push v

                        parent = window[w]
                        continue
                        
                    continue
                        

                    if !has = Object.hasOwn parent, w

                        pfix = "".padStart k * 2, " "
                        log pfix + "  +++> inner get:", w
                        
                        log pfix + "  +++> has own parent:", has

                        ((o, w, isLast) -> Object.defineProperty( parent, w, get : ->
                            log "getted:", w, o, {isLast}

                            pxy = ( o, v, isLast ) ->
                                get : ->
                                    if  isLast
                                        warn "last item getter of:", o

                                        if  o.paths.length is 1
                                            warn " --> exact match of:", o.paths.at 0

                                    if  arguments[1] is Symbol.toPrimitive
                                        return -> 1
        
                                    Reflect.get arguments...

                                apply : ->
                                    Reflect.apply arguments...

                            new Proxy o, pxy o, v, isLast

                        ))({ paths : [], word: w }, w, k is words.length-1)

                    if !parent[w].paths.includes v
                        parent[w].paths.push v

                    parent = parent[w]



        shell.workingDir = handle

    # cleaning window object
    window.addEventListener "storageroothandle", ({ detail: fsroot }) ->

        shell.fsroot = fsroot

        
        return 1

        setTimeout =>
            await cd "lib"
        , 2000

        d = Object.getOwnPropertyDescriptors
        p = Object.getPrototypeOf
        k = Object.keys
        o = Object
        r = Reflect

        clean = (a) ->

            return unless a

            if /location|window|self|console/.test a.constructor.name or a.name
                return

            try for _k, v of d _ = a.__proto__
                r.deleteProperty _, _k

            try for _k, v of d _ = p a.constructor
                r.deleteProperty _, _k

            try for _k, v of d _ = a.constructor
                r.deleteProperty _, _k
                
            try for _k, v of d _ = p a
                r.deleteProperty _, _k

            try for _k, v of d _ = a
                r.deleteProperty _, _k
                
        if  window.chrome?
            Object.defineProperty window, "chrome", value: "tru 💚 th"
            Object.defineProperty __proto__, "values", value: -> []
            Object.defineProperty __proto__, "debug", value: -> []
            Object.defineProperty __proto__, "undebug", value: -> []
            Object.defineProperty __proto__, "queryObjects", value: -> []

            if  unmonitorEvents?
                unmonitorEvents window

        try clean window


    do self.dbg = -> -> 
        requestIdleCallback -> requestAnimationFrame ->
            groupEnd group(
                "fs:", "state:", state(),
                "persisted:", state() >= STATE_PERSISTED_HANDLE,
                "status:", status(),
                "quota:", quota(),
                "usage:", usage(),
                "written:", written(),
                "readed:", readed()
            )