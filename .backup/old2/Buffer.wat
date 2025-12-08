
    (func   $Buffer*                                                                                           (type $->i32)    
        call($malloc<bufferType.bufferSize>* elem($Buffer) size($Buffer))
    )

    (func   $create<byteLength>buffer*                                                                      (type $i32->i32)
        local($buffer* i32)
        local(tee $buffer* call($Buffer*)) 

        call($set<buffer*.byteLength> local($buffer*) local(0))
        call($resize<buffer*>         local($buffer*))
    )


    (func   $get<buffer*>buffer*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Buffer.buffer*))))
    (func   $set<buffer*.buffer*>                                                                            (type $i32x2->) i32(set i32(sum local(0) offset($Buffer.buffer*)) local(1)))

    (func   $get<buffer*>index                                                                              (type $i32->i32) i32(get i32(sum local(0) offset($Buffer.index))))
    (func   $set<buffer*.index>                                                                              (type $i32x2->) i32(set i32(sum local(0) offset($Buffer.index)) local(1)))

    (func   $get<buffer*>byteOffset                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($Buffer.byteOffset))))
    (func   $set<buffer*.byteOffset>                                                                         (type $i32x2->) i32(set i32(sum local(0) offset($Buffer.byteOffset)) local(1)))

    (func   $get<buffer*>byteLength                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($Buffer.byteLength))))
    (func   $set<buffer*.byteLength>                                                                         (type $i32x2->) i32(set i32(sum local(0) offset($Buffer.byteLength)) local(1)))
    
    (func   $get<buffer#>byteLength                                                                         (type $ext->i32) 
        local(0).byteLength i32
    )

    (func   $get<buffer*>begin  
        (type $i32->i32) 
        (call $get<buffer*>byteOffset local(0))
    )
    
    (func   $get<buffer*.byteOffset>                                                                      (type $i32x2->i32) 
        i32(sum local(1) call($get<buffer*>begin local(0)))
    )
    
    (func   $get<buffer*>length  
        (type $i32->i32) 
        (call $get<buffer*>byteLength local(0))
    )
    
    (func   $get<buffer*>end  
        (type $i32->i32) 
        i32(sum 
            call($get<buffer*>begin local(0))
            call($get<buffer*>length local(0))
        )
    )

    (func   $get<buffer*.byteOffset>ui8                                                                   (type $i32x2->i32) (ui8.get call($get<buffer*.byteOffset> local(0) local(1))))
    (func   $set<buffer*.byteOffset.ui8>                                                                     (type $i32x3->) (ui8.set call($get<buffer*.byteOffset> local(0) local(1)) local(2)))

    (func   $get<buffer*>byteArray#                                                                         (type $i32->ext)  
        (local $begin i32)
        (local $length i32)

        local(set $begin  call($get<buffer*>begin  local(0)))
        local(set $length call($get<buffer*>length local(0)))

        global(set $args# [])
        
        Reflect(set global($args#) i32(0)D global($sab))
        Reflect(set global($args#) i32(1)D local($begin)D)
        Reflect(set global($args#) i32(2)D local($length)D)

        Reflect.new(self.Uint8Array global($args#))
    )

    (func   $resize<buffer*>                                                                                   (type $i32->)
        local($buffer* i32)
        local($byteOffset i32)
        local($byteLength i32)

        local(set $buffer*      call($get<buffer*>byteOffset local(0)))
        local(set $byteOffset   call($get<buffer*>byteOffset local($buffer*)))

        (if local($byteOffset)
            (then throw("ZERO_BUFFER_BYTELENGTH"))
            (else
                local(set $byteOffset
                    call($grow<memory*.byteLength>
                        global($memory*) local($byteLength)
                    )
                )

                call($set<buffer*.byteOffset>
                    local($buffer*) local($byteOffset)
                )
            )
        )
    )

    (func   $copyBytesFrom<buffer*.buffer#>                                                                (type $i32.ext->)
        (local $begin i32)
        (local $length i32)

        local(set $begin  call($get<buffer*>begin local(0)))
        local(set $length call($get<buffer*>length local(0)))

        global(set $args# [])
        
        Reflect(set global($args#) i32(0)D global($sab))
        Reflect(set global($args#) i32(1)D local($begin)D)
        Reflect(set global($args#) i32(2)D local($length)D)

        global(set $object# Reflect(new self.Uint8Array global($args#)))

        Reflect(call
            self.Uint8Array.prototype.set 
            global($object#)
            Reflect(new self.Uint8Array local(1)AO)AO
        )

        drop
    )
    
    (func   $get<buffer*>buffer#                                                                            (type $i32->ext)
        call($get<buffer*.byteOffset.byteLength>buffer#
            local(0) i32(0) call($get<buffer*>byteLength local(0))
        )
    ) 
    
    (func   $get<buffer*.byteOffset>buffer#                                                               (type $i32x2->ext)
        call($get<buffer*.byteOffset.byteLength>buffer#
            local(0) local(1) call($get<buffer*>byteLength local(0))
        )
    ) 
        
    (func   $get<buffer*.byteLength>buffer#                                                               (type $i32x2->ext)
        call($get<buffer*.byteOffset.byteLength>buffer#
            local(0) i32(0) local(1)
        )
    ) 
    
    (func   $get<buffer*.byteOffset.byteLength>buffer#                                                    (type $i32x3->ext)
        global(set $args# [])
        global(set $object# call($get<buffer*>byteArray# local(0)))

        Reflect(set global($args#) i32(0)D local(1)D)
        Reflect(set global($args#) i32(1)D i32(sum local(1) local(2))D)

        Reflect(call
            global($object#).slice global($object#) global($args#)
        )['buffer']
    ) 
    
    (func   $sab<byteOffset.byteLength>buffer#                                                            (type $i32x2->ext)
        global(set $args# [])

        Reflect(set global($args#) i32(0)D local(0)D)
        Reflect(set global($args#) i32(1)D i32(sum local(0) local(1))D)

        Reflect(call 
            global($sab).slice
            global($sab)
            global($args#)
        )
    ) 
    
    (func   $import<buffer#>buffer*                                                                         (type $ext->i32) 
        (local $buffer* i32)
        (local $length i32)

        local(tee $buffer*  call($Buffer*))
        local(set $length   call($get<buffer#>byteLength local(0)))

        call($set<buffer*.byteLength> local($buffer*) local($length))
        call($resize<buffer*>         local($buffer*))

        call($copyBytesFrom<buffer*.buffer#> local($buffer*) local(0))
    )