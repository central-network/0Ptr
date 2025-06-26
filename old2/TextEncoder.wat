
    (func   $TextEncoder*                                                                                      (type $->i32) (call $alloc<type.size> elem($TextEncoder) size($TextEncoder)))

    (func   $get<textEncoder*>textEncoder#                                                                  (type $i32->ext) i32(ext call($get<textEncoder*>#textEncoder local(0))))
    (func   $get<textEncoder*>#textEncoder                                                                  (type $i32->i32) i32(get i32(sum local(0) offset($TextEncoder.#textEncoder))))
    (func   $set<textEncoder*.#textEncoder>                                                                  (type $i32x2->) i32(set i32(sum local(0) offset($TextEncoder.#textEncoder)) local(1)))

    (func   $construct<textEncoder*>                                                                           (type $i32->)
        (call $set<textEncoder*.#textEncoder> local(0)
            table(grow $ext new(self.TextEncoder) i32(1))
        )
    )

    (func   $encode<textEncoder*.string#>buffer#                                                        (type $i32.ext->ext)
        Reflect(apply
            (self.TextEncoder.prototype.encode)
            call($get<textEncoder*>textEncoder# local(0))
            Array.of(local(1))
        )
    )

    (func   $encode<textEncoder*.string#>buffer*                                                        (type $i32.ext->i32)
        call($import<buffer#>buffer*
            call($encode<textEncoder*.string#>buffer#
                local(0) local(1)
            )
        )
    )

    (func   $encode<textEncoder*.string#>string*                                                        (type $i32.ext->i32)
        local($buffer* i32)
        local($string* i32)

        local(set $buffer*
            call($import<buffer#>buffer*
                call($encode<textEncoder*.string#>buffer#
                    local(0) local(1)
                )
            )
        )

        local(set $string* 
            call($String*)
        )
        
        call($set<string*.buffer*> local($string*) local($buffer*))
        call($set<string*.length>  local($string*) call($get<string#>length local(1)))

        local($string*)
    )