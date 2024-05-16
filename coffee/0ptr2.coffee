import { event } from "./window.coffee"

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
export class ShaderSource       extends Text
export class VertexShader       extends Pointer
export class ComputeShader      extends Pointer
export class FragmentShader     extends Pointer
export class Program            extends Text
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
    Mesh, Id, ShaderSource, VertexShader, FragmentShader, 
    EventHandler, Program, RenderingContext, VertexArray, 
    Attribute, Uniform, CPU, GPU, AllocArray
}

#* export|class|extends|Pointer|Number|Text|\s+

{ log, warn, error, table, debug, delay } = console

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
PTR_LINKED          = 2 * BPE

PTR_BYTEOFFSET      = 3 * BPE
PTR_BYTELENGTH      = 4 * BPE


RENDERING_CONTEXT_GLOBJECT  = 3 * BPE # PTR_BYTEOFFSET #? HAS NO BYTEOFFSET
RENDERING_CONTEXT_VIEWPORT  = 4 * BPE # PTR_BYTELENGTH #? HAS NO BYTELENGTH

VIEWPORT_X                  = 3 * BPE # PTR_BYTEOFFSET #? HAS NO BYTEOFFSET
VIEWPORT_Y                  = 4 * BPE # PTR_BYTEOFFSET #? HAS NO BYTEOFFSET
VIEWPORT_TOP                = 5 * BPE 
VIEWPORT_LEFT               = 6 * BPE 
VIEWPORT_WITDH              = 7 * BPE 
VIEWPORT_HEIGHT             = 8 * BPE 
VIEWPORT_ASPECT_RATIO       = 9 * BPE
VIEWPORT_PIXEL_RATIO        = 10 * BPE

#* laskdşlkalsşkdşalkdşlaskdşlaskd

palloc = Atomics.add.bind Atomics, u32, 0, POINTER_BYTELENGTH
malloc = Atomics.add.bind Atomics, u32, 1

palloc malloc POINTER_BYTELENGTH * 1e5

assign = Object.assign
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

addListener     = ( element, event, handler ) ->
    element.addEventListener event, handler ; element

hitListener     = ( element, event, detail ) ->
    element.dispatchEvent new Event event, { detail }

appendElement   = ( element ) ->
    document.body.appendChild element ; element

createElement   = ( tagName ) ->
    document.createElement tagName

queryDocument   = ( query, all = off ) ->
    unless all then document.querySelector query
    else document.querySelectorAll query

hitOnTimeout    = ->
    fn  = arguments[ 0 ]
    ->  clearTimeout( delay ) or delay =
        setTimeout( fn.bind( this ), 40 )

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

getUint8        = ( ptri, byteOffset ) ->
    dvw.getUint8   byteOffset + getByteOffset( ptri )

setUint8        = ( ptri, byteOffset, value ) ->
    dvw.setUint8   byteOffset + getByteOffset( ptri ), value ; value

getUint32       = ( ptri, byteOffset ) ->
    dvw.getUint32  byteOffset + getByteOffset( ptri ), iLE

setUint32       = ( ptri, byteOffset, value ) ->
    dvw.setUint32  byteOffset + getByteOffset( ptri ), value, iLE ; value

getFloat32      = ( ptri, byteOffset ) ->
    dvw.getFloat32 byteOffset + getByteOffset( ptri ), iLE

setFloat32      = ( ptri, byteOffset, value ) ->
    dvw.setFloat32 byteOffset + getByteOffset( ptri ), value, iLE ; value

getPtriUint8    = ( byteOffset ) ->
    dvw.getUint8   byteOffset

setPtriUint8    = ( byteOffset, value ) ->
    dvw.setUint8   byteOffset, value ; value

getPtriUint32   = ( byteOffset ) ->
    dvw.getUint32  byteOffset, iLE

setPtriUint32   = ( byteOffset, value ) ->
    dvw.setUint32  byteOffset, value, iLE ; value

getPtriFloat32  = ( byteOffset ) ->
    dvw.getFloat32 byteOffset, iLE

setPtriFloat32  = ( byteOffset, value ) ->
    dvw.setFloat32 byteOffset, value, iLE ; value

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

findChild       = ( ptri, Class, inherit = off ) ->
    return unless ptri

    ptrj = Atomics.load u32
    clsi = storage.indexOf Class

    while ptrj -= POINTER_BYTELENGTH
        continue if ptri - getParent ptrj
        continue if clsi - getClassIndex ptrj
        return ptr_Pointer ptrj

    return unless inherit

    findChild getParent( ptri ), Class, inherit

define Pointer::            , [ '{{Pointer}}' ] :
    get : -> define {},
        headAsUint8     : enumerable : on, get : => new Uint8Array sab, this, POINTER_BYTELENGTH    
        headAsUint32    : enumerable : on, get : => new Uint32Array sab, this, POINTER_LENGTH    
        headAsFloat32   : enumerable : on, get : => new Float32Array sab, this, POINTER_LENGTH    
define Pointer              , of                :
    value : ( props = {} ) -> assign new_Pointer(this), props
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
    enumerable: on
    configurable: on
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
define RenderingContext::   , glObject          :
    get : ->
        if !stri = getPtriUint8 this + RENDERING_CONTEXT_GLOBJECT
            node = appendElement createElement "canvas"
            stri = storeForUint8 node.getContext "webgl2"

            setPtriUint8 this + RENDERING_CONTEXT_GLOBJECT, stri

            addListener window, "resize", @onresize.bind this
            hitListener window, "resize", this

        storage[ stri ]
define RenderingContext::   , canvas            :
    get   : -> @glObject.canvas
define RenderingContext::   , onresize          :
    value : hitOnTimeout ->

        {   top, left,
            width, height,
            pixelRatio
        } = @viewport

        assign @canvas,
            width       : pixelRatio * width
            height      : pixelRatio * height

        assign @canvas.style,
            position   : "fixed"
            top        : "#{top}px"
            left       : "#{left}px"
            width      : "#{width}px"
            height     : "#{height}px"

        @
define RenderingContext::   , getViewport       :
    value : ->
        if !ptrj = getPtriUint8 this + RENDERING_CONTEXT_VIEWPORT
            if !ptrj = findChild this , Viewport, inherit = on
                return addChildren this , new_Pointer Viewport
            return @setViewport ptrj
        return new Viewport ptrj
define RenderingContext::   , setViewport       :
    value : ( ptrj ) ->
        setPtriUint8 this + RENDERING_CONTEXT_VIEWPORT, ptrj
define Viewport::           , isFullScreen      :
    get : -> !!document.fullscreenElement
define Viewport::           , isFullWindow      :
    get : -> !getPtriFloat32 this + VIEWPORT_WITDH
define Viewport::           , getX              :
    value : ->
        getPtriFloat32 this + VIEWPORT_X
define Viewport::           , setX              :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_X, value
define Viewport::           , getY              :
    value : ->
        getPtriFloat32 this + VIEWPORT_Y
define Viewport::           , setY              :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_Y, value
define Viewport::           , getLeft           :
    value : ->
        getPtriFloat32 this + VIEWPORT_LEFT
define Viewport::           , setLeft           :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_LEFT, value
define Viewport::           , getTop            :
    value : ->
        getPtriFloat32 this + VIEWPORT_TOP
define Viewport::           , setTop            :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_TOP, value
define Viewport::           , getWidth          :
    value : ->
        if !value = getPtriFloat32 this + VIEWPORT_WITDH
            value = self.innerWidth or 320
        value
define Viewport::           , setWidth          :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_WITDH, value
define Viewport::           , getHeight         :
    value : ->
        if !value = getPtriFloat32 this + VIEWPORT_HEIGHT
            value = self.innerHeight or 240
        value
define Viewport::           , setHeight         :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_HEIGHT, value
define Viewport::           , getAspectRatio    :
    value : ->
        if !ratio = getPtriFloat32 this + VIEWPORT_ASPECT_RATIO
            return @width / @height
        return ratio
define Viewport::           , setAspectRatio    :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_ASPECT_RATIO, value
define Viewport::           , getPixelRatio     :
    value : ->
        if !ratio = getPtriFloat32 this + VIEWPORT_PIXEL_RATIO
            return self.devicePixelRatio or 1
        return ratio
define Viewport::           , setPixelRatio     :
    value : ( value ) ->
        setPtriFloat32 this + VIEWPORT_PIXEL_RATIO, value
define ShaderSource::       , program           :
    enumerable : on
    get : -> decode sliceUint8 this
    set : ShaderSource::set
define ShaderSource::       , vertexShader      :
    enumerable : on, get : -> @documentScripts.vertexShader?.text
define ShaderSource::       , computeShader     :
    enumerable : on, get : -> @documentScripts.computeShader?.text
define ShaderSource::       , fragmentShader    :
    enumerable : on, get : -> @documentScripts.fragmentShader?.text
define ShaderSource::       , documentScripts   :
    get : ->
        v = queryDocument "[program=#{@program}][type*='vertex']"
        c = queryDocument "[program=#{@program}][type*='compute']"
        f = queryDocument "[program=#{@program}][type*='fragment']"

        if !v and f and $program = f.getAttribute "vertex-shader"
            v = queryDocument "[program=#{$program}][type*='vertex']"

        if !f and v and $program = v.getAttribute "fragment-shader"
            f = queryDocument "[program=#{$program}][type*='fragment']"

        vertexShader   : v
        computeShader  : c
        fragmentShader : f

#? <------->

for name , Class of classes

    prop = name[0].toLowerCase() + name.substring 1
    define storage.add( Class ), [ prop ] : { value : Class }
    
    for name of Object.getOwnPropertyDescriptors Class::

        continue unless /get|set/.test key = name.substring 0, 3
        continue unless className = name.substring 3
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

Reflect.defineProperty ShaderSource::, "children", value: new PtriArray
#? <------->


warn "sc:", sc = new_Pointer( Scene )
warn "ss1:", ss1 = ShaderSource.of({ program : "default" })
warn "rc1:", rc1 = new_Pointer( RenderingContext )
warn "vp1:", vp1 = new_Pointer( Viewport )

warn "p0:", p0 = Program.from({ shaderSource : "my-avesome-vertex-shader" })
warn "p1:", p1 = new_Pointer( Program )

warn "rc2:", rc2 = new_Pointer( RenderingContext )
warn "vp2:", vp2 = Viewport.of({ width : 320, height : 240, left: 20, top: 20 })

warn "rc1.add p0:", rc1.add p0
warn "rc2.add bp2:", rc2.add vp2

warn "sc.add vp1:", sc.add vp1
warn "sc.add ss1:", sc.add ss1
warn "sc.add rc1:", sc.add rc1
warn "sc.add rc2:", sc.add rc2

warn "rc1.findChild Inheritable Viewport:", findChild rc1, Viewport, on
warn "rc2.findChild Inheritable Viewport:", findChild rc2, Viewport, on

warn "sc.findChild Inheritable ShaderSource:", findChild rc2, Viewport, on
