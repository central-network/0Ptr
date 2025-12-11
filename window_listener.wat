

    (global $OFFSET_WINDOW_LISTENER mut i32)
    (global $LENGTH_WINDOW_LISTENER i32 i32(64))


    (global $self.window                        externref)
    (global $self.document                      externref)
    (global $self.navigator.wakeLock            externref)
    (global $self.navigator.userActivation      externref)

    (global $self.WakeLock                      externref)
    (global $self.WakeLockSentinel              externref)
    (global $self.UserActivation                externref)

    (global $VISIBILITY_STATE_HIDDEN     i32 (charcode 'h'))
    (global $VISIBILITY_STATE_VISIBLE    i32 (charcode 'v'))
    (global $VISIBILITY_STATE_PRERENDER  i32 (charcode 'p'))

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

    (global $window_listener.second_counter mut i32)

    (func $new_window_listener
        (result $this* i32)

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
        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerover') 
                func($window_listener.handle_pointer_over<>)
            )
        )
    )

    (func $window_listener.handle_pointer_out<>
        (apply $self.EventTarget:removeEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerout') 
                func($window_listener.handle_pointer_out<>)
            )
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerover') 
                func($window_listener.handle_pointer_over<>)
            )
        )

        (log<ref> text('onpointerout'))
    )

    (func $window_listener.handle_pointer_over<>
        (apply $self.EventTarget:removeEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerover') 
                func($window_listener.handle_pointer_over<>)
            )
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerout') 
                func($window_listener.handle_pointer_out<>)
            )
        )

        (log<ref> text('onpointerover'))
    )



    (; works like a charm, dispatches at keystones ;)
    (func $window_listener.listen_visibility_change<>
        (call $window_listener.handle_visibility_change<>)

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.document) 
            (param text('visibilitychange') func($window_listener.handle_visibility_change<>))
        )
    )    

    (func $window_listener.handle_visibility_change<>
        (local $visibilityState<ref> ref)
        (local $visibilityState<i32> i32)

        (local.set $visibilityState<ref>
            ;; visbility state is a property of document
            (apply $self.Document:visibilityState/get<>ref
                (global.get $self.document) (param)
            )
        )

        (local.set $visibilityState<i32>
            ;; first ansi code of char is our type code
            (apply $self.String:charCodeAt<>i32
                (local.get $visibilityState<ref>) (param)
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
        (log<ref> text('visibility is visible now'))
    )

    (func $window_listener.handle_visibility_hidden<>
        (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_HIDDEN))
        (call $window_listener.set_visibility_state_hidden<>)
        (call $window_listener.handle_cycle_type_next_tick<>)
        (log<ref> text('visibility is hidden now'))
    )

    (func $window_listener.handle_visibility_prerender<>
        (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_PRERENDER))
        (call $window_listener.set_visibility_state_prerender<>)
        (log<ref> text('visibility is pre-render now'))
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
        (if (apply $self.Document:hasFocus<>i32
                (global.get $self.document) (param)
            )
            (then (call $window_listener.handle_focus_focused<>))
            (else (call $window_listener.handle_focus_preactive<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('focus') func($window_listener.handle_focus_focused<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('blur') func($window_listener.handle_focus_blurred<>))
        )
    )

    (func $window_listener.handle_focus_blurred<>
        (call $window_listener.new_focus_state<i32> (global.get $FOCUS_STATE_BLURRED))
        (call $window_listener.set_focus_state_blurred<>)
        (log<ref> text('page focus is blurred now'))
    )

    (func $window_listener.handle_focus_focused<>
        (call $window_listener.new_focus_state<i32> (global.get $FOCUS_STATE_FOCUSED))
        (call $window_listener.set_focus_state_focused<>)
        (log<ref> text('page focus is focused now'))
    )

    (func $window_listener.handle_focus_preactive<>
        (call $window_listener.new_focus_state<i32> (global.get $FOCUS_STATE_PREACTIVE))
        (call $window_listener.set_focus_state_preactive<>)
        (log<ref> text('page focus is pre-active now'))
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
        (if (apply $self.Document:hidden/get<>i32
                (global.get $self.document) (param)
            )
            (then (call $window_listener.handle_page_hide<>))
            (else (call $window_listener.handle_page_show<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pageshow') func($window_listener.handle_page_show<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pagehide') func($window_listener.handle_page_hide<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pageswap') func($window_listener.handle_page_swap<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pagereveal') func($window_listener.handle_page_reveal<>))
        )
    )

    (func $window_listener.handle_page_state_change<>
        (if (apply $self.Document:hidden/get<>i32
                (global.get $self.document) (param)
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
        (log<ref> text('page has shown now'))
    )

    (func $window_listener.handle_page_hide<>
        (call $window_listener.new_page_state<i32> (global.get $PAGE_STATE_HIDED))
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_HIDE))
        (call $window_listener.set_page_state_hided<>)
        (log<ref> text('page has hided now'))
    )

    (func $window_listener.handle_page_swap<>
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_SWAP))
        (call $window_listener.handle_page_state_change<>)
        (warn<ref> text('page hided with swap'))
    )

    (func $window_listener.handle_page_reveal<>
        (call $window_listener.set_page_state_event<i32> (global.get $PAGE_EVENT_REVEAL))
        (call $window_listener.handle_page_state_change<>)
        (warn<ref> text('page shown with reveal'))
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
        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('beforeunload') func($window_listener.handle_unload_before<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('unload') func($window_listener.handle_unload_closed<>))
        )

        (call $window_listener.handle_unload_waiting<>)
    )

    (func $window_listener.handle_unload_waiting<>
        (call $window_listener.new_unload_state<i32> (global.get $UNLOAD_STATE_WAITING))
        (call $window_listener.set_unload_state_waiting<>)
        (log<ref> text('unload state is waiting'))
    )

    (func $window_listener.handle_unload_before<>
        (call $window_listener.new_unload_state<i32> (global.get $UNLOAD_STATE_BEFORE))
        (call $window_listener.set_unload_state_before<>)
        (log<ref> text('unload state is before unload'))
    )

    (func $window_listener.handle_unload_closed<>
        (call $window_listener.new_unload_state<i32> (global.get $UNLOAD_STATE_CLOSED))
        (call $window_listener.set_unload_state_closed<>)
        (log<ref> text('unload state is closed now'))
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

        (local.set $epoch_now (call $self.performance.now<>i32))
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
        (param $idle ref)

        (call $window_listener.add_next_tick_cycle<>)
        (call $window_listener.set_cycle_last_next_tick_id<i32>
            (call $self.requestIdleCallback<fun>i32
                func($window_listener.listen_next_tick_cycle<ref>)
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
                func($window_listener.listen_rendering_cycle<i32>)
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
                (call $window_listener.listen_next_tick_cycle<ref> null)

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
                (call $window_listener.listen_rendering_cycle<i32> (call $self.performance.now<>i32))
            )
        )
    )

    (func $window_listener.dump_cycle_stats<> (export "dumpcycle")
        (warn<ref.ref.i32.ref.i32.ref.i32.ref.i32> 
            (text 'cycle switched to next tick')
            (text 'rendered frames:') (call $window_listener.get_cycle_frame_count<>i32)
            (text 'callback cycles:') (call $window_listener.get_cycle_tick_count<>i32)
            (text 'total cycle count:') (call $window_listener.get_cycle_count<>i32)
            (text 'cycles per second:') (call $window_listener.get_cycle_cps<>i32)
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
    (func $window_listener.set_cycle_last_epoch_pnow<>       (call $window_listener.set_cycle_last_epoch<i32> (call $self.performance.now<>i32)))
 
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

