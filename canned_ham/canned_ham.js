'use strict';

// this component is useful to demonstrate the meat grinding of pre-determined `hand` sets

const fs = require('fs');

let CannedHamLord = function() {
	let _self = this;
	
	let hamContents = function(cannedPath, options = {} ) {
		let hamsult = fs.fileReadSync(canndedPath);
		return ((options.splitWith === undefined)? hamsult : hamsult.toString().split(options.splitWith);
	}
	
	_self.fetchCannedHam(cannedPath, options = {}) {
		// this is the publically exposed canned hamm process
		
	}
}

