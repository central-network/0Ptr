Object.defineProperties self,
    iLE : value : new Uint8Array( Uint32Array.of(1).buffer ).at 0
    buf : value : buf = new ArrayBuffer 4e6
    sab : value : sab = new ArrayBuffer 4e6
    dvw : value : new DataView buf
    i32 : value : new Int32Array buf
    ui8 : value : new Uint8Array buf
    scp : value : new Array undefined
    bvw : value : new DataView sab
    bu8 : value : new Uint8Array sab
    bu32 : value : new Uint32Array sab
    atomic : value : Int32Array.of(0, 0)


Object.defineProperty DataView::, "isLittleEndian", {
    value : Boolean iLE    
}

Object.defineProperty DataView::, "set", {
    value : ( alias = "Float32", offset = 0, value = 0 ) ->
        @[ "set" + alias ]( offset, value, iLE ) ; value    
}

Object.defineProperty DataView::, "get", {
    value : ( alias = "Float32", offset = 0, value = 0 ) ->
        @[ "get" + alias ]( offset, iLE )
}
