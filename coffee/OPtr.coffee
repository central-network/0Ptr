name        = self.name ?= "window"
isCPU       = /cpu/i.test name
isWindow    = typeof window isnt "undefined"
isProcessor = !isCPU and !isWindow
document    = document ? new Proxy {}, {}
uuid        = crypto.randomUUID()
memory      = null
i32         = null
lock        = new Int32Array new SharedArrayBuffer 4
now         = Date.now()

console.log { name, isWindow, isCPU, isProcessor }

if  isWindow then do ->
    script  = window.document.scripts.namedItem( "0ptr" ).text
    source  = await (await fetch( `import.meta.url` )).text()
    worker  = ->
        thread = new Worker(
            URL.createObjectURL new Blob(
                [ source , "const onready = function () {#{script}};" ],
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

    processor.cpus = []

    processor.setup = ( processorInfo ) ->
        Object.assign this , processorInfo
        i32 = new Int32Array processorInfo.memory

        console.warn "window setting up processor", @       

        @unlock = -> Atomics.notify processorInfo.lock

        @cpus.push @fork(0)
        @cpus.push @fork(1)
        @cpus.push @fork(2)

    processor.cpuReady = ( cpuinfo ) ->
        console.log "cpu ready", cpuinfo
        if  cpuinfo.name is "cpu2"

            for cpu in @cpus
                cpu.postMessage ready : { on: on }
                
            @postMessage ready : { on: on }
            console.log "run code"



    processor.fork = ( i ) ->
        
        cpu = worker "cpu" + i

        processor = this

        cpu.ready = ( cpuinfo ) ->
            console.log "cpu is ready", cpuinfo
            processor.cpuReady cpuinfo

        cpu.setup = ( cpuinfo ) ->
            Object.assign this , cpuinfo
            console.warn "window setting up cpu", @       
            @unlock = -> Atomics.notify cpuinfo.lock
            
            processor.postMessage cpu : cpuinfo
            
            @postMessage processorInfo : {
                name : processor.name
                memory : processor.memory
                uuid : processor.uuid
                lock : processor.lock
                now : processor.now
            }

            processor.unlock()

        cpu
            
    
if  isProcessor then do ->
    console.error "self is now processor", { self }

    cpus = []
    memory = new SharedArrayBuffer 1e7
    i32 = new Int32Array memory

    postMessage setup : { name, memory, uuid, lock, now }

    addEventListener "message", ({ data, ports }) ->
        console.log "processor got message", data

        for req, data of data then switch req
            when "cpu"
                cpus.push data
                Atomics.notify data.lock
                console.log cpus

            when "ready"
                onready.call( this )
                Atomics.notify i32
        

    Atomics.wait lock


if  isCPU then do ->
    console.error "self is now cpu", { self }

    postMessage setup : { name, lock, uuid, now }

    addEventListener "message", ({ data, ports }) ->
        for req, data of data then switch req
            when "processorInfo"
                @processor = data
                memory = data.memory
                postMessage ready : {
                    name
                }
                i32 = new Int32Array memory                

            when "ready"
                Atomics.wait i32
                onready.call( this )

    Atomics.wait lock