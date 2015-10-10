word_map = {}
add_words = function(sentence_array) { 
	for (sentence in sentence_array) {
		for (word in sentence.split()) {
			var newWord = stemmer(removeContraction(word))
			var contraction = newWord.split(" ")
			for nextWord in contraction {
				(take out period from word )
				if not word_map.contains(nextWord) {
					word_map[nextWord] = 0
				}
				word_map[nextWord] += 1
			}
		}	
	}

}
update_score = function(word) {
	var def = 1
	if (title.contains(word)) {
		def = 1.5;
	}
	if (norms.contains(word)) {
		def = .5
	}
	map[word] *= def
}

sentMap = {}
sum_sentence = function(sentenceArray) { 
	for (sent in sentenceArray) {
		sum = 0
		words = words.split(" ")
		for word in words {
			(take out period, comma)
			if word_map.contains(word) {
				sum += word_map[nextWord]
			} else {
				if norms.contains(word) {
					sum += .75
				}
				else {
					sum += 1
				}
			}
		}
		sentMap[sentenceArray.indexOf(sent)] = sum
	}
}



print_final = function(sentenceArray) {
	var sortable = [];
	for (var index in sentMap)
	      sortable.push([index, sentMap[index]])
	sortable.sort(function(a, b) {return b[1] - a[1]})

	var i = 0
	var str = ""
	while i < input and i < sortable.length {
		str = str.concat((sentenceArray[sortable[i][0]]))
	}
	return str
}
	