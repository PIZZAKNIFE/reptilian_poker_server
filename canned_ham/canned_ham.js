'use strict';

// this component is useful to demonstrate the meat grinding of pre-determined `hand` sets

const fs = require('fs');

let CannedHamLord = function() {
	let _self = this;
	_self.hamFaces = {
		T: 10,
		J: 11,
		Q: 12,
		K: 13,
		A: 14
	}
	
	_self.hamSuits = ['C', 'S', 'D', 'H'];

	let hamContents = function(cannedPath, options = {} ) {
		let hamsult = fs.fileReadSync(canndedPath);
		return ((options.splitWith === undefined)? hamsult : hamsult.toString().split(options.splitWith);
	}
	
	let hamLineEval = function(line) {
		let playLine = line.split(' ');
		let playSet = playLine.map(elem) {
			let _pair = elem.split('');
			if (_pair.length < 2) {
				return false;
			}
			if (evalFaces(_pair[0] || evalSuits(_pair[1]) {
				return false;
			}
			return _pair;
		}
		return playSet.includes(false)? false : playSet;
	}

	_self.fetchCannedHam(cannedPath, options = {}) {
		// this is the publically exposed canned hamm process
		
	}

	let evalFaces = function(val) {
		return ((val <= 1 || val > 9) || (_self.hamFaces[val] === undefined ))? false : true;	
	}
	let evalSuits = function(val) {
		return _self.hamSuits.includes(val) ? true : false;
	}
	
}

module.exports = CannedHamLord;
