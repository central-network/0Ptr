import KEYOF from "./0ptr_keyof.js"
import defaults from "./0ptr_self.js"
export { Scope } from "./0ptr_scope.js"

protoclasses = [ weakmap = new WeakMap(), ]

Object.defineProperties Symbol,
    pointer                 :
        value               : "{[Pointer]}"

export class Pointer   extends Number

    @TypedArray             : Uint8Array

    @byteLength             : 0

    @headersLength          : 0

    @HINDEX_BEGIN           : @headersLength++
    
    @HINDEX_END             : @headersLength++
    
    @HINDEX_LENGTH          : @headersLength++

    @HINDEX_PROTOCLASS      : @headersLength++

    @HINDEX_RESOLV_CID      : @headersLength++
    
    @HINDEX_RESOLV_PTR      : @headersLength++
    
    @HINDEX_BYTELENGTH      : @headersLength++
    
    @HINDEX_BYTEOFFSET      : @headersLength++
    
    @scopei                 : ->
        if !weakmap.has this:: 
            weakmap.set this::, protoclasses[ i = protoclasses.length ] = this::
            
            #Object.defineProperty this::, "protoclass", { value : i }

            if  bpe = defaults[ @name ]?.BYTES_PER_ELEMENT

                Object.defineProperty this::,
                    "BYTES_PER_ELEMENT", { value : bpe }

                defaults[ @name ].protoclass = i

        i

    toPointer               : ->
        this

    constructor             : ->

        unless arguments.length

            call = new CallResolv()

            #?  only bridge allocates 
            if  self.isBridge            
                super memory.malloc()
                    .storeHeaders call

            #?  cpuN only re-locates
            if  self.isCPU
                super memory.loadUint32 call + Pointer.HINDEX_RESOLV_PTR

        else unless ptri = arguments[0]
            /ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO/.throw()
            
        else super ptri


    storeHeaders            : ->

        if  call = arguments[0]

            memory.storeUint32 call + @constructor.HINDEX_RESOLV_PTR , this
            memory.storeUint32 this + @constructor.HINDEX_RESOLV_CID , call . cid

        protoclass = @constructor . protoclass
        perElement = @constructor . TypedArray . BYTES_PER_ELEMENT

        memory.storeUint32 this + @constructor.HINDEX_PROTOCLASS , protoclass
        memory.storeUint32 this + @constructor.HINDEX_RESOLV_PTR , this * 1

        if  byteLength = @constructor .byteLength
            byteOffset = memory.malloc byteLength

            begin = byteOffset / perElement
            length = byteLength / perElement

            memory.storeUint32 this + @constructor.HINDEX_BEGIN      , begin
            memory.storeUint32 this + @constructor.HINDEX_LENGTH     , length
            memory.storeUint32 this + @constructor.HINDEX_END        , begin + length
            memory.storeUint32 this + @constructor.HINDEX_BYTEOFFSET , byteOffset
            memory.storeUint32 this + @constructor.HINDEX_BYTELENGTH , byteLength

        this

    callResolv              : ->
        return unless cid  = memory.loadUint32 this + Pointer.HINDEX_RESOLV_CID
        return unless ptri = memory.find Pointer.HINDEX_RESOLV_CID , Number cid

        new CallResolv ptri

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

export class CallResolv extends Pointer

    @byteLength             : 4096

    constructor             : ->

        if  arguments.length
            return super arguments[0]
            
        else
            try throw new Error()
            catch e then stack = e.stack
            
        unless cid = CallResolv.parse(stack).at(-1).cid
            /CID_MUST_BE_A_NUMBER/.throw cid

        if  self.isBridge
            call = memory.malloc()

            memory.storeUint32 call + Pointer.HINDEX_RESOLV_CID , cid
            memory.storeUint32 call + Pointer.HINDEX_PROTOCLASS , CallResolv.protoclass

        else unless call = memory.find Pointer.HINDEX_RESOLV_CID, cid
            /CPU_COULND_FIND_POINTER_FOR_CID/.throw cid

        super call

    @parse                  : ->
        "#{arguments[0]}".split(/\n| at /).slice(3).filter(isNaN).reverse().map( ( text, i, lines ) ->
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
            
            # todo make it faster
            urlid           = scheme.startsWith('http') and url.split("").map( (c) -> c.charCodeAt() ).reduce( (a, b) -> a + b || 0 ) || 0;
            cid             = lines.cid = (lines.cid or 0) + (urlid + line) + i;
            
            return Object.defineProperties {
                cid, line, urlid, col, call, name,
                path, fullpath, hostname, prototype, isConstructor,
                isAnonymous, text, url, scheme, file,
                basename, extension
            }, stackLine : value : text
        )


Object.defineProperties CallResolv::,

    ptri            : get : -> memory.loadUint32 this + Pointer.HINDEX_RESOLV_PTR
    cid             : get : -> memory.loadUint32 this + Pointer.HINDEX_RESOLV_CID

Object.defineProperties Pointer,

    protoclass      : get : -> @scopei()

Object.defineProperties Pointer::,

    [ Symbol.pointer ]      : get : ->

        protoclass  : memory.loadUint32 this + Pointer.HINDEX_PROTOCLASS

        instanceof  : @realizeWith

        memory      : memory

        TypedArray  : @buffer.slice().buffer

        byteLength  : @constructor.byteLength

        headers     : memory.subarrayUint32 this, this + 8
