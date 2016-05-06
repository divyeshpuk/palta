;(function() {

	var arohi = ["S", "R", "G", "M", "P", "D", "N", "S\u2019"],
    	avrohi = ["S\u2019", "N", "D", "P", "M", "G", "R", "S", "\u2018N", "\u2018D", "\u2018P", "\u2018M"];

    var masterPatterns = ['01','001','011','02','002','022','03','003','033','012','0012','0112','0122','024','0024','0224','0244','0123','00123','01123','01223','01233'];
    
    var masterViewPatterns = ['12','112','122','13','113','133','14','114','144','123','1123','1223','1233','135','1135','1335','1355','1234','11234','12234','12334','12344'];
    
    var arAv = [],
    	masterNotes = {},
    	phrase = '',
		phrases = [],
		phrasesAll = [''], 			// empty string on zero index to determine odd or even for arohi, avrohi
		tempPatterns = [], 			// ['01', '10']
		patternsAll = [], 			// [ ['01', '10'], ['001', '010', '100'], ['011', '101', '110'] ]
		tempSplittedPatterns = [], 	// [  [ ['0','1'], ['1','0'] ], ... ]
		viewPatternsAll = [], 		// [ ['12', '21'], ['112', '121', '211'], ['122', '212', '221'] ]
		splittedPatterns = []; 		// [  [ ['0','1'], ['1','0'] ], [ ['0','0','1'], ['0','1','0'], ['1','0','0'] ]  ]

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
        var collect = [],
            indexRange = range(start, end),
            i, 
            len = indexRange.length,
            arrLen = arr.length;
        
        for (i = 0; i < len; i++) {
            collect[i] = arr[ indexRange[i] ];
        }

        arAv.push(collect); 
        collect = [];

        if (end < arrLen - 1) {
           collectNotes(start + 1, end + 1, arr); 
        }
    }

    function buildData() {
        var i, 
        	propNum = 0;
        for (i = 1; i <= 4; i++) {
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

	function replaceAt(str, index, character) {
		var elems = index;
	    return str.substr(0, elems) + character + str.substr(index + character.length);
	}

	function swap(index1, index2, str) { 
	    var strTemp = replaceAt(str, index1, str[index2]),
	    	strNew = replaceAt(strTemp, index2, str[index1]); 
	    return strNew;
	}

	function permute(str, startIndex, endIndex) {
	   	var i, n, strNew;
	   	if (startIndex === endIndex) {
	   		n = tempPatterns.indexOf(str);
	   		if (n === -1) { 
	   		 	tempPatterns.push(str);
	   		}
	   	} else {
	       for (i = startIndex; i <= endIndex; i++) {
	          strNew = swap(startIndex, i, str); 
	          permute(strNew, startIndex + 1, endIndex);
	       }
	   	}
	}

	function splitPatterns() {
		// convert ['01', '10'] into [ ['0','1'], ['1','0'] ]
		var arr = [],
			pattern = '',
			i, j;
		for (i = 0; i < tempPatterns.length; i++) {
			pattern = '';
			var len = tempPatterns[i].length; 
			for (j = 0; j < len; j++) {
				pattern += tempPatterns[i][j] + ' ';
			}
			pattern = pattern.replace(/^\s+|\s+$/gm,'');
			arr = pattern.split(" "); 
			tempSplittedPatterns.push(arr);
		}
	}

	function buildPatterns() {
		var i, j,
	    	patLen = masterPatterns.length,
	    	viewPatLen = masterViewPatterns.length;
	    for (i = 0; i < patLen; i++) {
          	permute(masterPatterns[i], 0, masterPatterns[i].length - 1);
          	splitPatterns();
          	patternsAll[i] = tempPatterns;
          	tempPatterns = [];
          	splittedPatterns[i] = tempSplittedPatterns;
          	tempSplittedPatterns = [];
	    }
	    for (j = 0; j < viewPatLen; j++) {
	        permute(masterViewPatterns[j], 0, masterViewPatterns[j].length - 1);
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

	function checkDuplicate(txt) {
		var str = txt.replace('S',''),
			n = str.indexOf('S');
		return n >= 0 ? { str : str, index : n } : { str : '', index : n };
	}

	function cleanAvrohiNotes (arr) {
		var i, n, obj = {};
		for (i = arr.length - 1; i > 0; i--) {
			obj = checkDuplicate(arr[i]);
			if (obj['str'].length > 0) { 
	    		if ( obj['index'] === obj['str'].length - 1 ) { 
	        		return false; 
	        	} else {
	        		arr.splice(i);
	        	}
	    	} else {
	    		n = arr[i].indexOf('S'); 
	    		if ( n === arr[i].length - 1 ) { 
	         		return false; 
	         	} else {
	         		arr.splice(i);
	         	}
	    	}
		}			
	}

	function buildPhrases() {
		var i, j, k, l, m, n, max, notes,
			len = splittedPatterns.length;
		for (i = 0; i < len; i++) {
			for (j = 0; j < splittedPatterns[i].length; j++) { 
				// get notes data
				max = getRange(splittedPatterns[i]); 
				notes = getData(max);
				for (k = 0; k < notes.length; k++) {
					for (l = 0; l < notes[k].length; l++) {
						for (m = 0; m < splittedPatterns[i][j].length; m++) {
							n = parseInt(splittedPatterns[i][j][m], 10);
							phrase += notes[k][l][n];
						}
						phrases.push(phrase); 
						phrase = ''; 
					}
					if (k % 2 !== 0) {
						cleanAvrohiNotes(phrases);
					}
					phrasesAll.push(phrases);
					phrases = [];
				}
			}
		} 
	}

	function printPalta() {
		var i, j,
			num = 1,
			count = 0,
			len = phrasesAll.length;
		for (i = 1; i < len; i++) { 
			if ( i === 1 || i % 2 !== 0 ) {
				document.getElementById('palta').innerHTML += "<div class='line'></div><div><span>"+ num + ' &#124;' +"</span><span>Pattern: " + viewPatternsAll[count] + "</span></div><div class='title'>Arohi &#8211; Avrohi</div>";
				num++;
				count++;
			}
			document.getElementById('palta').innerHTML += "<div id='notes-" + i + "'></div>";

			for (j = 0; j < phrasesAll[i].length; j++) {
				document.getElementById('notes-' + i).innerHTML += '<span>' + phrasesAll[i][j] + '</span>';
			}
		}
	}
	 
	function init() {
		buildData();
		buildPatterns();
	    viewPatternsAll = tempPatterns;
	    tempPatterns = [];
	    buildPhrases();
		printPalta();
	}

	init(); 

}());