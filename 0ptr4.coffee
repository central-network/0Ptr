DEBUG = 0

#* hello world

GL2KEY = Object.keys     WebGL2RenderingContext
GL2VAL = Object.values   WebGL2RenderingContext
GL2NUM = new Object

{ log, warn, error, table, debug, info } = console

class JSONEncoder extends TextEncoder
    encode : -> super JSON.stringify arguments...
class JSONDecoder extends TextDecoder
    decode : -> JSON.parse super arguments...

sab = new SharedArrayBuffer 8 * 1e7
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
f32 = new Float32Array sab
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
ref = new Array

self.dump   = ->
    console.table iterate()
    console.warn "externref:", ref

iterate     = ( begin = 0, count = 0 ) ->

    items = []
    byteOffset = begin

    while byteLength = dvw.getUint32 byteOffset, iLE

        item = data : restore byteOffset
            
        Object.defineProperties item,
            type : value : dvw.getUint32 byteOffset + 4, iLE
            ["{{Buffer}}"]  : value :
                buffer      : bufferize byteOffset
                byteOffset  : byteOffset
                byteLength  : byteLength
            ["{{Headers}}"] : value :
                new Uint32Array sab, byteOffset, 2

        items.push item

        unless --count then break
        else byteOffset += byteLength + 8

    items

externref   = ( any ) ->
    if -1 is i = ref.indexOf any
        i += ref.push any
    i

subarray    = ( byteOffset, TypedArray = Uint8Array ) ->
    byteLength = dvw.getUint32 byteOffset, iLE
    length = byteLength / TypedArray.BYTES_PER_ELEMENT
    new TypedArray sab, byteOffset + 8, length

store       = ( data, type = 0 ) ->
    buffer = ref[ type ].encode data
    
    byteOffset = 0
    byteLength = buffer.byteLength
    while size = dvw.getUint32 byteOffset, iLE
        #? to the end of sab
        byteOffset += size + 8

    dvw.setUint32 byteOffset , byteLength, iLE
    dvw.setUint32 byteOffset + 4 ,   type, iLE

    subarray( byteOffset ).set buffer

    ; byteOffset
    
restore     = ( byteOffset, type ) ->
    type ||= dvw.getUint32 byteOffset + 4, iLE
    ref[ type ].decode subarray( byteOffset ).slice()

bufferize   = ( byteOffset ) ->
    subarray( byteOffset ).slice().buffer


TYPE_NULL   = externref {
    alias  : "NULL"
    encode : ( any ) -> return switch on

        when ( false is Boolean any ) then switch true
            when any is undefined     then Boolean
            when any is false         then Boolean
            when any is null          then Boolean
            when any is NaN           then Number
            when any is 0             then Number
            when any is ""            then String

        when ArrayBuffer.isView( any ) then switch any.constructor            
            when Uint8Array then ref[ TYPE_BYTE ].encode any

    decode : -> arguments[0]
}
    
TYPE_BYTE   = externref {
    alias  : "BYTE"
    encode : -> arguments[0]
    decode : -> arguments[0]
}
    
TYPE_JSON   = externref {
    alias  : "JSON"
    encode : JSONEncoder::encode.bind new JSONEncoder
    decode : JSONDecoder::decode.bind new JSONDecoder
    filter : ->
    matchs : ( any ) ->
}

TYPE_TEXT   = externref {
    alias  : "TEXT"
    encode : TextEncoder::encode.bind new TextEncoder
    decode : TextDecoder::decode.bind new TextDecoder
    filter : ->
}

store new Uint8Array([1,4,4,1])
store { type : 0, name : "some", }, TYPE_JSON
store "kamon", TYPE_TEXT


dump()