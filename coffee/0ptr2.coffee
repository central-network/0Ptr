#? hello world <3

export class Pointer            extends Number
export class Scene              extends Pointer
export class DrawCall           extends Pointer
export class Viewport           extends Pointer
export class ClearColor         extends Pointer
export class ClearMask          extends Pointer
export class Color              extends Pointer
export class Scale              extends Pointer
export class Rotation           extends Pointer
export class Position           extends Pointer
export class Vertices           extends Pointer
export class Mesh               extends Pointer
export class Text               extends Pointer
export class Id                 extends Text
export class VertexShader       extends Text
export class ComputeShader      extends Text
export class FragmentShader     extends Text
export class Program            extends Pointer
export class EventHandler       extends Pointer
export class RenderingContext   extends Pointer
export class DrawBuffer         extends Pointer
export class VertexArray        extends Pointer
export class Attribute          extends Text
export class Uniform            extends Text
export class CPU                extends Text
export class GPU                extends Pointer
export class AllocArray         extends Pointer


export default classes = new Object {
    Scene, DrawCall, Viewport, ClearColor, ClearMask, 
    Color, Scale, Rotation, Position, Vertices, 
    Mesh, Id, VertexShader, FragmentShader, EventHandler,
    Program, RenderingContext, VertexArray, Attribute, 
    Uniform, CPU, GPU, AllocArray
}

#* export|class|extends|Pointer|Number|Text|\s+

{ log, warn, error, table, debug } = console

sab = new SharedArrayBuffer 1e7
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] is 1
BPE = 4

POINTER_LENGTH      = 16
POINTER_BYTELENGTH  = BPE * POINTER_LENGTH

PTR_CLASSINDEX      = 0 * BPE
PTR_PARENT          = 1 * BPE
PTR_BYTEOFFSET      = 2 * BPE
PTR_BYTELENGTH      = 3 * BPE

#* laskdşlkalsşkdşalkdşlaskdşlaskd

palloc = Atomics.add.bind Atomics, u32, 0, POINTER_BYTELENGTH
malloc = Atomics.add.bind Atomics, u32, 1

palloc malloc POINTER_BYTELENGTH * 1e5

define = Object.defineProperties
getown = Object.getOwnPropertyDescriptor
encode = TextEncoder::encode.bind new TextEncoder
decode = TextDecoder::decode.bind new TextDecoder

export class PtriArray extends Array

export storage = new (class Storage extends Array
    constructor     : -> super( arguments... ).add null
    findByName      : -> @find((i) => i and i.name is arguments[0])
    fillFirstEmpty  : (o) -> @[ i = @findIndex((v) -> !v) ] = o ; i
    pushOrFindIndex : (o) -> i += @push o if -1 is i = @indexOf o ; i
    add             : (o) -> @[ @length ] = o ; this ) 0xff

#* lşasdklkasşdkaşsldkşasldkşalsdkasşlkdlşsakd

getByteOffset   = ( ptri ) ->
    dvw.getUint32 ptri + PTR_BYTEOFFSET, iLE

setByteOffset   = ( ptri, byteOffset ) ->
    dvw.setUint32 ptri + PTR_BYTEOFFSET, byteOffset, iLE ; ptri

getByteLength   = ( ptri ) ->
    dvw.getUint32 ptri + PTR_BYTELENGTH, iLE

setByteLength   = ( ptri, byteLength ) ->
    dvw.setUint32 ptri + PTR_BYTELENGTH, byteLength, iLE ; ptri

ptr_Pointer     = ( ptri ) ->
    ptri and new storage[ getClassIndex ptri ] ptri

new_Pointer     = ( Class ) ->
    setClassIndex ptri = new Class palloc()
    return ptri if !byteLength = Class.byteLength

    setByteOffset ptri, malloc byteLength
    setByteLength ptri, byteLength

    return ptri

getClassIndex   = ( ptri ) ->
    dvw.getUint32( ptri + PTR_CLASSINDEX, iLE ) or
    storage.indexOf( ptri.constructor )

setClassIndex   = ( ptri, clsi ) ->
    dvw.setUint32( ptri + PTR_CLASSINDEX,
        clsi or getClassIndex( ptri ), iLE
    ) ; ptri

addChildren     = ( parent, child ) ->
    dvw.setUint32 child + PTR_PARENT, parent, iLE ; child

setParent       = ( child, parent ) ->
    dvw.setUint32 child + PTR_PARENT, parent, iLE ; parent

getParent       = ( ptri ) ->
    dvw.getUint32 ptri + PTR_PARENT, iLE

getPtriUint32   = ( ptri, byteOffset ) ->
    dvw.getUint32 byteOffset + getByteOffset( ptri ), iLE

setPtriUint32   = ( ptri, byteOffset, value ) ->
    dvw.setUint32 byteOffset + getByteOffset( ptri ), value, iLE ; value

getPtriFloat32  = ( ptri, byteOffset ) ->
    dvw.getFloat32 byteOffset + getByteOffset( ptri ), iLE

setPtriFloat32  = ( ptri, byteOffset, value ) ->
    dvw.setFloat32 byteOffset + getByteOffset( ptri ), value, iLE ; value

storeForUint8   = ( any ) ->
    storage.fillFirstEmpty any

storeForUint32  = ( any ) ->
    storage.pushOrFindIndex any

new_Uint32Array = ( ptri, byteOffset, length ) ->
    length ||= getByteLength( ptri ) / 4
    byteOffset = getByteOffset( ptri ) + byteOffset || 0

    new Uint32Array sab, byteOffset, length

new_Uint8Array  = ( ptri, byteOffset, length ) ->
    length ||= getByteLength( ptri )
    byteOffset = getByteOffset( ptri ) + byteOffset || 0

    new Uint8Array sab, byteOffset, length

subarrayUint8   = ( ptri, begin, end ) ->
    offset = getByteOffset( ptri )
    length = getByteLength( ptri )

    end ||= length + begin ||= begin or 0
    ui8.subarray begin + offset, end + offset 

sliceUint8      = ( ptri, begin, end ) ->
    offset = getByteOffset( ptri )
    length = getByteLength( ptri )

    end ||= length + begin ||= begin or 0
    ui8.slice begin + offset, end + offset 

subarrayUint32  = ( ptri, begin, end ) ->
    offset = getByteOffset( ptri ) / 4
    length = getByteLength( ptri ) / 4

    end ||= length + begin ||= begin or 0
    u32.subarray begin + offset, end + offset 


define Pointer::            , [ '{{Pointer}}' ] :
    get : -> new Uint32Array sab, this, POINTER_LENGTH    

define Pointer              , from              :
    value : ->
        setClassIndex ptri = new this palloc()

        switch ( arg0 = arguments[0] )?.constructor
            when Object then for prop, value of arg0
                addChildren ptri, storage[ prop ].from value

            when Array then for i in arg0 then for prop, value of i
                addChildren ptri, storage[ prop ].from value

            when String then ptri.set arg0

            else error arg0

        return ptri
define Pointer::            , toString          :
    value : -> error "tostring", this
define Pointer::            , add               :
    value : ( ptri ) -> setParent ptri, this
define Pointer::            , append            :
    value : ( ptri ) -> addChildren this, ptri
define Pointer::            , children          :
    enumerable: on,
    get   : ->
        ptrj = dvw.getUint32 0, iLE
        ptri = +this
        list = new PtriArray

        while ptrj -= POINTER_BYTELENGTH
            continue if ptri - getParent ptrj
            list[ list.length ] = ptr_Pointer ptrj

        list
define Pointer::            , parent            :
    enumerable: on,
    get   : -> ptr_Pointer getParent this
define Pointer::            , isPointer         :
    value : true
define Pointer::            , on                :
    value : ( event, handler ) -> this
define Pointer::            , once              :
    value : ( event, handler ) -> this
define Pointer::            , emit              :
    value : ( event, handler ) -> this
define Text::               , TypedArray        :
    value : Uint8Array
define Text::               , text              :
    enumerable : on
    get   : -> decode sliceUint8 this 
define Text::               , set               :
    value : ( value ) ->  

        if  /string/.test typeof value
            value = encode value

        if !value instanceof Uint8Array
            throw TEXT_VALUE_ERROR : value

        if !byteOffset = getByteOffset this
            byteLength = value .byteLength
            byteOffset = malloc byteLength

            setByteOffset this, byteOffset
            setByteLength this, byteLength


        ui8.set( value, byteOffset )
        
        ;@
define Color                , byteLength        :
    value : 4 * 4
define Color::              , TypedArray        :
    value : Float32Array
define RenderingContext::   , getViewport       :
    value : -> new_Pointer Viewport

#? <------->


for name , Class of classes

    prop = name[0].toLowerCase() + name.substring 1
    define storage.add( Class ), [ prop ] : { value : Class }
    
    for name of Object.getOwnPropertyDescriptors Class::

        continue unless /get|set/.test key = name.substring 0, 3
        continue unless className = name.substring 3
        continue unless Property = storage.findByName className
        continue unless no is Object.hasOwn( Class::, prop =
            className[0].toLowerCase() + className.substring 1 )

        get = d.value if d = getown Class::, "get#{className}"
        set = d.value if d = getown Class::, "set#{className}"

        define Class::, [ prop ] : { get, set, enumerable : on }
    
    continue unless Class::TypedArray

    define( Class::, BYTES_PER_ELEMENT : {
        value : Class::TypedArray.BYTES_PER_ELEMENT
    } )
    
    define( Class, length : value : (
        Class.byteLength / Class::BYTES_PER_ELEMENT
    ) ) if Class.byteLength

    continue

#? <------->


warn rc = new_Pointer( RenderingContext )
warn p0 = Program.from({ vertexShader : "hello world vs" })
warn p1 = Program.from([ { fragmentShader : "hello world fs" }, { vertexShader : "hello world vs" } ])
warn "p0.add p1:", p0.add p1
warn "p0.append p1:", p0.append p1
warn "rc.append p0:", rc.append p0
warn "rc:", rc
