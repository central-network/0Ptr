(module

    (func $log      (import "console" "log") (param i32))
    (func $log2     (import "console" "log") (param i32 i32))
    (func $warn     (import "console" "warn") (param i32))
    (func $error    (import "console" "error") (param i32))
    (func $memdump  (import "console" "memdump") (param i32 i32))
    (func $exit     (import "env" "exit"))

    (memory $memory 1 10 shared)
    (export "memory"
    (memory $memory))

    (global $headLength i32 (i32.const 12))
    (global $sizeOffset i32 (i32.const  4))
    (global $typeOffset i32 (i32.const  8))
    (global $alignBytes i32 (i32.const  8))

    (global $TYPEofTYPE i32 (i32.const  1))
    (global $SIZEofTYPE i32 (i32.const  4))


    ;; see what happens with console.log
    (func $dump 
        (param $nextOffset i32)
        (local $byteOffset i32)
        (local $byteLength i32)

        (if (i32.load (local.get $nextOffset) ) (then

            (local.set $byteOffset 
                (i32.add 
                    (local.get $nextOffset)
                    (global.get $headLength)
                )
            )

            (local.set $byteLength 
                (i32.load
                    (i32.add 
                        (local.get $nextOffset)
                        (global.get $sizeOffset)
                    )
                )
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


    ;; change bytesize for stability
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


    ;; check loop is finished
    (func $br_if
        (param $byteOffset i32)
                   (result i32)

        (local $r i32)
        (local $O i32)

        (local.set $O 
            (i32.load 
                (local.get $byteOffset)))

        (if (i32.eq (local.get $O) (i32.const 0))
        (then       (local.set $r  (i32.const 1)))
        (else       (local.set $r  (i32.const 0))))

        (return (local.get $r))
    )


    ;; reserv BYTELENGTH for TYPE   
    (func $malloc 
        (param $byteLength i32)
        (param $mallocType i32)
                   (result i32)

        (local $byteOffset i32)
        (local $allocBytes i32)


        (local.set $allocBytes 
            (i32.add 
                (local.get $byteLength)
                (global.get $headLength)
            )
        ) ;; headers = byteLength + 12

        (local.set $allocBytes 
            (call $align 
                (local.get $allocBytes)
                (global.get $alignBytes)
            )
        ) ;; aligned = allocBytes % 8

        (block $loop (loop $next

            (br_if $loop (call 
            $br_if(local.get $byteOffset)))

            (local.set $byteOffset
                (i32.load 
                    (local.get $byteOffset)
                )
            )

            (br $next)
        ))
        ;; til the end of allocs

        (i32.store
            (local.get $byteOffset)
            (i32.add 
                (local.get $byteOffset)
                (local.get $allocBytes) 
            )
        )
        ;; save the green keep'n mind

        (i32.store
            (i32.add 
                (local.get $byteOffset)
                (global.get $sizeOffset)
            )
            (local.get $byteLength)
        )
        ;; size header -> byteLength

        (i32.store
            (i32.add 
                (local.get $byteOffset)
                (global.get $typeOffset)
            )
            (local.get $mallocType)
        )
        ;; type header -> identifier

        (return (i32.add 
            (local.get $byteOffset)
            (global.get $headLength)
        )) ;; NOT including headers
    )


    ;; count of registered types
    (func $typeCount 
        (param $mallocType i32)
                   (result i32)

        (local $byteOffset i32)
        (local $count      i32)
        (local $offsetType i32)

        (block $loop (loop $next

            (br_if $loop (call 
            $br_if(local.get $byteOffset)))

            (local.set $offsetType
                (i32.load 
                    (i32.add 
                        (local.get $byteOffset)
                        (global.get $typeOffset)
                    )
                )
            ) ;; read type of current packet

            (if (i32.eq 
                (local.get $mallocType)
                (local.get $offsetType)) ;; matched
                
                (then
                    (local.set $count 
                        (i32.add
                            (i32.const 1)
                            (local.get $count)
                        ) ;; increase 1
                    )
                )
            ) ;; check requested type id

            (local.set $byteOffset 
                (i32.load
                    (local.get $byteOffset)
                )
            ) ;; jump to next            
        
            (br $next))
        )

        (return (local.get $count))
    )


    ;; register new type identifier
    (func $nextTypeId 
        (result i32)

        (local $byteOffset i32)
        
        (local.set $byteOffset
            (call $malloc
                (global.get $SIZEofTYPE)
                (global.get $TYPEofTYPE)))

        (i32.store 
            (local.get $byteOffset)
            (i32.add 
                (i32.const 1) 
                (call $typeCount (global.get $TYPEofTYPE))) 
        )
            
        (return (local.get $byteOffset))
    )


    ;; trigger from js
    (func $init (export "init")

        (local $newTypeOffset i32)
        (local $newTypeOffset2 i32)
    
        (drop (call $malloc (i32.const 21) (i32.const 1)))
        (drop (call $malloc (i32.const 82) (i32.const 1)))
        (drop (call $malloc (i32.const 3 ) (i32.const 0)))


        (local.set $newTypeOffset (call $nextTypeId))
        (call $error (local.get $newTypeOffset) )

        (local.set $newTypeOffset2 (call $nextTypeId))
        (call $error (local.get $newTypeOffset2) )

        (call $dump (i32.const 0))
    )


    (func $main
        ;; attention: runs before WASM.instantiate 
        ;; you could NOT see somethings on console 
    )(start $main)
)