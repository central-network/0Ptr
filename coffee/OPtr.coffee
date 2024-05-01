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
        unless @includes Class
            @push Class 
        Class.classIndex = @indexOf Class

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
    HEADER_ITEROFFSET   =  6; HEADER_INDEXCOUNT++ #? 6
    HEADER_ITERLENGTH   =  7; HEADER_INDEXCOUNT++ #? 7

    HEADER_NEEDRECALC   = 32; HEADER_INDEXCOUNT++ #? 32
    HEADER_NEEDUPLOAD   = 33; #* ptri * 4 + HEADER_NEEDUPLOAD
    HEADER_TRANSLATED   = 34; #* ptri * 4 + HEADER_CALCVERTEX
    HEADER_FRAGMENTED   = 35; #* ptri * 4 + HEADER_PAINTCOLOR

    HEADER_RESVINDEX4   =  9; HEADER_INDEXCOUNT++ #? 9 
    HEADER_RESVINDEX2   = 18; #* ptri * 2 + HEADER_RESVINDEX2
    HEADER_RESVINDEX1   = 27; #* ptri * 4 + HEADER_RESVINDEX1


    getByteOffset       = ( ptri       ) -> 
        u32[ ptri ]
    
    setByteOffset       = ( ptri, v    ) -> 
        u32[ ptri ] = v

    getByteLength       = ( ptri       ) -> 
        u32[ HEADER_BYTELENGTH + ptri ]
    
    setByteLength       = ( ptri, v    ) -> 
        u32[ HEADER_BYTELENGTH + ptri ] = v

    getLength           = ( ptri       ) -> 
        u32[ HEADER_LENGTH + ptri ]
    
    setLength           = ( ptri, v    ) -> 
        u32[ HEADER_LENGTH + ptri ] = v

    getBegin            = -> 
        u32[ HEADER_BEGIN + this ]

    getIndex            = ( index = 0 ) -> 
        u32[ HEADER_BEGIN + this ] + index
    
    setBegin            = ( ptri, v    ) -> 
        u32[ HEADER_BEGIN + ptri ] = v

    getClassIndex       = ( ptri       ) -> 
        u32[ HEADER_CLASSINDEX + ptri ]
    
    setClassIndex       = ( ptri, v    ) -> 
        u32[ HEADER_CLASSINDEX + ptri ] = v
    
    getClass            = ( ptri       ) -> 
        classes[ u32[ HEADER_CLASSINDEX + ptri ] ]

    getParentPtri       = ( ptri       ) -> 
        u32[ HEADER_PARENTPTRI + ptri ]
    
    setParent           = ( ptri, v    ) ->
        u32[ HEADER_PARENTPTRI + ptri ] = v or this

    getParent           = ( ptri = @   ) -> 
        new ( classes[ u32[ HEADER_CLASSINDEX + (
                ptrp = u32[ HEADER_PARENTPTRI + ptri ]
        ) ] ] )( ptrp ) 

    getChilds           = ( ptri = @   ) -> 
        ptrj = Atomics.load u32, 1
        list = new Array() ; i = 0

        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            list[ i ] = new ( classes[ u32[ HEADER_CLASSINDEX + ptrj ] ] )( ptrj )
            i++
        
        list

    getChildsPtri       = ( ptri       ) -> 
        ptrj = Atomics.load u32, 1
        list = new Array() ; i = 0

        while ptrj -= 16
            continue if ptri - u32[ HEADER_PARENTPTRI + ptrj ]
            list[ i ] = ptrj ; i++

        list

    findChilds          = ( ptri, test ) -> 
        ptrj = Atomics.load u32, 1
        list = new Array() ; i = 0

        ci = if test.isPtr  then classes.indexOf test
        else if test.isPtri then u32[ HEADER_CLASSINDEX + test ]
        else if !isNaN test then test
        else throw /FILTER_TEST_FAILED/

        while ptrj -= 16
            continue if u32[ HEADER_PARENTPTRI + ptrj ] - ptri
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - ci
            list[ i ] = new ( classes[ ci ] )( ptrj ) ; ++i

        list

    findChildsPtri      = ( ptri, test ) -> 
        ptrj = Atomics.load u32, 1
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

    getAllocs           = ->
        clsi = this.classIndex
        ptrj = Atomics.load u32, 1
        list = new Array() ; i = 0

        while ptrj -= 16
            continue if u32[ HEADER_CLASSINDEX + ptrj ] - clsi
            list[ i ] = new ( classes[ clsi ] )( ptrj ) ; i+=1

        list

    getIterOffset       = ( ptri       ) -> 
        u32[ HEADER_ITEROFFSET + ptri ]
    
    setIterOffset       = ( ptri, v    ) -> 
        u32[ HEADER_ITEROFFSET + ptri ] = v
    
    hitIterOffset       = ( ptri       ) -> 
        Atomics.add u32, HEADER_ITEROFFSET + ptri, u32[ HEADER_ITERLENGTH + ptri ]
    
    getIterLength       = ( ptri       ) -> 
        u32[ HEADER_ITERLENGTH + ptri ]
    
    setIterLength       = ( ptri, v    ) -> 
        u32[ HEADER_ITERLENGTH + ptri ] = v

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
        ui8[ HEADER_RESVINDEX1 + ptri * 4 + i ]
    
    setResvUint8        = ( ptri, i, v ) -> 
        ui8[ HEADER_RESVINDEX1 + ptri * 4 + i ] = v
    
    addResvUint8        = ( ptri, i, v ) -> 
        ui8[ HEADER_RESVINDEX1 + ptri * 4 + i ] = v + (
            u = ui8[ HEADER_RESVINDEX1 + ptri * 4 + i ]
        ) ; u

    getResvFloat32      = ( ptri, i    ) -> 
        f32[ HEADER_RESVINDEX4 + ptri + i ]
    
    setResvFloat32      = ( ptri, i, v ) -> 
        f32[ HEADER_RESVINDEX4 + ptri + i ] = v
    
    addResvFloat32      = ( ptri, i, v ) -> 
        f32[ HEADER_RESVINDEX4 + ptri + i ] = v + (
            u = f32[ HEADER_RESVINDEX4 + ptri + i ]
        ) ; u

    newFloat32Array     = ( byteOffset = 0, length ) -> 
        new Float32Array buffer, u32[ this ] + byteOffset, length or u32[ HEADER_LENGTH + this ]

    newUint32Array      = ( byteOffset = 0, length ) -> 
        new Uint32Array buffer, u32[ this ] + byteOffset, length or u32[ HEADER_LENGTH + this ]

    newUint8Array       = ( byteOffset = 0, length ) -> 
        new Uint8Array buffer, u32[ this ] + byteOffset, length or u32[ HEADER_LENGTH + this ]

    subarrayFloat32     = ( begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + this ]
        f32.subarray( begin, begin + count )

    subarrayUint32      = ( begin = 0, count ) -> 
        begin += u32[ HEADER_BEGIN + this ]
        u32.subarray( begin, begin + count )

    subarrayUint8       = ( begin = 0, count ) -> 
        begin += u32[ this ]
        ui8.subarray( begin, begin + count )
    
    setFloat32          = ( value, index = 0 ) ->
        f32[ u32[ HEADER_BEGIN + this ] + index ] = value

    getFloat32          = ( index = 0 ) ->
        f32[ u32[ HEADER_BEGIN + this ] + index ]

    orFloat32           = ( index = 0, fn ) ->
        f32[ u32[ HEADER_BEGIN + this ] + index ] ||= fn.call this

    bindgetFloat32      = ( index = 0 ) ->
        -> f32[ u32[ HEADER_BEGIN + this ] + index ]

    bindsetFloat32      = ( index = 0 ) ->
        ( value ) -> f32[ u32[ HEADER_BEGIN + this ] + index ] = value
        
    setarrayFloat32     = ( array, begin = 0 ) -> 
        f32.set array, begin + u32[ HEADER_BEGIN + this ] ; this

    setUint32           = ( value, index = 0 ) -> 
        u32[ u32[ HEADER_BEGIN + this ] + index ] = value

    getUint32           = ( index = 0 ) -> 
        u32[ u32[ HEADER_BEGIN + this ] + index ]

    orUint32            = ( index = 0, fn ) -> 
        u32[ u32[ HEADER_BEGIN + this ] + index ] ||= fn.call this

    bindgetUint32       = ( index = 0 ) ->
        -> u32[ u32[ HEADER_BEGIN + this ] + index ]

    bindsetUint32       = ( index = 0 ) ->
        ( value ) -> u32[ u32[ HEADER_BEGIN + this ] + index ] = value

    setarrayUint32      = ( array, begin = 0 ) -> 
        u32.set array, begin + u32[ HEADER_BEGIN + this ] ; this

    setUint8            = ( value, index = 0 ) -> 
        ui8[ u32[ this ] + index ] = value

    getUint8            = ( index = 0 ) -> 
        ui8[ u32[ this ] + index ]

    orUint8             = ( index = 0, fn ) ->
        ui8[ u32[ this ] + index ] ||= fn.call this

    bindgetUint8        = ( index = 0 ) ->
        -> ui8[ u32[ this ] + index ]

    bindsetUint8        = ( index = 0 ) ->
        ( value ) -> ui8[ u32[ this ] + index ] = value

    setarrayUint8       = ( array, begin = 0 ) -> 
        ui8.set array, begin + u32[ this ] ; this
        

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

    


    malloc2              = ( constructor, byteLength ) ->
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

        @isPtr      : yes

        isPtri      : yes

        @BPE        : BPE

        BPE         : @BPE

        constructor : ->
            super arguments[0] || Atomics.add u32, 1, 16
            @init arguments[1] if isWindow

        malloc      : ( byteLength ) ->
            byteLength = byteLength or @constructor.byteLength 
            byteOffset = Atomics.add u32, 0, byteLength

            setBegin        this, byteOffset / @BPE
            setLength       this, byteLength / @BPE
            setByteOffset   this, byteOffset

            this

        init        : ( props = {} ) ->
            if !getClassIndex this
                setClassIndex this, this.constructor.classIndex

            for prop, value of props then for Class in classes
                continue unless prop is Class::name
                @adopt new Class().set value; break

            return @

        set         : ( array = [] ) ->
            unless  byteLength = getByteLength this
                if !byteLength = @constructor.byteLength
                    byteLength = array.length * @BPE
                
            if !byteLength then return this
            else this.malloc byteLength
            return setarrayFloat32.call this, array

        adopt       : setParent

        @allocs     : getAllocs

        @create     : -> new this null, arguments...

        Object.defineProperties Pointer::,
            
            childs  : get : getChilds 

            parent  : get : getParent

            tarray  : get : newFloat32Array

    classes.register class XYZ          extends Pointer

        @byteLength : 9 * @BPE

        sinX : -> orFloat32.call this, 4, -> Math.sin @x
        cosX : -> orFloat32.call this, 5, -> Math.cos @x

        sinY : -> orFloat32.call this, 6, -> Math.sin @y
        cosY : -> orFloat32.call this, 7, -> Math.cos @y

        sinZ : -> orFloat32.call this, 8, -> Math.sin @z
        cosZ : -> orFloat32.call this, 9, -> Math.cos @z

        Object.defineProperties XYZ::,
            x : get : bindgetFloat32(0), set : bindsetFloat32(0)
            y : get : bindgetFloat32(1), set : bindsetFloat32(1)
            z : get : bindgetFloat32(2), set : bindsetFloat32(2)

            tarray  : get : -> subarrayFloat32.call this, 0, 3
            cossins : get : ->
                sinX : @sinX(), sinY : @sinY(), sinZ : @sinZ(),
                cosX : @cosX(), cosY : @cosY(), cosZ : @cosZ()

    classes.register class RGBA         extends Pointer

        @byteLength : 4 * @BPE

        toObject : ->
            [ red, green, blue, alpha ] = @f32
            { red, green, blue, alpha }

        Object.defineProperties RGBA::,
            f32 : get : newFloat32Array
            ui8 : get : -> Uint8Array.from @f32, (v) -> v * 0xff
            hex : get : -> "0x" + [ ...@ui8 ].map( (v) -> v.toString(16).padStart(2,0) ).join("")
            u32 : get : -> parseInt @hex, 16
            rgb : get : -> Array.from @ui8.subarray 0, 3
            css : get : -> "rgba( #{@rgb.join(', ')}, #{@obj.alpha} )"
            obj : get : -> @toObject()

    classes.register class Position     extends XYZ

        name        : "position"

    classes.register class Rotation     extends XYZ

        name        : "rotation"

    classes.register class Scale        extends XYZ

        name        : "scale"
        
    classes.register class Color        extends RGBA

        name        : "color"

    classes.register class Vertices     extends Pointer

        name        : "vertices"

        vertex      : ( index = 0 ) ->
            subarrayFloat32 index * 3, 3

        vertices    : ( index = 0, count = 1 ) ->
            subarrayFloat32 index * 3, count * 3

    classes.register class Draw         extends Pointer
        name : "draw"

        @byteLength : 4 * 4

    Object.defineProperties Draw::      ,
        
        type    : get : (-> u32[ @begin     ]), set : ((v) -> u32[ @begin     ] = v)

        offset  : get : (-> u32[ @begin + 1 ]), set : ((v) -> u32[ @begin + 1 ] = v)
        
        begin   : get : (-> u32[ @begin + 2 ]), set : ((v) -> u32[ @begin + 2 ] = v)

        count   : get : (-> u32[ @begin + 3 ]), set : ((v) -> u32[ @begin + 3 ] = v)

                
    classes.register class Matter       extends Pointer

        self.Matter     = Matter

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

    ###

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

        @createScope : ( scope ) ->

            defaultVShader = no
            defaultFShader = no

            for s in scripts.find (s) -> s.type.match /x-shader/i

                shader = if s.text.match /gl_Program/
                    new vShader null, scope
                else new fShader null, scope

                shader . compile s.text 

                if !defaultVShader and shader.vShader
                    defaultVShader = shader 

                if !defaultFShader and shader.fShader
                    defaultFShader = shader 

            scope

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
        
    classes.register class Space    extends Pointer

        self.Space                  = this

        @byteLength                 : BYTELENGTH_GLBUFFER + 16 * 4

    
        INDEX_POINTS_BEGIN          : 0

        INDEX_LINES_BEGIN           : 1

        INDEX_TRIANGES_BEGIN        : 4


        INDEX_POINTS_COUNT          : 2

        INDEX_LINES_COUNT           : 3

        INDEX_TRIANGES_COUNT        : 6


        INDEX_POINTS_OFFSET         : 5

        INDEX_LINES_OFFSET          : 6

        INDEX_TRIANGES_OFFSET       : 9


        INDEX_TYPELENGTH            : 2

        INDEX_DRAW_BEGIN            : 16


        itemsPerPoint               : 8

        bytesPerPoint               : 4 * Space::itemsPerPoint

        drawByteOffset              : 4 * Space::INDEX_DRAW_BEGIN

        drawByteLength              : BYTELENGTH_GLBUFFER - BYTELENGTH_GLBUFFER % Space::bytesPerPoint

        drawableLength              : Space::drawByteLength / 4

        maxPointsCount              : Space::drawByteLength / Space::bytesPerPoint


        Object.defineProperties Space::,

            drawBuffer      :
                get : -> new Float32Array buffer, @byteOffset + @drawByteOffset, @drawableLength
                set : (v) -> @drawBuffer.set v

            pointsStart     :
                get : -> u32[ @begin ]
                set : (v) -> u32[ @begin ] = v

            linesStart      :
                get : -> u32[ @begin + 1 ]
                set : (v) -> u32[ @begin + 1 ] = v

            trianglesStart  :
                get : -> u32[ @begin + 4 ]
                set : (v) -> u32[ @begin + 4 ] = v

            pointsPerType   :
                get : -> u32[ @begin + 2 ]
                set : (v) -> u32[ @begin + 2 ] = v

            pointsCount     :
                get : -> u32[ @begin + 5 ]
                set : (v) -> u32[ @begin + 5 ] = v

            linesCount      :
                get : -> u32[ @begin + 6 ]
                set : (v) -> u32[ @begin + 6 ] = v

            trianglesCount  :
                get : -> u32[ @begin + 7 ]
                set : (v) -> u32[ @begin + 7 ] = v

            pointsOffset    :
                get : -> u32[ @begin + 8 ]
                set : (v) -> u32[ @begin + 8 ] = v

            linesOffset     :
                get : -> u32[ @begin + 9 ]
                set : (v) -> u32[ @begin + 9 ] = v

            trianglesOffset :
                get : -> u32[ @begin + 10 ]
                set : (v) -> u32[ @begin + 10 ] = v


        init            : ->
            return super()

            @pointsPerType = Math.trunc @maxPointsCount / 3

            @pointsStart     = @pointsPerType * 0 + 2
            @linesStart      = @pointsPerType * 1
            @trianglesStart  = @pointsPerType * 2

            @pointsOffset    = @bytesPerPoint * 2
            @linesOffset     = @bytesPerPoint * @pointsPerType
            @trianglesOffset = @bytesPerPoint * @pointsPerType * 2

            this

        drawArrays : ->
            if  count = @trianglesCount
                gl.drawArrays gl.TRIANGLES, @trianglesStart, count

            if  count = @linesCount
                gl.drawArrays gl.TRIANGLES, @linesStart, count
                
            if  count = @pointsCount
                gl.drawArrays gl.TRIANGLES, @pointsStart, count

        upload : -> for shape in Shape.allocs()

            continue unless shape.willUploadIfNeeded

            gl.bufferSubData(
                gl.ARRAY_BUFFER, draw.uploadOffset,
                space.drawBuffer, draw.uploadBegin,
                draw.uploadLength
            ) for draw in GLDraw.allocs shape.ptri

            return this

        append : ( drawType, pointsCount ) ->

            starts = switch drawType
                when WebGL2RenderingContext.POINTS    then @pointsCount += pointsCount
                when WebGL2RenderingContext.LINES     then @linesCount += pointsCount
                when WebGL2RenderingContext.TRIANGLES then @trianglesCount += pointsCount

            offset = switch drawType
                when WebGL2RenderingContext.POINTS    then @pointsOffset
                when WebGL2RenderingContext.LINES     then @linesOffset
                when WebGL2RenderingContext.TRIANGLES then @trianglesOffset

            length = pointsCount * @bytesPerPoint 

            finish = switch drawType
                when WebGL2RenderingContext.POINTS    then @pointsOffset += length
                when WebGL2RenderingContext.LINES     then @linesOffset += length
                when WebGL2RenderingContext.TRIANGLES then @trianglesOffset += length

            offset
    
        mallo2c      : ( drawType, shape ) ->
            pointsCount = shape.pointCount
            dstByteOffset = @append drawType, pointsCount
            srcOffset = dstByteOffset / 4
            length = pointsCount * @itemsPerPoint

            draw = GLDraw.fromOptions {
                drawType ,
                pointsCount ,
                globalOffset : dstByteOffset + @drawBuffer . byteOffset
                uploadOffset : dstByteOffset , uploadBegin : srcOffset
                uploadLength : length
                parent : shape.ptri
            }

            shape.markNeedsUpdate = 1

            draws[ draws.length ] = Object.defineProperties( draw,
                upload : value : gl.bufferSubData.bind(
                    gl, gl.ARRAY_BUFFER, draw.uploadOffset, @drawBuffer, 
                    draw.uploadBegin, draw.uploadLength
                )
            )

    self.addEventListener "DOMContentLoaded"    , ->

        frame = 0
        epoch = 0
        rendering = 0

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
            gl = createCanvas()
                .getContext "webgl2"

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
