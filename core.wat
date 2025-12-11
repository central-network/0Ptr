(module
    (memory 100)

    (include "memory_manager.wat")
    (include "window_listener.wat")
    (include "event_manager.wat")
    (include "queue_chain.wat")
    (include "event_handlers.wat")

    (data (i32.const 4) "\10")

    (global $wasm.memory_manager* mut i32)
    (global $wasm.window_listener* mut i32)
    (global $wasm.event_manager* mut i32)
    (global $wasm.queue_chain* mut i32)

    (start $main
        (global.set $wasm.memory_manager*  (call $new_memory_manager))
        (global.set $wasm.window_listener* (call $new_window_listener))
        (global.set $wasm.event_manager*   (call $new_event_manager))
        (global.set $wasm.queue_chain*     (call $new_queue_chain))

        (call $bind_event_handlers)
    )
)   