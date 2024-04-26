self.name = "window"

do  self.init   = ->

    log = -> console.log name, ...arguments
    warn = -> console.warn name, ...arguments
    error = -> console.error name, ...arguments
    number = -> arguments[0].split("").reduce (a,b) ->
        ( b.charCodeAt() + ( a.charCodeAt?() or a ) )

    [
        HEADERS_LENGTH_OFFSET       = 1
        HINDEX_PTRI                 = HEADERS_LENGTH_OFFSET++
        HINDEX_LENGTH               = HEADERS_LENGTH_OFFSET++
        HINDEX_BYTEOFFSET           = HEADERS_LENGTH_OFFSET++
        HINDEX_BYTELENGTH           = HEADERS_LENGTH_OFFSET++
        HINDEX_RESOLV_ID            = HEADERS_LENGTH_OFFSET++
        HINDEX_LOCKFREE             = HEADERS_LENGTH_OFFSET++
        HINDEX_PARENT               = HEADERS_LENGTH_OFFSET++
        HINDEX_ITERINDEX            = HEADERS_LENGTH_OFFSET++
        HINDEX_NEEDSUPDATE          = HEADERS_LENGTH_OFFSET++
        HINDEX_ATTRIBSOFFSET        = HEADERS_LENGTH_OFFSET++
        HINDEX_ATTRIBSLENGTH        = HEADERS_LENGTH_OFFSET++
    
        BUFFER_TEST_START_LENGTH    = Math.pow (navigator?.deviceMemory or 1)+1, 11
        BUFFER_TEST_STEP_DIVIDER    = 1e2
        INITIAL_BYTELENGTH          = 6e4
        BYTES_PER_ELEMENT           = 4
        RESERVED_BYTELENGTH         = 64
        ALLOCATION_BYTEOFFSET       = 100000 * 16 * 4
        HEADERS_LENGTH              = 16
        HEADERS_BYTE_LENGTH         = 4 * 16
        MAX_PTR_COUNT               = 1e5
        MAX_THREAD_COUNT            = -4 + navigator?.hardwareConcurrency or 3
        ITERATION_PER_THREAD        = 100
        UI_LENGTH                   = 4 * 48
        UI_OFFSET                   = null
        LE                          = new self.Uint8Array( self.Uint16Array.of(1).buffer ).at()
        RADIANS_PER_DEGREE          = Math.PI / 180.0
    
        INNER_WIDTH                 = innerWidth ? 640
        INNER_HEIGHT                = innerHeight ? 480
        RATIO_PIXEL                 = devicePixelRatio ? 1
        RATIO_ASPECT                = INNER_WIDTH / INNER_HEIGHT 

        EVENT_READY                 = new (class EVENT_READY extends Number)(
            number( /EVENT_READY/.source )
        )

        DUMP_WEAKMAP                = new (class DUMP_WEAKMAP extends Number)(
            number( /DUMP_WEAKMAP/.source )
        )

        CONTEXT_READY               = new (class CONTEXT_READY extends Number)(
            number( /CONTEXT_READY/.source )
        )



        throw /MAX_HEADERS_LENGTH_EXCEED/ if HEADERS_LENGTH_OFFSET >= HEADERS_LENGTH ]

    [
        blobURL,
        objbuf, ptrbuf, keybuf,
        lock, unlock,
        malloc, littleEnd,
        ui, p32, dvw, si8, ui8, cu8, i32, u32, f32, f64, u64, i64, i16, u16,

        andUint32 , orUint32 , xorUint32 , subUint32 , addUint32 , loadUint32 , storeUint32 , getUint32 , setUint32 , exchangeUint32 , compareUint32 ,
        andUint16 , orUint16 , xorUint16 , subUint16 , addUint16 , loadUint16 , storeUint16 , getUint16 , setUint16 , exchangeUint16 , compareUint16 ,
        andUint8  , orUint8  , xorUint8  , subUint8  , addUint8  , loadUint8  , storeUint8  , getUint8  , setUint8  , exchangeUint8  , compareUint8  ,
        andInt32  , orInt32  , xorInt32  , subInt32  , addInt32  , loadInt32  , storeInt32  , getInt32  , setInt32  , exchangeInt32  , compareInt32  ,
        andInt16  , orInt16  , xorInt16  , subInt16  , addInt16  , loadInt16  , storeInt16  , getInt16  , setInt16  , exchangeInt16  , compareInt16  ,
        andInt8   , orInt8   , xorInt8   , subInt8   , addInt8   , loadInt8   , storeInt8   , getInt8   , setInt8   , exchangeInt8   , compareInt8   ,

        UI,
        OnscreenCanvas,
        OffscreenCanvas,
        WebGLShader,
        VertexShader,
        FragmentShader,

        Object3,
        Uint8Array  , Int8Array   , Uint8ClampedArray,
        Uint16Array , Int16Array  , Uint32Array  , Int32Array,
        Float32Array, Float64Array, BigInt64Array, BigUint64Array ] = []

    [
        bc          = new BroadcastChannel "0ptr"
        textEncoder = new TextEncoder()
        textDecoder = new TextDecoder()
        selfName    = self.name
        isWindow    = document?
        isBridge    = /bridge/i.test selfName  
        isThread    = /thread/i.test selfName
        threadId    = isThread and parseInt selfName.match /\d+/
        now         = Date.now()
        pnow        = performance.now()
        resolvs     = new WeakMap()
        replies     = new Object()
        objects     = new Object()
        workers     = new self.Array()
        littleEnd   = new self.Uint8Array(self.Uint32Array.of(0x01).buffer)[0]
        TypedArray  = Object.getPrototypeOf self.Uint8Array
        GLContext   = WebGL2RenderingContext ? WebGLRenderingContext ]

    resolvFind  = ( id, retry = 0 ) ->
        i = HINDEX_RESOLV_ID + Atomics.load p32, 1
        ptri = 0
        #error id, retry

        while i > 0
            if  id is Atomics.load p32, i
                ptri = Atomics.load p32, ptri + HINDEX_PTRI
                break
            i -= HEADERS_LENGTH

        if !ptri
            if  isBridge 
                ptri = Atomics.add p32, 1, HEADERS_LENGTH
                Atomics.store p32, ptri + HINDEX_RESOLV_ID, id
                Atomics.store p32, ptri + HINDEX_PTRI, ptri
                return ptri

            Atomics.wait p32, 3, 0, 20

            if  retry > 30
                throw /TOO_MANY_TRIED_TO_FIND/
            return resolvFind id, ++retry

        return ptri

        #else if isBridge then return ptri
        
        #unless Atomics.load p32, ptri + HINDEX_LOCKFREE
            #Atomics.wait p32, ptri + HINDEX_LOCKFREE, 1, 100

        #return ptri

    resolvCall  = ->
        Error.captureStackTrace e = {}
        
        stack   = e.stack.toString()
        length  = stack.length

        cBreak  = "\n".charCodeAt()
        cBrace  = "\)".charCodeAt()
        cColon  = "\:".charCodeAt()
        
        cCount  = 2
        discard = on
        lasti = length
        call = 0
        vals = []

        while length--
            switch stack.charCodeAt length

                when cBreak then discard = !cCount = 2
                when cBrace then lasti = length
                when cColon
                    unless discard
                        call += vals[ vals.length ] =
                            parseInt( stack.substring length + 1, lasti )

                    unless --cCount
                        discard = on

                    lasti = length

        return resolvFind call

    randomUUID  = ->
        crypto?.randomUUID() or btoa(
            new Date().toISOString()
        )
        .toLowerCase().split("")
        .toSpliced(8,0,"-").toSpliced(13,0,"-")
        .toSpliced(18,0,"-").toSpliced(24,0,"-")
        .join("").substring(0, 36).trim()
        .padEnd(36, String.fromCharCode(50 + Math.random() * 40 ))

    initMemory  = ( buffers ) ->

        objbuf = buffers.objbuf
        ptrbuf = buffers.ptrbuf
        keybuf = buffers.keybuf

        u64 = new self.BigUint64Array objbuf
        i64 = new self.BigInt64Array objbuf
        f32 = new self.Float32Array objbuf
        f64 = new self.Float64Array objbuf
        i32 = new self.Int32Array objbuf
        u32 = new self.Uint32Array objbuf
        i16 = new self.Int16Array objbuf
        u16 = new self.Uint16Array objbuf
        ui8 = new self.Uint8Array objbuf
        cu8 = new self.Uint8ClampedArray objbuf
        si8 = new self.Int8Array objbuf
        dvw = new self.DataView objbuf

        p32 = new self.Int32Array ptrbuf
        ui  = new UI keybuf
        
        lock                = ( ptri ) ->
            if  ptri
                Atomics.wait p32, ptri + HINDEX_LOCKFREE, 1

            else
                Atomics.wait p32 , if isThread then 4 else 3
                
        unlock              = ( ptri ) ->
            if  ptri
                Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                Atomics.notify p32, ptri + HINDEX_LOCKFREE
            Atomics.notify p32 , if isThread then 3 else 4

        malloc              = ( byteLength = 0, alignBytes = 1 ) ->
            if  byteLength > 0
                if  alignBytes > 1
                    if  mod = objbuf.byteLength % alignBytes
                        Atomics.add p32, 0, alignBytes - mod

                byteOffset = Atomics.add p32, 0, byteLength
                if  byteOffset > objbuf.byteLength
                    objbuf.grow byteOffset + 1e5

                return byteOffset
            return objbuf.byteLength

        do ->
            addUint32           = Atomics.add.bind Atomics, u32
            andUint32           = Atomics.and.bind Atomics, u32
            orUint32            = Atomics.or.bind Atomics, u32
            xorUint32           = Atomics.xor.bind Atomics, u32
            subUint32           = Atomics.sub.bind Atomics, u32
            loadUint32          = Atomics.load.bind Atomics, u32
            storeUint32         = Atomics.store.bind Atomics, u32
            exchangeUint32      = Atomics.exchange.bind Atomics, u32
            compareUint32       = Atomics.compareExchange.bind Atomics, u32
            getUint32           = ( o ) -> dvw.getUint32 o, littleEnd
            setUint32           = ( o, v ) -> dvw.setUint32 o, v, littleEnd

            addUint16           = Atomics.add.bind Atomics, u16
            andUint16           = Atomics.and.bind Atomics, u16
            orUint16            = Atomics.or.bind Atomics, u16
            xorUint16           = Atomics.xor.bind Atomics, u16
            subUint16           = Atomics.sub.bind Atomics, u16
            loadUint16          = Atomics.load.bind Atomics, u16
            storeUint16         = Atomics.store.bind Atomics, u16
            exchangeUint16      = Atomics.exchange.bind Atomics, u16
            compareUint16       = Atomics.compareExchange.bind Atomics, u16
            getUint16           = ( o ) -> dvw.getUint16 o, littleEnd
            setUint16           = ( o, v ) -> dvw.setUint16 o, v, littleEnd

            addUint8            = Atomics.add.bind Atomics, ui8 
            andUint8            = Atomics.and.bind Atomics, ui8 
            orUint8             = Atomics.or.bind Atomics, ui8 
            xorUint8            = Atomics.xor.bind Atomics, ui8 
            subUint8            = Atomics.sub.bind Atomics, ui8 
            loadUint8           = Atomics.load.bind Atomics, ui8 
            storeUint8          = Atomics.store.bind Atomics, ui8 
            exchangeUint8       = Atomics.exchange.bind Atomics, ui8 
            compareUint8        = Atomics.compareExchange.bind Atomics, ui8 
            getUint8            = ( o ) -> dvw.getUint8 o, littleEnd
            setUint8            = ( o, v ) -> dvw.setUint8 o, v, littleEnd

            addInt32            = Atomics.add.bind Atomics, u32
            andInt32            = Atomics.and.bind Atomics, u32
            orInt32             = Atomics.or.bind Atomics, u32
            xorInt32            = Atomics.xor.bind Atomics, u32
            subInt32            = Atomics.sub.bind Atomics, u32
            loadInt32           = Atomics.load.bind Atomics, u32
            storeInt32          = Atomics.store.bind Atomics, u32
            exchangeInt32       = Atomics.exchange.bind Atomics, u32
            compareInt32        = Atomics.compareExchange.bind Atomics, u32
            getInt32            = ( o ) -> dvw.getInt32 o, littleEnd
            setInt32            = ( o, v ) -> dvw.setInt32 o, v, littleEnd

            addInt16            = Atomics.add.bind Atomics, u16
            andInt16            = Atomics.and.bind Atomics, u16
            orInt16             = Atomics.or.bind Atomics, u16
            xorInt16            = Atomics.xor.bind Atomics, u16
            subInt16            = Atomics.sub.bind Atomics, u16
            loadInt16           = Atomics.load.bind Atomics, u16
            storeInt16          = Atomics.store.bind Atomics, u16
            exchangeInt16       = Atomics.exchange.bind Atomics, u16
            compareInt16        = Atomics.compareExchange.bind Atomics, u16
            getInt16            = ( o ) -> dvw.getInt16 o, littleEnd
            setInt16            = ( o, v ) -> dvw.setInt16 o, v, littleEnd

            addInt8             = Atomics.add.bind Atomics, si8 
            andInt8             = Atomics.and.bind Atomics, si8 
            orInt8              = Atomics.or.bind Atomics, si8 
            xorInt8             = Atomics.xor.bind Atomics, si8 
            subInt8             = Atomics.sub.bind Atomics, si8 
            loadInt8            = Atomics.load.bind Atomics, si8 
            storeInt8           = Atomics.store.bind Atomics, si8 
            exchangeInt8        = Atomics.exchange.bind Atomics, si8 
            compareInt8         = Atomics.compareExchange.bind Atomics, si8 
            getInt8             = ( o ) -> dvw.getInt8 o, littleEnd
            setInt8             = ( o, v ) -> dvw.setInt8 o, v, littleEnd


        ; 0



    class UI extends self.DataView

        lastEventCount      : 0

        OFFSET_EVENT_TIME   : 1 * 4

        OFFSET_EVENT_DELTA  : 2 * 4

        OFFSET_EVENT_COUNT  : 3 * 4

        OFFSET_VIEWPORT_X   : 4 * 4

        OFFSET_VIEWPORT_Y   : 5 * 4
        
        OFFSET_WIDTH        : 6 * 4

        OFFSET_HEIGHT       : 7 * 4
        
        OFFSET_ASPECT       : 8 * 4

        OFFSET_FOVY         : 9 * 4

        OFFSET_NEAR         : 10 * 4
        
        OFFSET_FAR          : 11 * 4

        OFFSET_CLIENT_X     : 12 * 4

        OFFSET_CLIENT_Y     : 13 * 4

        OFFSET_MOVE_FORTH   : 14 * 4 + 0

        OFFSET_MOVE_BACK    : 14 * 4 + 1

        OFFSET_MOVE_LEFT    : 14 * 4 + 2

        OFFSET_MOVE_RIGHT   : 14 * 4 + 3
        
        OFFSET_MOVE_SPACE   : 15 * 4 + 0
        
        OFFSET_MOVE_TAB     : 15 * 4 + 1
        
        OFFSET_MOVE_ENTER   : 15 * 4 + 2
        
        OFFSET_MOVE_CAPS    : 15 * 4 + 3
        
        OFFSET_MOVE_SHIFT   : 16 * 4 + 0
    
        OFFSET_MOVE_CTRL    : 16 * 4 + 1
        
        OFFSET_MOVE_ALT     : 16 * 4 + 2

        OFFSET_MOVE_META    : 16 * 4 + 3

        MOVEMENT_PER_SECOND_X   : 17

        MOVEMENT_PER_SECOND_Y   : 18
        
        MOVEMENT_PER_SECOND_Z   : 19

        ROTATION_PER_SECOND_X   : 20
        
        ROTATION_PER_SECOND_Y   : 21
        
        ROTATION_PER_SECOND_Z   : 22
        
        OFFSET_MATRIX       : 32 * 4

        LENGTH_MATRIX       : 16

        handle : (e) ->
            @setUint32 @OFFSET_EVENT_COUNT, ++@lastEventCount, LE
            @setFloat32 @OFFSET_EVENT_DELTA, e.timeStamp - @timeStamp, LE
            @setFloat32 @OFFSET_EVENT_TIME, e.timeStamp, LE
            e.preventDefault() if e.cancelable
            ; on


        listen : ( window ) ->
            window.addEventListener "pointermove", (e) =>
                @setFloat32 @OFFSET_CLIENT_X, e.clientX, LE 
                @setFloat32 @OFFSET_CLIENT_Y, e.clientY, LE 
                @handle e

            [   left, forth, right, back,
                space, tab, enter, caps,
                shift, ctrl, alt, meta ] = new Array(64).fill(0)

            window.addEventListener "keydown", (e) =>
                switch e.keyCode
                    when 65, 37 then @setUint8 @OFFSET_MOVE_LEFT, ++left 
                    when 87, 38 then @setUint8 @OFFSET_MOVE_FORTH, ++forth
                    when 68, 39 then @setUint8 @OFFSET_MOVE_RIGHT, ++right 
                    when 83, 40 then @setUint8 @OFFSET_MOVE_BACK, ++back 
                    when 32     then @setUint8 @OFFSET_MOVE_SPACE, ++space 
                    when 9      then @setUint8 @OFFSET_MOVE_TAB, ++tab
                    when 13     then @setUint8 @OFFSET_MOVE_ENTER, ++enter 
                    when 20     then @setUint8 @OFFSET_MOVE_CAPS, ++caps 
                    when 16     then @setUint8 @OFFSET_MOVE_SHIFT, ++shift 
                    when 17     then @setUint8 @OFFSET_MOVE_CTRL, ++ctrl 
                    when 18     then @setUint8 @OFFSET_MOVE_ALT, ++alt 
                    when 91     then @setUint8 @OFFSET_MOVE_META, ++meta 
                @handle e

            window.addEventListener "keyup", (e) =>
                switch e.keyCode
                    when 65, 37 then @setUint8 @OFFSET_MOVE_LEFT, left = 0 
                    when 87, 38 then @setUint8 @OFFSET_MOVE_FORTH, forth = 0 
                    when 68, 39 then @setUint8 @OFFSET_MOVE_RIGHT, right = 0 
                    when 83, 40 then @setUint8 @OFFSET_MOVE_BACK, back = 0 
                    when 32     then @setUint8 @OFFSET_MOVE_SPACE, space = 0 
                    when 9      then @setUint8 @OFFSET_MOVE_TAB, tab = 0 
                    when 13     then @setUint8 @OFFSET_MOVE_ENTER, enter = 0 
                    when 20     then @setUint8 @OFFSET_MOVE_CAPS, caps = 0 
                    when 16     then @setUint8 @OFFSET_MOVE_SHIFT, shift = 0 
                    when 17     then @setUint8 @OFFSET_MOVE_CTRL, ctrl = 0 
                    when 18     then @setUint8 @OFFSET_MOVE_ALT, alt = 0 
                    when 91     then @setUint8 @OFFSET_MOVE_META, meta = 0   
                @handle e

        viewport : ( x, y, width, height ) ->
            @setFloat32 @OFFSET_VIEWPORT_X, x, LE 
            @setFloat32 @OFFSET_VIEWPORT_Y, y, LE 
            @setFloat32 @OFFSET_WIDTH, width, LE 
            @setFloat32 @OFFSET_HEIGHT, height, LE 
            @setFloat32 @OFFSET_ASPECT, width/height, LE 

            this

        frustrum : ( near = @near, far = @far, right = @width, bottom = @height, top = @viewportY, left = @viewportX ) ->
            ###
            * @param left   Number Farthest left on the x-axis
            * @param right  Number Farthest right on the x-axis
            * @param bottom Number Farthest down on the y-axis
            * @param top    Number Farthest up on the y-axis
            * @param near   Number Distance to the near clipping plane along the -Z axis
            * @param far    Number Distance to the far clipping plane along the -Z axis
            * @return Float32Array A perspective transformation matrix
            ###
    
            unless left then left = - (  right /= 2 )
            unless top  then  top = - ( bottom /= 2 )
            
            #. Make sure there is no division by zero
            if  left is right  or  bottom is top  or  near is far
                throw [ "Invalid frustrum parameters:", ...arguments ]
    
            if  near <= 0      or     far <= 0    or  near >= far
                throw [ "Distance near >= far and must be positive:", { near, far } ]
    
            w = right - left
            h = top - bottom

            sx = 2 * near / w
            sy = 2 * near / h
    
            c2 = - ( far + near ) / (far - near)
            c1 = 2 * near * far / ( near - far )
    
            tx = -near * (   left + right ) / w
            ty = -near * ( bottom + top   ) / h    

            @matrix.set [
                sx,       0,       0,      0,
                 0,      sy,       0,      0,
                 0,       0,      c2,     -1,
                tx,      ty,      c1,      0
            ]

            this

        setMovementsPerSecond : ( x, y, z ) ->
            @setFloat32 @MOVEMENT_PER_SECOND_X, x, LE
            @setFloat32 @MOVEMENT_PER_SECOND_Y, y, LE
            @setFloat32 @MOVEMENT_PER_SECOND_Z, z, LE
            this

        setRotationsPerSecond : ( x, y, z ) ->
            @setFloat32 @ROTATION_PER_SECOND_X, x, LE
            @setFloat32 @ROTATION_PER_SECOND_Y, y, LE
            @setFloat32 @ROTATION_PER_SECOND_Z, z, LE
            this

        perspective : ( fovy = 60, near = 0.01, far = 1000, aspect = @aspect ) ->

            if  fovy <= 0 or fovy >= 180 or aspect <= 0
                throw [ "Invalid parameters to perspective", { fovy, aspect } ]
            
            half_fovy = ( .5 * fovy * (Math.PI / 180) )
            bottom = - ( top = near * Math.tan half_fovy )
            left = - ( right = top * aspect )

            @setFloat32 @OFFSET_FOVY, fovy, LE 
            @setFloat32 @OFFSET_NEAR, near, LE 
            @setFloat32 @OFFSET_FAR, far, LE        
                
            @frustrum near, far, right, bottom, top, left

        orthographic : ( near, far, right, bottom, top, left ) ->
            if  left is right or bottom is top or near is far
                throw [ "Invalid parameters to orthographic", ...arguments ]
    
            widthRatio  = 1 / ( right - left )
            heightRatio = 1 / (   top - bottom )
            depthRatio  = 1 / (   far - near )

            @setFloat32 @OFFSET_NEAR, near, LE 
            @setFloat32 @OFFSET_FAR, far, LE             
    
            sx =  2 *  widthRatio
            sy =  2 * heightRatio
            sz = -2 *  depthRatio
    
            tz = - (   near + far  ) *  depthRatio
            tx = - (  right + left ) *  widthRatio
            ty = - ( bottom + top  ) * heightRatio
    
            @matrix.set [
                sx,       0,       0,     tx,
                 0,      sy,       0,     ty,
                 0,       0,      sz,     tz,
                 0,       0,       0,      1
            ]

            this

        Object.defineProperties UI::,
            
            x : get : -> @getFloat32 @OFFSET_CLIENT_X, LE

            y : get : -> @getFloat32 @OFFSET_CLIENT_Y, LE

            delta : get : -> @getFloat32 @OFFSET_EVENT_DELTA, LE
            
            timeStamp : get : -> @getFloat32 @OFFSET_EVENT_TIME, LE

            moveForth : get : -> @getUint8 @OFFSET_MOVE_FORTH
            
            moveBack : get : -> @getUint8 @OFFSET_MOVE_BACK
            
            moveLeft : get : -> @getUint8 @OFFSET_MOVE_LEFT
            
            moveRight : get : -> @getUint8 @OFFSET_MOVE_RIGHT

            keySpace : get : -> @getUint8 @OFFSET_MOVE_SPACE

            keyTab : get : -> @getUint8 @OFFSET_MOVE_TAB
            
            keyCaps : get : -> @getUint8 @OFFSET_MOVE_CAPS
            
            keyEnter : get : -> @getUint8 @OFFSET_MOVE_ENTER

            keyShift : get : -> @getUint8 @OFFSET_MOVE_SHIFT
            
            keyCtrl : get : -> @getUint8 @OFFSET_MOVE_CTRL
            
            keyAlt : get : -> @getUint8 @OFFSET_MOVE_ALT
            
            keyMeta : get : -> @getUint8 @OFFSET_MOVE_META

            xMovementPerSecond : get : -> @getFloat32 @MOVEMENT_PER_SECOND_X, LE

            yMovementPerSecond : get : -> @getFloat32 @MOVEMENT_PER_SECOND_Y, LE
            
            zMovementPerSecond : get : -> @getFloat32 @MOVEMENT_PER_SECOND_Z, LE

            xRotationPerSecond : get : -> @getFloat32 @ROTATION_PER_SECOND_X, LE

            yRotationPerSecond : get : -> @getFloat32 @ROTATION_PER_SECOND_Y, LE
            
            zRotationPerSecond : get : -> @getFloat32 @ROTATION_PER_SECOND_Z, LE

            viewportX : get : -> @getFloat32 @OFFSET_VIEWPORT_X, LE

            viewportY : get : -> @getFloat32 @OFFSET_VIEWPORT_Y, LE

            width : get : -> @getFloat32 @OFFSET_WIDTH, LE
            
            height : get : -> @getFloat32 @OFFSET_HEIGHT, LE
            
            aspect : get : -> @getFloat32 @OFFSET_ASPECT, LE

            fovy : get : -> @getFloat32 @OFFSET_FOVY, LE
            
            near : get : -> @getFloat32 @OFFSET_NEAR, LE
            
            far : get : -> @getFloat32 @OFFSET_FAR, LE

            matrix : 
                get : -> DOMMatrix::new @byteOffset + @OFFSET_MATRIX
                set : -> @matrix.set arguments[0]

            eventCount : get : -> @getUint32 @OFFSET_EVENT_COUNT, LE

            hasEvent : get : -> 
                unless @eventCount is @lastEventCount
                    return @lastEventCount = @eventCount
                no

    oncontextready = ->
        return unless isThread
        ptri = Atomics.load p32, 1

        while ptri > HEADERS_LENGTH
            if  Atomics.and p32, ptri + HINDEX_NEEDSUPDATE, 0

                log "updating" + ptri, Object3.at( ptri )

                #todo   threadlar yalnizda update icin obje
                #todo   olusturmali ama kodu okudugu icin
                #todo   degisik seyler oluyor
                #todo   
                #todo   isColorNeedsUpdate?
                #todo       getColor
                #todo           getNextPaintPoint
                #todo               isNull
                #todo                   flagDone
                #todo         
                #todo   isVertexNeedsUpdate?
                #todo       getRotation
                #todo           getScale
                #todo               getPosition
                #todo                   getNextVertexPoint
                #todo                       isNull
                #todo                           flagDone




            ptri -= HEADERS_LENGTH

        lock()
        oncontextready()

    regenerate  = ->

        Object.defineProperties Object::,
            toArray : value : -> Object.values this

        Object.defineProperties TypedArray,

            from                :
                value  : ->
                    array = new this arguments[0].length

                    if  isBridge
                        array[i] = arguments[0][i] for i of array
                        unlock()
                    else
                        lock()

                    array

            of                  :
                value : ->
                    array = new this arguments.length

                    if  isBridge
                        
                        array[i] = arguments[i] for i of array
                        unlock()

                    else
                        lock()

                    array

            at                  :
                value : ( ptri ) ->
                    return unless length = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset = Atomics.load p32, ptri + HINDEX_BYTEOFFSET
                    new this objbuf, byteOffset, length, ptri

        Object.defineProperties TypedArray::,
            
            subarray            :
                #part of this
                value   : ( begin = 0, end = @length ) ->
                    new @constructor( @buffer, 
                        @byteOffset + (@BYTES_PER_ELEMENT * begin),
                        end - begin
                    )
                
            sub                 :
                value           : ( byteOffset = 0, length ) ->
                    new this.TypedArray @buffer, @byteOffset + byteOffset, length

            TypedArray          :
                get             : ->
                    tarray = this
                    while !Object.hasOwn tarray, "BYTES_PER_ELEMENT" 
                        tarray = Object.getPrototypeOf tarray
                    self[ tarray.constructor.name ]

            detach              :
                value           : ( byteOffset = 0, length, ArrayInstance = @TypedArray ) ->
                    array = @sub byteOffset, length
                    buffer = new ArrayBuffer length * @BYTES_PER_ELEMENT
                    detached = new ArrayInstance buffer
                    detached.set array ; return detached


            needsUpdate         :
                get : -> Atomics.load p32, @ptri + HINDEX_NEEDSUPDATE
                set : (v) -> Atomics.store p32, @ptri + HINDEX_NEEDSUPDATE, v

            slice               :
                #copy to new
                value   : ( begin = 0, end = @length ) ->
                    new @constructor(
                        this,
                        @BYTES_PER_ELEMENT * begin,
                        end - begin
                    )

            [ Symbol.iterator ] :
                value   : ->
                    ptri = resolvs.get this

                    length = -1 + Atomics.load p32, ptri + HINDEX_LENGTH

                    if  isBridge
                        Atomics.wait p32, 4
                        return next : -> done: on


                    index = 0
                    iterate = 0
                    total = 0

                    next : ->

                        if !iterate
                            iterate = ITERATION_PER_THREAD
                            index = Atomics.add p32, ptri + HINDEX_ITERINDEX, iterate
                            total += iterate

                        if  index > length
                            Atomics.wait p32, 3, 0, 20
                            Atomics.notify p32, 4, 1
                            return done: yes

                        iterate--
                        value : index++ # + begin    

            loadUint8           :
                    value       : ( index ) ->
                        Atomics.load ui8, index + @byteOffset

            getUint8            :
                    value       : ( index ) ->
                        ui8[ index + @byteOffset ]
            
            loadInt8            :
                    value       : ( index ) ->
                        Atomics.load si8, index + @byteOffset

            getInt8             :
                    value       : ( index ) ->
                        si8[ index + @byteOffset ]
                        
            loadUint8Clamped    :
                    value       : ( index ) ->
                        Atomics.load cu8, index + @byteOffset

            getUint8Clamped     :
                    value       : ( index ) ->
                        cu8[ index + @byteOffset ]
            
            loadUint16          :
                    value       : ( index ) ->
                        Atomics.load u16, index + @byteOffset / 2

            getUint16           :
                    value       : ( index ) ->
                        u16[ index + @byteOffset / 2 ]

            loadInt16           :
                    value       : ( index ) ->
                        Atomics.load i16, index + @byteOffset / 2
            
            getInt16            :
                    value       : ( index ) ->
                        i16[ index + @byteOffset / 2 ]
                        
            loadUint32          :
                    value       : ( index ) ->
                        Atomics.load u32, index + @byteOffset / 4

            getUint32           :
                    value       : ( index ) ->
                        u32[ index + @byteOffset / 4 ]

            loadInt32           :
                    value       : ( index ) ->
                        Atomics.load i32, index + @byteOffset / 4

            loadFloat32         :
                    value       : ( index ) ->
                        new self.Float32Array( self.Uint32Array.of(
                            Atomics.load u32, index + @byteOffset / 4
                        ).buffer ).at(0)
            
            getInt32            :
                    value       : ( index ) ->
                        i32[ index + @byteOffset / 4 ]
            
            getFloat32          :
                    value       : ( index ) ->
                        f32[ index + @byteOffset / 4 ]
            
            getFloat64          :
                    value       : ( index ) ->
                        f64[ index + @byteOffset / 8 ]

            storeUint8          :
                    value       : ( index, value ) ->
                        Atomics.store ui8, index + @byteOffset, value

            setUint8             :
                    value       : ( index, value ) ->
                        ui8[ index + @byteOffset ] = value

            storeInt8           :
                    value       : ( index, value ) ->
                        Atomics.store si8, index + @byteOffset, value
            
            setInt8             :
                    value       : ( index, value ) ->
                        si8[ index + @byteOffset ] = value

            storeUint8Clamped   :
                    value       : ( index, value ) ->
                        Atomics.store cu8, index + @byteOffset, value

            setUint8Clamped     :
                    value       : ( index, value ) ->
                        cu8[ index + @byteOffset ] = value
            
            storeUint16         :
                    value       : ( index, value ) ->
                        Atomics.store u16, index + @byteOffset / 2, value

            setUint16           :
                    value       : ( index, value ) ->
                        u16[ index + @byteOffset / 2 ] = value
            
            storeInt16          :
                    value       : ( index, value ) ->
                        Atomics.store i16, index + @byteOffset / 2, value

            setInt16            :
                    value       : ( index, value ) ->
                        i16[ index + @byteOffset / 2 ] = value
            
            storeUint32         :
                    value       : ( index, value ) ->
                        Atomics.store u32, index + @byteOffset / 4, value

            setUint32           :
                    value       : ( index, value ) ->
                        u32[ index + @byteOffset / 4 ] = value

            storeInt32          :
                    value       : ( index, value ) ->
                        Atomics.store i32, index + @byteOffset / 4, value

            storeFloat32        :
                    value       : ( index, value ) ->
                        value = new self.Uint32Array(self.Float32Array.of(value).buffer)[0]
                        Atomics.store u32, index + @byteOffset / 4, value
                        
            setInt32            :
                    value       : ( index, value ) ->
                        i32[ index + @byteOffset / 4 ] = value

            setFloat32          :
                    value       : ( index, value ) ->
                        f32[ index + @byteOffset / 4 ] = value

            addUint8            :
                    value       : ( index, value ) ->
                        Atomics.add ui8, index + @byteOffset, value
            
            addInt8             :
                    value       : ( index, value ) ->
                        Atomics.add si8, index + @byteOffset, value
            
            addUint8Clamped     :
                    value       : ( index, value ) ->
                        Atomics.add cu8, index + @byteOffset, value
            
            addUint16           :
                    value       : ( index, value ) ->
                        Atomics.add u16, index + @byteOffset / 2, value
            
            addInt16            :
                    value       : ( index, value ) ->
                        Atomics.add i16, index + @byteOffset / 2, value
            
            addUint32           :
                    value       : ( index, value ) ->
                        Atomics.add u32, index + @byteOffset / 4, value

            addInt32            :
                    value       : ( index, value ) ->
                        Atomics.add i32, index + @byteOffset / 4, value
            
        class Uint8Array        extends self.Uint8Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 1

                if  isThread 
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                ui8.set arg0, byteOffset                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            ui8.set arg0, byteOffset                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                ui8.set arg0, byteOffset
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri                

        class Int8Array         extends self.Int8Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 1

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                si8.set arg0, byteOffset                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            si8.set arg0, byteOffset                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                si8.set arg0, byteOffset
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class Uint8ClampedArray extends self.Uint8ClampedArray

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 1

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else                                
                                cu8.set arg0, byteOffset                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            cu8.set arg0, byteOffset                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                cu8.set arg0, byteOffset
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class Uint16Array       extends self.Uint16Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->
                
                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 2

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                u16.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            u16.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                u16.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class Int16Array        extends self.Int16Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 2

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                i16.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            i16.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                i16.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class Uint32Array       extends self.Uint32Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 4

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                u32.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            u32.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                u32.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class Int32Array        extends self.Int32Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = resolvCall()
                argc = arguments.length                
                bpel = 4

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                i32.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            i32.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                i32.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class Float32Array      extends self.Float32Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->
                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 4

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteOffset  = malloc arg0.byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + arg0.byteLength
                                )
                            else
                                f32.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            f32.set arg0, byteOffset / bpel                           
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                f32.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        configurable: yes,
                        value : ptri
                    }
                ), ptri

        class Float64Array      extends self.Float64Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 8

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                f64.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            f64.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                f64.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class BigInt64Array     extends self.BigInt64Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 8

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                i64.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            i64.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                i64.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class BigUint64Array    extends self.BigUint64Array

            set : ( value, index = 0 ) ->
                if  value.buffer is this.buffer
                    target = this.byteOffset + index * @BYTES_PER_ELEMENT
                    start = value.byteOffset ; end = start + value.byteLength
                    ui8.copyWithin target, start, end
                else
                    super value, index
                this

            constructor         : ( arg0, byteOffset, length, ptri ) ->

                ptri = ptri or resolvCall()
                argc = arguments.length                
                bpel = 8

                if  isThread
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    super objbuf, byteOffset, length
            
                else if isBridge

                    if      argc is 1
                        # new TypedArray( 24 );
                        # new TypedArray( buffer );
                        # new TypedArray( [ 2, 4, 1 ] );

                        if Number.isInteger arg0
                            # new TypedArray( 24 );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel

                        else if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArray(?) );

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            byteLength  = arg0.byteLength
                            length      = arg0.byteLength / bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            if  arg0.buffer is objbuf
                                ui8.copyWithin( byteOffset,
                                    arg0.byteOffset, 
                                    arg0.byteOffset + byteLength
                                )
                            else
                                u64.set arg0, byteOffset / bpel                            

                        else if Array.isArray
                            # new TypedArray( [ 2, 4, 1 ] )

                            #Atomics.wait p32, 4, 0, 2240; #testing locks
                            length      = arg0.length
                            byteLength  = length * bpel
                            byteOffset  = malloc byteLength, bpel
                            
                            u64.set arg0, byteOffset / bpel                            
                            
                    else if argc is 3
                        # new TypedArray( buffer, 1221, 4 );
                        # new TypedArray( new TypedArra( 2 ), 36, 2 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36, 2 );

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + length * bpel

                            byteLength      = length * bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin(
                                    byteOffset, copyStart, copyEnd
                                )

                            else
                                ui8.set new self.Uint8Array(
                                    arg0.buffer, copyStart, length 
                                ), byteOffset

                        else if arg0.byteLength
                            # new TypedArray( buffer, 36, 2 );

                            arg0Offset  = byteOffset
                            byteLength  = length * bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel

                                ui8.set new self.Uint8Array(
                                    arg0, arg0Offset, byteLength
                                ), byteOffset

                    else if argc is 2
                        # new TypedArray( buffer, 36 );
                        # new TypedArray( new TypedArra( 2 ), 36 );

                        if ArrayBuffer.isView arg0
                            # new TypedArray( new TypedArra( 2 ), 36 );

                            arg0Length      = arg0.length
                            arg0ByteLength  = arg0.BYTES_PER_ELEMENT * arg0Length

                            copyStart       = arg0.byteOffset + byteOffset
                            copyEnd         = copyStart + arg0ByteLength

                            nextByteLength  = arg0ByteLength - byteOffset

                            byteLength      = nextByteLength
                            length          = byteLength / bpel
                            byteOffset      = malloc byteLength, bpel

                            if  arg0.buffer is objbuf
                                ui8.copyWithin byteOffset, copyStart, copyEnd

                            else
                                u64.set arg0, byteOffset / bpel
    
                        else if arg0.byteLength
                            # new TypedArray( buffer, 36 );

                            arg0Offset  = byteOffset
                            byteLength  = arg0.byteLength - byteOffset
                            length      = byteLength / bpel

                            if  arg0 isnt objbuf
                                byteOffset = malloc byteLength, bpel
                            
                            if  arg0 isnt objbuf
                                ui8.set new self.Uint8Array( arg0, arg0Offset ), byteOffset

                    super objbuf, byteOffset, length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set Object.defineProperty(
                    this, "ptri", {
                        value : ptri
                    }
                ), ptri

        class OffscreenCanvas   extends self.OffscreenCanvas

            this.Proxy  = ( ptri ) ->

                get     : ( ctx, key, pxy ) -> switch key

                    when "clearColor", "clear"
                        -> lock ptri

                    else Reflect.get arguments...

            getContext  : ->
                ptri = resolvCall()
                
                if  isThread
                    context = new Proxy GLContext::,
                        OffscreenCanvas.Proxy( ptri )

                else
                    context = super arguments...
                    unlock ptri

                resolvs.set context, ptri
                return context

            render      : ( handler ) ->
                if  isBridge then do commit = =>
                    
                    handler.call this
                    postMessage render : @transferToImageBitmap()
                    requestAnimationFrame commit

                return this

            constructor : ->
                ptri = resolvCall()

                if  isThread
                    canvas = new Proxy OffscreenCanvas::,
                        OffscreenCanvas.Proxy( ptri )

                else
                    canvas = super arguments...
                    unlock ptri

                resolvs.set canvas, ptri
                return canvas

        class Matrix4f          extends Float32Array

        class UniformMatrix4fv  extends Matrix4f

            @byteLength         : 24 * 4

            INDEX_LEFT          : 16

            INDEX_TOP           : 17
            
            INDEX_RIGHT         : 18

            INDEX_BOTTOM        : 19
            

            INDEX_FOVY          : 21

            INDEX_NEAR          : 22
            
            INDEX_FAR           : 23


            INDEX_M11           :  0
            INDEX_M12           :  1
            INDEX_M13           :  2
            INDEX_M14           :  3
    
            INDEX_M21           :  4
            INDEX_M22           :  5
            INDEX_M23           :  6
            INDEX_M24           :  7
    
            INDEX_M31           :  8
            INDEX_M32           :  9
            INDEX_M33           : 10
            INDEX_M34           : 11
    
            INDEX_M41           : 12
            INDEX_M42           : 13
            INDEX_M43           : 14
            INDEX_M44           : 15            

            Object.defineProperties UniformMatrix4fv::,

                fovy :
                    get : -> @[ @INDEX_FOVY ]
                    set : (v) -> @[ @INDEX_FOVY ] = v
                
                near :
                    get : -> @[ @INDEX_NEAR ]
                    set : (v) -> @[ @INDEX_NEAR ] = v
                
                far :
                    get : -> @[ @INDEX_FAR ]
                    set : (v) -> @[ @INDEX_FAR ] = v

                left :
                    get : -> @[ @INDEX_LEFT ]
                    set : (v) -> @[ @INDEX_LEFT ] = v
        
                top :
                    get : -> @[ @INDEX_TOP ]
                    set : (v) -> @[ @INDEX_TOP ] = v
        
                right :
                    get : -> @[ @INDEX_RIGHT ]
                    set : (v) -> @[ @INDEX_RIGHT ] = v
        
                bottom :
                    get : -> @[ @INDEX_BOTTOM ]
                    set : (v) -> @[ @INDEX_BOTTOM ] = v
        
                xTranslation :
                    get : -> @[ @INDEX_M41 ]
                    set : (v) -> @[ @INDEX_M41 ] = v

                yTranslation :
                    get : -> @[ @INDEX_M42 ]
                    set : (v) -> @[ @INDEX_M42 ] = v

                zTranslation :
                    get : -> @[ @INDEX_M43 ]
                    set : (v) -> @[ @INDEX_M43 ] = v

                matrix : get : -> new self.Float32Array @subarray(0, 16)
                width : get : -> @right - @left
                height : get : -> @bottom - @top
                aspect : get : -> @width / @height
                location : get : -> @uniform.location
                currentValue : get : -> @gl.getUniform @program, @location

                m11 : get : -> @[ @INDEX_M11 ]
                m21 : get : -> @[ @INDEX_M21 ]
                m31 : get : -> @[ @INDEX_M31 ]
                m41 : get : -> @[ @INDEX_M41 ]
        
                m12 : get : -> @[ @INDEX_M12 ]
                m22 : get : -> @[ @INDEX_M22 ]
                m32 : get : -> @[ @INDEX_M32 ]
                m42 : get : -> @[ @INDEX_M42 ]
        
                m13 : get : -> @[ @INDEX_M13 ]
                m23 : get : -> @[ @INDEX_M23 ]
                m33 : get : -> @[ @INDEX_M33 ]
                m43 : get : -> @[ @INDEX_M43 ]
        
                m14 : get : -> @[ @INDEX_M14 ]
                m24 : get : -> @[ @INDEX_M24 ]
                m34 : get : -> @[ @INDEX_M34 ]
                m44 : get : -> @[ @INDEX_M44 ]
        
            @fromUniform : ( gl, program, uniform ) ->
                mat4 = new this @byteLength / 4
                
                Object.defineProperties mat4,
                    gl       : value : gl
                    program  : value : program
                    uniform  : value : uniform
                    name     : value : uniform.name

                mat4.set gl.getUniform program, uniform.location
                mat4

            translateSelf : ( tx = 0, ty = 0, tz = 0 ) ->
                @multiplySelf(
                    1,   0,  0,  0,
                    0,   1,  0,  0,
                    0,   0,  1,  0,
                    tx, ty, tz,  1
                )
                
            rotateSelf : ( rx = 0, ry = 0, rz = 0 ) ->
                if  rx
                    c = Math.cos rx
                    s = Math.sin rx

                    @multiplySelf(
                         1,  0,  0,  0,
                         0,  c, -s,  0,
                         0,  s,  c,  0,
                         0,  0,  0,  1,
                    ) 

                if  ry
                    c = Math.cos ry
                    s = Math.sin ry

                    @multiplySelf(
                         c,  0,  s,  0,
                         0,  1,  0,  0,
                        -s,  0,  c,  0,
                         0,  0,  0,  1,
                    ) 
                
                if  rz
                    c = Math.cos rz
                    s = Math.sin rz

                    @multiplySelf(
                         c, -s,  0,  0,
                         s,  c,  0,  0,
                         0,  0,  1,  0,
                         0,  0,  0,  1,
                    ) 

                this
                
            scaleSelf : ( sx, sy, sz ) ->
                sz ?= ( sy ?= ( sx ?= 1 ) )

                @multiplySelf(
                    sx, 0,  0,  0,
                    0, sy,  0,  0,
                    0,  0, sz,  0,
                    0,  0,  0,  1,
                )
                
            multiplySelf : ( n11, n21, n31, n41,  n12, n22, n32, n42,  n13, n23, n33, n43,  n14, n24, n34, n44 ) ->
                
                [   m11, m21, m31, m41,  
                    m12, m22, m32, m42,  
                    m13, m23, m33, m43,  
                    m14, m24, m34, m44  ] = Object.values this
                

                #? Cij = mi1 * n1j  +  mi2 * n2j  +  mi3 * n3j  +  mi4 * n4j 
                @set self.Float32Array.of(
                    m11 * n11  +  m12 * n21  +  m13 * n31  +  m14 * n41,
                    m21 * n11  +  m22 * n21  +  m23 * n31  +  m24 * n41,
                    m31 * n11  +  m32 * n21  +  m33 * n31  +  m34 * n41,
                    m41 * n11  +  m42 * n21  +  m43 * n31  +  m44 * n41,
                    m11 * n12  +  m12 * n22  +  m13 * n32  +  m14 * n42,
                    m21 * n12  +  m22 * n22  +  m23 * n32  +  m24 * n42,
                    m31 * n12  +  m32 * n22  +  m33 * n32  +  m34 * n42,
                    m41 * n12  +  m42 * n22  +  m43 * n32  +  m44 * n42,
                    m11 * n13  +  m12 * n23  +  m13 * n33  +  m14 * n43,
                    m21 * n13  +  m22 * n23  +  m23 * n33  +  m24 * n43,
                    m31 * n13  +  m32 * n23  +  m33 * n33  +  m34 * n43,
                    m41 * n13  +  m42 * n23  +  m43 * n33  +  m44 * n43,
                    m11 * n14  +  m12 * n24  +  m13 * n34  +  m14 * n44,
                    m21 * n14  +  m22 * n24  +  m23 * n34  +  m24 * n44,
                    m31 * n14  +  m32 * n24  +  m33 * n34  +  m34 * n44,
                    m41 * n14  +  m42 * n24  +  m43 * n34  +  m44 * n44,
                )
                

            set : ( set ) ->
                @gl.uniformMatrix4fv @uniform.location, false, set
                super set ; this
                

            perspective : ( zNear, zFar, right, bottom, left = 0, top = 0, yFov = 60 ) ->

                [ @near, @far, @right, @bottom, @left, @top, @fovy ] =
                    [ zNear, zFar, right, bottom, left, top, yFov ]

                f = Math.tan Math.PI/2 - yFov/2
                rangeInv = 1.0 / ( zNear - zFar )

                @set self.Float32Array.of(
                    f / @aspect,   0,                             0,    0,
                    0,             f,                             0,    0,
                    0,             0,     (zNear + zFar) * rangeInv,   -1,
                    0,             0, (zNear * zFar) * rangeInv * 2,    0
                )

                @gl.viewport @left, @top, @width, @height

                @translateSelf 0, 0, -500
                @rotateSelf Math.PI, 0, 0
                @scaleSelf 1, 1, 1
                
                this

            orthographic : ( zNear, zFar, right, bottom, left = 0, top = 0 ) ->

                [ @near, @far, @right, @bottom, @left, @top ] =
                    [ zNear, zFar, right, bottom, left, top ]
        
                widthRatio  = 1 / ( @right - @left )
                heightRatio = 1 / (   @top - @bottom )
                depthRatio  = 1 / (   @far - @near )

                sx =  2 *  widthRatio
                sy =  2 * heightRatio
                sz = -2 *  depthRatio
        
                tz = - (   @near + @far  ) *  depthRatio
                tx = - (  @right + @left ) *  widthRatio
                ty = - ( @bottom + @top  ) * heightRatio
        
                @set [
                    sx,      0,       0,     tx,
                    0,      sy,       0,     ty,
                    0,       0,      sz,     tz,
                    0,       0,       0,      1
                ]

                this

        class WebGLShader       extends Uint8Array

            @byteLength         : 4 * 4

            INDEX_ISACTIVE      : 0     #  8 bit        byteOffset : 0

            INDEX_TYPE          : 1     # 16 bit 1nd    byteOffset : 2
            
            INDEX_LENGTH        : 1     # 32 bit 1st    byteOffset : 4
            
            OFFSET_SOURCE_BEGIN : 4 * 4

            COMPILE_STATUS      : WebGL2RenderingContext?.COMPILE_STATUS or 35713

            FRAGMENT_SHADER     : WebGL2RenderingContext?.FRAGMENT_SHADER or 35632

            VERTEX_SHADER       : WebGL2RenderingContext?.VERTEX_SHADER or 35633

            DEFAULT_SOURCE      : ''

            Object.defineProperties WebGLShader::,

                isActive        :
                        get     : -> @loadUint8 @INDEX_ISACTIVE
                        set     : -> @storeUint8 @INDEX_ISACTIVE, arguments[0]

                type            :
                        get     : -> @loadUint16 @INDEX_TYPE
                        set     : -> @storeUint16 @INDEX_TYPE, arguments[0]


                length          :
                        get     : -> @loadUint32 @INDEX_LENGTH
                        set     : -> @storeUint32 @INDEX_LENGTH, arguments[0]

                source          :
                        get     : ->
                            return "" unless @length
                            textDecoder.decode @detach @OFFSET_SOURCE_BEGIN, @length

                        set     : ( source ) ->
                            @length = text.length if text = "#{source}".trim()
                            
                            @type = unless text.match /gl_FragColor/
                                @VERTEX_SHADER
                            else @FRAGMENT_SHADER

                            @set textEncoder.encode( text ), @OFFSET_SOURCE_BEGIN


            constructor : ( source ) ->
                if  arguments.length > 1
                    super arguments...

                else
                    srclen = source.length
                    srclen = srclen + srclen % 4
                    super WebGLShader.byteLength + srclen
                        .source = source

            compile             : ( gl ) ->
                shader = gl.createShader @type

                gl.shaderSource shader, @source
                gl.compileShader shader

                unless gl.getShaderParameter shader, @COMPILE_STATUS
                    info = gl.getShaderInfoLog shader
                    gl.deleteShader shader
                    throw "Could not compile shader: #{info}"

                shader

            attach              : ( gl, program ) ->
                gl.attachShader program, @compile gl ; this

        class VertexShader      extends WebGLShader
            
            @DEFAULT_SOURCE     : ``` `
                attribute vec3     a_Position;
                attribute vec4     a_Color;
                uniform   float    u_PointSize;
                uniform   mat4     u_ViewMatrix;
                varying   vec4     v_Color;

                void main() {
                    gl_Position  =  u_ViewMatrix * vec4(a_Position, 1.0);
                    gl_PointSize =  u_PointSize;
                    v_Color      =  a_Color;
                }
            ` ```

        class FragmentShader    extends WebGLShader
            
            @DEFAULT_SOURCE     : ``` `
                precision highp    float;
                varying   vec4     v_Color;

                void main() {
                    gl_FragColor = v_Color;
                }
            ` ```

        class OnscreenCanvas    extends Float32Array
    
            @byteLength         : 16 * 4    + 4096 * 4096    

            INDEX_HASCONTEXT    : 0         # Uint8

            INDEX_HASBINDING    : 1         # Uint8

            INDEX_ISRENDERING   : 2         # Uint8
            
            INDEX_FRAME         : 3         # Uint32

            INDEX_TIMESTAMP     : 4         # Uint32
            
            INDEX_DELTA         : 5         # Uint32
            
            INDEX_FPS           : 6         # Uint32

            INDEX_VSHADER       : 7         # Uint32
            
            INDEX_FSHADER       : 8         # Uint32

            INDEX_DRAWLENGTH    : 9

            INDEX_DRAWBYTELENGTH: 10

            INDEX_POINTCOUNT    : 11

            INDEX_ATTRIB_LENGTH : 12
            
            OFFSET_READBUFFER   : 16 * 4
            
            OFFSET_DRAWBUFFER   : 1024 * 4

            ELEMENTS_PER_POINT  : 3

            Object.defineProperties OnscreenCanvas::,

                isRendering :
                    get : -> @loadUint8 @INDEX_ISRENDERING
                    set : (v) -> @storeUint8 @INDEX_ISRENDERING, v

                hasContext :
                    get : -> @loadUint8 @INDEX_HASCONTEXT
                    set : (v) -> @storeUint8 @INDEX_HASCONTEXT, v

                hasBinding :
                    get : -> @loadUint8 @INDEX_HASBINDING
                    set : (v) -> @storeUint8 @INDEX_HASBINDING, v

                frame :
                    get : -> @loadUint32 @INDEX_FRAME
                    set : (v) -> @storeUint32 @INDEX_FRAME, v

                timeStamp :
                    get : -> @getFloat32 @INDEX_TIMESTAMP
                    set : (v) -> @setFloat32 @INDEX_TIMESTAMP, v

                delta :
                    get : -> @getFloat32 @INDEX_DELTA
                    set : (v) -> @setFloat32 @INDEX_DELTA, v

                fps :
                    get : -> @getUint8 @INDEX_FPS
                    set : (v) -> @setUint8 @INDEX_FPS, v

                vertexShader :
                    get : ->
                        v = VertexShader.at @loadUint32 @INDEX_VSHADER
                        log v, @loadUint32 @INDEX_VSHADER
                        v

                    set : (v) -> @storeUint32 @INDEX_VSHADER, v.ptri

                fragmentShader :
                    get : -> FragmentShader.at @loadUint32 @INDEX_FSHADER
                    set : (v) -> @storeUint32 @INDEX_FSHADER, v.ptri

                drawBuffer :
                    get : -> new self.Float32Array @buffer, @byteOffset + @OFFSET_DRAWBUFFER, @pointCount * @attribLength

                readBuffer :
                    get : -> new self.Float32Array @buffer, @byteOffset + @OFFSET_READBUFFER, @pointCount * 3

                drawLength :
                    get : -> @loadUint32 @INDEX_DRAWLENGTH
                    set : (v) -> @storeUint32 @INDEX_DRAWLENGTH, v

                pointCount :
                    get : -> @loadUint32 @INDEX_POINTCOUNT
                    set : (v) -> @storeUint32 @INDEX_POINTCOUNT, v

                attribLength :
                    get : -> @loadUint32 @INDEX_ATTRIB_LENGTH
                    set : (v) -> @storeUint32 @INDEX_ATTRIB_LENGTH, v

                width :
                    get : -> @gl.drawingBufferWidth

                height :
                    get : -> @gl.drawingBufferHeight

                activeAttributes :
                    get : ->
                        i = @gl.getProgramParameter @program, @gl.ACTIVE_ATTRIBUTES
                        v = Object.values WebGL2RenderingContext
                        k = Object.keys WebGL2RenderingContext
                        while i--
                            attrib = @gl.getActiveAttrib @program, i
                            attrib.isEnabled = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_ENABLED
                            attrib.glBuffer = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
                            attrib.location = @gl.getAttribLocation @program, attrib.name
                            attrib.vertexSize = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_SIZE
                            attrib.vertexType = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_TYPE
                            attrib.vertexKind = k.at v.indexOf attrib.vertexType 
                            attrib.isNormalized = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
                            attrib.stride = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_STRIDE
                            attrib.currentValue = @gl.getVertexAttrib i, @gl.CURRENT_VERTEX_ATTRIB
                            attrib.integer = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_INTEGER
                            attrib.divisor = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_DIVISOR
                            #ext: ANGLE_instanced_arrays
                            #   + attrib.divisorAngle = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE
                            attrib.kind = k.at v.indexOf attrib.type
                            attrib 

                activeUniforms :
                    get : ->
                        i = @gl.getProgramParameter @program, @gl.ACTIVE_UNIFORMS
                        v = Object.values WebGL2RenderingContext
                        k = Object.keys WebGL2RenderingContext
                        while i--
                            uniform = @gl.getActiveUniform @program, i
                            uniform.kind = k.at v.indexOf uniform.type
                            uniform.location = @gl.getUniformLocation @program, uniform.name
                            uniform.uniform = @gl.getUniform @program, uniform.location
                            uniform
                    
            addFrame            : ( timeStamp ) ->
                @delta = ( timeStamp - @timeStamp ) * 1e-3
                @timeStamp = timeStamp
                @frame += 1 
                @fps = 1 / @delta
                @delta

            lostContext         : ->                
                this.gl
                    .getExtension "WEBGL_lose_context"
                    .loseContext()

            malloc              : ( shape ) ->
                start = @addUint32 @INDEX_POINTCOUNT, shape.pointCount
                
                Atomics.store p32, shape.ptri + HINDEX_PARENT, @ptri
                Atomics.store p32, shape.ptri + HINDEX_ATTRIBSOFFSET, start * 3 * 4
                Atomics.store p32, shape.ptri + HINDEX_ATTRIBSLENGTH, shape.pointCount * @attribLength

                @drawBuffer.sub start * 3 * 4, shape.pointCount * @attribLength

            defineAttributes : ->
                a_Position = @activeAttributes.find (a) => a.name is "a_Position"
                a_Color = @activeAttributes.find (a) => a.name is "a_Color"
                
                for a in @activeAttributes then switch a.type
                    when 35664, "FLOAT_VEC2" then @attribLength += 2
                    when 35665, "FLOAT_VEC3" then @attribLength += 3
                    when 35666, "FLOAT_VEC4" then @attribLength += 4

            defineUniforms : ->
                for u in @activeUniforms then switch u.type
                    when 35676, "FLOAT_MAT4" then ( ( program, uniform ) ->
                        Object.defineProperty( this, uniform.name,
                            get : UniformMatrix4fv.fromUniform.bind UniformMatrix4fv, this, program, uniform
                            set : @uniformMatrix4fv.bind this, uniform.location, false
                        )
                    ).call( @gl, @program, u )
                    
                    when 5126, "FLOAT" then ( ( program, uniform ) ->
                        Object.defineProperty( this, uniform.name,
                            get : @getUniform.bind this, program, uniform.location
                            set : @uniform1f.bind this, uniform.location
                        )
                    ).call( @gl, @program, u )

            upload      : ->
                a_Position = @activeAttributes.find (a) => a.name is "a_Position"
                a_Color = @activeAttributes.find (a) => a.name is "a_Color"

                @gl.bufferData @gl.ARRAY_BUFFER, @drawBuffer, @gl.STATIC_DRAW
                
                @gl.enableVertexAttribArray     a_Position.location
                @gl.enableVertexAttribArray     a_Color.location

                @gl.vertexAttribPointer         a_Position.location, 3, @gl.FLOAT, no, 28, 0
                @gl.vertexAttribPointer         a_Color.location, 4, @gl.FLOAT, no, 28, 12
                
                for u in @activeUniforms
                    @gl[u.name].upload?()

            reload      : ->
                program = @gl.createProgram()
                
                @vertexShader = new VertexShader VertexShader.DEFAULT_SOURCE
                @fragmentShader = new FragmentShader FragmentShader.DEFAULT_SOURCE
                                
                @vertexShader   . attach @gl, program
                @fragmentShader . attach @gl, program                

                @gl.linkProgram program
                @gl.useProgram program

                @gl.enable                      @gl.BLEND
                @gl.blendFunc                   @gl.SRC_COLOR, @gl.DST_COLOR
                @gl.blendEquation               @gl.FUNC_ADD
                
                @gl.enable                      @gl.DEPTH_TEST
                @gl.depthFunc                   @gl.LEQUAL        
                @gl.depthMask                   no
                @gl.clearDepth                  1
        
                @gl.enable                      @gl.CULL_FACE
                @gl.cullFace                    @gl.BACK
                @gl.frontFace                   @gl.CCW                

                unless @gl.getProgramParameter program, @gl.LINK_STATUS
                    info = @gl.getProgramInfoLog program
                    throw "Could not compile WebGL program. \n#{info}"

                @program = program

                unless @hasBinding
                    @glBuffer or= @gl.createBuffer()
                    @hasBinding = @gl.bindBuffer( @gl.ARRAY_BUFFER, @glBuffer ) or 1 

                @defineUniforms()
                @defineAttributes()

                this
                
            setContext  : ( context ) ->

                Object.defineProperties this,

                    gl      : value : context

                    canvas  : value : context.canvas

                @canvas.addEventListener "webglcontextlost", =>
                    @hasContext = 0
                    @oncontextlost()
                    @onwebglcontextlost()
                    
                @canvas.addEventListener "webglcontextrestored", =>
                    @hasContext = 1
                    @reload()
                    @oncontextrestored @gl
                    @onwebglcontextrestored @gl
                    @render() 

                @canvas.dispatchEvent new CustomEvent "webglcontextrestored"

                this

            oncontextlost           : ->
            oncontextrestored       : ->
            onwebglcontextlost      : ->
            onwebglcontextrestored  : ->
            onanimationframe        : ->
            onupdate                : ->

            render      : ->
                return unless @hasContext
                return unless isBridge

                bc.postMessage CONTEXT_READY

                do commit = ( now = 0 ) =>
                    if  @hasContext and @hasBinding

                        ptri = Atomics.load p32, 1
                        while ptri > HEADERS_LENGTH
                            unlock() if Atomics.load p32, ptri + HINDEX_NEEDSUPDATE, 0
                            ptri -= HEADERS_LENGTH

                        @onanimationframe @gl, @addFrame now 
                        
                        @gl.drawArrays @gl.POINTS, 0, @pointCount
                        @gl.drawArrays @gl.LINES, 0, @pointCount
                        @gl.drawArrays @gl.TRIANGLES, 0, @pointCount

                    requestAnimationFrame commit

            constructor : ->
                super( OnscreenCanvas.byteLength )
                    .getContext "webgl2"

            getContext : ( type ) ->                
                return unless isBridge

                replies[ @ptri ] = new WeakRef ( data ) =>                   
                    @setContext data.canvas.getContext type, {
                        powerPreference: "high-performance",
                    }

                postMessage onscreen : { @ptri }


        class Object3           extends Float32Array
        
            @byteLength         : 104

            OFFSET_UUID         : 0

            OFFSET_POSITION     : 36

            OFFSET_ROTATION     : 52

            OFFSET_SCALE        : 68

            OFFSET_COLOR        : 84

            OFFSET_DRAWBUFFER   : 100
            
            INDEX_DRAWBUFFER    : 100 / 4

            OFFSET_POINTS       : @byteLength

            constructor : ( options = { points : [] } ) ->
                ptri = resolvCall()

                byteLength = (
                    Object3.byteLength + 
                    options.points.length * 4
                )
                
                super byteLength

                if  isBridge
                    @uuid = randomUUID()
                
                resolvs.set Object.defineProperties( this,
                    ptri : value : ptri
                ), ptri

                Atomics.notify p32, ptri + HINDEX_LOCKFREE

            updateIfNeeded : ( gl ) ->
                log 1, "update if needed"

            Object.defineProperties Object3::,
                uuid :
                    get : -> textDecoder.decode @detach @OFFSET_UUID, 36, Uint8Array 
                    set : ( v ) -> @set textEncoder.encode( v ), @OFFSET_UUID
                    
                points :
                    get : -> new Float32Array @buffer, @byteOffset + @OFFSET_POINTS, @pointsLength
                    set : ( v ) -> @points.set v.subarray( 0, @pointsLength )
                    
                color :
                    get : -> new Float32Array @buffer, @byteOffset + @OFFSET_COLOR, 4
                    set : ( v ) -> @color.set v
                    
                position :
                    get : -> new Float32Array @buffer, @byteOffset + @OFFSET_POSITION, 3
                    set : ( v ) -> @position.set v
                    
                rotation :
                    get : -> new Float32Array @buffer, @byteOffset + @OFFSET_ROTATION, 3
                    set : ( v ) -> @rotation.set v
                
                scale :
                    get : -> new Float32Array @buffer, @byteOffset + @OFFSET_SCALE, 3
                    set : ( v ) -> @scale.set v
                    
                pointCount : 
                    get : -> @pointsLength / 3
                    
                pointsLength : 
                    get : -> ( @byteLength - @OFFSET_POINTS ) / 4

                drawBuffer : 
                    get : -> @getUint32 @INDEX_DRAWBUFFER
                    set : (v) -> @storeUint32 @INDEX_DRAWBUFFER, v

    if  isWindow

        sharedHandler   =
            register    : ( data ) ->
                warn "registering worker:", data
                Object.assign @info, data ; this
                unless workers.some (w) -> !w.info.uuid
                    log "says it's onready time...", EVENT_READY
                    bc.postMessage EVENT_READY
                
        bridgeHandler   =

            render      : ( data ) ->
                this[ data.ptri ]
                    .transferFromImageBitmap data.imageBitmap

            onscreen    : ( data ) ->                
                canvas = createCanvas( data ).transferControlToOffscreen()
                @postMessage onscreen : { canvas, ...data }, [ canvas ]

            offscreen   : ( data ) ->

        threadHandler   =
            hello       : ->
        
        bridgemessage   = ({ data }) ->
            for request, data of data
                handler =
                    bridgeHandler[ request ] or
                    sharedHandler[ request ] or throw [
                        /NO_HANDLER_FOR_BRIDGE/, request, data
                    ]

                handler.call this, data

        threadmessage   = ({ data }) ->
            for request, data of data
                handler =
                    threadHandler[ request ] or
                    sharedHandler[ request ] or throw [
                        /NO_HANDLER_FOR_THREAD/, request, data
                    ]

                handler.call this, data

        createCanvas    = ( data ) ->
            {   width = INNER_WIDTH,
                height = INNER_HEIGHT } = data

            canvas                  = document.createElement "canvas"
            canvas.ptri             = data . ptri
            canvas.width            = RATIO_PIXEL * width
            canvas.height           = RATIO_PIXEL * height
            canvas.style.width      = CSS.px width
            canvas.style.height     = CSS.px height
            canvas.style.inset      = CSS.px 0
            canvas.style.position   = "fixed"

            document.body.appendChild canvas

        createBuffers   = ->

            Buffer  = SharedArrayBuffer ? ArrayBuffer
            buffer  = !maxByteLength =
                BUFFER_TEST_START_LENGTH

            while  !buffer
                try buffer = new Buffer 0, { maxByteLength }
                catch then maxByteLength /= BUFFER_TEST_STEP_DIVIDER

            keybuf = new Buffer 4 * 48
            objbuf = new Buffer 4 * 2e7
            ptrbuf = new Buffer MAX_PTR_COUNT * BYTES_PER_ELEMENT

            Atomics.store new self.Int32Array(ptrbuf), 1, HEADERS_LENGTH

            initMemory { objbuf, ptrbuf, keybuf }

        createWorker    = ( name, onmessage ) ->
            worker = new Worker( blobURL, { name } )
            worker . info = {}
            worker . onerror = 
            worker . onmessageerror = console.error
            worker . onmessage = onmessage.bind worker
            workers[ workers . length ] =
                worker
        
        createThreads   = ->
            bridge = createWorker "bridge", bridgemessage
            bridge . postMessage setup : { blobURL, objbuf, ptrbuf, keybuf }
            
            for i in [ 0 ... MAX_THREAD_COUNT ]
                thread = createWorker "thread" + i, threadmessage
                thread . postMessage setup : { blobURL, objbuf, ptrbuf, keybuf }

        createBlobURL   = ->
            __user = "\nconst onready = function ( document ) {\n\t" +
                "#{[ ...document.scripts ].find( (d) => d.text and d.src ).text.trim()}\n" + 
            "};\n"

            __0ptr = "(" + "#{self.init}".split("return " + "0xdead;")[0]

            blobURL = URL.createObjectURL new Blob [
                __0ptr, __user, "}).call(self);"
            ], { type: "application/javascript" }

            delete self.init

        listenEvents    = ->
            window.onclick = ->
                console.table workers.map (w) -> w.info
                console.warn ""
                console.log objbuf
                console.log ptrbuf
                console.log p32
                bc.postMessage DUMP_WEAKMAP

            document.body.style.overscrollBehavior = "none"
            document.body.style.height = CSS.vh 100
            document.body.style.margin = 0

            prevent = (e) ->
                try e.preventDefault()
                objbuf = ptrbuf = null
                w.terminate() for w in workers
                ; 1

            window.onerror              = prevent
            window.onunload             = prevent
            window.onpagehide           = prevent
            window.onbeforeunload       = prevent
            window.onunhandledrejection = prevent

            window.r = new Proxy {} , {
                get : ->
                    window.onerror              = 
                    window.onunload             = 
                    window.onpagehide           = 
                    window.onbeforeunload       = 
                    window.onunhandledrejection = ->
        
                    objbuf = ptrbuf = null
                    w.terminate() for w in workers
                    location.reload(true)
            }

            ui.listen window

        queueMicrotask  ->
            createBuffers()
            createBlobURL()
            createThreads()
            listenEvents()




































































    if  isBridge

        addEventListener "message", (e) ->

            for req, data of e.data then switch req
                when "setup"
                    uuid = randomUUID()
                    blobURL = data.blobURL

                    initMemory data
                    regenerate()

                    postMessage register : {
                        selfName, isBridge, isThread, threadId,
                        now, pnow, uuid
                    }

                when "onscreen"
                    replies[data.ptri].deref()( data )























































    if  isThread


        addEventListener "message", (e) ->
            for req, data of e.data then switch req
                when "setup"
                    uuid = randomUUID()
                    blobURL = data.blobURL

                    initMemory data
                    regenerate()

                    postMessage register : {
                        selfName, isBridge, isThread, threadId,
                        now, pnow, uuid
                    }

            




    bc.onmessage = ( e ) -> {
        [ EVENT_READY ] : -> onready()
        [ CONTEXT_READY ] : -> oncontextready()
        [ DUMP_WEAKMAP ] : -> log resolvs
    }[ e.data ]()

            
























































    return 0xdead;
