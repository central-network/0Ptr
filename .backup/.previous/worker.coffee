define = self.Object.defineProperties

[ { log, warn, error, debug } = console ]

pxy = new Proxy {}, {
	apply: console.error 
	construct: console.error 
	defineProperty: console.error 
	deleteProperty: console.error 
	get: console.error 
	getOwnPropertyDescriptor: console.error 
	getPrototypeOf: console.error 
	has: console.error 
	isExtensible: console.error 
	ownKeys: console.error 
	preventExtensions: console.error 
	set: console.error
	setPrototypeOf : console.error 	
}

self.Lolo = ->
	log 1, [ arguments... ]
	21

scope = [,self,]


global = {


	i 		: ( o, i ) -> o[ i ]
	fn 		: ( f, a... ) -> warn(f, a, {arguments} ) or f( a... )
	fn 		: ( f, a... ) -> f( a... )
	call 	: ( o, i, a... ) -> o[ i ] a...
	scope 	: new WebAssembly.Global { value: "externref" }, scope












	apply : ( func, thisArg, args... ) -> func.apply thisArg, args








	log, warn, error,

	textEncode : new WebAssembly.Global(
		{ value: "funcref" }, 
		new WebAssembly.Function({
			parameters	: ["externref"], 
			results		: ["externref"]
		}, TextEncoder::encode.bind(new TextEncoder))
	),

	buffer			: mem = new WebAssembly.Memory({ initial: 2 })
	Prototype 		: new WebAssembly.Global({ value: "externref" }, (class Pointer extends Number)),
	ArrayBuffer 	: new WebAssembly.Global({ value: "externref" }, mem.buffer),
	Float32Array 	: new WebAssembly.Global({ value: "externref" }, self.Float32Array),
	Int32Array 		: new WebAssembly.Global({ value: "externref" }, self.Int32Array),
	Uint8Array 		: new WebAssembly.Global({ value: "externref" }, self.Uint8Array),
	Number 			: new WebAssembly.Global({ value: "externref" }, self.Number),
	String 			: new WebAssembly.Global({ value: "externref" }, self.String),
	funcref 		: new WebAssembly.Global({ value: "funcref", mutable: true }, null),
	time 			: new WebAssembly.Global({ value: "f64", mutable: true }, Date.now()),
	cache 			: new WebAssembly.Memory({ initial: 1 }),

	to						: -> arguments[0]
	extend					: -> class extends arguments[0]
	construct 				: -> new arguments[0]( ...[arguments...].slice(1) )
	typeof					: ( any ) -> typeof any
	keyof					: -> arguments[0][arguments[1]]
	eq						: ( num0, num1 ) -> any0 - any1
	is						: ( any0, any1 ) -> any0 is any1

	getArrayIndex			: ( ref, array ) ->
		if -1 is i = array.indexOf ref
			i += array.push ref
		i
	getArrayValue			: -> arguments[1][arguments[0]]
	defineHeaderProperty 	: ( constructor, name, get, set, enumerable = off ) ->
		define constructor::, [ name ] : 
			enumerable: !!enumerable,
			get : if get then -> get this
			set : if set then -> set this, arguments[0]
	defineKeyValueProperty 	: ( name, value, object ) ->
		define object::, [ name ] : { value }
	defineTypedArrayProperty: ( constructor, TypedArray, buffer, name ) ->
		define constructor::, [ name ] : 
			enumerable: on
			get : -> new TypedArray buffer, this, @length 
	storeText				: ( text, mallocFn, encodeFn ) ->
		
		length = "#{text}".length
		byteArray = encodeFn text
		byteLength = byteArray.length
		ptri = mallocFn length, byteLength

		warn ptri.byteArray

		log [ text, ptri ]
	readText 				: ->
		view = new self.DataView global.cache.buffer 
		text = "" ; i = 0

		while charCode = view.getUint8 i++
			text += self.String.fromCharCode charCode

		text
	onanimationframe 		: ( epoch, frame, now ) ->
		if  (frame % 250) is 0
			log { epoch, frame, now: Date(Number(now)) }
	ondispatchevent 		: ( ptri ) ->
		e = Pointer.of( ptri )
		log "emit:", e, "calls:", e.callCount.value, "once:", e.isOnce.value
}



class Pointer 		extends Number

	@scope : []

	@storeClass : ->
		if -1 is i = @scope.indexOf this
			i += @scope.push this
		@classIndex = i

	@byteLength : 0

	@of 		: ( ptri, Prototype = this ) ->
		if ptri
			if  Prototype is Pointer
				if  ProtoClass = @getProtoClass ptri
					return new ProtoClass ptri
			return new Prototype ptri
		0

	@from 		: ( any = undefined ) ->
		if  any instanceof Pointer
			return any

		switch typeof any
			when "boolean", "undefined"
				return Boolean.from any

			when "number"
				if !any or self.Number.isInteger any
					return Integer.from any
				return Float.from any

			when "string"
				return String.from any

		if  self.Array.isArray any
			return Array.from any
		
		if  self.ArrayBuffer.isView any
			return TypedArray.from any

		if  any.constructor.name is "Object"
			return Object.from any

		ExtRef.from any

	get			: -> throw "warning get"

	toString	: -> throw "warning str"

	filter 		: ( FuncOrClass, instanceCheck = off ) ->
		childs = []
		next = 0

		if !Pointer.isPrototypeOf FuncOrClass
			if !(FuncOrClass instanceof Pointer)
				fn = FuncOrClass
				while next = Pointer.getNextChild this, next
					if  fn.call this, ptri = Pointer.of next
						childs.push ptri
				return childs

		cl = FuncOrClass

		if !instanceCheck
			clsi = cl.classIndex
			while next = Pointer.filterNextChild this, clsi, next
				childs.push cl.of next
			return childs

		while next = Pointer.getNextChild this, next
			ptri = Pointer.of next
			cons = ptri.constructor

			if  cl.isPrototypeOf cons
				childs.push ptri

		childs

	setParent 	: ( ptri ) ->
		Pointer.setParentPtri( this, ptri ); this
	
	getParent 	: ->
		Pointer.of Pointer.getParentPtri this

	append 		: ( ptri ) ->
		Pointer.setParentPtri( ptri, this ); this

	appendChild : ( ptri ) ->
		Pointer.setParentPtri( ptri, this ); ptri
class Integer 		extends Pointer
	@storeClass()
	@byteLength : 4

	@from 	: ( value = 0 ) ->
		if  value instanceof this
			return value	

		i = @malloc()
		
		if  value
			i.set( value )
		
		i

	set 	: ( value = 0 ) -> Pointer.setInt32 this, value
	get 	: -> Pointer.getInt32 this
class Float 		extends Pointer
	@storeClass()
	@byteLength : 4

	@from 	: ( value = 0 ) ->
		if  value instanceof this
			return value	
		i = @malloc(); i.set( value ); i

	set 	: ( value = 0 ) -> Pointer.setFloat32 this, value

	get 	: -> Pointer.getFloat32 this
class Boolean 		extends Pointer
	@storeClass()
	@byteLength : 4

	@from 	: ( value = 0 ) ->
		if  value instanceof this
			return value	

		@malloc().set( value )

	set 	: ( value = no ) ->
		Pointer.setUint8( this, !!value ); this

	get 	: -> !!Pointer.getUint8 this
class String 		extends Pointer
	@storeClass()
	@byteLength : 8

	@encode : TextEncoder::encode.bind new TextEncoder
	@decode : TextDecoder::decode.bind new TextDecoder

	@fromCharCode : self.String.fromCharCode 

	@toCamelCase : ( text = "" ) ->
		string = text.toString()
		string[0].toLowerCase() + string.substring 1

	@from 	: ( value = "" ) ->
		if  value instanceof this
			return value
	
		ptri = @malloc()

		if !length = value.length
			return ptri

		ptri.setLength length 
		ptri.setByteArray Uint8Array.from @encode value 

		ptri

	decode			: -> String.decode @getByteArray().value
	toString		: -> @get()

	get 			: -> @length and @decode() or ""

	getByteLength 	: -> Pointer.getByteLength Pointer.getInt32 this, 4
	getByteArray 	: -> Uint8Array.of Pointer.getInt32 this, 4
	setByteArray 	: ( ptri ) -> Pointer.setInt32 this, ptri, 4
	
	getLength 		: -> Pointer.getInt32 this
	setLength 		: ( length = 0 ) -> Pointer.setInt32 this, length
class Array 		extends Pointer

	@storeClass()

	@byteLength : 4

	@isArray	: self.Array.isArray

	@from 	: ( value = [] ) ->
		if  value instanceof this
			return value

		ptri = @malloc()

		if !length = value.length
			return ptri

		i = 0
		while i < length
			ptri.appendChild Pointer.from value[ i++ ]
		
		ptri.setLength length

		ptri

	get 	: ( index ) ->
		prev = 0

		if !arguments.length
			childs = []
			while prev = Pointer.getNextChild this, prev
				childs.push Pointer.of prev
			return childs	

		i = arguments[ 0 ]
		while prev = Pointer.getNextChild this, prev
			if !i-- then return Pointer.of prev
			else continue

		0	


	filter 	: ( fn = -> 1 ) ->
		prev = 0
		childs = []
		while prev = Pointer.getNextChild this, prev
			if  fn ptri = Pointer.of prev
				childs.push ptri
		return childs	

	getLength : -> Pointer.getInt32 this
	setLength : ( length = 0 ) -> Pointer.setInt32 this, length
class Object 		extends Pointer
	@storeClass()
	@byteLength : 4

	@keys	: self.Object.keys
	@values : self.Object.values

	@from 	: ( value = {} ) ->
		if  value instanceof this
			return value

		ptri = @malloc()
		keys = @keys value

		if !length = keys.length
			return ptri
		
		ptri.appendChild(
			String.from( key ).append( 
				Pointer.from( value[ key ] ) )
		) for key in keys
		
		ptri.setLength length 

		ptri

	get 	: ->
		object = {}
		for key in this.getKeys()
			object[ key.value ] = @getValue key 
		object

	getKeys	  : Array::get
	getValue  : ( key ) -> Pointer.of Pointer.getNextChild key

	getLength : -> Pointer.getInt32 this
	setLength : ( length = 0 ) -> Pointer.setInt32 this, length
class ExtRef 		extends Pointer
	@storeClass()
	@byteLength : 4

	@from 	: ( value = null ) ->
		if  value instanceof this
			return value
		@malloc().set( value )

	get 	: -> Pointer.getScopeValue @getIndex()
	set 	: ( value = null ) ->
		scope = Pointer.getScopeArray()

		if -1 is i = scope.indexOf value
			i += scope.push value

		@setIndex i ; this

	getIndex : -> Pointer.getInt32 this
	setIndex : ( index = 0 ) -> Pointer.setInt32 this, index
class TypedArray 	extends Pointer

	@from 	: ( value = [] ) ->
		if  value instanceof TypedArray
			return value

		if  this is TypedArray
			switch value.constructor.name
				when "Uint8Array" then return Uint8Array.from value
				when "Int32Array" then return Int32Array.from value
			return Float32Array.from value

		stride = @::TypedArray.BYTES_PER_ELEMENT
		length = value.length
		ptri   = @malloc length * stride
		store  = Pointer[ this.setter ]

		unless length then return ptri

		while length-- when v = value[ length ]
			store ptri, v, length * stride
		
		ptri

	get 	: ->
		length 		= this.getLength()
		array 		= new this.TypedArray length
		load 		= Pointer[ this.constructor.getter ]
		stride 		= this.TypedArray.BYTES_PER_ELEMENT

		while length--
			array[ length ] = load this, length * stride

		array	

	getLength : ->
		Pointer.getByteLength(this) / @TypedArray.BYTES_PER_ELEMENT
class Uint8Array 	extends TypedArray

	@classIndex 		: @storeClass(this)

	TypedArray			: self.Uint8Array

	@setter				: "setUint8"

	@getter				: "getUint8"
class Int32Array 	extends TypedArray

	@classIndex 		: @storeClass(this)

	TypedArray			: self.Int32Array

	@setter				: "setInt32"

	@getter				: "getInt32"
class Float32Array 	extends TypedArray

	@classIndex 		: @storeClass(this)

	TypedArray			: self.Float32Array

	@setter				: "setFloat32"

	@getter				: "getFloat32"
class UniqueId		extends String

	@generate 	: ->
		i = @pattern.length
		id = "#{@pattern}"
		uid = ""

		while i--
			randNum = Math.floor 10 * Math.random()
			randBool = 0.5 <= Math.random()
			randChar = String.fromCharCode(
				Math.floor 97 + Math.random() * 25 
			)

			switch char = id.charAt(i)
				when "?" then uid += randBool and randNum or randChar
				when "X" then uid += randChar.toUpperCase()
				when "x" then uid += randChar
				else uid += char

		@from uid

	@default	: -> @generate()
class UUIDv4		extends UniqueId

	@storeClass()

	@pattern 	: "????????-????-????-????-????????????"

define Integer::,
	[ "value" ] : { enumerable: on, get: Integer::get, set: Integer::set }
define Float::,
	[ "value" ] : { enumerable: on, get: Float::get, set: Float::set }
define Boolean::,
	[ "value" ] : { enumerable: on, get: Boolean::get, set: Boolean::set }
define String::,
	[ "value" ] : { enumerable: on, get: String::get, set: String::set }
	[ "length" ] : { enumerable: on, get: String::getLength, set: String::setLength }
define Array::,
	[ "length" ] : { enumerable: on, get: Array::getLength, set: Array::setLength }
	[ "value" ] : { enumerable: on, get: Array::get }
define Object::,
	[ "length" ] : { enumerable: on, get: Object::getLength, set: Object::setLength }
	[ "value" ] : { enumerable: on, get: Object::get }
define ExtRef::,
	[ "value" ] : { enumerable: on, get: ExtRef::get, set: ExtRef::set }
define TypedArray::,
	[ "length" ] : { enumerable: on, get: TypedArray::getLength, set: TypedArray::setLength }
	[ "value" ] : { enumerable: on, get: TypedArray::get }

class PointerProperty 	extends Pointer

	@storeClass()

	@byteLength : 16

	define this::,

		byteOffset :
			enumerable: on
			get : -> Pointer.getInt32 this
			set : ( value = 0 ) -> Pointer.setInt32 this, value

		name :
			enumerable: on
			get : -> String.of Pointer.getInt32 this, 4
			set : ( value = 0 ) -> Pointer.setInt32 this, String.from(value), 4

		class :
			enumerable: on
			get : -> ExtRef.of Pointer.getInt32 this, 8
			set : ( Proto ) -> Pointer.setInt32 this, ExtRef.from(Proto), 8

		required :
			enumerable: on
			get : -> Boolean.of Pointer.getInt32 this, 12
			set : ( bool ) -> Pointer.setInt32 this, Boolean.from(bool), 12

	@from : ( Prototype, desc ) ->
		ptri = @malloc()

		if  Prototype instanceof ClassPointer
			Prototype = Prototype.class.value

		if  name = desc.name
			ptri.name = name

		else if name = Prototype.name
			ptri.name = String.toCamelCase name

		Prototype.storeClass()

		ptri.required = !!desc.required
		ptri.class = Prototype

		ptri
class PointerFilter 	extends Pointer

	@storeClass()

	@byteLength : 12

	define this::,

		name :
			enumerable: on
			get : -> String.of Pointer.getInt32 this, 0
			set : ( value = 0 ) -> Pointer.setInt32 this, String.from(value), 0

		class :
			enumerable: on
			get : -> ExtRef.of Pointer.getInt32 this, 4
			set : ( Proto ) -> Pointer.setInt32 this, ExtRef.from(Proto), 4

		enumerable :
			enumerable: on
			get : -> Boolean.of Pointer.getInt32 this, 8
			set : ( bool ) -> Pointer.setInt32 this, Boolean.from(bool), 8

	@from : ( Prototype, desc ) ->
		ptri = @malloc()

		if  Prototype instanceof ClassPointer
			Prototype = Prototype.class.value

		if  name = desc.name
			ptri.name = name

		else if name = Prototype.name
			ptri.name = String.toCamelCase name

		if  no isnt desc.enumerable
			desc.enumerable = on

		Prototype.storeClass()

		ptri.class = Prototype
		ptri.enumerable = desc.enumerable

		ptri
class ClassPointer 		extends Pointer

	@storeClass()

	@byteLength 	: 16

	@from			: ( Prototype ) ->

		ptri = @malloc()
		ptri.class = Prototype	
		Prototype.storeClass()

		define Prototype, { classPointer : value: this }

		if  name = Prototype.name
			ptri.name = name	

		ptri

	new				: ( props = {} ) ->

		clsi = @classIndex
		ptri = @class.value.malloc @byteLength, clsi

		for prop in @filter PointerProperty
			pkey = prop.name.value

			if  pval = props[ pkey ]
				ptri[ pkey ] = pval
			
			else if prop.required.value
				ptri[ pkey ]

		ptri

	defineProperty 	: ( name, desc, target = @class.value.prototype ) ->
		
		if  name . startsWith "@"
			name = name.substring 1
			target = @class.value	
		define target, [ name ] : desc

		this

	definePointer 	: ( Prototype, desc = {} ) ->
		byteOffset = @byteLength

		ptri = PointerProperty.from Prototype, desc
		name = ptri.name.toString()

		ptri . byteOffset = byteOffset
		this . byteLength = byteOffset + 4

		get = null 
		set = ( value ) ->
			ptri = Prototype.from value 
			Pointer.setInt32 this, ptri, byteOffset
			return ptri

		isF = no
		if !desc.default and (v = Prototype.default)

			isF = !Pointer.isPrototypeOf v
			isF = isF and !(v instanceof Pointer)
			isF = isF and ("function" is typeof v)

			if isF
				desc.default = v.bind Prototype
			else desc.default = v

		value = desc.default
		isU = "undefined" is typeof value

		switch true
			when isF
				get = ->
					if ptri = Pointer.getInt32 this, byteOffset
						return Prototype.of ptri
					set.call this, value( this )

			when isU
				get = ->
					if ptri = Pointer.getInt32 this, byteOffset
						return Prototype.of ptri
					set.call this, Prototype.malloc()	
			
			when yes
				get = ->
					if ptri = Pointer.getInt32 this, byteOffset
						return Prototype.of ptri
					set.call this, value	

		@append( ptri ).defineProperty name,
			{ ...desc, get, set, enumerable: on }

	defineFilter 	: ( Prototype, desc = {} ) ->

		ptri = PointerFilter.from Prototype, desc
		name = ptri.name.toString()
		get  = -> @filter Prototype

		@append( ptri ).defineProperty name,
			{ ...desc, get }

	apply 			: ( property, args = [] ) ->
		@class.value[ property ].apply this, args

	call 			: ( property, ...argN ) ->
		@class.value[ property ].call this, argN...

	of 				: ( ptri ) ->
		@class.value.of ptri

	isPrototypeOf 	: ( ProtoClass ) ->
		@class.value.isPrototypeOf ProtoClass

	storeClass		: ->
		@class.value.storeClass()

	define this::,

		class :
			enumerable: on
			get : -> ExtRef.of Pointer.getInt32 this
			set : ( value ) ->
				if  value instanceof ClassPointer
					value = value.class.value
				Pointer.setInt32 this, ExtRef.from(value)

		name :
			enumerable: on
			get : -> String.of Pointer.getInt32 this, 4
			set : ( value = "" ) -> Pointer.setInt32 this, String.from(value), 4

		byteLength :
			enumerable: on
			get : -> Pointer.getInt32 this, 8
			set : ( value = 0 ) -> Pointer.setInt32 this, value, 8

		pointerProperties :
			enumerable: on
			get : -> @filter PointerProperty

		pointerFilters :
			enumerable: on
			get : -> @filter PointerFilter

		classIndex :
			enumerable: on
			set : ( value = 0 ) -> Pointer.setInt32 this, value, 12
			get : ->
				if  clsi = Pointer.getInt32 this, 12
					return clsi
				@classIndex = @class.value.storeClass()

addEventListener "message", ({ data: [memory, module] }) ->
	#console.log("#{name} received from main thread:", memory)

	global.memory = memory

	WebAssembly
		.instantiate( module, { global } )
		.then ({ exports: e }) ->
			return warn e, global
