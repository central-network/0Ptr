self.name = "window"

do  self.init   = ->
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

    classes.register = ( Class ) ->
        if -1 is i = @indexOf Class
            i += @push Class 
        Class.classIndex = i

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

    ITERATION_PER_THREAD = 4
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

    HINDEX_LENGTH       = 0
    HINDEX_BYTEOFFSET   = HINDEX_LENGTH++ #! must be 0
    HINDEX_BYTELENGTH   = HINDEX_LENGTH++
    HINDEX_CLASSID      = HINDEX_LENGTH++

    HINDEX_PARENT       = HINDEX_LENGTH++
    HINDEX_BEGIN        = HINDEX_LENGTH++

    HINDEX_ISGL         = HINDEX_LENGTH++
    HINDEX_UPDATED      = HINDEX_LENGTH++
    HINDEX_PAINTED      = HINDEX_LENGTH++
    HINDEX_LOCATED      = HINDEX_LENGTH++
    
    HINDEX_ITER_COUNT   = HINDEX_LENGTH++
    HINDEX_NEXT_COLORI  = HINDEX_LENGTH++
    HINDEX_NEXT_VERTEXI = HINDEX_LENGTH++
    
    HINDEX_RESV0        = HINDEX_LENGTH++
    HINDEX_RESV1        = HINDEX_LENGTH++

    ATTRIBS_LENGTH      = 0
    ATTRIBS_BYTELENGTH  = 0




    HEADER_INDEXCOUNT   =  0

    HEADER_BYTEOFFSET   =  0; HEADER_INDEXCOUNT++ #? 0
    HEADER_BYTELENGTH   =  1; HEADER_INDEXCOUNT++ #? 1
    HEADER_LENGTH       =  2; HEADER_INDEXCOUNT++ #? 2
    HEADER_BEGIN        =  3; HEADER_INDEXCOUNT++ #? 3

    HEADER_CLASSINDEX   =  4; HEADER_INDEXCOUNT++ #? 4
    HEADER_PARENTPTRI   =  5; HEADER_INDEXCOUNT++ #? 5
    HEADER_LINKEDPTRI   =  7; HEADER_INDEXCOUNT++ #? 7
    HEADER_ITEROFFSET   =  6; HEADER_INDEXCOUNT++ #? 6

    HEADER_NEEDRECALC   =  7 * 4    ; HEADER_INDEXCOUNT++ #? 32
    HEADER_NEEDUPLOAD   =  7 * 4 + 1; #* ptri * 4 + HEADER_NEEDUPLOAD
    HEADER_TRANSLATED   =  7 * 4 + 2; #* ptri * 4 + HEADER_CALCVERTEX
    HEADER_FRAGMENTED   =  7 * 4 + 3; #* ptri * 4 + HEADER_PAINTCOLOR

    HEADER_RESVINDEX4   =  8; HEADER_INDEXCOUNT++ #? 9 
    HEADER_RESVINDEX2   =  8 * 2; #* ptri * 2 + HEADER_RESVINDEX2
    HEADER_RESVINDEX1   =  8 * 4; #* ptri * 4 + HEADER_RESVINDEX1



    getByteOffset       = ( ptri ) -> 
        u32[ ptri ]
    
    setByteOffset       = ( ptri, byteOffset ) -> 
        u32[ ptri ] = byteOffset

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
    
    getClass            = ( ptri ) -> 
        classes[ u32[ HEADER_CLASSINDEX + ptri ] ]

    getParentPtri       = ( ptri ) -> 
        u32[ HEADER_PARENTPTRI + ptri ]
    
    getLinkedPtri       = ( ptri ) -> 
        u32[ HEADER_LINKEDPTRI + ptri ]
    
    setParent           = ( ptri, ptrj ) ->
        u32[ HEADER_PARENTPTRI + ptri ] = ptrj
    
    setLinked           = ( ptri, ptrj ) ->
        u32[ HEADER_LINKEDPTRI + ptri ] = ptrj

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

        while ptrj -= 16
            continue if u32[ HEADER_LINKEDPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i++ ] = new ( classes[ clsi ] ) ptrj 

        list


    getChilds           = ( ptri ) -> 
        ptrj = u32[1]
        list = new Array() ; i = 0

        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            Class = classes[ u32[ HEADER_CLASSINDEX + ptrj ] ]
            list[ i++ ] = new Class ptrj
        
        list

    findChilds          = ( ptri, Class ) -> 
        ptrj = u32[1]
        clsi = Class.classIndex
        list = new Array() ; i = 0

        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i ] = new ( classes[ clsi ] )( ptrj ) ; ++i

        list

    findChild           = ( ptri, Class ) -> 
        ptrj = u32[1]
        clsi = Class.classIndex

        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            return new ( classes[ clsi ] )( ptrj )

        undefined

    findChildRecursive  = ( ptri, Class, clsi ) -> 
        ptrN = u32[1]
        clsi = clsi or Class.classIndex

        ptrj = ptrN
        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi                
            return new Class ptrj

        ptrj = ptrN
        while ptrj -= 16 
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue unless ptr = findChildRecursive ptrj, Class, clsi
            return ptr

        undefined

    findChildsRecursive = ( ptri, Class, clsi, childs = [] ) -> 
        ptrN = u32[1]
        clsi = clsi or Class.classIndex

        ptrj = ptrN
        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi                
            childs.push new Class ptrj

        ptrj = ptrN
        while ptrj -= 16 
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue unless ptr = findChildsRecursive ptrj, Class, clsi, childs
            childs.push ptr

        childs

    findChildsPtri      = ( ptri, test ) -> 
        ptrj = u32[1]
        list = new Array() ; i = 0

        ci = if test.isPtr  then classes.indexOf test
        else if test.isPtri then u32[ HEADER_CLASSINDEX + test ]
        else if !isNaN test then test
        else throw /FILTER_TEST_FAILED/

        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - ci
            list[ i ] = ptrj ; i++

        list

    getAllocs           = ( ptri ) ->
        clsi = ptri.classIndex
        ptrj = u32[1]
        list = new Array() ; i = 0

        while ptrj -= 16
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i ] = new ( classes[ clsi ] )( ptrj ) ; i+=1

        list

    getIterOffset       = ( ptri       ) -> 
        u32[ HEADER_ITEROFFSET + ptri ]
    
    setIterOffset       = ( ptri, v    ) -> 
        u32[ HEADER_ITEROFFSET + ptri ] = v
    
    hitIterOffset       = ( ptri, count = ITERATION_PER_THREAD ) -> 
        Atomics.add u32, HEADER_ITEROFFSET + ptri, count

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
        u32[ HEADER_RESVINDEX4 + ptri + i ]
    
    setResvUint32       = ( ptri, i, v ) -> 
        u32[ HEADER_RESVINDEX4 + ptri + i ] = v
    
    addResvUint32       = ( ptri, i, v ) -> 
        u32[ HEADER_RESVINDEX4 + ptri + i ] = v + (
            u = u32[ HEADER_RESVINDEX4 + ptri + i ]
        ) ; u

    getResvUint16       = ( ptri, i    ) -> 
        u16[ HEADER_RESVINDEX2 + ptri * 2 + i ]
    
    setResvUint16       = ( ptri, i, v ) -> 
        u16[ HEADER_RESVINDEX2 + ptri * 2 + i ] = v
    
    addResvUint16       = ( ptri, i, v ) -> 
        u16[ HEADER_RESVINDEX2 + ptri * 2 + i ] = v + (
            u = u16[ HEADER_RESVINDEX2 + ptri * 2 + i ]
        ) ; u

    getResvUint8        = ( ptri, i    ) -> 
        ui8[ HEADER_RESVINDEX1 + i + ( ptri * 4 ) ]
    
    setResvUint8        = ( ptri, i, v ) -> 
        ui8[ HEADER_RESVINDEX1 + i + ( ptri * 4 ) ] = v
    
    addResvUint8        = ( ptri, i, v ) -> 
        ui8[ HEADER_RESVINDEX1 + i + ( ptri * 4 ) ] = v + (
            u = ui8[ HEADER_RESVINDEX1 + i + ( ptri * 4 ) ]
        ) ; u

    getResvFloat32      = ( ptri, i    ) -> 
        f32[ HEADER_RESVINDEX4 + ptri + i ]
    
    setResvFloat32      = ( ptri, i, v ) -> 
        f32[ HEADER_RESVINDEX4 + ptri + i ] = v
    
    addResvFloat32      = ( ptri, i, v ) -> 
        f32[ HEADER_RESVINDEX4 + ptri + i ] = v + (
            u = f32[ HEADER_RESVINDEX4 + ptri + i ]
        ) ; u

    newFloat32Array     = ( ptri, byteOffset = 0, length ) -> 
        new Float32Array buffer, u32[ ptri ] + byteOffset, length or u32[ HEADER_LENGTH + ptri ]

    ptrFloat32Array     = ( ptri, byteOffset = 0, length ) -> 
        new Float32Array buffer, ptri * 4, length or 16

    newUint32Array      = ( ptri, byteOffset = 0, length ) -> 
        new Uint32Array buffer, u32[ ptri ] + byteOffset, length or u32[ HEADER_LENGTH + ptri ]

    ptrUint32Array      = ( ptri, byteOffset = 0, length ) -> 
        new Uint32Array buffer, ptri * 4, length or 16

    newUint8Array       = ( ptri, byteOffset = 0, length ) -> 
        new Uint8Array buffer, u32[ ptri ] + byteOffset, length or u32[ HEADER_LENGTH + ptri ]

    ptrUint8Array       = ( ptri, byteOffset = 0, length ) -> 
        new Uint8Array buffer, ptri * 4, length or 64

    subarrayFloat32     = ( ptri, begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + ptri ]
        f32.subarray( begin, begin + count )

    subarrayUint32      = ( ptri, begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + ptri ]
        u32.subarray( begin, begin + count )

    subarrayUint8       = ( ptri, begin = 0, count ) -> 
        begin += u32[ ptri ]
        ui8.subarray( begin, begin + count )
        
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

    orUint32            = ( ptri, index = 0, fn ) -> 
        u32[ u32[ HEADER_BEGIN + ptri ] + index ] ||= fn.call ptri

    fillUint32          = ( ptri, value, start = 0, count ) ->
        start += u32[ HEADER_BEGIN + ptri ]
        u32.fill value, start, start + count ; ptri

    setarrayUint32      = ( ptri, array, begin = 0 ) -> 
        u32.set array, begin + u32[ HEADER_BEGIN + ptri ] ; ptri

    setUint8            = ( ptri, index, value ) -> 
        ui8[ u32[ ptri ] + index ] = value

    getUint8            = ( ptri, index = 0 ) -> 
        ui8[ u32[ ptri ] + index ]

    orUint8             = ( ptri, index = 0, fn ) ->
        ui8[ u32[ ptri ] + index ] ||= fn.call ptri

    fillUint8           = ( ptri, value, start = 0, count ) ->
        start += u32[ ptri ]
        ui8.fill value, start, start + count ; ptri

    setarrayUint8       = ( ptri, array, begin = 0 ) -> 
        ui8.set array, begin + u32[ ptri ] ; ptri
        

    state       = ( state ) ->
        unless arguments.length
            return Atomics.load i32, threadId
        return Atomics.store i32, threadId, state

    nextTick    = ->
        #log "nextTick:", ++ticks

        ptri = Atomics.load i32, 1
        test = 0

        while OFFSET_PTR <= ptri -= 16        
            continue unless Atomics.load i32, ptri + HINDEX_ISGL
            continue if Atomics.load i32, ptri + HINDEX_UPDATED
            
            locate  = Atomics.load i32, ptri + HINDEX_LOCATED
            paint   = Atomics.load i32, ptri + HINDEX_PAINTED

            continue if paint and locate

            test = 1

            index   = Atomics.add i32, ptri + HINDEX_NEXT_VERTEXI, 1
            count   = Atomics.load i32, ptri + HINDEX_ITER_COUNT

            if  index <= count
                shape   = new Shape ptri

                begin   = index * 3
                end     = begin + 3
                vertex  = shape.vertex index 
                color   = shape.color

                for draw in shape.children
                    draw.vertex( index ).set vertex
                    draw.color( index ).set color

                    Atomics.store i32, draw.ptri + HINDEX_UPDATED, 0
                    
                #log ptri, index 
            
            continue if index - count

            if !locate
                Atomics.store i32, ptri + HINDEX_LOCATED, 1
                
            if !paint
                Atomics.store i32, ptri + HINDEX_PAINTED, 1

            Atomics.store i32, ptri + HINDEX_UPDATED, 1

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
        u32 = new Uint32Array buffer
        f32 = new Float32Array buffer
        dvw = new DataView buffer
        ui8 = new Uint8Array buffer

        scripts = Array.from document.querySelectorAll "script"
        
        state = ( state ) ->
            unless state
                return Atomics.load i32, THREADS_STATE
            return Atomics.store i32, THREADS_STATE, state

        Atomics.add u32, 0, 16 * 1e5
        Atomics.add u32, 1, 16
    
        state THREADS_NULL

    


    malloc2             = ( constructor, byteLength ) ->
        ptri        = Atomics.add i32, 1, 16
        classId     = constructor.classId

        if  byteLength ?= constructor.byteLength

            BYTES_PER_ELEMENT =
                constructor.TypedArray.BYTES_PER_ELEMENT or
                constructor.BYTES_PER_ELEMENT

            length      = ( allocLength = byteLength ) / BYTES_PER_ELEMENT
            byteLength += 8 - ( byteLength % 8 )
            byteOffset  = Atomics.add i32, 0, byteLength
            begin       = byteOffset / BYTES_PER_ELEMENT

            Atomics.add   i32, 0, 8 - byteLength % 8
            Atomics.store i32, ptri + HINDEX_BYTEOFFSET, byteOffset
            Atomics.store i32, ptri + HINDEX_BYTELENGTH, allocLength
            Atomics.store i32, ptri + HINDEX_LENGTH, length
            Atomics.store i32, ptri + HINDEX_BEGIN, begin

        Atomics.store i32, ptri + HINDEX_PTRI, ptri
        Atomics.store i32, ptri + HINDEX_CLASSID, classId

        ptri

    self.emit           = ( event, detail ) ->
        self.dispatchEvent new CustomEvent event, { detail }

    pipe.emit           = ( event, detail ) ->
        @postMessage event

    ###
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
            get : -> Atomics.load i32, @ptri + HINDEX_BYTEOFFSET
        
        Object.defineProperty this::, "classId",
            get : -> Atomics.load i32, @ptri + HINDEX_CLASSID

        Object.defineProperty this::, "byteLength",
            get : -> Atomics.load i32, @ptri + HINDEX_BYTELENGTH

        Object.defineProperty this::, "length",
            get : -> Atomics.load i32, @ptri + HINDEX_LENGTH

        Object.defineProperty this::, "ptri",
            get : -> Atomics.load i32, this
        
        Object.defineProperty this::, "begin",
            get : -> Atomics.load i32, @ptri + HINDEX_BEGIN
        
        Object.defineProperty this::, "isGL",
            get : -> Atomics.load i32, @ptri + HINDEX_ISGL
            set : (v) -> Atomics.store i32, @ptri + HINDEX_ISGL, v
        
        Object.defineProperty this::, "parent",
            get : -> Atomics.load i32, @ptri + HINDEX_PARENT
            set : (v) -> Atomics.store i32, @ptri + HINDEX_PARENT, parseInt v
        
        Object.defineProperty this::, "children",
            get : -> 
                ptri = Atomics.load i32, 1
                test = this.ptri

                children = []
                while OFFSET_PTR <= ptri -= 16
                    unless test - Atomics.load i32, ptri + HINDEX_PARENT
                        classId = Atomics.load i32, ptri + HINDEX_CLASSID
                        children.push new (classes[ classId ])( ptri )
                children
        
        Object.defineProperty this::, "iterCount",
            get : -> Atomics.load u32, @ptri + HINDEX_ITER_COUNT
            set : (v) -> Atomics.store u32, @ptri + HINDEX_ITER_COUNT, v
        
        Object.defineProperty this::, "typedArray",
            get : -> new this.constructor.TypedArray buffer, @byteOffset, @length

        @allocs     : ( parent ) ->
            ptri = Atomics.load i32, 1
            classId = @classId

            while OFFSET_PTR <= ptri -= 16        
                continue unless classId is Atomics.load i32, ptri + HINDEX_CLASSID
                continue if parent and parent isnt Atomics.load i32, ptri + HINDEX_PARENT
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
            f32.set value, i32[ ptri + HINDEX_BEGIN ]

    ###


    classes.register class Pointer      extends Number

        @byteLength : 0

        TypedArray  : Float32Array

        @isPtr      : yes

        isPtri      : yes

        @BPE        : BPE

        BPE         : @BPE

        storage     : [,]

        constructor : ->
            super arguments[0] || Atomics.add u32, 1, 16
            @init arguments[1] if isWindow

        malloc      : ( byteLength ) ->
            byteLength = byteLength or @constructor.byteLength 
            byteOffset = Atomics.add u32, 0, byteLength

            Atomics.add u32, 0, 8 - byteLength % 8

            setBegin        this, byteOffset / @BPE
            setLength       this, byteLength / @BPE
            setByteOffset   this, byteOffset

            this

        init        : ( props = {} ) ->
            if !getClassIndex this
                setClassIndex this, this.constructor.classIndex
                if  byteLength = this.constructor.byteLength
                    @malloc byteLength

            for prop, value of props then for Class in classes
                continue unless prop is Class::name
                @add new Class().set value; break

            return @

        set         : ( array = [] ) ->
            unless  byteLength = getByteLength this
                if !byteLength = @constructor.byteLength
                    byteLength = array.length * @BPE
                
            if !byteLength then return @
            else @malloc byteLength
            setarrayFloat32 this, array if array

            return this

        store       : ( object ) ->
            if -1 is i = @storage.indexOf object
                i += @storage.push object
            i

        add         : ( ptr ) -> setParent ptr, this

        @allocs     : -> getAllocs this

        @create     : -> new this null, arguments...

        Object.defineProperties Pointer::,
            
            childs  : get : -> getChilds this

            parent  :
                get : -> getParent this
                set : ( ptri ) -> setParent this, ptri

            linked  :
                get : -> getLinked this
                set : ( ptri ) -> setLinked this, ptri

            tarray  :
                get : -> new this.TypedArray buffer, getByteOffset(this), getLength(this)

            [ "|[Pointer]|" ] :
                get : -> ptrUint32Array this

    classes.register class Vector3      extends Pointer

        @byteLength : 3 * @BPE

        getX : -> getFloat32 this, 0
        getY : -> getFloat32 this, 1
        getZ : -> getFloat32 this, 2

        setX : (v) -> setFloat32 this, 0, v
        setY : (v) -> setFloat32 this, 1, v
        setZ : (v) -> setFloat32 this, 2, v

        Object.defineProperties Vector3::,
            x : get : Vector3::getX , set : Vector3::setX
            y : get : Vector3::getY , set : Vector3::setY
            z : get : Vector3::getZ , set : Vector3::setZ

    classes.register class Color        extends Pointer

        name        : "color"

        @byteLength : 4 * @BPE

        toObject    : ->
            [ red, green, blue, alpha ] = @f32
            { red, green, blue, alpha }

        set         : ( [ r, g, b, a = 1 ] ) -> super [ r, g, b, a ]

        Object.defineProperties Color::,
            f32 : get : newFloat32Array
            ui8 : get : -> Uint8Array.from @f32, (v) -> v * 0xff
            hex : get : -> "0x" + [ ...@ui8 ].map( (v) -> v.toString(16).padStart(2,0) ).join("")
            u32 : get : -> parseInt @hex, 16
            rgb : get : -> Array.from @ui8.subarray 0, 3
            css : get : -> "rgba( #{@rgb.join(', ')}, #{@obj.alpha} )"
            obj : get : -> @toObject()

    classes.register class UV           extends Vector3

        name        : "uv"

    classes.register class Texture      extends Vector3

        name        : "texture"

    classes.register class Position     extends Vector3

        name        : "position"

        vertexAttribPointer : "position"

        apply       : ( begin, count, stride, offset ) ->

            [ tx, ty, tz ] = @tarray

            while count--

                i = ( count * stride + offset ) / 4

                f32[  i  ] += tx
                f32[ i+1 ] += ty
                f32[ 2+i ] += tz

            0

    classes.register class Scale        extends Vector3

        name        : "scale"

        apply       : ( begin, count, stride, offset ) ->

            [ sx, sy, sz ] = @tarray

            while count--

                i = ( count * stride + offset ) / 4

                f32[  i  ] *= sx
                f32[ i+1 ] *= sy
                f32[ 2+i ] *= sz

            0

    classes.register class Rotation     extends Pointer

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
                z, sinZ, cosZ,  ] = @tarray

            while count--
            
                i = ( count * stride + offset ) / 4

                f32[  i  ] *= sinX * cosX
                f32[ i+1 ] *= cosY * sinY
                f32[ 2+i ] *= sinZ * cosZ

            0

        Object.defineProperties Rotation::,
            x : get : Rotation::getX , set : Rotation::setX
            y : get : Rotation::getY , set : Rotation::setY
            z : get : Rotation::getZ , set : Rotation::setZ       

    classes.register class Vertices     extends Pointer

        name        : "vertices"

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


    classes.register class Matter       extends Pointer

        self.Matter         = Matter

        drawable            : yes

        Object.defineProperties Matter::,

            info            : get : ->

                counts      : counts =

                    points  : getLength( this ) / 3

                    lines   : -1 + getLength( this ) / 3

                    triangles : Math.trunc getLength( this ) / 9

                offset      : @offsets()

                shapes      :

                    points      : if !i = 0 then while i < counts.points then @point i++
                    
                    lines       : if !i = 0 then while i < counts.lines then @line i++

                    triangles   : if !i = 0 then while i < counts.triangles then @triangle i++

            vertices        : Object.getOwnPropertyDescriptor Pointer::, "tarray"

            pointCount      : get : -> getLength( this ) / 3

            draws           : get : -> findLinkeds this, Draw                

        Object.deleteProperties Matter::, [ "tarray", "linked" ]

        @create : ( props = {} ) ->
            matter = new this

            if  props.vertices
                matter.set props.vertices
                delete props.vertices

            matter . init props

        vertex      : ( index = 0, count = 1 ) ->
            subarrayFloat32 this, 3 * index, 3 * count

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

                
    classes.register class Frustrum     extends Pointer

        name : "frustrum"

    classes.register class PointSize    extends Pointer

        name : "pointSize"

    ###
    class Shape         extends Pointer

        self.Shape      = this

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

        Object.defineProperties Shape::,
            pointCount  :
                get     : -> @vertices.pointCount

            markNeedsUpdate : 
                set     : -> unlock Atomics.store i32, @ptri + HINDEX_UPDATED, 1

            willUploadIfNeeded : 
                get     : -> Atomics.and i32, @ptri + HINDEX_UPDATED, 0

        drawPoints      : ->
            @draws.push space.malloc gl.POINTS, this

        drawLines       : ->
            @draws.push space.malloc gl.LINES, this

        drawTriangles   : ->
            @draws.push space.malloc gl.TRIANGLES, this

        vertex          : ( index ) ->
            ptri = dvw.getUint32 @byteOffset + @OFFSET_VERTICES, LE
            byteOffset = i32[ ptri + HINDEX_BYTEOFFSET ] + index * 4 * 3
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
                get : -> u32[ this + @HINDEX_RESV0 ]
                set : (v) -> u32[ this + @HINDEX_RESV0 ] = v

            glShader        :
                get : -> shaders[ u32[ this + @HINDEX_RESV1 ] ]
                set : (v) -> u32[ this + @HINDEX_RESV1 ] = shaders.register v

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

        INDEX_DRAW_BEGIN      : 16

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
        
    ###

    classes.register class Shader extends Pointer

        GPU_ATTRIBUTE_COUNT : 1e5 

        Object.defineProperties Shader::,
            gl          : get : Shader::parentGLContext  , set : Shader::setGLContext
            glProgram   : get : Shader::parentGLProgram  , set : Shader::setGLProgram

        Object.defineProperties Shader::,
            source      : get : Shader::getSource          , set : Shader::setSource
            active      : get : Shader::getActive          , set : Shader::setActive

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
            
        compile          : ->
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

        draw            : ( shape, type = @LINES ) ->
            byteLength = shape.pointCount * getUint32 this, @INDEX_ALLOC_BYTELENGTH_PER_POINT
            length     = shape.pointCount * getUint32 this, @INDEX_ALLOC_LENGTH_PER_POINT

            index = switch type
                when @LINES      then @INDEX_LINES_COUNT
                when @POINTS     then @INDEX_POINTS_COUNT
                when @TRIANGLES  then @INDEX_TRIANGLES_COUNT
                else throw /UNKNOWN_DRAW_TYPE/ + type

            Object.assign new Draw(),
                drawType   : type
                drawCount  : shape.pointCount
                drawStart  : getUint32( this, index+2 ) + addUint32 this, index, shape.pointCount
                drawOffset : offset = addUint32( this, index+1, byteLength ) - getByteOffset(this)
                readBegin  : begin = offset / 4 
                readLength : length
                byteOffset : getByteOffset(this) + begin * 4
                byteLength : length * 4
                parent     : this
                linked     : shape
            
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

            shader = shader2 = gl =
            program = canvas = null
            definitions = new Object

            for v in [ uniforms... , ...attribs ]
                definitions[ v.name ] = v

            definitions

    classes.register class Draw         extends Pointer

        name            : "draw"

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
            glProgram   : get : Shader::createGLProgram  , set : Shader::setGLProgram
            glVShader   : get : Shader::activeGLVShader  , set : Shader::setGLVShader
            glFShader   : get : Shader::activeGLFShader  , set : Shader::setGLFShader
            glBuffer    : get : Shader::activeGLBuffer   , set : Shader::setGLBuffer

        Object.defineProperties Space::,
            vShader     : get : -> findChildsRecursive( this, VertexShader ).find (s) -> s.active
            fShader     : get : -> findChildsRecursive( this, FragmentShader ).find (s) -> s.active 
            created     :
                get     :     -> getResvUint8( this, 1 )          
                set     : (v) -> setResvUint8( this, 1, v )          

            active      :
                get     :     -> getResvUint8( this, 0 )          
                set     : (v) -> setResvUint8( this, 0, v )          

        Object.deleteProperties Space::, [ "tarray", "linked", "parent" ]

        add             : ( ptr ) ->
            super ptr

            if  ptr.drawable
                @vShader.draw ptr

            this    

        init            : ->
            unless super( arguments... ).created
                @createShaders( @created = 1 )
            this

        createShaders    : ->
            throw /THREADS_CAN_NOT_CREATE_SHADERS/ unless isWindow

            for script in VertexShader.DocumentScripts
                @add shader = new VertexShader
                shader.source = script.text
                shader.create shader.parseSource()

            for script in FragmentShader.DocumentScripts
                @add shader = new FragmentShader
                shader.source = script.text

            this

    self.addEventListener "DOMContentLoaded"    , ->

        frame = 0
        epoch = 0
        rendering = 0

        return

        checkUploads    = ->
            for shape in Shape.allocs()
                continue unless shape.willUploadIfNeeded

                gl.bufferSubData(
                    gl.ARRAY_BUFFER, draw.uploadOffset,
                    space.drawBuffer, draw.uploadBegin,
                    draw.uploadLength
                ) for draw in GLDraw.allocs shape.ptri

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

    self.addEventListener "bufferready"         , ->
        #log "bufferready:", buffer
        
        ui8 = new Uint8Array buffer
        u32 = new Uint32Array buffer
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
