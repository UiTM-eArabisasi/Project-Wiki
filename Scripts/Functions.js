/*!
* Functions.js
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

var wordlist = [];

function init_document() {
    var a = DoTransliterate(element.value),
        b = document.getElementById('prev_label');
    b.innerHTML = a;
}
function DoPreview() {
    var a = $('#inp_txt').val(),
        b = DoTransliterate(a);
    $('#prev_label').text(b);
}
function DoAppendTransliteration() {
    var a = $('#inp_txt').val();
    return 'clear' == a.toLowerCase()
        ? void $('#inp_txt').val('')
        : void $('#inp_txt').val('');
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function findInWordlist(word) {
    var replacedWord = word.replace(/[^A-Z0-9]+/gi, ' ');
    var wordArray = [];
    replacedWord.split(' ').map((item) => {
        wordArray.push({
            Word: item,
            jawi: '',
        });
    });

    wordlist.map(wl => {
        wordArray.map((wa, index) => {
            if (wl.Word == wa.Word) {
                // console.log(wl)
                wordArray[index].jawi = wl.Arab
            }
        })
    })

    var newWord = word
    wordArray.map(item => {
        if (item.jawi !== '') {
            // newWord =  replaceAll(newWord, item.Word, item.jawi);
            var rx = new RegExp("(^|\\s)" + item.Word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "(?!\\S)", "gi");
            newWord = newWord.replace(rx, "$1" + item.jawi);
        } else {
            var translatedWord = DoTransliterate(item.Word);
            var rx = new RegExp("(^|\\s)" + item.Word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "(?!\\S)", "gi");
            newWord = newWord.replace(rx, "$1" + translatedWord);
        }
    })

    // console.log('newWord ', newWord)
    $('#outputWord').text(newWord);
}

$(document).ready(function () {
    let url = 'https://earabisasi.syafiqhadzir.dev/api/Wordlist';
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            data.map((item) => {
                wordlist.push({ ...item, Word: item.Word.toLowerCase() });
            });
        })
        .catch(function (error) {
        });

    $('#inp_txt').keydown(function (a) {
        '13' == a.keyCode && DoAppendTransliteration();
    }),
        $('#inp_txt').keyup(function () {
            DoPreview();
            var inp_txt = $(this).val().toLowerCase();
            findInWordlist(inp_txt);
        }),
        DoPreview();
});