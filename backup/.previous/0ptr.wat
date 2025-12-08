(module
	(type $-> 					(func))
	(type $->i32 				(func (result i32)))
	(type $->f32 				(func (result f32)))
	(type $->f64 				(func (result f64)))
	(type $->i64 				(func (result i64)))
	(type $->fun 				(func (result funcref)))
	(type $->ext 				(func (result externref)))
	
	(type $f64-> 				(func (param f64)))
	(type $f64->f64 			(func (param f64) (result f64)))
		
	(type $i32-> 				(func (param i32)))
	(type $i32->i32 			(func (param i32) (result i32)))
	(type $i32->f64 			(func (param i32) (result f64)))
	(type $i32->ext 			(func (param i32) (result externref)))
	(type $i32x2->ext 			(func (param i32 i32) (result externref)))
	(type $i32x3->ext 			(func (param i32 i32 i32) (result externref)))
	(type $i32x4->ext 			(func (param i32 i32 i32 i32) (result externref)))
	(type $i32x5->ext 			(func (param i32 i32 i32 i32 i32) (result externref)))
	(type $i32x6->ext 			(func (param i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x7->ext 			(func (param i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x8->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x9->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x10->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x11->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x12->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x13->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x14->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x15->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x16->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x17->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $i32x18->ext 			(func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
		
	(type $i32.ext-> 			(func (param i32 externref)))
	(type $i32.ext->i32 		(func (param i32 externref) (result i32)))
	(type $i32.ext->f64 		(func (param i32 externref) (result f64)))
	(type $i32.ext->ext 		(func (param i32 externref) (result externref)))

	(type $ext-> 				(func (param externref)))
	(type $ext->i32 			(func (param externref) (result i32)))
	(type $ext->i64 			(func (param externref) (result i64)))
	(type $ext->f64 			(func (param externref) (result f64)))
	(type $ext->fun 			(func (param externref) (result funcref)))
	(type $ext->ext 			(func (param externref) (result externref)))
	
	(type $ext2-> 				(func (param externref externref)))
	(type $ext2->fun 			(func (param externref externref) (result funcref)))
	(type $ext.fun->ext 		(func (param externref funcref) (result externref)))
	(type $ext2.fun->ext 		(func (param externref externref funcref) (result externref)))
	(type $ext2.i32->ext 		(func (param externref externref i32) (result externref)))
	(type $ext3-> 				(func (param externref externref externref)))
	(type $ext3->i32 			(func (param externref externref externref) (result i32)))
	(type $ext2->ext 			(func (param externref externref) (result externref)))
	(type $ext3->ext 			(func (param externref externref externref) (result externref)))
	(type $ext4->ext 			(func (param externref externref externref externref) (result externref)))
	(type $ext5->ext 			(func (param externref externref externref externref externref) (result externref)))
	(type $ext6->ext 			(func (param externref externref externref externref externref externref) (result externref)))
	(type $ext7->ext 			(func (param externref externref externref externref externref externref externref) (result externref)))

	(type $ext2->i32 			(func (param externref externref) (result i32)))
	(type $ext2->i64 			(func (param externref externref) (result i64)))
	(type $ext2->f64 			(func (param externref externref) (result f64)))
	
	(type $ext.i32-> 			(func (param externref i32) ))
	(type $ext.i32->ext 		(func (param externref i32) (result externref)))
	(type $ext.i32->i32 		(func (param externref i32) (result i32)))
	(type $ext.i32->f64 		(func (param externref i32) (result f64)))
	(type $ext.i32x2->ext 		(func (param externref i32 i32) (result externref)))
	(type $ext.i32x3->ext 		(func (param externref i32 i32 i32) (result externref)))
	(type $ext.i32x4->ext 		(func (param externref i32 i32 i32 i32) (result externref)))
	(type $ext.i32x5->ext 		(func (param externref i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x6->ext 		(func (param externref i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x7->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x8->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x9->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x10->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x11->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x12->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x13->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x14->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x15->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x16->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))
	(type $ext.i32x17->ext 		(func (param externref i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result externref)))

	(type $ext.i32.ext-> 		(func (param externref i32 externref) ))
	(type $ext.i32.ext->ext 	(func (param externref i32 externref) (result externref)))
	(type $ext.i32.ext->i32 	(func (param externref i32 externref) (result i32)))
	(type $ext.i32.ext->f64 	(func (param externref i32 externref) (result f64)))

	(type $ext.f64-> 			(func (param externref f64) ))
	(type $ext.f64->f64 		(func (param externref f64) (result f64)))
	(type $ext.f64->ext 		(func (param externref f64) (result externref)))
	
	(type $i64-> 				(func (param i64)))
	(type $i64->i64 			(func (param i64) (result i64)))
	(type $i64->f64 			(func (param i64) (result f64)))
	(type $i64->ext 			(func (param i64) (result externref)))
		
	(type $i64.ext-> 			(func (param i64 externref)))
	(type $i64.ext->i64 		(func (param i64 externref) (result i64)))
	(type $i64.ext->f64 		(func (param i64 externref) (result f64)))
	(type $i64.ext->ext 		(func (param i64 externref) (result externref)))

	(type $ext.i64-> 			(func (param externref i64) ))
	(type $ext.i64->ext 		(func (param externref i64) (result externref)))
	(type $ext.i64->i64 		(func (param externref i64) (result i64)))
	(type $ext.i64->f64 		(func (param externref i64) (result f64)))

	(type $ext.i64.ext-> 		(func (param externref i64 externref) ))
	(type $ext.i64.ext->ext 	(func (param externref i64 externref) (result externref)))
	(type $ext.i64.ext->i64 	(func (param externref i64 externref) (result i64)))
	(type $ext.i64.ext->f64 	(func (param externref i64 externref) (result f64)))

	(global $scope 
		(import "global" "scope") 
		externref 
	)

	(func $at<ext.i32>as<ext>
		(import "global" "i") (type $ext.i32->ext)
		)

	(func $at<ext.i32>as<i32>
		(import "global" "i") (type $ext.i32->i32)
		)

	(func $at<ext2>as<ext>
		(import "global" "i") (type $ext2->ext)
		)
	(func $valueOf
		(import "global" "i") (type $ext2->ext)
	)
	
	(func $fn<ext.i32>
		(import "global" "fn") (type $ext.i32->)
		)
	(func $fn<ext.i32.ext>
		(import "global" "fn") (type $ext.i32.ext->)
		)
	(func $fn<ext.i32>to<ext>
		(import "global" "fn") (type $ext.i32->ext)
		)

	(func $fn<ext.i32>to<i32>
		(import "global" "fn") (type $ext.i32->i32)
		)

	(func $fn<ext2>
		(import "global" "fn") (type $ext2->)
		)
	
	(func $fn<ext2>to<ext>
		(import "global" "fn") (type $ext2->ext)
		)
	(func $fn<ext3>to<ext>
		(import "global" "fn") (type $ext3->ext)
		)
	(func $fn<ext4>to<ext>
		(import "global" "fn") (type $ext4->ext)
		)
	(func $fn<ext5>to<ext>
		(import "global" "fn") (type $ext5->ext)
		)
	(func $fn<ext6>to<ext>
		(import "global" "fn") (type $ext6->ext)
		)
	(func $fn<ext7>to<ext>
		(import "global" "fn") (type $ext7->ext)
		)
	(func $fn<ext>to<ext>
		(import "global" "fn") (type $ext->ext)
		)
	(func $fn<ext>to<f64>
		(import "global" "fn") (type $ext->f64)
		)
	(func $fn<ext>to<i64>
		(import "global" "fn") (type $ext->i64)
		)
	(func $fn<ext>to<i32>
		(import "global" "fn") (type $ext->i32)
		)
	(func $fn<ext.i64>
		(import "global" "fn") (type $ext.i64->)
		)
	(func $fn<ext.i64.ext>
		(import "global" "fn") (type $ext.i64.ext->)
		)
	(func $fn<ext.i64>to<ext>
		(import "global" "fn") (type $ext.i64->ext)
		)

	(func $fn<ext.i64>to<i64>
		(import "global" "fn") (type $ext.i64->i64)
		)
	(func $fn<ext.f64>
		(import "global" "fn") (type $ext.f64->)
		)
	(func $fn<ext.f64>to<ext>
		(import "global" "fn") (type $ext.f64->ext)
		)
	(func $fn<ext.f64>to<f64>
		(import "global" "fn") (type $ext.f64->f64)
		)
	(func $fn<ext.fun>to<ext>
		(import "global" "fn") (type $ext.fun->ext)
		)
	(func $fn<ext2.fun>to<ext>
		(import "global" "fn") (type $ext2.fun->ext)
		)
	(func $fn<ext2.i32>to<ext>
		(import "global" "fn") (type $ext2.i32->ext)
	)
	
	(func $call<ref.key>args<ext>
		(import "global" "call") (type $ext3->)
		)
	(func $call<ref.key>args<ext>to<ext>
		(import "global" "call") (type $ext3->ext)
		)
	(func $call<ref.key>args<ext>to<i32>
		(import "global" "call") (type $ext3->i32)
	)


	(memory $buffer 			
		(import "global" "buffer") 2)
	(memory $cache 				
		(import "global" "cache") 1)
	(memory $memory 			
		(import "global" "memory") 1 10 shared
	)

	(global $time 				
		(import "global" "time") 			(mut f64) )
	(global $Number				
		(import "global" "Number") 			externref )
	(global $ArrayBuffer		
		(import "global" "ArrayBuffer") 	externref )
	(global $Float32Array		
		(import "global" "Float32Array")	externref )
	(global $Uint8Array			
		(import "global" "Uint8Array")  	externref )
	(global $Int32Array			
		(import "global" "Int32Array")  	externref )
	(global $textEncode	
		(import "global" "textEncode") funcref
		)
	

	(func $dump
		(import "global" "log")
		(param externref))
	(func $log
		(import "global" "log")
		(param i32))
	(func $logf64
		(import "global" "log")
		(param f64))
	(func $log2i
		(import "global" "log")
		(param i32 i32))
	(func $warn
		(import "global" "warn")
		(param i32))
	(func $error
		(import "global" "error")
		(param i32))
	
	(func $extend 
		(import "global" "extend")
		(param externref)
		(result externref))	
	(func $constructWithI32 
		(import "global" "construct") 
		(param externref i32)
		(result externref))
	(func $constructWithExt 
		(import "global" "construct") 
		(param externref externref)
		(result externref))
	(func $constructNoArgs 
		(import "global" "construct") 
		(param externref)
		(result externref))
	(func $getArrayIndex 
		(import "global" "getArrayIndex")
		(param externref externref)
		(result i32))	
	(func $getArrayValue 
		(import "global" "getArrayValue") 
		(param i32 externref)
		(result externref))
	(func $getArrayValueAsFuncref 
		(import "global" "getArrayValue") 
		(param externref i32)
		(result funcref))
	(func $typeof 
		(import "global" "typeof") 
		(param externref)
		(result externref))
	(func $keyof 
		(import "global" "keyof") 
		(param externref externref)
		(result externref))		
	(func $funcof 
		(import "global" "keyof") 
		(param externref externref)
		(result funcref))	
	(func $applyWithNone 
		(import "global" "apply") 
		(param externref)
		(result externref))	
	(func $applyWithExtReturnI32 
		(import "global" "apply") 
		(param externref externref)
		(result i32))
	(func $applyWithExtReturnExt 
		(import "global" "apply") 
		(param externref externref)
		(result externref))		
	(func $applyWithExtNoReturn 
		(import "global" "apply") 
		(param externref externref))				
	(func $applyFuncThisArgExt0NoReturn 
		(import "global" "apply") 
		(param externref externref externref))		
	(func $applyFuncThisArgExt0ReturnExt 
		(import "global" "apply") 
		(param externref externref externref)
		(result externref))				
	(func $is 
		(import "global" "is") 
		(param externref externref)
		(result i32))	
	(func $toFuncrefFromExternref 
		(import "global" "to") 
		(param externref) (result funcref))				
	(func $toI32FromExternref 
		(import "global" "to") 
		(param externref) (result i32))				
	(func $readText 
		(import "global" "readText") 
		(result externref))
	(func $storeText 
		(import "global" "storeText") 
		(param externref funcref funcref)
		(result externref))
	
	(func $defineHeaderProperty 
		(import "global" "defineHeaderProperty") 
		(param externref externref funcref funcref))
	(func $defineKeyValueProperty 
		(import "global" "defineKeyValueProperty") 
		(param externref externref externref))
	(func $defineTypedArrayProperty 
		(import "global" "defineTypedArrayProperty") 
		(param externref externref externref externref))
	(func $onanimationframe
		(import "global" "onanimationframe")
		(param f64 i32 f64))
	(func $ondispatchevent
		(import "global" "ondispatchevent")
		(param i32))

	;; <--- imports

	
	;; Tables
	(table $funcref 30 funcref) (func $funcref 
		(param i32) (result funcref)
			(table.get $funcref (local.get 0))
		)

	(table $extref 30 externref) (func $extref 
		(param i32) (result externref)
			(table.get $extref (local.get 0))
		)
	(table $tmp 30 funcref) 

	;; ClassPointers
	(global $NumberClass 					(mut i32) (i32.const 0))
	(global $Float32ArrayClass 				(mut i32) (i32.const 0))
	(global $BooleanClass 					(mut i32) (i32.const 0))
	(global $Uint8NumberClass 				(mut i32) (i32.const 0))
	(global $Uint8ArrayClass 				(mut i32) (i32.const 0))
	(global $Int32ArrayClass 				(mut i32) (i32.const 0))
	(global $Int32NumberClass 				(mut i32) (i32.const 0))
	(global $ClassPointer 					(mut i32) (i32.const 0))
	(global $TypedArrayClass 				(mut i32) (i32.const 0))
	
	;; event globals
	(global $epoch 							(mut f64) (f64.const 0))
	(global $frame 							(mut i32) (i32.const 0))
	(global $now 							(mut f64) (f64.const 0))
	(global $EventStatusOffset 					 i32  (i32.const 0))
	(global $EventCallCountOffset 				 i32  (i32.const 4))
	(global $EventIsOnceOffset 					 i32  (i32.const 8))
	(global $EventFrameOffset 					 i32  (i32.const 12))
	(global $EventClassIndex 					 i32  (i32.const 17))
	
	(func $nextTick
		;; inform js side for debuggers
		(call $onanimationframe
			(global.get $epoch)
			(global.get $frame)
			(global.get $now))
			
		;; look for active events
		;;(call $processNextEvent (global.get $firstOffset)))
		(call $processNextEvent (i32.const 48)))

	(func $addIntegerProperty
		(param $byteOffset i32)
		(param $integer i32)
		(result i32)

		(local.set $integer
			(i32.add
				(local.get $integer)
				(call $getHeaderOfValueOrLengthI32
					(local.get $byteOffset)
				)
			)
		)

		(call $setHeaderOfValueOrLengthI32
			(local.get $byteOffset)
			(local.get $integer)
		)

		(local.get $integer)
		)
	(func $getPropertyPointer
		(param $byteOffset i32)
		(param $propertyOffset i32)
		(result i32)

		(i32.load
			(memory $buffer)
			(i32.add
				(local.get $byteOffset)
				(local.get $propertyOffset)
			)
		)
		)

	(func $checkEventStatus
		(param $byteOffset i32)
		(result i32)

		(call $getHeaderOfValueOrLengthUI8
			(call $getPropertyPointer
				(local.get $byteOffset)
				(global.get $EventStatusOffset)
			)
		))
	(func $checkEventIsOnce
		(param $byteOffset i32)
		(result i32)

		;; check is it a once time callable event
		(if (call $getHeaderOfValueOrLengthUI8
				(call $getPropertyPointer
					(local.get $byteOffset)
					(global.get $EventIsOnceOffset)
				)
			)
			;; it is, so is it called before
			(then
				(return 
					(i32.eqz 
						(call $getEventCallCount 
							(local.get $byteOffset)
						)
					)
				)
			)
		)
		(i32.const 1))
	(func $checkEventFrame
		(param $byteOffset i32)
		(result i32)

		(local $eventFrame i32)
		(local.set $eventFrame 
			(call $getHeaderOfValueOrLengthI32
				(call $getPropertyPointer
					(local.get $byteOffset)
					(global.get $EventFrameOffset)
				)
			)
		)

		;; is this a frame based event
		(if (local.get $eventFrame)
			;; yes frame value has been settled
			(then
				(if (i32.rem_u 
						(global.get $frame)
						(local.get $eventFrame))
					;; frame has a reminder
					;; event must be suspended
					(then (return (i32.const 0))) 
					;; reminder gets zero
					;; process that event
				)
			)
		)
		;; no that is not a frame based event
		;; continue like it's verified
		(i32.const 1))
	(func $getEventCallCount
		(param $byteOffset i32)
		(result i32)

		(call $getHeaderOfValueOrLengthI32
			(call $getPropertyPointer
				(local.get $byteOffset)
				(global.get $EventCallCountOffset)
			)
		))
	(func $addEventCallCount
		(param $byteOffset i32)
		(result i32)

		(call $addIntegerProperty
			(call $getPropertyPointer
				(local.get $byteOffset)
				(global.get $EventCallCountOffset)
			)
			(i32.const 1)
		))

	(func $isEventPointer
		(param $byteOffset i32)
		(result i32)

		(i32.eq
			(call $getHeaderOfClassIndexI32 
				(local.get $byteOffset)
			)
			(global.get $EventClassIndex)
			)
		)
	(func $processNextEvent
		(param $byteOffset i32)
		;; store next pointer offset to stack
		(local.set $byteOffset
			(call $getHeaderOfNextOffsetI32
				(local.get $byteOffset)
			)
		)

		;;break event check chain
		(if (local.get $byteOffset) 
			(then)(else return))

		;; is this pointer is a event pointer
		(if (call $isEventPointer 	(local.get $byteOffset))
			(then
		(if (call $checkEventStatus (local.get $byteOffset))
			(then
		(if (call $checkEventIsOnce	(local.get $byteOffset))
			(then
		(if (call $checkEventFrame 	(local.get $byteOffset))
			(then
				;; increase event call count
				(call $addEventCallCount (local.get $byteOffset))
				(drop)

				;; status is active
				(call $ondispatchevent
					(local.get $byteOffset)
				)
			)
		)))))))
		;; anyway go for next
		(call $processNextEvent 
			(local.get $byteOffset)
		))

	(func $animationFrame 
		(param $epoch f64)

		;; update clock
		(global.set $now
			(f64.add
				(local.get $epoch)
				(global.get $time)
			)
		)

		;; update frame
		(global.set $frame
			(i32.add
				(global.get $frame)
				(i32.const 1)
			)
		)

		;; update global epoch time
		(global.set $epoch (local.get $epoch))

		;; call for event search
		(call $nextTick)
	)

	(func $malloc
		(param $byteLength i32) 
		(result i32)
		
		(local $byteOffset i32)
		(local $nextOffset i32) 

		;; asking for last allocation
		(local.set $byteOffset
			(call $getLastOffset)
		)

		;; alignation want this settlement serperate
		(local.set $nextOffset
			(i32.add
				(local.get $byteOffset)
				(i32.add
					(local.get $byteLength)
					(i32.const 4)
				)
			)
		)

		;; let's check is offset aligned and probably
		;; it is aligned, so dont use stack for lower
		;; probabilities, just calculate again, green
		(if (i32.rem_u 
				(local.get $nextOffset) 
				(global.get $ALIGNBYTES)
			)
			(then
				(local.set $nextOffset
					(i32.add
						(local.get $nextOffset)
						(i32.sub
							(global.get $ALIGNBYTES)
							(i32.rem_u 
								(local.get $nextOffset) 
								(global.get $ALIGNBYTES)
							)
						)
					)
				)
			)
		)

		;; now we writing the headers, firstly next 
		;; offset header, it is atomic -> mem + lock 
		(i32.store 
			(memory $buffer)
			(local.get $byteOffset)
			(local.get $nextOffset)
		)

		;; return writeable byteoffset
		(i32.add
			(i32.const 4) 
			(local.get $byteOffset)
		)
		)

	(func $palloc 
		(param $ClassPointer i32) 
		(param $byteLength i32) 
		(result i32)

		;; write start point -----> Number {byteOffset}
		(local $byteOffset i32)
		(local $classIndex i32)

		(if (local.get $ClassPointer)
			(then
				(local.set $classIndex
					(call $getHeaderOfValueOrLengthI32
						(local.get $ClassPointer)
					)
				)
			)
		)

		;; allocated byteLength / excludes 24 byte head
		;; this could be useful :) maybe, babeee <3
		(local.set $byteOffset
			(i32.add
				(call $malloc 
					(i32.add
						(local.get $byteLength)
						(global.get $BYTELENGTH)
					)
				)
				(global.get $BYTELENGTH)
			)
		)

		(call $setHeaderOfByteLengthI32
			(local.get $byteOffset)
			(local.get $byteLength)
		)

		(if (local.get $classIndex)
			(then
				(call $setHeaderOfClassIndexI32
					(local.get $byteOffset)
					(local.get $classIndex)
				)
			)
		)

		;; return writeable byte offset to who asked
		(local.get $byteOffset)
		;; end babe, it's always here
		)
	(func $getLastOffset 
		(result i32) (local i32 i32)

		;; WARNING: this structure only checks boolean
		;; for each loop step, i prefer to write next
		;; offset at top of allocation. it's more nice
		;; i don't want a math sum (current + length)
		;; operation at every loop.
		(loop
			;; read current ptri's next offset
			(i32.load
				(memory $buffer)
				(local.get 0)
			)
			local.set 1

			;; is it filled or empty, check it
			(if (local.get 1)
				(then
					local.get 1
					local.set 0
					br 1
				)
			)
		)
		;; i find a value for you babe
		local.get 0
	)
	
	(func $setInt32 
		(param $byteOffset i32) 
		(param $offset i32) 
		(param $value i32) 
		
		(i32.store 
			(memory $buffer)
			(i32.add 
				(local.get $byteOffset) 
				(local.get $offset)
			)
			(local.get $value)
		))

	(func $getInt32
		(param $byteOffset i32) 
		(param $offset i32) 
		(result i32)
		
		(i32.load
			(memory $buffer)
			(i32.add 
				(local.get $byteOffset) 
				(local.get $offset)
			)
		)
		)
	(func $setFloat32 
		(param $byteOffset i32) 
		(param $offset i32) 
		(param $value f32) 
		
		(f32.store 
			(memory $buffer)
			(i32.add 
				(local.get $byteOffset) 
				(local.get $offset)
			)
			(local.get $value)
		))
	 
	(func $getFloat32 
		(param $byteOffset i32) 
		(param $offset i32) 
		(result f32)
		
		(f32.load
			(memory $buffer)
			(i32.add 
				(local.get $byteOffset) 
				(local.get $offset)
			)
		)
		)
	(func $setUint8 
		(param $byteOffset i32) 
		(param $offset i32) 
		(param $value i32) 
		
		(i32.store8 
			(memory $buffer)
			(i32.add 
				(local.get $byteOffset) 
				(local.get $offset)
			)
			(local.get $value)
		))
	 
	(func $getUint8 
		(param $byteOffset i32) 
		(param $offset i32) 
		(result i32)
		
		(i32.load8_u
			(memory $buffer)
			(i32.add 
				(local.get $byteOffset) 
				(local.get $offset)
			)
		)
	)

	(func $getHeaderOfValueOrLengthF32
		(param i32) (result f32)
		(f32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
		)
		)
	(global $getHeaderOfValueOrLengthF32 i32 (i32.const 0))
	(elem (table $funcref) (i32.const 0) $getHeaderOfValueOrLengthF32)

	(func $setHeaderOfValueOrLengthF32
		(param i32 f32) 
		(f32.store 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfValueOrLengthF32 i32 (i32.const 1))
	(elem (table $funcref) (i32.const 1) $setHeaderOfValueOrLengthF32)

	(func $getHeaderOfValueOrLengthI32
		(param i32) (result i32)
		(i32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
		)
		)
	(global $getHeaderOfValueOrLengthI32 i32 (i32.const 2))
	(elem (table $funcref) (i32.const 2) $getHeaderOfValueOrLengthI32)

	(func $setHeaderOfValueOrLengthI32
		(param i32 i32) 
		(i32.store 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfValueOrLengthI32 i32 (i32.const 3))
	(elem (table $funcref) (i32.const 3) $setHeaderOfValueOrLengthI32)

	(func $getHeaderOfValueOrLengthUI8
		(param i32) (result i32)
		(i32.load8_u 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
		)
		)
	(global $getHeaderOfValueOrLengthUI8 i32 (i32.const 4))
	(elem (table $funcref) (i32.const 4) $getHeaderOfValueOrLengthUI8)

	(func $setHeaderOfValueOrLengthUI8
		(param i32 i32) 
		(i32.store8
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfValueOrLengthUI8 i32 (i32.const 5))
	(elem (table $funcref) (i32.const 5) $setHeaderOfValueOrLengthUI8)

	(func $getHeaderOfValueOrLengthSI8
		(param i32) (result i32)
		(i32.load8_s 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
		)
		)
	(global $getHeaderOfValueOrLengthSI8 i32 (i32.const 6))
	(elem (table $funcref) (i32.const 6) $getHeaderOfValueOrLengthSI8)

	(func $setHeaderOfValueOrLengthSI8
		(param i32 i32) 
		(i32.store8
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_VALUEORLEN)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfValueOrLengthSI8 i32 (i32.const 7))
	(elem (table $funcref) (i32.const 7) $setHeaderOfValueOrLengthSI8)

	(func $getHeaderOfClassIndexI32
		(param i32) (result i32)
		(i32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_CLASSINDEX)
			)
		)
		)
	(global $getHeaderOfClassIndexI32 i32 (i32.const 8))
	(elem (table $funcref) (i32.const 8) $getHeaderOfClassIndexI32)

	(func $setHeaderOfClassIndexI32
		(param i32 i32) 
		(i32.store
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_CLASSINDEX)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfClassIndexI32 i32 (i32.const 9))
	(elem (table $funcref) (i32.const 9) $setHeaderOfClassIndexI32)

	(func $getHeaderOfClassIndexExtRef
		(param i32) (result externref)
		(call $getArrayValue
			(call $getHeaderOfClassIndexI32
				(local.get 0)
			)
			(global.get $scope)
		)
		)
	(global $getHeaderOfClassIndexExtRef i32 (i32.const 10))
	(elem (table $funcref) (i32.const 10) $getHeaderOfClassIndexExtRef)

	(func $setHeaderOfClassIndexExtRef
		(param i32 externref) 
		(call $setHeaderOfClassIndexI32
			(local.get 0)
			(call $getArrayIndex
				(local.get 1)
				(global.get $scope)
			)
		)
		)
	(global $setHeaderOfClassIndexExtRef i32 (i32.const 11))
	(elem (table $funcref) (i32.const 11) $setHeaderOfClassIndexExtRef)

	(func $getHeaderOfValueOrLengthExt
		(param i32) (result externref)
		(call $getArrayValue
			(call $getHeaderOfValueOrLengthI32
				(local.get 0)
			)
			(global.get $scope)
		)
		)
	(global $getHeaderOfValueOrLengthExt i32 (i32.const 12))
	(elem (table $funcref) (i32.const 12) $getHeaderOfValueOrLengthExt)

	(func $setHeaderOfValueOrLengthExt
		(param i32 externref) 
		(call $setHeaderOfValueOrLengthI32
			(local.get 0)
			(call $getArrayIndex
				(local.get 1)
				(global.get $scope)
			)
		)
		)
	(global $setHeaderOfValueOrLengthExt i32 (i32.const 13))
	(elem (table $funcref) (i32.const 13) $setHeaderOfValueOrLengthExt)

	(func $getHeaderOfParentI32
		(param i32) (result i32)
		(i32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_PARENTPTRI)
			)
		)
		)
	(global $getHeaderOfParentI32 i32 (i32.const 14))
	(elem (table $funcref) (i32.const 14) $getHeaderOfParentI32)

	(func $setHeaderOfParentI32
		(param i32 i32) 
		(i32.store
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_PARENTPTRI)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfParentI32 i32 (i32.const 15))
	(elem (table $funcref) (i32.const 15) $setHeaderOfParentI32)

	(func $getHeaderOfByteLengthI32
		(param i32) (result i32)
		(i32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_BYTELENGTH)
			)
		)
		)
	(global $getHeaderOfByteLengthI32 i32 (i32.const 16))
	(elem (table $funcref) (i32.const 16) $getHeaderOfByteLengthI32)

	(func $setHeaderOfByteLengthI32
		(param i32 i32) 
		(i32.store
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_BYTELENGTH)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfByteLengthI32 i32 (i32.const 17))
	(elem (table $funcref) (i32.const 17) $setHeaderOfByteLengthI32)

	(func $getHeaderOfReservedValueI32
		(param i32) (result i32)
		(i32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_RESVDVALUE)
			)
		)
		)
	(global $getHeaderOfReservedValueI32 i32 (i32.const 18))
	(elem (table $funcref) (i32.const 18) $getHeaderOfReservedValueI32)

	(func $setHeaderOfReservedValueI32
		(param i32 i32) 
		(i32.store
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_RESVDVALUE)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfReservedValueI32 i32 (i32.const 19))
	(elem (table $funcref) (i32.const 19) $setHeaderOfReservedValueI32)

	(func $getHeaderOfReservedValueF32
		(param i32) (result f32)
		(f32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_RESVDVALUE)
			)
		)
		)
	(global $getHeaderOfReservedValueF32 i32 (i32.const 20))
	(elem (table $funcref) (i32.const 20) $getHeaderOfReservedValueF32)

	(func $setHeaderOfReservedValueF32
		(param i32 f32) 
		(f32.store
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_RESVDVALUE)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfReservedValueF32 i32 (i32.const 21))
	(elem (table $funcref) (i32.const 21) $setHeaderOfReservedValueF32)

	(func $getHeaderOfNextOffsetI32
		(param i32) (result i32)
		(i32.load 
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_NEXTOFFSET)
			)
		)
		)
	(global $getHeaderOfNextOffsetI32 i32 (i32.const 22))
	(elem (table $funcref) (i32.const 22) $getHeaderOfNextOffsetI32)

	(func $setHeaderOfNextOffsetI32
		(param i32 i32) 
		(i32.store
			(memory $buffer)
			(i32.add
				(local.get 0) 
				(global.get $BYTEOFFSET_NEXTOFFSET)
			)
			(local.get 1)
		)
		)
	(global $setHeaderOfNextOffsetI32 i32 (i32.const 23))
	(elem (table $funcref) (i32.const 23) $setHeaderOfNextOffsetI32)


	(func $Date.now->f64
		(type $->f64)
		(call $fn<ext>to<f64>
			(global.get $self.Date.now)
		)
		)
	(func $Date.now->i64
		(type $->i64)
		(call $fn<ext>to<i64>
			(global.get $self.Date.now)
		)
		)
	(func $Date.now
		(type $->i32)
		(call $fn<ext>to<i32>
			(global.get $self.Date.now)
		)
	)

	(func $console.log<i32>
		(type $i32->)
		(call $fn<ext.i32> 
			(global.get $self.console.log)
			(local.get 0)
		)
		)
	(func $console.log<i64>
		(type $i64->)
		(call $fn<ext.i64> 
			(global.get $self.console.log)
			(local.get 0)
		)
		)
	(func $console.log<f64>
		(type $f64->)
		(call $fn<ext.f64> 
			(global.get $self.console.log)
			(local.get 0)
		)
		)

	(func $console.log<i32.ext>
		(type $i32.ext->)
		(call $fn<ext.i32.ext> 
			(global.get $self.console.log)
			(local.get 0)
			(local.get 1)
		)
		)

	(func $console.log<ext>
		(type $ext->)
		(call $fn<ext2> 
			(global.get $self.console.log)
			(local.get 0)
		)
	)

	(func $Function<body>to<ext>
		(type $ext->ext)
		(call $fn<ext2>to<ext> 
			(global.get $self.Function)
			(call $String.from<ext2>
				(call $text.07
					(global.get $r)
					(global.get $e)
					(global.get $t)
					(global.get $u)
					(global.get $r)
					(global.get $n)
					(global.get $space)
				)
				(local.get 0)
			)
		)
		)

	(func $Function<arg0.body>to<ext>
		(type $ext2->ext)
		(call $fn<ext3>to<ext> 
			(global.get $self.Function)
			(local.get 0)
			(call $String.from<ext2>
				(call $text.07
					(global.get $r)
					(global.get $e)
					(global.get $t)
					(global.get $u)
					(global.get $r)
					(global.get $n)
					(global.get $space)
				)
				(local.get 1)
			)
		)
	)

	(func $eval->ext
		(type $ext->ext)
		(call $fn<ext2>to<ext> 
			(global.get $self.eval)
			(local.get 0)
		)
	)

	(func $scope.at
		(type $i32->ext)
		(call $at<ext.i32>as<ext>
			(global.get $scope)
			(local.get 0)
		)
		)

	(func $scope.push
		(type $ext->)
		(call $call<ref.key>args<ext>
			(global.get $scope)
			(call $text.04
				(global.get $p)
				(global.get $u)
				(global.get $s)
				(global.get $h)
			)
			(local.get 0)
		)
		)
	(func $scope.store
		(type $ext->i32) (local $i i32)

		(local.set $i
			(call $scope.indexOf
				(local.get 0)
			)
		)

		(if (i32.eq (i32.const -1) (local.get $i))
			(then
				(call $scope.push (local.get 0))
				(return (call $scope.indexOf (local.get 0)))
			)
		)

		(local.get $i)
		)

	(func $scope.indexOf
		(type $ext->i32)
		(call $call<ref.key>args<ext>to<i32>
			(global.get $scope)
			(call $text.07
				(global.get $i)
				(global.get $n)
				(global.get $d)
				(global.get $e)
				(global.get $x)
				(global.get $O)
				(global.get $f)
			)
			(local.get 0)
		)
	)

	(func $name.of
		(type $ext->ext)
		(call $at<ext2>as<ext>
			(local.get 0)
			(call $text.04
				(global.get $n)
				(global.get $a)
				(global.get $m)
				(global.get $e)
			)
		)
		)

	(func $prototype.of
		(type $ext->ext)
		(call $at<ext2>as<ext>
			(local.get 0)
			(call $text.09
				(global.get $p)
				(global.get $r)
				(global.get $o)
				(global.get $t)
				(global.get $o)
				(global.get $t)
				(global.get $y)
				(global.get $p)
				(global.get $e)
			)
		)
	)
	
	(func $String.fromCharCode<nop>
		(type $->ext)
		(call $fn<ext>to<ext>
			(global.get $self.String.fromCharCode)
		)
		)	
	(func $String.fromCharCode
		(type $i32->ext)
		(call $fn<ext.i32>to<ext>
			(global.get $self.String.fromCharCode)
			(local.get 0)
		)
		)
	(func $String.of<charCode>
		(type $i32->ext)
		(call $String.fromCharCode
			(local.get 0)
		)
		)
	(func $String.of<charCode2>
		(type $i32x2->ext)
		(call $String.from<ext2>
			(call $String.fromCharCode (local.get 0))
			(call $String.fromCharCode (local.get 1))
		)
		)
	(func $String.from<ext>
		(type $ext->ext)
		(call $call<ref.key>args<ext>to<ext>
			(call $Array.of<ext>
				(local.get 0)
			)
			(call $text.04
				(global.get $j)
				(global.get $o)
				(global.get $i)
				(global.get $n)
			) ;; join('')
			(call $String.fromCharCode<nop>)
		)
		)
	(func $String.from<ext2>
		(type $ext2->ext)
		(call $call<ref.key>args<ext>to<ext>
			(call $Array.of<ext2>
				(local.get 0)
				(local.get 1)
			)
			(call $text.04
				(global.get $j)
				(global.get $o)
				(global.get $i)
				(global.get $n)
			) ;; join('')
			(call $String.fromCharCode<nop>)
		)
		)
	(func $String.from<ext3>
		(type $ext3->ext)
		(call $call<ref.key>args<ext>to<ext>
			(call $Array.of<ext3>
				(local.get 0)
				(local.get 1)
				(local.get 2)
			)
			(call $text.04
				(global.get $j)
				(global.get $o)
				(global.get $i)
				(global.get $n)
			) ;; join('')
			(call $String.fromCharCode<nop>)
		)
		)
	(func $String.from<ext4>
		(type $ext4->ext)
		(call $call<ref.key>args<ext>to<ext>
			(call $Array.of<ext4>
				(local.get 0)
				(local.get 1)
				(local.get 2)
				(local.get 3)
			)
			(call $text.04
				(global.get $j)
				(global.get $o)
				(global.get $i)
				(global.get $n)
			) ;; join('')
			(call $String.fromCharCode<nop>)
		)
		)
	(func $String.from<ext5>
		(type $ext5->ext)
		(call $call<ref.key>args<ext>to<ext>
			(call $Array.of<ext5>
				(local.get 0)
				(local.get 1)
				(local.get 2)
				(local.get 3)
				(local.get 4)
			)
			(call $text.04
				(global.get $j)
				(global.get $o)
				(global.get $i)
				(global.get $n)
			) ;; join('')
			(call $String.fromCharCode<nop>)
		)
		)
	(func $String.from<ext6>
		(type $ext6->ext)
		(call $call<ref.key>args<ext>to<ext>
			(call $Array.of<ext6>
				(local.get 0)
				(local.get 1)
				(local.get 2)
				(local.get 3)
				(local.get 4)
				(local.get 5)
			)
			(call $text.04
				(global.get $j)
				(global.get $o)
				(global.get $i)
				(global.get $n)
			) ;; join('')
			(call $String.fromCharCode<nop>)
		)
	)

	(func $class.extend<name.super>
		(type $ext2->ext)
		(call $fn<ext2>to<ext>
			(call $Function<arg0.body>to<ext>
				(call $text.04
					(global.get $a)
					(global.get $r)
					(global.get $g)
					(global.get $0)
				)
				(call $String.from<ext5>
					(call $text.07
						(global.get $parenthesisRoundOpener)
						(global.get $c)
						(global.get $l)
						(global.get $a)
						(global.get $s)
						(global.get $s)
						(global.get $space)
						)
					(local.get 0) ;; [Name]
					(call $text.09
						(global.get $space)
						(global.get $e)
						(global.get $x)
						(global.get $t)
						(global.get $e)
						(global.get $n)
						(global.get $d)
						(global.get $s)
						(global.get $space)
						)
					(call $text.04
						(global.get $a)
						(global.get $r)
						(global.get $g)
						(global.get $0)
					) ;; arguments[0]
					(call $text.04
						(global.get $space)
						(global.get $parenthesisCurlyOpener)
						(global.get $parenthesisCurlyCloser)
						(global.get $parenthesisRoundCloser)
						)
				) ;; return (class [Name] extends arguments[0] {})
			) 
			(local.get 1)
		) ;; call(Function, '[...]')
		)

	(func $class.extend<shadow.super>
		(type $ext2->ext)
		(call $fn<ext2>to<ext>
			(call $Function<arg0.body>to<ext>
				(call $text.04
					(global.get $a)
					(global.get $r)
					(global.get $g)
					(global.get $0)
				)
				(call $String.from<ext5>
					(call $text.07
						(global.get $parenthesisRoundOpener)
						(global.get $c)
						(global.get $l)
						(global.get $a)
						(global.get $s)
						(global.get $s)
						(global.get $space)
						)
					(call $name.of
						(local.get 0)
					) ;; [Name]
					(call $text.09
						(global.get $space)
						(global.get $e)
						(global.get $x)
						(global.get $t)
						(global.get $e)
						(global.get $n)
						(global.get $d)
						(global.get $s)
						(global.get $space)
						)
					(call $text.04
						(global.get $a)
						(global.get $r)
						(global.get $g)
						(global.get $0)
					) ;; arguments[0]
					(call $text.04
						(global.get $space)
						(global.get $parenthesisCurlyOpener)
						(global.get $parenthesisCurlyCloser)
						(global.get $parenthesisRoundCloser)
						)
				) ;; return (class [Name] extends arguments[0] {})
			) 
			(local.get 1)
		) ;; call(Function, '[...]')
	)

	(func $Array.create
		(type $->ext)
		(call $fn<ext>to<ext> 
			(global.get $self.Array.of)
		)
		)
	(func $Array.of<i32>
		(type $i32->ext)
		(call $fn<ext.i32>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
		)
		)
	(func $Array.of<ext>
		(type $ext->ext)
		(call $fn<ext2>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
		)
		)
	(func $Array.of<ext2>
		(type $ext2->ext)
		(call $fn<ext3>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
		)
		)

	(func $Array.of<ext.fun>
		(type $ext.fun->ext)
		(call $fn<ext2.fun>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
		)
		)
	(func $Array.of<ext.i32>
		(type $ext.i32->ext)
		(call $fn<ext2.i32>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
		)
		)
	(func $Array.of<ext3>
		(type $ext3->ext)
		(call $fn<ext4>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
			(local.get 2)
		)
		)
	(func $Array.of<ext4>
		(type $ext4->ext)
		(call $fn<ext5>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
			(local.get 2)
			(local.get 3)
		)
		)
	(func $Array.of<ext5>
		(type $ext5->ext)
		(call $fn<ext6>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
			(local.get 2)
			(local.get 3)
			(local.get 4)
		)
		)
	(func $Array.of<ext6>
		(type $ext6->ext)
		(call $fn<ext7>to<ext> 
			(global.get $self.Array.of)
			(local.get 0)
			(local.get 1)
			(local.get 2)
			(local.get 3)
			(local.get 4)
			(local.get 5)
		)
	)


	(func $Object.setPrototypeOf
		(type $ext2->ext)
		(call $fn<ext3>to<ext>
			(global.get $self.Object.setPrototypeOf)
			(local.get 0)
			(local.get 1)
		)
		)
	(func $Object.getPrototypeOf
		(type $ext->ext)
		(call $fn<ext2>to<ext> 
			(global.get $self.Object.getPrototypeOf)
			(local.get 0)
		)
		)

	(func $Object.fromEntries
		(type $ext->ext)
		(call $fn<ext2>to<ext> 
			(global.get $self.Object.fromEntries)
			(local.get 0)
		)
		)
	(func $Object.fromEntries<key.fun>
		(type $ext.fun->ext)
		(call $Object.fromEntries
			(call $Array.of<ext>
				(call $Array.of<ext.fun>
					(local.get 0)
					(local.get 1)
				)
			)
		)
		)	
	(func $Object.fromEntries<key.i32>
		(type $ext.i32->ext)
		(call $Object.fromEntries
			(call $Array.of<ext>
				(call $Array.of<ext.i32>
					(local.get 0)
					(local.get 1)
				)
			)
		)
		)
	(func $Object.fromEntries<key.ext>
		(type $ext2->ext)
		(call $Object.fromEntries
			(call $Array.of<ext>
				(call $Array.of<ext2>
					(local.get 0)
					(local.get 1)
				)
			)
		)
		)
	(func $Object.fromEntries<key.ext>x2
		(type $ext4->ext)
		(call $Object.fromEntries
			(call $Array.of<ext2>
				(call $Array.of<ext2>
					(local.get 0)
					(local.get 1)
				)
				(call $Array.of<ext2>
					(local.get 2)
					(local.get 3)
				)
			)
		)
		)
	(func $Object.fromEntries<key.ext>x3
		(type $ext6->ext)
		(call $Object.fromEntries
			(call $Array.of<ext3>
				(call $Array.of<ext2>
					(local.get 0)
					(local.get 1)
				)
				(call $Array.of<ext2>
					(local.get 2)
					(local.get 3)
				)
				(call $Array.of<ext2>
					(local.get 4)
					(local.get 5)
				)
			)
		)
		)
	(func $Object.defineProperty
		(type $ext3->ext)
		(call $fn<ext4>to<ext>
			(global.get $self.Object.defineProperty)
			(local.get 0)
			(local.get 1)
			(local.get 2)
		)
		)
	(func $Object.create
		(type $->ext)
		(call $fn<ext2>to<ext>
			(global.get $self.Object.fromEntries)
			(call $Array.create)
		)
	)
	
	(func $PropertyDesc.apply
		(type $ext->)

		(call $Object.defineProperty
			(call $PropertyDesc.getTarget (local.get 0))
			(call $PropertyDesc.getName (local.get 0))
			(local.get 0)
		)

		drop
		)	
	(func $PropertyDesc.create
		(type $ext->ext)
		(call $Object.defineProperty
			(call $Object.create)
			(call $text.06
				(global.get $t)
				(global.get $a)
				(global.get $r)
				(global.get $g)
				(global.get $e)
				(global.get $t)
			)
			(call $Object.fromEntries<key.ext>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(local.get 0)
			)
		)
		)
	(func $PropertyDesc.setEnumerable
		(type $ext->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.10
				(global.get $e)
				(global.get $n)
				(global.get $u)
				(global.get $m)
				(global.get $e)
				(global.get $r)
				(global.get $a)
				(global.get $b)
				(global.get $l)
				(global.get $e)
			)
			(call $Object.fromEntries<key.i32>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(i32.const 1)
			)
		)
		drop
		)
	(func $PropertyDesc.setWriteable
		(type $ext->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.09
				(global.get $w)
				(global.get $r)
				(global.get $i)
				(global.get $t)
				(global.get $e)
				(global.get $a)
				(global.get $b)
				(global.get $l)
				(global.get $e)
			)
			(call $Object.fromEntries<key.i32>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(i32.const 1)
			)
		)
		drop
		)
	(func $PropertyDesc.setConfigurable
		(type $ext->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.12
				(global.get $c)
				(global.get $o)
				(global.get $n)
				(global.get $f)
				(global.get $i)
				(global.get $g)
				(global.get $u)
				(global.get $r)
				(global.get $a)
				(global.get $b)
				(global.get $l)
				(global.get $e)
			)
			(call $Object.fromEntries<key.i32>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(i32.const 1)
			)
		)
		drop
		)
	(func $PropertyDesc.setGetter
		(type $ext2->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.03
				(global.get $g)
				(global.get $e)
				(global.get $t)
			)
			(call $Object.fromEntries<key.ext>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(local.get 1)
			)
		)
		drop
		)
	(func $PropertyDesc.setSetter
		(type $ext2->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.03
				(global.get $s)
				(global.get $e)
				(global.get $t)
			)
			(call $Object.fromEntries<key.ext>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(local.get 1)
			)
		)
		drop
		)
	(func $PropertyDesc.setValue
		(type $ext2->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.05
				(global.get $v)
				(global.get $a)
				(global.get $l)
				(global.get $u)
				(global.get $e)
			)
			(call $Object.fromEntries<key.ext>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(local.get 1)
			)
		)
		drop
		)
	
	(func $PropertyDesc.setName
		(type $ext2->)
		(call $Object.defineProperty
			(local.get 0)
			(call $text.04
				(global.get $n)
				(global.get $a)
				(global.get $m)
				(global.get $e)
			)
			(call $Object.fromEntries<key.ext>
				(call $text.05
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
				)
				(local.get 1)
			)
		)
		drop
		)
	(func $PropertyDesc.getName
		(type $ext->ext)
		(call $valueOf
			(local.get 0)
			(call $text.04
				(global.get $n)
				(global.get $a)
				(global.get $m)
				(global.get $e)
			)
		)
		)
	(func $PropertyDesc.getTarget
		(type $ext->ext)
		(call $valueOf
			(local.get 0)
			(call $text.06
				(global.get $t)
				(global.get $a)
				(global.get $r)
				(global.get $g)
				(global.get $e)
				(global.get $t)
			)
		)
	)
	
	(func $Reflect.construct
		(type $ext2->ext)
		(call $fn<ext3>to<ext> 
			(global.get $self.Reflect.construct)
			(local.get 0)
			(local.get 1)
		)
	)

	(func $set.classes
		(local $desc externref)

		(block $createPrototypes

					global.get $P
					global.get $o
					global.get $i
					global.get $n
					global.get $t
					global.get $e
					global.get $r
				call $text.07
				global.get $self.Number
				call $class.extend<name.super>
			global.set $class.Pointer		

				global.get $self.Uint8Array
				global.get $class.Pointer
				call $class.extend<shadow.super>
			global.set $class.Uint8Array
			

				global.get $self.Int32Array
				global.get $class.Pointer
				call $class.extend<shadow.super>
			global.set $class.Int32Array
			

				global.get $self.Float32Array
				global.get $class.Pointer
				call $class.extend<shadow.super>
			global.set $class.Float32Array
			

				global.get $self.Number
				global.get $class.Float32Array
				call $class.extend<shadow.super>
			global.set $class.Number
			

				global.get $self.Boolean
				global.get $class.Uint8Array
				call $class.extend<shadow.super>
			global.set $class.Boolean
			
		)

		(block $createTestProperty (local.set $desc 
			(call $PropertyDesc.create 			
					(call $prototype.of 
						(global.get $class.Boolean)
					)
					)
					)
			(call $PropertyDesc.setName 		
				(local.get $desc)
				(call $text.04
					(global.get $b)
					(global.get $a)
					(global.get $b)
					(global.get $e)
				)
				)

			(call $PropertyDesc.setGetter 		
				(local.get $desc)
				(call $Function<body>to<ext>
					(call $text.02
						(global.get $1)
						(global.get $2)
					)
				)
				)

			(call $PropertyDesc.setConfigurable 
				(local.get $desc))
			(call $PropertyDesc.setEnumerable 	
				(local.get $desc))
			(call $PropertyDesc.apply			
				(local.get $desc))

		)

		(block $testField
			(call $dump
				(call $Reflect.construct
					(global.get $class.Boolean)
					(call $Array.of<i32>
						(i32.const 22)
					)
				)
			)
		)
	)

	(func $init

		(call $dump
			(call $at<ext.i32>as<ext>
				(global.get $scope)
				(i32.const 0)
			)
		)

		(call $dump
			(call $valueOf
				(call $at<ext.i32>as<ext>
					(global.get $scope)
					(i32.const 1)
				)
				(call $at<ext.i32>as<ext>
					(global.get $scope)
					(i32.const 0)
				)
			)
		)

		(call $dump
			(call $at<ext.i32>as<ext>
				(global.get $scope)
				(i32.const 2)
			)
		)

		(call $dump
			(global.get $scope)
		)

		;;(call $set.globals);;(call $log.globals)
		;;(call $set.classes);;(call $log.globals)


	)
	(start $init)




	(func $set.globals
		(global.set $self
			(call $at<ext.i32>as<ext>
				(global.get $scope)
				(i32.const 1)
			)
			)

		(global.set $self.eval
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.04
					(global.get $e)
					(global.get $v)
					(global.get $a)
					(global.get $l)
				)
			)
			)

		(global.set $self.Function
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.08
					(global.get $F)
					(global.get $u)
					(global.get $n)
					(global.get $c)
					(global.get $t)
					(global.get $i)
					(global.get $o)
					(global.get $n)
				)
			)
			)

		(global.set $self.Reflect
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.07
					(global.get $R)
					(global.get $e)
					(global.get $f)
					(global.get $l)
					(global.get $e)
					(global.get $c)
					(global.get $t)
				)
			)
			)	
		(global.set $self.Reflect.construct
			(call $at<ext2>as<ext>
				(global.get $self.Reflect)
				(call $text.09
					(global.get $c)
					(global.get $o)
					(global.get $n)
					(global.get $s)
					(global.get $t)
					(global.get $r)
					(global.get $u)
					(global.get $c)
					(global.get $t)
				)
			)
			)

		(global.set $self.Date
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.04
					(global.get $D)
					(global.get $a)
					(global.get $t)
					(global.get $e)
				)
			)
			)	
		(global.set $self.Date.now
			(call $at<ext2>as<ext>
				(global.get $self.Date)
				(call $text.03
					(global.get $n)
					(global.get $o)
					(global.get $w)
				)
			)
			)

		(global.set $self.console
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.07
					(global.get $c)
					(global.get $o)
					(global.get $n)
					(global.get $s)
					(global.get $o)
					(global.get $l)
					(global.get $e)
				)
			)
			)

		(global.set $self.console.log
			(call $at<ext2>as<ext>
				(global.get $self.console)
				(call $text.03
					(global.get $l)
					(global.get $o)
					(global.get $g)
				)
			)
			)
		(global.set $self.console.warn
			(call $at<ext2>as<ext>
				(global.get $self.console)
				(call $text.04
					(global.get $w)
					(global.get $a)
					(global.get $r)
					(global.get $n)
				)
			)
			)
		(global.set $self.Worker
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.06
					(global.get $W)
					(global.get $o)
					(global.get $r)
					(global.get $k)
					(global.get $e)
					(global.get $r)
				)
			)
			)
		(global.set $self.Date
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.04
					(global.get $D)
					(global.get $a)
					(global.get $t)
					(global.get $e)
				)
			)
			)
		(global.set $self.Date.now
			(call $at<ext2>as<ext>
				(global.get $self.Date)
				(call $text.03
					(global.get $n)
					(global.get $o)
					(global.get $w)
				)
			)
			)
		(global.set $self.Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.05
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Array.isArray
			(call $at<ext2>as<ext>
				(global.get $self.Array)
				(call $text.07
					(global.get $i)
					(global.get $s)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Array.prototype
			(call $at<ext2>as<ext>
				(global.get $self.Array)
				(call $text.09
					(global.get $p)
					(global.get $r)
					(global.get $o)
					(global.get $t)
					(global.get $o)
					(global.get $t)
					(global.get $y)
					(global.get $p)
					(global.get $e)
				)
			)
			)
		(global.set $self.Array.prototype.at
			(call $at<ext2>as<ext>
				(global.get $self.Array.prototype)
				(call $text.02
					(global.get $a)
					(global.get $t)
				)
			)
			)
		(global.set $self.Array.prototype.join
			(call $at<ext2>as<ext>
				(global.get $self.Array.prototype)
				(call $text.04
					(global.get $j)
					(global.get $o)
					(global.get $i)
					(global.get $n)
				)
			)
			)
		(global.set $self.Array.prototype.push
			(call $at<ext2>as<ext>
				(global.get $self.Array.prototype)
				(call $text.04
					(global.get $p)
					(global.get $u)
					(global.get $s)
					(global.get $h)
				)
			)
			)
		(global.set $self.Array.prototype.indexOf
			(call $at<ext2>as<ext>
				(global.get $self.Array.prototype)
				(call $text.07
					(global.get $i)
					(global.get $n)
					(global.get $d)
					(global.get $e)
					(global.get $x)
					(global.get $O)
					(global.get $f)
				)
			)
			)
		(global.set $self.ArrayBuffer
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.11
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
					(global.get $B)
					(global.get $u)
					(global.get $f)
					(global.get $f)
					(global.get $e)
					(global.get $r)
				)
			)
			)
		(global.set $self.ArrayBuffer.isView
			(call $at<ext2>as<ext>
				(global.get $self.ArrayBuffer)
				(call $text.06
					(global.get $i)
					(global.get $s)
					(global.get $V)
					(global.get $i)
					(global.get $e)
					(global.get $w)
				)
			)
			)
		(global.set $self.DataView
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.08
					(global.get $D)
					(global.get $a)
					(global.get $t)
					(global.get $a)
					(global.get $V)
					(global.get $i)
					(global.get $e)
					(global.get $w)
				)
			)
			)
		(global.set $self.Uint8Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.10
					(global.get $U)
					(global.get $i)
					(global.get $n)
					(global.get $t)
					(global.get $8)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Uint16Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.11
					(global.get $U)
					(global.get $i)
					(global.get $n)
					(global.get $t)
					(global.get $1)
					(global.get $6)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Uint32Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.11
					(global.get $U)
					(global.get $i)
					(global.get $n)
					(global.get $t)
					(global.get $3)
					(global.get $2)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Int8Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.09
					(global.get $I)
					(global.get $n)
					(global.get $t)
					(global.get $8)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Int16Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.10
					(global.get $I)
					(global.get $n)
					(global.get $t)
					(global.get $1)
					(global.get $6)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Int32Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.10
					(global.get $I)
					(global.get $n)
					(global.get $t)
					(global.get $3)
					(global.get $2)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Float32Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.12
					(global.get $F)
					(global.get $l)
					(global.get $o)
					(global.get $a)
					(global.get $t)
					(global.get $3)
					(global.get $2)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Float64Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.12
					(global.get $F)
					(global.get $l)
					(global.get $o)
					(global.get $a)
					(global.get $t)
					(global.get $6)
					(global.get $4)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.BigUint64Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.14
					(global.get $B)
					(global.get $i)
					(global.get $g)
					(global.get $U)
					(global.get $i)
					(global.get $n)
					(global.get $t)
					(global.get $6)
					(global.get $4)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.BigInt64Array
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.13
					(global.get $B)
					(global.get $i)
					(global.get $g)
					(global.get $I)
					(global.get $n)
					(global.get $t)
					(global.get $6)
					(global.get $4)
					(global.get $A)
					(global.get $r)
					(global.get $r)
					(global.get $a)
					(global.get $y)
				)
			)
			)
		(global.set $self.Uint8Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Uint8Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Uint16Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Uint16Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Uint32Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Uint32Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Int8Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Int8Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Int16Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Int16Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Int32Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Int32Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Float32Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Float32Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Float64Array.of
			(call $at<ext2>as<ext>
				(global.get $self.Float64Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.BigUint64Array.of
			(call $at<ext2>as<ext>
				(global.get $self.BigUint64Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.BigInt64Array.of
			(call $at<ext2>as<ext>
				(global.get $self.BigInt64Array)
				(call $text.02
					(global.get $o)
					(global.get $f)
				)
			)
			)
		(global.set $self.Uint8Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Uint8Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Uint16Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Uint16Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Uint32Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Uint32Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Int8Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Int8Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Int16Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Int16Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Int32Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Int32Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Float32Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Float32Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.Float64Array.from
			(call $at<ext2>as<ext>
				(global.get $self.Float64Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.BigUint64Array.from
			(call $at<ext2>as<ext>
				(global.get $self.BigUint64Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.BigInt64Array.from
			(call $at<ext2>as<ext>
				(global.get $self.BigInt64Array)
				(call $text.04
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
				)
			)
			)
		(global.set $self.BigInt
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.06
					(global.get $B)
					(global.get $i)
					(global.get $g)
					(global.get $I)
					(global.get $n)
					(global.get $t)
				)
			)
			)
		(global.set $self.Number
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.06
					(global.get $N)
					(global.get $u)
					(global.get $m)
					(global.get $b)
					(global.get $e)
					(global.get $r)
				)
			)
			)
		(global.set $self.Number.parseInt
			(call $at<ext2>as<ext>
				(global.get $self.Number)
				(call $text.08
					(global.get $p)
					(global.get $a)
					(global.get $r)
					(global.get $s)
					(global.get $e)
					(global.get $I)
					(global.get $n)
					(global.get $t)
				)
			)
			)
		(global.set $self.Number.parseFloat
			(call $at<ext2>as<ext>
				(global.get $self.Number)
				(call $text.10
					(global.get $p)
					(global.get $a)
					(global.get $r)
					(global.get $s)
					(global.get $e)
					(global.get $F)
					(global.get $l)
					(global.get $o)
					(global.get $a)
					(global.get $t)
				)
			)
			)
		(global.set $self.Number.isNaN
			(call $at<ext2>as<ext>
				(global.get $self.Number)
				(call $text.05
					(global.get $i)
					(global.get $s)
					(global.get $N)
					(global.get $a)
					(global.get $N)
				)
			)
			)
		(global.set $self.Number.isFinite
			(call $at<ext2>as<ext>
				(global.get $self.Number)
				(call $text.08
					(global.get $i)
					(global.get $s)
					(global.get $F)
					(global.get $i)
					(global.get $n)
					(global.get $i)
					(global.get $t)
					(global.get $e)
				)
			)
			)
		(global.set $self.Number.isInteger
			(call $at<ext2>as<ext>
				(global.get $self.Number)
				(call $text.09
					(global.get $i)
					(global.get $s)
					(global.get $I)
					(global.get $n)
					(global.get $t)
					(global.get $e)
					(global.get $g)
					(global.get $e)
					(global.get $r)
				)
			)
			)
		(global.set $self.Number.isSafeInteger
			(call $at<ext2>as<ext>
				(global.get $self.Number)
				(call $text.13
					(global.get $i)
					(global.get $s)
					(global.get $S)
					(global.get $a)
					(global.get $f)
					(global.get $e)
					(global.get $I)
					(global.get $n)
					(global.get $t)
					(global.get $e)
					(global.get $g)
					(global.get $e)
					(global.get $r)
				)
			)
			)
		(global.set $self.Boolean
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.07
					(global.get $B)
					(global.get $o)
					(global.get $o)
					(global.get $l)
					(global.get $e)
					(global.get $a)
					(global.get $n)
				)
			)
			)
		(global.set $self.Object
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.06
					(global.get $O)
					(global.get $b)
					(global.get $j)
					(global.get $e)
					(global.get $c)
					(global.get $t)
				)
			)
			)
		(global.set $self.Object.is
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.02
					(global.get $i)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.keys
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.04
					(global.get $k)
					(global.get $e)
					(global.get $y)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.seal
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.04
					(global.get $s)
					(global.get $e)
					(global.get $a)
					(global.get $l)
				)
			)
			)
		(global.set $self.Object.values
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.06
					(global.get $v)
					(global.get $a)
					(global.get $l)
					(global.get $u)
					(global.get $e)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.assign
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.06
					(global.get $a)
					(global.get $s)
					(global.get $s)
					(global.get $i)
					(global.get $g)
					(global.get $n)
				)
			)
			)
		(global.set $self.Object.create
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.06
					(global.get $c)
					(global.get $r)
					(global.get $e)
					(global.get $a)
					(global.get $t)
					(global.get $e)
				)
			)
			)
		(global.set $self.Object.entries
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.07
					(global.get $e)
					(global.get $n)
					(global.get $t)
					(global.get $r)
					(global.get $i)
					(global.get $e)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.freeze
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.06
					(global.get $f)
					(global.get $r)
					(global.get $e)
					(global.get $e)
					(global.get $z)
					(global.get $e)
				)
			)
			)
		(global.set $self.Object.hasOwn
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.06
					(global.get $h)
					(global.get $a)
					(global.get $s)
					(global.get $O)
					(global.get $w)
					(global.get $n)
				)
			)
			)
		(global.set $self.Object.groupBy
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.07
					(global.get $g)
					(global.get $r)
					(global.get $o)
					(global.get $u)
					(global.get $p)
					(global.get $B)
					(global.get $y)
				)
			)
			)
		(global.set $self.Object.fromEntries
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.11
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
					(global.get $E)
					(global.get $n)
					(global.get $t)
					(global.get $r)
					(global.get $i)
					(global.get $e)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.defineProperty
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.14
					(global.get $d)
					(global.get $e)
					(global.get $f)
					(global.get $i)
					(global.get $n)
					(global.get $e)
					(global.get $P)
					(global.get $r)
					(global.get $o)
					(global.get $p)
					(global.get $e)
					(global.get $r)
					(global.get $t)
					(global.get $y)
				)
			)
			)
		(global.set $self.Object.defineProperties
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.16
					(global.get $d)
					(global.get $e)
					(global.get $f)
					(global.get $i)
					(global.get $n)
					(global.get $e)
					(global.get $P)
					(global.get $r)
					(global.get $o)
					(global.get $p)
					(global.get $e)
					(global.get $r)
					(global.get $t)
					(global.get $i)
					(global.get $e)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.preventExtensions
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.17
					(global.get $p)
					(global.get $r)
					(global.get $e)
					(global.get $v)
					(global.get $e)
					(global.get $n)
					(global.get $t)
					(global.get $E)
					(global.get $x)
					(global.get $t)
					(global.get $e)
					(global.get $n)
					(global.get $s)
					(global.get $i)
					(global.get $o)
					(global.get $n)
					(global.get $s)
				)
			)
			)
		(global.set $self.Object.setPrototypeOf
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.14
					(global.get $s)
					(global.get $e)
					(global.get $t)
					(global.get $P)
					(global.get $r)
					(global.get $o)
					(global.get $t)
					(global.get $o)
					(global.get $t)
					(global.get $y)
					(global.get $p)
					(global.get $e)
					(global.get $O)
					(global.get $f)
				)
			)
			)
		(global.set $self.Object.getPrototypeOf
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.14
					(global.get $g)
					(global.get $e)
					(global.get $t)
					(global.get $P)
					(global.get $r)
					(global.get $o)
					(global.get $t)
					(global.get $o)
					(global.get $t)
					(global.get $y)
					(global.get $p)
					(global.get $e)
					(global.get $O)
					(global.get $f)
				)
			)
			)
		(global.set $self.Object.isPrototypeOf
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.13
					(global.get $i)
					(global.get $s)
					(global.get $P)
					(global.get $r)
					(global.get $o)
					(global.get $t)
					(global.get $o)
					(global.get $t)
					(global.get $y)
					(global.get $p)
					(global.get $e)
					(global.get $O)
					(global.get $f)
				)
			)
			)
		(global.set $self.Object.isExtensible
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.12
					(global.get $i)
					(global.get $s)
					(global.get $E)
					(global.get $x)
					(global.get $t)
					(global.get $e)
					(global.get $n)
					(global.get $s)
					(global.get $i)
					(global.get $b)
					(global.get $l)
					(global.get $e)
				)
			)
			)
		(global.set $self.Object.isFrozen
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.08
					(global.get $i)
					(global.get $s)
					(global.get $F)
					(global.get $r)
					(global.get $o)
					(global.get $z)
					(global.get $e)
					(global.get $n)
				)
			)
			)
		(global.set $self.Object.isSealed
			(call $at<ext2>as<ext>
				(global.get $self.Object)
				(call $text.08
					(global.get $i)
					(global.get $s)
					(global.get $S)
					(global.get $e)
					(global.get $a)
					(global.get $l)
					(global.get $e)
					(global.get $d)
				)
			)
			)
		(global.set $self.String
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.06
					(global.get $S)
					(global.get $t)
					(global.get $r)
					(global.get $i)
					(global.get $n)
					(global.get $g)
				)
			)
			)
		(global.set $self.String.fromCharCode
			(call $at<ext2>as<ext>
				(global.get $self.String)
				(call $text.12
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
					(global.get $C)
					(global.get $h)
					(global.get $a)
					(global.get $r)
					(global.get $C)
					(global.get $o)
					(global.get $d)
					(global.get $e)
				)
			)
			)
		(global.set $self.String.fromCodePoint
			(call $at<ext2>as<ext>
				(global.get $self.String)
				(call $text.13
					(global.get $f)
					(global.get $r)
					(global.get $o)
					(global.get $m)
					(global.get $C)
					(global.get $o)
					(global.get $d)
					(global.get $e)
					(global.get $P)
					(global.get $o)
					(global.get $i)
					(global.get $n)
					(global.get $t)
				)
			)
			)
		(global.set $self.Proxy
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.05
					(global.get $P)
					(global.get $r)
					(global.get $o)
					(global.get $x)
					(global.get $y)
				)
			)
			)
		(global.set $self.Proxy.revocable
			(call $at<ext2>as<ext>
				(global.get $self.Proxy)
				(call $text.09
					(global.get $r)
					(global.get $e)
					(global.get $v)
					(global.get $o)
					(global.get $c)
					(global.get $a)
					(global.get $b)
					(global.get $l)
					(global.get $e)
				)
			)
			)
		(global.set $self.TextEncoder
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.11
					(global.get $T)
					(global.get $e)
					(global.get $x)
					(global.get $t)
					(global.get $E)
					(global.get $n)
					(global.get $c)
					(global.get $o)
					(global.get $d)
					(global.get $e)
					(global.get $r)
				)
			)
			)
		(global.set $self.TextDecoder
			(call $at<ext2>as<ext>
				(global.get $self)
				(call $text.11
					(global.get $T)
					(global.get $e)
					(global.get $x)
					(global.get $t)
					(global.get $D)
					(global.get $e)
					(global.get $c)
					(global.get $o)
					(global.get $d)
					(global.get $e)
					(global.get $r)
				)
			)
		)
		)

	(func $log.globals
		(call $console.log<ext> (global.get $self ))
		(call $console.log<ext> (global.get $self.eval ))
		(call $console.log<ext> (global.get $self.console ))
		(call $console.log<ext> (global.get $self.console.log))
		(call $console.log<ext> (global.get $self.console.warn))
		(call $console.log<ext> (global.get $self.console.error))
		(call $console.log<ext> (global.get $self.Worker ))
		(call $console.log<ext> (global.get $self.Date ))
		(call $console.log<ext> (global.get $self.Date.now ))
		(call $console.log<ext> (global.get $self.Array ))
		(call $console.log<ext> (global.get $self.Array.of ))
		(call $console.log<ext> (global.get $self.Array.isArray ))
		(call $console.log<ext> (global.get $self.Array.from ))
		(call $console.log<ext> (global.get $self.ArrayBuffer ))
		(call $console.log<ext> (global.get $self.ArrayBuffer.isView ))
		(call $console.log<ext> (global.get $self.DataView ))
		(call $console.log<ext> (global.get $self.Uint8Array ))
		(call $console.log<ext> (global.get $self.Uint16Array ))
		(call $console.log<ext> (global.get $self.Uint32Array ))
		(call $console.log<ext> (global.get $self.Int8Array ))
		(call $console.log<ext> (global.get $self.Int16Array ))
		(call $console.log<ext> (global.get $self.Int32Array ))
		(call $console.log<ext> (global.get $self.Float32Array ))
		(call $console.log<ext> (global.get $self.Float64Array ))
		(call $console.log<ext> (global.get $self.BigUint64Array ))
		(call $console.log<ext> (global.get $self.BigInt64Array ))
		(call $console.log<ext> (global.get $self.Uint8Array.of ))
		(call $console.log<ext> (global.get $self.Uint16Array.of ))
		(call $console.log<ext> (global.get $self.Uint32Array.of ))
		(call $console.log<ext> (global.get $self.Int8Array.of ))
		(call $console.log<ext> (global.get $self.Int16Array.of))
		(call $console.log<ext> (global.get $self.Int32Array.of ))
		(call $console.log<ext> (global.get $self.Float32Array.of ))
		(call $console.log<ext> (global.get $self.Float64Array.of ))
		(call $console.log<ext> (global.get $self.BigUint64Array.of ))
		(call $console.log<ext> (global.get $self.BigInt64Array.of ))
		(call $console.log<ext> (global.get $self.Uint8Array.from ))
		(call $console.log<ext> (global.get $self.Uint16Array.from ))
		(call $console.log<ext> (global.get $self.Uint32Array.from ))
		(call $console.log<ext> (global.get $self.Int8Array.from ))
		(call $console.log<ext> (global.get $self.Int16Array.from))
		(call $console.log<ext> (global.get $self.Int32Array.from ))
		(call $console.log<ext> (global.get $self.Float32Array.from ))
		(call $console.log<ext> (global.get $self.Float64Array.from ))
		(call $console.log<ext> (global.get $self.BigUint64Array.from ))
		(call $console.log<ext> (global.get $self.BigInt64Array.from ))
		(call $console.log<ext> (global.get $self.BigInt ))
		(call $console.log<ext> (global.get $self.Number ))
		(call $console.log<ext> (global.get $self.Number.parseInt ))
		(call $console.log<ext> (global.get $self.Number.parseFloat ))
		(call $console.log<ext> (global.get $self.Number.isNaN ))
		(call $console.log<ext> (global.get $self.Number.isFinite ))
		(call $console.log<ext> (global.get $self.Number.isInteger ))
		(call $console.log<ext> (global.get $self.Number.isSafeInteger ))
		(call $console.log<ext> (global.get $self.Boolean ))
		(call $console.log<ext> (global.get $self.Object ))
		(call $console.log<ext> (global.get $self.Object.is ))
		(call $console.log<ext> (global.get $self.Object.keys ))
		(call $console.log<ext> (global.get $self.Object.seal ))
		(call $console.log<ext> (global.get $self.Object.values ))
		(call $console.log<ext> (global.get $self.Object.assign ))
		(call $console.log<ext> (global.get $self.Object.create ))
		(call $console.log<ext> (global.get $self.Object.entries ))
		(call $console.log<ext> (global.get $self.Object.freeze ))
		(call $console.log<ext> (global.get $self.Object.hasOwn ))
		(call $console.log<ext> (global.get $self.Object.groupBy ))
		(call $console.log<ext> (global.get $self.Object.fromEntries ))
		(call $console.log<ext> (global.get $self.Object.defineProperty ))
		(call $console.log<ext> (global.get $self.Object.defineProperties))
		(call $console.log<ext> (global.get $self.Object.preventExtensions))
		(call $console.log<ext> (global.get $self.Object.setPrototypeOf))
		(call $console.log<ext> (global.get $self.Object.getPrototypeOf))
		(call $console.log<ext> (global.get $self.Object.isPrototypeOf))
		(call $console.log<ext> (global.get $self.Object.isExtensible))
		(call $console.log<ext> (global.get $self.Object.isFrozen))
		(call $console.log<ext> (global.get $self.Object.isSealed))
		(call $console.log<ext> (global.get $self.String ))
		(call $console.log<ext> (global.get $self.String.fromCharCode ))
		(call $console.log<ext> (global.get $self.String.fromCodePoint ))
		(call $console.log<ext> (global.get $self.Proxy ))
		(call $console.log<ext> (global.get $self.Proxy.revocable ))
		(call $console.log<ext> (global.get $self.TextEncoder ))
		(call $console.log<ext> (global.get $self.TextDecoder ))	
	)



	(global $class.Pointer 					(mut externref) (ref.null extern))
	(global $class.Uint8Array 				(mut externref) (ref.null extern))
	(global $class.Uint16Array 				(mut externref) (ref.null extern))
	(global $class.Uint32Array 				(mut externref) (ref.null extern))
	(global $class.Int8Array 				(mut externref) (ref.null extern))
	(global $class.Int16Array 				(mut externref) (ref.null extern))
	(global $class.Int32Array 				(mut externref) (ref.null extern))
	(global $class.Float32Array 			(mut externref) (ref.null extern))
	(global $class.Float64Array 			(mut externref) (ref.null extern))
	(global $class.BigUint64Array 			(mut externref) (ref.null extern))
	(global $class.BigInt64Array 			(mut externref) (ref.null extern))
	(global $class.Uint8Number 				(mut externref) (ref.null extern))
	(global $class.Uint16Number 			(mut externref) (ref.null extern))
	(global $class.Uint32Number 			(mut externref) (ref.null extern))
	(global $class.Int8Number 				(mut externref) (ref.null extern))
	(global $class.Int16Number 				(mut externref) (ref.null extern))
	(global $class.Int32Number 				(mut externref) (ref.null extern))
	(global $class.Float32Number 			(mut externref) (ref.null extern))
	(global $class.Float64Number 			(mut externref) (ref.null extern))
	(global $class.BigUint64Number 			(mut externref) (ref.null extern))
	(global $class.BigInt64Number 			(mut externref) (ref.null extern))
	(global $class.Number 					(mut externref) (ref.null extern))
	(global $class.Array 					(mut externref) (ref.null extern))
	(global $class.Boolean 					(mut externref) (ref.null extern))
	(global $class.String 					(mut externref) (ref.null extern))
	(global $class.Object 					(mut externref) (ref.null extern))

	(global $self 							(mut externref) (ref.null extern))
	(global $self.Function 					(mut externref) (ref.null extern))
	(global $self.eval 						(mut externref) (ref.null extern))
	(global $self.console 					(mut externref) (ref.null extern))
	(global $self.console.log				(mut externref) (ref.null extern))
	(global $self.console.warn				(mut externref) (ref.null extern))
	(global $self.console.error				(mut externref) (ref.null extern))
	(global $self.Worker 					(mut externref) (ref.null extern))
	(global $self.Date 						(mut externref) (ref.null extern))
	(global $self.Date.now 					(mut externref) (ref.null extern))
	(global $self.Array 					(mut externref) (ref.null extern))
	(global $self.Array.prototype 			(mut externref) (ref.null extern))
	(global $self.Array.prototype.join 		(mut externref) (ref.null extern))
	(global $self.Array.prototype.push 		(mut externref) (ref.null extern))
	(global $self.Array.prototype.at 		(mut externref) (ref.null extern))
	(global $self.Array.prototype.indexOf 	(mut externref) (ref.null extern))
	(global $self.Array.of 					(mut externref) (ref.null extern))
	(global $self.Array.isArray 			(mut externref) (ref.null extern))
	(global $self.Array.from 				(mut externref) (ref.null extern))
	(global $self.ArrayBuffer 				(mut externref) (ref.null extern))
	(global $self.ArrayBuffer.isView 		(mut externref) (ref.null extern))
	(global $self.DataView 					(mut externref) (ref.null extern))
	(global $self.Uint8Array 				(mut externref) (ref.null extern))
	(global $self.Uint16Array 				(mut externref) (ref.null extern))
	(global $self.Uint32Array 				(mut externref) (ref.null extern))
	(global $self.Int8Array 				(mut externref) (ref.null extern))
	(global $self.Int16Array 				(mut externref) (ref.null extern))
	(global $self.Int32Array 				(mut externref) (ref.null extern))
	(global $self.Float32Array 				(mut externref) (ref.null extern))
	(global $self.Float64Array 				(mut externref) (ref.null extern))
	(global $self.BigUint64Array 			(mut externref) (ref.null extern))
	(global $self.BigInt64Array 			(mut externref) (ref.null extern))
	(global $self.Uint8Array.of 			(mut externref) (ref.null extern))
	(global $self.Uint16Array.of 			(mut externref) (ref.null extern))
	(global $self.Uint32Array.of 			(mut externref) (ref.null extern))
	(global $self.Int8Array.of 				(mut externref) (ref.null extern))
	(global $self.Int16Array.of				(mut externref) (ref.null extern))
	(global $self.Int32Array.of 			(mut externref) (ref.null extern))
	(global $self.Float32Array.of 			(mut externref) (ref.null extern))
	(global $self.Float64Array.of 			(mut externref) (ref.null extern))
	(global $self.BigUint64Array.of 		(mut externref) (ref.null extern))
	(global $self.BigInt64Array.of 			(mut externref) (ref.null extern))
	(global $self.Uint8Array.from 			(mut externref) (ref.null extern))
	(global $self.Uint16Array.from 			(mut externref) (ref.null extern))
	(global $self.Uint32Array.from 			(mut externref) (ref.null extern))
	(global $self.Int8Array.from 			(mut externref) (ref.null extern))
	(global $self.Int16Array.from			(mut externref) (ref.null extern))
	(global $self.Int32Array.from 			(mut externref) (ref.null extern))
	(global $self.Float32Array.from 		(mut externref) (ref.null extern))
	(global $self.Float64Array.from 		(mut externref) (ref.null extern))
	(global $self.BigUint64Array.from 		(mut externref) (ref.null extern))
	(global $self.BigInt64Array.from 		(mut externref) (ref.null extern))
	(global $self.BigInt 					(mut externref) (ref.null extern))
	(global $self.Number 					(mut externref) (ref.null extern))
	(global $self.Number.parseInt 			(mut externref) (ref.null extern))
	(global $self.Number.parseFloat 		(mut externref) (ref.null extern))
	(global $self.Number.isNaN 				(mut externref) (ref.null extern))
	(global $self.Number.isFinite 			(mut externref) (ref.null extern))
	(global $self.Number.isInteger 			(mut externref) (ref.null extern))
	(global $self.Number.isSafeInteger 		(mut externref) (ref.null extern))
	(global $self.Boolean 					(mut externref) (ref.null extern))
	(global $self.Object 					(mut externref) (ref.null extern))
	(global $self.Object.is 				(mut externref) (ref.null extern))
	(global $self.Object.keys 				(mut externref) (ref.null extern))
	(global $self.Object.seal 				(mut externref) (ref.null extern))
	(global $self.Object.values 			(mut externref) (ref.null extern))
	(global $self.Object.assign 			(mut externref) (ref.null extern))
	(global $self.Object.create 			(mut externref) (ref.null extern))
	(global $self.Object.entries 			(mut externref) (ref.null extern))
	(global $self.Object.freeze 			(mut externref) (ref.null extern))
	(global $self.Object.hasOwn 			(mut externref) (ref.null extern))
	(global $self.Object.groupBy 			(mut externref) (ref.null extern))
	(global $self.Object.fromEntries 		(mut externref) (ref.null extern))
	(global $self.Object.defineProperty 	(mut externref) (ref.null extern))
	(global $self.Object.defineProperties	(mut externref) (ref.null extern))
	(global $self.Object.preventExtensions	(mut externref) (ref.null extern))
	(global $self.Object.setPrototypeOf		(mut externref) (ref.null extern))
	(global $self.Object.getPrototypeOf		(mut externref) (ref.null extern))
	(global $self.Object.isPrototypeOf		(mut externref) (ref.null extern))
	(global $self.Object.isExtensible		(mut externref) (ref.null extern))
	(global $self.Object.isFrozen			(mut externref) (ref.null extern))
	(global $self.Object.isSealed			(mut externref) (ref.null extern))
	(global $self.String 					(mut externref) (ref.null extern))
	(global $self.String.fromCharCode 		(mut externref) (ref.null extern))
	(global $self.String.fromCodePoint 		(mut externref) (ref.null extern))
	(global $self.Reflect 					(mut externref) (ref.null extern))
	(global $self.Reflect.construct 		(mut externref) (ref.null extern))
	(global $self.Proxy 					(mut externref) (ref.null extern))
	(global $self.Proxy.revocable 			(mut externref) (ref.null extern))
	(global $self.TextEncoder 				(mut externref) (ref.null extern))
	(global $self.TextDecoder 				(mut externref) (ref.null extern))
	
	;; Offsets
	(global $ALIGNBYTES 					 i32 (i32.const   8))
	(global $BYTELENGTH 					 i32 (i32.const  20))
	(global $BYTEOFFSET_NEXTOFFSET 			 i32 (i32.const -24))
	(global $BYTEOFFSET_BYTELENGTH 			 i32 (i32.const -20)) ;; dont mess
	(global $BYTEOFFSET_CLASSINDEX 			 i32 (i32.const -16))
	(global $BYTEOFFSET_PARENTPTRI 			 i32 (i32.const -12))
	(global $BYTEOFFSET_VALUEORLEN 			 i32 (i32.const  -8))
	(global $BYTEOFFSET_RESVDVALUE 			 i32 (i32.const  -4))

	(global $dot i32 (i32.const 46))
	(global $nop i32 (i32.const 0))
	(global $space i32 (i32.const 32))
	(global $parenthesisCurlyOpener i32 (i32.const 123))
	(global $parenthesisCurlyCloser i32 (i32.const 125))
	(global $parenthesisRoundOpener i32 (i32.const 40))
	(global $parenthesisRoundCloser i32 (i32.const 41))
	(global $parenthesisBoxedOpener i32 (i32.const 91))
	(global $parenthesisBoxedCloser i32 (i32.const 93))
	(global $parenthesisAngleOpener i32 (i32.const 60))
	(global $parenthesisAngleCloser i32 (i32.const 62))
	(global $# i32 (i32.const 35))
	(global $0 i32 (i32.const 48))
	(global $1 i32 (i32.const 49))
	(global $2 i32 (i32.const 50))
	(global $3 i32 (i32.const 51))
	(global $4 i32 (i32.const 52))
	(global $5 i32 (i32.const 53))
	(global $6 i32 (i32.const 54))
	(global $7 i32 (i32.const 55))
	(global $8 i32 (i32.const 56))
	(global $9 i32 (i32.const 57))
	(global $A i32 (i32.const 65))
	(global $B i32 (i32.const 66))
	(global $C i32 (i32.const 67))
	(global $D i32 (i32.const 68))
	(global $E i32 (i32.const 69))
	(global $F i32 (i32.const 70))
	(global $G i32 (i32.const 71))
	(global $H i32 (i32.const 72))
	(global $I i32 (i32.const 73))
	(global $J i32 (i32.const 74))
	(global $K i32 (i32.const 75))
	(global $L i32 (i32.const 76))
	(global $M i32 (i32.const 77))
	(global $N i32 (i32.const 78))
	(global $O i32 (i32.const 79))
	(global $P i32 (i32.const 80))
	(global $Q i32 (i32.const 81))
	(global $R i32 (i32.const 82))
	(global $S i32 (i32.const 83))
	(global $T i32 (i32.const 84))
	(global $U i32 (i32.const 85))
	(global $V i32 (i32.const 86))
	(global $W i32 (i32.const 87))
	(global $X i32 (i32.const 88))
	(global $Y i32 (i32.const 89))
	(global $a i32 (i32.const 97))
	(global $b i32 (i32.const 98))
	(global $c i32 (i32.const 99))
	(global $d i32 (i32.const 100))
	(global $e i32 (i32.const 101))
	(global $f i32 (i32.const 102))
	(global $g i32 (i32.const 103))
	(global $h i32 (i32.const 104))
	(global $i i32 (i32.const 105))
	(global $j i32 (i32.const 106))
	(global $k i32 (i32.const 107))
	(global $l i32 (i32.const 108))
	(global $m i32 (i32.const 109))
	(global $n i32 (i32.const 110))
	(global $o i32 (i32.const 111))
	(global $p i32 (i32.const 112))
	(global $q i32 (i32.const 113))
	(global $r i32 (i32.const 114))
	(global $s i32 (i32.const 115))
	(global $t i32 (i32.const 116))
	(global $u i32 (i32.const 117))
	(global $v i32 (i32.const 118))
	(global $w i32 (i32.const 119))
	(global $x i32 (i32.const 120))
	(global $y i32 (i32.const 121))
	(global $z i32 (i32.const 122))
	;; clear text cache
	(func $clearCache
		(memory.fill (memory $cache) 
			(i32.const 0) 
			(i32.const 0) (i32.const 0xffff)))
	;; text cache functions
	(func $text.01 
		(param i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(call $readText))
	(func $text.02 
		(param i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(call $readText))
	(func $text.03 
		(param i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(call $readText))
	(func $text.04 
		(param i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(call $readText))
	(func $text.05 
		(param i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(call $readText))
	(func $text.06 
		(param i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(call $readText))
	(func $text.07 
		(param i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(call $readText))
	(func $text.08 
		(param i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(call $readText))
	(func $text.09 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(call $readText))
	(func $text.10 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(call $readText))
	(func $text.11 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(call $readText))
	(func $text.12 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(ui8.set (memory $cache) (i32.const 11) (local.get 11))
		(call $readText))
	(func $text.13 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(ui8.set (memory $cache) (i32.const 11) (local.get 11))
		(ui8.set (memory $cache) (i32.const 12) (local.get 12))
		(call $readText))
	(func $text.14 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(ui8.set (memory $cache) (i32.const 11) (local.get 11))
		(ui8.set (memory $cache) (i32.const 12) (local.get 12))
		(ui8.set (memory $cache) (i32.const 13) (local.get 13))
		(call $readText))
	(func $text.15 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(ui8.set (memory $cache) (i32.const 11) (local.get 11))
		(ui8.set (memory $cache) (i32.const 12) (local.get 12))
		(ui8.set (memory $cache) (i32.const 13) (local.get 13))
		(ui8.set (memory $cache) (i32.const 14) (local.get 14))
		(call $readText))
	(func $text.16
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(ui8.set (memory $cache) (i32.const 11) (local.get 11))
		(ui8.set (memory $cache) (i32.const 12) (local.get 12))
		(ui8.set (memory $cache) (i32.const 13) (local.get 13))
		(ui8.set (memory $cache) (i32.const 14) (local.get 14))
		(ui8.set (memory $cache) (i32.const 15) (local.get 15))
		(call $readText))		
	(func $text.17 
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(result externref) (call $clearCache)
		(ui8.set (memory $cache) (i32.const 0) (local.get 0))
		(ui8.set (memory $cache) (i32.const 1) (local.get 1))
		(ui8.set (memory $cache) (i32.const 2) (local.get 2))
		(ui8.set (memory $cache) (i32.const 3) (local.get 3))
		(ui8.set (memory $cache) (i32.const 4) (local.get 4))
		(ui8.set (memory $cache) (i32.const 5) (local.get 5))
		(ui8.set (memory $cache) (i32.const 6) (local.get 6))
		(ui8.set (memory $cache) (i32.const 7) (local.get 7))
		(ui8.set (memory $cache) (i32.const 8) (local.get 8))
		(ui8.set (memory $cache) (i32.const 9) (local.get 9))
		(ui8.set (memory $cache) (i32.const 10) (local.get 10))
		(ui8.set (memory $cache) (i32.const 11) (local.get 11))
		(ui8.set (memory $cache) (i32.const 12) (local.get 12))
		(ui8.set (memory $cache) (i32.const 13) (local.get 13))
		(ui8.set (memory $cache) (i32.const 14) (local.get 14))
		(ui8.set (memory $cache) (i32.const 15) (local.get 15))
		(ui8.set (memory $cache) (i32.const 16) (local.get 16))
		(call $readText))
	;; text writing functions
	(func $writeText_l01 (param $byteOffset i32)
		(param i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1)))
	(func $writeText_l02 (param $byteOffset i32)
		(param i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2)))
	(func $writeText_l03 (param $byteOffset i32)
		(param i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3)))
	(func $writeText_l04 (param $byteOffset i32)
		(param i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4)))
	(func $writeText_l05 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5)))
	(func $writeText_l06 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6)))
	(func $writeText_l07 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7)))
	(func $writeText_l08 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8)))
	(func $writeText_l09 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9)))
	(func $writeText_l10 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10)))
	(func $writeText_l11 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11)))
	(func $writeText_l12 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 12)))
	(func $writeText_l13 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 12))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 13)))
	(func $writeText_l14 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 12))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 13))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 14)))
	(func $writeText_l15 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 12))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 13))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 14))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 15)))
	(func $writeText_l16 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 12))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 13))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 14))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 15))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 16)))
	(func $writeText_l17 (param $byteOffset i32)
		(param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 1))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 2))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 3))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 4))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 5))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 6))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 7))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 8))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 9))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 10))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 11))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 12))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 13))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 14))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 15))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 16))
		(local.set 0 (i32.add (local.get 0) (i32.const 1)))
		(ui8.set (memory $buffer) (local.get $byteOffset) (local.get 17)))
)
