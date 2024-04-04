class Window

    constructor : ->
        
        Object.defineProperties self,

            window                  : value : this

            document                : value : new class document extends HTMLDocument
        
        Object.defineProperties Window::,

            self                    : value : self

            document                : value : self.document




class Node

class Element           extends Node

class HTMLElement       extends Element

class HTMLDocument      extends HTMLElement
    
    getElementById  : ( id ) ->
        

    querySelector   : ( filter ) ->
        @createElement tagName = "canvas"

    createElement   : ( tagName ) ->
        HTMLCanvasElement.create() 

class HTMLCanvasElement extends HTMLElement

    @create         : ->
        new (class canvas extends OffscreenCanvas)(256, 256)

    getContext      : ( type ) ->
