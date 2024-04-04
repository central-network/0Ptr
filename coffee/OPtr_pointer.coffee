
Object.defineProperties Object::,

    toPointer               :
        configurable        : on,
        value               : -> new RefLink().setRef( this )

Object.defineProperties Symbol,

    pointer                 :
        value               : "{[Pointer]}"


class Scope     extends Array

    constructor : ->
        super().push(null)

    map : new WeakMap()

    get : ->
        this[ arguments[0] ].deref()

    has : ->
        object = arguments[0]

        return unless @map.has object
       
        for i in [ 1 ... @length ]
            return i if object is @get i
                
        no

    add : ->
        unless @map.has arguments[0]
            @map.set arguments[0], @set arguments[0]
        @map.get arguments[0]

    set : ->
        [ object , i ] = [ arguments..., this.length ]
        ( this[ i ] = new WeakRef object ) ; return i

class Pointer   extends Number

    @TypedArray             : Uint32Array

    @byteLength             : 0

    scope                   : new Scope()

    HINDEX_PROTOCLASS       : 7


    HINDEX_BEGIN            : 0

    HINDEX_END              : 1
    
    HINDEX_LENGTH           : 2
    

    HINDEX_PARENT           : 3


    HINDEX_BYTEOFFSET       : 4

    HINDEX_BYTELENGTH       : 5

    HINDEX_BYTEFINISH       : 6

    HINDEX_RESERVED         : 7
    

    toPointer               : -> this

    constructor             : ->
        unless arguments.length
            return super Pointer.GetNewIndex
                .setHeadersFrom this.constructor 

        super arguments[0]
            .usePrototype arguments[1]

    setHeadersFrom          : ->

        constructr = arguments[0]
        TypedArray = constructr.TypedArray
        protoclass = @scope.add constructr::

        byteLength = constructr.byteLength or 0
        byteOffset = Pointer.malloc byteLength

        begin      = byteOffset / 4
        end        = begin + byteLength / 4
        length     = byteLength / TypedArray.BYTES_PER_ELEMENT
        
        @storeHeader @HINDEX_PROTOCLASS, protoclass
        
        @storeHeader @HINDEX_BEGIN, begin
        @storeHeader @HINDEX_END, end
        @storeHeader @HINDEX_LENGTH, length

        @storeHeader @HINDEX_BYTEOFFSET, byteOffset
        @storeHeader @HINDEX_BYTELENGTH, byteLength
        @storeHeader @HINDEX_BYTEFINISH, byteOffset + byteLength

        this

    loadHeader              : ->
        Pointer.header.loadUint32 this + ( arguments[0] or 0 )

    storeHeader             : ->
        Pointer.header.storeUint32 this + arguments[0] , arguments[1] ; this

    usePrototype            : ->
        return this unless @constructor is Pointer

        protoclass = arguments[0] ? @scope.get(
            @loadHeader @HINDEX_PROTOCLASS
        )
        
        Object.setPrototypeOf this, protoclass

    add                     : ->
        return unless ptr = arguments[0]

        unless ptr instanceof Pointer
            ptr = ptr.toPointer()

        ptr.storeHeader @HINDEX_PARENT, this

Object.defineProperties Pointer,

    ITEMS_PER_POINTER       : value : 12

    BYTES_PER_POINTER       : value : 4 * 12

    buffer                  :
            configurable    : on
            value           : 2#new Thread( 4 * 1e7 )

    array                   :
            value           : -> 

    #! <--- HEADER's SHARED ARRAY BUFFER ONLY
    header                  :
            configurable    : on
            value           : 1#new Thread( 12 * 1e5 )

    GetNewIndex             :
            get             : ->
                return 1;
                @header.addUint32 0, @BYTES_PER_POINTER
                @header.addUint32 1, @ITEMS_PER_POINTER

    length                  :
            get             : ->
                @header.loadUint32 1
                
    malloc                  :
            value           : ( byteLength = 0 ) ->
                @header.addUint32 3, byteLength
    #! HEADER's SHARED ARRAY BUFFER ONLY --->

[ Pointer.GetNewIndex, self.base = Pointer::scope ]

class RefLink extends Pointer

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

    findAllChilds        : value : ( protoclass ) ->
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

            if  parent is Pointer.header.loadUint32 offset

                continue if (
                    protoclass and 
                    protoclass - Pointer.header.loadUint32 offset + pclass
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

        array           = Pointer.buffer[ TypedArray.subarray ]( begin, end )
        byteArray       = Pointer.buffer.subarrayUint8( byteOffset, byteFinish )
        headers         = Pointer.header.subarrayUint32( headersBegin, headersEnd )
        
        return {
            array, scope : prototype.scope, parent, children : @findAllChilds(),
            byteArray, byteOffset, byteLength, byteFinish,
            headers, headersBegin, headersLength, headersEnd,
            begin, end, length,
            protoclass, prototype, constructor
        }
    
Object.defineProperties Number::,

    toPointer : value : ->

        return null unless this

        unless prototype = arguments[0]?.prototype

            protoclass = Pointer::loadHeader.call this, Pointer::HINDEX_PROTOCLASS
            prototype = Pointer::scope.get protoclass

        return new Ptr this if Ptr = prototype.constructor

        return null


class Display extends Pointer

    @byteLength             : 2 * 4

class Viewport extends Pointer

    @byteLength             : 26 * 4

Object.defineProperties Viewport::,

    background              :
        get                 : ->
