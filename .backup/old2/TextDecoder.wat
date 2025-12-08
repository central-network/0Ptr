
    (func   $TextDecoder*                                                                                      (type $->i32)    (call $alloc<type.size> elem($TextDecoder) size($TextDecoder)))
    (func   $get<textDecoder*>textDecoder#                                                                  (type $i32->ext) table(get $ext call($get<textDecoder*>#textDecoder local(0))))
    (func   $get<textDecoder*>#textDecoder(type $i32->i32) i32(get i32(sum local(0) offset($TextDecoder.#textDecoder))))
    (func   $set<textDecoder*.#textDecoder>(type $i32x2->)  i32(set i32(sum local(0) offset($TextDecoder.#textDecoder)) local(1)))

    (func   $construct<textDecoder*>                                                                           (type $i32->)
        (call $set<textDecoder*.#textDecoder> local(0)
            table(grow $ext new(self.TextDecoder) i32(1))
        )
    )

    (func   $decode<textDecoder*.string*>string#                                                          (type $i32x2->ext)
        call($decode<textDecoder*.buffer#>string#
            local(0) call($get<buffer*>buffer# 
                call($get<string*>buffer* local(1))
            )
        )
    )

    (func   $decode<textDecoder*.buffer*>string#                                                          (type $i32x2->ext)
        call($decode<textDecoder*.buffer#>string#
            local(0) call($get<buffer*>buffer# local(1))
        )
    )

    (func   $decode<textDecoder*.buffer#>string#                                                        (type $i32.ext->ext)
        Reflect(apply
            (self.TextDecoder.prototype.decode)
            call($get<textDecoder*>textDecoder# local(0))
            Array.of(local(1))
        )
    )
