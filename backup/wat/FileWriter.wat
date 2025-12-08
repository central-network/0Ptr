
   
    (func   $wasm.FileWriter::truncate                                                                     (type $i32.ext->)
        warn("FS wasm.FileWriter::truncate")   
    )

    (func   $wasm.FileWriter::write                                                                        (type $i32.ext->)
		warn("FS wasm.FileWriter::write")   

		apply( 
			call($self.Reflect.get<ext2>ext $1 'write') 
			this(1) 
			call($self.Reflect.construct<ext2>ext 
				self.Blob
				call($decode<buffer*>ext
					[*fileReader [*fileEntry [*fileWriter $0 fileEntry] reader] result]
				)AA
			)A
		)
    )

    (func   $wasm.FileWriter::seek                                                                         (type $i32.ext->)
        warn("FS wasm.FileWriter::seek")   
    )

    (func   $wasm.FileWriter.onwriteend                                                                    (type $i32.ext->)
        warn("FS wasm.FileWriter.onwriteend")   
        [*fileWriter $0 state FILE_WRITER_DONE]
    )

    (func   $wasm.FileWriter.onwritestart                                                                  (type $i32.ext->)
        warn("FS wasm.FileWriter.onwritestart")   
        [*fileWriter $0 state FILE_WRITER_STARTED]
    )

    (func   $wasm.FileWriter.onwrite                                                                       (type $i32.ext->)
        warn("FS wasm.FileWriter.onwrite")   
        [*fileWriter $0 state FILE_WRITER_COMPLETED]
    )

    (func   $wasm.FileWriter.onprogress                                                                    (type $i32.ext->)
        warn("FS wasm.FileWriter.onprogress")   
        [*fileWriter $0 state FILE_WRITER_PROGRESS]
    )

    (func   $wasm.FileWriter.onerror                                                                       (type $i32.ext->)
        warn("FS wasm.FileWriter.onerror")   
        [*fileWriter $0 state FILE_WRITER_FAILED]
    )

    (func   $wasm.FileWriter.onabort                                                                       (type $i32.ext->)
        warn("FS wasm.FileWriter.onabort")   
        [*fileWriter $0 state FILE_WRITER_ABORTED]
    )
    

    (func   $wasm.FileSytem::getFileHandle                                                                     (type $i32->)
      	warn("FS wasm.FileSytem::getFileHandle")   
    )
