    
    TYPE_WASM_DEVICE = -1.24
    TYPE_WORKER_INIT


    self.console.log            = function ( any ) { return };
    self.console.warn           = function ( any ) { return };
    self.console.error          = function ( any ) { return };
    self.requestAnimationFrame  = function ( fun ) { return f32 };
    self.Array                  = function () { return ext };
    self.Array                  = function ( any ) { return ext };
    self.Array.prototype.at     = function ( ext, i32 ) { return ext };
    self.Array.prototype.push   = function ( ext, any ) { return };
    self.Array.prototype.slice  = function ( ext ) { return ext };
    self.Array.prototype.slice  = function ( ext, i32 ) { return ext };
    self.Array.prototype.slice  = function ( ext, i32, i32 ) { return ext };


    lifecycle = function () {
        (TYPE_WORKER_INIT)
    }
    
    secondfunc = function () {
        arguments[0] 
        TYPE_WORKER_INIT + 2
    }

    children = function () {
        result = new Array()

        return result
    }

    onanimationframe = function ( f32 ) {
        console.warn( arguments[0] )
        requestAnimationFrame( onanimationframe )
    }

    parent = function ( i32, i32, i32 ) {
        return result
    }

    class Pointer extends self.Number {

        wasm ( i, k, v ) {
            if (k === TYPE_GETTER_FUN) { call_indirect() }
        }

        get ["{{parent}}"] () {
            this.wasm(this, TYPE_GETTER_FUN, parent)
        }

        get ["{{children}}"] () {
            this.wasm(this, TYPE_GETTER_FUN, children)
        }

    } 

    class Array extends Pointer {
        length = i32
    }
    
    class Object extends Pointer {}

    class ArrayBuffer extends Pointer {
        byteLength = i32
        byteOffset = i32
    }

    class Worker extends Pointer {
        url = String
        name = String
    }

    class String extends Pointer {
        length = i32
        buffer = ArrayBuffer
    }

    class ScreenOrientation extends Pointer {

        angle = f32

        onchange () {
            a + b
            i32(4) + 5
        } 
        
        type =
            PORTRAIT_PRIMARY |
            LANDSCAPE_PRIMARY |
            PORTRAIT_SECONDARY |
            LANDSCAPE_SECONDARY

        constructor () {
            console.log(4)
        }
    }

    class Screen extends Pointer {
        orientation = ScreenOrientation 

        width = u16
        height = u16

        constructor () {
            this.width = self.screen.width
        }
    }

    class Element extends Pointer {}
    class BodyElement extends Element {}
    class CanvasElement extends Element {}

    class Document extends Pointer {
        body = BodyElement
    }

    class Window extends Pointer {
        name = String
        screen = Screen
        innerWidth = u16
        innerHeight = u16
        document = Document
    } 
    