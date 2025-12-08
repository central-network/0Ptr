(module
    (import "self" "memory" (memory $shared 10 65535 shared))
    (import "memory" "buffer" (global $buffer externref))
    (import "self" "postData" (global $postData externref))
    (import "self" "workerURL" (global $workerURL externref))

    (global $self.navigator.deviceMemory i32)
    (global $self.navigator.hardwareConcurrency i32)

    (start $main
        (error<ref> text('hi from window'))    

        (; initial allocations ;)
        (i32.store i32(0)   i32(0))
        (i32.store i32(4)   i32(65536))
        (i32.store i32(8)   (i32.mul (memory.size $shared) (i32.const 65536)))
        (i32.store i32(12)  (i32.mul (i32.const 65535) (i32.const 65536)))
        (i32.store i32(16)  (global.get $self.navigator.deviceMemory))

        (; threading limits ;)
        (i32.store i32(32)  (global.get $self.navigator.hardwareConcurrency))
        (i32.store i32(36)  (i32.sub (global.get $self.navigator.hardwareConcurrency) (i32.const 1)))
        (i32.store i32(40)  (i32.mul (global.get $self.navigator.hardwareConcurrency) (i32.const 16)))
        (i32.store i32(44)  (i32.const 0))

        (call $fork)
        (call $fork)
        (call $fork)
        (call $fork)
        (call $fork)
    )

    (func $fork
        (apply $self.Worker:postMessage<ref>
            (new $self.Worker<ref>ref
                global($workerURL)
            )
            (param global($postData))
        )    
    )
)