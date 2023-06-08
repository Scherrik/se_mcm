(function(helper) {
'use strict';


helper.areWeTestingWithJest = function() {
    return typeof jest !== 'undefined';
}

// Helper function to determine if a string is empty
helper.isEmpty = function(str){
	return (!str || str.trim().length === 0);
}

helper.createEvent = function(name){
    if(helper.areWeTestingWithJest()){
        return new Event(name, { detail: {} });
    } else {
        return new CustomEvent(name, { detail: {} });
    }
}

})(typeof module !== 'undefined' && module.exports ? module.exports : (self.helper = self.helper || {}));
