import Optr from "./Optr.js"

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

export class Display        extends Optr

    OFFSET_UUID             : @reserv Uint8Array, 36

    OFFSET_DOCUMENT         : @reserv Uint32Array

    OFFSET_CONTEXT          : @reserv Uint32Array
    
    OFFSET_CONTEXT          : @reserv Uint32Array

    OFFSET_PROGRAM          : @reserv Uint32Array

    @filter children        : Context

    init                    : ( @document ) ->
        context = new Context()
        context . attach this
        context . init()
        context . createCanvas()

    Object.defineProperties this::,

        document            :
            get             : -> @objUint32 @OFFSET_DOCUMENT
            set             : -> @storeUint32 @OFFSET_DOCUMENT, @scopei arguments[0]

        

