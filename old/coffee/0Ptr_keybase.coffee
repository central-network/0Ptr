export class KeyBase extends Object

    @metaUrl    : `import.meta.url`

    @filter     : "__filter__"

    @extend     : "__extend__"

    @encode     : "__encode__"

    defaults    :
        
        filter  : -> arguments[0]

        extend  : Number
        
        encode  : -> [ 0, ...arguments[0] ].reduce (a, b) -> a + b.charCodeAt()

    constructor : ( source = {}, options = {} ) ->
        super().configure( options ).add( source )
            #.scopeIndex = -1 + @scope.push( this )

    configure   : ( options ) ->
        for option , value of @defaults

            symbol = @constructor[ option ]
            value ?= @constructor.defaults[ option ]
            
            Object.defineProperty @, symbol, { value }
        this

    @generate   : ( source = {} ) ->
        base = new this()
        Object.defineProperty(
            base.set( label , base.__encode__ key ),
            key , value : base[ label ]
        ) for label , key of source ; return base

    set         : ( label, value, proto = @__extend__ ) ->
        return unless @__filter__ value
        return if @hasOwnProperty value

        key = new (eval("(class #{label} extends #{proto.name} {})"))( value )

        Object.defineProperty this, label, value : key
        Object.defineProperty this, value, value : key

        this

    add         : ( source, proto = @__extend__ ) ->
        @set label, value, proto for label , value of source ; this
