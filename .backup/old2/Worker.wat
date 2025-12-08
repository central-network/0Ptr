
    (func   $Worker*                                                                                           (type $->i32)    
        local($worker* i32)
        
        local(tee $worker*
            call($alloc<type.size>
                elem($Worker)
                size($Worker)
            )
        )

        call($set<worker*.device*> local($worker*) global($device*))
        call($set<worker*.thread*> local($worker*) global($thread*))
    )

    (func   $get<worker*>buffer*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Worker.buffer*))))
    (func   $set<worker*.buffer*>                                                                            (type $i32x2->)  i32(set i32(sum local(0) offset($Worker.buffer*)) local(1)))

    (func   $get<worker*>device*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Worker.device*))))
    (func   $set<worker*.device*>                                                                            (type $i32x2->)  i32(set i32(sum local(0) offset($Worker.device*)) local(1)))

    (func   $get<worker*>thread*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Worker.thread*))))
    (func   $set<worker*.thread*>                                                                            (type $i32x2->)  i32(set i32(sum local(0) offset($Worker.thread*)) local(1)))

    (func   $get<worker*>worker#                                                                            (type $i32->ext) table(get $ext call($get<worker*>#worker local(0))))
    (func   $get<worker*>#worker                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Worker.#worker))))
    (func   $set<worker*.#worker>                                                                            (type $i32x2->)  i32(set i32(sum local(0) offset($Worker.#worker)) local(1)))

    (func   $get<worker*>#script                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Worker.#script))))
    (func   $set<worker*.#script>                                                                            (type $i32x2->)  i32(set i32(sum local(0) offset($Worker.#script)) local(1)))

    
    (func   $get<worker*>script#                                                                            (type $i32->ext)
        (local $#script      i32)
        (local $buffer*      i32)
        (local $bufferBegin  i32)
        (local $bufferLength i32)

        (if (tee $#script call($get<worker*>#script local(0)))
            (then (return table(get $ext local($#script))))
        )

        local(set $buffer*      call($get<worker*>buffer*   local(0)))
        local(set $bufferBegin  call($get<buffer*>begin     local($buffer*)))
        local(set $bufferLength call($get<buffer*>length    local($buffer*)))

        call($set<worker*.#script>
            local(0)
            local(tee $#script table(grow $ext
            
                call($self.URL.createObjectURL call($Reflect.construct (self.Blob) Array.of(Array.of(String(`

                onmessage = e => { 
                    if (e. data instanceof WebAssembly.Memory) {
                        console.log(e.data.buffer.slice(0, 256))
                        WebAssembly.instantiate(
                            new Uint8Array( e.data.buffer, local($bufferBegin), local($bufferLength) ).slice().buffer,
                            Object.assign( self, { memory : e.data, length: local(0) })
                        )
                    }
                }

                `))))) i32(1))
            )
        )

        i32(ext local($#script))
    )

    (func   $create<worker*>worker#                                                                         (type $i32->ext)
        (local $worker* i32)
        (local $#worker i32)
        (local $worker# externref)
        (local $script# externref)

        local(set $worker* local(0))
        local(set $script# Array.of(call($get<worker*>script# local($worker*))))
        local(set $worker# Reflect.construct(self.Worker local($script#)))
        local(set $#worker table(grow $ext local($worker#) (i32.const 1)))

        call($set<worker*.#worker> local($worker*) local($#worker))
        call($instantiate<worker*> local($worker*)) 

        local($worker#)
    )

    (func   $instantiate<worker*>                                                                              (type $i32->)
        call($postMessage<worker*.message#> 
            local(0) global($memory)
        )
    )

    (func   $postMessage<worker*.message#>                                                                 (type $i32.ext->)
        global(set $worker# call($get<worker*>worker# local(0)))
        
        Reflect(apply
            (self.Worker.prototype.postMessage) 
            global($worker#) 
            Array.of(local(1))
        )

        drop
    )