   
    (global $memory* i32 (i32 0))

    (func   $memory.init    
        (jsx)
    )
    
    (func   $malloc 
    (type $i32->i32)
        (i32 8) 
        local(0) call $%8 
        (i32.atomic.rmw.add) 
    )
    (func   $palloc 
    (type $i32->i32) 
    (local i32) 
                (i32 4) 
                local(0) (i32.atomic.rmw.add) 
        (tee 1) local(0) 
        local(1) i32.add (i32.atomic.store) 
        local(1)
    )
    (func   $%8 
    (type $i32->i32) 
    (local i32)
        local(0) (i32 8) i32.rem_u 
                        (tee 1) if 
                (i32 8) local(1) i32.sub 
                        (set 1)
        local(0)         local(1) i32.add 
        (set 0)                 end     
        local(0)
    )
    