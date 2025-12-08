

    (func   $wasm.Buffer                                                                                            (type $->ext)
        (local $wasm.Buffer externref)

        (if (null (tee $wasm.Buffer (i32->ext elem($wasm.Buffer)))) 
            (then 
                (call $extend<ext2>ext (text "Buffer")   (call $wasm.Pointer)) (set $wasm.Buffer)
                (call $get<ext2>ext    (text "prototype") (get $wasm.Buffer)) (gset $prototype)

                (call $define (result $ptr) (gget $prototype) (enumerable on) (text "buffer*") (offset $wasm.Buffer::parent*))
                (call $define (result $i32) (gget $prototype) (enumerable on) (text "byteOffset") (offset $wasm.Buffer::byteOffset))
                (call $define (result $i32) (gget $prototype) (enumerable on) (text "byteLength") (offset $wasm.Buffer::byteLength))
                (call $define (result $i32) (gget $prototype) (enumerable on) (text "maxByteLength") (offset $wasm.Buffer::maxByteLength))
                (call $define (result $!is) (gget $prototype) (enumerable on) (text "shared") (offset $wasm.Buffer::unshared))
                (call $define (result $is?) (gget $prototype) (enumerable on) (text "resizable") (offset $wasm.Buffer::resizable))
                (call $define (result $is?) (gget $prototype) (enumerable on) (text "growable") (offset $wasm.Buffer::resizable))
                (call $define (result $is?) (gget $prototype) (enumerable on) (text "detached") (offset $wasm.Buffer::detached))
                (call $define (result $i32) (gget $prototype) (enumerable no) (text "globalOffset") elem($get<buffer*>globalOffset))
                (call $define (result $ext) (gget $prototype) (enumerable no) (text "buffer#") elem($get<buffer*>buffer#))
                
                (i32<-ext elem($wasm.Buffer) (get $wasm.Buffer))
            )
        )

        (get $wasm.Buffer)
    )
    
    (func   $new<>buffer*                                                                                           (type $->i32)
        (call $new<class*.byteLength>* elem($wasm.Buffer) (size $wasm.Buffer))
    )

    (func   $new<byteLength>buffer*                                                                              (type $i32->i32)
        (call $new<byteLength.maxByteLength>buffer* local(1) local(1))
    )

    (func   $new<byteLength.maxByteLength>buffer*                                                              (type $i32x2->i32)
        (loc $buffer* i32)
        (tee $buffer* (call $new<>buffer*))

        (call $set<buffer*.byteLength>    (get $buffer*) local(0))
        (call $set<buffer*.maxByteLength> (get $buffer*) local(1))
        (call $set<buffer*.growable>      (get $buffer*) (gtu local(1) local(0)))

        (get $buffer*) (call $resize<buffer*>)
    )

    (func   $get<buffer*>buffer#                                                                                 (type $i32->ext)
        (loc $begin i32)
        (loc $end i32)

        (set $end 
            i32(sum 
                (call $get<buffer*>globalOffset local(0)) (tee $begin)
                (call $get<buffer*>byteLength local(0))
            )
        )

        (gget $sab) (get $begin) (get $end)
        (if (type $ext.i32x2->ext) 
            (call $get<buffer*>shared local(0))
            (then (call $self.SharedArrayBuffer::slice<ext.i32x2>ext))
            (else (call $self.ArrayBuffer::slice<ext.i32x2>ext))
        )
    )   
   
    (func   $get<buffer*>byteOffset                                                                              (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::byteOffset)))
    )   
    
    (func   $set<buffer*.byteOffset>                                                                              (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::byteOffset)) local(1))
    )   
   
    (func   $get<buffer*.byteOffset>ui8                                                                        (type $i32x2->i32)
        (ui8.get i32(sum (call $get<buffer*>globalOffset local(0)) local(1)))
    )   
    
    (func   $set<buffer*.byteOffset.ui8>                                                                          (type $i32x3->)
        (ui8.set i32(sum (call $get<buffer*>globalOffset local(0)) local(1)) (get 2))
    )   
   
    (func   $get<buffer*.byteOffset>i32                                                                        (type $i32x2->i32)
        (i32.get i32(sum (call $get<buffer*>globalOffset local(0)) local(1)))
    )   
    
    (func   $set<buffer*.byteOffset.i32>                                                                          (type $i32x3->)
        (i32.set i32(sum (call $get<buffer*>globalOffset local(0)) local(1)) (get 2))
    )   
   
    (func   $get<buffer*>maxByteLength                                                                           (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::maxByteLength)))
    )   
   
    (func   $set<buffer*.maxByteLength>                                                                           (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::maxByteLength)) local(1))
    )   
   
    (func   $tee<buffer*.maxByteLength>                                                                        (type $i32x2->i32)
        (call $set<buffer*.maxByteLength> local(0) local(1)) local(1)
    )

    (func   $get<buffer*>byteLength                                                                              (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::byteLength)))
    )

    (func   $set<buffer*.byteLength>                                                                              (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::byteLength)) local(1))
    )

    (func   $get<buffer*>resizable                                                                               (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::resizable)))
    )

    (func   $set<buffer*.resizable>                                                                               (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::resizable)) local(1))
    )

    (func   $get<buffer*>growable                                                                                (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::resizable)))
    )

    (func   $set<buffer*.growable>                                                                                (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::resizable)) local(1))
    )

    (func   $get<buffer*>detached                                                                                (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::detached)))
    )

    (func   $set<buffer*.detached>                                                                                (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::detached)) local(1))
    )

    (func   $get<buffer*>buffer*                                                                                 (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::parent)))
    )

    (func   $set<buffer*.buffer*>                                                                                 (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::parent)) local(1))
    )

    (func   $get<buffer*>shared                                                                                  (type $i32->i32)
        (i32.eqz (call $get<buffer*>unshared local(0)))
    )

    (func   $set<buffer*.shared>                                                                                  (type $i32x2->)
        (call $set<buffer*.unshared> local(0) (i32.eqz local(1)))
    )

    (func   $get<buffer*>unshared                                                                                (type $i32->i32)
        (i32.get i32(sum local(0) (offset $wasm.Buffer::unshared)))
    )

    (func   $set<buffer*.unshared>                                                                                (type $i32x2->)
        (i32.set i32(sum local(0) (offset $wasm.Buffer::unshared)) local(1))
    )
    
    (func   $get<buffer*>globalOffset                                                                            (type $i32->i32)
        (local $offset i32) 
        (local $buffer* i32) (set $buffer* local(0))

        (loop (result i32)
            i32(sum (get $offset) (call $get<buffer*>byteOffset (get $buffer*)))  (set $offset)
            (br_if 0 (tee $buffer* (call $get<buffer*>parent*    (get $buffer*)))) (get $offset)
        )
    )

    (func   $add<byteLength>                                                                                     (type $i32->i32)
        (call $add<buffer*.byteLength> (i32 0) local(0))
    )

    (func   $add<buffer*.byteLength>                                                                           (type $i32x2->i32)
        (i32.atomic.rmw.add i32(sum local(0) (offset $wasm.Buffer::byteLength)) local(1))
    )

    (func   $resize<buffer*>                                                                                        (type $i32->)
        (loc $byteOffset i32)
        (if (tee $byteOffset (call $get<buffer*>byteOffset local(0)))
            (then)
            (else (call $malloc<buffer*> local(0)))
        )
    )

    (func   $clone<buffer*>buffer*                                                                               (type $i32->i32)
        (local $buffer* i32)
        (set $buffer* (call $new<>buffer*))  
        
        (get $buffer*) local(0) (call $set<buffer*.parent*>)
        (get $buffer*) local(0) (call $get<buffer*>shared) (call $set<buffer*.shared>)
        (get $buffer*) local(0) (call $get<buffer*>detached) (call $set<buffer*.detached>)
        (get $buffer*) local(0) (call $get<buffer*>resizable) (call $set<buffer*.resizable>)
        (get $buffer*) local(0) (call $get<buffer*>byteLength) (call $set<buffer*.byteLength>)
        (get $buffer*) local(0) (call $get<buffer*>maxByteLength) (call $set<buffer*.maxByteLength>)
        (get $buffer*) (call $resize<buffer*>)

        (memory.copy
            (call $get<buffer*>globalOffset (get $buffer*))
            (call $get<buffer*>globalOffset local(0))
            (call $get<buffer*>byteLength   local(0)) 
        )

        (get $buffer*)
    )

    (func   $malloc<buffer*>                                                                                        (type $i32->)
        (loc $buffer* i32)
        (loc $byteOffset i32)
        (loc $maxByteLength i32)
        
        (if (tee $maxByteLength (call $get<buffer*>maxByteLength local(0)))
            (then
                (if (tee $buffer* (call $get<buffer*>buffer* local(0)))
                    (then 
                        local(0) (call $add<buffer*.byteLength> (get $buffer*) (get $maxByteLength))
                        (call $set<buffer*.byteOffset>)
                    )
                    (else 
                        local(0) (call $malloc (get $maxByteLength))
                        (call $set<buffer*.byteOffset>)
                    )
                )
            )
        )
    )

    
    (func   $malloc<buffer*.class*>                                                                            (type $i32x2->i32)
        (loc $byteOffset i32)
        (loc $byteLength i32)

        (set $byteLength (call $get<class*>byteLength local(1)))
        (set $byteOffset (call $add<buffer*.byteLength> local(0) (get $byteLength)))
        (set $byteOffset i32(sum (get $byteOffset) (call $get<buffer*>globalOffset local(0))))

        (get $byteOffset)
    )

