(module $gl

    (type $t0 (func (param externref i32) (result i32)))

    (func $log          (import "console" "log") (param i32))
    (func $log2         (import "console" "log") (param i32 i32))
    (func $log3xi32     (import "console" "log") (param i32 i32 i32))
    (func $log4xf32     (import "console" "log") (param f32 f32 f32 f32))
    (func $warn         (import "console" "warn") (param i32))
    (func $error        (import "console" "error") (param i32))
    (func $memdump      (import "console" "memdump") (param i32 i32 i32))
    
    (memory $memory 10 100 shared)

    (global $PTR_BYTELENGTH     i32 (i32.const 64))
    (global $PTR_ALIGNBYTES     i32 (i32.const  8))

    (global $OFFSET_NEXTOFFSET  i32 (i32.const  0))
    (global $OFFSET_BYTELENGTH  i32 (i32.const  4))
    (global $OFFSET_TYPE        i32 (i32.const  8))
    (global $OFFSET_STATE       i32 (i32.const 12))
    (global $OFFSET_PARENT      i32 (i32.const 16))
    (global $OFFSET_LINK        i32 (i32.const 20))
    (global $OFFSET_IS_UPDATED  i32 (i32.const 24))
    (global $OFFSET_IS_UPLOADED i32 (i32.const 28))
    (global $OFFSET_ITER_OFFSET i32 (i32.const 32))
    (global $OFFSET_ITER_LENGTH i32 (i32.const 36))

    ;; beggining of SIMD operations
    (func $SIMDf32x4mul 
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
        (param $byteOffset i32)
            (local $nextOffset i32)
            (local $byteLength i32)

            (if (i32.load (local.get $byteOffset) ) (then

                (local.set $nextOffset 
                    (i32.add 
                        (local.get $byteOffset)
                        (global.get $PTR_BYTELENGTH)
                    )
                )

                (local.set $byteLength 
                    (i32.load
                        (i32.add 
                            (local.get $byteOffset)
                            (global.get $OFFSET_BYTELENGTH)
                        )
                    )
                )

                ;; console.log packet info
                (call $memdump 
                    (local.get $nextOffset)
                    (local.get $byteLength)
                    (i32.load
                        (i32.add 
                            (i32.sub 
                                (local.get $nextOffset)
                                (global.get $PTR_BYTELENGTH)
                            )
                            (global.get $OFFSET_TYPE)
                        )
                    )
                ) 
                
                (call $dump (i32.load (local.get $byteOffset)))
            ))
    )

    ;; change byteLength for stability
    (func $align
        (param $byteLength i32)
        (param $PTR_ALIGNBYTES i32) (result i32)
            (local $rem_u i32)
                
            (local.set $rem_u 
                (i32.rem_u 
                    (local.get $byteLength)
                    (local.get $PTR_ALIGNBYTES))
            )

            (if (local.get $rem_u) (then
                (local.set $byteLength 
                    (i32.add
                        (local.get $byteLength)
                        (i32.sub
                            (local.get $PTR_ALIGNBYTES)
                            (local.get $rem_u)))))
            )

            (return (local.get $byteLength))
    )

    ;; check loop is finished
    (func $br_if
        (param $byteOffset i32) (result i32)

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
        (param $mallocType i32) (result i32)

            (local $byteOffset i32)
            (local $allocBytes i32)


            (local.set $allocBytes 
                (i32.add 
                    (local.get $byteLength)
                    (global.get $PTR_BYTELENGTH)
                )
            ) ;; headers = byteLength + 12

            (local.set $allocBytes 
                (call $align 
                    (local.get $allocBytes)
                    (global.get $PTR_ALIGNBYTES)
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
                    (global.get $OFFSET_BYTELENGTH)
                )
                (local.get $byteLength)
            )
            ;; size header -> byteLength

            (i32.store
                (i32.add 
                    (local.get $byteOffset)
                    (global.get $OFFSET_TYPE)
                )
                (local.get $mallocType)
            )
            ;; type header -> identifier

            (return (i32.add 
                (local.get $byteOffset)
                (global.get $PTR_BYTELENGTH)
            )) ;; NOT including headers
    )

    ;; count of registered types
    (func $typeCount 
        (param $mallocType i32) (result i32)

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
                            (global.get $OFFSET_TYPE)
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

    ;; malloc header setter
    (func $setHeader
        (param $ptri i32)
        (param $value i32)
        (param $header i32)

            (i32.store 
                (i32.add 
                    (local.get $header)
                    (i32.sub 
                        (local.get $ptri)
                        (global.get $PTR_BYTELENGTH)
                    )
                )
                (local.get $value)
            )
    )

    ;; malloc header getter
    (func $getHeader
        (param $ptri i32)
        (param $header i32) (result i32)

            (i32.load 
                (i32.add 
                    (local.get $header)
                    (i32.sub 
                        (local.get $ptri)
                        (global.get $PTR_BYTELENGTH)
                    )
                )
            )
    )

    ;; malloc header getter
    (func $isPointer
        (param $ptri i32) (result i32)

            (local $is         i32)
            (local $byteOffset i32)
            (local $ptriOffset i32)

            (if (local.get $ptri)
            (then
                (local.set $ptriOffset
                    (i32.sub 
                        (local.get $ptri)
                        (global.get $PTR_BYTELENGTH)
                    )
                )

                (if (call $getType (local.get $ptri))
                (then
                    (block $loop (loop $next

                        (br_if $loop (call 
                        $br_if(local.get $byteOffset)))

                        (if (i32.eq 
                            (local.get $ptriOffset)
                            (local.get $byteOffset)) ;; matched
                            
                            (then
                                (local.set $is (i32.const 1))
                                (br $loop)
                            )
                        ) ;; check offset match

                        (local.set $byteOffset 
                            (i32.load (local.get $byteOffset))
                        ) ;; jump to next            
                    
                        (br $next))
                    )
                ))   
            ))

            (local.get $is)         
    )

    ;; shortcut for setHeader
    (func $setType
        (param $ptri i32)
        (param $type i32)
            
            (call $setHeader 
                (local.get  $ptri)
                (local.get  $type)
                (global.get $OFFSET_TYPE)
            )
            
    )

    ;; shortcut for getHeader
    (func $getType
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_TYPE)
            )
    )

    ;; shortcut for setHeader
    (func $setParent
        (param $ptri i32)
        (param $parent i32)
            
            (call $setHeader 
                (local.get  $ptri)
                (local.get  $parent)
                (global.get $OFFSET_PARENT)
            )
            
    )

    ;; shortcut for getHeader
    (func $getParent
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_PARENT)
            )
    )

    ;; shortcut for getHeader
    (func $getByteLength
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_BYTELENGTH)
            )
    )

    ;; shortcut for setHeader
    (func $setLink
        (param $ptri i32)
        (param $link i32)
            
            (call $setHeader 
                (local.get  $ptri)
                (local.get  $link)
                (global.get $OFFSET_LINK)
            )
            
    )

    ;; shortcut for getHeader
    (func $getLink
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_LINK)
            )
            
    )

    ;; shortcut for setHeader
    (func $setState
        (param $ptri i32)
        (param $state i32)
            
            (call $setHeader 
                (local.get  $ptri)
                (local.get  $state)
                (global.get $OFFSET_STATE)
            )
            
    )

    ;; shortcut for getHeader
    (func $getState
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_STATE)
            )
            
    )

    ;; shortcut for setHeader
    (func $setIsUpdated
        (param $ptri i32)
        (param $is i32)
            
            (call $setHeader 
                (local.get  $ptri)
                (local.get  $is)
                (global.get $OFFSET_IS_UPDATED)
            )
            
    )

    ;; shortcut for getHeader
    (func $getIsUpdated
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_IS_UPDATED)
            )
            
    )

    ;; shortcut for setHeader
    (func $setIsUploaded
        (param $ptri i32)
        (param $is i32)
            
            (call $setHeader 
                (local.get  $ptri)
                (local.get  $is)
                (global.get $OFFSET_IS_UPLOADED)
            )
            
    )

    ;; shortcut for getHeader
    (func $getIsUploaded
        (param $ptri i32) (result i32)
            
            (call $getHeader 
                (local.get  $ptri)
                (global.get $OFFSET_IS_UPLOADED)
            )
            
    )
    
    ;; triggers from js
    (func $init
        (call $dump 
            (i32.const 0))
    )

    ;; find next children of ptri
    (func $nextChild
        (param $ptri i32)
        (param $byteOffset i32) (result i32)

            (local $child i32)

            (if (local.get $byteOffset)(then
                (local.set $byteOffset 
                    (i32.load (i32.sub
                        (local.get $byteOffset)
                        (global.get $PTR_BYTELENGTH)
                    ))
                ) 
            )) ;; has previous -> jump nexf of previous

            (block $loop (loop $next

                (br_if $loop (call 
                $br_if(local.get $byteOffset)))

                (if (i32.eq 
                    
                        (local.get $ptri)
                        (i32.load 
                            (i32.add 
                                (local.get $byteOffset)
                                (global.get $OFFSET_PARENT)
                            )
                        )

                ) (; matched ;) (then

                    (local.set $child 
                        (i32.add 
                            (local.get $byteOffset)
                            (global.get $PTR_BYTELENGTH)
                        )
                    )

                    (br $loop) ;; break loop 
                
                )) ;; end if

                (local.set $byteOffset 
                    (i32.load (local.get $byteOffset))
                ) ;; jump to next            
            
                (br $next))
            )

            (return (local.get $child))
    )


    (export "memory"            (memory $memory))
    (export "malloc"            (func $malloc))
    (export "init"              (func $init))
    (export "SIMDf32x4mul"      (func $SIMDf32x4mul)) 

    (export "isPointer"         (func $isPointer)) 
    (export "nextChild"         (func $nextChild)) 

    (export "setHeader"         (func $setHeader)) 
    (export "setType"           (func $setType)) 
    (export "setParent"         (func $setParent)) 
    (export "setLink"           (func $setLink)) 
    (export "setIsUpdated"      (func $setIsUpdated)) 
    (export "setIsUploaded"     (func $setIsUploaded))

    (export "getHeader"         (func $getHeader)) 
    (export "getByteLength"     (func $getByteLength)) 
    (export "getType"           (func $getType)) 
    (export "getParent"         (func $getParent)) 
    (export "getLink"           (func $getLink)) 
    (export "isUpdated"         (func $getIsUpdated)) 
    (export "isUploaded"        (func $getIsUploaded))

    (export "BYTELENGTH"        (global $OFFSET_BYTELENGTH  ))
    (export "TYPE"              (global $OFFSET_TYPE        ))
    (export "STATE"             (global $OFFSET_STATE       ))
    (export "PARENT"            (global $OFFSET_PARENT      ))
    (export "LINK"              (global $OFFSET_LINK        ))
    (export "IS_UPDATED"        (global $OFFSET_IS_UPDATED  ))
    (export "IS_UPLOADED"       (global $OFFSET_IS_UPLOADED ))
    (export "ITER_OFFSET"       (global $OFFSET_ITER_OFFSET ))
    (export "ITER_LENGTH"       (global $OFFSET_ITER_LENGTH ))


)