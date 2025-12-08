(module
    (import "self" "memory" (memory 1 65535 shared))

    (global $worker_index mut i32)

    (start $main
        (global.set $worker_index (i32.atomic.rmw.add i32(44) i32(1)))

        (warn<ref.i32> text('hi from worker') global($worker_index))    
    )

    (func $notify_window
    
    )
)