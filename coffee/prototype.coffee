
Object.defineProperties Object::,

    toPointer               :
        configurable        : on,
        value               : -> new RefLink().setRef( this )

Object.defineProperties Symbol,

    pointer                 :
        value               : "{[Pointer]}"

Object.defineProperties Number::,

    toPointer               : value : ->

        return null unless this

        unless prototype = arguments[0]?.prototype

            protoclass = Pointer::loadHeader.call this, Pointer::HINDEX_PROTOCLASS
            prototype = Pointer::scope.get protoclass

        return new Ptr this if Ptr = prototype.constructor

        return null

Object.defineProperties DataView::,

    littleEndian        : value : new Uint8Array(Uint32Array.of(0x01).buffer)[0]

Object.defineProperties URL,

    createWorkerURL     : value : ->
        this.createObjectURL new Blob [ arguments... ].flat(),
        { type: "application/javascript", endings: "native" }

Object.defineProperties self.SharedArrayBuffer::,

    lock                : value : ( byteOffset = 8 ) ->
        i32 = new Int32Array this, byteOffset, 1
        Atomics.wait i32

    unlock              : value : ( byteOffset = 8 ) ->
        i32 = new Int32Array this, byteOffset, 1
        setTimeout =>
            Atomics.notify i32
        , 400


Object.defineProperties self,

    Worker              : value : class Worker extends self.Worker 

        constructor     : ->
            super arguments[0], { ...{
                type : "module"
                name : crypto.randomUUID()
            }, ...(arguments[1] or {}) }

            @onerror = -> !console.error ...arguments

    SharedArrayBuffer   : value : class SharedArrayBuffer extends self.SharedArrayBuffer

        @byteLength     : 12

        @maxByteLength  : Math.pow navigator?.deviceMemory or 2 , 11

        @littleEndian   : DataView::littleEndian

        constructor     : ->
            byteLength = SharedArrayBuffer.byteLength
            options = maxByteLength : SharedArrayBuffer.maxByteLength

            #? new SharedArrayBuffer()
            unless arguments.length
                return super byteLength, options
                    .initialAlloc()

            #? new SharedArrayBuffer( 256 )
            if  Number.isInteger source = arguments[0]
                byteLength = Math.max source, byteLength
                return super byteLength, arguments[1] or options
                    .initialAlloc()

            #? new SharedArrayBuffer( [2, 41, ...N ] )
            if  Array.isArray source
                source = Uint8Array.from source

            if  source instanceof SharedArrayBuffer
                return source

            #? new SharedArrayBuffer( new ArrayBuffer(256) )
            if  source.byteLength
                byteLength = Math.max source.byteLength , byteLength
                
                return super byteLength, options
                    .initialAlloc().set source

            throw /MEMORY_COULD_NOT_INITIALIZED/

        set             : ( source, byteOffset = 0 ) ->
            new Uint8Array( this ).set(
                new Uint8Array( source.buffer ? source ), 0
            ) ; this

        initialAlloc    : ->
            Atomics.or new Uint32Array( this ), 0, 8
            Atomics.or new Uint32Array( this ), 1, 2

            this
            