isCPU    = /cpu/.test name
isBridge = WorkerGlobalScope? and !isCPU

export class Pointer   extends Number

    @TypedArray             : Uint8Array

    @byteLength             : 0

    constructor             : ( ptri ) ->

        unless arguments.length

            if  isCPU and !memory.loadUint32 3
                memory.lock 3

            call = memory.resolvCall()
            
            if  isCPU
                super memory.loadResolv call

            if  isBridge
                memory.malloc super memory.malloc()
                memory.storeResolv call, this
                memory.storeUint32 3, 1
                memory.unlock 3

        else super ptri

        if ( isCPU and @proxyOnCPU )
            return new Proxy this, @proxyHandle()
                
    proxyHandle             : ->

        get : ( ref, key ) ->
            console.log name, "proxy get:", { ref, key }
            Reflect.get arguments...

        set : ( ref, key, val ) ->

            console.log name, "proxy set:", { ref, key, val }
            Reflect.set arguments...

Object.defineProperties Pointer::,

    next                    :
        get         : ->
            /GET_ITERATOR_INDEX_FORBIDDEN_ON_BRIDGE/.throw this, name if self.isBridge # mark remove if not debugging
            memory.addUint32 this + Pointer.HINDEX_ITERATOR_I, 1

        set         : ->
            /SET_ITERATOR_INDEX_FORBIDDEN_ON_CPU/.throw this, name if self.isCPU # mark remove if not debugging
            memory.storeUint32 this + Pointer.HINDEX_ITERATOR_I, arguments[0]

    [ /{[Pointer]}/.source ] : get : ->

        protoclass  : memory.scope.store @constructor::

        memory      : memory

        TypedArray  : @buffer.slice().buffer

        byteLength  : @constructor.byteLength

        headers     : memory.subarrayUint32( +this, this + memory.COUNT_OF_HEADERS )

