(module
    (memory 1 10)

    (global $imports new Object)
    (global $buffer mut extern)
    (global $memoryView mut extern)

    (global $self.navigator.deviceMemory i32)
    (global $self.navigator.hardwareConcurrency i32)

    (start $main
        (call $prepare_imports)
        (call $window<ref> global($imports))
    )   

    (func $prepare_imports
        (local $options ref)
        (local $memory ref)
        (local $module ref)
        (local $postData ref)
        (local $workerURL ref)
        (local $memoryView ref)
        (local $i i32)

        (local.set $options (new $self.Object<>ref))
        (local.set $module (new $self.Uint8Array<ref>ref
            (new $self.SharedArrayBuffer<i32>ref
                global($worker/length)
            )
        ))

        (call $self.Reflect.set<ref.ref.i32> local($options) text('initial') i32(10))
        (call $self.Reflect.set<ref.ref.i32> local($options) text('maximum') i32(65535))
        (call $self.Reflect.set<ref.ref.i32> local($options) text('shared')  true)
        

        (local.set $i global($worker/length))

        (memory.init $worker/buffer i32(0) i32(0) local($i))

        (loop $clone
            (local.set $i local($i)--)
            
            (call $self.Reflect.set<ref.i32.i32>
                local($module) local($i) (i32.load local($i))
            )

            (br_if $clone local($i))
        )

        (memory.fill i32(0) i32(0) global($worker/length))

        (data.drop $worker/buffer)

        (local.set $workerURL
            (call $self.URL.createObjectURL<ref>ref
                (new $self.Blob<ref>ref
                    (new $self.Array<ref>ref
                        text('onmessage = e => Object.assign(self, e.data).WebAssembly.instantiate(wasm,self)')
                    )
                )
            )
        )

        (local.set $memory      (new $self.WebAssembly.Memory<ref>ref local($options)))
        (local.set $postData    (new $self.Object<>ref))
 
        (global.set $buffer     (local.get $memory).buffer)
        (global.set $memoryView (new $self.Int32Array<ref>ref global($buffer)))

        (call $self.Reflect.set<ref.ref.ref> 
            local($postData) text('wasm') local($module)
        )

        (call $self.Reflect.set<ref.ref.ref> 
            local($postData) text('memory') local($memory)
        )

        (call $self.Reflect.set<ref.ref.ref> 
            global($imports) text('postData') local($postData)
        )

        (call $self.Reflect.set<ref.ref.ref> 
            global($imports) text('memory') local($memory) 
        )

        (call $self.Reflect.set<ref.ref.ref> 
            global($imports) text('workerURL') local($workerURL)
        )

        (call $self.Reflect.set<ref.ref.ref> 
            global($imports) text('memoryView') global($memoryView)
        )

        (call $self.Reflect.set<ref.i32.i32> global($memoryView) i32(0) i32(0))
        (call $self.Reflect.set<ref.i32.i32> global($memoryView) i32(1) i32(65536))
        (call $self.Reflect.set<ref.i32.i32> global($memoryView) i32(2) (i32.mul (i32.const 10) (i32.const 65536)))
        (call $self.Reflect.set<ref.i32.i32> global($memoryView) i32(3) (i32.mul (i32.const 65535) (i32.const 65536)))
    )

    (data $window "wasm://window.wat")

    (compile $worker "worker.wat" 
        (data $worker/buffer)
        (global $worker/length)
    )

    (func $add (export "add"))
    (func $mul (export "mul"))

    (func $new 
        (export "new")
        (param $TypedArray ref)
        (param $length i32)
        (result ref)

        (call $self.Reflect.construct<ref.ref>ref
            local($TypedArray)
            (call $self.Array.of<ref.i32.i32>ref
                (global.get $buffer) 
                (call $malloc
                    (local.get $TypedArray)
                    (local.get $length)
                ) 
                (local.get $length)
            )
        )
    )

    (func $malloc
        (param $TypedArray ref)
        (param $length i32)
        (result i32)
        (local $bufferSize i32)
        (local $byteLength i32)
        (local $byteOffset i32)
        (local $headersByteOffset i32)

        (local.set $byteLength 
            (i32.mul 
                local($length) 
                local($TypedArray).BYTES_PER_ELEMENT
            )
        )

        (local.set $bufferSize 
            (i32.add 
                local($byteLength) 
                (i32.const 32)
            )
        )

        (if (i32.rem_u local($bufferSize) (i32.const 16))
            (then
                (local.set $bufferSize
                    (i32.add 
                        (local.get $bufferSize)
                        (i32.sub
                            (i32.const 16)
                            (i32.rem_u local($bufferSize) (i32.const 16))
                        )
                    )
                )
            )
        )

        (local.set $headersByteOffset
            (call $self.Atomics.add<ref.i32.i32>i32
                global($memoryView) i32(1) local($bufferSize)
            )
        )

        (log<i32.i32>
            local($bufferSize)
                (local.get $headersByteOffset)
        )

        (local.set $byteOffset
            (i32.add
                (local.get $headersByteOffset)
                (i32.const 32)
            )
        )

        (local.get $byteOffset)
    )
)