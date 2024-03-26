import { Pointer, OffsetPointer } from "./pointer.js"

#? --------------------------------------------- ?#
#?                 Context Context                    ?#
#? --------------------------------------------- ?#

class Context extends Pointer.Float32Array

INDEX_CONTEXT_GL     = Context.ialloc Uint32Array
INDEX_CONTEXT_CANVAS = Context.ialloc Uint32Array

OFFSET_VIEWPORT      = 0

Object.defineProperties Context,

    byteLength      :

        value       : 4 * 24

Object.defineProperties Context::,

    init            :
        value       : ->
            @createCanvas()
            @createContext()
            @appendChild()
            @setViewport()

    add             :
        value       : ( ptr ) ->
            ptr.setParent( this ).gl = @getContext() ; this

    setViewport     :
        value       : ( fullscreen = on ) ->
            if  fullscreen is on
                left   = 0   
                top    = 0              
                width  = innerWidth
                height = innerHeight

            aRatio = width / height
            pRatio = devicePixelRatio ? 1

            @canvas.style.width  = CSS.px width
            @canvas.style.height = CSS.px height

            @canvas.width  = width * pRatio
            @canvas.height = height * pRatio

            @gl.viewport(
                @viewport.left   = left
                @viewport.top    = top
                @viewport.width  = width
                @viewport.height = height
            )

    appendChild     :
        value       : ->
            document.body.appendChild @canvas

    createCanvas    :
        value       : -> @canvas = document.createElement "canvas"
    
    createContext   :
        value       : -> this.gl = @canvas.getContext "webgl2"


Object.defineProperties Context::,

    getCanvas       :
        value       : -> @loadUint32  INDEX_CONTEXT_CANVAS

    setCanvas       :
        value       : -> @storeUint32 INDEX_CONTEXT_CANVAS, arguments[0]

    getContext      :
        value       : -> @loadUint32  INDEX_CONTEXT_GL

    setContext      :
        value       : -> @storeUint32 INDEX_CONTEXT_GL, arguments[0]

Object.defineProperties Context::,

    gl              :
        get         : -> @proxy @getContext()
        set         : -> @setContext @store arguments[0]

    canvas          :
        get         : -> @proxy @getCanvas()
        set         : -> @setCanvas @store arguments[0]

    viewport        :
        get         : -> new Viewport @offset OFFSET_VIEWPORT

class Viewport extends OffsetPointer

OFFSET_WIDTH        = 4 * 0

OFFSET_HEIGHT       = 4 * 1

OFFSET_TOP          = 4 * 2

OFFSET_LEFT         = 4 * 3

Object.defineProperties Viewport.scopei()::,

    width           :
        get         : -> @getFloat32 OFFSET_WIDTH
        set         : -> @setFloat32 OFFSET_WIDTH   , arguments[0]

    height          :
        get         : -> @getFloat32 OFFSET_HEIGHT
        set         : -> @setFloat32 OFFSET_HEIGHT  , arguments[0]

    top             :
        get         : -> @getFloat32 OFFSET_TOP
        set         : -> @setFloat32 OFFSET_TOP     , arguments[0]

    left            :
        get         : -> @getFloat32 OFFSET_LEFT
        set         : -> @setFloat32 OFFSET_LEFT    , arguments[0]


class Program extends Pointer

INDEX_PROGRAM_GL    = Program.ialloc Uint32Array
INDEX_PROGRAM_LINK  = Program.ialloc Uint32Array

Object.defineProperties Program::,

    createProgram   :
        value       : -> @program = @gl.createProgram()

Object.defineProperties Program::,

    getProgram      :
        value       : -> @loadUint32  INDEX_PROGRAM_LINK

    setProgram      :
        value       : -> @storeUint32 INDEX_PROGRAM_LINK, arguments[0]

    getContext      :
        value       : -> @loadUint32  INDEX_PROGRAM_GL

    setContext      :
        value       : -> @storeUint32 INDEX_PROGRAM_GL, arguments[0]

Object.defineProperties Program::,

    program         :
        get         : -> @proxy @getProgram()
        set         : -> @setProgram @store arguments[0]

    gl              :
        get         : -> @proxy @getContext()
        set         : -> @createProgram @setContext arguments[0]

export { Context as default, Context, Program, Viewport }