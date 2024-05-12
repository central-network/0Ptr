var log, root, warn;

self.name = "window";

root = null;

log = console.log;

warn = console.warn;

/*
self.init   = ->

    isWindow = !DedicatedWorkerGlobalScope?
    isThread = isWindow is false

    pipe = new BroadcastChannel "3dtr"
    log = -> console.log name, ...arguments
    warn = -> console.warn name, ...arguments
    error = -> console.error name, ...arguments
    number = -> arguments[0].split("").reduce (a,b) ->
        ( b.charCodeAt() + ( a.charCodeAt?() or a ) )

    Object.defineProperties Object, 
        deleteProperty : value : ( target, prop ) ->
            Reflect.defineProperty target, prop, value:0
            Reflect.deleteProperty target, prop; target;

        deleteProperties : value : ( target, props = [] ) ->
            @deleteProperty target, p for p in props; target

    Symbol.pointer = "|[Pointer]|"

    threadId = null
    gl = null
    uuid = null
    workers = []

    i32 = null
    ui8 = null
    f32 = null
    u32 = null
    dvw = null

    buffer = null
    space = null
    draws = []

    scripts = null
    program = null
    vShader = null
    fShader = null
    gBuffer = null
    shaders = []
    defines = {}
    classes = []
    buffers = []

    textEncoder = new TextEncoder()
    textDecoder = new TextDecoder()

    classes.register = ( Class ) ->
        if -1 is i = @indexOf Class
            i += @push Class 
        Class.classIndex = i

    classes.global = ( Class ) ->

        handler = ->
            unless isNaN arguments[0]
                return new Class arguments...
            return Class.create arguments...

        Object.defineProperties handler,
            allocs      : value : Pointer.allocs
            classIndex  : value : @register Class
            BPE         : value : Class.BPE

        self[ Class.name ] = handler

    shaders.register = ( WebGLObject ) ->
        unless @includes WebGLObject
            @push WebGLObject 
        @indexOf WebGLObject

    buffers.register = ( WebGLObject ) ->
        unless @includes WebGLObject
            @push WebGLObject 
        @indexOf WebGLObject

    ticks = 0
    frustrum = null

    ITERATION_PER_THREAD = 2
    RADIANS_PER_DEGREE  = Math.PI / 180.0
    BPE = 4
    LE = !!(new Uint8Array( Uint16Array.of(1).buffer ).at(0))

    THREADS_STATE   = 5
    THREADS_BEGIN   = 6
    THREADS_COUNT   = 2 or navigator?.hardwareConcurrency

    INNER_WIDTH     = innerWidth ? 640
    INNER_HEIGHT    = innerHeight ? 480
    RATIO_PIXEL     = devicePixelRatio ? 1
    RATIO_ASPECT    = INNER_WIDTH / INNER_HEIGHT 

    STATE_READY     = 1
    STATE_LOCKED    = 0
    STATE_WORKING   = 3
    STATE_UNLOCKED  = 4

    THREADS_NULL    = 1
    THREADS_READY   = 2

    OFFSET_GPU          = 1000 * 16
    OFFSET_CPU          = 4096 * 4096
    OFFSET_PTR          = 24
    BYTELENGTH_GLBUFFER = 32 * 1e5

    PTR_LENGTH       = 0
    PTR_BYTEOFFSET   = PTR_LENGTH++ #! must be 0
    PTR_BYTELENGTH   = PTR_LENGTH++
    PTR_CLASSID      = PTR_LENGTH++

    PTR_PARENT       = PTR_LENGTH++
    PTR_BEGIN        = PTR_LENGTH++

    PTR_ISGL         = PTR_LENGTH++
    PTR_UPDATED      = PTR_LENGTH++
    PTR_PAINTED      = PTR_LENGTH++
    PTR_LOCATED      = PTR_LENGTH++

    PTR_ITER_COUNT   = PTR_LENGTH++
    PTR_NEXT_COLORI  = PTR_LENGTH++
    PTR_NEXT_VERTEXI = PTR_LENGTH++

    PTR_RESV0        = PTR_LENGTH++
    PTR_RESV1        = PTR_LENGTH++

    ATTRIBS_LENGTH      = 0
    ATTRIBS_BYTELENGTH  = 0

    BYTELENGTH_128MB    = 512 * 512 * 512

    HEADER_BYTELENGTH   =  0

    HEADER_BYTEOFFSET   =  0; HEADER_BYTELENGTH++ #? 0
    HEADER_BYTELENGTH   =  1; HEADER_BYTELENGTH++ #? 1
    HEADER_LENGTH       =  2; HEADER_BYTELENGTH++ #? 2
    HEADER_BEGIN        =  3; HEADER_BYTELENGTH++ #? 3

    HEADER_CLASSINDEX   =  4; HEADER_BYTELENGTH++ #? 4
    HEADER_PARENTPTRI   =  5; HEADER_BYTELENGTH++ #? 5
    HEADER_LINKEDPTRI   =  6; HEADER_BYTELENGTH++ #? 7
    HEADER_ITEROFFSET   =  7; HEADER_BYTELENGTH++ #? 6

    HEADER_ITERATORI    =  8; HEADER_BYTELENGTH++ #? 32
    HEADER_ITERCLASSI   =  9; HEADER_BYTELENGTH++ #? 32

    HEADER_NEEDRECALC   =  10 * 4    ; HEADER_BYTELENGTH++ #? 32
    HEADER_NEEDUPLOAD   =  10 * 4 + 1; #* ptri * 4 + HEADER_NEEDUPLOAD
    HEADER_TRANSLATED   =  10 * 4 + 2; #* ptri * 4 + HEADER_CALCVERTEX
    HEADER_FRAGMENTED   =  10 * 4 + 3; #* ptri * 4 + HEADER_PAINTCOLOR

    HEADER_RESVINDEX    =  12; HEADER_BYTELENGTH++ #? 9 
    HEADER_RESVINDEX4   =  HEADER_RESVINDEX;  
    HEADER_RESVINDEX2   =  HEADER_RESVINDEX * 2; #* ptri * 2 + HEADER_RESVINDEX2
    HEADER_RESVINDEX1   =  HEADER_RESVINDEX * 4; #* ptri * 4 + HEADER_RESVINDEX1

    if  HEADER_BYTELENGTH > 32
        throw /HEADER_BYTELENGTH/

    HEADER_BYTELENGTH   = 32

    self.mallocs        =

    mallocs             = ( ptri = HEADER_BYTELENGTH ) ->
        while ptr = getPointer ptri
            ptri += HEADER_BYTELENGTH ; ptr

    getByteOffset       = ( ptri ) -> 
        u32.at( ptri )

    setByteOffset       = ( ptri, byteOffset ) -> 
        dvw.setUint32 ptri * 4, byteOffset, LE ; byteOffset

    getByteLength       = ( ptri ) -> 
        u32[ HEADER_BYTELENGTH + ptri ]

    setByteLength       = ( ptri, byteLength ) -> 
        u32[ HEADER_BYTELENGTH + ptri ] = byteLength

    getLength           = ( ptri ) -> 
        u32[ HEADER_LENGTH + ptri ]

    setLength           = ( ptri, length ) -> 
        u32[ HEADER_LENGTH + ptri ] = length

    getBegin            = ( ptri ) -> 
        u32[ HEADER_BEGIN + ptri ]

    getIndex            = ( ptri, index = 0 ) -> 
        u32[ HEADER_BEGIN + ptri ] + index

    setBegin            = ( ptri, begin ) -> 
        u32[ HEADER_BEGIN + ptri ] = begin

    getClassIndex       = ( ptri ) -> 
        u32[ HEADER_CLASSINDEX + ptri ]

    setClassIndex       = ( ptri, clsi ) -> 
        u32[ HEADER_CLASSINDEX + ptri ] = clsi

    getPointer          = ( ptri ) ->
        if  clsi = u32[ HEADER_CLASSINDEX + ptri ]
            return new (classes[ clsi ]) ptri
        undefined

    getClass            = ( ptri ) -> 
        classes[ u32[ HEADER_CLASSINDEX + ptri ] ]

    getParentPtri       = ( ptri ) -> 
        u32[ HEADER_PARENTPTRI + ptri ]

    getLinkedPtri       = ( ptri ) -> 
        u32[ HEADER_LINKEDPTRI + ptri ]

    setLinkedPtri       = ( ptri, ptrj ) -> 
        u32[ HEADER_LINKEDPTRI + ptri ] = ptrj

    setParent           = ( ptri, ptrj ) ->
        u32[ HEADER_PARENTPTRI + ptri ] = ptrj

    setLinked           = ( ptri, ptrj ) ->
        u32[ HEADER_LINKEDPTRI + ptri ] = ptrj

    getObject           = ( ptri ) ->
        ptri.storage[ u32[ HEADER_LINKEDPTRI + ptri ] ]

    setObject           = ( ptri, object ) ->
        u32[ HEADER_LINKEDPTRI + ptri ] = ptri.store object

    getParent           = ( ptri ) -> 
        return unless ptrj = u32[ HEADER_PARENTPTRI + ptri ] 
        Class = classes[ u32[ HEADER_CLASSINDEX + ptrj ] ]
        return new Class ptrj

    getLinked           = ( ptri ) ->
        return unless ptrj = u32[ HEADER_LINKEDPTRI + ptri ] 
        Class = classes[ u32[ HEADER_CLASSINDEX + ptrj ] ]
        return new Class ptrj

    findLinkeds         = ( ptri, Class ) ->
        ptrj = u32[1]
        clsi = Class.classIndex
        list = new Array() ; i = 0

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_LINKEDPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i++ ] = new ( classes[ clsi ] ) ptrj 

        list

    getChilds           = ( ptri, Class ) -> 
        ptrj = u32[1]
        list = new Array() ; i = 0

        if  Class
            clsi = Class.classIndex
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
                Class = classes[ u32[ HEADER_CLASSINDEX + ptrj ] ]
                list[ i++ ] = new Class ptrj

        else
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                Class = classes[ u32[ HEADER_CLASSINDEX + ptrj ] ]
                list[ i++ ] = new Class ptrj

        list

    getChildsPtri       = ( ptri, Class ) -> 
        ptrj = u32[1]
        list = new Array() ; i = 0

        if  Class
            clsi = Class.classIndex
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
                list[ i++ ] = ptrj

        else
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                list[ i++ ] = ptrj

        list

    getChildsCount      = ( ptri, clsi ) -> 
        ptrj = u32[1]
        i = 0

        if  clsi
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
                i++

        else
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                i++

        i

    prepareIterator     = ( Class, ptri = 0 ) ->
        Atomics.store u32, ptri + HEADER_ITERCLASSI, Class.classIndex if Class
        Atomics.compareExchange u32, ptri + HEADER_ITERATORI, 0, u32.at 1
        +ptri

    finalizeIterator    = ( iter ) ->
        Atomics.store u32, iter + HEADER_ITERCLASSI, 0
        Atomics.store u32, iter + HEADER_ITERATORI, 0
        0

    iterateGlobalAllocs = ( ptri ) ->
        clsi = Atomics.load u32, ptri + HEADER_ITERCLASSI
        ptrj = Atomics.sub u32, ptri + HEADER_ITERATORI, HEADER_BYTELENGTH

        if  ptrj is ptri
            return iteratePrepared ptri

        if !ptrj or u32[1] < ptrj
            return finalizeIterator ptri

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            next = ptrj - HEADER_BYTELENGTH

            if  next isnt Atomics.compareExchange u32, ptri + HEADER_ITERATORI, ptrj, next
                Atomics.store u32, ptri + HEADER_ITERATORI, ptrj
                Class = classes[ clsi ]
                return new Class ptrj

        0

    iteratePrepared     = ( ptri ) -> 
        clsi = Atomics.load u32, ptri + HEADER_ITERCLASSI
        ptrj = Atomics.sub u32, ptri + HEADER_ITERATORI, HEADER_BYTELENGTH

        if  ptrj is ptri
            return iteratePrepared ptri

        if !ptrj or u32[1] < ptrj
            return finalizeIterator ptri

        if  clsi
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi

                next = ptrj - HEADER_BYTELENGTH
                if  next isnt Atomics.compareExchange u32, ptri + HEADER_ITERATORI, ptrj, next
                    Atomics.store u32, ptri + HEADER_ITERATORI, ptrj
                    Class = classes[ clsi ]
                    return new Class ptrj

        else
            while ptrj -= HEADER_BYTELENGTH
                continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
                next = ptrj - HEADER_BYTELENGTH

                if  next isnt Atomics.compareExchange u32, ptri + HEADER_ITERATORI, ptrj, next
                    Atomics.store u32, ptri + HEADER_ITERATORI, ptrj
                    Class = classes[ u32[ HEADER_CLASSINDEX + ptrj ] ]
                    return new Class ptrj

        0

    findChilds          = ( ptri, Class ) -> 
        ptrj = u32[1]
        clsi = Class.classIndex
        list = new Array() ; i = 0

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i ] = new ( classes[ clsi ] )( ptrj ) ; ++i

        list

    findChild           = ( ptri, Class, create = off ) -> 
        ptrj = u32[1]
        clsi = Class.classIndex

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            return new ( classes[ clsi ] )( ptrj )

        return unless create

        setParent obj = new Class, ptri ; obj

    inherit             = ( ptri, Class ) ->
        ptrj = u32[1]
        clsi = Class.classIndex

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            return new Class ptrj

        if !ptri = u32[ HEADER_PARENTPTRI + ptri ]
            return undefined

        inherit ptri, Class

    findChildRecursive  = ( ptri, Class, clsi ) -> 
        ptrN = u32[1]
        clsi = clsi or Class.classIndex

        ptrj = ptrN
        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi                
            return new Class ptrj

        ptrj = ptrN
        while ptrj -= HEADER_BYTELENGTH 
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue unless ptr = findChildRecursive ptrj, Class, clsi
            return ptr

        undefined

    findChildsRecursive = ( ptri, Class, clsi, childs = [] ) -> 
        ptrN = u32[1]
        clsi = clsi or Class.classIndex

        ptrj = ptrN
        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi                
            childs.push new Class ptrj

        ptrj = ptrN
        while ptrj -= HEADER_BYTELENGTH 
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue unless ptr = findChildsRecursive ptrj, Class, clsi, childs
            childs.push ptr

        childs

    findChildsPtri      = ( ptri, Class ) -> 
        ptrj = u32[1]
        clsi = Class.classIndex
        list = new Array() ; i = 0

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i ] = ptrj ; i++

        list

    getAllocs           = ( ptri ) ->
        clsi = ptri.classIndex
        ptrj = u32[1]
        list = new Array() ; i = 0

        while ptrj -= HEADER_BYTELENGTH
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i ] = new ( classes[ clsi ] )( ptrj ) ; i+=1

        list

    getIterOffset       = ( ptri       ) ->
        u32[ HEADER_ITEROFFSET + ptri ]

    setIterOffset       = ( ptri, v    ) -> 
        u32[ HEADER_ITEROFFSET + ptri ] = v

    hitIterOffset       = ( ptri, count = ITERATION_PER_THREAD ) -> 
        Atomics.add u32, ptri + HEADER_ITEROFFSET, count

    getNeedRecalc       = ( ptri       ) -> 
        ui8[ HEADER_NEEDRECALC + ptri * 4 ]

    setNeedRecalc       = ( ptri, v    ) -> 
        ui8[ HEADER_NEEDRECALC + ptri * 4 ] = v

    hitNeedRecalc       = ( ptri       ) -> 
        Atomics.and ui8, HEADER_NEEDRECALC + ptri * 4, 0

    getNeedUpload       = ( ptri       ) -> 
        ui8[ HEADER_NEEDUPLOAD + ptri * 4 ]

    setNeedUpload       = ( ptri, v    ) -> 
        ui8[ HEADER_NEEDUPLOAD + ptri * 4 ] = v

    hitNeedUpload       = ( ptri       ) -> 
        Atomics.and ui8, HEADER_NEEDUPLOAD + ptri * 4, 0

    getTranslated       = ( ptri       ) -> 
        ui8[ HEADER_TRANSLATED + ptri * 4 ]

    setTranslated       = ( ptri, v    ) -> 
        ui8[ HEADER_TRANSLATED + ptri * 4 ] = v

    hitTranslated       = ( ptri       ) -> 
        Atomics.and ui8, HEADER_TRANSLATED + ptri * 4, 0

    getFragmented       = ( ptri       ) -> 
        ui8[ HEADER_FRAGMENTED + ptri * 4 ]

    setFragmented       = ( ptri, v    ) -> 
        ui8[ HEADER_FRAGMENTED + ptri * 4 ] = v

    hitFragmented       = ( ptri       ) -> 
        Atomics.and ui8, HEADER_FRAGMENTED + ptri * 4, 0

    getResvUint32       = ( ptri, i    ) -> 
        index = i + ( HEADER_RESVINDEX + ptri )
        u32[ index ]

    setResvUint32       = ( ptri, i, v ) -> 
        index = i + ( HEADER_RESVINDEX + ptri )
        u32[ index ] = v

    addResvUint32       = ( ptri, i, v ) -> 
        index = i + ( HEADER_RESVINDEX + ptri )

        value = u32[ index ]
        u32[ index ] = value + v
        value

    getResvUint16       = ( ptri, i    ) ->
        index = i + ( HEADER_RESVINDEX + ptri ) * 2
        u16[ index ]

    setResvUint16       = ( ptri, i, v ) -> 
        index = i + ( HEADER_RESVINDEX + ptri ) * 2
        u16[ index ] = v

    addResvUint16       = ( ptri, i, v ) -> 
        i += ( HEADER_RESVINDEX + ptri ) * 2

        value = u16[ index ]
        u16[ index ] = value + v
        value

    getResvUint8        = ( ptri, i    ) -> 
        i += ( HEADER_RESVINDEX + ptri ) * 4
        dvw.getUint8 i

    setResvUint8        = ( ptri, i, v ) -> 
        i += ( HEADER_RESVINDEX + ptri ) * 4
        dvw.setUint8 i, v ; v

    hitResvUint8        = ( ptri, i = 0 ) -> 
        i += ( HEADER_RESVINDEX + ptri ) * 4

        return 0 if dvw.getUint8 i
        return ui8[ i ] = 1

    addResvUint8        = ( ptri, i, v ) -> 
        i += ( HEADER_RESVINDEX + ptri ) * 4 
        o = dvw.getUint8 i
        dvw.setUint8 i, o + v
        o

    getResvFloat32      = ( ptri, i    ) ->
        i += ( HEADER_RESVINDEX + ptri )

        f32[ i ]

    setResvFloat32      = ( ptri, i, v ) -> 
        i += ( HEADER_RESVINDEX + ptri )

        f32[ i ] = v

    addResvFloat32      = ( ptri, i, v ) -> 
        i += ( HEADER_RESVINDEX + ptri )

        o = f32[ i ]
        f32[ i ] = o + v
        o

    newFloat32Array     = ( ptri, byteOffset = 0, length ) ->
        byteOffset += getByteOffset ptri 
        length ||= getLength ptri

        new Float32Array buffer, byteOffset, length

    ptrFloat32Array     = ( ptri, byteOffset = 0, length ) -> 
        new Float32Array buffer, ptri * 4, length or HEADER_BYTELENGTH

    newUint32Array      = ( ptri, byteOffset = 0, length ) -> 
        new Uint32Array buffer, u32.at( ptri ) + byteOffset, length or u32[ HEADER_LENGTH + ptri ]

    ptrUint32Array      = ( ptri, byteOffset = 0, length ) -> 
        byteOffset += ptri * 4
        new Uint32Array buffer, byteOffset, length

    newUint8Array       = ( ptri, byteOffset = 0, length ) -> 
        new Uint8Array buffer, u32.at( ptri ) + byteOffset, length or u32[ HEADER_LENGTH + ptri ]

    ptrUint8Array       = ( ptri, byteOffset = 0, length ) -> 
        new Uint8Array buffer, ptri * 4, length or HEADER_BYTELENGTH * BPE

    subarrayFloat32     = ( ptri, begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + ptri ]
        f32.subarray( begin, begin + count )

    subarrayUint32      = ( ptri, begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + ptri ]
        u32.subarray( begin, begin + count )

    subarrayUint16      = ( ptri, begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + ptri ] * 2
        u16.subarray( begin, begin + count )

    subarrayUint8       = ( ptri, begin = 0, count ) -> 
        begin += u32.at( ptri )
        ui8.subarray( begin, begin + count )

    detachUint8         = ( ptri, begin = 0, count ) -> 

        begin += u32.at( ptri )
        count or= u32[ ptri + HEADER_BYTELENGTH ]

        array = new Uint8Array count
        array . set ui8.subarray begin, begin + array.length

        array

    setFloat32          = ( ptri, index, value ) ->
        f32[ u32[ HEADER_BEGIN + ptri ] + index ] = value

    getFloat32          = ( ptri, index = 0 ) ->
        f32[ u32[ HEADER_BEGIN + ptri ] + index ]

    orFloat32           = ( ptri, index = 0, fn ) ->
        f32[ u32[ HEADER_BEGIN + ptri ] + index ] ||= fn.call ptri

    fillFloat32         = ( ptri, value, start = 0, count ) ->
        start += u32[ HEADER_BEGIN + ptri ]
        f32.fill value, start, start + count ; ptri

    setarrayFloat32     = ( ptri, array, begin = 0 ) -> 
        f32.set array, begin + u32[ HEADER_BEGIN + ptri ] ; ptri

    addUint32           = ( ptri, index, value ) ->
        u32[ u32[ HEADER_BEGIN + ptri ] + index ] = value + (
            v = u32[ u32[ HEADER_BEGIN + ptri ] + index ]
        ) ; v

    setUint32           = ( ptri, index, value ) -> 
        u32[ u32[ HEADER_BEGIN + ptri ] + index ] = value

    getUint32           = ( ptri, index = 0 ) -> 
        u32[ u32[ HEADER_BEGIN + ptri ] + index ]

    getUint16           = ( ptri, index = 0 ) -> 
        u16[ u32[ HEADER_BEGIN + ptri ] * 2 + index ]

    setUint16           = ( ptri, index, value ) -> 
        u16[ u32[ HEADER_BEGIN + ptri ] * 2 + index ] = value

    setarrayUint16      = ( ptri, array, begin = 0 ) -> 
        u16.set array, begin + u32[ HEADER_BEGIN + ptri ] * 2 ; this

    getUint64           = ( ptri, index = 0 ) -> 
        Number u64[ u32[ HEADER_BEGIN + ptri ] / 2 + index ]

    setUint64           = ( ptri, index = 0, value ) -> 
        Number u64[ u32[ HEADER_BEGIN + ptri ] / 2 + index ] = BigInt value

    orUint32            = ( ptri, index = 0, fn ) -> 
        u32[ u32[ HEADER_BEGIN + ptri ] + index ] ||= fn.call ptri

    fillUint32          = ( ptri, value, start = 0, count ) ->
        start += u32[ HEADER_BEGIN + ptri ]
        u32.fill value, start, start + count ; ptri

    setarrayUint32      = ( ptri, array, begin = 0 ) -> 
        u32.set array, begin + u32[ HEADER_BEGIN + ptri ] ; ptri

    setUint8            = ( ptri, index, value ) -> 
        ui8[ u32.at( ptri ) + index ] = value

    getUint8            = ( ptri, index = 0 ) -> 
        ui8[ u32.at( ptri ) + index ]

    orUint8             = ( ptri, index = 0, fn ) ->
        ui8[ u32.at( ptri ) + index ] ||= fn.call ptri

    fillUint8           = ( ptri, value, start = 0, count ) ->
        start += u32.at( ptri )
        ui8.fill value, start, start + count ; ptri

    setarrayUint8       = ( ptri, array, begin = 0 ) -> 
        ui8.set array, begin + u32.at(ptri) ; ptri

    state       = ( state ) ->
        unless arguments.length
            return Atomics.load i32, threadId
        return Atomics.store i32, threadId, state

    nextTick    = ->
        #log "nextTick:", ++ticks

        ptri = Atomics.load i32, 1
        test = 0

        while OFFSET_PTR <= ptri -= HEADER_BYTELENGTH        
            continue unless Atomics.load i32, ptri + PTR_ISGL
            continue if Atomics.load i32, ptri + PTR_UPDATED

            locate  = Atomics.load i32, ptri + PTR_LOCATED
            paint   = Atomics.load i32, ptri + PTR_PAINTED

            continue if paint and locate

            test = 1

            index   = Atomics.add i32, ptri + PTR_NEXT_VERTEXI, 1
            count   = Atomics.load i32, ptri + PTR_ITER_COUNT

            if  index <= count
                mesh   = new Mesh ptri

                begin   = index * 3
                end     = begin + 3
                vertex  = mesh.vertex index 
                color   = mesh.color

                for draw in mesh.children
                    draw.vertex( index ).set vertex
                    draw.color( index ).set color

                    Atomics.store i32, draw.ptri + PTR_UPDATED, 0

                #log ptri, index 

            continue if index - count

            if !locate
                Atomics.store i32, ptri + PTR_LOCATED, 1

            if !paint
                Atomics.store i32, ptri + PTR_PAINTED, 1

            Atomics.store i32, ptri + PTR_UPDATED, 1

        if  test is 1
            return nextTick()

        lock()
        nextTick()

    lock        = ->
        state STATE_LOCKED
        Atomics.wait i32, threadId

    unlock      = ->
        for w in workers when w.state is STATE_LOCKED
            Atomics.store i32, w.threadId, STATE_READY
            Atomics.notify i32, w.threadId, 1

    if  isWindow
        buffer = new SharedArrayBuffer 1e8
        i32 = new Int32Array buffer 
        u16 = new Uint16Array buffer
        u32 = new Uint32Array buffer
        u64 = new BigUint64Array buffer
        f32 = new Float32Array buffer
        dvw = new DataView buffer
        ui8 = new Uint8Array buffer

        scripts = Array.from document.querySelectorAll "script"

        state = ( state ) ->
            unless state
                return Atomics.load i32, THREADS_STATE
            return Atomics.store i32, THREADS_STATE, state

        Atomics.add u32, 0, HEADER_BYTELENGTH * 1e5
        Atomics.add u32, 1, HEADER_BYTELENGTH

        state THREADS_NULL

    self.emit           = ( event, detail ) ->
        self.dispatchEvent new CustomEvent event, { detail }

    pipe.emit           = ( event, detail ) ->
        @postMessage event

    classes.register class Pointer          extends Number

        @byteLength : 0

        TypedArray  : Float32Array

        @isPtr      : yes

        isPtri      : yes

        @BPE        : BPE

        BPE         : @BPE

        storage     : [,]

        constructor : ->
            super arguments[0] || Atomics.add u32, 1, HEADER_BYTELENGTH
            @init arguments[1] if isWindow

        malloc      : ( byteLength ) ->
            byteOffset = Atomics.add u32, 0, byteLength
            Atomics.add u32, 0, 8 - byteLength % 8

            setBegin        this, byteOffset / @BPE
            setLength       this, byteLength / @BPE
            setByteOffset   this, byteOffset
            setByteLength   this, byteLength

            this

        at          : ( i ) -> switch @TypedArray 
            when  Uint8Array then getUint8  this, i
            when Uint16Array then getUint16 this, i
            when Uint32Array then getUint32 this, i
            else getFloat32 this, i

        init        : ( props ) ->
            if !getClassIndex this
                setClassIndex this, this.constructor.classIndex
                if  byteLength = this.constructor.byteLength
                    @malloc byteLength

            if  props
                for prop, value of props

                    if  @hasOwnProperty prop
                        @[ prop ] = value
                        continue

                    for Class in classes
                        continue unless prop is Class::name
                        @add new Class().set value; break

            this

        set         : ( array = [] ) ->
            unless  byteLength = getByteLength this
                if !byteLength = @constructor.byteLength
                    byteLength = array.length * @BPE

            return this unless byteLength

            @malloc byteLength

            switch @TypedArray 
                when  Uint8Array then setarrayUint8  this, array
                when Uint16Array then setarrayUint16 this, array
                when Uint32Array then setarrayUint32 this, array
                else setarrayFloat32 this, array

            return this

        toString            : ->
            err = {}
            Error.captureStackTrace err
            console.error "toStringCalled", err.stack 
            queueMicrotask -> throw new Error err
            super arguments...

        store       : ( object ) ->
            if -1 is i = @storage.indexOf object
                i += @storage.push object
            i

        add         : ( ptr ) -> setParent ptr, this

        append      : ( ptr ) -> setParent ptr, this ; ptr

        @allocs     : -> getAllocs this

        @create     : -> new this null, arguments...

        [ Symbol.iterator ] : ->

            Class = @constructor.iterate
            iterator = prepareIterator Class, this

            next : ->
                if  next = iteratePrepared iterator
                    return value : next
                return done : 1          

        Object.defineProperties Pointer::,

            childs  : get : ->
                childs = getChilds this

                unless Class = @constructor.iterate then childs
                else childs.filter (ptr) -> ptr instanceof Class

            parent  :
                get : -> getParent this
                set : ( ptri ) -> setParent this, ptri

            buffer  :
                get : -> new this.TypedArray buffer, getByteOffset(this), getLength(this)

        Object.defineProperties Pointer::,
            [ "{[Pointer]}" ] :
                get : -> ptrUint32Array this, 0, HEADER_BYTELENGTH

    classes.register class Vector4          extends Pointer

        @byteLength : 4 * @BPE

        getX : -> getFloat32 this, 0
        getY : -> getFloat32 this, 1
        getZ : -> getFloat32 this, 2
        getW : -> getFloat32 this, 3

        setX : (v) -> setFloat32 this, 0, v
        setY : (v) -> setFloat32 this, 1, v
        setZ : (v) -> setFloat32 this, 2, v
        setW : (v) -> setFloat32 this, 3, v

        [ Symbol.iterator ] : ->
            [ x, y, z, w ] = subarrayFloat32 this, 0 , 4

            ; yield x ; yield y ; yield z ; yield w ;

        Object.defineProperties Vector4::,
            x : get : Vector4::getX , set : Vector4::setX
            y : get : Vector4::getY , set : Vector4::setY
            z : get : Vector4::getZ , set : Vector4::setZ
            w : get : Vector4::getW , set : Vector4::setW

        Object.deleteProperties Vector4::, [ "childs" ]

    classes.register class Color            extends Pointer

        name        : "color"

        @byteLength : 4 * @BPE

        toObject    : ->
            [ red, green, blue, alpha ] = @f32
            { red, green, blue, alpha }

        set         : ( [ r, g, b, a = 1 ] ) ->
            super [ r, g, b, a ]

        apply       : ( draw, attribute, index, count ) ->
            throw /SIZE_MUST_EQUALTO_4/ if attribute.size - 4

            #todo make inherited
            #todo findChild draw, Color || etc..

            stride  = attribute.stride
            offset  = draw.byteOffset + attribute.offset

            start   = getByteOffset this
            end     = start + getByteLength this

            while count--
                ui8.copyWithin offset, start, end
                offset += stride

            1            

        [ Symbol.iterator ] : ->
            [ r, g, b, a = 1 ] =
                subarrayFloat32 this, 0 , 4

            ; yield r ; yield g ; 
            ; yield b ; yield a ; 

        Object.defineProperties Color::,
            f32 : get : -> newFloat32Array this, 0 ,4
            ui8 : get : -> Uint8Array.from @f32, (v) -> v * 0xff
            hex : get : -> "0x" + [ ...@ui8 ].map( (v) -> v.toString(16).padStart(2,0) ).join("")
            u32 : get : -> parseInt @hex, 16
            rgb : get : -> Array.from @ui8.subarray 0, 3
            css : get : -> "rgba( #{@rgb.join(', ')}, #{@obj.alpha} )"
            obj : get : -> @toObject()

        Object.deleteProperties Color::, [ "childs" ]

    classes.register class UV               extends Vector4

        name        : "uv"

    classes.register class Texture          extends Vector4

        name        : "texture"

    classes.register class Position         extends Vector4

        name        : "position"

        apply       : ( draw, attribute, index, count ) ->
            throw /SIZE_MUST_EQUALTO_4/ if attribute.size - 4

            stride          = attribute.stride
            offset          = draw.byteOffset + attribute.offset
            vertices        = draw.mesh.vertices index, count
            [ tx, ty, tz ]  = subarrayFloat32 this, 0, 3

            #todo apply rotation and scale too
            #todo make inherited
            #todo findChild draw, Position || etc..

            while count--
                [ x0, y0, z0 ] = vertices.subarray index, index + 3

                dvw.setFloat32 offset    , x0 + tx, LE
                dvw.setFloat32 offset + 4, y0 + ty, LE
                dvw.setFloat32 offset + 8, z0 + tz, LE

                offset += stride
                index += 3

            1

    classes.register class Scale            extends Vector4

        name        : "scale"

        apply       : ( begin, count, stride, offset ) ->

            [ sx, sy, sz ] = @buffer

            while count--

                i = ( count * stride + offset ) / 4

                f32[  i  ] *= sx
                f32[ i+1 ] *= sy
                f32[ 2+i ] *= sz

            0

    classes.register class Rotation         extends Pointer

        name        : "rotation"

        @byteLength : 9 * @BPE

        getX : -> getFloat32 this, 0
        sinX : -> getFloat32 this, 1
        cosX : -> getFloat32 this, 2

        getY : -> getFloat32 this, 3
        sinY : -> getFloat32 this, 4
        cosY : -> getFloat32 this, 5

        getZ : -> getFloat32 this, 6
        sinZ : -> getFloat32 this, 7
        cosZ : -> getFloat32 this, 8

        setX : (v) ->
            fillUint32 this, 0, 3
            setFloat32 this, 0, v
            setFloat32 this, 1, Math.sin(v)
            setFloat32 this, 2, Math.cos(v)

        setY : (v) ->
            fillUint32 this, 3, 3
            setFloat32 this, 3, v
            setFloat32 this, 4, Math.sin(v)
            setFloat32 this, 5, Math.cos(v)

        setZ : (v) ->
            fillUint32 this, 6, 3
            setFloat32 this, 6, v
            setFloat32 this, 7, Math.sin(v)
            setFloat32 this, 8, Math.cos(v)            

        set  : ( v ) -> super() and [ @x, @y, @z ] = v ; @

        apply : ( begin, count, stride, offset ) ->

            [   x, sinX, cosX,
                y, sinY, cosY,
                z, sinZ, cosZ,  ] = @buffer

            while count--

                i = ( count * stride + offset ) / 4

                f32[  i  ] *= sinX * cosX
                f32[ i+1 ] *= cosY * sinY
                f32[ 2+i ] *= sinZ * cosZ

            0

        [ Symbol.iterator ] : ->
            yield getFloat32 this, 0
            yield getFloat32 this, 3
            yield getFloat32 this, 6

        Object.defineProperties Rotation::,
            x : get : Rotation::getX , set : Rotation::setX
            y : get : Rotation::getY , set : Rotation::setY
            z : get : Rotation::getZ , set : Rotation::setZ     

        Object.deleteProperties Rotation::, [ "childs" ]

    classes.register class Frustrum         extends Pointer

        name : "frustrum"

    classes.register class PointSize        extends Pointer

        name : "pointSize"

    classes.register class GLParamerer      extends Pointer

        @byteLength         : 2

        TypedArray          : Uint16Array

        [ Symbol.iterator ] : -> yield getUint16 this, 0

        value               : -> getUint16 this, 0

    classes.register class ClearMask        extends GLParamerer

        name                : "clearMask"

        DEPTH_BUFFER_BIT    : WebGLRenderingContext.DEPTH_BUFFER_BIT

        COLOR_BUFFER_BIT    : WebGLRenderingContext.COLOR_BUFFER_BIT

        STENCIL_BUFFER_BIT  : WebGLRenderingContext.STENCIL_BUFFER_BIT

        @default            : 16640 #? depth | color

        set                 : -> super [ arguments... ].flat()

    classes.register class ClearColor       extends Color

        name                : "clearColor"

    classes.register class GLPointer        extends Pointer

        setGLObject : ->
            setResvUint8 this, 1, @store arguments[0]

        getGLObject : ->
            if  storei = getResvUint8 this, 1
                return @storage[ storei ]

            object = @create()
            storei = setResvUint8 this, 1, @store object

            object

        getIsActive : -> getResvUint8 this, 0

        setIsActive : ->            
            current = getResvUint8 this, 0
            request = arguments[0]

            if  request - current
                if setResvUint8 this, 0, request
                    @enable()
                else @disable()

            request

        disable     : -> this

        enable      : -> throw [ @constructor.name ] : /DEFINE_ENABLE_REQUIRED/                    

        Object.defineProperties GLPointer::, 
            glObject :
                get  : GLPointer::getGLObject
                set  : GLPointer::setGLObject

            isActive :
                get  : GLPointer::getIsActive
                set  : GLPointer::setIsActive

    classes.register class Context          extends GLPointer

        @byteLength         : 16 * @BPE

        TypedArray          : Float32Array

        isContext           : yes

        isOffscreen         : no

        contextType         : "webgl2"

        getProgram          : ->
            programs = findChilds this, Program
            unless program = programs.find (p) -> p.isActive
                unless program = programs[0]
                    setParent program = new Program, this
            program

        getVertexShader     : ->
            shaders = findChilds this, VertexShader
            unless shader = shaders.find (p) -> p.isActive
                unless shader = shaders[0]
                    for source in VertexShader.DocumentScripts
                        setParent shader = new VertexShader(), this
                        setParent new ShaderSource().set( source ), shader 
                    shader = findChild this, VertexShader

            shader

        getFragmentShader   : ->
            shaders = findChilds this, FragmentShader
            unless shader = shaders.find (p) -> p.isActive
                unless shader = shaders[0]
                    for source in FragmentShader.DocumentScripts
                        setParent shader = new FragmentShader(), this
                        setParent new ShaderSource().set(source), shader 
                    shader = findChild this, FragmentShader
            shader

        getDrawBuffer       : ->
            buffers = findChilds this, DrawBuffer
            unless buffer_ = buffers.find (p) -> p.isActive
                unless buffer_ = buffers[0]
                    setParent buffer_ = new DrawBuffer, this
            buffer_

        getClearMask        : ->
            unless clearMask = inherit this, ClearMask
                setParent clearMask = new ClearMask, this
                clearMask.set ClearMask.default
            clearMask

        getClearColor       : ->
            unless clearColor = inherit this, ClearColor
                setParent clearColor = new ClearColor, this
            clearColor

        create              : ( top, left, width, height ) ->
            top or= 0
            left or= 0
            width or= INNER_WIDTH
            height or= INNER_HEIGHT

            element = if !@isOffscreen then @resize(
                top, left, width, height, 
                document.body.appendChild(
                    document.createElement 'canvas')
            ) else new OffscreenCanvas width, height

            element.getContext @contextType

        enable              : ->
            unless getUint8 this, 3
                setUint8 this, 3, 1
                @prepareRender()
            this

        resize              : ( top, left, width, height, canvas ) ->
            canvas ||= @glObject.canvas

            pixelRatio = devicePixelRatio or 1
            aspectRatio = width / height

            @canvasInfo = {
                top, left, width, height,
                aspectRatio, pixelRatio
            }

            Object.assign canvas, {
                width   : pixelRatio * width
                height  : pixelRatio * height
                style   :
                    width      : CSS.px width
                    height     : CSS.px height
                    inset      : CSS.px 0
                    position   : "fixed"
            }

        prepareRender       : ->
            {   top, left, width, height,
                aspectRatio, pixelRatio
            } = @canvasInfo

            @viewport left, top, width, height
            @clearColor()
            @clear()

            1

        viewport            : ->
            @glObject.viewport arguments...
            0

        clear               : ->
            @glObject.clear @getClearMask().value()
            0

        clearColor          : ->
            if  clearColor = @getClearColor()
                @glObject.clearColor clearColor...
            0

        getCanvasInfo       : ->
            [
                top, left, width, height,
                aspectRatio, pixelRatio
            ] = subarrayFloat32 this, 0, 6

            top         or= 0
            left        or= 0
            width       or= INNER_WIDTH
            height      or= INNER_HEIGHT
            pixelRatio  or= devicePixelRatio or 1
            aspectRatio or= width / height

            {
                top, left, width, height,
                aspectRatio, pixelRatio
            }

        setCanvasInfo       : ->
            parameters = arguments[0] or {}
            setarrayFloat32 this, Object.values {
                ...@parameters, ...parameters
            }

        getProgramParameter : ( program, parameter ) ->
            @glObject.getProgramParameter program.glObject, parameter

        getActiveAttrib     : ( program, index ) ->
            @glObject.getActiveAttrib program.glObject, index

        getAttribLocation   : ( program, name ) ->
            @glObject.getAttribLocation program.glObject, name

        createProgram       : ->
            @glObject.createProgram()

        createVertexShader  : ->
            @glObject.createShader @glObject.VERTEX_SHADER

        createFragmentShader: ->
            @glObject.createShader @glObject.FRAGMENT_SHADER

        createBuffer        : ->
            @glObject.createBuffer()

        attachShader        : ( program, shader ) ->
            @glObject.attachShader program.glObject, shader.glObject

        compileShader       : ( shader ) ->
            @glObject.compileShader shader.glObject

        shaderSource        : ( shader, source ) ->
            @glObject.shaderSource shader.glObject, source.text

        linkProgram         : ( program ) ->
            @glObject.linkProgram program.glObject

        useProgram          : ( program ) ->
            @glObject.useProgram program.glObject

        bindBuffer          : ( drawBuffer ) ->
            @glObject.bindBuffer drawBuffer.TARGET, drawBuffer.glObject

        getShaderParameter  : ( shader, parameter ) ->
            @glObject.getShaderParameter shader.glObject, parameter

        getShaderInfoLog    : ( shader ) ->
            @glObject.getShaderInfoLog shader.glObject

        getPrecisionFormat  : ( shader ) ->
            @glObject.getShaderPrecisionFormat shader.glObject

        getShaderSource     : ( shader ) ->
            @glObject.getShaderSource shader.glObject

        Object.defineProperties Context::,

            canvasInfo      : get : Context::getCanvasInfo, set : Context::setCanvasInfo

            program         : get : Context::getProgram

            vertexShader    : get : Context::getVertexShader

            fragmentShader  : get : Context::getFragmentShader

            drawBuffer      : get : Context::getDrawBuffer

        Object.deleteProperties Context::, [ "buffer" ]

        alloc               : ( pointCount ) ->
            @drawBuffer.allocTriangles pointCount

    classes.register class Draw             extends Pointer

        isDraw      : on

        refresh     : ->
            count = @count #todo --> ITERATION_PER_THREAD
            index = hitIterOffset this, count

            readBuffer = @mesh.vertices index, count
            drawBuffer = @buffer
            vertShader = @vertexShader

            for attr in @attributes
                if  applier = findChild @mesh, attr.Class
                    applier . apply this, attr, index, count
                attr.refresh()

            gl = @parent.parent.glObject
            glProgram = @parent.parent.program.glObject

            @parent.upload this

        Object.defineProperties Draw::,

            begin   :
                get : -> getBegin this
                set : -> setBegin this, arguments[0]

            length  :
                get : -> getLength this
                set : -> setLength this, arguments[0]

            byteLength :
                get : -> getByteLength this
                set : -> setByteLength this, arguments[0]

            byteOffset :
                get : -> getByteOffset this
                set : -> setByteOffset this, arguments[0]

            mesh :
                get : -> getLinked this
                set : -> setLinked this, arguments[0]

            vertexShader :
                get : -> new VertexShader getResvUint32 this, 5
                set : -> setResvUint32 this, 5, arguments[0]

            type    :
                get : -> getResvUint16 this, 1
                set : -> setResvUint16 this, 1, arguments[0]

            bufferOffset :
                get : -> getResvUint32 this, 1
                set : -> setResvUint32 this, 1, arguments[0]

            count :
                get : -> getResvUint32 this, 3
                set : -> setResvUint32 this, 3, arguments[0]

            start :
                get : -> getResvUint32 this, 4
                set : -> setResvUint32 this, 4, arguments[0]

            buffer : 
                get : -> new Float32Array buffer, getByteOffset( this ), getLength this

            attributes :
                get : ->
                    meshChilds = getChildsPtri getLinkedPtri this
                    shaderAttrs = getChildsPtri getResvUint32( this, 5), Attribute
                    shaderClasses = for s in shaderAttrs then getLinkedPtri s

                    for c in meshChilds when -1 isnt i = shaderClasses.indexOf getClassIndex c
                        new Attribute shaderAttrs[ i ]

    classes.global   class Mesh             extends Pointer

        isDrawable  : yes

        Object.defineProperties Mesh::,

            info            : get : ->

                counts      : counts =

                    points  : getLength( this ) / 3

                    lines   : -1 + getLength( this ) / 3

                    triangles : Math.trunc getLength( this ) / 9

                offset      : @offsets()

                shapes      :

                    points      : if !i = 0 then while i < counts.points then @vertex i++

                    lines       : if !i = 0 then while i < counts.lines then @line i++

                    triangles   : if !i = 0 then while i < counts.triangles then @triangle i++

            pointCount      : get : -> getLength( this ) / 3

            draws           : get : -> findLinkeds this, Draw

            byteLength      : get : -> getByteLength this

            byteOffset      : get : -> getByteOffset this

            root            :
                get : -> getLinked this
                set : -> setLinked this, arguments[0]

        @create     : ( props = {} ) ->
            matter = new this

            if  props.vertices
                matter.set props.vertices
                delete props.vertices

            matter . init props

        draw        : ( @root, type ) ->
            @root.drawBuffer.draw this, type
            for child in findChilds this, Mesh
                child.draw @root, type
            this

        vertices    : ( index = 0, count = 1 ) ->
            subarrayFloat32 this, 3 * index, 3 * count

        vertex      : ( index = 0 ) ->
            subarrayFloat32 this, 3 * index, 3

        line        : ( index = 0 ) -> 
            subarrayFloat32 this, 3 * index, 6

        triangle    : ( index = 0 ) -> 
            subarrayFloat32 this, 9 * index, 9

        offsets     : ( index = 0, count = @pointCount ) ->
            begin      : b = index * 3 + getBegin this
            length     : l = count * 3
            end        : l + b
            byteOffset : @BPE * b
            byteLength : @BPE * l

        copy        : ( start, begin, count, stride, offset ) ->

            byteOffset      = begin * @BPE
            byteLength      = count * @BPE * 3
            dstByteOffset   = start * @BPE + offset

            while count--
                ui8.copyWithin dstByteOffset, byteOffset, byteOffset + 12

                byteOffset -= 12
                dstByteOffset -= stride

            0

        transform   : ( begin, count ) ->

            #todo buffer alloc required 'cause of stride and offset
            @copy 1

            if  rotation = findInheritable this, "rotation"
                rotation . apply begin, count

            #todo must read rotated, not original begin 
            if  position = findInheritable this, "position"
                position . apply begin, count

            if  scale    = findInheritable this, "scale"
                scale    . apply begin, count

            0

    classes.register class DrawBuffer       extends GLPointer

        MAX_POINT_COUNT     : 1e5

        isBuffer            : yes

        TARGET              : WebGL2RenderingContext.ARRAY_BUFFER

        USAGE               : WebGL2RenderingContext.STATIC_DRAW

        OFFSET_TRIANGLES    : 0 

        TRIANGLES           : WebGL2RenderingContext.TRIANGLES

        LINES               : WebGL2RenderingContext.LINES

        POINTS              : WebGL2RenderingContext.POINTS

        create              : -> 
            @malloc @MAX_POINT_COUNT * @BYTES_PER_POINT  
            buffer_ = @parent.createBuffer()

            @parent.glObject.bindBuffer @TARGET, buffer_
            @parent.glObject.bufferData @TARGET, @byteLength, @USAGE

            buffer_

        bind                : ->
            unless getResvUint8 this, 0
                setResvUint8 this, 0, 1
                @parent.bindBuffer this
            0

        enable              : ->
            @bind()

        draw                : ( ptr, type = @TRIANGLES ) ->            
            if  type is @TRIANGLES
                return @drawTriangles ptr

        upload              : ( draw ) ->
            @parent.program.enable()

            gl = @parent.glObject

            if  draw
                gl.bufferSubData @TARGET, draw.bufferOffset, draw.buffer
                gl.drawArrays gl.POINTS, draw.start, draw.count

            else
                gl.bufferData @TARGET, @buffer, @USAGE
                gl.drawArrays gl.TRIANGLES, 0, @pointCount

            #todo put in end of render

            0

        drawTriangles       : ( ptr ) ->
            unless byteOffset = getByteOffset this
                byteOffset = getByteOffset this if @create()
            vertexShader = @parent.vertexShader

            Object.assign @append( new Draw ), {
                count        : count  = ptr.pointCount
                byteLength   : bytes  = count * vertexShader.BYTES_PER_POINT
                bufferOffset : offset = addResvUint32( this, 1, bytes )
                byteOffset   : offset + byteOffset + @OFFSET_TRIANGLES
                length       : length = bytes / Float32Array.BYTES_PER_ELEMENT
                start        : addResvUint32 this, 2, count
                begin        : addResvUint32 this, 3, length 
                mesh         : ptr
                type         : @TRIANGLES
                vertexShader : vertexShader
            }

        Object.defineProperties DrawBuffer::,

            pointCount      : get : -> getResvUint32 this, 2

            byteLength      : get : -> getByteLength this

            BYTES_PER_POINT : get : ->
                getResvUint32( this, 4 ) or setResvUint32(
                    this, 4, @parent.vertexShader.BYTES_PER_POINT
                )

    classes.register class Program          extends GLPointer

        isProgram           : yes

        create              : ->
            @parent.createProgram()

        enable              : ->
            @link() unless @isLinked
            @use() unless @isActive

        link                : ->
            @parent.vertexShader.enable()
            @parent.fragmentShader.enable()

            unless getResvUint8 this, 2
                setResvUint8 this, 2, 1
                @parent.linkProgram this
            1

        use                 : ->
            @parent.drawBuffer.enable()

            unless getResvUint8 this, 0
                setResvUint8 this, 0, 1
                @parent.useProgram this

            1

        getParameter        : ( pname ) ->
            @parent.getProgramParameter this, pname

        getActiveAttrib     : ( index ) ->
            @parent.getActiveAttrib this, index

        getAttribLocation   : ( name ) ->
            @parent.getAttribLocation this, name

        Object.defineProperties Program::,

            isLinked        : get : -> @getParameter @LINK_STATUS

            isDeleted       : get : -> @getParameter @DELETE_STATUS

            isValidated     : get : -> @getParameter @VALIDATE_STATUS

            activeShaders   : get : -> @getParameter @ACTIVE_SHADERS

            attributeCount  : get : -> @getParameter @ATTRIBUTE_COUNT

            uniformCount    : get : -> @getParameter @UNIFORM_COUNT

            feedbackMode    : get : -> @getParameter @FEEDBACK_MODE

            feedbackVarys   : get : -> @getParameter @FEEDBACK_VARYS

            uniformBlocks   : get : -> @getParameter @UNIFORM_BLOCKS

        Object.deleteProperties Program::, [ "buffer", "childs" ]

        Object.defineProperties Program::,

            LINK_STATUS     : value : WebGL2RenderingContext.LINK_STATUS
            VALIDATE_STATUS : value : WebGL2RenderingContext.VALIDATE_STATUS
            DELETE_STATUS   : value : WebGL2RenderingContext.DELETE_STATUS
            UNIFORM_BLOCKS  : value : WebGL2RenderingContext.ACTIVE_UNIFORM_BLOCKS
            FEEDBACK_VARYS  : value : WebGL2RenderingContext.TRANSFORM_FEEDBACK_VARYINGS
            FEEDBACK_MODE   : value : WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER_MODE
            UNIFORM_COUNT   : value : WebGL2RenderingContext.ACTIVE_UNIFORMS
            ATTRIBUTE_COUNT : value : WebGL2RenderingContext.ACTIVE_ATTRIBUTES
            ACTIVE_SHADERS  : value : WebGL2RenderingContext.ATTACHED_SHADERS

    classes.register class Attribute        extends Pointer

        refresh : ->
            @parent.parent.drawBuffer.enable()

            @glContext.vertexAttribPointer @pointerArgs...
            @glContext.enableVertexAttribArray @index

            0

        Object.defineProperties Attribute::,

            index           :
                get : -> getResvUint16 this, 0
                set : -> setResvUint16 this, 0, arguments[0]

            size            :
                get : -> getResvUint16 this, 1
                set : -> setResvUint16 this, 1, arguments[0]

            type            :
                get : -> getResvUint16 this, 2
                set : -> setResvUint16 this, 2, arguments[0]

            normalized      :
                get : -> getResvUint16 this, 3
                set : -> setResvUint16 this, 3, arguments[0]

            stride          :
                get : -> getResvUint16 this, 4
                set : -> setResvUint16 this, 4, arguments[0]

            offset          :
                get : -> getResvUint16 this, 5
                set : -> setResvUint16 this, 5, arguments[0]

            byteLength      : 
                get : -> getByteLength this
                set : -> setByteLength this, arguments[0]

            Class           :
                get : -> classes[ getLinkedPtri this ]
                set : -> setLinkedPtri this, arguments[0].classIndex

            @key            :
                get : -> classes[ getLinkedPtri this ]::name

            glContext       :
                get         : -> @parent.parent.glObject

            pointerArgs     : get : ->
                begin = HEADER_RESVINDEX + this 
                new Uint16Array buffer, begin * 4, 6

            performers      : get : ->
                vertexShader = 1 * @parent
                @Class.allocs().filter (a) -> a.parent.draws.find (d) ->
                    d.vertexShader - vertexShader is 0

        Object.deleteProperties Attribute::, [ "childs", "buffer" ]

    classes.register class Shader           extends GLPointer

        isShader            : yes

        attach              : ->
            unless getResvUint8 this, 2
                getResvUint8 this, 2, 1
                if  err = @compile().infoLog
                    throw [ err, this ]

            unless getResvUint8 this, 0
                setResvUint8 this, 0, 1
                @parent.attachShader @program, this

            1

        enable              : -> @attach()

        compile             : ->
            if !@source.isUploaded
                @source.isUploaded = 1
                @parent.shaderSource this, @source    

            if !@source.isCompiled
                @source.isCompiled = 1
                @parent.compileShader this

            if !@source.isResolved
                @source.resolve()

            this

        getParameter        : ( parameter ) ->
            @parent.getShaderParameter this, parameter

        delete              : ->
            @parent.deleteShader this

        Object.defineProperties Shader::,

            source  : 
                get : -> findChild this, ShaderSource, true
                set : -> @source.set arguments[0]

            program :
                get : -> getLinked( this ) or setLinked this, @parent.program
                set : -> setLinked this, arguments[0]

            infoLog : 
                get : -> @parent.getShaderInfoLog this

            precisionFormat :
                get : -> @parent.getPrecisionFormat this

        Object.defineProperties Shader, DocumentScripts : get : ->

            sources = [ ...document.querySelectorAll "script" ]
                .map( (s) -> s.text ).filter (s) -> /gl_/.test s

            if  this is VertexShader
                return sources.filter (s) -> s.match /gl_Pos/

            if  this is FragmentShader
                return sources.filter (s) -> s.match /gl_Fra/

            return []

        Object.deleteProperties Shader::, [ "buffer" ]

    classes.register class VertexShader     extends Shader

        isVertexShader      : yes

        shaderType          : WebGL2RenderingContext.VERTEX_SHADER

        create              : -> @parent.createVertexShader()

        Object.defineProperties VertexShader::,

            BYTES_PER_POINT : get : ->

                unless @source.isResolved
                    @source.resolve()

                unless byteLength = getByteLength this
                    for attr in findChilds this, Attribute
                        byteLength += attr.byteLength
                    setByteLength this, byteLength

                byteLength

    classes.register class FragmentShader   extends Shader

        isFragmentShader    : yes

        shaderType          : WebGL2RenderingContext.FRAGMENT_SHADER

        create              : -> @parent.createFragmentShader()

    classes.register class CompiledShader   extends Pointer

        attach              : ->
            @glContext.attachShader @glProgram, @glShader

        Object.defineProperties CompiledShader::,

            isAttached      : 
                get : -> getResvUint8 this, 0
                set : -> setResvUint8 this, 0, arguments[0]

            glShader        :
                get : -> @storage[ getResvUint8 this, 5 ]
                set : -> setResvUint8 this, 5, @store arguments[0]

            glProgram       : 
                get : -> @storage[ getResvUint8 this, 4 ]
                set : -> setResvUint8 this, 4, @store arguments[0]

            glContext       :
                get : -> @storage[ getResvUint8 this, 3 ]
                set : -> setResvUint8 this, 3, @store arguments[0]

            source          : 
                get : -> new ShaderSource getByteLength this
                set : -> setByteLength this, arguments[0]

            context         :
                get : -> getLinked this
                set : -> setLinked this, arguments[0]

        Object.deleteProperties CompiledShader::, [ "childs", "buffer" ]

    classes.register class TextPointer      extends Pointer

        TypedArray          : Uint8Array

        @BPE                : 1

        BPE                 : @BPE

        encoder             : new TextEncoder

        decoder             : new TextDecoder

        set                 : ( text ) ->
            super @encoder.encode "#{text}" 

        get                 : ->
            @decoder.decode detachUint8 this

        toString            : -> @get()

    classes.register class DocumentScript   extends TextPointer

        set                 : ( text ) ->
            super text

        resolve             : ->
            return if getResvUint8 this, 4
            setResvUint8 this, 4, 1

            if  text = @element.text
                @set text

            if  @isShaderSource
                setClassIndex this, ShaderSource.classIndex

            else if @isUserScript
                setClassIndex this, UserScript.classIndex

            this

        Object.deleteProperties DocumentScript::, [ "buffer", "childs" ]

        Object.defineProperties DocumentScript::,

            element : 
                get : -> getObject this

            src     :
                get : -> @element.src

            type    :
                get : -> @element.type or "application/javascript"

            text    :
                get : -> @get()

            isShaderSource   : get : -> /shader/i.test @type

            isVertexShader   : get : -> /gl_Position/i.test @text

            isFragmentShader : get : -> /gl_Frag/i.test @text

            isComputeShader  : get : -> /\@compute/i.test @text

            isUserScript     : get : -> @text and !!@src

    classes.register class UserScript       extends DocumentScript

        Object.defineProperties UserScript::,

            blob            : get : -> new Blob [ @text ], { @type }

            objectURL       : get : -> URL.createObjectURL @blob

        append              : ->
            element = document.createElement "script"

            setParent script = new @constructor, @parent
            setObject script , element

            script.set @text

            element.text = @text
            element.type = @type

            document.body.appendChild element

            script

    classes.register class ShaderSource     extends DocumentScript

        Object.defineProperties ShaderSource::,

            isResolved :
                get : -> getResvUint8 this, 2 
                set : -> setResvUint8 this, 2, arguments[0] 

            isUploaded :
                get : -> getResvUint8 this, 1 
                set : -> setResvUint8 this, 1, arguments[0] 

            isCompiled :
                get : -> getResvUint8 this, 0 
                set : -> setResvUint8 this, 0, arguments[0] 

        Object.deleteProperties ShaderSource::, [ "src" ]

        keyof               : ( type ) ->
            k = Object.keys WebGL2RenderingContext
            v = Object.values WebGL2RenderingContext
            k.at v.indexOf type

        resolve             : ->
            return super() if @isResolved
            @isResolved = 1

            stride     = 0
            program    = @parent.program
            attributes = []

            unless program.isLinked
                program.link()
            numAttribs = program.attributeCount

            while numAttribs--
                attr       = program.getActiveAttrib numAttribs
                location   = program.getAttribLocation attr.name
                typeKey    = @keyof( attr.type )
                info       = typeKey.split(/_/)
                name       = attr.name
                type       = WebGL2RenderingContext.FLOAT

                [ vtype, kind ] = info

                Class      = classes.find (c) -> c::name is attr.name
                length     = Math.imul kind[3] or 1, kind[5] or 1
                offset     = stride
                stride    += byteLength = Class.BPE * length

                attributes.push {
                    index: location, size : length,
                    type, stride, offset,
                    byteLength, Class, normalized: Class.normalize
                }

            attributes.map (a) -> a.stride = stride

            for attr in attributes
                @parent.append Object.assign new Attribute, attr

            this

    classes.register class EventHandler     extends TextPointer

        getHandler          : -> @storage[ getResvUint8 this, 0 ]

        setHandler          : -> setResvUint8 this, 0, @store arguments[0]

        getIsOnce           : -> getResvUint8 this, 1

        hitIsOnce           : -> hitResvUint8 this, 1

        setIsOnce           : -> setResvUint8 this, 1, arguments[0]

        getCallCount        : -> getResvUint32 this, 1

        hitCallCount        : -> addResvUint32 this, 1, 1

        setCallCount        : -> setResvUint32 this, 1, arguments[0]

        call                : ->
            if !@hitCallCount() or !@getIsOnce() 
                @handler.call @parent, arguments...
            0

        set                 : ( event, handler, options ) ->
            super event

            if  options and options.once
                @isOnce = 1

            @handler = handler

            this

        Object.deleteProperties EventHandler::, [ "childs" ]

        Object.defineProperties EventHandler::,

            handler         :
                get : EventHandler::getHandler
                set : EventHandler::setHandler

            isOnce          :
                get : EventHandler::getIsOnce
                set : EventHandler::setIsOnce

            callCount       :
                get : EventHandler::getCallCount
                set : EventHandler::setCallCount

            @key            :
                get : EventHandler::toString

    classes.register class EventEmitter     extends Pointer

        iterate         : EventHandler

        init            : ->
            if  hitResvUint8 super( arguments...), 0
                @create()
            this

        getHandlers     : ->
            findChilds this, EventHandler 

        on              : ( event, handler, options ) ->
            @add new EventHandler().set arguments... 

        emit            : ( event, data = {} ) ->
            @hitCallCount()

            for e of @childs when e.name is event
                e.call data 

        create              : -> this

        getCallCount        : -> getResvUint32 this, 1

        hitCallCount        : -> addResvUint32 this, 1, 1

        setCallCount        : -> setResvUint32 this, 1, arguments[0]        

        Object.defineProperties EventEmitter::,

            events          : get : EventEmitter::getHandlers

            callCount       :
                get : EventEmitter::getCallCount
                set : EventEmitter::setCallCount

    classes.global   class Document         extends EventEmitter

        Object.deleteProperties Document::, [ "parent", "callCount" ]

        Object.defineProperties Document::, 

            buffer : get : -> buffer

    classes.global   class Scene            extends EventEmitter

        @byteLength : 28 * @BPE

        #?@iterate  : Mesh

        gpu         : ->

            WORKGROUPS = 65534
            WGROUP_SIZE = 256

            VERTEX_SIZE = WGROUP_SIZE * WORKGROUPS
            BUFFER_SIZE = VERTEX_SIZE * 4

            vertlen = 65534 * 256
            verticesA = new Float32Array buffer
            verticesB = new Float32Array new SharedArrayBuffer BUFFER_SIZE

            i = 0
            length = 0
            while i < VERTEX_SIZE
                verticesB.set( [ length, i, -Math.random(), 0 ], i )
                length++
                i += 4

            cscript     = document.getElementById("cshader").text
            cscript     = cscript.replace( /VERTEX_SIZE/, VERTEX_SIZE )
            cscript     = cscript.replace( /WGROUP_SIZE/, WGROUP_SIZE )

            adapter     = await navigator.gpu.requestAdapter()
            gpu         = await adapter.requestDevice()            

            cshader     = gpu.createShaderModule { code: cscript }

            output      = gpu.createBuffer
                size    : BUFFER_SIZE
                usage   : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC

            staging     = gpu.createBuffer
                size    : BUFFER_SIZE
                usage   : GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST

            inputA      = gpu.createBuffer
                size    : BUFFER_SIZE
                usage   : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST

            inputB      = gpu.createBuffer
                size    : BUFFER_SIZE
                usage   : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST

            gpu.queue.writeBuffer inputA, 0, verticesA, 0, VERTEX_SIZE
            gpu.queue.writeBuffer inputB, 0, verticesB, 0, VERTEX_SIZE

            bindLayout  = gpu.createBindGroupLayout( entries: [
                { binding : 0, visibility : GPUShaderStage.COMPUTE, buffer : { type: "read-only-storage" } }
                { binding : 1, visibility : GPUShaderStage.COMPUTE, buffer : { type: "read-only-storage" } }
                { binding : 2, visibility : GPUShaderStage.COMPUTE, buffer : { type: "storage" } }
            ])

            bindGroup   = gpu.createBindGroup( layout : bindLayout, entries : [
                { binding : 0, resource : { buffer: inputA } }
                { binding : 1, resource : { buffer: inputB } }
                { binding : 2, resource : { buffer: output } }
            ])            

            pipeline    = gpu.createComputePipeline(
                layout  : gpu.createPipelineLayout(
                    bindGroupLayouts : [ bindLayout ]
                ),
                compute : module : cshader, entryPoint: 'main'
            )

 * Create GPUCommandEncoder to issue commands to the GPU 
            execEncoder = gpu.createCommandEncoder()

 * Initiate render pass
            passEncoder = execEncoder.beginComputePass()

 * Issue commands
            passEncoder.setPipeline pipeline
            passEncoder.setBindGroup 0, bindGroup
            passEncoder.dispatchWorkgroups WORKGROUPS

 * End the render pass
            passEncoder.end()

 * Copy output buffer to staging buffer
            execEncoder.copyBufferToBuffer( output,
                0, # SRC offset  
                staging, 
                0, # DST offset  
                BUFFER_SIZE
            )

 * End frame by passing array of command buffers to command queue for execution
            gpu.queue.submit [ execEncoder.finish() ]

 * map staging buffer to read results back to JS
            await staging.mapAsync GPUMapMode.READ, 0, BUFFER_SIZE
            copyArrayBuffer = staging.getMappedRange 0, BUFFER_SIZE

 * get results
            verticesB.set new Float32Array copyArrayBuffer
            log "results:", verticesB
            staging.unmap()

        create      : ->
            super arguments...

            setParent this, root

            @startTime = Date.now()
            @isRendering = 1

            i = 0
            onframe = ( @epoch ) ->
                @context.clear()
                @render()

                throw /RENDER_OF_10/ if i++ > 10
                requestAnimationFrame onframe

            do onframe = onframe.bind this

            @context.parent

        add             : ( ptr ) ->
            super ptr

            if !ptr.isDrawable
                return this

            ptr.draw this

            this

        append          : ( ptr ) ->
            @add ptr ; ptr

        render          : ->
            iterator = prepareIterator Draw

            while draw = iterateGlobalAllocs iterator
                draw.refresh()

            @context.drawBuffer.upload()

            @emit "render"

        getTimeStamp    : ->
            getUint64( this, 0 ) + getUint32( this, 3 )

        #?              BYTEOFFSET = 0

        getStartTime    : -> getUint64 this, 0

        setStartTime    : -> setUint64 this, 0, arguments[0]

        #?              BYTEOFFSET = 8

        getFramePerSec  : -> getUint8 this, 8

        setFramePerSec  : -> setUint8 this, 8, arguments[0]

        getIsRendering  : -> getUint8 this, 9

        setIsRendering  : -> setUint8 this, 9, arguments[0]

        #?              BYTEOFFSET = 10

        getDeltaTime    : -> getUint16 this, 5

        setDeltaTime    : ( delta ) -> 
            @fps = 1000 / setUint16 this, 5, delta

        #?              BYTEOFFSET = 12

        getEpochTime    : -> getUint32 this, 3

        setEpochTime    : ( epoch ) ->
            @delta = -@epoch + setUint32 this, 3, epoch

        #?              BYTEOFFSET = 16

        Object.defineProperties Scene::,

            now         :
                get : Scene::getTimeStamp

            fps         :
                get : Scene::getFramePerSec
                set : Scene::setFramePerSec

            delta       :
                get : Scene::getDeltaTime
                set : Scene::setDeltaTime

            epoch       :
                get : Scene::getEpochTime
                set : Scene::setEpochTime

            startTime   :
                get : Scene::getStartTime
                set : Scene::setStartTime

            isRendering :
                get : Scene::getIsRendering
                set : Scene::setIsRendering

            context     :
                get : ->
                    contexts = findChilds this, Context
                    unless context = contexts.find (p) -> p.isActive
                        unless context = contexts[0]
                            setParent context = new Context, this
                        context.enable()                            
                    context

            drawBuffer  :
                get : -> @context.drawBuffer

        class Mesh         extends Pointer

            self.Mesh      = this

            OFFSET_POSITION : @malloc Position

            OFFSET_ROTATION : @malloc Rotation

            OFFSET_SCALE    : @malloc Scale

            OFFSET_COLOR    : @malloc Color

            OFFSET_VERTICES : @malloc Vertices

            draws           : []

            @fromOptions    : ( options ) ->
                ptri = malloc this
                ptr = new this ptri

                for prop, value of options
                    ptr[ prop ] = value

                ptr.isGL = 1
                ptr.iterCount = ptr.vertices.pointCount

                unless Number.isInteger ptr.vertices.pointCount
                    throw [ /VERTEX_COUNT_MUST_BE_MULTIPLE_OF_3/, options.vertices ]

                ptr

            Object.defineProperties Mesh::,
                pointCount  :
                    get     : -> @vertices.pointCount

                markNeedsUpdate : 
                    set     : -> unlock Atomics.store i32, @ptri + PTR_UPDATED, 1

                willUploadIfNeeded : 
                    get     : -> Atomics.and i32, @ptri + PTR_UPDATED, 0

            drawPoints      : ->
                @draws.push space.malloc gl.POINTS, this

            drawLines       : ->
                @draws.push space.malloc gl.LINES, this

            drawTriangles   : ->
                @draws.push space.malloc gl.TRIANGLES, this

            vertex          : ( index ) ->
                ptri = dvw.getUint32 @byteOffset + @OFFSET_VERTICES, LE
                byteOffset = i32[ ptri + PTR_BYTEOFFSET ] + index * 4 * 3
                new Float32Array buffer, byteOffset, 3

        class Matrix4       extends Pointer

            @byteLength         : 16

            @multiply           : ( mat4a, mat4b ) ->
                Matrix4::multiply.call mat4a, mat4b

            translate           : ( x = 0, y = 0, z = 0 ) ->
                @multiply Float32Array.of(
                    1,  0,  0,  0,
                    0,  1,  0,  0,
                    0,  0,  1,  0,
                    x,  y,  z,  1,
                )

            translateX          : ( x = 0 ) ->
                @multiply Float32Array.of(
                    1,  0,  0,  0,
                    0,  1,  0,  0,
                    0,  0,  1,  0,
                    x,  0,  0,  1,
                )

            translateY          : ( y = 0 ) ->
                @multiply Float32Array.of(
                    1,  0,  0,  0,
                    0,  1,  0,  0,
                    0,  0,  1,  0,
                    0,  y,  0,  1,
                )

            translateZ          : ( z = 0 ) ->
                @multiply Float32Array.of(
                    1,  0,  0,  0,
                    0,  1,  0,  0,
                    0,  0,  1,  0,
                    0,  0,  z,  1,
                )

            rotate              : ( x = 0, y = 0, z = 0 ) ->
                @rotateX( x ).rotateY( y ).rotateZ( z )

            rotateX             : ( r = 0 ) ->
                c = Math.cos r
                s = Math.sin r

                @multiply Float32Array.of(
                    1,  0,  0,  0,
                    0,  c,  s,  0,
                    0, -s,  c,  0,
                    0,  0,  0,  1,
                )

            rotateY             : ( r = 0 ) ->
                c = Math.cos r
                s = Math.sin r

                @multiply Float32Array.of(
                    c,  s,  0,  0,
                    -s,  c,  0,  0,
                    0,  0,  1,  0,
                    0,  0,  0,  1,
                )

            rotateZ             : ( r = 0 ) ->
                c = Math.cos r
                s = Math.sin r

                @multiply Float32Array.of(
                    c,  0, -s,  0,
                    0,  1,  0,  0,
                    s,  0,  c,  0,
                    0,  0,  0,  1,
                )

            scale               : ( x = 1, y = 1, z = 1 ) ->
                @multiply Float32Array.of(
                    x,  0,  0,  0,
                    0,  y,  0,  0,
                    0,  0,  z,  0,
                    0,  0,  0,  1,
                )

            multiply            : ( mat4 ) ->

                [   a00, a01, a02, a03,
                    a10, a11, a12, a13,
                    a20, a21, a22, a23,
                    a30, a31, a32, a33,   ] = this

                [   b00, b01, b02, b03,
                    b10, b11, b12, b13,
                    b20, b21, b22, b23,
                    b30, b31, b32, b33,   ] = mat4

                @set Float32Array.of(
                    b00 * a00  +  b01 * a10  +  b02 * a20  +  b03 * a30,
                    b00 * a01  +  b01 * a11  +  b02 * a21  +  b03 * a31,
                    b00 * a02  +  b01 * a12  +  b02 * a22  +  b03 * a32,
                    b00 * a03  +  b01 * a13  +  b02 * a23  +  b03 * a33,

                    b10 * a00  +  b11 * a10  +  b12 * a20  +  b13 * a30,
                    b10 * a01  +  b11 * a11  +  b12 * a21  +  b13 * a31,
                    b10 * a02  +  b11 * a12  +  b12 * a22  +  b13 * a32,
                    b10 * a03  +  b11 * a13  +  b12 * a23  +  b13 * a33,

                    b20 * a00  +  b21 * a10  +  b22 * a20  +  b23 * a30,
                    b20 * a01  +  b21 * a11  +  b22 * a21  +  b23 * a31,
                    b20 * a02  +  b21 * a12  +  b22 * a22  +  b23 * a32,
                    b20 * a03  +  b21 * a13  +  b22 * a23  +  b23 * a33,

                    b30 * a00  +  b31 * a10  +  b32 * a20  +  b33 * a30,
                    b30 * a01  +  b31 * a11  +  b32 * a21  +  b33 * a31,
                    b30 * a02  +  b31 * a12  +  b32 * a22  +  b33 * a32,
                    b30 * a03  +  b31 * a13  +  b32 * a23  +  b33 * a33,
                )

            [ Symbol.iterator ] : ->
                begin = @begin
                index = 0
                count = 16

                next  : ->
                    return done  : true if index is count
                    return value : f32[ begin + index++ ]

            Object.defineProperties Matrix4::,
                matrix  : 
                    get : -> f32.subarray @begin, @begin + 16
                    set : (v) -> f32.set v, @begin

        class Frustrum      extends Matrix4

            @byteLength         : 4 * 28

            INDEX_BOTTOM        : 17

            INDEX_LEFT          : 18

            INDEX_RIGHT         : 19

            INDEX_TOP           : 20

            INDEX_WIDTH         : 21

            INDEX_HEIGHT        : 22

            INDEX_ASPECT        : 23

            INDEX_PRATIO        : 24

            INDEX_YFOV          : 25

            INDEX_ZNEAR         : 26

            INDEX_ZFAR          : 27

            @fromOptions        : ( options = {} ) ->
                { yFov = 90, zNear = 1e-3, zFar = 1e+4,
                width = INNER_WIDTH, height = INNER_HEIGHT, pratio = RATIO_PIXEL } = options

                base = new this()
                aspect = width / height
                half_fovy = ( .5 * yFov * RADIANS_PER_DEGREE )
                bottom = - ( top = zNear * Math.tan half_fovy )
                left = - ( right = top * aspect )

                f = Math.tan Math.PI/2 - yFov/2
                rangeInv = 1.0 / ( zNear - zFar )            

                base.typedArray.set Float32Array.of(
                    f / aspect,    0,                             0,    0,
                    0,             f,                             0,    0,
                    0,             0,     (zNear + zFar) * rangeInv,   -1,
                    0,             0, (zNear * zFar) * rangeInv * 2,    0,

                    0,
                    bottom, left, right, top,
                    width, height, aspect, pratio,
                    yFov, zNear, zFar
                )

                base.translateZ -5
                base.rotateX Math.PI
                base.scale 1, 1, 1

                base

            Object.defineProperties Frustrum::,

                bottom  :
                    get : -> f32[ @begin + @INDEX_BOTTOM ]
                    set : (v) -> f32[ @begin + @INDEX_BOTTOM ] = v

                left    :
                    get : -> f32[ @begin + @INDEX_LEFT ]
                    set : (v) -> f32[ @begin + @INDEX_LEFT ] = v

                right   :
                    get : -> f32[ @begin + @INDEX_RIGHT ]
                    set : (v) -> f32[ @begin + @INDEX_RIGHT ] = v

                top     :
                    get : -> f32[ @begin + @INDEX_TOP ]
                    set : (v) -> f32[ @begin + @INDEX_TOP ] = v

                width   :
                    get : -> f32[ @begin + @INDEX_WIDTH ]
                    set : (v) -> f32[ @begin + @INDEX_WIDTH ] = v

                height  :
                    get : -> f32[ @begin + @INDEX_HEIGHT ]
                    set : (v) -> f32[ @begin + @INDEX_HEIGHT ] = v

                aspect  :
                    get : -> f32[ @begin + @INDEX_ASPECT ]
                    set : (v) -> f32[ @begin + @INDEX_ASPECT ] = v

                pratio  :
                    get : -> f32[ @begin + @INDEX_PRATIO ]
                    set : (v) -> f32[ @begin + @INDEX_PRATIO ] = v

                yFov    :
                    get : -> f32[ @begin + @INDEX_YFOV ]
                    set : (v) -> f32[ @begin + @INDEX_YFOV ] = v

                zNear   :
                    get : -> f32[ @begin + @INDEX_ZNEAR ]
                    set : (v) -> f32[ @begin + @INDEX_ZNEAR ] = v

                zFar    :
                    get : -> f32[ @begin + @INDEX_ZFAR ]
                    set : (v) -> f32[ @begin + @INDEX_ZFAR ] = v

                rebind  :
                    get : -> @upload()

            setViewport         : ( context ) ->
                context.viewport 0, 0, @width * @pratio, @height * @pratio

                if  defines.pointSize
                    defines.pointSize.value = 10

                if  defines.frustrum
                    defines.frustrum.upload =
                        defines.frustrum.bindUpload @matrix

                    Object.defineProperties this,
                        uniform : get   : -> defines.frustrum
                        upload  : value : defines.frustrum.bindUpload @matrix

                    @upload()
                this

            listenWindow        : ->

                self.addEventListener "wheel", (e) =>
                    @translateZ e.deltaY/100
                        .upload()
                    e.preventDefault()
                , passive: off

                plock = 0 
                rotate = 0
                draging = 0

                self.oncontextmenu  = (e) -> e.preventDefault()
                self.ondblclick     = ->
                    gl.canvas.requestPointerLock unadjustedMovement : on
                    gl.canvas.requestFullscreen  navigationUI : "hide"

                document.onfullscreenchange  = 
                document.onpointerlockchange = ->
                    plock = @pointerLockElement or @fullscreenElement

                self.onpointerdown  = (e) ->
                    if e.button is 2 then draging = 1
                    else rotate  = 1

                self.onpointerout   =
                self.onpointerup    = -> draging = rotate = 0
                self.onpointermove  = (e) => 
                    if  plock or rotate or draging

                        { movementX: x, movementY: y } = e

                        if  rotate
                            @rotateX y / -100 if y
                            @rotateY x / -100 if x

                        if  draging
                            @translate(
                                x / (INNER_WIDTH /10),
                                y / (INNER_HEIGHT/15)
                            )
                        @upload()

                    0

        class GLDraw        extends Pointer

            @byteLength         : 8 * 4

            INDEX_NEEDSUP       : 0

            INDEX_COUNT         : 1

            INDEX_TYPE          : 2

            INDEX_OFFSET        : 3

            INDEX_BEGIN         : 4

            INDEX_LENGTH        : 5

            INDEX_ATTRLEN       : 6

            INDEX_BOFFSET       : 7

            classId             : @classId

            @fromOptions        : ( options = {} ) ->
                Object.assign new this(), options

            Object.defineProperties GLDraw::,

                pointsCount : 
                    get : -> u32[ @begin + @INDEX_COUNT ]
                    set : (v) -> u32[ @begin + @INDEX_COUNT ] = v

                drawType :
                    get : -> u32[ @begin + @INDEX_TYPE ]
                    set : (v) -> u32[ @begin + @INDEX_TYPE ] = v                

                globalOffset : 
                    get : -> u32[ @begin + @INDEX_BOFFSET ]
                    set : (v) -> u32[ @begin + @INDEX_BOFFSET ] = v

                uploadOffset : 
                    get : -> u32[ @begin + @INDEX_OFFSET ]
                    set : (v) -> u32[ @begin + @INDEX_OFFSET ] = v

                uploadBegin :
                    get : -> u32[ @begin + @INDEX_BEGIN ]
                    set : (v) -> u32[ @begin + @INDEX_BEGIN ] = v

                uploadLength :
                    get : -> u32[ @begin + @INDEX_LENGTH ]
                    set : (v) -> u32[ @begin + @INDEX_LENGTH ] = v

                drawBuffer :
                    get : -> new Float32Array buffer, @globalOffset, @uploadLength

            vertex  : (i) ->
                byteOffset = @globalOffset + ( i * 32 )
                new Float32Array buffer, byteOffset, 3

            color   : (i) ->
                byteOffset = @globalOffset + ( i * 32 ) + 16
                new Float32Array buffer, byteOffset, 4

        classes.register class Shader extends Pointer

            INDEX_IS_ATTACHED     : 0 #ui8
            INDEX_GLSHADER_INDEX  : 1

            @typeof : ( source ) ->
                if !source.match /gl_Program/
                    return WebGL2RenderingContext.FRAGMENT_SHADER
                return WebGL2RenderingContext.VERTEX_SHADER

            @getDefault : -> @allocs()[0]

            @fromSource : ( source ) ->
                if  WebGL2RenderingContext.VERTEX_SHADER is @typeof source
                    return new vShader
                return new fShader

            @createScope : ( storage ) ->

                defaultVShader = no
                defaultFShader = no

                for s in scripts.find (s) -> s.type.match /x-shader/i

                    shader = if s.text.match /gl_Program/
                        new vShader null, storage
                    else new fShader null, storage

                    shader . compile s.text 

                    if !defaultVShader and shader.vShader
                        defaultVShader = shader 

                    if !defaultFShader and shader.fShader
                        defaultFShader = shader 

                storage

            compile : ( source ) ->
                shader = gl.createShader @type

                gl.shaderSource shader, source
                gl.compileShader shader

                unless gl.getShaderParameter shader, gl.COMPILE_STATUS
                    info = gl.getShaderInfoLog shader
                    throw "Could not compile WebGL program. \n\n#{info}"

                @glShader = shader

                @resolve()

            resolve : -> this

            Object.defineProperties Shader::,

                isAttached      :
                    get : -> u32[ this + @PTR_RESV0 ]
                    set : (v) -> u32[ this + @PTR_RESV0 ] = v

                glShader        :
                    get : -> shaders[ u32[ this + @PTR_RESV1 ] ]
                    set : (v) -> u32[ this + @PTR_RESV1 ] = shaders.register v

        classes.register class vShader extends Shader
            name : "vShader"
            type : WebGL2RenderingContext.VERTEX_SHADER

            vShader : yes

            INDEX_GLBUFFER_BOUND  : 0 #ui8
            INDEX_GLBUFFER_INDEX  : 1
            INDEX_BYTES_PER_ATTR  : 2

            INDEX_POINTS_START    : 1 #u32 
            INDEX_POINTS_COUNT    : 2 
            INDEX_POINTS_OFFSET   : 3 

            INDEX_LINES_START     : 4 
            INDEX_LINES_COUNT     : 5 
            INDEX_LINES_OFFSET    : 6 

            INDEX_TRIANGLES_START : 7 
            INDEX_TRIANGLES_COUNT : 8 
            INDEX_TRIANGLES_OFFSET: 9 

            INDEX_DRAW_BEGIN      : HEADER_BYTELENGTH

            init : ->
                @BYTES_PER_ATTRIBUTE = 32

                length           = @byteLength / 4
                typeLength       = Math.trunc length / 3 
                typeByteLength   = typeLength * 4
                typeAttribLength = typeByteLength / @BYTES_PER_ATTRIBUTE

                @pointsStart     = 2 #for initial alloc
                @linesStart      = typeAttribLength
                @trianglesStart  = typeAttribLength * 2

                @pointsOffset    = 2 * @BYTES_PER_ATTRIBUTE
                @linesOffset     = typeByteLength * 2
                @trianglesOffset = typeByteLength * 3 

            compile : ( source ) ->
                super source

                buffer = gl.createBuffer()

                gl.bindBuffer gl.ARRAY_BUFFER, buffer
                gl.bufferData gl.ARRAY_BUFFER, BYTELENGTH_GLBUFFER, gl.STATIC_DRAW

                @glBuffer = buffer
                @isBinded = 1

                this

            attach : ( program ) ->
                gl.attachShader program, @glShader
                @isAttached = 1

                this

            resolve : ->

                resolveUniform  = ( uniform ) ->
                    ( data, transpose = off ) ->    switch uniform.kind
                        when "FLOAT_MAT4"           then gl.uniformMatrix4fv  .bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT3"           then gl.uniformMatrix3fv  .bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT2"           then gl.uniformMatrix2fv  .bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT2x3"         then gl.uniformMatrix2x3fv.bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT2x4"         then gl.uniformMatrix2x4fv.bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT3x2"         then gl.uniformMatrix3x2fv.bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT3x4"         then gl.uniformMatrix3x4fv.bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT4x2"         then gl.uniformMatrix4x2fv.bind gl, uniform.location, transpose, data
                        when "FLOAT_MAT3x3"         then gl.uniformMatrix4x3fv.bind gl, uniform.location, transpose, data
                        when "FLOAT"                then gl.uniform1f         .bind gl, uniform.location, data
                        when "INT"                  then gl.uniform1iv        .bind gl, uniform.location, data
                        when "UNSIGNED_INT"         then gl.uniform1uiv       .bind gl, uniform.location, data
                        when "UNSIGNED_INT_VEC2"    then gl.uniform2uiv       .bind gl, uniform.location, data
                        when "UNSIGNED_INT_VEC3"    then gl.uniform3uiv       .bind gl, uniform.location, data
                        when "UNSIGNED_INT_VEC4"    then gl.uniform4uiv       .bind gl, uniform.location, data

                resolveDefines  = ->
                    i = gl.getProgramParameter program, gl.ACTIVE_ATTRIBUTES
                    v = Object.values WebGL2RenderingContext
                    k = Object.keys WebGL2RenderingContext

                    lengthOf =
                        vec4 : 4
                        vec3 : 3
                        vec2 : 2
                        mat4 : 4 * 4
                        mat3 : 3 * 3

                    attribs = while i--
                        attrib              = gl.getActiveAttrib program, i
                        attrib.is           = "attribute"
                        attrib.location     = gl.getAttribLocation program, attrib.name
                        attrib.isEnabled    = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_ENABLED
                        attrib.binding      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
                        attrib.typeof       = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_TYPE
                        attrib.kindof       = k.at v.indexOf attrib.typeof 
                        attrib.isNormalized = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
                        attrib.stride       = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_STRIDE
                        attrib.integer      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_INTEGER
                        attrib.divisor      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_DIVISOR
                        attrib.kind         = k.at v.indexOf attrib.type
                        attrib.offset       = ATTRIBS_BYTELENGTH
                        attrib.length       = lengthOf[ attrib.kind.split(/_/).at(-1).toLowerCase() ]

                        ATTRIBS_LENGTH     += attrib.length
                        ATTRIBS_BYTELENGTH  = ATTRIBS_LENGTH * 4
                        attrib

                    for attrib in attribs
                        attrib.stride       = ATTRIBS_BYTELENGTH
                        attrib.enable       = gl.enableVertexAttribArray.bind gl, attrib.location
                        attrib.rebind       = gl.vertexAttribPointer.bind(
                            gl, attrib.location, attrib.length, attrib.typeof, 
                            attrib.isNormalized, attrib.stride, attrib.offset
                        )

                        Object.defineProperties defines[ attrib.name ] = attrib, value :
                            get : -> gl.getVertexAttrib @location, gl.CURRENT_VERTEX_ATTRIB

                    i = gl.getProgramParameter program, gl.ACTIVE_UNIFORMS
                    uniforms = while i--
                        uniform             = gl.getActiveUniform program, i
                        uniform.is          = "uniform"
                        uniform.kind        = k.at v.indexOf uniform.type
                        uniform.location    = gl.getUniformLocation program, uniform.name
                        uniform.bindUpload  = resolveUniform uniform 

                        Object.defineProperties defines[ uniform.name ] = uniform, value :
                            get : -> gl.getUniform program, @location
                            set : ( data ) -> @bindUpload( data )()

                resolveDefines()

            allocPoints     : ( matter ) ->
                byteOffset = @pointsOffset
                pointCount = matter.vertices.count
                byteLength = pointCount * @BYTES_PER_ATTRIBUTE

                begin = byteOffset / 4
                count = byteLength / 4 

                @pointsCount += pointCount
                @pointsOffset += byteLength

                Object.assign new Draw( null, matter.shader = this ), {
                    begin, count, offset: byteOffset,
                    type : WebGL2RenderingContext.POINTS
                }

            allocLines      : ( matter ) ->
                byteOffset = @linesOffset
                pointCount = matter.vertices.count
                byteLength = pointCount * @BYTES_PER_ATTRIBUTE

                begin = byteOffset / 4
                count = byteLength / 4 

                @linesCount += pointCount
                @linesOffset += byteLength

                Object.assign new Draw( null, matter.shader = this ), {
                    begin, count, offset: byteOffset,
                    type : WebGL2RenderingContext.LINES
                }

            allocTriangles  : ( matter ) ->
                byteOffset = @trianglesOffset
                pointCount = matter.vertices.count
                byteLength = pointCount * @BYTES_PER_ATTRIBUTE

                begin = byteOffset / 4
                count = byteLength / 4 

                @trianglesCount += pointCount
                @trianglesOffset += byteLength

                Object.assign new Draw( null, matter.shader = this ), {
                    begin, count, offset: byteOffset,
                    type : WebGL2RenderingContext.TRIANGLES
                }

        Object.defineProperties vShader::,

            drawBuffer      :
                get : -> new Float32Array buffer, @byteOffset, BYTELENGTH_GLBUFFER/4

            BYTES_PER_ATTRIBUTE :
                get : -> ui8[ @byteOffset + @INDEX_BYTES_PER_ATTR ]
                set : (v) -> ui8[ @byteOffset + @INDEX_BYTES_PER_ATTR ] = v

            isBinded        :
                get : -> ui8[ @byteOffset + @INDEX_GLBUFFER_BOUND ]
                set : (v) -> ui8[ @byteOffset + @INDEX_GLBUFFER_BOUND ] = v

            glBuffer        :
                get : -> buffers[ ui8[ @byteOffset + @INDEX_GLBUFFER_INDEX ] ]
                set : (v) -> ui8[ @byteOffset + @INDEX_GLBUFFER_INDEX ] = buffers.register v

            pointsStart     :
                get : -> u32[ @begin + @INDEX_POINTS_START ]
                set : ( v ) -> u32[ @begin + @INDEX_POINTS_START ] = v

            linesStart      :
                get : -> u32[ @begin + @INDEX_LINES_START ]
                set : ( v ) -> u32[ @begin + @INDEX_LINES_START ] = v

            trianglesStart  :
                get : -> u32[ @begin + @INDEX_TRIANGLES_START ]
                set : ( v ) -> u32[ @begin + @INDEX_TRIANGLES_START ] = v

            pointsCount     :
                get : -> u32[ @begin + @INDEX_POINTS_COUNT ]
                set : ( v ) -> u32[ @begin + @INDEX_POINTS_COUNT ] = v

            linesCount      :
                get : -> u32[ @begin + @INDEX_LINES_COUNT ]
                set : ( v ) -> u32[ @begin + @INDEX_LINES_COUNT ] = v

            trianglesCount  :
                get : -> u32[ @begin + @INDEX_TRIANGLES_COUNT ]
                set : ( v ) -> u32[ @begin + @INDEX_TRIANGLES_COUNT ] = v

            pointsOffset    :
                get : -> u32[ @begin + @INDEX_POINTS_OFFSET ]
                set : ( v ) -> u32[ @begin + @INDEX_POINTS_OFFSET ] = v

            linesOffset     :
                get : -> u32[ @begin + @INDEX_LINES_OFFSET ]
                set : ( v ) -> u32[ @begin + @INDEX_LINES_OFFSET ] = v

            trianglesOffset :
                get : -> u32[ @begin + @INDEX_TRIANGLES_OFFSET ]
                set : ( v ) -> u32[ @begin + @INDEX_TRIANGLES_OFFSET ] = v

        classes.register class fShader  extends Shader
            name : "fShader"
            type : WebGL2RenderingContext.FRAGMENT_SHADER

            fShader : yes

        classes.register class Shader extends Pointer

            GPU_ATTRIBUTE_COUNT : 1e5 

            isShader            : yes

            Object.defineProperties Shader::,
                gl          : get : Shader::parentGLContext  , set : Shader::setGLContext
                glProgram   : get : Shader::parentGLProgram  , set : Shader::setGLProgram

            Object.defineProperties Shader::,
                active      : get : Shader::getActive          , set : Shader::setActive
                source      : get : Shader::getSource          , set : Shader::setSource

            Object.deleteProperties Shader::, [ "linked" ]

            getGLContext        : ->
                @storage[ getResvUint8 this, 2 ]

            parentGLContext     : ->
                @storage[ getResvUint8 this, 2 ] or
                @gl = @parent.gl

            createGLContext     : ->
                if  storei = getResvUint8 this, 2
                    return @storage[ storei ]

                throw /DONOT_CREATE_GL/ unless isWindow
                canvas = document.createElement 'canvas'

                Object.assign canvas, {
                    width   : RATIO_PIXEL * INNER_WIDTH
                    height  : RATIO_PIXEL * INNER_HEIGHT
                    style   :
                        width      : CSS.px INNER_WIDTH
                        height     : CSS.px INNER_HEIGHT
                        inset      : CSS.px 0
                        position   : "fixed"
                } 

                @gl = document.body
                    . appendChild canvas
                    . getContext "webgl2" 

            setGLContext        : ( webGL2RenderingContext ) ->
                setResvUint8 this, 2, @store webGL2RenderingContext

            getGLProgram        : ->
                @storage[ getResvUint8 this, 3 ]

            setGLProgram        : ( webGLProgram ) ->
                setResvUint8 this, 3, @store webGLProgram 

            parentGLProgram    : ->
                @storage[ getResvUint8 this, 3 ] or
                @glProgram = @parent.glProgram

            createGLProgram     : ->
                @storage[ getResvUint8 this, 3 ] or
                @glProgram = @gl.createProgram()

            activeGLProgram     : ->
                #? space searching an glProgram
                if  storei = getResvUint8 this, 3
                    return @storage[ storei ]

                programs = findChildsRecursive this, Program

                return unless programs.length
                unless program = programs.find (s) -> s.active 
                    program = programs.at 0
                @glProgram = program.glProgram

            getGLBuffer         : ->
                @storage[ getResvUint8 this, 4 ]

            setGLBuffer         : ( webGLBuffer ) ->
                setResvUint8 this, 4, @store webGLBuffer

            activeGLBuffer      : ->
                #? space searching an glBuffer
                if  storei = getResvUint8 this, 4
                    return @storage[ storei ]

                vShaders = findChildsRecursive this, VertexShader

                return unless vShaders.length
                unless vShader = vShaders.find (s) -> s.active 
                    vShader = vShaders.at 0
                @glBuffer = vShader.glBuffer

            createGLBuffer      : ->
                #? vertex shader creates new buffer
                @storage[ getResvUint8 this, 4 ] or
                @glBuffer = @gl.createBuffer()

            parentGLBuffer      : ->
                #? draw looks vertex shaders buffer
                @storage[ getResvUint8 this, 4 ] or
                @glBuffer = @parent.glBuffer

            getGLShader         : ->
                @storage[ getResvUint8 this, 5 ]

            setGLShader         : ( webGLShader ) ->
                if @isVShader 
                    @setGLVShader webGLShader 
                else @setGLFShader webGLShader

                setResvUint8 this, 5, @store webGLShader

            getGLVShader        : ->
                @storage[ getResvUint8 this, 6 ]

            setGLVShader        : ( webGLShader ) ->
                setResvUint8 this, 6, @store webGLShader

            createGLVShader     : ->
                #? vertexShader creating new one
                @storage[ getResvUint8 this, 6 ] or
                @glShader = @gl.createShader @gl.VERTEX_SHADER

            parentGLVShader     : ->
                #? matter or draw searching glVShader
                @storage[ getResvUint8 this, 6 ] or
                @glVShader = @parent.glVShader or @parent.parent.glVShader

            activeGLVShader     : ->
                #? space searching an glVShader
                if  storei = getResvUint8 this, 6
                    return @storage[ storei ]

                shaders = findChildsRecursive this, VertexShader

                unless shaders.length
                    return undefined

                unless shader = shaders.find (s) -> s.active 
                    shader = shaders.at 0
                @glVShader = shader.glShader

            getGLFShader        : ->
                @storage[ getResvUint8 this, 7 ]

            setGLFShader        : ( webGLShader ) ->
                setResvUint8 this, 7, @store webGLShader

            createGLFShader     : ->
                @storage[ getResvUint8 this, 7 ] or
                @glShader = @gl.createShader @gl.FRAGMENT_SHADER

            parentGLFShader     : ->
                @storage[ getResvUint8 this, 7 ] or
                @glFShader = @parent.glFShader or @parent.parent.glFShader

            activeGLFShader     : ->
                #? space searching an glFShader
                if  storei = getResvUint8 this, 7
                    return @storage[ storei ]

                shaders = findChildsRecursive this, FragmentShader

                return unless shaders.length
                unless shader = shaders.find (s) -> s.active 
                    shader = shaders.at 0
                @glFShader = shader.glShader

            getActive       : ->
                getResvUint8 this, 0

            setActive       : ( v ) ->
                setResvUint8 this, 0, v

            getBinded       : ->
                getResvUint8 this, 1

            setBinded       : ( v ) ->
                setResvUint8 this, 1, v

            getSource       : ->
                @gl.getShaderSource @glShader 

            setSource       : ( source ) ->
                @compile @gl.shaderSource @glShader, source

            compile         : ->
                @attach @gl.compileShader @glShader

            attach          : ->
                @active = 1
                @gl.attachShader @glProgram, @glShader ; this

            detach          : ->
                @active = 0
                @gl.detachShader @glProgram, @glShader ; this

            destroy         : ->
                @detach()
                @gl.deleteShader @glShader ; this

        classes.register class FragmentShader extends Shader

            shaderType      : WebGL2RenderingContext.FRAGMENT_SHADER

            isFShader       : yes

            getGLObject     : -> @glFragmentShader

            attach          : ->
                return this if @active

                if  fShader = @parent.fShader
                    fShader . detach()

                @parent . glFShader = @glShader

                return super()

            Object.defineProperties FragmentShader,
                DocumentScripts : get : ->
                    [ ...document.scripts ].filter (s) -> s.text.match /gl_FragColor/

            Object.defineProperties FragmentShader::,

                glShader    : get : Shader::createGLFShader   , set : Shader::setGLShader

        classes.register class VertexShader extends Shader

            shaderType              : WebGL2RenderingContext.VERTEX_SHADER

            isVShader               : yes

            POINTS                  : WebGL2RenderingContext.POINTS

            LINES                   : WebGL2RenderingContext.LINES

            TRIANGLES               : WebGL2RenderingContext.TRIANGLES

            INDEX_TRIANGLES_COUNT   : 0

            INDEX_TRIANGLES_ALLOC   : 1

            INDEX_TRIANGLES_START   : 2

            INDEX_LINES_COUNT       : 3

            INDEX_LINES_ALLOC       : 4

            INDEX_LINES_START       : 5

            INDEX_POINTS_COUNT      : 6

            INDEX_POINTS_ALLOC      : 7

            INDEX_POINTS_START      : 8

            INDEX_ALLOC_BYTELENGTH_PER_TYPE   : 9 

            INDEX_ALLOC_LENGTH_PER_POINT      : 10

            INDEX_ALLOC_BYTELENGTH_PER_POINT  : 11

            INDEX_DEFINITIONS_OBJECT          : 12

            INDEX_DRAWBUFFER_STARTS           : 16

            Object.defineProperties VertexShader,
                DocumentScripts : get : ->
                    [ ...document.scripts ].filter (s) -> s.text.match /gl_Position/

            Object.defineProperties VertexShader::,
                stats       : get : VertexShader::dump
                definitons  : get : VertexShader::getDefinitons , set : VertexShader::setDefinitons    

            Object.defineProperties VertexShader::,
                glShader    : get : Shader::createGLVShader   , set : Shader::setGLShader
                glBuffer    : get : Shader::createGLBuffer    , set : Shader::setGLBuffer

            getGLObject     : -> @glVertexShader

            attach          : ->
                return this if @active

                if  vShader = @parent.vShader
                    vShader . detach()

                @parent . glVShader = @glShader

                return super()

            getDefinitons   : ->
                @storage[ getUint32 this, @INDEX_DEFINITIONS_OBJECT ]

            setDefinitons   : ( object = {} ) ->
                setUint32 this, @INDEX_DEFINITIONS_OBJECT, @store object

            dump            : ->
                BYTELENGTH_PER_TYPE  : getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_TYPE
                BYTELENGTH_PER_POINT : getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT
                LENGTH_PER_POINT     : getUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT

                triangles :
                    alloc : getUint32 this, @INDEX_TRIANGLES_ALLOC
                    start : getUint32 this, @INDEX_TRIANGLES_START
                    count : getUint32 this, @INDEX_TRIANGLES_COUNT

                lines     :
                    alloc : getUint32 this, @INDEX_LINES_ALLOC
                    start : getUint32 this, @INDEX_LINES_START
                    count : getUint32 this, @INDEX_LINES_COUNT

                points    :
                    alloc : getUint32 this, @INDEX_POINTS_ALLOC
                    start : getUint32 this, @INDEX_POINTS_START
                    count : getUint32 this, @INDEX_POINTS_COUNT                

            draw            : ( mesh, type = @LINES ) ->
                byteLength = mesh.pointCount * getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT
                length     = mesh.pointCount * getUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT

                index = switch type
                    when @LINES      then @INDEX_LINES_COUNT
                    when @POINTS     then @INDEX_POINTS_COUNT
                    when @TRIANGLES  then @INDEX_TRIANGLES_COUNT
                    else throw /UNKNOWN_DRAW_TYPE/ + type

                Object.assign new Draw(),
                    drawType   : type
                    drawCount  : mesh.pointCount
                    drawStart  : getUint32( this, index+2 ) + addUint32 this, index, mesh.pointCount
                    drawOffset : offset = addUint32( this, index+1, byteLength ) - getByteOffset(this)
                    readBegin  : begin = offset / 4 
                    readLength : length
                    byteOffset : getByteOffset(this) + begin * 4
                    byteLength : length * 4
                    parent     : this
                    linked     : mesh

            create          : ( definitions ) ->            

                attibuteByteLength = 0
                for key, def of definitions when def.is.match /attr/
                    attibuteByteLength += def.length * @BPE
                attibuteByteLength += 4 - attibuteByteLength % 4

                drawByteAlloc  = attibuteByteLength * @GPU_ATTRIBUTE_COUNT
                drawByteAlloc -= drawByteAlloc % 3

                @malloc drawByteAlloc

                typeByteAlloc  = drawByteAlloc / 3
                typeByteAlloc -= typeByteAlloc % attibuteByteLength
                typeDrawCount  = typeByteAlloc / attibuteByteLength

                paddingCount   = Math.max 1, Math.ceil( 
                    @INDEX_DRAWBUFFER_STARTS * @BPE / attibuteByteLength
                )
                paddingAlloc   = paddingCount * attibuteByteLength

                setUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_TYPE   , typeByteAlloc
                setUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT  , attibuteByteLength
                setUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT      , attibuteByteLength / 4

                setUint32 this, @INDEX_TRIANGLES_START , paddingCount 
                setUint32 this, @INDEX_TRIANGLES_ALLOC , paddingAlloc 

                setUint32 this, @INDEX_LINES_START     , typeDrawCount 
                setUint32 this, @INDEX_LINES_ALLOC     , typeByteAlloc 

                setUint32 this, @INDEX_POINTS_START    , typeDrawCount * 2 
                setUint32 this, @INDEX_POINTS_ALLOC    , typeByteAlloc * 2 

                @gl.bindBuffer @gl.ARRAY_BUFFER, @glBuffer
                @gl.bufferData @gl.ARRAY_BUFFER, drawByteAlloc, @gl.STATIC_DRAW

                @setDefinitons definitions

                this

            parseSource     : ( source = @source ) ->
                canvas = new OffscreenCanvas 0, 0
                gl = canvas.getContext "webgl2"

                program = gl.createProgram()
                shader  = gl.createShader gl.VERTEX_SHADER

                gl.shaderSource shader, source
                gl.compileShader shader

                unless gl.getShaderParameter shader, gl.COMPILE_STATUS
                    info = gl.getShaderInfoLog shader
                    throw "Could not compile WebGL shader. \n\n#{info}"

                shader2  = gl.createShader 35632
                source2  = "void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }"; 

                gl.shaderSource shader2, source2
                gl.compileShader shader2

                gl.attachShader program, shader
                gl.attachShader program, shader2

                gl.linkProgram program

                gl.bindBuffer gl.ARRAY_BUFFER, buf = gl.createBuffer()
                gl.bufferData gl.ARRAY_BUFFER, 256, gl.STATIC_DRAW

                gl.useProgram program

                unless gl.getProgramParameter program, gl.LINK_STATUS
                    info = gl.getProgramInfoLog program
                    throw "Could not compile WebGL program. \n\n#{info}"

                i = gl.getProgramParameter program, gl.ACTIVE_ATTRIBUTES
                v = Object.values WebGL2RenderingContext
                k = Object.keys WebGL2RenderingContext

                lengthOf =
                    vec4 : 4
                    vec3 : 3
                    vec2 : 2
                    mat4 : 4 * 4
                    mat3 : 3 * 3

                ATTRIBS_LENGTH = 0
                ATTRIBS_BYTELENGTH = 0

                attribs = while i--
                    attrib              = gl.getActiveAttrib program, i
                    attrib.is           = "attribute"
                    attrib.kind         = k.at v.indexOf attrib.type
                    attrib.class        = classes.find (c) -> c::name is attrib.name
                    attrib.location     = gl.getAttribLocation program, attrib.name
                    attrib.typeof       = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_TYPE
                    attrib.kindof       = k.at v.indexOf attrib.typeof 
                    attrib.offset       = ATTRIBS_BYTELENGTH
                    attrib.length       = lengthOf[ attrib.kind.split(/_/).at(-1).toLowerCase() ]

                    ATTRIBS_LENGTH     += attrib.length
                    ATTRIBS_BYTELENGTH  = ATTRIBS_LENGTH * 4

                    attrib

                for attrib in attribs
                    attrib.stride       = ATTRIBS_BYTELENGTH
                    gl.enableVertexAttribArray i = attrib.location

                    gl.vertexAttribPointer(
                        attrib.location, attrib.length, attrib.typeof, 
                        attrib.isNormalized, attrib.stride, attrib.offset
                    )

                    attrib.isEnabled    = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_ENABLED
                    attrib.isNormalized = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
                    attrib.integer      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_INTEGER
                    attrib.divisor      = gl.getVertexAttrib i, gl.VERTEX_ATTRIB_ARRAY_DIVISOR                

                    gl.disableVertexAttribArray i

                i = gl.getProgramParameter program, gl.ACTIVE_UNIFORMS
                uniforms = while i--
                    uniform             = gl.getActiveUniform program, i
                    uniform.is          = "uniform"
                    uniform.kind        = k.at v.indexOf uniform.type
                    uniform.class       = classes.find (c) -> c::name is uniform.name
                    uniform.location    = gl.getUniformLocation program, uniform.name
                    uniform.uploader    = switch uniform.kind
                        when "FLOAT_MAT4"           then "uniformMatrix4fv"
                        when "FLOAT_MAT3"           then "uniformMatrix3fv"
                        when "FLOAT_MAT2"           then "uniformMatrix2fv"
                        when "FLOAT_MAT2x3"         then "uniformMatrix2x3fv"
                        when "FLOAT_MAT2x4"         then "uniformMatrix2x4fv"
                        when "FLOAT_MAT3x2"         then "uniformMatrix3x2fv"
                        when "FLOAT_MAT3x4"         then "uniformMatrix3x4fv"
                        when "FLOAT_MAT4x2"         then "uniformMatrix4x2fv"
                        when "FLOAT_MAT3x3"         then "uniformMatrix4x3fv"
                        when "FLOAT"                then "uniform1f"
                        when "INT"                  then "uniform1iv"
                        when "UNSIGNED_INT"         then "uniform1uiv"
                        when "UNSIGNED_INT_VEC2"    then "uniform2uiv"
                        when "UNSIGNED_INT_VEC3"    then "uniform3uiv"
                        when "UNSIGNED_INT_VEC4"    then "uniform4uiv"
                    uniform

                gl.detachShader program, shader
                gl.detachShader program, shader2

                gl.deleteShader shader
                gl.deleteShader shader2
                gl.deleteProgram program
                gl.deleteBuffer buf

                Space.limits = (await navigator.gpu.requestAdapter()).limits

                shader = shader2 = gl =
                program = canvas = null
                definitions = new Object

                for v in [ uniforms... , ...attribs ]
                    definitions[ v.name ] = v

                definitions

        classes.register class Draw         extends Pointer

            @key            : "draw"

            TypedArray      : Uint32Array

            @byteLength     : 8 * @BPE

            getDrawType     : -> getUint32 this, 0

            setDrawType     : ( v ) -> setUint32 this, 0, v

            getDrawOffset   : -> getUint32 this, 1

            setDrawOffset   : ( v ) -> setUint32 this, 1, v

            getDrawStart    : -> getUint32 this, 2

            setDrawStart    : ( v ) -> setUint32 this, 2, v

            getDrawCount    : -> getUint32 this, 3

            setDrawCount    : ( v ) -> setUint32 this, 3, v

            getReadBegin    : -> getUint32 this, 4

            setReadBegin    : ( v ) -> setUint32 this, 4, v

            getReadLength   : -> getUint32 this, 5

            setReadLength   : ( v ) -> setUint32 this, 5, v

            getByteOffset   : -> getUint32 this, 6

            setByteOffset   : ( v ) -> setUint32 this, 6, v

            getByteLength   : -> getUint32 this, 7

            setByteLength   : ( v ) -> setUint32 this, 7, v

            Object.defineProperties Draw::,

                drawType    : get : Draw::getDrawType   , set : Draw::setDrawType

                drawOffset  : get : Draw::getDrawOffset , set : Draw::setDrawOffset

                drawStart   : get : Draw::getDrawStart  , set : Draw::setDrawStart

                drawCount   : get : Draw::getDrawCount  , set : Draw::setDrawCount

                readBegin   : get : Draw::getReadBegin  , set : Draw::setReadBegin

                readLength  : get : Draw::getReadLength , set : Draw::setReadLength

                byteOffset  : get : Draw::getByteOffset , set : Draw::setByteOffset

                byteLength  : get : Draw::getByteLength , set : Draw::setByteLength

                pointCount  : get : -> @linked.pointCount

            Object.defineProperties Draw::,
                gl          : get : Shader::parentGLContext  , set : Shader::setGLContext
                glProgram   : get : Shader::parentGLProgram  , set : Shader::setGLProgram
                glVShader   : get : Shader::parentGLVShader  , set : Shader::setGLVShader
                glFShader   : get : Shader::parentGLFShader  , set : Shader::setGLFShader
                glBuffer    : get : Shader::parentGLBuffer   , set : Shader::setGLBuffer

        classes.register class Space    extends Pointer

            self.Space      = this

            Object.defineProperties Space::,
                gl          : get : Shader::createGLContext  , set : Shader::setGLContext
                glProgram   : get : Shader::activeGLProgram  , set : Shader::setGLProgram
                glVShader   : get : Shader::activeGLVShader  , set : Shader::setGLVShader
                glFShader   : get : Shader::activeGLFShader  , set : Shader::setGLFShader
                glBuffer    : get : Shader::activeGLBuffer   , set : Shader::setGLBuffer

            Object.defineProperties Space::,
                active      : get : Shader::getActive        , set : Shader::setActive            

            Object.defineProperties Space::,
                vShader     : get : -> findChildsRecursive( this, VertexShader ).find (s) -> s.active
                fShader     : get : -> findChildsRecursive( this, FragmentShader ).find (s) -> s.active 
                program     : get : ->
                    programs = findChildsRecursive this, Program 
                    return unless programs.length

                    unless program = programs.find (s) -> s.inUse
                        program = programs.find (s) -> s.isLinked 
                    program or programs.at(0)

                created     :
                    get     :     -> getResvUint8( this, 1 )          
                    set     : (v) -> setResvUint8( this, 1, v )          

            Object.deleteProperties Space::, [ "buffer", "linked", "parent" ]

            add             : ( ptr ) ->
                super ptr

                if  ptr.drawable
                    @vShader.draw ptr

                this    

            init            : ->
                unless super( arguments... ).created

                    @created = 1
                    throw /THREAD/ unless isWindow

                    setParent new Program(), this

                    for script in VertexShader.DocumentScripts
                        @program.add shader = new VertexShader
                        shader.source = script.text
                        shader.create shader.parseSource()

                    for script in FragmentShader.DocumentScripts
                        @program.add shader = new FragmentShader
                        shader.source = script.text

                    @program.use()

                this
        class Pointer       extends Number

            @byteLength : 0

            @subclasses : []

            @TypedArray : Float32Array

            Object.defineProperty this  , "classId",
                configurable: on
                get : -> Object.defineProperty( this, "classId",
                    value : classes.register( this )
                ).classId

            Object.defineProperty this::, "byteOffset",
                get : -> Atomics.load i32, @ptri + PTR_BYTEOFFSET

            Object.defineProperty this::, "classId",
                get : -> Atomics.load i32, @ptri + PTR_CLASSID

            Object.defineProperty this::, "byteLength",
                get : -> Atomics.load i32, @ptri + PTR_BYTELENGTH

            Object.defineProperty this::, "length",
                get : -> Atomics.load i32, @ptri + PTR_LENGTH

            Object.defineProperty this::, "ptri",
                get : -> Atomics.load i32, this

            Object.defineProperty this::, "begin",
                get : -> Atomics.load i32, @ptri + PTR_BEGIN

            Object.defineProperty this::, "isGL",
                get : -> Atomics.load i32, @ptri + PTR_ISGL
                set : (v) -> Atomics.store i32, @ptri + PTR_ISGL, v

            Object.defineProperty this::, "parent",
                get : -> Atomics.load i32, @ptri + PTR_PARENT
                set : (v) -> Atomics.store i32, @ptri + PTR_PARENT, parseInt v

            Object.defineProperty this::, "children",
                get : -> 
                    ptri = Atomics.load i32, 1
                    test = this.ptri

                    children = []
                    while OFFSET_PTR <= ptri -= 16
                        unless test - Atomics.load i32, ptri + PTR_PARENT
                            classId = Atomics.load i32, ptri + PTR_CLASSID
                            children.push new (classes[ classId ])( ptri )
                    children

            Object.defineProperty this::, "iterCount",
                get : -> Atomics.load u32, @ptri + PTR_ITER_COUNT
                set : (v) -> Atomics.store u32, @ptri + PTR_ITER_COUNT, v

            Object.defineProperty this::, "typedArray",
                get : -> new this.constructor.TypedArray buffer, @byteOffset, @length

            @allocs     : ( parent ) ->
                ptri = Atomics.load i32, 1
                classId = @classId

                while OFFSET_PTR <= ptri -= 16        
                    continue unless classId is Atomics.load i32, ptri + PTR_CLASSID
                    continue if parent and parent isnt Atomics.load i32, ptri + PTR_PARENT
                    object = new this ptri

            @malloc     : ( constructor, byteLength ) ->
                @classId
                offset = @byteLength
                mod = offset % 4
                offset += 4 - mod
                byteLength ?= constructor.byteLength
                byteLength += 4 - byteLength % 4

                @subclasses.push {
                    constructor : constructor
                    offset : offset
                    byteLength : byteLength
                    index : @subclasses.length
                    classId : constructor.classId
                }

                Object.defineProperty this::, constructor.label, {
                    get : constructor::get offset 
                    set : constructor::set offset 
                }

                @byteLength += byteLength
                offset

            constructor : ( ptri, parent ) ->
                unless ptri = parseInt super ptri
                    ptri = malloc @constructor
                    return new @constructor ptri, parent 

                @parent = parent if parent

                @init ptri

            set         : ( value, index = 0 ) ->
                @typedArray.set value, index ; this

            init        : -> this

            subarray    : ( begin, end ) ->
                new @constructor.TypedArray buffer, @byteOffset + begin * 4, end - begin

        class Position      extends Pointer

            @byteLength : 4 * 4

            @label      : "position"

            get : ( offset ) -> ->
                new Float32Array buffer, @byteOffset + offset, 3

            set : ( offset ) -> ( value ) ->
                f32.set value, ( @byteOffset + offset ) / 4

        class Color         extends Pointer

            @byteLength : 4 * 4

            @label : "color"

            get : ( offset ) -> ->
                new Float32Array buffer, @byteOffset + offset, 4

            set : ( offset ) -> ( value ) ->
                f32.set value, ( @byteOffset + offset ) / 4

        class Rotation      extends Pointer

            @byteLength : 4 * 4

            @label : "rotation"

            get : ( offset ) -> ->
                new Float32Array buffer, @byteOffset + offset, 3

            set : ( offset ) -> ( value ) ->
                f32.set value, ( @byteOffset + offset ) / 4

        class Scale         extends Pointer

            @byteLength : 3 * 4

            @label      : "scale"

            get : ( offset ) -> ->
                new Float32Array buffer, @byteOffset + offset, 3

            set : ( offset ) -> ( value ) ->
                f32.set value, ( @byteOffset + offset ) / 4

        class Vertices      extends Pointer

            @label          : "vertices"

            Object.defineProperties this::,
                pointCount  : get : ->
                    @length / 3

            get : ( offset ) -> ->
                ptri = dvw.getInt32 @byteOffset + @OFFSET_VERTICES, LE
                return new Vertices ptri if ptri ; null

            set : ( offset ) -> ( value ) ->
                ptri = malloc Vertices, value.length * 4
                dvw.setInt32 @byteOffset + @OFFSET_VERTICES, ptri, LE
                f32.set value, i32[ ptri + PTR_BEGIN ]

        return

        checkUploads    = ->
            for mesh in Mesh.allocs()
                continue unless mesh.willUploadIfNeeded

                gl.bufferSubData(
                    gl.ARRAY_BUFFER, draw.uploadOffset,
                    space.drawBuffer, draw.uploadBegin,
                    draw.uploadLength
                ) for draw in GLDraw.allocs mesh.ptri

        @render         = ->
            rendering = 1

            for l, define of defines when define.is.match /attr/i
                try define.enable() ; define.rebind()

            onanimationframe = ( pnow ) ->

                delta = pnow - epoch
                epoch = pnow
                fps   = Math.trunc 1 / delta * 1e3

                space.upload()
                emit "animationframe", { gl, delta, epoch, fps }

                space.drawArrays()
                requestAnimationFrame onanimationframe

            onanimationframe performance.now()

        initialProgram  = ->

            vSource = scripts.find((s) -> s.type.match /x-vert/i).text
            vShader = gl.createShader gl.VERTEX_SHADER

            gl.shaderSource vShader, vSource
            gl.compileShader vShader

            unless gl.getShaderParameter vShader, gl.COMPILE_STATUS
                info = gl.getShaderInfoLog vShader
                throw "Could not compile WebGL program. \n\n#{info}"

            fSource = scripts.find((s) -> s.type.match /x-frag/i).text
            fShader = gl.createShader gl.FRAGMENT_SHADER

            gl.shaderSource fShader, fSource
            gl.compileShader fShader

            unless gl.getShaderParameter fShader, gl.COMPILE_STATUS
                info = gl.getShaderInfoLog fShader
                throw "Could not compile WebGL program. \n\n#{info}"

            program = gl.createProgram()

            gl.attachShader program, vShader
            gl.attachShader program, fShader

            gl.linkProgram program

            unless gl.getProgramParameter program, gl.LINK_STATUS
                info = gl.getProgramInfoLog program
                throw "Could not compile WebGL program. \n\n#{info}"

            gl.bindBuffer gl.ARRAY_BUFFER, gBuffer = gl.createBuffer()
            gl.bufferData gl.ARRAY_BUFFER, BYTELENGTH_GLBUFFER, gl.STATIC_DRAW

            gl.useProgram program

            0

        createFrustrum  = ( options ) ->
            frustrum = Frustrum.fromOptions options 
            frustrum . setViewport gl
            frustrum . listenWindow()

        @createDisplay  = ->
            return;
            space = new Space()

            initialProgram()
            createFrustrum()

            requestIdleCallback =>
                self.emit "contextrestored", gl
                pipe.emit "contextrestored"

        createCanvas    = ->
            canvas                  = document.createElement "canvas"
            canvas.width            = RATIO_PIXEL * INNER_WIDTH
            canvas.height           = RATIO_PIXEL * INNER_HEIGHT
            canvas.style.width      = CSS.px INNER_WIDTH
            canvas.style.height     = CSS.px INNER_HEIGHT
            canvas.style.inset      = CSS.px 0
            canvas.style.position   = "fixed"

            document.body.appendChild canvas

        createWorker    = ( name, blob ) ->

            worker = new Worker( blob, { name } )
            worker . onerror = 
            worker . onmessageerror = console.error
            worker . onmessage = ({ data }) ->
                workers.push Object.assign this, data
                emit "threadstatechange", { thread: this }

            Object.defineProperties worker, state :
                get : Atomics.load.bind Atomics, i32, name 
                set : (v) -> error "worker state change request"

            classIndexes = []
            classIndexes . push {
                name : c.name, index: i
            } for c, i in classes

            worker . postMessage { buffer, classIndexes }

        createThreads   = ->
            blob = createBlobURL()
            for i in [ 0 ... THREADS_COUNT ]
                thread = createWorker i + THREADS_BEGIN, blob
            on

        createBlobURL   = ->
            code = "#{self.init}".split("return " + "0xdead;")[0]

            blobURL = URL.createObjectURL new Blob [
                "(", code, "}).call(self);"
            ], { type: "application/javascript" }

            delete self.init ; return blobURL

        listenEvents    = ->
            document.body.style.overscrollBehavior = "none"
            document.body.style.height = CSS.vh 100
            document.body.style.margin = 0

            prevent = (e) ->
                buffer = null
                try e.preventDefault()
                w.terminate() for w in workers
                ; 1

            window.onerror              = prevent
            window.onunload             = prevent
            window.onpagehide           = prevent
            window.onbeforeunload       = prevent
            window.onunhandledrejection = prevent

        createThreads()

        listenEvents()

    self.addEventListener "DOMContentLoaded"    , ->

        root = new Document

        for element in [ ...document.scripts ]
            setParent script = new DocumentScript, root
            setObject script , element
            script.resolve()

        userScript = findChild root, UserScript, on
        userScript . append()

    self.addEventListener "bufferready"         , ->
        #log "bufferready:", buffer

        ui8 = new Uint8Array buffer
        u16 = new Uint16Array buffer
        u32 = new Uint32Array buffer
        u64 = new BigUint64Array buffer
        f32 = new Float32Array buffer
        dvw = new DataView buffer
        i32 = new Int32Array buffer
        space = new Space()

        emit "threadready"

    self.addEventListener "threadready"         , ->
        state STATE_READY
        postMessage { threadId, uuid }

    self.addEventListener "threadsready"        , ->
        #warn "all threads are ready"
        state THREADS_READY
        @createDisplay()

    self.addEventListener "threadstatechange"   , ->
        unless workers.find (w) -> w.state isnt STATE_READY
            emit "threadsready" if state() isnt THREADS_READY

    self.addEventListener "dblclick"            , ->
        console.table workers.map (w) ->
            state : w.state
            uuid : w.uuid
            threadId : w.threadId

    self.addEventListener "message"             , ({ data }) ->
        uuid = crypto.randomUUID()
        buffer = data.buffer
        threadId = parseInt self.name

        orderedClasses = []

        for c in data.classIndexes
            unless constructor = classes.find (_class) -> _class.name is c.name
                throw [ "CLASS_NOT_FOUND" , c ]
            orderedClasses[ c.index ] = constructor

        classes.splice 0, classes.length
        classes.push orderedClasses...
        orderedClasses.length = 0

        emit "bufferready"

    pipe.addEventListener "message"             , ({ data }) ->
        switch data
            when "contextrestored" then nextTick()
            else error "pipe.onmessage:", data

    return 0xdead;

 */
(self.main = function() {
  var ALIGN_BYTELENGTH, AnimationFrame, BUFFER_SIZE, BYTES_PER_ELEMENT, CallBinding, Class, ClearColor, ClearMask, Color, DRAWING_DONE, DrawCall, EVENTID_SET, EventHandler, HEADER_BYTELENGTH, HEADER_LENGTH, INDEX_DATA_MALLOC, INDEX_PTRI_MALLOC, INTEGRITY_RESVTCLSI, INTEGRITY_RESVTEXCL, Integrity, Location, MALLOC_BYTEOFFSET, MESH_DRAW_STATE, Mesh, NEEDS_MALLOC, NEEDS_UPDATE, NEEDS_UPLOAD, POINTER_MAXINDEX, PTRKEY, PTR_ACTIVE, PTR_BEGIN, PTR_BYTELENGTH, PTR_BYTEOFFSET, PTR_CLASSI, PTR_EVENTID, PTR_EVENTRECSV, PTR_EVNTCALLS, PTR_EVTMXCALL, PTR_INITIAL, PTR_LENGTH, PTR_LINKEDI, PTR_PARENT, PTR_RESVBEGIN, Pointer, Position, Program, RenderingContext, Rotation, STATE, Scale, Scene, Scope, Storage, TextPointer, UPDATING_NOW, Viewport, agetResvUint8, asetResvUint8, c, cscope, decodeText, desc, dvw, emitEvent, emitInform, encodeText, f32, findActiveChild, findChild, findChilds, get, getActive, getBegin, getByteLength, getByteOffset, getClassIndex, getEventCalls, getEventId, getEventMaxCall, getEventRcsv, getFloat32, getInited, getLength, getLinked, getParent, getResvUint16, getResvUint32, getResvUint64, getResvUint8, getUint16, getUint32, getUint64, getUint8, hitEventCalls, i, i32, iLE, isPointer, isWindow, isWorker, j, key, label, len, malign, malloc, mallocExternal, palloc, property, ptrByteCompare, ptrIterator, ptrStringify, ptrViewCompare, ref, ref1, ref2, ref3, ref4, sab, set, setActive, setBegin, setByteLength, setByteOffset, setClassIndex, setEventCalls, setEventId, setEventMaxCall, setEventRcsv, setFloat32, setInited, setLength, setLinked, setParent, setResvUint16, setResvUint32, setResvUint64, setResvUint8, setUint16, setUint32, setUint64, setUint8, strNumberify, subarrayPtri, textDecoder, textEncoder, u16, u32, u64, ui8, val;
  isWorker = typeof DedicatedWorkerGlobalScope !== "undefined" && DedicatedWorkerGlobalScope !== null;
  isWindow = !isWorker;
  BUFFER_SIZE = 1e6 * 8;
  BYTES_PER_ELEMENT = 4;
  HEADER_LENGTH = 16;
  POINTER_MAXINDEX = 1e5;
  HEADER_BYTELENGTH = HEADER_LENGTH * BYTES_PER_ELEMENT;
  ALIGN_BYTELENGTH = 8;
  MALLOC_BYTEOFFSET = HEADER_BYTELENGTH * POINTER_MAXINDEX;
  INDEX_PTRI_MALLOC = 0;
  INDEX_DATA_MALLOC = 1;
  PTR_BYTEOFFSET = 0 * 4;
  PTR_BYTELENGTH = 1 * 4;
  PTR_LENGTH = 2 * 4;
  PTR_BEGIN = 3 * 4;
  PTR_PARENT = 4 * 4;
  PTR_CLASSI = 5 * 4;
  PTR_ACTIVE = 6 * 4 + 0;
  PTR_INITIAL = 6 * 4 + 1;
  PTR_EVENTID = 6 * 4 + 2;
  
  //TR_EVENARGC        = 7 * 4 + 0
  PTR_EVENTRECSV = 7 * 4 + 1;
  PTR_EVTMXCALL = 8 * 4;
  PTR_EVNTCALLS = 9 * 4;
  PTR_LINKEDI = 10 * 4;
  PTR_RESVBEGIN = 11 * 4;
  PTRKEY = "{{Pointer}}";
  EVENTID_SET = 336;
  STATE = {
    NEEDS_MALLOC: new (NEEDS_MALLOC = class NEEDS_MALLOC extends Number {})(0),
    NEEDS_UPDATE: new (NEEDS_UPDATE = class NEEDS_UPDATE extends Number {})(1),
    UPDATING_NOW: new (UPDATING_NOW = class UPDATING_NOW extends Number {})(2),
    NEEDS_UPLOAD: new (NEEDS_UPLOAD = class NEEDS_UPLOAD extends Number {})(3),
    DRAWING_DONE: new (DRAWING_DONE = class DRAWING_DONE extends Number {})(4)
  };
  for (label in STATE) {
    val = STATE[label];
    STATE[+val] = val;
  }
  if (isWindow) {
    sab = new SharedArrayBuffer(BUFFER_SIZE);
  }
  u64 = new BigUint64Array(sab);
  u32 = new Uint32Array(sab);
  i32 = new Int32Array(sab);
  f32 = new Float32Array(sab);
  ui8 = new Uint8Array(sab);
  u16 = new Uint16Array(sab);
  dvw = new DataView(sab);
  iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  if (isWindow) {
    Atomics.or(u32, INDEX_PTRI_MALLOC, HEADER_BYTELENGTH);
    Atomics.or(u32, INDEX_DATA_MALLOC, MALLOC_BYTEOFFSET);
  }
  malloc = Atomics.add.bind(Atomics, u32, INDEX_DATA_MALLOC);
  palloc = Atomics.add.bind(Atomics, u32, INDEX_PTRI_MALLOC, HEADER_BYTELENGTH);
  malign = function() {
    var b;
    if (b = Atomics.load(u32, INDEX_DATA_MALLOC) % ALIGN_BYTELENGTH) {
      malloc(ALIGN_BYTELENGTH - b);
    }
    return 0;
  };
  Object.defineProperties(Object, {
    deleteProperty: {
      value: function(target, prop) {
        Reflect.defineProperty(target, prop, {
          value: 0
        });
        Reflect.deleteProperty(target, prop);
        return target;
      }
    },
    deleteProperties: {
      value: function(target, ...props) {
        var j, len, p;
        for (j = 0, len = props.length; j < len; j++) {
          p = props[j];
          this.deleteProperty(target, p);
        }
        return target;
      }
    }
  });
  Storage = class Storage extends Array {
    constructor() {
      super(Object);
    }

    store(object) {
      var i;
      if (-1 === (i = this.indexOf(object))) {
        i += this.push(object);
      }
      return i;
    }

    newptr(ptri) {
      return new this[getClassIndex(ptri)](ptri);
    }

  };
  cscope = new (Scope = class Scope extends Storage {
    global(Class) {
      var i;
      i = this.store(Class);
      return self[Class.name] = (function(Class, argv) {
        var object;
        if (!argv || !isNaN(argv)) {
          return new Class(argv);
        }
        object = new Class;
        return object.init(argv);
      }).bind(null, Class);
    }

    indexOf(ClassOrPtri) {
      var key, ptri;
      if (!ClassOrPtri) {
        return -1;
      }
      if (ClassOrPtri.isPClass) {
        return super.indexOf(ClassOrPtri);
      }
      if (ClassOrPtri.isPointer) {
        return super.indexOf(ClassOrPtri.constructor);
      }
      if ("string" === typeof (key = ClassOrPtri)) {
        return this.findIndex(function(c) {
          return c.key === key;
        }) || -1;
      }
      if (!isNaN(ptri = ClassOrPtri)) {
        return dvw.getUint32(PTR_CLASSI + ptri, iLE) || -1;
      }
      throw [/WHAT_IS_THIS/, ClassOrPtri];
    }

  });
  findChild = function(ptri, Class, create = false, superfind = false) {
    var clsi, ptrj, ptrp;
    ptrj = dvw.getUint32(0, iLE);
    if (!ptri) {
      //? returns last created Class in Global
      if (-1 === (clsi = cscope.indexOf(Class))) {
        throw /POINTER_OR_CLASS_REQUIRED/;
      }
      while (ptrj -= HEADER_BYTELENGTH) {
        if (clsi - dvw.getUint32(PTR_CLASSI + ptrj, iLE)) {
          continue;
        }
        return new Class(ptrj);
      }
    } else {
      if (-1 === (clsi = cscope.indexOf(Class))) {
        //? returns last child of this
        while (ptrj -= HEADER_BYTELENGTH) {
          if (ptri - dvw.getUint32(PTR_PARENT + ptrj, iLE)) {
            continue;
          }
          Class = cscope[dvw.getUint32(PTR_CLASSI + ptrj, iLE)];
          return new Class(ptrj);
        }
      } else {
        //? returns last Class child of this
        while (ptrj -= HEADER_BYTELENGTH) {
          if (ptri - dvw.getUint32(PTR_PARENT + ptrj, iLE)) {
            continue;
          }
          if (clsi - dvw.getUint32(PTR_CLASSI + ptrj, iLE)) {
            continue;
          }
          return new Class(ptrj);
        }
      }
    }
    if (!superfind && !create) {
      return null;
    }
    if (superfind) {
      if (!(ptrp = dvw.getUint32(PTR_PARENT + ptri, iLE))) {
        if (create) {
          if ("boolean" === typeof superfind) {
            superfind = ptri;
          }
          setParent(ptrj = new Class, superfind);
          return ptrj;
        }
        return null;
      }
      return findChild(ptrp, Class, create, superfind);
    }
    setParent(ptrj = new Class, ptri);
    return ptrj;
  };
  findActiveChild = function(ptri, Class, activate = true, construct = true) {
    var clsi, pasv, ptrj;
    ptrj = dvw.getUint32(0, iLE);
    clsi = cscope.indexOf(Class);
    pasv = 0;
    while (ptrj -= HEADER_BYTELENGTH) {
      if (ptri - dvw.getUint32(PTR_PARENT + ptrj, iLE)) {
        continue;
      }
      if (clsi - dvw.getUint32(PTR_CLASSI + ptrj, iLE)) {
        continue;
      }
      if (!dvw.getUint8(ptri + PTR_ACTIVE)) {
        pasv || (pasv = ptrj);
        continue;
      }
      if (construct) {
        return new Class(ptrj);
      }
      return ptrj;
    }
    if (!activate) {
      return 0;
    }
    if (pasv) {
      dvw.setUint8(pasv + PTR_ACTIVE, 1);
    } else {
      pasv = palloc();
      dvw.setUint8(pasv + PTR_ACTIVE, 1);
      dvw.setUint32(pasv + PTR_CLASSI, clsi, iLE);
      dvw.setUint32(pasv + PTR_PARENT, ptri, iLE);
    }
    if (!construct) {
      return pasv;
    }
    return new Class(pasv);
  };
  findChilds = function(ptri, Class, recursive = false, construct = true, childs = []) {
    var clsi, i, index, list, ptrj;
    if (recursive && !Class) {
      throw /CLASS_REQUIRED/;
    }
    ptrj = dvw.getUint32(index = 0, iLE);
    list = new Array;
    if (!ptri) {
      //? returns all created Class? in Global
      if (-1 === (clsi = cscope.indexOf(Class))) {
        //? returns all allocated pointers
        while (ptrj -= HEADER_BYTELENGTH) {
          list[index++] = ptrj;
        }
      } else {
        //? all allocated Classes in Global
        while (ptrj -= HEADER_BYTELENGTH) {
          if (clsi - dvw.getUint32(PTR_CLASSI + ptrj, iLE)) {
            continue;
          }
          list[index++] = ptrj;
        }
      }
    } else {
      //? return childs of given pointer
      if (-1 === (clsi = cscope.indexOf(Class))) {
        //? returns all allocated pointers
        while (ptrj -= HEADER_BYTELENGTH) {
          if (ptri - dvw.getUint32(PTR_PARENT + ptrj, iLE)) {
            continue;
          }
          list[index++] = ptrj;
        }
      } else {
        //? all allocated Classes in Global
        while (ptrj -= HEADER_BYTELENGTH) {
          if (ptri - dvw.getUint32(PTR_PARENT + ptrj, iLE)) {
            continue;
          }
          if (clsi - dvw.getUint32(PTR_CLASSI + ptrj, iLE)) {
            continue;
          }
          list[index++] = ptrj;
        }
      }
    }
    if (recursive && (i = index)) {
      while (i--) {
        findChilds(list[i], Class, true, construct, childs);
      }
    }
    if (construct) {
      if (!Class) {
        while (index--) {
          ptrj = list[index];
          Class = cscope[dvw.getUint32(PTR_CLASSI + ptrj, iLE)];
          childs.push(new Class(ptrj));
        }
      } else {
        while (index--) {
          ptrj = list[index];
          childs.push(new Class(ptrj));
        }
      }
    } else {
      childs.push.apply(childs, list);
    }
    return childs;
  };
  setResvUint32 = function(byteOffset, value) {
    dvw.setUint32(byteOffset + PTR_RESVBEGIN, value, iLE);
    return value;
  };
  getResvUint32 = function(byteOffset = 0) {
    return dvw.getUint32(byteOffset + PTR_RESVBEGIN, iLE);
  };
  setResvUint16 = function(byteOffset, value) {
    dvw.setUint16(byteOffset + PTR_RESVBEGIN, value, iLE);
    return value;
  };
  getResvUint16 = function(byteOffset = 0) {
    return dvw.getUint16(byteOffset + PTR_RESVBEGIN, iLE);
  };
  setResvUint8 = function(byteOffset, value) {
    dvw.setUint8(byteOffset + PTR_RESVBEGIN, value);
    return value;
  };
  getResvUint8 = function(byteOffset = 0) {
    return dvw.getUint8(byteOffset + PTR_RESVBEGIN);
  };
  asetResvUint8 = function(byteOffset, value) {
    return Atomics.store(ui8, byteOffset + PTR_RESVBEGIN, value);
  };
  agetResvUint8 = function(byteOffset = 0) {
    return Atomics.load(ui8, byteOffset + PTR_RESVBEGIN);
  };
  setResvUint64 = function(byteOffset, value) {
    dvw.setBigUint64(byteOffset + PTR_RESVBEGIN, BigInt(value), iLE);
    return value;
  };
  getResvUint64 = function(byteOffset = 0) {
    return Number(dvw.getBigUint64(byteOffset + PTR_RESVBEGIN, iLE));
  };
  setByteLength = function(ptri, byteLength) {
    dvw.setUint32(ptri + PTR_BYTELENGTH, byteLength, iLE);
    return ptri;
  };
  isPointer = function(any) {
    if (true !== !!any) {
      return false;
    }
    if (any.isPointer) {
      return any;
    }
    if (any % HEADER_BYTELENGTH) {
      return false;
    }
    if (any instanceof Pointer) {
      return any;
    }
    if (ArrayBuffer.isView(any)) {
      return false;
    }
    if (getClassIndex(any)) {
      return any;
    }
    return false;
  };
  getByteLength = function(ptri) {
    return dvw.getUint32(ptri + PTR_BYTELENGTH, iLE);
  };
  setByteOffset = function(ptri, byteOffset) {
    dvw.setUint32(ptri + PTR_BYTEOFFSET, byteOffset, iLE);
    return ptri;
  };
  getByteOffset = function(ptri, check = true) {
    var byteOffset;
    if (!(byteOffset = dvw.getUint32(ptri + PTR_BYTEOFFSET, iLE))) {
      if (check) {
        throw [/POINTER_NOT_ALLOCATED/, ptri];
      }
    }
    return byteOffset;
  };
  setLength = function(ptri, length) {
    dvw.setUint32(ptri + PTR_LENGTH, length, iLE);
    return ptri;
  };
  getLength = function(ptri) {
    return dvw.getUint32(ptri + PTR_LENGTH, iLE);
  };
  setBegin = function(ptri, begin) {
    dvw.setUint32(ptri + PTR_BEGIN, begin, iLE);
    return ptri;
  };
  getBegin = function(ptri) {
    return dvw.getUint32(ptri + PTR_BEGIN, iLE);
  };
  setActive = function(ptri, state = 1) {
    dvw.setUint8(ptri + PTR_ACTIVE, state);
    return ptri;
  };
  getActive = function(ptri) {
    return dvw.getUint8(ptri + PTR_ACTIVE);
  };
  setEventId = function(ptri, eventId) {
    dvw.setUint16(ptri + PTR_EVENTID, eventId, iLE);
    return eventId;
  };
  getEventId = function(ptri) {
    return dvw.getUint16(ptri + PTR_EVENTID, iLE);
  };
  setEventRcsv = function(ptri, recursive) {
    dvw.setInt8(ptri + PTR_EVENTRECSV, recursive);
    return recursive;
  };
  getEventRcsv = function(ptri) {
    return dvw.getInt8(ptri + PTR_EVENTRECSV);
  };
  setEventMaxCall = function(ptri, calls = 1) {
    dvw.setUint8(ptri + PTR_EVTMXCALL, calls);
    return ptri;
  };
  getEventMaxCall = function(ptri) {
    return dvw.getUint8(ptri + PTR_EVTMXCALL);
  };
  setEventCalls = function(ptri, calls) {
    dvw.setUint32(ptri + PTR_EVNTCALLS, calls, iLE);
    return calls;
  };
  hitEventCalls = function(ptri) {
    var calls;
    calls = 1 + dvw.getUint32(ptri + PTR_EVNTCALLS, iLE);
    dvw.setUint32(ptri + PTR_EVNTCALLS, calls, iLE);
    return ptri;
  };
  getEventCalls = function(ptri) {
    return dvw.getUint32(ptri + PTR_EVNTCALLS, iLE);
  };
  setInited = function(ptri, state = 1) {
    dvw.setUint8(ptri + PTR_INITIAL, state);
    return ptri;
  };
  getInited = function(ptri) {
    return dvw.getUint8(ptri + PTR_INITIAL);
  };
  setLinked = function(ptri, stri) {
    dvw.setUint16(ptri + PTR_LINKEDI, stri);
    return stri;
  };
  getLinked = function(ptri) {
    return dvw.getUint16(ptri + PTR_LINKEDI);
  };
  setParent = function(ptri, ptrj) {
    dvw.setUint32(ptri + PTR_PARENT, ptrj, iLE);
    return ptrj;
  };
  getParent = function(ptri, construct = true) {
    var clsi, ptrj;
    ptrj = dvw.getUint32(ptri + PTR_PARENT, iLE);
    if (!construct || !ptrj) {
      return ptrj;
    }
    clsi = dvw.getUint32(ptrj + PTR_CLASSI, iLE);
    return new cscope[clsi](ptrj);
  };
  setClassIndex = function(ptri, clsi) {
    clsi || (clsi = cscope.indexOf(ptri));
    dvw.setUint32(ptri + PTR_CLASSI, clsi, iLE);
    return ptri;
  };
  getClassIndex = function(ptri) {
    return dvw.getUint32(ptri + PTR_CLASSI, iLE);
  };
  setUint64 = function(ptri, byteOffset, value) {
    dvw.setBigUint64(byteOffset + getByteOffset(ptri), BigInt(value), iLE);
    return value;
  };
  getUint64 = function(ptri, byteOffset) {
    return Number(dvw.getBigUint64(byteOffset + getByteOffset(ptri), iLE));
  };
  setUint32 = function(ptri, byteOffset, value) {
    dvw.setUint32(byteOffset + getByteOffset(ptri), value, iLE);
    return value;
  };
  getUint32 = function(ptri, byteOffset) {
    return dvw.getUint32(byteOffset + getByteOffset(ptri), iLE);
  };
  setUint16 = function(ptri, byteOffset, value) {
    dvw.setUint16(byteOffset + getByteOffset(ptri), value, iLE);
    return value;
  };
  getUint16 = function(ptri, byteOffset) {
    return dvw.getUint16(byteOffset + getByteOffset(ptri), iLE);
  };
  setUint8 = function(ptri, byteOffset, value) {
    return dvw.setUint8(byteOffset + getByteOffset(ptri), value);
  };
  getUint8 = function(ptri, byteOffset) {
    return dvw.getUint8(byteOffset + getByteOffset(ptri));
  };
  setFloat32 = function(ptri, byteOffset, value) {
    dvw.setFloat32(byteOffset + getByteOffset(ptri), value, iLE);
    return value;
  };
  getFloat32 = function(ptri, byteOffset) {
    return dvw.getFloat32(byteOffset + getByteOffset(ptri), iLE);
  };
  textEncoder = new TextEncoder();
  encodeText = textEncoder.encode.bind(textEncoder);
  textDecoder = new TextDecoder();
  decodeText = function(arrayView) {
    var viewBuffer, viewTArray;
    if (arrayView.buffer === sab) {
      viewBuffer = new ArrayBuffer(arrayView.byteLength);
      viewTArray = new Uint8Array(viewBuffer);
      viewTArray.set(arrayView);
      return decodeText(viewTArray);
    }
    return textDecoder.decode(arrayView);
  };
  mallocExternal = function(length, clsi, ptri) {
    var TypedArray, byPElement, byteLength, byteOffset, constructor;
    if (-1 === (clsi || (clsi = cscope.indexOf(ptri)))) {
      throw /CLS_OR_PTR_REQUIRED/;
    }
    constructor = cscope[clsi];
    TypedArray = constructor.prototype.TypedArray;
    length = Math.max(length, constructor.length);
    if (!(byteLength = constructor.byteLength)) {
      byPElement = !TypedArray ? BYTES_PER_ELEMENT : TypedArray.BYTES_PER_ELEMENT;
      byteLength = byPElement * length;
    }
    if (!ptri && (ptri = palloc())) {
      setClassIndex(ptri, clsi);
    }
    if (!byteLength) {
      return ptri;
    }
    setByteLength(ptri, byteLength);
    setLength(ptri, length);
    malign();
    byteOffset = malloc(byteLength);
    setByteOffset(ptri, byteOffset);
    setBegin(ptri, byteOffset / 4);
    return ptri;
  };
  ptrByteCompare = function(ptri, ptrj, length = 0) {
    var offsetA, offsetB;
    if (!length) {
      length = getByteLength(ptri);
      if (length - getByteLength(ptrj)) {
        return 0;
      }
    }
    offsetA = getByteOffset(ptri);
    offsetB = getByteOffset(ptrj);
    if (offsetA === offsetB) {
      return 1;
    }
    while (length--) {
      if (dvw.getUint8(length + offsetA) - dvw.getUint8(length + offsetB)) {
        return 0;
      }
    }
    return 1;
  };
  ptrViewCompare = function(ptri, arrayView) {
    var length, offset;
    length = arrayView.byteLength;
    if (length - getByteLength(ptri)) {
      return false;
    }
    offset = getByteOffset(ptri);
    while (length--) {
      if (arrayView.getUint8(length) - dvw.getUint8(length + offset)) {
        return false;
      }
    }
    return true;
  };
  subarrayPtri = function(ptri, TypedArray = Uint8Array, length) {
    length || (length = getByteLength(ptri) / TypedArray.BYTES_PER_ELEMENT);
    return new TypedArray(sab, getByteOffset(ptri), length);
  };
  ptrStringify = function(ptri) {
    return decodeText(subarrayPtri(ptri));
  };
  ptrIterator = function(ptri, Class, construct = true, PTR_OFFSET = PTR_PARENT) {
    var clsi, done, next, ptrj;
    if (Class) {
      clsi = cscope.indexOf(Class);
    }
    ptrj = dvw.getUint32(0, iLE);
    done = true;
    next = (function() {
      switch (true) {
        //? ptrIterator( ptri, Class, ... )
        case Boolean(arguments[0] && arguments[1]):
          return function() {
            while (ptrj -= HEADER_BYTELENGTH) {
              if (ptri - dvw.getUint32(ptrj + PTR_OFFSET, iLE)) {
                continue;
              }
              if (clsi - dvw.getUint32(ptrj + PTR_CLASSI, iLE)) {
                continue;
              }
              if (!construct) {
                return {
                  value: ptrj
                };
              }
              return {
                value: new Class(ptrj)
              };
            }
            return {done};
          };
        
        //? ptrIterator( null, Class, ... )
        case Boolean(!arguments[0] && arguments[1]):
          return function() {
            while (ptrj -= HEADER_BYTELENGTH) {
              if (clsi - dvw.getUint32(ptrj + PTR_CLASSI, iLE)) {
                continue;
              }
              if (construct) {
                return {
                  value: new Class(ptrj)
                };
              }
              return {
                value: ptrj
              };
            }
            return {done};
          };
        
        //? ptrIterator( null, null, ... )
        case Boolean(!arguments[0] && !arguments[1]):
          return function() {
            while (ptrj -= HEADER_BYTELENGTH) {
              if (!construct) {
                return {
                  value: ptrj
                };
              }
              Class = cscope[getClassIndex(ptrj)];
              return {
                value: new Class(ptrj)
              };
            }
            return {done};
          };
        
        //? ptrIterator( ptri, null, ... )
        case Boolean(arguments[0] && !arguments[1]):
          return function() {
            while (ptrj -= HEADER_BYTELENGTH) {
              if (ptri - dvw.getUint32(ptrj + PTR_OFFSET, iLE)) {
                continue;
              }
              if (!construct) {
                return {
                  value: ptrj
                };
              }
              Class = cscope[getClassIndex(ptrj)];
              return {
                value: new Class(ptrj)
              };
            }
            return {done};
          };
        default:
          throw [/NOT_POSSIBLE/, ptri, Class];
      }
    }).apply(this, arguments);
    return Iterator.from({next});
  };
  emitEvent = function(ptri, evti, args, recursiving = false, superemit = true) {
    var handler, p, ptre, ptrj, ref;
    ptre = recursiving || ptri;
    ref = ptrIterator(ptri, EventHandler, false);
    for (p of ref) {
      if (evti - getEventId(p)) {
        continue;
      }
      if (hitEventCalls(p) > (getEventMaxCall(p) || 2e308)) {
        break;
      }
      if (recursiving && !getEventRcsv(p)) {
        break;
      }
      handler = EventHandler.prototype.storage[getLinked(p)];
      handler.apply(cscope.newptr(ptre), args);
      break;
    }
    if (superemit && (ptrj = dvw.getUint32(ptri + PTR_PARENT, iLE))) {
      queueMicrotask(emitEvent.bind(null, ptrj, evti, args, recursiving || ptre, superemit));
    }
    return ptre;
  };
  emitInform = function(ptri, evti, args, recursiving = false) {
    var ptrc, ptre, ref;
    ptre = recursiving || ptri;
    emitEvent(ptri, evti, args, recursiving, false);
    ref = ptrIterator(ptri, null, false);
    for (ptrc of ref) {
      emitInform(ptrc, evti, args, recursiving || ptre);
    }
    return ptre;
  };
  strNumberify = function(text) {
    var i, number;
    number = i = `${text}`.length;
    while (i--) {
      number = number + i * text.charCodeAt(i);
    }
    return number;
  };
  self.dump = function() {
    var a, i, o, ptri, s;
    a = (function() {
      var ref, results;
      ref = ptrIterator(null, null);
      results = [];
      for (ptri of ref) {
        results.push({
          key: ptri.constructor.key,
          ptr: ptri,
          ptri: ptri + 0,
          parent: getParent(ptri),
          clsi: getClassIndex(ptri),
          lnki: getLinked(ptri),
          evnti: i = getEventId(ptri),
          event: i && ptrStringify(ptri),
          bytes: getByteLength(ptri),
          offset: getByteOffset(ptri, false),
          calls: getEventCalls(ptri)
        });
      }
      return results;
    })();
    s = (function() {
      var j, len, ref, results;
      ref = Pointer.prototype.storage;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        o = ref[i];
        results.push({
          name: o.name,
          construct: o.constructor.name,
          str: o.toString().substring(0, 50) + ".."
        });
      }
      return results;
    })();
    console.table(a);
    return console.table(s);
  };
  cscope.store(Pointer = (function() {
    class Pointer extends Number {
      constructor(ptri = 0) {
        super(ptri || palloc());
        ptri || setClassIndex(this);
      }

      toString() {
        console.error("tostring", this);
        return super.toString();
      }

      on(events, handler, recursive = false) {
        var clsi, event, nameArray, names, ptri;
        names = events.split(",");
        event = names.shift().trim();
        nameArray = encodeText(event);
        clsi = cscope.indexOf(EventHandler);
        ptri = mallocExternal(nameArray.length, clsi);
        ui8.set(nameArray, getByteOffset(ptri));
        setClassIndex(ptri, clsi);
        setEventId(ptri, strNumberify(event));
        setParent(ptri, this);
        setEventRcsv(ptri, recursive);
        setLinked(ptri, this.store(handler));
        if (!names.length) {
          return ptri;
        }
        return this.on(names.join(","), handler, recursive);
      }

      once(event, handler, recursive, maxCallCount = 1) {
        var ptre;
        ptre = this.on(event, handler, recursive);
        setEventMaxCall(ptre, maxCallCount);
        return ptre;
      }

      emit(event, ...args) {
        if (!emitEvent(this, strNumberify(event), args)) {
          console.error("error on event:" + event);
        }
        return this;
      }

      inform(event, ...args) {
        if (!emitInform(this, strNumberify(event), args)) {
          console.error("error on event:" + event);
        }
        return this;
      }

      store(object) {
        return this.storage.store(object);
      }

      append(ptri) {
        setParent(ptri, this);
        this.emit("append", ptri);
        return ptri;
      }

      add(ptri) {
        setParent(ptri, this);
        this.emit("add", ptri);
        return this;
      }

      call(storei = getLinked(this)) {
        return this.storage[storei]();
      }

      init(childs = {}, arrayLike) {
        var clsi, key, ptri, value;
        if (getInited(this)) {
          throw [/INITED_BEFORE/, this];
        }
        if (!getByteLength(this)) {
          this.set(arrayLike);
        }
        for (key in childs) {
          value = childs[key];
          if (this.hasOwnProperty(key)) {
            this[key] = value;
            continue;
          }
          if (-1 === (clsi = cscope.indexOf(key))) {
            throw /NOT_REGISTERED/ + key;
          }
          ptri = mallocExternal(value != null ? value.length : void 0, clsi);
          setParent(ptri, this);
          value = (function() {
            switch (typeof value) {
              case "string":
                return encodeText(value);
              case "number":
              case "boolean":
                return [value];
              default:
                return value;
            }
          })();
          Pointer.prototype.set.call(ptri, value);
        }
        setInited(this, 1);
        return this;
      }

      hasOwnProperty(key) {
        return Object.hasOwn(Object.getPrototypeOf(this), key);
      }

      set(arrayLike = []) {
        var begin;
        if (!(begin = getBegin(this) || getBegin(mallocExternal(arrayLike.length, false, this)))) {
          return this;
        }
        switch (this.TypedArray || arrayLike.constructor) {
          case Uint8Array:
            ui8.set(arrayLike, begin * 4);
            break;
          case Uint32Array:
            u32.set(arrayLike, begin);
            break;
          case Float32Array:
          case Array:
            f32.set(arrayLike, begin);
            break;
          case Uint16Array:
            u16.set(arrayLike, begin * 2);
            break;
          case BigUint64Array:
            u64.set([arrayLike].map(BigInt), begin / 2);
            break;
          default:
            f32.set(arrayLike, begin);
        }
        return emitEvent(this, EVENTID_SET, arguments);
      }

    };

    Pointer.byteLength = 0;

    Pointer.prototype.storage = new Storage();

    Pointer.prototype.isPointer = true;

    Pointer.isPClass = true;

    Object.defineProperties(Pointer.prototype, {
      root: {
        get: function() {
          var ptri;
          if (!getParent(ptri = getParent(this))) {
            return ptri;
          }
          return ptri.root;
        }
      },
      parent: {
        get: function() {
          return getParent(this);
        }
      },
      children: {
        get: function() {
          return findChilds(this);
        }
      },
      eventCalls: {
        get: function() {
          return getEventCalls(this);
        }
      },
      dev: {
        get: function() {
          return Object.defineProperties(this, {
            hitCall: {
              get: function() {
                return this.call();
              }
            },
            linkedi: {
              get: function() {
                return getLinked(this);
              }
            },
            linkediOnStorage: {
              get: function() {
                return this.storage[getLinked(this)];
              }
            }
          });
        }
      }
    });

    return Pointer;

  }).call(this));
  Object.defineProperties(Pointer.prototype, {
    [PTRKEY]: {
      get: function() {
        return new Uint32Array(sab, +this, HEADER_LENGTH);
      }
    },
    [Symbol.iterator]: {
      value: function() {
        return ptrIterator(this, this.constructor.iterate, true);
      }
    }
  });
  cscope.store(TextPointer = (function() {
    class TextPointer extends Pointer {
      set(text = "") {
        return super.set(encodeText(text));
      }

      getValue() {
        return ptrStringify(this);
      }

    };

    TextPointer.key = "text";

    TextPointer.prototype.TypedArray = Uint8Array;

    return TextPointer;

  }).call(this));
  cscope.store(EventHandler = (function() {
    class EventHandler extends TextPointer {
      set(event = "on..", handler1 = function() {}) {
        this.handler = handler1;
        return super.set(event);
      }

    };

    EventHandler.key = "eventHandler";

    Object.defineProperties(EventHandler.prototype, {
      handler: {
        get: function() {
          return this.storage[getLinked(this)];
        },
        set: function(f) {
          return setLinked(this, this.store(f));
        }
      },
      name: {
        get: EventHandler.prototype.decode
      },
      maxCalls: {
        get: function() {
          return getEventMaxCall(this) || -1;
        },
        set: function(c) {
          return setEventMaxCall(this, c < 0 ? 0 : c);
        }
      },
      callCount: {
        set: function(c) {
          return setEventCalls(this, c);
        }
      },
      isOnce: {
        get: function() {
          return getEventMaxCall(this) === 1;
        },
        set: function() {
          return setEventMaxCall(this, 1);
        }
      },
      isRecursive: {
        get: function() {
          return getEventRcsv(this);
        },
        set: function(c) {
          return setEventRcsv(this, c);
        }
      }
    });

    return EventHandler;

  }).call(this));
  cscope.global(Color = (function() {
    class Color extends Pointer {};

    Color.byteLength = 4 * BYTES_PER_ELEMENT;

    Color.key = "color";

    Color.prototype.TypedArray = Float32Array;

    return Color;

  }).call(this));
  cscope.global(Position = (function() {
    class Position extends Pointer {};

    Position.byteLength = 4 * BYTES_PER_ELEMENT;

    Position.key = "position";

    Position.prototype.TypedArray = Float32Array;

    return Position;

  }).call(this));
  cscope.global(Rotation = (function() {
    class Rotation extends Pointer {};

    Rotation.byteLength = 4 * BYTES_PER_ELEMENT;

    Rotation.key = "rotation";

    Rotation.prototype.TypedArray = Float32Array;

    return Rotation;

  }).call(this));
  cscope.global(Scale = (function() {
    class Scale extends Pointer {};

    Scale.byteLength = 4 * BYTES_PER_ELEMENT;

    Scale.key = "scale";

    Scale.prototype.TypedArray = Float32Array;

    return Scale;

  }).call(this));
  cscope.store(Location = (function() {
    class Location extends Pointer {};

    Location.byteLength = 4 * BYTES_PER_ELEMENT;

    Location.key = "location";

    return Location;

  }).call(this));
  MESH_DRAW_STATE = 0;
  cscope.global(DrawCall = (function() {
    class DrawCall extends TextPointer {
      getProgram() {
        return new Program(getLinked(this));
      }

      queryDocument(program, type) {
        return document.querySelector(`[program='${program}'][type*='${type}']`);
      }

      init(context, vScript, fScript) {
        var construct, fShader, gl, j, len, program, ptri, recursive, ref, vShader;
        super.init().set(`${(vScript || (vScript = 'default'))} ${(fScript || (fScript = 'default'))}`);
        context || (context = findChild(null, Scene).defaultContext);
        ref = findChilds(context, Program, recursive = false, construct = true);
        for (j = 0, len = ref.length; j < len; j++) {
          ptri = ref[j];
          if (!ptrByteCompare(ptri, this)) {
            continue;
          }
          if (setLinked(this, ptri)) {
            return this;
          }
        }
        setParent(ptri = new Program, context);
        setLinked(this, ptri.set(this.value));
        gl = context.WebGLObject;
        vShader = (() => {
          var info, vSource;
          vSource = this.queryDocument(vScript, "vert").text;
          vShader = gl.createShader(gl.VERTEX_SHADER);
          gl.shaderSource(vShader, vSource);
          gl.compileShader(vShader);
          if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
            info = gl.getShaderInfoLog(vShader);
            throw `Could not compile vertex shader. \n\n${info}, \nsource:${vSource}`;
          }
          return vShader;
        })();
        fShader = (() => {
          var fSource, info;
          fSource = this.queryDocument(fScript, "frag").text;
          fShader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(fShader, fSource);
          gl.compileShader(fShader);
          if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
            info = gl.getShaderInfoLog(fShader);
            throw `Could not compile fragment shader. \n\n${info}`;
          }
          return fShader;
        })();
        program = (() => {
          var info;
          program = gl.createProgram();
          gl.attachShader(program, vShader);
          gl.attachShader(program, fShader);
          gl.linkProgram(program);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            info = gl.getProgramInfoLog(program);
            throw `Could not compile WebGL program. \n\n${info}`;
          }
          return program;
        })();
        setLinked(ptri, ptri.store(gl.useProgram.bind(gl, program)));
        return this;
      }

    };

    DrawCall.key = "drawCall";

    DrawCall.prototype.isDrawCall = true;

    return DrawCall;

  }).call(this));
  cscope.global(Mesh = (function() {
    class Mesh extends Pointer {
      setDrawings(drawings = []) {
        var context, fShader, j, len, ptri, vShader;
        for (j = 0, len = drawings.length; j < len; j++) {
          ({context, vShader, fShader} = drawings[j]);
          setParent(ptri = new DrawCall, this);
          ptri.init(context, vShader, fShader);
        }
        return this;
      }

      getDrawState() {
        return STATE[agetResvUint8(this + MESH_DRAW_STATE)];
      }

      setDrawState(state) {
        state = STATE[state] || (function() {
          throw /DRAW_STATE/;
        })();
        asetResvUint8(this + MESH_DRAW_STATE, state);
        this.emit("drawstatechange", state);
        return state;
      }

    };

    Mesh.prototype.TypedArray = Float32Array;

    Mesh.iterate = Mesh;

    Mesh.key = "mesh";

    Object.defineProperties(Mesh.prototype, {
      vertices: {
        set: Mesh.prototype.set
      }
    });

    return Mesh;

  }).call(this));
  cscope.store(AnimationFrame = (function() {
    var ANIMFRAME_COUNT, ANIMFRAME_DELTA, ANIMFRAME_EPOCH, ANIMFRAME_FPS, ANIMFRAME_START;

    class AnimationFrame extends Pointer {
      init() {
        super.init(...arguments).set([Date.now()]);
        return this;
      }

    };

    AnimationFrame.prototype.TypedArray = BigUint64Array;

    AnimationFrame.byteLength = 6 * BigUint64Array.BYTES_PER_ELEMENT;

    AnimationFrame.key = "aframe";

    ANIMFRAME_START = 0;

    ANIMFRAME_COUNT = 8;

    ANIMFRAME_EPOCH = 12;

    ANIMFRAME_FPS = 16;

    ANIMFRAME_DELTA = 16 + 1;

    Object.defineProperties(AnimationFrame.prototype, {
      start: {
        get: function() {
          return getUint64(this, ANIMFRAME_START);
        },
        set: function(v) {
          return setUint64(this, ANIMFRAME_START, v);
        }
      },
      count: {
        get: function() {
          return getUint32(this, ANIMFRAME_COUNT);
        },
        set: function(v) {
          return setUint32(this, ANIMFRAME_COUNT, v);
        }
      },
      epoch: {
        get: function() {
          return getFloat32(this, ANIMFRAME_EPOCH);
        },
        set: function(v) {
          return setFloat32(this, ANIMFRAME_EPOCH, v);
        }
      },
      fps: {
        get: function() {
          return getUint8(this, ANIMFRAME_FPS);
        },
        set: function(v) {
          return setUint8(this, ANIMFRAME_FPS, v);
        }
      },
      delta: {
        get: function() {
          return getUint8(this, ANIMFRAME_DELTA);
        },
        set: function(v) {
          return setUint8(this, ANIMFRAME_DELTA, v);
        }
      },
      now: {
        get: function() {
          return getUint64(this, ANIMFRAME_START) + getFloat32(this, ANIMFRAME_EPOCH);
        }
      }
    });

    return AnimationFrame;

  }).call(this));
  cscope.global(Scene = (function() {
    class Scene extends Pointer {
      init() {
        var animframe, i, onframe;
        super.init(...arguments);
        warn("selam özgür", {
          scene: this
        });
        animframe = this.animationFrame;
        i = 0;
        onframe = function(epoch = 0) {
          this.emit("beforerender", epoch);
          this.render(epoch, animframe);
          if (++i < 2) {
            requestAnimationFrame(onframe);
          }
          return 0;
        };
        (onframe = onframe.bind(this))();
        return this;
      }

      render(epoch, aframe) {
        var construct, delta, drawCall, fps, j, len, mesh, ref, ref1;
        delta = epoch - aframe.epoch;
        fps = 1 / delta * 1000;
        ref = ptrIterator(null, Mesh, construct = true);
        for (mesh of ref) {
          log(1, "mesh:", mesh);
          ref1 = mesh.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            drawCall = ref1[j];
            if (!drawCall.isDrawCall) {
              continue;
            }
            log(2, "    drawcall :", drawCall);
            log(3, "        context :", drawCall.program.parent);
            log(3, "        program :", drawCall.program, `<-- ${drawCall.program.value}`);
          }
        }
        return this.inform("render", delta, Object.assign(aframe, {
          epoch,
          fps,
          delta,
          count: aframe.count + 1
        }));
      }

    };

    Scene.key = "scene";

    Object.defineProperties(Scene.prototype, {
      animationFrame: {
        get: function() {
          var aframe;
          if (!(aframe = findChild(this, AnimationFrame))) {
            setParent(aframe = new AnimationFrame().init(), this);
          }
          return aframe;
        }
      },
      defaultContext: {
        get: function() {
          var create, ptri, superfind;
          if (!(ptri = getLinked(this))) {
            ptri = findChild(this, RenderingContext, create = true, superfind = false);
            setLinked(this, ptri);
          }
          return new RenderingContext(ptri);
        }
      }
    });

    return Scene;

  }).call(this));
  cscope.store(CallBinding = (function() {
    class CallBinding extends TextPointer {
      set(name, _function) {
        this.function = _function;
        return super.set(name);
      }

    };

    Object.defineProperties(CallBinding.prototype, {
      function: {
        get: function() {
          return this.storage[getLinked(hitEventCalls(this))];
        },
        set: function(f) {
          return setLinked(this, this.store(f));
        }
      },
      hitCall: {
        get: function() {
          return this.function();
        }
      },
      name: {
        get: function() {
          return ptrStringify(this);
        }
      }
    });

    return CallBinding;

  }).call(this));
  cscope.global(ClearMask = (function() {
    class ClearMask extends Pointer {
      getValue() {
        return getUint16(this, 0);
      }

      setValue(v) {
        if (!this.constructor.values[v]) {
          throw [/CLEAR_MASK/, v, this];
        }
        return setUint16(this, 0, v);
      }

      init() {
        super.init().set(this.constructor.default).call();
        return this;
      }

      findGLContext(context) {
        var gl;
        if (!context && !(context = findChild(this, RenderingContext, false))) {
          if (!(context = findChild(this, RenderingContext, false, true))) {
            throw [/NO_ACTIVE_CONTEXT/, this];
          }
        }
        return gl = context.WebGLObject;
      }

      bindGLCall(context) {
        var gl;
        gl = this.findGLContext(context);
        return gl.clear.apply.bind(gl.clear, gl, subarrayPtri(this, Uint16Array, 1));
      }

    };

    ClearMask.prototype.TypedArray = Uint16Array;

    ClearMask.key = "clearMask";

    ClearMask.values = {
      COLOR: WebGL2RenderingContext.COLOR_BUFFER_BIT,
      DEPTH: WebGL2RenderingContext.DEPTH_BUFFER_BIT,
      STENCIL: WebGL2RenderingContext.STENCIL_BUFFER_BIT,
      COLOR_DEPTH: WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT
    };

    ClearMask.default = Uint16Array.of(16640);

    ClearMask.byteLength = ClearMask.default.byteLength;

    return ClearMask;

  }).call(this));
  cscope.store(ClearColor = (function() {
    class ClearColor extends Color {
      set() {
        super.set(...arguments).call();
        return this;
      }

      init() {
        super.init().set(this.constructor.default);
        return this;
      }

      findGLContext(context) {
        var gl;
        if (!context && !(context = findChild(this, RenderingContext, false))) {
          if (!(context = findChild(this, RenderingContext, false, true))) {
            throw [/NO_ACTIVE_CONTEXT/, this];
          }
        }
        return gl = context.WebGLObject;
      }

      bindGLCall(context) {
        var gl;
        gl = this.findGLContext(context);
        return gl.clearColor.apply.bind(gl.clearColor, gl, subarrayPtri(this, Float32Array, 4));
      }

    };

    ClearColor.key = "clearColor";

    ClearColor.prototype.TypedArray = Float32Array;

    ClearColor.default = Float32Array.of(1, 0, 1, 1);

    ClearColor.byteLength = ClearColor.default.byteLength;

    return ClearColor;

  }).call(this));
  cscope.store(Viewport = (function() {
    class Viewport extends Pointer {
      set(values = []) {
        var aratio, height, left, pratio, top, width;
        [left = 0, top = 0, width, height, aratio, pratio] = values;
        width || (width = self.innerWidth || 640);
        height || (height = self.innerHeight || 480);
        aratio || (aratio = width / height);
        pratio || (pratio = devicePixelRatio || 1);
        super.set(Float32Array.of(left, top, width, height, aratio, pratio)).call();
        return this;
      }

      resize() {
        var aratio, canvas, height, left, pratio, top, width;
        [left, top, width, height, aratio, pratio] = this.subarray;
        canvas = this.canvas;
        canvas.width = pratio * width;
        canvas.height = pratio * height;
        canvas.style.width = CSS.px(width);
        canvas.style.height = CSS.px(height);
        canvas.style.inset = CSS.px(0);
        canvas.style.position = "fixed";
        return this;
      }

      init() {
        return super.init(...arguments).resize();
      }

      getCanvas() {
        return this.parent.WebGLObject.canvas;
      }

      bindGLCall(gl = this.parent.WebGLObject) {
        return gl.viewport.apply.bind(gl.viewport, gl, subarrayPtri(this, Float32Array, 4));
      }

    };

    Viewport.prototype.TypedArray = Float32Array;

    Viewport.key = "viewport";

    Viewport.default = Float32Array.of(0, 0, self.innerWidth, self.innerHeight, self.innerWidth / self.innerHeight, self.devicePixelRatio);

    Viewport.byteLength = 8 * Float32Array.BYTES_PER_ELEMENT;

    return Viewport;

  }).call(this));
  INTEGRITY_RESVTCLSI = 0;
  INTEGRITY_RESVTEXCL = 1;
  cscope.store(Integrity = (function() {
    class Integrity extends TextPointer {
      getQuery() {
        if (this.excludeShared) {
          return `[program='${this.value}']`;
        }
        return `[program='${this.value}'],[program][default]`;
      }

      find(test = {
          attribute: 'type',
          regExp: /\ /
        }, query) {
        return this.runQuery(query).find(function(htmlNode) {
          var attribute, regExp;
          for (attribute in test) {
            regExp = test[attribute];
            if (!htmlNode[attribute].match(regExp)) {
              return false;
            }
          }
          return true;
        });
      }

      getLinked() {
        var lnki;
        if (!(lnki = getLinked(this))) {
          return;
        }
        return new Program(lnki);
      }

      setLinked(ptri) {
        if (getLinked(this)) {
          throw /ALREADY_LINKED/;
        }
        setResvUint8(this + INTEGRITY_RESVTCLSI, getClassIndex(ptri));
        setLinked(this, ptri);
        return this;
      }

      getNodes(fn, query) {
        return this.runQuery(query).filter(fn || function() {
          return 1;
        });
      }

      runQuery(query = this.query) {
        return [...document.querySelectorAll(query)];
      }

      getExcludeShared() {
        return Boolean(getResvUint8(this + INTEGRITY_RESVTEXCL));
      }

      setExcludeShared(v) {
        return setResvUint8(this + INTEGRITY_RESVTEXCL, Number(v));
      }

    };

    Integrity.key = "integrity";

    return Integrity;

  }).call(this));
  cscope.store(Program = (function() {
    class Program extends TextPointer {
      is(value) {
        return this.value === value;
      }

      use() {
        if (this.inUse) {
          return this;
        }
        this.link().glContext.useProgram(this.glProgram);
        this.setInUse(1);
        return this;
      }

      link() {
        if (this.getIsLinked()) {
          return this;
        }
        this.setIsLinked(1);
        return this;
      }

      bindGLCall() {
        var gl;
        gl = this.parent.WebGLObject;
        return gl.useProgram.bind(gl, this.glProgram);
      }

    };

    Program.key = "program";

    return Program;

  }).call(this));
  cscope.global(RenderingContext = (function() {
    var RDCTX_BYTEOFFSET, RDCTX_CLEAR_COLOR, RDCTX_CLEAR_MASK, RDCTX_PROGRAMCOUNT, RDCTX_VIEWPORT;

    class RenderingContext extends Pointer {
      create() {
        return document.body.appendChild(document.createElement("canvas")).getContext(this.type);
      }

      init() {
        super.init(...arguments).on("render", this.onrender.bind(this), 1);
        this.clearMask.call();
        this.clearColor.call();
        this.viewport.call();
        return this;
      }

      onrender(epoch) {
        this.clearMask.call();
        return 1;
      }

      getPrograms() {
        var construct, list, recursive;
        list = findChilds(this, Program, recursive = false, construct = true);
        return list.length && list || [this.append(new Program()).init()];
      }

      getViewport() {
        var construct, ptri, superfind;
        if (ptri = getUint32(this, RDCTX_VIEWPORT)) {
          return new Viewport(ptri);
        }
        if (!(ptri = findChild(this, Viewport, construct = false, superfind = false))) {
          setParent(ptri = new Viewport(), this);
          ptri.init();
          ptri.bindGLCall(this.WebGLObject);
        }
        return ptri;
      }

      setViewport(ptri) {
        if (!isPointer(ptri)) {
          setParent(ptri = new Viewport(), this);
          ptri.set(arguments[0]).init();
        }
        if (!getLinked(ptri)) {
          setLinked(ptri, this.store(ptri.bindGLCall(this.WebGLObject)));
        }
        setUint32(this, RDCTX_VIEWPORT, ptri);
        return ptri;
      }

      getClearColor() {
        var ptri;
        if (ptri = getUint32(this, RDCTX_CLEAR_COLOR)) {
          return new ClearColor(ptri);
        }
        if (!(ptri = findChild(this, ClearColor, false, true))) {
          return this.setClearColor(ClearColor.default);
        }
        this.setClearColor(ptri);
        return ptri;
      }

      setClearColor(ptri) {
        if (!isPointer(ptri)) {
          setParent(ptri = new ClearColor(), this);
          ptri.set(arguments[0]);
          ptri.init();
        }
        if (!getLinked(ptri)) {
          setLinked(ptri, this.store(ptri.bindGLCall(this)));
        }
        setUint32(this, RDCTX_CLEAR_COLOR, ptri);
        return ptri;
      }

      getClearMask() {
        var ptri;
        if (ptri = getUint32(this, RDCTX_CLEAR_MASK)) {
          return new ClearMask(ptri);
        }
        if (!(ptri = findChild(this, ClearMask, false, true))) {
          return this.setClearMask(ClearMask.default);
        }
        return this.setClearMask(ptri);
      }

      setClearMask(ptri) {
        if (!isPointer(ptri)) {
          setParent(ptri = new ClearMask(), this);
          ptri.set(arguments[0]).init();
        }
        if (!getLinked(ptri)) {
          setLinked(ptri, this.store(ptri.bindGLCall(this)));
        }
        setUint32(this, RDCTX_CLEAR_MASK, ptri);
        return ptri;
      }

    };

    RenderingContext.key = "context";

    RenderingContext.prototype.type = "webgl2";

    RenderingContext.prototype.TypedArray = Uint32Array;

    RenderingContext.byteLength = 24 * 4;

    RDCTX_BYTEOFFSET = 0;

    RDCTX_CLEAR_MASK = 4;

    RDCTX_CLEAR_COLOR = 8;

    RDCTX_VIEWPORT = 24;

    RDCTX_PROGRAMCOUNT = 56;

    Object.defineProperties(RenderingContext.prototype, {
      WebGLObject: {
        get: function() {
          return this.storage[getLinked(this) || setLinked(this, this.store(this.create()))];
        }
      }
    });

    return RenderingContext;

  }).call(this));
  for (i = j = 0, len = cscope.length; j < len; i = ++j) {
    Class = cscope[i];
    ref = Object.getOwnPropertyDescriptors(Class.prototype);
    for (key in ref) {
      desc = ref[key];
      if (!(key[3] && key.substring(1).startsWith("et"))) {
        continue;
      }
      if (key[3] === (c = key[3].toLowerCase())) {
        continue;
      }
      if (!(property = c + key.substring(4))) {
        continue;
      }
      get = (ref1 = Object.getOwnPropertyDescriptor(Class.prototype, "get" + key.substring(3))) != null ? ref1.value : void 0;
      set = (ref2 = Object.getOwnPropertyDescriptor(Class.prototype, "set" + key.substring(3))) != null ? ref2.value : void 0;
      if (get && set) {
        Object.defineProperty(Class.prototype, property, {
          enumerable: true,
          get,
          set
        });
      }
      if (get && !set) {
        Object.defineProperty(Class.prototype, property, {
          enumerable: true,
          get
        });
      }
      if (!get && set) {
        Object.defineProperty(Class.prototype, property, {
          enumerable: true,
          set
        });
      }
    }
    if (Class.prototype.TypedArray) {
      Object.defineProperty(Class.prototype, "subarray", {
        get: function() {
          var byteOffset, length;
          byteOffset = dvw.getUint32(this + PTR_BYTEOFFSET, iLE);
          length = dvw.getUint32(this + PTR_LENGTH, iLE);
          return new this.TypedArray(sab, byteOffset, length);
        }
      });
    }
    ref3 = Object.getOwnPropertyDescriptors(Class.prototype);
    for (key in ref3) {
      desc = ref3[key];
      if (!desc.configurable) {
        continue;
      }
      Object.defineProperty(Class.prototype, key, {
        ...desc,
        enumerable: false,
        configurable: false
      });
      continue;
    }
    ref4 = Object.getOwnPropertyDescriptors(Class);
    for (key in ref4) {
      desc = ref4[key];
      if (!desc.configurable) {
        continue;
      }
      if (key === "length" && Class.byteLength) {
        Object.defineProperty(Class, "length", {
          value: Class.byteLength / (Class.prototype.TypedArray && Class.prototype.TypedArray.BYTES_PER_ELEMENT || BYTES_PER_ELEMENT)
        });
      } else {
        Object.defineProperty(Class, key, {
          ...desc,
          enumerable: false,
          configurable: false
        });
      }
      continue;
    }
  }
  return addEventListener("DOMContentLoaded", function() {
    var script;
    return script = document.body.appendChild(document.createElement("script")).text = document.querySelector("[src*='ptr']:not(:empty)").text;
  });
})();
