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

    @from           : ( options = {} ) ->
        ptri = @new()
        ptrc = @classPointer

        for key , val of options
            ptri[ key ] = ptrc.getProperty(key).from(val)

        ptri

export class Table                      extends OPTR.ObjectPointer

    @classPointer   : OPTR.ClassPointer.from this

    createColumn    : ( name, instanceOf, byteLength ) ->
        @appendChild Column.from {
            name,
            instanceOf, byteLength,
            offset : @updateStride()
        }

    updateStride    : ->
        stride = 0

        for column in @children
            stride += column.byteLength.toPrimitive()

        @stride.set( stride ).toPrimitive()

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

    @from           : ( arg0, arg1, result, operator ) ->
        Object.assign Operation.new(), {
            begin : 0, count : 0, index : 0,
            arg0, arg1, result, operator
        }

    toWorkerCode          : ->
        operator = "/";

        $strideIn0 = 12;
        
        #todo if stride is 0 then it is constant
        $strideIn1 = 0; #? multi -> single operation
        $strideOut = 4;
        
        $offsetIn0 = 22;
        $offsetIn1 = 10;
        $offsetOut = 0;

        [ ";;operation", "",
            "let $isLittleEndian = 1;",
            "let $index = 0;",
            "let $count = 10000;",
            "",
            "let $arg0;",
            "let $offsetIn0 = #{$offsetIn0};",
            "let $strideIn0 = #{$strideIn0};",
            "let $tableOffsetIn0 = 24125;",
            "let $indexOffsetIn0 = $tableOffsetIn0 + $offsetIn0;",
            "",
            "let $arg1;",
            "let $offsetIn1 = #{$offsetIn1};",
            "let $strideIn1 = #{$strideIn1};",
            "let $tableOffsetIn0 = 2412;",
            "let $indexOffsetIn1 = $tableOffsetIn1 + $offsetIn1;",
            "",
            "let $result;",
            "let $offsetOut = #{$offsetOut};",
            "let $strideOut = #{$strideOut};",
            "let $tableOffsetOut = 2422154;",
            "let $indexOffsetOut = $tableOffsetOut + $offsetOut;",
            "",

            "$arg0 = view.getUint32( $indexOffsetIn0, $isLittleEndian ); ",
            "$arg1 = view.getUint32( $indexOffsetIn1, $isLittleEndian ); ", 
            "",
            "while ( --$count )",
            "{",
            "   view.setUint32( ",
            "       $indexOffsetOut, ",
            "       ($arg0 #{operator} $arg1), ",
            "       $isLittleEndian"
            "   );", 
            "",
            ( $strideIn0 and "   $arg0 = view.getUint32( $indexOffsetIn0, $isLittleEndian ); " or ""),
            ( $strideIn1 and "   $arg1 = view.getUint32( $indexOffsetIn1, $isLittleEndian ); " or ""),
            "",
            "   $indexOffsetOut += #{$strideOut};",
            ($strideIn0 and "   $indexOffsetIn0 += #{$strideIn0};" or ""),
            ($strideIn1 and "   $indexOffsetIn1 += #{$strideIn1};" or ""),
            "}",
            "",
            ";;done",
        "" ].join "\n\t"


Database.defineProperty "buffer",
    enumerable : on,
    getter : -> -> @subarray()

Database.definePointer "bufferOffset",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32Number

Database.definePointer "bufferLength",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32Number


Table.definePointer "stride",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Table.definePointer "name",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer



Column.definePointer "byteLength",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "offset",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint16Number

Column.definePointer "instanceOf",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.ObjectPointer

Column.definePointer "name",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.StringPointer


Operation.definePointer "begin",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "count",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber

Operation.definePointer "index",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint32AtomicNumber


Operation.definePointer "arg0",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "arg1",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink

Operation.definePointer "result",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.PointerLink



Operation.definePointer "operator",
    enumerable : on,
    isRequired : on,
    instanceOf : Operator

Operator.definePointer "type",
    enumerable : on,
    isRequired : on,
    instanceOf : OPTR.Uint8Number

