
    (global $WASM.Module mut ext)

    (func   $instantiate
        local($wasm# ext) ;; 0
        local($length i32) ;; 1
        local($canvas# ext) ;; 2
        local($context# ext) ;; 3
        local($context#A ext) ;; 4
        local($fileReader# ext) ;; 4
        local($queue# ext) ;; 4

        this(set $length    i32(%WASMSIZE%))
        this(set $wasm#     call($self.Reflect.construct<ext2>ext self.Uint8Array i32(%WASMSIZE%)DA))
        this(set $canvas#   call($wasm.createCanvas))
        this(tee $context#  
            call($self.Reflect.apply<ext3>ext
              self.HTMLCanvasElement.prototype.getContext
                this($canvas#) 
                [ "webgl2" ]
            )
        )
        this(set $context#A call($self.Array.of<ext>ext))

        call($self.Reflect.set<ext3> (self) 'canvas'    this($canvas#))
        call($self.Reflect.set<ext3> (self) 'context'   this($context#))

        call($self.Reflect.set<ext3> (self) 'drawArrays'
            call($self.Reflect.apply<ext3>ext
                self.Function.prototype.bind
                self.WebGL2RenderingContext.prototype.drawArrays
                this($context#A)
            )
        )
        
        call($self.Reflect.set<ext3> (self) 'vertexAttribPointer'
            call($self.Reflect.apply<ext3>ext
                self.Function.prototype.bind
                self.WebGL2RenderingContext.prototype.vertexAttribPointer
                this($context#A)
            )
        )

        call($self.Reflect.set<ext3> this($context#A) i32(1)D i32(0)D)
                
        call($self.Reflect.set<ext3> (self) 'bindAttribLocation'
            call($self.Reflect.apply<ext3>ext
                self.Function.prototype.bind
                self.WebGL2RenderingContext.prototype.bindAttribLocation
                this($context#A)
            )
        )
                  
        call($self.Reflect.set<ext3> (self) 'enableVertexAttribArray'
            call($self.Reflect.apply<ext3>ext
                self.Function.prototype.bind
                self.WebGL2RenderingContext.prototype.enableVertexAttribArray
                this($context#A)
            )
        )

        call($self.Reflect.set<ext3> (self) 'memory' 
            call($self.Reflect.construct<ext2>ext
                self.WebAssembly.Memory
                call($self.Object.fromEntries<ext>ext
                    call($self.Array.of<ext3>ext
                        call($self.Array.of<ext.i32>ext 'initial' i32(10000))
                        call($self.Array.of<ext.i32>ext 'maximum' i32(10000))
                        call($self.Array.of<ext.i32>ext 'shared'  (true))
                    )
                )A
            )
        )        

        call($self.Reflect.set<ext3> (self) 'atob'~ 
            call($self.Reflect.apply<ext3>ext
                self.Function.prototype.bind
                self.TextEncoder.prototype.encode
                new self.TextEncoder()A
            )   
        )
            
        call($self.Reflect.set<ext3> (self) 'btoa'~ 
            call($self.Reflect.apply<ext3>ext
                self.Function.prototype.bind
                self.TextDecoder.prototype.decode
                new self.TextDecoder()A
            )   
        )

        (while $length--
            call($self.Reflect.set<ext.i32x2>
                this($wasm#) this($length) (i32.load this($length))
            )
        )

        (apply 
            (self.Promise.prototype.then)
            (call $self.Reflect.apply<ext3>ext
                (self.WebAssembly.compile)
                (self)
                this($wasm#)A
            )
            (call $self.Array.of<fun>ext ref($oncompiled))
        )
    )

    (func $wasm.createCanvas                                                                                   (type $->ext)
        call($self.Reflect.apply<ext3>ext
            self.document.appendChild
            self.document.body
            call($self.Array.of<ext>ext
                call($self.Reflect.apply<ext3>ext
                    self.document.createElement
                    self.document
                    [ "canvas" ]   
                )
            )   
        )    
    )

    (func $onvoid                                                                                              (type $ext->)
        $0L
    )

    (func $oncompiled                                                                                          (type $ext->)
        (apply 
            (self.Promise.prototype.then)
            (call $self.Reflect.apply<ext3>ext
                (self.WebAssembly.instantiate) (self)
                (call $self.Array.of<ext2>ext $0 (self))
            )
            (call $self.Array.of<fun>ext ref($onvoid))
        )
    )
