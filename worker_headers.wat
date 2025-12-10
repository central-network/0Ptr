    (import "self" "memory" (memory $shared 10 65535 shared))

    (global $WORKER_OFFSET mut i32)

    (;  
        ----------------- Memory Layout -----------------
        
        Global coverage for module:
        manager start                   -> offset=4096
        manager end                     -> offset=20480
        allocated                       -> 16384  

        ---------- Mutex Headers (4096 - 5120) ----------
            mutex header is a common header name for
            window (master thread) and worker threads

        window (worker 0) mutex offset  -> offset=4096
        window (worker 0) mutex length  -> 4
        window (worker 0) mutex value   -> 0

        worker 1 mutex offset           -> offset=4100
        worker 1 mutex length           -> 4
        worker 1 mutex value            -> 0

        ...

        worker 254 mutex offset         -> offset=5112
        worker 254 mutex length         -> 4
        worker 254 mutex value          -> 0

        worker 255 mutex offset         -> offset=5116
        worker 255 mutex length         -> 4
        worker 255 mutex value          -> 0
    ;)

    (global $MANAGER_OFFSET_GLOBAL_MUTEX            i32  i32(0))
    (global $MANAGER_OFFSET_WINDOW_MUTEX            i32  i32(4))
    (global $MANAGER_OFFSET_HARDWARE_CONCURRENCY    i32  i32(8))
    (global $MANAGER_OFFSET_MAX_WORKER_COUNT        i32 i32(12))
    (global $MANAGER_OFFSET_CREATING_WORKER_COUNT   i32 i32(16))
    (global $MANAGER_OFFSET_CREATED_WORKER_COUNT    i32 i32(20))
    (global $MANAGER_OFFSET_OPEN_WORKER_COUNT       i32 i32(24))
    (global $MANAGER_OFFSET_STARTED_WORKER_COUNT    i32 i32(28))
    (global $MANAGER_OFFSET_WAITING_WORKER_COUNT    i32 i32(32))
    (global $MANAGER_OFFSET_WORKING_WORKER_COUNT    i32 i32(36))
    (global $MANAGER_OFFSET_CLOSING_WORKER_COUNT    i32 i32(40))
    (global $MANAGER_OFFSET_CLOSED_WORKER_COUNT     i32 i32(44))
    (global $MANAGER_OFFSET_TERMINATED_WORKER_COUNT i32 i32(48))

    (global $WORKER_OFFSET_WORKER_MUTEX             i32  i32(0))
    (global $WORKER_OFFSET_WORKER_INDEX             i32  i32(4))
    (global $WORKER_OFFSET_START_EPOCH              i32  i32(8))
    (global $WORKER_OFFSET_CLOSE_EPOCH              i32 i32(12))

    (global $MEMORY_OFFSET_WORKER_MUTEX           i32 i32(4096))
    (global $MEMORY_OFFSET_WORKER_INDEX           i32 i32(4100))
    (global $MEMORY_OFFSET_START_EPOCH            i32 i32(4104))
    (global $MEMORY_OFFSET_CLOSE_EPOCH            i32 i32(4108))

    (global $BYTES_PER_THREAD i32 i32(64))
    (global $MAX_WORKER_COUNT i32 i32(255))

    (func $new_thread
        (global.set $THREAD_OFFSET
            (i32.mul
                (global.get $WORKER_INDEX)
                (global.get $BYTES_PER_THREAD)
            )
        )

    )

    (func $now (result i32) (call $self.performance.now<>i32))
