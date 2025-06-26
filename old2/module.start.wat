
    (global $device* (mut i32) i32(0))
    (global $thread* (mut i32) i32(0))
    (global $memory* (mut i32) i32(0))
    (global $pointerBase* (mut i32) i32(0))
    (global $base.byteOffset* (mut i32) i32(0))
    (global $base.bufferType* (mut i32) i32(0))
    (global $base.parentPtri* (mut i32) i32(0))

    (LOOP_INIT size($Memory)&)

    (func   $init

        call($onmessage<buffer#> global($sab))
    )

    (func   $onmessage<buffer#>                                                                                (type $ext->)
        local(0) local(0).to(Int32Array).at(0) (call_indirect (type $ext->))
    )

    (func   $Memory                                                                                            (type $ext->)
        local(0)Lw
    )


    (func   $setup<worker*>                                                                                    (type $i32->)
    )
    
    (func   $setup<window*>                                                                                    (type $i32->)
    )

    (func   $dump
        local($i i32)
        local($j i32)
        local($ptrs ext)
        local($length i32)
        local($offset i32)
        local($innerOffset i32)
        local($search v128)
        local($type i32)
        
        local(set $type   i32($Event))
        local(set $search (i32x4.splat local($type)))
        local(set $length i32(dif (i32.load OFFSET_P) VALUE_INIT_P_OFFSET))
        local(set $offset i32(sum (i32.load OFFSET_P) FARPOINT_OFTYPE))
        local(set $length i32(sum local($length) i32(dif i32(16) i32(mod local($length) i32(16)))))


        local(set $j i32(-1))
        local(set $ptrs Array())

        (loop $i32x4
            (if local($length)
                (then
                    local(set $offset i32(dif local($offset) i32(16)))
                    local(set $length i32(dif local($length) i32(16)))

                    (if (i32x4.all_true (i32x4.ne (v128.load local($offset)) local($search)))
                        (then (br $i32x4))
                        (else
                            local(set $i i32(16))
                            local(set $innerOffset local($offset))

                            (loop $i8x4
                                (if local($i)
                                    (then
                                        local(set $innerOffset 
                                            i32(sum 
                                                local($offset) 
                                                local(tee $i i32(dif local($i) i32(4)))
                                            )
                                        )

                                        (br_if $i8x4 i32(ne local($type) (i32.load local($innerOffset))))
                                        
                                        Reflect(set
                                            local($ptrs) 
                                            local($j ++)D 
                                            i32(dif local($innerOffset) FARPOINT_OFTYPE)P
                                        )

                                        (br $i8x4)
                                    )
                                )
                            )
                            (br $i32x4)
                        )
                    )
                )
            )
        )
        console.log(local($ptrs))
        
    )
    

    