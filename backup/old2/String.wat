
    (func   $String*                                                                                           (type $->i32)    
        elem($String) size($String) (call $alloc<type.size>)
    )

    (func   $get<string*>buffer*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($String.buffer*))))
    (func   $set<string*.buffer*>                                                                            (type $i32x2->) i32(set i32(sum local(0) offset($String.buffer*)) local(1)))

    (func   $get<string*>length                                                                             (type $i32->i32) i32(get i32(sum local(0) offset($String.length))))
    (func   $set<string*.length>                                                                             (type $i32x2->) i32(set i32(sum local(0) offset($String.length))  local(1)))
    (func   $get<string#>length                                                                             (type $ext->i32)
        Reflect(apply
            (self.String.prototype.lastIndexOf) 
            local(0) call($Array.of<''>)
        ).toNumber(i32)
    )
        
    (func   $get<string*>#string                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($String.#string))))
    (func   $set<string*.#string>                                                                            (type $i32x2->) i32(set i32(sum local(0) offset($String.#string)) local(1)))
    (func   $get<string*>string#                                                                            (type $i32->ext)
        (if (type $->ext) call($get<string*>length local(0))
            (then
                Reflect(apply
                    (self.String.fromCharCode) 
                    (null)
                    call($get<buffer*>byteArray# 
                        call($get<string*>buffer* local(0))
                    )
                )
            )
            (else call($String.of<''>))
        )
    )
    
    (func   $import<string#>string*                                                                         (type $ext->i32)
        local($length i32)

        (if local(tee $length call($get<string#>length local(0)))
            (then
                global(set $buffer* call($Buffer*))
                global(set $string* call($String*))

                (call $set<string*.buffer*>          global($string*) global($buffer*))
                (call $set<buffer*.byteLength>       global($buffer*) local($length))
                (call $set<string*.length>           global($string*) local($length))
                (call $resize<buffer*>               global($buffer*))

                (loop $set
                    call($set<buffer*.byteOffset.ui8> 
                        global($buffer*) 
                        local(tee $length i32(dif local($length) i32(1))) 
                        Reflect(apply
                            (self.String.prototype.charCodeAt) 
                            local(0) 
                            Array.of(Number(local($length)))
                        ).toNumber(i32)
                    )

                    (br_if $set local($length))
                )
            )
        )

        global($string*)
    )
    
