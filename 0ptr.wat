(module
    (func $log (import "$call" "log") (param i32))
    (func $warn (import "$call" "warn") (param i32))
    (func $error (import "$call" "error") (param i32))

    (memory $mem 10 100 shared)
    (export "memory" (memory $mem))
    
    (func 
    (export "accumulate") 

        (param $ptr i32) ;; arguments[0] 
        (param $len i32) ;; arguments[1] 
            (result i32)

        (local $end i32) ;; let end = 0
        (local $sum i32) ;; let sum = 0


        ;; byteLength   = len * 4
        ;; end          = byteOffset + byteLength
        (local.set $end                 
            (i32.add                    
                (local.get $ptr)         
                (i32.mul                
                    (local.get $len)
                    (i32.const 4)))
        )


        ;; while 
        (block $break (loop $top

            ;; break if byteOffset == end
            (br_if $break
                (i32.eq (local.get $ptr) (local.get $end)))


            ;; load and sum at byteOffset
            (local.set $sum

                (i32.add

                    ;; get total value
                    (local.get $sum)

                    ;; load current byteOffset
                    (i32.load (local.get $ptr)))
            )


            local.get $ptr
            call $warn

            local.get $sum
            call $log

            ;;next byteOffset
            (local.set $ptr

                (i32.add 

                    ;; iterate 4 bytes
                    (local.get $ptr) 
                    (i32.const 4))
            )

        ;; go to loop start
        (br $top)))

        ;; send sum value to back
        (local.get $sum)

    )
)