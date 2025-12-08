
    (global $sab* (mut i32) i32(0))
        (OFFSET_P 8)
        (OFFSET_ALLOC_BYTES 4)

        (OFFSET_DATA_PADDING 12)
        (OFFSET_DEVICE_OFFSET 16)
        (OFFSET_TEMP_V128 128)

        (VALUE_INIT_P_OFFSET 1024) ;; padding: 256bytes
        (FARPOINT_OFTYPE 4096) ;; max 480 ptr available
        (VALUE_INIT_T_OFFSET 5120) ;; padding: 4096 + 1024
        (POINTER_PER_GROUP 32)
        (ALIGN_BYTELENGTH 8)

        (VALUE_DATA_PADDING 0x1000000) ;; padding: 1.6Mb 
        (SOCKET_CACHE_SIZE 0x10000) ;; 65KB

    (func   $byteLength                                                                                        (type $->i32) 
        i32(get OFFSET_ALLOC_BYTES)
    )
    
    (func   $ptriLength                                                                                        (type $->i32) 
        i32(get OFFSET_P)
    )
    
    (func   $alloc<size>                                                                                    (type $i32->i32) 
        (local i32)
        
        (if local(tee 1 (i32.mod local(0) ALIGN_BYTELENGTH)) (then 
            local(set 0 i32(sum local(0) i32(dif ALIGN_BYTELENGTH local(1))))))

        (i32.atomic.rmw.add OFFSET_ALLOC_BYTES local(0))
    )

    (func   $sab*                                                                                              (type $->i32)
        (if (i32.eqz global($sab*)) (then 
            global(set $sab* call($Buffer*))))

        call($set<buffer*.byteLength> 
            global($sab*) call($byteLength)
        )

        global($sab*)
    )

    (func   $data*                                                                                             (type $->i32)
        call($set<buffer*.byteOffset> 
            call($sab*) VALUE_DATA_PADDING
        )

        global($sab*)
    )

    (func   $alloc<type.size>                                                                             (type $i32x2->i32)
        local($ptri i32)
        
        (i32.atomic.store 
            local(tee $ptri (i32.atomic.rmw.add OFFSET_P i32(4)))
            (i32.atomic.rmw.add OFFSET_ALLOC_BYTES local(1))
        )
        
        (i32.atomic.store
            i32(sum local($ptri) FARPOINT_OFTYPE) 
            local(0)
        )

        local($ptri)
    )

    (func   $type                                                                                           (type $i32->i32) (i32.load i32(sum local(0) i32(4))))
    
    (func   $ptri                                                                                           (type $i32->i32)
        local($addr i32)

        (if local(0)
            (then
                local(set $addr
                    (i32.load local(0))
                )
            )
            (else
                console.error(local(0)D)
                console.error(local(0)P)
                (unreachable)
            )
        )

        (if (i32.lt_u local($addr) VALUE_INIT_P_OFFSET)
            (then
                console.error(call($sab<byteOffset.byteLength>buffer# OFFSET_P i32(256)))

                console.error(Number(local($addr)))
                console.error(Number(local(0)))
                console.error(local(0)P)
                (unreachable)
            )
        )

        local($addr)
    )
