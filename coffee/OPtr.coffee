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
    ptri32 = null
    ui8 = null
    f32 = null
    u32 = null
    dvw = null
    buffer = null
    glBuffer = null
    classes = []
    ticks = 0

    RADIANS_PER_DEGREE  = Math.PI / 180.0
    LE = !!(new Uint8Array( Uint16Array.of(1).buffer ).at(0))

    THREADS_STATE   = 5
    THREADS_BEGIN   = 6
    THREADS_COUNT   = 2 or navigator?.hardwareConcurrency

    STATE_READY     = 1
    STATE_LOCKED    = 0
    STATE_WORKING   = 3
    STATE_UNLOCKED  = 4

    THREADS_NULL    = 1
    THREADS_READY   = 2

    OFFSET_GPU          = 1000 * 16
    OFFSET_CPU          = 4096 * 4096
    OFFSET_PTR          = 24

    HINDEX_LENGTH       = 0
    HINDEX_PTRI         = HINDEX_LENGTH++
    HINDEX_BYTEOFFSET   = HINDEX_LENGTH++
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

    state = ( state ) ->
        unless arguments.length
            return Atomics.load ptri32, threadId
        return Atomics.store ptri32, threadId, state

    nextTick = ->
        lock()
        #log "nextTick:", ++ticks

        ptri = Atomics.load ptri32, 1

        while OFFSET_PTR <= ptri -= 16        
            continue unless Atomics.load ptri32, ptri + HINDEX_ISGL
            
            locate  = Atomics.load ptri32, ptri + HINDEX_LOCATED
            paint   = Atomics.load ptri32, ptri + HINDEX_PAINTED

            continue if paint and locate

            index   = Atomics.add ptri32, ptri + HINDEX_NEXT_VERTEXI, 1
            count   = Atomics.load ptri32, ptri + HINDEX_ITER_COUNT

            if  index <= count
                shape   = new Shape ptri

                begin   = index * 3
                end     = begin + 3
                vertex  = shape.vertex index 
                color   = shape.color

                log ptri, index, count, vertex...

                for draw in shape.children
                    draw.vertex( index ).set vertex
                    draw.color( index ).set color
                
            continue if index - count

            if !locate
                Atomics.store ptri32, ptri + HINDEX_LOCATED, 1
                
            if !paint
                Atomics.store ptri32, ptri + HINDEX_PAINTED, 1

            Atomics.store ptri32, ptri + HINDEX_UPDATED, 1

        nextTick()
        
    lock = ->
        state STATE_LOCKED
        Atomics.wait ptri32, threadId

    unlock = ->
        for w in workers when w.state is STATE_LOCKED
            Atomics.store ptri32, w.threadId, STATE_READY
            Atomics.notify ptri32, w.threadId, 1


    LENGTH_GPU = OFFSET_CPU - OFFSET_GPU
    STRIDE_GPU = Math.trunc LENGTH_GPU/3

    if  isWindow
        buffer = new SharedArrayBuffer 1e8
        ptri32 = new Int32Array buffer 
        u32 = new Uint32Array buffer
        f32 = new Float32Array buffer
        dvw = new DataView buffer
        ui8 = new Uint8Array buffer
        
        state = ( state ) ->
            unless state
                return Atomics.load ptri32, THREADS_STATE
            return Atomics.store ptri32, THREADS_STATE, state

        Atomics.add ptri32, 0, OFFSET_CPU
        Atomics.add ptri32, 1, OFFSET_PTR
        Atomics.add ptri32, 2, OFFSET_GPU        
    
        state THREADS_NULL

  

    OFFSET_TRIANGLES    = OFFSET_GPU + STRIDE_GPU * 0
    OFFSET_LINES        = OFFSET_GPU + STRIDE_GPU * 1
    OFFSET_POINTS       = OFFSET_GPU + STRIDE_GPU * 2 

    malloc              = ( constructor, byteLength ) ->
        BYTES_PER_ELEMENT =
            constructor.TypedArray.BYTES_PER_ELEMENT or
            constructor.BYTES_PER_ELEMENT

        classId     = constructor.classId
        byteLength  = constructor.byteLength if !byteLength
        byteLength += 8 - ( byteLength % 8 )
        length      = byteLength / BYTES_PER_ELEMENT

        ptri        = Atomics.add ptri32, 1, 16
        byteOffset  = Atomics.add ptri32, 0, byteLength
        begin       = byteOffset / BYTES_PER_ELEMENT

        Atomics.store ptri32, ptri + HINDEX_PTRI, ptri
        Atomics.store ptri32, ptri + HINDEX_BYTEOFFSET, byteOffset
        Atomics.store ptri32, ptri + HINDEX_BYTELENGTH, byteLength
        Atomics.store ptri32, ptri + HINDEX_CLASSID, classId
        Atomics.store ptri32, ptri + HINDEX_LENGTH, length
        Atomics.store ptri32, ptri + HINDEX_BEGIN, begin

        ptri

    self.emit           = ( event, detail ) ->
        self.dispatchEvent new CustomEvent event, { detail }

    pipe.emit           = ( event, detail ) ->
        @postMessage event

    class Pointer       extends Number

        @byteLength : 0

        @subclasses : []

        @TypedArray : Float32Array

        Object.defineProperty this  , "classId",
            configurable: on
            get : -> Object.defineProperty( this, "classId",
                value : classes.push( this ) - 1
            ).classId

        Object.defineProperty this::, "byteOffset",
            get : -> Atomics.load ptri32, @ptri + HINDEX_BYTEOFFSET

        Object.defineProperty this::, "byteLength",
            get : -> Atomics.load ptri32, @ptri + HINDEX_BYTELENGTH

        Object.defineProperty this::, "length",
            get : -> Atomics.load ptri32, @ptri + HINDEX_LENGTH

        Object.defineProperty this::, "ptri",
            get : -> Atomics.load ptri32, parseInt this
        
        Object.defineProperty this::, "begin",
            get : -> Atomics.load ptri32, @ptri + HINDEX_BEGIN
        
        Object.defineProperty this::, "isGL",
            get : -> Atomics.load ptri32, @ptri + HINDEX_ISGL
            set : (v) -> Atomics.store ptri32, @ptri + HINDEX_ISGL, v
        
        Object.defineProperty this::, "parent",
            get : -> Atomics.load ptri32, @ptri + HINDEX_PARENT
            set : (v) -> Atomics.store ptri32, @ptri + HINDEX_PARENT, v
        
        Object.defineProperty this::, "children",
            get : -> 
                ptri = Atomics.load ptri32, 1
                test = this.ptri

                children = []
                while OFFSET_PTR <= ptri -= 16
                    unless test - Atomics.load ptri32, ptri + HINDEX_PARENT
                        classId = Atomics.load ptri32, ptri + HINDEX_CLASSID
                        children.push new (classes[ classId ])( ptri )
                children
        
        Object.defineProperty this::, "iterCount",
            get : -> Atomics.load u32, @ptri + HINDEX_ITER_COUNT
            set : (v) -> Atomics.store u32, @ptri + HINDEX_ITER_COUNT, v
        
        Object.defineProperty this::, "typedArray",
            get : -> new this.constructor.TypedArray buffer, @byteOffset, @length

        @malloc : ( constructor, byteLength ) ->
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

        constructor : ( ptri ) ->
            unless parseInt super ptri
                return new @constructor malloc @constructor 


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
            pointCount  : get : -> @length / 3

        get : ( offset ) -> ->
            ptri = dvw.getInt32 @byteOffset + @OFFSET_VERTICES, LE
            return new Vertices ptri if ptri ; null

        set : ( offset ) -> ( value ) ->
            ptri = malloc Vertices, value.length * 4
            dvw.setInt32 @byteOffset + @OFFSET_VERTICES, ptri, LE
            f32.set value, ptri32[ ptri + HINDEX_BEGIN ]
            
    class Shape         extends Pointer

        self.Shape      = this

        OFFSET_POSITION : @malloc Position

        OFFSET_ROTATION : @malloc Rotation

        OFFSET_SCALE    : @malloc Scale
        
        OFFSET_COLOR    : @malloc Color

        OFFSET_VERTICES : @malloc Vertices

        @fromOptions    : ( options ) ->
            ptri = malloc this
            ptr = new this ptri

            for prop, value of options
                ptr[ prop ] = value

            ptr.isGL = 1
            ptr.iterCount = ptr.vertices.pointCount
            log ptr.isGL
            ptr

        drawPoints      : ->
            warn glBuffer.malloc gl.POINTS, this

        drawLines       : ->
            warn glBuffer.malloc gl.LINES, this

        vertex          : ( index ) ->
            ptri = dvw.getUint32 @byteOffset + @OFFSET_VERTICES, LE
            byteOffset = ptri32[ ptri + HINDEX_BYTEOFFSET ] + index * 4 * 3
            new Float32Array buffer, byteOffset, 3

    class GLDraw        extends Pointer

        @byteLength         : 8 * 4

        INDEX_START         : 0

        INDEX_COUNT         : 1

        INDEX_GLTYPE        : 2

        INDEX_GLOFFSET      : 3

        classId             : @classId

        Object.defineProperties this::,
            
            start   : 
                get : -> Atomics.load ptri32, @begin + @INDEX_START
                set : (v) -> Atomics.store ptri32, @begin + @INDEX_START, v
            
            count   : 
                get : -> Atomics.load ptri32, @begin + @INDEX_COUNT
                set : (v) -> Atomics.store ptri32, @begin + @INDEX_COUNT, v
            
            vertex  : 
                value : (i) ->
                    byteOffset = @glOffset + ( i * 32 )
                    new Float32Array buffer, byteOffset, 3

            color   : 
                value : (i) ->
                    byteOffset = @glOffset + ( i * 32 ) + 16
                    new Float32Array buffer, byteOffset, 4
           
            glOffset   : 
                get : -> Atomics.load ptri32, @begin + @INDEX_GLOFFSET
                set : (v) -> Atomics.store ptri32, @begin + @INDEX_GLOFFSET, v

            glType    :
                get : -> Atomics.load ptri32, @begin + @INDEX_GLTYPE
                set : (v) -> Atomics.store ptri32, @begin + @INDEX_GLTYPE, v

            glBuffer  :
                get : -> new Float32Array buffer, @glOffset, @count * 8

    class GLBuffer      extends Float32Array
    
        drawOffset       : OFFSET_TRIANGLES + 32

        begin            : @::drawOffset / 4

        drawLength       : .25 * ( LENGTH_GPU - 24 )

        constructor : ->
            super buffer, OFFSET_GPU, LENGTH_GPU/4

            Object.assign this,
                [ WebGL2RenderingContext.TRIANGLE ] : OFFSET_TRIANGLES + 32
                [ WebGL2RenderingContext.LINES ]    : OFFSET_LINES
                [ WebGL2RenderingContext.POINTS ]   : OFFSET_POINTS
    
        malloc      : ( type, shape ) ->
            pointCount = shape.vertices.pointCount
            byteLength = pointCount * 8 * 4
            byteOffset = @[ type ]

            @[type] += byteLength + (4 - byteLength % 4)

            draw            = new GLDraw()

            draw.start      = byteOffset / 4
            draw.count      = pointCount
            draw.glType     = type
            draw.glOffset   = byteOffset
            draw.parent     = shape
            
            draw

        dump        : ->
            new Float32Array buffer, @drawOffset, @drawLength

    self.addEventListener "DOMContentLoaded"    , ->

        INNER_WIDTH                 = innerWidth ? 640
        INNER_HEIGHT                = innerHeight ? 480
        RATIO_PIXEL                 = devicePixelRatio ? 1
        RATIO_ASPECT                = INNER_WIDTH / INNER_HEIGHT 

        @createDisplay  = ->
            canvas = createCanvas()
            gl = canvas.getContext "webgl"
            glBuffer = new GLBuffer()
            
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
                get : Atomics.load.bind Atomics, ptri32, name 
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
        ptri32 = new Int32Array buffer
        glBuffer = new GLBuffer()

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

    self.addEventListener "contextmenu"         , ->
        arguments[0].preventDefault()
        unlock()

    self.addEventListener "click"               , ->
        warn "glbuffer:", glBuffer.dump()

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
