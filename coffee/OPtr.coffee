self.isWindow = Boolean document?;

unless SharedArrayBuffer?
    throw /SHARED_ARRAY_BUFFER_NOT_AVAILABLE/

import "./prototype.js"
import { Pointer, Scope } from "./0ptr_pointer.js"

scope = new Scope( self )
basepath = location.href.replace('/index.html', '')

for script in document.scripts
    if `import.meta.url` is script.src
        break if script = "#{script.text}"
unless script then throw "?CODE?"

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

addEventListener "message", ({ data }) ->
    console.log 2, data

    #? window gets message that means some remote
    #? controller connected to this device
    #? so, we need to do what we do 
    buffer = new SharedArrayBuffer data

    #* at this point, memory is initialized
    console.warn "[#{self.constructor.name}]", performance.now(2), "memory is initialized", buffer

addEventListener "load", ->

    cpuURL = URL.createWorkerURL "
        self.isCPU = true;

        import '#{basepath}/prototype.js';
        import '#{basepath}/0ptr_window.js';

        addEventListener( 'message', function ({ data }){
            self.memory = data.memory.defineProperties();                        
            self.postMessage(0);
            memory.lock(1);
            console.error('cpu unlocked', name );
            /* user code evaulating: */#{script}                        
        });
    "

    self.bridge = new Worker URL.createWorkerURL "
        self.isBridge = true;

        import '#{basepath}/prototype.js';
        import '#{basepath}/0ptr_window.js';
                
        self.memory = new SharedArrayBuffer();
        self.postMessage({ memory: self.memory, name });

        memory.lock();
        console.warn( 'bridge unlocked:', name );
        
        /* user code evaulating: */#{script}
    "

    bridge.addEventListener "message", ({ data }) ->

        self.memory = data.memory.defineProperties();
        console.warn( 'bridge ready:', data.name );

        cpuCount = Math.max( 
            2, ( navigator?.hardwareConcurrency or 2 ) - 2
        )

        cpuCount = 3

        waiting = cpuCount
        threads = []

        while cpuCount--
            
            cpu = new Worker cpuURL, "cpu" + cpuCount

            cpu . onmessage = ({ data: i }) ->
                threads.push this
                return if --waiting

                requestIdleCallback ->
                    memory.unlock(1)
                memory.unlock()
                                                                     
            cpu . postMessage({ memory: self.memory });

        self.onclick = -> console.log threads
