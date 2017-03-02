'use strict';

// this component is useful to demonstrate the meat grinding of pre-determined `hand` sets

const fs = require('fs');

let CannedHamLord = function () {
    let _self = this;
    _self.hamFaces = {
        T: 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 14
    }

    _self.hamSuits = ['C', 'S', 'D', 'H'];

    let hamContents = (cannedPath, options = {}) => {
        let hamsult = fs.fileReadSync(canndedPath);
        return ((options.splitWith === undefined) ? hamsult : hamsult.toString().split(options.splitWith);
    };

    let validateAndValueHam = (line) => {
        let playLine = line.split(' ');

        let playSet = playLine.map((elem) => {
            let _pair = elem.split('');
            if (_pair.length < 2) {
                return false;
            }
            if (evalFaces(_pair[0]) || evalSuits(_pair[1])) {
                return false;
            }
            _pair = totalCard(_pair[0]);
            return _pair;
        });
        if (playSet.includes(false)) {
            return 'Corrupt Ham';
        }
        return playSet;
    }

    let tallyHams = (hamFists) => {
        let hands = [
            hamFists.slice(0, 5).reduce((runningTotal, cardVal) => {
                return runningTotal + cardVal;
            }),
                hamFists.slice(5, 10).reduce((runningTotal, cardVal) => {
                return runningTotal + cardVal;
            })
        ];
        return hands;
    };

    let compareHams = (totalHams) => {
        totalHams = Array.from(new Set(totalHams));
        if (totalHams.length == 1) return null;
        if (totalHams[0] > totalHams[1]) return true;
        return false;
    }

    // @param [String] card is the value of a dealt 'card'
    let totalCard = (card) => {
        return ( typeOf (parseInt(card, 10)) === 'number' )? parseInt(card, 10) : _self.hamFaces[card];
    }

    // this is the publically exposed canned hamm process
    // @param [String] cannedPath is the location of the play record to parse
    // @param [Object<optional>] options contains information on how to parse the play record file
    _self.fetchCannedHam = (cannedPath, options = {}) => {

    }

    let evalFaces = (val) => {
        return ((val <= 1 || val > 9) || (_self.hamFaces[val] === undefined )) ? false : true;
    }
    let evalSuits = (val) => {
        return _self.hamSuits.includes(val) ? true : false;
    }

}

module.exports = CannedHamLord;
