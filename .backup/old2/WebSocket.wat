
    (EVENT_WEBSOCKET_CONSTRUCT 4)
    (EVENT_WEBSOCKET_OPEN 0)
    (EVENT_WEBSOCKET_CONNECTING 1)
    (EVENT_WEBSOCKET_CLOSING 2)
    (EVENT_WEBSOCKET_CLOSED 3)
    (EVENT_WEBSOCKET_RECV 5)
    (EVENT_WEBSOCKET_SEND 6)

    (func   $WebSocket*                                                                                        (type $->i32)    
        local($socket* i32)
        
        local(set $socket* 
            (call $alloc<type.size>
                elem($WebSocket) size($WebSocket)
            )
        )

        call($set<socket*.cacheSize> 
            local($socket*) 
            SOCKET_CACHE_SIZE
        )

        call($set<socket*.device*> 
            local($socket*) 
            global($device*)
        )

        call($set<socket*.readyState> 
            local(0) 
            EVENT_WEBSOCKET_CONSTRUCT
        )

        local($socket*)
    )

    (func   $get<socket*>device*                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.device*))))
    (func   $set<socket*.device*>(type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.device*)) local(1)))

    (func   $get<socket*>cache*                                                                             (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.cache*))))
    (func   $set<socket*.cache*>                                                                             (type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.cache*)) local(1)))

    (func   $get<socket*>cacheSize                                                                          (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.cacheSize))))
    (func   $set<socket*.cacheSize>(type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.cacheSize)) local(1)))

    (func   $get<socket*>socket#                                                                            (type $i32->ext) table(get $ext call($get<socket*>#socket local(0))))
    (func   $get<socket*>#socket                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.#socket))))
    (func   $set<socket*.#socket>(type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.#socket)) local(1)))

    (func   $get<socket*>url*                                                                               (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.url*))))
    (func   $set<socket*.url*>                                                                               (type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.url*)) local(1)))

    (func   $get<socket*>tx                                                                                 (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.tx))))
    (func   $set<socket*.tx>                                                                                 (type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.tx)) local(1)))
    (func   $add<socket*.tx>(type $i32x2->)  call($set<socket*.tx> local(0) i32(sum call($get<socket*>tx local(0)) local(1))))

    (func   $get<socket*>rx                                                                                 (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.rx))))
    (func   $set<socket*.rx>                                                                                 (type $i32x2->)  i32(set i32(sum local(0) offset($WebSocket.rx)) local(1)))
    (func   $add<socket*.rx>(type $i32x2->)  call($set<socket*.rx> local(0) i32(sum call($get<socket*>rx local(0)) local(1))))

    (func   $get<socket*>readyState                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($WebSocket.readyState))))
    (func   $set<socket*.readyState>                                                                         (type $i32x2->)  
        (i32.store 
            i32(sum local(0) 
            offset($WebSocket.readyState)) 
            local(1)
        )

        call($dispatchEvent<type.source*.target*>
            local(1)
            local(0)
            global($thread*)
        )
    )

    (func   $get<socket*>url#                                                                               (type $i32->ext)
        call($get<string*>string# 
            call($get<socket*>url* local(0))
        )
    )

    (func   $test.open<socket*>                                                                             (type $i32->ext)
        local($args# ext)

        call($set<socket*.url*>
            local(0)
            (call $import<string#>string*
                Reflect(apply
                    (self.prompt)
                    (null) 
                    Array.of(String("server url:"))
                )
            )
        )
        
        call($open<socket*> local(0)) 
        call($get<socket*>socket# local(0))
    )

    (func   $test.send<socket*>                                                                             (type $i32->ext)
        local($buffer# ext)
        
        local(tee $buffer#
            call($get<buffer*.byteLength>buffer# 
                call($data*) Number.from(Reflect(apply
                    (self.prompt) (null) Array.of(String("byteLength:"))
                ))
            )
        )

        call($send<socket*.buffer#> 
            local(0) 
            local($buffer#)
        )
    )

    (func   $construct<socket*>                                                                             (type $i32->ext)
        local($socket# ext)

        local(tee $socket# 
            Reflect.construct(
                (self.WebSocket)
                Array.of(call($get<socket*>url# local(0)))
            )
        )

        Reflect(set local($socket#) String("binaryType") String("arraybuffer"))
        Reflect(set local($socket#) (undefined) Number(local(0)))

        Reflect.bind( local($socket#) String("onopen")    func($onopen<event#>))
        Reflect.bind( local($socket#) String("onerror")   func($onerror<event#>))
        Reflect.bind( local($socket#) String("onclose")   func($onclose<event#>))
        Reflect.bind( local($socket#) String("onmessage") func($onmessage<event#>))        
    )

    (func   $send<socket*.buffer*>                                                                           (type $i32x2->)
        call($send<socket*.buffer#>
            local(0) 
            call($get<buffer*>buffer# local(1))
        )

        call($add<socket*.tx> local(0) 
            call($get<buffer*>byteLength local(1))
        )
    )

    (func   $send<socket*.buffer#>                                                                         (type $i32.ext->)
        Reflect(apply
            (self.WebSocket.prototype.send) 
            call($get<socket*>socket# local(0)) 
            Array.of(local(1))
        );

        call($dispatchEvent<type.source*.target*>
            EVENT_WEBSOCKET_SEND 
            local(0) global($thread*)
        )
    )

    (func   $open<socket*>                                                                                     (type $i32->)
        local($#socket i32)
        local($socket# ext)

        local($cache* i32)
        local($cacheSize i32)

        local(set $cacheSize call($get<socket*>cacheSize local(0)))
        local(set $cache* call($create<byteLength>buffer* local($cacheSize)))
        
        local(set $socket# call($construct<socket*> local(0))) 
        local(set $#socket table(grow $ext local($socket#) (i32.const 1)))

        call($set<socket*.cache*> local(0) local($cache*))
        call($set<socket*.#socket> local(0) local($#socket))

        call($set<socket*.readyState> 
            local(0) 
            EVENT_WEBSOCKET_CONNECTING
        )
    )

    (func   $onopen<event#>                                                                                    (type $ext->)
        local($socket* i32)

        Event.of(local(0));
        
        call($set<socket*.readyState>
            local(tee $socket*)
            EVENT_WEBSOCKET_OPEN
        )
    )

    (func   $onerror<event#>                                                                                   (type $ext->)
        local($socket* i32)

        Event.of(local(0));

        call($set<socket*.readyState> 
            local(tee $socket*) 
            EVENT_WEBSOCKET_CLOSING
        )
    )

    (func   $onclose<event#>                                                                                   (type $ext->)
        local($socket* i32)

        Event.of(local(0));
        
        call($set<socket*.readyState>
            local(tee $socket*) 
            EVENT_WEBSOCKET_CLOSED
        ) 
    )

    (func   $onmessage<event#>                                                                                 (type $ext->)
        local($socket* i32)
        local($buffer# ext)

        Event.of(local(0))
            local(set $buffer#) 
            local(set $socket*)

        console.log(local($buffer#))

        call($add<socket*.rx> local($socket*) 
            call($get<buffer#>byteLength local($buffer#))
        )

        call($copyBytesFrom<buffer*.buffer#>
            call($get<socket*>cache* local($socket*))
            local($buffer#)
        )

        call($dispatchEvent<type.source*.target*>
            EVENT_WEBSOCKET_RECV 
            local($socket*) global($thread*)
        )
    )
