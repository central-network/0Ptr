import { parent } from "./window.coffee"

#? hello world <3
export class Pointer            extends Number
export class PtriArray          extends Array
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
export class ProgramSource      extends Text
export class VertexShader       extends Pointer
export class ComputeShader      extends Pointer
export class FragmentShader     extends Pointer
export class Program            extends Text
export class EventHandler       extends Pointer
export class RenderingContext   extends Pointer
export class DrawBuffer         extends Pointer
export class VertexArray        extends Text
export class VertexAttribute    extends Text
export class Uniform            extends Text
export class CPU                extends Text
export class GPU                extends Pointer

export default classes = new Object {
    Scene, DrawCall, Viewport, ClearColor, ClearMask, 
    Color, Scale, Rotation, Position, Vertices, 
    Mesh, Id, ProgramSource, VertexShader, FragmentShader, 
    EventHandler, Program, RenderingContext, VertexArray, 
    VertexAttribute, Uniform, CPU, GPU, PtriArray
}

GL2KEY = Object.keys     WebGL2RenderingContext
GL2VAL = Object.values   WebGL2RenderingContext
GL2NUM = new Object

{log,warn,error,table,debug,delay} = console

sab = new SharedArrayBuffer 1e7
dvw = new DataView sab
ui8 = new Uint8Array sab
u32 = new Uint32Array sab
iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] is 1
BPE = 4

#? <----------------------------------------> ?#
#? <----------------------------------------> ?#
#? <----------------------------------------> ?#

POINTER_LENGTH              = 16
POINTER_BYTELENGTH          = BPE * POINTER_LENGTH

PTR_CLASSINDEX              = 0 * BPE
PTR_PARENT                  = 1 * BPE
PTR_LINKED                  = 2 * BPE

PTR_BYTEOFFSET              = 3 * BPE
PTR_BYTELENGTH              = 4 * BPE

SCENE_DEFAULT_CONTEXT       = 5 * BPE

DRAWBUFFER_GLOBJECT         = 5 * BPE
DRAWBUFFER_ISBINDED         = 6 * BPE
DRAWBUFFER_BINDBINDING      = DRAWBUFFER_ISBINDED + 1
DRAWBUFFER_TARGET           = DRAWBUFFER_ISBINDED + 2

DRAWCALL_DBUFFER            = 5 * BPE
DRAWCALL_TARGET             = 6 * BPE
DRAWCALL_USAGE              = DRAWCALL_TARGET + 2
DRAWCALL_RCONTEXT           = 7 * BPE

PROGRAM_GLPROGRAM           = 5 * BPE
PROGRAM_USEBINDING          = PROGRAM_GLPROGRAM + 1
PROGRAM_ISINUSE             = PROGRAM_GLPROGRAM + 2
PROGRAM_VAOBINDING          = PROGRAM_GLPROGRAM + 3
PROGRAM_SHADER_SOURCE       = 7 * BPE

SHADER_SOURCE_BYTES_PERP    = 5 * BPE

ATTRIBUTE_LOCATION          = 5 * BPE
ATTRIBUTE_SIZE              = ATTRIBUTE_LOCATION + 1
ATTRIBUTE_TYPE              = ATTRIBUTE_LOCATION + 2
ATTRIBUTE_NORMALIZED        = 6 * BPE
ATTRIBUTE_STRIDE            = ATTRIBUTE_NORMALIZED + 1
ATTRIBUTE_OFFSET            = ATTRIBUTE_NORMALIZED + 2
ATTRIBUTE_BYTES_PERP        = ATTRIBUTE_NORMALIZED + 3
ATTRIBUTE_KIND              = 7 * BPE

UNIFORM_SIZE                = 5 * BPE
UNIFORM_BYTELENGTH          = UNIFORM_SIZE + 1
UNIFORM_TYPE                = 6 * BPE
UNIFORM_KIND                = UNIFORM_TYPE + 2

RENDERING_CONTEXT_GLOBJECT  = 5 * BPE
RENDERING_CONTEXT_VIEWPORT  = 6 * BPE
RENDERING_CONTEXT_DPROGRAM  = 7 * BPE
RENDERING_CONTEXT_DBUFFER   = 8 * BPE
RENDERING_CONTEXT_DRAWCALL  = 9 * BPE

VIEWPORT_X                  = 3 * BPE # PTR_BYTEOFFSET #? HAS NO BYTEOFFSET
VIEWPORT_Y                  = 4 * BPE # PTR_BYTEOFFSET #? HAS NO BYTEOFFSET
VIEWPORT_TOP                = 5 * BPE 
VIEWPORT_LEFT               = 6 * BPE 
VIEWPORT_WITDH              = 7 * BPE 
VIEWPORT_HEIGHT             = 8 * BPE 
VIEWPORT_ASPECT_RATIO       = 9 * BPE
VIEWPORT_PIXEL_RATIO        = 10 * BPE

#? <----------------------------------------> ?#
#? <----------------------------------------> ?#
#? <----------------------------------------> ?#

assign = Object.assign
define = Object.defineProperties
getown = Object.getOwnPropertyDescriptor
encode = TextEncoder::encode.bind new TextEncoder
decode = TextDecoder::decode.bind new TextDecoder
palloc = Atomics.add.bind Atomics, u32, 0, POINTER_BYTELENGTH
malloc = Atomics.add.bind Atomics, u32, 1

export storage = new (class Storage extends Array
    constructor     : -> super( arguments... ).add null
    findByName      : -> @find((i) => i and i.name is arguments[0])
    fillFirstEmpty  : (o) -> @[ i = @findIndex((v, j) -> j && !v) ] = o ; i
    pushOrFindIndex : (o) -> i += @push o if -1 is i = @indexOf o ; i
    add             : (o) -> @[ @length ] = o ; this ) 0xff

#* <----------------------------------------> *#
#* <----------------------------------------> *#
#* <----------------------------------------> *#

keyOfWebGL2     = ( type ) ->
    return type if (type < 256) or (type > 65536)
    return type if /\s+/.test "#{type}"
    return type if "#{type}" isnt "#{type}".toUpperCase()

    switch typeof type
        when "number" then name = GL2KEY.at GL2VAL.indexOf type
        when "string" then type = GL2VAL.at GL2KEY.indexOf name = type
        else return type

    GL2NUM[ name + type ] ||= eval "new (class #{name} extends Number {})(#{type})"

addListener     = ( element, event, handler ) ->
    element.addEventListener event, handler ; element

hitListener     = ( element, event, detail ) ->
    element.dispatchEvent new CustomEvent event, { detail }

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
        setTimeout( fn.bind( this, arguments... ), 40 )

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

getPtriUint16   = ( byteOffset ) ->
    dvw.getUint16  byteOffset, iLE

setPtriUint16   = ( byteOffset, value ) ->
    dvw.setUint16  byteOffset, value, iLE ; value

getPtriFloat32  = ( byteOffset ) ->
    dvw.getFloat32 byteOffset, iLE

setPtriFloat32  = ( byteOffset, value ) ->
    dvw.setFloat32 byteOffset, value, iLE ; value

storeForUint8   = ( any ) ->
    if -1 isnt i = storage.indexOf any
        return i

    i = 0
    max = 0xff
    while i++ < max
        return i if storage[i] is any
        continue if storage[i]
        return i if storage[i] = any 

    throw /STORE_FOR_UINT8/

storeForUint32  = ( any ) ->
    if -1 isnt i = storage.indexOf any
        return i

    i = 0xff
    max = 0xffffffff
    while i++ < max
        return i if storage[i] is any
        continue if storage[i]
        return i if storage[i] = any 

    throw /STORE_FOR_UINT32/

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

ptrByteCompare  = ( ptri, ptrj ) ->
    return 0 unless ptri - ptrj #non-same

    byteLengthA = getByteLength ptri
    byteLengthB = getByteLength ptrj

    return 0 if byteLengthA - i = byteLengthB

    byteOffsetA = getByteOffset ptri
    byteOffsetB = getByteOffset ptrj

    while i-- then return 0 if (
        dvw.getUint8( byteOffsetA + i ) -
        dvw.getUint8( byteOffsetB + i )
    )

    1

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

findChilds      = ( ptri, Class, construct = on ) ->
    ptrj = Atomics.load u32
    clsi = storage.indexOf Class
    list = new PtriArray ; i = 0

    if !ptri
        if !construct
            while ptrj -= POINTER_BYTELENGTH
                continue if clsi - getClassIndex ptrj
                list[ i++ ] = ptrj

        else
            while ptrj -= POINTER_BYTELENGTH
                continue if clsi - getClassIndex ptrj
                list[ i++ ] = ptr_Pointer ptrj

    else
        if !construct
            while ptrj -= POINTER_BYTELENGTH
                continue if ptri - getParent ptrj
                continue if clsi - getClassIndex ptrj
                list[ i++ ] = ptrj
        else    
            while ptrj -= POINTER_BYTELENGTH
                continue if ptri - getParent ptrj
                continue if clsi - getClassIndex ptrj
                list[ i++ ] = ptr_Pointer ptrj

    return list

findPointer     = ( test, Class ) ->
    ptrj = Atomics.load u32

    if !Class
        while ptrj -= POINTER_BYTELENGTH
            return ptr if test ptr = ptr_Pointer ptrj
        return undefined

    else
        clsi = storage.indexOf Class
        while ptrj -= POINTER_BYTELENGTH
            continue if clsi - getClassIndex ptrj
            return ptr if test ptr = ptr_Pointer ptrj
    return undefined

#* <----------------------------------------> *#
#* <----------------------------------------> *#
#* <----------------------------------------> *#
    
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
define PtriArray::          , last              :
    value : -> this[ this.length - 1 ]
define Scene::              , setDefaultContext :
    value : ( ptri ) ->
        setPtriUint32 this + SCENE_DEFAULT_CONTEXT, ptri
define Scene::              , getDefaultContext :
    value : ->
        if !ptri = getPtriUint32 this + SCENE_DEFAULT_CONTEXT
            if !ptri = findChilds( this, RenderingContext ).last()
                addChildren this, ptri = new_Pointer RenderingContext 
            setPtriUint32 this + SCENE_DEFAULT_CONTEXT, ptri
        new RenderingContext ptri
define DrawBuffer::         , glObject          :
    get : ->
        if !stri = getPtriUint32 this + DRAWBUFFER_GLOBJECT
            stri = storeForUint32 @parent.glObject.createBuffer()
            setPtriUint32 this + DRAWBUFFER_GLOBJECT, stri
        storage[ stri ]
define DrawBuffer::         , bind              :
    value : ->
        if !getPtriUint8 this + DRAWBUFFER_ISBINDED
            setPtriUint8 this + DRAWBUFFER_ISBINDED, 1

            ptri = +this

            for ptrj in findChilds @parent, DrawBuffer, construct = no
                setPtriUint8 ptrj + DRAWBUFFER_ISBINDED, 0 if ptri - ptrj

            if !stri = getPtriUint8 ptri + DRAWBUFFER_BINDBINDING
                gl = @parent.glObject
                fn = gl.bindBuffer.bind gl, @target, @glObject
                setPtriUint8 ptri + DRAWBUFFER_BINDBINDING, stri = storeForUint8 fn

            storage[ stri ]()
        1
define DrawBuffer::         , debug             :
    get : -> Object.defineProperties this,
        bind : get : @bind
define DrawBuffer::         , isBinded          :
    enumerable : on
    get : -> getPtriUint8 this + DRAWBUFFER_ISBINDED
define DrawBuffer::         , target            :
    enumerable : on
    set : ->
        setPtriUint16 this + DRAWBUFFER_TARGET, arguments[0]
    get : ->
        if !target = getPtriUint16 this + DRAWBUFFER_TARGET
            return @target = keyOfWebGL2 "ARRAY_BUFFER"
        keyOfWebGL2 target        
define DrawCall::           , target            :
    enumerable : on
    set : ->
        setPtriUint16 this + DRAWCALL_TARGET, arguments[0]
    get : ->
        if !target = getPtriUint16 this + DRAWCALL_TARGET
            return @target = keyOfWebGL2 "ARRAY_BUFFER"
        keyOfWebGL2 target
define DrawCall::           , usage             :
    enumerable : on
    set : ->
        setPtriUint16 this + DRAWCALL_USAGE, arguments[0]
    get : ->
        if !usage = getPtriUint16 this + DRAWCALL_USAGE
            return @usage = keyOfWebGL2 "STATIC_DRAW"
        keyOfWebGL2 usage
define DrawCall::           , renderingContext  :
    enumerable : on
    get : ->
        if !ptri = getPtriUint32 this + DRAWCALL_RCONTEXT
            
            ptrj = +this
            ctxi = 0
            clsi = storage.indexOf RenderingContext

            while ptrj
                if !ptrk = getParent ptrj
                    if  ptrk = ptr_Pointer( ptrj ).defaultContext
                        ctxi = ptrk
                        break
                    throw /DRAW_CALLS_CTX/
                
                ptrj = ptrk
                continue if clsi - getClassIndex ptrj

                ctxi = ptrj
                break

            if !ctxi
                scni = findPointer( (-> 1), Scene )
                if !ctxi = scni.defaultContext
                    throw /DRAW_CALLS_CTX/

            if !ptri = setPtriUint32 this + DRAWCALL_RCONTEXT, ctxi
                throw /DRAW_CALLS_CTX/

        new RenderingContext ptri
define DrawCall::           , drawBuffer        :
    enumerable : on
    get : ->
        if !ptri = getPtriUint32 this + DRAWCALL_DBUFFER

            if !getPtriUint16 this + DRAWCALL_TARGET
                { target, usage, drawBuffer } =
                    @renderingContext.defaultDrawCall

                setPtriUint32 this + DRAWCALL_DBUFFER, drawBuffer
                setPtriUint16 this + DRAWCALL_TARGET, target
                setPtriUint16 this + DRAWCALL_USAGE, usage

            else
                if  bufi = @renderingContext.defaultBuffer
                    unless bufi.target - this.target
                        setPtriUint32 this + DRAWCALL_DBUFFER, bufi

                for bufi in findChilds @renderingContext, DrawBuffer
                    unless bufi.target - this.target
                        setPtriUint32 this + DRAWCALL_DBUFFER, bufi
                        break
               
            if !ptri = getPtriUint32 this + DRAWCALL_DBUFFER
                throw /DRAW_CALLS_BUFFER/

        new DrawBuffer ptri
define RenderingContext::   , defaultBuffer     :
    enumerable : on
    set : ->
        setPtriUint32 this + RENDERING_CONTEXT_DBUFFER, arguments[0]
    get : ->
        if !ptri = getPtriUint32 this + RENDERING_CONTEXT_DBUFFER
            if !ptri = findChilds( this, DrawBuffer ).last()
                addChildren this , ptri = new_Pointer DrawBuffer
            setPtriUint32 this + RENDERING_CONTEXT_DBUFFER, ptri
        new DrawBuffer ptri
define RenderingContext::   , defaultProgram    :
    enumerable : on
    set : ->
        setPtriUint32 this + RENDERING_CONTEXT_DPROGRAM, arguments[0]
    get : ->
        if !ptri = getPtriUint32 this + RENDERING_CONTEXT_DPROGRAM
            if !ptri = findChilds( this, Program ).last()
                addChildren this, ptri = new_Pointer Program
                ptri.name = "default"
            setPtriUint32 this + RENDERING_CONTEXT_DPROGRAM, ptri
        new Program ptri
define RenderingContext::   , defaultDrawCall   :
    enumerable : on
    set : ->
        setPtriUint32 this + RENDERING_CONTEXT_DRAWCALL, arguments[0]
    get : ->
        if !ptri = getPtriUint32 this + RENDERING_CONTEXT_DRAWCALL
            if !ptri = findChilds( this, DrawCall ).last()
                addChildren this, ptri = new_Pointer DrawCall

                setPtriUint32 ptri + DRAWCALL_DBUFFER, @defaultBuffer
                setPtriUint16 ptri + DRAWCALL_TARGET, @defaultBuffer.target
                setPtriUint16 ptri + DRAWCALL_USAGE, keyOfWebGL2 "STATIC_DRAW"
                
            setPtriUint32 this + RENDERING_CONTEXT_DRAWCALL, ptri
        new DrawCall ptri
define RenderingContext::   , glObject          :
    get : ->
        if !stri = getPtriUint8 this + RENDERING_CONTEXT_GLOBJECT
            node = appendElement createElement "canvas"
            stri = storeForUint8 node.getContext "webgl2"

            setPtriUint8 this + RENDERING_CONTEXT_GLOBJECT, stri

            addListener window, "resize", @onresize.bind this
            hitListener window, "resize", node

        storage[ stri ]
define RenderingContext::   , canvas            :
    get   : -> @glObject.canvas
define RenderingContext::   , onresize          :
    value : hitOnTimeout ->
        canvas = arguments[0].detail or @canvas

        {   top, left,
            width, height,
            pixelRatio
        } = @viewport

        assign canvas,
            width       : pixelRatio * width
            height      : pixelRatio * height

        assign canvas.style,
            position   : "fixed"
            top        : "#{top}px"
            left       : "#{left}px"
            width      : "#{width}px"
            height     : "#{height}px"

        @
define RenderingContext::   , getParameters     :
    value : ->
        gl = @glObject ; parameters = {} ; for pname in "
        RENDERER VENDOR VERSION VIEWPORT FRONT_FACE CURRENT_PROGRAM CULL_FACE CULL_FACE_MODE BLEND BLEND_COLOR
        READ_BUFFER COPY_READ_BUFFER_BINDING COPY_WRITE_BUFFER_BINDING DRAW_FRAMEBUFFER_BINDING PACK_SKIP_ROWS
        FRAGMENT_SHADER_DERIVATIVE_HINT SAMPLE_COVERAGE SAMPLER_BINDING TEXTURE_BINDING_2D_ARRAY RED_BITS
        MAX_3D_TEXTURE_SIZE MAX_ARRAY_TEXTURE_LAYERS MAX_CLIENT_WAIT_TIMEOUT_WEBGL MAX_COLOR_ATTACHMENTS 
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS MAX_COMBINED_UNIFORM_BLOCKS MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS 
        MAX_DRAW_BUFFERS MAX_ELEMENT_INDEX MAX_ELEMENTS_INDICES MAX_ELEMENTS_VERTICES MAX_FRAGMENT_INPUT_COMPONENTS 
        MAX_FRAGMENT_UNIFORM_BLOCKS MAX_FRAGMENT_UNIFORM_COMPONENTS MAX_PROGRAM_TEXEL_OFFSET MAX_SAMPLES 
        MAX_SERVER_WAIT_TIMEOUT MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS SAMPLE_ALPHA_TO_COVERAGE
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS MAX_UNIFORM_BLOCK_SIZE 
        MAX_UNIFORM_BUFFER_BINDINGS MAX_TEXTURE_LOD_BIAS MAX_VARYING_COMPONENTS MAX_VERTEX_OUTPUT_COMPONENTS 
        MAX_VERTEX_UNIFORM_BLOCKS MAX_VERTEX_UNIFORM_COMPONENTS MIN_PROGRAM_TEXEL_OFFSET PACK_ROW_LENGTH 
        PIXEL_PACK_BUFFER_BINDING PIXEL_UNPACK_BUFFER_BINDING RASTERIZER_DISCARD READ_FRAMEBUFFER_BINDING    
        TEXTURE_BINDING_3D TRANSFORM_FEEDBACK_ACTIVE TRANSFORM_FEEDBACK_BINDING TRANSFORM_FEEDBACK_BUFFER_BINDING 
        TRANSFORM_FEEDBACK_PAUSED UNIFORM_BUFFER_BINDING UNIFORM_BUFFER_OFFSET_ALIGNMENT UNPACK_IMAGE_HEIGHT 
        UNPACK_ROW_LENGTH UNPACK_SKIP_IMAGES UNPACK_SKIP_PIXELS UNPACK_SKIP_ROWS VERTEX_ARRAY_BINDING ACTIVE_TEXTURE 
        ALIASED_LINE_WIDTH_RANGE ALIASED_POINT_SIZE_RANGE ALPHA_BITS ARRAY_BUFFER_BINDING BLEND_DST_ALPHA BLEND_DST_RGB 
        BLEND_EQUATION BLEND_EQUATION_ALPHA BLEND_EQUATION_RGB BLEND_SRC_ALPHA BLEND_SRC_RGB BLUE_BITS COLOR_CLEAR_VALUE 
        COLOR_WRITEMASK COMPRESSED_TEXTURE_FORMATS DEPTH_BITS DEPTH_CLEAR_VALUE DEPTH_FUNC DEPTH_RANGE DEPTH_TEST DITHER 
        ELEMENT_ARRAY_BUFFER_BINDING FRAMEBUFFER_BINDING GENERATE_MIPMAP_HINT GREEN_BITS IMPLEMENTATION_COLOR_READ_FORMAT 
        IMPLEMENTATION_COLOR_READ_TYPE LINE_WIDTH MAX_COMBINED_TEXTURE_IMAGE_UNITS MAX_CUBE_MAP_TEXTURE_SIZE 
        MAX_FRAGMENT_UNIFORM_VECTORS MAX_RENDERBUFFER_SIZE MAX_TEXTURE_IMAGE_UNITS DEPTH_WRITEMASK PACK_SKIP_PIXELS
        MAX_TEXTURE_SIZE MAX_VARYING_VECTORS MAX_VERTEX_ATTRIBS MAX_VERTEX_TEXTURE_IMAGE_UNITS SAMPLES SCISSOR_BOX
        MAX_VIEWPORT_DIMS PACK_ALIGNMENT POLYGON_OFFSET_FACTOR POLYGON_OFFSET_FILL POLYGON_OFFSET_UNITS  
        RENDERBUFFER_BINDING SAMPLE_BUFFERS SAMPLE_COVERAGE_INVERT SAMPLE_COVERAGE_VALUE MAX_VERTEX_UNIFORM_VECTORS 
        SCISSOR_TEST SHADING_LANGUAGE_VERSION STENCIL_BACK_FAIL STENCIL_BACK_FUNC STENCIL_BACK_PASS_DEPTH_FAIL 
        STENCIL_BACK_PASS_DEPTH_PASS STENCIL_BACK_REF STENCIL_BACK_VALUE_MASK STENCIL_BACK_WRITEMASK STENCIL_BITS 
        STENCIL_CLEAR_VALUE STENCIL_FAIL STENCIL_FUNC STENCIL_PASS_DEPTH_FAIL STENCIL_PASS_DEPTH_PASS STENCIL_REF 
        STENCIL_TEST STENCIL_VALUE_MASK STENCIL_WRITEMASK SUBPIXEL_BITS TEXTURE_BINDING_2D TEXTURE_BINDING_CUBE_MAP 
        UNPACK_ALIGNMENT UNPACK_COLORSPACE_CONVERSION_WEBGL UNPACK_FLIP_Y_WEBGL UNPACK_PREMULTIPLY_ALPHA_WEBGL
        ".split(/\n|\r\n|\s+|\t/g).filter(Boolean) then parameters[ pname ] = gl.getParameter gl[ pname ] 

        for i in [ 0 ... parameters.MAX_DRAW_BUFFERS ]
            DRAW_BUFFERi = "DRAW_BUFFER#{i}"
            parameters[ DRAW_BUFFERi ] = gl.getParameter gl[ DRAW_BUFFERi ]

        for pname, value of parameters
            parameters[ pname ] = keyOfWebGL2 value

        parameters
define RenderingContext::   , getViewport       :
    value : ->
        if !ptrj = getPtriUint32 this + RENDERING_CONTEXT_VIEWPORT
            if !ptrj = findChild this , Viewport, inherit = on
                return addChildren this , new_Pointer Viewport
            return @setViewport ptrj
        return new Viewport ptrj
define RenderingContext::   , setViewport       :
    value : ( ptrj ) ->
        setPtriUint32 this + RENDERING_CONTEXT_VIEWPORT, ptrj
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
define Program::            , debug             :
    get : -> Object.defineProperties this,
        useProgram          : get : @use
        bindVertexArray     : get : @bindVertexArray
define Program::            , inUse             :
    enumerable : on,
    get : -> getPtriUint8 this + PROGRAM_ISINUSE
define Program::            , use               :
    value : ->
        if !getPtriUint8 this + PROGRAM_ISINUSE
            setPtriUint8 this + PROGRAM_ISINUSE, 1

            ptri = +this
            for ptrj in findChilds @parent, Program, construct = no
                setPtriUint8 ptrj + PROGRAM_ISINUSE, 0 if ptri - ptrj

            if !stri = getPtriUint8 ptri + PROGRAM_USEBINDING
                stri = setPtriUint8 ptri + PROGRAM_USEBINDING,
                    storeForUint8 @parent.glObject.useProgram.bind(
                        @parent.glObject, @glObject
                    )

            storage[ stri ]()
        1
define Program::            , name              :
    enumerable : on
    get : -> decode sliceUint8 this
    set : Text::set
define Program::            , glObject          :
    get : ->
        if !stri = getPtriUint8 this + PROGRAM_GLPROGRAM
            gl = @parent.glObject

            #? create vertex shader ------------> 
            vSource = @source.vertexShader
            vShader = gl.createShader gl.VERTEX_SHADER 
    
            gl.shaderSource vShader, vSource
            gl.compileShader vShader
    
            unless gl.getShaderParameter vShader, gl.COMPILE_STATUS
                info = gl.getShaderInfoLog vShader
                gl.deleteShader vShader
                throw "Could not compile vertex shader. \n\n#{info}, \nsource:#{vSource}"

            #? create fragment shader ----------->
            fSource = @source.fragmentShader
            fShader = gl.createShader gl.FRAGMENT_SHADER 
    
            gl.shaderSource fShader, fSource
            gl.compileShader fShader
    
            unless gl.getShaderParameter fShader, gl.COMPILE_STATUS
                info = gl.getShaderInfoLog fShader
                gl.deleteShader vShader
                gl.deleteShader fShader
                throw "Could not compile vertex shader. \n\n#{info}, \nsource:#{vSource}"
    
            #? create program and link ----------->
            program = gl.createProgram()
            
            gl.attachShader program, vShader
            gl.attachShader program, fShader
            gl.linkProgram program
    
            unless gl.getProgramParameter program, gl.LINK_STATUS
                info = gl.getProgramInfoLog program
                gl.deleteShader vShader
                gl.deleteShader fShader
                gl.deleteProgram program
                throw "Could not compile WebGL program. \n\n#{info}"

            stri = storeForUint8 program
            setPtriUint8 this + PROGRAM_GLPROGRAM, stri
        storage[ stri ]
define Program::            , bindVertexArray   :
    value : ->
        if !vaoi = getPtriUint8 this + PROGRAM_VAOBINDING
            
            gl2p = @parent.glObject
            varr = @source.vertexArray
            vaoi = storeForUint8 varr.bound gl2p

            setPtriUint8 this + PROGRAM_VAOBINDING, vaoi
        storage[ vaoi ]()
define Program::            , getSource         :
    value : ->
        if !ptrj = getPtriUint32 this + PROGRAM_SHADER_SOURCE
            test = ptrByteCompare.bind null, this 
            if !ptrj = findPointer test, ProgramSource
                return undefined
            return @setSource ptrj            
        return new ProgramSource ptrj
define Program::            , setSource         :
    value : ->
        setPtriUint32 this + PROGRAM_SHADER_SOURCE, arguments[0]
define Mesh::               , TypedArray        :
    value : Float32Array
define Mesh::               , getPointCount     :
    value : ->
define Mesh::               , getDrawingState   :
    value : ->
define Mesh::               , getVertices       :
    value : ->
define Mesh::               , setVertices       :
    value : ->
define Mesh::               , getPosition       :
    value : ->
define Mesh::               , getRotation       :
    value : ->
define Mesh::               , getScale          :
    value : ->
define Mesh::               , getDrawCalls      :
    value : ->
define Mesh::               , getIsVisible      :
    value : ->
define Mesh::               , getDrawWeight     :
    value : ->
define Mesh::               , getInstanceCount  :
    value : ->
define Mesh::               , getColor          :
    value : ->
define Mesh::               , getNeedsUpdate    :
    value : ->
define Mesh::               , modifierMatrix    :
    enumerable: on,
    get : ->
define Uniform              , getLocation       :
    value : ( program, name ) ->
        program.parent.glObject
            .getUniformLocation program.glObject, name
define Uniform::            , name              :
    enumerable : on
    get : -> decode sliceUint8 this
    set : Text::set
define Uniform::            , size              :
    enumerable : on
    get : -> getPtriUint8 this + UNIFORM_SIZE
    set : -> setPtriUint8 this + UNIFORM_SIZE, arguments[0]
define Uniform::            , byteLength        :
    enumerable : on
    get : -> getPtriUint8 this + UNIFORM_BYTELENGTH
    set : -> setPtriUint8 this + UNIFORM_BYTELENGTH, arguments[0]
define Uniform::            , type              :
    enumerable : on
    get : -> keyOfWebGL2 getPtriUint16 this + UNIFORM_TYPE
    set : -> setPtriUint16 this + UNIFORM_TYPE, arguments[0]
define Uniform::            , getUploadFunc     :
    value : ->
        uploadFn = "uniform"
        kindName = @kind.constructor.name

        N = (kindName.match(/\d+/g) or [1]).join("x")

        if  /MAT/.test kindName
            return "uniformMatrix#{N}fv"
            
        if  /(UNSIGNED_INT_*VEC)/.test kindName
            return "uniform#{N}uiv"
            
        if  /(UNSIGNED_INT)/.test kindName
            return "uniform#{N}ui"

        if  /(INT_*VEC)/.test kindName
            return "uniform#{N}iv"
            
        if  /(FLOAT_*VEC)/.test kindName
            return "uniform#{N}fv"
            
        if  /(FLOAT)/.test kindName
            return "uniform#{N}f"

        if  /(INT)/.test kindName
            return "uniform#{N}i"

        throw /UNIFORM_ERR/
define Uniform::            , kind              :
    enumerable : on
    get : -> keyOfWebGL2 getPtriUint16 this + UNIFORM_KIND
    set : -> setPtriUint16 this + UNIFORM_KIND, arguments[0]
define VertexAttribute::    , name              :
    enumerable : on
    get : -> decode sliceUint8 this
    set : Text::set
define VertexAttribute      , getLocation       :
    value : ( program, name ) ->
        gl = program.parent.glObject
        gl . getAttribLocation program.glObject, name
define VertexAttribute::    , getLocation       :
    value : ( program ) -> 
        getPtriUint8 this + ATTRIBUTE_LOCATION
define VertexAttribute::    , setLocation       :
    value : ->
        setPtriUint8 this + ATTRIBUTE_LOCATION, arguments[0]
define VertexAttribute::    , size              :
    enumerable : on
    get : -> getPtriUint8 this + ATTRIBUTE_SIZE
    set : -> setPtriUint8 this + ATTRIBUTE_SIZE, arguments[0]
define VertexAttribute::    , type              :
    enumerable : on
    get : -> keyOfWebGL2 getPtriUint16 this + ATTRIBUTE_TYPE
    set : -> setPtriUint16 this + ATTRIBUTE_TYPE, arguments[0]
define VertexAttribute::    , normalized        :
    enumerable : on
    get : -> Boolean getPtriUint8 this + ATTRIBUTE_NORMALIZED
    set : -> setPtriUint8 this + ATTRIBUTE_NORMALIZED, arguments[0]
define VertexAttribute::    , stride            :
    enumerable : on
    get : -> getPtriUint8 this + ATTRIBUTE_STRIDE
    set : -> setPtriUint8 this + ATTRIBUTE_STRIDE, arguments[0]
define VertexAttribute::    , offset            :
    enumerable : on
    get : -> getPtriUint8 this + ATTRIBUTE_OFFSET
    set : -> setPtriUint8 this + ATTRIBUTE_OFFSET, arguments[0]
define VertexAttribute::    , BYTES_PER_POINT   :
    get : -> getPtriUint8 this + ATTRIBUTE_BYTES_PERP
    set : -> setPtriUint8 this + ATTRIBUTE_BYTES_PERP, arguments[0]
define VertexAttribute::    , kind              :
    enumerable : on
    get : -> keyOfWebGL2 getPtriUint16 this + ATTRIBUTE_KIND
    set : -> setPtriUint16 this + ATTRIBUTE_KIND, arguments[0]
define VertexAttribute::    , pointerArgs       :
    get : -> Uint16Array.of @location, @size, @type, @normalized, @stride, @offset
define VertexAttribute::    , createBinding     :
    value : ( gl ) ->
        unless gl ||= findChild( this, RenderingContext, on ).glObject
            return "NO_CONTEXT_FOUND_NEITHER_SUPPLIED"

        enableVertexAttribArray : gl.enableVertexAttribArray.bind gl, @location
        vertexAttribPointer : gl.vertexAttribPointer.bind gl, @pointerArgs...
        vertexAttribNfv : switch @size
            when 1 then gl.vertexAttrib1fv.bind gl, @location
            when 2 then gl.vertexAttrib2fv.bind gl, @location
            when 3 then gl.vertexAttrib3fv.bind gl, @location
            when 4 then gl.vertexAttrib4fv.bind gl, @location
define VertexArray::        , getAttributes     :
    value : -> findChilds @parent, VertexAttribute
define VertexArray::        , BYTES_PER_POINT   :
    get : ->
        sum = 0
        sum = sum + attr.BYTES_PER_POINT for attr in @attributes
        sum
define VertexArray::        , name              :
    enumerable : on
    get : -> decode sliceUint8 this
    set : Text::set        
define VertexArray::        , bound             :
    value : ( gl, extraCalls = [] ) ->
        unless gl then throw /NO_CONTEXT_SUPPLIED/
        else @parent.BYTES_PER_POINT
        
        vao = gl.createVertexArray()
        gl.bindVertexArray vao

        for attr in findChilds @parent, VertexAttribute, construct = on
            gl.enableVertexAttribArray attr.location
            gl.vertexAttribPointer attr.pointerArgs...

        for call in extraCalls
            call gl

        return gl.bindVertexArray.bind gl, vao
define ProgramSource::      , name              :
    enumerable : on
    get : -> decode sliceUint8 this
    set : ( name ) ->
        setPtriUint32 this + SHADER_SOURCE_BYTES_PERP, 0
        Text.prototype.set.call this, name ; this
define ProgramSource::      , vertexArray       :
    enumerable : on
    get : -> findChild this, VertexArray
define ProgramSource::      , vertexShader      :
    get : -> @documentScripts.vertexShader?.text
define ProgramSource::      , computeShader     :
    get : -> @documentScripts.computeShader?.text
define ProgramSource::      , fragmentShader    :
    get : -> @documentScripts.fragmentShader?.text
define ProgramSource::      , documentScripts   :
    get : ->
        v = queryDocument "[name=#{@name}][type*='vertex']"
        c = queryDocument "[name=#{@name}][type*='compute']"
        f = queryDocument "[name=#{@name}][type*='fragment']"

        if !v and f and $name = f.getAttribute "vertex-shader"
            v = queryDocument "[name=#{$name}][type*='vertex']"

        if !f and v and $name = v.getAttribute "fragment-shader"
            f = queryDocument "[name=#{$name}][type*='fragment']"

        vertexShader   : v
        computeShader  : c
        fragmentShader : f
define ProgramSource::      , linkedPrograms    :
    enumerable: on,
    get : ->
        ptri = +this
        findChilds( null, Program ).filter (p) -> 0 is ptri - p.source
define ProgramSource::      , BYTES_PER_POINT   :
    get : ->
        if !bpp = getPtriUint32 this + SHADER_SOURCE_BYTES_PERP
            bpp = setPtriUint32 this + SHADER_SOURCE_BYTES_PERP, @parameters.ATTRIBUTES_STRIDE
        bpp
define ProgramSource::      , findUniform       :
    value : ( name ) ->
        for attr in findChilds this, Uniform
            return attr if attr.name is name
        return
define ProgramSource::      , findVertexAttrib  :
    value : ( name ) ->
        for attr in findChilds this, VertexAttribute
            return attr if attr.name is name

        return
define ProgramSource::      , findVertexArray   :
    value : ( name ) ->
        for varr in findChilds this, VertexArray
            return varr if varr.name is name
        return
define ProgramSource::      , getParameters     :
    value : ->
        gl = new OffscreenCanvas(1,1).getContext "webgl2"

        #? create vertex shader ------------> 
        vSource = @vertexShader
        vShader = gl.createShader gl.VERTEX_SHADER 

        gl.shaderSource vShader, vSource
        gl.compileShader vShader

        unless gl.getShaderParameter vShader, gl.COMPILE_STATUS
            info = gl.getShaderInfoLog vShader
            gl.deleteShader vShader
            throw "Could not compile vertex shader. \n\n#{info}, \nsource:#{vSource}"

        #? create fragment shader ----------->
        fSource = @fragmentShader
        fShader = gl.createShader gl.FRAGMENT_SHADER 

        gl.shaderSource fShader, fSource
        gl.compileShader fShader

        unless gl.getShaderParameter fShader, gl.COMPILE_STATUS
            info = gl.getShaderInfoLog fShader
            gl.deleteShader vShader
            gl.deleteShader fShader
            throw "Could not compile vertex shader. \n\n#{info}, \nsource:#{vSource}"

        #? create program and link ----------->
        program = gl.createProgram()
        
        gl.attachShader program, vShader
        gl.attachShader program, fShader
        gl.linkProgram program

        unless gl.getProgramParameter program, gl.LINK_STATUS
            info = gl.getProgramInfoLog program
            throw "Could not compile WebGL program. \n\n#{info}"


        #* parse program parameters ---------->

        ( parameters = VERTEX_SHADER : {}, FRAGMENT_SHADER : {}, PROGRAM : {} )
        ( shaders = VERTEX_SHADER: vShader, FRAGMENT_SHADER: fShader )

        split = -> arguments[0].split( /\n|\r\n|\s+|\t/g ).filter( Boolean )

        for p in split(
            "DELETE_STATUS LINK_STATUS VALIDATE_STATUS ATTACHED_SHADERS 
             ACTIVE_ATTRIBUTES ACTIVE_UNIFORMS TRANSFORM_FEEDBACK_BUFFER_MODE 
             TRANSFORM_FEEDBACK_VARYINGS ACTIVE_UNIFORM_BLOCKS"
        ) then parameters.PROGRAM[p] = gl.getProgramParameter program, gl[p] 

        for pname, value of parameters.PROGRAM
            parameters.PROGRAM[ pname ] = keyOfWebGL2 value
        
        for s, gls of shaders then for p in split(
            "DELETE_STATUS COMPILE_STATUS SHADER_TYPE"
        ) then parameters[s][p] = gl.getShaderParameter gls, gl[p] 

        for s, gls of shaders then for pname, value of parameters[ s ]
            parameters[ s ][ pname ]        = keyOfWebGL2 value
            parameters[ s ].SHADER_SOURCE   = gl.getShaderSource gls
            parameters[ s ].INFO_LOG        = gl.getShaderInfoLog gls
            
        numAttribs = parameters.PROGRAM.ACTIVE_ATTRIBUTES
        parameters . VERTEX_ARRAY_NAME = ""
        parameters . ATTRIBUTES_STRIDE = 0
        parameters . ATTRIBUTES = while numAttribs--
            attrib = {}
            attrib[k] = v for k, v of gl.getActiveAttrib program, numAttribs

            attrib . location   = gl . getAttribLocation program, attrib.name
            attrib . normalized = gl . getVertexAttrib attrib.location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
            attrib . typename   = tn = keyOfWebGL2 attrib.kind = attrib.type                
            attrib . offset     = parameters.ATTRIBUTES_STRIDE
            attrib . isVector   = /VEC/.test tn.constructor.name
            attrib . isMatrix   = /MAT/.test tn.constructor.name
            attrib . isNumber   = !/VEC|MAT/.test tn.constructor.name

            attrib . size       = do ->
                name = tn.constructor.name
                switch ( valtyp = name.split("_").pop() ).substring 0, 3
                    when "VEC" then valtyp[3] * 1
                    when "MAT" then valtyp[3] * ( valtyp[5] || 1 )

            attrib . BYTES_PER_ATTRIBUTE = attrib . size *
                switch attrib.type = gl[ tn.constructor.name.split("_")[0] ]
                    when gl.FLOAT           then 4
                    when gl.UNSIGNED_BYTE   then 1
                    else throw /DEFINED/

            parameters . VERTEX_ARRAY_NAME += " #{attrib.name} "
            parameters . VERTEX_ARRAY_NAME  =
                parameters . VERTEX_ARRAY_NAME.trim()

            parameters . ATTRIBUTES_STRIDE +=
                attrib . BYTES_PER_ATTRIBUTE

            attrib

        for attrib in parameters . ATTRIBUTES
            continue if @findVertexAttrib attrib.name

            attribute = new_Pointer VertexAttribute
            attribute . set attrib.name

            assign attribute, {
                location : attrib.location, 
                size : attrib.size, 
                type : attrib.type,
                normalized : attrib.normalized, 
                stride : parameters . ATTRIBUTES_STRIDE,
                offset : attrib.offset
                kind : attrib.kind
                BYTES_PER_POINT : attrib.BYTES_PER_ATTRIBUTE
            }

            addChildren this, attribute


        #? uniforms -------------->

        numUniforms = parameters.PROGRAM.ACTIVE_UNIFORMS
        parameters . UNIFORMS = while numUniforms--
            uniform             = {}
            uniform[k]          = v for k, v of gl.getActiveUniform program, numUniforms
            uniform.kind        = tn = keyOfWebGL2 uniform.type            
            uniform.location    = gl.getUniformLocation program, uniform.name
            uniform.name        = uniform.name.split(/\[/)[0]
            uniform.uploader    = switch tn.constructor.name
                when "FLOAT_MAT4"           then "uniformMatrix4fv"
                when "FLOAT_MAT3"           then "uniformMatrix3fv"
                when "FLOAT_MAT2"           then "uniformMatrix2fv"
                when "FLOAT_MAT2x3"         then "uniformMatrix2x3fv"
                when "FLOAT_MAT2x4"         then "uniformMatrix2x4fv"
                when "FLOAT_MAT3x2"         then "uniformMatrix3x2fv"
                when "FLOAT_MAT3x4"         then "uniformMatrix3x4fv"
                when "FLOAT_MAT4x2"         then "uniformMatrix4x2fv"
                when "FLOAT_MAT3x3"         then "uniformMatrix4x3fv"
                when "FLOAT"                then "uniform1f"
                when "INT"                  then "uniform1iv"
                when "UNSIGNED_INT"         then "uniform1uiv"
                when "UNSIGNED_INT_VEC2"    then "uniform2uiv"
                when "UNSIGNED_INT_VEC3"    then "uniform3uiv"
                when "UNSIGNED_INT_VEC4"    then "uniform4uiv"

            uniform . type       = keyOfWebGL2(
                tn.constructor.name.replace(
                    /(_VEC|_MAT)(\d(\\x\w+))|((_VEC|_MAT)+\d+)/mg, ""
                )
            )
            
            uniform . size       = do ->
                name = tn.constructor.name
                switch ( valtyp = name.split("_").pop() ).substring 0, 3
                    when "VEC" then valtyp[3] * 1
                    when "MAT" then valtyp[3] * ( valtyp[5] || valtyp[3] )
                    else 1 

            uniform . byteLength =
                uniform . size * switch uniform.type.constructor.name
                    when "FLOAT" then 4
                    when "INT" then 2
                    else 1 

            uniform

        for u in parameters . UNIFORMS
            continue if @findUniform u.name

            uniform = new_Pointer Uniform
            assign uniform, {
                size : u.size, 
                type : u.type,
                kind : u.kind
                byteLength : u.byteLength
            }

            addChildren this, uniform.set u.name

        if !@findVertexArray parameters . VERTEX_ARRAY_NAME
            addChildren this, varr = new_Pointer VertexArray
            varr.set parameters . VERTEX_ARRAY_NAME

        gl.deleteShader vShader
        gl.deleteShader fShader
        gl.deleteProgram program
        gl=null

        parameters

palloc malloc POINTER_BYTELENGTH * 1e5

#* <----------------------------------------> *#
#* <----------------------------------------> *#
#* <----------------------------------------> *#

for name, Class of reDefine = classes

    prop = name[0].toLowerCase() + name.substring 1
    define storage.add( Class ), [ prop ] : { value : Class }
    
    for name, desc of Object.getOwnPropertyDescriptors Class::
        continue unless desc.enumerable is off
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

for Class in [ VertexArray, VertexAttribute, Uniform, Program, DrawBuffer ]
    define Class::, children : new PtriArray

#? <----------------------------------------> ?#
#? <----------------------------------------> ?#
#? <----------------------------------------> ?#

warn "sc:", sc = new_Pointer( Scene )
warn "mesh:", msh = new_Pointer( Mesh )
warn "ss1:", ss1 = new_Pointer( ProgramSource ).set("default")
warn "ss1:", ss2 = new_Pointer( ProgramSource ).set("my-avesome-vertex-shader")
warn "rc1:", rc1 = new_Pointer( RenderingContext )
warn "vp1:", vp1 = new_Pointer( Viewport )

warn "p0:", p0 = new_Pointer( Program ).set("my-avesome-vertex-shader")
warn "p1:", p1 = new_Pointer( Program ).set("default")

warn "rc2:", rc2 = new_Pointer( RenderingContext )
warn "vp2:", vp2 = Viewport.of({ width : 320, height : 240, left: 20, top: 20 })

warn "rc1.add p0:", rc1.add p0
warn "rc2.add bp2:", rc2.add vp2

warn "sc.add msh:", sc.add msh
warn "sc.add vp1:", sc.add vp1
warn "sc.add ss1:", sc.add ss1
warn "sc.add ss2:", sc.add ss2
warn "sc.add rc1:", sc.add rc1
warn "sc.add rc2:", sc.add rc2
warn "rc1.add p1:", rc1.add p1

warn "rc1.findChild Inheritable Viewport:", findChild rc1, Viewport, on
warn "rc2.findChild Inheritable Viewport:", findChild rc2, Viewport, on

warn "sc.findChild Inheritable ProgramSource:", findChild rc2, Viewport, on
warn "ss2.parameters:", ss2.parameters
warn "sc.defctx:", sc.defaultContext.defaultBuffer.bind()
warn "msh.append new_Pointer( DrawCall ):", msh.append new_Pointer( DrawCall )
