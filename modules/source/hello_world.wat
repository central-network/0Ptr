(module
    (import "self" "memory" (memory $shared 10 65535 shared))
    (import "chain" "close" (func $close))
    
    (start $main
        (log<ref> (text 'hello world test function call'))
    )
)