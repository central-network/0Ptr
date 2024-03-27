import { length } from "./window.coffee"
import { Pointer, ByteOffset } from "./ptr.js"

export class Color4 extends ByteOffset

    OFFSET_RED          : @malloc Float32Array

    OFFSET_GREEN        : @malloc Float32Array

    OFFSET_BLUE         : @malloc Float32Array

    OFFSET_ALPHA        : @malloc Float32Array

    set                 : ( vec4 = [] ) ->
        for val , i in [ ...vec4, 1, 1, 1, 1 ]
            unless i < 4 then break
            else @setFloat32 i * 4 , val
        return @

    parseCSSColor       : ( rgba = "" ) ->
        [ r, g, b, a = 1] = rgba
            .replace( /^rgba?\(|\s+|\)$/g,'' )
            .split( ',' ).map( Number )

        Float32Array.of r/ 0xff, g/0xff, b/0xff, a

    Object.defineProperties this::,

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
                set     : -> @set @parseCSSColor arguments[0]

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

    OFFSET_LEFT         : @malloc Float32Array

    OFFSET_TOP          : @malloc Float32Array

    OFFSET_WIDTH        : @malloc Float32Array

    OFFSET_HEIGHT       : @malloc Float32Array

    OFFSET_MAXWIDTH     : @malloc Float32Array

    OFFSET_MAXHEIGHT    : @malloc Float32Array

    OFFSET_FULLSCREEN   : @malloc Uint8Array

    set                 : ( rect = {} ) ->

        @left           = rect.left   if  rect.left?
        @top            = rect.top    if  rect.top?
        @width          = rect.width  if  rect.width?
        @height         = rect.height if  rect.height?
        @maxWidth       = innerWidth  if !rect.maxWidth?  and innerWidth?
        @maxHeight      = innerHeight if !rect.maxHeight? and innerHeight?

        @fullscreen     = ! Boolean @width - @maxWidth + @height - @maxHeight

        this

    Object.defineProperties this::,

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

export class WebGL2 extends Pointer

    @byteLength         : 4 * 24

    OFFSET_DOCUMENT     : @malloc Uint32Array

    OFFSET_CANVAS       : @malloc Uint32Array

    OFFSET_CONTEXT      : @malloc Uint32Array
    
    OFFSET_VIEWPORT     : @malloc Viewport

    OFFSET_CLEARCOLOR   : @malloc Color4

    create              : ->
        @canvas = @document.createElement "canvas"
        @viewport = @document.body.getBoundingClientRect()
        @clearColor = [ 1, 0, 1, .5 ]
        @gl = @canvas.getContext "webgl2"

    getDocumentIndex    : -> @loadUint32  @OFFSET_DOCUMENT

    setDocumentIndex    : -> @storeUint32 @OFFSET_DOCUMENT , arguments[0]


    getCanvasIndex      : -> @loadUint32  @OFFSET_CANVAS
    
    setCanvasIndex      : -> @storeUint32 @OFFSET_CANVAS , arguments[0]


    getContextIndex     : -> @loadUint32  @OFFSET_CONTEXT
    
    setContextIndex     : -> @storeUint32 @OFFSET_CONTEXT , arguments[0]

    
    Object.defineProperties WebGL2::,
        
        document        :
            get         : -> @loadObject @getDocumentIndex()
            set         : -> @create @setDocumentIndex @storeObject arguments[0]

        canvas          :
            get         : -> @loadObject @getCanvasIndex()
            set         : -> @setCanvasIndex @storeObject arguments[0]

        viewport        :
            get         : -> new Viewport this + @OFFSET_VIEWPORT
            set         : -> @viewport.set arguments...

        clearColor      :
            get         : -> new Color4 this + @OFFSET_CLEARCOLOR
            set         : -> @clearColor.set arguments...

        gl              :
            get         : -> @loadObject @getContextIndex()
            set         : -> @setContextIndex @storeObject arguments[0]


export { Pointer as default }


