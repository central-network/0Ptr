(module
    (memory $memory (import "env" "memory") 10 100 shared)

    (func $log      (import "console" "log") (param i32))
    (func $log2     (import "console" "log") (param i32 i32))
    (func $warn     (import "console" "warn") (param i32))
    (func $error    (import "console" "error") (param i32))
    (func $memdump  (import "console" "memdump") (param i32 i32))

    (func $exit     (import "main" "exit"))
    (func $init     (import "main" "init"))

    
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


    (func $dump 
        (param $byteOffset i32)
        (local $byteLength i32)
        
        ;; load byteLength of given offset
        (local.set $byteLength
            (i32.load (local.get $byteOffset)))

        ;; console.log packet info
        (call $memdump
            (local.get $byteOffset) (local.get $byteLength))

        ;; sum byteLength for next offset
        (local.set $byteOffset 
            (i32.add 
                (local.get $byteOffset)
                (local.get $byteLength))
        )            

        ;; recall if next offset has byteLength
        (if (i32.load( local.get $byteOffset )) (then
            (call $dump ( local.get $byteOffset ))))

        (return)
    )

    (func $align
        (param $value i32)
        (param $mod   i32)
              (result i32)
        (local $rem   i32)

        (local.set $rem 
            (i32.rem_u 
                (local.get $value)
                (local.get $mod)
            )
        )

        (if (local.get $rem) (then
            (local.set $value (i32.add
                (local.get $value)
                (i32.sub
                    (local.get $mod)
                    (local.get $rem)))))
        )

        (local.get $value)
    )

    (func $malloc 
        (param $byteLength i32)
                   (result i32)
        (local $byteOffset i32)


        (local.set $byteLength 
            (call $align 
                (local.get $byteLength)
                (i32.const 8)))


        (block $loop (loop $next

            (br_if $loop (i32.eq 
                (i32.const 0)
                (i32.load( local.get $byteOffset ))
            ))

            (local.set $byteOffset
                (i32.add 
                    (local.get $byteOffset)
                    (i32.load(
                        local.get $byteOffset))))

            (br $next))
        )

        (i32.store
            (local.get $byteOffset)
            (local.get $byteLength))

        (return (local.get $byteOffset))

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




        i32.const 0
    )

    (func $main 
    (call $init)

        (drop (call $malloc (i32.const 429)))
        (drop (call $malloc (i32.const 160)))
        (drop (call $malloc (i32.const 124)))
        

        (call $dump (i32.const 0))
    
    (call $exit)
    )

    (start $main)
)