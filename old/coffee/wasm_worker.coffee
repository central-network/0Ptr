{ log, warn, error, table, debug, info } = console

[
    document = null
    assign = Object.assign
    buffer = null
    decode = TextDecoder::decode.bind new TextDecoder
    dvw = null
    {
        memory,
        init,
        malloc,
        isPointer,
        nextChild,
        getByteLength,
        setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded,
        getHeader, getType, getParent, getLink, isUpdated, isUploaded
    } = {}

    iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1

    RADIAN_TO_DEGREE = Math.PI / 180
    
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
        class Modifier              extends Pointer
        class Vector                extends Pointer
        class Vertices              extends Pointer
        class Calculation           extends Pointer
        class HTMLElement           extends Pointer
        class HTMLDocument          extends HTMLElement
        class HTMLCanvasElement     extends HTMLElement
        
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
        Object.defineProperty Modifier,                 "type", value : ++i
        Object.defineProperty Calculation,              "type", value : ++i
        Object.defineProperty HTMLElement,              "type", value : ++i
        Object.defineProperty HTMLDocument,             "type", value : ++i
        Object.defineProperty HTMLCanvasElement,        "type", value : ++i
        
        Object.defineProperty Mesh,                     "length", value : 48
        Object.defineProperty Matrix,                   "length", value : 16
        Object.defineProperty Modifier,                 "length", value : 8
        Object.defineProperty Vector,                   "length", value : 4
        Object.defineProperty Position,                 "length", value : 4
        Object.defineProperty Rotation,                 "length", value : 4
        Object.defineProperty Scale,                    "length", value : 4
        Object.defineProperty Color,                    "length", value : 4
        Object.defineProperty HTMLDocument,             "length", value : 4 * 0xfff
        Object.defineProperty HTMLCanvasElement,        "length", value : 4 * 0xff
    ]

    getter =
        f32 : -> new Float32Array buffer, this, getByteLength(this)/4

    setter =
        f32 : -> getter.f32.call( this ).set arguments...
]

Object.defineProperties Pointer     , byteLength :
    get : ->
        length = 0
        parent = this

        while Number isnt parent
            length += parent.length
            parent = Object.getPrototypeOf parent

        length * 4
Object.defineProperties Pointer     , of         :
    value : ( ptri ) ->
        ptri and new classes[ getType ptri ] ptri
Object.defineProperties Scale       , default    :
    value : Float32Array.of(1, 1, 1).buffer
Object.defineProperties Color       , default    :
    value : Float32Array.of(0, 0, 0, 1).buffer
Object.defineProperties Pointer     , malloc     :
    get : ->
        ptri = 0
        This = this

        if  @byteLength
            ptri = new this malloc @byteLength, @type

            if  def = @default
                new Uint8Array buffer
                    .set new Uint8Array( def ), ptri

        ( byteLength ) ->

            if  ptri and byteLength
                throw /MALLOC_ERROR/

            if !ptri
                ptri = new This malloc byteLength, This.type

                if  def = This.default
                    new Uint8Array buffer
                        .set new Uint8Array( def ), ptri

            ptri

Object.defineProperties Pointer::   ,
    [  "{{Pointer}}"  ] :
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
    [ Symbol.iterator ] :
        value : ( prev = 0 ) ->

            next = +prev
            ptri = +this

            Iterator.from next : ->
                if !next = nextChild ptri, next
                    return done : true
                value : Pointer.of next
    
    storage     : value : [0]
    buffer      : get   : ->
        buffer.slice this, this + getByteLength this
    getParent   : value : -> Pointer.of getParent this
    setParent   : value : -> setParent this, arguments[0] ; this
    getLinked   : value : ->
        if  0 < i = getLink this
            return Pointer.of i 
        return @storage[ -i ] 
    setLinked   : value : ( any ) ->
        log any
        if !(any instanceof Pointer) and !isPointer any
            if  -1 is i = @storage.indexOf any
                i += @storage.push any
            any = -i
        setLink this, any ; any
    getState    : value : -> getState this
    setState    : value : -> setState this, arguments[0] ; this
    parent      : get   : -> Pointer.of getParent this
    children    : get   : ->
        children = []
        children . push i for i from this
        children
Object.defineProperties Color::     ,
    normalized  :
        enumerable : on
        get : -> new Float32Array buffer, this, 4
    asObject    :
        get     : ->
            red     : dvw.getFloat32 this, iLE
            green   : dvw.getFloat32 this + 4, iLE
            blue    : dvw.getFloat32 this + 8, iLE
            alpha   : dvw.getFloat32 this + 12, iLE
    asArray     :
        get     : ->
            Array.of(
                Math.floor 0xff * dvw.getFloat32( this, iLE)
                Math.floor 0xff * dvw.getFloat32( this + 4, iLE)
                Math.floor 0xff * dvw.getFloat32( this + 8, iLE)
                Math.floor 0xff * dvw.getFloat32( this + 12, iLE)
            )
    asString    :
        get     : ->
            "0x" + [ ...@asArray ].map (v) ->
                v.toString(16).padStart 2, 0
            .join ""
    asNumber    :
        get     : -> parseInt @asString
    children    :
        value   : []
Object.defineProperties Vector::    , vecprops =
    x           :
        enumerable : on
        get : -> dvw.getFloat32 this, iLE
        set : -> dvw.setFloat32 this, arguments[0], iLE
    y           :
        enumerable : on
        get : -> dvw.getFloat32 this + 4, iLE
        set : -> dvw.setFloat32 this + 4, arguments[0], iLE
    z           :
        enumerable : on
        get : -> dvw.getFloat32 this + 8, iLE
        set : -> dvw.setFloat32 this + 8, arguments[0], iLE
    resvf32     :
        get : -> dvw.getFloat32 this + 12, iLE
        set : -> dvw.setFloat32 this + 12, arguments[0], iLE
    children    :
        value   : []
    length      :
        value   : 3
    vecLength   :
        get     : ->
            sum = 0
            byteLength = getByteLength this
            byteOffset = this + byteLength
            length = byteLength / 4
            
            while length--
                if  val = dvw.getFloat32 byteOffset -= 4, iLE
                    sum = sum + Math.pow val, 2

            Math.sqrt sum
    set         :
        value   : setter.f32
Object.defineProperties Position::  , vecprops
Object.defineProperties Rotation::  , vecprops
Object.defineProperties Scale::     , vecprops
Object.defineProperties Mesh::      ,
    # inner allocations 
    offset      :
        value   :
            matrix   : 4
            position : 8
            rotation : 12
            scale    : 16
            color    : 20
            vertices : 24

    # check but not create
    getPosition :
        value   : ->
            dvw.getInt32 this + @offset.position, iLE
    getRotation :
        value   : ->
            dvw.getInt32 this + @offset.rotation, iLE
    getScale    :
        value   : ->
            dvw.getInt32 this + @offset.scale, iLE
    getColor    :
        value   : ->
            dvw.getInt32 this + @offset.color, iLE
    getVertices :
        value   : ->
            dvw.getInt32 this + @offset.vertices, iLE

    # check and create if has not
    position    :
        enumerable: on
        get     : ->
            if !ptri = @getPosition()
                return @position =
                    new Position.malloc()
            new Position ptri

        set     : ( ptri ) ->
            dvw.setInt32 this + @offset.position, ptri, iLE ; ptri
    rotation    :
        enumerable: on
        get     : ->
            if !ptri = @getRotation()
                return @rotation =
                    new Rotation.malloc()
            new Rotation ptri

        set     : ( ptri ) ->
            dvw.setInt32 this + @offset.rotation, ptri, iLE ; ptri
    scale       :
        enumerable: on
        get     : ->
            if !ptri = @getScale()
                return @scale =
                    new Scale.malloc()
            new Scale ptri

        set     : ( ptri ) ->
            dvw.setInt32 this + @offset.scale, ptri, iLE ; ptri
    color       :
        enumerable: on
        get     : ->
            if !ptri = @getColor()
                return @color =
                    new Color.malloc()
            new Color ptri

        set     : ( ptri ) ->
            dvw.setInt32 this + @offset.color, ptri, iLE ; ptri
    vertices    :
        enumerable: on
        get     : ->
            if !ptri = @getVertices()
                return null    
            new Vertices ptri 

        set     : ( ptri ) ->
            dvw.setInt32 this + @offset.vertices, ptri, iLE ; ptri     
Object.defineProperties Vertices::  ,
    vertexArray :
        enumerable: on
        get     : getter.f32

    length      :
        enumerable: on
        get     : -> getByteLength(this)/4

    pointsCount :
        enumerable: on
        get     : -> getByteLength(this)/12

    set         :
        value   : setter.f32
Object.defineProperties Modifier::  ,

    children    : value : []

    multer      :
        get     : -> new Float32Array buffer, this, 4
        set     : -> @multer.set arguments... ; this

    summer      :
        get     : -> new Float32Array buffer, this + 16, 4
        set     : -> @summer.set arguments... ; this

    include     : value : ( ptri ) ->
        
        [ xM, yM, zM, wM, xS, yS, zS, wS ] =
            _f32 = new Float32Array buffer, this, 8

        while ptri 
            [ tx, ty, tz, tw ] = getter.f32.call ptri.position
            [ rx, ry, rz, rw ] = getter.f32.call ptri.rotation
            [ sx, sy, sz, sw ] = getter.f32.call ptri.scale

            _f32.set [
                rx * sx * xM,   ry * sy * yM,
                rz * sz * zM,   rw * sw * wM, 
                
                tx * sx + xS,   ty * sy + yS, 
                tz * sz + zS,   tw * sw + wS,
            ]

            ptri = ptri.parent

        this
 
    apply       : value : ( ptri, ptrout, dim = 3 ) ->

        byteOffset = ptrout || ptri
        byteLength = getByteLength ptri

        #  [ .., y, x ]          
        #       [ ..., 2, 1, 0 ]

        while dim-- and offset = byteLength
            
            mulOffset = this + ( dim * 4 )
            summOffset = mulOffset + 16 # 4*4

            MUL = dvw.getFloat32 mulOffset, iLE
            summ = dvw.getFloat32 summOffset, iLE

            warn "mulOffset:", mulOffset, ":", MUL, "&&", "summOffset:", summOffset, ":", summ

            while offset -= 4

                valueOffset = ptri + offset
                value = dvw.getFloat32 valueOffset, iLE

                warn "\tvalueOffset:", valueOffset, ":", value, "->", "byteOffset:", byteOffset + offset, ":", ( ( value * MUL ) + summ )

                dvw.setFloat32( byteOffset + offset, 
                    ( ( value * MUL ) + summ ),
                iLE )

        ptrout || ptri
Object.defineProperties Rotation::  ,
    asRatians   :
        get     : ->
            new Float32Array buffer, this, 3
    asDegrees   :
        get     : ->
            @asRatians.map (v) -> v / RADIAN_TO_DEGREE

    

Object.defineProperties HTMLElement::,

    slotref     :
        enumerable: on
        get     : -> getLink this
        set     : -> setLink this, arguments[0]

    read        :
        enumerable: on
        value   : ->
            JSON.parse decode @byteArray.slice(
                4, 4 + dvw.getInt32 this, iLE )

    lock        :
        value   : ->
            Atomics.wait new Int32Array buffer, this, 1

    byteArray   : 
        get     : ->
            new Uint8Array(
                buffer, this, getByteLength this 
            )

    call        :
        value   : ( chain, ...args ) ->
            @lock postMessage {
                @byteArray, args, chain
            }
            @read()

Object.defineProperties HTMLDocument::,

    name            : value : "document"

    TagElement      : value :
        canvas      : HTMLCanvasElement

    createElement   : value : ( tagName ) ->
        slotref = @call "document.createElement", tagName
        Element = @TagElement[ tagName ] or HTMLElement
        element = new Element.malloc()

        setParent element, this
        assign element, { slotref }
    

Object.defineProperties HTMLCanvasElement::,

    tagName         : value : "canvas"

    baseURI         :
        get   : -> @call "$#{@slotref}.baseURI"


oninit = ->
    document = new HTMLDocument.malloc()
    canvas = document.createElement "canvas"


    log canvas

    a = ->
        adapter = await navigator.gpu.requestAdapter();
        device = await adapter.requestDevice();
        commandEncoder = device.createCommandEncoder();

        renderPassDescriptor = {
            colorAttachments: [{
                clearValue: Float32Array.of(1,1,1,1),
                loadOp: "clear",
                storeOp: "store",
                view: context.getCurrentTexture().createView(),
            }]
        }; 

        passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(renderPipeline);


        vertices = new Float32Array([
            0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1, 0,
            0, 1, 1,
        ]);

        vertexBuffer = device.createBuffer({
            size: vertices.byteLength
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        })

        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.draw(3);
        passEncoder.end();

        device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length)

        device.queue.submit([commandEncoder.finish()])

oninstantiate = ({ exports: wasm }) ->            

    {
        memory, malloc,
        isPointer, nextChild, getByteLength,
        setHeader, setType, setParent, setLink, setIsUpdated, setIsUploaded,
        getHeader, getType, getParent, getLink, isUpdated, isUploaded
    } = wasm

    dvw = new DataView(
        buffer = memory.buffer
    )

    mesh = new Mesh.malloc()
    mesh2 = new Mesh.malloc()
    mesh3 = new Mesh.malloc()
    
    mesh.position.set [1, 0, -5]
    mesh.rotation.set [1.1, 0.4, 1.57]
    
    mesh2.position.set  [1, 0, -5]
    mesh2.scale.set     [1.1, 1, 1]
    
    mesh3.position.set [1, 0, -5]
    
    mesh3.rotation.set [.1, 0, -.5]
    mesh3.scale.set    [2, 2, 2]
    
    mesh.vertices = new Vertices.malloc( 3 * 3 * 4 )
    mesh.vertices.set [
        1, 0, 0,
        -1, 0, 0,
        0, 1.7, 0,
    ]

    setParent mesh, mesh2
    setParent mesh2, mesh3

    log mesh3

    log mod = new Modifier.malloc()
    mod.include mesh
    log ...getter.f32.call mod

    out = new Vertices.malloc( 3 * 3 * 4 )

    #log mod.apply(
    #    mesh.vertices, out, 3
    #)

    oninit()

onmessage = ({ data }) -> switch true 

    when ( data instanceof WebAssembly.Module ) 
        WebAssembly.instantiate( data,
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

        ).then oninstantiate 

    ###
    postQueue = [,]
    postMessage = ( ( send ) -> ( packet ) -> send assign(
        packet, { done : -1 + postQueue.push packet.done }
    )).call( this, postMessage )
    when ( data.type is "response" )
        postQueue.splice( data.done, 1 )[0]( data.data )
    ###

    else throw data
        
