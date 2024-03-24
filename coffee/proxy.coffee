import {
    Proxy,
    console,
    Object
} from "./window.js"

export { console }

if  WorkerGlobalScope? then get = ->
    
        [ target, prop, proxy ] = arguments

        name = target.constructor.name
        from = self[ name ]
    
        console.log "worker", name, prop

        unless from
            return undefined

        return switch typeof from[ prop ]
            when "function" then ->
                    console.log "called on worker:", prop
    
            when "undefined"
                console.log "worker undefined", prop

else get = ( target, prop, proxy ) ->

    name = target.constructor.name
    from = self[ name ]

    console.log "window", name, prop

    return switch typeof from[ prop ]

        when "function" then ->
            console.log "called on window:", prop

        when "undefined"
            console.log "window undefined cll", prop

export document = new Proxy ( new class document ), { get }