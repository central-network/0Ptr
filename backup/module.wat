(module

    (global $self (import "self" "self") externref)

    (func   $self.Reflect.get<ext2>ext          (import "Reflect" "get")                (param externref externref) (result externref))
    (func   $self.requestAnimationFrame<fun>    (import "self" "requestAnimationFrame") (param funcref))
    
    (func $self.console.log<fun> (import "console" "log") (param funcref))
	(func $self.console.warn<f32> (import "console" "warn") (param f32))

    (memory 1000 1000 shared)
    (global $OFFSET.byteOffset (mut i32) (i32.const 728))

    (func   $get<*>offset                   (param i32) (result i32)
        (i32.add
            (i32.mul (local.get 0) (i32.const 4))
            (global.get $OFFSET.byteOffset) 
        )
        (i32.load)
    )

    (func   $get<*.at>offset              (param i32 i32) (result i32)
        (if (result i32) (local.get 1)
            (then 
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
                (i32.add (local.get 1))
            )
            (else 
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
        )
        (i32.load)
    )


    (func   $instantiate (export "instantiate")
        (call $self.requestAnimationFrame<fun>
            (ref.func $onanimationframe) 
        )
    )

    (start  $instantiate)

    ;; Pointer
    (func   $new<>pointer* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; Array
    (func   $new<>array* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; Object
    (func   $new<>object* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; ArrayBuffer
    (func   $new<>arrayBuffer* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; Worker
    (func   $new<>worker* 
    (result i32)
    
        (i32.const 0)
    )
    
    (func   $get<worker*>url* 
    (param i32) (result i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        )
        (i32.load)
    )

    (func   $set<worker*.url*> 
    (param i32 i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        ) 
        (local.get 1)
        (i32.store)
    )
    

    (func   $get<worker*>name* 
    (param i32) (result i32)

        (i32.add 
            (i32.load
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const 4)
        )
        (i32.load)
    )

    (func   $set<worker*.name*> 
    (param i32 i32)

        (i32.add 
            (i32.load
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const 4)
        ) 
        (local.get 1)
        (i32.store)
    )
    

    ;; String
    (func   $new<>string* 
    (result i32)
    
        (i32.const 0)
    )
    
    (func   $get<string*>buffer* 
    (param i32) (result i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        )
        (i32.load)
    )

    (func   $set<string*.buffer*> 
    (param i32 i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        ) 
        (local.get 1)
        (i32.store)
    )
    

    ;; ScreenOrientation
    (func   $new<>screenOrientation* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; Screen
    (func   $new<>screen* 
    (result i32)
    
        (i32.const 0)
    )
    
    (func   $get<screen*>orientation* 
    (param i32) (result i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        )
        (i32.load)
    )

    (func   $set<screen*.orientation*> 
    (param i32 i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        ) 
        (local.get 1)
        (i32.store)
    )
    

    ;; Element
    (func   $new<>element* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; BodyElement
    (func   $new<>bodyElement* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; CanvasElement
    (func   $new<>canvasElement* 
    (result i32)
    
        (i32.const 0)
    )
    

    ;; Document
    (func   $new<>document* 
    (result i32)
    
        (i32.const 0)
    )
    
    (func   $get<document*>body* 
    (param i32) (result i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        )
        (i32.load)
    )

    (func   $set<document*.body*> 
    (param i32 i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        ) 
        (local.get 1)
        (i32.store)
    )
    

    ;; Window
    (func   $new<>window* 
    (result i32)
    
        (i32.const 0)
    )
    
    (func   $get<window*>name* 
    (param i32) (result i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        )
        (i32.load)
    )

    (func   $set<window*.name*> 
    (param i32 i32)

        (i32.load
            (i32.add
                (i32.mul (local.get 0) (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        ) 
        (local.get 1)
        (i32.store)
    )
    

    (func   $get<window*>screen* 
    (param i32) (result i32)

        (i32.add 
            (i32.load
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const 4)
        )
        (i32.load)
    )

    (func   $set<window*.screen*> 
    (param i32 i32)

        (i32.add 
            (i32.load
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const 4)
        ) 
        (local.get 1)
        (i32.store)
    )
    

    (func   $get<window*>document* 
    (param i32) (result i32)

        (i32.add 
            (i32.load
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const 8)
        )
        (i32.load)
    )

    (func   $set<window*.document*> 
    (param i32 i32)

        (i32.add 
            (i32.load
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const 8)
        ) 
        (local.get 1)
        (i32.store)
    )
    

    (func   $lifecycle  
        
    )

    (func   $secondfunc  
        
    )

    (func   $children  
        
    )

    (func   $onanimationframe (param f32) 
        
        (call $self.console.warn<f32> (local.get 0))
    )

    (func   $parent (param i32 i32 i32) 
        
    )

    (elem   declare 1 $lifecycle)
    (elem   declare 2 $secondfunc)
    (elem   declare 3 $children)
    (elem   declare 4 $onanimationframe)
    (elem   declare 5 $parent)
    (elem   declare 7 $new<>pointer*) ;; debug
    (elem   declare 8 $new<>array*) ;; debug
    (elem   declare 9 $new<>object*) ;; debug
    (elem   declare 10 $new<>arrayBuffer*) ;; debug
    (elem   declare 11 $new<>worker*) ;; debug
    (elem   declare 12 $new<>string*) ;; debug
    (elem   declare 13 $new<>screenOrientation*) ;; debug
    (elem   declare 14 $new<>screen*) ;; debug
    (elem   declare 15 $new<>element*) ;; debug
    (elem   declare 16 $new<>bodyElement*) ;; debug
    (elem   declare 17 $new<>canvasElement*) ;; debug
    (elem   declare 18 $new<>document*) ;; debug
    (elem   declare 19 $new<>window*) ;; debug
)