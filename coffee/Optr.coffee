#? this is zero pointer - fastest
export u32 = new Uint32Array new SharedArrayBuffer 256
export dvw = new DataView u32.buffer
export obj = [u32]

export class KeyBase extends Object

    @filter     : Symbol.for "filter"

    @extend     : Symbol.for "extend"

    @encode     : Symbol.for "encode"

    defaults    :
        
        filter  : -> arguments[0]

        extend  : Number
        
        encode  : -> [ 0, ...arguments[0] ].reduce (a, b) -> a + b.charCodeAt()

    constructor : ( source = {}, options = {} ) ->
        super().configure( options ).add( source )
            .scopeIndex = -1 + obj.push( this )

    configure   : ( options ) ->
        for option , value of @defaults

            symbol = @constructor[ option ]
            value ?= @constructor.defaults[ option ]
            
            Object.defineProperty @, symbol, { value }
        this

    @generate   : ( source = {} ) ->
        base = new this()
        Object.defineProperty(
            base.set( label , base[ KeyBase.encode ] key ),
            key , value : base[ label ]
        ) for label , key of source ; return base

    set         : ( label, value, proto = this[ KeyBase.extend ] ) ->
        return unless @[ KeyBase.filter ] value
        return if @hasOwnProperty value

        key = new (eval("(class #{label} extends #{proto.name} {})"))( value )

        Object.defineProperty this, label, value : key
        Object.defineProperty this, value, value : key

        this

    add         : ( source, proto = this[ KeyBase.Extend ] ) ->
        @set label, value for label , value of source ; this

export class Error
    constructor : -> console.error [ arguments... ].flat()

LENDIAN = 0x3f is new Uint8Array(Float32Array.of(1).buffer)[ 0x3 ]

INDEX_BYTE_LENGTH   = -1
INDEX_PROTO_CLASS   = -2
INDEX_PARENT_PTRI   = -3
INDEX_ATOMIC_NEXT   = -4

BYTES_PER_ELEMENT   = 4
ITEMLENGTH_HEADER   = 4
BYTELENGTH_HEADER   = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT
BYTEOFFSET_PARENT   = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI

Atomics.add u32 , 0 , BYTES_PER_ELEMENT * INITIAL = 6
Atomics.add u32 , 1 , INITIAL = 6

palloc   = Atomics.add.bind Atomics, u32, 0, BYTELENGTH_HEADER
malloc   = ->
    ptri = ( ptr = arguments[ 0 ] ) / 4

    if  byteLength = ptr.constructor.byteLength
        
        Atomics.add u32, 0, byteLength
        Atomics.add u32, 1, byteLength/4

        next = ptri + ITEMLENGTH_HEADER + byteLength/4

        Atomics.store u32, ptri + INDEX_ATOMIC_NEXT, next #write byteLength
        Atomics.store u32, ptri + INDEX_BYTE_LENGTH, byteLength #write byteLength
        Atomics.store u32, ptri + INDEX_PROTO_CLASS, scopei ptr.constructor #write byteLength

try do scopei   = ->
    if -1 is i = obj.indexOf arguments[0]
        i += obj.push arguments[0]
    ; i

export class Optr ### Õ𝓟ṭṙ ### extends Number

    buffer      : u32.buffer

    scopei      : scopei

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
                        children.push new obj[ Ptri ] i * 4
                break if max < i = Atomics.load u32, i + INDEX_ATOMIC_NEXT

            children

        ).call(
            this::, Prop, if Proto is Optr then 0 else scopei Proto
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

        # new Optr()
        if !arguments[0]
            malloc super ptri = palloc()

        # new Optr( offset1, offset2, ... )
        else if argc = arguments.length
        
            ptri = 0
            ptri += O while O = arguments[ --argc ]
            super ptri

        # slient error notify
        try new Error [
            "OFFSET_POINTER_IS_ZERO",
            "new #{@constructor.name}(#{[arguments...]})", ptri
        ] unless ptri


    index4      : ->
        ( this + arguments[0] or 0 ) / 4

    index2      : ->
        ( this + arguments[0] or 0 ) / 2

    offset      : ->
        ( this + arguments[0] or 0 )

    attach      : ( ptr ) -> @storeUint32 BYTEOFFSET_PARENT, ptr
        
    ptrParent   : ( Ptr ) -> @ptrUint32 BYTEOFFSET_PARENT, Ptr

    ptrUint32   : -> new( arguments[1] or Pointer ) ( @loadUint32 arguments[0] )
        
    objUint32   : -> obj[ @loadUint32 arguments[0] ]


    loadUint32  : -> Atomics.load u32, @index4( arguments[0] )
    
    storeUint32 : -> Atomics.store u32, @index4( arguments[0] ), arguments[1]

    
    keyUint8    : -> arguments[1][ @getUint8 arguments[0] ]

    getUint8    : -> dvw.getUint8 this + arguments[0]

    setUint8    : -> dvw.setUint8 this + arguments[0], arguments[1] ; arguments[1]


    keyUint16   : -> arguments[1][ @getUint16 arguments[0] ]
    
    getUint16   : -> dvw.getUint16 this + arguments[0], LENDIAN

    setUint16   : -> dvw.setUint16 this + arguments[0], arguments[1], LENDIAN ; arguments[1]


    getFloat32  : -> dvw.getFloat32 this + arguments[0], LENDIAN

    setFloat32  : -> dvw.setFloat32 this + arguments[0], arguments[1], LENDIAN ; arguments[1]


export { Optr as default }


self.onclick = -> console.warn obj