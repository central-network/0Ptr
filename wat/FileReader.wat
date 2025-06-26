
    (func   $FileReader                                                                                     (type $i32->i32)
        local($fileReader# ext)
        this(set $fileReader# new self.FileReader())

        [*fileReader $0 externref import(this($fileReader#))]

        apply(self.addEventListener 
            this($fileReader#)
            call($self.Array.of<ext2>ext 'load'#
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.FileReader.onload)
                    call($self.Array.of<ext.i32>ext 
                        this($fileReader#) $0
                    )
                )
            )
        )

        apply(self.addEventListener 
            this($fileReader#)
            call($self.Array.of<ext2>ext 'loadend'#
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.FileReader.onloadend)
                    call($self.Array.of<ext.i32>ext (undefined) $0)
                )
            )
        )

        apply(self.addEventListener 
            this($fileReader#)
            call($self.Array.of<ext2>ext 'loadstart'#
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.FileReader.onloadstart)
                    call($self.Array.of<ext.i32>ext (undefined) $0)
                )
            )
        )

        apply(self.addEventListener 
            this($fileReader#)
            call($self.Array.of<ext2>ext 'progress'#
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.FileReader.onprogress)
                    call($self.Array.of<ext.i32>ext (undefined) $0)
                )
            )
        )

        apply(self.addEventListener 
            this($fileReader#)
            call($self.Array.of<ext2>ext 'error'#
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.FileReader.onerror)
                    call($self.Array.of<ext.i32>ext (undefined) $0)
                )
            )
        )

        apply(self.addEventListener 
            this($fileReader#)
            call($self.Array.of<ext2>ext 'abort'#
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.FileReader.onabort)
                    call($self.Array.of<ext.i32>ext (undefined) $0)
                )
            )
        )

        this(0)
    )

    (func   $wasm.FileReader.onload                                                                        (type $i32.ext->)
        local($reader# ext)
        local($result* i32)
        local($readAs& i32)
        local($handler i32)
        local($work*   i32)

        [*fileReader $0 state FILE_READER_COMPLETED]

        this(set $reader# [*fileReader $0 externref]#)
        this(set $readAs& [*fileReader $0 readAs])
        this(set $handler [*fileReader $0 handler])
        this(set $work*   [*fileReader $0 work])

        (block $type

            (if this($work*) 
                then(this(set $result* import([ $2 'result' ])) br $type)
            )

            (if (i32.eq ARRAY_BUFFER this($readAs&))
                (then this(set $result* [ $2 'result' *buffer ]) br $type)
            )

            (if (i32.eq DATA_URL this($readAs&))
                (then this(set $result* [ $2 'result' *dataURL ]) br $type)
            )

            (if (i32.eq TEXT this($readAs&))
                (then this(set $result* [ $2 'result' *string ]) br $type)
            )

            unreachable
        )

        (if this($result*) 
            then([*fileReader $0 result this($result*)])
            else(warn("FS reader result is zero"))
        )

        (if this($handler)
            then(this(0) (call_indirect (type $i32->) this($handler)))
        )


        warn("FS wasm.FileReader.onload")   
    )

    (func   $wasm.FileReader.onabort                                                                       (type $i32.ext->)
        warn("FS wasm.FileReader.onabort")   
        [*fileReader $0 state FILE_READER_ABORTED]
    )

    (func   $wasm.FileReader.onerror                                                                       (type $i32.ext->)
        warn("FS wasm.FileReader.onerror")   
        [*fileReader $0 state FILE_READER_FAILED]
    )

    (func   $wasm.FileReader.onloadstart                                                                   (type $i32.ext->)
        warn("FS wasm.FileReader.onloadstart")   
        [*fileReader $0 state FILE_READER_STARTED]
        [*fileReader $0 readyState LOADING]
    )

    (func   $wasm.FileReader.onprogress                                                                    (type $i32.ext->)
        warn("FS wasm.FileReader.onprogress")   
        [*fileReader $0 state FILE_READER_PROGRESS]
    )

    (func   $wasm.FileReader.onloadend                                                                     (type $i32.ext->)
        warn("FS wasm.FileReader.onloadend") 
        [*fileReader $0 state FILE_READER_DONE]
        [*fileReader $0 readyState DONE]
    )

    (func   $wasm.FileReader::abort                                                                            (type $i32->)
        warn("FS wasm.FileReader.abort")   
    )

    (func   $wasm.FileReader::readAsArrayBuffer                                                                (type $i32->)
        warn("FS wasm.FileReader::readAsArrayBuffer")   
        [*fileReader $0 readAs ARRAY_BUFFER]

        apply(
            self.FileReader.prototype.readAsArrayBuffer
            [*fileReader $0 externref]#
            [*file [*fileReader $0 file] externref]#A
        )
    )

    (func   $wasm.FileReader::readAsDataURL                                                                    (type $i32->)
        warn("FS wasm.FileReader::readAsDataURL")   
        [*fileReader $0 readAs DATA_URL]

        apply(
            self.FileReader.prototype.readAsDataURL
            [*fileReader $0 externref]#
            [*file [*fileReader $0 file] externref]#A
        )
    )

    (func   $wasm.FileReader::readAsText                                                                       (type $i32->)
        warn("FS wasm.FileReader::readAsText")   
        [*fileReader $0 readAs TEXT]

        apply(
            self.FileReader.prototype.readAsText
            [*fileReader $0 externref]#
            [*file [*fileReader $0 file] externref]#A
        )
    )