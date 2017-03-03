'use strict';

// this component is useful to demonstrate the meat grinding of pre-determined `hand` sets

const readSync = require('fs').readFileSync;

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


    let evalFaces = (val) => {
        if (parseInt(val, 10) >= minCardVal || parseInt(val,10) <= maxCardVal){
            return true;
        } else{
            if (Object.keys(hamFaces).includes(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    let evalSuits = (val) => {
        return hamSuits.includes(val)
    }

    let hamContents = (cannedPath, options = {}) => {
        let hamsult = readSync(cannedPath);

        return hamsult.toString().split('\n').filter((line) => {
            return line.length > 0;
        });
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
                console.log('not long enough');
                return false;
            }
            if (!evalFaces(_pair[0]) || !evalSuits(_pair[1])) {
                return false;
            }
            return _pair;
        });

        if (playSet.includes(false)) {
            console.log(playSet);
        }
        let hands = [
            playSet.slice(0, playSet.length / 2),
            playSet.slice(playSet.length / 2)
        ];
        return hands;
    }


    let determineHandComposure = (hand) => {
        var processedCards = {};
        hand.forEach(function (card) {

            if (Object.keys(processedCards).includes(card[0])) {
                processedCards[card[0]].occurance += 1;
                if (typeof processedCards[card[0]].suits[card[1]] === 'undefined') {
                    processedCards[card[0]].suits[card[1]] = {count: 1};
                } else {
                    processedCards[card[0]].suits[card[1]].count += 1;
                }
            } else {
                processedCards[card[0]] = {occurance: 1, suits: {}};
                processedCards[card[0]].suits[card[1]] = {count: 1};
            }
        });
        return processedCards;
    }


    // @param [String] card is the value of a dealt 'card'
    let cardValue = (card) => typeOf(parseInt(card, 10)) === 'number' ? parseInt(card, 10) : hamFaces[card];

    //Determine the Type of Hand

    let determinePairs = (hand) => {
        // hand == { cardNumber : { occurance : <int>, suits: { cardSuit : <int> } } }
        return Object.keys(hand).filter((curVal) => {
            return curVal.occurance >= 2;
        });

    }

    let examineForFlush = (hand) => {
        let isFlush = true;
        console.log('Hand length:' , Object.keys(hand).length);
        console.log('Hand', hand);
        let suitsInHand = Object.keys(hand).reduce((acc, nxtCard, self) => {
            if (!acc) {
                return acc = false;
            }
            let suitChain = Array.from(new Set(Object.keys(hand[acc].suits)));
            if (suitChain.length > 1) {
                return  acc = false;
            } else {
                return  acc = suitChain.pop());
            }
        });
        console.log(suitsInHand);
            // console.log('card', card);
            // console.log("suits", Object.keys(hand[card].suits));
            // console.log("suits", Array.from(new Set(Object.keys(hand[card].suits))));
            // if (Array.from(new Set(Object.keys(hand[card].suits))).length > 1) {
        //         isFlush = false;
        //         console.log(Object.keys(hand[card].suits));
        //     }
        // });
        // if (!isFlush) { return false;}
        // else {
        //     return Object.keys(hand).reduce((acc, nxt) => {
        //         acc = Object.keys(hamFaces).includes(acc) ? hamFaces[acc] : acc;
        //         nxt = Object.keys(hamFaces).includes(nxt) ? hamFaces[nxt] : nxt;
        //         return Math.max(acc, nxt);
        //     });
        // }
    };

    let examineForStraight = (hand) => {
        return Object.keys(hand).reduce((acc, nxt, _ary) => {
            acc = Object.keys(hamFaces).includes(acc) ? hamFaces[acc] : acc;
            nxt = Object.keys(hamFaces).includes(nxt) ? hamFaces[nxt] : nxt;
            if ((acc + 1) == parseInt(nxt, 10)) {
                return parseInt(nxt, 10);
            }
            else {
                return false;
            }
        });
    }

    let determineHandValue = (hand) => {
        let composedHand = determineHandComposure(hand);
        let hasFlush = examineForFlush(composedHand);
        let hasStraight = examineForStraight(composedHand);
        let hasPairs = determinePairs(composedHand);
        return {
            composedHand,
            flush: hasFlush,
            straight: hasStraight,
            pairs: hasPairs
        }
    };

    // this is the publically exposed canned hamm process
    // @param [String] cannedPath is the location of the play record to parse
    // @param [Object<optional>] options contains information on how to parse the play record file
    this.fetchCannedHam = (cannedPath, options = {}) => {

        let gameLines = hamContents(cannedPath, options);
        let playerOne = 0;
        let playerTwo = 0;

        gameLines.forEach((line) => {

            let gameHands = validateAndValueHam(line);
            gameHands = gameHands.map((hand) =>{
                return determineHandValue(hand);
            });
        });
        // return (JSON.stringify(gameHands));
    }
}

var instance = null;
CannedHamLord.getInstance = function () {
    if (!instance) {
        instance = new CannedHamLord();
    }
    return instance;
};

module.exports = CannedHamLord;
