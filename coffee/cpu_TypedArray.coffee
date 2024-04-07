import { defaults } from "./0Ptr_self.js"
import { Pointer } from "./cpu_pointer.js"

class TypedArray extends Pointer

    #*   headers has 4 items:
    #* - nexti4     : memory's next index  index4(ptr) + 8 (head + data(ptr))
    #* - byteLength : data byte [not aligned] length {it's 0 when deleted} 
    #* - parent     : if this record has parent record
    #* - type       : protoclass of TypedArrayPointer

    #?   typed array pointers needs 4 elements:
    #? - index4 : start index of targeted Typed Array's header
    #? - begin  : beginning of array's content   - index of 1/2/4/8 
    #? - end    : end of content
    #? - type   : protoclass of TypedArray (Uint8Array etc.)

    constructor : ->
        #console.warn ResolveCall()

        unless arguments.length
            throw [ "POINTER_NEEDS_ARGS" ]

        super()

        #[ buffer, byteOffset, length ] = arguments

        #unless isNaN buffer
        #    @alloc buffer

        # todo clone needed
        #else if ArrayBuffer.isView buffer
        #    @alloc buffer.length

        #else if Array.isArray buffer
        #    @alloc buffer.length

        #else if buffer.byteLength
        #    @alloc buffer.byteLength / @BYTES_PER_ELEMENT

        #else throw [ "What is this", arguments... ] 


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

        array   : get : -> @subarray()

Object.defineProperties self,

    Uint8Array      : value : class Uint8Array      extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Uint8Array

    Int8Array       : value : class Int8Array       extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Int8Array

    Int16Array      : value : class Int16Array      extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Int16Array

    Uint16Array     : value : class Uint16Array     extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Uint16Array

    Uint32Array     : value : class Uint32Array     extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Uint32Array

    Int32Array      : value : class Int32Array      extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Int32Array

    Float32Array    : value : class Float32Array    extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Float32Array

    Float64Array    : value : class Float64Array    extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.Float64Array

    BigUint64Array  : value : class BigUint64Array  extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.BigUint64Array

    BigInt64Array   : value : class BigInt64Array   extends TypedArray
        @protoclass : @scopei()
        realizeWith : defaults.BigInt64Array


export {
    TypedArray as default,
    TypedArray  , defaults
}