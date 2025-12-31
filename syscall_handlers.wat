
    (global $syscall_handlers mut extern)

    (func $bind_syscall_handlers
        (local $options ref)
        (local.set $options (new $self.Object<>ref))

        (call $self.Reflect.set<ref.ref.i32> local($options) text('initial') (i32.const 1))
        (call $self.Reflect.set<ref.ref.i32> local($options) text('maximum') (i32.const 65535))
        (call $self.Reflect.set<ref.ref.ref> local($options) text('element') (text 'anyfunc'))

        (global.set $syscall_handlers
            (new $self.WebAssembly.Table<ref.fun>ref
                (local.get $options)
                (ref.func $void)
            )
        )

        (global.set $console.log
            (call $syscall.register_handler<fun>i32
                (ref.func $console.log)
            )
        )

        (call $self.console.log<ref> 
            (global.get $syscall_handlers)
        )
    )

    (include "syscall_globals.wat")

    (func $syscall.register_handler<fun>i32
        (param $handler funcref)
        (result $opcode i32)

        (apply $self.WebAssembly.Table:grow<i32.fun>i32
            (global.get $syscall_handlers)
            (param i32(1) (local.get $handler))
        )
    )

    (func $void)

    (func $console.log)