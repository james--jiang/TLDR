/**
    This callback function is called when the content script has been 
    applied and returned its results.

    Sentence Array parameters are all the same sentence array. First add_words, 
    then update_score, then sum_sentence, then print_final.

**/
var summary_count = 0;
var pageDetails_holder;
var user_size_pref = 0.0;

function onPageDetailsReceived(pageDetails)  { 
    var article_text = pageDetails.summary;
    var sentence_array = makeSentences(article_text);

    title_arr = clean_title(pageDetails.title);

    add_words(sentence_array);
    update_score();
    sum_sentence(sentence_array);

    var e = document.getElementById("selected");
    user_size_pref = parseFloat(e.options[e.selectedIndex].value);

    var summarized = print_final(sentence_array);

    document.getElementById('title').textContent = pageDetails.title; 
    //document.getElementById('url').textContent = pageDetails.url;

    if (pageDetails.summary == '') {
        document.getElementById('summary').innerText = "Please highlight the text you would like to summarize.";
        document.getElementById('summary_count').textContent = "nothing :( ";
         // will be the final ordered lists
    } else {
        document.getElementById('article_count').textContent = String(sentence_array.length);
        document.getElementById('summary_count').textContent = String(summary_count);
        document.getElementById('summary').innerText = summarized; 
    }
    
} 

function myFunction() {
    onPageDetailsReceived(pageDetails_holder);
}

/** 
    Determines whether user wants to summarize the highlighted text or whole text.
**/
function selectOrWhole(pageDetails) {
    // if (pageDetails.summary == '') {
    //     //chrome.tabs.executeScript(null, { file: 'w_contscrpt.js' });

    //     //chrome.runtime.onMessage.addListener(function(message)  { 
    //     // Call the onPageDetailsReceived function in popup.js .
    //     //onPageDetailsReceived(message); 
    //     onPageDetailsReceived(pageDetails);
    // } else {
        pageDetails_holder = pageDetails;
        onPageDetailsReceived(pageDetails);
    // }
}


function makeSentences(article_text) {
    return make_sent(article_text);
}

/* 
validate_sent in which checks extraneous cases. This function mostly includes
conditionals to check certain cases in which is not a valid end of sentence,
in this case, returning 0 indicating that it is not a valid end of sentence.
Otherwise, return 1. This function is used to determine whether to add a 
constructed sentence structure into the sentence array.
*/

validate_period = function(word) {
    if (word.includes("?")) {
        return 1;
    } else if (word.includes("!")) {
        return 1;
    } else if (word.includes("Mr.")) {
        return 0;
    } else if (word.includes("Mrs.")) {
        return 0;
    } else if (word.includes("Ms.")) {
        return 0;
    } else if (word.includes("St.")) {
        return 0;
    } else if (word.includes("Prof.")) {
        return 0;
    } else if (word.includes("Co.")) {
        return 0;
    } else if (word.includes("Apt.")) {
        return 0;
    } else if (word.includes("Ph.")) {
        return 0;
    } else if (word.includes("Dr.")) {
        return 0;
    } else if (word.includes("Jr.")) {
        return 0;
    } else if (word.includes("Blvd.")) {
        return 0;
    } else if (word.includes("Sr.")) {
        return 0;
    }
    /* 
    Checks if the character before the period is uppercase, if yes, then
    return 0. Otherwise, return 1.
    */
    var periodChar = word.indexOf(".");
    periodChar = periodChar - 1;
    var charBeforePeriod = word.charAt(periodChar);
    periodChar = periodChar + 1;
    var charAfterPeriod = word.charAt(periodChar);
    var numberquestion = parseInt(charBeforePeriod);
    var number2question = parseInt(word.charAt(periodChar + 1));
    if (charAfterPeriod == '"') {
        return 2;
    }
    if (numberquestion != NaN && numberquestion < 10) {
        if (number2question != NaN && number2question < 10) {
            return 0;
        }
        return 1;
    }
    if (charBeforePeriod == charBeforePeriod.toUpperCase()) {
        return 0;
    }
    if (periodChar != word.length - 1) {
        return 3;
    }
    return 1;


}

/* 
make_sent first parses article text into a word array. Secondly, analyzes periods
and puts sentences in a sentence array.
*/
make_sent = function(a) {
    /*
    Splitting into array of words based on whitespace.
    */
    var word_array = a.split(" ");
    var sentence_array = [];
    var sentence = "";
    for (word in word_array) {
        /*
        If word does not contain a period, add to sentence and a whitespace.
        */
        if (!word_array[word].includes(".")) {
            if (word_array[word].includes("?") || word_array[word].includes("!")) {
                sentence = sentence + word_array[word];
                sentence_array.push(sentence);
                sentence = "";
            } else {
                sentence = sentence + word_array[word] + " ";
            }
        } else {
        /*
        Otherwise, test validity of sentence. If valid, puts in sentence 
        array and refreshes sentence string. Otherwise continue adding onto
        the sentence.
        */
            var validity = validate_period(word_array[word]);
            if (validity == 1) {
                sentence = sentence + word_array[word];
                sentence_array.push(sentence);
                sentence = "";
            } else if (validity == 2) {
                var periodChar = word_array[word].indexOf(".");
                var afterPeriod = periodChar + 1;
                var with_period = word_array[word].substring(0, afterPeriod+2);
                var second_part = word_array[word].substring(afterPeriod + 2, word_array[word].length);
                sentence = sentence + with_period;
                sentence_array.push(sentence);
                sentence = second_part + " ";
            } else if (validity == 0) {
                sentence = sentence + word_array[word] + " ";
            } else {
                var with_period = word_array[word].substring(0, word_array[word].indexOf(".")+ 1);
                var second_part = word_array[word].substring(word_array[word].indexOf(".") + 1, word_array[word].length)
                sentence = sentence + with_period;
                sentence_array.push(sentence);
                sentence = second_part + " ";
            }
        }
    }
    return sentence_array;
}






var word_map = {};
var add_words = function(sentence_array) { 
    for (var i = 0; i < sentence_array.length; i++) {
        sentence = sentence_array[i];
        words = sentence.split(" ");

        for (var j = 0; j < words.length; j++) {
            word = words[j];
            var newWord = stemmer(removeContraction(word));
            var contraction = newWord.split(" ");

            for (var k = 0; k < contraction.length; k++) {
                nextWord = contraction[k];
                if (nextWord.includes(".")) {
                    if (nextWord.charAt(0) == ".") {
                        nextWord = nextWord.substring(1, nextWord.length);
                    } else {
                        nextWord = nextWord.substring(0, nextWord.length - 1);
                    }
                } else if (nextWord.includes(",")) {
                    if (nextWord.charAt(0) == ",") {
                        nextWord = nextWord.substring(1, nextWord.length);
                    } else {
                        nextWord = nextWord.substring(0, nextWord.length - 1);
                    }
                }
                if (!(nextWord in word_map)) {
                    word_map[nextWord] = 0;
                }
                word_map[nextWord] = word_map[nextWord] + 1;
            }
        }   
    }
}




var norms = ['is', 'and', 'a', 'the', 'that', 'are', 'in', 'an', 'be', 'to', 'of', 'for', 'he', 'she', 'they', 'not', 'as', 'but', 'his', 'her', 'or', 'nor', 'if', 'so', 'its', 'than', 'then', 'were', 'was'];
var title_arr = [];

var clean_title = function(og_title) {
    var title =  og_title.split(" ");//inputted_title.split(" ");

    var title_length = title.length;

    for (var index = 0; index < title.length; index++) {
        var word_seg = title[index];
        if (word_seg.includes(".")) {
            if (word_seg.charAt(0) == ".") {
                title[index] = word_seg.substring(1, word_seg.length);
            } else {
                title[index] = word_seg.substring(0, word_seg.length - 1);
            }
        } else if (word_seg.includes(",")) {
            if (word_seg.charAt(0) == ",") {
                title[index] = word_seg.substring(1, word_seg.length);
            } else {
                title[index] = word_seg.substring(0, word_seg.length - 1);
            }
        }
        title_arr[index] = title[index];  
    }
    return title_arr;
}



var update_score = function() { //applied where?
    for (word in word_map) {
        var def = 1.5;
        if (title_arr.indexOf(word) >= 0) {
            def = 8.0;
        }
        if (norms.indexOf(word) >= 0) {
            def = .25;
        }
        word_map[word] = word_map[word] * def; // what map
    }
}


var sentMap = {};
var sum_sentence = function(sentenceArray) { 
    
    for (var index =0; index < sentenceArray.length; index++) {
        var sum = 0;
        var sent = sentenceArray[index];
        var words = sent.split(" ");
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.includes(".")) {
                if (word.charAt(0) == ".") {
                    words[i] = word.substring(1, word.length);
                } else {
                    words[i] = word.substring(0, word.length - 1);
                }
            } else if (word.includes(",")) {
                if (word.charAt(0) == ",") {
                    words[i] = word.substring(1, word.length);
                } else {
                    words[i] = word.substring(0, word.length - 1);
                }
            }
            if (words[i] in word_map) {
                sum += word_map[words[i]];
            } else {
                if (words[i] in norms) {
                    sum += .5;
                }
                else {
                    sum += 1;
                }
            }
        }
        sentMap[index] = sum;

    }
}



print_final = function(sentenceArray) {
    var sortable = [];
    for (index in sentMap) {
        sortable.push([index, sentMap[index]]);
    }
    sortable.sort(function(a, b) {return b[1] - a[1]}); 
    var i = 0;
    var str = "";
    var overall = [];

    var num = Math.floor(sentenceArray.length * .4);
    if (user_size_pref != 0.0) {
        num = Math.floor(sentenceArray.length * user_size_pref);
    } if (sentenceArray.length <= 10) {
        num = sentenceArray.length;
    }

    summary_count = num;
    for (var k = 0; k < num && k < sortable.length; k++) {
        overall.push(sortable[k][0]);
    }
    overall.sort(function (a, b) { 
    return a - b;
    });
    str = str.concat(sentenceArray[0]);
    str = str.concat(" ");
    for (var j = 0; j < overall.length; j++) {
        if (overall[j] != 0) {
            str = str.concat(sentenceArray[overall[j]]);
            str = str.concat(" ");
        }
    }
    return str;
}


// Splits all contractions from a string, str, and removes any remaining apostrophes
function removeContraction(str) {
    // Irregular
    str = str.replace(/ain't/g, "am not");
    str = str.replace(/can't/g, "can not");
    str = str.replace(/won't/g, "will not");
    str = str.replace(/shan't/g, "shall not");
    str = str.replace(/where'd/g, "where did");
    str = str.replace(/n't/g, " not");
    str = str.replace(/'twas/g, "it was");
    str = str.replace(/ma'am/g, "madam");
    
    // Regular
    str = str.replace(/'d/g, ' would');
    str = str.replace(/'m/g, ' am');
    str = str.replace(/'ll/g, ' will');
    str = str.replace(/'re/g, " are");
    str = str.replace(/'s/g, ''); // No "is" to prevent confusion w/ possessive.
    str = str.replace(/'ve/g, " have");
    str = str.replace(/y'/g, "you ");
    
    // Removes all remaining apostrophes
    str = str.replace(/'/g, '');
    
    return str;
}

var stemmer = (function(){
    var step2list = {
            "ational" : "ate",
            "tional" : "tion",
            "enci" : "ence",
            "anci" : "ance",
            "izer" : "ize",
            "bli" : "ble",
            "alli" : "al",
            "entli" : "ent",
            "eli" : "e",
            "ousli" : "ous",
            "ization" : "ize",
            "ation" : "ate",
            "ator" : "ate",
            "alism" : "al",
            "iveness" : "ive",
            "fulness" : "ful",
            "ousness" : "ous",
            "aliti" : "al",
            "iviti" : "ive",
            "biliti" : "ble",
            "logi" : "log"
        },

        step3list = {
            "icate" : "ic",
            "ative" : "",
            "alize" : "al",
            "iciti" : "ic",
            "ical" : "ic",
            "ful" : "",
            "ness" : ""
        },

        c = "[^aeiou]",          // consonant
        v = "[aeiouy]",          // vowel
        C = c + "[^aeiouy]*",    // consonant sequence
        V = v + "[aeiou]*",      // vowel sequence

        mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
        meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
        mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
        s_v = "^(" + C + ")?" + v;                   // vowel in stem

    return function (w) {
        var     stem,
            suffix,
            firstch,
            re,
            re2,
            re3,
            re4,
            origword = w;

        if (w.length < 3) { return w; }

        firstch = w.substr(0,1);
        if (firstch == "y") {
            w = firstch.toUpperCase() + w.substr(1);
        }

        // Step 1a
        re = /^(.+?)(ss|i)es$/;
        re2 = /^(.+?)([^s])s$/;

        if (re.test(w)) { w = w.replace(re,"$1$2"); }
        else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

        // Step 1b
        re = /^(.+?)eed$/;
        re2 = /^(.+?)(ed|ing)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            re = new RegExp(mgr0);
            if (re.test(fp[1])) {
                re = /.$/;
                w = w.replace(re,"");
            }
        } else if (re2.test(w)) {
            var fp = re2.exec(w);
            stem = fp[1];
            re2 = new RegExp(s_v);
            if (re2.test(stem)) {
                w = stem;
                re2 = /(at|bl|iz)$/;
                re3 = new RegExp("([^aeiouylsz])\\1$");
                re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
                if (re2.test(w)) {  w = w + "e"; }
                else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
                else if (re4.test(w)) { w = w + "e"; }
            }
        }

        // Step 1c
        re = /^(.+?)y$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = new RegExp(s_v);
            if (re.test(stem)) { w = stem + "i"; }
        }

        // Step 2
        re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            suffix = fp[2];
            re = new RegExp(mgr0);
            if (re.test(stem)) {
                w = stem + step2list[suffix];
            }
        }

        // Step 3
        re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            suffix = fp[2];
            re = new RegExp(mgr0);
            if (re.test(stem)) {
                w = stem + step3list[suffix];
            }
        }

        // Step 4
        re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        re2 = /^(.+?)(s|t)(ion)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = new RegExp(mgr1);
            if (re.test(stem)) {
                w = stem;
            }
        } else if (re2.test(w)) {
            var fp = re2.exec(w);
            stem = fp[1] + fp[2];
            re2 = new RegExp(mgr1);
            if (re2.test(stem)) {
                w = stem;
            }
        }

        // Step 5
        re = /^(.+?)e$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = new RegExp(mgr1);
            re2 = new RegExp(meq1);
            re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
            if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
                w = stem;
            }
        }

        re = /ll$/;
        re2 = new RegExp(mgr1);
        if (re.test(w) && re2.test(w)) {
            re = /.$/;
            w = w.replace(re,"");
        }

        // and turn initial Y back to y

        if (firstch == "y") {
            w = firstch.toLowerCase() + w.substr(1);
        }

        return w;
    }
})();



// When the popup HTML has loaded
window.addEventListener('load', function(evt) {

    // Get the event page/background page
    chrome.runtime.getBackgroundPage(function(eventPage) {

        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // content.js into the current tab's HTML.
        eventPage.getPageDetails(selectOrWhole);
    });
});

window.addEventListener("click", myFunction);
