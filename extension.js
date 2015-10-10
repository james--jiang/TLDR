
/*
Sentence Array parameters are all the same sentence array. First add_words, 
then update_score, then sum_sentence, then print_final.

*/

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
    if (word_seg.includes("!")) {
    	    if (word_seg.charAt(0) == "!") {
    	        title[index] = word_seg.substring(1, word_seg.length);
    	    } else {
    	        title[index] = word_seg.substring(0, word_seg.length - 1);
    	    }
	} if (word_seg.includes("?")) {
	    if (word_seg.charAt(0) == "?") {
	        title[index] = word_seg.substring(1, word_seg.length);
	    } else {
	        title[index] = word_seg.substring(0, word_seg.length - 1);
	    }
    } if (word_seg.includes(",")) {
	    if (word_seg.charAt(0) == ",") {
	        title[index] = word_seg.substring(1, word_seg.length);
	    } else {
	        title[index] = word_seg.substring(0, word_seg.length - 1);
	    }
    } if (word_seg.includes(".")) {
	    if (word_seg.charAt(0) == ".") {
	        title[index] = word_seg.substring(1, word_seg.length);
	    } else {
	        title[index] = word_seg.substring(0, word_seg.length - 1);
	    }
    }
    
    title_arr[index] = title[index];
    
}
return title_arr;
}
title_arr = clean_title("Fahad freaking rocks.");

var update_score = function() { //applied where?
    for (word in word_map) {
        var def = 1;
    	if (title_arr.indexOf(word) >= 0) {
    		def = 1.5;
    	}
    	if (norms.indexOf(word) >= 0) {
    		def = .5;
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

	while (i < 7 && i < sortable.length) {
		str = str.concat((sentenceArray[sortable[i][0]]));
        str = str.concat(" ");
        i = i + 1;
	}
	return str;
}