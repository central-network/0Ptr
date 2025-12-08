
    ;; offset Pointer.nextBuffer = offset($Pointer.nextBuffer)
    ;; offset Pointer.bufferType = offset($Pointer.bufferType)
    ;; offset Pointer.bufferSize = offset($Pointer.bufferSize)

    (func   $Pointer                                                                                           (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Pointer))))
            (then
                (i32<-ext
                    elem($Pointer)
                    (tee 0
                        Reflect(apply
                            eval("return class Pointer extends this {}") 
                            (self.Number)
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect.bind(global($object#) String("value") func($Pointer.call))
                Reflect.defineProperty(global($prototype#) Reflect(apply(self.String.fromCharCode) (null) Array.of(Number("$"))) global($object#))


            )
        )
        
        local(0)
    )




    ;; typeof Memory = elem($Memory)
    ;; offset Memory.bufferSize = offset($Memory.bufferSize)
    ;; offset Memory.bufferType = offset($Memory.bufferType)
    ;; offset Memory.byteLength = offset($Memory.byteLength)
    ;; offset Memory.#buffer    = offset($Memory.#buffer)
    ;; offset($Memory.resv16)
    ;; offset($Memory.resv20)
    ;; offset($Memory.resv24)
    ;; offset($Memory.resv28)
    ;; offset($Memory.resv32)
    ;; offset($Memory.resv36)
    ;; offset($Memory.resv40)
    ;; offset($Memory.resv44)
    ;; 48 --->
    (func   $class.Memory                                                                                            (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Memory))))
            (then
                (i32<-ext
                    elem($Memory)
                    (tee 0
                        Reflect(apply
                            eval("return class Memory extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )           
                (gset $prototype# Reflect(get local(0) String("prototype")))
                (gset $object# Object())
                (gset $arg0# String("get"))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($Memory.byteLength)&)"))
                Reflect.defineProperty(global($prototype#) String("byteLength") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ext)&, offset($Memory.#buffer)&)"))
                Reflect.defineProperty(global($prototype#) String("buffer#") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ptr)&, offset($Memory.pointerBase*)&)"))
                Reflect.defineProperty(global($prototype#) String("pointerBase*") global($object#))
            )
        )

        local(0)    
    )

    ;; typeof PointerBase = elem($PointerBase)
    ;; offset PointerBase.nextBuffer = offset($PointerBase.nextBuffer)
    ;; offset PointerBase.bufferType = offset($PointerBase.bufferType)
    ;; offset PointerBase.bufferSize = offset($PointerBase.bufferSize)
    ;; offset PointerBase.prevBuffer = offset($PointerBase.prevBuffer)
    ;; offset PointerBase.memory*    = offset($PointerBase.memory*)
    (func   $PointerBase                                                                                       (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($PointerBase))))
            (then
                (i32<-ext
                    elem($PointerBase)
                    (tee 0
                        Reflect(apply
                            eval("return class PointerBase extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )    

                (gset $prototype# Reflect(get local(0) String("prototype")))
                (gset $object# Object())
                (gset $arg0# String("get"))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($PointerBase.byteOffset)&)"))
                Reflect.defineProperty(global($prototype#) String("byteOffset") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($PointerBase.byteLength)&)"))
                Reflect.defineProperty(global($prototype#) String("byteLength") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($PointerBase.count)&)"))
                Reflect.defineProperty(global($prototype#) String("count") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($PointerBase.length)&)"))
                Reflect.defineProperty(global($prototype#) String("length") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ptr)&, offset($PointerBase.memory*)&)"))
                Reflect.defineProperty(global($prototype#) String("memory*") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ptr)&, offset($PointerBase.base.bufferType*)&)"))
                Reflect.defineProperty(global($prototype#) String("base.bufferType*") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ptr)&, offset($PointerBase.base.byteOffset*)&)"))
                Reflect.defineProperty(global($prototype#) String("base.byteOffset*") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ptr)&, offset($PointerBase.base.parentPtri*)&)"))
                Reflect.defineProperty(global($prototype#) String("base.parentPtri*") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($call_indirect)&, elem($dump<pointerBase*>)&)"))
                Reflect.defineProperty(global($prototype#) String("{{dump}}") global($object#))
            )
        )

        local(0)    
    )

    ;; typeof MatrixBase = elem($MatrixBase)
    ;; offset MatrixBase.nextBuffer = offset($MatrixBase.nextBuffer)
    ;; offset MatrixBase.bufferType = offset($MatrixBase.bufferType)
    ;; offset MatrixBase.bufferSize = offset($MatrixBase.bufferSize)
    (func   $MatrixBase                                                                                        (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($MatrixBase))))
            (then
                (i32<-ext
                    elem($MatrixBase)
                    (tee 0
                        Reflect(apply
                            eval("return class MatrixBase extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )    

                (gset $prototype# Reflect(get local(0) String("prototype")))
                (gset $object# Object())
                (gset $arg0# String("get"))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.arrayType)&)"))
                Reflect.defineProperty(global($prototype#) String("arrayType") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.rowLength)&)"))
                Reflect.defineProperty(global($prototype#) String("rowLength") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.colLength)&)"))
                Reflect.defineProperty(global($prototype#) String("colLength") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.count)&)"))
                Reflect.defineProperty(global($prototype#) String("count") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.length)&)"))
                Reflect.defineProperty(global($prototype#) String("length") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->ptr)&, offset($MatrixBase.memory*)&)"))
                Reflect.defineProperty(global($prototype#) String("memory*") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.BYTES_PER_MATRIX)&)"))
                Reflect.defineProperty(global($prototype#) String("BYTES_PER_MATRIX") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.BYTES_PER_ELEMENT)&)"))
                Reflect.defineProperty(global($prototype#) String("BYTES_PER_ELEMENT") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($MatrixBase.ELEMENTS_PER_MATRIX)&)"))
                Reflect.defineProperty(global($prototype#) String("ELEMENTS_PER_MATRIX") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($call_indirect)&, elem($get<matrixBase*>baseName#)&)"))
                Reflect.defineProperty(global($prototype#) String("{{baseName}}") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($call_indirect)&, elem($get<matrixBase*>baseArray#)&)"))
                Reflect.defineProperty(global($prototype#) String("{{baseArray}}") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($call_indirect)&, elem($get<matrixBase*>matrix.at#)&)"))
                Reflect.defineProperty(global($prototype#) String("{{matrix.at}}") global($object#))

            )
        )

        local(0)    
    )

    ;; typeof Buffer = elem($Buffer)
    ;; offset Buffer.nextBuffer = offset($Buffer.nextBuffer)
    ;; offset Buffer.bufferType = offset($Buffer.bufferType)
    ;; offset Buffer.bufferSize = offset($Buffer.bufferSize)
    (func   $Buffer                                                                                            (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Buffer))))
            (then
                (i32<-ext
                    elem($Buffer)
                    (tee 0
                        Reflect(apply
                            eval("return class Buffer extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $prototype# Reflect(get local(0) String("prototype")))
                (gset $object# Object())
                (gset $arg0# String("get"))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($Buffer.byteOffset)&)"))
                Reflect.defineProperty(global($prototype#) String("byteOffset") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($Buffer.byteLength)&)"))
                Reflect.defineProperty(global($prototype#) String("byteLength") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($call_indirect)&, elem($get<buffer*>byteArray#)&)"))
                Reflect.defineProperty(global($prototype#) String("{{data}}") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($Buffer.index)&)"))
                Reflect.defineProperty(global($prototype#) String("{{index}}") global($object#))
                
            )
        )

        local(0)    
    )


    (func   $Worker                                                                                            (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Worker))))
            (then
                (i32<-ext
                    elem($Worker)
                    (tee 0
                        Reflect(apply
                            eval("return class Worker extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("enumerable") Number(1))
                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Worker.buffer*)&)"))
                Reflect.defineProperty(global($prototype#) String("buffer*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Worker.device*)&)"))
                Reflect.defineProperty(global($prototype#) String("device*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Worker.thread*)&)"))
                Reflect.defineProperty(global($prototype#) String("thread*") global($object#))

                Reflect(set global($object#) String("enumerable") Number(0))
                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ext)&, offset($Worker.#worker)&)"))
                Reflect.defineProperty(global($prototype#) String("worker#") global($object#))

            )
        )

        local(0)    
    )


    (func   $WebSocket                                                                                         (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($WebSocket))))
            (then
                (i32<-ext
                    elem($WebSocket)
                    (tee 0
                        Reflect(apply
                            eval("return class WebSocket extends this {}") 
                            call($Pointer) 
                            []
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("enumerable") Number(1))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($WebSocket.device*)&)"))
                Reflect.defineProperty(global($prototype#) String("device*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($WebSocket.cache*)&)"))
                Reflect.defineProperty(global($prototype#) String("cache*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($WebSocket.url*)&)"))
                Reflect.defineProperty(global($prototype#) String("url*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptr*->i32)&, offset($WebSocket.readyState)&)"))
                Reflect.defineProperty(global($prototype#) String("readyState") global($object#))

                Reflect(set global($object#) String("enumerable") Number(0))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptr*->i32)&, offset($WebSocket.cacheSize)&)"))
                Reflect.defineProperty(global($prototype#) String("cacheSize") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ext)&, offset($WebSocket.#socket)&)"))
                Reflect.defineProperty(global($prototype#) String("socket#") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptr*->i32)&, offset($WebSocket.rx)&)"))
                Reflect.defineProperty(global($prototype#) String("rx") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptr*->i32)&, offset($WebSocket.tx)&)"))
                Reflect.defineProperty(global($prototype#) String("tx") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($call_indirect)&, elem($test.send<socket*>)&)"))
                Reflect.defineProperty(global($prototype#) String("{{TestSendPacket}}") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($call_indirect)&, elem($test.open<socket*>)&)"))
                Reflect.defineProperty(global($prototype#) String("{{TestConnect}}") global($object#))

            )
        )

        local(0)    
    )

    (func   $Device                                                                                            (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Device))))
            (then
                (i32<-ext
                    elem($Device)
                    (tee 0
                        Reflect(apply
                            eval("return class Device extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Device.window*)&)"))
                Reflect.defineProperty(global($prototype#) String("window*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Device.textEncoder*)&)"))
                Reflect.defineProperty(global($prototype#) String("textEncoder*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Device.textDecoder*)&)"))
                Reflect.defineProperty(global($prototype#) String("textDecoder*") global($object#))

            )
        )

        local(0)    
    )


    (func   $Window                                                                                            (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Window))))
            (then
                (i32<-ext
                    elem($Window)
                    (tee 0
                        Reflect(apply
                            eval("return class Window extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("enumerable") Number(1))
                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Window.name*)&)"))
                Reflect.defineProperty(global($prototype#) String("name*") global($object#))

                Reflect(set global($object#) String("enumerable") Number(0))
                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ext)&, offset($Window.#window)&)"))
                Reflect.defineProperty(global($prototype#) String("window#") global($object#))

            )
        )

        local(0)    
    )


    (func   $Event                                                                                             (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($Event))))
            (then
                (i32<-ext
                    elem($Event)
                    (tee 0
                        Reflect(apply
                            eval("return class Event extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("enumerable") Number(1))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptr*->i32)&, offset($Event.type)&)"))
                Reflect.defineProperty(global($prototype#) String("type") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptr*->i32)&, offset($Event.state)&)"))
                Reflect.defineProperty(global($prototype#) String("state") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Event.source*)&)"))
                Reflect.defineProperty(global($prototype#) String("source*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Event.target*)&)"))
                Reflect.defineProperty(global($prototype#) String("target*") global($object#))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ptr)&, offset($Event.device*)&)"))
                Reflect.defineProperty(global($prototype#) String("device*") global($object#))


                Reflect(set global($object#) String("enumerable") Number(0))
                
                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ext)&, offset($Event.#event)&)"))
                Reflect.defineProperty(global($prototype#) String("event#") global($object#))
            )
        )

        local(0)    
    )


    (func   $TextEncoder                                                                                       (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($TextEncoder))))
            (then
                (i32<-ext
                    elem($TextEncoder)
                    (tee 0
                        Reflect(apply
                            eval("return class TextEncoder extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ext)&, offset($TextEncoder.#textEncoder)&)"))
                Reflect.defineProperty(global($prototype#) String("textEncoder#") global($object#))

            )
        )

        local(0)    
    )


    (func   $TextDecoder                                                                                       (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($TextDecoder))))
            (then
                (i32<-ext
                    elem($TextDecoder)
                    (tee 0
                        Reflect(apply
                            eval("return class TextDecoder extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) String("get") eval("return this.$(this, type($ptri->ext)&, offset($TextDecoder.#textDecoder)&)"))
                Reflect.defineProperty(global($prototype#) String("textDecoder#") global($object#))

            )
        )

        local(0)    
    )

    
    (func   $String                                                                                            (type $->ext)
        (local externref)

        (if (null (tee 0 i32(ext elem($String))))
            (then
                (i32<-ext
                    elem($String)
                    (tee 0
                        Reflect(apply
                            eval("return class String extends this {}") 
                            call($Pointer) 
                            Array()
                        )
                    )
                )

                (gset $arg0# String("get"))
                (gset $object# Object())
                (gset $prototype# Reflect(get local(0) String("prototype")))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptri->ptr)&, offset($String.buffer*)&)"))
                Reflect.defineProperty(global($prototype#) String("buffer*") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($ptr*->i32)&, offset($String.length)&)"))
                Reflect.defineProperty(global($prototype#) String("length") global($object#))

                Reflect(set global($object#) global($arg0#) eval("return this.$(this, type($call_indirect)&, elem($get<string*>string#)&)"))
                Reflect.defineProperty(global($prototype#) String("{{Charset}}") global($object#))

            )
        )

        local(0)    
    )

    