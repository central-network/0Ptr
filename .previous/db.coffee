import * as Optr from "./core.js"
export * from "./core.js"

export DBServer = Optr.Class.from(

    class DBServer extends Optr.default

        @classIndex     : @store this

        toPrimitive     : -> @detach() 

        uuid            : Optr.UUID

        version         : Optr.Number

)

DBServer.define "hello",
    class : Optr.Number
    value : -1.23

