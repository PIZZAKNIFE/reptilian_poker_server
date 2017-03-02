'use strict';

// this component is useful to demonstrate the meat grinding of pre-determined `hand` sets

const fs = require('fs');

let CannedHamLord = function () {

    const hamSuits = ['C', 'S', 'D', 'H'];

    const hamFaces = {
        T: 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 14
    }

    const minCardVal = 2;
    const maxCardVal = 9;

    let evalFaces = (val) => !(val <= minCardVal || val > maxCardVal || hamFaces[val] === undefined)

    let evalSuits = (val) => Boolean(hamSuits.includes(val))

    let hamContents = (cannedPath, options = {}) => {
        let hamsult = fs.fileReadSync(canndedPath);

        return options.splitWith === undefined ? hamsult : hamsult.toString().split(options.splitWith);
    };

    let validateAndValueHam = (line) => {
        let playLine = line.split(' ');
        // if we have more or less than 10 "cards" then the hand set is malformed

        if (playLine.length !== 10) {
            return false;
        }
        let playSet = playLine.map((elem) => {
            let _pair = elem.split('');

            if (_pair.length < 2) {
                return false;
            }
            if (evalFaces(_pair[0]) || evalSuits(_pair[1])) {
                return false;
            }
            return _pair;
        });

        if (playSet.includes(false)) {
            return false;
        }
        let hands = [
            playSet.slice(0, playSet.length / 2),
            playSet.slice(playSet.length / 2, playSet.length)
        ]

        // determine the best outcome for each hand.

        let results = [
            determineHandBest(hands[0]),
            determineHandBest(hands[1])
        ];

        return playSet;
    }


    let determinePairsAndSuits = (hand) => {
        var processedCards = {};
        hand.forEach(function (card) {
            console.log(card);
            if (Object.keys(processedCards).includes(card[0])) {
                processedCards[card[0]].occurance += 1;
                if ( typeof processedCards[card[0]].suits[card[1]] === 'undefined') {
                    processedCards[card[0]].suits[card[1]] = { count : 1 };
                } else {
                    processedCards[card[0]].suits[card[1]].count += 1;
                }
            } else {
                processedCards[card[0]] = { occurance: 1, suits : {} } ;
                processedCards[card[0]].suits[card[1]] = { count : 1 };
            }
        }
        return processedCards;
    }


    // @param [String] card is the value of a dealt 'card'
    let cardValue = (card) => typeOf(parseInt(card, 10)) === 'number' ? parseInt(card, 10) : hamFaces[card];

    //Determine the Type of Hand

    let determineHandType = (hand) => {
        // hand == { cardNumber : { occurance : <int>, suits: { cardSuit : <int> } } }
        let pairs = Object.keys(hand).filter((curVal) => {
           return curVal.occurance >= 2;
        });

    }

    let examineForFlush = (hand) => {
        Object.keys(hand).forEach((card) => {
            if (Array.from(new Set(Object.keys(hand[card].suits))).length > 1) { return false ;}
        });
        return true;
    };

    let examineForStraight = (hand) => {
        let finalValue = Object.keys(hand).reduce((acc, nxt, _ary) => {
           if ((acc +1) == parseInt(nxt,10)) { return parseInt(nxt, 10);}
           else {
               return false;
           }
        });
    }



    // this is the publically exposed canned hamm process
    // @param [String] cannedPath is the location of the play record to parse
    // @param [Object<optional>] options contains information on how to parse the play record file
    let fetchCannedHam = (cannedPath, options = {}) => {

    }
}

module.exports = CannedHamLord;
