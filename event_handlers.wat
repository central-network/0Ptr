

    (global $OFFSET_EVENT_HANDLERS     mut i32)
    (global $LENGTH_EVENT_HANDLERS     i32 i32(512))

    (func $bind_event_handlers
        (global.set $OFFSET_EVENT_HANDLERS
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_EVENT_HANDLERS)
            )
        )

        (call $event_handlers.set_on_visibility_visibile_ptr<i32>
            (call $event_manager.listen<i32.fun>i32
                (global.get $EVENT_TYPE.ON_VISIBILTY_VISIBLE) 
                (ref.func $event_handler.on_visibility_visible<i32>)
            )
        )

        (call $event_handlers.set_on_visibility_hidden_ptr<i32>
            (call $event_manager.listen<i32.fun>i32
                (global.get $EVENT_TYPE.ON_VISIBILTY_HIDDEN) 
                (ref.func $event_handler.on_visibility_hidden<i32>)
            )
        )

        (call $event_handlers.set_event_loop_listener_ptr<i32>
            (call $window_listener.add_listener_for_each_cycle<fun>i32
                (ref.func $event_manager.event_loop<>)
            )
        )

        (call $window_listener.listen_local_global_this<>)
    )

    (func $event_handler.on_visibility_visible<i32>
        (param $event* i32)
        (warn<ref.i32> text('on visible from event manager. event offset:') local($event*))
    )

    (func $event_handler.on_visibility_hidden<i32>
        (param $event* i32)
        (warn<ref.i32> text('on hidden from event manager. event offset:') local($event*))
    )

    (func $event_handlers.get_on_visibility_visibile_ptr<>i32   (result i32) (i32.load offset=4 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_handlers.set_on_visibility_visibile_ptr<i32>   (param i32) (i32.store offset=4 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

    (func $event_handlers.get_on_visibility_hidden_ptr<>i32     (result i32) (i32.load offset=8 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_handlers.set_on_visibility_hidden_ptr<i32>     (param i32) (i32.store offset=8 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

    (func $event_handlers.get_event_loop_listener_ptr<>i32      (result i32) (i32.load offset=12 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_handlers.set_event_loop_listener_ptr<i32>      (param i32) (i32.store offset=12 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
