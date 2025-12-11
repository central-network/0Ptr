(module
    
    (import "self" "Array"              (func $wat4wasm/Array<>ref (param) (result externref)))
    (import "Reflect" "set"             (func $wat4wasm/Reflect.set<ref.i32x2> (param externref i32 i32) (result)))
    (import "Reflect" "getOwnPropertyDescriptor" (func $wat4wasm/Reflect.getOwnPropertyDescriptor<refx2>ref (param externref externref) (result externref)))
    (import "Reflect" "construct"       (func $wat4wasm/Reflect.construct<refx2>ref (param externref externref) (result externref)))
    (import "Reflect" "get"             (func $wat4wasm/Reflect.get<refx2>ref (param externref externref) (result externref)))
    (import "Reflect" "get"             (func $wat4wasm/Reflect.get<refx2>i32 (param externref externref) (result i32)))
    (import "Reflect" "get"             (func $wat4wasm/Reflect.get<refx2>f32 (param externref externref) (result f32)))
    (import "Reflect" "get"             (func $wat4wasm/Reflect.get<refx2>i64 (param externref externref) (result i64)))
    (import "Reflect" "get"             (func $wat4wasm/Reflect.get<refx2>f64 (param externref externref) (result f64)))
    (import "Reflect" "apply"           (func $wat4wasm/Reflect.apply<refx3>ref (param externref externref externref) (result externref)))
    (import "self" "self"               (global $wat4wasm/self externref))
    (import "String" "fromCharCode"     (global $wat4wasm/String.fromCharCode externref))
   
	(import "Reflect" "set" (func $self.Reflect.set<ref.ref.ref> (param externref externref externref)))
	(import "Reflect" "construct" (func $self.Reflect.construct<refx2>ref (param externref externref) (result externref)))
	(import "Array" "of" (func $self.Array.of<>ref  (result externref)))
	(import "Reflect" "set" (func $self.Reflect.set<ref.ref.i32> (param externref externref i32)))
	(import "Array" "of" (func $self.Array.of<ref>ref (param externref) (result externref)))
	(import "Reflect" "get" (func $self.Reflect.get<refx2>ref (param externref externref) (result externref)))
	(import "Reflect" "apply" (func $self.Reflect.apply<refx3>i32 (param externref externref externref) (result i32)))
	(import "Array" "of" (func $self.Array.of<i32>ref (param i32) (result externref)))
	(import "Reflect" "apply" (func $self.Reflect.apply<refx3>ref (param externref externref externref) (result externref)))
	(import "Reflect" "apply" (func $self.Reflect.apply<refx3> (param externref externref externref)))
	(import "console" "log" (func $self.console.log<ref> (param externref)))
	(import "Array" "of" (func $self.Array.of<ref.i32.i32>ref (param externref i32 i32) (result externref)))
	(import "console" "warn" (func $self.console.warn<ref.i32> (param externref i32)))
	(import "Array" "of" (func $self.Array.of<ref.fun>ref (param externref funcref) (result externref)))
	(import "console" "warn" (func $self.console.warn<ref> (param externref)))
	(import "self" "cancelAnimationFrame" (func $self.cancelAnimationFrame<i32> (param i32)))
	(import "self" "cancelIdleCallback" (func $self.cancelIdleCallback<i32> (param i32)))
	(import "self" "requestIdleCallback" (func $self.requestIdleCallback<fun>i32 (param funcref) (result i32)))
	(import "self" "requestAnimationFrame" (func $self.requestAnimationFrame<fun>i32 (param funcref) (result i32)))
	(import "console" "warn" (func $self.console.warn<ref.ref.i32.ref.i32.ref.i32.ref.i32> (param externref externref i32 externref i32 externref i32 externref i32)))
	 

    
    (memory 1)
    (export "memory" (memory 0))

    
	(; externref  ;)
	(global $memory (mut externref) ref.null extern)
    (global $buffer (mut externref) ref.null extern)
 
    (global $ALGIN_BYTELENGTH   i32 (i32.const 16))
    (global $START_BYTEOFFSET   i32 (i32.const 1024))
    (global $INITIAL_PAGESIZE   i32 (i32.const 10))
    (global $MAXIMUM_PAGESIZE   i32 (i32.const 65535))
    (global $MINIMUM_PAGESIZE   i32 (i32.const 1))

    (global $BYTES_PER_KILOBYTE i32 (i32.const 1024))
    (global $BYTES_PER_NEGABYTE i32 (i32.const 1048576))
    (global $BYTES_PER_GIGABYTE i32 (i32.const 1073741824))
    (global $BYTES_PER_PAGE     i32 (i32.const 65536))

    (global $OFFSET_MEMORY_MANAGER  (mut i32) (i32.const 0))
    (global $LENGTH_MEMORY_MANAGER  i32 (i32.const 32))
    
    (global $OFFSET_MALLOC_LENGTH   i32 (i32.const 4))
    (global $LENGTH_MALLOC_HEADER   i32 (i32.const 8))

    (global $self.navigator.deviceMemory (mut i32) (i32.const 0))

    (func $new_memory_manager
        (result i32)

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
            (global.get $wat4wasm/self) (table.get $extern (i32.const 1)) (global.get $memory) 
        )
    )

    (func $memory_manager.new_shared_memory<>
        (local $options externref)
        (local.set $options (call $self.Reflect.construct<refx2>ref 
            (global.get $self.Object)  (call $self.Array.of<>ref)))

        (call $self.Reflect.set<ref.ref.i32> (local.get $options) (table.get $extern (i32.const 2)) (global.get $INITIAL_PAGESIZE))
        (call $self.Reflect.set<ref.ref.i32> (local.get $options) (table.get $extern (i32.const 3)) (global.get $MAXIMUM_PAGESIZE))
        (call $self.Reflect.set<ref.ref.i32> (local.get $options) (table.get $extern (i32.const 4))  (i32.const 1))


        (global.set $memory (call $self.Reflect.construct<refx2>ref 
            (global.get $self.WebAssembly.Memory) 
            (call $self.Array.of<ref>ref  (local.get $options))))
        (global.set $buffer (global.get $memory) (table.get $extern (i32.const 5)) (call $self.Reflect.get<refx2>ref) )

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
                (call $self.Reflect.apply<refx3>i32 
            (global.get $self.WebAssembly.Memory:grow)
                    (global.get $memory) (call $self.Array.of<i32>ref (local.get $delta))
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
                    (then (return (i32.const 0)))
                    (else (call $memory_manager.grow_shared_memory<>)) 
                )
            )
        )
        
        (return (i32.const 1))
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

        (return (i32.const 0))
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

        (local.set $values (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Array) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))

        (local.set $item (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Object) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))
        (call $self.Reflect.set<ref.ref.i32> (local.get $item) (table.get $extern (i32.const 6)) (call $memory_manager.get_bytelength<>i32))
        (call $self.Reflect.apply<refx3> 
            (global.get $self.Array:push) (local.get $values) (call $self.Array.of<ref>ref (local.get $item)))

        (local.set $item (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Object) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))
        (call $self.Reflect.set<ref.ref.i32> (local.get $item) (table.get $extern (i32.const 7)) (call $memory_manager.get_buffer_max_bytelength<>i32))
        (call $self.Reflect.apply<refx3> 
            (global.get $self.Array:push) (local.get $values) (call $self.Array.of<ref>ref (local.get $item)))

        (local.set $item (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Object) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))
        (call $self.Reflect.set<ref.ref.i32> (local.get $item) (table.get $extern (i32.const 8)) (call $memory_manager.get_memory_max_bytelength<>i32))
        (call $self.Reflect.apply<refx3> 
            (global.get $self.Array:push) (local.get $values) (call $self.Array.of<ref>ref (local.get $item)))

        (local.set $item (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Object) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))
        (call $self.Reflect.set<ref.ref.i32> (local.get $item) (table.get $extern (i32.const 9)) (call $memory_manager.get_device_memory_bytelength<>i32))
        (call $self.Reflect.apply<refx3> 
            (global.get $self.Array:push) (local.get $values) (call $self.Array.of<ref>ref (local.get $item)))

        (local.set $item (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Object) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))
        (call $self.Reflect.set<ref.ref.i32> (local.get $item) (table.get $extern (i32.const 10)) (call $memory_manager.get_memory_current_pagesize<>i32))
        (call $self.Reflect.apply<refx3> 
            (global.get $self.Array:push) (local.get $values) (call $self.Array.of<ref>ref (local.get $item)))

        (local.set $item (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Object) (global.get $wat4wasm/self) (call $self.Array.of<>ref)))
        (call $self.Reflect.set<ref.ref.i32> (local.get $item) (table.get $extern (i32.const 11)) (call $memory_manager.get_memory_maximum_pagesize<>i32))
        (call $self.Reflect.apply<refx3> 
            (global.get $self.Array:push) (local.get $values) (call $self.Array.of<ref>ref (local.get $item)))

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
            (call $self.Reflect.construct<refx2>ref 
            (global.get $self.Uint8Array) 
            (call $self.Array.of<ref.i32.i32>ref 
                (global.get $buffer)
                (call $get_byteoffset<i32>i32 (local.get $offset))
                (call $get_bytelength<i32>i32 (local.get $offset))
            ))    
        )

        (local.set $view
            (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Uint8Array:slice)
                (local.get $view) (call $self.Array.of<>ref)
            )
        )

        (local.set $buffer
            (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Uint8Array.__proto__.prototype.buffer/get)
                (local.get $view) (call $self.Array.of<>ref)
            )
        )

        (local.get $buffer)
    )

    (func $get_byteoffset<i32>i32
        (export "get_byteoffset")
        (param $offset i32)
        (result i32)
        (i32.atomic.load offset=0 (local.get $offset))
    )

    (func $get_bytelength<i32>i32
        (export "get_bytelength")
        (param $offset i32)
        (result i32)
        (i32.atomic.load offset=4 (local.get $offset))
    )
    
	(; externref  ;)
	(global $OFFSET_EVENT_MANAGER (mut i32) (i32.const 0))
    (global $LENGTH_EVENT_MANAGER i32 (i32.const 16))

    (global $LENGTH_EVENT_HEADERS i32 (i32.const 32))

    (global $event_manager.window_for_each_tick_handler (mut i32) (i32.const 0))
    (global $event_manager.window_for_each_frame_handler (mut i32) (i32.const 0))
    (global $event_manager.window_for_each_second_handler (mut i32) (i32.const 0))

    (func $new_event_manager
        (result i32)
        
        (global.set $OFFSET_EVENT_MANAGER
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_EVENT_MANAGER)
            )
        )

        (global.set $event_manager.window_for_each_tick_handler
            (call $window_listener.add_listener_for_each_tick<fun>i32
                (ref.func $event_manager.hanlde_for_each_tick<>)
            )
        )

        (global.set $event_manager.window_for_each_frame_handler
            (call $window_listener.add_listener_for_each_frame<fun>i32
                (ref.func $event_manager.hanlde_for_each_frame<>)
            )
        )

        (global.set $event_manager.window_for_each_second_handler
            (call $window_listener.add_listener_for_each_second<fun>i32
                (ref.func $event_manager.hanlde_for_each_second<>)
            )
        )

        (global.get $OFFSET_EVENT_MANAGER)
    )

    (func $event_manager.hanlde_for_each_tick<>
    )

    (func $event_manager.hanlde_for_each_frame<>
    )

    (func $event_manager.hanlde_for_each_second<>
    )

    (func $event_manager.dispatch<i32>
        (param $event_type i32)

        (call $self.console.warn<ref.i32>
            (table.get $extern (i32.const 12))
            (local.get $event_type)
        )
    )
    
	(; externref  ;)
	(global $OFFSET_WINDOW_LISTENER (mut i32) (i32.const 0))
    (global $LENGTH_WINDOW_LISTENER i32 (i32.const 64))


    (global $self.window (mut externref) ref.null extern)
    (global $self.document (mut externref) ref.null extern)
    (global $self.navigator.wakeLock (mut externref) ref.null extern)
    (global $self.navigator.userActivation (mut externref) ref.null extern)

    (global $self.WakeLock (mut externref) ref.null extern)
    (global $self.WakeLockSentinel (mut externref) ref.null extern)
    (global $self.UserActivation (mut externref) ref.null extern)

    (global $VISIBILITY_STATE_HIDDEN     i32 (i32.const 104))
    (global $VISIBILITY_STATE_VISIBLE    i32 (i32.const 118))
    (global $VISIBILITY_STATE_PRERENDER  i32 (i32.const 112))

    (global $FOCUS_STATE_BLURRED         i32 (i32.const 0))
    (global $FOCUS_STATE_FOCUSED         i32 (i32.const 1))
    (global $FOCUS_STATE_PREACTIVE       i32 (i32.const 2))
    (global $PAGE_EVENT_HIDE             i32 (i32.const 0))
    (global $PAGE_EVENT_SHOW             i32 (i32.const 1))
    (global $PAGE_EVENT_REVEAL           i32 (i32.const 2))
    (global $PAGE_EVENT_SWAP             i32 (i32.const 3))
    (global $PAGE_STATE_HIDED            i32 (i32.const 0))
    (global $PAGE_STATE_SHOWN            i32 (i32.const 1))
    (global $UNLOAD_STATE_WAITING        i32 (i32.const 1))
    (global $UNLOAD_STATE_CLOSED         i32 (i32.const 2))
    (global $UNLOAD_STATE_BEFORE         i32 (i32.const 3))

    (global $CYCLE_TYPE_NEXT_TICK        i32 (i32.const 1))
    (global $CYCLE_TYPE_RENDERING        i32 (i32.const 2))
    (global $CYCLE_RESET_TRESHOLD      i32 (i32.const 600))

    (table $window_listener.listeners_for_each_cycle<fun>   1 65535 funcref)
    (table $window_listener.listeners_for_each_tick<fun>    1 65535 funcref)
    (table $window_listener.listeners_for_each_frame<fun>   1 65535 funcref)
    (table $window_listener.listeners_for_each_second<fun>  1 65535 funcref)
    (table $window_listener.listeners_for_each_tensec<fun>  1 65535 funcref)
    (table $window_listener.listeners_for_each_minute<fun>  1 65535 funcref)

    (global $window_listener.second_counter (mut i32) (i32.const 0))

    (func $new_window_listener
        (result i32)

        (global.set $OFFSET_WINDOW_LISTENER
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_WINDOW_LISTENER)
            )
        )

        (call $window_listener.listen_closing_events<>)
        (call $window_listener.listen_visibility_change<>)
        (call $window_listener.listen_focus_events<>)
        (call $window_listener.listen_page_state_changes<>)
        (call $window_listener.listen_pointer_condition<>)

        (global.get $OFFSET_WINDOW_LISTENER)
    )

    (func $window_listener.add_listener_for_each_cycle<fun>i32
        (param $handler funcref)
        (result i32)
        (table.grow $window_listener.listeners_for_each_cycle<fun>
            (local.get 0) (i32.const 1)
        )
    )

    (func $window_listener.add_listener_for_each_tick<fun>i32
        (param $handler funcref)
        (result i32)
        (table.grow $window_listener.listeners_for_each_tick<fun>
            (local.get 0) (i32.const 1)
        )
    )

    (func $window_listener.add_listener_for_each_frame<fun>i32
        (param $handler funcref)
        (result i32)
        (table.grow $window_listener.listeners_for_each_frame<fun>
            (local.get 0) (i32.const 1)
        )
    )

    (func $window_listener.add_listener_for_each_second<fun>i32
        (param $handler funcref)
        (result i32)
        (table.grow $window_listener.listeners_for_each_second<fun>
            (local.get 0) (i32.const 1)
        )
    )

    (func $window_listener.add_listener_for_each_tensec<fun>i32
        (param $handler funcref)
        (result i32)
        (table.grow $window_listener.listeners_for_each_tensec<fun>
            (local.get 0) (i32.const 1)
        )
    )

    (func $window_listener.add_listener_for_each_minute<fun>i32
        (param $handler funcref)
        (result i32)
        (table.grow $window_listener.listeners_for_each_minute<fun>
            (local.get 0) (i32.const 1)
        )
    )

    (func $window_listener.listen_pointer_condition<>
        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window)
            (call $self.Array.of<ref.fun>ref 
                (table.get $extern (i32.const 13)) 
                (ref.func $window_listener.handle_pointer_over<>)
            )
        )
    )

    (func $window_listener.handle_pointer_out<>
        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:removeEventListener) 
            (global.get $self.window)
            (call $self.Array.of<ref.fun>ref 
                (table.get $extern (i32.const 14)) 
                (ref.func $window_listener.handle_pointer_out<>)
            )
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window)
            (call $self.Array.of<ref.fun>ref 
                (table.get $extern (i32.const 13)) 
                (ref.func $window_listener.handle_pointer_over<>)
            )
        )

        (call $self.console.log<ref> (table.get $extern (i32.const 15)))
    )

    (func $window_listener.handle_pointer_over<>
        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:removeEventListener) 
            (global.get $self.window)
            (call $self.Array.of<ref.fun>ref 
                (table.get $extern (i32.const 13)) 
                (ref.func $window_listener.handle_pointer_over<>)
            )
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window)
            (call $self.Array.of<ref.fun>ref 
                (table.get $extern (i32.const 14)) 
                (ref.func $window_listener.handle_pointer_out<>)
            )
        )

        (call $self.console.log<ref> (table.get $extern (i32.const 16)))
    )



    (; works like a charm, dispatches at keystones ;)
    (func $window_listener.listen_visibility_change<>
        (call $window_listener.handle_visibility_change<>)

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.document) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 17)) (ref.func $window_listener.handle_visibility_change<>))
        )
    )    

    (func $window_listener.handle_visibility_change<>
        (local $visibilityState<ref> externref)
        (local $visibilityState<i32> i32)

        (local.set $visibilityState<ref>
            ;; visbility state is a property of document
            (call $self.Reflect.apply<refx3>ref 
            (global.get $self.Document:visibilityState/get)
                (global.get $self.document) (call $self.Array.of<>ref)
            )
        )

        (local.set $visibilityState<i32>
            ;; first ansi code of char is our type code
            (call $self.Reflect.apply<refx3>i32 
            (global.get $self.String:charCodeAt)
                (local.get $visibilityState<ref>) (call $self.Array.of<>ref)
            )
        )
        
        (global.get $VISIBILITY_STATE_VISIBLE)
        (if (i32.eq (local.get $visibilityState<i32>))
            (then (call $window_listener.handle_visibility_visible<>) return)
        )

        (global.get $VISIBILITY_STATE_HIDDEN)
        (if (i32.eq (local.get $visibilityState<i32>))
            (then (call $window_listener.handle_visibility_hidden<>) return)
        )

        (global.get $VISIBILITY_STATE_PRERENDER)
        (if (i32.eq (local.get $visibilityState<i32>))
            (then (call $window_listener.handle_visibility_prerender<>) return)
        )
    )

    (func $window_listener.handle_visibility_visible<>
        (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_VISIBLE))
        (call $window_listener.set_visibility_state_visible<>)
        (call $window_listener.handle_cycle_type_rendering<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 18)))
    )

    (func $window_listener.handle_visibility_hidden<>
        (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_HIDDEN))
        (call $window_listener.set_visibility_state_hidden<>)
        (call $window_listener.handle_cycle_type_next_tick<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 19)))
    )

    (func $window_listener.handle_visibility_prerender<>
        (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_PRERENDER))
        (call $window_listener.set_visibility_state_prerender<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 20)))
    )


    (func $window_listener.new_visibility_state<i32>          (param i32) (i32.store  offset=0 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_visibility_state<i32>          (param i32) (i32.store8 offset=0 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_visibility_is_hidden<i32>      (param i32) (i32.store8 offset=1 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_visibility_is_visible<i32>     (param i32) (i32.store8 offset=2 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_visibility_is_prerender<i32>   (param i32) (i32.store8 offset=3 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.get_visibility_state<>i32          (result i32) (i32.load8_u offset=0 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_visibility_is_hidden<>i32      (result i32) (i32.load8_u offset=1 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_visibility_is_visible<>i32     (result i32) (i32.load8_u offset=2 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_visibility_is_prerender<>i32   (result i32) (i32.load8_u offset=3 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.set_visibility_state_hidden<>      (i32.store8 offset=1 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_visibility_state_visible<>     (i32.store8 offset=2 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_visibility_state_prerender<>   (i32.store8 offset=3 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))


    (; dispatches when only page has at least one click ;)
    (func $window_listener.listen_focus_events<>
        (if (call $self.Reflect.apply<refx3>i32 
            (global.get $self.Document:hasFocus)
                (global.get $self.document) (call $self.Array.of<>ref)
            )
            (then (call $window_listener.handle_focus_focused<>))
            (else (call $window_listener.handle_focus_preactive<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 21)) (ref.func $window_listener.handle_focus_focused<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 22)) (ref.func $window_listener.handle_focus_blurred<>))
        )
    )

    (func $window_listener.handle_focus_blurred<>
        (call $window_listener.new_focus_state<i32> (global.get $FOCUS_STATE_BLURRED))
        (call $window_listener.set_focus_state_blurred<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 23)))
    )

    (func $window_listener.handle_focus_focused<>
        (call $window_listener.new_focus_state<i32> (global.get $FOCUS_STATE_FOCUSED))
        (call $window_listener.set_focus_state_focused<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 24)))
    )

    (func $window_listener.handle_focus_preactive<>
        (call $window_listener.new_focus_state<i32> (global.get $FOCUS_STATE_PREACTIVE))
        (call $window_listener.set_focus_state_preactive<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 25)))
    )

    (func $window_listener.new_focus_state<i32>               (param i32) (i32.store  offset=4 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_focus_state<i32>               (param i32) (i32.store8 offset=4 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_focus_is_focused<i32>          (param i32) (i32.store8 offset=5 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_focus_is_blurred<i32>          (param i32) (i32.store8 offset=6 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_focus_is_preactive<i32>        (param i32) (i32.store8 offset=7 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.get_focus_state<>i32               (result i32) (i32.load8_u offset=4 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_focus_is_focused<>i32          (result i32) (i32.load8_u offset=5 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_focus_is_blurred<>i32          (result i32) (i32.load8_u offset=6 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_focus_is_preactive<>i32        (result i32) (i32.load8_u offset=7 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.set_focus_state_focused<>          (i32.store8 offset=5 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_focus_state_blurred<>          (i32.store8 offset=6 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_focus_state_preactive<>        (i32.store8 offset=7 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))



    (; dispatches when only navigation changes ;)
    (func $window_listener.listen_page_state_changes<>
        (if (call $self.Reflect.apply<refx3>i32 
            (global.get $self.Document:hidden/get)
                (global.get $self.document) (call $self.Array.of<>ref)
            )
            (then (call $window_listener.handle_page_hide<>))
            (else (call $window_listener.handle_page_show<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 26)) (ref.func $window_listener.handle_page_show<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 27)) (ref.func $window_listener.handle_page_hide<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 28)) (ref.func $window_listener.handle_page_swap<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 29)) (ref.func $window_listener.handle_page_reveal<>))
        )
    )

    (func $window_listener.handle_page_state_change<>
        (if (call $self.Reflect.apply<refx3>i32 
            (global.get $self.Document:hidden/get)
                (global.get $self.document) (call $self.Array.of<>ref)
            )
            (then 
                (if (call $window_listener.get_page_is_shown<>i32)
                    (then (call $window_listener.set_page_state_hided<>))
                )
            )
            (else 
                (if (call $window_listener.get_page_is_hided<>i32)
                    (then (call $window_listener.set_page_state_shown<>))
                )
            )
        )
    )

    (func $window_listener.handle_page_show<>
        (call $window_listener.new_page_state<i32> (global.get $PAGE_STATE_SHOWN))
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_SHOW))
        (call $window_listener.set_page_state_shown<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 30)))
    )

    (func $window_listener.handle_page_hide<>
        (call $window_listener.new_page_state<i32> (global.get $PAGE_STATE_HIDED))
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_HIDE))
        (call $window_listener.set_page_state_hided<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 31)))
    )

    (func $window_listener.handle_page_swap<>
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_SWAP))
        (call $window_listener.handle_page_state_change<>)
        (call $self.console.warn<ref> (table.get $extern (i32.const 32)))
    )

    (func $window_listener.handle_page_reveal<>
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_REVEAL))
        (call $window_listener.handle_page_state_change<>)
        (call $self.console.warn<ref> (table.get $extern (i32.const 33)))
    )

    (func $window_listener.new_page_state<i32>                (param i32) (i32.store  offset=8  (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_page_state<i32>                (param i32) (i32.store8 offset=8  (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_page_is_hided<i32>             (param i32) (i32.store8 offset=9  (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_page_is_shown<i32>             (param i32) (i32.store8 offset=10 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_page_state_event<i32>          (param i32) (i32.store8 offset=11 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.get_page_state<>i32                (result i32) (i32.load8_u offset=8  (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_page_is_hided<>i32             (result i32) (i32.load8_u offset=9  (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_page_is_shown<>i32             (result i32) (i32.load8_u offset=10 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_page_state_event<>i32          (result i32) (i32.load8_u offset=11 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.set_page_state_hided<>             (i32.store8 offset=9  (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_page_state_shown<>             (i32.store8 offset=10 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))



    (func $window_listener.listen_closing_events<>
        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 34)) (ref.func $window_listener.handle_unload_before<>))
        )

        (call $self.Reflect.apply<refx3> 
            (global.get $self.EventTarget:addEventListener) 
            (global.get $self.window) 
            (call $self.Array.of<ref.fun>ref (table.get $extern (i32.const 35)) (ref.func $window_listener.handle_unload_closed<>))
        )

        (call $window_listener.handle_unload_waiting<>)
    )

    (func $window_listener.handle_unload_waiting<>
        (call $window_listener.new_unload_state<i32> (global.get $UNLOAD_STATE_WAITING))
        (call $window_listener.set_unload_state_waiting<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 36)))
    )

    (func $window_listener.handle_unload_before<>
        (call $window_listener.new_unload_state<i32> (global.get $UNLOAD_STATE_BEFORE))
        (call $window_listener.set_unload_state_before<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 37)))
    )

    (func $window_listener.handle_unload_closed<>
        (call $window_listener.new_unload_state<i32> (global.get $UNLOAD_STATE_CLOSED))
        (call $window_listener.set_unload_state_closed<>)
        (call $self.console.log<ref> (table.get $extern (i32.const 38)))
    )

    (func $window_listener.new_unload_state<i32>              (param i32) (i32.store  offset=12 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_unload_state<i32>              (param i32) (i32.store8 offset=12 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_unload_is_before<i32>          (param i32) (i32.store8 offset=13 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_unload_is_closed<i32>          (param i32) (i32.store8 offset=14 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_unload_is_waiting<i32>         (param i32) (i32.store8 offset=15 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.get_unload_state<>i32              (result i32) (i32.load8_u offset=12 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_unload_is_before<>i32          (result i32) (i32.load8_u offset=13 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_unload_is_closed<>i32          (result i32) (i32.load8_u offset=14 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_unload_is_waiting<>i32         (result i32) (i32.load8_u offset=15 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.set_unload_state_before<>          (i32.store8 offset=13 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_unload_state_closed<>          (i32.store8 offset=14 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_unload_state_waiting<>         (i32.store8 offset=15 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))


    (func $window_listener.call_listeners_for_each_cycle<>
        (local $index i32)
        
        (local.set $index 
            (table.size $window_listener.listeners_for_each_cycle<fun>)
        )

        (loop $for_each_handler
            (if (local.tee $index (i32.sub (local.get $index) (i32.const 1)))
                (then
                    (call_indirect $window_listener.listeners_for_each_cycle<fun> 
                        (local.get $index)
                    )
                    (br $for_each_handler)
                )
            )        
        )
    )

    (func $window_listener.call_listeners_for_each_tick<>
        (local $index i32)
        
        (local.set $index 
            (table.size $window_listener.listeners_for_each_tick<fun>)
        )

        (loop $for_each_handler
            (if (local.tee $index (i32.sub (local.get $index) (i32.const 1)))
                (then
                    (call_indirect $window_listener.listeners_for_each_tick<fun> 
                        (local.get $index)
                    )
                    (br $for_each_handler)
                )
            )        
        )
    )

    (func $window_listener.call_listeners_for_each_frame<>
        (local $index i32)
        
        (local.set $index 
            (table.size $window_listener.listeners_for_each_frame<fun>)
        )

        (loop $for_each_handler
            (if (local.tee $index (i32.sub (local.get $index) (i32.const 1)))
                (then
                    (call_indirect $window_listener.listeners_for_each_frame<fun> 
                        (local.get $index)
                    )
                    (br $for_each_handler)
                )
            )        
        )
    )

    (func $window_listener.call_listeners_for_each_second<>
        (local $index i32)
        
        (local.set $index 
            (table.size $window_listener.listeners_for_each_second<fun>)
        )

        (loop $for_each_handler
            (if (local.tee $index (i32.sub (local.get $index) (i32.const 1)))
                (then
                    (call_indirect $window_listener.listeners_for_each_second<fun> 
                        (local.get $index)
                    )
                    (br $for_each_handler)
                )
            )        
        )

        (global.set $window_listener.second_counter
            (i32.add
                (global.get $window_listener.second_counter)
                (i32.const 1)
            )
        )

        (if (i32.eqz 
                (i32.rem_u  
                    (global.get $window_listener.second_counter) 
                    (i32.const 10)
                )
            )
            (then
                (call $window_listener.call_listeners_for_each_tensec<>)

                (if (i32.eq 
                        (global.get $window_listener.second_counter) 
                        (i32.const 60)
                    )
                    (then
                        (call $window_listener.call_listeners_for_each_minute<>)
                        (global.set $window_listener.second_counter 
                            (i32.const 0)
                        )
                    )
                )
            )
        )
    )

    (func $window_listener.call_listeners_for_each_tensec<>
        (local $index i32)
        
        (local.set $index 
            (table.size $window_listener.listeners_for_each_tensec<fun>)
        )

        (loop $for_each_handler
            (if (local.tee $index (i32.sub (local.get $index) (i32.const 1)))
                (then
                    (call_indirect $window_listener.listeners_for_each_tensec<fun> 
                        (local.get $index)
                    )
                    (br $for_each_handler)
                )
            )        
        )
    )

    (func $window_listener.call_listeners_for_each_minute<>
        (local $index i32)
        
        (local.set $index 
            (table.size $window_listener.listeners_for_each_tensec<fun>)
        )

        (loop $for_each_handler
            (if (local.tee $index (i32.sub (local.get $index) (i32.const 1)))
                (then
                    (call_indirect $window_listener.listeners_for_each_tensec<fun> 
                        (local.get $index)
                    )
                    (br $for_each_handler)
                )
            )        
        )
    )

    (func $window_listener.handle_cycle<i32>
        (param $cycle_type i32)
        (local $count i32)
        (local $epoch_now i32)
        (local $last_epoch i32)
        (local $elapsed_time i32)

        (local.set $epoch_now (call $self.Reflect.apply<refx3>i32 
            (global.get $self.performance.now) (global.get $self.performance) (call $self.Array.of<>ref)))
        (local.set $last_epoch (call $window_listener.get_cycle_last_epoch<>i32))
        (local.set $elapsed_time (i32.sub (local.get $epoch_now) (local.get $last_epoch)))

        (if (i32.ge_u (local.get $elapsed_time) (i32.const 1000))
            (then                
                (call $window_listener.set_cycle_cps<i32>
                    (call $window_listener.get_cycle_count<>i32)
                )

                (call $window_listener.call_listeners_for_each_second<>)
                (call $window_listener.set_cycle_count<i32> (i32.const 0))
                (call $window_listener.set_cycle_last_epoch<i32> (local.get $epoch_now))
            )
        )

        (call $window_listener.call_listeners_for_each_cycle<>)

        (global.get $CYCLE_TYPE_RENDERING)
        (if (i32.eq (local.get $cycle_type))
            (then (call $window_listener.call_listeners_for_each_frame<>) return)
        )

        (global.get $CYCLE_TYPE_NEXT_TICK)
        (if (i32.eq (local.get $cycle_type))
            (then (call $window_listener.call_listeners_for_each_tick<>) return)
        )
    )

    (func $window_listener.cancel_rendering_cycle<>
        (call $self.cancelAnimationFrame<i32>
            (call $window_listener.get_cycle_last_rendering_id<>i32)
        )
    )

    (func $window_listener.cancel_next_tick_cycle<>
        (call $self.cancelIdleCallback<i32>
            (call $window_listener.get_cycle_last_next_tick_id<>i32)
        )
    )

    (func $window_listener.listen_next_tick_cycle<ref>
        (param $idle externref)

        (call $window_listener.add_next_tick_cycle<>)
        (call $window_listener.set_cycle_last_next_tick_id<i32>
            (call $self.requestIdleCallback<fun>i32
                (ref.func $window_listener.listen_next_tick_cycle<ref>)
            )
        )

        (call $window_listener.handle_cycle<i32>
            (global.get $CYCLE_TYPE_NEXT_TICK)
        )
    )

    (func $window_listener.listen_rendering_cycle<i32>
        (param $pnow i32)
        
        (call $window_listener.add_rendering_cycle<>)
        (call $window_listener.set_cycle_last_rendering_id<i32>
            (call $self.requestAnimationFrame<fun>i32
                (ref.func $window_listener.listen_rendering_cycle<i32>)
            )
        )

        (call $window_listener.handle_cycle<i32>
            (global.get $CYCLE_TYPE_RENDERING)
        )
    )

    (func $window_listener.handle_cycle_type_next_tick<>
        (if (i32.eqz (call $window_listener.get_cycle_is_next_tick<>i32))
            (then
                (call $window_listener.new_cycle_type<i32> (global.get $CYCLE_TYPE_NEXT_TICK))
                (call $window_listener.set_cycle_type_next_tick<>)

                (call $window_listener.cancel_rendering_cycle<>)
                (call $window_listener.listen_next_tick_cycle<ref> (ref.null extern))

                (call $window_listener.dump_cycle_stats<>)
            )
        )
    )

    (func $window_listener.handle_cycle_type_rendering<>
        (if (i32.eqz (call $window_listener.get_cycle_is_rendering<>i32))
            (then
                (call $window_listener.new_cycle_type<i32> (global.get $CYCLE_TYPE_RENDERING))
                (call $window_listener.set_cycle_type_rendering<>)
                
                (call $window_listener.cancel_next_tick_cycle<>)
                (call $window_listener.listen_rendering_cycle<i32> (call $self.Reflect.apply<refx3>i32 
            (global.get $self.performance.now) (global.get $self.performance) (call $self.Array.of<>ref)))
            )
        )
    )

    (func $window_listener.dump_cycle_stats<> (export "dumpcycle")
        (call $self.console.warn<ref.ref.i32.ref.i32.ref.i32.ref.i32> 
            (table.get $extern (i32.const 39))
            (table.get $extern (i32.const 40)) (call $window_listener.get_cycle_frame_count<>i32)
            (table.get $extern (i32.const 41)) (call $window_listener.get_cycle_tick_count<>i32)
            (table.get $extern (i32.const 42)) (call $window_listener.get_cycle_count<>i32)
            (table.get $extern (i32.const 43)) (call $window_listener.get_cycle_cps<>i32)
        )
    )

    (func $window_listener.new_cycle_type<i32>              (param i32) (i32.store  offset=16 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_type<i32>              (param i32) (i32.store8 offset=16 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_is_next_tick<i32>       (param i32) (i32.store8 offset=17 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_is_rendering<i32>       (param i32) (i32.store8 offset=18 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_is_timeout<i32>         (param i32) (i32.store8 offset=19 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.get_cycle_type<>i32              (result i32) (i32.load8_u offset=16 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_is_next_tick<>i32       (result i32) (i32.load8_u offset=17 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_is_rendering<>i32       (result i32) (i32.load8_u offset=18 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_is_timeout<>i32         (result i32) (i32.load8_u offset=19 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.set_cycle_type_next_tick<>       (i32.store8 offset=17 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_cycle_type_rendering<>       (i32.store8 offset=18 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
    (func $window_listener.set_cycle_type_timeout<>         (i32.store8 offset=19 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))

    (func $window_listener.get_cycle_last_rendering_id<>i32  (result i32) (i32.load offset=20 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_last_next_tick_id<>i32  (result i32) (i32.load offset=24 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_last_epoch<>i32         (result i32) (i32.load offset=28 (global.get $OFFSET_WINDOW_LISTENER)))

    (func $window_listener.set_cycle_last_rendering_id<i32>  (param i32) (i32.store offset=20 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_last_next_tick_id<i32>  (param i32) (i32.store offset=24 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_last_epoch<i32>         (param i32) (i32.store offset=28 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_last_epoch_pnow<>       (call $window_listener.set_cycle_last_epoch<i32> (call $self.Reflect.apply<refx3>i32 
            (global.get $self.performance.now) (global.get $self.performance) (call $self.Array.of<>ref))))
 
    (func $window_listener.get_cycle_frame_count<>i32        (result i32) (i32.load offset=32 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_tick_count<>i32         (result i32) (i32.load offset=36 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_count<>i32              (result i32) (i32.load offset=40 (global.get $OFFSET_WINDOW_LISTENER)))
    (func $window_listener.get_cycle_cps<>i32                (result i32) (i32.load offset=44 (global.get $OFFSET_WINDOW_LISTENER)))

    (func $window_listener.set_cycle_frame_count<i32>        (param i32) (i32.store offset=32 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_tick_count<i32>         (param i32) (i32.store offset=36 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_count<i32>              (param i32) (i32.store offset=40 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
    (func $window_listener.set_cycle_cps<i32>                (param i32) (i32.store offset=44 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))

    (func $window_listener.add_rendering_cycle<> 
        (v128.store offset=32 (global.get $OFFSET_WINDOW_LISTENER) 
            (i32x4.add (v128.load offset=32 (global.get $OFFSET_WINDOW_LISTENER)) (v128.const i32x4 1 0 1 0))
        )
    )

    (func $window_listener.add_next_tick_cycle<> 
        (v128.store offset=32 (global.get $OFFSET_WINDOW_LISTENER) 
            (i32x4.add (v128.load offset=32 (global.get $OFFSET_WINDOW_LISTENER)) (v128.const i32x4 0 1 1 0))
        )
    )

    (data (i32.const 4) "\10")

    (global $wasm.memory_manager* (mut i32) (i32.const 0))
    (global $wasm.window_listener* (mut i32) (i32.const 0))
    (global $wasm.event_manager* (mut i32) (i32.const 0))

    (start $main) (func $main
(table.set $extern (i32.const 1) (call $wat4wasm/text (i32.const 0) (i32.const 24)))
		(table.set $extern (i32.const 2) (call $wat4wasm/text (i32.const 24) (i32.const 28)))
		(table.set $extern (i32.const 3) (call $wat4wasm/text (i32.const 52) (i32.const 28)))
		(table.set $extern (i32.const 4) (call $wat4wasm/text (i32.const 80) (i32.const 24)))
		(table.set $extern (i32.const 5) (call $wat4wasm/text (i32.const 104) (i32.const 24)))
		(table.set $extern (i32.const 6) (call $wat4wasm/text (i32.const 128) (i32.const 40)))
		(table.set $extern (i32.const 7) (call $wat4wasm/text (i32.const 168) (i32.const 84)))
		(table.set $extern (i32.const 8) (call $wat4wasm/text (i32.const 252) (i32.const 84)))
		(table.set $extern (i32.const 9) (call $wat4wasm/text (i32.const 336) (i32.const 96)))
		(table.set $extern (i32.const 10) (call $wat4wasm/text (i32.const 432) (i32.const 92)))
		(table.set $extern (i32.const 11) (call $wat4wasm/text (i32.const 524) (i32.const 92)))
		(table.set $extern (i32.const 12) (call $wat4wasm/text (i32.const 616) (i32.const 88)))
		(table.set $extern (i32.const 13) (call $wat4wasm/text (i32.const 704) (i32.const 44)))
		(table.set $extern (i32.const 14) (call $wat4wasm/text (i32.const 748) (i32.const 40)))
		(table.set $extern (i32.const 15) (call $wat4wasm/text (i32.const 788) (i32.const 48)))
		(table.set $extern (i32.const 16) (call $wat4wasm/text (i32.const 836) (i32.const 52)))
		(table.set $extern (i32.const 17) (call $wat4wasm/text (i32.const 888) (i32.const 64)))
		(table.set $extern (i32.const 18) (call $wat4wasm/text (i32.const 952) (i32.const 100)))
		(table.set $extern (i32.const 19) (call $wat4wasm/text (i32.const 1052) (i32.const 96)))
		(table.set $extern (i32.const 20) (call $wat4wasm/text (i32.const 1148) (i32.const 112)))
		(table.set $extern (i32.const 21) (call $wat4wasm/text (i32.const 1260) (i32.const 20)))
		(table.set $extern (i32.const 22) (call $wat4wasm/text (i32.const 1280) (i32.const 16)))
		(table.set $extern (i32.const 23) (call $wat4wasm/text (i32.const 1296) (i32.const 100)))
		(table.set $extern (i32.const 24) (call $wat4wasm/text (i32.const 1396) (i32.const 100)))
		(table.set $extern (i32.const 25) (call $wat4wasm/text (i32.const 1496) (i32.const 112)))
		(table.set $extern (i32.const 26) (call $wat4wasm/text (i32.const 1608) (i32.const 32)))
		(table.set $extern (i32.const 27) (call $wat4wasm/text (i32.const 1640) (i32.const 32)))
		(table.set $extern (i32.const 28) (call $wat4wasm/text (i32.const 1672) (i32.const 32)))
		(table.set $extern (i32.const 29) (call $wat4wasm/text (i32.const 1704) (i32.const 40)))
		(table.set $extern (i32.const 30) (call $wat4wasm/text (i32.const 1744) (i32.const 72)))
		(table.set $extern (i32.const 31) (call $wat4wasm/text (i32.const 1816) (i32.const 72)))
		(table.set $extern (i32.const 32) (call $wat4wasm/text (i32.const 1888) (i32.const 80)))
		(table.set $extern (i32.const 33) (call $wat4wasm/text (i32.const 1968) (i32.const 88)))
		(table.set $extern (i32.const 34) (call $wat4wasm/text (i32.const 2056) (i32.const 48)))
		(table.set $extern (i32.const 35) (call $wat4wasm/text (i32.const 2104) (i32.const 24)))
		(table.set $extern (i32.const 36) (call $wat4wasm/text (i32.const 2128) (i32.const 92)))
		(table.set $extern (i32.const 37) (call $wat4wasm/text (i32.const 2220) (i32.const 116)))
		(table.set $extern (i32.const 38) (call $wat4wasm/text (i32.const 2336) (i32.const 104)))
		(table.set $extern (i32.const 39) (call $wat4wasm/text (i32.const 2440) (i32.const 108)))
		(table.set $extern (i32.const 40) (call $wat4wasm/text (i32.const 2548) (i32.const 64)))
		(table.set $extern (i32.const 41) (call $wat4wasm/text (i32.const 2612) (i32.const 64)))
		(table.set $extern (i32.const 42) (call $wat4wasm/text (i32.const 2676) (i32.const 72)))
		(table.set $extern (i32.const 43) (call $wat4wasm/text (i32.const 2748) (i32.const 72)))
		(table.set $extern (i32.const 44) (call $wat4wasm/text (i32.const 2820) (i32.const 36)))
		(table.set $extern (i32.const 45) (call $wat4wasm/text (i32.const 2856) (i32.const 48)))
		(table.set $extern (i32.const 46) (call $wat4wasm/text (i32.const 2904) (i32.const 24)))
		(table.set $extern (i32.const 47) (call $wat4wasm/text (i32.const 2928) (i32.const 32)))
		(table.set $extern (i32.const 48) (call $wat4wasm/text (i32.const 2960) (i32.const 32)))
		(table.set $extern (i32.const 49) (call $wat4wasm/text (i32.const 2992) (i32.const 56)))
		(table.set $extern (i32.const 50) (call $wat4wasm/text (i32.const 3048) (i32.const 32)))
		(table.set $extern (i32.const 51) (call $wat4wasm/text (i32.const 3080) (i32.const 64)))
		(table.set $extern (i32.const 52) (call $wat4wasm/text (i32.const 3144) (i32.const 56)))
		(table.set $extern (i32.const 53) (call $wat4wasm/text (i32.const 3200) (i32.const 48)))
		(table.set $extern (i32.const 54) (call $wat4wasm/text (i32.const 3248) (i32.const 36)))
		(table.set $extern (i32.const 55) (call $wat4wasm/text (i32.const 3284) (i32.const 16)))
		(table.set $extern (i32.const 56) (call $wat4wasm/text (i32.const 3300) (i32.const 12)))
		(table.set $extern (i32.const 57) (call $wat4wasm/text (i32.const 3312) (i32.const 24)))
		(table.set $extern (i32.const 58) (call $wat4wasm/text (i32.const 3336) (i32.const 44)))
		(table.set $extern (i32.const 59) (call $wat4wasm/text (i32.const 3380) (i32.const 24)))
		(table.set $extern (i32.const 60) (call $wat4wasm/text (i32.const 3404) (i32.const 40)))
		(table.set $extern (i32.const 61) (call $wat4wasm/text (i32.const 3444) (i32.const 16)))
		(table.set $extern (i32.const 62) (call $wat4wasm/text (i32.const 3460) (i32.const 20)))
		(table.set $extern (i32.const 63) (call $wat4wasm/text (i32.const 3480) (i32.const 16)))
		(table.set $extern (i32.const 64) (call $wat4wasm/text (i32.const 3496) (i32.const 20)))
		(table.set $extern (i32.const 65) (call $wat4wasm/text (i32.const 3516) (i32.const 36)))
		(table.set $extern (i32.const 66) (call $wat4wasm/text (i32.const 3552) (i32.const 44)))
		(table.set $extern (i32.const 67) (call $wat4wasm/text (i32.const 3596) (i32.const 64)))
		(table.set $extern (i32.const 68) (call $wat4wasm/text (i32.const 3660) (i32.const 76)))
		(table.set $extern (i32.const 69) (call $wat4wasm/text (i32.const 3736) (i32.const 32)))
		(table.set $extern (i32.const 70) (call $wat4wasm/text (i32.const 3768) (i32.const 60)))
		(table.set $extern (i32.const 71) (call $wat4wasm/text (i32.const 3828) (i32.const 24)))
		(table.set $extern (i32.const 72) (call $wat4wasm/text (i32.const 3852) (i32.const 40)))
		(table.set $extern (i32.const 73) (call $wat4wasm/text (i32.const 3892) (i32.const 32)))
		(table.set $extern (i32.const 74) (call $wat4wasm/text (i32.const 3924) (i32.const 24)))
		(table.set $extern (i32.const 75) (call $wat4wasm/text (i32.const 3948) (i32.const 44)))
		(table.set $extern (i32.const 76) (call $wat4wasm/text (i32.const 3992) (i32.const 12)))




        (global.set $self.navigator.deviceMemory
            (call $wat4wasm/Reflect.get<refx2>i32
                (call $wat4wasm/Reflect.get<refx2>ref 
                        (global.get $wat4wasm/self) 
                        (table.get $extern (i32.const 44)) 
                    )
                (table.get $extern (i32.const 45)) 
            )
        )
        
        (global.set $self.window
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 46)) 
            )
        )
        
        (global.set $self.document
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 47)) 
            )
        )
        
        (global.set $self.navigator.wakeLock
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                        (global.get $wat4wasm/self) 
                        (table.get $extern (i32.const 44)) 
                    )
                (table.get $extern (i32.const 48)) 
            )
        )
        
        (global.set $self.navigator.userActivation
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                        (global.get $wat4wasm/self) 
                        (table.get $extern (i32.const 44)) 
                    )
                (table.get $extern (i32.const 49)) 
            )
        )
        
        (global.set $self.WakeLock
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 50)) 
            )
        )
        
        (global.set $self.WakeLockSentinel
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 51)) 
            )
        )
        
        (global.set $self.UserActivation
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 52)) 
            )
        )
        
        (global.set $self.MessageEvent.prototype.data/get
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.getOwnPropertyDescriptor<refx2>ref
                    (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 53)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                    (table.get $extern (i32.const 55)) 
                )
                (table.get $extern (i32.const 56)) 
            )
        )
        
        (global.set $self.Object
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 57)) 
            )
        )
        
        (global.set $self.WebAssembly.Memory
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                        (global.get $wat4wasm/self) 
                        (table.get $extern (i32.const 58)) 
                    )
                (table.get $extern (i32.const 59)) 
            )
        )
        
        (global.set $self.Uint8Array
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 60)) 
            )
        )
        
        (global.set $self.WebAssembly
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 58)) 
            )
        )
        
        (global.set $self.WebAssembly.Memory:grow
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                                (call $wat4wasm/Reflect.get<refx2>ref 
                                        (call $wat4wasm/Reflect.get<refx2>ref 
                                            (global.get $wat4wasm/self) 
                                            (table.get $extern (i32.const 58)) 
                                        ) 
                                        (table.get $extern (i32.const 59)) 
                                    ) 
                                (table.get $extern (i32.const 54)) 
                            )
                (table.get $extern (i32.const 61)) 
            )
        )
        
        (global.set $self.Array
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 62)) 
            )
        )
        
        (global.set $self.Array:push
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 62)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                (table.get $extern (i32.const 63)) 
            )
        )
        
        (global.set $self.Uint8Array:slice
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 60)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                (table.get $extern (i32.const 64)) 
            )
        )
        
        (global.set $self.Uint8Array.__proto__.prototype
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 60)) 
                            ) 
                            (table.get $extern (i32.const 65)) 
                        )
                (table.get $extern (i32.const 54)) 
            )
        )
        
        (global.set $self.Uint8Array.__proto__.prototype.buffer/get
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.getOwnPropertyDescriptor<refx2>ref
                    (call $wat4wasm/Reflect.get<refx2>ref 
                                (call $wat4wasm/Reflect.get<refx2>ref 
                                        (call $wat4wasm/Reflect.get<refx2>ref 
                                            (global.get $wat4wasm/self) 
                                            (table.get $extern (i32.const 60)) 
                                        ) 
                                        (table.get $extern (i32.const 65)) 
                                    ) 
                                (table.get $extern (i32.const 54)) 
                            )
                    (table.get $extern (i32.const 5)) 
                )
                (table.get $extern (i32.const 56)) 
            )
        )
        
        (global.set $self.EventTarget:addEventListener
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 66)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                (table.get $extern (i32.const 67)) 
            )
        )
        
        (global.set $self.EventTarget:removeEventListener
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 66)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                (table.get $extern (i32.const 68)) 
            )
        )
        
        (global.set $self.Document:visibilityState/get
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.getOwnPropertyDescriptor<refx2>ref
                    (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 69)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                    (table.get $extern (i32.const 70)) 
                )
                (table.get $extern (i32.const 56)) 
            )
        )
        
        (global.set $self.String:charCodeAt
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 71)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                (table.get $extern (i32.const 72)) 
            )
        )
        
        (global.set $self.Document:hasFocus
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 69)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                (table.get $extern (i32.const 73)) 
            )
        )
        
        (global.set $self.Document:hidden/get
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.getOwnPropertyDescriptor<refx2>ref
                    (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 69)) 
                            ) 
                            (table.get $extern (i32.const 54)) 
                        )
                    (table.get $extern (i32.const 74)) 
                )
                (table.get $extern (i32.const 56)) 
            )
        )
        
        (global.set $self.performance
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 75)) 
            )
        )
        
        (global.set $self.performance.now
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                        (global.get $wat4wasm/self) 
                        (table.get $extern (i32.const 75)) 
                    )
                (table.get $extern (i32.const 76)) 
            )
        )
        
 
        (global.set $wasm.memory_manager*  (call $new_memory_manager))
        (global.set $wasm.window_listener* (call $new_window_listener))
        (global.set $wasm.event_manager*   (call $new_event_manager))
    )

	(global $self.MessageEvent.prototype.data/get (mut externref) ref.null extern)


	(global $self.Object (mut externref) ref.null extern)
	(global $self.WebAssembly.Memory (mut externref) ref.null extern)
	(global $self.Uint8Array (mut externref) ref.null extern)

	(global $self.WebAssembly (mut externref) ref.null extern)
	(global $self.WebAssembly.Memory:grow (mut externref) ref.null extern)
	(global $self.Array (mut externref) ref.null extern)
	(global $self.Array:push (mut externref) ref.null extern)
	(global $self.Uint8Array:slice (mut externref) ref.null extern)
	(global $self.Uint8Array.__proto__.prototype (mut externref) ref.null extern)
	(global $self.Uint8Array.__proto__.prototype.buffer/get (mut externref) ref.null extern)
	(global $self.EventTarget:addEventListener (mut externref) ref.null extern)
	(global $self.EventTarget:removeEventListener (mut externref) ref.null extern)
	(global $self.Document:visibilityState/get (mut externref) ref.null extern)
	(global $self.String:charCodeAt (mut externref) ref.null extern)
	(global $self.Document:hasFocus (mut externref) ref.null extern)
	(global $self.Document:hidden/get (mut externref) ref.null extern)
	(global $self.performance (mut externref) ref.null extern)
	(global $self.performance.now (mut externref) ref.null extern)

	(elem $wat4wasm/refs funcref (ref.func $event_manager.hanlde_for_each_tick<>) (ref.func $event_manager.hanlde_for_each_frame<>) (ref.func $event_manager.hanlde_for_each_second<>) (ref.func $window_listener.handle_pointer_over<>) (ref.func $window_listener.handle_pointer_out<>) (ref.func $window_listener.handle_visibility_change<>) (ref.func $window_listener.handle_focus_focused<>) (ref.func $window_listener.handle_focus_blurred<>) (ref.func $window_listener.handle_page_show<>) (ref.func $window_listener.handle_page_hide<>) (ref.func $window_listener.handle_page_swap<>) (ref.func $window_listener.handle_page_reveal<>) (ref.func $window_listener.handle_unload_before<>) (ref.func $window_listener.handle_unload_closed<>) (ref.func $window_listener.listen_next_tick_cycle<ref>) (ref.func $window_listener.listen_rendering_cycle<i32>))

    (table $extern 77 77 externref)

    (func $wat4wasm/text 
        (param $offset i32)
        (param $length i32)

        (result externref)
        
        (local $array externref)
        (local $ovalue i32)

        (if (i32.eqz (local.get $length))
            (then (return (ref.null extern)))
        )

        (local.set $array 
            (call $wat4wasm/Array<>ref)
        )

        (local.set $ovalue (i32.load (i32.const 0)))

        (loop $length--
            (local.set $length
                (i32.sub (local.get $length) (i32.const 4))
            )
                
            (memory.init $wat4wasm/text
                (i32.const 0)
                (i32.add 
                    (local.get $offset)
                    (local.get $length)
                )
                (i32.const 4)
            )        
                            
            (call $wat4wasm/Reflect.set<ref.i32x2>
                (local.get $array)
                (i32.div_u (local.get $length) (i32.const 4))
                (i32.trunc_f32_u	
                    (f32.load 
                        (i32.const 0)
                    )
                )
            )

            (br_if $length-- (local.get $length))
        )

        (i32.store (i32.const 0) (local.get $ovalue))

        (call $wat4wasm/Reflect.apply<refx3>ref
            (global.get $wat4wasm/String.fromCharCode)
            (ref.null extern)
            (local.get $array)
        )
    )

    (data $wat4wasm/text "\00\00\da\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\d2\42\00\00\dc\42\00\00\d2\42\00\00\e8\42\00\00\d2\42\00\00\c2\42\00\00\d8\42\00\00\da\42\00\00\c2\42\00\00\f0\42\00\00\d2\42\00\00\da\42\00\00\ea\42\00\00\da\42\00\00\e6\42\00\00\d0\42\00\00\c2\42\00\00\e4\42\00\00\ca\42\00\00\c8\42\00\00\c4\42\00\00\ea\42\00\00\cc\42\00\00\cc\42\00\00\ca\42\00\00\e4\42\00\00\c4\42\00\00\f2\42\00\00\e8\42\00\00\ca\42\00\00\98\42\00\00\ca\42\00\00\dc\42\00\00\ce\42\00\00\e8\42\00\00\d0\42\00\00\c4\42\00\00\ea\42\00\00\cc\42\00\00\cc\42\00\00\ca\42\00\00\e4\42\00\00\be\42\00\00\da\42\00\00\c2\42\00\00\f0\42\00\00\be\42\00\00\c4\42\00\00\f2\42\00\00\e8\42\00\00\ca\42\00\00\d8\42\00\00\ca\42\00\00\dc\42\00\00\ce\42\00\00\e8\42\00\00\d0\42\00\00\da\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\be\42\00\00\da\42\00\00\c2\42\00\00\f0\42\00\00\be\42\00\00\c4\42\00\00\f2\42\00\00\e8\42\00\00\ca\42\00\00\d8\42\00\00\ca\42\00\00\dc\42\00\00\ce\42\00\00\e8\42\00\00\d0\42\00\00\c8\42\00\00\ca\42\00\00\ec\42\00\00\d2\42\00\00\c6\42\00\00\ca\42\00\00\be\42\00\00\da\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\be\42\00\00\c4\42\00\00\f2\42\00\00\e8\42\00\00\ca\42\00\00\d8\42\00\00\ca\42\00\00\dc\42\00\00\ce\42\00\00\e8\42\00\00\d0\42\00\00\da\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\be\42\00\00\c6\42\00\00\ea\42\00\00\e4\42\00\00\e4\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\be\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e6\42\00\00\d2\42\00\00\f4\42\00\00\ca\42\00\00\da\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\be\42\00\00\da\42\00\00\c2\42\00\00\f0\42\00\00\d2\42\00\00\da\42\00\00\ea\42\00\00\da\42\00\00\be\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e6\42\00\00\d2\42\00\00\f4\42\00\00\ca\42\00\00\c8\42\00\00\d2\42\00\00\e6\42\00\00\e0\42\00\00\c2\42\00\00\e8\42\00\00\c6\42\00\00\d0\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\ca\42\00\00\ec\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\00\42\00\00\e8\42\00\00\f2\42\00\00\e0\42\00\00\ca\42\00\00\68\42\00\00\e0\42\00\00\de\42\00\00\d2\42\00\00\dc\42\00\00\e8\42\00\00\ca\42\00\00\e4\42\00\00\de\42\00\00\ec\42\00\00\ca\42\00\00\e4\42\00\00\e0\42\00\00\de\42\00\00\d2\42\00\00\dc\42\00\00\e8\42\00\00\ca\42\00\00\e4\42\00\00\de\42\00\00\ea\42\00\00\e8\42\00\00\de\42\00\00\dc\42\00\00\e0\42\00\00\de\42\00\00\d2\42\00\00\dc\42\00\00\e8\42\00\00\ca\42\00\00\e4\42\00\00\de\42\00\00\ea\42\00\00\e8\42\00\00\de\42\00\00\dc\42\00\00\e0\42\00\00\de\42\00\00\d2\42\00\00\dc\42\00\00\e8\42\00\00\ca\42\00\00\e4\42\00\00\de\42\00\00\ec\42\00\00\ca\42\00\00\e4\42\00\00\ec\42\00\00\d2\42\00\00\e6\42\00\00\d2\42\00\00\c4\42\00\00\d2\42\00\00\d8\42\00\00\d2\42\00\00\e8\42\00\00\f2\42\00\00\c6\42\00\00\d0\42\00\00\c2\42\00\00\dc\42\00\00\ce\42\00\00\ca\42\00\00\ec\42\00\00\d2\42\00\00\e6\42\00\00\d2\42\00\00\c4\42\00\00\d2\42\00\00\d8\42\00\00\d2\42\00\00\e8\42\00\00\f2\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\ec\42\00\00\d2\42\00\00\e6\42\00\00\d2\42\00\00\c4\42\00\00\d8\42\00\00\ca\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\ec\42\00\00\d2\42\00\00\e6\42\00\00\d2\42\00\00\c4\42\00\00\d2\42\00\00\d8\42\00\00\d2\42\00\00\e8\42\00\00\f2\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\d0\42\00\00\d2\42\00\00\c8\42\00\00\c8\42\00\00\ca\42\00\00\dc\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\ec\42\00\00\d2\42\00\00\e6\42\00\00\d2\42\00\00\c4\42\00\00\d2\42\00\00\d8\42\00\00\d2\42\00\00\e8\42\00\00\f2\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\e0\42\00\00\e4\42\00\00\ca\42\00\00\34\42\00\00\e4\42\00\00\ca\42\00\00\dc\42\00\00\c8\42\00\00\ca\42\00\00\e4\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\cc\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\e6\42\00\00\c4\42\00\00\d8\42\00\00\ea\42\00\00\e4\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\cc\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\e6\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\c4\42\00\00\d8\42\00\00\ea\42\00\00\e4\42\00\00\e4\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\cc\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\e6\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\cc\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\e6\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\cc\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\e6\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\e0\42\00\00\e4\42\00\00\ca\42\00\00\34\42\00\00\c2\42\00\00\c6\42\00\00\e8\42\00\00\d2\42\00\00\ec\42\00\00\ca\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e6\42\00\00\d0\42\00\00\de\42\00\00\ee\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\d0\42\00\00\d2\42\00\00\c8\42\00\00\ca\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e6\42\00\00\ee\42\00\00\c2\42\00\00\e0\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e4\42\00\00\ca\42\00\00\ec\42\00\00\ca\42\00\00\c2\42\00\00\d8\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\d0\42\00\00\c2\42\00\00\e6\42\00\00\00\42\00\00\e6\42\00\00\d0\42\00\00\de\42\00\00\ee\42\00\00\dc\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\d0\42\00\00\c2\42\00\00\e6\42\00\00\00\42\00\00\d0\42\00\00\d2\42\00\00\c8\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\d0\42\00\00\d2\42\00\00\c8\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\ee\42\00\00\d2\42\00\00\e8\42\00\00\d0\42\00\00\00\42\00\00\e6\42\00\00\ee\42\00\00\c2\42\00\00\e0\42\00\00\e0\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\00\42\00\00\e6\42\00\00\d0\42\00\00\de\42\00\00\ee\42\00\00\dc\42\00\00\00\42\00\00\ee\42\00\00\d2\42\00\00\e8\42\00\00\d0\42\00\00\00\42\00\00\e4\42\00\00\ca\42\00\00\ec\42\00\00\ca\42\00\00\c2\42\00\00\d8\42\00\00\c4\42\00\00\ca\42\00\00\cc\42\00\00\de\42\00\00\e4\42\00\00\ca\42\00\00\ea\42\00\00\dc\42\00\00\d8\42\00\00\de\42\00\00\c2\42\00\00\c8\42\00\00\ea\42\00\00\dc\42\00\00\d8\42\00\00\de\42\00\00\c2\42\00\00\c8\42\00\00\ea\42\00\00\dc\42\00\00\d8\42\00\00\de\42\00\00\c2\42\00\00\c8\42\00\00\00\42\00\00\e6\42\00\00\e8\42\00\00\c2\42\00\00\e8\42\00\00\ca\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\ee\42\00\00\c2\42\00\00\d2\42\00\00\e8\42\00\00\d2\42\00\00\dc\42\00\00\ce\42\00\00\ea\42\00\00\dc\42\00\00\d8\42\00\00\de\42\00\00\c2\42\00\00\c8\42\00\00\00\42\00\00\e6\42\00\00\e8\42\00\00\c2\42\00\00\e8\42\00\00\ca\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\c4\42\00\00\ca\42\00\00\cc\42\00\00\de\42\00\00\e4\42\00\00\ca\42\00\00\00\42\00\00\ea\42\00\00\dc\42\00\00\d8\42\00\00\de\42\00\00\c2\42\00\00\c8\42\00\00\ea\42\00\00\dc\42\00\00\d8\42\00\00\de\42\00\00\c2\42\00\00\c8\42\00\00\00\42\00\00\e6\42\00\00\e8\42\00\00\c2\42\00\00\e8\42\00\00\ca\42\00\00\00\42\00\00\d2\42\00\00\e6\42\00\00\00\42\00\00\c6\42\00\00\d8\42\00\00\de\42\00\00\e6\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\dc\42\00\00\de\42\00\00\ee\42\00\00\c6\42\00\00\f2\42\00\00\c6\42\00\00\d8\42\00\00\ca\42\00\00\00\42\00\00\e6\42\00\00\ee\42\00\00\d2\42\00\00\e8\42\00\00\c6\42\00\00\d0\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\e8\42\00\00\de\42\00\00\00\42\00\00\dc\42\00\00\ca\42\00\00\f0\42\00\00\e8\42\00\00\00\42\00\00\e8\42\00\00\d2\42\00\00\c6\42\00\00\d6\42\00\00\e4\42\00\00\ca\42\00\00\dc\42\00\00\c8\42\00\00\ca\42\00\00\e4\42\00\00\ca\42\00\00\c8\42\00\00\00\42\00\00\cc\42\00\00\e4\42\00\00\c2\42\00\00\da\42\00\00\ca\42\00\00\e6\42\00\00\68\42\00\00\c6\42\00\00\c2\42\00\00\d8\42\00\00\d8\42\00\00\c4\42\00\00\c2\42\00\00\c6\42\00\00\d6\42\00\00\00\42\00\00\c6\42\00\00\f2\42\00\00\c6\42\00\00\d8\42\00\00\ca\42\00\00\e6\42\00\00\68\42\00\00\e8\42\00\00\de\42\00\00\e8\42\00\00\c2\42\00\00\d8\42\00\00\00\42\00\00\c6\42\00\00\f2\42\00\00\c6\42\00\00\d8\42\00\00\ca\42\00\00\00\42\00\00\c6\42\00\00\de\42\00\00\ea\42\00\00\dc\42\00\00\e8\42\00\00\68\42\00\00\c6\42\00\00\f2\42\00\00\c6\42\00\00\d8\42\00\00\ca\42\00\00\e6\42\00\00\00\42\00\00\e0\42\00\00\ca\42\00\00\e4\42\00\00\00\42\00\00\e6\42\00\00\ca\42\00\00\c6\42\00\00\de\42\00\00\dc\42\00\00\c8\42\00\00\68\42\00\00\dc\42\00\00\c2\42\00\00\ec\42\00\00\d2\42\00\00\ce\42\00\00\c2\42\00\00\e8\42\00\00\de\42\00\00\e4\42\00\00\c8\42\00\00\ca\42\00\00\ec\42\00\00\d2\42\00\00\c6\42\00\00\ca\42\00\00\9a\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\ee\42\00\00\d2\42\00\00\dc\42\00\00\c8\42\00\00\de\42\00\00\ee\42\00\00\c8\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\da\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\ee\42\00\00\c2\42\00\00\d6\42\00\00\ca\42\00\00\98\42\00\00\de\42\00\00\c6\42\00\00\d6\42\00\00\ea\42\00\00\e6\42\00\00\ca\42\00\00\e4\42\00\00\82\42\00\00\c6\42\00\00\e8\42\00\00\d2\42\00\00\ec\42\00\00\c2\42\00\00\e8\42\00\00\d2\42\00\00\de\42\00\00\dc\42\00\00\ae\42\00\00\c2\42\00\00\d6\42\00\00\ca\42\00\00\98\42\00\00\de\42\00\00\c6\42\00\00\d6\42\00\00\ae\42\00\00\c2\42\00\00\d6\42\00\00\ca\42\00\00\98\42\00\00\de\42\00\00\c6\42\00\00\d6\42\00\00\a6\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\d2\42\00\00\dc\42\00\00\ca\42\00\00\d8\42\00\00\aa\42\00\00\e6\42\00\00\ca\42\00\00\e4\42\00\00\82\42\00\00\c6\42\00\00\e8\42\00\00\d2\42\00\00\ec\42\00\00\c2\42\00\00\e8\42\00\00\d2\42\00\00\de\42\00\00\dc\42\00\00\9a\42\00\00\ca\42\00\00\e6\42\00\00\e6\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\8a\42\00\00\ec\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\e0\42\00\00\e4\42\00\00\de\42\00\00\e8\42\00\00\de\42\00\00\e8\42\00\00\f2\42\00\00\e0\42\00\00\ca\42\00\00\c8\42\00\00\c2\42\00\00\e8\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e8\42\00\00\9e\42\00\00\c4\42\00\00\d4\42\00\00\ca\42\00\00\c6\42\00\00\e8\42\00\00\ae\42\00\00\ca\42\00\00\c4\42\00\00\82\42\00\00\e6\42\00\00\e6\42\00\00\ca\42\00\00\da\42\00\00\c4\42\00\00\d8\42\00\00\f2\42\00\00\9a\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\aa\42\00\00\d2\42\00\00\dc\42\00\00\e8\42\00\00\60\42\00\00\82\42\00\00\e4\42\00\00\e4\42\00\00\c2\42\00\00\f2\42\00\00\ce\42\00\00\e4\42\00\00\de\42\00\00\ee\42\00\00\82\42\00\00\e4\42\00\00\e4\42\00\00\c2\42\00\00\f2\42\00\00\e0\42\00\00\ea\42\00\00\e6\42\00\00\d0\42\00\00\e6\42\00\00\d8\42\00\00\d2\42\00\00\c6\42\00\00\ca\42\00\00\be\42\00\00\be\42\00\00\e0\42\00\00\e4\42\00\00\de\42\00\00\e8\42\00\00\de\42\00\00\be\42\00\00\be\42\00\00\8a\42\00\00\ec\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\a8\42\00\00\c2\42\00\00\e4\42\00\00\ce\42\00\00\ca\42\00\00\e8\42\00\00\c2\42\00\00\c8\42\00\00\c8\42\00\00\8a\42\00\00\ec\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\98\42\00\00\d2\42\00\00\e6\42\00\00\e8\42\00\00\ca\42\00\00\dc\42\00\00\ca\42\00\00\e4\42\00\00\e4\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\ec\42\00\00\ca\42\00\00\8a\42\00\00\ec\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\98\42\00\00\d2\42\00\00\e6\42\00\00\e8\42\00\00\ca\42\00\00\dc\42\00\00\ca\42\00\00\e4\42\00\00\88\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\da\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\ec\42\00\00\d2\42\00\00\e6\42\00\00\d2\42\00\00\c4\42\00\00\d2\42\00\00\d8\42\00\00\d2\42\00\00\e8\42\00\00\f2\42\00\00\a6\42\00\00\e8\42\00\00\c2\42\00\00\e8\42\00\00\ca\42\00\00\a6\42\00\00\e8\42\00\00\e4\42\00\00\d2\42\00\00\dc\42\00\00\ce\42\00\00\c6\42\00\00\d0\42\00\00\c2\42\00\00\e4\42\00\00\86\42\00\00\de\42\00\00\c8\42\00\00\ca\42\00\00\82\42\00\00\e8\42\00\00\d0\42\00\00\c2\42\00\00\e6\42\00\00\8c\42\00\00\de\42\00\00\c6\42\00\00\ea\42\00\00\e6\42\00\00\d0\42\00\00\d2\42\00\00\c8\42\00\00\c8\42\00\00\ca\42\00\00\dc\42\00\00\e0\42\00\00\ca\42\00\00\e4\42\00\00\cc\42\00\00\de\42\00\00\e4\42\00\00\da\42\00\00\c2\42\00\00\dc\42\00\00\c6\42\00\00\ca\42\00\00\dc\42\00\00\de\42\00\00\ee\42")
)