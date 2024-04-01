#? this is zero pointer - fastest
import { AtomicScope } from "./0Ptr_scope.js"
import { KeyBase } from "./0Ptr_keybase.js"

textEncoder     = new TextEncoder()
textDecoder     = new TextDecoder()

[ bc, obj, sab, i32, u32, f32, u16, ui8, dvw ,

    LENDIAN             = 0x3f is new Uint8Array(Float32Array.of(1).buffer)[ 0x3 ]

    INDEX_BYTE_LENGTH   = -1
    INDEX_PROTO_CLASS   = -2
    INDEX_PARENT_PTRI   = -3
    INDEX_ATOMIC_NEXT   = -4

    BYTES_PER_ELEMENT   = 4
    ITEMLENGTH_HEADER   = 4
    BYTELENGTH_HEADER   = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT
    BYTEOFFSET_PARENT   = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI

    INITIAL = 8 ] = [ new BroadcastChannel("0ptr"), [ null ] ]

###
unless WorkerGlobalScope? then obj = []
else obj = new Proxy [], get : ( ref, key) ->

        unless result = Reflect.get arguments...
            if !isNaN( key ) and 4 < key *= 1
                notifyi = 4 * 256 * 2

                postMessage [ notifyi, key ]
                bc.postMessage [ notifyi, key ]

                Atomics.wait i32, notifyi

                begin = 4 + notifyi * 4
                byteLength = Atomics.load u32, notifyi
                response = ui8.subarray begin, begin + byteLength 
                reply = new TextDecoder().decode response.slice() 

                { name, type, prop } = JSON.parse reply

                Target = new (eval("(class #{name} extends Object {})"))()
                Object.assign Target, prop

                return ref[ key ] = new Proxy Target, get : ( ref, key ) ->

                    switch ref[key]
                        when "string"
                            postMessage [ notifyi, key, ref[key] ]

        return result

obj.push null, u32, i32, ui8
self.obj = obj #! remove
###

malloc   = ->
    ptri = ( ptr = arguments[ 0 ] ) / 4

    if  byteLength = ptr.constructor.byteLength

        if mod = byteLength % 4
            byteLength += 4 - mod
        
        Atomics.add u32, 0, byteLength
        Atomics.add u32, 1, byteLength/4

        next = ptri + ITEMLENGTH_HEADER + byteLength/4

        Atomics.store u32, ptri + INDEX_ATOMIC_NEXT, next #write byteLength
        Atomics.store u32, ptri + INDEX_BYTE_LENGTH, byteLength #write byteLength
        Atomics.store u32, ptri + INDEX_PROTO_CLASS, scopei ptr.constructor #write byteLength

scopei   = ->
    [ object, i = 0 ] = arguments

    return i if obj[ i ] = object if i

    if -1 is i = obj.indexOf arguments[0]
        i += obj.push arguments[0]
    ; i

export class    OPtr extends Number

    @metaUrl    : `import.meta.url`

    scopei      : scopei

    obj         : obj

    @setup      : ->
        sab = arguments[0]
        i32 = new Int32Array sab
        u32 = new Uint32Array sab
        f32 = new Float32Array sab
        u16 = new Uint16Array sab
        ui8 = new Uint8Array sab
        dvw = new DataView sab
    
        unless Atomics.load u32
            Atomics.store u32 , 0 , BYTES_PER_ELEMENT * INITIAL
            Atomics.store u32 , 1 , INITIAL
    
        Object.defineProperty this::, "buffer",
            value : sab , configurable : off

        console.warn "OPtr has been settled", this::buffer

    @filter     : ->

        ( ( prop, pclass ) -> Object.defineProperty this, prop, get : ->
            
            i = INITIAL
            max = 2 + Atomics.load u32, 1
            ptri = this * 1
            children = []


            loop

                unless ptri - Atomics.load u32, i + INDEX_PARENT_PTRI
                    Ptri = Atomics.load u32, i + INDEX_PROTO_CLASS
                    if !pclass or pclass is Ptri
                        console.error Ptri unless document?

                        children.push new obj[ Ptri ] i * 4
                break if max < i = Atomics.load u32, i + INDEX_ATOMIC_NEXT

            children

        ).call(
            this::, Prop, if Proto is OPtr then 0 else scopei Proto
        ) for Prop, Proto of arguments[0]

        this

    @reserv     : ( proto, length = 1 ) ->

        BYTELENGTH = length * (
             proto . byteLength or
             proto . BYTES_PER_ELEMENT
        )

        ALGINBYTES =
             proto . BYTES_PER_ELEMENT or
             Math.max proto.byteLength % 4 , 4
        
        if mod = @byteLength % ALGINBYTES
            mod = ALGINBYTES - mod
        else mod = 0
        
        byteOffset = @byteLength + mod
        
        Object.defineProperties this,
        
            length       :
                value    : @length + length
                writable : on
            
            byteLength   :
                writable : on
                value    : byteOffset + BYTELENGTH

        byteOffset

    @byteLength : 0

    constructor : ->

        # new OPtr()
        if !arguments[0]
            malloc super ptri = Atomics.add u32, 0, BYTELENGTH_HEADER

        # new OPtr( offset1, offset2, ... )
        else if argc = arguments.length
        
            ptri = 0
            ptri += O while O = arguments[ --argc ]
            super ptri

        # slient error notify
        try console.error [
            "OFFSET_POINTER_IS_ZERO",
            "new #{@constructor.name}(#{[arguments...]})", ptri
        ] unless ptri

    index4      : ->
        ( this + ( arguments[0] or 0 ) ) / 4

    index2      : ->
        ( this + arguments[0] or 0 ) / 2

    offset      : ->
        ( this + arguments[0] or 0 )

    attach      : ( ptr ) -> @storeUint32 BYTEOFFSET_PARENT, ptr

    ptrParent   : ( Ptr ) -> @ptrUint32 BYTEOFFSET_PARENT, Ptr

    lock        : -> Atomics.wait i32, @index4( arguments[0] ) ; this

    unlock      : -> Atomics.notify i32, @index4( arguments[0] ), arguments[1] or 1 ; this

    encodeText  : -> textEncoder.encode arguments[0]

    encodeJSON  : -> @encodeText JSON.stringify arguments[0]
    
    decodeText  : -> textDecoder.decode arguments[0].slice()

    decodeJSON  : -> JSON.parse @decodeText arguments[0]


    ptrUint32   : -> new( arguments[1] or Pointer ) ( @loadUint32 arguments[0] )
        
    objUint32   : -> obj[ @loadUint32 arguments[0] ]

    loadUint32  : -> Atomics.load u32, @index4( arguments[0] )
    
    storeUint32 : -> Atomics.store u32, @index4( arguments[0] ), arguments[1]

    addUint32   : -> Atomics.add u32, @index4( arguments[0] ), arguments[1]
    
    andUint32   : -> Atomics.and u32, @index4( arguments[0] ), arguments[1]
    
    waitUint32  : -> Atomics.wait u32, @index4( arguments[0] ), arguments[1]
    
    orUint32    : -> Atomics.or u32, @index4( arguments[0] ), arguments[1]
    
    xorUint32   : -> Atomics.xor u32, @index4( arguments[0] ), arguments[1]

    keyUint32   : -> arguments[1][ @getUint32 arguments[0] ]
    
    getUint32   : -> dvw.getUint32 this + arguments[0], LENDIAN

    setUint32   : -> dvw.setUint32 this + arguments[0], arguments[1], LENDIAN ; arguments[1]


    arrayUint8  : -> new Uint8Array sab, @offset( arguments[0] ) , arguments[1]

    copyUint8   : -> ui8.set arguments[1], @offset arguments[0] ; arguments[1].byteLength
    
    keyUint8    : -> arguments[1][ @getUint8 arguments[0] ]

    getUint8    : -> dvw.getUint8 this + arguments[0]

    setUint8    : -> dvw.setUint8 this + arguments[0], arguments[1] ; arguments[1]

    loadUint8   : -> Atomics.load ui8, this + arguments[0]

    storeUint8  : -> Atomics.store ui8, this + arguments[0], arguments[1]


    keyUint16   : -> arguments[1][ @getUint16 arguments[0] ]
    
    getUint16   : -> dvw.getUint16 this + arguments[0], LENDIAN

    setUint16   : -> dvw.setUint16 this + arguments[0], arguments[1], LENDIAN ; arguments[1]

    loadUint16  : -> Atomics.load u16, @index2( arguments[0] )
    
    storeUint16 : -> Atomics.store u16, @index2( arguments[0] ), arguments[1]


    getFloat32  : -> dvw.getFloat32 this + arguments[0], LENDIAN

    setFloat32  : -> dvw.setFloat32 this + arguments[0], arguments[1], LENDIAN ; arguments[1]

    
export { OPtr as default }

if  window? and document?
    OPtr.setup new SharedArrayBuffer 1024 * 1024
    self.onclick = -> console.warn obj
    self.name = "window"
    document.title = "my"
    document.num = 2

else addEventListener "message", ( e ) ->
    OPtr.setup e.data
    dispatchEvent new CustomEvent "ready", { detail: self }
, once : yes ; null

bc.onmessage = (e) ->
    return unless self.name is e.data.receiver
    { request, sender, thread, data } = e.data

    ptr = new obj[3] thread
    
    switch request
        when "loadObject"
            unless obj[ data.scopei ]
                ptr . unlock()
                return throw ["nonononono"]

            switch typeof obj[ data.scopei ]
                when "object"

                    obji = obj[ data.scopei ]
                    name = obji.name or obji.constructor.name
                    data = { name , prop : {} }

                    for prop , desc of obji
                        data . prop[ prop ] =
                            typeof desc

                    ptr . data = data
                    ptr . unlock()


        when "getObjectProp"
            return unless obj[ data.scopei ]
            ptr . data = obj[ data.scopei ][ data.prop ]
            ptr . unlock()
                    
        when "setObjectProp"
            return unless obj[ data.scopei ]
            console.warn data.prop, data.val
            obj[ data.scopei ][ data.prop ] = data.val
            ptr . data = obj[ data.scopei ][ data.prop ]
            ptr . unlock()
                    