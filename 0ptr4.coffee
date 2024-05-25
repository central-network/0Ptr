DEBUG = 0

#* hello world

GL2KEY = Object.keys     WebGL2RenderingContext
GL2VAL = Object.values   WebGL2RenderingContext
GL2NUM = new Object

{ log, warn, error, table, debug, info } = console

sab = new SharedArrayBuffer 256
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
f32 = new Float32Array sab
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
ref = new Array null

encodeText  = TextEncoder::encode.bind new TextEncoder
decodeText  = TextDecoder::decode.bind new TextDecoder

encodeJSON  = -> encodeText JSON.stringify arguments...
decodeJSON  = -> JSON.parse decodeText arguments...

iterate     = ( begin = 0, count = 0 ) ->

    stored = []
    byteOffset = begin

    while byteLength = dvw.getUint32 byteOffset, iLE

        object = restore byteOffset
        encoding = dvw.getUint32 byteOffset + 4, iLE

        stored.push {
            object, encoding
            byteOffset, byteLength,
        }

        unless --count then break
        else byteOffset += byteLength + 8

    stored

bufferize   = ( object, encoding = 0 ) ->
    ref[ encoding ].encode object

objectify   = ( buffer, encoding = 0 ) ->
    ref[ encoding ].decode buffer

externref   = ( coders = { encode, decode } ) ->
    if -1 is i = ref.indexOf coders
        i += ref.push coders
    i


offset      = ->
    byteOffset = 0
    while len = dvw.getUint32 byteOffset, iLE
        byteOffset += len + 8
    byteOffset

store       = ( object, encoding ) ->
    buffer = bufferize object, encoding

    byteLength = buffer.byteLength
    byteOffset = offset()

    dvw.setUint32 byteOffset, byteLength, iLE
    dvw.setUint32 byteOffset+4, encoding, iLE
    
    ui8.set buffer, byteOffset+8 ; byteOffset

restore     = ( byteOffset ) ->
    
    byteLength = dvw.getUint32 byteOffset, iLE
    encoding = dvw.getUint32 byteOffset+4, iLE
    buffer = new Uint8Array sab, byteOffset+8, byteLength

    objectify buffer, encoding



self.dump   = -> console.table iterate()


TYPE_TEXT   = externref {
    encode : ( object ) -> encodeText object
    decode : ( buffer ) -> decodeText buffer.slice()
}

TYPE_JSON   = externref {
    encode : ( object ) -> encodeJSON object
    decode : ( buffer ) -> decodeJSON buffer.slice()
}

warn { TYPE_TEXT, TYPE_JSON }, ref


store {
    type : 0,
    name : "some",
}, TYPE_JSON

store "kamon", TYPE_TEXT


log dump()
log ui8