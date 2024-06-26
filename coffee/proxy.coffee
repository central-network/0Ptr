export default Proxy = self.Proxy

Proxy.HTMLElement = ( name ) ->

	new class HTMLElement

		name    : name

		tagName : name.replace(/HTML|Element/g, "").toUpperCase()

		attachInternals: ->
		blur: ->
		click: ->
		focus: ->
		hidePopover: ->
		showPopover: ->
		togglePopover: ->
		constructor: ->
		
		title: ""
		lang: ""
		translate: ""
		dir: ""
		hidden: on
		inert: ""
		accessKey: ""
		draggable: ""
		spellcheck: on
		autocapitalize: on
		contentEditable: on
		enterKeyHint: ""
		isContentEditable: on
		inputMode: ""
		virtualKeyboardPolicy: ""
		offsetParent: 0
		offsetTop: 0
		offsetLeft: 0
		offsetWidth: 0
		offsetHeight: 0
		popover: ""
		innerText: ""
		outerText: ""
		dataset: {}
		nonce: ""
		autofocus: on
		tabIndex: 0
		style: {}
		attributeStyleMap: {}

		onload: Infinity
		
		editContext: ->
		onscrollend: ->
		onbeforexrselect: ->
		onabort: ->
		onbeforeinput: ->
		onbeforematch: ->
		onbeforetoggle: ->
		onblur: ->
		oncancel: ->
		oncanplay: ->
		oncanplaythrough: ->
		onchange: ->
		onclick: ->
		onclose: ->
		oncontentvisibilityautostatechange: ->
		oncontextlost: ->
		oncontextmenu: ->
		oncontextrestored: ->
		oncuechange: ->
		ondblclick: ->
		ondrag: ->
		ondragend: ->
		ondragenter: ->
		ondragleave: ->
		ondragover: ->
		ondragstart: ->
		ondrop: ->
		ondurationchange: ->
		onemptied: ->
		onended: ->
		onerror: ->
		onfocus: ->
		onformdata: ->
		oninput: ->
		oninvalid: ->
		onkeydown: ->
		onkeypress: ->
		onkeyup: ->
		onloadeddata: ->
		onloadedmetadata: ->
		onloadstart: ->
		onmousedown: ->
		onmouseenter: ->
		onmouseleave: ->
		onmousemove: ->
		onmouseout: ->
		onmouseover: ->
		onmouseup: ->
		onmousewheel: ->
		onpause: ->
		onplay: ->
		onplaying: ->
		onprogress: ->
		onratechange: ->
		onreset: ->
		onresize: ->
		onscroll: ->
		onsecuritypolicyviolation: ->
		onseeked: ->
		onseeking: ->
		onselect: ->
		onslotchange: ->
		onstalled: ->
		onsubmit: ->
		onsuspend: ->
		ontimeupdate: ->
		ontoggle: ->
		onvolumechange: ->
		onwaiting: ->
		onwebkitanimationend: ->
		onwebkitanimationiteration: ->
		onwebkitanimationstart: ->
		onwebkittransitionend: ->
		onwheel: ->
		onauxclick: ->
		ongotpointercapture: ->
		onlostpointercapture: ->
		onpointerdown: ->
		onpointermove: ->
		onpointerrawupdate: ->
		onpointerup: ->
		onpointercancel: ->
		onpointerover: ->
		onpointerout: ->
		onpointerenter: ->
		onpointerleave: ->
		onselectstart: ->
		onselectionchange: ->
		onanimationend: ->
		onanimationiteration: ->
		onanimationstart: ->
		ontransitionrun: ->
		ontransitionstart: ->
		ontransitionend: ->
		ontransitioncancel: ->
		oncopy: ->
		oncut: ->
		onpaste: ->
