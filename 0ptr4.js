
/*        

register Class      : Pointer
register Allocation : Pointer
register Vector3    : Pointer

define Class::      ,

    prototype       :
        enumerable  : on
        get : -> storage.find ({ clsptri }) =>
            ( clsptri - this ) is 0

    name            :
        enumerable  : on
        get : -> @prototype.name

    parent          :
        enumerable  : on
        get : ->
            protof( @prototype )["{{Class}}"] or new Number 0           

    keyName         : get : ->
        name = @name
        if  name.split("").some (c) -> c is c.toUpperCase()
            return name.toLocaleLowerCase()
        name[0].toLowerCase() + name.substring 1

define Pointer , alloc : get : ->
    ptri = new this palloc()
    dvw.setUint8 ptri + 0, 1 #status
    dvw.setUint8 ptri + 1, 4 #inner alloc offset

    ->
        ptri
*/
var BPE, Collection, DEBUG, GL2KEY, GL2NUM, GL2VAL, PALLOC_TYPE, PALLOC_UINT32, PALLOC_UINT8, PTR, PTRSTAT, PTRSTAT_ACTIVE, PTRSTAT_DELETE, PTRSTAT_IGNORE, PTRSTAT_PALLOC, PTRTYPE, PTRTYPE_CLASS, PTRTYPE_OBJECT, Storage, TYPEOF_PROPERTY_DEFINITION, allocate, assign, c, clearself, debug, decode, define, dvw, encode, error, f32, findProperty, getOffset, getOwn, getResvi8, getState, getType, hasOwn, iLE, iOFFSET, iRESv, iSTATE, iTYPE, info, j, key, len, log, palloc, parse, protof, ref, register, sab, setOffset, setResvi8, setState, setType, table, u32, ui8, val, warn;

DEBUG = 0;

//* hello world
GL2KEY = Object.keys(WebGL2RenderingContext);

GL2VAL = Object.values(WebGL2RenderingContext);

GL2NUM = new Object;

({log, warn, error, table, debug, info} = console);

sab = new SharedArrayBuffer(1e7 * 8);

dvw = new DataView(sab);

ui8 = new Uint8Array(sab);

u32 = new Uint32Array(sab);

f32 = new Float32Array(sab);

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

BPE = 4;

PTR = 16 * BPE;

iSTATE = 0;

iTYPE = 1;

iOFFSET = 2;

iRESv = 3;

getState = Atomics.load.bind(Atomics, ui8);

setState = Atomics.store.bind(Atomics, ui8);

getType = function(ptri) {
  return dvw.getUint8(ptri + iTYPE);
};

setType = function(ptri, value) {
  return dvw.setUint8(ptri + iTYPE, value);
};

getOffset = function(ptri) {
  return dvw.getUint8(ptri + iOFFSET);
};

setOffset = function(ptri, value) {
  return dvw.setUint8(ptri + iOFFSET, value);
};

getResvi8 = function(ptri) {
  return dvw.getInt8(ptri + iRESv);
};

setResvi8 = function(ptri, value) {
  return dvw.setInt8(ptri + iRESv, value);
};

PTRTYPE = {
  PTRTYPE_CLASS: PTRTYPE_CLASS = 1,
  PTRTYPE_OBJECT: PTRTYPE_OBJECT = 2
};

PTRSTAT = {
  PTRSTAT_DELETE: PTRSTAT_DELETE = 0,
  PTRSTAT_IGNORE: PTRSTAT_IGNORE = 2,
  PTRSTAT_ACTIVE: PTRSTAT_ACTIVE = 10,
  PTRSTAT_PALLOC: PTRSTAT_PALLOC = 11
};

PALLOC_TYPE = {
  PALLOC_UINT8: PALLOC_UINT8 = 1,
  PALLOC_UINT32: PALLOC_UINT32 = 4
};

ref = [PTRTYPE, PALLOC_TYPE];
for (j = 0, len = ref.length; j < len; j++) {
  c = ref[j];
  for (key in c) {
    val = c[key];
    c[val] = val;
  }
}

Collection = class Collection extends Array {};

Storage = class Storage extends Array {
  constructor() {
    var base;
    if ((base = super(...arguments))[0] == null) {
      base[0] = null;
    }
  }

  store(any, bytes = 2) {
    var i;
    if (-1 === (i = this.indexOf(any))) {
      i = Math.pow(0xff, bytes - 1);
      while (this[i]) {
        i = 1 + i;
      }
      if (i > Math.pow(0xff, bytes)) {
        throw /EXCEED_STORAGE/;
      } else {
        this[i] = any;
      }
    }
    if (Math.pow(0xff, bytes) <= i) {
      throw /EXCEED_STORAGE/;
    }
    return i;
  }

  storeForUint8(any) {
    return this.store(any, 1);
  }

  storeForUint16(any) {
    return this.store(any, 2);
  }

  storeForUint32(any) {
    return this.store(any, 4);
  }

  storeForUint64(any) {
    return this.store(any, 8);
  }

};

assign = Object.assign;

hasOwn = Object.hasOwn;

getOwn = Object.getOwnPropertyDescriptors;

protof = Object.getPrototypeOf;

define = function() {
  var desc, object, prop, ref1;
  [object, prop, desc] = arguments;
  if (arguments[2] == null) {
    ref1 = {...prop};
    for (prop in ref1) {
      desc = ref1[prop];
      define(object, prop, desc);
    }
    return object;
  }
  if (!desc.get && !desc.set && !desc.value) {
    desc = {
      value: desc
    };
  }
  return Object.defineProperty(object, prop, desc);
};

encode = TextEncoder.prototype.encode.bind(new TextEncoder);

decode = TextDecoder.prototype.decode.bind(new TextDecoder);

palloc = function() {
  var o;
  o = Atomics.add(u32, 0, PTR);
  if (!o) {
    throw [/PALLOC/, u32.slice(0, 2)];
  }
  return o;
};

//Atomics.or u32, 0, PTR
(clearself = function() {
  var k, l, len1, len2, len3, len4, m, n, p, ref1, ref2, ref3, ref4;
  ref1 = "isFinite isInteger isNaN isSafeInteger parseFloat parseInt".split(/\n|\s+/g);
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    p = ref1[k];
    Reflect.deleteProperty(Number, p);
  }
  ref2 = "toExponential toLocaleString toPrecision toFixed".split(/\n|\s+/g);
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    p = ref2[l];
    Reflect.deleteProperty(Number.prototype, p);
  }
  ref3 = "assign create entries freeze fromEntries getOwnPropertyDescriptor getOwnPropertyNames getOwnPropertySymbols getPrototypeOf groupBy hasOwn is isExtensible isFrozen isSealed keys preventExtensions seal setPrototypeOf values".split(/\n|\s+/g);
  for (m = 0, len3 = ref3.length; m < len3; m++) {
    p = ref3[m];
    Reflect.deleteProperty(Object, p);
  }
  ref4 = "__defineGetter__ __defineSetter__ __lookupGetter__ __lookupSetter__ propertyIsEnumerable toLocaleString hasOwnProperty".split(/\n|\s+/g);
  for (n = 0, len4 = ref4.length; n < len4; n++) {
    p = ref4[n];
    Reflect.deleteProperty(Object.prototype, p);
  }
  return 0;
})();

define(window, {
  storage: new Storage(Number)
});

define(Number.prototype, {
  toString: function() {
    throw /toString/;
  }
});

register = function() {
  var Alias, Parent, i, ref1, storagei;
  ref1 = arguments[0];
  for (Alias in ref1) {
    Parent = ref1[Alias];
    if (-1 === (i = storage.indexOf(Parent))) {
      throw /PARENT_NOT_REGISTERED/;
    }
    if (storage.find(function(c) {
      return (c != null ? c.name : void 0) === Alias;
    })) {
      throw /ALREADY_REGISTERED/;
    }
    storagei = storage.storeForUint8(Alias);
    document.head.appendChild(assign(document.createElement("script"), {
      text: `${Alias} = class extends storage[${i}] {}; storage[ ${storagei} ] = ${Alias
//.remove()
};`
    }));
  }
  return 0;
};

register({
  Pointer: Number
});

parse = {};

// type 2 is a property definition
parse[TYPEOF_PROPERTY_DEFINITION = 2] = function(offset) {
  var byteLength, byteOffset, options, optionsBegin, optionsByteLength, optionsEnd, prop, propBegin, propByteLength, propEnd, type;
  byteOffset = offset * 4;
  byteLength = u32[offset++] * 4;
  type = u32[offset++];
  //? read propname bytelength
  propByteLength = u32[offset++];
  
  //? read options bytelength
  optionsByteLength = u32[offset++];
  propBegin = offset * 4;
  propEnd = propBegin + propByteLength;
  optionsBegin = propEnd;
  optionsEnd = optionsBegin + optionsByteLength;
  //? decode name
  prop = decode(ui8.slice(propBegin, propEnd));
  options = decode(ui8.slice(optionsBegin, optionsEnd));
  return {
    byteOffset,
    byteLength,
    type,
    name: prop,
    data: JSON.parse(options)
  };
};

findProperty = function(prop) {
  var length, offset, property;
  offset = 0;
  while (length = u32[offset]) {
    //* readed bytelength belongs to all packet
    if (TYPEOF_PROPERTY_DEFINITION === u32[offset + 1]) {
      property = parse[TYPEOF_PROPERTY_DEFINITION](offset);
      if (property.name === prop) {
        return property;
      }
    }
    offset += length;
  }
  return null;
};

allocate = function(byteLength) {
  var length, mod, offset;
  offset = 0;
  while (length = u32[offset]) {
    warn({offset, length});
    offset += length;
  }
  byteLength = Math.max(byteLength, 1);
  if (mod = byteLength % 8) {
    byteLength += 8 - mod;
  }
  u32[offset] = byteLength / 8;
  return offset;
};

define(Pointer, {
  defineProperty: function(prop, options) {
    var byteLength, nameArray, nameArrayBegin, offset, optsArray, optsArrayBegin, type;
    if (findProperty(prop)) {
      throw "property is already registered: " + prop;
    }
    nameArray = encode(prop);
    optsArray = encode(JSON.stringify(options));
    type = 1;
    byteLength = 3 + nameArray.byteLength + optsArray.byteLength;
    offset = allocate(byteLength);
    log(offset, nameArray.byteLength);
    u32[++offset] = type;
    u32[++offset] = nameArray.byteLength;
    u32[++offset] = optsArray.byteLength;
    log({offset}, u32.slice(offset - 3, offset + 2));
    nameArrayBegin = offset * 4;
    optsArrayBegin = nameArrayBegin + nameArray.byteLength;
    ui8.set(nameArray, nameArrayBegin);
    ui8.set(optsArray, optsArrayBegin);
    Object.defineProperty(this.prototype, prop, {
      get: function() {}
    });
    log(u32);
  }
});

Pointer.defineProperty("parent", {
  size: 4,
  type: 2
});

warn("find:", findProperty("parent"));

Pointer.defineProperty("linked", {
  size: 4,
  type: 3
});

log(new Pointer(2));

//Vector3.palloc x : PALLOC_UINT8

//log new Vector3 palloc()
