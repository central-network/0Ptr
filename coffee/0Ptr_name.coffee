
### Õ𝓟ṭṙ ###
### Õ𝓟ṭṙ ###

try
    Ovariations = [
        "Ō",
        "Ȏ",
        "Õ",
    ] or [
        "Ò",
        "Ó",
        "Ô",
        "Õ",
        "Ö",
        "Ō",
        "Ŏ",
        "Ő",
        "Ơ",
        "Ǒ",
        "Ǫ",
        "Ȍ",
        "Ȏ",
        "Ȯ",
        "ᴼ",
        "Ọ",
        "Ỏ",
        "Ⓞ",
        "Ｏ",
        "𝐎",
        "𝑂",
        "𝑶",
        "𝒪",
        "𝓞",
        "𝔒",
        "𝕆",
        "𝕺",
        "𝖮",
        "𝗢",
        "𝘖",
        "𝙊",
        "𝙾",
        "🄞",
        "🄾"
    ]

    kScreen   = "ˆscreen"
    kScreen   = "Øscreen"

    Pvariations = [
        "𝑃"
        "𝑷"
        "𝒫"
        "𝓟"
        "𝔓"
        "𝕻"
        "𝖯"
        "𝗣"
        "𝘗"
        "𝙋"
        "𝙿"
    ]

    Tvariations = [
        "ₜ",
    ] or [
        "ţ",
        "ť",
        "ț",
        "ᵗ",
        "ṫ",
        "ṭ",
        "ṯ",
        "ṱ",
        "ẗ",
        "ₜ",
        "⒯",
        "ⓣ",
        "㏏",
        "ﬅ",
        "ﬆ",
        "ｔ",
        "𝐭",
        "𝑡",
        "𝒕",
        "𝓉",
        "𝓽",
        "𝔱",
        "𝕥",
        "𝖙",
        "𝗍",
        "𝘁",
        "𝘵",
        "𝙩",
        "𝚝"
    ]

    Rvariations = [
        "ʳ",
        "ᵣ",
    ] and [
        "ŕ",
        "ŗ",
        "ř",
        "ȑ",
        "ȓ",
        "ʳ",
        "ᵣ",
        "ṙ",
        "ṛ",
        "ṟ",
        "⒭",
        "ⓡ",
        "㋍",
        "㍴",
        "㎭",
        "㎮",
        "㎯",
        "㏛",
        "ｒ",
        "𝐫",
        "𝑟",
        "𝒓",
        "𝓇",
        "𝓻",
        "𝔯",
        "𝕣",
        "𝖗",
        "𝗋",
        "𝗿",
        "𝘳",
        "𝙧",
        "𝚛"
    ]

    clsss = []

    rows = 0
    cols = 0

    for O in Ovariations then for P in Pvariations
        for T in Tvariations then for R in Rvariations
            _name = [O,P,T,R].join("")
            exec = "(class #{_name} extends Number {})"
            cls = null
            try cls = eval( exec )
            if cls
                
                try c = new cls(2)

                if  c
                    unless clsss[ rows ]
                        clsss[ rows ] = {}

                    unless clsss[ rows ][ cols ]
                        clsss[ rows ][ cols ] = c

                    if  cols++ > 20
                        cols = 0
                        rows++

    console.table clsss