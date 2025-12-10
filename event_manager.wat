
    (global $LENGTH_EVENT_MANAGER i32 i32(64))
    (global $LENGTH_EVENT_HEADERS i32 i32(32))

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

    (func $new_event_manager
        (call $event_manager.listen_closing_events<>)
        (call $event_manager.listen_visibility_change<>)
        (call $event_manager.listen_focus_events<>)
        (call $event_manager.listen_page_state_changes<>)
        (call $event_manager.listen_document_freezer<>)
        (call $event_manager.listen_pointer_condition<>)
    )

    (func $event_manager.dispatch<i32>
        (param $event_type i32)

        (warn<ref.i32>
            text('dispatched event type:')
            local($event_type)
        )
    )

    (func $event_manager.listen_document_freezer<>
        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.document) 
            (param 
                text('freeze') 
                func($event_manager.handle_document_freeze<>)
            )
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.document) 
            (param 
                text('freeze') 
                func($event_manager.handle_document_freeze<>)
            )
        )
    )

    (func $event_manager.handle_document_freeze<>
        (log<ref> text('on document freeze'))
    )

    (func $event_manager.handle_document_resume<>
        (log<ref> text('on document resume'))
    )



    (func $event_manager.listen_pointer_condition<>
        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerover') 
                func($event_manager.handle_pointer_over<>)
            )
        )
    )

    (func $event_manager.handle_pointer_out<>
        (apply $self.EventTarget:removeEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerout') 
                func($event_manager.handle_pointer_out<>)
            )
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerover') 
                func($event_manager.handle_pointer_over<>)
            )
        )

        (log<ref> text('onpointerout'))
    )

    (func $event_manager.handle_pointer_over<>
        (apply $self.EventTarget:removeEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerover') 
                func($event_manager.handle_pointer_over<>)
            )
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window)
            (param 
                text('pointerout') 
                func($event_manager.handle_pointer_out<>)
            )
        )

        (log<ref> text('onpointerover'))
    )

    (func $event_manager.document_was_discarded<>i32
        (result $wasDiscarded i32)

        (apply $self.Document:wasDiscarded/get<>i32
            (global.get $self.document) (param)
        )
    )



    (; works like a charm, dispatches at keystones ;)
    (func $event_manager.listen_visibility_change<>
        (call $event_manager.handle_visibility_change<>)

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.document) 
            (param text('visibilitychange') func($event_manager.handle_visibility_change<>))
        )
    )    

    (func $event_manager.handle_visibility_change<>
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
            (then (call $event_manager.handle_visibility_visible<>) return)
        )

        (global.get $VISIBILITY_STATE_HIDDEN)
        (if (i32.eq (local.get $visibilityState<i32>))
            (then (call $event_manager.handle_visibility_hidden<>) return)
        )

        (global.get $VISIBILITY_STATE_PRERENDER)
        (if (i32.eq (local.get $visibilityState<i32>))
            (then (call $event_manager.handle_visibility_prerender<>) return)
        )
    )

    (func $event_manager.handle_visibility_visible<>
        (call $event_manager.new_visibility_state<i32> (global.get $VISIBILITY_STATE_VISIBLE))
        (call $event_manager.set_visibility_state_visible<>)
        (call $event_manager.handle_cycle_type_rendering<>)
        (log<ref> text('visibility is visible now'))
    )

    (func $event_manager.handle_visibility_hidden<>
        (call $event_manager.new_visibility_state<i32> (global.get $VISIBILITY_STATE_HIDDEN))
        (call $event_manager.set_visibility_state_hidden<>)
        (call $event_manager.handle_cycle_type_next_tick<>)
        (log<ref> text('visibility is hidden now'))
    )

    (func $event_manager.handle_visibility_prerender<>
        (call $event_manager.new_visibility_state<i32> (global.get $VISIBILITY_STATE_PRERENDER))
        (call $event_manager.set_visibility_state_prerender<>)
        (log<ref> text('visibility is pre-render now'))
    )


    (func $event_manager.new_visibility_state<i32>          (param i32) (i32.store  offset=0 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_visibility_state<i32>          (param i32) (i32.store8 offset=0 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_visibility_is_hidden<i32>      (param i32) (i32.store8 offset=1 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_visibility_is_visible<i32>     (param i32) (i32.store8 offset=2 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_visibility_is_prerender<i32>   (param i32) (i32.store8 offset=3 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.get_visibility_state<>i32          (result i32) (i32.load8_u offset=0 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_visibility_is_hidden<>i32      (result i32) (i32.load8_u offset=1 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_visibility_is_visible<>i32     (result i32) (i32.load8_u offset=2 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_visibility_is_prerender<>i32   (result i32) (i32.load8_u offset=3 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_visibility_state_hidden<>      (i32.store8 offset=1 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_visibility_state_visible<>     (i32.store8 offset=2 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_visibility_state_prerender<>   (i32.store8 offset=3 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))


    (; dispatches when only page has at least one click ;)
    (func $event_manager.listen_focus_events<>
        (if (apply $self.Document:hasFocus<>i32
                (global.get $self.document) (param)
            )
            (then (call $event_manager.handle_focus_focused<>))
            (else (call $event_manager.handle_focus_preactive<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('focus') func($event_manager.handle_focus_focused<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('blur') func($event_manager.handle_focus_blurred<>))
        )
    )

    (func $event_manager.handle_focus_blurred<>
        (call $event_manager.new_focus_state<i32> (global.get $FOCUS_STATE_BLURRED))
        (call $event_manager.set_focus_state_blurred<>)
        (log<ref> text('page focus is blurred now'))
    )

    (func $event_manager.handle_focus_focused<>
        (call $event_manager.new_focus_state<i32> (global.get $FOCUS_STATE_FOCUSED))
        (call $event_manager.set_focus_state_focused<>)
        (log<ref> text('page focus is focused now'))
    )

    (func $event_manager.handle_focus_preactive<>
        (call $event_manager.new_focus_state<i32> (global.get $FOCUS_STATE_PREACTIVE))
        (call $event_manager.set_focus_state_preactive<>)
        (log<ref> text('page focus is pre-active now'))
    )

    (func $event_manager.new_focus_state<i32>               (param i32) (i32.store  offset=4 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_focus_state<i32>               (param i32) (i32.store8 offset=4 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_focus_is_focused<i32>          (param i32) (i32.store8 offset=5 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_focus_is_blurred<i32>          (param i32) (i32.store8 offset=6 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_focus_is_preactive<i32>        (param i32) (i32.store8 offset=7 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.get_focus_state<>i32               (result i32) (i32.load8_u offset=4 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_focus_is_focused<>i32          (result i32) (i32.load8_u offset=5 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_focus_is_blurred<>i32          (result i32) (i32.load8_u offset=6 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_focus_is_preactive<>i32        (result i32) (i32.load8_u offset=7 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_focus_state_focused<>          (i32.store8 offset=5 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_focus_state_blurred<>          (i32.store8 offset=6 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_focus_state_preactive<>        (i32.store8 offset=7 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))



    (; dispatches when only navigation changes ;)
    (func $event_manager.listen_page_state_changes<>
        (if (apply $self.Document:hidden/get<>i32
                (global.get $self.document) (param)
            )
            (then (call $event_manager.handle_page_hide<>))
            (else (call $event_manager.handle_page_show<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pageshow') func($event_manager.handle_page_show<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pagehide') func($event_manager.handle_page_hide<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pageswap') func($event_manager.handle_page_swap<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('pagereveal') func($event_manager.handle_page_reveal<>))
        )
    )

    (func $event_manager.handle_page_state_change<>
        (if (apply $self.Document:hidden/get<>i32
                (global.get $self.document) (param)
            )
            (then 
                (if (call $event_manager.get_page_is_shown<>i32)
                    (then (call $event_manager.set_page_state_hided<>))
                )
            )
            (else 
                (if (call $event_manager.get_page_is_hided<>i32)
                    (then (call $event_manager.set_page_state_shown<>))
                )
            )
        )
    )

    (func $event_manager.handle_page_show<>
        (call $event_manager.new_page_state<i32> (global.get $PAGE_STATE_SHOWN))
        (call $event_manager.set_page_state_event<i32> (global.get $PAGE_EVENT_SHOW))
        (call $event_manager.set_page_state_shown<>)
        (log<ref> text('page has shown now'))
    )

    (func $event_manager.handle_page_hide<>
        (call $event_manager.new_page_state<i32> (global.get $PAGE_STATE_HIDED))
        (call $event_manager.set_page_state_event<i32> (global.get $PAGE_EVENT_HIDE))
        (call $event_manager.set_page_state_hided<>)
        (log<ref> text('page has hided now'))
    )

    (func $event_manager.handle_page_swap<>
        (call $event_manager.set_page_state_event<i32> (global.get $PAGE_EVENT_SWAP))
        (call $event_manager.handle_page_state_change<>)
        (warn<ref> text('page hided with swap'))
    )

    (func $event_manager.handle_page_reveal<>
        (call $event_manager.set_page_state_event<i32> (global.get $PAGE_EVENT_REVEAL))
        (call $event_manager.handle_page_state_change<>)
        (warn<ref> text('page shown with reveal'))
    )

    (func $event_manager.new_page_state<i32>                (param i32) (i32.store  offset=8  (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_page_state<i32>                (param i32) (i32.store8 offset=8  (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_page_is_hided<i32>             (param i32) (i32.store8 offset=9  (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_page_is_shown<i32>             (param i32) (i32.store8 offset=10 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_page_state_event<i32>          (param i32) (i32.store8 offset=11 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.get_page_state<>i32                (result i32) (i32.load8_u offset=8  (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_page_is_hided<>i32             (result i32) (i32.load8_u offset=9  (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_page_is_shown<>i32             (result i32) (i32.load8_u offset=10 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_page_state_event<>i32          (result i32) (i32.load8_u offset=11 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_page_state_hided<>             (i32.store8 offset=9  (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_page_state_shown<>             (i32.store8 offset=10 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))



    (func $event_manager.listen_closing_events<>
        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('beforeunload') func($event_manager.handle_unload_before<>))
        )

        (apply $self.EventTarget:addEventListener<ref.fun> 
            (global.get $self.window) 
            (param text('unload') func($event_manager.handle_unload_closed<>))
        )

        (call $event_manager.handle_unload_waiting<>)
    )

    (func $event_manager.handle_unload_waiting<>
        (call $event_manager.new_unload_state<i32> (global.get $UNLOAD_STATE_WAITING))
        (call $event_manager.set_unload_state_waiting<>)
        (log<ref> text('unload state is waiting'))
    )

    (func $event_manager.handle_unload_before<>
        (call $event_manager.new_unload_state<i32> (global.get $UNLOAD_STATE_BEFORE))
        (call $event_manager.set_unload_state_before<>)
        (log<ref> text('unload state is before unload'))
    )

    (func $event_manager.handle_unload_closed<>
        (call $event_manager.new_unload_state<i32> (global.get $UNLOAD_STATE_CLOSED))
        (call $event_manager.set_unload_state_closed<>)
        (log<ref> text('unload state is closed now'))
    )

    (func $event_manager.new_unload_state<i32>              (param i32) (i32.store  offset=12 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_unload_state<i32>              (param i32) (i32.store8 offset=12 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_unload_is_before<i32>          (param i32) (i32.store8 offset=13 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_unload_is_closed<i32>          (param i32) (i32.store8 offset=14 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_unload_is_waiting<i32>         (param i32) (i32.store8 offset=15 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.get_unload_state<>i32              (result i32) (i32.load8_u offset=12 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_unload_is_before<>i32          (result i32) (i32.load8_u offset=13 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_unload_is_closed<>i32          (result i32) (i32.load8_u offset=14 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_unload_is_waiting<>i32         (result i32) (i32.load8_u offset=15 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_unload_state_before<>          (i32.store8 offset=13 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_unload_state_closed<>          (i32.store8 offset=14 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_unload_state_waiting<>         (i32.store8 offset=15 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))




    (func $event_manager.handle_cycle<>
        (local $epoch i32)
        (local $count i32)

        (local.set $count (call $event_manager.get_cycle_count<>i32))
        
        (if (i32.ge_u (global.get $CYCLE_RESET_TRESHOLD) (local.get $count))
            (then                
                (local.set $epoch (call $self.performance.now<>i32))

                (call $event_manager.set_cycle_cps<i32>
                    (i32.div_u
                        (i32.sub (local.get $epoch) (call $event_manager.get_cycle_last_epoch<>i32))
                        (local.get $count)
                    )
                )

                (call $event_manager.set_cycle_count<i32> (i32.const 0))
                (call $event_manager.set_cycle_last_epoch<i32> (local.get $epoch))
            )
        )
    )

    (func $event_manager.cancel_rendering_cycle<>
        (call $self.cancelAnimationFrame<i32>
            (call $event_manager.get_cycle_last_rendering_id<>i32)
        )
    )

    (func $event_manager.cancel_next_tick_cycle<>
        (call $self.cancelIdleCallback<i32>
            (call $event_manager.get_cycle_last_next_tick_id<>i32)
        )
    )

    (func $event_manager.listen_next_tick_cycle<ref>
        (param $idle ref)

        (call $event_manager.add_next_tick_cycle<>)
        (call $event_manager.set_cycle_last_next_tick_id<i32>
            (call $self.requestIdleCallback<fun>i32
                func($event_manager.listen_next_tick_cycle<ref>)
            )
        )
        (call $event_manager.handle_cycle<>)
    )

    (func $event_manager.listen_rendering_cycle<i32>
        (param $pnow i32)
        
        (call $event_manager.add_rendering_cycle<>)
        (call $event_manager.set_cycle_last_rendering_id<i32>
            (call $self.requestAnimationFrame<fun>i32
                func($event_manager.listen_rendering_cycle<i32>)
            )
        )
        (call $event_manager.handle_cycle<>)
    )

    (func $event_manager.handle_cycle_type_next_tick<>
        (if (i32.eqz (call $event_manager.get_cycle_is_next_tick<>i32))
            (then
                (call $event_manager.new_cycle_type<i32> (global.get $CYCLE_TYPE_NEXT_TICK))
                (call $event_manager.set_cycle_type_next_tick<>)

                (call $event_manager.cancel_rendering_cycle<>)
                (call $event_manager.listen_next_tick_cycle<ref> null)

                (call $event_manager.dump_cycle_stats<>)
            )
        )
    )

    (func $event_manager.handle_cycle_type_rendering<>
        (if (i32.eqz (call $event_manager.get_cycle_is_rendering<>i32))
            (then
                (call $event_manager.new_cycle_type<i32> (global.get $CYCLE_TYPE_RENDERING))
                (call $event_manager.set_cycle_type_rendering<>)
                
                (call $event_manager.cancel_next_tick_cycle<>)
                (call $event_manager.listen_rendering_cycle<i32> (call $self.performance.now<>i32))
            )
        )
    )

    (func $event_manager.dump_cycle_stats<> (export "dumpcycle")
        (warn<ref.ref.i32.ref.i32.ref.i32.ref.i32> 
            (text 'cycle switched to next tick')
            (text 'rendered frames:') (call $event_manager.get_cycle_frame_count<>i32)
            (text 'callback cycles:') (call $event_manager.get_cycle_tick_count<>i32)
            (text 'total cycle count:') (call $event_manager.get_cycle_count<>i32)
            (text 'cycles per second:') (call $event_manager.get_cycle_cps<>i32)
        )
    )

    (func $event_manager.new_cycle_type<i32>              (param i32) (i32.store  offset=16 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_type<i32>              (param i32) (i32.store8 offset=16 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_is_next_tick<i32>       (param i32) (i32.store8 offset=17 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_is_rendering<i32>       (param i32) (i32.store8 offset=18 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_is_timeout<i32>         (param i32) (i32.store8 offset=19 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.get_cycle_type<>i32              (result i32) (i32.load8_u offset=16 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_is_next_tick<>i32       (result i32) (i32.load8_u offset=17 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_is_rendering<>i32       (result i32) (i32.load8_u offset=18 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_is_timeout<>i32         (result i32) (i32.load8_u offset=19 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_cycle_type_next_tick<>       (i32.store8 offset=17 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_cycle_type_rendering<>       (i32.store8 offset=18 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
    (func $event_manager.set_cycle_type_timeout<>         (i32.store8 offset=19 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))

    (func $event_manager.get_cycle_last_rendering_id<>i32  (result i32) (i32.load offset=20 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_last_next_tick_id<>i32  (result i32) (i32.load offset=24 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_last_epoch<>i32         (result i32) (i32.load offset=28 (global.get $OFFSET_EVENT_MANAGER)))

    (func $event_manager.set_cycle_last_rendering_id<i32>  (param i32) (i32.store offset=20 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_last_next_tick_id<i32>  (param i32) (i32.store offset=24 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_last_epoch<i32>         (param i32) (i32.store offset=28 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_last_epoch_pnow<>       (call $event_manager.set_cycle_last_epoch<i32> (call $self.performance.now<>i32)))
 
    (func $event_manager.get_cycle_frame_count<>i32        (result i32) (i32.load offset=32 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_tick_count<>i32         (result i32) (i32.load offset=36 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_count<>i32              (result i32) (i32.load offset=40 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.get_cycle_cps<>i32                (result i32) (i32.load offset=44 (global.get $OFFSET_EVENT_MANAGER)))

    (func $event_manager.set_cycle_frame_count<i32>        (param i32) (i32.store offset=32 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_tick_count<i32>         (param i32) (i32.store offset=36 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_count<i32>              (param i32) (i32.store offset=40 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))
    (func $event_manager.set_cycle_cps<i32>                (param i32) (i32.store offset=44 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

    (func $event_manager.add_rendering_cycle<> 
        (v128.store offset=32 (global.get $OFFSET_EVENT_MANAGER) 
            (i32x4.add (v128.load offset=32 (global.get $OFFSET_EVENT_MANAGER)) (v128.const i32x4 1 0 1 0))
        )
    )

    (func $event_manager.add_next_tick_cycle<> 
        (v128.store offset=32 (global.get $OFFSET_EVENT_MANAGER) 
            (i32x4.add (v128.load offset=32 (global.get $OFFSET_EVENT_MANAGER)) (v128.const i32x4 0 1 1 0))
        )
    )


    (func $event_manager.get_document_was_discarded<>i32    (result i32) (i32.load8_u offset=20 (global.get $OFFSET_EVENT_MANAGER)))
    (func $event_manager.set_document_was_discarded<i32>    (param i32) (i32.store8 offset=20 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))