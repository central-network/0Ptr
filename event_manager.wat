
    (global $OFFSET_EVENT_MANAGER mut i32)
    (global $LENGTH_EVENT_MANAGER i32 i32(16))

    (global $LENGTH_EVENT_HEADERS i32 i32(32))

    (global $event_manager.window_for_each_tick_handler mut i32)
    (global $event_manager.window_for_each_frame_handler mut i32)
    (global $event_manager.window_for_each_second_handler mut i32)

    (func $new_event_manager
        (result $this* i32)
        
        (global.set $OFFSET_EVENT_MANAGER
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_EVENT_MANAGER)
            )
        )

        (global.set $event_manager.window_for_each_tick_handler
            (call $window_listener.add_listener_for_each_tick<fun>i32
                func($event_manager.hanlde_for_each_tick<>)
            )
        )

        (global.set $event_manager.window_for_each_frame_handler
            (call $window_listener.add_listener_for_each_frame<fun>i32
                func($event_manager.hanlde_for_each_frame<>)
            )
        )

        (global.set $event_manager.window_for_each_second_handler
            (call $window_listener.add_listener_for_each_second<fun>i32
                func($event_manager.hanlde_for_each_second<>)
            )
        )

        (global.get $OFFSET_EVENT_MANAGER)
    )

    (func $event_manager.hanlde_for_each_tick<>
    )

    (func $event_manager.hanlde_for_each_frame<>
    )

    (func $event_manager.hanlde_for_each_second<>
    )

    (func $event_manager.dispatch<i32>
        (param $event_type i32)

        (warn<ref.i32>
            text('dispatched event type:')
            local($event_type)
        )
    )
