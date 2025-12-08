

    (global $wasm.Property                                                                                        (mut externref)
        (ref.null extern)
    )
    
    (global $wasm.Property*                                                                                             (mut i32)
        (i32.const 0)
    )

    (func   $wasm.Property                                                                                          (type $->ext)
        (if (null (table.get $ext elem($wasm.Property))) 
            (then 
                (call $extend<ext2>ext
                    (text "Property")
                    (call $wasm.Pointer)
                ) 
                (gset $wasm.Property)

                ;;(call $wasm.Property::)
                (call $ext<->i32 (call $wasm.Property) elem($wasm.Property))
                ;;(call $defineProperties<class*> elem($wasm.Property))
            )
        )

        (gget $wasm.Property)
    )

    (func   $wasm.Property::                                                                                         (type $->)
        (local $property* i32)
        
        ;;(call $set<class*.parent*>       elem($wasm.Property) elem($wasm.Pointer))
        ;;(call $set<class*.byteLength>    elem($wasm.Property) (size $wasm.Property))
        ;;(call $set<class*.index>         elem($wasm.Property) elem($wasm.Property))
        ;;(call $set<class*.name*>         elem($wasm.Property) (string* "Property"))

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Property))
            (call $set<property*.name*>         (get $property*) (string* "name"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Property::name))
            (call $set<property*.typeof>        (get $property*) (result $->ptr))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Property))
            (call $set<property*.name*>         (get $property*) (string* "class*"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Property::class))
            (call $set<property*.typeof>        (get $property*) (result $->ptr))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Property))
            (call $set<property*.name*>         (get $property*) (string* "byteOffset"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Property::byteOffset))
            (call $set<property*.typeof>        (get $property*) (result $->i32))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Property))
            (call $set<property*.name*>         (get $property*) (string* "element"))
            (call $set<property*.enumerable>    (get $property*) (false))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Property::value))
            (call $set<property*.typeof>        (get $property*) (result $->i32))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Property))
            (call $set<property*.name*>         (get $property*) (string* "enumerable"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Property::enumerable))
            (call $set<property*.typeof>        (get $property*) (result $->is?))
        )

        (block                                  (set $property*  (call $new<>property*))
            (call $set<property*.class*>        (get $property*) elem($wasm.Property))
            (call $set<property*.name*>         (get $property*) (string* "typeof"))
            (call $set<property*.enumerable>    (get $property*) (true))
            (call $set<property*.byteOffset>    (get $property*) (offset $wasm.Property::typeof))
            (call $set<property*.typeof>        (get $property*) (result $->i32))
        )
    )

    (func   $defineProperties<class*>                                                                               (type $i32->)
        (local $property* i32)
        (local $parent* i32)
        (local $typeof i32)
        (local $entries# externref)
        (local $funcref# funcref)
        (local $entry# externref)
        (local $value i32)
        (local $value# externref)
        (local $getter i32)
        (local $getter# externref)
        (local $prototype# externref)

        (if (tee $parent* (call $get<class*>parent* local(0)))
            (then (call $defineProperties<class*> (get $parent*)))
        )

        (call $get<class*>prototype# local(0))
        (set $prototype#)

        (loop  $property?
            (if (tee $property*  (i32.get (get $property*)))
                (then 
                    (br_if $property?  (call $ne<property*.class*> (get $property*) local(0)))
                    (set $typeof (call $get<property*>typeof (get $property*)))

                    (call $array#)
                    (set $entries#)

                    (block $typeof 

                        ;; eg: this.wasm = [funcref]
                        (if i32(eq (get $typeof) (result $->ext)) 
                            (then
                                (if (tee $value (call $get<property*>value (get $property*)))
                                    (then 
                                        (call $push<ext2>
                                            (get $entries#)
                                            (call $ext.fun->array#
                                                (text "value")
                                                (call $i32->fun (get $value))
                                            )
                                        )

                                        (br $typeof)
                                    )
                                )

                                (if (tee $getter (call $get<property*>getter (get $property*)))
                                    (then 
                                        (call $push<ext2>
                                            (get $entries#)
                                            (call $ext2->array#
                                                (text "get")
                                                (call $self.Function<ext3>ext 
                                                    (call $concat<string#.i32>string# (text "i=") (get $getter))
                                                    (call $concat<string#.i32>string# (text "s=") (get $typeof))                 
                                                    (call $concat<string#.ext>string# (text "return this.wasm") (text "(this, i, s)"))
                                                )
                                            )
                                        )

                                        (br $typeof)
                                    )
                                )
                            )
                        )
                        
                        ;; eg: get --> this[funcref](this, arg0, typeof) <-- this.wasm(...)
                        (call $push<ext2>
                            (get $entries#)
                            (call $ext2->array#
                                (text "get")
                                (call $self.Function<ext3>ext 
                                    (call $concat<string#.i32>string# (text "i=") (call $get<property*>byteOffset (get $property*)))
                                    (call $concat<string#.i32>string# (text "s=") (get $typeof))                 
                                    (call $concat<string#.ext>string# (text "return this.wasm") (text "(this, i, s)"))
                                )
                            )
                        )
                    )

                    (call $push<ext2>
                        (get $entries#)
                        (call $ext2->array#
                            (text "enumerable")
                            (call $self.Boolean<i32>boolean# 
                                (call $get<property*>enumerable (get $property*))
                            )
                        )
                    )
                        
                    (call  $defineProperty<ext3>
                        (get $prototype#)
                        (call $get<property*>name#          (get $property*))
                        (call $fromEntries<array#>object#   (get $entries#))
                    )           

                    (br $property?)
                )
            )
        )
    )

    (func   $ne<property*.class*>                                                                              (type $i32x2->i32)
        (if i32(eq (call $get<*>class* local(0)) elem($wasm.Property)) (then 
            (return i32(ne (call $get<property*>class* local(0)) local(1)))))
        (return (i32.const 1))
    )

    (func   $wasm.Property*                                                                                           (type $->*)
        (if (gget $wasm.Property*) (then (return elem($wasm.Property))))
            (gset $wasm.Property*  elem($wasm.Property))

        ;;(call $wasm.Property::)
        elem($wasm.Property)
    )

    (func   $new<>property*                                                                                         (type $->i32)
        (call $new<class*>* elem($wasm.Property))
    )

    (func   $get<property*>byteOffset                                                                            (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::byteOffset)))
    )

    (func   $set<property*.byteOffset>                                                                            (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::byteOffset)) local(1))
    )

    (func   $get<property*>value                                                                                 (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::value)))
    )

    (func   $set<property*.value>                                                                                 (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::value)) local(1))
    )

    (func   $get<property*>getter                                                                                (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::getter)))
    )

    (func   $set<property*.getter>                                                                                (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::getter)) local(1))
    )

    (func   $get<property*>class*                                                                                (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::class)))
    )

    (func   $get<property*>prototype#                                                                            (type $i32->ext)
        (call $get<class*>prototype# (call $get<property*>class* local(0)))
    )

    (func   $set<property*.class*>                                                                                (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::class)) local(1))
    )

    (func   $set<property*.name*>                                                                                 (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::name)) local(1))
    )

    (func   $get<property*>name*                                                                                 (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::name)))
    )

    (func   $get<property*>name#                                                                                 (type $i32->ext)
        (call $get<string*>string# (call $get<property*>name* local(0)))
    )

    (func   $set<property*.enumerable>                                                                            (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::enumerable)) local(1))
    )

    (func   $get<property*>enumerable                                                                            (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::enumerable)))
    )

    (func   $set<property*.typeof>                                                                                (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Property::typeof)) local(1))
    )

    (func   $get<property*>typeof                                                                                (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Property::typeof)))
    )

