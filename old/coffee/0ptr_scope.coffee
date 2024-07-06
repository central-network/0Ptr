[   obj, sab, i32, u32, f32, u16, ui8, dvw ,

    LENDIAN             = 0x3f is new Uint8Array(Float32Array.of(1).buffer)[ 0x3 ]

    INDEX_BYTE_LENGTH   = -1
    INDEX_PROTO_CLASS   = -2
    INDEX_PARENT_PTRI   = -3
    INDEX_ATOMIC_NEXT   = -4

    BYTES_PER_ELEMENT   = 4
    ITEMLENGTH_HEADER   = 4
    BYTELENGTH_HEADER   = ITEMLENGTH_HEADER * BYTES_PER_ELEMENT
    BYTEOFFSET_PARENT   = BYTES_PER_ELEMENT * INDEX_PARENT_PTRI

    INITIAL = 12 ] = [ [] ]

export class Scope extends Array

    @metaUrl        : `import.meta.url`

    @maxLength      : Math.pow( navigator?.deviceMemory or 2 , 11 ) / 4

    @maxByteLength  : Scope.maxLength * 4

    constructor : ( root ) ->
        super().add( root )


    
    map : new WeakMap()

    get : ->
        if !isNaN i = arguments[0]
            return this[ i ].deref()
        else if !isNaN i = @has i
            return @get i
        null 

    has : ->
        
        unless @map.has o = arguments[0]
            return no
            
        for i in [ 0 ... @length ]
            return i if o is @get i
                
        no

    add : ->
        unless @map.has arguments[0]
            @map.set arguments[0], @set arguments[0]
        @map.get arguments[0]

    set : ->
        [ object , i ] = [ arguments..., this.length ]
        ( this[ i ] = new WeakRef object ) ; return i

export { Scope as default }
