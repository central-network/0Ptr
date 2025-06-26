

    (func   $wasm.preventDefault                                                                               (type $ext->)
        call($self.Reflect.apply<ext3> self.Event.prototype.preventDefault $0 [])
    )

    (func   $wasm.onerror                                                                                      (type $ext->)
        fail("system error.")
    )
    
    (func   $wasm.onevent                                                                                      (type $ext->)
        [*ui (ui*) eventId] +1
        [*ui (ui*) ctrlKey   $0[ 'ctrlKey' bu8 ]]
        [*ui (ui*) metaKey   $0[ 'metaKey' bu8 ]]
        [*ui (ui*) altKey    $0[ 'altKey' bu8 ]]
        [*ui (ui*) shiftKey  $0[ 'shiftKey' bu8 ]]

        call($wasm.preventDefault $0)
        ;; warn("Event prevent defaulted")
    )

    (func   $wasm.onpointerevent                                                                               (type $ext->)
        local($x f32)
        local($y f32)

        call($wasm.onevent $0)

        [*ui (ui*) screenX   $0[ 'screenX' f32 ]]
        [*ui (ui*) screenY   $0[ 'screenY' f32 ]]    
        [*ui (ui*) movementX $0[ 'movementX' i8 ]]
        [*ui (ui*) movementY $0[ 'movementY' i8 ]]   
        [*ui (ui*) clientX   local(tee $x $0[ 'clientX' f32 ])]
        [*ui (ui*) clientY   local(tee $y $0[ 'clientY' f32 ])]

        [*ui (ui*) x local(tee $x (f32.div (f32.sub local($x) local(tee $x [*screen (screen*) halfInnerWidth])) local($x)))]
        [*ui (ui*) y local(tee $y (f32.div (f32.add local($y) local(tee $y [*screen (screen*) halfInnerHeight-])) local($y)))]

        (block $w
            (if (f32.lt local($x) f32(-1)) (then [*ui (ui*) w f32(0)] br $w))
            (if (f32.lt local($y) f32(-1)) (then [*ui (ui*) w f32(0)] br $w))
            (if (f32.gt local($x)  f32(1)) (then [*ui (ui*) w f32(0)] br $w))
            (if (f32.gt local($y)  f32(1)) (then [*ui (ui*) w f32(0)] br $w))

            [*ui (ui*) w f32(1)]
        )
    )

    (func   $wasm.onwheel                                                                                      (type $ext->)
        local($deltaX<f32> f32)
        local($deltaY<f32> f32)
        local($deltaY<i32> i32)

        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_WHEEL]

        local(set $deltaX<f32> $0[ 'deltaX' f32 ])
        local(set $deltaY<f32> $0[ 'deltaY' f32 ])
        local(set $deltaY<i32> $0[ 'deltaY' i32 ])

        (if (f32.eq local($deltaY<f32>) f32(0)) (then 
        (if (f32.eq local($deltaX<f32>) f32(0)) (then return))))

        (if (f32.ne local($deltaY<f32>) (f32.convert_i32_s local($deltaY<i32>))) 
            (then 
                ;; y<f32> 0.0000 - pinching
                return
            )
        )

        local(set $deltaX<f32> (f32.add [*ui (ui*) deltaX] local($deltaX<f32>)))
        local(set $deltaY<f32> (f32.add [*ui (ui*) deltaY] local($deltaY<f32>)))

        [*ui (ui*) deltaX local($deltaX<f32>)]
        [*ui (ui*) deltaY local($deltaY<f32>)]

        <--
        [*ui (ui*) z (f32.div [*ui (ui*) deltaY] f32(500))]
        -->

        [*ui (ui*) z f32(-0.00001)]
    )

    (func   $wasm.onpointermove                                                                                (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_POINTER_MOVE]
    )

    (func   $wasm.onpointerdown                                                                                (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_POINTER_DOWN]
    )

    (func   $wasm.onpointerout                                                                                 (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_POINTER_OUT]
    )

    (func   $wasm.onpointerup                                                                                  (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_POINTER_UP]
    )

    (func   $wasm.onclickprimary                                                                               (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_CLICK_PRIMARY]
    )

    (func   $wasm.onclicksecondary                                                                             (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_CLICK_SECONDARY]
    )

    (func   $wasm.onclickdobule                                                                                (type $ext->)
        call($wasm.onpointerevent $0)
        [*ui (ui*) eventType EVENT_CLICK_DOUBLE]
    )

    (func   $wasm.onkeyevent                                                                                   (type $ext->)
        call($wasm.onevent $0)
        [*ui (ui*) repeat $0[ 'repeat' bu8 ]]    
        [*ui (ui*) isComposing $0[ 'isComposing' bu8 ]]  
    )

    (func   $wasm.onkeyup                                                                                      (type $ext->)
        (local $keyCode i32)
        
        (call $wasm.onkeyevent $0)
        (lset $keyCode $0[ 'keyCode' i8 ])
        
        [*ui (ui*) eventType EVENT_KEYUP]
        
        (block
            (if i32(eq $1 KEYCODE_BACKSPACE)  (then [*ui (ui*) backspaceKey (false)] return))
            (if i32(eq $1 KEYCODE_SPACE)      (then [*ui (ui*) spaceKey (false)] return))
            (if i32(eq $1 KEYCODE_RIGHT)      (then [*ui (ui*) leftKey (false)] return))
            (if i32(eq $1 KEYCODE_DOWN)       (then [*ui (ui*) downKey (false)] return))
            (if i32(eq $1 KEYCODE_LEFT)       (then [*ui (ui*) upKey (false)] return))
            (if i32(eq $1 KEYCODE_ESC)        (then [*ui (ui*) escKey (false)] return))
            (if i32(eq $1 KEYCODE_UP)         (then [*ui (ui*) rightKey (false)] return))
            (if i32(eq $1 KEYCODE_TAB)        (then [*ui (ui*) tabKey (false)] return))
            (if i32(eq $1 KEYCODE_ENTER)      (then [*ui (ui*) enterKey (false)] return))
            (if i32(eq $1 KEYCODE_CAPSLOCK)   (then [*ui (ui*) capsLockKey (false)] return))
        )

        (if (i32.lt_u $1 i32(48)) (then return))
        (if (i32.gt_u $1 i32(90)) (then return))

        setUint8( i32(sum $1 [*ui (ui*) &]) (false) )
    )

    (func   $wasm.onkeydown                                                                                    (type $ext->)
        (local $keyCode i32)
        
        (call $wasm.onkeyevent $0)
        (lset $keyCode $0[ 'keyCode' i8 ])

        [*ui (ui*) eventType EVENT_KEYDOWN]

        (block
            (if i32(eq $1 KEYCODE_BACKSPACE)  (then [*ui (ui*) backspaceKey (true)] return))
            (if i32(eq $1 KEYCODE_SPACE)      (then [*ui (ui*) spaceKey (true)] return))
            (if i32(eq $1 KEYCODE_LEFT)       (then [*ui (ui*) upKey (true)] return))
            (if i32(eq $1 KEYCODE_RIGHT)      (then [*ui (ui*) leftKey (true)] return))
            (if i32(eq $1 KEYCODE_DOWN)       (then [*ui (ui*) downKey (true)] return))
            (if i32(eq $1 KEYCODE_ESC)        (then [*ui (ui*) escKey (true)] return))
            (if i32(eq $1 KEYCODE_TAB)        (then [*ui (ui*) tabKey (true)] return))
            (if i32(eq $1 KEYCODE_UP)         (then [*ui (ui*) rightKey (true)] return))
            (if i32(eq $1 KEYCODE_ENTER)      (then [*ui (ui*) enterKey (true)] return))
            (if i32(eq $1 KEYCODE_CAPSLOCK)   (then [*ui (ui*) capsLockKey (true)] return))
        )

        (if (i32.lt_u $1 i32(48)) (then return))
        (if (i32.gt_u $1 i32(90)) (then return))

        setUint8( i32(sum $0[ 'keyCode' i8 ] [*ui (ui*) &]) (true) )
    )

    (func   $wasm.ondragdropevent                                                                              (type $ext->)        
        call($wasm.onpointerevent $0)
    )

    (func   $wasm.ondragover                                                                                   (type $ext->)
        call($wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DRAGOVER]
      ;;warn("UI Dragging..")
    )

    (func   $wasm.ondragend                                                                                    (type $ext->)
        call($wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DRAGEND]
      ;;warn("UI Drag event ended.")
    )

    (func   $wasm.ondragstart                                                                                  (type $ext->)
        call($wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DRAGSTART]
      ;;warn("UI Drag event started.")

    )

    (func   $wasm.ondragleave                                                                                  (type $ext->)
        call($wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DRAGLEAVE]
      ;;warn("UI Drag leaved.")
    )

    (func   $wasm.ondragenter                                                                                  (type $ext->)
        (call $wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DRAGENTER]    
      ;;warn("UI Drag event begins.")   
    )

    (func   $wasm.ondrag                                                                                       (type $ext->)
        call($wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DRAG]
      ;;warn("UI Drag event.")   
    )

    (func   $wasm.ondrop                                                                                       (type $ext->)
        call($wasm.ondragdropevent $0)
        [*ui (ui*) eventType EVENT_DROP]
      ;;warn("UI Dropped.")   
        call($wasm.externDataTransfer $0)
    )





