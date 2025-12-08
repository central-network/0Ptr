

    (global $wasm.Class                                                                                           (mut externref)
        (ref.null extern)
    )

    (global $wasm.Class*                                                                                                (mut i32)
        (i32.const 0)
    )

    (func   $wasm.Class                                                                                             (type $->ext)
        (if (null (table.get $ext elem($wasm.Class))) 
            (then 
                (call $extend<ext2>ext
                    (text "Class")
                    (call $wasm.Pointer)
                ) 
                (gset $wasm.Class)

                ;;(call $wasm.Class::)
                (call $ext<->i32 (gget $wasm.Class) elem($wasm.Class))
                (call $defineProperties<class*>     elem($wasm.Class))
            )
        )
        (gget $wasm.Class)
    )
    
    (func   $wasm.Class::                                                                                              (type $->)
        (local $property* i32)

        ;;(call $set<class*.byteLength> elem($wasm.Class) (size $wasm.Class))
        ;;(call $set<*class*>          elem($wasm.Class) elem($wasm.Pointer))
        ;;(call $set<class*.parent*>    elem($wasm.Class) elem($wasm.Pointer))
        ;;(call $set<class*.index>      elem($wasm.Class) elem($wasm.Class))
        ;;(call $set<class*.name*>      elem($wasm.Class) (string* "Class"))

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Class))
            (call $set<property*.name*>         (get $property*) (string* "name"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Class::name))
            (call $set<property*.typeof>        (get $property*) (result $->ptr))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Class))
            (call $set<property*.name*>         (get $property*) (string* "parent*"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Class::parent))
            (call $set<property*.typeof>        (get $property*) (result $->ptr))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Class))
            (call $set<property*.name*>         (get $property*) (string* "byteLength"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Class::byteLength))
            (call $set<property*.typeof>        (get $property*) (result $->i32))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Class))
            (call $set<property*.name*>         (get $property*) (string* "index"))
            (call $set<property*.enumerable>    (get $property*) (false))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Class::index))
            (call $set<property*.typeof>        (get $property*) (result $->i32))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Class))
            (call $set<property*.name*>         (get $property*) (string* "class#"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Class::index))
            (call $set<property*.typeof>        (get $property*) (result $ext))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Class))
            (call $set<property*.name*>         (get $property*) (string* "properties#"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.getter>        (get $property*) elem($get<class*>properties#))
            (call $set<property*.typeof>        (get $property*) (result $->ext))
        )

    )

    (func   $wasm.Class*                                                                                              (type $->*)
        (if (gget $wasm.Class*) (then (return (gget $wasm.Class*))))
            (gset $wasm.Class*  elem($wasm.Class))
        
        ;;(call $wasm.Class::)
        elem($wasm.Class)
    )

    (func   $extend<ext2>ext                                                                                    (type $ext2->ext)
        (text " return class   ") local(0) 
        (text " extends this {}")
        (call $concat<ext3>ext  )
        (call $self.Function<ext>ext) local(1) (call $array#)
        (call $apply<ext3>ext)
        (tee 0)
    )

    (func   $new<>class*                                                                                            (type $->i32)
        (call $new<buffer*>class* (gget $memory*))
    ) 
        
    (func   $new<buffer*>class*                                                                                  (type $i32->i32)
        (lcal $class* i32)
        (call $add<buffer*.byteLength> local(0) (size $wasm.Class)) (tee $class*)                    
        (call $set<*class*> (get $class*) elem($wasm.Class))    
    ) 
        
    (func   $get<*>class*                                                                                        (type $i32->i32)
        (i32.get i32(sum local(0) (i32.const 4)))
    )

    (func   $set<*class*>                                                                                        (type $i32x2->)
        (i32.set i32(sum local(0) (i32.const 4)) local(1))
    )
        
    (func   $get<*>next*                                                                                         (type $i32->i32)
        (i32.get local(0))
    )

    (func   $set<*next*>                                                                                         (type $i32x2->)
        (i32.set local(0) local(1))
    )

    (func   $set<*class*>*                                                                                    (type $i32x2->i32)
        (call $set<*class*> local(0) local(1)) local(0)
    )

    (func   $get<*>class#                                                                                        (type $i32->ext)
        (call $get<class*>class# (call $get<*>class* local(0)))
    )

    (func   $get<class*>prototype#                                                                               (type $i32->ext)
        (call $get<ext2>ext 
        (call $get<class*>class# local(0)) (text "prototype"))
    )

    (func   $get<class*>parent#                                                                                  (type $i32->ext)
        ;;(call $get<class*>class# 
        ;;(call $get<class*>parent* local(0)))
        (gget $self.Number)
    )

    (func   $get<class*>class#                                                                                   (type $i32->ext)
        (local $index i32)
        (local $parent* i32)
        (local $class# externref)
        

        (if (i32.eqz local(0)) 
            (then    (return (gget $self.Number))))

        (if (i32.eqz (tee $index  (call $get<class*>index local(0))))
            (then    (unreachable)))

        (if (null    (tee $class# (i32->ext (get $index))))
            (then    (set $class# (call_indirect (type $->ext) (get $index)))))

        (if (null    (get $class#))
            (then    (unreachable)))
        
        (get $class#)
    )

    (func   $get<class*>index                                                                                    (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Class::index)))
    )

    (func   $set<class*.index>                                                                                    (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Class::index)) local(1))
    )

    (func   $get<class*>byteLength                                                                               (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Class::byteLength)))
    )

    (func   $set<class*.byteLength>                                                                               (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Class::byteLength)) local(1))
    )

    (func   $get<class*>parent*                                                                                    (type $i32->*)
        (i32.get i32(sum local(0) (offset $wasm.Class::parent)))
    )

    (func   $set<class*.parent*>                                                                                  (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Class::parent)) local(1))
    )

    (func   $get<class*>name*                                                                                      (type $i32->*)
        (i32.get i32(sum local(0) (offset $wasm.Class::name)))
    )

    (func   $get<class*>name#                                                                                    (type $i32->ext)
        (local $name* i32)
        (if (tee $name*  (call $get<class*>name*    local(0))) 
            (then (return (call $get<string*>string# (get $name*))))
        )
        (text "Unnamed")
    )

    (func   $set<class*.name*>                                                                                    (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Class::name)) local(1))
    )

    (func   $new<class*>*                                                                                        (type $i32->i32)
        (call $new<buffer*.class*>* (gget $memory*) local(0))
    )

    (func   $new<buffer*.class*>*                                                                              (type $i32x2->i32)
        (local $pointer* i32)
        (local $byteLength i32)

        (call $get<class*>byteLength local(1)) (set $byteLength)
        (call $add<buffer*.byteLength> local(0) (get $byteLength)) (tee $pointer*)
        (call $set<*class*> (get $pointer*) local(1))
    )

    (func   $construct<*>ext                                                                                     (type $i32->ext)
        (call $get<*>class# local(0))
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
    )

    (func   $get<class*>properties#                                                                              (type $i32->ext)
        (local $property* i32)
        (local $properties# externref) (set $properties# (call $array#))
        
        (loop  $property?
            (if (tee $property* (i32.get (get $property*))) (then 
                (br_if $property? 
                    (call $ne<property*.class*> (get $property* ) local(0)))
                    (call $push<ext2>           (get $properties#) 
                    (call $construct<*>ext      (get $property* )))
                (br $property?))
            )
        )
        (get $properties#)
    )

    (func   $log<*>                                                                                                 (type $i32->)
        (call $construct<*>ext local(0))#
    )

    (func   $warn<*>                                                                                                 (type $i32->)
        (call $construct<*>ext local(0))#w
    )

    