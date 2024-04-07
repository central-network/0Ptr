import defaults from "./0Ptr_self.js"
export { Scope } from "./0Ptr_scope.js"

protoclasses = [ weakmap = new WeakMap(), ]

Object.defineProperties Symbol,
    pointer                 :
        value               : "{[Pointer]}"

export class Pointer   extends Number

    @byteLength             : 0

    @scopei                 : ->
        if !weakmap.has this:: 
            weakmap.set this::, protoclasses[ i = protoclasses.length ] = this::
            
            Object.defineProperty this::, "protoclass", { value : i }

            if  bpe = defaults[ @name ]?.BYTES_PER_ELEMENT

                Object.defineProperty this::,
                    "BYTES_PER_ELEMENT", { value : bpe }

                defaults[ @name ].protoclass = i

        i

    toPointer               : ->
        this

    constructor             : ->
        new CallResolv()            

        unless arguments.length
            super memory.malloc()                
            #memory.setProtoClass this, @protoclass

        else
            super arguments[0]
            @usePrototype arguments[1]

    usePrototype            : ->
        return this unless @constructor is Pointer

        protoclass = arguments[0] ? @scope.get(
            @loadHeader @HINDEX_PROTOCLASS
        )
        
        Object.setPrototypeOf this, protoclass

    storeObject             : ->
        memory.storeObject this, arguments[0], arguments[1] 

    loadObject              : ->
        memory.loadObject this, arguments[0]

export class CallResolv extends Number

    constructor             : ->
        try throw new Error()
        catch error
            stack = error.stack.toString()
            calls = CallResolv.parse stack

        Object.defineProperties super( calls.at(-1).id ),
            class : value : calls.find( (c) -> c.isConstructor ).prototype
            chain : value : Object.assign calls, { stack }

        console.log "\x1b[1m\x1b[95mnew\x1b[0m \x1b[1m\x1b[93m#{@class.name}()\x1b[0m","<--", this

    @parse                  : ->
        arguments[0].split(/\n| at /).slice(3).filter(isNaN).reverse().map( ( text, i, lines ) ->
            [ line, col ]   = text.replace(/\)/g, '').split(':').slice(-2).map(Number);
            urlEnd          = text.lastIndexOf( [ line, col ].join(':') ) - 1;
            urlBegin        = text.lastIndexOf( ' ' ) + 1;
            call            = text.substring( 0, urlBegin ).trim() || null;
            isAnonymous     = call is null;
            name            = call?.toString().split(" ", 2).at(-1) or "";
            isConstructor   = call?.toString().startsWith("new");
            prototype       = defaults[name] or null;
            url             = text.substring( Math.max(urlBegin, text.indexOf("(")+1), urlEnd );
            file            = url.split(/\//g).at(-1);
            basename        = file.split(".").slice(0, 1).join(".");
            extension       = file.substr( basename.length + 1 );
            scheme          = url.split(/\:/, 1).at(0);
            hostname        = url.split(/\/\//, 2).at(-1).split(/\//, 1).at(0);
            fullpath        = url.split( hostname, 2 ).at(-1);
            path            = fullpath.split(/\//).slice(0, -1).join("/");
            urlid           = scheme.startsWith('http') and url.split("").map( (c) -> c.charCodeAt() ).reduce( (a, b) -> a + b || 0 ) || 0;
            id              = lines.id = (lines.id or 0) + (urlid + line) + i;
            
            return Object.defineProperties {
                id, line, urlid, col, call, name,
                path, fullpath, hostname, prototype, isConstructor,
                isAnonymous, text, url, scheme, file,
                basename, extension
            }, stackLine : value : text
        )

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
    