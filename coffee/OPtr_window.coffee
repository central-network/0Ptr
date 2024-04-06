export class Window

export class Node

export class Element           extends Node

export class HTMLElement       extends Element

export class HTMLDocument      extends HTMLElement
    
    getElementById  : ( id ) ->
        return console.log id
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

Object.defineProperties self,

    window      : value : self

    document    : value : document = new (class document extends HTMLDocument)

Object.defineProperties self.window,

    self        : value : self

    document    : value : document

    window      : value : window

