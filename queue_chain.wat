    
    (global $OFFSET_QUEUE_CHAIN         mut i32)
    (global $LENGTH_QUEUE_CHAIN         i32 i32(64))

    (global $OFFSET_QUEUE_TASKS         mut i32)
    (global $BYTES_PER_QUEUE_TASK       i32 i32(64))
    (global $MAX_QUEUE_TASK_COUNT       i32 i32(64))

    (func $new_queue_chain
        (result $queue_chain* i32)
        
        (global.set $OFFSET_QUEUE_CHAIN
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_QUEUE_CHAIN)
            )
        )

        (global.set $OFFSET_QUEUE_TASKS
            (call $memory_manager.malloc_internal<i32>i32 
                (i32.mul
                    (global.get $BYTES_PER_QUEUE_TASK)
                    (global.get $MAX_QUEUE_TASK_COUNT)
                )
            )
        )

        (global.get $OFFSET_QUEUE_CHAIN)
    )

    (func $queue_chain.on_next_second<>
    
    )

    (func $queue_chain.get_next_chain_listener_ptr<>i32 (result i32) (i32.load offset=4 (global.get $OFFSET_QUEUE_CHAIN)))
    (func $queue_chain.set_next_chain_listener_ptr<i32> (param i32) (i32.store offset=4 (global.get $OFFSET_QUEUE_CHAIN) (local.get 0)))
