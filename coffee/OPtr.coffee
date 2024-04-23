self.name = "window"

do  self.init   = ->

    log = -> console.log name, ...arguments
    warn = -> console.warn name, ...arguments
    error = -> console.error name, ...arguments
    number = -> arguments[0].split("").reduce (a,b) ->
        ( b.charCodeAt() + ( a.charCodeAt?() or a ) )

    [
        HEADERS_LENGTH_OFFSET       = 1
        HINDEX_BEGIN                = HEADERS_LENGTH_OFFSET++
        HINDEX_END                  = HEADERS_LENGTH_OFFSET++
        HINDEX_BYTEOFFSET           = HEADERS_LENGTH_OFFSET++
        HINDEX_LENGTH               = HEADERS_LENGTH_OFFSET++
        HINDEX_BYTELENGTH           = HEADERS_LENGTH_OFFSET++
        HINDEX_RESOLV_ID            = HEADERS_LENGTH_OFFSET++
        HINDEX_LOCKFREE             = HEADERS_LENGTH_OFFSET++
        HINDEX_WAITCOUNT            = HEADERS_LENGTH_OFFSET++
        HINDEX_ITERINDEX            = HEADERS_LENGTH_OFFSET++
        HINDEX_ITERLENGTH           = HEADERS_LENGTH_OFFSET++
    
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
        ITERATION_PER_THREAD        = 1000000
        UI_LENGTH                   = 4 * 48
        UI_OFFSET                   = null
        LE                          = new self.Uint8Array( self.Uint16Array.of(1).buffer ).at()
    
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
        #error { id, retry }

        while i > 0
            if  id is Atomics.load p32, i
                ptri = i - HINDEX_RESOLV_ID
                break
            i -= HEADERS_LENGTH

        if !ptri
            if  isBridge 
                ptri = Atomics.add p32, 1, HEADERS_LENGTH
                Atomics.store p32, ptri + HINDEX_RESOLV_ID, id
                return ptri

            Atomics.wait p32, 3, 0, 20

            if  retry > 400
                throw /TOO_MANY_TRIED_TO_FIND/
            return resolvFind id, ++retry

        else if isBridge then return ptri
        
        Atomics.wait p32, ptri + HINDEX_LOCKFREE

        return ptri

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
                Atomics.wait p32, ptri + HINDEX_LOCKFREE

            else
                Atomics.wait p32 , if isThread then 4 else 3
                
        unlock              = ( ptri ) ->
            if  ptri
                Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                Atomics.notify p32, ptri + HINDEX_LOCKFREE
            Atomics.notify p32 , if isThread then 4 else 3


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

        OFFSET_EVENT_COUNT  : 0 * 4

        OFFSET_VIEWPORT_X   : 1 * 4

        OFFSET_VIEWPORT_Y   : 2 * 4
        
        OFFSET_WIDTH        : 3 * 4

        OFFSET_HEIGHT       : 4 * 4
        
        OFFSET_ASPECT       : 5 * 4

        OFFSET_FOVY         : 6 * 4

        OFFSET_NEAR         : 7 * 4
        
        OFFSET_FAR          : 8 * 4

        OFFSET_CLIENT_X     : 9 * 4

        OFFSET_CLIENT_Y     : 10 * 4

        OFFSET_MATRIX       : 11 * 4

        listen : ( window ) ->
            window.addEventListener "pointermove", (e) =>
                @setFloat32 @OFFSET_CLIENT_X, e.clientX, LE 
                @setFloat32 @OFFSET_CLIENT_Y, e.clientY, LE 
                @setUint32 @OFFSET_EVENT_COUNT, ++@lastEventCount, LE

        viewport : ( x, y, width, height ) ->
            @setFloat32 @OFFSET_VIEWPORT_X, x, LE 
            @setFloat32 @OFFSET_VIEWPORT_Y, y, LE 
            @setFloat32 @OFFSET_WIDTH, width, LE 
            @setFloat32 @OFFSET_HEIGHT, height, LE 
            @setFloat32 @OFFSET_ASPECT, width/height, LE 

            this

        frustrum : ( near = @near, far = @far, right, bottom, top = @viewportY, left = @viewportX ) ->
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

            viewportX : get : -> @getFloat32 @OFFSET_VIEWPORT_X, LE

            viewportY : get : -> @getFloat32 @OFFSET_VIEWPORT_Y, LE

            width : get : -> @getFloat32 @OFFSET_WIDTH, LE
            
            height : get : -> @getFloat32 @OFFSET_HEIGHT, LE
            
            aspect : get : -> @getFloat32 @OFFSET_ASPECT, LE

            fovy : get : -> @getFloat32 @OFFSET_FOVY, LE
            
            near : get : -> @getFloat32 @OFFSET_NEAR, LE
            
            far : get : -> @getFloat32 @OFFSET_FAR, LE

            matrix : get : -> new Float32Array @buffer, @OFFSET_MATRIX, 16

            eventCount : get : -> @getUint32 @OFFSET_EVENT_COUNT, LE

            hasEvent : get : -> 
                unless @eventCount is @lastEventCount
                    return @lastEventCount = @eventCount
                no

    regenerate  = ->

        Object.defineProperties TypedArray,

            from                :
                value  : ->
                    array = new this arguments[0].length

                    if  isBridge
                        for i of array
                            array[i] = arguments[0][i]
                        Atomics.notify p32, 3, 1, MAX_THREAD_COUNT

                    else
                        Atomics.wait p32, 3

                    array

            of                  :
                value : ->
                    array = new this arguments.length

                    if  isBridge
                        for i of array
                            array[i] = arguments[i]
                        
                        Atomics.notify p32, 3, 1, MAX_THREAD_COUNT

                    else
                        Atomics.wait p32, 3

                    array

            at                  :
                value : ( ptri ) ->
                    return null unless ptri
                    new this -parseInt ptri

        Object.defineProperties TypedArray::,
            
            indexUint8          :
                    value       : -> arguments[0] + ( p32[ resolvs.get this ] + HINDEX_BYTEOFFSET ) / 1

            indexUint16         :
                    value       : -> arguments[0] + ( p32[ resolvs.get this ] + HINDEX_BYTEOFFSET ) / 2

            indexUint32         :
                    value       : -> arguments[0] + ( p32[ resolvs.get this ] + HINDEX_BYTEOFFSET ) / 4
            
            subarray            :
                #part of this
                value   : ( begin = 0, end = @length ) ->
                    new @constructor(
                        @buffer, 
                        @byteOffset + @BYTES_PER_ELEMENT * begin,
                        end - begin
                    )
                
            #part of this
            sub                 :
                value           : ( byteOffset = 0, length = @length ) ->
                    new @constructor @buffer, @byteOffset + byteOffset, length

            TypedArray          :
                get             : ->
                    tarray = this
                    while !Object.hasOwn tarray, "BYTES_PER_ELEMENT" 
                        tarray = Object.getPrototypeOf tarray
                    self[ tarray.constructor.name ]


            detach              :
                value           : ( byteOffset = 0, length = @length ) ->
                    target = new this.TypedArray length
                    target . set @sub byteOffset , length
                    target
                    
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
                    begin = Atomics.load p32, ptri + HINDEX_BEGIN

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
                            Atomics.wait p32, 3, 0, 100
                            Atomics.notify p32, 4, 1
                            return done: yes

                        iterate--
                        value : index++ # + begin    

            loadUint8           :
                    value       : ( index ) ->
                        Atomics.load ui8, index + @byteOffset
            
            loadInt8            :
                    value       : ( index ) ->
                        Atomics.load si8, index + @byteOffset
            
            loadUint8Clamped    :
                    value       : ( index ) ->
                        Atomics.load cu8, index + @byteOffset
            
            loadUint16          :
                    value       : ( index ) ->
                        Atomics.load u16, index + @byteOffset / 2
            
            loadInt16           :
                    value       : ( index ) ->
                        Atomics.load i16, index + @byteOffset / 2
            
            loadUint32          :
                    value       : ( index ) ->
                        Atomics.load u32, index + @byteOffset / 4

            loadInt32           :
                    value       : ( index ) ->
                        Atomics.load i32, index + @byteOffset / 4
            

            storeUint8          :
                    value       : ( index, value ) ->
                        Atomics.store ui8, index + @byteOffset, value
            
            storeInt8           :
                    value       : ( index, value ) ->
                        Atomics.store si8, index + @byteOffset, value
            
            storeUint8Clamped   :
                    value       : ( index, value ) ->
                        Atomics.store cu8, index + @byteOffset, value
            
            storeUint16         :
                    value       : ( index, value ) ->
                        Atomics.store u16, index + @byteOffset / 2, value
            
            storeInt16          :
                    value       : ( index, value ) ->
                        Atomics.store i16, index + @byteOffset / 2, value
            
            storeUint32         :
                    value       : ( index, value ) ->
                        Atomics.store u32, index + @byteOffset / 4, value

            storeInt32          :
                    value       : ( index, value ) ->
                        Atomics.store i32, index + @byteOffset / 4, value
                        

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

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Int8Array         extends self.Int8Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Uint8ClampedArray extends self.Uint8ClampedArray

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Uint16Array       extends self.Uint16Array

            constructor         : ( arg0, byteOffset, length ) ->
                
                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Int16Array        extends self.Int16Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Uint32Array       extends self.Uint32Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Int32Array        extends self.Int32Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Float32Array      extends self.Float32Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class Float64Array      extends self.Float64Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class BigInt64Array     extends self.BigInt64Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

        class BigUint64Array    extends self.BigUint64Array

            constructor         : ( arg0, byteOffset, length ) ->

                if  arg0 < 0
                    
                    ptri        = -arg0
                    length      = Atomics.load p32, ptri + HINDEX_LENGTH
                    byteOffset  = Atomics.load p32, ptri + HINDEX_BYTEOFFSET

                    return super objbuf, byteOffset, length

                ptri = resolvCall()
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

                    begin       = byteOffset / bpel
                    end         = begin + length

                    Atomics.store  p32, ptri + HINDEX_LENGTH, length
                    Atomics.store  p32, ptri + HINDEX_BYTEOFFSET, byteOffset
                    Atomics.store  p32, ptri + HINDEX_BYTELENGTH, byteLength
                    Atomics.store  p32, ptri + HINDEX_BEGIN, begin
                    Atomics.store  p32, ptri + HINDEX_END, end

                    Atomics.store  p32, ptri + HINDEX_LOCKFREE, 1
                    Atomics.notify p32, ptri + HINDEX_LOCKFREE

                # WeakMap -> {TypedArray} => ptri
                resolvs.set this, ptri

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

        class WebGLBuffer       extends Float32Array

            set : ( valueset, index = 0 ) ->
                super( valueset, index )
                @upload()
            
        class WebGLShader       extends Uint8Array

            @byteLength         : 4 * 4 + 1024 * 16

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
                            textDecoder.decode @detach @OFFSET_SOURCE_BEGIN

                        set     : ( source = @DEFAULT_SOURCE ) ->
                            @length = text.length if text = "#{source}".trim()
                            
                            @type = unless text.match /gl_FragColor/
                                @VERTEX_SHADER
                            else @FRAGMENT_SHADER

                            @set textEncoder.encode( text ), @OFFSET_SOURCE_BEGIN

            constructor         : ->
                if  arguments.length
                    super ...arguments
                
                else
                    super WebGLShader.byteLength
                        .source = @DEFAULT_SOURCE

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
            
            DEFAULT_SOURCE      : ``` `
                attribute vec3 a_Position;
                uniform mat4 u_ViewMatrix;

                void main() { gl_Position = u_ViewMatrix * vec4(a_Position, 1.0); }
            ` ```

        class FragmentShader    extends WebGLShader
            
            DEFAULT_SOURCE      : ``` `
                void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); }
            ` ```

        class OnscreenCanvas    extends Uint32Array
    
            @byteLength         : 10 * 4    + 4096 * 4096    

            INDEX_HASCONTEXT    : 0         # Uint8

            INDEX_HASBINDING    : 1         # Uint8

            INDEX_ISRENDERING   : 2         # Uint8
            
            INDEX_FRAMECOUNT    : 1         # Uint32

            INDEX_VSHADER       : 2         # Uint32
            
            INDEX_FSHADER       : 3         # Uint32

            INDEX_DRAWLENGTH    : 4

            INDEX_POINTCOUNT    : 5

            INDEX_GLBUFFER_PTRI : 6
            
            BYTEOFFSET_GLBUFFER : 8 * 4

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

                frameCount :
                    get : -> @loadUint32 @INDEX_FRAMECOUNT
                    set : (v) -> @storeUint32 @INDEX_FRAMECOUNT, v

                vertexShader :
                    get : -> VertexShader.at @loadUint32 @INDEX_VSHADER
                    set : (v) -> @storeUint32 @INDEX_VSHADER, resolvs.get v

                fragmentShader :
                    get : -> FragmentShader.at @loadUint32 @INDEX_FSHADER
                    set : (v) -> @storeUint32 @INDEX_FSHADER, resolvs.get v

                drawBuffer :
                    get : ->
                        @glBuffer
                        new WebGLBuffer @buffer, @byteOffset + @BYTEOFFSET_GLBUFFER, @drawLength

                drawLength :
                    get : -> @loadUint32 @INDEX_DRAWLENGTH
                    set : (v) -> @storeUint32 @INDEX_DRAWLENGTH, v

                pointCount :
                    get : -> @loadUint32 @INDEX_POINTCOUNT
                    set : (v) -> @storeUint32 @INDEX_POINTCOUNT, v

                width :
                    get : -> @gl.drawingBufferWidth

                height :
                    get : -> @gl.drawingBufferHeight

                glBuffer : 
                    configurable: on
                    get : ->
                        unless buffer = @gl.getParameter( @gl.ELEMENT_ARRAY_BUFFER_BINDING )
                            buffer = @gl.createBuffer()                        
                        @gl.bindBuffer @gl.ARRAY_BUFFER, buffer
                        @hasBinding = 1

                        Object.defineProperty( this, "glBuffer", {
                            value : buffer
                            configurable: on
                            writable: on
                        }).glBuffer

                activeAttributes :
                    get : ->
                        i = @gl.getProgramParameter @program, @gl.ACTIVE_ATTRIBUTES
                        v = Object.values WebGL2RenderingContext
                        k = Object.keys WebGL2RenderingContext
                        while i--
                            attrib = @gl.getActiveAttrib @program, i
                            attrib.isEnabled = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_ENABLED
                            attrib.glBuffer = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
                            attrib.vertexLocation = @gl.getAttribLocation @program, attrib.name
                            attrib.vertexSize = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_SIZE
                            attrib.vertexType = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_TYPE
                            attrib.vertexKind = k.at v.indexOf attrib.vertexType 
                            attrib.vertexIsNormalized = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
                            attrib.vertexStride = @gl.getVertexAttrib i, @gl.VERTEX_ATTRIB_ARRAY_STRIDE
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
                    

            addFrame            : ->
                @addUint32 @INDEX_FRAMECOUNT, 1

            lostContext         : ->                
                this.gl
                    .getExtension "WEBGL_lose_context"
                    .loseContext()

            malloc              : ( pointCount = 0 ) ->
                @pointCount = pointCount + @pointCount
                length      = pointCount * @ELEMENTS_PER_POINT
                byteLength  = length * @BYTES_PER_ELEMENT
                offset      = @addUint32 @INDEX_DRAWLENGTH, byteLength
                byteOffset  = @byteOffset + @BYTEOFFSET_GLBUFFER + offset
                array       = new WebGLBuffer @buffer, byteOffset, length

                Object.defineProperties array,
                    upload : value : =>
                        @gl.bufferData @gl.ARRAY_BUFFER, @drawBuffer, @gl.STATIC_DRAW
                        
                        a_Position = @gl.getAttribLocation @program, "a_Position"
                        @gl.vertexAttribPointer a_Position, 3, @gl.FLOAT, off, 0, 0
                        @gl.enableVertexAttribArray a_Position


            reload      : ->
                program = @gl.createProgram()
                
                @vertexShader   = new VertexShader()    if !@vertexShader
                @fragmentShader = new FragmentShader()  if !@fragmentShader
                                
                @vertexShader   . attach @gl, program
                @fragmentShader . attach @gl, program

                @gl.linkProgram program
                @gl.useProgram program

                unless @gl.getProgramParameter program, @gl.LINK_STATUS
                    info = @gl.getProgramInfoLog program
                    throw "Could not compile WebGL program. \n#{info}"

                @program = program


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
                    @render() if @isRendering

                @canvas.dispatchEvent new CustomEvent "webglcontextrestored"

                this


            oncontextlost           : ->
            oncontextrestored       : ->
            onwebglcontextlost      : ->
            onwebglcontextrestored  : ->


            render      : ( handler ) ->
                return (->) if isThread

                unless @isRendering
                    @isRendering = 1

                @handler = handler if handler
                return unless @hasContext

                [ gl, handler, ptri ] =
                    [ @gl, @handler, resolvs.get this ]

                if  isBridge then do commit = =>
                    
                    if  @hasContext and @hasBinding
                        handler.call this, gl, frame = @addFrame()

                        @gl.drawArrays @gl.POINTS, 0, @pointCount

                    requestAnimationFrame commit


            constructor : ->
                super( OnscreenCanvas.byteLength )
                    .getContext "webgl2"

            getContext : ( type ) ->
                ptri = resolvCall()
                onscreen = this
                
                return Object.defineProperty(
                    onscreen, "gl", value : new Proxy {}, {}
                ) if isThread

                replies[ ptri ] = new WeakRef ( data ) =>                   
                    @setContext data.canvas.getContext type, {
                        powerPreference: "high-performance",
                    }
                    unlock data.ptri
                    
                postMessage onscreen : { ptri }
                resolvs.set onscreen , ( ptri )

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
        [ DUMP_WEAKMAP ] : -> log resolvs
    }[ e.data ]()

            
























































    return 0xdead;
