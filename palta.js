;(function() {

	var arohi = ["S", "R", "G", "M", "P", "D", "N", "S\u2019", "R\u2019", "G\u2019", "M\u2019", "P\u2019"];
    var	avrohi = ["S\u2019", "N", "D", "P", "M", "G", "R", "S", "\u2018N", "\u2018D", "\u2018P", "\u2018M"];
    var masterPatterns = ['01','001','011','02','002','022','03','003','033','012','0012','0112','0122', '013','0013','0113','0133', '023','0023','0223','0233']; // '0123','00123','01123','01223','01233' '024','0024','0224','0244'
    var arAv = [];
    var	masterNotes = {};
    var	phrase = '';
	var	phrases = [];
	var	phrasesAll = ['']; 			// empty string on zero index to determine odd or even for arohi, avrohi
	var	masterViewPatterns = [];	// ['12','112','122']
	var	tempPatterns = []; 			// ['01', '10']
	var	patternsAll = []; 			// [ ['01', '10'], ['001', '010', '100'], ['011', '101', '110'] ]
	var	tempSplittedPatterns = []; 	// [  [ ['0','1'], ['1','0'] ], ... ]
	var	viewPatternsAll = []; 		// [ ['12', '21'], ['112', '121', '211'], ['122', '212', '221'] ]
	var	splittedPatterns = []; 		// [  [ ['0','1'], ['1','0'] ], [ ['0','0','1'], ['0','1','0'], ['1','0','0'] ]  ]

    function range(start, end, step) {
        var range = [];
        typeof step == "undefined" && (step = 1);

        if (end < start) {
            step = -step;
        }
        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }
        return range;
    }

    function collectNotes(start, end, arr) {
        var collect = [];
        var indexRange = range(start, end);
        
        for (var i = 0; i < indexRange.length; i++) {
            collect[i] = arr[ indexRange[i] ];
        }

        arAv.push(collect); 
        collect = [];

        if (end < arr.length - 1) {
           collectNotes(start + 1, end + 1, arr); 
        }
    }

    function buildData() {
        var propNum = 0;
        for (var i = 1; i <= 4; i++) {
            collectNotes(0, i, arohi);
            propNum++;
            masterNotes[propNum] = [];
            masterNotes[propNum][0] = arAv;
            arAv = [];
            collectNotes(0, i, avrohi);
            masterNotes[propNum][1] = arAv;
            arAv = [];
        }
    }

    function setMasterViewPatterns() {
    	var pattern, num, str;
    	for (var i = 0; i < masterPatterns.length; i++) {
        	pattern = '';
        	for (var j = 0; j < masterPatterns[i].length; j++) {
        		num = Number(masterPatterns[i][j]) + 1;
        		str = String(num);
        		pattern += str;
        	}
        	masterViewPatterns.push(pattern);
        }
    }

	function replaceAt(str, index, character) {
		var elems = index;
	    return str.substr(0, elems) + character + str.substr(index + character.length);
	}

	function swap(index1, index2, str) { 
	    var strTemp = replaceAt(str, index1, str[index2]);
	    var	strNew = replaceAt(strTemp, index2, str[index1]); 
	    return strNew;
	}

	function permute(str, startIndex, endIndex) {
		var n, strNew;
	   	if (startIndex === endIndex) {
	   		n = tempPatterns.indexOf(str);
	   		if (n === -1) { 
	   		 	tempPatterns.push(str);
	   		}
	   	} else {
	       for (var i = startIndex; i <= endIndex; i++) {
	          strNew = swap(startIndex, i, str); 
	          permute(strNew, startIndex + 1, endIndex);
	       }
	   	}
	}

	function splitPatterns() {
		// convert ['01', '10'] into [ ['0','1'], ['1','0'] ]
		var arr = [];
		var	pattern;
		for (var i = 0; i < tempPatterns.length; i++) {
			pattern = '';
			var len = tempPatterns[i].length; 
			for (var j = 0; j < len; j++) {
				pattern += tempPatterns[i][j] + ' ';
			}
			pattern = pattern.replace(/^\s+|\s+$/gm,'');
			arr = pattern.split(" "); 
			tempSplittedPatterns.push(arr);
		}
	}

	function buildPatterns() {
		for (var i = 0; i < masterPatterns.length; i++) {
          	permute(masterPatterns[i], 0, masterPatterns[i].length - 1);
          	splitPatterns();
          	patternsAll[i] = tempPatterns;
          	tempPatterns = [];
          	splittedPatterns[i] = tempSplittedPatterns;
          	tempSplittedPatterns = [];
	    }
	    for (var i = 0; i < masterViewPatterns.length; i++) {
	        permute(masterViewPatterns[i], 0, masterViewPatterns[i].length - 1);
	    }
	}

	function getMaxOfArray(numArray) {
	  return Math.max.apply(null, numArray);
	}

	function getRange(arr) {
		// arr input [ ['0','1'], ['1','0'] ]
		var max = getMaxOfArray(arr[0]); 
		return max;
	}

	function getData(num) {
		var notes = [];
		switch (num) {
		  case 1:
		  	notes = masterNotes[1];
		    break;
		  case 2:
		    notes = masterNotes[2];
		    break;
		  case 3:
		    notes = masterNotes[3];
		    break;
		  case 4:
		    notes = masterNotes[4];
		    break;
		  default:
		    console.log('default');
		    break;
		}
		return notes;
	}

	function cleanNotesAtEnd(arr) {
		var str;
		for (var i = arr.length - 1; i > 0; i--) {
			str = removeQuotes(arr[i]);
			if (str[str.length - 1] !== 'S') {
				arr.splice(i);
			} else {
				return;
			}
		}
	}

	function removeQuotes(str) {
		var regex1 = /\u2019/g;
		var regex2 = /\u2018/g;
		return str.replace(regex1, '').replace(regex2, '');
	}

	function buildPhrases() {
		var max, notes, n;
		for (var i = 0; i < splittedPatterns.length; i++) {
			for (var j = 0; j < splittedPatterns[i].length; j++) { 
				// get notes data
				max = getRange(splittedPatterns[i]); 
				notes = getData(max);
				for (var k = 0; k < notes.length; k++) {
					for (var l = 0; l < notes[k].length; l++) {
						for (var m = 0; m < splittedPatterns[i][j].length; m++) {
							n = parseInt(splittedPatterns[i][j][m], 10);
							phrase += notes[k][l][n];
						}
						phrases.push(phrase);
						phrase = ''; 
					}
					cleanNotesAtEnd(phrases);
					phrasesAll.push(phrases);
					phrases = [];
				}
			}
		} 
	}

	function printPalta() {
		var num = 1;
		var	count = 0;
		for (var i = 1; i < phrasesAll.length; i++) { 
			if (i === 1 || i % 2 !== 0) {
				document.getElementById('palta').innerHTML += "<div class='line'></div><div><span>"+ num + ' &#124;' +"</span><span>Pattern: " + viewPatternsAll[count] + "</span></div><div class='title'>Arohi &#8211; Avrohi</div>";
				num++;
				count++;
			}
			document.getElementById('palta').innerHTML += "<div id='notes-" + i + "'></div>";

			for (var j = 0; j < phrasesAll[i].length; j++) {
				document.getElementById('notes-' + i).innerHTML += '<span>' + phrasesAll[i][j] + '</span>';
			}
		}
	}
	 
	function init() {
		buildData();
		setMasterViewPatterns();
		buildPatterns();
	    viewPatternsAll = tempPatterns;
	    tempPatterns = [];
	    buildPhrases();
		printPalta();
	}

	init(); 

}());