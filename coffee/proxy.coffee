export default Proxy = self.Proxy

Proxy.HTMLElement = class HTMLElement
    constructor  : ( @name ) ->
        @tagName = @name.replace(/HTML|Element/g, "").toUpperCase()
