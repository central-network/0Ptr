{ log, warn, error, table, debug, info } = console

buffer = null
storage = [null]
dataView = null
malloc = null
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1


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
Object.defineProperty Pointer,                  "malloc",
    get : ->
        ptri = new this malloc @byteLength, @type
        ( extras ) -> ptri
        

Object.defineProperty Pointer::,                "{{Buffer}}",
    get : ->
        new Uint8Array buffer, this, @constructor.byteLength


onmessage = (e) -> WebAssembly.instantiate( e.data,

    console     : {
        log, warn, error,

        memdump : ( byteOffset, byteLength, typeId ) ->
            warn {
                byteOffset,
                byteLength,
                typeId,
                i32 : new Int32Array buffer, byteOffset, byteLength/4
                headers: new Int32Array buffer, byteOffset-12, 3
            }
            log "\n\n"
    }

).then ({exports}) ->
    {
        memory,
        init,
        malloc,
        relate
    } = exports

    buffer = memory.buffer
    dataView = new DataView buffer



    mesh = new Mesh.malloc()
    position = new Position.malloc()

    relate position, mesh, -1
    log mesh
    log position


    init()
