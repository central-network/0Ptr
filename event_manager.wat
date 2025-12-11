
    (global $OFFSET_EVENT_MANAGER       mut i32)
    (global $LENGTH_EVENT_MANAGER       i32 i32(16))

    (global $OFFSET_EVENT_LISTENERS     mut i32)
    (global $BYTES_PER_EVENT_LISTENER   i32 i32(32))
    (global $MAX_EVENT_LISTENER_COUNT   i32 i32(256))

    (global $OFFSET_EVENT_EMITS_QUEUE   mut i32)
    (global $BYTES_PER_EMITTED_EVENTS   i32 i32(8))
    (global $MAX_EVENT_EMIT_PER_CYLCE   i32 i32(256))

    (table $event_manager.listener_handlers<fun> 1 65535 funcref)

    (global $EVENT_TYPE.ON_EVERY_SECOND         i32 i32(2))
    (global $EVENT_TYPE.ON_VISIBILTY_VISIBLE    i32 i32(3))
    (global $EVENT_TYPE.ON_VISIBILTY_HIDDEN     i32 i32(4))

    (func $new_event_manager
        (result $this* i32)
        
        (global.set $OFFSET_EVENT_MANAGER
            (call $memory_manager.malloc_internal<i32>i32 
                (global.get $LENGTH_EVENT_MANAGER)
            )
        )

        (global.set $OFFSET_EVENT_LISTENERS
            (call $memory_manager.malloc_internal<i32>i32 
                (i32.mul
                    (global.get $BYTES_PER_EVENT_LISTENER)
                    (global.get $MAX_EVENT_LISTENER_COUNT)
                )
            )
        )

        (global.set $OFFSET_EVENT_EMITS_QUEUE
            (call $memory_manager.malloc_internal<i32>i32 
                (i32.mul
                    (global.get $BYTES_PER_EMITTED_EVENTS)
                    (global.get $MAX_EVENT_EMIT_PER_CYLCE)
                )
            )
        )

        (call $event_manager.set_listener_length<i32>
            (global.get $OFFSET_EVENT_LISTENERS)
        )

        (global.get $OFFSET_EVENT_MANAGER)
    )

    (func $event_manager.event_loop<>
        (local $queue_offset i32)
        (local $queue_length i32)
        
        (local $event_ptr i32)
        (local $event_type i32)

        (local.set $queue_offset (global.get $OFFSET_EVENT_EMITS_QUEUE))
        (local.set $queue_length (global.get $MAX_EVENT_EMIT_PER_CYLCE))

        (loop $for_each_queued_emit
            (if (local.tee $event_ptr
                    (call $event_queue.consume_emitted_event<i32>i32
                        (local.get $queue_offset)
                    )
                )
                (then
                    (if (local.tee $event_type
                            ;; could be registering at the moment
                            (call $event_queue.get_event_type<i32>i32
                                (local.get $queue_offset)
                            )
                        )
                        (then
                            (call $event_manager.dispatch<i32.i32>
                                (local.get $event_type)
                                (local.get $event_ptr)
                            )
                        )
                        (else
                            (call $event_queue.set_event_offset<i32.i32>
                                (local.get $queue_offset)
                                (local.get $event_ptr)
                            )
                        )
                    )
                ) 
            )

            (local.set $queue_offset
                (i32.add 
                    (local.get $queue_offset) 
                    (global.get $BYTES_PER_EMITTED_EVENTS)
                )
            )

            (br_if $for_each_queued_emit 
                (local.tee $queue_length
                    (i32.sub 
                        (local.get $queue_length) 
                        (i32.const 1)
                    )
                ) 
            )
        )
    )

    (func $event_manager.emit<i32.i32>
        (param $event_type i32)
        (param $event_ptr i32)

        (local $queue_offset i32)
        (local $queue_length i32)

        (local.set $queue_offset (global.get $OFFSET_EVENT_EMITS_QUEUE))
        (local.set $queue_length (global.get $MAX_EVENT_EMIT_PER_CYLCE))

        (loop $for_each_queue_slot

            (if (call $event_queue.try_write_emitted<i32.i32>i32
                    (local.get $queue_offset) 
                    (local.get $event_ptr)
                )
                (then
                    (call $event_queue.set_event_type<i32.i32> 
                        (local.get $queue_offset) 
                        (local.get $event_type)
                    )
                    (return)
                ) 
            )

            (local.set $queue_offset
                (i32.add (local.get $queue_offset) (global.get $BYTES_PER_EMITTED_EVENTS))
            )

            (br_if $for_each_queue_slot 
                (local.tee $queue_length
                    (i32.sub 
                        (local.get $queue_length) 
                        (i32.const 1)
                    )
                ) 
            )
        )

        (unreachable)
    )

    (func $event_manager.listen<i32.fun>i32
        (param $event_type i32)
        (param $event_handler funcref)
        (result i32)

        (local $handler_index i32)
        (local $listener_index i32)
        (local $listener_offset i32)

        (local.set $handler_index   (table.grow $event_manager.listener_handlers<fun> (local.get $event_handler) (i32.const 1)))
        (local.set $listener_index  (call $event_manager.new_listener_index<>i32))
        (local.set $listener_offset (call $event_manager.new_listener_offset<>i32))

        (call $event_listener.set_listener_index<i32.i32>   (local.get $listener_offset) (local.get $listener_index))
        (call $event_listener.set_event_type<i32.i32>       (local.get $listener_offset) (local.get $event_type))
        (call $event_listener.set_handler_index<i32.i32>    (local.get $listener_offset) (local.get $handler_index))

        (local.get $listener_offset)
    )

    (func $event_manager.dispatch<i32.i32>
        (param $event_type i32)
        (param $event_ptr* i32)

        (local $handler_index   i32)
        (local $listener_count  i32)
        (local $listener_offset i32)
        (local $max_call_count  i32)
        (local $is_max_reached  i32)

        (local.set $listener_count (call $event_manager.get_listener_count<>i32))
        (local.set $listener_offset (global.get $OFFSET_EVENT_LISTENERS))

        (loop $for_each_listener
            (if (i32.eq
                    (local.get $event_type)
                    (call $event_listener.get_event_type<i32>i32 (local.get $listener_offset))
                )
                (then
                    (if (local.tee $max_call_count
                            (call $event_listener.get_max_call_count<i32>i32 
                                (local.get $listener_offset)
                            )
                        )
                        (then
                            (local.set $is_max_reached
                                (i32.le_u 
                                    (local.get $max_call_count)
                                    (call $event_listener.add_handle_count<i32>i32
                                        (local.get $listener_offset)
                                    )
                                )
                            )
                        )
                    )

                    (if (i32.eqz (local.get $is_max_reached))
                        (then 
                            (local.set $handler_index
                                (call $event_listener.get_handler_index<i32>i32
                                    (local.get $listener_offset)
                                )
                            )

                            (call_indirect $event_manager.listener_handlers<fun> (param i32)
                                (local.get $event_ptr*)
                                (local.get $handler_index)
                            )
                        )
                        (else
                            (call $event_listener.del_event_type<i32>
                                (local.get $listener_offset)
                            )
                        )
                    )
                )
            )

            (local.set $listener_offset
                (i32.add
                    (local.get $listener_offset)
                    (global.get $BYTES_PER_EVENT_LISTENER)
                )
            )

            (br_if $for_each_listener 
                (local.tee $listener_count
                    (i32.sub 
                        (local.get $listener_count) 
                        (i32.const 1)
                    )
                ) 
            )
        )
    )

    (func $event_manager.hanlde_for_each_tick<>
    )

    (func $event_manager.hanlde_for_each_frame<>
    )

    (func $event_manager.hanlde_for_each_second<>
    )

    (func $event_manager.new_listener_index<>i32        (result i32) (i32.atomic.rmw.add offset=4 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.get_listener_count<>i32        (result i32) (i32.load offset=4 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_listener_count<i32>        (param i32) (i32.store offset=4 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

    (func $event_manager.new_listener_offset<>i32       (result i32) (i32.atomic.rmw.add offset=8 (global.get $OFFSET_EVENT_MANAGER) (global.get $BYTES_PER_EVENT_LISTENER)))
    (func $event_manager.get_listener_length<>i32       (result i32) (i32.load offset=8 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_listener_length<i32>       (param i32) (i32.store offset=8 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

    (func $event_manager.get_cycle_listener_ptr<>i32    (result i32) (i32.load offset=12 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_cycle_listener_ptr<i32>    (param i32) (i32.store offset=12 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

    (func $event_manager.add_queued_event_emits<>i32    (result i32) (i32.atomic.rmw.add offset=16 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.get_queued_event_emits<>i32    (result i32) (i32.load offset=16 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_queued_event_emits<i32>    (param i32) (i32.store offset=16 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.sub_queued_event_emits<>i32    (result i32) (i32.atomic.rmw.sub offset=16 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))

    (func $event_queue.get_event_type<i32>i32           (param i32) (result i32) (i32.load offset=0 (local.get 0)))
    (func $event_queue.set_event_type<i32.i32>          (param i32 i32) (i32.store offset=0 (local.get 0) (local.get 1)))

    (func $event_queue.consume_emitted_event<i32>i32    (param i32) (result i32) (i32.atomic.rmw.xchg offset=4 (local.get 0) (i32.const 0)))
    (func $event_queue.try_write_emitted<i32.i32>i32    (param i32 i32) (result i32) (i32.eqz (i32.atomic.rmw.cmpxchg offset=4 (local.get 0) (i32.const 0) (local.get 1))))
    (func $event_queue.get_event_offset<i32>i32         (param i32) (result i32) (i32.load offset=4 (local.get 0)))
    (func $event_queue.set_event_offset<i32.i32>        (param i32 i32) (i32.store offset=4 (local.get 0) (local.get 1)))

    (func $event_listener.get_listener_index<i32>i32    (param i32) (result i32) (i32.load offset=0 (local.get 0)))
    (func $event_listener.set_listener_index<i32.i32>   (param i32 i32) (i32.store offset=0 (local.get 0) (local.get 1)))

    (func $event_listener.get_handler_index<i32>i32     (param i32) (result i32) (i32.load offset=4 (local.get 0)))
    (func $event_listener.set_handler_index<i32.i32>    (param i32 i32) (i32.store offset=4 (local.get 0) (local.get 1)))

    (func $event_listener.get_event_type<i32>i32        (param i32) (result i32) (i32.load offset=8 (local.get 0)))
    (func $event_listener.set_event_type<i32.i32>       (param i32 i32) (i32.store offset=8 (local.get 0) (local.get 1)))
    (func $event_listener.del_event_type<i32>           (param i32) (i32.store offset=8 (local.get 0) (i32.const 0)))

    (func $event_listener.get_max_call_count<i32>i32    (param i32) (result i32) (i32.load offset=12 (local.get 0)))
    (func $event_listener.set_max_call_count<i32.i32>   (param i32 i32) (i32.store offset=12 (local.get 0) (local.get 1)))
    (func $event_listener.set_only_once_true<i32>       (param i32) (call $event_listener.set_max_call_count<i32.i32> (local.get 0) (i32.const 1)))

    (func $event_listener.get_handle_count<i32>i32      (param i32) (result i32) (i32.load offset=16 (local.get 0)))
    (func $event_listener.set_handle_count<i32.i32>     (param i32 i32) (i32.store offset=16 (local.get 0) (local.get 1)))
    (func $event_listener.add_handle_count<i32>i32      (param i32) (result i32) (i32.atomic.rmw.add offset=16 (local.get 0) (i32.const 1)))
