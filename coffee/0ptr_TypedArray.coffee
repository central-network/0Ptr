import defaults from "./0Ptr_self.js"
import { Pointer } from "./OPtr_pointer.js"

export class TypedArray extends Pointer

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
        unless arguments.length
            throw [ "POINTER_NEEDS_ARGS" ]

        super()

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

        memory.storeUint32 this + 1, byteLength
        memory.storeUint32 this + 2, begin
        memory.storeUint32 this + 3, end

        this

    @fromLength : ( length ) ->
        new this().alloc length * this::BYTES_PER_ELEMENT        

    Object.defineProperties this::,

        headers : get : -> memory.subarrayUint32 this , this + 4 
        
        array : get : -> @subarray()