	
	(global $self.TypedArray                                                         (mut externref)          (ref.null extern))
	(global $self.TypedArray.from                                                    (mut externref)          (ref.null extern))
	(global $self.TypedArray.of                                                      (mut externref)          (ref.null extern))
	(global $self.TypedArray::                                                       (mut externref)          (ref.null extern))
	(global $self.TypedArray::at                                                     (mut externref)          (ref.null extern))
	(global $self.TypedArray::copyWithin                                             (mut externref)          (ref.null extern))
	(global $self.TypedArray::fill                                                   (mut externref)          (ref.null extern))
	(global $self.TypedArray::set                                                    (mut externref)          (ref.null extern))
	(global $self.TypedArray::subarray                                               (mut externref)          (ref.null extern))
	(global $self.TypedArray::filter                                                 (mut externref)          (ref.null extern))
	(global $self.TypedArray::find                                                   (mut externref)          (ref.null extern))
	(global $self.TypedArray::findIndex                                              (mut externref)          (ref.null extern))
	(global $self.TypedArray::findLast                                               (mut externref)          (ref.null extern))
	(global $self.TypedArray::findLastIndex                                          (mut externref)          (ref.null extern))
	(global $self.TypedArray::forEach                                                (mut externref)          (ref.null extern))
	(global $self.TypedArray::lastIndexOf                                            (mut externref)          (ref.null extern))
	(global $self.TypedArray::includes                                               (mut externref)          (ref.null extern))
	(global $self.TypedArray::reverse                                                (mut externref)          (ref.null extern))
	(global $self.TypedArray::sort                                                   (mut externref)          (ref.null extern))
	(global $self.TypedArray::slice                                                  (mut externref)          (ref.null extern))
	(global $self.TypedArray::indexOf                                                (mut externref)          (ref.null extern))
	(global $self.TypedArray::join                                                   (mut externref)          (ref.null extern))
	(global $self.TypedArray::keys                                                   (mut externref)          (ref.null extern))
	(global $self.TypedArray::entries                                                (mut externref)          (ref.null extern))
	(global $self.TypedArray::values                                                 (mut externref)          (ref.null extern))
	(global $self.TypedArray::map                                                    (mut externref)          (ref.null extern))
	(global $self.TypedArray::every                                                  (mut externref)          (ref.null extern))
	(global $self.TypedArray::some                                                   (mut externref)          (ref.null extern))
	(global $self.TypedArray::reduce                                                 (mut externref)          (ref.null extern))
	(global $self.TypedArray::reduceRight                                            (mut externref)          (ref.null extern))
	(global $self.TypedArray::toReversed                                             (mut externref)          (ref.null extern))
	(global $self.TypedArray::toSorted                                               (mut externref)          (ref.null extern))
	(global $self.TypedArray::toSpliced                                              (mut externref)          (ref.null extern))
	(global $self.TypedArray::with                                                   (mut externref)          (ref.null extern))


	(global $self.Int8Array                                                          (mut externref)          (ref.null extern))
    (global $self.Int8Array.of                                                       (mut externref)          (ref.null extern))
    (global $self.Int8Array.from                                                     (mut externref)          (ref.null extern))
	
    (global $self.Int16Array                                                         (mut externref)          (ref.null extern))
    (global $self.Int16Array.of                                                      (mut externref)          (ref.null extern))
    (global $self.Int16Array.from                                                    (mut externref)          (ref.null extern))
	
    (global $self.Int32Array                                                         (mut externref)          (ref.null extern))
    (global $self.Int32Array.of                                                      (mut externref)          (ref.null extern))
    (global $self.Int32Array.from                                                    (mut externref)          (ref.null extern))
    
    (global $self.BigInt64Array                                                      (mut externref)          (ref.null extern))
    (global $self.BigInt64Array.of                                                   (mut externref)          (ref.null extern))
    (global $self.BigInt64Array.from                                                 (mut externref)          (ref.null extern))
	
    (global $self.Uint8Array                                                         (mut externref)          (ref.null extern))
    (global $self.Uint8Array.of                                                      (mut externref)          (ref.null extern))
    (global $self.Uint8Array.from                                                    (mut externref)          (ref.null extern))
	
    (global $self.Uint16Array                                                        (mut externref)          (ref.null extern))
    (global $self.Uint16Array.of                                                     (mut externref)          (ref.null extern))
    (global $self.Uint16Array.from                                                   (mut externref)          (ref.null extern))
	
    (global $self.Uint32Array                                                        (mut externref)          (ref.null extern))
    (global $self.Uint32Array.of                                                     (mut externref)          (ref.null extern))
    (global $self.Uint32Array.from                                                   (mut externref)          (ref.null extern))
	
    (global $self.BigUint64Array                                                     (mut externref)          (ref.null extern))
    (global $self.BigUint64Array.of                                                  (mut externref)          (ref.null extern))
    (global $self.BigUint64Array.from                                                (mut externref)          (ref.null extern))
    
    (global $self.Float32Array                                                       (mut externref)          (ref.null extern))
    (global $self.Float32Array.of                                                    (mut externref)          (ref.null extern))
    (global $self.Float32Array.from                                                  (mut externref)          (ref.null extern))
	
    (global $self.Float64Array                                                       (mut externref)          (ref.null extern))
    (global $self.Float64Array.of                                                    (mut externref)          (ref.null extern))
    (global $self.Float64Array.from                                                  (mut externref)          (ref.null extern))
	
    (global $self.Uint8ClampedArray                                                  (mut externref)          (ref.null extern))
    (global $self.Uint8ClampedArray.of                                               (mut externref)          (ref.null extern))
    (global $self.Uint8ClampedArray.from                                             (mut externref)          (ref.null extern))
    

	(func   $self.Int8Array                                                                                        (type $->ext)
        (if (null (gget $self.Int8Array))
            (then (gset $self.Int8Array (keyof (gget $self) (text "Int8Array")))))

        (gget $self.Int8Array)
        )

    (func   $self.Int8Array.of                                                                                     (type $->ext)
        (if (null (gget $self.Int8Array.of))
            (then (gset $self.Int8Array.of (keyof (call $self.Int8Array) (text "of")))))

        (gget $self.Int8Array.of)
        )

    (func   $self.Int8Array.from                                                                                   (type $->ext)
        (if (null (gget $self.Int8Array.from))
            (then (gset $self.Int8Array.from (keyof (call $self.Int8Array) (text "from")))))

        (gget $self.Int8Array.from)
    )

	(func   $self.Int16Array                                                                                       (type $->ext)
        (if (null (gget $self.Int16Array))
            (then (gset $self.Int16Array (keyof (gget $self) (text "Int16Array")))))

        (gget $self.Int16Array)
        )

    (func   $self.Int16Array.of                                                                                    (type $->ext)
        (if (null (gget $self.Int16Array.of))
            (then (gset $self.Int16Array.of (keyof (call $self.Int16Array) (text "of")))))

        (gget $self.Int16Array.of)
        )

    (func   $self.Int16Array.from                                                                                  (type $->ext)
        (if (null (gget $self.Int16Array.from))
            (then (gset $self.Int16Array.from (keyof (call $self.Int16Array) (text "from")))))

        (gget $self.Int16Array.from)
    )

	(func   $self.Int32Array                                                                                       (type $->ext)
        (if (null (gget $self.Int32Array))
            (then (gset $self.Int32Array (keyof (gget $self) (text "Int32Array")))))

        (gget $self.Int32Array)
        )

    (func   $self.Int32Array.of                                                                                    (type $->ext)
        (if (null (gget $self.Int32Array.of))
            (then (gset $self.Int32Array.of (keyof (call $self.Int32Array) (text "of")))))

        (gget $self.Int32Array.of)
        )

    (func   $self.Int32Array.from                                                                                  (type $->ext)
        (if (null (gget $self.Int32Array.from))
            (then (gset $self.Int32Array.from (keyof (call $self.Int32Array) (text "from")))))

        (gget $self.Int32Array.from)
    )

    (func   $self.BigInt64Array                                                                                    (type $->ext)
        (if (null (gget $self.BigInt64Array))
            (then (gset $self.BigInt64Array (keyof (gget $self) (text "BigInt64Array")))))

        (gget $self.BigInt64Array)
        )

    (func   $self.BigInt64Array.of                                                                                 (type $->ext)
        (if (null (gget $self.BigInt64Array.of))
            (then (gset $self.BigInt64Array.of (keyof (call $self.BigInt64Array) (text "of")))))

        (gget $self.BigInt64Array.of)
        )

    (func   $self.BigInt64Array.from                                                                               (type $->ext)
        (if (null (gget $self.BigInt64Array.from))
            (then (gset $self.BigInt64Array.from (keyof (call $self.BigInt64Array) (text "from")))))

        (gget $self.BigInt64Array.from)
    )

	(func   $self.Uint8Array                                                                                       (type $->ext)
        (if (null (gget $self.Uint8Array))
            (then (gset $self.Uint8Array (keyof (gget $self) (text "Uint8Array")))))

        (gget $self.Uint8Array)
        )

    (func   $self.Uint8Array.of                                                                                    (type $->ext)
        (if (null (gget $self.Uint8Array.of))
            (then (gset $self.Uint8Array.of (keyof (call $self.Uint8Array) (text "of")))))

        (gget $self.Uint8Array.of)
        )

    (func   $self.Uint8Array.from                                                                                  (type $->ext)
        (if (null (gget $self.Uint8Array.from))
            (then (gset $self.Uint8Array.from (keyof (call $self.Uint8Array) (text "from")))))

        (gget $self.Uint8Array.from)
    )

	(func   $self.Uint16Array                                                                                      (type $->ext)
        (if (null (gget $self.Uint16Array))
            (then (gset $self.Uint16Array (keyof (gget $self) (text "Uint16Array")))))

        (gget $self.Uint16Array)
        )

    (func   $self.Uint16Array.of                                                                                   (type $->ext)
        (if (null (gget $self.Uint16Array.of))
            (then (gset $self.Uint16Array.of (keyof (call $self.Uint16Array) (text "of")))))

        (gget $self.Uint16Array.of)
        )

    (func   $self.Uint16Array.from                                                                                 (type $->ext)
        (if (null (gget $self.Uint16Array.from))
            (then (gset $self.Uint16Array.from (keyof (call $self.Uint16Array) (text "from")))))

        (gget $self.Uint16Array.from)
    )

	(func   $self.Uint32Array                                                                                      (type $->ext)
        (if (null (gget $self.Uint32Array))
            (then (gset $self.Uint32Array (keyof (gget $self) (text "Uint32Array")))))

        (gget $self.Uint32Array)
        )

    (func   $self.Uint32Array.of                                                                                   (type $->ext)
        (if (null (gget $self.Uint32Array.of))
            (then (gset $self.Uint32Array.of (keyof (call $self.Uint32Array) (text "of")))))

        (gget $self.Uint32Array.of)
        )

    (func   $self.Uint32Array.from                                                                                 (type $->ext)
        (if (null (gget $self.Uint32Array.from))
            (then (gset $self.Uint32Array.from (keyof (call $self.Uint32Array) (text "from")))))

        (gget $self.Uint32Array.from)
    )

	(func   $self.BigUint64Array                                                                                   (type $->ext)
        (if (null (gget $self.BigUint64Array))
            (then (gset $self.BigUint64Array (keyof (gget $self) (text "BigUint64Array")))))

        (gget $self.BigUint64Array)
        )

    (func   $self.BigUint64Array.of                                                                                (type $->ext)
        (if (null (gget $self.BigUint64Array.of))
            (then (gset $self.BigUint64Array.of (keyof (call $self.BigUint64Array) (text "of")))))

        (gget $self.BigUint64Array.of)
        )

    (func   $self.BigUint64Array.from                                                                              (type $->ext)
        (if (null (gget $self.BigUint64Array.from))
            (then (gset $self.BigUint64Array.from (keyof (call $self.BigUint64Array) (text "from")))))

        (gget $self.BigUint64Array.from)
    )

    (func   $self.Float32Array                                                                                     (type $->ext)
        (if (null (gget $self.Float32Array))
            (then (gset $self.Float32Array (keyof (gget $self) (text "Float32Array")))))

        (gget $self.Float32Array)
        )

    (func   $self.Float32Array.of                                                                                  (type $->ext)
        (if (null (gget $self.Float32Array.of))
            (then (gset $self.Float32Array.of (keyof (call $self.Float32Array) (text "of")))))

        (gget $self.Float32Array.of)
        )

    (func   $self.Float32Array.from                                                                                (type $->ext)
        (if (null (gget $self.Float32Array.from))
            (then (gset $self.Float32Array.from (keyof (call $self.Float32Array) (text "from")))))

        (gget $self.Float32Array.from)
    )

	(func   $self.Float64Array                                                                                     (type $->ext)
        (if (null (gget $self.Float64Array))
            (then (gset $self.Float64Array (keyof (gget $self) (text "Float64Array")))))

        (gget $self.Float64Array)
        )

    (func   $self.Float64Array.of                                                                                  (type $->ext)
        (if (null (gget $self.Float64Array.of))
            (then (gset $self.Float64Array.of (keyof (call $self.Float64Array) (text "of")))))

        (gget $self.Float64Array.of)
        )

    (func   $self.Float64Array.from                                                                                (type $->ext)
        (if (null (gget $self.Float64Array.from))
            (then (gset $self.Float64Array.from (keyof (call $self.Float64Array) (text "from")))))

        (gget $self.Float64Array.from)
    )

	(func   $self.Uint8ClampedArray                                                                                (type $->ext)
        (if (null (gget $self.Uint8ClampedArray))
            (then (gset $self.Uint8ClampedArray (keyof (gget $self) (text "Uint8ClampedArray")))))

        (gget $self.Uint8ClampedArray)
        )

    (func   $self.Uint8ClampedArray.of                                                                             (type $->ext)
        (if (null (gget $self.Uint8ClampedArray.of))
            (then (gset $self.Uint8ClampedArray.of (keyof (call $self.Uint8ClampedArray) (text "of")))))

        (gget $self.Uint8ClampedArray.of)
        )

    (func   $self.Uint8ClampedArray.from                                                                           (type $->ext)
        (if (null (gget $self.Uint8ClampedArray.from))
            (then (gset $self.Uint8ClampedArray.from (keyof (call $self.Uint8ClampedArray) (text "from")))))

        (gget $self.Uint8ClampedArray.from)
    )

    (func   $self.TypedArray                                                                                       (type $->ext) 
        (if (null (gget $self.TypedArray)) 
            (then (gset $self.TypedArray (keyof (call $self.Uint8Array) (text "__proto__"))))) 
            
        (gget $self.TypedArray) 
        )
	
    (func   $self.TypedArray::                                                                                     (type $->ext) 
        (if (null (gget $self.TypedArray::)) 
            (then (gset $self.TypedArray:: (keyof (call $self.TypedArray) (text "prototype"))))) 
            
        (gget $self.TypedArray::) 
        )
	
    (func   $self.TypedArray::at                                                                                   (type $->ext) 
        (if (null (gget $self.TypedArray::at)) 
            (then (gset $self.TypedArray::at (keyof (call $self.TypedArray::) (text "at")))))
 
        (gget $self.TypedArray::at) 
        )

	(func   $self.TypedArray::copyWithin                                                                           (type $->ext) 
        (if (null (gget $self.TypedArray::copyWithin)) 
            (then (gset $self.TypedArray::copyWithin (keyof (call $self.TypedArray::) (text "copyWithin")))))
 
        (gget $self.TypedArray::copyWithin) 
        )

	(func   $self.TypedArray::fill                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::fill)) 
            (then (gset $self.TypedArray::fill (keyof (call $self.TypedArray::) (text "fill")))))
 
        (gget $self.TypedArray::fill) 
        )

	(func   $self.TypedArray::find                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::find)) 
            (then (gset $self.TypedArray::find (keyof (call $self.TypedArray::) (text "find")))))
 
        (gget $self.TypedArray::find) 
        )

	(func   $self.TypedArray::findIndex                                                                            (type $->ext) 
        (if (null (gget $self.TypedArray::findIndex)) 
            (then (gset $self.TypedArray::findIndex (keyof (call $self.TypedArray::) (text "findIndex")))))
 
        (gget $self.TypedArray::findIndex) 
        )

	(func   $self.TypedArray::findLast                                                                             (type $->ext) 
        (if (null (gget $self.TypedArray::findLast)) 
            (then (gset $self.TypedArray::findLast (keyof (call $self.TypedArray::) (text "findLast")))))
 
        (gget $self.TypedArray::findLast) 
        )

	(func   $self.TypedArray::findLastIndex                                                                        (type $->ext) 
        (if (null (gget $self.TypedArray::findLastIndex)) 
            (then (gset $self.TypedArray::findLastIndex (keyof (call $self.TypedArray::) (text "findLastIndex")))))
 
        (gget $self.TypedArray::findLastIndex) 
        )

	(func   $self.TypedArray::lastIndexOf                                                                          (type $->ext) 
        (if (null (gget $self.TypedArray::lastIndexOf)) 
            (then (gset $self.TypedArray::lastIndexOf (keyof (call $self.TypedArray::) (text "lastIndexOf")))))
 
        (gget $self.TypedArray::lastIndexOf) 
        )

	(func   $self.TypedArray::reverse                                                                              (type $->ext) 
        (if (null (gget $self.TypedArray::reverse)) 
            (then (gset $self.TypedArray::reverse (keyof (call $self.TypedArray::) (text "reverse")))))
 
        (gget $self.TypedArray::reverse) 
        )

	(func   $self.TypedArray::set                                                                                  (type $->ext) 
        (if (null (gget $self.TypedArray::set)) 
            (then (gset $self.TypedArray::set (keyof (call $self.TypedArray::) (text "set")))))
 
        (gget $self.TypedArray::set) 
        )

	(func   $self.TypedArray::slice                                                                                (type $->ext) 
        (if (null (gget $self.TypedArray::slice)) 
            (then (gset $self.TypedArray::slice (keyof (call $self.TypedArray::) (text "slice")))))
 
        (gget $self.TypedArray::slice) 
        )

	(func   $self.TypedArray::sort                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::sort)) 
            (then (gset $self.TypedArray::sort (keyof (call $self.TypedArray::) (text "sort")))))
 
        (gget $self.TypedArray::sort) 
        )

	(func   $self.TypedArray::subarray                                                                             (type $->ext) 
        (if (null (gget $self.TypedArray::subarray)) 
            (then (gset $self.TypedArray::subarray (keyof (call $self.TypedArray::) (text "subarray")))))
 
        (gget $self.TypedArray::subarray) 
        )

	(func   $self.TypedArray::includes                                                                             (type $->ext) 
        (if (null (gget $self.TypedArray::includes)) 
            (then (gset $self.TypedArray::includes (keyof (call $self.TypedArray::) (text "includes")))))
 
        (gget $self.TypedArray::includes) 
        )

	(func   $self.TypedArray::indexOf                                                                              (type $->ext) 
        (if (null (gget $self.TypedArray::indexOf)) 
            (then (gset $self.TypedArray::indexOf (keyof (call $self.TypedArray::) (text "indexOf")))))
 
        (gget $self.TypedArray::indexOf) 
        )

	(func   $self.TypedArray::join                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::join)) 
            (then (gset $self.TypedArray::join (keyof (call $self.TypedArray::) (text "join")))))
 
        (gget $self.TypedArray::join) 
        )

	(func   $self.TypedArray::keys                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::keys)) 
            (then (gset $self.TypedArray::keys (keyof (call $self.TypedArray::) (text "keys")))))
 
        (gget $self.TypedArray::keys) 
        )

	(func   $self.TypedArray::entries                                                                              (type $->ext) 
        (if (null (gget $self.TypedArray::entries)) 
            (then (gset $self.TypedArray::entries (keyof (call $self.TypedArray::) (text "entries")))))
 
        (gget $self.TypedArray::entries) 
        )

	(func   $self.TypedArray::values                                                                               (type $->ext) 
        (if (null (gget $self.TypedArray::values)) 
            (then (gset $self.TypedArray::values (keyof (call $self.TypedArray::) (text "values")))))
 
        (gget $self.TypedArray::values) 
        )

	(func   $self.TypedArray::forEach                                                                              (type $->ext) 
        (if (null (gget $self.TypedArray::forEach)) 
            (then (gset $self.TypedArray::forEach (keyof (call $self.TypedArray::) (text "forEach")))))
 
        (gget $self.TypedArray::forEach) 
        )

	(func   $self.TypedArray::filter                                                                               (type $->ext) 
        (if (null (gget $self.TypedArray::filter)) 
            (then (gset $self.TypedArray::filter (keyof (call $self.TypedArray::) (text "filter")))))
 
        (gget $self.TypedArray::filter) 
        )

	(func   $self.TypedArray::map                                                                                  (type $->ext) 
        (if (null (gget $self.TypedArray::map)) 
            (then (gset $self.TypedArray::map (keyof (call $self.TypedArray::) (text "map")))))
 
        (gget $self.TypedArray::map) 
        )

	(func   $self.TypedArray::every                                                                                (type $->ext) 
        (if (null (gget $self.TypedArray::every)) 
            (then (gset $self.TypedArray::every (keyof (call $self.TypedArray::) (text "every")))))
 
        (gget $self.TypedArray::every) 
        )

	(func   $self.TypedArray::some                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::some)) 
            (then (gset $self.TypedArray::some (keyof (call $self.TypedArray::) (text "some")))))
 
        (gget $self.TypedArray::some) 
        )

	(func   $self.TypedArray::reduce                                                                               (type $->ext) 
        (if (null (gget $self.TypedArray::reduce)) 
            (then (gset $self.TypedArray::reduce (keyof (call $self.TypedArray::) (text "reduce")))))
 
        (gget $self.TypedArray::reduce) 
        )

	(func   $self.TypedArray::reduceRight                                                                          (type $->ext) 
        (if (null (gget $self.TypedArray::reduceRight)) 
            (then (gset $self.TypedArray::reduceRight (keyof (call $self.TypedArray::) (text "reduceRight")))))
 
        (gget $self.TypedArray::reduceRight) 
        )

	(func   $self.TypedArray::toReversed                                                                           (type $->ext) 
        (if (null (gget $self.TypedArray::toReversed)) 
            (then (gset $self.TypedArray::toReversed (keyof (call $self.TypedArray::) (text "toReversed")))))
 
        (gget $self.TypedArray::toReversed) 
        )

	(func   $self.TypedArray::toSorted                                                                             (type $->ext) 
        (if (null (gget $self.TypedArray::toSorted)) 
            (then (gset $self.TypedArray::toSorted (keyof (call $self.TypedArray::) (text "toSorted")))))
 
        (gget $self.TypedArray::toSorted) 
        )

	(func   $self.TypedArray::with                                                                                 (type $->ext) 
        (if (null (gget $self.TypedArray::with)) 
            (then (gset $self.TypedArray::with (keyof (call $self.TypedArray::) (text "with")))))
 
        (gget $self.TypedArray::with) 
    )

    (func   $new.Int8Array<i32>ext                                                                              (type $i32->ext) 
        (call $self.Int8Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Int8Array<ext>ext                                                                              (type $ext->ext) 
        (call $self.Int8Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Int8Array<ext.i32>ext                                                                      (type $ext.i32->ext) 
        (call $self.Int8Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Int8Array<ext.i32x2>ext                                                                  (type $ext.i32x2->ext) 
        (call $self.Int8Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Int16Array<i32>ext                                                                             (type $i32->ext) 
        (call $self.Int16Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Int16Array<ext>ext                                                                             (type $ext->ext) 
        (call $self.Int16Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Int16Array<ext.i32>ext                                                                     (type $ext.i32->ext) 
        (call $self.Int16Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Int16Array<ext.i32x2>ext                                                                 (type $ext.i32x2->ext) 
        (call $self.Int16Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Int32Array<i32>ext                                                                             (type $i32->ext) 
        (call $self.Int32Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Int32Array<ext>ext                                                                             (type $ext->ext) 
        (call $self.Int32Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Int32Array<ext.i32>ext                                                                     (type $ext.i32->ext) 
        (call $self.Int32Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Int32Array<ext.i32x2>ext                                                                 (type $ext.i32x2->ext) 
        (call $self.Int32Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.BigInt64Array<i32>ext                                                                          (type $i32->ext) 
        (call $self.BigInt64Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.BigInt64Array<ext>ext                                                                          (type $ext->ext) 
        (call $self.BigInt64Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.BigInt64Array<ext.i32>ext                                                                  (type $ext.i32->ext) 
        (call $self.BigInt64Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.BigInt64Array<ext.i32x2>ext                                                              (type $ext.i32x2->ext) 
        (call $self.BigInt64Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Uint8Array<i32>ext                                                                             (type $i32->ext) 
        (call $self.Uint8Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint8Array<ext>ext                                                                             (type $ext->ext) 
        (call $self.Uint8Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint8Array<ext.i32>ext                                                                     (type $ext.i32->ext) 
        (call $self.Uint8Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint8Array<ext.i32x2>ext                                                                 (type $ext.i32x2->ext) 
        (call $self.Uint8Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Uint16Array<i32>ext                                                                            (type $i32->ext) 
        (call $self.Uint16Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint16Array<ext>ext                                                                            (type $ext->ext) 
        (call $self.Uint16Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint16Array<ext.i32>ext                                                                    (type $ext.i32->ext) 
        (call $self.Uint16Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint16Array<ext.i32x2>ext                                                                (type $ext.i32x2->ext) 
        (call $self.Uint16Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Uint32Array<i32>ext                                                                            (type $i32->ext) 
        (call $self.Uint32Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint32Array<ext>ext                                                                            (type $ext->ext) 
        (call $self.Uint32Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint32Array<ext.i32>ext                                                                    (type $ext.i32->ext) 
        (call $self.Uint32Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint32Array<ext.i32x2>ext                                                                (type $ext.i32x2->ext) 
        (call $self.Uint32Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.BigUint64Array<i32>ext                                                                         (type $i32->ext) 
        (call $self.BigUint64Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.BigUint64Array<ext>ext                                                                         (type $ext->ext) 
        (call $self.BigUint64Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.BigUint64Array<ext.i32>ext                                                                 (type $ext.i32->ext) 
        (call $self.BigUint64Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.BigUint64Array<ext.i32x2>ext                                                             (type $ext.i32x2->ext) 
        (call $self.BigUint64Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Float32Array<i32>ext                                                                           (type $i32->ext) 
        (call $self.Float32Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Float32Array<ext>ext                                                                           (type $ext->ext) 
        (call $self.Float32Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Float32Array<ext.i32>ext                                                                   (type $ext.i32->ext) 
        (call $self.Float32Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Float32Array<ext.i32x2>ext                                                               (type $ext.i32x2->ext) 
        (call $self.Float32Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Float64Array<i32>ext                                                                           (type $i32->ext) 
        (call $self.Float64Array)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Float64Array<ext>ext                                                                           (type $ext->ext) 
        (call $self.Float64Array)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Float64Array<ext.i32>ext                                                                   (type $ext.i32->ext) 
        (call $self.Float64Array)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Float64Array<ext.i32x2>ext                                                               (type $ext.i32x2->ext) 
        (call $self.Float64Array)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $new.Uint8ClampedArray<i32>ext                                                                      (type $i32->ext) 
        (call $self.Uint8ClampedArray)
        (call $i32->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint8ClampedArray<ext>ext                                                                      (type $ext->ext) 
        (call $self.Uint8ClampedArray)
        (call $ext->array# local(0))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint8ClampedArray<ext.i32>ext                                                              (type $ext.i32->ext) 
        (call $self.Uint8ClampedArray)
        (call $ext.i32->array# local(0) local(1))
        (call $construct<ext2>ext)
        )

    (func   $new.Uint8ClampedArray<ext.i32x2>ext                                                          (type $ext.i32x2->ext) 
        (call $self.Uint8ClampedArray)
        (call $ext.i32x2->array# local(0) local(1) (get 2))
        (call $construct<ext2>ext)
    )

    (func   $self.TypedArray::set<ext2>                                                                           (type $ext2->) 
        (call $self.TypedArray::set) 
        local(0)
        (call $ext->array# local(1))
        (call $apply<ext3>)
        )

    (func   $self.TypedArray::set<ext2.i32>                                                                   (type $ext2.i32->) 
        (call $self.TypedArray::set) 
        local(0)
        (call $ext.i32->array# local(1) (get 2))
        (call $apply<ext3>)
    )
	    
    (func   $self.TypedArray::slice<ext>ext                                                                     (type $ext->ext) 
        (call $self.TypedArray::slice) 
        local(0)
        (call $array#)
        (call $apply<ext3>ext)
    )


