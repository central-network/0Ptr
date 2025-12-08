
    (func   $Event*                                                                                            (type $->i32)    (call $alloc<type.size> elem($Event) size($Event)))

    (func   $get<event*>type                                                                                (type $i32->i32) i32(get i32(sum local(0) offset($Event.type))))
    (func   $set<event*.type>                                                                                (type $i32x2->)  i32(set i32(sum local(0) offset($Event.type)) local(1)))

    (func   $get<event*>state                                                                               (type $i32->i32) i32(get i32(sum local(0) offset($Event.state))))
    (func   $set<event*.state>                                                                               (type $i32x2->)  i32(set i32(sum local(0) offset($Event.state)) local(1)))

    (func   $get<event*>target*                                                                             (type $i32->i32) i32(get i32(sum local(0) offset($Event.target*))))
    (func   $set<event*.target*>                                                                             (type $i32x2->)  i32(set i32(sum local(0) offset($Event.target*)) local(1)))

    (func   $get<event*>source*                                                                             (type $i32->i32) i32(get i32(sum local(0) offset($Event.source*))))
    (func   $set<event*.source*>                                                                             (type $i32x2->)  i32(set i32(sum local(0) offset($Event.source*)) local(1)))

    (func   $get<event*>device*                                                                             (type $i32->i32) i32(get i32(sum local(0) offset($Event.device*))))
    (func   $set<event*.device*>                                                                             (type $i32x2->)  i32(set i32(sum local(0) offset($Event.device*)) local(1)))

    (func   $get<event*>event#                                                                              (type $i32->ext) table(get $ext call($get<event*>#event local(0))))
    (func   $get<event*>#event                                                                              (type $i32->i32) i32(get i32(sum local(0) offset($Event.#event))))
    (func   $set<event*.#event>                                                                              (type $i32x2->)  i32(set i32(sum local(0) offset($Event.#event)) local(1)))

    (func   $dispatchEvent<type.source*.target*>                                                             (type $i32x3->)
        local($event* i32)
        local(set $event* call($Event*))

        call($set<event*.type>    local($event*) local(0))
        call($set<event*.source*> local($event*) local(1))
        call($set<event*.target*> local($event*) local(2))
        call($set<event*.device*> local($event*) global($device*))

        console.log(local($event*)P)
    )