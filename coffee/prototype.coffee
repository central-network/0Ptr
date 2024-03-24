import * as window from "./window.js"

export OBJECTS = []

f32 = null

export class Pointer extends Number

    @bind = ->
        Object.defineProperties Pointer::,
            buffer : value : arguments[ 0 ]

        f32 = new window.Float32Array arguments[ 0 ]


class ArrayPointer          extends Pointer

    map : ->
        console.log "map loop", this

class TypedArrayPointer     extends Pointer

    map         : ->
        console.log "map loop", self.name, this

class Float32ArrayPointer   extends TypedArrayPointer

    BYTES_PER_ELEMENT   : 4
    @BYTES_PER_ELEMENT  : 4

    constructor         : ->
        unless window.isNaN arguments[0]
            byteLength = arguments[0] * 4

        super byteLength

    Object.defineProperties this::,
        
        byteOffset : get : -> 2

        byteLength : get : -> this * 1

        length     : get : -> this / @BYTES_PER_ELEMENT

        array      : get : -> f32.subarray(0 , 10)


class Thread                extends window.EventTarget

    @blob = new window.Blob [[
        "import '#{`import.meta.url`}'",
        "
            self.addEventListener(
                'message', function ( e ) {
                    Pointer.bind( e.data );
                }, { once: true }
            );
        "
    ].join '\n'], { type: "application/javascript" } 

    url : window.URL.createObjectURL @blob

    constructor : ( name, type = "module" ) ->
        super()
        @worker = new window.Worker @url, { name, type }
        @worker . postMessage Pointer::buffer

for key,j in window.Object.getOwnPropertyNames self
    continue if key in [ "Math", "Object", "window", "Reflect", "location", "self", "name", "console", "Proxy" ]
    OBJECTS.push obj unless OBJECTS.includes obj = self[key]
    try window.Reflect.deleteProperty self , key
    try delete self[ key ]
    try self[ key ] = self if self[ key ]
    
if  self.document?
    self.name = -1
    Pointer.bind new window.SharedArrayBuffer 10000
    new Thread i for i in [ 0 .. 4 ]

else
    Object.defineProperties self,
        document    : value : new Proxy ( new class document ), get : ->
            console.log "worker needs document"

Object.assign self,

    Pointer         : Pointer

    Array           : ( class Array extends ArrayPointer )
    
    Float32Array    : ( class Float32Array extends Float32ArrayPointer )