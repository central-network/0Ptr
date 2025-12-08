    
    (table  $fun                                                                                             (size elem) funcref)
    (table  $ext                                                                                                  1000 externref)
    (global $idx                                                                               (mut i32) (i32.const (size elem)))

    (func   $->idx                                                                                                  (type $->i32)
        (local $idx i32) 
        (global.set $idx i32(sum (i32.const 1) (local.tee $idx (global.get $idx)))) 
        (local.get $idx)
    ) 

    (func   $ext->i32                                                                                            (type $ext->i32)
        (local $i i32)
        (table.set $ext (local.tee $i (call $->idx)) (local.get 0)) (local.get $i)
    ) 

    (func   $i32->ext                                                                                            (type $i32->ext)
        (table.get $ext (local.get 0))
    ) 

    (func   $ext<->i32                                                                                          (type $ext.i32->)
        (table.set $ext (local.get 1) (local.get 0))
    ) 

    (func   $i32->fun                                                                                            (type $i32->fun)
        (table.get $fun (local.get 0))
    ) 
