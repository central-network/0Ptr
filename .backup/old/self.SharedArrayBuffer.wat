    
    (global $self.SharedArrayBuffer                                                                               (mut ext))
    (global $self.SharedArrayBuffer::                                                                             (mut ext))
    (global $self.SharedArrayBuffer::grow                                                                         (mut ext))
    (global $self.SharedArrayBuffer::slice                                                                        (mut ext))

    (func   $self.SharedArrayBuffer                                                                            (type $->ext) 
        (if (null (gget $self.SharedArrayBuffer)) 
            (then (gset $self.SharedArrayBuffer (keyof (gget $sab) (text "constructor"))))
        ) 
                
        (gget $self.SharedArrayBuffer)
    )

    (func   $self.SharedArrayBuffer::                                                                          (type $->ext) 
        (if (null (gget $self.SharedArrayBuffer::)) 
            (then (gset $self.SharedArrayBuffer:: (keyof (call $self.SharedArrayBuffer) (text "prototype"))))
        ) 
                
        (gget $self.SharedArrayBuffer::)
    )

    (func   $self.SharedArrayBuffer::slice                                                                     (type $->ext) 
        (if (null (gget $self.SharedArrayBuffer::slice)) 
            (then (gset $self.SharedArrayBuffer::slice (keyof (call $self.SharedArrayBuffer::) (text "slice"))))
        ) 
                
        (gget $self.SharedArrayBuffer::slice)
    )

    (func   $self.SharedArrayBuffer::grow                                                                      (type $->ext) 
        (if (null (gget $self.SharedArrayBuffer::grow)) 
            (then (gset $self.SharedArrayBuffer::grow (keyof (call $self.SharedArrayBuffer::) (text "grow"))))
        ) 
                
        (gget $self.SharedArrayBuffer::grow)
    )

    (func   $self.SharedArrayBuffer::growable<ext>i32                                                       (type $ext->i32)
        (call $get<ext2>i32 local(0) (text "growable"))
    )

    (func   $self.SharedArrayBuffer::maxByteLength<ext>i32                                                  (type $ext->i32)
        (call $get<ext2>i32 local(0) (text "maxByteLength"))
    )

    (func   $self.SharedArrayBuffer::grow<ext.i32>ext                                                   (type $ext.i32->ext)
        (call $self.SharedArrayBuffer::grow) local(0)
        (call $i32->array# local(1))
        (call $apply<ext3>ext)
    )

    (func   $self.SharedArrayBuffer::slice<ext>ext                                                          (type $ext->ext)
        (call $self.SharedArrayBuffer::slice) local(0)
        (call $array#)
        (call $apply<ext3>ext)
    )

    (func   $self.SharedArrayBuffer::slice<ext.i32>ext                                                  (type $ext.i32->ext)
        (call $self.SharedArrayBuffer::slice) local(0)
        (call $i32->array# local(1))
        (call $apply<ext3>ext)
    )

    (func   $self.SharedArrayBuffer::slice<ext.i32x2>ext                                              (type $ext.i32x2->ext)
        (call $self.SharedArrayBuffer::slice) local(0)
        (call $i32x2->array# local(1) (get 2))
        (call $apply<ext3>ext)
    )