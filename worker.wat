(module
    (import "self" "index" (global $WORKER_INDEX i32))
    (include "worker_headers.wat")

    (start $main
        (call $new_thread)
        (call $set_start_epoch)    
        (call $init_worker)    
        (warn<ref.i32> text('hi from worker') global($WORKER_OFFSET))    
        (call $event_loop)
    )

    (func $init_worker
        (call $self.Reflect.deleteProperty<ref.ref> self text('onmessage'))
        (call $self.Reflect.deleteProperty<ref.ref> self text('memory'))
        (call $self.Reflect.deleteProperty<ref.ref> self text('index'))
        (call $self.Reflect.deleteProperty<ref.ref> self text('wasm'))
    )

    (func $event_loop
        (loop $events

        )
    )

    (func $set_start_epoch
        (i32.atomic.store offset=4104 (global.get $WORKER_OFFSET) (call $now))
    )

    (func $get_start_epoch (result i32)
        (i32.atomic.load offset=4104 (global.get $WORKER_OFFSET))
    )
)