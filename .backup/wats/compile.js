fs = require("fs")
cp = require("child_process")

let wats = fs
    .readdirSync("./")
    .filter(n=>n.endsWith(".wat"))
    .map(w => fs.readFileSync(`./${w}`)).join("\n")

let CONSTANTS = {}
let OFFSET = {
    byteOffset : 728
}

let CLASSES = [,]
let FUNCTIONS = [,]
let IMPORTS = [
    `(func $self.console.log<fun> (import "console" "log") (type $fun->))`
]
let TYPES = ["NULL"]

let compile = function ( code ) {
    fs.writeFileSync( `./combined.wats`, code )
    compile = cp.spawn("wat2wasm", ["./combined.wats", "--enable-threads", "-o", "combined.wasm"], {})
    //compile = cp.spawn("wat2wasm", ["./combined.wat", "--debug-parser", "--enable-all", "-o", "combined.wasm"], {})
    compile . stderr.on("data", e => {
        fs.writeFileSync( `../module.wat`, code )
        process.exit((console.error(`${e}`.split("\n", 7).splice(0, 6).join("\n"))))
    })

    compile.on("exit", e => {
        shared = fs.readFileSync("./combined.wats")
    
        fs.writeFileSync( "../module.wat", code
            .replace(
                'WASMFILE', "\\" + [ ...shared ].map(n => n.toString(16).padStart(2,"0") ).join("\\")
            ).replaceAll("%WASMSIZE%", shared.length)
        )
    
        compile = cp.spawn("wat2wasm", ["../module.wat", "--enable-threads", "-o", "../0"], {})
        //compile = cp.spawn("wat2wasm", ["./module.wat", "--debug-parser", "--enable-all", "-o", "0"], {})
        compile . stderr.on("data", e => process.exit((console.error(`${e}`.split("\n", 7).splice(0, 6).join("\n")))))
        
        compile.on("exit", e => fs.unlinkSync("./combined.wats"))
        compile.on("exit", e => fs.unlinkSync("./combined.wasm"))
    })
}

let findNumberType = function ( number ) {
    if (!isNaN(number *= 1)) {
        if (Number.isFinite(number)) {
            if (Number.isInteger(number)) {
                return "i32"
            }
        }
    }
    return "f32"
}

let commentMatch = function ( match ) {
    wats = 
        wats.substring( 0, match.index ) + 
        ('').padStart( match[0].length, " ") +
        wats.substring( match[0].length + match.index ) 
}

let findContants = function () {

    for (let C of wats.matchAll(/([A-Z][A-Z0-9_]+)\s+\=\s+(\-?\d+\.?\d*)/g)) {
        CONSTANTS[ C[1] ] = {
            value : parseFloat(C[2]),
            type : findNumberType(C[2])
        }
    }

    for (let C of wats.matchAll(/([A-Z][A-Z0-9_]+)/g)) {
        !TYPES.includes(C[1]) && (CONSTANTS[ C[1] ] = {
            value : TYPES.push(C[1])-1,
            type : "i32"
        })
    }
}


getEncosedFrame = ( match, enclosedWith = [ "(", ")" ], minIndex ) => {
    let starti = match.input.indexOf( enclosedWith[0], minIndex || match.index )
    let opener = starti;
    let substr, subiof;
    let maxRetry = 100 ;

    while (--maxRetry) {
        subiof = match.input.indexOf(enclosedWith[1], opener) + enclosedWith[0].length
        substr = match.input.substring(starti, subiof)

        if ( substr.split(enclosedWith[0]).length === substr.split(enclosedWith[1]).length) 
        { break } else { opener = subiof }
    }    
    
    if(!maxRetry) { process.exit(+!console.log("maxRetry", match[0])) }


    let frame = {
        content : match.input.substring(match.index, subiof),
        section : substr.substring(
            enclosedWith[0].length, 
            substr.length - enclosedWith[1].length 
        ).trim()
    }

    return frame
}

const memop = {
    load : (type) => { switch ( true ) {
        case "f32" === type: return "f32.load" 
        case "f64" === type: return "f64.load" 
        case "i16" === type: return "i32.load16_s" 
        case "u16" === type: return "i32.load16_u" 
        case  "i8" === type: return "i32.load8_s" 
        case  "u8" === type: return "i32.load8_u" 
        case  "32" === type.substr(-2): return "i32.load" 
        case  "64" === type.substr(-2): return "i64.load" 
    }},

    store : (type) => { switch ( true ) {
        case "f32" === type: return "f32.store" 
        case "f64" === type: return "f64.store" 
        case   "8" === type.substr(-1): return "i32.store8" 
        case  "16" === type.substr(-2): return "i32.store16" 
        case  "32" === type.substr(-2): return "i32.store" 
        case  "64" === type.substr(-2): return "i64.store" 
    }}
}

let findClasses = function ( classes = CLASSES ) {

    let classNames = wats.match(/(class\s+)([A-Z]\w+)/g).slice().map(n => n.substr(6))
    let classRegex = new RegExp(`([\\\S].*?)(?:\\\s\\=\\\s+)(${classNames.join("|")})`, "g")

    for (let C of wats.matchAll(/class\s+(.*?)\s+extends\s+(.*?)\s+/g)) {
        let [ match, name, parent ] = C
        let content = getEncosedFrame( C, ["{", "}"] ).section

        let class_ = classes[classes.length] = { 
            name,
            alias : name[0].toLowerCase() + name.substr(1), 
            parent, 
            elem: classes.length + FUNCTIONS.length, 
            size : 0,
            prop : [] 
        }
        
        wats = wats.replace( match[0], "" )
        
        for (let m of ptrs = content.matchAll( classRegex )) {
            //console.log( m.at(1) + "*", [m.at(2)] )
            
            class_.prop.push({
                type : "i32",
                name : m.at(1),
                class : m.at(2),
                suffix : "*",
                offset : class_.size
            }) 

            class_.size += 4
            content = content.replace(m[0], "")
        }        

        for (let m of funcs = content.matchAll(/([a-z]\w+[^\s])\s+(?:[\(\)].*\{)/g)) {
            let frame = getEncosedFrame( m, ["{", "}"] )
//            console.log( [m.at(1)],frame.section.replaceAll(/\s+/g, " ") )
            content = content.replace(frame.content, "")
        }        

        for (let m of typs = content.matchAll(/([a-z]\w+)(?:\s+)(?:[\=])\s+([A-Z0-9_]+(?:\D+[A-Z_|]))+/g)) {
//            console.log( m.at(1), m.at(2).match(/(\w+)/g) )
            content = content.replace(m[0], "")
        }        

        for (let m of refs = content.matchAll(/([a-z]\w+)(?:\s+)(?:[\=])\s+((?:\w\d{1,2}(?:x?\d))|(?:\w{3}))/g)) {
//            console.log( m.at(1), new RegExp(m.at(2)) )
            content = content.replace(m[0], "")
        }        

        for (let m of getters = content.matchAll(/get\s+(.*?)\s+\(\s?\)\s+/g)) {
            let minIndex;
            if (m[1].startsWith("[")) {
                minIndex = content.indexOf("]", m.index)
                m[1] = m[1].match(/([^[|"|'|`].[^[|"|'|`]*)/).at(1)
            }
            let getter = getEncosedFrame( m, ["{", "}"], minIndex ).section

//            console.log( "get " + m.at(1), getter.replaceAll(/\S/g, " ") )
            content = content.replace(m[0], "")
        }        
        
        for (let m of callers = content.matchAll(/(^\w+[^get])\s+(.*?)\s+/g)) {
            let caller = getEncosedFrame( m, ["{", "}"] ).section
//            console.log("fun " + m.at(1) + "()", caller )
            content = content.replace(m[0], "")
        }        

    }
    //console.log(classes)

    return classes;
}

let findFunctions = function ( code = wats, functions = {} ) {

    if (code === wats) {
        functions = FUNCTIONS
    }

    let FUNCTION;

    for (let C of code.matchAll(/(self\..*?)\s+\=\s+function\s+/g)) {
        self = getEncosedFrame(C);
        code = code.replace(self.content, "")
    }
    
    for (let C of code.matchAll(/([\w][a-zA-Z0-9_]+)\s+\=\s+(=?function\s+(\D[^}]*)\})/g)) {

        let params = []
        let result = []

        functions.push(FUNCTION = {
            name : C[1],
            elem : FUNCTIONS.length,
        })

        if ( fntype = C[0].match(/function\s+\((.*[^,])\)(?=\W+\{)/) ) {
            params = fntype[1].split(",").map(t => 
                t.trim()
                .replaceAll("any", "")
                .replaceAll("fun", "funcref")
                .replaceAll("ext", "externref")
            )

        } if ( fntype = C[0].match(/\(type\s+(.*?)->(.*?)\)/) ) {
            params = fntype[1]
            result = fntype[2]
        } else {
            if (rmatch = C[0].match(/\(result\s+(.*?)\)/) ) {
                result = rmatch[1];
            }
            
            if (pmatch = C[0].matchAll(/\(param\s+(.*?)\)/g)) {
                for (let [,param] of pmatch) {
                    params.push(param)
                }
            }
        }


        Object.assign(FUNCTION, {
            params, 
            result,
        })

        code = C[3].substring( C[3].indexOf("{")+1 ).replaceAll(/\n+|\t+|\s+/g, " ").trim()
        watcode = ""


        //[any].[any].[any]
        for (let m of code.matchAll(/(?:\w+\.)+\w+/g)) 
        {
            let [chain] = m
            
            if (chain.startsWith("self.")) {
                FUNCTION.name = chain
                
                if (code.substring(m.index + chain.length).trim().startsWith("(")) {
                    if (chain.split(".").length <= 3) {
                        console.log(chain)
                        //importable self function
                    }
                }
            }

            if (chain.includes("console.")) {
                let ctyp = chain.match(/console\.(\w+)/).at(1)
                let arg0 = getEncosedFrame(code.match( new RegExp(chain))).section;
                if (arg0.startsWith("arguments")) {
                    let argi = /\[(\d+)\]/.exec(arg0).at(1)
                    let type = params[argi]
                    let func = `$self.console.${ctyp}<${type}>`
                    let impc = `(func ${func} (import "console" "${ctyp}") (type $${type}->))`;
                    
                    if (!IMPORTS.includes(impc)) {
                        IMPORTS.push(impc)
                    }
                    
                    watcode = `${watcode}
        (call ${func} (local.get ${argi}))`
                }
            }

            if (chain.includes("requestAnimationFrame")) {
                let arg0 = getEncosedFrame(code.match( new RegExp(chain))).section;
                if (arg0.startsWith("arguments")) {
                    
                } else if ( fn = FUNCTIONS.slice(1).find(f => f.name.includes(arg0) ) ) {
                    watcode = `${watcode}
;;        (call $self.requestAnimationFrame<fun> (ref.func $${arg0}))`
                }
            }
        }

        Object.assign(FUNCTION, {
            code : watcode,
        })

    }

    return functions;
}

convertArgs = ( args ) => {
    return `${args}`.split(".").flatMap( arg => {
        if (m = arg.match(/(ext|fun)(?=(\d))/)) {
            arg = `${m[1]}x${m[2]}`
        }
        let [p, l = 1] = arg.split(/x(?=\d)/)
        return new Array(+l).fill(p)
    }).join(" ")
}

convertType = (type) => {
    let [, $params, $result ] = type.match(/\(type\s+\$(.*?)->(.*?)\)/)
    
    params = $params && `(param ${convertArgs($params)})` || ``
    result = $result && `(result ${convertArgs($result)})` || ``

    return (`${params} ${result}`
        .replaceAll("fun","funcref")
        .replaceAll("ext","externref")
        .replaceAll("any","")
    .trim())
}

findFunctions()
findClasses()
findContants()

//console.log({CONSTANTS, TYPES, FUNCTIONS} )

$ = `
    (global $self (import "self" "self") externref)

    (func   $self.Reflect.get<ext2>ext          (import "Reflect" "get")                (type $ext2->ext))
    (func   $self.requestAnimationFrame<fun>    (import "self" "requestAnimationFrame") (type $fun->))
    
    ${IMPORTS.join("\n\t")}

    (memory 1000 1000 shared)
    (global $OFFSET.byteOffset (mut i32) (i32.const ${OFFSET.byteOffset}))

    (func   $get<*>offset                   (type $i32->i32)
        (i32.add
            (i32.mul (local.get 0) (i32.const 4))
            (global.get $OFFSET.byteOffset) 
        )
        (i32.load)
    )

    (func   $get<*.at>offset              (type $i32x2->i32)
        (if (result i32) (local.get 1)
            (then 
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
                (i32.add (local.get 1))
            )
            (else 
                (i32.add
                    (i32.mul (local.get 0) (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
        )
        (i32.load)
    )


    (func   $instantiate (export "instantiate")
        (call $self.requestAnimationFrame<fun>
            (ref.func $onanimationframe) 
        )
    )

    (start  $instantiate)
`

ptriOffsetLoader = ( offset, varget = '(local.get 0)' ) => { 
    if (!offset) {

return `(i32.load
            (i32.add
                (i32.mul ${varget} (i32.const 4))
                (global.get $OFFSET.byteOffset) 
            )
        )`
    }

return `(i32.add 
            (i32.load
                (i32.add
                    (i32.mul ${varget} (i32.const 4))
                    (global.get $OFFSET.byteOffset) 
                )
            )
            (i32.const ${offset})
        )` 
}

for (let {name, alias, prop} of CLASSES.slice(1)) { $ = `${$}
    ;; ${name}
    (func   $new<>${alias}* 
    (type $->i32)
    
        (i32.const 0)
    )
    ${prop.map(({name: prop, type, offset, prefix = '', suffix = ''}) => { return `
    (func   $get<${alias}*>${prefix}${prop}${suffix} 
    (type $i32->i32)

        ${ptriOffsetLoader(offset)}
        (${memop.load(type)})
    )

    (func   $set<${alias}*.${prefix}${prop}${suffix}> 
    (type $i32x2->)

        ${ptriOffsetLoader(offset)} 
        (local.get 1)
        (${memop.store(type)})
    )
    `}).join("\n")
    }
`}


for (let {name, code, params, result} of FUNCTIONS.slice(1)) { 
    $ = `${$}
    (func   $${name} (param ${params.join(" ")}) (result ${result.join(" ")})
        ${code}
    )
`}

for (let {name, elem} of FUNCTIONS.slice(1)) { $ = `${$}
    (elem   declare ${elem} $${name})`}

for (let {name, parent, elem, alias} of CLASSES.slice(1)) { $ = `${$}
    (elem   declare ${elem} $new<>${alias}*) ;; debug`}

/*
$ = `${$}
    (table  $fun ${CLASSES.length + FUNCTIONS.length} funcref) ;; debug`
*/

for (let [ type ] of $.matchAll(/\(type\s+\$(.*?)->(.*?)\)/g)) {
    $ = $.replaceAll( type, convertType( type ) )
}

$ = $
    .replaceAll( "(param )", "" )
    .replaceAll( "(result )", "" )

compile(`(module\n${$}\n)`)