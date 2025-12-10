(module
    (memory 1)
    (export "memory" (memory 0))

    (include "memory_manager.wat")
    (include "event_manager.wat")
    (include "worker_manager.wat")
    (include "chain_manager.wat")

    (global $OFFSET_MEMORY_MANAGER  i32 (i32.const    8))
    (global $OFFSET_EVENT_MANAGER   i32 (i32.const 1024))
    (global $OFFSET_WORKER_MANAGER  i32 (i32.const 2048))
    (global $OFFSET_CHAIN_MANAGER   i32 (i32.const 4096))
    (global $LENGTH_PREALLOC        i32 (i32.const 8192))
    
    (global $OFFSET_MALLOC_LENGTH   i32 i32(4))
    (global $LENGTH_MALLOC_HEADER   i32 i32(8))

    (data (i32.const 5) "\20")

    (start $main
        (call $new_memory_manager)
        (call $new_event_manager)
    )

    (func $malloc
        (param $byteLength i32)
        (result i32)
        (local $bufferSize i32)
        (local $byteOffset i32)
        (local $byteFinish i32)
        (local $maxByteLength i32)
        (local $alignBytes i32)
        (local $offset i32)

        (local.set $offset
            (i32.atomic.rmw.add 
                (global.get $OFFSET_MALLOC_LENGTH) 
                (global.get $LENGTH_MALLOC_HEADER)
            )
        )

        (if (local.tee $alignBytes
                (i32.rem_u
                    (local.get $byteLength)
                    (global.get $ALGIN_BYTELENGTH)
                )
            )
            (then
                (local.set $alignBytes
                    (i32.sub
                        (global.get $ALGIN_BYTELENGTH)
                        (local.get $alignBytes)
                    )
                )
            )
        )

        (local.set $bufferSize
            (i32.add
                (local.get $byteLength)
                (local.get $alignBytes)
            )
        )

        (if (i32.eqz
                (local.tee $byteOffset
                    (call $memory_manager.new_buffer_offset<i32>i32
                        (local.get $bufferSize)
                    )
                )
            )
            (then (unreachable))
        )

        (call $set_byteoffset<i32.i32> (local.get $offset) (local.get $byteOffset))
        (call $set_bytelength<i32.i32> (local.get $offset) (local.get $byteLength))

        (local.get $offset)
    )
    
    (func $set_byteoffset<i32.i32>
        (param $offset i32)
        (param $byteOffset i32)
        (i32.atomic.store offset=0 (local.get $offset) (local.get $byteOffset))
    )

    (func $set_bytelength<i32.i32>
        (param $offset i32)
        (param $byteLength i32)
        (i32.atomic.store offset=4 (local.get $offset) (local.get $byteLength))
    )

    (func $get_buffercopy<i32>ref
        (export "get_buffercopy")
        (param $offset i32)
        (result externref)
        (local $view externref)
        (local $buffer externref)

        (local.set $view
            (new $self.Uint8Array<ref.i32.i32>ref
                (global.get $buffer)
                (call $get_byteoffset<i32>i32 (local.get $offset))
                (call $get_bytelength<i32>i32 (local.get $offset))
            )    
        )

        (local.set $view
            (apply $self.Uint8Array:slice<>ref
                (local.get $view) (param)
            )
        )

        (local.set $buffer
            (apply $self.TypedArray:buffer/get<>ref
                (local.get $view) (param)
            )
        )

        (local.get $buffer)
    )

    (func $get_byteoffset<i32>i32
        (export "get_byteoffset")
        (param $offset i32)
        (result $byteOffset i32)
        (i32.atomic.load offset=0 (local.get $offset))
    )

    (func $get_bytelength<i32>i32
        (export "get_bytelength")
        (param $offset i32)
        (result $byteLength i32)
        (i32.atomic.load offset=4 (local.get $offset))
    )

)   