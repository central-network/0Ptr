(module
  (import "self" "self"                  (global $self                               externref))
  (import "self" "Array"                 (func $self.Array<>ref                      (param) (result ref)))
  (import "self" "Object"                (func $self.Object<>ref                     (param) (result ref)))
  (import "self" "Array"                 (func $self.Array<>ext                      (param) (result externref)))
  (import "console" "log"                (func $self.console.log<ref>                (param ref) (result)))
  (import "Array" "of"                   (func $self.Array.of<>ext                   (param) (result externref)))
  (import "console" "warn"               (func $self.console.warn<ref>               (param ref) (result)))
  (import "String" "fromCharCode"        (global $self.String.fromCharCode           externref))
  (import "performance" "now"            (func $self.performance.now<>f32            (param) (result f32)))
  (import "performance" "now"            (func $self.performance.now<>i32            (param) (result i32)))
  (import "Array" "of"                   (func $self.Array.of<ref.i32>ref            (param ref i32) (result ref)))
  (import "Array" "of"                   (func $self.Array.of<ref>ext                (param ref) (result externref)))
  (import "console" "warn"               (func $self.console.warn<ref.i32>           (param ref i32) (result)))
  (import "Reflect" "set"                (func $self.Reflect.set<ref.ref.i32>        (param ref ref i32) (result)))
  (import "Reflect" "set"                (func $self.Reflect.set<ref.ref.ref>        (param ref ref ref) (result)))
  (import "self" "cancelIdleCallback"    (func $self.cancelIdleCallback<i32>         (param i32) (result)))
  (import "Reflect" "set"                (func $self.Reflect.set<ext.i32.i32>        (param externref i32 i32) (result)))
  (import "Array" "of"                   (func $self.Array.of<ref.i32.i32>ext        (param ref i32 i32) (result externref)))
  (import "self" "cancelAnimationFrame"  (func $self.cancelAnimationFrame<i32>       (param i32) (result)))
  (import "WebAssembly" "compile"        (func $self.WebAssembly.compile<ref>ref     (param ref) (result ref)))
  (import "Reflect" "set"                (func $self.Reflect.set<ext.i32.ext>        (param externref i32 externref) (result)))
  (import "Reflect" "get"                (func $self.Reflect.get<ext.ext>ref         (param externref externref) (result ref)))
  (import "WebAssembly" "compile"        (func $self.WebAssembly.compile<ref.ref>ref (param ref ref) (result ref)))
  (import "Reflect" "apply"              (func $self.Reflect.apply<ref.fun.ref>ref   (param ref funcref ref) (result ref)))
  (import "self" "requestIdleCallback"   (func $self.requestIdleCallback<fun>i32     (param funcref) (result i32)))
  (import "Reflect" "get"                (func $self.Reflect.get<ext.ext>ext         (param externref externref) (result externref)))
  (import "self" "requestAnimationFrame" (func $self.requestAnimationFrame<fun>i32   (param funcref) (result i32)))
  (import "Reflect" "get"                (func $self.Reflect.get<ext.ext>ref.i32.i32 (param externref externref) (result ref i32 i32)))
  (import "Reflect" "apply"              (func $self.Reflect.apply<ext.ext.ext>      (param externref externref externref) (result)))
  (import "Reflect" "construct"          (func $self.Reflect.construct<ext.ext>ext   (param externref externref) (result externref)))
  (import "Reflect" "apply"              (func $self.Reflect.apply<ext.ext.ext>ext   (param externref externref externref) (result externref)))


  (memory 100)


  (global $memory                               mut extern)
  (global $buffer                               mut extern)

  (global $ALGIN_BYTELENGTH                     i32 (i32.const 16))
  (global $START_BYTEOFFSET                     i32 (i32.const 1024))
  (global $INITIAL_PAGESIZE                     i32 (i32.const 10))
  (global $MAXIMUM_PAGESIZE                     i32 (i32.const 65535))
  (global $MINIMUM_PAGESIZE                     i32 (i32.const 1))

  (global $BYTES_PER_KILOBYTE                   i32 (i32.const 1024))
  (global $BYTES_PER_NEGABYTE                   i32 (i32.const 1048576))
  (global $BYTES_PER_GIGABYTE                   i32 (i32.const 1073741824))
  (global $BYTES_PER_PAGE                       i32 (i32.const 65536))

  (global $OFFSET_MEMORY_MANAGER                (mut i32) (i32.const 0))
  (global $LENGTH_MEMORY_MANAGER                i32 (i32.const 32))

  (global $OFFSET_MALLOC_LENGTH                 i32 (i32.const 4))
  (global $LENGTH_MALLOC_HEADER                 i32 (i32.const 8))

  (global $self.navigator.deviceMemory          i32)

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
    (local.set $options (call $self.Reflect.construct<ext.ext>ext
        (table.get $wat4wasm (i32.const 4)) ;; $self.self.Object<>ref<ext>

        (call $self.Array.of<>ext)
    ))

    (call $self.Reflect.set<ref.ref.i32> local($options) text('initial') (global.get $INITIAL_PAGESIZE))
    (call $self.Reflect.set<ref.ref.i32> local($options) text('maximum') (global.get $MAXIMUM_PAGESIZE))
    (call $self.Reflect.set<ref.ref.i32> local($options) text('shared')  true)


    (global.set $memory (call $self.Reflect.construct<ext.ext>ext
        (table.get $wat4wasm (i32.const 3)) ;; $self.self.WebAssembly.Memory<ref>ref<ext>

        (call $self.Array.of<ref>ext local($options))
    ))
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
        (call $self.Reflect.apply<ext.ext.ext>  $self.WebAssembly.Memory:grow<i32>i32
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
    (call $self.Reflect.apply<ext.ext.ext>  $self.Array:push<ref> local($values) (param local($item)))

    (local.set $item (call $self.Object<>ref))
    (call $self.Reflect.set<ref.ref.i32> local($item) text('buffer_max_bytelength') (call $memory_manager.get_buffer_max_bytelength<>i32))
    (call $self.Reflect.apply<ext.ext.ext>  $self.Array:push<ref> local($values) (param local($item)))

    (local.set $item (call $self.Object<>ref))
    (call $self.Reflect.set<ref.ref.i32> local($item) text('memory_max_bytelength') (call $memory_manager.get_memory_max_bytelength<>i32))
    (call $self.Reflect.apply<ext.ext.ext>  $self.Array:push<ref> local($values) (param local($item)))

    (local.set $item (call $self.Object<>ref))
    (call $self.Reflect.set<ref.ref.i32> local($item) text('device_memory_bytelength') (call $memory_manager.get_device_memory_bytelength<>i32))
    (call $self.Reflect.apply<ext.ext.ext>  $self.Array:push<ref> local($values) (param local($item)))

    (local.set $item (call $self.Object<>ref))
    (call $self.Reflect.set<ref.ref.i32> local($item) text('memory_current_pagesize') (call $memory_manager.get_memory_current_pagesize<>i32))
    (call $self.Reflect.apply<ext.ext.ext>  $self.Array:push<ref> local($values) (param local($item)))

    (local.set $item (call $self.Object<>ref))
    (call $self.Reflect.set<ref.ref.i32> local($item) text('memory_maximum_pagesize') (call $memory_manager.get_memory_maximum_pagesize<>i32))
    (call $self.Reflect.apply<ext.ext.ext>  $self.Array:push<ref> local($values) (param local($item)))

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
      (call $self.Reflect.construct<ext.ext>ext
        (table.get $wat4wasm (i32.const 2)) ;; $self.self.Uint8Array<ref.i32.i32>ref<ext>

        (call $self.Array.of<ref.i32.i32>ext
          (global.get $buffer)
          (call $get_byteoffset<i32>i32 (local.get $offset))
          (call $get_bytelength<i32>i32 (local.get $offset))
        )
      )
    )

    (local.set $view
      (call $self.Reflect.apply<ext.ext.ext>  $self.Uint8Array:slice<>ref
        (local.get $view) (param)
      )
    )

    (local.set $buffer
      (call $self.Reflect.apply<ext.ext.ext>  $self.TypedArray:buffer/get<>ref
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


  (global $OFFSET_WINDOW_LISTENER               (mut i32) (i32.const 0))
  (global $LENGTH_WINDOW_LISTENER               i32 (i32.const 64))

  (global $self.window                          externref)
  (global $self.document                        externref)
  (global $self.navigator.wakeLock              externref)
  (global $self.navigator.userActivation        externref)

  (global $self.WakeLock                        externref)
  (global $self.WakeLockSentinel                externref)
  (global $self.UserActivation                  externref)

  (global $VISIBILITY_STATE_HIDDEN              i32 (charcode 'h'))
  (global $VISIBILITY_STATE_VISIBLE             i32 (charcode 'v'))
  (global $VISIBILITY_STATE_PRERENDER           i32 (charcode 'p'))

  (global $FOCUS_STATE_BLURRED                  i32 (i32.const 0))
  (global $FOCUS_STATE_FOCUSED                  i32 (i32.const 1))
  (global $FOCUS_STATE_PREACTIVE                i32 (i32.const 2))
  (global $PAGE_EVENT_HIDE                      i32 (i32.const 0))
  (global $PAGE_EVENT_SHOW                      i32 (i32.const 1))
  (global $PAGE_EVENT_REVEAL                    i32 (i32.const 2))
  (global $PAGE_EVENT_SWAP                      i32 (i32.const 3))
  (global $PAGE_STATE_HIDED                     i32 (i32.const 0))
  (global $PAGE_STATE_SHOWN                     i32 (i32.const 1))
  (global $UNLOAD_STATE_WAITING                 i32 (i32.const 1))
  (global $UNLOAD_STATE_CLOSED                  i32 (i32.const 2))
  (global $UNLOAD_STATE_BEFORE                  i32 (i32.const 3))

  (global $CYCLE_TYPE_NEXT_TICK                 i32 (i32.const 1))
  (global $CYCLE_TYPE_RENDERING                 i32 (i32.const 2))
  (global $CYCLE_RESET_TRESHOLD                 i32 (i32.const 600))

  (table $window_listener.listeners_for_each_cycle<fun>   1 65535 funcref)
  (table $window_listener.listeners_for_each_tick<fun>    1 65535 funcref)
  (table $window_listener.listeners_for_each_frame<fun>   1 65535 funcref)
  (table $window_listener.listeners_for_each_second<fun>  1 65535 funcref)
  (table $window_listener.listeners_for_each_tensec<fun>  1 65535 funcref)
  (table $window_listener.listeners_for_each_minute<fun>  1 65535 funcref)

  (global $window_listener.second_counter       (mut i32) (i32.const 0))

  (func $new_window_listener
    (result $this* i32)

    (global.set $OFFSET_WINDOW_LISTENER
      (call $memory_manager.malloc_internal<i32>i32
        (global.get $LENGTH_WINDOW_LISTENER)
      )
    )

    (global.get $OFFSET_WINDOW_LISTENER)
  )

  (func $window_listener.bind_local_global_this<>
    (call $window_listener.listen_closing_events<>)
    (call $window_listener.listen_visibility_change<>)
    (call $window_listener.listen_focus_events<>)
    (call $window_listener.listen_page_state_changes<>)
    (call $window_listener.listen_pointer_condition<>)
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
    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param
        text('pointerover')
        func($window_listener.handle_pointer_over<>)
      )
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param
        text('pointerout')
        func($window_listener.handle_pointer_out<>)
      )
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param
        text('pointermove')
        func($window_listener.handle_pointer_move<ref>)
      )
    )
  )

  (func $window_listener.handle_pointer_out<>
    (param $event externref)
    (local $event_ptr i32)

    (local.set $event_ptr
      (call $event_manager.alloc_event_slot<i32>i32
        (global.get $EVENT_TYPE.ON_POINTER_OUT)
      )
    )

    (call $window_listener.set_shared_pointer_events<ref.i32>
      (local.get $event) (local.get $event_ptr)
    )

    (call $event_manager.emit<i32> (local.get $event_ptr))
  )

  (func $window_listener.handle_pointer_over<>
    (param $event externref)
    (local $event_ptr i32)

    (local.set $event_ptr
      (call $event_manager.alloc_event_slot<i32>i32
        (global.get $EVENT_TYPE.ON_POINTER_OVER)
      )
    )

    (call $window_listener.set_shared_pointer_events<ref.i32>
      (local.get $event) (local.get $event_ptr)
    )

    (call $event_manager.emit<i32> (local.get $event_ptr))
  )

  (func $window_listener.handle_pointer_move<ref>
    (param $event externref)
    (local $event_ptr i32)

    (local.set $event_ptr
      (call $event_manager.alloc_event_slot<i32>i32
        (global.get $EVENT_TYPE.ON_POINTER_MOVE)
      )
    )

    (call $window_listener.set_shared_pointer_events<ref.i32>
      (local.get $event) (local.get $event_ptr)
    )

    (call $event_manager.emit<i32> (local.get $event_ptr))
  )

  (func $window_listener.set_shared_pointer_events<ref.i32>
    (param $event externref)
    (param $event_ptr i32)

    (call $pointer_event.set_epoch<i32.f32>
      (local.get $event_ptr)
      (call $self.performance.now<>f32)
    )

    (call $pointer_event.set_client_x<i32.f32>
      (local.get $event_ptr)
      (call $self.Reflect.apply<ext.ext.ext>  $self.MouseEvent:clientX/get<>f32 (local.get $event) (param))
    )

    (call $pointer_event.set_client_y<i32.f32>
      (local.get $event_ptr)
      (call $self.Reflect.apply<ext.ext.ext>  $self.MouseEvent:clientY/get<>f32 (local.get $event) (param))
    )
  )

  (; works like a charm, dispatches at keystones ;)
  (func $window_listener.listen_visibility_change<>
    (call $window_listener.handle_visibility_change<>)

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.document)
      (param text('visibilitychange') func($window_listener.handle_visibility_change<>))
    )
  )

  (func $window_listener.handle_visibility_change<>
    (local $visibilityState<ref> ref)
    (local $visibilityState<i32> i32)

    (local.set $visibilityState<ref>
      ;; visbility state is a property of document
      (call $self.Reflect.apply<ext.ext.ext>  $self.Document:visibilityState/get<>ref
        (global.get $self.document) (param)
      )
    )

    (local.set $visibilityState<i32>
      ;; first ansi code of char is our type code
      (call $self.Reflect.apply<ext.ext.ext>  $self.String:charCodeAt<>i32
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
    (local $event_ptr i32)

    (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_VISIBLE))
    (call $window_listener.set_visibility_state_visible<>)
    (call $window_listener.handle_cycle_type_rendering<>)

    (local.set $event_ptr
      (call $event_manager.alloc_event_slot<i32>i32
        (global.get $EVENT_TYPE.ON_VISIBILTY_VISIBLE)
      )
    )

    (call $visibility_event.set_epoch<i32.f32>
      (local.get $event_ptr)
      (call $self.performance.now<>f32)
    )

    (call $event_manager.emit<i32>
      (local.get $event_ptr)
    )
  )

  (func $window_listener.handle_visibility_hidden<>
    (local $event_ptr i32)

    (call $window_listener.new_visibility_state<i32> (global.get $VISIBILITY_STATE_HIDDEN))
    (call $window_listener.set_visibility_state_hidden<>)
    (call $window_listener.handle_cycle_type_next_tick<>)

    (local.set $event_ptr
      (call $event_manager.alloc_event_slot<i32>i32
        (global.get $EVENT_TYPE.ON_VISIBILTY_VISIBLE)
      )
    )

    (call $visibility_event.set_epoch<i32.f32>
      (local.get $event_ptr)
      (call $self.performance.now<>f32)
    )

    (call $event_manager.emit<i32>
      (local.get $event_ptr)
    )
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
    (if (call $self.Reflect.apply<ext.ext.ext>  $self.Document:hasFocus<>i32
        (global.get $self.document) (param)
      )
      (then (call $window_listener.handle_focus_focused<>))
      (else (call $window_listener.handle_focus_preactive<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param text('focus') func($window_listener.handle_focus_focused<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
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
    (if (call $self.Reflect.apply<ext.ext.ext>  $self.Document:hidden/get<>i32
        (global.get $self.document) (param)
      )
      (then (call $window_listener.handle_page_hide<>))
      (else (call $window_listener.handle_page_show<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param text('pageshow') func($window_listener.handle_page_show<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param text('pagehide') func($window_listener.handle_page_hide<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param text('pageswap') func($window_listener.handle_page_swap<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param text('pagereveal') func($window_listener.handle_page_reveal<>))
    )
  )

  (func $window_listener.handle_page_state_change<>
    (if (call $self.Reflect.apply<ext.ext.ext>  $self.Document:hidden/get<>i32
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
    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
      (global.get $self.window)
      (param text('beforeunload') func($window_listener.handle_unload_before<>))
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.EventTarget:addEventListener<ref.fun>
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

    (local.set $epoch_now       (call $self.performance.now<>i32))
    (local.set $last_epoch      (call $window_listener.get_cycle_last_epoch<>i32))
    (local.set $elapsed_time    (i32.sub (local.get $epoch_now) (local.get $last_epoch)))

    (if (i32.ge_u (local.get $elapsed_time) (i32.const 1000))
      (then
        (call $window_listener.call_listeners_for_each_second<>)

        (call $window_listener.set_cycle_cps<i32>
          (call $window_listener.get_cycle_count<>i32)
        )

        (call $window_listener.set_cycle_count<i32> (i32.const 0))
        (call $window_listener.set_cycle_last_epoch<i32> (local.get $epoch_now))
      )
    )

    (call $window_listener.call_listeners_for_each_cycle<>)

    (global.get $CYCLE_TYPE_RENDERING)
    (if (i32.eq (local.get $cycle_type))
      (then
        (call $window_listener.call_listeners_for_each_frame<>)
        (return)
      )
    )

    (global.get $CYCLE_TYPE_NEXT_TICK)
    (if (i32.eq (local.get $cycle_type))
      (then
        (call $window_listener.call_listeners_for_each_tick<>)
        (return)
      )
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

  (func $window_listener.dump_cycle_stats<>                           (export "dumpcycle")
    (warn<ref.ref.i32.ref.i32.ref.i32.ref.i32>
      (table.get $wat4wasm (i32.const 20));;

      (table.get $wat4wasm (i32.const 19));;
      (call $window_listener.get_cycle_frame_count<>i32)
      (table.get $wat4wasm (i32.const 18));;
      (call $window_listener.get_cycle_tick_count<>i32)
      (table.get $wat4wasm (i32.const 17));;
      (call $window_listener.get_cycle_count<>i32)
      (table.get $wat4wasm (i32.const 16));;
      (call $window_listener.get_cycle_cps<>i32)
    )
  )

  (func $window_listener.new_cycle_type<i32>              (param i32) (i32.store  offset=16 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_type<i32>              (param i32) (i32.store8 offset=16 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_is_next_tick<i32>      (param i32) (i32.store8 offset=17 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_is_rendering<i32>      (param i32) (i32.store8 offset=18 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_is_timeout<i32>        (param i32) (i32.store8 offset=19 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.get_cycle_type<>i32              (result i32) (i32.load8_u offset=16 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_is_next_tick<>i32      (result i32) (i32.load8_u offset=17 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_is_rendering<>i32      (result i32) (i32.load8_u offset=18 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_is_timeout<>i32        (result i32) (i32.load8_u offset=19 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.set_cycle_type_next_tick<>       (i32.store8 offset=17 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
  (func $window_listener.set_cycle_type_rendering<>       (i32.store8 offset=18 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))
  (func $window_listener.set_cycle_type_timeout<>         (i32.store8 offset=19 (global.get $OFFSET_WINDOW_LISTENER) (i32.const 1)))

  (func $window_listener.get_cycle_last_rendering_id<>i32 (result i32) (i32.load offset=20 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_last_next_tick_id<>i32 (result i32) (i32.load offset=24 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_last_epoch<>i32        (result i32) (i32.load offset=28 (global.get $OFFSET_WINDOW_LISTENER)))

  (func $window_listener.set_cycle_last_rendering_id<i32> (param i32) (i32.store offset=20 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_last_next_tick_id<i32> (param i32) (i32.store offset=24 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_last_epoch<i32>        (param i32) (i32.store offset=28 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_last_epoch_pnow<>      (call $window_listener.set_cycle_last_epoch<i32> (call $self.performance.now<>i32)))

  (func $window_listener.get_cycle_frame_count<>i32       (result i32) (i32.load offset=32 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_tick_count<>i32        (result i32) (i32.load offset=36 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_count<>i32             (result i32) (i32.load offset=40 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.get_cycle_cps<>i32               (result i32) (i32.load offset=44 (global.get $OFFSET_WINDOW_LISTENER)))

  (func $window_listener.set_cycle_frame_count<i32>       (param i32) (i32.store offset=32 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_tick_count<i32>        (param i32) (i32.store offset=36 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_count<i32>             (param i32) (i32.store offset=40 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))
  (func $window_listener.set_cycle_cps<i32>               (param i32) (i32.store offset=44 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))

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

  (func $window_listener.get_last_visibility_event_ptr<>i32  (result i32) (i32.load offset=48 (global.get $OFFSET_WINDOW_LISTENER)))
  (func $window_listener.set_last_visibility_event_ptr<i32>  (param i32) (i32.store offset=48 (global.get $OFFSET_WINDOW_LISTENER) (local.get 0)))


  (table $event_manager.listener_handlers<fun> 1 65535 funcref)

  (global $OFFSET_EVENT_MANAGER                 (mut i32) (i32.const 0))
  (global $LENGTH_EVENT_MANAGER                 i32 (i32.const 64))

  (global $OFFSET_EVENT_LISTENERS               (mut i32) (i32.const 0))
  (global $BYTES_PER_EVENT_LISTENER             i32 (i32.const 32))
  (global $MAX_EVENT_LISTENER_COUNT             i32 (i32.const 256))

  (global $OFFSET_EVENT_EMITS_QUEUE             (mut i32) (i32.const 0))
  (global $BYTES_PER_EMITTED_EVENTS             i32 (i32.const 8))
  (global $MAX_EVENT_EMIT_PER_CYLCE             i32 (i32.const 256))

  (global $OFFSET_EVENT_SLOTS                   (mut i32) (i32.const 0))
  (global $LENGTH_EVENT_SLOTS                   i32 (i32.const 64000))  ;; 64 * 1000
  (global $BYTES_PER_EVENT_SLOT                 i32 (i32.const 64))
  (global $MAX_EVENT_SLOTS_COUNT                i32 (i32.const 1000))

  (global $EVENT_TYPE.ON_EVERY_SECOND           i32 (i32.const 2))
  (global $EVENT_TYPE.ON_VISIBILTY_VISIBLE      i32 (i32.const 3))
  (global $EVENT_TYPE.ON_VISIBILTY_HIDDEN       i32 (i32.const 4))
  (global $EVENT_TYPE.ON_POINTER_MOVE           i32 (i32.const 5))
  (global $EVENT_TYPE.ON_POINTER_OVER           i32 (i32.const 6))
  (global $EVENT_TYPE.ON_POINTER_OUT            i32 (i32.const 7))

  (global $OFFSET_EVENT_HEADER_POINTER_EPOCH    i32 (i32.const 4))
  (global $OFFSET_EVENT_HEADER_POINTER_CLIENT_X i32 (i32.const 8))
  (global $OFFSET_EVENT_HEADER_POINTER_CLIENT_Y i32 (i32.const 12))

  (global $OFFSET_EVENT_HEADER_VISIBILTY_EPOCH  i32 (i32.const 4))
  (global $OFFSET_EVENT_HEADER_VISIBILTY_OTHER  i32 (i32.const 8))


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

    (global.set $OFFSET_EVENT_SLOTS
      (call $memory_manager.malloc_internal<i32>i32
        (global.get $LENGTH_EVENT_SLOTS)
      )
    )

    (call $event_manager.reset_event_slots<>)
    (call $event_manager.reset_listener_slots<>)

    (global.get $OFFSET_EVENT_MANAGER)
  )

  (func $event_manager.reset_event_slots<>
    (call $event_manager.set_event_slot_length<i32>
      (global.get $OFFSET_EVENT_SLOTS)
    )

    (call $event_manager.set_event_slot_count<i32>
      (i32.const 0)
    )
  )

  (func $event_manager.reset_listener_slots<>
    (call $event_manager.set_listener_length<i32>
      (global.get $OFFSET_EVENT_LISTENERS)
    )

    (call $event_manager.set_listener_count<i32>
      (i32.const 0)
    )
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

  (func $event_manager.emit<i32>
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
            (call $event.get_type<i32>i32 (local.get $event_ptr))
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

    (if (i32.eq (local.get $listener_index) (global.get $MAX_EVENT_LISTENER_COUNT))
      (then
        (call $event_manager.reset_listener_slots<>)
        (return
          (call $event_manager.listen<i32.fun>i32
            (local.get $event_type)
            (local.get $event_handler)
          )
        )
      )
    )

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

  (func $event_manager.alloc_event_slot<i32>i32
    (param $event_type i32)
    (result i32)
    (local $slot_offset i32)

    (if (i32.eq
        (call $event_manager.new_event_slot_index<>i32)
        (global.get $MAX_EVENT_SLOTS_COUNT)
      )
      (then
        (call $event_manager.reset_event_slots<>)
        (return
          (call $event_manager.alloc_event_slot<i32>i32
            (local.get $event_type)
          )
        )
      )
    )

    (local.set $slot_offset
      (call $event_manager.new_event_slot_offset<>i32)
    )

    (call $event.set_type<i32.i32>
      (local.get $slot_offset) (local.get $event_type)
    )

    (local.get $slot_offset)
  )

  (func $event_manager.handle_for_each_tick<>
  )

  (func $event_manager.handle_for_each_frame<>
  )

  (func $event_manager.handle_for_each_second<>
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

  (func $event_manager.new_event_slot_offset<>i32     (result i32) (i32.atomic.rmw.add offset=20 (global.get $OFFSET_EVENT_MANAGER) (global.get $BYTES_PER_EVENT_SLOT)))
  (func $event_manager.get_event_slot_length<>i32     (result i32) (i32.load offset=20 (global.get $OFFSET_EVENT_MANAGER)))
  (func $event_manager.set_event_slot_length<i32>     (param i32) (i32.store offset=20 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

  (func $event_manager.new_event_slot_index<>i32      (result i32) (i32.atomic.rmw.add offset=24 (global.get $OFFSET_EVENT_MANAGER) (i32.const 1)))
  (func $event_manager.get_event_slot_count<>i32      (result i32) (i32.load offset=24 (global.get $OFFSET_EVENT_MANAGER)))
  (func $event_manager.set_event_slot_count<i32>      (param i32) (i32.store offset=24 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

  (func $event.get_type<i32>i32                       (param i32) (result i32) (i32.load offset=0 (local.get 0)))
  (func $event.set_type<i32.i32>                      (param i32 i32) (i32.store offset=0 (local.get 0) (local.get 1)))

  (func $event.get_header<i32>i32                     (param i32) (result i32) (i32.load offset=0 (local.get 0)))
  (func $event.set_header<i32.i32>                    (param i32 i32) (i32.store offset=0 (local.get 0) (local.get 1)))
  (func $event.get_header<i32>f32                     (param i32) (result f32) (f32.load offset=0 (local.get 0)))
  (func $event.set_header<i32.f32>                    (param i32 f32) (f32.store offset=0 (local.get 0) (local.get 1)))

  (func $visibility_event.get_epoch<i32>f32           (param i32) (result f32) (call $event.get_header<i32>f32 (i32.add (global.get $OFFSET_EVENT_HEADER_VISIBILTY_EPOCH) (local.get 0))))
  (func $visibility_event.set_epoch<i32.f32>          (param i32 f32) (call $event.set_header<i32.f32> (i32.add (global.get $OFFSET_EVENT_HEADER_VISIBILTY_EPOCH) (local.get 0)) (local.get 1)))

  (func $pointer_event.get_epoch<i32>f32              (param i32) (result f32) (call $event.get_header<i32>f32 (i32.add (global.get $OFFSET_EVENT_HEADER_POINTER_EPOCH) (local.get 0))))
  (func $pointer_event.set_epoch<i32.f32>             (param i32 f32) (call $event.set_header<i32.f32> (i32.add (global.get $OFFSET_EVENT_HEADER_POINTER_EPOCH) (local.get 0)) (local.get 1)))

  (func $pointer_event.get_client_x<i32>f32           (param i32) (result f32) (call $event.get_header<i32>f32 (i32.add (global.get $OFFSET_EVENT_HEADER_POINTER_CLIENT_X) (local.get 0))))
  (func $pointer_event.set_client_x<i32.f32>          (param i32 f32) (call $event.set_header<i32.f32> (i32.add (global.get $OFFSET_EVENT_HEADER_POINTER_CLIENT_X) (local.get 0)) (local.get 1)))

  (func $pointer_event.get_client_y<i32>f32           (param i32) (result f32) (call $event.get_header<i32>f32 (i32.add (global.get $OFFSET_EVENT_HEADER_POINTER_CLIENT_Y) (local.get 0))))
  (func $pointer_event.set_client_y<i32.f32>          (param i32 f32) (call $event.set_header<i32.f32> (i32.add (global.get $OFFSET_EVENT_HEADER_POINTER_CLIENT_Y) (local.get 0)) (local.get 1)))

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


  (global $OFFSET_CHAIN_MANAGER                 (mut i32) (i32.const 0))
  (global $LENGTH_CHAIN_MANAGER                 i32 (i32.const 64))

  (global $OFFSET_CHAIN_SLOTS                   (mut i32) (i32.const 0))
  (global $BYTES_PER_CHAIN_SLOT                 i32 (i32.const 16))
  (global $MAX_CHAIN_SLOT_COUNT                 i32 (i32.const 128))

  (global $CHAIN_SLOT_STATE_EMPTY               i32 (i32.const 0))
  (global $CHAIN_SLOT_STATE_RESERVED            i32 (i32.const 1))
  (global $CHAIN_SLOT_STATE_COMPILING           i32 (i32.const 2))
  (global $CHAIN_SLOT_STATE_READY               i32 (i32.const 3))
  (global $CHAIN_SLOT_STATE_QUEUED              i32 (i32.const 4))
  (global $CHAIN_SLOT_STATE_STARTED             i32 (i32.const 5))
  (global $CHAIN_SLOT_STATE_NOTIFIED            i32 (i32.const 6))
  (global $CHAIN_SLOT_STATE_CLOSED              i32 (i32.const 7))

  (global $OFFSET_CHAIN_HEADER_SLOT_STATE       i32 (i32.const 0))
  (global $OFFSET_CHAIN_HEADER_TABLE_INDEX      i32 (i32.const 4))

  (table $module_source 129 externref)
  (table $chain_module 129 externref)

  (global $self.Function:bind                   externref)
  (global $self.Promise:then                    externref)

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

    (call $self.console.warn<ref.i32> (table.get $wat4wasm (i32.const 15));;
      (local.get $chain_ptr))
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
        (global.get $self.Function.prototype.bind)
        (ref.func $chain_manager.on_compile<i32.ref>)
        (call $self.Array.of<ref.i32>ref
          (ref.null extern) (local.get $chain_ptr)
        )
      )
    )

    (local.set $compile_promise
      (call $self.WebAssembly.compile<ref>ref
        (local.get $module_source)
      )
    )

    (call $self.Reflect.apply<ext.ext.ext>  $self.Promise:then<ref>
      (local.get $compile_promise)
      (param (local.get $bound_function))
    )

    (call $chain.set_slot_state<i32.i32>
      (local.get $chain_ptr)
      (global.get $CHAIN_SLOT_STATE_COMPILING)
    )

    (call $self.console.warn<ref.i32> (table.get $wat4wasm (i32.const 14));;
      (local.get $chain_ptr))
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

          (call $self.console.warn<ref.i32> (table.get $wat4wasm (i32.const 13));;
            (local.get $chain_ptr))

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



  (global $OFFSET_EVENT_HANDLERS                (mut i32) (i32.const 0))
  (global $LENGTH_EVENT_HANDLERS                i32 (i32.const 512))

  (func $bind_event_handlers
    (global.set $OFFSET_EVENT_HANDLERS
      (call $memory_manager.malloc_internal<i32>i32
        (global.get $LENGTH_EVENT_HANDLERS)
      )
    )

    (call $event_handlers.set_on_visibility_visibile_ptr<i32>
      (call $event_manager.listen<i32.fun>i32
        (global.get $EVENT_TYPE.ON_VISIBILTY_VISIBLE)
        (ref.func $event_handlers.on_visibility_visible<i32>)
      )
    )

    (call $event_handlers.set_on_visibility_hidden_ptr<i32>
      (call $event_manager.listen<i32.fun>i32
        (global.get $EVENT_TYPE.ON_VISIBILTY_HIDDEN)
        (ref.func $event_handlers.on_visibility_hidden<i32>)
      )
    )

    (call $event_handlers.set_on_pointer_move_ptr<i32>
      (call $event_manager.listen<i32.fun>i32
        (global.get $EVENT_TYPE.ON_POINTER_MOVE)
        (ref.func $event_handlers.on_pointer_move<i32>)
      )
    )

    (call $event_handlers.set_event_loop_listener_ptr<i32>
      (call $window_listener.add_listener_for_each_cycle<fun>i32
        (ref.func $event_manager.event_loop<>)
      )
    )

    (call $window_listener.bind_local_global_this<>)
  )

  (func $event_handlers.on_visibility_visible<i32>
    (param $event* i32)

    (call $self.console.warn<ref.i32>
      (table.get $wat4wasm (i32.const 12));;

      (local.get $event*)
    )
  )

  (func $event_handlers.on_visibility_hidden<i32>
    (param $event* i32)

    (call $self.console.warn<ref.i32>
      text('on hidden from event manager. event offset:')
      local($event*)
    )
  )

  (func $event_handlers.on_pointer_move<i32>
    (param $event* i32)

    (call $self.console.warn<ref.i32>
      text('on pointer move from event manager. event offset:')
      local($event*)
    )
  )

  (func $event_handlers.get_event_loop_listener_ptr<>i32      (result i32) (i32.load offset=0 (global.get $OFFSET_EVENT_MANAGER)))
  (func $event_handlers.set_event_loop_listener_ptr<i32>      (param i32) (i32.store offset=0 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

  (func $event_handlers.get_on_visibility_visibile_ptr<>i32   (result i32) (i32.load offset=4 (global.get $OFFSET_EVENT_MANAGER)))
  (func $event_handlers.set_on_visibility_visibile_ptr<i32>   (param i32) (i32.store offset=4 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

  (func $event_handlers.get_on_visibility_hidden_ptr<>i32     (result i32) (i32.load offset=8 (global.get $OFFSET_EVENT_MANAGER)))
  (func $event_handlers.set_on_visibility_hidden_ptr<i32>     (param i32) (i32.store offset=8 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))

  (func $event_handlers.get_on_pointer_move_ptr<>i32          (result i32) (i32.load offset=12 (global.get $OFFSET_EVENT_MANAGER)))
  (func $event_handlers.set_on_pointer_move_ptr<i32>          (param i32) (i32.store offset=12 (global.get $OFFSET_EVENT_MANAGER) (local.get 0)))



  (data (i32.const 4) "\10")

  (global $wasm.memory_manager*                 (mut i32) (i32.const 0))
  (global $wasm.window_listener*                (mut i32) (i32.const 0))
  (global $wasm.event_manager*                  (mut i32) (i32.const 0))
  (global $wasm.chain_manager*                  (mut i32) (i32.const 0))




  (func $load_chain<ref>i32
                                                        (export              "load_chain")
    (param  $source       ArrayBuffer)
    (result $chain_ptr            i32)
    (local  $length               i32)
    (local  $chain_ptr            i32)

    (local.set $chain_ptr
      (call $chain_manager.alloc_chain_slot<ref>i32
        (local.get $source)
      )
    )

    (warn<ref.ref.i32>
      (table.get $wat4wasm (i32.const 1));;

      (local.get $source)
      (local.get $chain_ptr)
    )

    (call $chain_manager.start<i32>
      (local.get $chain_ptr)
    )

    (local.get $chain_ptr)
  )

  (func $instantiate_module<ref>
    (param $module externref)

    (call $self.console.warn<ref>
      (call $self.WebAssembly.compile<ref.ref>ref
        (local.get $module) (global.get $self)
      )
    )
  )

  (global $wat4wasm                             (mut externref) (ref.null extern))

  (table $wat4wasm 28 externref)

  (elem $wat4wasm declare func $event_manager.event_loop<> $event_handlers.on_pointer_move<i32> $event_handlers.on_visibility_hidden<i32> $event_handlers.on_visibility_visible<i32> $chain_manager.on_compile<i32.ref>)


  (func $wat4wasm
    (local $textDecoder externref)
    (local $textDecoder.decode externref)
    (local $Uint8Array externref)
    (local $arguments externref)
    (local $arrayBufferView externref)
    (local $viewAt i32)
    (local $offset i32)
    (local $length i32)
    (block $prepare
      (local.set $textDecoder
        (call $self.Reflect.construct<ext.ext>ext
          (call $self.Reflect.get<ext.ext>ext
            (global.get $self)

            (block (; "TextDecoder" ;)
              (result externref)
              (global.set $wat4wasm (call $self.Array<>ext))

              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 0) (i32.const 84))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 1) (i32.const 101))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 2) (i32.const 120))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 3) (i32.const 116))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 4) (i32.const 68))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 5) (i32.const 101))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 6) (i32.const 99))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 7) (i32.const 111))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 8) (i32.const 100))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 9) (i32.const 101))
              (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 10) (i32.const 114))

              (call $self.Reflect.apply<ext.ext.ext>ext
                (global.get $self.String.fromCharCode)
                (ref.null extern)
                (global.get $wat4wasm)
              )
              ;; stacked

              (global.set $wat4wasm (ref.null extern))
              ;; cleared
            )

          )
          (global.get $self)
        )
      )
      (local.set $textDecoder.decode
        (call $self.Reflect.get<ext.ext>ext
          (local.get $textDecoder)

          (block (; "decode" ;)
            (result externref)
            (global.set $wat4wasm (call $self.Array<>ext))

            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 0) (i32.const 100))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 1) (i32.const 101))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 2) (i32.const 99))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 3) (i32.const 111))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 4) (i32.const 100))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 5) (i32.const 101))

            (call $self.Reflect.apply<ext.ext.ext>ext
              (global.get $self.String.fromCharCode)
              (ref.null extern)
              (global.get $wat4wasm)
            )
            ;; stacked

            (global.set $wat4wasm (ref.null extern))
            ;; cleared
          )

        )
      )
      (local.set $Uint8Array
        (call $self.Reflect.get<ext.ext>ext
          (global.get $self)

          (block (; "Uint8Array" ;)
            (result externref)
            (global.set $wat4wasm (call $self.Array<>ext))

            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 0) (i32.const 85))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 1) (i32.const 105))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 2) (i32.const 110))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 3) (i32.const 116))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 4) (i32.const 56))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 5) (i32.const 65))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 6) (i32.const 114))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 7) (i32.const 114))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 8) (i32.const 97))
            (call $self.Reflect.set<ext.i32.i32> (global.get $wat4wasm) (i32.const 9) (i32.const 121))

            (call $self.Reflect.apply<ext.ext.ext>ext
              (global.get $self.String.fromCharCode)
              (ref.null extern)
              (global.get $wat4wasm)
            )
            ;; stacked

            (global.set $wat4wasm (ref.null extern))
            ;; cleared
          )

        )
      )
    )
    ;;secure zero heap for memory.init
    (i32.const 0)
    (i32.load (i32.const 0))
    ;; offset and value stacked now
    (block $oninit
      (block $decodeText/4:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 4))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 1)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )

      (block $decodeText/4:6
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 4))
        (local.set $length (i32.const 6))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 5)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; Object
        ))
      )
      (block $decodeText/10:4
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 10))
        (local.set $length (i32.const 4))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 6)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; self
        ))
      )
      (block $decodeText/14:6
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 14))
        (local.set $length (i32.const 6))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 7)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; Memory
        ))
      )
      (block $decodeText/20:11
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 20))
        (local.set $length (i32.const 11))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 8)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; WebAssembly
        ))
      )
      (block $decodeText/10:4
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 10))
        (local.set $length (i32.const 4))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 9)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; self
        ))
      )
      (block $decodeText/31:10
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 31))
        (local.set $length (i32.const 10))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 10)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; Uint8Array
        ))
      )
      (block $decodeText/10:4
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 10))
        (local.set $length (i32.const 4))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 11)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; self
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 12)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 13)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 14)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 15)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 16)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 17)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 18)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 19)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )
      (block $decodeText/41:0
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 0))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 20)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;;
        ))
      )

      (block $decodeText/41:12
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 41))
        (local.set $length (i32.const 12))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 21)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; deviceMemory
        ))
      )
      (block $decodeText/53:9
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 53))
        (local.set $length (i32.const 9))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 22)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; navigator
        ))
      )
      (block $decodeText/62:8
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 62))
        (local.set $length (i32.const 8))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 23)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; document
        ))
      )
      (block $decodeText/70:6
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 70))
        (local.set $length (i32.const 6))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 24)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; window
        ))
      )
      (block $decodeText/76:4
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 76))
        (local.set $length (i32.const 4))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 25)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; bind
        ))
      )
      (block $decodeText/80:9
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 80))
        (local.set $length (i32.const 9))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 26)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; prototype
        ))
      )
      (block $decodeText/89:8
        (local.set $viewAt (i32.const 0))
        (local.set $offset (i32.const 89))
        (local.set $length (i32.const 8))
        (local.set $arguments (call $self.Array<>ext))

        (call $self.Reflect.set<ext.i32.i32>
          (local.get $arguments) (i32.const 0) (local.get $length)
        )
        (local.set $arrayBufferView
          (call $self.Reflect.construct<ext.ext>ext
            (local.get $Uint8Array)
            (local.get $arguments)
          )
        )
        (loop $length--
          (if (local.get $length)
            (then
              (memory.init $wat4wasm
                (i32.const 0)
                (local.get $offset)
                (i32.const 1)
              )
              (call $self.Reflect.set<ext.i32.i32>
                (local.get $arrayBufferView)
                (local.get $viewAt)
                (i32.load8_u (i32.const 0))
              )
              (local.set $viewAt (i32.add (local.get $viewAt) (i32.const 1)))
              (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
              (local.set $length (i32.sub (local.get $length) (i32.const 1)))
              (br $length--)
            )
          )
        )
        (local.set $arguments (call $self.Array<>ext))
        (call $self.Reflect.set<ext.i32.ext>
          (local.get $arguments)
          (i32.const 0)
          (local.get $arrayBufferView)
        )
        (table.set $wat4wasm (i32.const 27)
          (call $self.Reflect.apply<ext.ext.ext>ext
            (local.get $textDecoder.decode)
            (local.get $textDecoder)
            (local.get $arguments) ;; Function
        ))
      )
    )
    (block $ontextready


      (block $self.self.Uint8Array<ref.i32.i32>ref<ext>
        (table.set $wat4wasm (i32.const 2)
          (call $self.Reflect.get<ext.ext>ref.i32.i32
            (call $self.Reflect.get<ext.ext>ext
              (global.get $self)
              (table.get $wat4wasm (i32.const 6));; self
              ;; self
            )
            (table.get $wat4wasm (i32.const 10));; Uint8Array
            ;; Uint8Array
          )
      ))


      (block $self.self.WebAssembly.Memory<ref>ref<ext>
        (table.set $wat4wasm (i32.const 3)
          (call $self.Reflect.get<ext.ext>ref
            (call $self.Reflect.get<ext.ext>ext
              (call $self.Reflect.get<ext.ext>ext
                (global.get $self)
                (table.get $wat4wasm (i32.const 6));; self
                ;; self
              )
              (table.get $wat4wasm (i32.const 8));; WebAssembly
              ;; WebAssembly
            )
            (table.get $wat4wasm (i32.const 7));; Memory
            ;; Memory
          )
      ))


      (block $self.self.Object<>ref<ext>
        (table.set $wat4wasm (i32.const 4)
          (call $self.Reflect.get<ext.ext>ext
            (call $self.Reflect.get<ext.ext>ext
              (global.get $self)
              (table.get $wat4wasm (i32.const 6));; self
              ;; self
            )
            (table.get $wat4wasm (i32.const 5));; Object
            ;; Object
          )
      ))


      (block $global/self.Function.prototype.bind
        (global.set $self.Function.prototype.bind
          (call $self.Reflect.get<ext.ext>$self.Function.prototype.bind
            (call $self.Reflect.get<ext.ext>ext
              (call $self.Reflect.get<ext.ext>ext
                (global.get $self)
                (table.get $wat4wasm (i32.const 27));; Function
                ;; Function
              )
              (table.get $wat4wasm (i32.const 26));; prototype
              ;; prototype
            )
            (table.get $wat4wasm (i32.const 25));; bind
            ;; bind
          )
        )
      )

      (block $global/self.window
        (global.set $self.window
          (call $self.Reflect.get<ext.ext>$self.window
            (global.get $self)
            (table.get $wat4wasm (i32.const 24));; window
            ;; window
          )
        )
      )

      (block $global/self.document
        (global.set $self.document
          (call $self.Reflect.get<ext.ext>$self.document
            (global.get $self)
            (table.get $wat4wasm (i32.const 23));; document
            ;; document
          )
        )
      )

      (block $global/self.navigator.deviceMemory
        (global.set $self.navigator.deviceMemory
          (call $self.Reflect.get<ext.ext>$self.navigator.deviceMemory
            (call $self.Reflect.get<ext.ext>ext
              (global.get $self)
              (table.get $wat4wasm (i32.const 22));; navigator
              ;; navigator
            )
            (table.get $wat4wasm (i32.const 21));; deviceMemory
            ;; deviceMemory
          )
        )
      )
    )


    ;; restore zero heap value
    (i32.store (; stack stack ;))
    (nop)

    (call $main)
  )


  (data $wat4wasm "\61\00\00\00\4f\62\6a\65\63\74\73\65\6c\66\4d\65\6d\6f\72\79\57\65\62\41\73\73\65\6d\62\6c\79\55\69\6e\74\38\41\72\72\61\79\64\65\76\69\63\65\4d\65\6d\6f\72\79\6e\61\76\69\67\61\74\6f\72\64\6f\63\75\6d\65\6e\74\77\69\6e\64\6f\77\62\69\6e\64\70\72\6f\74\6f\74\79\70\65\46\75\6e\63\74\69\6f\6e")

  (start $wat4wasm)

  (global $self.Function.prototype.bind         (mut externref) (ref.null extern))

  (global $self.window                          (mut externref) (ref.null extern))

  (global $self.document                        (mut externref) (ref.null extern))

  (global $self.navigator.deviceMemory          (mut externref) (ref.null extern))
)