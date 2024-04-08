import defaults from "./0ptr_self.js"

exports     = new defaults.Object
TypedArray  = Object.getPrototypeOf defaults.Uint8Array

Object.defineProperty defaults.String   , "charCodeOf",
    value : -> arguments[0].charCodeAt 0

Object.defineProperty defaults.String:: , "toNumber",
    value : -> @split("").map( String.charCodeOf ).sumValues()

Object.defineProperty defaults.RegExp:: , "toNumber",
    value : -> @source.toNumber()

Object.defineProperty defaults.RegExp:: , "throw",
    value : ->
        throw new Error(@source) if !console.error "\t\t\t ", arguments...

Object.defineProperty defaults.Array::  , "sumValues",
    value : -> @reduce (i, j) -> i + j or 0

Object.defineProperty TypedArray::      , "sumValues",
    value : -> [ this... ].sumValues()

class KeyOf extends Number
    with : -> [ this, arguments... ]

exports.ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO =
    new ( class ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO extends KeyOf )(
        /ZERO_POINTER_MUST_BE_DIFFERENT_THEN_ZERO/.toNumber()
    )

export default exports