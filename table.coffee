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


Database.defineProperty "buffer",
    enumerable : on,
    get : -> -> @subarray()

Database.definePointer "bufferOffset",
    enumerable : on,
    instanceOf : OPTR.Uint32Number

Database.definePointer "bufferLength",
    enumerable : on,
    instanceOf : OPTR.Uint32Number

Table.definePointer "name",
    enumerable : on,
    instanceOf : OPTR.StringPointer

Table.defineProperty "stride",
    enumerable : on,
    get : -> ( blen = 0 ) ->
        for c in @children
            blen += c.byteLength
        blen

Column.definePointer "name",
    enumerable : on,
    instanceOf : OPTR.StringPointer

Column.definePointer "instanceOf",
    enumerable : on,
    instanceOf : OPTR.ClassPointer

Column.definePointer "byteLength",
    enumerable : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "offset",
    enumerable : on,
    instanceOf : OPTR.Uint16Number

