(module

    (func $log      (import "console" "log") (param i32))
    (func $log2     (import "console" "log") (param i32 i32))
    (func $log3xi32 (import "console" "log") (param i32 i32 i32))
    (func $log4xf32 (import "console" "log") (param f32 f32 f32 f32))

    (func $warn     (import "console" "warn") (param i32))
    (func $error    (import "console" "error") (param i32))
    (func $memdump  (import "console" "memdump") (param i32 i32))
    (func $exit     (import "env" "exit"))

    (memory $memory 1 10 shared)
    (export "memory" (memory $memory))

    (global $headLength i32 (i32.const 12))
    (global $sizeOffset i32 (i32.const  4))
    (global $typeOffset i32 (i32.const  8))
    (global $alignBytes i32 (i32.const  8))

    (global $TYPEofTYPE i32 (i32.const  1))
    (global $SIZEofTYPE i32 (i32.const  4))


    ;; just testing SIMD operations
    (func $SIMDf32x4mul 
    (export "SIMDf32x4mul") 

        (param $inA i32) ;; vec4 ---> read  offset for 16 bytes / 4 element [ f32, f32, f32, f32 ]
        (param $inB i32) ;; vec4 ---> read  offset for 16 bytes / 4 element [ f32, f32, f32, f32 ]
        (param $out i32) ;; vec4 ---> write offset for 16 bytes / 4 element [ f32, f32, f32, f32 ]
            (result i32) ;; just notify user with NO BYTE

        (v128.store (local.get $out)
            (f32x4.mul 
                (v128.load (local.get $inA)) 
                (v128.load (local.get $inB))
            )
        )

        (i32.const 0)
        (;
            ;;https://github.com/WebAssembly/testsuite
            ;;/blob/6dfedc8b8423a91c1dc340d3af1a7f4fbf7868b4
            ;;/simd_load.wast
            
            (local $i i32) 
            (local $j i32)
            (local $k i32)

            (local.set $i (i32.const 240))
            (local.set $j (i32.const 256))
            (local.set $k (i32.const 272))

            (v128.store (local.get $i) (v128.const 
                f32x4 
                    0x00000043 0x0000803f 0x6666e63f 0x000080bf
            ;;             128        1.0       1.8          -1
            ))

            (v128.store (local.get $j) (v128.const 
                f32x4 
                    0x00000040 0x00000040 0x00000040 0x00000040 
            ;;             2.0        2.0        2.0        2.0
            ))

            (v128.store (local.get $k) (v128.const 
                i32x4 
                    0x03020100 0x07060504 0x0b0a0908 0x0f0e0d0c
            ))

            (v128.store (local.get $k) (v128.const 
                i16x8 
                    0x0302 0x0100 0x0706 0x0504 
                    0x0b0a 0x0908 0x0f0e 0x0d0c
            ))

            (v128.store (local.get $k) (v128.const 
                i8x16 
                    0x03 0x02 0x01 0x00 
                    0x07 0x06 0x05 0x04 
                    0x0b 0x0a 0x09 0x08 
                    0x0f 0x0e 0x0d 0x0c
            ))

            (call $log4xf32 
                (f32.load (local.get $k))
                (f32.load (i32.add (local.get $k) (i32.const  4)))
                (f32.load (i32.add (local.get $k) (i32.const  8)))
                (f32.load (i32.add (local.get $k) (i32.const 12)))
            )

            ;; 128  1.0  1.8   -1
            ;; 2.0  2.0  2.0  2.0
            (v128.store (local.get $k)
                (f32x4.mul 
                    (v128.load (local.get $i)) 
                    (v128.load (local.get $j))
                )
            )

            (call $log4xf32 
                (f32.load (local.get $k))
                (f32.load (i32.add (local.get $k) (i32.const  4)))
                (f32.load (i32.add (local.get $k) (i32.const  8)))
                (f32.load (i32.add (local.get $k) (i32.const 12)))
            )


            ;; 2 2 2 2  +  3 3 3 3  =  5 5 5 5
            (v128.store (local.get $k)
                (i8x16.add 
                    (v128.load (local.get $k)) 
                    (v128.load (local.get $j))
                )
            )

            (call $log4xf32 
                (f32.load (local.get $k))
                (f32.load (i32.add (local.get $k) (i32.const  4)))
                (f32.load (i32.add (local.get $k) (i32.const  8)))
                (f32.load (i32.add (local.get $k) (i32.const 12)))
            )
        ;)

    )


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


    ;; triggers from js
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