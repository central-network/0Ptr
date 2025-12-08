
    (global $wasm.Window                                                                                          (mut externref)
        (ref.null extern)
    )

    (global $wasm.Window*                                                                                               (mut i32)
        (i32.const 0)
    )

    (func   $wasm.Window                                                                                            (type $->ext)
        (if (null (table.get $ext elem($wasm.Window))) 
            (then 
                (text "Window")
                (call $wasm.Pointer)
                (call $extend<ext2>ext)         (gset $wasm.Window)

                ;;(call $wasm.Window::)
                (call $ext<->i32                (gget $wasm.Window) elem($wasm.Window))
                (call $defineProperties<class*> elem($wasm.Window))
            )
        )
        (gget $wasm.Window)
    )
    
    (func   $wasm.Window::                                                                                             (type $->)
        (local $property* i32)

        ;;(call $set<class*.index>       elem($wasm.Window) elem($wasm.Window))
        ;;(call $set<class*.byteLength>  elem($wasm.Window) (size $wasm.Window))
        ;;(call $set<class*.name*>       elem($wasm.Window) (string* "Window"))
        ;;(call $set<class*.parent*>     elem($wasm.Window) elem($wasm.Pointer))        

        (block                                  (lset $property*  (call $new<>property*))
            (call $set<property*.class*>        (lget $property*) elem($wasm.Window))
            (call $set<property*.name*>         (lget $property*) (string* "name*"))
            (call $set<property*.enumerable>    (lget $property*) (true))
            (call $set<property*.byteOffset>    (lget $property*) (offset $wasm.Window::name))
            (call $set<property*.typeof>        (lget $property*) (result $->ptr))
        )

        (block                                  (lset $property*  (call $new<>property*))
            (call $set<property*.class*>        (lget $property*) elem($wasm.Window))
            (call $set<property*.name*>         (lget $property*) (string* "externref#"))
            (call $set<property*.enumerable>    (lget $property*) (false))
            (call $set<property*.getter>        (lget $property*) elem($get<window*>externref#))
            (call $set<property*.typeof>        (lget $property*) (result $->ext))
        )

    )

    (func   $wasm.Window*                                                                                           (type $->i32)
        (if (gget $wasm.Window*) (then (return (gget $wasm.Window*))))
            (gset $wasm.Window*  elem($wasm.Window))
                    
       ;; (call $wasm.Window::)
        elem($wasm.Window)
    )

    (func   $new<>window*                                                                                           (type $->i32)
        (call $new<class*>* elem($wasm.Window))
    )

    (func   $get<window*>name*                                                                                   (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Window::name)))
    )

    (func   $set<window*.name*>                                                                                   (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Window::name)) local(1))
    )

    (func   $get<window*>name#                                                                                   (type $i32->ext)
        (call $get<window*>name* local(0))
        (call $get<string*>string#)
    )

    (func   $set<window*.name#>                                                                                 (type $i32.ext->)
        local(0) 
        (call $new<string#>string* local(1))
        (call $set<window*.name*>)
    )

    (func   $get<window*>externref                                                                               (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Window::externref)))
    )

    (func   $set<window*.externref>                                                                               (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Window::externref)) local(1))
    )

    (func   $get<window*>externref#                                                                              (type $i32->ext)
        (i32->ext (call $get<window*>externref local(0)))
    )

    (func   $set<window*.externref#>                                                                            (type $i32.ext->)
        (call $set<window*.externref> local(0) (call $ext->i32 local(1)))
    )
