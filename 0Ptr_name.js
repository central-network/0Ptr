/* Õ𝓟ṭṙ */
/* Õ𝓟ṭṙ */
var O, Ovariations, P, Pvariations, R, Rvariations, T, Tvariations, _name, c, cls, clsss, cols, exec, i, j, k, kScreen, l, len, len1, len2, len3, rows;

try {
  Ovariations = ["Ō", "Ȏ", "Õ"] || ["Ò", "Ó", "Ô", "Õ", "Ö", "Ō", "Ŏ", "Ő", "Ơ", "Ǒ", "Ǫ", "Ȍ", "Ȏ", "Ȯ", "ᴼ", "Ọ", "Ỏ", "Ⓞ", "Ｏ", "𝐎", "𝑂", "𝑶", "𝒪", "𝓞", "𝔒", "𝕆", "𝕺", "𝖮", "𝗢", "𝘖", "𝙊", "𝙾", "🄞", "🄾"];
  kScreen = "ˆscreen";
  kScreen = "Øscreen";
  Pvariations = ["𝑃", "𝑷", "𝒫", "𝓟", "𝔓", "𝕻", "𝖯", "𝗣", "𝘗", "𝙋", "𝙿"];
  Tvariations = ["ₜ"] || ["ţ", "ť", "ț", "ᵗ", "ṫ", "ṭ", "ṯ", "ṱ", "ẗ", "ₜ", "⒯", "ⓣ", "㏏", "ﬅ", "ﬆ", "ｔ", "𝐭", "𝑡", "𝒕", "𝓉", "𝓽", "𝔱", "𝕥", "𝖙", "𝗍", "𝘁", "𝘵", "𝙩", "𝚝"];
  Rvariations = ["ʳ", "ᵣ"] && ["ŕ", "ŗ", "ř", "ȑ", "ȓ", "ʳ", "ᵣ", "ṙ", "ṛ", "ṟ", "⒭", "ⓡ", "㋍", "㍴", "㎭", "㎮", "㎯", "㏛", "ｒ", "𝐫", "𝑟", "𝒓", "𝓇", "𝓻", "𝔯", "𝕣", "𝖗", "𝗋", "𝗿", "𝘳", "𝙧", "𝚛"];
  clsss = [];
  rows = 0;
  cols = 0;
  for (i = 0, len = Ovariations.length; i < len; i++) {
    O = Ovariations[i];
    for (j = 0, len1 = Pvariations.length; j < len1; j++) {
      P = Pvariations[j];
      for (k = 0, len2 = Tvariations.length; k < len2; k++) {
        T = Tvariations[k];
        for (l = 0, len3 = Rvariations.length; l < len3; l++) {
          R = Rvariations[l];
          _name = [O, P, T, R].join("");
          exec = `(class ${_name} extends Number {})`;
          cls = null;
          try {
            cls = eval(exec);
          } catch (error) {}
          if (cls) {
            try {
              c = new cls(2);
            } catch (error) {}
            if (c) {
              if (!clsss[rows]) {
                clsss[rows] = {};
              }
              if (!clsss[rows][cols]) {
                clsss[rows][cols] = c;
              }
              if (cols++ > 20) {
                cols = 0;
                rows++;
              }
            }
          }
        }
      }
    }
  }
  console.table(clsss);
} catch (error) {}
