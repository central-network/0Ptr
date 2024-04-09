isCPU    = /cpu/.test name
isBridge = WorkerGlobalScope? and !isCPU

HEADERS_HINDEX              = 0

HINDEX_BEGIN                = HEADERS_HINDEX++
    
HINDEX_END                  = HEADERS_HINDEX++

HINDEX_LENGTH               = HEADERS_HINDEX++

HINDEX_PROTOCLASS           = HEADERS_HINDEX++

HINDEX_RESOLV_CID           = HEADERS_HINDEX++

HINDEX_RESOLV_PTR           = HEADERS_HINDEX++

HINDEX_BYTELENGTH           = HEADERS_HINDEX++

HINDEX_BYTEOFFSET           = HEADERS_HINDEX++

HINDEX_ITERATOR_I           = HEADERS_HINDEX++

export class Pointer   extends Number

    @TypedArray             : Uint8Array

    @byteLength             : 0

    constructor             : ( ptri ) ->

        unless arguments.length

            if  isCPU and !memory.loadUint32 3
                memory.lock 3

            call = memory.resolvCall()
            
            if  isCPU
                super ptri = memory.loadResolv call

            if  isBridge
                memory.malloc super ptri = memory.malloc()
                memory.storeResolv call, this
                memory.storeUint32 3, 1
                memory.unlock 3

        else super ptri

        if ( isCPU and @proxyOnCPU )
            return new Proxy this, @proxyHandle ptri
                
    proxyHandle             : ( ptri ) ->

        length = memory.loadUint32 ptri + HINDEX_LENGTH
        begin = memory.loadUint32 ptri + HINDEX_BEGIN
        byteOffset = memory.loadUint32 ptri + HINDEX_BYTEOFFSET

        array = new @constructor.TypedArray(
            memory, byteOffset, length
        )

        valueOf = -> ptri

        get : ( ref, key ) ->
            #console.log name, "proxy get:", { key }

            if  key is Symbol.toPrimitive
                return -> return ptri

            try unless isNaN key
                return array[ key ]

            switch key
                when "length" then return length
                when "valueOf" then return valueOf
                #todo "next" then return ...

            Reflect.get arguments...
            
        set : ( ref, key, val ) ->
            #console.log name, "proxy set:", { key, val }, array[key]

            unless isNaN key
                array[ key ] = val
                return key

            Reflect.set arguments...

        has : ( ref, key ) ->
            console.log name, "proxy has:", { ref, key }
            Reflect.has arguments...

        ownKeys : ( ref ) ->
            console.log name, "proxy ownKeys:", { ref }
            Reflect.ownKeys arguments...

        getPrototypeOf : ( ref ) ->
            console.log name, "proxy getPrototypeOf:", { ref }
            Reflect.getPrototypeOf arguments...

        getOwnPropertyDescriptor : ( ref, key ) ->
            res = Reflect.getOwnPropertyDescriptor arguments...
            console.log name, "proxy getOwnPropertyDescriptor:", { ref, key, res }
            res

Object.defineProperties Pointer::,

    array                   :
        get : -> new this.realizeWith memory, @byteOffset, @length
        
    byteOffset              :
        get : -> memory.loadUint32 this + HINDEX_BYTEOFFSET
        
    byteLength              :
        get : -> memory.loadUint32 this + HINDEX_BYTELENGTH

    length                  :
        get : -> memory.loadUint32 this + HINDEX_LENGTH

    iterate                 :
        value               : ->
            unless arguments.length
                return memory.addUint32 this + Pointer.HINDEX_ITERATOR_I, 1

            if  isCPU # mark remove if not debugging
                /SET_ITERATOR_INDEX_FORBIDDEN_ON_CPU/.throw [ this, name ]
            
            memory.storeUint32 this + Pointer.HINDEX_ITERATOR_I, arguments[0]

    [ /{[Pointer]}/.source ] : get : ->

        protoclass  : memory.scope.store @constructor::

        memory      : memory

        TypedArray  : @buffer.slice().buffer

        byteLength  : @constructor.byteLength

        headers     : memory.subarrayUint32( +this, this + memory.COUNT_OF_HEADERS )

