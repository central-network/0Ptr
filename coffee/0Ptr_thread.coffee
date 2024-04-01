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

        imports = @addImports arguments...

        URL.createObjectURL new Blob(
            [ imports, "addEventListener('ready',#{@function});" ],
            { type : "application/javascript" }
        )

    addImports              : ->
        for module in arguments

            if  module.__proto__.metaUrl
                @addImports module.__proto__

            unless item = @imports.find (i) -> i.metaUrl is module.metaUrl
                item = @imports[ @imports.length ] =
                    metaUrl : module.metaUrl
                    modules : new Array()
            
            unless item.modules.includes module.name
                item.modules.push module.name

        @imports.map ( item ) ->
            "import { #{item.modules.join(', ')} }
             from '#{   item.metaUrl }';".trim()
        .join( "\n" ) + "\n\n"
    
    send                    : ( message ) ->
        data = @encodeJSON message

        @copyUint8 @OFFSET_DATA_ARRAY, data
        @storeUint32 @OFFSET_DATA_LENGTH, data.byteLength

    init                    : ->
        @addImports AtomicScope, KeyBase, OPtr, Thread
        @[ kWorker ] or= @createWorker arguments...

    createWorker            : ->

        script = @scriptURL arguments...

        worker = new Worker script , {
            type : "module",
            name : @uuid = crypto.randomUUID()
        }



        worker.postMessage @buffer ; worker

    #? runs on worker
    function                : ->
        #! test test test

        bc = new BroadcastChannel("0ptr")

        console.log ptr = new Thread 224

        bc.postMessage {
            request : "loadObject"
            sender : self.name
            receiver : "window"
            thread : 224
            data : { scopei : 4 }
        }

        ptr.lock()

        { name, prop } = ptr.data
        console.warn "obj[4]", { name, prop }

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

        o = OPtr::obj[4]
        console.warn "o.title :", o.title
        console.warn "o.num :", o.num
        o.num = 8
        console.warn "o.num :", o.num
        console.warn "o.title :", o.title = "özgür"
        console.warn "o.title :", o.title
        console.warn "o.readyState :", o.readyState


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