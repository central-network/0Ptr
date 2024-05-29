{ log, warn, error, table, debug, info } = console

[
    buffer = null
    dataView = null
    {
        memory,
        init,
        malloc,
        isPointer,
        nextChild,
        setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded,
        getHeader, getType, getParent, getLink, isUpdated, isUploaded
    } = {}
    iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
]


classes = [
    Object.getPrototypeOf( Number ),
    class Pointer               extends Number
    class Property              extends Pointer
    class RenderingContext      extends Pointer
    class Program               extends Pointer
    class VertexShaderSource    extends Pointer
    class FragmentShaderSource  extends Pointer
    class ShaderCompilation     extends Pointer
    class ShaderAttribute       extends Pointer
    class ShaderUniform         extends Pointer
    class ShaderVertexArray     extends Pointer
    class DrawBuffer            extends Pointer
    class DrawBufferAllocation  extends Pointer
    class DrawCall              extends Pointer
    class Mesh                  extends Pointer
    class Position              extends Pointer
    class Rotation              extends Pointer
    class Scale                 extends Pointer
    class Color                 extends Pointer
    class Matrix                extends Pointer
    class Vector                extends Pointer
    class Vertices              extends Pointer
    class Calculation           extends Pointer
]

Object.defineProperty Pointer,                  "type", value : i=1
Object.defineProperty Property,                 "type", value : ++i
Object.defineProperty RenderingContext,         "type", value : ++i
Object.defineProperty Program,                  "type", value : ++i
Object.defineProperty VertexShaderSource,       "type", value : ++i
Object.defineProperty FragmentShaderSource,     "type", value : ++i
Object.defineProperty ShaderCompilation,        "type", value : ++i
Object.defineProperty ShaderAttribute,          "type", value : ++i
Object.defineProperty ShaderUniform,            "type", value : ++i
Object.defineProperty ShaderVertexArray,        "type", value : ++i
Object.defineProperty DrawBuffer,               "type", value : ++i
Object.defineProperty DrawBufferAllocation,     "type", value : ++i
Object.defineProperty DrawCall,                 "type", value : ++i
Object.defineProperty Mesh,                     "type", value : ++i
Object.defineProperty Position,                 "type", value : ++i
Object.defineProperty Rotation,                 "type", value : ++i
Object.defineProperty Scale,                    "type", value : ++i
Object.defineProperty Color,                    "type", value : ++i
Object.defineProperty Matrix,                   "type", value : ++i
Object.defineProperty Vector,                   "type", value : ++i
Object.defineProperty Vertices,                 "type", value : ++i
Object.defineProperty Calculation,              "type", value : ++i

Object.defineProperty Mesh,                     "length", value : 48
Object.defineProperty Position,                 "length", value : 3

Object.defineProperty Pointer,                  "byteLength",
    get : ->
        length = 0
        parent = this

        while Number isnt parent
            length += parent.length
            parent = Object.getPrototypeOf parent

        length * 4
Object.defineProperty Pointer,                  "of",
    value : ( ptri ) ->
        ptri and new classes[ getType ptri ] ptri
Object.defineProperty Pointer,                  "malloc",
    get : ->
        ptri = new this malloc @byteLength, @type
        ( extras ) -> ptri
        

Object.defineProperty Pointer::,                "{{Pointer}}",
    get : ->
        [   nextOffset, byteLength, type, state, parent, linkedi,
            isUpdated, isUploaded, iterOffset, iterLength, ...rest ] =
            i32 = new Int32Array buffer, this - 64, 16

        {
            nextOffset, byteLength, type, state, parent, linkedi,
            iterOffset, iterLength, rest, i32,

            parent : @getParent this
            islinked : !!getLink this
            link : @getLinked this
            storage : @storage
            needsUpdate : !isUpdated
            needsUpload : !isUploaded
        }

Object.defineProperties Pointer::,

    [ Symbol.iterator ] : value : ( prev = 0 ) ->

        next = +prev
        ptri = +this

        Iterator.from next : ->
            if !next = nextChild ptri, next
                return done : true
            value : Pointer.of next


    storage     : value : [0]

    getParent   : value : -> Pointer.of getParent this
    setParent   : value : -> setParent this, arguments[0] ; this
    
    getLinked   : value : ->
        if  0 < i = getLink this
            return Pointer.of i 
        return @storage[ -i ] 

    setLink     : value : ( any ) ->
        if !(any instanceof Pointer) and !isPointer any
            if  -1 is i = @storage.indexOf any
                i += @storage.push any
            any = -i
        setLink this, any ; any

    getState    : value : -> getState this
    setState    : value : -> setState this, arguments[0] ; this

    parent      : get : ->
        Pointer.of getParent this

    children    : get : ->
        children = []
        children . push i for i from this
        children

onmessage = (e) -> WebAssembly.instantiate( e.data,

    console     : {
        log, warn, error,

        memdump : ( byteOffset, byteLength, typeId ) ->
            warn "-->", {
                byteOffset,
                byteLength,
                typeId,
                i32 : new Int32Array buffer, byteOffset, byteLength/4
                headers: new Int32Array buffer, byteOffset-64, 16
            }
    }

).then ({ exports: wasm }) ->
    {
        memory,
        init,
        malloc,
        isPointer,
        nextChild,
        setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded,
        getHeader, getType, getParent, getLink, isUpdated, isUploaded
    } = wasm

    buffer = memory.buffer
    dataView = new DataView buffer


    mesh = new Mesh.malloc()
    position = new Position.malloc()


    mesh2 = new Mesh.malloc()
    position2 = new Position.malloc()


    mesh3 = new Mesh.malloc()
    position3 = new Position.malloc()


    mesh4 = new Mesh.malloc()
    position4 = new Position.malloc()


    mesh5 = new Mesh.malloc()
    position5 = new Position.malloc()

    position.setLink new OffscreenCanvas(1,1)
    mesh.setLink new OffscreenCanvas(1,1)
    position.setLink mesh.getLinked()

    setParent position, mesh
    setParent position2, mesh
    setParent position3, mesh

    log mesh, position, position2, position3

    init()
