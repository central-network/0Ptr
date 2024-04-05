unless SharedArrayBuffer?
    throw /SHARED_ARRAY_BUFFER_NOT_AVAILABLE/

import "./prototype.js"
import { Pointer, Scope } from "./OPtr_pointer.js"

scope = new Scope( self )

for script in document.scripts
    if `import.meta.url` is script.src
        break if script = script.text
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

    #? window gets message that means some remote
    #? controller connected to this device
    #? so, we need to do what we do 
    buffer = new SharedArrayBuffer data