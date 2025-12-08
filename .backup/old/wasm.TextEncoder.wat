

    (global $textEncoder*                                                                                               (mut i32)
        (i32.const 0)
    )

    (global $wasm.TextEncoder                                                                                     (mut externref)
        (ref.null extern)
    )

    (global $wasm.TextEncoder*                                                                                          (mut i32)
        (i32.const 0)
    )

    (func   $wasm.TextEncoder                                                                                       (type $->ext)
        (if (null (table.get $ext elem($wasm.TextEncoder))) 
            (then 
                (call $extend<ext2>ext
                    (text "TextEncoder")
                    (call $wasm.Pointer)
                ) 
                (gset $wasm.TextEncoder)

                ;;(call $wasm.TextEncoder::)
                (call $ext<->i32 (call $wasm.TextEncoder) elem($wasm.TextEncoder))
                (call $defineProperties<class*> elem($wasm.TextEncoder))
            )
        )
        (gget $wasm.TextEncoder)
    )
    
    (func   $wasm.TextEncoder::                                                                                        (type $->)
        (local $property* i32)

        ;;(call $set<class*.index>       elem($wasm.TextEncoder) elem($wasm.TextEncoder))
        ;;(call $set<class*.byteLength>  elem($wasm.TextEncoder) (size $wasm.TextEncoder))
        ;;(call $set<class*.name*>       elem($wasm.TextEncoder) (string* "TextEncoder"))
        ;;(call $set<class*.parent*>     elem($wasm.TextEncoder) elem($wasm.Pointer))        

        (block                                  (lset $property*  (call $new<>property*))
            (call $set<property*.class*>        (lget $property*) elem($wasm.TextEncoder))
            (call $set<property*.name*>         (lget $property*) (string* "encoding*"))
            (call $set<property*.enumerable>    (lget $property*) (true))
            (call $set<property*.byteOffset>    (lget $property*) (offset $wasm.TextEncoder::encoding))
            (call $set<property*.typeof>        (lget $property*) (result $->ptr))
        )

        (block                                  (lset $property*  (call $new<>property*))
            (call $set<property*.class*>        (lget $property*) elem($wasm.TextEncoder))
            (call $set<property*.name*>         (lget $property*) (string* "externref#"))
            (call $set<property*.enumerable>    (lget $property*) (false))
            (call $set<property*.getter>        (lget $property*) elem($get<textEncoder*>textEncoder#))
            (call $set<property*.typeof>        (lget $property*) (result $->ext))
        )

    )

    (func   $wasm.TextEncoder*                                                                                      (type $->i32)
        (if (gget $wasm.TextEncoder*) (then (return (gget $wasm.TextEncoder*))))
            (gset $wasm.TextEncoder*  elem($wasm.TextEncoder))
                
       ;; (call $wasm.TextEncoder::)
        elem($wasm.TextEncoder)
    )

    (func   $textEncoder*                                                                                           (type $->i32)        
        (if (gget $textEncoder*) (then (return (gget $textEncoder*))))
            (gset $textEncoder*  (call $new<>textEncoder*))

        (call $new.TextEncoder<>ext)                                  (gset $externref)
        (call $set<textEncoder*.textEncoder#> (gget $textEncoder*) (gget $externref))
        (call $set<textEncoder*.encoding#>    (gget $textEncoder*)
        (call $get<textEncoder#>encoding#                          (gget $externref)))
        
        (gget $textEncoder*)
    )

    (func   $new<>textEncoder*                                                                                      (type $->i32)
        (call $new<class*>* elem($wasm.TextEncoder))
    )

    (func   $get<textEncoder*>encoding*                                                                          (type $i32->i32)
        (i32.get i32(sum (local.get 0) (offset $wasm.TextEncoder::encoding)))
    )

    (func   $set<textEncoder*.encoding*>                                                                          (type $i32x2->)
        (i32.set i32(sum (local.get 0) (offset $wasm.TextEncoder::encoding)) (local.get 1))
    )

    (func   $set<textEncoder*.encoding#>                                                                        (type $i32.ext->)
        (call $set<textEncoder*.encoding*> local(0) 
        (call $new<string#>string* local(1)))
    )

    (func   $get<textEncoder*>textEncoder#                                                                       (type $i32->ext)
        (i32->ext 
        (call $get<textEncoder*>externref local(0)))
    )

    (func   $set<textEncoder*.textEncoder#>                                                                     (type $i32.ext->)
        (call $set<textEncoder*.externref> local(0) 
        (call $ext->i32 local(1)))
    )

    (func   $get<textEncoder*>externref                                                                          (type $i32->i32)
        (i32.get i32(sum (local.get 0) (offset $wasm.TextEncoder::externref)))
    )

    (func   $set<textEncoder*.externref>                                                                          (type $i32x2->)
        (i32.set i32(sum (local.get 0) (offset $wasm.TextEncoder::externref)) (local.get 1))
    )

    (func   $encode<textEncoder*.string#>uInt8Array#                                                         (type $i32.ext->ext)
        local(0) (call $get<textEncoder*>textEncoder#)
        local(1) (call $encode<ext2>ext)
    )

    (func   $encode<string#>uInt8Array#                                                                          (type $ext->ext)
        (call $textEncoder*) (call $get<textEncoder*>textEncoder#)
        local(0) (call $encode<ext2>ext)
    )
