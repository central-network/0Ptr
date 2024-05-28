(module

    (func $log      (import "console" "log") (param i32))
    (func $log2     (import "console" "log") (param i32 i32))
    (func $warn     (import "console" "warn") (param i32))
    (func $error    (import "console" "error") (param i32))
    (func $memdump  (import "console" "memdump") (param i32 i32))

    (func $exit     (import "env" "exit"))
    (func $init     (import "env" "init"))


    (memory $memory 1 10 shared)
    (export "memory" (memory $memory))


    (func $dump 
        (param $nextOffset i32)
        (local $byteOffset i32)
        (local $byteLength i32)

        (if (i32.load (local.get $nextOffset) ) (then

            (local.set $byteOffset 
                (i32.add (i32.const 8) (local.get $nextOffset))
            )

            (local.set $byteLength 
                (i32.load (i32.add (i32.const 4) (local.get $nextOffset)))
            )

            
            (call $log (local.get $byteLength))

            ;; console.log packet info
            (call $memdump 
                (local.get $byteOffset)
                (local.get $byteLength)
            ) 
            
            (call $dump (i32.load (local.get $nextOffset)))
        ))
    )

    (func $align
        (param $value i32)
        (param $bytes i32)
              (result i32)
        (local $rem_u i32)
              
        (local.set $rem_u 
            (i32.rem_u 
                (local.get $value)
                (local.get $bytes))
        )

        (if (local.get $rem_u) (then
            (local.set $value 
                (i32.add
                    (local.get $value)
                    (i32.sub
                        (local.get $bytes)
                        (local.get $rem_u)))))
        )

        (return (local.get $value))
    )

    (func $malloc 
        (param $byteLength i32)
                   (result i32)

        (local $byteOffset i32)
        (local $allocBytes i32)


        (local.set $allocBytes 
            (i32.add 
                (local.get $byteLength)
                (i32.const 8))
        ) ;; headers = byteLength + 8

        (local.set $allocBytes 
            (call $align 
                (local.get $allocBytes)
                (i32.const 8))
        ) ;; aligned = allocBytes % 8


        (block $loop (loop $next

            (br_if $loop (i32.eq (i32.const 0)
                (i32.load( local.get $byteOffset ))
            ))

            (local.set $byteOffset
                (i32.load( local.get $byteOffset ))
            )

            (br $next))
        )

        (i32.store
            (local.get $byteOffset)
            (i32.add 
                (local.get $byteOffset)
                (local.get $allocBytes) 
            )
        )

        (i32.store
            (i32.add (i32.const 4) (local.get $byteOffset))
            (local.get $byteLength)
        )

        (return 
            (i32.add (i32.const 8) (local.get $byteOffset))
        )
    )

    (func $defineProperty
        (result i32)
        ;;get next type id

        (local $byteLength i32)
        (local $byteOffset i32)
        
        (local $resvTypeId i32)

        (local.set $byteLength (i32.const 4))
        (local.set $byteOffset
            (call $malloc (local.get $byteLength))
        )

        (local.set $resvTypeId                 
            (i32.const 35)
        )

        (i32.store 
            (local.get $byteOffset)
            (local.get $resvTypeId)
        )
            
        (return (local.get $byteOffset))
    )

    (func (export "main") 
        (local $TYPE i32)
    
    (call $init)


        (local.set $TYPE (call $defineProperty))
        (call $log (local.get $TYPE) )

        (drop (call $malloc (i32.const 21)))
        (drop (call $malloc (i32.const 82)))
        (drop (call $malloc (i32.const 3)))



        (call $dump (i32.const 0))
    
    (call $exit)
    )
)