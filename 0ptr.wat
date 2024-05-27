(module
    (func $log      (import "console" "log") (param i32))
    (func $log2     (import "console" "log") (param i32 i32))
    (func $warn     (import "console" "warn") (param i32))
    (func $error    (import "console" "error") (param i32))

    (func $exit     (import "main" "exit") (param i32))
    (func $init     (import "main" "init") (param i32))

    (memory $memory 10 100 shared)
    (export "memory" (memory $memory))
    
    (func $iterate
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


                (local.get $ptr)
                (call $warn)

                (local.get $sum)
                (call $log)

                ;;next byteOffset
                (local.set $ptr

                    (i32.add 
                        ;; iterate 4 bytes
                        (local.get $ptr)
                        (i32.const 4))
                )

            ;; go to loop start
            (br $top)))

        ;; return sum
        (local.get $sum)
    )

    (func $typedef
        (result i32)
        ;;get next type id

        (local $byteOffset i32)
        (local $type i32)

        (local.set $byteOffset                 
                (i32.const 0)
        )

        (local.set $type                 
                (i32.const 4)
        )

        (i32.store 
            (local.get $byteOffset)
            (i32.add (i32.load (i32.const 0)) (i32.const 4)))


        (i32.store 
            (local.get $type)
            (i32.add (i32.load (i32.const 4)) (i32.const 1)))

        (i32.load (i32.const 0))
        (i32.load (i32.const 4))
        (call $log2)



        i32.const 0
    )

    (func $main 
        (local $var i32)
        (local $type i32)

        (local.get $var)
        (call $init)
        
        (i32.add                
            (local.get $var)
            (i32.const 4))
        
        (local.set $type (call $typedef))
        (local.set $type (call $typedef))
        (local.set $type (call $typedef))
        
        (call $exit)
    )
    (start $main)

)