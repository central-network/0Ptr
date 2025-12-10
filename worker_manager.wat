
    (global $LENGTH_WORKER_MANAGER i32 i32(64))
    (global $LENGTH_WORKER_HEADERS i32 i32(64))

    (func $worker_manager.new<>i32
        (result $byteOffset i32)
        (call $malloc (global.get $LENGTH_WORKER_MANAGER))
    )