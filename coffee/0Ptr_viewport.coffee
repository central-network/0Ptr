import { AtomicScope } from "./0Ptr_scope.js"
import { KeyBase } from "./0Ptr_keybase.js"
import { OPtr } from "./0Ptr.js"

kScreen   = "#screen"
kWindow   = "#window"
kDocument = "$document"
kBody     = "$body"

export VIEWPORT_KEYBASE     = KeyBase.generate {
    LANDSCAPE_PRIMARY       : "landscape-primary"
    BODY_VIEWPORT           : "body-sized"
    CLIENT_VIEWPORT         : "client-sized"
    AVAILABLE_VIEWPORT      : "available-sized"
    SCREEN_VIEWPORT         : "screen-sized"
    SCROLL_VIEWPORT         : "scroll-sized"
    INNER_VIEWPORT          : "inner-sized"
    OUTER_VIEWPORT          : "outer-sized"
}

export class Viewport extends OPtr

    @metaUrl                : `import.meta.url`

    OFFSET_WINDOW           : @reserv Uint32Array

    OFFSET_IS_ACTIVE        : @reserv Uint8Array

    OFFSET_IS_LISTENING     : @reserv Uint8Array
    
    OFFSET_IS_UPDATING      : @reserv Uint8Array

    OFFSET_TIMEOUT_ID       : @reserv Uint16Array
    
    OFFSET_FULLSCREEN_ENABLE: @reserv Uint8Array
    
    OFFSET_FULLSCREEN_NODE  : @reserv Uint32Array
    
    OFFSET_IS_FULLSCREEN    : @reserv Uint8Array

    OFFSET_TYPE             : @reserv Uint16Array

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

    OFFSET_BODYLEFT         : @reserv Uint16Array

    OFFSET_BODYTOP          : @reserv Uint16Array

    OFFSET_BODYRIGHT        : @reserv Uint16Array

    OFFSET_BODYBOTTOM       : @reserv Uint16Array

    OFFSET_BODYWIDTH        : @reserv Uint16Array

    OFFSET_BODYHEIGHT       : @reserv Uint16Array

    OFFSET_SCROLLLEFT       : @reserv Uint16Array

    OFFSET_SCROLLTOP        : @reserv Uint16Array

    OFFSET_SCROLLWIDTH      : @reserv Uint16Array

    OFFSET_SCROLLHEIGHT     : @reserv Uint16Array

    OFFSET_INNERWIDTH       : @reserv Uint16Array

    OFFSET_INNERHEIGHT      : @reserv Uint16Array
    
    OFFSET_OUTERWIDTH       : @reserv Uint16Array

    OFFSET_OUTERHEIGHT      : @reserv Uint16Array
        
    OFFSET_SCREENLEFT       : @reserv Uint16Array

    OFFSET_SCREENTOP        : @reserv Uint16Array
        
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

    bind                    : ( window ) ->
        @[ kWindow ] = window
        this.init().bindWindowEvents() ; this

    init                    : ->
        @angle              = @[ kScreen ].orientation.angle
        @orientation        = @[ kScreen ].orientation.type
        @isExtended         = @[ kScreen ].isExtended
        @pixelDepth         = @[ kScreen ].pixelDepth
        @pixelRatio         = @[ kWindow ].devicePixelRatio or 1
                
        @innerWidth         = @[ kWindow ].innerWidth
        @innerHeight        = @[ kWindow ].innerHeight

        @outerWidth         = @[ kWindow ].outerWidth
        @outerHeight        = @[ kWindow ].outerHeight        
        
        @screenLeft         = @[ kWindow ].screenLeft
        @screenTop          = @[ kWindow ].screenTop
        @screenWidth        = @[ kScreen ].width
        @screenHeight       = @[ kScreen ].height

        @availWidth         = @[ kScreen ].availWidth
        @availHeight        = @[ kScreen ].availHeight

        @clientLeft         = @[ kBody ].clientLeft
        @clientTop          = @[ kBody ].clientTop
        @clientWidth        = @[ kBody ].clientWidth
        @clientHeight       = @[ kBody ].clientHeight

        @scrollLeft         = @[ kBody ].scrollLeft
        @scrollTop          = @[ kBody ].scrollTop
        @scrollWidth        = @[ kBody ].scrollWidth
        @scrollHeight       = @[ kBody ].scrollHeight
        $bodyRect           = @[ kBody ].getBoundingClientRect()

        @bodyLeft           = $bodyRect.left
        @bodyTop            = $bodyRect.top
        @bodyRight          = $bodyRect.right
        @bodyBottom         = $bodyRect.bottom
        @bodyWidth          = $bodyRect.width
        @bodyHeight         = $bodyRect.height
        @isFullscreen       = @checkFullscreen()

        @setFromBody() ; this
    
    bindWindowEvents        : ->

        if !@isListening and @isListening = 1

            timeouts = [] 
            callback = ->
                for j in timeouts.slice()
                    clearTimeout j, timeouts.splice j, 1

                timeouts[ timeouts.length ] =
                    setTimeout @init.bind( this ), 1000

            @[ kWindow ]  .addEventListener "resize"          , callback.bind this
            @[ kDocument ].addEventListener "fullscreenerror" , callback.bind this
            @[ kDocument ].addEventListener "fullscreenchange", callback.bind this

        ; @


    setFromClient           : ->
        @left               = @clientLeft
        @top                = @clientTop
        @right              = 0
        @bottom             = 0
        @width              = @clientWidth
        @height             = @clientHeight
        @type               = VIEWPORT_KEYBASE.CLIENT_VIEWPORT

        ; @updateRatioValues()

    setFromInner            : ->
        @left               = 0
        @top                = 0
        @right              = 0
        @bottom             = 0
        @width              = @innerWidth
        @height             = @innerHeight
        @type               = VIEWPORT_KEYBASE.INNER_VIEWPORT

        ; @updateRatioValues()

    setFromOuter            : ->
        @left               = 0
        @top                = 0
        @right              = 0
        @bottom             = 0
        @width              = @outerWidth
        @height             = @outerHeight
        @type               = VIEWPORT_KEYBASE.INNER_VIEWPORT

        ; @updateRatioValues()

    setFromAvailable        : ->
        @left               = @availLeft
        @top                = @availTop
        @right              = 0
        @bottom             = 0
        @width              = @availWidth
        @height             = @availHeight
        @type               = VIEWPORT_KEYBASE.AVAILABLE_VIEWPORT

        ; @updateRatioValues()

    setFromScreen           : ->
        @left               = @screenLeft
        @top                = @screenTop
        @right              = 0
        @bottom             = 0
        @width              = @screenWidth
        @height             = @screenHeight
        @type               = VIEWPORT_KEYBASE.SCREEN_VIEWPORT

        ; @updateRatioValues()

    setFromBody             : ->
        @left               = @bodyLeft
        @top                = @bodyTop
        @right              = @bodyRight
        @bottom             = @bodyBottom
        @width              = @bodyWidth
        @height             = @bodyHeight
        @type               = VIEWPORT_KEYBASE.BODY_VIEWPORT

        ; @updateRatioValues()

    setFromScroll           : ->
        @left               = @scrollLeft
        @top                = @scrollTop
        @right              = 0
        @bottom             = 0
        @width              = @scrollWidth
        @height             = @scrollHeight
        @type               = VIEWPORT_KEYBASE.SCROLL_VIEWPORT

        ; @updateRatioValues()

    updateRatioValues       : ->
        @widthDpr           = @width * @pixelRatio
        @heightDpr          = @height * @pixelRatio
        @aspectRatio        = @width / @height
        @isActive           = on

        ; @

    requestFullscreen       : ->
        try await @[ kDocument ].documentElement.requestFullscreen() 

    exitFullscreen          : ->
        try await @[ kDocument ].exitFullscreen()

    checkFullscreen         : ->

        return 1 if @fullscreenElement
        if 0 < @innerHeight and @outerHeight > 0
            return 1 if @innerHeight is @outerHeight
        return 0

    toggleFullscreen        : ->
        @isUpdating   = 1
        $targetMode   = arguments[0] ? !@checkFullscreen() 

        unless $targetMode
            await @exitFullscreen() 
        else await @requestFullscreen()
                
        @fullscreenEnabled = @[ kDocument ].fullscreenEnabled
        @fullscreenElement = @[ kDocument ].fullscreenElement

        @isUpdating   = 0
        @isFullscreen = @checkFullscreen() 

    Object.defineProperties this::,

        [ kBody ]                : get : -> @[ kDocument ].body

        [ kScreen ]              : get : -> @[ kWindow ].screen

        [ kDocument ]            : get : -> @[ kWindow ].document

        [ kWindow ]              :
                    get     : -> @objUint32 @OFFSET_WINDOW
                    set     : -> @setUint32 @OFFSET_WINDOW, @scopei arguments[0]

        fullscreenEnabled   :
                    get     : -> @loadUint8 @OFFSET_FULLSCREEN_ENABLE
                    set     : -> @storeUint8 @OFFSET_FULLSCREEN_ENABLE, arguments[0]

        fullscreenElement   :
                    get     : -> @objUint32 @OFFSET_FULLSCREEN_NODE
                    set     : -> @storeUint32 @OFFSET_FULLSCREEN_NODE, @scopei arguments[0]
                    
        isActive            :
                    get     : -> @getUint8 @OFFSET_IS_ACTIVE
                    set     : -> @setUint8 @OFFSET_IS_ACTIVE, arguments[0]
        
        isUpdating          :
                    get     : -> @loadUint8 @OFFSET_IS_UPDATING
                    set     : -> @storeUint8 @OFFSET_IS_UPDATING, arguments[0]
        
        isListening         :
                    get     : -> @getUint8 @OFFSET_IS_LISTENING
                    set     : -> @setUint8 @OFFSET_IS_LISTENING, arguments[0]

        isFullscreen        :
                    get     : -> @getUint8 @OFFSET_IS_FULLSCREEN
                    set     : -> @storeUint8 @OFFSET_IS_FULLSCREEN, arguments[0]

        type                :
                    get     : -> @keyUint16 @OFFSET_TYPE, VIEWPORT_KEYBASE
                    set     : -> @setUint16 @OFFSET_TYPE, VIEWPORT_KEYBASE[ arguments[0] ]

        timeoutId           :
                    get     : -> @loadUint16 @OFFSET_TIMEOUT_ID
                    set     : -> @storeUint16 @OFFSET_TIMEOUT_ID, arguments[0]

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

        bodyLeft            :
                    get     : -> @getUint16 @OFFSET_BODYLEFT
                    set     : -> @setUint16 @OFFSET_BODYLEFT, arguments[0]

        bodyTop             :
                    get     : -> @getUint16 @OFFSET_BODYTOP    
                    set     : -> @setUint16 @OFFSET_BODYTOP, arguments[0]

        bodyRight           :
                    get     : -> @getUint16 @OFFSET_BODYRIGHT
                    set     : -> @setUint16 @OFFSET_BODYRIGHT, arguments[0]

        bodyBottom          :
                    get     : -> @getUint16 @OFFSET_BODYBOTTOM    
                    set     : -> @setUint16 @OFFSET_BODYBOTTOM, arguments[0]

        bodyWidth           :
                    get     : -> @getUint16 @OFFSET_BODYWIDTH
                    set     : -> @setUint16 @OFFSET_BODYWIDTH, arguments[0]

        bodyHeight          :
                    get     : -> @getUint16 @OFFSET_BODYHEIGHT    
                    set     : -> @setUint16 @OFFSET_BODYHEIGHT, arguments[0]

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

        screenLeft          :
                    get     : -> @getUint16 @OFFSET_SCREENLEFT
                    set     : -> @setUint16 @OFFSET_SCREENLEFT, arguments[0]

        screenTop           :
                    get     : -> @getUint16 @OFFSET_SCREENTOP    
                    set     : -> @setUint16 @OFFSET_SCREENTOP, arguments[0]

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

export { Viewport as default }