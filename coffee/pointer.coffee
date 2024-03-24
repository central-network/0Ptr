addEventListener "message", fn = ( e ) ->

    removeEventListener "message", fn

    Object.defineProperties Pointer::,
        buffer : value : e.data
        
class Pointer               extends Number

    constructor : ->

        unless arguments.length
            super Pointer.byteOffset / 4

            if  byteLength = @constructor.byteLength

                @setByteOffset  i = Pointer.malloc byteLength
                @setByteLength  byteLength
                @setLength      byteLength / @BYTES_PER_ELEMENT

    init : -> this

class Pointer.Number        extends Pointer

class Pointer.Worker        extends Pointer

class Scope                 extends Array

    index       : ->
        if -1 is i = @indexOf arguments[0]
            i += @push arguments[0]
        i

    store       : ->
        @index arguments[0] ; this

    constructor : ->
        
        super().push self

        return this unless document?

        buffer = new SharedArrayBuffer 1e7
        uint8  = new  Uint8Array buffer
        uint32 = new Uint32Array buffer
        uint16 = new Uint16Array buffer
        ptrlen = 4 * 12
        ptrend = ptrlen * 1e5

        Atomics.add uint32, 0, ptrlen
        Atomics.add uint32, 1, ptrend
    
        Object.defineProperties Pointer,

            malloc          : value : -> Atomics.add   uint32, 1, arguments[0]

            byteOffset      : get   : -> Atomics.add   uint32, 0, ptrlen

            byteLength      : get   : -> Atomics.load  uint32, 0

        Object.defineProperties Pointer::,

            setByteOffset   : value : -> Atomics.store uint32, this * 1, arguments[0] ; this

            setByteLength   : value : -> Atomics.store uint32, this + 1, arguments[0] ; this
            
            setLength       : value : -> Atomics.store uint32, this + 2, arguments[0] ; this

            getByteOffset   : value : -> Atomics.load  uint32, this * 1

            getByteLength   : value : -> Atomics.load  uint32, this + 1
            
            getLength       : value : -> Atomics.load  uint32, this + 2

            loadUint32      : value : -> Atomics.load  uint32, this + arguments[0]
            
            storeUint32     : value : -> Atomics.store uint32, this + arguments[0], arguments[1] ; this

            loadUint16      : value : -> Atomics.load  uint16, 2 * this + arguments[0]
            
            storeUint16     : value : -> Atomics.store uint16, 2 * this + arguments[0], arguments[1] ; this

        Object.defineProperties Pointer::,
        
            buffer          : value : buffer

            store           : value : -> scope.index arguments[0]

            proxy           : value : -> scope[ arguments[0] ]

            ["{{Pointer}}"] : get   : ->
                
                pointerByteOffset = this * 4
                headersByteOffset = pointerByteOffset + Pointer.INDEX * 4

                byteOffset  : @getByteOffset()
                byteLength  : @getByteLength()
                length      : @getLength()
                headers     :
                    uint8   : new Uint8Array  buffer, headersByteOffset, 80
                    uint16  : new Uint16Array buffer, headersByteOffset, 40
                    uint32  : new Uint32Array buffer, headersByteOffset, 20

        do ->
            scriptURL = URL.createObjectURL new Blob [
                await ( await fetch( `import.meta.url` ) ).text()
            ], { type: "application/javascript" }

            for i in [ 0 .. 4 ]
                new Worker scriptURL, { type: "module", name : i }
                    .postMessage buffer

        null

scope = new Scope()

Object.defineProperties     Pointer,

    class   : get   : -> scope.store this

    INDEX   : { writable: on, value : 4 }

    LENGTH  : value : 12

    palloc  : value : ->

        typedArray = arguments[0]
        byteLength = @INDEX * 4
        typedIndex = byteLength / typedArray.BYTES_PER_ELEMENT
        byteOffset = byteLength + typedArray.BYTES_PER_ELEMENT
        this.INDEX = byteOffset / 4 ; typedIndex

( TypedArray ) ->

    this[ TypedArray.name ] = class extends this

        name                : TypedArray.name

        TypedArray          : TypedArray

        BYTES_PER_ELEMENT   : TypedArray.BYTES_PER_ELEMENT

    Object.defineProperties this[ TypedArray.name ]::,

        array       : get   : -> new TypedArray @buffer, @getByteOffset(), @getLength()

        subarray    : value : -> @array.subarray arguments...       

.call( Pointer, TypedArray ) for TypedArray in [
    Float32Array, Uint8Array,
    Float64Array, Uint16Array, Uint32Array
]

self.Pointer = Pointer