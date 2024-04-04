onready     = -> addEventListener "message", ( e ) =>
    arguments[0].call new Window new Thread e.data 

onrequest   = ( i, e ) -> 
    { func , args , lock } = e.data

    ( root = self )

    for prop in func
        root = root[ prop ]

    func = root.bind self[ func[ 0 ] ] 
    call = func( ...args )

    Atomics.add this, 0 , 1
    Atomics.store this, i , 10000 * Math.random()
    Atomics.notify this, i, 1

fetchAll    = ->
    urls = [ arguments... ]
    while url = urls.splice(0,1).at(0)
        await r.text() if r = await fetch url

queueMicrotask ->

    size = .25 * Math.pow navigator?.deviceMemory or 2, 10+1
    data = new SharedArrayBuffer 1e8, { maxByteLength: size }
    body = document.currentScript.text or throw [ "?CODE?" ]

    Atomics.store new Uint32Array(data), 0, 2
    Atomics.store new Uint32Array(data), 0, 8

    base = await fetchAll "./OPtr_pointer.js", "./OPtr_thread.js", "./OPtr_window.js"
    mods = base
        .join( "\n" ).split( / class /g ).slice( 1 )
        .filter( (c) -> c[0] is c[0].toUpperCase() )
        .map( (n) -> n.split(" ")[0] )

    base . push "export { #{mods} }"
    type = "application/javascript"
    libs = URL.createObjectURL new Blob base , { type }
    head = "import { #{mods} } from '#{libs}';" + "(#{onready})"

    code = URL.createObjectURL new Blob [ head, body ], { type }

    for i in [ 1 ... navigator?.hardwareConcurrency or 2 ]
        thread = new Worker code, { type: "module", name: i }
        thread . addEventListener "message", onrequest.bind new Int32Array( data ), i
        thread . postMessage data 


