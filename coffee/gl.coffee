import { Pointer } from "./pointer.js"

#? --------------------------------------------- ?#
#?                 Context Context                    ?#
#? --------------------------------------------- ?#

class Context extends Pointer.Float32Array

INDEX_CONTEXT_GL     = Context.ialloc Uint32Array
INDEX_CONTEXT_CANVAS = Context.ialloc Uint32Array

Object.defineProperties Context,

    byteLength      :

        value       : 4 * 2

Object.defineProperties Context::,

    init            :
        value       : ->
            @createCanvas()
            @createContext()

    add             :
        value       : ( ptr ) ->
            ptr.setParent( this ).gl = @getContext() ; this

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

#? --------------------------------------------- ?#
#?                 Context Program                    ?#
#? --------------------------------------------- ?#

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

export { Context as default, Context, Program }