import { Pointer, ByteOffset, KeyBase } from "./ptr.js"
import { Controller } from "./ptr_ctrl.js"

export GLKEYS = new KeyBase WebGL2RenderingContext

GLKEYS.add COLOR_DEPTH_BUFFER_BIT :
    GLKEYS.COLOR_BUFFER_BIT |
    GLKEYS.DEPTH_BUFFER_BIT

export class Color4 extends ByteOffset

    #? matters 
        #? order        : gl.clearColor r, g, b, a
        #? because of   : gl.clearColor.apply.bind gl.clearColor, gl, new Float32Array buffer, this + clearColor, 4

    OFFSET_RED          : @malloc Float32Array

    OFFSET_GREEN        : @malloc Float32Array

    OFFSET_BLUE         : @malloc Float32Array

    OFFSET_ALPHA        : @malloc Float32Array

    OFFSET_UPDATED      : @malloc Uint8Array

    set                 : ( vec4 = [] ) ->
        [ r = 0, g = 0, b = 0, a = 1 ] = vec4
        
        @setFloat32 @OFFSET_RED     , r
        @setFloat32 @OFFSET_GREEN   , g
        @setFloat32 @OFFSET_BLUE    , b
        @setFloat32 @OFFSET_ALPHA   , a
        @storeUint8 @OFFSET_UPDATED , 0

        return @

    update              : ( fn ) ->
        return this if @updated
        fn @updated = on ; this

    @parseCSSColor      : ( rgba = "" ) ->
        [ r, g, b, a = 1] = rgba
            .replace( /^rgba?\(|\s+|\)$/g,'' )
            .split( ',' ).map( Number )

        Float32Array.of r/ 0xff, g/0xff, b/0xff, a

    Object.defineProperties this::,

        updated         :
                get     : -> @loadUint8 @OFFSET_UPDATED
                set     : -> @storeUint8 @OFFSET_UPDATED, arguments[0]

        rgb             :
                get     : -> [ ...@ui8 ]
                set     : -> @ui8 = arguments[0]

        hex             :
                get     : -> "0x" + @rgb.map((d) -> d.toString(16).padStart 2, 0 ).join("")
                set     : -> @u32 = parseInt "#{arguments[0]}".split(/x|\#/, 2).pop().padEnd(8, "ff"), 16

        u32             :
                get     : -> parseInt @hex, 16
                set     : -> @ui8 = new Uint8Array(Uint32Array.of(arguments[0]).buffer)

        css             :
                get     : -> [ r, g, b, a ] = @ui8 ; "rgba( #{r}, #{g}, #{b}, #{a/0xff} )"
                set     : -> @set Color4.parseCSSColor arguments[0]

        ui8             :
                get     : -> Uint8Array.of(
                    0xff * @getFloat32 @OFFSET_RED
                    0xff * @getFloat32 @OFFSET_GREEN
                    0xff * @getFloat32 @OFFSET_BLUE
                    0xff * @getFloat32 @OFFSET_ALPHA
                )
                set     : ->
                    @setFloat32 @OFFSET_RED,   r if !isNaN r = arguments[0] / 0xff
                    @setFloat32 @OFFSET_GREEN, g if !isNaN g = arguments[1] / 0xff
                    @setFloat32 @OFFSET_BLUE,  b if !isNaN b = arguments[2] / 0xff
                    @setFloat32 @OFFSET_ALPHA, a if !isNaN a = arguments[3] / 0xff

        f32             :
                get     : -> new Float32Array @buffer, this, 4
                set     : this::set

export class Viewport extends ByteOffset

    #? matters 
        #? order        : gl.viewport left, top, width, height
        #? because of   : gl.viewport.apply.bind gl.viewport, gl, new Float32Array buffer, this + viewport.byteOffset, 4

    OFFSET_LEFT         : @malloc Float32Array

    OFFSET_TOP          : @malloc Float32Array

    OFFSET_WIDTH        : @malloc Float32Array

    OFFSET_HEIGHT       : @malloc Float32Array

    OFFSET_MAXWIDTH     : @malloc Float32Array

    OFFSET_MAXHEIGHT    : @malloc Float32Array

    OFFSET_FULLSCREEN   : @malloc Uint8Array

    OFFSET_UPDATED      : @malloc Uint8Array

    set                 : ( rect = {} ) ->

        @left           = rect.left   if  rect.left?
        @top            = rect.top    if  rect.top?
        @width          = rect.width  if  rect.width?
        @height         = rect.height if  rect.height?
        @maxWidth       = innerWidth  if !rect.maxWidth?  and innerWidth?
        @maxHeight      = innerHeight if !rect.maxHeight? and innerHeight?
        @fullscreen     = ! Boolean @width - @maxWidth + @height - @maxHeight

        @updated = false ; this

    update              : ( fn ) ->
        return this if @updated
        fn @updated = on ; this

    Object.defineProperties this::,

        updated         :
                get     : -> @loadUint8 @OFFSET_UPDATED
                set     : -> @storeUint8 @OFFSET_UPDATED, arguments[0]

        left            :
                get     : -> @getFloat32 @OFFSET_LEFT
                set     : -> @setFloat32 @OFFSET_LEFT, arguments[0]

        top             :
                get     : -> @getFloat32 @OFFSET_TOP
                set     : -> @setFloat32 @OFFSET_TOP, arguments[0]

        width           :
                get     : -> @getFloat32 @OFFSET_WIDTH
                set     : -> @setFloat32 @OFFSET_WIDTH, arguments[0]

        height          :
                get     : -> @getFloat32 @OFFSET_HEIGHT
                set     : -> @setFloat32 @OFFSET_HEIGHT, arguments[0]

        maxWidth        :
                get     : -> @getFloat32 @OFFSET_MAXWIDTH
                set     : -> @setFloat32 @OFFSET_MAXWIDTH, arguments[0]

        maxHeight       :
                get     : -> @getFloat32 @OFFSET_MAXHEIGHT
                set     : -> @setFloat32 @OFFSET_MAXHEIGHT, arguments[0]

        fullscreen      :
                get     : -> @getUint8 @OFFSET_FULLSCREEN
                set     : -> @setUint8 @OFFSET_FULLSCREEN, arguments[0]


export class Program extends Pointer

export class Shader extends Pointer

export class Buffer extends Pointer

export class WebGL2 extends Pointer

    @byteLength         : 4 * 24

    OFFSET_RENDERING    : @malloc Uint8Array

    OFFSET_FRAME        : @malloc Uint32Array
    
    OFFSET_EPOCH        : @malloc Uint32Array

    OFFSET_DOCUMENT     : @malloc Uint32Array

    OFFSET_CANVAS       : @malloc Uint32Array

    OFFSET_CONTEXT      : @malloc Uint32Array
        
    OFFSET_VIEWPORT     : @malloc Viewport

    OFFSET_CLEARCOLOR   : @malloc Color4

    OFFSET_CLEARMASK    : @malloc Uint16Array

    OFFSET_FN_VIEWPORT  : @malloc Uint32Array
    
    OFFSET_FN_CLEARCOLOR: @malloc Uint32Array

    OFFSET_FN_CLEAR     : @malloc Uint32Array

    OFFSET_PROGRAM      : @malloc Uint32Array

    OFFSET_CONTROLLER   : @malloc Controller

    defaults            :

        clearColor      : [ 1, 1, 1, 1 ]

        clearMask       : GLKEYS.COLOR_DEPTH_BUFFER_BIT

        contextType     : "webgl2"

        tagName         : "canvas"

    preProcesses        : []

    postProcesses       : []

    render              : ( @epoch ) ->
        @frame++

        unless @rendering
            return requestAnimationFrame (e) => @render e

        f.call @ for f in @preProcesses

        @viewport.update @operators.viewport
        @clearColor.update @operators.clearColor

        @operators.clear()

        #console.log { @frame, @epoch, @rendering }, @clearColor

        f.call @ for f in @postProcesses

        requestAnimationFrame (e) => @render e

    create              : ->

        @viewport   = @document.body.getBoundingClientRect()
        @canvas     = @document.createElement @defaults.tagName
        @gl         = @canvas.getContext @defaults.contextType

        @clearColor = @defaults.clearColor
        @clearMask  = @defaults.clearMask

        @listenEvents()
        @resizeCanvas()
        @setOperators()
        @createProgram()
        
        @rendering = on

        @canvas.onclick = =>
            @rendering = !@rendering

    createProgram       : ->
        console.log @program = @gl.createProgram()

    resizeCanvas        : ->
        @canvas.width           = @viewport.width * devicePixelRatio
        @canvas.height          = @viewport.height * devicePixelRatio

        @canvas.style.position  = "fixed"
        @canvas.style.left      = CSS.px @viewport.left
        @canvas.style.top       = CSS.px @viewport.top
        @canvas.style.width     = CSS.px @viewport.width
        @canvas.style.height    = CSS.px @viewport.height

        @document.body.appendChild @canvas unless @canvas.isConnected

        this

    setOperators        : ->
        clear           = @gl.clear.bind @gl, @gl.COLOR_BUFFER_BIT | @gl.DEPTH_BUFFER_BIT
        viewport        = @gl.viewport.apply.bind @gl.viewport, @gl, new Float32Array @buffer, this + @OFFSET_VIEWPORT, 4
        clearColor      = @gl.clearColor.apply.bind @gl.clearColor, @gl, new Float32Array @buffer, this + @OFFSET_CLEARCOLOR, 4

        @storeObject @OFFSET_FN_CLEAR, clear
        @storeObject @OFFSET_FN_VIEWPORT, viewport
        @storeObject @OFFSET_FN_CLEARCOLOR, clearColor

        this

    listenEvents      : ->
        @addListener "gamepadconnected", ( event ) =>
            @controller.gamepad.handle event

    addListener         : ( event, handler, options = {} ) ->
        addEventListener event, handler, options ; this

    
    Object.defineProperties WebGL2::,
        
        document        :
            get         : -> @loadObject @OFFSET_DOCUMENT
            set         : -> @create @storeObject @OFFSET_DOCUMENT, arguments[0]

        rendering       :
            get         : -> @loadUint8 @OFFSET_RENDERING
            set         : -> @render @storeUint8 @OFFSET_RENDERING, arguments[0]

        epoch           :
            get         : -> @loadUint32 @OFFSET_EPOCH
            set         : -> @storeUint32 @OFFSET_EPOCH, arguments[0]

        frame           :
            get         : -> @loadUint32 @OFFSET_FRAME
            set         : -> @storeUint32 @OFFSET_FRAME, arguments[0]

        canvas          :
            get         : -> @loadObject @OFFSET_CANVAS
            set         : -> @storeObject @OFFSET_CANVAS, arguments[0]

        program         :
            get         : -> @loadObject @OFFSET_PROGRAM
            set         : -> @storeObject @OFFSET_PROGRAM, arguments[0]

        controller      :
            get         : -> new Controller this , @OFFSET_CONTROLLER

        viewport        :
            get         : -> new Viewport this + @OFFSET_VIEWPORT
            set         : -> @viewport.set arguments[0]

        clearColor      :
            get         : -> new Color4 this + @OFFSET_CLEARCOLOR
            set         : -> @clearColor.set arguments[0]
        
        clearMask       :
            get         : -> @keyUint16 @OFFSET_CLEARMASK, GLKEYS
            set         : -> @storeUint16 @OFFSET_CLEARMASK, arguments[0]

        gl              :
            get         : -> @loadObject @OFFSET_CONTEXT
            set         : -> @storeObject @OFFSET_CONTEXT, arguments[0]

        operators       :
            get         : ->
                clear           : @loadObject @OFFSET_FN_CLEAR
                viewport        : @loadObject @OFFSET_FN_VIEWPORT
                clearColor      : @loadObject @OFFSET_FN_CLEARCOLOR


Pointer.register(
    WebGL2, Program, Viewport,
    Color4, Shader, Buffer
)
.store GLKEYS

export { Pointer as default }


