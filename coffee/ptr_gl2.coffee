import { Float32Array } from "./window.coffee"
import { Optr, KeyBase } from "./Optr.js"

export class Color4         extends Optr
    
    OFFSET_RED              : @reserv Float32Array

    OFFSET_GREEN            : @reserv Float32Array
    
    OFFSET_BLUE             : @reserv Float32Array

    OFFSET_ALPHA            : @reserv Float32Array

export class Program        extends Optr

    OFFSET_CONTEXT          : @reserv Uint32Array

    OFFSET_ISLINKED         : @reserv Uint8Array

export class Context        extends Optr

    OFFSET_RENDERING        : @reserv Uint8Array

    OFFSET_CANVAS           : @reserv Uint32Array

    OFFSET_DISPLAY          : @reserv Uint32Array

    OFFSET_CLEARCOLOR       : @reserv Color4
    
    OFFSET_CLEARMASK        : @reserv Uint16Array

    init                    : ->
        @canvas = @createCanvas()

    createCanvas            : ->
        @display.document.createElement "canvas"

    Object.defineProperties this::,

        display             :
            get             : -> @ptrParent Display
            set             : -> @storeUint32 @OFFSET_DOCUMENT, arguments[0]

        canvas              :
            get             : -> @objUint32 @OFFSET_CANVAS
            set             : -> @storeUint32 @OFFSET_CANVAS, @scopei arguments[0]


VIEWPORT_KEYBASE            = KeyBase.generate {
    LANDSCAPE_PRIMARY       : "landscape-primary"
    BOUNDING_RECT_VIEWPORT  : "bounding-rect-sized"
    CLIENT_VIEWPORT         : "client-sized"
    AVAILABLE_VIEWPORT      : "available-sized"
    SCREEN_VIEWPORT         : "screen-sized"
    SCROLL_VIEWPORT         : "scroll-sized"
    INNER_VIEWPORT          : "inner-sized"
    OUTER_VIEWPORT          : "outer-sized"
}

export class Viewport       extends Optr

    OFFSET_IS_ACTIVE        : @reserv Uint8Array

    OFFSET_IS_FULLSCREEN    : @reserv Uint8Array

    OFFSET_VIEWPORT_FROM    : @reserv Uint16Array

    OFFSET_LEFT             : @reserv Uint16Array

    OFFSET_TOP              : @reserv Uint16Array

    OFFSET_WIDTH            : @reserv Uint16Array

    OFFSET_RIGHT            : @reserv Uint16Array

    OFFSET_BOTTOM           : @reserv Uint16Array

    OFFSET_HEIGHT           : @reserv Uint16Array

    OFFSET_WIDTH_DPR        : @reserv Uint16Array

    OFFSET_HEIGHT_DPR       : @reserv Uint16Array

    OFFSET_CLIENTLEFT       : @reserv Uint16Array

    OFFSET_CLIENTTOP        : @reserv Uint16Array

    OFFSET_CLIENTWIDTH      : @reserv Uint16Array

    OFFSET_CLIENTHEIGHT     : @reserv Uint16Array

    OFFSET_RECTLEFT         : @reserv Uint16Array

    OFFSET_RECTTOP          : @reserv Uint16Array

    OFFSET_RECTRIGHT        : @reserv Uint16Array

    OFFSET_RECTBOTTOM       : @reserv Uint16Array

    OFFSET_RECTWIDTH        : @reserv Uint16Array

    OFFSET_RECTHEIGHT       : @reserv Uint16Array

    OFFSET_SCROLLLEFT       : @reserv Uint16Array

    OFFSET_SCROLLTOP        : @reserv Uint16Array

    OFFSET_SCROLLWIDTH      : @reserv Uint16Array

    OFFSET_SCROLLHEIGHT     : @reserv Uint16Array

    OFFSET_INNERWIDTH       : @reserv Uint16Array

    OFFSET_INNERHEIGHT      : @reserv Uint16Array
    
    OFFSET_OUTERWIDTH       : @reserv Uint16Array

    OFFSET_OUTERHEIGHT      : @reserv Uint16Array
        
    OFFSET_SCREENWIDTH      : @reserv Uint16Array

    OFFSET_SCREENHEIGHT     : @reserv Uint16Array
    
    OFFSET_AVAILLEFT        : @reserv Uint16Array

    OFFSET_AVAILTOP         : @reserv Uint16Array
    
    OFFSET_AVAILWIDTH       : @reserv Uint16Array

    OFFSET_AVAILHEIGHT      : @reserv Uint16Array
    
    OFFSET_PIXEL_RATIO      : @reserv Uint8Array

    OFFSET_PIXEL_DEPTH      : @reserv Uint8Array

    OFFSET_ASPECT_RATIO     : @reserv Float32Array
    
    OFFSET_ANGLE            : @reserv Float32Array

    OFFSET_IS_EXTENDED      : @reserv Uint8Array
    
    OFFSET_ORIENTATION      : @reserv Uint8Array

    readWindow              : ( window ) ->

        @angle              = window.screen.orientation.angle
        @orientation        = window.screen.orientation.type
        @isExtended         = window.screen.isExtended
        @pixelDepth         = window.screen.pixelDepth
        @pixelRatio         = window.devicePixelRatio or 1
        
        @innerWidth         = window.innerWidth
        @innerHeight        = window.innerHeight

        @outerWidth         = window.outerWidth
        @outerHeight        = window.outerHeight        
        
        @screenWidth        = window.screen.width
        @screenHeight       = window.screen.height

        @availWidth         = window.screen.availWidth
        @availHeigth        = window.screen.availHeigth

        @clientLeft         = window.document.body.clientLeft
        @clientTop          = window.document.body.clientTop
        @clientWidth        = window.document.body.clientWidth
        @clientHeight       = window.document.body.clientHeight

        @scrollLeft         = window.document.body.scrollLeft
        @scrollTop          = window.document.body.scrollTop
        @scrollWidth        = window.document.body.scrollWidth
        @scrollHeight       = window.document.body.scrollHeight

        boundingRect        = window.document.body.getBoundingClientRect()
        @rectLeft           = boundingRect.left
        @rectTop            = boundingRect.top
        @rectRight          = boundingRect.right
        @rectBottom         = boundingRect.bottom
        @rectWidth          = boundingRect.width
        @rectHeight         = boundingRect.height
        
        ; @

    setFromClient           : ->
        @left               = @clientLeft
        @top                = @clientTop
        @right              = 0
        @bottom             = 0
        @width              = @clientWidth
        @height             = @clientHeight
        @viewportFrom       = VIEWPORT_KEYBASE.CLIENT_VIEWPORT

        ; @updateRatioValues()

    setFromInner            : ->
        @left               = 0
        @top                = 0
        @right              = 0
        @bottom             = 0
        @width              = @innerWidth
        @height             = @innerHeight
        @viewportFrom       = VIEWPORT_KEYBASE.INNER_VIEWPORT

        ; @updateRatioValues()

    setFromOuter            : ->
        @left               = 0
        @top                = 0
        @right              = 0
        @bottom             = 0
        @width              = @outerWidth
        @height             = @outerHeight
        @viewportFrom       = VIEWPORT_KEYBASE.INNER_VIEWPORT

        ; @updateRatioValues()

    setFromAvailable        : ->
        @left               = @availLeft
        @top                = @availTop
        @right              = 0
        @bottom             = 0
        @width              = @availWidth
        @height             = @availHeight
        @viewportFrom       = VIEWPORT_KEYBASE.AVAILABLE_VIEWPORT

        ; @updateRatioValues()

    setFromScreen           : ->
        @left               = 0
        @top                = 0
        @right              = 0
        @bottom             = 0
        @width              = @screenWidth
        @height             = @screenHeight
        @viewportFrom       = VIEWPORT_KEYBASE.SCREEN_VIEWPORT

        ; @updateRatioValues()

    setFromBoundingRect     : ->
        @left               = @rectLeft
        @top                = @rectTop
        @right              = @rectRight
        @bottom             = @rectBottom
        @width              = @rectWidth
        @height             = @rectHeight
        @viewportFrom       = VIEWPORT_KEYBASE.BOUNDING_RECT_VIEWPORT

        ; @updateRatioValues()

    setFromScroll           : ->
        @left               = @scrollLeft
        @top                = @scrollTop
        @right              = 0
        @bottom             = 0
        @width              = @screenWidth
        @height             = @scrollHeight
        @viewportFrom       = VIEWPORT_KEYBASE.SCROLL_VIEWPORT

        ; @updateRatioValues()

    updateRatioValues       : ->
        @widthDpr           = @width * @pixelRatio
        @heightDpr          = @height * @pixelRatio
        @aspectRatio        = @width / @height
        @isActive           = on

        ; @

    Object.defineProperties this::,

        isActive            :
                    get     : -> @getUint8 @OFFSET_IS_ACTIVE
                    set     : -> @setUint8 @OFFSET_IS_ACTIVE, arguments[0]

        isFullscreen        :
                    get     : -> @getUint8 @OFFSET_IS_FULLSCREEN
                    set     : -> @setUint8 @OFFSET_IS_FULLSCREEN, arguments[0]

        viewportFrom        :
                    get     : -> @keyUint16 @OFFSET_VIEWPORT_FROM, VIEWPORT_KEYBASE
                    set     : -> @setUint16 @OFFSET_VIEWPORT_FROM, VIEWPORT_KEYBASE[ arguments[0] ]

        left                :
                    get     : -> @getUint16 @OFFSET_LEFT
                    set     : -> @setUint16 @OFFSET_LEFT, arguments[0]

        top                 :
                    get     : -> @getUint16 @OFFSET_TOP
                    set     : -> @setUint16 @OFFSET_TOP, arguments[0]

        right               :
                    get     : -> @getUint16 @OFFSET_RIGHT
                    set     : -> @setUint16 @OFFSET_RIGHT, arguments[0]

        bottom              :
                    get     : -> @getUint16 @OFFSET_BOTTOM
                    set     : -> @setUint16 @OFFSET_BOTTOM, arguments[0]

        width               :
                    get     : -> @getUint16 @OFFSET_WIDTH
                    set     : -> @setUint16 @OFFSET_WIDTH, arguments[0]

        height              :
                    get     : -> @getUint16 @OFFSET_HEIGHT
                    set     : -> @setUint16 @OFFSET_HEIGHT, arguments[0]

        widthDpr            :
                    get     : -> @getUint16 @OFFSET_WIDTH_DPR
                    set     : -> @setUint16 @OFFSET_WIDTH_DPR, arguments[0]

        heightDpr           :
                    get     : -> @getUint16 @OFFSET_HEIGHT_DPR
                    set     : -> @setUint16 @OFFSET_HEIGHT_DPR, arguments[0]

        clientLeft          :
                    get     : -> @getUint16 @OFFSET_CLIENTLEFT
                    set     : -> @setUint16 @OFFSET_CLIENTLEFT, arguments[0]

        clientTop           :                        
                    get     : -> @getUint16 @OFFSET_CLIENTTOP    
                    set     : -> @setUint16 @OFFSET_CLIENTTOP, arguments[0]

        clientWidth         :
                    get     : -> @getUint16 @OFFSET_CLIENTWIDTH
                    set     : -> @setUint16 @OFFSET_CLIENTWIDTH, arguments[0]

        clientHeight        :                        
                    get     : -> @getUint16 @OFFSET_CLIENTHEIGHT    
                    set     : -> @setUint16 @OFFSET_CLIENTHEIGHT, arguments[0]

        rectLeft            :
                    get     : -> @getUint16 @OFFSET_RECTLEFT
                    set     : -> @setUint16 @OFFSET_RECTLEFT, arguments[0]

        rectTop             :                        
                    get     : -> @getUint16 @OFFSET_RECTTOP    
                    set     : -> @setUint16 @OFFSET_RECTTOP, arguments[0]

        rectRight           :
                    get     : -> @getUint16 @OFFSET_RECTRIGHT
                    set     : -> @setUint16 @OFFSET_RECTRIGHT, arguments[0]

        rectBottom          :                        
                    get     : -> @getUint16 @OFFSET_RECTBOTTOM    
                    set     : -> @setUint16 @OFFSET_RECTBOTTOM, arguments[0]

        rectWidth           :
                    get     : -> @getUint16 @OFFSET_RECTWIDTH
                    set     : -> @setUint16 @OFFSET_RECTWIDTH, arguments[0]

        rectHeight          :                        
                    get     : -> @getUint16 @OFFSET_RECTHEIGHT    
                    set     : -> @setUint16 @OFFSET_RECTHEIGHT, arguments[0]

        scrollLeft          :
                    get     : -> @getUint16 @OFFSET_SCROLLLEFT
                    set     : -> @setUint16 @OFFSET_SCROLLLEFT, arguments[0]

        scrollTop           :                        
                    get     : -> @getUint16 @OFFSET_SCROLLTOP    
                    set     : -> @setUint16 @OFFSET_SCROLLTOP, arguments[0]

        scrollWidth         :
                    get     : -> @getUint16 @OFFSET_SCROLLWIDTH
                    set     : -> @setUint16 @OFFSET_SCROLLWIDTH, arguments[0]

        scrollHeight        :                        
                    get     : -> @getUint16 @OFFSET_SCROLLHEIGHT    
                    set     : -> @setUint16 @OFFSET_SCROLLHEIGHT, arguments[0]

        availLeft           :
                    get     : -> @getUint16 @OFFSET_AVAILLEFT
                    set     : -> @setUint16 @OFFSET_AVAILLEFT, arguments[0]

        availTop            :                        
                    get     : -> @getUint16 @OFFSET_AVAILTOP    
                    set     : -> @setUint16 @OFFSET_AVAILTOP, arguments[0]

        availWidth          :
                    get     : -> @getUint16 @OFFSET_AVAILWIDTH
                    set     : -> @setUint16 @OFFSET_AVAILWIDTH, arguments[0]

        availHeight         :                        
                    get     : -> @getUint16 @OFFSET_AVAILHEIGHT    
                    set     : -> @setUint16 @OFFSET_AVAILHEIGHT, arguments[0]

        innerWidth          :
                    get     : -> @getUint16 @OFFSET_INNERWIDTH
                    set     : -> @setUint16 @OFFSET_INNERHEIGHT, arguments[0]

        innerHeight         :                        
                    get     : -> @getUint16 @OFFSET_INNERHEIGHT    
                    set     : -> @setUint16 @OFFSET_INNERHEIGHT, arguments[0]

        outerWidth          :
                    get     : -> @getUint16 @OFFSET_OUTERWIDTH
                    set     : -> @setUint16 @OFFSET_OUTERWIDTH, arguments[0]

        outerHeight         :                        
                    get     : -> @getUint16 @OFFSET_OUTERHEIGHT    
                    set     : -> @setUint16 @OFFSET_OUTERHEIGHT, arguments[0]

        screenWidth         :
                    get     : -> @getUint16 @OFFSET_SCREENWIDTH
                    set     : -> @setUint16 @OFFSET_SCREENWIDTH, arguments[0]

        screenHeight        :                        
                    get     : -> @getUint16 @OFFSET_SCREENHEIGHT    
                    set     : -> @setUint16 @OFFSET_SCREENHEIGHT, arguments[0]

        pixelRatio          :
                    get     : -> @getUint8 @OFFSET_PIXEL_RATIO
                    set     : -> @setUint8 @OFFSET_PIXEL_RATIO, arguments[0]

        pixelDepth          :
                    get     : -> @getUint8 @OFFSET_PIXEL_DEPTH
                    set     : -> @setUint8 @OFFSET_PIXEL_DEPTH, arguments[0]

        aspectRatio         :
                    get     : -> @getFloat32 @OFFSET_ASPECT_RATIO
                    set     : -> @setFloat32 @OFFSET_ASPECT_RATIO, arguments[0]

        angle               :
                    get     : -> @getFloat32 @OFFSET_ANGLE
                    set     : -> @setFloat32 @OFFSET_ANGLE, arguments[0]

        isExtended          :
                    get     : -> @getUint8 @OFFSET_IS_EXTENDED
                    set     : -> @setUint8 @OFFSET_IS_EXTENDED, arguments[0]

        orientation         :
                    get     : -> @keyUint16 @OFFSET_ORIENTATION, VIEWPORT_KEYBASE
                    set     : -> @setUint16 @OFFSET_ORIENTATION, VIEWPORT_KEYBASE[ arguments[0] ]



export class Display        extends Optr

    OFFSET_UUID             : @reserv Uint8Array, 36

    OFFSET_DOCUMENT         : @reserv Uint32Array

    OFFSET_CONTEXT          : @reserv Uint32Array
    
    OFFSET_CONTEXT          : @reserv Uint32Array

    OFFSET_PROGRAM          : @reserv Uint32Array
    
    OFFSET_VIEWPORT         : @reserv Uint32Array

    @filter children        : Context

    init                    : ( @document ) ->
        context = new Context()
        context . attach this
        context . init()
        context . createCanvas()

    Object.defineProperties this::,

        viewport            :
            get             : -> @ptrUint32 @OFFSET_VIEWPORT, Viewport
            set             : -> @storeUint32 @OFFSET_VIEWPORT, arguments[0]

        document            :
            get             : -> @objUint32 @OFFSET_DOCUMENT
            set             : -> @storeUint32 @OFFSET_DOCUMENT, @scopei arguments[0]

        

