{ log, warn, error, table, debug } = console

sab = new SharedArrayBuffer 1e7
dvw = new DataView sab
u32 = new Uint32Array sab
iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] is 1
BPE = 4

scope = new class Storage extends Array
    constructor : -> super( arguments... ).add null
    classIndex  : -> @indexOf arguments[0].constructor
    store       : (o) -> i += @push o if -1 is i = @indexOf o ; i
    fillEmpty   : (o) -> @[ i = @findIndex((v) -> !v) ] = o ; i
    add         : (o) -> @[ @length ] = o

POINTER_LENGTH      = 16
POINTER_BYTELENGTH  = BPE * POINTER_LENGTH

define = Object.defineProperties
palloc = Atomics.add.bind Atomics, u32, 0, POINTER_BYTELENGTH
malloc = Atomics.add.bind Atomics, u32, 1
palloc malloc POINTER_BYTELENGTH

PTR_CLASSINDEX  = 0 * BPE
PTR_BYTEOFFSET  = 1 * BPE
PTR_BYTELENGTH  = 2 * BPE

getByteOffset   = ( ptri ) ->
    dvw.getUint32 ptri + PTR_BYTEOFFSET, iLE

setByteOffset   = ( ptri, byteOffset ) ->
    dvw.setUint32 ptri + PTR_BYTEOFFSET, byteOffset, iLE ; ptri

getClassIndex   = ( ptri ) ->
    dvw.getUint32 ptri + PTR_CLASSINDEX, iLE

setClassIndex   = ( ptri, clsi ) ->
    dvw.setUint32( ptri + PTR_CLASSINDEX,
        clsi or scope.classIndex( ptri ), iLE
    ) ; ptri

getPtriUint32   = ( ptri, byteOffset ) ->
    dvw.getUint32 byteOffset + getByteOffset( ptri ), iLE

setPtriUint32   = ( ptri, byteOffset, value ) ->
    dvw.setUint32 byteOffset + getByteOffset( ptri ), value, iLE ; value

getPtriFloat32  = ( ptri, byteOffset ) ->
    dvw.getFloat32 byteOffset + getByteOffset( ptri ), iLE

setPtriFloat32  = ( ptri, byteOffset, value ) ->
    dvw.setFloat32 byteOffset + getByteOffset( ptri ), value, iLE ; value

setByteOffset 32, 64

scope.store class Pointer extends Number

    define this::, isPointer : value : on

    define this::, storage   : value : new Storage(0xff)
    
    @from       : ( any ) ->
        setClassIndex ptri = new this palloc()

    store       : ( object ) ->
        if !/WebGL/i.test object.constructor.name
            return @storage.store object

        if  0xff < i = @storage.fillEmpty object
            throw MAX_INDEX_EXCEED : object

        ;i
    


warn ptri = Pointer.from()
warn ptri.store( document )
warn ptri.store( new OffscreenCanvas(1,1).getContext("webgl2") )
warn ptri.store( new OffscreenCanvas(1,1).getContext("webgl2").createProgram() )

log setPtriUint32 4, 12, ptri
log getPtriUint32 4, ptri