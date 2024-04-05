export class Window

    constructor : ( thread ) ->
        
        Object.defineProperties self,

            window                  : value : this

            thread                  : value : thread

            document                : value : new class document extends HTMLDocument

        Object.defineProperties Window::,

            self                    : value : self

            document                : value : self.document

            lock                    : value : ->
                i32 = new Int32Array thread.buffer

                Atomics.wait i32, self.name
                Atomics.load i32, self.name

            post                    : value : ->
                postMessage arguments[0]
                @lock()

            loadInt32               : value : ->
                i32 = new Int32Array thread.buffer

                Atomics.load i32, arguments[0]

export class Node

export class Element           extends Node

export class HTMLElement       extends Element

export class HTMLDocument      extends HTMLElement
    
    getElementById  : ( id ) ->
        window.post {
            func : [ "document", "getElementById" ]
            args : [ id ]
        }

    querySelector   : ( filter ) ->
        @createElement tagName = "canvas"

    createElement   : ( tagName ) ->
        HTMLCanvasElement.create() 

export class HTMLCanvasElement extends HTMLElement

    @create         : ->
        new (class canvas extends OffscreenCanvas)(256, 256)

    getContext      : ( type ) ->
