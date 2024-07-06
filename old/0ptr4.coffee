
#* hello world
->

    GL2KEY = Object.keys     WebGL2RenderingContext
    GL2VAL = Object.values   WebGL2RenderingContext
    GL2NUM = new Object

    { log, warn, error, table, debug, info } = console

    sab = new SharedArrayBuffer 8 * 1e7
    dvw = new DataView sab
    ui8 = new Uint8Array sab
    u32 = new Uint32Array sab
    f32 = new Float32Array sab
    iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
    ref = new Array

    encode = TextEncoder::encode.bind new TextEncoder
    decode = TextDecoder::decode.bind new TextDecoder

    Object.defineProperty self, "dump", get : ->
        console.table do ->
            items = []
            for byteOffset from iterate()
                
                type = dvw.getUint32 byteOffset-4, iLE
                size = dvw.getUint32 byteOffset-8, iLE
                item = data: restore byteOffset , type
            
                items.push Object.defineProperties item,
                    type : value : type
        
                    ["{{Buffer}}"]  : value :
                        buffer      : bufferize byteOffset, type
                        byteOffset  : byteOffset
                        byteLength  : size
        
                    ["{{Headers}}"] : value :
                        new Uint32Array sab, byteOffset - 8, 2
            return items
        console.warn "externref:", ref
        console.warn ui8


    filter     = ( type, test, options = {} ) ->
        
        byteOffset = 0
        Iterator.from next: ->
            while byteLength = dvw.getUint32 byteOffset, iLE
                error type

                if  type - dvw.getUint32 byteOffset + 4, iLE
                    byteOffset += 8 + byteLength
                    continue

                if !test byteOffset + 8
                    byteOffset += 8 + byteLength
                    continue

                value = ref[type] 
                byteOffset = value + byteLength

                return { value }
            return { done: on }


    iterate     = ( options = {} ) ->
        
        byteOffset = options.begin or 0

        MATCH_TYPE = Boolean type = options.type
        APPLY_TEST = Boolean test = ref[ type ]?.test

        if !testOffset = options.testOffset
            #todo this is unnecessary
            APPLY_TEST = !1

        f = switch done = yes

            # { type: 1, testOffset : 4 }
            when  MATCH_TYPE and  APPLY_TEST
                ->
                    while byteLength = dvw.getUint32 byteOffset, iLE

                        if  type - dvw.getUint32 byteOffset + 4, iLE
                            byteOffset += 8 + byteLength
                            continue

                        if !test testOffset, byteOffset + 8
                            byteOffset += 8 + byteLength
                            continue

                        value = byteOffset + 8
                        byteOffset = value + byteLength

                        return { value }
                    return { done }

            # { type: 1 }
            when  MATCH_TYPE and !APPLY_TEST
                ->
                    while byteLength = dvw.getUint32 byteOffset, iLE

                        if  type - dvw.getUint32 byteOffset + 4, iLE
                            byteOffset += 8 + byteLength
                            continue

                        value = byteOffset + 8
                        byteOffset = value + byteLength

                        return { value }
                    return { done }

            # { }
            when !MATCH_TYPE and !APPLY_TEST
                ->
                    while byteLength = dvw.getUint32 byteOffset, iLE

                        value = byteOffset + 8
                        byteOffset = value + byteLength

                        return { value }
                    return { done }

            else throw [ /ITERATOR_FAILED/, options ]

        Iterator.from { next: f }

    externref   = ( any ) ->
        if -1 is i = ref.indexOf any
            i += ref.push any
        i

    subarray    = ( byteOffset, TypedArray = Uint8Array ) ->
        byteLength = dvw.getUint32 byteOffset - 8, iLE
        length = byteLength / TypedArray.BYTES_PER_ELEMENT
        new TypedArray sab, byteOffset, length

    store       = ( type = 0, data... ) ->
        buffer = ref[ type ].encode data...
        
        byteOffset = 0
        byteLength = buffer.byteLength

        if  mod = byteLength % 8
            byteLength += 8 - mod

        while size = dvw.getUint32 byteOffset, iLE
            #? to the end of sab
            byteOffset += size + 8

        dvw.setUint32 byteOffset , byteLength, iLE
        dvw.setUint32 byteOffset + 4 ,   type, iLE

        byteOffset += 8
        subarray( byteOffset ).set buffer
        ; byteOffset

    
        
    restore     = ( byteOffset, type ) ->
        type ||= dvw.getUint32 byteOffset - 4, iLE
        ref[ type ].decode subarray byteOffset
        
    bufferize   = ( byteOffset ) ->
        subarray( byteOffset ).slice().buffer

    TYPE_BYTE   = externref {
    
        object : ArrayBuffer

        encode : ->
            data = arguments[0]

            if  ArrayBuffer.isView data

                if  data . buffer.grow?
                    data = data.slice()
        
                if  data instanceof Uint8Array
                    return data
                
                return new Uint8Array data.buffer
            
            if  Array.isArray data
                return Uint8Array.from data

            throw /UNENCODEABLE/
        
        decode : -> arguments[0]

        test   : ( byteOffset, testOffset ) ->

            byteLength = dvw.getUint32 testOffset - 8, iLE
            if  byteLength - dvw.getUint32 byteOffset - 8, iLE
                return no

            offset = 0
            length = byteLength - 1

            # length could be even or odd
            while no is ( offset > length )

                #? right equality check
                return no if (
                    dvw.getUint8( byteOffset + length ) -
                    dvw.getUint8( testOffset + length ) )
                
                #* left equality check
                return no if (
                    dvw.getUint8( byteOffset + offset ) -
                    dvw.getUint8( testOffset + offset ) )
                
                #! walk one step
                offset++ ; --length

            return yes
    }

    TYPE_LINK   = externref {

        object : class Link extends Uint32Array

        encode : ( [ ref1, ref2 ] ) ->
            new Uint8Array @object.of( ref1, ref2 ).buffer

        decode : ( subarray ) ->
            ref1 = dvw.getUint32 subarray.byteOffset, iLE
            ref2 = dvw.getUint32 subarray.byteOffset + 4, iLE

            @object.of ref1, ref2

        test : ( byteOffset, testOffset ) ->

            return no if (
                dvw.getUint32( byteOffset, iLE ) -
                dvw.getUint32( testOffset, iLE )
            )

            return no if (
                dvw.getUint32( byteOffset + 4, iLE ) -
                dvw.getUint32( testOffset + 4, iLE )
            )

            yes
    }

    TYPE_TEXT   = externref {

        object  : String

        encode  : ( string ) ->
            textArray   = encode string
            byteLength  = textArray.byteLength
            data        = new Uint8Array byteLength + 4

            new DataView( data.buffer )
                .setUint32 0, byteLength, iLE

            data.set textArray, 4 ; data

        decode  : ( subarray ) ->
            { buffer, byteOffset, byteLength } = subarray
            
            begin = 4
            end = begin + new DataView(
                buffer, byteOffset, byteLength
            ).getUint32 0, iLE
            
            decode subarray.slice begin, end

        test    : ( byteOffset, testOffset ) ->
            
            textLength = dvw.getUint32 byteOffset, iLE
            if  textLength - dvw.getUint32 testOffset, iLE
                return no

            ref[ TYPE_BYTE ].test byteOffset, testOffset 
    }

    TYPE_TYPE   = externref {
        encode  : ( alias, byteOffset ) ->
            nameArray   = encode alias
            nameLength  = nameArray.byteLength

            byteLength  = nameLength + 12
            buffer      = new ArrayBuffer byteLength

            byteArray   = new Uint8Array buffer
            dataView    = new DataView buffer

            dataView.setUint32 4, byteOffset, iLE
            dataView.setUint32 8, nameLength, iLE
            
            byteArray.set nameArray, 12
            byteArray

        decode  : ( subarray ) ->
            nameLength = dvw.getUint32 subarray.byteOffset + 8, iLE
            byteOffset : dvw.getUint32 subarray.byteOffset, iLE
            index : dvw.getUint32 subarray.byteOffset + 4, iLE

            alias : decode subarray.slice 12, 12 + nameLength

        test    : ( byteOffset, testOffset ) ->
            dvw.getUint32(byteOffset) is dvw.getUint32(testOffset)

    }


    TYPE_JSON   = externref {
        encode : -> ref[ TYPE_TEXT ].encode JSON.stringify arguments[0]
        decode : -> JSON.parse ref[ TYPE_TEXT ].decode arguments[0]
        test   : ref[TYPE_TEXT].test
    }

    typedef     = ( object ) ->
        if -1 is i = ref.indexOf object
            i += ref.push object
        i

        def = store TYPE_TYPE, object.name, i
        dvw.setUint32 def, def, iLE 

        warn { object, i, def }  

        def


    ofb = store TYPE_BYTE, new Float32Array( new SharedArrayBuffer(8) )
    of1 = store TYPE_TEXT, "getByteLength"
    of2 = store TYPE_TEXT, "getByteLength"
    ofj = store TYPE_JSON, { type : 0, name : "some", }   
    of3 = store TYPE_TEXT, "getByteOffset"
    of4 = store TYPE_LINK, [ of1, of2 ]   


    TYPE_PARENT = typedef class Parent

        @byteLength : 8

        Object      : Uint32Array

        encode      : ( a, b ) ->
            new Uint8Array Uint32Array.of(a, b).buffer

        decode      : ( byteOffset ) ->
            new this.Object sab, byteOffset, 2

        isIndex     : ( index, byteOffset = this ) ->
            index is dvw.getUint32 byteOffset, iLE

    for iter from iterate({ type : 1, testOffset: of2 })
        log "str iter:", { match: iter, item: String(restore(iter)) }

    for iter from iterate({ type : TYPE_LINK, testOffset: of4 })
        log "lnk iter:", { match: iter, item: restore(iter) }


    error { TYPE_PARENT }
    for iter from filter( TYPE_PARENT, ( byteOffset ) -> 0 is TYPE_PARENT - dvw.getUint32 byteOffset, iLE )
        error iter

    dump

    #? primitives done, now we can walk -->
