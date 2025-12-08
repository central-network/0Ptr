    (func   $dump.i8x16                                                                                        (type $i32->)
        local($array ext)
        local($a0 ext)
        local($a1 ext)
        local($a2 ext)

        local(set $array Array())
        local(set $a0 Array())
        local(set $a1 Array())
        local(set $a2 Array())

        global(set $arg0# Array())
        global(set $arg1# Array())
        global(set $arg2# Array())

        Reflect(set local($array) Number(0) global($sab))
        Reflect(set local($array) Number(1) Number(local(0)))
        Reflect(set local($array) Number(2) Number(16))

        local(set $a0 Array.from(Reflect.construct(self.Uint8Array local($array))))
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg0#));
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg1#));
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg2#));
        console.log(local($a0))    
    )

    (func   $get<i32x4*>array#                                                                              (type $i32->ext)
        Array.from(
            Reflect.construct(
                (self.Int32Array) 
                Array.of(
                    call($get<buffer*.byteOffset.byteLength>buffer#
                        call($sab*) local(0) i32(16)
                    )
                )
            )
        )
    )

    (func   $get<i32x4>array#                                                                               (type $128->ext)
        (v128.store OFFSET_TEMP_V128 local(0))
        (call $get<i32x4*>array# OFFSET_TEMP_V128) 
    )

    (func   $dump.v128x2                                                                                     (type $i32x2->)
        local($array ext)
        local($a0 ext)
        local($a1 ext)
        local($a2 ext)

        local(set $array Array())
        local(set $a0 Array())
        local(set $a1 Array())
        local(set $a2 Array())

        global(set $arg0# Array())
        global(set $arg1# Array())
        global(set $arg2# Array())

        Reflect(set global($arg0#) Number(0) Number(12))
        Reflect(set global($arg0#) Number(1) Number(0))
        Reflect(set global($arg0#) Number(2) call($self.String.fromCharCode i32(" ")))

        Reflect(set global($arg1#) Number(0) Number(8))
        Reflect(set global($arg1#) Number(1) Number(0))
        Reflect(set global($arg1#) Number(2) call($self.String.fromCharCode i32(" ")))

        Reflect(set global($arg2#) Number(0) Number(4))
        Reflect(set global($arg2#) Number(1) Number(0))
        Reflect(set global($arg2#) Number(2) call($self.String.fromCharCode i32(" ")))


        Reflect(set local($array) Number(0) global($sab))
        Reflect(set local($array) Number(1) Number(local(0)))
        Reflect(set local($array) Number(2) Number(16))

        local(set $a0 Array.from(Reflect.construct(self.Uint8Array local($array))))
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg0#));
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg1#));
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg2#));
        console.log(
            Array.of(
                Reflect(apply(self.Array.prototype.join) local($a0)
                    Array.of(call($self.String.fromCharCode i32(" ")))
                )
            )
        )    

        Reflect(set local($array) Number(1) Number(local(1)))
        Reflect(set local($array) Number(1) Number(16))
        local(set $a0 Array.from(Reflect.construct(self.Uint8Array local($array))))
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg0#));
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg1#));
        Reflect(apply(self.Array.prototype.splice) local($a0) global($arg2#));
        console.log(
            Array.of(
                Reflect(apply(self.Array.prototype.join) local($a0)
                    Array.of(call($self.String.fromCharCode i32(" ")))
                )
            )
        )    
    )
