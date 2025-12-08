
    (clss   $Chain chain)
    (prop   $Chain stack ptr)
    (prop   $Chain screen ptr)
    (prop   $Chain eventCreateElement ptr)
    (prop   $Chain eventSetAttribute ptr)
    (prop   $Chain eventAppendChild ptr)

    
    (clss   $WASM wasm)
    (prop   $WASM ui *ui)
    (prop   $WASM window *window)
    (prop   $WASM screen *screen)
    (prop   $WASM fs *fs)
    (prop   $WASM gl *glContext)

    (clss   $Progress progress)
    (prop   $Progress target ptr)
    (prop   $Progress source ptr)
    (prop   $Progress lengthComputable bu8)
    (prop   $Progress loaded i32)
    (prop   $Progress total i32)
    (prop   $Progress type *string)
    (prop   $Progress externref ext)

    (clss   $UI ui)
    (prop   $UI eventId i32)
    (prop   $UI x f32)
    (prop   $UI y f32)
    (prop   $UI z f32)
    (prop   $UI w f32)
    (prop   $UI deltaX f32)
    (prop   $UI deltaY f32)
    (prop   $UI clientX f32)
    (prop   $UI clientY f32)
    (prop   $UI screenX f32)
    (prop   $UI screenY f32)
    (prop   $UI movementX i8)
    (prop   $UI movementY i8)
    (prop   $UI escKey bu8)
    (prop   $UI spaceKey bu8)
    (prop   $UI key_0 bu8)
	(prop   $UI key_1 bu8)
	(prop   $UI key_2 bu8)
	(prop   $UI key_3 bu8)
	(prop   $UI key_4 bu8)
	(prop   $UI key_5 bu8)
	(prop   $UI key_6 bu8)
	(prop   $UI key_7 bu8)
	(prop   $UI key_8 bu8)
	(prop   $UI key_9 bu8)
	(prop   $UI ckey_colon bu8)
	(prop   $UI ckey_semicolon bu8)
	(prop   $UI ckey_less bu8)
	(prop   $UI ckey_equal bu8)
	(prop   $UI ckey_greater bu8)
	(prop   $UI ckey_question bu8)
	(prop   $UI key_@ bu8)
	(prop   $UI key_A bu8)
	(prop   $UI key_B bu8)
	(prop   $UI key_C bu8)
	(prop   $UI key_D bu8)
	(prop   $UI key_E bu8)
	(prop   $UI key_F bu8)
	(prop   $UI key_G bu8)
	(prop   $UI key_H bu8)
	(prop   $UI key_I bu8)
	(prop   $UI key_J bu8)
	(prop   $UI key_K bu8)
	(prop   $UI key_L bu8)
	(prop   $UI key_M bu8)
	(prop   $UI key_N bu8)
	(prop   $UI key_O bu8)
	(prop   $UI key_P bu8)
	(prop   $UI key_Q bu8)
	(prop   $UI key_R bu8)
	(prop   $UI key_S bu8)
	(prop   $UI key_T bu8)
	(prop   $UI key_U bu8)
	(prop   $UI key_V bu8)
	(prop   $UI key_W bu8)
	(prop   $UI key_X bu8)
	(prop   $UI key_Y bu8)
	(prop   $UI key_Z bu8)
	(prop   $UI ckey_bracketleft bu8)
	(prop   $UI ckey_backslash bu8)
	(prop   $UI ckey_bracketright bu8)
	(prop   $UI ckey_asciicircum bu8)
	(prop   $UI ckey_underscore bu8)
	(prop   $UI ckey_grave bu8)
    (prop   $UI key_a bu8)
	(prop   $UI key_b bu8)
	(prop   $UI key_c bu8)
	(prop   $UI key_d bu8)
	(prop   $UI key_e bu8)
	(prop   $UI key_f bu8)
	(prop   $UI key_g bu8)
	(prop   $UI key_h bu8)
	(prop   $UI key_i bu8)
	(prop   $UI key_j bu8)
	(prop   $UI key_k bu8)
	(prop   $UI key_l bu8)
	(prop   $UI key_m bu8)
	(prop   $UI key_n bu8)
	(prop   $UI key_o bu8)
	(prop   $UI key_p bu8)
	(prop   $UI key_q bu8)
	(prop   $UI key_r bu8)
	(prop   $UI key_s bu8)
	(prop   $UI key_t bu8)
	(prop   $UI key_u bu8)
	(prop   $UI key_v bu8)
	(prop   $UI key_w bu8)
	(prop   $UI key_x bu8)
	(prop   $UI key_y bu8)
	(prop   $UI key_z bu8)
    (prop   $UI eventType ilk)
    (prop   $UI ctrlKey bu8)
    (prop   $UI metaKey bu8)
    (prop   $UI altKey bu8)
    (prop   $UI shiftKey bu8)
    (prop   $UI repeat bu8)
    (prop   $UI isComposing bu8)
    (prop   $UI backspaceKey bu8)
    (prop   $UI tabKey bu8)
    (prop   $UI capsLockKey bu8)
    (prop   $UI enterKey bu8)
    (prop   $UI upKey bu8)
    (prop   $UI rightKey bu8)
    (prop   $UI leftKey bu8)
    (prop   $UI downKey bu8)


    (func   $get<handling*>parameters#                                                                      (type $i32->ext)
        call($self.Array.of<ext>ext
            call($parameter*)*
        )
    )

    (clss   $Argument argument)
    (prop   $Argument type ilk)
    (prop   $Argument name *string)
    (prop   $Argument function *function)
    (prop   $Argument valueType ilk)
    (prop   $Argument defaultValue ptr)
    (prop   $Argument index bu8)
    (prop   $Argument isRequired bu8)

    (clss   $Parameter parameter)
    (prop   $Parameter handling *handling)
    (prop   $Parameter argument *argument)
    (prop   $Parameter value *stack)
    (prop   $Parameter isDefault bu8)

    (clss   $Memory memory)
    (prop   $Memory bufferSize i32)
    (prop   $Memory byteLength i32)
    (prop   $Memory maxByteLength i32)
    (prop   $Memory ptrCount i32)
    (prop   $Memory ptrCountMax i32)
    (prop   $Memory instantiateTime f64)
    (prop   $Memory threadCount ui8)
    (prop   $Memory isLiving bi8)
    (prop   $Memory isBeating bi8)
    (prop   $Memory isRendering bi8)
    (prop   $Memory tickCountFrame i32)
    (prop   $Memory tickCountIdle i32)
    (prop   $Memory tickCount i32)
    (prop   $Memory nextTickType ilk)
    (prop   $Memory performanceNow f32)

    
    (clss   $MatrixBase matrixBase)
    (prop   $MatrixBase byteLength i32)


    (func   $wasm.handleFileSystem                                                                             (type $ext->)
        (fs* call($wasm.externFileSystem $0)) 
        [*wasm (wasm*) fs (fs*)]
        warn("File system is ready.")
    )

    (func   $wasm.createFileSystem                                                                                (type $->)
        call($self.Reflect.apply<ext3> 
            (self.webkitRequestFileSystem) 
            (self)
            call($self.Array.of<i32x2.funx2>ext
                SELF_PERSISTENT
                FILESYSTEM_SIZE
                ref($wasm.handleFileSystem) 
                ref($wasm.onerror) 
            )
        )
        warn("File system is created.")
    )
    
    (global $self.context mut ext)

    (func   $window (; init ;)
        global(set $memory<buffer> (memory)['buffer'])
        global(set $memory<*> call($ptr<memory*> (memory*)))
        global(set $thread [*memory (memory*) threadCount] ++)
        global(set $scope [])
        global(set $threadType 
            (if (result i32) (null (#document))
                (then THREAD_TYPE_WORKER)
                (else THREAD_TYPE_WINDOW)
            )
        )

        i32x4(set i32(0)     0   96 25872   0) 
        i32x4(set i32(16)    5  512    0    0) 
        i32x4(set i32(48) 1024    0    0    0)
        i32x4(set i32(96)    1   40    7    1)
        i32x4(set i32(112)   4    5  128    4)
        i32x4(set i32(128)  16    4    1   40)
        i32x4(set i32(144)   1    1   16    5)
        i32x4(set i32(160) 512    1   16    1)
        i32x4(set i32(176)   1   40    2    1)
        i32x4(set i32(192)   8    5  256    2)
        i32x4(set i32(208)   8    8    1   40)
        i32x4(set i32(224)   7    4    5  128)
        i32x4(set i32(240)   4   16    4    0)
        i32x4(set i32(260) 256 2304 2816 4864)
        i32x1(set i32(2305) 16843009)

        [*memory (memory*) instantiateTime clock(f64)]
        [*memory (memory*) nextTickType GPU_TICK]

        (wasm*      new WASM())
        (ui*        new UI())
        (window*    new Window())
        (screen*    new Screen())
        (gl*        new WebGL2RenderingContext())

        (scene*     [*glContext (gl*) scene])
        (camera*    [*scene (scene*) camera])

        [*wasm (wasm*) ui (ui*)]
        [*wasm (wasm*) gl (gl*)]
        [*wasm (wasm*) window (window*)]
        [*wasm (wasm*) screen (screen*)]

        global(set $# (self)['screen'])

        [*screen (screen*) externref        import(global($#))]
        [*screen (screen*) width            global($#)[ 'width'  i32 ]]
        [*screen (screen*) height           global($#)[ 'height' i32 ]]
        [*screen (screen*) innerWidth       (self)[ 'innerWidth'  i32 ]]
        [*screen (screen*) innerHeight      (self)[ 'innerHeight' i32 ]]
        [*screen (screen*) halfInnerWidth   (f32.div (self)[ 'innerWidth' f32 ] f32(2))]
        [*screen (screen*) halfInnerHeight- (f32.div (self)[ 'innerHeight' f32 ] f32(-2))]
        [*screen (screen*) devicePixelRatio (self)[ 'devicePixelRatio' i32 ]]


        [*glContext (gl*) externref import((gl.context))]

        call($self.Reflect.set<ext2.i32> (gl.canvas) 'width'  i32(mul [*screen (screen*) innerWidth]  [*screen (screen*) devicePixelRatio]))
        call($self.Reflect.set<ext2.i32> (gl.canvas) 'height' i32(mul [*screen (screen*) innerHeight] [*screen (screen*) devicePixelRatio]))

        global(set $# (gl.canvas)['style'])

        call($self.Reflect.set<ext3>     global($#) 'width'   call($self.CSS.px<i32>ext [*screen (screen*) innerWidth]))
        call($self.Reflect.set<ext3>     global($#) 'height'  call($self.CSS.px<i32>ext [*screen (screen*) innerHeight]))
        call($self.Reflect.set<ext2.i32> global($#) 'top'     i32(0))
        call($self.Reflect.set<ext2.i32> global($#) 'left'    i32(0))
        call($self.Reflect.set<ext3>     global($#) 'position' 'fixed')
        call($self.Reflect.set<ext3>     global($#) 'cursor' 'none')

        global(set $gl.program*     call($gl.createProgram (gl*)))
        global(set $gl.buffer*      call($gl.createBuffer  (gl*)))
        global(set $gl.aspectRatio  
            (f32.div
                (self)[ 'innerWidth' f32 ]
                (self)[ 'innerHeight' f32 ]
            )
        )
        
        call($gl.attachShader   global($gl.program*) call($gl.createShader/main/fragment (gl*)))
        call($gl.attachShader   global($gl.program*) call($gl.createShader/main/vertex (gl*)))

        [*glBuffer global($gl.buffer*) srcOffset i32(0)]
        [*glBuffer global($gl.buffer*) length  i32(48)]

        [*camera (camera*) aspect f32(w/h)]

        [*camera (camera*) right  
            (f32.convert_i32_u 
                (i32.mul 
                    [*screen (screen*) innerWidth] 
                    [*screen (screen*) devicePixelRatio] 
                )
            ) 
        ]
        
        [*camera (camera*) top    
            (f32.convert_i32_u 
                (i32.mul 
                    [*screen (screen*) innerHeight] 
                    [*screen (screen*) devicePixelRatio] 
                )
            ) 
        ]
        
        [*camera (camera*) fovy  
            (f32.mul f32(2) (f32.mul 
                f32(57.29577951308232) 
                call($Math.atan2<f32x2>f32
                    [*camera (camera*) top]
                    [*camera (camera*) near]
                )
            ))
        ]

        

        call($gl.clearColor)
        call($gl.clearDepth)
        call($gl.enable     DEPTH_TEST)
        call($gl.depthFunc  LEQUAL)
        call($gl.viewport)
        call($gl.bindBuffer     global($gl.buffer*))

        call($gl.enableVertexAttribArray<i32> i32(0))
        call($gl.vertexAttribPointer<i32x6> i32(0) i32(4) FLOAT (false) i32(16) i32(0))

        call($gl.linkProgram    global($gl.program*))
        call($gl.useProgram     global($gl.program*))

        call($gl.fillBuffer global($gl.buffer*))

        call($gl.createFrustrum (camera*))

        call($wasm.addEventListeners)
        call($wasm.createFileSystem)

        start($heart)
        ;;start(work($fps))

        start(work($parcala))

        

        (memory*)*L
        (wasm*)*L
        (ui*)*L
        (gl*)*L
    )

    (func   $gl.onrender                                                                                       (type $i32->)
        [*glContext (gl*) frame $0] 

        call($gl.fillBuffer global($gl.buffer*))
        
        call($gl.clear CLRDPTH_BUFFER_BIT)
        call($gl.drawArrays<i32x3> TRIANGLES i32(0) i32(6)) ;; 3 points -> 1 triangle
    )

    (func   $gl.createFrustrum                                                                                 (type $i32->)
        local($m4 i32)
        local($sx f32) 
        local($sy f32)
        local($c2 f32) 
        local($c1 f32)
        local($tx f32) 
        local($ty f32)

        local($near   f32)
        local($far    f32)
        local($top    f32)
        local($right  f32)
        local($bottom f32)
        local($left   f32)

        local(set $near   [*camera $0 near])
        local(set $far    [*camera $0 far])
        local(set $top    [*camera $0 top])
        local(set $right  [*camera $0 right])
        local(set $bottom [*camera $0 bottom])
        local(set $left   [*camera $0 left])

        local(set $sx (f32.mul f32(2) (f32.div local($near) (f32.sub local($right) local($left)))))
        local(set $sy (f32.mul f32(2) (f32.div local($near) (f32.sub local($top) local($bottom)))))

        local(set $c2 (f32.div (f32.neg (f32.add local($far) local($near))) (f32.sub local($far) local($near))))
        local(set $c1 (f32.div (f32.mul f32(2) (f32.mul local($near) local($far))) (f32.sub local($near) local($far))))

        local(set $tx (f32.div (f32.mul (f32.neg local($near)) (f32.add local($right) local($left))) (f32.sub local($right) local($left))))
        local(set $ty (f32.div (f32.mul (f32.neg local($near)) (f32.add local($bottom) local($top))) (f32.sub local($top) local($bottom))))

        local(set $m4 [*camera $0 matrix])
        
        [*mat4 $1 m11 local($sx)] [*mat4 $1 m12 f32(0)]     [*mat4 $1 m13 f32(0)]     [*mat4 $1 m14 local($tx)]
        [*mat4 $1 m21 f32(0)]     [*mat4 $1 m22 local($sy)] [*mat4 $1 m23 f32(0)]     [*mat4 $1 m24 local($ty)]
        [*mat4 $1 m31 f32(0)]     [*mat4 $1 m32 f32(0)]     [*mat4 $1 m33 local($c2)] [*mat4 $1 m34 local($c1)]
        [*mat4 $1 m41 f32(0)]     [*mat4 $1 m42 f32(0)]     [*mat4 $1 m43 f32(-1)]    [*mat4 $1 m44 f32(0)]

        [*mat4 $1 lastModified now(i32)]
    )

    (func   $mat4.updateLastModified                                                                           (type $i32->)
        [*mat4 $0 lastModified now(i32)]
    )

    (func   $gl.useProgram                                                                                     (type $i32->)
        (if i32(eq [*glProgram $0 state] BOUND)
            (then warn("GL program already in use."))
            (else
                call($self.Reflect.apply<ext3>
                    (gl.context)['useProgram']
                    [*glContext [*glProgram $0 context] externref]#
                    [*glProgram $0 externref]#A
                )

                [*glProgram $0 state BOUND]
                [*glContext [*glProgram $0 context] program $0]

                warn("GL program is bound")
            )        
        )
    )

    (func   $gl.linkProgram                                                                                    (type $i32->)
        (if i32(ne [*glProgram $0 state] PROGRAM_LINKED) 
            (then
                call($self.Reflect.apply<ext3>
                    (gl.context)['linkProgram']
                    [*glContext [*glProgram $0 context] externref]# 
                    [*glProgram $0 externref]#A
                )

                (if call($self.Reflect.apply<ext3>i32
                        (gl.context)['getProgramParameter'] 
                        [*glContext [*glProgram $0 context] externref]# 
                        call($self.Array.of<ext.i32>ext 
                            [*glProgram $0 externref]# LINK_STATUS   
                        )
                    )
                    (then
                        [*glProgram $0 state PROGRAM_LINKED]
                        warn("GL program linked")
                    )
                    (else
                        call($self.Reflect.apply<ext3>ext
                            (gl.context)['getProgramInfoLog'] 
                            [*glContext [*glProgram $0 context] externref]# 
                            [*glProgram $0 externref]#A   
                        )Le

                        [*glProgram $0 state PROGRAM_FAILED]
                        fail("GL program link error.")
                    )
                )
                

                
            )
            (else warn("GL program already linked"))
        )
    )

    (func   $gl.attachShader                                                                                 (type $i32x2->)
        (if i32(ne [*glShader $1 parent] $0) 
            (then
                (if i32(ne [*glShader $1 state] SHADER_COMPILED)
                    (then fail("GL shader must be compiled before attach."))
                    (else
                        call($self.Reflect.apply<ext3>
                            (gl.context)['attachShader']
                            [*glContext [*glShader $0 context] externref]# 
                            call($self.Array.of<ext2>ext
                                [*glProgram $0 externref]#
                                [*glShader $1 externref]#
                            )
                        )

                        [*glShader $1 parent $0]

                        (if i32(eq [*glShader $1 type] VERTEX_SHADER)
                            (then [*glProgram $0 vertexShader $1])
                            (else [*glProgram $0 fragmentShader $1])
                        )

                        warn("GL shader attached")
                    )
                )
            )
            (else warn("GL shader already attached"))
        )
    )

    (func   $gl.createShader/main/vertex                                                                    (type $i32->i32)
        call($gl.shaderSource
            (ltee $0 call($gl.createShader $0 VERTEX_SHADER))
            ```
                attribute vec4 pos;
                void main() {
                    gl_Position = pos;
                    gl_PointSize = 10.0;
                }
            ```
        )

        call($gl.compileShader $0)

        $0
    )

    (func   $gl.createShader/main/fragment                                                                  (type $i32->i32)
        call($gl.shaderSource
            (ltee $0 call($gl.createShader $0 FRAGMENT_SHADER))
            ```
                void main() {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            ```
        )    

        call($gl.compileShader $0)

        $0
    )

    (func   $gl.compileShader                                                                                  (type $i32->)
        call($self.Reflect.apply<ext3>
            (gl.context)['compileShader'] 
            [*glContext [*glShader $0 context] externref]# 
            call($self.Array.of<ext>ext [*glShader $0 externref]#)
        )

        (if call($self.Reflect.apply<ext3>i32
                (gl.context)['getShaderParameter'] 
                [*glContext [*glShader $0 context] externref]# 
                call($self.Array.of<ext.i32>ext 
                    [*glShader $0 externref]# COMPILE_STATUS   
                )
            )
            (then
                [*glShader $0 state SHADER_COMPILED]
                warn("GL shader compiled")
            )
            (else
                call($self.Reflect.apply<ext3>ext
                    (gl.context)['getShaderInfoLog'] 
                    [*glContext [*glShader $0 context] externref]# 
                    [*glShader $0 externref]#A   
                )Le

                [*glShader $0 state SHADER_FAILED]
                fail("GL shader compilation error.")
            )
        )
    )

    (func   $gl.shaderSource                                                                                 (type $i32x2->)
        call($self.Reflect.apply<ext3>
            (gl.context)['shaderSource'] 
            [*glContext [*glShader $0 context] externref]#
            call($self.Array.of<ext2>ext 
                [*glShader $0 externref]#   
                call($decode<string*>ext $1)
            )
        )

        [*glShader $0 source $1]
        warn("GL shader source settled")
    )

    (func   $gl.createShader                                                                              (type $i32x2->i32)
        local(i32 i32)

        local(set $2 import(
            call($self.Reflect.apply<ext3>ext
                (gl.context)['createShader']
                [*glContext $0 externref]# 
                $1DA
            )
        ))

        local(set $3 new WebGLShader())

        [*glShader $3 type $1]
        [*glShader $3 parent $0]
        [*glShader $3 context $0]
        [*glShader $3 externref $2]

        $3
        warn("GL shader created")
    )

    (func   $gl.createProgram                                                                               (type $i32->i32)
        local(i32 i32)

        local(set $1 import(
            call($self.Reflect.apply<ext2>ext
                (gl.context)['createProgram']
                [*glContext $0 externref]# 
            )
        ))

        local(set $2 new WebGLProgram())

        [*glProgram $2 parent $0]
        [*glProgram $2 context $0]
        [*glProgram $2 externref $1]

        $2
        warn("GL program created")
    )

    (func   $gl.createBuffer                                                                                (type $i32->i32)
        local(i32 i32)

        local(set $1 import(
            call($self.Reflect.apply<ext2>ext
                (gl.context)['createBuffer']
                [*glContext $0 externref]# 
            )
        ))

        local(set $2 new WebGLBuffer())

        [*glBuffer $2 parent $0]
        [*glBuffer $2 context $0]
        [*glBuffer $2 externref $1]

        $2
        warn("GL buffer created")
    )

    (func   $gl.fillBuffer                                                                                     (type $i32->)
        (local $byteOffset i32)
        (local $byteLength i32)
        (local $length i32)
        (local $context# ext) 

        (local $x f32)
        (local $y f32)
        (local $w f32)
        (local $h f32)

        local(set 1 [*glBuffer $0 byteOffset])
        local(set 2 [*glBuffer $0 byteLength])
        local(set 3 i32(10))
        local(set 4 (gl.context))

        local(set $x [*ui (ui*) x])
        local(set $y [*ui (ui*) y])

        local(set $w f32(0.138))
        local(set $h (f32.mul local($w) f32(w/h)))


        <--
        (while $length--
        )
        -->
           

        (f32.store local($byteOffset)                   local($x)) 
        (f32.store (i32.add local($byteOffset) i32(4))  local($y)) 
        (f32.store (i32.add local($byteOffset) i32(8))  [*ui (ui*) z]) 
        (f32.store (i32.add local($byteOffset) i32(12)) [*ui (ui*) w]) 

        local(set $byteOffset (i32.add local($byteOffset) i32(16)))

        (f32.store local($byteOffset)                   local($x)) 
        (f32.store (i32.add local($byteOffset) i32(4))  (f32.sub local($y) local($h)))
        (f32.store (i32.add local($byteOffset) i32(8))  [*ui (ui*) z]) 
        (f32.store (i32.add local($byteOffset) i32(12)) [*ui (ui*) w]) 

        local(set $byteOffset (i32.add local($byteOffset) i32(16)))

        (f32.store local($byteOffset)                   (f32.add local($x) local($w))) 
        (f32.store (i32.add local($byteOffset) i32(4))  (f32.sub local($y) local($h)))
        (f32.store (i32.add local($byteOffset) i32(8))  [*ui (ui*) z]) 
        (f32.store (i32.add local($byteOffset) i32(12)) [*ui (ui*) w]) 



        apply([ $4 'bufferData' ] $4
            call($self.Array.of<i32.ext.i32>ext 
                [*glBuffer $0 target]
                [*glBuffer $0 typedArray]#
                [*glBuffer $0 usage]
            )
        )
    )

    (func   $gl.allocBuffer                                                                                    (type $i32->)
        (local $byteOffset i32)
        (local $byteLength i32)

        local(set $byteLength [*glBuffer $0 byteLength])
        local(set $byteOffset malloc(local($byteLength)))

        [*glBuffer $0 byteOffset local($byteOffset)]
        [*glBuffer $0 typedArray 
            import(
                call($self.Reflect.construct<ext2>ext 
                    self.Float32Array
                    call($self.Array.of<ext.i32x2>ext
                        memory(buffer) 
                        local($byteOffset) 
                        (i32.div_u local($byteLength) i32(4))
                    )
                )
            )
        ] 
    )

    (func   $gl.bindBuffer                                                                                     (type $i32->)
        (local $context* i32) 
        (local $context# ext) 
        
        (if i32(eq [*glBuffer $0 state] BOUND)
            (then warn("GL buffer already bound state."))
            (else
                (lset $context* [*glBuffer  $0 context])
                (lset $context# [*glContext $1 externref]#)

                apply([ $2 'bindBuffer' ] $2
                    call($self.Array.of<i32.ext>ext 
                        [*glBuffer $0 target]
                        [*glBuffer $0 externref]#
                    )
                )

                (if (i32.eqz [*glBuffer $0 byteOffset])
                    (then call($gl.allocBuffer $0))
                )

                apply([ $2 'bufferData' ] $2
                    call($self.Array.of<i32.ext.i32>ext 
                        [*glBuffer $0 target]
                        [*glBuffer $0 typedArray]#
                        [*glBuffer $0 usage]
                    )
                )

                [*glBuffer  $0 state BOUND]
                [*glContext $1 buffer $0]

                warn("GL buffer bound")
            )        
        )
    )

    (func   $gl.bufferData                                                                                     (type $i32->)
        
    )

    (func   $gl.clear                                                                                          (type $i32->)
        call($self.Reflect.apply<ext3>
            (gl.context)['clear']
            (gl.context) 
            $0DA
        )
       ;; warn("GL context cleared")
    )

    (func   $gl.enable                                                                                         (type $i32->)
        call($self.Reflect.apply<ext3>
            (gl.context)['enable']
            (gl.context) 
            $0DA
        )
        warn("GL option enabled")
    )

    (func   $gl.depthFunc                                                                                      (type $i32->)
        call($self.Reflect.apply<ext3>
            (gl.context)['depthFunc']
            (gl.context)
            $0DA
        )
        warn("GL depth function settled")
    )

    (func   $gl.clearDepth                                                                                        (type $->)
        call($self.Reflect.apply<ext3>
            (gl.context)['clearDepth']
            (gl.context)
            i32(1)DA
        )
        warn("GL clear depth settled")
    )

    (func   $gl.clearColor                                                                                        (type $->)
        call($self.Reflect.apply<ext3>
            (gl.context)['clearColor']
            (gl.context)
            call($self.Array.of<i32x4>ext i32(0) i32(0) i32(0) i32(1))
        )
        warn("GL clear color settled")
    )

    (func   $gl.viewport                                                                                          (type $->)

        call($self.Reflect.apply<ext3>
            (gl.context)['viewport']
            (gl.context)
            call($self.Array.of<f32x4>ext f32(0) f32(0) [*camera (camera*) right] [*camera (camera*) top])
        )
        warn("GL viewport settled")
    )

    (func   $subarray/u8<buffer*>ext                                                                        (type $i32->ext)
        call($self.Reflect.construct<ext2>ext
            self.Uint8Array
            call($self.Array.of<ext.i32x2>ext
                memory(buffer) 
                [*buffer $0 byteOffset]
                [*buffer $0 byteLength]
            )
        )
    )

    (func   $decode<string*>ext                                                                             (type $i32->ext)
        call($decode<buffer*>ext [*string $0 buffer])
    )

    (func   $decode<buffer*>ext                                                                             (type $i32->ext)
        call($self.decodeText<ext>ext
            call($self.Reflect.apply<ext2>ext
                self.TypedArray.prototype.slice
                call($subarray/u8<buffer*>ext $0)
            )
        )
    )
    
    (func   $wasm.addEventListeners                                                                               (type $->)
        (call $self.addEventListener<ext.fun> 'pointermove'~  ref($wasm.onpointermove))
        (call $self.addEventListener<ext.fun> 'pointerup'~    ref($wasm.onpointerup))
        (call $self.addEventListener<ext.fun> 'pointerdown'~  ref($wasm.onpointerdown))
        (call $self.addEventListener<ext.fun> 'pointerout'~   ref($wasm.onpointerout))
        (call $self.addEventListener<ext.fun> 'click'~        ref($wasm.onclickprimary))
        (call $self.addEventListener<ext.fun> 'dblclick'~     ref($wasm.onclickdobule))
        (call $self.addEventListener<ext.fun> 'contextmenu'~  ref($wasm.onclicksecondary))
        (call $self.addEventListener<ext.fun> 'keyup'~        ref($wasm.onkeyup))
        (call $self.addEventListener<ext.fun> 'keydown'~      ref($wasm.onkeydown))
        (call $self.addEventListener<ext.fun> 'drag'~         ref($wasm.ondrag))
        (call $self.addEventListener<ext.fun> 'drop'~         ref($wasm.ondrop))
        (call $self.addEventListener<ext.fun> 'dragover'~     ref($wasm.ondragover))
        (call $self.addEventListener<ext.fun> 'dragenter'~    ref($wasm.ondragenter))
        (call $self.addEventListener<ext.fun> 'dragleave'~    ref($wasm.ondragleave))
        (call $self.addEventListener<ext.fun> 'dragstart'~    ref($wasm.ondragstart))
        (call $self.addEventListener<ext.fun> 'dragend'~      ref($wasm.ondragend))
        (call $self.addEventListener<ext.fun.ext> 'wheel'~    ref($wasm.onwheel) 
            call($self.Object.fromEntries<ext>ext 
                call($self.Array.of<ext>ext 
                    call($self.Array.of<ext.i32>ext
                        'passive' (false)
                    )
                )
            )
        )

        warn("Event listeners added.")
    )


    (func   $task.ScreenOrientation                                                                            (type $->i32)
        new ScreenOrientation({
            "externref"         : self.screen.orientation,
            "angle"             : self.screen.orientation.angle,
        })

        global(set $i)
        global($i)
    )


    (func   $task.Screen                                                                                       (type $->i32)
        (local i32 i32)
        
        new Screen({
            "innerWidth"        : self.innerWidth,
            "innerHeight"       : self.innerHeight,
            "availTop"          : self.screen.availTop,
            "availLeft"         : self.screen.availLeft,
            "availHeight"       : self.screen.availHeight,
            "availWidth"        : self.screen.availWidth,
            "colorDepth"        : self.screen.colorDepth,
            "width"             : self.screen.width,
            "height"            : self.screen.height,
            "pixelDepth"        : self.screen.pixelDepth,
            "isExtended"        : self.screen.isExtended,
            "devicePixelRatio"  : self.devicePixelRatio,
            "externref"         : self.screen,
        })
        (ltee $0)
        (call $task.ScreenOrientation)
        (call $set<screen*.orientation>)

        $0
    )


    (func   $start                                                                                             (type $i32->)
        (if cmpx($Work state $0 WORK_STATE_IDLE WORK_STATE_READY)
            then([*work $0 readyTime now(i32)]
                warn("WORK work state changed to ready")
            )
            else(fail("WORK work state is not idle for start"))
        )
    )


    (func   $work.fps                                                                                          (type $->i32)
        (local i32 i32 i32)


        new Stack({
            "arg0"          : i32(4),
        }) 
        local(set 0)

        new TimingStrategy({
            "type"          : PERIODICALLY,
            "rangeType"     : TIMING_RANGE_SECOND,
            "timingType"    : TIMING_CYCLE_FRAME,
            "tickPeriod"    : i32(120),
        }) 
        local(set 1)

        new HandlingStrategy() 
        local(set 2)
        
        new Work({
            "state"        : WORK_STATE_IDLE,
            "alias"        : call($wasm.externString 'özgür'),
            "isRestricted" : true,
            "threadType"   : THREAD_TYPE_WINDOW,
            "isScheduled"  : true,
            "stack"        : $0,
            "timing"       : $1,
            "oninit"       : $2,
            "dispatchTick" : i32(4000),
            "creationTime" : now(i32),
        })
    )

    ;; start(work($fps))

    (func   $file/readFile                                                                                 
        (param $work*   i32)
        (param $file#   ext)
        
        this($stack*    i32)
        this($reader*   i32)
        this($reader#   ext)

        this(set $stack*  [*work        this($work*)    stack])
        this(set $reader* [*stack       this($stack*)   arg0])
        this(set $reader# [*fileReader  this($reader*)  externref]#)


        apply(
            self.FileReader.prototype.readAsText
            this($reader#) 
            this($file#)A
        )

        warn("file readfile")
    )

    (func   $init/readFile                                                                                     
        (param $work* i32)
        
        this($stack* i32)
        this($reader* i32)
        this($file# ext)

        warn("file reader work oninit")

        this(set $stack*  [*work        this($work*)    stack])
        this(set $file#   [*stack       this($stack*)   arg1]#)

        apply(
            call($self.Reflect.get<ext2>ext this($file#) 'file')
            this($file#)
            call($self.Reflect.apply<ext.fun.ext>ext
                self.Function.prototype.bind
                ref($file/readFile)
                call($self.Array.of<ext.i32>ext
                    (undefined) this($work*)
                )
            )A
        )
    )

    (func   $done/readFile                                                                                     (type $i32->)
        this($work* i32)
        this($stack* i32)
        this($result ext)

        warn("file reader work ondone")

        this(set $work*     [*fileReader $0 work])
        this(set $result    [*fileReader $0 result]#)
        this(set $stack*    [*work this($work*) stack])
        
        [*stack this($stack*) result import(this($result))]
        [*work  this($work*)  state  WORK_STATE_COMPLETED]
    )
    
    (;
    (func   $done.readFile                                                                                     (type $i32->)
        $0*L
        [*stack [*work $0 stack] result]#
        log()
        info("finished")
        warn("finished")
        fail("finished")
    )
    ;)

    (func   $work.readFile                                                                                     (type $->i32)
        this($work* i32)
        this($stack* i32)
        this($reader* i32)
        this($handling* i32)
        this($function* i32)

        this(set $work*     new Work())
        this(set $reader*   new FileReader())
        this(set $stack*    [*work this($work*) stack])

        [*work       this($work*)        alias       new String("work/FileReader")]
        [*stack      this($stack*)       arg0        this($reader*)]

        [*fileReader this($reader*)      work        this($work*)]
        [*fileReader this($reader*)      readAs      ARRAY_BUFFER]
        [*fileReader this($reader*)      handler     elem($done/readFile)]

        this(set $function* new Function())
        this(set $handling* new HandlingStrategy())

        [*function   this($function*)    handler     elem($init/readFile)]
        [*handling   this($handling*)    function    this($function*)]
        [*work       this($work*)        oninit      this($handling*)]

        (;
        this(set $function* new Function())
        this(set $handling* new HandlingStrategy())

        [*function   this($function*)    handler     élem($done.readFile)]
        [*handling   this($handling*)    function    this($function*)]
        [*work       this($work*)        ondone      this($handling*)]
        ;)

        this($work*)
    )


    (func   $task.FileSystem.getFile2
        (param  $work* i32) 
        (param  $fileEntry# ext)

        (local  $read* i32) 
        (local  $stack* i32)
        (local  $handling* i32)
        (local  $function* i32)

        this(set $read*  work($readFile))
        this(set $stack* [*work this($read*) stack])

        [*stack this($stack*)   arg1    import(this($fileEntry#))]
        [*work  this($read*)    parent  this($work*)]
        [*work  this($read*)    state   WORK_STATE_IDLE]
        
        start(this($read*))
    )                        

    (func   $task.FileSystem.getFileErr
        (param  $a ext) 
        (param  $b ext) 
        (param  $c ext) 

        fail("fs get file err")

        this($a)Le
        this($b)Le
        this($c)Le

    )                        

    (func   $task.FileSystem.getFile                                                                 
        (param  $work* i32) 
        (local  $stack* i32)
        (local  $arg0 i32)
        (local  $currentDir# ext)
        (local  $filename# ext)

        (if (i32.eqz this(tee $stack* [*work this($work*) stack]))
            (then (return [*work this($work*) state WORK_STATE_FAILED]))
        )

        (if (i32.eqz this(tee $arg0 [*stack this($stack*) arg0]))
            (then (return [*work this($work*) state WORK_STATE_FAILED]))
        )

        (if (null this(tee $filename# call($decode<string*>ext this($arg0))))
            (then (return [*work this($work*) state WORK_STATE_FAILED]))
        )
        
        (if (null this(tee $currentDir# [*directory [*fs (fs*) currentDir] externref]#))
            (then (return [*work this($work*) state WORK_STATE_FAILED]))
        )


        apply(
            call($self.Reflect.get<ext2>ext 
                this($currentDir#)
                'getFile'
            )
            this($currentDir#)
            call($self.Array.of<ext4>ext
                this($filename#)
                (undefined)
                call($self.Reflect.apply<ext.fun.ext>ext 
                    self.Function.prototype.bind 
                    ref($task.FileSystem.getFile2) 
                    call($self.Array.of<ext.i32>ext
                        this($filename#)
                        this($work*)
                    )
                )
                call($self.Reflect.apply<ext.fun.ext>ext 
                    self.Function.prototype.bind 
                    ref($task.FileSystem.getFileErr) 
                    call($self.Array.of<ext.i32>ext
                        this($filename#)
                        this($work*)
                    )
                )
            )
        )
    )


    (func   $done.test1                                                                                        (type $i32->)
        info("JOB ilListe.json read done")
        [*stack [*work $0 stack] result]#L
    )

    (func   $done.parcala                                                                                      (type $i32->)
        info("JOB parcala read done")
        [*stack [*work $0 stack] result]#L
    )

    (func   $work.parcala                                                                                      (type $->i32)
        local($work*        i32)
        local($stack*       i32)
        local($timing*      i32)
        local($handling*    i32)
        local($function*    i32)
        
        local($ilListe*     i32)
        local($parseJSONe*  i32)

        this(set $work*     new Work())
        this(set $timing*   new TimingStrategy())
        this(set $stack*    [*work this($work*) stack])


        [*timing    this($timing*)   type       SCHEDULED_TICK]
        [*timing    this($timing*)   tick       i32(3)]

        this(set $handling* new HandlingStrategy())
        this(set $function* new Function())

        [*function  this($function*) handler    elem($done.parcala)]
        [*handling  this($handling*) function   this($function*)]
        [*work      this($work*)     ondone     this($handling*)]

        [*work      this($work*)     state      WORK_STATE_IDLE]
        [*work      this($work*)     timing     this($timing*)]


        ;; job 1 get il liste
        this(set $ilListe* work($ilListe))
        ;;this(set $parseJSON* work($parseJSON))

        [*work this($ilListe*) parent this($work*)]
        ;;[*work this($parseJSON*) parent this($work*)]

        this($work*)
    )

    (func   $work.parseJSON                                                                                    (type $->i32)
        local($work* i32)
        local($stack* i32)
        local($handling* i32)
        local($function* i32)

        this(set $work* new Work())

        [*work this($work*) state WORK_STATE_IDLE]

        this($work*)
    )

    (func   $work.ilListe                                                                                      (type $->i32)
        local($work* i32)
        local($stack* i32)
        local($handling* i32)
        local($function* i32)

        this(set $work*     new Work())
        this(set $stack*    [*work this($work*) stack])

        this(set $handling* new HandlingStrategy())
        this(set $function* new Function())

        [*function  this($function*) handler    elem($task.FileSystem.getFile)]
        [*handling  this($handling*) function   this($function*)]
        [*work      this($work*)     oninit     this($handling*)]

        this(set $handling* new HandlingStrategy())
        this(set $function* new Function())

        [*function  this($function*) handler    elem($done.test1)]
        [*handling  this($handling*) function   this($function*)]
        [*work      this($work*)     ondone     this($handling*)]

        [*work      this($work*)     state      WORK_STATE_IDLE]
        [*stack     this($stack*)    arg0       new String("/ilListe.json")]

        this($work*)
    )





    (func   $get<*>classi                                                                                   (type $i32->i32)
        ui8(get (i32.add global($byteOffset.classi) $0 ))
    )

    (func   $set<*classi>                                                                                    (type $i32x2->)
        ui8(set (i32.add global($byteOffset.classi) $0 ) $1)
    )

    (func   $tee<*classi>                                                                                 (type $i32x2->i32)
        call($set<*classi> $0 $1) $0
    )

    (func   $get<*>offset                                                                                   (type $i32->i32)
        i32(get (i32.add global($byteOffset.offset) i32(mul $0 i32(4))))
    )

    (func   $set<*offset>                                                                                    (type $i32x2->)
        i32(set (i32.add global($byteOffset.offset) i32(mul $0 i32(4))) $1)
    )

    (func   $get<*>parent                                                                                   (type $i32->i32)
        i32(get (i32.add global($byteOffset.parent) i32(mul $0 i32(4))))
    )

    (func   $set<*parent>                                                                                    (type $i32x2->)
        i32(set (i32.add global($byteOffset.parent) i32(mul $0 i32(4))) $1)
    )

    (func   $get<*>extern                                                                                   (type $i32->i32)
        i32(get (i32.add global($byteOffset.extern) i32(mul $0 i32(2))))
    )

    (func   $set<*extern>                                                                                    (type $i32x2->)
        i32(set (i32.add global($byteOffset.extern) i32(mul $0 i32(2))) $1)
    )

    (func   $ptr<*>                                                                                         (type $i32->ext)
        (if i32(eqz $0 ) (then return null))

        (if (type $->ext) 
                  call($self.Reflect.get<ext.i32>i32 [scope] $0 )
            (then call($self.Reflect.get<ext.i32>ext [scope] $0 ))
            (else call($self.Reflect.get<ext.i32>ext [scope] $0 
                    (call $self.Reflect.set<ext.i32.ext> [scope] $0                         
                        (call $self.Reflect.construct<ext2>ext
                            (call_indirect (type $->ext) $0~) 
                            (call $self.Array.of<i32>ext $0)
                        )
                    )
                ) 
            )
        )
    )

    (func   $ptr<memory*>                                                                                   (type $i32->ext)
        (call $self.Reflect.construct<ext2>ext class($Memory) 
            call($self.Array.of<i32>ext $0)
        )
    )

    (func   $init.event*                                                                                       (type $i32->)
        [*event $0 timeofInit now(i32)]
        [*event $0 threadInit (thread)]
    )

