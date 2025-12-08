
fsys = require("fs")
wats = fsys.readdirSync("./wat").filter(n=>n.endsWith(".wat"))
jsx = []
let fnis = [,];
let refs = "";

__init__ = ""
__glob__ = ""
wasm = ""

for (file of wats.slice()) {
    if (file.match(/import/i)) {
        wats.splice( wats.indexOf(file), 1 )
        wats.unshift( file )
    }
}

wats = [
    '__const__.wat',
    'module.import.wat',
    'Primes.wat',
    'File.wat',
    'WebGL2.wat',
    '__align__.wat',
    '__event__.wat',
    '__extern__.wat',
    '__proto__.wat',
    'FileReader.wat',
    'FileWriter.wat',
    'module.tick.wat',
    'wasm.Buffer.wat',
    'wasm.canvas.wat',
    'module.type.wat',
    'instantiate.wat',
]


const types = [,
    "i8",
    "u8",
    "bi8",
    "bu8",
    "ui8",
    "u16",
    "i16",
    "i32",
    "ptr",
    "u32",
    "u64",
    "i64",
    "f32",
    "f64",
    "ti4",
    "ti8",
    "tf4",
    "tf8",
    "v128",
    "ilk",
    "const",
    "exc"
]


gettypeid = (type = "") => {
    
    if (type.startsWith("$")) {
        type = type.substring(1)
    }

    let i = types.indexOf(type)
    if (i === -1) { i += types.push(type)}

    return i
}

classes = { 
    "$Memory" : { offsets:null, size: 0, count:0, elem:0 }, 
    "$MatrixBase" : { offsets:null, size: 0, count:0, elem:1 } 
}
elems = [ "$Memory", "$MatrixBase" ]

elemfix = ( code, offset = 0, word = "elem" ) => {
    begin   = code.indexOf( word + "($", offset + 1 )

    if (begin === -1) { return code; }

    begin += 4
    end     = code.indexOf( ")", begin ) + 1
    isval   = code.at(end) === "&"
    if (isval) { end++ }

    length  = end - begin
    epart   = code.substr( begin, length )

    fname   = epart.split(/\s|\(|\)/g)[1]
    index   = elems.indexOf(fname)

    if (index === -1) {
        index += elems.push(fname)
    }

    classes[fname] = { offsets:{}, size: 0, count:0, elem:index }

    if (isval) {
        if (word === "elem") {
            code = `${code.substr(0,begin-4)}${index}${code.substr(end)}`
        } else {
            code = `${code.substr(0,begin-4)}(table.get $fun ${index})${code.substr(end)}`
        }
    } else {
        code = `${code.substr(0,begin-4)}(i32.const ${index})${code.substr(end)}`
    }

    return elemfix(code, end, word)
}

offsetfix = ( code ) => {
    offsets = code
        ?.match(/\soffset\(.*?\)/g)
        ?.map(o => o.substring(o.indexOf("$"), o.length-1))
        ?.filter((o,i,t)=> t.lastIndexOf(o) === i)
        ?.map(o => o.match(/\$\w+|([^.].*)/g))
        ?.forEach( ( [c, d] ) => {
                let [p, l] = `${d}`.split(" ")

                if (m = code.match(new RegExp(`\\(size\\\s+\\${c}\\.${p}\\\s+\\\d+\\)`))) {
                    l = m[0].substring(m[0].lastIndexOf(" ")+1, m[0].lastIndexOf(")"))
                    code = code.replaceAll(m[0], "")
                }

                if (isNaN(l)) { l = 4 }
                else { l = l * 1 }

                if (!classes[c]) {
                    process.exit(console.error(new RegExp("Undefined:"), [c], p, "\n"))
                }

                if (!isNaN(classes[c].offsets[p])) {
                    if (l !== 4) {
                        classes[c].count -= 1
                        classes[c].size -= 4
                        
                        for (px in classes[c].offsets) {
                            classes[c].offsets[px] -= 4
                        }
    
                        delete classes[c].offsets[p]
                    } else { return }
                }

                offset = classes[c].size
                classes[c].offsets[p] = offset
                classes[c].count += 1
                classes[c].size += Math.abs(l)

                loader = "i32.load"
                storer = "i32.store"

                switch (l) {
                    case 1: loader = "i32.load8_u"; break;
                    case 2: loader = "i32.load16_u"; break;
                }

                switch (Math.abs(l)) {
                    case 1: storer = "i32.store8"; break;
                    case 2: storer = "i32.store16"; break;
                }

                code = code
                    .replaceAll(`.offset(${c}.${p})`, `(i32.const ${offset}) (i32.add) (${loader})`)
                    .replaceAll(`offset(${c}.${p} ${l})&`, `${offset}`)
                    .replaceAll(`offset(${c}.${p})&`, `${offset}`)
                    .replaceAll(`offset(${c}.${p} ${l})`, `(i32.const ${offset})`)
                    .replaceAll(`offset(${c}.${p})`, `(i32.const ${offset})`)

            }
        )

    for (c in classes) {
        code = code
            .replaceAll(`size(${c})&`,`${classes[c].size}`)                
            .replaceAll(`size(${c})`,`(i32.const ${classes[c].size})`)                
    }
    
    return code
}

stringfix = ( code ) => {

    [ "*", "#" ].forEach( x => 
        code.split(`(string${x} "`).slice(1).forEach((rest) => {
            length = 0
            string = rest.split(`")`)[0]
            $redef = string
                .split("")
                .map( c => ++length && c.charCodeAt() )
                .map( c => `(i32.const ${c})` )
                
            
            if (length <= 18) {
                code = code.split( `(string${x} "${string}")` ).join(
                    `(call $fromCharCode<i32x${length}>string${x} ${$redef.join(" ")})`
                )
            }
            else {
                code = code.split( `(string${x} "${string}")` ).join(
                    `(call $concat<string#x2>string#
                        (call $fromCharCode<i32x18>string${x} ${$redef.slice(0,18).join(" ")})
                        (call $fromCharCode<i32x${length-18}>string${x} ${$redef.slice(18).join(" ")})
                     )
                    `.trim()
                )
            }
        })
    )


    return code
}

typeoffix = ( code, tries = 0 ) => {

    if (tries++ > 20) {
        process.exit(!console.error("type error", {types}));
    }

    start = code.indexOf("type($")

    if (start !== -1) {
        end = code.indexOf(")", start)
        
        typeLabel = code.substring(start+5, end)
        typeIndex = gettypeid(typeLabel) 

        code = code.replaceAll( `type(${typeLabel})&`, `${typeIndex}`)
        code = code.replaceAll( `type(${typeLabel})`, `(i32.const ${typeIndex})`)

        return typeoffix(code, tries);
    }

    return code
}


globals = []
selfcalls = []

stringify = (str, tabs = "            ", cached = true) => {
    if (typeof tabs === "boolean") {
        cached = tabs
        tabs = "            "
    }
    c = str

    if (["'","`",'"'].includes(c.charAt())) {
        c = str.substring(1, c.length-1)
    }

    ified = `\n${tabs}`
    ified = ified + `(global.set $stringify# (call $self.Array<>ext))\n${tabs}`
    for (let i in c)
        ified = ified + `(call $self.Reflect.set<ext.i32x2> (global.get $stringify#) (i32.const ${i}) (i32.const ${c.charCodeAt(i)}))\n${tabs}`        
    ified = ified + `(global.get $self.String.fromCharCode) (ref.null extern) (global.get $stringify#)\n${tabs}`
    ified = ified + `(call $self.Reflect.apply<ext3>ext)\n${tabs.substring(0, tabs.length - 4)}`

    return ified
}


const strs = {}
let strsi = 1
let globalizeds = {};

globalizeString = (str) => {

    let stri = globalizeds[str];

    if (!stri) {

        globalizeds[str] = stri =
            callifyString(str, true, true)

        __glob__ = `${__glob__}
            (global $${str}# (mut externref) (ref.null extern))`;

        __init__ = `${__init__}
            (global.set $${str}# (call $String<${stri}>))`;
    }

    return `(global.get $${str}#)`
}


callifyString = (str, temp = false, glob = false) => {
    let func = str.split(/[^\w]/g).filter(Boolean).join("_")
    let code = ""
    let stri;

    if (!func) { func = str; }

    if (!strs[func]) {
        stri = strsi++

        if (temp === true) {
            code =`
            (func $String<${stri}> (result externref)
                ${stringify(str, '                ')}
            )
                `;
        } else {
            code =`
            (func $String<${stri}> (result externref)
                (local externref)

                (if (ref.is_null (local.tee 0 (table.get $str (i32.const ${stri}))))
                    (then
                        (i32.const ${stri})
                        (local.tee 0 ${stringify(str, '                            ')})                        
                        (table.set $str)                        
                    )
                )

                (local.get 0)
            )
                `;
        }

        strs[func] = { stri: stri, code: code} 
    }

    if (glob === true) {
        return stri
    }

    if (globalizeds[str]) {
        return `(global.get $${str}#)`;
    }

    return `(call $String<${strs[func].stri}>)`
} 



const FOREACH_CONTENT_PARENT = (
`
        (global.set $FOREACH.count       (i32.div_u (i32.load OFFSET_MEMORY_PTRCOUNT) (i32.const 4)))
        (global.set $FOREACH.offset.v128 (global.get $byteOffset.parent))
        (global.set $FOREACH.splat.i32x4 (i32x4.splat %INPUTPTR%))

        (if (i32.rem_u (i32.load OFFSET_MEMORY_PTRCOUNT) (i32.const 4))
            (then 
                (global.set $FOREACH.count
                    (i32.add (i32.const 1) (global.get $FOREACH.count))
                )
            )
        )


        (if (i32.eqz %INPUTPTR%)
            (then (unreachable))
        )

        (global.set $FOREACH.item* (i32.const 0))
        (global.set $FOREACH.iterindex (i32.const 0))

        (loop $v128
            (global.set $FOREACH.item*
                (i32.mul 
                    (global.get $FOREACH.iterindex) 
                    (i32.const 4)
                )
            )      

            (if (v128.any_true 
                    (i32x4.eq 
                        (global.get $FOREACH.splat.i32x4)
                        (v128.load 
                            (global.get $FOREACH.offset.v128)
                        )
                    )
                ) 
                (then
                    (global.set $FOREACH.index      (i32.const 4)) 
                    (global.set $FOREACH.offset.i32 (global.get $FOREACH.offset.v128))

                    (loop $i32 
                        
                        (if (i32.eq %INPUTPTR% (i32.load (global.get $FOREACH.offset.i32))) 
                            (then
                                (block $content
                                    %CONTENT%
                                )
                            )
                        )

                        (global.set $FOREACH.offset.i32 
                            (i32.add 
                                (i32.const 4) 
                                (global.get $FOREACH.offset.i32)
                            )
                        )

                        (global.set $FOREACH.item*
                            (i32.add 
                                (i32.const 1)
                                (global.get $FOREACH.item*)
                            )
                        )

                        (global.set $FOREACH.index
                            (i32.sub 
                                (global.get $FOREACH.index)
                                (i32.const 1)
                            )
                        )

                        (br_if $i32 (global.get $FOREACH.index))
                    )                    
                )
            )
            
            (global.set $FOREACH.offset.v128 
                (i32.add 
                    (i32.const 16) 
                    (global.get $FOREACH.offset.v128)
                )
            )


            (global.set $FOREACH.iterindex
                (i32.add 
                    (global.get $FOREACH.iterindex) 
                    (i32.const 1)
                )
            )  

            (global.set $FOREACH.count
                (i32.sub (global.get $FOREACH.count) (i32.const 1))
            )        

            (br_if $v128 (global.get $FOREACH.count))        
        )
`);

const FOREACH_CONTENT_CLASSI = (
`
        (global.set $FOREACH.offset.v128 (global.get $byteOffset.classi))
        (global.set $FOREACH.splat.i8x16 (i8x16.splat %INPUTPTR%))
        (global.set $FOREACH.count       (i32.div_u (i32.load OFFSET_MEMORY_PTRCOUNT) (i32.const 16)))


        (if (i32.rem_u (i32.load OFFSET_MEMORY_PTRCOUNT) (i32.const 16))
            (then 
                (global.set $FOREACH.count
                    (i32.add (i32.const 1) (global.get $FOREACH.count))
                )
            )
        )

        (global.set $FOREACH.item*      (i32.const 0))
        (global.set $FOREACH.iterindex  (i32.const 0))

        (if (i32.eqz %INPUTPTR%)
            (then (unreachable))
        )

        (loop $v128
            (global.set $FOREACH.item* 
                (i32.mul (i32.const 16) (global.get $FOREACH.iterindex))
            )  

            (if (v128.any_true 
                    (i8x16.eq 
                        (global.get $FOREACH.splat.i8x16)
                        (v128.load 
                            (global.get $FOREACH.offset.v128)
                        )
                    )
                ) 
                (then
                    (global.set $FOREACH.index       (i32.const 16)) 
                    (global.set $FOREACH.offset.ui8  (global.get $FOREACH.offset.v128))

                    (loop $ui8 
                        (global.set $FOREACH.index 
                            (i32.add 
                                (i32.const -1)
                                (global.get $FOREACH.index) 
                            )
                        )

                        (if (i32.eq %INPUTPTR% (i32.load8_u (global.get $FOREACH.offset.ui8))) 
                            (then
                                (block $content
                                    %CONTENT%
                                )
                            )
                        )

                        (global.set $FOREACH.offset.ui8 
                            (i32.add 
                                (i32.const 1) 
                                (global.get $FOREACH.offset.ui8)
                            )
                        )

                        (global.set $FOREACH.item*
                            (i32.add 
                                (i32.const 1)
                                (global.get $FOREACH.item*)
                            )
                        )


                        (br_if $ui8 (global.get $FOREACH.index))
                    )                    
                )
            )
            
            (global.set $FOREACH.offset.v128  (i32.add (global.get $FOREACH.offset.v128) (i32.const 16)))
            (global.set $FOREACH.iterindex    (i32.add (global.get $FOREACH.iterindex) (i32.const 1)))  
            (global.set $FOREACH.count        (i32.sub (global.get $FOREACH.count) (i32.const 1)))    

            (br_if $v128 (global.get $FOREACH.count))        
        )
`);

getenclosed = ( code, start ) => {
    let opener  = start;
    let sec     = 200;
    let substr, subiof;

    while (--sec) {
        subiof = code.indexOf(")", opener) + 1
        substr = code.substring(start, subiof)

        if ( substr.split("(").length === substr.split(")").length) 
        { break } else { opener = subiof }
    }    

    if(!sec) { process.exit(1) }

    return substr
}

simdlooper = ( code ) => {
    let d = false
    let i = 0
    
    for (let regex of [ /\(foreach\s\$children\*\s/, /\(foreach\s\$sametype\*\s/, /\(foreach\s(\$[A-Z].[^\s\)]*)\s+(as\s+(.[^\s\n]*)|)/g, /\(foreach\s+\$child\*\sof\s(.[^\s\)\n)]*)\s+(as\s+(.[^\s\n]*)|)/g ]) {
        i++

        if (i >2) {
            for (let d of code.matchAll(regex)) {

                let arg0, arg1, elem, cons, text, type, iglo, trep;

                switch (i) {
                    case 3: //typeloop
                        type = "type"
                        arg0 = `elem(${d[1]})`
                        arg1 = d[3] || "global($typed*)"
                        elem = clsss[arg0]?.elem || -1
                        cons = FOREACH_CONTENT_CLASSI
                        iglo = arg1.startsWith("global") || isNaN(arg1.substring(1))
                    break;
                        
                    case 4: //childrens
                        type = "chld"
                        arg0 = d[1]
                        arg1 = d[3]
                        elem = -1
                        cons = FOREACH_CONTENT_PARENT
                        iglo = !arg1 || arg1.startsWith("global") || (arg1 === "$child*")
                    break;
                }


                

                text = trep = getenclosed(code, d.index)
                text = text.substring(d[0].length, text.length-1).trim()

                if (!text.trim().length) { 
                    continue
                }

                cons = cons.replaceAll( "%CONTENT%", text )
                cons = cons.replaceAll( "%INPUTPTR%", arg0 )

                cons = cons.replaceAll(" $child* ", " (global.get $FOREACH.item*) ")
                
                if (!iglo) {
                    if (arg1.startsWith("local")) {
                        arg1 = arg1.substring(
                            arg1.indexOf("(") + 1,
                            arg1.lastIndexOf(")")
                        )
                    }

                    if (!isNaN(arg1.substring(1))) {
                        arg1 = arg1.substring(1);
                    }
                    
                    cons = cons.replaceAll("global.get $FOREACH.item*", "local.get " + arg1)
                    cons = cons.replaceAll("global.set $FOREACH.item*", "local.set " + arg1)

                } else {
                    if (arg1.startsWith("global")) {
                        arg1 = arg1.substring(
                            arg1.indexOf("(") + 1,
                            arg1.lastIndexOf(")")
                        )
                    }
                    
                    if (arg1) {
                        cons = cons.replaceAll(arg1, "$FOREACH.item*")
                    }
                }

                cons = cons.replaceAll( "FOREACH", "SIMDLOOP" + i )
                cons = cons.replaceAll( "(continue)", "(br $content)" )
                cons = cons.replaceAll( " continue", " (br $content)" )
                code = code.replaceAll( trep, cons )
            }
        }
        else {
            while (d = code.match(regex)) {
    
                let start   = d.index;
                let opener  = start;
                let sec     = 100;
                let substr, subiof, $local, $inputptr, iof, nof, content;
        
                while (--sec) {
                    subiof = code.indexOf(")", opener) + 1
                    substr = code.substring(start, subiof)
        
                    if ( substr.split("(").length === substr.split(")").length) 
                    { break } else { opener = subiof }
                }
        
                content = substr.substring(substr.indexOf("*")+1, substr.length-1)
        
                iof = content.indexOf(" of ")
                nof = substr.indexOf("\n")
        
                if (nof === -1) { nof = substr.indexOf("(", substr.indexOf("of") + 4) }
                if (nof === -1) { process.exit(1) }
        
                if (content.trim().startsWith("as")) {
                    $local = content.substring( 4, iof ).trim()
                    $local = $local.replaceAll(/local|\.|get|\$|\s+|\(|\)/g, "")
                } 
                
                
                $inputptr = substr.substring(substr.indexOf("of")+2, nof).trim()
                content = substr.substring(nof, substr.lastIndexOf(")") )
        
                content = content.replaceAll("$sametype*", "(global.get $FOREACH.item*)")
                content = content.replaceAll("$children*", "(global.get $FOREACH.item*)")
    
    
                if (1 === i) {
                    content = FOREACH_CONTENT_PARENT.replace("%CONTENT%", content)
                } else if (2 === i) {
                    content = FOREACH_CONTENT_CLASSI.replace("%CONTENT%", content)
                }
    
                
                content = content.replaceAll("%INPUTPTR%", $inputptr)
        
                if ($local) {
                    content = content.replaceAll("global.get $FOREACH.item*", "local.get " + $local)
                    content = content.replaceAll("global.set $FOREACH.item*", "local.set " + $local)
                }
                
                content = content.replaceAll("FOREACH", "SIMDLOOP" + i)
                //console.log(substr, {$inputptr, $local, content})
        
                code = code.replaceAll(substr, content)
            }
        }

    }
    return code
}


globalize = (glob) => {
    gals = globals.slice()
        .map(g => {if (g !== "self") { return 'self.' + g} else { return "self" }})

    g = glob
    p = 0
    s = ""

    if (gals.includes(g)) { s = `(global.get $${g})` }
    else if (gals.includes(g = glob.split(".").slice(0, --p).join("."))) { s = `(global.get $${g})` }
    else if (gals.includes(g = glob.split(".").slice(0, --p).join("."))) { s = `(global.get $${g})` }
    else if (gals.includes(g = glob.split(".").slice(0, --p).join("."))) { s = `(global.get $${g})` }
    else if (gals.includes(g = glob.split(".").slice(0, --p).join("."))) { s = `(global.get $${g})` }
    else if (gals.includes(g = glob.split(".").slice(0, --p).join("."))) { s = `(global.get $${g})` }
    else { process.exit(!console.error("non-globalized", {glob})) }


    while (p) {
        s = `${s}
                ${callifyString(glob.split(".").at(p++))}
                (call $self.Reflect.get<ext2>ext)
                `
    }

    return [ glob, s ]
}

wasm = `(module
`


reader = (d) => {
    return {
        "i8" : "i32.load8_s",
        "bi8" : "i32.load8_s",
        "bu8" : "i32.load8_u",
        "u8" : "i32.load8_u",
        "ui8" : "i32.load8_u",
        "u16" : "i32.load16_u",
        "i16" : "i32.load16_s",
        "i32" : "i32.load",
        "ptr" : "i32.load",
        "fun" : "i32.load",
        "ext" : "i32.load",
        "u32" : "i32.load",
        "u64" : "i64.load",
        "i64" : "i64.load",
        "f32" : "f32.load",
        "f64" : "f64.load",
        "ti4" : "i32.load",
        "ti8" : "i64.load",
        "tf4" : "f32.load",
        "tf8" : "f64.load",
        "ilk" : "i32.load",
        "const" : "i32.load",
        "v128" : "v128.load",
    }[d]
}

realtype = (d) => {
    return {
        "i8" : "i32",
        "bi8" : "i32",
        "bu8" : "i32",
        "u8" : "i32",
        "ui8" : "i32",
        "u16" : "i32",
        "i16" : "i32",
        "i32" : "i32",
        "ptr" : "i32",
        "u32" : "i32",
        "u64" : "i64",
        "i64" : "i64",
        "f32" : "f32",
        "f64" : "f64",
        "ti4" : "i32",
        "ti8" : "i64",
        "tf4" : "f32",
        "tf8" : "f64",
        "ext" : "i32",
        "fun" : "i32",
        "ilk" : "i32",
        "const" : "i32",
        "v128" : "v128",
    }[d]
}

importtype = (d) => {
    return {
        "i8" : "i32",
        "bi8" : "i32",
        "bu8" : "i32",
        "u8" : "i32",
        "ui8" : "i32",
        "u16" : "i32",
        "i16" : "i32",
        "i32" : "i32",
        "ptr" : "i32",
        "u32" : "i32",
        "u64" : "i64",
        "i64" : "i64",
        "f32" : "f32",
        "f64" : "f64",
        "ti4" : "i32",
        "ti8" : "i64",
        "tf4" : "f32",
        "tf8" : "f64",
        "ext" : "ext",
        "fun" : "i32",
        "ilk" : "i32",
        "const" : "i32",
        "v128" : "v128",
    }[d]
}

simdtype = (d) => {
    return {
        "i8" : "i8x16",
        "bi8" : "i8x16",
        "bu8" : "i8x16",
        "u8" : "i8x16",
        "ui8" : "i8x16",
        "u16" : "i16x8",
        "i16" : "i16x8",
        "i32" : "i32x4",
        "ptr" : "i32x4",
        "u32" : "i32x4",
        "u64" : "i64x2",
        "i64" : "i64x2",
        "f32" : "f32x4",
        "f64" : "f64x2",
        "ti4" : "i32x4",
        "ti8" : "i64x2",
        "tf4" : "f32x4",
        "tf8" : "f64x2",
        "ext" : "i32x4",
        "fun" : "i32x4",
        "ilk" : "i32x4",
        "const" : "i32x4",
        "v128" : "v128",
    }[d]
}

sizeof = (d) => {
    return {
        "bi8" : 1,
        "bu8" : 1,
        "i8" : 1,
        "u8" : 1,
        "ui8" : 1,
        "u16" : 2,
        "i16" : 2,
        "i32" : 4,
        "u32" : 4,
        "u64" : 8,
        "i64" : 8,
        "f32" : 4,
        "f64" : 8,
        "ti4" : 4,
        "ti8" : 8,
        "tf4" : 4,
        "tf8" : 8,
        "ext" : 4,
        "fun" : 4,
        "ptr" : 4,
        "ilk" : 4,
        "const" : 4,
        "v128" : 16,
    }[d]
}

writer = (d) => {
    return {
        "i8" : "i32.store8",
        "bi8" : "i32.store8",
        "bu8" : "i32.store8",
        "u8" : "i32.store8",
        "ui8" : "i32.store8",
        "u16" : "i32.store16",
        "i16" : "i32.store16",
        "i32" : "i32.store",
        "ti4" : "i32.store",
        "fun" : "i32.store",
        "ext" : "i32.store",
        "ptr" : "i32.store",
        "u32" : "i32.store",
        "u64" : "i64.store",
        "i64" : "i64.store",
        "f32" : "f32.store",
        "f64" : "f64.store",
        "ti4" : "i32.store",
        "ti8" : "i64.store",
        "tf4" : "f32.store",
        "tf8" : "f64.store",
        "ilk" : "i32.store",
        "const" : "i32.store",
        "v128" : "v128.store",
    }[d]
}

writerAtomicGet = (d) => {
    return {
        "i8" : "i32.",
        "bi8" : "i32.",
        "bu8" : "i32.",
        "u8" : "i32.",
        "ui8" : "i32.",
        "u16" : "i32.",
        "i16" : "i32.",
        "i32" : "i32.atomic.load",
        "ti4" : "i32.",
        "fun" : "i32.",
        "ext" : "i32.",
        "ptr" : "i32.",
        "u32" : "i32.",
        "u64" : "i64.",
        "i64" : "i64.",
        "f32" : "f32.",
        "f64" : "f64.",
        "ti4" : "i32.",
        "ti8" : "i64.",
        "tf4" : "f32.",
        "tf8" : "f64.",
        "ilk" : "i32.",
        "const" : "i32.",
        "v128" : "v128.",
    }[d]
}

writerAtomicSub = (d) => {
    return {
        "i8" : "i32.",
        "bi8" : "i32.",
        "bu8" : "i32.",
        "u8" : "i32.",
        "ui8" : "i32.",
        "u16" : "i32.",
        "i16" : "i32.",
        "i32" : "i32.atomic.rmw.sub",
        "ti4" : "i32.",
        "fun" : "i32.",
        "ext" : "i32.",
        "ptr" : "i32.",
        "u32" : "i32.",
        "u64" : "i64.",
        "i64" : "i64.",
        "f32" : "f32.",
        "f64" : "f64.",
        "ti4" : "i32.",
        "ti8" : "i64.",
        "tf4" : "f32.",
        "tf8" : "f64.",
        "ilk" : "i32.",
        "const" : "i32.",
        "v128" : "v128.",
    }[d]
}

writerAtomicAdd = (d) => {
    return {
        "i8" : "i32.atomic.rmw8.add_s",
        "bi8" : "i32.atomic.rmw8.add_s",
        "bu8" : "i32.atomic.rmw8.add_u",
        "u8" : "i32.atomic.rmw8.add_u",
        "ui8" : "i32.atomic.rmw8.add_u",
        "u16" : "i32.atomic.rmw16.add_u",
        "i16" : "i32.atomic.rmw16.add_s",
        "i32" : "i32.atomic.rmw.add",
        "ti4" : "i32.",
        "fun" : "i32.",
        "ext" : "i32.",
        "ptr" : "i32.",
        "u32" : "i32.",
        "u64" : "i64.",
        "i64" : "i64.",
        "f32" : "f32.",
        "f64" : "f64.",
        "ti4" : "i32.",
        "ti8" : "i64.",
        "tf4" : "f32.",
        "tf8" : "f64.",
        "ilk" : "i32.",
        "const" : "i32.",
        "v128" : "v128.",
    }[d]
}

consts = {}
const TYPES = [];

const clsss = {}

ops = (op) => { return {"*":"mul", "+": "add", "/": "div_u", "-": "sub", "==": "eq", "!=": "ne"}[op.trim()] }
tys = (t0,t1 = "") => { return {i816: "i8x16", ui8: "i32", i8: "i32", i16: "i32", si8: "i32"}[t0 + t1] || (t0 + t1) }


getEncosedFrame = ( match, enclosedWith = [ "(", ")" ], starti ) => {
    if (!isNaN(match)) {
        match = { index: match, input: wasm }
    }

    starti = starti || match.input.indexOf( enclosedWith[0], match.index )
    let opener = starti;
    let substr, subiof;
    let maxRetry = 200;

    while (--maxRetry) {
        subiof = match.input.indexOf(enclosedWith[1], opener) + enclosedWith[0].length
        substr = match.input.substring(starti, subiof)

        if ( substr.split(enclosedWith[0]).length === substr.split(enclosedWith[1]).length) 
        { break } else { opener = subiof }
    }    
    
    if(!maxRetry) {
        return {} 
        process.exit(+!console.log("maxRetry", match[0])) 
    }


    let frame = {
        content : match.input.substring(match.index, subiof),
        section : substr.substring(
            enclosedWith[0].length, 
            substr.length - enclosedWith[1].length 
        )
    }

    return frame
}

findFunctionAndArgumentsType = ( position ) => {    
    let prev = wasm.substring( 0, position)
    let rest = prev.substring( prev.lastIndexOf("(func ") )
    let func = rest.substring( rest.indexOf("$"), rest.indexOf( " ", rest.indexOf("$") ) )
    let type = rest.substring( rest.indexOf("$", rest.indexOf("(type")), rest.indexOf(")", rest.indexOf("(type")) )
    let body = getEncosedFrame( prev.lastIndexOf("(func ") )

    let [args = "", outs = ""] = type.substring(1).split("->")

    args = args.split(".").flatMap( (type, n) => {
        if ( type.length <= 3 ) { return type }
        else { return new Array(type.at(3) * 1).fill(type.substring(0,3)) }
    }).filter(Boolean)

    outs = outs.split(".").flatMap( (type, n) => {
        if ( type.length <= 3 ) { return type }
        else { return new Array(type.at(3) * 1).fill(type.substring(0,3)) }
    }).filter(Boolean)

    return {
        name: func,
        type: type,
        args: args,
        outs: outs,
        body: body
    }
}

const readedFileContents = {}
wats.forEach( file => {
    readedFileContents[ file ] = fsys.readFileSync(`./wat/${file}`).toString()
})

const raw = { code : '' }
for (let file in readedFileContents) {
    raw.code += readedFileContents[file] 
}

/*
let parseTypeArgument = function ( args ) {
    return args.split(".").map(a => a.trim()).flatMap( arg => {
        if (arg.substring(0,3) === "ext" && !isNaN(arg[3])) { arg = "extx" + arg[3] }

        if (m = arg.match(/(\w{2,3})(?=\x([\d+]$))/)) {
            arg = new Array( Number( m[2] ) ).fill( m[1] )
        }

        return arg
    }).filter(Boolean)
}

let parseType = function ( type = "$->" ) {
    let [ param, result = [] ] = type
        .substring( type.indexOf("$")+1 )
        .trim()
        .split("->")
        .map(a => parseTypeArgument( a.trim() ))

    return { param, result }
}

let parseLocalDefinitions = function ( code = "", param = [] ) {
    let locals = []
    let index = param.length; 

    for (let m of code.matchAll(/\(local\s+(\$\w[^) ]+)\s+(\w+)\)/g)) {
        locals.push({ index: index, type: m[2], kind: "local/$param", name: `$${index}`, label: m[1] })
        code = code.replace(m[0], "")
        index++
    }

    for (let m of code.matchAll(/local\((\$\w[^) ]+)\s+(\w+)\)/g)) {
        locals.push({ index: index, type: m[2], kind: "local/$param", name: `$${index}`, label: m[1] })
        code = code.replace(m[0], "")
        index++
    }

    for (let m of code.matchAll(/\(local\s+(\w[^)]+)\)/g)) {
        for (let ptype of m.at(1).split(" ")) { 
            locals.push({
                index: index, type: ptype, kind: "local/param", name: `$${index}`, label: null
            })
            index++
        }
        code = code.replace(m[0], "")
    }

    for (let m of code.matchAll(/local\((\w[^)|set|tee|\$]+)\)/g)) {
        for (let ptype of m.at(1).split(" ")) { 
            locals.push({
                index: index, type: ptype, kind: "local/param", name: `$${index}`, label: null
            })
            index++
        }
        code = code.replace(m[0], "")
    }

    for (let m of code.matchAll(/local\(([a-z0-9]{2,5}\s?)+\)/g)) {
        for (let ptype of m.at(1).split(" ")) { 
            locals.push({
                index: index, type: ptype, kind: "local/param", name: `$${index}`, label: null
            })
            index++
        }
        code = code.replace(m[0], "")
    }

    for (let loc of locals) { param.push(loc) }
    for (let loc of param) { 
        loc.type = loc.type.replace("externref", "ext")
    }

    return { local: locals, code };
}

let tbl = []
for (let m of raw.code.matchAll(/\(func\s+(\$(.*?))\s+/g)) {
    let [ , $name, name ] = m
    let body = getEncosedFrame( m, ["(", ")"], m.index ).content

    let rest = body.replace(m[0], "")

    let param = []
    let result = []
    let local = []
    
    //labelled (param $label [type])
    for (m.prt of rest.matchAll(/\((param)\s+(\$.[^)]*)\s+(\w[^)]+)\)/g)) {
        let [ match, kind, $label, ptype ] = m.prt
        rest = rest.replace( match, "" ) //remove 
        param.push({index: param.length, type: ptype, kind: "args/$param", name: `$${param.length}`, label: $label })
    }
    
    //unlabelled (param [type 0] ...[type N])
    for (m.prt of rest.matchAll(/\((param)\s+(\w[^)]+)\)/g)) {
        let [ match, kind, ptypes ] = m.prt
        for (let ptype of ptypes.split(" ")) { param.push({
            index: param.length, type: ptype, kind: "args/param", name: `$${param.length}`, label: null
        })}
        rest = rest.replace( match, "" ) //remove 
    }

    for (m.prt of rest.matchAll(/\((result)\s+(\w[^)]+)\)/g)) {
        let [ match, kind, rtypes ] = m.prt
        for (let rtype of rtypes.split(" ")) { result.push({
            index: result.length, type: rtype, kind: "args/result", name: `$$${result.length}`, label: null
        })}
        rest = rest.replace( match, "" ) //remove 
    }

    let $type = ( body.split("(type ").at(1) || ')' ).split(")").at() || null

    if ($type) {
        let parsed = parseType( $type??"" )

        for (let ptype of parsed.param) { param.push({
            index: param.length, type: ptype, kind: "type/param", name: `$${param.length}`, label: null
        })}

        for (let rtype of parsed.result) { result.push({
            index: result.length, type: rtype, kind: "type/result", name: `$$${result.length}`, label: null
        })}

        rest = rest.replace( $type, "" ) //remove 
    }

    let argc = param.length
    let locs = parseLocalDefinitions( rest, param )

    local = locs.local
    rest = locs.code.substring(0, locs.code.lastIndexOf(")"))

    //clear empties ([param|result|type] \s?)
    for (m.prt of rest.matchAll(/\((param|result|type)(.*[^)])\)/g)) {
        rest = rest.replace( m.prt[0], "" ) //remove 
    }

    let func = { name: $name, type: $type, argc, l: local.length, r: result.length, vars: {param, result, local} }

    for (let i of param) { i.defined = true }
    for (let i of result) { i.defined = true }
    for (let i of local) { i.defined = true }

    if (!name.includes("this")) {
        console.log([$name], rest)
    }

    tbl.push(func)
}

console.table(tbl, Object.keys(tbl[0]))
*/

wats.forEach( file => {
    
    code = readedFileContents[ file ]
    
    nano = code

    nano.match(/\(func\s+\$.*\s\(type\s\$\w*->[\w*|]\)/g)?.forEach((t,n,i,f) => {
        [n] = {index:i} = t.match(/\(type\s\$\w*->[\w*|]\)/)        
        nano = nano.replace(t, (t.substring(0,i).trim() + " ").padEnd(Math.max(120 - n.length, 80), " ") + n)
    })

    nano.match(/\(func\s+\$.*\s\(type\s\$\w*->\w\d+\)/g)?.forEach((t,n,i,f) => {
        [n] = {index:i} = t.match(/\(type\s\$\w*->\w\d+\)/)        
        nano = nano.replace(t, (t.substring(0,i).trim() + " ").padEnd(Math.max(120 - n.length, 80), " ") + n)
    })

    nano.match(/\(func\s+\$.*\s\(type\s\$\w*->\w*[^()]\)/g)?.forEach((t,n,i,f) => {
        [n] = {index:i} = t.match(/\(type\s\$\w*->\w*[^()]\)/)        
        nano = nano.replace(t, (t.substring(0,i).trim() + " ").padEnd(Math.max(120 - n.length, 80), " ") + n)
    })

    nano.match(/\(func\s+\$.*\s\(type\s\$(.*)->\)/g)?.forEach((t,n,i,f) => {
        [n] = {index:i} = t.match(/\(type\s\$(.*)->\)/)        
        nano = nano.replace(t, (t.substring(0,i).trim() + " ").padEnd(Math.max(120 - n.length, 80), " ") + n)
    })

    if (nano !== code) {
        fsys.writeFileSync(`./wat/${file}`, nano)
    }


    code.match(/\([A-Z0-9_]+\s(-|)(\d+|0[xX][0-9a-fA-F]+)\)/g)?.map( c => { 
        [ ,label, i32 ] = c.split(/\(|\s+|\)/)
        if (!consts[label]) {
            consts[label] = {i32, cid: Object.values(consts).length+1, label}
        }
        code = code.replace(c, "")
    })

    if (file.includes("import")) {

        globals = code
            .split(/\n/g)
            .filter(l => l.includes("(global") && l.includes("import"))
            .join("\n")
            .split(/\((global)\s+\$(.*[^\s])\s/g)
            .filter(d => d.includes("self") )
            .map((n) => n.substring(0, n.indexOf(" ")) )
            .map((n) => n.replace(/\"|self\.|\s+/g, "") )
            .filter(Boolean)
    }



    code = code.replaceAll(`this(`, `local(`)
    code = code.replaceAll(`then(`, `(then `)
    code = code.replaceAll(`cmpx(`, `(cmpx `)
    code = code.replaceAll(`else(`, `(else`)
    code = code.replaceAll(`encode(`, `(call $self.encodeText<ext>ext`)
    code = code.replaceAll(`decode(`, `(call $decode<string*>ext `)
    code = code.replaceAll(`construct(`, `(call $self.Reflect.construct<ext>ext`)
    
    new Array(17).fill(1).reverse().forEach( (n,i ) =>  {
        code = code.replaceAll(`(ltee $${i} `, `(local.tee ${i} `)
        code = code.replaceAll(`(ltee $${i})`, `(local.tee ${i})`)
        code = code.replaceAll(`(lset $${i} `, `(local.set ${i} `)
        code = code.replaceAll(`(lset $${i})`, `(local.set ${i})`)
        code = code.replaceAll(` return $${i}`, ` (return (local.get ${i}))`)
        code = code.replaceAll(`local(set $${i} `, `(local.set ${i} `)
    })
    
    code = code.replaceAll(`(lset $`, `(local.set $`)

    let carr = []

    for (let label in consts) {
        carr.push(consts[label])
    }

    for (let {cid, i32, label} of carr.sort((a,b) => b.label.length - a.label.length)) {
        code = code
            .replaceAll("ilk " + label + ")", ` ilk ${cid})`)
            .replaceAll("i32 " + label + ")", ` i32 ${i32})`)
            .replaceAll("const " + label + ")", ` const ${i32})`)
            .replaceAll(label + "§", callifyString(label, true))
            .replaceAll(label + "$", `(i32.const ${cid})`)
            .replaceAll(label + "&", `${i32}`)
            .replaceAll(`(${label})`, `(i32.const ${i32})`)
            .replaceAll(label, ` (i32.const ${i32})`)
    }


    for (let d of code.matchAll(/new\s+self\.Function\(/g)) {
        let frame = getEncosedFrame(d)
        let args = frame.section.split( frame.section.trim().charAt(0) ).map(c => c.trim()).filter(Boolean);
        code = code.replace(
        frame.content, `
        (global.set $temp/array (call $self.Array<>ext)) ${args.map((arg,i) => `
        (call $self.Reflect.set<ext.i32.ext> (global.get $temp/array) (i32.const ${i}) ${callifyString(arg, true)})`).join("            ")}
        (self.Function) (global.get $temp/array)
        (call $self.Reflect.construct<ext2>ext)
        `)
    }

    for (let d of code.matchAll(/\(clss\s+(\$.*[^\s)])\s(\w*[^\)])(\s+(\$\w*)|)\)/g)) {
        let [c, name, alias,, parent = "$RootClass"] = d
        let elem = elems.indexOf(name)

        if (elem === -1) {
            elem += elems.push(name)
        }

        if (!clsss[name]) {
            clsss[name] = { name, alias, parent, size: 0, prop: {}, elem, gets: []}
        }
    }

    for (let d of code.matchAll(/\(clss\s+(\$.*[^\s)])\s(\w*[^\)])(\s+(\$\w*)|)\)/g)) {
        let [c, name, alias,, parent = "$RootClass"] = d

        for (let d2 of code.matchAll(new RegExp(`\\(exec\\\s+\\${name}\\\s`, "g"))) {
            let [ label, $function, enumerable] = getEncosedFrame(d2).section.split( name ).at(1).trim().split(/\s+/).map(v => v.trim())
            
            let fi = elems.indexOf($function);
            if (fi === -1) {
                fi += elems.push($function);
            }
        
            clsss[name].gets.push({
                label, elem: fi, $function, 
                enumerable: (enumerable && 1 || 0)
            })

            code = code.replace(d2[0], ";; " + d2[0].replace("(prop ", "(exec ") )
        }

        for (let d2 of code.matchAll(new RegExp(`\\(prop\\\s+\\${name}\\\s+(.[^ ]*)`, "g"))) {
            if (!clsss[name].prop[d2[1]]) {
                 clsss[name].prop[d2[1]] = {}
            }
        }

        code = code.replace(c, ";; " + c)
    }

    for (let cName in clsss) {
        for (let pName in clsss[cName].prop) {
            for (let {alias, name: iName} of Object.values(clsss)) {

                let str = `${cName} ${pName} *${alias}`;
                let iof = code.indexOf(str);
                if (iof === -1) { continue }
                clsss[cName].prop[pName].class = clsss[iName]
                
                code = 
                    code.substring(0, iof) + 
                    code.substring(iof)
                        .replace(
                            str, 
                            str.replace(`${cName} ${pName} *${alias}`, `${cName} ${pName} ptr`)
                        )
            }
        }
    }

    for (let d of code.matchAll(/\(([A-Z][A-Z0-9_]+)\)/g)) { 
        let [c,TYPE] = d;
        if (!TYPE) { process.exit(1) }
        if (!consts[TYPE] && !TYPES.includes(TYPE)) { TYPES.push(TYPE) }
        code = code.replaceAll(c, ";; " + c.toLowerCase() + " " + TYPES.indexOf(TYPE))
    }

    for (let d of code.matchAll(/\(prop\s+(\$\w*[^\s)])\s(\w*[^\s)])\s+(\w.*|\*|)\)/g)) {
        let [c, clss, prop, type, size] = d

        alias  = clsss[clss].alias
        offset = clsss[clss].size


        if (type.includes(" ")) {

            let [l, r, t] = type.split(" ")

            if (((l === "fun") && r.startsWith("$"))) {                
                let elem = elems.indexOf(r)

                if (elem === -1) {
                    elem += elems.push(r)
                }

                clsss[clss].prop[prop].default = {
                    value: elem, label : r
                }

                type = "fun"
            }
            else if ( consts[r] ) {
                type = l
                clsss[clss].prop[prop].default = {
                    value: consts[r].i32*1, label : r.toLowerCase()
                }
            }
            else {
                if ( t = (r === "*" || consts[r] || (TYPES.includes(r) && TYPES.indexOf(r))) || !(isNaN(r)) && (Number(r)) ) {
                    type = l
                    clsss[clss].prop[prop].default = {
                        value: (t || "*"), label : r.toLowerCase()
                    }
                    if (r === "*") {
                        clsss[clss].prop[prop].default.value = (
                            `(call $${clsss[clss].prop[prop].class.alias}*)`)
                    }
                } else {
                    if (sizeof(r)) { type = r }
                    else if (sizeof(l)) { type = l }
                    else if (sizeof(t)) { type = t }
                    offset= offset*1
                }
            }
        }

        
        code = code.replace(c, ";; " + c)
        size = sizeof(type) 

        Object.assign( clsss[clss].prop[prop], {
            length : size,
            offset: offset,
            isptr : type === "ptr",
            type : type,
        })

        if (offset > clsss[clss].size) {
            clsss[clss].size = offset
        }

        code = code.replace(c, c + ` ;; offset = ${offset} length = ${size}` )


        clsss[clss].size += size 
        
    }

    for (let [c,$1] of code.matchAll(/new\sself\.(\w*)\(\)/g)) {
        code = code.replaceAll(c, `(call $self.Reflect.construct<ext>ext (self.${$1}))`)
    }

    for (let [c,$1] of code.matchAll(/new\sself\.(\w*)\(/g)) {
        code = code.replaceAll(c, `(call $self.Reflect.construct<ext2>ext self.${$1} `)
    }

    for (let d of code.matchAll(/(.[^\s\(]*)\(([^\(\)]\$.[^\s]*)\s(\+|\-|\*|\/)\s(\$.[^\s]*[^\)])\)/g)) {
        let [c, $t, $0, $o, $1] = d.map(b => b.trim())
        let $m = tys($t) + "." + ops($o)

        if (isNaN($0.charAt(1))) { $0 = `(local.get ${$0})` }
        if (isNaN($1.charAt(1))) { $1 = `(local.get ${$1})` }

        code = code.replaceAll(c, `${$0} ${$1} (${$m})` )
    }

    for (let d of code.matchAll(/(.[^\s\(]*)\((|\s)(\$.[^\s]*)\s(\+|\-|\*|\/)\s+/g)) {
        let [c, $t, , $0, $o] = d.map(b => b.trim())
        let $m = tys($t) + "." + ops($o)

        code = code.replaceAll(c, `(${$m} ${$0}` )
    }

    code = code.split("push(").join("(call $self.Reflect.apply<ext3> self.Array.prototype.push ")

    code = code.split("setInt8(").join("(i32.store8 ")
    code = code.split("setUint8(").join("(i32.store8 ")
    code = code.split("setUint16(").join("(i32.store16 ")
    code = code.split("setUint32(").join("(i32.store ")
    code = code.split("setBigUint64(").join("(i64.store ")
    code = code.split("setInt16(").join("(i32.store16 ")
    code = code.split("setInt32(").join("(i32.store ")
    code = code.split("setBigInt64(").join("(i64.store ")
    code = code.split("setFloat32(").join("(f32.store ")
    code = code.split("setFloat64(").join("(f64.store ")

    code = code.split("getInt8(").join("(i32.load8_s ")
    code = code.split("getUint8(").join("(i32.load8_u ")
    code = code.split("getUint16(").join("(i32.load16_u ")
    code = code.split("getUint32(").join("(i32.load ")
    code = code.split("getBigUint64(").join("(i64.load ")
    code = code.split("getInt16(").join("(i32.load16_s ")
    code = code.split("getInt32(").join("(i32.load ")
    code = code.split("getBigInt64(").join("(i64.load ")
    code = code.split("getFloat32(").join("(f32.load ")
    code = code.split("getFloat64(").join("(f64.load ")



    code = code.split("local(ext)").join("(local externref)")
    code = code.split("local(i32)").join("(local i32)")
    code = code.split("local(i32 i32)").join("(local i32 i32)")
    code = code.split("local(i32 ext)").join("(local i32 externref)")
    code = code.split("local(ext ext)").join("(local externref externref)")
    code = code.split("(#document)").join("(global.get $self.document)")
    code = code.split("(memory)").join("(global.get $memory)")
    code = code.split("f32(w/h)").join("(global.get $gl.aspectRatio)")
    code = code.split("(gl.context)").join("(global.get $gl.context)")
    code = code.split("(gl.canvas)").join("(global.get $gl.canvas)")
    code = code.split("(thread)").join("(global.get $thread)")
    code = code.split("(threadType)").join("(global.get $threadType)")
    code = code.split("(window*)").join("(global.get $window*)")
    code = code.split("(wasm*)").join("(global.get $wasm*)")
    code = code.split("(ui*)").join("(global.get $ui*)")
    code = code.split("(ui* ").join("(global.set $ui* ")
    code = code.split("(fs*)").join("(global.get $fs*)")
    code = code.split("(fs* ").join("(global.set $fs* ")
    code = code.split("(window* ").join("(global.set $window* ")
    code = code.split("(wasm* ").join("(global.set $wasm* ")
    code = code.split("(screen*)").join("(global.get $screen*)")
    code = code.split("(scene*)").join("(global.get $scene*)")
    code = code.split("(scene* ").join("(global.set $scene* ")
    code = code.split("(camera*)").join("(global.get $camera*)")
    code = code.split("(camera* ").join("(global.set $camera* ")
    code = code.split("(frustrum*)").join("(global.get $frustrum*)")
    code = code.split("(frustrum* ").join("(global.set $frustrum* ")
    code = code.split("(gl*)").join("(global.get $gl*)")
    code = code.split("(gl* ").join("(global.set $gl* ")
    code = code.split("(screen* ").join("(global.set $screen* ")
    code = code.split("(memory*)*").join("(global.get $memory<*>)")
    code = code.split("(memory*)").join("(global.get $memory*)")
    code = code.split("(memory* ").join("(global.set $memory* ")
    code = code.split("[scope]").join(" (global.get $scope)")
    code = code.split("(scope ").join(" (global.set $scope ")
    code = code.split("memory(buffer)").join(" (global.get $memory<buffer>)")
    code = code.split("memory(Uint8Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Uint8Array>)) (then (global.set $memory<Uint8Array> (call $new<TypedArray> (self.Uint8Array))) (global.get $memory<Uint8Array>)) (else (global.get $memory<Uint8Array>)))")
    code = code.split("memory(Uint16Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Uint16Array>)) (then (global.set $memory<Uint16Array> (call $new<TypedArray> (self.Uint16Array))) (global.get $memory<Uint16Array>)) (else (global.get $memory<Uint16Array>)))")
    code = code.split("memory(Uint32Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Uint32Array>)) (then (global.set $memory<Uint32Array> (call $new<TypedArray> (self.Uint32Array))) (global.get $memory<Uint32Array>)) (else (global.get $memory<Uint32Array>)))")
    code = code.split("memory(BigUint64Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<BigUint64Array>)) (then (global.set $memory<BigUint64Array> (call $new<TypedArray> (self.BigUint64Array))) (global.get $memory<BigUint64Array>)) (else (global.get $memory<BigUint64Array>)))")
    code = code.split("memory(Int8Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Int8Array>)) (then (global.set $memory<Int8Array> (call $new<TypedArray> (self.Int8Array))) (global.get $memory<Int8Array>)) (else (global.get $memory<Int8Array>)))")
    code = code.split("memory(Int16Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Int16Array>)) (then (global.set $memory<Int16Array> (call $new<TypedArray> (self.Int16Array))) (global.get $memory<Int16Array>)) (else (global.get $memory<Int16Array>)))")
    code = code.split("memory(Int32Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Int32Array>)) (then (global.set $memory<Int32Array> (call $new<TypedArray> (self.Int32Array))) (global.get $memory<Int32Array>)) (else (global.get $memory<Int32Array>)))")
    code = code.split("memory(BigInt64Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<BigInt64Array>)) (then (global.set $memory<BigInt64Array> (call $new<TypedArray> (self.BigInt64Array))) (global.get $memory<BigInt64Array>)) (else (global.get $memory<BigInt64Array>)))")
    code = code.split("memory(Float32Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Float32Array>)) (then (global.set $memory<Float32Array> (call $new<TypedArray> (self.Float32Array))) (global.get $memory<Float32Array>)) (else (global.get $memory<Float32Array>)))")
    code = code.split("memory(Float64Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Float64Array>)) (then (global.set $memory<Float64Array> (call $new<TypedArray> (self.Float64Array))) (global.get $memory<Float64Array>)) (else (global.get $memory<Float64Array>)))")
    code = code.split("memory(Uint8Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Uint8Array>)) (then (global.set $memory<Uint8Array> (call $new<TypedArray> (self.Uint8Array))) (global.get $memory<Uint8Array>)) (else (global.get $memory<Uint8Array>)))")
    code = code.split("memory(Int32Array)").join("(if (type $->ext) (ref.is_null (global.get $memory<Int32Array>)) (then (global.set $memory<Int32Array> (call $new<TypedArray> (self.Int32Array))) (global.get $memory<Int32Array>)) (else (global.get $memory<Int32Array>)))")

    loop = 10

    code = code.replaceAll("@0", "(local.get 0)@")
    code = code.replaceAll("]#", "] (table.get $ext)")
    code = simdlooper(code);

    for (let m of code.matchAll(/\[\s+\'(\w+)\'\s+(\w{2,5})\s\]\s+\!\=(.[^\]]*)/g)) {
        code = code.replaceAll(m[0], ` ${globalizeString(m.at(1))} (call $self.Reflect.get<ext2>${realtype(m[2])}) ${m[3]} (i32.ne)`)
    }

    for (let m of code.matchAll(/\[\s+\'(\w+)\'\s+(\w{2,5})\s\]\s+\=\=(.[^\]]*)/g)) {
        code = code.replaceAll(m[0], ` ${globalizeString(m.at(1))} (call $self.Reflect.get<ext2>${realtype(m[2])}) ${m[3]} (i32.eq)`)
    }

    
    for (let m of code.matchAll(/\[\s+\'(\w+)\'\s+(\w{2,5})\s\]/g)) {
        code = code.replaceAll(m[0], ` ${globalizeString(m.at(1))} (call $self.Reflect.get<ext2>${realtype(m[2])})`)
    }
    


    

    while(loop-- > 0) {
        "f_e,e_f,V128,U8,TE,DA,TF,?!,?#,?0,?=,Lw,Le,L,l,^,w,e,A,i,:,@,*,D,~,F,C,f,B,ƒƒ,b,ƒ,#,§,√,µ,J,π,&".split(",").forEach( s => {
            ipos = -1
            "),$0,$1,$2,$3,$4".split(",").forEach( (n, tti) => {
                m = `${n}${s}`
                while ( -1 !== (ipos = code.indexOf(m, ipos+1)) ) {
                    
                    if (tti > 0) {
                        switch (s) {
                            case "&" :
                                code = code.replaceAll(m, n + " (i32.const 4) (i32.mul) (global.get $byteOffset.offset) (i32.add) (i32.load)");
                            break;
                        }
                    } else {
                        if (["&"].includes(s)) { continue } 
                    }

                    switch (s) {
                        case "J" : code = code.replaceAll(m, n + " (call $self.JSON.parse<ext>ext)"); continue;
                        case "?!" : code = code.replaceAll(m, n + " (ref.is_null)"); continue;
                        case "?0" : code = code.replaceAll(m, n + " (i32.eqz)"); continue;
                        case "?=" : code = code.replaceAll(m, n + " (i32.eq)"); continue;
                        case "*" : code = code.replaceAll(m, n + " (call $ptr<*>)"); continue;
                        case "D" : code = code.replaceAll(m, n + " (call $self.Number<i32>ext)"); continue;
                        case "i" : code = code.replaceAll(m, n + " (call $self.Number<ext>i32)"); continue;
                        case "Lw": code = code.replaceAll(m, n + " (call $self.console.warn)"); continue;
                        case "Le": code = code.replaceAll(m, n + " (call $self.console.error)"); continue;
                        case "L" : code = code.replaceAll(m, n + " (call $self.console.log)"); continue;
                        case "l" : code = code.replaceAll(m, n + " (call $self.console.log)"); continue;
                        case "~" : code = code.replaceAll(m, n + " (call $get<*>classi)"); continue;
                        case "µ" : code = code.replaceAll(m, n + ` (global.set $i) (if (type $->ext) (global.get $i) (then (global.set $# (call $self.Reflect.construct<ext2>ext (global.get $self.Date) (call $self.Array.of<f64>ext (f64.add (call $get<memory*>instantiateTime (global.get $memory*)) (f64.convert_i32_u (global.get $i)))))) (call $self.Reflect.setPrototypeOf<ext2> (global.get $#) (call $self.Reflect.construct<ext2>ext (global.get $self.Number) (call $self.Array.of<i32>ext (global.get $i)))) (global.get $#)) (else (call $self.Number<i32>ext (i32.const 0)) ))`); continue;
                        case "π" : code = code.replaceAll(m, n + ` (global.set $f) (if (type $->ext) (f32.ne (f32.const 0) (global.get $f)) (then (global.set $# (call $self.Reflect.construct<ext2>ext (global.get $self.Date) (call $self.Array.of<f32>ext (global.get $f)))) (call $self.Reflect.setPrototypeOf<ext2> (global.get $#) (call $self.Reflect.construct<ext2>ext (global.get $self.Number) (call $self.Array.of<f32>ext (global.get $f)))) (global.get $#)) (else (call $self.Number<i32>ext (i32.const 0)) ))`); continue;
                        case "@" : code = code.replaceAll(m, n + " (call $get<*>offset)"); continue;
                        case "^" : code = code.replaceAll(m, n + " (call $get<*>parent)"); continue;
                        case "f_e" : code = code.replaceAll(m, n + "(call $self.eval<fun>ext)"); continue;
                        case "e_f" : code = code.replaceAll(m, n + "(call $self.eval<ext>fun)"); continue;
                        case "#" : code = code.replaceAll(m, n + " (global.set $i) (if (type $->ext) (global.get $i) (then (return (table.get $ext (global.get $i)))) (else (return (ref.null extern))))"); continue;
                        case "ƒ" : code = code.replaceAll(m, n + " (global.set $i) (if (type $->ext) (global.get $i) (then (return (call $self.eval<fun>ext (table.get $fun (global.get $i))))) (else (return (ref.null extern))))"); continue;
                        case ";" : code = code.replaceAll(m, n + " (drop)"); continue;
                        case "ƒƒ" : code = code.replaceAll(m, n + " (call_indirect (type $i32->ext))"); continue;
                        case "DA" : code = code.replaceAll(m, n + " (call $self.Array.of<i32>ext)"); continue;
                        case "A" : code = code.replaceAll(m, n + " (call $self.Array.of<ext>ext)"); continue;
                        case "F" : code = code.replaceAll(m, n + " (call $self.Number<f64>ext)"); continue;
                        case "√" : code = code.replaceAll(m, n + " (call $self.Boolean<i32>ext)"); continue;
                        case "§" : code = code.replaceAll(m, n + " (call $get<ilk>ext)"); continue;
                        case "C" : code = code.replaceAll(m, n + " (call $get<const>ext)"); continue;
                        case "f" : code = code.replaceAll(m, n + " (call $self.Number<f32>ext)"); continue;
                        case "B" : code = code.replaceAll(m, n + " (call $self.Number<i64>ext)"); continue;
                        case "U8" : code = code.replaceAll(m, n + " (i32.load8_u)"); continue;
                        case "V128" : code = code.replaceAll(m, n + " (v128.load)"); continue;                        
                    }
        
                    if (!loop--) { process.exit(1 * !console.error("MAX_LOOP_EXCEED", s)) }
                }
            })
        })
    }     

    for (let [c,$1,$2] of code.matchAll(/\((\-?\d+\.?\d+?)\sdeg\)/g)) {
        code = code.replaceAll(c, `(${$1 * Math.PI / 180})`)
    }

    for (let [c,$1,$2] of code.matchAll(/(sin|cos|tan|atan)\((\-?\d+\.?\d+)\)/g)) {
        code = code.replaceAll(c, `(f32.const ${Math[$1]($2)})`)
    }

    for (let d of code.matchAll(/(f32|i32|i64|i16|u32|f64)\((\-?\d+\.?\d+?)\s(\*|\+|\-|\/)\s(.*?\))/g)) {
        let [c,type,val,op,rest] = d
        let m = getEncosedFrame(d)
        rest = m.section.substr(m.section.indexOf( rest ))
        code = code.replaceAll(m.content, `(${realtype(type)}.${ops(op)} (${realtype(type)}.const ${val}) ${rest})`)
    }

    for (let [c,$1,$2] of code.matchAll(/f32x4\(set\s+f32\((\d+\.\d+)\)\s+(.*\))/g)) {
        code = code.replaceAll(c, `(v128.store i32(${$1}) (v128.const f32x4 ${$2})`)
    }

    for (let [c,$1,$2] of code.matchAll(/i32x4\(set\s+i32\((\d+)\)\s+(.*\))/g)) {
        code = code.replaceAll(c, `(v128.store i32(${$1}) (v128.const i32x4 ${$2})`)
    }

    for (let [c,$1,$2] of code.matchAll(/i32x1\(set\s+i32\((\d+)\)\s+(.*\))/g)) {
        code = code.replaceAll(c, `(i32.store i32(${$1}) (i32.const ${$2})`)
    }

    for (let [c,$1,$2] of code.matchAll(/i8x16\(set\s+i32\((\d+)\)\s+(.*\))/g)) {
        code = code.replaceAll(c, `(v128.store i32(${$1}) (v128.const i8x16 ${$2})`)
    }

    // t(n) -> (t.const n) 
    code = code.replaceAll(/([i|f|u]\d{1,2})\((-??\d{1,}\.??\d*)\)/g, `($1.const $2)`)
    // t($n) -> (t.load (local.get n)) 
    code = code.replaceAll(/([i|f|u]\d{1,2})\(\$(\d{1,2})\)/g, (g,t,n) => `(${reader(t)} (local.get ${n}))`)
    // [  ]. -> [].
    code = code.replaceAll(/(\s+|\n+|\t+)\./g,".")
    

    for (let g of code.matchAll(/(self\.([A-Z][\w*\.]+)\(((\w|\W*[^\.then])+)\)\.then\((.*[^\)])\))+/g)) {
        
        //console.log([ g[2], g[3].split(", ").map(v=>v.trim()), g[5], g[1], g.index ])
        vars = g[3].split(",").map( v => !v.match(/\$|\(/) && `(${v.trim()})` || v.trim())
        vlen = vars.length-1 && vars.length || ""
        
        code = code.replaceAll( 
        g[1], 
        `(call $self.Reflect.apply<ext3>
            (self.Promise.prototype.then)
            (call $self.Reflect.apply<ext3>ext
                (self.${g[2]})
                (self.${g[2].split('.').reverse().slice(1).reverse().join(".")})
                (call $self.Array.of<ext${vlen}>ext
                    ${vars.join(' ')}
                )
            )
            call($self.Array.of<fun>ext
                ref($${g[5].trim()})
            )
        )`
        )
    }

    
    code = code.replaceAll(/\.to\((\w*)\,\s(\d+)\,\s(\d+)\)/g, `(global.set $#) (call $self.Reflect.construct<ext2>ext (global.get $self.$1) (call $self.Array.of<ext.i32x2>ext (global.get $#) (i32.const $2) (i32.const $3)))`)
    code = code.replaceAll(/\.to\((\w*)\)/g, `(global.set $#) (call $self.Reflect.construct<ext2>ext (global.get $self.$1) (call $self.Array.of<ext>ext (global.get $#)))`)
    code = code.replaceAll(/\.at\((\d+)\)/g, `(i32.const $1) (call $self.Reflect.get<ext.i32>i32)`)

    for (let [c,$1] of code.matchAll(/\.load\((u8|i8|i32|v128|i16|u16|u32|i64|u64|f32|f64|i8x16|i32x4|i16x8)\)/g)) {
        code = code.replaceAll(c, `(${reader($1)})`)
    }
    

    for (let [c] of code.matchAll(/\)\[\'(.*?)\'\]\si32/g)) {
        code = code.replaceAll(c, `) String("${c.substring(3, c.length-6)}") (call $self.Reflect.get<ext2>ext) (call $self.Number.from<ext>i32) `)
    }



    for (let [c] of code.matchAll(/\)\[\'.*?\'\]/g)) {
        code = code.replaceAll(c, `) String("${c.substring(3, c.length-2)}") (call $self.Reflect.get<ext2>ext) `)
    }

    for (let d of code.matchAll(/new\s+String\(\s?\"(.*?)\"\s?\)/g)) {
        let [c, string] = d
        code = code.replaceAll(c, `(call $wasm.externString ${callifyString(string, true)})`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+\*string\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $wasm.externString (call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)}))`)
    }


    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+\*dataURL\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $wasm.externDataURL (call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)}))`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+\*buffer\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $wasm.externBuffer (call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)}))`)
    }


    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+\$ext\-\>i32\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(table.grow $ext (call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)}) (i32.const 1))`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+(ext)\s+(i32)\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(table.grow $ext (call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)}) (i32.const 1))`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+(ext)\s+(f32)\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(table.grow $ext (call $self.Reflect.get<ext2>f32 (local.get ${$local}) ${globalizeString($key)}) (i32.const 1))`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+(f64)\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $self.Reflect.get<ext2>f64 (local.get ${$local}) ${globalizeString($key)})`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+(f32)\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $self.Reflect.get<ext2>f32 (local.get ${$local}) ${globalizeString($key)})`)
    }

    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+(i32)\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $self.Reflect.get<ext2>i32 (local.get ${$local}) ${globalizeString($key)})`)
    }
    
    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+(ext)\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)})`)
    }
    
    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\'(.*?)\'\s+\]/g)) {
        let [c, $local, $key] = d
        code = code.replaceAll(c, `(call $self.Reflect.get<ext2>ext (local.get ${$local}) ${globalizeString($key)})`)
    }
    
    for (let d of code.matchAll(/\[\s+\$(\d+)\s+\]/g)) {
        let [c, local$i ] = d
        //let type = findFunctionAndArgumentsType( d.index ).args[ local$i ]
        //console.log(findFunctionAndArgumentsType( d.index ), local$i)
        //code = code.replaceAll(c, ` (call $self.Array.of<${type}>ext (local.get ${local$i}))`)
    }

    for (let d of code.matchAll(/param\((\d+)\)/g)) {
        let [c,$0] = d
        code = code.replaceAll(c, ` (call $get<stack*>arg${$0} (call $get<event*>param local(0))) `)
    }
    
    for (let d of code.matchAll(/result\((\d+)\)/g)) {
        let [c,$0] = d
        code = code.replaceAll(c, ` (call $get<stack*>arg${$0} (call $get<event*>result local(0))) `)
    }
    
    for (let [c] of code.matchAll(/\)\.\w*\si32/g)) {
        code = code.replaceAll(c, `) String("${c.substring(2, c.length-5)}") (call $self.Reflect.get<ext2>ext) (call $self.Number.from<ext>i32)`)
    }
    
    
    for (let [c] of code.matchAll(/\)\[\s\d+\s]\si32/g)) {
        code = code.replaceAll(c, `) (i32.const ${c.substring(3, c.indexOf("]")).trim()}) (call $self.Reflect.get<ext.i32>i32)`)
    }
    
    for (let [c] of code.matchAll(/\)\[\s\d+\s]/g)) {
        code = code.replaceAll(c, `) (i32.const ${c.substring(3, c.indexOf("]")).trim()}) (call $self.Reflect.get<ext.i32>ext) `)
    }
    
    for (let c of code.matchAll(/\s\d+\.\)/g)) {
        code = code.replaceAll(c[0], ` local(${c[0].substring(0, c[0].indexOf("."))}))`)
    }
    
    for (let c of code.matchAll(/\s\d+\.\s/g)) {
        code = code.replaceAll(c[0], ` local(${c[0].substring(0, c[0].indexOf("."))}) `)
    }
       


    

    code = code.split("clock(f64)" ).join("call($self.Date.now<>f64)" )
    code = code.split("now(i32)" ).join("(i32.trunc_f32_u now(f32))" )
    code = code.split("now(i64)" ).join("(i64.trunc_f64_u now(f64))" )
    code = code.split("now(f64)" ).join("[*memory (global.get $memory*) instantiateTime] (f64.promote_f32 now(f32)) (f64.add)" )
    code = code.split("now(f32)" ).join("[*memory (global.get $memory*) performanceNow]" )
    
    code = code.split("set[](").join("call($self.Reflect.set<ext.i32.ext> ")
    code = code.split("delete(").join("call($self.Reflect.deleteProperty<ext2> ")
    code = code.split("table(add self" ).join("table(add $ext self" )

    code = code.split("['']").join("call($Array.of<''>)")
    code = code.split("[]").join("(call $self.Array<>ext)")
    
    code = code.split("(self)").join("(global.get $self)")

    code = code.split("table(add '" ).join("table(add $ext '" )
    code = code.split("(tset " ).join("(table.set " )
    code = code.split("table(grow)" ).join("table(grow $ext)" )
    code = code.split("export(" ).join("(table.get $ext " )
    code = code.split("eval(").join("Function(")
    code = code.split("init($").join("(call $init.")
    code = code.split("work($").join("(call $work.")
    code = code.split("task($").join("(call $task.")
    code = code.split("loop($").join("(call $loop.")
    code = code.replaceAll("bind(", `(call $self.Reflect.apply<ext.fun.ext>ext (self.Function.prototype.bind) `)
    code = code.replaceAll("addEventListener(", "(call $self.Reflect.apply<ext3> (self.addEventListener) ")
    code = code.replaceAll("apply(", "(call $self.Reflect.apply<ext3> ")
    code = code.replaceAll("(apply", "(call $self.Reflect.apply<ext3> ")
    code = code.replaceAll("byteOffset($", "(global.get $byteOffset.")

    wasm = wasm + `\n;;${file}\n`

    while (mc = code.match(/func\(\$.*?\)/i)){

        code = 
            code.substring( 0, mc.index ) + 
                `(table.get $fun ${mc[0].replace("func($","elem($")})` + 
            code.substring(mc.index + mc[0].length)
    }    
    
    code = code.replaceAll("func(","elem($func.")

    wasm = wasm + elemfix(code)

})

defines = ""


let stri;

stri = -1
while ( -1 !== (stri = wasm.indexOf("```")) ) {
    wasm = wasm.substring(0, stri) + 
        stringify(
            wasm.substring(
                stri+3,
                wasm.indexOf("```", stri + 3)
            )
        ) + '\n\t\t\t(call $wasm.externString)' + 
        wasm.substring( wasm.indexOf("```", stri + 3) + 3 )
}



let loopi = 0
for (let g of wasm.matchAll(/\(while(?:(?:\s(\-\-|\+\+))|\s)(\$[a-zA-Z0-9_]+)(?:([\-|\+]+)|\s?(.[^\( ]*)\s?([\-]?[0-9]+)|[^\(])/g)) {
    
    let [ local, op, num = "1", calcin ] = g.slice(1).filter(Boolean)
    
    if  (op.startsWith("$") && local.match(/\-|\+/)) { 
        [ local, op, num ] = [ op, local[0] + "=", "1" ]
    }

    [ op, calcin, num ] = [ op[0], op[1] === "=", num * 1 ]

    const frame = getEncosedFrame( g );
    const code = frame.content.substring(g[0].length, frame.content.lastIndexOf(")"));
    const name = `$do${loopi++}..`
    const calc = ``;

    const intest = (
            `${code.trim()}
            (br_if ${name} (local.tee ${local} (i32.${ops(op)} (local.get ${local}) (i32.const ${num}))))`)

    const testout = (
           `(local.set ${local} (i32.${ops(op)} (local.get ${local}) (i32.const ${num})))
            ${code.trim()}
            (br_if ${name} (local.get ${local}))`)


    const loop = (`
        (loop ${name}
            ${calcin && intest || testout}
        )`)

    wasm = wasm.replace( frame.content, loop )
}


for (let g of wasm.matchAll(/\(global\s+\$([^ ].*?)[\s](.*)(i32|ext)\)/g)) {
    wasm = wasm.replaceAll(` ${g[1]} ` , `(${g[1]}) `)
    wasm = wasm.replaceAll(`(${g[1]})` , `(global.get $${g[1]})`)
    wasm = wasm.replaceAll(`(${g[1]} =`, `(global.set $${g[1]} `)
}


const $global = {}


for (let d of wasm.matchAll(/\s\'(.*?)\'\#/g)) {
    let [c, s] = d
    wasm = wasm.replaceAll(c, " " + globalizeString(s))
}

variablefix = ($k, type) => {
    if ($k === "CURRENT_TICK") {
        return `(i32.load (i32.const ${clsss['$Memory'].prop.tickCount.offset}))`
    }

    if ($k === "CURRENT_FRAME") {
        return `(i32.load (i32.const ${clsss['$Memory'].prop.tickCountFrame.offset}))`
    }

    if (realtype[ $k.substring(0,3) ]) {
        return $k
    }

    switch ($k) {
        case "true": return "(i32.const 1)"
        case "false": return "(i32.const 0)"
        case "null": return "(ref.null extern)"
    }

    switch (true) {
        case $k.startsWith("self."):
            $k = `(call $import/${importtype(type)} (${$k}))`
        break

        case $k.startsWith("task."):
            $k = `(call $${$k})`
        break
    }

    if (!isNaN($k)) {
        if ($k < 17) {
            $k = "$" + $k 
        } else {
            $k = `(i32.const ${$k})`
        }
    }

    if ($k.startsWith("local(")) {
        if (!isNaN($k.substring(6, 7))) {
            $k = "$" + $k.substring(6, $k.length-1)
        }
    }

    if ($k.startsWith("$") && !$k.match(/\(|\)|\s/i)) {
        $k = `local(${$k})`
    }

    if ($k.startsWith("local")) {
        if (!isNaN(l = $k.substring(7, $k.length-1))) {
            $k = "$" + l
        }
    }

    return $k
}

/**
        <*buffer $buffer* byteOffset>
        <*buffer global($buffer*) byteOffset>
        <*buffer local($buffer*) byteOffset>
        <*buffer local(1) byteOffset>
        <*buffer local($count ++) byteOffset>
        <*buffer global(-- $i) byteOffset>
        <*buffer 0 byteOffset>
        <*buffer $1 byteOffset>
        <*buffer i32(get i32(2)) byteOffset>

        <*buffer $buffer* byteOffset $1>
        <*buffer $buffer* byteOffset $byteOffset>
        <*buffer $buffer* byteOffset local(1)>
        <*buffer $buffer* byteOffset global($i)>
        <*buffer $buffer* byteOffset $i*>
        <*buffer $buffer* byteOffset 2>
        <*buffer $buffer* byteOffset i32( $1 + $2 )>

*/
__OffsetGetter__$0      = ( $0 ) => { return `(i32.load (i32.add global($byteOffset.offset) (i32.mul ${variablefix($0)} (i32.const 4))))`; }
__OffsetGetter__$0at    = ( $0, at ) => { return (at && `(i32.add (i32.const ${at}) ${__OffsetGetter__$0($0)})` || __OffsetGetter__$0($0)); }
__OffsetGetter__$0at$offset    = ( $0, at, $offset ) => { return (at && `(i32.add (i32.const ${at}) ${$offset})` || $offset); }
__ReadCall__$0AtType    = ( $0, at, TYPE ) => { return `(${reader(TYPE)} ${__OffsetGetter__$0at($0, at)})`; }
__ReadCall__Parent$0    = ( $0 ) => { return `(i32.load (i32.add (global.get $byteOffset.parent) (i32.mul ${$0} (i32.const 4))))`; }
__WriteCall__Parent$0$1 = ( $0, $1 ) => { return `(i32.store (i32.add (global.get $byteOffset.parent) (i32.mul ${$0} (i32.const 4))) ${$1})`; }
__WriteCall__$0AtType$1 = ( $0, at, TYPE, $1 ) => { return `(${writer(TYPE)} ${__OffsetGetter__$0at($0, at)} ${variablefix($1, TYPE)})`; }
__WriteCall__$0AtType$1$offset = ( $0, at, TYPE, $1, $offset ) => { return `(${writer(TYPE)} ${__OffsetGetter__$0at$offset($0, at, $offset)} ${variablefix($1, TYPE)})`; }
__PallocCall__ElemSize  = ( elem, size ) => { return `

        (i32.atomic.rmw.add
            (i32.const ${consts.OFFSET_MEMORY_PTRCOUNT.i32}) 
            (i32.const 1)
        )
        (global.set $|0)

        (i32.store8
            (i32.add
                (global.get $byteOffset.classi)
                (global.get $|0)
            )
            (i32.const ${elem})
        )    

        (i32.store
            (i32.add 
                (global.get $byteOffset.offset)
                (i32.mul 
                    (global.get $|0) 
                    (i32.const 4)
                )
            )
            (i32.atomic.rmw.add
                (i32.const ${consts.OFFSET_MEMORY_BYTELENGTH.i32})
                (i32.const ${size})
            )
        )

        (global.get $|0)`; 
}
__PallocCall__ElemSize$i$ptr$offset  = ( elem, size, local$i, local$ptr, local$offset ) => {
    return `
        (i32.atomic.rmw.add
            (i32.const ${consts.OFFSET_MEMORY_PTRCOUNT.i32}) 
            (i32.const 1)
        )
        (local.set ${local$i})

        (i32.add 
            (global.get $byteOffset.offset)
            (i32.mul 
                (local.get ${local$i}) 
                (i32.const 4)
            )
        )
        (local.set ${local$ptr})

        (i32.atomic.rmw.add
            (i32.const ${consts.OFFSET_MEMORY_BYTELENGTH.i32})
            (i32.const ${size})
        )
        (local.set ${local$offset})

        (if (i32.rem_u (local.get ${local$offset}) (i32.const 8))
            (then (unreachable))
        )

        (i32.store8
            (i32.add
                (global.get $byteOffset.classi)
                (local.get ${local$i})
            )
            (i32.const ${elem})
        )

        (i32.store
            (local.get ${local$ptr})
            (local.get ${local$offset})
        )`; 
}

simdify = ( data = {}, name = "clss" ) => {

    let keys = Object.keys(data);
    let types = keys.map(k => simdtype(clsss[name].prop[k].type));
    let offsets = keys.map(k => clsss[name].prop[k].offset);

    let simd = "";
    let simded = []

    console.log(keys)
    console.log(types)
    console.log(offsets)

    for (let i in offsets) {
        if ((offsets[i] + 8) === offsets[+i + 1]) {
            if (types.slice(i, +i+2).lastIndexOf(types[i]) === 1) {
                if (sizeof(types[i].substr(0,3)) === 8) {
//                        console.log("simd block 8x2", "i:", i, offsets[i], offsets[+i + 1], types.slice(i, +i+2) )
                    console.log(`(v128.store (i32.const ${i}) (v128.const ${types[i]} %${i} %${(+i)+1}))`)

                }
            }

        }

        if ((offsets[i] + 12) === offsets[+i + 3]) {
            if (types.slice(i, +i + 4).lastIndexOf(types[i]) === 3) {
                if (sizeof(types[i].substr(0,3)) === 4) {
                    //console.log("simd block 4x4", "i:", i, offsets[i], offsets[+i + 3], types.slice(i, +i+4))
                    console.log(simd = `(v128.store (i32.const ${i}) (v128.const ${types[i]} %${i} %${(+i)+1} %${(+i)+2} %${(+i)+3}))`)
                    simded.push(...[ +i, +i + 1, +i + 2, +i + 3 ])
                }
            }
        }
        
        if ((offsets[i] + 14) === offsets[+i + 7]) {
            if (types.slice(i, +i+8).lastIndexOf(types[i]) === 7) {
                if (sizeof(types[i].substr(0,3)) === 2) {
                    //console.log("simd block 2x8", "i:", i, offsets[i], offsets[+i + 7], types.slice(i, +i+8))
                    console.log(`(v128.store (i32.const ${i}) (v128.const ${types[i]} %${i} %${(+i)+1} %${(+i)+2} %${(+i)+3} %${(+i)+4} %${(+i)+5} %${(+i)+6} %${(+i)+7} ))`)
                }
            }
        }

        if ((offsets[i] + 15) === offsets[+i + 15]) {
            if (types.slice(i, +i+16).lastIndexOf(types[i]) === 15) {
                if (sizeof(types[i].substr(0,3)) === 1) {
//                        console.log("simd block 1x16", "i:", i, offsets[i], offsets[+i + 15], types.slice(i, +i+16))
                      console.log(`(v128.store (i32.const ${i}) (v128.const ${types[i]} %${i} %${(+i)+1} %${(+i)+2} %${(+i)+3} %${(+i)+4} %${(+i)+5} %${(+i)+6} %${(+i)+7} %${(+i)+8} %${(+i)+9} %${(+i)+10} %${(+i)+11} %${(+i)+12} %${(+i)+13} %${(+i)+14} %${(+i)+15} ))`)
                }
            }
        }
    }

    Object.values(data).forEach((v,i) => {
        simd = simd.replace("%"+i, v)
    })

    return simd
} 




const regex = {
    [ '[vtype|][ ][$|][name][=][new][ ][Object]' ] : /([let|const|var]+|)[|\s+](.*)\=(\s+|)new[\s+](.[^\(]*)/g,
    [ '[new][ ][Object]' ] : /new[\s+](.[^\(]*)/g,
    [ '(["][name]["][:][.*][,])+' ] : /(([\"](.[^:]*)[\"])[\s+\:\s+](.*)[,|])+/g,
    [ '["][name]["]' ] : /[\"](.[^"]*)\"/,
    [ '[:][.*][,]' ] : /\:[\s+|](.[^,]*)\,/
}

Reflect.defineProperty(regex, "var_new_Object", { value: regex['[vtype|][ ][$|][name][=][new][ ][Object]'] })
Reflect.defineProperty(regex, "new_Object", { value: regex['[new][ ][Object]'] })
Reflect.defineProperty(regex, "json_data_text",  { value: regex['(["][name]["][:][.*][,])+'] })
Reflect.defineProperty(regex, "json_attrib_name",  { value: regex['["][name]["]'] })
Reflect.defineProperty(regex, "json_attrib_value",  { value: regex['[:][.*][,]'] })

let new_Objects = []
for (let regx of  [ regex.new_Object, regex.var_new_Object ]) {
    for (let m of  wasm.matchAll( regx )) {
        [ cName, vName, vType ] = [ 
            ...m.slice(1)
                .map(c => c.trim()).reverse()
                .filter(Boolean)
                .flatMap(n=> n.split(" ")
                .reverse())
            , "var" 
        ].slice(0, 3)

        let frame = getEncosedFrame( m, [ "(", ")" ] )
        let attrs = frame
            .section
                ?.match( regex.json_data_text )
                ?.map( l => {
                    return {
                        name : l.match(regex.json_attrib_name)?.at(1),
                        value : l.match(regex.json_attrib_value)?.at(1)
                    }}
                )

        new_Objects.push({ 
            cName, class: clsss["$"+cName], 
            vName, vType, 
            attrs, 
            frame
        })
    }
}

new_Objects.reverse().forEach(o => {

    let code = `(block $${o.class.alias}* (type $->i32)
            
                (global.set $resv/0 (global.get $temp/0))
                (global.set $resv/1 (global.get $temp/1))

                (call $${o.class.alias}*)     
                (global.set $temp/0)

                ${g = __OffsetGetter__$0("global($temp/0)")}
                (global.set $temp/1)
                ${(o.attrs?.map((attr,j) => { return (p = o.class.prop[attr.name]) && (
                `${__WriteCall__$0AtType$1("global($temp/0)", p.offset, p.type, attr.value)}            
                `.replaceAll(g, "global($temp/1)")) || "" }) || []).join("").trimEnd()}

                (global.get $temp/0)

                (global.set $temp/0 (global.get $resv/0))
                (global.set $temp/1 (global.get $resv/1))

                (br $${o.class.alias}*) 
            )
        `;

    wasm = wasm.replace(o.frame.content, code)

})

let reps$a_$0 = []
for (let name in clsss) {
    let {size, elem, alias, parent} = clsss[name]

    size = 
    Math.max(clsss[name].size, 8)

    if (size % 8) {
        size += 8 - (size % 8)
    }
    clsss[name].size = size

    setters = ""
    getters = ""


    for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\sparent\*\\]`, "g"))) {
        let [c, $0, $1] = de;
        wasm = wasm.replaceAll(c, (__ReadCall__Parent$0($0)))
    }
    
    for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\sparent\\]`, "g"))) {
        let [c, $0, $1] = de;
        wasm = wasm.replaceAll(c, (__ReadCall__Parent$0($0)))
    }
    
    for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\sparent\\\s(.*)\\]`, "g"))) {
        let [c, $0, $1] = de;
        wasm = wasm.replaceAll(c, (__WriteCall__Parent$0$1($0, $1)))
    }
    
    let d;

    let $Function = "";

    //is predefined ? -->
    if (wasm.match(new RegExp(`\\(func\\\s+\\${name}\\s+`))) {
        $Function = `(call ${name} (local.get $i*))`
    } else {
        $Function = `(local.get $i*)`
    }
    
    getters = `
    (func $${alias}*            (type $->i32)
        (local $i* i32)
        (local $ptri i32)
        (local $offset i32)

        ${__PallocCall__ElemSize$i$ptr$offset(elem, size, "$i*", "$ptri", "$offset")}
        %(__PropClass$__)

        ${$Function}

    ) ;; end func ${alias}
`



    getters = `${getters}\n\t(elem (i32.const ${elem}) funcref (ref.func $class.${name.substring(1)}))\n`;

    let clssdef = (
    `
    (func   $class.${name.substr(1)}
        (type $->ext)
        (local $ext externref)
        (if (ref.is_null (local.tee $ext (table.get $ext (i32.const ${elem}))))
            (then
                
                (call $self.Reflect.apply<ext3>ext
                    (call $self.Function<ext>ext
                        (call $self.Reflect.apply<ext3>ext
                            (self.String.prototype.replace)
                            ${callifyString('return (class $ extends this {})')}
                            (call $self.Array.of<ext2>ext 
                                ${callifyString('$')} 
                                ${callifyString(name.substring(1), true)}
                            )
                        )
                    )
                    (call $class.${parent.substr(1)})
                    call($self.Array<>ext)
                )            
                (local.set $ext)
                (table.set $ext (i32.const ${elem}) (local.get $ext))

                (call $self.Reflect.get<ext2>ext (local.get $ext) ${callifyString('prototype')})
                (global.set $temp/prototype)

                ;; PROPDEFS
            )
        )
        (local.get $ext)
    )
    `
    )


    for (let prop in clsss[name].prop) {

        let {offset, type} = clsss[name].prop[prop]
        let propcls = clsss[name].prop[prop].class; 
        let pdefalt = clsss[name].prop[prop].default; 

        if (propcls && pdefalt) {

            if ( !isNaN(pdefalt.value) ) { 
                pdefalt = `(i32.const ${parseInt(pdefalt.value)})` 
            } else {
                pdefalt = pdefalt.value 
            }

            getters = getters.replace(`%(__PropClass$__)`, `%(__PropClass$__)
        ${__WriteCall__$0AtType$1$offset("$0", offset, type, pdefalt, `local($offset)`)}`)
        }
        else if (pdefalt) {
            switch (pdefalt.label) {
                
                case "current_frame":
                getters = getters.replace(`%(__PropClass$__)`, `%(__PropClass$__)
        ${__WriteCall__$0AtType$1$offset("$0", offset, type, `(i32.load (i32.const ${clsss['$Memory'].prop.tickCountFrame.offset}))`, `local($offset)`)} ;; ${pdefalt.label}`)
                break;
                
                case "current_tick":
                getters = getters.replace(`%(__PropClass$__)`, `%(__PropClass$__)
        ${__WriteCall__$0AtType$1$offset("$0", offset, type, `(i32.load (i32.const ${clsss['$Memory'].prop.tickCount.offset}))`, `local($offset)`)} ;; ${pdefalt.label}`)
                break;

                default:
                getters = getters.replace(`%(__PropClass$__)`, `%(__PropClass$__)
        ${__WriteCall__$0AtType$1$offset("$0", offset, type, `(${realtype(type)}.const ${pdefalt.value})`, `local($offset)`)} ;; ${pdefalt.label}`)
                break;

            }
         }

        wasm = wasm.replaceAll(`offset(${name} ${prop})`, `(i32.const ${offset})`)

        
        for (let d of wasm.matchAll(new RegExp(`\\(cmpx\\\s\\${name}\\\s+${prop}\\\s(.*)\\)`, "g"))) {
            let [$0, cmp, chg] = d[1].split(" ")
            let cmpxchg = `(i32.eq ${cmp} (i32.atomic.rmw.cmpxchg ${__OffsetGetter__$0at($0, offset)} ${cmp} ${chg}))`;
            wasm = wasm.replaceAll(d[0], cmpxchg)
        }

        for (let de of wasm.matchAll(new RegExp(`--\\\s\\[\\*${alias}\\\s(.*)\\\s${prop}\\]`, "g"))) {
            let [c, $0] = de;
            wasm = wasm.replaceAll(c, `(${writerAtomicGet(type)} ${__OffsetGetter__$0at($0, offset)}) (drop (${writerAtomicAdd(type)} ${__OffsetGetter__$0at($0, offset)} (i32.const 1)))`)
        }

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\]\\\s--`, "g"))) {
            let [c, $0] = de;
            wasm = wasm.replaceAll(c, `(${writerAtomicSub(type)} ${__OffsetGetter__$0at($0, offset)} (i32.const 1))`)
        }

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\]\\\s\\+1`, "g"))) {
            let [c, $0] = de;
            wasm = wasm.replaceAll(c, `(${writerAtomicAdd(type)} ${__OffsetGetter__$0at($0, offset)} (i32.const 1)) drop`)
        }

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\]\\\s\\+\\+`, "g"))) {
            let [c, $0] = de;
            wasm = wasm.replaceAll(c, `(${writerAtomicAdd(type)} ${__OffsetGetter__$0at($0, offset)} (i32.const 1))`)
        }

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\]\\\s\\=\\=\\\s(.*)`, "g"))) {
            let [c, $0,$1] = de;
            wasm = wasm.replaceAll(c, `(${realtype(type)}.eq ${c.replace(`== ${$1}`, `${$1}`)})`)
        }

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\]\\\s\\!\\=\\\s(.*)`, "g"))) {
            let [c, $0,$1] = de;
            wasm = wasm.replaceAll(c, `(${realtype(type)}.ne ${c.replace(`!= ${$1}`, `${$1}`)})`)
        }




        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\]`, "g"))) {
            let [c, $0] = de;

            if (wasm.substring( de.index + c.length ).trim().startsWith("&")) {
                
                let fend = de.index + c.length
                let sub0 = wasm.indexOf( "&", fend );
                let key = "&" + wasm.charAt(sub0 + 1);
                let sube = sub0 + key.length
                let at = wasm.indexOf( key, sube );
                
                reps$a_$0.push({
                    at, key, 
                    repl: __ReadCall__$0AtType( $0, offset, type)
                })

                wasm =  wasm.substring(0, fend) + 
                        wasm.substring(fend).replace(key, "")

                wasm =  wasm.substring(0, de.index) + 
                        wasm.substring(de.index).replace(c, "")

            } else {
                wasm =  wasm.substring(0, de.index) + 
                        wasm.substring(de.index).replace(c, __ReadCall__$0AtType( $0, offset, type))
            }
        }
    

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s+(.*?)\\&\\]`, "g"))) {
            let [c, $0] = de;
            wasm = wasm.replaceAll(c,  __OffsetGetter__$0at( $0, offset ))
        }
        
        for (let d of wasm.matchAll(new RegExp(`offset\\(\\${name}\\\s+${prop}\\\s+(.*)\\)`, "g"))) {
            let [c, $0] = d
            wasm = wasm.replaceAll(c, __OffsetGetter__$0at( $0, offset ))
        }

        for (let de of wasm.matchAll(new RegExp(`\\[\\*${alias}\\\s(.*)\\\s${prop}\\\s`, "g"))) {
            let [c, $0] = de;
            let frame = getEncosedFrame(de, ["[", "]"])
            let $1 = frame.content.substring(frame.content.indexOf(c) + c.length, frame.content.lastIndexOf("]"));
            let wcall = __WriteCall__$0AtType$1( $0, offset, type, $1);
            wasm = wasm.replaceAll(frame.content, wcall)
        }


        getters = `${getters}    
    (func   ${`$get<${alias}*>${prop.replace(";","59")}`.padEnd(40, " ")} (type $i32->${realtype(type)}) ${__ReadCall__$0AtType( '$0', offset, type)})`;

        setters = `${setters}    
    (func   ${`$set<${alias}*.${prop.replace(";","59")}>`.padEnd(40, " ")} (type $i32.${realtype(type)}->) ${__WriteCall__$0AtType$1( '$0', offset, type, '$1')})`;

        let prefix = "", suffix = "", enumerable = 1;

        switch (type) {
            case "ptr": 
                prefix = "*"
            break;
            
            case "ext":
                prefix = "#"
                enumerable = 0
            break;

            case "fun": 
                prefix = "{{"
                suffix = "}}"
            break;
        }


        clssdef = clssdef.replace( ";; PROPDEFS",`;; PROPDEFS
                (call $self.Reflect.defineProperty<ext3> (global.get $temp/prototype) ${stringify(`${prefix}${prop}${suffix}`, `                `)}
                (call $self.Object.fromEntries<ext>ext 
                (call $self.Array.of<ext2>ext 
                (call $self.Array.of<ext2>ext ${callifyString('get')}
                (call $self.Function<ext>ext ${callifyString(`return this.$(this,${offset},${gettypeid(type)})`, true)}))
                (call $self.Array.of<ext.i32>ext ${callifyString('enumerable')} (i32.const ${enumerable})))))
            `
        )

    }

    for (let gets of clsss[name].gets) {

        clssdef = clssdef.replace( ";; PROPDEFS",`;; PROPDEFS
            (call $self.Reflect.defineProperty<ext3> (global.get $temp/prototype) ${stringify(`${gets.label}`, `                `)}
            (call $self.Object.fromEntries<ext>ext 
            (call $self.Array.of<ext2>ext 
            (call $self.Array.of<ext2>ext ${callifyString('get')}
            (call $self.Function<ext>ext ${callifyString(`return this.$(this,${gets.elem},${gettypeid("exc")})`, true)}))
            (call $self.Array.of<ext.i32>ext ${callifyString('enumerable')} (i32.const ${gets.enumerable})))))
        `)
    }

    defines = `\n${defines}\n${getters}\n${setters}\n${clssdef}\n`
        .replaceAll(";; PROPDEFS", "")
        .replace("%(__PropClass$__)", ``)

}

for (let { at, key, repl } of reps$a_$0) {
    wasm = wasm.substring(0, at) + wasm.substring(at).replaceAll(key, repl)
}

wasm = wasm + defines


wasm.match(/global\(tee\s+(.*?[^\s\d)])\s+(\d+)\)/g)?.map( c => {
    strv = c.substring(c.indexOf(" ")+1, c.lastIndexOf(" ")); 
    numi = c.substring(c.lastIndexOf(" ")+1, c.indexOf(")")); 
    wasm = wasm.replaceAll(c, `(global.set ${strv} (i32.const ${numi})) (i32.const ${numi})`)
})




wasm = wasm.replaceAll("reset(set", "(global.set ")
wasm = wasm.replaceAll("reset(", "call(")

wasm = wasm + `
    (global $# (mut externref) ref.null extern)
    (global $stringify# (mut externref) ref.null extern)
    (global $temp/array (mut externref) ref.null extern)
    (global $temp/object (mut externref) ref.null extern)
    (global $temp/prototype (mut externref) ref.null extern)
    (global $$ (mut externref) ref.null extern)
    (global $* (mut externref) ref.null extern)
    (global $temp/a (mut i32) (i32.const 0))
    (global $temp/b (mut i32) (i32.const 0))
    (global $temp/i (mut i32) (i32.const 0))
    (global $temp/j (mut i32) (i32.const 0))
    (global $temp/0 (mut i32) (i32.const 0))
    (global $temp/1 (mut i32) (i32.const 0))
    (global $temp/2 (mut i32) (i32.const 0))
    (global $temp/3 (mut i32) (i32.const 0))
    (global $resv/0 (mut i32) (i32.const 0))
    (global $resv/1 (mut i32) (i32.const 0))
    (global $resv/2 (mut i32) (i32.const 0))
    (global $resv/3 (mut i32) (i32.const 0))
    (global $0# (mut externref) ref.null extern)
    (global $1# (mut externref) ref.null extern)
    (global $2# (mut externref) ref.null extern)
    (global $3# (mut externref) ref.null extern)
    (global $4# (mut externref) ref.null extern)
    (global $i (mut i32) (i32.const 0))
    (global $malloc.remainder (mut i32) (i32.const 0))
    (global $malloc.byteLength (mut i32) (i32.const 0))
    (global $f (mut f32) (f32.const 0))
    (global $$$ (mut i32) (i32.const 0))
    (global $new* (mut i32) (i32.const 0))
    (global $j (mut i32) (i32.const 0))
    (global $|0 (mut i32) (i32.const 0))
    (global $|1 (mut i32) (i32.const 0))

    (func $temp/array (global.set $temp/array (call $self.Array<>ext)))
    (func $temp/object (global.set $temp/object (call $self.Object<>ext)))
    (func $temp/prototype (global.set $temp/prototype (call $self.Object<>ext)))

    (global $TextDecoder# (mut externref) ref.null extern)
    (func   $TextDecoder# (type $->ext)
        (if (null global($TextDecoder#))
            (then 
                call($self.Reflect.construct<ext2>ext
                    global($self.TextDecoder)
                    call($self.Array<>ext)
                )
                global(set $TextDecoder#)
            )
        )
        global($TextDecoder#)
    )    
`


for (let [c] of wasm.matchAll(/prompt\(\".*?\"\)/g)) {
    wasm = wasm.replaceAll(c, `Reflect(apply (self.prompt) (null) Array.of(String${c.substring(6)}))`)
}



for (let d of wasm.matchAll(/\s\{\s(.*?[^}])\s\}/g)) {
    let [c, $1] = d
    wasm = wasm.replaceAll(c, ` (call $self.Object.fromEntries<ext>ext (call $self.Array.of<ext>ext ${$1} )) `)
}


for (let [c] of wasm.matchAll(/\[\'.*?\'\]/g)) {
    wasm = wasm.replaceAll(c, `Array.of(String("${c.substring(2, c.length-2)}"))`)
}



makeCallerInputArgs = ( args = [ "ext", "i32", "i32" ], nums = [0, 4, 1] ) => {

    let parr = []
    let pair = []

    nums.forEach( (n,i) => { parr[i] = args[n] })
    parr.forEach( (param, pi) => {
        let i = 0
        let next = 1

        parr.forEach( (arg, argi) => {
            if (next) {
                if (argi > pi) {
                    if (next = (param === arg)) {
                        i++
                    }
                }
            }
        })

        pair.push(i)
    })

    let maxp;
    let perr = []
    while (0 < (maxp = Math.max.apply(Math, pair))) {
        if (isNaN(maxp) || !isFinite(maxp)) {break}
        let li = pair.lastIndexOf(maxp++)
        pair.fill(  -1, li, li + maxp )

        let ty = parr[li]
        if (!isNaN(ty.at(-1))) { ty += "x" }
        perr[li] = ty + maxp
    }

    pair.forEach((c, i) => {
        if (c !== -1) {
            perr[i] = parr[i]
        }
    })

    perr = perr.filter(Boolean)
    return perr.join(".")
}

for (let d of wasm.matchAll(/\[([\s\$\d\s]+)\]/g)) {
    let [c, $1] = d
    let nums = $1.split(/\s|\$/g).filter(Boolean).map(Number);
    let args = findFunctionAndArgumentsType(d.index).args
    let argv = makeCallerInputArgs(args, nums)
    let locs = nums.map(n => `(local.get ${n})`).join(" ")

    if (nums.length === 1) {
        argv = args[nums[0]]
    }

    wasm = wasm.replaceAll(c, `(call $self.Array.of<${argv}>ext ${locs})` )
}

for (let d of wasm.matchAll(/\[\s\"(.*?[^"])\"\s\]/g)) {
    let [c, $1] = d
    wasm = wasm.replaceAll(c, `(call $self.Array.of<ext>ext ${callifyString($1)})`)
}

for (let d of wasm.matchAll(/\[\s(.*?[^\s])\s\]/g)) {
    let [c, $1] = d
    wasm = wasm.replaceAll(c, ` (call $self.Array.of<ext>ext ${$1})`)
}


for (let d of wasm.matchAll(/\s\'(.*?)\'\~/g)) {
    let [c, s] = d
    wasm = wasm.replaceAll(c, " " + callifyString(s.replaceAll("\\n", "\n"), true))
}


for (let [c] of wasm.matchAll(/\'.*?\'/g)) {
    wasm = wasm.replaceAll(c, `String("${c.substring(1, c.length-1)}")`)
}

wasm = wasm.split("Reflect(call").join("(call $Reflect.apply<ext3> ")
wasm = wasm.split("Reflect(apply").join("(call $Reflect.apply<ext3> ")
wasm = wasm.split("Reflect(get").join("(call $self.Reflect.get<ext2>ext ")
wasm = wasm.split("Reflect(set").join("(call $Reflect.set ")
wasm = wasm.split("Reflect.bind(").join("(call $Reflect.bind ")
wasm = wasm.split("Reflect.new(").join("(call $self.Reflect.construct<ext2>ext ")
wasm = wasm.split("Reflect(new").join("(call $self.Reflect.construct<ext2>ext ")
wasm = wasm.split("Reflect.construct(").join("(call $self.Reflect.construct<ext2>ext ")
wasm = wasm.split("Reflect.defineProperty(").join("(call $Reflect.defineProperty ")
wasm = wasm.split("Reflect.deleteProperty(").join("(call $Reflect.deleteProperty ")


for (let [c] of wasm.matchAll(/return\slog\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.log(String${c.substring(10)}) (return (ref.null extern))`)}
for (let [c] of wasm.matchAll(/return\sinfo\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.log(String${c.substring(11)}) (return (ref.null extern))`)}
for (let [c] of wasm.matchAll(/return\swarn\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.warn(String${c.substring(11)}) (return (ref.null extern))`)}
for (let [c] of wasm.matchAll(/return\serror\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.error(String${c.substring(12)}) (return (ref.null extern))`)}

for (let [c] of wasm.matchAll(/log\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.log(String${c.substring(3)})`)}
for (let [c] of wasm.matchAll(/info\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.log(String${c.substring(4)})`)}
for (let [c] of wasm.matchAll(/warn\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.warn(String${c.substring(4)})`)}
for (let [c] of wasm.matchAll(/fail\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.error(String${c.substring(4)})`)}
for (let [c] of wasm.matchAll(/throw\(\".*?\"\)/g)) { wasm = wasm.replaceAll(c, `console.error(String${c.substring(5)}) (unreachable)`)}

for (let [c] of wasm.matchAll(/local\(type\ \$[\w+]\)/g)) {
	wasm = wasm.replaceAll(c, `(call $type (local.get ${c.substring(11)})`)
}


wasm = typeoffix(wasm);
wasm = offsetfix(wasm);

for (let [c,$1,$2,$3] of wasm.matchAll(/\.at\((.*[^a-zA-Z*&#])\,(.*?\))\)/g)) {
	wasm = wasm.replaceAll(c, `(call $get<*>offset) ${$1} (i32.add) ${$2} (i32.store)`)    
}


for (let [c,$1,$2] of wasm.matchAll(/\.at\((.*[^a-zA-Z*&#])\)/g)) {
	wasm = wasm.replaceAll(c, `(call $get<*>offset) ${$1} (i32.add) (i32.load)`)    
}

for (let d of wasm.matchAll(/\(([A-Z][A-Z0-9_]+)\)/g)) { 
    let [c,TYPE] = d;
    if (!TYPE) { process.exit(1) }
    if (!consts[TYPE] && !TYPES.includes(TYPE)) { TYPES.push(TYPE) }
    wasm = wasm.replaceAll(c, ";; " + c.toLowerCase() + " " + TYPES.indexOf(TYPE))
}

let t = "\n                \t"

let CONSTS_BLOCK = [
]

let consts_arr = []

for (let label in consts) {
    let tid = consts[label].tid = TYPES.length + consts[label].cid
    CONSTS_BLOCK.push(`(if (i32.eq (local.get 0) (i32.const ${consts[label].i32})) (then (local.set 2 ${callifyString(label, true)}) (local.set 3 (i32.const ${tid})) br $const)) ;; ${label.toLowerCase()}`)
    consts_arr.push(consts[label])
}
CONSTS_BLOCK.sort((a,b) => b.indexOf(";;") - a.indexOf(";;"))

wasm = wasm.replace( "block(const unreachable)", `(block $const${t+CONSTS_BLOCK.join(t)+t}(if (i32.eqz (local.get 3)) (then unreachable))${t})` )


let TYPES_BLOCK = [
    `        (if (i32.eqz (local.get 0)) (then (local.set 1 ${callifyString('Null')}) br $ilk))`
]

for (let Ti in TYPES) {
    if (Ti > 0) {
        TYPES_BLOCK.push(`        (if (i32.eq (local.get 0) (i32.const ${Ti})) (then (local.set 1 ${callifyString(TYPES[Ti], true)}) br $ilk)) ;; ${TYPES[Ti]}`)
        
        wasm = wasm
            .replaceAll(TYPES[Ti] + "§", callifyString(TYPES[Ti], true))
            .replaceAll(TYPES[Ti] + "&", `${Ti}`)
            .replaceAll(TYPES[Ti], `(i32.const ${Ti})`)
    }
}

wasm = wasm.replace( "block(ilk unreachable)", `(block $ilk${t+TYPES_BLOCK.join(t)+t}(unreachable)${t})` )

for (let {cid, i32, label} of consts_arr.sort((a,b) => b.label.length - a.label.length)) {
    wasm = wasm
        .replaceAll("ilk " + label + ")", ` ilk ${cid})`)
        .replaceAll(label + "§", callifyString(label, true))
        .replaceAll(label + "$", `(i32.const ${cid})`)
        .replaceAll(label + "&", `${i32}`)
        .replaceAll(`(${label})`, `(i32.const ${i32})`)
        .replaceAll(label, ` (i32.const ${i32})`)
}

let ctarr = [ 
    ...TYPES, ...consts_arr.map(c => c.label)
].filter(Boolean).sort((a,b) => b.length - a.length)

for (let cti of ctarr) {
    wasm = wasm.replaceAll(" " + cti.toLowerCase(), " " + cti.toUpperCase())
}


for (let c of wasm.matchAll(/(global|local)\(([^() ]*)\)\.(\w+)/g)) {
    break
    let [type, r, e, key] = c

    p = -1
    for (let cl in classes) {
        if (!isNaN(classes[cl].offsets[key])) {
            p = classes[cl].offsets[key]
            break
        }
    }

    if (p === -1) {
        process.exit(!console.log("BYTEOFSSET_FAULT", key))
    }
    
    wasm = wasm.replaceAll(c[0], `(i32.load (i32.add (call $get<*>offset ${r}(${e})) (i32.const ${p})))`)
}





while (mc = wasm.match(/[^\$]self\.[\w+\.]+\s+/i)){
    wasm = 
        wasm.substring( 0, mc.index+1 ) + 
            `(${mc[0].substring(1).trim()})` + 
        wasm.substring(mc.index + mc[0].length - 1)
}



for (let d of wasm.matchAll(/\(self\.[\w+\.]+\)/gi)) {

    let [glob] = d

    glb = glob.substring(1, glob.length-1)
    
    if (!globals.includes(glb.substring(5)))
    {
        wasm = wasm.replaceAll(glob, `(call $${glb})`)

        d.glob = `(global $${glb}`.padEnd(79, " ")                          + `(mut externref) (ref.null extern))`;
        d.func = `(func   $${glb}`.padEnd(95, " ")                                          + `(result externref)`;

        if (!wasm.includes(d.func)) { wasm = wasm.replace( `;; globalized ;;`, `;; globalized ;; 
    ${d.func}
        (if (ref.is_null (global.get $${glb}))
            (then 
                ${globalize(glb)[1]}
                (global.set $${glb})
            )
        )
        (global.get $${glb})
    )
`
        )}

        if (!wasm.includes(d.glob)) { wasm = wasm.replace( `;; globalized ;;`, `;; globalized ;;
    ${d.glob}
`
        )}

    }
}

    
{
    let str, start, desc, begin, end, text, code, match, prev, next, reps = [], rep, ri = 0, si = 0;
    
    while (match = wasm.match(/String\(\`/)) {
        [str] = {index: start} = match;
        begin = start + str.length
        end   = wasm.indexOf("`", begin)
        prev  = wasm.substring(0, start)
        text  = wasm.substring(begin, end).trim()
        next  = wasm.substring(end+2)
        desc  = text.replaceAll(/\n+|\s+|\t+|\;\;/g, ' ')

        while (match = text.match(/local\(|global\(/)) {
            reps.push(rep = {
                i : -reps.length,
                start: match.index, 
                end: text.indexOf(")", match.index+match[0].length),
            })

            rep.r = text.substring(match.index, rep.end+1)
            text = text.split(rep.r).join(String.fromCharCode(0))
        }

        si = 0

        code = `
        ;; ${desc}
        (global.set $# (call $self.Array<>ext)) ${text.split('')?.map((c,i) =>`
        (call $self.Reflect.set<ext.i32x2> (global.get $#) (i32.const ${i}) (i32.const ${c.charCodeAt() || Object.assign(reps[ri++], {s:i}) && 32}))`).join('')}
        `
        code = code + `(global.set $1#       (call $self.Array<>ext))\n`; 
        "encode".split("").forEach( (e,j) => { 
            code = code + `(call $self.Reflect.set<ext.i32x2> (global.get $1#) (i32.const ${j}) (i32.const ${e.charCodeAt()}))\n`
        })
        code = code + `(global.set $1#       (call $self.Reflect.apply<ext3>ext (global.get $self.String.fromCharCode) (ref.null extern) (global.get $1#)))\n`
        code = code + `(global.set $1#       (call $self.Reflect.get<ext2>ext (call $TextDecoder#) (global.get $1#)))\n`

        code = code + `(global.set $2#       (call $self.Array<>ext))\n`; 
        "splice".split("").forEach( (e,j) => { 
            code = code + `(call $self.Reflect.set<ext.i32x2>   (global.get $2#) (i32.const ${j}) (i32.const ${e.charCodeAt()}))\n`
        })
        code = code + `(global.set $2#       (call $self.Reflect.apply<ext3>ext (global.get $self.String.fromCharCode) (ref.null extern) (global.get $2#)))\n`
        code = code + `(global.set $2#       (call $self.Reflect.get<ext2>ext (global.get $#) (global.get $2#)))\n`
    
        reps.reverse()
        
        reps.forEach(rep => { 
            code = `${code}
            (global.set $3# (call $self.Array.of<i32>ext (i32.const ${rep.r}))
            (global.set $3# (call $self.Reflect.apply<ext3> (global.get $1#) (call $TextDecoder#) (global.get $3#)))
            (global.set $3# (call $self.Array.from<ext>ext (global.get $3#)))
            (global.set $0# (call $self.Array<>ext))
            (call $self.Reflect.set<ext.i32x2> (global.get $0#) (i32.const 0) (i32.const 0))
            (call $self.Reflect.set<ext.i32x2> (global.get $0#) (i32.const 1) (i32.const 0))
            (call $self.Reflect.set<ext.i32x2> (global.get $0#) (i32.const 2) (i32.const ${rep.s}))
            (call $self.Reflect.set<ext.i32x2> (global.get $0#) (i32.const 3) (i32.const 0))
            (drop (call $self.Reflect.apply<ext3> (global.get $2#) (global.get $3#) (global.get $0#)))
            (drop (call $self.Reflect.apply<ext3> (global.get $2#) (global.get $#)  (global.get $3#)))
            `
        })

        code = `${code}
        (call $self.Reflect.apply<ext3>ext (global.get $self.String.fromCharCode) (ref.null extern) (global.get $#))
        `

        wasm = prev + code + next

    }
}




wasm.match(/Function.of\([\w+\s+\d+çöşüğ,.{}|;0123456789]+\)/g)?.map( c => 
    wasm = wasm.replaceAll( c, `(call $self.Function.of (table.get $fun (i32.const ${c.substr(12)}))`)
)


wasm.match(/String\*\(\".*\"\)/g)?.map( c => {
    wasm = wasm.replaceAll(c, [str = c.substring(9, c.length-2)] && `
                    (global.set $buffer* (call $Buffer*))
                    (global.set $string* (call $String*))

                    (call $set<string*.buffer*>          (global.get $string*) global($buffer*))
                    (call $set<string*.length>           (global.get $string*) (i32.const ${str.length}))
                    (call $set<buffer*.byteLength>       (global.get $buffer*) (i32.const ${str.length}))
                    (call $resize<buffer*>               (global.get $buffer*))
                    ${str.split("")?.map((c, i) => `
                    (call $set<buffer*.byteOffset.ui8>   (global.get $buffer*) (i32.const ${i}) (i32.const ${c.charCodeAt()}))`).join("")}

                    (global.get $string*)`
    )
})


wasm.match(/local\(\$.*\s+(i\d+|f\d+|fun\w+|ext|v128|128)\)/g)?.map( c => { 
    wasm = wasm.replaceAll(c, c.replace("local(", "(local ").replace(" ext)"," externref)").replace(" 128)"," v128)") )
})

wasm.match(/String\(\"[\w+\s+çöşüğ#*,.{}|;()'<>= ?/+`_$:]+\"\)/g)?.map( c => {
    str = c.substring(8, c.length-2)
    wasm = wasm.replaceAll( c, callifyString(str, true))
})

wasm.match(/i32\(\"(.*?)\"\)/g)?.map( c => {
    wasm = wasm.replace( c, `(i32.const ${c.charCodeAt(5)})`)
})

wasm.match(/Number\(\d+\)/g)?.map( c => 
    wasm = wasm.split(c).join(c.replace(")","))").replace("Number(","(call $self.Number<i32>ext (i32.const "))
)



wasm = wasm.replaceAll("$Array.of<' '>", "$Array.of<'space'>")
wasm = wasm.replaceAll(".to(i32)", " (call $self.Number<ext>i32)")
wasm = wasm.replaceAll(".of(Array)", " (call $self.Array.of<ext>ext)")
wasm = wasm.replaceAll(".toNumber(i32)", " (call $self.Number<ext>i32)")
wasm = wasm.replaceAll(".toNumber()", " (call $self.Number<i32>ext)")
wasm = wasm.replaceAll(".log()", " (call $self.console.log)")
wasm = wasm.replaceAll("log(fun)", "(call $self.eval<fun>ext) (call $self.console.log)")
wasm = wasm.replaceAll("log(ptr)", "(call $ptr<*>) (call $self.console.log)")
wasm = wasm.replaceAll("log(i32)", "(call $self.Number<i32>ext) (call $self.console.log)")
wasm = wasm.replaceAll("log(f32)", "(call $self.Number<f32>ext) (call $self.console.log)")
wasm = wasm.replaceAll(".toNumber(ext)", " (call $self.Number<i32>ext)")
wasm = wasm.replaceAll(".toNumber(num)", "(i32.const 48) (i32.add) (call $self.Number<i32>ext)")
wasm = wasm.replaceAll(".toObject(ptr)", " (global.set $i) (call $self.Reflect.construct<ext2>ext (call_indirect (result externref) (call $get<*>typeof (global.get $i))) (call $self.Array.of (call $self.Number<i32>ext (global.get $i)))) ")

wasm.match(/Number\(\"(\W+|\w+)\"\)/gis)?.map( c => 
    wasm = wasm.split(c).join(`(call $self.Number<i32>ext (i32.const ${c.split('"').at(1).charCodeAt()}))`)
)

new Array(17).fill(1).reverse().forEach( (n,i ) =>  {
    wasm = wasm.replaceAll(` $${i})`, ` (local.get ${i}))`)
    wasm = wasm.replaceAll(` $${i}\n`, ` (local.get ${i}) `)
    wasm = wasm.replaceAll(` $${i} `, ` (local.get ${i}) `)
})


wasm.match(/\((global|local)\s\$\w+\s\+\=\s\d+\)/g)?.map( c => {
    type = c.substring(1, c.indexOf("$")-1); 
    strv = c.substring(c.indexOf("$"), c.indexOf("+=")-1); 
    numi = c.substring(c.indexOf("+=")+3, c.lastIndexOf(")"))
    wasm = wasm.replaceAll(c, `(${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const ${numi})))`)
})

wasm.match(/\((global|local)\s\$\w+\*\s\+\+\)/g)?.map( c => {
    type = c.substring(1, c.indexOf("$")-1); 
    strv = c.substring(c.indexOf("$"), c.indexOf("++")).trim(); 
    wasm = wasm.replaceAll(c, `(${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const 1)))`)
})
wasm.match(/\((global|local)\s\$\w+\s\+\+\)/g)?.map( c => {
    type = c.substring(1, c.indexOf("$")-1); 
    strv = c.substring(c.indexOf("$"), c.indexOf("++")).trim(); 
    wasm = wasm.replaceAll(c, `(${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const 1)))`)
})

wasm.match(/(global|local)\(\$\w+\s\+\+\)/g)?.map( c => {
    type = c.substring(0, c.indexOf("(")); 
    strv = c.substring(c.indexOf("$"), c.indexOf("++")-1); 
    wasm = wasm.replaceAll(c, `(${type}.get ${strv}) (${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const 1)))`)
})

wasm.match(/(global|local)\(\$(\w+|\d+)\s\-\-\)/g)?.map( c => {
    type = c.substring(0, c.indexOf("(")); 
    strv = c.substring(c.indexOf("$"), c.indexOf("--")-1).trim();
    if (!isNaN(strv.substring(1))) {
        strv = strv.substring(1)
    } 
    wasm = wasm.replaceAll(c, `(${type}.get ${strv}) (${type}.set ${strv} (i32.sub (${type}.get ${strv}) (i32.const 1)))`)
})


wasm.match(/(global|local)\(\$\w+\s\+\=\s\d+\)/g)?.map( c => {
    type = c.substring(0, c.indexOf("(")); 
    strv = c.substring(c.indexOf("$"), c.indexOf("+=")-1); 
    numi = c.substring(c.indexOf("+=")+3, c.lastIndexOf(")"))
    wasm = wasm.replaceAll(c, `(${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const ${numi}))) (${type}.get ${strv})`)
})



wasm.match(/(global|local)\(\$\w+\s\=\+\s\d+\)/g)?.map( c => {
    type = c.substring(0, c.indexOf("(")); 
    strv = c.substring(c.indexOf("$"), c.indexOf("=+")-1); 
    numi = c.substring(c.indexOf("=+")+3, c.lastIndexOf(")"))
    wasm = wasm.replaceAll(c, `(${type}.get ${strv}) (${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const ${numi})))`)
})

wasm.match(/(global|local)\(\+\+\s\$\w+\)/g)?.map( c => {
    type = c.substring(0, c.indexOf("(")); 
    strv = c.substring(c.indexOf("$"), c.indexOf(")")); 
    wasm = wasm.replaceAll(c, `(${type}.set ${strv} (i32.add (${type}.get ${strv}) (i32.const 1))) (${type}.get ${strv})`)
})

wasm.match(/(global|local)\(\-\-\s\$\w+\)/g)?.map( c => {
    type = c.substring(0, c.indexOf("(")); 
    strv = c.substring(c.indexOf("$"), c.indexOf(")")); 
    wasm = wasm.replaceAll(c, `(${type}.set ${strv} (i32.sub (${type}.get ${strv}) (i32.const 1))) (${type}.get ${strv})`)
})

wasm.match(/global\(tee\s(\$\w*[^\s])\s([\-|]\d+)\)/g)?.map( c => {
    strv = c.substring(c.indexOf("$"), c.lastIndexOf(" ")); 
    numi = c.substring(c.lastIndexOf(" ")+1, c.indexOf(")")); 
    wasm = wasm.replaceAll(c, `(global.set ${strv} (i32.const ${numi})) (i32.const ${numi})`)
})

wasm = wasm.split("Number(").join("(call $self.Number<i32>ext ")

wasm.match(/\(char\s\"(\W+|\w+)\"\)/gis)?.map( c => 
    wasm = wasm.split(c).join(`(call $self.Number<i32>ext (i32.const ${c.split('"').at(1).charCodeAt()}))`)
)

wasm.match(/\(charCode\s\"(\W+|\w+)\"\)/gis)?.map( c => 
    wasm = wasm.split(c).join(`(i32.const ${c.split('"').at(1).charCodeAt()})`)
)

wasm = wasm.split("i32(return " ).join("return (i32.load " )
wasm = wasm.split("i32(+ " ).join("(i32.add " )
wasm = wasm.split("i32(== " ).join("(i32.eq " )
wasm = wasm.split("i32(eq " ).join("(i32.eq " )
wasm = wasm.split("i32(ne " ).join("(i32.ne " )
wasm = wasm.split("i32(div " ).join("(i32.div_u " )
wasm = wasm.split("i32(ltu " ).join("(i32.lt_u " )
wasm = wasm.split("i32(mul " ).join("(i32.mul " )
wasm = wasm.split("i32(sum " ).join("(i32.add " )
wasm = wasm.split("i32(dif " ).join("(i32.sub " )
wasm = wasm.split("i32(mod " ).join("(i32.rem_u " )
wasm = wasm.split("i32(get " ).join("(i32.load " )
wasm = wasm.split("ilk(get " ).join("(i32.load " )
wasm = wasm.split("ilk(cmpx " ).join("(i32.atomic.rmw.cmpxchg " )
wasm = wasm.split("i32(cmpx " ).join("(i32.atomic.rmw.cmpxchg " )
wasm = wasm.split("i32(cmpxchg " ).join("(i32.atomic.rmw.cmpxchg " )
wasm = wasm.split("(cmpx " ).join("(i32.atomic.rmw.cmpxchg " )
wasm = wasm.split("ilk(set " ).join("(i32.store " )
wasm = wasm.split("u16(set " ).join("(i32.store16 " )
wasm = wasm.split("i16(set " ).join("(i32.store16 " )
wasm = wasm.split("u16(get " ).join("(i32.load16_u " )
wasm = wasm.split("i16(get " ).join("(i32.load16_s " )
wasm = wasm.split("ui8(get " ).join("(i32.load8_u " )
wasm = wasm.split("u8(get " ).join("(i32.load8_u " )
wasm = wasm.split("u8(set " ).join("(i32.store8 " )
wasm = wasm.split("i8(get " ).join("(i32.load8_s " )
wasm = wasm.split("ui8(set " ).join("(i32.store8 " )
wasm = wasm.split("i8(set " ).join("(i32.store8 " )
wasm = wasm.split("i32x4(eq " ).join("(i32x4.eq " )
wasm = wasm.replaceAll("🤪", "")
wasm = wasm.split("v128(get " ).join("(v128.load " )
wasm = wasm.split("v128(any " ).join("(v128.any_true " )
wasm = wasm.split("v128(" ).join("(v128." )
wasm = wasm.split("i8x16(" ).join("(i8x16." )
wasm = wasm.split("i32(set " ).join("(i32.store " )
wasm = wasm.split("i32x1(set " ).join("(i32.store " )
wasm = wasm.split("i64(set " ).join("(i64.store " )
wasm = wasm.split("i64(get " ).join("(i64.load " )
wasm = wasm.split("f32(get " ).join("(f32.load " )
wasm = wasm.split("f32(set " ).join("(f32.store " )
wasm = wasm.split("f64(get " ).join("(f64.load " )
wasm = wasm.split("f64(set " ).join("(f64.store " )
wasm = wasm.split("f64x1(set " ).join("(f64.store " )
wasm = wasm.split("ui8(add " ).join("(i32.atomic.rmw8.add_u " )
wasm = wasm.split("i8(add " ).join("(i32.atomic.rmw8.add_s " )
wasm = wasm.split("i32(add " ).join("(i32.atomic.rmw.add " )
wasm = wasm.split("i32(sub " ).join("(i32.atomic.rmw.sub " )
wasm = wasm.split("i32(ext " ).join("(table.get $ext " )
wasm = wasm.split("i32(eqz " ).join("(i32.eqz " )


"i32(,f64(".split(",").forEach( (n) => {
    wasm = wasm.replaceAll(n, `(${n.substring(0,3)}.const ` )
})

wasm = wasm.split("console.table(").join("(call $self.console.table ")
wasm = wasm.split("console.log(").join("(call $self.console.log ")
wasm = wasm.split("console.warn(").join("(call $self.console.warn ")
wasm = wasm.split("console.error(").join("(call $self.console.error ")

wasm = wasm.split("log(").join("(call $self.console.log ")
wasm = wasm.split("warn(").join("(call $self.console.warn ")
wasm = wasm.split("error(").join("(call $self.console.error ")
wasm = wasm.split("fail(").join("(call $self.console.error ")

wasm = wasm.split("(i32.atomic.add " ).join("(i32.atomic.rmw.add " )
wasm = wasm.split("(i32.atomic.sub " ).join("(i32.atomic.rmw.sub " )
wasm = wasm.split("(i32.atomic.set " ).join("(i32.atomic.store " )
wasm = wasm.split("i32(get " ).join("i32(get " )
wasm = wasm.split("(ext.set" ).join("(table.set $ext " )
wasm = wasm.split("(ext.get" ).join("(table.get $ext " )
wasm = wasm.split("(fun.get" ).join("(table.get $fun " )
wasm = wasm.split("import(" ).join("table(add $ext " )
wasm = wasm.split("table(add $ext " ).join("(global.set $i (table.grow $ext (ref.null extern) (i32.const 1))) (global.get $i) (table.set $ext (global.get $i) " )
wasm = wasm.split("table(" ).join("(table." )
wasm = wasm.split("block(" ).join("(block" )
wasm = wasm.split("memory(size" ).join("(memory.size" )
wasm = wasm.split("memory(grow" ).join("(memory.grow" )
wasm = wasm.split("memory(copy" ).join("(memory.copy" )
wasm = wasm.split("memory(fill" ).join("(memory.fill" )
wasm = wasm.split("local(get" ).join("(local.get " )
wasm = wasm.split("local(tee" ).join("(local.tee " )
wasm = wasm.split("local(set" ).join("(local.set " )


wasm = wasm.split("global(get" ).join("(global.get " )
wasm = wasm.split("global(set" ).join("(global.set " )
wasm = wasm.split("local(" ).join("(local.get " )

wasm = wasm.split("global(" ).join("(global.get " )
wasm = wasm.split("(i32.mod " ).join("(i32.rem_u " )
wasm = wasm.split("call(" ).join("(call " )

wasm = wasm.split("(return null)").join("(return (ref.null extern))")
wasm = wasm.split("return null").join("(return (ref.null extern))")
wasm = wasm.split("(null)").join("(ref.null extern)")
wasm = wasm.split("<--").join("(;")
wasm = wasm.split("-->").join(";)")
wasm = wasm.split("(null ").join("(ref.is_null ")
wasm = wasm.split(" mut i32)").join(" (mut i32) (i32.const 0))")
wasm = wasm.split(" mut f32)").join(" (mut f32) (f32.const 0))")
wasm = wasm.split(" mut 128)").join(" (mut v128) (v128.const i32x4 0 0 0 0))")
wasm = wasm.split(" mut i32x4)").join(" (mut v128) (v128.const i32x4 0 0 0 0))")
wasm = wasm.split(" mut i16x8)").join(" (mut v128) (v128.const i16x8 0 0 0 0  0 0 0 0))")
wasm = wasm.split(" mut i8x16)").join(" (mut v128) (v128.const i8x16 0 0 0 0  0 0 0 0  0 0 0 0  0 0 0 0))")
wasm = wasm.split(" mut ext)").join(" (mut externref) (ref.null extern))")
wasm = wasm.split(" ext)").join(" externref)")
wasm = wasm.split("(ext)").join("(ref.null extern)")
wasm = wasm.split("(extern)").join("(ref.null extern)")
wasm = wasm.split("(externref)").join("(ref.null extern)")
wasm = wasm.split("(keyof ").join("(call $get<ext2>ext ")

wasm = stringfix(wasm);

wasm = wasm.split("(true)").join("(i32.const 1)")
wasm = wasm.split(" true").join("(i32.const 1)")

wasm = wasm.split("(false)").join("(i32.const 0)")
wasm = wasm.split(" false").join("(i32.const 0)")

wasm = wasm.split("(undefined)").join("(global.get $undefined)")
wasm = wasm.split("(enumerable on)").join("(i32.const 1)")
wasm = wasm.split("(enumerable yes)").join("(i32.const 1)")
wasm = wasm.split("(enumerable no)").join("(i32.const 0)")
wasm = wasm.split("(enumerable off)").join("(i32.const 0)")
wasm = wasm.split("(100000)").join("(i32.const 100000)")


wasm = wasm.split("(i32->ext").join("(table.get $ext ")
wasm = wasm.split("i32->ext(").join("(table.get $ext ")
wasm = wasm.split("(i32<-ext").join("(table.set $ext ")
wasm = wasm.split("ext(i32 ").join("(table.set $ext ")

wasm = wasm.split("(i32->fun ").join("(table.get $fun ")
wasm = wasm.split("(i32<-fun ").join("(table.get $fun ")

wasm = wasm.split("(i32.set ").join("(i32.store ")
wasm = wasm.split("(i32.get ").join("(i32.load ")
wasm = wasm.split("(i32.gtu ").join("(i32.gt_u ")
wasm = wasm.split("(i32.gts ").join("(i32.gt_s ")
wasm = wasm.split("(i32.ltu ").join("(i32.lt_u ")
wasm = wasm.split("(i32.lts ").join("(i32.lt_s ")
wasm = wasm.split("(i32.leu ").join("(i32.le_u ")
wasm = wasm.split("(i32.geu ").join("(i32.ge_u ")
wasm = wasm.split("(i32.ges ").join("(i32.ge_s ")
wasm = wasm.split("(i32.les ").join("(i32.le_s ")


wasm = wasm.split("(ui8.set ").join("(i32.store8 ")
wasm = wasm.split("(ui8.get ").join("(i32.load8_u ")
wasm = wasm.split("(u16.set ").join("(i32.store16 ")
wasm = wasm.split("(u16.get ").join("(i32.load16_u ")
wasm = wasm.split("(i16.set ").join("(i32.store16 ")
wasm = wasm.split("(i16.get ").join("(i32.load16_s ")
wasm = wasm.split("f32(set ").join("(f32.store ")
wasm = wasm.split("f32(get ").join("(f32.load ")


wasm = wasm.split("(size elem)").join(`${elems.length}`)
wasm = wasm.split("(TYPES.length)").join(`(i32.const ${TYPES.length})`)
wasm = wasm.split("TYPES.length").join(`${TYPES.length}`)

wasm = `${wasm}\n\t(table $fun ${elems.length} funcref)`
wasm = `${wasm}\n\t(table $str ${strsi+1} externref)`
wasm = `${wasm}\n\t(table $ext ${elems.length} 1000 externref)`
wasm = `${wasm}\n\t(table $ilk ${TYPES.length+1 + Object.keys(consts).length+1} externref)`





wasm = wasm.split("(new $").join("(call $")
wasm = wasm.split("( new $").join("(call $")
wasm = wasm.split("Event.of(").join("(call $Event.of ")
wasm = wasm.replaceAll("Number.of(", "(call $self.Number.of ")
wasm = wasm.replaceAll("Pointer.of(", "(call $Pointer.of ")
wasm = wasm.replaceAll("Number.from(", "(call $self.Number.from<ext>i32 ")
wasm = wasm.replaceAll("Array.of(", "(call $self.Array.of ")
wasm = wasm.replaceAll("Array.from(", "(call $self.Array.from ")
wasm = wasm.split("Object()").join("(call $self.Object)")
wasm = wasm.split("Array()").join("(call $self.Array<>ext)")
wasm = wasm.replaceAll("Boolean(", "(call $self.Boolean ")
wasm = wasm.replaceAll("Boolean.of(", "(call $self.Boolean.of ")


for (let d of wasm.matchAll(/start\(\$(\w*[^)])\)/g)) {
    let [c, $1] = d
    wasm = wasm.replaceAll(c, "(call $start."+$1+")")
}

for (let d of wasm.matchAll(/stop\(\$(\w*[^)])\)/g)) {
    let [c, $1] = d
    wasm = wasm.replaceAll(c, "(call $stop."+$1+")")
}


wasm.match(/\(self.[a-zA-Z0-9._]+/ig)
    ?.map(g=> g.replaceAll(/\(|\)|\s/g, ""))
    ?.map(glob => globalize(glob))
    ?.forEach(([key, glob]) => wasm = wasm.replaceAll(`(${key})`, glob))

functype = (funcname) => {
    for (let [w] of funcname.matchAll(/[^\w]/g)) {
        funcname = funcname.replaceAll(w, `\\${w}`)
    }
    return wasm.match(new RegExp(`${funcname}\\\s+(\\(type\\s\\$.*?\\))`)).at(1)
}



for (let d of wasm.matchAll(/ref\((\$.*?)\)/g)) {
    let [c, $function] = d 

    let fi = fnis.indexOf($function);
    if (fi === -1) {
        fi += fnis.push($function);
        
    refs = `${refs}
    (elem declare ${fi} ${$function})`;
    }

    wasm = wasm.replaceAll(c, `(ref.func ${$function})`);    
}


for (let d of wasm.matchAll(/handle_indirect\((.*?)\)/g)) {
    let [c, $1, $2, $3] = d 
    wasm = wasm.replaceAll(c, `(call_indirect (type $i32->) ${$1})`);    
}

for (let d of wasm.matchAll(/if\s+\$(\w*[^\s\n])/g)) {
    let [c, $1, $2, $3] = d

    if (wasm.indexOf("(global $" + $1) !== -1) {
        wasm = wasm.replaceAll(c, `(global.get $${$1}) if`);    
    } else 
    if (wasm.indexOf("(local $"+$1) !== -1) {
        wasm = wasm.replaceAll(c, `(local.get $${$1}) if`);    
    }
}

for (let d of wasm.matchAll(/malloc\((.[^\$[A-Z]]*)\)/g)) {
    let [c, $1] = d;
    wasm = wasm.replaceAll(c, `(i32.const ${consts.OFFSET_MEMORY_BYTELENGTH.i32}) (global.set $i (i32.rem_u ${$1} (i32.const 8))) (if (result i32) (global.get $i) (then (i32.add ${$1} (i32.sub (i32.const 8) (global.get $i)))) (else ${$1})) (i32.atomic.rmw.add)`)
}

for (let d of wasm.matchAll(/malloc\((.*)/g)) {
    d = getEncosedFrame(d)

    wasm = wasm.replaceAll( d.content, `

        ${d.section}
        (global.set $malloc.byteLength)        
        (global.set $malloc.remainder 
            (i32.rem_u 
                (global.get $malloc.byteLength)
                (i32.const 8)
            )
        ) 
        (i32.atomic.rmw.add
            (i32.const ${consts.OFFSET_MEMORY_BYTELENGTH.i32}) 
            (if (result i32) 
                (global.get $malloc.remainder) 
                (then 
                    (i32.add
                        (global.get $malloc.byteLength)
                        (i32.sub 
                            (i32.const 8) 
                            (global.get $malloc.remainder) 
                        )
                    )
                ) 
                (else
                    (global.get $malloc.byteLength)
                )
            ) 
        )`
    )

}

wasm = wasm.replaceAll("class($", `(call $class.`)




let calfuncs = ""

for (let func in strs) {

    if (strs[func].code) {
        calfuncs += strs[func].code
    } else {
        process.exit(1)
    }
}


for (let elem of elems) {
    if (!clsss[elem]) {
        calfuncs += (
        `
            (elem (i32.const ${elems.indexOf(elem)}) funcref (ref.func ${elem}))
        `
        )
    }
}

for (let elem in clsss ) {
    wasm = wasm.replaceAll( `palloc($${clsss[elem].alias}*)`, __PallocCall__ElemSize( clsss[elem].elem, clsss[elem].size ) )    
}

wasm = wasm.replace( `;; globalized ;;`, `;; globalized ;; \n${calfuncs}\n`)
wasm = wasm.replaceAll("start(", `(call $start `)
wasm = wasm.replaceAll("(; init ;)", `\n        ${__init__}\n`)
wasm = wasm.replaceAll("(; glob ;)", `\n        ${__glob__}\n`)
wasm = wasm.replaceAll(`(ltee $`, `(local.tee $`)
wasm = wasm.replaceAll(");", ")(drop) ")
wasm = wasm.replaceAll("rand()", "(call $Math.random<>f32)")
wasm = wasm.replaceAll(`(i32.load (i32.add (global.get $byteOffset.offset) (i32.mul (global.get $memory*) (i32.const 4))))`, `(i32.load (global.get $byteOffset.offset))`)



wasm = `\n ${wasm}\n ${refs}`
wasm = `\n ${wasm}\n )`


const settings_json = "/Users/airbook/Library/Application Support/Code/User/settings.json";
const settings = fsys.readFileSync( settings_json ).toString().split("//HIGHLIGHTS")
const uniq = {}

settings.splice( 1, 1, "\n\t\t" +
    JSON.stringify(
        [ 
            ...TYPES.sort((a,b) => b.length - a.length).map(t => {return {
                text: " " + t, color: '#44ff4499'
            }}),
            ...Object.keys(consts).map(t => {return {
                text: " " + t, color: '#44ff4499', fontStyle: "italic"
            }}),
            ...Object.values(clsss).map(t => {return {
                text: "*" + t.alias + " ", color: "#56BCF388", fontWeight: "bolder"
            }}),
            ...Object.values(clsss).map(t => {return {
                text: " " + t.alias + "*", color: "aqua", fontWeight: "lighter"
            }}),
            ...Object.values(clsss).map(t => {return {
                text: " " + t.name.substring(1) + "", color: "#fffffff", fontStyle: "italic", fontWeight: "bold"
            }}),
            ...Object.values(clsss).flatMap(p => Object.keys(p.prop).map(t => { return (t.length >= 2) && !uniq[t] && (uniq[t] = {
                text: " " + t, color: "#56BCF3dd", fontWeight: "light", "fontStyle": "italic"
            })}).filter(Boolean))
        ].sort((a,b) => b.text.length - a.text.length)
    )
    .replaceAll("},", "},\n\t\t")
    .replaceAll(/\[|\]/g, "") + ",\n\t\t"
)

fsys.writeFileSync( settings_json, settings.join("//HIGHLIGHTS") )

WASMOFFSET = 0


//process.exit(0)
fsys.writeFileSync( "module.wat", wasm
    .replaceAll("%WASMSIZE%", 12)
    .replaceAll('(import "self" "WebGLQuery")', '(import "self" "drawArrays")')
    .replaceAll('(import "self" "WebGLSync")', '(import "self" "enableVertexAttribArray")')
    .replaceAll('(import "self" "WebGLUniformLocation")', '(import "self" "bindAttribLocation")')
    .replaceAll('(import "self" "WebGLVertexArrayObject")', '(import "self" "vertexAttribPointer")')
    .replace
(
    `
    (memory $memory 20) (data (i32.const 0) "WASMFILE") (start $instantiate)`.trim(),
    `
    (memory $memory                                     (import "self" "memory")                          10000 10000 shared)    
    (start $window)
    `
))

cp = require("child_process")
compile = cp.spawn("wat2wasm", ["module.wat", "--debug-parser", "--enable-threads", "-o", "1"], {})
compile . stderr.on("data", e => process.exit((console.error(`${e}`.split("\n", 7).splice(0, 6).join("\n")))))

compile.on("exit", e => {
    shared = fsys.readFileSync("1")

    fsys.writeFileSync( "module.wat", wasm
        .replace(
            'WASMFILE', "\\" + [ ...shared ].map(n => n.toString(16).padStart(2,"0") ).join("\\")
        )
        .replaceAll("%WASMSIZE%", shared.length)
    )

    compile = cp.spawn("wat2wasm", ["module.wat", "--debug-parser", "--enable-threads", "-o", "favicon.ico"], {})
    compile . stderr.on("data", e => process.exit((console.error(`${e}`.split("\n", 7).splice(0, 6).join("\n")))))
    
    compile.on("exit", e => {
        fsys.unlinkSync("1")
    })
})


