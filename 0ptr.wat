(module
    (func $log (import "imports" "log") (param i32))
    (func $warn (import "imports" "warn") (param i32))
    (func $error (import "imports" "error") (param i32))

    (memory $mem 10 100 shared)
    (export "memory" (memory $mem))
    
    (func 
    (export "accumulate") 
        (param $ptr i32) 
        (param $len i32) 
            (result i32)

        (local $end i32)
        (local $sum i32)

        (local.set $end
            (i32.add
                (local.get $ptr)
                (i32.mul
                    (local.get $len)
                    (i32.const 4)))
        )

        (block $break
            (loop $top
                (br_if $break
                    (i32.eq
                        (local.get $ptr)
                        (local.get $end))
                )

                (local.set $sum
                    (i32.add
                        (local.get $sum)
                        (i32.load
                        (local.get $ptr)))
                )

                local.get $sum
                call $log

                (local.set $ptr
                    (i32.add
                        (local.get $ptr)
                        (i32.const 4))
                )

                (br $top)
            )
        )

        (local.get $sum)
    )
)