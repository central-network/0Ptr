var buf, sab;

Object.defineProperties(self, {
  iLE: {
    value: new Uint8Array(Uint32Array.of(1).buffer).at(0)
  },
  buf: {
    value: buf = new ArrayBuffer(4e6)
  },
  sab: {
    value: sab = new ArrayBuffer(4e6)
  },
  dvw: {
    value: new DataView(buf)
  },
  i32: {
    value: new Int32Array(buf)
  },
  ui8: {
    value: new Uint8Array(buf)
  },
  scp: {
    value: new Array(void 0)
  },
  bvw: {
    value: new DataView(sab)
  },
  bu8: {
    value: new Uint8Array(sab)
  },
  bu32: {
    value: new Uint32Array(sab)
  },
  atomic: {
    value: Int32Array.of(0, 0)
  }
});

Object.defineProperty(DataView.prototype, "isLittleEndian", {
  value: Boolean(iLE)
});

Object.defineProperty(DataView.prototype, "set", {
  value: function(alias = "Float32", offset = 0, value = 0) {
    this["set" + alias](offset, value, iLE);
    return value;
  }
});

Object.defineProperty(DataView.prototype, "get", {
  value: function(alias = "Float32", offset = 0, value = 0) {
    return this["get" + alias](offset, iLE);
  }
});
