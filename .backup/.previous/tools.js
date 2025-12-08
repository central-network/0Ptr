
self.stringify = function ( t, pad = "", useGlobals = true, lineChars = true, lineParts = true ) {
    let nme = "";
    let suf = "";
    let length = t.length;
    
    let charGetter = function ( char ) {
        if ( useGlobals ) { 
            let glob = { 
                "." : ".", "=" : "=", "*" : "*", "@" : "@", "+" : "+", "/" : "/", "_" : "_", "!" : "!", "#" : "#", "$" : "$", "%" : "%", "&" : "&", 
                "0" : "0", "1" : "1", "2" : "2", "3" : "3", "4" : "4", "5" : "5", "6" : "6", "7" : "7", "8" : "8", "9" : "9", 
                "A" : "A", "B" : "B", "C" : "C", "D" : "D", "E" : "E", "F" : "F", "G" : "G", "H" : "H", "I" : "I", "J" : "J", "K" : "K", "L" : "L", "M" : "M", "N" : "N", "O" : "O", "P" : "P", "Q" : "Q", "R" : "R", "S" : "S", "T" : "T", "U" : "U", "V" : "V", "W" : "W", "X" : "X", "Y" : "Y", 
                "a" : "a", "b" : "b", "c" : "c", "d" : "d", "e" : "e", "f" : "f", "g" : "g", "h" : "h", "i" : "i", "j" : "j", "k" : "k", "l" : "l", "m" : "m", "n" : "n", "o" : "o", "p" : "p", "q" : "q", "r" : "r", "s" : "s", "t" : "t", "u" : "u", "v" : "v", "w" : "w", "x" : "x", "y" : "y", "z" : "z"                
            }[char];

            if (glob) {
                return `(global.get $${glob})`; 
            }
        }
        
        return `(i32.const ${char.charCodeAt().toString().padStart(3, " ")})`;
    }


    let parts = []

    let offset = 0;
    let string = t;

    while ( offset < length ) {
        parts.push( 
            string.substr(0, 18)
            .split("").map(charGetter)
        )
        string = string.substr(18)
        offset += 18;
    }

    let lineString = "";
    

    if (parts.length > 3) {
        if (lineChars) {
            lineChars = `\n\t\t${pad}`
            lineString = `\n${pad}\t`; 
            lineParts = `\n${pad}`
    
        } else {
            lineChars = " "
            lineParts = " "
            lineString= " "
        }

    let padlen = 1
    if (parts.length > 9) {
        padlen++;
    }

parts = parts.map( (item, index) => 
`${pad}(call $push<ext2>${lineString}(global.get $temparray#)${lineString}(call $fromCharCode<i32x${item.length}>string#${lineChars}${item.join(lineChars)}${lineString})${lineParts})` 
)

parts = `${pad}(global.set $temparray# (call $array#))
${parts.join('\n')}
${pad}(call $join<array#>string# (global.get $temparray#))`


}
else if (parts.length > 1) {
    if (lineChars) {
        lineChars = `\n\t\t${pad}`
        lineString = `\n\t${pad}`; 

    } else {
        lineChars = " "
        lineParts = " "
    }

parts = parts.map( (item) => 
`${pad}\t(call $fromCharCode<i32x${item.length}>string#${lineChars}${item.join(lineChars)}${lineString})` 
)

parts = `${pad}(call $concat<string#x${parts.length}>string# 
${parts.join(`\n`)}
${pad})`


}

    else {
        if (lineChars) {
        lineChars = `\n\t${pad}`
        lineString = `\n${pad}`; 
    } else {
        lineChars = " "
        lineParts = ""
    }
parts = 
`${pad}(call $fromCharCode<i32x${parts[0].length}>string#${lineChars}${parts[0].join(lineChars)}${lineString})`   

    }


    console.warn(parts)

    return parts;

    if (length > 34) {

        if (length-34 > 1) {
            suf = "x" + (length-34 );
        }

        nme =       pad + `(call $concat<ext3>ext\n`;
        nme = nme + pad + `\t(call $fromCharCode<i32x17>string#\n`;
        nme = nme + pad + `\t\t(global.get $` + t.substr(0, 17).split("").join(')\n\t\t'+pad+'(global.get $') + `)\n`;
        nme = nme + pad + `\t)\n`
        nme = nme + pad + `\t(call $fromCharCode<i32x17>string#\n`;
        nme = nme + pad + `\t\t(global.get $` + t.substr(17,17).split("").join(')\n\t\t'+pad+'(global.get $') + `)\n`;
        nme = nme + pad + `\t)\n`
        nme = nme + pad + `\t(call $fromCharCode<i32${suf}>string#\n`;
        nme = nme + pad + `\t\t(global.get $` + t.substr(   34).split("").join(')\n\t\t'+pad+'(global.get $') + `)\n`;
        nme = nme + pad + `\t)\n`
        nme = nme + pad + `)\n`
        
    } else if (length > 17) {


        if (length-16 > 1) {
            suf = "x" + (length-16 );
        }

        nme =       pad + `(call $concat<string#x2>string#\n`;
        nme = nme + pad + `\t(call $fromCharCode<i32x16>string#\n`;
        nme = nme + pad + `\t\t(global.get $` + t.substr(0,16).split("").join(')\n\t\t'+pad+'(global.get $') + `)\n`;
        nme = nme + pad + `\t)\n`
        nme = nme + pad + `\t(call $fromCharCode<i32${suf}>string#\n`;
        nme = nme + pad + `\t\t(global.get $` + t.substr(  16).split("").join(')\n\t\t'+pad+'(global.get $') + `)\n`;
        nme = nme + pad + `\t)\n`
        nme = nme + pad + `)\n`
        
    } else {
        nme =       pad + `(call $fromCharCode<i32x${length}>string#\n`;
        nme = nme + pad + `\t(global.get $` + t.split("").join(')\n\t'+pad+'(global.get $') + `)\n`;
        nme = nme + pad + `)\n`
    }

    console.warn(nme)
    return nme;
}

self.orumcek = function ( zimbirti, nerden = "self" ) {

    let tarandi = [];
    let atlandi = [];
    let classlar = [];
    let ilkelciler = [];
    let numaracilar = [];
    let fonksiyon = Object.getPrototypeOf(Function);
    let tip_construct = 1;
    let tip_tetikleme = 2;
    let tip_ciftyonlu = 3;

    let get = [], set = [], fun = [], evt = [], nww = [], pri = [], imp = [];

    let fonksiyon_tip;
    let belirgin;
    let yazilabilir;
    let degistirebilir;
    let prototip, tanim, tip, isim, deger;

    let yollar = [];

    let ormucek = function ( nesne, yol = "" ) {
        if (tarandi.includes(nesne)) 
        { return atlandi.push(yol) }

        tarandi.push(nesne);

        Object.getOwnPropertyNames( nesne ).forEach( ad => {

            if (ad.match(/arguments|calee|caller|name/)) return;
            
            //if (ad === "length") return;
            if (ad === "memory") return;
            if (ad === "length") return;
            if (ad === "Math") return;
            if (ad === "Text") return;
            if (ad === "Selection") return;
            if (ad === "Promise") return;
            if (ad === "WebGLRenderingContext") return;
            if (ad.startsWith("$")) return;
            if (ad.includes("CSS")) return;
            if (ad.includes("ebkit")) return;
            if (ad.startsWith("SVG")) return;
            if (ad.startsWith("sync")) return;
            if (ad.startsWith("DOM")) return;
            if (ad.startsWith("Range")) return;
            if (ad.startsWith("Atomics")) return;
            if (ad.startsWith("Animation")) return;
            if (ad.startsWith("DataView")) return;
            if (ad.startsWith("Path2D")) return;
            if (ad.startsWith("Reflect")) return;
            if (ad.startsWith("eval")) return;
            if (ad.startsWith("WebKitMutationObserver")) return;
            if (ad.startsWith("XPath")) return;
            if (ad.includes("__")) return;
            if (ad.includes("aria")) return;
            if (ad.includes("Element") && ad !== "Element")
            {
                if (ad !== "HTMLElement" ){
                    if (!ad.match(/canvas|document|body/i)){
                        return;
                    }
                }
            }

            adyol = yol + "." + ad;
            tanim = Object.getOwnPropertyDescriptor(nesne, ad);

            belirgin = tanim.enumerable;
            yazilabilir = tanim.writable;
            degistirebilir = tanim.configurable;

            if ( !tanim.value ) {
                if (ad.startsWith("on")) {
                    evt.push( adyol + ".evt" ) 
                }
                else {
                    if (tanim.get) { get.push( adyol + "<ref>string#" ) }
                    if (yazilabilir){
                        if (tanim.set) { set.push( adyol + "<ref.value>i32" ) }
                    }
                }
            
                return
            }

            tip = typeof tanim.value;

            switch ( tip ) {
                case "object":
                    //console.warn("\x1b[34mobject", ad)
                    ormucek( tanim.value, adyol )
                break;

                case "function":
                    //console.warn("\x1b[32mfunction", ad)
                    if (ad === "toString" || ad === "valueOf" || ad === "toLocaleString" ) {
                        return
                    }
                    if (ad.match(/async/i) ) {
                        return
                    }

                    if (tarandi.includes(tanim.value)) return;
                    
                    prototip = Object.getPrototypeOf(nesne[ad]);
                    
                    fonksiyon_tip = 0;

                    if (Reflect.has( nesne[ad], "prototype" ))
                    {
                        [1,!1,[],{},1n,"",/1/,()=>{}].forEach(v => {
                            if (fonksiyon_tip) { return }
                            try {
                                nesne[ad](v)
                                fonksiyon_tip = tip_ciftyonlu;
                            } catch (e) {}
                        })

                        fonksiyon_tip ||= tip_construct;
                        
                        if (ad[0] === ad[0].toUpperCase()) {
                            if (fonksiyon_tip === tip_ciftyonlu) {
                                ilkelciler.push(ad)
                                pri.push(ad)
                            }
                            
                            if (!classlar.includes(ad)) {
                                let ext = [ad]
                                let cls = tanim.value;

                                while (cls = cls.__proto__) {
                                    if (!cls.name) {
                                        break;
                                    }
                                    ext.push(cls.name)
                                }

                                classlar.push( ext )
                                nww.push(ad)
                            }
                        }
                    }
                    else {
                        fonksiyon_tip ||= tip_tetikleme;
                        fun.push( adyol.replace(".prototype.constructor.", ".") + "<ref.arguments>string#" )
                    }
                    

                    ormucek( nesne[ad], adyol )
                break;

                case "number":
                    //console.warn("\x1b[36mnumber", ad)
                    if ( !Reflect.has( nesne.constructor, ad ) ) {
                        if ( Number.isInteger(tanim.value ) && !tanim.value.toString().includes("e") && tanim.value.toString().length <= 10 ) {
                            numaracilar.push( adyol.split(".").slice(1).join(".").replace("WebGL2RenderingContext", "gl") + " = " + tanim.value )
                        }
                        yollar.push( adyol + " = number<" + tanim.value + ">" )
                    }
                break;

                case "undefined":
                    //console.warn("\x1b[30mundefined", ad)
                    yollar.push( adyol + " = undefined" )
                break;

                case "string":
                    //console.warn("\x1b[40mstring", ad)
                    yollar.push( adyol + " = string<" + tanim.value + ">" )
                break;

                case "boolean":
                    //console.warn("\x1b[28mboolean", ad)
                    yollar.push( adyol + " = boolean<" + tanim.value + ">" )
                break;

                case "bigint":
                    //console.warn("bigint", ad)
                    yollar.push( adyol + " = bigint<" + Number(tanim.value) + ">" )
                    break;
                    
                    case "symbol":
                    yollar.push( adyol + " = symbol<>" )
                    //console.warn("symbol", ad)
                break;

                default: throw tip;
            }
        })
    }

    ormucek(zimbirti, nerden)
    /*
    ormucek(Reflect.getPrototypeOf(Uint16Array).prototype, "self.TypedArray.prototype")
    ormucek({ String, Array, Object, Function, Number, BigInt, ArrayBuffer, Blob, URL, Date, JSON,
        //SharedArrayBuffer, 
        Boolean, Proxy,
        Worker,
        Document, Element, Node, NodeList, DocumentType, CSSStyleDeclaration,
        CSSStyleSheet, CSSStyleRule, CSSStyleValue,
        HTMLDocument, DocumentTimeline, StyleSheet, StyleSheetList,
        HTMLHtmlElement, HTMLBodyElement, HTMLCanvasElement, 
        HTMLCollection, HTMLScriptElement, HTMLHeadElement, 
        EventTarget, WebAssembly, HTMLAllCollection,
        Location, Navigator, Navigation, DOMImplementation, FontFace,
        IDBCursor, IDBCursorWithValue, IDBDatabase, IDBFactory, IDBIndex, IDBKeyRange,
        IDBObjectStore, IDBOpenDBRequest, IDBRequest, IDBTransaction, IDBVersionChangeEvent,
        WebGL2RenderingContext, WebGLActiveInfo, WebGLBuffer, WebGLContextEvent, WebGLFramebuffer,
        WebGLProgram, WebGLQuery, WebGLRenderbuffer, WebGLSampler, WebGLShader, WebGLTexture,
        WebGLUniformLocation, WebGLVertexArrayObject,
        StorageManager, File, FileList, FileReader, 
        //FileSystem, FileSystemDirectoryEntry, FileSystemDirectoryHandle, FileSystemDirectoryReader,
        //FileSystemEntry, FileSystemFileEntry, 
        FileSystemFileHandle, FileSystemHandle,
        FileSystemWritableFileStream,
        WritableStream, WritableStreamDefaultWriter, WritableStreamDefaultController,
        ReadableStream, ReadableStreamBYOBReader, ReadableStreamBYOBRequest,
        BroadcastChannel, MessageChannel, MessagePort, MessageEvent,
        NetworkInformation, Permissions, PermissionStatus,
        XMLHttpRequest, Request, Response, Headers,
        TextEncoder, TextDecoder,
        Int8Array, Uint8Array, Uint8ClampedArray,
        Int16Array, Uint16Array,
        Int32Array, Uint32Array,
        BigInt64Array, BigUint64Array,
        Float32Array, Float64Array,
        WebSocket, WebSocketError, WebSocketStream,
        WebTransport, WebTransportBidirectionalStream, WebTransportDatagramDuplexStream, WebTransportError,
    }, "self")
    */

    let arrs = [yollar, numaracilar, get, set, fun, evt]
    
    arrs.forEach( (arr, j) => {
        arr.forEach( (k,i) => arr[i] = k.replace(".prototype.", "::") )
    })

    Array.of(fun).forEach( (arr) => {
        arr.forEach( (k,i) => {
            arr[i] = arr[i].replace("self.", "")
            let repargs = 0;

            if (arr[i].includes(".is") || k.match(/index|includes|parseF|parseI/i)) {
                arr[i] = arr[i].replace(">string#", ">i32")
                repargs = 1;
            }

            if (arr[i].includes("push")) {
                arr[i] = arr[i].replace(">string#", ">i32")
            }

            if (!arr[i].includes("::")) {
                arr[i] = arr[i].replace("<ref.arguments>", "<arguments#>")
            } else {
                let ret = arr[i].split(">").at(1) 
                arr[i] = arr[i].replace("<ref.arguments>string#", "")
                arr[i] = arr[i].replace("<ref.arguments>i32", "")

                let [ className, funcName ] = arr[i].split("::")
                
                let c = 0;
                while (c < className.length && className.charAt(c) === className.charAt(c).toUpperCase() ) {
                    className = className.substr(0, c) + className.charAt(c).toLowerCase() + className.substr(c+1);
                    c++
                }
                if (c !== className.length && c-- > 1) {
                    className = className.substr(0, c) + className.charAt(c).toUpperCase() + className.substr(c+1);
                }

                arr[i] = `${funcName}<${className}#.arguments#>${ret}`
            }


        })
    })

    Array.of(get).forEach( (arr) => {
        arr.forEach( (k,i) => { 
            arr[i] = k.replace("self.", "")
            arr[i] = arr[i].replace("<ref>string#", "")

            let [ className, funcName ] = arr[i].split("::")
                
            let c;
            
            if (className.charAt(c) === className.charAt(c).toUpperCase()) {
                c = 0;
                while (c < className.length && className.charAt(c) === className.charAt(c).toUpperCase() ) {
                    className = className.substr(0, c) + className.charAt(c).toLowerCase() + className.substr(c+1);
                    c++
                }
                if (c !== className.length && c-- > 1) {
                    className = className.substr(0, c) + className.charAt(c).toUpperCase() + className.substr(c+1);
                }
            }

            if (funcName.charAt(c) === funcName.charAt(c).toUpperCase())
            {
                c = 0;
                while (c < funcName.length && funcName.charAt(c) === funcName.charAt(c).toUpperCase() ) {
                    funcName = funcName.substr(0, c) + funcName.charAt(c).toLowerCase() + funcName.substr(c+1);
                    c++
                }
                if (c !== funcName.length && c-- > 1) {
                    funcName = funcName.substr(0, c) + funcName.charAt(c).toUpperCase() + funcName.substr(c+1);
                }
            }

            arr[i] = `get<${className}#>${funcName}#`

        } )
    })

    Array.of(set).forEach( (arr) => {
        arr.forEach( (k,i) => { 
            arr[i] = k.replace("self.", "")
            arr[i] = arr[i].replace("<ref.value>i32", "")

            let [ className, funcName ] = arr[i].split("::")
            
            let c;
            
            if (className.charAt(c) === className.charAt(c).toUpperCase()) {
                c = 0;
                while (c < className.length && className.charAt(c) === className.charAt(c).toUpperCase() ) {
                    className = className.substr(0, c) + className.charAt(c).toLowerCase() + className.substr(c+1);
                    c++
                }
                if (c !== className.length && c-- > 1) {
                    className = className.substr(0, c) + className.charAt(c).toUpperCase() + className.substr(c+1);
                }
            }

            if (funcName.charAt(c) === funcName.charAt(c).toUpperCase())
            {
                c = 0;
                while (c < funcName.length && funcName.charAt(c) === funcName.charAt(c).toUpperCase() ) {
                    funcName = funcName.substr(0, c) + funcName.charAt(c).toLowerCase() + funcName.substr(c+1);
                    c++
                }
                if (c !== funcName.length && c-- > 1) {
                    funcName = funcName.substr(0, c) + funcName.charAt(c).toUpperCase() + funcName.substr(c+1);
                }
            }

            arr[i] = `set<${className}#.${funcName}#>i32`

        } )
    })

    Array.of(nww).forEach( (arr) => {
        arr.forEach( (k,i) => {
            if (self[k]) {
                imp.push(`(global $self.${k}`.padEnd(52, " ") +`(import "self" "${k}"`.padStart(48, " ") + `)              externref)`)
            }
        } )
        arr.forEach( (k,i) => {
            
            let className = arr[i].split("<")[0]
                
            let c;
            
            if (className.charAt(c) === className.charAt(c).toUpperCase()) {
                c = 0;
                while (c < className.length && className.charAt(c) === className.charAt(c).toUpperCase() ) {
                    className = className.substr(0, c) + className.charAt(c).toLowerCase() + className.substr(c+1);
                    c++
                }
                if (c !== className.length && c-- > 1) {
                    className = className.substr(0, c) + className.charAt(c).toUpperCase() + className.substr(c+1);
                }
            }


            arr[i] = "new<arguments#>" + className + "#"

        } )
    })

    Array.of(pri).forEach( (arr) => {
        arr.forEach( (k,i) => arr[i] = "self." + k + "<ext>string#" )
    })

    console.warn({tarandi, atlandi})
    console.log(yollar)
    console.log({numaracilar})
    console.log({ilkelciler, classlar})
    console.log({get, set, fun, evt, nww, pri})
    //console.warn(imp.join("\n\t"))

}
