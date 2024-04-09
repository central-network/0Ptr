name        = self.name ?= "window"
isCPU       = /cpu/i.test name
isWindow    = typeof window isnt "undefined"
isProcessor = !isCPU and !isWindow
document    = document ? new Proxy {}, {}
uuid        = crypto.randomUUID()
memory      = null
lock        = new Int32Array new SharedArrayBuffer 4
now         = Date.now()

console.log { name, isWindow, isCPU, isProcessor }

if  isWindow then do ->
    script  = window.document.scripts.namedItem( "0ptr" ).text
    source  = await (await fetch( `import.meta.url` )).text()
    worker  = ->
        thread = new Worker(
            URL.createObjectURL new Blob(
                [ source , script ],
                { type : "application/javascript" }
            )
            { type: "module", name : arguments[0] }
        )

        thread . onerror         =
        thread . onmessageerror  = console.error
        thread . onmessage = ({ data , ports }) ->
            for request , data of data
                this[ request ] data
            this
        thread

    processor = worker "processor"

    processor.setup = ( info ) ->
        Object.assign this , info
        console.warn "window setting up processor", @       

        @unlock = -> Atomics.notify info.lock

        @fork()
        @fork()
        @fork()

    processor.fork = ( count ) ->
        
        cpu = worker "cpu"
        processor = this

        cpu.setup = ( info ) ->
            Object.assign this , info
            console.warn "window setting up cpu", @       
            @unlock = -> Atomics.notify info.lock
            
            processor.postMessage cpu : info
            processor.unlock()
            
    
if  isProcessor then do ->
    console.error "self is now processor", { self }

    buffer = new SharedArrayBuffer 1e7
    memory = new Uint8Array buffer

    postMessage setup : { name, memory, uuid, lock, now }

    addEventListener "message", ({ data, ports }) ->
        console.log "processor got message", data
        Atomics.notify data.cpu.lock

    Atomics.wait lock


if  isCPU then do ->
    console.error "self is now cpu", { self }
    postMessage setup : { name, lock, uuid, now }

    addEventListener "message", ({ data, ports }) ->
        console.log "cpu got message", data

    Atomics.wait lock