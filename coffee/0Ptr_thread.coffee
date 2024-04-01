import { requestIdleCallback } from "./window.coffee"
import { obj } from "./Optr.coffee"
import { AtomicScope } from "./0Ptr_scope.js"
import { KeyBase } from "./0Ptr_keybase.js"
import { OPtr } from "./0Ptr.js"

kWorker   = "#worker"
kWindow   = "#window"

export THREAD_KEYBASE       = KeyBase.generate {
    LOCAL_WEBWORKER         : "local-webworker"
}

export class Thread extends OPtr

    @metaUrl                : `import.meta.url`

    LENGTH_UUID             : 36

    OFFSET_LOCK             : @reserv Uint32Array
    
    OFFSET_UUID             : @reserv Uint8Array, @::LENGTH_UUID

    OFFSET_WORKER           : @reserv Uint32Array

    OFFSET_IS_LOCKED        : @reserv Uint8Array

    OFFSET_IS_ONLINE        : @reserv Uint8Array

    OFFSET_IS_IDLE          : @reserv Uint8Array
        
    OFFSET_DATA_LENGTH      : @reserv Uint32Array
    
    OFFSET_DATA_ARRAY       : @reserv Uint8Array, 64 * 1024

    OFFSET_IMPORTS          : @reserv Uint8Array, 4 + 256 * 20

    imports                 : []

    scriptURL               : ->

        blobUrl = URL.createObjectURL new Blob(
            [ @addImports arguments...  ],
            { type : "application/javascript" }
        )

        modules = @imports.map (i) -> i.modules.join ",\n\t"
            .join ",\n\t"

        URL.createObjectURL new Blob(
            [ 
                "import * as imports\nfrom '#{blobUrl}'\n\n",
                "import {\n\t#{modules}\n}\nfrom '#{blobUrl}'\n\n",
                "addEventListener('ready',#{@function});" ],
            { type : "application/javascript" }
        )

    addImports              : ->
        for module in arguments

            if  module.__proto__.metaUrl
                @addImports module.__proto__

            unless item = @imports.find (i) -> i.metaUrl is module.metaUrl
                item = @imports[ @imports.length ] =
                    metaUrl : module.metaUrl, modules : []
            
            unless item.modules.includes module.name
                item.modules.push module.name

        imports = ""
        for item in @imports.slice()
            names = item.modules.join(', ')
            url = item.metaUrl
            imports += "export {#{ names }} from '#{ url }';\n"
        imports
    
    send                    : ( message ) ->
        data = @encodeJSON message

        @copyUint8 @OFFSET_DATA_ARRAY, data
        @storeUint32 @OFFSET_DATA_LENGTH, data.byteLength

    init                    : ->
        @addImports AtomicScope, KeyBase, OPtr, Thread
        @createWorker arguments...

    createWorker            : ->

        script = @scriptURL arguments...

        worker = new Worker script , {
            type : "module",
            name : this * 1
        }

        worker.postMessage @buffer
        @uuid = crypto.randomUUID()
        @[ kWorker ] = worker

    #? runs on worker after setup
    #  mark this works at ONREADY
    #  todo now OPtr buffer settled   
    function                : ->

        @ptr = new Thread +self.name
        
        for module of imports
            scopei = @ptr.bcast "findScopei" , module
            if scopei <= 0 then continue
            else @ptr.scopei imports[ module ], scopei

        setTimeout =>
            console.warn @ptr.obj

        return console.warn @ptr

        #! test test test
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


        [ kWindow ]         :
                    get     : -> @objUint32 @OFFSET_WINDOW
                    set     : -> @setUint32 @OFFSET_WINDOW, @scopei arguments[0]

        [ kWorker ]         :
                    get     : -> @objUint32 @OFFSET_WINDOW
                    set     : -> @setUint32 @OFFSET_WINDOW, @scopei arguments[0]

        isOnline            :
                    get     : -> @loadUint8 @OFFSET_IS_ONLINE
                    set     : -> @storeUint8 @OFFSET_IS_ONLINE, arguments[0]
        
        isIdle              :
                    get     : -> @loadUint8 @OFFSET_IS_IDLE
                    set     : -> @storeUint8 @OFFSET_IS_IDLE, arguments[0]
        
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
