

    (global $wasm.String                                                                                          (mut externref)
        (ref.null extern)
    )

    (global $wasm.String*                                                                                               (mut i32)
        (i32.const 0)
    )

    (func   $wasm.String                                                                                            (type $->ext)
        (if (null (table.get $ext elem($wasm.String))) 
            (then 
                (call $extend<ext2>ext
                    (text "String")
                    (call $wasm.Pointer)
                )
                (gset $wasm.String)

                (if (null (table.get $ext elem($wasm.String)))
                    (then (nop (unreachable)))
                    (else (gget $wasm.String)#)
                )

                (call $ext<->i32 (call $wasm.String) elem($wasm.String))
                ;;(call $defineProperties<class*> elem($wasm.String))
            )
        )
        (gget $wasm.String)
    )
    
    (func   $wasm.String::                                                                                        (type $->)
        (local $property* i32)

        ;;(call $set<class*.byteLength>  elem($wasm.String) (size $wasm.String))
        ;;(call $set<class*.parent*>     elem($wasm.String) elem($wasm.Pointer))        
        ;;(call $set<class*.index>       elem($wasm.String) elem($wasm.String))
        ;;(call $set<class*.name*>       elem($wasm.String) (string* "String"))
        
        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.String))
            (call $set<property*.name*>         (get $property*) (string* "length"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.String::length))
            (call $set<property*.typeof>        (get $property*) (result $->i32))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.String))
            (call $set<property*.name*>         (get $property*) (string* "buffer*"))
            (call $set<property*.enumerable>    (get $property*) (false))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.String::buffer))
            (call $set<property*.typeof>        (get $property*) (result $->ptr))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.String))
            (call $set<property*.name*>         (get $property*) (string* "value#"))
            (call $set<property*.enumerable>    (get $property*) (false))
            (call $set<property*.getter>        (get $property*) elem($get<string*>string#))
            (call $set<property*.typeof>        (get $property*) (result $->ext))
        )

    )

    (func   $wasm.String*                                                                                           (type $->i32)
        (if (gget $wasm.String*) (then (return (gget $wasm.String*))))
            (gset $wasm.String*  elem($wasm.String))
            
        
        ;;(call $wasm.String::)
        elem($wasm.String)
    )

    (func   $new<>string*                                                                                           (type $->i32)
        (call $new<class*>* elem($wasm.String))
    )

    (func   $new<length>string*                                                                                  (type $i32->i32)
        local(0) local(0)
        (call $new<length.byteLength>string*)
    )

    (func   $new<string#>string*                                                                                 (type $ext->i32)
        (lcal $length  i32)
        (lcal $string* i32)

        (set $length   (call $length<ext>i32 local(0)))
        (set $string*  (call $new<length>string* (get $length)))

        (loop $..
            (if (get $length)
                (then
                    (call $charCodeAt<string*.offset.charCode>
                        (get $string*)
                        (tee $length i32(dif (get $length) (i32.const 1)))
                        (call $charCodeAt<ext.i32>i32 local(0) (get $length))
                    )
                    (br $..)
                )
            )
        )

        (get $string*)
    )

    (func   $new<length.byteLength>string*                                                                     (type $i32x2->i32)
        local(0) 
        (call $new<buffer*.byteLength>buffer* (gget $memory*) local(1))
        (call $new<length.buffer*>string*)
    )

    (func   $new<length.buffer*>string*                                                                        (type $i32x2->i32)
        (local $string* i32)

        (call $new<>string*)          (tee $string*)
        (call $set<string*.length>    (get $string*) local(0))
        (call $set<string*.buffer*>   (get $string*) local(1))
    )

    (func   $get<string*>string#                                                                                 (type $i32->ext)
        (local $args# externref)
        (local $string# externref)
        (local $charCode i32)
        (local $offset i32)
        (local $value# i32)

        (if (tee $value# (call $get<string*>value local(0)))
            (then (return (i32->ext (get $value#)))))

        (set $offset  (call $get<string*>byteLength local(0)))
        (set $string# (call $string#))

        (loop $offset..
            i32(dif (get $offset) (i32.const 1))
            (set $offset)

            local(0) (get $offset)
            (call $charAt<string*.offset>string#)
            (get $string#)

            (call $concat<string#x2>string#)
            (set $string#)

            (get $offset)
            (br_if $offset..)
        )

        local(0)
        (call $ext->i32 (get $string#))
        (call $set<string*.value>)

        (get $string#)
    )

    (func   $charAt<string*.offset>string#                                                                     (type $i32x2->ext)
        (call $fromCharCode<i32>string# (call $charCodeAt<string*.offset>charCode local(0) local(1)))
    )

    (func   $charCodeAt<string*.offset>charCode                                                                (type $i32x2->i32)
        (call $get<buffer*.byteOffset>ui8  (call $get<string*>buffer* local(0)) local(1))
    )

    (func   $charCodeAt<string*.offset.charCode>                                                                  (type $i32x3->)
        (call $set<buffer*.byteOffset.ui8> (call $get<string*>buffer* local(0)) local(1) (get 2))
    )

    (func   $get<string*>byteOffset                                                                              (type $i32->i32)
        (call $get<buffer*>byteOffset (call $get<string*>buffer* local(0)))
    )

    (func   $get<string*>byteLength                                                                              (type $i32->i32)
        (call $get<buffer*>byteLength (call $get<string*>buffer* local(0)))
    )

    (func   $get<string*>length                                                                                  (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.String::length)))
    )
 
    (func   $set<string*.length>                                                                                  (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.String::length)) local(1))
    )

    (func   $get<string*>buffer*                                                                                 (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.String::buffer)))
    )

    (func   $set<string*.buffer*>                                                                                 (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.String::buffer)) local(1))
    )

    (func   $get<string*>value                                                                               (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.String::value)))
    )

    (func   $set<string*.value>                                                                               (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.String::value)) local(1))
    )

    (func   $fromCharCode<>string*                                                                                  (type $->i32)
        (call $new<>string*)
    )

    (func   $fromCharCode<i32>string*                                                                            (type $i32->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 1)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))

        (get $string*)
    )

    (func   $fromCharCode<i32x1>string*                                                                        (type $i32x1->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 1)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))

        (get $string*)
    )

    (func   $fromCharCode<i32x2>string*                                                                        (type $i32x2->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 2)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))

        (get $string*)
    )

    (func   $fromCharCode<i32x3>string*                                                                        (type $i32x3->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 3)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))

        (get $string*)
    )

    (func   $fromCharCode<i32x4>string*                                                                        (type $i32x4->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 4)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))

        (get $string*)
    )

    (func   $fromCharCode<i32x5>string*                                                                        (type $i32x5->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 5)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 4) (get 4))

        (get $string*)
    )

    (func   $fromCharCode<i32x6>string*                                                                        (type $i32x6->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 6)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 4) (get 4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 5) (get 5))

        (get $string*)
    )

    (func   $fromCharCode<i32x7>string*                                                                        (type $i32x7->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 7)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 4) (get 4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 5) (get 5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 6) (get 6))

        (get $string*)
    )

    (func   $fromCharCode<i32x8>string*                                                                        (type $i32x8->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 8)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 4) (get 4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 5) (get 5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 6) (get 6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 7) (get 7))

        (get $string*)
    )

    (func   $fromCharCode<i32x9>string*                                                                        (type $i32x9->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 9)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 4) (get 4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 5) (get 5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 6) (get 6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 7) (get 7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 8) (get 8))

        (get $string*)
    )

    (func   $fromCharCode<i32x10>string*                                                                      (type $i32x10->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 10)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 0) local(0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 1) local(1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 2) (get 2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 3) (get 3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 4) (get 4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 5) (get 5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 6) (get 6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 7) (get 7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 8) (get 8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 9) (get 9))

        (get $string*)
    )

    (func   $fromCharCode<i32x11>string*                                                                      (type $i32x11->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 11)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))

        (get $string*)
    )

    (func   $fromCharCode<i32x12>string*                                                                      (type $i32x12->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 12)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))

        (get $string*)
    )

    (func   $fromCharCode<i32x13>string*                                                                      (type $i32x13->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 13)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 12) (get 12))

        (get $string*)
    )

    (func   $fromCharCode<i32x14>string*                                                                      (type $i32x14->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 14)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 12) (get 12))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 13) (get 13))

        (get $string*)
    )

    (func   $fromCharCode<i32x15>string*                                                                      (type $i32x15->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 15)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 12) (get 12))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 13) (get 13))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 14) (get 14))

        (get $string*)
    )

    (func   $fromCharCode<i32x16>string*                                                                      (type $i32x16->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 16)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 12) (get 12))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 13) (get 13))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 14) (get 14))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 15) (get 15))

        (get $string*)
    )

    (func   $fromCharCode<i32x17>string*                                                                      (type $i32x17->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 17)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 12) (get 12))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 13) (get 13))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 14) (get 14))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 15) (get 15))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 16) (get 16))

        (get $string*)
    )

    (func   $fromCharCode<i32x18>string*                                                                      (type $i32x18->i32)
        (local $string* i32)
        (set $string* (call $new<length>string* (i32.const 18)))

        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  0) (get  0))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  1) (get  1))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  2) (get  2))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  3) (get  3))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  4) (get  4))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  5) (get  5))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  6) (get  6))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  7) (get  7))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  8) (get  8))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const  9) (get  9))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 10) (get 10))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 11) (get 11))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 12) (get 12))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 13) (get 13))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 14) (get 14))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 15) (get 15))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 16) (get 16))
        (call $charCodeAt<string*.offset.charCode> (get $string*) (i32.const 17) (get 17))

        (get $string*)
    )
