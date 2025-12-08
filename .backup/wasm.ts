namespace WebAssembly {

    type i32 = number
    type fun = number
    type ext = number
    type ref = number
    type ilk = number
    type ptr = number
    type u8  = number
    type i8  = number
    type u16 = number


    type ptriOffset = i32
    type readOffset = i32

    interface Pointer extends Number {
        state : i8
        type : u8
        parent : ptr
        byteOffset : readOffset
        externref : u16
    }

    interface Buffer extends Pointer {
        byteLength: i32
    }

    interface String extends Pointer {
        length: i32
        buffer: Buffer
    }

    interface Array extends Pointer {
        length: i32
    }

    interface Function extends Pointer {
        name: String
        handler: fun
    }

    type INIT               = ilk
    type SETTLE             = ilk
    type PROGRESS           = ilk
    type COMPLETE           = ilk
    type ERROR              = ilk
    type DONE               = ilk

    type ARRAY_BUFFER       = typeof globalThis.WebGL2RenderingContext.ARRAY_BUFFER
    type STRING             = ilk
    type DATA_URL           = ilk

    interface FileReader extends Pointer {
        __proto__   : globalThis.FileReader
        selfState   : 
            | typeof globalThis.FileReader.EMPTY 
            | typeof globalThis.FileReader.LOADING 
            | typeof globalThis.FileReader.DONE 
        readyState  : INIT | SETTLE | PROGRESS | COMPLETE | ERROR | DONE
        readAs      : ARRAY_BUFFER | STRING | DATA_URL
        result      : ptr
        position    : i32
        length      : i32
    }

    interface Thread extends Pointer {
    }

    interface Window extends Thread {
        type : 3
    }

    interface Worker extends Thread {
        type : 4
    }

    declare const wasmFileSize : -1
    declare const fileReader : FileReader
    declare const self : Thread
    
    function encodeText<Uint8Array> ( arg0: string ) {}

    function instantiate () {

        let wasmFileArrayBuffer = new ArrayBuffer( wasmFileSize );
        let wasmFileUint8Array  = new Uint8Array( wasmFileArrayBuffer );
        
    }
}
