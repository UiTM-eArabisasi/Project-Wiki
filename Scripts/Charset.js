/*!
* Charset.js
* https://earabisasi.syafiqhadzir.dev/
*
* Copyright 2019-2020 Prof. Madya Dr Janudin Sardi Ph.D
* Copyright 2019-2020 Syafiq Hadzir
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software
* is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/

var vowelPrev = false;

/***************************
Function SuperTrim, findstr
Trim string, find characters in string
****************************/
function SuperTrim(str) {
    str = str || '';
    ret = str.replace(/^\s*|\s*$/g, '').replace(/\s+/g, ' ');
    return ret;
}
function findstr(str, tofind) {
    for (var i = 0; i < str.length; i++)
        if (str[i] == tofind)
            return true;
    return false;
}
/***************************
Function isDigit, isPunct, isVowel, isConsonant
Check for digits, punctuations, consonants or vowels (a, e/è/é, i, o, u, ě/ê, ô, ā/ī/ū/ō)
****************************/
function isDigit( /*char*/ a) {
    var str = "0123456789"; // Digits
    return findstr(str, a);
}
function isPunct( /*char*/ a) {
    var str = ",.><?/+=-_}{[]*&^%$#@!~`\"\\|:;()"; // Punctuations
    return findstr(str, a);
}
function isVowel( /*char*/ a) {
    var str = "AaEeÈèÉéIiOoUuÊêĚěĔĕṚṛXxôâāīūō"; // Vowels
    return findstr(str, a);
}
function isConsonant( /*char*/ a) {
    var str = "BCDFGHJKLMNPRSTVWYZbcdfghjklmnpqrstvwxyzḌḍṆṇṢṣṬṭŊŋÑñɲ"; // Consonants
    return findstr(str, a);
}
/***************************
Function isSpecial, isHR, isLW
Check for special characters
****************************/
function isSpecial( /*char*/ a) {
    var str = "GgHhRrYyñ"; //Biconsonant
    return findstr(str, a);
}

function isHR( /*char*/ a) {
    var str = "HhRrŊŋ"; // -rr-
    return findstr(str, a);
}

function isLW( /*char*/ a) {
    var str = "LlWw"; // -ng
    return findstr(str, a);
}

function isCJ( /*char*/ a) {
    var str = "CcJj"; // -nj- & -nc-
    return findstr(str, a);
}
/***************************
Function GetMatra
Vocal (Matra)
****************************/
function GetMatra(str) {
    var i = 0;
    if (str.length < 1) {
        return "";
    }
    while (str[i] == 'h') {
        i++;
        if (i >= str.length) {
            break;
        }
    }
    if (i < str.length) {
        str = str.substring(i);
    }
    var matramap = {
        "ā": "ا", "â": "ا", "e": '', "è": '', "é": '', "i": 'ي', "ī": "ي", "o": 'و', "u": 'و', "ū": "و", "x": "", "ě": "", "ĕ": "", "ê": "", "ō": "و", "ô": "و",
        "A": 'ا', "E": '', "È": '', "É": '', "I": 'ي', "U": 'او', "O": 'و', "X": "", "Ě": "", "Ê": "", "ṛ": "ر",
        "aa": 'ا', "ai": 'اي', "ia": 'اي', "au": 'او', "ua": 'وا', "ii": 'ي', "uu": 'او'
    }
    var matramap;
    if (matramap[str] !== undefined) {
        return matramap[str];
    }
    return "";
}
/***************************
Function GetShift
If biconsonant, return exact character
****************************/
function GetShift(str) {
    str = str.toLowerCase();
    if (str.indexOf("nk") == 0) {
        //suku kata diawali 'nk'
        return {
            "CoreSound": "نک", "len": 2
        };
    } else if (str.indexOf("k") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ق", "len": 2
        };
    } else if (str.indexOf("ss") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "لسّ", "len": 2
        };
    } else if (str.indexOf("sy") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ش", "len": 2
        };
    } else if (str.indexOf("k") > 1) {
        //suku kata memiliki konsonan 'h' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        };
    }
    if (str.indexOf("mp") == 0) {
        //suku kata diawali 'mp'
        return {
            "CoreSound": "مڤ", "len": 2
        };
    } else if (str.indexOf("p") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ف", "len": 2
        };
    } else if (str.indexOf("ll") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "لل", "len": 2
        };
    } else if (str.indexOf("p") > 1) {
        //suku kata memiliki konsonan 'p' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        };
    }
    //nga
    if (str.indexOf("ng") == 0) {
        //suku kata diawali 'ng'
        return {
            "CoreSound": "ڠ", "len": 2
        };
    } else if (str.indexOf("g") == 1) {
        //g
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ݢ", "len": 2
        };
    } else if (str.indexOf("g") > 1) {
        //suku kata memiliki konsonan 'g' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        };
    }
    //nya
    if (str.indexOf("ny") == 0) {
        //suku kata diawali 'ny'
        return {
            "CoreSound": "ڽ", "len": 2
        };
    } else if (str.indexOf("y") == 1) {
        //pengkal
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ي", "len": 2
        };
    } else if (str.indexOf("y") > 1) {
        //suku kata memiliki konsonan 'y' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound += ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        };
    }
    if (str.indexOf("nr") == 0) {
        //hr-
        return {
            "CoreSound": "نر", "len": 2
        };
    } else if (str.indexOf("r") == 1) {
        //cakra
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ر", "len": 2
        };
    } else if (str.indexOf("r") > 1) {
        //suku kata memiliki konsonan 'r' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound += ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        };
    }
    if (str.indexOf("nc") == 0) {
        //nc
        return {
            "CoreSound": "نچ", "len": 2
        };
    } else if (str.indexOf("c") == 1) {
        //c
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "چ", "len": 2
        };
    } else if (str.indexOf("c") > 1) {
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        };
    }
    return {
        "CoreSound": null, "len": 1
    };
}
/***************************
Function GetCoreSound
return aksara nglegana
****************************/
function GetCoreSound(str) {
    var consonantMap = {
        "A": "ا", //A
        "B": "ب", //B
        "C": "چ", //C
        "D": "د", //D
        "E": "اي", //E
        "F": "ف", //F
        "G": "ݢ", //G
        "H": "ه", //H
        "I": "اي", //I
        "J": "ج", //J
        "K": "ک", //K
        "L": "ل", //L
        "M": "م", //M
        "N": "ن", //N
        "O": "او", //O
        "P": "ڤ", //P
        "Q": "ق", //Q
        "R": "ر", //R
        "S": "س", //S
        "Sh": "ش", //Sh
        "Sy": "ش", //Sy
        "T": "ت", //T
        "U": "او", //U
        "V": "ۏ", //V
        "W": "و", //W
        "X": "کس", //X
        "Y": "ي", //Y
        "Z": "ز", //Z
        '​': "", //zws zero-width space
        "a": "ا", //a
        "b": "ب", //b
        "c": "چ", //c
        "d": "د", //d
        "e": "اي", //e
        "f": "ف", //f
        "g": "ݢ", //g
        "h": "ه", //h
        "i": "اي", //i
        "j": "ج", //j
        "k": "ک", //k
        "l": "ل", //l
        "m": "م", //m
        "n": "ن", //n
        "o": "او", //o
        "p": "ڤ", //p
        "q": "ق", //q
        "r": "ر", //r
        "s": "س", //s
        "sh": "ش", //sh
        "sy": "ش", //sy
        "t": "ت", //t
        "u": "او", //u
        "v": "ۏ", //v
        "w": "و", //w
        "x": "اکس", //x
        "y": "ي", //y
        "z": "ز", //z
        "È": "کس", //È
        "É": "کس", //É
        "è": "کس", //è
        "é": "کس", //é
        "ã": "ع" //ã
    }
    var consonantMap;
    var h_shift = GetShift(str);
    var core = str;
    if (h_shift["CoreSound"] == null) {
        if (consonantMap[str.charAt(0)]) core = consonantMap[str.charAt(0)];
        return {
            "CoreSound": core,
            "len": 1
        };
    } else {
        return h_shift;
    }
}
/***************************
Function ResolveCharacterSound
Return punctuations, digits, vocals
****************************/
function ResolveCharacterSound(c) {
    var str = "" + c;
    if (isDigit(c)) {
        return "" + ('' + (c - '0'));
    } else if (isConsonant(str[0])) {
        return "" + GetCoreSound(str).CoreSound + "";
    } else {
        {
            return "" + GetCoreSound(str).CoreSound;
        }
    }
}
/***************************
Function GetSound
Transliteration function
****************************/
function GetSound(str) {
    str = SuperTrim(str);
    if (str == null || str == "") {
        return "";
    }
    if (str.length == 1) {
        return ResolveCharacterSound(str[0]);
    } else {
        var core_sound = GetCoreSound(str);
        //return "1" + core_sound.CoreSound + "2";
        var matra = "";
        var konsonan = "";
        if (core_sound.len >= 1) {
            matra = GetMatra(str.substring(core_sound.len));
        } else {
            matra = "";
        }
        if (str.indexOf("nggr") == 0) {
            //nggr-
            if (vowelPrev) konsonan = "ڠݢر";
        } else if (str.indexOf("ngg") == 0) {
            //ngg-
            if (vowelPrev) konsonan = "ڠݢ";
        } else if (str.indexOf("sy") == 0) {
            //-sy-
            if (vowelPrev) konsonan = "ش";
        } else if (str.indexOf("ss") == 0) {
            //-sy-
            if (vowelPrev) konsonan = "لسّ";
        } else if (str.indexOf("njl") == 0) {
            //njl-
            konsonan = "نجل";
        } else if (str.indexOf("njr") == 0) {
            //njr-
            konsonan = "ڠݢ";
        } else if (str.indexOf("ngg") == 0) {
            //njr-
            if (vowelPrev) konsonan = "ڠݢ";
        } else if (core_sound.CoreSound == "ᬦᬜ᭄ᬘ") {
            // -nc-
            konsonan = "ڽچ";
            //-nyc-/*
        } else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ᭄ᬮ") {
            // -njl-
            konsonan = "نجل";
            //-njl-
        } else if (core_sound.CoreSound == "انجر") { // -njr-
            konsonan = "نجر"; //-njr-*/
        } else if (core_sound.CoreSound == "انج") { // -nj-
            konsonan = "نج"; //-nyj-
        } else if (core_sound.CoreSound == "ᬤᬟ᭄ᬯ") {
            // -dhw-
            konsonan = "ᬟ᭄ᬯ";
            //-dhw-
        } else if (core_sound.CoreSound == "ᬤᬟ") {
            // -dhy-
            konsonan = "ᬟ";
            //-dhy-
        } else if (core_sound.CoreSound == "ᬢᬝ᭄ᬯ") {
            // -thw-
            konsonan = "ᬝ᭄ᬯ";
            //-dhw-
        } else if (core_sound.CoreSound == "ᬢᬝ") {
            // -thy-
            konsonan = "ᬝ";
            //-dhy-
        } else if (findstr(core_sound.CoreSound, '') && matra == "᭄") {
            // pengkal
            konsonan = core_sound.CoreSound;
            matra = "";
            //-y-
        } else if (findstr(core_sound.CoreSound, '') && matra == "᭄") {
            // cakra
            konsonan = core_sound.CoreSound;
            matra = "᭄ᬭ";
            //-r-
        } else if (findstr(core_sound.CoreSound, '᭄ᬭ') && matra == "ᭂ") {
            // cakra keret
            if ((str[0] == "n" && str[1] == "y") || ((str[0] == "t" || str[0] == "d") && str[1] == "h")) {
                konsonan = GetCoreSound(str[0] + str[1]).CoreSound + "";
                matra = "";
                //nyrê-, thrê-, dhrê-
            } else if (str[0] == "n" && str[1] == "g") {
                if (str[2] == "g") konsonan = "ᬗ᭄ᬕ"; else konsonan = "ᬗ";
                matra = "";
                //nggrê-/ngrê-
            } else {
                konsonan = GetCoreSound(str[0]).CoreSound + "";
                matra = "";
                //-rê-
            }
        } else if (findstr(core_sound.CoreSound, 'ᬮ') && matra == "ᭂ") {
            // nga lelet
            if ((str[0] == "n" && str[1] == "y") || ((str[0] == "t" || str[0] == "d") && str[1] == "h")) {
                konsonan = GetCoreSound(str[0] + str[1]).CoreSound + "᭄ᬮᭂ";
                matra = "";
                //nylê-, thlê-, dhlê-
            } else if (str[0] == "n" && str[1] == "g") {
                if (str[2] == "g") konsonan = "ᬗ᭄ᬕ᭄ᬮᭂ"; else konsonan = "ᬗ᭄ᬮᭂ";
                matra = "";
                //ngglê-/nglê-
            } else if (str[0] == "l") {
                konsonan = "ᬍ";
                matra = "";
                //-lê-
            } else {
                konsonan = GetCoreSound(str[0]).CoreSound + "᭄ᬮᭂ";
                matra = "";
                //-lê-
            }
        } else if (core_sound.CoreSound == 'ᬝ᭄ᬭ' || core_sound.CoreSound == 'ᬟ᭄ᬭ' || core_sound.CoreSound == 'ᬗ᭄ᬭ' || core_sound.CoreSound == 'ᬜ᭄ᬭ') {
            // i.e. nyruput
            konsonan = core_sound.CoreSound;
            if (matra == "᭄") matra = "";
        } else if (core_sound.CoreSound == "ᬮᬮ᭄ᬮ") {
            // -ll-
            konsonan = "ᬮ᭄ᬮ";
            //double -l-
        } else if (core_sound.CoreSound == "ᬃᬃᬭ") {
            // -rr-
            konsonan = "ᬃᬭ";
            //double -r-
        } else if (core_sound.CoreSound == "ᬃᬃᬳ") {
            // -rh-
            konsonan = "ᬃᬳ";
            //-rh-
        } else if (core_sound.CoreSound == "ᬃᬃᬮ") {
            // -rl-
            konsonan = "ᬃᬮ";
            //-rl-
        } else if (core_sound.CoreSound == "ᬃᬃᬯ") {
            // -rw-
            if (vowelPrev) konsonan = "ᬃᬯ";
            //-rw- -- arwana else konsonan = "ᬭ᭄ᬯ";
            //rw- -- rwa/rwi/rwab
        } else if (core_sound.CoreSound == "ᬃᬃᬘ") {
            // -rc-
            konsonan = "ᬃᬘ";
            //-rc-
        } else if (core_sound.CoreSound == "ᬄᬄᬳ") {
            // -hh-
            konsonan = "ᬄᬳ";
            //double -h-
        } else if (core_sound.CoreSound == "ᬄᬄᬮ") {
            // -hl-
            if (vowelPrev) konsonan = "ᬄᬮ";
            //-hl- else konsonan = "ᬳ᭄ᬮ";
            //hlam
        } else if (core_sound.CoreSound == "ᬄᬄᬯ") {
            // -hw-
            if (vowelPrev) konsonan = "ᬄᬯ";
            //-hw- else konsonan = "ᬳ᭄ᬯ";
            //hwab,hwan
        } else if (core_sound.CoreSound == "ᬄᬳ") {
            // -hy-
            if (vowelPrev) konsonan = "ᬄᬬ";
            //sembahyang else konsonan = "ᬳ";
            //hyang/*
        } else if (core_sound.CoreSound == "ᬄᬄ") {
            // hrx-
            konsonan = "ᬳ᭄ᬭ";
            //hrx-
        } else if (core_sound.CoreSound == "ᬄᬄ᭄ᬭ") {
            // hr-
            if (matra == "ᭂ") konsonan = "ᬳ";
            //hr- else konsonan = "ᬳ᭄ᬭ";
            //hr-
        } else if (core_sound.CoreSound == "ᬄᬳ᭄ᬭ") {
            // hr-
            if (matra == "ᭂ") konsonan = "ᬳ";
            //hr- else konsonan = "ᬳ";
            //hr-
        } else if (core_sound.CoreSound == 'ᬄ' && matra == "᭄") {
            // wignyan - 12 April
            konsonan = "ᬳ";
            //ha
        } else if (core_sound.CoreSound == 'ᬄ' && matra != "᭄") {
            // wignyan
            konsonan = "ᬳ";
            //ha
        } else if (core_sound.CoreSound == 'ᬃ' && matra == "ᭂ") {
            // pa cerek
            konsonan = "ᬋ";
            matra = "";
            //rê
        } else if (core_sound.CoreSound == 'ᬃ' && matra != "᭄") {
            // layar
            konsonan = "ᬭ";
            //ra
        } else if (core_sound.CoreSound == 'ᬂ' && matra != "᭄") {
            // cecak
            konsonan = "ᬗ";
            //nga
        } else if (core_sound.CoreSound == 'ᬂ' && matra == "᭄") {
            // cecak
            konsonan = "ᬂ";
            matra = "";
            //cecak
        } else {
            konsonan = core_sound.CoreSound;
        }
        return "" + konsonan + matra;
    }
}
/***************************
Function DoTransliterate
Main Function
****************************/
function DoTransliterate(str) {
    var i = 0;
    var ret = "";
    var pi = 0;
    var vowelFlag = false, angkaFlag = false;
    var angka = { "0": '٠', "1": '١', "2": '٢', "3": '٣', "4": '٤', "5": '٥', "6": '٦', "7": '٧', "8": '٨', "9": '٩' }
    startVowel = false;
    str = SuperTrim(str);
    while (i < str.length) {
        if (i > 0 && isVowel(str[i]) && isVowel(str[i - 1])) { //deal with words that start with multiple vocals
            if ((str[i - 1] == 'a' && str[i] == 'a') || (str[i - 1] == 'i' && str[i] == 'i') || (str[i - 1] == 'u' && str[i] == 'u') || (str[i - 1] == 'a' && str[i] == 'i') || (str[i - 1] == 'a' && str[i] == 'u')) {//specials
                if (i == 1 || (i > 1 && !isConsonant(str[i - 2]))) { //for example if starts with 'ai-'
                    str = str.substring(0, i) + 'h' + str.substring(i, str.length);
                }
                //else, do nothing, look in matramap table
            } else if ((str[i - 1] == 'e' || str[i - 1] == 'è' || str[i - 1] == 'é') && (str[i] == 'a' || str[i] == 'o')) {//-y-
                str = str.substring(0, i) + 'y' + str.substring(i, str.length);
            } else if ((str[i - 1] == 'i') && (str[i] == 'a' || str[i] == 'e' || str[i] == 'è' || str[i] == 'é' || str[i] == 'o' || str[i] == 'u')) {//-y-
                str = str.substring(0, i) + 'y' + str.substring(i, str.length);
            } else if ((str[i - 1] == 'o') && (str[i] == 'a' || str[i] == 'e' || str[i] == 'è' || str[i] == 'é')) {//-w-
                str = str.substring(0, i) + 'w' + str.substring(i, str.length);
            } else if ((str[i - 1] == 'u') && (str[i] == 'a' || str[i] == 'e' || str[i] == 'è' || str[i] == 'é' || str[i] == 'i' || str[i] == 'o')) {//-y-
                str = str.substring(0, i) + 'w' + str.substring(i, str.length);
            } else {
                str = str.substring(0, i) + 'h' + str.substring(i, str.length);
            }
        }
        if ((isSpecial(str[i])) && !vowelFlag) {
            //i++;
        } else if ((str[i] == 'h' && vowelFlag) || (!isVowel(str[i]) && i > 0) || (str[i] == ' ') || isPunct(str[i]) || isDigit(str[i]) || ((i - pi) > 5)) {
            if (!isDigit(str[i]) && angkaFlag) { //turn off the flag
                ret += "";// with zws
                angkaFlag = false;
            }
            ret += GetSound(str.substring(pi, i));
            if (str[i] == ' ') { ret += ' '; }
            if (isPunct(str[i])) {
                ret += str[i];
                pi = i + 1;
            }
            else if (isDigit(str[i])) {
                ret += angka[str[i]];
                angkaFlag = true;
                pi = i + 1;
            } else {
                pi = i;
            }
            vowelFlag = false;
        } else if (isVowel(str[i]) && str[i] != 'h') {
            //ret += GetSound(str.substring(pi, i));
            vowelFlag = true;
        }
        if (pi > 0 && isVowel(str[pi - 1])) {
            vowelPrev = true;
        } else vowelPrev = false;
        i++;
    }
    //endwhile
    if (pi < i) {
        ret += GetSound(str.substring(pi, i));
    }
    return SuperTrim(ret);
}