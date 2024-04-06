import defaults from "./0Ptr_self.js"
export { Scope } from "./0Ptr_scope.js"

protoclasses = [ weakmap = new WeakMap(), ]

Object.defineProperties Symbol,
    pointer                 :
        value               : "{[Pointer]}"

export class Pointer   extends Number

    @TypedArray             : defaults.Uint32Array

    @byteLength             : 0

    HINDEX_PROTOCLASS       : 7


    HINDEX_BEGIN            : 0

    HINDEX_END              : 1
    
    HINDEX_LENGTH           : 2
    

    HINDEX_PARENT           : 3


    HINDEX_BYTEOFFSET       : 4

    HINDEX_BYTELENGTH       : 5

    HINDEX_BYTEFINISH       : 6

    HINDEX_RESERVED         : 7

    @scopei                 : ->
        if !weakmap.has this:: 
            weakmap.set this::, protoclasses[ i = protoclasses.length ] = this::
            
            Object.defineProperty this::, "protoclass", { value : i }

            if  bpe = defaults[ @name ]?.BYTES_PER_ELEMENT

                Object.defineProperty this::,
                    "BYTES_PER_ELEMENT", { value : bpe }

        i

    toPointer               : -> this

    constructor             : ->
        unless arguments.length
            super memory.malloc()                
            memory.setProtoClass this, @protoclass

        else
            super arguments[0]
            @usePrototype arguments[1]

    usePrototype            : ->
        return this unless @constructor is Pointer

        protoclass = arguments[0] ? @scope.get(
            @loadHeader @HINDEX_PROTOCLASS
        )
        
        Object.setPrototypeOf this, protoclass

    getPrototype            : ->
        protoclasses[ memory.getProtoClass this ]

    getIndex                : ->
        memory.getBegin( this ) + arguments[0] or 0 

    storeObject             : ->
        memory.storeObject this, arguments[0], arguments[1] 

    loadObject              : ->
        memory.loadObject this, arguments[0]

export class RefLink    extends Pointer

Object.defineProperties RefLink::,

    HINDEX_SCOPEI   :
        value       : 1 + Pointer::HINDEX_RESERVED

    setRef          :
        value       : ->
            scopei = @scope.add arguments[0]
            @storeHeader @HINDEX_SCOPEI, scopei
            ; @

    link            :
        get         : -> @scope.get @loadHeader @HINDEX_SCOPEI

Object.defineProperties Boolean::,

    get                     : value : ( ptri ) ->
        @scope[ "#{ptri}" ]?.deref()

    set                     : value : ( object, ptri ) ->
        Object.defineProperty @scope, ptri,
            value : new WeakRef object
        ptri

    add                     : value : ( object ) ->
        unless Object.hasOwn object, Symbol.pointer
            Object.defineProperty object, Symbol.pointer,
                value : ptri = @malloc object
            @set object, ptri
        @get object[ Symbol.pointer ]

    find                    : value : ->
        for ptri in Object.getOwnPropertyNames @scope
            object = @scope[ ptri ].deref()
            return object if object is arguments[0]
        null

    malloc2                 : value : ->
        
        protoclass = arguments[0].constructor
        byteLength = @BYTES_PER_POINTER

        if  protoclass?.  byteLength 
            byteLength += protoclass.byteLength

        if  @byteLength < byteOffset = byteLength + @byteOffset 
            byteOffset += @BYTES_PER_ELEMENT * 4096

            if  @maxByteLength < byteOffset
                throw [ "MAX_GROWABLE_MEMORY_LENGTH_EXCEED", @ ]

            @grow byteOffset

        @addUint32 @INDEX_COUNT, 1

        length = byteLength / 4
        index4 = @addUint32 @INDEX_LENGTH, length
        offset = @addUint32 @INDEX_OFFSET, byteLength

        @storeUint32 index4 + 0, length 
        @storeUint32 index4 + 1, byteLength
        @storeUint32 index4 + 2, length - @ITEMS_PER_POINTER
        @storeUint32 index4 + 3, byteLength - @BYTES_PER_POINTER

        index4

    byteOffset              :
        get     : -> @loadUint32  @INDEX_OFFSET
        set     : -> @storeUint32 @INDEX_OFFSET, arguments[0]

    #? sab length
    length                  :
        get     : -> @loadUint32  @INDEX_LENGTH
        set     : -> @storeUint32 @INDEX_LENGTH, arguments[0]

    #? scope length
    count                   :
        get     : -> @loadUint32  @INDEX_COUNT
        set     : -> @storeUint32 @INDEX_COUNT, arguments[0]

    #? iteration index
    index                   :
        get     : ->
            index = @loadUint32 @INDEX_NEXT
            length = @loadUint32 index 
            @addUint32 @INDEX_NEXT, length
            index

        set     : ->
            @storeUint32 @INDEX_NEXT, @BEGIN + arguments[0]

    iterator                :
        value   : ->
            @storeUint32 @INDEX_NEXT, @BEGIN

            return =>
                unless value = @get @index
                    return done : on
                return { value }
    
Object.defineProperties Pointer::,

    memory                  : get : -> memory
    
    scope                   : get : -> memory.scope

    findAllChilds           : value : ( protoclass ) ->
        offset = 
        hindex = Pointer::HINDEX_PARENT
        pclass = Pointer::HINDEX_PROTOCLASS - hindex
        stride = Pointer.ITEMS_PER_POINTER
        length = Pointer.length
        parent = this * 1
        childs = []

        if  protoclass
            protoclass = @scope.has protoclass::

        while length > offset += stride

            if  parent is memory.loadUint32 offset

                continue if (
                    protoclass and 
                    protoclass - memory.loadUint32 offset + pclass
                )

                childs.push new Pointer offset - hindex



        return childs

    [ Symbol.iterator ]     : value : ->
        next : @iterator()

    [ Symbol.pointer ]      : get   : ->

        protoclass      = @loadHeader @HINDEX_PROTOCLASS
        prototype       = @scope.get protoclass
        constructor     = prototype . constructor
        TypedArray      = constructor . TypedArray ? Uint8Array

        parent          = Number::toPointer.call @loadHeader @HINDEX_PARENT

        begin           = @loadHeader @HINDEX_BEGIN
        end             = @loadHeader @HINDEX_END
        length          = @loadHeader @HINDEX_LENGTH

        byteOffset      = @loadHeader @HINDEX_BYTEOFFSET
        byteLength      = @loadHeader @HINDEX_BYTELENGTH
        byteFinish      = @loadHeader @HINDEX_BYTEFINISH


        headersBegin    = this * 1
        headersLength   = Pointer.ITEMS_PER_POINTER
        headersEnd      = headersBegin + headersLength

        #array           = memory[ TypedArray.subarray ]( begin, end )
        #byteArray       = memory.subarrayUint8( byteOffset, byteFinish )
        #headers         = memory.subarrayUint32( headersBegin, headersEnd )
        
        return {
            scope : prototype.scope, parent, children : @findAllChilds(),
            byteOffset, byteLength, byteFinish,
            headersBegin, headersLength, headersEnd,
            begin, end, length,
            protoclass, prototype, constructor
        }
    