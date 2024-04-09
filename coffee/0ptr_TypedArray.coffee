import KEYOF from "./0ptr_keyof.js"
import { defaults } from "./0ptr_self.js"
import { Pointer } from "./0ptr_pointer.js"

class TypedArray extends Pointer

    @byteLength : 12

    proxyOnCPU  : on

    solve       : ->
        [ buffer, byteOffset, length ] = arguments

        unless isNaN buffer
            @alloc buffer

        # todo clone needed
        else if ArrayBuffer.isView buffer
            @alloc buffer.length

        else if Array.isArray buffer
            @alloc buffer.length

        else if buffer.byteLength
            @alloc buffer.byteLength / @BYTES_PER_ELEMENT

        else throw [ "What is this", arguments... ]

    alloc       : ( length ) ->

        byteLength = length * @BYTES_PER_ELEMENT
        byteOffset = memory.malloc byteLength

        begin = byteOffset / 4
        end = begin + length

        memory.setByteLength this, byteLength
        memory.setBegin this, begin
        memory.setEnd this, end

        this

    @fromLength : ( length ) ->
        new this().alloc length * this::BYTES_PER_ELEMENT
        
    subarray    : ->
        [ begin = 0, end = 0 ] = arguments

        begin += memory.getBegin this
        end or= memory.getEnd this

        memory[ "subarray#{@constructor.name.replace(/Array/, "")}" ] begin, end
        
    Object.defineProperties this::,

        buffer      : get : ->
            new this.realizeWith memory, @byteOffset, @length

        byteOffset  : get : ->
            memory.loadUint32 this + @constructor.HINDEX_BYTEOFFSET

        byteLength  : get : ->
            memory.loadUint32 this + @constructor.HINDEX_BYTELENGTH

        length      : get : ->
            memory.loadUint32 this + @constructor.HINDEX_LENGTH

Object.defineProperties self,

    Uint8Array      : value : ( class Uint8Array      extends TypedArray )
            
    Int8Array       : value : ( class Int8Array       extends TypedArray )

    Int16Array      : value : ( class Int16Array      extends TypedArray )

    Uint16Array     : value : ( class Uint16Array     extends TypedArray )

    Uint32Array     : value : ( class Uint32Array     extends TypedArray )

    Int32Array      : value : ( class Int32Array      extends TypedArray )

    Float32Array    : value : ( class Float32Array    extends TypedArray )

    Float64Array    : value : ( class Float64Array    extends TypedArray )

    BigUint64Array  : value : ( class BigUint64Array  extends TypedArray )

    BigInt64Array   : value : ( class BigInt64Array   extends TypedArray )

for n, object of defaults

    continue unless object.BYTES_PER_ELEMENT
    
    ( -> Object.defineProperties self[ @name ]::,
    
        realizeWith             : value : this

        BYTES_PER_ELEMENT       : value : @BYTES_PER_ELEMENT

        [ Symbol.iterator ]     : value : ->

            if  self.isCPU

                #? if cpu reaches before bridge?
                memory.lock 3

            #? this settlement cpu's + bridge
            length = @length

            if  self.isBridge
                #? this settlement only bridge
                @next = 0

                #? all cpu's start calculate
                memory.unlock 3

                #? bridge stay still
                memory.lock 4

            next : ->
                if  length > next = @next
                    return { done: off, value: next }

                else
                    memory.unlock 4 if self.isCPU
                    return { done: yes, value: this }
            .bind @

    ).call( object )

export {
    TypedArray as default,
    TypedArray  , defaults,
    Pointer
}