import KEYOF from "./0ptr_keyof.js"
import { defaults } from "./0ptr_self.js"
import { Pointer } from "./0ptr_pointer.js"

isCPU    = /cpu/.test name

isBridge = WorkerGlobalScope? and !isCPU

class TypedArray extends Pointer

    @byteLength : 9444242

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

            if  isCPU and !memory.loadUint32 7
                #? if cpu reaches before bridge?
                memory.lock 7

            #? this settlement cpu's + bridge
            length = @length
            done = yes

            if  isBridge
                #? this settlement only bridge
                @iterate 0

                #? all cpu's start calculate
                memory.storeUint32 7, 1
                memory.unlock 7

                #? bridge stay still
                memory.lock 6

            next : ->

                if  isBridge
                    return { done }

                if  length > value = @iterate()
                    return { value }

                else
                    memory.unlock 6
                    return { done }

            .bind @

    ).call( object )

export {
    TypedArray as default,
    TypedArray  , defaults,
    Pointer
}