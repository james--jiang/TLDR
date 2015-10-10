var word_map = {};
var add_words = function(sentence_array) { 
    for (sentence in sentence_array) {
		for (word in sentence.split(" ")) {
			var newWord = stemmer(removeContraction(word))
			var contraction = newWord.split(" ")
			for (nextWord in contraction) {
				if (nextWord.includes(".")) {
				    if (nextWord.charAt(0).equals(".")) {
				        nextWord.substring(1, nextWord.length);
				    } else {
				        nextWord.substring(0, nextWord.length - 1);
				    }
				} else if (nextWord.includes(",")) {
				    if (nextWord.charAt(0).equals(",")) {
				        nextWord.substring(1, nextWord.length);
				    } else {
				        nextWord.substring(0, nextWord.length - 1);
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
var title =  "Fahad didnt help on the extension.".split(" ");//inputted_title.split(" ");

var title_length = title.length;
var index = 0;
for (word_seg in title) {
    if (index >= title_length) {
        break;
    }
    if (word_seg.includes(",")) {
        if (word_seg.charAt(0).equals(",")) {
    	    word_seg.substring(1, nextWord.length);
    	} else {
    	    word_seg.substring(0, nextWord.length - 1);
        }
    } else if (word_seg.includes(".")) {
	    if (word_seg.charAt(0).equals(".")) {
	        word_seg.substring(1, nextWord.length);
	    } else {
	        word_seg.substring(0, nextWord.length - 1);
	    }
    }
    title_arr[index] = word_seg;
    index = index + 1;
    
}
return title_arr;
}


var update_score = function(word) { //applied where?
	var def = 1;
	if (title_arr.includes(word)) {
		def = 1.5;
	}
	if (norms.includes(word)) {
		def = .5;
	}
	map[word] = map[word] * def; // what map
}

var sentMap = {};
var sum_sentence = function(sentenceArray) { 
    var index =0;
	for (sent in sentenceArray) {
		var sum = 0;
		var words = sent.split(" ");
		for (word in words) {
			if (word.includes(".")) {
			    if (word.charAt(0).equals(".")) {
			        word.substring(1, nextWord.length);
			    } else {
			        word.substring(0, nextWord.length - 1);
			    }
			} else if (nextWord.includes(",")) {
			    if (word.charAt(0).equals(",")) {
			        word.substring(1, nextWord.length);
			    } else {
			        word.substring(0, nextWord.length - 1);
			    }
			} 
			if (word in word_map) {
				sum += word_map[nextWord];
			} else {
				if (word in norms) {
					sum += .5;
				}
				else {
					sum += 1;
				}
			}
		}
		sentMap[index] = sum;
        index += 1;
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
        i = i + 1;
	}
	return str;
}
	