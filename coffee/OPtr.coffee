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

    ticks = 0
    frustrum = null

    RADIANS_PER_DEGREE  = Math.PI / 180.0
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
    BYTELENGTH_GLBUFFER     = 32 * 1e5

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

    ATTRIBS_LENGTH      = 0
    ATTRIBS_BYTELENGTH  = 0

    state = ( state ) ->
        unless arguments.length
            return Atomics.load ptri32, threadId
        return Atomics.store ptri32, threadId, state

    nextTick = ->
        #log "nextTick:", ++ticks

        ptri = Atomics.load ptri32, 1
        test = 0

        while OFFSET_PTR <= ptri -= 16        
            continue unless Atomics.load ptri32, ptri + HINDEX_ISGL
            continue if Atomics.load ptri32, ptri + HINDEX_UPDATED
            
            locate  = Atomics.load ptri32, ptri + HINDEX_LOCATED
            paint   = Atomics.load ptri32, ptri + HINDEX_PAINTED

            continue if paint and locate

            test = 1

            index   = Atomics.add ptri32, ptri + HINDEX_NEXT_VERTEXI, 1
            count   = Atomics.load ptri32, ptri + HINDEX_ITER_COUNT

            if  index <= count
                shape   = new Shape ptri

                begin   = index * 3
                end     = begin + 3
                vertex  = shape.vertex index 
                color   = shape.color

                for draw in shape.children
                    draw.vertex( index ).set vertex
                    draw.color( index ).set color

                    Atomics.store ptri32, draw.ptri + HINDEX_UPDATED, 0
                    
                #log ptri, index 
            
            continue if index - count

            if !locate
                Atomics.store ptri32, ptri + HINDEX_LOCATED, 1
                
            if !paint
                Atomics.store ptri32, ptri + HINDEX_PAINTED, 1

            Atomics.store ptri32, ptri + HINDEX_UPDATED, 1

        if  test is 1
            return nextTick()

        lock()
        nextTick()
        
    lock = ->
        state STATE_LOCKED
        Atomics.wait ptri32, threadId

    unlock = ->
        for w in workers when w.state is STATE_LOCKED
            Atomics.store ptri32, w.threadId, STATE_READY
            Atomics.notify ptri32, w.threadId, 1

    if  isWindow
        buffer = new SharedArrayBuffer 1e8
        ptri32 = new Int32Array buffer 
        u32 = new Uint32Array buffer
        f32 = new Float32Array buffer
        dvw = new DataView buffer
        ui8 = new Uint8Array buffer

        scripts = Array.from document.querySelectorAll "script"
        
        state = ( state ) ->
            unless state
                return Atomics.load ptri32, THREADS_STATE
            return Atomics.store ptri32, THREADS_STATE, state

        Atomics.add ptri32, 0, OFFSET_CPU
        Atomics.add ptri32, 1, OFFSET_PTR
        Atomics.add ptri32, 2, OFFSET_GPU        
    
        state THREADS_NULL

    malloc              = ( constructor, byteLength ) ->
        BYTES_PER_ELEMENT =
            constructor.TypedArray.BYTES_PER_ELEMENT or
            constructor.BYTES_PER_ELEMENT

        classId     = constructor.classId
        byteLength  = constructor.byteLength if !byteLength
        length      = ( allocLength = byteLength ) / BYTES_PER_ELEMENT
        byteLength += 8 - ( byteLength % 8 )

        ptri        = Atomics.add ptri32, 1, 16
        byteOffset  = Atomics.add ptri32, 0, byteLength

        Atomics.add   ptri32, 0, 8 - ( byteLength % 8 )
        begin       = byteOffset / BYTES_PER_ELEMENT

        Atomics.store ptri32, ptri + HINDEX_PTRI, ptri
        Atomics.store ptri32, ptri + HINDEX_BYTEOFFSET, byteOffset
        Atomics.store ptri32, ptri + HINDEX_BYTELENGTH, allocLength
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

        @allocs     : ( parent ) ->
            ptri = Atomics.load ptri32, 1
            classId = @classId

            while OFFSET_PTR <= ptri -= 16        
                continue unless classId is Atomics.load ptri32, ptri + HINDEX_CLASSID
                continue if parent and parent isnt Atomics.load ptri32, ptri + HINDEX_PARENT
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

        constructor : ( ptri ) ->
            unless parseInt super ptri
                return new @constructor malloc @constructor 
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
            f32.set value, ptri32[ ptri + HINDEX_BEGIN ]

    class XYZ           extends Pointer

        @byteLength : 4 * 3

        Object.defineProperties XYZ::,
            x : get : ( -> f32[ @begin     ] ), set : ( (v) -> f32[ @begin     ] = v )
            y : get : ( -> f32[ @begin + 1 ] ), set : ( (v) -> f32[ @begin + 1 ] = v )
            z : get : ( -> f32[ @begin + 2 ] ), set : ( (v) -> f32[ @begin + 2 ] = v )

        set : ( value ) ->
            f32.set value, @begin ; @

    class RGBA          extends Pointer

        @byteLength : 4 * 4

        Object.defineProperties RGBA::,
            r : get : ( -> f32[ @begin     ] ), set : ( (v) -> f32[ @begin     ] = v )
            g : get : ( -> f32[ @begin + 1 ] ), set : ( (v) -> f32[ @begin + 1 ] = v )
            b : get : ( -> f32[ @begin + 2 ] ), set : ( (v) -> f32[ @begin + 2 ] = v )
            a : get : ( -> f32[ @begin + 3 ] ), set : ( (v) -> f32[ @begin + 3 ] = v )

        set : ( value ) ->
            f32.set value, @begin ; @

    class Position2     extends XYZ
    class Rotation2     extends XYZ
    class Scale2        extends XYZ
    class Color2        extends RGBA

    class Vertices2     extends Pointer

        Object.defineProperties Vertices2::,

            at  : value : ( i ) ->
                begin = @begin + i * 3
                f32.subarray begin, begin + 3 

            set : value : ( v, i = @begin ) ->
                f32.set v, i ; @
                
            get : get   : ( i = @begin, length = @length ) ->
                f32.subarray i, i + length 
                
    Object.defineProperties Pointer,   
    
        attributes : value : new Object

        hasAttribute : value : ( definitions = {} ) ->
            for attribute , Constructor of definitions
                @attributes[ attribute ] = ( ( index, prop, Class ) ->

                    Object.defineProperty this, prop,
                            get : -> new Class( u32[ @begin + index ] or= malloc Class )
                            set : ( v ) -> u32[ @begin + index ] = parseInt v
                    
                    return { index, class: Class }

                ).call( this::, @byteLength / 4, attribute, Constructor )
                @byteLength += 4
            @classId

    class Matter        extends Pointer

        self.Matter     = Matter

        @byteLength     : 4 * 16

        @hasAttribute position : Position2

        @hasAttribute color : Color2

        @hasAttribute scale : Scale2
        
        @hasAttribute rotation : Rotation2

        @hasAttribute vertices : Vertices2

        @create : ( options = {} ) ->
            byteLength = @byteLength + options.vertices.length * 4
            matter = new this malloc Matter, byteLength
            for prop, value of options
                Class = @attributes[ prop ].class
                length = value.length
                byteLength = Class.byteLength or length * 4
                log 2, prop, value

                log 5, new Class( matter[ prop ] =
                    malloc Class, byteLength
                ).set( value )

            matter

            
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
                set     : -> unlock Atomics.store ptri32, @ptri + HINDEX_UPDATED, 1

            willUploadIfNeeded : 
                get     : -> Atomics.and ptri32, @ptri + HINDEX_UPDATED, 0

        drawPoints      : ->
            @draws.push space.malloc gl.POINTS, this

        drawLines       : ->
            @draws.push space.malloc gl.LINES, this

        drawTriangles   : ->
            @draws.push space.malloc gl.TRIANGLES, this

        vertex          : ( index ) ->
            ptri = dvw.getUint32 @byteOffset + @OFFSET_VERTICES, LE
            byteOffset = ptri32[ ptri + HINDEX_BYTEOFFSET ] + index * 4 * 3
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


    class Space         extends Pointer

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
    
        malloc      : ( drawType, shape ) ->
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

        createFrustrum  = ( options ) ->
            frustrum = Frustrum.fromOptions options 
            frustrum . setViewport gl
            frustrum . listenWindow()

        @createDisplay  = ->
            gl = createCanvas()
                .getContext "webgl2"

            initialProgram()
            resolveDefines()
            createFrustrum()

            space = new Space()

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
