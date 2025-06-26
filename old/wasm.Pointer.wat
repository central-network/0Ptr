

    (global $wasm.Pointer                                                                                         (mut externref)
        (ref.null extern)
    )

    (global $wasm.Pointer*                                                                                              (mut i32)
        (i32.const 0)
    )

    (func   $wasm.Pointer                                                                                           (type $->ext)
        (if (null (table.get $ext elem($wasm.Pointer))) 
            (then 
                (call $extend<ext2>ext
                    (text "Pointer")
                    (gget $self.Number)
                ) 
                (gset $wasm.Pointer)

                ;;(call $wasm.Pointer::)
                (call $ext<->i32 (gget $wasm.Pointer) elem($wasm.Pointer))
                (call $defineProperties<class*> elem($wasm.Pointer))
            )
        )
        (gget $wasm.Pointer)
    )

    (func   $wasm.Pointer::                                                                                          (type $->)
        (local $property* i32)

        (block $wasm.Pointer::name              (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Pointer))
            (call $set<property*.name*>         (get $property*) (string* "{{Class}}"))
            (call $set<property*.enumerable>    (get $property*) (false))
            (call $set<property*.byteOffset>    (get $property*) (i32.const 4))
            (call $set<property*.typeof>        (get $property*) (result $->ptr))
        )

        (block $wasm.Pointer::wasm              (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Pointer))
            (call $set<property*.name*>         (get $property*) (string* "wasm"))
            (call $set<property*.enumerable>    (get $property*) (false))
            (call $set<property*.value>         (get $property*) elem($wasm.Pointer::wasm))
            (call $set<property*.typeof>        (get $property*) (result $->ext))
        )
    )

    (func   $wasm.Pointer*                                                                                            (type $->*)
        (if (gget $wasm.Pointer*) (then (return (gget $wasm.Pointer*)))
            (else (gset $wasm.Pointer* elem($wasm.Pointer)))
        )

        ;;(call $wasm.Pointer::)
        elem($wasm.Pointer)
    )

    (func   $wasm.Pointer::wasm                     (param $this* i32) (param $refval i32) (param $typeof i32) (result externref)
        (local $value i32) 

        (if i32(eq (get $typeof) (result $->ext)) (then (return 
            local(0) (call_indirect $fun (type $i32->ext) (get $refval))))
        )
        
        (if i32(eq (get $typeof) (result $->i32)) (then 
            local(0) (call_indirect $fun (type $i32->i32) (get $refval))
            (return (call $self.Number<i32>number#)))
        )

        (set $value 
            (i32.get i32(sum (get $this*) (get $refval)))
        )

        (if i32(eq (get $typeof) (result $->i32))
            (then (return (call $self.Number<i32>number# (get $value))))
        )

        (if i32(eq (get $typeof) (result $->ext))
            (then (return (i32->ext (get $value))))
        )

        (if i32(eq (get $typeof) (result $->ptr))
            (then (return (call $construct<*>ext (get $value))))
        )

        (if i32(eq (get $typeof) (result $->is?))
            (then (return (call $self.Boolean<i32>boolean# (get $value))))
        )

        (if i32(eq (get $typeof) (result $->!is))
            (then (return (call $self.Boolean<i32>boolean# (i32.eqz (get $value)))))
        )

        (ref.null extern)
    )
