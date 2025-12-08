
    (func   $wasm.externFileList                                                                            (type $ext->i32)
        local($files* i32)
        local($length i32)

        this(set $files* new FileList())
        this(set $length [ $0 'length' i32 ])

        [*files $1 externref import( $0 )]        
        [*files $1 length this($length)]      

        (while $length--
            call($wasm.handleFile $1 
                call($self.Reflect.get<ext.i32>ext $0 $2)
            )
        )

        this($files*)  
    )

    (func   $wasm.externFile                                                                                (type $ext->i32)
        local($file*    i32)
        local($name*    i32)
        local($mime*    i32)
        
        local($reader*  i32)
        local($readAs&  i32)
        
        this(set $file* new File())
        this(set $name* call($wasm.externString [ $0 'name' ext ]))
        this(set $mime* call($wasm.externString [ $0 'type' ext ]))

        [*file $1 name $2]      
        [*file $1 mimeType $3]     
        [*file $1 size [ $0 'size' i32 ]]      
        [*file $1 lastModified [ $0 'lastModified' f32 ]]      
        [*file $1 externref import( $0 )]     
        [*file $1 fileReader new FileReader()]     
             
        this(set $reader* [*file $1 fileReader])
        this(set $readAs& [*fileReader $4 readAs])

        [*fileReader $4 file $1]
        [*fileReader $4 state FILE_READER_SETTLED]
        [*fileReader $4 handler elem($wasm.handleRead)]

        (block $type

            (if (i32.eq ARRAY_BUFFER this($readAs&))
                (then call($wasm.FileReader::readAsArrayBuffer $4) br $type)
            )

            (if (i32.eq DATA_URL this($readAs&))
                (then call($wasm.FileReader::readAsDataURL $4) br $type)
            )

            (if (i32.eq TEXT this($readAs&))
                (then call($wasm.FileReader::readAsText $4) br $type)
            )
            
            unreachable
        )

        this($file*)  
    )

    (func   $wasm.handleRead                                                                                   (type $i32->)
        local($file* i32)
        local($name# ext)
        local($path# ext)
        local($root* i32)
        local($root# ext)

        this(set $root* [*fs (fs*) root]) 
        this(set $root# [*directory $4 externref]#) 
        this(set $file* [*fileReader $0 file]) 
        this(set $name# call($decode<string*>ext [*file $1 name]))

        apply(
            call($self.Reflect.get<ext2>ext this($root#) 'getFile')
            this($root#)
            call($self.Array.of<ext3>ext
                this($name#)
                call($self.Object.fromEntries<ext>ext 
                    call($self.Array.of<ext>ext 
                        call($self.Array.of<ext.i32>ext 'create' (true))
                    )
                )
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.DirectoryEntry::getFile) 
                    call($self.Array.of<ext.i32>ext $2 $0)
                )
            )
        )
    )

    (func   $wasm.DirectoryEntry::getFile                                                                  (type $i32.ext->)
        local($fileEntry* i32)
        local($fileWriter* i32)

        this(set $fileEntry* new FileEntry())
        this(set $fileWriter* new FileWriter())

        [*fileEntry $2 filesystem (fs*)]
        [*fileEntry $2 name [ $1 'name' *string ]]
        [*fileEntry $2 reader this(0)]
        [*fileEntry $2 writer this($fileWriter*)]
        [*fileEntry $2 isFile [ $1 'isFile' i32 ]]
        [*fileEntry $2 isDirectory [ $1 'isDirectory' i32 ]]
        [*fileEntry $2 fullPath [ $1 'fullPath' *string ]]
        [*fileEntry $2 externref import( $1 )]

        [*fileWriter $3 state FILE_WRITER_SETTLED]
        [*fileWriter $3 fileEntry this($fileEntry*)]

        
        (apply
            call($self.Reflect.get<ext2>ext $1 'createWriter') $1
            call($self.Array.of<ext>ext
                call($self.Reflect.apply<ext.fun.ext>ext 
                    self.Function.prototype.bind
                    ref($wasm.FileEntry::createWriter) 
                    call($self.Array.of<ext.i32>ext (null) this($fileEntry*))
                )
            )
        )
    )

    (func   $wasm.FileEntry::createWriter                                                                  (type $i32.ext->)
        local($fileWriter* i32) ;; 2
        local($fileReader* i32) ;; 3

        local($fileWriter# ext)
        local($fileReader# ext)

        this(set $fileReader* [*fileEntry $0 reader])
        this(set $fileWriter* [*fileEntry $0 writer])

        [*fileWriter this($fileWriter*) externref import( $1 )]

        addEventListener(
            this(1)
            call($self.Array.of<ext2>ext 'progress'
                bind(
                    ref($wasm.FileWriter.onprogress)
                    call($self.Array.of<ext.i32>ext $1 $2)
                )
            )
        )

        addEventListener(
            this(1)
            call($self.Array.of<ext2>ext 'write'
                bind(
                    ref($wasm.FileWriter.onwrite)
                    call($self.Array.of<ext.i32>ext $1 $2)
                )
            )
        )

        addEventListener(
            this(1)
            call($self.Array.of<ext2>ext 'writestart'
                bind(
                    ref($wasm.FileWriter.onwritestart)
                    call($self.Array.of<ext.i32>ext $1 $2)
                )
            )
        )

        addEventListener(
            this(1)
            call($self.Array.of<ext2>ext 'writeend'
                bind(
                    ref($wasm.FileWriter.onwriteend)
                    call($self.Array.of<ext.i32>ext $1 $2)
                )
            )
        )

        addEventListener(
            this(1)
            call($self.Array.of<ext2>ext 'error'
                bind(
                    ref($wasm.FileWriter.onerror)
                    call($self.Array.of<ext.i32>ext $1 $2)
                )
            )
        )


        addEventListener(
            this(1)
            call($self.Array.of<ext2>ext 'abort'
                bind(
                    ref($wasm.FileWriter.onabort)
                    call($self.Array.of<ext.i32>ext $1 $2)
                )
            )
        )


        call($wasm.FileWriter::write 
            this($fileWriter*) $1
        )
    )


    (func   $wasm.handleFile                                                                               (type $i32.ext->)
        call($set<*parent> call($wasm.externFile $1) $0)
    )

    (func   $wasm.handleFileSystemFile                                                                     (type $i32.ext->)
        (apply 
            (self.Promise.prototype.then)
            (call $self.Reflect.apply<ext2>ext
                [ $1 'getFile' ] $1
            )
            (call $self.Array.of<ext>ext
                call($self.Reflect.apply<ext.fun.ext>ext 
                    (self.Function.prototype.bind) 
                    ref($wasm.handleFile) 
                    call($self.Array.of<ext.i32>ext $1 $0)
                )
            )
        )
    )

    (func   $wasm.externDataTransferItemList                                                                (type $ext->i32)
        local($items* i32)
        local($handle funcref)        
        local($length i32)

        (if (ltee $length [ $0 'length' i32 ])
            (then
                (lset $items* call($items*))
                (lset $handle ref($wasm.handleFileSystemFile))

                [*items $1 externref import( $0)]        
                [*items $1 length $3]      
                
                (while $length--
                    (apply 
                        (self.Promise.prototype.then)
                        (call $self.Reflect.apply<ext2>ext
                            (self.DataTransferItem.prototype.getAsFileSystemHandle)
                            (call $self.Reflect.get<ext.i32>ext $0 $3) 
                        )
                        (call $self.Array.of<ext>ext
                            call($self.Reflect.apply<ext.fun.ext>ext 
                                (self.Function.prototype.bind) 
                                this($handle) 
                                call($self.Array.of<ext.i32>ext 
                                    (self) 
                                    this($items*)
                                )
                            )
                        )
                    )
                )
            )
        )

        this($items*)  
    )

    (func   $wasm.externBuffer                                                                              (type $ext->i32)
        (local $buffer* i32)
        (local $byteLength i32)
        (local $byteOffset i32)
        warn("IN wasm.externBuffer")   

        (if this(tee $byteLength [ $0 'byteLength' i32 ])
            then( 
                this(set $buffer*    new Buffer())
                this(set $byteOffset malloc(this($byteLength)))    

                [*buffer this($buffer*) byteOffset this($byteOffset) ]  
                [*buffer this($buffer*) byteLength this($byteLength) ]     
                
                (if (i32.lt_u this($byteOffset) byteOffset($parent)) 
                    (then throw("ERR buffer trying to write lower"))
                )

                apply(
                    self.TypedArray.prototype.set
                    call($subarray/u8<buffer*>ext $1)
                    new self.Uint8Array([ $0 ])A
                )
            )
        )

        this($buffer*)
    )

    (func   $wasm.externDataURL                                                                             (type $ext->i32)
        warn("IN wasm.externDataURL")
        call($tee<*classi> call($wasm.externString $0) (i32.const elem($DataURL)&))
    )

    (func   $wasm.externString                                                                              (type $ext->i32)
        (local $string* i32)
        (local $buffer* i32)
        (local $length  i32)
        warn("IN wasm.externString")

        this(set $length call($self.Reflect.apply<ext3>i32
            self.String.prototype.lastIndexOf $0 
            call($self.String.fromCharCode<>ext)A
        ))

        (if (i32.eqz this($length))
            (then (return i32(0)))
        )

        this(set $string* new String())
        this(set $buffer* call($wasm.externBuffer encode( $0 )))

        [*string this($string*) length this($length) ]    
        [*string this($string*) buffer this($buffer*) ]        

        this($string*)  
    )


    (func   $wasm.externDataTransfer                                                                           (type $ext->)
        this($dataTransfer* i32)
        this($dataTransfer# ext)
        this($items* i32)

        this(set 1 new DataTransfer())
        this(set 2 [ $0 'dataTransfer' ])
        this(tee 3 call($wasm.externDataTransferItemList [ $2 'items' ]))

        if   [*dataTransfer $1 items $3]
        else [*dataTransfer $1 files call($wasm.externFileList [ $2 'files' ])]
        end 

        [*dataTransfer $1 types call($wasm.externArray [ $2 'types' ])]
        [*dataTransfer $1 target call($wasm.externString 'uploads'#) ]        
        [*dataTransfer $1 externref import( $2 )]        
    )

    (func   $wasm.externArray                                                                               (type $ext->i32)
        this(i32)
        this(set 1 new Array())

        [*array $1 externref import( $0 )]        
        [*array $1 length [ $0 'length' i32 ]]      

        this(1)  
    )

    (func   $wasm.externFileSystem                                                                          (type $ext->i32)
        (local $fs* i32)
        (local $root* i32)
        (local $name* i32)
        
        this(set $fs* new DOMFileSystem())
        this(set $root* call($wasm.externDirectory [ $0 'root' ext ] ))
        this(set $name* call($wasm.externString [ $0 'name' ext ]))

        (if (call $self.Reflect.apply<ext3>i32
                self.String.prototype.endsWith
                [ $0 'name' ext ] 
                [ ':Persistent' ]
            )
            (then [*fs $1 type PERSISTENT ])
            (else [*fs $1 type TEMPORARY ])
        )
                
        [*fs $1 state READY ]        
        [*fs $1 size FILESYSTEM_SIZE ]        
        [*fs $1 externref import(this(0)) ]        
        [*fs $1 name this($name*) ]        

        [*directory $2 fileSystem $1]        
        [*directory $2 isRootDir true]        
        [*directory $2 isCurrentDir true]        

        [*fs $1 root this($root*) ]        
        [*fs $1 currentDir this($root*) ]        

        this($fs*)
    )

    (func   $wasm.externDirectory                                                                           (type $ext->i32)
        this(i32)
        this(set 1 new DirectoryEntry())

        (if (call $self.Object.is<ext2>i32
                export([*fs (fs*) externref]) 
                [ $0 'filesystem' ext ]
            ) 
            (then [*directory $1 fileSystem (fs*)] )
        ) 

        [*directory $1 isDirectory true]        
        [*directory $1 externref import(this(0)) ]        
        [*directory $1 name call($wasm.externString [ $0 'name' ext ]) ]        
        [*directory $1 fullPath call($wasm.externString [ $0 'fullPath' ext ]) ]        

        this(1)
    )
