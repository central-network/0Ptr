
    (func   $this.$                                                                                       (type $i32x3->ext)
    
        (if i32(eq type($exc) $2) (then (return $0 $1ƒƒ )))

        (if i32(eq type($bi8) $2) (then (return  i8(get i32(sum $0@ $1))√)))
        (if i32(eq type($bu8) $2) (then (return  u8(get i32(sum $0@ $1))√)))
        (if i32(eq  type($i8) $2) (then (return  i8(get i32(sum $0@ $1))D)))
        (if i32(eq  type($u8) $2) (then (return  u8(get i32(sum $0@ $1))D)))
        (if i32(eq type($i32) $2) (then (return i32(get i32(sum $0@ $1))D)))
        (if i32(eq type($i16) $2) (then (return i16(get i32(sum $0@ $1))D)))
        (if i32(eq type($u16) $2) (then (return u16(get i32(sum $0@ $1))D)))
        (if i32(eq type($ui8) $2) (then (return ui8(get i32(sum $0@ $1))D)))
        (if i32(eq type($ptr) $2) (then (return i32(get i32(sum $0@ $1))*)))
        (if i32(eq type($f64) $2) (then (return f64(get i32(sum $0@ $1))F)))
        (if i32(eq type($i64) $2) (then (return i64(get i32(sum $0@ $1))B)))
        (if i32(eq type($f32) $2) (then (return f32(get i32(sum $0@ $1))f)))
        (if i32(eq type($ext) $2) (then (return i32(get i32(sum $0@ $1))#)))
        (if i32(eq type($fun) $2) (then (return i32(get i32(sum $0@ $1))ƒ)))
        (if i32(eq type($ilk) $2) (then (return ilk(get i32(sum $0@ $1))§)))
        (if i32(eq type($ti4) $2) (then (return i32(get i32(sum $0@ $1))µ)))
        (if i32(eq type($tf4) $2) (then (return f32(get i32(sum $0@ $1))π)))
        (if i32(eq type($const) $2)(then (return i32(get i32(sum $0@ $1))C)))

        (unreachable)
    )

    (func   $self.defineGetter<name.func>                                                                  (type $ext.fun->)
        call($self.defineGetter<target.name.func> (self) $0 $1)
    )

    (func   $self.defineGetter<target.name.func>                                                          (type $ext2.fun->)
        call($self.defineProperty<target.name.type.fun> $0 $1 'get' $2)
    )

    (func   $self.defineCaller<name.func>                                                                  (type $ext.fun->)
        call($self.defineProperty<target.name.type.fun> (self) $0 'value' $1)
    )

    (func   $self.defineProperty<target.name.type.fun>                                                    (type $ext3.fun->)
        call($self.Reflect.defineProperty<ext3> $0 $1 { [ $2 $3 ] } )
    )

    (func   $extend<this.name>Class                                                                        (type $ext2->ext)
        call($self.Reflect.apply<ext3>ext
            call($self.Function<ext>ext
                call($self.Reflect.apply<ext3>ext
                    (self.String.prototype.replace)
                    'return class $ extends this {}'
                    (call $self.Array.of<ext2>ext '$' $1)
                )
            )
            $0 []
        )
    )

    (func   $class.RootClass                                                                                   (type $->ext)
        (local ext)
        (if (null global($RootClass))
            (then
                global(set $RootClass
                    call($extend<this.name>Class (self.Number) 'Pointer')
                )

                reset($temp/object)
                call($self.Reflect.set<ext2.fun> 
                    global($temp/object) 'value' func($this.$))
                
                call($self.Reflect.defineProperty<ext3> 
                    call($self.Reflect.get<ext2>ext
                        global($RootClass) 'prototype'
                    ) 
                    '$' 
                    global($temp/object)
                )

                reset($temp/object)
                global(set $temp/object 
                    call($self.Reflect.get<ext2>ext
                        global($RootClass) 'prototype'
                    ) 
                )

                call($self.Reflect.defineProperty<ext3>
                    global($temp/object) '{{children}}'
                    call($self.Object.fromEntries<ext>ext
                        call($self.Array.of<ext>ext
                            call($self.Array.of<ext2>ext 'get'
                                call($self.Function<ext>ext
                                    call($self.Reflect.apply<ext3>ext
                                        (self.String.prototype.replace)
                                        'return this.$(this, x, type($exc)&)'
                                        (call $self.Array.of<ext.i32>ext 'x' elem($get<*>children#))
                                    )
                                )
                            )
                        )
                    )
                )

                call($self.Reflect.defineProperty<ext3>
                    global($temp/object) '{{parent}}'
                    call($self.Object.fromEntries<ext>ext
                        call($self.Array.of<ext>ext
                            call($self.Array.of<ext2>ext 'get'
                                call($self.Function<ext>ext
                                    call($self.Reflect.apply<ext3>ext
                                        (self.String.prototype.replace)
                                        'return this.$(this, x, type($exc)&)'
                                        (call $self.Array.of<ext.i32>ext 'x' elem($get<*>parent#))
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )    
        global($RootClass)
    )

    (func   $self.Reflect.construct<ext>ext                                                                 (type $ext->ext)
        (call $self.Reflect.construct<ext2>ext 
            (local.get 0) 
            (call $self.Array<>ext)
        )
    )    

    (func   $self.Reflect.apply<ext2>                                                                         (type $ext2->)
        (call $self.Reflect.apply<ext3> 
            (local.get 0) 
            (local.get 1) 
            (call $self.Array<>ext)
        )
    )    

    (func   $self.Reflect.apply<ext2>ext                                                                   (type $ext2->ext)
        (call $self.Reflect.apply<ext3>ext
            (local.get 0) 
            (local.get 1) 
            (call $self.Array<>ext)
        )
    )    

    (func   $get<*>parent#                                                                                  (type $i32->ext)
        $0^* 🤪
    )    

    (func   $hasn't<*>children                                                                              (type $i32->i32)    
        (foreach $children* of $0 (return i32(0))) i32(1)
    )

    (func   $get<*>children#                                                                                (type $i32->ext)    
        (local i32) 
        (local ext) (lset $2 []) 
        
        (foreach $children* as $1 of $0
            call($self.Reflect.apply<ext3>
                self.Array.prototype.push
                $2
                call($self.Array.of<ext>ext call($ptr<*> $1)))
        )
        return $2
    )


    (func   $get<*.type>children#                                                                         (type $i32x2->ext)    
        (local i32) 
        (local ext) (lset $3 []) 
        
        (foreach $children* as $2 of $0
            (if i32(eq $1 $2~)
                (then
                    call($self.Reflect.apply<ext3>
                        self.Array.prototype.push
                        $3 [ $2* ]
                    )
                )
            )
        )
        return $3
    )


    (func   $get<const>ext                                                                                  (type $i32->ext)
        (local externref externref i32)

        block(const unreachable)

        (if (null (ltee $1 table(get $ilk $3 )))
            (then
                
                call($extend<this.name>Class self.Number $2) 
                call($self.Array.of<i32>ext $0)
                call($self.Reflect.construct<ext2>ext) 

                local(set 1)     
                table(set $ilk $3 $1)
            )
        )

        return $1
    )

    (func   $get<ilk>ext                                                                                    (type $i32->ext)
        (local externref)

        (if (null (ltee $1 table(get $ilk $0)))
            (then
                block(ilk unreachable)

                call($extend<this.name>Class self.Number $1) 
                call($self.Array.of<i32>ext $0)
                call($self.Reflect.construct<ext2>ext) 

                local(set 1)                
                table(set $ilk $0 $1)
            )
        )

        return $1
    )

    (func   $wasm.Node.prototype.nodeType                                                                   (type $i32->i32)

        (unreachable)
    )

