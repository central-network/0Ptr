
    (global $self.dispatchEvent                                                       (mut externref)         (ref.null extern))
    (global $self.addEventListener                                                    (mut externref)         (ref.null extern))
    (global $self.removeEventListener                                                 (mut externref)         (ref.null extern))

    (func   $self.dispatchEvent                                                                                    (type $->ext)
        (if (null (gget $self.dispatchEvent))
            (then (gset $self.dispatchEvent (keyof (gget $self) (text "dispatchEvent")))))

        (gget $self.dispatchEvent)
    )

    (func   $self.addEventListener                                                                                 (type $->ext)
        (if (null (gget $self.addEventListener))
            (then (gset $self.addEventListener (keyof (gget $self) (text "addEventListener")))))

        (gget $self.addEventListener)
    )

    (func   $self.removeEventListener                                                                              (type $->ext)
        (if (null (gget $self.removeEventListener))
            (then (gset $self.removeEventListener (keyof (gget $self) (text "removeEventListener")))))

        (gget $self.removeEventListener)
    )
