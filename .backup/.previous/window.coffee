import * as OPTR from "./0ptr.js"
export * from "./0ptr.js"

{ log, warn, error } = console

export class Window                 extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    createCanvas    : ( append = on ) ->
        @document.createElement( "canvas", append, HTMLCanvasElement )

export class HTMLElement            extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    appendChild     : ( ptri, nodeAppend = on ) ->
        primitive = ptri.toPrimitive()
        if  nodeAppend and (no is primitive.isConnected)
            @toPrimitive().appendChild( primitive )
        super ptri

export class HTMLCanvasElement      extends HTMLElement

    @classPointer   : OPTR.ClassPointer.from this

    getContext      : ( type = this.contextType ) ->
        type = [ "webgl2", "webgpu", "webnn" ][ type ]

        context = @find ( ptri ) ->
            if  ptri instanceof CanvasContext
                name = ptri.constructor.name
                test = new RegExp type, "i"
                return name.match test
            return false

        if !context and object = @toPrimitive().getContext type
            context = switch type
                when "webgl2" then WebGL2RenderingContext.from object

        if  @hasContext = Boolean context
            return @appendChild context

        throw /CTXERR/

export class CanvasContext          extends OPTR.ObjectPointer

    @classPointer : OPTR.ClassPointer.from this

export class WebGL2RenderingContext extends CanvasContext

    @classPointer : OPTR.ClassPointer.from this

export class HTMLBodyElement        extends HTMLElement

    @classPointer : OPTR.ClassPointer.from this

export class HTMLDocument           extends HTMLElement

    @classPointer : OPTR.ClassPointer.from this
    
    createElement : ( tagName, append = on, Proto = HTMLElement ) ->
        ptri = Proto.from @toPrimitive().createElement( tagName )
        if append then @body.appendChild ptri
        return ptri

Object.defineProperty Window::              , "document",
    enumerable: on, get : ->
        if !ptri = @find (i) -> i instanceof HTMLDocument
            ptri = HTMLDocument.from @toPrimitive().document
            @appendChild ptri
        ptri
        
Object.defineProperty HTMLDocument::        , "body",
    enumerable: on, get : ->
        if !ptri = @find (i) -> i instanceof HTMLBodyElement
            ptri = HTMLBodyElement.from @toPrimitive().body
            @appendChild ptri
        ptri

HTMLCanvasElement.definePointer "contextType",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint8Number 

HTMLCanvasElement.definePointer "width",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Int16Number 

HTMLCanvasElement.definePointer "height",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Int16Number 

HTMLCanvasElement.definePointer "hasContext",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.BooleanAtomic 

HTMLCanvasElement.definePointer "backgroundColor",
    byteLength : 4
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint8ArrayPointer 

HTMLCanvasElement.defineProperty "context",
    byteLength : 4,
    enumerable : on,
    get : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return ->
            if  ptri = @getUint32 byteOffset
                return OPTR.Pointer.of ptri

            @[  propertyName  ] =
                this.getContext @contextType
    
    set : ( propertyName, desc = {} ) ->
        byteOffset = desc.byteOffset
        return ( value ) ->
            @setUint32 byteOffset, value

CanvasContext.definePointer "pointSize",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Float32Number 
