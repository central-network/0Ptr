
    (func   $Window*                                                                                           (type $->i32) call($alloc<type.size> elem($Window) size($Window)))

    (func   $get<window*>window#                                                                            (type $i32->ext) i32(ext call($get<window*>#window local(0))))
    (func   $get<window*>#window                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Window.#window))))
    (func   $set<window*.#window>                                                                            (type $i32x2->) i32(set i32(sum local(0) offset($Window.#window)) local(1)))

    (func   $get<window*>name#                                                                              (type $i32->ext) call($get<string*>string# call($get<window*>name* local(0))))
    (func   $get<window*>name*                                                                              (type $i32->i32) i32(get i32(sum local(0) offset($Window.name*))))
    (func   $set<window*.name*>                                                                              (type $i32x2->) i32(set i32(sum local(0) offset($Window.name*)) local(1)))


    (func   $import<window#>window*                                                                         (type $ext->i32)
        local($window* i32)
        local(set $window* call($Window*))
        
        call($set<window*.#window> 
            local($window*) 
            table(add $ext local(0))
        )

        call($set<window*.name*>
            local($window*)
            call($import<string#>string* local(0).name)
        )

        local($window*)
    )