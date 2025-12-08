    ;; nodemon --exec "node module.wat.js && wat2wasm module.wat --enable-all" --watch "wat/@" -e "wat" --delay .1

    (start  $main)                                                                               (func   $main 
        (call $memory.init)
        ;;(call $window.init)
        ;;(call $new<>class*)iw
        ;;(string* "özgür")*
    )
        
        (;

    (func   $window.init
        (loc $window* i32)
        (loc $buffer* i32)
        (loc $buffer2* i32)

        (call $now) (gset $start)
        (call $render (f64 0))


        (set $window* (call $new<>window*))
        (call $set<window*.externref#> (get $window*) (gget $self))
        (call $set<window*.name#>      (get $window*) (gget $self.name))

        (get $window*)*
        (call $new<>bigInt64Array*)*
        (call $new<>uInt8ClampedArray*)*

        (string* "özgür")*

    )

    (func   $render                                                                              (type $f64->)  
        (if i32(mod (gget $frame) (i32.const 420)) (then) (else 
            (call $i32.f64x2->array# (gget $frame) (gget $epoch) (gget $start))#)
        )

        (gset $frame i32(sum (gget $frame) (i32 1)))
        (gset $epoch (f64.add (gget $epoch) local(0)))
        (gset $stamp (f64.add (gget $epoch) (gget $start)))

        (call $self.requestAnimationFrame (gget $render))  
    )
;)