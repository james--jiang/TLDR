var article_text = "Article text here"; 
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
    if (charBeforePeriod == charBeforePeriod.toUpperCase()) {
        return 0;
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
            if (validity != 0) {
                sentence = sentence + word_array[word];
                sentence_array.push(sentence);
                sentence = "";
                
            } else {
                sentence = sentence + word_array[word] + " ";

            }
        
        }

    }
    return sentence_array;
}
sentence_array = make_sent(article_text);

