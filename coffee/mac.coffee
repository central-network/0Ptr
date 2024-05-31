{ log, warn, error, table, debug, info } = console

sab = new SharedArrayBuffer 1e7 * 8
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
f32 = new Float32Array sab
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
ref = new Array

malloc = ( byteLength = 0 ) ->
    
    ptrLength = 16 * 4
    allocLength = byteLength + ptrLength

    if  mod = byteLength % 8
        allocLength += 8 - mod

    nextOffset = 0
    byteOffset = 0

    loop 

        if !nextOffset = Atomics.load u32, i = nextOffset/4

            Atomics.store u32, i, byteOffset + allocLength
            Atomics.store u32, i + 1, byteLength

            return byteOffset + ptrLength

        byteOffset = nextOffset

getter = ( object, properties ) ->
    for key, getter of properties
        Object.defineProperty object, key, { get : getter }
    

class Pointer               extends Number
    @malloc : ( byteLength = 0 ) ->
        blen = byteLength + ( @byteLength or 0 )
        ptri = new this malloc byteLength


class DeviceDriver          extends Pointer
class LocalWindowDevice     extends DeviceDriver
    device : window ? null


class LocalWindowPointerDevice extends LocalWindowDevice



localPointerDev = LocalWindowPointerDevice.malloc()

log localPointerDev