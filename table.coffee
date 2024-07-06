import * as OPTR from "./0ptr.js"

{ log, warn, error } = console

export class Database                   extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @create         : ( pages = 0 ) ->
        @new( pages * 654 )

    createTable     : ( name ) ->
        tbli = Table.new()
        tbli.name = name
        
        @appendChild tbli

    createOperation : -> Operation.from arguments...

export class Column                     extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

export class Table                      extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    createColumn    : ( name, instanceOf, byteLength ) ->

        column = new Object {
            name, instanceOf,
            byteLength, offset : @stride
        }
        
        @appendChild Object.assign Column.new(), column

export class Operator                   extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @operators      : [ 0, "+", "-", "*", "/", "%" ]

    @from           : ( operator = "+" ) ->
        Object.assign @new(), type : @operators.indexOf operator

    toPrimitive     : ->
        Operator.operators[ @type ]

    Object.defineProperty this::, "operator",
        enumerable: on
        get : Operator::toPrimitive

    Object.defineProperty this::, "children",
        enumerable: off
        value : []


export class Operation                  extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    @from           : ( arg0, arg1, result, operator, begin = 0, count = 0, index = 0 ) ->

        operator = Operator.from operator

        operation = new Object {
            begin, count, index,
            arg0, arg1, result, operator
        }
        
        Object.assign Operation.new(), operation


Database.defineProperty "buffer",
    enumerable : on,
    get : -> -> @subarray()

Database.definePointer "bufferOffset",
    enumerable : on,
    instanceOf : OPTR.Uint32Number

Database.definePointer "bufferLength",
    enumerable : on,
    instanceOf : OPTR.Uint32Number


Table.defineProperty "stride",
    enumerable : on,
    get : -> ( blen = 0 ) ->
        for c in @children
            blen += c.byteLength
        blen

Table.definePointer "name",
    enumerable : on,
    instanceOf : OPTR.StringPointer


Column.definePointer "byteLength",
    enumerable : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "offset",
    enumerable : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "instanceOf",
    enumerable : on,
    instanceOf : OPTR.ClassPointer

Column.definePointer "name",
    enumerable : on,
    instanceOf : OPTR.StringPointer


Operation.definePointer "begin",
    byteLength : 4
    enumerable : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "count",
    byteLength : 4
    enumerable : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "index",
    byteLength : 4
    enumerable : on,
    instanceOf : OPTR.Uint32AtomicNumber


Operation.definePointer "arg0",
    byteLength : 4
    enumerable : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "arg1",
    byteLength : 4
    enumerable : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "result",
    byteLength : 4
    enumerable : on,
    instanceOf : OPTR.PointerLink



Operation.definePointer "operator",
    enumerable : on,
    instanceOf : Operator

Operator.definePointer "type",
    enumerable : on,
    instanceOf : OPTR.Uint8Number

