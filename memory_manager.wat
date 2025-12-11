 
    (global $memory mut extern)
    (global $buffer mut extern)
 
    (global $ALGIN_BYTELENGTH   i32 i32(16))
    (global $START_BYTEOFFSET   i32 i32(1024))
    (global $INITIAL_PAGESIZE   i32 i32(10))
    (global $MAXIMUM_PAGESIZE   i32 i32(65535))
    (global $MINIMUM_PAGESIZE   i32 i32(1))

    (global $BYTES_PER_KILOBYTE i32 i32(1024))
    (global $BYTES_PER_NEGABYTE i32 i32(1048576))
    (global $BYTES_PER_GIGABYTE i32 i32(1073741824))
    (global $BYTES_PER_PAGE     i32 i32(65536))

    (global $OFFSET_MEMORY_MANAGER  mut i32)
    (global $LENGTH_MEMORY_MANAGER  i32 i32(32))
    
    (global $OFFSET_MALLOC_LENGTH   i32 i32(4))
    (global $LENGTH_MALLOC_HEADER   i32 i32(8))

    (global $self.navigator.deviceMemory i32)

    (func $new_memory_manager
        (result $this* i32)

        (global.set $OFFSET_MEMORY_MANAGER
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_MEMORY_MANAGER)
            )
        )
    
        (call $memory_manager.new_shared_memory<>)        
        
        (call $memory_manager.set_device_memory_bytelength<i32> 
            (i32.mul 
                (global.get $self.navigator.deviceMemory) 
                (global.get $BYTES_PER_GIGABYTE)
            )
        )
        
        (call $memory_manager.set_bytelength<i32> 
            (global.get $START_BYTEOFFSET)
        )

        (call $memory_manager.set_memory_current_pagesize<i32>
            (global.get $INITIAL_PAGESIZE)
        )

        (call $memory_manager.set_memory_maximum_pagesize<i32>
            (global.get $MAXIMUM_PAGESIZE)
        )

        (call $memory_manager.set_buffer_max_bytelength<i32>
            (i32.mul 
                (global.get $INITIAL_PAGESIZE) 
                (global.get $BYTES_PER_PAGE)
            )
        )
        
        (call $memory_manager.set_memory_max_bytelength<i32> 
            (i32.mul 
                (global.get $MAXIMUM_PAGESIZE) 
                (global.get $BYTES_PER_PAGE)
            )
        )

        (if (i32.lt_u
                (call $memory_manager.get_memory_max_bytelength<>i32) 
                (call $memory_manager.get_device_memory_bytelength<>i32) 
            )
            (then
                (call $memory_manager.set_memory_max_bytelength<i32> 
                    (call $memory_manager.get_device_memory_bytelength<>i32) 
                )
            )
        )

        (global.get $OFFSET_MEMORY_MANAGER)
    )

    (func $memory_manager.set_import_memory<>
        (call $self.Reflect.set<ref.ref.ref> 
            self text('memory') global($memory) 
        )
    )

    (func $memory_manager.new_shared_memory<>
        (local $options ref)
        (local.set $options (new $self.Object<>ref))

        (call $self.Reflect.set<ref.ref.i32> local($options) text('initial') (global.get $INITIAL_PAGESIZE))
        (call $self.Reflect.set<ref.ref.i32> local($options) text('maximum') (global.get $MAXIMUM_PAGESIZE))
        (call $self.Reflect.set<ref.ref.i32> local($options) text('shared')  true)


        (global.set $memory (new $self.WebAssembly.Memory<ref>ref local($options)))
        (global.set $buffer (global.get $memory).buffer)

        (call $memory_manager.set_import_memory<>)
    )

    (func $memory_manager.grow_shared_memory<>
        (local $current_pagesize i32)
        (local $exceed_pagesize i32)
        (local $delta i32)

        (local.set $current_pagesize
            (call $memory_manager.get_memory_current_pagesize<>i32)
        )

        (local.set $exceed_pagesize
            (i32.div_u 
                (call $memory_manager.get_bytelength<>i32) 
                (global.get $BYTES_PER_PAGE)
            )
        )

        (local.set $delta
            (if (result i32)
                (i32.le_u 
                    (local.get $exceed_pagesize)
                    (local.get $current_pagesize)
                )
                (then (global.get $MINIMUM_PAGESIZE))
                (else 
                    (i32.sub
                        (local.get $exceed_pagesize)
                        (local.get $current_pagesize)
                    )
                )
            )
        )
        
        (local.set $current_pagesize
            (i32.add
                (apply $self.WebAssembly.Memory:grow<i32>i32
                    (global.get $memory) (param (local.get $delta))
                )
                (local.get $delta)
            )
        )

        (call $memory_manager.set_memory_current_pagesize<i32>
            (local.get $current_pagesize)
        )

        (call $memory_manager.set_buffer_max_bytelength<i32> 
            (i32.mul 
                (local.get $current_pagesize)
                (global.get $BYTES_PER_PAGE)
            )
        )
    )

    (func $memory_manager.boundary_check<>i32
        (result i32)
        (local $byteLength i32)
        (local $maxByteLength i32)
        (local $memoryMaxByteLength i32)

        (local.set $byteLength      (call $memory_manager.get_bytelength<>i32))
        (local.set $maxByteLength   (call $memory_manager.get_buffer_max_bytelength<>i32))

        (if (i32.ge_u
                (local.get $byteLength)
                (local.get $maxByteLength)
            )
            (then
                (local.set $memoryMaxByteLength 
                    (call $memory_manager.get_memory_max_bytelength<>i32)
                )

                (if (i32.ge_u
                        (local.get $byteLength)
                        (local.get $memoryMaxByteLength)
                    )
                    (then (return false))
                    (else (call $memory_manager.grow_shared_memory<>)) 
                )
            )
        )
        
        (return true)
    )

    (func $memory_manager.new_buffer_offset<i32>i32 
        (param $byteLength i32) 
        (result i32) 
        (local $byteOffset i32)

        (local.set $byteOffset
            (call $memory_manager.add_bytelength<i32>i32
                (local.get $byteLength)
            )
        )

        (if (call $memory_manager.boundary_check<>i32)
            (then (return (local.get $byteOffset)))
        )

        (return false)
    )

    (func $memory_manager.add_bytelength<i32>i32            (param i32) (result i32) (i32.atomic.rmw.add offset=0 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
    (func $memory_manager.get_bytelength<>i32               (result i32) (i32.atomic.load offset=0 (global.get $OFFSET_MEMORY_MANAGER)))
    (func $memory_manager.set_bytelength<i32>               (param i32) (i32.atomic.store offset=0 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
    (func $memory_manager.get_buffer_max_bytelength<>i32    (result i32) (i32.atomic.load offset=4 (global.get $OFFSET_MEMORY_MANAGER)))
    (func $memory_manager.set_buffer_max_bytelength<i32>    (param i32) (i32.atomic.store offset=4 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
    (func $memory_manager.get_memory_max_bytelength<>i32    (result i32) (i32.atomic.load offset=8 (global.get $OFFSET_MEMORY_MANAGER)))
    (func $memory_manager.set_memory_max_bytelength<i32>    (param i32) (i32.atomic.store offset=8 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
    (func $memory_manager.get_device_memory_bytelength<>i32 (result i32) (i32.atomic.load offset=12 (global.get $OFFSET_MEMORY_MANAGER)))
    (func $memory_manager.set_device_memory_bytelength<i32> (param i32) (i32.atomic.store offset=12 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
    (func $memory_manager.get_memory_current_pagesize<>i32  (result i32) (i32.atomic.load offset=16 (global.get $OFFSET_MEMORY_MANAGER)))
    (func $memory_manager.set_memory_current_pagesize<i32>  (param i32) (i32.atomic.store offset=16 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
    (func $memory_manager.get_memory_maximum_pagesize<>i32  (result i32) (i32.atomic.load offset=20 (global.get $OFFSET_MEMORY_MANAGER)))
    (func $memory_manager.set_memory_maximum_pagesize<i32>  (param i32) (i32.atomic.store offset=20 (global.get $OFFSET_MEMORY_MANAGER) (local.get 0)))
   
    (func $memory_manager.dump
        (export "dump_memory_manager")
        (local $values externref)
        (local $item externref)

        (local.set $values (call $self.Array<>ref))

        (local.set $item (call $self.Object<>ref))
        (call $self.Reflect.set<ref.ref.i32> local($item) text('byteLength') (call $memory_manager.get_bytelength<>i32))
        (apply $self.Array:push<ref> local($values) (param local($item)))

        (local.set $item (call $self.Object<>ref))
        (call $self.Reflect.set<ref.ref.i32> local($item) text('buffer_max_bytelength') (call $memory_manager.get_buffer_max_bytelength<>i32))
        (apply $self.Array:push<ref> local($values) (param local($item)))

        (local.set $item (call $self.Object<>ref))
        (call $self.Reflect.set<ref.ref.i32> local($item) text('memory_max_bytelength') (call $memory_manager.get_memory_max_bytelength<>i32))
        (apply $self.Array:push<ref> local($values) (param local($item)))

        (local.set $item (call $self.Object<>ref))
        (call $self.Reflect.set<ref.ref.i32> local($item) text('device_memory_bytelength') (call $memory_manager.get_device_memory_bytelength<>i32))
        (apply $self.Array:push<ref> local($values) (param local($item)))

        (local.set $item (call $self.Object<>ref))
        (call $self.Reflect.set<ref.ref.i32> local($item) text('memory_current_pagesize') (call $memory_manager.get_memory_current_pagesize<>i32))
        (apply $self.Array:push<ref> local($values) (param local($item)))

        (local.set $item (call $self.Object<>ref))
        (call $self.Reflect.set<ref.ref.i32> local($item) text('memory_maximum_pagesize') (call $memory_manager.get_memory_maximum_pagesize<>i32))
        (apply $self.Array:push<ref> local($values) (param local($item)))

        (call $self.console.log<ref>
            (local.get $values)
        )
    )

    (func $memory_manager.malloc_internal<i32>i32
        (param $byteLength i32)
        (result i32)
        (i32.atomic.rmw.add (global.get $OFFSET_MALLOC_LENGTH) (local.get $byteLength))
    )

    (func $memory_manager.malloc_external<i32>i32
        (param $byteLength i32)
        (result i32)
        (local $bufferSize i32)
        (local $byteOffset i32)
        (local $byteFinish i32)
        (local $maxByteLength i32)
        (local $alignBytes i32)
        (local $offset i32)

        (local.set $offset
            (call $memory_manager.malloc_internal<i32>i32
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