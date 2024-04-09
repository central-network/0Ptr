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
        max = length - 1
        byteOffset = memory.loadUint32 ptri + HINDEX_BYTEOFFSET

        array = new @constructor.TypedArray(
            memory, byteOffset, length
        )

        valueOf = -> ptri

        get : ( ref, key, pxy ) ->
            #console.log name, "proxy get:", { key }

            if  key is Symbol.toPrimitive
                return -> return ptri

            try unless isNaN key
                return array[ key ]

            switch key
                when "length" then return length
                when "valueOf" then return valueOf
                #todo "next" then return ...

            Reflect.get ref, key, pxy
            
        set : ( ref, key, val ) ->
            #console.log name, "proxy set:", { key, val }

            unless isNaN key
                array[ key ] = val
                unless key - max
                    memory.unlock 7
                return key

            Reflect.set arguments...

        has : ( ref, key ) ->
            console.log name, "proxy has:", { ref, key }
            Reflect.has arguments...

        ownKeys : ( ref, pxy ) ->
            res = Reflect.ownKeys array, pxy
            #console.log name, "proxy ownKeys:", { ref }, res

            cpuCount = self.cpuCount
            cpuIndex = self.name[3] * 1
            keyCount = res.length

            perCount = Math.ceil keyCount / cpuCount
            cpuBegin = cpuIndex * perCount
            cpuEnd   = Math.min keyCount, cpuBegin + perCount

            res.slice cpuBegin, cpuEnd

        getPrototypeOf : ( ref, pxy ) ->
            #console.log name, "proxy getPrototypeOf:", { ref }
            Reflect.getPrototypeOf array, pxy

        getOwnPropertyDescriptor : ( ref, key, pxy ) ->
            #console.log name, "proxy getOwnPropertyDescriptor:", { key }
            Reflect.getOwnPropertyDescriptor array, key, pxy
            
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

