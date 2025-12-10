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
   
	(import "Reflect" "apply" (func $self.Reflect.apply<refx3>i32 (param externref externref externref) (result i32)))
	(import "Array" "of" (func $self.Array.of<>ref  (result externref)))
	(import "console" "warn" (func $self.console.warn<ref.i32> (param externref i32)))
	(import "Reflect" "deleteProperty" (func $self.Reflect.deleteProperty<ref.ref> (param externref externref)))
	 

    (import "self" "index" (global $WORKER_INDEX i32))
    
	(; externref  ;)
	(import "self" "memory" (memory $shared 10 65535 shared))

    (global $WORKER_OFFSET (mut i32) (i32.const 0))

    (;  
        ----------------- Memory Layout -----------------
        
        Global coverage for module:
        manager start                   -> offset=4096
        manager end                     -> offset=20480
        allocated                       -> 16384  

        ---------- Mutex Headers (4096 - 5120) ----------
            mutex header is a common header name for
            window (master thread) and worker threads

        window (worker 0) mutex offset  -> offset=4096
        window (worker 0) mutex length  -> 4
        window (worker 0) mutex value   -> 0

        worker 1 mutex offset           -> offset=4100
        worker 1 mutex length           -> 4
        worker 1 mutex value            -> 0

        ...

        worker 254 mutex offset         -> offset=5112
        worker 254 mutex length         -> 4
        worker 254 mutex value          -> 0

        worker 255 mutex offset         -> offset=5116
        worker 255 mutex length         -> 4
        worker 255 mutex value          -> 0
    ;)

    (global $MANAGER_OFFSET_GLOBAL_MUTEX            i32  (i32.const 0))
    (global $MANAGER_OFFSET_WINDOW_MUTEX            i32  (i32.const 4))
    (global $MANAGER_OFFSET_HARDWARE_CONCURRENCY    i32  (i32.const 8))
    (global $MANAGER_OFFSET_MAX_WORKER_COUNT        i32 (i32.const 12))
    (global $MANAGER_OFFSET_CREATING_WORKER_COUNT   i32 (i32.const 16))
    (global $MANAGER_OFFSET_CREATED_WORKER_COUNT    i32 (i32.const 20))
    (global $MANAGER_OFFSET_OPEN_WORKER_COUNT       i32 (i32.const 24))
    (global $MANAGER_OFFSET_STARTED_WORKER_COUNT    i32 (i32.const 28))
    (global $MANAGER_OFFSET_WAITING_WORKER_COUNT    i32 (i32.const 32))
    (global $MANAGER_OFFSET_WORKING_WORKER_COUNT    i32 (i32.const 36))
    (global $MANAGER_OFFSET_CLOSING_WORKER_COUNT    i32 (i32.const 40))
    (global $MANAGER_OFFSET_CLOSED_WORKER_COUNT     i32 (i32.const 44))
    (global $MANAGER_OFFSET_TERMINATED_WORKER_COUNT i32 (i32.const 48))

    (global $WORKER_OFFSET_WORKER_MUTEX             i32  (i32.const 0))
    (global $WORKER_OFFSET_WORKER_INDEX             i32  (i32.const 4))
    (global $WORKER_OFFSET_START_EPOCH              i32  (i32.const 8))
    (global $WORKER_OFFSET_CLOSE_EPOCH              i32 (i32.const 12))

    (global $MEMORY_OFFSET_WORKER_MUTEX           i32 (i32.const 4096))
    (global $MEMORY_OFFSET_WORKER_INDEX           i32 (i32.const 4100))
    (global $MEMORY_OFFSET_START_EPOCH            i32 (i32.const 4104))
    (global $MEMORY_OFFSET_CLOSE_EPOCH            i32 (i32.const 4108))

    (global $BYTES_PER_THREAD i32 (i32.const 64))
    (global $MAX_WORKER_COUNT i32 (i32.const 255))

    (func $new_thread
        (global.set $THREAD_OFFSET
            (i32.mul
                (global.get $WORKER_INDEX)
                (global.get $BYTES_PER_THREAD)
            )
        )

    )

    (func $now (result i32) (call $self.Reflect.apply<refx3>i32 
            (global.get $self.performance.now) (global.get $self.performance) (call $self.Array.of<>ref)))

    (start $main) (func $main
(table.set $extern (i32.const 1) (call $wat4wasm/text (i32.const 0) (i32.const 56)))
		(table.set $extern (i32.const 2) (call $wat4wasm/text (i32.const 56) (i32.const 36)))
		(table.set $extern (i32.const 3) (call $wat4wasm/text (i32.const 92) (i32.const 24)))
		(table.set $extern (i32.const 4) (call $wat4wasm/text (i32.const 116) (i32.const 20)))
		(table.set $extern (i32.const 5) (call $wat4wasm/text (i32.const 136) (i32.const 16)))
		(table.set $extern (i32.const 6) (call $wat4wasm/text (i32.const 152) (i32.const 48)))
		(table.set $extern (i32.const 7) (call $wat4wasm/text (i32.const 200) (i32.const 36)))
		(table.set $extern (i32.const 8) (call $wat4wasm/text (i32.const 236) (i32.const 16)))
		(table.set $extern (i32.const 9) (call $wat4wasm/text (i32.const 252) (i32.const 12)))
		(table.set $extern (i32.const 10) (call $wat4wasm/text (i32.const 264) (i32.const 44)))
		(table.set $extern (i32.const 11) (call $wat4wasm/text (i32.const 308) (i32.const 12)))




        (global.set $self.MessageEvent.prototype.data/get
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.getOwnPropertyDescriptor<refx2>ref
                    (call $wat4wasm/Reflect.get<refx2>ref 
                            (call $wat4wasm/Reflect.get<refx2>ref 
                                (global.get $wat4wasm/self) 
                                (table.get $extern (i32.const 6)) 
                            ) 
                            (table.get $extern (i32.const 7)) 
                        )
                    (table.get $extern (i32.const 8)) 
                )
                (table.get $extern (i32.const 9)) 
            )
        )
        
        (global.set $self.performance
            (call $wat4wasm/Reflect.get<refx2>ref
                (global.get $wat4wasm/self)
                (table.get $extern (i32.const 10)) 
            )
        )
        
        (global.set $self.performance.now
            (call $wat4wasm/Reflect.get<refx2>ref
                (call $wat4wasm/Reflect.get<refx2>ref 
                        (global.get $wat4wasm/self) 
                        (table.get $extern (i32.const 10)) 
                    )
                (table.get $extern (i32.const 11)) 
            )
        )
        
 
        (call $new_thread)
        (call $set_start_epoch)    
        (call $init_worker)    
        (call $self.console.warn<ref.i32> (table.get $extern (i32.const 1)) (global.get $WORKER_OFFSET))    
        (call $event_loop)
    )

    (func $init_worker
        (call $self.Reflect.deleteProperty<ref.ref> (global.get $wat4wasm/self) (table.get $extern (i32.const 2)))
        (call $self.Reflect.deleteProperty<ref.ref> (global.get $wat4wasm/self) (table.get $extern (i32.const 3)))
        (call $self.Reflect.deleteProperty<ref.ref> (global.get $wat4wasm/self) (table.get $extern (i32.const 4)))
        (call $self.Reflect.deleteProperty<ref.ref> (global.get $wat4wasm/self) (table.get $extern (i32.const 5)))
    )

    (func $event_loop
        (loop $events

        )
    )

    (func $set_start_epoch
        (i32.atomic.store offset=4104 (global.get $WORKER_OFFSET) (call $now))
    )

    (func $get_start_epoch (result i32)
        (i32.atomic.load offset=4104 (global.get $WORKER_OFFSET))
    )

	(global $self.MessageEvent.prototype.data/get (mut externref) ref.null extern)



	(global $self.performance (mut externref) ref.null extern)
	(global $self.performance.now (mut externref) ref.null extern)

	

    (table $extern 12 12 externref)

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

    (data $wat4wasm/text "\00\00\d0\42\00\00\d2\42\00\00\00\42\00\00\cc\42\00\00\e4\42\00\00\de\42\00\00\da\42\00\00\00\42\00\00\ee\42\00\00\de\42\00\00\e4\42\00\00\d6\42\00\00\ca\42\00\00\e4\42\00\00\de\42\00\00\dc\42\00\00\da\42\00\00\ca\42\00\00\e6\42\00\00\e6\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\da\42\00\00\ca\42\00\00\da\42\00\00\de\42\00\00\e4\42\00\00\f2\42\00\00\d2\42\00\00\dc\42\00\00\c8\42\00\00\ca\42\00\00\f0\42\00\00\ee\42\00\00\c2\42\00\00\e6\42\00\00\da\42\00\00\9a\42\00\00\ca\42\00\00\e6\42\00\00\e6\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\8a\42\00\00\ec\42\00\00\ca\42\00\00\dc\42\00\00\e8\42\00\00\e0\42\00\00\e4\42\00\00\de\42\00\00\e8\42\00\00\de\42\00\00\e8\42\00\00\f2\42\00\00\e0\42\00\00\ca\42\00\00\c8\42\00\00\c2\42\00\00\e8\42\00\00\c2\42\00\00\ce\42\00\00\ca\42\00\00\e8\42\00\00\e0\42\00\00\ca\42\00\00\e4\42\00\00\cc\42\00\00\de\42\00\00\e4\42\00\00\da\42\00\00\c2\42\00\00\dc\42\00\00\c6\42\00\00\ca\42\00\00\dc\42\00\00\de\42\00\00\ee\42")
)