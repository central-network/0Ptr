import { AtomicScope } from "./0Ptr_scope.js"
import { KeyBase } from "./0Ptr_keybase.js"
import { OPtr } from "./0Ptr.js"

bc = new BroadcastChannel "OPtr"

export THREAD_KEYBASE       = KeyBase.generate {
    LOCAL_WEBWORKER         : "local-webworker"
}

export class Thread extends OPtr

    kWorker                 : "#worker"

    kSelf                   : "#self"

    @metaUrl                : `import.meta.url`

    LENGTH_UUID             : 36

    OFFSET_LOCK             : @reserv Uint32Array
    
    OFFSET_UUID             : @reserv Uint8Array, @::LENGTH_UUID

    OFFSET_WORKER           : @reserv Uint32Array
    
    OFFSET_SELF             : @reserv Uint32Array

    OFFSET_IS_LOCKED        : @reserv Uint8Array

    OFFSET_IS_ONLINE        : @reserv Uint8Array

    OFFSET_IS_BUSY          : @reserv Uint8Array
        
    OFFSET_DATA_LENGTH      : @reserv Uint32Array
    
    OFFSET_DATA_ARRAY       : @reserv Uint8Array, 64 * 1024

    OFFSET_IMPORTS          : @reserv Uint8Array, 4 + 256 * 20

    imports                 : [
        { modules: [ "AtomicScope" ], metaUrl : AtomicScope.metaUrl}
        { modules: [ "KeyBase" ], metaUrl : KeyBase.metaUrl}
        { modules: [ "OPtr" ], metaUrl : OPtr.metaUrl}
        { modules: [ "Thread" ], metaUrl : Thread.metaUrl}
    ]

    scriptURL               : ( onReadyFn ) ->

        imports = @import()
        modules = @imports.map( (i) -> i.modules.join ",\n\t" ).join ",\n\t"
        exports = "export { #{modules.replace(/\s+|\n|\t/g, ' ')} };\n"
        
        blobUrl = URL.createObjectURL new Blob(
            [
                imports , exports
                "\nself.bc = new BroadcastChannel('OPtr');\n"
                "\nself.imports = {\n\t#{modules}\n};\n\n"
            ], { type : "application/javascript" }
        )

        URL.createObjectURL new Blob(
            [ 
                "import {\n\t#{modules}\n}\nfrom '#{blobUrl}';\n\n"
                "addEventListener( 'ready', #{ onReadyFn });\n\n",
            ], type : "application/javascript"
        )

    import                  : ->
        for module in [ arguments... ]

            if  module.__proto__.metaUrl
                @import module.__proto__

            unless item = @imports.find (i) -> i.metaUrl is module.metaUrl
                item = @imports[ @imports.length ] =
                    metaUrl : module.metaUrl, modules : []
            
            unless item.modules.includes module.name
                item.modules.push module.name

        imports = ""
        for item in @imports.slice()
            names = item.modules.join(', ')
            url = item.metaUrl
            imports += "import {#{ names }} from '#{ url }';\n"
        imports + "\n"
    
    send                    : ( message ) ->
        data = @encodeJSON message

        @copyUint8 @OFFSET_DATA_ARRAY, data
        @storeUint32 @OFFSET_DATA_LENGTH, data.byteLength

    init                    : ( handler, ptr ) ->
        @[ @kSelf ] = self
        @uuid = crypto.randomUUID()

        script = @scriptURL handler
        worker = this[ @kWorker ] =
            new Worker script , {
                type : "module",
                name : +this
            }

        worker . postMessage { @buffer, ptri: ptr * 1 } ; @

    initDedicated           : ->
        @isOnline = 1
        @loadScopei @getWorkerScopei()
        @loadScopei @getSelfScopei()
        this

    setWorker               : ->
        @[ @kWorker ] = arguments[0]

    getWorkerScopei         : ->
        @loadUint32 @OFFSET_WORKER

    setSelf                 : ->
        @[ @kSelf ] = arguments[0]

    getSelfScopei           : ->
        @loadUint32 @OFFSET_SELF

    postMessage             : ( type, data ) ->
        bc.postMessage { type, data, ptri: +this }
        return this.lock().data

    createProxy             : ( name, props = {} ) ->
        name = "#{ name }".substring 0 , 64
        proto = new (eval("(class #{name} {})"))()
        ref = Object.assign proto, props
        new Proxy ref, {}

    loadScopei              : ( scopei ) ->

        return obji if obji = self.obj[ scopei ]

        { name, props } =
            @postMessage "loadScopei", scopei

        self.obj[ scopei ] =
            @createProxy name , props         


    old                : ->

        ptrProtoClass = ( imports, PtrClassName ) ->
            bc.postMessage {
                type : "findScopei", 
                data : PtrClassName
                ptri : +self.ptr
            }

            return if 0 > scopei = self.ptr.lock().data
            self.ptr.scopei imports[ module ], scopei

            return imports[ module ]

        getObjectProp = ( key ) -> bc.postMessage {
            request : "getObjectProp"
            sender : self.name
            receiver : "window"
            thread : 224
            data : { scopei : 4, prop : key }
        }
                
        setObjectProp = ( key , val ) -> bc.postMessage {
            request : "setObjectProp"
            sender : self.name
            receiver : "window"
            thread : 224
            data : { scopei : 4, prop : key, val }
        }
                
        OPtr::obj[ 4 ] = new Proxy eval("new class #{name} {}"),
            get : ->
                unless type = prop[ key = arguments[1] ]
                    return undefined

                switch type
                    when "object"
                        console.warn "new proxy required"

                    when "number"
                        getObjectProp key
                        return Number ptr.lock().data

                    when "string"
                        getObjectProp key
                        return ptr.lock().data

            set : ->
                val = arguments[2]

                unless type = prop[ key = arguments[1] ]
                    return undefined

                switch type
                    when "number", "string"
                        setObjectProp key, val
                        return ptr.lock().data


    Object.defineProperties this::,

        [ Thread::kSelf ]   :
                    get     : -> @objUint32 @OFFSET_SELF
                    set     : -> @storeUint32 @OFFSET_SELF, @scopei arguments[0]

        [ Thread::kWorker ] :
                    get     : -> @objUint32 @OFFSET_WORKER
                    set     : -> @storeUint32 @OFFSET_WORKER, @scopei arguments[0]

        isOnline            :
                    get     : -> @loadUint8 @OFFSET_IS_ONLINE
                    set     : -> @storeUint8 @OFFSET_IS_ONLINE, arguments[0]
        
        isBusy              :
                    get     : -> @loadUint8 @OFFSET_IS_BUSY
                    set     : -> @storeUint8 @OFFSET_IS_BUSY, arguments[0]
        
        isLocked            :
                    get     : -> @loadUint8 @OFFSET_IS_LOCKED
                    set     : -> @storeUint8 @OFFSET_IS_LOCKED, arguments[0]

        dataLength          :
                    get     : -> @loadUint32 @OFFSET_DATA_LENGTH
                    set     : -> @storeUint32 @OFFSET_DATA_LENGTH, arguments[0]

        dataArray           :
                    get     : -> @arrayUint8 @OFFSET_DATA_ARRAY, @dataLength 
                    set     : -> @dataLength = @copyUint8 @OFFSET_DATA_ARRAY, arguments[0]

        data                :
                    get     : -> @decodeJSON @dataArray if @dataLength
                    set     : -> @dataArray = @encodeJSON arguments[0]

        uuid                :
                    get     : -> @decodeText @arrayUint8 @OFFSET_UUID, @LENGTH_UUID
                    set     : -> @copyUint8 @OFFSET_UUID, @encodeText arguments[0]

export { Thread as default }

if  window? and document?
    OPtr.setup new SharedArrayBuffer 1024 * 1024
    self.onclick = -> console.warn obj
    self.name = "window"

else addEventListener "message", ( e ) ->
    OPtr . setup e.data.buffer
    new Thread( +self.name ).initDedicated()
    dispatchEvent new CustomEvent "ready",
        { detail : e.data.ptri }
    
, once : yes

bc.onmessage = ->

    { type , data , ptri } = arguments[ 0 ] . data    
    ( ptr = new Thread ptri )
    
    switch type
        
        when "findScopei"
            for proto in obj.slice 1
                if  data is proto?.name 
                    ptr.data = obj.indexOf proto
                    return ptr.unlock()

            ptr.data = -1
            ptr.unlock()
            #? delayed unlocker for not found
            #  todo check inter proxied owners

        when "loadScopei"
            return if 0 is ptri - self.name

            if !obj[ scopei = data ]?
                ptr . unlock()
                throw [ "NONONONNOONO" ]

            switch typeof obj[ scopei ]
                when "object"

                    obji = obj[ scopei ]
                    name = obji.constructor.name or obji.name
                    data = { name , props : {} }

                    for prop , desc of obji
                        data . props[ prop ] =
                            typeof desc

                    ptr . data = data
                    ptr . unlock()

        when "getObjectProp"
            return unless obj[ data.scopei ]
            ptr . data = obj[ data.scopei ][ data.prop ]
            ptr . unlock()
                    
        when "setObjectProp"
            return unless obj[ data.scopei ]
            console.warn data.prop, data.val
            obj[ data.scopei ][ data.prop ] = data.val
            ptr . data = obj[ data.scopei ][ data.prop ]
            ptr . unlock()
                    