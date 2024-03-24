class GL extends Pointer.Float32Array

INDEX_CANVAS        = GL.palloc( Uint16Array )

INDEX_CONTEXT       = GL.palloc( Uint16Array )

Object.defineProperties GL.class,

    byteLength      :
        value       : 4 * 48

Object.defineProperties GL.prototype,

    init            :
        value       : ->
            @createCanvas()
            .createContext()

Object.defineProperties GL.prototype,

    getCanvas       :
        value       : -> @proxy @loadUint16 INDEX_CANVAS

    setCanvas       :
        value       : -> @storeUint16 INDEX_CANVAS, @store arguments[0]

    getContext      :
        value       : -> @proxy @loadUint16 INDEX_CONTEXT

    setContext      :
        value       : -> @storeUint16 INDEX_CONTEXT, @store arguments[0]

    createCanvas    :
        value       : -> @setCanvas document.createElement "canvas"

    createContext   :
        value       : -> @setContext @canvas.getContext "webgl2"

Object.defineProperties GL.prototype,

    canvas          :
        get         : GL::getCanvas
        set         : GL::setCanvas

    context         :
        get         : GL::getContext
        set         : GL::setContext

export { GL as default, GL }
