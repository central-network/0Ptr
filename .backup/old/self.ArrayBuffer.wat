    
    (global $self.ArrayBuffer                                                                                     (mut ext))
    (global $self.ArrayBuffer::                                                                                   (mut ext))
    (global $self.ArrayBuffer::slice                                                                              (mut ext))
    (global $self.ArrayBuffer::resize                                                                             (mut ext))
    (global $self.ArrayBuffer::transfer                                                                           (mut ext))
    (global $self.ArrayBuffer::transferToFixedLength                                                              (mut ext))

    (func   $self.ArrayBuffer                                                                                  (type $->ext)
        (if (null (gget $self.ArrayBuffer)) 
            (then (gset $self.ArrayBuffer (keyof (gget $self) (text "ArrayBuffer"))))
        ) 
                
        (gget $self.ArrayBuffer)
    )

    (func   $self.ArrayBuffer::                                                                                (type $->ext)
        (if (null (gget $self.ArrayBuffer::)) 
            (then (gset $self.ArrayBuffer:: (keyof (call $self.ArrayBuffer) (text "prototype"))))
        ) 
                
        (gget $self.ArrayBuffer::)
    )

    (func   $self.ArrayBuffer::slice                                                                           (type $->ext)
        (if (null (gget $self.ArrayBuffer::slice)) 
            (then (gset $self.ArrayBuffer::slice (keyof (call $self.ArrayBuffer::) (text "slice"))))
        ) 
                
        (gget $self.ArrayBuffer::slice)
    )

    (func   $self.ArrayBuffer::resize                                                                          (type $->ext)
        (if (null (gget $self.ArrayBuffer::resize)) 
            (then (gset $self.ArrayBuffer::resize (keyof (call $self.ArrayBuffer::) (text "resize"))))
        ) 
                
        (gget $self.ArrayBuffer::resize)
    )

    (func   $self.ArrayBuffer::transfer                                                                        (type $->ext)
        (if (null (gget $self.ArrayBuffer::transfer)) 
            (then (gset $self.ArrayBuffer::transfer (keyof (call $self.ArrayBuffer::) (text "transfer"))))
        ) 
                
        (gget $self.ArrayBuffer::transfer)
    )

    (func   $self.ArrayBuffer::transferToFixedLength                                                           (type $->ext)
        (if (null (gget $self.ArrayBuffer::transferToFixedLength)) 
            (then (gset $self.ArrayBuffer::transferToFixedLength (keyof (call $self.ArrayBuffer::) (text "transferToFixedLength"))))
        ) 
                
        (gget $self.ArrayBuffer::transferToFixedLength)
    )

    (func   $self.ArrayBuffer::resizable<ext>i32                                                            (type $ext->i32)
        (call $get<ext2>i32 local(0) (text "resizable"))
    )

    (func   $self.ArrayBuffer::detached<ext>i32                                                             (type $ext->i32)
        (call $get<ext2>i32 local(0) (text "detached"))
    )

    (func   $self.ArrayBuffer::maxByteLength<ext>i32                                                        (type $ext->i32)
        (call $get<ext2>i32 local(0) (text "maxByteLength"))
    )

    (func   $self.ArrayBuffer::resize<ext.i32>ext                                                       (type $ext.i32->ext)
        (call $self.ArrayBuffer::resize) local(0)
        (call $i32->array# local(1))
        (call $apply<ext3>ext)
    )

    (func   $self.ArrayBuffer::slice<ext>ext                                                                (type $ext->ext)
        (call $self.ArrayBuffer::slice<ext.i32>ext local(0) (i32 0))
    )

    (func   $self.ArrayBuffer::slice<ext.i32>ext                                                        (type $ext.i32->ext)
        (call $self.Uint8Array)
        (call $ext.i32->array# (gget $sab) local(1))
        (call $construct<ext2>ext)
        (call $self.TypedArray::slice<ext>ext) (text "buffer")
        (call $get<ext2>ext)
    )

    (func   $self.ArrayBuffer::slice<ext.i32x2>ext                                                    (type $ext.i32x2->ext)
        (call $self.Uint8Array)
        (call $ext.i32x2->array# (gget $sab) local(1) i32(dif (get 2) local(1)))
        (call $construct<ext2>ext)
        (call $self.TypedArray::slice<ext>ext) (text "buffer")
        (call $get<ext2>ext)
    )

    (func   $self.ArrayBuffer::transfer<ext.i32>ext                                                     (type $ext.i32->ext)
        (call $self.ArrayBuffer::transfer) local(0)
        (call $i32->array# local(1))
        (call $apply<ext3>ext)
    )

    (func   $self.ArrayBuffer::transferToFixedLength<ext.i32>ext                                        (type $ext.i32->ext)
        (call $self.ArrayBuffer::transferToFixedLength) local(0)
        (call $i32->array# local(1))
        (call $apply<ext3>ext)
    )
