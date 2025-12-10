
    (global $LENGTH_CHAIN_MANAGER i32 i32(64))
    (global $LENGTH_CHAIN_HEADERS i32 i32(64))

    (func $chain_manager.new<>i32
        (result $byteOffset i32)
        (call $malloc (global.get $LENGTH_CHAIN_MANAGER))
    )