    
    (global $OFFSET_CHAIN_MANAGER       mut i32)
    (global $LENGTH_CHAIN_MANAGER       i32 i32(64))

    (global $OFFSET_CHAIN_SLOTS         mut i32)
    (global $BYTES_PER_CHAIN_SLOT       i32 i32(16))
    (global $MAX_CHAIN_SLOT_COUNT       i32 i32(128))

    (global $CHAIN_SLOT_STATE_EMPTY      i32 i32(0))
    (global $CHAIN_SLOT_STATE_RESERVED   i32 i32(1))
    (global $CHAIN_SLOT_STATE_COMPILING  i32 i32(2))
    (global $CHAIN_SLOT_STATE_READY      i32 i32(3))
    (global $CHAIN_SLOT_STATE_QUEUED     i32 i32(4))
    (global $CHAIN_SLOT_STATE_STARTED    i32 i32(5))
    (global $CHAIN_SLOT_STATE_NOTIFIED   i32 i32(6))
    (global $CHAIN_SLOT_STATE_CLOSED     i32 i32(7))

    (global $OFFSET_CHAIN_HEADER_SLOT_STATE    i32 i32(0))
    (global $OFFSET_CHAIN_HEADER_TABLE_INDEX   i32 i32(4))

    (table $module_source 129 externref)
    (table $chain_module 129 externref)

    (global $self.Function:bind externref)
    (global $self.Promise:then externref)

    (func $new_chain_manager
        (result $chain_manager* i32)
        
        (global.set $OFFSET_CHAIN_MANAGER
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_CHAIN_MANAGER)
            )
        )

        (global.set $OFFSET_CHAIN_SLOTS
            (call $memory_manager.malloc_internal<i32>i32 
                (i32.mul
                    (global.get $BYTES_PER_CHAIN_SLOT)
                    (global.get $MAX_CHAIN_SLOT_COUNT)
                )
            )
        )

        (global.get $OFFSET_CHAIN_MANAGER)
    )

    (func $chain_manager.dispatch<i32>
        (param $chain_ptr i32)
        (local $chain_module ref)
        (local $table_index i32)

        (local.set $table_index
            (call $chain.get_table_index<i32>i32
                (local.get $chain_ptr)
            )
        )

        (local.set $chain_module
            (table.get $chain_module
                (local.get $table_index)
            )
        )
    )

    (func $chain_manager.mark_ready<i32> 
        (param $chain_ptr i32) 
        (local $table_index i32)

        (call $chain.set_slot_state<i32.i32> 
            (local.get $chain_ptr) 
            (global.get $CHAIN_SLOT_STATE_READY)
        )
    )

    (func $chain_manager.on_compile<i32.ref>
        (param $chain_ptr                      i32)
        (param $chain_module    WebAssembly.Module)
        (local $table_index                    i32)

        (local.set $table_index
            (call $chain.get_table_index<i32>i32
                (local.get $chain_ptr)
            )
        )

        (table.set $chain_module
            (local.get $table_index)
            (local.get $chain_module)
        )

        (call $chain.set_slot_state<i32.i32>
            (local.get $chain_ptr) 
            (global.get $CHAIN_SLOT_STATE_READY) 
        )

        (call $self.console.warn<ref.i32> (text 'chain module compiled') (local.get $chain_ptr))
    )

    (func $chain_manager.start<i32>              
        (param $chain_ptr                     i32) 
        (local $table_index                   i32)
        (local $module_source         ArrayBuffer)
        (local $compile_promise           Promise)
        (local $bound_function           Function)

        (local.set $table_index
            (call $chain.get_table_index<i32>i32
                (local.get $chain_ptr)
            )
        )

        (local.set $module_source
            (table.get $module_source
                (local.get $table_index)
            )
        )

        (local.set $bound_function
            (call $self.Reflect.apply<ref.fun.ref>ref
                (global.get $self.Function:bind)
                (ref.func $chain_manager.on_compile<i32.ref>)
                (call $self.Array.of<ref.i32>ref
                    (null) (local.get $chain_ptr)
                )
            )
        )

        (local.set $compile_promise
            (call $self.WebAssembly.compile<ref>ref
                (local.get $module_source) 
            )
        )

        (apply $self.Promise:then<ref>
            (local.get $compile_promise)
            (param (local.get $bound_function))
        )

        (call $chain.set_slot_state<i32.i32>
            (local.get $chain_ptr) 
            (global.get $CHAIN_SLOT_STATE_COMPILING)
        )

        (call $self.console.warn<ref.i32> (text 'chain module compiling') (local.get $chain_ptr))
    )

    (func $chain_manager.alloc_chain_slot<ref>i32
        (param  $module_source ref)
        (result $chain_ptr i32)
        
        (local  $chain_ptr i32)
        (local  $slot_length i32)
        (local  $table_index i32)
        
        (local.set $chain_ptr (global.get $OFFSET_CHAIN_SLOTS))
        (local.set $slot_length (global.get $MAX_CHAIN_SLOT_COUNT))

        (loop $for_each_chain_slot
            (if (call $chain.try_alloc_slot<i32>i32
                    (local.get $chain_ptr)
                )
                (then
                    (local.set $table_index
                        (local.get $slot_length) 
                    )

                    (call $chain.set_table_index<i32.i32>
                        (local.get $chain_ptr)
                        (local.get $table_index)
                    )

                    (call $chain.set_parent_chain<i32.i32>
                        (local.get $chain_ptr)
                        (i32.const 0) 
                    )

                    (table.set $module_source
                        (local.get $table_index)
                        (local.get $module_source)
                    )

                    (call $self.console.warn<ref.i32> (text 'chain slot reserved') (local.get $chain_ptr))

                    (return
                        (local.get $chain_ptr)
                    )
                )
                (else
                    (local.set $chain_ptr
                        (i32.add
                            (local.get $chain_ptr)
                            (global.get $BYTES_PER_CHAIN_SLOT)
                        )
                    )
                    
                    (local.set $slot_length
                        (i32.add
                            (local.get $slot_length)
                            (i32.const 1)
                        )
                    )

                    (br_if $for_each_chain_slot 
                        (local.get $slot_length)
                    )
                )
            )
        )

        (unreachable)
    )

    (func $chain_manager.new_chain_slot_offset<>i32     (result i32) (i32.atomic.rmw.add offset=4 (global.get $OFFSET_CHAIN_MANAGER) (global.get $BYTES_PER_EVENT_SLOT)))
    (func $chain_manager.get_chain_slot_length<>i32     (result i32) (i32.load offset=4 (global.get $OFFSET_CHAIN_MANAGER)))
    (func $chain_manager.set_chain_slot_length<i32>     (param i32) (i32.store offset=4 (global.get $OFFSET_CHAIN_MANAGER) (local.get 0)))
    
    (func $chain_manager.new_chain_slot_index<>i32      (result i32) (i32.atomic.rmw.add offset=8 (global.get $OFFSET_CHAIN_MANAGER) (i32.const 1)))
    (func $chain_manager.get_chain_slot_count<>i32      (result i32) (i32.load offset=8 (global.get $OFFSET_CHAIN_MANAGER)))
    (func $chain_manager.set_chain_slot_count<i32>      (param i32) (i32.store offset=8 (global.get $OFFSET_CHAIN_MANAGER) (local.get 0)))

    (func $chain.try_alloc_slot<i32>i32                 (param i32) (result i32) (i32.eq (global.get $CHAIN_SLOT_STATE_EMPTY) (i32.atomic.rmw.cmpxchg offset=0 (local.get 0) (global.get $CHAIN_SLOT_STATE_EMPTY) (global.get $CHAIN_SLOT_STATE_RESERVED))))
    (func $chain.get_slot_state<i32>i32                 (param i32) (result i32) (i32.load offset=0 (local.get 0)))
    (func $chain.set_slot_state<i32.i32>                (param i32 i32) (i32.store offset=0 (local.get 0) (local.get 1)))

    (func $chain.get_table_index<i32>i32           (param i32) (result i32) (i32.load offset=4 (local.get 0)))
    (func $chain.set_table_index<i32.i32>          (param i32 i32) (i32.store offset=4 (local.get 0) (local.get 1)))

    (func $chain.get_parent_chain<i32>i32         (param i32) (result i32) (i32.load offset=8 (local.get 0)))
    (func $chain.set_parent_chain<i32.i32>        (param i32 i32) (i32.store offset=8 (local.get 0) (local.get 1)))
