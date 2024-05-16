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

export default classes = new Object {
    Scene, DrawCall, Viewport, ClearColor, ClearMask, 
    Color, Scale, Rotation, Position, Vertices, 
    Mesh, Id, ShaderSource, VertexShader, FragmentShader, 
    EventHandler, Program, RenderingContext, VertexArray, 
    Attribute, Uniform, CPU, GPU
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

PROGRAM_GLPROGRAM           = 5 * BPE
PROGRAM_USEBINDING          = PROGRAM_GLPROGRAM + 1
PROGRAM_ISINUSE             = PROGRAM_GLPROGRAM + 2
PROGRAM_SHADER_SOURCE       = 6 * BPE

SHADER_SOURCE_BYTES_PERP    = 5 * BPE
SHADER_SOURCE_PARAMETERS    = 6 * BPE

RENDERING_CONTEXT_GLOBJECT  = 5 * BPE
RENDERING_CONTEXT_VIEWPORT  = 6 * BPE

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
    return unless ptri

    ptrj = Atomics.load u32
    clsi = storage.indexOf Class
    list = new PtriArray

    i = 0
    while ptrj -= POINTER_BYTELENGTH
        continue if ptri - getParent ptrj
        continue if clsi - getClassIndex ptrj
        if !construct then list[ i++ ] = ptrj
        else list[ i++ ] = ptr_Pointer ptrj

    return list

findPointer     = ( test ) ->
    ptrj = Atomics.load u32
    
    while ptrj -= POINTER_BYTELENGTH
        if test ptr = ptr_Pointer ptrj
            return ptr 

    return

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
        use : get : @use
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
            vSource = @shaderSource.vertexShader
            vShader = gl.createShader gl.VERTEX_SHADER 
    
            gl.shaderSource vShader, vSource
            gl.compileShader vShader
    
            unless gl.getShaderParameter vShader, gl.COMPILE_STATUS
                info = gl.getShaderInfoLog vShader
                gl.deleteShader vShader
                throw "Could not compile vertex shader. \n\n#{info}, \nsource:#{vSource}"

            #? create fragment shader ----------->
            fSource = @shaderSource.fragmentShader
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
define Program::            , getShaderSource   :
    value : ->
        if !ptrj = getPtriUint32 this + PROGRAM_SHADER_SOURCE
            if !ptrj = findPointer ptrByteCompare.bind null, this
                return undefined
            return @setShaderSource ptrj            
        return new ShaderSource ptrj
define Program::            , setShaderSource   :
    value : ->
        setPtriUint32 this + PROGRAM_SHADER_SOURCE, arguments[0]
define ShaderSource::       , name              :
    enumerable : on
    get : -> decode sliceUint8 this
    set : Text::set
define ShaderSource::       , vertexShader      :
    enumerable : on, get : -> @documentScripts.vertexShader?.text
define ShaderSource::       , computeShader     :
    enumerable : on, get : -> @documentScripts.computeShader?.text
define ShaderSource::       , fragmentShader    :
    enumerable : on, get : -> @documentScripts.fragmentShader?.text
define ShaderSource::       , documentScripts   :
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
define ShaderSource::       , parameters        :
    enumerable : on
    get : ->
        if !stri = getPtriUint32 this + SHADER_SOURCE_PARAMETERS
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


            #? parse program parameters ---------->
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
                attrib = gl.getActiveAttrib program, numAttribs

                attrib . location   = gl . getAttribLocation program, attrib.name
                attrib . normalized = gl . getVertexAttrib attrib.location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED
                attrib . typename   = tn = keyOfWebGL2 attrib.type                
                attrib . offset     = parameters.ATTRIBUTES_STRIDE
                attrib . isVector   = /VEC/.test tn.constructor.name
                attrib . isMatrix   = /MAT/.test tn.constructor.name
                attrib . isNumber   = /VEC|MAT/.test tn.constructor.name

                attrib . glsize     = do ->
                    name = tn.constructor.name
                    switch ( valtyp = name.split("_").pop() ).substring 0, 3
                        when "VEC" then valtyp[3] * 1
                        when "MAT" then valtyp[3] * ( valtyp[5] || 1 )

                attrib . BYTES_PER_ATTRIBUTE = attrib . glsize *
                    switch attrib.gltype = gl[ tn.constructor.name.split("_")[0] ]
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
                attrib . pointerArgs = [
                    attrib.location, attrib.glsize, attrib.gltype,
                    attrib.normalized, parameters . ATTRIBUTES_STRIDE,
                    attrib.offset
                ]

            gl.deleteShader vShader
            gl.deleteShader fShader
            gl.deleteProgram program
            gl=null

            stri = storeForUint32 parameters                
            setPtriUint32 this + SHADER_SOURCE_PARAMETERS, stri

        storage[ stri ]


palloc malloc POINTER_BYTELENGTH * 1e5

#* <----------------------------------------> *#
#* <----------------------------------------> *#
#* <----------------------------------------> *#

for name, Class of reDefine = classes

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

for Class, idex in noChilds = [ ShaderSource, Viewport ]
    Reflect.defineProperty Class::, "children", value: new PtriArray

#? <----------------------------------------> ?#
#? <----------------------------------------> ?#
#? <----------------------------------------> ?#

warn "sc:", sc = new_Pointer( Scene )
warn "ss1:", ss1 = new_Pointer( ShaderSource ).set("default")
warn "ss1:", ss2 = new_Pointer( ShaderSource ).set("my-avesome-vertex-shader")
warn "rc1:", rc1 = new_Pointer( RenderingContext )
warn "vp1:", vp1 = new_Pointer( Viewport )

warn "p0:", p0 = new_Pointer( Program ).set("my-avesome-vertex-shader")
warn "p1:", p1 = new_Pointer( Program ).set("default")

warn "rc2:", rc2 = new_Pointer( RenderingContext )
warn "vp2:", vp2 = Viewport.of({ width : 320, height : 240, left: 20, top: 20 })

warn "rc1.add p0:", rc1.add p0
warn "rc2.add bp2:", rc2.add vp2

warn "sc.add vp1:", sc.add vp1
warn "sc.add ss1:", sc.add ss1
warn "sc.add ss2:", sc.add ss2
warn "sc.add rc1:", sc.add rc1
warn "sc.add rc2:", sc.add rc2
warn "rc1.add p1:", rc1.add p1

warn "rc1.findChild Inheritable Viewport:", findChild rc1, Viewport, on
warn "rc2.findChild Inheritable Viewport:", findChild rc2, Viewport, on

warn "sc.findChild Inheritable ShaderSource:", findChild rc2, Viewport, on
