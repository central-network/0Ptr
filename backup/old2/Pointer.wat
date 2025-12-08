
    (func   $Pointer.call                                                                                 (type $i32x4->ext)
        (local $sum i32)

        local(0)DL

        (if i32(eq local(1) type($call_indirect)) 
            (then (return local(0) local(2) (call_indirect (type $i32->ext))))
        )

        (if local(tee $sum i32(sum call($get<*>offset local(0)) local(2)))
            (then 
                (if i32(eq local(1) type($ptr*->ptr)) (then (return i32(get local($sum))P)))
                (if i32(eq local(1) type($ptr*->i32)) (then (return i32(get local($sum))D)))
                (if i32(eq local(1) type($ptr*->ext)) (then (return i32(ext local($sum)))))
            )
        )

        (null)
    )
    