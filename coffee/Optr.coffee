#? this is zero pointer - fastest
export u32 = new Uint32Array new SharedArrayBuffer 256
export obj = [u32]
export class Error
    constructor : -> console.error [ arguments... ].flat()

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

export default class Optr ### Õ𝓟ṭṙ ### extends Number

    buffer      : u32.buffer

    scopei      : scopei

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


definePreparedDesc = ( proto, props ) ->
    for prop in props then Object.defineProperty(
        proto , prop , switch prop
            when "children" then get : ->

                i           = INITIAL
                max         = 2 + Atomics.load u32, 1
                ptri        = this * 1
                pclass      = no
                children    = []

                loop
                    unless ptri - Atomics.load u32, i + INDEX_PARENT_PTRI
                        Ptri = Atomics.load u32, i + INDEX_PROTO_CLASS
                        if !pclass or pclass is Ptri
                            children.push new obj[ Ptri ] i * 4
                    break if max < i = Atomics.load u32, i + INDEX_ATOMIC_NEXT

                children
    )

Object.defineProperty Optr, "definePreparedDesc", value : ->
    definePreparedDesc @prototype, [ arguments... ].flat()

self.onclick = -> console.warn obj