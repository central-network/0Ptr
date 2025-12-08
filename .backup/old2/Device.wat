
    (func   $Device*                                                                                           (type $->i32)    
        (call $alloc<type.size> elem($Device) size($Device))
    )

    (func   $get<device*>window*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Device.window*))))
    (func   $set<device*.window*>                                                                            (type $i32x2->)  i32(set i32(sum local(0) offset($Device.window*)) local(1)))

    (func   $get<device*>textEncoder*                                                                       (type $i32->i32) i32(get i32(sum local(0) offset($Device.textEncoder*))))
    (func   $set<device*.textEncoder*>(type $i32x2->)  i32(set i32(sum local(0) offset($Device.textEncoder*)) local(1)))

    (func   $get<device*>textDecoder*                                                                       (type $i32->i32) i32(get i32(sum local(0) offset($Device.textDecoder*))))
    (func   $set<device*.textDecoder*>(type $i32x2->)  i32(set i32(sum local(0) offset($Device.textDecoder*)) local(1)))
