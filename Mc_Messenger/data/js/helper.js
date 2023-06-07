(function(helper) {
'use strict';


helper.areWeTestingWithJest = function() {
    return typeof jest !== 'undefined';
}

helper.typeToString = function(id){
	for (const [key, value] of typeMap) {
		if(value == id) return key;
	}
	return "NO TYPE FOUND";
	//return [...typeMap.values()].find(([key,val]) => id == value)[0];
}

helper.bytesToString = function(bytes) {
    var chars = [];
    for(var i = 0, n = bytes.length; i < n;) {
        chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
    }
    return String.fromCharCode.apply(null, chars);
}

// Helper function to determine if a string is empty
helper.isEmpty = function(str){
	return (!str || str.trim().length === 0);
}

// https://codereview.stackexchange.com/a/3589/75693
helper.stringToBytes = function(str) {
    var bytes = [];
    for(var i = 0, n = str.length; i < n; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8, char & 0xFF);
    }
    return bytes;
}


})(typeof module !== 'undefined' && module.exports ? module.exports : (self.helper = self.helper || {}));
