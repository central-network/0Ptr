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

    INITIAL = 8 ] = [ [] ]

export class Scope extends Array

    @metaUrl    : `import.meta.url`

    constructor : ( OPtr ) ->
        super().push( null )
        console.log OPtr::buffer

    add         : ( item , i ) ->
        @[ i ] = item if i > 0

        if -1 is i = @indexOf item
            i += @push new WeakRef item
        i

    get         : ( i ) ->
        return @get @indexOf i if isNaN i
        unless item = @at i
            return if window?

        item.deref()

    

export { Scope as default }