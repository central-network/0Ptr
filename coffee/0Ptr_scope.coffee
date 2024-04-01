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

export class AtomicScope extends Array

    @metaUrl    : `import.meta.url`

    constructor : ->
        
        obj = super()
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

        Object.defineProperty proto, "buffer",
            value : this.buffer

export { AtomicScope as default }