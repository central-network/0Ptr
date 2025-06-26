

    (func   $Memory*                                                                                        (type $ext->i32)
        local($memory* i32)

        call($set<memory*.buffer#>      local($memory*) local(0))
        call($set<memory*.bufferSize>   local($memory*) local(0).byteLength i32)
        call($set<memory*.bufferType>   local($memory*) elem($Memory))
        call($set<memory*.byteLength>   local($memory*) size($Memory))
        call($set<memory*.pointerBase*> local($memory*) (new $PointerBase* local($memory*)))

        local($memory*)
    )

    (func   $get<memory*>bufferSize                                                                         (type $i32->i32) i32(get local(0)))
    (func   $set<memory*.bufferSize>                                                                         (type $i32x2->) i32(set local(0) local(1)))

    (func   $get<memory*>bufferType                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($Memory.bufferType))))
    (func   $set<memory*.bufferType>                                                                         (type $i32x2->) i32(set i32(sum local(0) offset($Memory.bufferType)) local(1)))

    (func   $get<memory*>pointerBase*                                                                       (type $i32->i32) i32(get i32(sum local(0) offset($Memory.pointerBase*))))
    (func   $set<memory*.pointerBase*>                                                                       (type $i32x2->) i32(set i32(sum local(0) offset($Memory.pointerBase*)) local(1)))

    (func   $get<memory*>byteLength                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($Memory.byteLength))))
    (func   $set<memory*.byteLength>                                                                         (type $i32x2->) i32(set i32(sum local(0) offset($Memory.byteLength)) local(1)))
    (func   $add<memory*.byteLength>                                                                      (type $i32x2->i32) i32(add i32(sum local(0) offset($Memory.byteLength)) local(1)))

    (func   $get<memory*>#buffer                                                                            (type $i32->i32) i32(get i32(sum local(0) offset($Memory.#buffer))))
    (func   $set<memory*.#buffer>                                                                            (type $i32x2->) i32(set i32(sum local(0) offset($Memory.#buffer)) local(1)))

    (func   $get<memory*>buffer#                                                                            (type $i32->ext) i32(ext (call $get<memory*>#buffer local(0))))
    (func   $set<memory*.buffer#>                                                                          (type $i32.ext->) call($set<memory*.#buffer> local(0) table(add $ext local(1))))


    (func   $grow<memory*.byteLength>                                                                     (type $i32x2->i32)
        i32(sum local(0) call($add<memory*.byteLength> local(0) local(1)))
    )

    (func   $grow<memory*.byteOffset.byteLength>                                                             (type $i32x3->)
        local($memory* i32)
        local($target  i32)
        local($start   i32)
        local($length  i32)
        local($memsize i32)
        local($newsize i32)

        local(set $memory*  local(0))
        local(set $start    local(1))
        local(set $memsize  call($get<memory*>byteLength local($memory*)))
        local(set $newsize  i32(sum local($memsize) local(2)))

        local(set $start    i32(sum local($start)   local($memory*))) 
        local(set $target   i32(sum local($start)   local(2)))
        local(set $length   i32(dif local($memsize) local(1)))

        memory(copy local($target) local($start) local($length))
        memory(fill local($start) i32(0) local(2))

        call($set<memory*.byteLength> local($memory*) local($newsize))
    )
    
    (func   $shrink<memory*.byteOffset.byteLength>                                                           (type $i32x3->)
        local($memory* i32)
        local($target  i32)
        local($start   i32)
        local($length  i32)
        local($memsize i32)
        local($newsize i32)

        local(set $memory*  local(0))
        local(set $target   i32(add local(1) local($memory*)))
        local(set $memsize  call($get<memory*>byteLength local($memory*)))
        local(set $newsize  i32(sub local($memsize) local(2)))

        local(set $length   i32(sub i32(dif local($memsize) local(1)) local(2)))
        local(set $start    i32(add local($target)  local(2))) 

        memory(copy local($target) local($start) local($length))
        memory(fill local($newsize) i32(0) local(2))

        call($set<memory*.byteLength> local($memory*) local($newsize))
    )
    
    (func   $move<memory*.byteOffset.byteLength.byteOffset>                                                  (type $i32x4->)
        call($grow<memory*.byteOffset.byteLength>
            local(0) local(3) local(2)
        )

        memory(copy
            i32(sum local(0) i32(sum local(3) local(0)))
            i32(sum local(0) i32(sum local(1) local(0))) local(2)
        )

        call($shrink<memory*.byteOffset.byteLength>
            local(0) local(1) local(2)
        )
    )
    
    (func   $PointerBase*                                                                                   (type $i32->i32)    
        local($memory* i32)
        local($pointerBase* i32)
        local($count i32)
        local($length i32)
        local($baseLength i32)
        local($matrixBase* i32)
        local($baseByteLength i32)
        local($baseByteOffset i32)
        local($arrayType i32)
        local($rowLength i32)
        local($colLength i32)
        local($prev* i32)
        local($offset i32)
        local($base.bufferType* i32)
        local($base.byteOffset* i32)
        local($base.parentPtri* i32)

        local($BYTES_PER_ELEMENT i32)
        local($BYTES_PER_MATRIX i32)
        local($ELEMENTS_PER_MATRIX i32)

        local(set $memory*          local(0))
        local(set $rowLength        i32(1))
        local(set $count            i32(3))
        local(set $length           i32(512))
        local(set $pointerBase*     call($grow<memory*.byteLength> local($memory*) size($PointerBase)))

        call($set<pointerBase*.memory*>          local($pointerBase*) local($memory*))
        call($set<pointerBase*.length>           local($pointerBase*) local($length))
        call($set<pointerBase*.count>            local($pointerBase*) local($count))

        call($set<pointer*.bufferSize>           local($pointerBase*) size($PointerBase))
        call($set<pointer*.bufferType>           local($pointerBase*) elem($PointerBase))
        call($set<pointer*.nextBuffer>           local($pointerBase*) i32(sum size($PointerBase) local($pointerBase*)))

        (loop $matrixBases 

            (if (i32.eqz local($matrixBase*)) (then 
            (if (i32.eqz local($base.byteOffset*)) (then 
                local(set $colLength i32(4))
                local(set $arrayType type($Int32Array))

                local(set $baseLength       i32(div local($length) local($colLength)))
                local(set $baseByteLength   i32(sum size($MatrixBase) i32(mul local($baseLength) call($BYTES_PER_ELEMENT local($arrayType)))))

                local(set $matrixBase*      i32(1))
                local(set $baseByteOffset   (call $grow<memory*.byteLength> local($memory*) local($baseByteLength)))
                local(set $base.byteOffset* local($baseByteOffset))

                call($set<pointerBase*.base.byteOffset*> local($pointerBase*) local($matrixBase*))
            )))) 

            (if (i32.eqz local($matrixBase*)) (then 
            (if (i32.eqz local($base.bufferType*)) (then 
                local(set $colLength i32(16))
                local(set $arrayType type($Int8Array))

                local(set $baseLength       i32(div local($length) local($colLength)))
                local(set $baseByteLength   i32(sum size($MatrixBase) i32(mul local($baseLength) call($BYTES_PER_ELEMENT local($arrayType)))))

                local(set $matrixBase*      i32(2))
                local(set $baseByteOffset   (call $grow<memory*.byteLength> local($memory*) local($baseByteLength)))
                local(set $base.bufferType* local($baseByteOffset))

                call($set<pointerBase*.base.bufferType*> local($pointerBase*) local($matrixBase*))
                call($set<pointer*.nextBuffer> call($get<pointerBase*>base.byteOffset* local($pointerBase*)) local($baseByteOffset) )
            )))) 

            (if (i32.eqz local($matrixBase*)) (then 
            (if (i32.eqz local($base.parentPtri*)) (then 
                local(set $colLength i32(4))
                local(set $arrayType type($Int32Array))

                local(set $baseLength       i32(div local($length) local($colLength)))
                local(set $baseByteLength   i32(sum size($MatrixBase) i32(mul local($baseLength) call($BYTES_PER_ELEMENT local($arrayType)))))

                local(set $matrixBase*      i32(3))
                local(set $baseByteOffset   call($grow<memory*.byteLength> local($memory*) local($baseByteLength)))
                local(set $base.parentPtri* local($baseByteOffset))

                call($set<pointerBase*.base.parentPtri*> local($pointerBase*) local($matrixBase*))
                call($set<pointer*.nextBuffer> call($get<pointerBase*>base.byteOffset* local($pointerBase*)) local($baseByteOffset) )
                call($set<pointer*.nextBuffer> local($pointerBase*) call($get<memory*>byteLength local($memory*)))
            )))) 

            (if local($matrixBase*)
                (then 
                    call($set<pointerBase*.prevBuffer>         local($pointerBase*)    local($baseByteOffset))
                    call($set<pointer*.bufferSize>             local($baseByteOffset)  local($baseByteLength))
                    call($set<pointer*.bufferType>             local($baseByteOffset)  elem($MatrixBase))

                    local(set $BYTES_PER_MATRIX    call($BYTES_PER_MATRIX    local($arrayType) local($rowLength) local($colLength)))
                    local(set $BYTES_PER_ELEMENT   call($BYTES_PER_ELEMENT   local($arrayType)))
                    local(set $ELEMENTS_PER_MATRIX call($ELEMENTS_PER_MATRIX local($rowLength) local($colLength)))

                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.arrayType))  local($arrayType))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.memory*))    local($memory*))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.count))      local($count))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.length))     local($length))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.rowLength))  local($rowLength))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.colLength))  local($colLength))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.colLength))  local($colLength))

                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.BYTES_PER_MATRIX))    local($BYTES_PER_MATRIX))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.BYTES_PER_ELEMENT))   local($BYTES_PER_ELEMENT))
                    i32(set i32(sum local($baseByteOffset) offset($MatrixBase.ELEMENTS_PER_MATRIX)) local($ELEMENTS_PER_MATRIX))

                    local(set $matrixBase* i32(0)) 
                    br $matrixBases
                )
            )
        )

        local(set $offset i32(0))
        i32(set i32(sum i32(sum local($base.bufferType*) size($MatrixBase)) local($offset ++)) elem($MatrixBase))
        i32(set i32(sum i32(sum local($base.bufferType*) size($MatrixBase)) local($offset ++)) elem($MatrixBase))
        i32(set i32(sum i32(sum local($base.bufferType*) size($MatrixBase)) local($offset ++)) elem($MatrixBase))

        local(set $offset i32(0))
        i32(set i32(sum i32(sum local($base.byteOffset*) size($MatrixBase)) local($offset += 4)) local($base.byteOffset*))
        i32(set i32(sum i32(sum local($base.byteOffset*) size($MatrixBase)) local($offset += 4)) local($base.bufferType*))
        i32(set i32(sum i32(sum local($base.byteOffset*) size($MatrixBase)) local($offset += 4)) local($base.parentPtri*))

        local($pointerBase*)
    )

    (func   $get<*>typeof                                                                                   (type $i32->i32)
        i32(get 
            call($get<matrixBase*.index.laneid>byteOffset
                global($base.bufferType*) 
                i32(div local(0) i32(16))
                i32(mod local(0) i32(16))
            )
        )
    )

    (func   $get<*>offset                                                                                   (type $i32->i32)
        i32(get 
            call($get<matrixBase*.index.laneid>byteOffset
                global($base.byteOffset*) 
                i32(div local(0) i32(4))
                i32(mod local(0) i32(4))
            )
        )
    )

    (func   $get<*>parent*                                                                                  (type $i32->i32)
        i32(get 
            call($get<matrixBase*.index.laneid>byteOffset
                global($base.parentPtri*) 
                i32(div local(0) i32(4))
                i32(mod local(0) i32(4))
            )
        )
    )

    (func   $malloc<bufferType.bufferSize>*                                                               (type $i32x2->i32)
        local($memory*      i32)
        local($pointer*     i32)
        local($pointerBase* i32)
        local($prev*        i32)
        local($index        i32)
        local($count        i32)

        local(set $memory*      global($memory*))
        local(set $pointerBase* call($get<memory*>pointerBase* global($memory*)))
        local(set $pointer*     call($grow<memory*.byteLength> global($memory*) local(1)))
        local(set $index        call($add<pointerBase*.count>  local($pointerBase*) i32(1)))
        
        call($set<matrixBase*.index.laneid.int>
            global($base.byteOffset*)
            i32(div local($index) i32(4))
            i32(mod local($index) i32(4))
            local($pointer*)
        )

        call($set<matrixBase*.index.laneid.int>
            global($base.bufferType*)
            i32(div local($index) i32(16))
            i32(mod local($index) i32(16))
            local(0)
        )
        
        call($set<pointer*.bufferType> local($pointer*) local(0))
        call($set<pointer*.bufferSize> local($pointer*) local(1))

        (if local(tee $prev* call($get<pointerBase*>prevBuffer local($pointerBase*))) 
            (then call($set<pointer*.nextBuffer> local($prev*) local($pointer*))))
        
        call($set<pointerBase*.prevBuffer> local($pointerBase*) local($pointer*))
        call($add<pointer*.bufferSize>     local($pointerBase*) local(1));

        local($index)
    )

    (func   $add<memory*.bufferType.bufferSize>*                                                          (type $i32x3->i32)
        local($memory*      i32)
        local($pointer*     i32)
        local($pointerBase* i32)
        local($prev*        i32)
        local($index        i32)
        local($count        i32)

        local(set $memory*      local(0))
        local(set $pointerBase* call($get<memory*>pointerBase* local($memory*)))
        local(set $pointer*     call($grow<memory*.byteLength> local($memory*) local(2)))
        local(set $index        call($add<pointerBase*.count>  local($pointerBase*) i32(1)))
        
        call($set<matrixBase*.index.laneid.int>
            global($base.byteOffset*)
            i32(div local($index) i32(4))
            i32(mod local($index) i32(4))
            local($pointer*)
        )

        call($set<matrixBase*.index.laneid.int>
            global($base.bufferType*)
            i32(div local($index) i32(16))
            i32(mod local($index) i32(16))
            local(1)
        )
        
        call($set<pointer*.bufferType> local($pointer*) local(1))
        call($set<pointer*.bufferSize> local($pointer*) local(2))

        (if local(tee $prev* call($get<pointerBase*>prevBuffer local($pointerBase*))) 
            (then call($set<pointer*.nextBuffer> local($prev*) local($pointer*))))
        
        call($set<pointerBase*.prevBuffer> local($pointerBase*) local($pointer*))
        call($add<pointer*.bufferSize>     local($pointerBase*) local(2));

        local($pointer*)
    )

    (func   $get<pointerBase*.index>type                                                                  (type $i32x2->i32)
        i32(0)
    )

    (func   $dump<pointerBase*>                                                                             (type $i32->ext)
        local($i i32)
        local(set $i (i32.load local(0)))
        
        (loop $++
            local($i).toObject(ptr)
            console.warn()
            
            (br_if $++ local(tee $i (i32.load local($i)) ))
        )

        (null)
    )

    (func   $grow<pointerBase*.pointer*.byteLength>                                                          (type $i32x3->)
        local($i i32)
        local($next i32)
        local($bufferSize.old i32)

        local(set $i (i32.load local(0)))
        local(set $bufferSize.old call($get<pointer*>bufferSize local(1)))

        (loop $++
            (if local(tee $next (i32.load local($i)))
                (then
                    (if (i32.ge_u local($i) local(1)) 
                        (then
                            call($add<pointer*.nextBuffer> 
                                local($i)
                                local(2)
                            );
                        )
                    )

                    local(set $i local($next))
                    br $++
                )
            )
        )

        call($add<pointer*.bufferSize>      local(1) local(2));
        call($add<pointer*.bufferSize>      local(0) local(2));
        call($add<pointerBase*.prevBuffer>  local(0) local(2));

        call($grow<memory*.byteOffset.byteLength>
            call($get<pointerBase*>memory* local(0)) 
            i32(sum local(1) local($bufferSize.old))
            local(2)
        )
    )

    (func   $shrink<pointerBase*.pointer*.byteLength>                                                        (type $i32x3->)
        local($i i32)
        local($next i32)
        local($bufferSize.new i32)

        local(set $i (i32.load local(0)))
        local(set $bufferSize.new 
            i32(dif call($get<pointer*>bufferSize local(1)) local(2))
        )

        (loop $++
            (if local(tee $next (i32.load local($i)))
                (then
                    (if (i32.ge_u local($i) local(1)) 
                        (then
                            call($del<pointer*.nextBuffer> 
                                local($i)
                                local(2)
                            );
                        )
                    )

                    local(set $i local($next))
                    br $++
                )
            )
        )

        call($del<pointer*.bufferSize>      local(1) local(2));
        call($del<pointer*.bufferSize>      local(0) local(2));
        call($del<pointerBase*.prevBuffer>  local(0) local(2));

        call($shrink<memory*.byteOffset.byteLength>
            call($get<pointerBase*>memory* local(0)) 
            i32(sum local(1) local($bufferSize.new))
            local(2)
        )
    )

    (func   $get<pointer*>pointerBase*                                                                      (type $i32->i32)
        local($i i32)
        local($base* i32)
        local(set $i LOOP_INIT)

        (loop $++
            (if i32(eq local(type $i) elem($PointerBase)) 
                (then local(set $base* local($i))))

            (if i32(eq local($i) local(0)) 
                (then (return local($base*))))
            
            (br_if $++ local(tee $i (i32.load local($i)) ))
        )

        (unreachable)
    )

    (func   $grow<pointer*.byteLength>                                                                       (type $i32x2->)
        call($grow<pointerBase*.pointer*.byteLength>
            call($get<pointer*>pointerBase* local(0)) local(0) local(1)
        )
    )

    (func   $shrink<pointer*.byteLength>                                                                     (type $i32x2->)
        call($shrink<pointerBase*.pointer*.byteLength>
            call($get<pointer*>pointerBase* local(0)) local(0) local(1)
        )
    )


    (func   $get<pointer*>nextBuffer                                                                        (type $i32->i32) i32(get local(0)))
    (func   $set<pointer*.nextBuffer>                                                                        (type $i32x2->) i32(set local(0) local(1)))
    (func   $add<pointer*.nextBuffer>                                                                     (type $i32x2->i32) i32(add local(0) local(1)))
    (func   $del<pointer*.nextBuffer>                                                                     (type $i32x2->i32) i32(sub local(0) local(1)))

    (func   $get<pointer*>bufferSize                                                                        (type $i32->i32) i32(get i32(sum local(0) offset($Pointer.bufferSize))))
    (func   $set<pointer*.bufferSize>                                                                        (type $i32x2->) i32(set i32(sum local(0) offset($Pointer.bufferSize)) local(1)))
    (func   $add<pointer*.bufferSize>                                                                     (type $i32x2->i32) i32(add i32(sum local(0) offset($Pointer.bufferSize)) local(1)))
    (func   $del<pointer*.bufferSize>                                                                     (type $i32x2->i32) i32(sub i32(sum local(0) offset($Pointer.bufferSize)) local(1)))

    (func   $get<pointerBase*>prevBuffer                                                                    (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.prevBuffer))))
    (func   $set<pointerBase*.prevBuffer>                                                                    (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.prevBuffer)) local(1)))
    (func   $add<pointerBase*.prevBuffer>                                                                 (type $i32x2->i32) i32(add i32(sum local(0) offset($PointerBase.prevBuffer)) local(1)))
    (func   $del<pointerBase*.prevBuffer>                                                                 (type $i32x2->i32) i32(sub i32(sum local(0) offset($PointerBase.prevBuffer)) local(1)))

    (func   $get<pointer*>bufferType                                                                        (type $i32->i32) i32(get i32(sum local(0) offset($Pointer.bufferType))))
    (func   $set<pointer*.bufferType>                                                                        (type $i32x2->) i32(set i32(sum local(0) offset($Pointer.bufferType)) local(1)))

    (func   $get<pointerBase*>byteLength                                                                    (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.byteLength))))
    (func   $set<pointerBase*.byteLength>                                                                    (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.byteLength)) local(1)))

    (func   $get<pointerBase*>byteOffset                                                                    (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.byteOffset))))
    (func   $set<pointerBase*.byteOffset>                                                                    (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.byteOffset)) local(1)))

    (func   $get<pointerBase*>count                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.count))))
    (func   $set<pointerBase*.count>                                                                         (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.count)) local(1)))
    (func   $add<pointerBase*.count>                                                                      (type $i32x2->i32) i32(add i32(sum local(0) offset($PointerBase.count)) local(1)))

    (func   $get<pointerBase*>length                                                                        (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.length))))
    (func   $set<pointerBase*.length>                                                                        (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.length)) local(1)))

    (func   $get<pointerBase*>memory*                                                                       (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.memory*))))
    (func   $set<pointerBase*.memory*>                                                                       (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.memory*)) local(1)))

    (func   $get<pointerBase*>base.bufferType*                                                              (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.base.bufferType*))))
    (func   $set<pointerBase*.base.bufferType*>                                                              (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.base.bufferType*)) local(1)))

    (func   $get<pointerBase*>base.byteOffset*                                                              (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.base.byteOffset*))))
    (func   $set<pointerBase*.base.byteOffset*>                                                              (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.base.byteOffset*)) local(1)))

    (func   $get<pointerBase*>base.parentPtri*                                                              (type $i32->i32) i32(get i32(sum local(0) offset($PointerBase.base.parentPtri*))))
    (func   $set<pointerBase*.base.parentPtri*>                                                              (type $i32x2->) i32(set i32(sum local(0) offset($PointerBase.base.parentPtri*)) local(1)))


    (func   $get<matrixBase*>baseName#                                                                      (type $i32->ext)
        local($matrixBase* i32)
        local($arguments#  ext)
        local($name#       ext)
        local($arrayType   i32)
        local($typedName#  ext)
        local($rowLength   i32)
        local($colLength   i32)
        
        local($i i32)
        local(set $matrixBase*  local(0))
        local(set $arrayType    call($get<matrixBase*>arrayType  local($matrixBase*)))
        local(set $rowLength    call($get<matrixBase*>rowLength  local($matrixBase*)))
        local(set $colLength    call($get<matrixBase*>colLength  local($matrixBase*)))
        local(set $arrayType    call($get<matrixBase*>arrayType  local($matrixBase*)))

        local(set $name#        [])
        local(set $typedName#
            call($get<arrayType>TypedArray#
                local($arrayType)
            ).name
        )

        Reflect(set
            local($name#)
            local($i ++)D 
            Reflect(call
                self.String.prototype.split
                local($typedName#)
                ['Array']
            )[ 0 ]
        )

        (if i32(ne local($rowLength) i32(1))
            (then Reflect(set local($name#) local($i ++)D 'Matrix'))
            (else Reflect(set local($name#) local($i ++)D 'Vector'))
        )

        (if i32(ne local($rowLength) i32(1))
            (then
                Reflect(set local($name#) local($i ++)D local($rowLength)D)
                Reflect(set local($name#) local($i ++)D String("x"))
            )
        )

        Reflect(set
            local($name#)
            local($i ++)D 
            local($colLength)D
        )

        Reflect(call 
            (self.Array.prototype.join) 
            local($name#)
            ['']
        )    
    )

    (func   $get<matrixBase*>baseArray#                                                                     (type $i32->ext)
        local($matrixBase*         i32)
        local($byteOffset          i32)
        local($length              i32)
        local($memory*             i32)
        local($buffer#             ext) 
        local($arguments#          ext)
        local($arrayType           i32)
        local($TypedArray          ext)
        
        local(set $matrixBase*  local(0))
        local(set $byteOffset   i32(sum size($MatrixBase)        local($matrixBase*)))
        local(set $memory*      call($get<matrixBase*>memory*    local($matrixBase*)))
        local(set $arrayType    call($get<matrixBase*>arrayType  local($matrixBase*)))
        local(set $TypedArray   call($get<arrayType>TypedArray#  local($arrayType)))
        local(set $buffer#      call($get<memory*>buffer#        local($memory*)))
        local(set $arguments#   Array())

        local(set $length
            (i32.mul
                call($get<matrixBase*>length local($matrixBase*))
                call($get<matrixBase*>ELEMENTS_PER_MATRIX local($matrixBase*))
            )
        )

        Reflect(set local($arguments#) i32(0)D local($buffer#))
        Reflect(set local($arguments#) i32(1)D local($byteOffset)D)
        Reflect(set local($arguments#) i32(2)D local($length)D)

        Reflect.new(local($TypedArray) local($arguments#))
    )

    (func   $get<matrixBase*>matrix.at#                                                                     (type $i32->ext)
        local($matrixBase*         i32)
        local($byteOffset          i32)
        local($index               i32)
        local($count               i32)
        local($length              i32)
        local($memory*             i32)
        local($buffer#             ext) 
        local($arguments#          ext)
        local($arrayType           i32)
        local($TypedArray          ext)
        
        local(set $matrixBase*  local(0))
        local(set $index        prompt("index")i32)
        local(set $count        call($get<matrixBase*>count local($matrixBase*)))

        (if i32(ltu local($count) local($index))
            (then return error("MAX_INDEX_EXCEED"))
        )

        local(set $memory*      call($get<matrixBase*>memory*             local($matrixBase*)))
        local(set $arrayType    call($get<matrixBase*>arrayType           local($matrixBase*)))
        local(set $TypedArray   call($get<arrayType>TypedArray#           local($arrayType)))
        local(set $buffer#      call($get<memory*>buffer#                 local($memory*)))
        local(set $length       call($get<matrixBase*>ELEMENTS_PER_MATRIX local($matrixBase*)))
        local(set $byteOffset   call($get<matrixBase*.index>byteOffset    local($matrixBase*) local($index)))

        local(set $arguments#   [])

        Reflect(set local($arguments#) i32(0)D local($buffer#))
        Reflect(set local($arguments#) i32(1)D local($byteOffset)D)
        Reflect(set local($arguments#) i32(2)D local($length)D)

        Reflect.new(local($TypedArray) local($arguments#))
    )

    (func   $get<matrixBase*.index>byteOffset                                                             (type $i32x2->i32)
        i32(sum 
            i32(sum local(0) size($MatrixBase))
            i32(mul local(1) call($get<matrixBase*>BYTES_PER_MATRIX local(0)))
        )
    )

    (func   $get<matrixBase*.index.laneid>byteOffset                                                      (type $i32x3->i32)
        (i32.add
            i32(mul local(2) call($get<matrixBase*>BYTES_PER_ELEMENT local(0))) 
            i32(sum 
                i32(sum local(0) size($MatrixBase)) 
                i32(mul local(1) call($get<matrixBase*>BYTES_PER_MATRIX local(0)))
            )
        )
    )

    (func   $set<matrixBase*.index.laneid.int>                                                               (type $i32x4->)
        local($matrixBase*       i32)
        local($length            i32)
        local($laneid            i32)
        local($index             i32)
        local($count             i32)
        local($value             i32)
        local($byteOffset        i32)
        local($BYTES_PER_MATRIX  i32)
        local($BYTES_PER_ELEMENT i32)

        local(set $matrixBase*       local(0))
        local(set $index             local(1))
        local(set $laneid            local(2))
        local(set $value             local(3))
        local(set $count             call($get<matrixBase*>count             local($matrixBase*)))
        local(set $length            call($get<matrixBase*>length            local($matrixBase*)))
        local(set $BYTES_PER_MATRIX  call($get<matrixBase*>BYTES_PER_MATRIX  local($matrixBase*)))
        local(set $BYTES_PER_ELEMENT call($get<matrixBase*>BYTES_PER_ELEMENT local($matrixBase*)))
        
        (if (i32.ge_u local($index) local($length))
            (then
                call($grow<pointer*.byteLength>
                    local($matrixBase*)
                    i32(mul 
                        local($BYTES_PER_MATRIX) 
                        local(tee $length i32(sum local($index) i32(100)))
                    )
                )
                call($set<matrixBase*.length> local($matrixBase*) local($length))
            )
        )

        (if (i32.ge_u local($index) local($count))
            (then call($set<matrixBase*.count> local($matrixBase*) local($index)))
        )

        local(set $byteOffset
            call($get<matrixBase*.index.laneid>byteOffset
                local($matrixBase*) local($index) local($laneid)
            )
        )

        i32(set local($byteOffset) local($value))
    )

    (func   $MatrixBase*                                                                                  (type $i32x5->i32)    
        local($matrixBase*         i32)
        local($arrayType           i32)
        local($length              i32)
        local($rowLength           i32)
        local($colLength           i32)
        local($memory*             i32)
        local($BYTES_PER_MATRIX    i32)
        local($BYTES_PER_ELEMENT   i32)
        local($ELEMENTS_PER_MATRIX i32)

        local(set $memory*           local(0))
        local(set $arrayType         local(1))
        local(set $rowLength         local(2))
        local(set $colLength         local(3))
        local(set $length            local(4))

        local(set $BYTES_PER_MATRIX    call($BYTES_PER_MATRIX    local($arrayType) local($rowLength) local($colLength)))
        local(set $BYTES_PER_ELEMENT   call($BYTES_PER_ELEMENT   local($arrayType)))
        local(set $ELEMENTS_PER_MATRIX call($ELEMENTS_PER_MATRIX local($rowLength) local($colLength)))

        local(set $matrixBase*
            call($add<memory*.bufferType.bufferSize>* 
                local($memory*)
                elem($MatrixBase) 
                i32(sum 
                    size($MatrixBase) 
                    (i32.mul
                        local($length)
                        local($BYTES_PER_MATRIX) 
                    )
                )
            )
        )

        call($set<matrixBase*.arrayType>           local($matrixBase*) local($arrayType))
        call($set<matrixBase*.memory*>             local($matrixBase*) local($memory*))
        call($set<matrixBase*.length>              local($matrixBase*) local($length))
        call($set<matrixBase*.rowLength>           local($matrixBase*) local($rowLength))
        call($set<matrixBase*.colLength>           local($matrixBase*) local($colLength))
        call($set<matrixBase*.BYTES_PER_MATRIX>    local($matrixBase*) local($BYTES_PER_MATRIX))
        call($set<matrixBase*.BYTES_PER_ELEMENT>   local($matrixBase*) local($BYTES_PER_ELEMENT))
        call($set<matrixBase*.ELEMENTS_PER_MATRIX> local($matrixBase*) local($ELEMENTS_PER_MATRIX))

        local($matrixBase*)
    )

    (func   $BYTES_PER_MATRIX                                                                             (type $i32x3->i32)
        i32(mul 
            call($BYTES_PER_ELEMENT   local(0)) 
            call($ELEMENTS_PER_MATRIX local(1) local(2))
        )
    )

    (func   $ELEMENTS_PER_MATRIX                                                                          (type $i32x2->i32)
        i32(mul local(1) local(0))
    )

    (func   $BYTES_PER_ELEMENT                                                                              (type $i32->i32)
        (if i32(eq local(0) type($Int8Array))  (then (return i32(1))))
        (if i32(eq local(0) type($Int16Array)) (then (return i32(2))))
        (if i32(eq local(0) type($Int32Array)) (then (return i32(4))))

        (unreachable)
    )

    (func   $get<arrayType>TypedArray#                                                                      (type $i32->ext)
        (if i32(eq local(0) type($Int8Array))  (then (return global($self).Int8Array)))
        (if i32(eq local(0) type($Int16Array)) (then (return global($self).Int16Array)))
        (if i32(eq local(0) type($Int32Array)) (then (return global($self).Int32Array)))

        (unreachable)
    )

    (func   $get<matrixBase*>nextBuffer                                                                     (type $i32->i32) i32(get local(0)))
    (func   $set<matrixBase*.nextBuffer>                                                                     (type $i32x2->) i32(set local(0) local(1)))

    (func   $get<matrixBase*>bufferType                                                                     (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.bufferType))))
    (func   $set<matrixBase*.bufferType>                                                                     (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.bufferType)) local(1)))

    (func   $get<matrixBase*>bufferSize                                                                     (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.bufferSize))))
    (func   $set<matrixBase*.bufferSize>                                                                     (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.bufferSize)) local(1)))

    (func   $get<matrixBase*>rowLength                                                                      (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.rowLength))))
    (func   $set<matrixBase*.rowLength>                                                                      (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.rowLength)) local(1)))

    (func   $get<matrixBase*>colLength                                                                      (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.colLength))))
    (func   $set<matrixBase*.colLength>                                                                      (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.colLength)) local(1)))

    (func   $get<matrixBase*>arrayType                                                                      (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.arrayType))))
    (func   $set<matrixBase*.arrayType>                                                                      (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.arrayType)) local(1)))

    (func   $get<matrixBase*>count                                                                          (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.count))))
    (func   $set<matrixBase*.count>                                                                          (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.count)) local(1)))

    (func   $get<matrixBase*>length                                                                         (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.length))))
    (func   $set<matrixBase*.length>                                                                         (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.length)) local(1)))

    (func   $get<matrixBase*>memory*                                                                        (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.memory*))))
    (func   $set<matrixBase*.memory*>                                                                        (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.memory*)) local(1)))

    (func   $get<matrixBase*>BYTES_PER_ELEMENT                                                              (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.BYTES_PER_ELEMENT))))
    (func   $set<matrixBase*.BYTES_PER_ELEMENT>                                                              (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.BYTES_PER_ELEMENT)) local(1)))

    (func   $get<matrixBase*>BYTES_PER_MATRIX                                                               (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.BYTES_PER_MATRIX))))
    (func   $set<matrixBase*.BYTES_PER_MATRIX>                                                               (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.BYTES_PER_MATRIX)) local(1)))

    (func   $get<matrixBase*>ELEMENTS_PER_MATRIX                                                            (type $i32->i32) i32(get i32(sum local(0) offset($MatrixBase.ELEMENTS_PER_MATRIX))))
    (func   $set<matrixBase*.ELEMENTS_PER_MATRIX>                                                            (type $i32x2->) i32(set i32(sum local(0) offset($MatrixBase.ELEMENTS_PER_MATRIX)) local(1)))
