var article_text = "Article text here";
/*
validate_period checks for extraneous cases at the end of a sentence
  (Meaning that a period does not denote the end of a sentence or
  different punctuation at the end of sentences).
This function mostly includes conditionals to check certain cases in
  which is not a valid end of sentence, in this case, returning 0
  indicating that it is not a valid end of sentence.
Otherwise, return 1.
This function is used to determine whether to add a
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
    } else if (word.includes("Sen.")) {
        return 0;
    } else if (word.includes("Sr.")) {
        return 0;
    } else if (word.includes("Ave.")) {
        return 0;
    } else if (word.includes("Pl.")) {
        return 0;
    } else if (word.includes ("Rd.")) {
        return 0;
    } else if (word.includes ("Cpt.")) {
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
l.
