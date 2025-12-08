

    (global $self.TextEncoder::                                                                                       (mut externref)
        (ref.null extern)
    )    
    
    (global $self.TextEncoder::encode                                                                                 (mut externref)
        (ref.null extern)
    )        
    
    (global $self.TextEncoder::encodeInto                                                                             (mut externref)
        (ref.null extern)
    )        
    
    (func   $self.TextEncoder                                                                                            (type $->ext)
        (gget $self.TextEncoder)
    )

    (func   $self.TextEncoder::                                                                                          (type $->ext)
        (if (null (gget $self.TextEncoder::))
            (then (gset $self.TextEncoder:: (keyof 
            (call $self.TextEncoder) (text "prototype")))))

        (gget $self.TextEncoder::)
    )

    (func   $self.TextEncoder::encode                                                                                    (type $->ext)
        (if (null (gget $self.TextEncoder::encode))
            (then (gset $self.TextEncoder::encode (keyof 
            (call $self.TextEncoder::) (text "encode")))))

        (gget $self.TextEncoder::encode)
    )

    (func   $self.TextEncoder::encodeInto                                                                                (type $->ext)
        (if (null (gget $self.TextEncoder::encodeInto)) 
            (then (gset $self.TextEncoder::encodeInto (keyof 
            (call $self.TextEncoder::) (text "encodeInto"))))) 

        (gget $self.TextEncoder::encodeInto)
    )

    (func   $encode<ext2>ext                                                                                         (type $ext2->ext)
        (call $self.TextEncoder::encode) local(0)
        (call $ext->array# local(1))
        (call $apply<ext3>ext)
    )

    (func   $encodeInto<ext3>ext                                                                                     (type $ext3->ext)
        (call $self.TextEncoder::encodeInto) local(0)
        (call $ext2->array# local(1) (get 2))
        (call $apply<ext3>ext)
    )

    (func   $new.TextEncoder<>ext                                                                                        (type $->ext)
        (call $self.TextEncoder)
        (call $array#)
        (call $construct<ext2>ext)
    )

    (func   $get<textEncoder#>encoding#                                                                               (type $ext->ext)
        (call $get<ext2>ext local(0) (text "encoding"))
    )

