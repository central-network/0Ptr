import { Scope } from "./0Ptr_scope.js"
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
        { modules: [ "Scope" ], metaUrl : Scope.metaUrl}
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

    init                    : ( ptr, handler ) ->
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

    getScopeiProp           : ( ref, prop ) ->
        type = ref[prop]
        name = ref.__name__
        scopei = ref.__scopei__

        console.log "getting scopei.prop:", { prop, type }

        result = @postMessage "getScopeiProp", { scopei, prop }
        console.log "result scopei.prop:", result


        result.prop

    createProxy             : ( scopei, name, props = {} ) ->
        name = "#{ name }".substring 0 , 64
        proto = new (eval("(class #{name} {})"))()

        console.warn "creatingproxy", { scopei, name, props }

        _thssi = this
        getter = ( key ) ->
            _thssi.postMessage "getScopeiProp", { scopei, key }

        getters = ( prop, key ) ->
            _thssi.postMessage "getScopeiProps", { scopei, prop, key }

        Object.defineProperties proto,
            __scopei__  : value : scopei
            __name__    : value : name

        for key , type of props 

            if  type is "function"
                Object.defineProperty proto, key,
                    value : ->

            else if type is "object"
                Object.defineProperty proto, key,
                    get : ->
                        new Proxy new (eval("(class #{key} {})"))(), {}

            else
                Object.defineProperty proto, key,
                    get : ->
                        { type, prop } = getter key
                        prop
                        
                    set : ->

        new Proxy proto, {
            get : ( ref, key ) ->
                { type, prop } = getter key

                if type isnt "object"
                    return prop

                props = getters prop, key
                target = new (eval("(class #{key} {})"))()

                for k, t in props
                    if t is "function"
                        Object.defineProperty target, k,
                            value : ->

                    else if t is "object"
                        Object.defineProperty target, k,
                            get : ->
                            
                    else
                        Object.defineProperty target, k,
                            get : ->
                            set : ->


                new Proxy target, {}

            set : ->
        }

    loadScopei              : ( scopei ) ->

        { type, name, props } =
            @postMessage "loadScopei", scopei

        object = switch type
            when "prototype" then self.imports[ name ]
            when "object" then @createProxy scopei, name , props         

        self.obj[ scopei ] = object

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
    self.obj = [ null ]
    OPtr.setup new SharedArrayBuffer 1024 * 1024
    self.onclick = -> console.warn obj
    self.name = "window"

else addEventListener "message", ( e ) ->

    OPtr.setup e.data.buffer
    thread = new Thread( +self.name )

    self.obj = new Proxy [ null ], get : ( _obj, i ) ->
        _obj[ i ] ? thread.loadScopei i

    thread.initDedicated()
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
                throw [ "NONONONNOONO", data, obj ]

            if  OPtr.isPrototypeOf obj[ scopei ]
                ptr.data = {
                    type : "prototype"
                    name : obj[ scopei ].name
                }

                return ptr.unlock()

            switch typeof obj[ scopei ]
                when "object"

                    obji = obj[ scopei ]
                    name = obji.constructor.name or obji.name
                    data = { type: "object", name , props : {} }

                    for prop , desc of obji
                        data . props[ prop ] = typeof desc

                    ptr . data = data
                    ptr . unlock()

        when "getScopeiProps"
            return unless obj[ data.scopei ]

            prop = obj[ data.scopei ][ data.prop ]
            type = typeof prop
            name = prop?.constructor.name or prop?.name

            props = {}
            for key of prop[ data.key ]
                props[ key ] = {
                    name : key,
                    type : typeof prop[key]
                }

            ptr.data = { type, name, prop }
            ptr.unlock()

        when "getScopeiProp"
            return unless obj[ data.scopei ]

            prop = obj[ data.scopei ][ data.prop ]
            type = typeof prop
            name = prop?.constructor.name or prop?.name

            ptr.data = { type, name, prop }
            ptr.unlock()
                    
        when "setObjectProp"
            return unless obj[ data.scopei ]
            console.warn data.prop, data.val
            obj[ data.scopei ][ data.prop ] = data.val
            ptr . data = obj[ data.scopei ][ data.prop ]
            ptr . unlock()
                    