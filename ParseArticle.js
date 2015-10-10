validate_sent = function(word) {
    if (word.includes("Mr.")) {
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
    var periodChar = word.indexOf(".");
    periodChar = periodChar - 1;
    var charBeforePeriod = word.charAt(periodChar);
    if (charBeforePeriod == charBeforePeriod.toUpperCase()) {
        return 0;
    }
    return 1;
}

make_sent = function(a) {
    var word_array = a.split(" ");
    var array_size = a.split(".").length;  
    var sentence_array = new Array(array_size);
    var sentence = "";
    var count = 0;
    for (word in word_array) {
        if (!word_array[word].includes(".")) {
            sentence = sentence + word_array[word] + " ";
        } else {
            var validity = validate_sent(word_array[word]);
            if (validity != 0) {
                sentence = sentence + word_array[word];
                sentence_array[count] = sentence;
                count = count + 1;
                sentence = "";
                
            } else {
                sentence = sentence + word_array[word] + " ";
                sentence_array[count] = sentence;

            }
        
        }

    }
    return sentence_array;
}
sentence_array = make_sent(article_text);
